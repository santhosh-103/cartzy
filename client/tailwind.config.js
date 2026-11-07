/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cartzy Brand Palette (backward-compat with amazon- class names in JSX)
        amazon: {
          dark: '#0f1c3a',
          light: '#162040',
          subnav: '#1a2a52',
          yellow: '#fbbf24',
          orange: '#f97316',
          gold: '#c2410c',
          btn: '#fbbf24',
          btnHover: '#f59e0b',
          btnOrange: '#f97316',
          btnOrangeHover: '#ea580c',
          link: '#38bdf8',
          price: '#dc2626',
          gray: '#f1f5f9',
          darkGray: '#64748b',
        },
        cartzy: {
          dark: '#0f1c3a',
          nav: '#162040',
          subnav: '#1a2a52',
          orange: '#f97316',
          amber: '#fbbf24',
          link: '#38bdf8',
          price: '#dc2626',
          light: '#f1f5f9',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 4px 0 rgba(15,28,58,0.08), 0 2px 12px 0 rgba(15,28,58,0.06)',
        'card-hover': '0 4px 24px 0 rgba(15,28,58,0.14)',
        'nav': '0 2px 12px 0 rgba(0,0,0,0.3)',
      },
      animation: {
        'slide-in-top': 'slideInTop 0.18s ease-out',
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        slideInTop: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        }
      },
    },
  },
  plugins: [],
};
