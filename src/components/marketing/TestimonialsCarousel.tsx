'use client';

import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  mission: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    quote:
      'LaunchPad reduced our orbital telemetry deployment cycle from three weeks to 45 seconds. The multi-tenant RLS guarantees our mission datasets stay strictly segregated.',
    author: 'Commander Sarah Jenkins',
    role: 'VP of Flight Systems',
    company: 'AetherSpace Dynamics',
    mission: 'Orbital Mesh Flight 4',
    rating: 5,
  },
  {
    quote:
      'The deep orbital glassmorphism aesthetic is not just stunning—the telemetry typography and live metrics make mission anomalies visible instantly.',
    author: 'Dr. Marcus Vance',
    role: 'Lead Infrastructure Architect',
    company: 'Nova Telepresence',
    mission: 'Lunar Mesh Relays',
    rating: 5,
  },
  {
    quote:
      'We replaced our fragile homegrown CI/CD scripts with LaunchPad. The automated verification and audit advisory checks caught 4 potential leaks before launch.',
    author: 'Elena Rostova',
    role: 'Chief Security Officer',
    company: 'Hyperion Deep Space',
    mission: 'Helios Array 2',
    rating: 5,
  },
];

export function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    setCurrentIndex((prevIdx) =>
      prevIdx === 0 ? testimonials.length - 1 : prevIdx - 1
    );
  };

  const next = () => {
    setCurrentIndex((prevIdx) =>
      prevIdx === testimonials.length - 1 ? 0 : prevIdx + 1
    );
  };

  const current = testimonials[currentIndex];

  return (
    <section className="py-20 relative bg-midnight-950/60 border-t border-b border-surface-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block px-3 py-1 rounded-pill bg-accent-purple/10 border border-accent-purple/30 text-accent-purple font-mono text-xs uppercase tracking-wider mb-3">
            MISSION TESTIMONIALS
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
            Trusted by Mission-Critical Engineering Teams
          </h2>
        </div>

        {/* Carousel Card */}
        <div className="glass-panel p-8 sm:p-12 relative">
          <Quote className="w-12 h-12 text-accent-purple/30 absolute top-6 right-6" />

          <div className="flex gap-1 mb-6">
            {[...Array(current.rating)].map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 fill-status-warning text-status-warning"
              />
            ))}
          </div>

          <blockquote className="font-sans text-lg sm:text-xl text-text-primary leading-relaxed mb-8">
            &ldquo;{current.quote}&rdquo;
          </blockquote>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-surface-border pt-6 gap-4">
            <div>
              <div className="font-display font-semibold text-text-primary text-base">
                {current.author}
              </div>
              <div className="font-sans text-sm text-text-secondary">
                {current.role} •{' '}
                <span className="text-accent-cyan">{current.company}</span>
              </div>
              <div className="font-mono text-xs text-accent-purple mt-0.5">
                Target: {current.mission}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous testimonial"
                className="w-10 h-10 rounded-control bg-surface-glass border border-surface-border flex items-center justify-center text-text-primary hover:border-surface-border-hover transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="font-mono text-xs text-text-secondary px-2">
                {currentIndex + 1} / {testimonials.length}
              </span>
              <button
                type="button"
                onClick={next}
                aria-label="Next testimonial"
                className="w-10 h-10 rounded-control bg-surface-glass border border-surface-border flex items-center justify-center text-text-primary hover:border-surface-border-hover transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
