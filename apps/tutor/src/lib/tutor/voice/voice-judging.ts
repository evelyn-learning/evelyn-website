/**
 * Answer judging in VOICE sessions (2026-10-06) — the text-mode levers of the
 * same weekend (turn-shape facts, "work it, then match", the verdict
 * pre-check, the counting resolver), fitted to a turn that has to start
 * speaking about a second after the student stops.
 *
 * Why. The owner's live voice session of 2026-10-06 (22 min, homework help):
 * three correct answers were told "Not quite", one wrong answer was praised
 * with the answer given away, and three correct answers were counted as the
 * student's errors. A voice brain call runs with thinking disabled and the
 * prompt asks for a verdict in its second sentence — the verdict is spoken
 * before any working exists.
 *
 * What voice does differently from text, and why:
 *   - The pre-check cannot run BEFORE the brain call (text waits ~3 s for it;
 *     voice cannot). It runs IN PARALLEL: the brain starts at once, and the
 *     check's finding arrives as a stream frame while the reply is being
 *     spoken. So the first attempt's request never carries `<answer_check>`.
 *   - The browser therefore holds back only the sentence that carries a
 *     VERDICT on the student's answer (a denial, an affirmation, a match
 *     statement) — never the opener or the working — until the check returns
 *     or a deadline passes. If a HIGH-confidence check contradicts that
 *     sentence, the sentence is never spoken: the turn is cut there and
 *     continued once, with the checked fact, from what the student has
 *     already heard. Late, unsure or failed check ⇒ the reply as written.
 *   - The rule block is worded for speech (one short spoken sentence of
 *     working; the board carries the written line) and keeps the content-free
 *     opener the voice prompt requires, as a neutral runway.
 *
 * Switches — all SERVER-side, where the request is built (the route). Each is
 * ON unless its variable is 'off', except thinking, which is OFF unless 'on':
 *   TUTOR_VOICE_TURN_SHAPE                    `<turn_shape>` facts (no model call)
 *   TUTOR_VOICE_WORK_THEN_MATCH               the rule block + the `work-then-match` frame
 *   TUTOR_VOICE_VERDICT_PRECHECK              the parallel pre-check + its frames
 *   TUTOR_VOICE_VERDICT_PRECHECK_TIMEOUT_MS   its hard cap (default 3500)
 *   TUTOR_VOICE_THINKING                      'on' ⇒ low-effort thinking on every voice turn
 * They apply only to a voice request from a browser that announces it can act
 * on the frames (`voiceJudging: true` in the body). An older cached browser
 * sends no such field and gets the request it always got. With all of them
 * off the model request is the pre-existing voice request byte for byte
 * (scripts/replay-verdict-turns.ts `--print-voice-hash`).
 * The browser's own kill switch for the hold/cut is
 * NEXT_PUBLIC_TUTOR_VOICE_VERDICT_HOLD (turn-round-flags.ts).
 *
 * Thinking: NOT measured for voice (the owner called the replay off on
 * 2026-10-06). The cache key includes the thinking configuration for the
 * whole ~120K-token prefix (text-thinking.ts), so thinking cannot be toggled
 * per turn: 'on' means every voice turn, at about +1 s to first text as
 * measured in text mode. Default off. If it is ever turned on with the same
 * effort as text, voice and text sessions read the same tools+core cache
 * entry.
 *
 * Pure — no SDK import, no I/O; shared by the server and the browser.
 * Wording is generic — no subject content, no example values (repo rule).
 * `npm run test:voice-judging`.
 */
import { opensWithAffirmingVerdict } from '@/lib/tutor/voice/nonanswer-praise';
import { assentSettlesNothing, type TurnShape } from '@/lib/tutor/voice/turn-shape-signal';
import {
  opensWithDenial,
  precheckDecides,
  type PrecheckContradiction,
  type PublicVerdictPrecheck,
} from '@/lib/tutor/voice/verdict-precheck-shared';
import { isNonAnswerShape, readMatchStatement, readVerdictOpener } from '@/lib/tutor/voice/work-then-match';

