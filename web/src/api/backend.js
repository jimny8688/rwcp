/**
 * 后端：优先 Supabase Edge Function；本地开发可回退 Express（VITE_API_BASE）
 */
import { parseJsonResponse, apiUrl } from './http.js';

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const USE_SUPABASE = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

const FUNCTION_URL = USE_SUPABASE ? `${SUPABASE_URL}/functions/v1/quiz-api` : '';

function supabaseHeaders(adminToken) {
  const h = {
    'Content-Type': 'application/json',
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`
  };
  if (adminToken) h['X-Admin-Token'] = adminToken;
  return h;
}

async function invoke(action, payload = {}, adminToken = '') {
  if (!USE_SUPABASE) {
    return legacyRequest(action, payload, adminToken);
  }
  const res = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers: supabaseHeaders(adminToken),
    body: JSON.stringify({ action, ...payload })
  });
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('text/csv')) {
    if (!res.ok) throw new Error('导出失败');
    return { __blob: await res.blob() };
  }
  const data = await parseJsonResponse(res);
  if (!res.ok) {
    if (res.status === 401 && action.startsWith('admin.') && action !== 'admin.login') {
      throw new Error('UNAUTHORIZED');
    }
    throw new Error(data.message || '请求失败');
  }
  return data;
}

async function legacyRequest(action, payload, adminToken) {
  const map = {
    'password.verify': () =>
      fetch(apiUrl('/api/password/verify'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: payload.code })
      }),
    'password.start': () =>
      fetch(apiUrl('/api/password/start'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: payload.code })
      }),
    'results.save': () =>
      fetch(apiUrl('/api/results'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }),
    'results.get': () => fetch(apiUrl(`/api/results/${payload.id}`)),
    'admin.login': () =>
      fetch(apiUrl('/api/admin/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: payload.password })
      }),
    'admin.passwords.list': () =>
      fetch(apiUrl('/api/admin/passwords'), {
        headers: { Authorization: `Bearer ${adminToken}` }
      }),
    'admin.passwords.generate': () =>
      fetch(apiUrl('/api/admin/passwords/generate'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(payload)
      }),
    'admin.passwords.patch': () => {
      const { id, ...patch } = payload;
      return fetch(apiUrl(`/api/admin/passwords/${id}`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(patch)
      });
    },
    'admin.passwords.reset': () =>
      fetch(apiUrl(`/api/admin/passwords/${payload.id}/reset`), {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` }
      }),
    'admin.passwords.delete': () =>
      fetch(apiUrl(`/api/admin/passwords/${payload.id}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      }),
    'admin.passwords.export': () => {
      const params = new URLSearchParams();
      if (payload.batchId) params.set('batchId', payload.batchId);
      if (payload.onlyEnabled) params.set('onlyEnabled', '1');
      if (payload.onlyAvailable) params.set('onlyAvailable', '1');
      return fetch(apiUrl(`/api/admin/passwords/export?${params}`), {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
    }
  };
  const fn = map[action];
  if (!fn) throw new Error(`未知 action: ${action}`);
  const res = await fn();
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('text/csv')) {
    if (!res.ok) throw new Error('导出失败');
    return { __blob: await res.blob() };
  }
  const data = await parseJsonResponse(res);
  if (!res.ok) {
    if (res.status === 401) throw new Error('UNAUTHORIZED');
    throw new Error(data.message || '请求失败');
  }
  return data;
}

export { USE_SUPABASE };

export function verifyPassword(code) {
  return invoke('password.verify', { code });
}

export function startTest(code) {
  return invoke('password.start', { code });
}

export function saveResult(payload) {
  return invoke('results.save', {
    passwordCode: payload.passwordCode,
    preAnswers: payload.preAnswers,
    answers: payload.answers,
    result: payload.result
  });
}

export function fetchResult(id) {
  return invoke('results.get', { id });
}

export function adminLogin(password) {
  return invoke('admin.login', { password });
}

export function adminPasswordsList(adminToken) {
  return invoke('admin.passwords.list', {}, adminToken);
}

export function adminPasswordsGenerate(adminToken, payload) {
  return invoke('admin.passwords.generate', payload, adminToken);
}

export function adminPasswordsPatch(adminToken, id, patch) {
  return invoke('admin.passwords.patch', { id, ...patch }, adminToken);
}

export function adminPasswordsReset(adminToken, id) {
  return invoke('admin.passwords.reset', { id }, adminToken);
}

export function adminPasswordsDelete(adminToken, id) {
  return invoke('admin.passwords.delete', { id }, adminToken);
}

export function adminPasswordsExport(adminToken, query) {
  return invoke('admin.passwords.export', query, adminToken);
}
