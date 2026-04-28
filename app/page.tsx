// CONVICTION ENGINE v10.0 — FULL REPLACEMENT
import { AboutSection } from '@/components/AboutSection';
import { BookmarkToastLoader } from '@/components/BookmarkToastLoader';
import { ContactSection } from '@/components/ContactSection';
import { HeroSection } from '@/components/HeroSection';
import { OpenSourceSection } from '@/components/OpenSourceSection';
import { ProjectsSection } from '@/components/ProjectsSection';
import { SkillsMap } from '@/components/skills/SkillsMap';
import { WritingSection } from '@/components/WritingSection';
import { getWritingPosts } from '@/lib/content';

export default async function Home() {
  const posts = (await getWritingPosts()).slice(0, 6);

  return (
    <>
      <main id="main-content" tabIndex={-1}>
        <HeroSection />
        <ProjectsSection />
        <OpenSourceSection />
        <section id="skills" aria-labelledby="skills-heading" className="py-28 sm:py-32">
          <div className="container">
            <div className="mb-16 max-w-4xl">
              <div className="section-kicker-row">
                <span className="section-number" aria-hidden="true">
                  03
                </span>
                <span className="section-label">SKILLS</span>
              </div>
              <h2 id="skills-heading" className="mt-(--space-2) text-white">
                Built for the full stack. Proven in production.
              </h2>
              <p className="text-text-secondary mt-5 max-w-[62ch] text-base leading-8 sm:text-lg">
                52 skills across architecture, infrastructure, compliance, and full-stack delivery
                from PostgreSQL RLS through Spring Boot, Go services, and production ML.
              </p>
            </div>
            <SkillsMap />
          </div>
        </section>
        <AboutSection />
        {posts.length > 0 ? <WritingSection posts={posts} /> : null}
        <ContactSection />
      </main>
      <BookmarkToastLoader />
    </>
  );
}
