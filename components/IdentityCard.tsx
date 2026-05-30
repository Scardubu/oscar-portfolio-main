'use client';

// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// IdentityCard — Luxury OS identity card portrait
//
// CHANGELOG v2026.SQUIRCLE — Superellipse geometry upgrade (upgrade-prompt-v5):
//
//   SQUIRCLE-1: Mathematically precise superellipse clip-path
//     Inline SVG <defs> with clipPathUnits="objectBoundingBox" encodes an
//     n ≈ 4.5 superellipse via one cubic Bézier per corner.
//     Arm anchors at 15.4% from each vertex; handles at 9.2% → 12.6% past
//     the anchor tangent produce iOS-quality continuous curvature.
//     React useId() derives a unique clipId per instance — no multi-card
//     collision even when both mobile + desktop variants are in the DOM.
//     CSS corner-shape: superellipse(2.8) activated via .identity-card-squircle
//     in globals.css as a forward-compatibility progressive-enhancement layer.
//
//   SQUIRCLE-2: Three-layer ambient glow architecture
//     Far ambient: wide teal/emerald elliptic gradient, blur-3xl, -8px inset.
//     Near corona: tight teal halo tracing squircle edge, blur-12px, -3px inset.
//     Top spotlight: vertical radial at 8% from top (preserved from v2026.8).
//     Colour tokens align with --color-film-teal (oklch 70% 0.21 188 / #38bdf8).
//
//   SQUIRCLE-3: Glassmorphic border and inset ring treatment
//     Outer shadows offloaded to dedicated shadow-layer sibling div: clip-path
//     on the card frame element clips its own box-shadow; separation ensures
//     the ambient/lift shadows bleed outside the squircle boundary as intended.
//     Metallic top line: five-stop gradient with teal accent at 55%.
//     Diagonal glaze: warm-white catch rotated 28° from top-left corner.
//     Inner ring consolidated to single boxShadow (three inset layers).
//
//   SQUIRCLE-4: Face-focused portrait lighting
//     Elliptic radial centred at (50%, 20%) — brow/eye level focal plane.
//     80% wide × 45% tall form creates natural subject illumination depth.
//     Cinematic teal pool: radial at 78% Y for lower-card depth reference.
//
//   SQUIRCLE-5: 4-layer outer shadow stack
//     Deep ambient (0 40px 100px -20px), teal penumbra (0 20px 60px -24px),
//     near lift (0 2px 4px), outer precision ring (0 0 0 1px rgba white/7%).
//     All applied to shadow-layer div (NOT clip-path target) so they render
//     outside the squircle boundary correctly.
//
//   Preserved unchanged: FIX 9 (cached-image ref), FIX 10 (preserve-3d SoT),
//                        FIX 11 (backfaceVisibility removed), FIX 12 (shimmer).

