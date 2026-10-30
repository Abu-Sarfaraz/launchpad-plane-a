export interface GenerateRequest {
  prompt: string;
  systemInstruction?: string;
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

export interface GenerateResponse {
  text: string;
  provider: 'gemini' | 'openrouter';
  model: string;
  latencyMs: number;
  fallbackUsed: boolean;
  metadata?: Record<string, unknown>;
}

export interface ProviderHealth {
  provider: 'gemini' | 'openrouter';
  status: 'healthy' | 'degraded' | 'unreachable';
  latencyMs?: number;
  message?: string;
}

export interface AIHealthStatus {
  status: 'healthy' | 'degraded' | 'unreachable';
  activeProvider: 'gemini' | 'openrouter';
  gemini: ProviderHealth;
  openrouter: ProviderHealth;
  timestamp: string;
}
