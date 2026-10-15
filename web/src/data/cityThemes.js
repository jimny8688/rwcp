/** 结果页与城市氛围的主题色 */
export const CITY_THEMES = {
  chengdu: {
    gradient: 'linear-gradient(145deg, #1f6b4a 0%, #3d9a6a 45%, #f0a030 100%)',
    glow: 'rgba(61, 154, 106, 0.45)',
    emoji: '🌶️'
  },
  chongqing: {
    gradient: 'linear-gradient(145deg, #4a1f6b 0%, #e85d04 50%, #ffba08 100%)',
    glow: 'rgba(232, 93, 4, 0.4)',
    emoji: '🌉'
  },
  hangzhou: {
    gradient: 'linear-gradient(145deg, #1a5f7a 0%, #2d9cdb 40%, #7dce82 100%)',
    glow: 'rgba(45, 156, 219, 0.4)',
    emoji: '🍃'
  },
  xian: {
    gradient: 'linear-gradient(145deg, #5c3d2e 0%, #8b6914 50%, #c9a227 100%)',
    glow: 'rgba(201, 162, 39, 0.35)',
    emoji: '🏯'
  },
  xiamen: {
    gradient: 'linear-gradient(145deg, #0d5c63 0%, #44a1a0 55%, #f8b195 100%)',
    glow: 'rgba(68, 161, 160, 0.45)',
    emoji: '🌊'
  },
  shenzhen: {
    gradient: 'linear-gradient(145deg, #0f2027 0%, #203a43 40%, #00d4ff 100%)',
    glow: 'rgba(0, 212, 255, 0.35)',
    emoji: '🚀'
  },
  shanghai: {
    gradient: 'linear-gradient(145deg, #2c1810 0%, #8e44ad 35%, #ecf0f1 100%)',
    glow: 'rgba(142, 68, 173, 0.35)',
    emoji: '✨'
  },
  guangzhou: {
    gradient: 'linear-gradient(145deg, #c0392b 0%, #e74c3c 45%, #f39c12 100%)',
    glow: 'rgba(243, 156, 18, 0.4)',
    emoji: '🥢'
  },
  nanjing: {
    gradient: 'linear-gradient(145deg, #34495e 0%, #5d6d7e 50%, #a9cce3 100%)',
    glow: 'rgba(169, 204, 227, 0.4)',
    emoji: '🍁'
  },
  dali: {
    gradient: 'linear-gradient(145deg, #1a5276 0%, #5dade2 40%, #fdebd0 100%)',
    glow: 'rgba(93, 173, 226, 0.45)',
    emoji: '🌬️'
  }
};

export const DEFAULT_THEME = {
  gradient: 'linear-gradient(145deg, #0d3b2e 0%, #1a5f4a 50%, #ffd166 100%)',
  glow: 'rgba(26, 95, 74, 0.45)',
  emoji: '🧭'
};

/** Public hero banners: web/public/cities/{cityId}.jpg */
export function getCityHeroImage(cityId) {
  const base = import.meta.env.BASE_URL || '/';
  return `${base}cities/${cityId}.jpg`;
}

export function getCityTheme(cityId) {
  const theme = CITY_THEMES[cityId] || DEFAULT_THEME;
  const id = CITY_THEMES[cityId] ? cityId : 'chengdu';
  return {
    ...theme,
    heroImage: getCityHeroImage(id)
  };
}
