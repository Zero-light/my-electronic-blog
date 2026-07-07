import React, { useEffect, useState } from 'react';
import { useGameStore } from './store/gameStore';
import { GradientBg } from './components/GradientBg';
import { TabBar, type TabId } from './components/TabBar';
import { SearchTab } from './components/SearchTab';
import { WordbookTab } from './components/WordbookTab';
import { LearnTab } from './components/LearnTab';
import { ReviewTab } from './components/ReviewTab';
import { ChallengeTab } from './components/ChallengeTab';
import { Download, X } from 'lucide-react';

const App: React.FC = () => {
  const init = useGameStore(s => s.init);
  const [activeTab, setActiveTab] = useState<TabId>('search');
  const [subView, setSubView] = useState<'search' | 'learn' | 'review'>('search');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => { init(); }, [init]);

  useEffect(() => {
    const handler = (e: Event) => { e.preventDefault(); setDeferredPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    if (window.matchMedia('(display-mode: standalone)').matches) setInstalled(true);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result.outcome === 'accepted') setInstalled(true);
      setDeferredPrompt(null);
    } else {
      alert('请使用浏览器菜单中的"添加到桌面"或"安装应用"功能');
    }
  };

  return (
    <div className="w-full h-full relative overflow-hidden">
      <GradientBg />
      <div className="absolute inset-0 pb-24 z-40 overflow-y-auto">
        {subView === 'learn' && <LearnTab onBack={() => { setSubView('search'); setActiveTab('wordbook'); }} />}
        {subView === 'review' && <ReviewTab onBack={() => { setSubView('search'); setActiveTab('wordbook'); }} />}
        {subView === 'search' && (
          <>
            {activeTab === 'search' && <SearchTab onNavigate={(t) => setSubView(t as 'learn' | 'review')} />}
            {activeTab === 'wordbook' && <WordbookTab />}
            {activeTab === 'challenge' && <ChallengeTab />}
          </>
        )}
      </div>
      <TabBar active={activeTab} onChange={(t) => { setActiveTab(t); setSubView('search'); }} />
    </div>
  );
};

export default App;
