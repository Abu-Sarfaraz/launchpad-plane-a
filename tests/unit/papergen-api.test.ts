import { describe, it, expect, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { GET as getQuestions } from '@/app/api/questions/route';
import { POST as swapQuestionRoute } from '@/app/api/questions/swap/route';
import { POST as generateMockPaperRoute } from '@/app/api/mock-papers/generate/route';
import { DEFAULT_FALLBACK_QUESTIONS } from '@/lib/papergen/generator';
import { MockPaper } from '@/lib/papergen/types';

describe('PaperGen API Endpoints', () => {
  it('GET /api/questions returns questions list with filters', async () => {
    const req = new NextRequest('http://localhost:3000/api/questions?topic=Number%20%26%20Arithmetic');
    const res = await getQuestions(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(Array.isArray(data.questions)).toBe(true);
    expect(data.questions.length).toBeGreaterThan(0);
  });

  it('POST /api/questions/swap rejects missing parameters', async () => {
    const req = new NextRequest('http://localhost:3000/api/questions/swap', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    const res = await swapQuestionRoute(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
  });

  it('POST /api/questions/swap replaces question and syncs mark scheme', async () => {
    const samplePaper: MockPaper = {
      id: 'paper-test-1',
      title: 'Maths Test',
      target_marks: 5,
      duration_minutes: 30,
      difficulty_profile: 'CAIE_STANDARD',
      question_ids: [DEFAULT_FALLBACK_QUESTIONS[0].id, DEFAULT_FALLBACK_QUESTIONS[1].id],
      questions_snapshot: [DEFAULT_FALLBACK_QUESTIONS[0], DEFAULT_FALLBACK_QUESTIONS[1]],
      branding_config: {
        instituteName: 'THE COACH',
        subtitle: 'Faculty',
        enableCoverPage: true,
        enableStudentHeader: true,
      },
    };

    const req = new NextRequest('http://localhost:3000/api/questions/swap', {
      method: 'POST',
      body: JSON.stringify({
        currentQuestionId: DEFAULT_FALLBACK_QUESTIONS[0].id,
        currentPaper: samplePaper,
      }),
    });

    const res = await swapQuestionRoute(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.updatedPaper).toBeDefined();
    expect(data.newQuestion).toBeDefined();
    expect(data.replacedQuestion.id).toBe(DEFAULT_FALLBACK_QUESTIONS[0].id);
  });

  it('POST /api/mock-papers/generate generates balanced mock paper', async () => {
    const req = new NextRequest('http://localhost:3000/api/mock-papers/generate', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Midterm Test',
        targetMarks: 30,
        difficultyProfile: 'CAIE_STANDARD',
        selectedTopics: ['Number & Arithmetic'],
      }),
    });

    const res = await generateMockPaperRoute(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.paper).toBeDefined();
    expect(data.paper.questions_snapshot.length).toBeGreaterThan(0);
  });
});
