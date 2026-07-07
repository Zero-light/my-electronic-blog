# WordPal Progress Report — 2026-07-07 (更新)

## Current Status: Core Loop Complete + Pushed to GitHub

Dev server: **http://localhost:5173/**
Git repo: **github.com/Zero-light/my-electronic-blog**
Build: `vite build` → ✅ SUCCESS

---

## ✅ What's Done Right Now

### Priority A — Core Loop
- [x] **Hunger time-decay** — per-hour -1, auto-refresh loop in HomeScene
- [x] **Feed action** — button + tween animation, spends food → restores hunger
- [x] **Pet mood states** — happy/normal/tired/faded (transitions on hunger thresholds)
- [x] **XP + level-up** — 幼体→成体→完全体 at XP 100/300
- [x] **Wardrobe trigger** — hooks in HomeScene, registered in main.ts

### Priority B — Learning Depth
- [x] **4-choice quiz** — StudyScene.ts (full implementation with distractors, streak, progress bar, summary)
- [x] **SM-2 algorithm** — SM2.ts (easeFactor ≥ 1.3, grade 0-5)
- [x] **Audio wired** — click/feed SFX in HomeScene, correct/wrong in StudyScene
- [x] **Particles wired** — star bursts on correct, hearts on streaks, food trail
- [x] **1050 考研英语二词汇** — kaoyan_basic.json (生成并接入)
- [ ] Flip card animation (not started)
- [ ] Pronunciation (not started)

### Priority C — Polish
- [x] **Audio engine** — Audio.ts (Web Audio API, ambient pad + SFX, wired)
- [x] **Particles** — Particles.ts (stars/hearts/food trail, wired)
- [ ] Liquid glass UI panels (not started)
- [x] **5 pets render** — Cloudy/Berry/Mochi/Pepper/Tangerine all in HomeScene
- [x] **Scene architecture fixed** — all 4 scenes registered, StudyScene → proper 4-choice

### Priority D — Deploy
- [x] **Git push** → github.com/Zero-light/my-electronic-blog ✅
- [ ] Vercel deployment to www.zerolight.fun
- [ ] Mobile testing

---

## 📂 File Map (Updated)

| File | Lines | Status |
|------|-------|--------|
| `src/main.ts` | 28 | ✅ All 4 scenes registered |
| `src/config.ts` | 58 | ✅ Constants + PetDefinitions |
| `src/data/Types.ts` | 85 | ✅ Full SaveData/PetState schema |
| `src/data/SaveManager.ts` | 167 | ✅ Save/Load/Hunger/Feed/XP |
| `src/data/WordBank.ts` | 45 | ✅ Kaoyan word pack config |
| `src/utils/Helpers.ts` | 86 | ✅ lerp/shuffle/easeOutBack |
| `src/scenes/HomeScene.ts` | ~405 | ✅ Pet + HUD + Audio + Wardrobe |
| `src/scenes/StudyScene.ts` | ~380 | ✅ Full 4-choice quiz + Audio + Particles |
| `src/fx/Audio.ts` | 144 | ✅ Wired into Home + Study |
| `src/fx/Particles.ts` | 85 | ✅ Wired into StudyScene |
| `src/study/SM2.ts` | 85 | ✅ SM-2 algorithm |
| `public/assets/words/kaoyan_basic.json` | - | ✅ 1050 考研英语二词汇 |
| `scripts/gen_kaoyan.js` | - | ✅ 词库生成脚本 |

---

## 🔧 本次修改摘要

1. **场景架构修复**: main.ts 注册全部 4 个场景，StudyScene 改为真正的 4选1 模式
2. **词库升级**: CET-4 → 考研英语二 1050 核心词汇
3. **音效粒子接入**: HomeScene 和 StudyScene 均已接入 AudioEngine + Particles
4. **Git 推送**: 已推送至 github.com/Zero-light/my-electronic-blog

---

*Last updated: 2026-07-07 — scene architecture fix + kaoyan word bank + audio/particles wired + git push*
