/** Embed-token-gated homework STATE read (Task 11, spec §C.3 continued).
 *  Same auth/identity shape as `practice-assign/route.ts`. Lets the client
 *  poll whether THIS session already has a draft/assigned homework record
 *  (e.g. to render the "your tutor is assigning practice" indicator without
 *  waiting for a finalize round-trip). Body parsing is inline — just two
 *  required strings — so no pure helper is needed (see `route-bodies.ts`
 *  for the draft/finalize bodies, which are richer). */
import { NextRequest, NextResponse } from 'next/server';
import { checkEmbedAuthAsync, partnerIdForInternalRoute, embedTokenRejectionReason } from '@/lib/tutor/portal/embed-token';
import { resolveProfileIdOrRaw } from '@/lib/tutor/student-profile/store';
import { findAssignmentBySession, summarizeAssignmentLos } from '@/lib/tutor/practice-assign/store';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try { body = (await req.json()) as Record<string, unknown>; } catch { return NextResponse.json({ error: 'invalid JSON' }, { status: 400 }); }
  const token = req.headers.get('x-embed-token') ?? (typeof body.embedToken === 'string' ? body.embedToken : null);
  delete body.embedToken;
  const studentId = typeof body.studentId === 'string' ? body.studentId : '';
  const sessionId = typeof body.sessionId === 'string' ? body.sessionId : '';
  if (!studentId || !sessionId) return NextResponse.json({ error: 'studentId, sessionId required' }, { status: 400 });
  const auth = await checkEmbedAuthAsync({ token, expectedStudentId: studentId, route: 'practice-assign/state:POST' });
  if (!auth.allow) return NextResponse.json({ error: 'unauthorized', reason: auth.reason }, { status: 401 });
  const rejection = embedTokenRejectionReason(token, auth);
  if (rejection) return NextResponse.json({ error: 'unauthorized', reason: rejection }, { status: 401 });
  const partnerId = partnerIdForInternalRoute(auth);
  const profileId = await resolveProfileIdOrRaw({ partnerId, externalStudentId: studentId });
  try {
    // Fix round 1 (Important — ownership check) — scoped to `profileId` so
    // a `sessionId` belonging to a different student is indistinguishable
    // from "no such session": see `store.ts`'s `sessionScopeFilter` doc
    // comment.
    const rec = await findAssignmentBySession(sessionId, profileId);
    if (!rec) return new NextResponse(null, { status: 204 });
    return NextResponse.json({
      assignmentId: rec._id,
      status: rec.status ?? 'assigned',
      locator: rec.locator,
      los: summarizeAssignmentLos(rec.los),
    });
  } catch (e) {
    console.error('[practice-assign:state] failed', e);
    return NextResponse.json({ error: 'state_failed' }, { status: 500 });
  }
}
