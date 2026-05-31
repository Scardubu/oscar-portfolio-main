'use client';

// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// IdentityCard — Luxury operating-system identity card portrait
//
// CHANGELOG v2026.9:
//
//   FIX 9–13: Maintained all previous core stability enhancements (cached image 
//     callbacks, inline transform-style single source of truth, superellipse 
//     squircle clip-paths, and loading shimmer state).
//
//   FIX 14: SVG Duotone Cinema Mapping Filter.
//     Embedded a hardware-accelerated SVG filter (#luxury-duotone-cinema) directly 
//     into the component tree. It non-destructively maps image luminance to deep 
//     cinematic teal shadows (#031c24) and vibrant amber-orange highlights (#ff9540), 
//     blending back 15% of the original graphic to retain raw micro-details.
//
//   FIX 15: Dynamic Interactive Glare Sheen.
//     Connected pointer coordinates to spring-damped MotionValues (glareX, glareY). 
//     A custom useMotionTemplate linear glare flare dynamically sweeps across the 
//     glass surface relative to cursor position on desktop frames.
//
//   FIX 16: Micro-contrast typography and operational pulse upgrades.
//     Sharpened letter-tracking, normalized layout boundaries for subpixel alignment, 
//     and elevated text element weights for high-DPI panels.

import { m, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { type MouseEvent as ReactMouseEvent, useCallback, useRef, useState } from 'react';

import { cn } from '@/lib/utils';
import { SquircleDefs } from '@/components/SquircleDefs';

export type IdentityCardVariant = 'mobile' | 'desktop';

interface IdentityCardProps {
  variant: IdentityCardVariant;
  className?: string;
  reducedMotion?: boolean;
  priority?: boolean;
}

const PORTRAIT_SOURCES = [
  '/headshot.webp',
  '/images/oscar-headshot.jpg',
  '/images/scar-headshot.jpeg',
] as const;

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

export function IdentityCard({
  variant,
  className,
  reducedMotion,
  priority,
}: Readonly<IdentityCardProps>) {
  const prefersReducedMotion = useReducedMotion();
  const shouldReduceMotion = reducedMotion ?? Boolean(prefersReducedMotion);
  const isDesktop = variant === 'desktop';
  const shouldPrioritizeImage = priority ?? !isDesktop;
  const imageLoading = shouldPrioritizeImage ? 'eager' : 'lazy';
  const imageFetchPriority = shouldPrioritizeImage ? 'high' : 'auto';
  
  // Card Tilt physics
  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rotateX = useSpring(rawRotateX, { stiffness: 220, damping: 24, mass: 0.42 });
  const rotateY = useSpring(rawRotateY, { stiffness: 220, damping: 24, mass: 0.42 });

  // Glare Physics tracking
  const rawGlareX = useMotionValue(50);
  const rawGlareY = useMotionValue(50);
  const glareX = useSpring(rawGlareX, { stiffness: 200, damping: 26 });
  const glareY = useSpring(rawGlareY, { stiffness: 200, damping: 26 });

  const [portraitIndex, setPortraitIndex] = useState(0);
  const [portraitReady, setPortraitReady] = useState(false);
  const [portraitFailed, setPortraitFailed] = useState(false);

  const imgReadyRef = useRef(false);

  const handleLoad = useCallback(() => {
    if (!imgReadyRef.current) {
      imgReadyRef.current = true;
      setPortraitReady(true);
    }
  }, []);

  const handleError = useCallback(() => {
    imgReadyRef.current = false;
    setPortraitReady(false);
    setPortraitIndex((current) => {
      if (current >= PORTRAIT_SOURCES.length - 1) {
        setPortraitFailed(true);
        return current;
      }
      return current + 1;
    });
  }, []);

  const imgRef = useCallback(
    (node: HTMLImageElement | null) => {
      if (node && node.complete && node.naturalWidth > 0 && !imgReadyRef.current) {
        handleLoad();
      }
    },
    [handleLoad]
  );

  const portraitSrc = PORTRAIT_SOURCES[portraitIndex];

  const handlePointerMove = useCallback(
    (event: ReactMouseEvent<HTMLElement>) => {
      if (shouldReduceMotion || !isDesktop) return;

      const rect = event.currentTarget.getBoundingClientRect();
      const pointerX = (event.clientX - rect.left) / rect.width;
      const pointerY = (event.clientY - rect.top) / rect.height;

      rawRotateX.set((0.5 - pointerY) * 5.5);
      rawRotateY.set((pointerX - 0.5) * 7);
      
      // Update interactive glare layout coords (mapped to percentage space)
      rawGlareX.set(pointerX * 100);
      rawGlareY.set(pointerY * 100);
    },
    [isDesktop, rawRotateX, rawRotateY, rawGlareX, rawGlareY, shouldReduceMotion]
  );

  const resetPointerTilt = useCallback(() => {
    rawRotateX.set(0);
    rawRotateY.set(0);
    rawGlareX.set(50);
    rawGlareY.set(50);
  }, [rawRotateX, rawRotateY, rawGlareX, rawGlareY]);

  // Motion string composition for high-performance GPU-bound layer blending
  const glareStyle = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.14) 0%, rgba(56, 189, 248, 0.04) 30%, transparent 65%)`;

  return (
    <>
      {/* SVG Duotone Cinema Lookup Filter */}
      <svg className="absolute h-0 w-0 invisible pointer-events-none select-none" aria-hidden="true">
        <defs>
          <filter id="luxury-duotone-cinema" colorInterpolationFilters="sRGB">
            {/* Step 1: Accurate high-fidelity luminance grayscale extraction */}
            <feColorMatrix
              type="matrix"
              values="0.2126 0.7152 0.0722 0 0
                      0.2126 0.7152 0.0722 0 0
                      0.2126 0.7152 0.0722 0 0
                      0      0      0      1 0"
              result="grayscale"
            />
            {/* Step 2: Component Transfer Map — Shadows (Teal #031c24) to Highlights (Amber Orange #ff9540) */}
            <feComponentTransfer in="grayscale" result="duotone">
              <feFuncR type="table" tableValues="0.0118 1.0000" />
              <feFuncG type="table" tableValues="0.1098 0.5843" />
              <feFuncB type="table" tableValues="0.1412 0.2510" />
              <feFuncA type="table" tableValues="0.0000 1.0000" />
            </feComponentTransfer>
            {/* Step 3: Normal blend overlay at 85% opacity to keep organic structural sub-details clean */}
            <feBlend mode="normal" in="SourceGraphic" in2="duotone" opacity="0.85" />
          </filter>
        </defs>
      </svg>

      <SquircleDefs />
      
      <m.figure
        initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12, scale: 0.985 }}
        animate={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0, scale: 1 }}
        whileHover={
          isDesktop && !shouldReduceMotion
            ? {
                scale: 1.014,
                y: -2,
                transition: { type: 'spring', stiffness: 240, damping: 22 },
              }
            : undefined
        }
        transition={
          shouldReduceMotion ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
        }
        aria-label="Oscar Ndugbu — Principal Backend & ML Infrastructure Engineer — interactive profile card"
        className={cn(
          'relative isolate transform-gpu overflow-visible will-change-transform',
          isDesktop
            ? 'w-full max-w-[21rem] min-w-[17rem] self-center xl:max-w-[22rem]'
            : 'aspect-[4/5] w-full max-w-[16.25rem] min-w-[13.25rem] self-center sm:max-w-[17.75rem] md:max-w-[18.75rem] lg:hidden',
          className
        )}
        // eslint-disable-next-line no-restricted-syntax
        style={{ transformStyle: isDesktop ? 'preserve-3d' : 'flat', rotateX, rotateY }}
        onMouseMove={handlePointerMove}
        onMouseLeave={resetPointerTilt}
      >
        {/* Ambient glow behind the card */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-5 -z-10 rounded-[2.5rem] bg-[radial-gradient(circle_at_50%_38%,rgba(56,189,248,0.22),transparent_56%),radial-gradient(circle_at_74%_22%,rgba(52,211,153,0.12),transparent_28%),radial-gradient(circle_at_50%_88%,rgba(255,255,255,0.05),transparent_38%)] blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[8%] top-[6%] -z-10 h-10 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.18),transparent_68%)] opacity-70 blur-2xl"
        />

        {/* Card Frame Context Container */}
        <div className="identity-card-frame relative isolate aspect-[4/5] w-full overflow-hidden rounded-[52px] border border-white/10 bg-[linear-gradient(175deg,rgba(18,24,36,0.99)_0%,rgba(10,14,22,0.995)_55%,rgba(6,9,15,1)_100%)] shadow-[0_30px_90px_rgba(0,0,0,0.62),0_0_0_1px_rgba(255,255,255,0.08),inset_0_2px_0_rgba(255,255,255,0.14),inset_0_-2px_0_rgba(0,0,0,0.10)] [clip-path:url(#squircle-id)]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-5 top-3 z-[1] h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.58),transparent)]"
          />

          {/* Decorative premium glass overlays */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.08)_10%,transparent_30%,transparent_72%,rgba(0,0,0,0.62)_100%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[1] [background-image:linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:100%_3px] opacity-70 mix-blend-overlay"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.14),transparent_28%),radial-gradient(circle_at_52%_82%,rgba(56,189,248,0.12),transparent_56%),linear-gradient(180deg,transparent_54%,rgba(5,10,16,0.54)_100%)]"
          />
          
          {/* Real-time pointer reflection shine layer */}
          {isDesktop && !shouldReduceMotion && (
            <m.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-[2] mix-blend-screen transition-opacity duration-300"
              // eslint-disable-next-line no-restricted-syntax
              style={{ backgroundImage: glareStyle }}
            />
          )}

          {/* Top edge highlight */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.34),transparent)]"
          />
          {/* Bottom vignette */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-28 bg-[linear-gradient(180deg,transparent_15%,rgba(0,0,0,0.85)_100%)]"
          />

          {/* Loading shimmer fallback */}
          {!portraitReady && !portraitFailed && (
            <div
              aria-hidden="true"
              className={cn('absolute inset-0 overflow-hidden', shouldReduceMotion && 'hidden')}
            >
              <div
                className="absolute inset-0 animate-[portrait-shimmer_2.4s_ease-in-out_infinite] bg-[length:200%_100%]"
                // eslint-disable-next-line no-restricted-syntax
                style={{
                  backgroundImage:
                    'linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.04) 37%, rgba(56,189,248,0.06) 50%, rgba(255,255,255,0.04) 63%, transparent 75%)',
                }}
              />
            </div>
          )}

          {/* Core Graphic Portrait Image Layer */}
          {!portraitFailed ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              ref={imgRef}
              src={portraitSrc}
              alt="Oscar Ndugbu — Principal Fintech Systems Architect & Backend Engineer"
              loading={imageLoading}
              fetchPriority={imageFetchPriority}
              decoding="async"
              draggable={false}
              onLoad={handleLoad}
              onError={handleError}
              className={cn(
                'absolute inset-0 h-full w-full scale-100 object-cover transition-opacity duration-700 ease-out select-none pointer-events-none',
                portraitReady ? 'opacity-100' : 'opacity-0',
                isDesktop ? 'object-[50%_12%]' : 'object-[50%_14%]'
              )}
              // eslint-disable-next-line no-restricted-syntax
              style={{ filter: 'url(#luxury-duotone-cinema)' }}
            />
          ) : (
            <PortraitFallback isDesktop={isDesktop} />
          )}

          {/* Precision inner metal border rings */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[3] rounded-[52px] ring-1 ring-white/10 [clip-path:url(#squircle-id)] ring-inset"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-[10px] z-[3] rounded-[42px] border border-white/6"
          />

          {/* Top Metadata Row: System ID + Status Pill */}
          <div
            className={cn(
              'absolute z-[4] flex items-start justify-between',
              isDesktop
                ? 'inset-x-5 top-5 gap-3'
                : 'inset-x-4 top-4 gap-3 sm:inset-x-5 sm:top-5 sm:gap-3'
            )}
          >
            <div className="min-w-0">
              <span
                className={cn(
                  'block font-mono text-white/50 uppercase font-semibold',
                  isDesktop
                    ? 'text-[9px] tracking-[0.32em]'
                    : 'text-[8px] tracking-[0.24em] sm:text-[9px] sm:tracking-[0.32em]'
                )}
              >
                System ID
              </span>
              <span
                className={cn(
                  'mt-1 block truncate text-white/95 uppercase font-medium font-mono',
                  isDesktop
                    ? 'text-[11px] tracking-[0.26em]'
                    : 'text-[10px] tracking-[0.20em] sm:text-[11px] sm:tracking-[0.26em]'
                )}
              >
                Oscar Ndugbu
              </span>
            </div>

            <span
              className={cn(
                'shrink-0 rounded-full border border-emerald-400/20 bg-black/50 font-mono text-white/90 uppercase backdrop-blur-md font-semibold select-none',
                isDesktop
                  ? 'px-2.5 py-1 text-[9px] tracking-[0.22em]'
                  : 'px-2 py-1 text-[8px] tracking-[0.20em] sm:px-2.5 sm:text-[9px] sm:tracking-[0.22em]'
              )}
            >
              <span
                className="mr-1.5 inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.85)]"
                aria-hidden="true"
              />
              Staff+
            </span>
          </div>

          {/* Bottom Metadata Row: Architecture Stack + Location Core */}
          <div
            className={cn(
              'absolute z-[4] flex justify-between items-end',
              isDesktop
                ? 'inset-x-5 bottom-5 gap-3'
                : 'inset-x-4 bottom-4 gap-3 sm:inset-x-5 sm:bottom-5 sm:gap-3'
            )}
          >
            <div
              className={cn('min-w-0', isDesktop ? 'max-w-[72%]' : 'max-w-[64%] sm:max-w-[72%]')}
            >
              <span
                className={cn(
                  'block font-mono text-white/50 uppercase font-semibold',
                  isDesktop
                    ? 'text-[9px] tracking-[0.30em]'
                    : 'text-[8px] tracking-[0.22em] sm:text-[9px] sm:tracking-[0.30em]'
                )}
              >
                Architecture Stack
              </span>
              <span
                className={cn(
                  'mt-1 block font-mono text-white/85 uppercase font-medium tracking-[0.16em]',
                  isDesktop
                    ? 'truncate text-[10px]'
                    : 'text-[9px] leading-tight break-words whitespace-normal sm:text-[10px]'
                )}
              >
                Node.js · Java · ML Infra · Next.js 15
              </span>
            </div>

            <span
              className={cn(
                'shrink-0 font-mono text-white/55 uppercase font-semibold select-none',
                isDesktop
                  ? 'text-[9px] tracking-[0.24em]'
                  : 'text-[8px] tracking-[0.20em] sm:text-[9px] sm:tracking-[0.24em]'
              )}
            >
              Lagos · UTC+1
            </span>
          </div>
        </div>
      </m.figure>
    </>
  );
}
