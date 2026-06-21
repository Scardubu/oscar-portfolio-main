'use client';

import Image from 'next/image';
import {
  // PATCH v2026.20 [LazyMotion]: `motion` → `m` — same rationale as HeroSection.
  // IdentityCard uses motion.article (the card tilt wrapper) and motion.div (the
  // tilt content layer). Both are inside the LazyMotion strict boundary from
  // MotionProvider and must use the `m` prefix to avoid pulling in the full bundle.
  m,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';
import type { CSSProperties, JSX, PointerEvent } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { anchorUrl, CONTACT_EMAIL } from '@/lib/config';

type IdentityCardProps = {
  className?: string;
  reducedMotion?: boolean;
};

// PATCH v2026.18 — Portrait source order corrected to match files that actually
// exist in /public. Previous list (oscar-portrait.webp, oscar.webp, portrait.webp,
// avatar.webp, avatar.png) resolved to zero real assets, so every <Image> request
// 404'd, onError cascaded through the full list, and the card permanently rendered
// <PortraitFallback /> ("OA" initials) instead of the cinematic duotone headshot the
// #luxury-duotone-cinema filter (app/layout.tsx) was built for.
//
// /headshot.webp is the optimized asset already referenced by the Person schema
// (app/lib/structured-data.ts → image: "https://www.scardubu.dev/headshot.webp"),
// so it is the correct primary source. The .jpg/.jpeg variants remain as
// defense-in-depth fallbacks only.
const PORTRAIT_SOURCES = [
  '/headshot.webp',
  '/images/oscar-headshot.jpg',
  '/images/scar-headshot.jpeg',
] as const;

const STACK_SIGNALS = ['Next.js 15', 'Node', 'Java', 'ML Infra'] as const;

const TRUST_SIGNALS = [
  'NRS-compliant e-invoicing',
  'Low-RAM ML infrastructure',
  'Production-grade cinematic systems',
  'Staff+ delivery discipline',
] as const;

function PortraitFallback(): JSX.Element {
  return (
    <div
      aria-hidden="true"
      className="grid size-full place-items-center bg-[radial-gradient(circle_at_28%_18%,rgba(56,189,248,0.28),transparent_36%),radial-gradient(circle_at_80%_70%,rgba(251,146,60,0.22),transparent_38%),linear-gradient(145deg,rgba(15,23,42,0.98),rgba(2,6,23,0.98))]"
    >
      <span className="font-mono text-4xl font-semibold tracking-[0.28em] text-white/85">
        ON
      </span>
    </div>
  );
}

export default function IdentityCard({
  className = '',
  reducedMotion,
}: IdentityCardProps): JSX.Element {
  const prefersReducedMotion = useReducedMotion();
  const shouldReduceMotion = reducedMotion ?? Boolean(prefersReducedMotion);

  const [portraitIndex, setPortraitIndex] = useState(0);
  const [portraitFailed, setPortraitFailed] = useState(false);
  const [coarsePointer, setCoarsePointer] = useState(false);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);

  const rotateXRaw = useTransform(pointerY, [-0.5, 0.5], [8, -8]);
  const rotateYRaw = useTransform(pointerX, [-0.5, 0.5], [-9, 9]);

  const rotateX = useSpring(rotateXRaw, {
    stiffness: 240,
    damping: 28,
    mass: 0.5,
  });

  const rotateY = useSpring(rotateYRaw, {
    stiffness: 240,
    damping: 28,
    mass: 0.5,
  });

  const glareXSpring = useSpring(glareX, {
    stiffness: 200,
    damping: 26,
    mass: 0.45,
  });

  const glareYSpring = useSpring(glareY, {
    stiffness: 200,
    damping: 26,
    mass: 0.45,
  });

  const glareBackground = useMotionTemplate`
    radial-gradient(
      circle at ${glareXSpring}% ${glareYSpring}%,
      rgba(255,255,255,0.34),
      rgba(56,189,248,0.15) 18%,
      rgba(251,146,60,0.11) 36%,
      transparent 60%
    )
  `;

  const portraitSrc = PORTRAIT_SOURCES[portraitIndex];

  useEffect(() => {
    const query = window.matchMedia('(pointer: coarse)');

    const syncPointer = (): void => {
      setCoarsePointer(query.matches);
    };

    syncPointer();
    query.addEventListener('change', syncPointer);

    return () => {
      query.removeEventListener('change', syncPointer);
    };
  }, []);

  const resetTilt = useCallback((): void => {
    pointerX.set(0);
    pointerY.set(0);
    glareX.set(50);
    glareY.set(50);
  }, [glareX, glareY, pointerX, pointerY]);

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLElement>): void => {
      if (shouldReduceMotion || coarsePointer) return;

      const rect = event.currentTarget.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;

      pointerX.set(x - 0.5);
      pointerY.set(y - 0.5);
      glareX.set(x * 100);
      glareY.set(y * 100);
    },
    [coarsePointer, glareX, glareY, pointerX, pointerY, shouldReduceMotion],
  );

  const handlePortraitError = useCallback((): void => {
    const nextIndex = portraitIndex + 1;

    if (nextIndex < PORTRAIT_SOURCES.length) {
      setPortraitIndex(nextIndex);
      return;
    }

    setPortraitFailed(true);
  }, [portraitIndex]);

  const baseMotionStyle = useMemo<CSSProperties>(
    () => ({
      transformStyle: 'preserve-3d',
      willChange: shouldReduceMotion || coarsePointer ? 'auto' : 'transform',
    }),
    [coarsePointer, shouldReduceMotion],
  );

  const interactiveMotionStyle = shouldReduceMotion || coarsePointer
    ? baseMotionStyle
    : {
        ...baseMotionStyle,
        rotateX,
        rotateY,
      };

  return (
    <m.article
      aria-label="Oscar Ndugbu identity card"
      className={[
        'group relative mx-auto w-full max-w-[25rem] rounded-[2rem]',
        'border border-white/10 bg-white/[0.055] p-3 shadow-2xl shadow-sky-950/35',
        'backdrop-blur-2xl [perspective:1200px] transform-gpu',
        className,
      ].join(' ')}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 18, scale: 0.985 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 180, damping: 24, mass: 0.6 }}
      // eslint-disable-next-line no-restricted-syntax -- GPU-bound Framer Motion tilt values.
      style={interactiveMotionStyle}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[linear-gradient(135deg,rgba(56,189,248,0.22),transparent_28%,rgba(251,146,60,0.18)_72%,transparent)] opacity-70" />

      <m.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-px rounded-[1.9rem] opacity-0 mix-blend-screen transition-opacity duration-500 group-hover:opacity-100"
        // eslint-disable-next-line no-restricted-syntax -- Dynamic glare follows pointer on a GPU-composited motion layer.
        style={{ background: glareBackground }}
      />

      <div className="relative overflow-hidden rounded-[1.65rem] border border-white/10 bg-slate-950/72">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(56,189,248,0.18),transparent_34%),radial-gradient(circle_at_90%_12%,rgba(251,146,60,0.16),transparent_30%)]" />

        <div className="relative p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.28em] text-sky-100/90">
              Available for Staff+ impact
            </p>

            <span className="rounded-full border border-orange-300/20 bg-orange-300/10 px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.24em] text-orange-100/85">
              UTC+1
            </span>
          </div>

          <div className="grid gap-5 sm:grid-cols-[0.82fr_1fr] sm:items-end">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.35rem] border border-white/10 bg-slate-900 shadow-2xl shadow-black/35">
              {portraitFailed ? (
                <PortraitFallback />
              ) : (
                <Image
                  src={portraitSrc}
                  alt="Portrait of Oscar Ndugbu"
                  fill
                  priority
                  sizes="(max-width: 640px) 82vw, 190px"
                  // PATCH v2026.21 [motion]: group-hover zoom gated behind motion-safe so
                  // it's fully suppressed under prefers-reduced-motion (matches the rest of
                  // the codebase's hover-transform discipline).
                  className="object-cover object-center opacity-95 transition duration-700 motion-safe:group-hover:scale-[1.035]"
                  onError={handlePortraitError}
                  // eslint-disable-next-line no-restricted-syntax -- SVG duotone filter enhancement has safe browser fallback.
                  style={{
                    filter:
                      'url(#luxury-duotone-cinema) saturate(1.08) contrast(1.04)',
                  }}
                />
              )}

              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_46%,rgba(2,6,23,0.72))]" />
            </div>

            <div className="space-y-3">
              <div>
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.32em] text-white/50">
                  Staff+ Engineer
                </p>
                <h2 className="mt-2 text-pretty text-3xl font-semibold leading-[1.05] text-white sm:text-4xl">
                  Oscar Ndugbu
                </h2>
              </div>

              <p className="text-sm leading-6 text-white/62">
                Ships financial, AI, and cinematic systems built to hold under
                Lagos constraints — with delivery you can measure.
              </p>

              <div className="flex flex-wrap gap-2">
                {STACK_SIGNALS.map((signal) => (
                  <span
                    key={signal}
                    className="rounded-full border border-white/10 bg-white/[0.065] px-3 py-1.5 text-xs font-medium text-white/76"
                  >
                    {signal}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-2">
            {TRUST_SIGNALS.map((signal) => (
              <div
                key={signal}
                className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.045] px-3.5 py-3 text-sm text-white/72"
              >
                <span className="size-1.5 rounded-full bg-sky-300 shadow-[0_0_18px_rgba(56,189,248,0.9)]" />
                <span>{signal}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            {/* PATCH v2026.21 [a11y + motion]: focus: → focus-visible:, hover:scale →
                motion-safe:hover:scale, added active:scale press feedback. Mirrors the
                Hero CTA treatment so both primary conversion paths are identical. */}
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Staff+ engineering conversation')}`}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition duration-300 hover:bg-sky-100 focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 focus-visible:outline-none active:scale-[0.985] motion-safe:hover:scale-[1.025]"
            >
              Request interview
            </a>

            <a
              href={anchorUrl('section-projects')}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.055] px-5 py-3 text-sm font-semibold text-white/86 transition duration-300 hover:border-white/20 hover:bg-white/[0.09] focus-visible:ring-2 focus-visible:ring-[color:var(--brand-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 focus-visible:outline-none active:scale-[0.985] motion-safe:hover:scale-[1.025]"
            >
              View proof
            </a>
          </div>

          <p className="mt-4 font-mono text-[0.62rem] uppercase tracking-[0.24em] text-white/42">
            Lagos · UTC+1 · Next.js 15 · Node · Java · ML Infra
          </p>
        </div>
      </div>
    </m.article>
  );
}