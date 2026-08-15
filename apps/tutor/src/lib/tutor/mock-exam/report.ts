/**
 * Mock-exam report assembly, FRQ grading, and the gaps/mastery feed.
 *
 * `ensureGraded` is the idempotent worker every report poll calls: it grades
 * any pending free-response tasks (with retry + a footnote fallback), folds
 * their points into the curved score, extends the LO breakdown with the FRQ
 * results, then feeds the student's profile (mastery deltas + learning gaps).
 * `getReport` maps the finalized attempt onto the contract `MockReport`;
 * `getReview` produces the post-completion answer-key review payload.
 *
 * The grader and the student-profile store are dependency-injected (`ReportDeps`)
 * so this whole module is unit-testable without a model call or a Mongo
 * connection — see report.test.ts.
 */

import { randomUUID } from 'node:crypto';
import type { MockReport, MockReviewItem, MockReviewResponse } from '@evelyn/portal-contract/v1';
import { resolvePassage } from '@/lib/tutor/passages/store';
import {
  getOrCreateStudentProfile,
  saveStudentProfile,
  applyMasteryDeltas,
  recordGap,
  identityResolutionEnabled,
  resolveProfileId,
} from '@/lib/tutor/student-profile/store';
import {
  gradeFreeResponse,
  type GradeDeps,
  type GradeItem,
} from '@/lib/tutor/portal/grade-free-response';
import { getBlueprint } from './blueprints';
import type { ExamBlueprint } from './blueprints';
import { answersMatch, applyCurves } from './scoring';
import type { MockStores, AttemptDoc } from './service';
import { appendEvidence as appendLearnerEvidence, type EvidenceInput } from '@/lib/tutor/learner-model/store';
import { buildMockItemEvidence, buildSectionIdByItem } from './evidence';

/** A grading attempt whose lock is older than this is treated as a crashed run
 *  and re-lockable (`gradingStartedAt` is stamped at finalize by Task 8, so it
 *  is always set when we arrive — the real done-marker is `frqGrades`). */
const GRADING_STALE_MS = 10 * 60 * 1000;

/** gradeFreeResponse is retried this many times on throw (so 3 attempts total). */
const GRADE_RETRIES = 2;

export interface ReportDeps {
  /** Inject fakes in tests; `defaultGradeDeps()` in routes. */
  gradeDeps: GradeDeps;
  /** Optional injection for tests; defaults to the real student-profile store. */
  profileStore?: {
    getOrCreate(id: string): Promise<unknown>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    save(p: any): Promise<unknown>;
  };
  /** Task 8 — optional injection for tests; defaults to the real
   *  learner-model evidence-append service. */
  appendEvidence?: (inputs: EvidenceInput[]) => Promise<void>;
  /** M1c Task 5 — the calling portal route's verified `auth.partnerId`
   *  (this module's sole production caller is
   *  `/api/portal/v1/mock/attempts/report`). Threaded to the profile-store
   *  read in `feedGapsAndMastery`. Only used (and only required) when
   *  identityResolutionEnabled() is on; direct/test callers may omit it. */
  partnerId?: string;
}

function profileStoreOf(deps: ReportDeps) {
  return (
    deps.profileStore ?? {
      getOrCreate: getOrCreateStudentProfile,
      save: saveStudentProfile,
    }
  );
}

/** The rubric's total available points (fallback 1 for a legacy no-rubric FRQ). */
function rubricMaxPoints(rubric: { parts: Array<{ maxPoints: number }> } | undefined): number {
  if (!rubric || rubric.parts.length === 0) return 1;
  return rubric.parts.reduce((s, p) => s + p.maxPoints, 0);
}

/** Grade one FRQ with retries; returns null on final failure. */
async function gradeOneWithRetry(
  studentId: string,
  itemId: string,
  frqText: string,
  gradeItem: GradeItem,
  gradeDeps: GradeDeps,
) {
  for (let i = 0; i <= GRADE_RETRIES; i++) {
    try {
      return await gradeFreeResponse({ studentId, itemId, response: { text: frqText } }, gradeItem, gradeDeps);
    } catch {
      // retry
    }
  }
  return null;
}

