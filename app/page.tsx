// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture
//
// Section render order and orchestration rationale:
//
// 00. Hero             → Above-the-fold LCP target (synchronous)
// 01. Projects         → Primary proof of depth and execution capability
// 01.5 Production Record → Authority immediately after depth proof
// 02. Open Source      → Trust through public artifacts and contributions
// 03. Skills           → Breadth only after depth is established
// 04. About            → Human connection and operating context
// 05. Writing          → Thought leadership and decision-making clarity
// 06. Contact          → Final conversion endpoint
//
// Technical strategy:
// - Hero stays synchronous for first paint quality.
// - Every other section streams through Suspense.
// - Dynamic imports keep the initial bundle lean while preserving SSR.
// - BookmarkToastLoader stays outside <main> so it does not pollute the main landmark.

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

import { BookmarkToastLoader } from '@/components/BookmarkToastLoader';
import { HeroSection } from '@/components/HeroSection';
import { SectionSkeleton } from '@/components/SectionSkeleton';
import { getWritingPosts } from '@/lib/content';

const ProjectsSection = dynamic(
  () => import('@/components/ProjectsSection').then((m) => ({ default: m.ProjectsSection })),
  { ssr: true }
);

const TestimonialsSection = dynamic(
  () =>
    import('@/components/TestimonialsSection').then((m) => ({ default: m.TestimonialsSection })),
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

function ConvictionRecap() {
  const PROOF_ITEMS = [
    '3 live production systems',
    'Federal-scale delivery · 40M students',
    '99.9%+ sustained uptime',
    'NRS · NDPC compliant',
    'Lagos → Global',
  ] as const;

  return (
    <div id="section-recap" role="region" aria-label="Portfolio conviction summary">
      <div className="container">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-y border-white/8 py-6">
          {PROOF_ITEMS.map((item) => (
            <span
              key={item}
              className="font-mono text-[11px] tracking-widest text-white/60 uppercase"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionBlock({
  id,
  label,
  height,
  children,
}: {
  id: string;
  label: string;
  height: number;
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<SectionSkeleton id={id} label={label} height={height} />}>
      {children}
    </Suspense>
  );
}

export default async function Home() {
  const posts = (await getWritingPosts()).slice(0, 6);

  return (
    <>
      <main id="main-content" tabIndex={-1} className="min-h-[100dvh]">
        {/* 00 — Hero: first paint, zero deferred loading */}
        <HeroSection />

        {/* 01 — Projects: deepest execution proof */}
        <SectionBlock id="section-projects" label="Projects" height={560}>
          <ProjectsSection />
        </SectionBlock>

        {/* 01.5 — Production Record: proof of outcomes after depth */}
        <SectionBlock id="section-testimonials" label="Testimonials" height={360}>
          <TestimonialsSection />
        </SectionBlock>

        {/* 02 — Open Source: public artifacts and contribution signal */}
        <SectionBlock id="open-source" label="Open Source" height={340}>
          <OpenSourceSection />
        </SectionBlock>

        {/* 03 — Skills: breadth only after depth is established */}
        <SectionBlock id="skills" label="Skills" height={480}>
          <SkillsSection />
        </SectionBlock>

        {/* 04 — About: operating context and human grounding */}
        <SectionBlock id="section-about" label="About" height={320}>
          <AboutSection />
        </SectionBlock>

        {/* 05 — Writing: decision-making depth and technical judgment */}
        {posts.length > 0 && (
          <SectionBlock id="section-writing" label="Writing" height={420}>
            <WritingSection posts={posts} />
          </SectionBlock>
        )}

        {/* Pre-contact conviction recap — scannable proof summary before the form */}
        <ConvictionRecap />

        {/* 06 — Contact: final conversion endpoint */}
        <SectionBlock id="section-contact" label="Contact" height={280}>
          <ContactSection />
        </SectionBlock>
      </main>

      {/* Transient UI lives outside main to keep the landmark clean */}
      <BookmarkToastLoader />
    </>
  );
}
