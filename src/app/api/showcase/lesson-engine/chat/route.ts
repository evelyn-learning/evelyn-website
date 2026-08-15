import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { checkDailyLimit } from '@core/utils/rate-limit';

// ============================================================================
// CONFIGURATION
// ============================================================================
const CONFIG = {
  MODEL: 'claude-haiku-4-5-20251001',
  MAX_TOKENS: 500,
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
// ANTHROPIC CLIENT
// ============================================================================
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ============================================================================
// LANGUAGE CONFIG
// ============================================================================
const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  es: 'Spanish',
  vi: 'Vietnamese',
};

// ============================================================================
// API ROUTE HANDLER - STREAMING SSE
// ============================================================================
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Rate limiting
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
    const rateLimitKey = `lesson_engine_chat:${ip}`;
    const rateLimit = checkRateLimit(rateLimitKey);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many questions. Please wait a moment.' },
        { status: 429, headers: { 'Retry-After': Math.ceil(rateLimit.resetIn / 1000).toString() } }
      );
    }

    const daily = checkDailyLimit(ip, 'showcase-light', 100);
    if (!daily.allowed) {
      return NextResponse.json(
        { error: 'Daily usage limit reached. Please try again tomorrow.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((daily.resetsAt - Date.now()) / 1000)) } }
      );
    }

    const body = await request.json();
    const { question, lessonContext, currentSlideIndex, gradeLevel, language } = body as {
      question: string;
      lessonContext: {
        title: string;
        slides: Array<{ title: string; content: string; narration: string; type: string }>;
      };
      currentSlideIndex: number;
      gradeLevel: string;
      language: string;
    };

    if (!question || !lessonContext) {
      return NextResponse.json({ error: 'Question and lesson context are required' }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'AI service not configured' }, { status: 500 });
    }

    const languageName = LANGUAGE_NAMES[language] || 'English';
    const currentSlide = lessonContext.slides[currentSlideIndex] || lessonContext.slides[0];

    // Build lesson summary for context
    const slidesSummary = lessonContext.slides
      .map((s, i) => `Slide ${i + 1} (${s.type}): ${s.title} — ${s.content.slice(0, 150)}`)
      .join('\n');

    const systemPrompt = `You are an AI teaching assistant helping in a ${gradeLevel} classroom. A teacher is presenting a lesson titled "${lessonContext.title}" and a student just asked a question.

CURRENT SLIDE (Slide ${currentSlideIndex + 1}):
Title: ${currentSlide.title}
Content: ${currentSlide.content}

FULL LESSON OUTLINE:
${slidesSummary}

INSTRUCTIONS:
- Answer the student's question clearly so the whole class can understand
- Use language appropriate for ${gradeLevel} students
- Keep your answer under 100 words
- Be encouraging and educational
- Connect your answer back to the lesson when possible
- Respond in ${languageName}`;

    // Create streaming response
    const encoder = new TextEncoder();
    let fullResponse = '';

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const streamResponse = anthropic.messages.stream({
            model: CONFIG.MODEL,
            max_tokens: CONFIG.MAX_TOKENS,
            system: systemPrompt,
            messages: [{ role: 'user', content: question.slice(0, 1000) }],
          });

          streamResponse.on('text', (text) => {
            fullResponse += text;
            const data = JSON.stringify({ type: 'chunk', content: text });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          });

          const finalMsg = await streamResponse.finalMessage();
          const usage = {
            inputTokens: finalMsg.usage.input_tokens,
            outputTokens: finalMsg.usage.output_tokens,
            model: CONFIG.MODEL,
          };

          const doneData = JSON.stringify({ type: 'done', content: fullResponse, usage });
          controller.enqueue(encoder.encode(`data: ${doneData}\n\n`));

          const duration = Date.now() - startTime;
          console.log(`[LESSON_ENGINE_CHAT] Question answered in ${duration}ms`);

          controller.close();
        } catch (error) {
          console.error('[LESSON_ENGINE_CHAT] Streaming error:', error);
          let errorMessage = 'Something went wrong. Please try again.';
          if (error instanceof Anthropic.APIError) {
            if (error.status === 429) errorMessage = 'AI is busy. Please wait a moment.';
            else if (error.status === 529) errorMessage = 'AI is overloaded. Please try again.';
          }
          const errorData = JSON.stringify({ type: 'error', error: errorMessage });
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[LESSON_ENGINE_CHAT] Error after ${duration}ms:`, error);
    return NextResponse.json({ error: 'Failed to process question' }, { status: 500 });
  }
}
