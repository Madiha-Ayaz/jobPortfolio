import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /* ═══ BRAND — refined indigo ═══ */
        brand: {
          DEFAULT: '#818cf8',    // indigo-400
          light: '#a5b4fc',      // indigo-300
          dark: '#4f46e5',       // indigo-600
        },
        accent: {
          DEFAULT: '#38bdf8',    // sky-400
          light: '#7dd3fc',      // sky-300
          dark: '#0284c7',       // sky-600
        },
        highlight: {
          DEFAULT: '#22d3ee',    // cyan-400
          light: '#67e8f9',
          dark: '#0e7490',
        },
        success: '#34d399',
        warning: '#fbbf24',
        danger: '#f87171',

        /* ═══ SURFACES ═══ */
        surface: {
          DEFAULT: 'rgba(255,255,255,0.03)',
          hover: 'rgba(255,255,255,0.06)',
          active: 'rgba(255,255,255,0.08)',
        },

        /* ═══ TEXT ═══ */
        heading: '#f8fafc',      // slate-50
        body: '#cbd5e1',         // slate-300
        muted: '#94a3b8',        // slate-400
        dim: '#64748b',          // slate-500

        /* ═══ BACKGROUND — deep navy ═══ */
        background: '#070b14',
        'bg-elevated': '#0b1120',
        'bg-card': '#0f172a',

        /* ═══ BORDERS ═══ */
        'border-subtle': 'rgba(255,255,255,0.06)',
        'border-default': 'rgba(255,255,255,0.10)',
        'border-strong': 'rgba(255,255,255,0.16)',
        'border-brand': 'rgba(129,140,248,0.30)',
        'border-accent': 'rgba(56,189,248,0.30)',
      },
      fontFamily: {
        sans: ['Inter', 'var(--font-geist-sans)', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'float-slow': 'floatSlow 8s ease-in-out infinite',
        'spin-slow': 'spin 16s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-18px)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
