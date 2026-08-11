/**
 * Diagnostic / assessment mode (v1.1.0) — engine side.
 *
 * Course-start calibration across a set of LOs, WITHOUT teaching scaffolding
 * (this is a pure backend operation — it never invokes the live teaching
 * orchestrator / brain). Two stateless steps:
 *   1. buildAssessment  — select calibration items per LO (via the existing
 *      practice retrieval), answer-stripped for the portal.
 *   2. submitAssessment — grade responses, then commit LOW-exposure mastery +
 *      CANDIDATE gaps through the normal SessionResult machinery, so the
 *      engine's decay/promotion treats it as a preliminary read that real
 *      sessions refine or overturn. Silent: returns pedagogical state to the
 *      portal only; no student-facing score.
 *
 * Reuse: retrievePractice (question selection), emitSessionResult (commit),
 * the single-answer judge (frq/free + image responses).
 */

import { randomUUID } from 'crypto';
import { retrievePractice, type PracticeSources } from './practice';
import { emitSessionResult } from './session-result';
import { gradeFreeResponse, type GradeDeps } from './grade-free-response';
import { appendEvidence, type EvidenceInput } from '@/lib/tutor/learner-model/store';
import type { ResolvedAssessmentKey } from './adapters';
import type {
  AssessmentRequest,
  AssessmentSet,
  AssessmentItem,
  AssessmentSubmission,
  AssessmentResult,
  AssessmentScore,
  AssessmentReviewItem,
  SessionEmitRequest,
} from '@evelyn/portal-contract/v1';

export type AssessmentItemResolver = (itemId: string) => Promise<ResolvedAssessmentKey | null>;

/** Build a (stateless) calibration set: up to `maxPerLo` items per LO, drawn
 *  from existing content, with answer keys stripped. */
export async function buildAssessment(
  req: AssessmentRequest,
  sources: PracticeSources,
): Promise<AssessmentSet> {
  const items: AssessmentItem[] = [];
  const seen = new Set<string>();
  for (const loId of req.loIds) {
    const res = await retrievePractice(
      { studentId: req.studentId, courseId: req.courseId, scope: { loId }, difficulty: req.difficulty, count: req.maxPerLo },
      sources,
    );
    for (const it of res.items) {
      if (seen.has(it.id)) continue;
      seen.add(it.id);
      items.push({
        itemId: it.id,
        loId,
        cedCode: it.cedCode,
        problemText: it.problemText,
        responseFormat: it.responseFormat,
        // Strip the `correct` flag — the answer key never leaves the engine.
        choices: it.choices?.map((c) => ({ id: c.id, text: c.text })),
      });
    }
  }
  return {
    assessmentId: randomUUID(),
    studentId: req.studentId,
    courseId: req.courseId,
    loIds: req.loIds,
    items,
  };
}

function norm(s: string): string {
  return (s ?? '').toLowerCase().replace(/\s+/g, ' ').trim();
}

/** Parse a numeric answer that may be a simple fraction ("25/10" → 2.5), a
 *  percent ("2.5%" → 2.5), or a plain number. Returns NaN for prose. */
function parseNumeric(s: string): number {
  const t = (s ?? '').trim().replace(/%\s*$/, '').replace(/,/g, '');
  const frac = t.match(/^(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)$/);
  if (frac) {
    const d = parseFloat(frac[2]);
    return d !== 0 ? parseFloat(frac[1]) / d : NaN;
  }
  return parseFloat(t);
}

/** Grade a single response against its resolved key. Deterministic for
 *  numeric/mcq; the single-answer judge for frq/free and image responses. */
async function isCorrect(
  key: ResolvedAssessmentKey,
  response: AssessmentSubmission['responses'][number]['response'],
  judge: GradeDeps['judgeSingleAnswer'],
): Promise<boolean> {
  if ('imageRef' in response) {
    const j = await judge({ expectedAnswer: key.expectedAnswer ?? '', response });
    return j.correct;
  }
  const text = response.text;
  const fmt = key.responseFormat ?? 'free';

  if (fmt === 'numeric') {
    const a = parseNumeric(text);
    const b = parseNumeric(key.expectedAnswer ?? '');
    if (Number.isFinite(a) && Number.isFinite(b)) {
      const tol = Math.max(0.01, Math.abs(b) * 0.01);
      return Math.abs(a - b) <= tol;
    }
    // The key isn't a clean single number (prose/multi-value reference — e.g. a
    // mis-tagged item whose answer is "Mean = 8 … SD = √10"). An exact-string
    // compare would fail any correct response, so judge it holistically.
    const j = await judge({ expectedAnswer: key.expectedAnswer ?? '', response: { text } });
    return j.correct;
  }

  if (fmt === 'mcq') {
    const n = norm(text);
    if (key.correctChoiceId && n === norm(key.correctChoiceId)) return true;
    if (key.expectedAnswer && n === norm(key.expectedAnswer)) return true;
    const correct = key.choices?.find((c) => c.id === key.correctChoiceId);
    if (correct && n === norm(correct.text)) return true;
    return false;
  }

  if (fmt === 'frq' || fmt === 'free') {
    const j = await judge({ expectedAnswer: key.expectedAnswer ?? '', response: { text } });
    return j.correct;
  }

  return norm(text) === norm(key.expectedAnswer ?? '');
}

