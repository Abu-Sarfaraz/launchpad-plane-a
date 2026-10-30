import { z } from 'zod';

export const CheckoutRequestSchema = z.object({
  tier: z.enum(['starter', 'pro', 'enterprise']),
  billingCycle: z.enum(['monthly', 'annual']).default('monthly'),
  organizationId: z.string().uuid(),
  userId: z.string().uuid().optional(),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

export type CheckoutRequest = z.infer<typeof CheckoutRequestSchema>;

export const TIER_PRICING: Record<
  'starter' | 'pro' | 'enterprise',
  { monthlyCents: number; annualCents: number }
> = {
  starter: {
    monthlyCents: 2900,
    annualCents: 28800, // $24/mo * 12
  },
  pro: {
    monthlyCents: 9900,
    annualCents: 94800, // $79/mo * 12
  },
  enterprise: {
    monthlyCents: 29900,
    annualCents: 298800, // $249/mo * 12
  },
};

export interface WebhookEventPayload {
  id: string;
  type: string;
  data: {
    object: {
      id: string;
      customer?: string;
      payment_intent?: string;
      amount_total?: number;
      currency?: string;
      metadata?: {
        organizationId?: string;
        userId?: string;
        tier?: string;
      };
    };
  };
}
