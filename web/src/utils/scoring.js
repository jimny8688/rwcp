import { CITY_PROFILES, LIVE_REGION_PROFILES } from '../data/cities.js';
import { questions, preQuestions } from '../data/questions.js';

const DIMS = ['R', 'S', 'V', 'E', 'T', 'A'];
const MAX_RAW = questions.length * 2;

function achievementAdjust(raw, count) {
  if (!count) return raw;
  const penalty = Math.min(count * 3, 25);
  return { ...raw, V: Math.max(0, raw.V - penalty) };
}

export function computeResult(preAnswers, answerMap) {
  const raw = { R: 0, S: 0, V: 50, E: 0, T: 0, A: 0 };
  let achievementPicks = 0;

  for (const q of questions) {
    const idx = answerMap[q.id];
    if (idx === undefined || idx === null) continue;
    const opt = q.options[idx];
    if (!opt) continue;
    for (const d of DIMS) {
      raw[d] += opt.deltas?.[d] ?? 0;
    }
    if (opt.vBias === 'achievement') achievementPicks += 1;
  }

  const adjusted = achievementAdjust(raw, achievementPicks);
  const userVector = {};
  for (const d of DIMS) {
    userVector[d] = Math.round((adjusted[d] / MAX_RAW) * 100);
    if (d === 'V' && achievementPicks > 0) {
      userVector[d] = Math.min(100, Math.max(0, userVector[d]));
    }
  }

  const ranked = CITY_PROFILES.map((city) => ({
    city,
    similarity: cosineSimilarity(userVector, city.vector),
    distance: euclidean(userVector, city.vector)
  }))
    .sort((a, b) => b.similarity - a.similarity);

  const primary = ranked[0];
  const secondary = ranked[1];
  const matchPercent = Math.round(82 + primary.similarity * 14);

  const liveKey = preAnswers.liveRegion || 'tier2';
  const liveVector = LIVE_REGION_PROFILES[liveKey] || LIVE_REGION_PROFILES.tier2;
  const mismatch = Math.round(euclidean(userVector, liveVector));
  const mismatchLevel =
    mismatch <= 28 ? 'low' : mismatch <= 48 ? 'mid' : 'high';
  const mismatchText = {
    low: '容器较匹配：你选的城市气质，和现居环境差距不大。重点是把优势活满。',
    mid: '中度错位：你在用额外意志力适配。留意睡眠、易怒与「不想社交」的信号。',
    high: '高度错位：灵魂气质与现居默认节奏不一致。不必立刻搬家，可找「城中之城」补能量。'
  }[mismatchLevel];

  const priorityHint = {
    career: '你当前优先事业上升，与拓荒/契约型灵魂共振时，记得留恢复性环境。',
    health: '你优先睡眠与情绪——慢节奏与高自然维度对你不是奢侈品，是处方。',
    love: '你优先关系质量——社交维度与「第三空间」设定，比换城更先见效。',
    family: '你优先家庭——传统维度与熟人节奏要纳入真实决策，不只是情怀。',
    time: '你优先自由时间——与高自由灵魂匹配时，请把「可支配时间」写进日程。'
  }[preAnswers.priority || 'health'];

  return {
    userVector,
    primary: {
      ...primary.city,
      matchPercent,
      similarity: primary.similarity
    },
    secondary: {
      id: secondary.city.id,
      name: secondary.city.name,
      title: secondary.city.title
    },
    mismatch: { value: mismatch, level: mismatchLevel, text: mismatchText },
    priorityHint,
    radarLabels: {
      R: '慢节奏',
      S: '社交热',
      V: '享乐自由',
      E: '自然市井',
      T: '传统根',
      A: '精致文艺'
    }
  };
}

function cosineSimilarity(a, b) {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (const d of DIMS) {
    dot += a[d] * b[d];
    na += a[d] * a[d];
    nb += b[d] * b[d];
  }
  if (!na || !nb) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

function euclidean(a, b) {
  let sum = 0;
  for (const d of DIMS) {
    const diff = (a[d] ?? 0) - (b[d] ?? 0);
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}

export function allQuestionCount() {
  return preQuestions.length + questions.length;
}
