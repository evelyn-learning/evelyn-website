/**
 * Curated-plan exact-match slot-in for generated freestyle plans.
 *
 * Given a list of learning objectives extracted from a student's
 * freestyle text, find curated lesson plans whose own LOs match. When a
 * match exists, we can swap the generator-emitted segments for the
 * curated plan's segments — curated content is gold-standard and
 * already-tested pedagogy.
 *
 * v1 policy (per the design discussion): deterministic match ONLY. We
 * compare normalized LO descriptions for strict equality. Fuzzy /
 * embedding-based matching is a v2 enhancement that requires a canonical
 * LO registry; doing it before that exists risks slotting in the wrong
 * plan. False negatives (we miss real matches) are acceptable — the
 * generated segment stays in place and the session still works.
 *
 * Generic by design — no subject heuristics, no topic-specific rules.
 */

import type { LearningObjective, LessonPlan } from './types';
import { listLessonPlans } from './store';

export interface CuratedMatch {
  /** Generated LO that matched. */
  loId: string;
  /** Curated plan whose LO matched. */
  curatedPlanId: string;
  /** Specific curated LO id that matched, for telemetry. */
  matchedCuratedLoId: string;
  /** How we matched. Currently only 'description-equality'. */
  reason: 'description-equality';
}

/** Normalize an LO description for equality comparison. Lowercases,
 *  trims, collapses whitespace, strips trailing punctuation. */
function normalizeDescription(s: string): string {
  return s
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[.,;:!?]+$/g, '')
    .trim();
}

export interface FindCuratedMatchesInput {
  /** Generated LOs to look up. */
  los: ReadonlyArray<LearningObjective>;
  /** Subject filter — only consider curated plans tagged with this
   *  subject (after the store's normal alias expansion). */
  subject: string;
  /** Grade filter — only consider curated plans in the same band. */
  grade: string;
  /** Optional topic narrower. */
  topic?: string;
}

/**
 * Find curated plans whose LO descriptions exactly match (after
 * normalization) any of the supplied generated LOs.
 *
 * Returns at most one match per supplied LO, even if multiple curated
 * plans contain the same LO description. When that ambiguity arises the
 * first hit in catalog order wins — deterministic enough for v1; can
 * be refined later if duplicates become a real problem.
 */
export async function findCuratedMatches(
  input: FindCuratedMatchesInput,
): Promise<CuratedMatch[]> {
  if (!input.los || input.los.length === 0) return [];

  // Pull the candidate catalog once. The store handles seed + DB merge
  // and the subject/grade/topic filtering. We do exact LO-description
  // matching in memory because catalog size is bounded (a few hundred
  // plans) and the comparison is cheap.
  let candidates: LessonPlan[] = [];
  try {
    candidates = await listLessonPlans({
      subject: input.subject,
      grade: input.grade,
      topic: input.topic,
    });
  } catch {
    // Store error: behave as no-match. Generator output stands.
    return [];
  }

  if (candidates.length === 0) return [];

  // Index curated LO descriptions → { planId, loId } for O(1) lookup.
  const index = new Map<string, { planId: string; loId: string }>();
  for (const plan of candidates) {
    for (const lo of plan.los) {
      const key = normalizeDescription(lo.description);
      if (!key || index.has(key)) continue;
      index.set(key, { planId: plan.id, loId: lo.id });
    }
  }

  const out: CuratedMatch[] = [];
  for (const genLo of input.los) {
    const key = normalizeDescription(genLo.description);
    const hit = index.get(key);
    if (hit) {
      out.push({
        loId: genLo.id,
        curatedPlanId: hit.planId,
        matchedCuratedLoId: hit.loId,
        reason: 'description-equality',
      });
    }
  }

  return out;
}