/**
 * Idempotent grading + feed worker. Safe to call on every report poll:
 *   - a `grading` attempt has its FRQs graded (with retry/footnote), curves
 *     applied, and is flipped to `completed`;
 *   - a `completed` attempt (MCQ-only, from Task 8) skips grading;
 *   - either way the gaps/mastery feed runs exactly once (guarded by
 *     `gapsFedAt`).
 * Terminal-but-ungradable states (in_section / at_break / expired) are no-ops.
 */
export async function ensureGraded(
  stores: MockStores,
  attemptId: string,
  deps: ReportDeps,
  now: number = Date.now(),
): Promise<AttemptDoc> {
  let attempt = await stores.findAttempt(attemptId);
  if (!attempt) throw new Error('not_found');

  const blueprint = getBlueprint(attempt.examKey);

  if (attempt.status === 'grading') {
    // Concurrency guard. Task 8 sets `gradingStartedAt` at finalize but never a
    // token, so the FIRST poll (token unset) always grades. A poll that finds a
    // token already held AND fresh (< 10 min) backs off — the holder is grading
    // (route replies 202). A token older than 10 min is a crashed run and is
    // re-takeable.
    const lockedMs = attempt.gradingStartedAt?.getTime();
    const heldFresh =
      attempt.gradingLockToken !== undefined &&
      lockedMs !== undefined &&
      now - lockedMs <= GRADING_STALE_MS;
    if (heldFresh) return attempt;

    // Acquire by compare-and-set: stamp a unique token, re-read, and proceed
    // only if ours survived. Two concurrent pollers that both saw the lock free
    // both write; the last write wins, and only that poll's re-read matches —
    // the other returns untouched (still 'grading').
    const token = randomUUID();
    attempt.gradingLockToken = token;
    attempt.gradingStartedAt = new Date(now);
    await stores.saveAttempt(attempt);

    const reread = await stores.findAttempt(attemptId);
    if (!reread) throw new Error('not_found');
    if (reread.gradingLockToken !== token) return reread;

    attempt = await gradeAndComplete(stores, blueprint, reread, token, deps, now);
  }

  if (attempt.status === 'completed' && !attempt.gapsFedAt) {
    await feedGapsAndMastery(stores, attempt, deps, now);
  }

  return attempt;
}

/** Grade every answered FRQ, fold points into curves, extend loBreakdown, and
 *  flip the attempt to completed. `token` is the grading lease held by this
 *  call; grading may run for minutes, so before committing we re-read and fence
 *  the lease (see below). Returns the attempt doc to carry forward (the freshly
 *  committed one, or the owner's doc if the lease was lost). */
