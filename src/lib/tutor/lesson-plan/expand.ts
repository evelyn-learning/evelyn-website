/**
 * expandPlanLos — shared core for expanding a picker plan's picked
 * learning objectives into full teaching segments (hook/concept/
 * worked-example/try-yourself).
 *
 * Extracted (Task 5) from `/api/tutor/expand-plan-los` — the engine dev
 * page's original implementation — so the portal-facing
 * `/api/portal/v1/plan-expand` route (also Task 5) can reuse the exact
 * same validate → expand → upsert core instead of duplicating it. Both
 * routes call this function; each maps its `ExpandPlanLosResult` onto its
 * own wire shape (the dev route's shape predates this extraction and must
 * not change — see the doc comment on `capBehavior` below and on the dev
 * route itself).
 *
 * Two behavioural knobs exist because the two callers genuinely disagree
 * on one thing — what to do when the caller picks more LOs than the
 * plan's stored `metadata.allowedMaxLOs` allows:
 *   - the dev route silently truncates to the cap (legacy behaviour, kept
 *     byte-for-byte so the engine dev page doesn't change under it)
 *   - the portal route (Task 5's actual deliverable) REJECTS with a 400
 *     instead — the portal's picker UI already enforces the cap
 *     client-side, so a request that violates it server-side indicates a
 *     client/plan mismatch (e.g. a stale cached plan-generate response)
 *     that should fail loudly rather than silently serve a truncated
 *     session.
 * `priorityLoIds` (partial first-LO expansion) is dev-route-only —
 * the portal route always expands every picked LO in one call — but it's
 * a shared capability because the underlying mechanics (which LOs get
 * segments this call vs. remain pending) live in this core.
 *
 * A third knob, `writeMode`, exists for a correctness reason rather than a
 * UX one. A picker plan served from `findCachedPlan` (plan-generate's topic
 * cache) can be handed out to MULTIPLE students hitting the same
 * topic/grade-band/length-bucket cache key concurrently. If expansion
 * rewrote that plan IN PLACE (same id, `cacheKey` surviving the metadata
 * spread), the first student to expand it would silently mutate the
 * cached row for everyone else: the next cache hit would serve their
 * narrowed, already-expanded plan as `mode: 'full'` (wrong content), and
 * any OTHER concurrent holder whose picks aren't a match would 400 on
 * confirm. `writeMode: 'clone'` (the portal route's mode) avoids this by
 * writing the expanded plan under a brand-new `gen-` id and leaving the
 * plan at the original `planId` — cache row included — completely
 * untouched. `writeMode: 'in-place'` (default, the dev route's legacy
 * behaviour) keeps rewriting under the same id; the dev route's planIds
 * are single-use dev-page sessions, never cache-served, so the hazard
 * doesn't apply there.
 */

import { randomUUID } from 'node:crypto';
import { getLessonPlan, upsertLessonPlan } from './store';
import { expandSegmentsForLOs, buildRecapSegment } from './generate-from-text';
import { parseLessonPlan } from './parser';
import type { LessonPlan, Segment, LearningObjective } from './types';

export interface ExpandPlanLosInput {
  planId: string;
  /** LO ids the student picked. Must be a subset of the plan's LO list. */
  pickedLoIds: string[];
  /** Optional subset of pickedLoIds to expand into segments THIS call
   *  (dev-route-only feature — see module doc). Default: expand every
   *  picked LO. */
  priorityLoIds?: string[];
  /** What to do when pickedLoIds.length exceeds the plan's stored
   *  metadata.allowedMaxLOs. 'truncate' (default) silently caps to the
   *  first N — the dev route's legacy behaviour. 'reject' fails with
   *  `{ ok: false, kind: 'cap_exceeded' }` instead. */
  capBehavior?: 'truncate' | 'reject';
  /** Where to persist the expanded plan. 'in-place' (default) rebuilds
   *  and upserts under the SAME id — the dev route's legacy behaviour.
   *  'clone' writes the expanded plan under a NEW `gen-${randomUUID()}`
   *  id, with `cacheKey` and `pendingPicker` dropped from its metadata,
   *  and leaves the plan at `planId` (and anything cached under it)
   *  completely untouched — required for the portal route, whose
   *  `planId` may be a topic-cache-served picker plan shared by
   *  concurrent students. See the module doc for the full hazard. */
  writeMode?: 'in-place' | 'clone';
}

export interface ExpandPlanLosSuccess {
  ok: true;
  plan: LessonPlan;
  /** Count of picked LOs after resolving against the plan and applying
   *  the cap (truncate mode) — i.e. plan.los.length post-expand. */
  pickedCount: number;
  /** Count of LOs actually expanded into segments THIS call (equals
   *  pickedCount unless priorityLoIds narrowed it). */
  expandedCount: number;
  /** True when some picked LOs were NOT expanded this call (a
   *  priorityLoIds partial call) — a follow-up call is expected. */
  pendingExpansion: boolean;
  /** The actual ids still awaiting expansion (empty unless a priority
   *  subset was used this call). */
  pendingExpansionIds: string[];
  /** pickedLoIds that didn't match any LO in the plan (e.g. a
   *  hallucinated id) — dropped rather than failing the whole call, as
   *  long as at least one id matched. */
  droppedIds: string[];
  timing: { stage2Ms: number };
}

