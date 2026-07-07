/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ice:    { 100: '#D6EAFA', 200: '#B5D8F0', 300: '#8BB8D0', 400: '#6B9CB5' },
        peach:  { 100: '#FFF0EB', 200: '#FFE0D5', 300: '#FFD4C4' },
        warm:   { 400: '#FF8C69', 500: '#E87855' },
        mauve:  { 100: '#F5ECFE', 200: '#E8D5F5' },
      },
      fontFamily: {
        sans: ['Inter', '"PingFang SC"', '"Microsoft YaHei"', '-apple-system', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'breathe': 'breathe 2s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s ease-in-out infinite',
        'drift': 'drift 12s ease-in-out infinite',
        'drift2': 'drift2 15s ease-in-out infinite',
        'fadeIn': 'fadeIn 0.4s ease-out',
        'slideUp': 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'slideRight': 'slideRight 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'jellyBounce': 'jellyBounce 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        breathe: {
          '0%, 100%': { opacity: '0.7' },
          '50%':      { opacity: '1' },
        },
        shimmer: {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(400%)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%':      { transform: 'translate(30px, -20px) scale(1.05)' },
          '66%':      { transform: 'translate(-20px, 15px) scale(0.97)' },
        },
        drift2: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%':      { transform: 'translate(-25px, 15px) scale(0.95)' },
          '66%':      { transform: 'translate(20px, -18px) scale(1.04)' },
        },
        fadeIn: {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideRight: {
          '0%':   { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        jellyBounce: {
          '0%':   { transform: 'scale(0.94)' },
          '40%':  { transform: 'scale(1.05)' },
          '70%':  { transform: 'scale(0.98)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
