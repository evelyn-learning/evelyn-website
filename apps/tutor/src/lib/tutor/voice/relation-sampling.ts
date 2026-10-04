/**
 * Exact comparator for ONE-VARIABLE LINEAR relations (inequalities, compound
 * inequalities and equations). Exercised by scripts/test-relation-sampling.ts.
 *
 * Why: the answer matcher returns "unknown" for anything containing
 * < > ≤ ≥, so nothing could check an inequality step. Production sessions
 * showed wrong inequality steps on the whiteboard (a flipped comparator, a
 * strict/non-strict swap at a boundary) and wrong typed answers praised.
 *
 * Overriding property: return `unknown` — NEVER a wrong verdict — whenever the
 * module is not certain it parsed both sides. A false "differs" would later
 * destroy correct tutoring, so every doubtful input class bails out with a
 * reason instead of guessing.
 *
 * Same style as computable-equation.ts: hand-written normaliser + tokenizer +
 * recursive descent, no eval(), pure, never throws, client-safe (no imports,
 * no env reads).
 *
 * Decision procedure: every side must be AFFINE in the single variable
 * (derived symbolically, then cross-checked by evaluating the tree at four
 * rational points). A comparison of two affine sides holds on a ray, a point,
 * everywhere or nowhere, so each relation's solution set is convex and its
 * membership only changes at a boundary root. Testing both relations on the
 * grid {every root, midpoints of adjacent roots, min−1, max+1, integer
 * neighbours of each root} is therefore an exact decision — in exact rational
 * arithmetic throughout; a float never decides a boundary.
 */

export type Cmp = '<' | '<=' | '>' | '>=' | '=';

/** Exact, reduced, d > 0. */
export interface Rational { n: number; d: number }

export type Expr =
  | { kind: 'num'; value: Rational }
  | { kind: 'var' }
  | { kind: 'neg'; arg: Expr }
  | { kind: 'bin'; op: '+' | '-' | '*' | '/'; left: Expr; right: Expr };

/** 2 parts (a ? b) or 3 parts (a ? b ? c, meaning (a ? b) AND (b ? c)). */
export interface Relation { variable: string; parts: Expr[]; ops: Cmp[]; source: string }

export type ParseResult = { ok: true; relation: Relation } | { ok: false; reason: string };

export type SetCompare =
  | { verdict: 'equivalent' }
  | { verdict: 'differs'; kind: 'drops' | 'adds' | 'both'; witness: Rational; aHolds: boolean; bHolds: boolean }
  | { verdict: 'unknown'; reason: string };

// ── internal bail-out ───────────────────────────────────────────────────────
// Thrown only inside this module and always caught by the exported functions.
class Bail {
  constructor(public readonly reason: string) {}
}
const reasonOf = (e: unknown): string => (e instanceof Bail ? e.reason : 'internal failure');

const MAX_RELATION_LENGTH = 400;
const MAX_STATEMENT_LENGTH = 4000;
const MAX_DEPTH = 40;
/** Private marker for a hard gap (\quad, newline): never multiplied across. */
const GAP = '\u0001';

// ── exact rational arithmetic ───────────────────────────────────────────────
// Every intermediate integer is checked: if a true product/sum exceeds 2^53−1
// the float result is ≥ 2^53 (rounding is monotonic) and so fails
// isSafeInteger — overflow can never pass silently.
function safe(v: number): number {
  if (!Number.isSafeInteger(v)) throw new Bail('number too large for exact arithmetic');
  return v === 0 ? 0 : v;
}

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) { const t = a % b; a = b; b = t; }
  return a;
}

function rat(n: number, d: number): Rational {
  safe(n);
  safe(d);
  if (d === 0) throw new Bail('division by zero');
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(n, d) || 1;
  return { n: safe(n / g), d: safe(d / g) };
}

