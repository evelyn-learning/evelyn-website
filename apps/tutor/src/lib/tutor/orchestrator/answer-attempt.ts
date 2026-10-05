/**
 * Rule-based `wrong` ledger events from answer attempts.
 *
 * 2026-10-02 (live portal-bf533c4b): six wrong or confused answers to
 * "2x + y = 7, x − y = 2" produced ONE pacing-credit decision, and the
 * advisory judge withheld it (wrongly: 2·2+3=7 but 2−3≠2). The pacing path
 * was the ONLY producer of ledger `wrong` events, so the gap was recorded
 * with STUCK_CUE alone and the partner feed's `repeated_difficulty` flag —
 * which needs INCORRECT_STREAK_2_PLUS / NO_RECOVERY — never fired.
 *
 * This module is the ledger-only fallback: a plausible answer from the
 * student, met by a tutor correction, is a `wrong` event — unless a
 * deterministic objective-correct proof says otherwise. The advisory LLM
 * judge is deliberately NOT a gate here: it only withholds PACING credit.
 *
 * Pure; never throws.
 */
import { isLedgerStuckCue } from '@/lib/tutor/orchestrator/struggle-ledger';
import { readPacingVerdict } from '@/lib/tutor/voice/pacing-verdict';
import { isStudentQuestion, isSelfReport } from '@/lib/tutor/orchestrator/student-turn-shape';
import { spokenNumbersToDigits } from '@/lib/tutor/voice/spoken-numbers';
import { TUTOR_TURN_SHAPE_GATE } from '@/lib/tutor/orchestrator/turn-round-flags';

/** Requests for help / another example: never an answer. */
const HELP_REQUEST_RE =
  /\b(give me|another (one|example)|explain|example|help|what do you mean|how do (i|you)|can you|could you)\b/i;

/** Math-bearing shapes: a digit, `=`, or an operator/sign standing as a token
 *  (`- 3`, `+x`, `x ^ 2`), so a hyphenated word ("well-known") never counts. */
