import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import {
  findPassword,
  consumeAttempt,
  getRemainingAttempts,
  saveResult,
  getResult
} from './store.js';
import { verifyAdminLogin, requireAdmin, revokeAdminToken } from './adminAuth.js';
import {
  listAllPasswords,
  generatePasswordBatch,
  updatePasswordById,
  resetPasswordAttempts,
  deletePasswordById,
  exportPasswordsCsv,
  getBatchIds
} from './passwordCodes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'city-soul-quiz', admin: true });
});

app.post('/api/password/verify', (req, res) => {
  const { code } = req.body || {};
  const entry = findPassword(code);
  if (!entry) {
    return res.status(401).json({ ok: false, message: '密码无效，请检查后重试' });
  }
  const remaining = getRemainingAttempts(code);
  if (remaining <= 0) {
    return res.status(403).json({
      ok: false,
      message: '该密码测试次数已用完',
      remaining: 0
    });
  }
  res.json({
    ok: true,
    remaining,
    maxAttempts: entry.maxAttempts,
    token: Buffer.from(`${entry.code}:${Date.now()}`).toString('base64url')
  });
});

app.post('/api/password/start', (req, res) => {
  const { code } = req.body || {};
  const result = consumeAttempt(code);
  if (!result.ok) {
    const messages = {
      INVALID_PASSWORD: '密码无效',
      NO_ATTEMPTS: '该密码测试次数已用完'
    };
    return res.status(403).json({
      ok: false,
      message: messages[result.error] || '无法开始测试',
      remaining: result.remaining ?? 0
    });
  }
  res.json({
    ok: true,
    remaining: result.remaining,
    maxAttempts: result.maxAttempts
  });
});

app.post('/api/results', (req, res) => {
  const id = uuidv4().replace(/-/g, '').slice(0, 12);
  const body = req.body || {};
  saveResult({
    id,
    passwordCode: body.passwordCode || null,
    answers: body.answers || {},
    preAnswers: body.preAnswers || {},
    result: body.result || null
  });
  res.json({ ok: true, id });
});

app.get('/api/results/:id', (req, res) => {
  const row = getResult(req.params.id);
  if (!row) {
    return res.status(404).json({ ok: false, message: '结果不存在或已过期' });
  }
  res.json({ ok: true, data: row });
});

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body || {};
  const token = verifyAdminLogin(password);
  if (!token) {
    return res.status(401).json({ ok: false, message: '管理员密码错误' });
  }
  res.json({ ok: true, token });
});

app.post('/api/admin/logout', requireAdmin, (req, res) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  revokeAdminToken(token);
  res.json({ ok: true });
});

app.get('/api/admin/passwords/export', requireAdmin, (req, res) => {
  const csv = exportPasswordsCsv({
    batchId: req.query.batchId || undefined,
    onlyEnabled: req.query.onlyEnabled === '1',
    onlyAvailable: req.query.onlyAvailable === '1'
  });
  const filename = `city-soul-passwords-${Date.now()}.csv`;
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(csv);
});

app.get('/api/admin/passwords', requireAdmin, (req, res) => {
  res.json({ ok: true, items: listAllPasswords(), batchIds: getBatchIds() });
});

app.post('/api/admin/passwords/generate', requireAdmin, (req, res) => {
  const { count, maxAttempts, prefix, note } = req.body || {};
  const result = generatePasswordBatch({ count, maxAttempts, prefix, note });
  res.json({ ok: true, ...result });
});

app.patch('/api/admin/passwords/:id', requireAdmin, (req, res) => {
  const row = updatePasswordById(req.params.id, req.body || {});
  if (!row) {
    return res.status(404).json({ ok: false, message: '密码不存在' });
  }
  res.json({ ok: true, item: row });
});

app.post('/api/admin/passwords/:id/reset', requireAdmin, (req, res) => {
  const row = resetPasswordAttempts(req.params.id);
  if (!row) {
    return res.status(404).json({ ok: false, message: '密码不存在' });
  }
  res.json({ ok: true, item: row });
});

app.delete('/api/admin/passwords/:id', requireAdmin, (req, res) => {
  const ok = deletePasswordById(req.params.id);
  if (!ok) {
    return res.status(404).json({ ok: false, message: '密码不存在' });
  }
  res.json({ ok: true });
});

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({
      ok: false,
      message: '接口不存在，请确认已在项目根目录重启 npm run dev / npm start'
    });
  }
  next();
});

const webDist = path.join(__dirname, '..', 'web', 'dist');
app.use(express.static(webDist));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  const index = path.join(webDist, 'index.html');
  if (req.method === 'GET' && !req.path.includes('.')) {
    return res.sendFile(index, (err) => {
      if (err) next();
    });
  }
  next();
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`City Soul Quiz API http://127.0.0.1:${PORT}`);
});
