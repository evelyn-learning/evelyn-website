/** POST /api/portal/v1/material-summary (contract v1.20.0, round 4 E4): what an
 *  upload is about. HMAC like every portal route; extraction failures are the
 *  same 422 codes as plan-generate; a model failure is 502 summary_failed. */
import { NextResponse } from 'next/server';
import { withPortalAuth } from '@/lib/tutor/portal/auth';
import { MaterialSummaryRequestSchema, MaterialSummaryResponseSchema } from '@evelyn/portal-contract/v1';
import { extractMaterials } from '@/lib/tutor/lesson-plan/material-extract';
import { summarizeMaterial, defaultSummaryDeps, getSummaryClient } from '@/lib/tutor/lesson-plan/material-summary';

export const runtime = 'nodejs';

export const POST = withPortalAuth(async (_req, auth) => {
  const parsed = MaterialSummaryRequestSchema.safeParse(auth.body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_request', issues: parsed.error.issues }, { status: 400 });
  }
  const extracted = await extractMaterials(parsed.data.materials);
  if (!extracted.ok) {
    console.log(`[material-summary] partner=${auth.partnerId} extract=${extracted.code}`);
    return NextResponse.json({ error: extracted.code, message: extracted.message }, { status: 422 });
  }
  if (!extracted.combinedText.trim()) {
    console.log(`[material-summary] partner=${auth.partnerId} extract=empty`);
    return NextResponse.json({ error: 'extract_failed', message: 'Could not read any text in the attached files.' }, { status: 422 });
  }
  let summary = null;
  try {
    summary = await summarizeMaterial(extracted.combinedText, defaultSummaryDeps(getSummaryClient()));
  } catch (err) {
    // getSummaryClient() can throw (e.g. a missing key) — still a 502, never a 500.
    console.warn('[material-summary] client failed:', (err as Error)?.message ?? err);
  }
  const outcome = summary ? `ok subject=${JSON.stringify(summary.subject)}` : 'summary_failed';
  console.log(`[material-summary] partner=${auth.partnerId} files=${parsed.data.materials.length} chars=${extracted.combinedText.length} ${outcome}`);
  if (!summary) return NextResponse.json({ error: 'summary_failed' }, { status: 502 });
  return NextResponse.json(MaterialSummaryResponseSchema.parse(summary));
});
