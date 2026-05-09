/**
 * Concept-label normalizer (STUB — embedding match not yet implemented).
 *
 * Purpose. Brain emits free-form `conceptLabel` strings via
 * `flag_prerequisite_gap` (e.g. "factoring quadratics"). To roll those
 * up across students for the weak-areas surface and for cross-plan
 * remediation routing, labels must canonicalize to a stable `conceptId`.
 *
 * End-state design (path "e" — bootstrap registry from data):
 *   1. Embed the incoming label (1536-d, same primitive as
 *      api/showcase/lesson-engine/match-image).
 *   2. Cosine-match against existing entries in a Concept registry
 *      (Mongo collection — TBD `Concept` model). If similarity > 0.85,
 *      return the matched conceptId.
 *   3. If no match, create a new Concept stub with
 *      `status: 'auto-generated'`, the raw label, and an emit-count.
 *      Once a stub is emitted by the brain across N distinct sessions
 *      (≥5), surface in an admin queue for human review (label
 *      cleanup + parent + prerequisite edges authoring).
 *
 * Tonight (v1 STUB): the function returns null for every label, which
 * leaves `GapEntry.conceptId` unpopulated. The capture layer + the dev
 * surface still work — gaps display by their raw `conceptLabel`. This
 * is the seam; replacing the stub with real logic later requires no
 * other change.
 *
 * NOT YET WIRED at the commit endpoint. Hooking this into the route
 * would be a one-liner (after recordGap returns, walk the just-added
 * 'prerequisite' gaps and populate conceptId via a normalizer call) —
 * deferred until the registry exists.
 */

export interface CanonicalizeResult {
  conceptId: string;
  label: string;
  similarity: number;
}

/** STUB: returns null for every label — no registry yet. */
export async function canonicalizeConceptLabel(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  rawLabel: string,
): Promise<CanonicalizeResult | null> {
  return null;
}
