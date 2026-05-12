// CONVICTION ENGINE v27.0 — Footer
//
// v27 vs v26:
//   LOCATION FIX: "Shipped in Abuja" → "Shipped in Lagos". Oscar is Lagos-based.
//     UBEC (Abuja) is a past employer. Footer trust strip reflects current location.
//   MOBILE COMPACT: py-10 → py-8; gap-10 → gap-8.
//     Reduces accumulated bottom whitespace on mobile before body padding-bottom.
//   GRID: Mobile stacked → 2-col sm (Nav + Connect side-by-side) → 3-col lg.
//   FOOTER GLOW: Subtle teal gradient behind the bottom strip for cinematic depth.
'use client';

import Link from 'next/link';

const NAV_LINKS = [
  { label: 'Projects', href: '#section-projects' },
  { label: 'Writing',  href: '#section-writing'  },
  { label: 'Skills',   href: '#skills'            },
  { label: 'About',    href: '#section-about'     },
  { label: 'Contact',  href: '#section-contact'   },
] as const;

const SOCIAL_LINKS = [
  { label: 'GitHub',       href: 'https://github.com/Scardubu',       external: true },
  { label: 'LinkedIn',     href: 'https://linkedin.com/in/oscardubu',  external: true },
  { label: 'scardubu.dev', href: 'https://scardubu.dev',               external: true },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      aria-label="Site footer"
      className="relative border-t overflow-hidden"
      style={{ borderColor: 'var(--color-border)' }}
    >
      {/* Subtle ambient glow — desktop only */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden lg:block"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 20% 100%, oklch(70% 0.21 188 / 0.04) 0%, transparent 70%)',
        }}
      />

      {/* ── Main grid ─────────────────────────────────────────────────────── */}
      <div className="container relative py-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr] lg:gap-16 lg:py-10">

        {/* Brand — full width on mobile/sm, 2fr on lg */}
        <div className="sm:col-span-2 lg:col-span-1 flex flex-col gap-4">
          <div>
            <Link
              href="/"
              className="inline-block font-display text-base font-bold tracking-tight transition hover:opacity-80"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Oscar Ndugbu
            </Link>
            <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              Lagos-built. Globally deployed.{' '}
              <span style={{ color: 'var(--color-text-muted)' }}>
                Battle-tested in audit season.
              </span>
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <p
              className="flex items-center gap-2 font-mono text-[10px]"
              style={{ color: 'oklch(93% 0.006 264 / 0.38)' }}
            >
              <span
                className="inline-block h-1.5 w-1.5 rounded-full shrink-0"
                style={{ background: 'var(--color-success)' }}
                aria-hidden="true"
              />
              All systems operational
            </p>
            <p className="font-mono text-[10px]" style={{ color: 'oklch(93% 0.006 264 / 0.22)' }}>
              TaxBridge · SabiScore · SwarmXQ · Hashablanca
            </p>
            <p className="font-mono text-[10px]" style={{ color: 'oklch(93% 0.006 264 / 0.18)' }}>
              © 2024–{year} Oscar Ndugbu · Next.js 15
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav aria-label="Footer navigation">
          <p
            className="mb-3 font-mono text-[10px] tracking-widest uppercase"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Navigation
          </p>
          <ul className="flex flex-col gap-0.5" role="list">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href} role="listitem">
                <a
                  href={href}
                  className="inline-flex min-h-10 items-center text-sm transition-colors hover:text-white"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Connect */}
        <div className="flex flex-col gap-4">
          <div>
            <p
              className="mb-3 font-mono text-[10px] tracking-widest uppercase"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Connect
            </p>
            <ul className="flex flex-col gap-0.5" role="list">
              {SOCIAL_LINKS.map(({ label, href, external }) => (
                <li key={href} role="listitem">
                  <a
                    href={href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    className="inline-flex min-h-10 items-center text-sm transition-colors hover:text-white"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {label}
                  </a>
                </li>
              ))}
              <li role="listitem">
                <a
                  href="/cv/oscar-ndugbu-resume.pdf"
                  download
                  className="inline-flex min-h-10 items-center gap-1.5 text-sm transition-colors hover:text-white"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Resume{' '}
                  <span aria-hidden="true" style={{ color: 'var(--color-text-muted)' }}>
                    ↓
                  </span>
                </a>
              </li>
            </ul>
          </div>

          <a
            href="mailto:scardubu@gmail.com"
            className="cta-primary w-full sm:w-auto"
            aria-label="Email Oscar to start a conversation"
          >
            <span
              className="inline-block h-2 w-2 rounded-full shrink-0"
              style={{ background: 'var(--color-success)' }}
              aria-hidden="true"
            />
            Start a conversation
          </a>
        </div>
      </div>

      {/* ── Bottom strip ──────────────────────────────────────────────────── */}
      <div
        className="border-t py-4"
        style={{ borderColor: 'var(--color-border-subtle)' }}
      >
        <div className="container flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
          <p
            className="font-mono text-[9px] tracking-widest uppercase"
            style={{ color: 'oklch(93% 0.006 264 / 0.20)' }}
          >
            Shipped in Lagos · Running globally · Battle-tested in audit season
          </p>
          <p
            className="font-mono text-[9px]"
            style={{ color: 'oklch(93% 0.006 264 / 0.14)' }}
          >
            scardubu.dev
          </p>
        </div>
      </div>
    </footer>
  );
}