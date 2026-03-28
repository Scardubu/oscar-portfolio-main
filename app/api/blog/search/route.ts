import { NextResponse } from "next/server";

import { getAllPosts, toSearchBlogPost } from "@/lib/blog";
import {
  buildReason,
  buildSearchDocument,
  cosineSimilarity,
  keywordScore,
  sortPosts,
  type BlogTier,
  type RankedBlogPost,
} from "@/lib/blog-intelligence";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SearchRequestBody = {
  query?: string;
  tag?: string | null;
  limit?: number;
};

async function fetchEmbeddings(inputs: string[]): Promise<number[][]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  const model = process.env.OPENAI_EMBEDDING_MODEL ?? "text-embedding-3-small";

  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      input: inputs,
      encoding_format: "float",
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Embeddings request failed with ${response.status}`);
  }

  const json = (await response.json()) as {
    data: Array<{ embedding: number[] }>;
  };

  return json.data.map((item) => item.embedding);
}

function buildKeywordFallback(
  posts: RankedBlogPost[],
  query: string,
  tag: string | null
): RankedBlogPost[] {
  return posts
    .filter((post) => (tag ? post.tags.includes(tag) : true))
    .map((post) => {
      const lexicalScore = keywordScore(query, post);
      const tierBoost = post.tier === 1 ? 0.04 : post.tier === 2 ? 0.02 : 0;
      const tagBoost = tag && post.tags.includes(tag) ? 0.05 : 0;
      const engagementBoost = Math.min(0.05, Math.max(0, post.engagementScore ?? 0) * 0.05);
      const score = Math.max(
        0,
        Math.min(1, lexicalScore * 0.8 + tierBoost + tagBoost + engagementBoost),
      );

      return {
        ...post,
        tier: post.tier,
        score,
        lexicalScore,
        reason: buildReason(query, post, 0, lexicalScore),
      };
    })
    .sort((a, b) => {
      const scoreDiff = (b.score ?? 0) - (a.score ?? 0);
      if (Math.abs(scoreDiff) > 0.0001) return scoreDiff;

      const tierDiff = (a.tier ?? 3) - (b.tier ?? 3);
      if (tierDiff !== 0) return tierDiff;

      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
}

export async function POST(request: Request) {
  const startedAt = Date.now();

  try {
    const body = (await request.json()) as SearchRequestBody;
    const query = typeof body.query === "string" ? body.query.trim() : "";
    const tag = typeof body.tag === "string" && body.tag.trim() ? body.tag.trim() : null;
    const limit = Number.isFinite(body.limit)
      ? Math.max(1, Math.min(20, Number(body.limit)))
      : 12;

    const rawPosts = getAllPosts().map(toSearchBlogPost);
    const published = rawPosts.filter((post) => post.published !== false);
    const posts = sortPosts(published).map((post) => ({
      ...post,
      tier: post.tier as BlogTier,
    }));

    if (!query) {
      const local = buildKeywordFallback(posts, query, tag).slice(0, limit);
      return NextResponse.json({
        mode: "local",
        results: local,
        durationMs: Date.now() - startedAt,
      });
    }

    const queryWords = query.split(/\s+/).filter(Boolean);

    if (queryWords.length < 2 || !process.env.OPENAI_API_KEY) {
      const local = buildKeywordFallback(posts, query, tag).slice(0, limit);
      return NextResponse.json({
        mode: "keyword",
        results: local,
        durationMs: Date.now() - startedAt,
      });
    }

    const candidates = (tag ? posts.filter((post) => post.tags.includes(tag)) : posts).slice(0, 120);
    const inputs = [query, ...candidates.map((post) => buildSearchDocument(post))];

    const embeddings = await fetchEmbeddings(inputs);
    const [queryEmbedding, ...postEmbeddings] = embeddings;

    if (!queryEmbedding) {
      const local = buildKeywordFallback(posts, query, tag).slice(0, limit);
      return NextResponse.json({
        mode: "keyword",
        results: local,
        durationMs: Date.now() - startedAt,
      });
    }

    const ranked = candidates
      .map((post, index) => {
        const candidateEmbedding = postEmbeddings[index];
        const semanticScore = candidateEmbedding
          ? cosineSimilarity(queryEmbedding, candidateEmbedding)
          : 0;
        const lexicalScore = keywordScore(query, post);
        const tierBoost = post.tier === 1 ? 0.04 : post.tier === 2 ? 0.02 : 0;
        const tagBoost = tag && post.tags.includes(tag) ? 0.05 : 0;
        const engagementBoost = Math.min(0.05, Math.max(0, post.engagementScore ?? 0) * 0.05);

        const score = Math.max(
          0,
          Math.min(
            1,
            semanticScore * 0.72 +
              lexicalScore * 0.25 +
              tierBoost +
              tagBoost +
              engagementBoost,
          ),
        );

        return {
          ...post,
          tier: post.tier,
          score,
          semanticScore,
          lexicalScore,
          reason: buildReason(query, post, semanticScore, lexicalScore),
        };
      })
      .sort((a, b) => {
        const scoreDiff = (b.score ?? 0) - (a.score ?? 0);
        if (Math.abs(scoreDiff) > 0.0001) return scoreDiff;

        const tierDiff = (a.tier ?? 3) - (b.tier ?? 3);
        if (tierDiff !== 0) return tierDiff;

        return new Date(b.date).getTime() - new Date(a.date).getTime();
      })
      .slice(0, limit);

    return NextResponse.json({
      mode: "semantic",
      results: ranked,
      durationMs: Date.now() - startedAt,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown search error";

    return NextResponse.json(
      {
        mode: "local",
        results: [],
        durationMs: Date.now() - startedAt,
        error: message,
      },
      { status: 200 },
    );
  }
}
