'use client';

import React, { useState } from 'react';
import { Building2, Check, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BrandingConfig } from '@/lib/papercraft/types';

interface BrandingSettingsModalProps {
  currentBranding: BrandingConfig;
  onSave: (updated: BrandingConfig) => void;
  onClose?: () => void;
}

export function BrandingSettingsModal({
  currentBranding,
  onSave,
  onClose,
}: BrandingSettingsModalProps) {
  const [instituteName, setInstituteName] = useState(
    currentBranding.instituteName || 'THE COACH'
  );
  const [subtitle, setSubtitle] = useState(
    currentBranding.subtitle || 'Tanas Sir - Senior Faculty'
  );
  const [logoUrl, setLogoUrl] = useState(currentBranding.logoUrl || '');
  const [enableCoverPage, setEnableCoverPage] = useState(
    currentBranding.enableCoverPage !== false
  );
  const [enableStudentHeader, setEnableStudentHeader] = useState(
    currentBranding.enableStudentHeader !== false
  );
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveStatus(null);

    const updated: BrandingConfig = {
      instituteName,
      subtitle,
      logoUrl: logoUrl.trim() || undefined,
      enableCoverPage,
      enableStudentHeader,
    };

    try {
      await fetch('/api/institutes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: instituteName,
          subtitle,
          logo_url: logoUrl || null,
          official_cover_page_enabled: enableCoverPage,
          student_header_enabled: enableStudentHeader,
        }),
      });
      setSaveStatus('Branding preferences synchronized with Supabase!');
      onSave(updated);
      setTimeout(() => {
        setSaveStatus(null);
        if (onClose) onClose();
      }, 1500);
    } catch {
      onSave(updated);
      setSaveStatus('Applied to current studio session!');
      setTimeout(() => {
        setSaveStatus(null);
        if (onClose) onClose();
      }, 1500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-canvas-subtle p-6 rounded-2xl border border-border-default space-y-5 max-w-xl mx-auto">
      <div className="flex items-center justify-between border-b border-border-default pb-3">
        <div className="flex items-center gap-2.5">
          <Building2 className="w-5 h-5 text-accent-purple" />
          <div>
            <h3 className="text-base font-bold text-white">Institutional Branding & Layout</h3>
            <p className="text-xs text-fg-muted font-mono">
              Customise coaching watermark, Cambridge cover page & student headers
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-mono text-fg-muted mb-1 uppercase tracking-wider">
            Coaching / School Name
          </label>
          <input
            type="text"
            value={instituteName}
            onChange={(e) => setInstituteName(e.target.value)}
            className="w-full bg-canvas border border-border-default rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent-purple"
            placeholder="e.g. THE COACH, Cambridge Academy"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-fg-muted mb-1 uppercase tracking-wider">
            Teacher Subtitle / Faculty Details
          </label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full bg-canvas border border-border-default rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent-purple"
            placeholder="e.g. Tanas Sir - Lead Mathematics Instructor"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-fg-muted mb-1 uppercase tracking-wider">
            Emblem / Logo URL (Optional)
          </label>
          <input
            type="url"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            className="w-full bg-canvas border border-border-default rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent-purple"
            placeholder="https://example.com/logo.png"
          />
        </div>

        <div className="pt-2 space-y-3 border-t border-border-default">
          <label className="flex items-center justify-between p-3 rounded-xl bg-canvas border border-border-default cursor-pointer">
            <div>
              <span className="text-xs font-bold text-white block">Official Cambridge Cover Page</span>
              <span className="text-[11px] text-fg-muted block">
                Include instructions to candidates, calculator rules, and total marks banner
              </span>
            </div>
            <input
              type="checkbox"
              checked={enableCoverPage}
              onChange={(e) => setEnableCoverPage(e.target.checked)}
              className="rounded bg-canvas border-border-default text-accent-purple focus:ring-accent-purple h-4 w-4"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-canvas border border-border-default cursor-pointer">
            <div>
              <span className="text-xs font-bold text-white block">Candidate Details Header</span>
              <span className="text-[11px] text-fg-muted block">
                Include Candidate Name, Centre Number, Candidate Number, and Score boxes
              </span>
            </div>
            <input
              type="checkbox"
              checked={enableStudentHeader}
              onChange={(e) => setEnableStudentHeader(e.target.checked)}
              className="rounded bg-canvas border-border-default text-accent-purple focus:ring-accent-purple h-4 w-4"
            />
          </label>
        </div>

        {saveStatus && (
          <div className="p-3 rounded-xl bg-status-success/15 border border-status-success/30 text-status-success text-xs font-mono flex items-center gap-2">
            <Check className="w-4 h-4 flex-shrink-0" />
            <span>{saveStatus}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-mono text-fg-muted hover:text-white"
            >
              Cancel
            </button>
          )}
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={saving}
            className="flex items-center gap-2 font-bold"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
