import React, { useState, useEffect } from 'react';
import { Search, BookmarkPlus, BookOpen, Brain, RotateCcw, Clock, X } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { WordDetail } from './WordDetail';

const sr: any[] = []; let srDone = false;
async function loadBank(): Promise<any[]> {
  if (srDone) return sr;
  const r = await fetch('/assets/words/wordbank.json');
  sr.push(...((await r.json()).words || []));
  srDone = true; return sr;
}

const HIST_KEY = 'wordpal_search_history';
function loadHistory(): string[] { try { return JSON.parse(localStorage.getItem(HIST_KEY)||'[]'); } catch { return []; } }
function saveHistory(h: string[]) { localStorage.setItem(HIST_KEY, JSON.stringify(h.slice(0,6))); }

export const SearchTab: React.FC<{ onNavigate?: (tab: string) => void }> = ({ onNavigate }) => {
  const { save, search, addWord } = useGameStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [bank, setBank] = useState<any[]>([]);
  const [added, setAdded] = useState<Set<string>>(new Set());
  const [detailWord, setDetailWord] = useState<any>(null);
  const [history, setHistory] = useState<string[]>(loadHistory);

  useEffect(() => { loadBank().then(setBank); }, []);
  useEffect(() => { setAdded(new Set(save.wordbook.map(w => w.wordId))); }, [save.wordbook]);

  const doSearch = (q: string) => {
    setQuery(q);
    if (q.length < 2) { setResults([]); return; }
    setResults(bank.length ? search(q, bank) : []);
    // Save to history
    if (q.length >= 2) {
      const h = loadHistory().filter(w => w !== q);
      h.unshift(q);
      const updated = h.slice(0, 6);
      saveHistory(updated);
      setHistory(updated);
    }
  };

  return (
    <div className="flex flex-col w-full h-full pt-4 px-4">
      {/* Install button — always visible */}
      <InstallBanner />
      {/* Search box */}
      <div className="max-w-lg mx-auto w-full mb-6">
        <div className="glass-panel flex items-center gap-3 px-5 py-3">
          <Search size={18} className="text-white/40" />
          <input
            className="flex-1 bg-transparent outline-none text-white text-base placeholder-white/30"
            placeholder="搜索单词..."
            value={query}
            onChange={e => doSearch(e.target.value)}
            autoFocus
          />
          {query && (
            <button className="text-white/30 hover:text-white/60 text-sm" onClick={() => doSearch('')}>✕</button>
          )}
        </div>
      </div>

      {/* History chips */}
      {query.length < 2 && history.length > 0 && (
        <div className="max-w-lg mx-auto w-full mb-4 flex items-center gap-2 flex-wrap">
          <Clock size={14} className="text-white/20" />
          {history.map((h, i) => (
            <button key={i} className="glass-chip text-xs hover:bg-white/20 transition-colors"
              onClick={() => doSearch(h)}>
              {h}
            </button>
          ))}
          <button className="text-white/20 hover:text-white/40 text-xs ml-auto"
            onClick={() => { saveHistory([]); setHistory([]); }}>
            <X size={12} /> 清除
          </button>
        </div>
      )}

      {/* Results */}
      <div className="flex-1 overflow-y-auto max-w-lg mx-auto w-full space-y-2">
        {results.map(w => {
          const inBook = added.has(w.id);
          return (
            <div key={w.id} className="glass-panel p-4 hover:bg-white/10 transition-all cursor-pointer"
              onClick={() => setDetailWord(w)}>
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

      {/* Quick actions — Learn & Review with counts */}
      <div className="flex gap-3 justify-center pb-4 pt-2">
        <button className="glass-btn px-6 py-2.5" onClick={() => onNavigate?.('learn')}>
          <Brain size={16} /> 开始学习 ({save.wordbook.filter(w=>w.status==='new').length}词)
        </button>
        <button className="glass-btn px-6 py-2.5" onClick={() => onNavigate?.('review')}>
          <RotateCcw size={16} /> 开始复习 ({
            save.wordbook.filter(w=>{
              if(!w.lastReview)return true;
              const n=new Date(w.lastReview);n.setDate(n.getDate()+w.intervalDays);
              return n<=new Date();
            }).length
          }词)
        </button>
      </div>
      {detailWord && <WordDetail word={detailWord} onClose={() => setDetailWord(null)} />}
    </div>
  );
};

const InstallBanner: React.FC = () => {
  const [show, setShow] = useState(true);
  const [installed, setInstalled] = useState(false);
  const [prompt, setPrompt] = useState<any>(null);
  useEffect(() => {
    const h = (e: Event) => { e.preventDefault(); setPrompt(e); };
    window.addEventListener('beforeinstallprompt', h);
    if (window.matchMedia('(display-mode: standalone)').matches) setInstalled(true);
    return () => window.removeEventListener('beforeinstallprompt', h);
  }, []);
  const install = async () => {
    if (prompt) { prompt.prompt(); const r = await prompt.userChoice; if (r.outcome === 'accepted') setInstalled(true); setPrompt(null); }
    else { alert('请使用浏览器菜单中的"添加到桌面"功能\n\nEdge: 地址栏 ⊕ 图标\n小米浏览器: 菜单 → 添加到桌面'); }
  };
  if (installed) return null;
  if (!show) return null;
  return (
    <div className="max-w-lg mx-auto w-full mb-4 glass-panel px-4 py-3 flex items-center gap-3" style={{background:'rgba(72,209,204,0.15)',border:'1px solid rgba(72,209,204,0.3)'}}>
      <span className="text-lg">📱</span>
      <div className="flex-1">
        <p className="text-white/90 text-sm font-semibold">安装到手机桌面</p>
        <p className="text-white/40 text-xs">像 App 一样使用，离线也能学</p>
      </div>
      <button className="glass-btn px-4 py-1.5 text-sm font-bold" style={{background:'rgba(72,209,204,0.4)'}} onClick={install}>安装</button>
      <button className="text-white/20 hover:text-white/50" onClick={() => setShow(false)}><X size={14} /></button>
    </div>
  );
};