const ZERO: Rational = { n: 0, d: 1 };
const ONE: Rational = { n: 1, d: 1 };
const int = (n: number): Rational => rat(n, 1);
const add = (a: Rational, b: Rational): Rational => rat(safe(safe(a.n * b.d) + safe(b.n * a.d)), safe(a.d * b.d));
const sub = (a: Rational, b: Rational): Rational => rat(safe(safe(a.n * b.d) - safe(b.n * a.d)), safe(a.d * b.d));
const mul = (a: Rational, b: Rational): Rational => rat(safe(a.n * b.n), safe(a.d * b.d));
function div(a: Rational, b: Rational): Rational {
  if (b.n === 0) throw new Bail('division by zero');
  return rat(safe(a.n * b.d), safe(a.d * b.n));
}
const neg = (a: Rational): Rational => rat(-a.n, a.d);
/** −1 / 0 / 1. Both cross products are exact, so the sign is exact. */
const cmpRat = (a: Rational, b: Rational): number => {
  const l = safe(a.n * b.d);
  const r = safe(b.n * a.d);
  return l < r ? -1 : l > r ? 1 : 0;
};
const isZero = (a: Rational): boolean => a.n === 0;
function floorRat(a: Rational): number {
  const m = ((a.n % a.d) + a.d) % a.d;
  return safe(safe(a.n - m) / a.d);
}
function isRational(w: unknown): w is Rational {
  const r = w as Rational | null | undefined;
  return !!r && Number.isSafeInteger(r.n) && Number.isSafeInteger(r.d) && r.d > 0;
}

// ── normalisation ───────────────────────────────────────────────────────────
function normalize(text: string): string {
  if (typeof text !== 'string') throw new Bail('not a string');
  if (text.length > MAX_RELATION_LENGTH) throw new Bail('input too long');
  if (text.trim() === '') throw new Bail('empty input');
  if (text.includes(GAP)) throw new Bail('unsupported character');
  let s = text;

  // Named rejections first (anything not named still dies on the whitelist).
  if (/\\neq?(?![a-zA-Z])|\\not(?![a-zA-Z])|≠|!=/.test(s)) throw new Bail('not-equal relation is not an interval');
  if (/\^/.test(s)) throw new Bail('exponent');
  if (/\||\\[lr]?[vV]ert(?![a-zA-Z])|\\abs(?![a-zA-Z])/.test(s)) throw new Bail('absolute value');
  if (/\\sqrt(?![a-zA-Z])|√/.test(s)) throw new Bail('square root');
  if (/\\(?:text[a-z]*|mathrm|mathbf|mathit|operatorname|mbox)(?![a-zA-Z])/.test(s)) throw new Bail('text macro');
  if (/\\(?:lor|land|vee|wedge|cup|cap|in)(?![a-zA-Z])|[∪∩∈∨∧]/.test(s)) throw new Bail('set / logical join');

  s = s
    .replace(/\$/g, ' ')
    .replace(/\\left(?![a-zA-Z])|\\right(?![a-zA-Z])/g, '')
    .replace(/\\q?quad(?![a-zA-Z])/g, ` ${GAP} `)
    .replace(/[\r\n]+/g, ` ${GAP} `)
    .replace(/\\[,;:! ]|~/g, ' ')
    .replace(/\\(?:leqslant|leq|le)(?![a-zA-Z])|≤|⩽/g, '<=')
    .replace(/\\(?:geqslant|geq|ge)(?![a-zA-Z])|≥|⩾/g, '>=')
    .replace(/\\lt(?![a-zA-Z])/g, '<')
    .replace(/\\gt(?![a-zA-Z])/g, '>')
    .replace(/−/g, '-')
    .replace(/\\cdot(?![a-zA-Z])|\\times(?![a-zA-Z])|[·×]/g, '*')
    .replace(/\\div(?![a-zA-Z])|÷/g, '/');

  // A digit directly before a fraction is a mixed number (2½), which the
  // implicit-multiplication rule would silently read as 2 × ½.
  if (/\d\s*\\[dt]?frac(?![a-zA-Z])/.test(s)) throw new Bail('mixed number');

  // Simple, non-nested \frac{a}{b} → ((a)/(b)). A nested frac leaves a brace
  // behind, which the whitelist below rejects.
  for (let guard = 0; guard < 8; guard++) {
    const next = s.replace(/\\[dt]?frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/, '(($1)/($2))');
    if (next === s) break;
    s = next;
  }

  // One trailing sentence mark ("x < 6."): "6." is not a number in this
  // grammar, so dropping it cannot change a value.
  s = s.replace(/[\s\u0001]*[.,;][\s\u0001]*$/, '');

  if (s.includes('\\')) throw new Bail('unconsumed macro');
  if (/[^0-9a-zA-Z.+\-*/()<>=\s\u0001]/.test(s)) throw new Bail('unsupported character');
  if (/[a-zA-Z]{2,}/.test(s)) throw new Bail('words or adjacent letters');
  return s;
}

