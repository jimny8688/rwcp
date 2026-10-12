/** 六维原型：R 慢节奏偏好, S 社交热度, V 价值(低成就高享乐), E 自然市井, T 传统, A 精致文艺 */
export const CITY_PROFILES = [
  {
    id: 'chengdu',
    name: '成都',
    title: '热汤灵魂',
    tagline: '懂享受，也懂把日子过成连续剧',
    rarity: 12,
    vector: { R: 85, S: 75, V: 80, E: 65, T: 60, A: 55 },
    shareQuote: '我的灵魂住在成都：成功可以迟到，幸福不能缺席。',
    concept: '「允许型城市」',
    conceptDesc:
      '有些城市默认允许你先活着再成功。人-环境匹配里，当外界要求过高时，允许型气质能降低慢性压力。',
    sections: {
      archetype: '社群型享乐者——你不是懒，是用热络与口味修复能量。',
      thinking: '先问「这事让不让我像个人」，再问投入产出。',
      insight:
        '若现居是快城，别复制成都式躺平，复制「小圈子深度社交」：固定饭友就是低成本第三空间。',
      relation: '适合能一起吃、一起吐槽的关系；冷战型伴侣会快速耗干你。'
    }
  },
  {
    id: 'chongqing',
    name: '重庆',
    title: '江风灵魂',
    tagline: '烈、直、立体，爱在烟火里真聊',
    rarity: 10,
    vector: { R: 55, S: 85, V: 78, E: 75, T: 65, A: 35 },
    shareQuote: '我的灵魂是江风：坡要爬，话要真，人间要热。',
    concept: '「立体城市人格」',
    conceptDesc:
      '多线程、强场景切换像立体动线。环境心理学认为，适度变化性能提升唤醒度，帮你切掉情绪粘滞。',
    sections: {
      archetype: '江湖型表达者——直给、重情、怕假。',
      thinking: '问题要在当下这口锅里解决，不爱空聊。',
      insight: '在扁平城市，人为制造垂直切换：天台、夜间换街区散步。',
      relation: '需要能吵能吃能和好的人；回避型沟通会让你憋出内伤。'
    }
  },
  {
    id: 'hangzhou',
    name: '杭州',
    title: '平衡灵魂',
    tagline: '要体面，也要绿；效率里留一口慢',
    rarity: 11,
    vector: { R: 60, S: 55, V: 55, E: 70, T: 55, A: 75 },
    shareQuote: '灵魂在杭州：要快，也要绿；要赢，也要像个人。',
    concept: '「恢复性环境的日常版」',
    conceptDesc:
      '绿色与秩序共同构成注意力恢复。你不是纯慢，你需要可控的优雅。',
    sections: {
      archetype: '秩序型生活家——用环境美学约束自己。',
      thinking: '长期主义 + 审美约束，拒绝失控式内卷。',
      insight: '住快城也可建 15 分钟绿圈；视觉秩序能真实降低焦虑。',
      relation: '欣赏边界清晰、说到做到的伴侣。'
    }
  },
  {
    id: 'xian',
    name: '西安',
    title: '城垣灵魂',
    tagline: '记忆厚，人重情；走再远也问「根」',
    rarity: 9,
    vector: { R: 50, S: 70, V: 65, E: 55, T: 90, A: 60 },
    shareQuote: '灵魂在西安：墙不只是墙，是我对自己的解释。',
    concept: '「地方认同 Place Identity」',
    conceptDesc:
      '对「从哪来」的敏感提供决策锚点，减少存在性漂浮感，不等于保守。',
    sections: {
      archetype: '记忆型守护者——大时间尺度看选择。',
      thinking: '仪式与承诺是安全感来源。',
      insight: '在移民城市用固定纪念食、年度访古补「根」。',
      relation: '重承诺，需要对方尊重你的仪式与家族节奏。'
    }
  },
  {
    id: 'xiamen',
    name: '厦门',
    title: '潮汐灵魂',
    tagline: '边界感是温柔，海是退路',
    rarity: 8,
    vector: { R: 75, S: 45, V: 82, E: 85, T: 50, A: 80 },
    shareQuote: '灵魂在厦门：可以靠近，但要留一道海。',
    concept: '「边界即温柔」',
    conceptDesc:
      '低侵入社交让你保留创造力。第三空间里，你需要不必结盟的共处。',
    sections: {
      archetype: '文艺型独行者——可社交，但要有退潮时间。',
      thinking: '用距离保护敏感；氛围体验优先级高。',
      insight: '实践社交配额：每周少量高质量见面，其余免打扰。',
      relation: '怕过度捆绑；需要「在同一城市各自呼吸」的默契。'
    }
  },
  {
    id: 'shenzhen',
    name: '深圳',
    title: '拓荒灵魂',
    tagline: '不信命信迭代；城市年轻，你也年轻',
    rarity: 13,
    vector: { R: 25, S: 50, V: 25, E: 40, T: 30, A: 70 },
    shareQuote: '灵魂在深圳：不信命，信版本更新。',
    concept: '「移民城市的时间折扣」',
    conceptDesc:
      '高成就动机与低传统绑定时，价值一致比地方认同更能预测满意度。',
    sections: {
      archetype: '迭代型建设者——默认问「还能升级吗」。',
      thinking: '对空转容忍度低，项目制推进最舒适。',
      insight: '若人在慢城，用季度冲刺代替全年无休。',
      relation: '欣赏并肩作战型；纯情绪消耗的关系会拖累你。'
    }
  },
  {
    id: 'shanghai',
    name: '上海',
    title: '契约灵魂',
    tagline: '尊重规则与审美，距离是礼貌',
    rarity: 10,
    vector: { R: 35, S: 40, V: 30, E: 55, T: 45, A: 85 },
    shareQuote: '灵魂在上海：距离是礼貌，精致是诚实。',
    concept: '「陌生人协作的信任模板」',
    conceptDesc:
      '规则、审美与边界构成契约型信任，少人情绑架，多专业互换。',
    sections: {
      archetype: '都市型精算师——情感也讲究清晰。',
      thinking: '重视可预期性与公共体面。',
      insight: '用书面边界（时间/钱/职责）降低内耗。',
      relation: '需要成熟沟通；模糊暧昧长期会累。'
    }
  },
  {
    id: 'guangzhou',
    name: '广州',
    title: '镬气灵魂',
    tagline: '务实、生猛、讲真；幸福在一碗里',
    rarity: 9,
    vector: { R: 60, S: 80, V: 75, E: 70, T: 70, A: 40 },
    shareQuote: '灵魂在广州：人生大事，也可以在一碗里商量。',
    concept: '「市井民主」',
    conceptDesc:
      '低门槛的真实热闹里，人更容易恢复社会连接与务实感。',
    sections: {
      archetype: '务实型生活派——少宏大叙事，多当下值不值。',
      thinking: '现金流思维优于概念叙事。',
      insight: '在冷感城市用固定饭友局替代无效社交。',
      relation: '喜欢直说直办；需要一起认真吃饭的伴侣。'
    }
  },
  {
    id: 'nanjing',
    name: '南京',
    title: '梧桐灵魂',
    tagline: '中庸里的敏感；懂历史也懂小确丧',
    rarity: 7,
    vector: { R: 65, S: 55, V: 60, E: 65, T: 75, A: 78 },
    shareQuote: '灵魂在南京：我不吵，但我记得比谁都清楚。',
    concept: '「中等景观心理」',
    conceptDesc:
      '在宏大与日常之间摇摆，敏感、忆旧但不拒新，适合有厚度的现代生活。',
    sections: {
      archetype: '沉思型漫游者——想得多，做得刚好。',
      thinking: '对意义过敏又渴望；散步比刷手机更能整理思绪。',
      insight: '固定树线/河线散步，替代碎片化焦虑。',
      relation: '慢热，需要被读懂；讨厌被贴标签。'
    }
  },
  {
    id: 'dali',
    name: '大理',
    title: '风场灵魂',
    tagline: '要自由大过标签；生活可以是实验',
    rarity: 6,
    vector: { R: 90, S: 35, V: 88, E: 90, T: 40, A: 75 },
    shareQuote: '灵魂在大理：我不是逃避，我是要更大的呼吸。',
    concept: '「逃逸与控制感重建」',
    conceptDesc:
      '广阔视域提升控制感，适合决策疲劳期；不等于必须地理迁徙。',
    sections: {
      archetype: '实验型游牧者——人生是可改配置。',
      thinking: '最怕锁死；自由预算是刚需。',
      insight: '季度微迁移 + 原地自由清单，比冲动裸辞更稳。',
      relation: '需要互相给空间；控制欲过强会触发逃离模式。'
    }
  }
];

export const LIVE_REGION_PROFILES = {
  tier1: { R: 30, S: 55, V: 35, E: 45, T: 45, A: 75 },
  newTier1: { R: 45, S: 60, V: 45, E: 55, T: 55, A: 65 },
  tier2: { R: 60, S: 65, V: 55, E: 60, T: 60, A: 55 },
  tier3: { R: 70, S: 75, V: 65, E: 55, T: 70, A: 45 },
  county: { R: 75, S: 80, V: 60, E: 50, T: 75, A: 40 },
  nomad: { R: 50, S: 45, V: 70, E: 65, T: 40, A: 60 }
};
