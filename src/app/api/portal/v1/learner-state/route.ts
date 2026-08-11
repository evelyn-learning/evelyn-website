/**
 * GET/POST /api/portal/v1/learner-state — the read side of the learner
 * model (contract v1.12.0): per-LO estimate/confidence/trend, the same
 * staleness-filtered gaps the `gaps` route serves, a spaced-review due
 * count, and (when a `courseTopic` resolves to a scored exam) a projected
 * score band.
 *
 * GET reads query params (`studentId`, `loIds` as a comma-separated list or
 * repeated `loIds=` params, `courseTopic`); POST reads the same shape from
 * the JSON body. Both funnel into `LearnerStateRequestSchema`.
 *
 * Unknown/never-evidenced students are NOT a 404 — they get `los: []`,
 * `reviewDueCount: 0`, HTTP 200 (a portal building an Overview page for a
 * brand-new student shouldn't have to special-case the read). `trial:`
 * students never get evidence rows in the first place (`appendEvidence`
 * drops them, see `learner-model/store.ts`), so they're short-circuited to
 * the same empty `los`/`reviewDueCount` explicitly rather than relying on
 * that as an incidental consequence of empty query results.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { withPortalAuth } from '@/lib/tutor/portal/auth';
import {
  LearnerStateRequestSchema,
  LearnerStateResponseSchema,
  type LearnerLoState,
  type LearnerStateResponse,
} from '@evelyn/portal-contract/v1';
import connectDB from '@/lib/db';
import {
  EvidenceEventModel,
  LearnerStateProjectionModel,
  LearnerStateSnapshotModel,
  MockAttempt,
} from '@/models';
import { getOrCreateStudentProfile, isGapStale } from '@/lib/tutor/student-profile/store';
import { stripNullsDeep } from '@/lib/tutor/portal/serialize';
import { trendOf } from '@/lib/tutor/learner-model/estimator';
import { getBlueprint, type ScoringSpec } from '@/lib/tutor/mock-exam/blueprints';
import { projectScore, scaleForTopic, mapLoIdsToSections, type ProjectLo } from '@/lib/tutor/learner-model/projection';

const MS_PER_DAY = 86400000;

/** GET query params or POST body → the raw (unvalidated) request shape. */
function readRawRequest(req: NextRequest, body: unknown): unknown {
  if (req.method !== 'GET') return body;
  const sp = new URL(req.url).searchParams;
  const loIdsAll = sp.getAll('loIds');
  const loIds =
    loIdsAll.length === 0
      ? undefined
      : loIdsAll.length === 1
        ? loIdsAll[0].split(',').map((s) => s.trim()).filter(Boolean)
        : loIdsAll;
  return {
    studentId: sp.get('studentId') ?? undefined,
    ...(loIds ? { loIds } : {}),
    ...(sp.get('courseTopic') ? { courseTopic: sp.get('courseTopic') } : {}),
  };
}

/** examKey to look the blueprint up under, for a resolved projection scale.
 *  'ap' reuses the courseTopic verbatim — AP blueprint examKeys ARE the
 *  course topic string (e.g. 'ap-statistics'). null for 'readiness' (no
 *  exam curve applies) and the (should-be-unreachable) default case. */
function examKeyForScale(scale: ReturnType<typeof scaleForTopic>, courseTopic: string | undefined): string | null {
  if (scale === 'sat') return 'digital-sat';
  if (scale === 'act') return 'act';
  if (scale === 'ap') return courseTopic ?? null;
  return null;
}