// ── tokenizer ───────────────────────────────────────────────────────────────
type Token = (
  | { kind: 'num'; value: Rational }
  | { kind: 'var'; name: string }
  | { kind: 'op'; op: '+' | '-' | '*' | '/' | '(' | ')' }
  | { kind: 'cmp'; op: Cmp }
) & { space: boolean; gap: boolean };

function decimalToRational(intPart: string, fracPart: string): Rational {
  const digits = intPart + fracPart;
  if (digits.length > 16 || fracPart.length > 15) throw new Bail('number too large for exact arithmetic');
  return rat(safe(Number(digits)), safe(10 ** fracPart.length));
}

function tokenize(s: string): Token[] {
  const tokens: Token[] = [];
  const re = /(\s+)|(\u0001)|(\d+)(?:\.(\d+))?|(<=|>=|<|>|=)|([+\-*/()])|([a-zA-Z])/y;
  let pos = 0;
  let space = false;
  let gap = false;
  while (pos < s.length) {
    re.lastIndex = pos;
    const m = re.exec(s);
    if (!m || re.lastIndex === pos) throw new Bail('unreadable input');
    pos = re.lastIndex;
    if (m[1] !== undefined) { space = true; continue; }
    if (m[2] !== undefined) { gap = true; continue; }
    const flags = { space, gap };
    space = false;
    gap = false;
    if (m[3] !== undefined) tokens.push({ kind: 'num', value: decimalToRational(m[3], m[4] ?? ''), ...flags });
    else if (m[5] !== undefined) tokens.push({ kind: 'cmp', op: m[5] as Cmp, ...flags });
    else if (m[6] !== undefined) tokens.push({ kind: 'op', op: m[6] as '+', ...flags });
    else tokens.push({ kind: 'var', name: m[7], ...flags });
  }
  return tokens;
}

