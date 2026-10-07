/**
 * "Work it, then match" — the TEXT-mode reply to a proposed answer
 * (2026-10-06, third round on answer judging).
 *
 * Why. Replayed on 114 recorded answer-judging turns with thinking, the
 * turn-shape facts and the verdict pre-check all on, the tutor still made 12
 * errors — and almost all of them were in its OPENING VERDICT: a correct
 * hedged answer told "Not quite" (5 of 23), a bare "yes" met with "Right —"
 * (4 of 23), a wrong answer met with "Right —" (2 of 23). The explanation
 * that followed the opener was usually right. A verdict written as the first
 * word is decided before the working is on the page.
 *
 * The owner's decision: in text mode the tutor does not open with a denial,
 * an acceptance, credit or praise at all. It goes straight to the working —
 * works the step, states the result — and then says, as a fact, whether that
 * is what the student wrote.
 *
 * This module is the pure part, shared by the server and the browser:
 *   - the server switch and the per-turn rule block (it takes the place of
 *     `<verdict_guard>` on a text turn; the cached system prompt is shared
 *     with voice and is not touched, so the block says what it replaces);
 *   - the deterministic backstop the browser applies BEFORE display: a first
 *     sentence that is only a verdict is dropped; one fused with content is
 *     killed and retried once; after that its verdict phrase is cut;
 *   - the counting path: with no verdict opener, credit is not read off the
 *     tutor's words. A verified key, then a HIGH-confidence pre-check, then
 *     the tutor's explicit match statement — and a WRONG is never counted on
 *     the pre-check alone.
 *
 *   TUTOR_TEXT_WORK_THEN_MATCH   server; unset/anything ⇒ ON for text
 *                                sessions · 'off' ⇒ user content, events and
 *                                counting exactly as before. Voice: never.
 * The browser learns that the mode is on for a turn from the
 * `work-then-match` stream frame, so the server flag alone turns the whole
 * mode off; its own two switches (turn-round-flags.ts) default ON.
 *
 * Wording is generic — no subject content, no example values (repo rule).
 * Pure; never throws. `npm run test:work-then-match`.
 */
import { TUTOR_AMBIGUOUS_EXPRESSION_RULE, TUTOR_ECHO_ANSWER_NO_CREDIT, TUTOR_OPENER_STRIP_NOT_KILL, TUTOR_PRECHECK_ANSWER_CREDIT } from '@/lib/tutor/orchestrator/turn-round-flags';
import { openQuestionText } from '@/lib/tutor/voice/nonanswer-praise';
import { ACK_OPENER_RE } from '@/lib/tutor/voice/affirm-opener';
import { assentSettlesNothing, type TurnShape } from '@/lib/tutor/voice/turn-shape-signal';
import { precheckDecides, precheckInforms, type PublicVerdictPrecheck } from '@/lib/tutor/voice/verdict-precheck-shared';

/** On for a turn iff the session is text mode and the flag is not 'off'. */
export function textWorkThenMatchEnabled(
  inputMode: unknown,
  flag: string | undefined = process.env.TUTOR_TEXT_WORK_THEN_MATCH,
): boolean {
  return inputMode === 'text' && flag !== 'off';
}

// ── the per-turn rule ──────────────────────────────────────────────────────

/** The runtime's sorting says the message proposes nothing that could answer
 *  the open question: a bare yes / no / ok that settles nothing, a question or
 *  request of the student's own, a statement of not knowing. (A bare value is
 *  not in this list: whether it fits the question is for the model.) */
export function isNonAnswerShape(ts: TurnShape | null | undefined): boolean {
  if (!ts) return false;
  if (assentSettlesNothing(ts)) return true;
  return ts.shape === 'question' || ts.shape === 'request' || ts.shape === 'no_answer';
}

const REPLACES =
  'This is a TEXT session. For this reply the rule below REPLACES every instruction elsewhere about opening a turn with a verdict, an affirmation, praise or a corrective word (the affirmation cap, "the affirmation word must match your verdict", "lead with confirmation", corrective openers). What stays from those instructions is the checking behind them: work the answer out yourself before you say anything about theirs.\n';
const LENGTH =
  'Length: the same as any other turn — about thirty words in all, and never more than about forty-five. Do not restate what is already settled.\n';

/**
 * The rule block for a text turn. It is rendered where `<verdict_guard>` was
 * (same tag, directly above `<student_said>`), because it replaces that
 * guard's instructions about what the opener may say. '' for an empty or
 * runtime ("[…]") turn, like the guard.
 *
 * @param ts  the turn-shape read, when the runtime has one. For a message
 *   that proposes nothing (`isNonAnswerShape`) the block is the non-answer
 *   rule alone: the first replay answered the tutor's own open question on a
 *   bare "yes" — with no praise word, but with the working the full rule asks
 *   for on an answer.
 */
/** 2026-10-06b: an expression typed without brackets can be grouped more
 *  than one way; a correct answer must not be denied on one grouping. */
