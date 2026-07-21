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
  try {
    const ctx = await getMockReviewContext(mongoMockStores(), studentId, attemptId);
    return NextResponse.json(ctx);
  } catch (e) {
    const msg = (e as Error).message;
    const status = msg === 'not_found' ? 404 : msg === 'forbidden' ? 403 : msg === 'not_ready' ? 409 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
