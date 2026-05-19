// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture

'use client';

import Link from 'next/link';

import { SystemStatus } from '@/components/SystemStatus';
import { CONTACT_EMAIL, CV_ASSET_PATH, anchorUrl } from '@/lib/config';

const NAV_LINKS = [
  { label: 'Projects', href: anchorUrl('section-projects') },
  { label: 'Open Source', href: anchorUrl('open-source') },
  { label: 'Skills', href: anchorUrl('skills') },
  { label: 'About', href: anchorUrl('section-about') },
  { label: 'Writing', href: anchorUrl('section-writing') },
  { label: 'Contact', href: anchorUrl('section-contact') },
] as const;

const SOCIAL_LINKS = [
  { label: 'GitHub',   href: 'https://github.com/Scardubu',       external: true  },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/oscardubu', external: true  },
  { label: 'Email',    href: `mailto:${CONTACT_EMAIL}`,           external: false },
] as const;

export function Footer() {
  const year = new Date().getFullYear();
  const mailHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    'Project constraints — let’s build',
  )}`;

  return (
    <footer
      role="contentinfo"
      aria-label="Site footer"
      className="relative overflow-hidden border-t"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden lg:block"
        style={{
          background:
            'radial-gradient(ellipse 65% 45% at 18% 100%, oklch(70% 0.21 188 / 0.05) 0%, transparent 75%)',
        }}
      />

      <div className="container relative grid gap-6 py-8 sm:gap-8 sm:py-10 lg:grid-cols-[2fr_1fr_1fr] lg:gap-16 lg:py-12">
        {/* Brand / thesis */}
        <div className="flex min-w-0 flex-col gap-5 lg:col-span-1">
          <div className="min-w-0">
            <Link
              href="/"
              className="inline-block text-[17px] font-bold tracking-[-0.02em] transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-film-teal)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent active:scale-[0.985]"
              style={{ color: 'var(--color-text-primary)' }}
              aria-label="Oscar Ndugbu home"
            >
              Oscar Ndugbu
            </Link>

            <p
              className="mt-1.5 max-w-[34ch] text-[15px] leading-relaxed"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Lagos-built. Globally deployed.{' '}
              <span style={{ color: 'var(--color-text-muted)' }}>
                Battle-tested in audit season.
              </span>
            </p>

            <p
              className="mt-2 font-mono text-[10px] font-medium tracking-[0.5px]"
              style={{ color: 'oklch(70% 0.21 188 / 0.58)' }}
            >
              Constraint is the credential.
            </p>
          </div>

          <div className="flex flex-col gap-1 font-mono text-[10px] tracking-wide">
            <p className="flex items-center gap-2" style={{ color: 'oklch(93% 0.006 264 / 0.42)' }}>
              <SystemStatus showLabel={false} />
              <span>All systems operational</span>
            </p>
            <p style={{ color: 'oklch(93% 0.006 264 / 0.24)' }}>
              TaxBridge · SabiScore · SwarmXQ
            </p>
            <p style={{ color: 'oklch(93% 0.006 264 / 0.18)' }}>
              © 2024–{year} Oscar Ndugbu · Next.js 15
            </p>
          </div>
        </div>

        {/* Navigation — hidden on mobile because bottom nav already covers it */}
        <nav aria-label="Footer navigation" className="hidden sm:block">
          <p
            className="mb-3 font-mono text-[10px] tracking-widest uppercase"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Navigation
          </p>

          <ul className="flex flex-col gap-1" role="list">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href} role="listitem">
                <a
                  href={href}
                  className="group inline-flex min-h-11 items-center text-sm transition-colors duration-200 hover:translate-x-1 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-film-teal)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  <span>{label}</span>
                  <span
                    className="ml-1.5 opacity-0 transition-opacity group-hover:opacity-70"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Connect + final CTA */}
        <div className="flex min-w-0 flex-col gap-6">
          <div>
            <p
              className="mb-3 font-mono text-[10px] tracking-widest uppercase"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Connect
            </p>

            <ul className="flex flex-col gap-1" role="list">
              {SOCIAL_LINKS.map(({ label, href, external }) => (
                <li key={href} role="listitem">
                  <a
                    href={href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    className="group inline-flex min-h-11 items-center text-sm transition-colors duration-200 hover:translate-x-1 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-film-teal)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    <span>{label}</span>
                  </a>
                </li>
              ))}

              <li role="listitem">
                <a
                  href={CV_ASSET_PATH}
                  download
                  className="group inline-flex min-h-11 items-center gap-1.5 text-sm transition-colors duration-200 hover:translate-x-1 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-film-teal)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  <span>Resume</span>
                  <span aria-hidden="true" style={{ color: 'var(--color-text-muted)' }}>
                    ↓
                  </span>
                </a>
              </li>
            </ul>
          </div>

          <div className="pt-3">
            <a
              href={mailHref}
              className="cta-primary group flex w-full items-center justify-center gap-3 px-8 py-3.5 text-base font-medium transition-all duration-300 hover:shadow-xl active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-film-teal)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent sm:w-auto"
              aria-label="Tell Oscar your constraints"
            >
              <span
                className="inline-block h-2.5 w-2.5 rounded-full transition-transform group-hover:scale-125 group-active:scale-90"
                style={{ background: 'var(--color-success)' }}
                aria-hidden="true"
              />
              Tell me your constraints
            </a>

            <p
              className="mt-3 text-center font-mono text-[10px] tracking-wider sm:text-left"
              style={{ color: 'oklch(93% 0.006 264 / 0.45)' }}
            >
              Response within 24 hours · no fluff, only signal
            </p>
          </div>
        </div>
      </div>

      <div
        className="border-t py-4 text-[9px] font-mono"
        style={{ borderColor: 'var(--color-border-subtle)' }}
      >
        <div className="container flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
          <p
            className="tracking-[0.5px] uppercase text-balance"
            style={{ color: 'oklch(93% 0.006 264 / 0.22)' }}
          >
            Shipped in Lagos · Running globally · Battle-tested in audit season
          </p>
          <p style={{ color: 'oklch(93% 0.006 264 / 0.16)' }}>scardubu.dev</p>
        </div>
      </div>
    </footer>
  );
}
