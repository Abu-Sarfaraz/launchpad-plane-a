import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { toFriendlyError } from '@/lib/errors/friendlyErrors';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({
        success: true,
        institute: {
          name: 'THE COACH',
          subtitle: 'Tanas Sir - Senior Faculty',
          official_cover_page_enabled: true,
          student_header_enabled: true,
        },
      });
    }

    const { data, error } = await supabase
      .from('institutes')
      .select('*')
      .eq('owner_id', user.id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      institute: data || {
        name: 'THE COACH',
        subtitle: 'Tanas Sir - Senior Faculty',
        official_cover_page_enabled: true,
        student_header_enabled: true,
      },
    });
  } catch (err: unknown) {
    const friendly = toFriendlyError(err, 'Institute Profile Sync');
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
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({
        success: true,
        institute: body,
        notice: 'Updated in local demo state. Sign in to sync across team members.',
      });
    }

    const payload = {
      owner_id: user.id,
      name: body.name || 'THE COACH',
      subtitle: body.subtitle || 'Tanas Sir',
      logo_url: body.logo_url || null,
      official_cover_page_enabled: body.official_cover_page_enabled !== false,
      student_header_enabled: body.student_header_enabled !== false,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('institutes')
      .upsert(payload, { onConflict: 'owner_id' })
      .select()
      .single();

    if (error) {
      // If table doesn't have unique on owner_id, do insert or update
      const { data: inserted, error: insertError } = await supabase
        .from('institutes')
        .insert(payload)
        .select()
        .single();
      if (insertError) throw insertError;
      return NextResponse.json({ success: true, institute: inserted });
    }

    return NextResponse.json({
      success: true,
      institute: data,
    });
  } catch (err: unknown) {
    const friendly = toFriendlyError(err, 'Institutional Branding Settings');
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
