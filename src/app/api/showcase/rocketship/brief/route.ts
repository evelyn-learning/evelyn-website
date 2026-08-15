import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { checkDailyLimit } from '@core/utils/rate-limit';

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

const SYSTEM_PROMPT = `You are an expert instructional coach generating a morning brief for a Grade 4 teacher at Rocketship Public Schools using the Bridges in Mathematics curriculum. Based on the class roster data provided, generate a brief with these sections, each hyper-specific. Use markdown headers (##) for each section.

## 1. TODAY'S LESSON
Name the specific lesson (e.g., "Bridges Unit 4, Session 3: Comparing Fractions with Unlike Denominators"). Name the specific pages or activities from the Bridges Teacher's Guide (e.g., "Workplace 4B: Fraction Spin & Compare, TG pp. 112–115").

## 2. PULL GROUP
For each named group, state:
- **Group name** (e.g., "Equivalent Fractions Recovery — Marcus, Destiny, Sophia")
- **Shared misconception** in one sentence
- **Exact mini-lesson** (e.g., "Start with Bridges fraction strips kit. Model 2/4 = 1/2 using the strips. Have each student build 3/6 = 1/2 independently. Check with exit question: 'Is 4/8 equal to 1/2? Yes/No and why.'")
- **Sentence frame for ELL support** if applicable (e.g., for Sofia: "___ is greater than ___ because ___.")
- **Time needed**: X minutes

## 3. INDEPENDENT PRACTICE
Name the proficient students explicitly. Name the specific extension task from the Bridges curriculum (e.g., "Workplace 4D: Fraction Bingo with sixths and eighths, TG p. 118"), not a general suggestion.

## 4. ANTICIPATED MISCONCEPTION FOR WHOLE CLASS
Name the top misconception likely to surface in today's lesson. Give the specific teacher move in the form: "When X happens, do Y."

## 5. WARM-UP PROMPT
One specific discussion question with the exact wording a teacher can read aloud.

Constraints:
- Do NOT use phrases like "use manipulatives," "provide language support," or "visual models" without naming WHICH manipulatives, WHICH language support, and WHICH visual models from the Bridges curriculum.
- Every suggestion must be concrete enough that a first-year teacher could execute it without further interpretation.
- Maximum 400 words total.`;

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
