'use client';
// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture
// FIXED:
//   - /blog/${slug} → /writing/${slug} (blog redirects to /writing per next.config)
//   - /blog → /writing
//   - CRLF line endings removed
//   - scroll listener upgraded: passive:true, debounced ref pattern
//   - non-token color classes replaced with CSS variable references
//   - dismiss button: min-h-[44px] for touch target compliance
//   - progress bar uses CSS var tokens, not Tailwind gradient classes

import { ChevronRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useLenisScroll } from '@/hooks/useLenisScroll';

type RelatedPost = {
  title: string;
  slug: string;
  category: string;
  readTime?: string;
};

interface BlogProgressWidgetProps {
  relatedPosts: RelatedPost[];
  currentSlug: string;
}

export function BlogProgressWidget({ relatedPosts, currentSlug }: BlogProgressWidgetProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const rafRef = useRef<number | null>(null);

  const handleScroll = useCallback(() => {
    // Defer to rAF to keep scroll handler < 1ms
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const winH = window.innerHeight;
      const docH = document.documentElement.scrollHeight;
      const top = window.scrollY;
      const progress = Math.min((top / (docH - winH)) * 100, 100);

      setScrollProgress(progress);
      if (progress >= 70) setShowSuggestions(true);
    });
  }, []);

  useLenisScroll(handleScroll, [handleScroll]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const filteredPosts = relatedPosts.filter((post) => post.slug !== currentSlug).slice(0, 3);

  return (
    <>
      {/* Reading progress bar */}
      <div
        className="fixed top-0 left-0 z-50 h-[2px] w-full bg-[oklch(100%_0_0_/_0.08)]"
        aria-hidden="true"
      >
        <div
          className="relative h-full transition-[width] duration-300 ease-out"
          // eslint-disable-next-line no-restricted-syntax
          style={{
            width: `${scrollProgress}%`,
            background:
              'linear-gradient(90deg, var(--color-accent) 0%, var(--color-film-teal) 100%)',
          }}
        >
          <div className="bg-color-film-teal absolute top-0 right-0 h-2 w-2 -translate-y-1/4 animate-ping rounded-full" />
        </div>
      </div>

      {/* "Keep exploring" suggestion panel */}
      {showSuggestions && filteredPosts.length > 0 && (
        <div
          className="glass-full fixed right-4 bottom-6 z-40 w-72 rounded-[var(--radius-xl)] p-4 shadow-2xl sm:w-80"
          role="complementary"
          aria-label="Related articles"
        >
          {/* Header */}
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp className="text-color-film-teal h-4 w-4 shrink-0" aria-hidden="true" />
            <h3 className="text-color-text-primary flex-1 text-sm font-semibold">Keep exploring</h3>
            {/* FIX: min-h-[44px] touch target */}
            <button
              type="button"
              onClick={() => setShowSuggestions(false)}
              className="text-color-text-muted ml-auto flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full transition focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:outline-none"
              aria-label="Close suggestions"
            >
              <svg
                viewBox="0 0 16 16"
                className="h-4 w-4 fill-none stroke-current"
                strokeWidth="1.5"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M3 3l10 10M13 3L3 13" />
              </svg>
            </button>
          </div>

          {/* Post list */}
          <div className="space-y-2">
            {filteredPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/writing/${post.slug}`} // FIX: /blog/ → /writing/
                className="group border-color-border-subtle block rounded-[var(--radius-md)] border p-3 transition"
              >
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <p className="text-color-text-secondary line-clamp-2 text-sm font-medium transition group-hover:text-white">
                      {post.title}
                    </p>
                    <p className="text-color-text-muted mt-1 text-xs">
                      {post.category}
                      {post.readTime ? ` · ${post.readTime}` : ''}
                    </p>
                  </div>
                  <ChevronRight
                    className="text-color-text-muted mt-1 h-4 w-4 shrink-0 transition group-hover:text-white"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            ))}
          </div>

          {/* Footer CTA */}
          <div className="border-color-border-subtle mt-3 border-t pt-3">
            <Link
              href="/writing" // FIX: /blog → /writing
              className="text-color-film-teal inline-flex items-center gap-1 text-xs font-semibold transition hover:opacity-80"
            >
              View all articles
              <ChevronRight className="h-3 w-3" aria-hidden="true" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
