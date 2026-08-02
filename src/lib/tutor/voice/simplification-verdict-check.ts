/**
 * Deterministic detector for false DENIALS of a correct simplification answer.
 *
 * Live bug class (2026-07-31, session portal-734b537e…): the tutor asked
 * "what does $3x - 12 + 2$ combine into?", the student answered "3x - 10"
 * (correct), and the tutor opened with "Not quite — check that middle step
 * again." The LLM judge caught it 4.6s later but the judge is advisory-only
 * (Pillar 2b) and the deterministic arithmetic-claim check only fires on
 * explicit numeric identity claims — a bare "Not quite" carries none.
 *
 * This check closes that gap deterministically: when the tutor's PREVIOUS
 * turn asked the student to simplify/combine a linear expression, the
 * student's utterance IS that expression's fully-simplified canonical form,
 * and the brain's sentence opens with a denial — the denial is provably
 * false and may kill.
 *
 * Scope is deliberately conservative (bail with 'ok' on anything else):
 *  - linear polynomials only (rational coefficients, any number of
 *    single-letter variables, scalar distribution over parentheses);
 *  - the student's form must be FULLY simplified (each variable at most
 *    once, at most one constant term, no parentheses) — an equivalent-but-
 *    unsimplified echo is a legitimate thing for the tutor to push back on;
 *  - the student's token sequence must differ from the asked expression
 *    (they must actually have transformed it).
 *
 * Pure module — no imports, no side effects. Never throws.
 */

export interface SimplificationVerdictInput {
  /** The tutor's previous turn — the question the student is answering. */
  priorTutorTurn: string;
  /** The student's utterance for the current turn. */
  studentUtterance: string;
  /** The brain sentence under scrutiny (arrives sentence-by-sentence). */
  sentence: string;
}

export interface SimplificationVerdictResult {
  verdict: 'ok' | 'false_denial';
  /** The expression the tutor asked the student to simplify, as asked. */
  asked?: string;
  /** Canonical simplified form both sides reduce to, e.g. "3x - 10". */
  correct?: string;
}

const OK: SimplificationVerdictResult = { verdict: 'ok' };

// ---------------------------------------------------------------------------
// Denial detection — the sentence must OPEN with an unambiguous denial.
// ---------------------------------------------------------------------------

const DENIAL_RE =
  /^\s*(?:not\s+(?:quite|exactly|really|right|correct)\b|nope\b|that'?s\s+not\b|hmm+,?\s+not\s+(?:quite|exactly)\b|close,?\s+but\b|not\s+what\b)/i;

// ---------------------------------------------------------------------------
// Ask extraction — a prior-turn sentence that both asks for a simplification
// and shows the expression in a $…$ span.
// ---------------------------------------------------------------------------

const ASK_KEYWORD_RE =
  /\b(?:simplif|combin|collect(?:ing)?\s+(?:the\s+)?like\s+terms|become(?:s)?\b|come\s+out\s+to|add\s+up\s+to)/i;

const SPAN_RE = /\$([^$]+)\$/g;

function extractAskedExpression(priorTutorTurn: string): string | null {
  const sentences = priorTutorTurn.split(/(?<=[.!?])\s+|\n+/);
  let asked: string | null = null;
  for (const s of sentences) {
    if (!ASK_KEYWORD_RE.test(s)) continue;
    SPAN_RE.lastIndex = 0;
    let m: RegExpExecArray | null;
    let last: string | null = null;
    while ((m = SPAN_RE.exec(s)) !== null) last = m[1];
    if (last !== null) asked = last;
  }
  return asked;
}

// ---------------------------------------------------------------------------
// Exact rational arithmetic.
// ---------------------------------------------------------------------------

interface Frac { n: number; d: number } // d > 0, normalized

function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { const t = a % b; a = b; b = t; }
  return a || 1;
}

function frac(n: number, d: number): Frac {
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(n, d);
  return { n: n / g, d: d / g };
}

