/** Embed-token-gated homework DRAFT (Task 11, spec §C.3 continued). Same
 *  auth/identity shape as `practice-assign/route.ts`. Called mid-session as
 *  evidence accrues (`trigger` names why: e.g. `recurrence:<loId>`) — the
 *  record is written with `status: 'draft'` and is invisible to every
 *  student-facing/continuity read until `finalize/route.ts` promotes it. */
import { NextRequest, NextResponse } from 'next/server';
import { checkEmbedAuthAsync, partnerIdForInternalRoute, embedTokenRejectionReason } from '@/lib/tutor/portal/embed-token';
import { resolveProfileIdOrRaw } from '@/lib/tutor/student-profile/store';
import { assignPractice } from '@/lib/tutor/practice-assign/assign';
import { parseDraftBody } from '@/lib/tutor/practice-assign/route-bodies';

export const runtime = 'nodejs';

const DEFAULT_DRAFT_REASON = 'Your tutor noticed this needed more practice this session.';

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try { body = (await req.json()) as Record<string, unknown>; } catch { return NextResponse.json({ error: 'invalid JSON' }, { status: 400 }); }
  const token = req.headers.get('x-embed-token') ?? (typeof body.embedToken === 'string' ? body.embedToken : null);
  delete body.embedToken;
  const parsed = parseDraftBody(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const { studentId, sessionId, loIds, trigger, locator, lessonPlanId, courseId, subject } = parsed.value;
  const auth = await checkEmbedAuthAsync({ token, expectedStudentId: studentId, route: 'practice-assign/draft:POST' });
  if (!auth.allow) return NextResponse.json({ error: 'unauthorized', reason: auth.reason }, { status: 401 });
  const rejection = embedTokenRejectionReason(token, auth);
  if (rejection) return NextResponse.json({ error: 'unauthorized', reason: rejection }, { status: 401 });
  const partnerId = partnerIdForInternalRoute(auth);
  const profileId = await resolveProfileIdOrRaw({ partnerId, externalStudentId: studentId });
  try {
    const out = await assignPractice({
      profileId,
      partnerId,
      externalStudentId: studentId,
      sessionId,
      lessonPlanId,
      courseId,
      loIds,
      reason: DEFAULT_DRAFT_REASON,
      locator,
      subject,
      auto: true,
      status: 'draft',
      trigger,
    });
    if (!out) return new NextResponse(null, { status: 204 });
    console.log(`[practice-assign:draft] session=${sessionId} trigger=${trigger} los=${JSON.stringify(out.assigned)}`);
    return NextResponse.json({ assignmentId: out.assignmentId, status: out.status, los: out.assigned });
  } catch (e) {
    console.error('[practice-assign:draft] failed', e);
    return NextResponse.json({ error: 'draft_failed' }, { status: 500 });
  }
}
