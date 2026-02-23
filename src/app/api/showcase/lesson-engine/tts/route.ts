import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { checkDailyLimit } from '@/lib/utils/rate-limit';

// ============================================================================
// CONFIGURATION
// ============================================================================
const CONFIG = {
  MODEL: 'tts-1-hd' as const,
  VOICE: 'fable' as const,
  FORMAT: 'mp3' as const,
  RATE_LIMIT_REQUESTS: 30,
  RATE_LIMIT_WINDOW_MS: 60 * 1000,
};

// ============================================================================
// RATE LIMITING
// ============================================================================
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

function checkRateLimit(key: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (rateLimitStore.size > 10000) {
    for (const [k, v] of rateLimitStore.entries()) {
      if (v.resetTime < now) rateLimitStore.delete(k);
    }
  }

  if (!entry || entry.resetTime < now) {
    rateLimitStore.set(key, { count: 1, resetTime: now + CONFIG.RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: CONFIG.RATE_LIMIT_REQUESTS - 1, resetIn: CONFIG.RATE_LIMIT_WINDOW_MS };
  }

  if (entry.count >= CONFIG.RATE_LIMIT_REQUESTS) {
    return { allowed: false, remaining: 0, resetIn: entry.resetTime - now };
  }

  entry.count++;
  return { allowed: true, remaining: CONFIG.RATE_LIMIT_REQUESTS - entry.count, resetIn: entry.resetTime - now };
}

// ============================================================================
// OPENAI CLIENT
// ============================================================================
const openai = new OpenAI({
  apiKey: process.env.OPENAI_SHOWCASE_API_KEY || process.env.OPENAI_API_KEY,
});

// ============================================================================
// API ROUTE HANDLER
// ============================================================================
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
    const rateLimitKey = `lesson_engine_tts:${ip}`;
    const rateLimit = checkRateLimit(rateLimitKey);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment.' },
        { status: 429, headers: { 'Retry-After': Math.ceil(rateLimit.resetIn / 1000).toString() } }
      );
    }

    const daily = checkDailyLimit(ip, 'showcase-media', 20);
    if (!daily.allowed) {
      return NextResponse.json(
        { error: 'Daily usage limit reached. Please try again tomorrow.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((daily.resetsAt - Date.now()) / 1000)) } }
      );
    }

    const body = await request.json();
    const { text } = body as { text: string };

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_SHOWCASE_API_KEY || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'TTS service not configured' }, { status: 500 });
    }

    // Light preprocessing: collapse whitespace
    const cleanText = text.replace(/\s+/g, ' ').trim();

    if (!cleanText) {
      return NextResponse.json({ error: 'Text is empty after processing' }, { status: 400 });
    }

    // Generate speech
    const mp3Response = await openai.audio.speech.create({
      model: CONFIG.MODEL,
      voice: CONFIG.VOICE,
      input: cleanText,
      response_format: CONFIG.FORMAT,
    });

    // Get the audio buffer
    const buffer = Buffer.from(await mp3Response.arrayBuffer());

    return new Response(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error: unknown) {
    console.error('[LESSON_ENGINE_TTS] Error:', error);

    if (error instanceof OpenAI.APIError) {
      if (error.status === 429) {
        return NextResponse.json({ error: 'TTS service is busy. Please wait.' }, { status: 429 });
      }
    }

    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Speech generation failed', details: msg }, { status: 500 });
  }
}
