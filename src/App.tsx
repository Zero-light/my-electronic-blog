import React, { useEffect, useState } from 'react';
import { useGameStore } from './store/gameStore';
import { GradientBg } from './components/GradientBg';
import { TabBar, type TabId } from './components/TabBar';
import { HomeTab } from './components/HomeTab';
import { LearnTab } from './components/LearnTab';
import { HouseTab } from './components/HouseTab';
import { ChallengeTab } from './components/ChallengeTab';
import { ShopTab } from './components/ShopTab';
import { DialogueModal } from './components/DialogueModal';
import { AchievementPopup } from './components/AchievementPopup';

const App: React.FC = () => {
  const init = useGameStore(s => s.init);
  const streakReward = useGameStore(s => s.showStreakReward);
  const dismissStreak = useGameStore(s => s.dismissStreakReward);
  const showDialogue = useGameStore(s => s.showDialogue);
  const [activeTab, setActiveTab] = useState<TabId>('home');

  useEffect(() => { init(); }, [init]);

  return (
    <div className="w-full h-full relative overflow-hidden">
      <GradientBg />

      {streakReward && (
        <div className="modal-backdrop z-[200]" onClick={dismissStreak}>
          <div className="glass-panel w-[320px] p-8 text-center animate-slideUp z-[201]" onClick={e => e.stopPropagation()}>
            <span className="text-4xl block mb-3">{streakReward.tier === 1 ? '🔥' : streakReward.tier === 2 ? '🎁' : '👑'}</span>
            <h2 className="text-xl font-bold text-white mb-1">{streakReward.label}</h2>
            <p className="text-white/50 text-sm mb-2">连续 {useGameStore.getState().save.dailyStreak} 天打卡奖励!</p>
            <div className="glass-chip mb-4">+{streakReward.tier * 5} 💎</div>
            <button className="glass-btn w-full" onClick={dismissStreak}>收下!</button>
          </div>
        </div>
      )}

      {showDialogue && <DialogueModal />}
      <AchievementPopup />

      <div className="absolute inset-0 pb-24 z-40 overflow-y-auto">
        {activeTab === 'home' && <HomeTab />}
        {activeTab === 'learn' && <LearnTab />}
        {activeTab === 'house' && <HouseTab />}
        {activeTab === 'challenge' && <ChallengeTab />}
        {activeTab === 'backpack' && <ShopTab />}
      </div>

      <TabBar active={activeTab} onChange={setActiveTab} />
    </div>
  );
};

export default App;
