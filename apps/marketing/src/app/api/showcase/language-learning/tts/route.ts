/**
 * Language Learning TTS API Route
 *
 * Uses OpenAI TTS to generate speech in multiple languages.
 * Supports: Spanish, French, German, Japanese, Mandarin.
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_SHOWCASE_API_KEY || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'TTS not configured' }, { status: 500 });
    }

    const { text, speed = 1.0 } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Limit text length to prevent abuse
    if (text.length > 2000) {
      return NextResponse.json({ error: 'Text too long (max 2000 chars)' }, { status: 400 });
    }

    const openai = new OpenAI({ apiKey });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mp3Response = await (openai.audio.speech as any).create({
      model: 'gpt-4o-mini-tts',
      voice: 'alloy',
      input: text,
      instructions: 'Speak as a patient, encouraging language teacher. Pronounce each word clearly and naturally. For single words or short phrases, say them warmly and distinctly.',
      speed: Math.max(0.5, Math.min(2.0, speed)),
      response_format: 'mp3',
    });

    const arrayBuffer = await mp3Response.arrayBuffer();

    return new Response(arrayBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('[Language TTS] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'TTS failed' },
      { status: 500 }
    );
  }
}
