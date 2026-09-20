/**
 * Which verified answer key may the judge denial-advisory gate trust?
 *
 * Live 2026-09-06 (portal-3a024b75, 17:42:56 + 17:46:06): the gate read
 * `pendingGeneratedAnswerRef` (x = 7, staged for a "fresh one" whose render
 * was silently dropped) as the key for the problem actually on the board
 * (6x − 12 = 4x + 10, answer 11) and suppressed two correct judge flags.
 * A staged key is only evidence about a problem the student can SEE.
 */
const norm = (s: string) => (s ?? '').replace(/\\[a-z]+/g, ' ').replace(/[${}]/g, '').replace(/\s+/g, '').toLowerCase();

export function verifiedKeyForJudgeGate(args: {
  pending?: { statement: string; expectedAnswer?: string } | null;
  current?: { statement: string; expectedAnswer?: string } | null;
  boardText: string;
}): string | undefined {
  if (args.current?.expectedAnswer) return args.current.expectedAnswer;
  const p = args.pending;
  if (!p?.expectedAnswer) return undefined;
  const stmt = norm(p.statement);
  if (!stmt) return undefined;
  // The statement must be visible on the board (any card), whitespace/markup-insensitive.
  return norm(args.boardText).includes(stmt) ? p.expectedAnswer : undefined;
}
