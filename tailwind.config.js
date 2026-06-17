/** @type {import('tailwindcss').Config} */
module.exports = {
  // 暗色模式通过 HTML class="dark" 切换，与 next-themes 配合
  darkMode: 'class',

  // 扫描这些文件中的 Tailwind 类名
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.mdx',
  ],

  theme: {
    extend: {
      // 自定义主题色（工程师简约风：浅蓝/深灰）
      // 修改这里即可全局换色
      colors: {
        primary: {
          DEFAULT: '#0ea5e9',   // Light 模式主色：sky-500
          dark: '#0284c7',      // Light 模式深色：sky-600
          light: '#38bdf8',     // Dark 模式主色：sky-400
        },
        accent: {
          DEFAULT: '#06b6d4',   // Light 模式强调：cyan-500
          dark: '#22d3ee',      // Dark 模式强调：cyan-400
        },
      },

      // 字体配置（优先使用系统字体栈，减少加载）
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        mono: [
          '"Fira Code"',
          '"SF Mono"',
          'Menlo',
          'Monaco',
          'Consolas',
          '"Liberation Mono"',
          '"Courier New"',
          'monospace',
        ],
      },

      // 自定义动画（页面入场、卡片悬浮等）
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },

  // 暂不额外安装插件，保持轻量
  plugins: [],
};
