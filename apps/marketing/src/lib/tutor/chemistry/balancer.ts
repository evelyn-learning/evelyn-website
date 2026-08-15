/**
 * Chemistry equation balancer.
 *
 * Deterministic: given an equation like "Fe + O2 -> Fe2O3", returns
 * the smallest positive-integer coefficients balancing every element.
 * No LLM in the loop — same "Wolfram for math" pattern: deterministic
 * verifier ensures the displayed equation is actually balanced
 * regardless of what the brain wrote.
 *
 * Approach:
 *   1. Parse each side into Compound[] with element counts.
 *   2. Build the conservation matrix A: rows = elements, columns =
 *      compounds. Reactants are positive; products negative. We want
 *      a non-trivial vector x in nullspace(A) with all positive
 *      integer entries.
 *   3. Solve A·x = 0 via rational Gaussian elimination, then scale to
 *      integers and reduce via gcd.
 *
 * Limits: doesn't handle parenthesized formulas like (NH4)2SO4 unless
 * expanded; doesn't auto-detect redox half-reactions. Covers the
 * 80%-case for K-12 chemistry.
 */

// ─── Formula parsing ──────────────────────────────────────────────────────────

/** Map of element symbol → count for a single compound. */
type ElementCounts = Record<string, number>;

interface Compound {
  /** Original formula string. */
  formula: string;
  /** Per-element atom count. */
  counts: ElementCounts;
}

/**
 * Parse a single compound formula into element counts. Supports nested
 * parentheses and integer subscripts. Examples:
 *   "H2O"        → { H: 2, O: 1 }
 *   "Ca(OH)2"    → { Ca: 1, O: 2, H: 2 }
 *   "(NH4)2SO4"  → { N: 2, H: 8, S: 1, O: 4 }
 *   "Al2(SO4)3"  → { Al: 2, S: 3, O: 12 }
 */
export function parseFormula(formula: string): ElementCounts {
  const f = formula.trim();
  if (!f) throw new Error('parseFormula: empty formula');
  // Tokens: element (capital + optional lowercase), digit run, '(', ')'.
  const tokenRe = /([A-Z][a-z]?|\d+|\(|\))/g;
  const tokens: string[] = [];
  let m: RegExpExecArray | null;
  let lastEnd = 0;
  while ((m = tokenRe.exec(f)) !== null) {
    if (m.index !== lastEnd) {
      throw new Error(`parseFormula: unexpected character at "${f.slice(lastEnd, m.index)}" in "${formula}"`);
    }
    tokens.push(m[0]);
    lastEnd = m.index + m[0].length;
  }
  if (lastEnd !== f.length) {
    throw new Error(`parseFormula: trailing junk in "${formula}"`);
  }

  // Recursive-descent: walk tokens, building a stack of group counts.
  // Each group starts at '(' and closes at ')<digits>'.
  const stack: ElementCounts[] = [{}];
  let i = 0;
  while (i < tokens.length) {
    const t = tokens[i];
    if (t === '(') {
      stack.push({});
      i++;
    } else if (t === ')') {
      // Close this group; multiplier in next token if it's digits.
      const inner = stack.pop()!;
      let mult = 1;
      if (i + 1 < tokens.length && /^\d+$/.test(tokens[i + 1])) {
        mult = parseInt(tokens[i + 1], 10);
        i += 2;
      } else {
        i++;
      }
      const top = stack[stack.length - 1];
      for (const [el, n] of Object.entries(inner)) {
        top[el] = (top[el] ?? 0) + n * mult;
      }
    } else if (/^[A-Z]/.test(t)) {
      // Element symbol; following digit (if any) is its subscript.
      let mult = 1;
      if (i + 1 < tokens.length && /^\d+$/.test(tokens[i + 1])) {
        mult = parseInt(tokens[i + 1], 10);
        i += 2;
      } else {
        i++;
      }
      const top = stack[stack.length - 1];
      top[t] = (top[t] ?? 0) + mult;
    } else if (/^\d+$/.test(t)) {
      throw new Error(`parseFormula: unexpected number "${t}" in "${formula}"`);
    } else {
      throw new Error(`parseFormula: unexpected token "${t}" in "${formula}"`);
    }
  }
  if (stack.length !== 1) throw new Error(`parseFormula: unmatched parenthesis in "${formula}"`);
  return stack[0];
}

// ─── Equation parsing ─────────────────────────────────────────────────────────

export interface ParsedEquation {
  reactants: Compound[];
  products: Compound[];
}

