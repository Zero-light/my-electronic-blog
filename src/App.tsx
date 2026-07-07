import React, { useEffect, useState } from 'react';
import { useGameStore } from './store/gameStore';
import { GradientBg } from './components/GradientBg';
import { TabBar, type TabId } from './components/TabBar';
import { SearchTab } from './components/SearchTab';
import { WordbookTab } from './components/WordbookTab';
import { LearnTab } from './components/LearnTab';
import { ReviewTab } from './components/ReviewTab';
import { ChallengeTab } from './components/ChallengeTab';

const App: React.FC = () => {
  const init = useGameStore(s => s.init);
  const [activeTab, setActiveTab] = useState<TabId>('search');

  useEffect(() => { init(); }, [init]);

  return (
    <div className="w-full h-full relative overflow-hidden">
      <GradientBg />
      <div className="absolute inset-0 pb-24 z-40 overflow-y-auto">
        {activeTab === 'search' && <SearchTab onNavigate={(t) => setActiveTab(t as TabId)} />}
        {activeTab === 'wordbook' && <WordbookTab />}
        {activeTab === 'learn' && <LearnTab />}
        {activeTab === 'review' && <ReviewTab />}
        {activeTab === 'challenge' && <ChallengeTab />}
      </div>
      <TabBar active={activeTab} onChange={setActiveTab} />
    </div>
  );
};

export default App;
