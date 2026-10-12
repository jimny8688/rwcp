# 部署指南：GitHub Pages + Supabase

## 架构

| 组件 | 托管 |
|------|------|
| Vue 前端 | GitHub Pages |
| API + 业务逻辑 | Supabase Edge Function `quiz-api` |
| 数据 | Supabase Postgres |

---

## 第一步：Supabase（需你登录操作）

1. 打开 [https://supabase.com](https://supabase.com) 注册/登录 → **New project**。
2. 进入 **Project Settings → API**，记下：
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** → `VITE_SUPABASE_ANON_KEY`
3. **SQL Editor** → 粘贴并执行 `supabase/migrations/20260330120000_init.sql` 全部内容。
4. 部署 Edge Function（二选一）：

### 方式 A：Supabase CLI（推荐）

```bash
npm i -g supabase
supabase login
cd d:\code\rwcp
supabase link --project-ref YOUR_PROJECT_REF
supabase functions deploy quiz-api --no-verify-jwt
supabase secrets set ADMIN_PASSWORD=你的强密码
supabase secrets set ADMIN_JWT_SECRET=随机长字符串
```

### 方式 B：Dashboard 手动

1. **Edge Functions** → Create → 名称 `quiz-api`
2. 复制 `supabase/functions/quiz-api/index.ts` 内容
3. **Secrets**：`ADMIN_PASSWORD`、`ADMIN_JWT_SECRET`（`SUPABASE_URL` 与 `SUPABASE_SERVICE_ROLE_KEY` 由平台自动注入）

5. 测试（把 URL 和 anon key 换成你的）：

```bash
curl -X POST "https://YOUR_REF.supabase.co/functions/v1/quiz-api" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"action\":\"health\"}"
```

应返回 `{"ok":true,"backend":"supabase",...}`

---

## 第二步：GitHub 仓库与 Pages（需你登录操作）

1. 在 GitHub 创建仓库（例如名称为 `rwcp`）。
2. 本地推送代码：

```bash
cd d:\code\rwcp
git init
git add .
git commit -m "City soul quiz: GitHub Pages + Supabase"
git branch -M main
git remote add origin https://github.com/你的用户名/rwcp.git
git push -u origin main
```

3. 仓库 **Settings → Secrets and variables → Actions**，新增：

| Secret | 值 |
|--------|-----|
| `VITE_SUPABASE_URL` | Supabase Project URL |
| `VITE_SUPABASE_ANON_KEY` | anon public key |

4. **Settings → Pages → Build and deployment → Source** 选 **GitHub Actions**。
5. 推送后 Actions 跑完，访问：

`https://<用户名>.github.io/<仓库名>/`

例如：`https://octocat.github.io/rwcp/`

> `VITE_BASE_PATH` 在 workflow 里已设为 `/<仓库名>/`，与 Pages 路径一致。

---

## 第三步：管理后台

- 地址：`https://<用户名>.github.io/<仓库名>/admin/login`
- 密码：与 Supabase Secret `ADMIN_PASSWORD` 一致（未设置时默认为 `citysoul-admin`，**生产务必修改**）

---

## 本地开发

**仅前端 + 云端 Supabase：**

```bash
cd web
cp .env.example .env
# 填写 VITE_SUPABASE_URL、VITE_SUPABASE_ANON_KEY
npm run dev
```

**本地 Express 回退（不配置 Supabase 环境变量）：**

```bash
npm run dev
# 根目录同时起 5173 + 3001
```

---

## 从旧 store.json 迁移密码

在 Supabase SQL Editor 中按 `scripts/import-store-json.sql` 说明插入，或在管理后台重新批量生成。

---

## 安全提醒

- **切勿**把 `service_role` key 或 `ADMIN_JWT_SECRET` 写进前端或 GitHub Secrets 的 VITE_* 变量。
- 仅 `VITE_SUPABASE_ANON_KEY` 可出现在前端构建中。
