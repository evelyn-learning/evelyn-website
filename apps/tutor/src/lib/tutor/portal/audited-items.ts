/**
 * Audited generated items — the allow-list of stored GENERATED practice items
 * (`practice-gen.<loId>.<hash>` ProblemBank rows) that passed an answer-key
 * audit, and the per-partner switch that restricts a partner to that list.
 *
 * Why: generated rows are LO-global by design (practice-gen.ts — one bank
 * row per (LO, content hash), no partner or plan scoping), so an item
 * generated on request by ONE brand's student is fetched for every brand that
 * shares the skill. A partner that has been promised a fixed, audited
 * practice set (a review freeze) must not be served a row that appeared after
 * the audit, whoever caused it to be generated. Switching generation off for
 * that partner (`PRACTICE_GEN_DISABLED_PARTNERS`) stops ITS students creating
 * rows; this stops everyone else's rows reaching it.
 *
 * `PRACTICE_GEN_AUDITED_ONLY_PARTNERS` = comma-separated partner ids. Read at
 * CALL time, trimmed, case-insensitive, whole ids only; unset or empty ⇒
 * nobody. An absent / blank partner id (unknown caller) is never "listed".
 * For a listed partner:
 *   - a generated row whose id is not on the list is never served, never used
 *     as a generation anchor, and never offered by a live session's
 *     generate_problem bank lookup;
 *   - on-demand generation does not run at all — a freshly generated item is
 *     by definition not on the list, so it could not be served anyway.
 * Authored bank rows, plan try-yourselves and live-session `brain-gen.*` rows
 * are not generated practice items and are untouched. Every other partner:
 * the filters return their input unchanged (same array reference).
 *
 * Withdrawn wins: the withdrawn list (withdrawn-items.ts) is applied first
 * and for every caller, and the builder refuses an id that is on both lists.
 *
 * What this is NOT: a delete, or a grading rule. The answer-key resolvers
 * (`resolveGradeItem` / `resolveAssessmentItem` in adapters.ts) do not
 * consult this list — an id already issued to a student still resolves when
 * the answer comes back.
 *
 * The list is data: regenerate src/data/audited-generated-items.json with
 * scripts/audit/build-audited-generated-list.ts. No I/O; the only input
 * besides the list is the env switch.
 */
// Relative on purpose: voice/problem-generator.ts (relative-import-only) loads this too.
import audited from '../../../data/audited-generated-items.json';
import { isGeneratedPracticeItemId } from './essay-practice';
import { isWithdrawnItem } from './withdrawn-items';

export const AUDITED_ONLY_PARTNERS_ENV = 'PRACTICE_GEN_AUDITED_ONLY_PARTNERS';

/** Every audited generated item id. */
export const AUDITED_GENERATED_ITEM_IDS: ReadonlySet<string> = new Set(Object.keys(audited.items as Record<string, string>));

/** Is this id a generated item that passed the audit? */
export function isAuditedGeneratedItem(id: string | null | undefined): boolean {
  return typeof id === 'string' && AUDITED_GENERATED_ITEM_IDS.has(id);
}

/** Is `partnerId` restricted to audited generated items? See the module header. */
export function auditedOnlyForPartner(
  partnerId: string | null | undefined,
  env: Record<string, string | undefined> = process.env,
): boolean {
  const raw = env[AUDITED_ONLY_PARTNERS_ENV];
  if (!raw) return false;
  const id = (partnerId ?? '').trim().toLowerCase();
  if (!id) return false;
  return raw.split(',').some((p) => p.trim().toLowerCase() === id);
}

/** May the item with this id be served to (or used for) `partnerId`? False
 *  only for a generated item that is not on the audited list (or is
 *  withdrawn) when the partner is listed. */
export function servableToPartner(id: string | null | undefined, partnerId: string | null | undefined): boolean {
  if (!isGeneratedPracticeItemId(id)) return true;
  if (!auditedOnlyForPartner(partnerId)) return true;
  return isAuditedGeneratedItem(id) && !isWithdrawnItem(id);
}

function logFiltered(partnerId: string, where: string, count: number): void {
  console.log(`[practice] unaudited generated items filtered partner=${partnerId.trim().toLowerCase()} where=${where} count=${count}`);
}

/**
 * Drop the generated items `partnerId` may not be served. Not listed (or
 * unknown partner, or the env unset) ⇒ the SAME array, untouched. When rows
 * are dropped, one log line with the count (never the ids).
 */
export function withoutUnauditedGenerated<T extends { id: string }>(
  items: readonly T[],
  partnerId: string | null | undefined,
  where: string,
): T[] {
  if (!auditedOnlyForPartner(partnerId)) return items as T[];
  const kept = items.filter((it) => !isGeneratedPracticeItemId(it.id) || (isAuditedGeneratedItem(it.id) && !isWithdrawnItem(it.id)));
  if (kept.length !== items.length) logFiltered(partnerId as string, where, items.length - kept.length);
  return kept;
}

/**
 * The same rule for STORED assignments (homework records keep a copy of each
 * item, so a record written before the partner was listed can still hold an
 * unaudited generated item). For a listed partner the unlisted generated
 * items are removed from what is read back; a skill left with no item and an
 * assignment left with no skill are omitted. Nothing is written — the stored
 * record is unchanged. Not listed ⇒ the same array.
 */
export function withoutUnauditedAssignmentItems<
  L extends { items: ReadonlyArray<{ id: string }> },
  A extends { los: ReadonlyArray<L> },
>(assignments: readonly A[], partnerId: string | null | undefined): A[] {
  if (!auditedOnlyForPartner(partnerId)) return assignments as A[];
  let dropped = 0;
  const out: A[] = [];
  for (const a of assignments) {
    let touched = false;
    const los: L[] = [];
    for (const lo of a.los) {
      const items = lo.items.filter((it) => !isGeneratedPracticeItemId(it.id) || (isAuditedGeneratedItem(it.id) && !isWithdrawnItem(it.id)));
      if (items.length === lo.items.length) { los.push(lo); continue; }
      touched = true;
      dropped += lo.items.length - items.length;
      if (items.length > 0) los.push({ ...lo, items });
    }
    if (!touched) out.push(a);
    else if (los.length > 0) out.push({ ...a, los });
  }
  if (dropped > 0) logFiltered(partnerId as string, 'assigned-practice', dropped);
  return out;
}
