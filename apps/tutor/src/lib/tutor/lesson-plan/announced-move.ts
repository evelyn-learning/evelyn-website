/**
 * Task 16 (GDI live, embed-1793326847152): in a fixed-script lesson the brain
 * said `Yes, that's correct. … Now let's move on to the open conversation.`
 * with no tool call (it never calls advance_lesson) and no question. The
 * pointer stayed on the old part, 37 s of silence followed, and the idle
 * nudge re-asked the OLD part's question. A sentence that announces a move
 * into the NEXT segment — named by that segment's own authored label /
 * localized label / title / id — moves the pointer like the turn-budget rule.
 *
 * Generic: keyed only on the plan's own segment metadata; any fixed-script
 * plan gets it, every other plan returns null. Never a jump — only the
 * segment `nextSegmentId` returns. The caller skips it when the brain's own
 * advance_lesson ran this turn.
 */
import type { LessonPlan, Segment } from './types';
import { isFixedScriptPlan, nextSegmentId, fixedScriptCloseForced, FIXED_SCRIPT_CLOSE_WRAP_SILENCE_MS, FIXED_SCRIPT_CLOSE_WRAP_MAX_MS } from './fixed-script';
import { lastAskSentence, lastQuestionSentence, lastSentenceAsks, splitSentences, stripMarkdownEmphasis, turnEndsWithAsk } from '../question-gist-text';
import { expectedRepeatFor, isStrictRepeatAsk } from '../voice/correct-retry';
import { sameSentence } from '../voice/sentence-board';
import { TUTOR_JA_ANNOUNCED_MOVE } from '../orchestrator/flags';

/** A sentence that announces moving on (EN + JA). The keyword gate in
 *  announcedMoveTarget is required too — the phrase alone never moves. */
export const MOVE_PHRASE_RE = new RegExp(
  [
    String.raw`\b(?:let['’]?s|we['’]?ll|we will|now|time to)\s+(?:move|go)\s+(?:on\s+)?to\b`,
    String.raw`\bmove\s+on\s+to\b`,
    String.raw`\bmoving\s+on\s+to\b`,
    // Review I-3: no `let's do the …` — mostly an exercise instruction.
    String.raw`\blet['’]?s\s+(?:start|begin|turn\s+to)\s+(?:the|our|your)\b`,
    String.raw`\bnext\s+(?:is|comes|up\s+is)\b`,
    // A bare 次は is not here (「次は過去形で言ってみましょう」 is a drill):
    // it counts only as 次は<next keyword><move/copula> (announcedMoveTarget).
    '次に進みましょう', 'に進みましょう', 'に移りましょう', 'に移ります', 'を始めましょう',
  ].join('|'),
  'i',
);

/** Words too generic to name a part. `open` is deliberately NOT here ("open
 *  conversation" is the live case; the phrase gate keeps it safe). */
const STOPWORDS = new Set([
  'the', 'and', 'for', 'your', 'our', 'part', 'lesson', 'next', 'now', 'let', 'lets', 'with', 'about', 'you', 'this', 'that',
]);
const CJK_RUN_RE = /[぀-ヿ㐀-鿿豈-﫿ｦ-ﾟ]+/g;
const LATIN_WORD_RE = /[a-z]+/g;

/** Lower-cased Latin words (≥ 3 letters, no stopwords) and whole Japanese
 *  runs of the segment's `metadata.label`, every `metadata.labelLocalized`
 *  value, `title`, and `id` split on `-`/`_`. De-duplicated. */
