import crypto from 'crypto';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'citysoul-admin';
const TOKEN_TTL_MS = 12 * 60 * 60 * 1000;
const sessions = new Map();

function signToken() {
  const token = crypto.randomBytes(24).toString('hex');
  sessions.set(token, Date.now() + TOKEN_TTL_MS);
  return token;
}

export function verifyAdminLogin(password) {
  if (String(password) !== ADMIN_PASSWORD) return null;
  return signToken();
}

export function requireAdmin(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  const exp = sessions.get(token);
  if (!exp || Date.now() > exp) {
    if (token) sessions.delete(token);
    return res.status(401).json({ ok: false, message: '未登录或登录已过期' });
  }
  sessions.set(token, Date.now() + TOKEN_TTL_MS);
  next();
}

export function revokeAdminToken(token) {
  sessions.delete(token);
}
