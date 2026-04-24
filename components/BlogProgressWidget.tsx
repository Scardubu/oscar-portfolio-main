'use client';

import { ChevronRight, TrendingUp } from "lucide-react";
import Link from 'next/link';
import { useEffect, useState } from 'react';

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

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;

      setScrollProgress(Math.min(progress, 100));

      if (progress >= 70 && !showSuggestions) {
        setShowSuggestions(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [showSuggestions]);

  return (
    <>
      <div className="fixed top-0 left-0 z-50 h-1 w-full bg-white/10 backdrop-blur">
        <div
          className="from-accent-primary relative h-full bg-gradient-to-r via-cyan-400 to-blue-500 transition-all duration-300"
          // eslint-disable-next-line no-restricted-syntax
          style={{ width: `${scrollProgress}%` }}
        >
          <div className="absolute top-0 right-0 h-2 w-2 animate-ping rounded-full bg-white/70 shadow-md" />
        </div>
      </div>

      {showSuggestions && relatedPosts.length > 0 && (
        <div className="bg-bg-secondary/90 fixed right-6 bottom-6 z-40 w-80 rounded-2xl border border-white/10 p-4 shadow-2xl backdrop-blur-xl">
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp className="text-accent-primary h-5 w-5" />
            <h3 className="text-sm font-semibold text-white">Keep exploring</h3>
            <button
              onClick={() => setShowSuggestions(false)}
              className="ml-auto text-gray-400 transition hover:text-white"
              aria-label="Close suggestions"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2">
            {relatedPosts
              .filter((post) => post.slug !== currentSlug)
              .slice(0, 3)
              .map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group hover:border-accent-primary/40 block rounded-xl border border-white/5 bg-white/5 p-3 transition hover:bg-white/10"
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <p className="group-hover:text-accent-primary line-clamp-2 text-sm font-medium text-white">
                        {post.title}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {post.category}
                        {post.readTime ? ` · ${post.readTime}` : ''}
                      </p>
                    </div>
                    <ChevronRight className="group-hover:text-accent-primary mt-1 h-4 w-4 text-gray-400" />
                  </div>
                </Link>
              ))}
          </div>

          <div className="mt-3 border-t border-white/10 pt-3">
            <Link
              href="/blog"
              className="text-accent-primary hover:text-accent-primary/80 inline-flex items-center gap-1 text-xs font-semibold"
            >
              View all posts
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
