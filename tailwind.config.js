/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['Nunito', 'Inter', 'sans-serif'],
        mono:    ['Inter', 'sans-serif'],
        display: ['DM Serif Display', 'serif'],
      },
      colors: {
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        teal: {
          50:  '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
      },
      transitionDuration: {
        '400': '400ms',
      },
      animation: {
        'fade-in':    'fadeIn 0.7s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-up':   'slideUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        'pulse-soft': 'pulseSoft 2.5s ease-in-out infinite',
        'bounce-soft':'bounceSoft 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        'pop':        'pop 0.25s cubic-bezier(0.34,1.56,0.64,1)',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.65' },
        },
        bounceSoft: {
          '0%':   { transform: 'scale(1)' },
          '50%':  { transform: 'scale(1.08)' },
          '100%': { transform: 'scale(1)' },
        },
        pop: {
          '0%':   { transform: 'scale(0.92)', opacity: '0' },
          '100%': { transform: 'scale(1)',    opacity: '1' },
        },
        shrink: {
          '0%':   { width: '100%' },
          '100%': { width: '0%' },
        },
      },
    },
  },
  plugins: [],
}
