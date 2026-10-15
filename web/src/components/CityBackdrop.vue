<template>
  <div class="backdrop" aria-hidden="true">
    <div class="sky" />
    <div class="cloud cloud-a" />
    <div class="cloud cloud-b" />
    <div class="cloud cloud-c" />
    <div class="stars" />
    <div v-if="showFloaters" class="sparkles" />
  </div>
</template>

<script setup>
defineProps({
  showFloaters: { type: Boolean, default: true }
});
</script>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.sky {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    #ffe8d6 0%,
    #f0e0ff 22%,
    #dccff5 48%,
    #bfaef2 72%,
    #9b8ad4 100%
  );
}

.cloud {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.35));
  filter: blur(2px);
  opacity: 0.85;
}

.cloud-a {
  width: 140%;
  height: 28vh;
  left: -20%;
  top: 38%;
  animation: drift 28s ease-in-out infinite alternate;
}

.cloud-b {
  width: 120%;
  height: 22vh;
  left: -10%;
  top: 52%;
  opacity: 0.7;
  animation: drift 22s ease-in-out infinite alternate-reverse;
}

.cloud-c {
  width: 90%;
  height: 18vh;
  right: -15%;
  top: 18%;
  opacity: 0.55;
  animation: drift 32s ease-in-out infinite alternate;
}

@keyframes drift {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(24px);
  }
}

.stars {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(1.5px 1.5px at 18% 22%, rgba(255, 255, 255, 0.9), transparent),
    radial-gradient(1px 1px at 72% 18%, rgba(255, 255, 255, 0.75), transparent),
    radial-gradient(1.5px 1.5px at 45% 12%, rgba(255, 255, 255, 0.65), transparent),
    radial-gradient(1px 1px at 88% 35%, rgba(255, 255, 255, 0.5), transparent),
    radial-gradient(1px 1px at 8% 45%, rgba(255, 255, 255, 0.45), transparent);
  animation: twinkle 5s ease-in-out infinite alternate;
}

@keyframes twinkle {
  from {
    opacity: 0.55;
  }
  to {
    opacity: 1;
  }
}

.sparkles {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(2px 2px at 25% 60%, rgba(255, 255, 255, 0.8), transparent),
    radial-gradient(2px 2px at 60% 70%, rgba(255, 255, 255, 0.6), transparent),
    radial-gradient(1.5px 1.5px at 80% 55%, rgba(255, 255, 255, 0.7), transparent);
  animation: twinkle 4s ease-in-out infinite alternate-reverse;
}
</style>