function fAdd(a: Frac, b: Frac): Frac { return frac(a.n * b.d + b.n * a.d, a.d * b.d); }
function fMul(a: Frac, b: Frac): Frac { return frac(a.n * b.n, a.d * b.d); }
function fDiv(a: Frac, b: Frac): Frac | null { return b.n === 0 ? null : frac(a.n * b.d, a.d * b.n); }
function fNeg(a: Frac): Frac { return { n: -a.n, d: a.d }; }
function fEq(a: Frac, b: Frac): boolean { return a.n === b.n && a.d === b.d; }
const F0: Frac = { n: 0, d: 1 };
const F1: Frac = { n: 1, d: 1 };

function fracFromLiteral(lit: string): Frac | null {
  const dot = lit.indexOf('.');
  if (dot === -1) {
    const n = parseInt(lit, 10);
    return Number.isSafeInteger(n) ? { n, d: 1 } : null;
  }
  const decimals = lit.length - dot - 1;
  if (decimals > 9) return null;
  const scaled = Math.round(parseFloat(lit) * Math.pow(10, decimals));
  if (!Number.isSafeInteger(scaled)) return null;
  return frac(scaled, Math.pow(10, decimals));
}

// ---------------------------------------------------------------------------
// Tokenizer + linear-polynomial parser (recursive descent).
// Poly = map var→coeff with '' as the constant key.
// ---------------------------------------------------------------------------

type Token =
  | { t: 'num'; v: string }
  | { t: 'var'; v: string }
  | { t: 'op'; v: '+' | '-' | '*' | '/' }
  | { t: 'lp' }
  | { t: 'rp' };

function normalizeExprText(raw: string): string | null {
  let s = raw;
  s = s.replace(/\\cdot\b/g, '*').replace(/\\times\b/g, '*').replace(/\\div\b/g, '/');
  s = s.replace(/[×·]/g, '*').replace(/÷/g, '/').replace(/[−–]/g, '-');
  s = s.replace(/[’‘]/g, "'");
  s = s.replace(/\bplus\b/gi, ' + ').replace(/\bminus\b/gi, ' - ');
  s = s.replace(/\bmultiplied\s+by\b/gi, ' * ').replace(/\btimes\b/gi, ' * ');
  s = s.replace(/\bdivided\s+by\b/gi, ' / ');
  s = s.replace(/[{}]/g, ' ');
  if (/[\\^=<>%!?]/.test(s)) return null; // out-of-scope math or leftover LaTeX
  return s;
}

function tokenize(raw: string): Token[] | null {
  const s = normalizeExprText(raw);
  if (s === null) return null;
  const out: Token[] = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/\s/.test(c) || c === ',') { i++; continue; }
    if (/\d/.test(c)) {
      let j = i;
      while (j < s.length && /[\d.]/.test(s[j])) j++;
      const lit = s.slice(i, j);
      if ((lit.match(/\./g) ?? []).length > 1) return null;
      out.push({ t: 'num', v: lit });
      i = j;
      continue;
    }
    if (/[a-zA-Z]/.test(c)) { out.push({ t: 'var', v: c.toLowerCase() }); i++; continue; }
    if (c === '+' || c === '-' || c === '*' || c === '/') { out.push({ t: 'op', v: c }); i++; continue; }
    if (c === '(' || c === '[') { out.push({ t: 'lp' }); i++; continue; }
    if (c === ')' || c === ']') { out.push({ t: 'rp' }); i++; continue; }
    return null; // unknown character → bail
  }
  return out;
}

type Poly = Map<string, Frac>;

function polyAdd(a: Poly, b: Poly): Poly {
  const out: Poly = new Map(a);
  for (const [k, v] of b) out.set(k, fAdd(out.get(k) ?? F0, v));
  return out;
}

function polyScale(p: Poly, k: Frac): Poly {
  const out: Poly = new Map();
  for (const [key, v] of p) out.set(key, fMul(v, k));
  return out;
}

function polyMul(a: Poly, b: Poly): Poly | null {
  const aConst = isConstPoly(a);
  const bConst = isConstPoly(b);
  if (!aConst && !bConst) return null; // nonlinear
  if (aConst) return polyScale(b, a.get('') ?? F0);
  return polyScale(a, b.get('') ?? F0);
}

function isConstPoly(p: Poly): boolean {
  for (const k of p.keys()) if (k !== '' && !fEq(p.get(k)!, F0)) return false;
  return true;
}

interface ParseMeta {
  sawParen: boolean;
  /** Top-level ± term count per key ('' = constant). */
  termCounts: Map<string, number>;
}

