/**
 * StudyModal — 4-Choice Quiz with Glass Morphism
 */
import React, { useCallback } from 'react';
import { ArrowLeft, SkipForward, Sparkles } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { shuffle } from '../utils/helpers';

export const StudyModal: React.FC = () => {
  const {
    studyWords, studyIndex, studyCorrect, studyWrong, studyStreak,
    answerQuestion, closeStudy,
  } = useGameStore();

  const word = studyWords[studyIndex];
  if (!word) return null;

  // Generate 4 choices: 1 correct + 3 distractors
  const distractors = studyWords
    .filter(w => w.id !== word.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map(w => w.meaning);

  const choices = shuffle([word.meaning, ...distractors]);
  const progress = studyIndex / studyWords.length;
  const labels = ['A', 'B', 'C', 'D'];

  const handleChoice = (choice: string) => {
    answerQuestion(choice === word.meaning);
  };

  return (
    <div className="modal-backdrop z-[200]">
      <div className="glass-panel w-[560px] max-w-[92vw] p-8 animate-slideUp z-[201]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            className="glass-btn-back glass-btn px-3 py-2 text-sm"
            onClick={closeStudy}
          >
            <ArrowLeft size={14} /> 返回
          </button>
          <span className="text-white/60 text-sm">{studyIndex + 1} / {studyWords.length}</span>
          <span className="glass-chip text-sm">
            🔥 {studyStreak}
          </span>
        </div>

        {/* Progress bar */}
        <div className="glass-progress mb-6">
          <div
            className="glass-progress-fill"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        {/* Word display */}
        <div className="text-center mb-2">
          <h2 className="text-5xl font-extrabold text-white tracking-tight mb-2">
            {word.word}
          </h2>
          <p className="text-white/50 text-base font-mono">{word.phonetic}</p>
        </div>

        <p className="text-center text-white/35 text-xs mb-6">
          选择正确的中文释义
        </p>

        {/* 4 choices */}
        <div className="grid grid-cols-1 gap-3">
          {choices.map((choice, i) => {
            const isCorrect = choice === word.meaning;
            return (
              <button
                key={i}
                onClick={() => handleChoice(choice)}
                className="glass-panel px-5 py-4 text-left text-base font-medium text-white/90
                  hover:bg-white/20 transition-all duration-150 cursor-pointer"
              >
                <span className="text-white/40 mr-3">{labels[i]}.</span>
                {choice}
              </button>
            );
          })}
        </div>

        {/* Streak reward hint */}
        {studyStreak >= 3 && (
          <div className="mt-4 text-center">
            <span className="glass-chip text-yellow-300">
              <Sparkles size={12} /> 连击 {studyStreak} — 额外奖励!
            </span>
          </div>
        )}

        {/* Skip */}
        <button
          className="glass-btn glass-btn-back mt-4 w-full text-sm py-2"
          onClick={() => answerQuestion(false)}
        >
          <SkipForward size={14} /> 跳过
        </button>
      </div>
    </div>
  );
};
