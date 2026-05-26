'use client';

// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// IdentityCard — Luxury operating-system identity card portrait
//
// CHANGELOG v2026.8:
//
//   FIX 9: Headshot image visibility restored.
//     Root cause: the useEffect at line 56–60 (v2026.7) fired after mount and
//     reset `portraitReady` to false — even if the browser had already fired
//     `onLoad` for a cached image. Since the browser never re-fires `onLoad`
//     for the same src, the image stayed at `opacity-0` permanently.
//
//     Fix: (a) removed the variant-triggered useEffect entirely — mobile and
//     desktop instances are separate mounts, (b) added a ref callback that
//     checks `img.complete` synchronously on DOM attachment as a fallback for
//     cached images where `onLoad` fires before React's handler attaches,
//     (c) `onLoad` still works as the primary async handler.
//
//   FIX 10: Removed conflicting `[transform-style:preserve-3d]` from className.
//     The inline `style={{ transformStyle: ... }}` is the single source of truth.
//     The Tailwind class was a specificity hazard that competed with both the
//     inline style and the globals.css `@media (max-width: 1023px)` override.
//
//   FIX 11: Removed `backfaceVisibility: 'hidden'` from the img inline style.
//     With mobile transform-style set to 'flat', backface-visibility has no
//     effect. Removing it eliminates a potential iOS WebKit compositing edge
//     case where hidden-backface interacts unexpectedly with ancestor 3D
//     context changes during scroll/animation.
//
//   FIX 12: Added subtle loading shimmer to the portrait area. While the image
//     loads, a gentle animated gradient sweep plays across the card center.
//     This transforms the blank-card state from "broken" to "developing" — a
//     premium photo-reveal moment when the portrait fades in.

import { m, useReducedMotion } from 'framer-motion';
import { useCallback, useRef, useState } from 'react';

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

  const [portraitIndex, setPortraitIndex] = useState(0);
  const [portraitReady, setPortraitReady] = useState(false);
  const [portraitFailed, setPortraitFailed] = useState(false);

  // FIX 9: Track the actual img element to detect cached-image loads.
  // When a browser serves an image from memory/disk cache, `onLoad` can fire
  // synchronously during element creation — before React attaches the handler.
  // The callback ref checks `img.complete` as a sync fallback.
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

  // Callback ref: fires when the <img> DOM node mounts.
  // Checks `img.complete && img.naturalWidth > 0` to catch cached images
  // whose `onLoad` fired before React could attach the handler.
  const imgRef = useCallback(
    (node: HTMLImageElement | null) => {
      if (node && node.complete && node.naturalWidth > 0 && !imgReadyRef.current) {
        handleLoad();
      }
    },
    [handleLoad]
  );

  const portraitSrc = PORTRAIT_SOURCES[portraitIndex];

  return (
    <m.figure
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12, scale: 0.985 }}
      animate={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0, scale: 1 }}
      whileHover={
        isDesktop && !shouldReduceMotion
          ? {
              scale: 1.012,
              rotateX: -2,
              rotateY: 2,
              transition: { type: 'spring', stiffness: 240, damping: 22 },
            }
          : undefined
      }
      transition={
        shouldReduceMotion ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
      }
      aria-label="Luxury operating-system identity card portrait"
      className={cn(
        // FIX 10: removed [transform-style:preserve-3d] — inline style is SoT
        'relative isolate transform-gpu overflow-visible will-change-transform',
        isDesktop
          ? 'w-full max-w-[17rem] min-w-[14rem] self-center xl:max-w-[18rem]'
          : 'w-full max-w-52 min-w-40 self-center sm:max-w-56 md:max-w-60 lg:hidden',
        className
      )}
      style={{ transformStyle: isDesktop ? 'preserve-3d' : 'flat' }}
    >
      {/* Ambient glow behind the card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-4 -z-10 rounded-[2rem] bg-[radial-gradient(circle_at_50%_38%,rgba(56,189,248,0.18),transparent_60%),radial-gradient(circle_at_70%_22%,rgba(255,255,255,0.08),transparent_35%)] blur-3xl"
      />

      {/* Card frame */}
      <div className="relative isolate aspect-[4/5] w-full overflow-hidden rounded-[36px] border border-white/12 bg-[oklch(16%_0.015_255_/_0.94)] shadow-[0_26px_72px_rgba(0,0,0,0.58),0_0_0_1px_rgba(255,255,255,0.06)]">
        {/* Decorative overlays — intentionally z-[1]+ above the image */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.06)_12%,transparent_32%,transparent_70%,rgba(0,0,0,0.58)_100%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] [background-image:linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:100%_3px] opacity-70 mix-blend-overlay"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.12),transparent_28%),radial-gradient(circle_at_52%_82%,rgba(56,189,248,0.1),transparent_56%)]"
        />
        {/* Top edge highlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.34),transparent)]"
        />
        {/* Bottom vignette */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-16 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.36))]"
        />

        {/* FIX 12: Loading shimmer — visible only while image loads */}
        {!portraitReady && !portraitFailed && (
          <div
            aria-hidden="true"
            className={cn(
              'absolute inset-0 overflow-hidden',
              shouldReduceMotion && 'hidden'
            )}
          >
            <div
              className="absolute inset-0 animate-[portrait-shimmer_2.4s_ease-in-out_infinite] bg-[length:200%_100%]"
              style={{
                backgroundImage:
                  'linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.04) 37%, rgba(56,189,248,0.06) 50%, rgba(255,255,255,0.04) 63%, transparent 75%)',
              }}
            />
          </div>
        )}

        {/* Portrait image */}
        {!portraitFailed ? (
          <img
            ref={imgRef}
            src={portraitSrc}
            alt="Oscar Ndugbu — Staff+ Full-Stack Engineer, Lagos"
            loading="eager"
            decoding="async"
            draggable={false}
            onLoad={handleLoad}
            onError={handleError}
            className={cn(
              'absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out',
              portraitReady ? 'opacity-100' : 'opacity-0',
              isDesktop ? 'object-[50%_14%]' : 'object-[50%_18%]'
            )}
            // FIX 11: backfaceVisibility removed — no purpose with flat transform-style
          />
        ) : (
          <PortraitFallback isDesktop={isDesktop} />
        )}

        {/* Inner ring */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[3] rounded-[36px] ring-1 ring-white/10 ring-inset"
        />

        {/* Top badge row: System ID + Staff+ pill */}
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

        {/* Bottom badge row: Engineering Access + Location */}
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