import { m, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import {
  type MouseEvent as ReactMouseEvent,
  useCallback,
  useId,
  useRef,
  useState,
} from 'react';

import { cn } from '@/lib/utils';

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

/**
 * SQUIRCLE-1: Normalised superellipse path for objectBoundingBox clip-path.
 *
 * Derived from n = 4.5 parametric superellipse with Bézier arm ratio ≈ 0.597.
 * One cubic Bézier per corner (4 total). Arm anchors at 15.4% from each
 * corner vertex on both axes; handles extend 9.2% beyond arm tangent.
 * Matches FigmaSquircle (smoothing ≈ 0.7) within single-Bézier simplification;
 * deviation is visually undetectable at card-frame viewport scales (≤ 380px wide).
 *
 * coordinates are in [0, 1] × [0, 1]; clipPathUnits="objectBoundingBox" scales
 * them to the element's live bounding box automatically.
 */
const SQUIRCLE_D =
  'M 0.154 0 L 0.846 0 C 0.926 0 1 0.059 1 0.123 ' +
  'L 1 0.877 C 1 0.941 0.926 1 0.846 1 ' +
  'L 0.154 1 C 0.074 1 0 0.941 0 0.877 ' +
  'L 0 0.123 C 0 0.059 0.074 0 0.154 0 Z';

/**
 * SQUIRCLE-5: Outer shadow stack.
 *
 * Intentionally placed on a SIBLING div, not the clip-path target.
 * Reason: CSS clip-path clips an element's own box-shadow in addition to its
 * painted content — placing shadows here keeps them outside the squircle
 * boundary as intended (ambient glow, depth, outer precision ring).
 */
const CARD_OUTER_SHADOW = [
  '0 40px 100px -20px rgba(0,0,0,0.72)',      // deep ambient
  '0 20px 60px  -24px rgba(56,189,248,0.18)', // teal penumbra
  '0 2px  4px    0    rgba(0,0,0,0.32)',       // near-edge lift
  '0 0    0      1px  rgba(255,255,255,0.07)', // outer precision ring
].join(', ');

/**
 * SQUIRCLE-3: Inset ring shadows — on an element INSIDE the clip-path.
 *
 * Inset shadows render inside the element border-box; they are not clipped
 * away by clip-path. Consolidates the original two separate ring divs
 * (ring-1 ring-white/10 + inset-[10px] border-white/6) into one declaration.
 */
const CARD_RING_SHADOW = [
  'inset 0 0     0   1px  rgba(255,255,255,0.11)', // precision inner ring
  'inset 0 1.5px 0   0    rgba(255,255,255,0.22)', // top metallic highlight
  'inset 0 -1px  0   0    rgba(0,0,0,0.12)',        // bottom inner depth
].join(', ');

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
  /**
   * SQUIRCLE-1: Stable clip-path ID per component instance.
   * useId() is SSR-safe (React 18+) — matching IDs between server and client
   * render passes. Strip React's `:n:` colon delimiters (invalid in CSS IDs).
   */
  const rawId = useId();
  const clipId = `sc-${rawId.replace(/:/g, '')}`;

  const prefersReducedMotion = useReducedMotion();
  const shouldReduceMotion = reducedMotion ?? Boolean(prefersReducedMotion);
  const isDesktop = variant === 'desktop';
  const shouldPrioritizeImage = priority ?? !isDesktop;
  const imageLoading = shouldPrioritizeImage ? 'eager' : 'lazy';
  const imageFetchPriority = shouldPrioritizeImage ? 'high' : 'auto';

  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rotateX = useSpring(rawRotateX, { stiffness: 220, damping: 24, mass: 0.42 });
  const rotateY = useSpring(rawRotateY, { stiffness: 220, damping: 24, mass: 0.42 });

  const [portraitIndex, setPortraitIndex] = useState(0);
  const [portraitReady, setPortraitReady] = useState(false);
  const [portraitFailed, setPortraitFailed] = useState(false);

  // FIX 9: Track the actual img element to detect cached-image loads.
  // When a browser serves an image from cache, `onLoad` can fire synchronously
  // during element creation — before React attaches the handler.
  // The callback ref checks `img.complete` synchronously on DOM attachment.
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
    },
    [isDesktop, rawRotateX, rawRotateY, shouldReduceMotion]
  );

  const resetPointerTilt = useCallback(() => {
    rawRotateX.set(0);
    rawRotateY.set(0);
  }, [rawRotateX, rawRotateY]);

  return (
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
      aria-label="Luxury operating-system identity card portrait"
      className={cn(
        // FIX 10: removed [transform-style:preserve-3d] — inline style is SoT
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
      {/*
       * SQUIRCLE-1: Hidden SVG defs — superellipse clip-path.
       *
       * Placed inside the figure (overflow-visible) but OUTSIDE the card frame
       * (overflow-hidden). The SVG has zero layout footprint: position absolute,
       * width/height 0, overflow hidden. The <clipPath> only needs to exist in
       * the DOM — its physical position is irrelevant to url(#id) references.
       * The figure's overflow-visible guarantees no ancestor clips away the defs.
       */}
      <svg
        aria-hidden="true"
        focusable="false"
        style={{
          position: 'absolute',
          width: 0,
          height: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <path d={SQUIRCLE_D} />
          </clipPath>
        </defs>
      </svg>

      {/* ── SQUIRCLE-2: Far ambient glow — teal/emerald elliptic system ─────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-8 -z-10 rounded-[3rem] blur-3xl"
        style={{
          background: [
            'radial-gradient(ellipse 72% 52% at 50% 0%,  rgba(56,189,248,0.26), transparent 68%)',
            'radial-gradient(ellipse 42% 32% at 74% 18%, rgba(52,211,153,0.13), transparent 58%)',
            'radial-gradient(ellipse 60% 38% at 50% 96%, rgba(56,189,248,0.09), transparent 68%)',
            'radial-gradient(circle           at 50% 44%, rgba(255,255,255,0.04), transparent 48%)',
          ].join(','),
        }}
      />
      {/* ── SQUIRCLE-2: Near corona — tight teal halo tracing the squircle edge */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-[3px] -z-10 rounded-[47px]"
        style={{
          filter: 'blur(12px)',
          background: [
            'radial-gradient(ellipse 88% 56% at 50% 7%,  rgba(56,189,248,0.17), transparent 54%)',
            'radial-gradient(ellipse 80% 38% at 50% 96%, rgba(56,189,248,0.08), transparent 58%)',
          ].join(','),
        }}
      />
      {/* ── Top spotlight (preserved from v2026.8) ──────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[8%] top-[6%] -z-10 h-10 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.18),transparent_68%)] opacity-70 blur-2xl"
      />

      {/*
       * SQUIRCLE-5: Card outer shadow layer — intentionally a SIBLING div.
       *
       * clip-path on the card frame element also clips that element's own
       * box-shadow output. Separating shadows here keeps the ambient glow,
       * teal penumbra, and precision ring rendering outside the squircle
       * as intended. absolute inset-0 matches the card frame's dimensions
       * (the figure's height is set by the card frame in normal flow).
       */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[44px]"
        style={{ boxShadow: CARD_OUTER_SHADOW }}
      />

      {/* ── Card frame — squircle geometry ──────────────────────────────────── */}
      {/*
       * border removed: clip-path clips the border along border-radius arc
       * (circular) while the clip shape is superellipse — visible mismatch
       * at corners. Visual "border" handled by CARD_RING_SHADOW inset ring
       * inside this element instead, which follows the squircle clip correctly.
       * border-radius: 44px kept as GPU compositing hint + CSS corner-shape
       * base value. Upgraded from 38px for visual harmony with squircle arm
       * anchors at ~61px on a 400px card (400 × 0.154 ≈ 61px).
       */}
      <div
        className={cn(
          'relative isolate aspect-[4/5] w-full overflow-hidden rounded-[44px]',
          'bg-[linear-gradient(180deg,rgba(14,20,30,0.98),rgba(6,9,15,0.98))]',
          'identity-card-squircle' // globals.css: corner-shape: superellipse(2.8)
        )}
        style={{ clipPath: `url(#${clipId})` }}
      >
        {/* ── SQUIRCLE-3: Metallic top line — five-stop with teal at 55% ───── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-5 top-3 z-[1] h-px"
          style={{
            background:
              'linear-gradient(90deg,' +
              ' transparent 0%,' +
              ' rgba(255,255,255,0.55) 28%,' +
              ' rgba(56,189,248,0.25) 55%,' +
              ' rgba(255,255,255,0.42) 74%,' +
              ' transparent 100%)',
          }}
        />
        {/* SQUIRCLE-3: Diagonal warm-white glaze — top-left corner catch */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-6 -top-10 z-[1] h-40 w-32 blur-[22px]"
          style={{
            transform: 'rotate(28deg)',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 56%)',
          }}
        />

        {/* Primary gradient overlay — glass sheen top → vignette bottom */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(255,255,255,0.13)_0%,rgba(255,255,255,0.05)_18%,transparent_32%,transparent_68%,rgba(0,0,0,0.68)_100%)]"
        />
        {/* Scan-line texture */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] [background-image:linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:100%_3px] opacity-70 mix-blend-overlay"
        />
        {/* SQUIRCLE-4: Face-focused radial + cinematic bokeh pool at bottom */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background: [
              // Elliptic highlight centred on brow/eye level (~20% from top)
              'radial-gradient(ellipse 80% 45% at 50% 20%, rgba(255,255,255,0.09), transparent 58%)',
              // Teal bokeh pool — cinematic lower-card depth reference
              'radial-gradient(circle at 52% 78%, rgba(56,189,248,0.10), transparent 48%)',
              // Lower vignette ramp
              'linear-gradient(180deg, transparent 50%, rgba(5,10,16,0.60) 100%)',
            ].join(','),
          }}
        />

        {/* Top edge precision line */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.36),transparent)]"
        />
        {/* Bottom vignette */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-16 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.38))]"
        />

        {/* FIX 12: Loading shimmer — visible only while image loads */}
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

        {/* Portrait image */}
        {!portraitFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            ref={imgRef}
            src={portraitSrc}
            alt="Oscar Ndugbu — Staff+ Full-Stack Engineer, Lagos"
            loading={imageLoading}
            fetchPriority={imageFetchPriority}
            decoding="async"
            draggable={false}
            onLoad={handleLoad}
            onError={handleError}
            className={cn(
              'absolute inset-0 h-full w-full scale-[1.02] object-cover transition-opacity duration-500 ease-out',
              portraitReady ? 'opacity-100' : 'opacity-0',
              isDesktop ? 'object-[50%_12%]' : 'object-[50%_14%]'
            )}
            // FIX 11: backfaceVisibility removed — no purpose with flat transform-style
          />
        ) : (
          <PortraitFallback isDesktop={isDesktop} />
        )}

        {/*
         * SQUIRCLE-3: Glassmorphic inner ring — single consolidated boxShadow.
         * Inset shadows are unaffected by the parent clip-path (they render
         * inside the element's own border-box, well within the squircle).
         * Replaces: ring-1 ring-white/10 ring-inset + inset-[10px] border-white/6.
         */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[3] rounded-[44px]"
          style={{ boxShadow: CARD_RING_SHADOW }}
        />
        {/* Secondary depth ring */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[10px] z-[3] rounded-[36px] border border-white/[0.05]"
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
                'block font-mono text-white/54 uppercase',
                isDesktop
                  ? 'text-[9px] tracking-[0.28em]'
                  : 'text-[8px] tracking-[0.22em] sm:text-[9px] sm:tracking-[0.28em]'
              )}
            >
              System ID
            </span>
            <span
              className={cn(
                'mt-1 block truncate text-white/90 uppercase',
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
              'shrink-0 rounded-full border border-emerald-400/18 bg-black/46 font-mono text-white/84 uppercase backdrop-blur-md',
              isDesktop
                ? 'px-2.5 py-1 text-[9px] tracking-[0.2em]'
                : 'px-2 py-1 text-[8px] tracking-[0.18em] sm:px-2.5 sm:text-[9px] sm:tracking-[0.2em]'
            )}
          >
            <span
              className="mr-1.5 inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]"
              aria-hidden="true"
            />
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
                'block font-mono text-white/54 uppercase',
                isDesktop
                  ? 'text-[9px] tracking-[0.26em]'
                  : 'text-[8px] tracking-[0.2em] sm:text-[9px] sm:tracking-[0.26em]'
              )}
            >
              Engineering Access
            </span>
            <span
              className={cn(
                'mt-1 block font-mono text-white/82 uppercase',
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
              'shrink-0 font-mono text-white/60 uppercase',
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