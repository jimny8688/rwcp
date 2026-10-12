<template>
  <div v-if="result" class="capture-root" :class="{ 'for-export': forExport }">
    <div
      class="passport-hero"
      :style="{ background: theme.gradient, '--glow': theme.glow }"
    >
      <div class="stamp" :class="{ stamped: showStamp }">SOUL MATCH</div>
      <div class="hero-emoji">{{ theme.emoji }}</div>
      <p class="hero-kicker">你的灵魂城市</p>
      <h1 class="hero-city">{{ result.primary.name }}</h1>
      <p class="hero-title">{{ result.primary.title }}</p>
      <p class="hero-tag">{{ result.primary.tagline }}</p>
      <div class="match-row">
        <span class="match-num">{{ displayMatch }}%</span>
        <div class="match-meta">
          <span>气质匹配度</span>
          <small>约 {{ result.primary.rarity }}% 灵魂旅人同型</small>
        </div>
      </div>
    </div>

    <div class="passport-section glass-inner">
      <p class="section-label">✦ 分享金句</p>
      <blockquote class="quote">「{{ result.primary.shareQuote }}」</blockquote>
    </div>

    <div class="passport-section glass-inner">
      <p class="section-label">✦ 六维气质雷达</p>
      <SoulRadar
        :values="result.userVector"
        :labels="result.radarLabels"
        :animated="!forExport"
      />
    </div>

    <div class="passport-section glass-inner">
      <p class="section-label">✦ 错位指数 {{ result.mismatch.value }}</p>
      <div class="mismatch-bar">
        <span
          class="mismatch-fill"
          :class="result.mismatch.level"
          :style="{ width: Math.min(100, result.mismatch.value) + '%' }"
        />
      </div>
      <p class="body">{{ result.mismatch.text }}</p>
      <p class="body dim">{{ result.priorityHint }}</p>
    </div>

    <div class="passport-section glass-inner dual">
      <div>
        <p class="section-label">副灵魂</p>
        <p class="body">
          <strong>{{ result.secondary.name }}</strong>
          <br />{{ result.secondary.title }}
        </p>
      </div>
      <div class="dual-badge">B 面</div>
    </div>

    <div class="passport-section glass-inner learn">
      <p class="section-label">📖 {{ result.primary.concept }}</p>
      <p class="body">{{ result.primary.conceptDesc }}</p>
    </div>

    <div class="passport-section glass-inner report">
      <div v-for="block in reportBlocks" :key="block.key" class="report-block">
        <span class="report-num">{{ block.num }}</span>
        <div>
          <strong>{{ block.title }}</strong>
          <p>{{ block.text }}</p>
        </div>
      </div>
    </div>

    <div class="passport-footer">
      <p>你的城市灵魂 · 重生你会锁哪座城？</p>
      <p v-if="shareId" class="share-id">#{{ shareId }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import SoulRadar from './SoulRadar.vue';
import { getCityTheme } from '../data/cityThemes.js';

const props = defineProps({
  result: { type: Object, required: true },
  shareId: { type: String, default: '' },
  forExport: { type: Boolean, default: false }
});

const theme = computed(() => getCityTheme(props.result.primary.id));
const showStamp = ref(false);
const displayMatch = ref(0);

const reportBlocks = computed(() => [
  { num: '①', key: 'a', title: '性格原型', text: props.result.primary.sections.archetype },
  { num: '②', key: 't', title: '思维方式', text: props.result.primary.sections.thinking },
  { num: '③', key: 'i', title: '现代启示', text: props.result.primary.sections.insight },
  { num: '④', key: 'r', title: '关系提示', text: props.result.primary.sections.relation }
]);

