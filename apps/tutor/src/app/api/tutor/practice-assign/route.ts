/** Embed-token-gated homework assignment (spec §C.2). Same auth/identity
 *  shape as mock-review-context/route.ts. Never throws to the client with
 *  a 500 for a resolvable-but-empty pool — 204 means "nothing to assign". */
import { NextRequest, NextResponse } from 'next/server';
import { checkEmbedAuthAsync, partnerIdForInternalRoute, embedTokenRejectionReason } from '@/lib/tutor/portal/embed-token';
import { resolveProfileIdOrRaw } from '@/lib/tutor/student-profile/store';
import { assignPractice } from '@/lib/tutor/practice-assign/assign';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try { body = (await req.json()) as Record<string, unknown>; } catch { return NextResponse.json({ error: 'invalid JSON' }, { status: 400 }); }
  const token = req.headers.get('x-embed-token') ?? (typeof body.embedToken === 'string' ? body.embedToken : null);
  delete body.embedToken;
  const studentId = typeof body.studentId === 'string' ? body.studentId : '';
  const sessionId = typeof body.sessionId === 'string' ? body.sessionId : '';
  const loIds = Array.isArray(body.loIds) ? body.loIds.filter((x): x is string => typeof x === 'string') : [];
  const reason = typeof body.reason === 'string' ? body.reason.trim().slice(0, 240) : '';
  if (!studentId || !sessionId || loIds.length === 0 || !reason) {
    return NextResponse.json({ error: 'studentId, sessionId, loIds[], reason required' }, { status: 400 });
  }
  const auth = await checkEmbedAuthAsync({ token, expectedStudentId: studentId, route: 'practice-assign:POST' });
  if (!auth.allow) return NextResponse.json({ error: 'unauthorized', reason: auth.reason }, { status: 401 });
  const rejection = embedTokenRejectionReason(token, auth);
  if (rejection) return NextResponse.json({ error: 'unauthorized', reason: rejection }, { status: 401 });
  const partnerId = partnerIdForInternalRoute(auth);
  const profileId = await resolveProfileIdOrRaw({ partnerId, externalStudentId: studentId });
  try {
    const out = await assignPractice({
      profileId, partnerId, externalStudentId: studentId, sessionId,
      lessonPlanId: typeof body.lessonPlanId === 'string' ? body.lessonPlanId : undefined,
      courseId: typeof body.courseId === 'string' ? body.courseId : undefined,
      loIds, reason,
      locator: typeof body.locator === 'string' && body.locator.trim() ? body.locator.trim().slice(0, 80) : undefined,
      nextTimeIntent: typeof body.nextTimeIntent === 'string' ? body.nextTimeIntent.trim().slice(0, 200) : undefined,
      subject: typeof body.subject === 'string' ? body.subject : undefined,
      auto: false,
    });
    if (!out) return new NextResponse(null, { status: 204 });
    console.log(`[practice-assign] session=${sessionId} assigned=${JSON.stringify(out.assigned)} locator=${body.locator ? 'yes' : 'no'}`);
    return NextResponse.json(out);
  } catch (e) {
    console.error('[practice-assign] failed', e);
    return NextResponse.json({ error: 'assign_failed' }, { status: 500 });
  }
}
