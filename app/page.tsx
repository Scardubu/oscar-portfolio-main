import { AboutSection } from '@/components/AboutSection';
import { BookmarkToastLoader } from '@/components/BookmarkToastLoader';
import { HeroSection } from '@/components/HeroSection';
import { ContactSection } from '@/components/ContactSection';
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
              <span className="label">
                <span
                  className="mr-3 font-mono text-[10px] tracking-widest text-(--color-text-muted) select-none"
                  aria-hidden="true"
                >
                  03
                </span>
                Skills
              </span>
              <h2 id="skills-heading" className="gradient-text mt-(--space-2)">
                Seven pillars. Production proof.
              </h2>
              <p className="font-display text-text-secondary mt-5 max-w-[62ch] text-(length:--text-xl) leading-[1.8]">
                Every skill listed here has shipped to production. Pillar tabs filter by domain —
                each card shows where it was used and at what proficiency.
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
