import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Debug: console → __wp.rich() → 💎999
setTimeout(() => {
  (window as any).__wp = {
    rich() {
      import('./data/saveManager').then(({ load, saveData }) => {
        const s = load();
        s.diamonds = 999;
        saveData(s);
        console.log('✅ 💎999 | 刷新页面生效');
      });
    },
  };
}, 1000);