export type ExpandPlanLosFailure =
  | { ok: false; kind: 'plan_not_found' }
  | { ok: false; kind: 'no_matching_los'; droppedIds: string[]; availableIds: string[] }
  | { ok: false; kind: 'cap_exceeded'; allowedMaxLOs: number; pickedCount: number }
  | { ok: false; kind: 'expand_failed'; reason: string; timing: { stage2Ms: number } }
  | { ok: false; kind: 'parse_failed'; reason: string };

export type ExpandPlanLosResult = ExpandPlanLosSuccess | ExpandPlanLosFailure;

export async function expandPlanLos(input: ExpandPlanLosInput): Promise<ExpandPlanLosResult> {
  const { planId, pickedLoIds, priorityLoIds, capBehavior = 'truncate', writeMode = 'in-place' } = input;

  const plan = await getLessonPlan(planId);
  if (!plan) {
    return { ok: false, kind: 'plan_not_found' };
  }

  // Resolve picked ids against the plan's LO list. Tolerate ordering
  // differences; preserve the order the caller supplied. Drop ids that
  // don't match an LO in the plan — the brain has been observed
  // hallucinating ids (lo-1 .. lo-22 when the plan only had 12 LOs). The
  // server is the structural enforcer.
  const losById = new Map<string, LearningObjective>(plan.los.map((lo) => [lo.id, lo]));

  // Shorthand tolerance: generated LO ids are now plan-scoped
  // ("<planId>.lo-3", see namespaceGeneratedLos). The picker segment shows
  // the brain the full id, but a model asked to echo a 40-character id back
  // verbatim sometimes returns only the trailing "lo-3" handle. Accept that
  // shorthand when — and only when — it resolves to exactly one LO in this
  // plan; an ambiguous suffix maps to null and is dropped like any other
  // unmatched id, so the server stays the structural enforcer.
  const bySuffix = new Map<string, LearningObjective | null>();
  for (const lo of plan.los) {
    const dot = lo.id.lastIndexOf('.');
    if (dot < 0) continue;
    const suffix = lo.id.slice(dot + 1);
    if (!suffix || losById.has(suffix)) continue;
    bySuffix.set(suffix, bySuffix.has(suffix) ? null : lo);
  }

  const seenIds = new Set<string>();
  const droppedIds: string[] = [];
  const pickedLOs: LearningObjective[] = [];
  for (const id of pickedLoIds) {
    const lo = losById.get(id) ?? bySuffix.get(id) ?? undefined;
    if (!lo) {
      droppedIds.push(id);
      continue;
    }
    // Dedupe on the RESOLVED id so "<planId>.lo-3" and "lo-3" in the same
    // pick list don't expand the same LO twice.
    if (seenIds.has(lo.id)) continue;
    seenIds.add(lo.id);
    pickedLOs.push(lo);
  }
  if (pickedLOs.length === 0) {
    return {
      ok: false,
      kind: 'no_matching_los',
      droppedIds,
      availableIds: plan.los.map((lo) => lo.id),
    };
  }

  // Cap to allowedMaxLOs from the plan's metadata. This matches the
  // contract the picker segment's `goal` set with the student — "we can
  // cover ${allowedMaxLOs} of these".
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allowedMaxLOs: number | undefined = (plan.metadata as any)?.allowedMaxLOs;
  let capped: LearningObjective[] = pickedLOs;
  if (typeof allowedMaxLOs === 'number' && allowedMaxLOs > 0 && pickedLOs.length > allowedMaxLOs) {
    if (capBehavior === 'reject') {
      return { ok: false, kind: 'cap_exceeded', allowedMaxLOs, pickedCount: pickedLOs.length };
    }
    capped = pickedLOs.slice(0, allowedMaxLOs);
    console.log(
      `[expandPlanLos] capped picks from ${pickedLOs.length} to ${allowedMaxLOs} (planId=${plan.id})`,
    );
  }
  if (droppedIds.length > 0) {
    console.warn(
      `[expandPlanLos] dropped ${droppedIds.length} hallucinated id(s): [${droppedIds.join(',')}] (planId=${plan.id})`,
    );
  }

  // Narrow to priority subset for THIS call (if supplied). The plan's
  // `los` array still gets the full capped picks so the orchestrator
  // knows the full session scope; only the segment-expansion targets
  // change. Priority ids that don't match any LO in `capped` are
  // silently ignored. Empty priority array falls back to expanding all
  // capped LOs (legacy behaviour).
  const priorityIdSet = new Set(
    Array.isArray(priorityLoIds) && priorityLoIds.length > 0
      ? priorityLoIds.filter((id) => capped.some((lo) => lo.id === id))
      : capped.map((lo) => lo.id),
  );
  const toExpand: LearningObjective[] = capped.filter((lo) => priorityIdSet.has(lo.id));
  const isPriorityCall = toExpand.length < capped.length;

  const startedAt = Date.now();
  const stage2 = await expandSegmentsForLOs(toExpand, {
    text: '',
    subject: plan.subject,
    grade: plan.grade,
    topic: plan.topic,
    locale: plan.locale,
  });
  const stage2Ms = Date.now() - startedAt;

  if (!stage2.ok || stage2.segments.length === 0) {
    console.log(
      `[expandPlanLos] stage2 FAILED ok=${stage2.ok} reason="${stage2.reason}" planId=${planId} ms=${stage2Ms}`,
    );
    return { ok: false, kind: 'expand_failed', reason: stage2.reason, timing: { stage2Ms } };
  }

  // Rebuild the plan: in-place mode keeps the original id; clone mode
  // mints a fresh "gen-" id so the write lands as a brand-new document
  // and the plan at `planId` (and its cache row, if any) is never
  // touched — see the module doc's writeMode section. Either way the
  // segments swap to [intro, ...expanded] and the intro segment is
  // regenerated to reflect the picked count and order; los array is
  // narrowed to the picked ones so downstream LO-tracking is accurate.
  const introSegment: Segment = {
    id: 'intro',
    kind: 'hook',
    goal: `Acknowledge the student's pick of ${capped.length} learning objectives, list them in the planned order in 1 sentence, and propose starting with the first one. Stay brief — under 25 spoken words.`,
  };

  // Compute LO ids still awaiting expansion (priority-call only).
  const expandedIds = new Set(toExpand.map((lo) => lo.id));
  const pendingExpansionIds = isPriorityCall
    ? capped.map((lo) => lo.id).filter((id) => !expandedIds.has(id))
    : [];

  const targetId = writeMode === 'clone' ? `gen-${randomUUID()}` : plan.id;

  // Base the new metadata on the ORIGINAL plan's metadata. cacheKey is
  // ALWAYS stripped before anything else touches it, in-place or clone:
  // an expanded plan must never remain findable via findCachedPlan under
  // its source picker plan's cache key (the dev route is unauthenticated
  // and planIds are user-visible via embed tokens, so leaving cacheKey in
  // place there would let anyone mutate a cache-served plan). In clone
  // mode pendingPicker is also stripped — the original's `true` must not
  // carry over onto a plan that's fully expanded from the moment it's
  // written (in-place mode instead sets it to `false` explicitly below,
  // which achieves the same end for that path).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const baseMetadata: Record<string, any> = { ...(plan.metadata ?? {}) };
  delete baseMetadata.cacheKey;
  if (writeMode === 'clone') {
    delete baseMetadata.pendingPicker;
  }

  // Only append the recap once every picked LO has segments. A priority
  // (partial) call — dev-route-only — expands just the first LO(s) to
  // unblock the brain fast, with the rest expanded by a background
  // follow-up call that rebuilds segments in full; appending a recap
  // mid-plan on a partial call would place it before LOs that haven't
  // been taught yet, ahead of the segments the follow-up call still owes.
  const finalSegments: Segment[] = isPriorityCall
    ? [introSegment, ...stage2.segments]
    : [introSegment, ...stage2.segments, buildRecapSegment(capped)];

  let updatedPlan: LessonPlan;
  try {
    updatedPlan = parseLessonPlan({
      ...plan,
      id: targetId,
      los: capped,
      segments: finalSegments,
      metadata: {
        ...baseMetadata,
        ...(writeMode === 'in-place' ? { pendingPicker: false } : {}),
        pickedLoIds: capped.map((lo) => lo.id),
        expandedAt: new Date().toISOString(),
        droppedIds: droppedIds.length > 0 ? droppedIds : undefined,
        // When pendingExpansionIds is non-empty, the orchestrator knows
        // the plan is a partial expansion — a follow-up call with the
        // full picked set is expected to land later in the session.
        pendingExpansion: pendingExpansionIds.length > 0 ? pendingExpansionIds : undefined,
      },
    });
  } catch (err) {
    console.log(`[expandPlanLos] parse FAILED: ${(err as Error).message}`);
    return { ok: false, kind: 'parse_failed', reason: (err as Error).message };
  }

  try {
    await upsertLessonPlan(updatedPlan);
  } catch (err) {
    console.warn('[expandPlanLos] upsert failed (continuing):', err);
  }

  console.log(
    `[expandPlanLos] expanded plan=${updatedPlan.id} ${isPriorityCall ? 'PRIORITY ' : ''}los=${capped.length} expanded=${toExpand.length}${pendingExpansionIds.length > 0 ? ` pending=[${pendingExpansionIds.join(',')}]` : ''} segments=${updatedPlan.segments.length} stage2Ms=${stage2Ms}`,
  );

  return {
    ok: true,
    plan: updatedPlan,
    pickedCount: capped.length,
    expandedCount: toExpand.length,
    pendingExpansion: pendingExpansionIds.length > 0,
    pendingExpansionIds,
    droppedIds,
    timing: { stage2Ms },
  };
}
