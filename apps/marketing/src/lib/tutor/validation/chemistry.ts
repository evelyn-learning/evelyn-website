/**
 * Chemistry validators.
 *
 * - Formula balance check: parse an equation, count atoms on each side,
 *   verify it's balanced. Returns the per-element deltas when it's not.
 *
 * Accepts a variety of input formats the LLM might emit:
 *   "2H2O + O2 → 2H2O2"
 *   "2 H_2 O + O_2 -> 2 H_2 O_2"
 *   "CH_4 + 2 O_2 \\to CO_2 + 2 H_2 O"
 *   "N2 + 3H2 = 2NH3"
 */

export interface BalanceResult {
  balanced: boolean;
  leftCounts: Record<string, number>;
  rightCounts: Record<string, number>;
  delta: Record<string, number>; // right - left per element; 0 means balanced
  issues?: string[];
}

// Normalize an equation string: strip LaTeX, unify arrow forms, collapse spaces.
function normalizeEquation(raw: string): string {
  let s = raw;
  // Strip common LaTeX wrappers
  s = s.replace(/\\ce\{([^}]+)\}/g, '$1');
  s = s.replace(/\$([^$]+)\$/g, '$1');
  s = s.replace(/\\to\b/g, '->');
  s = s.replace(/\\rightarrow\b/g, '->');
  s = s.replace(/\\Longrightarrow\b/g, '->');
  s = s.replace(/\\leftrightarrow\b/g, '<->');
  s = s.replace(/\\,/g, ' ');
  // Subscripts in LaTeX: H_2 → H2, H_{10} → H10
  s = s.replace(/_\{([^}]+)\}/g, '$1');
  s = s.replace(/_(\d+)/g, '$1');
  // Unicode arrows → ASCII
  s = s.replace(/[→⟶⇒]/g, '->');
  s = s.replace(/[⇌↔]/g, '<->');
  s = s.replace(/[⟵←]/g, '<-');
  // Multiplier dots between number and formula: 2·H2O → 2 H2O
  s = s.replace(/[·⋅*]/g, ' ');
  // Collapse whitespace
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

// Split on "=" or "->" (preferring the latter if present).
function splitSides(eq: string): [string, string] | null {
  let parts: string[];
  if (eq.includes('->')) parts = eq.split(/->/);
  else if (eq.includes('<->')) parts = eq.split(/<->/);
  else if (eq.includes('=')) parts = eq.split(/=/);
  else return null;
  if (parts.length !== 2) return null;
  return [parts[0].trim(), parts[1].trim()];
}

// Parse a single term like "2H2O" or "3Ca(OH)2" into {coefficient, formula}.
// Returns null for phase labels like "(aq)", "(s)", "(l)", "(g)".
function parseTerm(term: string): { coefficient: number; formula: string } | null {
  const t = term.trim();
  if (!t) return null;
  // Strip trailing phase label
  const phased = t.replace(/\s*\((?:aq|s|l|g)\)\s*$/i, '');
  // Leading coefficient (optional)
  const m = phased.match(/^(\d+(?:\.\d+)?)?\s*(.+)$/);
  if (!m) return null;
  const coef = m[1] ? parseFloat(m[1]) : 1;
  const formula = (m[2] || '').trim();
  if (!formula) return null;
  return { coefficient: coef, formula };
}

// Parse a chemical formula ("Ca(OH)2", "H2SO4", "NH4NO3") into element counts.
// Supports nested parentheses up to depth 3.
export function parseFormula(formula: string): Record<string, number> | null {
  const s = formula.replace(/\s+/g, '');
  if (!s) return null;
  const counts: Record<string, number> = {};
  const stack: Array<Record<string, number>> = [{}];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === '(') {
      stack.push({});
      i++;
      continue;
    }
    if (c === ')') {
      if (stack.length < 2) return null; // unmatched
      // Optional multiplier after )
      let j = i + 1;
      let mult = '';
      while (j < s.length && /\d/.test(s[j])) { mult += s[j]; j++; }
      const multiplier = mult ? parseInt(mult, 10) : 1;
      const top = stack.pop()!;
      const into = stack[stack.length - 1];
      for (const [el, n] of Object.entries(top)) {
        into[el] = (into[el] || 0) + n * multiplier;
      }
      i = j;
      continue;
    }
    // Element: uppercase + optional lowercase
    if (/[A-Z]/.test(c)) {
      let j = i + 1;
      let el = c;
      while (j < s.length && /[a-z]/.test(s[j])) { el += s[j]; j++; }
      // Count
      let cnt = '';
      while (j < s.length && /\d/.test(s[j])) { cnt += s[j]; j++; }
      const count = cnt ? parseInt(cnt, 10) : 1;
      const top = stack[stack.length - 1];
      top[el] = (top[el] || 0) + count;
      i = j;
      continue;
    }
    // Skip unknown characters (shouldn't happen for clean input)
    i++;
  }
  if (stack.length !== 1) return null; // unclosed parens
  return { ...counts, ...stack[0] };
}

// Sum parsed terms on a side of the equation.
function sumSide(side: string): Record<string, number> | null {
  const terms = side.split(/\s*\+\s*/);
  const total: Record<string, number> = {};
  for (const term of terms) {
    const parsed = parseTerm(term);
    if (!parsed) return null;
    const counts = parseFormula(parsed.formula);
    if (!counts) return null;
    for (const [el, n] of Object.entries(counts)) {
      total[el] = (total[el] || 0) + n * parsed.coefficient;
    }
  }
  return total;
}

/**
 * Check whether a chemical equation is balanced.
 * Returns per-element deltas so callers can describe the exact imbalance.
 */
