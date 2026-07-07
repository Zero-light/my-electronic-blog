# LinguaPet — 英语养成游戏完整设计方案

> **游戏名（构想）**：LinguaPet / WordPals / EngliMate
> **一句话概括**：你领养一只从英语世界来的小生物，它只会说英语。你通过跟它对话、教它词汇、带它冒险来帮它成长，同时你自己的英语水平也在提升。

---

## 一、核心设计理念

**"养成" + "英语学习" 的逻辑共鸣点**

```
养成游戏天然驱动：
  每天上线 → 喂食/互动/训练 → 宠物成长/进化 → 获得正反馈

英语学习的真实需求：
  每天接触 → 输入/输出/复习 → 水平提升/解锁新内容 → 获得成就
```

养成游戏与英语学习在"日常投入→渐进成长→正反馈循环"这个结构上天然同构，这是本设计的核心立足点。

---

## 二、UI/UX 设计（完整界面蓝图）

### 2.1 整体布局风格

| 属性 | 设定 |
|------|------|
| 风格 | 温馨手绘风（类似 Tamagotchi × 绘本），柔和暖色调（米白、淡绿、珊瑚粉） |
| 画幅 | 固定 4:3 游戏视口，居中显示，背景柔和渐变 |
| 交互层级 | 底部导航栏 + 顶部状态栏 + 中央主视区 |
| 适配 | 桌面优先，移动端留宽高比适配 |

### 2.2 界面结构

```
┌────────────────────────────────────────────┐
│  ⭐ Lv.5   ❤️❤️❤️❤️🤍   🔥7天   💰250G   │  ← 顶部状态栏
├────────────────────────────────────────────┤
│                                            │
│            [主场景 / 宠物房间]               │  ← 中央主视区
│                                            │
│         🐱 (宠物动画，可点击互动)            │
│                                            │
│     [对话气泡: "Hello! I'm hungry!"]       │
│                                            │
├────────────────────────────────────────────┤
│  🏠  |  📖  |  🗺️  |  🎒  |  👤           │  ← 底部导航栏
│  家    学习    冒险    背包    个人          │
└────────────────────────────────────────────┘
```

### 2.3 五个主界面

**① 家（主场景）**

- 宠物在房间内自由走动 / 待机动画
- 可点击宠物触发随机互动（摸头→开心动画；说话→触发对话）
- 房间可装饰（解锁壁纸/地毯/家具，通过英语任务获得）
- 左下角状态图标：饱腹度 / 心情 / 精力 / 清洁度（各 5 格）
- 右下角快捷按钮：喂食 / 玩耍 / 学习 / 睡觉

**② 学习**

分三个子 tab：

- **单词卡**：新词学习（图片 + 发音 + 例句），SRS 间隔复习
- **小课堂**：语法 / 句型 mini-lesson（5 分钟一段）
- **挑战**：当日限时任务（拼写 / 听力 / 选择）

完成学习可获得经验 + 金币 + 宠物道具。学习数据可视化：今日学了几词、掌握率。

**③ 冒险**

- 地图：数个主题岛屿（家庭岛 / 学校岛 / 动物岛 / 城市岛 / 奇幻岛...）
- 每个岛屿 6-8 个关卡，关卡内有：
  - 对话场景（阅读 + 选择回应）
  - 词汇解谜（用所学单词解开障碍）
  - 听力任务（听指令做动作）
  - BOSS 关：综合测试
- 过关奖励：新单词解锁 + 宠物装备 + 岛屿纪念品

**④ 背包**

- 道具栏：食物、玩具、装饰品、装备
- 装备影响宠物属性（比如"英语词典挂饰"提升学习效率 10%）
- 收集图鉴：已学单词图鉴 / 已解锁成就 / 已获得物品

**⑤ 个人**

- 玩家档案：等级、经验、连胜天数
- 学习统计图表（日历热力图、词汇量曲线）
- 设置：语音速度、每日提醒时间、难度等级
- 宠物进化树预览

---

## 三、玩法系统（7 大核心系统）

### 3.1 宠物养成系统

宠物有三个主要维度，每个维度影响宠物行为和学习效率：

| 维度 | 满值 | 降低原因 | 补满方式 | 低于阈值后果 |
|------|------|----------|----------|-------------|
| **饱腹度 (Fullness)** | 100 | 每 4 小时 -10 | 喂食（用金币买食物） | 宠物不开心，学习效率 -30% |
| **心情 (Happiness)** | 100 | 长时间不互动 | 玩耍/摸头/完成学习 | 宠物拒绝学习，可能离家出走 |
| **精力 (Energy)** | 100 | 学习/冒险消耗 | 睡觉/休息 | 无法进行学习活动 |

