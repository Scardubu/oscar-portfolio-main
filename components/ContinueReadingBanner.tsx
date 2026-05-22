'use client';

import { BookOpen, ChevronRight, X } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import { useReducedMotion } from '@/hooks/useReducedMotion';

interface ReadingProgress {
  slug: string;
  title: string;
  progress: number;
  timestamp: number;
}

export function ContinueReadingBanner() {
  const [readingProgress, setReadingProgress] = useState<ReadingProgress | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const reducedMotion = useReducedMotion();
  const progressValue = readingProgress ? Math.round(readingProgress.progress) : 0;

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    try {
      localStorage.removeItem('blog_reading_progress');
    } catch {
      // Ignore
    }
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('blog_reading_progress');
      if (stored) {
        const progress: ReadingProgress = JSON.parse(stored);
        const daysSince = (Date.now() - progress.timestamp) / (1000 * 60 * 60 * 24);

        // Show banner if user was between 20-90% and within 7 days
        if (progress.progress >= 20 && progress.progress <= 90 && daysSince < 7) {
          setReadingProgress(progress);
          setIsVisible(true);
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  useEffect(() => {
    if (!isVisible) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleDismiss();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDismiss, isVisible]);

  if (!isVisible || !readingProgress) return null;

  return (
    <div className="continue-reading-banner-shell fixed z-50">
      <aside
        className="from-accent-primary shadow-accent-primary/30 rounded-2xl border border-white/20 bg-gradient-to-r to-blue-600 p-4 shadow-2xl"
        aria-labelledby="continue-reading-banner-title"
        aria-describedby="continue-reading-banner-progress"
      >
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-white/80 transition hover:text-white"
          aria-label={`Dismiss continue reading prompt for ${readingProgress.title}`}
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-3">
          <BookOpen className="mt-1 h-6 w-6 flex-shrink-0 text-white" />
          <div className="flex-1">
            <p id="continue-reading-banner-title" className="mb-1 text-sm font-semibold text-white">
              Pick up where you left off
            </p>
            <p className="mb-2 line-clamp-2 pr-8 text-sm text-white/90">{readingProgress.title}</p>

            <div
              className="mb-2 h-2 rounded-full bg-white/20"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progressValue}
              aria-labelledby="continue-reading-banner-title"
              aria-describedby="continue-reading-banner-progress"
            >
              <div
                className={[
                  'h-full rounded-full bg-white',
                  reducedMotion ? '' : 'transition-all duration-300',
                ].join(' ')}
                // eslint-disable-next-line no-restricted-syntax
                style={{ width: `${readingProgress.progress}%` }}
              />
            </div>

            <p id="continue-reading-banner-progress" className="mb-3 text-xs text-white/75">
              {progressValue}% complete
            </p>

            <Link
              href={`/writing/${readingProgress.slug}`}
              className="inline-flex items-center gap-2 text-sm font-bold text-white hover:underline"
            >
              Continue reading
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
