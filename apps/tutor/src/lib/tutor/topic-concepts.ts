/**
 * Concept-level accessors (Step 4, 2026-08-25).
 *
 * Thin, pure lookups over the 4th taxonomy level. Kept in their own module
 * rather than in `topic-taxonomy.ts` so the tagging path can import them
 * without pulling the whole 600-line TOPIC_MAP into every caller's graph.
 *
 * Unit-tested by scripts/test-topic-concepts.ts.
 */
import { getTopicById, type TutorConcept } from './topic-taxonomy';

export type { TutorConcept };

/**
 * Concepts authored beneath a topic. Returns [] for an unknown topic and for
 * the 256 topics that predate Step 4 — absence is the normal case, not an
 * error, and every caller must treat it as such.
 */
export function getConceptsForTopic(topicId: string): TutorConcept[] {
  return getTopicById(topicId)?.concepts ?? [];
}

/**
 * Exact concept lookup, SCOPED TO THE PARENT TOPIC — concept ids are unique
 * within a leaf, not globally, so a bare id is not addressable on its own.
 */
export function findConceptInTopic(topicId: string, conceptId: string): TutorConcept | undefined {
  return getConceptsForTopic(topicId).find((c) => c.id === conceptId);
}

/** Lowercase, collapse whitespace, trim. Mirrors the concept-registry
 *  normalizer's `normalizeLabel` so the two layers agree on what "same
 *  label" means. */
function norm(s: string): string {
  return (s ?? '').toLowerCase().replace(/\s+/g, ' ').trim();
}

/**
 * Map a free-text label the tutor produced onto an AUTHORED concept id,
 * SCOPED to the session's topic. This is the deterministic half of Step 4's
 * tagging judgement.
 *
 * Deliberately no embeddings: authored concepts carry `aliases` precisely so
 * the common phrasings resolve for free, synchronously, with no network and
 * no cost. Labels this cannot place fall through to the existing
 * `concept-registry` normalizer (embedding cosine ≥ 0.85), which is async and
 * off the hot path — see src/lib/tutor/concept-registry/normalizer.ts.
 *
 * Returns undefined rather than guessing. A wrong concept tag is worse than
 * an absent one: the portal counts progress against these.
 */
export function resolveConceptFromLabel(topicId: string, label: string): string | undefined {
  const q = norm(label);
  if (!q) return undefined;
  for (const c of getConceptsForTopic(topicId)) {
    if (norm(c.label) === q || norm(c.id) === q) return c.id;
    if (c.aliases?.some((a) => norm(a) === q)) return c.id;
  }
  return undefined;
}

/**
 * Resolve a session's free-text `topicsCovered` labels into authored concept
 * ids: first-seen order, deduplicated, unresolvable labels DROPPED.
 *
 * Additive by design — the caller keeps emitting `topicsCovered` unchanged.
 * The free-text field stays the source of truth so that if tagging proves
 * noisy the portal's per-node rows can be rebuilt from it rather than being
 * permanently wrong.
 *
 * Returns [] for the 256 leaves that predate Step 4, which is the normal
 * case, not a failure.
 */
export function resolveConceptsCovered(topicId: string, labels: string[]): string[] {
  const out: string[] = [];
  for (const label of labels ?? []) {
    const id = resolveConceptFromLabel(topicId, label);
    if (id && !out.includes(id)) out.push(id);
  }
  return out;
}

/**
 * A concept id becomes a URL segment on evelyntutor.com, so it must be safe
 * there. Enforced at AUTHORING (see scripts/test-topic-concepts.ts) rather
 * than only at the portal's gate: a malformed id downstream does not error,
 * it silently renders as an anchor with no page, which is invisible.
 *
 * Found live by the evelyntutor.com session 2026-08-25 — an emergent
 * registry id (`concept:free-body-ish`) produced a colon inside a path
 * segment. Written as "is it URL-safe" rather than "does it start with
 * `concept:`" on purpose: two id namespaces coexist by design, and a rule
 * naming one prefix catches only that prefix, while a space, slash or
 * capital breaks identically.
 */
export function isUrlSafeConceptId(id: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id ?? '');
}
