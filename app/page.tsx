import { AboutSection } from '@/components/AboutSection';
import { BookmarkToastLoader } from '@/components/BookmarkToastLoader';
import { HeroSection } from '@/components/HeroSection';
import { ContactSection } from '@/components/ContactSection';
import { ProjectsSection } from '@/components/ProjectsSection';
import { WritingSection } from '@/components/WritingSection';
import { getWritingPosts } from '@/lib/content';

export default async function Home() {
  const posts = (await getWritingPosts()).slice(0, 6);

  return (
    <>
      <main id="main-content" tabIndex={-1}>
        <HeroSection />
        <ProjectsSection />
        <AboutSection />
        {posts.length > 0 ? <WritingSection posts={posts} /> : null}
        <ContactSection />
      </main>
      <BookmarkToastLoader />
    </>
  );
}
