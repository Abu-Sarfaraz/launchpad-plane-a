'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Check, Sparkles, Zap, Shield, Rocket } from 'lucide-react';

interface PricingTier {
  name: string;
  badge?: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  isPopular?: boolean;
  features: string[];
  ctaText: string;
  ctaVariant: 'primary' | 'glass' | 'cyan';
  icon: React.ElementType;
}

const tiers: PricingTier[] = [
  {
    name: 'Starter',
    description: 'Essential telemetry and cloud scaffolding for indie developers and small experiments.',
    monthlyPrice: 29,
    annualPrice: 24,
    features: [
      'Up to 3 Active Cloud Projects',
      '1,000 Deployment Minutes / mo',
      'Community Support & Telemetry Logs',
      'Standard Multi-Tenant RLS Security',
      'Single User Workspace',
    ],
    ctaText: 'Deploy Starter',
    ctaVariant: 'glass',
    icon: Zap,
  },
  {
    name: 'Pro',
    badge: 'MOST POPULAR',
    isPopular: true,
    description: 'High-velocity infrastructure with dedicated edge compute and advanced telemetry streams.',
    monthlyPrice: 99,
    annualPrice: 79,
    features: [
      'Unlimited Cloud Projects',
      '20,000 Deployment Minutes / mo',
      'Real-Time WebSocket Telemetry',
      'Multi-Seat Organization (up to 10)',
      'Automated Playwright QA & A11y Audits',
      'Priority 24/7 Mission Support',
    ],
    ctaText: 'Launch Pro Mission',
    ctaVariant: 'primary',
    icon: Rocket,
  },
  {
    name: 'Enterprise',
    badge: 'CUSTOM CLUSTER',
    description: 'Dedicated orbital clusters with guaranteed 99.999% SLA and customized compliance pipelines.',
    monthlyPrice: 299,
    annualPrice: 249,
    features: [
      'Dedicated Edge Cloud Cluster',
      'Unlimited Deployment Compute',
      'Custom SLA & 99.999% Uptime Guarantee',
      'Dedicated Security Advisor & Custom RLS',
      'SSO & SAML Authentication',
      'Dedicated Solutions Architect',
    ],
    ctaText: 'Contact Enterprise',
    ctaVariant: 'cyan',
    icon: Shield,
  },
];

export function GlassPricingTable() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      {/* Glow highlight */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-accent-purple/10 blur-[130px] pointer-events-none rounded-full"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 rounded-pill bg-accent-purple/10 border border-accent-purple/30 text-accent-purple font-mono text-xs uppercase tracking-wider mb-4">
            TRANSPARENT TELEMETRY PRICING
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary tracking-tight mb-4">
            Predictable Cloud Scaling, Zero Surprises
          </h2>
          <p className="font-sans text-text-secondary text-base sm:text-lg mb-8">
            Choose the trajectory that fits your team. Switch or cancel anytime.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="inline-flex items-center gap-3 p-1.5 rounded-pill bg-surface-glass border border-surface-border backdrop-blur-glass">
            <button
              type="button"
              onClick={() => setIsAnnual(false)}
              className={`px-5 py-2 rounded-pill font-sans text-xs font-semibold transition-all ${
                !isAnnual
                  ? 'bg-accent-purple text-text-primary shadow-glow'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setIsAnnual(true)}
              className={`px-5 py-2 rounded-pill font-sans text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isAnnual
                  ? 'bg-accent-purple text-text-primary shadow-glow'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <span>Annual Billing</span>
              <span className="px-1.5 py-0.5 rounded-pill bg-status-success/20 text-status-success text-[10px] font-bold">
                SAVE 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier, idx) => {
            const price = isAnnual ? tier.annualPrice : tier.monthlyPrice;
            const Icon = tier.icon;

            return (
              <div
                key={idx}
                className={`glass-panel p-8 flex flex-col justify-between transition-all duration-300 ${
                  tier.isPopular
                    ? 'border-accent-purple ring-1 ring-accent-purple/60 shadow-glow relative scale-100 lg:-translate-y-2'
                    : 'hover:border-surface-border-hover'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-control bg-accent-purple/15 border border-accent-purple/30 flex items-center justify-center text-accent-purple">
                      <Icon className="w-5 h-5" />
                    </div>
                    {tier.badge && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-pill bg-accent-purple text-text-primary text-[10px] font-mono font-bold uppercase tracking-wider shadow-glow">
                        <Sparkles className="w-3 h-3 text-accent-cyan" />
                        {tier.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-2xl font-bold text-text-primary mb-2">
                    {tier.name}
                  </h3>
                  <p className="font-sans text-text-secondary text-sm mb-6 min-h-[40px]">
                    {tier.description}
                  </p>

                  <div className="mb-6 pb-6 border-b border-surface-border">
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-4xl sm:text-5xl font-bold text-text-primary">
                        ${price}
                      </span>
                      <span className="font-sans text-text-secondary text-sm">
                        / month
                      </span>
                    </div>
                    <span className="font-mono text-xs text-text-secondary">
                      {isAnnual ? 'billed annually ($' + price * 12 + '/yr)' : 'billed month-to-month'}
                    </span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 mb-8">
                    <div className="font-mono text-xs uppercase tracking-wider text-text-secondary">
                      INCLUDED CAPABILITIES:
                    </div>
                    {tier.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-sm">
                        <div className="w-4 h-4 rounded-full bg-status-success/20 text-status-success flex items-center justify-center mt-0.5 shrink-0">
                          <Check className="w-3 h-3" />
                        </div>
                        <span className="text-text-primary font-sans">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/auth?flow=signup&tier=${tier.name.toLowerCase()}&billing=${
                    isAnnual ? 'annual' : 'monthly'
                  }`}
                  className="w-full block"
                >
                  <Button
                    size="lg"
                    variant={tier.ctaVariant}
                    className="w-full font-semibold"
                  >
                    {tier.ctaText}
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
