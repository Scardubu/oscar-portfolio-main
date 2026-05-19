// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture
'use client';

import { m, useInView, useReducedMotion } from 'framer-motion';
import { type ChangeEvent, type FormEvent, useMemo, useRef, useState } from 'react';

import { CopyEmail } from '@/components/CopyEmail';
import { CONTACT_EMAIL, CV_ASSET_PATH } from '@/lib/config';
import { cardReveal, clipReveal, fadeRise, noMotion, staggerContainer } from '@/lib/motionVariants';
import React from 'react';

const CONTACT_CARDS = [
  {
    id: 'staff-plus',
    title: 'STAFF+ / PRINCIPAL',
    headline: 'Full-stack delivery · mobile app through production API',
    body: 'Staff+ and Principal roles at fintech and AI-native companies. Ownership of the entire surface — React Native mobile, Next.js dashboard, Fastify API, PostgreSQL RLS data layer. Multi-tenant isolation and zero-downtime deployments are baseline, not negotiated features.',
    objection:
      'TypeScript 5 · Effect-TS · React Native Expo 54 · Next.js 15 · Spring Boot · FastAPI · Turborepo.',
    accentColor: 'var(--color-success)',
  },
  {
    id: 'technical-cofounder',
    title: 'TECHNICAL CO-FOUNDER',
    headline: 'Pre-seed to Series A · Africa / emerging markets',
    body: 'Four years shipping production platforms from scratch under compliance pressure — NRS/DigiTax 2026, NDPC, and FIRS audit requirements. Systems that hold through due diligence, not just through the demo.',
    objection:
      'The system should outlast the seed deck. Available for full-time equity engagements.',
    accentColor: 'var(--color-accent)',
  },
  {
    id: 'consulting',
    title: 'INFRASTRUCTURE CONSULTING',
    headline: 'Production reliability · compliance remediation · ML backends',
    body: 'Deliverable-led, not hourly. Scoped engagements: incident remediation, architecture review, Nigerian tax compliance (NRS 2026 / FIRS DigiTax), ML inference optimisation, and multi-tenant PostgreSQL RLS implementation.',
    objection:
      'You get working infrastructure and documented decisions — not a billable-hour report.',
    accentColor: 'var(--color-cyan)',
  },
] as const;

const TRUST_BADGES = [
  'Shipped in Lagos',
  'Running globally',
  'Battle-tested in audit season',
  'NRS · NDPC Compliant',
] as const;

// V1.0 §Form State Copy — field validation messages (hoisted: static, no closure deps)
const FIELD_ERRORS: Record<string, string> = {
  name: "Your name helps me know who I'm writing to.",
  email: 'Need a working address to respond.',
  inquiryType: 'Select the best fit — it shapes the response.',
  message: 'This is the important part — describe the constraint.',
};

const INQUIRY_TYPES = [
  { value: 'job', label: 'Staff+ / Full-time role' },
  { value: 'consulting', label: 'Consulting / Contract' },
  { value: 'collaboration', label: 'Co-founder' },
  { value: 'advisory', label: 'Advisory' },
] as const;

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

/* ── Inline contact form ─────────────────────────────────────────────────── */
type FormState = 'idle' | 'loading' | 'success' | 'error';

interface FormValues {
  name: string;
  email: string;
  company: string;
  inquiryType: string;
  message: string;
}

