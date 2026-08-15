/**
 * GET    /api/tutor/topic-notes/:studentId/:baselineId
 *   → Resolve baseline + student overlays into RenderedTopicNotes (Q8 layout).
 *     Returns 404 when no baseline is registered for the id.
 *
 * PATCH  /api/tutor/topic-notes/:studentId/:baselineId
 *   → Append a single overlay (theory expansion / method / pointer).
 *     Body: { bucket, input, sessionId }
 *     Returns AddOverlayResult { notes, overlay, status, reason? }.
 *
 * DELETE handler is at .../[overlayId]/route.ts.
 *
 * No auth in v1 — matches the existing student-profile commit endpoint
 * pattern. Add auth when retail launches.
 *
 * `baselineId` matches the corresponding lesson plan id (e.g.
 * `evelyn.ap.macro.loanable-funds-market.v1`). Next.js URL-decodes the
 * dotted segment automatically.
 */

import { NextRequest, NextResponse } from 'next/server';
import { resolveTopicNotes } from '@/lib/tutor/topic-notes/resolve';
import {
  expandTheoryOverlay,
  addMethodOverlay,
  addPointerOverlay,
  type ExpandTheoryInput,
  type AddMethodInput,
  type AddPointerInput,
} from '@/lib/tutor/topic-notes/apply-overlay';

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ studentId: string; baselineId: string }> },
) {
  const { studentId, baselineId } = await ctx.params;
  if (!studentId || !baselineId) {
    return NextResponse.json({ error: 'studentId and baselineId required' }, { status: 400 });
  }
  const rendered = await resolveTopicNotes(studentId, baselineId);
  if (!rendered) {
    return NextResponse.json({ error: 'baseline not found' }, { status: 404 });
  }
  return NextResponse.json(rendered);
}

interface PatchBodyTheory {
  bucket: 'theory';
  sessionId: string;
  input: Omit<ExpandTheoryInput, 'addedInSessionId'>;
}
interface PatchBodyMethod {
  bucket: 'methods';
  sessionId: string;
  input: Omit<AddMethodInput, 'addedInSessionId'>;
}
interface PatchBodyPointer {
  bucket: 'pointers';
  sessionId: string;
  input: Omit<AddPointerInput, 'addedInSessionId'>;
}
type PatchBody = PatchBodyTheory | PatchBodyMethod | PatchBodyPointer;

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ studentId: string; baselineId: string }> },
) {
  const { studentId, baselineId } = await ctx.params;
  if (!studentId || !baselineId) {
    return NextResponse.json({ error: 'studentId and baselineId required' }, { status: 400 });
  }

  let body: PatchBody;
  try {
    body = (await req.json()) as PatchBody;
  } catch {
    return NextResponse.json({ error: 'invalid JSON' }, { status: 400 });
  }
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'body must be an object' }, { status: 400 });
  }
  if (!body.sessionId) {
    return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
  }
  if (!body.bucket || !body.input) {
    return NextResponse.json({ error: 'bucket and input required' }, { status: 400 });
  }

  if (body.bucket === 'theory') {
    const result = await expandTheoryOverlay({
      studentId,
      baselineId,
      input: { ...body.input, addedInSessionId: body.sessionId },
    });
    return NextResponse.json(result, { status: statusForResult(result.status) });
  }
  if (body.bucket === 'methods') {
    const result = await addMethodOverlay({
      studentId,
      baselineId,
      input: { ...body.input, addedInSessionId: body.sessionId },
    });
    return NextResponse.json(result, { status: statusForResult(result.status) });
  }
  if (body.bucket === 'pointers') {
    const result = await addPointerOverlay({
      studentId,
      baselineId,
      input: { ...body.input, addedInSessionId: body.sessionId },
    });
    return NextResponse.json(result, { status: statusForResult(result.status) });
  }
  return NextResponse.json({ error: `unknown bucket: ${(body as { bucket?: unknown }).bucket}` }, { status: 400 });
}

/** Map AddOverlayResult.status to an HTTP status code. */
function statusForResult(
  status: 'added' | 'reinforced' | 'duplicate-of-baseline' | 'baseline-not-found' | 'invalid',
): number {
  if (status === 'added' || status === 'reinforced') return 200;
  if (status === 'duplicate-of-baseline') return 200; // semantically a no-op but caller can read .status
  if (status === 'baseline-not-found') return 404;
  if (status === 'invalid') return 400;
  return 200;
}
