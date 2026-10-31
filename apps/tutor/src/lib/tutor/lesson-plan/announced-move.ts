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
import { isFixedScriptPlan, nextSegmentId } from './fixed-script';
import { lastAskSentence, lastQuestionSentence } from '../question-gist-text';

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
    if ([...otherOnly].some((k) => sentenceHas(sentence, k))) continue;
    return nextId;
  }
  return null;
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
  if (lastQuestionSentence(text)) return false;
  if (lastAskSentence(text)) return false;
  return true;
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
  return announcedTurnNeedsContinuation(input.text);
}
