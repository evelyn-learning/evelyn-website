// POST /api/tutor/pronunciation/assess — MEASURED pronunciation feedback on a
// word or sentence the learner repeats (GDI trial lesson, design §3).
//
// Body (JSON): { sessionId, referenceText, audio }   audio = base64 PCM16 LE,
// 24 kHz mono (the engine's mic tap), ≤ 1.5 MB decoded.
// Response 200: { status: 'ok', result: PronunciationResult, note }
//             | { status: 'unavailable', reason, note }
// `note` is formatPronunciationNote(...) — what the brain reads.
//
// Auth: the same as POST /api/tutor/session-audio — the session id is the
// capability. Here it must also name a TutorSession row, whose
// `sourcePartnerId` (embed token partner_id) decides the tenant gate.
// Gate: TUTOR_PRONUNCIATION_ASSESS flag AND the partner's `pronunciation`
// option (partner-session-options.ts; only gdi-demo today). Anything else —
// including an unknown session — is a 404, so other tenants cannot discover it.
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@core/db';
import { TutorSession } from '@/models';
import { TUTOR_PRONUNCIATION_ASSESS } from '@/lib/tutor/orchestrator/flags';
import { parseAssessBody, pronunciationRouteEnabled } from '@/lib/tutor/pronunciation/assess-request';
import { assessPronunciation, formatPronunciationNote } from '@/lib/tutor/pronunciation/assessor';

export const runtime = 'nodejs';

const notFound = () => NextResponse.json({ error: 'not found' }, { status: 404 });

export async function POST(request: NextRequest) {
  // Kill switch first: with the flag off the route does no work at all.
  if (!TUTOR_PRONUNCIATION_ASSESS) return notFound();

  // Everything before the tenant gate answers 404, so a caller outside the
  // gate cannot tell the route exists (not even from a 400).
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return notFound();
  }
  const sessionId = (body as { sessionId?: unknown } | null)?.sessionId;
  if (typeof sessionId !== 'string' || !sessionId.trim()) return notFound();

  await connectDB();
  const session = await TutorSession.findOne({ sessionId: sessionId.trim() })
    .select('sourcePartnerId')
    .lean<{ sourcePartnerId?: string } | null>();
  if (!session || !pronunciationRouteEnabled(TUTOR_PRONUNCIATION_ASSESS, session.sourcePartnerId)) return notFound();

  const parsed = parseAssessBody(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });

  const out = await assessPronunciation({ pcm16: parsed.pcm16, sampleRate: 24000, referenceText: parsed.referenceText });
  return NextResponse.json({ ...out, note: formatPronunciationNote(out, parsed.referenceText) });
}
