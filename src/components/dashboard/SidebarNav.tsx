'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Rocket,
  LayoutDashboard,
  FolderGit2,
  Activity,
  Terminal,
  CreditCard,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

interface SidebarNavProps {
  userEmail?: string;
  orgName?: string;
}

export function SidebarNav({
  userEmail = 'astronaut@launchpad.space',
  orgName = 'AetherSpace Org',
}: SidebarNavProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: 'Mission Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Cloud Projects', href: '/dashboard/projects', icon: FolderGit2 },
    { name: 'Telemetry Stream', href: '/dashboard/telemetry', icon: Activity },
    { name: 'Deployment Logs', href: '/dashboard/deployments', icon: Terminal },
    { name: 'Billing & Plan', href: '/dashboard/billing', icon: CreditCard },
    { name: 'Security & RLS', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <aside
      className={`transition-all duration-300 ease-in-out border-r border-surface-border bg-midnight-950/95 backdrop-blur-glass flex flex-col justify-between shrink-0 h-screen sticky top-0 z-40 ${
        collapsed ? 'w-20' : 'w-[260px]'
      }`}
    >
      <div>
        {/* Top Header */}
        <div className="h-16 border-b border-surface-border flex items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-control bg-accent-purple/20 border border-accent-purple/40 flex items-center justify-center text-accent-purple shrink-0 shadow-glow">
              <Rocket className="w-5 h-5" />
            </div>
            {!collapsed && (
              <div className="flex flex-col truncate">
                <span className="font-display font-bold text-sm text-text-primary tracking-tight truncate">
                  LaunchPad
                </span>
                <span className="font-mono text-[9px] text-accent-cyan tracking-widest truncate">
                  TELEMETRY HUB
                </span>
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            className="w-7 h-7 rounded-control bg-surface-glass border border-surface-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-surface-border-hover transition-colors shrink-0"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Organization Badge */}
        {!collapsed && (
          <div className="p-4 mx-3 my-3 rounded-control bg-surface-glass border border-surface-border">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-status-success animate-ping" />
              <span className="font-mono text-[10px] text-accent-cyan tracking-wider uppercase">
                ACTIVE CLUSTER
              </span>
            </div>
            <div className="font-display text-sm font-semibold text-text-primary truncate">
              {orgName}
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-control font-sans text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-accent-purple text-text-primary shadow-glow font-semibold'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-glass/60'
                }`}
                title={collapsed ? item.name : undefined}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile and Sign Out */}
      <div className="p-3 border-t border-surface-border">
        <div
          className={`flex items-center gap-3 p-2 rounded-control bg-midnight-900/60 border border-surface-border ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-accent-purple/30 border border-accent-purple/50 flex items-center justify-center text-accent-purple font-mono text-xs font-bold shrink-0">
            {userEmail.charAt(0).toUpperCase()}
          </div>
          {!collapsed && (
            <div className="flex flex-col truncate min-w-0 flex-1">
              <span className="font-sans text-xs text-text-primary font-medium truncate">
                {userEmail}
              </span>
              <span className="font-mono text-[10px] text-status-success flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified</span>
              </span>
            </div>
          )}
          {!collapsed && (
            <Link
              href="/auth"
              className="p-1.5 text-text-secondary hover:text-status-danger transition-colors shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
