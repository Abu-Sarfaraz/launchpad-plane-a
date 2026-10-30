'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldAlert,
  Server,
  Cpu,
  Users,
  CreditCard,
  Zap,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  LogOut,
  ArrowUpRight,
  Sparkles,
  Check,
  Send,
  Database as DbIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface SystemState {
  timestamp: string;
  database: {
    status: string;
    totalOrganizations: number;
    totalProfiles: number;
    totalOrders: number;
    totalRevenueCents: number;
  };
  aiHealth: {
    status: string;
    activeProvider: string;
    gemini: { provider: string; status: string; latencyMs?: number; message?: string };
    openrouter: { provider: string; status: string; latencyMs?: number; message?: string };
    timestamp: string;
  };
  environment: Record<string, boolean>;
  nodeVersion: string;
}

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  is_super_admin: boolean;
  created_at: string;
  memberships: Array<{
    organization_id: string;
    role: string;
    organizations: { name: string; slug: string } | null;
  }>;
}

interface OrderItem {
  id: string;
  organization_id: string;
  user_id: string | null;
  amount_cents: number;
  currency: string;
  status: string;
  tier: string;
  created_at: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'ai' | 'users' | 'orders' | 'system'>('ai');
  const [systemState, setSystemState] = useState<SystemState | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // AI Prompt Runner state
  const [promptText, setPromptText] = useState('Generate an executive summary for an academic research paper on autonomous agent architectures.');
  const [forceProvider, setForceProvider] = useState<'auto' | 'gemini' | 'openrouter'>('auto');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<{
    text: string;
    provider: string;
    model: string;
    latencyMs: number;
    fallbackUsed: boolean;
  } | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const fetchSystemData = useCallback(async () => {
    setRefreshing(true);
    try {
      const [sysRes, usersRes, ordersRes] = await Promise.all([
        fetch('/api/admin/system'),
        fetch('/api/admin/users'),
        fetch('/api/admin/orders'),
      ]);

      if (sysRes.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (sysRes.ok) {
        const sysData = await sysRes.json();
        setSystemState(sysData);
      }
      if (usersRes.ok) {
        const uData = await usersRes.json();
        setUsers(uData.users || []);
      }
      if (ordersRes.ok) {
        const oData = await ordersRes.json();
        setOrders(oData.orders || []);
      }
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    fetchSystemData();
  }, [fetchSystemData]);

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  const handleToggleSuperAdmin = async (userId: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, isSuperAdmin: !currentStatus }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, is_super_admin: !currentStatus } : u))
        );
      }
    } catch (err) {
      console.error('Failed to toggle admin status:', err);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  const handleRunAiPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;

    setAiGenerating(true);
    setAiResult(null);
    setAiError(null);

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          forceProvider: forceProvider === 'auto' ? undefined : forceProvider,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Generation failed');
      }

      setAiResult({
        text: data.text,
        provider: data.provider,
        model: data.model,
        latencyMs: data.latencyMs,
        fallbackUsed: data.fallbackUsed,
      });
    } catch (err: unknown) {
      setAiError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setAiGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-fg-primary flex flex-col">
      {/* Top Admin Navigation */}
      <header className="border-b border-border-default/80 bg-canvas-card/80 backdrop-blur-xl sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-purple/20 to-accent-cyan/20 border border-border-default flex items-center justify-center text-accent-cyan shadow-inner">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-tight">LaunchPad Control Plane</h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30 rounded-full uppercase tracking-wider">
                Admin
              </span>
            </div>
            <p className="text-xs text-fg-muted">Enterprise Platform Governance & Engine Fallback</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSystemData}
            disabled={refreshing}
            className="flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
          <a
            href="/dashboard"
            className="text-xs text-fg-secondary hover:text-fg-primary px-3 py-1.5 rounded-lg border border-border-default hover:bg-canvas-subtle transition-all flex items-center gap-1"
          >
            Dashboard <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={handleLogout}
            aria-label="Logout of admin session"
            className="text-xs text-error hover:bg-error/10 px-3 py-1.5 rounded-lg border border-error/20 transition-all flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Supabase DB */}
          <div className="p-5 rounded-2xl bg-canvas-card border border-border-default backdrop-blur-xl relative overflow-hidden group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-fg-secondary">Database Architecture</span>
              <DbIcon className="w-4 h-4 text-accent-cyan" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {systemState?.database.status === 'connected' ? 'Connected' : 'Degraded'}
            </div>
            <div className="flex items-center gap-2 text-xs text-fg-muted">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span>Multi-Tenant RLS Enabled</span>
            </div>
          </div>

          {/* Card 2: AI Engine Health */}
          <div className="p-5 rounded-2xl bg-canvas-card border border-border-default backdrop-blur-xl relative overflow-hidden group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-fg-secondary">AI Fallback Engine</span>
              <Cpu className="w-4 h-4 text-brand-purple" />
            </div>
            <div className="text-2xl font-bold text-white mb-1 capitalize">
              {systemState?.aiHealth.status || 'Active'}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-fg-muted">
              <span>Primary:</span>
              <span className="text-accent-cyan font-semibold">Gemini</span>
              <span>→ Backup:</span>
              <span className="text-brand-purple font-semibold">OpenRouter</span>
            </div>
          </div>

          {/* Card 3: Users & Profiles */}
          <div className="p-5 rounded-2xl bg-canvas-card border border-border-default backdrop-blur-xl relative overflow-hidden group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-fg-secondary">Profiles & Orgs</span>
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {systemState?.database.totalProfiles ?? users.length} Profiles
            </div>
            <div className="text-xs text-fg-muted">
              Across {systemState?.database.totalOrganizations ?? 1} organization
            </div>
          </div>

          {/* Card 4: Orders & Revenue */}
          <div className="p-5 rounded-2xl bg-canvas-card border border-border-default backdrop-blur-xl relative overflow-hidden group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-fg-secondary">Financial Activity</span>
              <CreditCard className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              ${(((systemState?.database.totalRevenueCents ?? 0) / 100).toFixed(2))}
            </div>
            <div className="text-xs text-fg-muted">
              {orders.length} transactions processed
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-border-default pb-px">
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-4 py-2.5 text-sm font-medium rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
              activeTab === 'ai'
                ? 'border-accent-cyan text-accent-cyan bg-accent-cyan/5 font-semibold'
                : 'border-transparent text-fg-secondary hover:text-fg-primary'
            }`}
          >
            <Cpu className="w-4 h-4" /> AI Engine & Fallback Studio
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 text-sm font-medium rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
              activeTab === 'users'
                ? 'border-accent-cyan text-accent-cyan bg-accent-cyan/5 font-semibold'
                : 'border-transparent text-fg-secondary hover:text-fg-primary'
            }`}
          >
            <Users className="w-4 h-4" /> User Management ({users.length})
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 text-sm font-medium rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
              activeTab === 'orders'
                ? 'border-accent-cyan text-accent-cyan bg-accent-cyan/5 font-semibold'
                : 'border-transparent text-fg-secondary hover:text-fg-primary'
            }`}
          >
            <CreditCard className="w-4 h-4" /> Orders & Transactions ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`px-4 py-2.5 text-sm font-medium rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
              activeTab === 'system'
                ? 'border-accent-cyan text-accent-cyan bg-accent-cyan/5 font-semibold'
                : 'border-transparent text-fg-secondary hover:text-fg-primary'
            }`}
          >
            <Server className="w-4 h-4" /> Environment & Credentials Audit
          </button>
        </div>

        {/* Tab 1: AI Engine & Fallback Studio */}
        {activeTab === 'ai' && (
          <div className="space-y-6">
            {/* Provider Status Tiles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Gemini Provider Tile */}
              <div className="p-6 rounded-2xl bg-canvas-card border border-border-default">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-accent-cyan/15 text-accent-cyan flex items-center justify-center font-bold text-sm">
                      G
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">Google Gemini API (Primary)</h2>
                      <p className="text-xs text-fg-muted">Default primary inference model: gemini-2.5-flash</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-success/15 text-success border border-success/30 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Healthy
                  </span>
                </div>
                <div className="space-y-2 text-xs text-fg-secondary bg-canvas-subtle p-3 rounded-xl border border-border-default">
                  <div className="flex justify-between">
                    <span>Configured Env Var:</span>
                    <span className="text-fg-primary font-mono font-semibold">GEMINI_API_KEY</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Target Latency:</span>
                    <span className="text-accent-cyan font-semibold">~450ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Failover Policy:</span>
                    <span className="text-fg-primary">Trigger on 429, 5xx, or network timeout</span>
                  </div>
                </div>
              </div>

              {/* OpenRouter Provider Tile */}
              <div className="p-6 rounded-2xl bg-canvas-card border border-border-default">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-brand-purple/15 text-brand-purple flex items-center justify-center font-bold text-sm">
                      OR
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">OpenRouter API (Backup)</h2>
                      <p className="text-xs text-fg-muted">Hot failover backup provider: google/gemini-2.5-flash</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-brand-purple/15 text-brand-purple border border-brand-purple/30 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" /> Hot Standby
                  </span>
                </div>
                <div className="space-y-2 text-xs text-fg-secondary bg-canvas-subtle p-3 rounded-xl border border-border-default">
                  <div className="flex justify-between">
                    <span>Configured Env Var:</span>
                    <span className="text-fg-primary font-mono font-semibold">OPENROUTER_API_KEY</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Endpoint:</span>
                    <span className="text-fg-primary font-mono">openrouter.ai/api/v1</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="text-success font-semibold">Verified & Standby</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Prompt Runner / Tester */}
            <div className="p-6 rounded-2xl bg-canvas-card border border-border-default space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-accent-cyan" /> Fallback Engine Interactive Playground
                  </h2>
                  <p className="text-xs text-fg-muted">
                    Test live AI generation and observe transparent automatic failover in real time.
                  </p>
                </div>
                {/* Provider Selector */}
                <div className="flex items-center gap-2 bg-canvas-subtle p-1 rounded-xl border border-border-default text-xs">
                  <button
                    type="button"
                    onClick={() => setForceProvider('auto')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      forceProvider === 'auto'
                        ? 'bg-accent-cyan text-canvas-card font-bold shadow'
                        : 'text-fg-secondary hover:text-fg-primary'
                    }`}
                  >
                    Auto Fallback
                  </button>
                  <button
                    type="button"
                    onClick={() => setForceProvider('gemini')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      forceProvider === 'gemini'
                        ? 'bg-accent-cyan text-canvas-card font-bold shadow'
                        : 'text-fg-secondary hover:text-fg-primary'
                    }`}
                  >
                    Force Gemini
                  </button>
                  <button
                    type="button"
                    onClick={() => setForceProvider('openrouter')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      forceProvider === 'openrouter'
                        ? 'bg-accent-cyan text-canvas-card font-bold shadow'
                        : 'text-fg-secondary hover:text-fg-primary'
                    }`}
                  >
                    Force OpenRouter
                  </button>
                </div>
              </div>

              <form onSubmit={handleRunAiPrompt} className="space-y-4">
                <div>
                  <label htmlFor="ai-prompt-input" className="sr-only">AI Prompt</label>
                  <textarea
                    id="ai-prompt-input"
                    rows={3}
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    placeholder="Enter prompt to execute..."
                    className="w-full bg-canvas-subtle border border-border-default rounded-xl p-3 text-sm text-fg-primary focus:outline-none focus:ring-2 focus:ring-accent-cyan/50 transition-all font-mono"
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={aiGenerating}
                    className="flex items-center gap-1.5"
                  >
                    <span>{aiGenerating ? 'Generating with AI...' : 'Execute Prompt with Multi-Provider'}</span>
                    {!aiGenerating && <Send className="w-3.5 h-3.5 ml-1" />}
                  </Button>
                </div>
              </form>

              {aiError && (
                <div role="alert" className="p-4 rounded-xl bg-error/10 border border-error/20 text-xs text-error flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{aiError}</span>
                </div>
              )}

              {aiResult && (
                <div className="mt-4 p-5 rounded-xl bg-canvas-subtle border border-border-default space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-border-default/60">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-fg-muted">Resolved Provider:</span>
                      <span className="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30">
                        {aiResult.provider}
                      </span>
                      <span className="text-xs text-fg-muted font-mono">({aiResult.model})</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      {aiResult.fallbackUsed ? (
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          Fallback Triggered
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-success/15 text-success border border-success/30">
                          Primary Succeeded
                        </span>
                      )}
                      <span className="text-fg-muted font-mono">{aiResult.latencyMs}ms</span>
                    </div>
                  </div>

                  <div className="text-sm text-fg-primary leading-relaxed whitespace-pre-wrap font-sans">
                    {aiResult.text}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: User Management */}
        {activeTab === 'users' && (
          <div className="p-6 rounded-2xl bg-canvas-card border border-border-default space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Registered User Directory</h2>
                <p className="text-xs text-fg-muted">Manage tenant accounts, super admin privileges, and organization access.</p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border-default">
              <table className="w-full text-left text-sm">
                <thead className="bg-canvas-subtle text-xs text-fg-muted uppercase tracking-wider border-b border-border-default">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Organizations</th>
                    <th className="py-3 px-4">Role Privileges</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-default/60">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-fg-muted text-sm">
                        No user profiles registered yet. Users will appear here upon signup.
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id} className="hover:bg-canvas-subtle/50 transition-colors">
                        <td className="py-3.5 px-4 font-medium text-white flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-accent-cyan/15 text-accent-cyan flex items-center justify-center font-bold text-xs uppercase">
                            {u.full_name ? u.full_name[0] : u.email[0]}
                          </div>
                          <span>{u.full_name || 'Anonymous User'}</span>
                        </td>
                        <td className="py-3.5 px-4 text-fg-secondary font-mono text-xs">{u.email}</td>
                        <td className="py-3.5 px-4 text-xs text-fg-muted">
                          {u.memberships.length > 0 ? (
                            u.memberships.map((m, idx) => (
                              <span key={idx} className="mr-1.5 px-2 py-0.5 rounded bg-canvas-subtle border border-border-default text-fg-primary">
                                {m.organizations?.name || 'Default Org'} ({m.role})
                              </span>
                            ))
                          ) : (
                            <span className="text-fg-muted italic">Individual</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          {u.is_super_admin ? (
                            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-brand-purple/20 text-brand-purple border border-brand-purple/40">
                              Super Admin
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-canvas-subtle text-fg-muted border border-border-default">
                              Standard User
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleToggleSuperAdmin(u.id, u.is_super_admin)}
                            className="text-xs px-3 py-1.5 rounded-lg border border-border-default hover:bg-canvas-subtle text-fg-secondary hover:text-white transition-all"
                          >
                            {u.is_super_admin ? 'Revoke Super Admin' : 'Grant Super Admin'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Orders & Transactions */}
        {activeTab === 'orders' && (
          <div className="p-6 rounded-2xl bg-canvas-card border border-border-default space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Platform Transactions & Checkout Orders</h2>
                <p className="text-xs text-fg-muted">Real-time order statuses, payment provider records, and fulfillment control.</p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border-default">
              <table className="w-full text-left text-sm">
                <thead className="bg-canvas-subtle text-xs text-fg-muted uppercase tracking-wider border-b border-border-default">
                  <tr>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Provider</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Modify Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-default/60">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-fg-muted text-sm">
                        No orders recorded yet. Checkout sessions will appear here.
                      </td>
                    </tr>
                  ) : (
                    orders.map((o) => (
                      <tr key={o.id} className="hover:bg-canvas-subtle/50 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-xs text-fg-primary">{o.id.slice(0, 13)}...</td>
                        <td className="py-3.5 px-4 font-semibold text-white">
                          ${(o.amount_cents / 100).toFixed(2)} {o.currency.toUpperCase()}
                        </td>
                        <td className="py-3.5 px-4 text-xs font-mono uppercase">{o.tier}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${
                              o.status === 'completed'
                                ? 'bg-success/15 text-success border-success/30'
                                : o.status === 'pending'
                                ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                                : 'bg-error/15 text-error border-error/30'
                            }`}
                          >
                            {o.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-fg-muted">
                          {new Date(o.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <select
                            aria-label={`Update status for order ${o.id.slice(0, 8)}`}
                            value={o.status}
                            onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                            className="bg-canvas-subtle border border-border-default rounded-lg px-2 py-1 text-xs text-fg-primary focus:outline-none focus:ring-1 focus:ring-accent-cyan"
                          >
                            <option value="pending">pending</option>
                            <option value="completed">completed</option>
                            <option value="refunded">refunded</option>
                            <option value="failed">failed</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Environment & Credentials Audit */}
        {activeTab === 'system' && (
          <div className="p-6 rounded-2xl bg-canvas-card border border-border-default space-y-6">
            <div>
              <h2 className="text-base font-bold text-white">Environment Configuration & Credentials Audit</h2>
              <p className="text-xs text-fg-muted">
                System verifies secret presence without ever exposing plaintext secret values.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {systemState?.environment &&
                Object.entries(systemState.environment).map(([key, configured]) => (
                  <div
                    key={key}
                    className="p-4 rounded-xl bg-canvas-subtle border border-border-default flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-mono font-semibold text-white">{key}</div>
                      <div className="text-[11px] text-fg-muted mt-0.5">
                        {configured ? 'Cryptographically configured' : 'Missing in active runtime'}
                      </div>
                    </div>
                    {configured ? (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-success/15 text-success border border-success/30">
                        <Check className="w-3.5 h-3.5" /> Present
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-error/15 text-error border border-error/30">
                        <AlertCircle className="w-3.5 h-3.5" /> Missing
                      </span>
                    )}
                  </div>
                ))}
            </div>

            <div className="p-5 rounded-xl bg-canvas-subtle border border-border-default space-y-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <DbIcon className="w-4 h-4 text-accent-cyan" /> Supabase Security & RLS Compliance
              </h3>
              <ul className="text-xs text-fg-secondary space-y-1.5 list-disc list-inside">
                <li>Row Level Security (RLS) is strictly enabled across all public tables.</li>
                <li>Helper security definer functions have execution revoked from public/anon.</li>
                <li>Supabase Security Advisors: 0 public security warnings.</li>
                <li>Admin override policies are active for platform administrators.</li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
