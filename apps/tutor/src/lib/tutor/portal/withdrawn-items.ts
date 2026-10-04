/**
 * Withdrawn practice items — ids that must never be SERVED again.
 *
 * Why: the 2026-10-04 answer-key audit (scripts/audit/audit-answer-keys.ts)
 * flagged these items as wrong-keyed, ill-posed or undecided. Serving one
 * marks a correct student answer wrong, and using one as a generation anchor
 * seeds more bad items — so every selection path drops them.
 *
 * What this is NOT: a delete. The stored plan segment / bank row stays, and
 * the answer-key resolvers (`resolveGradeItem` / `resolveAssessmentItem` in
 * adapters.ts) deliberately do not consult this list, because an id already
 * issued to a student must still resolve when their answer comes back.
 *
 * Id shapes (the same ids `retrievePractice` emits):
 *   - bank row:           the bare ProblemBank id (`practice-gen.<loId>.<hash>`);
 *   - plan try-yourself:  `<planId>::<segmentId>` — always plan-qualified;
 *     a bare segment id is never withdrawn (segment ids collide across plans).
 *
 * The list is data: regenerate src/data/withdrawn-practice-items.json with
 * scripts/audit/build-withdrawn-list.ts. Pure module — no I/O, no env, no
 * kill switch (serving a known-bad item is a correctness defect, not a
 * tunable).
 */
// Relative on purpose: voice/problem-generator.ts (relative-import-only) loads this too.
import withdrawn from '../../../data/withdrawn-practice-items.json';

const VERDICT_BY_ID: ReadonlyMap<string, string> = new Map(Object.entries(withdrawn.items as Record<string, string>));

/** Every withdrawn item id. */
export const WITHDRAWN_ITEM_IDS: ReadonlySet<string> = new Set(VERDICT_BY_ID.keys());

/** Is this item id withdrawn from serving? */
export function isWithdrawnItem(id: string | null | undefined): boolean {
  return typeof id === 'string' && WITHDRAWN_ITEM_IDS.has(id);
}

/** The audit verdict that withdrew the item (`KEY_WRONG`, `ILL_POSED`, …). */
export function withdrawnVerdict(id: string | null | undefined): string | undefined {
  return typeof id === 'string' ? VERDICT_BY_ID.get(id) : undefined;
}

/** Drop withdrawn items, logging one line per skipped id. */
export function withoutWithdrawn<T extends { id: string }>(items: readonly T[]): T[] {
  return items.filter((it) => {
    if (!isWithdrawnItem(it.id)) return true;
    logWithdrawnSkip(it.id);
    return false;
  });
}

export function logWithdrawnSkip(id: string): void {
  console.log(`[practice] withdrawn item skipped ${id}`);
}

/* ------------------------------------------------------------------ */
/* Live sessions — the stored KEY of a withdrawn plan segment          */
/* ------------------------------------------------------------------ */

/**
 * Stored-answer fields of a plan segment. Everything here is (or is derived
 * from) the key the audit flagged, so for a withdrawn segment none of it may
 * reach the brain prompt, a card, a guard or the judge:
 *   expectedAnswer / answer  — the key itself (try_yourself / worked_example);
 *   rubric / modelResponse   — full-credit reference responses;
 *   hints                    — authored FROM the stored solution; which of
 *                              them give the answer away cannot be told
 *                              mechanically, so all go;
 *   steps / solution / workedSolution — a worked route to the stored key;
 *   correct*                 — any correct-choice field of an MCQ.
 * `choices[].correct` is cleared separately (the choices themselves stay).
 */
const STORED_KEY_FIELDS: ReadonlySet<string> = new Set([
  'expectedAnswer', 'answer', 'rubric', 'modelResponse', 'hints',
  'steps', 'solution', 'workedSolution',
  'correct', 'correctAnswer', 'correctChoice', 'correctChoiceId', 'correctLetter', 'correctOption',
]);

/** The one prompt line that replaces a withdrawn segment's expected answer.
 *  Generic on purpose (no topic examples). */
export const NO_VERIFIED_ANSWER_LINE =
  'No verified answer is available for this problem. Work the answer out yourself, step by step, ' +
  "before you judge the student's answer — do not treat any answer as correct or incorrect until you have derived it.";

/** Is `<planId>::<segmentId>` a withdrawn plan segment? */
export function isWithdrawnSegment(planId: string | null | undefined, segmentId: string | null | undefined): boolean {
  return !!planId && !!segmentId && isWithdrawnItem(`${planId}::${segmentId}`);
}

/**
 * The segment a LIVE tutoring session may use.
 *
 * A live session walks the plan's segments directly, so a withdrawn
 * try-yourself is still PRESENTED (owner decision 2026-10-04: keep the
 * question) — but its stored key is wrong or unreliable, so it is dropped
 * here and the tutor works the answer out itself; nothing grades against the
 * stored value.
 *
 *   - not withdrawn (or no plan id) → the SAME object, untouched;
 *   - withdrawn → a copy with the same question, every stored-answer field
 *     removed, `correct` cleared from each choice, and `keyWithdrawn: true`.
 *
 * Pure and idempotent. Does not apply to grading an already-issued practice
 * item (`resolveGradeItem` reads the stored segment, by design).
 */
export function effectiveSegment<S>(planId: string | null | undefined, seg: S): S {
  if (!seg || typeof seg !== 'object') return seg;
  const src = seg as unknown as Record<string, unknown>;
  if (!isWithdrawnSegment(planId, typeof src.id === 'string' ? src.id : undefined)) return seg;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(src)) {
    if (STORED_KEY_FIELDS.has(k)) continue;
    if (k === 'choices' && Array.isArray(v)) {
      out[k] = v.map((c) => {
        if (!c || typeof c !== 'object') return c;
        const { correct: _correct, ...rest } = c as Record<string, unknown>;
        void _correct;
        return rest;
      });
      continue;
    }
    out[k] = v;
  }
  out.keyWithdrawn = true;
  return out as unknown as S;
}
