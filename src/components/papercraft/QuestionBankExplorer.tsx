'use client';

import React, { useState, useEffect } from 'react';
import { Search, Database, RefreshCw, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { Question } from '@/lib/papercraft/types';
import { MathRenderer } from '@/components/ui/MathRenderer';
import { CORE_TOPICS, DEFAULT_FALLBACK_QUESTIONS } from '@/lib/papercraft/generator';

export function QuestionBankExplorer() {
  const [questions, setQuestions] = useState<Question[]>(DEFAULT_FALLBACK_QUESTIONS);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchQuestions = React.useCallback(async () => {
    setLoading(true);
    try {
      const url = new URL('/api/questions', window.location.origin);
      if (selectedTopic !== 'ALL') url.searchParams.set('topic', selectedTopic);
      if (selectedDifficulty !== 'ALL') url.searchParams.set('difficulty', selectedDifficulty);

      const res = await fetch(url.toString());
      const data = await res.json();
      if (res.ok && data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
      }
    } catch {
      // Use fallback
    } finally {
      setLoading(false);
    }
  }, [selectedTopic, selectedDifficulty]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const filtered = questions.filter((q) => {
    if (!searchTerm) return true;
    const matchCode = q.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchPrompt = q.latex_prompt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTopic = q.topic_category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCode || matchPrompt || matchTopic;
  });

  return (
    <div className="bg-canvas-subtle p-5 rounded-2xl border border-border-default space-y-5">
      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border-default pb-4">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-accent-cyan" />
          <div>
            <h3 className="text-sm font-bold text-white">Relational Question Bank</h3>
            <p className="text-[11px] text-fg-muted font-mono">
              Cambridge CAIE / Edexcel Structured Question Repository ({filtered.length} Items)
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Topic Filter */}
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="bg-canvas border border-border-default rounded-xl px-2.5 py-1.5 text-xs text-fg-primary focus:outline-none focus:ring-1 focus:ring-accent-cyan"
          >
            <option value="ALL">All Chapters</option>
            {CORE_TOPICS.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="bg-canvas border border-border-default rounded-xl px-2.5 py-1.5 text-xs text-fg-primary focus:outline-none focus:ring-1 focus:ring-accent-cyan"
          >
            <option value="ALL">All Difficulties</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-fg-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search code, formula..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-canvas border border-border-default rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-fg-muted focus:outline-none focus:ring-1 focus:ring-accent-cyan w-48"
            />
          </div>

          <button
            type="button"
            onClick={fetchQuestions}
            disabled={loading}
            className="p-2 rounded-xl bg-canvas border border-border-default text-fg-muted hover:text-white"
            title="Refresh Question Bank"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Questions Grid */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
        {filtered.length === 0 ? (
          <div className="text-center py-10 text-xs text-fg-muted font-mono">
            No questions matching your search filters.
          </div>
        ) : (
          filtered.map((q) => {
            const isExpanded = expandedId === q.id;
            return (
              <div
                key={q.id}
                className="p-4 rounded-xl bg-canvas border border-border-default hover:border-accent-cyan/40 transition-colors space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2 border-b border-border-default/50 pb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-accent-cyan">
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

                  <span className="text-xs font-mono font-bold text-slate-200">
                    [{q.marks} {q.marks === 1 ? 'mark' : 'marks'}]
                  </span>
                </div>

                {/* KaTeX Math Equation Render */}
                <div className="text-sm text-slate-100 font-serif leading-relaxed">
                  <MathRenderer content={q.latex_prompt} as="div" />
                </div>

                {/* Mark Scheme Toggle */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : q.id)}
                    className="text-xs font-mono text-fg-muted hover:text-white flex items-center gap-1"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-accent-purple" />
                    <span>{isExpanded ? 'Hide Mark Scheme' : 'View Mark Scheme'}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-3 h-3 ml-0.5" />
                    ) : (
                      <ChevronDown className="w-3 h-3 ml-0.5" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="mt-2 p-3 rounded-lg bg-canvas-subtle border border-border-default text-xs font-mono text-emerald-300 space-y-1 animate-fadeIn">
                      <div className="text-[10px] text-fg-muted uppercase font-bold tracking-wider">
                        Official Marking Guidelines:
                      </div>
                      <MathRenderer content={q.mark_scheme_latex} as="div" />
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