function ContactForm() {
  const [state, setState] = useState<FormState>('idle');
  const [values, setValues] = useState<FormValues>({
    name: '',
    email: '',
    company: '',
    inquiryType: 'job',
    message: '',
  });
  // Change 1d — V1.0: field-level validation errors per spec §Form State Copy
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormValues, string>>>({});

  function handleBlur(
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    if (!value.trim()) {
      setFieldErrors((prev) => ({ ...prev, [name]: FIELD_ERRORS[name] }));
    } else {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === 'loading') return;

    setState('loading');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, honeypot: '' }),
      });

      if (!res.ok) {
        const json = (await res.json()) as { error?: string };
        throw new Error(json.error ?? `HTTP ${res.status}`);
      }

      setState('success');
      setValues({ name: '', email: '', company: '', inquiryType: 'job', message: '' });
    } catch {
      setState('error');
    }
  }

  if (state === 'success') {
    return (
      <div
        className="flex flex-col items-center justify-center gap-4 rounded-[var(--radius-xl)] border p-8 text-center sm:p-10"
        style={{
          borderColor: 'oklch(65% 0.18 155 / 0.4)',
          background: 'oklch(65% 0.18 155 / 0.06)',
        }}
        role="status"
        aria-live="polite"
      >
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full"
          style={{ background: 'oklch(65% 0.18 155 / 0.15)' }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-color-success"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="font-display text-color-text-primary text-lg font-bold">
          Constraint received.
        </p>
        <p className="text-color-text-secondary max-w-[40ch] text-sm leading-7">
          I&apos;ll review and respond within 24 hours — usually faster.
        </p>
        <button
          type="button"
          onClick={() => setState('idle')}
          className="text-color-text-muted mt-2 min-h-[48px] px-4 font-mono text-xs tracking-widest uppercase transition hover:opacity-70"
          aria-label="Send another message"
        >
          Send another ↩
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="rounded-[var(--radius-xl)] border p-5 sm:p-7"
      style={{ borderColor: 'var(--color-border)', background: 'oklch(100% 0 0 / 0.02)' }}
      noValidate
      aria-label="Contact Oscar Ndugbu"
    >
      <p className="label-mono text-color-film-teal mb-5">START A CONVERSATION</p>

      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <div className="contact-field-group">
          <label htmlFor="cf-name" className="contact-field-label">
            Name{' '}
            <span aria-hidden="true" className="text-color-success">
              *
            </span>
          </label>
          <input
            id="cf-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            minLength={2}
            maxLength={50}
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Your name"
            className="contact-field-input"
            disabled={state === 'loading'}
          />
          {fieldErrors.name && (
            <p className="text-2xs text-color-film-teal mt-1 font-mono" role="alert">
              {fieldErrors.name}
            </p>
          )}
        </div>

        <div className="contact-field-group">
          <label htmlFor="cf-email" className="contact-field-label">
            Email{' '}
            <span aria-hidden="true" className="text-color-success">
              *
            </span>
          </label>
          <input
            id="cf-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="you@company.com"
            className="contact-field-input"
            disabled={state === 'loading'}
          />
          {fieldErrors.email && (
            <p className="text-2xs text-color-film-teal mt-1 font-mono" role="alert">
              {fieldErrors.email}
            </p>
          )}
        </div>
      </div>

      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <div className="contact-field-group">
          <label htmlFor="cf-company" className="contact-field-label">
            Company <span className="contact-field-optional">(optional)</span>
          </label>
          <input
            id="cf-company"
            name="company"
            type="text"
            autoComplete="organization"
            maxLength={80}
            value={values.company}
            onChange={handleChange}
            placeholder="Company or project"
            className="contact-field-input"
            disabled={state === 'loading'}
          />
        </div>

        <div className="contact-field-group">
          <label htmlFor="cf-type" className="contact-field-label">
            Inquiry type{' '}
            <span aria-hidden="true" className="text-color-success">
              *
            </span>
          </label>
          <select
            id="cf-type"
            name="inquiryType"
            required
            value={values.inquiryType}
            onChange={handleChange}
            onBlur={handleBlur}
            className="contact-field-input contact-field-select"
            disabled={state === 'loading'}
          >
            {INQUIRY_TYPES.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {fieldErrors.inquiryType && (
            <p className="text-2xs text-color-film-teal mt-1 font-mono" role="alert">
              {fieldErrors.inquiryType}
            </p>
          )}
        </div>
      </div>

      <div className="contact-field-group mb-5">
        <label htmlFor="cf-message" className="contact-field-label">
          What are we solving?{' '}
          <span aria-hidden="true" className="text-color-success">
            *
          </span>
        </label>
        <textarea
          id="cf-message"
          name="message"
          required
          minLength={10}
          maxLength={500}
          rows={4}
          value={values.message}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Describe the constraint, deadline, and risk."
          className="contact-field-input contact-field-textarea"
          disabled={state === 'loading'}
        />
        {fieldErrors.message && (
          <p className="text-2xs text-color-film-teal mt-1 font-mono" role="alert">
            {fieldErrors.message}
          </p>
        )}
        <p className="text-2xs text-color-text-muted mt-1.5 font-mono">
          {values.message.length}/500 characters
        </p>
      </div>

      {state === 'error' && (
        <p
          className="mb-4 rounded-lg px-3 py-2.5 text-sm font-medium"
          style={{
            background: 'oklch(60% 0.22 25 / 0.10)',
            color: 'oklch(72% 0.18 28)',
            border: '1px solid oklch(60% 0.22 25 / 0.25)',
          }}
          role="alert"
          aria-live="assertive"
        >
          Something interrupted the send. Try again, or reach me directly at{' '}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-color-film-teal underline underline-offset-2"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      )}

      <button
        type="submit"
        disabled={state === 'loading'}
        className="cta-primary cta-primary--lg tactile-press w-full justify-center"
      >
        {state === 'loading' ? (
          <>
            <span
              className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
              aria-hidden="true"
            />
            Sending your constraint...
          </>
        ) : (
          <>
            <span
              className="bg-color-success inline-block h-2 w-2 rounded-full"
              aria-hidden="true"
            />
            Send — I&apos;ll respond within 24h
          </>
        )}
      </button>

      <p className="text-2xs text-color-text-muted mt-3 text-center font-mono">
        Or email directly:{' '}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="text-color-film-teal underline underline-offset-2 transition hover:opacity-70"
        >
          {CONTACT_EMAIL}
        </a>
      </p>
    </form>
  );
}

/* ── Main ContactSection ─────────────────────────────────────────────────── */
export function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reducedMotion = useReducedMotion();

  const container = useMemo(() => staggerContainer(0.07, 0.05), []);
  const child = reducedMotion ? noMotion : fadeRise;
  const headingVariant = reducedMotion ? noMotion : clipReveal;

  const cardVariant = useMemo(
    () => (i: number) => (reducedMotion ? noMotion : cardReveal(i % 2 === 0 ? 20 : -20)),
    [reducedMotion]
  );

  return (
    <section
      id="section-contact"
      ref={ref}
      aria-labelledby="contact-heading"
      className="border-color-border border-t py-[var(--section-py)]"
    >
      <div className="container">
        <m.div variants={container} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          <m.div variants={child} className="section-kicker-row">
            <span className="section-number" aria-hidden="true">
              06
            </span>
            <span className="section-label">Contact</span>
          </m.div>

          {/*
            v20 CHANGE: Editorial intro — section-intro-editorial (layout.css).
            Mobile: kicker, h2, and description stack vertically (unchanged).
            lg+: kicker+h2 anchor the left column; description sits right with
              editorial alignment — consistent with Projects, OSS, Writing, Skills.
            Trust badges remain full-width below the editorial pair on all viewports.
          */}
          <div className="section-intro-editorial mb-6 sm:mb-8">
            {/* Left: heading */}
            <m.h2 variants={headingVariant} id="contact-heading" className="mt-4 lg:mt-0">
              The system is ready. Are you?
            </m.h2>

            {/* Right: description — editorial counterweight at lg+ */}
            <div className="lg:flex lg:flex-col lg:justify-end">
              <m.p
                variants={child}
                className="text-color-text-secondary mt-4 max-w-[52ch] text-base leading-8 lg:mt-0"
              >
                Hiring for Staff+, building from scratch, or containing a production incident — send
                the constraint. I respond within 24 hours, usually faster.
              </m.p>
            </div>
          </div>

          <m.div variants={child} className="mb-8 flex flex-wrap gap-2" aria-label="Trust signals">
            {TRUST_BADGES.map((badge) => (
              <span
                key={badge}
                className="text-2xs text-color-text-muted inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono tracking-widest uppercase"
                style={{
                  borderColor: 'var(--color-border-glass)',
                  background: 'oklch(100% 0 0 / 0.03)',
                }}
              >
                {badge}
              </span>
            ))}
          </m.div>

          {/* Two-column: Form left, Cards right */}
          <m.div variants={container} className="grid gap-6 lg:grid-cols-2">
            <m.div variants={child}>
              <ContactForm />
            </m.div>

            <m.div variants={child} className="flex flex-col gap-4">
              {CONTACT_CARDS.map((card_item, i) => (
                <m.div
                  key={card_item.id}
                  variants={cardVariant(i)}
                  className="glass-medium relative overflow-hidden rounded-[var(--radius-xl)] p-5"
                  style={{ borderLeft: `3px solid ${card_item.accentColor}` }}
                  whileHover={
                    reducedMotion
                      ? undefined
                      : { y: -2, transition: { type: 'spring', stiffness: 420, damping: 30 } }
                  }
                >
                  <p className="label-mono mb-2" style={{ color: card_item.accentColor }}>
                    {card_item.title}
                  </p>
                  <p
                    className="mb-2 text-sm leading-snug font-semibold"
                    style={{
                      color: 'var(--color-text-primary)',
                      fontFamily: 'var(--font-display)',
                    }}
                  >
                    {card_item.headline}
                  </p>
                  <p className="text-xs leading-6" style={{ color: 'var(--color-text-secondary)' }}>
                    {card_item.body}
                  </p>
                  <p
                    className="mt-2 border-t pt-2 text-[11px] leading-5 italic"
                    style={{
                      borderColor: 'var(--color-border-subtle)',
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    {card_item.objection}
                  </p>
                </m.div>
              ))}
            </m.div>
          </m.div>

          {/* Social links */}
          <m.div
            variants={child}
            className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/Scardubu"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 min-w-11 items-center gap-2 text-sm transition-colors"
                style={{ color: 'var(--color-text-muted)' }}
                aria-label="GitHub profile"
              >
                <GitHubIcon />
                <span className="hidden sm:inline">GitHub</span>
              </a>
              <a
                href="https://linkedin.com/in/oscardubu"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 min-w-11 items-center gap-2 text-sm transition-colors"
                style={{ color: 'var(--color-text-muted)' }}
                aria-label="LinkedIn profile"
              >
                <LinkedInIcon />
                <span className="hidden sm:inline">LinkedIn</span>
              </a>
              <CopyEmail email={CONTACT_EMAIL} />
              <a
                href={CV_ASSET_PATH}
                download
                className="hidden min-h-11 items-center gap-1.5 text-sm transition-colors hover:text-white sm:inline-flex"
                style={{ color: 'var(--color-text-muted)' }}
                aria-label="Download Oscar's resume PDF"
              >
                Resume <span aria-hidden="true">↓</span>
              </a>
            </div>

            <p
              className="hidden max-w-[36ch] text-right font-mono text-[10px] tracking-wider uppercase md:block"
              style={{ color: 'oklch(93% 0.006 264 / 0.28)' }}
            >
              Systems that work at 2am.
              <br />
              That&apos;s the standard.
            </p>
          </m.div>
        </m.div>
      </div>
    </section>
  );
}
