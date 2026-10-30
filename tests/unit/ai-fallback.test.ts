import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateWithFallback, callGemini, callOpenRouter } from '@/lib/ai/client';

describe('Multi-Provider AI Fallback Engine', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = {
      ...originalEnv,
      GEMINI_API_KEY: 'test-gemini-key',
      OPENROUTER_API_KEY: 'test-openrouter-key',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it('calls primary Gemini provider and returns success when Gemini is online', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        candidates: [
          {
            content: { parts: [{ text: 'Response from Gemini Primary' }] },
            finishReason: 'STOP',
          },
        ],
        usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 15 },
      }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const result = await generateWithFallback({ prompt: 'Hello Gemini' });

    expect(result.text).toBe('Response from Gemini Primary');
    expect(result.provider).toBe('gemini');
    expect(result.fallbackUsed).toBe(false);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch.mock.calls[0][0]).toContain('generativelanguage.googleapis.com');
  });

  it('fails over to OpenRouter when Gemini API fails with 429 or network error', async () => {
    const mockFetch = vi
      .fn()
      // First call (Gemini) fails with 429 rate limit
      .mockResolvedValueOnce({
        ok: false,
        status: 429,
        text: async () => 'Resource has been exhausted (rate limit)',
      })
      // Second call (OpenRouter) succeeds
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [
            {
              message: { content: 'Response from OpenRouter Standby' },
              finish_reason: 'stop',
            },
          ],
          usage: { total_tokens: 35 },
        }),
      });
    vi.stubGlobal('fetch', mockFetch);

    const result = await generateWithFallback({ prompt: 'Test fallback' });

    expect(result.text).toBe('Response from OpenRouter Standby');
    expect(result.provider).toBe('openrouter');
    expect(result.fallbackUsed).toBe(true);
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(mockFetch.mock.calls[0][0]).toContain('generativelanguage.googleapis.com');
    expect(mockFetch.mock.calls[1][0]).toContain('openrouter.ai/api/v1');
  });

  it('honors forceProvider: "openrouter" directly without calling Gemini', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: { content: 'Direct OpenRouter Output' },
            finish_reason: 'stop',
          },
        ],
      }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const result = await generateWithFallback(
      { prompt: 'Forced provider' },
      { forceProvider: 'openrouter' }
    );

    expect(result.provider).toBe('openrouter');
    expect(result.text).toBe('Direct OpenRouter Output');
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch.mock.calls[0][0]).toContain('openrouter.ai/api/v1');
  });

  it('throws descriptive error when both providers fail', async () => {
    const mockFetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => 'Gemini Internal Error',
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 503,
        text: async () => 'OpenRouter Service Unavailable',
      });
    vi.stubGlobal('fetch', mockFetch);

    await expect(
      generateWithFallback({ prompt: 'Test total failure' })
    ).rejects.toThrow(/Both primary \(Gemini\) and backup \(OpenRouter\) providers failed/);
  });
});
