/** 开发环境走 Vite 代理；也可在 .env 设置 VITE_API_BASE=http://127.0.0.1:3001 */
export const API_BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');

export function apiUrl(path) {
  return `${API_BASE}${path}`;
}

export async function parseJsonResponse(res) {
  const contentType = res.headers.get('content-type') || '';
  const text = await res.text();

  if (!contentType.includes('application/json')) {
    const trimmed = text.trimStart();
    if (trimmed.startsWith('<!DOCTYPE') || trimmed.startsWith('<html')) {
      throw new Error(
        '后端 API 未正确响应（收到了网页而不是 JSON）。请在项目根目录执行 npm run dev，并确保 3001 端口服务已启动。'
      );
    }
    throw new Error(text.slice(0, 160) || `HTTP ${res.status}`);
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error('服务器返回了无效的 JSON');
  }
}
