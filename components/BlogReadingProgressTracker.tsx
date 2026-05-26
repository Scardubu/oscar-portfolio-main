'use client';

import { useCallback, useEffect, useRef } from 'react';

import { useLenisScroll } from '@/hooks/useLenisScroll';

interface BlogReadingProgressTrackerProps {
  slug: string;
  title: string;
}

export function BlogReadingProgressTracker({ slug, title }: BlogReadingProgressTrackerProps) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trackProgress = useCallback(() => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    const progress = Math.round((scrollTop / (documentHeight - windowHeight)) * 100);

    // Only save if between 20-90%
    if (progress >= 20 && progress <= 90) {
      try {
        localStorage.setItem(
          'blog_reading_progress',
          JSON.stringify({
            slug,
            title,
            progress,
            timestamp: Date.now(),
          })
        );
      } catch {
        // Ignore localStorage errors
      }
    }

    // Clear progress if user finished reading
    if (progress > 90) {
      try {
        localStorage.removeItem('blog_reading_progress');
      } catch {
        // Ignore
      }
    }
  }, [slug, title]);

  const handleScroll = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Debounce: save progress 2 seconds after scrolling stops
    timeoutRef.current = setTimeout(trackProgress, 2000);
  }, [trackProgress]);

  useLenisScroll(handleScroll);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return null;
}
