/**
 * Session-scoped validation helpers for the voice tutor.
 *
 * - declared function tracking (catches silent f→g renames)
 * - pure-greeting detection (stops spurious whiteboard emits on "hi")
 * - rejection-pattern detection (triggers student-answer re-verification)
 * - math-claim extraction from spoken transcript (voice↔whiteboard consistency)
 */

export interface DeclaredFunction {
  name: string;          // "f", "g", "h", "y", etc.
  argVar: string;        // "x", "t", ...
  body: string;          // RHS latex, e.g. "x^4 - 4x^3 + 6x^2 - 4x + 1"
  declaredAt: number;    // turn counter / timestamp
}

// Matches "f(x) = <rhs>", "y = <rhs>", "g'(x) = <rhs>" on left side of equation.
// Captures: 1=name, 2=argVar (optional), 3=primes (optional), 4=rhs
// R34 (session-1784833891496): ANCHORED to the start of the latex. The old
// unanchored pattern matched a mid-latex SOLUTION step — "… \Rightarrow
// x = \pm 2" — and "declared" the function x; the rename pass then
// "corrected" the brain's proper f''(x) to the nonsense x''(x) on the board.
// A declaration is the card's opening statement, never an interior step.
// R34 also fixed: primes may sit BEFORE the parens ("f'(x) = …", the usual
// derivative form) — the old ordering (parens then primes) never matched it.
const DECL_PATTERN = /^\s*([a-zA-Z])\s*('+)?\s*(?:\(\s*([a-zA-Z])\s*\))?\s*('+)?\s*=\s*(.+?)(?:$|\\\\|\n)/;

export function extractDeclarations(latex: string): DeclaredFunction[] {
  if (!latex) return [];
  const out: DeclaredFunction[] = [];
  // Split on "=" to support chained forms like "f(x) = ... = ..."
  const cleaned = latex.replace(/\\left|\\right/g, '');
  const m = cleaned.match(DECL_PATTERN);
  if (m) {
    const name = m[1];
    const argVar = m[3] || 'x';
    const primes = m[2] || m[4] || '';
    const body = m[5].trim();
    // R42 (session portal-cb2addf5, 2026-08-10): a `\text{...}` RHS is a
    // caption/metaphor label ("h(t) = \text{height of the drone at time
    // t}"), not a real function declaration. Registering it locked in a
    // spurious canonical base — every genuinely-new function the tutor
    // introduced afterward (g, k, ...) got silently renamed to it via
    // normalizeRenamedFunction's single-declared-base rewrite.
    const isTextLabel = /^\\text\s*\{/.test(body);
    // Only treat single-letter left-side as a declaration (skip "sin(x)=...", "P = ...").
    // R34: a paren-less "x = …" is a variable being SOLVED, not a function
    // declaration — x is the independent variable by convention. ("y = …"
    // stays a legitimate declaration.)
    if (!isTextLabel && /^[a-zA-Z]$/.test(name) && !['e', 'i', 'd'].includes(name) && !(name === 'x' && !m[3])) {
      out.push({ name: primes ? `${name}${primes}` : name, argVar, body, declaredAt: Date.now() });
    }
  }
  return out;
}

/**
 * Extract the integrand and variable from an integral-form latex string.
 * Supports both `\int_a^b <body> d<var>` and `Integral_a^b <body> d<var>` forms.
 * Returns a DeclaredFunction pseudo-entry named "I" (for integrand) so downstream
 * context-aware checks can locate the source expression the tutor is integrating.
 */
export function extractIntegrand(latex: string, label?: string): DeclaredFunction | null {
  if (!latex) return null;
  const labelStr = label || '';
  // Heuristic: only try this when the label or latex suggests an integral.
  if (!/\b(int|integral)\b/i.test(labelStr) && !/\\int|Integral_/.test(latex)) return null;

  // Normalize \int forms to a common Integral_a^b form for parsing.
  const s = latex
    .replace(/\\int\s*_\{?([^}\s^]+)\}?\s*\^\s*\{?([^}\s]+)\}?/g, 'Integral_$1^$2')
    .replace(/\\int/g, 'Integral')
    .replace(/\\,/g, ' ');

  // Match Integral_<lo>^<hi> <body> d<var>   OR   Integral <body> d<var>
  const re = /Integral(?:_([^\s^]+)\^(\S+))?\s+([^=]+?)\s*d([a-zA-Z])\b/;
  const m = s.match(re);
  if (!m) return null;
  const body = m[3].trim();
  const argVar = m[4];
  if (!body || body.length > 200) return null;

  return {
    name: 'I', // pseudo-name for "integrand"
    argVar,
    body,
    declaredAt: Date.now(),
  };
}

