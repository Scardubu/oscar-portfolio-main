"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { blogUrl } from "@/lib/config";
import {
  formatArticleDate,
  keywordScore,
  type BlogPost,
  type TagStat,
} from "@/lib/blog-intelligence";

type SearchMode = "local" | "keyword" | "semantic";

type RankedPost = BlogPost & {
  score?: number;
  semanticScore?: number;
  lexicalScore?: number;
  reason?: string;
};

type BlogAnalyticsEvent =
  | {
      event: "page_view";
      path: string;
    }
  | {
      event: "impression";
      path: string;
      slug: string;
      tier: 1 | 2 | 3;
      mode: SearchMode;
      rank?: number;
      score?: number;
      query?: string;
      tag?: string | null;
    }
  | {
      event: "click";
      path: string;
      slug: string;
      tier: 1 | 2 | 3;
      mode: SearchMode;
      rank?: number;
      score?: number;
      query?: string;
      tag?: string | null;
    }
  | {
      event: "search";
      path: string;
      query: string;
      tag?: string | null;
      mode: SearchMode;
      resultCount: number;
      durationMs: number;
    }
  | {
      event: "tag_change";
      path: string;
      tag: string | null;
    };

function sendAnalytics(event: BlogAnalyticsEvent) {
  if (typeof window === "undefined") return;

  const payload = JSON.stringify({
    ...event,
    ts: new Date().toISOString(),
    referrer: document.referrer || null,
    userAgent: navigator.userAgent,
  });

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/blog/analytics", blob);
      return;
    }
  } catch {
    // ignore and fall back below
  }

  void fetch("/api/blog/analytics", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: payload,
    keepalive: true,
  }).catch(() => {
    // ignore analytics failures
  });
}

function normalizeQuery(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function matchesLocal(post: BlogPost, query: string, activeTag: string | null): boolean {
  const normalizedQuery = normalizeQuery(query).toLowerCase();
  const hasTag = activeTag ? post.tags.includes(activeTag) : true;

  if (!normalizedQuery) {
    return hasTag;
  }

  const haystack = [post.title, post.excerpt, post.tags.join(" ")]
    .join(" ")
    .toLowerCase();

  return hasTag && haystack.includes(normalizedQuery);
}

function localRank(posts: BlogPost[], query: string, activeTag: string | null): RankedPost[] {
  return posts
    .filter((post) => matchesLocal(post, query, activeTag))
    .map((post) => ({
      ...post,
      lexicalScore: keywordScore(query, post),
    }))
    .sort((a, b) => {
      const aScore = a.lexicalScore ?? 0;
      const bScore = b.lexicalScore ?? 0;
      if (Math.abs(aScore - bScore) > 0.0001) return bScore - aScore;

      const tierDiff = (a.tier ?? 3) - (b.tier ?? 3);
      if (tierDiff !== 0) return tierDiff;

      if ((b.featured ? 1 : 0) !== (a.featured ? 1 : 0)) {
        return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
      }

      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
}

function clampScore(value?: number): string {
  if (typeof value !== "number" || Number.isNaN(value)) return "";
  const percent = Math.max(0, Math.min(100, Math.round(value * 100)));
  return `${percent}% match`;
}

function BlogCard({
  post,
  rank,
  mode,
  query,
  activeTag,
  featured = false,
  highlight = false,
  reason,
}: {
  post: RankedPost;
  rank?: number;
  mode: SearchMode;
  query: string;
  activeTag: string | null;
  featured?: boolean;
  highlight?: boolean;
  reason?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const impressionSent = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (impressionSent.current) return;

        const visible = entries.some((entry) => entry.isIntersecting);
        if (!visible) return;

        impressionSent.current = true;
        sendAnalytics({
          event: "impression",
          path: "/blog",
          slug: post.slug,
          tier: post.tier ?? 3,
          mode,
          rank,
          score: post.score,
          query: query || undefined,
          tag: activeTag,
        });
        observer.disconnect();
      },
      {
        threshold: 0.6,
      },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [activeTag, mode, post.score, post.slug, post.tier, query, rank]);

  const scoreLabel = clampScore(post.score);
  const tierLabel =
    mode === "semantic" && rank
      ? `AI #${rank}`
      : post.tier === 1
        ? "Staff-level"
        : post.tier === 2
          ? "Architecture"
          : "Other";

  const badgeTone =
    post.tier === 1
      ? "text-[color:var(--accent-primary)] bg-cyan-950/40 border-cyan-800/40"
      : post.tier === 2
        ? "text-[color:var(--text-primary)] bg-[color:var(--bg-elevated)] border-[color:var(--border-default)]"
        : "text-[color:var(--text-muted)] bg-transparent border-[color:var(--border-subtle)]";

  const cardTone = featured
    ? "border-[color:var(--border-strong)] bg-[color:var(--bg-surface)] shadow-sm"
    : "border-[color:var(--border-default)] bg-[color:var(--bg-surface)]";

  return (
    <article
      ref={ref}
      className={`
        group rounded-2xl border transition-all duration-200
        hover:border-[color:var(--border-strong)]
        ${cardTone}
        ${highlight ? "ring-1 ring-cyan-500/20" : ""}
      `}
    >
      <Link
        href={blogUrl(post.slug)}
        className="block p-5 focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-primary)] rounded-2xl"
        onClick={() => {
          sendAnalytics({
            event: "click",
            path: "/blog",
            slug: post.slug,
            tier: post.tier ?? 3,
            mode,
            rank,
            score: post.score,
            query: query || undefined,
            tag: activeTag,
          });
        }}
        aria-label={`Read ${post.title}`}
      >
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`
                inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider
                ${badgeTone}
              `}
            >
              {tierLabel}
            </span>

            {scoreLabel ? (
              <span className="text-[10px] uppercase tracking-wider text-[color:var(--text-muted)]">
                {scoreLabel}
              </span>
            ) : null}
          </div>

          <span className="text-[10px] text-[color:var(--text-muted)]">
            {formatArticleDate(post.date)}
          </span>
        </div>

        <h3
          className={`
            font-semibold leading-snug transition-colors
            group-hover:text-[color:var(--accent-primary)]
            ${featured ? "text-base sm:text-lg" : "text-sm sm:text-[15px]"}
          `}
        >
          {post.title}
        </h3>

        <p className="mt-2 text-xs leading-relaxed text-[color:var(--text-muted)]">
          {post.excerpt}
        </p>

        {reason ? (
          <p className="mt-2 text-[11px] text-[color:var(--text-muted)] opacity-80">
            Why it matched: {reason}
          </p>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-[10px] text-[color:var(--text-muted)]">
            {post.readMin} min read
          </span>

          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[color:var(--border-subtle)] px-2 py-0.5 text-[10px] text-[color:var(--text-muted)]"
            >
              #{tag}
            </span>
          ))}
        </div>
      </Link>
    </article>
  );
}

