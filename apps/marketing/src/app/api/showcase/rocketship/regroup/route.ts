import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { checkDailyLimit } from '@core/utils/rate-limit';

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
    const { student, quizResults, currentGroups, learningObjective } = await request.json();

    const systemPrompt = `You are an adaptive grouping engine for a Rocketship Grade 4 classroom using the Bridges in Mathematics curriculum. You just received new quiz data for a specific student. Analyze whether this student's current grouping is still appropriate. If their new performance indicates they belong in a different skill-based group, output ONLY valid JSON with this exact shape:

{
  "student": "name",
  "previous_group": "name",
  "new_group": "name",
  "rationale": "1 sentence specific to the misconception",
  "teacher_action": "specific action with time and location"
}

Be concrete. Reference specific skills and curriculum-aligned intervention (e.g., Bridges Workplace activities, fraction strips kit). Name the exact Learning Lab time block. Keep rationale and teacher_action one sentence each.`;

    const groupSummary = Object.entries(currentGroups as Record<string, string[]>)
      .map(([name, students]) => `- ${name}: ${students.join(', ')}`)
      .join('\n');

    const itemSummary = (quizResults.items as Array<{ item: number; skill: string; correct: boolean }>)
      .map((r) => `Item ${r.item} (${r.skill}): ${r.correct ? 'CORRECT' : 'INCORRECT'}`)
      .join('\n');

    const userMessage = `Today's learning objective: ${learningObjective}

Student: ${student.name} (previously in "${student.currentGroup}" group)
New quiz score: ${quizResults.correct}/${quizResults.total}

Item-level results:
${itemSummary}

Current classroom groupings:
${groupSummary}

Based on this student's new performance, decide whether to shift them to a different skill-based group. Output the JSON.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 400,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    });

    const text = message.content[0]?.type === 'text' ? message.content[0].text : '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const decision = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    return NextResponse.json({
      decision,
      usage: {
        inputTokens: message.usage.input_tokens,
        outputTokens: message.usage.output_tokens,
      },
    });
  } catch (error) {
    console.error('Regroup error:', error);
    return NextResponse.json({ error: 'Failed to evaluate grouping.' }, { status: 500 });
  }
}
