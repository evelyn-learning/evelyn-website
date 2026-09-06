/**
 * Task 15 — pure formatter for the homework action pin shown on the board
 * when an assignment is finalized this session. No locator ⇒ there is
 * nowhere to send the student, so the pin must never surface (null). No
 * LOs ⇒ nothing was actually assigned, same result.
 */
export function homeworkPinText(a: { los: Array<{ loId: string; title: string; count: number }>; locator?: string }): string | null {
  if (!a.locator || a.los.length === 0) return null;
  const n = a.los.reduce((s, l) => s + l.count, 0);
  const titles = a.los.map((l) => l.title).join(' and ');
  return `Homework · ${a.locator} — ${n} question${n === 1 ? '' : 's'} on ${titles}`;
}
