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
  color: rgba(255, 209, 102, 0.95);
}

.count {
  font-size: 20px;
  font-weight: 800;
  color: #fff;
  font-variant-numeric: tabular-nums;
}

.count small {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.45);
}

.track {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 999px;
  overflow: visible;
  position: relative;
}

.fill {
  height: 100%;
  background: linear-gradient(90deg, #2d8a6a, #ffd166, #ff9f43);
  border-radius: 999px;
  transition: width 0.45s cubic-bezier(0.34, 1.2, 0.64, 1);
  position: relative;
  box-shadow: 0 0 16px rgba(255, 209, 102, 0.45);
}

.dot {
  position: absolute;
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  background: #ffd166;
  border-radius: 50%;
  box-shadow: 0 0 12px rgba(255, 209, 102, 0.8);
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
  color: rgba(255, 255, 255, 0.35);
}

.ms.done {
  color: rgba(255, 209, 102, 0.85);
  font-weight: 600;
}
</style>
