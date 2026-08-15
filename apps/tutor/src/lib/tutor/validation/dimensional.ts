/**
 * Dimensional analysis validator.
 *
 * Each physical quantity has a 7-dimensional vector in the SI base system
 * (M=mass, L=length, T=time, I=current, Θ=temperature, N=amount, J=luminosity).
 * We expose a tiny symbolic algebra over these vectors so we can verify
 * whether "F = m v²" (say) is dimensionally equivalent to "Newton".
 *
 * The validator accepts a formula expressed over known symbols (m, v, a, F,
 * E, p, t, T, q, I, n, r, L, etc.) and a claimed result unit (e.g. "N"),
 * then checks whether the computed dimensions match. Catches classic
 * physics-formula mistakes like F = m v, E = m c, p = m v².
 *
 * This is a DIMENSIONAL check only — it does not validate numeric constants.
 */

// Dimension vector: [M, L, T, I, Θ, N, J]
export type Dim = readonly [number, number, number, number, number, number, number];

export const DIMENSIONLESS: Dim = [0, 0, 0, 0, 0, 0, 0];

function dimEqual(a: Dim, b: Dim): boolean {
  for (let i = 0; i < 7; i++) if (a[i] !== b[i]) return false;
  return true;
}
function dimMul(a: Dim, b: Dim): Dim {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2], a[3] + b[3], a[4] + b[4], a[5] + b[5], a[6] + b[6]];
}
function dimDiv(a: Dim, b: Dim): Dim {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2], a[3] - b[3], a[4] - b[4], a[5] - b[5], a[6] - b[6]];
}
function dimPow(a: Dim, n: number): Dim {
  return [a[0] * n, a[1] * n, a[2] * n, a[3] * n, a[4] * n, a[5] * n, a[6] * n];
}

// Base symbols. `true` dimensionless (like angles, pure numbers).
const SYMBOLS: Record<string, Dim> = {
  // Base quantities
  m: [1, 0, 0, 0, 0, 0, 0],      // mass
  M: [1, 0, 0, 0, 0, 0, 0],
  l: [0, 1, 0, 0, 0, 0, 0],      // length
  L: [0, 1, 0, 0, 0, 0, 0],
  r: [0, 1, 0, 0, 0, 0, 0],      // radius (length)
  d: [0, 1, 0, 0, 0, 0, 0],      // distance
  h: [0, 1, 0, 0, 0, 0, 0],      // height
  x: [0, 1, 0, 0, 0, 0, 0],      // displacement (commonly length)
  t: [0, 0, 1, 0, 0, 0, 0],      // time
  T: [0, 0, 1, 0, 0, 0, 0],      // period / time
  I: [0, 0, 0, 1, 0, 0, 0],      // current
  // Derived common quantities
  v: [0, 1, -1, 0, 0, 0, 0],     // velocity
  u: [0, 1, -1, 0, 0, 0, 0],     // initial velocity
  c: [0, 1, -1, 0, 0, 0, 0],     // speed of light (velocity)
  a: [0, 1, -2, 0, 0, 0, 0],     // acceleration
  g: [0, 1, -2, 0, 0, 0, 0],     // gravitational acceleration
  F: [1, 1, -2, 0, 0, 0, 0],     // force
  W: [1, 2, -2, 0, 0, 0, 0],     // work / energy
  E: [1, 2, -2, 0, 0, 0, 0],     // energy
  K: [1, 2, -2, 0, 0, 0, 0],     // kinetic energy
  U: [1, 2, -2, 0, 0, 0, 0],     // potential energy
  Q: [1, 2, -2, 0, 0, 0, 0],     // heat
  p: [1, 1, -1, 0, 0, 0, 0],     // momentum
  P: [1, 2, -3, 0, 0, 0, 0],     // power (or pressure if context overrides)
  q: [0, 0, 1, 1, 0, 0, 0],      // electric charge (I·t)
  V: [1, 2, -3, -1, 0, 0, 0],    // voltage
  R: [1, 2, -3, -2, 0, 0, 0],    // resistance
  // Angles etc
  theta: DIMENSIONLESS,
  phi: DIMENSIONLESS,
  pi: DIMENSIONLESS,
  omega: [0, 0, -1, 0, 0, 0, 0], // angular frequency
  f: [0, 0, -1, 0, 0, 0, 0],     // frequency
};

