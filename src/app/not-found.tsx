import React from 'react';
import Link from 'next/link';
import { Compass, Home, LayoutDashboard, ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-midnight-950 text-text-primary flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-purple/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-lg bg-surface-card/90 border border-surface-border rounded-2xl p-8 md:p-10 backdrop-blur-2xl shadow-2xl relative z-10 text-center space-y-6">
        {/* Radar / Compass Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-brand-purple/20 border border-brand-purple/40 flex items-center justify-center text-accent-cyan shadow-glow-purple">
          <Compass className="w-8 h-8 animate-spin-slow" />
        </div>

        {/* Narrative */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="font-mono text-xs uppercase tracking-widest text-accent-cyan">
              HTTP 404 Orbital Trajectory
            </span>
          </div>

          <h1 className="font-display text-3xl font-bold text-white tracking-tight">
            Lost Beyond the Perimeter
          </h1>

          <p className="text-sm text-text-secondary leading-relaxed">
            The page, telemetry endpoint, or document you were searching for does not exist or may have been repositioned to a new sector.
          </p>
        </div>

        {/* Quick Navigation Links */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button
              type="button"
              variant="primary"
              className="w-full flex items-center justify-center gap-2 font-semibold shadow-glow-cyan"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Return to Dashboard</span>
            </Button>
          </Link>

          <Link href="/admin" className="w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4 text-accent-purple" />
              <span>Admin Console</span>
            </Button>
          </Link>

          <Link href="/" className="w-full sm:w-auto">
            <Button
              type="button"
              variant="glass"
              className="w-full flex items-center justify-center gap-2 text-text-muted hover:text-white"
            >
              <Home className="w-4 h-4" />
              <span>Home Orbit</span>
            </Button>
          </Link>
        </div>

        <div className="pt-4 border-t border-surface-border">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-text-muted hover:text-accent-cyan transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to LaunchPad main entrance</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
