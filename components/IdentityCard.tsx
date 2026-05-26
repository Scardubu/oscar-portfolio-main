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
  mobile: '(max-width: 639px) 208px, (max-width: 767px) 224px, (max-width: 1023px) 240px, 192px',
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
          : 'w-full max-w-52 min-w-40 self-center sm:max-w-56 md:max-w-60 lg:hidden',
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

        <div
          className={cn(
            'absolute z-[4] flex items-start justify-between',
            isDesktop ? 'inset-x-4 top-4 gap-3' : 'inset-x-3.5 top-3.5 gap-2.5 sm:inset-x-4 sm:top-4 sm:gap-3'
          )}
        >
          <div className="min-w-0">
            <span
              className={cn(
                'block font-mono uppercase text-white/46',
                isDesktop ? 'text-[9px] tracking-[0.28em]' : 'text-[8px] tracking-[0.22em] sm:text-[9px] sm:tracking-[0.28em]'
              )}
            >
              System ID
            </span>
            <span
              className={cn(
                'mt-1 block truncate uppercase text-white/86',
                isDesktop ? 'text-[11px] tracking-[0.24em]' : 'text-[10px] tracking-[0.18em] sm:text-[11px] sm:tracking-[0.24em]'
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
                'block font-mono uppercase text-white/46',
                isDesktop ? 'text-[9px] tracking-[0.26em]' : 'text-[8px] tracking-[0.2em] sm:text-[9px] sm:tracking-[0.26em]'
              )}
            >
              Engineering Access
            </span>
            <span
              className={cn(
                'mt-1 block font-mono uppercase text-white/78',
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
              'shrink-0 font-mono uppercase text-white/56',
              isDesktop ? 'text-[9px] tracking-[0.22em]' : 'text-[8px] tracking-[0.18em] sm:text-[9px] sm:tracking-[0.22em]'
            )}
          >
            Lagos · UTC+1
          </span>
        </div>
      </div>
    </m.figure>
  );
}
