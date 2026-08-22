// Blog utilities for loading and processing MDX posts (static seed data for client components)

export const CONTENT_PILLARS = {
  'production-ml': {
    name: 'Production ML Systems',
    slug: 'production-ml',
    description: 'Building, deploying, and maintaining ML systems at scale',
    color: 'cyan',
  },
  mlops: {
    name: 'MLOps & Infrastructure',
    slug: 'mlops',
    description: 'CI/CD for ML, monitoring, retraining, and operational excellence',
    color: 'purple',
  },
  'ai-nigeria': {
    name: 'AI in Nigeria & Africa',
    slug: 'ai-nigeria',
    description: 'Building ML solutions for African markets and contexts',
    color: 'green',
  },
  'full-stack-ml': {
    name: 'Full-Stack ML Engineering',
    slug: 'full-stack-ml',
    description: 'End-to-end ML development from data to UI',
    color: 'amber',
  },
} as const;

export type ContentPillar = keyof typeof CONTENT_PILLARS;

// Post metadata interface matching frontmatter schema
export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  category: ContentPillar;
  tags: string[];
  featured: boolean;
  featuredImage?: string;
  readingTime: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
}

// Full post with content
export interface Post extends PostMeta {
  content: string;
}

// Static post data (will be replaced with MDX file reading in production)
// For now, this serves as the data source until MDX pipeline is fully wired
export const BLOG_POSTS: PostMeta[] = [
  {
    slug: 'production-ml-systems-2024',
    title: 'The Complete Guide to Production ML Systems in 2024',
    description:
      'An end-to-end look at what makes ML systems truly production-ready, from architecture patterns to monitoring and maintenance.',
    date: '2024-11-30',
    author: 'Oscar Ndugbu',
    category: 'production-ml',
    tags: ['production-ml', 'architecture', 'deployment', 'monitoring'],
    featured: true,
    featuredImage: '/blog/production-ml-systems.jpg',
    readingTime: '15 min',
    difficulty: 'Intermediate',
  },
  {
    slug: 'ai-in-nigeria-opportunities',
    title: 'Building AI Products in Nigeria: Challenges, Solutions, and Opportunities',
    description:
      'A practical guide to building ML solutions in the Nigerian context, covering infrastructure, data, and market opportunities.',
    date: '2024-11-28',
    author: 'Oscar Ndugbu',
    category: 'ai-nigeria',
    tags: ['nigeria', 'africa', 'startups', 'infrastructure'],
    featured: true,
    featuredImage: '/blog/ai-nigeria.jpg',
    readingTime: '12 min',
    difficulty: 'Beginner',
  },
  {
    slug: 'ensemble-models-production',
    title: 'Ensemble Models in Production: Designing the Evaluation Path',
    description:
      'Deep dive into building and deploying ensemble models with XGBoost, LightGBM, and neural networks for real-world predictions.',
    date: '2024-11-25',
    author: 'Oscar Ndugbu',
    category: 'production-ml',
    tags: ['xgboost', 'lightgbm', 'ensemble', 'python'],
    featured: false,
    readingTime: '11 min',
    difficulty: 'Advanced',
  },
  {
    slug: 'fastapi-ml-engineers',
    title: 'FastAPI for ML Engineers: Designing the Serving Path',
    description:
      'Complete guide to building high-performance ML APIs with FastAPI, Redis caching, and production-grade monitoring.',
    date: '2024-11-22',
    author: 'Oscar Ndugbu',
    category: 'full-stack-ml',
    tags: ['fastapi', 'python', 'api', 'performance'],
    featured: false,
    readingTime: '10 min',
    difficulty: 'Intermediate',
  },
  {
    slug: 'fastapi-deploy-production-5-min',
    title: '5-Minute Guide: Deploy FastAPI to Production',
    description:
      'A concise, copy-pasteable checklist for taking a FastAPI app from localhost to a secure, production-ready deployment.',
    date: '2024-11-20',
    author: 'Oscar Ndugbu',
    category: 'mlops',
    tags: ['fastapi', 'deployment', 'docker', 'devops'],
    featured: false,
    featuredImage: '/blog/fastapi-deploy-production.jpg',
    readingTime: '6 min',
    difficulty: 'Beginner',
  },
  {
    slug: 'redis-caching-patterns-ml-apis',
    title: 'Redis Caching Patterns for ML APIs',
    description:
      'Practical caching patterns using Redis to reduce ML inference latency and cut infrastructure costs for real-world APIs.',
    date: '2024-11-18',
    author: 'Oscar Ndugbu',
    category: 'mlops',
    tags: ['redis', 'caching', 'performance', 'ml-apis'],
    featured: false,
    featuredImage: '/blog/redis-caching-ml-apis.jpg',
    readingTime: '7 min',
    difficulty: 'Intermediate',
  },
  {
    slug: 'how-i-built-ai-sports-prediction-platform-sabiscore',
    title: 'How SabiScore Became a Production AI Sports Intelligence Platform',
    description:
      'End-to-end story of SabiScore: architecture, ensemble models, production challenges, and the decisions behind a live sports intelligence product.',
    date: '2024-12-01',
    author: 'Oscar Ndugbu',
    category: 'production-ml',
    tags: ['sabiscore', 'sports-prediction', 'xgboost', 'fastapi', 'production-ml'],
    featured: true,
    featuredImage: '/blog/sabiscore-dashboard.png',
    readingTime: '12 min',
    difficulty: 'Intermediate',
  },
  {
    slug: 'mlops-playbook-999-uptime-production-ml-systems',
    title: 'Designing Recoverable ML Systems: A Production MLOps Playbook',
    description:
      'Monitoring, staged deployments, incident response, and fallback patterns for ML services that need explicit recovery behavior.',
    date: '2024-12-02',
    author: 'Oscar Ndugbu',
    category: 'mlops',
    tags: ['mlops', 'uptime', 'monitoring', 'deployment', 'reliability'],
    featured: true,
    featuredImage: '/blog/mlops-uptime-dashboard.png',
    readingTime: '10 min',
    difficulty: 'Advanced',
  },
  {
    slug: 'building-in-nigeria-shipping-globally-remote-ml-engineer',
    title: 'Building in Nigeria: Infrastructure Decisions Under Constraint',
    description:
      'An engineering account of infrastructure, payments, and trust decisions shaped by operating from Nigeria.',
    date: '2024-12-03',
    author: 'Oscar Ndugbu',
    category: 'ai-nigeria',
    tags: ['nigeria', 'remote-work', 'ml-engineering', 'startup', 'africa'],
    featured: false,
    featuredImage: '/blog/building-in-nigeria.png',
    readingTime: '11 min',
    difficulty: 'Beginner',
  },
  {
    slug: 'mlops-999-uptime-transformation-case-study',
    title: 'Turning a Flaky ML API Into a Recoverable Service',
    description:
      'A step-by-step case study in instrumentation, topology changes, monitoring thresholds, and safer deployment behavior.',
    date: '2024-12-05',
    author: 'Oscar Ndugbu',
    category: 'mlops',
    tags: ['mlops', 'uptime', 'reliability', 'monitoring', 'deployments'],
    featured: false,
    featuredImage: '/blog/mlops-999-uptime-case-study.png',
    readingTime: '12 min',
    difficulty: 'Intermediate',
  },
  {
    slug: 'nigeria-ml-engineer-mrr-playbook',
    title: 'A Practical Independent-Engineering Playbook for Nigerian ML Engineers',
    description:
      'A practical roadmap for Nigerian and African ML engineers building an independent practice around clear technical evidence.',
    date: '2024-12-06',
    author: 'Oscar Ndugbu',
    category: 'ai-nigeria',
    tags: ['nigeria', 'remote-work', 'freelancing', 'ml-engineering', 'business'],
    featured: true,
    featuredImage: '/blog/nigeria-ml-3k-mrr.png',
    readingTime: '13 min',
    difficulty: 'Beginner',
  },
  {
    slug: 'africa-ai-infra-stack-for-founders',
    title: 'The AI Infrastructure Stack Recommended for Every African Founder',
    description:
      'An opinionated AI infrastructure stack for African founders building reliable ML products under real-world constraints.',
    date: '2024-12-07',
    author: 'Oscar Ndugbu',
    category: 'ai-nigeria',
    tags: ['infrastructure', 'startups', 'africa', 'ai', 'mlops'],
    featured: false,
    featuredImage: '/blog/africa-ai-infra-stack.png',
    readingTime: '11 min',
    difficulty: 'Intermediate',
  },
  {
    slug: 'ai-demystified-what-machine-learning-actually-does',
    title: 'AI is Not Magic: A Real Talk About What Machine Learning Actually Does',
    description:
      "AI isn't mysterious wizardry—it's pattern recognition at scale. This guide breaks down how AI actually works using everyday examples anyone can understand.",
    date: '2025-01-08',
    author: 'Oscar Ndugbu',
    category: 'ai-nigeria',
    tags: ['ai', 'machine-learning', 'beginners', 'explained', 'non-technical'],
    featured: true,
    featuredImage: '/blog/ai-demystified.png',
    readingTime: '9 min',
    difficulty: 'Beginner',
  },
  {
    slug: 'side-project-to-mrr-12-month-playbook',
    title: 'From Side Project to Revenue: An AI Business Playbook While Working Full-Time',
    description:
      'A 12-month playbook for moving from side project to a sustainable independent product practice, including what failed and what changed.',
    date: '2025-01-09',
    author: 'Oscar Ndugbu',
    category: 'ai-nigeria',
    tags: ['side-project', 'build-in-public', 'entrepreneurship', 'saas', 'indie-hacker'],
    featured: true,
    featuredImage: '/blog/side-project-3k-mrr.png',
    readingTime: '12 min',
    difficulty: 'Beginner',
  },
  {
    slug: 'your-life-in-2030-ai-realistic-forecast',
    title: "Your Life in 2030: What AI Will (And Won't) Change",
    description:
      "A realistic forecast of AI's impact by 2030 from someone building it—based on current trends, not sci-fi fantasies.",
    date: '2025-01-10',
    author: 'Oscar Ndugbu',
    category: 'ai-nigeria',
    tags: ['ai', 'future', '2030', 'predictions', 'technology'],
    featured: false,
    featuredImage: '/blog/ai-2030-forecast.png',
    readingTime: '11 min',
    difficulty: 'Beginner',
  },
];