interface ParseState { toks: Token[]; i: number; meta: ParseMeta }

function parsePrimary(st: ParseState): Poly | null {
  const tok = st.toks[st.i];
  if (!tok) return null;
  if (tok.t === 'num') {
    st.i++;
    const f = fracFromLiteral(tok.v);
    if (!f) return null;
    return new Map([['', f]]);
  }
  if (tok.t === 'var') {
    st.i++;
    return new Map([[tok.v, F1]]);
  }
  if (tok.t === 'lp') {
    st.i++;
    st.meta.sawParen = true;
    const inner = parseExpr(st, false);
    if (!inner) return null;
    if (!st.toks[st.i] || st.toks[st.i].t !== 'rp') return null;
    st.i++;
    return inner;
  }
  if (tok.t === 'op' && tok.v === '-') {
    st.i++;
    const p = parsePrimary(st);
    return p ? polyScale(p, fNeg(F1)) : null;
  }
  return null;
}

/** term := primary (('*'|'/'| implicit) primary)* — must stay linear. */
function parseTerm(st: ParseState): Poly | null {
  let acc = parsePrimary(st);
  if (!acc) return null;
  for (;;) {
    const tok = st.toks[st.i];
    if (!tok) break;
    if (tok.t === 'op' && (tok.v === '*' || tok.v === '/')) {
      st.i++;
      const rhs = parsePrimary(st);
      if (!rhs) return null;
      if (tok.v === '*') {
        const m = polyMul(acc, rhs);
        if (!m) return null;
        acc = m;
      } else {
        if (!isConstPoly(rhs)) return null;
        const inv = fDiv(F1, rhs.get('') ?? F0);
        if (!inv) return null;
        acc = polyScale(acc, inv);
      }
      continue;
    }
    // Implicit multiplication: 3x, 3(x-4), (x-4)(…) — variable/paren/number
    // directly adjacent.
    if (tok.t === 'var' || tok.t === 'lp' || tok.t === 'num') {
      const rhs = parsePrimary(st);
      if (!rhs) return null;
      const m = polyMul(acc, rhs);
      if (!m) return null;
      acc = m;
      continue;
    }
    break;
  }
  return acc;
}

/** expr := [±] term (('+'|'-') term)* */
function parseExpr(st: ParseState, topLevel: boolean): Poly | null {
  let acc: Poly = new Map();
  let sign: Frac = F1;
  const first = st.toks[st.i];
  if (first && first.t === 'op') {
    if (first.v === '-') { sign = fNeg(F1); st.i++; }
    else if (first.v === '+') { st.i++; }
  }
  for (;;) {
    const term = parseTerm(st);
    if (!term) return null;
    const signed = polyScale(term, sign);
    acc = polyAdd(acc, signed);
    if (topLevel) {
      const keys = [...signed.keys()].filter((k) => !fEq(signed.get(k)!, F0));
      const key = keys.length === 0 ? '' : keys.length === 1 ? keys[0] : '(multi)';
      st.meta.termCounts.set(key, (st.meta.termCounts.get(key) ?? 0) + 1);
    }
    const tok = st.toks[st.i];
    if (tok && tok.t === 'op' && (tok.v === '+' || tok.v === '-')) {
      sign = tok.v === '-' ? fNeg(F1) : F1;
      st.i++;
      continue;
    }
    break;
  }
  return acc;
}

interface ParsedExpression { poly: Poly; meta: ParseMeta; tokens: Token[] }

function parseExpression(raw: string): ParsedExpression | null {
  if (typeof raw !== 'string' || raw.length === 0 || raw.length > 200) return null;
  const toks = tokenize(raw);
  if (!toks || toks.length === 0) return null;
  const st: ParseState = { toks, i: 0, meta: { sawParen: false, termCounts: new Map() } };
  const poly = parseExpr(st, true);
  if (!poly || st.i !== toks.length) return null; // must consume everything
  return { poly, meta: st.meta, tokens: toks };
}

function polyEquals(a: Poly, b: Poly): boolean {
  const keys = new Set([...a.keys(), ...b.keys()]);
  for (const k of keys) {
    if (!fEq(a.get(k) ?? F0, b.get(k) ?? F0)) return false;
  }
  return true;
}

