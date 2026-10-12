/** 构建带 GitHub Pages base 的站内路径 */
export function resolveAppPath(path) {
  const base = import.meta.env.BASE_URL || '/';
  const clean = String(path || '').replace(/^\//, '');
  return `${base}${clean}`;
}

export function absoluteAppUrl(path) {
  if (typeof window === 'undefined') return resolveAppPath(path);
  const rel = resolveAppPath(path);
  return new URL(rel, window.location.origin).href;
}
