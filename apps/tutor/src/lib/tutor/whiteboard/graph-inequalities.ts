/**
 * Inequalities on a function graph — parsing, Desmos LaTeX, validation and
 * the deterministic region check. Exercised by scripts/test-graph-inequalities.ts.
 *
 * Live 2026-10-06 (portal-897212b5 voice, portal-347539a7 text — the same
 * problem, twice): "solve 2x + y < 4 and x − 3y > 2 by graphing". The graph
 * tool could not draw a dashed line and its only shading primitive was
 * `shadedRegion` ("between two curves from a to b"), so the tutor approximated
 * the solution with a strip BETWEEN the two lines. The solution is the region
 * below BOTH lines; the strip contained the origin, which fails the second
 * inequality; and because the board description listed plots and points but
 * not the shading, the tutor then insisted the origin was outside it.
 *
 * Three things live here, all pure (no DOM, no env, never throw):
 *
 *  1. `parseXYRelation` — one relation in x and y, in the form the brain
 *     writes it ("y < -2x + 4", "y >= x/3 - 2/3", "x > 2", ≤ ≥, \le \ge,
 *     \frac). Own tokenizer + recursive descent, no eval(). The serialiser
 *     (`desmosLatex`) is built from the SAME tree the sampler evaluates, so
 *     what Desmos draws is what was checked.
 *  2. `gateInequalityGraph` — the validator / normaliser for a showGraph
 *     command: bad `inequalities` are rejected with a message the brain can
 *     act on; `lineStyle` is normalised; a function drawn along an
 *     inequality's boundary takes that boundary's style (a solid line on top
 *     of a dashed boundary reads as solid).
 *  3. `checkGraphRegion` — sampling check of the drawn region against the
 *     problem's own inequalities.
 *
 * Why not relation-sampling.ts: that module is an EXACT comparator for
 * one-variable affine relations (its expression tree has a single anonymous
 * variable and every side must be affine), and its statement extractor stops
 * at "more than one relation". A region in the plane needs two named
 * variables and a system needs several relations. This module reuses its
 * statement conventions (`DOMAIN_VETO_RE`, `splitRelationChain`) and keeps
 * its overriding property: when in doubt, say "cannot tell" — never a wrong
 * verdict. An unreadable problem never blocks a graph.
 */

import { DOMAIN_VETO_RE, splitRelationChain } from '@/lib/tutor/voice/relation-sampling';
import { normalizeShadedRegion } from './math-expr';

// ── expression tree ─────────────────────────────────────────────────────────

export type IneqOp = '<' | '<=' | '>' | '>=';
export type RelOp = IneqOp | '=';

type Node =
  | { k: 'num'; v: number; src: string }
  | { k: 'var'; name: 'x' | 'y' }
  | { k: 'pi' }
  | { k: 'neg'; a: Node }
  | { k: 'fn'; name: 'sqrt' | 'abs'; a: Node }
  | { k: 'bin'; op: '+' | '-' | '*' | '/' | '^'; l: Node; r: Node };

class Bail extends Error {
  constructor(public reason: string) { super(reason); }
}
const reasonOf = (e: unknown): string => (e instanceof Bail ? e.reason : 'could not be read');

const MAX_LEN = 300;
const MAX_DEPTH = 40;

// ── normalisation ───────────────────────────────────────────────────────────

function normalize(text: string): string {
  if (typeof text !== 'string') throw new Bail('is not text');
  if (text.length > MAX_LEN) throw new Bail('is too long');
  let s = text.trim();
  if (!s) throw new Bail('is empty');

  if (/\\neq?(?![a-zA-Z])|≠|!=/.test(s)) throw new Bail('uses "not equal", which is not a region');
  if (/\\(?:text[a-z]*|mathrm|mathbf|mathit|operatorname|mbox)(?![a-zA-Z])/.test(s)) throw new Bail('contains words');
  if (/\\(?:lor|land|vee|wedge|cup|cap|in)(?![a-zA-Z])|[∪∩∈∨∧]/.test(s)) throw new Bail('joins several conditions — give each one its own entry');

  s = s
    .replace(/\$/g, ' ')
    .replace(/\\left(?![a-zA-Z])|\\right(?![a-zA-Z])/g, '')
    .replace(/\\[,;:! ]|~|\\q?quad(?![a-zA-Z])/g, ' ')
    .replace(/\\(?:leqslant|leq|le)(?![a-zA-Z])|≤|⩽|=</g, '<=')
    .replace(/\\(?:geqslant|geq|ge)(?![a-zA-Z])|≥|⩾|=>/g, '>=')
    .replace(/\\lt(?![a-zA-Z])/g, '<')
    .replace(/\\gt(?![a-zA-Z])/g, '>')
    .replace(/[−–]/g, '-')
    .replace(/\*\*/g, '^')
    .replace(/\\cdot(?![a-zA-Z])|\\times(?![a-zA-Z])|[·×]/g, '*')
    .replace(/\\div(?![a-zA-Z])|÷/g, '/')
    .replace(/\\pi(?![a-zA-Z])|π/g, ' pi ');

  // 2½ would otherwise read as 2 × ½.
  if (/\d\s*\\[dt]?frac(?![a-zA-Z])/.test(s)) throw new Bail('contains a mixed number — write it as one fraction');

  // Braced constructs, innermost first.
  for (let guard = 0; guard < 24; guard++) {
    const next = s
      .replace(/\\[dt]?frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g, '(($1)/($2))')
      .replace(/\\sqrt\s*\{([^{}]*)\}/g, ' sqrt($1)')
      .replace(/\^\s*\{([^{}]*)\}/g, '^($1)');
    if (next === s) break;
    s = next;
  }
  // |…| (not nested) → abs(…)
  s = s.replace(/\|([^|]+)\|/g, ' abs($1)');

  s = s.replace(/[\s]*[.,;][\s]*$/, '');

  if (/[\\{}|]/.test(s)) throw new Bail('contains LaTeX this tool cannot read — use plain x, y, numbers, + - * / ^, \\frac and \\sqrt');
  if (/[^0-9a-zA-Z.+\-*/^()<>=\s]/.test(s)) throw new Bail('contains a symbol this tool cannot read');
  return s;
}

// ── tokenizer ───────────────────────────────────────────────────────────────

type Token =
  | { t: 'num'; v: number; src: string }
  | { t: 'var'; name: 'x' | 'y' }
  | { t: 'pi' }
  | { t: 'fn'; name: 'sqrt' | 'abs' }
  | { t: 'op'; op: '+' | '-' | '*' | '/' | '^' | '(' | ')' }
  | { t: 'cmp'; op: RelOp };

