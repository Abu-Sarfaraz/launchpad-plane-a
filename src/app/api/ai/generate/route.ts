import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateWithFallback } from '@/lib/ai/client';
import { toFriendlyError } from '@/lib/errors/friendlyErrors';

const generateSchema = z.object({
  prompt: z.string().min(1, 'Prompt cannot be empty').max(10000, 'Prompt too long'),
  systemInstruction: z.string().max(2000).optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().min(1).max(8192).optional(),
  forceProvider: z.enum(['gemini', 'openrouter']).optional(),
});

export async function POST(req: NextRequest) {
  try {
    let json: unknown;
    try {
      json = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: 'Malformed Request Payload',
          message: 'The request body could not be parsed as valid JSON. Please check your network payload.',
          friendly: toFriendlyError('Malformed JSON payload', 'Request Parser'),
        },
        { status: 400 }
      );
    }

    const parsed = generateSchema.safeParse(json);

    if (!parsed.success) {
      const issueDetails = parsed.error.issues.map((i) => i.message).join('; ');
      return NextResponse.json(
        {
          success: false,
          error: 'Validation Notice',
          message: `Please check your input requirements: ${issueDetails}`,
          details: parsed.error.format(),
          friendly: {
            title: 'Incomplete Prompt Input',
            friendlyMessage: `Your generation prompt requires attention: ${issueDetails}`,
            actionSuggestion: 'Ensure the prompt contains your desired exam topic and question structure.',
            canRetry: false,
            statusCode: 400,
          },
        },
        { status: 400 }
      );
    }

    const { prompt, systemInstruction, temperature, maxTokens, forceProvider } = parsed.data;

    const result = await generateWithFallback(
      {
        prompt,
        systemInstruction,
        temperature,
        maxTokens,
      },
      { forceProvider }
    );

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: unknown) {
    const friendly = toFriendlyError(error, 'AI Examination Paper Synthesizer');
    return NextResponse.json(
      {
        success: false,
        error: friendly.title,
        message: friendly.friendlyMessage,
        friendly,
      },
      { status: friendly.statusCode || 502 }
    );
  }
}
