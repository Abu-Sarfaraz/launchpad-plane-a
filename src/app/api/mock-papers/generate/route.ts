import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import {
  DEFAULT_FALLBACK_QUESTIONS,
  generateMockPaper,
} from '@/lib/papercraft/generator';
import {
  MockPaperGenerationOptions,
  Question,
} from '@/lib/papercraft/types';
import { toFriendlyError } from '@/lib/errors/friendlyErrors';

const generateOptionsSchema = z.object({
  title: z.string().min(1, 'Title is required').default('Mathematics D Mock Examination'),
  subject: z.string().default('Mathematics D'),
  subjectCode: z.string().optional().default('4024'),
  curriculum: z.enum(['CIE_O_LEVEL', 'CIE_A_LEVEL', 'EDEXCEL', 'IB', 'CAIE']).default('CIE_O_LEVEL'),
  targetMarks: z.number().min(5).max(120).default(30),
  durationMinutes: z.number().min(10).max(180).default(60),
  difficultyProfile: z.enum(['CAIE_STANDARD', 'FOUNDATION', 'CHALLENGER', 'CUSTOM']).default('CAIE_STANDARD'),
  selectedTopics: z.array(z.string()).default([]),
  branding: z.object({
    instituteName: z.string().default('THE COACH'),
    subtitle: z.string().default('Tanas Sir - Senior Faculty'),
    logoUrl: z.string().optional(),
    enableCoverPage: z.boolean().default(true),
    enableStudentHeader: z.boolean().default(true),
    candidateInstructions: z.string().optional(),
  }).default({
    instituteName: 'THE COACH',
    subtitle: 'Tanas Sir - Senior Faculty',
    enableCoverPage: true,
    enableStudentHeader: true,
  }),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = generateOptionsSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid Configuration',
          message: parsed.error.issues.map((i) => i.message).join(', '),
        },
        { status: 400 }
      );
    }

    const options: MockPaperGenerationOptions = parsed.data;

    let pool: Question[] = DEFAULT_FALLBACK_QUESTIONS;
    try {
      const supabase = await createClient();
      const { data } = await supabase.from('questions_bank').select('*').limit(150);
      if (data && data.length > 0) {
        pool = data.map((d) => ({
          id: d.id,
          code: d.code,
          curriculum: d.curriculum,
          subject_code: d.subject_code,
          subject_name: d.subject_name,
          topic_category: d.topic_category,
          difficulty_level: d.difficulty_level as Question['difficulty_level'],
          marks: d.marks,
          latex_prompt: d.latex_prompt,
          mark_scheme_latex: d.mark_scheme_latex,
        }));
      }
    } catch {
      // Use fallback pool
    }

    const { paper, stats } = generateMockPaper(options, pool);

    return NextResponse.json({
      success: true,
      paper,
      stats,
    });
  } catch (err: unknown) {
    const friendly = toFriendlyError(err, 'Mock Paper Auto-Generator');
    return NextResponse.json(
      {
        success: false,
        error: friendly.title,
        message: friendly.friendlyMessage,
        friendly,
      },
      { status: 500 }
    );
  }
}
