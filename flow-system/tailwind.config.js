/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        flow: {
          bg: '#f8f6f1',      // 米白背景
          primary: '#1e3a5f', // 深蓝主色
          secondary: '#4a90e2', // 亮蓝
          accent: '#6ba3d8',  // 淡蓝
          text: '#2c3e50',    // 深灰文字
        }
      },
      animation: {
        'flow': 'flow 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        flow: {
          '0%, 100%': { opacity: 0.5 },
          '50%': { opacity: 1 },
        }
      }
    },
  },
  plugins: [],
}
