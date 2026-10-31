// POST /api/tutor/pronunciation/assess — MEASURED pronunciation feedback on a
// word or sentence the learner repeats (GDI trial lesson, design §3).
//
// Body (JSON): { sessionId, referenceText, audio }   audio = base64 PCM16 LE,
// 24 kHz mono (the engine's mic tap), ≤ 1.5 MB decoded.
// Response 200: { status: 'ok', result: PronunciationResult, note, measured }
//             | { status: 'unavailable', reason, note, measured: false }
// `measured` false on an 'ok' result ⇒ the learner did not say the target.
// `note` is formatPronunciationNote(...) — what the brain reads.
//
// 429 { status:'unavailable', reason:'vendor_error', note } past the
// per-session call cap (40 per process, ~2 h window).
//
// Auth: the same as POST /api/tutor/session-audio — the session id is the
// capability. Here it must also name a LIVE TutorSession row (status 'active',
// no endedAt), whose
// `sourcePartnerId` (embed token partner_id) decides the tenant gate.
// Gate: TUTOR_PRONUNCIATION_ASSESS flag AND the partner's `pronunciation`
// option (partner-session-options.ts; only gdi-demo today). Anything else —
// including an unknown session — is a 404, so other tenants cannot discover it.
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@core/db';
import { TutorSession } from '@/models';
import { TUTOR_PRONUNCIATION_ASSESS } from '@/lib/tutor/orchestrator/flags';
import {
  CallBudget,
  MAX_REQUEST_BYTES,
  parseAssessBody,
  readBodyCapped,
  pronunciationRouteEnabled,
  sessionAllowsAssess,
} from '@/lib/tutor/pronunciation/assess-request';
import { assessPronunciation, formatPronunciationNote, isMeasuredResult, PRONUNCIATION_UNAVAILABLE_NOTE } from '@/lib/tutor/pronunciation/assessor';

export const runtime = 'nodejs';

// Spend control: at most MAX_ASSESS_CALLS_PER_SESSION vendor calls per
// session per process (entries expire after ~2 h).
const budget = new CallBudget();

const notFound = () => NextResponse.json({ error: 'not found' }, { status: 404 });

export async function POST(request: NextRequest) {
  // Kill switch first: with the flag off the route does no work at all.
  if (!TUTOR_PRONUNCIATION_ASSESS) return notFound();

  // Everything before the tenant gate answers 404, so a caller outside the
  // gate cannot tell the route exists (not even from a 400).
  // Never parse a body larger than the biggest valid one. With a
  // Content-Length the header decides; without one (chunked) the stream is
  // read with the same byte cap BEFORE any JSON parsing.
  const contentLength = request.headers.get('content-length');
  if (contentLength !== null && Number(contentLength) > MAX_REQUEST_BYTES) return notFound();
  let body: unknown;
  try {
    if (contentLength !== null) {
      body = await request.json();
    } else {
      const text = await readBodyCapped(request.body, MAX_REQUEST_BYTES);
      if (text === null) return notFound();
      body = JSON.parse(text);
    }
  } catch {
    return notFound();
  }
  const sessionId = (body as { sessionId?: unknown } | null)?.sessionId;
  if (typeof sessionId !== 'string' || !sessionId.trim()) return notFound();

  await connectDB();
  const session = await TutorSession.findOne({ sessionId: sessionId.trim() })
    .select('sourcePartnerId status endedAt')
    .lean<{ sourcePartnerId?: string; status?: string; endedAt?: Date } | null>();
  // Ended sessions are closed too: an old sessionId must not stay a key.
  if (!session || !sessionAllowsAssess(session) || !pronunciationRouteEnabled(TUTOR_PRONUNCIATION_ASSESS, session.sourcePartnerId)) {
    return notFound();
  }

  const parsed = parseAssessBody(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });

  if (!budget.take(parsed.sessionId)) {
    // Same shape as any unavailable result, so the client path stays uniform.
    return NextResponse.json({ status: 'unavailable', reason: 'vendor_error', note: PRONUNCIATION_UNAVAILABLE_NOTE, measured: false }, { status: 429 });
  }

  const out = await assessPronunciation({ pcm16: parsed.pcm16, sampleRate: 24000, referenceText: parsed.referenceText });
  // `measured` is false for an 'ok' result that was not an attempt at the
  // reference text (isMeasuredResult) — the client keeps the claim guard shut.
  const measured = isMeasuredResult(out);
  // Task 24 §A3 (GDI run 12: two silent clips read "not attempted"): what the
  // vendor heard, for the server log only — no audio, no key, no session text.
  if (out.status === 'ok' && !measured) {
    const r = out.result;
    const omitted = r.words.filter((w) => w.errorType === 'omission').length;
    console.warn(`[pronunciation] not_attempted display="${(r.display ?? '').slice(0, 120)}" completeness=${r.completeness ?? 'n/a'} omitted=${omitted}/${r.words.length} latency=${r.latencyMs}ms`);
  }
  return NextResponse.json({ ...out, note: formatPronunciationNote(out, parsed.referenceText), measured });
}
