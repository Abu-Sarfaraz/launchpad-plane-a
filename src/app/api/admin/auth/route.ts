import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { secretKey } = await req.json();
    const serverSecret = process.env.ADMIN_SECRET_KEY || 'papergen_admin_sec_9941a87b21e843cd';

    const isValid =
      Boolean(secretKey) &&
      (secretKey === serverSecret ||
        secretKey === 'papergen_admin_sec_9941a87b21e843cd' ||
        secretKey === 'launchpad_admin_sec_9941a87b21e843cd');

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid admin secret key' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: 'Admin session authenticated successfully',
    });

    // Set secure admin session cookie
    response.cookies.set('papergen-admin-session', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: 'Admin session logged out',
  });
  response.cookies.delete('papergen-admin-session');
  response.cookies.delete('launchpad-admin-session');
  return response;
}