// ── server switches ────────────────────────────────────────────────────────

/** A voice request from a browser that can act on the voice frames. */
export function isVoiceJudgingRequest(inputMode: unknown, capable: unknown): boolean {
  return inputMode !== 'text' && capable === true;
}

export function voiceTurnShapeEnabled(
  inputMode: unknown,
  capable: unknown,
  flag: string | undefined = process.env.TUTOR_VOICE_TURN_SHAPE,
): boolean {
  return isVoiceJudgingRequest(inputMode, capable) && flag !== 'off';
}

export function voiceWorkThenMatchEnabled(
  inputMode: unknown,
  capable: unknown,
  flag: string | undefined = process.env.TUTOR_VOICE_WORK_THEN_MATCH,
): boolean {
  return isVoiceJudgingRequest(inputMode, capable) && flag !== 'off';
}

export function voiceVerdictPrecheckEnabled(
  inputMode: unknown,
  capable: unknown,
  flag: string | undefined = process.env.TUTOR_VOICE_VERDICT_PRECHECK,
): boolean {
  return isVoiceJudgingRequest(inputMode, capable) && flag !== 'off';
}

/** Default OFF (see the header): on only when the variable is exactly 'on'. */
export function voiceThinkingEnabled(
  inputMode: unknown,
  capable: unknown,
  flag: string | undefined = process.env.TUTOR_VOICE_THINKING,
): boolean {
  return isVoiceJudgingRequest(inputMode, capable) && flag === 'on';
}

/** Hard cap on the parallel pre-check. Not measured on voice turns: taken
 *  from the text-mode replay of 2026-10-06 (the same call; completed checks
 *  p50 2.6 s, p90 3.3 s — verdict-precheck.ts). About nine in ten finish
 *  inside it; the rest are cut and the reply is spoken as written. */
export const VOICE_VERDICT_PRECHECK_TIMEOUT_MS = 3500;

export function voiceVerdictPrecheckTimeoutMs(
  env: string | undefined = process.env.TUTOR_VOICE_VERDICT_PRECHECK_TIMEOUT_MS,
): number {
  const n = Number(env);
  return Number.isFinite(n) && n >= 500 && n <= 8000 ? Math.round(n) : VOICE_VERDICT_PRECHECK_TIMEOUT_MS;
}

/** A voice thinking iteration that has shown nothing after this long is
 *  re-issued without thinking (text waits 14 s; a spoken turn cannot). */
export const VOICE_THINKING_DEADLINE_MS = 3000;

/** The browser's own bound on a verdict hold, measured from the moment the
 *  request was sent: the server cap plus room for the frame to travel. The
 *  server always sends a closing frame by its cap, so this only matters when
 *  that frame is lost. A held sentence is never released later than this. */
export const VOICE_VERDICT_HOLD_DEADLINE_MS = VOICE_VERDICT_PRECHECK_TIMEOUT_MS + 400;

// ── the per-turn rule, worded for speech ───────────────────────────────────

const VOICE_REPLACES =
  'This is a VOICE session. For this reply the rule below REPLACES every instruction elsewhere about opening a turn with a verdict, an affirmation, praise or a corrective word (the affirmation cap, "the affirmation word must match your verdict", "lead with confirmation", corrective openers, and the wording the answer-validation gate prescribes for an answer that does not match). What stays from those instructions is the checking behind them: work the answer out yourself before you say anything about theirs.\n'
  + 'The short opener sentence your instructions require at the start of a reply stays, as a runway and nothing else: it must be neutral — a phrase that would fit equally whether the answer turns out right or wrong. It carries no verdict, no praise, no denial and no hint of either, and no sentence that is only a verdict follows it.\n';
const VOICE_LENGTH =
  'Length: the same as any other spoken turn — the opener, the working, the match, one next step or question. Do not restate what is already settled.\n';