export const AMBIGUOUS_READING_TEXT_RULE =
  'When what they wrote can reasonably be read as more than one expression — typed without brackets, its parts can be grouped in more than one way — and one reasonable reading is what your working gives, it IS the value they gave: say that it matches, and put the intended form on the board written out in full so you are both looking at the same expression. If you cannot tell which reading they meant, ask which one they meant. Never tell a student they are wrong on the strength of one reading of something that can be read two ways.\n';

export function formatWorkThenMatchBlock(transcript: string, ts?: TurnShape | null): string {
  const t = (transcript ?? '').trim();
  if (!t || t.startsWith('[')) return '';
  if (isNonAnswerShape(ts)) {
    return '<verdict_guard>\n'
      + REPLACES
      + 'The message below does not propose an answer to your open question. So:\n'
      + '- No verdict of any kind: no acceptance, denial, credit or praise, as an opener or anywhere else in the reply.\n'
      + '- Your open question stays open and stays the student\'s to answer. Do NOT work it out for them, and do not state its result or any part of its result, in any phrasing — not as a summary, not as a "so", not as something for them to confirm.\n'
      + '- If their message was a bare yes, no or ok: restate or re-ask the open question in fewer words, or ask for one smaller first step of it. If the question offered alternatives, ask which one they mean.\n'
      + '- If their message was a question or a request of their own, or says they do not know: respond to that — answer what they asked, or guide them with one smaller step or a hint — and leave the answer to your open question with them.\n'
      + '- Never tell them their message "is not an answer", and never end or wrap up the session on it.\n'
      + LENGTH
      + 'Reason silently. Your first words are addressed to the student — never deliberation about this rule, the turn or the lesson state. Never refer to the student in the third person.\n'
      + '</verdict_guard>\n\n';
  }
  return '<verdict_guard>\n'
    + REPLACES
    + 'WORK IT, THEN MATCH. When the message below proposes an answer or a step — in any shape: stated in full, hedged or in question form, a statement of not knowing that goes on to propose something, a bare value, a request to check a value, a fact they ask you to confirm:\n'
    + 'FIRST, silently, decide what their value is an attempt AT. It is an attempt at your open question only if it is the kind of thing that question asks for; a value already settled earlier in the session (an earlier answer repeated, a given of the problem) is not a new attempt at anything. The working you show is only ever for the question their value is an attempt at. If it is not an attempt at your open question, you do not work that question and you do not state its result or any part of it: say in a few words what their value is, if you recognise it, and ask your question again — or ask what the value refers to.\n'
    + 'For a genuine attempt:\n'
    + '1. Do not begin with a verdict or praise word or phrase — no acceptance, denial, credit or praise of any kind before the working ("Right", "Exactly", "Yes", "Correct", "Good", "Nice", "Not quite", "Close", "Almost", "No", "Hmm" and their like).\n'
    + '2. Begin with the working itself: in one or two short sentences work the relevant step from the student\'s own problem and data, and state its result plainly.\n'
    + '3. Only then say whether that result matches what the student wrote, as a statement of fact tied to the result. When it matches: say that it is the value they gave. When it does not: say what they wrote, what the working gives, and which step the difference is in. An equivalent form, notation or phrasing is the same value. Uncertainty in how they said it is not wrongness.\n'
    + '4. Warmth is welcome AFTER the match is stated, never before it. Then one next step or question, as usual.\n'
    + 'When what they wrote does not match, your working goes as far as the step where theirs and yours part, and that step\'s result is what you state; the steps after it stay with the student.\n'
    + 'When their value is right as far as it goes but the question asks for more (one of several values that work, one bound of two, one part of several): say what it does satisfy and that the question asks for more, and ask for the rest. Do not supply the rest.\n'
    + 'When they gave the correct FINAL answer while a smaller step was open: show the remaining step or steps briefly, reach the result, and say that it is the value they gave and that it is the final answer. Do not send them back to the smaller step.\n'
    + 'When the message does not answer the open question — a bare yes or ok to a question that asks for a value or a choice, a value that is the wrong kind of thing for the question, a question or request of their own, a statement of not knowing with nothing proposed, conversation: no verdict of any kind, and do not work the open question out for them or state its result. Restate or re-ask the open question in fewer words, or take one smaller step with them, or respond to what they asked. Never tell them their message "is not an answer".\n'
    + 'Work from the student\'s own problem and data, not from a value stated earlier in the conversation: an earlier line — yours included — can be wrong, and if your working now shows that one of yours was, say so plainly and use the corrected value.\n'
    + (TUTOR_AMBIGUOUS_EXPRESSION_RULE ? AMBIGUOUS_READING_TEXT_RULE : '')
    + LENGTH.replace('Do not restate', 'The working is one or two short lines, not a derivation and not a lecture. Do not restate')
    + 'Reason silently. Your first words are addressed to the student — the working itself when their message proposed something — never deliberation about this rule, the turn or the lesson state, never an announcement that you are going to check. Never refer to the student in the third person.\n'
    + '</verdict_guard>\n\n';
}

// ── before display: a verdict or praise opener ─────────────────────────────

