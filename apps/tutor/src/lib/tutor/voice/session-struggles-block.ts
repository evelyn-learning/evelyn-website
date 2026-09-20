/**
 * `<session_struggles>` — the deterministic struggle ledger, rendered into the
 * per-turn user content so the brain's close-of-session tool call is grounded
 * in evidence rather than in its own recollection. Pure: no React, no I/O.
 */
export interface LedgerFlag { loId: string; title: string; detections: number }

/** Live 2026-09-06: the brain said "all locked in" and passed no objectives
 *  to close_session_notes while the ledger held two detections. The ledger
 *  is the deterministic record; the brain is told what it holds. */
export function formatSessionStrugglesBlock(flags: LedgerFlag[] | undefined): string {
  if (!flags?.length) return '';
  const lines = flags.slice(0, 3).map((f) => `- ${f.loId}: ${f.title} (struggled ${f.detections}×)`).join('\n');
  return `<session_struggles>\nObjectives the student struggled with this session, by the deterministic ledger:\n${lines}\nWhen you call close_session_notes, include these ids in assignLoIds unless the student demonstrably recovered on that objective later in the session. Never tell the student a record or system flagged them; speak from what you observed.\n</session_struggles>\n\n`;
}

/**
 * Does this student utterance signal the session is WRAPPING?
 *
 * FINAL REVIEW 2026-09-07 (Important): `<session_struggles>` used to ride
 * EVERY turn once any LO had a detection — an instruction to call
 * close_session_notes sitting in the middle of a lesson, tens of turns before
 * anything is wrapping. It now rides only on a turn that carries a wrap
 * signal, and this is one of the four (the others come from session state: a
 * recap wrap, the plan's `recap` segment, ≥75% of the time budget spent).
 *
 * Deliberately narrow on "finish": "let's finish this problem first" is the
 * OPPOSITE of a wrap, so the finish alternatives are anchored to "for today".
 */
const WRAP_UTTERANCE_RE =
  /\b(?:bye|goodbye|good\s*bye|see you|that'?s (?:all|it) for today|(?:i'?m |we'?re )?done for today|let'?s (?:stop|wrap(?: up)?)|let'?s finish (?:up )?for today|wrap(?:ping)? up|finish(?:ed)? for today|end (?:the )?session)\b/i;

export function isWrapUtterance(text: string | undefined | null): boolean {
  if (!text) return false;
  return WRAP_UTTERANCE_RE.test(text);
}
