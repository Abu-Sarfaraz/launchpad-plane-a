import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { DEFAULT_FALLBACK_QUESTIONS } from '@/lib/papercraft/generator';
import { Question } from '@/lib/papercraft/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const topic = searchParams.get('topic');
    const difficulty = searchParams.get('difficulty');
    const curriculum = searchParams.get('curriculum');
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const supabase = await createClient();
    let query = supabase.from('questions_bank').select('*').limit(limit);

    if (topic) query = query.eq('topic_category', topic);
    if (difficulty) query = query.eq('difficulty_level', difficulty);
    if (curriculum) query = query.eq('curriculum', curriculum);

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      // Fallback in case of local dev or empty DB
      let filtered = [...DEFAULT_FALLBACK_QUESTIONS];
      if (topic) filtered = filtered.filter((q) => q.topic_category === topic);
      if (difficulty) filtered = filtered.filter((q) => q.difficulty_level === difficulty);
      if (curriculum) filtered = filtered.filter((q) => q.curriculum === curriculum);
      return NextResponse.json({ success: true, questions: filtered.slice(0, limit), source: 'fallback' });
    }

    const mapped: Question[] = data.map((d) => ({
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
      created_at: d.created_at,
    }));

    return NextResponse.json({ success: true, questions: mapped, source: 'supabase' });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: true,
        questions: DEFAULT_FALLBACK_QUESTIONS,
        source: 'fallback',
        warning: err instanceof Error ? err.message : 'Fallback questions loaded',
      },
      { status: 200 }
    );
  }
}
