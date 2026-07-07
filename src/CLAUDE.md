# CLAUDE.md — WordPal 项目指引

> 此文件帮助 Claude Code 理解项目约定，特别是 Phaser 4 特有的开发约束。

---

## 项目概述

**WordPal** — 英语学习 + 宠物养成网页游戏（Phaser 4 + TypeScript + Vite）

- 仓库：`github.com/Zero-light/my-electronic-blog`（覆盖替换）
- 自动部署：Vercel 监听 push → `www.zerolight.fun`
- 玩家背单词 → 获取食物 → 投喂宠物 → 宠物成长/解锁装扮

---

## 核心技术约束

### 引擎版本
- Phaser **4.0.0-rc.7**（必须严格此版本）
- 使用 **Beam WebGL Renderer**（`Phaser.WEBGL`），不能用 Canvas
- TypeScript **5.x**，严格模式开启
- Vite **5.x** dev server + build

### Phaser 4 破坏性 API（永远不用）
| 废弃的 Phaser 3 API | 替代方式 |
|---------------------|---------|
| `Phaser.Geom.Point` | `Phaser.Math.Vector2` 或 `{x, y}` |
| `Phaser.Math.PI2` | `Math.PI * 2` |
| `Phaser.Structs.*` | 直接操作 Map/Array |
| `Phaser.GameObjects.Text` 的 `setAlign()` | `setOrigin(0.5)` + `setAlign('center')` |
| `DynamicTexture.render()` | `GameObject.renderWebGL()` 重写 |
| `Phaser.Scene.sleep()` | `this.time.delayedCall()` |
| `Phaser.Sprite.anims.play()` 传 `startFrame` | 直接指定动画 key |

### 必须遵守的模式
```typescript
// ✅ 常量/类型集中管理
// src/data/Types.ts 存放所有 interface 和 enum

// ✅ Scene 之间通过 Registry 传数据
this.registry.set('foodCount', 42);

// ✅ HUD 层单独 Scene，不与游戏场景耦合
// HUDScene 固定在最上层 (depth=1000)

// ✅ 所有 FX (Blur/Glow/BlurPipeline) 只在 WebGL 下用
// 参见: src/fx/ShaderFx.ts
```

---

## 目录结构（严格按此创建）

```
wordpal/
├── index.html                    ← Phaser 入口
├── package.json                  ← 依赖清单
├── tsconfig.json
├── vite.config.ts
├── README.md
├── public/
│   └── audio/                    ← Web Audio 生成的音效（运行时）
├── src/
│   ├── main.ts                   ← game config + 启动
│   ├── config.ts                 ← 所有常量（颜色/尺寸/字体/速度）
│   ├── data/
│   │   ├── Types.ts              ← 全部 TS interface + enum
│   │   ├── WordBank.ts           ← 词库加载 + 分类 + 进度查询
│   │   └── SaveManager.ts        ← localStorage 存档
│   ├── scenes/
│   │   ├── BootScene.ts          ← 预加载 → 初始化 SaveManager
│   │   ├── HomeScene.ts          ← 站立宠物 + 互动（主界面）
│   │   ├── StudyScene.ts         ← 学习流程（卡 + 选项 + 反馈）
│   │   ├── ShopScene.ts          ← 装扮网格 + 购买 + 穿戴
│   │   └── MiniGameScene.ts      ← 60秒跑酷小游戏
│   ├── ui/
│   │   ├── HUD.ts                ← 顶部状态条 + 底部导航栏
│   │   ├── LiquidPanel.ts        ← 液态玻璃面板（Blur FX + 圆角）
│   │   ├── WordCard.ts           ← 单词卡组件（翻转动画）
│   │   └── PetRenderer.ts        ← 宠物绘制 + 状态切换
│   ├── pet/
│   │   ├── Pet.ts                ← 宠物类（饥饿/心情/成长/衣服）
│   │   ├── PetAnimator.ts        ← 动画状态机
│   │   ├── Cosmetics.ts          ← 装扮系统
│   │   └── PetFactory.ts         ← 5 只宠物的数据定义
│   ├── study/
│   │   ├── SM2.ts                ← SM-2 间隔重复算法
│   │   └── StudySession.ts       ← 学习流程状态机
│   ├── fx/
│   │   ├── Particles.ts          ← 粒子预设（星星/爱心/碎片/糖果）
│   │   └── LiquifyPipeline.ts    ← 液态玻璃 Shader（BlurV + BlurH）
│   └── utils/
│       ├── Audio.ts              ← Web Audio API 音效合成器
│       ├── Speech.ts             ← SpeechSynthesis 单词朗读
│       └── Easing.ts             ← 自定义缓动函数（果冻回弹）
```

