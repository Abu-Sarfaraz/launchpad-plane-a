'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Rocket, Shield, Lock, Mail, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

function AuthContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const defaultFlow = searchParams.get('flow') === 'signup' ? 'signup' : 'signin';
  const tier = searchParams.get('tier') || 'pro';

  const [mode, setMode] = useState<'signin' | 'signup'>(defaultFlow);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const supabase = createClient();

  const formatAuthError = (msg: string): string => {
    const lower = msg.toLowerCase();
    if (lower.includes('invalid login credentials')) {
      return 'Incorrect email or password. Please verify your credentials or create a new mission account.';
    }
    if (lower.includes('user already registered')) {
      return 'An account with this email address already exists. Please switch to "Sign In" above.';
    }
    if (lower.includes('password') && lower.includes('least 6')) {
      return 'Your password must be at least 6 characters long.';
    }
    if (lower.includes('email not confirmed')) {
      return 'Please check your inbox and verify your email address before signing in.';
    }
    if (lower.includes('rate limit')) {
      return 'Too many login attempts. Please wait a minute before trying again.';
    }
    return msg || 'Authentication could not be completed. Please try again.';
  };

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });

      if (error) {
        setMessage({ type: 'error', text: formatAuthError(error.message) });
      }
    } catch {
      setMessage({ type: 'error', text: `Failed to connect with ${provider}. Please check your connection and retry.` });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!email || !password) {
      setMessage({ type: 'error', text: 'Please provide both email and password.' });
      setLoading(false);
      return;
    }

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              tier,
            },
          },
        });

        if (error) {
          setMessage({ type: 'error', text: formatAuthError(error.message) });
        } else {
          setMessage({
            type: 'success',
            text: 'Account created! Redirecting to your dashboard...',
          });
          setTimeout(() => router.push('/dashboard'), 1500);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setMessage({ type: 'error', text: formatAuthError(error.message) });
        } else {
          setMessage({ type: 'success', text: 'Authenticated! Redirecting...' });
          router.push('/dashboard');
        }
      }
    } catch {
      setMessage({ type: 'error', text: 'An unexpected authentication error occurred. Please check your connection and retry.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden bg-midnight-950">
      {/* Background radial glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-accent-purple/15 blur-[130px] pointer-events-none rounded-full"
        aria-hidden="true"
      />

      {/* Brand Header */}
      <div className="mb-8 text-center relative z-10">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-3 group">
          <div className="w-10 h-10 rounded-control bg-accent-purple/20 border border-accent-purple/40 flex items-center justify-center text-accent-purple shadow-glow group-hover:scale-105 transition-all">
            <Rocket className="w-5 h-5" />
          </div>
          <span className="font-display font-bold text-2xl text-text-primary tracking-tight">
            LaunchPad
          </span>
        </Link>
        <p className="font-sans text-sm text-text-secondary">
          Orbital Cloud Gateway • Plane A Authentication
        </p>
      </div>

      {/* Main Glass Auth Card */}
      <div className="w-full max-w-md glass-panel p-8 relative z-10">
        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 rounded-control bg-midnight-900 border border-surface-border mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setMessage(null);
            }}
            className={`py-2 text-xs font-semibold rounded font-sans transition-all ${
              mode === 'signin'
                ? 'bg-accent-purple text-text-primary shadow-glow'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setMessage(null);
            }}
            className={`py-2 text-xs font-semibold rounded font-sans transition-all ${
              mode === 'signup'
                ? 'bg-accent-purple text-text-primary shadow-glow'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Create Mission
          </button>
        </div>

        {/* Status Message */}
        {message && (
          <div
            className={`p-3 rounded-control mb-6 text-xs flex items-center gap-2 border ${
              message.type === 'success'
                ? 'bg-status-success/15 border-status-success/30 text-status-success'
                : 'bg-status-danger/15 border-status-danger/30 text-status-danger'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Social OAuth Buttons */}
        <div className="space-y-3 mb-6">
          <button
            type="button"
            onClick={() => handleOAuthLogin('google')}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-control bg-surface-glass border border-surface-border hover:border-surface-border-hover text-text-primary text-sm font-sans font-medium transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.2-2 .4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <button
            type="button"
            onClick={() => handleOAuthLogin('github')}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-control bg-surface-glass border border-surface-border hover:border-surface-border-hover text-text-primary text-sm font-sans font-medium transition-all"
          >
            <svg className="w-4 h-4 fill-current text-text-primary" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>Continue with GitHub</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-surface-border" />
          </div>
          <span className="relative px-3 bg-midnight-950 font-mono text-[10px] uppercase text-text-secondary tracking-wider">
            OR USE CREDENTIALS
          </span>
        </div>

        {/* Email / Password Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-text-secondary mb-1.5">
              Mission Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="astronaut@launchpad.space"
                className="w-full pl-9 pr-4 py-2.5 bg-midnight-900 border border-surface-border rounded-control text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent-purple font-sans"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-text-secondary mb-1.5">
              Access Token / Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-4 py-2.5 bg-midnight-900 border border-surface-border rounded-control text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent-purple font-sans"
                required
              />
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-text-secondary hover:text-text-primary">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-surface-border bg-midnight-900 text-accent-purple focus:ring-accent-purple"
              />
              <span className="font-sans">Remember session (30 days)</span>
            </label>

            <a href="#reset" className="text-accent-purple hover:underline font-sans">
              Forgot token?
            </a>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full font-semibold gap-2 mt-2"
          >
            <span>{mode === 'signup' ? 'Create Mission Account' : 'Sign In to Mission'}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        {/* Security Badge */}
        <div className="mt-6 pt-4 border-t border-surface-border flex items-center justify-center gap-2 text-text-secondary text-[11px] font-mono">
          <Shield className="w-3.5 h-3.5 text-status-success" />
          <span>Protected by PostgreSQL Multi-Tenant RLS</span>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-midnight-950" />}>
      <AuthContent />
    </Suspense>
  );
}