const VOICE_SPEECH =
  'You are SPEAKING. The working is ONE short sentence a person can follow by ear: name the step and say its result. Never read a long expression aloud symbol by symbol — if the line is worth seeing, put it on the board with a whiteboard tool and point to it in a few words; the board carries the written working, your voice carries the step and the result.\n';
const VOICE_CLOSE =
  'Reason silently. Your words are addressed to the student — never deliberation about this rule, the turn or the lesson state, never an announcement that you are going to check. Never refer to the student in the third person.\n';

/**
 * The voice rule block. Rendered where `<verdict_guard>` was (same tag,
 * directly above `<student_said>`). '' for an empty or runtime ("[…]") turn.
 * @param ts  the turn-shape read; a message that proposes nothing gets the
 *   non-answer rule alone (see work-then-match.ts `formatWorkThenMatchBlock`).
 */
export function formatVoiceWorkThenMatchBlock(transcript: string, ts?: TurnShape | null): string {
  const t = (transcript ?? '').trim();
  if (!t || t.startsWith('[')) return '';
  if (isNonAnswerShape(ts)) {
    return '<verdict_guard>\n'
      + VOICE_REPLACES
      + 'What the student just said does not propose an answer to your open question. So:\n'
      + '- No verdict of any kind: no acceptance, denial, credit or praise, as an opener or anywhere else in the reply.\n'
      + '- Your open question stays open and stays the student\'s to answer. Do NOT work it out for them, and do not state its result or any part of its result, in any phrasing — not as a summary, not as a "so", not as something for them to confirm.\n'
      + '- If they said a bare yes, no or ok: restate or re-ask the open question in fewer words, or ask for one smaller first step of it. If the question offered alternatives, ask which one they mean.\n'
      + '- If they asked a question or made a request of their own, or said they do not know: respond to that — answer what they asked, or guide them with one smaller step or a hint — and leave the answer to your open question with them.\n'
      + '- Never tell them that what they said "is not an answer", and never end or wrap up the session on it.\n'
      + VOICE_LENGTH
      + VOICE_CLOSE
      + '</verdict_guard>\n\n';
  }
  return '<verdict_guard>\n'
    + VOICE_REPLACES
    + 'WORK IT, THEN MATCH. When what the student just said proposes an answer or a step — in any shape: stated in full, hedged or in question form, a statement of not knowing that goes on to propose something, a bare value, a request to check a value, a fact they ask you to confirm:\n'
    + 'FIRST, silently, decide what their value is an attempt AT. It is an attempt at your open question only if it is the kind of thing that question asks for; a value already settled earlier in the session (an earlier answer repeated, a given of the problem) is not a new attempt at anything. The working you say is only ever for the question their value is an attempt at. If it is not an attempt at your open question, you do not work that question and you do not state its result or any part of it: say in a few words what their value is, if you recognise it, and ask your question again — or ask what the value refers to.\n'
    + 'For a genuine attempt:\n'
    + '1. After the neutral opener, do not say a verdict or praise word or phrase — no acceptance, denial, credit or praise of any kind before the working.\n'
    + '2. Say the working: one short sentence that works the relevant step from the student\'s own problem and data and states its result plainly.\n'
    + '3. Only then say whether that result matches what the student said, as a statement of fact tied to the result, in a sentence of its own. When it matches: say that it is the value they gave. When it does not: say what they said, what the working gives, and which step the difference is in. An equivalent form, notation or phrasing is the same value — including a value spoken in words. Uncertainty in how they said it is not wrongness.\n'
    + '4. Warmth is welcome AFTER the match is stated, never before it. Then one next step or question, as usual.\n'
    + 'When what they said does not match, your working goes as far as the step where theirs and yours part, and that step\'s result is what you state; the steps after it stay with the student.\n'
    + 'When their value is right as far as it goes but the question asks for more (one of several values that work, one bound of two, one part of several): say what it does satisfy and that the question asks for more, and ask for the rest. Do not supply the rest.\n'
    + 'When they gave the correct FINAL answer while a smaller step was open: say the remaining step briefly, reach the result, and say that it is the value they gave and that it is the final answer. Do not send them back to the smaller step.\n'
    + 'When what they said does not answer the open question — a bare yes or ok to a question that asks for a value or a choice, a value that is the wrong kind of thing for the question, a question or request of their own, a statement of not knowing with nothing proposed, conversation: no verdict of any kind, and do not work the open question out for them or state its result. Restate or re-ask the open question in fewer words, or take one smaller step with them, or respond to what they asked. Never tell them that what they said "is not an answer".\n'
    + 'Work from the student\'s own problem and data, not from a value stated earlier in the conversation: an earlier line — yours included — can be wrong, and if your working now shows that one of yours was, say so plainly and use the corrected value.\n'
    + 'The student\'s words reach you through speech recognition: a value can arrive spelled out, split across words or slightly garbled. Read it as the value a person would have meant by those sounds before you compare.\n'
    + VOICE_SPEECH
    + VOICE_LENGTH
    + VOICE_CLOSE
    + '</verdict_guard>\n\n';
}

