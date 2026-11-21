import Schema from '@deepseek-ai/schemastery';
import { dayKey, mergeDaily, rollupSession, summarizeDaily } from './rollup.js';

export const name = 'usage-heatmap';
export const inject = ['sessionQuery'];
export const Config = Schema.object({
  defaultMetric: Schema.union(['sessions', 'tokens']).default('sessions'),
  rangeMonths: Schema.number().min(1).max(24).default(12),
  weekStart: Schema.union([0, 1]).default(0),
  scale: Schema.union(['quantile', 'fixed']).default('quantile'),
  theme: Schema.union(['auto', 'dark', 'light']).default('auto'),
  backfill: Schema.boolean().default(true),
  timeZone: Schema.string().default('Asia/Shanghai'),
});

const ROUTE = '/api/dsh-usage-heatmap';
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const EMPTY_DAY = { sessions: 0, input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0, reasoning: 0 };
const dateOffset = (date, days) => {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
};
const json = (value, status = 200) => new Response(JSON.stringify(value), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' },
});

export function apply(ctx, config) {
  const timeZone = config.timeZone || 'Asia/Shanghai';
  const cache = new Map();
  let generation = 0;

  async function readDaily({ from, to, day }) {
    if (!DATE.test(from) || !DATE.test(to) || from > to ||
        Date.parse(to) - Date.parse(from) > 25 * 366 * 86400000) throw new Error('Invalid date range');
    const records = await ctx.sessionQuery.listSessions();
    const ids = new Set(records.map(row => row.header.id));
    for (const id of cache.keys()) if (!ids.has(id)) cache.delete(id);
    const now = Date.now();
    const cutoff = Date.parse(`${to}T23:59:59Z`);
    const cutoffStart = Date.parse(`${from}T00:00:00Z`);
    const recent = config.backfill !== false;
    const inRange = records.filter(row => recent
      ? row.header.createdAt <= cutoff
      : row.live || row.header.createdAt >= cutoffStart);
    let errors = 0;
    for (const row of inRange) {
      const id = row.header.id;
      const prior = cache.get(id);
      if (prior && !row.live && now - prior.checked < 600000) continue;
      if (prior && row.live && now - prior.checked < 30000) continue;
      let observation;
      try {
        observation = await ctx.sessionQuery.observeSession(id, { projectionMode: 'none' });
        if (prior && prior.seq === observation.cursor) { prior.checked = now; continue; }
        const rows = rollupSession(observation.header, observation.events, observation.inheritedEventCount, timeZone);
        cache.set(id, { rows, seq: observation.cursor, checked: now });
      } catch {
        errors += 1;
      } finally {
        observation?.[Symbol.dispose]?.();
      }
    }
    const rollups = [...cache.values()].map(value => value.rows);
    const days = mergeDaily(rollups, from, to);
    const totals = { ...EMPTY_DAY };
    for (const row of days) for (const key of Object.keys(totals)) totals[key] += row[key];
    const todayDate = dayKey(now, timeZone);
    const today = { date: todayDate, ...EMPTY_DAY, ...summarizeDaily(mergeDaily(rollups, todayDate, todayDate)) };
    const periods = {};
    for (const [key, daysBack] of [['today', 0], ['days7', 6], ['days15', 14], ['days30', 29]]) {
      const fromDate = dateOffset(todayDate, -daysBack);
      periods[key] = { from: fromDate, to: todayDate, ...summarizeDaily(mergeDaily(rollups, fromDate, todayDate)) };
    }
    const sessions = DATE.test(day ?? '') && day >= from && day <= to
      ? inRange
        .filter(record => cache.get(record.header.id)?.rows
          .some(row => row.date === day && (row.sessions > 0 || row.total > 0)))
        .slice(0, 100)
        .map(record => ({ id: record.header.id, createdAt: record.header.createdAt }))
      : [];
    return {
      days, totals, today, periods, sessions, errors,
      settings: {
        defaultMetric: config.defaultMetric || 'sessions',
        rangeMonths: config.rangeMonths || 12,
        weekStart: config.weekStart ?? 0,
        scale: config.scale || 'quantile',
        theme: config.theme || 'auto',
        timeZone,
      },
      generation: ++generation,
      refreshedAt: now,
    };
  }

  async function handle(request) {
    try {
      const url = new URL(request.url);
      return json(await readDaily({
        from: url.searchParams.get('from') ?? '',
        to: url.searchParams.get('to') ?? '',
        day: url.searchParams.get('day') ?? undefined,
      }));
    } catch (error) {
      return json({ error: String(error?.message || error) }, 400);
    }
  }

  ctx.inject(['connection'], connectionCtx => {
    if (typeof connectionCtx.connection?.fetch?.register !== 'function') return;
    connectionCtx.effect(() => connectionCtx.connection.fetch.register({
      path: ROUTE, methods: ['GET'], requestBody: 'buffered', fetch: handle,
    }), `usage-heatmap: ${ROUTE}`);
  });

  ctx.inject(['tools'], toolCtx => {
    toolCtx.effect(() => toolCtx.tools.register({
      name: 'usage_report',
      description: 'Report the local agent token and session usage for a date range (defaults to the current month), including today\u2019s token total. Reads local session logs only.',
      parameters: {
        type: 'object',
        properties: {
          from: { type: 'string', description: 'First day, YYYY-MM-DD.' },
          to: { type: 'string', description: 'Last day, YYYY-MM-DD.' },
        },
        additionalProperties: false,
      },
      output: {
        schema: {
          type: 'object',
          properties: {
            from: { type: 'string' }, to: { type: 'string' },
            days: { type: 'integer' }, sessions: { type: 'integer' },
            totals: { type: 'object', properties: {
              input: { type: 'integer' }, output: { type: 'integer' },
              cacheRead: { type: 'integer' }, cacheWrite: { type: 'integer' },
              total: { type: 'integer' },
            } },
            today: { type: 'object', properties: {
              date: { type: 'string' }, sessions: { type: 'integer' },
              tokens: { type: 'integer' }, input: { type: 'integer' }, output: { type: 'integer' },
              cacheRead: { type: 'integer' }, cacheWrite: { type: 'integer' },
            } },
            periods: { type: 'object', properties: {
              today: { type: 'object' }, days7: { type: 'object' },
              days15: { type: 'object' }, days30: { type: 'object' },
            } },
            topDays: { type: 'array', items: { type: 'object', properties: {
              date: { type: 'string' }, sessions: { type: 'integer' }, tokens: { type: 'integer' },
            } } },
            errors: { type: 'integer' },
          },
        },
        render: (_args, value) => [{ type: 'text', text: JSON.stringify(value) }],
      },
      async execute(args) {
        const pad = n => String(n).padStart(2, '0');
        const now = new Date();
        const defaultTo = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
        const to = args?.to ?? defaultTo;
        const from = args?.from ?? `${to.slice(0, 7)}-01`;
        const result = await readDaily({ from, to });
        const { totals, today } = result;
        return {
          from, to,
          days: result.days.length,
          sessions: totals.sessions,
          totals: {
            input: totals.input, output: totals.output,
            cacheRead: totals.cacheRead, cacheWrite: totals.cacheWrite, total: totals.total,
          },
          today: {
            date: today.date, sessions: today.sessions, tokens: today.total,
            input: today.input, output: today.output,
            cacheRead: today.cacheRead, cacheWrite: today.cacheWrite,
          },
          periods: Object.fromEntries(Object.entries(result.periods).map(([key, period]) => [key, {
            from: period.from, to: period.to, sessions: period.sessions, tokens: period.total,
          }])),
          topDays: result.days.slice().sort((a, b) => b.total - a.total).slice(0, 5)
            .filter(row => row.total > 0)
            .map(row => ({ date: row.date, sessions: row.sessions, tokens: row.total })),
          errors: result.errors,
        };
      },
    }), 'usage-heatmap: usage_report tool');
  });

  console.info('[usage-heatmap] loaded');
}
