import React from 'react';
import { SidebarNav } from '@/components/dashboard/SidebarNav';
import { TopStatsCards } from '@/components/dashboard/TopStatsCards';
import { OrderStatusTracker } from '@/components/dashboard/OrderStatusTracker';
import { PaginatedDataTable } from '@/components/dashboard/PaginatedDataTable';
import { PaperStudio } from '@/components/dashboard/PaperStudio';
import { Terminal } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex bg-midnight-950 text-text-primary">
      {/* 260px Collapsible Sidebar */}
      <SidebarNav />

      {/* Main Telemetry Content Area */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-10">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-surface-border gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs text-accent-cyan tracking-wider uppercase">
                TELEMETRY ORBITAL CLUSTER
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-ping" />
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary">
              Mission Control & Deployment Hub
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-control bg-surface-glass border border-surface-border font-mono text-xs">
              <Terminal className="w-3.5 h-3.5 text-accent-purple" />
              <span>Fluid Compute: Node v24.22</span>
            </div>
          </div>
        </div>

        {/* Real-time Order & Subscription Status */}
        <OrderStatusTracker />

        {/* 4 KPI Telemetry Cards */}
        <TopStatsCards />

        {/* Interactive PaperCraft Studio (Autonomous Paper Generator & PDF/DOC Exporter) */}
        <PaperStudio />

        {/* Paginated Sortable Data Table */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-text-primary">
              Recent Deployment Pipelines
            </h2>
            <p className="font-sans text-xs text-text-secondary">
              Real-time build logs and edge telemetry performance traces
            </p>
          </div>
        </div>

        <PaginatedDataTable />
      </main>
    </div>
  );
}
