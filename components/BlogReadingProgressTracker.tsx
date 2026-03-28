'use client';

import { useEffect, useRef } from "react";

interface BlogReadingProgressTrackerProps {
  slug: string;
  title: string;
}

export function BlogReadingProgressTracker({ slug, title }: BlogReadingProgressTrackerProps) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const trackProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = Math.round((scrollTop / (documentHeight - windowHeight)) * 100);

      // Only save if between 20-90%
      if (progress >= 20 && progress <= 90) {
        try {
          localStorage.setItem(
            "blog_reading_progress",
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
          localStorage.removeItem("blog_reading_progress");
        } catch {
          // Ignore
        }
      }
    };

    const handleScroll = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // Debounce: save progress 2 seconds after scrolling stops
      timeoutRef.current = setTimeout(trackProgress, 2000);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [slug, title]);

  return null;
}
