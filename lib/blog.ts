// lib/blog.ts
// ─────────────────────────────────────────────────────────────────────────────
// MDX blog utilities — server-only (no "use client").
// Uses gray-matter for frontmatter + reading-time for estimates.
// All functions run at build/request time — pure Node.js.
// ─────────────────────────────────────────────────────────────────────────────

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { normalizePost, type BlogPost as SearchBlogPost } from "@/lib/blog-intelligence";

const POSTS_DIR = path.join(process.cwd(), "content/blog");

// ── Types ─────────────────────────────────────────────────────────────────────

export interface BlogPost {
  slug:        string;
  title:       string;
  description: string;
  date:        string;         // ISO string "2025-01-15"
  updated?:    string;
  tags:        string[];
  draft:       boolean;
  readingTime: string;         // "5 min read"
  content:     string;         // raw MDX
}

export type BlogPostMeta = Omit<BlogPost, "content">;

// ── Helpers ───────────────────────────────────────────────────────────────────

function ensurePostsDir() {
  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
  }
}

function parseFrontmatter(raw: string, slug: string): BlogPost {
  const { data, content } = matter(raw);
  const stats = readingTime(content);

  return {
    slug,
    title:       (data["title"] as string)       ?? "Untitled",
    description: (data["description"] as string) ?? "",
    date:        (data["date"] as string)         ?? new Date().toISOString().slice(0, 10),
    updated:     data["updated"] as string | undefined,
    tags:        (data["tags"] as string[])       ?? [],
    draft:       (data["draft"] as boolean)       ?? false,
    readingTime: stats.text,
    content,
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

/** Get all published posts, sorted newest first */
export function getAllPosts(): BlogPostMeta[] {
  ensurePostsDir();

  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  const posts = files
    .map((filename) => {
      const slug = filename.replace(/\.mdx?$/, "");
      const raw  = fs.readFileSync(path.join(POSTS_DIR, filename), "utf-8");
      const post = parseFrontmatter(raw, slug);
      const meta: BlogPostMeta = post;
      return meta;
    })
    .filter((p) => !p.draft || process.env.NODE_ENV === "development")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

/** Get a single post by slug */
export function getPostBySlug(slug: string): BlogPost | null {
  ensurePostsDir();

  const mdxPath = path.join(POSTS_DIR, `${slug}.mdx`);
  const mdPath  = path.join(POSTS_DIR, `${slug}.md`);
  const filePath = fs.existsSync(mdxPath) ? mdxPath : fs.existsSync(mdPath) ? mdPath : null;

  if (!filePath) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  return parseFrontmatter(raw, slug);
}

/** Get all post slugs — used for generateStaticParams */
export function getAllPostSlugs(): string[] {
  ensurePostsDir();
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => f.replace(/\.mdx?$/, ""));
}

/** Get posts by tag */
export function getPostsByTag(tag: string): BlogPostMeta[] {
  return getAllPosts().filter((p) =>
    p.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
  );
}

/** Get all unique tags */
export function getAllTags(): { tag: string; count: number }[] {
  const posts = getAllPosts();
  const tagMap = new Map<string, number>();

  posts.forEach((p) => {
    p.tags.forEach((t) => {
      tagMap.set(t, (tagMap.get(t) ?? 0) + 1);
    });
  });

  return Array.from(tagMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function toSearchBlogPost(post: BlogPostMeta): SearchBlogPost {
  return normalizePost({
    slug: post.slug,
    title: post.title,
    excerpt: post.description,
    date: post.date,
    readMin: Number.parseInt(post.readingTime, 10) || 5,
    tags: post.tags,
    featured: false,
    published: !post.draft,
  });
}
