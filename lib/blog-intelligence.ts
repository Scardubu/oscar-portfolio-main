export type BlogTier = 1 | 2 | 3;

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readMin: number;
  tags: string[];

  tier?: BlogTier;
  priority?: number;
  featured?: boolean;
  published?: boolean;

  engagementScore?: number;
  views?: number;
  clicks?: number;

  score?: number;
  semanticScore?: number;
  lexicalScore?: number;
  reason?: string;
  matchedTags?: string[];
}

export interface TagStat {
  tag: string;
  count: number;
}

export interface RankedBlogPost extends BlogPost {
  tier: BlogTier;
  score?: number;
  semanticScore?: number;
  lexicalScore?: number;
  reason?: string;
  matchedTags?: string[];
}

const TIER_1_SIGNALS = [
  "mlops",
  "production-ml",
  "reliability",
  "monitoring",
  "fastapi",
  "postgres",
  "redis",
  "performance",
  "multi-tenant",
  "audit-trail",
  "uptime",
];

const TIER_2_SIGNALS = [
  "architecture",
  "infrastructure",
  "deployment",
  "guide",
  "playbook",
  "system-design",
  "context",
];

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function resolveTier(post: Pick<BlogPost, "tier" | "tags" | "title" | "featured">): BlogTier {
  if (post.tier) return post.tier;
  if (post.featured) return 1;

  const haystack = normalizeWhitespace(`${post.title} ${post.tags.join(" ")}`).toLowerCase();

  if (TIER_1_SIGNALS.some((signal) => haystack.includes(signal))) return 1;
  if (TIER_2_SIGNALS.some((signal) => haystack.includes(signal))) return 2;

  return 3;
}

export function normalizePost(post: BlogPost): RankedBlogPost {
  return {
    ...post,
    tier: resolveTier(post),
  };
}

export function sortPosts<T extends BlogPost>(posts: T[]): Array<T & { tier: BlogTier }> {
  return [...posts]
    .sort((a, b) => {
      const tierDiff = resolveTier(a) - resolveTier(b);
      if (tierDiff !== 0) return tierDiff;

      const featuredDiff = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
      if (featuredDiff !== 0) return featuredDiff;

      const priorityDiff = (b.priority ?? 0) - (a.priority ?? 0);
      if (priorityDiff !== 0) return priorityDiff;

      const engagementDiff = (b.engagementScore ?? 0) - (a.engagementScore ?? 0);
      if (Math.abs(engagementDiff) > 0.000001) return engagementDiff;

      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .map((post) => ({
      ...post,
      tier: resolveTier(post),
    }));
}

export function buildSearchDocument(post: BlogPost): string {
  return normalizeWhitespace(`${post.title} ${post.excerpt} ${post.tags.join(" ")}`).toLowerCase();
}

export function keywordScore(query: string, post: BlogPost): number {
  const normalizedQuery = normalizeWhitespace(query).toLowerCase();
  if (!normalizedQuery) return 0;

  const queryWords = normalizedQuery.split(" ").filter((word) => word.length > 1);
  const title = post.title.toLowerCase();
  const excerpt = post.excerpt.toLowerCase();
  const tagBlob = post.tags.join(" ").toLowerCase();
  const haystack = buildSearchDocument(post);

  let score = 0;

  if (haystack.includes(normalizedQuery)) score += 0.55;
  if (title.includes(normalizedQuery)) score += 0.2;
  if (excerpt.includes(normalizedQuery)) score += 0.1;
  if (tagBlob.includes(normalizedQuery)) score += 0.1;

  const matchedTags = post.tags.filter((tag) => {
    const lowerTag = tag.toLowerCase();
    return (
      normalizedQuery.includes(lowerTag) ||
      queryWords.some((word) => lowerTag.includes(word) || word.includes(lowerTag))
    );
  });

  score += Math.min(0.15, matchedTags.length * 0.05);

  return Math.max(0, Math.min(1, score));
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i += 1) {
    const x = a[i] ?? 0;
    const y = b[i] ?? 0;
    dot += x * y;
    normA += x * x;
    normB += y * y;
  }

  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function buildReason(query: string, post: BlogPost, semanticScore = 0, lexicalScore = 0): string {
  const normalizedQuery = normalizeWhitespace(query).toLowerCase();
  const queryWords = normalizedQuery.split(" ").filter(Boolean);
  const matchedTags = post.tags.filter((tag) => {
    const lowerTag = tag.toLowerCase();
    return (
      normalizedQuery.includes(lowerTag) ||
      queryWords.some((word) => lowerTag.includes(word) || word.includes(lowerTag))
    );
  });

  if (matchedTags.length > 0) {
    return `Matched tags: ${matchedTags.slice(0, 3).join(", ")}`;
  }

  if (semanticScore >= 0.82) {
    return "Strong semantic fit";
  }

  if (lexicalScore >= 0.5) {
    return "Strong keyword overlap";
  }

  return "Semantic similarity";
}

export function tagCounts(posts: BlogPost[], limit = 18): TagStat[] {
  const counts = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.tags ?? []) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
    .slice(0, limit);
}

export function uniqueTags(posts: BlogPost[]): string[] {
  return [...new Set(posts.flatMap((post) => post.tags ?? []))].sort((a, b) =>
    a.localeCompare(b),
  );
}

export function buildRelatedPosts(
  posts: BlogPost[],
  target: BlogPost,
  limit = 3,
): Array<BlogPost & { relatedScore: number; relatedReason: string }> {
  return [...posts]
    .filter((post) => post.slug !== target.slug)
    .map((post) => {
      const overlap = post.tags.filter((tag) => target.tags.includes(tag)).length;
      const tierDistance = Math.abs(resolveTier(post) - resolveTier(target));
      const recencyBoost = 1 / (1 + Math.abs(new Date(post.date).getTime() - new Date(target.date).getTime()) / 86_400_000);

      const relatedScore = overlap * 3 + recencyBoost + (tierDistance === 0 ? 0.5 : 0);

      return {
        ...post,
        relatedScore,
        relatedReason:
          overlap > 0
            ? `Shares ${overlap} tag${overlap === 1 ? "" : "s"}`
            : "Nearby topic",
      };
    })
    .sort((a, b) => b.relatedScore - a.relatedScore)
    .slice(0, limit);
}

export function formatArticleDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}