function tokenize(s: string): Token[] {
  const out: Token[] = [];
  const re = /\s+|(\d+(?:\.\d+)?|\.\d+)|(<=|>=|<|>|=)|([+\-*/^()])|([a-zA-Z]+)/y;
  let pos = 0;
  while (pos < s.length) {
    re.lastIndex = pos;
    const m = re.exec(s);
    if (!m || re.lastIndex === pos) throw new Bail('could not be read');
    pos = re.lastIndex;
    if (m[1] !== undefined) out.push({ t: 'num', v: Number(m[1]), src: m[1] });
    else if (m[2] !== undefined) out.push({ t: 'cmp', op: m[2] as RelOp });
    else if (m[3] !== undefined) out.push({ t: 'op', op: m[3] as '+' });
    else if (m[4] !== undefined) {
      const word = m[4];
      const lower = word.toLowerCase();
      if (lower === 'sqrt' || lower === 'abs') out.push({ t: 'fn', name: lower });
      else if (lower === 'pi') out.push({ t: 'pi' });
      else if (/^[xy]+$/i.test(word)) {
        for (const ch of lower) out.push({ t: 'var', name: ch as 'x' | 'y' });
      } else {
        throw new Bail(`uses "${word.slice(0, 16)}" — only the variables x and y can be graphed here`);
      }
    }
  }
  return out;
}

// ── recursive descent (one side) ────────────────────────────────────────────

function parseSide(tokens: Token[]): Node {
  if (tokens.length === 0) throw new Bail('has an empty side');
  let i = 0;
  const peek = (): Token | undefined => tokens[i];
  const isOp = (t: Token | undefined, op: string): boolean => !!t && t.t === 'op' && t.op === op;
  const startsPrimary = (t: Token | undefined): boolean =>
    !!t && (t.t === 'var' || t.t === 'pi' || t.t === 'fn' || isOp(t, '('));

  function primary(depth: number): Node {
    if (depth > MAX_DEPTH) throw new Bail('is nested too deeply');
    const t = tokens[i++];
    if (!t) throw new Bail('is incomplete');
    if (t.t === 'num') return { k: 'num', v: t.v, src: t.src };
    if (t.t === 'var') return { k: 'var', name: t.name };
    if (t.t === 'pi') return { k: 'pi' };
    if (t.t === 'fn') {
      if (!isOp(tokens[i++], '(')) throw new Bail(`needs parentheses after ${t.name}`);
      const inner = expr(depth + 1);
      if (!isOp(tokens[i++], ')')) throw new Bail('has unbalanced parentheses');
      return { k: 'fn', name: t.name, a: inner };
    }
    if (isOp(t, '(')) {
      const inner = expr(depth + 1);
      if (!isOp(tokens[i++], ')')) throw new Bail('has unbalanced parentheses');
      return inner;
    }
    throw new Bail('has an operator where a value should be');
  }

  function power(depth: number): Node {
    const base = primary(depth);
    if (isOp(peek(), '^')) {
      i++;
      return { k: 'bin', op: '^', l: base, r: unary(depth + 1) };
    }
    return base;
  }

  function unary(depth: number): Node {
    if (depth > MAX_DEPTH) throw new Bail('is nested too deeply');
    if (isOp(peek(), '-')) { i++; return { k: 'neg', a: unary(depth + 1) }; }
    if (isOp(peek(), '+')) { i++; return unary(depth + 1); }
    return power(depth);
  }

  function term(depth: number): Node {
    let left = unary(depth);
    let afterSlash = false;
    for (;;) {
      const t = peek();
      if (isOp(t, '*') || isOp(t, '/')) {
        i++;
        const right = unary(depth);
        afterSlash = isOp(t, '/');
        left = { k: 'bin', op: afterSlash ? '/' : '*', l: left, r: right };
        continue;
      }
      if (startsPrimary(t)) {
        // "1/2x": (1/2)x or 1/(2x)? Not certain ⇒ say so rather than guess.
        if (afterSlash) throw new Bail('has a division followed directly by a variable (like 1/2x) — write (1/2)x or x/2');
        const right = power(depth);
        left = { k: 'bin', op: '*', l: left, r: right };
        continue;
      }
      return left;
    }
  }

  function expr(depth: number): Node {
    let left = term(depth);
    for (;;) {
      const t = peek();
      if (!isOp(t, '+') && !isOp(t, '-')) return left;
      i++;
      const right = term(depth);
      left = { k: 'bin', op: isOp(t, '+') ? '+' : '-', l: left, r: right };
    }
  }

  const tree = expr(0);
  if (i !== tokens.length) throw new Bail('has two values side by side with no operator');
  return tree;
}

// ── evaluation + serialisation ──────────────────────────────────────────────

function evalNode(n: Node, x: number, y: number): number {
  switch (n.k) {
    case 'num': return n.v;
    case 'var': return n.name === 'x' ? x : y;
    case 'pi': return Math.PI;
    case 'neg': return -evalNode(n.a, x, y);
    case 'fn': {
      const a = evalNode(n.a, x, y);
      return n.name === 'sqrt' ? (a < 0 ? NaN : Math.sqrt(a)) : Math.abs(a);
    }
    case 'bin': {
      const l = evalNode(n.l, x, y);
      const r = evalNode(n.r, x, y);
      switch (n.op) {
        case '+': return l + r;
        case '-': return l - r;
        case '*': return l * r;
        case '/': return r === 0 ? NaN : l / r;
        case '^': return Math.pow(l, r);
      }
    }
  }
}

function usesVar(n: Node, name: 'x' | 'y'): boolean {
  switch (n.k) {
    case 'var': return n.name === name;
    case 'neg': case 'fn': return usesVar(n.a, name);
    case 'bin': return usesVar(n.l, name) || usesVar(n.r, name);
    default: return false;
  }
}

const paren = (s: string): string => `\\left(${s}\\right)`;
const isSum = (n: Node): boolean => n.k === 'bin' && (n.op === '+' || n.op === '-');

function toLatex(n: Node): string {
  switch (n.k) {
    case 'num': return n.src;
    case 'var': return n.name;
    case 'pi': return '\\pi';
    case 'neg': return `-${isSum(n.a) || n.a.k === 'neg' ? paren(toLatex(n.a)) : toLatex(n.a)}`;
    case 'fn': return n.name === 'sqrt' ? `\\sqrt{${toLatex(n.a)}}` : `\\left|${toLatex(n.a)}\\right|`;
    case 'bin': {
      if (n.op === '/') return `\\frac{${toLatex(n.l)}}{${toLatex(n.r)}}`;
      if (n.op === '^') {
        const base = n.l.k === 'num' || n.l.k === 'var' || n.l.k === 'pi' ? toLatex(n.l) : paren(toLatex(n.l));
        return `${base}^{${toLatex(n.r)}}`;
      }
      if (n.op === '*') {
        const side = (m: Node): string => (isSum(m) || m.k === 'neg' ? paren(toLatex(m)) : toLatex(m));
        return `${side(n.l)}\\cdot ${side(n.r)}`;
      }
      const right = n.op === '-' && (isSum(n.r) || n.r.k === 'neg') ? paren(toLatex(n.r)) : (n.r.k === 'neg' ? paren(toLatex(n.r)) : toLatex(n.r));
      return `${toLatex(n.l)}${n.op}${right}`;
    }
  }
}

