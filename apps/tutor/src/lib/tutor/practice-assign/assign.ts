/**
 * assignPractice — shared server helper for homework assignment (spec
 * §C.2-C.3). Used by BOTH the practice-assign route (brain-tool-driven,
 * `auto: false`) and the commit-time fallback in
 * student-profile/[id]/route.ts (`auto: true`). Resolves items via
 * `resolveAssignmentItems` (which never generates — see resolve.ts) and
 * upserts one PracticeAssignment record per session.
 */
import connectDB from '@core/db';
import { EvidenceEventModel } from '@/models';
import { getLessonPlan } from '@/lib/tutor/lesson-plan/store';
import { mongoPracticeSources } from '@/lib/tutor/portal/adapters';
import { getLearnerHints } from '@/lib/tutor/learner-model/hints';
import { getPartner, type PartnerRecord } from '@/lib/tutor/portal/registry';
import { resolveFlag, type FlagCarrier } from '@/lib/tutor/portal/flags';
import { resolveAssignmentItems, ASSIGN_TUNING } from './resolve';
import { upsertAssignment, upsertDraft, summarizeAssignmentLos } from './store';
import { topUpPractice, PRACTICE_TARGET, type TopUpInput } from './top-up';

const MAX_LOS = 2;

/**
 * capForPartner — resolves a partner's `practice_assign_cap` flag override
 * to a safe integer cap. Pure (no Mongo), so it is unit-testable directly
 * (see scripts/test-practice-assign.ts).
 *
 * Operator contract: the override takes effect only when it is an integer
 * ≥ 1 (a number, or a numeric string — the registry round-trips it as
 * either depending on how it was written). Anything else — a boolean
 * (`true`/`false`, including `Number(true) === 1`), an empty string, `"0"`
 * or `0`, a fraction like `2.5`, or an unparsable string — is REJECTED: the
 * request falls back to `ASSIGN_TUNING.cap` and a `console.warn` names the
 * partner id and the rejected raw value (once per call). A valid override
 * above `ASSIGN_TUNING.cap` is clamped DOWN to it here — this is the one
 * place that clamp happens; `resolveAssignmentItems`'s own `Math.min`
 * (resolve.ts) is a second, redundant line of defense over the same
 * already-clamped value, not the authoritative one — so the observable
 * assigned-item total can never exceed `ASSIGN_TUNING.cap` regardless of
 * what a partner's `flagOverrides` row contains.
 *
 * Change takes effect after the registry's in-process cache TTL (60s),
 * an explicit `invalidatePartner()` call, or a process restart — same as
 * any other `flagOverrides` read (see portal/registry.ts). GreenApple = 3.
 */
export function capForPartner(partner: (FlagCarrier & { partnerId?: string }) | null): number {
  const rawCap = resolveFlag('practice_assign_cap', partner, ASSIGN_TUNING.cap);
  // `typeof … === 'boolean'` must be checked before `Number(...)`: `Number(true)`
  // is `1` and `Number(false)` is `0`, both of which would otherwise slip past
  // the integer/≥1 check below as if they were legitimate numeric overrides.
  const numericCap = typeof rawCap === 'boolean' ? NaN : Number(rawCap);
  if (!Number.isInteger(numericCap) || numericCap < 1) {
    console.warn(
      `[practice-assign] partner '${partner?.partnerId ?? '(unknown)'}' — practice_assign_cap override rejected (must be an integer ≥ 1, as a number or numeric string): ${JSON.stringify(rawCap)}; using default cap ${ASSIGN_TUNING.cap}`,
    );
    return ASSIGN_TUNING.cap;
  }
  return Math.min(numericCap, ASSIGN_TUNING.cap);
}

