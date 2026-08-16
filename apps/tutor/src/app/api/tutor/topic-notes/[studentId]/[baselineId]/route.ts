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
 * M1c Task 5 (fix round 2, CRITICAL A / spec §4.0; corrected fix round 3,
 * CRITICAL A1) — gained embed-token verification, but it NEVER gates the
 * request: this route previously had no auth at all ("Add auth when retail
 * launches" — the old text of this comment), and `/tutor/dev/notes` is a
 * genuinely retail/dev surface with no embed token. `checkEmbedAuth` runs
 * only to extract a verified `partner_id` when a token IS present and
 * valid; an absent or failed-verification token falls back to `'evelyn'`
 * (see `partnerIdForInternalRoute`'s doc comment) rather than 401ing —
 * requiring a token here would have broken retail traffic the moment
 * `EMBED_TOKEN_ENFORCE` is turned on, independent of the identity flag.
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
import { resolveProfileIdOrRaw } from '@/lib/tutor/student-profile/store';
import { checkEmbedAuth, partnerIdForInternalRoute } from '@/lib/tutor/portal/embed-token';

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ studentId: string; baselineId: string }> },
) {
  const { studentId, baselineId } = await ctx.params;
  if (!studentId || !baselineId) {
    return NextResponse.json({ error: 'studentId and baselineId required' }, { status: 400 });
  }
  const auth = checkEmbedAuth({
    token: req.headers.get('x-embed-token'),
    expectedStudentId: studentId,
    route: 'topic-notes:GET',
  });
  const profileId = await resolveProfileIdOrRaw({ partnerId: partnerIdForInternalRoute(auth), externalStudentId: studentId });
  const rendered = await resolveTopicNotes(profileId, baselineId);
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

  const auth = checkEmbedAuth({
    token: req.headers.get('x-embed-token'),
    expectedStudentId: studentId,
    route: 'topic-notes:PATCH',
  });

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

  const profileId = await resolveProfileIdOrRaw({ partnerId: partnerIdForInternalRoute(auth), externalStudentId: studentId });

  if (body.bucket === 'theory') {
    const result = await expandTheoryOverlay({
      studentId: profileId,
      baselineId,
      input: { ...body.input, addedInSessionId: body.sessionId },
    });
    return NextResponse.json(result, { status: statusForResult(result.status) });
  }
  if (body.bucket === 'methods') {
    const result = await addMethodOverlay({
      studentId: profileId,
      baselineId,
      input: { ...body.input, addedInSessionId: body.sessionId },
    });
    return NextResponse.json(result, { status: statusForResult(result.status) });
  }
  if (body.bucket === 'pointers') {
    const result = await addPointerOverlay({
      studentId: profileId,
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
