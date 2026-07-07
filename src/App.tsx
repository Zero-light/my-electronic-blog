/**
 * App.tsx — WordPal with Tab Navigation
 * Tabs: Home (pet) | Learn (new words) | Review (quiz) | Shop (items)
 */
import React, { useEffect, useState } from 'react';
import { useGameStore } from './store/gameStore';
import { GradientBg } from './components/GradientBg';
import { TabBar, type TabId } from './components/TabBar';
import { HomeTab } from './components/HomeTab';
import { LearnTab } from './components/LearnTab';
import { ReviewTab } from './components/ReviewTab';
import { ShopTab } from './components/ShopTab';

const App: React.FC = () => {
  const init = useGameStore(s => s.init);
  const [activeTab, setActiveTab] = useState<TabId>('home');

  useEffect(() => { init(); }, [init]);

  return (
    <div className="w-full h-full relative overflow-hidden">
      <GradientBg />

      {/* Tab content */}
      <div className="absolute inset-0 pb-24 z-40 overflow-y-auto">
        {activeTab === 'home' && <HomeTab />}
        {activeTab === 'learn' && <LearnTab />}
        {activeTab === 'review' && <ReviewTab />}
        {activeTab === 'shop' && <ShopTab />}
      </div>

      {/* Tab bar */}
      <TabBar active={activeTab} onChange={setActiveTab} />
    </div>
  );
};

export default App;
