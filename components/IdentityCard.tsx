'use client';

import Image from 'next/image';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';
import type { CSSProperties, JSX, PointerEvent } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

type IdentityCardProps = {
  className?: string;
  reducedMotion?: boolean;
};

const PORTRAIT_SOURCES = [
  '/images/oscar-portrait.webp',
  '/images/oscar.webp',
  '/images/portrait.webp',
  '/avatar.webp',
  '/avatar.png',
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
        OA
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
    <motion.article
      aria-label="Oscar Akintola identity card"
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

      <motion.div
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
                  alt="Portrait of Oscar Akintola"
                  fill
                  priority
                  sizes="(max-width: 640px) 82vw, 190px"
                  className="object-cover object-center opacity-95 transition duration-700 group-hover:scale-[1.035]"
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
                <h2 className="mt-2 text-balance text-3xl font-semibold leading-none text-white sm:text-4xl">
                  Oscar Akintola
                </h2>
              </div>

              <p className="text-sm leading-6 text-white/62">
                Builds production-grade financial, AI, and cinematic web systems
                with measurable delivery discipline.
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
            <a
              href="mailto:hello@oscarakintola.dev?subject=Staff%2B%20engineering%20conversation"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition duration-300 hover:scale-[1.025] hover:bg-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              Request interview
            </a>

            <a
              href="#projects"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.055] px-5 py-3 text-sm font-semibold text-white/86 transition duration-300 hover:scale-[1.025] hover:bg-white/[0.09] focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              View proof
            </a>
          </div>

          <p className="mt-4 font-mono text-[0.62rem] uppercase tracking-[0.24em] text-white/42">
            Lagos · UTC+1 · Next.js 15 · Node · Java · ML Infra
          </p>
        </div>
      </div>
    </motion.article>
  );
}