**宠物成长阶段**（5 阶段，类似数码宝贝进化线）：

```
🥚 蛋 (0-1级)    → 刚领养，需要孵化互动
🐣 幼年体 (2-5级) → 基础词汇学习，形态简单
🐱 成长体 (6-12级) → 解锁短句对话，形态变化
🦊 成熟体 (13-20级) → 解锁故事对话，可装备物品
🦄 完全体 (21-30级) → 解锁自由对话+写作，最终形态
```

玩家等级 = 宠物等级，等级通过累积学习经验提升。

### 3.2 英语学习系统（核心学习引擎）

学习内容按 **CEFR 欧洲语言共同参考框架** 分层：

| 等级 | 对应 CEFR | 词汇量 | 学习重点 |
|------|-----------|--------|---------|
| 1-5 (Lv.1-5) | A1 | 0-500 | 基础名词、简单问候、颜色、数字 |
| 6-10 (Lv.6-10) | A2 | 500-1000 | 日常动词、时间、天气、简单句型 |
| 11-15 (Lv.11-15) | B1 | 1000-2000 | 连词、时态、观点表达、短文阅读 |
| 16-20 (Lv.16-20) | B2 | 2000-4000 | 复杂从句、议论文、抽象话题 |
| 21-30 (Lv.21-30) | C1 | 4000+ | 习语、修辞、自由写作 |

**学习活动类型**（每种活动产出不同经验值）：

| 活动 | 经验 | 金币 | 消耗精力 | 说明 |
|------|------|------|---------|------|
| 新词学习 | 20xp | 5G | 10 | 看图片+发音+例句，跟读 |
| 间隔复习 | 10xp | 3G | 5 | SRS 算法自动安排 |
| 拼写挑战 | 30xp | 8G | 15 | 听音拼写 |
| 听力选择 | 25xp | 6G | 10 | 听句子选图片 |
| 对话练习 | 40xp | 12G | 20 | 跟宠物角色对话选择 |
| 阅读理解 | 35xp | 10G | 15 | 小短文 + 回答问题 |
| BOSS 挑战 | 80xp | 25G | 30 | 关卡终极大综合 |

**SRS 复习算法**（间隔重复的核心逻辑）：

```
首次学习 → 4小时后复习 → 1天后 → 3天后 → 7天后 → 14天后 → 30天后
每次答对，间隔翻倍
每次答错，间隔重置到上一级
```

### 3.3 冒险 / 关卡系统

每个岛屿 = 一个主题词汇域。以第一个岛屿"Home Island（家庭岛）"为例：

```
📍 家庭岛 - 6个关卡 + 1 BOSS

关卡1: "Meet My Family"
  学习词汇: mother, father, sister, brother, baby
  玩法: 点击图片匹配单词

关卡2: "Rooms in the House"
  学习词汇: kitchen, bedroom, bathroom, living room, garden
  玩法: 拖拽物品到正确房间

关卡3: "Daily Routines"
  学习词汇: wake up, eat breakfast, brush teeth, go to school
  玩法: 排序句子描述日常

关卡4: "What's in the Fridge?"
  学习词汇: milk, bread, egg, apple, water
  玩法: 听力选择（听句子选食物）

关卡5: "Family Dinner"
  学习词汇: 综合运用前4关词汇
  玩法: 对话选择（角色扮演）

关卡6: "My Day"（小BOSS）
  学习词汇: 全岛词汇综合
  玩法: 听一段关于家庭日常的短文，回答问题

BOSS关: "Welcome to My Home"
  综合测试：阅读理解 + 听力 + 拼写 + 对话
  奖励：宠物家具 + 大量经验
```

### 3.4 宠物互动系统

**点击互动**（主场景中点击宠物）：

| 互动 | 效果 | 冷却 |
|------|------|------|
| 摸头 (Pet) | 心情 +5 | 10 分钟 |
| 说话 (Talk) | 触发一段英语对话 | 30 分钟 |
| 喂食 (Feed) | 饱腹度 +20 | 需有食物道具 |
| 玩耍 (Play) | 心情 +10，精力 -10 | 1 小时 |
| 学习 (Study) | 额外经验 +10% 持续 30 分钟 | 每天 3 次 |

**对话系统**（Talk 互动触发）：

```
宠物: "Good morning! How are you today?"
玩家选项:
  A. "I'm happy!" 😊  [正确回应，宠物开心，经验+5]
  B. "I'm apple!"    [语法错误，宠物疑惑，帮你纠正]
  C. "Yes."          [不完整回应，宠物鼓励你再试试]
```

对话库按等级分为：

- Lv.1-5: 固定模板对话（5-8 套），每套 3-4 轮
- Lv.6-10: 半随机组合对话
- Lv.11+: 可接入 AI API 生成动态对话（选项式）

