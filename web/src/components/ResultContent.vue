<template>

  <div v-if="result" class="capture-root" :class="{ 'for-export': forExport }">

    <p class="report-brand">✦ 城市灵魂 · 深度解析报告 ✦</p>



    <div class="report-sheet">

      <div

        class="passport-hero"

        :style="heroStyle"

      >

        <div class="stamp" :class="{ stamped: showStamp }">SOUL MATCH</div>

        <div class="hero-emoji">{{ theme.emoji }}</div>

        <p class="hero-kicker">你的灵魂城市</p>

        <h1 class="hero-city">{{ result.primary.name }}</h1>

        <p class="hero-title">{{ result.primary.title }}</p>

        <p class="hero-tag">{{ result.primary.tagline }}</p>

      </div>



      <div class="kpi-row">

        <div class="kpi-card primary-kpi">

          <span class="kpi-value">{{ displayMatch }}%</span>

          <span class="kpi-label">气质匹配度</span>

        </div>

        <div class="kpi-card">

          <span class="kpi-value sm">约 {{ result.primary.rarity }}%</span>

          <span class="kpi-label">灵魂旅人同型稀有度</span>

        </div>

      </div>



      <div class="report-section quote-section">

        <p class="section-label"><span class="label-pill">分享金句</span></p>

        <blockquote class="quote">「{{ result.primary.shareQuote }}」</blockquote>

      </div>



      <div class="report-section">

        <p class="section-label"><span class="label-pill">六维气质雷达</span></p>

        <SoulRadar

          :values="result.userVector"

          :labels="result.radarLabels"

          :animated="!forExport"

          variant="light"

        />

      </div>



      <div class="report-section">

        <p class="section-label">

          <span class="label-pill">错位指数 · {{ result.mismatch.value }}</span>

        </p>

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



      <div class="report-section dual">

        <div>

          <p class="section-label"><span class="label-pill">副灵魂 · B 面</span></p>

          <p class="body">

            <strong>{{ result.secondary.name }}</strong>

            · {{ result.secondary.title }}

          </p>

        </div>

        <span class="dual-emoji">{{ secondaryTheme.emoji }}</span>

      </div>



      <div class="report-section learn">

        <p class="section-label"><span class="label-pill">📖 {{ result.primary.concept }}</span></p>

        <p class="body">{{ result.primary.conceptDesc }}</p>

      </div>



      <div class="report-section report-modules">

        <p class="section-label"><span class="label-pill">四段深度解读</span></p>

        <div v-for="block in reportBlocks" :key="block.key" class="report-block">

          <span class="report-icon" aria-hidden="true">{{ block.icon }}</span>

          <div class="report-block-inner">

            <strong>{{ block.num }} {{ block.title }}</strong>

            <p>{{ block.text }}</p>

          </div>

        </div>

      </div>



      <div class="passport-footer">

        <p class="footer-title">你的城市灵魂 · 重生你会锁哪座城？</p>

        <p class="footer-disclaimer">趣味生活方式匹配 · 仅供自我探索</p>

        <p v-if="shareId" class="share-id">报告编号 #{{ shareId }}</p>

      </div>

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

const secondaryTheme = computed(() => getCityTheme(props.result.secondary.id));