async function gradeAndComplete(
  stores: MockStores,
  blueprint: ExamBlueprint,
  attempt: AttemptDoc,
  token: string,
  deps: ReportDeps,
  now: number,
): Promise<AttemptDoc> {
  const allItemIds = attempt.servedModules.flatMap((m) => m.itemIds);
  const items = await stores.getItems(allItemIds);
  const itemById = new Map(items.map((it) => [it.id, it]));
  const responseByItem = new Map(attempt.responses.map((r) => [r.itemId, r]));

  // Section a served item belongs to (sectionIdx → blueprint sectionId).
  const sectionIdByItem = buildSectionIdByItem(attempt.servedModules, blueprint.sections);

  // Reuse an existing grade set on a crashed-then-retried pass (done-marker).
  const frqGrades: NonNullable<AttemptDoc['frqGrades']> = attempt.frqGrades ? [...attempt.frqGrades] : [];
  const alreadyGraded = new Set(frqGrades.map((g) => g.itemId));
  let ungradedCount = frqGrades.filter((g) => g.ungraded).length;

  if (frqGrades.length === 0) {
    for (const mod of attempt.servedModules) {
      for (const id of mod.itemIds) {
        if (alreadyGraded.has(id)) continue;
        const item = itemById.get(id);
        if (!item || item.responseFormat !== 'frq') continue;
        const frqText = responseByItem.get(id)?.frqText;

        if (frqText === undefined || frqText.trim() === '') {
          // Skipped FRQ = zero credit (consistent with a wrong MCQ): 0/max
          // toward the section curve AND a 0/1 in the LO breakdown. Not
          // flagged `ungraded` (that is reserved for grader FAILURES) and not
          // footnoted.
          frqGrades.push({ itemId: id, totalPoints: 0, maxPoints: rubricMaxPoints(item.rubric), parts: [] });
          continue;
        }

        const passageText = item.passageId ? resolvePassage(item.passageId)?.fullText : undefined;
        const graded = await gradeOneWithRetry(
          attempt.studentId,
          id,
          frqText,
          { itemId: id, rubric: item.rubric as GradeItem['rubric'], passageText },
          deps.gradeDeps,
        );
        if (graded) {
          frqGrades.push({
            itemId: id,
            totalPoints: graded.totalPoints,
            maxPoints: graded.maxPoints,
            parts: graded.parts,
          });
        } else {
          ungradedCount += 1;
          frqGrades.push({
            itemId: id,
            totalPoints: 0,
            maxPoints: rubricMaxPoints(item.rubric),
            parts: [],
            ungraded: true,
          });
        }
      }
    }
  }

  // FRQ points per section → curves.
  const frqPointsBySection: Record<string, { points: number; max: number }> = {};
  for (const g of frqGrades) {
    const sectionId = sectionIdByItem.get(g.itemId);
    if (!sectionId) continue;
    const bucket = frqPointsBySection[sectionId] ?? { points: 0, max: 0 };
    bucket.points += g.totalPoints;
    bucket.max += g.maxPoints;
    frqPointsBySection[sectionId] = bucket;
  }

  const { scaled } = applyCurves(
    blueprint,
    attempt.rawSections ?? [],
    attempt.moduleRouting,
    frqPointsBySection,
  );

  // Extend loBreakdown: the brief's breakdown is MCQ-only, so fold each
  // SUCCESSFULLY-graded FRQ into its item's LO (correct iff ratio >= 0.5,
  // total +1). Ungraded FRQs (grader failure, not student failure) are skipped.
  const loBreakdown = (attempt.loBreakdown ?? []).map((e) => ({ ...e }));
  const loById = new Map(loBreakdown.map((e) => [e.loId, e]));
  for (const g of frqGrades) {
    if (g.ungraded) continue;
    const item = itemById.get(g.itemId);
    if (!item) continue;
    const correct = g.maxPoints > 0 && g.totalPoints / g.maxPoints >= 0.5 ? 1 : 0;
    const entry = loById.get(item.loId);
    if (entry) {
      entry.correct += correct;
      entry.total += 1;
    } else {
      const created = { loId: item.loId, correct, total: 1, sectionId: sectionIdByItem.get(g.itemId) };
      loBreakdown.push(created);
      loById.set(item.loId, created);
    }
  }

  // Task 8 — per-item mock evidence for the learner model (shared with
  // finalizeOpenModule's MCQ-only fast path — see evidence.ts). Pure (no
  // I/O) — the actual append is awaited below, ONLY on the branch that wins
  // the lease-fence, so a superseded poll (see the fence check right after)
  // never double-emits; that's the idempotency guard for THIS path (on top
  // of the `mock:<attemptId>:<itemId>` keys themselves).
  const evidenceInputs = buildMockItemEvidence({
    attemptId: attempt.attemptId,
    studentId: attempt.studentId,
    servedModules: attempt.servedModules,
    items,
    responseByItem,
    sectionIdByItem,
    frqGrades,
    occurredAt: new Date(now),
  });

  // Fence the lease at completion. Grading may have run past the 10-min stale
  // window, letting a second poll take over, complete, and feed. Re-read before
  // committing: if the lease is no longer ours, abandon silently — writing our
  // stale doc would clobber the winner (its $unset would even delete the
  // winner's gapsFedAt). Return the winner's doc so the caller carries it
  // forward (and, its gapsFedAt already set, skips a second feed).
  const fenced = await stores.findAttempt(attempt.attemptId);
  if (!fenced || fenced.gradingLockToken !== token) return fenced ?? attempt;

  fenced.frqGrades = frqGrades;
  fenced.loBreakdown = loBreakdown;
  fenced.scaled = scaled;
  if (ungradedCount > 0) {
    fenced.footnote = `Estimated — ${ungradedCount} free-response task(s) could not be graded.`;
  }
  fenced.status = 'completed';
  fenced.completedAt = new Date(now);
  await stores.saveAttempt(fenced);

  // Task 8 — awaited (mock grading is already async-slow, unlike the
  // latency-sensitive emit/assessment paths, which fire-and-forget).
  const emitEvidence = deps.appendEvidence ?? appendLearnerEvidence;
  await emitEvidence(evidenceInputs);

  return fenced;
}

