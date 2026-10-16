/**
 * 2026-10-16 (GAC v12, AP Calculus AB): after a wrong "e^4 - 1" the reply said
 * "giving one half times e^4 minus 1" — the withheld (e^4 - 1)/2 in words —
 * and the reveal guard (./whole-answer-reveal.ts) let it through: it matched
 * numbers and exact strings, never an expression's VALUE. This reads a
 * sentence the way a student hears it: spoken operators become symbols, every
 * run of maths in it is evaluated (also with a leading coefficient applied to
 * the rest, the way "one half times e^4 minus 1" is meant), and a run whose
 * value is the withheld expression's value is a hit. With one variable both
 * sides are compared at two sample points.
 *
 * Only the ledger's new-number mode calls this, and only for a withheld value
 * that is an expression (an operator, a constant or a function in it), never a
 * bare number — those stay with the numeric path.
 */

import { spokenNumbersToDigits } from '@/lib/tutor/voice/spoken-numbers';

type Vars = Record<string, number>;

const FUNCS: Record<string, (x: number) => number> = {
  sqrt: Math.sqrt, sin: Math.sin, cos: Math.cos, tan: Math.tan, ln: Math.log, log: Math.log10, exp: Math.exp, abs: Math.abs,
};

/** Recursive-descent evaluator: + - * / ^, unary minus, brackets, implicit
 *  multiplication, π, e, the functions above and the given variables. NaN
 *  when the text is not one expression. Never executes text. */
