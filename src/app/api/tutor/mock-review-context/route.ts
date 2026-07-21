/** Same-origin context fetch for mock-review embed sessions. Trust model
 *  matches the embed page itself (unsigned token today): the studentId in
 *  the query must own the attempt — getReview enforces that. */
import { NextRequest, NextResponse } from 'next/server';
import { mongoMockStores } from '@/lib/tutor/mock-exam/service';
import { getMockReviewContext } from '@/lib/tutor/mock-exam/review-context';

export async function GET(req: NextRequest) {
  const attemptId = req.nextUrl.searchParams.get('attemptId');
  const studentId = req.nextUrl.searchParams.get('studentId');
  if (!attemptId || !studentId) {
    return NextResponse.json({ error: 'attemptId and studentId are required' }, { status: 400 });
  }
  // Optional pinned-item ids: comma-separated, max 8, each ≤64 chars.
  // Invalid entries are dropped (degrade, never 400) — absent ⇒ no pins.
  const itemsParam = req.nextUrl.searchParams.get('items');
  const pinItemIds = itemsParam
    ? itemsParam.split(',').map((s) => s.trim()).filter((s) => s.length > 0 && s.length <= 64).slice(0, 8)
    : undefined;
  try {
    const ctx = await getMockReviewContext(mongoMockStores(), studentId, attemptId, pinItemIds);
    return NextResponse.json(ctx);
  } catch (e) {
    const msg = (e as Error).message;
    const status = msg === 'not_found' ? 404 : msg === 'forbidden' ? 403 : msg === 'not_ready' ? 409 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
