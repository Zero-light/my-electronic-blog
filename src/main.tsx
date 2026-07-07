import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Debug: open browser console → type __wp.rich() → refresh
import('./store/gameStore').then(({ useGameStore }) => {
  (window as any).__wp = {
    rich() {
      import('./data/saveManager').then(({ saveWrite }) => {
        const s = useGameStore.getState().save;
        s.foodCount = 999;
        s.gold = 999;
        s.diamonds = 999;
        s.pet.hunger = 100;
        s.pet.happiness = 100;
        s.pet.xp = 5000;
        s.totalWordsLearned = 900;
        s.totalWordsReviewed = 900;
        s.pet.level = 'perfect';
        saveWrite(s);
        useGameStore.setState({ save: { ...s } });
        console.log('✅ 💰999 🍎999 💎999 | 刷新页面生效');
      });
    },
  };
});
