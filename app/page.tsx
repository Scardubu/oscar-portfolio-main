import dynamic from 'next/dynamic';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/HeroSection';
import { NavBar } from '@/components/Navbar';
import { getWritingPosts } from '@/lib/content';

const ProjectsSection = dynamic(() => import('@/components/ProjectsSection').then((m) => ({ default: m.ProjectsSection })), {
  ssr: true,
  loading: () => <div className="min-h-[600px]" aria-hidden="true" />,
});

const AboutSection = dynamic(() => import('@/components/AboutSection').then((m) => ({ default: m.AboutSection })), {
  ssr: true,
  loading: () => <div className="min-h-[400px]" aria-hidden="true" />,
});

const ContactSection = dynamic(() => import('@/components/ContactSection').then((m) => ({ default: m.ContactSection })), {
  ssr: true,
  loading: () => <div className="min-h-[400px]" aria-hidden="true" />,
});

const WritingSection = dynamic(() => import('@/components/WritingSection').then((m) => ({ default: m.WritingSection })), {
  ssr: true,
  loading: () => <div className="min-h-[600px]" aria-hidden="true" />,
});

const BookmarkToastLoader = dynamic(() => import('@/components/BookmarkToastLoader').then((m) => ({ default: m.BookmarkToastLoader })));

export default async function Home() {
  const posts = (await getWritingPosts()).slice(0, 6);

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
      <BookmarkToastLoader />
    </>
  );
}
