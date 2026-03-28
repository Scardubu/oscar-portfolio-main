// app/blog/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPostSlugs, getPostBySlug } from "@/lib/blog";
import BlogPostClient from "./BlogPostClient";
import remarkGfm from "remark-gfm";
import rehypePrettyCodePlugin from "rehype-pretty-code";

// ── Static generation ─────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: `${post.title} — Oscar Ndugbu`,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated,
      tags: post.tags,
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(post.title)}&type=post`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

// ── MDX components ────────────────────────────────────────────────────────────

const components = {
  // Custom component overrides for MDX
  h1: ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-display mt-8 mb-4 text-gradient-kinetic" {...props}>
      {children}
    </h1>
  ),
  h2: ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-headline mt-8 mb-3" {...props}>
      {children}
    </h2>
  ),
  h3: ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="font-semibold text-xl mt-6 mb-2 text-primary" {...props}>
      {children}
    </h3>
  ),
  a: ({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    >
      {children}
    </a>
  ),
  // Code blocks styled by rehype-pretty-code
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    author: {
      "@type": "Person",
      name: "Oscar Ndugbu",
      url: "https://scardubu.dev",
    },
    keywords: post.tags.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <BlogPostClient
        title={post.title}
        description={post.description}
        date={post.date}
        updated={post.updated}
        tags={post.tags}
        readingTime={post.readingTime}
      >
        {/* MDX rendered server-side */}
        <MDXRemote
          source={post.content}
          components={components}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [
                [
                  rehypePrettyCodePlugin as never,
                  {
                    theme: "one-dark-pro",
                    keepBackground: false,
                  },
                ],
              ],
            },
          }}
        />
      </BlogPostClient>
    </>
  );
}
