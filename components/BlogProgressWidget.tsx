'use client';
// components/BlogProgressWidget.tsx — CONVICTION ENGINE v21.1
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
import { useEffect, useRef, useState } from 'react';

type RelatedPost = {
  title:     string;
  slug:      string;
  category:  string;
  readTime?: string;
};

interface BlogProgressWidgetProps {
  relatedPosts: RelatedPost[];
  currentSlug:  string;
}

export function BlogProgressWidget({ relatedPosts, currentSlug }: BlogProgressWidgetProps) {
  const [scrollProgress,    setScrollProgress]    = useState(0);
  const [showSuggestions,   setShowSuggestions]   = useState(false);
  const rafRef                                     = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Defer to rAF to keep scroll handler < 1ms
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const winH  = window.innerHeight;
        const docH  = document.documentElement.scrollHeight;
        const top   = window.scrollY;
        const progress = Math.min((top / (docH - winH)) * 100, 100);

        setScrollProgress(progress);
        if (progress >= 70) setShowSuggestions(true);
      });
    };

    // FIX: passive:true — eliminates scroll jank, required by Lighthouse
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const filteredPosts = relatedPosts
    .filter((post) => post.slug !== currentSlug)
    .slice(0, 3);

  return (
    <>
      {/* Reading progress bar */}
      <div
        className="fixed top-0 left-0 z-50 h-[2px] w-full"
        style={{ background: 'oklch(100% 0 0 / 0.08)' }}
        aria-hidden="true"
      >
        <div
          className="relative h-full transition-[width] duration-300 ease-out"
          style={{
            width: `${scrollProgress}%`,
            background:
              'linear-gradient(90deg, var(--color-accent) 0%, var(--color-film-teal) 100%)',
          }}
        >
          <div
            className="absolute top-0 right-0 h-2 w-2 -translate-y-1/4 rounded-full animate-ping"
            style={{ background: 'var(--color-film-teal)' }}
          />
        </div>
      </div>

      {/* "Keep exploring" suggestion panel */}
      {showSuggestions && filteredPosts.length > 0 && (
        <div
          className="glass-full fixed right-4 bottom-6 z-40 w-72 sm:w-80 rounded-[var(--radius-xl)] p-4 shadow-2xl"
          role="complementary"
          aria-label="Related articles"
        >
          {/* Header */}
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp
              className="h-4 w-4 shrink-0"
              style={{ color: 'var(--color-film-teal)' }}
              aria-hidden="true"
            />
            <h3
              className="text-sm font-semibold flex-1"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Keep exploring
            </h3>
            {/* FIX: min-h-[44px] touch target */}
            <button
              type="button"
              onClick={() => setShowSuggestions(false)}
              className="ml-auto flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              style={{ color: 'var(--color-text-muted)' }}
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
                href={`/writing/${post.slug}`}  // FIX: /blog/ → /writing/
                className="group block rounded-[var(--radius-md)] border p-3 transition"
                style={{ borderColor: 'var(--color-border-subtle)' }}
              >
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <p
                      className="line-clamp-2 text-sm font-medium transition group-hover:text-white"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {post.title}
                    </p>
                    <p
                      className="mt-1 text-xs"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      {post.category}
                      {post.readTime ? ` · ${post.readTime}` : ''}
                    </p>
                  </div>
                  <ChevronRight
                    className="mt-1 h-4 w-4 shrink-0 transition group-hover:text-white"
                    style={{ color: 'var(--color-text-muted)' }}
                    aria-hidden="true"
                  />
                </div>
              </Link>
            ))}
          </div>

          {/* Footer CTA */}
          <div
            className="mt-3 border-t pt-3"
            style={{ borderColor: 'var(--color-border-subtle)' }}
          >
            <Link
              href="/writing"  // FIX: /blog → /writing
              className="inline-flex items-center gap-1 text-xs font-semibold transition hover:opacity-80"
              style={{ color: 'var(--color-film-teal)' }}
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