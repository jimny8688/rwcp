-- 可选：将 server/data/store.json 中的 passwords 手工导入 Supabase
-- 在 SQL Editor 中按需修改后执行

-- 示例：
-- insert into public.quiz_passwords (code, max_attempts, used_attempts, enabled, batch_id, note)
-- values ('YOURCODE', 3, 0, true, 'IMPORT', '从 store.json 导入')
-- on conflict (code) do update set
--   max_attempts = excluded.max_attempts,
--   used_attempts = excluded.used_attempts,
--   enabled = excluded.enabled;
