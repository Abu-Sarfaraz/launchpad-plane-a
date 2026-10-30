import { describe, it, expect } from 'vitest';
import { toFriendlyError } from '@/lib/errors/friendlyErrors';

describe('Friendly Error Handling & Classification Engine', () => {
  it('translates HTTP 429 / rate limit into user-friendly guidance', () => {
    const error = new Error('Resource has been exhausted (e.g. check quota). HTTP 429');
    const result = toFriendlyError(error);

    expect(result.title).toBe('High Demand & Rate Limit');
    expect(result.friendlyMessage).toContain('heavy traffic');
    expect(result.actionSuggestion).toContain('wait 15–30 seconds');
    expect(result.canRetry).toBe(true);
    expect(result.statusCode).toBe(429);
  });

  it('translates network timeout and AbortError into actionable advice', () => {
    const error = new Error('The operation was aborted due to timeout');
    const result = toFriendlyError(error);

    expect(result.title).toBe('Connection Timed Out');
    expect(result.friendlyMessage).toContain('>15 seconds');
    expect(result.actionSuggestion).toContain('simplifying the prompt');
    expect(result.canRetry).toBe(true);
    expect(result.statusCode).toBe(504);
  });

  it('translates safety and content moderation blocks without retrying', () => {
    const error = new Error('Prompt blocked by HARM_CATEGORY_SAFETY policy');
    const result = toFriendlyError(error);

    expect(result.title).toBe('Content Notice');
    expect(result.friendlyMessage).toContain('safety moderation filter');
    expect(result.actionSuggestion).toContain('neutral academic terminology');
    expect(result.canRetry).toBe(false);
    expect(result.statusCode).toBe(400);
  });

  it('translates unauthorized / missing credentials error', () => {
    const error = new Error('Admin secret key is invalid. 401 Unauthorized');
    const result = toFriendlyError(error);

    expect(result.title).toBe('Authentication Required');
    expect(result.friendlyMessage).toContain('could not be verified');
    expect(result.actionSuggestion).toContain('Admin Secret Key');
    expect(result.canRetry).toBe(true);
    expect(result.statusCode).toBe(401);
  });

  it('translates upstream 502 / bad gateway errors with failover suggestion', () => {
    const error = new Error('Bad Gateway 502: Upstream provider down');
    const result = toFriendlyError(error);

    expect(result.title).toBe('AI Service Temporarily Unavailable');
    expect(result.friendlyMessage).toContain('transient service disruption');
    expect(result.actionSuggestion).toContain('fallback engine');
    expect(result.canRetry).toBe(true);
    expect(result.statusCode).toBe(502);
  });

  it('translates empty response error with prompt refinement advice', () => {
    const error = new Error('Gemini API returned empty response text');
    const result = toFriendlyError(error);

    expect(result.title).toBe('Incomplete Output Received');
    expect(result.friendlyMessage).toContain('blank or partial response');
    expect(result.actionSuggestion).toContain('increasing the question count');
    expect(result.canRetry).toBe(true);
  });

  it('provides a graceful fallback for unclassified exceptions', () => {
    const error = new Error('Something completely unforeseen happened');
    const result = toFriendlyError(error, 'Checkout Flow');

    expect(result.title).toBe('Checkout Flow Encountered an Issue');
    expect(result.friendlyMessage).toContain('unexpected hiccup');
    expect(result.canRetry).toBe(true);
    expect(result.technicalDetails).toContain('unforeseen');
  });
});
