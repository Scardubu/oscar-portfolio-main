import Link from 'next/link';
import { GlassCard } from '@/components/GlassCard';

const engagementModes = [
  {
    title: 'Full-time Staff+',
    description:
      'Staff-level ownership where model quality, platform reliability, and product clarity all matter at once.',
  },
  {
    title: 'Technical Co-founder',
    description:
      'Early-stage build partnership for products where technical depth and execution speed are the moat.',
  },
  {
    title: 'Select Consulting',
    description:
      'Focused engagements across inference services, observability, retrieval systems, and production ML debugging.',
  },
];

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.88c-2.77.6-3.35-1.18-3.35-1.18-.46-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.54 2.36 1.1 2.93.84.09-.65.35-1.1.63-1.36-2.21-.25-4.54-1.1-4.54-4.92 0-1.09.39-1.98 1.03-2.67-.1-.25-.45-1.28.1-2.66 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.9-1.29 2.74-1.02 2.74-1.02.56 1.38.21 2.41.11 2.66.64.69 1.03 1.58 1.03 2.67 0 3.83-2.33 4.66-4.56 4.91.36.31.67.92.67 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
      <path d="M4.98 3.5a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5ZM3.5 8.75h2.96V20.5H3.5V8.75Zm7.17 0h2.84v1.6h.04c.39-.75 1.37-1.85 2.82-1.85 3.02 0 3.58 1.98 3.58 4.56v7.44H17V14c0-1.5-.03-3.42-2.08-3.42-2.08 0-2.4 1.63-2.4 3.31v6.61h-2.85V8.75Z" />
    </svg>
  );
}

export function ContactSection() {
  return (
    <section id="contact" className="py-20 sm:py-24">
      <div className="container">
        <div
          className="glass-no-hover inline-flex items-center gap-3 rounded-[999px] px-5 py-3 text-sm text-white/75"
          role="status"
          aria-live="polite"
          data-reveal=""
        >
          <span className="live-dot" aria-hidden="true" />
          Open — responding within 48 hours
        </div>

        <div className="mt-6 max-w-2xl">
          <span className="label" data-reveal="" data-reveal-delay="1">
            Contact
          </span>
          <h2 className="text-4xl text-white sm:text-5xl" data-reveal="" data-reveal-delay="2">
            Let&apos;s Build Something
          </h2>
          <p className="mt-4 text-lg text-white/65" data-reveal="" data-reveal-delay="3">
            Open to Staff+, technical co-founder, and select consulting conversations where the work
            has to survive real traffic, real users, and real operational constraints.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {engagementModes.map((mode, index) => (
            <GlassCard
              key={mode.title}
              className="p-6"
              data-reveal=""
              data-reveal-delay={String(index + 1)}
            >
              <h3 className="text-2xl text-white">{mode.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/65">{mode.description}</p>
            </GlassCard>
          ))}
        </div>

        <div
          className="mt-10 flex flex-wrap items-center gap-4"
          data-reveal=""
          data-reveal-delay="4"
        >
          <GlassCard as="article" className="p-0" hover={false}>
            <Link
              href="mailto:oscar@scardubu.dev"
              className="inline-flex items-center rounded-[inherit] px-5 py-3 text-sm font-medium text-white"
            >
              oscar@scardubu.dev
            </Link>
          </GlassCard>
          <Link
            href="https://github.com/Scardubu"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Oscar Scardubu GitHub profile"
            className="inline-flex items-center gap-2 text-sm text-white/75 transition hover:text-white"
          >
            <GitHubIcon />
            GitHub
          </Link>
          <Link
            href="https://linkedin.com/in/oscardubu"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Oscar Scardubu LinkedIn profile"
            className="inline-flex items-center gap-2 text-sm text-white/75 transition hover:text-white"
          >
            <LinkedInIcon />
            LinkedIn
          </Link>
        </div>
      </div>
    </section>
  );
}
