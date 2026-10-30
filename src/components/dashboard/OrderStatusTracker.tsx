'use client';

import React from 'react';
import { CreditCard, CheckCircle2, Shield, ArrowUpRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface OrderStatusTrackerProps {
  currentTier?: string;
  billingCycle?: string;
  nextBillingDate?: string;
  monthlyAmount?: number;
}

export function OrderStatusTracker({
  currentTier = 'Pro Mission Tier',
  billingCycle = 'Monthly',
  nextBillingDate = 'November 30, 2026',
  monthlyAmount = 99,
}: OrderStatusTrackerProps) {
  return (
    <div className="glass-panel p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left Status Info */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-control bg-accent-purple/20 border border-accent-purple/40 flex items-center justify-center text-accent-purple shrink-0 shadow-glow">
            <Zap className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-display font-bold text-lg text-text-primary">
                {currentTier}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-pill bg-status-success/20 text-status-success font-mono text-[10px] font-bold">
                <CheckCircle2 className="w-3 h-3" />
                <span>ACTIVE SUBSCRIPTION</span>
              </span>
            </div>

            <p className="font-sans text-xs text-text-secondary leading-relaxed max-w-xl">
              Next billing date: <span className="text-text-primary font-medium">{nextBillingDate}</span> (${monthlyAmount}/mo, {billingCycle}). RLS Security audits and Fluid Compute are fully operational.
            </p>
          </div>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <Button variant="glass" size="sm" className="gap-1.5">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Manage Billing</span>
          </Button>

          <Button variant="primary" size="sm" className="gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            <span>Upgrade Cluster</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
