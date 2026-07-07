import React from 'react';
import { BookOpen, GraduationCap, Brain } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

export const WordbookTab: React.FC = () => {
  const { save, getStats } = useGameStore();
  const stats = getStats();

  if (!save.wordbook.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-white/30">
        <BookOpen size={48} />
        <p className="text-sm">生词本为空</p>
        <p className="text-xs">去搜索页面添加单词 📖</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full pt-4 px-4 overflow-y-auto">
      <div className="flex justify-center gap-3 mb-4">
        <div className="glass-chip"><BookOpen size={12} /> {stats.total}词</div>
        <div className="glass-chip text-green-300"><GraduationCap size={12} /> {stats.mastered || 0}掌握</div>
        <div className="glass-chip text-yellow-300"><Brain size={12} /> {stats.due || 0}待复习</div>
      </div>
      <div className="space-y-1.5 max-w-lg mx-auto w-full">
        {save.wordbook.map((entry, i) => {
          const sc: Record<string, string> = { new: 'text-blue-300/60', learning: 'text-yellow-300/60', mastered: 'text-green-300/60' };
          const sl: Record<string, string> = { new: '新', learning: '学', mastered: '✓' };
          return (
            <div key={entry.wordId} className="flex items-center gap-3 px-4 py-2.5 glass-panel text-sm">
              <span className="text-white/25 text-xs w-5">{i + 1}</span>
              <span className="flex-1 text-white/80 font-medium">{entry.wordId}</span>
              <span className="text-xs text-white/20">×{entry.reviewCount}</span>
              <span className={`text-[11px] ${sc[entry.status]}`}>{sl[entry.status]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
