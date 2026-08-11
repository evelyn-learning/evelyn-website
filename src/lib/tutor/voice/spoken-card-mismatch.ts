/**
 * Deterministic detector for a same-turn spoken-vs-board term mismatch
 * (2026-08-10 root cause, prod session portal-7cfa226c, AP Calc BC): the
 * tutor's SPOKEN derivation correctly expanded the product rule —
 * "$u'v + uv' = 2\sin t + 2t\cos t$" — but the show_equation card rendered
 * onto the whiteboard in the SAME turn read
 * "\frac{d}{dt}[2t\sin t] = 2\cos t + 2t\sin t" — the coefficient each
 * trig term carries is transposed (2·cos / 2t·sin on the card vs.
 * 2·sin / 2t·cos in the correct narration). The board contradicts the
 * tutor's own correct spoken math, and — per the whiteboard-snapshot
 * feedback loop — the wrong card then re-enters context on the NEXT turn
 * as ground truth, snowballing the error.
 *
 * Mechanism (FP-hardening review round, 2026-08-10): extract the card
 * latex's top-level equality RHS and split it into a signed-term multiset
 * (+/- at brace-depth 0). Do the same for every inline-math equality found
 * in the turn's spoken sentences. Each term is further split into a
 * COEFFICIENT token (a leading numeric-ish multiplier, e.g. "2" / "2t") and
 * a LOOSE base (the remainder — "\cos t" / "x" / a bare constant with no
 * coefficient at all). A transposition error like the incident above
 * shares NO term if terms are compared whole ("2\cos t" vs "2\sin t" vs
 * "2t\cos t" vs "2t\sin t" are four distinct strings), so "is this even
 * about the same expression" is judged at the coefficient/base level
 * instead:
 *
 *   PERMUTATION GATE — a spoken RHS only QUALIFIES for comparison against
 *   the card when its terms are built from the exact same PARTS as the
 *   card's: the multiset of loose bases matches AND the multiset of
 *   coefficient tokens matches (same ingredients, count included — not
 *   just "shares one term"). This is what the original "shares >= 1 loose
 *   term" gate got wrong: "2x + 7" spoken against a "2x + 4" card shared
 *   the "2x" term and used to flag even though 7 and 4 are just two
 *   different unrelated constants (a recap / multi-part / aside shape) —
 *   under the full-multiset gate, base multisets {x,7} vs {x,4} don't
 *   match, so it's correctly treated as unrelated. The real incident
 *   passes the gate: card {2·cos t, 2t·sin t} vs spoken {2·sin t,
 *   2t·cos t} have the SAME coefficient multiset {2, 2t} and the SAME base
 *   multiset {cos t, sin t} — same parts, different pairing.
 *
 *   LAST-ASSERTION-WINS — of every spoken equality that qualifies (passes
 *   the gate above), only the LAST one in turn order is judged against the
 *   card, mirroring Fix A's (praise-contradiction.ts) "final assertion
 *   wins" design. This absorbs in-turn self-correction: "You said
 *   $y=3x-2$ by mistake — it should be $y=3x+2$" has a first equality that
 *   legitimately qualifies (same coefficient/base parts as the card, just
 *   a sign typo) and would flag under a first-match rule — but it's
 *   superseded by the later, correct equality, so only that final one is
 *   judged. A qualifying equality is then flagged only when its STRICT
 *   signed-term multiset (coefficient + sign included) differs from the
 *   card's; identical (up to term order) RHS's pass.
 *
 *   KNOWN LIMITATION (accepted, not fixed here): "two parallel lines in
 *   one breath" — spoken text asserting BOTH "$y=2x+3$" and "$y=2x-3$" in
 *   the same turn against a card showing just "$y=2x+3$" — is structurally
 *   IDENTICAL to a real self-correction sign-flip typo (case 1 in
 *   test-spoken-card-mismatch.ts, kept as a documented "flags" case).
 *   Last-assertion-wins has no syntactic signal to tell "two intentionally
 *   distinct lines stated together" apart from "a typo, corrected" — both
 *   are [qualifying-match, qualifying-sign-flip] in raw text order, and
 *   disambiguating them would need discourse-level understanding (an LLM
 *   judge), not a deterministic parse. Accepted false-positive class.
 *
 * Pure module — no imports, no side effects. Never throws.
 */

