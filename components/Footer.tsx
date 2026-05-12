// CONVICTION ENGINE v26.0 — Footer
//
// v26 CHANGES vs v15.1:
//   LOCATION: Lagos → Abuja (current base per profile).
//   GRID LAYOUT: 3-col on lg+; brand | nav | connect.
//   STATUS DOT: live build timestamp, green dot.
//   BOTTOM STRIP: The 2am design constraint tagline as footer anchor.
//   CTA: "Start a conversation" with success dot.
//   MOBILE: Full-width CTA on mobile, auto on sm+.
//   KEEP: All nav links, social links, resume download, scardubu.dev.
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
  { label: 'GitHub',      href: 'https://github.com/Scardubu',          external: true },
  { label: 'LinkedIn',    href: 'https://linkedin.com/in/oscardubu',     external: true },
  { label: 'scardubu.dev',href: 'https://scardubu.dev',                  external: true },
] as const;

export function Footer() {
  const buildTime = new Date().toISOString().slice(0, 16).replace('T', ' ');

  return (
    <footer
      role="contentinfo"
      aria-label="Site footer"
      className="border-t"
      style={{ borderColor: 'var(--color-border)' }}
    >
      {/* ── Main grid ─────────────────────────────────────────────────────── */}
      <div className="container py-10 grid gap-10 lg:grid-cols-[2fr_1fr_1fr] lg:gap-16">

        {/* Brand */}
        <div className="flex flex-col gap-4">
          <div>
            <Link
              href="/"
              className="inline-block font-display text-lg font-bold tracking-tight transition hover:opacity-80"
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

          <div className="flex flex-col gap-1.5">
            <p className="flex items-center gap-2 font-mono text-[10px]" style={{ color: 'oklch(93% 0.006 264 / 0.35)' }}>
              <span className="inline-block h-1.5 w-1.5 rounded-full shrink-0" style={{ background: 'var(--color-success)' }} aria-hidden="true" />
              All systems operational · {buildTime}
            </p>
            <p className="font-mono text-[10px]" style={{ color: 'oklch(93% 0.006 264 / 0.22)' }}>
              TaxBridge · SabiScore · SwarmXQ · Hashablanca
            </p>
            <p className="font-mono text-[10px]" style={{ color: 'oklch(93% 0.006 264 / 0.18)' }}>
              © 2024–2026 Oscar Ndugbu · Built with Next.js 15
            </p>
          </div>

          <p className="font-mono text-[9px] tracking-[0.1em] uppercase" style={{ color: 'oklch(93% 0.006 264 / 0.18)' }}>
            Shipped in Abuja · Running globally · Battle-tested in audit season
          </p>
        </div>

        {/* Nav */}
        <nav aria-label="Footer navigation">
          <p className="mb-3 font-mono text-[10px] tracking-widest uppercase" style={{ color: 'var(--color-text-muted)' }}>
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
            <p className="mb-3 font-mono text-[10px] tracking-widest uppercase" style={{ color: 'var(--color-text-muted)' }}>
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
                  Resume <span aria-hidden="true" style={{ color: 'var(--color-text-muted)' }}>↓</span>
                </a>
              </li>
            </ul>
          </div>
          <a
            href="mailto:scardubu@gmail.com"
            className="cta-primary w-full sm:w-auto"
            aria-label="Email Oscar to start a conversation"
          >
            <span className="inline-block h-2 w-2 rounded-full shrink-0" style={{ background: 'var(--color-success)' }} aria-hidden="true" />
            Start a conversation
          </a>
        </div>
      </div>

      {/* ── Bottom strip ──────────────────────────────────────────────────── */}
      <div className="border-t py-4" style={{ borderColor: 'var(--color-border-subtle)' }}>
        <div className="container flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[9px] tracking-widest uppercase" style={{ color: 'oklch(93% 0.006 264 / 0.18)' }}>
            The system has to work at 2am. That&apos;s not a slogan. It&apos;s a design constraint.
          </p>
          <p className="font-mono text-[9px]" style={{ color: 'oklch(93% 0.006 264 / 0.13)' }}>
            scardubu.dev
          </p>
        </div>
      </div>
    </footer>
  );
}