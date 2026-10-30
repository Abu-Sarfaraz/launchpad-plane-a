'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  PlayCircle,
} from 'lucide-react';

export interface DeploymentRow {
  id: string;
  projectName: string;
  slug: string;
  commitSha: string;
  status: 'completed' | 'building' | 'queued' | 'failed';
  environment: 'production' | 'preview';
  duration: string;
  createdAt: string;
}

const mockDeployments: DeploymentRow[] = [
  {
    id: 'dep_01',
    projectName: 'Orbital Mesh Portal',
    slug: 'orbital-mesh.papergen.space',
    commitSha: '7dc8e59',
    status: 'completed',
    environment: 'production',
    duration: '38s',
    createdAt: '2026-10-30 14:22 UTC',
  },
  {
    id: 'dep_02',
    projectName: 'Telemetry WebSocket Relay',
    slug: 'ws-relay.papergen.space',
    commitSha: 'b066403',
    status: 'completed',
    environment: 'production',
    duration: '42s',
    createdAt: '2026-10-30 13:10 UTC',
  },
  {
    id: 'dep_03',
    projectName: 'Multi-Tenant Auth Gateway',
    slug: 'auth-gateway.papergen.space',
    commitSha: 'c8814d6',
    status: 'building',
    environment: 'preview',
    duration: '21s',
    createdAt: '2026-10-30 12:45 UTC',
  },
  {
    id: 'dep_04',
    projectName: 'Stripe Checkout Webhook Pod',
    slug: 'billing.papergen.space',
    commitSha: 'e9921f0',
    status: 'completed',
    environment: 'production',
    duration: '35s',
    createdAt: '2026-10-30 11:30 UTC',
  },
  {
    id: 'dep_05',
    projectName: 'Playwright Browser Cluster',
    slug: 'qa-matrix.papergen.space',
    commitSha: 'f1103c8',
    status: 'queued',
    environment: 'preview',
    duration: '-',
    createdAt: '2026-10-30 10:15 UTC',
  },
  {
    id: 'dep_06',
    projectName: 'Deep Space CDN Mirror',
    slug: 'cdn-mirror.papergen.space',
    commitSha: 'a445690',
    status: 'completed',
    environment: 'production',
    duration: '49s',
    createdAt: '2026-10-29 22:04 UTC',
  },
  {
    id: 'dep_07',
    projectName: 'Postgres RLS Advisor Monitor',
    slug: 'rls-audit.papergen.space',
    commitSha: 'd223019',
    status: 'failed',
    environment: 'preview',
    duration: '18s',
    createdAt: '2026-10-29 19:40 UTC',
  },
  {
    id: 'dep_08',
    projectName: 'Spacecraft Sensor Ingestion',
    slug: 'sensors.papergen.space',
    commitSha: '9bb4211',
    status: 'completed',
    environment: 'production',
    duration: '52s',
    createdAt: '2026-10-29 16:18 UTC',
  },
];

export function PaginatedDataTable() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortKey, setSortKey] = useState<keyof DeploymentRow>('createdAt');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  const filteredData = useMemo(() => {
    return mockDeployments.filter((item) => {
      const matchesSearch =
        item.projectName.toLowerCase().includes(search.toLowerCase()) ||
        item.commitSha.toLowerCase().includes(search.toLowerCase()) ||
        item.slug.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortKey, sortAsc]);

  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key: keyof DeploymentRow) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const getStatusBadge = (status: DeploymentRow['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill bg-status-success/15 text-status-success border border-status-success/30 font-mono text-[11px] font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>COMPLETED</span>
          </span>
        );
      case 'building':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30 font-mono text-[11px] font-semibold animate-pulse">
            <PlayCircle className="w-3.5 h-3.5 animate-spin" />
            <span>BUILDING</span>
          </span>
        );
      case 'queued':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill bg-status-warning/15 text-status-warning border border-status-warning/30 font-mono text-[11px] font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>QUEUED</span>
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill bg-status-danger/15 text-status-danger border border-status-danger/30 font-mono text-[11px] font-semibold">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>FAILED</span>
          </span>
        );
    }
  };

  return (
    <div className="glass-panel p-6">
      {/* Controls: Search and Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search projects or commit..."
            className="w-full pl-9 pr-4 py-2 bg-midnight-900 border border-surface-border rounded-control text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent-purple"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label htmlFor="status-filter-select" className="text-xs text-text-secondary font-mono">
            STATUS:
          </label>
          <select
            id="status-filter-select"
            aria-label="Filter deployments by status"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-midnight-900 border border-surface-border text-text-primary text-xs rounded-control px-3 py-2 focus:outline-none focus:border-accent-purple font-sans"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="building">Building</option>
            <option value="queued">Queued</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse font-sans text-sm">
          <thead>
            <tr className="border-b border-surface-border text-text-secondary font-mono text-xs uppercase tracking-wider">
              <th className="py-3 px-4">
                <button
                  type="button"
                  onClick={() => handleSort('projectName')}
                  className="flex items-center gap-1.5 hover:text-text-primary"
                >
                  <span>Project & Domain</span>
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </button>
              </th>
              <th className="py-3 px-4">
                <button
                  type="button"
                  onClick={() => handleSort('status')}
                  className="flex items-center gap-1.5 hover:text-text-primary"
                >
                  <span>Status</span>
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </button>
              </th>
              <th className="py-3 px-4">Commit SHA</th>
              <th className="py-3 px-4">Env</th>
              <th className="py-3 px-4">Duration</th>
              <th className="py-3 px-4">
                <button
                  type="button"
                  onClick={() => handleSort('createdAt')}
                  className="flex items-center gap-1.5 hover:text-text-primary"
                >
                  <span>Timestamp</span>
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </button>
              </th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-text-secondary">
                  No telemetry deployments matched your query.
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-surface-glass/40 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="font-display font-semibold text-text-primary">
                      {row.projectName}
                    </div>
                    <div className="font-mono text-xs text-text-secondary">
                      {row.slug}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">{getStatusBadge(row.status)}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-midnight-900 border border-surface-border text-accent-purple">
                      {row.commitSha}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs">
                    <span
                      className={`px-2 py-0.5 rounded-pill ${
                        row.environment === 'production'
                          ? 'bg-accent-purple/20 text-accent-purple'
                          : 'bg-midnight-900 text-text-secondary'
                      }`}
                    >
                      {row.environment}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-text-secondary">
                    {row.duration}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-text-secondary">
                    {row.createdAt}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      className="p-1.5 text-text-secondary hover:text-accent-cyan hover:bg-surface-glass rounded transition-colors"
                      title="Inspect Live Deployment"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="pt-4 mt-2 border-t border-surface-border flex items-center justify-between text-xs text-text-secondary font-mono">
        <div>
          Showing {paginatedData.length} of {sortedData.length} entries
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-control bg-surface-glass border border-surface-border disabled:opacity-40 disabled:pointer-events-none hover:text-text-primary transition-colors"
            aria-label="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-control bg-surface-glass border border-surface-border disabled:opacity-40 disabled:pointer-events-none hover:text-text-primary transition-colors"
            aria-label="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
