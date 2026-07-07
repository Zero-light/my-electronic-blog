# WordPal — 词友

> 英语单词云端养成网页游戏

## 玩法循环

```
选词包 → 学习模式 → 答题获食物 → 投喂宠物 → 宠物成长/解锁装扮 → 继续学习
```

## 目录结构

```
09-WordPal/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── CLAUDE.md              ← Claude Code 的文件，包含完整的开发指南
├── public/
│   └── assets/words/      ← 词库 JSON
└── src/
    ├── main.ts            ← 入口
    ├── config.ts          ← 全局配置（颜色、动画参数、宠物定义）
    ├── data/
    │   └── wordpacks.ts   ← 词包定义（cet4/kaoyan）
    ├── scenes/
    │   ├── BootScene.ts   ← 初始化、资源加载
    │   ├── MenuScene.ts   ← 主菜单、词包选择
    │   ├── StudyScene.ts  ← 单词学习 + 答题
    │   ├── PetScene.ts    ← 宠物主界面、投喂
    │   └── WardrobeScene.ts ← 装扮选择
    ├── pet/
    │   ├── Pet.ts         ← 宠物实体、状态、动画
    │   └── PetFactory.ts  ← 程序化生成宠物图像
    ├── study/
    │   ├── StudySession.ts ← 学习会话管理
    │   答案选择策略
    │   └── FoodReward.ts  ← 奖励计算、食物类型
    ├── ui/
    │   ├── GlassPanel.ts  ← 液态玻璃面板组件
    │   ├── JellyButton.ts ← 果冻回弹按钮
    │   └── ProgressRing.ts ← 环形进度条
    ├── fx/
    │   ├── particles.ts   ← 粒子效果（爱心、星星、食物拖尾）
    │   └── sound.ts       ← 程序化音效 + 环境音
    └── utils/
        ├── storage.ts     ← localStorage 封装
        ├── random.ts      ← 随机工具
        └── math.ts        ← 缓动函数
```

## 视觉规范

- **液态玻璃**：白→透明径向渐变 + `filter: blur(20px)`  backdrop-blur
- **主色**：`#7C9CF8` 紫蓝 → `#B8E6FF` 天蓝
- **辅色**：`#FFB8D9` 粉 → `#FFE5F1` 浅粉
- **圆角**：最小 20px，按钮/面板 28px
- **字体**：系统字体（-apple-system, "Segoe UI", "Microsoft YaHei"）

## 数据持久化

`localStorage` 键：
- `wordpal:pet` — 宠物状态（种类、饱食度、心情、装扮、经验）
- `wordpal:progress:{packId}` — 词包进度（已学/已掌握/上次学习时间）
- `wordpal:settings` — 设置（音量、每日目标题数）
- `wordpal:stats` — 统计（连续天数、总学习次数）

## 宠物种类（5选1）

| ID | 名字 | 特点 |
|----|------|------|
| `cloudy` | 云小逗 | 像云朵一样软乎乎的，懒懒的表情 |
| `mochi` | 麻薯 | 圆滚滚的白团子，害羞的表情 |
| `pepper` | 小椒 | 小猫造型，机灵敏捷 |
| `berry` | 莓莓 | 小熊造型，憨厚爱吃蜂蜜 |
| `tang` | 橘子 | 小松鼠造型，活泼好动 |

## 饱食度机制

- 饱和值 0~100
- 每答对 +5（普通食物）/ +8（银苹果）/ +15（金苹果）
- 答错 +1（安慰食物）
- 每小时自然 -1（上限 50%/h）
- ≥ 70 开心活跃 / 40~69 平静常态 / 20~39 趴下变淡冒汗 / <20 趴着不动 / =0 离家出走

## 解锁条件

| 阶段 | 经验 | 条件 |
|------|------|------|
| 幼体 | 0~99 | 初始 |
| 成体 | 100~299 | 累计经验 ≥100 |
| 完全体 | ≥300 | 累计经验 ≥300 |

## 音效策略

Web Audio API 程序化生成（安静）：
- 答对：清脆 "叮"（C6→E6 八度跳）
- 答错：低沉 "嗡"（A3 短音）
- 投喂：湿润 "咕啾"（短促弹音）
- 升级：上升琶音（C-E-G-C + 钟声泛音）
- 主界面：钢琴 + 风铃 ambience（6s 循环 drone）

## MVP 范围

- ✅ 5 只宠物（程序化 Graphics 绘制）
- ✅ 100 词词库（cet4_basic.json）
- ✅ 学习模式（英→中 4选1）
- ✅ 投喂系统
- ✅ 装扮/解锁
- ✅ 音效
- 📅 扩展：Battle/Social 模式、2000 词全量、音效版权化
