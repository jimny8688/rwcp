-- 城市灵魂测评 · Supabase 数据库
-- 客户端不可直连表；仅 Edge Function（service role）访问

create extension if not exists "pgcrypto";

create table if not exists public.quiz_passwords (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  max_attempts int not null default 3 check (max_attempts >= 1),
  used_attempts int not null default 0 check (used_attempts >= 0),
  enabled boolean not null default true,
  batch_id text,
  note text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists idx_quiz_passwords_batch on public.quiz_passwords (batch_id);

create table if not exists public.quiz_results (
  id text primary key,
  password_code text,
  pre_answers jsonb not null default '{}'::jsonb,
  answers jsonb not null default '{}'::jsonb,
  result jsonb,
  created_at timestamptz not null default now()
);

alter table public.quiz_passwords enable row level security;
alter table public.quiz_results enable row level security;

create or replace function public.consume_quiz_attempt(p_code text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  rec quiz_passwords%rowtype;
  remaining int;
begin
  select * into rec
  from quiz_passwords
  where upper(code) = upper(trim(p_code))
  for update;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'INVALID_PASSWORD');
  end if;

  if not rec.enabled then
    return jsonb_build_object('ok', false, 'error', 'INVALID_PASSWORD');
  end if;

  if rec.used_attempts >= rec.max_attempts then
    return jsonb_build_object('ok', false, 'error', 'NO_ATTEMPTS', 'remaining', 0);
  end if;

  update quiz_passwords
  set used_attempts = used_attempts + 1
  where id = rec.id
  returning * into rec;

  remaining := rec.max_attempts - rec.used_attempts;

  return jsonb_build_object(
    'ok', true,
    'remaining', remaining,
    'maxAttempts', rec.max_attempts
  );
end;
$$;

revoke all on function public.consume_quiz_attempt(text) from public;
grant execute on function public.consume_quiz_attempt(text) to service_role;

grant usage on schema public to postgres, service_role;
grant all on table public.quiz_passwords to postgres, service_role;
grant all on table public.quiz_results to postgres, service_role;
grant usage, select on all sequences in schema public to postgres, service_role;

insert into public.quiz_passwords (code, max_attempts, used_attempts, enabled, batch_id, note)
values
  ('DEMO2026', 3, 0, true, 'SEED', '体验密码'),
  ('CHENGDOU', 3, 0, true, 'SEED', '体验密码')
on conflict (code) do nothing;