/**
 * When the tutor silently renames a declared function (e.g. original was f(x),
 * tutor now writes g(x) or g'(x) without redeclaring), rewrite the name back
 * to the declared base letter so the whiteboard stays consistent.
 *
 * Strategy: collect every "X[primes](var)" usage in the incoming latex. If a
 * used letter's base doesn't match any declared base AND there is exactly one
 * declared base letter in the session, swap the letter — preserving primes so
 * "g'(x)" becomes "f'(x)" when only f was ever declared.
 */
export function normalizeRenamedFunction(
  latex: string,
  declared: DeclaredFunction[],
): { latex: string; changed: boolean; oldName?: string; newName?: string } {
  if (!latex || declared.length === 0) return { latex, changed: false };

  // Unique base letters already declared. Drop the integrand
  // pseudonym "I" — extractIntegrand uses that name as an internal
  // tag to feed integrand-context checks (it's never a real
  // student-visible function name). If we let it through here, the
  // whole rename pass treats every F / G / f / g the brain authors
  // as a "renamed" version of I and rewrites them, turning a
  // FTC-Part-1 board "G'(x) = x² + 5" into nonsense "I'(x) = x² + 5".
  // Observed 2026-05-04 AP Calc AB session.
  const declaredBases = Array.from(new Set(
    declared
      .filter(d => d.name.replace(/'+/g, '') !== 'I')
      .map(d => d.name.replace(/'+/g, ''))
  ));
  if (declaredBases.length !== 1) {
    // If the session has multiple function names (f and g both declared
    // deliberately), we can't safely disambiguate. Skip normalization.
    // Also covers: only declarations are integrand pseudonyms → nothing
    // legitimate to normalize against.
    return { latex, changed: false };
  }
  const canonicalBase = declaredBases[0];

  // Find names present in the incoming latex. Looking for "X[primes](var)" patterns.
  type Use = { full: string; base: string; primes: string; arg: string };
  const uses: Use[] = [];
  const usedPattern = /\b([a-zA-Z])('*)\s*\(\s*([a-zA-Z])\s*\)/g;
  const reserved = new Set(['sin', 'cos', 'tan', 'log', 'ln', 'exp', 'e', 'i', 'd']);
  let m: RegExpExecArray | null;
  while ((m = usedPattern.exec(latex)) !== null) {
    const base = m[1];
    const primes = m[2] || '';
    if (reserved.has(base)) continue;
    uses.push({ full: base + primes, base, primes, arg: m[3] });
  }

  let out = latex;
  let changed = false;
  let oldName: string | undefined;
  let newName: string | undefined;

  for (const u of uses) {
    if (u.base === canonicalBase) continue; // already the declared name
    // R34 defense-in-depth: never rewrite a function name INTO its own
    // argument — "f''(x)" with canonical base "x" would become the
    // self-application "x''(x)", which is always nonsense. Whatever state
    // led here, leaving the brain's name is strictly safer.
    if (canonicalBase === u.arg) continue;
    const target = canonicalBase + u.primes;
    // Escape primes for regex construction.
    const esc = u.full.replace(/'/g, "'");
    // Build a regex that matches the full usage "base[primes](" without
    // spilling into the interior of longer identifiers. JS regex doesn't
    // have lookbehind in older targets, so build a conservative pattern.
    const re = new RegExp(`(^|[^a-zA-Z])${esc}\\s*\\(`, 'g');
    const next = out.replace(re, (_match, lead) => `${lead}${target}(`);
    if (next !== out) {
      out = next;
      changed = true;
      oldName = u.full;
      newName = target;
    }
  }
  return { latex: out, changed, oldName, newName };
}

// ------------------------------------------------------------------
// Pure greeting detection
// ------------------------------------------------------------------
/**
 * R42 (session portal-cb2addf5, 2026-08-10): pre-normalization declaration
 * harvest — closes a self-reinforcing lock-in in the VoiceTutorRealtime
 * call site. The rename pass (normalizeRenamedFunction) and declaration
 * harvest used to run in the WRONG order: harvest read the latex AFTER the
 * rename pass had already rewritten it, so a genuinely new declaration like
 * "g(x) = x^2 e^{3x}" got silently renamed to the session's sole existing
 * base ("h") before g ever had a chance to register. Every later function
 * (k, R, P, s, ...) then collapsed into the same wrong name — 24 renames in
 * one session, all rewriting to h.
 *
 * Fix: the CALLER (VoiceTutorRealtime) must harvest a card's declarations
 * from its latex BEFORE calling normalizeRenamedFunction on that same
 * latex — this function does exactly that merge. Only UNPRIMED
 * declarations are eligible: an unprimed "NAME(x) = …" is read as
 * introducing a fresh base function by definition, and merging it in
 * before the rename check runs naturally trips normalizeRenamedFunction's
 * existing `declaredBases.length !== 1` escape hatch (multi-base sessions
 * skip renaming), which is how the new base survives unrenamed — no
 * separate "is this a declaration" special-case is needed inside
 * normalizeRenamedFunction itself.
 *
 * A PRIMED form ("g'(x) = 2x") is deliberately EXCLUDED from this harvest.
 * That shape is far more likely to be a derivative reference to an
 * EXISTING function under a drifted name than an intentional new
 * declaration — it's exactly the round-34 "silent rename" case
 * normalizeRenamedFunction exists to correct (see test-continuity.ts
 * "legit drift g'→f' still normalized"). Harvesting it here would disable
 * that correction by making every primed drift look like a fresh base.
 */
export function harvestPreNormalizationDeclarations(
  latex: string,
  declared: DeclaredFunction[],
): DeclaredFunction[] {
  const decls = extractDeclarations(latex);
  if (decls.length === 0) return declared;
  let next = declared;
  for (const d of decls) {
    if (d.name.includes("'")) continue; // primed — leave to drift-correction
    const idx = next.findIndex(x => x.name === d.name);
    if (next === declared) next = [...declared];
    if (idx >= 0) next[idx] = d;
    else next.push(d);
  }
  return next;
}

const GREETING_TOKENS = [
  'hi', 'hello', 'hey', 'yo', 'hiya', 'howdy',
  'good morning', 'good afternoon', 'good evening',
  'morning', 'afternoon', 'evening',
  "what's up", 'whats up', 'sup', 'how are you', 'how are u',
  'namaste', 'salaam', 'salam', 'bonjour', 'hola', 'ciao', 'guten tag',
  'ok', 'okay', 'yeah', 'yep', 'yes', 'sure',
];

// Strong signals the student actually wants a problem / instruction / content.
const CONTENT_SIGNALS = /\b(problem|quiz|practice|question|test|example|explain|show|help|solve|derivative|integral|equation|graph|how|what|why|teach|learn|work|find|calculate|prove|simplify|give\s+me|try\s+me|throw)\b/i;

export function isPureGreeting(text: string): boolean {
  if (!text) return true;
  const t = text.trim().toLowerCase().replace(/[.!?,;:]+$/g, '');
  if (!t) return true;
  // If it contains content signals, it's not a pure greeting.
  if (CONTENT_SIGNALS.test(t)) return false;
  // Exact match
  if (GREETING_TOKENS.includes(t)) return true;
  // Starts with a greeting and is ≤ 6 words total
  const words = t.split(/\s+/);
  if (words.length > 6) return false;
  if (GREETING_TOKENS.some(g => t === g || t.startsWith(g + ' ') || t.endsWith(' ' + g))) {
    return true;
  }
  return false;
}

/**
 * Whether the opening-turn greeting guard applies: on a freestyle session's
 * first turn(s), a pure greeting must not trigger unsolicited problem cards
 * or board equations. Sessions that arrive WITH an agenda are exempt: an
 * authored lesson plan, or a mock-review context (the tutor is REQUIRED to
 * present the student's missed exam item unprompted — the 2026-07-21
 * live-gate bug was this guard dropping that card into a retry/kill loop).
 */
export function computeGreetingGuard(input: {
  lessonPlanActive: boolean;
  priorStudentTurns: number;
  lastStudentText: string;
  mockReviewActive: boolean;
}): boolean {
  return (
    !input.lessonPlanActive &&
    !input.mockReviewActive &&
    input.priorStudentTurns <= 1 &&
    isPureGreeting(input.lastStudentText)
  );
}

// ------------------------------------------------------------------
// Final-answer claim detection.
// When the tutor says "the final answer is X", "your full solution is X",
// "that gives us X", etc., we want to cross-check X with Wolfram against
// the problem statement.
// ------------------------------------------------------------------

const FINAL_ANSWER_PATTERNS = [
  /\b(?:the\s+)?(?:final\s+answer|full\s+solution|answer)\s+(?:is|equals|comes out to|simplifies to)\s+([^.!?]+)/i,
  /\bthat(?:'s| is)\s+your\s+(?:full\s+)?(?:solution|answer)[,.:\s]*([^.!?]*)/i,
  /\bso\s+(?:we get|the answer is|you get)\s+([^.!?]+)/i,
  /\bwhich\s+(?:gives|equals)\s+([^.!?]+)/i,
];

export function extractFinalAnswerClaim(tutorText: string): string | null {
  if (!tutorText) return null;
  for (const p of FINAL_ANSWER_PATTERNS) {
    const m = tutorText.match(p);
    if (m && m[1]) {
      const claim = m[1].trim();
      // Must contain something that looks like math (digit, x, e, pi, ln, etc.)
      if (/[\d]|[a-zA-Z]{1,3}|\bpi\b|\be\b/.test(claim) && claim.length > 1) {
        return claim;
      }
    }
  }
  return null;
}

// ------------------------------------------------------------------
// Walk-through request detection.
// The tutor should default to Socratic. Only switch to walk-through after
// the student has insisted 2+ times in the same problem context.
// ------------------------------------------------------------------

const WALK_THROUGH_PATTERNS = [
  /\bwalk\s+me\s+through\b/i,
  /\bshow\s+me\s+how\b/i,
  /\bjust\s+(?:show|tell|explain|do)\b/i,
  /\byou\s+do\s+it\b/i,
  /\bstep[-\s]?by[-\s]?step\b/i,
  /\bexplain\s+(?:it|this|the)\b/i,
  /\b(?:don'?t|do\s*not)\s+(?:quiz|ask)\b/i,
  /\bi\s+(?:already\s+)?said\s+(?:show|walk|tell|explain)\b/i,
  /\bi\s+don'?t\s+want\s+to\s+(?:try|answer)\b/i,
];

export function isWalkThroughRequest(text: string): boolean {
  if (!text) return false;
  return WALK_THROUGH_PATTERNS.some(p => p.test(text));
}

// ------------------------------------------------------------------
// Try-alone request detection (round 29 — live AP Stats session: student
// said she wanted to work through examples "on my own instead of you
// guiding me", tutor kept explaining every step). The opposite direction
// of walk-through: the student asking for LESS help. One ask is enough —
// autonomy never needs insistence.
// ------------------------------------------------------------------

const TRY_ALONE_PATTERNS = [
  /\b(?:on|by)\s+my\s+own\b/i,
  /\b(?:don'?t|do\s*not|stop)\s+(?:guid|help|hint|tell)/i,
  /\blet\s+me\s+(?:try|work|solve|figure|do)\b/i,
  /\bi\s+(?:want|wanna|would\s+like)\s+to\s+(?:try|solve|work|figure|do)\s+(?:it|this|that|them|these)?\s*(?:out\s+)?(?:my|alone)/i,
  /\bwithout\s+(?:your\s+)?(?:help|hints?|guidance)\b/i,
  /\bi'?ll\s+(?:try|do|work|figure)\s+(?:it|this|that)\s+(?:out\s+)?myself\b/i,
];

export function isTryAloneRequest(text: string): boolean {
  if (!text) return false;
  return TRY_ALONE_PATTERNS.some(p => p.test(text));
}

// "Give me a problem" signals — resets the walk-through counter for a new problem.
// Allow any number of adjective/topic words between the article and "problem",
// e.g. "give me a tough fractions problem" or "give me another easy algebra question".
const NEW_PROBLEM_PATTERNS = [
  /\b(?:give|throw|toss)\s+me\s+(?:a|an|another|one|the\s+next)\b[\s\w'-]{0,60}?\b(?:problem|question|one|example)\b/i,
  /\b(?:new|next|another)\s+(?:problem|question|one|example)\b/i,
  /\bquiz\s+me\b/i,
  /\b(?:i\s+want\s+)?to\s+practice\b/i,
  /\btest\s+me\b/i,
];

export function isNewProblemRequest(text: string): boolean {
  if (!text) return false;
  return NEW_PROBLEM_PATTERNS.some(p => p.test(text));
}

// Does the latex look like a computed answer rather than a problem setup?
// Heuristic: RHS contains ONLY numbers / fractions / simple constants → looks like a result.
// A computed answer has a resolved RHS (e.g., "= 17/12" or "= 0.5") rather than
// an unresolved expression ("= (2/3) + (3/4)" which has two fractions still).
export function looksLikeComputedAnswer(latex: string): boolean {
  if (!latex || !latex.includes('=')) return false;
  const parts = latex.split('=').map(p => p.trim());
  const rhs = parts[parts.length - 1];
  if (!rhs) return false;
  // Remove LaTeX commands and whitespace
  const clean = rhs.replace(/\\[a-zA-Z]+/g, '').replace(/[{}]/g, '').replace(/\s+/g, '');
  // Simple result: single fraction, integer, decimal, or negative-of-these
  if (/^-?\(?\d+\)?\/\(?\d+\)?$/.test(clean)) return true;         // "17/12" or "(17)/(12)"
  if (/^-?\d+(?:\.\d+)?$/.test(clean)) return true;                // "42" / "0.5"
  if (/^-?\d+\s*\/\s*\d+$/.test(clean)) return true;               // "1 / 2"
  // Or a chain that ends with a simple fraction/number (e.g., "... = 17/12")
  if (parts.length >= 3) {
    // At least two equalities → at least some computation took place
    const last = clean;
    if (/^-?\(?\d+\)?\/\(?\d+\)?$/.test(last) || /^-?\d+(?:\.\d+)?$/.test(last)) return true;
  }
  return false;
}

// ------------------------------------------------------------------
// Tutor-rejection pattern detection
// ------------------------------------------------------------------

const REJECTION_PATTERNS = [
  /\b(not (?:quite|exactly|right|correct)|close(?:,|\s+but)|almost(?:,|\s+but)|actually(?:,|\s+the)|the (?:correct|right) answer is|let me correct)\b/i,
  /\bthat'?s not (?:it|right|correct|quite right)\b/i,
  /\byou'?re (?:close|almost there)\b/i,
  /\bwell,?\s+not (?:quite|exactly)\b/i,
];

export function isRejection(tutorText: string): boolean {
  if (!tutorText) return false;
  return REJECTION_PATTERNS.some(p => p.test(tutorText));
}

// ------------------------------------------------------------------
// Math-claim extraction from spoken transcript.
// Grabs equation-like substrings the tutor voiced ("the derivative is 4x³-12x²").
// ------------------------------------------------------------------

const CLAIM_PATTERNS = [
  // "the derivative is <expr>" / "the integral is <expr>" / "equals <expr>"
  /\b(?:the\s+)?(?:derivative|integral|answer|result|value)\s+(?:is|equals)\s+([^.,;!?]+)/i,
  // "equals <expr>" standalone
  /\bequals\s+([^.,;!?]+)/i,
];

export function extractMathClaims(tutorText: string): string[] {
  if (!tutorText) return [];
  const claims: string[] = [];
  for (const p of CLAIM_PATTERNS) {
    const m = tutorText.match(p);
    if (m && m[1]) {
      const claim = m[1].trim();
      // Only keep if it contains math symbols/digits
      if (/[\d+\-*/=^xyzt]/.test(claim)) claims.push(claim);
    }
  }
  return claims;
}

/**
 * Normalize a student utterance for loose equality comparison. Strips
 * punctuation, lowercases, collapses whitespace, and uses phonetic-esque
 * simplification so "yepp!" / "Yes" / "yeah" all compare equal.
 *
 * This is intentionally aggressive — use only for affirmation / short-answer
 * checks, not for preserving meaning.
 */
export function normalizeAnswer(text: string): string {
  if (!text) return '';
  let s = text.toLowerCase().trim();
  // Strip punctuation and most emoji
  s = s.replace(/[.!?,;:"'`()[\]{}]/g, '');
  // Collapse doubled final letters ("yepp" → "yep", "okkk" → "ok")
  s = s.replace(/([a-z])\1{2,}/g, '$1');
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

/**
 * Map of canonical equivalence classes for common student reply types.
 * Any utterance that normalizes into a class member counts as that class.
 */
const ANSWER_CLASSES: Record<string, string[]> = {
  affirm: ['yes', 'yeah', 'yep', 'yup', 'ya', 'yea', 'sure', 'ok', 'okay', 'okey', 'k', 'mhm', 'mmhm', 'uhhuh', 'aye', 'correct', 'right', 'true'],
  deny: ['no', 'nope', 'nah', 'nay', 'false', 'incorrect', 'wrong'],
  unsure: ['idk', 'i dont know', 'i do not know', 'not sure', 'no idea', 'unsure', 'dunno', 'maybe', 'perhaps'],
  ready: ['ready', 'ready to go', 'lets go', 'lets do it', 'bring it', 'im ready', 'go', 'continue', 'next'],
};

/**
 * Classify a student utterance into one of the canonical answer classes,
 * or return null if it doesn't match. Used so downstream logic can treat
 * "yepp", "yeah!", "yes" as the same thing without maintaining regexes
 * everywhere.
 */
export function classifyAnswer(text: string): 'affirm' | 'deny' | 'unsure' | 'ready' | null {
  const norm = normalizeAnswer(text);
  if (!norm) return null;
  // Also try a trailing-double-letter trim: "yepp" → "yep", "okk" → "ok".
  // Applied only at end-of-word to avoid mangling valid words like "apple".
  const trimmed = norm.replace(/([a-z])\1+\b/g, '$1');
  for (const [cls, tokens] of Object.entries(ANSWER_CLASSES)) {
    if (tokens.includes(norm) || tokens.includes(trimmed)) {
      return cls as 'affirm' | 'deny' | 'unsure' | 'ready';
    }
  }
  return null;
}

/**
 * Normalize a spoken math phrase ("four x cubed minus twelve x squared")
 * into a rough latex-ish string for coarse comparison.
 * This is intentionally lossy — it's only used for "same-or-different"
 * verification against the whiteboard, never for rendering.
 */
export function spokenToRoughLatex(spoken: string): string {
  let s = spoken.toLowerCase();
  const words: Record<string, string> = {
    zero: '0', one: '1', two: '2', three: '3', four: '4', five: '5',
    six: '6', seven: '7', eight: '8', nine: '9', ten: '10',
    eleven: '11', twelve: '12', thirteen: '13', fourteen: '14', fifteen: '15',
    sixteen: '16', seventeen: '17', eighteen: '18', nineteen: '19', twenty: '20',
    plus: '+', minus: '-', times: '*', divided: '/',
    squared: '^2', cubed: '^3',
    'to the power of': '^', 'to the': '^',
  };
  // Replace longer phrases first
  for (const [k, v] of Object.entries(words).sort((a, b) => b[0].length - a[0].length)) {
    s = s.replace(new RegExp(`\\b${k}\\b`, 'g'), v);
  }
  // Collapse whitespace, remove filler
  s = s.replace(/\b(the|a|an|and|of|is|equals|to)\b/g, '');
  s = s.replace(/\s+/g, '');
  return s;
}
