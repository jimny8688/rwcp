import {
  adminLogin as backendAdminLogin,
  adminPasswordsList,
  adminPasswordsGenerate,
  adminPasswordsPatch,
  adminPasswordsReset,
  adminPasswordsDelete,
  adminPasswordsExport
} from './backend.js';

const TOKEN_KEY = 'citySoulAdminToken';

export function getAdminToken() {
  return sessionStorage.getItem(TOKEN_KEY) || '';
}

export function setAdminToken(token) {
  if (token) sessionStorage.setItem(TOKEN_KEY, token);
  else sessionStorage.removeItem(TOKEN_KEY);
}

export async function adminLogin(password) {
  const data = await backendAdminLogin(password);
  if (!data.ok) throw new Error(data.message || '登录失败');
  setAdminToken(data.token);
  return data;
}

export function adminLogout() {
  setAdminToken('');
  return Promise.resolve({ ok: true });
}

export function fetchPasswords() {
  return adminPasswordsList(getAdminToken());
}

export function generatePasswords(payload) {
  return adminPasswordsGenerate(getAdminToken(), payload);
}

export function patchPassword(id, patch) {
  return adminPasswordsPatch(getAdminToken(), id, patch);
}

export function resetPassword(id) {
  return adminPasswordsReset(getAdminToken(), id);
}

export function deletePassword(id) {
  return adminPasswordsDelete(getAdminToken(), id);
}

export async function downloadPasswordExport(query = {}) {
  const data = await adminPasswordsExport(getAdminToken(), query);
  if (data.__blob) return data.__blob;
  throw new Error('导出失败');
}