// ── recursive descent (one side of a relation) ──────────────────────────────
function parseSide(tokens: Token[]): { expr: Expr; spacedImplicit: boolean } {
  if (tokens.length === 0) throw new Bail('empty side');
  let i = 0;
  let spacedImplicit = false;
  const peek = (): Token | undefined => tokens[i];
  const isOp = (t: Token | undefined, op: string): boolean => !!t && t.kind === 'op' && t.op === op;

  function parsePrimary(depth: number): Expr {
    if (depth > MAX_DEPTH) throw new Bail('expression too deeply nested');
    const t = tokens[i++];
    if (!t) throw new Bail('incomplete expression');
    if (t.kind === 'num') return { kind: 'num', value: t.value };
    if (t.kind === 'var') return { kind: 'var' };
    if (isOp(t, '(')) {
      const inner = parseExpr(depth + 1);
      if (!isOp(tokens[i++], ')')) throw new Bail('unbalanced parentheses');
      return inner;
    }
    throw new Bail('unexpected operator');
  }

  function parseUnary(depth: number): Expr {
    if (depth > MAX_DEPTH) throw new Bail('expression too deeply nested');
    if (isOp(peek(), '-')) {
      i++;
      return { kind: 'neg', arg: parseUnary(depth + 1) };
    }
    return parsePrimary(depth);
  }

  function parseTerm(depth: number): Expr {
    let left = parseUnary(depth);
    let afterSlash = false;
    for (;;) {
      const t = peek();
      if (isOp(t, '*') || isOp(t, '/')) {
        i++;
        const right = parseUnary(depth);
        afterSlash = isOp(t, '/');
        left = { kind: 'bin', op: afterSlash ? '/' : '*', left, right };
        continue;
      }
      // Implicit multiplication: 2x, 3(x+1), (a)(b), x(…). Never number-after-
      // anything ("2 3", "x 2" are not products).
      if (t && (t.kind === 'var' || isOp(t, '('))) {
        // "1/2x": (1/2)x or 1/(2x)? Not certain ⇒ bail.
        if (afterSlash) throw new Bail('ambiguous division followed by implicit multiplication');
        if (t.gap) throw new Bail('implicit multiplication across a gap');
        if (t.space) spacedImplicit = true;
        const right = parseUnary(depth);
        left = { kind: 'bin', op: '*', left, right };
        continue;
      }
      return left;
    }
  }

  function parseExpr(depth: number): Expr {
    let left = parseTerm(depth);
    for (;;) {
      const t = peek();
      if (!isOp(t, '+') && !isOp(t, '-')) return left;
      i++;
      const right = parseTerm(depth);
      left = { kind: 'bin', op: isOp(t, '+') ? '+' : '-', left, right };
    }
  }

  const expr = parseExpr(0);
  if (i !== tokens.length) throw new Bail('unconsumed input');
  return { expr, spacedImplicit };
}

// ── affine form ─────────────────────────────────────────────────────────────
/** a·x + b */
interface Affine { a: Rational; b: Rational }

function affineOf(e: Expr, depth = 0): Affine {
  if (depth > 4 * MAX_DEPTH) throw new Bail('expression too deeply nested');
  switch (e?.kind) {
    case 'num':
      if (!isRational(e.value)) throw new Bail('malformed number');
      return { a: ZERO, b: rat(e.value.n, e.value.d) };
    case 'var':
      return { a: ONE, b: ZERO };
    case 'neg': {
      const v = affineOf(e.arg, depth + 1);
      return { a: neg(v.a), b: neg(v.b) };
    }
    case 'bin': {
      const l = affineOf(e.left, depth + 1);
      const r = affineOf(e.right, depth + 1);
      if (e.op === '+') return { a: add(l.a, r.a), b: add(l.b, r.b) };
      if (e.op === '-') return { a: sub(l.a, r.a), b: sub(l.b, r.b) };
      if (e.op === '*') {
        if (isZero(l.a)) return { a: mul(l.b, r.a), b: mul(l.b, r.b) };
        if (isZero(r.a)) return { a: mul(l.a, r.b), b: mul(l.b, r.b) };
        throw new Bail('not linear (variable times variable)');
      }
      if (e.op === '/') {
        if (!isZero(r.a)) throw new Bail('variable in a denominator');
        return { a: div(l.a, r.b), b: div(l.b, r.b) };
      }
      throw new Bail('malformed expression');
    }
    default:
      throw new Bail('malformed expression');
  }
}

function evalExpr(e: Expr, x: Rational, depth = 0): Rational {
  if (depth > 4 * MAX_DEPTH) throw new Bail('expression too deeply nested');
  switch (e.kind) {
    case 'num': return e.value;
    case 'var': return x;
    case 'neg': return neg(evalExpr(e.arg, x, depth + 1));
    case 'bin': {
      const l = evalExpr(e.left, x, depth + 1);
      const r = evalExpr(e.right, x, depth + 1);
      return e.op === '+' ? add(l, r) : e.op === '-' ? sub(l, r) : e.op === '*' ? mul(l, r) : div(l, r);
    }
  }
}

const evalAffine = (f: Affine, x: Rational): Rational => add(mul(f.a, x), f.b);

const PROBE_POINTS: Rational[] = [{ n: 0, d: 1 }, { n: 1, d: 1 }, { n: -2, d: 1 }, { n: 1, d: 3 }];

