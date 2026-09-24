/**
 * show_problem statement guard (shared by the client validator in
 * VoiceTutorRealtime and the server-side processToolCall path).
 *
 * Live 2026-09-24 (portal-f03a80cd): a homework problem "$4a = 28$" (9
 * chars) was rejected three times as "missing or empty" by a bare
 * `length < 10` rule, costing a 16 s turn and the board card. Short
 * statements are normal for equation-style homework, so the length floor
 * only applies when the text carries no math at all (no digit, no
 * relational/arithmetic operator) — "hi", "?", "..." still fail.
 */
export function problemStatementTooShort(statement: string): boolean {
  const s = statement.trim();
  if (s.length === 0) return true;
  if (s.length >= 10) return false;
  return !/[0-9=+\-*/^<>≤≥≠×÷]/.test(s);
}
