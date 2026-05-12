import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['var(--font-nunito)', 'sans-serif'],
      },
      colors: {
        // Primary - Duolingo inspired but with tech accent
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e', // Main brand color
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#145231',
        },
        // Secondary - Accent color (blue for tech feel)
        accent: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Neutral - Refined grays
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#eeeeee',
          300: '#e0e0e0',
          400: '#bdbdbd',
          500: '#9e9e9e',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
        },
        // Status colors
        success: '#22c55e',
        warning: '#eab308',
        error: '#ef4444',
        info: '#0ea5e9',
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        // Refined shadows for depth
        'sm-soft': '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'soft': '0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'md-soft': '0 4px 8px 0 rgba(0, 0, 0, 0.08)',
        'lg-soft': '0 8px 16px 0 rgba(0, 0, 0, 0.1)',
        'xl-soft': '0 16px 32px 0 rgba(0, 0, 0, 0.12)',
        // Colored shadows
        'green': '0 10px 25px -5px rgba(34, 197, 94, 0.15)',
        'blue': '0 10px 25px -5px rgba(14, 165, 233, 0.15)',
        'purple': '0 10px 25px -5px rgba(168, 85, 247, 0.15)',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-in',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(34, 197, 94, 0.5), inset 0 0 5px rgba(34, 197, 94, 0.1)' },
          '50%': { boxShadow: '0 0 20px rgba(34, 197, 94, 0.8), inset 0 0 10px rgba(34, 197, 94, 0.2)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
    },
  },
  plugins: [
    // Custom utilities plugin
    function ({ addComponents, addUtilities, theme }: any) {
      addComponents({
        // Glass morphism effect
        '.glass': {
          '@apply bg-white/30 backdrop-blur-md border border-white/20': {},
        },
        '.glass-dark': {
          '@apply bg-gray-900/30 backdrop-blur-md border border-white/10': {},
        },
        // Card with consistent styling
        '.card': {
          '@apply bg-white rounded-3xl border border-gray-100 shadow-md-soft hover:shadow-lg-soft transition-all': {},
        },
        '.card-dark': {
          '@apply bg-gray-900 rounded-3xl border border-gray-800 shadow-md-soft': {},
        },
        // Badge styles
        '.badge': {
          '@apply inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold': {},
        },
        '.badge-green': {
          '@apply badge bg-green-100 text-green-700': {},
        },
        '.badge-blue': {
          '@apply badge bg-blue-100 text-blue-700': {},
        },
        '.badge-purple': {
          '@apply badge bg-purple-100 text-purple-700': {},
        },
        '.badge-yellow': {
          '@apply badge bg-yellow-100 text-yellow-700': {},
        },
        '.badge-red': {
          '@apply badge bg-red-100 text-red-700': {},
        },
        // Button styles
        '.btn': {
          '@apply inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm transition-all duration-200': {},
        },
        '.btn-primary': {
          '@apply btn bg-primary-500 text-white hover:bg-primary-600 active:scale-95 shadow-green': {},
        },
        '.btn-primary-outline': {
          '@apply btn border-2 border-primary-500 text-primary-500 hover:bg-primary-50 active:scale-95': {},
        },
        '.btn-accent': {
          '@apply btn bg-accent-500 text-white hover:bg-accent-600 active:scale-95 shadow-blue': {},
        },
        '.btn-ghost': {
          '@apply btn text-gray-600 hover:bg-gray-100 active:scale-95': {},
        },
        // Input styles
        '.input': {
          '@apply w-full px-4 py-3 rounded-2xl border-2 border-gray-100 bg-gray-50 text-sm font-semibold focus:outline-none focus:border-primary-400 focus:bg-white transition-all': {},
        },
        // Gradient text
        '.gradient-text': {
          '@apply bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent': {},
        },
      })

      addUtilities({
        '.truncate-3': {
          display: '-webkit-box',
          WebkitLineClamp: '3',
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        },
        '.text-balance': {
          textWrap: 'balance',
        },
      })
    },
  ],
}

export default config
