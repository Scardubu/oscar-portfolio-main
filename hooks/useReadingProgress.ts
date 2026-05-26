'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useLenisScroll } from '@/hooks/useLenisScroll';
import { clamp } from '@/lib/utils';

export function useReadingProgress(): number {
  const [progress, setProgress] = useState(0);
  const frameRef = useRef(0);

  const update = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (docHeight <= 0) {
      setProgress(0);
      return;
    }

    setProgress(clamp(scrollTop / docHeight, 0, 1));
  }, []);

  const onScroll = useCallback(() => {
    cancelAnimationFrame(frameRef.current);
    frameRef.current = window.requestAnimationFrame(update);
  }, [update]);

  useLenisScroll(onScroll);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return progress;
}
