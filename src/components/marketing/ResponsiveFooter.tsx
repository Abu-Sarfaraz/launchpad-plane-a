'use client';

import React from 'react';
import Link from 'next/link';
import { Rocket, ShieldCheck, Github, Twitter } from 'lucide-react';

export function ResponsiveFooter() {
  return (
    <footer className="border-t border-surface-border bg-midnight-950 py-16 text-text-secondary text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-control bg-accent-purple/20 border border-accent-purple/40 flex items-center justify-center text-accent-purple shadow-glow">
                <Rocket className="w-4 h-4" />
              </div>
              <span className="font-display font-bold text-lg text-text-primary">
                PaperGen
              </span>
            </Link>
            <p className="font-sans text-xs text-text-secondary leading-relaxed mb-4">
              Next-generation orbital infrastructure and deployment control plane
              engineered for high-velocity software delivery.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-midnight-900 border border-surface-border text-status-success font-mono text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-ping" />
              <span>All Systems Nominal</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-display font-semibold text-text-primary text-xs uppercase tracking-wider mb-4">
              Product
            </h4>
            <ul className="space-y-2.5 text-xs font-sans">
              <li>
                <a href="#features" className="hover:text-text-primary transition-colors">
                  Orbital Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-text-primary transition-colors">
                  Telemetry Pricing
                </a>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-text-primary transition-colors">
                  Customer Dashboard
                </Link>
              </li>
              <li>
                <Link href="/auth" className="hover:text-text-primary transition-colors">
                  Mission Gateway
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Standards */}
          <div>
            <h4 className="font-display font-semibold text-text-primary text-xs uppercase tracking-wider mb-4">
              Architecture
            </h4>
            <ul className="space-y-2.5 text-xs font-sans">
              <li>
                <span className="text-text-secondary">Next.js App Router</span>
              </li>
              <li>
                <span className="text-text-secondary">React 19 & Fluid Compute</span>
              </li>
              <li>
                <span className="text-text-secondary">PostgreSQL Multi-Tenant RLS</span>
              </li>
              <li>
                <span className="text-text-secondary">WCAG AA Accessible Tokens</span>
              </li>
            </ul>
          </div>

          {/* Compliance & Security */}
          <div>
            <h4 className="font-display font-semibold text-text-primary text-xs uppercase tracking-wider mb-4">
              Compliance & Security
            </h4>
            <div className="p-3 rounded-control bg-surface-glass border border-surface-border mb-3">
              <div className="flex items-center gap-1.5 text-status-success font-mono text-xs mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero-Trust RLS</span>
              </div>
              <p className="font-sans text-[11px] text-text-secondary">
                Enforced by automated lifecycle hooks and PostgreSQL advisory audits.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-control bg-surface-glass border border-surface-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-surface-border-hover transition-colors"
                aria-label="GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-control bg-surface-glass border border-surface-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-surface-border-hover transition-colors"
                aria-label="Twitter Profile"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-surface-border pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-text-secondary gap-4 font-mono">
          <div>
            © {new Date().getFullYear()} PaperGen. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>DESIGN.md Token Verified</span>
            <span>Plane A MVP Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
