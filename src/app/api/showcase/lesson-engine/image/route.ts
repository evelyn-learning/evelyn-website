import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// ============================================================================
// CONFIGURATION
// ============================================================================
const CONFIG = {
  MODEL: 'dall-e-3' as const,
  SIZE: '1024x1024' as const,
  QUALITY: 'standard' as const,
  RATE_LIMIT_REQUESTS: 10,
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
    const rateLimitKey = `lesson_engine_image:${ip}`;
    const rateLimit = checkRateLimit(rateLimitKey);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many image requests. Please wait.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { prompt, gradeLevel } = body as { prompt: string; gradeLevel?: string };

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Image prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_SHOWCASE_API_KEY || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Image service not configured' }, { status: 500 });
    }

    // Build a child-friendly, educational image prompt
    // Strip numbers/fractions/quantities but keep descriptive scene elements
    const cleanedPrompt = prompt
      .replace(/\d+\/\d+/g, '') // remove fractions like 2/6
      .replace(/\d+\s*(slices?|pieces?|parts?|eaten|left|out of)/gi, '') // remove quantity references
      .replace(/\s{2,}/g, ' ')
      .trim();

    // DALL-E weights the beginning of prompts most heavily — put no-text constraint first
    const enhancedPrompt = `I NEED to test how the tool works with extremely simple prompts. DO NOT include ANY text, writing, letters, numbers, labels, captions, signs, or mathematical notation anywhere in the image. Educational illustration for ${gradeLevel || 'elementary school'}: ${cleanedPrompt}. Style: colorful, clean, professional educational illustration style similar to a textbook or classroom poster, age-appropriate for young children. The image should be visually informative and depict the scene described. Remember: ZERO text, writing, or numbers anywhere in the image.`;

    const response = await openai.images.generate({
      model: CONFIG.MODEL,
      prompt: enhancedPrompt,
      n: 1,
      size: CONFIG.SIZE,
      quality: CONFIG.QUALITY,
      response_format: 'url',
    });

    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) {
      return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
    }

    console.log(`[LESSON_ENGINE_IMAGE] Generated image for: "${prompt.slice(0, 60)}..."`);

    return NextResponse.json({ success: true, url: imageUrl });
  } catch (error: unknown) {
    console.error('[LESSON_ENGINE_IMAGE] Error:', error);

    if (error instanceof OpenAI.APIError) {
      if (error.status === 429) {
        return NextResponse.json({ error: 'Image service is busy. Please wait.' }, { status: 429 });
      }
      if (error.status === 400) {
        // Content policy violation — return gracefully
        return NextResponse.json({ error: 'Could not generate this image.', skipped: true }, { status: 200 });
      }
    }

    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Image generation failed', details: msg }, { status: 500 });
  }
}