const OP_LATEX: Record<RelOp, string> = { '<': '<', '<=': '\\le ', '>': '>', '>=': '\\ge ', '=': '=' };
const OP_TEXT: Record<RelOp, string> = { '<': '<', '<=': '≤', '>': '>', '>=': '≥', '=': '=' };

// ── relations ───────────────────────────────────────────────────────────────

export interface XYRelation {
  /** The text as given (delimiters stripped, whitespace collapsed). */
  source: string;
  /** Comparators between consecutive parts (1, or 2 for "a < y <= b"). */
  ops: RelOp[];
  /** True when every comparator is strict (boundary not included). */
  strict: boolean;
  /** True when no comparator is "=" (i.e. it describes a region). */
  isInequality: boolean;
  variables: Array<'x' | 'y'>;
  /** Desmos-ready LaTeX built from the parsed tree. */
  desmosLatex: string;
  /** Readable form for messages and the board description. */
  pretty: string;
  /** Does (x, y) satisfy the relation? False on a domain error. */
  holds(x: number, y: number): boolean;
  /** Smallest |left − right| over the comparators at (x, y): distance-like
   *  measure of how close the point is to a boundary. NaN on a domain error. */
  margin(x: number, y: number): number;
  /** One signed difference (left − right) per comparator. */
  boundaries: Array<{ op: RelOp; strict: boolean; diff(x: number, y: number): number }>;
}

export type XYParse = { ok: true; relation: XYRelation } | { ok: false; reason: string };

function cleanSource(text: string): string {
  return String(text).replace(/\$/g, '').replace(/\s+/g, ' ').trim();
}

function buildRelation(text: string, opts: { allowEquation: boolean }): XYRelation {
  const tokens = tokenize(normalize(text));
  const sides: Token[][] = [[]];
  const ops: RelOp[] = [];
  for (const t of tokens) {
    if (t.t === 'cmp') { ops.push(t.op); sides.push([]); } else sides[sides.length - 1].push(t);
  }
  if (ops.length === 0) throw new Bail('has no comparison sign (<, >, ≤, ≥)');
  if (ops.length > 2) throw new Bail('has more than two comparison signs — give each inequality its own entry');
  const hasEq = ops.includes('=');
  if (hasEq && (!opts.allowEquation || ops.length > 1)) throw new Bail('is an equation, not an inequality — plot an equation with `functions`');
  if (ops.length === 2) {
    const up = (o: RelOp) => o === '<' || o === '<=';
    if (up(ops[0]) !== up(ops[1])) throw new Bail('mixes < and > in one chain — write it as two inequalities');
  }
  const parts = sides.map(parseSide);
  const variables = (['x', 'y'] as const).filter((v) => parts.some((p) => usesVar(p, v)));
  if (variables.length === 0) throw new Bail('has no x or y in it');

  const boundaries = ops.map((op, k) => ({
    op,
    strict: op === '<' || op === '>',
    diff: (x: number, y: number): number => evalNode(parts[k], x, y) - evalNode(parts[k + 1], x, y),
  }));
  const holdsOne = (op: RelOp, d: number): boolean => {
    if (!Number.isFinite(d)) return false;
    switch (op) {
      case '<': return d < 0;
      case '<=': return d <= 0;
      case '>': return d > 0;
      case '>=': return d >= 0;
      case '=': return d === 0;
    }
  };
  return {
    source: cleanSource(text),
    ops,
    strict: ops.every((o) => o === '<' || o === '>'),
    isInequality: !hasEq,
    variables: [...variables],
    desmosLatex: parts.map((p, k) => (k === 0 ? toLatex(p) : `${OP_LATEX[ops[k - 1]]}${toLatex(p)}`)).join(''),
    pretty: prettyRelationText(text, ops),
    holds: (x, y) => boundaries.every((b) => holdsOne(b.op, b.diff(x, y))),
    margin: (x, y) => {
      let m = Infinity;
      for (const b of boundaries) {
        const d = Math.abs(b.diff(x, y));
        if (!Number.isFinite(d)) return NaN;
        if (d < m) m = d;
      }
      return m;
    },
    boundaries,
  };
}

/** Readable text: the source with LaTeX comparators and fractions unwrapped
 *  enough for a sentence ("y < x/3 − 2/3"). Falls back to the cleaned source. */
function prettyRelationText(text: string, _ops: RelOp[]): string {
  let s = cleanSource(text)
    .replace(/\\left(?![a-zA-Z])|\\right(?![a-zA-Z])/g, '')
    .replace(/\\(?:leqslant|leq|le)(?![a-zA-Z])/g, '≤')
    .replace(/\\(?:geqslant|geq|ge)(?![a-zA-Z])/g, '≥')
    .replace(/<=|=</g, '≤')
    .replace(/>=|=>/g, '≥')
    .replace(/\\lt(?![a-zA-Z])/g, '<')
    .replace(/\\gt(?![a-zA-Z])/g, '>')
    .replace(/\\cdot(?![a-zA-Z])|\\times(?![a-zA-Z])/g, '·')
    .replace(/\\pi(?![a-zA-Z])/g, 'π');
  for (let guard = 0; guard < 8; guard++) {
    // A fraction directly in front of a variable or bracket keeps its own
    // brackets — "(1/2)x", never "1/2x", which this parser (rightly) refuses
    // and the brain would copy straight back out of the board description.
    const next = s.replace(/\\[dt]?frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}(\s*[a-zA-Z(\\])?/g, (_m, a: string, b: string, after?: string) => {
      const wrap = (t: string) => (/^[\w.]+$/.test(t.trim()) ? t.trim() : `(${t.trim()})`);
      const frac = `${wrap(a)}/${wrap(b)}`;
      return after ? `(${frac})${after.trim()}` : frac;
    });
    if (next === s) break;
    s = next;
  }
  return s.replace(/\s*(≤|≥|<|>|=)\s*/g, ' $1 ').replace(/\s+/g, ' ').trim();
}

/** Parse one inequality in x and y (an equation is refused). */
export function parseXYRelation(text: string): XYParse {
  try {
    return { ok: true, relation: buildRelation(text, { allowEquation: false }) };
  } catch (e) {
    return { ok: false, reason: reasonOf(e) };
  }
}

/** Parse a bare expression in x (or y) — a plotted function's right-hand side. */
export function parseXYExpression(text: string): { ok: true; evaluate(x: number, y: number): number; usesX: boolean; usesY: boolean } | { ok: false; reason: string } {
  try {
    const tokens = tokenize(normalize(text));
    if (tokens.some((t) => t.t === 'cmp')) throw new Bail('is a relation, not an expression');
    const tree = parseSide(tokens);
    return { ok: true, evaluate: (x, y) => evalNode(tree, x, y), usesX: usesVar(tree, 'x'), usesY: usesVar(tree, 'y') };
  } catch (e) {
    return { ok: false, reason: reasonOf(e) };
  }
}

// ── graph data shapes (loose: this runs on brain output) ────────────────────

