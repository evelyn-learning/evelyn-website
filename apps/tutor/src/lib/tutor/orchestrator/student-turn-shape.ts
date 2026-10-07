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

import { TUTOR_ALTERNATIVES_QUESTION, TUTOR_HEDGED_ANSWER_WIDENING } from '@/lib/tutor/orchestrator/turn-round-flags';

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

// ── 2026-10-05: wider proposed values (21 scripted Homework Help sessions) ──
//
// "I don't know, maybe 30 m/s?", "I don't know, maybe -10 < x < 2?" and "I
// don't know, maybe 4 kcal/m^2/yr, because it's 10% twice?" were all exactly
// right and none was a hedged VALUE to this module: a unit, an inequality and
// a trailing reason each defeated the bare-number tail. Three additions, each
// still "the utterance ends on ONE proposed value":
//   - a number with a unit ("30 m/s", "9000 seconds", "4 kcal/m^2/yr", "5 meters per second");
//   - a relation / interval / expression made only of maths tokens
//     ("-10 < x < 2", "x = 4 or x = -2", "3x + 1", "(-10, 2)");
//   - either of those, or a plain value, followed by a because-clause.
// Real questions and self-reports keep their shape: "I am not good at 2 digit
// multiplication" (two words after the number), "I don't understand the
// second step", "which is bigger, 5 or 6?" (no relation sign).

const NUM = '(?:(?:negative|minus|positive|plus)\\s+|[-−+])?\\d+(?:[.,]\\d+)?(?:\\s*/\\s*\\d+)?';
/** One unit word, optionally with an exponent, optionally compounded with
 *  "/", "·", "*" or "per" ("m/s", "kcal/m^2/yr", "meters per second",
 *  "cm^3", "°C", "%"). A second free-standing word is NOT a unit ("2 digit
 *  multiplication"). */
const UNIT_WORD = '(?:°\\s?[a-z]{1,2}|[a-zµμΩ]{1,12}(?:\\s?\\^\\s?-?\\d+|[²³])?)';
const UNIT = `${UNIT_WORD}(?:\\s*(?:/|·|\\*|\\bper\\b)\\s*${UNIT_WORD}){0,3}`;
const VALUE_WITH_UNIT = `${NUM}\\s*(?:%|${UNIT})`;
/** Words that may appear inside a spoken maths expression. Any other run of
 *  three or more letters makes it prose. */
