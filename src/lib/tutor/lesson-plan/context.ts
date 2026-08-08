/**
 * Build the LessonPlanContext slice the brain sees on each turn from a
 * full LessonPlan + the active segment id. Lives separately from the
 * full plan so the brain's prompt stays bounded — only the *current*
 * segment is inlined; earlier/later segments are listed by id+kind.
 */

import type { LessonPlan, Segment } from './types';
import type { LessonPlanContext } from '@/lib/tutor/voice/claude-brain';

export function buildLessonPlanContext(
  plan: LessonPlan,
  currentSegmentId: string,
  completedSegmentIds?: ReadonlyArray<string>,
): LessonPlanContext | undefined {
  const seg: Segment | undefined = plan.segments.find((s) => s.id === currentSegmentId);
  if (!seg) return undefined;
  return {
    plan: {
      id: plan.id,
      title: plan.title,
      grade: plan.grade,
      subject: plan.subject,
      los: plan.los.map((lo) => ({ id: lo.id, description: lo.description })),
      estimatedMinutes: plan.estimatedMinutes,
    },
    currentSegmentId,
    currentSegment: seg,
    segmentIndex: plan.segments.map((s) => ({
      id: s.id,
      kind: s.kind,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      offTopic: (s as any).offTopic === true ? true : undefined,
    })),
    completedSegmentIds: completedSegmentIds ? [...completedSegmentIds] : undefined,
    // Final-review fix (Rule 12(b) prompt/code contradiction): forward-
    // declared below (isGeneratedPlan is defined further down this file);
    // function hoisting makes this reference safe at call time.
    isGeneratedPlan: isGeneratedPlan(plan) || undefined,
  };
}

/** Authored ground-truth fields the orchestrator can compare rendered
 *  tool calls against. Returned per segment when the segment kind has a
 *  canonical "this exact text MUST appear on the whiteboard" payload.
 *  Returns null for segments that are open-ended (concept, hook, recap)
 *  where there's no single correct rendering. */
export interface SegmentTruth {
  /** The authored problem / question text the brain MUST render verbatim. */
  problemText?: string;
  /** The expected final answer, when known. Used to verify the tutor's
   *  spoken claim and the rendered Final Answer card both line up. */
  expectedAnswer?: string;
  /** Segment kind, for the prompt + reject-message context. */
  kind: Segment['kind'];
}

export function getSegmentTruth(seg: Segment | undefined): SegmentTruth | null {
  if (!seg) return null;
  if (seg.kind === 'try_yourself' && typeof seg.problem === 'string' && seg.problem.length > 0) {
    return { problemText: seg.problem, expectedAnswer: seg.expectedAnswer, kind: seg.kind };
  }
  if (seg.kind === 'worked_example' && typeof seg.problem === 'string' && seg.problem.length > 0) {
    return { problemText: seg.problem, expectedAnswer: seg.answer, kind: seg.kind };
  }
  if (seg.kind === 'misconception_check' && typeof seg.question === 'string' && seg.question.length > 0) {
    return { problemText: seg.question, kind: seg.kind };
  }
  if (seg.kind === 'extension' && typeof seg.advancedQuestion === 'string' && seg.advancedQuestion.length > 0) {
    return { problemText: seg.advancedQuestion, kind: seg.kind };
  }
  return null;
}

/** djb2-style cheap hash. Mirrors simpleHash in
 *  voice/problem-generator.ts so the consumed-hashes set can be
 *  populated from either side. Inlined here to keep the lesson-plan
 *  module dependency-free. */
function consumedHash(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i);
  return (h >>> 0).toString(36);
}

/* ------------------------------------------------------------------ */
/* E6 — LO-ordering enforcement for runtime-generated plans            */
/* ------------------------------------------------------------------ */

const LO_SEGMENT_SUFFIX_RE = /-(hook|concept|worked|try)$/;

/** Derive the LO-group key for a segment id. Generated plans mint ids
 *  as "<loId>-hook" / "-concept" / "-worked" / "-try" (see
 *  generate-from-text.ts's STAGE2 prompt, "Segment ids are
 *  deterministic"). Stripping the known suffix recovers the loId so
 *  segments belonging to the same LO can be grouped. 'intro' and
 *  'recap' are singleton groups (no suffix, never shared with an LO).
 *  Any id that doesn't match the suffix pattern is its own singleton
 *  group — this degrades gracefully for ids that don't follow the
 *  convention (e.g. fallbackPlan's "lo1-concept" still strips to
 *  "lo1"; a bare custom id like "pick-los" is simply its own
 *  group-of-one). */
export function loGroupOf(segmentId: string): string {
  if (segmentId === 'intro' || segmentId === 'recap') return segmentId;
  const m = segmentId.match(LO_SEGMENT_SUFFIX_RE);
  return m ? segmentId.slice(0, -m[0].length) : segmentId;
}

/** True when `plan` was minted at runtime by generate-from-text.ts (vs.
 *  a curated/authored seed plan). Scopes E6's LO-ordering enforcement —
 *  curated plans must be byte-for-byte unaffected by it. */
