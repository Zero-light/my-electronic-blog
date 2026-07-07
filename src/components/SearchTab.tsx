import React, { useState, useEffect } from 'react';
import { Search, BookmarkPlus, BookOpen, ChevronRight } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

const sr: any[] = []; let srDone = false;
async function loadBank(): Promise<any[]> {
  if (srDone) return sr;
  const r = await fetch('/assets/words/wordbank.json');
  sr.push(...((await r.json()).words || []));
  srDone = true; return sr;
}

export const SearchTab: React.FC = () => {
  const { save, search, addWord } = useGameStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [bank, setBank] = useState<any[]>([]);
  const [added, setAdded] = useState<Set<string>>(new Set());

  useEffect(() => { loadBank().then(setBank); }, []);
  useEffect(() => { setAdded(new Set(save.wordbook.map(w => w.wordId))); }, [save.wordbook]);

  const handleSearch = (q: string) => {
    setQuery(q);
    if (q.length < 2) { setResults([]); return; }
    setResults(bank.length ? search(q, bank) : []);
  };

  return (
    <div className="flex flex-col w-full h-full pt-6 px-4">
      {/* Search box */}
      <div className="max-w-lg mx-auto w-full mb-6">
        <div className="glass-panel flex items-center gap-3 px-5 py-3">
          <Search size={18} className="text-white/40" />
          <input
            className="flex-1 bg-transparent outline-none text-white text-base placeholder-white/30"
            placeholder="搜索单词..."
            value={query}
            onChange={e => handleSearch(e.target.value)}
            autoFocus
          />
          {query && (
            <button className="text-white/30 hover:text-white/60 text-sm" onClick={() => handleSearch('')}>✕</button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto max-w-lg mx-auto w-full space-y-2">
        {results.map(w => {
          const inBook = added.has(w.id);
          return (
            <div key={w.id} className="glass-panel p-4 hover:bg-white/10 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-lg font-bold text-white">{w.word}</span>
                    <span className="text-xs text-white/40 font-mono">{w.phonetic}</span>
                  </div>
                  <p className="text-sm text-white/70">{w.meaning}</p>
                  {w.examples?.[0] && (
                    <p className="text-xs text-white/30 italic mt-1">"{w.examples[0]}"</p>
                  )}
                </div>
                <button
                  className={`p-2 rounded-full transition-all ${inBook ? 'text-green-300 bg-green-400/15' : 'text-white/40 hover:text-white hover:bg-white/10'}`}
                  onClick={() => !inBook && addWord(w.id)}
                  title={inBook ? '已在生词本' : '加入生词本'}
                >
                  {inBook ? <BookOpen size={18} /> : <BookmarkPlus size={18} />}
                </button>
              </div>
            </div>
          );
        })}
        {query.length >= 2 && results.length === 0 && (
          <p className="text-white/30 text-center py-8">未找到 "{query}"</p>
        )}
        {query.length < 2 && (
          <div className="text-center py-12">
            <Search size={40} className="mx-auto mb-3 text-white/15" />
            <p className="text-white/25 text-sm">输入单词搜索，加入生词本</p>
          </div>
        )}
      </div>
    </div>
  );
};