### 3.5 成就 / 激励系统

**每日循环**（借鉴 Duolingo 的粘性设计）：

```
🔥 连胜 Streak：连续每日完成学习任务
  3天 → 小火苗图标 + 双倍金币
  7天 → 火焰图标 + 稀有道具
  30天 → 传奇火焰 + 限定皮肤

📅 每日任务（3个）：
  - "学 10 个新词" → 50xp + 宠物食物
  - "完成一次冒险关卡" → 80xp + 金币
  - "和宠物对话 3 次" → 30xp + 心情道具

🎯 成就系统：
  "词汇新人"   → 累计学习 100 词
  "冒险家"    → 通关 3 个岛屿
  "饲养大师"   → 宠物进化到完全体
  "学霸"      → 连续 7 天完成所有每日任务
  "收藏家"    → 收集 50 种不同的道具
```

### 3.6 经济系统

| 货币/资源 | 获取方式 | 用途 |
|-----------|---------|------|
| 金币 (Gold) | 完成学习/冒险/任务 | 买食物、家具、装饰 |
| 钻石 (Gem) | 成就奖励、BOSS 掉落 | 买限定皮肤、加速孵化 |
| 精力 (Energy) | 随时间恢复、睡觉 | 所有学习活动消耗 |
| 体力 (Heart) | 每天 5 颗（免费） | 挑战失败扣除，0 颗时需等待恢复 |

> 不设内购 P2W 元素。钻石仅通过游戏内成就获得，不花钱。

### 3.7 宠物进化系统

进化条件是一个三维度判断：

```
进化条件 = 玩家等级达标 + 累积学习词数达标 + 宠物好感度满值

🥚 → 🐣 : Lv.1 + 学 20 词 + 孵化互动 3 次
🐣 → 🐱 : Lv.5 + 学 150 词 + 好感度 100/100
🐱 → 🦊 : Lv.12 + 学 500 词 + 好感度 100/100 + 通关 2 个岛屿
🦊 → 🦄 : Lv.20 + 学 1500 词 + 好感度 100/100 + 通关 5 个岛屿
```

进化会触发特殊动画 + 解锁新互动 + 新对话库。

---

## 四、内容体系（词汇库 + 对话库 + 关卡库）

### 4.1 词汇数据库结构

```
word_bank/
├── level_01_50.json     # A1 基础词汇 50词
├── level_51_100.json    # A1 进阶词汇 50词
├── ...
└── level_1950_2000.json # B2 词汇 50词
```

每个词汇条目结构：

```json
{
  "id": "w_00123",
  "word": "apple",
  "meaning_zh": "苹果",
  "phonetic": "/ˈæp.əl/",
  "pos": "noun",
  "cefr": "A1",
  "theme": "food",
  "image_key": "apple.png",
  "audio_key": "apple.mp3",
  "sentence": "I eat an apple every day.",
  "sentence_zh": "我每天吃一个苹果。",
  "related_words": ["fruit", "red", "sweet"]
}
```

### 4.2 对话脚本库

```
dialogue_bank/
├── daily_greeting.json       # 每日问候（变量填充天气/心情）
├── level_01_05.json          # Lv.1-5 固定对话
├── level_06_10.json          # Lv.6-10 半固定对话
└── daily_event.json          # 特殊事件对话（生日/节日/雨天...）
```

对话条目结构：

```json
{
  "id": "d_0025",
  "min_level": 3,
  "trigger": "talk_action",
  "cooldown_minutes": 30,
  "nodes": [
    {
      "speaker": "pet",
      "text": "Do you like animals?",
      "audio": "d_0025_pet.mp3"
    },
    {
      "speaker": "player",
      "options": [
        {
          "text": "Yes, I love dogs!",
          "correct": true,
          "response": "Me too! Dogs are wonderful friends!",
          "xp_reward": 10
        },
        {
          "text": "No, I don't like.",
          "correct": false,
          "hint": "Try: 'No, I don't like animals.'",
          "response": "Oh, I see... Maybe we can learn more about them!",
          "xp_reward": 3
        }
      ]
    }
  ]
}
```

### 4.3 关卡内容库

```
level_bank/
├── island_home/              # 家庭岛
│   ├── level_1.json
│   ├── level_2.json
│   └── boss.json
├── island_school/            # 学校岛
├── island_zoo/               # 动物园岛
├── island_city/              # 城市岛
├── island_food/              # 美食岛
├── island_fantasy/           # 奇幻岛（B2+ 解锁）
└── island_travel/            # 旅行岛（C1 解锁）
```

关卡结构：

