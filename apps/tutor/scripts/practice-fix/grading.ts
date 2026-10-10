/**
 * The corrected rows against the product's REAL grading (via
 * product-grader.ts → scripts/practice-extend/grader-test.ts; nothing is
 * copied). Offline: the model judge is that file's stub, which records
 * "deferred" — a free-text key that is not a plain number is never decided
 * here, in the product it goes to the judge.
 *
 * Per corrected row: the stored key must be accepted; every equivalent form a
 * student could type (that file's generators + the entry's own `equivalents`)
 * must be accepted; every wrong answer (the generators' + the entry's
 * `wrongAnswers` + the OLD key when the key changed) must be rejected.
 */
import { freeSubs, grade, mcqSubs, numericSubs, type Outcome, type Sub } from './product-grader';
import type { GradingLine, ResolvedItem } from './core';

export interface GradedSub extends Sub { outcome: Outcome; stored?: Outcome; problem?: string }
export interface GradedRow {
  id: string;
  suffix: string;
  format: string;
  key: string;
  ok: boolean;
  /** free-text rows whose key only the model judge can decide. */
  judgeOnly: boolean;
  problems: string[];
  subs: GradedSub[];
}

export async function gradeResolved(resolved: readonly ResolvedItem[]): Promise<GradedRow[]> {
  const out: GradedRow[] = [];
  for (const { item, before, after } of resolved) {
    const generated = after.responseFormat === 'mcq' ? mcqSubs(after) : after.responseFormat === 'numeric' ? numericSubs(after, []) : freeSubs(after, []);
    const subs: Sub[] = [...generated];
    const have = (t: string): boolean => subs.some((s) => s.text === t);
    for (const e of item.equivalents ?? []) if (!have(e)) subs.push({ cls: 'equiv', kind: 'listed-equivalent', text: e });
    for (const w of item.wrongAnswers ?? []) if (!have(w)) subs.push({ cls: 'wrong', kind: 'listed-wrong', text: w });
    if (item.keyChanged && !have(before.answer)) subs.push({ cls: 'wrong', kind: 'old-key', text: before.answer });
    const graded: GradedSub[] = [];
    const problems: string[] = [];
    for (const s of subs) {
      const g = await grade(after, s.text);
      const both = [g.outcome, g.stored].filter((x): x is Outcome => x !== undefined);
      let problem: string | undefined;
      const listed = s.kind.startsWith('listed') || s.kind === 'old-key';
      if (s.cls === 'key' && both.some((o) => o === 'rejected' || o === 'blocked')) problem = `the key ${JSON.stringify(s.text)} is not accepted`;
      // Generated equivalents of a FREE-text key are reported, not required:
      // the engine has no text normalisation and sends them to the judge.
      if (s.cls === 'equiv' && both.includes('rejected') && (after.responseFormat !== 'free' || listed)) problem = `equivalent ${JSON.stringify(s.text)} (${s.kind}) is rejected`;
      if (s.cls === 'wrong' && both.includes('accepted')) problem = `wrong answer ${JSON.stringify(s.text)} (${s.kind}) is accepted`;
      if (problem) problems.push(problem);
      graded.push({ ...s, ...g, ...(problem ? { problem } : {}) });
    }
    const keySub = graded.find((s) => s.cls === 'key');
    out.push({ id: item.id, suffix: item.suffix, format: after.responseFormat, key: after.answer, ok: problems.length === 0, judgeOnly: keySub?.outcome === 'deferred', problems, subs: graded });
  }
  return out;
}

export function gradingLines(rows: readonly GradedRow[]): Map<string, GradingLine> {
  const n = (r: GradedRow, cls: string, outcome: Outcome): number => r.subs.filter((s) => s.cls === cls && s.outcome === outcome).length;
  return new Map(rows.map((r) => [r.id, {
    id: r.id,
    ok: r.ok,
    summary: r.ok
      ? r.judgeOnly
        ? `key \`${r.key}\` is text: decided by the model judge in the product (not run here); ${n(r, 'wrong', 'rejected')} wrong answer(s) rejected deterministically, ${r.subs.filter((s) => s.outcome === 'deferred').length} submission(s) left to the judge`
        : `key \`${r.key}\` accepted; ${n(r, 'equiv', 'accepted')} equivalent form(s) accepted; ${n(r, 'wrong', 'rejected')} wrong answer(s) rejected`
      : r.problems.join('; '),
  }]));
}
