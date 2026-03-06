import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/ui/**/*.{ts,tsx}',
  ],
  safelist: [
    'text-text-light-body',
    'text-text-helper',
    'text-text-primary',
    'hover:text-text-primary',
    'bg-primary/10',
    'bg-success-default',
    'hover:bg-success-hover',
    'active:bg-success-pressed',
    'navigation-menu',
    'text-grey',
  ],
  theme: {
    extend: {
      keyframes: {
        'border-spin': {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '66.66%': {
            transform: 'rotate(-360deg)',
          },
          '100%': {
            transform: 'rotate(-360deg)', // Hold position
          },
        },
        'slide-in': {
          '0%': { opacity: '0%', transform: 'translateY(-8px)' },
          '100%': { opacity: '100%', transform: 'translateY(0)' },
        },
        'slide-horizontal': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-bottom': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        show: {
          '0%': { opacity: '0%' },
          '100%': { opacity: '100%' },
        },
      },
      animation: {
        'border-spin': 'border-spin 3s linear infinite',
        'slide-in': 'slide-in 200ms',
        'slide-out': 'slide-in 200ms reverse ease-in',
        show: 'show 150ms ease-in forwards',
        hide: 'show 150ms reverse ease-out forwards',
        'slide-in-horizontal': 'slide-horizontal 200ms ease-in forwards',
        'slide-out-horizontal': 'slide-horizontal reverse 200ms ease-out forwards',
        'slide-in-bottom': 'slide-bottom 200ms ease-in forwards',
        'slide-out-bottom': 'slide-bottom reverse 200ms ease-out forwards',
      },
      colors: {
        'modal-overlay': 'var(--color-modal-overlay)',
        green: {
          default: 'var(--color-green)',
          50: 'var(--color-green-50)',
          100: 'var(--color-green-100)',
          300: 'var(--color-green-300)',
          500: 'var(--color-green-500)',
          700: 'var(--color-green-700)',
          800: 'var(--color-green-800)',
        },
        blue: {
          100: 'var(--color-blue-100)',
          800: 'var(--color-blue-800)',
        },
        orange: {
          100: 'var(--color-orange-100)',
          400: 'var(--color-orange-400)',
          800: 'var(--color-orange-800)',
          900: 'var(--color-orange-900)',
        },
        red: {
          100: 'var(--color-red-100)',
          400: 'var(--color-red-400)',
          900: 'var(--color-red-900)',
        },
        grey: 'var(--color-grey)',
        gray: {
          100: 'var(--color-gray-100)',
          200: 'var(--color-gray-200)',
          300: 'var(--color-gray-300)',
          600: 'var(--color-gray-600)',
        },
        yellow: 'var(--color-yellow)',
        black: 'var(--color-black)',
        accent: 'var(--accent)',
        'medium-accent': 'var(--color-medium-accent)',
        'dark-accent': 'var(--color-dark-accent)',
        background: 'var(--background)',
        'disabled-light-grey': 'var(--color-disabled-light-grey)',
        'super-light-grey': 'var(--color-super-light-grey)',
        'light-grey': 'var(--color-light-grey)',
        'medium-grey': 'var(--color-medium-grey)',
        'dark-grey': 'var(--color-dark-grey)',
        'light-violet': 'var(--color-light-violet)',
        'medium-violet': 'var(--color-medium-violet)',
        'dark-violet': 'var(--color-dark-violet)',
        'disable-text': 'var(--color-disable-text)',
        hover: 'var(--color-hover)',
        pressed: 'var(--color-pressed)',
        'super-light-blue': 'var(--color-super-light-blue)',
        'light-ice-blue': 'var(--color-light-ice-blue)',
        'medium-ice-blue': 'var(--color-medium-ice-blue)',
        'ice-blue': 'var(--color-ice-blue)',
        warning: 'var(--warning)',
        'warning-light': 'var(--color-warning-light)',
        'warning-medium': 'var(--color-warning-medium)',
        'light-red': 'var(--color-light-red)',
        'medium-red': 'var(--color-medium-red)',
        'dark-red': 'var(--color-dark-red)',
        success: 'var(--success)',
        secondary: {
          default: 'var(--color-secondary-default)',
          hover: 'var(--color-secondary-hover)',
          pressed: 'var(--color-secondary-pressed)',
        },
        text: 'var(--text)',
        divider: 'var(--color-divider)',
      },
      boxShadow: {
        modal: 'var(--shadow-modal)',
        menu: 'var(--shadow-menu)',
      },
      minWidth: {
        modal: '37.5rem', // 600px
      },
      maxHeight: {
        map: '62.5rem', // 1000px
      },
      fontSize: {
        xxs: '0.625rem', // 10px
        xxl: '1.5rem', // 24px
      },
      height: {
        map: '21.875rem', // 350px
      },
    },
  },
  plugins: [],
};
export default config;
