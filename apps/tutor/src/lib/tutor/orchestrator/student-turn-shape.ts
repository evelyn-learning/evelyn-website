/**
 * The SHAPE of a student turn: a question, a self-report of difficulty, or
 * something that can be an answer.
 *
 * 2026-10-04 (live, student gac-test-001). `pacing_streak correct=2` and
 * `correct=3` were credited on the student's own questions — "how to solve:
 * x>5 or x<3", "how do you pronounce this problem…" — because the digits in
 * them made each a "verification turn" and the tutor's reply opened "Good
 * question". In another session "i do not know fractions operations well"
 * (answered "Good to know, thank you for telling me.") was credited
 * `correct=1` and marked the segment demonstrated. The true streak at that
 * point was 1 correct and 4 wrong.
 *
 * A question or a self-report is never an answer, so it must credit neither
 * correct nor incorrect, whatever the tutor says back.
 *
 * The one thing this must not swallow is an answer PROPOSED in question form
 * ("is it 4?", "does 6 work?", "solid?") — the judge and the ledger already
 * treat those as answers.
 *
 * Review of the first cut (same day): a self-report or wh-word LEAD followed
 * by a proposed value was still classed by its lead and the answer ignored —
 * "I don't know, 5?", "I'm not sure but 5", "what, 5?", "which one? the
 * second one", "how many? 4". A lead whose TAIL proposes a value is an
 * answer. The tail must be unmistakable — the utterance ENDS on one value (a
 * number, a number word, a signed number, an ordinal / choice) set off by a
 * comma, "?", "but", "maybe"… — because numbers appear in real questions and
 * self-reports all the time: "I am not good at 2 digit multiplication", "I
 * do not understand the second step", "how to solve: x>5 or x<3", "which is
 * bigger, 5 or 6?" all stay what they are.
 *
 * Pure; never throws.
 */

const WH_LEAD_RE = /^(?:how|what|why|when|where|which|who|whose)\b/i;
const AUX_LEAD_RE = /^(?:can|could|do|does|did|is|are|was|were|should|would|will|shall|may|might)\b/i;
/** Auxiliary + a person: a request or a question about procedure ("can you…",
 *  "do I…", "should we…"), never a proposed value. */
const AUX_PERSON_RE = /^(?:can|could|do|does|did|is|are|was|were|should|would|will|shall|may|might)\s+(?:you|i|we|u|they|he|she|someone|anyone)\b/i;
/** "is it …", "would that be …", "is the answer …" — the frame of a proposed
 *  answer. */
const AUX_ANSWER_FRAME_RE = /^(?:is|was|would|could|can|will|might|should)\s+(?:it|that|this|the\s+answer|the\s+solution)\b/i;
/** "what about 6", "how about 2?" — a proposal, not a question. */
const WH_PROPOSAL_RE = /^(?:what|how)\s+about\b/i;

/** Lead-ins that carry no shape of their own. */
const LEAD_IN_RE = /^(?:(?:um+|uh+|er+|hmm+|so|well|okay|ok|oh|wait|and|but|sorry|honestly|actually|like)[,.\s]+)+/i;

/** A short auxiliary-led utterance proposes a value; a long one asks. */
const PROPOSAL_MAX_WORDS = 7;
/** A trailing "?" on an utterance this short is a proposed answer ("solid?",
 *  "above the line?"). */
const BARE_QUERY_MAX_WORDS = 4;

const NUMBER_WORD_RE = /\b(?:zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand|half|third|quarter)\b/i;

const NUMBER_WORD =
  '(?:zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand|half|third|thirds|quarter|quarters)';
/** One proposed value: a (signed) number / decimal / fraction, number words,
 *  or an ordinal / choice ("the second one", "option b", "the last one"). */
const PROPOSED_VALUE =
  '(?:' +
    `(?:[a-z]\\s*(?:=|equals|is)\\s*)?(?:(?:negative|minus|positive|plus)\\s+|[-−+])?(?:\\d+(?:[.,]\\d+)?(?:\\s*/\\s*\\d+)?%?|${NUMBER_WORD}(?:[\\s-]+${NUMBER_WORD})*)` +
    '|(?:the\\s+)?(?:first|second|third|fourth|fifth|last|top|bottom|middle|left|right|other)(?:\\s+(?:one|option|choice))?' +
    '|(?:option|choice|letter)\\s+[a-e1-5]' +
  ')';
/** What may stand between the separator and the value. */
const TAIL_HEDGE = "(?:(?:maybe|perhaps|probably|like|um+|uh+|it'?s|its|is\\s+it|i\\s+think|i\\s+guess|i'?d\\s+say|i\\s+got|the\\s+answer\\s+is)\\s+)*";
/** "…, 5?" / "… but 5" / "…? the second one" — the utterance ENDS on a value
 *  set off from what came before. */
const TAIL_VALUE_RE = new RegExp(
  `(?:[,?;!.…]|\\s[-—–]|\\b(?:but|maybe|so))\\s*${TAIL_HEDGE}${PROPOSED_VALUE}\\s*[?.!]*$`,
  'i',
);
/** The whole remainder after a lead IS a value ("i dont know 5"). */
const WHOLE_VALUE_RE = new RegExp(`^\\s*${TAIL_HEDGE}${PROPOSED_VALUE}\\s*[?.!]*$`, 'i');
/** Leads after which a directly following value is the answer: "I don't know
 *  5", "I'm not sure 5" — not "I don't get 5", "I'm bad at 5". */
const BARE_LEAD_END_RE = /\b(?:know|sure|remember|recall|idea|clue)$/i;

