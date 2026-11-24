/**
 * Tutor brain v2 — one turn (design §4.2).
 *
 * What the model is sent:
 *   system   the constitution (shared by every session) + the session part
 *            (student, mode, time box, the plan as a map)
 *   tools    a few board tools for the subject + three control tools
 *   messages the real history — the tutor's words, its tool calls and what
 *            each one did — then the student's words, then one facts block
 *
 * There are no instruction blocks, no notes planted in the student's words and
 * no checks that cut a reply after the fact. The model thinks before it speaks
 * (adaptive thinking, in voice as in text); thinking is never stored.
 *
 * The model call and the board are injectable, so the unit suite runs without
 * a network and the offline harness runs without a browser.
 */
import { drawFigure } from './drawn-figures';
import { typesetMaths } from './rich-text';
import { closeDueMinutes } from './close-heard';
import { v2WithoutCutBoardNote } from './interrupted';
import { RECAP_TITLE, goalForProblem, goalForTalk, goalForTitle, laterPartAlone, wholeProblem } from './progress';
import type Anthropic from '@anthropic-ai/sdk';
import { getModelClient } from '../ai/model-registry';
import { validateToolCall } from '../whiteboard/validate-tool-call';
import { catalogueSubjects, figureCatalogueFor, tutorFigureLines } from './figure-catalogue';
import { applyToModelBoard, boardMisfit, renderBoard, summariseBoardCall, taskOnly, spacedRoman, wordsAsText, stackedRow } from './board';
import { BoardInlineStream, boardBlocksIn, inlineToolCall, insertBlock, stripBoardBlocks, type InlineBlock, type InlinePart } from './board-inline';
import { speaksMaths, unwrittenEquations } from './spoken-maths';
import { cardQuestion, v2DropSaidLead, saidCovers, sentenceCardToSay, unsaidAsk, unsaidBoardItem, asksAnywhere, noteSentencesToSay, pointsBackAtBoard } from './board-timing';
import { V2_CONSTITUTION, v2ModeLines } from './constitution';
import { renderFacts, v2AskEveryOn, v2SummaryBegun, V2_NO_ASK_RECHECK_S, V2_TIME_UP_MIN, V2_WAITED_RECHECK_S, type V2TurnFacts } from './facts';
import { v2CloseOpen, v2LeftToStopMin, v2LessonNowMs, v2MarginMin, v2PartFlowLesson, v2PlanContentDone, v2TimeFlags, v2WrapDue, v2WrapMin, type V2TimeFlags } from './time-box';
import { V2_MIN_PRACTICE, V2_MORE_PRACTICE_MIN_LEFT, v2LevelCheckTimeUp, v2ArrivalDrops, v2LeaveOutByChoice, v2AsksMorePractice, v2CountPractice, v2PartPracticeAsked, v2DroppedMentioned, v2TakeEnteredDropped, v2PartsToDrop, v2PracticeMoreLine, v2PracticeShort, v2TimeFitAfterReply, v2TimeFitDue, v2TimeFitUpFront, v2MarkPartStart, v2OptionalAskedAtClose, v2OptionalWrapMin } from './time-fit';
import { planGoalIds, renderPlanMap, v2NextTimeAllLine, v2PagePartLabel, v2NextTimeLine, v2PartIsOptional, v2PartNamedIn, v2PartOf, v2PartOffers, v2UnreachedOffer } from './plan-map';
import { stripToolTalk } from './tool-talk';
import { gradeOfLevel } from './session-kind';
import { v2HomeworkOpener, v2HomeworkPart, v2SheetOpener, v2SheetPart } from './homework';
import { V2_CLOSING_PAGE, endsAsking, leftOpen, mayOpenPart, namesPart, partOffer, v2FrameDue } from './part-close';
import { ReplyGate, isGoodbye, isPartFrame } from './reply-gate';
import { V2_JA_SCRIPT, v2AnswerAsksOrDeclines, v2GoForPart, v2AskedParts, v2OptionalAhead, v2OptionalDeclined, v2SummaryAsked, v2SummaryGo, v2AskRepeats, v2AsksPartChange, v2EndingPartAsk, v2HeldPageOwed, v2HeldPartWaiting, v2IsPartAsk, v2MoveAnswer, v2NextPart, v2PageForPart, v2PartAskLine, v2PartChangeAsked, v2PartInHand, v2PartNamedLate, v2PartOfPage, v2PartViewed, v2PageTurnNote, v2PositionPage, v2PendingPart, v2PlanLabelled, v2SamePartPages, v2TutorReplies, v2UnheardPartAsk } from './part-flow';
import { heardAsWords } from './heard';
import { v2IsPracticeAsk, v2LanguagesSection } from './languages';
import { v2LessonLanguageSection } from './lesson-language-section';
import { taughtIn } from '../voice/lesson-language';
import { v2ReadsByClauses } from './language-pack';
import { v2AsksRepeat, v2AsksTheLearner, v2HandsOver, v2ReplyAsks, v2ReplyHandsOver, v2ReplySentences } from './one-question';
import { V2_LEVEL_WAIT, V2_LEVEL_WAIT_OVER, V2_SET_WORKING_LEVEL_TOOL, v2ApplySetWorkingLevel, v2LevelCheckOn, v2MarkLevelKnownParts, v2ReopenLevelCheck, v2WorkingLevelSection } from './working-level';
import { V2_PRACTISE_PRONUNCIATION_TOOL, v2ArmClosesOnOtherAsk, v2ApplyPractisePronunciation, v2ConsumePronunciation, v2PronunciationOn, v2PronunciationSection, v2ScoredTurn } from './pronunciation';
import { v2CorrectionStems, v2IsCorrectionOf, v2NoteCorrectedSentence, v2SentenceCardsOn, v2SentenceCardsSection } from './sentence-cards';
import { V2_SUMMARY_CARDS_FULL, v2SummaryCardsFull, v2SummaryGroupsOn } from './summary-layout';
import { v2NoteCorrection, v2SummaryCardCheck } from './summary-marks';
import { v2SummaryOpensCloseOn } from './summary-close';
import { V2_CLOSE_CHECK_REFUSAL, V2_CLOSE_CHECK_REFUSAL_GIVEN, v2CheckCardText, v2CloseCheckRefusal, v2CloseCheckOwed, v2CloseCheckPending, v2PlanCheckQuestion, v2NoteCloseAskLast, v2UnheardCloseAsks } from './close-check';
import { v2NoteOptionalLeave, v2OptionalHold, v2OptionalOneMore } from './optional-hold';
import { V2_HAND_OVER_CONTINUE, V2_HAND_OVER_CONTINUE_BEGAN, V2_HAND_OVER_DEFER, V2_HAND_OVER_MAX_TOKENS, V2_HAND_OVER_TIMEOUT_MS, V2_OPTIONAL_DEFER_IN_PREFIX, V2_SUMMARY_HAND_OVER_LINE, v2HandedOver, v2InPartDeferredBefore } from './summary-hand-over';
import { TUTOR_V2_SUMMARY_HAND_OVER } from '../orchestrator/flags';
import { V2_CHECK_INS } from './question-overlap';
import { v2AdaptAfter, v2AdaptBefore, v2AdaptOn, v2AdaptPart, v2FreeConvAfter, v2FreeConvQuiet, v2PracticePairs, v2QuestionOfReply, v2ReplyQuestions, v2RetestPutAfter } from './adaptive';
import { LearnerCardWatch, V2_AS_SAID_REFUSED, V2_REPLY_MISHEARD, v2CardCorrects, v2CardIsAsSaid, v2CardIsFragment, v2CardSentence, v2LearnerCardsOn, v2LearnerSentences, v2OwedCardCheckLine, v2PracticeAnswerSentences, v2SentenceOnBoard, v2SentencesNotCarded } from './learner-card';
import { V2_SUMMARY_WELL_HEADING, V2_SUMMARY_WELL_HELD, v2SummaryHeadingPlan, v2SummaryHeadingRepeat, v2SummaryWellHeld } from './summary-headings';
import { v2StopAsked } from './stop-signal';
import { V2_CLOSE_INVITE_LINE, V2_CLOSE_INVITE_REFUSAL, V2_CLOSE_INVITE_REFUSAL_GIVEN, V2_CLOSE_INVITE_WAIT, v2CloseInviteRefusal, v2InviteOfReply, v2SummaryGiven, V2_CLOSE_MORE_LINE, V2_CLOSE_REOPEN_REFUSAL, v2CloseInviteOn, v2CloseInviteOwed, v2CloseReopened, v2ReplyAsksMoreOrFinish, v2ReplyInvites } from './close-invite';
import { TUTOR_V2_LEVEL_CHECK_PUT, TUTOR_V2_OWN_KEY_NOT_LANGUAGE, TUTOR_V2_ASK_NO_CHECKIN, TUTOR_V2_CLOSE_ONE_QUESTION, TUTOR_V2_CLOSE_OPENS_SUMMARY, TUTOR_V2_CLOSE_REOPENED, TUTOR_V2_FRAME_NAMES_OPENED, TUTOR_V2_HELD_PART_RELEASE, TUTOR_V2_NO_CHECKIN_AFTER_GOODBYE, TUTOR_V2_OPTIONAL_AT_ARRIVAL, TUTOR_V2_PAGE_NEEDS_GO, TUTOR_V2_PART_OFFER_ONCE, TUTOR_V2_PART_POSITION_KEPT, TUTOR_V2_PART_PAGE_CHIP, TUTOR_V2_PASSED_PART_CLOSE, TUTOR_V2_PERSONA_CARD, TUTOR_V2_QUESTION_CARD, TUTOR_V2_SAY_NOTE_SENTENCES, TUTOR_V2_SAY_SENTENCE_CARD, TUTOR_V2_SPEAK_BOARD_ITEM, TUTOR_V2_STOP_SIGNAL, TUTOR_V2_SUMMARY_BEGUN_NEXT_TIME, TUTOR_V2_QUESTION_ONCE, TUTOR_V2_CORRECTION_CARD_NOW, TUTOR_V2_NO_FALSE_SILENCE, TUTOR_V2_NOTE_TARGET_QUOTES, TUTOR_V2_NOTE_TARGET_MARK, TUTOR_V2_NOTE_STRESS_MARK, TUTOR_V2_NO_MARKDOWN_STARS, TUTOR_V2_CARD_GLOSS_SHOW, TUTOR_V2_SUPPORT_STEPS, TUTOR_V2_RETEST_MISTAKE, TUTOR_V2_PART_GO_NAMED, TUTOR_V2_PRONUNCIATION_PAGE, TUTOR_V2_FRAGMENT_CARD, TUTOR_V2_CARD_AT_SENTENCE, TUTOR_V2_OPTIONAL_FIT, TUTOR_V2_RETEST_TARGET_CHANGED, TUTOR_V2_OPENING_PAGE_TITLE, TUTOR_V2_FREE_CONVERSATION, TUTOR_V2_REPEAT_THEN_WAIT, TUTOR_V2_OPENING_PAGE_FIRST, TUTOR_V2_UNHEARD_ASK_OWED, TUTOR_V2_REPEAT_NOT_MISHEARD, TUTOR_V2_OWED_CARD_RIGHT, TUTOR_V2_SUMMARY_HEADINGS, TUTOR_V2_PRON_TARGET_SAID, TUTOR_V2_ANSWER_OVER_ASK, TUTOR_V2_PAIR_PAINTED_ONLY } from '../orchestrator/flags';
import { v2CardGlossOn, v2CleanGloss, v2GlossLevelOn } from './card-gloss';
import { v2NoteTargetsOn, v2NoteTargetsSection, v2NoteHasTarget, v2NoteStressWords } from './note-targets';
import { V2StarStrip, v2StripStars } from './markdown-stars';
import { DISCUSSION_CHECK_INS, DISCUSSION_OPENING, DISCUSSION_STEERED, V2_DISCUSSION_CONSTITUTION, caseToldIn, directionAnswered, directionAsked, discussionOf, reflectAsked, syncDiscussionStages, untoldCases, effectiveMinutes, recordThinking, renderDiscussionMap, scriptedWelcome } from './discussion';
import { SAY_WITH, V2_CONTROL_TOOL_NAMES, V2_NOTE_OWN_ANSWER_TOOL, V2_SET_CURRENT_PROBLEM_TOOL, v2Tools } from './tools';
import type { GapStatus, GoalStatus, V2Board, V2BoardOutcome, V2Session, V2State, V2ToolCall, V2TurnResult } from './types';