export interface SpokenCardMismatchResult {
  mismatch: boolean;
  reason?: string;
}

/** Strips \left, \right, thin-space \,, plain whitespace, and braces. */
function normalizeMathText(s: string): string {
  return s
    .replace(/\\left/g, '')
    .replace(/\\right/g, '')
    .replace(/\\,/g, '')
    .replace(/[{}]/g, '')
    .replace(/\s+/g, '');
}

/**
 * Splits a RHS string into additive terms at brace-depth 0 — a '{'/'}'
 * pair anywhere in a term is kept intact; we never split inside one. Each
 * returned chunk retains its leading sign character (or none, for the
 * first term).
 */
function splitTermsAtDepthZero(s: string): string[] {
  const terms: string[] = [];
  let depth = 0;
  let current = '';
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === '{') depth++;
    else if (ch === '}') depth--;
    if ((ch === '+' || ch === '-') && depth === 0 && current.trim().length > 0) {
      terms.push(current);
      current = ch;
      continue;
    }
    current += ch;
  }
  if (current.trim().length > 0) terms.push(current);
  return terms;
}

interface SignedTerm {
  sign: '+' | '-';
  /** Full normalized body, coefficient included — used for the STRICT
   * equality/differ check. */
  strictKey: string;
  /** The term's base with any leading numeric-ish coefficient peeled off
   * (e.g. "2\cos t" -> "\cos t", "2t\sin t" -> "\sin t", "2x" -> "x") —
   * one half of the structural "same parts" permutation gate. A bare
   * constant term (e.g. "7") has no coefficient to peel and IS its own
   * base, so two different constants never collide. */
  looseKey: string;
  /** The coefficient token peeled off to produce looseKey ("2", "2t", or
   * "" when the term had none) — the other half of the permutation gate. */
  coefficient: string;
}

/** Splits a normalized term body into {coefficient, base}. A leading
 * digit run is the coefficient magnitude; if exactly one bare letter
 * immediately follows AND something further remains after that letter
 * (e.g. "2t\sin t" -> digits "2", letter "t", remainder "\sint"), the
 * letter joins the coefficient ("2t") and the remainder is the base. If
 * nothing (or only that one letter) follows the digits, the digits alone
 * are the coefficient and whatever's left is the base (e.g. "2x" ->
 * coefficient "2", base "x"). A bare numeric term with nothing after the
 * digits (e.g. "7") has NO coefficient — the whole term is its own base. */
function splitCoefficientAndBase(strictKey: string): { coefficient: string; base: string } {
  const digitMatch = strictKey.match(/^\d+(?:\.\d+)?/);
  if (!digitMatch) return { coefficient: '', base: strictKey };
  const digits = digitMatch[0];
  const rest = strictKey.slice(digits.length);
  if (rest.length === 0) {
    return { coefficient: '', base: strictKey };
  }
  if (/^[a-zA-Z]/.test(rest) && rest.length > 1) {
    return { coefficient: digits + rest[0], base: rest.slice(1) };
  }
  return { coefficient: digits, base: rest };
}

function parseSignedTerm(raw: string): SignedTerm {
  const trimmed = raw.trim();
  let sign: '+' | '-' = '+';
  let body = trimmed;
  if (body.startsWith('+')) body = body.slice(1);
  else if (body.startsWith('-')) { sign = '-'; body = body.slice(1); }
  const strictKey = normalizeMathText(body);
  const { coefficient, base } = splitCoefficientAndBase(strictKey);
  return { sign, strictKey, looseKey: base, coefficient };
}

/** Position of the first top-level ('{'/'}' depth 0) '=' in `s`, or -1. */
function findTopLevelEquals(s: string): number {
  let depth = 0;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === '{') depth++;
    else if (ch === '}') depth--;
    else if (ch === '=' && depth === 0) return i;
  }
  return -1;
}

