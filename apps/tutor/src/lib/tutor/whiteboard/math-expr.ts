/**
 * Math-expression normalization for the native (Mafs) function-graph renderer.
 *
 * Converts the brain's `show_function_graph` expressions — LaTeX in x/y, per the
 * tool schema (`\frac{1}{\sqrt{2\pi}}e^{-x^2/2}`) — into evaluable JavaScript.
 * Extracted from GraphRenderer so it can be unit-tested (`npm run test:graph-math`);
 * the renderer is a 'use client' component that can't be imported headlessly.
 */

/**
 * Convert common LaTeX math (\frac, \sqrt, ^{...}, \pi, \cdot, \left/\right,
 * \sin…) into the plain form normalizeMathExpression understands. No-op on plain
 * expressions (no backslash/braces), so the plain-expr path is unaffected.
 */
export function latexToPlainMath(input: string): string {
  let s = input;
  if (!/[\\{}]/.test(s)) return s;
  s = s.replace(/\\(left|right|,|!|;|quad|qquad)/g, '');
  s = s.replace(/\\(cdot|times)\b/g, '*');
  s = s.replace(/\\pi\b/g, '(pi)');
  s = s.replace(/\\ln\b/g, 'log');
  s = s.replace(/\\(sin|cos|tan|sqrt|abs|log)\b/g, '$1');
  // Resolve braced constructs innermost-first (handles nesting like
  // \frac{1}{\sqrt{2\pi}}).
  let prev = '';
  for (let i = 0; i < 50 && s !== prev; i++) {
    prev = s;
    s = s.replace(/\\frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g, '(($1)/($2))');
    s = s.replace(/(sqrt|sin|cos|tan|abs|log)\s*\{([^{}]*)\}/g, '$1(($2))');
    s = s.replace(/\^\s*\{([^{}]*)\}/g, '^(($1))');
  }
  // Any leftover bare braces → parens (defensive).
  return s.replace(/\{/g, '(').replace(/\}/g, ')');
}

/** Normalize a math expression string into evaluable JavaScript. */
export function normalizeMathExpression(fnStr: string, variable: string = 'x'): string {
  let s = latexToPlainMath(fnStr);
  // t -> x for time-based expressions
  if (variable === 'x') s = s.replace(/\bt\b/g, 'x');
  // ^ -> ** for exponentiation
  s = s.replace(/\^/g, '**');
  // JS forbids a unary minus immediately before ** (e.g. `-x**2` is a
  // SyntaxError). Wrap the base so `-x**2` → `-(x**2)` (mathematically
  // identical), which fixes Gaussians like e^{-x^2/2} that otherwise threw
  // and rendered as a flat line.
  s = s.replace(/-\s*([\w.]+)\s*\*\*\s*([\w.]+|\([^()]*\))/g, '-($1**$2)');
  // Common math functions (avoid double-prefixing Math.)
  s = s.replace(/(?<!Math\.)(?<!\w)(sin|cos|tan|sqrt|abs|log)\b/g, 'Math.$1');
  // Constants
  s = s.replace(/\bpi\b/gi, 'Math.PI');
  s = s.replace(/(?<![a-zA-Z.])e\b/g, 'Math.E');
  // Fix "x2" → "x**2" (digit after variable = exponent, not multiply)
  const v = variable;
  s = s.replace(new RegExp(`\\b${v}(\\d)\\b`, 'g'), `${v}**$1`);
  // Implicit multiplication: 2x → 2*x, 4Math → 4*Math, )x → )*x, )( → )*(
  s = s.replace(/(\d)([a-zA-Z(])/g, '$1*$2');
  s = s.replace(/([)])([\dA-Za-z(])/g, '$1*$2');
  s = s.replace(/([)])\s*\(/g, '$1*(');
  return s;
}

/** Parse a function string like "2*t + 5" or LaTeX into an evaluable f(x). */
export function parseFunctionString(fnStr: string): (x: number) => number {
  const processed = normalizeMathExpression(fnStr, 'x');
  return (x: number) => {
    try {
      const result = new Function('x', `"use strict"; return ${processed}`)(x);
      return typeof result === 'number' && isFinite(result) ? result : NaN;
    } catch {
      return NaN;
    }
  };
}

/** Parse a function string like "y**3" or LaTeX into an evaluable f(y). */
export function parseFunctionOfYString(fnStr: string): (y: number) => number {
  const processed = normalizeMathExpression(fnStr, 'y');
  return (y: number) => {
    try {
      const result = new Function('y', `"use strict"; return ${processed}`)(y);
      return typeof result === 'number' && isFinite(result) ? result : NaN;
    } catch {
      return NaN;
    }
  };
}
