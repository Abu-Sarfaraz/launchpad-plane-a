/**
 * Friendly Error Classification & Translation Utility
 * Converts technical stack traces, HTTP status codes, and provider error payloads
 * into actionable, empathetic, human-readable guidance.
 */

export interface FriendlyError {
  title: string;
  friendlyMessage: string;
  actionSuggestion: string;
  canRetry: boolean;
  technicalDetails?: string;
  statusCode?: number;
}

export function toFriendlyError(error: unknown, fallbackContext = 'Operation'): FriendlyError {
  const rawMessage =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
      ? error
      : JSON.stringify(error) || '';

  const lower = rawMessage.toLowerCase();

  // 1. Rate Limiting / Quota Exhaustion (HTTP 429)
  if (
    lower.includes('429') ||
    lower.includes('rate limit') ||
    lower.includes('resource_exhausted') ||
    lower.includes('quota') ||
    lower.includes('too many requests')
  ) {
    return {
      title: 'High Demand & Rate Limit',
      friendlyMessage:
        'Our AI processing engines are currently handling heavy traffic and reached a temporary quota limit.',
      actionSuggestion:
        'Please wait 15–30 seconds and click "Retry". The system will automatically attempt failover to backup providers.',
      canRetry: true,
      technicalDetails: rawMessage,
      statusCode: 429,
    };
  }

  // 2. Network Timeout / Abort / Fetch Failed
  if (
    lower.includes('timeout') ||
    lower.includes('aborterror') ||
    lower.includes('fetch failed') ||
    lower.includes('network') ||
    lower.includes('econnrefused') ||
    lower.includes('etimedout')
  ) {
    return {
      title: 'Connection Timed Out',
      friendlyMessage:
        'The request took longer than expected (>15 seconds) to reach our cloud processing nodes.',
      actionSuggestion:
        'Check your internet connection and try clicking "Retry". For complex exam papers, simplifying the prompt instructions often helps.',
      canRetry: true,
      technicalDetails: rawMessage,
      statusCode: 504,
    };
  }

  // 3. Safety / Content Guidelines / Blocked Prompt
  if (
    lower.includes('safety') ||
    lower.includes('harm_category') ||
    lower.includes('blocked') ||
    lower.includes('content filter')
  ) {
    return {
      title: 'Content Notice',
      friendlyMessage:
        'The prompt contains terms flagged by the AI safety moderation filter.',
      actionSuggestion:
        'Please adjust the wording in your question instructions using neutral academic terminology.',
      canRetry: false,
      technicalDetails: rawMessage,
      statusCode: 400,
    };
  }

  // 4. Authentication / Authorization (401 / 403)
  if (
    lower.includes('401') ||
    lower.includes('403') ||
    lower.includes('unauthorized') ||
    lower.includes('invalid api key') ||
    lower.includes('forbidden') ||
    lower.includes('admin secret key')
  ) {
    return {
      title: 'Authentication Required',
      friendlyMessage:
        'Your access credentials could not be verified for this requested resource.',
      actionSuggestion:
        'Please verify your Admin Secret Key or check that API keys are configured in your Vercel/environment dashboard.',
      canRetry: true,
      technicalDetails: rawMessage,
      statusCode: 401,
    };
  }

  // 5. Upstream Service Unavailable (500, 502, 503)
  if (
    lower.includes('500') ||
    lower.includes('502') ||
    lower.includes('503') ||
    lower.includes('bad gateway') ||
    lower.includes('server error') ||
    lower.includes('service unavailable')
  ) {
    return {
      title: 'AI Service Temporarily Unavailable',
      friendlyMessage:
        'An upstream AI provider is experiencing a transient service disruption.',
      actionSuggestion:
        'Click "Retry" to dispatch the generation request through our automatic standby fallback engine.',
      canRetry: true,
      technicalDetails: rawMessage,
      statusCode: 502,
    };
  }

  // 6. Empty or Incomplete Response
  if (lower.includes('empty response') || lower.includes('no content') || lower.includes('empty text')) {
    return {
      title: 'Incomplete Output Received',
      friendlyMessage:
        'The AI service generated a blank or partial response.',
      actionSuggestion:
        'Try specifying a few extra topic bullet points or increasing the question count in your prompt.',
      canRetry: true,
      technicalDetails: rawMessage,
      statusCode: 204,
    };
  }

  // 7. Client-side Document Export Errors
  if (lower.includes('export') || lower.includes('pdf') || lower.includes('doc')) {
    return {
      title: 'Export Preparation Notice',
      friendlyMessage:
        'Unable to construct the requested download document.',
      actionSuggestion:
        'Ensure file downloads and popups are permitted in your browser, or copy the generated text directly to your clipboard.',
      canRetry: true,
      technicalDetails: rawMessage,
      statusCode: 422,
    };
  }

  // 8. General Graceful Fallback
  return {
    title: `${fallbackContext} Encountered an Issue`,
    friendlyMessage:
      'We ran into an unexpected hiccup while processing your request. No data was lost.',
    actionSuggestion:
      'Please click "Retry" or refresh the page. If the issue continues, contact platform support.',
    canRetry: true,
    technicalDetails: rawMessage || 'No technical error message provided.',
    statusCode: 500,
  };
}
