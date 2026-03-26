import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { checkDailyLimit } from '@/lib/utils/rate-limit';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const daily = checkDailyLimit(ip, 'rocketship-showcase', 100);
  if (!daily.allowed) {
    return NextResponse.json({ error: 'Daily usage limit reached.' }, { status: 429 });
  }

  try {
    const { students } = await request.json();

    const systemPrompt = `You are an instructional grouping expert at Rocketship Public Schools. Based on the student data, suggest optimal groupings for today's fractions lesson. Return ONLY valid JSON with this exact structure:
{
  "smallGroup": { "students": ["name1", "name2"], "rationale": "brief reason" },
  "independent": { "students": ["name3", "name4"], "rationale": "brief reason" },
  "extension": { "students": ["name5"], "rationale": "brief reason" }
}
Use Rocketship language. Base groupings on mastery levels and exit ticket scores.`;

    const studentSummary = students
      .map(
        (s: { name: string; mastery: string; exitTicket: number; ell: string; flag: string }) =>
          `${s.name}: Mastery=${s.mastery}, Exit=${s.exitTicket}%, ELL=${s.ell}, Flag=${s.flag}`
      )
      .join('\n');

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 400,
      system: systemPrompt,
      messages: [{ role: 'user', content: `Regroup these Rocketeers for today:\n${studentSummary}` }],
    });

    const text = message.content[0]?.type === 'text' ? message.content[0].text : '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const groupings = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    return NextResponse.json({
      groupings,
      usage: {
        inputTokens: message.usage.input_tokens,
        outputTokens: message.usage.output_tokens,
      },
    });
  } catch (error) {
    console.error('Regroup error:', error);
    return NextResponse.json({ error: 'Failed to generate groupings.' }, { status: 500 });
  }
}
