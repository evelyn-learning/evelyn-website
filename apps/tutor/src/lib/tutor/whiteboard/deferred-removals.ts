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
 * Pure: a Map the caller owns, and functions that take entries out of it.
 */
export type DeferredRemovals = Map<string, { priorIds: string[]; atMs: number }>;

/** A replacement that has not painted this long after its prior was superseded
 *  is not coming (the render stall flush fires well before this). */
export const DEFERRED_REMOVAL_MAX_MS = 20_000;

export function deferRemoval(pending: DeferredRemovals, replacementId: string, priorIds: string[], nowMs: number): void {
  const existing = pending.get(replacementId);
  pending.set(replacementId, {
    priorIds: Array.from(new Set([...(existing?.priorIds ?? []), ...priorIds])),
    atMs: existing?.atMs ?? nowMs,
  });
}

function take(pending: DeferredRemovals, replacementIds: Iterable<string>): string[] {
  const out = new Set<string>();
  for (const id of replacementIds) {
    const entry = pending.get(id);
    if (!entry) continue;
    pending.delete(id);
    for (const p of entry.priorIds) out.add(p);
  }
  return Array.from(out);
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

/** Prior ids owed for replacements that were dropped before painting. */
export function takeRemovalsForIds(pending: DeferredRemovals, replacementIds: ReadonlyArray<string>): string[] {
  return pending.size === 0 ? [] : take(pending, replacementIds);
}

/** Prior ids whose replacement never painted within DEFERRED_REMOVAL_MAX_MS. */
export function takeStaleRemovals(pending: DeferredRemovals, nowMs: number, maxAgeMs: number = DEFERRED_REMOVAL_MAX_MS): string[] {
  const stale: string[] = [];
  for (const [id, entry] of pending) if (nowMs - entry.atMs >= maxAgeMs) stale.push(id);
  return take(pending, stale);
}