export type VerdictOpenerRead =
  | { kind: 'none' }
  /** The sentence is nothing but a verdict or praise ("Not quite.", "Right — that's it."). */
  | { kind: 'only'; opener: string }
  /** A verdict or praise phrase fused with content. `remainder` is the
   *  sentence without the phrase, or null when it cannot be cut cleanly. */
  | { kind: 'fused'; opener: string; remainder: string | null };

const LEAD = '^[*_~`\\s"\'“(]*(?:(?:hmm+|ah|oh|ok(?:ay)?|well)[,.!—–\\-\\s]+)?';

/** Phrases that are a verdict or praise wherever a separator follows them. */
const STRONG_PHRASES =
  '(?:yes|yep|yeah)\\s*[,.!—–-]+\\s*(?:exactly|that\'?s\\s+(?:right|it|correct)|correct|right|you\\s+got\\s+it|perfect|spot\\s+on)'
  + '|right\\s*,\\s*exactly'
  + '|(?:that(?:\'?s|\\s+is)\\s+)?(?:exactly|absolutely|totally)\\s+(?:right|correct)'
  + '|that(?:\'?s|\\s+is)\\s+(?:right|correct|it|exactly\\s+it)'
  + '|that\\s+works'
  + '|that(?:\'?s|\\s+is)\\s+not\\s+(?:quite\\s+)?(?:right|correct|it)|that(?:\'?s|\\s+is)\\s+(?:incorrect|wrong)'
  + '|you(?:\'?ve)?\\s+got\\s+it|you\\s+nailed\\s+it|nailed\\s+it|you\'?re\\s+(?:exactly\\s+|absolutely\\s+)?(?:right|correct)'
  + '|(?:nice|great|good|excellent|awesome|brilliant|fantastic|wonderful|lovely)\\s+(?:work|job|one|going|stuff)|nicely\\s+done|well\\s+done'
  + '|not\\s+(?:quite|exactly|really|yet|right|correct|there)|so\\s+close|nearly\\s+there|almost\\s+there'
  + '|exactly|correct|perfect|spot[\\s-]?on|bingo|excellent|brilliant|awesome|fantastic'
  + '|yes|yep|yeah|nope|no|incorrect|wrong|close|almost|nearly';
/** Words that are a verdict only when they stand alone or are set off by a
 *  dash, a full stop or an exclamation mark — after a comma they are ordinary
 *  discourse markers ("Right, so the next step…", "Good, so now…"). */
const WEAK_PHRASES = 'right|good|great|nice';
/** Praise or denial of the student's MOVE. An opener only when the student
 *  proposed an answer; "Good question." to a question is an acknowledgement. */
const MOVE_PHRASES =
  '(?:good|nice|great|fair|excellent|smart|sharp)\\s+(?:catch|thinking|thought|try|attempt|effort|guess|instincts?|idea|start|eye|call|observation|recall)';

const STRONG_RE = new RegExp(`${LEAD}(${STRONG_PHRASES})(?![\\w'’])`, 'i');
const WEAK_RE = new RegExp(`${LEAD}(${WEAK_PHRASES})(?![\\w'’])`, 'i');
const MOVE_RE = new RegExp(`${LEAD}(${MOVE_PHRASES})(?![\\w'’])`, 'i');

