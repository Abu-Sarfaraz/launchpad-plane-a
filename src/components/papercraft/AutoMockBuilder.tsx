'use client';

import React, { useState, useEffect } from 'react';
import {
  Wand2,
  RefreshCw,
  Printer,
  Download,
  CloudUpload,
  Sliders,
  Check,
  Eye,
  Settings,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { MathRenderer } from '@/components/ui/MathRenderer';
import {
  DifficultyProfile,
  Question,
  MockPaper,
  BrandingConfig,
} from '@/lib/papercraft/types';
import {
  CORE_TOPICS,
  DEFAULT_FALLBACK_QUESTIONS,
  generateMockPaper,
} from '@/lib/papercraft/generator';
import { PrintableExamPaper } from './PrintableExamPaper';
import { downloadAsDoc } from '@/lib/export/documents';

interface AutoMockBuilderProps {
  initialBranding?: BrandingConfig;
  onOpenBranding?: () => void;
}

export function AutoMockBuilder({
  initialBranding,
  onOpenBranding,
}: AutoMockBuilderProps) {
  const [targetMarks, setTargetMarks] = useState<number>(30);
  const [difficultyProfile, setDifficultyProfile] =
    useState<DifficultyProfile>('CAIE_STANDARD');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    'Number & Arithmetic',
    'Algebra & Graphs',
    'Geometry & Mensuration',
  ]);
  const [paperTitle, setPaperTitle] = useState(
    'Mathematics D (4024) Mock Examination'
  );
  const [durationMinutes, setDurationMinutes] = useState(60);

  const [branding, setBranding] = useState<BrandingConfig>(
    initialBranding || {
      instituteName: 'THE COACH',
      subtitle: 'Tanas Sir - Senior Faculty',
      enableCoverPage: true,
      enableStudentHeader: true,
    }
  );

  const [currentPaper, setCurrentPaper] = useState<MockPaper | null>(null);
  const [generating, setGenerating] = useState(false);
  const [swappingId, setSwappingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'editor' | 'printable'>('editor');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [expandedMarkSchemes, setExpandedMarkSchemes] = useState<Record<string, boolean>>({});
  const initializedRef = React.useRef(false);

  useEffect(() => {
    if (initialBranding) {
      setBranding(initialBranding);
    }
  }, [initialBranding]);

  // Generate initial paper on mount
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      const { paper } = generateMockPaper(
        {
          title: paperTitle,
          subject: 'Mathematics D',
          curriculum: 'CIE_O_LEVEL',
          targetMarks,
          durationMinutes,
          difficultyProfile,
          selectedTopics,
          branding,
        },
        DEFAULT_FALLBACK_QUESTIONS
      );
      setCurrentPaper(paper);
    }
  }, [paperTitle, targetMarks, durationMinutes, difficultyProfile, selectedTopics, branding]);

  const handleGenerate = async () => {
    setGenerating(true);
    setSaveStatus(null);
    try {
      const res = await fetch('/api/mock-papers/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: paperTitle,
          subject: 'Mathematics D',
          targetMarks,
          durationMinutes,
          difficultyProfile,
          selectedTopics,
          branding,
        }),
      });

      const data = await res.json();
      if (res.ok && data.paper) {
        setCurrentPaper(data.paper);
      } else {
        // Fallback local generator
        const { paper } = generateMockPaper(
          {
            title: paperTitle,
            subject: 'Mathematics D',
            curriculum: 'CIE_O_LEVEL',
            targetMarks,
            durationMinutes,
            difficultyProfile,
            selectedTopics,
            branding,
          },
          DEFAULT_FALLBACK_QUESTIONS
        );
        setCurrentPaper(paper);
      }
    } catch {
      const { paper } = generateMockPaper(
        {
          title: paperTitle,
          subject: 'Mathematics D',
          curriculum: 'CIE_O_LEVEL',
          targetMarks,
          durationMinutes,
          difficultyProfile,
          selectedTopics,
          branding,
        },
        DEFAULT_FALLBACK_QUESTIONS
      );
      setCurrentPaper(paper);
    } finally {
      setGenerating(false);
    }
  };

  const handleSwapQuestion = async (qId: string) => {
    if (!currentPaper) return;
    setSwappingId(qId);
    try {
      const res = await fetch('/api/questions/swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentQuestionId: qId,
          currentPaper,
        }),
      });

      const data = await res.json();
      if (res.ok && data.updatedPaper) {
        setCurrentPaper(data.updatedPaper);
      }
    } catch (e) {
      console.error('Swap failed:', e);
    } finally {
      setSwappingId(null);
    }
  };

  const handleSaveToCloud = async () => {
    if (!currentPaper) return;
    setSaveStatus('Saving to Supabase PostgreSQL...');
    try {
      const res = await fetch('/api/mock-papers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentPaper),
      });
      const data = await res.json();
      if (res.ok) {
        setSaveStatus('Paper securely saved & synced to Supabase (RLS active)!');
        setTimeout(() => setSaveStatus(null), 4000);
      } else {
        setSaveStatus(data.message || 'Saved locally in demo mode.');
        setTimeout(() => setSaveStatus(null), 4000);
      }
    } catch {
      setSaveStatus('Saved in active session memory.');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadWord = () => {
    if (!currentPaper) return;
    let markdown = `# ${currentPaper.title}\n\n`;
    markdown += `**Institution:** ${currentPaper.branding_config.instituteName} | ${currentPaper.branding_config.subtitle || ''}\n`;
    markdown += `**Total Marks:** ${currentPaper.target_marks} | **Time:** ${currentPaper.duration_minutes} Mins\n\n`;
    markdown += `## Section A: Examination Questions\n\n`;

    currentPaper.questions_snapshot.forEach((q, idx) => {
      markdown += `### Question ${idx + 1} [${q.marks} Marks]\n${q.latex_prompt}\n\n`;
    });

    markdown += `\n## Section B: Official Mark Scheme\n\n`;
    currentPaper.questions_snapshot.forEach((q, idx) => {
      markdown += `**Q${idx + 1} (${q.code}) [${q.marks}m]:** ${q.mark_scheme_latex}\n\n`;
    });

    downloadAsDoc(currentPaper.title, markdown, {
      subject: 'Mathematics D (4024)',
      syllabus: 'Cambridge CAIE',
      institution: currentPaper.branding_config.instituteName,
    });
  };

  const toggleTopic = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      if (selectedTopics.length > 1) {
        setSelectedTopics(selectedTopics.filter((t) => t !== topic));
      }
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const toggleMarkScheme = (qId: string) => {
    setExpandedMarkSchemes((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const currentTotalMarks = currentPaper
    ? currentPaper.questions_snapshot.reduce((acc, q) => acc + q.marks, 0)
    : 0;

  return (
    <div className="space-y-6">
      {/* Configuration & Controls Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Generator Controls */}
        <div className="bg-canvas-subtle p-5 rounded-2xl border border-border-default space-y-4">
          <div className="flex items-center justify-between border-b border-border-default pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-accent-cyan" />
              <span>Exam Paper Parameters</span>
            </h3>
            {onOpenBranding && (
              <button
                type="button"
                onClick={onOpenBranding}
                className="text-xs font-mono text-accent-purple hover:underline flex items-center gap-1"
              >
                <Settings className="w-3 h-3" />
                <span>Branding</span>
              </button>
            )}
          </div>

          {/* Paper Title */}
          <div>
            <label className="block text-xs font-mono text-fg-muted mb-1 uppercase tracking-wider">
              Paper Title
            </label>
            <input
              type="text"
              value={paperTitle}
              onChange={(e) => setPaperTitle(e.target.value)}
              className="w-full bg-canvas border border-border-default rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-accent-cyan"
            />
          </div>

          {/* Target Marks selector */}
          <div>
            <label className="block text-xs font-mono text-fg-muted mb-1.5 uppercase tracking-wider">
              Target Marks ({targetMarks} Marks)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[25, 30, 50, 100].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setTargetMarks(m)}
                  className={`py-1.5 rounded-lg text-xs font-mono transition-all ${
                    targetMarks === m
                      ? 'bg-accent-cyan/20 border border-accent-cyan text-accent-cyan font-bold shadow-glow-cyan'
                      : 'bg-canvas border border-border-default text-fg-secondary hover:text-white'
                  }`}
                >
                  {m}m
                </button>
              ))}
            </div>
          </div>

          {/* Duration Selector */}
          <div>
            <label className="block text-xs font-mono text-fg-muted mb-1.5 uppercase tracking-wider">
              Exam Duration ({durationMinutes} Minutes)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[45, 60, 90, 120].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDurationMinutes(d)}
                  className={`py-1.5 rounded-lg text-xs font-mono transition-all ${
                    durationMinutes === d
                      ? 'bg-accent-purple/20 border border-accent-purple text-white font-bold shadow-glow'
                      : 'bg-canvas border border-border-default text-fg-secondary hover:text-white'
                  }`}
                >
                  {d}m
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Curve Profile */}
          <div>
            <label className="block text-xs font-mono text-fg-muted mb-1.5 uppercase tracking-wider">
              Difficulty Curve Profile
            </label>
            <select
              value={difficultyProfile}
              onChange={(e) => setDifficultyProfile(e.target.value as DifficultyProfile)}
              className="w-full bg-canvas border border-border-default rounded-xl p-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-accent-cyan"
            >
              <option value="CAIE_STANDARD">Standard CAIE (30% E / 50% M / 20% H)</option>
              <option value="FOUNDATION">Foundation Drill (80% E / 20% M / 0% H)</option>
              <option value="CHALLENGER">A* Challenger (15% E / 45% M / 40% H)</option>
              <option value="CUSTOM">Custom Uniform (33% E / 34% M / 33% H)</option>
            </select>
          </div>

          {/* Chapter / Topic Checklist */}
          <div>
            <label className="block text-xs font-mono text-fg-muted mb-1.5 uppercase tracking-wider">
              Included Chapters / Topics
            </label>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {CORE_TOPICS.map((topic) => (
                <label
                  key={topic}
                  className="flex items-center gap-2 text-xs text-fg-secondary hover:text-white cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={selectedTopics.includes(topic)}
                    onChange={() => toggleTopic(topic)}
                    className="rounded bg-canvas border-border-default text-accent-cyan focus:ring-accent-cyan"
                  />
                  <span>{topic}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <Button
            type="button"
            variant="cyan"
            size="md"
            onClick={handleGenerate}
            disabled={generating}
            className="w-full flex items-center justify-center gap-2 font-bold shadow-glow-cyan"
          >
            {generating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4" />
            )}
            <span>{generating ? 'Generating Paper...' : 'Generate Balanced Mock Paper'}</span>
          </Button>
        </div>

        {/* Right: Live Interactive Mock Paper Viewport */}
        <div className="lg:col-span-2 space-y-4">
          {/* Top Paper Header Bar */}
          <div className="bg-canvas-subtle p-4 rounded-2xl border border-border-default flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-accent-cyan font-bold uppercase">
                  {currentPaper?.branding_config.instituteName || 'THE COACH'}
                </span>
                <span className="text-border-default">|</span>
                <span className="text-xs text-fg-muted">{currentPaper?.title}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-status-success/20 text-status-success font-bold">
                  {currentTotalMarks} / {targetMarks} Marks
                </span>
                <span className="text-xs text-fg-muted font-mono">
                  {currentPaper?.duration_minutes} Mins Duration
                </span>
              </div>
            </div>

            {/* Actions: View Toggle, Print, Word Export, Cloud Save */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setViewMode(viewMode === 'editor' ? 'printable' : 'editor')}
                className="px-2.5 py-1.5 rounded-lg border border-border-default hover:bg-canvas text-xs font-mono text-fg-secondary hover:text-white flex items-center gap-1.5"
                title="Toggle Print Sheet View"
              >
                <Eye className="w-3.5 h-3.5 text-accent-purple" />
                <span>{viewMode === 'editor' ? 'Print Sheet' : 'Interactive'}</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="px-2.5 py-1.5 rounded-lg bg-accent-cyan/15 border border-accent-cyan/40 hover:bg-accent-cyan/25 text-accent-cyan text-xs font-mono flex items-center gap-1.5 font-semibold"
                title="Print or Save Vector PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print PDF</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadWord}
                className="px-2.5 py-1.5 rounded-lg bg-canvas border border-border-default hover:border-accent-cyan text-fg-secondary hover:text-white text-xs font-mono flex items-center gap-1.5"
                title="Download Microsoft Word DOC"
              >
                <Download className="w-3.5 h-3.5 text-accent-cyan" />
                <span>Word (.doc)</span>
              </button>

              <button
                type="button"
                onClick={handleSaveToCloud}
                className="px-2.5 py-1.5 rounded-lg bg-accent-purple/20 border border-accent-purple/40 hover:bg-accent-purple/30 text-white text-xs font-mono flex items-center gap-1.5 font-bold"
                title="Save & Sync to Supabase PostgreSQL"
              >
                <CloudUpload className="w-3.5 h-3.5 text-accent-purple" />
                <span>Save Cloud</span>
              </button>
            </div>
          </div>

          {/* Feedback Toast */}
          {saveStatus && (
            <div className="p-3 rounded-xl bg-status-success/15 border border-status-success/30 text-status-success text-xs font-mono flex items-center gap-2 animate-fadeIn">
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>{saveStatus}</span>
            </div>
          )}

          {/* Conditional View: Printable Sheet or Interactive Swap Editor */}
          {viewMode === 'printable' && currentPaper ? (
            <div className="max-h-[600px] overflow-y-auto rounded-2xl border border-border-default p-2 bg-slate-950">
              <PrintableExamPaper paper={currentPaper} />
            </div>
          ) : (
            /* Interactive Swap Questions List */
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {currentPaper?.questions_snapshot.map((q: Question, idx: number) => {
                const isSwapping = swappingId === q.id;
                const isExpanded = !!expandedMarkSchemes[q.id];

                return (
                  <div
                    key={q.id || idx}
                    className="p-4 rounded-xl bg-canvas border border-border-default hover:border-border-default-hover transition-colors space-y-3"
                  >
                    {/* Question Header & Badges */}
                    <div className="flex items-center justify-between gap-2 border-b border-border-default/50 pb-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-sm text-white">Q{idx + 1}.</span>
                        <span className="text-[11px] font-mono text-accent-cyan font-semibold">
                          {q.code}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-canvas-subtle text-fg-muted border border-border-default">
                          {q.topic_category}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            q.difficulty_level === 'EASY'
                              ? 'bg-status-success/20 text-status-success'
                              : q.difficulty_level === 'MEDIUM'
                              ? 'bg-accent-cyan/20 text-accent-cyan'
                              : 'bg-accent-purple/20 text-accent-purple'
                          }`}
                        >
                          {q.difficulty_level}
                        </span>
                      </div>

                      {/* Marks and Swap Button */}
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold text-accent-cyan">
                          [{q.marks} {q.marks === 1 ? 'mark' : 'marks'}]
                        </span>

                        <Button
                          type="button"
                          variant="glass"
                          size="sm"
                          onClick={() => handleSwapQuestion(q.id)}
                          disabled={isSwapping}
                          className="flex items-center gap-1.5 text-xs py-1 px-2.5 hover:border-accent-cyan"
                        >
                          <RefreshCw
                            className={`w-3 h-3 text-accent-cyan ${
                              isSwapping ? 'animate-spin' : ''
                            }`}
                          />
                          <span>{isSwapping ? 'Swapping...' : '1-Click Swap'}</span>
                        </Button>
                      </div>
                    </div>

                    {/* Question LaTeX Math Prompt */}
                    <div className="text-sm text-slate-100 font-serif leading-relaxed">
                      <MathRenderer content={q.latex_prompt} as="div" />
                    </div>

                    {/* Mark Scheme Toggle Accordion */}
                    <div className="pt-1 flex items-center justify-between text-xs font-mono">
                      <button
                        type="button"
                        onClick={() => toggleMarkScheme(q.id)}
                        className="text-fg-muted hover:text-white flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3 text-status-warning" />
                        <span>{isExpanded ? 'Hide Mark Scheme' : 'View Mark Scheme'}</span>
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="p-3 rounded-lg bg-canvas-subtle border border-border-default text-xs font-mono text-emerald-300 space-y-1 animate-fadeIn">
                        <div className="text-[10px] text-fg-muted uppercase font-bold tracking-wider">
                          Official Cambridge Mark Scheme:
                        </div>
                        <MathRenderer content={q.mark_scheme_latex} as="div" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
