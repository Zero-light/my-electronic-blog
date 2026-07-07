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
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => { init(); }, [init]);

  useEffect(() => {
    const handler = (e: Event) => { e.preventDefault(); setDeferredPrompt(e); setShowInstall(true); };
    window.addEventListener('beforeinstallprompt', handler);
    // Also check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) setShowInstall(false);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === 'accepted') setShowInstall(false);
    setDeferredPrompt(null);
  };

  return (
    <div className="w-full h-full relative overflow-hidden">
      <GradientBg />
      {/* Install banner */}
      {showInstall && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[400] glass-panel px-4 py-2.5 flex items-center gap-3 animate-slideUp">
          <Download size={16} className="text-white/70" />
          <span className="text-white/80 text-sm font-medium">安装到手机桌面</span>
          <button className="glass-btn glass-btn-feed px-3 py-1 text-xs" onClick={handleInstall}>安装</button>
          <button className="text-white/30 hover:text-white/60" onClick={() => setShowInstall(false)}><X size={14} /></button>
        </div>
      )}
      <div className="absolute inset-0 pb-24 z-40 overflow-y-auto" style={{ paddingTop: showInstall ? '48px' : '0' }}>
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
