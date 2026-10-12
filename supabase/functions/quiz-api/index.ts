import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-admin-token',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

const CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

function normalizeCode(code: string) {
  return String(code || '').trim().toUpperCase();
}

function randomCode(length = 8, prefix = '') {
  let body = '';
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  for (let i = 0; i < length; i++) body += CHARSET[bytes[i] % CHARSET.length];
  const pre = prefix ? `${normalizeCode(prefix)}-` : '';
  return `${pre}${body}`;
}

function b64urlEncode(bytes: Uint8Array) {
  let s = btoa(String.fromCharCode(...bytes));
  return s.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlDecode(str: string) {
  const pad = str.length % 4 === 0 ? '' : '='.repeat(4 - (str.length % 4));
  const s = str.replace(/-/g, '+').replace(/_/g, '/') + pad;
  return Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
}

async function verifyAdminToken(token: string, secret: string) {
  if (!token || !secret) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [payloadB64, sigB64] = parts;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );
  const sigBytes = b64urlDecode(sigB64);
  const ok = await crypto.subtle.verify('HMAC', key, sigBytes, new TextEncoder().encode(payloadB64));
  if (!ok) return false;
  try {
    const payloadJson = new TextDecoder().decode(b64urlDecode(payloadB64));
    const payload = JSON.parse(payloadJson);
    return payload.exp && Date.now() < payload.exp;
  } catch {
    return false;
  }
}

async function createAdminToken(secret: string) {
  const payload = { exp: Date.now() + 12 * 60 * 60 * 1000 };
  const payloadB64 = b64urlEncode(new TextEncoder().encode(JSON.stringify(payload)));
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sigBuf = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payloadB64));
  return `${payloadB64}.${b64urlEncode(new Uint8Array(sigBuf))}`;
}

