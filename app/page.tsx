// CONVICTION ENGINE v23.0 — Home Page
// v23 CHANGE: TestimonialsSection added between Projects and OSS (P2-D).
//   TESTIMONIALS data existed in lib/portfolio-data.ts since v27 but was never
//   rendered. This closes the gap — authority signal lands immediately after
//   the technical depth proof and before OSS artifacts.
//
// Render order: Hero → Projects → Testimonials → OSS → Skills → About → Writing → Contact
// Render priority: HeroSection is above-the-fold, zero lazy-loading.
// Heavy sections: dynamic import (ssr: true) to reduce initial JS bundle.

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

import { HeroSection } from '@/components/HeroSection';
import { SectionSkeleton } from '@/components/SectionSkeleton';
import { BookmarkToastLoader } from '@/components/BookmarkToastLoader';
import { getWritingPosts } from '@/lib/content';

const ProjectsSection = dynamic(
  () => import('@/components/ProjectsSection').then((m) => ({ default: m.ProjectsSection })),
  { ssr: true }
);
const TestimonialsSection = dynamic(
  () => import('@/components/TestimonialsSection').then((m) => ({ default: m.TestimonialsSection })),
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

export default async function Home() {
  const posts = (await getWritingPosts()).slice(0, 6);

  return (
    <>
      <main id="main-content" tabIndex={-1}>
        {/* 00 — Hero: LCP target; zero deferred loading */}
        <HeroSection />

        {/* 01 — Projects: primary depth proof, highest conviction value */}
        <Suspense
          fallback={<SectionSkeleton id="section-projects" label="Projects" height={560} />}
        >
          <ProjectsSection />
        </Suspense>

        {/* 01.5 — Testimonials: client authority immediately after depth proof */}
        <Suspense
          fallback={<SectionSkeleton id="section-testimonials" label="Testimonials" height={360} />}
        >
          <TestimonialsSection />
        </Suspense>

        {/* 02 — Open Source: secondary trust signal, installable artifacts */}
        <Suspense
          fallback={<SectionSkeleton id="open-source" label="Open Source" height={340} />}
        >
          <OpenSourceSection />
        </Suspense>

        {/* 03 — Skills: breadth established after depth is proven */}
        <Suspense fallback={<SectionSkeleton id="skills" label="Skills" height={480} />}>
          <SkillsSection />
        </Suspense>

        {/* 04 — About: human story anchors the technical record */}
        <Suspense
          fallback={<SectionSkeleton id="section-about" label="About" height={320} />}
        >
          <AboutSection />
        </Suspense>

        {/* 05 — Writing: deep expertise and decision-making signal */}
        {posts.length > 0 && (
          <Suspense
            fallback={<SectionSkeleton id="section-writing" label="Writing" height={420} />}
          >
            <WritingSection posts={posts} />
          </Suspense>
        )}

        {/* 06 — Contact: conversion endpoint, always last */}
        <Suspense
          fallback={<SectionSkeleton id="section-contact" label="Contact" height={280} />}
        >
          <ContactSection />
        </Suspense>
      </main>

      {/*
        BookmarkToast: client-only, outside <main> to avoid polluting
        the main landmark with a transient notification region.
      */}
      <BookmarkToastLoader />
    </>
  );
}