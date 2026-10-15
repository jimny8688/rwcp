<template>
  <div class="page page-content home-dream">
    <header class="hero">
      <span class="hero-badge">✦ 城市灵魂 · 深度解析 ✦</span>
      <h1>
        <span class="hero-num">10</span>座灵魂城市
      </h1>
      <p class="hero-sub">重生你会锁哪一座？</p>
      <p class="subtitle">30 道题目 · 人-环境匹配 · 约 6–8 分钟</p>
    </header>

    <div class="city-carousel-wrap">
      <div class="city-carousel" role="list">
        <article
          v-for="(city, i) in cityCards"
          :key="city.id"
          class="city-card"
          role="listitem"
          :style="{ animationDelay: i * 0.05 + 's' }"
        >
          <div class="city-card-bg" :style="{ background: city.gradient }" />
          <div class="city-card-body">
            <span class="city-emoji">{{ city.emoji }}</span>
            <span class="city-name">{{ city.name }}</span>
            <span class="city-soul">{{ city.title }}</span>
          </div>
        </article>
      </div>
    </div>

    <div class="ribbon">
      <span>测出你的灵魂城市 · 气质匹配度报告</span>
    </div>

    <div class="glass-card light ticket-card">
      <div class="ticket-header">
        <span class="ticket-label">灵魂通行证</span>
        <span class="ticket-no">NO.{{ ticketNo }}</span>
      </div>
      <label for="pwd">输入测评密码，解锁航线</label>
      <input
        id="pwd"
        v-model="password"
        class="input input-light"
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
        class="btn btn-primary btn-glow btn-cta"
        :disabled="loading"
        @click="onStart"
      >
        <span v-if="loading">验证中…</span>
        <span v-else>开始灵魂导航 →</span>
      </button>
    </div>

    <div class="feature-pills">
      <div v-for="f in features" :key="f.title" class="pill">
        <span class="pill-icon">{{ f.icon }}</span>
        <span class="pill-text">{{ f.title }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { verifyPassword, startTest } from '../api.js';
import { CITY_PROFILES } from '../data/cities.js';
import { getCityTheme } from '../data/cityThemes.js';

const router = useRouter();
const password = ref('');
const error = ref('');
const loading = ref(false);
const remaining = ref(null);
const maxAttempts = ref(3);
const ticketNo = ref('000000');

const cityCards = computed(() =>
  CITY_PROFILES.map((c) => {
    const theme = getCityTheme(c.id);
    return {
      id: c.id,
      name: c.name,
      title: c.title,
      emoji: theme.emoji,
      gradient: theme.gradient
    };
  })
);

const features = [
  { icon: '🎫', title: '灵魂护照' },
  { icon: '📡', title: '气质雷达' },
  { icon: '🗺️', title: '错位指数' },
  { icon: '🔗', title: '链接分享' }
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
    sessionStorage.removeItem('citySoulQuizIndex');
    sessionStorage.removeItem('citySoulQuestionOrder');
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
.home-dream {
  padding-top: 8px;
}

.hero-num {
  font-family: var(--font-display);
  font-size: clamp(36px, 9vw, 48px);
  font-weight: 900;
  color: var(--primary-dim);
  line-height: 1;
  margin-right: 4px;
}

.hero h1 {
  margin: 0 0 6px;
  font-size: clamp(22px, 5.5vw, 28px);
  font-weight: 800;
  color: var(--primary-dim);
  display: flex;
  align-items: baseline;
  justify-content: center;
  flex-wrap: wrap;
  gap: 4px;
}

.hero-sub {
  margin: 0 0 10px;
  font-size: clamp(18px, 4.5vw, 22px);
  font-weight: 700;
  color: var(--text-dark);
}

.city-carousel-wrap {
  margin: 0 -16px 16px;
  padding: 0 16px;
  overflow: hidden;
}

.city-carousel {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 8px 4px 16px;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.city-carousel::-webkit-scrollbar {
  display: none;
}

.city-card {
  position: relative;
  flex: 0 0 72px;
  width: 72px;
  height: 148px;
  border-radius: 36px;
  overflow: hidden;
  scroll-snap-align: center;
  box-shadow: 0 10px 28px rgba(93, 74, 138, 0.28);
  border: 2px solid rgba(255, 255, 255, 0.75);
  animation: cardIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes cardIn {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.92);
  }
}

.city-card-bg {
  position: absolute;
  inset: 0;
  opacity: 0.92;
}

.city-card-body {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding: 12px 6px 14px;
  text-align: center;
  background: linear-gradient(180deg, transparent 25%, rgba(61, 53, 86, 0.55) 100%);
}

.city-emoji {
  font-size: 26px;
  margin-bottom: auto;
  padding-top: 16px;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.15));
}

.city-name {
  font-size: 15px;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.06em;
}

.city-soul {
  font-size: 9px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.88);
  margin-top: 4px;
  line-height: 1.3;
}

.ribbon {
  margin-bottom: 14px;
  padding: 10px 16px;
  text-align: center;
  background: linear-gradient(135deg, var(--primary-deep), var(--primary));
  border-radius: var(--radius-pill);
  box-shadow: var(--shadow-soft);
}

.ribbon span {
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.04em;
}

.ticket-card {
  padding: 20px;
  margin-bottom: 14px;
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
  color: var(--primary);
}

.ticket-no {
  font-size: 11px;
  font-family: ui-monospace, monospace;
  color: var(--muted-dark);
}

label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-dark);
}

.hint {
  margin: 10px 0 0;
  font-size: 13px;
  color: var(--muted-on-light);
}

.hint strong {
  color: var(--primary-deep);
  font-size: 16px;
}

.btn-cta {
  margin-top: 16px;
  font-size: 16px;
  padding: 16px 20px;
}

.feature-pills {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 8px;
}

.pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: var(--radius-pill);
  box-shadow: var(--shadow-soft);
}

.pill-icon {
  font-size: 18px;
  line-height: 1;
}

.pill-text {
  font-size: 13px;
  font-weight: 700;
  color: var(--primary-dim);
}
</style>
