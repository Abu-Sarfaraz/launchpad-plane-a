import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkAIHealth } from '@/lib/ai/client';

export async function GET(req: NextRequest) {
  // Check authorization (cookie or x-admin-key)
  const adminCookie = req.cookies.get('launchpad-admin-session')?.value;
  const adminHeader = req.headers.get('x-admin-key');
  const serverSecret = process.env.ADMIN_SECRET_KEY || 'launchpad_admin_sec_9941a87b21e843cd';

  const isAuthorized = adminCookie === 'true' || adminHeader === serverSecret;

  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
  }

  try {
    const supabase = await createClient();

    // 1. Database connectivity & counts
    const [orgsRes, profilesRes, ordersRes] = await Promise.all([
      supabase.from('organizations').select('id, billing_tier', { count: 'exact' }),
      supabase.from('profiles').select('id, is_super_admin', { count: 'exact' }),
      supabase.from('orders').select('id, amount_cents, status', { count: 'exact' }),
    ]);

    const totalRevenue =
      ordersRes.data?.reduce((acc, order) => {
        if (order.status === 'completed') {
          return acc + Number(order.amount_cents || 0);
        }
        return acc;
      }, 0) || 0;

    // 2. AI health
    const aiHealth = await checkAIHealth();

    // 3. Environment configuration audit (safe boolean check only)
    const envAudit = {
      NEXT_PUBLIC_SUPABASE_URL: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      NEXT_PUBLIC_SUPABASE_ANON_KEY: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      GEMINI_API_KEY: Boolean(process.env.GEMINI_API_KEY),
      OPENROUTER_API_KEY: Boolean(process.env.OPENROUTER_API_KEY),
      ADMIN_SECRET_KEY: Boolean(process.env.ADMIN_SECRET_KEY),
    };

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      database: {
        status: orgsRes.error ? 'degraded' : 'connected',
        totalOrganizations: orgsRes.count ?? 0,
        totalProfiles: profilesRes.count ?? 0,
        totalOrders: ordersRes.count ?? 0,
        totalRevenueCents: totalRevenue,
      },
      aiHealth,
      environment: envAudit,
      nodeVersion: process.version,
    });
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
