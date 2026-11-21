// Derived, privacy-preserving rollup: no message text, credentials, or raw events are stored.
export function dayKey(ms, timeZone = 'Asia/Shanghai') {
  return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(ms));
}
const num = value => Number.isFinite(value) && value >= 0 ? value : 0;
export function usageOf(value) {
  if (!value || typeof value !== 'object') return null;
  const input = num(value.inputTokens);
  const output = num(value.outputTokens);
  const cacheRead = num(value.cacheReadTokens);
  const cacheWrite = num(value.cacheWriteTokens);
  const total = input + output + cacheRead + cacheWrite;
  return { input, output, cacheRead, cacheWrite, total, reasoning: num(value.reasoningTokens) };
}
function lastStreamUsage(stream) {
  if (!Array.isArray(stream)) return null;
  let found = null;
  for (const row of stream) if (row?.type === 'chunk' && row.chunk?.type === 'usage') found = row.chunk.usage;
  return found;
}
function empty(date) {
  return { date, sessions: 0, input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0, reasoning: 0 };
}
function add(day, usage) {
  for (const key of ['input', 'output', 'cacheRead', 'cacheWrite', 'total', 'reasoning']) day[key] += usage[key];
}
function subtract(day, usage) {
  for (const key of ['input', 'output', 'cacheRead', 'cacheWrite', 'total', 'reasoning']) day[key] -= usage[key];
}
/** Fold a single Session's OWN events. Fork-inherited prefix is deliberately excluded. */
export function rollupSession(header, events, inheritedEventCount = 0, timeZone = 'Asia/Shanghai') {
  const days = new Map();
  const get = date => {
    if (!days.has(date)) days.set(date, empty(date));
    return days.get(date);
  };
  const active = new Set();
  if (Number.isFinite(header?.createdAt)) active.add(dayKey(header.createdAt, timeZone));
  const slots = new Map();
  for (const event of events) {
    if (!event || event.seq < inheritedEventCount || !Number.isFinite(event.time)) continue;
    const date = dayKey(event.time, timeZone);
    active.add(date);
    const data = event.data || {};
    if (event.type === 'llm/retry-started') {
      // A new transport attempt has its own cost; don't replace an earlier attempt.
      slots.delete(`${data.turn}:${data.step}`);
      continue;
    }
    if (event.type === 'assistant/message' || event.type === 'assistant/attempt') {
      const usage = usageOf(data.usage || lastStreamUsage(data.stream));
      if (!usage) continue;
      const key = `${data.turn}:${data.step}`;
      const previous = slots.get(key);
      if (previous) subtract(get(previous.date), previous.usage);
      add(get(date), usage);
      slots.set(key, { date, usage });
    } else if (event.type === 'compaction/summary') {
      const usage = usageOf(data.usage);
      if (usage) add(get(date), usage);
    }
  }
  for (const date of active) get(date).sessions = 1;
  return [...days.values()].sort((a, b) => a.date.localeCompare(b.date));
}
export function summarizeDaily(rows) {
  const summary = { sessions: 0, input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0, reasoning: 0 };
  for (const row of rows) for (const key of Object.keys(summary)) summary[key] += row[key] || 0;
  return summary;
}

export function mergeDaily(rollups, from, to) {
  const days = new Map();
  for (const rows of rollups) for (const row of rows) {
    if (row.date < from || row.date > to) continue;
    if (!days.has(row.date)) days.set(row.date, empty(row.date));
    const target = days.get(row.date);
    target.sessions += row.sessions;
    add(target, row);
  }
  return [...days.values()].sort((a, b) => a.date.localeCompare(b.date));
}
