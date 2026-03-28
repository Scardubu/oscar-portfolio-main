// components/sections/Nav.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { contact } from '@/lib/data'

const NAV_LINKS = [
  { label: 'Work',      href: '#projects'     },
  { label: 'Skills',    href: '#skills'        },
  { label: 'Patterns',  href: '#patterns'      },
  { label: 'Activity',  href: '#activity'      },
  { label: 'Contact',   href: '#contact'       },
]

export default function Nav() {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      role="banner"
      className="fixed top-0 inset-x-0 z-[var(--z-sticky)] transition-all duration-300"
      style={{
        background:      scrolled ? 'rgba(5,5,7,0.88)' : 'transparent',
        backdropFilter:  scrolled ? 'blur(20px) saturate(1.6)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(1.6)' : 'none',
        borderBottom:    scrolled ? '1px solid var(--border-subtle)' : '1px solid transparent',
      }}
    >
      <nav
        className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between gap-8"
        aria-label="Main navigation"
      >
        {/* Wordmark */}
        <Link
          href="/"
          className="font-mono font-bold text-sm"
          style={{ color: 'var(--text-primary)', textDecoration: 'none' }}
          aria-label="Oscar Ndugbu — home"
        >
          <span style={{ color: 'var(--accent-primary)' }}>oscar</span>
          <span style={{ color: 'var(--text-muted)' }}>@</span>
          <span>scardubu</span>
          <span
            className="animate-blink ml-0.5 inline-block w-0.5 h-4 align-middle"
            style={{ background: 'var(--accent-primary)' }}
            aria-hidden="true"
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="nav-link"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={contact.calendar}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary text-sm px-5 py-2"
          >
            Book a Call
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden btn btn-ghost p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label="Toggle menu"
        >
          <div className="w-5 flex flex-col gap-1">
            <span
              className="block h-px rounded-full transition-all duration-200"
              style={{
                background:  'var(--text-primary)',
                transform:    menuOpen ? 'rotate(45deg) translateY(4px)' : undefined,
              }}
            />
            <span
              className="block h-px rounded-full transition-all duration-200"
              style={{
                background: 'var(--text-primary)',
                opacity:     menuOpen ? 0 : 1,
              }}
            />
            <span
              className="block h-px rounded-full transition-all duration-200"
              style={{
                background: 'var(--text-primary)',
                transform:   menuOpen ? 'rotate(-45deg) translateY(-4px)' : undefined,
              }}
            />
          </div>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden border-t"
          style={{ background: 'rgba(5,5,7,0.97)', borderColor: 'var(--border-subtle)' }}
        >
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-4">
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link text-base"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href={contact.calendar}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary mt-2"
              onClick={() => setMenuOpen(false)}
            >
              Book a Call
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

// ── Footer ────────────────────────────────────────────────────────────

export function Footer() {
  return (
    <footer
      className="border-t py-10"
      style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-surface)' }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-caption" style={{ color: 'var(--text-muted)' }}>
          © {new Date().getFullYear()} Oscar Ndugbu · Built with Next.js 15 · Lagos, Nigeria
        </p>
        <div className="flex items-center gap-4">
          {[
            { label: 'GitHub',   href: contact.github   },
            { label: 'LinkedIn', href: contact.linkedin  },
            { label: 'Email',    href: `mailto:${contact.email}` },
          ].map(link => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="text-caption hover:text-primary transition-colors"
              style={{ color: 'var(--text-muted)', textDecoration: 'none' }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}