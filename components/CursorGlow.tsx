"use client";

import { useEffect, useRef } from 'react';

import { useReducedMotion } from '@/hooks/useReducedMotion';

interface CursorGlowProps {
  containerRef: React.RefObject<HTMLElement | null>;
}

export function CursorGlow({ containerRef }: Readonly<CursorGlowProps>) {
  const glowRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const element = glowRef.current;
    const container = containerRef.current;

    if (!element || !container || reducedMotion) {
      return;
    }

    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    let x = 0;
    let y = 0;
    let currentX = 0;
    let currentY = 0;
    let frame = 0;

    const lerp = (start: number, end: number, amount: number) => start + (end - start) * amount;

    const tick = () => {
      currentX = lerp(currentX, x, 0.12);
      currentY = lerp(currentY, y, 0.12);
      element.style.setProperty('--gx', `${currentX}px`);
      element.style.setProperty('--gy', `${currentY}px`);
      frame = requestAnimationFrame(tick);
    };

    const onMove = (event: MouseEvent) => {
      const bounds = container.getBoundingClientRect();
      x = event.clientX - bounds.left;
      y = event.clientY - bounds.top;
      element.style.opacity = '0.7';
    };

    const onLeave = () => {
      element.style.opacity = '0';
      window.setTimeout(() => {
        element.style.opacity = '0.7';
      }, 400);
    };

    container.addEventListener('mousemove', onMove);
    container.addEventListener('mouseleave', onLeave);
    frame = requestAnimationFrame(tick);

    return () => {
      container.removeEventListener('mousemove', onMove);
      container.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(frame);
    };
  }, [containerRef, reducedMotion]);

  return <div ref={glowRef} className="cursor-glow opacity-0" aria-hidden="true" />;
}