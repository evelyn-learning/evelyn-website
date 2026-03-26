import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { checkDailyLimit } from '@/lib/utils/rate-limit';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10;
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

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';

  if (!checkRateLimit(ip)) {
    return new Response(
      `data: ${JSON.stringify({ type: 'error', content: 'Too many requests.' })}\n\n`,
      { status: 429, headers: { 'Content-Type': 'text/event-stream' } }
    );
  }

  const daily = checkDailyLimit(ip, 'rocketship-showcase', 100);
  if (!daily.allowed) {
    return new Response(
      `data: ${JSON.stringify({ type: 'error', content: 'Daily usage limit reached.' })}\n\n`,
      { status: 429, headers: { 'Content-Type': 'text/event-stream' } }
    );
  }

  try {
    const { studentName, language, masteryLevel, recentActivity } = await request.json();

    const systemPrompt = language === 'es'
      ? `You are a friendly teacher assistant at Rocketship Public Schools writing a short progress update to a parent IN SPANISH. The tone should be warm, encouraging, and easy to understand. Keep it to 3-4 sentences. Include one specific thing the student did well and one suggestion for home practice. Do not use overly formal language — write like a caring teacher.`
      : `You are a friendly teacher assistant at Rocketship Public Schools writing a short progress update to a parent. The tone should be warm, encouraging, and easy to understand. Keep it to 3-4 sentences. Include one specific thing the student did well and one suggestion for home practice. Do not use overly formal language — write like a caring teacher.`;

    const userMessage = `Write a family update for ${studentName}'s parent. Current mastery level: ${masteryLevel}. Recent activity: ${recentActivity}. Today's subject: Grade 4 fractions.`;

    const stream = anthropic.messages.stream({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 300,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        stream.on('text', (text) => {
          const data = JSON.stringify({ type: 'chunk', content: text });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        });

        stream.on('error', (error) => {
          console.error('Family update stream error:', error);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: 'error', content: 'An error occurred.' })}\n\n`
            )
          );
          controller.close();
        });

        try {
          const finalMessage = await stream.finalMessage();
          const usage = {
            inputTokens: finalMessage.usage.input_tokens,
            outputTokens: finalMessage.usage.output_tokens,
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done', usage })}\n\n`));
        } catch {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
        }
        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Family update error:', error);
    return new Response(
      `data: ${JSON.stringify({ type: 'error', content: 'An error occurred.' })}\n\n`,
      { status: 500, headers: { 'Content-Type': 'text/event-stream' } }
    );
  }
}