/** Parse "A + B -> C + D" (or "→" / "=") into reactants + products.
 *  Strips any existing leading coefficients — the balancer recomputes
 *  them from scratch. */
export function parseEquation(eq: string): ParsedEquation {
  const normalized = eq.replace(/→|⇌|⟶/g, '->').replace(/=/g, '->');
  const sides = normalized.split('->');
  if (sides.length !== 2) throw new Error(`parseEquation: expected exactly one "->" in "${eq}"`);
  const parseSide = (s: string): Compound[] =>
    s.split('+').map((part) => {
      const stripped = part.trim().replace(/^\d+\s*/, '');
      if (!stripped) throw new Error(`parseEquation: empty term in "${eq}"`);
      return { formula: stripped, counts: parseFormula(stripped) };
    });
  return {
    reactants: parseSide(sides[0]),
    products: parseSide(sides[1]),
  };
}

// ─── Rational arithmetic (avoid float drift) ──────────────────────────────────

interface Rational { n: number; d: number }
const R = (n: number, d = 1): Rational => {
  if (d === 0) throw new Error('rational: zero denominator');
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(Math.abs(n), d);
  return { n: n / g, d: d / g };
};
const rAdd = (a: Rational, b: Rational): Rational => R(a.n * b.d + b.n * a.d, a.d * b.d);
const rSub = (a: Rational, b: Rational): Rational => R(a.n * b.d - b.n * a.d, a.d * b.d);
const rMul = (a: Rational, b: Rational): Rational => R(a.n * b.n, a.d * b.d);
const rDiv = (a: Rational, b: Rational): Rational => {
  if (b.n === 0) throw new Error('rational: divide by zero');
  return R(a.n * b.d, a.d * b.n);
};
const rNeg = (a: Rational): Rational => R(-a.n, a.d);
const rIsZero = (a: Rational): boolean => a.n === 0;

function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a || 1;
}
function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

// ─── Solver ───────────────────────────────────────────────────────────────────

export interface BalancedEquation {
  reactants: Array<{ coefficient: number; formula: string }>;
  products: Array<{ coefficient: number; formula: string }>;
  /** Pretty-printed form: "2 H2 + O2 -> 2 H2O". */
  formatted: string;
}

/**
 * Balance an equation. Returns smallest positive-integer coefficients
 * for every compound. Throws when the equation is structurally
 * unbalanceable (different elements on each side, etc.).
 */
