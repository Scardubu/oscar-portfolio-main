export interface ProjectData {
  name: string;
  description: string;
  url: string;
  category: string;
  metrics?: {
    users?: number;
    accuracy?: number;
    uptime?: number;
    latency?: number;
  };
  techStack: string[];
  datePublished?: string;
  codeRepository?: string;
}

export function generateProjectSchema(project: ProjectData) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.name,
    description: project.description,
    url: project.url,
    applicationCategory: project.category,
    operatingSystem: "Cross-platform",
    author: {
      "@type": "Person",
      name: "Oscar Ndugbu",
      url: "https://www.scardubu.dev",
      jobTitle: "Full-Stack ML Engineer",
      sameAs: [
        "https://github.com/scardubu",
        "https://linkedin.com/in/oscardubu",
      ],
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  if (project.metrics?.accuracy) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: (project.metrics.accuracy / 100) * 5,
      ratingCount: project.metrics.users || 100,
      bestRating: 5,
      worstRating: 1,
    };
  }

  if (project.codeRepository) {
    schema.codeRepository = {
      "@type": "SoftwareSourceCode",
      codeRepository: project.codeRepository,
      programmingLanguage: project.techStack,
    };
  }

  if (project.datePublished) {
    schema.datePublished = project.datePublished;
  }

  return schema;
}

export function generatePersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://www.scardubu.dev/#person",
    name: "Oscar Ndugbu",
    alternateName: "scardubu",
    jobTitle: "Full-Stack ML Engineer",
    description:
      "Production ML Engineer architecting AI systems that distill frontier intelligence into elegant, trusted tools. Based in Nigeria, building for audiences worldwide.",
    url: "https://www.scardubu.dev",
    image: "https://www.scardubu.dev/headshot.webp",
    sameAs: [
      "https://github.com/scardubu",
      "https://linkedin.com/in/oscardubu",
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "NG",
      addressRegion: "Abuja",
    },
    knowsAbout: [
      "Machine Learning",
      "MLOps",
      "FastAPI",
      "XGBoost",
      "Production AI Systems",
      "Ensemble Models",
      "Next.js",
      "TypeScript",
      "Python",
    ],
  };
}

export function generateBlogPostSchema(post: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  image?: string;
  readingTime?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: post.title,
    description: post.description,
    url: `https://www.scardubu.dev/blog/${post.slug}`,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Person",
      name: "Oscar Ndugbu",
      url: "https://www.scardubu.dev",
    },
    publisher: {
      "@type": "Person",
      name: "Oscar Ndugbu",
      url: "https://www.scardubu.dev",
    },
    image: post.image || "https://www.scardubu.dev/og-image.png",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.scardubu.dev/blog/${post.slug}`,
    },
    ...(post.readingTime && { timeRequired: `PT${post.readingTime}M` }),
  };
}
