/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
      },
    },
    extend: {
      colors: {
        primary: {
          50: '#FFF1F5',
          100: '#FFE4EC',
          200: '#FFC9DA',
          300: '#FFAEC8',
          400: '#FF8EB1',
          500: '#FF6B9D',
          600: '#E85C8C',
          700: '#D14D7B',
          800: '#B43F69',
          900: '#8B2635',
        },
        secondary: {
          50: '#FFFAF5',
          100: '#FFF5EB',
          200: '#FFE8D4',
          300: '#FFDBBD',
          400: '#F4C89D',
          500: '#E8C4A0',
          600: '#D4A87A',
          700: '#B88C5E',
          800: '#96714A',
          900: '#7A5A3C',
        },
        background: '#FFF8F0',
        surface: '#FFFFFF',
        card: '#FFFFFF',
        foreground: '#1F2937',
        muted: '#6B7280',
        border: '#F3E8E8',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Noto Sans SC"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.1)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.1)' },
          '70%': { transform: 'scale(1)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(255, 107, 157, 0.15)',
        'glow': '0 0 30px rgba(255, 107, 157, 0.3)',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
