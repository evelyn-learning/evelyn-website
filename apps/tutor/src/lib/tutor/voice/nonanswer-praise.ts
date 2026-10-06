/**
 * Non-answer praise backstop (live round 5, 2026-07-23, session-1784778855564).
 *
 * Observed failure: tutor asked "what's its acceleration?", the student said
 * "Oh, okay." — a pure acknowledgment, not an answer — and the brain replied
 * "Exactly.4 meters per second squared", praising a non-answer AND revealing
 * the answer to its own open question. The per-turn <verdict_guard> block was
 * attached (verified) and the model blew through it under praise-opener
 * momentum (3 consecutive legit "Exactly." openers preceded the turn), so a
 * prompt rule alone is not enough — this is the deterministic client-side
 * backstop, same tier as the contradiction-inversion kill.
 *
 * Deliberately narrow, both ways:
 *  - the student utterance must EXACTLY match a closed acknowledgment-phrase
 *    list (after filler stripping). "yes"/"yeah"/"no" are excluded — they can
 *    be legitimate answers to yes/no questions; bare "right" is excluded — it
 *    can answer a direction question.
 *  - the turn must open with a praise verdict IMMEDIATELY followed by a
 *    numeric value ("Exactly.4 meters…", "Right. 45 N…"). A praise-opener
 *    that continues into prose ("Right. Here's the next one: a 5 kg box…")
 *    does NOT fire — that's a legit discourse marker + new problem.
 *
 * Tests: npm run test:nonanswer-praise.
 */

import { lastQuestionSentence, stripMarkdownEmphasis } from '@/lib/tutor/question-gist-text';
import { TUTOR_BARE_ASSENT_PRAISE_KILL, TUTOR_AMBIGUOUS_ASSENT_KILL } from '@/lib/tutor/orchestrator/turn-round-flags';

/** Filler tokens stripped before matching (never load-bearing). */
const FILLER = new Set(['um', 'uh', 'er', 'like', 'so', 'well']);

/** Closed phrase list — a pure acknowledgment carries no answer content. */
const ACK_PHRASES = new Set([
  'oh', 'okay', 'ok', 'oh okay', 'oh ok', 'okay okay',
  'mhm', 'mm', 'hmm', 'mm hmm', 'mmhmm', 'uh huh', 'huh',
  'alright', 'all right', 'oh alright', 'oh all right',
  'got it', 'oh got it', 'okay got it', 'gotcha', 'oh gotcha',
  'i see', 'oh i see', 'ah', 'aha', 'ah okay', 'ah i see',
  'makes sense', 'that makes sense', 'sounds good', 'okay cool', 'cool',
  'sure', 'fine', 'okay sure',
]);

export function isPureAcknowledgment(text: string): boolean {
  const words = text
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w && !FILLER.has(w));
  if (words.length === 0 || words.length > 4) return false;
  return ACK_PHRASES.has(words.join(' '));
}

/** 2026-08-07 triage extension: two more non-answer classes, same closed-set
 *  philosophy as ACK_PHRASES.
 *  - 'idk'    — an explicit give-up ("I don't know." → "Right, a circle!" in
 *               session-1786064015703: the reveal must never be praise-phrased).
 *  - 'request'— the student asked for something instead of answering
 *               ("gtive another example" → "One eighth. Nice." in
 *               embed-1786076855391: a request is never gradeable).
 *  Apostrophes are stripped WITHOUT inserting a space ("don't" → "dont") so
 *  contraction variants collapse to one spelling. */
export type NonAnswerKind = 'ack' | 'idk' | 'request';

const IDK_RE =
  /^(?:i\s+)?(?:dont\s+know|do\s+not\s+know|dunno|idk|no\s+idea|have\s+no\s+idea|not\s+sure|im\s+not\s+sure|i\s+am\s+not\s+sure|no\s+clue|forget|forgot|dont\s+remember)$/;

/** Anchored request shapes — imperative ask, polite ask, or the "another
 *  example/one" tail (covers STT-mangled verbs like "gtive"). */
