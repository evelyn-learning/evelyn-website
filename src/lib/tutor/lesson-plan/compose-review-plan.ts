/**
 * Review-plan composer (Task 14, phase-c) — builds a lesson plan for a
 * portal-supplied set of LOs the learner-state projection says need
 * review: ordered weakest-first, capped to what the session's time
 * budget can hold, with a recall-first re-activation per LO (NOT a
 * fresh introduction — the student has already been taught this) plus
 * an extra, easier practice rep for LOs whose estimate is below the
 * reteach threshold.
 *
 * Distinct from generate-from-text.ts's fresh-topic pipeline in one key
 * way: there's no Stage 1 — the LOs are already known (portal-supplied,
 * ≤ TUNING.reviewSession.maxLos of them). Only Stage 2 runs, and it runs
 * with REVIEW_STAGE2_SYSTEM (recall + try-heavy) instead of STAGE2_SYSTEM
 * — see the `opts.system` override Task 14 added to expandSegmentsForLOs
 * rather than duplicating that function's request/parse plumbing here.
 *
 * LearnerHints conditioning (spec §6.2, fix round 1): review composition
 * calls getLearnerHints and threads the result onto the expander input's
 * `learner` field, same as Task 12's fresh-lesson generation — the
 * success-target pitch and gap-topics/misconception lines are directly
 * valuable here (arguably more so: a gap-topic student reviewing their
 * weakest LOs is the highest-value place for misconception-aware
 * prompting). Only the ability line differs: `opts.reviewMode: true`
 * swaps in the review-shaped variant, since REVIEW_STAGE2_SYSTEM never
 * emits a worked_example segment and the default ability line talks
 * about worked-example counts.
 *
 * NEVER cached: a review plan is a point-in-time read of the learner-state
 * projection (today's weakest LOs), not a reusable topic-shaped artifact —
 * it must never be served from generate-from-text.ts's topic cache, and
 * this module never touches it.
 *
 * On expander failure this throws (rather than falling back to a stub
 * plan the way generatePlanFromText does) — the route that calls this
 * (Task 15) turns that into a 502; the portal has its own fallback path
 * for "couldn't build a review session right now".
 */

import { randomUUID } from 'node:crypto';
import type { LearningObjective, LessonPlan } from './types';
import { LESSON_PLAN_SCHEMA_VERSION } from './types';
import { parseLessonPlan } from './parser';
import { upsertLessonPlan } from './store';
import {
  buildRecapSegment,
  expandSegmentsForLOs,
  type GenerateFromTextInput,
} from './generate-from-text';
import { clampSessionMinutes } from './session-budget';
import { LearnerStateProjectionModel, buildLearnerStateProjectionId } from '@/models';
import connectDB from '@/lib/db';
import { TUNING } from '../learner-model/estimator';
import { getLearnerHints } from '../learner-model/hints';

/** Review-shaped twin of STAGE2_SYSTEM (generate-from-text.ts:232). Same
 *  JSON-only contract and terseness/number-collision discipline; the
 *  segment shape differs because a review isn't a fresh introduction —
 *  no hook, no worked example, just a brief recall-first re-activation
 *  and practice. The optional third segment ("<loId>-try2") is driven
 *  entirely by the per-LO description text the composer supplies (see
 *  `reteachNote` below) — this prompt is a static const, so it can't
 *  itself know which specific LOs are below the reteach threshold. */
export const REVIEW_STAGE2_SYSTEM = `You expand a list of learning objectives the student has ALREADY been taught into REVIEW segments, in JSON.

Rules:
1. For every supplied objective, emit exactly two segments in order: a recall-first re-activation ("<loId>-recall") and a try-yourself ("<loId>-try"). EXCEPTION: when an objective's description explicitly says it needs an extra easier rep, emit a THIRD segment — a second, easier try_yourself ("<loId>-try2") — after "<loId>-try".
2. Segment ids are deterministic: "<loId>-recall", "<loId>-try", and (only when the description asks for it) "<loId>-try2" — using the LO id supplied in the input.
3. "<loId>-recall" is a BRIEF recall-first re-activation: prompt the student to recall the idea themselves before restating it. It is NOT a fresh introduction — do not teach the concept as if the student has never seen it.
4. KEEP FIELDS TERSE. Recall: 'goal' ≤ 12 words; 'keyIdeas' ≤ 3 bullets of ≤ 12 words each. Try-yourself: 'problem' ≤ 20 words; 'expectedAnswer' ≤ 12 words. Verbosity will truncate the JSON — be ruthlessly short.
5. Do NOT invent content beyond what the LO description implies.
6. NUMBER-COLLISION MUST: in every try_yourself, no context/setup number (a fee, starting value, coefficient, count, etc.) may be numerically equal to that problem's expected answer, and the expected answer MUST itself be a single unambiguous value — a student's correct spoken answer must never be confusable with a number already sitting in the problem's setup. When a "<loId>-try2" is emitted, its problem must differ from "<loId>-try"'s (a genuinely easier rep, not a restatement).
7. Output ONLY valid JSON matching the schema below. No prose, no markdown fences, no commentary.

Schema:
{
  "segments": [
    { "id": "<loId>-recall", "kind": "concept",       "goal": string, "keyIdeas": [string, ...] },
    { "id": "<loId>-try",    "kind": "try_yourself",   "problem": string, "expectedAnswer": string },
    { "id": "<loId>-try2",   "kind": "try_yourself",   "problem": string, "expectedAnswer": string }
  ]
}`;

