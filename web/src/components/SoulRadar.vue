<template>
  <div class="soul-radar">
    <div v-for="d in dimKeys" :key="d" class="row">
      <span class="label">{{ labels[d] }}</span>
      <div class="bar-wrap">
        <div
          class="bar"
          :class="{ animate: animated }"
          :style="{
            '--target': values[d] + '%',
            '--delay': delayMap[d],
            width: animated ? undefined : values[d] + '%'
          }"
        />
      </div>
      <span class="num">{{ displayValues[d] }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, watch } from 'vue';

const props = defineProps({
  values: { type: Object, required: true },
  labels: { type: Object, required: true },
  animated: { type: Boolean, default: true }
});

const dimKeys = ['R', 'S', 'V', 'E', 'T', 'A'];
const delayMap = { R: '0s', S: '0.06s', V: '0.12s', E: '0.18s', T: '0.24s', A: '0.3s' };

const displayValues = reactive({ R: 0, S: 0, V: 0, E: 0, T: 0, A: 0 });

function runCountUp() {
  const start = performance.now();
  const duration = 900;
  const from = { ...displayValues };
  const target = props.values;

  function frame(now) {
    const t = Math.min(1, (now - start) / duration);
    const ease = 1 - Math.pow(1 - t, 3);
    for (const d of dimKeys) {
      displayValues[d] = Math.round(from[d] + (target[d] - from[d]) * ease);
    }
    if (t < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

onMounted(() => {
  if (props.animated) runCountUp();
  else Object.assign(displayValues, props.values);
});

watch(
  () => props.values,
  () => {
    if (props.animated) runCountUp();
  },
  { deep: true }
);
</script>

<style scoped>
.soul-radar {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.row {
  display: grid;
  grid-template-columns: 64px 1fr 32px;
  align-items: center;
  gap: 8px;
}

.label {
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.75);
}

.bar-wrap {
  height: 8px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 999px;
  overflow: hidden;
}

.bar {
  height: 100%;
  width: 0;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.5), var(--primary));
}

.bar.animate {
  animation: grow 0.9s cubic-bezier(0.34, 1.2, 0.64, 1) forwards;
  animation-delay: var(--delay);
}

@keyframes grow {
  to {
    width: var(--target);
  }
}

.num {
  font-size: 13px;
  font-weight: 800;
  color: var(--primary-deep);
  text-align: right;
  font-variant-numeric: tabular-nums;
}
</style>
