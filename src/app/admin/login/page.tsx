'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldAlert, KeyRound, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FriendlyAlert } from '@/components/ui/FriendlyAlert';
import { toFriendlyError, FriendlyError } from '@/lib/errors/friendlyErrors';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/admin';

  const [secretKey, setSecretKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [friendlyError, setFriendlyError] = useState<FriendlyError | null>(null);
  const [success, setSuccess] = useState(false);

  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secretKey.trim()) {
      setFriendlyError({
        title: 'Secret Key Required',
        friendlyMessage: 'Please provide the Admin Secret Key to access platform operations.',
        actionSuggestion: 'Check your ADMIN_SECRET_KEY in .env.local or your Vercel deployment variables.',
        canRetry: false,
      });
      return;
    }

    setLoading(true);
    setFriendlyError(null);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secretKey: secretKey.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFriendlyError({
          title: 'Incorrect Admin Key',
          friendlyMessage: 'The credentials supplied were not recognized by the platform security guard.',
          actionSuggestion: 'Ensure you are passing the exact ADMIN_SECRET_KEY configured in your environment.',
          canRetry: true,
          technicalDetails: data.error || 'HTTP 401 Unauthorized',
          statusCode: res.status,
        });
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(redirectPath);
      }, 600);
    } catch (err: unknown) {
      setFriendlyError(toFriendlyError(err, 'Admin Authentication'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-canvas-card border border-border-default/80 rounded-2xl p-8 backdrop-blur-xl shadow-2xl relative z-10">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-purple/20 to-accent-cyan/20 border border-border-default flex items-center justify-center mb-4 text-accent-cyan shadow-inner">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Platform Administration</h1>
        <p className="text-fg-secondary text-sm mt-2">
          Authenticate to access system operations, multi-provider AI control, and database management.
        </p>
      </div>

      {friendlyError && (
        <div className="mb-6">
          <FriendlyAlert
            error={friendlyError}
            onDismiss={() => setFriendlyError(null)}
          />
        </div>
      )}

      {success && (
        <div
          role="status"
          className="mb-6 p-4 rounded-xl bg-success/10 border border-success/20 flex items-center gap-3 text-sm text-success"
        >
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>Authorized. Entering Control Plane...</span>
        </div>
      )}

      <form onSubmit={handleAdminAuth} className="space-y-5">
        <div>
          <label htmlFor="admin-secret-key" className="block text-xs font-semibold text-fg-secondary uppercase tracking-wider mb-2">
            Admin Secret Key
          </label>
          <div className="relative">
            <KeyRound className="w-5 h-5 text-fg-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="admin-secret-key"
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="Enter ADMIN_SECRET_KEY"
              autoComplete="current-password"
              required
              className="w-full bg-canvas-subtle border border-border-default rounded-xl pl-11 pr-4 py-3 text-sm text-fg-primary placeholder:text-fg-muted focus:outline-none focus:ring-2 focus:ring-accent-cyan/50 focus:border-accent-cyan transition-all"
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          className="w-full py-3 font-medium text-sm mt-2 flex items-center justify-center gap-1.5"
        >
          <span>{loading ? 'Authenticating...' : 'Verify & Enter Admin Console'}</span>
          {!loading && <ArrowRight className="w-4 h-4 ml-1" />}
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-border-default/60 flex items-center justify-between text-xs text-fg-muted">
        <span className="flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-accent-cyan" /> 256-bit Encrypted Session
        </span>
        <a href="/dashboard" className="hover:text-fg-primary transition-colors underline">
          Return to Dashboard
        </a>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-canvas text-fg-primary flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent-cyan/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-brand-purple/10 rounded-full blur-[120px] pointer-events-none" />

      <Suspense fallback={<div className="p-8 text-center text-fg-muted">Loading Admin Gateway...</div>}>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