---

## 设计规范

### 液态玻璃 UI
```typescript
// 卡片背景：alpha 0.15 填充 + 白色边缘高光
// cornerRadius: 16~24
// Phaser 4 方式：Graphics fillStyle(color, 0.15) + fillRoundedRect()
// Blur FX：不在每个元素上应用，而是给「背景层」整体加 Blur(3)
// 前景层保持清晰 — 毛玻璃效果由此产生
```

### 颜色系统
```typescript
const COLORS = {
  bg:        0xE8F0FF,  // 页面背景（淡蓝白）
  primary:   0x7C9CF8,  // 主色（柔紫蓝按钮）
  secondary: 0xB8E6FF,  // 辅色（浅湖蓝）
  accent:    0xFFE5F1,  // 强调（淡粉，用于星星粒子）
  correct:   0x77DD77,  // 正确（柔绿）
  wrong:     0xFFFF00,  // 错误（柔和橙，不用纯红）
  textDark:  0x2D3748,  // 深色文字
  textLight: 0x718096,  // 浅色文字
  white:     0xFFFFFF,  // 纯白
}
```

### 字体
```typescript
// Fredoka Rounded — 标题（loaded via webfontloader）
// Nunito 正文
// 中文用系统字体栈：`"PingFang SC", "Microsoft YaHei", sans-serif`
// 字号层级：h1=32 / h2=24 / body=18 / caption=14
```

### 交互反馈（每个操作必须带）
- **点击按钮**: `tween scale(1→0.92→1.05→1.0, 150ms)` + click_01 音效
- **答对**: 卡片翻绿 + 弹出绿色勾选 + 5 颗星星粒子迸发 + correct 音效
- **答错**: 卡片轻微震动（x 抖动 ±8px × 4 帧）+ 橙色闪烁 + wrong 音效
- **喂食**: 食物从卡片飞向宠物（贝塞尔曲线 tween）
- **宠物点击**: 果冻弹跳 + 1~2 颗爱心粒子 + 宠物发出"咕噜"声

### 动画节奏
- 所有过渡 200-350ms
- ease: 大部分用 `Cubic.easeOut`（快速启动、平滑停下）
- 果冻回弹：用 `Elastic.easeOut` 或自定义 overshoot 缓动
- 学习场景切换：300ms `Slide` 过渡

---

## 宠物设计（5 只，程序化绘制）

> 风格：圆润几何体、半透明果冻质感、鲜明色彩、清晰形象

| # | 名字 | 颜色 | 形象 | 解锁条件 |
|---|------|------|------|---------|
| 1 | Cloudy | #A8D8EA | 云朵（水滴形+小卷尾）| 默认 |
| 2 | Berry | #FFB5C5 | 草莓熊（椭圆+绿叶帽）| 首日打卡 |
| 3 | Mochi | #F5E6CA | 麻薯（椭圆+凹陷弹弹）| 累计 100 词 |
| 4 | Pepper | #5B5B5B | 小柴犬（三角耳+卷尾）| 第 7 天签到 |
| 5 | Tangerine | #FDBE3F | 小橘子（扁圆+绿宝石叶）| 第一次进化 |

### 宠物绘制规则
1. 身体：Phaser Graphics 绘制椭圆 + 渐变填充（顶部亮、底部暗模拟璃透光感）
2. 眼睛：2 个黑色椭圆 + 1 个白色小高光点
3. 腮红：粉色半透明小圆
4. 根据形象在身体上叠加标志性配件（叶/耳/卷尾）
5. 所有宠物共用相同的基础骨骼结构

---

## 音效系统（Web Audio API）

### AudioEngine 核心类
```typescript
// 单例，整个游戏共享一个 AudioContext
// gainNode → masterGain
// masterGain.volume 全局音量
```

