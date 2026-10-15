import { questions } from '../data/questions.js';

const ORDER_KEY = 'citySoulQuestionOrder';

/** Fisher–Yates shuffle (in-place) */
export function shuffleIds(ids) {
  const a = [...ids];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function clearQuestionOrder() {
  sessionStorage.removeItem(ORDER_KEY);
}

/** Load saved order or create a new shuffle for this test attempt. */
export function getShuffledSituationalQuestions() {
  const byId = new Map(questions.map((q) => [q.id, q]));
  const allIds = questions.map((q) => q.id);

  let order = null;
  try {
    const raw = sessionStorage.getItem(ORDER_KEY);
    if (raw) order = JSON.parse(raw);
  } catch {
    order = null;
  }

  const valid =
    Array.isArray(order) &&
    order.length === allIds.length &&
    order.every((id) => byId.has(id)) &&
    new Set(order).size === allIds.length;

  if (!valid) {
    order = shuffleIds(allIds);
    sessionStorage.setItem(ORDER_KEY, JSON.stringify(order));
  }

  return order.map((id) => byId.get(id));
}
