<template>
  <div class="page page-content">
    <div class="hero">
      <span class="hero-badge">✦ SOUL CITY ✦ 人境匹配</span>
      <h1>你的城市灵魂<br /><em>重生你会锁哪座城？</em></h1>
      <p class="subtitle">30 道题目 · 10 座灵魂城市 · 找到与你同频的那座城</p>
      <div class="hero-stats">
        <div class="stat"><b>30</b><span>道题目</span></div>
        <div class="stat"><b>10</b><span>灵魂城市</span></div>
        <div class="stat"><b>6</b><span>气质维度</span></div>
      </div>
    </div>

    <div class="glass-card ticket">
      <div class="ticket-notch left" />
      <div class="ticket-notch right" />
      <div class="ticket-header">
        <span class="ticket-label">灵魂通行证</span>
        <span class="ticket-no">NO.{{ ticketNo }}</span>
      </div>
      <label for="pwd">输入测评密码，解锁航线</label>
      <input
        id="pwd"
        v-model="password"
        class="input"
        type="password"
        autocomplete="off"
        placeholder="· · · · · · · ·"
        @keyup.enter="onStart"
      />
      <p v-if="error" class="error-text">{{ error }}</p>
      <p v-if="remaining !== null" class="hint">
        剩余航程次数 <strong>{{ remaining }}</strong> / {{ maxAttempts }}
      </p>
      <button
        class="btn btn-primary btn-glow"
        style="margin-top: 16px"
        :disabled="loading"
        @click="onStart"
      >
        <span v-if="loading">验证中…</span>
        <span v-else>🧭 开始灵魂导航</span>
      </button>
    </div>

    <div class="glass-card features">
      <div v-for="(f, i) in features" :key="f.title" class="feature" :style="{ animationDelay: i * 0.08 + 's' }">
        <span class="feature-icon">{{ f.icon }}</span>
        <div>
          <strong>{{ f.title }}</strong>
          <p>{{ f.desc }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { verifyPassword, startTest } from '../api.js';

const router = useRouter();
const password = ref('');
const error = ref('');
const loading = ref(false);
const remaining = ref(null);
const maxAttempts = ref(3);
const ticketNo = ref('000000');

const features = [
  { icon: '🎫', title: '灵魂护照', desc: '专属结果卡，一键保存长图晒圈' },
  { icon: '📡', title: '气质雷达', desc: '六维读懂你的节奏、社交与价值' },
  { icon: '🗺️', title: '错位指数', desc: '灵魂城市 vs 现居，该不该换容器' }
];

onMounted(() => {
  ticketNo.value = String(Math.floor(100000 + Math.random() * 900000));
});

async function onStart() {
  error.value = '';
  const code = password.value.trim();
  if (!code) {
    error.value = '请输入密码';
    return;
  }
  loading.value = true;
  try {
    const verify = await verifyPassword(code);
    if (!verify.ok) {
      error.value = verify.message || '密码无效';
      remaining.value = verify.remaining ?? null;
      return;
    }
    remaining.value = verify.remaining;
    maxAttempts.value = verify.maxAttempts;

    const start = await startTest(code);
    if (!start.ok) {
      error.value = start.message || '无法开始测试';
      remaining.value = start.remaining ?? 0;
      return;
    }
    remaining.value = start.remaining;
    sessionStorage.setItem(
      'citySoulSession',
      JSON.stringify({
        code: code.toUpperCase(),
        remaining: start.remaining,
        startedAt: Date.now()
      })
    );
    sessionStorage.removeItem('citySoulAnswers');
    sessionStorage.removeItem('citySoulPre');
    sessionStorage.removeItem('citySoulResult');
    router.push('/quiz');
  } catch (e) {
    error.value =
      e?.message?.includes('后端 API') || e?.message?.includes('JSON')
        ? '服务连接失败，请稍后重试或联系客服'
        : e?.message || '网络异常，请稍后重试';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.hero em {
  font-style: normal;
  background: linear-gradient(90deg, #ffd166, #ff9f43);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.ticket {
  position: relative;
  overflow: hidden;
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.ticket-label {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.2em;
  color: var(--gold);
}

.ticket-no {
  font-size: 11px;
  font-family: ui-monospace, monospace;
  color: rgba(255, 255, 255, 0.4);
}

.ticket-notch {
  position: absolute;
  top: 50%;
  width: 16px;
  height: 16px;
  background: var(--bg-deep);
  border-radius: 50%;
  transform: translateY(-50%);
}
.ticket-notch.left {
  left: -8px;
}
.ticket-notch.right {
  right: -8px;
}

label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
  color: rgba(255, 255, 255, 0.75);
}

.hint {
  margin: 10px 0 0;
  font-size: 13px;
  color: var(--muted);
}
.hint strong {
  color: var(--gold);
  font-size: 16px;
}

.features {
  padding: 16px;
}

.feature {
  display: flex;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  animation: pageIn 0.5s ease both;
}

.feature:last-child {
  border-bottom: none;
}

.feature-icon {
  font-size: 24px;
  line-height: 1;
}

.feature strong {
  display: block;
  font-size: 14px;
  margin-bottom: 2px;
}

.feature p {
  margin: 0;
  font-size: 12px;
  color: var(--muted);
  line-height: 1.5;
}

</style>
