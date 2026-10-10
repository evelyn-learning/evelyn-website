/**
 * Key form of numeric practice rows — PURE logic (no I/O). Tested by
 * key-form-core.test.ts.
 *
 * The question asked of every numeric row: could a student with the RIGHT
 * answer be marked wrong because of the form they type it in, or because of
 * ordinary rounding? This file produces the extra forms worth testing beyond
 * the practice job's own generators (scripts/practice-extend/grader-test.ts
 * `numericSubs`, reached through product-grader.ts), says whether the stem
 * tells the student how to round, and turns a proposal into an exact stem
 * edit. The grading itself is the product's (key-form.ts runs it).
 */
import { parseNumericKey } from '../../src/lib/tutor/portal/numeric-answer-rule';

export interface ExtraForm {
  kind: string;
  text: string;
  /** accept = a correct student could type this, it must be accepted;
   *  coarse = a correct but coarser rounding — only a problem when the stem
   *  gives no rounding / form instruction. */
  expect: 'accept' | 'coarse';
}

const halfUp = (v: number, places: number): string => (Math.sign(v) * Math.round(Math.abs(v) * 10 ** places + 1e-9) / 10 ** places).toFixed(places);
const clean = (s: string): string => (s ?? '').replace(/[−–]/g, '-').replace(/(\d),(?=\d{3}(?!\d))/g, '$1');

/** Does the stem tell the student how to round or which form to give? */
export function stemInstruction(stem: string): { rounding: boolean; fraction: boolean; decimal: boolean } {
  const s = stem ?? '';
  return {
    rounding: /\bdecimal places?\b|\bnearest\b|\bround(?:ed|ing)?\b|\bsignificant (?:figures?|digits?)\b|\bs\.f\.|\bto the cent\b/i.test(s),
    fraction: /\bas an? (?:\w+ )?fraction\b|\bfraction in (?:lowest|simplest) terms\b|\bexact fraction\b/i.test(s),
    decimal: /\bas a decimal\b/i.test(s),
  };
}

/** A more precise value of a DECIMAL key printed in the solution ("= 63.616 ≈ 63.62"). */
export function unroundedInSolution(keyText: string, solution: string): string | null {
  const key = parseNumericKey(keyText);
  // An integer key is left out: next to a whole number the solution's other
  // decimals (table values, given data) are too easily mistaken for it.
  if (!key || key.form !== 'decimal') return null;
  let best: string | null = null;
  for (const m of clean(solution).matchAll(/(?<![\w.])-?\d+\.\d+(?!\d)/g)) {
    const t = m[0];
    const places = t.length - t.indexOf('.') - 1;
    if (places <= key.places) continue;
    const v = Number(t);
    if (Math.abs(Math.abs(v) - Math.abs(key.value)) > 0.5 * 10 ** -key.places + 1e-12) continue;
    if (Math.abs(Math.abs(v) - Math.abs(key.value)) < 1e-12) continue; // the key itself with trailing zeros
    if (!best || places > best.length - best.indexOf('.') - 1) best = Math.sign(v) === Math.sign(key.value) ? t : t.replace(/^-/, '');
  }
  return best;
}

/** Forms a correct student could type that the generators do not cover. */
export function extraForms(row: { answer: string; problemText: string; solutionText: string }): ExtraForm[] {
  const key = parseNumericKey(row.answer);
  if (!key) return [];
  const out: ExtraForm[] = [];
  const add = (kind: string, text: string, expect: ExtraForm['expect']): void => {
    if (text !== key.text && !out.some((f) => f.text === text)) out.push({ kind, text, expect });
  };
  if (key.form === 'fraction') {
    add('decimal-1dp', halfUp(key.value, 1), 'coarse');
    add('decimal-2dp', halfUp(key.value, 2), 'accept');
    add('decimal-3dp', halfUp(key.value, 3), 'accept');
    return out;
  }
  // the exact fraction the solution arrives at, e.g. "= 17/25" for a key of 0.68
  for (const m of clean(row.solutionText).matchAll(/(?<![\w./])(-?\d+)\s*\/\s*(\d+)(?![\w/]|\.\d)/g)) {
    const v = Number(m[1]) / Number(m[2]);
    if (!Number.isFinite(v)) continue;
    const tol = key.form === 'decimal' ? 0.5 * 10 ** -key.places + 1e-12 : 1e-12;
    if (Math.abs(v - key.value) <= tol) add('fraction-from-solution', `${m[1]}/${m[2]}`, 'accept');
  }
  const unrounded = unroundedInSolution(row.answer, row.solutionText);
  if (unrounded) add('unrounded-from-solution', unrounded, 'accept');
  if (key.form === 'decimal' && key.places >= 2) {
    const fewer = halfUp(key.value, key.places - 1);
    if (Number(fewer) !== key.value) add('one-place-fewer', fewer, 'coarse');
  }
  if (/\bpercent|%/.test(row.problemText.slice(-260))) add('percent-sign-spaced', `${key.text} %`, 'accept');
  return out;
}

export type Proposal =
  | { type: 'withdraw' }
  | { type: 'append'; text: string; optional?: boolean; alsoSolution?: string }
  | { type: 'replace'; old: string; new: string; optional?: boolean };

/** The exact stem edit of a proposal: full old and new `problemText`. */
export function stemEdit(stem: string, p: Proposal): { field: 'problemText'; old: string; new: string } | null {
  if (p.type === 'withdraw') return null;
  if (p.type === 'append') {
    if (!p.text.startsWith(' ') || stem.endsWith(' ')) throw new Error('an appended sentence starts with one space and the stem ends without one');
    if (stem.includes(p.text.trim())) throw new Error('the stem already holds the sentence to append');
    return { field: 'problemText', old: stem, new: `${stem}${p.text}` };
  }
  if (stem.split(p.old).length !== 2) throw new Error(`the text to replace occurs ${stem.split(p.old).length - 1} time(s) in the stem`);
  return { field: 'problemText', old: stem, new: stem.replace(p.old, () => p.new) };
}
