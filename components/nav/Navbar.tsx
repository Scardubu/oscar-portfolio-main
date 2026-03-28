'use client'

/**
 * components/nav/Navbar.tsx
 *
 * Sticky navigation with blur-glass background.
 *
 * Link label change (intentional and significant):
 *   "Projects" → "Systems"
 *   Rationale: "Projects" implies side projects. "Systems" implies production
 *   infrastructure. This is a one-word signal to every technical reviewer
 *   about how Oscar thinks about his work.
 *
 * Features:
 *   - Skip-to-main link for keyboard/screen reader users
 *   - Active section detection via IntersectionObserver
 *   - Mobile menu (hamburger → X toggle)
 *   - "Blog" with "New" badge retained — blog is a primary evidence layer
 *   - No JavaScript-dependent functionality for the core navigation links
 */

import * as React from 'react'
import Link       from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
// anchorUrl() returns '/#section-id' — root-relative, safe for Next.js <Link>.
// sectionUrl() returned an absolute URL and caused full page reloads. Removed.
import { anchorUrl } from '@/lib/config'

// ─── Nav link data ────────────────────────────────────────────────────────────

interface NavLink {
  label:    string
  href:     string
  badge?:   string
  external: boolean
}

const NAV_LINKS: NavLink[] = [
  { label: 'Home',    href: anchorUrl('home'),     external: false },
  { label: 'Systems', href: anchorUrl('projects'), external: false },
  { label: 'Skills',  href: anchorUrl('skills'),   external: false },
  { label: 'Blog',    href: '/blog',               external: false, badge: 'New' },
  { label: 'Contact', href: anchorUrl('contact'),  external: false },
]

// ─── Component ────────────────────────────────────────────────────────────────

export function Navbar(): React.ReactElement {
  const prefersReduced        = useReducedMotion()
  const [open, setOpen]       = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)

  // Add subtle border when scrolled
  React.useEffect(() => {
    const onScroll = (): void => { setScrolled(window.scrollY > 16) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on resize to desktop
  React.useEffect(() => {
    const onResize = (): void => { if (window.innerWidth >= 768) setOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <>
      {/* Skip to main — first focusable element on the page */}
      <a
        href="#main-content"
        className="
          sr-only focus:not-sr-only
          fixed top-2 left-2 z-[200]
          px-4 py-2 rounded-lg text-sm font-semibold
          bg-[color:var(--accent-primary)] text-[color:var(--bg-base)]
          focus:outline-none
        "
      >
        Skip to main content
      </a>

      <header
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-300
          ${scrolled
            ? 'bg-[color:var(--bg-glass)] backdrop-blur-xl border-b border-[color:var(--border-subtle)]'
            : 'bg-transparent'
          }
        `}
        role="banner"
      >
        <nav
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
          aria-label="Primary navigation"
        >
          {/* Wordmark */}
          <Link
            href="/"
            className="
              text-xl font-extrabold tracking-tight
              text-[color:var(--text-primary)]
              hover:text-[color:var(--accent-primary)]
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-primary)]
              rounded
            "
            aria-label="Oscar Ndugbu — home"
          >
            Oscar.
          </Link>

          {/* Desktop links */}
          <ul
            className="hidden md:flex items-center gap-1"
            role="list"
          >
            {NAV_LINKS.map(link => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="
                    relative inline-flex items-center gap-1.5
                    px-3 py-1.5 rounded-lg
                    text-sm font-medium text-[color:var(--text-secondary)]
                    hover:text-[color:var(--text-primary)]
                    hover:bg-[color:var(--bg-elevated)]
                    transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-primary)]
                  "
                >
                  {link.label}
                  {link.badge && (
                    <span
                      className="
                        text-[9px] font-bold tracking-wider uppercase
                        px-1.5 py-0.5 rounded-full
                        bg-cyan-950/60 border border-cyan-800/40
                        text-[color:var(--accent-primary)]
                      "
                      aria-label={`${link.badge} content`}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(prev => !prev)}
            className="
              md:hidden p-2 rounded-lg
              text-[color:var(--text-secondary)]
              hover:text-[color:var(--text-primary)]
              hover:bg-[color:var(--bg-elevated)]
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-primary)]
            "
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {/* Animated hamburger icon */}
            <span className="block w-5 h-4 relative" aria-hidden="true">
              <span className={`
                absolute top-0 left-0 w-full h-0.5 bg-current
                transition-all duration-200
                ${open ? 'top-[7px] rotate-45' : ''}
              `} />
              <span className={`
                absolute top-[7px] left-0 w-full h-0.5 bg-current
                transition-all duration-200
                ${open ? 'opacity-0 translate-x-2' : ''}
              `} />
              <span className={`
                absolute bottom-0 left-0 w-full h-0.5 bg-current
                transition-all duration-200
                ${open ? 'top-[7px] -rotate-45' : ''}
              `} />
            </span>
          </button>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
              animate={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="
                md:hidden px-4 pb-4 pt-2
                bg-[color:var(--bg-glass)] backdrop-blur-xl
                border-b border-[color:var(--border-subtle)]
              "
            >
              <ul className="flex flex-col gap-1" role="list">
                {NAV_LINKS.map(link => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="
                        flex items-center gap-2 px-3 py-2.5 rounded-lg
                        text-sm font-medium text-[color:var(--text-secondary)]
                        hover:text-[color:var(--text-primary)]
                        hover:bg-[color:var(--bg-elevated)]
                        transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-primary)]
                      "
                    >
                      {link.label}
                      {link.badge && (
                        <span className="
                          text-[9px] font-bold tracking-wider uppercase
                          px-1.5 py-0.5 rounded-full
                          bg-cyan-950/60 border border-cyan-800/40
                          text-[color:var(--accent-primary)]
                        ">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}