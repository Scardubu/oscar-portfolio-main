'use client';

import { useState, useEffect } from "react";
import { BookOpen, X } from "lucide-react";
import Link from "next/link";

interface ReadingProgress {
  slug: string;
  title: string;
  progress: number;
  timestamp: number;
}

export function ContinueReadingBanner() {
  const [readingProgress, setReadingProgress] = useState<ReadingProgress | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("blog_reading_progress");
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

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      localStorage.removeItem("blog_reading_progress");
    } catch {
      // Ignore
    }
  };

  if (!isVisible || !readingProgress) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 z-50 md:left-auto md:right-6 md:w-96">
      <div className="rounded-2xl border border-white/20 bg-gradient-to-r from-accent-primary to-blue-600 p-4 shadow-2xl shadow-accent-primary/30">
        <button
          onClick={handleDismiss}
          className="absolute right-3 top-3 text-white/80 transition hover:text-white"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-3">
          <BookOpen className="mt-1 h-6 w-6 flex-shrink-0 text-white" />
          <div className="flex-1">
            <p className="mb-1 text-sm font-semibold text-white">Pick up where you left off</p>
            <p className="mb-2 line-clamp-2 text-sm text-white/90">{readingProgress.title}</p>

            <div className="mb-3 h-2 rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white transition-all duration-500"
                style={{ width: `${readingProgress.progress}%` }}
              />
            </div>

            <Link
              href={`/blog/${readingProgress.slug}`}
              className="inline-flex items-center gap-2 text-sm font-bold text-white hover:underline"
            >
              Continue reading ({Math.round(readingProgress.progress)}% complete) →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