// Named units → dimension vectors. The validator accepts either a raw
// dimension vector (expected?.dim) or a unit name in a limited set.
const UNIT_TO_DIM: Record<string, Dim> = {
  N: [1, 1, -2, 0, 0, 0, 0],
  J: [1, 2, -2, 0, 0, 0, 0],
  W: [1, 2, -3, 0, 0, 0, 0],
  Pa: [1, -1, -2, 0, 0, 0, 0],
  Hz: [0, 0, -1, 0, 0, 0, 0],
  C: [0, 0, 1, 1, 0, 0, 0],
  V: [1, 2, -3, -1, 0, 0, 0],
  Ω: [1, 2, -3, -2, 0, 0, 0],
  ohm: [1, 2, -3, -2, 0, 0, 0],
  s: [0, 0, 1, 0, 0, 0, 0],
  m: [0, 1, 0, 0, 0, 0, 0],
  kg: [1, 0, 0, 0, 0, 0, 0],
  'm/s': [0, 1, -1, 0, 0, 0, 0],
  'm/s^2': [0, 1, -2, 0, 0, 0, 0],
  'm/s²': [0, 1, -2, 0, 0, 0, 0],
  A: [0, 0, 0, 1, 0, 0, 0],
};

// Very small expression parser over: identifiers, *, /, ^, (, ), numeric coefficients.
// Whitespace = implicit multiplication. Subscripts like m_0 are treated as m (ignoring index).
export function dimensionsOf(expr: string): { dim: Dim; unknownSymbols: string[] } {
  // Strip latex subscripts and commands
  let s = expr
    .replace(/_\{([^}]+)\}/g, '')
    .replace(/_[a-zA-Z0-9]+/g, '')
    .replace(/\\cdot/g, '*')
    .replace(/\\times/g, '*')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
    .replace(/\\sqrt\{([^}]+)\}/g, '($1)^(1/2)')
    .replace(/\\pi/g, 'pi')
    .replace(/\\omega/g, 'omega')
    .replace(/\\theta/g, 'theta')
    .replace(/\\phi/g, 'phi')
    .replace(/\s+/g, ' ');

  let i = 0;
  const unknown: string[] = [];

  function peek(): string { return s[i] || ''; }
  function eat(c?: string): string { const ch = s[i++]; if (c && ch !== c) throw new Error(`Expected ${c} got ${ch}`); return ch; }
  function skipWs(): void { while (peek() === ' ') i++; }

  function parseNumber(): number {
    skipWs();
    let num = '';
    while (/[\d.]/.test(peek())) num += eat();
    return parseFloat(num);
  }

  function parseAtom(): Dim {
    skipWs();
    const c = peek();
    if (c === '(') {
      eat('(');
      const val = parseExpr();
      skipWs();
      eat(')');
      return val;
    }
    if (/\d/.test(c)) { parseNumber(); return DIMENSIONLESS; }
    // Identifier (letters)
    let id = '';
    while (/[a-zA-Z]/.test(peek())) id += eat();
    // Multi-letter Greek etc: "pi", "omega", "theta"
    if (SYMBOLS[id]) return SYMBOLS[id];
    if (SYMBOLS[id.toLowerCase()]) return SYMBOLS[id.toLowerCase()];
    if (id.length > 0 && !unknown.includes(id)) unknown.push(id);
    return DIMENSIONLESS;
  }

  function parsePow(): Dim {
    let base = parseAtom();
    skipWs();
    while (peek() === '^') {
      eat('^');
      skipWs();
      // Exponent may be parenthesized or a number/fraction
      let exp: number;
      if (peek() === '(') {
        eat('(');
        // Accept either a number or a fraction like 1/2
        let numStr = '';
        while (peek() !== ')' && i < s.length) numStr += eat();
        eat(')');
        if (numStr.includes('/')) {
          const [a, b] = numStr.split('/');
          exp = parseFloat(a) / parseFloat(b);
        } else exp = parseFloat(numStr);
      } else {
        let numStr = '';
        if (peek() === '-') numStr += eat();
        while (/[\d.]/.test(peek())) numStr += eat();
        exp = parseFloat(numStr);
      }
      base = dimPow(base, exp);
      skipWs();
    }
    return base;
  }

  function parseMulDiv(): Dim {
    let val = parsePow();
    skipWs();
    while (peek() === '*' || peek() === '/' || (/[a-zA-Z(]/.test(peek()) && peek() !== '')) {
      // Implicit or explicit multiplication / division
      const op = peek();
      if (op === '*') { eat('*'); val = dimMul(val, parsePow()); }
      else if (op === '/') { eat('/'); val = dimDiv(val, parsePow()); }
      else {
        // implicit multiply when next token is an identifier or paren
        val = dimMul(val, parsePow());
      }
      skipWs();
    }
    return val;
  }

  function parseExpr(): Dim {
    return parseMulDiv();
  }

  try {
    const dim = parseExpr();
    return { dim, unknownSymbols: unknown };
  } catch {
    return { dim: DIMENSIONLESS, unknownSymbols: unknown };
  }
}

