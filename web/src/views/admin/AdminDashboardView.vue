<template>
  <div class="page admin-dash">
    <header class="topbar">
      <div>
        <h1>密码管理</h1>
        <p>批量生成 · 次数控制 · 导出发货</p>
      </div>
      <div class="top-actions">
        <router-link to="/" class="link">测评首页</router-link>
        <button type="button" class="btn-sm ghost" @click="logout">退出</button>
      </div>
    </header>

    <div class="stats">
      <div class="stat-card">
        <b>{{ stats.total }}</b><span>总密码数</span>
      </div>
      <div class="stat-card">
        <b>{{ stats.available }}</b><span>仍有次数</span>
      </div>
      <div class="stat-card">
        <b>{{ stats.exhausted }}</b><span>已用尽</span>
      </div>
      <div class="stat-card">
        <b>{{ stats.disabled }}</b><span>已停用</span>
      </div>
    </div>

    <div class="toolbar card-panel">
      <button type="button" class="btn btn-primary btn-inline" @click="showGenerate = true">
        ＋ 批量生成
      </button>
      <button type="button" class="btn btn-secondary btn-inline" :disabled="loading" @click="exportCsv()">
        导出 CSV
      </button>
      <button type="button" class="btn btn-outline btn-inline dark-text" @click="load">
        刷新
      </button>
      <div class="filters">
        <select v-model="filterBatch" class="select">
          <option value="">全部批次</option>
          <option v-for="b in batchIds" :key="b" :value="b">{{ b }}</option>
        </select>
        <label class="check"><input v-model="filterAvailable" type="checkbox" /> 仅剩余次数&gt;0</label>
        <label class="check"><input v-model="filterEnabled" type="checkbox" /> 仅启用</label>
        <input v-model="search" class="search" placeholder="搜索密码…" />
      </div>
    </div>

    <div v-if="lastBatch" class="batch-banner card-panel">
      刚生成批次 <code>{{ lastBatch.batchId }}</code>，共 {{ lastBatch.items.length }} 个密码
      <button type="button" class="link-btn" @click="exportCsv(lastBatch.batchId)">导出本批</button>
      <button type="button" class="link-btn" @click="copyBatchCodes(lastBatch.items)">复制本批密码</button>
    </div>

    <div class="card-panel table-wrap">
      <div v-if="loading" class="empty">加载中…</div>
      <div v-else-if="filteredItems.length === 0" class="empty">暂无数据</div>
      <table v-else class="table">
        <thead>
          <tr>
            <th>密码</th>
            <th>次数</th>
            <th>状态</th>
            <th>批次</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in filteredItems" :key="row.id" :class="{ dim: !row.enabled || row.remaining === 0 }">
            <td>
              <code class="code">{{ row.code }}</code>
              <button type="button" class="icon-btn" title="复制" @click="copyOne(row.code)">📋</button>
            </td>
            <td>
              <span class="pill" :class="row.remaining > 0 ? 'ok' : 'warn'">
                {{ row.usedAttempts }}/{{ row.maxAttempts }}
              </span>
              <small>剩 {{ row.remaining }}</small>
            </td>
            <td>
              <button
                type="button"
                class="status-toggle"
                :class="{ off: !row.enabled }"
                @click="toggleEnabled(row)"
              >
                {{ row.enabled ? '启用' : '停用' }}
              </button>
            </td>
            <td><small>{{ row.batchId || '—' }}</small></td>
            <td><small>{{ formatDate(row.createdAt) }}</small></td>
            <td class="ops">
              <button type="button" class="link-btn" @click="onReset(row)">重置次数</button>
              <button type="button" class="link-btn danger" @click="onDelete(row)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="toast" class="toast admin-toast">{{ toast }}</div>

    <div v-if="showGenerate" class="modal-mask" @click.self="showGenerate = false">
      <div class="modal-panel">
        <h3>批量生成密码</h3>
        <label>生成数量（1–500）</label>
        <input v-model.number="genForm.count" class="input input-light" type="number" min="1" max="500" />
        <label>每码可用次数</label>
        <input v-model.number="genForm.maxAttempts" class="input input-light" type="number" min="1" max="99" />
        <label>前缀（可选，如 VIP）</label>
        <input v-model="genForm.prefix" class="input input-light" placeholder="留空则纯随机" />
        <label>批次备注（可选）</label>
        <input v-model="genForm.note" class="input input-light" placeholder="如：3月淘宝订单" />
        <p class="hint">密码字符不含易混淆的 0/O/1/I，默认 8 位随机。</p>
        <div class="modal-actions">
          <button type="button" class="btn btn-outline dark-text" @click="showGenerate = false">取消</button>
          <button type="button" class="btn btn-primary" :disabled="generating" @click="onGenerate">
            {{ generating ? '生成中…' : '确认生成' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  adminLogout,
  deletePassword,
  downloadPasswordExport,
  fetchPasswords,
  generatePasswords,
  getAdminToken,
  patchPassword,
  resetPassword
} from '../../api/admin.js';

const router = useRouter();
const items = ref([]);
const batchIds = ref([]);
const loading = ref(false);
const generating = ref(false);
const showGenerate = ref(false);
const toast = ref('');
const lastBatch = ref(null);

const filterBatch = ref('');
const filterAvailable = ref(false);
const filterEnabled = ref(false);
const search = ref('');

const genForm = reactive({
  count: 20,
  maxAttempts: 3,
  prefix: '',
  note: ''
});

const stats = computed(() => {
  const list = items.value;
  return {
    total: list.length,
    available: list.filter((r) => r.enabled && r.remaining > 0).length,
    exhausted: list.filter((r) => r.enabled && r.remaining === 0).length,
    disabled: list.filter((r) => !r.enabled).length
  };
});

const filteredItems = computed(() => {
  let list = [...items.value];
  if (filterBatch.value) list = list.filter((r) => r.batchId === filterBatch.value);
  if (filterAvailable.value) list = list.filter((r) => r.remaining > 0);
  if (filterEnabled.value) list = list.filter((r) => r.enabled);
  const q = search.value.trim().toUpperCase();
  if (q) list = list.filter((r) => r.code.includes(q));
  return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
});

onMounted(() => {
  if (!getAdminToken()) {
    router.replace('/admin/login');
    return;
  }
  load();
});

async function load() {
  loading.value = true;
  try {
    const data = await fetchPasswords();
    items.value = data.items;
    batchIds.value = data.batchIds;
  } catch (e) {
    if (e.message === 'UNAUTHORIZED') router.replace('/admin/login');
    else showToast(e.message);
  } finally {
    loading.value = false;
  }
}

async function onGenerate() {
  generating.value = true;
  try {
    const data = await generatePasswords({ ...genForm });
    lastBatch.value = { batchId: data.batchId, items: data.items };
    showGenerate.value = false;
    await load();
    filterBatch.value = data.batchId;
    showToast(`已生成 ${data.items.length} 个密码`);
  } catch (e) {
    if (e.message === 'UNAUTHORIZED') router.replace('/admin/login');
    else showToast(e.message);
  } finally {
    generating.value = false;
  }
}

async function exportCsv(batchId) {
  try {
    const blob = await downloadPasswordExport({
      batchId: batchId || filterBatch.value || undefined,
      onlyEnabled: filterEnabled.value,
      onlyAvailable: filterAvailable.value
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `passwords-${batchId || filterBatch.value || 'all'}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV 已下载');
  } catch (e) {
    if (e.message === 'UNAUTHORIZED') router.replace('/admin/login');
    else showToast(e.message);
  }
}

async function toggleEnabled(row) {
  try {
    const { item } = await patchPassword(row.id, { enabled: !row.enabled });
    Object.assign(row, item);
  } catch (e) {
    showToast(e.message);
  }
}

async function onReset(row) {
  if (!confirm(`重置「${row.code}」的已用次数为 0？`)) return;
  try {
    const { item } = await resetPassword(row.id);
    Object.assign(row, item);
    showToast('已重置');
  } catch (e) {
    showToast(e.message);
  }
}

async function onDelete(row) {
  if (!confirm(`确定删除密码 ${row.code}？不可恢复。`)) return;
  try {
    await deletePassword(row.id);
    items.value = items.value.filter((r) => r.id !== row.id);
    showToast('已删除');
  } catch (e) {
    showToast(e.message);
  }
}

async function logout() {
  try {
    await adminLogout();
  } catch {
    /* ignore */
  }
  router.replace('/admin/login');
}

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('zh-CN', { hour12: false });
}

function showToast(msg) {
  toast.value = msg;
  setTimeout(() => {
    toast.value = '';
  }, 2500);
}

async function copyOne(code) {
  try {
    await navigator.clipboard.writeText(code);
    showToast('已复制');
  } catch {
    showToast(code);
  }
}

async function copyBatchCodes(batchItems) {
  const text = batchItems.map((i) => i.code).join('\n');
  try {
    await navigator.clipboard.writeText(text);
    showToast('本批密码已复制');
  } catch {
    showToast('复制失败');
  }
}
</script>

<style scoped>
.admin-dash {
  max-width: 960px;
  color: #1a2332;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
  color: #fff;
}

.topbar h1 {
  margin: 0 0 4px;
  font-size: 22px;
}

.topbar p {
  margin: 0;
  font-size: 13px;
  opacity: 0.65;
}

.top-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.link {
  color: #ffd166;
  font-size: 13px;
  text-decoration: none;
}

.btn-sm {
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 14px;
}

@media (max-width: 600px) {
  .stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

.stat-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 14px;
  padding: 12px;
  text-align: center;
}

.stat-card b {
  display: block;
  font-size: 22px;
  color: #1a5f4a;
}

.stat-card span {
  font-size: 11px;
  color: #64748b;
}

.card-panel {
  background: #fff;
  border-radius: 16px;
  padding: 14px;
  margin-bottom: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.btn-inline {
  width: auto;
  padding: 10px 14px;
  font-size: 13px;
}

.dark-text {
  color: #1a2332 !important;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  width: 100%;
  margin-top: 8px;
}

.select,
.search {
  padding: 8px 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
}

.search {
  flex: 1;
  min-width: 120px;
}

.check {
  font-size: 12px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 4px;
}

.batch-banner {
  font-size: 13px;
  background: #eef8f3;
  border: 1px solid #b8e0cc;
}

.batch-banner code {
  font-weight: 700;
  color: #1a5f4a;
}

.link-btn {
  border: none;
  background: none;
  color: #2d9cdb;
  cursor: pointer;
  font-size: 13px;
  margin-left: 8px;
  padding: 0;
}

.link-btn.danger {
  color: #e74c3c;
}

.table-wrap {
  overflow-x: auto;
  padding: 0;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.table th,
.table td {
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid #f1f5f9;
}

.table th {
  background: #f8fafc;
  font-size: 12px;
  color: #64748b;
}

tr.dim {
  opacity: 0.55;
}

.code {
  font-weight: 700;
  font-size: 13px;
}

.icon-btn {
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  vertical-align: middle;
}

.pill {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.pill.ok {
  background: #dcfce7;
  color: #166534;
}
.pill.warn {
  background: #fee2e2;
  color: #991b1b;
}

.status-toggle {
  border: none;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  background: #dcfce7;
  color: #166534;
}

.status-toggle.off {
  background: #f1f5f9;
  color: #64748b;
}

.ops {
  white-space: nowrap;
}

.empty {
  padding: 32px;
  text-align: center;
  color: #94a3b8;
}

.modal-panel label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin: 12px 0 6px;
  color: #334155;
}

.modal-panel .hint {
  font-size: 12px;
  color: #94a3b8;
  margin: 10px 0 0;
}

.modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 18px;
}

.modal-actions .btn {
  flex: 1;
}

.admin-toast {
  z-index: 3000;
}
</style>
