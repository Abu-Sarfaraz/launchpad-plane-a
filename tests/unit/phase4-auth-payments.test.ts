import { describe, it, expect, vi } from 'vitest';
import { GET as authCallbackHandler } from '@/app/auth/callback/route';
import { POST as checkoutSessionHandler } from '@/app/api/checkout/session/route';
import { POST as webhookHandler } from '@/app/api/webhooks/checkout/route';

describe('Phase 4: Auth Redirects and Payments Webhooks', () => {
  describe('Auth Redirect Callback', () => {
    it('redirects to /auth with error parameter when error is passed in query', async () => {
      const request = new Request('http://localhost:3000/auth/callback?error=access_denied');
      const response = await authCallbackHandler(request);

      expect(response.status).toBe(307); // NextResponse.redirect default
      const location = response.headers.get('location');
      expect(location).toContain('/auth?error=access_denied');
    });

    it('redirects to target destination when code exchange succeeds or falls back', async () => {
      const request = new Request('http://localhost:3000/auth/callback?next=/dashboard');
      const response = await authCallbackHandler(request);

      expect(response.status).toBe(307);
      const location = response.headers.get('location');
      expect(location).toContain('/dashboard');
    });
  });

  describe('Checkout Session API', () => {
    it('rejects checkout session request when missing organizationId with 400', async () => {
      const invalidPayload = {
        tier: 'pro',
        billingCycle: 'monthly',
      };

      const request = new Request('http://localhost:3000/api/checkout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidPayload),
      });

      const response = await checkoutSessionHandler(request);
      expect(response.status).toBe(400);
      const json = await response.json();
      expect(json.error).toBe('Invalid checkout parameters');
    });

    it('creates checkout session and calculates correct amount for pro tier', async () => {
      const validPayload = {
        tier: 'pro',
        billingCycle: 'monthly',
        organizationId: '00000000-0000-0000-0000-000000000001',
      };

      const request = new Request('http://localhost:3000/api/checkout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validPayload),
      });

      const response = await checkoutSessionHandler(request);
      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json.sessionId).toBeDefined();
      expect(json.amountCents).toBe(9900); // $99.00
      expect(json.tier).toBe('pro');
    });

    it('calculates 20% discounted annual amount for annual billing cycle', async () => {
      const validPayload = {
        tier: 'pro',
        billingCycle: 'annual',
        organizationId: '00000000-0000-0000-0000-000000000001',
      };

      const request = new Request('http://localhost:3000/api/checkout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validPayload),
      });

      const response = await checkoutSessionHandler(request);
      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json.amountCents).toBe(94800); // $79 * 12 = 948.00
    });
  });

  describe('Payments Webhook Handler', () => {
    it('rejects webhooks with invalid signatures with status 401', async () => {
      const payload = { type: 'checkout.session.completed' };
      const request = new Request('http://localhost:3000/api/webhooks/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-papergen-signature': 'invalid_signature_hash',
        },
        body: JSON.stringify(payload),
      });

      const response = await webhookHandler(request);
      expect(response.status).toBe(401);
      const json = await response.json();
      expect(json.error).toBe('Invalid webhook signature');
    });

    it('processes checkout.session.completed event and returns 200 with received: true', async () => {
      const payload = {
        id: 'evt_test_123',
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test_session_123',
            payment_intent: 'pi_test_intent_123',
            amount_total: 9900,
            currency: 'usd',
            metadata: {
              organizationId: '00000000-0000-0000-0000-000000000001',
              tier: 'pro',
            },
          },
        },
      };

      const request = new Request('http://localhost:3000/api/webhooks/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-papergen-signature': 'test_valid_signature',
        },
        body: JSON.stringify(payload),
      });

      const response = await webhookHandler(request);
      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json.received).toBe(true);
    });
  });
});
