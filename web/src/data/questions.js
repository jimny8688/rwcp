/** 每选项 deltas: R S V E T A (0-2 分增量) */

export const preQuestions = [
  {
    id: 'liveRegion',
    text: '你现在主要生活在哪类地方？（选最接近的）',
    options: [
      { label: '一线主城（北上广深等）', value: 'tier1' },
      { label: '新一线或强二线', value: 'newTier1' },
      { label: '普通二线', value: 'tier2' },
      { label: '三四线或小城', value: 'tier3' },
      { label: '县城乡镇', value: 'county' },
      { label: '频繁换城（漂）', value: 'nomad' }
    ]
  },
  {
    id: 'priority',
    text: '若未来一年只能优先改善一件事，你会选？',
    options: [
      { label: '收入与职业上升', value: 'career' },
      { label: '睡眠与情绪', value: 'health' },
      { label: '亲密关系质量', value: 'love' },
      { label: '与父母的距离与照顾', value: 'family' },
      { label: '可自由支配的时间', value: 'time' }
    ]
  }
];

export const questions = [
  {
    id: 'q1',
    text: '周五晚上 19:30，你真实最想的状态是？',
    options: [
      { label: '还在忙，但心里踏实（忙有方向）', deltas: { R: 0, S: 0, V: 0, E: 0, T: 0, A: 0 }, vBias: 'achievement' },
      { label: '已经在家，外卖或简单做一口，补剧补觉', deltas: { R: 2, S: 0, V: 1, E: 0, T: 0, A: 1 } },
      { label: '约人火锅小酒，把这周「大声关掉」', deltas: { R: 1, S: 2, V: 2, E: 1, T: 0, A: 0 } },
      { label: '独自出门散步，随便坐到打烊', deltas: { R: 2, S: 0, V: 1, E: 1, T: 0, A: 2 } }
    ]
  },
  {
    id: 'q2',
    text: '你对「通勤」的真实态度？',
    options: [
      { label: '30 分钟内可接受，再长就影响人生选择', deltas: { R: 0, S: 0, V: 0, E: 0, T: 0, A: 1 } },
      { label: '可以长，但路上要能看书/听东西/发呆', deltas: { R: 1, S: 0, V: 1, E: 0, T: 0, A: 1 } },
      { label: '最好骑车/走路就到，别让我「在路上活着」', deltas: { R: 2, S: 1, V: 1, E: 1, T: 0, A: 0 } },
      { label: '通勤是观察人间的方式，有点距离也行', deltas: { R: 1, S: 0, V: 0, E: 1, T: 0, A: 2 } }
    ]
  },
  {
    id: 'q3',
    text: '国庆七天，你更可能？',
    options: [
      { label: '加班/学习/搞副业，趁空档拉开差距', deltas: { R: 0, S: 0, V: 0, E: 0, T: 0, A: 0 }, vBias: 'achievement' },
      { label: '回老家或走亲戚，履行「人情日程」', deltas: { R: 1, S: 2, V: 0, E: 0, T: 2, A: 0 } },
      { label: '去陌生城市，睡到自然醒再决定去哪', deltas: { R: 2, S: 0, V: 2, E: 2, T: 0, A: 1 } },
      { label: '本地探索：新店、展览、把「附近」走熟', deltas: { R: 1, S: 1, V: 1, E: 1, T: 1, A: 1 } }
    ]
  },
  {
    id: 'q4',
    text: '看到「凌晨还在亮灯的写字楼」，你的第一反应？',
    options: [
      { label: '熟悉，甚至有点认同', deltas: { R: 0, S: 0, V: 0, E: 0, T: 0, A: 1 }, vBias: 'achievement' },
      { label: '心疼，但理解这是阶段', deltas: { R: 1, S: 0, V: 0, E: 0, T: 0, A: 0 } },
      { label: '不适：生活不该默认这样', deltas: { R: 2, S: 0, V: 2, E: 1, T: 0, A: 0 } },
      { label: '无感：各人有各人的剧本', deltas: { R: 1, S: 0, V: 1, E: 0, T: 0, A: 0 } }
    ]
  },
  {
    id: 'q5',
    text: '「慢」对你来说是？',
    options: [
      { label: '浪费时间，会焦虑', deltas: { R: 0, S: 0, V: 0, E: 0, T: 0, A: 0 }, vBias: 'achievement' },
      { label: '奢侈品，要等有资格', deltas: { R: 0, S: 0, V: 0, E: 0, T: 0, A: 1 } },
      { label: '日常刚需，像呼吸', deltas: { R: 2, S: 1, V: 2, E: 1, T: 0, A: 0 } },
      { label: '只对某些事慢（吃饭聊天），工作可以快', deltas: { R: 1, S: 1, V: 1, E: 1, T: 1, A: 1 } }
    ]
  },
  {
    id: 'q6',
    text: '在新城市，你最快建立安全感的方式？',
    options: [
      { label: '加入固定圈子：球友、家长群、行业小群', deltas: { R: 1, S: 2, V: 0, E: 0, T: 1, A: 0 } },
      { label: '找到 1–2 个能深聊的人就够', deltas: { R: 1, S: 1, V: 1, E: 0, T: 0, A: 1 } },
      { label: '不需要安全感，匿名反而自由', deltas: { R: 1, S: 0, V: 2, E: 0, T: 0, A: 1 } },
      { label: '靠熟悉路线：哪家早餐、哪条路、哪个公园', deltas: { R: 1, S: 1, V: 0, E: 2, T: 1, A: 1 } }
    ]
  },
  {
    id: 'q7',
    text: '电梯里邻居跟你搭话，你内心？',
    options: [
      { label: '可以聊，中国就该有人情味', deltas: { R: 1, S: 2, V: 0, E: 1, T: 2, A: 0 } },
      { label: '礼貌回应，但不希望交换微信', deltas: { R: 1, S: 1, V: 0, E: 0, T: 0, A: 1 } },
      { label: '希望小区别那么熟，保持安静', deltas: { R: 1, S: 0, V: 1, E: 0, T: 0, A: 1 } },
      { label: '看状态，有时想有人说话', deltas: { R: 1, S: 1, V: 0, E: 0, T: 0, A: 0 } }
    ]
  },
  {
    id: 'q8',
    text: '你理想的「常去据点」是？',
    options: [
      { label: '楼下大排档/小馆，老板记得你吃什么', deltas: { R: 1, S: 2, V: 1, E: 2, T: 1, A: 0 } },
      { label: '独立咖啡馆或书店，坐角落', deltas: { R: 1, S: 0, V: 1, E: 1, T: 0, A: 2 } },
      { label: '江/河/海边长椅，不必消费', deltas: { R: 2, S: 0, V: 2, E: 2, T: 0, A: 1 } },
      { label: '商场/综合体，一站式、不用计划', deltas: { R: 0, S: 1, V: 0, E: 0, T: 0, A: 1 } }
    ]
  },
  {
    id: 'q9',
    text: '微信群消息红点，你的习惯？',
    options: [
      { label: '尽量清零，怕错过信息和人情', deltas: { R: 0, S: 2, V: 0, E: 0, T: 1, A: 0 } },
      { label: '只回重要的，其余「意念回复」', deltas: { R: 1, S: 1, V: 0, E: 0, T: 0, A: 1 } },
      { label: '把群折叠，需要时再挖', deltas: { R: 1, S: 0, V: 1, E: 0, T: 0, A: 1 } },
      { label: '大群免打扰，小群秒回', deltas: { R: 0, S: 1, V: 0, E: 0, T: 0, A: 0 } }
    ]
  },
  {
    id: 'q10',
    text: '你对「在家乡被熟人看见」的感觉？',
    options: [
      { label: '踏实，有人情网', deltas: { R: 1, S: 2, V: 0, E: 0, T: 2, A: 0 } },
      { label: '复杂，既想被理解又怕被评价', deltas: { R: 1, S: 1, V: 0, E: 0, T: 1, A: 1 } },
      { label: '更想在「没人认识我」的地方重启', deltas: { R: 1, S: 0, V: 2, E: 0, T: 0, A: 1 } },
      { label: '无所谓，线上才是主战场', deltas: { R: 0, S: 0, V: 1, E: 0, T: 0, A: 1 } }
    ]
  },
  {
    id: 'q11',
    text: '若 35 岁还「不够成功」，你更怕哪一种？',
    options: [
      { label: '钱和职位不够', deltas: { R: 0, S: 0, V: 0, E: 0, T: 0, A: 1 }, vBias: 'achievement' },
      { label: '活得没滋味、只剩责任', deltas: { R: 1, S: 1, V: 2, E: 1, T: 0, A: 0 } },
      { label: '与根断裂，不知道我是谁', deltas: { R: 0, S: 1, V: 1, E: 0, T: 2, A: 1 } },
      { label: '被钉死在一个地方、一种人生', deltas: { R: 1, S: 0, V: 2, E: 1, T: 0, A: 1 } }
    ]
  },
  {
    id: 'q12',
    text: '你更认同哪句话？',
    options: [
      { label: '先搞钱，其他以后再说', deltas: { R: 0, S: 0, V: 0, E: 0, T: 0, A: 1 }, vBias: 'achievement' },
      { label: '人活一世，图个舒服和热闹', deltas: { R: 2, S: 2, V: 2, E: 1, T: 1, A: 0 } },
      { label: '要知道自己从哪来，才走得稳', deltas: { R: 1, S: 1, V: 1, E: 0, T: 2, A: 1 } },
      { label: '人生是体验，别被「应该」绑架', deltas: { R: 2, S: 0, V: 2, E: 2, T: 0, A: 1 } }
    ]
  },
  {
    id: 'q13',
    text: '面对「稳定编制 vs 高薪但不确定」，你真实倾向？',
    options: [
      { label: '编制/稳定', deltas: { R: 1, S: 1, V: 1, E: 0, T: 2, A: 0 } },
      { label: '高薪搏一把', deltas: { R: 0, S: 0, V: 0, E: 0, T: 0, A: 1 }, vBias: 'achievement' },
      { label: '哪个更自由选哪个', deltas: { R: 1, S: 0, V: 2, E: 1, T: 0, A: 1 } },
      { label: '哪个更能照顾家庭选哪个', deltas: { R: 1, S: 2, V: 0, E: 0, T: 2, A: 0 } }
    ]
  },
  {
    id: 'q14',
    text: '你花钱最不心疼的是？',
    options: [
      { label: '吃、玩、聚会', deltas: { R: 1, S: 2, V: 2, E: 1, T: 0, A: 0 } },
      { label: '学习、设备、投资自己', deltas: { R: 0, S: 0, V: 0, E: 0, T: 0, A: 1 }, vBias: 'achievement' },
      { label: '旅行、搬家、体验不同城市', deltas: { R: 1, S: 0, V: 2, E: 2, T: 0, A: 1 } },
      { label: '家人、礼物、仪式性支出', deltas: { R: 1, S: 2, V: 0, E: 0, T: 2, A: 0 } }
    ]
  },
  {
    id: 'q15',
    text: '「躺平」这个词，你的感受？',
    options: [
      { label: '冒犯，我只是在选不同策略', deltas: { R: 1, S: 0, V: 0, E: 0, T: 0, A: 0 } },
      { label: '共鸣，系统不该让人永远冲刺', deltas: { R: 2, S: 0, V: 2, E: 1, T: 0, A: 0 } },
      { label: '问题在结构，不全在个人', deltas: { R: 1, S: 0, V: 1, E: 0, T: 1, A: 1 } },
      { label: '口嗨而已，该卷还是卷', deltas: { R: 0, S: 0, V: 0, E: 0, T: 0, A: 0 }, vBias: 'achievement' }
    ]
  },
  {
    id: 'q16',
    text: '哪种天气最让你「心里开灯」？',
    options: [
      { label: '干冷有太阳，天高地阔', deltas: { R: 1, S: 0, V: 0, E: 1, T: 1, A: 1 } },
      { label: '闷湿夜风，火锅与霓虹', deltas: { R: 1, S: 2, V: 1, E: 2, T: 1, A: 0 } },
      { label: '海雾或海风，盐味与慢云', deltas: { R: 2, S: 0, V: 2, E: 2, T: 0, A: 2 } },
      { label: '江南细雨，树影与河', deltas: { R: 1, S: 0, V: 1, E: 2, T: 1, A: 2 } }
    ]
  },
  {
    id: 'q17',
    text: '你更容易被哪种景观治愈？',
    options: [
      { label: '古城墙、老街区、时间叠层', deltas: { R: 1, S: 0, V: 1, E: 1, T: 2, A: 1 } },
      { label: '立交、轻轨、夜景爬升', deltas: { R: 0, S: 1, V: 0, E: 2, T: 0, A: 0 } },
      { label: '绿道、湿地、湖面', deltas: { R: 2, S: 0, V: 1, E: 2, T: 0, A: 2 } },
      { label: '海岸线、长地平线', deltas: { R: 2, S: 0, V: 2, E: 2, T: 0, A: 1 } }
    ]
  },
  {
    id: 'q18',
    text: '你对「城市太大」的感受？',
    options: [
      { label: '越大越好，机会多、可隐藏', deltas: { R: 0, S: 0, V: 1, E: 0, T: 0, A: 1 } },
      { label: '大可以，但要有所属「片区」', deltas: { R: 1, S: 1, V: 0, E: 1, T: 1, A: 1 } },
      { label: '偏大就累，喜欢步行能穿城', deltas: { R: 2, S: 1, V: 1, E: 1, T: 0, A: 0 } },
      { label: '小城也可，关键是气质对', deltas: { R: 1, S: 1, V: 1, E: 1, T: 1, A: 1 } }
    ]
  },
  {
    id: 'q19',
    text: '搬家时你最难割舍的是？',
    options: [
      { label: '那家吃了三年的店', deltas: { R: 1, S: 2, V: 1, E: 2, T: 1, A: 0 } },
      { label: '窗景：河/山/海', deltas: { R: 1, S: 0, V: 1, E: 2, T: 0, A: 1 } },
      { label: '通勤动线上的熟悉感', deltas: { R: 1, S: 0, V: 0, E: 0, T: 1, A: 0 } },
      { label: '其实都好割舍，人走就行', deltas: { R: 1, S: 0, V: 2, E: 0, T: 0, A: 0 } }
    ]
  },
  {
    id: 'q20',
    text: '你更能忍受哪种气候代价？',
    options: [
      { label: '干冷或暴晒，只要天空透', deltas: { R: 1, S: 0, V: 0, E: 1, T: 1, A: 0 } },
      { label: '湿黏，换取绿和夜生活', deltas: { R: 1, S: 2, V: 1, E: 2, T: 0, A: 0 } },
      { label: '季节分明但别太极端', deltas: { R: 1, S: 0, V: 1, E: 2, T: 1, A: 2 } },
      { label: '只要精神自由，物理环境可妥协', deltas: { R: 2, S: 0, V: 2, E: 1, T: 0, A: 1 } }
    ]
  },
  {
    id: 'q21',
    text: '过年回家，你真实状态？',
    options: [
      { label: '必须回，这是年度重启键', deltas: { R: 1, S: 2, V: 0, E: 0, T: 2, A: 0 } },
      { label: '回，但缩短、且需要「逃离计划」', deltas: { R: 1, S: 1, V: 1, E: 0, T: 1, A: 0 } },
      { label: '能不回就不回，自己定义节日', deltas: { R: 1, S: 0, V: 2, E: 0, T: 0, A: 1 } },
      { label: '不回家但会仪式性问候长辈', deltas: { R: 1, S: 1, V: 0, E: 0, T: 1, A: 1 } }
    ]
  },
  {
    id: 'q22',
    text: '你对「方言 / 本地文化」？',
    options: [
      { label: '亲切，像钥匙', deltas: { R: 1, S: 2, V: 0, E: 1, T: 2, A: 0 } },
      { label: '尊重，但我不必融入', deltas: { R: 1, S: 0, V: 1, E: 0, T: 0, A: 1 } },
      { label: '好奇，喜欢学几句当游戏', deltas: { R: 1, S: 1, V: 1, E: 1, T: 0, A: 1 } },
      { label: '无感，普通话 + 外卖足够', deltas: { R: 0, S: 0, V: 1, E: 0, T: 0, A: 1 } }
    ]
  },
  {
    id: 'q23',
    text: '老建筑要拆还是留，你倾向？',
    options: [
      { label: '留，记忆是城市的根', deltas: { R: 1, S: 0, V: 1, E: 0, T: 2, A: 1 } },
      { label: '拆，发展优先', deltas: { R: 0, S: 0, V: 0, E: 0, T: 0, A: 0 }, vBias: 'achievement' },
      { label: '改造利用，让旧活在新里', deltas: { R: 1, S: 1, V: 0, E: 1, T: 1, A: 2 } },
      { label: '不关心，别挡我上班路', deltas: { R: 0, S: 0, V: 0, E: 0, T: 0, A: 0 } }
    ]
  },
  {
    id: 'q24',
    text: '你对「本地婚恋观 / 门当户对」？',
    options: [
      { label: '理解，结构成本真实', deltas: { R: 1, S: 2, V: 0, E: 0, T: 2, A: 0 } },
      { label: '反感，但承认它存在', deltas: { R: 1, S: 0, V: 2, E: 0, T: 0, A: 1 } },
      { label: '看感情，其他可谈', deltas: { R: 1, S: 1, V: 1, E: 0, T: 1, A: 1 } },
      { label: '不婚/晚婚也是正当路径', deltas: { R: 1, S: 0, V: 2, E: 0, T: 0, A: 1 } }
    ]
  },
  {
    id: 'q25',
    text: '你更喜欢的城市质感是？',
    options: [
      { label: '霓虹火锅、台阶、人群', deltas: { R: 1, S: 2, V: 1, E: 2, T: 0, A: 0 } },
      { label: '玻璃幕墙、干净街道、咖啡', deltas: { R: 0, S: 0, V: 0, E: 0, T: 0, A: 2 } },
      { label: '白墙黛瓦、树影、慢生活', deltas: { R: 2, S: 0, V: 1, E: 2, T: 1, A: 2 } },
      { label: '胡同/城墙/博物馆光影', deltas: { R: 1, S: 0, V: 1, E: 1, T: 2, A: 2 } }
    ]
  },
  {
    id: 'q26',
    text: '「精致」对你意味着？',
    options: [
      { label: '虚伪，不如真和热', deltas: { R: 1, S: 2, V: 1, E: 2, T: 1, A: 0 } },
      { label: '必要，是对生活的尊重', deltas: { R: 0, S: 0, V: 0, E: 0, T: 0, A: 2 } },
      { label: '偶尔即可，日常随意', deltas: { R: 2, S: 1, V: 1, E: 1, T: 0, A: 1 } },
      { label: '精致不如「有故事」', deltas: { R: 1, S: 0, V: 1, E: 1, T: 2, A: 1 } }
    ]
  },
  {
    id: 'q27',
    text: '你在朋友圈更愿意晒？',
    options: [
      { label: '今天吃了什么，多图', deltas: { R: 1, S: 2, V: 2, E: 1, T: 0, A: 0 } },
      { label: '展/书/影/一句克制文案', deltas: { R: 1, S: 0, V: 1, E: 1, T: 0, A: 2 } },
      { label: '工作里程碑/学习证书', deltas: { R: 0, S: 0, V: 0, E: 0, T: 0, A: 1 }, vBias: 'achievement' },
      { label: '风景与在路上，少露人', deltas: { R: 1, S: 0, V: 2, E: 2, T: 0, A: 1 } }
    ]
  },
  {
    id: 'q28',
    text: '若城市是一种音乐，你选？',
    options: [
      { label: '摇滚/说唱，够吵才真实', deltas: { R: 1, S: 2, V: 1, E: 2, T: 0, A: 0 } },
      { label: '爵士/电子，夜晚与距离', deltas: { R: 0, S: 0, V: 0, E: 0, T: 0, A: 2 } },
      { label: '民谣/轻音乐，慢与回忆', deltas: { R: 2, S: 1, V: 2, E: 2, T: 1, A: 2 } },
      { label: '戏曲/古乐采样，新旧混搭', deltas: { R: 1, S: 0, V: 1, E: 1, T: 2, A: 2 } }
    ]
  }
];
