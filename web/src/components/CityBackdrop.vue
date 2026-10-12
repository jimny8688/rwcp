<template>
  <div class="backdrop" aria-hidden="true">
    <div class="mesh" />
    <div class="stars" />
    <div class="skyline">
      <svg viewBox="0 0 400 120" preserveAspectRatio="xMidYMax slice">
        <path
          class="mountain"
          d="M0,120 L0,80 Q50,40 100,70 T200,50 T300,65 T400,45 L400,120 Z"
        />
        <g class="buildings">
          <rect x="20" y="55" width="28" height="65" rx="2" />
          <rect x="55" y="40" width="22" height="80" rx="2" />
          <rect x="85" y="62" width="35" height="58" rx="2" />
          <rect x="130" y="35" width="18" height="85" rx="2" />
          <rect x="155" y="50" width="40" height="70" rx="2" />
          <rect x="205" y="42" width="25" height="78" rx="2" />
          <rect x="240" y="58" width="32" height="62" rx="2" />
          <rect x="285" y="30" width="20" height="90" rx="2" />
          <rect x="315" y="48" width="38" height="72" rx="2" />
          <rect x="360" y="52" width="30" height="68" rx="2" />
        </g>
      </svg>
    </div>
    <div v-if="showFloaters" class="float-tags">
      <span v-for="(tag, i) in tags" :key="tag" class="tag" :style="tagStyle(i)">{{ tag }}</span>
    </div>
    <div class="compass-deco">
      <div class="ring" />
      <span class="needle">N</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  showFloaters: { type: Boolean, default: true }
});

const tags = ['成都', '重庆', '杭州', '西安', '厦门', '深圳', '上海', '广州', '南京', '大理'];

function tagStyle(i) {
  const left = 8 + (i * 9) % 84;
  const delay = i * 0.7;
  const duration = 14 + (i % 5) * 2;
  return {
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  };
}
</script>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.mesh {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 50% at 50% -10%, rgba(255, 209, 102, 0.22), transparent 55%),
    radial-gradient(ellipse 60% 40% at 90% 20%, rgba(45, 138, 106, 0.25), transparent 50%),
    radial-gradient(ellipse 50% 35% at 10% 30%, rgba(99, 179, 237, 0.18), transparent 45%),
    linear-gradient(180deg, #0a1628 0%, #0f2847 35%, #143d52 70%, #1a4d4a 100%);
}

.stars {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(1px 1px at 20% 30%, rgba(255, 255, 255, 0.7), transparent),
    radial-gradient(1px 1px at 60% 15%, rgba(255, 255, 255, 0.5), transparent),
    radial-gradient(1.5px 1.5px at 80% 40%, rgba(255, 255, 255, 0.6), transparent),
    radial-gradient(1px 1px at 40% 55%, rgba(255, 255, 255, 0.4), transparent),
    radial-gradient(1px 1px at 15% 70%, rgba(255, 255, 255, 0.35), transparent);
  animation: twinkle 6s ease-in-out infinite alternate;
}

@keyframes twinkle {
  from {
    opacity: 0.6;
  }
  to {
    opacity: 1;
  }
}

.skyline {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 28vh;
  min-height: 120px;
  opacity: 0.35;
}

.skyline svg {
  width: 100%;
  height: 100%;
}

.mountain {
  fill: rgba(15, 40, 55, 0.9);
}

.buildings {
  fill: rgba(255, 255, 255, 0.08);
}

.float-tags {
  position: absolute;
  inset: 0;
}

.tag {
  position: absolute;
  bottom: -20px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.35);
  padding: 4px 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(4px);
  animation: floatUp linear infinite;
  white-space: nowrap;
}

@keyframes floatUp {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  8% {
    opacity: 0.7;
  }
  92% {
    opacity: 0.5;
  }
  100% {
    transform: translateY(-85vh) translateX(12px);
    opacity: 0;
  }
}

.compass-deco {
  position: absolute;
  top: 12%;
  right: 8%;
  width: 56px;
  height: 56px;
  opacity: 0.2;
}

.ring {
  width: 100%;
  height: 100%;
  border: 2px dashed rgba(255, 209, 102, 0.6);
  border-radius: 50%;
  animation: spin 24s linear infinite;
}

.needle {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 800;
  color: #ffd166;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
