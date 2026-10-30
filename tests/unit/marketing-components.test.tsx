import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HeroLaunchPad } from '@/components/marketing/HeroLaunchPad';
import { FeatureGrid3Col } from '@/components/marketing/FeatureGrid3Col';
import { GlassPricingTable } from '@/components/marketing/GlassPricingTable';
import { TestimonialsCarousel } from '@/components/marketing/TestimonialsCarousel';
import { ResponsiveFooter } from '@/components/marketing/ResponsiveFooter';

describe('Phase 3 Plane A UI: Marketing Components', () => {
  it('renders HeroLaunchPad with orbital badge, H1, and dual CTAs', () => {
    render(<HeroLaunchPad />);
    expect(screen.getByText(/Orbital Infrastructure Active/i)).toBeInTheDocument();
    expect(screen.getByText(/Space-Tech Cloud/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Get Started/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Explore Telemetry/i })).toBeInTheDocument();
  });

  it('renders FeatureGrid3Col with 3-column features and metrics', () => {
    render(<FeatureGrid3Col />);
    expect(screen.getByText(/Orbital Cloud Fabric/i)).toBeInTheDocument();
    expect(screen.getByText(/Telemetry Telepresence/i)).toBeInTheDocument();
    expect(screen.getByText(/Multi-Tenant RLS Fortress/i)).toBeInTheDocument();
    expect(screen.getByText('99.999% SLA')).toBeInTheDocument();
    expect(screen.getByText('< 15ms LATENCY')).toBeInTheDocument();
  });

  it('renders GlassPricingTable with Starter, Pro, and Enterprise tiers and toggles monthly/annual', () => {
    render(<GlassPricingTable />);
    expect(screen.getByText('Starter')).toBeInTheDocument();
    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(screen.getByText('Enterprise')).toBeInTheDocument();

    // Default monthly
    expect(screen.getByText('$29')).toBeInTheDocument();
    expect(screen.getByText('$99')).toBeInTheDocument();
    expect(screen.getByText('$299')).toBeInTheDocument();

    // Switch to annual
    const annualBtn = screen.getByRole('button', { name: /Annual Billing/i });
    fireEvent.click(annualBtn);

    // 20% discounted prices
    expect(screen.getByText('$24')).toBeInTheDocument();
    expect(screen.getByText('$79')).toBeInTheDocument();
    expect(screen.getByText('$249')).toBeInTheDocument();
  });

  it('renders TestimonialsCarousel and navigates between testimonials', () => {
    render(<TestimonialsCarousel />);
    expect(screen.getByText(/AetherSpace Dynamics/i)).toBeInTheDocument();

    // Click next
    const nextBtn = screen.getByRole('button', { name: /Next testimonial/i });
    fireEvent.click(nextBtn);
    expect(screen.getByText(/Nova Telepresence/i)).toBeInTheDocument();
  });

  it('renders ResponsiveFooter with status pill and legal info', () => {
    render(<ResponsiveFooter />);
    expect(screen.getByText(/All Systems Nominal/i)).toBeInTheDocument();
    expect(screen.getByText(/DESIGN.md Token Verified/i)).toBeInTheDocument();
  });
});