export interface ComposeReviewInput {
  studentId: string;
  /** LOs to review, portal-supplied. ≤ TUNING.reviewSession.maxLos by
   *  contract; the composer's own cap re-enforces that regardless. */
  los: Array<{ loId: string; title: string }>;
  sessionMinutes?: number;
  subject?: string;
  /** DI seam for tests: stage-2 expander; defaults to the real
   *  LLM-backed one (generate-from-text.ts's expandSegmentsForLOs). */
  expandFn?: typeof expandSegmentsForLOs;
}

/** Appended to a below-threshold LO's description so the (static)
 *  REVIEW_STAGE2_SYSTEM prompt's EXCEPTION clause fires for that LO only —
 *  the prompt itself can't reference specific loIds. `<loId>` is the
 *  literal placeholder text REVIEW_STAGE2_SYSTEM's rule 2 tells the model
 *  to substitute the supplied LO id into. */
function reteachNote(loId: string): string {
  return `This objective is below the reteach threshold — also emit "${loId}-try2", a second, easier try_yourself for extra reps.`;
}

/** "Review: <first 2 titles>[…]" — ellipsis only when more were kept than
 *  fit the preview, so a 1- or 2-LO review plan's title has no dangling
 *  ellipsis. */
function reviewTitle(titles: ReadonlyArray<string>): string {
  const preview = titles.slice(0, 2).join(', ');
  return titles.length > 2 ? `Review: ${preview}…` : `Review: ${preview}`;
}

export async function composeReviewPlan(input: ComposeReviewInput): Promise<LessonPlan> {
  const clampedMinutes = clampSessionMinutes(input.sessionMinutes);
  const cap = Math.max(
    1,
    Math.min(
      TUNING.reviewSession.maxLos,
      Math.floor((clampedMinutes - 4) / TUNING.reviewSession.minutesPerLo),
    ),
  );

  await connectDB();
  const ids = input.los.map((lo) => buildLearnerStateProjectionId(input.studentId, lo.loId));
  const projections = await LearnerStateProjectionModel.find({ _id: { $in: ids } }).lean();
  const estimateByLoId = new Map(projections.map((p) => [p.loId, p.estimate]));

  const estimateFor = (loId: string): number => estimateByLoId.get(loId) ?? TUNING.untouchedPrior;

  // Ascending estimate — weakest first. Missing projection (never observed
  // for this student) reads as TUNING.untouchedPrior, same fallback the
  // rest of the learner model uses for an unseen LO.
  const ordered = [...input.los].sort((a, b) => estimateFor(a.loId) - estimateFor(b.loId));

  // Weakest N kept, where N is the smaller of the review-session LO cap
  // and what the time budget actually fits.
  const kept = ordered.slice(0, cap);

  const keptLos: LearningObjective[] = kept.map((lo) => ({ id: lo.loId, description: lo.title }));

  const expandLos: LearningObjective[] = kept.map((lo) => {
    const needsReteach = estimateFor(lo.loId) < TUNING.reviewSession.reteachBelowEstimate;
    return {
      id: lo.loId,
      description: needsReteach ? `${lo.title} ${reteachNote(lo.loId)}` : lo.title,
    };
  });

  // getLearnerHints never throws (falls back to the neutral steady/no-gaps
  // default on any error) — same conditioning Task 12 applies to fresh
  // lesson generation, per spec §6.2.
  const learner = await getLearnerHints(input.studentId, input.subject);

  const expandFn = input.expandFn ?? expandSegmentsForLOs;
  const genInput: GenerateFromTextInput = {
    text: '',
    subject: input.subject ?? 'general',
    grade: 'general',
    learner,
  };

  const result = await expandFn(expandLos, genInput, { system: REVIEW_STAGE2_SYSTEM, reviewMode: true });
  if (!result.ok || result.segments.length === 0) {
    throw new Error(`composeReviewPlan: stage-2 expander failed — ${result.reason}`);
  }

  const raw = {
    id: `rev-${randomUUID()}`,
    title: reviewTitle(kept.map((lo) => lo.title)),
    curriculum: 'review',
    grade: genInput.grade,
    subject: genInput.subject,
    locale: 'en',
    los: keptLos,
    estimatedMinutes: clampedMinutes,
    segments: [...result.segments, buildRecapSegment(keptLos)],
    prerequisites: [],
    schemaVersion: LESSON_PLAN_SCHEMA_VERSION,
    metadata: { reviewPlan: true, studentId: input.studentId },
  };

  const plan = parseLessonPlan(raw);
  await upsertLessonPlan(plan);
  return plan;
}