interface GradeDetail {
  pointsAwarded: number;
  maxPoints: number;
  feedback?: string;
  rubricParts?: AssessmentReviewItem['rubricParts'];
}

/** Grade one response to POINTS + review detail (v1.4.0).
 *  - mcq / numeric (and image on a non-FRQ item): deterministic, worth 1 point.
 *  - frq / free: via gradeFreeResponse — a rubric awards PARTIAL credit
 *    (Σ part points / Σ part maxPoints); without a rubric the single-answer
 *    judge awards 1/0. This is the same grader the standalone /grade endpoint
 *    uses, so a quiz FRQ and a practice FRQ score identically. */
async function gradePoints(
  key: ResolvedAssessmentKey,
  response: AssessmentSubmission['responses'][number]['response'],
  deps: GradeDeps,
): Promise<GradeDetail> {
  const fmt = key.responseFormat ?? 'free';
  if (fmt === 'frq' || fmt === 'free') {
    const graded = await gradeFreeResponse(
      { studentId: '', itemId: '', response },
      {
        itemId: '',
        rubric: key.rubric,
        expectedAnswer: key.expectedAnswer,
        modelResponse: key.modelResponse,
        passageText: key.passageText,
      },
      deps,
    );
    const feedback = graded.parts.map((p) => p.feedback).filter(Boolean).join(' ') || undefined;
    return {
      pointsAwarded: graded.totalPoints,
      maxPoints: graded.maxPoints,
      feedback,
      rubricParts: graded.parts.map((p) => ({
        criterionId: p.criterionId,
        pointsAwarded: p.pointsAwarded,
        maxPoints: p.maxPoints,
        feedback: p.feedback,
      })),
    };
  }
  const correct = await isCorrect(key, response, deps.judgeSingleAnswer);
  // Surface a rationale in the review (the academy renders review.feedback).
  // Joins ALL of the item's hints so an incorrect answer gets a full "why",
  // not just the gentlest nudge; the correct answer is shown separately.
  const rationale = (key.hints ?? []).map((h) => h?.trim()).filter(Boolean).join(' ');
  const feedback = rationale ? (correct ? `Correct. ${rationale}` : rationale) : undefined;
  return { pointsAwarded: correct ? 1 : 0, maxPoints: 1, feedback };
}

/**
 * Grade a submission and commit the calibration as a preliminary read:
 *  - mastery delta per LO signed by POINTS fraction (fresh LO → exposures 1)
 *  - a single-signal CANDIDATE gap for each weak LO (frac < 0.5)
 * via emitSessionResult (idempotent on sessionId). Threads `notesTouched`
 * (v1.4.0) so a unit quiz runs the gap↔notes link reconcile for its baselines.
 * Returns the SessionResult plus a points-based `score` breakdown (v1.4.0) — a
 * scored quiz renders it; the silent diagnostic ignores it.
 */