export default function BlogListClient({
  posts,
  tagStats,
  initialQuery,
  initialTag,
}: {
  posts: BlogPost[];
  tagStats: TagStat[];
  initialQuery: string;
  initialTag: string | null;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(initialQuery);
  const [activeTag, setActiveTag] = useState<string | null>(initialTag);
  const [semanticResults, setSemanticResults] = useState<RankedPost[] | null>(null);
  const [searchMode, setSearchMode] = useState<SearchMode>("local");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const firstTagChange = useRef(true);
  const firstPageView = useRef(true);

  const normalizedQuery = normalizeQuery(query);
  const isSearchActive = normalizedQuery.length >= 2;

  useEffect(() => {
    const urlQuery = normalizeQuery(searchParams.get("q") ?? "");
    const urlTag = searchParams.get("tag") || null;

    if (urlQuery !== query) {
      setQuery(urlQuery);
    }

    if (urlTag !== activeTag) {
      setActiveTag(urlTag);
    }
  }, [activeTag, query, searchParams]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (normalizedQuery) {
      params.set("q", normalizedQuery);
    }

    if (activeTag) {
      params.set("tag", activeTag);
    }

    const nextValue = params.toString();
    const currentValue = searchParams.toString();

    if (nextValue !== currentValue) {
      router.replace(nextValue ? `?${nextValue}` : "/blog", { scroll: false });
    }
  }, [activeTag, normalizedQuery, router, searchParams]);

  useEffect(() => {
    if (firstPageView.current) {
      firstPageView.current = false;
      sendAnalytics({
        event: "page_view",
        path: "/blog",
      });
    }
  }, []);

  useEffect(() => {
    if (firstTagChange.current) {
      firstTagChange.current = false;
      return;
    }

    sendAnalytics({
      event: "tag_change",
      path: "/blog",
      tag: activeTag,
    });
  }, [activeTag]);

  useEffect(() => {
    if (!isSearchActive) {
      setSemanticResults(null);
      setSearchMode("local");
      setSearchError(null);
      setIsSearching(false);
      return;
    }

    const controller = new AbortController();
    let alive = true;
    const startedAt = performance.now();

    const timer = window.setTimeout(async () => {
      setIsSearching(true);

      try {
        const response = await fetch("/api/blog/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
          signal: controller.signal,
          body: JSON.stringify({
            query: normalizedQuery,
            tag: activeTag,
            limit: 12,
          }),
        });

        if (!response.ok) {
          throw new Error(`Search request failed with ${response.status}`);
        }

        const data = (await response.json()) as {
          mode?: SearchMode;
          results?: RankedPost[];
          durationMs?: number;
        };

        if (!alive) return;

        const results = data.results ?? [];
        setSemanticResults(results);
        setSearchMode(data.mode ?? "keyword");
        setSearchError(null);

        sendAnalytics({
          event: "search",
          path: "/blog",
          query: normalizedQuery,
          tag: activeTag,
          mode: data.mode ?? "keyword",
          resultCount: results.length,
          durationMs: data.durationMs ?? Math.round(performance.now() - startedAt),
        });
      } catch {
        if (controller.signal.aborted) return;
        if (!alive) return;

        setSemanticResults(null);
        setSearchMode("local");
        setSearchError("Semantic search is unavailable right now, so local ranking is being used.");
      } finally {
        if (alive) {
          setIsSearching(false);
        }
      }
    }, 220);

    return () => {
      alive = false;
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [activeTag, isSearchActive, normalizedQuery]);

  const localResults = useMemo(() => {
    return localRank(posts, normalizedQuery, activeTag);
  }, [activeTag, normalizedQuery, posts]);

  const displayResults = isSearchActive
    ? (semanticResults ?? localResults)
    : localResults;

  const tagCount = tagStats.reduce((sum, item) => sum + item.count, 0);
  const featuredCount = posts.filter((post) => post.tier === 1).length;
  const activeTagCount =
    activeTag === null ? 0 : tagStats.find((item) => item.tag === activeTag)?.count ?? 0;

  const tier1 = displayResults.filter((post) => post.tier === 1);
  const tier2 = displayResults.filter((post) => post.tier === 2);
  const tier3 = displayResults.filter((post) => post.tier === 3);

  const clearFilters = () => {
    setQuery("");
    setActiveTag(null);
  };

  return (
    <div className="mt-10 space-y-8">
      <section className="rounded-2xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <label
              htmlFor="blog-search"
              className="block text-xs font-semibold uppercase tracking-widest text-[color:var(--text-muted)] mb-2"
            >
              Search the archive
            </label>
            <input
              id="blog-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by topic, system, failure mode, or tag"
              className="
                w-full rounded-xl border border-[color:var(--border-default)]
                bg-[color:var(--bg-base)] px-4 py-3 text-sm
                text-[color:var(--text-primary)] outline-none
                focus:border-[color:var(--accent-primary)]
                focus:ring-2 focus:ring-[color:var(--accent-primary)]/20
              "
            />
            <p className="mt-2 text-xs text-[color:var(--text-muted)]">
              AI ranking turns on automatically once you type at least two words.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`
                inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-widest
                ${
                  isSearchActive
                    ? "border-cyan-800/50 bg-cyan-950/40 text-[color:var(--accent-primary)]"
                    : "border-[color:var(--border-default)] bg-[color:var(--bg-elevated)] text-[color:var(--text-muted)]"
                }
              `}
            >
              {searchMode === "semantic"
                ? "Semantic AI"
                : searchMode === "keyword"
                  ? "Keyword fallback"
                  : "Local filter"}
            </span>

            <button
              type="button"
              onClick={clearFilters}
              className="
                rounded-full border border-[color:var(--border-default)]
                px-3 py-1 text-[10px] font-semibold uppercase tracking-widest
                text-[color:var(--text-muted)]
                hover:border-[color:var(--border-strong)]
              "
            >
              Clear
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {tagStats.map(({ tag, count }) => {
            const isActive = activeTag === tag;

            return (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(isActive ? null : tag)}
                className={`
                  inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs transition
                  ${
                    isActive
                      ? "border-[color:var(--accent-primary)] bg-cyan-950/30 text-[color:var(--accent-primary)]"
                      : "border-[color:var(--border-default)] bg-[color:var(--bg-elevated)] text-[color:var(--text-muted)] hover:border-[color:var(--border-strong)]"
                  }
                `}
              >
                <span>#{tag}</span>
                <span className="opacity-70">{count}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--bg-base)] p-3">
            <p className="text-[10px] uppercase tracking-widest text-[color:var(--text-muted)]">
              Articles
            </p>
            <p className="mt-1 text-lg font-semibold text-[color:var(--text-primary)]">
              {posts.length}
            </p>
          </div>
          <div className="rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--bg-base)] p-3">
            <p className="text-[10px] uppercase tracking-widest text-[color:var(--text-muted)]">
              Staff-level
            </p>
            <p className="mt-1 text-lg font-semibold text-[color:var(--text-primary)]">
              {featuredCount}
            </p>
          </div>
          <div className="rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--bg-base)] p-3">
            <p className="text-[10px] uppercase tracking-widest text-[color:var(--text-muted)]">
              Active tags
            </p>
            <p className="mt-1 text-lg font-semibold text-[color:var(--text-primary)]">
              {activeTag ? activeTagCount : tagCount}
            </p>
          </div>
        </div>

        {searchError ? (
          <p className="mt-4 text-xs text-[color:var(--text-muted)]">
            {searchError}
          </p>
        ) : null}
      </section>

      {isSearchActive ? (
        <section aria-labelledby="semantic-results-heading" className="space-y-4">
          <div className="flex items-center gap-3">
            <h2
              id="semantic-results-heading"
              className="text-sm font-bold tracking-widest uppercase text-[color:var(--text-muted)]"
            >
              AI semantic matches
            </h2>
            <div className="flex-1 h-px bg-[color:var(--border-subtle)]" aria-hidden="true" />
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full text-[color:var(--accent-primary)] bg-cyan-950/40 border border-cyan-800/30">
              Ranked by relevance
            </span>
          </div>

          {isSearching ? (
            <p className="text-xs text-[color:var(--text-muted)]">
              Ranking articles…
            </p>
          ) : null}

          {displayResults.length > 0 ? (
            <div className="flex flex-col gap-3">
              {displayResults.map((post, index) => (
                <BlogCard
                  key={post.slug}
                  post={post}
                  rank={index + 1}
                  mode={searchMode}
                  query={normalizedQuery}
                  activeTag={activeTag}
                  featured={index < 2}
                  highlight={index === 0}
                  reason={post.reason}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-6">
              <p className="text-sm font-medium text-[color:var(--text-primary)]">
                No direct matches.
              </p>
              <p className="mt-1 text-xs text-[color:var(--text-muted)]">
                Broaden the query, remove the tag filter, or try a system name,
                failure mode, or technology keyword.
              </p>
            </div>
          )}
        </section>
      ) : (
        <>
          {tier1.length > 0 ? (
            <section aria-labelledby="tier-1-heading" className="space-y-4">
              <div className="flex items-center gap-3">
                <h2
                  id="tier-1-heading"
                  className="text-sm font-bold tracking-widest uppercase text-[color:var(--text-muted)]"
                >
                  Implementation Deep Dives
                </h2>
                <div className="flex-1 h-px bg-[color:var(--border-subtle)]" aria-hidden="true" />
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full text-[color:var(--accent-primary)] bg-cyan-950/40 border border-cyan-800/30">
                  Staff-level
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {tier1.map((post, index) => (
                  <BlogCard
                    key={post.slug}
                    post={post}
                    rank={index + 1}
                    mode="local"
                    query={normalizedQuery}
                    activeTag={activeTag}
                    featured
                    reason={post.reason}
                  />
                ))}
              </div>
            </section>
          ) : null}

          {tier2.length > 0 ? (
            <section aria-labelledby="tier-2-heading" className="space-y-4">
              <div className="flex items-center gap-3">
                <h2
                  id="tier-2-heading"
                  className="text-sm font-bold tracking-widest uppercase text-[color:var(--text-muted)]"
                >
                  Architecture & Context
                </h2>
                <div className="flex-1 h-px bg-[color:var(--border-subtle)]" aria-hidden="true" />
              </div>

              <div className="flex flex-col gap-3">
                {tier2.map((post) => (
                  <BlogCard
                    key={post.slug}
                    post={post}
                    mode="local"
                    query={normalizedQuery}
                    activeTag={activeTag}
                    reason={post.reason}
                  />
                ))}
              </div>
            </section>
          ) : null}

          {tier3.length > 0 ? (
            <section aria-labelledby="tier-3-heading" className="space-y-4">
              <div className="flex items-center gap-3">
                <h2
                  id="tier-3-heading"
                  className="text-sm font-bold tracking-widest uppercase text-[color:var(--text-muted)] opacity-60"
                >
                  Other Posts
                </h2>
                <div className="flex-1 h-px bg-[color:var(--border-subtle)]" aria-hidden="true" />
              </div>

              <div className="flex flex-col gap-2">
                {tier3.map((post) => (
                  <BlogCard
                    key={post.slug}
                    post={post}
                    mode="local"
                    query={normalizedQuery}
                    activeTag={activeTag}
                    reason={post.reason}
                  />
                ))}
              </div>
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}
