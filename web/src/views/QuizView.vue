<template>
  <div class="page quiz-page">
    <CompassProgress
      v-if="totalSteps"
      :current="currentIndex + 1"
      :total="totalSteps"
      :stage-label="stageLabel"
    />

    <Transition v-if="currentQuestion" name="quiz-slide" mode="out-in">
      <div :key="currentQuestion.id" class="glass-card light quiz-card">
        <div class="q-meta">
          <span class="q-tag">{{ stageEmoji }} {{ stageLabel }}</span>
          <span class="q-id">Q{{ displayNum }}</span>
        </div>
        <h2 class="q-title">{{ currentQuestion.text }}</h2>

        <div class="options">
          <button
            v-for="(opt, idx) in currentQuestion.options"
            :key="idx"
            type="button"
            class="option"
            :class="{ selected: answers[currentQuestion.id] === idx, pop: popIndex === idx }"
            @click="selectOption(idx)"
          >
            <span class="option-letter">{{ letters[idx] }}</span>
            <span class="option-text">{{ opt.label }}</span>
          </button>
        </div>

        <div class="quiz-actions">
          <button type="button" class="btn btn-outline" :disabled="currentIndex === 0" @click="prev">
            ← 上一题
          </button>
          <button
            type="button"
            class="btn btn-primary"
            :disabled="answers[currentQuestion.id] === undefined"
            @click="next"
          >
            {{ isLast ? '🎉 揭晓灵魂城市' : '下一题 →' }}
          </button>
        </div>
      </div>
    </Transition>

    <Transition name="quiz-slide">
      <div v-if="finishing" class="finishing glass-card">
        <p>正在绘制你的灵魂地图</p>
        <div class="loading-dots"><span /><span /><span /></div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import CompassProgress from '../components/CompassProgress.vue';
import { preQuestions } from '../data/questions.js';
import { computeResult } from '../utils/scoring.js';
import { getShuffledSituationalQuestions } from '../utils/quizFlow.js';

const router = useRouter();
const flow = ref([]);
const totalSteps = computed(() => flow.value.length);
const currentIndex = ref(0);
const answers = reactive({});
const preAnswers = reactive({});
const popIndex = ref(-1);
const finishing = ref(false);
const letters = ['A', 'B', 'C', 'D'];

const currentQuestion = computed(() => flow.value[currentIndex.value]);
const isLast = computed(() => currentIndex.value === totalSteps.value - 1);
const displayNum = computed(() =>
  currentIndex.value < preQuestions.length
    ? currentIndex.value + 1
    : currentIndex.value + 1 - preQuestions.length
);
const stageLabel = computed(() =>
  currentIndex.value < preQuestions.length ? '登舰 · 基础信息' : '巡航 · 情境选择'
);
const stageEmoji = computed(() => (currentIndex.value < preQuestions.length ? '⚓' : '🛤️'));

onMounted(() => {
  const session = sessionStorage.getItem('citySoulSession');
  if (!session) {
    router.replace('/');
    return;
  }
  flow.value = [...preQuestions, ...getShuffledSituationalQuestions()];
  try {
    const savedPre = JSON.parse(sessionStorage.getItem('citySoulPre') || '{}');
    const savedAns = JSON.parse(sessionStorage.getItem('citySoulAnswers') || '{}');
    Object.assign(preAnswers, savedPre);
    Object.assign(answers, savedAns);
    const savedIdx = sessionStorage.getItem('citySoulQuizIndex');
    if (savedIdx) {
      currentIndex.value = Math.min(Number(savedIdx), totalSteps.value - 1);
    }
  } catch {
    /* ignore */
  }
});

function persist() {
  sessionStorage.setItem('citySoulPre', JSON.stringify({ ...preAnswers }));
  sessionStorage.setItem('citySoulAnswers', JSON.stringify({ ...answers }));
  sessionStorage.setItem('citySoulQuizIndex', String(currentIndex.value));
}

function selectOption(idx) {
  const q = currentQuestion.value;
  answers[q.id] = idx;
  if (preQuestions.some((p) => p.id === q.id)) {
    preAnswers[q.id] = q.options[idx].value;
  }
  popIndex.value = idx;
  setTimeout(() => {
    popIndex.value = -1;
  }, 320);
  persist();
  if (navigator.vibrate) navigator.vibrate(8);
}

function prev() {
  if (currentIndex.value > 0) {
    currentIndex.value -= 1;
    persist();
  }
}

function next() {
  if (answers[currentQuestion.value.id] === undefined) return;
  if (isLast.value) {
    finish();
    return;
  }
  currentIndex.value += 1;
  persist();
}

function finish() {
  finishing.value = true;
  setTimeout(() => {
    const result = computeResult({ ...preAnswers }, { ...answers });
    sessionStorage.setItem('citySoulResult', JSON.stringify(result));
    sessionStorage.removeItem('citySoulQuizIndex');
    router.push({ name: 'result-local' });
  }, 900);
}
</script>

<style scoped>
.quiz-page {
  padding-top: 8px;
}

.quiz-card {
  min-height: 320px;
}

.q-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.q-tag {
  font-size: 12px;
  font-weight: 700;
  color: var(--primary);
}

.q-id {
  font-size: 11px;
  font-weight: 800;
  color: #94a3b8;
  font-family: ui-monospace, monospace;
}

.q-title {
  font-family: var(--font-display);
  font-size: 18px;
  line-height: 1.55;
  margin: 0 0 18px;
  color: var(--text-dark);
}

.option.pop {
  animation: optPop 0.32s ease;
}

@keyframes optPop {
  0% {
    transform: scale(1);
  }
  40% {
    transform: scale(1.02);
  }
  100% {
    transform: translateX(6px);
  }
}

.option-text {
  flex: 1;
}

.finishing {
  text-align: center;
  margin-top: 12px;
  color: var(--primary-dim);
}

.finishing p {
  margin: 0 0 12px;
  font-size: 14px;
  color: var(--primary-deep);
}
</style>
