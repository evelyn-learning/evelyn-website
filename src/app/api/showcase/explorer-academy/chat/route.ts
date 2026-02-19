import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Rate limiting
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 15;
const RATE_WINDOW = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (rateLimitStore.size > 10_000) {
    rateLimitStore.clear();
  }

  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

const SYSTEM_PROMPT = `You are the Explorer Academy AI Tutor — a friendly, patient, and encouraging tutor for students aged 8–15 at Explorer Academy in Delta, BC, Canada. You help with Math and Science questions aligned to the British Columbia curriculum.

Guidelines:
- Use the Socratic method: guide students to discover answers through questions and hints, rather than giving answers directly
- Use simple, age-appropriate language
- Be encouraging: include phrases like "Great question!", "You're on the right track!", "Let's figure this out together!"
- Keep responses concise: 2-4 sentences per message for younger students, slightly longer for older ones
- Reference BC curriculum concepts where relevant
- For math, show work step by step when needed
- Use LaTeX notation wrapped in $ for math expressions (e.g., $\\frac{1}{2}$, $x^2 + 3x = 10$)
- If a student seems frustrated, be extra patient and encouraging
- Never do the entire problem for them — always leave the final step for the student to complete
- If asked about non-academic topics, gently redirect to Math or Science`;

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';

  if (!checkRateLimit(ip)) {
    return new Response(
      `data: ${JSON.stringify({ type: 'error', content: 'Too many requests. Please wait a moment.' })}\n\n`,
      {
        status: 429,
        headers: { 'Content-Type': 'text/event-stream' },
      }
    );
  }

  try {
    const { messages, grade, studentName } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        `data: ${JSON.stringify({ type: 'error', content: 'Messages are required.' })}\n\n`,
        {
          status: 400,
          headers: { 'Content-Type': 'text/event-stream' },
        }
      );
    }

    // Build dynamic system prompt with grade/name context if provided
    let systemPrompt = SYSTEM_PROMPT;
    if (grade || studentName) {
      const name = studentName || 'student';
      const gradeStr = grade ? `Grade ${grade}` : 'their grade level';
      systemPrompt = `You are the Explorer Academy Tutor for ${name}, a ${gradeStr} student at Explorer Academy in Delta, BC, Canada. Use age-appropriate language for ${gradeStr} students.\n\n${SYSTEM_PROMPT}`;
    }

    const stream = anthropic.messages.stream({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 500,
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        stream.on('text', (text) => {
          const data = JSON.stringify({ type: 'chunk', content: text });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        });

        stream.on('end', () => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
          controller.close();
        });

        stream.on('error', (error) => {
          console.error('Stream error:', error);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: 'error', content: 'An error occurred. Please try again.' })}\n\n`
            )
          );
          controller.close();
        });
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
    console.error('Chat error:', error);
    return new Response(
      `data: ${JSON.stringify({ type: 'error', content: 'An error occurred. Please try again.' })}\n\n`,
      {
        status: 500,
        headers: { 'Content-Type': 'text/event-stream' },
      }
    );
  }
}
