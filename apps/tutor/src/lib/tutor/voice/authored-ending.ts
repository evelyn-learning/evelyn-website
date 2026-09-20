/**
 * Authored-ending contradiction guard (live 2026-09-06, portal-3a024b75).
 * The tutor affirmed "no solution" for an identity whose authored answer is
 * "infinitely many". The judge saw it but the claim carried no math ⇒ not
 * noteworthy ⇒ no note; the segment-truth block does not catch a
 * contradiction of the authored ENDING. Solution-count classification is a
 * closed three-way vocabulary, so it can be checked deterministically with
 * zero subject knowledge: compare the class the tutor asserted with the
 * class the seed authored. Anything ambiguous on either side ⇒ null.
 */
import { isExplanatoryMention } from './denied-answer-reversal';

export type SolutionClass = 'none' | 'one' | 'infinite';

const NONE_RE = /\bno\s+solutions?\b|\bempty\s+set\b|\bnever\s+true\b|\bfalse\s+statement\b|\bcontradiction\b/i;
const INFINITE_RE = /\binfinite(?:ly\s+many)?\s+solutions?\b|\binfinitely\s+many\b|\bidentity\b|\ball\s+real\s+numbers\b|\bevery\s+(?:value|number|real)\b|\balways\s+true\b/i;
const ONE_RE = /\b(?:exactly\s+|just\s+|only\s+)?one\s+solution\b|\bunique\s+solution\b|\bsingle\s+solution\b/i;

export function classifySolutionCount(text: string): SolutionClass | null {
  const t = (text ?? '');
  const hits: SolutionClass[] = [];
  if (NONE_RE.test(t)) hits.push('none');
  if (INFINITE_RE.test(t)) hits.push('infinite');
  if (ONE_RE.test(t)) hits.push('one');
  return hits.length === 1 ? hits[0] : null;
}

/**
 * The class phrase must be PRESENTED as this problem's verdict — the cue
 * must sit immediately before the phrase (at most one article/determiner
 * between them), not merely anywhere in a flat lookback window. The earlier
 * flat-window version false-killed correct teaching turns where the cue and
 * the phrase were in the same sentence but different clauses: "Right,
 * remember that an identity always has infinitely many solutions" put
 * "right" and "infinitely many solutions" in the same 80-char window with
 * no verdict relationship between them (2026-09-07 review).
 */
// `norm()` strips apostrophes ("there's" → "theres"), so every contraction
// cue must tolerate the stripped form too, not just the literal apostrophe.
const VERDICT_CUE_SRC = String.raw`so|therefore|thus|that\s+means|which\s+means|meaning|there(?:'?s|\s+is|\s+are)|it\s+has|we\s+have|this\s+has|the\s+answer\s+is|it'?s|that'?s|gives|leaves\s+us\s+with|right|exactly|correct|yes|nailed\s+it`;
// 2026-09-07 (fix round 2): the alternation needs its OWN leading \b — a
// bare `(?:${SRC})$`-style match let a short cue match as the SUFFIX of an
// unrelated word ("Also" ends in "so", "espresso" ends in "so", "eyes" ends
// in "yes"), firing false contradictions with no real cue present.
const VERDICT_CUE_ADJACENT_RE = new RegExp(`(?:^|\\b)(?:${VERDICT_CUE_SRC})\\s+(?:the\\s+|a\\s+|an\\s+|this\\s+|that\\s+|just\\s+)?$`, 'i');

const norm = (s: string) => (s ?? '').toLowerCase().replace(/[*_`"'’‘“”]/g, '').replace(/[—–]/g, ' - ').replace(/\s+/g, ' ').trim();

function classPhrase(sentence: string, cls: SolutionClass): string | null {
  const re = cls === 'none' ? NONE_RE : cls === 'infinite' ? INFINITE_RE : ONE_RE;
  const m = re.exec(sentence);
  return m ? m[0] : null;
}

/** The same-clause text immediately before `idx` — clause boundaries are the
 *  last '. ', '; ', ': ' or ' - ' (the em/en dash forms `norm` already
 *  rewrote to ' - ') before that index. */
function clauseBefore(s: string, idx: number): string {
  const before = s.slice(0, idx);
  const clauseStart = Math.max(before.lastIndexOf('. '), before.lastIndexOf('; '), before.lastIndexOf(': '), before.lastIndexOf(' - '));
  return before.slice(clauseStart + 1);
}

export function findAuthoredEndingContradiction(args: { sentence: string; authoredAnswer: string | undefined }): { stated: SolutionClass; authored: SolutionClass } | null {
  const authored = args.authoredAnswer ? classifySolutionCount(args.authoredAnswer) : null;
  if (!authored) return null;
  const s = norm(args.sentence);
  if (!s || /\?\s*$/.test(s)) return null;
  const stated = classifySolutionCount(s);
  if (!stated || stated === authored) return null;
  const phrase = classPhrase(s, stated);
  if (!phrase) return null;
  if (isExplanatoryMention(s, norm(phrase))) return null;
  const idx = s.indexOf(phrase);
  const clause = clauseBefore(s, idx);
  if (!VERDICT_CUE_ADJACENT_RE.test(clause)) return null;
  return { stated, authored };
}

const stripMath = (s: string) => (s ?? '').toLowerCase().replace(/\\[a-z]+/g, ' ').replace(/[${}]/g, '').replace(/[^0-9a-z=+\-*/()^.]/g, '');

/** Is the tracked board problem the authored one (so the authored answer applies)? */
export function problemMatchesAuthored(statement: string | undefined, problemText: string | undefined): boolean {
  const a = stripMath(statement ?? ''); const b = stripMath(problemText ?? '');
  if (a.length < 6 || b.length < 6) return false;
  return a.includes(b) || b.includes(a) || (a.length >= 12 && b.includes(a.slice(0, 12))) || (b.length >= 12 && a.includes(b.slice(0, 12)));
}
