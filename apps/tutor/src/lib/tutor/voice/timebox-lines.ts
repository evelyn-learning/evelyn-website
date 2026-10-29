/**
 * Time-box lines (demo-polish, 2026-10-29).
 *
 * Live embed-1793240679836: the `<demo_stop>` wrap directive ("Wrap up NOW")
 * rode the last two brain turns and the brain ignored it both times; the
 * hard stop then ended the session at 10:00 mid-explanation with no goodbye.
 * A prompt-only wrap is advice; these two fixed lines are the client's own
 * close, spoken by the client the way the demo opener is.
 *
 * Pure; client-safe. The runtime decides WHEN (VoiceTutorRealtime's wrap
 * effect and hard-stop timer); this decides WHAT and whether now is the
 * moment.
 */

export const WRAP_LINE = "We've got about two minutes left, so let's finish this one.";

/** "That's our time for today, Praveen. Nice work." — first word of the
 *  name; without a usable name the clause is dropped. */
export function goodbyeLine(studentName?: string | null): string {
  const first = (studentName ?? '').trim().split(/\s+/)[0] ?? '';
  return first ? `That's our time for today, ${first}. Nice work.` : "That's our time for today. Nice work.";
}

export type WrapLineDecision = 'speak' | 'wait' | 'none';

/** Speak the wrap line once, the first moment the floor is free after the
 *  wrap minute: never over the tutor's own speech, a brain turn in flight,
 *  or a student mid-sentence. */
export function decideWrapLine(s: { wrapPhase: boolean; spoken: boolean; busy: boolean; midUtterance: boolean }): WrapLineDecision {
  if (!s.wrapPhase || s.spoken) return 'none';
  if (s.busy || s.midUtterance) return 'wait';
  return 'speak';
}