export function isGeneratedPlan(plan: LessonPlan): boolean {
  return plan.metadata?.generatedFromText === true;
}

/** The LO group a generated plan should enter from 'intro': the group
 *  of the first non-intro segment in plan order, or null for a plan
 *  with no segments beyond intro (e.g. a not-yet-expanded picker
 *  plan — it has no LO groups to enter yet). */
export function firstLoGroup(plan: LessonPlan): string | null {
  for (const s of plan.segments) {
    const g = loGroupOf(s.id);
    if (g !== 'intro') return g;
  }
  return null;
}

function normalizeCompleted(
  ids?: ReadonlySet<string> | ReadonlyArray<string>,
): ReadonlySet<string> {
  if (!ids) return new Set();
  return ids instanceof Set ? ids : new Set(ids);
}

/** Segment ids in `group`'s LO, in plan order, that are NOT in
 *  `completedSegmentIds` — the "go finish these" list for rejection
 *  messages. */
export function remainingGroupSegmentIds(
  plan: LessonPlan,
  group: string,
  completedSegmentIds?: ReadonlySet<string> | ReadonlyArray<string>,
): string[] {
  const completed = normalizeCompleted(completedSegmentIds);
  return plan.segments
    .filter((s) => loGroupOf(s.id) === group && !completed.has(s.id))
    .map((s) => s.id);
}

/** For every LO group with a "<group>-try" segment in the plan, the id
 *  of that segment IF it is not yet complete. Used to gate entry into
 *  'recap' — every LO's try_yourself must be done first. A group with
 *  no "-try" segment (e.g. a fallback single-concept plan) is
 *  vacuously satisfied — nothing to gate. */
export function incompleteTryIds(
  plan: LessonPlan,
  completedSegmentIds?: ReadonlySet<string> | ReadonlyArray<string>,
): string[] {
  const completed = normalizeCompleted(completedSegmentIds);
  const groups = new Set(
    plan.segments.map((s) => loGroupOf(s.id)).filter((g) => g !== 'intro' && g !== 'recap'),
  );
  const out: string[] = [];
  for (const g of groups) {
    const tryId = `${g}-try`;
    if (plan.segments.some((s) => s.id === tryId) && !completed.has(tryId)) out.push(tryId);
  }
  return out;
}

/** Why `checkGeneratedPlanAdvance` blocked an explicit-id advance.
 *  `remainingSegmentIds` is the "go finish these first" list the
 *  rejection message hands back to the brain:
 *    - 'intro-skip'        → the first LO group's not-yet-completed ids
 *    - 'lo-incomplete'      → the CURRENT LO group's not-yet-completed ids
 *    - 'recap-incomplete'   → every LO's still-incomplete "-try" id */
export interface AdvanceBlockReason {
  kind: 'intro-skip' | 'lo-incomplete' | 'recap-incomplete';
  currentLoGroup: string;
  targetLoGroup: string;
  remainingSegmentIds: string[];
}

/** E6 — the LO-ordering policy for explicit-id `advance_lesson` targets
 *  on a runtime-generated plan. Enforces (in code) what Rule 12 in
 *  system-prompt-builder.ts previously only asked nicely for: within
 *  the CURRENT segment's LO group, any explicit jump is fine (forward
 *  or backward — re-visiting a hook after the try is harmless);
 *  crossing into a DIFFERENT LO group before the current one's "-try"
 *  is complete is not, and neither is skipping from 'intro' straight
 *  to a non-first LO. 'recap' additionally requires every LO's "-try"
 *  to be complete.
 *
 *  Called both from `resolveAdvanceTarget` (to decide allow/block) and
 *  from the VoiceTutorRealtime rejection-message builder (to explain
 *  WHY — `resolveAdvanceTarget` keeps its plain `string | null` return
 *  shape for its other callers, so the "why" lives here instead). Pure
 *  and side-effect-free — safe to call twice in the same turn. */
