import { getWritingPost, getWritingPosts } from '@/lib/content';
import { formatDate } from '@/lib/utils';

export interface WritingEntry {
  readonly slug: string;
  readonly title: string;
  readonly date: string;
  readonly summary: string;
  readonly tags: readonly string[];
  readonly readingTime: number;
  readonly formattedDate: string;
  readonly featured: boolean;
}

export async function listWritingEntries(): Promise<WritingEntry[]> {
  const posts = await getWritingPosts();

  return posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    date: post.date,
    summary: post.summary,
    tags: post.tags,
    readingTime: post.readingTime,
    formattedDate: formatDate(post.date),
    featured: post.featured ?? false,
  }));
}

export async function getWritingEntry(slug: string) {
  const post = await getWritingPost(slug);

  if (!post) {
    return null;
  }

  return {
    ...post,
    formattedDate: formatDate(post.frontmatter.date),
  };
}