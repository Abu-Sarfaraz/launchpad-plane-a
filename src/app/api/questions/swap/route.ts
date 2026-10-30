import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { DEFAULT_FALLBACK_QUESTIONS, swapQuestion } from '@/lib/papercraft/generator';
import { MockPaper, Question } from '@/lib/papercraft/types';
import { toFriendlyError } from '@/lib/errors/friendlyErrors';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { currentQuestionId, currentPaper } = body as {
      currentQuestionId: string;
      currentPaper: MockPaper;
    };

    if (!currentQuestionId || !currentPaper) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing Parameters',
          message: 'Both currentQuestionId and currentPaper must be provided.',
        },
        { status: 400 }
      );
    }

    // Attempt to fetch fresh questions pool from Supabase
    let pool: Question[] = DEFAULT_FALLBACK_QUESTIONS;
    try {
      const supabase = await createClient();
      const { data } = await supabase.from('questions_bank').select('*').limit(100);
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
      // Use fallback
    }

    const swapResult = swapQuestion(currentQuestionId, currentPaper, pool);

    if (!swapResult) {
      return NextResponse.json(
        {
          success: false,
          error: 'Question Not Found',
          message: `Question ${currentQuestionId} not found in the current mock paper.`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      ...swapResult,
    });
  } catch (err: unknown) {
    const friendly = toFriendlyError(err, '1-Click Question Swap Engine');
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