const MATH_WORDS = new Set(['or', 'and', 'to', 'sqrt', 'pi', 'inf', 'infinity', 'sin', 'cos', 'tan', 'ln', 'log', 'abs', 'dne']);
const MATH_CHARS_RE = /^[0-9a-zπ√∞\s.,+\-−*/^<>=≤≥≠()[\]|{}]+$/i;
const RELATION_OR_OPERATOR_RE = /[<>=≤≥≠^√]|\d\s*[a-z]\b|[a-z0-9)]\s*[+\-−*/]\s*[a-z0-9(]|^[([]\s*[-−+]?[\d.]+\s*,\s*[-−+]?[\d.]+\s*[)\]]$/i;
const MAX_EXPRESSION_CHARS = 48;

/** Is `t` ONE maths expression / relation / interval and nothing else? */
function isMathExpression(t: string): boolean {
  const e = t.trim();
  if (!e || e.length > MAX_EXPRESSION_CHARS) return false;
  if (!MATH_CHARS_RE.test(e) || !/\d/.test(e)) return false;
  for (const w of e.toLowerCase().match(/[a-zπ]+/g) ?? []) {
    if (w.length > 2 && !MATH_WORDS.has(w)) return false;
  }
  return RELATION_OR_OPERATOR_RE.test(e);
}

const TAIL_SEPARATOR = '(?:[,?;!.…:]|\\s[-—–]|\\b(?:but|maybe|so))';
const WIDE_TAIL_UNIT_RE = new RegExp(`${TAIL_SEPARATOR}\\s*${TAIL_HEDGE}${VALUE_WITH_UNIT}\\s*[?.!]*$`, 'i');
const WIDE_WHOLE_UNIT_RE = new RegExp(`^\\s*${TAIL_HEDGE}${VALUE_WITH_UNIT}\\s*[?.!]*$`, 'i');
/** A trailing reason: ", because it's 10% twice?" — set off by a comma /
 *  dash, or directly after the value. */
const BECAUSE_TAIL_RE = /\s*[,;—–-]?\s*\b(?:because|'?cause|cuz|coz|since)\b[^?]*\??\s*$/i;

/** The wide forms above, tested on what follows the lead. */
function proposesWideTailValue(t: string, leadEnd: number): boolean {
  const lead = t.slice(0, leadEnd);
  const fullRest = t.slice(leadEnd);
  const candidates = [fullRest];
  const withoutReason = fullRest.replace(BECAUSE_TAIL_RE, '');
  if (withoutReason !== fullRest && withoutReason.trim()) candidates.push(withoutReason);
  for (const rest of candidates) {
    if (!rest.trim()) continue;
    // A plain value before the reason clause ("…, maybe 5, because it's half").
    if (rest !== fullRest && (TAIL_VALUE_RE.test(rest) || (BARE_LEAD_END_RE.test(lead.trim()) && WHOLE_VALUE_RE.test(rest)))) return true;
    if (WIDE_TAIL_UNIT_RE.test(rest)) return true;
    if (BARE_LEAD_END_RE.test(lead.trim()) && WIDE_WHOLE_UNIT_RE.test(rest)) return true;
    // "…, maybe -10 < x < 2?": everything after the LAST separator-plus-hedge
    // (or after the first separator) is one expression.
    const body = rest.replace(/\s*[?.!]+\s*$/, '');
    const hedgeCut = /^(.*)\b(?:maybe|perhaps|probably|i\s+think|i\s+guess|i'?d\s+say|is\s+it|i\s+got|the\s+answer\s+is)\s+(.+)$/i.exec(body);
    if (hedgeCut && isMathExpression(hedgeCut[2].replace(/^(?:it'?s|its|like)\s+/i, ''))) return true;
    const sepCut = /^\s*(?:[,?;!.…:]|[-—–]|but|so)\s*(.+)$/i.exec(body);
    if (sepCut && isMathExpression(sepCut[1])) return true;
  }
  return false;
}

function wideEnabled(opt: boolean | undefined): boolean {
  return opt ?? TUTOR_HEDGED_ANSWER_WIDENING;
}

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

// ── 2026-10-06b (portal-10beb4f5, voice): a question that names its own
// alternatives ───────────────────────────────────────────────────────────────
//
// "So is the answer for the second one … is the shaded region above the line
// or below the line?" was sorted as an ANSWER (the "is the answer" frame plus
// a digit elsewhere in the sentence), so the turn was judged and the tutor
// said "that's the opposite of what you said" to a student who had said
// nothing. A question that offers two alternatives and picks neither proposes
// nothing — whatever its lead and however long it is.
//
// Kept answers: a question-form proposal with no alternatives ("is it <one
// value>?"), a statement with a tag ("so it's <a side>, right?"), alternatives
// that are VALUES ("is it x = 2 or x = -3?" proposes both roots), and a
// question that goes on to commit ("… or below? I think below").

const INTERROGATIVE_LEAD_RE =
  /^(?:(?:i\s+(?:do\s+not|don'?t|dont)\s+know|not\s+sure|idk|yeah|yes|right)[,.\s]+)?(?:(?:is|are|was|were|does|do|did|should|would|will|shall|can|could|may|might|am)\b|(?:how|what|why|when|where|which|who|whose)\b|(?:either|whether)\b)/i;
const ALTERNATIVES_RE = /((?:\S+\s+){0,4}\S+)\s+or\s+((?:\S+\s+){0,3}\S+)/gi;
const VALUE_IN_ALTERNATIVE_RE = /\d|[=<>≤≥]/;
const COMMITS_RE = /\b(?:i\s+think|i\s+guess|i'?d\s+say|i\s+suppose|i\s+believe|i\s+got|maybe|probably|perhaps|my\s+answer|i'?ll\s+(?:say|go\s+with)|going\s+with|must\s+be|has\s+to\s+be|so\s+(?:it'?s|it\s+is))\b/i;

/** Does the turn ask "A or B?" and commit to neither? Pure; never throws. */
export function isUncommittedAlternativesQuestion(text: string, opts?: { /** Unset ⇒ TUTOR_ALTERNATIVES_QUESTION. */ enabled?: boolean }): boolean {
  if (!(opts?.enabled ?? TUTOR_ALTERNATIVES_QUESTION)) return false;
  const t = strip(text);
  if (!t || t.startsWith('[')) return false;
  const lastQ = t.lastIndexOf('?');
  // The question, without anything said after its question mark.
  const asked = lastQ >= 0 ? t.slice(0, lastQ + 1) : t;
  const after = lastQ >= 0 ? t.slice(lastQ + 1).replace(/[\s.!,]+/g, ' ').trim() : '';
  // Something said after the question is where a commitment lives.
  if (after && !/^(?:(?:um+|uh+|hmm+|like|i\s+(?:do\s+not|don'?t|dont)\s+know|not\s+sure|idk)\s*)+$/i.test(after)) return false;
  if (!INTERROGATIVE_LEAD_RE.test(asked) && lastQ < 0) return false;
  if (!INTERROGATIVE_LEAD_RE.test(asked) && wordCount(asked) > 12) return false;
  // A hedge word anywhere ("maybe <this>, or <that>?") makes it a proposal.
  if (COMMITS_RE.test(asked)) return false;
  ALTERNATIVES_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  let found = false;
  while ((m = ALTERNATIVES_RE.exec(asked)) !== null) {
    // Alternatives that are values are a proposal of those values.
    const left = m[1].split(/\s+/).slice(-2).join(' ');
    const right = m[2].split(/\s+/).slice(0, 2).join(' ');
    if (VALUE_IN_ALTERNATIVE_RE.test(left) || VALUE_IN_ALTERNATIVE_RE.test(right)) return false;
    if (NUMBER_WORD_RE.test(left) && NUMBER_WORD_RE.test(right)) return false;
    // "… or something", "… or so", "… or not": no second alternative named
    // ("or not" is a yes/no question — the existing rules keep it).
    if (/^(?:something|so|whatever|not|what|anything)\b/i.test(m[2])) continue;
    found = true;
    ALTERNATIVES_RE.lastIndex = m.index + m[1].length + 1;
  }
  return found;
}

/** Is this student turn a QUESTION (not an answer proposed in question form)? */
export function isStudentQuestion(text: string): boolean {
  const t = strip(text);
  if (!t || t.startsWith('[')) return false;
  if (isUncommittedAlternativesQuestion(t)) return true;
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
export function isSelfReport(text: string, opts?: { /** Unset ⇒ TUTOR_HEDGED_ANSWER_WIDENING. */ wideValues?: boolean }): boolean {
  const t = strip(text);
  if (!t || t.startsWith('[')) return false;
  const m = SELF_REPORT_RE.exec(t);
  if (!m) return false;
  if (HEDGED_PROPOSAL_RE.test(t)) return false;
  // "I don't know, 5?" / "i dont know 5" / "I forgot the sign, negative 3".
  if (proposesTailValue(t, m[0].length)) return false;
  // 2026-10-05: "I don't know, 30 m/s?" / "I'm not sure, x > -10".
  return !(wideEnabled(opts?.wideValues) && proposesWideTailValue(t, m[0].length));
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
export function isHedgedValueAnswer(text: string, opts?: { /** Unset ⇒ TUTOR_HEDGED_ANSWER_WIDENING. */ wideValues?: boolean }): boolean {
  const t = strip(text);
  if (!t || t.startsWith('[')) return false;
  const m = SELF_REPORT_RE.exec(t);
  if (!m) return false;
  if (proposesTailValue(t, m[0].length)) return true;
  return wideEnabled(opts?.wideValues) && proposesWideTailValue(t, m[0].length);
}

/** Words that mark an answer as offered without confidence. */
const HEDGE_MARK_RE =
  /\b(?:maybe|perhaps|probably|possibly|i\s+think|i\s+guess|i'?d\s+say|i\s+suppose|not\s+sure|could\s+it\s+be|would\s+it\s+be|might\s+be|is\s+it|i\s+(?:do\s+not|don'?t|dont)\s+know|idk)\b/i;
const HEDGE_LEAD_WINDOW_WORDS = 8;

/**
 * Is this an ANSWER offered with a hedge — "I don't know, maybe 30 m/s?",
 * "maybe 1/6?", "I think it's 5", "I don't know, maybe Country A for cars,
 * because …"? Wider than `isHedgedValueAnswer` on purpose (no value shape is
 * required): it is used only to decide whether a tutor DENIAL of the turn
 * needs confirming before it is counted against the student
 * (answer-attempt.ts `hedgedDenialCounts`). A question, a self-report with
 * nothing proposed, a synthetic turn and a turn with no hedge word in its
 * opening words are not it. Pure.
 */
export function isHedgedProposal(text: string): boolean {
  const t = strip(text);
  if (!t || t.startsWith('[')) return false;
  if (isUncommittedAlternativesQuestion(t)) return false;
  if (isHedgedValueAnswer(t, { wideValues: true })) return true;
  const lead = t.split(/\s+/).slice(0, HEDGE_LEAD_WINDOW_WORDS).join(' ');
  if (!HEDGE_MARK_RE.test(lead)) return false;
  if (isSelfReport(t, { wideValues: true })) return false;
  // "is it …" / "could it be …" frames are proposals; any other question is not.
  if (isStudentQuestion(t) && !/^(?:is|could|would|might)\s+it\b/i.test(t)) return false;
  return true;
}

export type StudentTurnShape = 'question' | 'self_report' | 'answer_like';

/** 'answer_like' means only "not ruled out by shape" — the caller's own
 *  answer/verification tests still apply. */
export function studentTurnShape(text: string): StudentTurnShape {
  if (isSelfReport(text)) return 'self_report';
  if (isStudentQuestion(text)) return 'question';
  return 'answer_like';
}