export function checkGeneratedPlanAdvance(
  plan: LessonPlan,
  currentSegmentId: string,
  targetSegmentId: string,
  completedSegmentIds?: ReadonlySet<string> | ReadonlyArray<string>,
): { allowed: true } | { allowed: false; reason: AdvanceBlockReason } {
  const currentGroup = loGroupOf(currentSegmentId);
  const targetGroup = loGroupOf(targetSegmentId);
  if (currentGroup === targetGroup) return { allowed: true };

  if (targetGroup === 'recap') {
    const incomplete = incompleteTryIds(plan, completedSegmentIds);
    if (incomplete.length === 0) return { allowed: true };
    return {
      allowed: false,
      reason: {
        kind: 'recap-incomplete',
        currentLoGroup: currentGroup,
        targetLoGroup: targetGroup,
        remainingSegmentIds: incomplete,
      },
    };
  }

  // Outbound from recap is unrestricted (e.g. remediation back into an
  // earlier LO) — recap is terminal, not itself LO-gated.
  if (currentGroup === 'recap') return { allowed: true };

  if (currentGroup === 'intro') {
    const fg = firstLoGroup(plan);
    if (fg && targetGroup === fg) return { allowed: true };
    return {
      allowed: false,
      reason: {
        kind: 'intro-skip',
        currentLoGroup: currentGroup,
        targetLoGroup: targetGroup,
        remainingSegmentIds: fg ? remainingGroupSegmentIds(plan, fg, completedSegmentIds) : [],
      },
    };
  }

  // Backward-to-intro from an LO group is a harmless revisit.
  if (targetGroup === 'intro') return { allowed: true };

  // LO group → a DIFFERENT LO group: gated on the current LO's "-try".
  const tryId = `${currentGroup}-try`;
  const hasTry = plan.segments.some((s) => s.id === tryId);
  const tryDone = !hasTry || normalizeCompleted(completedSegmentIds).has(tryId);
  if (tryDone) return { allowed: true };
  return {
    allowed: false,
    reason: {
      kind: 'lo-incomplete',
      currentLoGroup: currentGroup,
      targetLoGroup: targetGroup,
      remainingSegmentIds: remainingGroupSegmentIds(plan, currentGroup, completedSegmentIds),
    },
  };
}

/** Resolve an `advance_lesson` directive to the next segment id, or
 *  null when the directive can't be honored (already at start/end, or
 *  unknown id).
 *
 *  When `opts.consumedHashes` is provided, segments whose authored
 *  problem text hashes into that set are AUTO-SKIPPED on `next` /
 *  `previous` advances — the student already saw that problem (e.g.
 *  via a generate_problem fetch that returned the segment's authored
 *  text as a Layer-4 plan-authored fallback). Re-rendering the same
 *  problem via natural-flow advance feels broken to the student. The
 *  consumed-hashes filter does NOT apply to explicit-segment-id
 *  advances — if the brain insists on a specific id, honor it. */
export function resolveAdvanceTarget(
  plan: LessonPlan,
  currentSegmentId: string,
  to: string,
  opts?: {
    consumedHashes?: ReadonlySet<string>;
    /** E6: known-complete segment ids (completedSegmentIdsRef in
     *  VoiceTutorRealtime.tsx). Only consulted for generated plans, and
     *  only to gate 'recap' entry and cross-LO explicit-id jumps — see
     *  checkGeneratedPlanAdvance. Omitted/undefined ⇒ treated as "nothing
     *  complete yet" (the stricter, safer default). */
    completedSegmentIds?: ReadonlySet<string> | ReadonlyArray<string>;
  },
): string | null {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isOffTopic = (s: any): boolean => s?.offTopic === true;
  const consumed = opts?.consumedHashes;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isConsumed = (s: any): boolean => {
    if (!consumed || consumed.size === 0) return false;
    const truth = getSegmentTruth(s);
    if (!truth?.problemText) return false;
    return consumed.has(consumedHash(truth.problemText));
  };
  if (to === 'next') {
    const idx = plan.segments.findIndex((s) => s.id === currentSegmentId);
    // idx < 0 means there is no active plan position — empty cursor
    // (free-conversation with no stashed pre-free segment) or an
    // unknown id. Treat "next" as "resume the plan from its start":
    // scan from the first segment for the earliest on-topic,
    // non-consumed one. Previously this returned null, which the
    // orchestrator surfaced as an unresolvable advance — that is what
    // silently stranded a student off-plan after a (mis)cleared
    // cursor. Resuming at plan start is the safe graceful default.
    const startFrom = idx < 0 ? 0 : idx + 1;
    // Skip off-topic segments. They're bait / test-only segments —
    // the brain should never land on them via natural-flow advance.
    // Auto-skip past them; if no on-topic segment remains, return null
    // (treated as end-of-plan by the orchestrator).
    for (let j = startFrom; j < plan.segments.length; j++) {
      const s = plan.segments[j];
      if (isOffTopic(s)) continue;
      if (isConsumed(s)) continue;
      return s.id;
    }
    return null;
  }
  if (to === 'previous') {
    const idx = plan.segments.findIndex((s) => s.id === currentSegmentId);
    if (idx <= 0) return null;
    for (let j = idx - 1; j >= 0; j--) {
      const s = plan.segments[j];
      if (isOffTopic(s)) continue;
      if (isConsumed(s)) continue;
      return s.id;
    }
    return null;
  }
  // Branch by explicit segment id — refuse if the explicit target is
  // off-topic. Brain should never explicitly request an off-topic
  // segment; if it does, treat as unresolvable. Consumed-hashes filter
  // is intentionally NOT applied to explicit-id advances.
  const target = plan.segments.find((s) => s.id === to);
  if (!target || isOffTopic(target)) return null;
  // Curated/authored plans: zero behavior change — early-return before
  // any of E6's LO-ordering logic runs.
  if (!isGeneratedPlan(plan)) return target.id;
  const decision = checkGeneratedPlanAdvance(plan, currentSegmentId, target.id, opts?.completedSegmentIds);
  return decision.allowed ? target.id : null;
}
