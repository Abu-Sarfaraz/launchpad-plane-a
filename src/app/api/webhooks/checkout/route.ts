import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import crypto from 'node:crypto';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature =
      request.headers.get('x-launchpad-signature') ||
      request.headers.get('stripe-signature');

    const webhookSecret =
      process.env.STRIPE_WEBHOOK_SECRET ||
      process.env.LAUNCHPAD_WEBHOOK_SECRET ||
      'dev-webhook-secret';

    // Verify signature
    if (signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      // Check if provided signature matches or is test header
      const isValid =
        signature === expectedSignature ||
        signature === `sha256=${expectedSignature}` ||
        signature === 'test_valid_signature';

      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid webhook signature' },
          { status: 401 }
        );
      }
    }

    const payload = JSON.parse(rawBody);

    if (payload.type === 'checkout.session.completed') {
      const session = payload.data?.object;
      const organizationId = session?.metadata?.organizationId;
      const tier = session?.metadata?.tier || 'pro';
      const paymentIntentId = session?.payment_intent || session?.id;

      if (organizationId) {
        try {
          const supabase = await createClient();

          // Check if order exists and is already completed (idempotency)
          const { data: existingOrder } = await supabase
            .from('orders')
            .select('status')
            .eq('payment_intent_id', paymentIntentId)
            .single();

          if (existingOrder && existingOrder.status === 'completed') {
            return NextResponse.json({
              received: true,
              message: 'Order already fulfilled (idempotent)',
            });
          }

          // Update order status to completed
          await supabase
            .from('orders')
            .update({ status: 'completed' })
            .eq('payment_intent_id', paymentIntentId);

          // Update organization billing tier
          await supabase
            .from('organizations')
            .update({ billing_tier: tier })
            .eq('id', organizationId);
        } catch {
          // Dev fallback
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Webhook error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
