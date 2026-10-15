<template>
  <div class="page result-page">
    <div v-if="loading" class="glass-card loading-card">
      <p>正在召回灵魂档案</p>
      <div class="loading-dots"><span /><span /><span /></div>
    </div>
    <div v-else-if="!result" class="glass-card light empty">
      <p>未找到测试结果</p>
      <button class="btn btn-primary" @click="goHome">返回首页</button>
    </div>

    <template v-else>
      <div v-if="revealed" class="confetti" aria-hidden="true">
        <span v-for="n in 24" :key="n" :style="confettiStyle(n)" />
      </div>

      <div ref="captureRef" class="result-wrap" :class="{ revealed }">
        <ResultContent :result="result" :share-id="shareId" :for-export="exportMode" />
      </div>

      <div class="sticky-actions action-grid">
        <button class="btn btn-primary btn-glow" :disabled="savingImage" @click="saveImage">
          {{ savingImage ? '绘制长图中…' : '📸 保存灵魂护照' }}
        </button>
        <button class="btn btn-secondary" @click="copyLink">🔗 复制分享链接</button>
        <div class="row-2">
          <button class="btn btn-outline on-dark" @click="retake">🔄 再测一次</button>
          <button class="btn btn-accent" @click="showReview = true">🎁 好评有礼</button>
        </div>
      </div>
    </template>

    <Transition name="route-fade">
      <div v-if="toast" class="toast">{{ toast }}</div>
    </Transition>

    <div v-if="showReview" class="modal-mask" @click.self="showReview = false">
      <div class="modal-panel review-modal">
        <div class="gift-icon">🎁</div>
        <h3>好评有礼</h3>
        <p>感谢完成灵魂导航！若体验不错，欢迎在购买平台为店铺留下<strong>好评</strong>。</p>
        <p>好评后请联系<strong>店铺客服</strong>，发送<strong>好评截图</strong>，核实后可获 <strong>1 元返现</strong>。</p>
        <p class="fine">请勿泄露测评密码；截图仅用于返现核实。</p>
        <button class="btn btn-primary" @click="showReview = false">我知道了</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import html2canvas from 'html2canvas';
import ResultContent from '../components/ResultContent.vue';
import { fetchResult, saveResult, startTest } from '../api.js';
import { absoluteAppUrl } from '../utils/appUrl.js';

const props = defineProps({
  id: { type: String, default: '' }
});

const route = useRoute();
const router = useRouter();
const result = ref(null);
const shareId = ref('');
const loading = ref(false);
const savingImage = ref(false);
const toast = ref('');
const showReview = ref(false);
const captureRef = ref(null);
const revealed = ref(false);
const exportMode = ref(false);

onMounted(async () => {
  const paramId = props.id || route.params.id;
  if (paramId) {
    loading.value = true;
    try {
      const res = await fetchResult(paramId);
      if (res.ok && res.data?.result) {
        result.value = res.data.result;
        shareId.value = paramId;
        setTimeout(() => {
          revealed.value = true;
        }, 100);
      }
    } catch {
      /* ignore */
    } finally {
      loading.value = false;
    }
    return;
  }

  const local = sessionStorage.getItem('citySoulResult');
  if (local) {
    result.value = JSON.parse(local);
    await ensureShareId();
    setTimeout(() => {
      revealed.value = true;
    }, 100);
  }
});

function confettiStyle(n) {
  const left = (n * 17) % 100;
  const delay = (n % 8) * 0.12;
  const hue = (n * 40) % 360;
  return {
    left: `${left}%`,
    animationDelay: `${delay}s`,
    background: `hsl(${hue}, 85%, 60%)`
  };
}

