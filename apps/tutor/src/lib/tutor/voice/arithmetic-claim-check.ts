/**
 * Deterministic detector for spoken tutor sentences that DENY correct arithmetic
 * or ASSERT incorrect arithmetic. Guards against the live bug class:
 *   "Close — check that subtraction.$18 - 3$ isn't $15$ — try that subtraction again."
 * (18 - 3 IS 15 — the tutor denied a correct computation.)
 *
 * Scope is deliberately narrow and conservative: it only fires on a single
 * binary operation between plain numeric literals, e.g. "A op B isn't C" /
 * "A op B is C". Anything with variables, units, percents, ranges, multiple
 * operators, or approximation language is left alone ('ok'). Never throws.
 *
 * Imports spokenNumbersToDigits for normalizing spoken numbers (portal-9a9b7c09).
 */

import { spokenNumbersToDigits } from '@/lib/tutor/voice/spoken-numbers';

export interface ArithmeticClaimResult {
  verdict: 'ok' | 'false_denial' | 'false_assertion';
  /** The normalized claim text that fired, e.g. "18 - 3 isn't 15". */
  claim?: string;
  /** The true computation, e.g. "18 - 3 = 15". */
  correct?: string;
}

const OK: ArithmeticClaimResult = { verdict: 'ok' };

// Approximation language → never judge the sentence.
const APPROX_RE = /≈|~|\\approx\b|\b(?:about|roughly|approximately|around)\b/i;

const NUM = String.raw`-?\d+(?:\.\d+)?`;
const OP = String.raw`[+\-*/]`;
// Denial phrases MUST come before assertion phrases in the alternation so
// "isn't" / "is not" never half-match as "is".
const DENIAL = String.raw`(?:isn't|is\s+not)(?:\s+equal\s+to)?|(?:doesn't|does\s+not)\s+equal|≠`;
const ASSERT = String.raw`that's|equals|is|=|comes\s+out\s+to|gives`;

// (?<![\w.%])  — the first operand must not be glued to a letter/digit/dot/%
//               (rejects "Q3", ".5" continuations, "18cm"-style prefixes).
// (?![\w%])   — the claimed result must not be glued to letters/digits/%
//               (rejects "15cm", "25%").
// Groups: 1=A  2=space-before-op  3=op  4=space-after-op  5=B  6=phrase  7=C
const CLAIM_RE = new RegExp(
  String.raw`(?<![\w.%])(${NUM})(\s*)(${OP})(\s*)(${NUM})\s*,?\s*(${DENIAL}|${ASSERT})\s*(${NUM})(?![\w%])`,
  'gi'
);

// Chained same-operator claim: "A + B + C … is D" (three or more operands).
// portal-9a9b7c09 @451.1s: "Sixteen plus nine plus nine plus four plus
// one-forty-four — that's thirty-eight" (the sum is 182). CLAIM_RE handles
// exactly one binary operation, and its CONTEXT_OPS check deliberately skips
// anything longer, so this shape had no detector at all.
//
// The backreference \2 forces ONE operator family across the whole chain.
// Without it a mixed chain is evaluated left-to-right and contradicts
// precedence: a prototype graded "16 + 9 * 2 is 50" false against 288
// (the correct value is 34) — a false KILL, the exact class this round
// exists to remove. Mixed chains are never judged.
const CHAIN_RE = new RegExp(
  String.raw`(?<![\w.%])(${NUM}\s*([+*])\s*${NUM}(?:\s*\2\s*${NUM})+)\s*[—,-]?\s*(?:${DENIAL}|${ASSERT})\s*\*?(${NUM})\*?(?![\w%.])`,
  'i',
);

/** Chars that, appearing (space-separated) right before/after the claim, mean the
 *  matched expression is a fragment of something bigger — skip it. */
const CONTEXT_OPS = '+-*/^=%';

function checkChainedClaim(text: string): ArithmeticClaimResult {
  const m = text.match(CHAIN_RE);
  if (!m) return OK;
  const [full, expr, op, cRaw] = m;
  const parts = expr.split(/\s*[+*]\s*/).map(parseFloat);
  if (parts.some(Number.isNaN)) return OK;
  const claimed = parseFloat(cRaw);
  if (Number.isNaN(claimed)) return OK;
  const truth = op === '+'
    ? parts.reduce((a, b) => a + b, 0)
    : parts.reduce((a, b) => a * b, 1);
  const denied = new RegExp(DENIAL, 'i').test(full);
  const agree = fmt(truth) === fmt(claimed);
  if (denied) {
    return agree
      ? { verdict: 'false_denial', claim: full.trim(), correct: `${expr} = ${fmt(truth)}` }
      : OK;
  }
  return agree
    ? OK
    : { verdict: 'false_assertion', claim: full.trim(), correct: `${expr} = ${fmt(truth)}` };
}

