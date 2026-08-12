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
        /* ═══ BRAND ═══ */
        brand: {
          DEFAULT: '#a78bfa',    // violet-400 — primary brand
          light: '#c4b5fd',      // violet-300 — light variant
          dark: '#7c3aed',       // violet-600 — dark variant
        },
        accent: {
          DEFAULT: '#ec4899',    // pink-500 — CTA, actions
          light: '#f9a8d4',      // pink-300 — light variant
          dark: '#db2777',       // pink-600 — dark variant
        },
        highlight: {
          DEFAULT: '#06b6d4',    // cyan-500 — tech, links
          light: '#67e8f9',      // cyan-300 — light variant
          dark: '#0891b2',       // cyan-600 — dark variant
        },
        success: '#10b981',      // emerald-500 — status, online
        warning: '#f59e0b',      // amber-500 — caution
        danger: '#ef4444',       // red-500 — errors, logout

        /* ═══ SURFACES ═══ */
        surface: {
          DEFAULT: 'rgba(255,255,255,0.03)',
          hover: 'rgba(255,255,255,0.06)',
          active: 'rgba(255,255,255,0.08)',
        },

        /* ═══ TEXT ═══ */
        heading: '#f1f5f9',      // slate-100 — 15.4:1 contrast on #08081a
        body: '#cbd5e1',         // slate-300 — 10.5:1 contrast
        muted: '#94a3b8',        // slate-400 — 7.1:1 contrast (AA)
        dim: '#64748b',          // slate-500 — 4.6:1 contrast (AA minimum)

        /* ═══ BACKGROUND ═══ */
        background: '#08081a',   // deep space — primary bg
        'bg-elevated': '#0f1724', // slate-900 — elevated surfaces
        'bg-card': '#111827',     // gray-900 — card backgrounds

        /* ═══ BORDERS ═══ */
        'border-subtle': 'rgba(255,255,255,0.06)',
        'border-default': 'rgba(255,255,255,0.10)',
        'border-strong': 'rgba(255,255,255,0.15)',
        'border-brand': 'rgba(167,139,250,0.30)',
        'border-accent': 'rgba(236,72,153,0.30)',
        'border-highlight': 'rgba(6,182,212,0.30)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
