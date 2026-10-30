import { NextResponse } from 'next/server';
import { CheckoutRequestSchema, TIER_PRICING } from '@/lib/payments/types';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const result = CheckoutRequestSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid checkout parameters', details: result.error.errors },
        { status: 400 }
      );
    }

    const { tier, billingCycle, organizationId, userId, successUrl } =
      result.data;

    const pricing = TIER_PRICING[tier];
    const amountCents =
      billingCycle === 'annual' ? pricing.annualCents : pricing.monthlyCents;

    const sessionId = `cs_launchpad_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Try to record pending order in orders table
    try {
      const supabase = await createClient();
      await supabase.from('orders').insert({
        organization_id: organizationId,
        user_id: userId || null,
        amount_cents: amountCents,
        currency: 'usd',
        status: 'pending',
        tier,
        payment_intent_id: sessionId,
      });
    } catch {
      // In local dev without live database credentials, allow session generation to proceed
    }

    const checkoutUrl =
      successUrl ||
      `/dashboard?session_id=${sessionId}&tier=${tier}&status=success`;

    return NextResponse.json({
      sessionId,
      url: checkoutUrl,
      amountCents,
      tier,
      currency: 'usd',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Checkout session error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
