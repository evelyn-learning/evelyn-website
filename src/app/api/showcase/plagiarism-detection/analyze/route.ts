import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { checkDailyLimit } from '@/lib/utils/rate-limit';
import { analyzeText } from '@/lib/plagiarism/analyze-text';

interface RateLimitEntry { count: number; resetTime: number; }
const rateLimitStore = new Map<string, RateLimitEntry>();
const RATE_LIMIT = { requests: 15, windowMs: 60_000 };

function getIP(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  return forwarded ? forwarded.split(',')[0].trim() : 'unknown';
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const key = `plag:${ip}`;
  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetTime < now) {
    rateLimitStore.set(key, { count: 1, resetTime: now + RATE_LIMIT.windowMs });
    return true;
  }
  if (entry.count >= RATE_LIMIT.requests) return false;
  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  const ip = getIP(request);

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 });
  }

  const daily = checkDailyLimit(ip, 'showcase-medium', 50);
  if (!daily.allowed) {
    return NextResponse.json({ error: 'Daily usage limit reached. Please try again tomorrow.' }, { status: 429 });
  }

  try {
    const { text, context } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required.' }, { status: 400 });
    }

    const wordCount = text.trim().split(/\s+/).length;
    if (wordCount < 50) {
      return NextResponse.json({ error: 'Please provide at least 50 words.' }, { status: 400 });
    }

    const result = await analyzeText({ text, context });
    return NextResponse.json({ result });
  } catch (error) {
    console.error('Plagiarism analysis error:', error);
    const message = error instanceof Anthropic.APIError
      ? 'AI service temporarily unavailable. Please try again.'
      : 'Analysis failed. Please try again.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
