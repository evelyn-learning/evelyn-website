/**
 * Expressions for practice figures — a STRICT front door onto the engine's
 * expression parser (whiteboard/math-expr.ts `normalizeMathExpression`, the
 * same normalisation the function-graph board uses).
 *
 * The board's `parseFunctionString` never refuses: whatever it cannot read
 * evaluates to NaN and the curve is silently missing. A practice figure is
 * drawn once, stored and served, so here an expression is either understood
 * completely or REFUSED (`ExpressionError`) — a figure with a missing curve
 * is never produced.
 *
 * Accepted, after normalisation: numbers, the named variables (`x`, and `y`
 * where the caller allows it), `+ - * / ^`, parentheses, `sin cos tan sqrt
 * abs log ln exp`, `pi`, `e`. `log` and `ln` are both the NATURAL log (the
 * engine's convention). Implicit multiplication is understood after a number
 * or a closing parenthesis (`2x`, `(x+1)(x-2)`, `3sin(x)`); between two
 * letters it is not (`xy` is refused — write `x*y`). LaTeX in the board's
 * dialect (`\frac{1}{x}`, `x^{2}`, `\sqrt{x}`) is accepted.
 *
 * The normalised text is matched token by token against that list before it
 * is compiled, so nothing but arithmetic can reach `new Function`.
 */
import { normalizeMathExpression } from '../whiteboard/math-expr';

export class ExpressionError extends Error {
  constructor(public expr: string, why: string) {
    super(`cannot read expression "${expr}": ${why}`);
    this.name = 'ExpressionError';
  }
}

export type ExprVar = 'x' | 'y';

const MAX_EXPR_CHARS = 200;
const TOKEN_RE = /\s+|Math\.(?:sin|cos|tan|sqrt|abs|log|exp|PI|E)\b|\d+\.?\d*(?:e[+-]?\d+)?|\.\d+|\*\*|[xy]\b|[+\-*/(),]/y;

type TokenKind = 'space' | 'fn' | 'const' | 'num' | 'var' | 'op' | 'open' | 'close';

function kindOf(tok: string): TokenKind {
  if (/^\s+$/.test(tok)) return 'space';
  if (tok === 'Math.PI' || tok === 'Math.E') return 'const';
  if (tok.startsWith('Math.')) return 'fn';
  if (/^[\d.]/.test(tok)) return 'num';
  if (tok === 'x' || tok === 'y') return 'var';
  if (tok === '(') return 'open';
  if (tok === ')') return 'close';
  return 'op';
}

/**
 * Compile `expr` into a function of the listed variables (in that order).
 * The function returns the value as computed — a finite number, ±Infinity or
 * NaN where the expression is undefined; it never throws. Throws
 * `ExpressionError` when the expression is not fully understood.
 */
export function compileExpression(expr: unknown, vars: readonly ExprVar[] = ['x']): (...args: number[]) => number {
  if (typeof expr !== 'string' || expr.trim().length === 0) throw new ExpressionError(String(expr), 'empty');
  if (expr.length > MAX_EXPR_CHARS) throw new ExpressionError(expr.slice(0, 40) + '…', `longer than ${MAX_EXPR_CHARS} characters`);
  // `ln` / `exp` in plain (non-LaTeX) form — the board normaliser knows only
  // `\ln`. Done before it runs so its own rules see `log` / a Math call. The
  // normaliser is told the variable is `y` when `x` alone is not in play, so
  // it leaves a bare `t` alone either way (a `t` is then refused below).
  // A number written against a name (`3sin(x)`, `2x`) is a product; made
  // explicit first, because the normaliser only recognises a function name
  // that does not follow a word character.
  const pre = expr
    .replace(/\\exp\b/g, 'exp')
    .replace(/(\d)\s*(?=[A-Za-z\\])/g, '$1*')
    .replace(/(?<![A-Za-z.])ln\b/g, 'log')
    .replace(/(?<![A-Za-z.])exp\s*\(/g, 'Math.exp(');
  const js = normalizeMathExpression(pre, 'y');
  const allowed = new Set<string>(vars);
  let prev: TokenKind | null = null;
  let at = 0;
  let depth = 0;
  while (at < js.length) {
    TOKEN_RE.lastIndex = at;
    const m = TOKEN_RE.exec(js);
    if (!m) throw new ExpressionError(expr, `unexpected "${js.slice(at, at + 12)}"`);
    at += m[0].length;
    const kind = kindOf(m[0]);
    if (kind === 'space') continue;
    if (kind === 'var' && !allowed.has(m[0])) throw new ExpressionError(expr, `variable "${m[0]}" is not available here (use ${vars.join(', ')})`);
    if (kind === 'open') depth++;
    if (kind === 'close' && --depth < 0) throw new ExpressionError(expr, 'unbalanced parentheses');
    const endsValue = prev === 'num' || prev === 'var' || prev === 'const' || prev === 'close';
    const startsValue = kind === 'num' || kind === 'var' || kind === 'const' || kind === 'fn' || kind === 'open';
    // `x(…)`, `x y`, `2 3`: adjacency the normaliser did not turn into a product.
    if (endsValue && startsValue) throw new ExpressionError(expr, 'write the multiplication explicitly (e.g. x*y, x*(x-1))');
    if (prev === 'fn' && kind !== 'open') throw new ExpressionError(expr, 'a function name must be followed by "("');
    prev = kind;
  }
  if (depth !== 0) throw new ExpressionError(expr, 'unbalanced parentheses');
  if (prev === null) throw new ExpressionError(expr, 'empty');
  if (prev === 'fn' || prev === 'op') throw new ExpressionError(expr, 'ends before the expression is complete');
  let fn: (...args: number[]) => unknown;
  try {
    fn = new Function(...vars, `"use strict"; return (${js});`) as (...args: number[]) => unknown;
    fn(...vars.map(() => 0.37));
  } catch (err) {
    throw new ExpressionError(expr, (err as Error)?.message ?? 'not a valid expression');
  }
  return (...args: number[]) => {
    const v = fn(...args);
    return typeof v === 'number' ? v : NaN;
  };
}