const REQUEST_RES: RegExp[] = [
  /^(?:please\s+)?(?:give|show|tell|explain|teach|repeat)\b/,
  /^(?:can|could|would|will)\s+(?:you|we)\b/,
  /\banother\s+(?:example|one)\b/,
  /^what\s+do\s+you\s+mean\b/,
  /^(?:please\s+)?help(?:\s+me)?$/,
  /^(?:give\s+me\s+)?a\s+hint$|^hints?$/,
];

export function classifyNonAnswer(text: string): NonAnswerKind | null {
  if (isPureAcknowledgment(text)) return 'ack';
  const words = text
    .toLowerCase()
    .replace(/'/g, '')
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w && !FILLER.has(w));
  if (words.length === 0) return null;
  const joined = words.join(' ');
  // A long utterance carries content — grade it, don't classify it away.
  if (words.length <= 5 && IDK_RE.test(joined)) return 'idk';
  if (words.length <= 8 && REQUEST_RES.some((re) => re.test(joined))) return 'request';
  return null;
}

/** Praise verdict opener followed IMMEDIATELY by a numeric value — the
 *  answer-reveal shape ("Exactly.4 meters…", "Right. 45 N…"). Prose after
 *  the praise ("Right. Here's the next one…") deliberately does not match. */
/** `(?:\\[a-z]+[^a-z\d]*)*` steps over TeX commands so a latex-wrapped reveal
 *  ("Exactly. $\frac{1}{8}$ …") still counts as praise-then-value; ordinary
 *  prose after the praise ("Right. Here's the next one…") still doesn't. */