export interface GraphInequalityEntry {
  /** The relation as the brain wrote it. */
  expr: string;
  /** Desmos LaTeX (filled by the gate). */
  latex?: string;
  /** True when the boundary is excluded (drawn dashed). Filled by the gate. */
  strict?: boolean;
  color?: string;
  label?: string;
}

type Loose = Record<string, unknown>;
const asArray = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const fmt = (n: number): string => {
  if (!Number.isFinite(n)) return String(n);
  const r = Math.round(n * 1000) / 1000;
  return Object.is(r, -0) ? '0' : String(r);
};

/** The raw text of one `inequalities` entry (string, or an object's expr). */
export function inequalityEntryText(entry: unknown): string {
  if (typeof entry === 'string') return entry;
  if (entry && typeof entry === 'object') {
    const o = entry as Loose;
    for (const key of ['expr', 'inequality', 'relation', 'expression', 'latex']) {
      if (typeof o[key] === 'string' && (o[key] as string).trim()) return o[key] as string;
    }
  }
  return '';
}

/** Resolve an entry for drawing: its Desmos LaTeX and strictness, or null when
 *  it cannot be read (the renderer then skips it). */
export function resolveInequalityEntry(entry: unknown): { latex: string; strict: boolean; pretty: string; color?: string; label?: string } | null {
  const text = inequalityEntryText(entry);
  if (!text) return null;
  const parsed = parseXYRelation(text);
  if (!parsed.ok) return null;
  const o = (entry && typeof entry === 'object' ? entry : {}) as Loose;
  return {
    latex: parsed.relation.desmosLatex,
    strict: parsed.relation.strict,
    pretty: parsed.relation.pretty,
    color: typeof o.color === 'string' ? o.color : undefined,
    label: typeof o.label === 'string' ? o.label : undefined,
  };
}

export function normalizeLineStyle(v: unknown): 'solid' | 'dashed' | undefined {
  if (typeof v !== 'string') return undefined;
  const s = v.trim().toLowerCase();
  if (s === 'solid') return 'solid';
  if (s === 'dashed' || s === 'dash' || s === 'dotted') return 'dashed';
  return undefined;
}

const MAX_INEQUALITIES = 6;
const FORM_HINT =
  'Write each entry as one relation in x and y with a comparison sign, in plain or LaTeX form — for example "y < 2x + 1", "y >= -x/2 + 3", "x > 2", "y \\le \\frac{3}{4}x".';

// ── sampling helpers ────────────────────────────────────────────────────────

interface Window { x0: number; x1: number; y0: number; y1: number }

function windowOf(data: Loose): Window {
  const ok = (r: unknown): r is [number, number] =>
    Array.isArray(r) && Number.isFinite(r[0]) && Number.isFinite(r[1]) && (r[1] as number) > (r[0] as number);
  const xr = ok(data.xRange) ? data.xRange : [-10, 10];
  const yr = ok(data.yRange) ? data.yRange : [-10, 10];
  return { x0: xr[0], x1: xr[1], y0: yr[0], y1: yr[1] };
}

/** Sample points: the integer lattice inside the window (so a witness reads
 *  as "(0, 0)" rather than "(0.137, -0.42)") plus an offset uniform grid. */
function samplePoints(w: Window): Array<{ x: number; y: number; nice: boolean }> {
  const pts: Array<{ x: number; y: number; nice: boolean }> = [];
  const xi0 = Math.ceil(w.x0), xi1 = Math.floor(w.x1), yi0 = Math.ceil(w.y0), yi1 = Math.floor(w.y1);
  const nx = xi1 - xi0 + 1, ny = yi1 - yi0 + 1;
  if (nx > 0 && ny > 0) {
    const sx = Math.max(1, Math.ceil(nx / 50)), sy = Math.max(1, Math.ceil(ny / 50));
    // Keep 0 on the lattice when the window contains it.
    const startX = xi0 <= 0 && xi1 >= 0 ? xi0 + (((-xi0) % sx) + sx) % sx : xi0;
    const startY = yi0 <= 0 && yi1 >= 0 ? yi0 + (((-yi0) % sy) + sy) % sy : yi0;
    for (let x = startX; x <= xi1; x += sx) for (let y = startY; y <= yi1; y += sy) pts.push({ x, y, nice: true });
  }
  const N = 41;
  const dx = (w.x1 - w.x0) / N, dy = (w.y1 - w.y0) / N;
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
    pts.push({ x: w.x0 + (i + 0.381966) * dx, y: w.y0 + (j + 0.618034) * dy, nice: false });
  }
  return pts;
}

/** Do two difference functions vanish on the same curve? Tested by the ratio
 *  d1/d2 being one constant over scattered points (true for a rescaled or
 *  rearranged form of the same boundary). Returns the sign of that constant
 *  (+1 same orientation, −1 flipped) or null. */
function sameBoundary(d1: (x: number, y: number) => number, d2: (x: number, y: number) => number, w: Window): 1 | -1 | null {
  const fr = [[0.137, 0.731], [0.823, 0.219], [0.412, 0.577], [0.291, 0.093], [0.659, 0.871], [0.947, 0.468], [0.058, 0.342], [0.533, 0.914], [0.774, 0.626], [0.206, 0.955], [0.618, 0.154], [0.883, 0.797]];
  let ratio: number | null = null;
  let valid = 0;
  for (const [fx, fy] of fr) {
    const x = w.x0 + fx * (w.x1 - w.x0), y = w.y0 + fy * (w.y1 - w.y0);
    const a = d1(x, y), b = d2(x, y);
    if (!Number.isFinite(a) || !Number.isFinite(b)) continue;
    if (Math.abs(b) < 1e-9 || Math.abs(a) < 1e-9) continue;
    const r = a / b;
    if (ratio === null) ratio = r;
    else if (Math.abs(r - ratio) > 1e-6 * Math.max(1, Math.abs(ratio))) return null;
    valid++;
  }
  if (ratio === null || valid < 6) return null;
  return ratio > 0 ? 1 : -1;
}

// ── problem relations ───────────────────────────────────────────────────────

const CMP_INEQ_RE = /[<>≤≥⩽⩾]|\\(?:leqslant|geqslant|leq|geq|le|ge|lt|gt)(?![a-zA-Z])/;
const MATH_SPAN_RE = /\$\$([\s\S]+?)\$\$|\$([^$]+)\$|\\\(([\s\S]+?)\\\)|\\\[([\s\S]+?)\\\]/g;
/** Splits a span / line that lists several relations. */
const LIST_SPLIT_RE = /\\\\|\n|;|,(?!\d)|\\q?quad(?![a-zA-Z])|\\text\s*\{\s*and\s*\}|\band\b|\\land(?![a-zA-Z])|\\\{|\\\}|\\begin\{[a-z*]+\}|\\end\{[a-z*]+\}|&/g;

export type ProblemRelations =
  | { ok: true; relations: XYRelation[]; from: 'statement' | 'board' }
  | { ok: false; reason: string };

