/**
 * tailwind.config.ts — CONVICTION ENGINE v19.0
 * ─────────────────────────────────────────────────────────────────────────────
 * SINGLE SOURCE OF TRUTH. Delete tailwind.config.js — this file takes
 * Next.js resolution precedence and was previously missing the full config,
 * silently dropping all color / font / animation design tokens.
 *
 * Rule: All colour values reference var(--token-name) from globals.css.
 * Never hardcode hex values here or in component files.
 */

import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './content/**/*.{md,mdx}',
  ],

  theme: {
    extend: {

      // ── Colours (all reference CSS custom properties) ─────────────────
      colors: {
        bg: {
          base:     'var(--bg-base)',
          surface:  'var(--bg-surface)',
          elevated: 'var(--bg-elevated)',
        },
        border: {
          subtle:  'var(--border-subtle)',
          default: 'var(--border-default)',
          strong:  'var(--border-strong)',
        },
        accent: {
          primary:   'var(--accent-primary)',
          secondary: 'var(--accent-secondary)',
          fintech:   'var(--accent-fintech)',
          warn:      'var(--accent-warn)',
          danger:    'var(--accent-danger)',
        },
        metric: {
          live:       'var(--metric-live)',
          documented: 'var(--metric-documented)',
          backtested: 'var(--metric-backtested)',
          snapshot:   'var(--metric-snapshot)',
        },
        text: {
          primary:   'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted:     'var(--text-muted)',
          code:      'var(--text-code)',
        },
      },

      // ── Typography ────────────────────────────────────────────────────
      fontFamily: {
        mono: [
          'JetBrains Mono',
          'Fira Code',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'monospace',
        ],
        sans: [
          'DM Sans',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif',
        ],
      },

      fontSize: {
        metric:  ['clamp(1.75rem,4vw,2.5rem)',  { lineHeight: '1',    letterSpacing: '-0.03em' }],
        display: ['clamp(2.5rem,6vw,5rem)',      { lineHeight: '1.05', letterSpacing: '-0.03em' }],
      },

      // ── Spacing ───────────────────────────────────────────────────────
      spacing: {
        '18':        '4.5rem',
        '22':        '5.5rem',
        '30':        '7.5rem',
        section:     '6rem',
        container:   '2rem',
      },

      // ── Max widths ────────────────────────────────────────────────────
      maxWidth: {
        'hero':         '20ch',
        'heading':      '28ch',
        'prose':        '72ch',
        'prose-narrow': '60ch',
        'prose-wide':   '80ch',
        'layout':       '1200px',
        'layout-wide':  '1400px',
      },

      // ── Border radius ─────────────────────────────────────────────────
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },

      // ── Animation ─────────────────────────────────────────────────────
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.4' },
        },
        // Kinetic headline word-reveal (fallback for non-Framer contexts)
        'kinetic-in': {
          '0%':   { opacity: '0', transform: 'translateY(0.6em)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Liquid float — LiquidGlassCard decorative
        'liquid-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        'fade-up':       'fade-up 0.45s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in':       'fade-in 0.35s cubic-bezier(0.16,1,0.3,1) forwards',
        'pulse-dot':     'pulse-dot 2s ease-in-out infinite',
        'kinetic-in':    'kinetic-in 0.55s cubic-bezier(0.16,1,0.3,1) both',
        'liquid-float':  'liquid-float 4s ease-in-out infinite',
      },

      // ── Box shadow ────────────────────────────────────────────────────
      boxShadow: {
        'glow-primary': '0 0 32px -8px var(--accent-primary)',
        'glow-fintech':  '0 0 32px -8px var(--accent-fintech)',
        'card':          '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover':    '0 8px 40px rgba(0,0,0,0.6)',
      },

      // ── Z-index ───────────────────────────────────────────────────────
      zIndex: {
        'navbar':  '200',
        'overlay': '400',
        'command': '500',
        'modal':   '9000',
        'toast':   '50',
      },
    },
  },

  plugins: [],
};

export default config;