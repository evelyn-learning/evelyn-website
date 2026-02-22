import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Rate limiting
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 30;
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

// ─── Types ────────────────────────────────────────────────────

interface AdaptiveRequest {
  phase: 'DIAGNOSTIC' | 'TEACH' | 'ASSESS' | 'SUMMARY';
  grade: number;
  studentName: string;
  lessonTopic: string;
  learningObjectives: { id: string; description: string; difficulty: string }[];
  history: {
    phase: string;
    segmentType: string;
    objectiveId?: string;
    question?: string;
    studentAnswer?: string;
    correctAnswer?: string;
    isCorrect?: boolean;
  }[];
  availableVideos: {
    youtubeId: string;
    title: string;
    channel: string;
    level: string;
    topics: string[];
  }[];
  videosUsed: string[];
  constraints: {
    maxSegments?: number;
    minSegments?: number;
    remainingTeachBudget?: number;
    diagnosticDifficulty?: string;
  };
}

interface GeneratedSegment {
  type: 'narration' | 'video' | 'comprehension' | 'practice' | 'summary';
  title?: string;
  text?: string;
  youtubeId?: string;
  caption?: string;
  question?: string;
  options?: string[];
  correctIndex?: number;
  explanation?: string;
  keyPoints?: string[];
  objectiveId?: string;
}

interface AdaptiveResponse {
  reasoning: string;
  segments: GeneratedSegment[];
  suggestedPhaseTransition?: 'ASSESS';
  weakObjectives?: string[];
}

// ─── Phase prompts ────────────────────────────────────────────

function buildSystemPrompt(req: AdaptiveRequest): string {
  const performanceSummary = buildPerformanceSummary(req.history);
  const videoList = req.availableVideos
    .filter((v) => !req.videosUsed.includes(v.youtubeId))
    .map((v) => `  - youtubeId: "${v.youtubeId}", title: "${v.title}", channel: "${v.channel}", level: "${v.level}"`)
    .join('\n');

  const base = `You are an AI tutor for Explorer Academy, creating adaptive lesson content for a Grade ${req.grade} student named ${req.studentName}.
Topic: ${req.lessonTopic}

RULES:
- Respond ONLY with valid JSON matching the schema below. No markdown, no explanation outside JSON.
- All questions MUST have exactly 4 options.
- correctIndex must be 0, 1, 2, or 3.
- Use age-appropriate language for Grade ${req.grade} (ages ${req.grade + 5}-${req.grade + 6}).
- Be encouraging and supportive.
- NEVER fabricate YouTube video IDs. Only use IDs from the available videos list below.
- For video segments, you MUST use a youtubeId from the available list.
- NEVER reference visual elements that are not displayed (number lines, diagrams, circles, shapes, pictures, images, figures, tables, charts). Questions must be answerable from TEXT ALONE. Do not say "Look at this..." or "In the figure..." — there are no figures. All questions must be purely text-based.

Learning Objectives:
${req.learningObjectives.map((o) => `  - ${o.id}: ${o.description} (${o.difficulty})`).join('\n')}

Student Performance So Far:
${performanceSummary || '  No data yet.'}

Available Videos (unused):
${videoList || '  None remaining.'}

Response JSON Schema:
{
  "reasoning": "string — your pedagogical reasoning (logged, not shown to student)",
  "segments": [{ segment objects }],
  "suggestedPhaseTransition": "ASSESS" | undefined,
  "weakObjectives": ["objectiveId", ...] | undefined
}`;

  const phaseInstructions: Record<string, string> = {
    DIAGNOSTIC: `PHASE: DIAGNOSTIC
Generate exactly 1 diagnostic question as a "comprehension" segment.
Difficulty: ${req.constraints.diagnosticDifficulty || 'medium'}
- Tag each question with an objectiveId from the learning objectives.
- This helps assess what the student already knows before teaching.
Segment schema: { "type": "comprehension", "question": "...", "options": ["A","B","C","D"], "correctIndex": 0-3, "explanation": "...", "objectiveId": "..." }`,

    TEACH: `PHASE: TEACH
Generate 1-2 teaching segments based on student performance.
Remaining budget: ${req.constraints.remainingTeachBudget ?? 6} more segments allowed.
Segment types you may use: "narration", "video", "comprehension", "practice"
Rules:
- If the student is struggling with an objective, teach it with a narration then test with a question.
- If the student is doing well, advance difficulty or move to the next objective.
- Include at least 1 video when possible (use from available list).
- Do not generate 3 narrations in a row — intersperse with questions or videos.
- For video: { "type": "video", "title": "...", "youtubeId": "FROM_LIST_ONLY", "caption": "..." }
- For narration: { "type": "narration", "title": "...", "text": "..." }
- For question: { "type": "comprehension"|"practice", "question": "...", "options": [...], "correctIndex": 0-3, "explanation": "...", "objectiveId": "..." }
- Set suggestedPhaseTransition to "ASSESS" if you believe the student is ready for assessment.`,

    ASSESS: `PHASE: ASSESS
Generate exactly 4 assessment questions (type "practice").
- Weight questions toward objectives the student struggled with.
- Each question must have an objectiveId.
- Cover as many objectives as possible.
Segment schema: { "type": "practice", "question": "...", "options": [...], "correctIndex": 0-3, "explanation": "...", "objectiveId": "..." }`,

    SUMMARY: `PHASE: SUMMARY
Generate exactly 1 summary segment.
- Include personalized keyPoints based on what the student learned.
- Reference specific objectives they mastered or need to review.
- Be encouraging and celebratory.
Segment schema: { "type": "summary", "title": "...", "keyPoints": ["...", "...", ...] }`,
  };

  return base + '\n\n' + (phaseInstructions[req.phase] || '');
}

