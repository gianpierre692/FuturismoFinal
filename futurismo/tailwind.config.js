/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E40AF',
          50: '#E7EDFC',
          100: '#BFCEF7',
          200: '#97AFF2',
          300: '#6F91ED',
          400: '#4772E8',
          500: '#1E40AF',
          600: '#1A389C',
          700: '#15308A',
          800: '#112877',
          900: '#0C2065'
        },
        secondary: {
          DEFAULT: '#F59E0B',
          50: '#FEF3E2',
          100: '#FDE0B4',
          200: '#FCCE86',
          300: '#FBBB58',
          400: '#FAA92A',
          500: '#F59E0B',
          600: '#DC8E0A',
          700: '#C47E09',
          800: '#AB6E08',
          900: '#925E07'
        },
        success: {
          DEFAULT: '#10B981',
          50: '#E6F7F1',
          100: '#BFEBD9',
          200: '#99DFC1',
          300: '#72D3A9',
          400: '#4CC791',
          500: '#10B981',
          600: '#0EA674',
          700: '#0C9366',
          800: '#0A8059',
          900: '#086D4C'
        }
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      }
    },
  },
  plugins: [],
}