function formatPasswordRow(p: Record<string, unknown>) {
  const maxAttempts = Number(p.max_attempts);
  const usedAttempts = Number(p.used_attempts);
  return {
    id: p.id,
    code: p.code,
    maxAttempts,
    usedAttempts,
    remaining: Math.max(0, maxAttempts - usedAttempts),
    enabled: p.enabled,
    createdAt: p.created_at,
    batchId: p.batch_id,
    note: p.note || ''
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const adminPassword = Deno.env.get('ADMIN_PASSWORD') || 'citysoul-admin';
  const adminJwtSecret = Deno.env.get('ADMIN_JWT_SECRET') || adminPassword;

  const db = createClient(supabaseUrl, serviceKey);

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const action = String(body.action || '');

  try {
    if (action === 'health') {
      return json({ ok: true, service: 'city-soul-quiz', backend: 'supabase' });
    }

    if (action === 'password.verify') {
      const code = normalizeCode(String(body.code || ''));
      const { data, error } = await db.from('quiz_passwords').select('*').eq('code', code).maybeSingle();
      if (error) throw error;
      if (!data || !data.enabled) {
        return json({ ok: false, message: '密码无效，请检查后重试' }, 401);
      }
      const remaining = data.max_attempts - data.used_attempts;
      if (remaining <= 0) {
        return json({ ok: false, message: '该密码测试次数已用完', remaining: 0 }, 403);
      }
      return json({
        ok: true,
        remaining,
        maxAttempts: data.max_attempts,
        token: btoa(`${data.code}:${Date.now()}`)
      });
    }

    if (action === 'password.start') {
      const code = normalizeCode(String(body.code || ''));
      const { data, error } = await db.rpc('consume_quiz_attempt', { p_code: code });
      if (error) throw error;
      const result = data as Record<string, unknown>;
      if (!result.ok) {
        const msg = result.error === 'NO_ATTEMPTS' ? '该密码测试次数已用完' : '密码无效';
        return json({ ok: false, message: msg, remaining: result.remaining ?? 0 }, 403);
      }
      return json({
        ok: true,
        remaining: result.remaining,
        maxAttempts: result.maxAttempts
      });
    }

    if (action === 'results.save') {
      const id = crypto.randomUUID().replace(/-/g, '').slice(0, 12);
      const { error } = await db.from('quiz_results').insert({
        id,
        password_code: body.passwordCode || null,
        pre_answers: body.preAnswers || {},
        answers: body.answers || {},
        result: body.result || null
      });
      if (error) throw error;
      return json({ ok: true, id });
    }

    if (action === 'results.get') {
      const id = String(body.id || '');
      const { data, error } = await db.from('quiz_results').select('*').eq('id', id).maybeSingle();
      if (error) throw error;
      if (!data) return json({ ok: false, message: '结果不存在或已过期' }, 404);
      return json({
        ok: true,
        data: {
          id: data.id,
          passwordCode: data.password_code,
          preAnswers: data.pre_answers,
          answers: data.answers,
          result: data.result,
          createdAt: data.created_at
        }
      });
    }

    if (action === 'admin.login') {
      if (String(body.password || '') !== adminPassword) {
        return json({ ok: false, message: '管理员密码错误' }, 401);
      }
      const token = await createAdminToken(adminJwtSecret);
      return json({ ok: true, token });
    }

    const adminToken = req.headers.get('x-admin-token') || '';
    const isAdmin = await verifyAdminToken(adminToken, adminJwtSecret);

    if (action.startsWith('admin.') && action !== 'admin.login' && !isAdmin) {
      return json({ ok: false, message: '未登录或登录已过期' }, 401);
    }

    if (action === 'admin.passwords.list') {
      const { data, error } = await db
        .from('quiz_passwords')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      const items = (data || []).map(formatPasswordRow);
      const batchIds = [...new Set(items.map((i) => i.batchId).filter(Boolean))].sort().reverse();
      return json({ ok: true, items, batchIds });
    }

    if (action === 'admin.passwords.generate') {
      const count = Math.min(Math.max(Number(body.count) || 10, 1), 500);
      const maxAttempts = Math.max(Number(body.maxAttempts) || 3, 1);
      const prefix = String(body.prefix || '');
      const note = String(body.note || '');
      const batchId = `B${Date.now().toString(36).toUpperCase()}`;

      const { data: existing } = await db.from('quiz_passwords').select('code');
      const codes = new Set((existing || []).map((r: { code: string }) => normalizeCode(r.code)));

      const created = [];
      while (created.length < count) {
        let code = randomCode(8, prefix);
        let tries = 0;
        while (codes.has(code) && tries < 25) {
          code = randomCode(8, prefix);
          tries++;
        }
        if (codes.has(code)) continue;
        codes.add(code);
        const row = {
          code,
          max_attempts: maxAttempts,
          used_attempts: 0,
          enabled: true,
          batch_id: batchId,
          note
        };
        const { data: inserted, error } = await db.from('quiz_passwords').insert(row).select().single();
        if (error) throw error;
        created.push(formatPasswordRow(inserted));
      }
      return json({ ok: true, batchId, items: created });
    }

    if (action === 'admin.passwords.patch') {
      const id = String(body.id || '');
      const patch: Record<string, unknown> = {};
      if (body.enabled !== undefined) patch.enabled = Boolean(body.enabled);
      if (body.maxAttempts !== undefined) patch.max_attempts = Math.max(1, Number(body.maxAttempts) || 3);
      if (body.usedAttempts !== undefined) patch.used_attempts = Math.max(0, Number(body.usedAttempts) || 0);
      if (body.note !== undefined) patch.note = String(body.note).slice(0, 200);
      const { data, error } = await db.from('quiz_passwords').update(patch).eq('id', id).select().single();
      if (error || !data) return json({ ok: false, message: '密码不存在' }, 404);
      return json({ ok: true, item: formatPasswordRow(data) });
    }

    if (action === 'admin.passwords.reset') {
      const id = String(body.id || '');
      const { data, error } = await db
        .from('quiz_passwords')
        .update({ used_attempts: 0 })
        .eq('id', id)
        .select()
        .single();
      if (error || !data) return json({ ok: false, message: '密码不存在' }, 404);
      return json({ ok: true, item: formatPasswordRow(data) });
    }

    if (action === 'admin.passwords.delete') {
      const id = String(body.id || '');
      const { data, error } = await db.from('quiz_passwords').delete().eq('id', id).select('id');
      if (error) throw error;
      if (!data?.length) return json({ ok: false, message: '密码不存在' }, 404);
      return json({ ok: true });
    }

    if (action === 'admin.passwords.export') {
      const { data, error } = await db.from('quiz_passwords').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      let rows = (data || []).map(formatPasswordRow);
      const batchId = body.batchId ? String(body.batchId) : '';
      if (batchId) rows = rows.filter((r) => r.batchId === batchId);
      if (body.onlyEnabled) rows = rows.filter((r) => r.enabled);
      if (body.onlyAvailable) rows = rows.filter((r) => r.remaining > 0);
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
            `"${String(r.note || '').replace(/"/g, '""')}"`
          ].join(',')
        );
      }
      return new Response('\ufeff' + lines.join('\n'), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/csv; charset=utf-8'
        }
      });
    }

    return json({ ok: false, message: '未知 action' }, 404);
  } catch (e) {
    console.error(e);
    return json({ ok: false, message: (e as Error)?.message || String(e) }, 500);
  }
});