```json
{
  "id": "home_l3",
  "island": "home",
  "name": "Daily Routines",
  "order": 3,
  "unlock_condition": {
    "player_level": 3,
    "prev_level_completed": "home_l2"
  },
  "vocab_list": ["wake up", "breakfast", "brush", "school", "bath"],
  "phases": [
    {
      "type": "learning",
      "count": 3,
      "vocab_ids": ["v_wake_up", "v_breakfast", "v_brush"]
    },
    {
      "type": "practice",
      "game_type": "sentence_order",
      "sentence": "I wake up at 7 o'clock.",
      "scrambled": ["o'clock", "7", "at", "wake up", "I"]
    },
    {
      "type": "practice",
      "game_type": "listening_choice",
      "audio": "home_l3_q1.mp3",
      "choices": [
        {
          "text": "He brushes his teeth.",
          "image": "brush.png",
          "correct": true
        },
        {
          "text": "He eats breakfast.",
          "image": "eat.png",
          "correct": false
        }
      ]
    }
  ]
}
```

---

## 五、GitHub 开源项目参考

以下项目按对你设计的参考价值排序，建议逐一下载阅读源码：

| 项目 | 语言/框架 | ⭐ | 对你最直接的参考价值 |
|------|----------|----|----------------------|
| [MatchYouPikchu/tamagotchi-learning-languages](https://github.com/MatchYouPikchu/tamagotchi-learning-languages) | Python + Pygame | — | 宠物状态机设计、词汇与宠物的绑定方式 |
| [laicwew/HelloMee](https://github.com/laicwew/HelloMee) | Vue | — | 外星人学地球语言的故事驱动设计、角色代入 |
| [full-steam/forlorn](https://github.com/full-steam/forlorn) | Unity / C# | 6 | 基于输入假说 + 可理解输出假说的教学理论落地、关卡结构 |
| [1nFrastr/julebu-nextjs-clone-core](https://github.com/1nFrastr/julebu-nextjs-clone-core) | Next.js + TypeScript | 11 | 英语打字 + AI 场景生成 pipeline、语音发音 |
| [Kyelo0310/word-quest-toeic-rpg](https://github.com/Kyelo0310/word-quest-toeic-rpg) | — | — | TOEIC 词汇→战斗数值映射、抽卡设计思路 |
| [ymjkr0921-spec/wordpet](https://github.com/ymjkr0921-spec/wordpet) | JavaScript | — | AI 对话与宠物养成的结合方式 |
| [dadaotiantian/ai-teacher](https://github.com/dadaotiantian/ai-teacher) | Java | — | 多角色模式（导师/伴侣/宠物/游戏）切换灵感 |
| [nazwahafiza-a11y/english-typing-defense](https://github.com/nazwahafiza-a11y/english-typing-defense) | JavaScript | — | 输入→实时反馈循环、RPG 式防御玩法 |
| [kursat-dev/english-learn-game](https://github.com/kursat-dev/english-learn-game) | JavaScript | 5 | A2/B1 语法词汇的 web 应用组织方式 |
| [junjiah/VocabRPG](https://github.com/junjiah/VocabRPG) | Objective-C | 3 | RPG 与词汇记忆的融合思路 |

### 商业游戏参考

| 游戏 | 可借鉴的设计点 |
|------|--------------|
| **Duolingo** | 技能树、连胜 streak、心形体力、碎片化 5-10 分钟一局 |
| **Tamagotchi / 宝可梦** | 喂食/清洁/玩耍→进化；队伍养成 + 属性克制 |
| **Stardew Valley** | 日常日程、好感度系统、节日事件 |
| **互动小说 / 视觉小说** | 选择分支→故事走向，天然适合语言输入 |

---

## 六、核心技术选型建议

| 层次 | 推荐技术 | 原因 |
|------|---------|------|
| 前端框架 | **React** 或 **Vue 3** | 生态成熟，社区资源多 |
| 游戏引擎 / 动画 | **Phaser.js** 或 **PixiJS** | 2D 游戏渲染，轻量，宠物动画 |
| 后端 | **Node.js + Express** 或 **Python FastAPI** | 快速开发，ORM 支持好 |
| 数据库 | **SQLite**（单机）或 **PostgreSQL**（服务端） | 词汇 + 进度存储 |
| AI 对话 | **OpenAI API** / **本地 Llama** | 动态生成对话（可选） |
| 语音 | **Web Speech API** (TTS) / **ElevenLabs** | 发音朗读 |
| 打包 | **Electron** 或 **Tauri** | 桌面应用打包 |

**推荐 MVP 技术栈**：React + PixiJS + SQLite + Web Speech API，全部在本地运行，无需服务器。

---

_本方案由 GitHub 开源项目调研 + 商业游戏设计研究综合产出，涵盖了从 UI 布局、核心玩法、数值体系到内容结构的完整设计。_
