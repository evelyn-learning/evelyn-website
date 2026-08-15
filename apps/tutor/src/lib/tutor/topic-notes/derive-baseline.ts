/**
 * Derives an in-memory `TopicNotesBaseline` from a runtime-generated
 * lesson plan (`gen-<uuid>` ids, minted by generate-from-text.ts /
 * white-label taxonomy course builds) when no authored TS-seed baseline
 * is registered in `store.ts`.
 *
 * Generated plans can never have an authored baseline — they're minted at
 * runtime and only ever live in Mongo (see `lesson-plan/store.ts`'s
 * `getLessonPlan`). Without this fallback, `resolveTopicNotes` returns
 * null for every one of their topics forever, even after a student's
 * session has written real overlays: `loadStudentTopicNotes` would find
 * the overlay doc, but `resolveTopicNotes` bails out before it ever gets
 * there because the baseline lookup fails first.
 *
 * The derived object is a MINIMAL but structurally real
 * `TopicNotesBaseline` — one theory entry per plan LO, methods pulled
 * straight off worked-example segments when present, no pointers — so
 * the existing overlay-merge path in `resolve.ts` runs completely
 * unchanged. A derived baseline is just a `TopicNotesBaseline` that
 * happens to be built in-memory instead of imported from `seeds/`.
 */

import { getLessonPlan } from '@/lib/tutor/lesson-plan/store';
import { loGroupOf } from '@/lib/tutor/lesson-plan/context';
import type { LessonPlan, Segment } from '@/lib/tutor/lesson-plan/types';
import type { TopicNotesBaseline, TheoryEntry, MethodEntry } from './types';

/** Per-process cache of derived baselines, keyed by planId (== baselineId).
 *  Only successful derivations are cached — a miss (no stored plan, plan
 *  has no LOs) is cheap to re-attempt, and caching negatives would mean a
 *  plan created moments after a first failed lookup stays invisible for
 *  the rest of the process lifetime. */
const derivedBaselineCache = new Map<string, TopicNotesBaseline>();

/** Best-effort plain-text extraction for a segment, used to pick the
 *  "most content-ful" text for an LO's derived theory entry. Every
 *  branch reads only fields that exist verbatim on that segment kind —
 *  nothing is invented. */
function extractSegmentText(seg: Segment): string {
  switch (seg.kind) {
    case 'hook':
      return seg.goal ?? '';
    case 'concept':
      return [seg.goal, ...(seg.keyIdeas ?? [])].filter(Boolean).join(' ');
    case 'worked_example':
      return [seg.problem, ...(seg.steps ?? []), seg.answer].filter(Boolean).join(' ');
    case 'try_yourself':
      return [seg.problem, seg.expectedAnswer].filter(Boolean).join(' ');
    case 'misconception_check':
      return seg.question ?? '';
    case 'recap':
      return (seg.mustRemember ?? []).join(' ');
    case 'extension':
      return [seg.advancedQuestion, seg.hint].filter(Boolean).join(' ');
    default:
      return '';
  }
}

/** Cheap method extraction: a worked-example segment's `steps` is already
 *  an ordered procedure — exactly `MethodEntry`'s shape. Content is
 *  carried through verbatim (problem/steps/answer), never invented.
 *  Returns null for any other segment kind, or a worked-example with no
 *  usable steps (empty methods list is the documented "else empty"
 *  fallback). */
function methodFromWorkedExample(seg: Segment, loId: string): MethodEntry | null {
  if (seg.kind !== 'worked_example') return null;
  const steps = (seg.steps ?? []).map((s) => s.trim()).filter(Boolean);
  if (steps.length === 0) return null;
  return {
    title: seg.problem?.trim() ? seg.problem.trim().slice(0, 80) : `Worked example (${loId})`,
    steps,
    example: seg.answer ? { problem: seg.problem, solution: seg.answer } : undefined,
    relatedLoIds: [loId],
  };
}

/**
 * Builds an in-memory `TopicNotesBaseline` from a stored/generated
 * `LessonPlan`. One theory entry per plan LO; the entry's body is the LO
 * description plus the most content-ful teaching-segment text belonging
 * to that LO. Segments are grouped by `loGroupOf` — the same "<loId>-hook
 * / -concept / -worked / -try" convention the orchestrator itself uses to
 * bucket segments by LO (context.ts), so this reuses tested logic rather
 * than re-deriving the association.
 *
 * Returns null when the plan has no LOs — nothing to build theory from.
 */
export function deriveBaselineFromPlan(plan: LessonPlan): TopicNotesBaseline | null {
  if (!plan.los || plan.los.length === 0) return null;

  const segmentsByLoGroup = new Map<string, Segment[]>();
  for (const seg of plan.segments ?? []) {
    const group = loGroupOf(seg.id);
    const arr = segmentsByLoGroup.get(group) ?? [];
    arr.push(seg);
    segmentsByLoGroup.set(group, arr);
  }

  const theory: TheoryEntry[] = [];
  const methods: MethodEntry[] = [];
  for (const lo of plan.los) {
    const segs = segmentsByLoGroup.get(lo.id) ?? [];
    let bestText = '';
    for (const seg of segs) {
      const text = extractSegmentText(seg);
      if (text.length > bestText.length) bestText = text;
      const method = methodFromWorkedExample(seg, lo.id);
      if (method) methods.push(method);
    }
    const content = [lo.description, bestText].filter(Boolean).join('\n\n') || lo.description;
    theory.push({
      loId: lo.id,
      kind: 'definition',
      title: lo.shortTitle ?? lo.description,
      content,
      sources: [{ type: 'plan', planId: plan.id }],
    });
  }

  const now = new Date().toISOString();
  return {
    baselineId: plan.id,
    course: plan.subject,
    // Generated plans have no CED unit — 0 is a placeholder, never read
    // meaningfully because derived baselines are never registered in
    // store.ts's SEED_BASELINES, so listTopicNotesBaselinesForUnit (the
    // only reader of cedUnit) never sees them. Node-level notes (this
    // module's target) key off baselineId, not cedUnit.
    cedUnit: 0,
    cedTopic: plan.topic ?? plan.id,
    cedTitle: plan.title,
    planId: plan.id,
    theory,
    methods,
    pointers: [],
    baselineVersion: 0,
    lastUpdatedAt: now,
    derived: true,
  };
}

/**
 * Registry-miss fallback for `resolveTopicNotes`: attempts to load a
 * stored plan for `baselineId` and derive a baseline in-memory. Returns
 * null on ANY failure (no stored plan, DB error, plan has no LOs) —
 * exactly the same null the caller already returns on a registry miss,
 * so callers 404 identically either way. Successful derivations are
 * cached per-process.
 */
export async function getOrDeriveTopicNotesBaseline(
  baselineId: string,
): Promise<TopicNotesBaseline | null> {
  const cached = derivedBaselineCache.get(baselineId);
  if (cached) return cached;
  try {
    const plan = await getLessonPlan(baselineId);
    if (!plan) return null;
    const derived = deriveBaselineFromPlan(plan);
    if (!derived) return null;
    derivedBaselineCache.set(baselineId, derived);
    return derived;
  } catch {
    return null;
  }
}