onMounted(() => {
  if (props.forExport) {
    displayMatch.value = props.result.primary.matchPercent;
    showStamp.value = true;
    return;
  }
  setTimeout(() => {
    showStamp.value = true;
  }, 400);
  const target = props.result.primary.matchPercent;
  const start = performance.now();
  const duration = 1200;
  function tick(now) {
    const t = Math.min(1, (now - start) / duration);
    const ease = 1 - Math.pow(1 - t, 4);
    displayMatch.value = Math.round(target * ease);
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
});
</script>

<style scoped>
.capture-root {
  border-radius: 20px;
  overflow: hidden;
  color: #fff;
}

.passport-hero {
  position: relative;
  padding: 28px 20px 24px;
  overflow: hidden;
  box-shadow: inset 0 -40px 60px rgba(0, 0, 0, 0.15);
}

.passport-hero::before {
  content: '';
  position: absolute;
  inset: -50%;
  background: radial-gradient(circle at 30% 20%, var(--glow), transparent 45%);
  pointer-events: none;
}

.stamp {
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.15em;
  padding: 8px 12px;
  border: 3px double rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.35);
  transform: rotate(12deg) scale(1.4);
  opacity: 0;
  transition: all 0.5s cubic-bezier(0.34, 1.5, 0.64, 1);
}

.stamp.stamped {
  opacity: 1;
  transform: rotate(-8deg) scale(1);
  color: rgba(255, 255, 255, 0.9);
  border-color: rgba(255, 209, 102, 0.8);
}

.hero-emoji {
  font-size: 40px;
  margin-bottom: 8px;
  animation: floatEmoji 3s ease-in-out infinite;
}

@keyframes floatEmoji {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}

.for-export .hero-emoji {
  animation: none;
}

.hero-kicker {
  margin: 0;
  font-size: 12px;
  letter-spacing: 0.2em;
  opacity: 0.85;
}

.hero-city {
  font-family: var(--font-display);
  font-size: 36px;
  font-weight: 900;
  margin: 4px 0 0;
  line-height: 1.15;
}

.hero-title {
  margin: 4px 0 0;
  font-size: 16px;
  font-weight: 700;
  color: #ffd166;
}

.hero-tag {
  margin: 10px 0 0;
  font-size: 14px;
  line-height: 1.55;
  opacity: 0.92;
}

.match-row {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.match-num {
  font-size: 48px;
  font-weight: 900;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
}

.match-meta {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  font-weight: 600;
}

.match-meta small {
  font-size: 11px;
  font-weight: 500;
  opacity: 0.75;
  margin-top: 4px;
}

.passport-section {
  margin: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.glass-inner {
  padding: 18px 20px;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(8px);
}

.section-label {
  margin: 0 0 10px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #ffd166;
}

.quote {
  margin: 0;
  font-family: var(--font-display);
  font-size: 16px;
  line-height: 1.65;
  font-weight: 600;
}

.body {
  margin: 0 0 8px;
  font-size: 14px;
  line-height: 1.7;
  opacity: 0.92;
}

.body.dim {
  opacity: 0.65;
  font-size: 13px;
}

.mismatch-bar {
  height: 6px;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 999px;
  margin-bottom: 12px;
  overflow: hidden;
}

.mismatch-fill {
  display: block;
  height: 100%;
  border-radius: 999px;
  transition: width 1s ease;
}

.mismatch-fill.low {
  background: #7dce82;
}
.mismatch-fill.mid {
  background: #ffd166;
}
.mismatch-fill.high {
  background: #ff6b6b;
}

.dual {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dual-badge {
  font-size: 28px;
  font-weight: 900;
  opacity: 0.15;
  font-family: var(--font-display);
}

.report-block {
  display: flex;
  gap: 12px;
  margin-bottom: 14px;
}

.report-block:last-child {
  margin-bottom: 0;
}

.report-num {
  font-size: 16px;
  font-weight: 900;
  color: #ffd166;
  flex-shrink: 0;
}

.report-block strong {
  display: block;
  font-size: 13px;
  margin-bottom: 4px;
}

.report-block p {
  margin: 0;
  font-size: 13px;
  line-height: 1.65;
  opacity: 0.88;
}

.passport-footer {
  text-align: center;
  padding: 16px;
  font-size: 11px;
  opacity: 0.5;
  background: rgba(0, 0, 0, 0.2);
}

.passport-footer p {
  margin: 0 0 4px;
}

.share-id {
  font-family: ui-monospace, monospace;
  letter-spacing: 0.1em;
}
</style>
