// CONVICTION ENGINE v20.0 — Home Page
// Mobile-native: Hero → Projects → OSS → Skills → About → Writing → Contact.
// Render priority: HeroSection is above-the-fold, zero lazy-loading.
// All heavy sections: dynamic import (ssr: true) to reduce initial JS bundle.
// Location: Lagos, Nigeria → Global.

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

import { HeroSection } from '@/components/HeroSection';
import { SectionSkeleton } from '@/components/SectionSkeleton';
import { getWritingPosts } from '@/lib/content';

// Heavy sections — lazy-loaded to keep initial JS lean.
// ssr: true preserves SEO and prevents layout shift on hydration.
const ProjectsSection = dynamic(
  () => import('@/components/ProjectsSection').then((m) => ({ default: m.ProjectsSection })),
  { ssr: true }
);
const OpenSourceSection = dynamic(
  () => import('@/components/OpenSourceSection').then((m) => ({ default: m.OpenSourceSection })),
  { ssr: true }
);
const SkillsSection = dynamic(
  () => import('@/components/SkillsSection').then((m) => ({ default: m.SkillsSection })),
  { ssr: true }
);
const AboutSection = dynamic(
  () => import('@/components/AboutSection').then((m) => ({ default: m.AboutSection })),
  { ssr: true }
);
const WritingSection = dynamic(
  () => import('@/components/WritingSection').then((m) => ({ default: m.WritingSection })),
  { ssr: true }
);
const ContactSection = dynamic(
  () => import('@/components/ContactSection').then((m) => ({ default: m.ContactSection })),
  { ssr: true }
);
const BookmarkToastLoader = dynamic(
  () =>
    import('@/components/BookmarkToastLoader').then((m) => ({ default: m.BookmarkToastLoader })),
  { ssr: false }
);

export default async function Home() {
  const posts = (await getWritingPosts()).slice(0, 6);

  return (
    <>
      <main id="main-content" tabIndex={-1}>
        {/* 00 — Hero: LCP target; zero deferred loading */}
        <HeroSection />

        {/* 01 — Projects: primary proof section, highest conviction value */}
        <Suspense
          fallback={<SectionSkeleton id="section-projects" label="Projects" height={560} />}
        >
          <ProjectsSection />
        </Suspense>

        {/* 02 — Open Source: second-order trust signal */}
        <Suspense
          fallback={<SectionSkeleton id="open-source" label="Open Source" height={340} />}
        >
          <OpenSourceSection />
        </Suspense>

        {/* 03 — Skills: breadth signal after depth is established */}
        <Suspense fallback={<SectionSkeleton id="skills" label="Skills" height={480} />}>
          <SkillsSection />
        </Suspense>

        {/* 04 — About: human story anchors the technical proof */}
        <Suspense fallback={<SectionSkeleton id="about" label="About" height={320} />}>
          <AboutSection />
        </Suspense>

        {/* 05 — Writing: deep expertise signal (conditional on post existence) */}
        {posts.length > 0 && (
          <Suspense
            fallback={<SectionSkeleton id="section-writing" label="Writing" height={420} />}
          >
            <WritingSection posts={posts} />
          </Suspense>
        )}

        {/* 06 — Contact: conversion endpoint */}
        <Suspense fallback={<SectionSkeleton id="contact" label="Contact" height={280} />}>
          <ContactSection />
        </Suspense>
      </main>

      {/* Client-only: bookmark toast — no SSR needed */}
      <BookmarkToastLoader />
    </>
  );
}