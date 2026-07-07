import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Debug: console → __wp.rich() → 💎999, then refresh
setTimeout(() => {
  (window as any).__wp = {
    rich() {
      const s = JSON.parse(localStorage.getItem('wordpal.v4') || '{}');
      s.diamonds = 999;
      localStorage.setItem('wordpal.v4', JSON.stringify(s));
      console.log('✅ 💎999 | 刷新页面生效');
    },
  };
}, 1000);
