/**
 * CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
 * Major Reset • Lagos → Global • Production Conviction Architecture
 *
 * tailwind.config.ts — Tailwind utility generation only.
 *
 * PHASE 2 CLEANUP:
 *   - Removed arbitrary spacing overrides (use CSS custom properties in
 *     globals.css instead — they don't tree-shake well in Tailwind v4)
 *   - Removed maxWidth overrides (moved to CSS --max-width-* custom properties)
 *   - Removed zIndex overrides (defined in @theme block in globals.css)
 *   - Color mappings updated to match canonical :root token names
 *   - All color values reference var(--token) from globals.css :root
 *
 * Rule: This file is for Tailwind utility generation only. Design token
 * values live in globals.css :root. Never hardcode hex/oklch here.
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
      // ── Colors (all reference CSS custom properties from :root) ───────────
      // Token names match the canonical --color-* names in globals.css :root
      colors: {
        // Backgrounds
        'color-bg': 'var(--color-bg)',
        'color-surface': 'var(--color-surface)',
        'color-surface-raised': 'var(--color-surface-raised)',

        // Text
        'color-text-primary': 'var(--color-text-primary)',
        'color-text-secondary': 'var(--color-text-secondary)',
        'color-text-muted': 'var(--color-text-muted)',

        // Accents
        'color-film-teal': 'var(--color-film-teal)',
        'color-film-amber': 'var(--color-film-amber)',
        'color-film-violet': 'var(--color-film-violet)',

        // Semantic
        'color-success': 'var(--color-success)',
        'color-warning': 'var(--color-warning)',
        'color-danger': 'var(--color-danger)',

        // Borders
        'color-border': 'var(--color-border)',
        'color-border-subtle': 'var(--color-border-subtle)',
        'color-border-hover': 'var(--color-border-hover)',

        // Metric badges (used in MetricBadge component)
        metric: {
          live: 'var(--color-success)',
          documented: 'var(--color-film-teal)',
          backtested: 'var(--color-film-amber)',
          snapshot: 'var(--color-text-muted)',
        },
      },

      // ── Typography ────────────────────────────────────────────────────────
      fontFamily: {
        display: ['var(--font-display)', 'var(--font-syne)', 'Syne', 'Arial Black', 'sans-serif'],
        mono: [
          'var(--font-mono)',
          'var(--font-jetbrains-mono)',
          'JetBrains Mono',
          'Fira Code',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'monospace',
        ],
        sans: [
          'var(--font-body)',
          'var(--font-dm-sans)',
          'DM Sans',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif',
        ],
        didone: [
          'var(--font-didone)',
          'var(--font-didone-var)',
          'Playfair Display',
          'Georgia',
          'serif',
        ],
      },

      fontSize: {
        metric: ['clamp(1.75rem, 4vw, 2.5rem)', { lineHeight: '1', letterSpacing: '-0.03em' }],
        display: [
          'clamp(2.25rem, 6vw + 0.75rem, 6.25rem)',
          { lineHeight: '1.07', letterSpacing: '-0.04em' },
        ],
        // Sub-xs sizes used throughout mono labels, badge caps, and status pills.
        // These fill the gap below Tailwind's default text-xs (12px).
        '2xs': ['0.625rem', { lineHeight: '1.5' }], // 10px — primary mono label size
        '3xs': ['0.5625rem', { lineHeight: '1.4' }], // 9px  — condensed metric labels
      },

      // ── Spacing — only custom named values, not scale overrides ──────────
      // Tailwind defaults (4px base) are kept. Only add named semantic values.
      spacing: {
        section: '6rem', // var(--section-py) for section padding shortcuts
        nav: '60px', // var(--nav-height)
        'bottom-nav': '68px', // var(--bottom-nav-height)
      },

      // ── Border radius ─────────────────────────────────────────────────────
      // Mirror the @theme radius tokens for Tailwind class generation
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
        xl: '18px',
        '2xl': '24px',
        full: '9999px',
      },

      // ── Animation ─────────────────────────────────────────────────────────
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        // Kinetic headline word-reveal (fallback for non-Framer contexts)
        'kinetic-in': {
          '0%': { opacity: '0', transform: 'translateY(0.6em)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Liquid float — LiquidGlassCard decorative
        'liquid-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.45s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in': 'fade-in 0.35s cubic-bezier(0.16,1,0.3,1) forwards',
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
        'kinetic-in': 'kinetic-in 0.55s cubic-bezier(0.16,1,0.3,1) both',
        'liquid-float': 'liquid-float 4s ease-in-out infinite',
      },

      // ── Box shadow ────────────────────────────────────────────────────────
      boxShadow: {
        'glow-teal': '0 0 32px -8px var(--color-film-teal-glow)',
        'glow-amber': '0 0 32px -8px var(--color-film-amber-glow)',
        'glow-violet': '0 0 32px -8px var(--color-film-violet-glow)',
        card: '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.6)',
        // Deprecated aliases — kept for backward compat
        'glow-primary': 'var(--color-film-teal-glow)',
        'glow-fintech': 'var(--color-film-amber-glow)',
      },
    },
  },

  plugins: [],
};

export default config;
