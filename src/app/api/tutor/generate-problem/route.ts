/**
 * Adaptive-pacing v1 — generate_problem dispatch endpoint.
 *
 * Wraps `generateProblem` from src/lib/tutor/voice/problem-generator.ts.
 * Called from the React component when the brain emits a `generate_problem`
 * tool call; the result feeds back into the brain's next agent-loop
 * iteration as a tool_result so the brain can quote the canonical text
 * verbatim and issue show_problem with it.
 *
 * Phase 1 scaffold: Layer 2 (brain-gen + verifier) returns null today,
 * so this endpoint resolves via Layer 1 (bank, currently empty for all
 * topics) → Layer 4 (plan-authored try-yourself fallback). The full
 * brain-gen + Sonnet-verify pipeline lands in Phase 2.
 *
 * Telemetry: every call emits a PipelineTelemetry record (logged for
 * v1; will feed the auto-promotion job later).
 */
import { NextRequest } from 'next/server';
import { getLessonPlan } from '@/lib/tutor/lesson-plan/store';
import {
  generateProblem,
  type Difficulty,
  type GenerateProblemInput,
} from '@/lib/tutor/voice/problem-generator';

export const runtime = 'nodejs';

interface GenerateProblemRequestBody {
  planId: string;
  topic: string;
  difficulty: Difficulty;
  anchor: {
    statement: string;
    expectedAnswer?: string;
    difficulty?: 1 | 2 | 3 | 4;
  };
  excludeIds?: string[];
  excludeHashes?: string[];
}

export async function POST(req: NextRequest) {
  let body: GenerateProblemRequestBody;
  try {
    body = (await req.json()) as GenerateProblemRequestBody;
  } catch {
    return Response.json({ error: 'invalid_json' }, { status: 400 });
  }

  if (!body.planId || !body.topic || !body.difficulty || !body.anchor?.statement) {
    return Response.json(
      { error: 'missing_required_fields', required: ['planId', 'topic', 'difficulty', 'anchor.statement'] },
      { status: 400 }
    );
  }

  const plan = await getLessonPlan(body.planId);
  if (!plan) {
    return Response.json({ error: 'plan_not_found', planId: body.planId }, { status: 404 });
  }

  const input: GenerateProblemInput = {
    planId: body.planId,
    plan,
    topic: body.topic,
    difficulty: body.difficulty,
    anchor: body.anchor,
    excludeIds: body.excludeIds,
    excludeHashes: body.excludeHashes,
  };

  try {
    const { result, telemetry } = await generateProblem(input);
    if (!result) {
      return Response.json(
        { error: 'no_problem_available', telemetry },
        { status: 503 }
      );
    }
    // Log telemetry server-side so the auto-promotion sweep job can
    // read it. (Phase 1: console only; Phase 3 wires to a metrics
    // collection.)
    console.log('[generate-problem] telemetry:', JSON.stringify(telemetry));
    return Response.json({ problem: result, telemetry });
  } catch (err) {
    console.error('[generate-problem] pipeline error:', err);
    return Response.json(
      { error: 'pipeline_error', message: err instanceof Error ? err.message : 'unknown' },
      { status: 500 }
    );
  }
}