function normalize(sentence: string): string {
  return sentence
    .replace(/[’‘]/g, "'")
    .replace(/\\times\b|\\cdot\b/g, ' * ')
    .replace(/\\div\b/g, ' / ')
    .replace(/\$/g, ' ') // LaTeX math delimiters → whitespace
    .replace(/−/g, '-') // unicode minus
    .replace(/[×·]/g, ' * ')
    .replace(/÷/g, ' / ')
    .replace(/\bplus\b/gi, ' + ')
    .replace(/\bminus\b/gi, ' - ')
    .replace(/\btimes\b/gi, ' * ')
    .replace(/\bmultiplied\s+by\b/gi, ' * ')
    .replace(/\bdivided\s+by\b/gi, ' / ');
}

function evaluate(a: number, op: string, b: number): number {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return b === 0 ? NaN : a / b;
    default: return NaN;
  }
}

function fmt(n: number): string {
  // Collapse float noise (0.30000000000000004 → "0.3"); ints stay exact.
  return String(parseFloat(n.toFixed(9)));
}

function decimalsOf(numLiteral: string): number {
  const m = /\.(\d+)/.exec(numLiteral);
  return m ? m[1].length : 0;
}

/**
 * Check one spoken sentence for a false arithmetic denial or assertion.
 * Returns 'ok' for everything it cannot judge with certainty. Never throws.
 */
export function checkArithmeticClaims(
  sentence: string,
  opts?: { normalizeSpokenWords?: boolean },
): ArithmeticClaimResult {
  try {
    if (typeof sentence !== 'string' || sentence.length === 0) return OK;
    if (APPROX_RE.test(sentence)) return OK;

    // The tutor speaks numbers as words; NUM is digits-only (portal-9a9b7c09).
    const source = opts?.normalizeSpokenWords === true
      ? spokenNumbersToDigits(sentence)
      : sentence;
    const text = normalize(source);

    // Same-operator chains first — they are invisible to CLAIM_RE below.
    const chained = checkChainedClaim(text);
    if (chained.verdict !== 'ok') return chained;

    CLAIM_RE.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = CLAIM_RE.exec(text)) !== null) {
      if (m[0].length === 0) { CLAIM_RE.lastIndex++; continue; }

      const [, aRaw, spL, op, spR, bRaw, phrase, cRaw] = m;

      // Compact "3-5" (no space on either side of '-') is far more likely a
      // range or hyphenation than subtraction — skip.
      if (op === '-' && spL === '' && spR === '') continue;

      // Preceding context: an operator or digit just before A means the match
      // is the tail of a longer expression ("5 - 3 - 1 is 1") — skip.
      const before = text.slice(0, m.index).replace(/\s+$/, '');
      const prev = before.slice(-1);
      if (prev && (CONTEXT_OPS.includes(prev) || /\d/.test(prev))) continue;

      // Trailing context: an operator followed by a number after C means the
      // claimed result continues ("… is 15 - 2") — skip. A bare trailing '%'
      // means a percentage — skip.
      const after = text.slice(m.index + m[0].length).replace(/^\s+/, '');
      if (/^[+\-*/^=]\s*-?\d/.test(after) || after.startsWith('%')) continue;

      const a = parseFloat(aRaw);
      const b = parseFloat(bRaw);
      const c = parseFloat(cRaw);
      if (!isFinite(a) || !isFinite(b) || !isFinite(c)) continue;
      const actual = evaluate(a, op, b);
      if (!isFinite(actual)) continue;

      const isDenial = /n't|not|≠/i.test(phrase);
      // Exact match (with 1e-9 float tolerance; exact for integer arithmetic
      // since integer +,-,* are exact in doubles well past any spoken range).
      const exactEqual = Math.abs(actual - c) <= 1e-9;
      // For assertions only: a result correctly rounded to the precision the
      // speaker stated ("1 / 3 is 0.33") is not a false assertion.
      const roundedEqual = exactEqual || Math.abs(actual - c) < 0.5 * Math.pow(10, -decimalsOf(cRaw));

      const displayOp = op === '*' ? '×' : op;
      const correct = `${fmt(a)} ${displayOp} ${fmt(b)} = ${fmt(actual)}`;
      const claim = m[0].replace(/\s+/g, ' ').trim();

      if (isDenial && exactEqual) {
        return { verdict: 'false_denial', claim, correct };
      }
      if (!isDenial && !roundedEqual) {
        return { verdict: 'false_assertion', claim, correct };
      }
      // Correct denial or correct assertion — keep scanning the rest.
    }
    return OK;
  } catch {
    return OK;
  }
}