### 音效预设（用振荡器合成）
| 名称 | 频率波形 | 持续时间 | 用途 |
|------|---------|---------|------|
| click_01 | 方波 800Hz | 30ms | 按钮点击 |
| correct | 正弦 523→C5 + 659→E5 | 150ms | 答对 |
| wrong | 正弦 300Hz 降调 | 300ms | 答错 |
| eat_munch | 白噪声爆发 | 80ms | 宠物进食 |
| evolve | 三连琶音 C-E-G | 600ms | 进化 |
| happy_bell | 正弦 1047Hz + 谐波 | 300ms | 宠物开心 |

### 背景音乐
- **必须安静耐听**：不能用鼓点/快节奏
- 用 Web Audio 合成 4 小节 ambient pad（C大调和弦：C-G-Am-F）
- 每 8 秒循环一次
- 主音量 0.3（不能压过音效）
- 进入学习场景时暂停（避免干扰），回到家恢复

---

## 学习系统规则

### 词汇文件路径
```
public/assets/words/
├── cet4_basic.json       ← CET-4 核心 500
├── cet4_advanced.json    ← CET-4 扩展 500
├── kaoyan_basic.json     ← 考研 1500 核心
└── kaoyan_advanced.json  ← 考研 3000 扩展
```

### 词汇条目结构
```typescript
interface WordEntry {
  id: string
  word: string            // 英文
  phonetic: string        // 音标
  meaning: string         // 中文释义（简短）
  example?: string        // 英文例句
  exampleTranslation?: string // 例句翻译
  tags?: string[]         // 标签(考研/四级/阅读词汇)
}
```

### 学习流程（1 轮 = 20 词）
1. 进入 StudyScene → WordBank.getNextBatch(20)
2. 显示 WordCard（正面英文 + 音标 + 发音按钮）
3. 点击翻转 → 背面中文释义（0.4s flip tween）
4. 用户选择：认识 / 不认识 / 模糊
5. 选项即时反馈（绿/橙）+ 宠物收到对应食物
6. 连续 3 次"认识" → 奖励金苹果（宠物大满足表情）
7. 全组完成 → 本轮奖励：食物 + 装扮碎片 + 宠物经验

### SM-2 间隔简化算法
```
quality: 0-5（0=完全忘，5=瞬间回忆）
- quality < 3: 间隔重置为 1 分钟
- quality >= 3: 间隔 × easeFactor (初始 2.5)
- easeFactor += (0.1 - (5-q) * (0.08 + (5-q)*0.02))
- easeFactor = max(1.3, easeFactor)
- 下次复习日期 = 当前 + 间隔(天)
```

---

## 存档系统

### SaveData 结构
```typescript
interface SaveData {
  version: number          // 用于未来迁移
  createdAt: number
  lastLogin: number
  totalWordsLearned: number
  foodCount: number
  heartCount: number
  dailyStreak: number        // 连续打卡天数
  lastCheckin: string       // 'YYYY-MM-DD'
  currentPet: PetId         // 当前使用的宠物
  unlockedPets: PetId[]     // 已解锁宠物列表
  cosmetics: {              // 宠物装扮
    petId: PetId,
    hat?: string,
    tie?: string,
    color?: string,
    background?: string
  }[]
  studyProgress: {          // 每个词的学习进度
    wordId: string
    easeFactor: number
    intervalDays: number
    lastReview: string      // 'YYYY-MM-DD'
    ratingHistory: number[]
  }[]
  achievements: string[]    // 成就 ID 列表
}
```

### localStorage Key
```
const SAVE_KEY = 'wordpal.v1.save'
```

每次关键动作（答完一轮/换装/喂食物/升级）都调用 `SaveManager.write()`。

---

## 验证清单（每次改动后）

- [ ] `npx tsc --noEmit` → 无 TS 编译错误
- [ ] `npx vite build` → build 成功，无 chunk 警告
- [ ] Phaser 版本确认：`grep '"phaser"' package.json` 应为 `^4.0.0-rc.7`
- [ ] 没有使用任何 Phaser 3 废弃 API
- [ ] 音效合成：运行时间 ≤ 50ms / 次
- [ ] 启动后 `www.zerolight.fun` 无 console 报错
- [ ] localStorage 存档在读/写/重置时不抛错

---

## 部署约定（Hermes 执行，Claude Code 别碰）

- 验证通过后：`npm run build` + `git push`
- Vercel 自动部署，2 分钟内生效
- 不要修改 vercel.json / .gitignore / package-lock.json（除非必要）
