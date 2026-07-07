import React from 'react';
import { Home, BookOpen, RotateCcw, Zap, ShoppingBag } from 'lucide-react';

export type TabId = 'home' | 'learn' | 'review' | 'challenge' | 'backpack';

interface TabBarProps { active: TabId; onChange: (tab: TabId) => void; }

const TABS: { id: TabId; label: string; Icon: React.FC<{ size?: number }> }[] = [
  { id: 'home', label: '首页', Icon: (p) => <Home {...p} /> },
  { id: 'learn', label: '学习', Icon: (p) => <BookOpen {...p} /> },
  { id: 'review', label: '复习', Icon: (p) => <RotateCcw {...p} /> },
  { id: 'challenge', label: '挑战', Icon: (p) => <Zap {...p} /> },
  { id: 'backpack', label: '商店', Icon: (p) => <ShoppingBag {...p} /> },
];

export const TabBar: React.FC<TabBarProps> = ({ active, onChange }) => (
  <div className="tab-bar">
    {TABS.map(tab => (
      <button
        key={tab.id}
        className={`tab-btn ${active === tab.id ? 'active' : ''}`}
        onClick={() => onChange(tab.id)}
      >
        <span className="tab-icon"><tab.Icon size={17} /></span>
        {tab.label}
      </button>
    ))}
  </div>
);