/** Task 6f: the words of a reply that has begun its summary ("Before we finish, here is a quick summary."). */
export const V2_SUMMARY_BEGUN = /\b(?:here(?: is|'s) (?:a |the |your |our |today's )?(?:quick |short |brief |little )?(?:summary|recap|review of today)|(?:let me|let's|i'll|we'll) (?:sum up|summari[sz]e|recap|go over what we did)|to (?:sum up|summari[sz]e|recap)|in summary)\b|まとめ(?:ます|ましょう|です|ると)/i;

/** Where `needle` first occurs in `text` outside every <board …>…</board> block, or -1. */
export function indexOutsideBlocks(text: string, needle: string): number {
  const spans: Array<[number, number]> = [];
  for (const m of text.matchAll(/<board\b[\s\S]*?<\/board>/g)) spans.push([m.index!, m.index! + m[0].length]);
  for (let at = text.indexOf(needle); at >= 0; at = text.indexOf(needle, at + 1)) {
    if (!spans.some(([a, z]) => at < z && at + needle.length > a)) return at;
  }
  return -1;
}

/** The last `n` sentences of `text`. */
export const lastSentences = (text: string, n: number) => text.trim().split(/(?<=[.!?]["'”’)]*)\s+|(?<=[。！？][」』)）"”]*)\s*/).filter(Boolean).slice(-n).join(' ');

/** A spoken reply of at least this many words that wrote nothing is put to the board check. */
export const V2_UNWRITTEN_WORDS = 30;
/** Board calls that draw a figure, as opposed to writing words or mathematics. */
/** How a reply that asked nothing hands the turn to the student (Task 8a fix round 1: defined in question-overlap.ts, so the level check
 *  can tell the runtime's own line from a question put; re-exported here for its importers). */
export { V2_CHECK_INS };
const V2_FIGURE_TOOL_NAMES = new Set(['show_free_body_diagram', 'show_number_line', 'show_function_graph', 'show_table', 'show_timeline', 'show_graphic_organizer', 'show_geometry', 'show_venn_diagram', 'show_tree', 'show_stats', 'show_lewis_constructed', 'show_cycle_diagram', 'show_concept_map', 'show_map', 'show_diagram', 'show_sketch', 'show_circuit', 'show_ray_diagram', 'show_drawn_figure']);
/** Task 8d fix round 1 (I3): the runtime says an armed item only when less than this share of its words is in the reply. */
export const V2_PRON_SAID_SHARE = 0.6;
export const V2_MAX_MODEL_CALLS = 5;
/** After a look back at an earlier page, what a later reply writes goes on the page of the work in progress. Kill switch: TUTOR_V2_LOOK_RETURNS=off. */
const V2_LOOK_RETURNS = process.env.TUTOR_V2_LOOK_RETURNS !== 'off';
const V2_RECAP_PAGE = process.env.TUTOR_V2_RECAP_PAGE !== 'off';
const V2_PART_PAGE = process.env.TUTOR_V2_PART_PAGE !== 'off';
/** The heading of a note that is a recap: its first line, when that line is a recap's title and points follow it. */
function recapHeading(text: unknown): string | null {
  if (typeof text !== 'string') return null;
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const first = (lines[0] ?? '').replace(/^[#*\s]+|[*:.\s]+$/g, '');
  return lines.length >= 3 && first.split(/\s+/).length <= 4 && /^(?:(?:lesson|quick|today's)\s+)?(?:recap|summary|key (?:points|takeaways)|takeaways?|what to remember|wrap[- ]up)\b/i.test(first) ? first : null;
}
/** The longest answer key kept for a problem of the tutor's own. */
export const V2_OWN_KEY_CHARS = 700;
/** Asked on a clean page, with the problem alone: the same model that agreed with a wrong root mid-lesson solves it right. */
/** The answer to a question asked aloud. Asked to solve from the problem as stated: the board may hold the student's own slip. */
export const V2_ASKED_KEY = 'A tutor has just said the words below to a student, with the board as shown. Find what the tutor is leaving the student to answer or to do: the last question asked or task set ("solve it and tell me what you get" is one). If it has a definite answer that can be worked out from what is given (a value, an expression, a set of values, an interval, which of two things is larger, whether a statement of fact is true), work it out yourself, carefully and completely, from the problem as it was set. Do not rely on working shown on the board or quoted by the tutor: it may be the student\'s and may be wrong. Check every value by substituting it back. Then write the answer with the working that leads to it, in plain text, under 90 words. If there is no such question or task, or it has no such answer (it asks what the student thinks or notices, whether they follow, what they would like to do, or to explain something in their own words), write only the word: open';
export const V2_OWN_KEY = 'A tutor has just set a student the problem below. Work it out yourself, carefully and completely, so the tutor can check the student\'s work against yours. Then write the answer key as plain text in under 110 words: each step that produces a value the student will have to find (with the value), then the final answer. Check every value by substituting it back before you write it. If the problem cannot be answered as it is written, say so in one sentence instead. Write the key only: no greeting, no advice on teaching.';
export const V2_MAX_TOKENS = 8000;
export const V2_NOTE_MAX_CHARS = 1500;
export const V2_MAX_GAPS = 12;
/** Thinking effort. Medium, not low: in blind reviews (2026-11-09, two reviewers, two weaker-student
 *  fixtures) medium scored 5.2 and 7.5 against 3.0 and 4.7 for low — low is where the wrong verdicts,
 *  the narration and the answers handed over came from. It costs about half a second more before the
 *  first words. TUTOR_V2_EFFORT overrides it on the server. */
export const V2_DEFAULT_EFFORT: 'low' | 'medium' | 'high' =
  process.env.TUTOR_V2_EFFORT === 'low' || process.env.TUTOR_V2_EFFORT === 'high' ? process.env.TUTOR_V2_EFFORT : 'medium';
const GAP_STATUSES: GapStatus[] = ['found', 'explained', 'done_with_help', 'done_alone'];
const CACHE = { type: 'ephemeral' as const, ttl: '1h' as const };

/** The maths check's question (see runV2Turn). Narrow on purpose: asked to judge the whole reply it "corrected"
 *  sound verdicts and informal wording; asked only for a slip of calculation it does not. */
export const V2_MATHS_CHECK = `[check — from the system running the session, not from the student]\nYou have just said the reply above aloud. Look only for a slip of calculation in it: an operation you named ("dividing by", "multiplying by", "adding") or a value you gave that, carried out on what is on the board, does not give what you said. A point, value or label on a figure you drew with this reply counts too, when it is false for the thing it is drawn on (a point marked as on a curve that it is not on). A statement that is true on any ordinary reading stands: counting both ends of a range, rounding, or a different but equal form is not a slip. Be certain before you correct. Nothing else is in question: not your verdict on the student's answer, not which shape or case something is, not loose or informal wording, not anything you left unsaid. If there is such a slip, write "correction:" and one short sentence of at most twenty words, as you would say it aloud straight after, naming only the right operation or value. Otherwise write "maths: ok". Write only that one line.`;

/** `onBlockEnd`: a content block of the reply is complete (its type): Task 6g fix round 1 lets a held practice ask go when
 *  the words end, not when the trailing tool calls do. */
export type V2ModelCall = (params: Anthropic.MessageCreateParamsNonStreaming, onText?: (delta: string) => void, signal?: AbortSignal, onBlockEnd?: (type: string) => void) => Promise<Anthropic.Message>;
export type V2BoardPort = (board: V2Board, id: string, name: string, args: Record<string, unknown>) => V2BoardOutcome;

export interface V2TurnInput {
  session: V2Session;
  state: V2State;
  /** The student's words. `null` when the tutor speaks unprompted: the start of the session, or a silence. */
  studentSaid: string | null;
  facts?: Omit<V2TurnFacts, 'nowMs'>;
  nowMs?: number;
  effort?: 'low' | 'medium' | 'high';
  /** An inline board block has begun; its board call follows when it is complete. */
  onBoardOpen?: () => void;
  /** The board check withdrew an item of this reply (it did the student's step for them). */
  onBoardWithdraw?: (id: string) => void;
  /** The board pass after a spoken reply that says mathematics (default on). */
  boardPass?: boolean;
  /** Run the maths check after a reply that spoke mathematics. Default: on for real model calls, off for a stubbed one. */
  mathsCheck?: boolean;
  /** Work out, after the reply, a problem the tutor set that is not the plan's. Default: on for real model calls, off for a stubbed one. */
  ownKey?: boolean;
  /** Task 8e fix round 1, tests only: OWN_KEY_NOT_LANGUAGE for this turn (default: the flag). */
  ownKeyNotLanguage?: boolean;
  /** Work out the answer to a question asked aloud (default: on for real model calls, off for stubs). */
  askedKey?: boolean;
  callModel?: V2ModelCall;
  applyBoard?: V2BoardPort;
  onText?: (delta: string) => void;
  /** Called as each tool call is settled, in order, before the turn returns. */
  onToolCall?: (call: V2ToolCall) => void;
  /** Cancels the model call: the student talked over the tutor, or the page went away. */
  signal?: AbortSignal;
  /** A board call this session must not paint, and why (homework-turn.ts: a key value, a figure already on
   *  screen). Asked before the board is touched; the reason goes back to the model as the call's result. */
  boardGuard?: (name: string, args: Record<string, unknown>) => string | null;
  /** Task 7a fix round 1 (review M5), tests only: the PART_PAGE_CHIP / PART_ASK_EVERY switches for this turn (default: the flags). */
  partFlags?: { pageChip?: boolean; askEvery?: boolean };
  /** Task 7q, tests only: SUPPORT_STEPS / RETEST_MISTAKE for this turn (default: the flags). */
  adaptFlags?: { support?: boolean; retest?: boolean; changed?: boolean; spread?: boolean; followed?: boolean; free?: boolean; asked?: boolean };
  /** Task 7f, tests only: the time switches B–F for this turn (default: the flags; time-box.ts v2TimeFlags). */
  timeFlags?: Partial<V2TimeFlags>;
}

/** What applyControlTool needs to know of the turn (Task 7f). */
interface V2ControlCtx {
  tf: V2TimeFlags;
  /** C: the practice part in hand is short of its sentences: its goal is not marked done yet. */
  practiceHold?: { id: string; n: number } | null;
  /** Task 7v fix round 1 (a): the wrap is held for an optional part not yet offered: `real` is the session with the host's wrap; a
   *  tutor-chosen end_lesson that only the moved wrap refuses is deferred once (`deferred`: already deferred, in an earlier reply or
   *  earlier in this one), then accepted. */
  heldWrap?: { real: V2Session; label: string; phase: 'next' | 'in'; deferred: { done: boolean } };
}

/** What the student's grade asks of the tutor's pace. The constitution says to teach at their level; a grade 7
 *  lesson still moved at a senior's pace, a new kind of problem every reply (Praveen, embed-1794453532197). */
export function v2LevelLine(level: string): string {
  const grade = gradeOfLevel(level) ?? NaN;
  if (!Number.isFinite(grade) || grade > 8) return '';
  return grade <= 5
    ? `A child in grade ${grade || 'K'}: one small idea at a time, in short sentences and everyday words. Show a thing with objects or a picture before any symbol, do an example together before asking for one alone, and stay with one kind of problem until it is easy.`
    : `A student in grade ${grade}: go slower than you would with an older student. One new idea per reply, in short sentences and everyday words. Work an example together before they try one alone, and give a second problem of the same kind before moving to a new kind.`;
}

/** The persona card: who the tutor is, in the persona's own words, and how it answers a question about itself. Only a
 *  persona with a `background` has one; without it the constitution's "no job, projects or life story of your own"
 *  stands. Task 6c, ruling 2: with only that line, asked about its work, the tutor said it had a customer-service job
 *  while the partner's persona teaches Japanese professionals (gdi-real-t2 t≈9.7). Never volunteered: v1's persona
 *  told its backstory in every greeting (teacher-persona.ts, 2026-07-09). `enabled` is the kill switch. */
export function v2PersonaCardLines(teacher: V2Session['teacher'], enabled: boolean = TUTOR_V2_PERSONA_CARD): string[] {
  if (!enabled || !teacher?.name || !teacher.background?.trim()) return [];
  return [
    `Your persona card (who you are): ${[teacher.intro?.trim(), teacher.background.trim()].filter(Boolean).join(' ')}`,
    'When they ask about you, answer briefly from this card and turn back to them; never bring it up yourself. Stay consistent with it for the whole session: a small everyday detail may be added only when it fits the card, never a job, place, history or student group the card does not give.',
  ];
}

/** Task 7w (OPENING_PAGE_TITLE): the name of the overview part a spoken lesson that teaches a language opens on (a labelled plan whose
 *  first part is an opening hook), for the opening reply's blank-board fallback; null for every other lesson (the fallback as before). */
export function v2OpeningOverview(session: V2Session, enabled: boolean = TUTOR_V2_OPENING_PAGE_TITLE): string | null {
  const first = session.plan?.segments[0];
  if (!enabled || !first || first.kind !== 'hook' || !v2NoteTargetsOn(session) || !v2PlanLabelled(session.plan)) return null;
  return v2PartOf(first).label ?? null;
}

/** Which English the tutor writes. The courses are American ones (AP, SAT, ACT, grade-numbered), and a tutor that
 *  wrote "centred" and "colour" in an AP lesson would be noticed sooner or later (Praveen, AP Psychology,
 *  portal-e8640e11). A course named the British way keeps its own spelling. */
export function v2EnglishLine(session: V2Session): string {
  if (taughtIn(session.languages)) return '';
  const where = `${session.subject} ${session.topic ?? ''} ${session.level}`;
  if (/\b(?:i?gcse|a[- ]levels?|as[- ]levels?|key stage|ks[1-5]|year\s*\d{1,2}|cbse|icse)\b/i.test(where)) return '';
  return 'When you write or speak English, use American spelling and usage throughout, on the board as well: center, color, organize, math.';
}

export function v2SessionPart(session: V2Session): string {
  const discussion = discussionOf(session.plan);
  if (discussion && session.plan) {
    return [
      'THIS SESSION',
      `Person: ${session.studentName?.trim() || 'name not given'}.`,
      session.teacher?.name ? `You are ${session.teacher.name}${session.teacher.nameIsRole ? ' (a role, not a person\'s name)' : ''}: say so when you greet them.${session.teacher.style ? ` How you talk: ${session.teacher.style}` : ''}` : '',
      ...v2PersonaCardLines(session.teacher),
      // The teaching mode lines speak of mathematics and answers; a discussion has neither.
      session.mode === 'voice'
        ? 'This is a spoken conversation. Your words are read aloud, so write them the way you would say them: no symbols, no lists, no headings. Speech is slow to listen to: a reply of more than about fifty words is a long one. Their words reach you through a speech recogniser, which now and then mishears a word: when what you heard makes no sense where it stands, ask what they meant.'
        : 'This is a typed conversation. They read your replies beside the board. Keep each reply short.',
      v2LessonLanguageSection(session) ?? '',
      session.timeBoxMinutes ? `The conversation is meant to last about ${session.timeBoxMinutes} minutes.` : '',
      session.background?.length ? `What is known about this person:\n${session.background.map((l) => `  - ${l}`).join('\n')}` : '',
      `\n${renderDiscussionMap(session.plan, discussion)}`,
    ].filter(Boolean).join('\n');
  }
  const lines = [
    'THIS SESSION',
    `Student: ${session.studentName?.trim() || 'name not given'}. Subject: ${session.subject}${session.topic ? ` (${session.topic})` : ''}. Level: ${session.level}.`,
    // Who the student chose to be taught by (a partner's teacher persona, the marketing demo's picker).
    session.teacher?.name ? `You are ${session.teacher.name}${session.teacher.nameIsRole ? ' (a role, not a person\'s name)' : ''}: say so when you greet the student.${session.teacher.style ? ` How you teach: ${session.teacher.style}` : ''}` : '',
    ...v2PersonaCardLines(session.teacher),
    v2LevelLine(session.level),
    v2EnglishLine(session),
    v2ModeLines(session.mode),
    v2LanguagesSection(session.languages, session.mode, { pronunciationMeasured: v2PronunciationOn(session) }) ?? '',
    // Only for a lesson taught in another language (lesson-language-section.ts): every other session part is unchanged.
    v2LessonLanguageSection(session) ?? '',
    // Only for a partner that checks the level: every other session part is unchanged.
    v2LevelCheckOn(session) ? v2WorkingLevelSection() : '',
    // Only for a partner that measures pronunciation, in a spoken lesson: every other session part is unchanged.
    v2PronunciationOn(session) ? v2PronunciationSection() : '',
    // Only for a lesson with a second teaching language: every other session part is unchanged.
    // Task 7u (SUMMARY_GROUPS): the summary line names the grouped page where it applies (summary-layout.ts).
    v2SentenceCardsOn(session) ? v2SentenceCardsSection(session.languages!, v2SummaryGroupsOn(session)) : '',
    // Task 7o (NOTE_TARGET_QUOTES): only for a spoken lesson that teaches a language: every other session part is unchanged.
    TUTOR_V2_NOTE_TARGET_QUOTES && v2NoteTargetsOn(session) ? v2NoteTargetsSection() : '',
    // A free trial is the student's to steer (Praveen 2026-10-28: a trial student asked five times for another
    // topic and was kept on the plan). A partner whose showcase is a written lesson keeps its plan (trialKeepsPlan).
    session.trial && !session.trialKeepsPlan ? 'This is a free trial lesson, and the student may take it anywhere. The plan below is the topic they picked when they started. If they ask for a different topic, or a different subject altogether, teach that from then on, starting in the same reply, and leave the plan behind.' : '',
    session.timeBoxMinutes ? `The session is meant to last about ${session.timeBoxMinutes} minutes.` : '',
    session.background?.length ? `What is known about this student from their course and earlier sessions:\n${session.background.map((l) => `  - ${l}`).join('\n')}` : '',
    tutorFigureLines(session),
    // Homework: the problem and its rules stand in for the plan, which only wraps the problem.
    session.homework ? `\n${v2HomeworkPart(session.homework)}` : session.homeworkSheet ? `\n${v2SheetPart(session.homeworkSheet)}` : session.plan ? `\n${renderPlanMap(session.plan)}` : session.topic ? `\nThere is no lesson plan. The student asked to learn: ${session.topic}. Teach that, and whatever else they ask for.` : '\nThere is no lesson plan: teach what the student asks for.',
  ];
  return lines.filter(Boolean).join('\n');
}

/** What goes in the user turn in place of the student's words when they have not spoken. */
export function v2StudentBlock(studentSaid: string | null, state: V2State, silenceSeconds?: number, resumed?: boolean, session?: V2Session, timeCheck?: boolean, roomVoices?: number): string {
  if (studentSaid !== null) return studentSaid;
  if (!!discussionOf(session?.plan) && !resumed && state.history.length === 0) return DISCUSSION_OPENING;
  if (state.history.length === 0 && !resumed && session?.homework) return v2HomeworkOpener(session.homework);
  if (state.history.length === 0 && !resumed && session?.homeworkSheet) return v2SheetOpener(session.homeworkSheet);
  if (resumed) return '[The student\'s page was reloaded in the middle of the lesson and they have just come back. Welcome them back in one short sentence, say where the lesson stood, and carry on from there. What was on the board before is still on it.]';
  if (state.history.length === 0) return '[The session has just started. The student has joined and is waiting for you to begin the lesson. Greet them, then tell them what this lesson is about and what it will cover, and ask whether that sounds good. Keep all of it short: three sentences at most, the plan as two or three plain things and not a list of every step. If what is known about this student shows an earlier session, add one sentence on where that left off. Wait for their answer before teaching.]';
  // After the tutor chose to wait and nothing more came: read as "has not replied", the tutor answered a student
  // it had kept waiting with "I'm here." (algebra, portal-02fd8638).
  if (timeCheck && state.history.length > 0) return '[No one has spoken. The session is nearly out of time: see the time below.]';
  if (roomVoices && state.history.length > 0) return '[The student has not spoken to you. The microphone has been picking up other voices in their room: see below.]';
  if (Math.round(silenceSeconds ?? 0) === V2_WAITED_RECHECK_S) return '[The student has said nothing more: they had finished.]';
  return silenceSeconds ? '[The student has not replied.]' : '[The student sent nothing.]';
}

const defaultModelCall: V2ModelCall = async (params, onText, signal, onBlockEnd) => {
  const { client, model } = getModelClient('brain');
  const stream = client.messages.stream({ ...params, model: params.model || model }, signal ? { signal } : undefined);
  if (onText) stream.on('text', (delta) => onText(delta));
  if (onBlockEnd) stream.on('contentBlock', (block) => onBlockEnd(block.type));
  return stream.finalMessage();
};

function withCacheMark(history: Anthropic.MessageParam[]): Anthropic.MessageParam[] {
  if (!history.length) return [];
  const out = history.slice();
  const last = out[out.length - 1];
  const blocks = typeof last.content === 'string' ? [{ type: 'text' as const, text: last.content }] : last.content.map((b) => ({ ...b }));
  const tail = blocks[blocks.length - 1] as { cache_control?: typeof CACHE };
  if (tail) tail.cache_control = CACHE;
  out[out.length - 1] = { role: last.role, content: blocks as Anthropic.ContentBlockParam[] };
  return out;
}

/** What is kept of an assistant message: its words and its tool calls. Thinking is never stored. */
function storable(content: Anthropic.ContentBlock[]): Anthropic.ContentBlockParam[] {
  const out: Anthropic.ContentBlockParam[] = [];
  for (const b of content) {
    if (b.type === 'text' && b.text.trim()) out.push({ type: 'text', text: b.text });
    else if (b.type === 'tool_use') out.push({ type: 'tool_use', id: b.id, name: b.name, input: b.input });
  }
  return out;
}

export { V2_CLOSING_PAGE } from './part-close';

/** A reply that says only yes (or ok): to "any question, or are you finished?" it says neither (GAC validation, round 2). */
/** Task 7v fix round 1 (a): the start of the once-only end_lesson deferral for an optional part that fits (found in the history). */
export const V2_OPTIONAL_DEFER_PREFIX = 'not ended yet:';
/** Fix round 3 (N3): the same, inside the optional part they took. */
export { V2_OPTIONAL_DEFER_IN_PREFIX } from './summary-hand-over';
export const V2_BARE_ASSENT = /^\s*(?:yes|yeah|yep|yup|ya|y|ok|okay|k|sure|alright|all right|mhm|uh[- ]?huh)\s*[.!]*\s*$/i;

/** The own-question results a homework session keeps (note_own_answer). */
export const V2_MAX_OWN_ANSWERS = 5;

function applyControlTool(state: V2State, session: V2Session, name: string, args: Record<string, unknown>, nowMs: number, studentSaid: string | null = null, ctx: V2ControlCtx = { tf: v2TimeFlags() }): string {
  if (name === 'keep_listening') return 'listening';
  // The student's own stop counts as their request whatever reason the close gives: a refused close tells the tutor
  // to ask what they would like next, a new question to a student who is leaving (stop-signal.ts).
  const asked = args.because === 'student_asked' || (TUTOR_V2_STOP_SIGNAL && v2StopAsked(studentSaid));
  const discussion = discussionOf(session.plan);
  if (name === 'set_working_level') return v2LevelCheckOn(session) ? v2ApplySetWorkingLevel(state, args, { session, heard: studentSaid, timeUp: (!!session.timeBoxMinutes && v2LeftToStopMin(session, state, nowMs, ctx.tf.overrun) <= V2_TIME_UP_MIN) || (TUTOR_V2_LEVEL_CHECK_PUT && v2LevelCheckTimeUp(session, state, nowMs)) }) : 'unknown tool set_working_level';
  if (name === 'practise_pronunciation') return v2PronunciationOn(session) ? v2ApplyPractisePronunciation(state, args) : 'unknown tool practise_pronunciation';
  if (name === 'record_thinking') return discussion ? recordThinking(state, args) : 'unknown tool record_thinking';
  if (name === 'end_lesson' && discussion) {
    // A discussion is done when the person has chosen where to go next, which may well be before the clock: the
    // flow is 8–12 minutes in a box of up to 15. Until then, the clock-or-request rule below holds.
    const box = effectiveMinutes(session.timeBoxMinutes, state.thinking);
    const left = box ? box - (nowMs - state.startedAtMs) / 60000 : 0;
    // A direction is one they named after being asked. When the time ran out in a long silence the close gave
    // "the direction you chose" for a question that had never been put (embed-1794953503551).
    const direction = !directionAnswered(state.history, studentSaid) ? '' : (typeof args.next_direction === 'string' ? args.next_direction.trim().slice(0, 300) : '') || state.thinking?.direction || '';
    // The direction is theirs to name: a direction the tutor wrote itself closed the live test without the
    // question ever being asked (embed-1794694217385). Until it has been asked, only their request or the clock ends it.
    // The close comes after they have said where they stand now: a session went from the middle straight to its end.
    if (!asked && box && left > V2_TIME_UP_MIN && !reflectAsked(state.history, discussion)) {
      return 'not ended: you have not yet asked what they are thinking now and whether anything has shifted. Say nothing of this message. Ask that now as one short question. What they would like to explore next comes after their answer, and the close after that.';
    }
    if (!asked && box && left > V2_TIME_UP_MIN && !directionAsked(state.history)) {
      return 'not ended: you have not asked them yet what they would like to explore next. Say nothing of this message. Ask them that now as one short question, and close after they answer.';
    }
    // Asked, and no word from them since: the question was announced or went unheard.
    if (!asked && box && left > V2_TIME_UP_MIN && !directionAnswered(state.history, studentSaid)) {
      return 'not ended: they have not answered yet. Say nothing of this message. Ask them once more, as one short plain question, what they would like to explore next, and wait for their answer.';
    }
    if (!asked && !direction && box && left > V2_TIME_UP_MIN) {
      return 'not ended: they have not chosen a direction yet. Say nothing of this message. Ask them, in a sentence of your own, what would be most valuable for them to explore further.';
    }
    state.closed = true;
    state.closeSummary = typeof args.summary === 'string' ? args.summary.trim().slice(0, 600) : '';
    if (direction) state.nextDirection = direction;
    return 'the session is ending';
  }
  if (name === 'update_session_note') {
    const note = typeof args.note === 'string' ? args.note.trim() : '';
    if (!note) return 'not saved: the note was empty';
    state.note = note.slice(0, V2_NOTE_MAX_CHARS);
    return note.length > V2_NOTE_MAX_CHARS ? `saved, cut to ${V2_NOTE_MAX_CHARS} characters` : 'saved';
  }
  if (name === 'set_goal_status' && discussion?.stageStarts) return 'recorded';
  if (name === 'set_goal_status') {
    const goal = typeof args.goal === 'string' ? args.goal.replace(/^\[|\]$/g, '').trim() : '';
    const status = args.status as GoalStatus;
    const known = session.plan ? planGoalIds(session.plan) : [];
    if (!known.includes(goal)) return `not recorded: no goal "${goal}" in the plan (goals: ${known.join(', ') || 'none'})`;
    if (!['shown', 'demonstrated', 'skipped'].includes(status)) return 'not recorded: status must be shown, demonstrated or skipped';
    // Task 7f C (PART_MIN_PRACTICE): the practice part in hand is not done before the learner has said their sentences.
    if (ctx.practiceHold && goal === ctx.practiceHold.id && status !== 'skipped') return `not recorded: they have said ${ctx.practiceHold.n} of the ${V2_MIN_PRACTICE} practice sentences of their own this part needs. Say nothing of this message; ask them for another sentence of their own before the part is done`;
    state.goals[goal] = { status, ...(typeof args.why === 'string' && args.why.trim() ? { why: args.why.trim().slice(0, 120) } : {}), at: nowMs };
    return 'recorded';
  }
  if (name === 'track_gap') {
    const what = typeof args.what === 'string' ? args.what.trim().slice(0, 80) : '';
    const status = args.status as GapStatus;
    if (!what) return 'not recorded: say what the gap is';
    if (!GAP_STATUSES.includes(status)) return `not recorded: status must be one of ${GAP_STATUSES.join(', ')}`;
    const gaps = state.gaps ?? [];
    const key = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    const at = gaps.findIndex((g) => key(g.what) === key(what));
    if (at >= 0) gaps[at] = { what: gaps[at].what, status }; else gaps.push({ what, status });
    state.gaps = gaps.slice(-V2_MAX_GAPS);
    return 'recorded';
  }
  if (name === 'set_current_problem') {
    const sheet = session.homeworkSheet;
    const n = Number(args.n);
    if (!sheet) return 'not done: this session has no homework sheet';
    if (!sheet.problems.some((p) => p.n === n)) return `not done: the sheet has no problem ${args.n} (problems: ${sheet.problems.map((p) => p.n).join(', ')})`;
    const rec = state.homework?.sheet ?? { current: sheet.problems[0].n, since: 0, solved: [], confirmed: {} };
    // The student's messages from the next one on belong to this problem (homework-turn.ts reads from `since`).
    state.homework = { ...(state.homework ?? { confirmed: [] }), sheet: { ...rec, current: n, since: state.history.length + 1 } };
    return `now on problem ${n}${rec.solved.includes(n) ? ' (already solved)' : ''}`;
  }
  if (name === 'note_own_answer') {
    if (!session.homework && !session.homeworkSheet) return 'not recorded: this is not a homework session';
    const a = typeof args.answer === 'string' ? args.answer.trim().slice(0, 120) : '';
    const q = typeof args.question === 'string' ? args.question.trim().slice(0, 200) : '';
    if (!a) return 'not recorded: give the final result';
    const own = [...(state.homework?.own ?? []).filter((o) => o.q !== q), { q, a }].slice(-V2_MAX_OWN_ANSWERS);
    state.homework = { ...(state.homework ?? { confirmed: [] }), own };
    return 'recorded: never state it before they have written it';
  }
  if (name === 'end_lesson') {
    // Ending is the student's decision or the clock's. With time left and no request to stop, the tutor
    // twice closed the lesson by itself after the last planned problem (embed-1794336536781, -1794339843244).
    const left = session.timeBoxMinutes ? session.timeBoxMinutes - (nowMs - state.startedAtMs) / 60000 : 0;
    // Homework: the session is for one problem, and a solved one ends it (homework.ts).
    // Not in the reply that completes it: the student may still ask why (GAC validation on v2, Geometry).
    const homeworkDone = (!!session.homework && state.homework?.done === true && state.history.length > (state.homework.doneAt ?? -1))
      || (!!session.homeworkSheet && session.homeworkSheet.problems.every((p) => state.homework?.sheet?.solved.includes(p.n)));
    // Homework: a bare yes does not say the student is finished, whatever the tutor asked. Five validation sessions
    // closed on "yes" to "…or are you ready to go back?", cutting off a student who might have had a question.
    if ((session.homework || session.homeworkSheet) && studentSaid !== null && V2_BARE_ASSENT.test(studentSaid) && left > V2_TIME_UP_MIN) {
      return 'not ended: "yes" does not say whether they are finished. Ask, in one short question with one meaning, whether they have any question about it.';
    }
    // Task 7f D (CLOSE_BY_CONTENT): the close is open when the plan's parts are done or the wrap minute is reached (time-box.ts).
    // Task 7v fix round 1 (a): the close is open by the host's wrap but not by the wrap moved for an optional part that fits and was
    // not offered: deferred once (the 7d pattern), never twice, never when they asked to stop.
    const held = ctx.heldWrap;
    if (!asked && !homeworkDone && held && !v2CloseOpen(session, state, nowMs, ctx.tf.closeByContent) && v2CloseOpen(held.real, state, nowMs, ctx.tf.closeByContent)) {
      if (!held.deferred.done) {
        held.deferred.done = true;
        return held.phase === 'in'
          ? `${V2_OPTIONAL_DEFER_IN_PREFIX} they chose the optional ${held.label} part and its minutes are not over. Say nothing of this message. Finish the item in hand with them, then give the summary and close.`
          : `${V2_OPTIONAL_DEFER_PREFIX} the optional ${held.label} part still fits before the session must end and has not been offered. Say nothing of this message. In one sentence of your own, offer it before the summary; if they would rather not, go to the summary and close.`;
      }
    } else if (!asked && !homeworkDone && !v2CloseOpen(session, state, nowMs, ctx.tf.closeByContent)) {
      // Said to the student as the tutor's own thought. The first wording was repeated to them: "The system says
      // there are about seven minutes left and you haven't asked to stop" (embed-1794595194384).
      // Task 6g (CLOSE_ONE_QUESTION): once the summary has begun, the menu offers no more practice: gdi-real-james's review began
      // with eight minutes left, and the refusal's "something harder, more practice" brought two offers of practice (v2audio-6f).
      if (!discussion && v2SummaryBegun(state)) return 'not ended: the session goes on. Whether to stop is the student\'s choice, and they have not made it. Say nothing of this message or of the clock. The summary has begun, so offer no more practice: in one sentence of your own, ask whether they have a question about today\'s lesson or would like to stop here.';
      return `not ended: the session goes on. Whether to stop is the student's choice, and they have not made it. Say nothing of this message or of the clock. In one sentence of your own, ask what they would like now: something harder, more practice, a question of their own, or to stop here.`;
    }
    state.closed = true;
    state.closeSummary = typeof args.summary === 'string' ? args.summary.trim().slice(0, 600) : '';
    return 'the session is ending';
  }
  return `unknown tool ${name}`;
}

export async function runV2Turn(given: V2TurnInput): Promise<V2TurnResult> {
  // Spoken words come through a recogniser that writes "this one" as "this 1" (heard.ts).
  const input: V2TurnInput = given.session.mode === 'voice' && given.studentSaid ? { ...given, studentSaid: heardAsWords(given.studentSaid) } : given;
  let { session } = input;
  // Task 7n (FLAG_CLOCK_PAUSE): the lesson clock, less the time the tester's flag panel held it (time-box.ts v2LessonNowMs).
  const nowMs = v2LessonNowMs(input.nowMs ?? Date.now(), input.state, session.timeBoxMinutes);
  // A discussion whose plan scripts the welcome opens on those words exactly, the same in every session: no model
  // call (the partner asked for one consistent introduction, 2026-11-17).
  const welcome = !given.state.history.length && given.studentSaid === null && !given.facts?.resumed ? (() => { const d = discussionOf(session.plan); return d ? scriptedWelcome(d, { person: session.studentName, tutor: session.teacher?.name }) : null; })() : null;
  const callModel: V2ModelCall = welcome
    ? async (_params, onText) => { onText?.(welcome); return { id: 'scripted_welcome', type: 'message', role: 'assistant', model: '', content: [{ type: 'text', text: welcome, citations: null }], stop_reason: 'end_turn', stop_sequence: null, usage: { input_tokens: 0, output_tokens: 0, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 } } as unknown as Anthropic.Message; }
    : input.callModel ?? defaultModelCall;
  const applyBoard = input.applyBoard ?? applyToModelBoard;
  // The turn works on a copy: a failed model call leaves the caller's state as it was.
  const state: V2State = structuredClone(input.state);
  // Task 8g (PAIR_PAINTED_ONLY; mic test 11, embed-1795220913119 T54): the board's items when the turn began. A sentence card pointed back
  // at one of them is a card of an earlier turn: no correction of this turn (the practice pairing, the 7w record).
  const itemsAtStart = new Set(state.board.pages.flatMap((pg) => pg.items.map((it) => it.id)));
  const pointsAtThisReply = (id: string | undefined): boolean => !!id && (!TUTOR_V2_PAIR_PAINTED_ONLY || !itemsAtStart.has(id));
  // A "no" to "does that level still feel right?" sets the remembered level aside and re-opens the check (D6).
  const levelReopened = v2ReopenLevelCheck(session, state, input.studentSaid);
  // A level remembered from an earlier lesson skips the level-check parts before the tutor speaks.
  v2MarkLevelKnownParts(session, state, nowMs);

  /** The first reply of the session: nothing has been said by either side. */
  const opening = !state.history.length && input.studentSaid === null;
  const discussion = !!discussionOf(session.plan);
  const studentText = v2StudentBlock(input.studentSaid, state, input.facts?.silenceSeconds, input.facts?.resumed, session, input.facts?.timeCheck, input.facts?.roomVoices);
  // Task 7f: the time switches for this turn. A taught lesson's time is up at the box plus the overrun margin (F).
  const tf = v2TimeFlags(input.timeFlags, session);
  // Task 7n (PART_ASK_LANGS): the lesson's teaching languages, whose language packs read its part asks and answers.
  const askLangs: readonly string[] = session.languages?.length ? session.languages : ['en'];
  // Merge with main (Task 8e): without main's note on a cut reply (interrupted.ts): the system's, not the tutor's words.
  const lastTutorText = v2WithoutCutBoardNote((() => { const m = [...state.history].reverse().find((h) => h.role === 'assistant' && (typeof h.content === 'string' || h.content.some((c) => c.type === 'text'))); return !m ? '' : typeof m.content === 'string' ? m.content : m.content.map((c) => (c.type === 'text' ? c.text : '')).join(' '); })());
  // Task 7v (OPTIONAL_FIT): while an optional part fits by the 7i fit (in hand, or next and offered or still to offer), the wrap
  // minute moves to where its minutes and the summary's still fit (time-fit.ts v2OptionalWrapMin): every wrap reader of this turn
  // (the closing turn, the time line, the close by the clock) reads the moved minute. Mic test 6 (embed-1795067373124): "Uh, yes,
  // let's go." at 18.1 to Pronunciation, offered at 17.85, opened nothing because the wrap was 18.
  // Fix round 1 (m2): not on the turn of their no to it (or to going on to the summary past it), which the 7r block below records.
  const declining = !!session.plan && TUTOR_V2_PART_GO_NAMED && input.studentSaid !== null && (v2OptionalDeclined(session.plan, state, lastTutorText, input.studentSaid, askLangs) >= 0 || v2SummaryGo(input.studentSaid, lastTutorText, session.plan, state, askLangs));
  const realSession = session;
  const optionalHeld = !discussion && session.plan && !declining && !(TUTOR_V2_STOP_SIGNAL && v2StopAsked(input.studentSaid)) ? v2OptionalWrapMin(session, state, nowMs, v2WrapMin(session, tf.closeByContent), v2MarginMin(session, tf.overrun), (() => { const a = v2PendingPart(session.plan!, state, lastTutorText, null, undefined, askLangs); return a ? session.plan!.segments[a.index]!.id : null; })()) : null;
  if (optionalHeld) session = { ...session, wrapMinutes: optionalHeld.wrap };
  // Fix round 1 (a): the once-only deferral of a tutor-chosen end_lesson while the part is next and not yet offered.
  const heldPart = optionalHeld && session.plan ? session.plan.segments.find((x) => v2PartOf(x).label === optionalHeld.label) : undefined;
  // Fix round 3 (N3, ruling): inside the optional part too, deferred once, then accepted (its own prefix: a deferral before it was
  // offered does not count for one inside it).
  const deferPrefix = optionalHeld?.phase === 'in' ? V2_OPTIONAL_DEFER_IN_PREFIX : V2_OPTIONAL_DEFER_PREFIX;
  const deferredBefore = state.history.some((h) => Array.isArray(h.content) && h.content.some((c) => c.type === 'tool_result' && typeof c.content === 'string' && c.content.startsWith(deferPrefix)));
  const heldWrap: V2ControlCtx['heldWrap'] = heldPart && (optionalHeld!.phase === 'in' || v2PartOffers(heldPart, state.history) === 0) ? { real: realSession, label: optionalHeld!.label, phase: optionalHeld!.phase, deferred: { done: deferredBefore } } : undefined;
  const leftMin = v2LeftToStopMin(session, state, nowMs, tf.overrun);
  const closingTurn = (TUTOR_V2_STOP_SIGNAL && v2StopAsked(input.studentSaid)) || leftMin <= V2_TIME_UP_MIN
    // Lessons only: the wrap fact is the lesson's time line, and homework and a discussion are paced by their own (review 5a M2).
    || (!discussion && !session.homework && !session.homeworkSheet && v2WrapDue(session, (nowMs - state.startedAtMs) / 60000, undefined, tf.closeByContent));
  let inviteRefused = false; let inviteWait = false;
  // Task 7a (PART_PAGE_CHIP, PART_ASK_EVERY): spoken teaching lessons whose plan parts all have names. Chip, page and part
  // move together (part-flow.ts), and every part change after the level check is asked first.
  const partFlow = (input.partFlags?.pageChip ?? TUTOR_V2_PART_PAGE_CHIP) && session.mode === 'voice' && !discussion && !session.homework && !session.homeworkSheet && v2PlanLabelled(session.plan);
  const askEvery = v2AskEveryOn(session, input.partFlags?.askEvery);
  // Task 7g (QUESTION_CARD): spoken lessons that teach a language (two teaching languages, or pronunciation measured).
  // Task 7o: spoken lessons that teach a language (note-targets.ts): the target of a note is marked on the board.
  const noteTargets = v2NoteTargetsOn(session);
  // Task 8e fix round 1 (OWN_KEY_NOT_LANGUAGE): in such a lesson a question card is no problem with an answer to work out: main's
  // worked key (below, ownKeys) is neither recorded for it nor worked.
  const noOwnKey = (input.ownKeyNotLanguage ?? TUTOR_V2_OWN_KEY_NOT_LANGUAGE) && noteTargets;
  // Task 7p: spoken lessons taught through the learner's own language (card-gloss.ts).
  const cardGloss = v2CardGlossOn(session);
  const questionCards = TUTOR_V2_QUESTION_CARD && session.mode === 'voice' && !discussion && !session.homework && !session.homeworkSheet && ((session.languages?.length ?? 0) >= 2 || !!session.pronunciation);
  const stopAsked = TUTOR_V2_STOP_SIGNAL && v2StopAsked(input.studentSaid);
  // Task 7k (PRACTICE_ON_PART_PAGE): their words ask for practice of another part (time-fit.ts v2PartPracticeAsked: recognising
  // only). The board turns to its page below, before the reply writes; nothing of the lesson's state moves on it.
  // Fix round 1 (I1, ruling b): `ahead` (a later part before the close) opens nothing: facts only.
  let partAsk = partFlow && session.plan && !state.closed && !stopAsked && leftMin > V2_MORE_PRACTICE_MIN_LEFT ? v2PartPracticeAsked(session.plan, state, input.studentSaid) : null;
  // Fix round 2 (N1): an answer to the lesson's own part ask belongs to the 7a part flow alone: no visit handling and no "comes
  // later" line for the part the last reply asked about, nor for the next part ("Shall we go on to pronunciation?" → "Yes,
  // let's try some pronunciation." was told it "comes later" beside the page 7a opened).
  if (partAsk?.ahead && session.plan) {
    const pending = v2PendingPart(session.plan, state, lastTutorText, input.studentSaid, undefined, askLangs);
    if (partAsk.index === pending?.index || partAsk.index === v2NextPart(session.plan, state, v2PartInHand(session.plan, state))) partAsk = null;
  }
  const visitAsk = partAsk && !partAsk.ahead ? partAsk.index : -1;
  // Task 7k (CLOSE_REOPENED): a close the client marked reopened (spoken over: useV2Turns) is re-armed: closeInvitedAt clears,
  // so the next end_lesson waits for the ask "more, or finish?" once (the 7d deferral), and the facts press no goodbye.
  if (TUTOR_V2_CLOSE_REOPENED && !state.closed && typeof state.closeReopened === 'number') delete state.closeInvitedAt;
  // Task 7z (UNHEARD_ASK_OWED): a close step whose ask the learner did not hear (state.unheard: they spoke over it) is not counted as
  // given and is owed again: the invitation (closeInvitedAt clears) or the check question (owed in this reply). Mic test 8
  // (embed-1795115593161, T103–T105). Read before inviteOwed / checkOwed below.
  // Task 8d (CLOSE_SUMMARY_ONCE): the summary was given by an earlier reply (its page up or its reply recorded), as the turn began.
  const summaryGivenBefore = v2SummaryGiven(state);
  const unheardAsks = v2UnheardCloseAsks(session, state, { nowMs, stopAsked, said: input.studentSaid, languages: askLangs });
  const reopened = v2CloseReopened(state);
  // …and after the invitation, their words asking for more practice or another part (recognising only: the facts allow it, and
  // an end_lesson in this reply is never refused for it, 7f E). The close is reopened after the reply, only if the reply did
  // not end the lesson: the lesson took the request up.
  const reopenAsked = TUTOR_V2_CLOSE_REOPENED && v2CloseInviteOn(session) && !state.closed && typeof state.closeInvitedAt === 'number' && !!input.studentSaid && !stopAsked && leftMin > V2_MORE_PRACTICE_MIN_LEFT
    && (visitAsk >= 0 || v2AsksMorePractice(input.studentSaid, { plan: session.plan }));
  // Fix round 1 (I2): this turn answers the recorded ask "more, or finish?" (state, not their words): the facts press no goodbye,
  // its end_lesson is never refused, and a reply that gives more practice without ending the lesson reopens the close.
  // Fix round 2 (N2): gated on the time left as reopenAsked is.
  const answersMoreAsk = TUTOR_V2_CLOSE_REOPENED && v2CloseInviteOn(session) && !state.closed && typeof state.closeInvitedAt === 'number' && state.closeAsk === 'more' && input.studentSaid !== null && !stopAsked && leftMin > V2_MORE_PRACTICE_MIN_LEFT;
  // Task 7d (CLOSE_INVITES_QUESTIONS): their questions are still to be invited before the close (close-invite.ts: only where
  // the clock lets the tutor close). As the turn began: an invitation given in this turn does not lift the refusal for the
  // rest of it. A second end_lesson in the reply ends the turn there, open (fix round 1, I2). Task 7k: also the ask after a
  // reopened close.
  // Task 7w (SUMMARY_OPENS_CLOSE): both are read again when this reply begins the summary (summaryOpensNow, below).
  let inviteOwed = v2CloseInviteOwed(session, state, { nowMs, stopAsked, closeByContent: tf.closeByContent, overrun: tf.overrun });
  // Task 7u (CLOSE_CHECK): the plan's check question is owed before the invitation, or was asked and their words now answer it.
  let checkOwed = v2CloseCheckOwed(session, state, { nowMs, stopAsked, closeByContent: tf.closeByContent, overrun: tf.overrun });
  // Task 7w: the check owed late (the summary reply before this one skipped it): owed in this reply only.
  const checkLateBefore = typeof state.closeCheckLate === 'number';
  // Fix round 1 (I1, ruling): the check step defers a tutor end_lesson once in total: after that one deferral the check is dropped and
  // the invitation step follows. Fix round 2 (N1, ruling): a deferral counts only once the summary has begun (state.closeCheckDeferredAt,
  // stamped after a reply whose check refusal came with the summary begun); one before the summary (7u's, the close open by the clock)
  // is given as before 7w and spends nothing. `checkDeferred`: this reply's counted one.
  const checkDeferredBefore = v2SummaryOpensCloseOn(session) && typeof state.closeCheckDeferredAt === 'number';
  let checkDeferred = false;
  if (checkDeferredBefore) checkOwed = false;
  // Fix round 2 (M1 kept): the generic menu given to an end_lesson in this reply (before any summary): a Summary page that then opens the
  // close in the same reply drops a menu question after it (6g's gate) and ends the reply on the question owed instead.
  let menuGiven = false;
  const checkPending = v2CloseCheckPending(session, state);
  // Task 7f C (PART_MIN_PRACTICE): the learner's words count for the part in hand, before any page opens on their yes. Task 7k:
  // not their request for practice of another part.
  if (tf.minPractice && partFlow && session.plan && !partAsk) v2CountPractice(session.plan, state, input.studentSaid, lastTutorText, undefined, askLangs);
  // Task 7i (OPTIONAL_AT_ARRIVAL): an optional part is decided as the lesson arrives at it (time-fit.ts v2ArrivalDrops), measured
  // against the box plus the margin from the real elapsed time. Before any page opens on their yes: a yes to a part left out
  // opens nothing. Labelled plans only (fix round 1, I2): a plan without part names keeps the 7f up-front drop.
  // Fix round 1 (I1): a part left out that their words name is only told to the model (the facts, permissive: the minutes left);
  // it is taken after all only once the lesson enters it (v2TakeEnteredDropped), never on their words.
  const arrivalOn = tf.noSqueeze && TUTOR_V2_OPTIONAL_AT_ARRIVAL && !!session.timeBoxMinutes && !discussion && !session.homework && !session.homeworkSheet && v2PlanLabelled(session.plan);
  const marginMin = v2MarginMin(session, tf.overrun);
  let droppedAsked: { label: string; minutes: number; left: number; fits: boolean; notReached?: true } | undefined;
  // Task 7r fix round 4 (I-E, the controller's ruling: declining an optional part is state): the optional part the last reply
  // offered on arrival that their answer says no to (part-flow.ts v2OptionalDeclined); -1: none.
  let declinedNow = -1;
  if (arrivalOn && session.plan && state.timeFit?.byArrival && !state.closed) {
    const usedMin = (nowMs - state.startedAtMs) / 60000;
    v2TakeEnteredDropped(session.plan, state);
    // …it is left out as a part left out for time is (plan order then gives the summary), and so is an optional part not entered
    // when they say go to an ask that names only the summary (v2SummaryGo): the tutor moved past it with their yes.
    if (partFlow && TUTOR_V2_PART_GO_NAMED && input.studentSaid !== null && !closingTurn) {
      const plan = session.plan;
      declinedNow = v2OptionalDeclined(plan, state, lastTutorText, input.studentSaid, askLangs);
      const out = declinedNow >= 0 ? [declinedNow] : v2SummaryGo(input.studentSaid, lastTutorText, plan, state, askLangs) ? v2OptionalAhead(plan, state) ?? [] : [];
      if (!v2LeaveOutByChoice(state, out.map((i) => plan.segments[i]!.id)).length) declinedNow = -1;
    }
    const named = v2DroppedMentioned(session.plan, state, input.studentSaid, usedMin, session.timeBoxMinutes, marginMin);
    if (named) { const seg = session.plan.segments[named.index]!; droppedAsked = { label: v2PartOf(seg).label ?? seg.id, minutes: named.minutes, left: named.left, fits: named.fits, ...(named.notReached ? { notReached: true as const } : {}) }; }
    // Fix round 1 (minor 2): the part the last reply asked about keeps the decision made at the ask.
    const asked = v2PendingPart(session.plan, state, lastTutorText, null, undefined, askLangs); const lastAsked = asked ? session.plan.segments[asked.index]!.id : null;
    const more = v2ArrivalDrops(session.plan, state, usedMin, session.timeBoxMinutes, marginMin, lastAsked);
    // Fix round 1 (minor 1): `toldIds` and the rest kept (a part already told is not told again); only `told`, "every part left
    // out has been told", clears, as the new one has not been.
    if (more.length) { const { told: _told, ...rest } = state.timeFit; void _told; state.timeFit = { ...rest, dropped: [...state.timeFit.dropped, ...more] }; }
    // A page held for a part now left out waits no more: the reply that tells them names it, and naming a held part opens it (7e).
    if (state.heldPage && state.timeFit.dropped.includes(state.heldPage.part)) delete state.heldPage;
  }
  // A part change the student has said yes to opens its page as the reply begins, whether or not the reply writes it again:
  // the present perfect page held at 6.64 never opened after "yes, we move on", and the part was taught on the job's page;
  // pronunciation, taken up after the offer, ran on the conversation's page (mic test 1, embed-1794882458629). Opened before
  // the facts, so the board they show is the board the reply speaks over.
  let released: V2ToolCall | null = null; let releasedFrom = -1;
  // Task 8d (ANSWER_OVER_ASK): their words came over the part ask itself (the first sentence they did not hear is the ask's): the reply
  // is read as written, so a go to it answers it (mic test 10, embed-1795202398886: "Yes." over T52's ask, asked again at T54).
  // Fix round 1 (I1, ruling): an ask cut whole (not the sentence playing) is as at 74014f96: a go is read on the heard words, and a held
  // page or an explicit order releases as before.
  const unheardAsk = partFlow && session.plan && input.studentSaid !== null && !state.closed && !closingTurn ? v2UnheardPartAsk(session.plan, state, lastTutorText, askLangs) : null;
  const overAsk = unheardAsk?.playing ? unheardAsk : null;
  const moveText = overAsk?.text ?? lastTutorText;
  if (partFlow && session.plan && input.studentSaid !== null && !state.closed && !closingTurn && v2MoveAnswer(input.studentSaid, moveText, askLangs, undefined, session.plan) === 'go') {
    // Fix round 1 (I2, ruling): 「X で、」 names X only here, choosing the part of the ask the reply ends on.
    const pending = v2PendingPart(session.plan, state, moveText, input.studentSaid, undefined, askLangs, undefined, TUTOR_V2_ANSWER_OVER_ASK);
    if (pending && !(arrivalOn && state.timeFit?.dropped.includes(session.plan.segments[pending.index]!.id))) {
      const id = `inl_${nowMs.toString(36)}_0`; const args = { title: pending.title }; releasedFrom = state.board.current;
      const o = applyBoard(state.board, id, 'new_page', args);
      if (o.painted) released = { id, name: 'new_page', args, outcome: o.detail, inline: true, agreed: true };
      // …heard and answered: the ask leaves the "not heard" line (the facts would ask it again).
      if (released && overAsk) {
        const key = (x: string) => x.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim(); const asked = new Set(overAsk.ask.map(key));
        const rest = (state.unheard ?? []).filter((x) => !asked.has(key(x)));
        if (rest.length) state.unheard = rest; else delete state.unheard;
      }
    }
  }
  // Task 7k (PRACTICE_ON_PART_PAGE): practice they asked for of another part is done on that part's page: the board turns to it
  // as the reply begins (its newest page; a new page under its name when it has none), so no card of it lands on the page in
  // view (mic test 3, embed-1794967959470, flags 5, 7, 8). A part left out for time only while it still fits (7i).
  let visit: V2ToolCall | null = null; let visitFrom = -1;
  // Task 7v (OPTIONAL_FIT): an optional part not reached, asked for at the close, only while it fits (the 7i fit).
  const notReachedVisit = visitAsk >= 0 && !!session.plan && TUTOR_V2_OPTIONAL_FIT && v2OptionalAskedAtClose(session.plan, state, input.studentSaid) === visitAsk;
  if (visitAsk >= 0 && session.plan && !released && (notReachedVisit ? !!droppedAsked?.fits : !state.timeFit?.dropped.includes(session.plan.segments[visitAsk]!.id) || !!droppedAsked?.fits)) {
    const plan = session.plan; const label = v2PartOf(plan.segments[visitAsk]!).label!;
    let at = -1; state.board.pages.forEach((pg, i) => { if (v2PartOfPage(plan, pg.title) === visitAsk) at = i; });
    const id = `inl_${nowMs.toString(36)}_visit`; visitFrom = state.board.current;
    const name = at >= 0 ? 'go_to_page' : 'new_page';
    const args = at >= 0 ? { pageIndex: at, page: at + 1, title: state.board.pages[at]!.title } : { title: label };
    const o = applyBoard(state.board, id, name, args);
    // Fix round 1 (I1, ruling a): a page the visit opens is marked, and never counts for the position, green or a part reached.
    if (o.painted && name === 'new_page') state.visitPages = [...(state.visitPages ?? []), state.board.current].slice(-20);
    // Merge with main (Task 8e): a turn the part flow has its own word for (practice on another part's page, or back on the
    // position's page) is not main's "look back" (board.look, 75b5df1b): the practice is written on the page in view, and the way
    // back is the position's page block, so the next write is not returned to the last page and the facts do not say it will be.
    const turnNote = o.painted ? v2PageTurnNote(plan, state) : null;
    if (turnNote) delete state.board.look;
    if (o.painted) visit = { id, name, args, outcome: turnNote ?? o.detail, inline: true, ...(name === 'new_page' ? { agreed: true, visit: true as const } : {}) };
  }
  // Task 7s (PRONUNCIATION_PAGE): spoken lessons that teach a language with measured pronunciation and a plan part for it. Its page
  // in view: each item armed is written on it as a card (settle, below), and a measured attempt counts as practice of the part,
  // so the part is entered and the close names it as done (mic test 5, embed-1795050656326: "We didn't get to the pronunciation
  // part today" after two scored words on an empty, hidden page).
  const pronPart = TUTOR_V2_PRONUNCIATION_PAGE && noteTargets && v2PronunciationOn(session) && session.plan ? session.plan.segments.findIndex((seg) => !!v2PartOf(seg).pronunciation) : -1;
  const onPronPage = () => pronPart >= 0 && !!session.plan && state.board.current >= 0 && !!state.board.pages[state.board.current] && v2PartOfPage(session.plan, state.board.pages[state.board.current]!.title) === pronPart;
  if (pronPart >= 0 && !state.closed && state.pronunciation?.heard?.status === 'measured' && state.pronunciation.armed?.seq === state.pronunciation.heard.seq && onPronPage()) {
    const id = session.plan!.segments[pronPart]!.id;
    state.practiceSaid = { ...(state.practiceSaid ?? {}), [id]: Math.min(99, (state.practiceSaid?.[id] ?? 0) + 1) };
  }
  // Task 7v (PART_CLOCK): a part the lesson entered on their yes begins now.
  v2MarkPartStart(session, state, nowMs);
  // Task 7f B (TIME_NO_SQUEEZE): the parts left out for time, decided once, when the first teaching part has opened.
  // Task 7i (OPTIONAL_AT_ARRIVAL): nothing left out up front unless the required parts alone exceed the box plus the margin.
  if (v2TimeFitDue(session, state, tf.noSqueeze) && session.plan) state.timeFit = arrivalOn ? v2TimeFitUpFront(session.plan, state, session.timeBoxMinutes, marginMin) : { dropped: v2PartsToDrop(session.plan, state, session.timeBoxMinutes) };
  // Task 7f C: the practice part in hand still short of its sentences (spoken lessons with labelled plans; not at the close).
  const summaryEarlier = !!session.plan && v2SummaryBegun(state);
  const practiceShort = tf.minPractice && partFlow && askEvery && session.plan && !closingTurn && !summaryEarlier && !state.closed ? v2PracticeShort(session.plan, state) : null;
  // Task 7f E (MORE_PRACTICE): words that look like a request for more practice once the summary has begun, or at the close.
  // Fix round 4: this only informs. The facts say practice is allowed (or that there is no time today) and the model decides
  // from the learner's meaning; no end_lesson is refused for it. Enforced, each misread closing remark ("Let's do this again
  // sometime.", 「明日もう一回お願いします。」) held a lesson open past the learner's answer to the invitation.
  const atClose = summaryEarlier || typeof state.closeInvitedAt === 'number' || reopened || closingTurn || (!!session.timeBoxMinutes && v2CloseOpen(session, state, nowMs, tf.closeByContent));
  const morePractice = tf.morePractice && !discussion && !session.homework && !session.homeworkSheet && !!session.plan && !state.closed && !stopAsked && (v2AsksMorePractice(input.studentSaid, { plan: session.plan }) || visitAsk >= 0) && atClose
    ? leftMin > V2_MORE_PRACTICE_MIN_LEFT : undefined;
  // Task 7g (CARD_EVERY_SENTENCE): the sentences of their practice answer owed a card in this reply (learner-card.ts), read on
  // the state the facts read.
  // Task 7k (PRACTICE_ON_PART_PAGE): practice on another part's page (v2PartViewed) is carded there, at the close too.
  const viewed = partFlow && session.plan ? v2PartViewed(session.plan, state) : -1;
  const backAt = viewed >= 0 && session.plan ? v2PositionPage(session.plan, state) : -1;
  // Fix round 1 (M7): never a turn-back line with no page to turn back to.
  const partVisit = viewed >= 0 && backAt >= 0 && session.plan ? { label: v2PartOf(session.plan.segments[viewed]!).label!, title: state.board.pages[state.board.current]!.title, back: state.board.pages[backAt]!.title, opened: !!visit } : undefined;
  const partAhead = partAsk?.ahead && !released && session.plan ? v2PartOf(session.plan.segments[partAsk.index]!).label! : undefined;
  const answerSentences = session.mode === 'voice' && !discussion && !session.homework && !session.homeworkSheet && (!v2SummaryBegun(state) || viewed >= 0) ? v2PracticeAnswerSentences(session, state, input.studentSaid) : [];
  // Task 7q (SUPPORT_STEPS, RETEST_MISTAKE): the practice part their answer belongs to, and this turn's lines (adaptive.ts). Facts only.
  const adaptFlags = { ...input.adaptFlags, support: input.adaptFlags?.support ?? TUTOR_V2_SUPPORT_STEPS, retest: input.adaptFlags?.retest ?? TUTOR_V2_RETEST_MISTAKE };
  const adaptPart = v2AdaptPart(session, state);
  // Task 7x (REPEAT_THEN_WAIT): a reply to their practice answer in a spoken language lesson with a labelled plan.
  const repeatWaitOn = TUTOR_V2_REPEAT_THEN_WAIT && v2AdaptOn(session) && answerSentences.length > 0 && !state.closed;
  const adaptBefore = v2AdaptBefore(session, state, input.studentSaid, nowMs, adaptFlags);
  // Task 7x (PART_FIRST_STEP): their words in the optional part taken ask to leave it (not on the turn its page opened on their yes);
  // then whether it is still held (optional-hold.ts). Facts only.
  if (!released) v2NoteOptionalLeave(session, state, input.studentSaid, stopAsked);
  const optionalHold = !closingTurn && !discussion ? v2OptionalHold(session, state, nowMs, marginMin) : null;
  // Task 7z (OPTIONAL_ONE_MORE): the hold lifted, minutes of the part left: the facts ask "one more, or move on?" first.
  const optionalOneMore = !closingTurn && !discussion && !optionalHold && !stopAsked ? v2OptionalOneMore(session, state, nowMs, marginMin) : null;
  const dMeta = discussionOf(session.plan);
  if (dMeta && session.plan) syncDiscussionStages(state, session.plan, dMeta, nowMs);
  const untoldBefore = dMeta ? untoldCases(dMeta, state.history) : [];
  const facts = renderFacts(session, state, { ...input.facts, nowMs, ...(adaptBefore.lines.length ? { adaptive: adaptBefore.lines } : {}), heard: input.studentSaid, time: tf, ...(practiceShort ? { practiceShort } : {}), ...(morePractice !== undefined ? { morePractice } : {}), ...(stopAsked ? { stopAsked: true } : {}), ...(levelReopened ? { levelReopened: true } : {}), ...(released ? { partOpened: String(released.args.title) } : {}), ...(input.partFlags?.askEvery !== undefined ? { partAskEvery: input.partFlags.askEvery } : {}), ...(droppedAsked ? { droppedAsked } : {}), ...(partVisit ? { partVisit } : {}), ...(partAhead ? { partAhead } : {}), ...(reopenAsked ? { reopenAsked: true } : {}), ...(optionalHeld && !closingTurn ? { optionalHeld } : {}), ...(repeatWaitOn && !v2FreeConvQuiet(session, state, adaptPart, adaptFlags.free) ? { repeatWait: true } : {}), ...(optionalHold ? { optionalHold } : {}), ...(unheardAsks.invite ? { inviteUnheard: true } : {}), ...(adaptBefore.free ? { freeConv: adaptBefore.free } : {}), ...(adaptBefore.noStarter ? { noStarter: true } : {}), ...(adaptBefore.partner ? { freePartner: true } : {}), ...(optionalOneMore ? { optionalOneMore } : {}) });
  // Task 7i (STAY_IN_PART): the unheard sentences are named in these facts once.
  delete state.unheard;
  // A reply that closes the session: the student's words ask to stop, or the time is up (V2_TIME_UP_MIN, as the facts
  // say it). A page it opens is the summary's, and is never held for "shall we go on?" (part-close.ts): held, "Sorry, I
  // have to finish now." in a two-page lesson got "Next is summary. Shall we go on?" and the summary, its sentence cards,
  // the goodbye and end_lesson were all dropped (review 4c N1). Not the last fifth of the box: that would bring back the
  // abrupt page flip for every timed lesson's closing minutes (review 4c N2). Past the host's wrap minute too: the facts
  // then say "finish this exchange, then summary" (time-box.ts), and a summary page held for "shall we go on?" would
  // spend one of the last two minutes on the offer.
  // A score is said once, in this turn's facts; the reply that answered it uses the arm up (pronunciation.ts).
  // Task 7s fix round 1 (I3): read before the arm is used up: this turn's words answer an armed recording (no 7b runtime card on it).
  const scoredTurn = v2ScoredTurn(session, state, input.studentSaid);
  v2ConsumePronunciation(session, state, input.studentSaid);
  // "Your last reply brought in a complication" is said once, in this turn's facts; a new one sets it again.
  if (state.thinking?.justComplicated) state.thinking = { ...state.thinking, justComplicated: false };
  // Said once by them, it holds for the rest of the conversation (shown in the facts from the next turn on; this
  // turn's facts carry it as a note on the last reply).
  if (discussion && input.studentSaid && DISCUSSION_STEERED.test(input.studentSaid)) state.thinking = { ...(state.thinking ?? { position: '', weighed: [], shifts: [] }), steered: true };
  // The student's words come first and carry the cache mark; the facts follow and are
  // never stored, so next turn's request shares this one's prefix up to the words.
  const userNow: Anthropic.MessageParam = {
    role: 'user',
    content: [{ type: 'text', text: studentText, cache_control: CACHE }, { type: 'text', text: facts }],
  };
  const system: Anthropic.TextBlockParam[] = [
    { type: 'text', text: discussion ? V2_DISCUSSION_CONSTITUTION : V2_CONSTITUTION, cache_control: CACHE },
    { type: 'text', text: v2SessionPart(session), cache_control: CACHE },
  ];
  const base = v2Tools(session.subject, session.topic ?? '', discussion);
  // A taught lesson's partner tools; none: the base set itself, so other sessions send byte-identical tools.
  const partnerTools = [...(v2LevelCheckOn(session) ? [V2_SET_WORKING_LEVEL_TOOL] : []), ...(v2PronunciationOn(session) ? [V2_PRACTISE_PRONUNCIATION_TOOL] : [])];
  const tools = discussion ? base : session.homeworkSheet ? [...base, V2_SET_CURRENT_PROBLEM_TOOL, V2_NOTE_OWN_ANSWER_TOOL] : session.homework ? [...base, V2_NOTE_OWN_ANSWER_TOOL] : partnerTools.length ? [...base, ...partnerTools] : base;
  let messages: Anthropic.MessageParam[] = [...withCacheMark(state.history), userNow];

  const stored: Anthropic.MessageParam[] = [{ role: 'user', content: [{ type: 'text', text: studentText }] }];
  const spoken: string[] = [];
  let pageUnplaced = '';
  const toolCalls: V2ToolCall[] = [];
  // Task 8c (OWED_CARD_RIGHT, mic test 10, embed-1795202398886 WB26 / WB30), fix round 1 (I1, I2: the controller's rulings): a sentence
  // card that is one of their sentences of this turn as they said it (numbers as words, fillers out) WITH words marked (the model's mark
  // of the mistake: WB26 "three | year", WB30 "learn | negotiate"), when a sentence card of this reply (painted, or pointed back at) is a
  // correction of that sentence by the one test (v2CardCorrects) and belongs to it (v2CardSentence: not to another sentence of theirs).
  // A right sentence of theirs carded as said with no marks is untouched (7b / 7g), whatever else the reply wrote.
  const learnerNow = TUTOR_V2_OWED_CARD_RIGHT && session.mode === 'voice' && v2SentenceCardsOn(session) ? v2LearnerSentences(input.studentSaid) : [];
  const v2AsSaidCorrected = (card: string, marked: boolean): boolean => {
    const k = marked ? learnerNow.findIndex((x) => v2CardIsAsSaid(card, x)) : -1;
    if (k < 0) return false;
    return toolCalls.some((c) => (!/^not /.test(c.outcome) || !!c.pointsAt) && c.name === 'show_sentence' && typeof c.args.sentence === 'string'
      && v2CardCorrects(String(c.args.sentence), learnerNow[k]!, c.args.emphasis) && v2CardSentence(String(c.args.sentence), learnerNow, c.args.emphasis) === k);
  };
  // This reply has turned the board to a page itself (see the look-back return in settle).
  let turnedNow = false;
  const usage: V2TurnResult['usage'] = { inputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheCreationTokens: 0 };
  const t0 = Date.now();
  let firstTextMs: number | null = null;
  let modelCalls = 0;

  const waitingOnTutor = session.mode === 'voice' && input.studentSaid === null && (input.facts?.timeCheck === true || !!input.facts?.roomVoices || [V2_NO_ASK_RECHECK_S, V2_WAITED_RECHECK_S].includes(Math.round(input.facts?.silenceSeconds ?? 0)));
  // A typed message is sent whole: there is nothing more to listen for. A tutor that kept listening to one sat
  // silent for four minutes (demo check, 2026-11-13; the voice client rechecks a silence, the typed one does not).
  const typedAndSent = session.mode === 'text' && input.studentSaid !== null;
  const mustSpeak = waitingOnTutor || opening || typedAndSent;
  /** Run one tool call: validate it, apply it, tell the client, and return its result for the model. */
  /** Task 7u (CARD_AT_SENTENCE): the timing mark of the inline block being settled (V2ToolCall.timed), set by `take` around it. */
  let inlineTimed: 'next' | 'text' | undefined;
  // Task 8l (WELL_WITH_CARD): the "What went well" heading the model wrote on the Summary page, held until its first card (summary-headings.ts).
  let heldWell: Record<string, unknown> | null = null;
  const settle = (blockIn: Anthropic.ToolUseBlock, boardOnly = false, inline = false): Anthropic.ToolResultBlockParam => {
    let block = blockIn;
    const { [SAY_WITH]: sayWithRaw, ...args } = (block.input ?? {}) as Record<string, unknown>;
    // A problem card states the task; how-to-begin sentences are cut from it (board.ts taskOnly).
    if (block.name === 'show_problem' && typeof args.statement === 'string') args.statement = taskOnly(args.statement).statement;
    // Task 7g (QUESTION_CARD, mic test 2 flag 5): in a spoken lesson that teaches a language, a practice question is no graded
    // problem: no difficulty label, headed "Question" ("EASY / Problem" stood over "Did you attend any business events…?").
    if (block.name === 'show_problem' && questionCards) {
      delete args.difficulty; delete args.source;
      if (typeof args.title !== 'string' || !args.title.trim() || /\bproblem\b/i.test(args.title)) args.title = 'Question';
      // Task 7m (QUESTION_ONCE, mic test 4 flag 5a): the title says "Question"; a "Question:" the model wrote into the statement
      // stood under it again, bold (title "Question", body "Question: What did you do…").
      if (TUTOR_V2_QUESTION_ONCE && typeof args.statement === 'string') args.statement = args.statement.replace(/^\s*(?:\*\*)?(?:question|質問)\s*\d*\s*[:：](?:\*\*)?\s*/i, '');
    }
    // Dollar signs inside an equation block are a sentence with maths in it, and render as raw red source
    // ("$r^2 = 25$, \\text{ so } $r = 5$", conic sections, 2026-11-11): it goes up as a note, which reads them.
    if (block.name === 'show_equation' && typeof args.latex === 'string' && /\$[^$]+\$/.test(args.latex)) {
      block = { ...block, name: 'annotate' } as Anthropic.ToolUseBlock;
      const text = args.latex.replace(/\\text\{([^{}]*)\}/g, '$1').replace(/\s+/g, ' ').trim();
      for (const k of Object.keys(args)) delete args[k];
      args.text = text;
    }
    if (block.name === 'show_equation' && typeof args.latex === 'string') args.latex = stackedRow(spacedRoman(wordsAsText(args.latex)));
    // The label over an equation is typeset as a note is: "at x = -2" stood in plain letters above its working (embed-1794595194384).
    if (block.name === 'show_equation' && typeof args.label === 'string' && !args.label.includes('$')) args.label = typesetMaths(args.label);
    // A graph drawn on a page that already has one is the same picture with more on it: a circle went up, and
    // then the point on it as a second, empty-looking graph (conic sections, 2026-11-11). A graph of points
    // alone, or one that repeats a curve already drawn, is drawn together with the earlier one and takes its place.
    let replaces: string | undefined;
    if (block.name === 'show_function_graph' && state.board.current >= 0) {
      const page = state.board.pages[state.board.current];
      // Only within one piece of work: a graph for a new problem is its own picture. Merged with the last
      // problem's graph, a snowfall line came up with the dog-walking line y = 8x still on it, and by the third
      // problem the graph had three lines (grade 7, embed-1794453532197).
      const lastGraphAt = page.items.map((it) => it.tool === 'show_function_graph' && !!it.args).lastIndexOf(true);
      const old = lastGraphAt >= 0 && !page.items.slice(lastGraphAt + 1).some((it) => it.tool === 'show_problem') ? page.items[lastGraphAt] : undefined;
      const fns = (v: unknown) => (Array.isArray(v) ? (v as Array<Record<string, unknown>>) : []);
      const key = (f: Record<string, unknown>) => String(f.expr ?? f.expression ?? f.latex ?? '').replace(/\s+/g, '');
      if (old?.args) {
        const mine = fns(args.functions); const theirs = fns(old.args.functions);
        // Regions are curves of the picture too: a point tested against a shaded region is drawn in that region.
        const myRegions = fns(args.inequalities); const theirRegions = fns(old.args.inequalities);
        if ((!mine.length && !myRegions.length) || mine.some((f) => theirs.some((g) => key(g) === key(f))) || myRegions.some((f) => theirRegions.some((g) => key(g) === key(f)))) {
          const regions = [...theirRegions, ...myRegions.filter((f) => !theirRegions.some((g) => key(g) === key(f)))];
          if (regions.length) args.inequalities = regions;
          const pts = (v: unknown) => fns(v);
          args.functions = [...theirs, ...mine.filter((f) => !theirs.some((g) => key(g) === key(f)))];
          const points = [...pts(old.args.points), ...pts(args.points).filter((q) => !pts(old.args!.points).some((o) => o.x === q.x && o.y === q.y))];
          if (points.length) args.points = points;
          // Segments drawn again are the same picture redrawn: both sets together put every label on the figure
          // twice (optics, embed-1794593747478).
          const segKey = (s: Record<string, unknown>) => JSON.stringify([s.from, s.to]);
          const redrawn = pts(args.segments).some((s) => pts(old.args!.segments).some((o) => segKey(o) === segKey(s)));
          const segs = redrawn ? pts(args.segments) : [...pts(old.args.segments), ...pts(args.segments)];
          if (segs.length) args.segments = segs;
          for (const k of ['xRange', 'yRange', 'title'] as const) if (args[k] === undefined && old.args[k] !== undefined) args[k] = old.args[k];
          replaces = old.id;
        }
      }
    }
    // A point outside the window is not on the graph: (2, 6) on axes that stop at 5 showed as a label at the top
    // edge with no dot (Digital SAT, portal-b0efc3c2). The window grows to take in every point and segment end.
    if (block.name === 'show_function_graph') {
      const spots = [...(Array.isArray(args.points) ? args.points as Array<{ x?: unknown; y?: unknown }> : []), ...(Array.isArray(args.segments) ? (args.segments as Array<{ from?: { x?: unknown; y?: unknown }; to?: { x?: unknown; y?: unknown } }>).flatMap((sg) => [sg.from ?? {}, sg.to ?? {}]) : [])];
      for (const [k, axis] of [['xRange', 'x'], ['yRange', 'y']] as const) {
        const r = args[k];
        if (!Array.isArray(r) || r.length !== 2 || !r.every((n) => typeof n === 'number' && Number.isFinite(n))) continue;
        const vals = spots.map((sp) => sp[axis]).filter((n): n is number => typeof n === 'number' && Number.isFinite(n));
        if (!vals.length) continue;
        const lo = Math.min(...vals); const hi = Math.max(...vals);
        args[k] = [lo <= (r[0] as number) ? Math.floor(lo) - 1 : r[0], hi >= (r[1] as number) ? Math.ceil(hi) + 1 : r[1]];
      }
    }
    // A note that says again what a note from this same reply says is its second draft, and takes its place:
    // "Walking around the loop" went up with the answers in it and again, under it, with question marks
    // (AP Physics, embed-1794493438983).
    if (block.name === 'annotate' && state.board.current >= 0 && typeof args.text === 'string') {
      const wordsOf = (t: unknown) => new Set(String(t ?? '').toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length >= 3));
      const mine = wordsOf(args.text);
      const page = state.board.pages[state.board.current];
      // A second draft is like the first in both directions. A short note whose words are all in a longer one of
      // this reply is not a draft of it: taken for one, "x = 3 is extraneous" took the place of the recap the
      // tutor had just written, and the student saw the recap wiped (algebra, embed-1794595194384).
      const near = (c: V2ToolCall, of: 'both' | 'mine') => { const theirs = wordsOf(c.args.text); const both = [...mine].filter((w) => theirs.has(w)).length; return both / (of === 'mine' ? mine.size : Math.max(mine.size, theirs.size)) >= 0.7; };
      const sameReply = (c: V2ToolCall) => c.name === 'annotate' && !/^not /.test(c.outcome) && page.items.some((it) => it.id === c.id);
      const draft = mine.size >= 4 ? toolCalls.find((c) => sameReply(c) && near(c, 'both')) : undefined;
      if (draft) replaces = draft.id;
      else if (boardOnly && mine.size >= 4 && toolCalls.some((c) => sameReply(c) && near(c, 'mine'))) return { type: 'tool_result', tool_use_id: block.id, content: 'not painted: a note of this reply already says it' };
    }
    // An equation under the label of one this same reply wrote is that equation written again, and takes its
    // place: "x = 5 in the original" went up worked out and then, under it, with question marks (embed-1794595194384).
    if (block.name === 'show_equation' && state.board.current >= 0 && typeof args.label === 'string' && args.label.trim()) {
      const page = state.board.pages[state.board.current];
      const same = toolCalls.find((c) => c.name === 'show_equation' && !/^not /.test(c.outcome) && page.items.some((it) => it.id === c.id) && String(c.args.label ?? '').trim().toLowerCase() === (args.label as string).trim().toLowerCase());
      if (same) replaces = same.id;
    }
    // Task 7o (NOTE_TARGET_MARK, NOTE_STRESS_MARK; mic test 4 flag 2): a note of a spoken language lesson is marked for the board:
    // its short quoted spans are drawn as targets; a note quoting none carries the stress words of this reply's cards that stand
    // in it. The text (its record and its spoken copy) is unchanged.
    if (block.name === 'annotate' && noteTargets && typeof args.text === 'string') {
      if (TUTOR_V2_NOTE_TARGET_MARK) args.targets = true;
      if (TUTOR_V2_NOTE_STRESS_MARK && !v2NoteHasTarget(args.text)) { const stress = v2NoteStressWords(args.text, toolCalls); if (stress.length) args.stress = stress; }
    }
    // Task 7p (CARD_GLOSS_SHOW, mic test 4 flag 5c): a question card's or note's gloss is kept only for a beginner (by the level at
    // this point of the turn) in a spoken lesson taught through their language, one short line; anywhere else it is dropped.
    if (TUTOR_V2_CARD_GLOSS_SHOW && (block.name === 'show_problem' || block.name === 'annotate') && 'gloss' in args) {
      const gloss = cardGloss && v2GlossLevelOn(session, state, input.studentSaid) ? v2CleanGloss(args.gloss) : null;
      if (gloss) args.gloss = gloss; else delete args.gloss;
    }
    const sayWith = typeof sayWithRaw === 'string' && sayWithRaw.trim() ? sayWithRaw.trim() : undefined;
    let outcome: string; let pointsAt: string | undefined; let summaryAbove: string | undefined; let turnsTo: number | undefined;
    if (V2_CONTROL_TOOL_NAMES.has(block.name)) {
      // At the opening, and when the last reply ended on a statement and the student has waited, silence is
      // not open to the tutor: a session sat on a blank screen until the student spoke, and a tutor went quiet
      // for 100 s after an explanation (embed-1794426544316, embed-1794416183291). Taking the tools away
      // instead (tool_choice none) made half the openings come back with no words at all.
      outcome = boardOnly ? 'not done: only the board was asked for'
        // Once this reply has words, the call is only the tutor handing the floor over: refusing it then made the
        // opening say itself twice (AP Physics 1, embed-1794441323503).
        : block.name === 'keep_listening' && mustSpeak && !spoken.length ? 'not done: the student is waiting for you to speak. Say the next thing now.'
        // The reply ended on the offer of the next part: a session that ended here would end on a question nobody
        // answers, with no summary (D1). The close comes after their answer.
        : block.name === 'end_lesson' && handOverRaw ? V2_HAND_OVER_DEFER
        : block.name === 'end_lesson' && (heldAt as { practice?: boolean } | null)?.practice ? 'not ended: they have not yet said enough sentences of their own in this part, and this reply asks for another. Say nothing of this message. Close after their answer.'
        : block.name === 'end_lesson' && heldAt && TUTOR_V2_CLOSE_OPENS_SUMMARY ? 'not ended: this reply ends by asking the student whether to go on, and they have not answered yet. Say nothing of this message. Close after their answer.'
        // Task 7d: in the box's last fifth (earlier, applyControlTool refuses with its own question), with time left and no
        // request to stop, the close waits for their questions; a second call in the same reply ends the turn, open. From the
        // next turn on it is never refused for this.
        // Final review I2: a reply whose last sentence said is already the invitation waits for their answer: told to ask again,
        // the model asked a second invitation straight after the first.
        // Task 7k (CLOSE_REOPENED): reopened, the ask is "more, or finish?", and a reply already ending on it waits too.
        // Task 8d (CLOSE_SUMMARY_ONCE): the reply's last question sentence is the invitation (a statement may follow it), and once the
        // summary has been given (by an earlier reply: summaryGivenBefore) the refusal never asks for it again.
        : block.name === 'end_lesson' && inviteOwed && args.because !== 'student_asked' ? (inviteRefused || !!v2InviteOfReply(saidNow) || (reopened && v2ReplyAsksMoreOrFinish(lastSentences(stripBoardBlocks(saidNow), 1))) ? V2_CLOSE_INVITE_WAIT : reopened ? V2_CLOSE_REOPEN_REFUSAL : checkOwed ? v2CloseCheckRefusal(summaryGivenBefore) : v2CloseInviteRefusal(summaryGivenBefore))
        : applyControlTool(state, session, block.name, args, nowMs, input.studentSaid, { tf, practiceHold: practiceShort, ...(heldWrap ? { heldWrap } : {}) });
    } else {
      // An object written as its JSON text is the object: a tree's root arrived as a string and the board drew
      // the text itself in one box (data structures, embed-1794458110435).
      for (const [k, v] of Object.entries(args)) if (typeof v === 'string' && /^\s*[[{]/.test(v) && k !== 'code' && k !== 'text' && k !== 'latex') { try { const o: unknown = JSON.parse(v); if (o && typeof o === 'object') args[k] = o; } catch { /* a string after all */ } }
      const valid = block.name === 'show_drawn_figure' ? (() => { const d = drawFigure(args.kind, args.params); return 'refused' in d ? { ok: false as const, reason: d.refused } : { ok: true as const }; })() : validateToolCall(block.name, args);
      // A force diagram is for pushes and pulls on a physical thing. Offered a pull between two ideas, the board
      // drew "the lovely woods" and "the promises to keep" as forces on a box (AP Lit, embed-1794448513359).
      const misfit = block.name === 'show_free_body_diagram' && !catalogueSubjects(session).includes('physics') ? 'a force diagram is for physical forces on an object, and this lesson has none; use compare, steps or a note' : boardMisfit(block.name, args);
      const guarded = input.boardGuard?.(block.name, args) ?? null;
      // Task 7m (CORRECTION_CARD_NOW, mic test 4, 11.31 min): a sentence card of a language lesson holds a whole sentence; "I have
      // worked with…" is a starter for them to finish, said aloud, not a card.
      const fragment = TUTOR_V2_CORRECTION_CARD_NOW && block.name === 'show_sentence' && (session.languages?.length ?? 0) >= 2 && /(?:…|\.\.\.)["'”’)]*\s*$/.test(String(args.sentence ?? ''));
      // Task 7s (FRAGMENT_CARD, mic test 5, embed-1795050656326 at 13 min): "I am proud of." is the head of the sentence the reply
      // completes, not a sentence: one ending on a preposition or an article where their own sentence goes on past that word.
      const cutShort = TUTOR_V2_FRAGMENT_CARD && !fragment && block.name === 'show_sentence' && (session.languages?.length ?? 0) >= 2 && v2CardIsFragment(String(args.sentence ?? ''), input.studentSaid);
      // Task 8c (OWED_CARD_RIGHT, mic test 10 flags 1 and 2): their own sentence of this turn as they said it, its words marked, which a
      // card of this reply corrected: not painted.
      const asSaidWrong = block.name === 'show_sentence' && !guarded && TUTOR_V2_OWED_CARD_RIGHT && typeof args.sentence === 'string' ? v2AsSaidCorrected(String(args.sentence), (Array.isArray(args.emphasis) ? args.emphasis : typeof args.emphasis === 'string' ? [args.emphasis] : []).some((w) => typeof w === 'string' && !!w.trim())) : false;
      // Task 8c (SUMMARY_HEADINGS): on the Summary page of a grouped lesson, the card's group heading, written by the runtime right before
      // it when the page has none (summary-headings.ts); the 7w guard below reads it as this reply's heading.
      const headingPlan = block.name === 'show_sentence' && !guarded && !asSaidWrong ? v2SummaryHeadingPlan(session, state, args.sentence, toolCalls, cardGloss && v2GlossLevelOn(session, state, input.studentSaid), input.studentSaid, args.emphasis) : null;
      const headingRepeat = !guarded ? v2SummaryHeadingRepeat(session, state, block.name, args, toolCalls) : null;
      // Task 8l (WELL_WITH_CARD, mic test 14 flag 3): a model-written "What went well" heading with none on the page waits for its first card.
      const wellHeld = !guarded && !headingRepeat && v2SummaryWellHeld(session, state, block.name, args, toolCalls);
      let heading: V2ToolCall | null = null; let headingFromHeld = false;
      // The 7w guard reads the last heading before the card; with the runtime's headings placed by group, the order on the page (not the
      // order written) says which heading a card at the foot of the page stands under.
      const byPagePosition = (calls: V2ToolCall[]) => { const items = state.board.pages[state.board.current]?.items ?? []; const at = (c: V2ToolCall) => { const i = items.findIndex((it) => it.id === c.id); return i < 0 ? Infinity : i; }; return [...calls].sort((x, y) => at(x) - at(y)); };
      if (headingPlan?.write) {
        const id = `${block.id}_h`;
        // Task 8l (WELL_WITH_CARD): the held heading goes up now, before its first card, in the model's own words and line.
        headingFromHeld = !!heldWell && headingPlan.write.text === V2_SUMMARY_WELL_HEADING;
        const write: Record<string, unknown> = headingFromHeld ? { ...heldWell, style: 'heading' } : { ...headingPlan.write };
        const o = applyBoard(state.board, id, 'annotate', { ...write });
        if (o.painted) heading = { id, name: 'annotate', args: { ...write }, outcome: o.detail, ...(sayWith ? { sayWith } : {}), ...(inline && !sayWith ? { inline: true } : {}), ...(markBeforeTurn ? { beforeTurn: true } : {}), ...(inline && inlineTimed ? { timed: inlineTimed } : {}) };
      }
      // Task 7w (SUMMARY_MARKS): on the Summary page, one of their corrections carries its marks, and never stands under "What went well".
      const summaryRefused = block.name === 'show_sentence' && !guarded && !asSaidWrong ? v2SummaryCardCheck(session, state, args, TUTOR_V2_SUMMARY_HEADINGS ? byPagePosition(heading ? [...toolCalls, heading] : toolCalls) : toolCalls) : null;
      if (guarded) outcome = `not painted: ${guarded}`;
      else if (asSaidWrong) outcome = V2_AS_SAID_REFUSED;
      else if (headingRepeat) outcome = headingRepeat;
      else if (wellHeld) { outcome = V2_SUMMARY_WELL_HELD; heldWell = { ...args }; }
      else if (summaryRefused) outcome = summaryRefused;
      // Task 7u (SUMMARY_GROUPS): the summary page holds at most four sentence cards (summary-layout.ts).
      else if (block.name === 'show_sentence' && v2SummaryCardsFull(session, state)) outcome = V2_SUMMARY_CARDS_FULL;
      else if (fragment) outcome = 'not painted: a sentence card holds a whole sentence; one ending in "…" is a starter for them to finish: say it aloud instead';
      else if (cutShort) outcome = 'not painted: a sentence card holds a whole sentence, and this one stops before the end of theirs; card the whole sentence';
      else if (!valid.ok) outcome = `not painted: ${valid.reason}`;
      else if (misfit) outcome = `not painted: ${misfit}`;
      else {
        // Turned back for a look in an earlier reply, the tutor carries on with the work in progress: the board
        // returns to its page first. Told to turn the page itself, it did not: after one look at the hemispheres
        // page, the verdict on the split-brain problem, its second part and the next problem were all written
        // there, with the problem itself a page away (AP Psychology, portal-e8640e11). A page block in this
        // reply means the tutor chose the page.
        if (block.name === 'new_page' || block.name === 'go_to_page') turnedNow = true;
        // A recap is a page of its own. Written as a note headed "Recap" under the last problem's working, it sat at
        // the foot of the practice page, and the lesson then closed on a second recap, the plan's, on a new page
        // (Digital SAT, portal-a9b9b4d4). The note's heading becomes the page's.
        else if (block.name === 'annotate' && !turnedNow && !markBeforeTurn && V2_RECAP_PAGE && recapHeading(args.text) && state.board.current >= 0 && state.board.pages[state.board.current].items.length > 0 && !RECAP_TITLE.test(state.board.pages[state.board.current].title)) {
          turnedNow = true;
          // What the check adds for the sentences before this turn belongs to the page before it: the last
          // problem's working, r = 7, went up under the recap (ACT Math, portal-3d431436).
          if (pageTurnAt < 0) { pageTurnAt = saidChars; pageBefore = state.board.current; pagesBefore = state.board.pages.length; }
          const heading = recapHeading(args.text)!;
          settle({ type: 'tool_use', id: `recap_${nowMs.toString(36)}_${toolCalls.length}`, name: 'new_page', input: { title: heading } } as Anthropic.ToolUseBlock, boardOnly, inline);
          args.text = String(args.text).replace(/^\s*[^\n]*\n+/, '');
        }
        else if (state.board.look && !turnedNow && !markBeforeTurn && block.name !== 'highlight' && V2_LOOK_RETURNS && state.board.current < state.board.pages.length - 1) {
          turnedNow = true;
          const last = state.board.pages.length - 1;
          settle({ type: 'tool_use', id: `ret_${nowMs.toString(36)}_${toolCalls.length}`, name: 'go_to_page', input: { pageIndex: last, page: last + 1, title: state.board.pages[last].title } } as Anthropic.ToolUseBlock, false, true);
        }
        // The earlier graph leaves the tutor's record first, so the fuller one is not refused as a repeat.
        const page = replaces ? state.board.pages[state.board.current] : undefined;
        const was = page?.items.find((it) => it.id === replaces);
        if (page && was) page.items = page.items.filter((it) => it !== was);
        // A problem of the plan, as the tutor is putting it up.
        const put = block.name !== 'show_problem' || !session.plan || discussion ? '' : typeof args.statement === 'string' ? args.statement : typeof (args.problem as { statement?: unknown } | undefined)?.statement === 'string' ? (args.problem as { statement: string }).statement : typeof args.problem === 'string' ? args.problem : '';
        const planGoal = put && session.plan ? goalForProblem(session.plan, put) : null;
        const whole = put && session.plan ? wholeProblem(session.plan, put) : null;
        // Its card, when it is already on the board: on whichever page it stands.
        const cardId = planGoal ? state.problemCards?.[planGoal] : undefined;
        const cardPage = cardId ? state.board.pages.findIndex((pg) => pg.items.some((it) => it.id === cardId)) : -1;
        let o: V2BoardOutcome & { turnTo?: number };
        let partAlone = false;
        // Task 8i (merge with main): in a part-flow lesson the board never turns from the page in view to another part's page for
        // it (v2SamePartPages): the card goes up on the page in view. Turns between parts are the part flow's and the learner's (7k).
        const crossPart = partFlow && !!session.plan && cardPage >= 0 && cardPage !== state.board.current && !v2SamePartPages(session.plan, state.board, cardPage, state.board.current);
        if (cardId && cardPage >= 0 && !crossPart && (whole || cardPage !== state.board.current)) {
          // Asked for again, or its next part asked: the problem is one card, and the board goes to it. From
          // another page the board turns back to its page, so the parts and the working done on it are in
          // view together and what is written next goes there ("show me that question again" put part (c)
          // alone on the recap page, AP US Government, portal-ddf273bf).
          const away = cardPage !== state.board.current;
          if (away) { state.board.current = cardPage; delete state.board.look; turnedNow = true; }
          o = { painted: false, detail: away ? `already on page ${cardPage + 1} "${state.board.pages[cardPage].title}"` : `already on the board (page ${cardPage + 1})`, pointAt: cardId, ...(away ? { turnTo: cardPage } : {}) };
        } else {
          // The first part of a problem in parts goes up as the whole problem. One later part asked by itself
          // goes up as asked: the whole card would open with a part the tutor is not asking.
          partAlone = !!whole && laterPartAlone(whole.statement, put);
          if (whole && !partAlone && typeof args.statement === 'string') args.statement = whole.statement;
          o = applyBoard(state.board, block.id, block.name, args);
        }
        outcome = o.painted ? o.detail : `not painted: ${o.detail}`;
        // Task 7k (PRACTICE_ON_PART_PAGE): a turn to another part's page is for its practice, and the way back is the position's page.
        // Merge with main (Task 8e): …and then not main's "look back" (as at the runtime's own turn to a visit, above).
        if (o.painted && block.name === 'go_to_page' && partFlow && session.plan) { const note = v2PageTurnNote(session.plan, state); if (note) { outcome = note; delete state.board.look; } }
        // A problem of the tutor's own making has no answer in the plan: it is worked out apart, after this reply.
        if (put && !planGoal && o.painted && !noOwnKey) state.ownKeys = { ...(state.ownKeys ?? {}), [block.id]: '' };
        if (planGoal) {
          // Task 8i fix round 1: not a card painted on the page in view because the turn back to another part's page was skipped
          // (crossPart): it is not that part's card, and the part's own card stays its record.
          if (o.painted && !partAlone && !crossPart) state.problemCards = { ...(state.problemCards ?? {}), [planGoal]: block.id };
          // A problem of the plan on the board is that part of the plan begun, whether or not the tutor records
          // it: a whole lesson ran with the phases showing Hook, because no progress was recorded until the
          // close (Algebra 1, portal-50a1e584). Gone back to while still open, it is the part in hand again.
          const g = state.goals[planGoal];
          // Task 8h (final review I1, ruling 1b): not in a part-flow lesson (time-box.ts v2PartFlowLesson). There a part is done by
          // the lesson having entered and taught it (Task 7i) and its chip follows its page (part-flow.ts); marked shown as its card
          // went up, the last practice part was "done" before the learner had answered, and the close opened on that card.
          if (!g && !v2PartFlowLesson(session)) state.goals[planGoal] = { status: 'shown', at: nowMs };
          else if (g?.status === 'shown' && !o.painted) state.goals[planGoal] = { ...g, at: nowMs };
        }
        // A page headed for a part of the plan, or that part's passage, is the lesson on that part.
        if (session.plan && !discussion && o.painted && (block.name === 'new_page' || block.name === 'show_passage')) {
          const part = block.name === 'new_page' ? goalForTitle(session.plan, String(args.title ?? '')) : goalForProblem(session.plan, String(args.text ?? ''));
          if (part) state.partsSeen = { ...(state.partsSeen ?? {}), [part]: nowMs };
          else if (block.name === 'new_page') pageUnplaced = String(args.title ?? '');
        }
        if (o.turnTo !== undefined) turnsTo = o.turnTo;
        if (!o.painted) { if (page && was) page.items.push(was); replaces = undefined; }
        // A card that reworks what the student just said is one of their corrected sentences (the summary's cards), also
        // when the board pointed it at a longer card or note already holding it (review 4c M3): the correction was made.
        // Task 8g fix round 1 (I4): left as before, unlike the pairing and the 7w record: the list guards the summary's "What went well"
        // and the owed-card checks, and a sentence corrected by pointing at an earlier turn's longer card holding it (4c M3) must stay in it.
        if ((o.painted || o.pointAt) && block.name === 'show_sentence') v2NoteCorrectedSentence(session, state, args.sentence, input.studentSaid, args.emphasis);
        // Task 7w (SUMMARY_MARKS): …with what they said and the words it changed (summary-marks.ts).
        // Task 8g (PAIR_PAINTED_ONLY): not for a card of an earlier turn pointed back at.
        if ((o.painted || pointsAtThisReply(o.pointAt)) && block.name === 'show_sentence') v2NoteCorrection(session, state, args.sentence, args.emphasis, input.studentSaid);
        if (!o.painted && o.pointAt && !boardOnly) { pointsAt = o.pointAt; outcome = turnsTo !== undefined ? `not painted again: ${o.detail}; the board has turned back to that page and shows it. Carry on with it there: what you write next goes on that page` : `not painted again: ${o.detail}; the board has scrolled back to it`; }
      }
      // Task 8c (SUMMARY_HEADINGS): the heading stays only with its card: written first, then the card; both above "To improve" for a card
      // of the went-well group written after it (the board check's own placing, placeAbove, takes the heading along).
      if (heading) {
        const page = state.board.pages[state.board.current];
        if (/^not /.test(outcome) || !page) { if (page) page.items = page.items.filter((it) => it.id !== heading!.id); heading = null; }
        else {
          const anchor = placeAbove ?? headingPlan?.above;
          if (anchor) { const h = page.items.find((it) => it.id === heading!.id); if (h) { page.items = page.items.filter((it) => it !== h); const at = page.items.findIndex((it) => it.id === anchor); page.items.splice(at < 0 ? page.items.length : at, 0, h); heading.before = anchor; } }
          toolCalls.push(heading); input.onToolCall?.(heading);
          if (headingFromHeld) heldWell = null;
        }
      }
      if (!placeAbove && headingPlan?.above && !/^not /.test(outcome)) {
        const page = state.board.pages[state.board.current];
        const mine = page?.items.find((it) => it.id === block.id);
        if (page && mine) { page.items = page.items.filter((it) => it !== mine); const at = page.items.findIndex((it) => it.id === headingPlan.above); page.items.splice(at < 0 ? page.items.length : at, 0, mine); summaryAbove = headingPlan.above; }
      }
    }
    if (outcome === V2_CLOSE_INVITE_REFUSAL || outcome === V2_CLOSE_INVITE_REFUSAL_GIVEN || outcome === V2_CLOSE_REOPEN_REFUSAL || outcome === V2_CLOSE_CHECK_REFUSAL || outcome === V2_CLOSE_CHECK_REFUSAL_GIVEN) inviteRefused = true;
    if ((outcome === V2_CLOSE_CHECK_REFUSAL || outcome === V2_CLOSE_CHECK_REFUSAL_GIVEN) && typeof state.summaryBegunAt === 'number') checkDeferred = true;
    if (block.name === 'end_lesson' && /^not ended: the session goes on\./.test(outcome)) menuGiven = true;
    if (outcome === V2_CLOSE_INVITE_WAIT) inviteWait = true;
    // Task 7s (PRONUNCIATION_PAGE): each item they are to say goes on the pronunciation page in view as a card (by the runtime, from
    // the arm it already has: the model wrote nothing there and the board hides an empty page).
    if (block.name === 'practise_pronunciation' && /^armed/.test(outcome) && onPronPage()) writePronCards(state.pronunciation?.armed?.items ?? []);
    const result: Anthropic.ToolResultBlockParam = { type: 'tool_result', tool_use_id: block.id, content: outcome };
    // The board pass often offers again what the reply already put up; a call of its that did nothing leaves no trace.
    if (boardOnly && /^not /.test(outcome)) return result;
    const call: V2ToolCall = { id: block.id, name: block.name, args, outcome, ...(sayWith ? { sayWith } : {}), ...(inline && !sayWith ? { inline: true } : {}), ...(replaces && !/^not /.test(outcome) ? { replaces } : {}), ...(pointsAt && turnsTo !== undefined ? { turnsTo } : {}), ...(markBeforeTurn ? { beforeTurn: true } : {}), ...((placeAbove ?? summaryAbove) && !/^not /.test(outcome) ? { before: placeAbove ?? summaryAbove } : {}), ...(pointsAt ? { pointsAt } : {}), ...(block.name === 'new_page' && inline && !/^not /.test(outcome) && pageAgreed ? { agreed: true } : {}), ...(carryNow.length && block.name === 'new_page' && !/^not /.test(outcome) ? { carries: carryNow } : {}), ...(inline && inlineTimed ? { timed: inlineTimed } : {}) };
    toolCalls.push(call);
    input.onToolCall?.(call);
    return result;
  };
  // Task 7s (PRONUNCIATION_PAGE): the runtime's cards of an arm, one per item not on the page in view yet.
  let pronCardN = 0;
  const writePronCards = (items: readonly string[]) => {
    for (const item of items) {
      const sentence = item.replace(/[<>]/g, '').trim();
      if (!sentence) continue;
      pronCardN += 1;
      const id = `inl_${nowMs.toString(36)}_pron${pronCardN}`; const args = { sentence };
      const o = applyBoard(state.board, id, 'show_sentence', args);
      if (!o.painted) continue;
      const call: V2ToolCall = { id, name: 'show_sentence', args, outcome: o.detail, inline: true };
      toolCalls.push(call); input.onToolCall?.(call);
    }
  };
  // Board blocks written inline in the reply (board-inline.ts): each becomes a board call where it stands.
  const openingOverview = v2OpeningOverview(session);
  let inlineN = 0;
  const boardProblems: string[] = [];
  const settleInline = (b: InlineBlock, boardOnly = false): boolean => {
    let { name, args } = inlineToolCall(b);
    // Task 7w (OPENING_PAGE_TITLE): the overview's page the opening fallback wrote is the only page: the overview's own page block (its
    // name, or the part's name in another words) stays on it, as a repeated heading does (board.ts), with nothing to report.
    if (name === 'new_page' && openingOverview && state.board.pages.length === 1 && state.board.current === 0 && session.plan && state.board.pages[0]!.title === openingOverview
      && v2PartOfPage(session.plan, String(args.title ?? '')) === 0) return true;
    // A note whose first line is the title of the page it stands on says the title twice (flagged in a local
    // test, embed-1795030468491: "page 2's title is The Revision Assistant, and the title on the card is too").
    if (name === 'annotate' && typeof args.text === 'string') {
      const lines = args.text.split('\n'); const plain = (x: string) => x.replace(/[^a-z0-9]+/gi, '').toLowerCase();
      const title = state.board.pages[state.board.current]?.title ?? '';
      if (lines.length > 1 && title && plain(lines[0]) === plain(title)) args = { ...args, text: lines.slice(1).join('\n') };
    }
    // The page block of the page in view, while turned back to it: the tutor means to write here.
    if (name === 'new_page' && state.board.look && (state.board.pages[state.board.current]?.title ?? '').replace(/\s+/g, '').toLowerCase() === String(args.title ?? '').replace(/\s+/g, '').toLowerCase()) { turnedNow = true; return true; }
    // A page block naming a page that exists turns back to it.
    if (name === 'new_page') { const at = state.board.pages.findIndex((pg, i) => i !== state.board.current && pg.title.replace(/\s+/g, '').toLowerCase() === String(args.title ?? '').replace(/\s+/g, '').toLowerCase()); if (at >= 0) { name = 'go_to_page'; args = { pageIndex: at, page: at + 1, title: state.board.pages[at].title }; } }
    inlineN += 1;
    const r = settle({ type: 'tool_use', id: `inl_${nowMs.toString(36)}_${inlineN}`, name, input: b.attrs.with ? { ...args, [SAY_WITH]: b.attrs.with } : args } as Anthropic.ToolUseBlock, boardOnly, true);
    let failed = /^not /.test(String(r.content));
    // Working refused as an equation (a list of outcomes with words, too wide for one line) is still working the
    // tutor is talking through: it goes up as a note, one outcome a line. Refused, the four children of a cross
    // were said aloud over an unchanged board (biology, embed-1794520770137).
    if (failed && b.kind === 'equation' && /too wide for one line|a sentence, not an equation/.test(String(r.content)) && !/\\[a-zA-Z]/.test(b.body)) {
      const lines = b.body.split(/\n+|,\s+(?=[^)]*(?:\(|$))|;\s+/).map((x) => x.trim()).filter(Boolean);
      const again = settle({ type: 'tool_use', id: `inl_${nowMs.toString(36)}_${inlineN}`, name: 'annotate', input: { text: [b.attrs.label ? `${b.attrs.label}:` : '', ...lines].filter(Boolean).join('\n'), rich: true, ...(b.attrs.with ? { [SAY_WITH]: b.attrs.with } : {}) } } as Anthropic.ToolUseBlock, boardOnly, true);
      if (!/^not /.test(String(again.content))) failed = false;
    }
    if (!failed && !boardOnly) inlinePainted.push({ id: `inl_${nowMs.toString(36)}_${inlineN}`, raw: b.raw, label: `${b.kind}: ${b.body.replace(/\s+/g, ' ').slice(0, 160)}` });
    if (failed && !boardOnly && !/scrolled back/.test(String(r.content)) && r.content !== V2_SUMMARY_WELL_HELD) boardProblems.push(`${b.kind} "${b.body.replace(/\s+/g, ' ').slice(0, 60)}": ${String(r.content).replace(/^not painted: /, '')}`);
    return !failed;
  };
  // How much had been said when the reply turned to a new page (-1: it did not).
  let saidChars = 0; let pageTurnAt = -1; let pageBefore = -1; let pagesBefore = 0; let markBeforeTurn = false;
  // The item of this reply that a check addition belongs above (see the check's additions, below).
  let placeAbove: string | undefined;
  // The student was asked whether to go on and has answered: the page for the next part turns as the reply
  // begins. Turned where the tutor reached the block, the pedigree page came up after the whole description of
  // squares and circles had been spoken over the old page (biology, embed-1794520770137).
  // Task 7a (PART_ASK_EVERY): only an ask about moving on, not a check-in ("Does that make sense so far?").
  const pageAgreed = leftOpen(lastTutorText, input.studentSaid ?? null, askEvery);
  // Inline items settled since the last spoken words. A tutor who writes a figure and THEN turns the page, with
  // nothing said between, meant the figure for the new page: the washer solid went up at the foot of the disc
  // page and the page turned at once (AP Calc BC, embed-1794446765164). The page turn carries them over.
  let sinceWords: string[] = []; let carryNow: string[] = [];
  const rawSpoken: string[] = [];
  const withdrawn: string[] = []; const withdrawnLabels: string[] = [];
  const inlinePainted: Array<{ id: string; raw: string; label: string }> = [];

  let heldAt: { raw: string; offer: string; part?: { id: string; title: string }; unasked?: boolean; practice?: boolean } | null = null; let saidNow = '';
  // Task 7a: model page blocks for a new part reheaded by the part's name (raw as written → as stored), and repeated asks dropped.
  const retitles: Array<[string, string]> = []; let askDrops = 0;
  // Task 6f (SUMMARY_BEGUN_NEXT_TIME): the next-time line said where a summary the reply has begun opens (raw block → line).
  let nextTimeAt: { raw: string; line: string } | null = null;
  // Sentence cards spoken where they stand (raw block → the words said for it).
  const saidCards = new Map<string, string>();
  // Task 7s (QUESTION_ONCE fix, item 1): the question cards whose question the runtime spoke where they stand (raw block → the
  // question), for the stored reply.
  const questionSaid = new Map<string, string>();
  // A page that would be held, and what followed it, while it is not yet known whether the reply ends the lesson (D1).
  let pendingHold: InlinePart[] | null = null; let releasing = false;
  // The tutor may end the lesson by itself (the end_lesson rule in applyControlTool): Task 7f D, the plan's parts done or the wrap
  // minute (time-box.ts v2CloseOpen); with CLOSE_BY_CONTENT off, the box's last fifth.
  const selfCloseOpen = !discussion && !session.homework && !session.homeworkSheet && !!session.timeBoxMinutes && v2CloseOpen(session, state, nowMs, tf.closeByContent);
  // A page that closes the lesson: headed as a summary or recap, or naming the plan's last part.
  const lastPart = session.plan?.segments[session.plan.segments.length - 1];
  const lastPartNames = lastPart ? [v2PartOf(lastPart).label, (lastPart as { goal?: string }).goal, lastPart.id].filter((x): x is string => typeof x === 'string' && !!x.trim()) : [];
  const closesLesson = (title: string) => V2_CLOSING_PAGE.test(title) || lastPartNames.some((n) => namesPart(n, title));
  const boardHasPage = (title: string) => state.board.pages.some((pg) => pg.title.replace(/\s+/g, '').toLowerCase() === title.replace(/\s+/g, '').toLowerCase());
  let owedAsked = false; let partPaged = false;
  // Fix round 1 (F1): the part-change frame is the runtime's, at most twice a lesson and never at two part changes running.
  // When it is not due, a page is not held for it and a frame the model writes is dropped (reply-gate.ts).
  // Fix round 2 (N4, minor b): spoken teaching lessons only. Typed lessons and homework stream as before 55b7b557.
  const teaching = !discussion && !session.homework && !session.homeworkSheet;
  const gated = teaching && session.mode === 'voice';
  const frameDueOld = !TUTOR_V2_PART_OFFER_ONCE || !gated || v2FrameDue(state.history);
  // Task 7a (PART_ASK_EVERY): every part change is asked, so the 6e budget does not apply; the summary page keeps it.
  const frameDue = askEvery ? true : frameDueOld;
  // Task 8j (SUMMARY_HAND_OVER): spoken part-flow lessons only (every other lesson as on main 11843955).
  const handOverOn = TUTOR_V2_SUMMARY_HAND_OVER && gated && partFlow && askEvery && !!session.plan;
  // Fix round 1 (rulings 3, 4): the reply before carried the runtime's hand-over (state); an in-part deferral was already given.
  const handedOverBefore = handOverOn && v2HandedOver(state);
  const inPartDeferred = handOverOn && v2InPartDeferredBefore(state.history);
  // The page held and what followed it while the reply is still coming (its end_lesson decides, as D1's); the held page's block; the
  // continuation's stage; whether the hand-over was given.
  let handOverParts: InlinePart[] | null = null; let handOverRaw: string | null = null;
  let handOverStage: 'none' | 'continuing' | 'done' = 'none'; let handOverGiven = false;
  // Fix round 2: the words before the held page announced the summary (I1: the continuation says the part is finished first); where the
  // continuation's words begin in what was said (M1); the continuation's own abort (M1).
  let handOverBegan = false; let contFrom = -1; let contAbort: AbortController | null = null;
  // Fix round 2 (M2): the conditions of the hold that do not depend on how the page was written (inline block or new_page call).
  const handOverMay = (title: string) => handOverOn && !!optionalHold && !closingTurn && !stopAsked && !summaryBefore && !handedOverBefore && !state.closed && handOverStage === 'none'
    && !state.board.pages.some((pg) => pg.title.replace(/\s+/g, '').toLowerCase() === title.replace(/\s+/g, '').toLowerCase())
    && !(TUTOR_V2_PART_GO_NAMED && !!session.plan && (v2GoForPart(input.studentSaid, lastTutorText, session.plan, state, session.plan.segments.length - 1, askLangs) || (declinedNow >= 0 && v2NextPart(session.plan, state, v2PartInHand(session.plan, state)) === session.plan.segments.length - 1)));
  // …and a frame the model writes is dropped only when it repeats an earlier ask word for word (or a frame about the summary
  // when the 6e budget would have dropped it: the close keeps its rules).
  // Final review I1: never the close's invitation ("Any questions before we finish?" was dropped as a repeat of the overview's
  // "Any questions before we start?", and the runtime's check-in or a part ask took its place).
  // Task 7f C: while the practice part in hand is short of its sentences, the model's own part ask is dropped too (the runtime
  // asks for another sentence instead, below).
  const dropFrameIf = askEvery ? (x: string) => !v2ReplyInvites(x) && (v2AskRepeats(x, state.history, session.plan) || (TUTOR_V2_PART_OFFER_ONCE && !frameDueOld && isPartFrame(x) && V2_CLOSING_PAGE.test(x) && handOverStage !== 'continuing') || (!!practiceShort && !!session.plan && v2AsksPartChange(session.plan, x))) : null;
  // F3, F4: a goodbye waits for the reply to be complete (reply-gate.ts).
  const holdGoodbye = gated && (TUTOR_V2_CLOSE_ONE_QUESTION || TUTOR_V2_PASSED_PART_CLOSE || v2CloseInviteOn(session));
  let framesDropped = 0;
  // Task 7c (ASK_NO_CHECKIN): one question per reply, in spoken teaching lessons (the check-in's own guard reaches every
  // spoken lesson, below).
  const oneQuestion = gated && TUTOR_V2_ASK_NO_CHECKIN;
  // Task 7x (REPEAT_THEN_WAIT), fix round 2 (ruling): the runtime appends none of its own lines (its check-in, a part-change ask, the
  // "one more sentence" ask) to a reply whose last sentence asks the learner to say a sentence again; what the model wrote is never cut
  // for it (7c's rules as before). A part ask then comes in the next reply (the page stays held, unasked). Spoken language lessons with a
  // labelled plan (mic test 7, embed-1795100797999: five barge-ins, each his repeat over the next question).
  // It refines 7c's one-question rule, so it runs only where that rule does (ASK_NO_CHECKIN off: the appends as before 7c).
  const repeatGuard = oneQuestion && TUTOR_V2_REPEAT_THEN_WAIT && v2AdaptOn(session);
  const endsOnRepeat = (text: string) => repeatGuard && v2AsksRepeat(v2ReplySentences(stripBoardBlocks(text)).pop() ?? '');
  // The part the runtime's replacement ask (after a dropped repeat) asked about, for the held page.
  let askedPart: { id: string; title: string } | null = null;
  // Task 7e fix round 1 (HELD_PART_RELEASE, review I2): the held part's page opens when the lesson moves INTO that part: a
  // reply that names the held part (all its heading words, or its localized name, in one sentence) and is not asking whether
  // to go on. Opened before the reply's next card, so the card, the page and the chip agree (v2audio-7 learner 2 T27: the
  // present perfect was taught on the "Your job" page after a content answer to the ask). Never for a part the lesson
  // moves past: that counts as done, as in 7a.
  const releaseOn = partFlow && askEvery && TUTOR_V2_HELD_PART_RELEASE && !!session.plan;
  let movedIn: string | null = null;
  // Not while the reply answers their question or redirect ("Please explain that again."): it asks again after (7a I2).
  const answeredAsk = v2AnswerAsksOrDeclines(input.studentSaid, lastTutorText, askLangs, session.plan);
  const movesIntoHeld = (said: string): boolean => {
    if (!releaseOn || !session.plan || released || movedIn !== null || state.closed || closingTurn || heldAt || answeredAsk) return false;
    const i = v2HeldPartWaiting(session.plan, state);
    if (i < 0) return false;
    const seg = session.plan.segments[i]!;
    const sentences = v2ReplySentences(stripBoardBlocks(said));
    const naming = sentences.find((x) => v2PartNamedIn(seg, x));
    // Task 8d (ANSWER_OVER_ASK): nor one that ends on the part ask read by position in the lesson's languages (「次は Conversation で、…。
    // 質問がありますか？それとも、このまま進みますか？」 asks again; it does not move in).
    if (!naming || v2AsksPartChange(session.plan, sentences[sentences.length - 1] ?? '') || (TUTOR_V2_ANSWER_OVER_ASK && !!v2EndingPartAsk(said, session.plan, askLangs))) return false;
    const id = `inl_${nowMs.toString(36)}_movein`; const args = { title: state.heldPage!.title }; const from = state.board.current;
    const o = applyBoard(state.board, id, 'new_page', args);
    if (!o.painted) return false;
    const call: V2ToolCall = { id, name: 'new_page', args, outcome: o.detail, inline: true };
    toolCalls.push(call); input.onToolCall?.(call);
    if (pageTurnAt < 0) { pageTurnAt = saidChars; pageBefore = from; }
    movedIn = naming;
    return true;
  };
  // Task 6g (CLOSE_ONE_QUESTION): the summary began in an earlier reply.
  const summaryBefore = gated && !!session.plan && v2SummaryBegun(state);
  // Task 6g: in a reply that may close the lesson, a practice ask waits for the next sentence and is dropped when the summary
  // or a goodbye follows it (reply-gate.ts closeAsk): tester B's last reply asked for a retry and then gave the summary.
  // Fix round 1 (I3): held only when the summary is due (a closing turn; the summary begun earlier; or the box's last fifth
  // with every required part before the summary reached), not for every ask of a timed lesson's last fifth: a maths "Can
  // you try this one?" waited for the whole reply. A summary begun in this reply drops later asks whenever the gate is on.
  const closeAsk = gated && TUTOR_V2_CLOSE_ONE_QUESTION && !!session.plan ? v2IsPracticeAsk : null;
  const summaryDue = (() => {
    if (!closeAsk || !session.plan) return false;
    if (closingTurn || summaryBefore) return true;
    if (!selfCloseOpen) return false;
    const segs = session.plan.segments;
    if (state.board.pages.some((pg) => closesLesson(pg.title))) return false;
    return segs.slice(0, -1).every((seg) => {
      const p = v2PartOf(seg);
      if (v2PartIsOptional(seg) || state.goals[seg.id] || (p.skipWhenLevelKnown && state.workingLevel)) return true;
      return !!p.label && state.board.pages.some((pg) => v2PagePartLabel(session.plan, pg.title) === p.label);
    });
  })();
  // A closing page opened in this turn (for summaryBegunAt), and whether a next-time line was said.
  let closingOpened = false; let nextTimeSaid = false;
  // Task 7w (SUMMARY_OPENS_CLOSE): the summary begins as its page is written in this reply: marked at once (as the end of the turn
  // would mark it), so the close is open from here (time-box.ts v2CloseOpen) and the check / invitation are read again: an end_lesson
  // later in this reply meets their deferral, never the generic menu. Mic test 7 (embed-1795100797999, 16.9 min).
  const opensClose = gated && TUTOR_V2_CLOSE_ONE_QUESTION && !!session.plan && v2SummaryOpensCloseOn(session);
  let summaryNow = false;
  const summaryReached = () => {
    const before = session.plan!.segments.slice(0, -1);
    const reached = before.filter((seg) => !!state.goals[seg.id] || state.board.pages.some((pg) => !!v2PartOf(seg).label && v2PagePartLabel(session.plan, pg.title) === v2PartOf(seg).label)).length;
    return before.length > 0 && reached * 2 >= before.length;
  };
  // Fix round 1 (I3, ruling): only once every required part before the summary has been reached (the facts' "near"), or the close is
  // open by the clock: an early Summary page is held (earlySummary, below) and opens nothing.
  const requiredDone = () => !!session.plan && (v2PlanContentDone(session.plan, state, true) || selfCloseOpen);
  const summaryOpensNow = () => {
    if (!opensClose || state.closed || typeof state.summaryBegunAt === 'number' || !summaryReached() || !requiredDone()) return;
    state.summaryBegunAt = nowMs; summaryNow = true;
    inviteOwed = v2CloseInviteOwed(session, state, { nowMs, stopAsked, closeByContent: tf.closeByContent, overrun: tf.overrun });
    checkOwed = !checkDeferredBefore && v2CloseCheckOwed(session, state, { nowMs, stopAsked, closeByContent: tf.closeByContent, overrun: tf.overrun, summaryNow: true });
  };
  // The reply's whole text, while a page held until it was complete is let go (D1): the next-time line checks it.
  let releaseText = '';
  // Fix round 2 (N1): the next-time line is said once a lesson. What earlier replies said about next time (the runtime's own
  // line among them) counts as naming a part for it, so no later close names it again.
  const nextTimeBefore = gated && session.plan && TUTOR_V2_PASSED_PART_CLOSE ? state.history.filter((h) => h.role === 'assistant').map((h) => stripBoardBlocks(typeof h.content === 'string' ? h.content : h.content.map((c) => (c.type === 'text' ? c.text : '')).join(' ')))
    .flatMap((t) => t.split(/(?<=[.!?]["'”’)]*)\s+|(?<=[。！？][」』)）"”]*)\s*/)).filter((x) => /\bnext time\b|次回|次の機会/i.test(x)).join(' ') : '';
  // F5: cards said one after another under one lead-in ("Here are two sentences…" and two cards).
  let cardRun = false;
  // Task 6f: notes and tables of example sentences are spoken in a spoken language lesson only (maths and science notes
  // stay on the board, as before).
  const languageLesson = (session.languages?.length ?? 0) >= 2 || !!session.pronunciation;
  // Task 7b (BOARD_LEARNER_SENTENCE): the learner's sentence as it should be, carded where the reply quotes it and writes no
  // card (learner-card.ts). Two corrections and a praised sentence were only spoken (mic test 1, embed-1794882458629).
  const learnerWatch = gated && input.studentSaid && !scoredTurn && v2LearnerCardsOn(session, state, input.studentSaid)
    ? new LearnerCardWatch(input.studentSaid, (s) => v2SentenceOnBoard(state.board, s, state.correctedSentences ?? [])) : null;
  const cardsIn = (parts: InlinePart[]) => (learnerWatch ? learnerWatch.feed(parts) : parts);
  let learnerStored = 0;
  // Task 7a: the page opened on their yes turns as the reply begins (TutorVoiceV2: an agreed page before any words).
  if (released) { pageTurnAt = 0; pageBefore = releasedFrom; toolCalls.push(released); input.onToolCall?.(released); }
  if (visit) { pageTurnAt = 0; pageBefore = visitFrom; toolCalls.push(visit); input.onToolCall?.(visit); }
  // Task 7z (OPENING_PAGE_FIRST): in a lesson whose labelled plan opens on an overview part, the opening reply's first page is the
  // overview's page with the plan title as its heading, written before anything the reply writes (which goes under it). The 7w fallback
  // ran only when the opening reply painted nothing: mic test 8 (embed-1795115593161) had an untitled "Page 1" holding the model's grammar
  // note. No objectives (7w ruling). The overview's own page block then stays on this page (settleInline).
  const openingFirst: string[] = [];
  if (TUTOR_V2_OPENING_PAGE_FIRST && opening && openingOverview && !session.homework && !session.homeworkSheet && !state.closed && state.board.current < 0 && !state.board.pages.length) {
    const heading = String(session.plan!.title ?? '').replace(/[<>]/g, '').replace(/\s+/g, ' ').trim() || openingOverview;
    for (const b of boardBlocksIn(`<board page>${openingOverview.replace(/[<>]/g, '')}</board><board note style="heading">${heading}</board>`)) if (settleInline(b, true)) openingFirst.push(b.raw);
  }
  // Task 7o (NO_MARKDOWN_STARS): spoken lessons that teach a language (mic test 4, 12.87 min).
  const stars = TUTOR_V2_NO_MARKDOWN_STARS && noteTargets ? new V2StarStrip() : null;
  // Fix round 1 (minor 2): the runtime's own lines that may carry the model's words (an offer, a card's ask, a correction) too.
  const unstar = (t: string) => (stars ? v2StripStars(t) : t);
  // Task 8j fix round 1: the fixed hand-over line, said and stored at the end of the reply (the fallback).
  const storeSaid = (t: string) => {
    spoken.push(t); rawSpoken.push(t);
    const last = [...stored].reverse().find((m) => m.role === 'assistant');
    const blocks = last && Array.isArray(last.content) ? last.content as Anthropic.ContentBlockParam[] : null;
    const tb = blocks ? [...blocks].reverse().find((c): c is Anthropic.TextBlockParam => c.type === 'text') : undefined;
    if (tb) tb.text = `${tb.text.trimEnd()}\n\n${t}`;
    else if (stored[stored.length - 1]?.role === 'assistant' && blocks) blocks.unshift({ type: 'text', text: t });
    else stored.push({ role: 'assistant', content: [{ type: 'text', text: t }] });
  };
  const sayHandOver = (line: string) => {
    const t = unstar(line);
    input.onText?.(`\n\n${t}`); saidChars += t.length + 2; saidNow += `\n\n${t}`;
    storeSaid(t);
  };
  for (; modelCalls < V2_MAX_MODEL_CALLS;) {
    const params = {
      model: '',
      // Task 8j fix round 1 (ruling 2): the hand-over's continuation is bounded (tokens, effort, and a time limit below).
      max_tokens: handOverStage === 'continuing' ? V2_HAND_OVER_MAX_TOKENS : V2_MAX_TOKENS,
      thinking: { type: 'adaptive' },
      output_config: { effort: handOverStage === 'continuing' ? 'low' : input.effort ?? V2_DEFAULT_EFFORT },
      system,
      tools,
      // Task 8j fix round 2 (M2): the continuation writes words only: no tool (state, pages, pronunciation) is called in it.
      ...(handOverStage === 'continuing' ? { tool_choice: { type: 'none' } } : {}),
      messages,
    } as unknown as Anthropic.MessageCreateParamsNonStreaming;
    const inline = new BoardInlineStream();
    const gate = new ReplyGate((piece) => {
      // Task 7o (NO_MARKDOWN_STARS): no markdown bold in the words heard, captioned or written in the transcript.
      const t = stars ? stars.push(piece) : piece;
      if (stars && !t) return;
      if (firstTextMs === null && t.trim()) firstTextMs = Date.now() - t0;
      saidChars += t.length; saidNow += t;
      input.onText?.(t);
    }, { dropFrame: gated && TUTOR_V2_PART_OFFER_ONCE && !frameDue && !!session.plan, dropFrameIf, holdGoodbye, closeAsk, holdAsk: summaryDue, summaryBegun: V2_SUMMARY_BEGUN, dropCheckIn: oneQuestion, handedOver: oneQuestion && v2HandsOver(v2ReplySentences(saidNow).pop() ?? '') });
    const hold = (block: InlineBlock, part?: { index: number; title: string } | null) => {
      gate.flush(); gate.releaseAsk(); gate.dropTrailingCheckIn();
      // A held summary page with plan parts not reached: the offer names them and lets the student choose (Task 6e).
      const missed = closesLesson(block.body.trim()) ? v2UnreachedOffer(session.plan, state) : null;
      // The question check only when the last part change did not ask it; an ask ending in the second language is an ask (Task 6e).
      const once = TUTOR_V2_PART_OFFER_ONCE;
      const asked = once ? endsAsking(saidNow.trimEnd()) : /\?\s*$/.test(saidNow);
      // Task 6f (FRAME_NAMES_OPENED), fix round 2: the frame names the page being held, at once: by its plan part's
      // authored name when it is a part's page, else by its heading. Never a part chosen by plan order, never a wait.
      const named = gated && !!session.plan && TUTOR_V2_FRAME_NAMES_OPENED ? v2PagePartLabel(session.plan, block.body.trim()) ?? block.body.trim() : block.body.trim();
      // Task 7a (PART_ASK_EVERY): the ask names the part opening, closes the one in hand, and is never an earlier ask's words;
      // a reply that already asked counts only when it asked about moving on.
      const plan = session.plan;
      const partLabel = plan && part ? v2PartOf(plan.segments[part.index]!).label ?? part.title : '';
      const nextPart = askEvery && plan && part && !missed ? { index: part.index, title: partLabel } : null;
      const inHand = nextPart && plan ? v2PartInHand(plan, state) : -1;
      const doneLabel = inHand >= 0 && plan && plan.segments[inHand]!.kind !== 'hook' && !v2PartOf(plan.segments[inHand]!).skipWhenLevelKnown ? v2PartOf(plan.segments[inHand]!).label : undefined;
      const askedNow = nextPart ? asked && v2IsPartAsk(lastSentences(saidNow, 1)) : asked;
      // Task 7c (ASK_NO_CHECKIN): a reply that already asks something else gets no ask or offer after it (6e minor M1: the offer
      // of a part not reached; the 7a part ask after the model's own question): the page stays held, unasked, and the ask
      // comes on a later reply.
      const unasked = (oneQuestion && (!!missed || !askedNow) && v2ReplyHandsOver(saidNow)) || (!askedNow && endsOnRepeat(saidNow));
      const offer = unasked ? '' : missed ?? (askedNow ? '' : nextPart && plan ? v2PartAskLine({ next: nextPart.title, done: doneLabel, named: v2PartNamedLate(plan.segments[nextPart.index]!, saidNow), history: state.history }) : partOffer(named, namesPart(block.body, saidNow) || namesPart(named, saidNow)));
      heldAt = { raw: block.raw, offer, ...(plan && part && partFlow ? { part: { id: plan.segments[part.index]!.id, title: partLabel } } : {}), ...(unasked ? { unasked } : {}) };
      if (offer) { input.onText?.(`\n\n${unstar(offer)}`); saidChars += unstar(offer).length + 2; }
      input.onToolCall?.({ id: `held_${nowMs.toString(36)}`, name: 'new_page', args: { title: block.body.trim() }, outcome: unasked ? 'not opened yet: held until they are asked whether to go on' : 'not opened yet: the student is asked first' });
    };
    const take = (partsIn: InlinePart[]) => {
      const parts = [...partsIn];
      for (let k = 0; k < parts.length; k++) {
        let part = parts[k];
        if (heldAt) continue;
        if (pendingHold) { pendingHold.push(part); continue; }
        if (handOverParts) { handOverParts.push(part); continue; }
        if ('opening' in part) { gate.flush(); input.onBoardOpen?.(); continue; }
        if ('block' in part) {
          // A problem of another part of the plan, set on a page that already holds one part's problem, is the next
          // part beginning: it gets its page, as if the tutor had written the page block (and so the student is
          // asked first, and a note written just before it goes with it). The exterior-angle rule and its problem
          // went up at the foot of the circle formulas page (ACT Math, portal-87303e9f).
          // Task 8i fix round 1: not in a part-flow lesson, where the part flow opens the parts' pages (7e position, 7i entry, 7k).
          if (part.block.kind === 'problem' && session.plan && !discussion && V2_PART_PAGE && !partFlow && !partPaged && pageTurnAt < 0 && !turnedNow && state.board.current >= 0) {
            const goal = goalForProblem(session.plan, part.block.body);
            const page = state.board.pages[state.board.current];
            const cards = state.problemCards ?? {};
            if (goal && !cards[goal] && Object.entries(cards).some(([g, id]) => g !== goal && page.items.some((it) => it.id === id))) {
              const lead = page.items.filter((it) => sinceWords.includes(it.id) && it.tool === 'annotate').map((it) => it.summary.split(/[:\n]/)[0].trim()).find((h) => h && h.split(/\s+/).length <= 6);
              const slug = goal.split(/[-_]/).slice(1).join(' ');
              const title = lead || (slug ? slug[0].toUpperCase() + slug.slice(1) : '');
              const synth = title ? boardBlocksIn(`<board page>${title}</board>`)[0] : undefined;
              partPaged = true;
              // Its place in the reply is the problem's: a held page cuts the stored reply there.
              if (synth) { parts.splice(k, 0, { block: { ...synth, raw: part.block.raw } }); k -= 1; continue; }
            }
          }
          gate.flush();
          // Task 7e fix round 1: a card the model writes after words that move into the held part goes on its page. Not the
          // runtime's own learner card (an echo of their sentence, praised or corrected): a reply that praises a sentence of
          // the held part and then asks to go on past it would open a page for a part the lesson leaves; the reply's end decides.
          if (part.block.kind !== 'page' && !learnerWatch?.isOwn(part.block.raw)) movesIntoHeld(saidNow);
          // Task 7a: the part a page opens (part-flow.ts v2PageForPart), and the page of the part just opened on their yes, which
          // the reply writes again, is already open.
          let pagePart: { index: number; title: string } | null = null;
          if (part.block.kind === 'page' && (partFlow || askEvery) && session.plan && !closesLesson(part.block.body)) {
            const title = part.block.body.trim();
            if (released && (v2PartOfPage(session.plan, title) === v2PartOfPage(session.plan, String(released.args.title)) || title.replace(/\s+/g, '').toLowerCase() === String(released.args.title).replace(/\s+/g, '').toLowerCase())) {
              // Fix round 1 (review M3): out of the stored reply too, so the history holds one page block for it (at its head).
              retitles.push([part.block.raw, '']);
              continue;
            }
            pagePart = boardHasPage(title) ? null : v2PageForPart(session.plan, state, title);
            // Its heading is the part's name, so the chip, the page and "Next is…" name one part.
            if (partFlow && pagePart && pagePart.title !== title) part = { block: { ...part.block, body: pagePart.title } };
          }
          // Task 7f C (PART_MIN_PRACTICE): a page that would leave the practice part in hand short of its sentences (the next
          // part's, or the summary's) is not opened: the reply ends here, and the runtime asks for another sentence of theirs
          // in place of the page and all that followed it (nothing, when the reply already ends asking them something).
          if (practiceShort && session.plan && part.block.kind === 'page' && !boardHasPage(part.block.body) && (closesLesson(part.block.body) || (!!pagePart && pagePart.index !== practiceShort.index))) {
            gate.flush(); gate.releaseAsk(); gate.dropTrailingCheckIn();
            const offer = v2ReplyHandsOver(saidNow) || endsAsking(lastSentences(stripBoardBlocks(saidNow), 1)) ? '' : v2PracticeMoreLine(state.history);
            heldAt = { raw: part.block.raw, offer, practice: true };
            if (offer) { input.onText?.(`\n\n${unstar(offer)}`); saidChars += unstar(offer).length + 2; }
            input.onToolCall?.({ id: `held_${nowMs.toString(36)}`, name: 'new_page', args: { title: part.block.body.trim() }, outcome: 'not opened: the learner has not yet said enough sentences of their own in this part' });
            continue;
          }
          // A new part the student has not been asked about is not opened in this reply (part-close.ts): the
          // reply ends here, with the offer in place of the page and all that followed it.
          // Fix round 2 (N2): a page that closes the lesson is held whatever the frame budget when its offer names a part
          // not reached ("Before the summary, there is still…"). Fix round 3 (P2): only then: with the budget spent and
          // nothing missed, it opens, and no frame is asked.
          // Task 6f: a reply that has begun the summary ("here is a quick summary") is not held at its page for the offer of
          // a part not reached: the page opens, and the part is named as next time where it stands.
          // Fix round 1 (minors 6, 7): begun in the last sentence or two before the page, not anywhere in the reply; and the
          // page is let through only when there is a next-time line to say in place of the offer.
          const beganNow = part.block.kind === 'page' && V2_SUMMARY_BEGUN.test(lastSentences(saidNow, 2));
          const closingPage = part.block.kind === 'page' && !discussion && closesLesson(part.block.body);
          // Task 6g (PASSED_PART_CLOSE): the line is also said where the summary page opens when the reply that opens it closes
          // the lesson (a page held until the reply was complete, let go by its end_lesson: tester B's last reply named the
          // part nowhere), or the summary began in an earlier reply; and for a part offered twice or skipped, not only one
          // the held offer would name.
          const lineDue = beganNow || (TUTOR_V2_PASSED_PART_CLOSE && (releasing || summaryBefore));
          const lineHere = gated && TUTOR_V2_SUMMARY_BEGUN_NEXT_TIME && lineDue && closingPage && !nextTimeAt && !nextTimeSaid && !boardHasPage(part.block.body) && !state.closed && (TUTOR_V2_PASSED_PART_CLOSE || !!v2UnreachedOffer(session.plan, state)) ? v2NextTimeAllLine(session.plan, state, `${releasing ? releaseText : ''} ${nextTimeBefore}`.trim()) : null;
          const summaryBegun = !!lineHere;
          // Task 7a (PART_ASK_EVERY): a page of the part in hand, or the first teaching part after the level check, is no part
          // change and goes straight on; a check-in does not leave the way open (mayOpenPart strict).
          const partChange = !askEvery || closingPage || !pagePart || !session.plan || v2PartChangeAsked(session.plan, state, pagePart.index);
          // Task 7r (PART_GO_NAMED): a page of the part their go answered (the ask named it, or the summary) opens: the ask the
          // runtime could not read left "Conversation" held with no ask after "Uh, no, let's go." (mic test 5, embed-1795050656326).
          const goIndex = part.block.kind === 'page' && session.plan ? (closingPage ? session.plan.segments.length - 1 : pagePart?.index ?? -1) : -1;
          // Fix round 4 (I-E): the summary page in the reply to their no to the optional part offered (declinedNow), when the
          // summary is then next by plan order: they chose it; no offer of the part again in place of the page.
          const goForPage = TUTOR_V2_PART_GO_NAMED && askEvery && !!session.plan && goIndex >= 0 && (v2GoForPart(input.studentSaid, lastTutorText, session.plan, state, goIndex, askLangs)
            || (declinedNow >= 0 && goIndex === session.plan.segments.length - 1 && v2NextPart(session.plan, state, v2PartInHand(session.plan, state)) === goIndex));
          // Fix round 1 (I3, ruling): a Summary page before every required part was reached (and the close is not open by the clock,
          // nor a closing turn) is held like any other part page out of order: not shown, nothing begun; the close rules before 7w apply.
          // A plan whose parts the lesson has all been to (no part left to offer: v2UnreachedOffer, the 6e rule) is no page out of order:
          // it opens as before, and the summary opens the close only once the required parts are done (summaryOpensNow).
          const earlySummary = opensClose && closingPage && !closingTurn && !summaryBefore && !goForPage && !requiredDone() && !!v2UnreachedOffer(session.plan, state) && !boardHasPage(part.block.body) && !state.closed && !releasing;
          const holdIt = earlySummary || !goForPage && part.block.kind === 'page' && !discussion && !summaryBegun && !(summaryBefore && closingPage) && ((closingPage ? frameDueOld : frameDue) || (closesLesson(part.block.body) && !!v2UnreachedOffer(session.plan, state))) && partChange && !boardHasPage(part.block.body) && !state.closed && !closingTurn && !releasing && !mayOpenPart({ title: part.block.body, studentSaid: input.studentSaid, lastTutor: lastTutorText, pagesOpen: state.board.pages.length, strict: askEvery, ...(askEvery && TUTOR_V2_PAGE_NEEDS_GO ? { go: v2MoveAnswer(input.studentSaid, lastTutorText, askLangs, undefined, session.plan) === 'go' } : {}) });
          // Task 8j (SUMMARY_HAND_OVER), fix round 1: the Summary page the model opens while the optional part in hand is held by 7x
          // (v2OptionalHold: its items not done and its minutes not over), on no closing turn, is held (mic test 13, embed-1795453600266:
          // the pronunciation score, the Summary and the check question in one reply). What follows it waits for the reply's end (its
          // end_lesson decides, below); then one continuation call finishes the reply with the hand-over. Not on the reply after the
          // runtime's hand-over, nor on their go (goForPage). Fix round 2 (I1): words before it that began the summary do not exempt it.
          if (!holdIt && closingPage && handOverOn && !!optionalHold && !closingTurn && !releasing && !stopAsked && !summaryBefore && !goForPage && !handedOverBefore && !boardHasPage(part.block.body) && !state.closed) {
            gate.flush();
            if (handOverStage === 'continuing') {
              // The continuation wrote the page again: the fallback (its words so far, then the fixed line).
              gate.releaseAsk(); gate.dropTrailingCheckIn();
              const offer = endsAsking(lastSentences(stripBoardBlocks(saidNow), 1)) ? '' : V2_SUMMARY_HAND_OVER_LINE;
              heldAt = { raw: part.block.raw, offer };
              if (offer) { input.onText?.(`\n\n${unstar(offer)}`); saidChars += unstar(offer).length + 2; }
              handOverGiven = true;
              continue;
            }
            // Fix round 2 (I1): not exempt when the words before it announced the summary: the continuation says this part ends first.
            handOverBegan = beganNow;
            handOverParts = [part];
            continue;
          }
          // Task 6g: the summary begins here, so a practice ask waiting before it is dropped; any other page lets it go.
          if (part.block.kind === 'page' && !holdIt) { if (closingPage) { gate.summaryBegins(); closingOpened = true; summaryOpensNow(); } else gate.releaseAsk(); }
          // Task 7d: not said while their questions are still to be invited (the page still opens): the line goes on the reply
          // that closes. Task 7w: read after a summary that begins here has opened the close.
          const summaryLine = inviteOwed || earlySummary ? null : lineHere;
          if (summaryLine) { nextTimeAt = { raw: part.block.raw, line: summaryLine }; nextTimeSaid = true; gate.push(` ${summaryLine} `); gate.flush(); }
          if (holdIt) {
            // In the box's last fifth the tutor may close by itself, and a reply that does is a closing turn: whether it
            // does is known only when the reply is complete, so the page and what follows it wait until then (D1).
            // Only a page that closes the lesson waits: any other is held at once and the offer streams as before
            // (task 6b review I1: deferring every page left a timed lesson's last fifth silent until the reply was written).
            if (TUTOR_V2_CLOSE_OPENS_SUMMARY && selfCloseOpen && closesLesson(part.block.body)) { pendingHold = [part]; continue; }
            hold(part.block, pagePart);
            continue;
          }
          if (partFlow && part.block.kind === 'page' && pagePart && part.block.body !== part.block.raw.replace(/^<board\s+page\b[^>]*>|<\/board>$/g, '')) retitles.push([part.block.raw, `<board page>${part.block.body}</board>`]);
          if (part.block.kind === 'page' && pageTurnAt < 0) { pageTurnAt = saidChars; pageBefore = state.board.current; pagesBefore = state.board.pages.length; }
          if (part.block.kind === 'page') {
            const from = state.board.current; // A line of working is not carried: written just before the turn, it closes what came
            // before it: the count of domains for the molecule just answered was moved onto the next part's page
            // (chemistry, embed-1794459147431).
            const moving = from >= 0 ? state.board.pages[from].items.filter((it) => sinceWords.includes(it.id) && !['show_equation', 'show_problem'].includes(it.tool)) : [];
            carryNow = moving.map((it) => it.id);
            const turned = settleInline(part.block);
            if (turned && moving.length && state.board.current !== from) { state.board.pages[from].items = state.board.pages[from].items.filter((it) => !moving.includes(it)); state.board.pages[state.board.current].items.push(...moving); }
            carryNow = []; sinceWords = [];
          } else {
            // Task 7u (CARD_AT_SENTENCE): what the card's or note's words will be spoken as is known before it is sent, so the
            // client places it at that sentence (V2ToolCall.timed): the runtime speaks it next, or the board keeps it at the
            // sentence that quotes it, never ahead of what the reply wrote before it. Spoken lessons that teach a language only.
            const sayAhead = part.block.kind === 'sentence' && gated && TUTOR_V2_SAY_SENTENCE_CARD && !learnerWatch?.isOwn(part.block.raw) ? sentenceCardToSay(part.block.body, `${saidNow}${gate.heldAsk}`, { leadIn: true, continuing: cardRun }) : null;
            const noteAhead = (part.block.kind === 'note' || part.block.kind === 'table') && gated && languageLesson && TUTOR_V2_SAY_NOTE_SENTENCES ? noteSentencesToSay(part.block.kind, part.block.body, `${saidNow}${gate.heldAsk}`) : null;
            inlineTimed = TUTOR_V2_CARD_AT_SENTENCE && gated && languageLesson ? (sayAhead || noteAhead?.announced ? 'next' : 'text') : undefined;
            // Task 7x (REPEAT_THEN_WAIT): a question card after the repeat ask is not painted (out of the stored reply too).
            const before = inlineN;
            try { if (settleInline(part.block)) sinceWords.push(`inl_${nowMs.toString(36)}_${before + 1}`); } finally { inlineTimed = undefined; }
          }
          // A sentence card after "we say:" is spoken there too (board-timing.ts sentenceCardToSay, Task 6e).
          // Fix round 1 (F5): after a lead-in with or without a colon, and the next card under the same lead-in; never
          // when the words before it ask them something. Said only if the model's next sentence does not say it (reply-gate.ts).
          // Fix round 3: spoken teaching lessons only (not voice homework or a discussion).
          if (part.block.kind === 'sentence' && gated && TUTOR_V2_SAY_SENTENCE_CARD) {
            // Fix round 1 (minor 3): a practice ask the gate holds is part of what was said before the card.
            // Task 7b: never the runtime's own card: its sentence is the reply's quote, already said.
            const say = learnerWatch?.isOwn(part.block.raw) ? null : sentenceCardToSay(part.block.body, `${saidNow}${gate.heldAsk}`, { leadIn: true, continuing: cardRun });
            if (say) { saidCards.set(part.block.raw, say); sinceWords = []; gate.speakCard(say); cardRun = true; }
          }
          // Task 7m (QUESTION_ONCE, mic test 4 flag 5a): a question card of a spoken language lesson is asked where it stands, before
          // the hint that follows it ("まず、一文で答えてみてください。Try starting with…"), unless the words before it said it; the
          // model saying it straight after drops this (the gate). Read after the hint, the whole card came out a second time.
          if (part.block.kind === 'problem' && gated && questionCards && TUTOR_V2_QUESTION_ONCE) {
            const shown = toolCalls[toolCalls.length - 1];
            const q = shown?.name === 'show_problem' && !/^not /.test(shown.outcome) ? cardQuestion(String(shown.args.statement ?? '')) : null;
            // Task 7z (UNHEARD_ASK_OWED): without a lead-in clause the sentence just before it said ("Before we finish, …" twice, T101).
            const qSay = q && TUTOR_V2_UNHEARD_ASK_OWED ? v2DropSaidLead(q, `${saidNow}${gate.heldAsk}`) : q;
            if (q && qSay && !saidCovers(q, `${saidNow}${gate.heldAsk}`)) { saidCards.set(part.block.raw, qSay); questionSaid.set(part.block.raw, qSay); sinceWords = []; gate.speakCard(qSay); }
          }
          // Task 6f: a note or a table of example sentences a lead-in points at is spoken there too (board-timing.ts
          // noteSentencesToSay): announced before it, at once; otherwise only if the next sentence points back at it.
          if ((part.block.kind === 'note' || part.block.kind === 'table') && gated && languageLesson && TUTOR_V2_SAY_NOTE_SENTENCES) {
            const note = noteSentencesToSay(part.block.kind, part.block.body, `${saidNow}${gate.heldAsk}`);
            if (note) {
              saidCards.set(part.block.raw, note.say); sinceWords = [];
              if (note.announced) gate.speakCard(note.say, { perSentence: true }); else gate.speakCardIf(note.say, pointsBackAtBoard, { perSentence: true });
            }
          }
          continue;
        }
        if (part.text.trim()) { sinceWords = []; cardRun = false; }
        gate.push(part.text);
      }
    };
    // Fix round 1 (I3): when the words end, the last sentence goes out (it waited for the white space after it, or for the
    // call to return, behind any trailing tool calls), and a practice ask still waiting goes too, unless a closing page waits
    // on the end of the reply (pendingHold) or a goodbye is held: their outcome decides it.
    // Task 8j fix round 1 (ruling 2): the continuation that fails or runs past its time limit falls back to the fixed hand-over line;
    // nothing it streams after that is taken.
    let callCut = false;
    if (handOverStage === 'continuing') { contAbort = new AbortController(); const ac = contAbort; if (input.signal?.aborted) ac.abort(); else input.signal?.addEventListener('abort', () => ac.abort(), { once: true }); contFrom = saidNow.length; }
    const modelCall = callModel(params, (delta) => { if (!callCut) take(cardsIn(inline.push(delta))); }, handOverStage === 'continuing' ? contAbort!.signal : input.signal, (type) => { if (callCut || type !== 'text' || pendingHold) return; gate.flush(); if (!pendingHold && !gate.holdsGoodbye) gate.releaseAsk(); });
    let response: Anthropic.Message;
    if (handOverStage === 'continuing') {
      let timer: ReturnType<typeof setTimeout> | undefined;
      const got = await Promise.race([modelCall, new Promise<null>((r) => { timer = setTimeout(() => r(null), V2_HAND_OVER_TIMEOUT_MS); })]).catch(() => null).finally(() => clearTimeout(timer));
      if (!got) {
        // Fix round 2 (M1): the unfinished sentence is dropped (never said); the complete sentences said are kept in the stored reply.
        callCut = true; modelCall.catch(() => undefined); contAbort?.abort();
        gate.dropTail(); gate.flush(); gate.releaseAsk();
        handOverStage = 'done';
        const contSaid = contFrom >= 0 ? stripBoardBlocks(saidNow.slice(contFrom)).trim() : '';
        if (contSaid) storeSaid(contSaid);
        const line = endsAsking(lastSentences(stripBoardBlocks(saidNow), 1)) ? '' : V2_SUMMARY_HAND_OVER_LINE;
        if (line) sayHandOver(line);
        handOverGiven = true;
        heldAt = { raw: handOverRaw!, offer: '' };
        break;
      }
      response = got;
    } else response = await modelCall;
    take(cardsIn(inline.flush()));
    if (learnerWatch) take(learnerWatch.end());
    gate.flush();
    if (pendingHold) {
      // The reply is complete. One that calls end_lesson (accepted: this is the last fifth) is the close, and its page opens
      // with all that followed it; any other is held at the page, as at once before (D1).
      const waiting: InlinePart[] = pendingHold; pendingHold = null;
      const block = (waiting[0] as { block: InlineBlock }).block;
      if (response.content.some((b) => b.type === 'tool_use' && b.name === 'end_lesson')) { releasing = true; releaseText = response.content.map((b) => (b.type === 'text' ? b.text : '')).join(' '); try { take(waiting); gate.flush(); } finally { releasing = false; releaseText = ''; } }
      else hold(block);
    }
    if (handOverParts) {
      // Task 8j fix round 1 (rulings 1, 3): the reply is complete. An end_lesson because the student asked, or one after an in-part
      // deferral already given, is a close: the page opens with all that followed it, as at 663fe546 (a D1 release). Otherwise the page
      // stays held: nothing from it on is said, painted or stored (its board tool calls go with it), and its end_lesson is deferred.
      const waiting: InlinePart[] = handOverParts; handOverParts = null;
      const end = response.content.find((b): b is Anthropic.ToolUseBlock => b.type === 'tool_use' && b.name === 'end_lesson');
      if (end && ((end.input as { because?: unknown } | null)?.because === 'student_asked' || inPartDeferred)) { releasing = true; releaseText = response.content.map((b) => (b.type === 'text' ? b.text : '')).join(' '); try { take(waiting); gate.flush(); } finally { releasing = false; releaseText = ''; } }
      else {
        handOverRaw = (waiting[0] as { block: InlineBlock }).block.raw;
        gate.releaseAsk(); gate.dropTrailingCheckIn();
        let cut = false;
        for (const b of response.content) {
          if (b.type !== 'text') continue;
          if (cut) { b.text = ''; continue; }
          const at = b.text.indexOf(handOverRaw);
          if (at >= 0) { b.text = b.text.slice(0, at).trimEnd(); cut = true; }
        }
        response.content = response.content.filter((b) => (b.type === 'text' ? !!b.text.trim() : b.type !== 'tool_use' || V2_CONTROL_TOOL_NAMES.has(b.name)));
      }
    }
    // Task 8j fix round 2 (M2): a new_page call titled as the closing page is held as the inline page is (its words were all said: the
    // call has no place in them). It and every board call after it are dropped; an end_lesson decides as above.
    if (!handOverRaw && handOverStage === 'none') {
      const at = response.content.findIndex((b) => b.type === 'tool_use' && b.name === 'new_page' && closesLesson(String((b.input as { title?: unknown } | null)?.title ?? '')));
      const np = at >= 0 ? response.content[at] as Anthropic.ToolUseBlock : null;
      const end = response.content.find((b): b is Anthropic.ToolUseBlock => b.type === 'tool_use' && b.name === 'end_lesson');
      if (np && handOverMay(String((np.input as { title?: unknown }).title)) && !(end && ((end.input as { because?: unknown } | null)?.because === 'student_asked' || inPartDeferred))) {
        handOverRaw = `\u0000new_page:${np.id}`;
        handOverBegan = V2_SUMMARY_BEGUN.test(lastSentences(stripBoardBlocks(saidNow), 2));
        gate.releaseAsk(); gate.dropTrailingCheckIn();
        response.content = response.content.filter((b, k) => b.type !== 'tool_use' || k < at || V2_CONTROL_TOOL_NAMES.has(b.name));
      }
    }
    // Task 8j fix round 2 (I2): words before the held page that already end on a question: no continuation, no line, no hand-over state.
    // The reply ends at that question; the next reply that writes the page is held again and gets the hand-over then.
    if (handOverRaw && handOverStage === 'none' && (v2ReplyHandsOver(saidNow) || endsAsking(lastSentences(stripBoardBlocks(saidNow), 1)))) {
      handOverStage = 'done';
      heldAt = { raw: handOverRaw, offer: '' };
    }
    // Task 8j fix round 2 (M2): the continuation calls no tool (tool_choice none; any that comes is dropped, unrun).
    if (handOverStage === 'continuing') response.content = response.content.filter((b) => b.type !== 'tool_use');
    // Task 6g: the reply is complete; a practice ask still waiting goes out (one before a held goodbye waits for the close).
    if (!gate.holdsGoodbye) gate.releaseAsk();
    // Task 7c fix round 1: this call's words are complete; a check-in straight after a hand-over ended them, and is dropped.
    gate.dropTrailingCheckIn();
    askDrops += gate.framesDroppedIf;
    for (const [from, to] of retitles.splice(0)) for (const b of response.content) if (b.type === 'text' && b.text.includes(from)) { b.text = b.text.replace(from, to); break; }
    // Task 7b: the runtime's card is stored where it was written, after the sentence that quotes it.
    for (const w of learnerWatch?.written.slice(learnerStored) ?? []) {
      learnerStored += 1;
      for (const b of response.content) { if (b.type !== 'text') continue; const at = b.text.indexOf(w.after); if (at >= 0) { const end = at + w.after.length; const rest = b.text.slice(end); b.text = `${b.text.slice(0, end)} ${w.raw}${!rest || /^\s/.test(rest) ? '' : ' '}${rest}`; break; } }
    }
    const nextTime = nextTimeAt as { raw: string; line: string } | null;
    if (nextTime) {
      for (const b of response.content) if (b.type === 'text' && b.text.includes(nextTime.raw)) { b.text = b.text.replace(nextTime.raw, `${nextTime.line}\n${nextTime.raw}`); break; }
      nextTimeAt = null;
    }
    const held = heldAt as { raw: string; offer: string } | null;
    if (held) {
      // The history keeps what was said: the reply up to the held page, then the offer.
      let cut = false;
      for (const b of response.content) {
        if (b.type !== 'text') continue;
        if (cut) { b.text = ''; continue; }
        const at = b.text.indexOf(held.raw);
        if (at >= 0) { b.text = `${b.text.slice(0, at).trimEnd()}${held.offer ? `\n\n${held.offer}` : ''}`.trim(); cut = true; }
      }
    }
    modelCalls += 1;
    if (response.model) usage.model = response.model;
    usage.inputTokens += response.usage.input_tokens;
    usage.outputTokens += response.usage.output_tokens;
    usage.cacheReadTokens += response.usage.cache_read_input_tokens ?? 0;
    usage.cacheCreationTokens += response.usage.cache_creation_input_tokens ?? 0;

    const results: Anthropic.ToolResultBlockParam[] = [];
    const spokenBefore = spoken.length; const rawBefore = rawSpoken.length; const callsBefore = toolCalls.length;
    // A sentence card that was also spoken (sentenceCardToSay) counts among the words said; one the model said itself is in its words.
    const saidHere = () => new Map([...saidCards].filter(([, say]) => gate.saidCards.includes(say)).map(([raw, say]) => [raw, gate.cardSaidAs.get(say) ?? say] as [string, string]));
    const wordsOf = (text: string) => { const cards = saidHere(); return stripBoardBlocks(cards.size ? [...cards].reduce((t, [raw, say]) => t.split(raw).join(` ${say} `), text) : text); };
    // Fix round 2 (E1): never inside a board block: a note's own sentence repeated after it in speech was cut from the
    // note's body, not from the speech. The first occurrence outside every block is removed.
    const removeFrom = (gone: string) => {
      for (const b of response.content) {
        if (b.type !== 'text') continue;
        const at = indexOutsideBlocks(b.text, gone);
        if (at < 0) continue;
        b.text = `${b.text.slice(0, at)}${b.text.slice(at + gone.length)}`.replace(/[ \t]{2,}/g, ' ');
        return;
      }
    };
    for (const block of response.content) {
      if (block.type === 'text') { const words = wordsOf(block.text); if (words) { spoken.push(words); rawSpoken.push(block.text.trim()); } continue; }
      if (block.type !== 'tool_use') continue;
      results.push(settle(block));
    }
    // F3, F4: the held goodbye. A close the runtime refused takes its goodbye with it: the lesson goes on and nothing is
    // said after a goodbye (gdi-real-james: the next-steps menu followed "See you next time!"). Otherwise it goes out, after a
    // line naming an optional part that was not reached, when the reply has not named it (gdi-real-josh's stop goodbye).
    if (gate.holdsGoodbye) {
      const ended = toolCalls.slice(callsBefore).find((c) => c.name === 'end_lesson');
      if (ended && /^not /.test(ended.outcome) && (TUTOR_V2_CLOSE_ONE_QUESTION || ended.outcome === V2_CLOSE_INVITE_REFUSAL || ended.outcome === V2_CLOSE_INVITE_REFUSAL_GIVEN || ended.outcome === V2_CLOSE_INVITE_WAIT)) gate.dropHeld();
      else {
        // Fix round 2 (N1): only a goodbye that closes the lesson (a close accepted now, or a closing turn) gets the line.
        const closing = closingTurn || (!!ended && !/^not /.test(ended.outcome));
        const line = TUTOR_V2_PASSED_PART_CLOSE && closing ? v2NextTimeLine(session.plan, state, `${saidNow} ${gate.held} ${nextTimeBefore}`) : null;
        const firstHeld = gate.held.split(/(?<=[.!?。！？])\s+/)[0] ?? '';
        if (line && firstHeld) for (const b of response.content) if (b.type === 'text' && b.text.includes(firstHeld)) { b.text = b.text.replace(firstHeld, `${line} ${firstHeld}`); break; }
        if (line) nextTimeSaid = true;
        gate.releaseHeld(line ?? undefined);
      }
    } else if (gated && TUTOR_V2_PASSED_PART_CLOSE && session.plan && !nextTimeSaid) {
      // Task 6g: a close with no goodbye the gate could hold still names an optional part it skipped, at its end, when the
      // reply has not: a close accepted now, or the student's stop. Every lesson that skips one names it at the close.
      const ended = toolCalls.slice(callsBefore).find((c) => c.name === 'end_lesson');
      // Fix round 2 (N1): only a reply that closes: an accepted end_lesson, the student's stop, or a reply that began the summary
      // or opened a closing page; on its last call, never after a practice ask, and once a lesson. "Any closing turn" put the
      // line at the end of every wrap-due and time-up reply, practice asks included.
      const lastSaid = lastSentences(stripBoardBlocks(saidNow), 1);
      // Never in a reply held at a page with an offer in its place: it ends asking (6f minor 6: "Here is a quick summary of
      // your sentence…" far before a held page drew the line after the offer). Summary words count in the last two
      // sentences only, as beganNow.
      const closes = (!!ended && !/^not /.test(ended.outcome))
        || (response.stop_reason !== 'tool_use' && !heldAt && ((TUTOR_V2_STOP_SIGNAL && v2StopAsked(input.studentSaid)) || closingOpened || V2_SUMMARY_BEGUN.test(lastSentences(stripBoardBlocks(saidNow), 2))));
      // Fix round 3: an accepted end_lesson is a real close: a closing question at its end does not stop the line, which goes
      // before that question in the stored reply (it was said already, so in speech the line follows it).
      const endedNow = !!ended && !/^not /.test(ended.outcome);
      // Task 7d: a reply that does not close while their questions are still to be invited says it later, on the close.
      const line = closes && !heldAt && (endedNow || !inviteOwed) && (endedNow || (!v2IsPracticeAsk(lastSaid) && !endsAsking(lastSaid))) ? v2NextTimeLine(session.plan, state, `${saidNow} ${nextTimeBefore}`) : null;
      if (line) {
        nextTimeSaid = true;
        gate.push(` ${line}`); gate.flush();
        const last = [...response.content].reverse().find((b): b is Anthropic.TextBlock => b.type === 'text');
        const q = endedNow && endsAsking(lastSaid) && last ? last.text.lastIndexOf(lastSaid.trim()) : -1;
        if (last && q >= 0) last.text = `${last.text.slice(0, q)}${line} ${last.text.slice(q)}`;
        else if (last) last.text = `${last.text.trimEnd()} ${line}`; else response.content.push({ type: 'text', text: line, citations: null } as Anthropic.TextBlock);
        spoken.splice(spokenBefore); rawSpoken.splice(rawBefore);
        for (const block of response.content) if (block.type === 'text') { const words = wordsOf(block.text); if (words) { spoken.push(words); rawSpoken.push(block.text.trim()); } }
      }
    }
    if (gate.removed.length) {
      // What did not go out leaves the reply as stored and as spoken (a dropped frame, a dropped goodbye).
      for (const gone of gate.removed) removeFrom(gone);
      framesDropped += gate.removed.filter((x) => isPartFrame(x)).length;
      spoken.splice(spokenBefore); rawSpoken.splice(rawBefore);
      for (const block of response.content) if (block.type === 'text') { const words = wordsOf(block.text); if (words) { spoken.push(words); rawSpoken.push(block.text.trim()); } }
    }

    // Fix round 2 (N3): a text block emptied by a removal is dropped: sent back to the model with the next call
    // ([text "", tool_use end_lesson] after a refused close), the API refuses it.
    if (gate.removed.length) response.content = response.content.filter((b) => b.type !== 'text' || !!b.text.trim());
    const keep = storable(response.content);
    // Task 7s (QUESTION_ONCE fix, item 1): a card's question the runtime spoke is part of the reply as stored, once, after its card
    // (where it was said): only the raw block was kept, so the next turn's "were they asked for a sentence?" (learner-card.ts) read
    // a Japanese lead-in with no question, and 7g's card line and 7q's counting were skipped for 5 of 6 corrected answers (mic
    // test 5, embed-1795050656326). Before 7m the same question was appended to the stored text by unsaidAsk.
    for (const [raw, q] of questionSaid) {
      if (!gate.saidCards.includes(q)) continue;
      for (const b of keep) {
        if (b.type !== 'text') continue;
        const at = b.text.indexOf(raw);
        if (at < 0) continue;
        if (!saidCovers(q, stripBoardBlocks(b.text))) { const end = at + raw.length; b.text = `${b.text.slice(0, end)}\n${q}${b.text.slice(end)}`; }
        break;
      }
    }
    questionSaid.clear();
    // Task 8j fix round 1: the continuation is the same reply: stored with the words before the page when nothing came between.
    const prevStored = stored[stored.length - 1];
    if (keep.length && handOverStage === 'continuing' && prevStored?.role === 'assistant' && Array.isArray(prevStored.content)) prevStored.content = [...prevStored.content, ...keep];
    else if (keep.length) stored.push({ role: 'assistant', content: keep });
    // Every stored tool call is followed by its result, whatever the stop reason was
    // (a reply cut at the token limit can carry finished tool calls): the API refuses
    // a history in which one is missing.
    if (results.length) stored.push({ role: 'user', content: results });
    // Task 8j fix round 1 (ruling 2): the continuation is done: the reply ends on the hand-over (the fixed line when its last
    // sentence asks nothing); a held Summary page in it already had the fallback.
    if (handOverStage === 'continuing') {
      handOverStage = 'done';
      if (!heldAt) {
        if (!endsAsking(lastSentences(stripBoardBlocks(saidNow), 1))) sayHandOver(V2_SUMMARY_HAND_OVER_LINE);
        handOverGiven = true;
        heldAt = { raw: handOverRaw!, offer: '' };
      }
      break;
    }
    // …the first call held the Summary page: one continuation call finishes the reply from where the student stopped hearing it.
    if (handOverRaw && handOverStage === 'none' && !input.signal?.aborted) {
      handOverStage = 'continuing';
      const nudge: Anthropic.TextBlockParam = { type: 'text', text: handOverBegan ? V2_HAND_OVER_CONTINUE_BEGAN : V2_HAND_OVER_CONTINUE };
      const said = response.content.filter((b) => b.type !== 'text' || !!b.text.trim());
      messages = said.some((b) => b.type === 'text' || b.type === 'tool_use')
        ? [...messages, { role: 'assistant', content: said as unknown as Anthropic.ContentBlockParam[] }, { role: 'user', content: [...results, nudge] }]
        : [...messages.slice(0, -1), { role: 'user', content: [...(messages[messages.length - 1].content as Anthropic.ContentBlockParam[]), nudge] }];
      continue;
    }
    if (handOverRaw && handOverStage === 'none') { handOverStage = 'done'; sayHandOver(V2_SUMMARY_HAND_OVER_LINE); handOverGiven = true; heldAt = { raw: handOverRaw, offer: '' }; }
    if (heldAt) break;
    // Task 7d fix round 1 (I2): a second end_lesson after the invitation's refusal: the reply stands as said, ending on the
    // invitation, and the turn ends with the lesson open (no further model call, nothing said again).
    if (inviteWait) break;
    // No words and no call where words are owed: ask once more.
    if (mustSpeak && !spoken.length && results.length === 0 && modelCalls < 3 && !input.signal?.aborted) continue;
    // A discussion reply that is only notes and marks leaves the person in silence: in voice no words means
    // "keep listening", and they heard nothing after saying what worried them (replay review 2026-11-14). The
    // model is told so, once, and answers.
    if (discussion && input.studentSaid !== null && !spoken.length && !toolCalls.some((c) => c.name === 'keep_listening' || c.name === 'end_lesson') && response.stop_reason !== 'tool_use' && modelCalls < V2_MAX_MODEL_CALLS && !input.signal?.aborted && !owedAsked) {
      owedAsked = true;
      const nudge: Anthropic.TextBlockParam = { type: 'text', text: '[check — from the system running the session, not from the person] Your reply had no words, and they are waiting for you. Reply now to what they just said.' };
      const assistant = storable(response.content);
      messages = assistant.length
        ? [...messages, { role: 'assistant', content: response.content as unknown as Anthropic.ContentBlockParam[] }, { role: 'user', content: [...results, nudge] }]
        : [...messages.slice(0, -1), { role: 'user', content: [...(messages[messages.length - 1].content as Anthropic.ContentBlockParam[]), nudge] }];
      continue;
    }
    if (results.length === 0) break;
    // Calls with no words where words are owed go round again, whatever the stop reason: a reply that was only
    // note_own_answer, stopped as end_turn, left the student with nothing (GAC validation fixed3, 2026-11-15).
    if (response.stop_reason !== 'tool_use' && !(mustSpeak && !spoken.length && modelCalls < 3 && !input.signal?.aborted)) break;
    // The model is called again only when it has something to react to: a tool call that
    // did not do what was asked, or a reply with no words yet. When it has spoken and every
    // call worked, the turn is over — a second call tends to say the same thing again, and
    // costs the student a wait.
    // A level the gate held back (D7) is no reason to call the model again when the reply has already asked them
    // something, or when the check is over: a second call added a second question to the same reply (review I3).
    const asked = asksAnywhere(spoken.join(' ').split(/(?<=[.!?])\s+|(?<=[？。])/).filter((x) => x.trim()));
    const quietRefusal = (c: string) => c.startsWith(V2_LEVEL_WAIT_OVER) || (c.startsWith(V2_LEVEL_WAIT) && asked);
    const somethingFailed = results.some((r) => /^not /.test(String(r.content)) && !quietRefusal(String(r.content)));
    if (spoken.length > 0 && !somethingFailed) break;
    // Silence was the reply.
    if (toolCalls.some((c) => c.name === 'keep_listening' && !/^not /.test(c.outcome))) break;
    // Within the turn the model's own content goes back whole (thinking included).
    messages = [...messages, { role: 'assistant', content: response.content as unknown as Anthropic.ContentBlockParam[] }, { role: 'user', content: results }];
  }

  // Task 7a: the page opened on their yes stands at the head of the reply as stored, so the history shows where it opened.
  if (released) {
    const raw = `<board page>${String(released.args.title)}</board>`;
    const holder = stored.find((m) => m.role === 'assistant' && Array.isArray(m.content) && m.content.some((c) => c.type === 'text'));
    const textBlock = (holder?.content as Anthropic.ContentBlockParam[] | undefined)?.find((c): c is Anthropic.TextBlockParam => c.type === 'text');
    const first = stored.find((m) => m.role === 'assistant' && Array.isArray(m.content));
    if (textBlock) textBlock.text = `${raw}\n${textBlock.text}`;
    else if (first) first.content = [{ type: 'text', text: raw }, ...(first.content as Anthropic.ContentBlockParam[])];
    else stored.push({ role: 'assistant', content: [{ type: 'text', text: raw }] });
  }

  // A problem card put up in a spoken reply is also asked aloud (board-timing.ts unsaidAsk); so is a sentence card or a
  // numbered menu the reply asks them to act on, when its words were not said (unsaidBoardItem, D2).
  if (session.mode === 'voice' && !state.closed && !input.signal?.aborted && spoken.length) {
    const card = [...toolCalls].reverse().find((c) => c.name === 'show_problem' && !/^not /.test(c.outcome));
    const sentencesSaid = spoken.join(' ').split(/(?<=[.!?])\s+|(?<=[？。])/).filter((x) => x.trim());
    // Task 7m (QUESTION_ONCE): the sentences cut at 。 too (sentencesSaid): a Japanese reply was one "sentence" here.
    // Fix round 1 (I1): spoken language lessons only (questionCards); any other voice lesson keeps the base split and ask.
    const questionOnce = TUTOR_V2_QUESTION_ONCE && questionCards;
    const more = card ? unsaidAsk(String(card.args.statement ?? ''), questionOnce ? sentencesSaid : spoken.join(' ').split(/(?<=[.!?？])\s+/).filter(Boolean), { questionOnce })
      : TUTOR_V2_SPEAK_BOARD_ITEM ? unsaidBoardItem(toolCalls, sentencesSaid, { sentences: !TUTOR_V2_SAY_SENTENCE_CARD }) : null;
    if (more) {
      input.onText?.(`\n\n${unstar(more)}`);
      spoken.push(more);
      const holder = [...stored].reverse().find((m) => m.role === 'assistant' && Array.isArray(m.content) && m.content.some((c) => c.type === 'text'));
      const textBlock = [...((holder?.content as Anthropic.ContentBlockParam[] | undefined) ?? [])].reverse().find((c): c is Anthropic.TextBlockParam => c.type === 'text');
      if (textBlock) textBlock.text = `${textBlock.text}\n\n${more}`;
    }
  }

  // The maths check. The model slips on a named operation or a value about one reply in four on some turns
  // ("Dividing by 4 gives x² + y² = 4" for x²/4 + y²/4 = 1, embed-1794414820031), and more thinking does not
  // cure it: the same turn replayed eight times each gave 2 slips at medium effort and 2 at high, 1.3 s slower.
  // Asked afterwards, at medium effort, to look for exactly that kind of slip, it finds it (12 of 12, one
  // pedantic alarm in 24 sound replies; at low effort it waved the slip through). So a reply that spoke mathematics is checked while it is being said, and a slip is put right in
  // the tutor's own voice at the end of the same reply. Runs beside the board pass. OFF unless TUTOR_V2_MATHS_CHECK=on (Praveen 11-11: slips seen only in conics; one live false correction).
  const saidSoFar = spoken.join('\n\n');
  // What the reply drew is checked with what it said: a "point on the parabola" went up that was not on it.
  const drawnNow = toolCalls.filter((c) => V2_FIGURE_TOOL_NAMES.has(c.name) && !/^not /.test(c.outcome)).map((c) => `${c.name.replace(/^show_/, '')}: ${JSON.stringify(c.args).slice(0, 400)}`);
  const mathsCheck: Promise<string | null> = (input.mathsCheck ?? (!input.callModel && process.env.TUTOR_V2_MATHS_CHECK === 'on')) && !state.closed && !input.signal?.aborted && speaksMaths(saidSoFar) && modelCalls < V2_MAX_MODEL_CALLS
    ? Promise.all([0, 1].map(() => callModel({
      // On a clean page: the board, the student's words, the reply. With the whole lesson in front of it the
      // model waved its own slip through six times out of six; shown only these three it catches it.
      model: '', max_tokens: 2500, thinking: { type: 'adaptive' }, output_config: { effort: 'medium' },
      messages: [{ role: 'user', content: `The board shows:\n${renderBoard(state.board)}\n\n${input.studentSaid ? `The student said: "${input.studentSaid}"` : 'The student has not spoken.'}` }, { role: 'assistant', content: `${saidSoFar}${drawnNow.length ? `\n\n[drawn on the board with this reply: ${drawnNow.join(' | ')}]` : ''}` }, { role: 'user', content: V2_MATHS_CHECK }],
    } as unknown as Anthropic.MessageCreateParamsNonStreaming, undefined, input.signal).then((response) => {
      usage.inputTokens += response.usage.input_tokens; usage.outputTokens += response.usage.output_tokens;
      usage.cacheReadTokens += response.usage.cache_read_input_tokens ?? 0; usage.cacheCreationTokens += response.usage.cache_creation_input_tokens ?? 0;
      const text = response.content.filter((b): b is Anthropic.TextBlock => b.type === 'text').map((b) => b.text).join(' ');
      const fix = text.match(/\bcorrection:\s*([^\n]+)/i)?.[1]?.replace(/<board\b[\s\S]*$/, '').trim() ?? '';
      // One short sentence or two; anything longer is the check thinking aloud, not a correction.
      return fix && fix.split(/\s+/).length <= 40 ? fix : null;
    }).catch(() => null)))
      // Two readings, made apart, must both find a slip: one alone corrected a statement that was right
      // ("165 to 170 has width 5, not 6", embed-1794425631023).
      .then(([a, b]) => (a && b ? a : null))
    : Promise.resolve(null);

  // The board pass. Speech and the board are the two halves of a spoken reply, and the model often
  // writes only the first: it says the working and puts up nothing, or only the next problem. When the
  // reply spoke mathematics, the model is shown its own words and asked what of them is missing from the
  // board. Its words are already on their way to the student; only board calls are taken from this call.
  // They are stored as part of the reply, so the history reads as a tutor who wrote while talking.
  const said = spoken.join('\n\n');
  // A long spoken reply with nothing written is checked too, whatever the subject: names, dates and terms
  // that are only heard are lost as surely as mathematics (two replies of an AP Government lesson went by
  // with an empty board, embed-1794355900794).
  // A reply of that length that drew no figure is checked as well: a scenario of pushes and pulls, a curve,
  // a sequence was being told in words and problem cards alone (a Grade 8 forces lesson, embed-1794371869806).
  const NEXT_PART = /\bpart \(?[b-h]\)?(?=[\s:,.])|\b(?:next|second|third|fourth|last|final) (?:part|question)\b/i;
  const drewFigure = () => toolCalls.some((c) => V2_FIGURE_TOOL_NAMES.has(c.name) && !/^not /.test(c.outcome));
  const paintedSoFar = () => toolCalls.some((c) => !V2_CONTROL_TOOL_NAMES.has(c.name) && c.name !== 'new_page' && c.name !== 'go_to_page' && !/^not /.test(c.outcome));
  // A reply that ended on the offer of the next part is checked only for mathematics it said: asked to look at
  // "Let's start with the chromosomes", the check wrote the next part's first note before the student had said yes
  // (biology, embed-1794520770137).
  const endedOnOffer = !!(heldAt as { raw: string } | null);
  // Task 7g: the sentences of their answer this reply put on no card (owed). Task 7m (CORRECTION_CARD_NOW, mic test 4 flag 6): known
  // before the board check, which then writes their card in this reply ("「sell」の過去形は「sold」です…" wrote none, and the card came
  // a reply later). Fix round 1 (e): an owed card is the only new trigger: a Japanese reply's length does not run the check.
  // Task 7z fix round 1 (REPEAT_NOT_MISHEARD): the reply did not catch their words. Not a reply that corrects their sentence (a sentence
  // card reworking their words, by state) and ends asking them to say it again: 「もう一度言ってみてください」 after a correction (mic test 8,
  // T12) matched the mishear words, and the correction was never counted.
  const replyMisheard = () => {
    const t = stripBoardBlocks(spoken.join(' '));
    if (!V2_REPLY_MISHEARD.test(t)) return false;
    if (!TUTOR_V2_REPEAT_NOT_MISHEARD || !v2AdaptOn(session) || !v2AsksRepeat(v2ReplySentences(t).pop() ?? '')) return true;
    return !toolCalls.some((c) => c.name === 'show_sentence' && (!/^not /.test(c.outcome) || !!c.pointsAt) && typeof c.args.sentence === 'string' && answerSentences.some((s) => v2IsCorrectionOf(String(c.args.sentence), s, undefined, v2CorrectionStems(c.args.emphasis))));
  };
  const owedCards = () => {
    if (!answerSentences.length || state.closed || input.signal?.aborted || replyMisheard()) return [];
    const cards = toolCalls.filter((c) => c.name === 'show_sentence' && (!/^not /.test(c.outcome) || !!c.pointsAt) && typeof c.args.sentence === 'string').map((c) => ({ sentence: String(c.args.sentence), stress: (Array.isArray(c.args.emphasis) ? c.args.emphasis : typeof c.args.emphasis === 'string' ? [c.args.emphasis] : []).filter((x): x is string => typeof x === 'string') }));
    return v2SentencesNotCarded(answerSentences, cards, state.board, state.correctedSentences ?? []);
  };
  const owedBefore = TUTOR_V2_CORRECTION_CARD_NOW ? owedCards() : [];
  // Typed lessons are checked as spoken ones are: a typed session opened and ran two replies on an empty board
  // (Praveen, 2026-11-12).
  if (!state.closed && !input.signal?.aborted && said && (!endedOnOffer || speaksMaths(said)) && (speaksMaths(said) || inlinePainted.some((x) => !x.label.startsWith('problem')) || ((!paintedSoFar() || !drewFigure()) && said.split(/\s+/).length >= V2_UNWRITTEN_WORDS) || (opening && !paintedSoFar()) || owedBefore.length > 0
    // Values said and nothing written: a student's set-up was confirmed aloud ("A⁻ is 0.05, HA is 0.1, pKa is 4.74")
    // and never put on the board (chemistry, embed-1794447993778).
    || (!paintedSoFar() && new Set(said.match(/\d+(?:\.\d+)?/g) ?? []).size >= 3)
    // The next part of a question set aloud with nothing written: "Now part (b): how did…" was asked under a card
    // that still showed part (a) (AP World History, embed-1794536181149).
    || (!paintedSoFar() && NEXT_PART.test(said) && /\?/.test(said))) && modelCalls < V2_MAX_MODEL_CALLS && (input.boardPass ?? !discussion)) {
    // The check has two halves. What was said and not written is added. What was written and should not have
    // been is withdrawn: a block that shows the step the reply asks the student to take (the board did the
    // differentiation the tutor had just asked for, embed-1794349966573). Board items wait for their sentence
    // in the voice client, so a withdrawal usually arrives before the item is shown.
    const others = toolCalls.filter((c) => !V2_CONTROL_TOOL_NAMES.has(c.name) && !/^not /.test(c.outcome) && !inlinePainted.some((x) => x.id === c.id)).map((c) => `${c.name}: ${summariseBoardCall(c.name, c.args)}`);
    const listed = [...inlinePainted.map((x, i) => `  ${i + 1}. ${x.label}`), ...others.map((x) => `  - ${x}`)];
    // What the reply said and the board does not hold is found here, not left to the model's eye: twice in one
    // lesson it spoke a standard form and wrote only the line before it (embed-1794414820031).
    const unwritten = unwrittenEquations(said, state.board.pages.flatMap((pg) => pg.items.map((it) => it.summary))).slice(0, 4);
    const catalogue = figureCatalogueFor(session);
    const askedOnCard0 = () => toolCalls.some((c) => c.name === 'show_problem' && !/^not /.test(c.outcome));
    const askedOnCard = askedOnCard0();
    // Three things the reply shows by itself to be missing, said to the check outright (AP Physics,
    // embed-1794496967839): "let's look at the picture" over no picture; a problem about a circuit with no
    // circuit; "Yes, 8 volts" with the working that gives it left unwritten.
    const drewNow = drewFigure();
    // Pointing at something ("Here is a ray of light going from air into water") promises it as surely as
    // naming a picture does: said twice over a board that showed no ray (typed run, 2026-11-13).
    const promised = !drewNow && /\b(?:pictur(?:e|ing)|diagram|figure|drawing|sketch|drawn out|draw (?:it|this|that)|here(?:'s| is| are) (?:a|an|the|two|three)\b|look at (?:the|this)\b|shown (?:here|below))/i.test(said);
    const cardNoFigure = !drewNow && askedOnCard0();
    const confirmedBare = /^\s*(?:yes|right|correct|exactly|that'?s (?:right|correct|it))\b/i.test(said) && /\d/.test(said.split(/(?<=[.?!])\s+/).slice(0, 2).join(' ')) && !toolCalls.some((c) => (c.name === 'show_equation' || c.name === 'annotate') && !/^not /.test(c.outcome));
    // An answer just confirmed is shown where it can be seen: after "about 22°" the board carried the number and no
    // ray at 22° ("it would have been so much cooler if it had drawn that figure", Praveen, embed-1794593747478).
    const confirmedNoFigure = !drewNow && /^\s*(?:yes|right|correct|exactly|that'?s (?:right|correct|it))\b/i.test(said) && !!catalogue;
    const missing = [
      confirmedNoFigure ? 'You confirmed the student\'s answer and drew nothing: if what they found can be seen in a picture (an angle, an image, a point or a crossing on a graph, a length, a position), draw that figure now with the answer marked on it, as the third step.' : '',
      promised ? 'You spoke of a picture or pointed at something as shown ("here is…"), and this reply drew no figure: draw it now, as the third step.' : '',
      cardNoFigure ? 'This reply put up a problem and no figure with it: if the problem describes something that can be drawn (a circuit, a shape, a set-up, a graph, a plot of data it describes in words), draw it now as the third step, with what the student is to find marked by a question mark where the figure can show it, and its value left out.' : '',
      // "Write only what you said" kept the working off the board when the tutor had only said "yes, (1, −4)": the
      // student's own steps, given aloud a moment before, were never written (ACT Math, portal-3d431436, twice).
      confirmedBare ? 'You confirmed the student\'s answer and wrote nothing for it. This is the one case where the second step writes more than you said: put up the working that gives the answer, as an equation block, using the steps the student gave in their last message (with anything you corrected put right), with with="the opening words of the sentence that confirms it".' : '',
    ].filter(Boolean).join(' ');
    const check = `[board check — from the system running the session, not from the student]\nYou have just said the reply above aloud. In it you put on the board: ${listed.length ? `\n${listed.join('\n')}` : 'nothing. A reply of this length that leaves the board untouched is a tutor talking at an empty board: unless it was only small talk or a question about what is already up, the heart of what you said belongs there, in the form that fits it.'}\n\nFirst, and rarely: does a numbered item state outright the answer to the very thing this reply asks the student to work out, so that reading the board answers your question for them? Only then, withdraw it by writing "withdraw N" on a line by itself, followed by that question as you asked it, in quotation marks; and if the reply points the student at that item ("the table below"), write it again in the second step with the part they are to find left as a question mark. Everything else stays: an item that sets the question out, leaves a blank or a question mark for them to fill, lists things for them to compare, shows working the student has already given, or shows what you yourself explained. When unsure, it stays.\n\nSecond: what is only heard is lost. If something you said aloud that the student needs to hold on to is not on the board (the working behind a result, a step the student gave, a correction, a hint; a name, a date, a term, the two sides of a question), write it now as board blocks, in whichever kind fits, each with with="the opening words of the sentence in which you say it", for example <board equation with="The derivative of the top">…</board>. Write only what you said: nothing new, nothing already there, and never an answer you left for the student to find.${owedBefore.length ? ` ${v2OwedCardCheckLine(session, owedBefore)}` : ''}${unwritten.length ? ` These equations were said aloud and no board item holds them: ${unwritten.map((e) => `"${e}"`).join('; ')}. Each goes up now as an equation, unless it is there in another form or is the answer the student is to find.` : ''}${askedOnCard ? '' : ' A question you set that comes with its own numbers, data or expression, none of them on the board, is written as a problem block holding the question as you asked it; a question about what is already on the board needs none.'}\n\nThird, a picture. Name to yourself the one thing in this reply a student could look at rather than read: an equation that is a curve, a function, points on axes, an arrangement of things a problem or an explanation describes (a circuit, an apparatus, a shape, a set-up), a set of data values or counts, pushes and pulls on a thing, values on a number line, events in order, the stages of a process, two things set side by side. If there is one and no figure of that very thing is on the board (a figure of something else, an earlier circuit or an earlier graph, does not count), draw it now in the figure form that fits (${catalogueSubjects(session).includes('physics') ? 'graph, chart, forces' : 'graph, chart'}, numberline, timeline, steps, cycle, ranks, web, map, compare, table)${catalogue ? ', or as an exact figure from the catalogue below when one of them shows it better' : ''}, with with="…" as above. A formula written out is not a figure of its curve. A general case told in letters (a circle of radius r about a centre) is drawn with plain numbers standing in for the letters, so there is something to see. Draw the situation as you described it, with the numbers you gave, never the answer the student is to find: where the figure has a place for it, mark what they are to find with a question mark (the angle asked for, the side asked for), so the figure shows which one is meant. What has no shape gets no figure.${missing ? `\n\nIn this reply: ${missing}` : ''}\n\nAnswer in three lines or groups, in this order. First: "withdraw N" with the question it answers in quotation marks, or "1: none". Second: the missing blocks, or "2: none". Third: the figure block itself (saying it is drawn does not draw it), or "3: none" followed by a few words on why nothing here can be drawn.${catalogue ? `\n\nThe catalogue of exact figures for this lesson. One is written <board figure kind="its kind" with="…">its parameters as one JSON object</board>. Give the values the reply gave, as they were said; leave out whatever the student is to find.\n${catalogue}` : ''}`;
    try {
      const response = await callModel({
        model: '', max_tokens: 1500, thinking: { type: 'adaptive' }, output_config: { effort: 'low' }, system, tools,
        messages: [...withCacheMark(state.history), userNow, { role: 'assistant', content: [{ type: 'text', text: rawSpoken.join('\n\n') || said }] }, { role: 'user', content: [{ type: 'text', text: check }] }],
      } as unknown as Anthropic.MessageCreateParamsNonStreaming, undefined, input.signal);
      modelCalls += 1;
      usage.inputTokens += response.usage.input_tokens;
      usage.outputTokens += response.usage.output_tokens;
      usage.cacheReadTokens += response.usage.cache_read_input_tokens ?? 0;
      usage.cacheCreationTokens += response.usage.cache_creation_input_tokens ?? 0;
      const passText = response.content.filter((b): b is Anthropic.TextBlock => b.type === 'text').map((b) => b.text).join('\n');
      // A block that paints is stored inside the reply, before its sentence: the history then shows the reply as it should have been written.
      const lastWords = [...stored].reverse().find((m) => m.role === 'assistant' && Array.isArray(m.content) && m.content.some((c) => c.type === 'text'));
      for (const m of stripBoardBlocks(passText).matchAll(/\bwithdraw\s*:?\s*#?(\d+)([^\n]*)/gi)) {
        const gone = inlinePainted[Number(m[1]) - 1];
        // A withdrawal names the question the item answers, and that question must be one this reply asked, about
        // the subject and not a check-in: a "common mistake" note was withdrawn under "Does that make sense so
        // far?", after it had been shown (AP Physics, embed-1794493438983).
        const quoted = (m[2].match(/["“]([^"”]{6,})["”]/)?.[1] ?? '').toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter(Boolean);
        const asked = said.split(/(?<=[.?!])\s+/).filter((q) => q.trim().endsWith('?')).map((q) => q.toLowerCase().replace(/[^a-z0-9 ]+/g, ' '));
        const names = quoted.length >= 2 && asked.some((q) => { const qw = new Set(q.split(/\s+/)); return quoted.filter((w) => qw.has(w)).length >= Math.ceil(quoted.length * 0.7); });
        if (!names || /\b(?:make sense|is that clear|go over it again|sound good|any questions|ready to|shall (?:i|we)|would you like|want (?:me )?to)\b/i.test(m[2])) continue;
        // An item with a blank in it is a question set out for the student, never the answer (the check withdrew
        // "1/2 = ?/6" from a grade 6 lesson in replay).
        // The opening reply is painted at once (a session never starts on a bare board), so a withdrawal there
        // would empty the board in front of the student (browser run, conic sections, 2026-11-11). It stays.
        if (opening) continue;
        if (!gone || withdrawn.includes(gone.id) || /\?|\\square|\\boxed\{\s*\}|_{3,}/.test(gone.label)) continue;
        withdrawn.push(gone.id); withdrawnLabels.push(gone.label);
        for (const page of state.board.pages) page.items = page.items.filter((it) => it.id !== gone.id);
        const at = toolCalls.findIndex((c) => c.id === gone.id);
        if (at >= 0) toolCalls.splice(at, 1);
        const holder = (lastWords?.content as Anthropic.ContentBlockParam[] | undefined)?.find((c): c is Anthropic.TextBlockParam => c.type === 'text' && c.text.includes(gone.raw));
        if (holder) holder.text = holder.text.replace(gone.raw, '').replace(/[ \t]{2,}/g, ' ');
        input.onBoardWithdraw?.(gone.id);
      }
      // Several graph blocks from one check are one picture: a circle went up as two graphs, the curve on one
      // and its centre alone on the other (browser run, conic sections, 2026-11-11).
      const passBlocks = boardBlocksIn(passText);
      const graphs = passBlocks.filter((b) => b.kind === 'graph');
      if (graphs.length > 1) {
        const body = graphs.map((g) => g.body).join('\n');
        const merged = boardBlocksIn(graphs[0].raw.replace(graphs[0].body, () => body))[0];
        if (merged) { passBlocks[passBlocks.indexOf(graphs[0])] = merged; for (const g of graphs.slice(1)) passBlocks.splice(passBlocks.indexOf(g), 1); }
      }
      // When the reply itself turned the page, what the check adds for words said BEFORE the turn belongs on
      // the page before: put on the new one, the working for x² = −12y and its graph sat under a heading about
      // something else, around the next problem (conic sections, twice, 2026-11-11). The voice client holds a
      // page turn until the reply is complete, so these still go up on the old page, ahead of the turn.
      const letters = (x: string) => x.toLowerCase().replace(/\$[^$]*\$/g, ' ').split(/[^a-z]+/).filter((w) => w.length >= 2);
      const saidLetters = letters(said);
      // A reply that turns the page closes one part and opens the next. When more than one paragraph was said
      // before the turn, the last of them is already about the new part ("Next are two structures… A stack is
      // last-in, first-out"): a figure for it went up at the foot of the linked-list page (embed-1794458110435).
      const beforeTurnText = pageTurnAt < 0 ? '' : said.slice(0, pageTurnAt); const leadBreak = beforeTurnText.trimEnd().lastIndexOf('\n\n');
      const leadAtWord = pageTurnAt < 0 ? -1 : letters(leadBreak > 0 ? beforeTurnText.slice(0, leadBreak) : beforeTurnText).length;
      const overlap = (body: string, text: string) => { const nums = new Set(text.match(/\d+(?:\.\d+)?/g) ?? []); const words = new Set(letters(text).filter((w) => w.length >= 4)); return (body.match(/\d+(?:\.\d+)?/g) ?? []).filter((n) => nums.has(n)).length + letters(body).filter((w) => w.length >= 4 && words.has(w)).length; };
      // The new part begins where the reply first names it, which is often a sentence or two before the page
      // block itself ("Now Kirchhoff's voltage law: go once around any closed loop…", then the page of that name;
      // "Here's one with a 6 ohm resistor in series with a parallel pair", then "Mixed series and parallel").
      // What the check adds for those sentences belongs on the new page: put on the one before, a note and then
      // a circuit were hidden by the turn the moment they went up (AP Physics, embed-1794493438983, and a probe).
      const newTitle = [...new Set(letters(state.board.pages[pageBefore + 1]?.title ?? '').filter((w) => w.length >= 4))];
      const partBeginsAtWord = (() => {
        if (!newTitle.length) return Infinity;
        let seen = 0;
        for (const sentence of beforeTurnText.split(/(?<=[.?!:])\s+/)) {
          const ws = letters(sentence);
          if (newTitle.filter((w) => ws.some((x) => x === w || (w.length >= 5 && x.startsWith(w.slice(0, 5))))).length >= Math.ceil(newTitle.length / 2)) return seen;
          seen += ws.length;
        }
        return Infinity;
      })();
      const namesNewPage = (atWord: number) => atWord >= partBeginsAtWord;
      const beforeTurn = (b: InlineBlock) => {
        if (pageTurnAt < 0 || pageBefore < 0 || b.kind === 'page') return false;
        // Turned BACK to a page for a look, nothing belongs on the page left behind: a second copy of a note was
        // recorded on the practice page and shown on the page turned to (portal-84f8660d).
        if (state.board.pages.length <= pagesBefore) return false;
        const want = letters(b.attrs.with ?? '').slice(0, 3);
        if (want.length >= 2) for (let at = 0; at + want.length <= saidLetters.length; at++) if (want.every((w, k) => saidLetters[at + k] === w)) return at < leadAtWord && !namesNewPage(at);
        // The check sometimes quotes the problem card rather than a sentence ("Two 6 Ω resistors are connected in
        // series"): what this reply put on the new page counts as that side of the turn. The circuit for a card
        // went up on the page before it, and the tutor said "look at the circuit" over a page without one
        // (AP Physics, embed-1794500923861).
        const onNewPage = state.board.pages.slice(pageBefore + 1).flatMap((pg) => pg.items.filter((it) => toolCalls.some((c) => c.id === it.id)).map((it) => it.summary)).join(' ');
        const newLetters = letters(onNewPage);
        if (want.length >= 2) for (let at = 0; at + want.length <= newLetters.length; at++) if (want.every((w, k) => newLetters[at + k] === w)) return false;
        // No sentence to go by: which side of the turn is it about?
        const lead = leadBreak > 0 ? leadBreak : pageTurnAt;
        return overlap(b.body, said.slice(0, lead)) > overlap(b.body, `${said.slice(lead)} ${onNewPage}`);
      };
      for (const b of passBlocks) {
        if (beforeTurn(b)) {
          if (b.kind === 'problem') continue;
          const now = state.board.current; state.board.current = pageBefore; markBeforeTurn = true;
          let ok = false; try { ok = settleInline(b, true); } finally { state.board.current = now; markBeforeTurn = false; }
          if (ok) { const textBlock = (lastWords?.content as Anthropic.ContentBlockParam[] | undefined)?.find((c): c is Anthropic.TextBlockParam => c.type === 'text'); if (textBlock) textBlock.text = insertBlock(textBlock.text, b.raw.replace(/\s+with="[^"]*"/, ''), b.attrs.with); }
          continue;
        }
        // One card a reply: the check adds a problem only when the reply set a question and put up no card.
        if (b.kind === 'problem' && (toolCalls.some((c) => c.name === 'show_problem' && !/^not /.test(c.outcome)) || !saidCovers(b.body, said))) continue;
        // The check writes for a sentence said earlier in the reply, after items for later sentences are already
        // up. It goes where its sentence is: "du = dx, v = −cos x" came up underneath the formula those two had
        // just been put into (AP Calc BC, embed-1794511321049). The reply's own text, with the block put in at
        // its sentence, says which item follows it.
        const textBlock = (lastWords?.content as Anthropic.ContentBlockParam[] | undefined)?.find((c): c is Anthropic.TextBlockParam => c.type === 'text');
        const bare = b.raw.replace(/\s+with="[^"]*"/, '');
        const withIt = textBlock ? insertBlock(textBlock.text, bare, b.attrs.with) : '';
        const after = withIt ? withIt.slice(withIt.indexOf(bare) + bare.length) : '';
        const onPage = new Set(state.board.pages[state.board.current]?.items.map((it) => it.id));
        const nextAny = b.kind === 'problem' || b.kind === 'page' ? undefined : inlinePainted.map((x) => ({ id: x.id, at: after.indexOf(x.raw), card: x.label.startsWith('problem') })).filter((x) => x.at >= 0 && onPage.has(x.id)).sort((x, y) => x.at - y.at)[0];
        // A figure drawn for a problem stands under its card, as in a book: put above, it pushed the card down two
        // seconds after the student had begun to read it (biology, embed-1794520770137).
        // The board is written top to bottom: a card that arrives later goes under what is already up. Written in
        // above, it pushed a table and a note down while the student was reading them (AP US Government,
        // portal-84f8660d, twice). TUTOR_V2_BOARD_INSERTS=on brings the old placing back.
        const next = process.env.TUTOR_V2_BOARD_INSERTS !== 'on' || (nextAny && b.kind === 'figure' && nextAny.card) ? undefined : nextAny;
        placeAbove = next?.id;
        let ok = false; try { ok = settleInline(b, true); } finally { placeAbove = undefined; }
        if (!ok) continue;
        if (next) { const items = state.board.pages[state.board.current].items; const mine = items.pop(); const at = items.findIndex((it) => it.id === next.id); if (mine) items.splice(at < 0 ? items.length : at, 0, mine); }
        if (textBlock) textBlock.text = withIt;
      }
    } catch { /* the reply stands without it */ }
  }

  // A case told aloud has its points on the board. Told in answer to "Who's Diego?", the second case went up
  // nowhere, and the rest of the conversation ran under the first case's page (local test embed-1795030468491).
  if (dMeta && !input.signal?.aborted) {
    const saidAll = rawSpoken.join('\n\n') || '';
    for (const c of untoldBefore) {
      if (!c.glance?.length || !caseToldIn(c, saidAll)) continue;
      const plain = (x: string) => x.replace(/[^a-z0-9]+/gi, '').toLowerCase();
      const up = state.board.pages.some((pg) => pg.items.some((it) => plain(it.summary).includes(plain(c.glance![0]))));
      if (up) continue;
      const now = state.board.pages[state.board.current]?.title ?? '';
      const raw = `${plain(now) === plain(c.title) ? '' : `<board page>${c.title}</board>\n`}<board note style="highlight">${c.glance.join('\n')}</board>`;
      try {
        for (const b of boardBlocksIn(raw)) settleInline(b, true);
        const holder = [...stored].reverse().find((m) => m.role === 'assistant' && Array.isArray(m.content) && m.content.some((x) => x.type === 'text'));
        const textBlock = (holder?.content as Anthropic.ContentBlockParam[] | undefined)?.find((x): x is Anthropic.TextBlockParam => x.type === 'text');
        if (textBlock) textBlock.text = `${raw}\n${textBlock.text}`;
      } catch { /* the reply stands without it */ }
    }
  }

  // The answer key for a problem the tutor made up. The plan's problems come with their answers and were judged
  // right all lesson; on its own problem the tutor had nothing to judge by, and told a student who solved
  // 3x² − 3 = 0 as x = ±√3 that the roots were right, twice, until the student corrected it (AP Calculus BC,
  // portal-8e2d86f3; replayed, 5 replies of 8 agreed). Given the problem worked out beforehand, 0 of 8 did. So each
  // such problem is solved once on a clean page while the student is reading it, and the result is a fact from the
  // next turn on (facts.ts). Left unworked by an interrupted turn, it is worked at the end of the next.
  const unworked = Object.entries(state.ownKeys ?? {}).filter(([id, key]) => !key && state.board.pages.some((pg) => pg.items.some((it) => it.id === id))).slice(-2);
  const ownKeys: Promise<Array<[string, string]>> = (input.ownKey ?? (!input.callModel && process.env.TUTOR_V2_OWN_KEY !== 'off')) && !noOwnKey && unworked.length && !state.closed && !input.signal?.aborted
    ? Promise.all(unworked.map(([id]) => {
      const item = state.board.pages.flatMap((pg) => pg.items).find((it) => it.id === id);
      return callModel({
        model: '', max_tokens: 3000, thinking: { type: 'adaptive' }, output_config: { effort: 'medium' },
        messages: [{ role: 'user', content: `${V2_OWN_KEY}\n\nThe problem:\n${item?.summary ?? ''}` }],
      } as unknown as Anthropic.MessageCreateParamsNonStreaming, undefined, input.signal).then((response): [string, string] => {
        usage.inputTokens += response.usage.input_tokens; usage.outputTokens += response.usage.output_tokens;
        usage.cacheReadTokens += response.usage.cache_read_input_tokens ?? 0; usage.cacheCreationTokens += response.usage.cache_creation_input_tokens ?? 0;
        const text = response.content.filter((b): b is Anthropic.TextBlock => b.type === 'text').map((b) => b.text).join(' ').replace(/\s+/g, ' ').trim();
        return [id, text.slice(0, V2_OWN_KEY_CHARS)];
      }).catch((): [string, string] => [id, '']);
    }))
    : Promise.resolve([]);

  // The same for a question asked aloud with no card. Most of what a tutor asks is asked this way ("what do you
  // get when you set that to zero?"), and the reply to it is judged with nothing to judge by. The answer is worked
  // while the tutor is still saying the question, and is a fact on the next turn only: the next reply that speaks
  // replaces it or drops it. Not when this reply put up a problem card (the card has its own answer), and not for
  // a question with no answer to work out.
  const saidAloud = spoken.join(' ');
  // A page whose heading named no part of the plan: what was said and written on opening it may.
  if (pageUnplaced && session.plan) {
    const wrote = toolCalls.filter((c) => c.name === 'annotate' && !/^not /.test(c.outcome)).map((c) => String((c.args as { text?: unknown }).text ?? '')).join(' ');
    const part = goalForTalk(session.plan, `${pageUnplaced} ${saidAloud} ${wrote}`);
    if (part) state.partsSeen = { ...(state.partsSeen ?? {}), [part]: nowMs };
  }
  // Asked as a question or as a thing to do: "Solve 3x² − 12 = 0 and tell me what you get." has no question mark,
  // and in the first replay such a reply got no answer worked and the tutor agreed with a wrong one.
  const sentencesAloud = saidAloud.split(/(?<=[.?!])\s+/).map((x) => x.trim()).filter(Boolean);
  const lastAsk = [...sentencesAloud].reverse().find((x) => /\?["')\]]*$/.test(x) && !/^(is that clear|does that make sense|are you with me|shall i go over)/i.test(x)) ?? sentencesAloud[sentencesAloud.length - 1];
  const cardNow = toolCalls.some((c) => c.name === 'show_problem' && !/^not /.test(c.outcome));
  const mathsInView = () => (state.board.pages[state.board.current]?.items ?? []).some((it) => (it.tool === 'show_equation' || it.tool === 'show_problem' || it.tool === 'show_function_graph') && /\d/.test(it.summary));
  const askedKey: Promise<string | null> = (input.askedKey ?? (!input.callModel && process.env.TUTOR_V2_ASKED_KEY !== 'off')) && !!lastAsk && !cardNow && !discussion && !session.homework && !session.homeworkSheet && !state.closed && !input.signal?.aborted && (speaksMaths(saidAloud, 3) || mathsInView())
    ? callModel({
      model: '', max_tokens: 2500, thinking: { type: 'adaptive' }, output_config: { effort: 'medium' },
      messages: [{ role: 'user', content: `${V2_ASKED_KEY}\n\nThe board shows:\n${renderBoard(state.board)}\n\nThe tutor said:\n${saidAloud.slice(-900)}` }],
    } as unknown as Anthropic.MessageCreateParamsNonStreaming, undefined, input.signal).then((response) => {
      usage.inputTokens += response.usage.input_tokens; usage.outputTokens += response.usage.output_tokens;
      usage.cacheReadTokens += response.usage.cache_read_input_tokens ?? 0; usage.cacheCreationTokens += response.usage.cache_creation_input_tokens ?? 0;
      const text = response.content.filter((b): b is Anthropic.TextBlock => b.type === 'text').map((b) => b.text).join(' ').replace(/\s+/g, ' ').trim();
      return text && !/^\W*open\b/i.test(text) && text.length > 8 ? text.slice(0, V2_OWN_KEY_CHARS) : null;
    }).catch(() => null)
    : Promise.resolve(null);

  const fix = await mathsCheck;
  if (fix && !state.closed && !input.signal?.aborted) {
    const words = `One correction: ${fix}`;
    input.onText?.(`\n\n${unstar(words)}`);
    spoken.push(words);
    const holder = [...stored].reverse().find((m) => m.role === 'assistant' && Array.isArray(m.content) && m.content.some((c) => c.type === 'text'));
    const textBlock = [...((holder?.content as Anthropic.ContentBlockParam[] | undefined) ?? [])].reverse().find((c): c is Anthropic.TextBlockParam => c.type === 'text');
    if (textBlock) textBlock.text = `${textBlock.text}\n\n${words}`;
  }

  // Task 7a (PART_ASK_EVERY): an ask the model repeated word for word was dropped; the part change is still asked, in words
  // not said before. Not toward the closing part: the close keeps its own rules.
  // Task 7c (ASK_NO_CHECKIN): not after a reply that still asks something: one question a reply.
  // Task 7e (PART_POSITION_KEPT): never after a reply that already carries a part ask, wherever it stands.
  // Fix round 1 (review I1): a part ask by v2PendingPart's tests (a part named, or a strict move-on frame), not any "ready?".
  const carriesPartAsk = () => TUTOR_V2_PART_POSITION_KEPT && !!session.plan && v2ReplySentences(stripBoardBlocks(spoken.join(' '))).some((x) => v2AsksPartChange(session.plan!, x));
  // Task 7f C: while the practice part is short, a dropped part ask is replaced by the ask for another sentence of theirs.
  if (practiceShort && askDrops && !heldAt && !inviteWait && !state.closed && !input.signal?.aborted && spoken.length && !v2ReplyHandsOver(spoken.join(' ')) && !endsOnRepeat(spoken.join(' ')) && !endsAsking(lastSentences(stripBoardBlocks(spoken.join(' ')), 1))) {
    const words = v2PracticeMoreLine(state.history);
    input.onText?.(`\n\n${words}`);
    spoken.push(words);
    const holder = [...stored].reverse().find((m) => m.role === 'assistant' && Array.isArray(m.content) && m.content.some((c) => c.type === 'text'));
    const textBlock = [...((holder?.content as Anthropic.ContentBlockParam[] | undefined) ?? [])].reverse().find((c): c is Anthropic.TextBlockParam => c.type === 'text');
    if (textBlock) textBlock.text = `${textBlock.text}\n\n${words}`; else stored.push({ role: 'assistant', content: [{ type: 'text', text: words }] });
  }
  if (askEvery && askDrops && !practiceShort && session.plan && !heldAt && !inviteWait && !state.closed && !input.signal?.aborted && spoken.length && !(oneQuestion && v2ReplyHandsOver(spoken.join(' '))) && !endsOnRepeat(spoken.join(' ')) && !carriesPartAsk()) {
    const plan = session.plan;
    const cur = v2PartInHand(plan, state); const nx = v2NextPart(plan, state, cur);
    // Task 7r (PART_GO_NAMED): never an ask about the part they just said go to (mic test 5, 11.9 min).
    if (nx >= 0 && nx < plan.segments.length - 1 && !(TUTOR_V2_PART_GO_NAMED && v2GoForPart(input.studentSaid, lastTutorText, plan, state, nx, askLangs))) {
      const next = v2PartOf(plan.segments[nx]!).label!;
      const words = v2PartAskLine({ next, named: v2PartNamedLate(plan.segments[nx]!, spoken.join(' ')), history: [...state.history, ...stored], done: undefined });
      // Task 7a re-review: the part asked about waits as a held page, as at a page held for the ask.
      askedPart = { id: plan.segments[nx]!.id, title: next };
      input.onText?.(`\n\n${words}`);
      spoken.push(words);
      const holder = [...stored].reverse().find((m) => m.role === 'assistant' && Array.isArray(m.content) && m.content.some((c) => c.type === 'text'));
      const textBlock = [...((holder?.content as Anthropic.ContentBlockParam[] | undefined) ?? [])].reverse().find((c): c is Anthropic.TextBlockParam => c.type === 'text');
      if (textBlock) textBlock.text = `${textBlock.text}\n\n${words}`;
    }
  }

  // Task 7c fix round 1 (review I2): a page held unasked at an earlier reply is owed its ask. A reply that asks nothing (and
  // turns no page, holds none) ends with the part ask, and the page then waits for their yes as any held page does.
  let owedPartAsked = false; let owedByPosition = false;
  const owedHeld = oneQuestion && askEvery && partFlow && session.plan && state.heldPage?.unasked && v2HeldPageOwed(session.plan, state) ? state.heldPage : null;
  // Task 7r (PART_GO_NAMED): not owed to a reply to their go for that same part.
  const owed = owedHeld && session.plan && TUTOR_V2_PART_GO_NAMED && v2GoForPart(input.studentSaid, lastTutorText, session.plan, state, session.plan.segments.findIndex((seg) => seg.id === owedHeld.part), askLangs) ? null : owedHeld;
  if (owed && !practiceShort && session.plan && !heldAt && !askedPart && !state.closed && !input.signal?.aborted && spoken.length && !toolCalls.some((c) => (c.name === 'new_page' && !/^not /.test(c.outcome)) || c.name === 'keep_listening' || c.name === 'end_lesson')) {
    const said = spoken.join(' ');
    const last = v2ReplySentences(stripBoardBlocks(said)).pop() ?? '';
    // Task 7r fix round 2 (N3, state before wording): the facts ordered this ask ("part change owed"), so in a lesson whose language
    // reads asks by clauses the reply's closing question is that ask, whatever its words (the 7i ruling: by position).
    // Only a question in such a language: an English one keeps 7c's rule (a reply that asks something else leaves the change owed,
    // test-brain-v2-one-question-7c I2), as English asks are read by their frames.
    // Fix round 3: never on a silence turn (I-A: the facts there forbid a new ask, and the hint question is not the part ask), and
    // only a question in Japanese script (I-B: ’ — “ are English too).
    // Fix round 4 (m-d): a closing question whose wording reads no part ask is the ask by position: the hold is marked, and only a
    // bare go opens it for as long as it waits.
    if (v2IsPartAsk(last)) owedPartAsked = true;
    else if (input.studentSaid !== null && v2ReadsByClauses(askLangs) && endsAsking(last, true) && V2_JA_SCRIPT.test(last)) { owedPartAsked = true; owedByPosition = !v2AskedParts(said, session.plan, askLangs).length; }
    else if (!v2ReplyHandsOver(said) && !endsOnRepeat(said) && !carriesPartAsk()) {
      const plan = session.plan; const inHand = v2PartInHand(plan, state);
      const done = inHand >= 0 && plan.segments[inHand]!.kind !== 'hook' && !v2PartOf(plan.segments[inHand]!).skipWhenLevelKnown ? v2PartOf(plan.segments[inHand]!).label : undefined;
      const owedSeg = plan.segments.find((seg) => seg.id === owed.part);
      const words = v2PartAskLine({ next: owed.title, done, named: owedSeg ? v2PartNamedLate(owedSeg, said) : false, history: [...state.history, ...stored] });
      input.onText?.(`\n\n${words}`);
      spoken.push(words);
      const holder = [...stored].reverse().find((m) => m.role === 'assistant' && Array.isArray(m.content) && m.content.some((c) => c.type === 'text'));
      const textBlock = [...((holder?.content as Anthropic.ContentBlockParam[] | undefined) ?? [])].reverse().find((c): c is Anthropic.TextBlockParam => c.type === 'text');
      if (textBlock) textBlock.text = `${textBlock.text}\n\n${words}`; else stored.push({ role: 'assistant', content: [{ type: 'text', text: words }] });
      owedPartAsked = true;
    }
  }

  // Task 7e (HELD_PART_RELEASE): a reply that moved into the held part with no card after its words opens its page now (fix
  // round 1, review I2); the stored reply carries the page block before the sentence that named it.
  if (releaseOn && !input.signal?.aborted && spoken.length && !toolCalls.some((c) => (c.name === 'new_page' && !/^not /.test(c.outcome)) || (c.name === 'end_lesson' && !/^not /.test(c.outcome)))) movesIntoHeld(spoken.join(' '));
  if (movedIn) {
    const named = movedIn; const block = `<board page>${state.board.pages[state.board.current]?.title ?? ''}</board>`;
    const holder = stored.find((m) => m.role === 'assistant' && Array.isArray(m.content) && (m.content as Anthropic.ContentBlockParam[]).some((c) => c.type === 'text' && c.text.includes(named)));
    const textBlock = (holder?.content as Anthropic.ContentBlockParam[] | undefined)?.find((c): c is Anthropic.TextBlockParam => c.type === 'text' && c.text.includes(named));
    if (textBlock) { const at = textBlock.text.indexOf(named); textBlock.text = `${textBlock.text.slice(0, at)}${block}\n${textBlock.text.slice(at)}`; }
  }
  // Task 7e (HELD_PART_RELEASE): a reply that ends on its own part ask holds the part it names (v2PendingPart on this reply, as
  // the next turn would read it), as the runtime's ask does: an answer that is neither yes nor a question then keeps it
  // waiting, and the facts say to answer and ask again (v2audio-7 learner 2 T25–T27: the ask was forgotten after a content
  // answer, and the next part was taught on the old part's page).
  let ownAsk: { id: string; title: string } | null = null; let summaryAsked = false;
  if (releaseOn && session.plan && !heldAt && !askedPart && !owedPartAsked && !state.closed && !input.signal?.aborted && spoken.length) {
    const said = stripBoardBlocks(spoken.join(' '));
    const last = v2ReplySentences(said).pop() ?? '';
    const plan = session.plan;
    // Task 7n (PART_ASK_LANGS): an ask it ends on by position in the lesson's languages holds its part as well.
    const q = last && (v2IsPartAsk(last) || !!v2EndingPartAsk(said, plan, askLangs)) ? v2PendingPart(plan, { ...state, heldPage: undefined }, said, null, undefined, askLangs) : null;
    if (q) ownAsk = { id: plan.segments[q.index]!.id, title: q.title };
    // Fix round 4 (I-E): a reply that ends asking to go to the summary (no required part left) supersedes a page still held for an
    // earlier ask: their yes to it must not open that page.
    else if (last && v2SummaryAsked(plan, state, said, askLangs)) summaryAsked = true;
  }

  for (const [id, key] of await ownKeys) if (key && state.ownKeys) state.ownKeys = { ...state.ownKeys, [id]: key };
  // A reply that spoke has answered the last question or moved on from it; one with no words leaves it standing.
  const asked = await askedKey;
  if (spoken.length) { if (asked && lastAsk) state.askedKey = { q: lastAsk.trim().slice(0, 200), key: asked }; else delete state.askedKey; }

  // A lesson that ends before its recap ends on a recap all the same. A student who said "I'll just stop here"
  // got a spoken summary and was left looking at the problem page (AP Calculus BC, portal-8e2d86f3; Praveen
  // 11-17: open a short recap page). The page is the plan's own points to remember, put up by the engine as
  // the closing words are said: no further reply, nothing more spoken. Only when the idea itself was taught.
  if (state.closed && session.plan && !discussion && !session.homework && !session.homeworkSheet && !input.signal?.aborted && process.env.TUTOR_V2_CLOSE_RECAP !== 'off') {
    const recapPart = session.plan.segments.find((seg) => seg.kind === 'recap');
    const points = ((recapPart as { mustRemember?: unknown } | undefined)?.mustRemember as unknown[] | undefined ?? []).filter((x): x is string => typeof x === 'string' && !!x.trim());
    const reached = (id: string) => !!state.goals[id] || !!state.partsSeen?.[id];
    const taught = session.plan.segments.some((seg) => seg.kind === 'concept' && reached(seg.id));
    const hasRecapPage = state.board.pages.some((pg) => goalForTitle(session.plan!, pg.title) === recapPart?.id);
    // A reply that wrote its own summary has put the recap up: the plan's would be a second one.
    const wroteSummary = toolCalls.some((c) => c.name === 'annotate' && !/^not /.test(c.outcome) && String(c.args.text ?? '').split('\n').filter((l) => l.trim()).length >= 3);
    if (recapPart && points.length && taught && !reached(recapPart.id) && !hasRecapPage && !wroteSummary && state.board.pages.length) {
      const stamp = nowMs.toString(36);
      settle({ type: 'tool_use', id: `recap_page_${stamp}`, name: 'new_page', input: { title: 'Recap' } } as Anthropic.ToolUseBlock, true);
      settle({ type: 'tool_use', id: `recap_note_${stamp}`, name: 'annotate', input: { text: points.slice(0, 6).map((x) => `- ${x.trim()}`).join('\n') } } as Anthropic.ToolUseBlock, true);
    }
  }

  // A spoken reply that asks the student nothing leaves them not knowing whose move it is. Going on unasked a
  // moment later turned a page the student was still reading and talked over their answer (AP Lit and AP Calc BC,
  // 2026-11-11: "give the student the chance to say yes, I get this"). The reply ends by handing over instead.
  // A reply whose part-change frame was dropped (F1) goes on into the next part by design: no check-in is added to it.
  // Task 7c (ASK_NO_CHECKIN): an ask that hands the turn over, anywhere, or after a quoted sentence, is an ask (one-question.ts).
  const replyAsks = TUTOR_V2_ASK_NO_CHECKIN ? v2ReplyAsks(spoken.join(' ')) : asksAnywhere(spoken.join(' ').split(/(?<=[.?!])\s+/));
  // Task 7i (NO_CHECKIN_AFTER_GOODBYE): never after a goodbye in the reply's last two sentences ("…Goodbye! Does that make sense
  // so far?", mic test 3, embed-1794967959470 at 14.99).
  const saysGoodbye = TUTOR_V2_NO_CHECKIN_AFTER_GOODBYE && v2ReplySentences(stripBoardBlocks(spoken.join(' '))).slice(-2).some((x) => isGoodbye(x));
  // Task 7s (PRONUNCIATION_PAGE): in a spoken lesson that teaches a language, never after a reply that armed a recording ("Yes, that
  // makes sense." was scored as the attempt), nor, in one taught through a second language, after a reply that asks them to repeat
  // or say something (one-question.ts v2AsksTheLearner: 「私の後に繰り返してください。 international」 got "Does that make sense?", mic
  // test 5, embed-1795050656326), widening 7c's ASK_NO_CHECKIN test (off with it). An English-only lesson keeps its rule (v2ReplyAsks).
  // Task 8a (RETEST_ASK_ONCE): the reply's own questions, read before the runtime's check-in below is added (a check-in is no question
  // put to them); fix round 1: only one that is the retest's counts (adaptive.ts v2RetestAskOf).
  const replyQuestions = spoken.length > 0 ? v2ReplyQuestions(spoken.join(' ')) : [];
  const pronAsks = TUTOR_V2_PRONUNCIATION_PAGE && noteTargets && spoken.length > 0 && (toolCalls.some((c) => c.name === 'practise_pronunciation' && /^armed/.test(c.outcome)) || (TUTOR_V2_ASK_NO_CHECKIN && (session.languages?.length ?? 0) >= 2 && v2AsksTheLearner(stripBoardBlocks(spoken.join(' ')))));
  if (session.mode === 'voice' && !state.closed && !input.signal?.aborted && spoken.length && !framesDropped && !toolCalls.some((c) => c.name === 'keep_listening' || c.name === 'end_lesson') && !replyAsks && !pronAsks && !saysGoodbye && !endsOnRepeat(spoken.join(' '))
    // With the close due the tutor is saying goodbye: "Good work today." was followed by "Are you with me so far?" (portal-84f8660d).
    && !(session.timeBoxMinutes && session.timeBoxMinutes - (nowMs - state.startedAtMs) / 60000 <= closeDueMinutes(session.timeBoxMinutes))) {
    const ins = discussion ? DISCUSSION_CHECK_INS : V2_CHECK_INS;
    const words = ins[state.history.length % ins.length];
    input.onText?.(`\n\n${words}`);
    spoken.push(words);
    const holder = [...stored].reverse().find((m) => m.role === 'assistant' && Array.isArray(m.content) && m.content.some((c) => c.type === 'text'));
    const textBlock = [...((holder?.content as Anthropic.ContentBlockParam[] | undefined) ?? [])].reverse().find((c): c is Anthropic.TextBlockParam => c.type === 'text');
    if (textBlock) textBlock.text = `${textBlock.text}\n\n${words}`;
  }

  // Task 7s fix round 2 (M3, ruling): a reply that armed a recording but closes on its own different question is disarmed (the client
  // arms from the state it gets back, useV2Turns onPronunciationArm): their answer is to that question, an ordinary practice turn
  // (card lines and 7q kept), never scored against the armed item. Disarming is the smaller change: nothing is recorded or sent.
  let disarmed: { type: string; message: string } | null = null;
  if (TUTOR_V2_PRONUNCIATION_PAGE && noteTargets && v2PronunciationOn(session)) {
    const arm = state.pronunciation?.armed;
    const armedNow = arm && toolCalls.some((c) => c.name === 'practise_pronunciation' && /^armed/.test(c.outcome));
    if (arm && armedNow && spoken.length && v2ArmClosesOnOtherAsk(spoken.join(' '), arm.items)) {
      // Fix round 4 (N-A): the mark the practised-sentence line reads (practice-facts.ts); the next spoken turn uses it up.
      state.pronunciation = { seq: state.pronunciation!.seq, ...(state.pronunciation!.off ? { off: true } : {}), disarmed: true };
      disarmed = { type: 'pronunciation_disarmed', message: `the reply closed on another question after arming "${arm.reference.slice(0, 60)}"` };
    }
  }
  // Task 8d (PRON_TARGET_SAID): a reply that armed a recording says what it armed. The model may put the sentence only on its card and
  // announce it with a lead-in the card reader does not take ("まず聞いてください。最後の文は英語だけです。" + the card, mic test 10,
  // embed-1795202398886 T82): the card is not read aloud, nothing was said, and the learner waited 12 s for the idle nudge. By state:
  // the armed items whose words are in nothing this reply said are said by the runtime as its last sentence (spoken and stored).
  let targetSaid: { type: string; message: string } | null = null;
  if (TUTOR_V2_PRON_TARGET_SAID && session.mode === 'voice' && v2PronunciationOn(session) && !disarmed && !state.closed && !input.signal?.aborted && spoken.length) {
    const arm = state.pronunciation?.armed;
    // Fix round 1 (I3, ruling): only on the first arm of the item (a retry asks them to say it once more, unmodelled: pronunciation.ts),
    // and only when under V2_PRON_SAID_SHARE of the item's words are in the reply (a paraphrased or partly said item is not said twice).
    if (arm && arm.attempt === 1 && toolCalls.some((c) => c.name === 'practise_pronunciation' && /^armed/.test(c.outcome))) {
      const wordsOf = (x: string) => x.toLowerCase().replace(/[’‘]/g, "'").replace(/[^\p{L}\p{N}']+/gu, ' ').trim().split(' ').filter(Boolean);
      const said = new Set(wordsOf(stripBoardBlocks(spoken.join(' '))));
      const unsaid = arm.items.map((x) => x.replace(/[<>]/g, '').replace(/\s+/g, ' ').trim()).filter((x) => { const w = wordsOf(x); return w.length > 0 && w.filter((y) => said.has(y)).length < V2_PRON_SAID_SHARE * w.length; });
      if (unsaid.length) {
        const line = unsaid.map((x) => (/[.!?]["'”’)]*$/.test(x) ? x : `${x}.`)).join(' ');
        input.onText?.(`\n\n${line}`);
        spoken.push(line);
        const holder = [...stored].reverse().find((m) => m.role === 'assistant' && Array.isArray(m.content) && m.content.some((c) => c.type === 'text'));
        const textBlock = [...((holder?.content as Anthropic.ContentBlockParam[] | undefined) ?? [])].reverse().find((c): c is Anthropic.TextBlockParam => c.type === 'text');
        if (textBlock) textBlock.text = `${textBlock.text}\n\n${line}`; else stored.push({ role: 'assistant', content: [{ type: 'text', text: line }] });
        targetSaid = { type: 'pronunciation_target_said', message: `the reply armed "${arm.reference.slice(0, 60)}" without saying it: said by the runtime` };
      }
    }
  }
  // A session never begins on a bare board (embed-1794362141944, embed-1794376295543). When the opening reply
  // and the check after it both wrote nothing, the lesson's heading and what it is for go up.
  // Not in homework: the problem is in its panel beside the chat, and the plan's title is only "Problem 3".
  // Task 7z (OPENING_PAGE_FIRST): the page and heading written first are part of the stored reply, before its words.
  if (openingFirst.length) {
    const holder = stored.find((m) => m.role === 'assistant' && Array.isArray(m.content) && m.content.some((c) => c.type === 'text'));
    const textBlock = (holder?.content as Anthropic.ContentBlockParam[] | undefined)?.find((c): c is Anthropic.TextBlockParam => c.type === 'text');
    if (textBlock) textBlock.text = `${openingFirst.join('\n')}\n${textBlock.text}`;
  }
  if (opening && !openingFirst.length && !session.homework && !session.homeworkSheet && !state.closed && spoken.length && !paintedSoFar()) {
    // Standards codes are for the plan's author, not the student: "(CCSS 8.G.B.6, 8.G.B.7)" was printed on the first card (demo check, 2026-11-13).
    const noCodes = (x: string) => x.replace(/\s*\((?:[^()]*\b(?:CCSS|NGSS|TEKS|HS-|MS-|[0-9]\.[A-Z]{1,3}\.[A-Z]?\.?\d)[^()]*)\)/g, '').trim();
    // A discussion's objectives are written about the participant, for the tutor ("greater clarity about their own
    // thinking"): its first card is the title and the one thing they need to know.
    const body = (discussion ? [session.plan?.title ?? '', 'No right answers: your own thinking is the point.'] : [session.plan?.title ?? session.topic ?? '', ...(session.plan?.los ?? []).slice(0, 3).map((lo) => noCodes(lo.description))]).map((x) => String(x).trim()).filter(Boolean).join('\n');
    // Task 7w (OPENING_PAGE_TITLE): a spoken lesson that teaches a language with a labelled plan that opens on an overview part: the
    // overview's page, with the lesson's title as its heading, never the objectives (written for the plan's author); the overview's own
    // page block then stays on it (settleInline). Mic test 7 (embed-1795100797999): an untitled page 1 of the title and three
    // objectives, then an "Overview" page saying the same.
    const overview = v2OpeningOverview(session);
    // Fix round 1 (M5): the title as plain text (no markup can end the block); no title: the overview's name as the heading.
    const heading = overview ? (String(session.plan!.title ?? '').replace(/[<>]/g, '').replace(/\s+/g, ' ').trim() || overview) : '';
    const raw = overview ? `${state.board.current < 0 ? `<board page>${overview.replace(/[<>]/g, '')}</board>` : ''}<board note style="heading">${heading}</board>` : body ? `<board note style="highlight">${body}</board>` : '';
    const blocks = boardBlocksIn(raw);
    const done = blocks.filter((b) => settleInline(b, true));
    if (done.length) {
      const holder = stored.find((m) => m.role === 'assistant' && Array.isArray(m.content) && m.content.some((c) => c.type === 'text'));
      const textBlock = (holder?.content as Anthropic.ContentBlockParam[] | undefined)?.find((c): c is Anthropic.TextBlockParam => c.type === 'text');
      if (textBlock) textBlock.text = `${done.map((b) => b.raw).join('\n')}\n${textBlock.text}`;
    }
  }

  // Task 6g (CLOSE_ONE_QUESTION): the summary has begun: its closing page opened, or its words said so, once most of the
  // plan is behind the lesson (an early "Quick recap" page is not its summary). From the next turn, no new practice.
  // Fix round 1 (I2): summary words count only in the box's last fifth or a closing turn: "Let's recap what we've done so
  // far" halfway through a maths lesson locked practice out for the rest of it. A closing page counts whenever it opens.
  if (gated && TUTOR_V2_CLOSE_ONE_QUESTION && session.plan && typeof state.summaryBegunAt !== 'number' && !state.closed && (closingOpened || ((selfCloseOpen || closingTurn) && V2_SUMMARY_BEGUN.test(spoken.join(' '))))) {
    const before = session.plan.segments.slice(0, -1);
    const reached = before.filter((seg) => !!state.goals[seg.id] || state.board.pages.some((pg) => !!v2PartOf(seg).label && v2PagePartLabel(session.plan, pg.title) === v2PartOf(seg).label)).length;
    if (before.length && reached * 2 >= before.length) state.summaryBegunAt = nowMs;
  }
  // Final review I2: a close refused for the invitation, whose reply then ends on no question (the next call only a goodbye,
  // dropped, or nothing), ends with the runtime's invitation: never a hand-over with no question. A reply that ends on another
  // question keeps it (one question a reply); the invitation stays owed in the facts.
  // Task 7w (SUMMARY_OPENS_CLOSE): not while the check is owed in a summary reply: the invitation comes after the check, which the next
  // reply then owes (closeCheckLate, below).
  // Fix round 1 (I2, ruling): a deferred close always leaves them something to answer: the question that is owed, the plan's check
  // question (as a question card, spoken once, counted as asked) while the check is owed, else the invitation as before.
  const checkFirst = opensClose && checkOwed && !state.closeCheck;
  const checkQ = checkFirst ? v2PlanCheckQuestion(session.plan) : null;
  // Fix round 2 (M1): also a reply whose end_lesson met the generic menu and whose Summary page then opened the close.
  const menuThenSummary = opensClose && summaryNow && menuGiven;
  if (inviteOwed && (inviteRefused || inviteWait || menuThenSummary) && !state.closed && !heldAt && !input.signal?.aborted && checkQ) {
    const last = lastSentences(stripBoardBlocks(spoken.join(' ')), 1);
    if (!v2InviteOfReply(spoken.join(' ')) && !endsAsking(last, true)) {
      const q = checkQ.replace(/[<>]/g, '');
      // Fix round 2 (b): the card holds the question and the sentences it asks about; the spoken line keeps the plan's whole wording.
      const b = boardBlocksIn(`<board problem>${v2CheckCardText(q)}</board>`)[0];
      input.onText?.(spoken.length ? `\n\n${q}` : q);
      spoken.push(q);
      const painted = !!b && settleInline(b);
      const words = painted ? `${q}\n${b!.raw}` : q;
      const tail = stored[stored.length - 1];
      const textBlock = tail?.role === 'assistant' && Array.isArray(tail.content) ? [...(tail.content as Anthropic.ContentBlockParam[])].reverse().find((c): c is Anthropic.TextBlockParam => c.type === 'text') : undefined;
      if (textBlock) textBlock.text = `${textBlock.text}\n\n${words}`; else stored.push({ role: 'assistant', content: [{ type: 'text', text: words }] });
      if (!painted) state.closeCheck = { askedAt: nowMs };
    }
  } else if (inviteOwed && (inviteRefused || inviteWait || menuThenSummary) && !state.closed && !heldAt && !input.signal?.aborted) {
    const last = lastSentences(stripBoardBlocks(spoken.join(' ')), 1);
    if (!v2InviteOfReply(spoken.join(' ')) && !endsAsking(last, true)) {
      // Task 7k (CLOSE_REOPENED): reopened, the runtime's ask is "more, or finish?".
      const line = reopened ? V2_CLOSE_MORE_LINE : V2_CLOSE_INVITE_LINE;
      input.onText?.(spoken.length ? `\n\n${line}` : line);
      spoken.push(line);
      const tail = stored[stored.length - 1];
      const textBlock = tail?.role === 'assistant' && Array.isArray(tail.content) ? [...(tail.content as Anthropic.ContentBlockParam[])].reverse().find((c): c is Anthropic.TextBlockParam => c.type === 'text') : undefined;
      if (textBlock) textBlock.text = `${textBlock.text}\n\n${line}`; else stored.push({ role: 'assistant', content: [{ type: 'text', text: line }] });
    }
  }
  // Task 7d: their questions were invited (only where the close is open by the clock: inviteOwed): the reply's last sentence
  // spoken asks whether they have questions (final review I2: not the refusal alone, which may have been followed by nothing).
  // Final review I3: and the summary has begun (an earlier reply, a closing page, or this reply's words): a bare "Do you have
  // any questions?" in the pronunciation part, with no summary, had the next turn close the lesson.
  const summaryGiven = typeof state.summaryBegunAt === 'number' || closingOpened || state.board.pages.some((pg) => closesLesson(pg.title)) || V2_SUMMARY_BEGUN.test(stripBoardBlocks(spoken.join(' ')));
  // Task 7k (CLOSE_REOPENED): reopened, the ask "more, or finish?" (or an invitation) is the ask the lesson may end on; recorded,
  // the reopening is over until they ask for more again.
  const lastSaid = lastSentences(stripBoardBlocks(spoken.join(' ')), 1);
  // Task 8d (CLOSE_SUMMARY_ONCE): the invitation is the reply's last QUESTION sentence (position), not only its last sentence: T91 of mic
  // test 10 (embed-1795202398886) ended 「何か質問はありますか？なければ、ここで終わりにします。」 and was not recorded.
  const inviteSaid = v2InviteOfReply(spoken.join(' '));
  // Fix round 1 (I2): an ask "more, or finish?" is marked (closeAsk), so the turn that answers it is read by state.
  const asksMore = v2ReplyAsksMoreOrFinish(lastSaid) || lastSaid.trim() === V2_CLOSE_MORE_LINE;
  if (inviteOwed && !state.closed && (reopened ? !!inviteSaid || asksMore : summaryGiven && !!inviteSaid)) { state.closeInvitedAt = nowMs; delete state.closeReopened; if (reopened && asksMore) state.closeAsk = 'more'; else delete state.closeAsk; }
  // A reply that took their request up already ending on that ask (or an invitation) is the ask: not reopened, so their answer
  // is not met by a second ask.
  // Fix round 1 (I2): …and so does a reply to the ask "more, or finish?" that goes on (more practice, not a goodbye).
  else if ((reopenAsked || answersMoreAsk) && !state.closed && !input.signal?.aborted) {
    if (inviteSaid || asksMore) { state.closeInvitedAt = nowMs; if (asksMore) state.closeAsk = 'more'; else delete state.closeAsk; }
    else if (!v2ReplySentences(stripBoardBlocks(spoken.join(' '))).slice(-2).some((x) => isGoodbye(x))) { state.closeReopened = nowMs; delete state.closeInvitedAt; delete state.closeAsk; }
  }
  // Task 7u (CLOSE_CHECK): the summary reply that ended on the plan's check question (a question card painted, or its last sentence a
  // question that is not the invitation) records it asked; the turn of their next words records it answered (close-check.ts).
  // Task 7w (SUMMARY_OPENS_CLOSE): the runtime's own check-in ("Is that clear, or shall I go over it again?") is no check question.
  if (checkOwed && !state.closed && typeof state.closeInvitedAt !== 'number' && summaryGiven && !heldAt && !input.signal?.aborted
    && (toolCalls.some((c) => c.name === 'show_problem' && !/^not /.test(c.outcome)) || (endsAsking(lastSaid, true) && !inviteSaid && !(opensClose && V2_CHECK_INS.includes(lastSaid.trim()))))) state.closeCheck = { askedAt: nowMs };
  else if (checkPending && state.closeCheck && !!input.studentSaid?.trim() && !input.signal?.aborted) state.closeCheck = { ...state.closeCheck, answeredAt: nowMs };
  // Task 7w (SUMMARY_OPENS_CLOSE): a summary reply that did not end on the check (nor on the invitation) owes it on the next reply, once;
  // that reply uses it up, asked or not.
  if (opensClose && !input.signal?.aborted) {
    if (checkDeferred) state.closeCheckDeferredAt = nowMs;
    if (checkLateBefore) delete state.closeCheckLate;
    // Fix round 1 (I1): never after the check step's one deferral (the check is then dropped).
    else if (summaryNow && checkOwed && !checkDeferred && !state.closeCheck && !state.closed && typeof state.closeInvitedAt !== 'number') state.closeCheckLate = nowMs;
  }
  // Task 7z fix round 1 (I2): the close step this reply recorded, with its last sentence, for the next turn (by position, not words).
  // Task 8d: the invitation's own sentence, when it was the step recorded (a statement after it is not the ask).
  if (!input.signal?.aborted) v2NoteCloseAskLast(state, nowMs, inviteSaid && state.closeInvitedAt === nowMs && !asksMore ? inviteSaid : lastSaid);
  state.history = [...state.history, ...stored];
  // Task 8j fix round 1 (ruling 4): the reply that carried the runtime's hand-over, by state: the next reply opens the Summary page.
  if (handOverGiven && !state.closed && !input.signal?.aborted) state.summaryHandOver = v2TutorReplies(state.history); else delete state.summaryHandOver;
  // Task 7f B: the parts left out for time are told once (a reply names them, or the facts have asked twice).
  if (tf.noSqueeze && state.timeFit && !input.signal?.aborted) v2TimeFitAfterReply(session.plan, state, spoken.join(' '));
  // Task 7i fix round 1 (I1): a part left out that this reply entered (its page holds something) was taken after all.
  if (arrivalOn && session.plan && !input.signal?.aborted) v2TakeEnteredDropped(session.plan, state);
  // Task 7a: the page held for their yes waits in the state; a page opened (or the close) lets it go.
  if (partFlow) {
    const held = heldAt as { part?: { id: string; title: string }; unasked?: boolean } | null;
    // Task 7c: a page held with no ask (the reply asked something else) waits marked `unasked`: no yes opens it, and the next
    // reply owes its ask (fix round 1); once asked (the runtime's ask, or the reply's own part ask) it waits as any held page.
    if (held?.part && !state.closed) state.heldPage = { title: held.part.title, part: held.part.id, at: v2TutorReplies(state.history), ...(held.unasked ? { unasked: true as const } : {}) };
    else if (askedPart && !held && !state.closed) state.heldPage = { title: askedPart.title, part: askedPart.id, at: v2TutorReplies(state.history) };
    else if (owed && owedPartAsked && !state.closed) state.heldPage = { title: owed.title, part: owed.part, at: v2TutorReplies(state.history), ...(owedByPosition ? { byPosition: true as const } : {}) };
    else if (ownAsk && !state.closed) state.heldPage = { title: ownAsk.title, part: ownAsk.id, at: v2TutorReplies(state.history) };
    else if (summaryAsked && state.heldPage && !state.heldPage.unasked) delete state.heldPage;
    else if (state.closed || toolCalls.some((c) => c.name === 'new_page' && !/^not /.test(c.outcome))) delete state.heldPage;
  }
  if (dMeta && session.plan) syncDiscussionStages(state, session.plan, dMeta, nowMs);
  // Fed back as a fact next turn: how long the tutor has been talking without writing.
  const painted = toolCalls.some((c) => !V2_CONTROL_TOOL_NAMES.has(c.name) && !/^not /.test(c.outcome));
  state.repliesSinceBoard = painted ? 0 : (state.repliesSinceBoard ?? 0) + 1;
  if (boardProblems.length) state.boardProblems = boardProblems; else delete state.boardProblems;
  // Task 7g (CARD_EVERY_SENTENCE): the sentences of their answer this reply put on no card are owed in the next facts, once. Not
  // when the reply says it did not catch them (replay v2audio-7: a card after "I didn't catch that"), was cut, or closed.
  // Task 7m (NO_FALSE_SILENCE): a silence turn leaves the owed card for their next answer (its facts carry no owed line).
  if (!(TUTOR_V2_NO_FALSE_SILENCE && input.studentSaid === null && !!input.facts?.silenceSeconds)) delete state.cardsOwed;
  const owedAfter = owedCards();
  if (owedAfter.length) state.cardsOwed = owedAfter;
  // Task 7q: their answer counted from this reply's sentence cards (a card changing their words = one that needed a correction).
  // Not for a reply that was cut, closed the lesson or did not catch their words (the owed cards' conditions).
  // Task 8c fix round 4 (re-review 2, m-1): a card's emphasis given as one string is its marks too, as for the owed cards above.
  const adaptEvents = [...adaptBefore.events];
  if (disarmed) adaptEvents.push(disarmed);
  if (targetSaid) adaptEvents.push(targetSaid);
  if (adaptPart && answerSentences.length && !state.closed && !input.signal?.aborted && !replyMisheard()) {
    // Task 8g (PAIR_PAINTED_ONLY): a card of this reply: painted now, or pointed at an item this reply painted (not an earlier turn's).
    const cards = toolCalls.filter((c) => c.name === 'show_sentence' && (!/^not /.test(c.outcome) || pointsAtThisReply(c.pointsAt)) && typeof c.args.sentence === 'string')
      .map((c) => ({ sentence: String(c.args.sentence), stress: (Array.isArray(c.args.emphasis) ? (c.args.emphasis as unknown[]) : typeof c.args.emphasis === 'string' ? [c.args.emphasis] : []).filter((x): x is string => typeof x === 'string') }));
    adaptEvents.push(...v2AdaptAfter(session, state, adaptPart, answerSentences, v2PracticePairs(answerSentences, cards, (adaptFlags.changed ?? TUTOR_V2_RETEST_TARGET_CHANGED) && adaptFlags.retest), adaptFlags, v2QuestionOfReply(lastTutorText)));
  }
  // Task 8a (RETEST_ASK_ONCE): the open retest whose line this turn sent is put to them when this reply carried a question.
  if (adaptPart && !input.signal?.aborted && spoken.length) adaptEvents.push(...v2RetestPutAfter(session, state, adaptPart, replyQuestions, adaptFlags));
  // Task 7x (FREE_CONVERSATION): a reply in a free-conversation part that asked them to make a question of their own gave the invitation.
  if (adaptPart && !input.signal?.aborted && spoken.length) v2FreeConvAfter(session, state, adaptPart, spoken.join(' '), adaptFlags.free ?? TUTOR_V2_FREE_CONVERSATION);
  // Task 7v (PART_CLOCK): a part this reply opened begins now.
  if (!input.signal?.aborted) v2MarkPartStart(session, state, nowMs);
  let finalWords = stripToolTalk(spoken.join('\n\n'));
  // Task 7o (NO_MARKDOWN_STARS): the transcript's final text, as streamed (the stored reply keeps the model's words).
  // Fix round 1 (minor 3): a lone star held back at the very end was never streamed, so it leaves the final text too.
  if (stars) { finalWords = v2StripStars(finalWords); if (stars.end()) { const at = finalWords.lastIndexOf('*'); if (at >= 0) finalWords = finalWords.slice(0, at) + finalWords.slice(at + 1); } }
  // A discussion that closes with nothing left to say would end in silence: its closing words were an order to
  // itself, which the net above removed (replay round 8). It closes on the direction they chose instead.
  if (discussion && state.closed && !finalWords.trim()) {
    finalWords = state.nextDirection && !/^not (?:asked|sure)/i.test(state.nextDirection) ? `Thank you for thinking this through with me. The direction you chose: ${state.nextDirection.replace(/[.\s]+$/, '')}.` : 'Thank you for thinking this through with me.';
    input.onText?.(finalWords);
  }
  // The plan's own last words: that the session is over and what comes next. One session closed on a summary
  // and stopped, and the person did not know it had finished (partner review, 2026-11-17).
  const closing = discussion && state.closed && !input.signal?.aborted ? discussionOf(session.plan)?.closing?.trim() : '';
  if (closing && !finalWords.includes(closing)) {
    input.onText?.(`\n\n${closing}`);
    finalWords = `${finalWords}\n\n${closing}`;
    const holder = [...state.history].reverse().find((m) => m.role === 'assistant' && Array.isArray(m.content) && m.content.some((c) => c.type === 'text'));
    const textBlock = [...((holder?.content as Anthropic.ContentBlockParam[] | undefined) ?? [])].reverse().find((c): c is Anthropic.TextBlockParam => c.type === 'text');
    if (textBlock) textBlock.text = `${textBlock.text}\n\n${closing}`;
  }
  return { spoken: finalWords, toolCalls, ...(withdrawnLabels.length ? { withdrawn: withdrawnLabels } : {}), state, usage, firstTextMs, totalMs: Date.now() - t0, modelCalls, ...(adaptEvents.length ? { events: adaptEvents } : {}) };
}
