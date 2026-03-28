'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const NAV_LINKS = [
  { label: 'Work', href: '/#projects' },
  { label: 'Writing', href: '/writing' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
];

const SECTION_IDS = ['hero', 'projects', 'about', 'contact'];

/**
 * NavBar — scrolled border, active section tracking, mobile hamburger.
 *
 * Active section: IntersectionObserver watches each section[id].
 * The topmost visible section wins. This drives the .active class on nav links.
 *
 * Mobile: hamburger below 768px, full drawer with links + CTA.
 * Desktop: inline links + primary CTA button.
 */
export function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [mobileOpen, setMobileOpen] = useState(false);

  // Scroll: show border when user scrolls past 12px
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Active section: use IntersectionObserver with a root margin that fires
  // when a section hits the upper 20% of the viewport.
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const visible = new Map<string, number>();

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            visible.set(id, entry.intersectionRatio);
          } else {
            visible.delete(id);
          }
          // Pick the section with the highest intersection ratio
          if (visible.size > 0) {
            const best = [...visible.entries()].sort((a, b) => b[1] - a[1])[0][0];
            setActiveSection(best);
          }
        },
        { threshold: [0, 0.1, 0.25, 0.5], rootMargin: '-60px 0px -40% 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // Close mobile nav on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);

    if (href === '/' || href.startsWith('/#') || href === '/writing') {
      window.location.assign(href);
      return;
    }

    // Small delay to let drawer close before scrolling
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }, 80);
  };

  return (
    <>
      <nav className={`nav-root${scrolled ? 'scrolled' : ''}`} aria-label="Site navigation">
        {/* Left: identity block */}
        <Link href="/" style={{ textDecoration: 'none' }} onClick={() => setMobileOpen(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '0.9375rem',
                color: 'var(--text-primary)',
                letterSpacing: '-0.022em',
                lineHeight: 1.2,
              }}
            >
              Oscar Ndugbu
            </span>
            {/* B09 fix: "Portfolio •" → positioning tagline */}
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.595rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.07em',
              }}
            >
              Production AI systems · Full-stack execution
            </span>
          </div>
        </Link>

        {/* Desktop: links + CTA */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '28px' }}
          className="hidden-mobile"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`nav-link${link.href.startsWith('/#') && activeSection === link.href.slice(2) ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href);
              }}
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/#contact"
            className="btn-primary"
            style={{ padding: '8px 18px', fontSize: '0.8rem', letterSpacing: '0.01em' }}
            onClick={() => setMobileOpen(false)}
          >
            Get in touch
          </Link>
        </div>

        {/* Mobile: hamburger */}
        <button
          className={`show-mobile hamburger-btn${mobileOpen ? 'hamburger-open' : ''}`}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            alignItems: 'center',
          }}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </nav>

      {/* Mobile nav drawer */}
      <div
        className={`mobile-nav${mobileOpen ? 'open' : ''}`}
        aria-hidden={!mobileOpen}
        role="navigation"
        aria-label="Mobile navigation"
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="mobile-nav-link"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick(link.href);
            }}
          >
            {link.label}
          </a>
        ))}
        <a
          href="mailto:scardubu@gmail.com"
          className="btn-primary"
          style={{ marginTop: '8px', justifyContent: 'center' }}
          onClick={() => setMobileOpen(false)}
        >
          Hire me
        </a>
      </div>

      {/* Inline responsive display utils — avoid Tailwind config dependency */}
      <style>{`
        .hidden-mobile { display: flex; }
        .show-mobile   { display: none; }
        @media (max-width: 767px) {
          .hidden-mobile { display: none !important; }
          .show-mobile   { display: flex !important; }
        }
      `}</style>
    </>
  );
}
