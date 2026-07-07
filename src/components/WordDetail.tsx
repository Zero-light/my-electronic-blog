import React from 'react';
import { X, Volume2, BookOpen, Link2, GitBranch } from 'lucide-react';

interface WordDetailProps {
  word: {
    word: string; phonetic: string; meaning: string;
    examples: string[]; collocations: string[]; derivatives: string[];
  } | null;
  onClose: () => void;
}

export const WordDetail: React.FC<WordDetailProps> = ({ word, onClose }) => {
  if (!word) return null;

  return (
    <div className="modal-backdrop z-[300]" onClick={onClose}>
      <div className="glass-panel w-[520px] max-w-[94vw] max-h-[85vh] overflow-y-auto p-6 animate-slideUp z-[301]"
        onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white mb-1">{word.word}</h1>
            {word.phonetic && (
              <p className="text-white/50 text-sm font-mono">{word.phonetic}</p>
            )}
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white p-1">
            <X size={20} />
          </button>
        </div>

        {/* Meaning */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2 text-white/40 text-xs">
            <BookOpen size={13} /> 释义
          </div>
          <p className="text-white/85 text-base leading-relaxed">{word.meaning}</p>
        </div>

        {/* Examples */}
        {word.examples?.length > 0 && (
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2 text-white/40 text-xs">
              <Volume2 size={13} /> 例句
            </div>
            <div className="space-y-2">
              {word.examples.map((ex: string, i: number) => (
                <p key={i} className="text-white/55 text-sm italic pl-3 border-l-2 border-white/10">
                  "{ex}"
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Collocations */}
        {word.collocations?.length > 0 && (
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2 text-white/40 text-xs">
              <Link2 size={13} /> 常用搭配
            </div>
            <div className="flex flex-wrap gap-2">
              {word.collocations.map((c: string, i: number) => (
                <span key={i} className="glass-chip text-xs">{c}</span>
              ))}
            </div>
          </div>
        )}

        {/* Derivatives */}
        {word.derivatives?.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2 text-white/40 text-xs">
              <GitBranch size={13} /> 派生词
            </div>
            <div className="flex flex-wrap gap-2">
              {word.derivatives.map((d: string, i: number) => (
                <span key={i} className="text-xs text-white/60">{d}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
