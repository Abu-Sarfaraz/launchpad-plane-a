import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jwuwwgkvjzbzqrezpyko.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key-for-development';

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // Protected routes check
  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith('/dashboard')) {
    // Check if session exists in cookie or supabase auth
    const authCookie =
      request.cookies.get('sb-access-token') ||
      request.cookies.get('launchpad-session') ||
      request.cookies.get(`sb-${process.env.SUPABASE_PROJECT_REF || 'default'}-auth-token`);

    // In dev mode without live credentials, permit pass-through if local bypass is enabled
    const isDevMock = process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!authCookie && !isDevMock) {
      // In production or when unauthenticated, redirect to /auth
      const { data: { user } } = await supabase.auth.getUser();
      if (!user && !isDevMock) {
        const url = request.nextUrl.clone();
        url.pathname = '/auth';
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
