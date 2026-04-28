'use client';

import { m, useReducedMotion } from 'framer-motion';

const TERMINAL_LINES = [
  { delay: 0, text: '$ pnpm run deploy --env production', color: 'text-white/60' },
  { delay: 0.4, text: '✓ build passed — 0 type errors', color: 'text-emerald-400' },
  { delay: 0.8, text: '✓ 847 tests passed — 0 failed', color: 'text-emerald-400' },
  { delay: 1.2, text: '✓ lighthouse: 97 perf / 100 a11y', color: 'text-cyan-400' },
  { delay: 1.6, text: '✓ bundle: 88 kB (+2 kB gzip)', color: 'text-emerald-400' },
  { delay: 2, text: '▸ deploying to edge — 3 regions', color: 'text-white/50' },
  { delay: 2.6, text: '✓ deployed in 18s — zero downtime', color: 'text-emerald-400' },
  { delay: 3.1, text: '$ uptime check — 99.94% (90d)', color: 'text-white/60' },
  { delay: 3.5, text: '  sabiscore  ●  HEALTHY', color: 'text-emerald-400' },
  { delay: 3.8, text: '  taxbridge  ●  HEALTHY', color: 'text-emerald-400' },
  { delay: 4.1, text: '  hashablanca  ●  HEALTHY', color: 'text-emerald-400' },
] as const;

export function HeroVisual() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="relative hidden flex-col justify-center lg:flex" aria-hidden="true">
      {/* Terminal window */}
      <div className="glass overflow-hidden rounded-(--radius-xl) border border-white/10 shadow-[0_32px_80px_rgba(0,0,0,0.45)]">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-white/8 bg-white/4 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-red-500/70" />
          <span className="h-3 w-3 rounded-full bg-amber-500/70" />
          <span className="h-3 w-3 rounded-full bg-emerald-500/70" />
          <span className="ml-3 font-mono text-[11px] tracking-wider text-white/35">
            scardubu — production
          </span>
        </div>

        {/* Terminal body */}
        <div className="min-h-[280px] space-y-1.5 p-5 font-mono text-[12px] leading-6">
          {TERMINAL_LINES.map((line) => (
            <m.p
              key={line.text}
              className={line.color}
              initial={{ opacity: 0, x: reducedMotion ? 0 : -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : { delay: line.delay, duration: 0.25, ease: [0.16, 1, 0.3, 1] }
              }
            >
              {line.text}
            </m.p>
          ))}
          {/* Blinking cursor */}
          <m.span
            className="inline-block h-3.5 w-1.5 bg-cyan-400/80 align-middle"
            animate={{ opacity: reducedMotion ? 1 : [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 1.1, ease: 'linear' }}
          />
        </div>
      </div>

      {/* Ambient glow behind terminal */}
      <div className="terminal-ambient-glow pointer-events-none absolute inset-0 -z-10 rounded-(--radius-xl)" />
    </div>
  );
}
