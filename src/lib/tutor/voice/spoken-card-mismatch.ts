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
 * Mechanism: extract the card latex's top-level equality RHS and split it
 * into a signed-term multiset (+/- at brace-depth 0). Do the same for
 * every inline-math equality found in the turn's spoken sentences. A
 * transposition error like the incident above shares NO term if terms are
 * compared whole ("2\cos t" vs "2\sin t" vs "2t\cos t" vs "2t\sin t" are
 * four distinct strings) — so the "is this even about the same
 * expression" signal is computed at a LOOSER grain: each term's function/
 * variable core with its leading numeric-ish coefficient stripped ("2\cos
 * t" and "2t\cos t" both key to "\cos t"). Two RHS's are flagged when they
 * share >=1 LOOSE term (same functions/variables in play — the false-
 * positive guard: genuinely unrelated equations share none) but their
 * STRICT signed multisets (coefficient + sign included) differ. Identical
 * RHS's (up to term order) match strictly and pass; a coefficient swap or
 * sign flip matches loosely but differs strictly and is flagged.
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
  /** Body with a short leading numeric (optionally +1 trailing letter)
   * coefficient stripped — used only for the LOOSE "same expression"
   * overlap gate. Falls back to strictKey when stripping would empty it
   * (e.g. a bare numeric term), so two different plain constants never
   * collide via an empty key. */
  looseKey: string;
}

function parseSignedTerm(raw: string): SignedTerm {
  const trimmed = raw.trim();
  let sign: '+' | '-' = '+';
  let body = trimmed;
  if (body.startsWith('+')) body = body.slice(1);
  else if (body.startsWith('-')) { sign = '-'; body = body.slice(1); }
  const strictKey = normalizeMathText(body);
  const stripped = strictKey.replace(/^\d+[a-zA-Z]?/, '');
  const looseKey = stripped.length > 0 ? stripped : strictKey;
  return { sign, strictKey, looseKey };
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

/** Multiset equality (order-independent) on the STRICT (sign+coefficient
 * included) key. */
function strictSetsEqual(a: SignedTerm[], b: SignedTerm[]): boolean {
  if (a.length !== b.length) return false;
  const bKeys = b.map((t) => `${t.sign}${t.strictKey}`);
  const used = new Array(bKeys.length).fill(false);
  outer: for (const t of a) {
    const key = `${t.sign}${t.strictKey}`;
    for (let i = 0; i < bKeys.length; i++) {
      if (!used[i] && bKeys[i] === key) { used[i] = true; continue outer; }
    }
    return false;
  }
  return true;
}

/** True when any term's LOOSE key appears in the other side's LOOSE-key
 * set — the "these two RHS's are about the same expression" gate. */
function shareLooseTerm(a: SignedTerm[], b: SignedTerm[]): boolean {
  const bLoose = new Set(b.map((t) => t.looseKey));
  return a.some((t) => bLoose.has(t.looseKey));
}

/** Finds every inline-math span ($...$ or \(...\)) containing a top-level
 * '=' across the given sentences and returns each one's RHS term
 * multiset. */
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

export function checkSpokenCardMismatch(
  spokenSentences: string[],
  cardLatex: string,
): SpokenCardMismatchResult {
  const cardRhs = extractEqualityRHS(cardLatex);
  if (!cardRhs) return { mismatch: false };
  const cardTerms = termMultiset(cardRhs);
  if (cardTerms.length === 0) return { mismatch: false };

  const spokenMultisets = extractSpokenEqualityMultisets(spokenSentences);
  for (const spokenTerms of spokenMultisets) {
    if (spokenTerms.length === 0) continue;
    if (!shareLooseTerm(spokenTerms, cardTerms)) continue; // unrelated equation — ignore
    if (strictSetsEqual(spokenTerms, cardTerms)) continue; // identical (up to reorder) — ignore
    const spokenStr = spokenTerms.map((t) => `${t.sign === '-' ? '-' : ''}${t.strictKey}`).join(' + ').replace(/\+ -/g, '- ');
    const cardStr = cardTerms.map((t) => `${t.sign === '-' ? '-' : ''}${t.strictKey}`).join(' + ').replace(/\+ -/g, '- ');
    return {
      mismatch: true,
      reason: `spoken RHS "${spokenStr}" vs card RHS "${cardStr}"`,
    };
  }
  return { mismatch: false };
}
