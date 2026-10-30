'use client';

import React from 'react';
import { MockPaper, Question } from '@/lib/papergen/types';
import { MathRenderer } from '@/components/ui/MathRenderer';

interface PrintableExamPaperProps {
  paper: MockPaper;
  showMarkScheme?: boolean;
}

export function PrintableExamPaper({
  paper,
  showMarkScheme = true,
}: PrintableExamPaperProps) {
  const { branding_config, questions_snapshot, title, target_marks, duration_minutes } = paper;
  const watermark = branding_config.watermarkText || branding_config.instituteName;

  return (
    <div
      id="printable-exam-paper"
      className="relative bg-white text-slate-900 font-serif p-6 md:p-10 rounded-xl shadow-2xl border border-slate-200 print:p-0 print:border-none print:shadow-none print:m-0 text-sm max-w-4xl mx-auto overflow-hidden"
    >
      {/* Background Watermark in Print & Preview */}
      {watermark && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.035] print:opacity-[0.05] select-none text-slate-900 font-extrabold text-6xl md:text-8xl uppercase rotate-[-30deg] z-0 overflow-hidden"
        >
          {watermark}
        </div>
      )}

      {/* Official Cambridge Cover Page */}
      {branding_config.enableCoverPage && (
        <div className="relative z-10 border-4 border-slate-900 p-8 rounded-lg mb-8 text-center space-y-6 print-page-break">
          {/* Institution Header with Optional Logo */}
          <div className="border-b-2 border-slate-900 pb-4">
            {branding_config.logoUrl && (
              <div className="mb-3 flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={branding_config.logoUrl}
                  alt={branding_config.instituteName || 'Institution Logo'}
                  className="h-16 max-w-xs object-contain"
                />
              </div>
            )}
            <h1 className="text-2xl font-bold tracking-wider uppercase font-sans">
              {branding_config.instituteName || 'THE COACH'}
            </h1>
            {branding_config.subtitle && (
              <p className="text-sm text-slate-600 font-sans tracking-wide mt-1">
                {branding_config.subtitle}
              </p>
            )}
          </div>

          <div className="space-y-2 py-4">
            <h2 className="text-xl font-bold uppercase">{title}</h2>
            <div className="flex justify-center items-center gap-6 font-mono text-xs text-slate-700">
              <span>Syllabus: Cambridge CAIE (4024)</span>
              <span>Time: {duration_minutes} Minutes</span>
              <span className="font-bold text-slate-900">Total Marks: {target_marks}</span>
            </div>
          </div>

          {/* Student Fill-in Header */}
          {branding_config.enableStudentHeader && (
            <div className="border-2 border-slate-800 p-4 rounded text-left space-y-3 font-sans text-xs bg-slate-50 print:bg-white">
              <div className="grid grid-cols-2 gap-4">
                <div className="border-b border-dotted border-slate-700 pb-1">
                  <span className="font-semibold">Candidate Name: </span>
                </div>
                <div className="border-b border-dotted border-slate-700 pb-1">
                  <span className="font-semibold">Date: </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="border-b border-dotted border-slate-700 pb-1">
                  <span className="font-semibold">Centre Number: </span>
                </div>
                <div className="border-b border-dotted border-slate-700 pb-1">
                  <span className="font-semibold">Candidate Number: </span>
                </div>
                <div className="border-b border-dotted border-slate-700 pb-1">
                  <span className="font-semibold">Score: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; / {target_marks}</span>
                </div>
              </div>
            </div>
          )}

          {/* Instructions to Candidates */}
          <div className="text-left text-xs space-y-1.5 pt-4 text-slate-700">
            <h3 className="font-bold text-slate-900 uppercase font-sans">READ THESE INSTRUCTIONS FIRST</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Write your name, centre number, and candidate number in the boxes at the top of the page.</li>
              <li>Answer all questions. Write your answers in the spaces provided below each question.</li>
              <li>Calculators should be used where appropriate. Non-exact numerical answers should be correct to 3 significant figures.</li>
              <li>The number of marks is given in brackets [ ] at the end of each question or part question.</li>
              <li>The total number of marks for this paper is {target_marks}.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Main Examination Questions: Section A */}
      <div className="relative z-10 space-y-8">
        <div className="border-b-2 border-slate-900 pb-2 mb-4 flex justify-between items-end">
          <div>
            <h2 className="text-lg font-bold uppercase font-sans tracking-tight">Section A: Examination Questions</h2>
            <p className="text-xs text-slate-600 font-sans">Answer all questions in the spaces provided.</p>
          </div>
          <span className="font-mono text-xs font-semibold text-slate-800">
            [{target_marks} Marks Total]
          </span>
        </div>

        {questions_snapshot.map((q: Question, idx: number) => {
          const answerAreaHeight = Math.max(65, q.marks * 26);
          return (
            <div
              key={q.id || idx}
              className="print-avoid-break pb-6 border-b border-slate-200 last:border-b-0 space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-2 text-base leading-relaxed">
                  <span className="font-bold font-sans text-slate-900">{idx + 1}.</span>
                  <div className="text-slate-900 font-serif">
                    <MathRenderer content={q.latex_prompt} as="div" />
                  </div>
                </div>
                <span className="font-bold font-sans text-slate-800 text-xs shrink-0 whitespace-nowrap">
                  [{q.marks} {q.marks === 1 ? 'mark' : 'marks'}]
                </span>
              </div>

              {/* Mark-proportional Answer Writing Space */}
              <div
                style={{ minHeight: `${answerAreaHeight}px` }}
                className="mt-4 pt-2 border-t border-dashed border-slate-300 flex flex-col justify-end"
              >
                <div className="text-right text-xs font-mono text-slate-500">
                  Answer: ..............................................................
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Section B: Official Mark Scheme & Answers */}
      {showMarkScheme && (
        <div className="relative z-10 print-page-break mt-12 pt-8 border-t-4 border-slate-900 space-y-6">
          <div className="border-b-2 border-slate-900 pb-2">
            <h2 className="text-lg font-bold uppercase font-sans tracking-tight text-slate-900">
              Section B: Official Mark Scheme & Marking Criteria
            </h2>
            <p className="text-xs text-slate-600 font-sans">
              Strictly for teachers, examiners, and candidates&apos; post-exam review.
            </p>
          </div>

          <div className="space-y-4">
            {questions_snapshot.map((q: Question, idx: number) => (
              <div
                key={`ms-${q.id || idx}`}
                className="print-avoid-break p-3.5 rounded bg-slate-50 print:bg-white border border-slate-200 text-xs space-y-1.5"
              >
                <div className="flex justify-between items-center font-sans font-semibold text-slate-800">
                  <span>Question {idx + 1} ({q.code})</span>
                  <span className="font-mono text-emerald-700">[{q.marks} Marks]</span>
                </div>
                <div className="text-slate-700 font-serif">
                  <MathRenderer content={q.mark_scheme_latex} as="div" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
