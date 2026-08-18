/**
 * Deterministic evaluator for a show_equation latex that is a plain,
 * variable-free arithmetic expression. Exercised by
 * scripts/test-computable-equation.ts.
 *
 * Why (2026-08-17 triage, portal-e3af265a): the tutor posed
 * `24 \div 4 \cdot 3 - 5` on the board and asked "what does that equal?" —
 * the student answered 13 (correct) and the brain opened "Not quite." No
 * existing guard could fire: arithmetic-claim-check needs an inline
 * "A op B is C" claim in the sentence, inverse-verdict-check needs a
 * verified expectedAnswer, and a bare show_equation produces neither. This
 * evaluator runs at equation dispatch; a computable value rides the
 * EXISTING inverse-verdict kill tier as the verified expected answer for
 * the pending "what does it equal?" question.
 *
 * Deliberately conservative: numbers, + - * / (\cdot \times \div, unicode
 * × ÷ −), parentheses, and simple non-nested \frac{a}{b} only. Anything
 * else — variables, =, comparisons, ^, %, \text, leftover macros — returns
 * null. A lone number also returns null (nothing was computed, so there is
 * no verdict leverage). Same-rank operators evaluate left to right. Pure,
 * never throws, no eval().
 */

export interface ComputableEquation {
  value: number;
  /** Float-noise-collapsed string form, e.g. "13" / "0.3". */
  display: string;
}

function normalize(latex: string): string | null {
  let s = latex;
  // Simple, non-nested \frac{a}{b} → ((a)/(b)). Nested fracs leave a brace
  // behind, which the character whitelist below rejects.
  for (let guard = 0; guard < 8; guard++) {
    const next = s.replace(/\\frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/, '(($1)/($2))');
    if (next === s) break;
    s = next;
  }
  s = s
    .replace(/\\left|\\right/g, '')
    .replace(/\\cdot\b|\\times\b/g, '*')
    .replace(/\\div\b/g, '/')
    .replace(/[×·]/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/\\[,;!:]|~/g, ' ')
    .replace(/\$/g, ' ');
  // Whitelist: digits, dot, + - * /, parentheses, whitespace. Any letter,
  // brace, backslash (unconsumed macro), =, comparison, ^, % → not a plain
  // arithmetic expression.
  if (/[^0-9.+\-*/()\s]/.test(s)) return null;
  return s;
}

type Token = { kind: 'num'; value: number } | { kind: 'op'; op: string };

function tokenize(s: string): Token[] | null {
  const tokens: Token[] = [];
  const re = /\s*(?:(\d+(?:\.\d+)?)|([+\-*/()]))/y;
  let pos = 0;
  while (pos < s.length) {
    re.lastIndex = pos;
    const m = re.exec(s);
    if (!m) {
      // Only trailing whitespace is acceptable past this point.
      return /^\s*$/.test(s.slice(pos)) ? tokens : null;
    }
    if (m[1] !== undefined) tokens.push({ kind: 'num', value: parseFloat(m[1]) });
    else tokens.push({ kind: 'op', op: m[2] });
    pos = re.lastIndex;
  }
  return tokens;
}

export function evaluateComputableLatex(latex: string): ComputableEquation | null {
  const normalized = normalize(latex ?? '');
  if (normalized === null) return null;
  const tokens = tokenize(normalized);
  if (!tokens || tokens.length === 0) return null;
  // A lone number computes nothing — no verdict leverage.
  if (!tokens.some((t) => t.kind === 'op' && '+-*/'.includes(t.op))) return null;

  let i = 0;
  let failed = false;
  const peek = (): Token | undefined => tokens[i];
  const take = (): Token | undefined => tokens[i++];

  function parseFactor(): number {
    const t = take();
    if (!t) { failed = true; return NaN; }
    if (t.kind === 'num') return t.value;
    if (t.op === '-') return -parseFactor();
    if (t.op === '(') {
      const v = parseExpr();
      const close = take();
      if (!close || close.kind !== 'op' || close.op !== ')') { failed = true; return NaN; }
      return v;
    }
    failed = true;
    return NaN;
  }

  function parseTerm(): number {
    let v = parseFactor();
    for (;;) {
      const t = peek();
      if (!t || t.kind !== 'op' || (t.op !== '*' && t.op !== '/')) return v;
      i++;
      const rhs = parseFactor();
      v = t.op === '*' ? v * rhs : rhs === 0 ? NaN : v / rhs;
    }
  }

  function parseExpr(): number {
    let v = parseTerm();
    for (;;) {
      const t = peek();
      if (!t || t.kind !== 'op' || (t.op !== '+' && t.op !== '-')) return v;
      i++;
      const rhs = parseTerm();
      v = t.op === '+' ? v + rhs : v - rhs;
    }
  }

  const value = parseExpr();
  if (failed || i !== tokens.length || !Number.isFinite(value)) return null;
  const display = String(parseFloat(value.toFixed(9)));
  return { value: parseFloat(display), display };
}