function buildPerformanceSummary(
  history: AdaptiveRequest['history']
): string {
  if (history.length === 0) return '';

  const questions = history.filter((h) => h.isCorrect !== undefined);
  const correct = questions.filter((h) => h.isCorrect).length;
  const total = questions.length;

  const byObjective: Record<string, { correct: number; total: number }> = {};
  for (const h of questions) {
    if (!h.objectiveId) continue;
    if (!byObjective[h.objectiveId]) byObjective[h.objectiveId] = { correct: 0, total: 0 };
    byObjective[h.objectiveId].total++;
    if (h.isCorrect) byObjective[h.objectiveId].correct++;
  }

  let summary = `  Overall: ${correct}/${total} correct\n`;
  for (const [objId, stats] of Object.entries(byObjective)) {
    summary += `  ${objId}: ${stats.correct}/${stats.total} correct\n`;
  }
  return summary;
}

// ─── Validation ───────────────────────────────────────────────

function validateResponse(data: AdaptiveResponse, phase: string): string | null {
  if (!data.reasoning || typeof data.reasoning !== 'string') {
    return 'Missing reasoning field';
  }
  if (!Array.isArray(data.segments) || data.segments.length === 0) {
    return 'Missing or empty segments array';
  }

  for (const seg of data.segments) {
    if (seg.type === 'comprehension' || seg.type === 'practice') {
      if (!Array.isArray(seg.options) || seg.options.length !== 4) {
        return `Question must have exactly 4 options, got ${seg.options?.length}`;
      }
      if (typeof seg.correctIndex !== 'number' || seg.correctIndex < 0 || seg.correctIndex > 3) {
        return `correctIndex must be 0-3, got ${seg.correctIndex}`;
      }
      if (!seg.question || !seg.explanation) {
        return 'Question segments must have question and explanation';
      }
    }
    if (seg.type === 'narration') {
      if (!seg.title || !seg.text) return 'Narration must have title and text';
    }
    if (seg.type === 'video') {
      if (!seg.youtubeId || !seg.title) return 'Video must have youtubeId and title';
    }
    if (seg.type === 'summary') {
      if (!Array.isArray(seg.keyPoints) || seg.keyPoints.length === 0) {
        return 'Summary must have non-empty keyPoints';
      }
    }
  }

  // Phase-specific counts
  if (phase === 'DIAGNOSTIC' && data.segments.length !== 1) {
    return `DIAGNOSTIC must return exactly 1 segment, got ${data.segments.length}`;
  }
  if (phase === 'ASSESS' && data.segments.length < 4) {
    return `ASSESS must return at least 4 segments, got ${data.segments.length}`;
  }
  if (phase === 'SUMMARY' && data.segments.length !== 1) {
    return `SUMMARY must return exactly 1 segment, got ${data.segments.length}`;
  }
  // TEACH: at least 1 segment required; we truncate extras server-side
  if (phase === 'TEACH' && data.segments.length < 1) {
    return `TEACH must return at least 1 segment, got ${data.segments.length}`;
  }

  return null;
}

// ─── Main handler ─────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  let body: AdaptiveRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.phase || !body.grade || !body.lessonTopic || !body.learningObjectives) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const systemPrompt = buildSystemPrompt(body);

  // Attempt up to 2 tries (1 retry on parse failure)
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: `Generate adaptive ${body.phase} content for the lesson on "${body.lessonTopic}". Respond ONLY with the JSON object.`,
          },
        ],
        system: systemPrompt,
      });

      const text =
        message.content[0]?.type === 'text' ? message.content[0].text : '';

      // Extract JSON from the response (handle possible markdown wrapping)
      let jsonStr = text.trim();
      if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
      }

      const parsed: AdaptiveResponse = JSON.parse(jsonStr);
      const validationError = validateResponse(parsed, body.phase);

      if (validationError) {
        if (attempt === 0) continue; // retry once
        return NextResponse.json(
          { error: `Validation failed: ${validationError}` },
          { status: 422 }
        );
      }

      // Truncate excess segments for phases with limits
      if (body.phase === 'TEACH' && parsed.segments.length > 2) {
        parsed.segments = parsed.segments.slice(0, 2);
      }
      if (body.phase === 'ASSESS' && parsed.segments.length > 4) {
        parsed.segments = parsed.segments.slice(0, 4);
      }

      return NextResponse.json(parsed);
    } catch (err) {
      if (attempt === 0) continue; // retry once
      console.error('Adaptive lesson API error:', err);
      return NextResponse.json(
        { error: 'Failed to generate adaptive content' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ error: 'Failed after retries' }, { status: 500 });
}