/**
 * Every inequality in a problem statement, e.g. "Solve the system by
 * graphing:\n$2x + y < 4$\n$x - 3y > 2$". All-or-nothing: if any piece that
 * carries an inequality sign cannot be read, the whole statement is "cannot
 * tell" — a partial system would describe a LARGER region than the real
 * solution and pass a wrong picture. Equations in the statement are ignored.
 * Only two-variable problems qualify (some relation must use y): a
 * one-variable inequality lives on a number line and a graph of it may
 * legitimately shade something else.
 */
export function extractProblemInequalities(statement: string | null | undefined): ProblemRelations {
  if (typeof statement !== 'string' || !statement.trim()) return { ok: false, reason: 'no problem statement' };
  if (statement.length > 4000) return { ok: false, reason: 'statement too long' };
  if (DOMAIN_VETO_RE.test(statement)) return { ok: false, reason: 'statement restricts the domain or asks for an extreme value' };

  const pieces: string[] = [];
  let sawSpan = false;
  const remainder = statement.replace(MATH_SPAN_RE, (_m, a?: string, b?: string, c?: string, d?: string) => {
    const body = (a ?? b ?? c ?? d ?? '').trim();
    if (CMP_INEQ_RE.test(body)) { sawSpan = true; pieces.push(...body.split(LIST_SPLIT_RE)); }
    return ' ';
  });
  if (sawSpan) {
    if (CMP_INEQ_RE.test(remainder)) return { ok: false, reason: 'an inequality sits outside the math delimiters' };
  } else {
    if (!CMP_INEQ_RE.test(statement)) return { ok: false, reason: 'no inequality in the statement' };
    // Plain text: the relation is what follows the last colon on its line.
    for (const line of statement.split(LIST_SPLIT_RE)) {
      const at = line.lastIndexOf(':');
      pieces.push(at >= 0 ? line.slice(at + 1) : line);
    }
  }

  const relations: XYRelation[] = [];
  for (const raw of pieces) {
    const piece = (raw ?? '').trim();
    if (!piece || !CMP_INEQ_RE.test(piece)) continue; // prose, or an equation
    const parsed = parseXYRelation(piece);
    if (!parsed.ok) return { ok: false, reason: `"${piece.slice(0, 40)}" ${parsed.reason}` };
    relations.push(parsed.relation);
  }
  if (relations.length === 0) return { ok: false, reason: 'no inequality in the statement' };
  if (!relations.some((r) => r.variables.includes('y'))) return { ok: false, reason: 'not a two-variable problem' };
  return { ok: true, relations, from: 'statement' };
}

/** The statement of the newest problem card on the board, if any. The
 *  orchestrator's active-problem slot is cleared by a free-mode detour (a
 *  recap), but the card — and the problem — are still on the board. */
export function boardProblemStatement(commands: ReadonlyArray<unknown>): string | null {
  for (let i = commands.length - 1; i >= 0; i--) {
    const c = commands[i] as Loose | null;
    if (!c || (c.action !== 'showProblem' && c.action !== 'showTryYourself')) continue;
    const problem = (c.problem ?? {}) as Loose;
    const st = typeof problem.statement === 'string' ? problem.statement : typeof c.statement === 'string' ? c.statement : '';
    if (st.trim()) return st;
  }
  return null;
}

/**
 * Last resort when no statement can be read: the inequalities already on the
 * board for this problem (equation cards since the last problem card).
 *
 * LOWER TRUST, and used accordingly (see gateInequalityGraph): equation cards
 * are working, not the problem. The text session of 2026-10-06 boarded the
 * student's own wrong version ("y > (1/3)(2 − x)") next to the right one — a
 * different line, so it does not even conflict with it — and a check that
 * treated every boarded inequality as part of the problem would have
 * rejected the CORRECT graph. So relations read from here never reject a
 * graph: they set boundary line styles and a disagreement is logged. A card
 * like "2x + y < 4 ⇒ y < 4 − 2x" contributes each side of the arrow. If two
 * boarded relations share a boundary but describe different sides (a wrong
 * step shown on purpose, a student's version), the board is not a reliable
 * source and the answer is "cannot tell".
 */
export function boardProblemInequalities(commands: ReadonlyArray<unknown>, w: Window = { x0: -10, x1: 10, y0: -10, y1: 10 }): ProblemRelations {
  let start = 0;
  for (let i = commands.length - 1; i >= 0; i--) {
    const a = (commands[i] as Loose | null)?.action;
    if (a === 'showProblem' || a === 'showTryYourself' || a === 'showSegmentCard') { start = i + 1; break; }
  }
  const found: XYRelation[] = [];
  for (let i = start; i < commands.length; i++) {
    const c = commands[i] as Loose | null;
    if (!c || c.action !== 'showEquation' || typeof c.latex !== 'string') continue;
    const latex = c.latex as string;
    const chain = splitRelationChain(latex);
    const segs = chain ? chain.segments : latex.split(LIST_SPLIT_RE);
    for (const seg of segs) {
      const piece = (seg ?? '').trim();
      if (!piece || !CMP_INEQ_RE.test(piece)) continue;
      const parsed = parseXYRelation(piece);
      if (!parsed.ok) continue; // a card this parser cannot read is simply not evidence
      if (parsed.relation.ops.length !== 1) continue;
      found.push(parsed.relation);
    }
  }
  const kept: XYRelation[] = [];
  for (const r of found) {
    let duplicate = false;
    for (const k of kept) {
      const sign = sameBoundary(r.boundaries[0].diff, k.boundaries[0].diff, w);
      if (sign === null) continue;
      const up = (o: RelOp) => o === '<' || o === '<=';
      const sameSide = (up(r.ops[0]) === up(k.ops[0])) === (sign === 1);
      if (!sameSide || r.strict !== k.strict) return { ok: false, reason: 'the board shows conflicting versions of one inequality' };
      duplicate = true;
      break;
    }
    if (!duplicate) kept.push(r);
  }
  if (kept.length === 0) return { ok: false, reason: 'no inequality on the board for this problem' };
  if (!kept.some((r) => r.variables.includes('y'))) return { ok: false, reason: 'not a two-variable problem' };
  return { ok: true, relations: kept, from: 'board' };
}

// ── drawn region ────────────────────────────────────────────────────────────

interface DrawnRegion { label: 'inequalities' | 'shadedRegion'; contains(x: number, y: number): boolean; margin(x: number, y: number): number }

function fnText(f: unknown): string {
  if (typeof f === 'string') return f;
  if (f && typeof f === 'object') {
    const o = f as Loose;
    for (const key of ['expr', 'latex', 'fn']) if (typeof o[key] === 'string' && (o[key] as string).trim()) return o[key] as string;
  }
  return '';
}

