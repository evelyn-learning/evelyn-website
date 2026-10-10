/**
 * Misfiled practice items — MARKS on older items that are filed under one
 * objective of a generated-course skill (nearly always its first, an
 * "understand / define / identify" objective) but actually test a
 * neighbouring objective of the same skill (2026-10-16 audit).
 *
 * A mark is `item id → the objective LO id the item actually tests`, or
 * `null` for an item that tests no objective of its skill. Nothing is
 * re-filed or deleted: the stored row / plan segment, its id and the `loId`
 * it is filed under are untouched, and nothing here is consulted when an
 * answer is graded.
 *
 * What the marks do (practice.ts `retrievePractice`):
 *   - a request for ONE objective (any LO request that is not skill scope)
 *     skips an item marked for a different objective or for none, and gains
 *     the items marked for the requested objective that are filed under
 *     another objective of the same skill plan — through the same withdrawn /
 *     audited gates as any item;
 *   - a SKILL request returns exactly the items it did before, with the same
 *     ids and `loId`; only the internal spread across objectives counts a
 *     marked item under the objective it tests.
 * Topic-scope requests and the live tutor session do not read the marks.
 *
 * Kill switch `TUTOR_PRACTICE_MISFILED_MARKS=off` (default ON; server-side,
 * read per call) restores the behaviour without marks exactly.
 *
 * Withdrawn wins: the builder refuses an id that is on the withdrawn list,
 * and a marked item passes the withdrawn filter like any other. An id on the
 * list that matches no stored item simply never matches.
 *
 * The list is data: regenerate src/data/misfiled-practice-items.json with
 * scripts/audit/build-misfiled-list.ts. No I/O; the only input besides the
 * list is the env switch.
 */
import misfiled from '../../../data/misfiled-practice-items.json';

export const MISFILED_MARKS_ENV = 'TUTOR_PRACTICE_MISFILED_MARKS';

/** item id → objective LO id it actually tests, or null (none of its skill's). */
export type MisfiledMarks = ReadonlyMap<string, string | null>;

/** The committed marks. */
export const MISFILED_ITEM_MARKS: MisfiledMarks = new Map(Object.entries(misfiled.items as Record<string, string | null>));

/** Default ON; only `off` disables. Server-side, read per call. */
export function misfiledMarksEnabled(env: Record<string, string | undefined> = process.env): boolean {
  return (env[MISFILED_MARKS_ENV] ?? '').trim().toLowerCase() !== 'off';
}

/**
 * THE SINGLE-OBJECTIVE RULE, skip half. Drop the items that are marked as
 * testing something other than `loId` (another objective, or none). An
 * unmarked item, and an item marked for `loId` itself, stay. Nothing marked ⇒
 * the SAME array. Pure.
 */
export function withoutMisfiledFor<T extends { id: string }>(items: readonly T[], loId: string, marks: MisfiledMarks): T[] {
  const kept = items.filter((it) => {
    const mark = marks.get(it.id);
    return mark === undefined || mark === loId;
  });
  return kept.length === items.length ? (items as T[]) : kept;
}

const EMPTY: ReadonlySet<string> = new Set();
const indexCache = new WeakMap<MisfiledMarks, Map<string, Set<string>>>();

/**
 * THE SINGLE-OBJECTIVE RULE, gain half: the ids marked as testing `loId`.
 * (Whether one may be served for it — same skill plan, withdrawn, audited —
 * is decided where the pools are assembled.) The reverse index is built once
 * per marks map. Pure.
 */
export function idsMarkedFor(loId: string, marks: MisfiledMarks): ReadonlySet<string> {
  let index = indexCache.get(marks);
  if (!index) {
    index = new Map();
    for (const [id, target] of marks) {
      if (target === null) continue;
      const set = index.get(target) ?? new Set<string>();
      set.add(id);
      index.set(target, set);
    }
    indexCache.set(marks, index);
  }
  return index.get(loId) ?? EMPTY;
}

/**
 * The objective a skill request's spread counts an item under: the marked
 * objective when it is one of the skill's own, else the one it is filed
 * under. Used for ordering only — never for what is returned. Pure.
 */
export function spreadObjectiveOf(id: string, filedObjective: string, skillObjectives: readonly string[], marks: MisfiledMarks): string {
  const mark = marks.get(id);
  return typeof mark === 'string' && skillObjectives.includes(mark) ? mark : filedObjective;
}