export function checkBalance(equation: string): BalanceResult {
  const normalized = normalizeEquation(equation);
  const sides = splitSides(normalized);
  if (!sides) {
    return {
      balanced: false,
      leftCounts: {},
      rightCounts: {},
      delta: {},
      issues: ['Equation did not parse — no arrow or equals found.'],
    };
  }
  const leftCounts = sumSide(sides[0]);
  const rightCounts = sumSide(sides[1]);
  if (!leftCounts || !rightCounts) {
    return {
      balanced: false,
      leftCounts: leftCounts || {},
      rightCounts: rightCounts || {},
      delta: {},
      issues: ['One or more terms failed to parse.'],
    };
  }
  const allElements = new Set([...Object.keys(leftCounts), ...Object.keys(rightCounts)]);
  const delta: Record<string, number> = {};
  const issues: string[] = [];
  for (const el of allElements) {
    const diff = (rightCounts[el] || 0) - (leftCounts[el] || 0);
    delta[el] = diff;
    if (diff !== 0) {
      issues.push(diff > 0
        ? `${el} has ${diff} extra atom(s) on the right (right=${rightCounts[el] || 0}, left=${leftCounts[el] || 0}).`
        : `${el} has ${-diff} extra atom(s) on the left (left=${leftCounts[el] || 0}, right=${rightCounts[el] || 0}).`);
    }
  }
  return {
    balanced: issues.length === 0,
    leftCounts,
    rightCounts,
    delta,
    issues: issues.length ? issues : undefined,
  };
}

/**
 * Simple heuristic auto-balance for a 2-term reactant side + 2-term product
 * side equation. Uses small integer coefficients (1..10) and brute-force
 * search. Returns null if no balance found within the search space.
 * For pedagogical use only — more complex equations should be left to the
 * student to solve (that's the learning objective).
 */
export function suggestSmallIntegerBalance(equation: string): string | null {
  const normalized = normalizeEquation(equation);
  const sides = splitSides(normalized);
  if (!sides) return null;
  // Strip any existing coefficients and collect base formulas
  const parseSideTerms = (side: string) => {
    return side.split(/\s*\+\s*/).map(term => {
      const parsed = parseTerm(term);
      return parsed ? parsed.formula : null;
    }).filter((x): x is string => !!x);
  };
  const lefts = parseSideTerms(sides[0]);
  const rights = parseSideTerms(sides[1]);
  if (lefts.length + rights.length > 6) return null; // too many terms to brute force
  const all = [...lefts, ...rights];
  const atomsOf = all.map(f => parseFormula(f));
  if (atomsOf.some(a => !a)) return null;

  for (let l1 = 1; l1 <= 10; l1++) {
    for (let l2 = 1; l2 <= (lefts.length >= 2 ? 10 : 1); l2++) {
      for (let l3 = 1; l3 <= (lefts.length >= 3 ? 10 : 1); l3++) {
        for (let r1 = 1; r1 <= 10; r1++) {
          for (let r2 = 1; r2 <= (rights.length >= 2 ? 10 : 1); r2++) {
            for (let r3 = 1; r3 <= (rights.length >= 3 ? 10 : 1); r3++) {
              // Build coefs by taking exactly lefts.length left coeffs and
              // rights.length right coeffs. The indexing below was off-by-one.
              const leftCoefs = [l1, l2, l3].slice(0, lefts.length);
              const rightCoefs = [r1, r2, r3].slice(0, rights.length);
              const coefs = [...leftCoefs, ...rightCoefs];
              const leftTotal: Record<string, number> = {};
              const rightTotal: Record<string, number> = {};
              for (let k = 0; k < all.length; k++) {
                const target = k < lefts.length ? leftTotal : rightTotal;
                for (const [el, n] of Object.entries(atomsOf[k]!)) {
                  target[el] = (target[el] || 0) + coefs[k] * n;
                }
              }
              const keys = new Set([...Object.keys(leftTotal), ...Object.keys(rightTotal)]);
              let ok = true;
              for (const key of keys) {
                if ((leftTotal[key] || 0) !== (rightTotal[key] || 0)) { ok = false; break; }
              }
              if (ok) {
                // Reject the all-ones identity when the equation is clearly
                // unbalanced with coef=1 everywhere (that means the student
                // input was already correct and we shouldn't suggest).
                const allOnes = coefs.every(c => c === 1);
                // Check if the equation was unbalanced at coef=1 (otherwise
                // the tutor wouldn't be asking us to balance it).
                if (allOnes) {
                  const unitL: Record<string, number> = {};
                  const unitR: Record<string, number> = {};
                  for (let k = 0; k < all.length; k++) {
                    const target = k < lefts.length ? unitL : unitR;
                    for (const [el, n] of Object.entries(atomsOf[k]!)) {
                      target[el] = (target[el] || 0) + n;
                    }
                  }
                  const alreadyBalanced = Array.from(new Set([...Object.keys(unitL), ...Object.keys(unitR)]))
                    .every(k => (unitL[k] || 0) === (unitR[k] || 0));
                  if (!alreadyBalanced) continue; // pointless suggestion
                }
                // Build formatted equation
                const fmt = (c: number, f: string) => c === 1 ? f : `${c}${f}`;
                const lstr = lefts.map((f, i) => fmt(coefs[i], f)).join(' + ');
                const rstr = rights.map((f, i) => fmt(coefs[lefts.length + i], f)).join(' + ');
                return `${lstr} → ${rstr}`;
              }
            }
          }
        }
      }
    }
  }
  return null;
}
