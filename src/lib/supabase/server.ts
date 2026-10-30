import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database.types';

export async function createClient() {
  let cookieStore: {
    getAll: () => Array<{ name: string; value: string }>;
    set: (name: string, value: string, options?: Record<string, unknown>) => void;
  };

  try {
    const store = await cookies();
    cookieStore = {
      getAll: () => store.getAll(),
      set: (name, value, options) => {
        store.set({ name, value, ...options });
      },
    };
  } catch {
    // When called outside Next.js request context (e.g. in unit tests)
    cookieStore = {
      getAll: () => [],
      set: () => {},
    };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jwuwwgkvjzbzqrezpyko.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key-for-development';

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options as Record<string, unknown>);
          });
        } catch {
          // Ignore if called from a Server Component
        }
      },
    },
  });
}
