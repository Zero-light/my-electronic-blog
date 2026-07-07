import React from 'react';
import { Search, BookOpen, Brain, RotateCcw, Zap } from 'lucide-react';

export type TabId = 'search' | 'wordbook' | 'learn' | 'review' | 'challenge';

interface TabBarProps { active: TabId; onChange: (tab: TabId) => void; }

const TABS: { id: TabId; label: string; Icon: React.FC<{ size?: number }> }[] = [
  { id: 'search', label: '查词', Icon: (p) => <Search {...p} /> },
  { id: 'wordbook', label: '生词本', Icon: (p) => <BookOpen {...p} /> },
  { id: 'learn', label: '学习', Icon: (p) => <Brain {...p} /> },
  { id: 'review', label: '复习', Icon: (p) => <RotateCcw {...p} /> },
  { id: 'challenge', label: '挑战', Icon: (p) => <Zap {...p} /> },
];

export const TabBar: React.FC<TabBarProps> = ({ active, onChange }) => (
  <div className="tab-bar">
    {TABS.map(tab => (
      <button key={tab.id} className={`tab-btn ${active === tab.id ? 'active' : ''}`} onClick={() => onChange(tab.id)}>
        <span className="tab-icon"><tab.Icon size={17} /></span>
        {tab.label}
      </button>
    ))}
  </div>
);
