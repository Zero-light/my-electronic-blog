/**
 * 生活动态数据
 * 模拟微信朋友圈形式，分为旅游与爱好两大板块
 */

export type MomentType = 'travel' | 'hobby';

export interface LifeMoment {
  id: string;
  type: MomentType;
  /** 主分类（旅游地点 / 爱好大类） */
  category: string;
  /** 子分类（如游戏名下的具体游戏） */
  subCategory?: string;
  /** 发布时间 */
  date: string;
  /** 动态文字内容 */
  content: string;
  /** 配图 */
  images: string[];
  /** 位置信息（可选） */
  location?: string;
}

export const lifeMoments: LifeMoment[] = [
  // ========== 旅游 ==========
  {
    id: 't1',
    type: 'travel',
    category: '云南',
    date: '2025-07-15',
    content:
      '大理的洱海真的太治愈了，骑了一天自行车，风吹在脸上特别舒服。傍晚在古城吃了碗过桥米线，满足了。',
    images: [
      'https://picsum.photos/seed/yunnan1/800/600',
      'https://picsum.photos/seed/yunnan2/800/600',
      'https://picsum.photos/seed/yunnan3/800/600',
    ],
    location: '大理 · 洱海',
  },
  {
    id: 't2',
    type: 'travel',
    category: '云南',
    date: '2025-07-16',
    content:
      '丽江古城的夜景果然名不虚传，四方街的热闹和酒吧街的慵懒形成鲜明对比。明天去玉龙雪山！',
    images: ['https://picsum.photos/seed/yunnan4/800/600'],
    location: '丽江 · 古城',
  },
  {
    id: 't3',
    type: 'travel',
    category: '北京',
    date: '2024-10-01',
    content:
      '国庆来北京凑个热闹，故宫的人流量确实惊人，但红墙黄瓦的庄严感还是让人肃然起敬。',
    images: [
      'https://picsum.photos/seed/beijing1/800/600',
      'https://picsum.photos/seed/beijing2/800/600',
    ],
    location: '北京 · 故宫',
  },
  {
    id: 't4',
    type: 'travel',
    category: '北京',
    date: '2024-10-02',
    content:
      '长城当好汉的一天，北八楼的风景确实值得。腿废了，但照片拍得很满意。',
    images: [
      'https://picsum.photos/seed/beijing3/800/600',
      'https://picsum.photos/seed/beijing4/800/600',
      'https://picsum.photos/seed/beijing5/800/600',
    ],
    location: '北京 · 八达岭长城',
  },
  {
    id: 't5',
    type: 'travel',
    category: '上海',
    date: '2024-05-20',
    content:
      '外滩的夜景永远不会让人失望，陆家嘴的摩天大楼群像是未来城市。',
    images: ['https://picsum.photos/seed/shanghai1/800/600'],
    location: '上海 · 外滩',
  },
  {
    id: 't6',
    type: 'travel',
    category: '西藏',
    date: '2023-08-10',
    content:
      '布达拉宫比想象中更加震撼，高原反应也比我预想中温和。这里是离天空最近的地方。',
    images: [
      'https://picsum.photos/seed/tibet1/800/600',
      'https://picsum.photos/seed/tibet2/800/600',
    ],
    location: '拉萨 · 布达拉宫',
  },

  // ========== 爱好 — 钢琴 ==========
  {
    id: 'h1',
    type: 'hobby',
    category: '钢琴',
    date: '2025-06-10',
    content:
      '终于把《梦中的婚礼》完整弹下来了，虽然还有些磕磕绊绊，但算是今年的一个小成就。',
    images: ['https://picsum.photos/seed/piano1/800/600'],
  },
  {
    id: 'h2',
    type: 'hobby',
    category: '钢琴',
    date: '2025-01-15',
    content:
      '寒假在家练了两周音阶，手指灵活度明显提升了。新的一年希望能挑战更有难度的曲子。',
    images: [],
  },

  // ========== 爱好 — 游戏（植物大战僵尸） ==========
  {
    id: 'h3',
    type: 'hobby',
    category: '游戏',
    subCategory: '植物大战僵尸',
    date: '2025-05-01',
    content:
      '无尽模式撑到第 47 波了，冰瓜+玉米加农炮的阵容果然稳。小时候玩的游戏现在回来重温，还是一样的上瘾。',
    images: ['https://picsum.photos/seed/pvz1/800/600'],
  },
  {
    id: 'h4',
    type: 'hobby',
    category: '游戏',
    subCategory: '植物大战僵尸',
    date: '2025-05-03',
    content:
      '解锁了全部金盏花，花园快种不下了。这游戏的收集要素做得真不错。',
    images: [],
  },

  // ========== 爱好 — 游戏（GTA5） ==========
  {
    id: 'h5',
    type: 'hobby',
    category: '游戏',
    subCategory: 'GTA5',
    date: '2025-03-20',
    content:
      '第一次线上模式抢银行，队里有个大哥带飞，分红拿了 120 万。洛圣都的夜景是真的棒。',
    images: [
      'https://picsum.photos/seed/gta1/800/600',
      'https://picsum.photos/seed/gta2/800/600',
    ],
  },
  {
    id: 'h6',
    type: 'hobby',
    category: '游戏',
    subCategory: 'GTA5',
    date: '2025-04-05',
    content:
      '买了架喷气式飞机，在洛圣都上空瞎飞，结果撞了写字楼。这游戏的物理引擎太真实了。',
    images: ['https://picsum.photos/seed/gta3/800/600'],
  },

  // ========== 爱好 — 游戏（其他） ==========
  {
    id: 'h7',
    type: 'hobby',
    category: '游戏',
    subCategory: '塞尔达传说',
    date: '2024-12-25',
    content:
      '塞尔达传说王国之泪通关了，神庙解谜和空岛探索的设计真的天花板级别。年度最佳实至名归。',
    images: ['https://picsum.photos/seed/zelda1/800/600'],
  },

  // ========== 爱好 — 摄影 ==========
  {
    id: 'h8',
    type: 'hobby',
    category: '摄影',
    date: '2025-02-14',
    content:
      '入手了一颗 50mm 定焦头，大光圈虚化效果太香了。周末去公园试拍了几张人像，锐度很惊喜。',
    images: [
      'https://picsum.photos/seed/photo1/800/600',
      'https://picsum.photos/seed/photo2/800/600',
    ],
  },
];

/** 旅游地点列表 */
export const travelCategories = [
  ...new Set(
    lifeMoments
      .filter((m) => m.type === 'travel')
      .map((m) => m.category)
  ),
];

/** 爱好大类列表 */
export const hobbyCategories = [
  ...new Set(
    lifeMoments
      .filter((m) => m.type === 'hobby')
      .map((m) => m.category)
  ),
];

/** 游戏子分类列表 */
export const gameSubCategories = [
  ...new Set(
    lifeMoments
      .filter((m) => m.type === 'hobby' && m.category === '游戏')
      .map((m) => m.subCategory)
      .filter(Boolean)
  ),
] as string[];
