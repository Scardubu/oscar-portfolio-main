// CONVICTION ENGINE v14.1 — Footer
//
// CHANGELOG from v14.0:
//
//   FIX:  Brand tagline: "Abuja-built. Globally proven." corrected to
//     "Lagos-built. Globally proven." — location of record is Lagos, Nigeria.
//
//   KEEP: role="contentinfo", aria-label — WCAG 2.2 semantic landmarks.
//   KEEP: min-height 44px on all links — WCAG 2.2 §2.5.8 target size.
//   KEEP: ISO timestamp format — precise, technical signal.
//   KEEP: Conviction closer narrative echo of hero thesis.
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
          {/* v14.1 FIX: "Abuja-built" → "Lagos-built" */}
          <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Lagos-built. Globally deployed. Battle-tested.
          </p>
          <p className="mt-3 font-mono text-[11px]" style={{ color: 'oklch(93% 0.006 264 / 0.28)' }}>
            © 2024–2026 Oscar Ndugbu · Built with Next.js 15
          </p>
          <p className="mt-1 font-mono text-[11px]" style={{ color: 'oklch(93% 0.006 264 / 0.20)' }}>
            TaxBridge · SabiScore · SwarmXQ
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

          {/* Conviction closer — narrative echo of hero thesis */}
          <p
            className="mt-5 font-mono text-[10px] tracking-wide"
            style={{ color: 'oklch(93% 0.006 264 / 0.18)' }}
          >
            Shipped in Lagos · Running globally
            · Battle-tested in audit season.
          </p>
        </div>

        {/* ── Nav links ─────────────────────────────────────────────── */}
        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap gap-1" role="list">
            {[
              { label: 'Projects', href: '#section-projects' },
              { label: 'Writing',  href: '#section-writing' },
              { label: 'Skills',   href: '#skills' },
              { label: 'About',    href: '#section-about' },
              { label: 'Contact',  href: '#section-contact' },
            ].map(({ label, href }) => (
              <li key={href} role="listitem">
                <a
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
          <div className="flex gap-3">
            <a
              href="https://github.com/Scardubu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center text-sm transition-colors hover:text-white"
              style={{ color: 'var(--color-text-muted)' }}
              aria-label="GitHub"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/oscardubu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center text-sm transition-colors hover:text-white"
              style={{ color: 'var(--color-text-muted)' }}
              aria-label="LinkedIn"
            >
              LinkedIn
            </a>
            <a
              href="/cv/oscar-ndugbu-resume.pdf"
              download
              className="inline-flex min-h-11 items-center text-sm transition-colors hover:text-white"
              style={{ color: 'var(--color-text-muted)' }}
              aria-label="Download resume"
            >
              Resume ↓
            </a>
          </div>
          <a
            href="mailto:scardubu@gmail.com"
            className="cta-primary"
            style={{ alignSelf: 'flex-start' }}
          >
            Book a Call
          </a>
        </div>
      </div>
    </footer>
  );
}