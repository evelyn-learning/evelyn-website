/**
 * POST /api/portal/v1/taxonomy-generate — draft a learning-objective graph
 * from an operator-supplied exam/certification content outline.
 * Stateless; nothing is persisted engine-side (see taxonomy-generate.ts).
 */

import { NextResponse } from 'next/server';
import { withPortalAuth } from '@/lib/tutor/portal/auth';
import { TaxonomyGenerateRequestSchema, TaxonomyGenerateResponseSchema } from '@evelyn/portal-contract/v1';
import { draftTaxonomyFromOutline } from '@/lib/tutor/lesson-plan/taxonomy-generate';

export const runtime = 'nodejs';
export const maxDuration = 120;

export const POST = withPortalAuth(async (_req, auth) => {
  const parsed = TaxonomyGenerateRequestSchema.safeParse(auth.body);
  if (!parsed.success) return NextResponse.json({ error: 'bad_request', issues: parsed.error.issues }, { status: 400 });
  const result = await draftTaxonomyFromOutline(parsed.data);
  if (!result.ok) return NextResponse.json({ error: 'extraction_failed', code: result.code, message: result.message }, { status: result.status });
  return NextResponse.json(TaxonomyGenerateResponseSchema.parse({ taxonomy: result.taxonomy, generatorOk: result.generatorOk }));
});