export function balanceEquation(eq: string): BalancedEquation {
  const { reactants, products } = parseEquation(eq);
  if (reactants.length === 0 || products.length === 0) {
    throw new Error('balanceEquation: equation must have reactants and products');
  }
  const compounds = [...reactants, ...products];
  const allElements = new Set<string>();
  for (const c of compounds) for (const el of Object.keys(c.counts)) allElements.add(el);
  const elements = Array.from(allElements).sort();

  // Element-conservation: ensure every element appears on both sides.
  for (const el of elements) {
    const onLeft = reactants.some((c) => (c.counts[el] ?? 0) > 0);
    const onRight = products.some((c) => (c.counts[el] ?? 0) > 0);
    if (!onLeft || !onRight) {
      throw new Error(`balanceEquation: element "${el}" appears only on ${onLeft ? 'left' : 'right'} side`);
    }
  }

  // Build matrix A (rows = elements, cols = compounds). Reactants positive,
  // products negative. We want a vector x ≠ 0 with A·x = 0 and x_i > 0.
  const N = compounds.length;
  const M = elements.length;
  const A: Rational[][] = Array.from({ length: M }, () =>
    Array.from({ length: N }, () => R(0)),
  );
  for (let j = 0; j < N; j++) {
    const c = compounds[j];
    const sign = j < reactants.length ? 1 : -1;
    for (let i = 0; i < M; i++) {
      const el = elements[i];
      const k = c.counts[el] ?? 0;
      A[i][j] = R(sign * k);
    }
  }

  // Reduce to RREF. We then read the nullspace dimension; for a
  // well-posed equation with one degree of freedom, rank = N - 1.
  const { rref, pivots } = rref_(A, N, M);
  const freeCols: number[] = [];
  for (let j = 0; j < N; j++) if (!pivots.includes(j)) freeCols.push(j);
  if (freeCols.length === 0) {
    throw new Error('balanceEquation: equation has only the trivial solution (zero coefficients)');
  }
  if (freeCols.length > 1) {
    // Multiple degrees of freedom — equation is underdetermined.
    // Fall back: pick the first free column = 1, others = 0. This
    // gives one valid balance for some sub-equation.
  }

  // Express each pivot variable in terms of the free variables. For a
  // single free var (the common case), set x[freeCol] = 1, then solve.
  const x: Rational[] = Array.from({ length: N }, () => R(0));
  const freeCol = freeCols[0];
  x[freeCol] = R(1);
  // Set other free vars to 0 (won't matter for the common 1-DOF case).
  for (let f = 1; f < freeCols.length; f++) x[freeCols[f]] = R(0);
  // Back-substitute pivot rows.
  for (let r = pivots.length - 1; r >= 0; r--) {
    const pivCol = pivots[r];
    let sum = R(0);
    for (let j = 0; j < N; j++) {
      if (j === pivCol) continue;
      sum = rAdd(sum, rMul(rref[r][j], x[j]));
    }
    x[pivCol] = rNeg(sum);
  }

  // x is now a rational solution to A·x = 0. Scale to positive
  // integers: multiply by lcm of denominators, then divide by gcd of
  // numerators. Flip sign if everything came out negative.
  let denomLcm = 1;
  for (const r of x) denomLcm = lcm(denomLcm, r.d);
  const ints = x.map((r) => Math.round((r.n * denomLcm) / r.d));
  // Either all ≥ 0 or all ≤ 0; flip if needed.
  if (ints.every((v) => v <= 0)) for (let i = 0; i < ints.length; i++) ints[i] = -ints[i];
  if (ints.some((v) => v < 0) && ints.some((v) => v > 0)) {
    throw new Error('balanceEquation: solver produced mixed signs (likely unbalanceable)');
  }
  let coeffGcd = 0;
  for (const v of ints) coeffGcd = gcd(coeffGcd, v);
  const reduced = ints.map((v) => v / (coeffGcd || 1));

  // Final check: every compound got a positive coefficient. If any are
  // zero, the equation contains a redundant compound — flag it.
  if (reduced.some((v) => v === 0)) {
    throw new Error('balanceEquation: at least one compound got coefficient 0 — check the equation has no extraneous terms');
  }
  for (const v of reduced) if (v < 0) throw new Error('balanceEquation: negative coefficient (unexpected)');

  const reactantsBalanced = reactants.map((c, i) => ({ coefficient: reduced[i], formula: c.formula }));
  const productsBalanced = products.map((c, i) => ({ coefficient: reduced[reactants.length + i], formula: c.formula }));

  // Verify: A·reduced should equal 0.
  for (let i = 0; i < M; i++) {
    let sum = 0;
    for (let j = 0; j < N; j++) sum += (j < reactants.length ? 1 : -1) * (compounds[j].counts[elements[i]] ?? 0) * reduced[j];
    if (sum !== 0) {
      throw new Error(`balanceEquation: post-check failed for element ${elements[i]} (residual ${sum})`);
    }
  }

  const fmt = (side: Array<{ coefficient: number; formula: string }>): string =>
    side.map((c) => (c.coefficient === 1 ? c.formula : `${c.coefficient} ${c.formula}`)).join(' + ');
  const formatted = `${fmt(reactantsBalanced)} -> ${fmt(productsBalanced)}`;

  return { reactants: reactantsBalanced, products: productsBalanced, formatted };
}

// ─── RREF ─────────────────────────────────────────────────────────────────────

function rref_(matrix: Rational[][], cols: number, rows: number): { rref: Rational[][]; pivots: number[] } {
  // Deep-copy so we don't mutate the caller.
  const A = matrix.map((row) => row.slice());
  const pivots: number[] = [];
  let r = 0;
  for (let c = 0; c < cols && r < rows; c++) {
    // Find pivot row.
    let pivRow = -1;
    for (let i = r; i < rows; i++) {
      if (!rIsZero(A[i][c])) { pivRow = i; break; }
    }
    if (pivRow < 0) continue;
    // Swap into position.
    if (pivRow !== r) {
      const tmp = A[r]; A[r] = A[pivRow]; A[pivRow] = tmp;
    }
    // Scale pivot row to make leading coefficient 1.
    const piv = A[r][c];
    for (let j = 0; j < cols; j++) A[r][j] = rDiv(A[r][j], piv);
    // Zero out other rows in this column.
    for (let i = 0; i < rows; i++) {
      if (i === r) continue;
      const factor = A[i][c];
      if (rIsZero(factor)) continue;
      for (let j = 0; j < cols; j++) {
        A[i][j] = rSub(A[i][j], rMul(factor, A[r][j]));
      }
    }
    pivots.push(c);
    r++;
  }
  return { rref: A, pivots };
}
