import { AboutSection } from '@/components/AboutSection';
import { BookmarkToast } from '@/components/Bookmarktoast';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/HeroSection';
import { NavBar } from '@/components/Navbar';
import { ProjectsSection } from '@/components/ProjectsSection';
import { ScrollRevealInit } from '@/components/ScrollRevealInit';
import { WritingSection } from '@/components/WritingSection';
import { getWritingPosts } from '@/lib/content';

export default async function Home() {
  const posts = (await getWritingPosts()).filter((post) => post.featured).slice(0, 3);

  return (
    <>
      <NavBar />
      <main id="main-content" tabIndex={-1}>
        <HeroSection />
        <ProjectsSection />
        <AboutSection />
        <ContactSection />
        {posts.length > 0 ? <WritingSection posts={posts} /> : null}
      </main>
      <Footer />
      <BookmarkToast />
      <ScrollRevealInit />
    </>
  );
}