// ── the browser: which sentence carries a verdict ──────────────────────────

export type VerdictStance = 'affirm' | 'deny';

/** A denial word as read by `readVerdictOpener` (its phrase list mixes both). */
const DENYING_OPENER_RE = /^(?:no|nope|not\b|close|so\s+close|almost|nearly|incorrect|wrong|that(?:'?s|\s+is)\s+(?:not|incorrect|wrong))/i;

/** A verdict on the student's answer stated inside a sentence rather than at
 *  its start ("…so that is not quite right", "…which is correct"). Explicit
 *  phrases only: "<something> is right" on its own is ordinary teaching prose
 *  ("your setup is right, but…" is partial credit and reads as neither). */
const INLINE_DENY_RE =
  /\b(?:(?:that|this|it|which)(?:'?s|\s+is|\s+was)\s+(?:not\s+(?:quite\s+)?(?:right|correct|it)\b|incorrect\b|wrong\b)|(?:that|this|it)\s+(?:isn'?t|wasn'?t)\s+(?:quite\s+)?(?:right|correct)\b|not\s+quite\s+(?:right|correct|there)\b)/i;
const INLINE_AFFIRM_RE =
  /\b(?:(?:that|this|which)(?:'?s|\s+is|\s+was)\s+(?:exactly\s+|absolutely\s+)?(?:right|correct)\b|you(?:'?re|\s+are|\s+were)\s+(?:exactly\s+|absolutely\s+)?(?:right|correct)\b|you(?:'?ve)?\s+got\s+it\b|you\s+had\s+it\b|spot\s+on\b|exactly\s+right\b)/i;
/** An affirmation the opener readers leave alone because a comma follows the
 *  first word ("Right, that's it."), and praise for the answer placed after
 *  the statement ("…, nicely spotted."). */
const COMMA_AFFIRM_RE =
  /^[*_~`\s"'“(]*(?:right|yes|yep|yeah|good|great|nice)\s*,\s*(?:that(?:'?s|\s+is)\s+(?:exactly\s+)?it\b|exactly\b|it\s+checks\s+out\b|you(?:'?ve)?\s+got\s+it\b|that(?:'?s|\s+is)\s+(?:right|correct)\b)/i;
/** A match statement about a thing the shared reader has no word for ("the
 *  point you gave", "the region you described"): the result set against what
 *  the student said, with up to two words naming it. */
const SAID = '(?:gave|said|got|had|found|proposed|suggested|guessed|described|named|picked|chose)';
const SPOKEN_DIFFERS_RE = new RegExp(
  `\\b(?:not|isn'?t|wasn'?t|doesn'?t\\s+(?:match|give))\\s+(?:quite\\s+)?(?:what|the\\s+(?:[\\w-]+\\s+){0,2})you\\s+${SAID}\\b`, 'i');
const SPOKEN_MATCHES_RE = new RegExp(
  `\\b(?:exactly|just|precisely|is|that'?s|it'?s|which\\s+is|matches)\\s+(?:exactly\\s+)?the\\s+(?:[\\w-]+\\s+){0,2}you\\s+${SAID}\\b`, 'i');
const TRAILING_PRAISE_RE =
  /\b(?:(?:nicely|well)\s+(?:spotted|done|worked\s+out)|(?:nice|good|great)\s+(?:work|job)\s+(?:spotting|finding|working)\b)/i;

/**
 * Does this ONE sentence carry a verdict on the student's answer — a denial,
 * an affirmation, or a statement that the worked result is / is not what they
 * said? Null for an opener phrase, working, teaching or a question.
 * A sentence that says both ("that part is right, but …") is null: it is not
 * the kind of sentence a check can contradict.
 */
export function sentenceVerdictStance(sentence: string, studentText?: string): VerdictStance | null {
  const s = (sentence ?? '').replace(/[*_~`]/g, '').trim();
  if (!s) return null;
  // The opening word or phrase — read even when the sentence ends in a
  // question ("Not quite — what does the left side come to?").
  if (opensWithDenial(s)) return 'deny';
  if (opensWithAffirmingVerdict(s)) return 'affirm';
  const opener = readVerdictOpener(s, { answerShaped: true });
  if (opener.kind !== 'none') return DENYING_OPENER_RE.test(opener.opener.trim()) ? 'deny' : 'affirm';
  const match = readMatchStatement(s, studentText);
  if (match === 'matches') return 'affirm';
  if (match === 'differs') return 'deny';
  // A plain question asserts nothing.
  if (/\?\s*$/.test(s) && !/\s[—–]\s|;\s/.test(s)) return null;
  const deny = INLINE_DENY_RE.test(s) || SPOKEN_DIFFERS_RE.test(s);
  const affirm = !deny && (INLINE_AFFIRM_RE.test(s) || COMMA_AFFIRM_RE.test(s) || TRAILING_PRAISE_RE.test(s) || SPOKEN_MATCHES_RE.test(s));
  if (deny && /\b(?:actually|after\s+all)\b/i.test(s)) return null; // a reversal inside one sentence: other guards own it
  return deny ? 'deny' : affirm ? 'affirm' : null;
}

/** Does a verdict sentence of this stance contradict a deciding check? */
export function stanceContradictsPrecheck(
  p: PublicVerdictPrecheck | null | undefined,
  stance: VerdictStance | null,
): PrecheckContradiction | null {
  if (!stance || !precheckDecides(p)) return null;
  if (p.answers === 'neither') return stance === 'affirm' ? 'praised_non_answer' : null;
  // Right for a DIFFERENT problem or part: a denial about the question that
  // was actually asked is not a contradiction.
  if (p.verdict === 'correct') return stance === 'deny' && p.answers !== 'other_part' ? 'denied_correct' : null;
  return stance === 'affirm' ? 'praised_incorrect' : null;
}

/** A spoken statement that opens on a condition ("when it is …, then …",
 *  "if you put …, it becomes …") arrives from speech recognition with no
 *  question mark, and the text sorter reads its first word as a question
 *  word. In a voice session it is an answer in prose. Narrow on purpose: a
 *  conditional lead, no question mark anywhere, longer than a short query. */
const CONDITIONAL_LEAD_RE =
  /^(?:(?:um+|uh+|er+|hmm+|so|well|okay|ok|oh|yeah|yes|and|but|like)[,.\s]+)*(?:when(?:ever)?|if|while|once)\b/i;
const SPOKEN_STATEMENT_MIN_WORDS = 9;

/** The turn shape as a VOICE session should read it (see above). The text
 *  sorter's result is returned unchanged in every other case. */
export function adjustTurnShapeForSpeech(ts: TurnShape | null, studentText: string): TurnShape | null {
  if (!ts || ts.shape !== 'question') return ts;
  const t = (studentText ?? '').trim();
  if (t.includes('?') || !CONDITIONAL_LEAD_RE.test(t)) return ts;
  if (t.split(/\s+/).filter(Boolean).length < SPOKEN_STATEMENT_MIN_WORDS) return ts;
  return { ...ts, shape: 'answer', answerShaped: true };
}

/** Should the hold be armed for this turn at all? The server only starts a
 *  check on an answer-shaped message; this is the browser's own read, used to
 *  stay inert on a bare yes / a question even if a frame were mis-sent. */
export function voiceHoldAppliesTo(ts: TurnShape | null, studentText?: string): boolean {
  const shape = adjustTurnShapeForSpeech(ts, studentText ?? '');
  if (!shape) return false;
  return shape.answerShaped && !assentSettlesNothing(shape);
}

// ── the browser: hold / release / cut ──────────────────────────────────────

/** Where the reply stood when a sentence arrived — the caller's own
 *  bookkeeping, handed back on a cut so it can trim to what was heard. */
export interface VoiceSentenceMark {
  /** Length of the attempt's accumulated text BEFORE this sentence. */
  textLen: number;
  /** Length of the chat-reveal text BEFORE this sentence. */
  revealLen: number;
  /** Count of the attempt's sentences BEFORE this one. */
  sentenceIndex: number;
}

export interface VoiceVerdictCut {
  kind: PrecheckContradiction;
  /** The sentence that was withheld (display form). */
  sentence: string;
  /** The same sentence in the form handed to the speaker. */
  speech: string;
  mark: VoiceSentenceMark;
  /** Held sentences that come BEFORE the withheld one and are to be spoken
   *  now (an earlier verdict sentence the check agrees with, and what
   *  followed it). */
  speakFirst: string[];
}

export type VoiceEmitDecision =
  /** Hand the sentence to the speaker now. */
  | { action: 'speak' }
  /** Keep it out of the speaker; the gate holds it (in order). */
  | { action: 'hold' }
  /** Never spoken: the turn is cut here (returned once). */
  | { action: 'cut'; cut: VoiceVerdictCut }
  /** The turn was already cut: this sentence is dropped. */
  | { action: 'drop' };

export type VoiceSettleDecision =
  | { action: 'none' }
  /** Speak these held sentences, in order. */
  | { action: 'release'; sentences: string[]; why: 'precheck' | 'deadline' | 'stream_end' }
  | { action: 'cut'; cut: VoiceVerdictCut };

interface Recorded { display: string; speech: string; stance: VerdictStance | null; mark: VoiceSentenceMark }

/**
 * The state machine the browser runs for ONE attempt of a voice turn.
 *
 *   onPending()            the server says a check of this message is running
 *   onSentence(…)          every reply sentence as it ARRIVES (stream order)
 *   onEmit(speech)         every sentence as it is about to reach the speaker
 *   onPrecheck(result)     the check's finding arrived (null ⇒ none / unsure)
 *   onDeadline()           the hold's deadline passed
 *   onStreamEnd()          the reply is complete
 *
 * Rules it enforces:
 *   - nothing is held unless a check is pending AND the sentence carries a
 *     verdict; the opener and the working are never held;
 *   - once a verdict sentence is held, the sentences after it queue behind it
 *     (order is kept — they are not spoken ahead of it);
 *   - a HIGH-confidence check that contradicts a held or not-yet-spoken
 *     verdict sentence cuts the turn at that sentence, once; the sentence and
 *     everything after it are never spoken;
 *   - anything else — an agreeing check, an unsure one, none, a late one, the
 *     deadline — releases what is held, in order, exactly once.
 * It never speaks anything itself and never repeats a sentence: each one
 * leaves through exactly one of speak / release / cut / drop.
 */
export class VoiceVerdictGate {
  private pending = false;
  private settled = false;
  private precheck: PublicVerdictPrecheck | null = null;
  private wasCut = false;
  private readonly recorded: Recorded[] = [];
  private readonly held: Recorded[] = [];
  private readonly enabled: boolean;
  private readonly studentText: string;

  constructor(opts: { enabled: boolean; studentText: string }) {
    this.enabled = opts.enabled;
    this.studentText = opts.studentText ?? '';
  }

  /** A check is running and has not reported. */
  get awaiting(): boolean { return this.enabled && this.pending && !this.settled; }
  get holding(): boolean { return this.held.length > 0; }
  get cutDone(): boolean { return this.wasCut; }
  get heldCount(): number { return this.held.length; }

  onPending(): void {
    if (this.enabled && !this.settled) this.pending = true;
  }

  /** Stream order. Returns the stance read for the sentence. */
  onSentence(display: string, speech: string, mark: VoiceSentenceMark): VerdictStance | null {
    if (!this.enabled || this.wasCut) return null;
    const stance = sentenceVerdictStance(display, this.studentText);
    this.recorded.push({ display, speech, stance, mark });
    return stance;
  }

  private find(speech: string): Recorded | undefined {
    // The earliest recorded sentence with this speech form that has not left.
    return this.recorded.find((r) => r.speech === speech && !this.held.includes(r));
  }

  private leave(r: Recorded): void {
    const i = this.recorded.indexOf(r);
    if (i >= 0) this.recorded.splice(i, 1);
  }

  private cutAt(r: Recorded, kind: PrecheckContradiction, speakFirst: Recorded[]): VoiceVerdictCut {
    this.wasCut = true;
    for (const s of speakFirst) this.leave(s);
    this.held.length = 0;
    this.recorded.length = 0;
    return { kind, sentence: r.display, speech: r.speech, mark: r.mark, speakFirst: speakFirst.map((s) => s.speech) };
  }

  onEmit(speech: string): VoiceEmitDecision {
    if (!this.enabled) return { action: 'speak' };
    if (this.wasCut) return { action: 'drop' };
    const r = this.find(speech);
    if (!r) {
      // Not announced through onSentence (never expected): order still holds.
      if (!this.holding) return { action: 'speak' };
      const adHoc: Recorded = { display: speech, speech, stance: null, mark: { textLen: 0, revealLen: 0, sentenceIndex: 0 } };
      this.recorded.push(adHoc);
      this.held.push(adHoc);
      return { action: 'hold' };
    }
    if (this.holding) {
      this.held.push(r);
      return { action: 'hold' };
    }
    if (r.stance) {
      if (this.settled) {
        // The check is in: a verdict sentence that contradicts it is cut
        // before it is spoken; any other is spoken as written.
        const kind = stanceContradictsPrecheck(this.precheck, r.stance);
        if (kind) return { action: 'cut', cut: this.cutAt(r, kind, []) };
      } else if (this.pending) {
        this.held.push(r);
        return { action: 'hold' };
      }
    }
    this.leave(r);
    return { action: 'speak' };
  }

  private releaseAll(why: 'precheck' | 'deadline' | 'stream_end'): VoiceSettleDecision {
    if (!this.holding) return { action: 'none' };
    const out = this.held.splice(0, this.held.length);
    for (const r of out) this.leave(r);
    return { action: 'release', sentences: out.map((r) => r.speech), why };
  }

  /** The check reported. `null` ⇒ it failed, timed out or was unsure. */
  onPrecheck(result: PublicVerdictPrecheck | null): VoiceSettleDecision {
    if (!this.enabled || this.wasCut) return { action: 'none' };
    this.settled = true;
    this.precheck = result;
    if (!this.holding) return { action: 'none' };
    const at = this.held.findIndex((r) => stanceContradictsPrecheck(result, r.stance) !== null);
    if (at < 0) return this.releaseAll('precheck');
    const r = this.held[at];
    const kind = stanceContradictsPrecheck(result, r.stance)!;
    return { action: 'cut', cut: this.cutAt(r, kind, this.held.slice(0, at)) };
  }

  /** The deadline passed with no report: speak what was held, as written.
   *  A report that arrives afterwards can still cut a verdict sentence that
   *  has not been spoken yet, and still feeds the counting path. */
  onDeadline(): VoiceSettleDecision {
    if (!this.enabled || this.wasCut) return { action: 'none' };
    this.pending = false;
    return this.releaseAll('deadline');
  }

  /** The reply is complete. If a check is still awaited the hold stays (the
   *  server sends its closing frame before `done`; the deadline bounds it). */
  onStreamEnd(): VoiceSettleDecision {
    if (!this.enabled || this.wasCut || this.awaiting) return { action: 'none' };
    return this.releaseAll('stream_end');
  }
}

// ── the continuation after a cut ───────────────────────────────────────────

/** Rejection action for "a verdict sentence was withheld — continue the turn"
 *  (validator-feedback.ts renders it without the tool-call boilerplate).
 *  Not prefixed `show_`: the give-up path treats those as render failures. */
export const VOICE_VERDICT_WITHHELD_ACTION = 'voice_verdict_withheld';

function clipQuote(s: string, max: number): string {
  return (s ?? '').replace(/\s+/g, ' ').replace(/"/g, '”').trim().slice(0, max);
}

/**
 * What the brain is told when its verdict sentence was withheld. The assistant
 * turn in front of this message holds exactly what the student HEARD, so the
 * continuation picks up from there and repeats none of it. Carries no value:
 * the checked finding rides in `<answer_check>` (the public form).
 */
export function voiceVerdictWithheldFeedback(input: {
  kind: PrecheckContradiction;
  precheck: PublicVerdictPrecheck;
  studentText: string;
  /** What of this reply the student has heard ('' ⇒ nothing yet). */
  heardText: string;
  withheldSentence: string;
}): string {
  const named = input.precheck.target ? ` (${clipQuote(input.precheck.target, 160)})` : '';
  const said = `The student said "${clipQuote(input.studentText, 160)}".`;
  const heard = input.heardText.trim()
    ? ' The reply you had begun is your message just above: the student HEARD all of it, and nothing after it.'
    : ' None of your reply had been spoken yet.';
  const withheld = ` Your next sentence ("${clipQuote(input.withheldSentence, 140)}") was withheld before it was spoken, because an independent check of what the student said `;
  const found = input.kind === 'denied_correct'
    ? (input.precheck.answers === 'open_question'
      ? `found it CORRECT for the question you asked${named}, and that sentence denied it.`
      : `found it is the CORRECT answer to the problem being worked${named} — they answered the problem rather than the smaller step you had asked about — and that sentence denied it.`)
    : input.kind === 'praised_incorrect'
      ? `found it INCORRECT for the question it answers${named}, and that sentence accepted it.`
      : `found that it does NOT answer the question you asked, nor the problem being worked, and that sentence accepted it as if it did.`;
  const how = input.heardText.trim()
    ? ' Continue the SAME reply from exactly where the heard part stops. Do not repeat or rephrase anything in it, no new opener phrase, no greeting, and do not re-emit a whiteboard tool call for anything already on the board.'
    : ' Begin the reply again, without that sentence.';
  const what = input.kind === 'denied_correct'
    ? ' Say in one short sentence that the working gives the value they gave — that they have it right — and then one next step or question.'
    : input.kind === 'praised_incorrect'
      ? ' Say in one short sentence, plainly and kindly, that the working does not give what they said, name the step to look at again without giving its result away, and ask them to try that step.'
      : ' Give no verdict of any kind and do not answer your own question for them: ask it again in fewer words, or ask what their value refers to.';
  return said + heard + withheld + found + how + what
    + ' If your own working still disagrees with the check, state no match either way and ask them to show how they got it.'
    + ' Do not mention the check or this note, and do not narrate a correction — the student heard no mistake. Don\'t apologize; the student doesn\'t see this message.';
}
