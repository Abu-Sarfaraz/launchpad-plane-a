import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateWithFallback } from '@/lib/ai/client';

const generateSchema = z.object({
  prompt: z.string().min(1, 'Prompt cannot be empty').max(10000, 'Prompt too long'),
  systemInstruction: z.string().max(2000).optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().min(1).max(8192).optional(),
  forceProvider: z.enum(['gemini', 'openrouter']).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = generateSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid generation request', details: parsed.error.format() },
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
    const err = error instanceof Error ? error : new Error(String(error));
    return NextResponse.json(
      {
        error: 'AI generation failed',
        message: err.message,
      },
      { status: 502 }
    );
  }
}
