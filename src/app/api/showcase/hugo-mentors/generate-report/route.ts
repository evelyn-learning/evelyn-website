import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { checkBurstLimit, checkDailyLimit, getIPFromRequest } from '@/lib/utils/rate-limit';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_SHOWCASE_API_KEY || process.env.OPENAI_API_KEY,
});

const DEFAULT_SYSTEM_PROMPT = `You are an expert educational assessment writer for Hugo Mentors, a program that connects high school students with university professors for personalized 1:1 research mentorship experiences.

Your job is to generate a comprehensive, individualized narrative assessment report for a student based on their survey responses. The report must be warm yet professional, insightful, and actionable.

Generate the report as a JSON array of sections. Each section has a "title" and "content" field. Generate exactly these 7 sections:

1. "Executive Summary" — A 3-4 sentence overview of the student's profile, strengths, and readiness for mentorship. Highlight what makes this student unique.

2. "Student Profile & Context" — A narrative paragraph analyzing the student's academic background, course rigor, and how their academic choices reflect their interests. Reference specific courses and GPA context.

3. "Interest & Aptitude Analysis" — Analyze the student's self-identified interests, strengths, and self-assessment scores. Identify patterns, note areas of strength and honest growth opportunities. Be specific and reference their survey answers.

4. "Research Readiness Assessment" — Provide a structured assessment with STRENGTHS (4-5 bullet points) and AREAS FOR DEVELOPMENT (4-5 bullet points). Be specific to this student's experience level and goals.

5. "Recommended Research Directions" — Suggest 3 research directions labeled as PRIMARY RECOMMENDATION, ALTERNATIVE, and EXPLORATORY. Each should have a specific research title in quotes, followed by a 2-3 sentence description that connects to the student's interests and skills.

6. "Suggested Mentor Match Profile" — Describe the ideal mentor characteristics (4 numbered points) and an "Ideal mentor profile" sentence describing the type of professor that would be the best fit.

7. "Personalized Development Plan" — Create a week-by-week plan spanning 18 weeks with specific milestones. Group into phases (e.g., WEEKS 1-3, WEEKS 4-6, etc.) and include a MILESTONES line at the end listing key deliverable checkpoints.

IMPORTANT GUIDELINES:
- Write in third person about the student
- Be specific — reference actual survey answers, courses, schools, and stated goals
- Maintain a professional yet encouraging tone
- Each section should be 100-200 words
- Do not include any markdown formatting in the content — use plain text only

OUTPUT FORMAT: You MUST return a JSON object with exactly this structure:
{"sections": [{"title": "Executive Summary", "content": "..."}, {"title": "Student Profile & Context", "content": "..."}, ...]}
The "sections" key must contain an array of 7 objects, each with "title" and "content" string fields.`;

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getIPFromRequest(request);
    const burst = checkBurstLimit(`hugo_mentors_report:${ip}`, 5, 60_000);
    if (!burst.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment and try again.' },
        { status: 429, headers: { 'Retry-After': Math.ceil(burst.resetIn / 1000).toString() } }
      );
    }
    const daily = checkDailyLimit(ip, 'showcase-heavy', 30);
    if (!daily.allowed) {
      return NextResponse.json(
        { error: 'Daily usage limit reached. Please try again tomorrow.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((daily.resetsAt - Date.now()) / 1000)) } }
      );
    }

    const body = await request.json();
    const { studentName, school, grade, surveyData, systemPrompt } = body;

    if (!studentName || !surveyData) {
      return NextResponse.json(
        { error: 'Missing required fields: studentName and surveyData' },
        { status: 400 }
      );
    }

    // Build the user prompt from survey data
    const surveyText = surveyData
      .map((section: { category: string; questions: { q: string; a: string }[] }) => {
        const qas = section.questions
          .map((qa: { q: string; a: string }) => `  Q: ${qa.q}\n  A: ${qa.a}`)
          .join('\n\n');
        return `[${section.category}]\n${qas}`;
      })
      .join('\n\n---\n\n');

    const userPrompt = `Generate an individualized assessment report for the following student:

Student Name: ${studentName}
School: ${school || 'Not specified'}
Grade: ${grade || 'Not specified'}

SURVEY RESPONSES:
${surveyText}

Return a JSON object with a "sections" key containing an array of 7 section objects. Each object must have "title" and "content" fields.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt || DEFAULT_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 6000,
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const raw = completion.choices[0]?.message?.content || '{}';
    let sections;

    try {
      const parsed = JSON.parse(raw);

      if (Array.isArray(parsed)) {
        // Direct array (unlikely with json_object format, but handle it)
        sections = parsed;
      } else if (typeof parsed === 'object' && parsed !== null) {
        // JSON object — try known keys first, then find any array value
        sections = parsed.sections || parsed.report || parsed.data || null;
        if (!sections) {
          // Find the first array value in the object
          for (const key of Object.keys(parsed)) {
            if (Array.isArray(parsed[key])) {
              sections = parsed[key];
              break;
            }
          }
        }
      }

      // Validate sections is a non-empty array of objects with title+content
      if (!Array.isArray(sections) || sections.length === 0) {
        return NextResponse.json(
          { error: 'AI returned unexpected format', raw: raw.slice(0, 500) },
          { status: 500 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: 'Failed to parse AI response', raw: raw.slice(0, 500) },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      sections,
      model: 'gpt-4o-mini',
      tokens: completion.usage?.total_tokens || 0,
    });
  } catch (error: unknown) {
    console.error('Report generation error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Report generation failed', details: message },
      { status: 500 }
    );
  }
}

// Return the default prompt for the UI
export async function GET() {
  return NextResponse.json({
    defaultPrompt: DEFAULT_SYSTEM_PROMPT,
  });
}
