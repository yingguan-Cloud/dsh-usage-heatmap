import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createReader } from '../index.js';
import { parseStore, serializeStore, normalizeRows, defaultStateFile } from '../store.js';

const usage = (input, output, cacheRead = 0, cacheWrite = 0) => ({
  inputTokens: input, outputTokens: output, cacheReadTokens: cacheRead, cacheWriteTokens: cacheWrite,
  reasoningTokens: output,
});
const DAY1 = Date.parse('2026-11-10T06:00:00Z');
const DAY2 = Date.parse('2026-11-11T06:00:00Z');
const event = (seq, type, data, time = DAY1) => ({ seq, type, data, time });

const session = (id, createdAt, events) => ({ header: { id, createdAt }, events });

const A = session('session-a', DAY1, [
  event(0, 'assistant/message', { turn: 1, step: 1, usage: usage(10, 5) }, DAY1),
  event(1, 'assistant/message', { turn: 2, step: 1, usage: usage(20, 10) }, DAY2),
]);
const B = session('session-b', DAY1, [
  event(0, 'assistant/message', { turn: 1, step: 1, usage: usage(7, 3) }, DAY1),
]);

function makeContext(records) {
  return {
    sessionQuery: {
      async listSessions() {
        return records.map(row => ({ header: { ...row.header }, live: false, persisted: true }));
      },
      async observeSession(id) {
        const row = records.find(candidate => candidate.header.id === id);
        if (!row) throw new Error(`missing session ${id}`);
        return {
          header: { ...row.header },
          events: row.events,
          inheritedEventCount: 0,
          cursor: row.events.length,
          [Symbol.dispose]() {},
        };
      },
    },
  };
}

const scratch = async t => {
  const dir = await mkdtemp(join(tmpdir(), 'usage-heatmap-'));
  t.after(() => rm(dir, { recursive: true, force: true }));
  return join(dir, 'state.json');
};

test('deleting a session after it was observed keeps its history', async t => {
  const stateFile = await scratch(t);
  const records = [A, B];
  const ctx = makeContext(records);
  const reader = createReader(ctx, { stateFile, timeZone: 'Asia/Shanghai' });
  const before = await reader.readDaily({ from: '2026-11-10', to: '2026-11-11' });
  assert.equal(before.totals.sessions, 3);
  assert.equal(before.totals.total, 55);
  assert.equal(before.archived, 0);
  await reader.dispose();

  records.splice(1, 1); // the user deletes session-b
  const after = await createReader(ctx, { stateFile, timeZone: 'Asia/Shanghai' })
    .readDaily({ from: '2026-11-10', to: '2026-11-11' });
  assert.equal(after.totals.sessions, 3);
  assert.equal(after.totals.total, 55);
  assert.equal(after.days.find(row => row.date === '2026-11-10').sessions, 2);
  assert.equal(after.archived, 1);
});

test('a disposal snapshot counts a session that was never read before deletion', async t => {
  const stateFile = await scratch(t);
  const records = [];
  const ctx = makeContext(records);
  const reader = createReader(ctx, { stateFile, timeZone: 'Asia/Shanghai' });
  reader.capture({ header: B.header, ownEvents: () => B.events, inheritedEventCount: 0, seq: B.events.length });
  await reader.dispose();

  const result = await createReader(ctx, { stateFile, timeZone: 'Asia/Shanghai' })
    .readDaily({ from: '2026-11-10', to: '2026-11-11' });
  assert.equal(result.totals.sessions, 1);
  assert.equal(result.totals.total, 10);
  assert.equal(result.archived, 1);
});

test('keepDeleted false keeps the old live-only behavior', async t => {
  const stateFile = await scratch(t);
  const records = [A, B];
  const ctx = makeContext(records);
  const reader = createReader(ctx, { stateFile, timeZone: 'Asia/Shanghai', keepDeleted: false });
  const before = await reader.readDaily({ from: '2026-11-10', to: '2026-11-11' });
  assert.equal(before.totals.total, 55);
  records.splice(1, 1);
  const after = await reader.readDaily({ from: '2026-11-10', to: '2026-11-11' });
  assert.equal(after.totals.sessions, 2);
  assert.equal(after.totals.total, 45);
  await assert.rejects(readFile(stateFile, 'utf8'));
  await reader.dispose();
});

test('archive rows survive serialization and reject malformed values', () => {
  const sessions = new Map([
    ['a', { createdAt: DAY1, rows: [
      { date: '2026-11-11', sessions: 1, input: 20, output: 10, cacheRead: 0, cacheWrite: 0, total: 30, reasoning: 10 },
      { date: '2026-11-10', sessions: 1, input: 10.4, output: -2, cacheRead: 3, cacheWrite: 0, total: 13, reasoning: 0 },
      { date: 'not-a-day', sessions: 9 },
    ] }],
  ]);
  const parsed = parseStore(serializeStore(sessions));
  assert.deepEqual([...parsed.keys()], ['a']);
  assert.deepEqual(parsed.get('a').rows.map(row => row.date), ['2026-11-10', '2026-11-11']);
  assert.deepEqual(parsed.get('a').rows[0], {
    date: '2026-11-10', sessions: 1, input: 10, output: 0, cacheRead: 3, cacheWrite: 0, total: 13, reasoning: 0,
  });
  assert.equal(parseStore('{"version":99,"sessions":{}}').size, 0);
  assert.throws(() => parseStore('nope'), /not valid JSON/);
  assert.deepEqual(normalizeRows(null), []);
});

test('archive path prefers config, then the active profile', () => {
  assert.equal(defaultStateFile({ get: () => ({ dir: 'C:\\profile' }) }, {}), join('C:\\profile', 'usage-heatmap-state.json'));
  assert.equal(defaultStateFile({ get: () => undefined }, { stateFile: ' D:\\custom.json ' }), 'D:\\custom.json');
});