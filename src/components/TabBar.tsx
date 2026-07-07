import React from 'react';
import { Home, BookOpen, RotateCcw, ShoppingBag, Backpack } from 'lucide-react';

export type TabId = 'home' | 'learn' | 'review' | 'shop' | 'backpack';

interface TabBarProps { active: TabId; onChange: (tab: TabId) => void; }

const TABS: { id: TabId; label: string; Icon: React.FC<{ size?: number }> }[] = [
  { id: 'home', label: '首页', Icon: (props) => <Home {...props} /> },
  { id: 'learn', label: '学习', Icon: (props) => <BookOpen {...props} /> },
  { id: 'review', label: '复习', Icon: (props) => <RotateCcw {...props} /> },
  { id: 'backpack', label: '背包', Icon: (props) => <Backpack {...props} /> },
  { id: 'shop', label: '商店', Icon: (props) => <ShoppingBag {...props} /> },
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