function drawnRegions(data: Loose): { regions: DrawnRegion[]; drawn: XYRelation[] } {
  const regions: DrawnRegion[] = [];
  const drawn: XYRelation[] = [];
  for (const entry of asArray(data.inequalities)) {
    const p = parseXYRelation(inequalityEntryText(entry));
    if (p.ok) drawn.push(p.relation);
  }
  if (drawn.length > 0) {
    regions.push({
      label: 'inequalities',
      contains: (x, y) => drawn.every((r) => r.holds(x, y)),
      margin: (x, y) => Math.min(...drawn.map((r) => r.margin(x, y))),
    });
  }
  const sr = data.shadedRegion as Loose | undefined;
  if (sr && typeof sr === 'object' && Array.isArray(sr.between) && sr.between.length === 2
      && typeof sr.from === 'number' && typeof sr.to === 'number') {
    const norm = normalizeShadedRegion(sr as { axis?: string; between?: unknown });
    const a = parseXYExpression(String((sr.between as unknown[])[0]));
    const b = parseXYExpression(String((sr.between as unknown[])[1]));
    if (a.ok && b.ok) {
      const lo = Math.min(sr.from as number, sr.to as number), hi = Math.max(sr.from as number, sr.to as number);
      const alongX = norm.axis === 'x';
      regions.push({
        label: 'shadedRegion',
        contains: (x, y) => {
          const t = alongX ? x : y, v = alongX ? y : x;
          if (t < lo || t > hi) return false;
          const f1 = a.evaluate(x, y), f2 = b.evaluate(x, y);
          if (!Number.isFinite(f1) || !Number.isFinite(f2)) return false;
          return v >= Math.min(f1, f2) && v <= Math.max(f1, f2);
        },
        margin: (x, y) => {
          const t = alongX ? x : y, v = alongX ? y : x;
          const f1 = a.evaluate(x, y), f2 = b.evaluate(x, y);
          return Math.min(Math.abs(t - lo), Math.abs(t - hi), Math.abs(v - f1), Math.abs(v - f2));
        },
      });
    }
  }
  return { regions, drawn };
}

/**
 * Is this graph a picture of THIS problem? True when something it draws — an
 * inequality's boundary, a plotted function, a bound of the shaded strip —
 * lies along one of the problem's boundaries. A graph that shares no boundary
 * with the problem is something else (a side example of "shading above a
 * line", a different relation the student asked about) and must not be
 * judged, let alone redrawn, against this problem's solution.
 */
export function graphRelatesToProblem(data: unknown, problem: XYRelation[]): boolean {
  if (!data || typeof data !== 'object') return false;
  const d = data as Loose;
  const w = windowOf(d);
  const diffs: Array<(x: number, y: number) => number> = [];
  for (const entry of asArray(d.inequalities)) {
    const p = parseXYRelation(inequalityEntryText(entry));
    if (p.ok) for (const b of p.relation.boundaries) diffs.push(b.diff);
  }
  const yMinus = (text: string): void => {
    const e = parseXYExpression(text);
    if (e.ok && !e.usesY) diffs.push((x, y) => y - e.evaluate(x, y));
  };
  const xMinus = (text: string): void => {
    const e = parseXYExpression(text);
    if (e.ok && !e.usesX) diffs.push((x, y) => x - e.evaluate(x, y));
  };
  for (const f of asArray(d.functions)) { const t = fnText(f); if (t) yMinus(t); }
  for (const f of asArray(d.functionsOfY)) { const t = fnText(f); if (t) xMinus(t); }
  const sr = d.shadedRegion as Loose | undefined;
  if (sr && typeof sr === 'object' && Array.isArray(sr.between)) {
    const alongX = normalizeShadedRegion(sr as { axis?: string; between?: unknown }).axis === 'x';
    for (const bnd of sr.between) if (typeof bnd === 'string') (alongX ? yMinus : xMinus)(bnd);
  }
  return diffs.some((dd) => problem.some((pr) => pr.boundaries.some((b) => sameBoundary(dd, b.diff, w) !== null)));
}

// ── region check ────────────────────────────────────────────────────────────

export type RegionCheck =
  | { verdict: 'pass'; sampled: number; partial?: boolean }
  | { verdict: 'skipped'; why: string }
  | { verdict: 'mismatch'; kind: 'includes_non_solution' | 'misses_solution' | 'strictness'; reason: string };

const listRelations = (rs: XYRelation[]): string => rs.map((r) => r.pretty).join(' and ');

/**
 * Sample the drawn region against the problem's inequalities.
 *  (a) every sampled point of the drawn region satisfies all of them;
 *  (b) at least one point satisfying all of them is inside the drawn region;
 *  (c) a drawn inequality on one of the problem's boundaries has the same
 *      strictness (dashed vs solid).
 * Points within a hair of any boundary are not sampled, so a strict/non-strict
 * difference is decided by (c) and never by a float on the line.
 */
