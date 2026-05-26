'use client';

import dynamic from 'next/dynamic';
import { m, useAnimationFrame, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { type PointerEvent as ReactPointerEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useScrollCinema } from '@/components/cinematic/ScrollCinemaProvider';
import { cn } from '@/lib/utils';

export type IdentityCardVariant = 'mobile' | 'desktop';

interface IdentityCardProps {
  variant: IdentityCardVariant;
  className?: string;
  reducedMotion?: boolean;
}

const PORTRAIT_SOURCES = [
  '/headshot.webp',
  '/images/oscar-headshot.jpg',
  '/images/scar-headshot.jpeg',
] as const;

const TECH_TAGS = ['FULL-STACK', 'JAVA', 'NEXT.JS 15', 'REACT NATIVE', 'AI SYSTEMS', 'FINTECH'] as const;

type PerformanceHints = Navigator & {
  connection?: {
    effectiveType?: string;
    saveData?: boolean;
  };
  deviceMemory?: number;
  hardwareConcurrency?: number;
};

const HeroPortraitShader = dynamic(
  () => import('@/components/cinematic/HeroPortraitShader').then((mod) => mod.HeroPortraitShader),
  {
    ssr: false,
    loading: () => null,
  }
);

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function PortraitFallback({ isDesktop }: Readonly<{ isDesktop: boolean }>) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_28%,rgba(56,189,248,0.16),transparent_44%),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.05),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(0,0,0,0.28))]"
    >
      <div
        className={cn(
          'grid place-items-center rounded-full border border-white/12 bg-black/35 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-sm',
          isDesktop ? 'h-24 w-24' : 'h-20 w-20'
        )}
      >
        <span
          className={cn(
            'font-display font-semibold tracking-[-0.08em] text-white/85',
            isDesktop ? 'text-3xl' : 'text-2xl'
          )}
        >
          ON
        </span>
      </div>
    </div>
  );
}

