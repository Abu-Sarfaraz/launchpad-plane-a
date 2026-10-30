'use client';

import React from 'react';
import { Rocket, ShieldCheck, Activity, Cpu, Database, Zap } from 'lucide-react';

interface FeatureItem {
  icon: React.ElementType;
  title: string;
  description: string;
  metric: string;
  badge: string;
}

const features: FeatureItem[] = [
  {
    icon: Rocket,
    title: 'Orbital Cloud Fabric',
    description:
      'Ultra-resilient microservices orchestrated across decentralized edge zones with automated failover.',
    metric: '99.999% SLA',
    badge: 'EDGE COMPUTE',
  },
  {
    icon: Activity,
    title: 'Telemetry Telepresence',
    description:
      'Live streaming metrics and distributed traces delivered under 15ms through our websocket event bus.',
    metric: '< 15ms LATENCY',
    badge: 'REALTIME STREAM',
  },
  {
    icon: ShieldCheck,
    title: 'Multi-Tenant RLS Fortress',
    description:
      'Strict PostgreSQL Row-Level Security policies bound to organization memberships with zero data leakage.',
    metric: 'ZERO-TRUST RLS',
    badge: 'COMPLIANCE',
  },
  {
    icon: Cpu,
    title: 'Autonomous Scaling Mesh',
    description:
      'Dynamic compute allocation that auto-scales resources to mission workloads with instant cold starts.',
    metric: '50ms COLD START',
    badge: 'AUTONOMOUS',
  },
  {
    icon: Database,
    title: 'Instant Database Replicas',
    description:
      'High-throughput PostgreSQL persistence with integrated point-in-time recovery and transactional webhooks.',
    metric: '100K OPS/SEC',
    badge: 'POSTGRES 15',
  },
  {
    icon: Zap,
    title: 'One-Click Global Deploy',
    description:
      'Continuous verification pipelines that build, test, and promote production deployments seamlessly.',
    metric: '45s TIME TO EDGE',
    badge: 'CI/CD HYGIENE',
  },
];

export function FeatureGrid3Col() {
  return (
    <section id="features" className="py-20 bg-midnight-950/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 rounded-pill bg-accent-purple/10 border border-accent-purple/30 text-accent-purple font-mono text-xs uppercase tracking-wider mb-4">
            CORE CAPABILITIES
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary tracking-tight mb-4">
            Engineered for Deep Space & Mission-Critical Cloud
          </h2>
          <p className="font-sans text-text-secondary text-base sm:text-lg">
            Every layer of PaperGen is calibrated to deliver ultra-low latency,
            uncompromising security, and deterministic reliability.
          </p>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="glass-panel p-6 flex flex-col justify-between group hover:border-surface-border-hover transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-control bg-accent-purple/15 border border-accent-purple/30 flex items-center justify-center text-accent-purple group-hover:scale-105 group-hover:border-accent-purple transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded-pill bg-midnight-900 border border-surface-border text-accent-cyan">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-semibold text-text-primary mb-2">
                    {feature.title}
                  </h3>

                  <p className="font-sans text-sm text-text-secondary leading-relaxed mb-6">
                    {feature.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-surface-border flex items-center justify-between">
                  <span className="font-mono text-xs text-text-secondary">
                    METRIC
                  </span>
                  <span className="font-mono text-xs font-bold text-accent-cyan">
                    {feature.metric}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
