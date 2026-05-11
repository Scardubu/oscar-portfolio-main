// CONVICTION ENGINE v15.0 — Footer
//
// v15 CHANGES vs v14.1:
//   CTA: "Book a Call" → "Start a conversation" — consistent with ContactSection v17.
//   LINKS: Added scardubu.dev as a direct portfolio link in the social block.
//   BRAND: Tagline upgraded to "Lagos-built. Globally deployed. Battle-tested in audit season."
//   PROJECTS: Hashablanca added back alongside TaxBridge · SabiScore · SwarmXQ.
//   KEEP: All WCAG 2.2 min-height 44px link targets, ISO timestamp, aria landmarks.
//
'use client';

export function Footer() {
  const buildTime = new Date().toISOString().slice(0, 16).replace('T', ' ');

  return (
    <footer
      role="contentinfo"
      aria-label="Site footer"
      className="border-t py-10"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="container flex flex-col justify-between gap-8 lg:flex-row lg:items-start">

        {/* ── Brand block ──────────────────────────────────────────── */}
        <div>
          <p
            className="font-display text-lg font-bold tracking-tight"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Oscar Ndugbu
          </p>
          <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Lagos-built. Globally deployed. Battle-tested in audit season.
          </p>
          <p className="mt-3 font-mono text-[11px]" style={{ color: 'oklch(93% 0.006 264 / 0.28)' }}>
            © 2024–2026 Oscar Ndugbu · Built with Next.js 15
          </p>
          <p className="mt-1 font-mono text-[11px]" style={{ color: 'oklch(93% 0.006 264 / 0.20)' }}>
            TaxBridge · SabiScore · SwarmXQ · Hashablanca
          </p>
          <p
            className="mt-1.5 flex items-center gap-2 font-mono text-[10px]"
            style={{ color: 'oklch(93% 0.006 264 / 0.22)' }}
          >
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: 'var(--color-success)' }}
              aria-hidden="true"
            />
            All systems operational · {buildTime}
          </p>
          <p
            className="mt-5 font-mono text-[10px] tracking-wide"
            style={{ color: 'oklch(93% 0.006 264 / 0.18)' }}
          >
            Shipped in Lagos · Running globally · Battle-tested in audit season.
          </p>
        </div>

        {/* ── Nav links ─────────────────────────────────────────────── */}
        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap gap-1" role="list">
            {[
              { label: 'Projects', href: '#section-projects' },
              { label: 'Writing',  href: '#section-writing'  },
              { label: 'Skills',   href: '#skills'           },
              { label: 'About',    href: '#section-about'    },
              { label: 'Contact',  href: '#section-contact'  },
            ].map(({ label, href }) => (
              <li key={href} role="listitem">
                
                  href={href}
                  className="inline-flex min-h-11 items-center px-3 py-3 text-sm transition-colors hover:text-white"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── Social + CTA ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            
              href="https://github.com/Scardubu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center text-sm transition-colors hover:text-white"
              style={{ color: 'var(--color-text-muted)' }}
              aria-label="GitHub"
            >
              GitHub
            </a>
            
              href="https://linkedin.com/in/oscardubu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center text-sm transition-colors hover:text-white"
              style={{ color: 'var(--color-text-muted)' }}
              aria-label="LinkedIn"
            >
              LinkedIn
            </a>
            
              href="https://scardubu.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center text-sm transition-colors hover:text-white"
              style={{ color: 'var(--color-text-muted)' }}
              aria-label="Portfolio site"
            >
              scardubu.dev
            </a>
            
              href="/cv/oscar-ndugbu-resume.pdf"
              download
              className="inline-flex min-h-11 items-center text-sm transition-colors hover:text-white"
              style={{ color: 'var(--color-text-muted)' }}
              aria-label="Download resume"
            >
              Resume ↓
            </a>
          </div>
          
            href="mailto:scardubu@gmail.com"
            className="cta-primary"
            style={{ alignSelf: 'flex-start' }}
          >
            Start a conversation
          </a>
        </div>
      </div>
    </footer>
  );
}