export async function assignPractice(input: {
  profileId: string;
  partnerId: string;
  externalStudentId: string;
  sessionId: string;
  lessonPlanId?: string;
  courseId?: string;
  loIds: string[];
  reason: string;
  locator?: string;
  nextTimeIntent?: string;
  subject?: string;
  auto: boolean;
  status?: 'draft' | 'assigned';
  trigger?: string;
  topUp?: Omit<TopUpInput, 'target'>;
}): Promise<{ assigned: Array<{ loId: string; title: string; count: number }>; assignmentId: string; status: 'draft' | 'assigned' } | null> {
  const plan = input.lessonPlanId ? await getLessonPlan(input.lessonPlanId) : null;
  const titleFor = (loId: string): string => {
    const lo = plan?.los.find((l) => l.id === loId);
    return lo?.shortTitle ?? lo?.description ?? loId;
  };
  const loIds = [...new Set(input.loIds.filter((id) => typeof id === 'string' && id.length > 0))].slice(0, MAX_LOS);
  if (loIds.length === 0) return null;
  await connectDB();
  const seen = await EvidenceEventModel.find({ studentId: input.profileId, loId: { $in: loIds }, itemId: { $exists: true } }).select('itemId').lean();
  const seenItemIds = [...new Set(seen.map((r) => r.itemId).filter((x): x is string => typeof x === 'string'))];
  const hints = await getLearnerHints(input.externalStudentId, input.subject, input.partnerId);
  // Task 12 — partner-level practice cap (e.g. GreenApple = 3). Loading the
  // partner record here is best-effort: an unknown partner id, a registry
  // read failure, or a decrypt fault must never block homework assignment —
  // resolveAssignmentItems' own clamp (resolve.ts) already treats a missing
  // cap as ASSIGN_TUNING.cap, so falling back to `partner = null` on any
  // error just means "no override", not "no homework".
  let partner: PartnerRecord | null = null;
  try {
    partner = await getPartner(input.partnerId);
  } catch (err) {
    console.error(`[practice-assign] getPartner('${input.partnerId}') failed — falling back to the default cap`, err);
  }
  const cap = capForPartner(partner);
  let los = await resolveAssignmentItems(
    { los: loIds.map((loId) => ({ loId, title: titleFor(loId) })), band: hints.band, seenItemIds, studentId: input.profileId, courseId: input.courseId ?? plan?.topic ?? '', cap },
    mongoPracticeSources(),
  );
  // Round 4 (E3): end-of-session drafts top up to PRACTICE_TARGET by
  // generation (PRACTICE_GEN-gated inside generatePracticeItems), never above
  // the partner cap. Every other caller passes no topUp — unchanged.
  if (input.topUp) {
    los = await topUpPractice(los, loIds.map((loId) => ({ loId, title: titleFor(loId) })), { ...input.topUp, target: Math.min(PRACTICE_TARGET, cap) });
  }
  if (los.length === 0) return null;
  // Caps enforced HERE (not at each call site) so both the direct route and
  // the commit-time fallback — whose synthesized reason can run long off a
  // plan LO's full `description` — inherit them uniformly.
  const reason = input.reason.trim().slice(0, 240);
  const locator = input.locator?.trim().slice(0, 80) || undefined;
  const nextTimeIntent = input.nextTimeIntent?.trim().slice(0, 200) || undefined;
  if (input.status === 'draft') {
    const result = await upsertDraft({
      studentId: input.profileId,
      partnerId: input.partnerId,
      sessionId: input.sessionId,
      lessonPlanId: input.lessonPlanId,
      courseId: input.courseId,
      los: los.map((l) => ({ ...l, reason })),
      nextTimeIntent,
      locator,
      auto: true,
      triggers: input.trigger ? [input.trigger] : [],
    });
    // Fix round 1 (Important — ownership check): this `sessionId` belongs
    // to a DIFFERENT student's record. Never surface it — behave exactly
    // like "nothing to assign" (the draft route turns this into a 204).
    if ('ownerMismatch' in result) return null;
    const { rec, alreadyAssigned } = result;
    // alreadyAssigned ⇒ upsertDraft wrote nothing and returned the
    // EXISTING record untouched — summarize what was actually persisted
    // (rec.los), never the items just re-resolved locally, which were
    // never written and may no longer match.
    return { assignmentId: rec._id, assigned: summarizeAssignmentLos(rec.los), status: alreadyAssigned ? 'assigned' : 'draft' };
  }
  const rec = await upsertAssignment({
    studentId: input.profileId,
    partnerId: input.partnerId,
    sessionId: input.sessionId,
    lessonPlanId: input.lessonPlanId,
    courseId: input.courseId,
    los: los.map((l) => ({ ...l, reason })),
    nextTimeIntent,
    locator,
    auto: input.auto,
    assignedAt: new Date(),
  });
  return { assignmentId: rec._id, assigned: summarizeAssignmentLos(rec.los), status: 'assigned' };
}