/** Fully simplified = no parens, and each key contributed by at most one ± term. */
function isFullySimplified(p: ParsedExpression): boolean {
  if (p.meta.sawParen) return false;
  for (const [key, count] of p.meta.termCounts) {
    if (key === '(multi)') return false;
    if (count > 1) return false;
  }
  return true;
}

// ---------------------------------------------------------------------------
// Student-utterance cleanup — strip leading answer fillers and trailing
// punctuation, then require the remainder to parse completely.
// ---------------------------------------------------------------------------

const FILLER_RE =
  /^(?:um+|uh+|so|okay|ok|well|yeah|hmm+|oh|i\s+think|i\s+guess|maybe|it\s+would\s+be|it'?s|it|that\s+would\s+be|that'?s|that|this|would\s+be|equals?|is|the\s+answer\s+is)\b[,.\s]*/i;

function cleanStudentUtterance(raw: string): string {
  let s = raw.trim();
  for (let guard = 0; guard < 8; guard++) {
    const next = s.replace(FILLER_RE, '');
    if (next === s) break;
    s = next.trim();
  }
  return s.replace(/[.?!]+\s*$/, '').trim();
}

// ---------------------------------------------------------------------------
// Canonical rendering — variable terms in asked-expression order, constant
// last: "3x - 10".
// ---------------------------------------------------------------------------

function fmtFrac(f: Frac): string {
  return f.d === 1 ? String(f.n) : `${f.n}/${f.d}`;
}

function renderCanonical(poly: Poly, varOrder: string[]): string {
  const parts: Array<{ key: string; coeff: Frac }> = [];
  for (const v of varOrder) {
    const c = poly.get(v);
    if (c && !fEq(c, F0)) parts.push({ key: v, coeff: c });
  }
  const constant = poly.get('') ?? F0;
  if (!fEq(constant, F0)) parts.push({ key: '', coeff: constant });
  if (parts.length === 0) return '0';
  let out = '';
  parts.forEach((p, idx) => {
    const neg = p.coeff.n < 0;
    const abs: Frac = { n: Math.abs(p.coeff.n), d: p.coeff.d };
    let body: string;
    if (p.key === '') body = fmtFrac(abs);
    else if (abs.n === 1 && abs.d === 1) body = p.key;
    else body = `${fmtFrac(abs)}${p.key}`;
    if (idx === 0) out = (neg ? '-' : '') + body;
    else out += (neg ? ' - ' : ' + ') + body;
  });
  return out;
}

function tokenSignature(tokens: Token[]): string {
  return tokens.map((t) => (t.t === 'num' || t.t === 'var' ? `${t.t}:${t.v}` : t.t === 'op' ? t.v : t.t)).join(' ');
}

// ---------------------------------------------------------------------------
// Main check.
// ---------------------------------------------------------------------------

export function checkSimplificationVerdict(
  input: SimplificationVerdictInput,
): SimplificationVerdictResult {
  try {
    const { priorTutorTurn, studentUtterance, sentence } = input ?? {};
    if (typeof priorTutorTurn !== 'string' || typeof studentUtterance !== 'string' || typeof sentence !== 'string') return OK;
    if (!DENIAL_RE.test(sentence)) return OK;

    const askedRaw = extractAskedExpression(priorTutorTurn);
    if (!askedRaw) return OK;
    const asked = parseExpression(askedRaw);
    if (!asked) return OK;

    const cleaned = cleanStudentUtterance(studentUtterance);
    if (cleaned.length === 0 || cleaned.length > 80) return OK;
    const student = parseExpression(cleaned);
    if (!student) return OK;

    // The student must have actually transformed the expression …
    if (tokenSignature(student.tokens) === tokenSignature(asked.tokens)) return OK;
    // … into its fully-simplified form.
    if (!isFullySimplified(student)) return OK;
    if (!polyEquals(asked.poly, student.poly)) return OK;

    const varOrder: string[] = [];
    for (const t of asked.tokens) {
      if (t.t === 'var' && !varOrder.includes(t.v)) varOrder.push(t.v);
    }
    return {
      verdict: 'false_denial',
      asked: askedRaw.trim(),
      correct: renderCanonical(student.poly, varOrder),
    };
  } catch {
    return OK;
  }
}
