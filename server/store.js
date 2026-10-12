import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORE_PATH = path.join(__dirname, 'data', 'store.json');

const DEFAULT_STORE = {
  passwords: [
    { code: 'DEMO2026', maxAttempts: 3, usedAttempts: 0, enabled: true },
    { code: 'CHENGDOU', maxAttempts: 3, usedAttempts: 0, enabled: true }
  ],
  results: {}
};

function ensureStore() {
  const dir = path.dirname(STORE_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(STORE_PATH)) {
    fs.writeFileSync(STORE_PATH, JSON.stringify(DEFAULT_STORE, null, 2), 'utf8');
  }
}

export function readStore() {
  ensureStore();
  return JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
}

export function writeStore(data) {
  ensureStore();
  fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf8');
}

export function findPassword(code) {
  const store = readStore();
  const normalized = String(code || '').trim().toUpperCase();
  return store.passwords.find((p) => p.code.toUpperCase() === normalized && p.enabled);
}

export function consumeAttempt(code) {
  const store = readStore();
  const normalized = String(code || '').trim().toUpperCase();
  const entry = store.passwords.find((p) => p.code.toUpperCase() === normalized);
  if (!entry) return { ok: false, error: 'INVALID_PASSWORD' };
  if (!entry.enabled) return { ok: false, error: 'INVALID_PASSWORD' };
  if (entry.usedAttempts >= entry.maxAttempts) {
    return { ok: false, error: 'NO_ATTEMPTS', remaining: 0 };
  }
  entry.usedAttempts += 1;
  writeStore(store);
  return {
    ok: true,
    remaining: entry.maxAttempts - entry.usedAttempts,
    maxAttempts: entry.maxAttempts
  };
}

export function getRemainingAttempts(code) {
  const entry = findPassword(code);
  if (!entry) return null;
  return entry.maxAttempts - entry.usedAttempts;
}

export function saveResult(payload) {
  const store = readStore();
  store.results[payload.id] = {
    ...payload,
    createdAt: new Date().toISOString()
  };
  writeStore(store);
  return payload.id;
}

export function getResult(id) {
  const store = readStore();
  return store.results[id] || null;
}
