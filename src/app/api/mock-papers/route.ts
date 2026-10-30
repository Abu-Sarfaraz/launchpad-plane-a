import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { MockPaper } from '@/lib/papergen/types';
import { toFriendlyError } from '@/lib/errors/friendlyErrors';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({
        success: true,
        papers: [],
        message: 'Guest mode: authenticate to sync papers with Supabase RLS.',
      });
    }

    const { data, error } = await supabase
      .from('mock_papers')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      papers: data || [],
    });
  } catch (err: unknown) {
    const friendly = toFriendlyError(err, 'Mock Papers Database Sync');
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const paper = body as MockPaper;

    if (!paper || !paper.title || !paper.questions_snapshot) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation Error',
          message: 'Mock paper requires a title and question snapshot.',
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // Local/demo fallback
      return NextResponse.json({
        success: true,
        paper: {
          ...paper,
          id: paper.id || `demo-${Date.now()}`,
          created_at: new Date().toISOString(),
        },
        notice: 'Saved in local demo state. Sign in to persist permanently to Supabase PostgreSQL.',
      });
    }

    const insertPayload = {
      user_id: user.id,
      title: paper.title,
      target_marks: paper.target_marks || 30,
      duration_minutes: paper.duration_minutes || 60,
      difficulty_profile: paper.difficulty_profile || 'CAIE_STANDARD',
      question_ids: paper.question_ids as unknown as import('@/types/database.types').Json,
      questions_snapshot: paper.questions_snapshot as unknown as import('@/types/database.types').Json,
      branding_config: paper.branding_config as unknown as import('@/types/database.types').Json,
    };

    const { data, error } = await supabase
      .from('mock_papers')
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      paper: data,
    });
  } catch (err: unknown) {
    const friendly = toFriendlyError(err, 'Mock Paper Archiver');
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