/** Symbolic affine form, cross-checked against the tree at four points. */
function verifiedAffine(e: Expr): Affine {
  const f = affineOf(e);
  for (const p of PROBE_POINTS) {
    if (cmpRat(evalExpr(e, p), evalAffine(f, p)) !== 0) throw new Bail('side is not affine in the variable');
  }
  return f;
}

// ── relation shape ──────────────────────────────────────────────────────────
const ALL_CMPS: readonly string[] = ['<', '<=', '>', '>=', '='];

function checkOps(ops: Cmp[], partCount: number): void {
  if (!Array.isArray(ops) || (partCount !== 2 && partCount !== 3) || ops.length !== partCount - 1) {
    throw new Bail('a relation needs two or three sides');
  }
  for (const op of ops) if (!ALL_CMPS.includes(op)) throw new Bail('unknown comparator');
  if (ops.length === 2) {
    const up = ops.every((o) => o === '<' || o === '<=');
    const down = ops.every((o) => o === '>' || o === '>=');
    if (!up && !down) throw new Bail('three-part relation with mixed or opposite comparators');
  }
}

function formsOf(rel: Relation): Affine[] {
  if (!rel || !Array.isArray(rel.parts)) throw new Bail('malformed relation');
  checkOps(rel.ops, rel.parts.length);
  return rel.parts.map((p) => verifiedAffine(p));
}

function parseOrBail(text: string): Relation {
  const tokens = tokenize(normalize(text));
  const sides: Token[][] = [[]];
  const ops: Cmp[] = [];
  const letters = new Set<string>();
  for (const t of tokens) {
    if (t.kind === 'cmp') { ops.push(t.op); sides.push([]); continue; }
    if (t.kind === 'var') letters.add(t.name);
    sides[sides.length - 1].push(t);
  }
  if (ops.length === 0) throw new Bail('no comparator');
  if (ops.length > 2) throw new Bail('more than two comparators');
  checkOps(ops, sides.length);
  if (letters.size === 0) throw new Bail('no variable');
  if (letters.size > 1) throw new Bail('more than one variable');

  const parsed = sides.map((side) => parseSide(side));
  // Two relations written side by side ("x > 3  x > 5") would otherwise read
  // as the three-part "x > 3x > 5": the seam is a spaced implicit product in
  // the middle part.
  if (parsed.length === 3 && parsed[1].spacedImplicit) {
    throw new Bail('spaced implicit multiplication in the middle of a three-part relation');
  }
  const parts = parsed.map((p) => p.expr);
  for (const p of parts) verifiedAffine(p);
  return { variable: [...letters][0], parts, ops, source: text };
}

export function parseRelation(text: string): ParseResult {
  try {
    return { ok: true, relation: parseOrBail(text) };
  } catch (e) {
    return { ok: false, reason: reasonOf(e) };
  }
}

// ── chains ──────────────────────────────────────────────────────────────────
const CONNECTOR_RE = /\\(?:iff|Leftrightarrow|Longleftrightarrow)(?![a-zA-Z])|[⟺⇔]|\\(?:Rightarrow|implies|Longrightarrow)(?![a-zA-Z])|[⟹⇒]/g;
const IFF_RE = /^(?:\\(?:iff|Leftrightarrow|Longleftrightarrow)|[⟺⇔])$/;

/**
 * Splits "a \iff b \Rightarrow c" into its segments. Null when there is no
 * connector. Commas, \quad, \\ and dots are NOT connectors. A segment may be
 * empty (e.g. a leading connector) — it then simply fails to parse.
 */
export function splitRelationChain(latex: string): { segments: string[]; connectors: Array<'iff' | 'implies'> } | null {
  try {
    if (typeof latex !== 'string' || latex.length > MAX_STATEMENT_LENGTH) return null;
    const segments: string[] = [];
    const connectors: Array<'iff' | 'implies'> = [];
    let last = 0;
    for (const m of latex.matchAll(CONNECTOR_RE)) {
      const at = m.index ?? 0;
      segments.push(latex.slice(last, at).trim());
      connectors.push(IFF_RE.test(m[0]) ? 'iff' : 'implies');
      last = at + m[0].length;
    }
    if (connectors.length === 0) return null;
    segments.push(latex.slice(last).trim());
    return { segments, connectors };
  } catch {
    return null;
  }
}

