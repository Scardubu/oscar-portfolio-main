'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { useReducedMotion } from './useReducedMotion';

interface ScrollRevealOptions {
  threshold?:  number;
  rootMargin?: string;
  once?:       boolean;
  className?:  string;
}

/**
 * useScrollReveal
 * Attaches IntersectionObserver to a ref, adding `className` (default
 * 'is-visible') when the element enters the viewport.
 *
 * Mobile tuning: threshold 0.06 (vs 0.12 desktop) — elements at the bottom
 * of a small viewport are often only partially visible before the user would
 * naturally consider them "in view".
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: ScrollRevealOptions = {}
): RefObject<T | null> {
  const {
    threshold  = 0.06,
    rootMargin = '0px 0px -32px 0px',
    once       = true,
    className  = 'is-visible',
  } = options;

  const ref           = useRef<T>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reducedMotion) {
      el.classList.add(className);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          el.classList.add(className);
          if (once) observer.unobserve(el);
        } else if (!once) {
          el.classList.remove(className);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once, className, reducedMotion]);

  return ref;
}