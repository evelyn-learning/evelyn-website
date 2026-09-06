/** Embed-token-gated homework FINALIZE (Task 11, spec §C.3 continued). Same
 *  auth/identity shape as `practice-assign/route.ts`. Called on any session
 *  exit (`close_tool` | `end` | `pagehide` | `time_cap`) to promote the
 *  session's draft to `status: 'assigned'` — see `finalizeDraft`. If no
 *  draft exists but a record for this session was already finalized
 *  (e.g. a race between two exit paths), that is reported back rather than
 *  treated as "nothing to finalize". */
import { NextRequest, NextResponse } from 'next/server';
import { checkEmbedAuthAsync, partnerIdForInternalRoute, embedTokenRejectionReason } from '@/lib/tutor/portal/embed-token';
import { resolveProfileIdOrRaw } from '@/lib/tutor/student-profile/store';
import { finalizeDraft, findAssignmentBySession, summarizeAssignmentLos } from '@/lib/tutor/practice-assign/store';
import { parseFinalizeBody } from '@/lib/tutor/practice-assign/route-bodies';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try { body = (await req.json()) as Record<string, unknown>; } catch { return NextResponse.json({ error: 'invalid JSON' }, { status: 400 }); }
  const token = req.headers.get('x-embed-token') ?? (typeof body.embedToken === 'string' ? body.embedToken : null);
  delete body.embedToken;
  const parsed = parseFinalizeBody(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const { studentId, sessionId, source, reason, nextTimeIntent, locator } = parsed.value;
  const auth = await checkEmbedAuthAsync({ token, expectedStudentId: studentId, route: 'practice-assign/finalize:POST' });
  if (!auth.allow) return NextResponse.json({ error: 'unauthorized', reason: auth.reason }, { status: 401 });
  const rejection = embedTokenRejectionReason(token, auth);
  if (rejection) return NextResponse.json({ error: 'unauthorized', reason: rejection }, { status: 401 });
  const partnerId = partnerIdForInternalRoute(auth);
  const profileId = await resolveProfileIdOrRaw({ partnerId, externalStudentId: studentId });
  try {
    // Fix round 1 (Important — ownership check) — scope both lookups to
    // `profileId` so a `sessionId` belonging to a different student is
    // indistinguishable from "no such session": see `store.ts`'s
    // `sessionScopeFilter` doc comment.
    const rec = await finalizeDraft(sessionId, { reason, nextTimeIntent, locator, source }, profileId);
    if (!rec) {
      const existing = await findAssignmentBySession(sessionId, profileId);
      if (existing && existing.status !== 'draft') {
        return NextResponse.json({
          assignmentId: existing._id,
          status: 'assigned',
          assigned: summarizeAssignmentLos(existing.los),
          alreadyFinalized: true,
        });
      }
      return new NextResponse(null, { status: 204 });
    }
    return NextResponse.json({ assignmentId: rec._id, status: 'assigned', assigned: summarizeAssignmentLos(rec.los) });
  } catch (e) {
    console.error('[practice-assign:finalize] failed', e);
    return NextResponse.json({ error: 'finalize_failed' }, { status: 500 });
  }
}
