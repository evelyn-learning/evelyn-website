/**
 * DELETE /api/tutor/topic-notes/:studentId/:baselineId/:overlayId?bucket=theory|methods|pointers
 *   → Remove a single overlay entry from the named bucket.
 *     Returns 404 when the overlayId isn't found in the bucket.
 *
 * For the v1 delete UI on the dedicated reading page (per Q8g).
 */

import { NextRequest, NextResponse } from 'next/server';
import { deleteOverlay, type OverlayBucket } from '@/lib/tutor/topic-notes/apply-overlay';

const VALID_BUCKETS: OverlayBucket[] = ['theory', 'methods', 'pointers'];

export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ studentId: string; baselineId: string; overlayId: string }> },
) {
  const { studentId, baselineId, overlayId } = await ctx.params;
  if (!studentId || !baselineId || !overlayId) {
    return NextResponse.json(
      { error: 'studentId, baselineId, overlayId required' },
      { status: 400 },
    );
  }
  const bucket = req.nextUrl.searchParams.get('bucket') as OverlayBucket | null;
  if (!bucket || !VALID_BUCKETS.includes(bucket)) {
    return NextResponse.json(
      { error: `bucket query param required, one of ${VALID_BUCKETS.join('|')}` },
      { status: 400 },
    );
  }
  const result = await deleteOverlay({ studentId, baselineId, overlayId, bucket });
  if (!result.deleted) {
    return NextResponse.json({ error: 'overlay not found' }, { status: 404 });
  }
  return NextResponse.json(result);
}
