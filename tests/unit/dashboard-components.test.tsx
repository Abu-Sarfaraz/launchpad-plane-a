import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SidebarNav } from '@/components/dashboard/SidebarNav';
import { TopStatsCards } from '@/components/dashboard/TopStatsCards';
import { PaginatedDataTable } from '@/components/dashboard/PaginatedDataTable';
import { OrderStatusTracker } from '@/components/dashboard/OrderStatusTracker';
import { PaperStudio } from '@/components/dashboard/PaperStudio';

describe('Phase 3 Plane A UI: Dashboard Components', () => {
  it('renders SidebarNav and toggles collapsed state', () => {
    render(<SidebarNav userEmail="cadet@papergen.space" orgName="Orbital Lab" />);
    expect(screen.getByText('Mission Overview')).toBeInTheDocument();
    expect(screen.getByText('cadet@papergen.space')).toBeInTheDocument();

    const collapseBtn = screen.getByRole('button', { name: /Collapse Sidebar/i });
    fireEvent.click(collapseBtn);

    // When collapsed, full text is hidden
    expect(screen.queryByText('cadet@papergen.space')).not.toBeInTheDocument();

    const expandBtn = screen.getByRole('button', { name: /Expand Sidebar/i });
    fireEvent.click(expandBtn);
    expect(screen.getByText('cadet@papergen.space')).toBeInTheDocument();
  });

  it('renders TopStatsCards with all 4 KPI cards', () => {
    render(<TopStatsCards />);
    expect(screen.getByText('ACTIVE PROJECTS')).toBeInTheDocument();
    expect(screen.getByText('PIPELINE VELOCITY')).toBeInTheDocument();
    expect(screen.getByText('MONTHLY API QUOTA')).toBeInTheDocument();
    expect(screen.getByText('RLS SECURITY STATUS')).toBeInTheDocument();
    expect(screen.getByText('100% Zero-Trust')).toBeInTheDocument();
  });

  it('renders OrderStatusTracker with current subscription details', () => {
    render(
      <OrderStatusTracker
        currentTier="Pro Mission Tier"
        monthlyAmount={99}
        billingCycle="Monthly"
      />
    );
    expect(screen.getByText('Pro Mission Tier')).toBeInTheDocument();
    expect(screen.getByText(/ACTIVE SUBSCRIPTION/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Manage Billing/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Upgrade Cluster/i })).toBeInTheDocument();
  });

  it('renders PaginatedDataTable, filters by search, and navigates pages', () => {
    render(<PaginatedDataTable />);
    expect(screen.getByText('Orbital Mesh Portal')).toBeInTheDocument();

    // Search filter
    const searchInput = screen.getByPlaceholderText(/Search projects or commit/i);
    fireEvent.change(searchInput, { target: { value: 'Relay' } });
    expect(screen.getByText('Telemetry WebSocket Relay')).toBeInTheDocument();
    expect(screen.queryByText('Orbital Mesh Portal')).not.toBeInTheDocument();

    // Clear search
    fireEvent.change(searchInput, { target: { value: '' } });

    // Page navigation
    const nextBtn = screen.getByRole('button', { name: /Next Page/i });
    fireEvent.click(nextBtn);
    expect(screen.getByText(/Page 2 of/i)).toBeInTheDocument();
  });

  it('renders PaperStudio and shows Download as PDF and Download as DOC after generation', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        text: '# Official Examination Paper\n\n## Section 1: Questions\n1. Explain Newton\'s First Law. [4 marks]',
        provider: 'gemini',
        model: 'gemini-2.5-flash',
        latencyMs: 420,
        fallbackUsed: false,
      }),
    });
    vi.stubGlobal('fetch', mockFetch);

    render(<PaperStudio />);

    expect(screen.getByText(/Autonomous Exam & Academic Paper Creator/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Paper Title/i)).toBeInTheDocument();

    const generateBtn = screen.getByRole('button', { name: /Generate Paper with Multi-Provider AI/i });
    expect(generateBtn).toBeInTheDocument();

    fireEvent.click(generateBtn);

    await waitFor(() => {
      expect(screen.getByText(/Paper Generated Successfully/i)).toBeInTheDocument();
    });

    // Verify both "Download as PDF" and "Download as DOC" buttons appear
    const pdfButtons = screen.getAllByRole('button', { name: /Download as PDF/i });
    const docButtons = screen.getAllByRole('button', { name: /Download as DOC/i });

    expect(pdfButtons.length).toBeGreaterThanOrEqual(1);
    expect(docButtons.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Explain Newton's First Law/i)).toBeInTheDocument();

    vi.unstubAllGlobals();
  });
});