/** Load → mutate (pure helpers) → save the student profile, mirroring
 *  emitSessionResult. Runs once per attempt (guarded by `gapsFedAt`). */
async function feedGapsAndMastery(
  stores: MockStores,
  attempt: AttemptDoc,
  deps: ReportDeps,
  now: number,
): Promise<void> {
  const breakdown = attempt.loBreakdown ?? [];
  const form = await stores.findForm(attempt.formId);
  const formLabel = form?.label ?? attempt.formId;

  const deltas: Array<{ loId: string; delta: number }> = [];
  const gapEntries: Array<{ loId: string; total: number; correct: number }> = [];
  for (const e of breakdown) {
    if (e.total <= 0) continue;
    const ratio = e.correct / e.total;
    if (ratio >= 0.75) deltas.push({ loId: e.loId, delta: +1 });
    else if (ratio <= 0.4) deltas.push({ loId: e.loId, delta: -1 });
    if (e.total >= 2 && ratio < 0.5) gapEntries.push({ loId: e.loId, total: e.total, correct: e.correct });
  }

  const store = profileStoreOf(deps);
  // M1c Task 5 — flag-gated identity resolution; see identityResolutionEnabled.
  const profileId = identityResolutionEnabled()
    ? await resolveProfileId({ partnerId: deps.partnerId ?? '', externalStudentId: attempt.studentId })
    : attempt.studentId;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let profile: any = await store.getOrCreate(profileId);
  profile = applyMasteryDeltas(profile, deltas);
  for (const g of gapEntries) {
    profile = recordGap(profile, {
      kind: 'lo',
      loId: g.loId,
      observation: `Missed ${g.total - g.correct} of ${g.total} on ${formLabel}`,
      studentQuotes: [],
      signals: ['INCORRECT_STREAK_2_PLUS'],
      sessionId: `mock:${attempt.attemptId}`,
    });
  }
  await store.save(profile);

  attempt.gapsFedAt = new Date(now);
  await stores.saveAttempt(attempt);
}

// ---------------------------------------------------------------------------
// getReport
// ---------------------------------------------------------------------------

export async function getReport(
  stores: MockStores,
  studentId: string,
  attemptId: string,
  deps: ReportDeps,
  now: number = Date.now(),
): Promise<MockReport> {
  const existing = await stores.findAttempt(attemptId);
  if (!existing) throw new Error('not_found');
  if (existing.studentId !== studentId) throw new Error('forbidden');

  const attempt = await ensureGraded(stores, attemptId, deps, now);
  const blueprint = getBlueprint(attempt.examKey);
  const form = await stores.findForm(attempt.formId);
  const label = form?.label ?? attempt.formId;

  if (attempt.status === 'expired') {
    const finalizedSections = attempt.rawSections ?? [];
    if (finalizedSections.length === 0) throw new Error('not_found');
    return {
      ...mapReport(attempt, blueprint, label),
      footnote: 'Attempt expired before completion — partial results.',
    };
  }

  return mapReport(attempt, blueprint, label);
}

