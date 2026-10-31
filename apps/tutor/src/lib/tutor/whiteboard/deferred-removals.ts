/**
 * Evolve-in-place without an empty board.
 *
 * When the tutor draws a newer version of a figure, the runtime removes the
 * one it supersedes. The removal used to reach the board at once, while the
 * replacement waits in the render↔speech buffer for the sentence that
 * introduces it — so the student looked at an empty board for 3–7 seconds
 * (two GameClass sessions, 2026-10-09: tree removed at :43, next tree at :46).
 *
 * The removal is now parked under the id of its replacement and released in
 * the same paint. If the replacement is dropped before it paints (kill
 * retraction) or never arrives, the removal is released anyway — the
 * catalog already considers the old figure gone, so the board must follow.
 *
 * Task 22 §B (GDI run 10, 1233–1236 s): the sentence board's auto-card
 * replace parks its removal here too, but with `keepPriorOnDrop` — a brain
 * card that re-shows an auto card's sentence and is then retracted by a kill
 * must leave the auto card ON the board (the retry may never re-show it), so a
 * dropped replacement owes nothing for such an entry; its priors are reported
 * as KEPT instead.
 *
 * Pure: a Map the caller owns, and functions that take entries out of it.
 */
export type DeferredRemovals = Map<string, { priorIds: string[]; atMs: number; keepPriorOnDrop: boolean }>;

/** A replacement that has not painted this long after its prior was superseded
 *  is not coming (the render stall flush fires well before this). */
export const DEFERRED_REMOVAL_MAX_MS = 20_000;

export function deferRemoval(
  pending: DeferredRemovals,
  replacementId: string,
  priorIds: string[],
  nowMs: number,
  opts?: { keepPriorOnDrop?: boolean },
): void {
  const existing = pending.get(replacementId);
  const keep = opts?.keepPriorOnDrop === true;
  pending.set(replacementId, {
    priorIds: Array.from(new Set([...(existing?.priorIds ?? []), ...priorIds])),
    atMs: existing?.atMs ?? nowMs,
    // A merged entry keeps its priors on a drop only if every deferral into it asked to.
    keepPriorOnDrop: existing ? existing.keepPriorOnDrop && keep : keep,
  });
}

function take(pending: DeferredRemovals, replacementIds: Iterable<string>): string[] {
  return takeSplit(pending, replacementIds).all;
}

function takeSplit(pending: DeferredRemovals, replacementIds: Iterable<string>): { all: string[]; owed: string[]; kept: string[] } {
  const owed = new Set<string>();
  const kept = new Set<string>();
  for (const id of replacementIds) {
    const entry = pending.get(id);
    if (!entry) continue;
    pending.delete(id);
    for (const p of entry.priorIds) (entry.keepPriorOnDrop ? kept : owed).add(p);
  }
  // A prior owed by one entry is owed, whatever another entry says.
  for (const p of owed) kept.delete(p);
  return { all: [...owed, ...kept], owed: Array.from(owed), kept: Array.from(kept) };
}

/** Prior ids to remove now because their replacement is in this paint batch. */
export function takeRemovalsForBatch(pending: DeferredRemovals, commands: ReadonlyArray<unknown>): string[] {
  if (pending.size === 0) return [];
  const ids: string[] = [];
  for (const c of commands) {
    const id = (c as { id?: unknown } | null)?.id;
    if (typeof id === 'string') ids.push(id);
  }
  return take(pending, ids);
}

/** Prior ids owed for replacements that were dropped before painting. An
 *  entry deferred with `keepPriorOnDrop` owes nothing (its prior stays). */
export function takeRemovalsForIds(pending: DeferredRemovals, replacementIds: ReadonlyArray<string>): string[] {
  return takeDroppedReplacements(pending, replacementIds).owed;
}

/** Replacements dropped before painting: `owed` = priors to remove now (the
 *  figure-evolve case), `kept` = priors that stay on the board (entries
 *  deferred with `keepPriorOnDrop` — the sentence-board replace). */
export function takeDroppedReplacements(pending: DeferredRemovals, replacementIds: ReadonlyArray<string>): { owed: string[]; kept: string[] } {
  if (pending.size === 0) return { owed: [], kept: [] };
  const { owed, kept } = takeSplit(pending, replacementIds);
  return { owed, kept };
}

/** Prior ids whose replacement never painted within DEFERRED_REMOVAL_MAX_MS.
 *  Task 22 fix round 1 (m3): `only` limits the sweep to one kind of entry —
 *  the figure-evolve backstop (keepPriorOnDrop false) and the sentence-board
 *  backstop (true) each sweep their own. */
export function takeStaleRemovals(
  pending: DeferredRemovals,
  nowMs: number,
  maxAgeMs: number = DEFERRED_REMOVAL_MAX_MS,
  only?: { keepPriorOnDrop: boolean },
): string[] {
  const stale: string[] = [];
  for (const [id, entry] of pending) {
    if (only && entry.keepPriorOnDrop !== only.keepPriorOnDrop) continue;
    if (nowMs - entry.atMs >= maxAgeMs) stale.push(id);
  }
  return take(pending, stale);
}