export function segmentKeywords(seg: Segment): string[] {
  const md = (seg.metadata ?? {}) as Record<string, unknown>;
  const sources: string[] = [];
  if (typeof md.label === 'string') sources.push(md.label);
  if (md.labelLocalized && typeof md.labelLocalized === 'object') {
    for (const v of Object.values(md.labelLocalized as Record<string, unknown>)) if (typeof v === 'string') sources.push(v);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const title = (seg as any).title;
  if (typeof title === 'string') sources.push(title);
  if (typeof seg.id === 'string') sources.push(seg.id.replace(/[-_]+/g, ' '));
  const out = new Set<string>();
  for (const src of sources) {
    const lower = src.toLowerCase();
    for (const w of lower.match(LATIN_WORD_RE) ?? []) if (w.length >= 3 && !STOPWORDS.has(w)) out.add(w);
    for (const run of src.match(CJK_RUN_RE) ?? []) out.add(run);
  }
  return [...out];
}

function isCjk(keyword: string): boolean {
  return /^[぀-ヿ㐀-鿿豈-﫿ｦ-ﾟ]+$/.test(keyword);
}
/** Whole word for Latin keywords, substring for Japanese ones. */
function sentenceHas(sentence: string, keyword: string): boolean {
  if (isCjk(keyword)) return sentence.includes(keyword);
  return new RegExp(`\\b${keyword}\\b`, 'i').test(sentence);
}

/** 次は + one of the next part's Japanese keywords + a move or copula
 *  (に進 / に移 / を始め / です / へ) — 「次は会話です。」 announces; 「次は過去形で
 *  言ってみましょう。」 does not. */
function jaNextIsMove(sentence: string, nextKeys: string[]): boolean {
  return nextKeys.some((k) => isCjk(k) && new RegExp(`次は${k}(?:に進|に移|を始め|です|へ(?!の))`).test(sentence));
}

/** An offer's opening, for one that lost its question mark (Task 19 §B). */
const OFFER_LEAD_RE = /^(?:would you like|do you want|shall we|want to)\b/i;
/** A tag question at the end of a sentence (fix round 2, m7). */
const TAG_QUESTION_RE = /(?:,\s*(?:shall we|okay|ok|right|alright|yes)\s*[?？]|ね[?？])$/i;

/** The id of the NEXT segment when `tutorText` announces a move into it, else null. */
export function announcedMoveTarget(input: {
  tutorText: string; plan: LessonPlan; currentSegmentId: string; levelKnown: boolean;
}): string | null {
  const { tutorText, plan, currentSegmentId, levelKnown } = input;
  if (!tutorText || !plan || !isFixedScriptPlan(plan)) return null;
  const nextId = nextSegmentId(plan, currentSegmentId, levelKnown);
  if (!nextId) return null;
  const nextSeg = plan.segments.find((s) => s.id === nextId);
  if (!nextSeg) return null;
  const nextKeys = segmentKeywords(nextSeg);
  if (!nextKeys.length) return null;
  const nextSet = new Set(nextKeys);
  // Keywords that belong ONLY to some other segment (the current one included).
  const otherOnly = new Set<string>();
  for (const s of plan.segments) {
    if (s.id === nextId) continue;
    for (const k of segmentKeywords(s)) if (!nextSet.has(k)) otherOnly.add(k);
  }
  const sentences = tutorText.split(/(?<=[。！？.!?])\s*|\n+/).map((x) => x.trim()).filter(Boolean);
  for (const sentence of sentences) {
    // Task 19 §B (GDI run 7, 1135 s): `Would you like to practise a few single
    // words next, or move on to the summary?` advanced into the summary; the
    // student chose more practice and the lesson was force-closed mid-hint.
    // An offer is never an announcement.
    // Fix round 2 (m7): a trailing tag question ("…, shall we?", "…, okay?",
    // 「…ね？」) does not make an announcement an offer.
    const core = sentence.replace(TAG_QUESTION_RE, '');
    if (/[?？]/.test(core) || OFFER_LEAD_RE.test(core)) continue;
    if (!MOVE_PHRASE_RE.test(sentence) && !jaNextIsMove(sentence, nextKeys)) continue;
    if (!nextKeys.some((k) => sentenceHas(sentence, k))) continue;
    // Task 39 fix round 1 (R26-2, bot run r26 398 s: 「では、現在完了はここまでにして、
    // 次は過去形に進みましょう。」 — the closed part's own name in the closing
    // clause made it "another part's" sentence): the closing clause ("<part>は
    // ここまでにして", "That's all for <part>,") is left out of that check.
    const otherCheck = TUTOR_JA_ANNOUNCED_MOVE ? withoutClosingClause(sentence) : sentence;
    if ([...otherOnly].some((k) => sentenceHas(otherCheck, k))) continue;
    return nextId;
  }
  return null;
}

/** Fix round 1 (R26-2): the sentence without a leading "this part is done"
 *  clause — 「(では、)<X>はここまでにして、」 / 「<X>は終わりにして、」 / "That's all
 *  (it) for <X>, …" / "We're done with <X>, …". Pure. */
const JA_CLOSING_CLAUSE_RE = /^(?:(?:では|じゃあ|それでは|さて)[、,]?\s*)?[^、。,]{1,24}?は(?:ここまで|これで|おしまい|終わり)(?:にして|にしましょう|です|にします)[、,。]?\s*/;
const EN_CLOSING_CLAUSE_RE = /^\s*(?:(?:okay|ok|so|good|great|alright),?\s+)?(?:that['’]s (?:all|it) for|we['’]re done with|we['’]ve finished|enough) (?:the |our )?[\p{L}\s'’-]{1,40}?[,;—–]\s*(?:so\s+|and\s+|now\s+)?/iu;
export function withoutClosingClause(sentence: string): string {
  const s = sentence ?? '';
  const ja = JA_CLOSING_CLAUSE_RE.exec(s);
  if (ja && s.slice(ja[0].length).trim()) return s.slice(ja[0].length);
  const en = EN_CLOSING_CLAUSE_RE.exec(s);
  if (en && s.slice(en[0].length).trim()) return s.slice(en[0].length);
  return s;
}

// ── §C: continuation when the announcing turn asked nothing ──────────────

/** True ⇒ the announcing turn left the learner nothing to answer: its last
 *  sentence carries no "?"/"？", and nothing in it would be pinned as the
 *  open question (no question sentence — lastQuestionSentence — and no
 *  imperative ask — lastAskSentence, the pin's own predicates). */
export function announcedTurnNeedsContinuation(tutorText: string): boolean {
  const text = (tutorText ?? '').trim();
  if (!text) return false;
  const sentences = text.split(/(?<=[。！？.!?])\s*|\n+/).map((x) => x.trim()).filter(Boolean);
  const last = sentences[sentences.length - 1] ?? '';
  if (/[?？]/.test(last)) return false;
  // Task 38 §C (voice run 19, 865 s: 'Now try one … sentence about it,
  // starting with "I thought..." or "It was...".' — the split above cut at
  // the quoted ellipses, so the ask was never the last sentence): the turn
  // ending on an ask (turnEndsWithAsk, quote-aware split) is an open question.
  if (turnEndsWithAsk(text)) return false;
  if (lastQuestionSentence(text)) return false;
  if (lastAskSentence(text)) return false;
  // Task 28 §B (GDI run 15, 150 s): an imperative ask in the last sentence
  // ("Take a look at the board, and tell me one thing you do at work.") ends
  // the turn too — the shared helper every continuation decider goes through.
  if (lastSentenceAsks(text)) return false;
  // Task 30 §G (GDI run 17, 1160 s: "…Just tell me the number or the option
  // name." got a no-ask continuation that re-listed the options).
  if (endsWithImperativeReplyRequest(text)) return false;
  return true;
}

/** Task 30 §G: the last sentence is an imperative request for a reply —
 *  it opens (after just / please / now / so) with tell me / say / answer /
 *  let me know / choose / pick / give me / name / type / repeat / try, or it
 *  ends "… please / for me" with one of those verbs in it. Pure. */
const REPLY_VERB = '(?:tell me|say|answer|let me know|choose|pick|give me|name|type|repeat|try)';
const IMPERATIVE_REPLY_LEAD_RE = new RegExp(`^(?:(?:just|please|now|so),?\\s+)?${REPLY_VERB}\\b`, 'i');
const IMPERATIVE_REPLY_TAIL_RE = /\b(?:please|for me)[.!]?\s*$/i;
const REPLY_VERB_RE = new RegExp(`\\b${REPLY_VERB}\\b`, 'i');
export function endsWithImperativeReplyRequest(text: string | null | undefined): boolean {
  const sentences = (text ?? '').trim().split(/(?<=[。！？.!?])\s*|\n+/).map((x) => x.trim()).filter(Boolean);
  const last = (sentences[sentences.length - 1] ?? '').replace(/^["“'‘(]+/, '');
  if (!last) return false;
  if (IMPERATIVE_REPLY_LEAD_RE.test(last)) return true;
  return IMPERATIVE_REPLY_TAIL_RE.test(last) && REPLY_VERB_RE.test(last);
}

/** Poll cadence while waiting for the announcing turn's audio to finish. */
export const ANNOUNCED_CONTINUE_POLL_MS = 250;
/** If the tutor was never seen speaking (audio not started yet, or a text
 *  turn), wait at least this long before continuing. */
export const ANNOUNCED_CONTINUE_MIN_MS = 1500;
/** Give up when the tutor is still busy this long after the advance. */
export const ANNOUNCED_CONTINUE_MAX_MS = 30_000;

/** One poll of the scheduled continuation — the idle nudge's guard set.
 *  'drop' when the moment has passed: another brain turn ran since it was
 *  scheduled (`turnSeqChanged` — e.g. a queued student reply drained
 *  straight into callBrainOnce and opened the new part itself), the host
 *  put the tutor on standby, the session is ending, or the tutor stayed busy
 *  past ANNOUNCED_CONTINUE_MAX_MS. 'wait' while the tutor speaks (relay
 *  state or speech still pending), the brain is busy, the student is
 *  mid-utterance / their answer awaits dispatch / they are typing, a
 *  student hold or pause is on, or the tab is hidden; and — when speech was
 *  never observed — for the first ANNOUNCED_CONTINUE_MIN_MS. */
export function announcedContinueDecision(input: {
  elapsedMs: number; sawSpeaking: boolean; speaking: boolean; brainBusy: boolean; studentMidUtterance: boolean;
  speechPending?: boolean; awaitingDispatch?: boolean; studentTyping?: boolean; hold?: boolean; paused?: boolean; hidden?: boolean;
  standby?: boolean; ending?: boolean; turnSeqChanged?: boolean;
}): 'fire' | 'wait' | 'drop' {
  const { elapsedMs, sawSpeaking } = input;
  if (input.turnSeqChanged || input.standby || input.ending) return 'drop';
  const busy = input.speaking || input.speechPending || input.brainBusy || input.studentMidUtterance
    || input.awaitingDispatch || input.studentTyping || input.hold || input.paused || input.hidden;
  if (busy) return elapsedMs >= ANNOUNCED_CONTINUE_MAX_MS ? 'drop' : 'wait';
  if (!sawSpeaking && elapsedMs < ANNOUNCED_CONTINUE_MIN_MS) return 'wait';
  return 'fire';
}

/** Task 23 §C (GDI run 11, 130 s: the level check's last turn ended "…so the
 *  level check is complete.", the pointer moved, and the board sat silent
 *  43 s until the idle nudge): a turn whose set_working_level moved the
 *  pointer gets the announced advance's silent continuation when it asked
 *  nothing (announcedTurnNeedsContinuation) — once per target part, and only
 *  while the pointer is still on that part. */
export function levelAdvanceNeedsContinuation(input: {
  levelAdvancedTo: string;
  currentSegmentId: string;
  tutorText: string;
  alreadyContinued: boolean;
}): boolean {
  if (!input.levelAdvancedTo || input.alreadyContinued) return false;
  if (input.currentSegmentId !== input.levelAdvancedTo) return false;
  return announcedTurnNeedsContinuation(input.tutorText);
}

/** Tools whose turn has its own continuation or ask: an advance (the FACT
 *  note / announced continuation opens the new part) or a problem card. */
const NOASK_EXEMPT_TOOLS = new Set(['advance_lesson', 'show_segment_card', 'show_problem', 'generate_problem']);

/** Task 24 §B2 (GDI run 12, 352 s: the turn ended "Let me put the correct
 *  sentence on the board and move on." with only a show_sentence, and the
 *  board sat silent 30 s until the idle nudge): a fixed-script turn that
 *  answered the student and left them nothing to answer gets the announced
 *  advance's silent continuation. Never on a runtime-triggered turn (the
 *  continuation itself, a nudge), a closing turn, while a pronunciation clip
 *  is armed (the learner is about to repeat), or when an exempt tool ran. */
export function noAskTurnNeedsContinuation(input: {
  text: string;
  fixedScript: boolean;
  runtimeTriggered: boolean;
  toolsSeen: readonly string[];
  closing: boolean;
  pronunciationArmed: boolean;
}): boolean {
  if (!input.fixedScript || input.runtimeTriggered || input.closing || input.pronunciationArmed) return false;
  if (input.toolsSeen.some((t) => NOASK_EXEMPT_TOOLS.has(t))) return false;
  // Task 29 §K1: a turn ending on a repeat ask is an ask.
  if (endsWithRepeatAsk(input.text)) return false;
  // Task 31 §A (run 18, 437 s / 1149 s): a say / listen-and-repeat ask in
  // the last two sentences leaves the student something to do.
  if (endsWithSayOrListenAsk(input.text)) return false;
  return announcedTurnNeedsContinuation(input.text);
}

/** Task 31 §A (GDI run 18: "Let's say the full sentence: I have used ABC
 *  software for two years." and "Please listen, then repeat after me:
 *  responsibilities. Responsibilities." each got a no-ask continuation that
 *  spoke over — or praised — the repeat the student had not said yet): one of
 *  the turn's last two sentences is a strict repeat ask (isStrictRepeatAsk)
 *  or an imperative say / listen ask — "(Let's) say / try saying / repeat …",
 *  "Let's say the sentence / it / … :", "(please) listen, (and|then)
 *  repeat / say". "Let's say" needs a colon or a sentence / word / it object
 *  ("Let's say you have a meeting" is a supposition). Pure. */
const ASK_LEAD = '^(?:(?:now|so|okay|ok|please|good|great|then|next|alright|all right),?\\s+)*';
const SAY_IMPERATIVE_RE = new RegExp(`${ASK_LEAD}(?:say|try saying|repeat)\\b`, 'i');
const LETS_SAY_RE = new RegExp(`${ASK_LEAD}(?:let'?s|let us)\\s+(?:say|try saying|repeat)\\b(?:[^.!?。！？]*[:：]|\\s+(?:it|that|this|the (?:whole |full |complete |corrected |new )?(?:sentence|word|phrase|line)))`, 'i');
const LISTEN_REPEAT_RE = /\b(?:please\s+)?listen,?\s+(?:and\s+|then\s+|and then\s+)?(?:repeat|say)\b|\brepeat after me\b/i;
export function endsWithSayOrListenAsk(text: string | null | undefined): boolean {
  const t = (text ?? '').trim();
  if (!t) return false;
  const sentences = splitSentences(stripMarkdownEmphasis(t));
  const tail = sentences.slice(-2).map((x) => x.replace(/^["“'‘(「]+/, '').trim());
  return tail.some((x) => isStrictRepeatAsk(x) || SAY_IMPERATIVE_RE.test(x) || LETS_SAY_RE.test(x) || LISTEN_REPEAT_RE.test(x));
}

/** Task 29 §K1 (GDI run 16, 467 → 479 s: the turn ended `Let's say it with
 *  the present perfect: "I have presented at an international meeting."`, a
 *  repeat ask; fixed_script_noask_continue fired and the next turn re-spoke
 *  its first sentence): the last sentence is a quoted model sentence of ≥ 4
 *  words introduced by say / repeat / try / read, or the turn names a line
 *  the student is expected to say (expectedRepeatFor). */
const REPEAT_ASK_TAIL_RE = /\b(?:say|repeat|try|read)\b[^"“「]*["“「]([^"”」]+)["”」]\s*[.!]?\s*$/i;
export function endsWithRepeatAsk(text: string | null | undefined): boolean {
  const t = (text ?? '').trim();
  if (!t) return false;
  const sentences = splitSentences(stripMarkdownEmphasis(t));
  const m = REPEAT_ASK_TAIL_RE.exec(sentences[sentences.length - 1] ?? '');
  if (m && (m[1]!.match(/[\p{L}\p{N}]+(?:['’][\p{L}]+)*/gu) ?? []).length >= 4) return true;
  return expectedRepeatFor(t, null, null) !== null;
}

/** Task 29 §K2: a sentence of a continuation turn that says a sentence of the
 *  turn it continues again (sameSentence; ≥ 4 words — a short "Yes." or
 *  "Good." is never dropped) — the student would hear it twice. */
export function continuationRepeatsSentence(sentence: string | null | undefined, continuedTurn: string | null | undefined): boolean {
  const s = (sentence ?? '').trim();
  if (!s || !continuedTurn || (s.match(/[\p{L}\p{N}]+/gu) ?? []).length < 4) return false;
  return splitSentences(stripMarkdownEmphasis(continuedTurn)).some((x) => (x.match(/[\p{L}\p{N}]+/gu) ?? []).length >= 4 && sameSentence(x, s));
}

/** Task 38 §D (voice run 19, 963 / 971 s: "Let's hear more about the
 *  challenge itself." then, opening the no-ask continuation, "Let's hear more
 *  about that challenge, Praveen."): the continuation's FIRST sentence that
 *  restates the continued turn's LAST sentence — content words (≥ 3 letters,
 *  stopwords, deictics and the given names out, ≥ 2 each side) with Jaccard
 *  ≥ 0.7 — is dropped. Pure. */
export const CONTINUATION_LAST_SENTENCE_JACCARD = 0.7;
const CONT_ECHO_STOP = new Set(['the', 'that', 'this', 'these', 'those', 'itself', 'and', 'but', 'with', 'for', 'from', 'about', 'your', 'you', 'let', "let's", 'lets', 'now', 'okay', 'then', 'just', 'here', 'there', 'some', 'what', 'how', 'can', 'could', 'would', 'please', 'are', 'was', 'were', 'have', 'has', 'had', 'did', 'does']);
function contEchoWords(s: string, names: ReadonlySet<string>): Set<string> {
  return new Set((s.toLowerCase().match(/[\p{L}'’]+/gu) ?? [])
    .map((w) => w.replace(/[’]/g, "'"))
    .filter((w) => w.length >= 3 && !CONT_ECHO_STOP.has(w) && !names.has(w)));
}
export function continuationEchoesLastSentence(sentence: string | null | undefined, continuedTurn: string | null | undefined, names?: readonly string[] | null): boolean {
  const s = (sentence ?? '').trim();
  if (!s || !continuedTurn) return false;
  const sentences = splitSentences(stripMarkdownEmphasis(continuedTurn));
  const last = sentences[sentences.length - 1] ?? '';
  if (!last) return false;
  const nameSet = new Set((names ?? []).flatMap((n) => (n ?? '').toLowerCase().split(/\s+/)).filter(Boolean));
  const a = contEchoWords(last, nameSet);
  const b = contEchoWords(s, nameSet);
  if (a.size < 2 || b.size < 2) return false;
  let inter = 0;
  for (const w of b) if (a.has(w)) inter += 1;
  return inter / (a.size + b.size - inter) >= CONTINUATION_LAST_SENTENCE_JACCARD;
}

// ── Task 26 §B1: the forced close waits for the answer to its question ────

/** What the forced-close check does after a tutor turn. 'none' ⇒ not due
 *  yet (or the lesson closed); 'wrap-turn' ⇒ due, but the turn asked the
 *  student something (the inverse of announcedTurnNeedsContinuation — a
 *  question or an imperative ask) and no wrap turn ran yet: run ONE wrap
 *  turn first; 'force' ⇒ the fixed goodbye + end now.
 *  Intentionally wider than "ends with a question" (fix round 1, m-3): an
 *  imperative ask, or a question earlier in the turn that the pin would keep
 *  open, also gets the wrap — the gentler outcome; the wrap runs once. */
export function fixedScriptCloseForcedAction(input: {
  turnsSince: number;
  lessonClosed: boolean;
  kind: string;
  tutorText: string;
  wrapRun: boolean;
}): 'none' | 'wrap-turn' | 'force' {
  if (!fixedScriptCloseForced(input.turnsSince, input.lessonClosed, input.kind)) return 'none';
  if (input.wrapRun) return 'force';
  const text = (input.tutorText ?? '').trim();
  return text && !announcedTurnNeedsContinuation(text) ? 'wrap-turn' : 'force';
}

/** One poll of the armed wrap turn. 'carried' ⇒ another brain turn ran
 *  since arming (the student's answer, a nudge) and took the wrap note with
 *  it; 'drop' ⇒ the session ended / closed; 'fire' ⇒ dispatch the wrap
 *  directive now: the tutor has been quiet FIXED_SCRIPT_CLOSE_WRAP_SILENCE_MS
 *  with the student idle, or FIXED_SCRIPT_CLOSE_WRAP_MAX_MS passed with no
 *  brain turn running and the student idle; 'wait' otherwise (also while
 *  paused, held or hidden). The 45 s bound is not hard (fix round 1, m-4):
 *  it only overrides a stale tutor-speech state (the quiet clock); a running
 *  brain turn, an active student or a paused / held / hidden session still
 *  wait past it. */
export function closeWrapPollDecision(input: {
  elapsedMs: number;
  quietMs: number;
  ended: boolean;
  turnSeqChanged: boolean;
  brainBusy: boolean;
  studentActive: boolean;
  suspended: boolean;
}): 'fire' | 'wait' | 'drop' | 'carried' {
  if (input.ended) return 'drop';
  if (input.turnSeqChanged) return 'carried';
  if (input.brainBusy || input.studentActive || input.suspended) return 'wait';
  if (input.quietMs >= FIXED_SCRIPT_CLOSE_WRAP_SILENCE_MS || input.elapsedMs >= FIXED_SCRIPT_CLOSE_WRAP_MAX_MS) return 'fire';
  return 'wait';
}
