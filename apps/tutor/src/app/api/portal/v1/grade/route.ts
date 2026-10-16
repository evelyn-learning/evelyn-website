/**
 * POST /api/portal/v1/grade — free-response grading (Phase 3(d)).
 * Rubric-bearing items score part-by-part; legacy expectedAnswer items use the
 * single-answer judge.
 */

import { NextResponse } from 'next/server';
import { withPortalAuth } from '@/lib/tutor/portal/auth';
import { GradeFreeResponseRequestSchema } from '@evelyn/portal-contract/v1';
import { gradeFreeResponse, defaultGradeDeps } from '@/lib/tutor/portal/grade-free-response';
import { resolveGradeItem } from '@/lib/tutor/portal/adapters';
import { collectGradeUsage, gradeUsageCost } from '@/lib/tutor/portal/grade-usage';
import { connectDB } from '@core/db';
import { PracticeGradeUsage } from '@/models/PracticeGradeUsage';

export const POST = withPortalAuth(async (_req, auth) => {
  const parsed = GradeFreeResponseRequestSchema.safeParse(auth.body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'bad_request', issues: parsed.error.issues }, { status: 400 });
  }
  const item = await resolveGradeItem(parsed.data.itemId);
  if (!item) return NextResponse.json({ error: 'not_found', reason: 'unknown itemId' }, { status: 404 });
  const { result, calls } = await collectGradeUsage(() => gradeFreeResponse(parsed.data, item, defaultGradeDeps()));
  if (calls.length > 0) {
    // Evelyn's own cost record; a failed write must never fail the grade.
    void connectDB()
      .then(() => PracticeGradeUsage.create({
        partnerId: auth.partnerId,
        studentId: parsed.data.studentId,
        itemId: parsed.data.itemId,
        calls: calls.length,
        models: [...new Set(calls.map((c) => c.model))],
        inputTokens: calls.reduce((t, c) => t + c.inputTokens, 0),
        outputTokens: calls.reduce((t, c) => t + c.outputTokens, 0),
        cacheReadTokens: calls.reduce((t, c) => t + c.cacheReadTokens, 0),
        cacheCreationTokens: calls.reduce((t, c) => t + c.cacheCreationTokens, 0),
        costUsd: gradeUsageCost(calls),
      }))
      .catch((err) => console.warn(`[grade] usage_record_failed ${String((err as Error)?.message ?? err).slice(0, 120)}`));
  }
  return NextResponse.json(result);
});
