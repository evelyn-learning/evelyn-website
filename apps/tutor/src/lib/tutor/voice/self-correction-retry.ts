/** Retry reason after a mid-turn self-correction. Live 2026-09-06 the
 *  retry resumed mid-routine ("Divide both sides by 2.") instead of
 *  re-applying the student's move — the retry prompt carried no anchor. */
export function buildSelfCorrectionRetryReason(args: {
  sentence: string;
  studentUtterance: string;
  problemStatement?: string;
  lastBoardEquation?: string;
}): string {
  const base =
    `You started self-correcting mid-turn ("${args.sentence.slice(0, 120)}"). ` +
    `That's confusing for the student to hear. Re-emit your response cleanly: recompute first, then speak ONLY the correct version. ` +
    `Do not narrate your own confusion or backtrack out loud.`;
  const move = (args.studentUtterance ?? '').trim();
  const stmt = (args.problemStatement ?? '').trim();
  if (!move && !stmt) return base;
  const anchor: string[] = [];
  if (stmt) anchor.push(`The problem on the board: ${stmt.slice(0, 160)}.`);
  if (args.lastBoardEquation?.trim()) anchor.push(`The last equation you wrote: ${args.lastBoardEquation.trim().slice(0, 160)}.`);
  if (move) anchor.push(`The student's move was: "${move.slice(0, 120)}".`);
  return `${base} Start from the student's move: apply exactly that move to the current equation, write the resulting equation, then speak it. ${anchor.join(' ')}`;
}