/**
 * Check whether the left and right sides of a formula have the same
 * dimensions. Returns {match, leftDim, rightDim, issues}.
 *
 * Examples:
 *   "F = m a"         → match (both are M·L·T⁻²)
 *   "F = m v"         → mismatch (right is M·L·T⁻¹)
 *   "E = m c^2"       → match (both are M·L²·T⁻²)
 *   "E = m c"         → mismatch
 *   "v = u + a t"     → match
 */
export function checkFormulaDimensions(formula: string): {
  match: boolean;
  leftDim?: Dim;
  rightDim?: Dim;
  issues?: string[];
} {
  if (!formula.includes('=')) return { match: false, issues: ['No "=" found in formula.'] };
  const parts = formula.split('=').map(p => p.trim());
  if (parts.length !== 2) return { match: false, issues: ['Only single-equation formulas supported.'] };
  const leftR = dimensionsOf(parts[0]);
  const rightR = dimensionsOf(parts[1]);
  const match = dimEqual(leftR.dim, rightR.dim);
  const issues: string[] = [];
  if (!match) {
    issues.push(`Left side dimensions ${fmtDim(leftR.dim)} ≠ right side dimensions ${fmtDim(rightR.dim)}.`);
  }
  const unknown = [...new Set([...leftR.unknownSymbols, ...rightR.unknownSymbols])];
  if (unknown.length > 0) {
    issues.push(`Unknown symbols (assumed dimensionless): ${unknown.join(', ')}.`);
  }
  return { match, leftDim: leftR.dim, rightDim: rightR.dim, issues: issues.length ? issues : undefined };
}

function fmtDim(d: Dim): string {
  const labels = ['M', 'L', 'T', 'I', 'Θ', 'N', 'J'];
  const parts: string[] = [];
  for (let i = 0; i < 7; i++) {
    if (d[i] !== 0) parts.push(d[i] === 1 ? labels[i] : `${labels[i]}^${d[i]}`);
  }
  return parts.length ? parts.join('·') : '1 (dimensionless)';
}

/**
 * Check whether an expression resolves to a specific named unit
 * (e.g. "m v² / r" vs "N"). Returns {match, computed, expected}.
 */
export function checkAgainstUnit(expr: string, unit: string): {
  match: boolean;
  computed?: Dim;
  expected?: Dim;
  issues?: string[];
} {
  const expected = UNIT_TO_DIM[unit];
  if (!expected) {
    return { match: false, issues: [`Unknown target unit "${unit}".`] };
  }
  const r = dimensionsOf(expr);
  const match = dimEqual(r.dim, expected);
  return {
    match,
    computed: r.dim,
    expected,
    issues: match ? undefined : [`Expression resolves to ${fmtDim(r.dim)}, which is not ${unit} (${fmtDim(expected)}).`],
  };
}
