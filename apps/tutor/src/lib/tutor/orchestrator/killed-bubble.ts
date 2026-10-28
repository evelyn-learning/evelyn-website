// src/lib/tutor/orchestrator/killed-bubble.ts
/**
 * The chat bubble of a killed attempt while its retry runs.
 *
 * WHY (local Geometry run portal-fbf35f94, 2026-10-27): the judge killed a
 * reply after its first sentence; for the ~5 s the retry ran the bubble showed
 * only "That isn't what the vertical angles problem gives." — dimmed, but with
 * no typing caret, so it read as the whole reply and the student (and the test
 * runner) answered it. A killed bubble waiting on its retry stays dimmed AND
 * marked in progress (`streaming`); the retry's bubble replaces it, and the
 * turn-end cleanup drops any that remain (VoiceTutorRealtime.tsx), so it never
 * stands as a finished reply. Text and voice alike. Pure.
 */
export function markKilledBubbleRevising<T extends { id?: unknown; revising?: boolean; streaming?: boolean }>(
  entries: ReadonlyArray<T>,
  killedId: string,
): { entries: T[]; changed: boolean } {
  let changed = false;
  const next = entries.map((e) => {
    if (e.id === killedId && !e.revising) {
      changed = true;
      return { ...e, revising: true, streaming: true };
    }
    return e;
  });
  return { entries: changed ? next : [...entries], changed };
}
