/**
 * Tutor brain v2 — homework mode's record, as the facts block shows it (homework.ts). Kept apart from
 * homework.ts so the browser, which reads facts.ts, does not load the homework rules with it.
 */
import type { V2HomeworkProblem, V2HomeworkState } from './types';

/** A part's label as the record keeps it (keyed-verdict.ts normLabel). */
// 2026-11-24: letters and digits of any script (甲 / 乙, ① / ② all became '').
export const partLabel = (l: unknown) => String(l ?? '').toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');

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

/** The lines both homework kinds share: guessed parts and own-question results (homework-guards.ts). */
export function v2HomeworkGuardFacts(state: V2HomeworkState | undefined): string[] {
  const out: string[] = [];
  if (state?.guessed?.length) out.push(`confirmed correct from a bare guess (the answer is right and final; in a recap say they got it, never how): ${state.guessed.map((g) => (g.label ? `part ${g.label}` : 'the answer')).join(', ')}`);
  if (state?.own?.length) out.push(`results you worked out for the student's own questions (never state one before they write it): ${state.own.map((o) => `${oneLine(o.q, 80)} → ${oneLine(o.a, 60)}`).join('; ')}`);
  return out;
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

/** The whole-sheet lines of the facts block: the problem in play, what is solved and open, and its record. */
export function v2SheetFacts(sheet: import('./types').V2HomeworkSheet, record: V2HomeworkState['sheet'] | undefined): string[] {
  const r = record ?? { current: sheet.problems[0]?.n ?? 1, since: 0, solved: [], confirmed: {} };
  const at = sheet.problems.findIndex((p) => p.n === r.current);
  const open = sheet.problems.filter((p) => !r.solved.includes(p.n)).map((p) => p.n);
  if (!open.length) return ['homework sheet: every problem is solved: the sheet is done'];
  const lines = [`homework sheet: problem ${r.current} of ${sheet.problems.length} is current; solved — ${r.solved.length ? r.solved.join(', ') : 'none'}; open — ${open.join(', ')}`];
  const current = sheet.problems[at];
  if (current) lines.push(...v2HomeworkFacts({ text: current.text, verified: current.verified, hasFigure: false, ...(current.parts ? { parts: current.parts } : {}) }, { confirmed: r.confirmed[String(r.current)] ?? [], ...(r.solved.includes(r.current) ? { done: true } : {}) }).map((l) => l.replace(/^homework record:/, `record of problem ${r.current}:`).replace('the problem is done', 'this problem is done')));
  return lines;
}
