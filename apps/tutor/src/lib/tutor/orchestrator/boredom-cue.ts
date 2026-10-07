// src/lib/tutor/orchestrator/boredom-cue.ts
/**
 * Boredom / pace cue detection, extracted from VoiceTutorRealtime so it can
 * be tested directly.
 *
 * WHY (production, 2026-10-03): the student said "whatever we're supposed to
 * do next". The old rule was one regex of cue words matched ANYWHERE in the
 * utterance, so the bare word "next" registered as a boredom cue
 * (pacing_cue cue="next"), a boredom hint rode the next turn, and the tutor
 * said aloud "Given that boredom cue, let's not linger".
 *
 * The rule now separates two kinds of entry in that list:
 *
 *  - Phrases that are a cue wherever they occur — "I know this", "too fast",
 *    "slow down", "speed up", "boring", "duh". Unchanged.
 *  - Single COMMON words — "next", "skip", "easy", "obviously", "faster",
 *    "slower" — which are ordinary vocabulary in a maths sentence ("what
 *    comes next", "skip count by fives", "an easy way", "the faster car").
 *    These count only in a REQUEST SHAPE addressed to the tutor:
 *      · the word opens the utterance or a clause (after optional fillers
 *        like "okay," / "um"), in a form that is the request itself
 *        ("next", "next one please", "skip this", "faster please");
 *      · or it follows a request lead ("can we…", "let's…", "please…",
 *        "go to the…", "I want…", "give me…") within a few words;
 *      · or a word-specific form that is unambiguous on its own
 *        ("next one/problem/question", "skip this/it", "this is too easy").
 *    "move on" is NOT a cue (2026-10-04): the old list never had it, and this
 *    rule exists to narrow that list, not widen it — an ordinary "let's move
 *    on" is a student keeping pace, not saying the pace or level is wrong.
 *
 * Generic shapes only — no subject content. Pure; never throws.
 */
import { TUTOR_NEXT_WITH_PROBLEM_NOT_CUE } from './turn-round-flags';

/** The pre-fix rule, verbatim (flag-off behaviour). */
export const LEGACY_BOREDOM_CUE_RE =
  /\b(i\s+know\s+this|obviously|skip(\s+this)?|duh|easy|boring|next|too\s+fast|slow\s+down|slower|faster|speed\s+up)\b/i;

export interface BoredomCueDecision {
  /** The matched cue text (as spoken), or null. */
  cue: string | null;
  /** Common-word candidates that appeared but were NOT in a request shape. */
  ignored: string[];
}

const CANDIDATE_RE =
  /\b(i\s+know\s+this|obviously|skip(?:\s+this)?|duh|easy|boring|next|too\s+fast|slow\s+down|slower|faster|speed\s+up)\b/gi;

const FILLERS_ONLY_RE =
  /^(?:\s|,|(?:ok(?:ay)?|um+|uh+|so|yeah|yes|yep|alright|all\s+right|well|and|hey|please|oh|hmm+|now|then)\b)*$/i;

