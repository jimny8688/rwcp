import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { readStore, writeStore } from './store.js';

const CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function normalizeCode(code) {
  return String(code || '').trim().toUpperCase();
}

function migratePasswords(store) {
  let changed = false;
  for (const p of store.passwords) {
    if (!p.id) {
      p.id = uuidv4();
      changed = true;
    }
    if (!p.createdAt) {
      p.createdAt = new Date().toISOString();
      changed = true;
    }
    if (p.batchId === undefined) {
      p.batchId = null;
      changed = true;
    }
    if (p.note === undefined) {
      p.note = '';
      changed = true;
    }
  }
  if (changed) writeStore(store);
}

export function listAllPasswords() {
  const store = readStore();
  migratePasswords(store);
  return store.passwords.map(formatRow);
}

function formatRow(p) {
  const remaining = Math.max(0, p.maxAttempts - p.usedAttempts);
  return {
    id: p.id,
    code: p.code,
    maxAttempts: p.maxAttempts,
    usedAttempts: p.usedAttempts,
    remaining,
    enabled: p.enabled,
    createdAt: p.createdAt,
    batchId: p.batchId,
    note: p.note || ''
  };
}

function existingCodesSet(store) {
  return new Set(store.passwords.map((p) => normalizeCode(p.code)));
}

function randomCode(length = 8, prefix = '') {
  let body = '';
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    body += CHARSET[bytes[i] % CHARSET.length];
  }
  const pre = prefix ? `${normalizeCode(prefix)}-` : '';
  return `${pre}${body}`;
}

export function generatePasswordBatch({ count = 10, maxAttempts = 3, prefix = '', note = '' } = {}) {
  const store = readStore();
  migratePasswords(store);
  const codes = existingCodesSet(store);
  const batchId = `B${Date.now().toString(36).toUpperCase()}`;
  const created = [];
  const n = Math.min(Math.max(1, Number(count) || 10), 500);

  while (created.length < n) {
    let code = randomCode(8, prefix);
    let tries = 0;
    while (codes.has(code) && tries < 20) {
      code = randomCode(8, prefix);
      tries++;
    }
    if (codes.has(code)) continue;
    codes.add(code);
    const entry = {
      id: uuidv4(),
      code,
      maxAttempts: Math.max(1, Number(maxAttempts) || 3),
      usedAttempts: 0,
      enabled: true,
      createdAt: new Date().toISOString(),
      batchId,
      note: note || ''
    };
    store.passwords.push(entry);
    created.push(formatRow(entry));
  }
  writeStore(store);
  return { batchId, items: created };
}

export function updatePasswordById(id, patch) {
  const store = readStore();
  migratePasswords(store);
  const entry = store.passwords.find((p) => p.id === id);
  if (!entry) return null;

  if (patch.enabled !== undefined) entry.enabled = Boolean(patch.enabled);
  if (patch.maxAttempts !== undefined) {
    entry.maxAttempts = Math.max(1, Number(patch.maxAttempts) || 3);
  }
  if (patch.usedAttempts !== undefined) {
    entry.usedAttempts = Math.max(0, Number(patch.usedAttempts) || 0);
  }
  if (patch.note !== undefined) entry.note = String(patch.note).slice(0, 200);

  writeStore(store);
  return formatRow(entry);
}

export function resetPasswordAttempts(id) {
  return updatePasswordById(id, { usedAttempts: 0 });
}

export function deletePasswordById(id) {
  const store = readStore();
  migratePasswords(store);
  const idx = store.passwords.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  store.passwords.splice(idx, 1);
  writeStore(store);
  return true;
}

export function exportPasswordsCsv({ batchId, onlyEnabled, onlyAvailable } = {}) {
  let rows = listAllPasswords();
  if (batchId) rows = rows.filter((r) => r.batchId === batchId);
  if (onlyEnabled) rows = rows.filter((r) => r.enabled);
  if (onlyAvailable) rows = rows.filter((r) => r.remaining > 0);

  const header = ['密码', '最大次数', '已用次数', '剩余次数', '状态', '批次ID', '创建时间', '备注'];
  const lines = [header.join(',')];
  for (const r of rows) {
    lines.push(
      [
        r.code,
        r.maxAttempts,
        r.usedAttempts,
        r.remaining,
        r.enabled ? '可用' : '停用',
        r.batchId || '',
        r.createdAt,
        `"${(r.note || '').replace(/"/g, '""')}"`
      ].join(',')
    );
  }
  return '\ufeff' + lines.join('\n');
}

export function getBatchIds() {
  const rows = listAllPasswords();
  const set = new Set(rows.map((r) => r.batchId).filter(Boolean));
  return [...set].sort().reverse();
}
