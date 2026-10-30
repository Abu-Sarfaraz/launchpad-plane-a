import { describe, it, expect } from 'vitest';
import {
  generateMockPaper,
  swapQuestion,
  DEFAULT_FALLBACK_QUESTIONS,
  DIFFICULTY_CURVES,
} from '@/lib/papercraft/generator';
import { MockPaperGenerationOptions } from '@/lib/papercraft/types';

describe('PaperCraft Auto Mock Generator & 1-Click Swap Engine', () => {
  const baseOptions: MockPaperGenerationOptions = {
    title: 'Cambridge Mathematics D Mock',
    subject: 'Mathematics D',
    curriculum: 'CIE_O_LEVEL',
    targetMarks: 30,
    durationMinutes: 60,
    difficultyProfile: 'CAIE_STANDARD',
    selectedTopics: ['Number & Arithmetic', 'Algebra & Graphs'],
    branding: {
      instituteName: 'THE COACH',
      subtitle: 'Tanas Sir',
      enableCoverPage: true,
      enableStudentHeader: true,
    },
  };

  it('generates a balanced mock paper matching target marks and topic constraints', () => {
    const { paper, stats } = generateMockPaper(baseOptions, DEFAULT_FALLBACK_QUESTIONS);

    expect(paper.title).toBe('Cambridge Mathematics D Mock');
    expect(paper.questions_snapshot.length).toBeGreaterThan(0);
    expect(stats.totalMarks).toBeGreaterThan(0);
    expect(stats.totalMarks).toBeLessThanOrEqual(30);

    // Verify all selected questions are from the specified topics
    for (const q of paper.questions_snapshot) {
      expect(['Number & Arithmetic', 'Algebra & Graphs']).toContain(q.topic_category);
    }
  });

  it('adheres to the Foundation Drill difficulty curve (EASY heavy)', () => {
    const options: MockPaperGenerationOptions = {
      ...baseOptions,
      difficultyProfile: 'FOUNDATION',
      selectedTopics: [], // All topics
      targetMarks: 20,
    };

    const { paper, stats } = generateMockPaper(options, DEFAULT_FALLBACK_QUESTIONS);

    expect(paper.questions_snapshot.length).toBeGreaterThan(0);
    expect(stats.easyMarks).toBeGreaterThanOrEqual(stats.mediumMarks);
  });

  it('adheres to the A* Challenger difficulty curve (HARD emphasis)', () => {
    const options: MockPaperGenerationOptions = {
      ...baseOptions,
      difficultyProfile: 'CHALLENGER',
      selectedTopics: [],
      targetMarks: 25,
    };

    const { paper, stats } = generateMockPaper(options, DEFAULT_FALLBACK_QUESTIONS);

    expect(paper.questions_snapshot.length).toBeGreaterThan(0);
    expect(stats.hardMarks).toBeGreaterThan(0);
  });

  it('performs 1-Click Question Swap with atomic mark scheme and mark synchronisation', () => {
    const { paper } = generateMockPaper(baseOptions, DEFAULT_FALLBACK_QUESTIONS);
    const initialTotalMarks = paper.questions_snapshot.reduce((acc, q) => acc + q.marks, 0);
    const targetQ = paper.questions_snapshot[0];

    const swapResult = swapQuestion(targetQ.id, paper, DEFAULT_FALLBACK_QUESTIONS);

    expect(swapResult).not.toBeNull();
    if (!swapResult) return;

    const { updatedPaper, replacedQuestion, newQuestion } = swapResult;

    // Must have replaced the specific question
    expect(replacedQuestion.id).toBe(targetQ.id);
    expect(newQuestion.id).not.toBe(targetQ.id);

    // Question snapshot at index 0 must be the new question
    expect(updatedPaper.questions_snapshot[0].id).toBe(newQuestion.id);
    expect(updatedPaper.question_ids[0]).toBe(newQuestion.id);

    // Mark scheme must be synced to new question's mark scheme
    expect(updatedPaper.questions_snapshot[0].mark_scheme_latex).toBe(newQuestion.mark_scheme_latex);

    // Total marks must remain consistent
    const newTotalMarks = updatedPaper.questions_snapshot.reduce((acc, q) => acc + q.marks, 0);
    expect(newTotalMarks).toBe(initialTotalMarks);
  });

  it('returns null if question ID to swap does not exist in paper', () => {
    const { paper } = generateMockPaper(baseOptions, DEFAULT_FALLBACK_QUESTIONS);
    const result = swapQuestion('non-existent-id', paper, DEFAULT_FALLBACK_QUESTIONS);

    expect(result).toBeNull();
  });
});