const PRAISE_THEN_VALUE_RE =
  /^\s*(?:exactly|correct|perfect|right|spot on|nailed it|you got it|that['’]s (?:right|it|correct))[.!,]?\s*[^a-z\d]*(?:\\[a-z]+[^a-z\d]*)*\d/i;

/**
 * Should this attempt be killed as praise-plus-reveal to a non-answer?
 * `attemptText` is the turn's accumulated narration so far — evaluate on
 * each new sentence; fires as soon as the reveal shape completes.
 */
export function shouldKillNonAnswerPraise(studentText: string, attemptText: string): boolean {
  if (classifyNonAnswer(studentText) === null) return false;
  return PRAISE_THEN_VALUE_RE.test(attemptText);
}

/** Retry feedback fed to the brain via the standard rejection channel —
 *  worded per non-answer class. */
export function nonAnswerPraiseFeedback(studentText: string): string {
  const quoted = `The student said "${studentText.trim()}"`;
  const kind = classifyNonAnswer(studentText);
  if (kind === 'idk') {
    return (
      `${quoted} — they do NOT know and gave no answer, yet you opened with praise and revealed the answer as if grading a correct reply. ` +
      `Re-emit your response: no verdict or praise word ("Right." / "Exactly." / "Nice."). ` +
      `Either guide them with a smaller step or hint, or — if you choose to reveal — reveal plainly and kindly ("No worries — it's …"), never as an affirmation.`
    );
  }
  if (kind === 'request') {
    return (
      `${quoted} — a REQUEST, not an answer. You treated it as a correct answer: you answered your own open question and praised. ` +
      `Re-emit your response: respond to the request itself, no verdict or praise word, and do NOT answer your own question for them. ` +
      `Do not narrate this classification ("that's a request, not an answer") — just respond naturally ("Sure — here's one more.").`
    );
  }
  return (
    `${quoted} — an acknowledgment, NOT an answer. ` +
    `You affirmed it and revealed the answer to your own open question. ` +
    `Re-emit your response: no verdict word, do NOT state the answer or its value. ` +
    `The student has not answered yet — briefly re-invite them (e.g. "Take your time — what do you get?") or keep waiting. ` +
    // R58 (live, portal-9c73c826): the brain paraphrased this feedback
    // aloud ("'Um, let me think' isn't an answer yet — no verdict"). Same
    // clause the request branch already carries.
    `Do not narrate this classification ("isn't an answer", "no verdict") — just respond naturally.`
  );
}

// ── 2026-10-05: praise for a bare "yes" to a question that is not yes/no ───
//
// 21 scripted Homework Help sessions: the student typed only "yes" while a
// wh-question was open and the tutor affirmed it and answered its own
// question — "What's ten percent of forty?" → "yes" → "Right. Ten percent of
// forty is four…"; "…how would you now state the full answer…?" → "yes" →
// "Exactly right. During dehydration synthesis…" (10 of 21 sessions).
// `shouldKillNonAnswerPraise` excludes yes / no by design — they answer a
// yes/no question. This is the complementary, equally narrow case:
//   · the student's turn is ONLY yes / yeah / yep / no / nope / ok;
//   · the tutor's last turn asked exactly the kind of question a yes or no
//     cannot answer: its final clause is a wh-question, and NO question in
//     that turn is a yes/no, readiness, offer or tag question;
//   · the reply opens with an affirming VERDICT ("Right." "Exactly right."
//     "Yes — exactly" "Nice work…"), not a discourse marker ("Right, let's…",
//     "Okay — …", "Great, let's move on").
// Anything else — no open question, an either/or question, a question led by
// an auxiliary — is left alone.

const BARE_ASSENT_RE = /^(?:(?:um+|uh+|oh|well|so|hmm+)[,.\s]+)*(?:yes|yeah|yep|yup|no|nope|ok|okay)[\s.!,]*$/i;

/** Is the student's turn ONLY a yes / no / ok? */
export function isBareAssent(studentText: string): boolean {
  return BARE_ASSENT_RE.test((studentText ?? '').trim());
}

const WH_WORD_RE = /\b(?:what|which|how|why|where|when|who|whose|whom)(?:'s|’s|'re|’re)?\b/i;
const AUX_START_RE =
  /^(?:(?:so|now|and|but|okay|ok|alright|then|well|first|next|again)[,\s]+)*(?:is|isn'?t|are|aren'?t|was|wasn'?t|were|do|don'?t|does|doesn'?t|did|didn'?t|can|can'?t|could|couldn'?t|will|won'?t|would|wouldn'?t|should|shouldn'?t|shall|have|haven'?t|has|hasn'?t|had|may|might|am|must)\b/i;
/** Readiness, offers and comprehension checks: a yes or no DOES answer these. */
const READINESS_RE =
  /\b(?:ready|shall\s+(?:we|i)|should\s+(?:we|i)|want(?:\s+to|\s+me|\s+a|\s+another)?|wanna|would\s+you\s+like|like\s+(?:to|me\s+to|a|another)|make(?:s|ing)?\s+sense|sound(?:s)?\s+(?:good|ok|okay|right|fair)|got\s+(?:it|that)|with\s+me|following|all\s+(?:good|set|clear)|clear\s+so\s+far|agree|see\s+(?:it|that|how|why|what)|need\s+(?:a|more|another|help)|okay\s+(?:to|with|if)|good\s+(?:to|with)|feel(?:ing)?\s+(?:good|ok|okay|comfortable|confident)|comfortable|any\s+questions?|still\s+there|can\s+you\s+(?:see|hear))\b/i;
/** "…, right?" "…, yes?" "…, isn't it?" */
const TAG_QUESTION_RE =
  /[,—–-]\s*(?:right|yes|yeah|no|ok(?:ay)?|correct|agreed?|true|see|isn'?t\s+(?:it|that)|doesn'?t\s+it|don'?t\s+you(?:\s+think)?|wouldn'?t\s+(?:it|you)|aren'?t\s+they|can'?t\s+(?:we|you))\s*$/i;

function questionSentences(text: string): string[] {
  return (stripMarkdownEmphasis(text ?? '').match(/[^.!?\n]{4,}\?/g) ?? []).map((q) => q.replace(/\?\s*$/, '').trim());
}
/** The clause that actually asks: what follows the last dash / colon / semicolon. */
function finalClause(question: string): string {
  const parts = question.split(/\s[—–]\s|\s-\s|[:;]\s/);
  return (parts[parts.length - 1] ?? question).trim();
}

export type QuestionKind = 'wh' | 'yes_no' | 'unclear';

/** Classify ONE question sentence. 'wh' only when a yes / no plainly cannot
 *  answer it; 'yes_no' when it plainly can; anything else 'unclear'. */
export function classifyQuestion(question: string): QuestionKind {
  const q = (question ?? '').replace(/\?\s*$/, '').trim();
  if (!q) return 'unclear';
  const clause = finalClause(q);
  if (TAG_QUESTION_RE.test(q) || READINESS_RE.test(clause)) return 'yes_no';
  if (AUX_START_RE.test(clause)) return 'yes_no';
  // A short clause with no verb of asking ("ready?", "okay?", "yes?").
  if (clause.split(/\s+/).length <= 2 && !WH_WORD_RE.test(clause)) return 'yes_no';
  if (WH_WORD_RE.test(clause)) return 'wh';
  return 'unclear';
}

/** The open question of the tutor's last turn, when a bare yes / no cannot
 *  answer it and no other question of that turn could be what the student
 *  assented to. Null otherwise. */
export function openNonYesNoQuestion(priorTutorTurn: string): string | null {
  const last = lastQuestionSentence(priorTutorTurn ?? '');
  if (!last || classifyQuestion(last) !== 'wh') return null;
  for (const q of questionSentences(priorTutorTurn)) {
    if (classifyQuestion(q) === 'yes_no') return null;
  }
  return last;
}

/** An affirming VERDICT at the very start of the reply. "Right," + more
 *  words is a discourse marker and is not matched; "Right." / "Right —" /
 *  "Exactly" / "Yes — exactly" / "That's right" / "Nice work" are. */
const VERDICT_OPENER_RE = new RegExp(
  '^[*_~`\\s]*(?:' +
    '(?:yes|yep|yeah)\\s*[,.!—–-]+\\s*(?:exactly|that\'?s\\s+(?:right|it|correct)|correct|right\\b(?=\\s*[.!—–])|you\\s+got\\s+it|perfect|spot\\s+on)' +
    '|exactly(?:\\s+right)?\\b' +
    '|right\\b(?=\\s*(?:[.!…]|[—–]|-\\s))' +
    '|correct\\b(?=\\s*(?:[.!,…]|[—–]|-\\s))' +
    '|perfect\\b(?=\\s*(?:[.!,…]|[—–]|-\\s))' +
    '|spot[\\s-]?on\\b|nailed\\s+it\\b|bingo\\b|you(?:\'?ve)?\\s+got\\s+it\\b|you\'?re\\s+(?:exactly\\s+|absolutely\\s+)?right\\b' +
    '|that(?:\'?s|\\s+is)\\s+(?:exactly\\s+|absolutely\\s+)?(?:right|correct|it\\b(?=\\s*[.!—–]))' +
    '|(?:nice|great|good|excellent)\\s+(?:work|job)\\b|nicely\\s+done\\b|well\\s+done\\b' +
  ')',
  'i',
);
export function opensWithAffirmingVerdict(attemptText: string): boolean {
  return VERDICT_OPENER_RE.test(attemptText ?? '');
}

/**
 * Should this attempt be killed as an affirming verdict to a bare yes / no
 * that could not have answered the open question?
 * @param enabled  Unset ⇒ TUTOR_BARE_ASSENT_PRAISE_KILL.
 */
export function shouldKillBareAssentPraise(
  studentText: string,
  attemptText: string,
  priorTutorTurn: string,
  opts?: { enabled?: boolean },
): boolean {
  if ((opts?.enabled ?? TUTOR_BARE_ASSENT_PRAISE_KILL) !== true) return false;
  if (!isBareAssent(studentText)) return false;
  if (!opensWithAffirmingVerdict(attemptText)) return false;
  return openNonYesNoQuestion(priorTutorTurn) !== null;
}

/** Retry feedback via the standard rejection channel. */
export function bareAssentPraiseFeedback(studentText: string, priorTutorTurn: string): string {
  const q = openNonYesNoQuestion(priorTutorTurn);
  return (
    `The student said only "${(studentText ?? '').trim()}"` +
    (q ? `, and the question you had asked was "${q.slice(0, 200)}?" — a question a yes or no cannot answer. ` : '. ') +
    `They have NOT answered it, yet you opened with an affirming verdict as if they had. ` +
    `Re-emit your response: no verdict or praise word ("Right." / "Exactly." / "Nice work"), and do NOT answer your own question for them. ` +
    `Invite them to answer it in their own words — re-ask it briefly or offer a smaller first step. ` +
    `Do not narrate this ("that's not an answer", "you only said yes") — just respond naturally.`
  );
}

// ── 2026-10-06: the open question's kind, and assents that settle nothing ──
//
// Replay of 23 scripted text sessions with thinking on: a bare "yes" was still
// praised in 3 of 11 sessions, and each one fell outside the kill above —
//   · "Ready to put Problem 2's answer together fully? How would you write the
//     complete solution to …?" → "yes" → "Right — the complete solution is …":
//     the LAST question is a wh-question, but an earlier one in the same turn
//     is a readiness question, so `openNonYesNoQuestion` (which wants NO
//     yes/no question anywhere in the turn) returned null;
//   · "Ready to move to the next homework problem, or want to wrap here?" →
//     "yes" → "Both homework problems are done — … See you next time!": an
//     either/or question, where a yes names neither alternative, and the
//     session was closed on it.
// `readOpenQuestion` names the LAST question of the tutor's turn and its kind;
// `readBareAssent` says what a bare yes / no / ok does to it. Both feed the
// per-turn <turn_shape> facts (turn-shape-signal.ts) and the kill below.

export type OpenQuestionKind = 'wh' | 'yes_no' | 'readiness' | 'either_or' | 'unclear';

export interface OpenQuestionRead {
  /** The last question of the tutor's turn, verbatim, with its "?". */
  question: string;
  kind: OpenQuestionKind;
  /** An EARLIER question of the same turn is one a yes / no can answer. */
  earlierYesNo: boolean;
}

const OPEN_QUESTION_MAX_CHARS = 400;

/** The last question of a tutor turn, verbatim: from the end of the previous
 *  sentence to the last "?". A "." inside a number or a formula is not a
 *  sentence end (it is not followed by white space). Null when none. */
export function openQuestionText(priorTutorTurn: string): string | null {
  const t = (priorTutorTurn ?? '').trim();
  const end = t.lastIndexOf('?');
  if (end < 0) return null;
  const head = t.slice(0, end);
  let start = 0;
  const boundary = /(?:[.!?…]["')\]*_]*\s+|\n+)/g;
  for (let m = boundary.exec(head); m; m = boundary.exec(head)) start = m.index + m[0].length;
  const q = t.slice(start, end + 1).trim();
  if (q.length < 5) return null;
  return q.length > OPEN_QUESTION_MAX_CHARS ? `…${q.slice(-OPEN_QUESTION_MAX_CHARS)}` : q;
}

/** "… or not?", "an hour or so", "more or less": not a pair of alternatives. */
const OR_NON_ALTERNATIVE_RE = /\bor\s+(?:not|so|more|less|two|both)\b|\b(?:more|sooner|one|either)\s+or\b/i;
/** A formula on both sides of the "or" ("x = 5 or x = -2", "M or M"): the
 *  "or" belongs to the mathematics, not to the question. */
const OR_BETWEEN_VALUES_RE = /(?:§|[\d)])\s*,?\s+or\s+(?:§|[-−+(]?\s*\d|[a-z]\s*[=<>≤≥])/i;

/** Does the question offer alternatives joined by "or", so that a bare yes or
 *  no does not say which? */
function offersAlternatives(question: string): boolean {
  // Formulas out of the way first ($…$ → §) so an "or" inside one never counts.
  const q = stripMarkdownEmphasis(question ?? '').replace(/\$[^$\n]*\$/g, '§');
  if (!/\bor\b/i.test(q)) return false;
  if (OR_BETWEEN_VALUES_RE.test(q)) return false;
  return !OR_NON_ALTERNATIVE_RE.test(q);
}

const WH_LEAD_CLAUSE_RE =
  /^(?:(?:so|now|and|but|okay|ok|alright|then|well|first|next|again)[,\s]+)*(?:what|which|how|why|where|when|who|whose|whom)\b/i;

/** The last question of the tutor's turn and its kind. Null when the turn
 *  asked nothing. */
export function readOpenQuestion(priorTutorTurn: string): OpenQuestionRead | null {
  const question = openQuestionText(priorTutorTurn);
  if (!question) return null;
  const plain = stripMarkdownEmphasis(question).replace(/\?\s*$/, '').trim();
  const base = classifyQuestion(plain);
  let kind: OpenQuestionKind;
  if (offersAlternatives(plain) && !WH_LEAD_CLAUSE_RE.test(finalClause(plain))) kind = 'either_or';
  else if (base === 'yes_no') kind = READINESS_RE.test(finalClause(plain)) ? 'readiness' : 'yes_no';
  // "With that in mind, is it still …?" — the asking clause follows a comma.
  else if (base === 'unclear' && AUX_START_RE.test(plain.slice(plain.lastIndexOf(',') + 1).trim())) kind = 'yes_no';
  else kind = base;
  const all = questionSentences(priorTutorTurn);
  const earlierYesNo = all.slice(0, -1).some((q) => classifyQuestion(q) === 'yes_no');
  return { question, kind, earlierYesNo };
}

/** What a bare yes / no / ok does to the open question:
 *   'answers'       — the question is one a yes or no answers;
 *   'not_an_answer' — a wh-question: the assent cannot answer it;
 *   'ambiguous'     — an either/or question: it does not say which. */
export type BareAssentReading = 'answers' | 'not_an_answer' | 'ambiguous';

export function readBareAssent(
  studentText: string,
  priorTutorTurn: string,
): { reading: BareAssentReading; open: OpenQuestionRead } | null {
  if (!isBareAssent(studentText) && !isPureAcknowledgment(studentText ?? '')) return null;
  const open = readOpenQuestion(priorTutorTurn);
  if (!open) return null;
  const reading: BareAssentReading =
    open.kind === 'either_or' ? 'ambiguous' : open.kind === 'wh' ? 'not_an_answer' : 'answers';
  return { reading, open };
}

/** A reply that ends the session: a sign-off, or a statement that the work is
 *  all done. Tested on the reply so far, sentence by sentence. */
const SESSION_CLOSE_RE = new RegExp(
  '\\b(?:' +
    'see\\s+you\\s+(?:next\\s+time|later|soon|tomorrow|then|again)' +
    '|until\\s+next\\s+time|goodbye|bye\\s+for\\s+now|take\\s+care' +
    '|(?:that(?:\'?s|\\s+is)|this\\s+is)\\s+(?:it|all|everything)\\s+for\\s+(?:today|now|this\\s+session)' +
    '|that\\s+wraps\\s+(?:up\\s+)?(?:us|things|it|this|the\\s+session|today|everything|both|your\\s+homework)' +
    '|(?:great|good|nice|awesome|excellent)\\s+(?:session|work\\s+today|job\\s+today)' +
    '|(?:have|enjoy)\\s+(?:a|the\\s+rest\\s+of\\s+your)\\s+(?:(?:great|good|nice|wonderful|lovely)\\s+)?(?:day|night|evening|weekend)' +
    '|come\\s+back\\s+any\\s?time' +
    '|(?:both|all|all\\s+of\\s+your|your)\\s+(?:homework\\s+)?(?:problems|questions)\\s+are\\s+(?:now\\s+)?(?:all\\s+)?(?:done|solved|finished|complete|wrapped(?:\\s+up)?)' +
    '|(?:your\\s+|the\\s+)?homework(?:\'?s|\\s+is)\\s+(?:all\\s+|now\\s+)?(?:done|finished|complete)' +
    '|you(?:\'?re|\\s+are)\\s+(?:all\\s+)?(?:done|set|finished)\\s+for\\s+(?:today|now)' +
    '|we(?:\'?re|\\s+are)\\s+(?:all\\s+)?(?:done|finished)\\s+(?:for\\s+(?:today|now)|here)' +
  ')\\b',
  'i',
);
export function isSessionCloseReply(attemptText: string): boolean {
  return SESSION_CLOSE_RE.test(stripMarkdownEmphasis(attemptText ?? ''));
}

export type AmbiguousAssentKill =
  /** Affirming verdict to a bare yes / no on an either/or question. */
  | 'either_or_verdict'
  /** Affirming verdict to a bare yes / no whose LAST open question is a
   *  wh-question, an earlier question of the turn being yes/no. */
  | 'earlier_question_verdict'
  /** The reply ends the session on a bare yes / no that settled nothing. */
  | 'ambiguous_close';

/**
 * The extension of `shouldKillBareAssentPraise` (which stays as it is): the
 * same bare yes / no / ok, the cases that one leaves alone on purpose.
 * Null ⇒ no kill.
 * @param enabled  Unset ⇒ TUTOR_AMBIGUOUS_ASSENT_KILL.
 */
export function ambiguousAssentKill(
  studentText: string,
  attemptText: string,
  priorTutorTurn: string,
  opts?: { enabled?: boolean },
): AmbiguousAssentKill | null {
  if ((opts?.enabled ?? TUTOR_AMBIGUOUS_ASSENT_KILL) !== true) return null;
  if (!isBareAssent(studentText)) return null;
  const read = readBareAssent(studentText, priorTutorTurn);
  if (!read || read.reading === 'answers') return null;
  if (isSessionCloseReply(attemptText)) return 'ambiguous_close';
  if (!opensWithAffirmingVerdict(attemptText)) return null;
  if (read.reading === 'ambiguous') return 'either_or_verdict';
  // A wh-question with no yes/no question before it is the original kill's.
  return read.open.earlierYesNo ? 'earlier_question_verdict' : null;
}

/** Retry feedback via the standard rejection channel. */
export function ambiguousAssentFeedback(kind: AmbiguousAssentKill, studentText: string, priorTutorTurn: string): string {
  const q = readOpenQuestion(priorTutorTurn)?.question ?? '';
  const said = `The student said only "${(studentText ?? '').trim()}"`;
  const asked = q ? `, and the last question you had asked was "${q.slice(0, 240)}"` : '';
  const quiet = ` Do not narrate this ("that's not an answer", "you only said yes") — just respond naturally.`;
  if (kind === 'ambiguous_close') {
    return (
      `${said}${asked}. That does not tell you what they want, and you ended the session on it. ` +
      `Re-emit your response: do NOT sign off, wrap up or say the work is finished. ` +
      `Ask, in a few words, which they mean — or ask the open question again — and wait for their answer.` + quiet
    );
  }
  if (kind === 'either_or_verdict') {
    return (
      `${said}${asked} — a question that offers alternatives, so a yes or no does not say which. ` +
      `You opened with an affirming verdict as if they had answered. ` +
      `Re-emit your response: no verdict or praise word, do not pick an alternative for them, and ask which one they mean in a few words.` + quiet
    );
  }
  return (
    `${said}${asked} — a question a yes or no cannot answer; at most they agreed to an earlier question in the same message. ` +
    `They have NOT answered it, yet you opened with an affirming verdict and answered it yourself. ` +
    `Re-emit your response: no verdict or praise word, and do NOT answer your own question for them. ` +
    `Go straight to that question — ask it again briefly or offer a smaller first step.` + quiet
  );
}