const heroStyle = computed(() => {
  const t = theme.value;
  const overlay =
    'linear-gradient(145deg, rgba(25, 20, 50, 0.55) 0%, rgba(25, 20, 50, 0.25) 48%, rgba(25, 20, 50, 0.68) 100%)';
  if (t.heroImage) {
    return {
      '--glow': t.glow,
      backgroundImage: `${overlay}, url("${t.heroImage}")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center center'
    };
  }
  return { background: t.gradient, '--glow': t.glow };
});

const showStamp = ref(false);

const displayMatch = ref(0);



const reportBlocks = computed(() => [

  { num: '①', icon: '🎭', key: 'a', title: '性格原型', text: props.result.primary.sections.archetype },

  { num: '②', icon: '🧠', key: 't', title: '思维方式', text: props.result.primary.sections.thinking },

  { num: '③', icon: '💡', key: 'i', title: '现代启示', text: props.result.primary.sections.insight },

  { num: '④', icon: '💞', key: 'r', title: '关系提示', text: props.result.primary.sections.relation }

]);



onMounted(() => {
  const heroImg = theme.value.heroImage;
  if (heroImg) {
    const preload = new Image();
    preload.src = heroImg;
  }

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

  padding: 12px 10px 16px;

  border-radius: 24px;

  background: linear-gradient(165deg, #ffe8d6 0%, #e8d4ff 35%, #c9b8f0 70%, #b0a0e8 100%);

  box-shadow: var(--shadow-soft);

}



.report-brand {

  margin: 0 0 10px;

  text-align: center;

  font-size: 11px;

  font-weight: 800;

  letter-spacing: 0.12em;

  color: var(--primary-dim);

}



.report-sheet {

  border-radius: 20px;

  overflow: hidden;

  background: #fff;

  box-shadow: 0 12px 40px rgba(93, 74, 138, 0.18);

  border: 1px solid rgba(255, 255, 255, 0.9);

}



.passport-hero {

  position: relative;

  padding: 26px 20px 22px;

  min-height: 200px;

  overflow: hidden;

  color: #fff;

  box-shadow: inset 0 -30px 50px rgba(0, 0, 0, 0.12);

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

  top: 14px;

  right: 14px;

  font-size: 9px;

  font-weight: 900;

  letter-spacing: 0.14em;

  padding: 7px 11px;

  border: 3px double rgba(255, 255, 255, 0.45);

  border-radius: 8px;

  color: rgba(255, 255, 255, 0.35);

  transform: rotate(12deg) scale(1.35);

  opacity: 0;

  transition: all 0.5s cubic-bezier(0.34, 1.5, 0.64, 1);

}



.stamp.stamped {

  opacity: 1;

  transform: rotate(-8deg) scale(1);

  color: rgba(255, 255, 255, 0.95);

  border-color: rgba(255, 255, 255, 0.85);

  box-shadow: 0 0 20px rgba(138, 116, 207, 0.5);

}



.hero-emoji {

  font-size: 42px;

  margin-bottom: 6px;

  position: relative;

  z-index: 1;

  animation: floatEmoji 3s ease-in-out infinite;

  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2));

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

  font-size: 11px;

  letter-spacing: 0.22em;

  opacity: 0.9;

  position: relative;

  z-index: 1;

}



.hero-city {

  font-family: var(--font-display);

  font-size: 34px;

  font-weight: 900;

  margin: 4px 0 0;

  line-height: 1.15;

  position: relative;

  z-index: 1;

  text-shadow: 0 2px 16px rgba(0, 0, 0, 0.2);

}



.hero-title {

  margin: 6px 0 0;

  font-size: 16px;

  font-weight: 800;

  color: rgba(255, 255, 255, 0.95);

  position: relative;

  z-index: 1;

}



.hero-tag {

  margin: 10px 0 0;

  font-size: 14px;

  line-height: 1.55;

  opacity: 0.92;

  position: relative;

  z-index: 1;

}



.kpi-row {

  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 10px;

  padding: 14px 16px 4px;

  background: linear-gradient(180deg, #f8f4ff 0%, #fff 100%);

}



.kpi-card {

  padding: 12px 14px;

  border-radius: 16px;

  background: #fff;

  border: 1px solid rgba(138, 116, 207, 0.15);

  box-shadow: 0 4px 14px rgba(138, 116, 207, 0.08);

}



.kpi-card.primary-kpi {

  border-color: rgba(138, 116, 207, 0.35);

  background: linear-gradient(145deg, #f3eeff, #fff);

}



.kpi-value {

  display: block;

  font-size: 32px;

  font-weight: 900;

  line-height: 1;

  color: var(--primary-deep);

  font-variant-numeric: tabular-nums;

}



.kpi-value.sm {

  font-size: 22px;

}



.kpi-label {

  display: block;

  margin-top: 6px;

  font-size: 11px;

  font-weight: 700;

  color: var(--muted-dark);

  line-height: 1.35;

}



.report-section {

  padding: 16px 18px;

  border-top: 1px solid rgba(138, 116, 207, 0.1);

  color: var(--text-dark);

}



.quote-section {

  background: #fff;

}



.section-label {

  margin: 0 0 12px;

}



.label-pill {

  display: inline-block;

  font-size: 11px;

  font-weight: 800;

  letter-spacing: 0.06em;

  color: #fff;

  background: linear-gradient(135deg, var(--primary-deep), var(--primary));

  padding: 6px 14px;

  border-radius: var(--radius-pill);

  box-shadow: 0 4px 12px rgba(109, 90, 168, 0.25);

}



.quote {

  margin: 0;

  font-family: var(--font-display);

  font-size: 16px;

  line-height: 1.65;

  font-weight: 600;

  color: var(--primary-dim);

}



.body {

  margin: 0 0 8px;

  font-size: 14px;

  line-height: 1.72;

  color: var(--text-dark);

}



.body.dim {

  color: var(--muted-dark);

  font-size: 13px;

}



.mismatch-bar {

  height: 8px;

  background: rgba(138, 116, 207, 0.15);

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

  background: linear-gradient(90deg, #7dce82, #5cb87a);

}

.mismatch-fill.mid {

  background: linear-gradient(90deg, #bfaef2, var(--primary));

}

.mismatch-fill.high {

  background: linear-gradient(90deg, #e0567a, #ff6b6b);

}



.dual {

  display: flex;

  justify-content: space-between;

  align-items: center;

  gap: 12px;

  background: #faf8ff;

}



.dual-emoji {

  font-size: 36px;

  flex-shrink: 0;

  opacity: 0.9;

}



.learn {

  background: #f3eeff;

}



.report-modules {

  padding-bottom: 18px;

}



.report-block {

  display: flex;

  gap: 12px;

  margin-bottom: 12px;

  padding: 12px 14px;

  border-radius: 16px;

  background: #faf8ff;

  border-left: 4px solid var(--primary);

}



.report-block:last-child {

  margin-bottom: 0;

}



.report-icon {

  font-size: 22px;

  line-height: 1;

  flex-shrink: 0;

}



.report-block-inner strong {

  display: block;

  font-size: 13px;

  font-weight: 800;

  color: var(--primary-dim);

  margin-bottom: 6px;

}



.report-block-inner p {

  margin: 0;

  font-size: 13px;

  line-height: 1.68;

  color: var(--text-dark);

}



.passport-footer {

  text-align: center;

  padding: 16px 18px 18px;

  background: linear-gradient(180deg, #f0e8ff, #e8dcff);

  border-top: 1px solid rgba(138, 116, 207, 0.15);

}



.footer-title {

  margin: 0 0 6px;

  font-size: 12px;

  font-weight: 800;

  color: var(--primary-dim);

}



.footer-disclaimer {

  margin: 0 0 8px;

  font-size: 10px;

  color: var(--muted-dark);

}



.share-id {

  margin: 0;

  font-family: ui-monospace, monospace;

  font-size: 11px;

  font-weight: 700;

  letter-spacing: 0.08em;

  color: var(--primary-deep);

}

</style>

