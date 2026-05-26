'use client';

import { m, useReducedMotion } from 'framer-motion';
import Image from 'next/image';

import { cn } from '@/lib/utils';

export type IdentityCardVariant = 'mobile' | 'desktop';

interface IdentityCardProps {
  variant: IdentityCardVariant;
  className?: string;
  reducedMotion?: boolean;
}

const CARD_SIZES = {
  mobile: '(max-width: 389px) 78vw, (max-width: 639px) 72vw, (max-width: 1023px) 18rem, 18rem',
  desktop: '(min-width: 1536px) 18rem, (min-width: 1280px) 17rem, (min-width: 1024px) 16rem, 18rem',
} as const;

export function IdentityCard({ variant, className, reducedMotion }: Readonly<IdentityCardProps>) {
  const prefersReducedMotion = useReducedMotion();
  const shouldReduceMotion = reducedMotion ?? Boolean(prefersReducedMotion);
  const isDesktop = variant === 'desktop';
  const sizes = CARD_SIZES[variant];

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
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Luxury operating-system identity card portrait"
      className={cn(
        'relative isolate transform-gpu overflow-visible will-change-transform',
        isDesktop
          ? 'w-full max-w-[17rem] min-w-[14rem] self-center xl:max-w-[18rem]'
          : 'w-[min(78vw,18rem)] max-w-[18rem] self-center lg:hidden',
        className
      )}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-4 -z-10 rounded-[2rem] bg-[radial-gradient(circle_at_50%_38%,rgba(56,189,248,0.18),transparent_60%),radial-gradient(circle_at_70%_22%,rgba(255,255,255,0.08),transparent_35%)] blur-3xl"
      />

      <div className="relative isolate aspect-[4/5] w-full overflow-hidden rounded-[36px] border border-white/12 bg-[oklch(16%_0.015_255_/_0.94)] shadow-[0_26px_72px_rgba(0,0,0,0.58),0_0_0_1px_rgba(255,255,255,0.06)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.06)_12%,transparent_32%,transparent_70%,rgba(0,0,0,0.58)_100%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] opacity-70 mix-blend-overlay [background-image:linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:100%_3px]"
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
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-16 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.36))]"
        />

        <Image
          src="/headshot.webp"
          alt="Oscar Ndugbu — Staff+ Full-Stack Engineer, Lagos"
          fill
          sizes={sizes}
          quality={90}
          draggable={false}
          priority
          className={cn('object-cover', isDesktop ? 'object-[50%_14%]' : 'object-[50%_18%]')}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[3] rounded-[36px] ring-1 ring-inset ring-white/10"
        />

        <div className="absolute inset-x-4 top-4 z-[4] flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="block font-mono text-[9px] tracking-[0.28em] text-white/46 uppercase">
              System ID
            </span>
            <span className="mt-1 block truncate text-[11px] tracking-[0.24em] text-white/86 uppercase">
              Oscar Ndugbu
            </span>
          </div>

          <span className="shrink-0 rounded-full border border-white/12 bg-black/45 px-2.5 py-1 font-mono text-[9px] tracking-[0.2em] text-white/80 uppercase backdrop-blur-md">
            Staff+
          </span>
        </div>

        <div className="absolute inset-x-4 bottom-4 z-[4] flex items-end justify-between gap-3">
          <div className="min-w-0 max-w-[70%]">
            <span className="block font-mono text-[9px] tracking-[0.26em] text-white/46 uppercase">
              Engineering Access
            </span>
            <span className="mt-1 block truncate font-mono text-[10px] tracking-[0.18em] text-white/78 uppercase">
              Full-Stack · Java · Next.js 15
            </span>
          </div>

          <span className="shrink-0 font-mono text-[9px] tracking-[0.22em] text-white/56 uppercase">
            Lagos · UTC+1
          </span>
        </div>
      </div>
    </m.figure>
  );
}
