// POST /api/tutor/level/estimate — working-level estimate fallback (Task 14
// §G). Body: { sessionId, answers: string[], levels?: string[] }.
// 200 { status:'ok', level, evidence } | { status:'unavailable', reason }.
// 429 past the per-session call cap. Everything outside the gate is a 404
// (flags, live session, partner `levelCheck`) — see lib/tutor/level/estimate.ts.
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@core/db';
import { TutorSession } from '@/models';
import { TUTOR_WORKING_LEVEL, TUTOR_WORKING_LEVEL_ESTIMATE } from '@/lib/tutor/orchestrator/flags';
import { getModelClient, prepareParams } from '@/lib/tutor/ai/model-registry';
import { readBodyCapped } from '@/lib/tutor/pronunciation/assess-request';
import { handleLevelEstimate, LEVEL_ESTIMATE_MAX_BODY_BYTES } from '@/lib/tutor/level/estimate';

export const runtime = 'nodejs';

const notFound = () => NextResponse.json({ error: 'not found' }, { status: 404 });

export async function POST(request: NextRequest) {
  const enabled = TUTOR_WORKING_LEVEL_ESTIMATE && TUTOR_WORKING_LEVEL;
  if (!enabled) return notFound();
  const contentLength = request.headers.get('content-length');
  if (contentLength !== null && Number(contentLength) > LEVEL_ESTIMATE_MAX_BODY_BYTES) return notFound();
  let body: unknown;
  try {
    const text = await readBodyCapped(request.body, LEVEL_ESTIMATE_MAX_BODY_BYTES);
    if (text === null) return notFound();
    body = JSON.parse(text);
  } catch {
    return notFound();
  }
  const out = await handleLevelEstimate(body, {
    enabled,
    findSession: async (sessionId) => {
      await connectDB();
      return TutorSession.findOne({ sessionId })
        .select('sourcePartnerId status endedAt')
        .lean<{ sourcePartnerId?: string; status?: string; endedAt?: Date } | null>();
    },
    callModel: async ({ system, user, maxTokens, signal }) => {
      const { client, model } = getModelClient('brain');
      const msg = await client.messages.create(prepareParams('brain', {
        model,
        max_tokens: maxTokens,
        thinking: { type: 'disabled' as const },
        system,
        messages: [{ role: 'user' as const, content: user }],
      }), { signal });
      return msg.content.map((b) => (b.type === 'text' ? b.text : '')).join('').trim();
    },
  });
  if (out.status === 404) return notFound();
  return NextResponse.json(out.body, { status: out.status });
}
