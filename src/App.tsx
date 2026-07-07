/**
 * App.tsx — WordPal Main Game Screen
 * All components assembled with glass morphism + interactions
 */
import React, { useEffect, useState, useCallback } from 'react';
import { BookOpen, Apple, ShoppingBag, PawPrint } from 'lucide-react';
import { useGameStore } from './store/gameStore';
import { GradientBg } from './components/GradientBg';
import { Pet } from './components/Pet';
import { FoodHUD } from './components/FoodHUD';
import { DailyTasks } from './components/DailyTasks';
import { MoodBubble } from './components/MoodBubble';
import { GlassButton } from './components/GlassButton';
import { ProgressBar } from './components/ProgressBar';
import { StudyModal } from './components/StudyModal';
import { ShopDrawer } from './components/ShopDrawer';
import { PetGallery } from './components/PetGallery';
import { OfflineModal } from './components/OfflineModal';

const App: React.FC = () => {
  const {
    save, init, showStudy, showShop, showPetGallery, showOffline,
    openStudy, doFeed, toggleShop, togglePetGallery,
  } = useGameStore();
  const [petStyle, setPetStyle] = useState({});
  const [moodBubble, setMoodBubble] = useState(false);
  const [feedFeedback, setFeedFeedback] = useState(false);
  const [hoverParallax, setHoverParallax] = useState({ x: 0, y: 0 });

  useEffect(() => { init(); }, [init]);

  // Mouse parallax
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    setHoverParallax({
      x: ((e.clientX - cx) / cx) * 0.05,
      y: ((e.clientY - cy) / cy) * 0.04,
    });
  }, []);

  // Pet mood
  const mood = save.pet.hunger >= 70 ? 'happy'
    : save.pet.hunger >= 40 ? 'normal'
    : save.pet.hunger >= 20 ? 'sad' : 'hungry';

  const handleFeed = () => {
    if (doFeed()) {
      setFeedFeedback(true);
      setTimeout(() => setFeedFeedback(false), 1200);
    }
  };

  const handlePetClick = () => setMoodBubble(true);

  return (
    <div
      className="w-full h-full relative overflow-hidden"
      onMouseMove={onMouseMove}
    >
      {/* ── z0: Gradient Background ────────────────────── */}
      <GradientBg />

      {/* ── z50: Top HUD ───────────────────────────────── */}
      <FoodHUD />
      <DailyTasks />

      {/* ── z50: Pet Area ──────────────────────────────── */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          transform: `translate(${hoverParallax.x * 60}px, ${hoverParallax.y * 40}px)`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        <div className="flex flex-col items-center gap-2 pointer-events-auto">
          {/* Mood bubble */}
          {moodBubble && (
            <MoodBubble
              hunger={save.pet.hunger}
              onDismiss={() => setMoodBubble(false)}
            />
          )}

          {/* Pet SVG */}
          <div
            className="cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95"
            onClick={handlePetClick}
          >
            <Pet
              type={save.currentPet as any}
              mood={mood}
              level={save.pet.level as any}
              size={240}
            />
          </div>

          {/* Feed feedback */}
          {feedFeedback && (
            <div className="glass-chip text-warm-400 animate-slideUp opacity-0">
              🍎 好吃!
            </div>
          )}
        </div>
      </div>

      {/* ── z50: Hunger Bar ────────────────────────────── */}
      <div className="absolute bottom-36 left-1/2 -translate-x-1/2 w-[320px] z-50">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-white/50">
            {mood === 'happy' ? '♡ 好开心~' : mood === 'normal' ? '平静' : mood === 'sad' ? '有点饿...' : '饿坏了...'}
          </span>
          <span className="text-xs text-white/40 ml-auto">{Math.round(save.pet.hunger)}%</span>
        </div>
        <ProgressBar
          progress={save.pet.hunger / 100}
          showShimmer
        />
      </div>

      {/* ── z50: XP Bar ────────────────────────────────── */}
      <div className="absolute top-3 right-4 w-36 z-50">
        <div className="flex items-center gap-1 mb-0.5">
          <span className="text-[10px] text-white/40">
            LV{ save.pet.level === 'baby' ? 1 : save.pet.level === 'adult' ? 2 : 3 }
          </span>
          <span className="text-[10px] text-white/30 ml-auto">
            {save.pet.xp}/
            {save.pet.level === 'baby' ? 100 : save.pet.level === 'adult' ? 300 : 500}
          </span>
        </div>
        <ProgressBar
          progress={
            save.pet.level === 'baby' ? save.pet.xp / 100
            : save.pet.level === 'adult' ? (save.pet.xp - 100) / 200
            : (save.pet.xp - 300) / 200
          }
          showShimmer
        />
      </div>

      {/* ── z50: Action Buttons ────────────────────────── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-50">
        <GlassButton variant="primary" onClick={openStudy}>
          <BookOpen size={16} /> 开始学习
        </GlassButton>
        <GlassButton variant="feed" onClick={handleFeed}>
          <Apple size={16} /> 喂食
        </GlassButton>
        <GlassButton variant="shop" onClick={toggleShop}>
          <ShoppingBag size={16} /> 装扮
        </GlassButton>
        <GlassButton variant="back" onClick={togglePetGallery}>
          <PawPrint size={16} /> 换宠
        </GlassButton>
      </div>

      {/* ── Modals ──────────────────────────────────────── */}
      {showStudy && <StudyModal />}
      {showShop && <ShopDrawer />}
      {showPetGallery && <PetGallery />}
      {showOffline && <OfflineModal />}
    </div>
  );
};

export default App;
