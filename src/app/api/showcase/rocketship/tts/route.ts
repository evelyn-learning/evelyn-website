import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { checkDailyLimit } from '@/lib/utils/rate-limit';

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 30;
const RATE_WINDOW = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);
  if (rateLimitStore.size > 10_000) rateLimitStore.clear();
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

/**
 * Clean text for natural speech:
 * - Strip markdown formatting
 * - Remove emojis and unicode symbols
 * - Expand common abbreviations
 */
function cleanForSpeech(text: string): string {
  return text
    // Remove markdown
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/[#>_`]/g, '')
    // Remove emojis and unicode symbols (covers most emoji ranges)
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
    .replace(/[\u{2600}-\u{27BF}]/gu, '')
    .replace(/[\u{FE00}-\u{FE0F}]/gu, '')
    .replace(/[\u{200D}]/gu, '')
    // Expand common abbreviations
    .replace(/\bCt\b/g, 'Court')
    .replace(/\bSt\b/g, 'Street')
    .replace(/\bAve\b/g, 'Avenue')
    .replace(/\bDr\b/g, 'Drive')
    .replace(/\bBlvd\b/g, 'Boulevard')
    .replace(/\bRd\b/g, 'Road')
    .replace(/\bLn\b/g, 'Lane')
    .replace(/\bPl\b/g, 'Place')
    .replace(/\bvs\.\b/gi, 'versus')
    .replace(/\betc\.\b/gi, 'etcetera')
    .replace(/\be\.g\.\b/gi, 'for example')
    .replace(/\bi\.e\.\b/gi, 'that is')
    // Clean up whitespace
    .replace(/\n\n+/g, '. ')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';

  if (!checkRateLimit(ip)) {
    return new Response(JSON.stringify({ error: 'Too many requests.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const daily = checkDailyLimit(ip, 'rocketship-tts', 200);
  if (!daily.allowed) {
    return new Response(JSON.stringify({ error: 'Daily limit reached.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return new Response(JSON.stringify({ error: 'Text is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (text.length > 1000) {
      return new Response(JSON.stringify({ error: 'Text too long (max 1000 chars).' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = process.env.OPENAI_SHOWCASE_API_KEY || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'TTS not configured.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const openai = new OpenAI({ apiKey });
    const cleanText = cleanForSpeech(text);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mp3Response = await (openai.audio.speech as any).create({
      model: 'gpt-4o-mini-tts',
      voice: 'coral',
      input: cleanText,
      instructions:
        'You are a warm, enthusiastic elementary school teacher speaking to students in grades 3-4. ' +
        'Speak slowly and clearly, pausing between sentences. ' +
        'Pronounce each word distinctly. Be encouraging and friendly. ' +
        'Read at a pace appropriate for young English Language Learners.',
      speed: 0.85,
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
    console.error('[Rocketship TTS] Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'TTS failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
