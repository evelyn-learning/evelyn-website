/**
 * Tutor brain v2 — homework mode's record, as the facts block shows it (homework.ts). Kept apart from
 * homework.ts so the browser, which reads facts.ts, does not load the homework rules with it.
 */
import type { V2HomeworkProblem, V2HomeworkState } from './types';

/** A part's label as the record keeps it (keyed-verdict.ts normLabel). */
export const partLabel = (l: unknown) => String(l ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');

export const oneLine = (s: string, max: number) => String(s ?? '').replace(/[<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);

/** Marks (`part:a`, `value:a=x`) in words: "part a", "x in part a". */
export function marksInWords(marks: ReadonlyArray<string>): string[] {
  return marks.map((m) => {
    if (m.startsWith('part:')) return m.slice(5) ? `part ${m.slice(5)}` : 'the answer';
    const body = m.slice(6); const eq = body.indexOf('=');
    const part = body.slice(0, eq); const value = oneLine(body.slice(eq + 1), 40);
    return part ? `${value} in part ${part}` : value;
  }).filter(Boolean);
}

/** The homework lines of the facts block (facts.ts). */
export function v2HomeworkFacts(hw: V2HomeworkProblem, state: V2HomeworkState | undefined): string[] {
  if (!hw.verified) return [];
  const confirmed = state?.confirmed ?? hw.priorConfirmed ?? [];
  if (state?.done) return ['homework record: every part is confirmed correct: the problem is done'];
  const done = confirmed.filter((m) => m.startsWith('part:')).map((m) => m.slice(5));
  const labels = hw.parts ?? [];
  const open = labels.filter((l) => !done.includes(l));
  const named = (ls: string[]) => ls.map((l) => (l ? `part ${l}` : 'the answer')).join(', ');
  return [`homework record: confirmed correct — ${done.length ? named(done) : 'nothing yet'}${open.length ? `; still open — ${named(open)}` : ''}`];
}
