import { GenerateRequest, GenerateResponse, AIHealthStatus, ProviderHealth } from './types';

const DEFAULT_TIMEOUT_MS = 15000;

async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

export async function callGemini(
  request: GenerateRequest,
  apiKey: string,
  timeoutMs = DEFAULT_TIMEOUT_MS
): Promise<GenerateResponse> {
  const startTime = Date.now();
  const model = request.model || 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const body: Record<string, unknown> = {
    contents: [
      {
        parts: [{ text: request.prompt }],
      },
    ],
    generationConfig: {
      temperature: request.temperature ?? 0.7,
      maxOutputTokens: request.maxTokens ?? 2048,
    },
  };

  if (request.systemInstruction) {
    body.systemInstruction = {
      parts: [{ text: request.systemInstruction }],
    };
  }

  const response = await fetchWithTimeout(
    url,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
    timeoutMs
  );

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const candidate = data.candidates?.[0];
  const text = candidate?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('Gemini API returned empty response text');
  }

  return {
    text,
    provider: 'gemini',
    model,
    latencyMs: Date.now() - startTime,
    fallbackUsed: false,
    metadata: {
      finishReason: candidate.finishReason,
      usageMetadata: data.usageMetadata,
    },
  };
}

export async function callOpenRouter(
  request: GenerateRequest,
  apiKey: string,
  timeoutMs = DEFAULT_TIMEOUT_MS
): Promise<GenerateResponse> {
  const startTime = Date.now();
  const model = request.model || 'google/gemini-2.5-flash';
  const url = 'https://openrouter.ai/api/v1/chat/completions';

  const messages: Array<{ role: string; content: string }> = [];
  if (request.systemInstruction) {
    messages.push({ role: 'system', content: request.systemInstruction });
  }
  messages.push({ role: 'user', content: request.prompt });

  const response = await fetchWithTimeout(
    url,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://launchpad-plane-a.vercel.app',
        'X-Title': 'LaunchPad AI Studio',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: request.temperature ?? 0.7,
        max_tokens: request.maxTokens ?? 2048,
      }),
    },
    timeoutMs
  );

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`OpenRouter API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const choice = data.choices?.[0];
  const text = choice?.message?.content;

  if (!text) {
    throw new Error('OpenRouter API returned empty response content');
  }

  return {
    text,
    provider: 'openrouter',
    model,
    latencyMs: Date.now() - startTime,
    fallbackUsed: true,
    metadata: {
      finishReason: choice.finish_reason,
      usage: data.usage,
    },
  };
}

export async function generateWithFallback(
  request: GenerateRequest,
  options?: {
    forceProvider?: 'gemini' | 'openrouter';
    timeoutMs?: number;
  }
): Promise<GenerateResponse> {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  // 1. Forced OpenRouter
  if (options?.forceProvider === 'openrouter') {
    if (!openrouterKey) {
      throw new Error('OPENROUTER_API_KEY is not configured in environment variables');
    }
    return callOpenRouter(request, openrouterKey, timeoutMs);
  }

  // 2. Forced Gemini
  if (options?.forceProvider === 'gemini') {
    if (!geminiKey) {
      throw new Error('GEMINI_API_KEY is not configured in environment variables');
    }
    return callGemini(request, geminiKey, timeoutMs);
  }

  let geminiError: Error | null = null;

  // 3. Primary attempt: Google Gemini
  if (geminiKey) {
    try {
      const result = await callGemini(request, geminiKey, timeoutMs);
      return result;
    } catch (err: unknown) {
      geminiError = err instanceof Error ? err : new Error(String(err));
      console.warn(
        `[AI Client] Primary provider (Gemini) failed: ${geminiError.message}. Initiating failover to OpenRouter...`
      );
    }
  } else {
    geminiError = new Error('GEMINI_API_KEY is not set');
  }

  // 4. Secondary fallback: OpenRouter
  if (openrouterKey) {
    try {
      const result = await callOpenRouter(request, openrouterKey, timeoutMs);
      return {
        ...result,
        fallbackUsed: true,
      };
    } catch (openrouterErr: unknown) {
      const openrouterError = openrouterErr instanceof Error ? openrouterErr : new Error(String(openrouterErr));
      throw new Error(
        `Both primary (Gemini) and backup (OpenRouter) providers failed. ` +
        `Gemini: ${geminiError?.message}. OpenRouter: ${openrouterError.message}`
      );
    }
  }

  throw new Error(
    `Primary provider failed (${geminiError?.message}) and backup OPENROUTER_API_KEY is not configured.`
  );
}

export async function checkAIHealth(): Promise<AIHealthStatus> {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openrouterKey = process.env.OPENROUTER_API_KEY;

  let geminiHealth: ProviderHealth = {
    provider: 'gemini',
    status: geminiKey ? 'healthy' : 'unreachable',
    message: geminiKey ? 'Key configured' : 'GEMINI_API_KEY not configured',
  };

  let openrouterHealth: ProviderHealth = {
    provider: 'openrouter',
    status: openrouterKey ? 'healthy' : 'unreachable',
    message: openrouterKey ? 'Key configured' : 'OPENROUTER_API_KEY not configured',
  };

  // Quick probe on Gemini if key exists
  if (geminiKey) {
    const start = Date.now();
    try {
      await callGemini(
        { prompt: 'Reply with the word "OK"', maxTokens: 5 },
        geminiKey,
        5000
      );
      geminiHealth = {
        provider: 'gemini',
        status: 'healthy',
        latencyMs: Date.now() - start,
        message: 'Online and responsive',
      };
    } catch (err: unknown) {
      geminiHealth = {
        provider: 'gemini',
        status: 'degraded',
        latencyMs: Date.now() - start,
        message: err instanceof Error ? err.message : 'Probe failed',
      };
    }
  }

  // Quick probe on OpenRouter if key exists
  if (openrouterKey) {
    const start = Date.now();
    try {
      await callOpenRouter(
        { prompt: 'Reply with the word "OK"', maxTokens: 5 },
        openrouterKey,
        5000
      );
      openrouterHealth = {
        provider: 'openrouter',
        status: 'healthy',
        latencyMs: Date.now() - start,
        message: 'Online and responsive',
      };
    } catch (err: unknown) {
      openrouterHealth = {
        provider: 'openrouter',
        status: 'degraded',
        latencyMs: Date.now() - start,
        message: err instanceof Error ? err.message : 'Probe failed',
      };
    }
  }

  const overallStatus =
    geminiHealth.status === 'healthy'
      ? 'healthy'
      : openrouterHealth.status === 'healthy'
      ? 'degraded'
      : 'unreachable';

  return {
    status: overallStatus,
    activeProvider: geminiHealth.status === 'healthy' ? 'gemini' : 'openrouter',
    gemini: geminiHealth,
    openrouter: openrouterHealth,
    timestamp: new Date().toISOString(),
  };
}