const END_RE = /^[\s.!…*_~`"'”)]*$/;
/** A separator that sets the phrase off from what follows. */
const HARD_SEP_RE = /^\s*(?:[—–]|-(?=\s)|--+|[.!…:;]+)\s*/;
const SOFT_SEP_RE = /^\s*,\s*/;
/** A connective left dangling once the phrase is cut. */
const DANGLING_RE = /^(?:(?:but|and|so|though|although|yet|because|since)\b[,\s]*)+/i;

function tidyRemainder(rest: string): string | null {
  let r = rest.replace(DANGLING_RE, '').trim();
  if (!r || !/[\p{L}\p{N}$\\]/u.test(r)) return null;
  // "…, and your conclusion is right" — a second connective after the cut.
  r = r.replace(DANGLING_RE, '').trim();
  if (!r) return null;
  // A sentence starts with a capital; mathematics and markup are left alone.
  if (/^[a-z]/.test(r) && !/^[a-z]\s*[=<>(]/.test(r)) r = r[0].toUpperCase() + r.slice(1);
  return r;
}

export interface VerdictOpenerOpts {
  answerShaped?: boolean;
  /** 2026-10-06b: also read a WEAK word set off by a comma ("Right,
   *  isolating … gives exactly that") as an opener when the student proposed
   *  an answer — it escaped the backstop. Only the text-mode backstop asks
   *  for this, and it only ever STRIPS the word (never a kill on its own:
   *  the remainder always stands alone or the sentence was only a verdict). */
  weakComma?: boolean;
}

/**
 * Read ONE sentence — the first of a reply — for a verdict or praise opener.
 * @param answerShaped  the student's message proposed an answer (praise of
 *   their move then counts as an opener too).
 */
export function readVerdictOpener(sentence: string, opts?: VerdictOpenerOpts): VerdictOpenerRead {
  const s = (sentence ?? '').trim();
  if (!s) return { kind: 'none' };
  let m: RegExpExecArray | null = null;
  let strength: 'strong' | 'weak' | 'move' = 'strong';
  const move = MOVE_RE.exec(s);
  if (move) {
    if (opts?.answerShaped !== true) return { kind: 'none' };
    m = move; strength = 'move';
  } else if (ACK_OPENER_RE.test(s)) {
    // "Good question", "Good point", "Good to know", "Thanks for telling me".
    return { kind: 'none' };
  } else if ((m = STRONG_RE.exec(s))) {
    strength = 'strong';
  } else if ((m = WEAK_RE.exec(s))) {
    strength = 'weak';
  }
  if (!m) return { kind: 'none' };
  const opener = m[1];
  const after = s.slice(m[0].length);
  if (END_RE.test(after)) return { kind: 'only', opener };
  const hard = HARD_SEP_RE.exec(after);
  const soft = hard ? null : SOFT_SEP_RE.exec(after);
  if (!hard && !soft) {
    if (strength === 'move') {
      // "Good catch on the numerator — …": the praise runs up to the first
      // separator; what follows it is the content.
      const cut = /\s(?:[—–]|-(?=\s)|--+)\s*|[.!:;,]\s+/.exec(after);
      if (!cut) return { kind: 'fused', opener, remainder: null };
      return fusedOrOnly(opener, after.slice(cut.index + cut[0].length), opts);
    }
    // A denial that runs on into its own clause ("Not quite what I asked — …")
    // is still a denial; it cannot be cut out of its sentence.
    if (/^not\s+(?:quite|exactly|really)$/i.test(opener.trim())) return { kind: 'fused', opener, remainder: null };
    // Any other word continuing the phrase makes it ordinary prose
    // ("Right now…", "Close the bracket", "Correct to two places", "No worries").
    return { kind: 'none' };
  }
  if (soft && strength === 'weak' && !(opts?.weakComma === true && opts?.answerShaped === true)) return { kind: 'none' };
  return fusedOrOnly(opener, after.slice((hard ?? soft)![0].length), opts);
}

function fusedOrOnly(opener: string, rest: string, opts?: VerdictOpenerOpts): VerdictOpenerRead {
  const remainder = tidyRemainder(rest);
  if (remainder === null) return { kind: 'only', opener };
  // "Right — that's it.", "Yes — exactly." are verdicts through and through.
  const inner = readVerdictOpener(remainder, opts);
  if (inner.kind === 'only') return { kind: 'only', opener };
  if (inner.kind === 'fused') return { kind: 'fused', opener, remainder: inner.remainder };
  return { kind: 'fused', opener, remainder };
}

/**
 * Does the opener backstop apply to this turn? Yes when the student's message
 * proposed an answer, or was a bare yes / no / ok that settles nothing. Not
 * on plain consent to an offer or a readiness check (the reply's "Great —
 * here we go" is chatter, not a verdict), and not on a runtime turn.
 */
export function backstopAppliesTo(ts: TurnShape | null): boolean {
  if (!ts) return false;
  if (ts.answerShaped) return true;
  if (ts.shape === 'bare_assent' || ts.shape === 'bare_dissent' || ts.shape === 'acknowledgment') {
    return assentSettlesNothing(ts) || (ts.open?.kind === 'yes_no' && ts.shape !== 'acknowledgment');
  }
  return ts.shape === 'check_request' || ts.shape === 'no_answer';
}

// ── 2026-10-06b: strip, do not kill ─────────────────────────────────────────
//
// portal-2de3c6c8 @415.7 s: "Right — at x=0, the blue line sits at y=4, and 0
// is below that…" — a CORRECT reply to an answer the pre-check had confirmed
// at high confidence — was killed for its opener. The retry took 9.5 s and
// was worse (it restated the wrong region). The verdict word is the only
// thing wrong with such a sentence, so the word is cut and the rest shown.

/** Does the pre-check (HIGH confidence) say the same as this opener? */
export function precheckAgreesWithOpener(p: PublicVerdictPrecheck | null | undefined, opener: string): boolean {
  if (!precheckDecides(p) || p.answers === 'neither') return false;
  const denying = /^(?:no|nope|not\b|close|so\s+close|almost|nearly|incorrect|wrong|that(?:'?s|\s+is)\s+(?:not|incorrect|wrong))/i.test((opener ?? '').trim());
  return denying ? p.verdict === 'incorrect' : (p.verdict === 'correct' && p.answers !== 'other_part');
}

export type OpenerFusedPlan =
  /** Cut the verdict phrase; show `remainder`. */
  | { action: 'cut'; remainder: string; why: 'clean_cut' | 'precheck_agrees' | 'kill_spent' }
  /** Reject the attempt and retry once with the rule named. */
  | { action: 'kill' }
  /** Nothing can be done safely: shown as written. */
  | { action: 'show'; why: 'precheck_agrees' | 'kill_spent' };

/**
 * What to do with a first sentence whose verdict phrase is FUSED with
 * content.
 *   - the phrase can be cut cleanly → cut it (no kill);
 *   - it cannot, but a HIGH-confidence pre-check agrees with it → shown as
 *     written (no kill);
 *   - it cannot, and nothing vouches for it → kill once, as before.
 * `stripNotKill` unset ⇒ TUTOR_OPENER_STRIP_NOT_KILL; false ⇒ the rule of
 * 2026-10-06 (kill first; cut only once the kill is spent).
 */
export function planFusedOpener(input: {
  opener: string;
  remainder: string | null;
  precheck: PublicVerdictPrecheck | null | undefined;
  /** A kill is still available for this turn. */
  killAvailable: boolean;
  stripNotKill?: boolean;
}): OpenerFusedPlan {
  const strip = input.stripNotKill ?? TUTOR_OPENER_STRIP_NOT_KILL;
  if (!strip) {
    if (input.killAvailable) return { action: 'kill' };
    return input.remainder ? { action: 'cut', remainder: input.remainder, why: 'kill_spent' } : { action: 'show', why: 'kill_spent' };
  }
  const agrees = precheckAgreesWithOpener(input.precheck, input.opener);
  if (input.remainder) return { action: 'cut', remainder: input.remainder, why: agrees ? 'precheck_agrees' : 'clean_cut' };
  if (agrees) return { action: 'show', why: 'precheck_agrees' };
  return input.killAvailable ? { action: 'kill' } : { action: 'show', why: 'kill_spent' };
}

// ── 2026-10-06b: a short answer in words still counts ───────────────────────
//
// portal-10beb4f5: "the side with origin" and "below the line" — right
// answers, confirmed by the pre-check at high confidence — were never counted:
// with no digit and fewer than six words the turn was not "a verification
// turn", and with more than three words it was not a "bare short answer".

/** The pre-check says this message ANSWERS the open question (or the problem
 *  being worked) and is right or wrong, at HIGH confidence — so the turn is
 *  an answer for counting, whatever its length. The credit itself is still
 *  `resolveMatchCredit`'s: correct → correct; incorrect counts only when the
 *  tutor's match statement agrees. */
export function precheckCountsAsAnswer(p: PublicVerdictPrecheck | null | undefined, opts?: { enabled?: boolean }): boolean {
  if (!(opts?.enabled ?? TUTOR_PRECHECK_ANSWER_CREDIT)) return false;
  if (!precheckDecides(p)) return false;
  return (p.answers === 'open_question' || p.answers === 'overall_problem') && (p.verdict === 'correct' || p.verdict === 'incorrect');
}

export interface OpenerBackstopResult {
  /** none — shown as written · strip — verdict-only opening sentence(s)
   *  dropped · kill — rejected and retried once · strip_prefix — the verdict
   *  phrase cut from a fused first sentence (the kill was already spent). */
  action: 'none' | 'strip' | 'kill' | 'strip_prefix';
  sentences: string[];
  opener?: string;
  /** How many verdict-only sentences opened the reply (the index of the
   *  sentence a kill was decided on). */
  at: number;
}

/**
 * The backstop on a whole reply (the browser applies the same reads sentence
 * by sentence while streaming; the replay harness calls this).
 * @param canKill  a kill-and-retry is still available for this turn.
 */
export function applyOpenerBackstop(
  sentences: ReadonlyArray<string>,
  ctx: { answerShaped: boolean; canKill: boolean },
): OpenerBackstopResult {
  const all = [...sentences];
  let i = 0;
  let opener: string | undefined;
  while (i < all.length) {
    const r = readVerdictOpener(all[i], { answerShaped: ctx.answerShaped });
    if (r.kind !== 'only') break;
    opener ??= r.opener;
    i++;
  }
  // Nothing but verdict sentences: the remainder does not stand on its own.
  if (i >= all.length) return { action: 'none', sentences: all, at: 0 };
  const rest = all.slice(i);
  const first = readVerdictOpener(rest[0], { answerShaped: ctx.answerShaped });
  if (first.kind === 'fused') {
    if (ctx.canKill) return { action: 'kill', sentences: all, opener: first.opener, at: i };
    if (first.remainder) return { action: 'strip_prefix', sentences: [first.remainder, ...rest.slice(1)], opener: first.opener, at: i };
  }
  return i > 0 ? { action: 'strip', sentences: rest, opener, at: i } : { action: 'none', sentences: all, at: 0 };
}

/**
 * Retry feedback via the standard rejection channel. Carries no value.
 * @param nonAnswer  the student's message proposed nothing (`isNonAnswerShape`).
 *   The feedback then asks only for a reply without the opener and without
 *   the answer: in the first replay the general wording ("begin with the
 *   working") turned a killed "Great — let's multiply it out … what do you
 *   get?" into a retry that worked the open question out for the student.
 */
export function openerBackstopFeedback(firstSentence: string, studentText: string, opts?: { nonAnswer?: boolean }): string {
  const head = `The student wrote "${(studentText ?? '').trim().slice(0, 120)}". Your reply opened with a verdict or praise phrase ("${(firstSentence ?? '').trim().slice(0, 60)}"). `
    + 'In this text session a reply never opens that way. ';
  const quiet = 'Do not mention this note or narrate the correction — just reply naturally.';
  if (opts?.nonAnswer === true) {
    return head
      + 'Their message does not answer the question you asked, so there is nothing to judge and nothing for you to work out: re-emit your response without any verdict or praise word, '
      + 'and without stating the result of your open question or any part of it — ask that question again in fewer words, or ask for one smaller first step of it. '
      + quiet;
  }
  return head
    + 'Re-emit your response under the rule "work it, then match": '
    + 'begin with the working itself — one or two short sentences from the student\'s own problem, ending in the result of that step — and only then say, as a fact, whether that result matches what they wrote '
    + '(if it does not: what they wrote, what the working gives, and the step where the difference is). '
    + 'If their message is not an attempt at the question you asked, give no verdict at all and do not answer that question for them: ask it again briefly or offer a smaller first step. '
    + 'No verdict or praise word before the working. ' + quiet;
}

// ── after display: the tutor's match statement ─────────────────────────────

export type MatchStatement = 'matches' | 'differs' | 'none';

const WROTE = '(?:wrote|gave|got|said|had|have|proposed|suggested|found|typed|answered|put|guessed)';
const THING = '(?:value|answer|result|number|expression|solution|interval|inequality|formula|equation|conclusion|one)';
/** "what you wrote", "the value you gave", "your answer", "your 15". */
const THEIRS = `(?:what\\s+you\\s+${WROTE}|the\\s+(?:${THING}\\s+)?you\\s+${WROTE}|the\\s+${THING}\\s+you\\s+${WROTE}|your\\b)`;

/** The working does NOT give what the student wrote. */
const DIFFERS_RE = new RegExp(
  '(?:does\\s+not|doesn\'?t|do\\s+not|don\'?t|did\\s+not|didn\'?t)\\s+(?:quite\\s+)?(?:match|agree|equal|line\\s+up)\\b'
  + `|\\b(?:not|isn\'?t|aren\'?t|wasn\'?t)\\s+(?:quite\\s+)?(?:the\\s+same\\s+as\\s+|equal\\s+to\\s+)?${THEIRS}`
  + `|\\bdiffers?\\s+from\\b|\\bdifferent\\s+(?:from|than|to)\\s+${THEIRS}`
  + `|\\b(?:rather\\s+than|instead\\s+of)\\s+${THEIRS}`
  + `|\\byou\\s+${WROTE}\\b(?:[^.?!]|\\.(?=\\d)){1,80}?(?:[;,:]|\\s[—–-]\\s|\\bbut\\b|\\bwhile\\b|\\band\\b)\\s*(?:but\\s+)?(?:the\\s+working|working\\s+it|the\\s+calculation|the\\s+step|the\\s+last\\s+step|that|this|it)\\b[^.?!]{0,30}?\\b(?:gives|comes\\s+to|comes\\s+out|is|leaves|yields|should\\s+be)\\b`
  + '|\\bthe\\s+(?:difference|slip|error|mistake)\\s+is\\b|\\b(?:the\\s+step\\s+that|where\\s+it)\\s+differs\\b|\\bthat\'?s\\s+the\\s+difference\\b',
  'i',
);
/** The working gives what the student wrote. */
const MATCHES_RE = new RegExp(
  `\\b(?:match(?:es|ing)?|agrees?\\s+with|agreeing\\s+with|lines?\\s+up\\s+with)\\s+(?:exactly\\s+)?${THEIRS}`
  + `|\\b(?:the\\s+)?same\\s+(?:${THING}\\s+)?as\\s+(?:${THEIRS}|you\\s+${WROTE})`
  + `|\\b(?:exactly|just|precisely|is|that\'?s|it\'?s|which\\s+is)\\s+what\\s+you\\s+${WROTE}\\b`
  + `|\\b(?:is|that\'?s|it\'?s|exactly|which\\s+is)\\s+the\\s+(?:very\\s+|exact\\s+|same\\s+)?${THING}\\s+you\\s+${WROTE}\\b`
  + `|\\b(?:just\\s+)?as\\s+you\\s+${WROTE}\\b`
  + `|\\byour\\s+(?:${THING}|[^.;,?!]{1,40}?)\\s+(?:matches|agrees|checks\\s+out|holds|is\\s+(?:right|correct))\\b`
  + '|\\byou\\s+(?:were|are)\\s+(?:right|correct)\\b',
  'i',
);
/** "…gives 30, not 15": a value set against another one. Counts as a
 *  difference only when the rejected value is one the student wrote. */
const NOT_VALUE_RE = /(?:,|\s[—–-])?\s*\bnot\s+((?:\$[^$]{1,40}\$|[^\s,.;:!?—–]+)(?:\s+(?:\$[^$]{1,40}\$|[^\s,.;:!?—–]+)){0,3})/gi;

function normValue(text: string): string {
  return (text || '').toLowerCase().replace(/\\[a-z]+|[*_~`${}\s\\]/g, '').replace(/−/g, '-').replace(/×/g, 'x');
}

function rejectsStudentValue(sentence: string, studentText: string): boolean {
  const student = normValue(studentText);
  if (!student) return false;
  NOT_VALUE_RE.lastIndex = 0;
  for (let m = NOT_VALUE_RE.exec(sentence); m; m = NOT_VALUE_RE.exec(sentence)) {
    const words = m[1].split(/\s+/);
    // The longest leading run of the rejected phrase that the student wrote.
    for (let n = words.length; n >= 1; n--) {
      const v = normValue(words.slice(0, n).join(' ')).replace(/^[("']+|[)"'.]+$/g, '');
      // A value: it carries a digit, an operator, or is a formula-like token.
      if (!v || !/[\d=<>+\-/^]/.test(v)) continue;
      const at = student.indexOf(v);
      if (at < 0) continue;
      // Whole value, not a digit inside a longer number ("3" in "30").
      const before = student[at - 1] ?? '', after = student[at + v.length] ?? '';
      if (/[\d.]/.test(before) && /^\d/.test(v)) continue;
      if (/\d/.test(after) && /\d$/.test(v)) continue;
      return true;
    }
  }
  return false;
}

/**
 * The tutor's explicit statement of whether its worked result is what the
 * student wrote. Only an unambiguous one is read: a question, a reply that
 * says both (one part matches, another does not; "matches …, but …"), or no
 * such statement at all is 'none'. The reply's opening verdict word, if any,
 * is NOT read.
 * @param studentText  the student's message; with it, "…gives 30, not 15" is
 *   read as a difference when 15 is a value they wrote.
 */
export function readMatchStatement(replyText: string, studentText?: string): MatchStatement {
  const text = (replyText ?? '').replace(/[*_~`]/g, '');
  if (!text.trim()) return 'none';
  let matches = false, differs = false;
  for (const raw of text.split(/(?<=[.!?…])\s+/)) {
    let s = raw.trim();
    if (!s) continue;
    if (/\?\s*$/.test(s)) {
      // A question asserts nothing — but a statement can run into one after
      // a dash ("That differs from your answer — want to try it again?").
      const cut = Math.max(s.lastIndexOf(' — '), s.lastIndexOf(' – '), s.lastIndexOf('; '));
      if (cut < 0) continue;
      s = s.slice(0, cut);
    }
    const d = DIFFERS_RE.exec(s);
    if (d || (studentText && rejectsStudentValue(s, studentText))) differs = true;
    // "does not match what you wrote" contains "match what you": a match is
    // read only in the part of the sentence before its denial.
    const head = d ? s.slice(0, d.index) : s;
    const m = MATCHES_RE.exec(head);
    if (m) {
      // "Your first part matches …, but the second gives …" is not a match.
      if (/\b(?:but|however|though|except)\b/i.test(s.slice(m.index + m[0].length))) { matches = true; differs = true; }
      else matches = true;
    }
  }
  if (matches === differs) return 'none';
  return matches ? 'matches' : 'differs';
}

// ── after display: counting ────────────────────────────────────────────────

// ── 2026-10-06c: an echo of the question's own options is not an answer ────
//
// portal-308e979f @332.0 s: "…the Supreme Court that struck down major
// programs — the NIRA and AAA — … Can you name one of those two programs the
// Court struck down?" → "The Agricultural Adjustment Act" → credited correct.
// The question handed the student the answer; repeating it shows nothing.

const ECHO_BACK_REFERENCE_RE = /\b(?:those|these|them|either|both|one\s+of|which\s+of|the\s+two|the\s+three|the\s+ones?)\b/i;
const ECHO_ASSENT_RE = /^(?:yes|yeah|yep|no|nope|ok|okay|sure|maybe|true|false)$/i;
const ECHO_SMALL_WORDS = new Set(['the', 'a', 'an', 'of', 'and', 'for', 'to', 'in', 'on']);
const ECHO_MAX_WORDS = 8;

function echoNorm(t: string): string {
  return ` ${String(t ?? '').toLowerCase().replace(/[$*_`"'“”‘’]/g, '').replace(/[^\p{L}\p{N}+\-=<>/.^ ]/gu, ' ')
    .replace(/(?<!\d)\.(?!\d)/g, ' ').replace(/\s+/g, ' ').trim()} `;
}

/**
 * Does the student's answer only repeat something the tutor's question just
 * named? The question sentence of the tutor's previous message — and, when it
 * points back ("one of those two"), the sentence before it — must contain the
 * answer (normalised: case, punctuation, a leading article), or an acronym in
 * it must be the initials of the answer ("Agricultural Adjustment Act" ↔
 * "AAA"). A long answer, a bare yes / no, or no question: false. Pure.
 */
export function echoesTutorQuestion(studentText: string, priorTutorTurn: string): boolean {
  const prior = String(priorTutorTurn ?? '').trim();
  const question = openQuestionText(prior);
  if (!question) return false;
  const answer = echoNorm(studentText).trim().replace(/^(?:the|a|an)\s+/, '');
  if (!answer || answer.length < 2 || ECHO_ASSENT_RE.test(answer)) return false;
  const words = answer.split(' ');
  if (words.length > ECHO_MAX_WORDS) return false;
  let scope = question;
  if (ECHO_BACK_REFERENCE_RE.test(question)) {
    const before = prior.slice(0, Math.max(0, prior.lastIndexOf(question))).trim();
    const sentences = before.split(/(?<=[.!?…])\s+/).filter(Boolean);
    if (sentences.length) scope = `${sentences[sentences.length - 1]} ${question}`;
  }
  if (echoNorm(scope).includes(` ${answer} `)) return true;
  // An acronym in the question that spells the answer's initials.
  const initials = String(studentText ?? '').replace(/^\s*(?:the|a|an)\s+/i, '').split(/\s+/)
    .filter((w) => w && !ECHO_SMALL_WORDS.has(w.toLowerCase()))
    .map((w) => w[0]).join('').toUpperCase();
  if (initials.length >= 2 && /^[A-Z]+$/.test(initials)) {
    const acronyms: string[] = scope.match(/\b[A-Z]{2,}\b/g) ?? [];
    if (acronyms.includes(initials)) return true;
  }
  return false;
}

export interface MatchCredit {
  credit: 'correct' | 'incorrect' | 'none';
  source: 'verified_key' | 'precheck' | 'match_statement' | 'echo' | 'none';
  /** A check and the tutor's match statement said opposite things — nothing
   *  is counted, and the caller emits a debug event. */
  disagreement: boolean;
}

/**
 * What the counting path records for a text turn under this mode. In order:
 *   1. a verified key (the existing deterministic paths);
 *   2. a HIGH-confidence pre-check — "correct" on its own; "incorrect" only
 *      when the tutor's match statement says the same (a wrong pre-check must
 *      not be able to mark a correct answer wrong by itself);
 *   3. the tutor's explicit match statement, when it is unambiguous and no
 *      available check says otherwise;
 *   4. nothing.
 * A check and a match statement that disagree count nothing either way.
 */
export function resolveMatchCredit(input: {
  /** A deterministic proof this turn that the answer was right. */
  objectiveCorrect?: boolean;
  /** A verified key the student's answer disagrees with. */
  verifiedWrong?: boolean;
  precheck: PublicVerdictPrecheck | null | undefined;
  match: MatchStatement;
  /** 2026-10-06c: the student's message and the tutor's previous message —
   *  an answer that only repeats what that question named earns no credit. */
  echo?: { studentText: string; priorTutorTurn: string };
  /** Unset ⇒ TUTOR_ECHO_ANSWER_NO_CREDIT. */
  echoNoCredit?: boolean;
}): MatchCredit {
  const credit = resolveMatchCreditBase(input);
  if (credit.credit === 'correct' && credit.source !== 'verified_key' && input.echo
      && (input.echoNoCredit ?? TUTOR_ECHO_ANSWER_NO_CREDIT)
      && echoesTutorQuestion(input.echo.studentText, input.echo.priorTutorTurn)) {
    return { credit: 'none', source: 'echo', disagreement: false };
  }
  return credit;
}

function resolveMatchCreditBase(input: {
  objectiveCorrect?: boolean;
  verifiedWrong?: boolean;
  precheck: PublicVerdictPrecheck | null | undefined;
  match: MatchStatement;
}): MatchCredit {
  if (input.objectiveCorrect === true) return { credit: 'correct', source: 'verified_key', disagreement: false };
  if (input.verifiedWrong === true) return { credit: 'incorrect', source: 'verified_key', disagreement: false };
  const p = input.precheck;
  const match = input.match;
  if (precheckDecides(p)) {
    // Not an answer to anything on the table; or right for a DIFFERENT part
    // from the one being worked (an earlier answer repeated is not credited
    // a second time). A wrong answer to another part is still a wrong answer.
    if (p.answers === 'neither') return { credit: 'none', source: 'precheck', disagreement: false };
    if (p.answers === 'other_part' && p.verdict === 'correct') return { credit: 'none', source: 'precheck', disagreement: false };
    if (p.verdict === 'correct') {
      return match === 'differs'
        ? { credit: 'none', source: 'none', disagreement: true }
        : { credit: 'correct', source: 'precheck', disagreement: false };
    }
    if (match === 'differs') return { credit: 'incorrect', source: 'precheck', disagreement: false };
    return { credit: 'none', source: 'none', disagreement: match === 'matches' };
  }
  if (match === 'none') return { credit: 'none', source: 'none', disagreement: false };
  // A check that informs without deciding (medium confidence) can still veto.
  const informing: PublicVerdictPrecheck | null = precheckInforms(input.precheck) ? input.precheck : null;
  if (informing) {
    if (informing.answers === 'neither') return { credit: 'none', source: 'none', disagreement: false };
    if (informing.answers === 'other_part' && informing.verdict === 'correct') return { credit: 'none', source: 'none', disagreement: false };
    // Partly right, or no single right answer: neither a correct nor a wrong.
    if (informing.verdict === 'partly_correct' || informing.verdict === 'cannot_determine') return { credit: 'none', source: 'none', disagreement: false };
    const says = informing.verdict === 'correct' ? 'matches' : informing.verdict === 'incorrect' ? 'differs' : null;
    if (says && says !== match) return { credit: 'none', source: 'none', disagreement: true };
  }
  return { credit: match === 'matches' ? 'correct' : 'incorrect', source: 'match_statement', disagreement: false };
}
