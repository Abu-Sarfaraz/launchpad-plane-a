'use client';

import React, { useState } from 'react';
import {
  FileText,
  Download,
  Sparkles,
  Check,
  Copy,
  AlertCircle,
  GraduationCap,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { downloadAsPdf, downloadAsDoc } from '@/lib/export/documents';

export function PaperStudio() {
  const [title, setTitle] = useState('IGCSE Physics: Mechanics and Thermodynamics Mock Examination');
  const [subject, setSubject] = useState('Physics');
  const [syllabus, setSyllabus] = useState('Cambridge CAIE IGCSE (0625)');
  const [difficulty, setDifficulty] = useState('Extended Standard (Grades 9-4)');
  const [prompt, setPrompt] = useState(
    'Create an official 5-question examination paper covering: 1) Velocity-Time graphs, 2) Hooke\'s Law, 3) Specific Heat Capacity, 4) Hydraulic Pressure, 5) Conservation of Energy. Include full questions with sub-parts and a detailed Mark Scheme at the end.'
  );

  const [generating, setGenerating] = useState(false);
  const [generatedPaper, setGeneratedPaper] = useState<string | null>(null);
  const [generationMeta, setGenerationMeta] = useState<{
    provider: string;
    model: string;
    latencyMs: number;
    fallbackUsed: boolean;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setGenerating(true);
    setError(null);

    const fullPrompt = `You are an expert Cambridge/Edexcel exam board author. Generate a complete, formatted exam paper based on the following:
Paper Title: ${title}
Subject: ${subject}
Syllabus: ${syllabus}
Difficulty Tier: ${difficulty}
Requirements: ${prompt}

Format the response cleanly with clear section headings:
# ${title}
## Instructions to Candidates
## Section A: Examination Questions
[List clear numbered questions with mark allocations like [4 marks]]
## Section B: Official Mark Scheme & Answers
[Detailed step-by-step marking guidelines]`;

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Paper generation failed');
      }

      setGeneratedPaper(data.text);
      setGenerationMeta({
        provider: data.provider,
        model: data.model,
        latencyMs: data.latencyMs,
        fallbackUsed: data.fallbackUsed,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to generate examination paper');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!generatedPaper) return;
    downloadAsPdf(title, generatedPaper, {
      subject,
      syllabus,
      date: new Date().toLocaleDateString(),
    });
  };

  const handleDownloadDoc = () => {
    if (!generatedPaper) return;
    downloadAsDoc(title, generatedPaper, {
      subject,
      syllabus,
      date: new Date().toLocaleDateString(),
    });
  };

  const handleCopy = () => {
    if (!generatedPaper) return;
    navigator.clipboard.writeText(generatedPaper);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-canvas-card border border-border-default/90 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-xl space-y-6 mb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-border-default gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
            <span className="text-xs font-mono text-accent-cyan uppercase tracking-wider">
              PaperCraft AI Studio
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <GraduationCap className="w-6 h-6 text-brand-purple" />
            Autonomous Exam & Academic Paper Creator
          </h2>
          <p className="text-xs text-fg-muted mt-1">
            Synthesize official-grade examination papers with mark schemes in under 90 seconds.
          </p>
        </div>

        {/* Global Export Buttons if paper exists */}
        {generatedPaper && (
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              type="button"
              variant="cyan"
              size="sm"
              onClick={handleDownloadPdf}
              className="flex items-center gap-1.5 font-bold shadow-glow-cyan"
            >
              <Download className="w-4 h-4" />
              <span>Download as PDF</span>
            </Button>

            <Button
              type="button"
              variant="glass"
              size="sm"
              onClick={handleDownloadDoc}
              className="flex items-center gap-1.5 text-accent-cyan border-accent-cyan/40 hover:bg-accent-cyan/15 font-bold"
            >
              <FileText className="w-4 h-4 text-accent-cyan" />
              <span>Download as DOC</span>
            </Button>
          </div>
        )}
      </div>

      {/* Generation Config Form */}
      <form onSubmit={handleGenerate} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="paper-subject" className="block text-xs font-semibold text-fg-secondary uppercase tracking-wider mb-1.5">
              Subject
            </label>
            <select
              id="paper-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-canvas-subtle border border-border-default rounded-xl px-3.5 py-2.5 text-sm text-fg-primary focus:outline-none focus:ring-2 focus:ring-accent-cyan/50"
            >
              <option value="Physics">Physics</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Biology">Biology</option>
              <option value="Economics">Economics</option>
            </select>
          </div>

          <div>
            <label htmlFor="paper-syllabus" className="block text-xs font-semibold text-fg-secondary uppercase tracking-wider mb-1.5">
              Curriculum / Syllabus
            </label>
            <select
              id="paper-syllabus"
              value={syllabus}
              onChange={(e) => setSyllabus(e.target.value)}
              className="w-full bg-canvas-subtle border border-border-default rounded-xl px-3.5 py-2.5 text-sm text-fg-primary focus:outline-none focus:ring-2 focus:ring-accent-cyan/50"
            >
              <option value="Cambridge CAIE IGCSE (0625)">Cambridge CAIE IGCSE</option>
              <option value="Cambridge CAIE International A-Level (9702)">Cambridge International A-Level</option>
              <option value="Edexcel International GCSE (4PH1)">Edexcel International GCSE</option>
              <option value="Standard Academic Mock (University/High School)">Standard Academic Mock</option>
            </select>
          </div>

          <div>
            <label htmlFor="paper-difficulty" className="block text-xs font-semibold text-fg-secondary uppercase tracking-wider mb-1.5">
              Difficulty Tier
            </label>
            <select
              id="paper-difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full bg-canvas-subtle border border-border-default rounded-xl px-3.5 py-2.5 text-sm text-fg-primary focus:outline-none focus:ring-2 focus:ring-accent-cyan/50"
            >
              <option value="Foundation Core (Grades 5-1)">Foundation Core (Grades 5-1)</option>
              <option value="Extended Standard (Grades 9-4)">Extended Standard (Grades 9-4)</option>
              <option value="A* Challenger (Advanced Problem Solving)">A* Challenger (Advanced Problem Solving)</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="paper-title" className="block text-xs font-semibold text-fg-secondary uppercase tracking-wider mb-1.5">
            Paper Title
          </label>
          <input
            id="paper-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-canvas-subtle border border-border-default rounded-xl px-3.5 py-2.5 text-sm text-fg-primary focus:outline-none focus:ring-2 focus:ring-accent-cyan/50"
            required
          />
        </div>

        <div>
          <label htmlFor="paper-prompt" className="block text-xs font-semibold text-fg-secondary uppercase tracking-wider mb-1.5">
            Specific Topic Instructions & Mark Scheme Requirements
          </label>
          <textarea
            id="paper-prompt"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-canvas-subtle border border-border-default rounded-xl p-3 text-sm text-fg-primary focus:outline-none focus:ring-2 focus:ring-accent-cyan/50 font-mono"
            required
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            disabled={generating}
            className="flex items-center gap-2 px-6 py-3 font-semibold"
          >
            <Sparkles className="w-4 h-4 text-accent-cyan" />
            <span>{generating ? 'Synthesizing Examination Paper...' : 'Generate Paper with Multi-Provider AI'}</span>
          </Button>
        </div>
      </form>

      {error && (
        <div role="alert" className="p-4 rounded-xl bg-error/10 border border-error/20 flex items-start gap-3 text-xs text-error">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Generated Paper Output Viewport */}
      {generatedPaper && (
        <div className="mt-8 pt-6 border-t border-border-default/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-canvas-subtle p-4 rounded-xl border border-border-default gap-3">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-success" />
              <div>
                <span className="text-xs font-bold text-white">Paper Generated Successfully</span>
                <span className="text-[11px] text-fg-muted ml-2 font-mono">
                  via {generationMeta?.provider.toUpperCase()} ({generationMeta?.latencyMs}ms)
                </span>
              </div>
            </div>

            {/* Crucial Download Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="cyan"
                size="sm"
                onClick={handleDownloadPdf}
                className="flex items-center gap-1.5 font-bold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download as PDF</span>
              </Button>

              <Button
                type="button"
                variant="glass"
                size="sm"
                onClick={handleDownloadDoc}
                className="flex items-center gap-1.5 text-accent-cyan border-accent-cyan/40 hover:bg-accent-cyan/15 font-bold"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Download as DOC</span>
              </Button>

              <button
                type="button"
                onClick={handleCopy}
                aria-label="Copy Paper Content"
                className="p-2 rounded-lg border border-border-default hover:bg-canvas text-fg-secondary hover:text-white transition-colors"
                title="Copy Paper Markdown"
              >
                {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Paper Content Preview Card */}
          <div className="p-6 md:p-8 rounded-xl bg-slate-900/90 border border-border-default/80 font-serif text-slate-100 text-sm leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto shadow-inner">
            {generatedPaper}
          </div>

          {/* Bottom Duplicate Download Trigger Bar */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-fg-muted">
              Ready for high-resolution distribution, printable classroom handouts, and LMS integration.
            </span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="cyan"
                size="sm"
                onClick={handleDownloadPdf}
                className="flex items-center gap-1.5 font-bold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download as PDF</span>
              </Button>

              <Button
                type="button"
                variant="glass"
                size="sm"
                onClick={handleDownloadDoc}
                className="flex items-center gap-1.5 text-accent-cyan border-accent-cyan/40 font-bold"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Download as DOC</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