/** Extracts the RHS text of a "LHS = RHS" string's top-level equality. */
function extractEqualityRHS(latex: string): string | null {
  const idx = findTopLevelEquals(latex);
  if (idx < 0) return null;
  const rhs = latex.slice(idx + 1).trim();
  return rhs.length > 0 ? rhs : null;
}

function termMultiset(rhs: string): SignedTerm[] {
  return splitTermsAtDepthZero(rhs)
    .map(parseSignedTerm)
    .filter((t) => t.strictKey.length > 0);
}

/** Order-independent multiset equality on plain string keys. */
function multisetEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const remaining = [...b];
  for (const x of a) {
    const idx = remaining.indexOf(x);
    if (idx === -1) return false;
    remaining.splice(idx, 1);
  }
  return true;
}

/** Multiset equality (order-independent) on the STRICT (sign+coefficient
 * included) key. */
function strictSetsEqual(a: SignedTerm[], b: SignedTerm[]): boolean {
  return multisetEqual(
    a.map((t) => `${t.sign}${t.strictKey}`),
    b.map((t) => `${t.sign}${t.strictKey}`),
  );
}

/** The permutation gate: true only when both sides are built from the
 * exact same PARTS — the full multiset of loose bases matches AND the
 * full multiset of coefficient tokens matches (sign-agnostic; term count
 * included via the underlying length check). This is the false-positive
 * guard: two RHS's that merely share one term in passing (different
 * problems, a recap aside) don't match on the full multiset and are
 * ignored; the real incident's coefficient/base sets line up exactly
 * (same parts, different pairing) and qualifies for the strict check. */
function sameStructure(a: SignedTerm[], b: SignedTerm[]): boolean {
  return (
    multisetEqual(a.map((t) => t.looseKey), b.map((t) => t.looseKey)) &&
    multisetEqual(a.map((t) => t.coefficient), b.map((t) => t.coefficient))
  );
}

/** Finds every inline-math span ($...$ or \(...\)) containing a top-level
 * '=' across the given sentences, IN TURN ORDER, and returns each one's
 * RHS term multiset. */
function extractSpokenEqualityMultisets(spokenSentences: string[]): SignedTerm[][] {
  const spanRe = /\$([^$]+)\$|\\\(([\s\S]+?)\\\)/g;
  const out: SignedTerm[][] = [];
  for (const sentence of spokenSentences) {
    spanRe.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = spanRe.exec(sentence)) !== null) {
      const content = m[1] ?? m[2] ?? '';
      const rhs = extractEqualityRHS(content);
      if (!rhs) continue;
      const ts = termMultiset(rhs);
      if (ts.length > 0) out.push(ts);
    }
  }
  return out;
}

function describeTerms(terms: SignedTerm[]): string {
  return terms
    .map((t) => `${t.sign === '-' ? '-' : ''}${t.strictKey}`)
    .join(' + ')
    .replace(/\+ -/g, '- ');
}

export function checkSpokenCardMismatch(
  spokenSentences: string[],
  cardLatex: string,
): SpokenCardMismatchResult {
  const cardRhs = extractEqualityRHS(cardLatex);
  if (!cardRhs) return { mismatch: false };
  const cardTerms = termMultiset(cardRhs);
  if (cardTerms.length === 0) return { mismatch: false };

  const spokenMultisets = extractSpokenEqualityMultisets(spokenSentences);
  // Permutation gate first: only equalities built from the SAME parts as
  // the card even enter consideration — a genuinely different value
  // (different base/coefficient multiset) is ignored outright, not just
  // out-voted by a later equality.
  const qualifying = spokenMultisets.filter(
    (terms) => sameStructure(terms, cardTerms),
  );
  if (qualifying.length === 0) return { mismatch: false };
  // Last-assertion-wins: only the turn's SETTLED final equality among the
  // qualifying ones is judged — an earlier qualifying equality that gets
  // corrected later (self-correction) is superseded, not flagged.
  const finalTerms = qualifying[qualifying.length - 1];
  if (strictSetsEqual(finalTerms, cardTerms)) return { mismatch: false };
  return {
    mismatch: true,
    reason: `spoken RHS "${describeTerms(finalTerms)}" vs card RHS "${describeTerms(cardTerms)}"`,
  };
}
