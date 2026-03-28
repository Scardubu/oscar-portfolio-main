'use client';

import { useMemo } from 'react';
import { motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { ArrowRight, MapPin, MoveRight } from 'lucide-react';
import Image from 'next/image';

import { heroCopy, heroMetrics } from '@/app/lib/homepage';
import { trackEvent } from '@/app/lib/analytics';
import { Button } from '@/components/ui/button';

import { LiquidGlassRefractionSVG } from './LiquidGlassRefractionSVG';

interface HeroProps {
  onOpenContact?: () => void;
}

const HERO_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function revealTransition(delay: number, duration = 0.7) {
  return { duration, delay, ease: HERO_EASE };
}

function KineticHeadline({ text }: { text: string }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <span>{text}</span>;
  }

  return (
    <span aria-label={text} className="kinetic-headline">
      {Array.from(text).map((character, index) => (
        <motion.span
          key={`${character}-${index}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: index * 0.03, ease: HERO_EASE }}
          className="inline-block whitespace-pre"
        >
          {character}
        </motion.span>
      ))}
    </span>
  );
}

export function Hero({ onOpenContact }: HeroProps = {}) {
  const shouldReduceMotion = useReducedMotion();
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(44);
  const rotateX = useTransform(mouseY, [0, 100], [7, -7]);
  const rotateY = useTransform(mouseX, [0, 100], [-7, 7]);
  const translateX = useTransform(mouseX, [0, 100], [-12, 12]);
  const translateY = useTransform(mouseY, [0, 100], [-10, 10]);

  const portraitStyle = useMemo(
    () => ({
      rotateX: shouldReduceMotion ? 0 : rotateX,
      rotateY: shouldReduceMotion ? 0 : rotateY,
      x: shouldReduceMotion ? 0 : translateX,
      y: shouldReduceMotion ? 0 : translateY,
    }),
    [rotateX, rotateY, shouldReduceMotion, translateX, translateY]
  );

  const scrollToSection = (id: string) => {
    if (typeof document === 'undefined') return;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleContact = () => {
    trackEvent('CTA', 'Click', 'Hero Contact');
    if (onOpenContact) {
      onOpenContact();
      return;
    }
    scrollToSection('contact');
  };

  return (
    <section
      className="relative mx-auto flex min-h-[calc(100svh-7.5rem)] w-full max-w-7xl items-center px-0 py-8 md:py-10"
      aria-label="Hero section"
    >
      <LiquidGlassRefractionSVG filterId="hero-liquid-glass" mode="defs" scale={26} />

      <div className="w-full space-y-8 md:space-y-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.8fr)] lg:items-center">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={revealTransition(0, 0.75)}
            className="space-y-7 lg:max-w-[46rem]"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="location-badge glass-surface glass-surface-light inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-[var(--text-primary)]">
                <MapPin className="h-4 w-4 text-[var(--accent-primary)]" />
                {heroCopy.badge}
              </span>
            </div>

            <div className="space-y-5">
              <motion.h1
                initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={revealTransition(0.1)}
                className="max-w-4xl text-5xl font-semibold tracking-tight text-balance text-[var(--text-primary)] md:text-7xl"
              >
                <KineticHeadline text={heroCopy.headline} />
              </motion.h1>

              <motion.p
                initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={revealTransition(0.18)}
                className="max-w-3xl text-xl leading-8 text-balance text-[var(--text-primary)] md:text-3xl md:leading-[1.25]"
              >
                {heroCopy.position}
              </motion.p>

              <motion.p
                initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={revealTransition(0.24)}
                className="max-w-3xl text-base leading-8 text-pretty text-[var(--text-secondary)] md:text-lg"
              >
                {heroCopy.bio}
              </motion.p>
            </div>

            <motion.article
              initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={revealTransition(0.32, 0.75)}
              className="glass-surface glass-surface-heavy rounded-[1.75rem] p-5 md:p-6"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-3">
                  <p className="text-xs tracking-[0.24em] text-[var(--accent-primary)] uppercase">
                    Positioning
                  </p>
                  <h2 className="text-xl font-semibold tracking-tight text-[var(--text-primary)] md:text-2xl">
                    {heroCopy.proofTitle}
                  </h2>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-[var(--text-secondary)]">
                  <span className="live-dot" />
                  Evidence before claim
                </span>
              </div>
              <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)] md:text-base">
                {heroCopy.proofBody}
              </p>
            </motion.article>

            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={revealTransition(0.38)}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <Button
                size="lg"
                onClick={() => scrollToSection('work')}
                className="min-h-12 rounded-full bg-[var(--accent-primary)] px-6 text-sm font-semibold text-black hover:-translate-y-0.5 md:px-7"
              >
                {heroCopy.ctaPrimary}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleContact}
                className="focus-ring-branded min-h-12 rounded-full border-white/12 bg-white/[0.03] px-6 text-sm font-semibold text-[var(--text-primary)] md:px-7"
              >
                {heroCopy.ctaSecondary}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>

            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={revealTransition(0.44)}
              className="flex flex-wrap items-center gap-3 text-sm text-[var(--text-secondary)]"
            >
              <a
                href={`mailto:${heroCopy.contactEmail}`}
                aria-label="Contact Oscar via email"
                className="focus-ring-branded inline-flex min-h-10 items-center rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--accent-primary)]/35 hover:text-[var(--accent-primary)]"
              >
                {heroCopy.contactEmail}
              </a>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[var(--text-secondary)]">
                Built from Nigeria for global product teams
                <MoveRight className="h-4 w-4 text-[var(--accent-primary)]" />
              </span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.94 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
            transition={revealTransition(0.18, 0.85)}
            className="hero-portrait-column"
            onPointerMove={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              mouseX.set(((event.clientX - rect.left) / rect.width) * 100);
              mouseY.set(((event.clientY - rect.top) / rect.height) * 100);
            }}
            onPointerLeave={() => {
              mouseX.set(50);
              mouseY.set(44);
            }}
          >
            <div className="profile-glow-cyan" aria-hidden="true" />
            <motion.div
              className="glass-surface glass-surface-heavy chromatic-aberration relative overflow-hidden rounded-[2rem]"
              style={portraitStyle}
            >
              <LiquidGlassRefractionSVG
                filterId="hero-liquid-glass"
                mode="overlay"
                className="glass-refraction-layer"
                scale={26}
              />
              <div className="relative aspect-[0.92/1.08] overflow-hidden rounded-[1.65rem]">
                <Image
                  src="/headshot.webp"
                  alt="Oscar Ndugbu - Full-Stack ML Engineer"
                  fill
                  priority
                  fetchPriority="high"
                  loading="eager"
                  quality={90}
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 300px, (max-width: 1280px) 420px, 480px"
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgwIiBoZWlnaHQ9IjQ4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMDUwNTA3Ii8+PGNpcmNsZSBjeD0iMjQwIiBjeT0iMjQwIiByPSIxNzAiIGZpbGw9IiMwZjE4MjgiLz48L3N2Zz4="
                />
              </div>

              <div className="absolute inset-x-5 bottom-5 flex flex-wrap gap-3">
                <span className="glass-surface glass-surface-light inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-[var(--text-primary)]">
                  <span className="live-dot" />
                  Production AI systems
                </span>
                <span className="glass-surface glass-surface-light inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-[var(--text-primary)]">
                  Remote-first · Nigeria
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={revealTransition(0.5, 0.75)}
          className="grid gap-[var(--bento-gap)] md:grid-cols-2 xl:grid-cols-4"
        >
          {heroMetrics.map((metric, index) => (
            <motion.article
              key={metric.title}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={revealTransition(0.56 + index * 0.08, 0.6)}
              className={`metric-card-glass glass-surface glass-surface-light rounded-[1.5rem] p-5 ${metric.pulse ? 'hero-metric-card-pulse' : ''}`}
            >
              <span className="block text-sm font-semibold tracking-[0.2em] text-[var(--accent-primary)] uppercase">
                {metric.value}
              </span>
              <span className="mt-3 block text-lg font-semibold tracking-tight text-[var(--text-primary)] md:text-xl">
                {metric.title}
              </span>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{metric.detail}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
