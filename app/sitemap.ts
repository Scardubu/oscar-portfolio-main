import type { MetadataRoute } from 'next';

import { PROJECTS } from '@/lib/projects';
import { getWritingPosts } from '@/lib/content';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getWritingPosts();
  const base = 'https://www.scardubu.dev';

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/writing`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    ...PROJECTS.map((project) => ({
      url: `${base}/work/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...posts.map((post) => ({
      url: `${base}/writing/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}