/** A request addressed to the tutor, ending within a few words of the cue. */
const REQUEST_LEAD_RE =
  /(?:\b(?:can|could|may|shall|should)\s+(?:we|you|i)|\blet'?s|\blet\s+us|\bplease|\bi\s+(?:want|wanna|need)|\bi'?d\s+like|\bgive\s+me|\bgo(?:\s+on)?\s+to|\bmove(?:\s+on)?\s+to|\bon\s*to)\b(?:\s+[\w']+){0,4}\s*$/i;

const NEGATION_RE = /\b(?:not|never)\b|n't\b|n’t\b/i;

/** End of utterance / clause, optionally after "please". */
const TAIL_END = String.raw`\s*(?:please\b)?\s*(?:[.!?,;]|$)`;
const NEXT_TAIL_RE = new RegExp(String.raw`^\s*(?:(?:one|problem|question|topic|part|section|example|thing|up)\b)?` + TAIL_END, 'i');
const NEXT_NOUN_RE = /^\s+(?:one|problem|question)\b/i;
const SKIP_OBJECT_RE = /^\s+(?:it|that|these|those|them|ahead)\b/i;
const BARE_TAIL_RE = new RegExp('^' + TAIL_END, 'i');
const EASY_TAIL_RE = /^\s*(?:[.!?,;]|$|please\b|for\s+me\b|already\b|now\b|though\b|peasy\b)/i;
const INTENSIFIERS = String.raw`(?:(?:way|just|really|very|so|too|pretty|super|kinda|kind\s+of|all|that)\s+)*`;
const EASY_SUBJECT_RE = new RegExp(
  String.raw`(?:\b(?:this|that|it|these|those|they)(?:'s|’s|'re|’re|\s+is|\s+are|\s+was|\s+were)|\b(?:is|are|was|were))\s+` + INTENSIFIERS + '$',
  'i',
);
const INTENSIFIERS_ONLY_RE = new RegExp('^' + INTENSIFIERS + '$', 'i');
const PACE_VERB_RE = /^(?:go|talk|speak|move|teach|explain)\s+(?:(?:a\s+)?(?:bit|little|lot|much|way)\s+)*$/i;

/** Text of the clause before the match (back to the last . ! ? ;). */
function clausePrefix(text: string, index: number): string {
  const before = text.slice(0, index);
  const cut = Math.max(before.lastIndexOf('.'), before.lastIndexOf('!'), before.lastIndexOf('?'), before.lastIndexOf(';'));
  return before.slice(cut + 1);
}

/** Strip leading fillers from a clause prefix ("okay, um, " → ""). */
function stripFillers(prefix: string): string {
  let p = prefix;
  for (let i = 0; i < 8; i++) {
    const next = p.replace(/^[\s,]*(?:ok(?:ay)?|um+|uh+|so|yeah|yes|yep|alright|all\s+right|well|and|hey|please|oh|hmm+|now|then)\b[\s,]*/i, '');
    if (next === p) break;
    p = next;
  }
  return p.replace(/^[\s,]+/, '');
}

/**
 * 2026-10-06c (portal-c301c9ad @222.5 s): "next question: A car accelerates
 * from rest at 2.5 m/s² for 8 seconds. How far…" raised the pace cue, the
 * brain was told to offer "harder / skip / a different topic", offered a
 * switch, and then — rightly, by the out-of-scope rule — refused it. The
 * student was not asking to skip: they were bringing the next problem.
 * "next question / problem / one" followed by problem content — a digit, a
 * relation or operator, or more than six words — is a new problem.
 */
const NEXT_CONTENT_HEAD_RE = /^\s*(?:one|problem|question|exercise|task)\b\s*(?:(?:is|please)\b\s*)?[:\-—–,.]?\s*/i;
const PROBLEM_CONTENT_WORDS = 6;
export function nextIsFollowedByProblem(after: string): boolean {
  const head = NEXT_CONTENT_HEAD_RE.exec(after ?? '');
  if (!head) return false;
  const content = (after ?? '').slice(head[0].length).replace(/^\s*(?:please\b)?[\s,.:]*/i, '').trim();
  if (!content) return false;
  if (/\d/.test(content) || /[=<>≤≥+×÷*/^√∫]/.test(content)) return true;
  return content.split(/\s+/).filter((w) => /[a-z]/i.test(w)).length > PROBLEM_CONTENT_WORDS;
}

function inRequestShape(word: string, prefix: string, after: string, opts?: { newProblemContent?: boolean }): boolean {
  const initial = FILLERS_ONLY_RE.test(prefix);
  const lead = REQUEST_LEAD_RE.test(prefix);
  const w = word.toLowerCase().replace(/\s+/g, ' ');
  if (w === 'next') {
    if ((opts?.newProblemContent ?? TUTOR_NEXT_WITH_PROBLEM_NOT_CUE) && nextIsFollowedByProblem(after)) return false;
    if (NEXT_NOUN_RE.test(after)) return true;
    return (initial || lead) && NEXT_TAIL_RE.test(after);
  }
  if (w === 'skip' || w === 'skip this') {
    if (initial || lead) return true;
    return w === 'skip this' || SKIP_OBJECT_RE.test(after);
  }
  if (w === 'easy') {
    if (NEGATION_RE.test(prefix)) return false;
    if (!EASY_TAIL_RE.test(after)) return false;
    if (initial) return true;
    const core = stripFillers(prefix);
    return INTENSIFIERS_ONLY_RE.test(core) || EASY_SUBJECT_RE.test(prefix);
  }
  if (w === 'obviously') return initial;
  if (w === 'faster' || w === 'slower') {
    if (lead) return true;
    if (!BARE_TAIL_RE.test(after)) return false;
    if (initial) return true;
    return PACE_VERB_RE.test(stripFillers(prefix));
  }
  return true;
}

const COMMON_WORD_RE = /^(?:next|skip(?:\s+this)?|easy|obviously|faster|slower)$/i;

export function detectBoredomCue(
  text: string,
  opts: {
    /** NEXT_PUBLIC_TUTOR_BOREDOM_CUE_REQUEST_SHAPE !== 'off' */ requestShape: boolean;
    /** Unset ⇒ TUTOR_NEXT_WITH_PROBLEM_NOT_CUE. */
    newProblemContent?: boolean;
  },
): BoredomCueDecision {
  const t = typeof text === 'string' ? text : '';
  if (!opts.requestShape) {
    const m = t.match(LEGACY_BOREDOM_CUE_RE);
    return { cue: m ? m[0] : null, ignored: [] };
  }
  const ignored: string[] = [];
  CANDIDATE_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = CANDIDATE_RE.exec(t)) !== null) {
    const word = m[0];
    if (!COMMON_WORD_RE.test(word)) return { cue: word, ignored };
    const prefix = clausePrefix(t, m.index);
    const after = t.slice(m.index + word.length);
    if (inRequestShape(word, prefix, after, opts)) return { cue: word, ignored };
    ignored.push(word.toLowerCase());
  }
  return { cue: null, ignored };
}
