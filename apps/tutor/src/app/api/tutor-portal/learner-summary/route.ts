import { NextRequest, NextResponse } from 'next/server';
import { verifyEmbedTokenAsync, type EmbedTokenPayload } from '@/lib/tutor/portal/embed-token';
import {
  activeSummaryStoreDeps, isSummaryRefusal, runSummaryForSession, summaryRefusal, summaryStateOf,
  type SummaryRefusal, type SummaryState, type SummaryStoreDeps,
} from '@/lib/tutor/portal/learner-summary-store';
import { signReplayToken, replayUrl, type ReplayTokenPayload } from '@/lib/tutor/portal/replay-token';

/**
 * GET/POST /api/tutor-portal/learner-summary — the learner's own session summary
 * (GDI learner home, task 4).
 *
 * Auth: an embed token (header `x-embed-token`; GET also `?token=`, POST also
 * body `embedToken`) that carries a `student_id`. The session must match
 * `sourcePartnerId = token.partner_id` AND `studentId = token.student_id`
 * before anything else happens (no claim, no model call, no replay token).
 *
 * GET reads the current state. POST runs `runSummaryForSession` and waits up
 * to 20 s; on timeout it answers the current state while generation continues.
 * Response: `{ state, replayUrl, hasAudio }`.
 *
 * After scoping, both verbs refuse with 403 when the session gets no summary:
 * `learner_summary_disabled` (TUTOR_LEARNER_SUMMARY=off), `learner_summary_unsupported`
 * (not a `languages` lesson), `session_too_short` (< 4 turns). The end panel
 * falls back to the plain "Session Complete" card on 401/403.
 */
const POST_WAIT_MS = 20_000;

const REFUSAL_ERROR: Record<SummaryRefusal, string> = {
  disabled: 'learner_summary_disabled',
  unsupported: 'learner_summary_unsupported',
  too_short: 'session_too_short',
};
function refuse(r: SummaryRefusal) {
  return NextResponse.json({ error: REFUSAL_ERROR[r] }, { status: 403 });
}

type Loaded = NonNullable<Awaited<ReturnType<SummaryStoreDeps['loadSession']>>>;
type Scoped =
  | { ok: true; payload: EmbedTokenPayload & { student_id: string }; session: Loaded; deps: SummaryStoreDeps }
  | { ok: false; res: NextResponse };

async function scope(token: string | null, sessionId: unknown): Promise<Scoped> {
  const v = await verifyEmbedTokenAsync(token);
  if (!v.ok) return { ok: false, res: NextResponse.json({ error: 'unauthorized', reason: v.reason }, { status: 401 }) };
  // A replay token is signed with the same partner secret; it must not stand in
  // for an embed token here (it would mint itself fresh 30-day replay links).
  if (v.payload.mode === 'replay') {
    return { ok: false, res: NextResponse.json({ error: 'unauthorized', reason: 'replay_token_not_accepted' }, { status: 401 }) };
  }
  const studentId = v.payload.student_id;
  if (typeof studentId !== 'string' || !studentId) {
    return { ok: false, res: NextResponse.json({ error: 'unauthorized', reason: 'student_id_required' }, { status: 401 }) };
  }
  if (typeof sessionId !== 'string' || !sessionId) {
    return { ok: false, res: NextResponse.json({ error: 'bad_request', reason: 'sessionId_required' }, { status: 400 }) };
  }
  const deps = activeSummaryStoreDeps();
  const session = await deps.loadSession(sessionId);
  if (!session) return { ok: false, res: NextResponse.json({ error: 'not_found' }, { status: 404 }) };
  if (session.sourcePartnerId !== v.payload.partner_id || session.studentId !== studentId) {
    return { ok: false, res: NextResponse.json({ error: 'forbidden' }, { status: 403 }) };
  }
  return { ok: true, payload: { ...v.payload, student_id: studentId }, session, deps };
}

function requestOrigin(req: NextRequest): string {
  const host = req.headers.get('host');
  if (host) {
    const proto = (req.headers.get('x-forwarded-proto') ?? '').split(',')[0].trim() || new URL(req.url).protocol.replace(/:$/, '');
    return `${proto}://${host}`;
  }
  return new URL(req.url).origin;
}

async function respond(req: NextRequest, s: Extract<Scoped, { ok: true }>, state: SummaryState) {
  const b = s.payload.branding;
  const branding = b && typeof b === 'object' && !Array.isArray(b) ? (b as ReplayTokenPayload['branding']) : undefined;
  let url: string | null = null;
  try {
    const t = await signReplayToken({
      partner_id: s.payload.partner_id, student_id: s.payload.student_id, session_id: s.session.sessionId,
      ...(branding ? { branding } : {}),
    });
    if (t) url = replayUrl(t, requestOrigin(req));
  } catch (err) {
    console.warn('[learner-summary] replay token mint failed', (err as Error)?.message);
  }
  return NextResponse.json({ state, replayUrl: url, hasAudio: !!s.session.hasAudio });
}

export async function GET(req: NextRequest) {
  const u = new URL(req.url);
  const token = req.headers.get('x-embed-token') ?? u.searchParams.get('token');
  const s = await scope(token, u.searchParams.get('sessionId'));
  if (!s.ok) return s.res;
  const refusal = summaryRefusal(s.session);
  if (refusal) return refuse(refusal);
  return respond(req, s, summaryStateOf(s.session.learnerSummary));
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    const parsed = await req.json();
    body = parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return NextResponse.json({ error: 'bad_request', reason: 'invalid_json' }, { status: 400 });
  }
  const token = req.headers.get('x-embed-token') ?? (typeof body.embedToken === 'string' ? body.embedToken : null);
  const s = await scope(token, body.sessionId);
  if (!s.ok) return s.res;
  const refusal = summaryRefusal(s.session);
  if (refusal) return refuse(refusal);

  const sessionId = s.session.sessionId;
  const run = runSummaryForSession(sessionId, s.deps);
  run.catch((e) => console.warn('[learner-summary] generate failed', sessionId, (e as Error)?.message));
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<null>((resolve) => { timer = setTimeout(() => resolve(null), POST_WAIT_MS); });
  let state: SummaryState | null;
  try {
    const r = await Promise.race([run, timeout]);
    if (r && isSummaryRefusal(r)) return refuse(r.status);
    state = r;
  } catch {
    state = null;
  } finally {
    if (timer) clearTimeout(timer);
  }
  if (!state) {
    const cur = await s.deps.loadSession(sessionId);
    state = summaryStateOf(cur?.learnerSummary);
  }
  return respond(req, s, state);
}