// ── problem statements ──────────────────────────────────────────────────────
const CMP_PRESENT_RE = /[<>=≤≥⩽⩾≠]|\\(?:leqslant|geqslant|leq|geq|le|ge|lt|gt|neq|ne)(?![a-zA-Z])/;
const MATH_SPAN_RE = /\$\$([\s\S]+?)\$\$|\$([^$]+)\$|\\\(([\s\S]+?)\\\)|\\\[([\s\S]+?)\\\]/g;
/** The statement must be about the relation's whole solution set. */
const SOLVE_RE = /\b(?:solve|solving|solution|inequality|equation)\b/i;
/**
 * A domain restriction or an optimisation question changes what a right
 * answer is ("x is a positive integer": x ≤ 3 is then correct for 2x < 7),
 * so the real-number comparison would be wrong.
 */
const DOMAIN_VETO_RE = /\b(?:integers?|whole|natural|positive|negative|non-?negative|non-?zero|even|odd|prime|digits?|greatest|least|largest|smallest|maximum|minimum|most|fewest|how\s+many)\b/i;
const WORD_RE = /[a-zA-Z]{2,}/;
const LEFT_WORDS: readonly string[] = ['solve', 'inequality', 'equation', 'graph', 'simplify'];
const RIGHT_WORDS: readonly string[] = ['and', 'then', 'for', 'on', 'using', 'algebraically', 'graphically'];

function extractOrBail(statement: string): Relation {
  if (typeof statement !== 'string') throw new Bail('not a string');
  if (statement.length > MAX_STATEMENT_LENGTH) throw new Bail('statement too long');
  if (statement.trim() === '') throw new Bail('empty input');
  if (DOMAIN_VETO_RE.test(statement)) throw new Bail('statement restricts the domain or asks for an extreme value');
  if (/\d,\d/.test(statement)) throw new Bail('digit-comma-digit is ambiguous');

  // 1. Delimited maths: exactly one span carrying a comparator.
  const spanCandidates: string[] = [];
  const remainder = statement.replace(MATH_SPAN_RE, (_m, a?: string, b?: string, c?: string, d?: string) => {
    const body = a ?? b ?? c ?? d ?? '';
    if (CMP_PRESENT_RE.test(body)) spanCandidates.push(body.trim());
    return ' ';
  });
  if (spanCandidates.length > 0) {
    if (CMP_PRESENT_RE.test(remainder)) throw new Bail('relation text outside the math delimiters');
    const distinct = new Set(spanCandidates.map((c) => c.replace(/\s+/g, '')));
    if (distinct.size > 1) throw new Bail('more than one relation in the statement');
    if (WORD_RE.test(remainder) && !SOLVE_RE.test(remainder)) throw new Bail('statement does not ask to solve the relation');
    return parseOrBail(spanCandidates[0]);
  }

  // 2. Plain text: cut at prose words and sentence punctuation; exactly one
  //    chunk may carry a comparator, and its neighbours must be ones that
  //    cannot be part of the mathematics ("twice x < 5" is NOT x < 5).
  const text = statement.replace(/\$/g, ' ');
  if (!CMP_PRESENT_RE.test(text)) throw new Bail('no relation in the statement');
  type Edge = { type: 'edge' } | { type: 'punct' } | { type: 'word'; word: string };
  const chunks: Array<{ text: string; left: Edge; right: Edge }> = [];
  const breaker = /\\[a-zA-Z]+|[a-zA-Z]{2,}|[:;,?!\n]|\.(?=\s|$)/g;
  let last = 0;
  let left: Edge = { type: 'edge' };
  let sawWord = false;
  for (const m of text.matchAll(breaker)) {
    if (m[0].startsWith('\\')) continue; // a macro belongs to the mathematics
    const at = m.index ?? 0;
    const isWord = /^[a-zA-Z]/.test(m[0]);
    const edge: Edge = isWord ? { type: 'word', word: m[0].toLowerCase() } : { type: 'punct' };
    if (isWord) sawWord = true;
    chunks.push({ text: text.slice(last, at), left, right: edge });
    left = edge;
    last = at + m[0].length;
  }
  chunks.push({ text: text.slice(last), left, right: { type: 'edge' } });

  const candidates = chunks.filter((c) => CMP_PRESENT_RE.test(c.text));
  if (candidates.length === 0) throw new Bail('no relation in the statement');
  if (candidates.length > 1) throw new Bail('more than one relation in the statement');
  const c = candidates[0];
  if (sawWord && !SOLVE_RE.test(text)) throw new Bail('statement does not ask to solve the relation');
  if (c.left.type === 'word' && !LEFT_WORDS.includes(c.left.word)) throw new Bail('relation may be truncated by the preceding word');
  if (c.right.type === 'word' && !RIGHT_WORDS.includes(c.right.word)) throw new Bail('relation may be truncated by the following word');
  return parseOrBail(c.text.trim());
}