export async function submitAssessment(
  sub: AssessmentSubmission,
  deps: GradeDeps,
  resolveItem: AssessmentItemResolver,
  /** Final-review fix (M3, spec §4.1) — the authenticated partner id
   *  (`auth.partnerId` from `withPortalAuth`), stamped onto every evidence
   *  row this submission produces. The route passes it through; direct/test
   *  callers may omit it. */
  partnerId?: string,
): Promise<AssessmentResult> {
  // Task 8 — quiz vs silent-diagnostic discriminator: `notesTouched` is the
  // submission's existing signal (v1.4.0 comment on AssessmentSubmissionSchema:
  // "Absent/empty (the diagnostic path)"). A unit quiz passes its baselines;
  // the course-start silent diagnostic never does.
  // Task 13 — the contract's explicit `purpose` field (v1.13.0), when present,
  // wins over the notesTouched heuristic in both directions; absent purpose
  // falls back to the legacy heuristic unchanged.
  const evidenceSource: EvidenceInput['source'] =
    sub.purpose === 'quiz'
      ? 'assessment'
      : sub.purpose === 'diagnostic'
        ? 'diagnostic'
        : sub.notesTouched && sub.notesTouched.length > 0
          ? 'assessment'
          : 'diagnostic';
  const evidenceOccurredAt = new Date();
  const evidenceInputs: EvidenceInput[] = [];

  const perLo = new Map<string, { awarded: number; max: number }>();
  const review: AssessmentReviewItem[] = [];
  for (const r of sub.responses) {
    const agg = perLo.get(r.loId) ?? { awarded: 0, max: 0 };
    const key = await resolveItem(r.itemId);
    if (key) {
      const detail = await gradePoints(key, r.response, deps);
      agg.awarded += detail.pointsAwarded;
      agg.max += detail.maxPoints;
      review.push({
        itemId: r.itemId,
        loId: r.loId,
        responseFormat: key.responseFormat,
        pointsAwarded: detail.pointsAwarded,
        maxPoints: detail.maxPoints,
        correct: detail.maxPoints > 0 && detail.pointsAwarded >= detail.maxPoints,
        correctChoiceId: key.correctChoiceId,
        expectedAnswer: key.expectedAnswer,
        feedback: detail.feedback,
        rubricParts: detail.rubricParts,
      });
      evidenceInputs.push({
        idempotencyKey: `diag:${sub.sessionId}:${r.itemId}`,
        studentId: sub.studentId,
        partnerId,
        loId: r.loId,
        source: evidenceSource,
        sessionId: sub.sessionId,
        itemId: r.itemId,
        outcome: detail.maxPoints > 0 ? detail.pointsAwarded / detail.maxPoints : 0,
        pointsAwarded: detail.pointsAwarded,
        maxPoints: detail.maxPoints,
        occurredAt: evidenceOccurredAt,
      });
    } else {
      // Unresolved item — count it as a 1-point miss so totals stay honest.
      agg.max += 1;
      review.push({ itemId: r.itemId, loId: r.loId, pointsAwarded: 0, maxPoints: 1, correct: false });
      evidenceInputs.push({
        idempotencyKey: `diag:${sub.sessionId}:${r.itemId}`,
        studentId: sub.studentId,
        partnerId,
        loId: r.loId,
        source: evidenceSource,
        sessionId: sub.sessionId,
        itemId: r.itemId,
        outcome: 0,
        pointsAwarded: 0,
        maxPoints: 1,
        occurredAt: evidenceOccurredAt,
      });
    }
    perLo.set(r.loId, agg);
  }

  // Task 8 — fire-and-forget (this is a latency-sensitive submit path);
  // appendEvidence is itself best-effort and never throws.
  appendEvidence(evidenceInputs).catch((err) =>
    console.error('[learner-model] assessment evidence append failed', err),
  );

  const masteryDeltas: SessionEmitRequest['masteryDeltas'] = [];
  const gaps: SessionEmitRequest['gaps'] = [];
  const perLoScore: AssessmentScore['perLo'] = [];
  let totalAwarded = 0;
  let totalMax = 0;
  for (const [loId, { awarded, max }] of perLo) {
    perLoScore.push({ loId, pointsAwarded: awarded, maxPoints: max });
    totalAwarded += awarded;
    totalMax += max;
    if (max === 0) continue;
    const frac = awarded / max;
    // 0 → -0.8, 0.5 → 0, 1 → +0.8. applyMasteryDeltas turns this into a
    // first-touch score at exposures 1 (deliberately low-trust).
    masteryDeltas.push({ loId, delta: (frac - 0.5) * 1.6 });
    if (frac < 0.5) {
      gaps.push({
        kind: 'lo',
        loId,
        observation: `Assessment: ${awarded}/${max} pts on ${loId} (preliminary).`,
        studentQuotes: [],
        // Single signal → confidence 0.25 → stays CANDIDATE (never auto-confirmed).
        signals: ['INCORRECT_STREAK_2_PLUS'],
      });
    }
  }

  const emitReq: SessionEmitRequest = {
    sessionId: sub.sessionId,
    studentId: sub.studentId,
    courseId: sub.courseId,
    status: 'completed',
    milestone: 'none',
    losTouched: [...perLo.keys()],
    masteryDeltas,
    gaps,
    notesTouched: sub.notesTouched ?? [],
  };
  // C1 fix: submitAssessment already wrote its own per-item `diag:` evidence
  // rows above — skipEvidenceFallback stops emitSessionResult's internal
  // masteryDeltas fallback from ALSO synthesizing a spurious `emit:<sid>:
  // lo:<loId>` row on top of them (that double-counted the same outcome).
  const result = await emitSessionResult(emitReq, { skipEvidenceFallback: true, partnerId });
  const score: AssessmentScore = {
    pointsAwarded: totalAwarded,
    maxPoints: totalMax,
    percent: totalMax > 0 ? Math.round((totalAwarded / totalMax) * 100) : 0,
    perLo: perLoScore,
  };
  return { ...result, score, review };
}
