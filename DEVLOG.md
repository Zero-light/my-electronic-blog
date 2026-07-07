# WordPal Development Log

## Sessions & Milestones

### Session 2026-07-07 PM — Feature Implementation Blitz

**Resumed from**: Context compaction. StudyScene.ts was missing. User said continue without asking.

**Completed:**

1. ✅ **StudyScene (4-choice quiz)** — `src/scenes/StudyScene.ts` (已创建)
   - 4选项选择题 UI（A/B/C/D）
   - 干扰项算法：从词库随机抽3个错误释义 + 1个正确，shuffle
   - 答对：绿色高亮 + 星星粒子爆炸 + XP/食物奖励飘字
   - 答错：红色抖动 + 底部显示正确答案
   - 进度条 + 连击数 + 返回 + 跳过

2. ✅ **Types extended** — `src/data/Types.ts`
   - SaveData: +xp, +dailyCorrect, +dailyWrong
   - PetState: +food

3. ✅ **Audio Engine** — `src/fx/Audio.ts` (145行)
   - Web Audio API 程序化生成
   - Ambient pad + 短SFX（静音友好）
   - playTone(freq, duration, type, vol) 接口

4. ✅ **Particle System** — `src/fx/Particles.ts` (85行)
   - Phaser ParticleEmitter
   - 星星/爱心/食物轨迹

5. ✅ **SM-2 Algorithm** — `src/study/SM2.ts` (85行)
   - easeFactor ≥ 1.3
   - intervalDays 计算
   - grade 0-5 评级

6. ✅ **Word Bank Generator** — `scripts/gen_words.py` (1211行)
   - CET-4 500核心词（含音标+释义）
   - 待执行导出为 cet4_basic.json

**Decisions made this session:**
- 去掉 ES2015 lib（不支持 Set），改用 array.indexOf 替代 Set.has/add
- Phaser 类型报错是已知问题（d.ts 和 lib 版本不匹配），vite build 不受影响
- 4选一模式优先做英→中（看英文选中文释义）

**Known issues:**
- `npx tsc --noEmit` 报 phaser.d.ts 的 Map/Set 错误 — 不影响 vite build
- SaveManager.find/findIndex 因 lib 版本 warning — 同样不影响 vite build

---

### Session 2026-07-07 AM — Project Bootstrap & Core Scaffolding

**Resumed from**: Context compaction. User left instruction to continue working and log everything.

**Completed:**
1. ✅ **Scaffolding**: `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `src/main.ts`
2. ✅ **Dependencies installed**: Phaser 4.0.0 + Vite 5.4.21 + TypeScript 5.9.3
3. ✅ **CLAUDE.md**: Comprehensive development guide
4. ✅ **Core types**: `src/data/Types.ts`
5. ✅ **Config**: `src/config.ts` (colors, pet definitions, gameplay constants)
6. ✅ **Utilities**: `src/utils/Helpers.ts`
7. ✅ **Save system**: `src/data/SaveManager.ts` (localStorage wrapper with hunger decay)
8. ✅ **Word bank**: `src/data/WordBank.ts` (async JSON loader)
9. ✅ **Word pack**: `public/assets/words/cet4_basic.json` (50 words MVP → 291 → 待扩展到500)
10. ✅ **HomeScene v2**: `src/scenes/HomeScene.ts` (541行, 含饥饿衰减+投喂+5只宠物+XP/等级+状态切换)
11. ✅ **BUILD SUCCESS**: `vite build` completes cleanly