export function IdentityCard({ variant, className, reducedMotion }: Readonly<IdentityCardProps>) {
  const prefersReducedMotion = useReducedMotion();
  const shouldReduceMotion = reducedMotion ?? Boolean(prefersReducedMotion);
  const isDesktop = variant === 'desktop';

  const { scrollYRef } = useScrollCinema();

  const shellRef = useRef<HTMLFigureElement>(null);
  const [portraitIndex, setPortraitIndex] = useState(0);
  const [portraitReady, setPortraitReady] = useState(false);
  const [portraitFailed, setPortraitFailed] = useState(false);
  const [allowShader, setAllowShader] = useState(false);

  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.38);
  const scrollDepth = useMotionValue(0);

  const rotateY = useSpring(useTransform(pointerX, [0, 1], [-7.5, 7.5]), {
    stiffness: 150,
    damping: 24,
    mass: 0.26,
  });
  const rotateX = useSpring(useTransform(pointerY, [0, 1], [8, -8]), {
    stiffness: 150,
    damping: 24,
    mass: 0.26,
  });
  const lift = useSpring(useTransform(scrollDepth, [0, 1], [0, 8]), {
    stiffness: 120,
    damping: 26,
    mass: 0.24,
  });

  const portraitSrc = PORTRAIT_SOURCES[portraitIndex];

  useEffect(() => {
    setPortraitIndex(0);
    setPortraitReady(false);
    setPortraitFailed(false);
  }, [variant]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hints = navigator as PerformanceHints;
    const connection = hints.connection;
    const prefersCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const prefersFinePointer = window.matchMedia('(pointer: fine)').matches;
    const saveData = Boolean(connection?.saveData);
    const slowConnection = /(^|-)2g$|slow-2g/i.test(connection?.effectiveType ?? '');
    const lowMemory = typeof hints.deviceMemory === 'number' && hints.deviceMemory <= 4;
    const lowCores = typeof hints.hardwareConcurrency === 'number' && hints.hardwareConcurrency <= 4;

    setAllowShader(
      isDesktop &&
        !shouldReduceMotion &&
        prefersFinePointer &&
        !prefersCoarsePointer &&
        !saveData &&
        !slowConnection &&
        !lowMemory &&
        !lowCores
    );
  }, [isDesktop, shouldReduceMotion]);

  useAnimationFrame(() => {
    if (shouldReduceMotion) return;
    const nextDepth = clamp(scrollYRef.current / 5600, 0, 1);
    scrollDepth.set(nextDepth);
  });

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (shouldReduceMotion) return;

      const shell = shellRef.current;
      if (!shell) return;

      const rect = shell.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      pointerX.set(clamp((event.clientX - rect.left) / rect.width, 0, 1));
      pointerY.set(clamp((event.clientY - rect.top) / rect.height, 0, 1));
    },
    [pointerX, pointerY, shouldReduceMotion]
  );

  const resetPointer = useCallback(() => {
    pointerX.set(0.5);
    pointerY.set(0.38);
  }, [pointerX, pointerY]);

  const techTagAnimations = useMemo(
    () =>
      TECH_TAGS.map((tag, index) => (
        <m.span
          key={tag}
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8, filter: 'blur(4px)' }}
          animate={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { delay: 0.28 + index * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }
          }
          className="hero-tech-tag"
        >
          {tag}
        </m.span>
      )),
    [shouldReduceMotion]
  );

  return (
    <m.figure
      ref={shellRef}
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12, scale: 0.985 }}
      animate={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0, scale: 1 }}
      whileHover={
        isDesktop && !shouldReduceMotion
          ? {
              scale: 1.01,
              transition: { type: 'spring', stiffness: 240, damping: 22 },
            }
          : undefined
      }
      transition={
        shouldReduceMotion ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
      }
      aria-label="Luxury operating-system identity card portrait"
      className={cn(
        'hero-headshot-frame relative isolate transform-gpu will-change-transform [transform-style:preserve-3d]',
        isDesktop ? 'w-full max-w-[17rem] min-w-[14rem] self-center xl:max-w-[18rem]' : 'w-full max-w-52 min-w-40 self-center sm:max-w-56 md:max-w-60 lg:hidden',
        className
      )}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1200,
        rotateX: shouldReduceMotion ? 0 : rotateX,
        rotateY: shouldReduceMotion ? 0 : rotateY,
        y: shouldReduceMotion ? 0 : lift,
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-4 -z-10 rounded-[2rem] bg-[radial-gradient(circle_at_50%_38%,rgba(56,189,248,0.18),transparent_60%),radial-gradient(circle_at_70%_22%,rgba(255,255,255,0.08),transparent_35%)] blur-3xl"
      />

      <div
        className="hero-headshot-shell relative aspect-[4/5] w-full overflow-hidden rounded-[36px] border border-white/12 bg-[oklch(16%_0.015_255_/_0.94)] shadow-[0_26px_72px_rgba(0,0,0,0.58),0_0_0_1px_rgba(255,255,255,0.06)]"
        onPointerMove={handlePointerMove}
        onPointerLeave={resetPointer}
        onPointerCancel={resetPointer}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.05)_10%,transparent_30%,transparent_68%,rgba(0,0,0,0.68)_100%)]"
        />
        <div
          aria-hidden="true"
          className="hero-headshot-scanlines pointer-events-none absolute inset-0 z-[1]"
        />
        <div
          aria-hidden="true"
          className="hero-headshot-matrix pointer-events-none absolute inset-0 z-[1]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.12),transparent_28%),radial-gradient(circle_at_52%_82%,rgba(56,189,248,0.1),transparent_56%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.34),transparent)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-16 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.42))]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[2] rounded-[36px] ring-1 ring-inset ring-white/10"
        />

        {allowShader ? <HeroPortraitShader /> : null}

        {!portraitFailed ? (
          <img
            src={portraitSrc}
            alt="Oscar Ndugbu — Staff+ Full-Stack Engineer, Lagos"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            draggable={false}
            onLoad={() => setPortraitReady(true)}
            onError={() => {
              setPortraitReady(false);
              setPortraitIndex((current) => {
                if (current >= PORTRAIT_SOURCES.length - 1) {
                  setPortraitFailed(true);
                  return current;
                }

                return current + 1;
              });
            }}
            className={cn(
              'absolute inset-0 z-[0] h-full w-full object-cover transition-[opacity,transform,filter] duration-700 ease-out',
              portraitReady ? 'opacity-100' : 'opacity-0',
              isDesktop ? 'object-[50%_14%]' : 'object-[50%_18%]'
            )}
            style={{
              backfaceVisibility: 'hidden',
              filter: 'contrast(1.08) saturate(1.06) brightness(0.92)',
              transform: shouldReduceMotion ? 'none' : 'scale(1.02)',
            }}
          />
        ) : (
          <PortraitFallback isDesktop={isDesktop} />
        )}

        <div aria-hidden="true" className="pointer-events-none absolute inset-x-4 top-[4.4rem] z-[4] flex flex-wrap gap-1.5">
          {techTagAnimations}
        </div>

        <div
          className={cn(
            'absolute z-[4] flex items-start justify-between',
            isDesktop
              ? 'inset-x-4 top-4 gap-3'
              : 'inset-x-3.5 top-3.5 gap-2.5 sm:inset-x-4 sm:top-4 sm:gap-3'
          )}
        >
          <div className="min-w-0">
            <span
              className={cn(
                'block font-mono text-white/46 uppercase',
                isDesktop
                  ? 'text-[9px] tracking-[0.28em]'
                  : 'text-[8px] tracking-[0.22em] sm:text-[9px] sm:tracking-[0.28em]'
              )}
            >
              System ID
            </span>
            <span
              className={cn(
                'mt-1 block truncate text-white/86 uppercase',
                isDesktop
                  ? 'text-[11px] tracking-[0.24em]'
                  : 'text-[10px] tracking-[0.18em] sm:text-[11px] sm:tracking-[0.24em]'
              )}
            >
              Oscar Ndugbu
            </span>
          </div>

          <span
            className={cn(
              'shrink-0 rounded-full border border-white/12 bg-black/45 font-mono text-white/80 uppercase backdrop-blur-md',
              isDesktop
                ? 'px-2.5 py-1 text-[9px] tracking-[0.2em]'
                : 'px-2 py-1 text-[8px] tracking-[0.18em] sm:px-2.5 sm:text-[9px] sm:tracking-[0.2em]'
            )}
          >
            Staff+
          </span>
        </div>

        <div
          className={cn(
            'absolute z-[4] flex justify-between',
            isDesktop
              ? 'inset-x-4 bottom-4 items-end gap-3'
              : 'inset-x-3.5 bottom-3 items-end gap-2.5 sm:inset-x-4 sm:bottom-4 sm:gap-3'
          )}
        >
          <div className={cn('min-w-0', isDesktop ? 'max-w-[70%]' : 'max-w-[64%] sm:max-w-[70%]')}>
            <span
              className={cn(
                'block font-mono text-white/46 uppercase',
                isDesktop
                  ? 'text-[9px] tracking-[0.26em]'
                  : 'text-[8px] tracking-[0.2em] sm:text-[9px] sm:tracking-[0.26em]'
              )}
            >
              Engineering Access
            </span>
            <span
              className={cn(
                'mt-1 block font-mono text-white/78 uppercase',
                isDesktop
                  ? 'truncate text-[10px] tracking-[0.18em]'
                  : 'text-[9px] leading-tight tracking-[0.14em] break-words whitespace-normal sm:text-[10px] sm:tracking-[0.18em]'
              )}
            >
              Full-Stack · Java · Next.js 15
            </span>
          </div>

          <span
            className={cn(
              'shrink-0 font-mono text-white/56 uppercase',
              isDesktop
                ? 'text-[9px] tracking-[0.22em]'
                : 'text-[8px] tracking-[0.18em] sm:text-[9px] sm:tracking-[0.22em]'
            )}
          >
            Lagos · UTC+1
          </span>
        </div>
      </div>
    </m.figure>
  );
}
