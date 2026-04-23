/**
 * Embedding API Route — used by the voice tutor for topic-shift detection.
 *
 * POST { text: string } → { embedding: number[] }
 *
 * The client maintains a rolling EMA signature of recent student-turn
 * embeddings and checks cosine distance to the latest turn. A large jump
 * triggers a synthetic newPage so the whiteboard starts fresh when the
 * student pivots to a different academic topic even without a keyword
 * like "let's switch to".
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const MODEL = 'text-embedding-3-small';
const MAX_TEXT_LENGTH = 2000;

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Embeddings not configured' }, { status: 500 });
    }

    const body = (await request.json()) as { text?: unknown };
    const text = typeof body.text === 'string' ? body.text.trim() : '';
    if (!text) {
      return NextResponse.json({ error: 'text required' }, { status: 400 });
    }

    // Cap length defensively — a voice-tutor student turn should be well
    // under this. Anything longer is almost certainly transcript garbage
    // and doesn't deserve the tokens.
    const trimmed = text.length > MAX_TEXT_LENGTH ? text.slice(0, MAX_TEXT_LENGTH) : text;

    const openai = new OpenAI({ apiKey });
    const response = await openai.embeddings.create({
      model: MODEL,
      input: trimmed,
    });
    const embedding = response.data[0]?.embedding;
    if (!embedding || !Array.isArray(embedding)) {
      return NextResponse.json({ error: 'No embedding returned' }, { status: 502 });
    }
    return NextResponse.json({ embedding });
  } catch (err) {
    console.error('[embed API] Failed:', err);
    return NextResponse.json({ error: 'Embedding failed' }, { status: 500 });
  }
}
