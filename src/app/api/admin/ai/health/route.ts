import { NextResponse } from 'next/server';
import { checkAIHealth } from '@/lib/ai/client';

export async function GET() {
  try {
    const health = await checkAIHealth();
    return NextResponse.json(health);
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    return NextResponse.json(
      {
        status: 'unreachable',
        error: err.message,
      },
      { status: 500 }
    );
  }
}