async function handle(req: NextRequest, auth: { body: unknown }): Promise<Response> {
  const parsed = LearnerStateRequestSchema.safeParse(readRawRequest(req, auth.body));
  if (!parsed.success) {
    return NextResponse.json({ error: 'bad_request', issues: parsed.error.issues }, { status: 400 });
  }
  const { studentId, loIds, courseTopic } = parsed.data;
  const now = new Date();

  // Gaps mirror gaps/route.ts exactly (same staleness filter) and work for
  // trial: ids too — getOrCreateStudentProfile falls back to its in-memory
  // ephemeral store, never throws. stripNullsDeep is scoped to `gaps` only
  // (persisted/legacy null-valued *optional* gap fields need to go absent to
  // parse) — it must NOT touch `los`, whose `estimate` is nullable-but-
  // required: stripping a null estimate would make the field go missing and
  // fail the contract parse below instead of passing it.
  const profile = await getOrCreateStudentProfile(studentId);
  const gaps = stripNullsDeep(profile.gaps.filter((g) => !isGapStale(g)));

  if (studentId.startsWith('trial:')) {
    // Trial sessions never write learner-model rows (appendEvidence drops
    // trial: ids before any write) — los/reviewDueCount are explicitly empty
    // rather than an incidental empty-query result.
    const body: LearnerStateResponse = { los: [], gaps, reviewDueCount: 0 };
    return NextResponse.json(LearnerStateResponseSchema.parse(body));
  }

  await connectDB();

  const projQuery: Record<string, unknown> = { studentId };
  if (loIds && loIds.length > 0) projQuery.loId = { $in: loIds };
  const projections = await LearnerStateProjectionModel.find(projQuery).lean();
  const projByLoId = new Map(projections.map((p) => [p.loId, p]));

  // Requested LOs (loIds given) get an entry each even with no evidence yet
  // (estimate: null — "known LO, nothing observed"); with no loIds, we only
  // have whatever projections already exist for the student.
  const effectiveLoIds = loIds && loIds.length > 0 ? loIds : projections.map((p) => p.loId);

  // trend: against the snapshot dated >= 14 days ago (most recent such row);
  // none → 'flat' (trendOf's own null-handling).
  const cutoffDate = new Date(now.getTime() - 14 * MS_PER_DAY).toISOString().slice(0, 10);
  const priorSnapshot = await LearnerStateSnapshotModel.findOne({ studentId, date: { $lte: cutoffDate } })
    .sort({ date: -1 })
    .lean();
  const priorByLoId = new Map((priorSnapshot?.los ?? []).map((l) => [l.loId, l.estimate]));

  const losOut: LearnerLoState[] = effectiveLoIds.map((loId) => {
    const p = projByLoId.get(loId);
    const estimate = p ? p.estimate : null;
    return {
      loId,
      estimate,
      confidence: p ? p.confidence : 'low',
      trend: trendOf(estimate, priorByLoId.get(loId)),
      nEff: p ? p.nEff : 0,
      ...(p?.reviewDueAt ? { reviewDueAt: p.reviewDueAt.toISOString() } : {}),
      ...(p?.lastEvidenceAt ? { lastEvidenceAt: p.lastEvidenceAt.toISOString() } : {}),
    };
  });

  const reviewDueCount = projections.filter((p) => p.reviewDueAt && p.reviewDueAt.getTime() <= now.getTime()).length;

  let projection: LearnerStateResponse['projection'];
  if (losOut.length > 0) {
    let scale = scaleForTopic(courseTopic);
    const examKey = examKeyForScale(scale, courseTopic);

    let curves: ScoringSpec | undefined;
    let losForProjection: ProjectLo[] = losOut.map((l) => ({
      loId: l.loId,
      estimate: l.estimate,
      confidence: l.confidence,
    }));
    let mockAnchors: Array<{ composite: number; at: Date }> | undefined;

    // Unregistered/unknown blueprint for this examKey — fall back to a
    // readiness-shaped band rather than mixing a 0-100 mastery center with a
    // scaled-exam band half-width. Only the lookup itself is guarded; a
    // failure in the DB reads below this should surface as a real 500, not
    // get silently reinterpreted as "no blueprint".
    const blueprint = examKey ? (() => { try { return getBlueprint(examKey); } catch { return null; } })() : null;
    if (!blueprint) scale = 'readiness';

    if (blueprint) {
      curves = blueprint.scoring;

      const mockRows = await EvidenceEventModel.find({ studentId, source: 'mock', sectionId: { $exists: true } })
        .select('loId sectionId occurredAt')
        .lean();
      const sectionMap = mapLoIdsToSections(
        effectiveLoIds,
        mockRows,
        blueprint.sections.map((s) => s.sectionId),
      );
      losForProjection = losForProjection.map((l) => ({ ...l, sectionId: sectionMap.get(l.loId) }));

      const attempts = await MockAttempt.find({ studentId, examKey, status: 'completed', scaled: { $exists: true } })
        .sort({ completedAt: -1 })
        .limit(5)
        .lean();
      if (attempts.length > 0) {
        mockAnchors = attempts.map((a) => ({
          composite: a.scaled!.composite,
          at: a.completedAt ?? a.updatedAt,
        }));
      }
    }

    const result = projectScore({ scale, los: losForProjection, curves, mockAnchors, now });
    projection = { scale, low: result.low, high: result.high, basis: result.basis, asOf: now.toISOString() };
  }

  const body: LearnerStateResponse = {
    los: losOut,
    gaps,
    reviewDueCount,
    ...(projection ? { projection } : {}),
  };

  return NextResponse.json(LearnerStateResponseSchema.parse(body));
}

export const GET = withPortalAuth(handle);
export const POST = withPortalAuth(handle);
