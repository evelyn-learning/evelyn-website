import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

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

  try {
    const { problem, gradeLevel } = await request.json();

    if (!problem || !gradeLevel) {
      return NextResponse.json(
        { error: 'Problem and grade level are required.' },
        { status: 400 }
      );
    }

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 2000,
      system: `You are a patient, encouraging math tutor for students in British Columbia, Canada. You solve math problems step by step, explaining WHY each step is taken (pedagogically, not just procedurally). Use age-appropriate language for the student's grade level.

IMPORTANT: Return your response as valid JSON only — no markdown, no code blocks. Use this exact format:
{
  "steps": [
    {
      "step": 1,
      "title": "Brief step title",
      "expression": "The mathematical expression or equation for this step (use LaTeX notation for math, e.g., \\\\frac{2}{3} + \\\\frac{1}{4})",
      "explanation": "A clear, encouraging explanation of WHY we're doing this step"
    }
  ],
  "finalAnswer": "The final answer in LaTeX notation",
  "encouragement": "A brief encouraging message about what the student learned"
}

Use LaTeX math notation in expressions (e.g., \\\\frac{a}{b} for fractions, x^2 for exponents, \\\\sqrt{x} for square roots). Keep explanations concise and grade-appropriate.`,
      messages: [
        {
          role: 'user',
          content: `Grade level: ${gradeLevel}\n\nSolve this problem step by step: ${problem}`,
        },
      ],
    });

    const raw = response.content[0].type === 'text' ? response.content[0].text : '';

    // Strip markdown code blocks if present
    let text = raw;
    const codeBlockMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      text = codeBlockMatch[1].trim();
    } else {
      // Try to extract JSON object directly
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) text = jsonMatch[0];
    }

    try {
      const parsed = JSON.parse(text);
      return NextResponse.json(parsed);
    } catch {
      console.error('Failed to parse math solver response:', raw.slice(0, 500));
      return NextResponse.json(
        { error: 'Failed to parse AI response. Please try again.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Math solver error:', error);
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
