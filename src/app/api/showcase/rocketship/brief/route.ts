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

const SYSTEM_PROMPT = `You are an expert instructional coach generating a morning brief for a Grade 4 teacher at Rocketship Public Schools. Based on the class data provided, generate a structured brief with exactly these sections:

## 📋 Lesson Focus
[One paragraph about today's Grade 4 fractions lesson — comparing fractions with unlike denominators]

## 👥 Small Group Pull
[Name 2-3 students with a one-sentence rationale for each, using the student data provided]

## ⚠️ Anticipated Misconceptions
[List exactly 2 misconceptions with a specific teacher move for each]

## ⏱️ Time Guidance
[One thing to compress, one thing to expand in today's lesson]

## 💬 Warm-Up Prompt
[One engaging discussion question to open the lesson]

Be specific, actionable, and warm. Use Rocketship language: "Rocketeers", "mastery", "Learning Lab." Keep the entire brief under 300 words. Use markdown formatting with headers and bullet points.`;

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';

  if (!checkRateLimit(ip)) {
    return new Response(
      `data: ${JSON.stringify({ type: 'error', content: 'Too many requests. Please wait a moment.' })}\n\n`,
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
    const { students } = await request.json();

    const studentSummary = students
      .map(
        (s: { name: string; mastery: string; exitTicket: number; ell: string; flag: string }) =>
          `- ${s.name}: Mastery=${s.mastery}, Exit Ticket=${s.exitTicket}%, ELL=${s.ell}, Flag=${s.flag}`
      )
      .join('\n');

    const userMessage = `Here is the class data for Ms. Amara Chen's Grade 4 class at Rocketship Mateo Sheedy Elementary. Today's lesson: Comparing fractions with unlike denominators.

Class Roster:
${studentSummary}

Generate the morning instructional brief.`;

    const stream = anthropic.messages.stream({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 800,
      system: SYSTEM_PROMPT,
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
          console.error('Brief stream error:', error);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: 'error', content: 'An error occurred generating the brief.' })}\n\n`
            )
          );
          controller.close();
        });

        try {
          const finalMessage = await stream.finalMessage();
          const usage = {
            inputTokens: finalMessage.usage.input_tokens,
            outputTokens: finalMessage.usage.output_tokens,
            model: 'claude-sonnet-4-5-20250929',
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
    console.error('Brief generation error:', error);
    return new Response(
      `data: ${JSON.stringify({ type: 'error', content: 'An error occurred. Please try again.' })}\n\n`,
      { status: 500, headers: { 'Content-Type': 'text/event-stream' } }
    );
  }
}
