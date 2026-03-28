import { Metadata } from "next";
import { ContinueReadingBanner } from "@/components/ContinueReadingBanner";
import { ReadingProgress } from "@/app/components/ReadingProgress";

export const metadata: Metadata = {
  title: {
    template: "%s | Oscar Ndugbu Blog",
    default: "Blog | Oscar Ndugbu - Production ML & Full-Stack AI",
  },
  description:
    "Deep dives into production ML systems, MLOps, and building AI products. Technical content from a Full-Stack ML Engineer based in Nigeria.",
  openGraph: {
    title: "Blog | Oscar Ndugbu",
    description:
      "Deep dives into production ML systems, MLOps, and building AI products.",
    url: "https://scardubu.dev/blog",
    siteName: "Oscar Ndugbu Blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Oscar Ndugbu",
    description:
      "Deep dives into production ML systems, MLOps, and building AI products.",
  },
  alternates: {
    canonical: "https://scardubu.dev/blog",
    types: {
      "application/rss+xml": "https://scardubu.dev/rss.xml",
    },
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ReadingProgress />
      <ContinueReadingBanner />
      {children}
    </>
  );
}