async function ensureShareId() {
  if (shareId.value) return shareId.value;
  const session = JSON.parse(sessionStorage.getItem('citySoulSession') || '{}');
  const answers = JSON.parse(sessionStorage.getItem('citySoulAnswers') || '{}');
  const preAnswers = JSON.parse(sessionStorage.getItem('citySoulPre') || '{}');
  try {
    const res = await saveResult({
      passwordCode: session.code || null,
      preAnswers,
      answers,
      result: result.value
    });
    if (res.ok) {
      shareId.value = res.id;
      router.replace({ name: 'result-share', params: { id: res.id } });
    }
  } catch {
    /* offline share ok */
  }
  return shareId.value;
}

function showToast(msg) {
  toast.value = msg;
  setTimeout(() => {
    toast.value = '';
  }, 2600);
}

async function saveImage() {
  if (!captureRef.value) return;
  savingImage.value = true;
  exportMode.value = true;
  await new Promise((r) => setTimeout(r, 450));
  try {
    await ensureShareId();
    const canvas = await html2canvas(captureRef.value, {
      scale: Math.min(window.devicePixelRatio || 2, 2),
      useCORS: true,
      backgroundColor: '#d4c4f5',
      scrollY: -window.scrollY,
      windowWidth: document.documentElement.scrollWidth
    });
    const dataUrl = canvas.toDataURL('image/png');
    const fileName = `城市灵魂-${result.value.primary.name}-${Date.now()}.png`;

    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], fileName, { type: 'image/png' });

    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: '我的城市灵魂测评' });
        showToast('已打开分享，可选择保存到相册');
        return;
      } catch {
        /* fall through */
      }
    }

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = fileName;
    link.click();
    showToast('长图已下载');
  } catch {
    showToast('生成失败，请截屏保存');
  } finally {
    exportMode.value = false;
    savingImage.value = false;
  }
}

async function copyLink() {
  await ensureShareId();
  const url = shareId.value ? absoluteAppUrl(`r/${shareId.value}`) : window.location.href;
  try {
    await navigator.clipboard.writeText(url);
    showToast('链接已复制，发给好友一起看');
  } catch {
    showToast(url);
  }
}

async function retake() {
  const session = sessionStorage.getItem('citySoulSession');
  if (!session) {
    router.push('/');
    return;
  }
  const parsed = JSON.parse(session);
  try {
    const start = await startTest(parsed.code);
    if (!start.ok) {
      showToast(start.message || '次数已用完');
      setTimeout(() => router.push('/'), 1600);
      return;
    }
    parsed.remaining = start.remaining;
    sessionStorage.setItem('citySoulSession', JSON.stringify(parsed));
  } catch {
    showToast('网络异常');
    return;
  }
  sessionStorage.removeItem('citySoulAnswers');
  sessionStorage.removeItem('citySoulPre');
  sessionStorage.removeItem('citySoulResult');
  sessionStorage.removeItem('citySoulQuizIndex');
  sessionStorage.removeItem('citySoulQuestionOrder');
  shareId.value = '';
  router.push('/quiz');
}

function goHome() {
  router.push('/');
}
</script>

<style scoped>
.result-page {
  padding-bottom: 8px;
}

.loading-card,
.empty {
  text-align: center;
  color: var(--primary-dim);
}

.loading-card p,
.empty p {
  margin: 0 0 12px;
}

.empty {
  color: var(--text-dark);
}

.result-wrap {
  opacity: 0;
  transform: translateY(16px) scale(0.98);
  transition: all 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}

.result-wrap.revealed {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.review-modal {
  text-align: center;
}

.gift-icon {
  font-size: 48px;
  margin-bottom: 8px;
  animation: floatGift 2s ease-in-out infinite;
}

@keyframes floatGift {
  0%,
  100% {
    transform: translateY(0) rotate(-5deg);
  }
  50% {
    transform: translateY(-8px) rotate(5deg);
  }
}

.fine {
  font-size: 12px !important;
  opacity: 0.7;
}

.confetti {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 50;
  overflow: hidden;
}

.confetti span {
  position: absolute;
  top: -10px;
  width: 8px;
  height: 8px;
  border-radius: 2px;
  animation: confettiFall 2.5s ease-out forwards;
}

@keyframes confettiFall {
  to {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}
</style>
