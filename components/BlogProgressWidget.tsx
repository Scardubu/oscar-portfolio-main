'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, TrendingUp } from "lucide-react";

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

export function BlogProgressWidget({
  relatedPosts,
  currentSlug,
}: BlogProgressWidgetProps) {
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

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [showSuggestions]);

  return (
    <>
      <div className="fixed top-0 left-0 z-50 h-1 w-full bg-white/10 backdrop-blur">
        <div
          className="relative h-full bg-gradient-to-r from-accent-primary via-cyan-400 to-blue-500 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        >
          <div className="absolute right-0 top-0 h-2 w-2 rounded-full bg-white/70 shadow-md animate-ping" />
        </div>
      </div>

      {showSuggestions && relatedPosts.length > 0 && (
        <div className="fixed bottom-6 right-6 z-40 w-80 rounded-2xl border border-white/10 bg-bg-secondary/90 p-4 shadow-2xl backdrop-blur-xl">
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent-primary" />
            <h3 className="text-sm font-semibold text-white">
              Keep exploring
            </h3>
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
                  className="group block rounded-xl border border-white/5 bg-white/5 p-3 transition hover:border-accent-primary/40 hover:bg-white/10"
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white group-hover:text-accent-primary line-clamp-2">
                        {post.title}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {post.category}
                        {post.readTime ? ` · ${post.readTime}` : ""}
                      </p>
                    </div>
                    <ChevronRight className="mt-1 h-4 w-4 text-gray-400 group-hover:text-accent-primary" />
                  </div>
                </Link>
              ))}
          </div>

          <div className="mt-3 border-t border-white/10 pt-3 text-right">
            <Link
              href="/blog"
              className="text-xs font-semibold text-accent-primary hover:text-accent-primary/80"
            >
              View all posts →
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
