import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { checkDailyLimit } from '@/lib/utils/rate-limit';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Rate limiting
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10;
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

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment.' },
      { status: 429 }
    );
  }

  const daily = checkDailyLimit(ip, 'showcase-medium', 50);
  if (!daily.allowed) {
    return NextResponse.json(
      { error: 'Daily usage limit reached. Please try again tomorrow.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((daily.resetsAt - Date.now()) / 1000)) } }
    );
  }

  try {
    const { grade, subject, topic } = await request.json();

    if (!grade || !subject || !topic) {
      return NextResponse.json(
        { error: 'Grade, subject, and topic are required.' },
        { status: 400 }
      );
    }

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 3000,
      system: `You are an expert test creator for Achievement First schools. Generate practice test questions aligned to Common Core State Standards (CCSS) and Next Generation Science Standards (NGSS). Questions should be rigorous, age-appropriate, and pedagogically sound.

IMPORTANT: Return your response as valid JSON only — no markdown, no code blocks. Use this exact format:
{
  "questions": [
    {
      "id": 1,
      "question": "The question text (use LaTeX notation wrapped in $ signs for any math, e.g., $\\\\frac{1}{2}$)",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Brief explanation of why this is the correct answer and what CCSS/NGSS standard it addresses",
      "difficulty": "easy|medium|hard"
    }
  ]
}

Generate exactly 5 questions with a mix of difficulty levels (2 easy, 2 medium, 1 hard). Make sure each question is unique and tests different aspects of the topic. Use LaTeX notation (wrapped in $ signs) for any mathematical expressions.`,
      messages: [
        {
          role: 'user',
          content: `Generate a 5-question multiple-choice practice test for:\nGrade: ${grade}\nSubject: ${subject}\nTopic: ${topic}\n\nAligned to Common Core State Standards (CCSS) / NGSS.`,
        },
      ],
    });

    const raw = response.content[0].type === 'text' ? response.content[0].text : '';

    let text = raw;
    const codeBlockMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      text = codeBlockMatch[1].trim();
    } else {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) text = jsonMatch[0];
    }

    try {
      const parsed = JSON.parse(text);
      return NextResponse.json(parsed);
    } catch {
      console.error('Failed to parse practice test response:', raw.slice(0, 500));
      return NextResponse.json(
        { error: 'Failed to parse response. Please try again.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Practice test error:', error);
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