const MATH_SHAPE_RE = /\d|=|(?:^|\s)[+\-−×÷*/^](?=\s|[a-z0-9(]|$)/i;

const SHORT_ANSWER_MAX_WORDS = 8;

/** Pure acknowledgements / yes-no fillers: short, but never an answer the
 *  tutor could be correcting ("ok" → "Let's check your work…" is a hand-off,
 *  not a wrong answer). Review concern on the first cut of this module. */
const ACK_ONLY_RE =
  /^[\s"'.!,]*(?:ok(?:ay)?|k|yes|yeah|yep|yup|no|nope|sure|fine|right|got it|i see|alright|thanks|thank you|hi|hello|um+|uh+|hmm+)(?:[\s"'.!,]+(?:ok(?:ay)?|yes|yeah|sure|fine|right|got it|i see|thanks|please))*[\s"'.!,?]*$/i;

/**
 * Correction openers `readPacingVerdict` does not read (its CORRECTION_RE
 * wants "close but" with no comma and has no "not exactly"). Anchored to the
 * turn's opening so ordinary prose later in the turn never matches — the
 * whole-turn "almost" false positive (R53) is exactly what this avoids.
 * Local to this ledger fallback on purpose: widening CORRECTION_RE would also
 * move pacing credit, which this change must not touch.
 */
const LEDGER_CORRECTION_OPENER_RE =
  /^[*_~`\s]*(?:(?:hmm+|ah|oh|ok(?:ay)?)[,.!—–\-\s]+)?(?:close,?\s+but\b|not\s+(?:exactly|quite)\b)/i;

/** Short utterances that are conversation, not content: a bare "what", "next",
 *  "idk". Used only by `isBareShortAnswer`, where one or two words are enough
 *  to count — so one or two words of chatter must not. */
const SHORT_FILLER_RE =
  /^[\s"'.!,]*(?:i\s+(?:do\s+not|don'?t|dont)\s+know|idk|dunno|no\s+(?:idea|clue)|not\s+sure|what|huh|eh|wait|pardon|sorry|next|skip|pass|go|go\s+on|go\s+ahead|continue|keep\s+going|ready|done|cool|nice|great|good|sounds\s+good|makes\s+sense|hey|mhm+|mm+|uh\s*huh|repeat|again|say\s+(?:that\s+)?again|one\s+(?:sec|second|moment|minute)|hold\s+on|bye|stop|help|hint|maybe|please|nothing|whatever)[\s"'.!,?]*$/i;

/** Words that make a short phrase chatter rather than a bare answer ("that
 *  makes sense", "let me think", "give me a second"). */
const CHATTER_WORD_RE =
  /\b(?:i|me|my|you|your|we|us|that|this|think|sense|second|sec|minute|moment|time|again|wait|see|know|sure|understand|got|get|ready|hold|let|lets|give|say|repeat|thanks|thank|please|sounds|makes|hello|hi|bye)\b/i;

/** A light answer frame that may precede a bare answer ("it's solid"). */
const ANSWER_FRAME_RE = /^(?:(?:um+|uh+|oh|so|like)[,.\s]+)*(?:it'?s|it\s+is|that'?s|the\s+answer\s+is|answer\s+is|maybe|probably)\s+/i;

const BARE_SHORT_MAX_WORDS = 3;

/**
 * Review of the first cut (2026-10-04): one to three words that are NOT an
 * answer still passed — "oh", "louder", "can't hear", "because it's even",
 * "one sec please". Counted as answers, each would be credited or marked
 * wrong by whatever the tutor said next.
 */
/** Interjections. */
const INTERJECTION_RE =
  /^[\s"'.!,]*(?:o+h+|a+h+|aha+|o+ps|whoops|wow|whoa|ugh+|yikes|oof|hm+|er+m?|eh|ha(?:ha)+|lol|omg|jeez|geez|gosh|man|dang|darn|shoot|yay|phew|ooh+|aw+|hey)(?:[\s"'.!,]+(?:o+h+|a+h+|no|yeah|wow|man|ok(?:ay)?|i\s+see|right|wait))*[\s"'.!,?…]*$/i;
/** About the audio / the pace / waiting — talk to the tutor, not an answer. */
// Second review pass (2026-10-04): bare `louder / quieter / slower / faster /
// volume / frozen / froze / hang / speak` were here and swallowed real physics
// and chemistry answers ("What happens to the sound?" → "louder"). Those
// count only as PHRASES addressed to the tutor.
const PACE_WORD = '(?:louder|quieter|slower|faster)';
const META_WORD_RE = new RegExp(
  '\\b(?:hear|heard|mic|microphone|audio|mute|muted|unmute|lag|laggy|glitch|come\\s+again|back\\s+up|hang\\s+on' +
    '|too\\s+(?:fast|slow|quiet|loud)|slow\\s+down|speed\\s+up|speak\\s+up|turn\\s+(?:it|that|you|the\\s+volume)\\s+(?:up|down)' +
    `|(?:speak|talk|go|say\\s+(?:it|that))\\s+(?:a\\s+(?:bit|little)\\s+)?(?:more\\s+)?(?:${PACE_WORD}|slowly|quickly|clearly)` +
    `|${PACE_WORD}\\s+please|please\\s+${PACE_WORD}` +
    "|(?:you|you'?re|you\\s+are|screen|video|app)(?:\\s+is|\\s+has)?\\s+(?:frozen|froze)" +
  ')\\b',
  'i',
);
/** A reason clause on its own ("because it's even") explains; it does not
 *  answer. */
const REASON_LEAD_RE = /^(?:because|cause|cuz|coz|'cause|since|so\s+that|due\s+to)\b/i;
/** "one sec", "two seconds", "a minute" — a wait, not a number. */
const WAIT_RE = /\b(?:a|an|one|two|few|couple|1|2|\d+)\s+(?:secs?|seconds?|mins?|minutes?|moments?|mo)\b/i;
/** An ordinal / positional choice: "the second one", "the last one". */
const CHOICE_ANSWER_RE = /^(?:the\s+)?(?:first|second|third|fourth|fifth|last|top|bottom|middle|left|right|other)(?:\s+(?:one|option|choice))?$/i;

/**
 * Is this a BARE SHORT ANSWER — a number / simple expression, or one to three
 * content words ("3.", "5", "solid.", "below the line.")?
 *
 * 2026-10-04 (live, student gac-test-001): the pacing block's verification
 * test wants three characters plus digits, maths language or six words, so
 * "3", "5", "2" and "solid." were invisible to it — six wrong answers, zero
 * `pacing_streak incorrect=`. The caller admits a bare short answer as a
 * verification turn ONLY while a tutor question is open; on its own this
 * says nothing about whether anything was asked.
 *
 * Never: acknowledgements and yes/no fillers (ACK_ONLY_RE — a bare "yes"
 * cannot be told from "yes" to "ready?"), stuck cues, help requests,
 * questions, self-reports, conversational filler.
 */
export function isBareShortAnswer(studentText: string): boolean {
  const raw = (studentText || '').trim();
  if (!raw || raw.startsWith('[')) return false;
  if (ACK_ONLY_RE.test(raw) || SHORT_FILLER_RE.test(raw)) return false;
  if (INTERJECTION_RE.test(raw) || META_WORD_RE.test(raw) || REASON_LEAD_RE.test(raw) || WAIT_RE.test(raw)) return false;
  if (isLedgerStuckCue(raw) || HELP_REQUEST_RE.test(raw)) return false;
  if (isStudentQuestion(raw) || isSelfReport(raw)) return false;
  const t = raw.replace(ANSWER_FRAME_RE, '').replace(/[\s"'.!,?]+$/g, '').trim();
  if (!t) return false;
  if (CHOICE_ANSWER_RE.test(t)) return true;
  const tokens = t.split(/\s+/).filter(Boolean);
  if (tokens.length > BARE_SHORT_MAX_WORDS) return false;
  // A number or simple expression ("5", "-2", "3/4", "x > 5", "three").
  if (/\d/.test(spokenNumbersToDigits(t))) return true;
  if (CHATTER_WORD_RE.test(t)) return false;
  return /[a-z]/i.test(t);
}

/** Is this student utterance a plausible ANSWER (not a cue, not a request)?
 *  @param opts.turnShapeGate  false ⇒ questions and self-reports are not
 *    excluded (the behaviour before 2026-10-04). Unset ⇒ TUTOR_TURN_SHAPE_GATE. */
export function isAnswerAttempt(studentText: string, opts?: { turnShapeGate?: boolean }): boolean {
  const t = (studentText || '').trim();
  if (!t) return false;
  // Synthetic turns ("[validator feedback …]", "[start lesson]") are never
  // the student's answer.
  if (t.startsWith('[')) return false;
  const turnShapeGate = opts?.turnShapeGate ?? TUTOR_TURN_SHAPE_GATE;
  // With the gate on, a hedged proposed value ("I don't know, 5?") is not a
  // stuck cue — it is the answer attempt this function is looking for.
  if (isLedgerStuckCue(t, { hedgedValueIsAnswer: turnShapeGate })) return false;
  if (HELP_REQUEST_RE.test(t)) return false;
  if (ACK_ONLY_RE.test(t)) return false;
  // 2026-10-04: "how to solve: x>5 or x<3" carries digits and is not an
  // answer; "i do not know fractions operations well" is short and is not one
  // either. A proposed answer in question form ("is it 4?") is not a question
  // by this test.
  if (turnShapeGate && (isStudentQuestion(t) || isSelfReport(t))) return false;
  // A trailing "?" does not disqualify: "is it 4?" is an answer.
  if (MATH_SHAPE_RE.test(t)) return true;
  return t.split(/\s+/).filter(Boolean).length <= SHORT_ANSWER_MAX_WORDS;
}

/** Should this turn feed a ledger `wrong` event? */
export function inferWrongEvent(input: {
  studentText: string;
  tutorText: string;
  objectiveCorrect: boolean;
  /** Unset ⇒ TUTOR_TURN_SHAPE_GATE. */
  turnShapeGate?: boolean;
  /** Unset ⇒ TUTOR_CORRECTION_WIDENING. */
  widenedCorrection?: boolean;
  /** Unset ⇒ TUTOR_ACK_NOT_AFFIRM. */
  ackExclusion?: boolean;
}): boolean {
  if (input.objectiveCorrect) return false;
  if (!isAnswerAttempt(input.studentText, { turnShapeGate: input.turnShapeGate })) return false;
  const verdict = readPacingVerdict(input.tutorText, {
    studentText: input.studentText,
    widenedCorrection: input.widenedCorrection,
    ackExclusion: input.ackExclusion,
  });
  if (verdict.isCorrection) return true;
  return !verdict.isAffirm && LEDGER_CORRECTION_OPENER_RE.test(input.tutorText || '');
}
