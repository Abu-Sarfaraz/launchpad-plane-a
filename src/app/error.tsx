'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home, LayoutDashboard, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function GlobalErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Log unexpected errors safely to client console
    console.error('[LaunchPad Telemetry Exception]:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-midnight-950 text-text-primary flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-accent-cyan/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-lg bg-surface-card/90 border border-surface-border rounded-2xl p-8 backdrop-blur-2xl shadow-2xl relative z-10 text-center space-y-6">
        {/* Pulsing Warning Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-glow-purple">
          <AlertTriangle className="w-8 h-8" />
        </div>

        {/* Friendly Heading & Narrative */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-amber-400">
              Telemetry Exception Guard
            </span>
          </div>

          <h1 className="font-display text-2xl md:text-3xl font-bold text-white tracking-tight">
            Unexpected System Hiccup
          </h1>

          <p className="text-sm text-text-secondary leading-relaxed">
            We encountered a temporary processing error during execution. Your data and account session remain safe and preserved.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            type="button"
            variant="primary"
            onClick={() => reset()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 font-semibold shadow-glow-cyan"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </Button>

          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Mission Control</span>
            </Button>
          </Link>

          <Link href="/" className="w-full sm:w-auto">
            <Button
              type="button"
              variant="glass"
              className="w-full flex items-center justify-center gap-2 text-text-muted hover:text-white"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Button>
          </Link>
        </div>

        {/* Collapsible Technical Diagnostics for Debugging */}
        <div className="pt-4 border-t border-surface-border text-left">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center justify-between w-full text-xs text-text-muted hover:text-text-primary transition-colors py-1"
            aria-expanded={showDetails}
          >
            <span className="font-mono text-[11px]">System Diagnostic Information</span>
            {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showDetails && (
            <div className="mt-2.5 rounded-xl bg-midnight-950 border border-surface-border p-3.5 font-mono text-[11px] text-text-secondary leading-normal break-all max-h-36 overflow-y-auto">
              <div className="flex items-center gap-1.5 text-text-muted text-[10px] uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3 text-accent-cyan" />
                <span>Error Fingerprint</span>
              </div>
              <p className="text-rose-400 font-semibold">{error.name || 'Error'}: {error.message || 'Unknown error'}</p>
              {error.digest && (
                <p className="mt-1 text-text-muted">Digest: {error.digest}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
