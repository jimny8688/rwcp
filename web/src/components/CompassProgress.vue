<template>
  <div class="compass-progress">
    <div class="top">
      <span class="stage">{{ stageLabel }}</span>
      <span class="count">{{ current }}<small>/{{ total }}</small></span>
    </div>
    <div class="track">
      <div class="fill" :style="{ width: percent + '%' }">
        <span class="dot" />
      </div>
    </div>
    <div class="milestones">
      <span
        v-for="(m, i) in milestones"
        :key="m"
        class="ms"
        :class="{ done: percent >= m }"
      >{{ labels[i] }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  current: { type: Number, required: true },
  total: { type: Number, required: true },
  stageLabel: { type: String, default: '灵魂航线' }
});

const percent = computed(() => (props.current / props.total) * 100);
const milestones = [25, 50, 75, 100];
const labels = ['启程', '识城', '深潜', '靠岸'];
</script>

<style scoped>
.compass-progress {
  margin-bottom: 16px;
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 8px;
}

.stage {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--primary-deep);
}

.count {
  font-size: 20px;
  font-weight: 800;
  color: var(--primary-dim);
  font-variant-numeric: tabular-nums;
}

.count small {
  font-size: 13px;
  font-weight: 600;
  color: var(--muted);
}

.track {
  height: 8px;
  background: rgba(138, 116, 207, 0.2);
  border-radius: 999px;
  overflow: visible;
  position: relative;
}

.fill {
  height: 100%;
  background: linear-gradient(90deg, #bfaef2, #8a74cf, #6d5aa8);
  border-radius: 999px;
  transition: width 0.45s cubic-bezier(0.34, 1.2, 0.64, 1);
  position: relative;
  box-shadow: 0 0 16px rgba(138, 116, 207, 0.45);
}

.dot {
  position: absolute;
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  background: var(--primary);
  border-radius: 50%;
  box-shadow: 0 0 12px rgba(138, 116, 207, 0.65);
  animation: pulse 1.5s ease infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: translateY(-50%) scale(1);
  }
  50% {
    transform: translateY(-50%) scale(1.15);
  }
}

.milestones {
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
  font-size: 10px;
  color: var(--muted);
}

.ms.done {
  color: var(--primary-deep);
  font-weight: 600;
}
</style>