/**
 * Finds the single relation inside a problem statement such as
 * "Solve and graph: $4x + 9 \le 33$" or "Solve: -4 < (3x+2)/(-2) \le 5".
 * Not-ok when there is none, more than one candidate, or any doubt about
 * where the relation starts and ends.
 */
export function extractProblemRelation(statement: string): ParseResult {
  try {
    return { ok: true, relation: extractOrBail(statement) };
  } catch (e) {
    return { ok: false, reason: reasonOf(e) };
  }
}

// ── comparison ──────────────────────────────────────────────────────────────
function holdsAt(forms: Affine[], ops: Cmp[], x: Rational): boolean {
  for (let k = 0; k < ops.length; k++) {
    const c = cmpRat(evalAffine(forms[k], x), evalAffine(forms[k + 1], x));
    const op = ops[k];
    const pass = op === '<' ? c < 0 : op === '<=' ? c <= 0 : op === '>' ? c > 0 : op === '>=' ? c >= 0 : c === 0;
    if (!pass) return false;
  }
  return true;
}

/** Boundary roots: where two adjacent sides are equal. */
function rootsOf(forms: Affine[]): Rational[] {
  const roots: Rational[] = [];
  for (let k = 0; k + 1 < forms.length; k++) {
    const a = sub(forms[k].a, forms[k + 1].a);
    const b = sub(forms[k].b, forms[k + 1].b);
    if (!isZero(a)) roots.push(div(neg(b), a));
  }
  return roots;
}

/** Integer first, then smallest denominator, then smallest magnitude, then positive. */
function simpler(a: Rational, b: Rational): number {
  if (a.d !== b.d) return a.d - b.d;
  if (Math.abs(a.n) !== Math.abs(b.n)) return Math.abs(a.n) - Math.abs(b.n);
  return b.n - a.n;
}

