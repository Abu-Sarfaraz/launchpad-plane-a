import { describe, it, expect } from 'vitest';
import {
  generateMockPaper,
  swapQuestion,
  DEFAULT_FALLBACK_QUESTIONS,
  DIFFICULTY_CURVES,
} from '@/lib/papergen/generator';
import { MockPaperGenerationOptions } from '@/lib/papergen/types';

describe('PaperGen Auto Mock Generator & 1-Click Swap Engine', () => {
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

  it('cycles through all available candidates in a pool rather than ping-ponging', () => {
    const customPool = [
      {
        id: 'pool-1',
        code: 'TEST_Q1',
        curriculum: 'CIE_O_LEVEL',
        subject_code: '4024',
        subject_name: 'Mathematics D',
        topic_category: 'Number & Arithmetic',
        difficulty_level: 'EASY' as const,
        marks: 2,
        latex_prompt: '$1+1$',
        mark_scheme_latex: '$2$',
      },
      {
        id: 'pool-2',
        code: 'TEST_Q2',
        curriculum: 'CIE_O_LEVEL',
        subject_code: '4024',
        subject_name: 'Mathematics D',
        topic_category: 'Number & Arithmetic',
        difficulty_level: 'EASY' as const,
        marks: 2,
        latex_prompt: '$2+2$',
        mark_scheme_latex: '$4$',
      },
      {
        id: 'pool-3',
        code: 'TEST_Q3',
        curriculum: 'CIE_O_LEVEL',
        subject_code: '4024',
        subject_name: 'Mathematics D',
        topic_category: 'Number & Arithmetic',
        difficulty_level: 'EASY' as const,
        marks: 2,
        latex_prompt: '$3+3$',
        mark_scheme_latex: '$6$',
      },
    ];

    const initialPaper = {
      id: 'paper-rot',
      title: 'Rotation Test',
      target_marks: 2,
      duration_minutes: 15,
      difficulty_profile: 'CAIE_STANDARD' as const,
      question_ids: ['pool-1'],
      questions_snapshot: [customPool[0]],
      branding_config: baseOptions.branding,
    };

    // Swap 1: pool-1 -> pool-2
    const swap1 = swapQuestion('pool-1', initialPaper, customPool);
    expect(swap1?.newQuestion.id).toBe('pool-2');

    // Swap 2: pool-2 -> pool-3 (previously failed by ping-ponging back to pool-1!)
    const swap2 = swapQuestion('pool-2', swap1!.updatedPaper, customPool);
    expect(swap2?.newQuestion.id).toBe('pool-3');

    // Swap 3: pool-3 -> pool-1 (wraps around circularly)
    const swap3 = swapQuestion('pool-3', swap2!.updatedPaper, customPool);
    expect(swap3?.newQuestion.id).toBe('pool-1');
  });

  it('generates a clean alternative without repeated [Alternative] prefixes when no candidates remain', () => {
    const singlePool = [
      {
        id: 'only-q',
        code: 'ONLY_Q',
        curriculum: 'CIE_O_LEVEL',
        subject_code: '4024',
        subject_name: 'Mathematics D',
        topic_category: 'Number & Arithmetic',
        difficulty_level: 'EASY' as const,
        marks: 5,
        latex_prompt: 'Solve: $x = 5$',
        mark_scheme_latex: '$x = 5$',
      },
    ];

    const paperWithOnlyQ = {
      id: 'paper-single',
      title: 'Single Test',
      target_marks: 5,
      duration_minutes: 15,
      difficulty_profile: 'CAIE_STANDARD' as const,
      question_ids: ['only-q'],
      questions_snapshot: [singlePool[0]],
      branding_config: baseOptions.branding,
    };

    const firstSwap = swapQuestion('only-q', paperWithOnlyQ, singlePool);
    expect(firstSwap?.newQuestion.latex_prompt).toBe('[Alternative] Solve: $x = 5$');

    // On second swap when pool has no alternative questions available
    const secondSwap = swapQuestion(firstSwap!.newQuestion.id, firstSwap!.updatedPaper, []);
    expect(secondSwap?.newQuestion.latex_prompt).toBe('[Alternative] Solve: $x = 5$');
    expect(secondSwap?.newQuestion.latex_prompt).not.toContain('[Alternative] [Alternative]');
  });

  it('returns null if question ID to swap does not exist in paper', () => {
    const { paper } = generateMockPaper(baseOptions, DEFAULT_FALLBACK_QUESTIONS);
    const result = swapQuestion('non-existent-id', paper, DEFAULT_FALLBACK_QUESTIONS);

    expect(result).toBeNull();
  });
});
