/** Same-origin context fetch for mock-review embed sessions.
 *
 * M1c Task 5 (fix round 2, CRITICAL B / spec §4.0; corrected fix round 3,
 * CRITICAL A1; corrected fix round 4, spec §4.0 refinement) — gained
 * embed-token verification. `getReview`'s ownership check
 * (`attempt.studentId !== studentId`) now compares two RESOLVED ids once
 * the identity flag is on (the MockAttempt was created via the
 * portal-authed `/api/portal/v1/mock/attempts` route, under
 * `auth.partnerId`) — the raw query-param `studentId` here must resolve to
 * that SAME id, under the SAME partner, or every mock-review-in-embed
 * request would 403. Resolving under the embed token's verified
 * `partner_id` claim (not a hardcoded `'evelyn'`) is what makes that match
 * — see `partnerIdForInternalRoute`'s doc comment. An absent token falls
 * back to `'evelyn'`, never 401ing; a PRESENT token that fails
 * verification 401s instead of silently misattributing — see
 * `embedTokenRejectionReason`'s doc comment. */
import { NextRequest, NextResponse } from 'next/server';
import { mongoMockStores } from '@/lib/tutor/mock-exam/service';
import { getMockReviewContext } from '@/lib/tutor/mock-exam/review-context';
import { resolveProfileIdOrRaw } from '@/lib/tutor/student-profile/store';
import { checkEmbedAuth, partnerIdForInternalRoute, embedTokenRejectionReason } from '@/lib/tutor/portal/embed-token';

export async function GET(req: NextRequest) {
  const attemptId = req.nextUrl.searchParams.get('attemptId');
  const studentId = req.nextUrl.searchParams.get('studentId');
  if (!attemptId || !studentId) {
    return NextResponse.json({ error: 'attemptId and studentId are required' }, { status: 400 });
  }
  const token = req.headers.get('x-embed-token');
  const auth = checkEmbedAuth({
    token,
    expectedStudentId: studentId,
    route: 'mock-review-context:GET',
  });
  const rejection = embedTokenRejectionReason(token, auth);
  if (rejection) {
    console.error('[mock-review-context:GET] embed token present but invalid:', rejection);
    return NextResponse.json({ error: 'unauthorized', reason: rejection }, { status: 401 });
  }
  // Optional pinned-item ids: comma-separated, max 8, each ≤64 chars.
  // Invalid entries are dropped (degrade, never 400) — absent ⇒ no pins.
  const itemsParam = req.nextUrl.searchParams.get('items');
  const pinItemIds = itemsParam
    ? itemsParam.split(',').map((s) => s.trim()).filter((s) => s.length > 0 && s.length <= 64).slice(0, 8)
    : undefined;
  try {
    const profileId = await resolveProfileIdOrRaw({ partnerId: partnerIdForInternalRoute(auth), externalStudentId: studentId });
    const ctx = await getMockReviewContext(mongoMockStores(), profileId, attemptId, pinItemIds);
    return NextResponse.json(ctx);
  } catch (e) {
    const msg = (e as Error).message;
    const status = msg === 'not_found' ? 404 : msg === 'forbidden' ? 403 : msg === 'not_ready' ? 409 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
