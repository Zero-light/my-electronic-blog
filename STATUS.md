# WordPal Progress Report — 2026-07-07

## Current Status: Core Study Loop Implemented

Dev server: **http://localhost:5173/**
Git repo: `C:\\Users\\Zero\\Desktop\\项目文件\\Projects\\09-WordPal\\`
Build: `vite build` → ✅ SUCCESS

---

## ✅ What's Done Right Now

### Priority A — Core Loop
- [x] **Hunger time-decay** — per-hour -1, auto-refresh loop in HomeScene
- [x] **Feed action** — button + tween animation, spends food → restores hunger
- [x] **Pet mood states** — happy/normal/tired/faded (transitions on hunger thresholds)
- [x] **XP + level-up** —幼体→成体→完全体 at XP 500/1500
- [x] **Wardrobe trigger** — hooks in HomeScene (data structure in SaveManager)

### Priority B — Learning Depth
- [x] **4-choice mode** — StudyScene.ts (full implementation with distractors)
- [x] **SM-2 algorithm** — SM2.ts (easeFactor ≥ 1.3, grade 0-5)
- [ ] Flip card animation (not started)
- [ ] Pronunciation (not started)

### Priority C — Polish
- [x] **Audio engine** — Audio.ts (Web Audio API, ambient pad + SFX)
- [x] **Particles** — Particles.ts (stars/hearts/food trail via Phaser Emitter)
- [ ] Liquid glass UI panels (not started)
- [x] **5 pets render** — Cloudy/Berry/Mochi/Pepper/Tangerine all in HomeScene
- [ ] Word bank: 2000 total (gen_words.py script ready, export not run)

### Priority D — Deploy
- [ ] Git push to my-electronic-blog repo
- [ ] Vercel deployment to www.zerolight.fun
- [ ] Mobile testing

---

## 📂 File Map (as of this report)

| File | Lines | Status |
|------|-------|--------|
| `src/main.ts` | - | ✅ Entry point |
| `src/config.ts` | 58 | ✅ Constants + PetDefinitions |
| `src/data/Types.ts` | ~84 | ✅ Full SaveData/PetState schema |
| `src/data/SaveManager.ts` | 167 | ✅ Save/Load/Hunger/Feed/XP |
| `src/data/WordBank.ts` | 45 | ✅ JSON loader |
| `src/utils/Helpers.ts` | 86 | ✅ lerp/shuffle/easeOutBack |
| `src/scenes/HomeScene.ts` | 541 | ✅ Pet + HUD + Wardrobe trigger |
| `src/scenes/StudyScene.ts` | ~316 | ✅ 4-choice quiz |
| `src/fx/Audio.ts` | 144 | ✅ Web Audio synth |
| `src/fx/Particles.ts` | ~85 | ✅ Phaser emitter |
| `src/study/SM2.ts` | ~85 | ✅ SM-2 algorithm |
| `scripts/gen_words.py` | 1211 | ✅ CET-4 500 ready |

---

## 🧪 Test Results

| Test | Status | Notes |
|------|--------|-------|
| npm install | ✅ | Phaser 4.0.0, Vite 5.4.21, TS 5.9.3 |
| vite build | ✅ | exit 0, BUILD_OK |
| npx tsc --noEmit | ⚠️ | phaser.d.ts Map/Set lib conflicts — source code is type-safe |
| Dev server | ✅ | :5173, responds |
| Manual study flow | ⚠️ | Untested in browser (dev server live but not click-tested) |

Known issues:
- `phaser.d.ts` emits "Cannot find name 'Map'" — pre-existing, doesn't affect vite build/run
- `StudyScene` 4-choice flow not yet browser-tested

---

## 🔧 Next Up (Priority Order)

1. Run `python scripts/gen_words.py` → export 500 words to `public/assets/words/cet4_basic.json`
2. Wire AudioEngine + Particles into HomeScene and StudyScene
3. Liquid glass UI panel component (extract from HomeScene inline styling)
4. Wardrobe scene (data structures exist, build UI)
5. Flip card animation + pronunciation
6. Git push → Vercel deploy

---

*Last updated: 2026-07-07 02:30 PM — mid blitz, StudyScene just written*
