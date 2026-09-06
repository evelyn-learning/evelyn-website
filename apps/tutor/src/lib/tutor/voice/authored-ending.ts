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

/** The class phrase must be PRESENTED as this problem's verdict. */
const VERDICT_CUE_RE = /\b(?:so|therefore|thus|that\s+means|which\s+means|meaning|there(?:'s|\s+is|\s+are)|it\s+has|we\s+have|this\s+has|the\s+answer\s+is|it'?s|that'?s|gives|leaves\s+us\s+with|right|exactly|correct|yes|nailed\s+it)\b/i;

const norm = (s: string) => (s ?? '').toLowerCase().replace(/[*_`"'’‘“”]/g, '').replace(/[—–]/g, ' - ').replace(/\s+/g, ' ').trim();

function classPhrase(sentence: string, cls: SolutionClass): string | null {
  const re = cls === 'none' ? NONE_RE : cls === 'infinite' ? INFINITE_RE : ONE_RE;
  const m = re.exec(sentence);
  return m ? m[0] : null;
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
  const idx = s.indexOf(norm(phrase));
  const clause = s.slice(Math.max(0, idx - 80), idx);
  if (!VERDICT_CUE_RE.test(clause)) return null;
  return { stated, authored };
}

const stripMath = (s: string) => (s ?? '').toLowerCase().replace(/\\[a-z]+/g, ' ').replace(/[${}]/g, '').replace(/[^0-9a-z=+\-*/()^.]/g, '');

/** Is the tracked board problem the authored one (so the authored answer applies)? */
export function problemMatchesAuthored(statement: string | undefined, problemText: string | undefined): boolean {
  const a = stripMath(statement ?? ''); const b = stripMath(problemText ?? '');
  if (a.length < 6 || b.length < 6) return false;
  return a.includes(b) || b.includes(a) || (a.length >= 12 && b.includes(a.slice(0, 12))) || (b.length >= 12 && a.includes(b.slice(0, 12)));
}