function compareOrBail(a: Relation, b: Relation): SetCompare {
  if (!a || !b) throw new Bail('missing relation');
  if (typeof a.variable !== 'string' || typeof b.variable !== 'string' || !/^[a-zA-Z]$/.test(a.variable) || !/^[a-zA-Z]$/.test(b.variable)) {
    throw new Bail('malformed relation');
  }
  if (a.variable !== b.variable) throw new Bail('relations use different variables');
  const fa = formsOf(a);
  const fb = formsOf(b);

  const seen = new Set<string>();
  const uniq = (list: Rational[]): Rational[] => list.filter((r) => {
    const key = `${r.n}/${r.d}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const roots = uniq([...rootsOf(fa), ...rootsOf(fb)]).sort(cmpRat);

  const grid: Rational[] = [];
  if (roots.length === 0) {
    grid.push(ZERO); // both sets are everything-or-nothing
  } else {
    seen.clear();
    const points: Rational[] = [...roots];
    for (let k = 0; k + 1 < roots.length; k++) points.push(div(add(roots[k], roots[k + 1]), int(2)));
    points.push(sub(roots[0], ONE), add(roots[roots.length - 1], ONE));
    for (const r of roots) {
      const lo = floorRat(r);
      const hi = r.d === 1 ? lo : safe(lo + 1);
      points.push(int(lo), int(hi), int(safe(lo - 1)), int(safe(hi + 1)));
    }
    grid.push(...uniq(points));
  }

  const drops: Rational[] = [];
  const adds: Rational[] = [];
  for (const p of grid) {
    const inA = holdsAt(fa, a.ops, p);
    const inB = holdsAt(fb, b.ops, p);
    if (inA && !inB) drops.push(p);
    else if (!inA && inB) adds.push(p);
  }
  if (drops.length === 0 && adds.length === 0) return { verdict: 'equivalent' };
  const kind = drops.length > 0 && adds.length > 0 ? 'both' : drops.length > 0 ? 'drops' : 'adds';
  // For 'both' the witness is a DROP: a lost solution is the graver error.
  const pool = drops.length > 0 ? drops : adds;
  const witness = [...pool].sort(simpler)[0];
  return { verdict: 'differs', kind, witness, aHolds: drops.length > 0, bHolds: drops.length === 0 };
}

/**
 * 'drops' = some solution of `a` is not a solution of `b`;
 * 'adds'  = `b` admits a non-solution of `a`; 'both' = each happens.
 */
export function compareRelations(a: Relation, b: Relation): SetCompare {
  try {
    return compareOrBail(a, b);
  } catch (e) {
    return { verdict: 'unknown', reason: reasonOf(e) };
  }
}

export function compareRelationTexts(a: string, b: string): SetCompare {
  const pa = parseRelation(a);
  if (!pa.ok) return { verdict: 'unknown', reason: `first relation: ${pa.reason}` };
  const pb = parseRelation(b);
  if (!pb.ok) return { verdict: 'unknown', reason: `second relation: ${pb.reason}` };
  return compareRelations(pa.relation, pb.relation);
}

/** "4", "-4", "19/6" */
export function formatWitness(w: Rational): string {
  if (!isRational(w)) return '';
  return w.d === 1 ? String(w.n) : `${w.n}/${w.d}`;
}

/**
 * Parses the ORIGINAL problem from `statement` and compares each answer's
 * solution set with it; an answer "wins" when it is equivalent to the
 * problem. `unknown` whenever the problem or EITHER answer cannot be decided
 * — an unreadable answer may be the same set in a notation this module does
 * not read, so it never loses by default.
 */
export function adjudicateAnswerDispute(input: { statement: string; claimed: string; solved: string }):
  { winner: 'claimed' | 'solved' | 'both' | 'neither' | 'unknown'; witnessClaimed?: Rational; witnessSolved?: Rational } {
  try {
    const problem = extractProblemRelation(input?.statement);
    if (!problem.ok) return { winner: 'unknown' };
    const claimed = parseRelation(input.claimed);
    const solved = parseRelation(input.solved);
    if (!claimed.ok || !solved.ok) return { winner: 'unknown' };
    const vc = compareRelations(problem.relation, claimed.relation);
    const vs = compareRelations(problem.relation, solved.relation);
    if (vc.verdict === 'unknown' || vs.verdict === 'unknown') return { winner: 'unknown' };
    const claimedOk = vc.verdict === 'equivalent';
    const solvedOk = vs.verdict === 'equivalent';
    const out: { winner: 'claimed' | 'solved' | 'both' | 'neither'; witnessClaimed?: Rational; witnessSolved?: Rational } = {
      winner: claimedOk && solvedOk ? 'both' : claimedOk ? 'claimed' : solvedOk ? 'solved' : 'neither',
    };
    if (vc.verdict === 'differs') out.witnessClaimed = vc.witness;
    if (vs.verdict === 'differs') out.witnessSolved = vs.witness;
    return out;
  } catch {
    return { winner: 'unknown' };
  }
}
