# 城市灵魂测评

Vue 3 趣味测评 · 密码次数控制 · 结果分享 · 管理后台。

**生产推荐：** 前端 [GitHub Pages](DEPLOY.md) + 后端 [Supabase](DEPLOY.md)。

## 本地开发

```bash
npm install
npm run dev
```

- 前端 http://localhost:5173  
- 若未配置 Supabase 环境变量，API 走本地 Express http://127.0.0.1:3001  

### 环境变量（`web/.env`）

见 `web/.env.example`。配置 `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` 后，前端直连 Supabase Edge Function。

## 部署

完整步骤见 **[DEPLOY.md](./DEPLOY.md)**。

## 体验密码

- 本地 / 导入 SQL 后：`DEMO2026`（3 次）
- 管理后台：批量生成与 CSV 导出

## 目录

| 路径 | 说明 |
|------|------|
| `web/` | Vue 3 前端 |
| `server/` | 本地 Express（可选） |
| `supabase/` | 数据库迁移 + Edge Function |
