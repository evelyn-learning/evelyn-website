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