// Get all posts sorted by date (newest first)
export function getAllPosts(): PostMeta[] {
  return [...BLOG_POSTS].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Alias used by API routes and utilities
export const getAllBlogPosts = getAllPosts;

// Get featured posts
export function getFeaturedPosts(): PostMeta[] {
  return getAllPosts().filter((post) => post.featured);
}

// Get posts by category
export function getPostsByCategory(category: ContentPillar): PostMeta[] {
  return getAllPosts().filter((post) => post.category === category);
}

// Get posts by tag
export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter((post) => post.tags.includes(tag));
}

// Get a single post by slug
export function getPostBySlug(slug: string): PostMeta | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

// Get related posts (same category or overlapping tags)
export function getRelatedPosts(currentSlug: string, limit = 3): PostMeta[] {
  const current = getPostBySlug(currentSlug);
  if (!current) return [];

  const scored = getAllPosts()
    .filter((post) => post.slug !== currentSlug)
    .map((post) => {
      let score = 0;
      // Same category = 3 points
      if (post.category === current.category) score += 3;
      // Each overlapping tag = 1 point
      const overlappingTags = post.tags.filter((tag) => current.tags.includes(tag));
      score += overlappingTags.length;
      return { post, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(({ post }) => post);
}

// Get all unique tags
export function getAllTags(): string[] {
  const tags = new Set<string>();
  BLOG_POSTS.forEach((post) => post.tags.forEach((tag) => tags.add(tag)));
  return Array.from(tags).sort();
}

// Format date for display
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Generate JSON-LD for a blog post
export function generatePostJsonLd(post: PostMeta, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    author: {
      '@type': 'Person',
      name: post.author,
      url: 'https://scardubu.dev',
    },
    datePublished: post.date,
    dateModified: post.date,
    image: post.featuredImage
      ? `https://scardubu.dev${post.featuredImage}`
      : 'https://scardubu.dev/og-image.png',
    url,
    publisher: {
      '@type': 'Person',
      name: 'Oscar Ndugbu',
      url: 'https://scardubu.dev',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    keywords: post.tags.join(', '),
  };
}
