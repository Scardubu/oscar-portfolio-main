// ═══════════════════════════════════════════════════════════════════════
// ContactForm.tsx
// ═══════════════════════════════════════════════════════════════════════

"use client";

import * as React from "react";
import { useState } from "react";
import { LiquidGlassCard, SectionLabel } from "@/components/reusable";
import { useScrollReveal } from "@/hooks";
import { contact, openSource } from "@/lib/data";
 
export function ContactForm() {
  const sectionRef = useScrollReveal<HTMLElement>({ threshold: 0.05 })
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)
 
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    // Simulate submission — replace with Resend / Formspree / server action
    await new Promise(resolve => setTimeout(resolve, 1200))
    setLoading(false)
    setSubmitted(true)
  }
 
  return (
    <section
      id="contact"
      ref={sectionRef}
      aria-label="Contact"
      className="section-gap max-w-7xl mx-auto px-6 lg:px-12"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* ── Left: info ── */}
        <div>
          <SectionLabel accent="primary" className="mb-6">
            Get In Touch
          </SectionLabel>
          <h2 className="text-headline font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Let&apos;s Build Something
            <br />
            <span className="text-gradient-accent">Worth Building</span>
          </h2>
          <p className="text-body mb-8" style={{ color: 'var(--text-secondary)' }}>
            {contact.availability}
          </p>
 
          {/* Direct links */}
          <div className="space-y-3 mb-8">
            {[
              { label: 'Email',    href: `mailto:${contact.email}`,  value: contact.email    },
              { label: 'GitHub',   href: contact.github,             value: 'Scardubu'       },
              { label: 'LinkedIn', href: contact.linkedin,           value: 'Oscar Ndugbu'   },
              { label: 'Calendar', href: contact.calendar,           value: 'Book 30 min'    },
            ].map(({ label, href, value }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="flex items-center gap-3 group"
                style={{ textDecoration: 'none' }}
              >
                <span
                  className="text-caption"
                  style={{ color: 'var(--text-muted)', minWidth: '5rem' }}
                >
                  {label}
                </span>
                <span
                  className="text-sm font-medium transition-colors duration-150"
                  style={{ color: 'var(--accent-primary)' }}
                >
                  {value}
                </span>
                <svg className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M2 10L10 2M6 2h4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </a>
            ))}
          </div>
 
          {/* Open source */}
          <div>
            <p className="text-caption mb-3" style={{ color: 'var(--text-muted)' }}>
              Open Source
            </p>
            <div className="space-y-2">
              {openSource.map(lib => (
                <a
                  key={lib.name}
                  href={contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg border group hover:border-white/20 transition-colors"
                  style={{
                    background:  'var(--bg-surface)',
                    border:      '1px solid var(--border-subtle)',
                    textDecoration: 'none',
                  }}
                >
                  <div>
                    <p className="text-sm font-mono font-medium" style={{ color: 'var(--text-primary)' }}>
                      {lib.name}
                    </p>
                    <p className="text-caption mt-0.5" style={{ color: 'var(--text-muted)', textTransform: 'none', letterSpacing: 0, fontSize: '11px' }}>
                      {lib.language}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-caption" style={{ color: 'var(--text-muted)' }}>
                    <StarIcon />
                    {lib.stars}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
 
        {/* ── Right: form ── */}
        <div>
          <LiquidGlassCard
            variant="cyan"
            hover={false}
            style={{ padding: 'var(--bento-pad)' } as React.CSSProperties}
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                  style={{ background: 'var(--accent-fintech-dim)', border: '1px solid var(--accent-fintech-border)' }}
                >
                  <CheckIcon />
                </div>
                <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Message Sent
                </h3>
                <p className="text-body" style={{ color: 'var(--text-secondary)' }}>
                  I&apos;ll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <h3 className="text-base font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
                  Send a Message
                </h3>
 
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cf-name" className="text-caption block mb-2">
                      Name
                    </label>
                    <input
                      id="cf-name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="Ada Lovelace"
                    />
                  </div>
                  <div>
                    <label htmlFor="cf-email" className="text-caption block mb-2">
                      Email
                    </label>
                    <input
                      id="cf-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="ada@company.com"
                    />
                  </div>
                </div>
 
                <div>
                  <label htmlFor="cf-subject" className="text-caption block mb-2">
                    Subject
                  </label>
                  <input
                    id="cf-subject"
                    name="subject"
                    type="text"
                    placeholder="Principal Engineer role / Consulting inquiry"
                  />
                </div>
 
                <div>
                  <label htmlFor="cf-message" className="text-caption block mb-2">
                    Message
                  </label>
                  <textarea
                    id="cf-message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell me about the role, the stack, and what you're building..."
                  />
                </div>
 
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full text-base py-4 rounded-xl premium-glow"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <LoadingSpinner />
                      Sending…
                    </span>
                  ) : (
                    'Send Message →'
                  )}
                </button>
 
                <p className="text-caption text-center" style={{ color: 'var(--text-muted)' }}>
                  Typically replies within 24 hours · Based in Lagos (WAT)
                </p>
              </form>
            )}
          </LiquidGlassCard>
        </div>
      </div>
    </section>
  )
}
 
// ── Micro icons ───────────────────────────────────────────────────────
 
function StarIcon() {
  return <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true"><path d="M6 1l1.35 2.73L10.5 4.27l-2.25 2.19.53 3.1L6 8.1 3.22 9.56l.53-3.1L1.5 4.27l3.15-.54L6 1z"/></svg>
}
function CheckIcon() {
  return <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true"><path d="M5 14l7 7 11-11" stroke="var(--accent-fintech)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function LoadingSpinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ animation: 'oscar-orbit 0.7s linear infinite' }}>
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="28" strokeDashoffset="10" strokeLinecap="round"/>
    </svg>
  )
}