export function evaluateExpression(src: string, vars: Vars = {}): number {
  const s = src.replace(/\s+/g, '');
  let i = 0;
  const peek = (): string => s[i] ?? '';
  const fail = (): never => { throw new Error('parse'); };
  function primary(): number {
    const c = peek();
    if (c === '(') { i++; const v = sum(); if (peek() !== ')') fail(); i++; return v; }
    if (/[\d.]/.test(c)) {
      const m = /^\d*\.?\d+/.exec(s.slice(i)); if (!m) fail();
      i += m![0].length; return parseFloat(m![0]);
    }
    if (c === 'π') { i++; return Math.PI; }
    const w = /^[a-z]+/i.exec(s.slice(i));
    if (w) {
      const word = w[0].toLowerCase();
      const fn = Object.keys(FUNCS).find((f) => word.startsWith(f));
      if (fn) { i += fn.length; return FUNCS[fn](power()); }
      if (word.startsWith('pi')) { i += 2; return Math.PI; }
      const ch = word[0];
      i += 1;
      if (ch in vars) return vars[ch];
      if (ch === 'e') return Math.E;
      return fail();
    }
    return fail();
  }
  function power(): number {
    if (peek() === '-') { i++; return -power(); }
    if (peek() === '+') { i++; return power(); }
    const base = primary();
    if (peek() === '^') { i++; return Math.pow(base, power()); }
    return base;
  }
  function product(): number {
    let v = power();
    for (;;) {
      const c = peek();
      if (c === '*') { i++; v *= power(); } else if (c === '/') { i++; v /= power(); } else if (c && /[\d.(πa-z]/i.test(c)) { v *= power(); } else return v;
    }
  }
  function sum(): number {
    let v = product();
    for (;;) {
      const c = peek();
      if (c === '+') { i++; v += product(); } else if (c === '-') { i++; v -= product(); } else return v;
    }
  }
  try {
    if (!s) return NaN;
    const v = sum();
    return i === s.length && Number.isFinite(v) ? v : NaN;
  } catch { return NaN; }
}

const ORDINAL_POWERS: Record<string, string> = { second: '2', third: '3', fourth: '4', fifth: '5', sixth: '6', seventh: '7', eighth: '8', ninth: '9', tenth: '10' };
const FRACTION_WORDS: Record<string, string> = { half: '2', halves: '2', third: '3', thirds: '3', quarter: '4', quarters: '4', fourth: '4', fourths: '4', fifth: '5', fifths: '5', sixth: '6', sixths: '6', eighth: '8', eighths: '8', tenth: '10', tenths: '10' };
const SMALL: Record<string, string> = { a: '1', an: '1', one: '1', two: '2', three: '3', four: '4', five: '5', six: '6', seven: '7', eight: '8', nine: '9', ten: '10' };

/** Spoken maths → symbols ("one half times e to the fourth minus one" →
 *  "(1/2) * e^(4) - 1"). Text that is not maths passes through. */
export function spokenMathToSymbols(text: string): string {
  let t = ` ${String(text ?? '')} `
    .replace(/\$|\\\(|\\\)|\\\[|\\\]/g, ' ')
    // exponents and subscripts first, so a fraction's braces hold no braces
    .replace(/([\^_])\{([^{}]*)\}/g, '$1($2)')
    .replace(/\\[dt]?frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g, '(($1)/($2))')
    .replace(/\\sqrt\s*\{([^{}]*)\}/g, 'sqrt($1)')
    .replace(/\\cdot|\\times|×|·/g, '*').replace(/\\pi\b/g, 'π').replace(/[{}]/g, (c) => (c === '{' ? '(' : ')'))
    .replace(/−|–/g, '-').replace(/√\s*\(/g, 'sqrt(').replace(/√\s*(\d+(?:\.\d+)?)/g, 'sqrt($1)')
    .replace(/²/g, '^2').replace(/³/g, '^3').replace(/⁴/g, '^4').replace(/½/g, '(1/2)');
  t = t.replace(/\b(a|an|one|two|three|four|five|six|seven|eight|nine|ten|\d+)[\s-]+(halves|half|thirds?|quarters?|fourths?|fifths?|sixths?|eighths?|tenths?)\b/gi,
    (_m, n: string, d: string) => `(${SMALL[n.toLowerCase()] ?? n}/${FRACTION_WORDS[d.toLowerCase()]})`);
  t = t.replace(/(\(\d+\/\d+\))\s+of\b/g, '$1 *');
  t = spokenNumbersToDigits(t);
  t = t.replace(/\b(\d+(?:\.\d+)?)\s+over\s+(\d+(?:\.\d+)?)\b/gi, '($1/$2)');
  t = t.replace(/\bto\s+the\s+(?:power\s+of\s+)?(\d+|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth)(?:\s+power)?\b/gi,
    (_m, p: string) => `^(${ORDINAL_POWERS[p.toLowerCase()] ?? p})`);
  t = t.replace(/\bto\s+the\s+([a-z])(?:\s+squared)?\b/gi, (m, v: string) => (/squared/i.test(m) ? `^(${v}^2)` : `^(${v})`));
  t = t.replace(/\bsquared\b/gi, '^2').replace(/\bcubed\b/gi, '^3')
    .replace(/\b(?:square\s+root\s+of|root)\s+(\d+(?:\.\d+)?|[a-z])\b/gi, 'sqrt($1)')
    .replace(/\btimes\b|\bmultiplied\s+by\b/gi, '*').replace(/\bdivided\s+by\b|\bover\b/gi, '/')
    .replace(/\bminus\b/gi, '-').replace(/\bplus\b/gi, '+').replace(/\bnegative\b/gi, '-').replace(/\bpi\b/gi, 'π');
  // A small number word next to an operator is a number ("minus one").
  const NUM_WORD = '(one|two|three|four|five|six|seven|eight|nine|ten)';
  t = t.replace(new RegExp(`([-+*/^]\\s*)${NUM_WORD}\\b`, 'gi'), (_m, op: string, w: string) => `${op}${SMALL[w.toLowerCase()]}`)
    .replace(new RegExp(`\\b${NUM_WORD}(\\s*[-+*/^])`, 'gi'), (_m, w: string, op: string) => `${SMALL[w.toLowerCase()]}${op}`);
  return t;
}

/** A word made only of maths: digits, operators, brackets, π, function
 *  names and single letters (never two letters in a row, so prose is out). */
function isMathWord(w: string): boolean {
  if (/^(?:a|i)$/i.test(w)) return false;
  const rest = w.replace(/sqrt|sin|cos|tan|ln|log|exp/gi, '#').replace(/\bpi\b/gi, 'π');
  return /^[\d.()+\-*/^πa-z#]+$/i.test(rest) && !/[a-z]{2}/i.test(rest) && /[\d+\-*/^π#()a-z]/i.test(rest);
}

/** Maximal runs of maths in a symbol-converted sentence. */
function mathRuns(t: string): string[][] {
  const words = t.split(/\s+|,\s*|;\s*/).map((w) => w.replace(/^[.:!?"'“”]+|[.:!?"'“”]+$/g, '')).filter(Boolean);
  const runs: string[][] = [];
  let cur: string[] = [];
  for (const w of words) {
    if (isMathWord(w)) cur.push(w); else { if (cur.length) runs.push(cur); cur = []; }
  }
  if (cur.length) runs.push(cur);
  return runs;
}

const close = (a: number, b: number): boolean => Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= 1e-6 * Math.max(1, Math.abs(a), Math.abs(b));

/** The single variable letter of an expression (other than e), if any. */
function variableOf(expr: string): string | null | undefined {
  const letters = new Set((expr.toLowerCase().replace(/sqrt|sin|cos|tan|ln|log|exp|pi/g, '').match(/[a-z]/g) ?? []).filter((c) => c !== 'e'));
  if (letters.size > 1) return undefined;
  return letters.size ? [...letters][0] : null;
}

const SAMPLES = [0.37, 1.91];

function valuesOf(expr: string, v: string | null): number[] {
  return v ? SAMPLES.map((x) => evaluateExpression(expr, { [v]: x })) : [evaluateExpression(expr)];
}

/** Is `value` an expression this matcher should read (not a bare number)? */
export function isExpressionValue(value: string): boolean {
  const t = spokenMathToSymbols(value).trim();
  if (/^-?\d+(?:\.\d+)?%?$/.test(t)) return false;
  return /[+*/^]|(?<!^)-|π|\be\b|e\^|sqrt|sin|cos|tan|ln|log/i.test(t);
}

/**
 * Does `sentence` say the expression `value` (by value)? `own` = what the
 * student wrote: a run that only repeats their own expression is not a hit.
 */
export function expressionRevealHit(sentence: string, value: string, own: string): string | null {
  const target = spokenMathToSymbols(value).replace(/\s+/g, '');
  const v = variableOf(target);
  if (v === undefined) return null;
  const want = valuesOf(target, v);
  if (!want.every(Number.isFinite)) return null;
  // Every contiguous piece of what the student (or the problem) wrote: a
  // label in front ("c: e^4 - 1") must not hide their own expression.
  const ownRuns = mathRuns(spokenMathToSymbols(own)).flatMap((r) => r.flatMap((_, a) => r.slice(a).map((__, k) => r.slice(a, a + k + 1).join(''))));
  const ownVals = ownRuns.map((r) => valuesOf(r, v));
  const words = mathRuns(spokenMathToSymbols(sentence));
  for (const run of words) {
    for (let a = 0; a < run.length; a++) {
      for (let b = a + 1; b <= run.length; b++) {
        const piece = run.slice(a, b).join('');
        if (!/[+*/^\-]|π|e|sqrt|sin|cos|tan|ln|log/.test(piece.replace(/^-/, ''))) continue;
        if (variableOf(piece) !== v && variableOf(piece) !== null) continue;
        const readings = [piece];
        // "(1/2) * e^4 - 1" said aloud means (1/2)(e^4 - 1).
        const coef = /^(\(?[\d./]+\)?)\*(.+)$/.exec(piece);
        if (coef) readings.push(`${coef[1]}*(${coef[2]})`);
        for (const r of readings) {
          const got = valuesOf(r, v);
          if (!got.every((g, k) => close(g, want[k]))) continue;
          if (ownVals.some((ov) => ov.every((o, k) => close(o, got[k])))) continue;
          return piece;
        }
      }
    }
  }
  return null;
}
