'use client';

/**
 * components/ui/LiquidGlassCard.tsx
 * ──────────────────────────────────────────────────────────────────────────
 * Reusable liquid glass container. Wraps any content in the specular
 * refraction effect defined in globals.css.
 * ──────────────────────────────────────────────────────────────────────────
 */

import { type CSSProperties, type ReactNode, forwardRef, useId, useState } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { LiquidGlassRefractionSVG } from '@/app/components/LiquidGlassRefractionSVG';
import { cn } from '@/lib/utils';

type Variant = 'default' | 'cyan' | 'violet' | 'teal';
type Depth = 'default' | 'deep' | 'ultra';

interface LiquidGlassCardProps extends HTMLMotionProps<'div'> {
  variant?: Variant;
  depth?: Depth;
  interactive?: boolean;
  noPad?: boolean;
  as?: 'div' | 'article' | 'section' | 'li';
  refraction?: boolean;
  children?: ReactNode;
}

type PointerStyle = CSSProperties & {
  '--mouse-x': string;
  '--mouse-y': string;
};

const variantClass: Record<Variant, string> = {
  default: 'liquid-glass',
  cyan: 'liquid-glass-cyan',
  violet: 'liquid-glass-violet',
  teal: 'liquid-glass-teal',
};

const depthClass: Record<Depth, string> = {
  default: '',
  deep: 'liquid-depth-layer',
  ultra: 'liquid-depth-layer [--glass-thickness:1.18]',
};

export const LiquidGlassCard = forwardRef<HTMLDivElement, LiquidGlassCardProps>(
  (
    {
      variant = 'default',
      depth = 'default',
      interactive = false,
      noPad = false,
      refraction = true,
      className,
      children,
      onPointerMove,
      onPointerLeave,
      style,
      ...motionProps
    },
    ref
  ) => {
    const filterId = useId().replace(/:/g, '-');
    const [pointerStyle, setPointerStyle] = useState<PointerStyle>({
      '--mouse-x': '50%',
      '--mouse-y': '40%',
    });

    const handlePointerMove: NonNullable<HTMLMotionProps<'div'>['onPointerMove']> = (event) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;

      setPointerStyle({
        '--mouse-x': `${x}%`,
        '--mouse-y': `${y}%`,
      });

      onPointerMove?.(event);
    };

    const handlePointerLeave: NonNullable<HTMLMotionProps<'div'>['onPointerLeave']> = (event) => {
      setPointerStyle({
        '--mouse-x': '50%',
        '--mouse-y': '40%',
      });

      onPointerLeave?.(event);
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          variantClass[variant],
          depthClass[depth],
          'mouse-refraction',
          interactive && 'liquid-glass-hover cursor-pointer',
          !noPad && 'p-[var(--bento-pad)]',
          className
        )}
        style={{ ...pointerStyle, ...style }}
        onPointerMove={interactive ? handlePointerMove : onPointerMove}
        onPointerLeave={interactive ? handlePointerLeave : onPointerLeave}
        {...motionProps}
      >
        {refraction ? (
          <>
            <LiquidGlassRefractionSVG filterId={filterId} mode="defs" scale={18} />
            <LiquidGlassRefractionSVG
              filterId={filterId}
              mode="overlay"
              className="liquid-glass-refraction"
              scale={18}
            />
          </>
        ) : null}
        <div className="relative z-[1]">{children}</div>
      </motion.div>
    );
  }
);

LiquidGlassCard.displayName = 'LiquidGlassCard';

export default LiquidGlassCard;
