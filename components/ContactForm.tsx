/**
 * ContactForm.tsx — Conversion Engine
 * ─────────────────────────────────────────────────────────────────────────────
 * Frictionless contact section.
 * Three direct engagement cards + quick message form with premium success state.
 * Form uses Formspree (swap endpoint for any backend).
 * ─────────────────────────────────────────────────────────────────────────────
 */

"use client";

import React, { useState, useCallback } from "react";
import Link                   from "next/link";
import { LiquidGlassCard }    from "@/components/LiquidGlassCard";
import { HERO, SOCIAL }       from "@/lib/portfolio-data";
import { cn }                 from "@/lib/utils";

// ── Engagement paths ──────────────────────────────────────────────────────────

const ENGAGEMENT_PATHS = [
  {
    icon:    "💼",
    title:   "Consulting & Projects",
    desc:    "Custom ML solutions, model deployment, and MLOps implementation",
    cta:     "Discuss Your Project →",
    href:    `mailto:scardubu@gmail.com?subject=Consulting%20Inquiry`,
    accent:  "var(--accent-primary)",
    accentDim: "var(--accent-primary-dim)",
  },
  {
    icon:    "🤝",
    title:   "Technical Partnerships",
    desc:    "Co-founder opportunities, technical advisorship, and strategic collaboration",
    cta:     "Explore Partnership →",
    href:    `mailto:scardubu@gmail.com?subject=Partnership%20Opportunity`,
    accent:  "var(--accent-secondary)",
    accentDim: "var(--accent-secondary-dim)",
  },
  {
    icon:    "🎓",
    title:   "Speaking & Mentorship",
    desc:    "Tech talks, workshops, and mentoring for ML engineers",
    cta:     "Send Invitation →",
    href:    `mailto:scardubu@gmail.com?subject=Speaking%20Inquiry`,
    accent:  "var(--accent-fintech)",
    accentDim: "var(--accent-fintech-dim)",
  },
];

const INQUIRY_TYPES = [
  "Job opportunity",
  "Consulting / ML project",
  "Collaboration",
  "Other",
] as const;

type FormState = "idle" | "submitting" | "success" | "error";

// ── Success screen ────────────────────────────────────────────────────────────

function SuccessScreen({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12 text-center animate-scale-in">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
        style={{ background: "var(--success)" + "18" }}
      >
        ✅
      </div>
      <div>
        <h3 className="text-headline text-primary mb-2">Message Sent!</h3>
        <p className="text-body text-secondary max-w-sm">
          Thanks for reaching out. I typically respond within 24 hours.
        </p>
      </div>
      <button
        onClick={onReset}
        className="btn btn-ghost"
      >
        Send another message
      </button>
    </div>
  );
}

// ── Contact form ──────────────────────────────────────────────────────────────