export function checkGraphRegion(data: unknown, problem: XYRelation[]): RegionCheck {
  if (!data || typeof data !== 'object') return { verdict: 'skipped', why: 'no graph data' };
  if (problem.length === 0) return { verdict: 'skipped', why: 'no problem relations' };
  const d = data as Loose;
  const { regions, drawn } = drawnRegions(d);
  if (regions.length === 0) return { verdict: 'skipped', why: 'nothing shaded that can be evaluated' };
  const w = windowOf(d);
  const eps = 1e-7 * Math.max(1, w.x1 - w.x0, w.y1 - w.y0);
  const system = listRelations(problem);

  // (c) strictness, per drawn inequality.
  for (const dr of drawn) {
    if (dr.ops.length !== 1) continue;
    for (const pr of problem) {
      if (pr.ops.length !== 1) continue;
      if (sameBoundary(dr.boundaries[0].diff, pr.boundaries[0].diff, w) === null) continue;
      if (dr.strict !== pr.strict) {
        return {
          verdict: 'mismatch',
          kind: 'strictness',
          reason: pr.strict
            ? `"${dr.pretty}" includes its boundary line, but the problem's ${pr.pretty} is strict — the line itself is not a solution, so it must be dashed. Write that entry with < or > (no "or equal").`
            : `"${dr.pretty}" leaves out its boundary line, but the problem's ${pr.pretty} includes it — the line must be solid. Write that entry with ≤ or ≥.`,
        };
      }
    }
  }

  // A faithful PART of the system is not a mismatch. A tutor who shades the
  // first inequality alone, then the second, then points at the overlap is
  // teaching the method; each of those pictures includes points outside the
  // final solution on purpose. So when every drawn inequality IS one of the
  // problem's (same boundary, same side, same strictness) and nothing else is
  // shaded, the graph passes as a partial picture. A strip, a flipped side or
  // an invented inequality is none of those and goes on to be sampled.
  if (regions.length === 1 && regions[0].label === 'inequalities' && drawn.length > 0) {
    const up = (o: RelOp) => o === '<' || o === '<=';
    const isOneOfTheProblems = (dr: XYRelation): boolean => dr.ops.length === 1 && problem.some((pr) => {
      if (pr.ops.length !== 1 || pr.strict !== dr.strict) return false;
      const sign = sameBoundary(dr.boundaries[0].diff, pr.boundaries[0].diff, w);
      return sign !== null && (up(dr.ops[0]) === up(pr.ops[0])) === (sign === 1);
    });
    if (drawn.every(isOneOfTheProblems) && drawn.length < problem.length) {
      return { verdict: 'pass', sampled: 0, partial: true };
    }
  }

  const pts = samplePoints(w);
  let sampled = 0;
  let solutionPoints = 0;
  let solutionInside = 0;
  let badWitness: { x: number; y: number; nice: boolean; region: DrawnRegion['label'] } | null = null;
  let missWitness: { x: number; y: number; nice: boolean } | null = null;
  const better = (cand: { x: number; y: number; nice: boolean }, cur: { x: number; y: number; nice: boolean } | null): boolean => {
    if (!cur) return true;
    if (cand.nice !== cur.nice) return cand.nice;
    return Math.abs(cand.x) + Math.abs(cand.y) < Math.abs(cur.x) + Math.abs(cur.y);
  };
  for (const p of pts) {
    let near = false;
    for (const r of problem) { const m = r.margin(p.x, p.y); if (!(m > eps)) { near = true; break; } }
    if (near) continue;
    for (const g of regions) { const m = g.margin(p.x, p.y); if (!(m > eps)) { near = true; break; } }
    if (near) continue;
    sampled++;
    const isSolution = problem.every((r) => r.holds(p.x, p.y));
    let insideAny = false;
    for (const g of regions) {
      if (!g.contains(p.x, p.y)) continue;
      insideAny = true;
      if (!isSolution && better(p, badWitness)) badWitness = { ...p, region: g.label };
    }
    if (isSolution) {
      solutionPoints++;
      if (insideAny) solutionInside++;
      else if (better(p, missWitness)) missWitness = p;
    }
  }

  if (badWitness) {
    const failing = problem.find((r) => !r.holds(badWitness!.x, badWitness!.y)) ?? problem[0];
    const what = badWitness.region === 'shadedRegion' ? 'the shaded region' : 'the region where your inequalities overlap';
    return {
      verdict: 'mismatch',
      kind: 'includes_non_solution',
      reason:
        `${what} includes (${fmt(badWitness.x)}, ${fmt(badWitness.y)}), which does not satisfy ${failing.pretty}. ` +
        `The solution is the region where ${problem.length > 1 ? 'all of these hold' : 'this holds'}: ${system}.`,
    };
  }
  if (solutionPoints > 0 && solutionInside === 0 && missWitness) {
    return {
      verdict: 'mismatch',
      kind: 'misses_solution',
      reason:
        `the shading misses the solution: (${fmt(missWitness.x)}, ${fmt(missWitness.y)}) satisfies ${system} but is not shaded. ` +
        `The solution is the region where ${problem.length > 1 ? 'all of these hold' : 'this holds'}: ${system}.`,
    };
  }
  return { verdict: 'pass', sampled };
}

// ── the gate (validator / normaliser for a showGraph command) ───────────────

export interface InequalityGateContext {
  /** TUTOR_GRAPH_INEQUALITIES — validate + normalise the new fields. */
  enabled?: boolean;
  /** TUTOR_GRAPH_REGION_CHECK — sample against the problem. */
  regionCheck?: boolean;
  /** The active problem's statement, if any. */
  problemStatement?: string | null;
  /** The running board command list (for the board fallback). */
  boardCommands?: ReadonlyArray<unknown>;
  /** Per-problem count of region rejections already issued (mutated). One
   *  rejection per problem; after that a mismatch is repaired from the
   *  problem statement instead, so a brain that cannot fix its picture
   *  costs one retry, not a loop. */
  rejections?: Map<string, number>;
}

export interface GateNote { kind: string; detail: string }

export type InequalityGateResult =
  | { ok: true; data: unknown; notes: GateNote[] }
  | { ok: false; reason: string; notes: GateNote[] };

const REDRAW_HINT =
  'Redraw with `inequalities` — one entry per inequality of the problem, written exactly as the relation (the tool draws each boundary, dashed when strict, and shades each side; the overlap is the solution). Do not use `shadedRegion` for a solution region.';

/**
 * Validate and normalise the inequality-related parts of a showGraph command
 * and, when the active problem's inequalities can be read, check the drawn
 * region against them. Returns the (possibly new) data object; identity is
 * preserved when nothing changed.
 */
