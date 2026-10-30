'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Rocket, Sparkles, Activity, ShieldCheck, ArrowRight } from 'lucide-react';

export function HeroPaperGen() {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
      {/* Background radial glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-accent-purple/15 blur-[120px] pointer-events-none rounded-full"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[250px] bg-accent-cyan/10 blur-[100px] pointer-events-none rounded-full"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Animated Orbital Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-pill bg-surface-glass border border-surface-border text-accent-purple text-xs font-mono uppercase tracking-widest mb-8 backdrop-blur-glass hover:border-surface-border-hover transition-colors">
          <Sparkles className="w-3.5 h-3.5 text-accent-cyan animate-pulse" />
          <span>PaperGen v1.0 • Orbital Infrastructure Active</span>
        </div>

        {/* H1 Heading */}
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-text-primary max-w-4xl mx-auto leading-[1.1] mb-6">
          Next-Generation{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-purple via-accent-cyan to-accent-purple">
            Space-Tech Cloud
          </span>{' '}
          Acceleration
        </h1>

        {/* Subtitle */}
        <p className="font-sans text-base sm:text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
          Deploy, scale, and govern mission-critical cloud pipelines with deep
          orbital glassmorphism telemetry and multi-tenant RLS security.
        </p>

        {/* Dual CTA Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/auth?flow=signup">
            <Button size="lg" variant="primary" className="w-full sm:w-auto gap-2">
              <Rocket className="w-4 h-4" />
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>

          <a href="#features">
            <Button size="lg" variant="glass" className="w-full sm:w-auto gap-2">
              <span>Explore Telemetry</span>
            </Button>
          </a>
        </div>

        {/* Live Telemetry Preview Frame */}
        <div className="max-w-4xl mx-auto glass-panel p-4 sm:p-6 text-left">
          <div className="flex items-center justify-between border-b border-surface-border pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-status-danger" />
              <div className="w-3 h-3 rounded-full bg-status-warning" />
              <div className="w-3 h-3 rounded-full bg-status-success" />
              <span className="font-mono text-xs text-text-secondary ml-2">
                telemetry://papergen.orbital/mesh-node-01
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-status-success animate-ping" />
              <span className="font-mono text-xs text-status-success font-medium">
                ALL SYSTEMS NOMINAL
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="bg-midnight-900/60 p-3 rounded-control border border-surface-border">
              <div className="text-text-secondary flex items-center gap-1.5 mb-1">
                <Activity className="w-3.5 h-3.5 text-accent-cyan" />
                <span>ACTIVE PODS</span>
              </div>
              <div className="text-text-primary text-lg font-bold">128 Nodes</div>
              <div className="text-status-success text-[10px]">99.999% Availability</div>
            </div>

            <div className="bg-midnight-900/60 p-3 rounded-control border border-surface-border">
              <div className="text-text-secondary flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-accent-purple" />
                <span>EDGE LATENCY</span>
              </div>
              <div className="text-text-primary text-lg font-bold">12.4 ms</div>
              <div className="text-accent-cyan text-[10px]">Fluid Compute Global</div>
            </div>

            <div className="bg-midnight-900/60 p-3 rounded-control border border-surface-border">
              <div className="text-text-secondary flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-status-success" />
                <span>RLS GOVERNANCE</span>
              </div>
              <div className="text-text-primary text-lg font-bold">100% Zero-Trust</div>
              <div className="text-status-success text-[10px]">Zero Leak Vector</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Backwards-compatible alias
export const HeroLaunchPad = HeroPaperGen;