function QuickMessageForm() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [honeypot, setHoneypot]   = useState("");
  const [form, setForm]           = useState({
    name:    "",
    email:   "",
    company: "",
    type:    INQUIRY_TYPES[0] as string,
    message: "",
  });

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (honeypot) return; // bot trap

      setFormState("submitting");

      try {
        // Replace with your Formspree endpoint or API route
        const res = await fetch("https://formspree.io/f/xpwazvbw", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ ...form, _gotcha: honeypot }),
        });

        if (res.ok) {
          setFormState("success");
        } else {
          // Fallback: open mailto
          const subject = encodeURIComponent(`${form.type} — ${form.name}`);
          const body    = encodeURIComponent(form.message);
          window.location.href = `mailto:scardubu@gmail.com?subject=${subject}&body=${body}`;
          setFormState("success");
        }
      } catch {
        // Graceful fallback to mailto
        const subject = encodeURIComponent(`${form.type} — ${form.name}`);
        const body    = encodeURIComponent(form.message);
        window.location.href = `mailto:scardubu@gmail.com?subject=${subject}&body=${body}`;
        setFormState("success");
      }
    },
    [form, honeypot]
  );

  if (formState === "success") {
    return <SuccessScreen onReset={() => { setFormState("idle"); setForm({ name: "", email: "", company: "", type: INQUIRY_TYPES[0], message: "" }); }} />;
  }

  const isSubmitting = formState === "submitting";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {/* Honeypot — hidden from real users */}
      <input
        tabIndex={-1}
        aria-hidden="true"
        name="_gotcha"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="sr-only"
        autoComplete="off"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-caption text-muted">
            Name <span className="text-[var(--accent-danger)]">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            disabled={isSubmitting}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-caption text-muted">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@company.com"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="company" className="text-caption text-muted">
            Company (optional)
          </label>
          <input
            id="company"
            name="company"
            type="text"
            value={form.company}
            onChange={handleChange}
            placeholder="Company name"
            disabled={isSubmitting}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="type" className="text-caption text-muted">Inquiry type</label>
          <select
            id="type"
            name="type"
            value={form.type}
            onChange={handleChange}
            disabled={isSubmitting}
          >
            {INQUIRY_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-caption text-muted">
          How can Oscar help?
        </label>
        <textarea
          id="message"
          name="message"
          required
          value={form.message}
          onChange={handleChange}
          placeholder="Tell me about your project, team size, and timeline..."
          rows={5}
          disabled={isSubmitting}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          "btn btn-primary w-full justify-center",
          isSubmitting && "opacity-60 cursor-not-allowed"
        )}
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full border-2 border-[var(--bg-base)] border-t-transparent animate-orbit" />
            Sending…
          </span>
        ) : (
          "Send Message →"
        )}
      </button>
    </form>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function ContactForm() {
  return (
    <section
      id="contact"
      className="section-gap max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
      aria-labelledby="contact-heading"
    >
      {/* Header */}
      <div className="mb-12 text-center" data-reveal>
        <p className="text-caption text-muted mb-2">Let&apos;s Work Together</p>
        <h2
          id="contact-heading"
          className="text-headline text-gradient-kinetic"
        >
          Let&apos;s Build Something Exceptional
        </h2>
        <p className="text-subhead text-secondary mt-3 max-w-2xl mx-auto">
          Whether you need a production ML system, consulting on AI strategy, or
          a technical co-founder — let&apos;s talk.
        </p>

        {/* Availability signal */}
        <div className="inline-flex items-center gap-2 mt-4">
          <span className="metric-dot metric-live text-caption text-[var(--metric-live)] font-semibold">
            Available for new projects
          </span>
        </div>
      </div>

      {/* Engagement path cards */}
      <div className="bento-grid mb-10">
        {ENGAGEMENT_PATHS.map((path, i) => (
          <a
            key={path.title}
            href={path.href}
            className={cn(
              "col-span-12 sm:col-span-4",
              "liquid-glass liquid-glass-hover bento-cell",
              "flex flex-col gap-4 no-underline group"
            )}
            data-reveal
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ background: path.accentDim }}
            >
              {path.icon}
            </div>
            <div>
              <h3
                className="text-headline text-primary mb-1 group-hover:text-[var(--accent-primary)] transition-colors duration-200"
                style={{ color: "var(--text-primary)" }}
              >
                {path.title}
              </h3>
              <p className="text-body text-secondary">{path.desc}</p>
            </div>
            <span
              className="text-caption font-semibold mt-auto"
              style={{ color: path.accent }}
            >
              {path.cta}
            </span>
          </a>
        ))}
      </div>

      {/* Quick message form */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        <LiquidGlassCard
          accent="cyan"
          size="md"
          depth
          className="flex flex-col gap-6"
          data-reveal="left"
        >
          <div>
            <p className="text-caption text-muted mb-1">Quick Message</p>
            <h3 className="text-headline text-primary">Send a Quick Message</h3>
          </div>
          <QuickMessageForm />
        </LiquidGlassCard>

        {/* Right column: direct contacts */}
        <div className="flex flex-col gap-4" data-reveal="right">
          <LiquidGlassCard size="sm" className="flex flex-col gap-3">
            <p className="text-caption text-muted">Direct Contact</p>
            <a
              href={SOCIAL.email}
              className="flex items-center gap-3 group"
            >
              <span
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--accent-primary-dim)" }}
              >
                ✉️
              </span>
              <span className="text-body text-secondary group-hover:text-primary transition-colors">
                scardubu@gmail.com
              </span>
            </a>
            <a
              href={SOCIAL.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 group"
            >
              <span
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--accent-secondary-dim)" }}
              >
                💼
              </span>
              <span className="text-body text-secondary group-hover:text-primary transition-colors">
                linkedin.com/in/oscardubu
              </span>
            </a>
            <a
              href={SOCIAL.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 group"
            >
              <span
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--accent-fintech-dim)" }}
              >
                🐙
              </span>
              <span className="text-body text-secondary group-hover:text-primary transition-colors">
                github.com/scardubu
              </span>
            </a>
          </LiquidGlassCard>

          <LiquidGlassCard size="sm" className="flex flex-col gap-3">
            <p className="text-caption text-muted">Location & Availability</p>
            <p className="text-body text-secondary">Nigeria 🇳🇬 · Remote-First</p>
            <p className="text-caption text-muted">Typically responds within 24 hours</p>
            <div className="flex items-center gap-2">
              <span className="metric-dot metric-live text-caption text-[var(--metric-live)] font-semibold">
                Open to new projects
              </span>
            </div>
          </LiquidGlassCard>
        </div>
      </div>
    </section>
  );
}