function mapReport(attempt: AttemptDoc, blueprint: ExamBlueprint, label: string): MockReport {
  const sections = (attempt.rawSections ?? []).map((rs) => {
    const bpSection = blueprint.sections.find((s) => s.sectionId === rs.sectionId);
    const scaledSection = attempt.scaled?.sections.find((s) => s.sectionId === rs.sectionId);
    return {
      sectionId: rs.sectionId,
      label: bpSection?.label ?? rs.sectionId,
      rawCorrect: rs.rawCorrect,
      rawTotal: rs.rawTotal,
      ...(scaledSection ? { scaled: scaledSection.scaled } : {}),
    };
  });

  return {
    attemptId: attempt.attemptId,
    formId: attempt.formId,
    examType: blueprint.examType as MockReport['examType'],
    label,
    status: attempt.status,
    ...(attempt.completedAt ? { completedAt: attempt.completedAt.getTime() } : {}),
    isRetake: attempt.isRetake,
    ...(attempt.scaled ? { scaled: attempt.scaled } : {}),
    sections,
    loBreakdown: attempt.loBreakdown ?? [],
    ...(attempt.frqGrades ? { frqGrades: attempt.frqGrades } : {}),
    ...(attempt.footnote ? { footnote: attempt.footnote } : {}),
  };
}

// ---------------------------------------------------------------------------
// getReview
// ---------------------------------------------------------------------------

export async function getReview(
  stores: MockStores,
  studentId: string,
  attemptId: string,
): Promise<MockReviewResponse> {
  const attempt = await stores.findAttempt(attemptId);
  if (!attempt) throw new Error('not_found');
  if (attempt.studentId !== studentId) throw new Error('forbidden');

  const isCompleted = attempt.status === 'completed';
  const isExpiredPartial =
    attempt.status === 'expired' && (attempt.rawSections?.length ?? 0) > 0;
  if (!isCompleted && !isExpiredPartial) throw new Error('not_ready');

  const blueprint = getBlueprint(attempt.examKey);
  const allItemIds = attempt.servedModules.flatMap((m) => m.itemIds);
  const items = await stores.getItems(allItemIds);
  const itemById = new Map(items.map((it) => [it.id, it]));
  const responseByItem = new Map(attempt.responses.map((r) => [r.itemId, r]));
  const frqGradeByItem = new Map((attempt.frqGrades ?? []).map((g) => [g.itemId, g]));

  const reviewItems: MockReviewItem[] = [];
  for (const mod of attempt.servedModules) {
    const bpSection = blueprint.sections[mod.sectionIdx];
    const sectionId = bpSection?.sectionId ?? String(mod.sectionIdx);
    const sectionLabel = bpSection?.label ?? sectionId;
    for (const id of mod.itemIds) {
      const item = itemById.get(id);
      if (!item) continue;
      const response = responseByItem.get(id);
      const passage = item.passageId ? resolvePassage(item.passageId) : undefined;
      const isFrq = item.responseFormat === 'frq';

      const reviewItem: MockReviewItem = {
        itemId: id,
        sectionId,
        sectionLabel,
        responseFormat: item.responseFormat,
        problemText: item.problemText,
        loId: item.loId,
        ...(item.choices ? { choices: item.choices } : {}),
        ...(item.passageId && passage
          ? { passage: { passageId: item.passageId, title: passage.title, text: passage.fullText } }
          : {}),
        ...(item.solutionText ? { solutionText: item.solutionText } : {}),
        ...(response?.markedForReview !== undefined ? { markedForReview: response.markedForReview } : {}),
      };

      if (isFrq) {
        if (response?.frqText !== undefined) reviewItem.studentAnswer = response.frqText;
        const grade = frqGradeByItem.get(id);
        if (grade) reviewItem.frqGrade = grade;
      } else {
        reviewItem.correctAnswer = item.answer;
        if (response?.answer !== undefined) reviewItem.studentAnswer = response.answer;
        reviewItem.isCorrect = answersMatch(item, response?.answer);
      }

      reviewItems.push(reviewItem);
    }
  }

  return { items: reviewItems };
}
