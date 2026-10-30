'use client';

import React, { useState } from 'react';
import { AlertCircle, RefreshCw, ChevronDown, ChevronUp, X, Sparkles, HelpCircle } from 'lucide-react';
import { FriendlyError } from '@/lib/errors/friendlyErrors';
import { Button } from './Button';

export interface FriendlyAlertProps {
  error: FriendlyError | string;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
  isRetrying?: boolean;
}

export function FriendlyAlert({
  error,
  onRetry,
  onDismiss,
  className = '',
  isRetrying = false,
}: FriendlyAlertProps) {
  const [showTechnical, setShowTechnical] = useState(false);

  const errorObj: FriendlyError =
    typeof error === 'string'
      ? {
          title: 'Notice',
          friendlyMessage: error,
          actionSuggestion: 'Please verify the details and try again.',
          canRetry: Boolean(onRetry),
        }
      : error;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`rounded-2xl border border-rose-500/30 bg-rose-950/20 backdrop-blur-md p-5 text-text-primary shadow-lg transition-all ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Main Icon & Title */}
        <div className="flex items-start gap-3.5">
          <div className="mt-0.5 rounded-xl bg-rose-500/20 p-2 text-rose-400 border border-rose-500/30 flex-shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>

          <div className="space-y-1.5">
            <h3 className="font-display text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>{errorObj.title}</span>
              {errorObj.statusCode && (
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  HTTP {errorObj.statusCode}
                </span>
              )}
            </h3>

            <p className="text-sm text-text-secondary leading-relaxed">
              {errorObj.friendlyMessage}
            </p>

            {/* Action Suggestion */}
            {errorObj.actionSuggestion && (
              <div className="mt-2.5 flex items-start gap-2 rounded-xl bg-surface-card/60 border border-surface-border p-3 text-xs text-text-primary">
                <HelpCircle className="w-4 h-4 text-accent-cyan flex-shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-semibold text-accent-cyan">Suggested Solution: </span>
                  <span className="text-text-secondary">{errorObj.actionSuggestion}</span>
                </div>
              </div>
            )}

            {/* Action Controls */}
            <div className="mt-3.5 flex flex-wrap items-center gap-3 pt-1">
              {onRetry && errorObj.canRetry && (
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={onRetry}
                  disabled={isRetrying}
                  className="flex items-center gap-2 font-semibold shadow-glow-cyan"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
                  <span>{isRetrying ? 'Retrying Operation...' : 'Try Again'}</span>
                </Button>
              )}

              {errorObj.technicalDetails && (
                <button
                  type="button"
                  onClick={() => setShowTechnical(!showTechnical)}
                  className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors py-1.5 px-2 rounded-lg hover:bg-surface-glass"
                  aria-expanded={showTechnical}
                >
                  <span>{showTechnical ? 'Hide Technical Details' : 'Show Technical Details'}</span>
                  {showTechnical ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>

            {/* Collapsible Technical Details */}
            {showTechnical && errorObj.technicalDetails && (
              <div className="mt-3 rounded-xl bg-midnight-950/90 border border-surface-border p-3.5 font-mono text-[11px] text-text-secondary leading-normal overflow-x-auto max-h-32">
                <div className="flex items-center gap-1.5 text-text-muted text-[10px] uppercase tracking-wider mb-1">
                  <Sparkles className="w-3 h-3 text-brand-purple" />
                  <span>Diagnostic Trace</span>
                </div>
                <pre className="whitespace-pre-wrap break-all">{errorObj.technicalDetails}</pre>
              </div>
            )}
          </div>
        </div>

        {/* Dismiss Button */}
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss alert"
            className="text-text-muted hover:text-white p-1 rounded-lg hover:bg-surface-glass transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
