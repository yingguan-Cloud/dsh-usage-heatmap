// Durable per-session daily archive. It stores only aggregated numbers per day
// (never message text, tool arguments, or raw events), so a conversational
// delete cannot rewrite history that was already observed.
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';

export const STORE_VERSION = 1;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const FIELDS = ['sessions', 'input', 'output', 'cacheRead', 'cacheWrite', 'total', 'reasoning'];
const STATE_FILE_NAME = 'usage-heatmap-state.json';

const count = value => Number.isFinite(value) && value > 0 ? Math.round(value) : 0;

/** Keep only well-formed numeric day rows, sorted by date. */
export function normalizeRows(rows) {
  if (!Array.isArray(rows)) return [];
  const out = [];
  for (const row of rows) {
    if (!row || typeof row !== 'object' || typeof row.date !== 'string' || !DATE.test(row.date)) continue;
    const normalized = { date: row.date };
    for (const field of FIELDS) normalized[field] = count(row[field]);
    out.push(normalized);
  }
  return out.sort((left, right) => left.date.localeCompare(right.date));
}

/** Parse an archive file body into a Map of session id -> { createdAt, rows }. */
export function parseStore(text) {
  const sessions = new Map();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('usage-heatmap archive is not valid JSON');
  }
  if (!data || typeof data !== 'object' || data.version !== STORE_VERSION ||
      !data.sessions || typeof data.sessions !== 'object' || Array.isArray(data.sessions)) {
    return sessions;
  }
  for (const [id, value] of Object.entries(data.sessions)) {
    if (typeof id !== 'string' || id.length === 0 || !value || typeof value !== 'object') continue;
    const rows = normalizeRows(value.rows);
    if (rows.length === 0) continue;
    sessions.set(id, {
      createdAt: Number.isFinite(value.createdAt) ? value.createdAt : 0,
      rows,
    });
  }
  return sessions;
}

/** Serialize the in-memory session table; deterministic order keeps diffs stable. */
export function serializeStore(sessions, now = Date.now()) {
  const out = { version: STORE_VERSION, updatedAt: now, sessions: {} };
  for (const [id, value] of [...sessions.entries()].sort(([left], [right]) => left.localeCompare(right))) {
    const rows = normalizeRows(value?.rows);
    if (typeof id !== 'string' || id.length === 0 || rows.length === 0) continue;
    out.sessions[id] = {
      createdAt: Number.isFinite(value.createdAt) ? value.createdAt : 0,
      rows,
    };
  }
  return JSON.stringify(out);
}

/** Resolve the archive path: config override, then the active profile, then DSH home. */
export function defaultStateFile(ctx, config = {}) {
  if (typeof config.stateFile === 'string' && config.stateFile.trim() !== '') return config.stateFile.trim();
  let profileDir;
  try {
    profileDir = ctx?.get?.('profileContext')?.dir;
  } catch {
    profileDir = undefined;
  }
  if (typeof profileDir === 'string' && profileDir.length > 0) return join(profileDir, STATE_FILE_NAME);
  const home = typeof process.env.DSH_HOME === 'string' && process.env.DSH_HOME.trim() !== ''
    ? process.env.DSH_HOME.trim()
    : join(homedir(), '.dsh');
  return join(home, STATE_FILE_NAME);
}

/** Read the archive; a missing file is an empty archive, any other failure is thrown. */
export async function readStore(file) {
  let text;
  try {
    text = await readFile(file, 'utf8');
  } catch (error) {
    if (error?.code === 'ENOENT') return new Map();
    throw error;
  }
  return parseStore(text);
}

/** Write the archive atomically through a sibling temp file. */
export async function writeStore(file, sessions) {
  const text = serializeStore(sessions);
  await mkdir(dirname(file), { recursive: true });
  const temp = `${file}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(temp, text, 'utf8');
  try {
    await rename(temp, file);
  } catch (error) {
    // Windows may refuse a replace in rare cases; the direct write still keeps
    // the archive consistent, then the temp file is removed.
    await writeFile(file, text, 'utf8');
    await rm(temp, { force: true }).catch(() => {});
    void error;
  }
}