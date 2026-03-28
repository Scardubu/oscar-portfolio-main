"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { TESTIMONIALS } from "@/app/lib/constants";

function Initials({ name, accent = "#00d9ff" }: { name: string; accent?: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return (
    <div
      className="h-14 w-14 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
      style={{ background: accent + "22", color: accent, border: `1.5px solid ${accent}44` }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-600 text-gray-600"
          }`}
        />
      ))}
    </div>
  );
}

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const currentTestimonial = TESTIMONIALS[currentIndex] ?? TESTIMONIALS[0];

  // Auto-rotate testimonials every 6 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(
      (prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length
    );
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  return (
    <section
      id="testimonials"
      aria-label="Client testimonials"
      className="relative w-full bg-gradient-to-b from-bg-secondary via-bg-primary to-bg-secondary px-6 py-20 lg:px-12 lg:py-32"
    >
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mx-auto mb-16 max-w-7xl text-center"
      >
        <h2 className="mb-6 text-4xl font-extrabold tracking-tight text-white lg:text-5xl xl:text-6xl">
          What <span className="text-gradient-accent">Clients</span> Say
        </h2>
        <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-300 lg:text-xl">
          Real feedback from teams I&apos;ve worked with on production ML systems
        </p>
      </motion.div>

      {/* Testimonial carousel */}
      <div className="mx-auto max-w-4xl">
        <div className="relative">
          {/* Navigation arrows */}
          <button
            onClick={goToPrevious}
            className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/10 bg-white/5 p-3 text-white/70 backdrop-blur-sm transition-all hover:border-accent-primary/50 hover:bg-white/10 hover:text-accent-primary lg:-left-16"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={goToNext}
            className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/10 bg-white/5 p-3 text-white/70 backdrop-blur-sm transition-all hover:border-accent-primary/50 hover:bg-white/10 hover:text-accent-primary lg:-right-16"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Testimonial card */}
          <div className="overflow-hidden rounded-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="glass-panel rounded-2xl p-8 lg:p-12"
              >
                {/* Quote icon */}
                <Quote className="mb-6 h-10 w-10 text-accent-primary/30" />

                {/* Quote text */}
                <blockquote className="mb-8 text-xl leading-relaxed text-gray-200 lg:text-2xl">
                  &ldquo;{currentTestimonial?.quote}&rdquo;
                </blockquote>

                {/* Author info */}
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <Initials name={currentTestimonial?.author ?? "OC"} accent="#00d9ff" />

                  {/* Name and title */}
                    <div className="flex-1">
                      <div className="font-semibold text-white">
                        {currentTestimonial?.author}
                      </div>
                      <div className="text-sm text-gray-400">
                        {currentTestimonial?.title},{" "}
                        {currentTestimonial?.company}
                      </div>
                    </div>

                    {/* Rating */}
                    <StarRating rating={currentTestimonial?.rating ?? 5} />
                  </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dot indicators */}
          <div className="mt-8 flex justify-center gap-2">
            {TESTIMONIALS.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "w-8 bg-accent-primary"
                    : "w-2 bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Trust indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mx-auto mt-16 max-w-4xl"
      >
        <div className="flex flex-wrap items-center justify-center gap-8 text-center text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏢</span>
            <span>5+ Companies Served</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            <span>100% Client Satisfaction</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔄</span>
            <span>Repeat Engagements</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
