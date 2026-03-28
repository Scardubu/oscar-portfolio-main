'use client';
/**
 * components/sections/Testimonials.tsx
 * ──────────────────────────────────────────────────────────────────────────
 * REWRITE — Social Proof Engine
 *
 * Three testimonials with:
 * - Motion-staggered reveal on scroll into view
 * - Star ratings
 * - Avatar initials with brand-matched colors
 * - Company badge + project reference
 * - Trusted signal metrics below cards
 * ──────────────────────────────────────────────────────────────────────────
 */

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { TESTIMONIALS } from '@/lib/data';
import { cn } from '@/lib/utils';

// ── Stars ─────────────────────────────────────────────────────────────────

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={14}
          strokeWidth={0}
          fill={i < count ? 'var(--accent-warn)' : 'var(--border-default)'}
        />
      ))}
    </div>
  );
}

// ── Avatar ────────────────────────────────────────────────────────────────

function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <div
      className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0
                 text-sm font-bold"
      style={{
        background: `${color}22`, // ~13% opacity
        border:     `2px solid ${color}44`,
        color:      color,
      }}
    >
      {initials}
    </div>
  );
}

// ── Testimonial card ──────────────────────────────────────────────────────

function TestimonialCard({
  testimonial,
  index,
  inView,
}: {
  testimonial: typeof TESTIMONIALS[number];
  index:       number;
  inView:      boolean;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.65,
        delay:    0.15 + index * 0.12,
        ease:     [0.16, 1, 0.3, 1],
      }}
      className="liquid-glass rounded-[var(--radius-2xl)] p-[var(--bento-pad)]
                 flex flex-col gap-5 h-full
                 hover:shadow-[var(--shadow-liquid-3d-hover)]
                 transition-shadow duration-[var(--duration-slow)]"
    >
      {/* Quote icon + stars */}
      <div className="flex items-start justify-between gap-3">
        <div
          className="w-9 h-9 rounded-[var(--radius-md)] flex items-center justify-center"
          style={{ background: 'var(--accent-primary-dim)', border: '1px solid var(--accent-primary-border)' }}
        >
          <Quote size={16} style={{ color: 'var(--accent-primary)' }} strokeWidth={2} />
        </div>
        <Stars count={testimonial.stars} />
      </div>

      {/* Quote text */}
      <blockquote
        className="flex-1 leading-relaxed"
        style={{
          color:      'var(--text-secondary)',
          fontSize:   'var(--fs-body)',
          lineHeight: 'var(--lh-relaxed)',
          fontStyle:  'italic',
        }}
      >
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>

      {/* Attribution */}
      <div
        className="flex items-center gap-3 pt-4"
        style={{ borderTop: '1px solid var(--border-subtle)' }}
      >
        <Avatar initials={testimonial.avatarInitials} color={testimonial.avatarColor} />
        <div className="min-w-0">
          <div
            className="font-semibold leading-tight truncate"
            style={{ color: 'var(--text-primary)', fontSize: 'var(--fs-body)' }}
          >
            {testimonial.name}
          </div>
          <div
            className="text-xs mt-0.5 truncate"
            style={{ color: 'var(--text-muted)' }}
          >
            {testimonial.title}, {testimonial.company}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// ── Trust signals bar ─────────────────────────────────────────────────────

function TrustBar({ inView }: { inView: boolean }) {
  const signals = [
    { icon: '🏢', label: '5+ Companies Served' },
    { icon: '⭐', label: '100% Client Satisfaction' },
    { icon: '🔄', label: 'Repeat Engagements' },
    { icon: '🌍', label: 'Global Remote Delivery' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.55 }}
      className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4"
    >
      {signals.map((s, i) => (
        <div
          key={i}
          className="liquid-glass rounded-[var(--radius-xl)] px-4 py-3
                     flex items-center gap-3"
        >
          <span className="text-xl" role="img" aria-hidden="true">{s.icon}</span>
          <span
            className="font-medium"
            style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-caption)' }}
          >
            {s.label}
          </span>
        </div>
      ))}
    </motion.div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView     = useInView(sectionRef, { once: true, amount: 0.1 });

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="py-[var(--space-section)]"
      aria-label="Client testimonials"
    >
      <div className="section-container">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="section-label">What Clients Say</div>
          <h2 className="section-title">
            Real feedback from{' '}
            <span className="text-gradient-accent">real engineers</span>
          </h2>
          <p className="section-subtitle max-w-[500px] mx-auto">
            Teams I&apos;ve shipped production ML systems with — their words, not mine.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--bento-gap)]">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard
              key={t.id}
              testimonial={t}
              index={i}
              inView={inView}
            />
          ))}
        </div>

        {/* Trust signals */}
        <TrustBar inView={inView} />

      </div>
    </section>
  );
}