export function gateInequalityGraph(data: unknown, ctx: InequalityGateContext = {}): InequalityGateResult {
  const notes: GateNote[] = [];
  if (!data || typeof data !== 'object') return { ok: true, data, notes };
  const enabled = ctx.enabled !== false;
  let out = data as Loose;
  const patch = (changes: Loose): void => { out = { ...out, ...changes }; };

  if (enabled) {
    // 1. inequalities
    if (out.inequalities != null) {
      const raw = typeof out.inequalities === 'string' ? [out.inequalities] : out.inequalities;
      if (!Array.isArray(raw)) {
        return { ok: false, reason: `show_function_graph: \`inequalities\` must be a list. ${FORM_HINT}`, notes };
      }
      if (raw.length > MAX_INEQUALITIES) {
        return { ok: false, reason: `show_function_graph: at most ${MAX_INEQUALITIES} inequalities can be drawn on one graph (got ${raw.length}).`, notes };
      }
      const normalised: GraphInequalityEntry[] = [];
      for (let i = 0; i < raw.length; i++) {
        const text = inequalityEntryText(raw[i]);
        if (!text) {
          return { ok: false, reason: `show_function_graph: inequalities[${i}] has no expression. ${FORM_HINT}`, notes };
        }
        const parsed = parseXYRelation(text);
        if (!parsed.ok) {
          notes.push({ kind: 'rejected', detail: `inequalities[${i}] "${text.slice(0, 60)}" ${parsed.reason}` });
          return { ok: false, reason: `show_function_graph: inequalities[${i}] "${text.slice(0, 80)}" ${parsed.reason}. ${FORM_HINT}`, notes };
        }
        const o = (raw[i] && typeof raw[i] === 'object' ? raw[i] : {}) as Loose;
        normalised.push({
          expr: parsed.relation.source,
          latex: parsed.relation.desmosLatex,
          strict: parsed.relation.strict,
          ...(typeof o.color === 'string' && o.color ? { color: o.color } : {}),
          ...(typeof o.label === 'string' && o.label ? { label: o.label } : {}),
        });
      }
      if (normalised.length === 0) {
        const { inequalities: _drop, ...rest } = out;
        void _drop;
        out = rest;
      } else if (JSON.stringify(normalised) !== JSON.stringify(out.inequalities)) {
        patch({ inequalities: normalised });
      }
    }

    // 2. lineStyle on plotted functions
    for (const key of ['functions', 'functionsOfY'] as const) {
      const list = asArray(out[key]);
      let changed = false;
      const next = list.map((f) => {
        if (!f || typeof f !== 'object' || !('lineStyle' in (f as Loose))) return f;
        const style = normalizeLineStyle((f as Loose).lineStyle);
        if (style === (f as Loose).lineStyle) return f;
        changed = true;
        const { lineStyle: _ls, ...rest } = f as Loose;
        void _ls;
        return style ? { ...rest, lineStyle: style } : rest;
      });
      if (changed) patch({ [key]: next });
    }
  }

  const { regions, drawn } = drawnRegions(out);
  const w = windowOf(out);

  // 3. A function drawn along a boundary takes that boundary's style.
  const alignStyles = (authority: XYRelation[], source: string): void => {
    if (authority.length === 0) return;
    const list = asArray(out.functions);
    let changed = false;
    const next = list.map((f) => {
      const text = fnText(f);
      if (!text || !f || typeof f !== 'object') return f;
      const parsed = parseXYExpression(text);
      if (!parsed.ok || parsed.usesY) return f;
      const diff = (x: number, y: number): number => y - parsed.evaluate(x, y);
      for (const r of authority) {
        if (r.ops.length !== 1) continue;
        if (sameBoundary(diff, r.boundaries[0].diff, w) === null) continue;
        const want: 'solid' | 'dashed' = r.strict ? 'dashed' : 'solid';
        const have = normalizeLineStyle((f as Loose).lineStyle) ?? 'solid';
        if (have === want) return f;
        changed = true;
        notes.push({ kind: 'style_aligned', detail: `"${text.slice(0, 40)}" → ${want} (boundary of ${r.pretty}, ${source})` });
        return { ...(f as Loose), lineStyle: want };
      }
      return f;
    });
    if (changed) patch({ functions: next });
  };
  if (enabled) alignStyles(drawn, 'this graph');

  // 4. Against the problem: boundary styles always, the region when one is
  //    shaded. (A graph of just the two boundary lines of a strict system
  //    should show them dashed whether or not anything is shaded yet.)
  const hasPlots = asArray(out.functions).length > 0;
  if (ctx.regionCheck !== false && (regions.length > 0 || (enabled && hasPlots))) {
    let problem = extractProblemInequalities(ctx.problemStatement);
    if (!problem.ok && ctx.boardCommands) {
      // The active-problem slot is empty or unreadable: read the problem
      // card that is still on the board.
      const carded = boardProblemStatement(ctx.boardCommands);
      if (carded && carded !== ctx.problemStatement) problem = extractProblemInequalities(carded);
    }
    const statementReason = problem.ok ? '' : problem.reason;
    if (!problem.ok && ctx.boardCommands) problem = boardProblemInequalities(ctx.boardCommands, w);
    if (!problem.ok) {
      if (regions.length > 0) notes.push({ kind: 'region_skipped', detail: `statement: ${statementReason}${ctx.boardCommands ? `; board: ${problem.reason}` : ''}` });
    } else if (regions.length === 0) {
      alignStyles(problem.relations, 'the problem');
    } else if (!graphRelatesToProblem(out, problem.relations)) {
      notes.push({ kind: 'region_skipped', detail: 'the graph shares no boundary with the problem — a different picture, not checked' });
    } else {
      if (enabled) alignStyles(problem.relations, 'the problem');
      const check = checkGraphRegion(out, problem.relations);
      if (check.verdict === 'pass') {
        notes.push({ kind: 'region_pass', detail: check.partial
          ? `partial picture — every drawn inequality is one of the problem's (${problem.from})`
          : `${problem.relations.length} relation(s) from the ${problem.from}, ${check.sampled} points` });
      } else if (check.verdict === 'skipped') {
        notes.push({ kind: 'region_skipped', detail: check.why });
      } else if (problem.from === 'board') {
        // Equation cards are not the problem statement — never reject on them.
        notes.push({ kind: 'region_unverified_mismatch', detail: `relations read from equation cards, graph painted as sent — ${check.kind}: ${check.reason.slice(0, 160)}` });
      } else {
        const key = `${problem.from}:${listRelations(problem.relations)}`;
        const used = ctx.rejections?.get(key) ?? 0;
        if (used < 1 || !ctx.rejections) {
          ctx.rejections?.set(key, used + 1);
          notes.push({ kind: 'region_mismatch', detail: `${check.kind}: ${check.reason.slice(0, 200)}` });
          return { ok: false, reason: `show_function_graph: ${check.reason} ${REDRAW_HINT}`, notes };
        }
        if (enabled) {
          // Second miss on the same problem: draw the problem's own
          // inequalities rather than paint a region known to be wrong.
          const { shadedRegion: _sr, ...rest } = out;
          void _sr;
          out = {
            ...rest,
            inequalities: problem.relations.map((r): GraphInequalityEntry => ({ expr: r.source, latex: r.desmosLatex, strict: r.strict })),
          };
          alignStyles(problem.relations, 'the problem');
          notes.push({ kind: 'region_repaired', detail: `second mismatch (${check.kind}) — drew the problem's own inequalities: ${listRelations(problem.relations)}` });
        } else {
          notes.push({ kind: 'region_gave_up', detail: `second mismatch (${check.kind}) with the inequalities flag off — graph painted as sent` });
        }
      }
    }
  }

  return { ok: true, data: out === (data as Loose) ? data : out, notes };
}

// ── board description (what the brain reads back about its own graph) ───────

/**
 * Text for the board snapshot: inequalities with their boundary style, the
 * shaded region with its bounds, and line styles — the parts of a graph the
 * snapshot used to leave out.
 */
export function describeGraphRegions(data: unknown): string[] {
  if (!data || typeof data !== 'object') return [];
  const d = data as Loose;
  const parts: string[] = [];
  const ineqs = asArray(d.inequalities)
    .map((e) => {
      const r = resolveInequalityEntry(e);
      const text = r ? r.pretty : cleanSource(inequalityEntryText(e));
      if (!text) return '';
      return `${text} (${r ? (r.strict ? 'dashed boundary, line not included' : 'solid boundary, line included') : 'unreadable'})`;
    })
    .filter(Boolean)
    .slice(0, MAX_INEQUALITIES);
  if (ineqs.length > 0) {
    parts.push(`inequalities shaded: ${ineqs.join('; ')}${ineqs.length > 1 ? ' — each side is shaded, and the darkest area, where ALL hold, is the solution' : ''}`);
  }
  const sr = d.shadedRegion as Loose | undefined;
  if (sr && typeof sr === 'object' && Array.isArray(sr.between) && sr.between.length === 2) {
    const norm = normalizeShadedRegion(sr as { axis?: string; between?: unknown });
    const v = norm.axis === 'y' ? 'y' : 'x';
    parts.push(`shaded region: the area BETWEEN ${String(sr.between[0]).trim()} and ${String(sr.between[1]).trim()} for ${v} from ${fmt(Number(sr.from))} to ${fmt(Number(sr.to))} (a bounded strip, not a half-plane)`);
  }
  return parts;
}

/** " (dashed)" / "" suffix for a plotted function in the description. */
export function lineStyleSuffix(fn: unknown): string {
  if (!fn || typeof fn !== 'object') return '';
  return normalizeLineStyle((fn as Loose).lineStyle) === 'dashed' ? ' [dashed]' : '';
}
