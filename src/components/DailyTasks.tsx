import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

export const DailyTasks: React.FC = () => {
  const tasks = useGameStore(s => s.getDailyTasks());
  const allDone = tasks.every(t => t.done);

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50">
      <div className="glass-panel px-5 py-3 flex items-center gap-5">
        {tasks.map(t => (
          <div key={t.id} className="flex items-center gap-1.5">
            {t.done ? (
              <CheckCircle2 size={16} className="text-green-400" />
            ) : (
              <div className="w-4 h-4 rounded-full border border-white/30" />
            )}
            <span className={`text-xs font-medium ${t.done ? 'text-green-300' : 'text-white/70'}`}>
              {t.done ? '✓' : `${t.current}/${t.target}`}
            </span>
          </div>
        ))}
        {allDone && (
          <span className="text-xs font-bold text-green-300 animate-breathe">
            🎉 全部完成 +8 🍎
          </span>
        )}
      </div>
    </div>
  );
};