/** Does the utterance end by proposing a value, after its lead? */
function proposesTailValue(t: string, leadEnd: number): boolean {
  const lead = t.slice(0, leadEnd);
  const rest = t.slice(leadEnd);
  if (!rest.trim()) return false;
  if (BARE_LEAD_END_RE.test(lead.trim()) && WHOLE_VALUE_RE.test(rest)) return true;
  return TAIL_VALUE_RE.test(rest);
}

function wordCount(t: string): number {
  return t.split(/\s+/).filter(Boolean).length;
}

function strip(text: string): string {
  return (text || '').trim().replace(LEAD_IN_RE, '').trim();
}

/** Is this student turn a QUESTION (not an answer proposed in question form)? */
export function isStudentQuestion(text: string): boolean {
  const t = strip(text);
  if (!t || t.startsWith('[')) return false;
  const n = wordCount(t);
  const wh = WH_LEAD_RE.exec(t);
  if (wh) {
    if (WH_PROPOSAL_RE.test(t) && n <= PROPOSAL_MAX_WORDS) return false;
    // "what, 5?" / "which one? the second one" / "how many? 4": the question
    // is a lead-in to a proposed value.
    return !proposesTailValue(t, wh[0].length);
  }
  if (AUX_LEAD_RE.test(t)) {
    if (AUX_PERSON_RE.test(t)) return true;
    // "Is it x = 4, y = 2?" — the answer frame plus a value is a proposal at
    // any length.
    if (AUX_ANSWER_FRAME_RE.test(t) && (/\d/.test(t) || NUMBER_WORD_RE.test(t))) return false;
    return n > PROPOSAL_MAX_WORDS;
  }
  if (/\?\s*$/.test(t)) {
    // Ends with "?" and proposes no value.
    if (n <= BARE_QUERY_MAX_WORDS) return false;
    if (/\d/.test(t) || NUMBER_WORD_RE.test(t)) return false;
    return true;
  }
  return false;
}

/** The leading clause reports difficulty. Anchored to the start, so "it's 12
 *  because, I don't know, 3 times 4" is untouched. */
const SELF_REPORT_RE = new RegExp(
  '^i(?:' +
    // I don't / do not / can't / never  know | understand | get | remember …
    "\\s+(?:do\\s+not|don'?t|dont|can\\s*not|can'?t|cant|never|did\\s+not|didn'?t|still\\s+don'?t|really\\s+don'?t)\\s+(?:really\\s+|quite\\s+|fully\\s+|even\\s+)?(?:know|understand|get|remember|recall|follow|see\\s+(?:how|why))\\b" +
    // I'm / I am  not good at | not sure | bad at | confused | lost | stuck …
    "|(?:'?m|\\s+am)\\s+(?:really\\s+|so\\s+|very\\s+|just\\s+|still\\s+)?(?:not\\s+(?:very\\s+|so\\s+|that\\s+)?(?:good|great|sure|confident|following)|bad|terrible|confused|lost|stuck|struggling|having\\s+trouble)\\b" +
    // I forgot | I never learned | I have no idea | I struggle with …
    "|\\s+(?:forgot|forget|have\\s+forgotten|never\\s+learned|never\\s+learnt|haven'?t\\s+learned|haven'?t\\s+learnt|have\\s+no\\s+idea|have\\s+no\\s+clue|struggle\\s+with|have\\s+trouble|always\\s+(?:mess|get|forget))\\b" +
  ')',
  'i',
);

/** A hedge that goes on to PROPOSE something ("I don't know, maybe 5?") is an
 *  answer attempt, not a self-report. */
const HEDGED_PROPOSAL_RE = /\b(?:maybe|perhaps|probably|i\s+think|i\s+guess|i'?d\s+say|is\s+it|could\s+it\s+be|would\s+it\s+be|might\s+be)\b/i;

/** Is this student turn a SELF-REPORT of difficulty? */
export function isSelfReport(text: string): boolean {
  const t = strip(text);
  if (!t || t.startsWith('[')) return false;
  const m = SELF_REPORT_RE.exec(t);
  if (!m) return false;
  if (HEDGED_PROPOSAL_RE.test(t)) return false;
  // "I don't know, 5?" / "i dont know 5" / "I forgot the sign, negative 3".
  return !proposesTailValue(t, m[0].length);
}

/**
 * Exactly the hedged-proposed-value rule: a self-report LEAD ("I don't know",
 * "I'm not sure", "I forgot…") whose tail proposes one value — "I don't know,
 * 5?", "I don't know 5", "I don't know. 7.", "I dont know but 5", "I don't
 * know, maybe five".
 *
 * Second review pass (2026-10-04): the shape read called these answers and
 * nothing else did — the orchestrator's help-request test matched "don't
 * know" (so the turn was not a verification turn) and the ledger's stuck-cue
 * test counted it as stuck. Both now ask this predicate.
 */
export function isHedgedValueAnswer(text: string): boolean {
  const t = strip(text);
  if (!t || t.startsWith('[')) return false;
  const m = SELF_REPORT_RE.exec(t);
  return !!m && proposesTailValue(t, m[0].length);
}

export type StudentTurnShape = 'question' | 'self_report' | 'answer_like';

/** 'answer_like' means only "not ruled out by shape" — the caller's own
 *  answer/verification tests still apply. */
export function studentTurnShape(text: string): StudentTurnShape {
  if (isSelfReport(text)) return 'self_report';
  if (isStudentQuestion(text)) return 'question';
  return 'answer_like';
}
