/**
 * Typed turn — lesson-state rules (pure; no React, no VoiceTutorRealtime import).
 * The engine computes the set of next.kind values the brain may use this turn
 * (allowedNextFor) and the one-line <turn_state/> it reads (turnStateLine).
 */
import type { LessonPlan, Segment } from './types';
import {
  FIXED_SCRIPT_POST_DUE_MAX_HOLDS, fixedScriptBridgeClause, fixedScriptEngineOfferLines, fixedScriptPartLabel, nextSegmentId,
  postDueHoldDecision, segmentMaxTurns, segmentTransitionKind,
} from './fixed-script';
import { getSegmentTruth } from './context';
import { effectiveBoardLevel, filterKeyIdeasForLevel, type WorkingLevel } from '../level/working-level';
import { cardAskLine } from './transition-ask';
import { boardOffersChoices, cardableStudentSentence } from '../voice/sentence-board';
import {
  englishSentenceCount, typedSayBudgetFor,
  type TypedFieldValue, type TypedNext, type TypedNextKind, type TypedTurn, type TypedTurnRequest, type TypedVerdict,
} from '../voice/typed-turn';

export type TypedPartKind = 'level_check' | 'bridge' | 'offer_part' | 'conversation' | 'menu' | 'pronunciation' | 'recap' | 'plain';

function segmentOf(plan: LessonPlan, segId: string): Segment | undefined {
  return plan.segments.find((s) => s.id === segId);
}

/** The card statement of a segment (same choice as the client's segmentCardStatement, minus whiteboard emphasis stripping). */
function cardStatement(plan: LessonPlan, segId: string): string {
  return getSegmentTruth(segmentOf(plan, segId), plan.id)?.problemText ?? '';
}

/** R4/M3: a card cut to `max` chars by whole lines — the first line(s) kept, the LAST non-empty line (a key-ideas
 *  card's practice question) always kept, middle lines dropped first. Pure. */
export function capCardText(text: string, max: number): string {
  if (text.length <= max) return text;
  const lines = text.split('\n').filter((l) => l.trim());
  const last = lines.pop() ?? '';
  if (last.length >= max) return last.slice(0, max);
  const head: string[] = [];
  let used = last.length;
  for (const l of lines) {
    if (used + l.length + 1 > max) break;
    head.push(l); used += l.length + 1;
  }
  if (!head.length && lines.length) head.push(lines[0].slice(0, Math.max(0, max - last.length - 1)));
  return [...head, last].filter((l) => l).join('\n');
}

/** V6 (fix wave 2): a concept part's Key ideas card as the board shows it (level-filtered, numbered) — next_card's
 *  text when the part has no question card, so a move can preview its examples and ask its practice question. */
function keyIdeasCard(plan: LessonPlan, segId: string, level: WorkingLevel | null | undefined): string {
  const seg = segmentOf(plan, segId) as (Segment & { keyIdeas?: unknown }) | undefined;
  if (!seg || seg.kind !== 'concept' || !Array.isArray(seg.keyIdeas)) return '';
  const ideas = filterKeyIdeasForLevel(seg.keyIdeas.filter((k): k is string => typeof k === 'string'), effectiveBoardLevel(level ?? null, plan));
  return ideas.map((k, i) => `${i + 1}. ${k}`).join('\n');
}

export function typedPartKind(plan: LessonPlan, segId: string, _levelKnown: boolean): TypedPartKind {
  const seg = segmentOf(plan, segId);
  if (!seg) return 'plain';
  const md = (seg.metadata ?? {}) as Record<string, unknown>;
  if (md.skipWhenLevelKnown) return 'level_check';
  if (md.pronunciation) return 'pronunciation';
  const t = segmentTransitionKind(plan, segId);
  if (t === 'bridge') return 'bridge';
  if (t === 'offer') return 'offer_part';
  if (seg.kind === 'recap') return 'recap';
  if (seg.kind === 'extension') return 'conversation';
  if (boardOffersChoices({ statement: cardStatement(plan, segId) })) return 'menu';
  return 'plain';
}

export interface TypedTurnState {
  openAsk: { kind: 'retry' | 'question' | 'offer' | 'menu' | 'item' | 'none'; text: string; cardQuestion?: string };
  correctionOpen: { student: string; corrected: string } | null;
  practisedItems: Record<string, string[]>;
  offerState: Record<string, { made: boolean; accepted: boolean; served: boolean }>;
  menuState: Record<string, { asked: number; picked: string | null }>;
  answeredCards: Record<string, string[]>;
  lastItemAnnounced: Record<string, boolean>;
  turnsInPart: Record<string, number>;
  /** W1: typed turns answered in a part while its budget was due (the prose post-due hold count). */
  postDueTurns: Record<string, number>;
  /** V2 (fix wave 2): corrections given per part (keyed by the FROM part); the conversation budget is advisory. */
  correctionsInPart: Record<string, number>;
  /** V4 (fix wave 2): replies judged as answers (verdict ≠ none) per part — the level check's committed answers (R3). */
  answersInPart: Record<string, number>;
  /** R1 (fix round 1): the recap's review question was delivered (a `question` turn on the recap part) — a nudge /
   *  wait turn does not consume the review step. */
  recapReviewed: Record<string, boolean>;
  retriesInARow: number;
  pendingVerdict: TypedVerdict | null;
}

export function createTypedTurnState(): TypedTurnState {
  return {
    openAsk: { kind: 'none', text: '' },
    correctionOpen: null,
    practisedItems: {},
    offerState: {},
    menuState: {},
    answeredCards: {},
    lastItemAnnounced: {},
    turnsInPart: {},
    postDueTurns: {},
    correctionsInPart: {},
    answersInPart: {},
    recapReviewed: {},
    retriesInARow: 0,
    pendingVerdict: null,
  };
}

/** V2: corrections a conversation part allows (advisory for the brain; the engine does not refuse a third). */
export const TYPED_CONVERSATION_CORRECTIONS = 2;

export interface AllowedNextContext {
  plan: LessonPlan; segId: string; levelKnown: boolean; state: TypedTurnState;
  budgetDue: boolean;
  lastPart: boolean;
  studentMovedOn: boolean;
  menuPick: string | null;
  /** R3 (fix round 1): the student said something this turn (the level check's third reply may move — if it is an answer). */
  studentReplied: boolean;
  nudge: boolean;
  items: readonly string[];
  /** ms since the lesson started (the lesson-time guard's clock; postDueHoldDecision's deadline). */
  lessonElapsedMs: number;
  /** V6: the held working level (null / absent = none yet) — filters next_card's key ideas as the board does. */
  workingLevel?: WorkingLevel | null;
  /** W2: the engine moved the pointer before this brain call (Skip, typed objective jump, lesson-time guard):
   *  segId is the part it entered, and no second move / close is allowed this turn. */
  engineMoved?: boolean;
  /** X1 (fix wave 3): the client's numbered-question tracker has seen every numbered question of THIS part answered
   *  (r61b 70 s: the tracker knew, the brain's `none` verdicts kept answersInPart at 0 and the move was refused). */
  partQuestionsAnswered: boolean;
  /** X2 (fix wave 3): the current part's requiredPhrases not yet said (the client's close-guard call,
   *  missingRequiredPhrases). Present ⇒ the recap's turn_state lists them on EVERY turn while any is missing, and the
   *  request carries them for the server's close gate. Absent ⇒ the plan's list on the review turn only (V3). */
  missingRequiredPhrases?: string[];
}

/** W2: the state on entering `to` by an engine move — the old part's open ask and correction are gone. Pure. */
export function enterPartState(state: TypedTurnState, to: string): TypedTurnState {
  return {
    ...state,
    openAsk: { kind: 'none', text: '' },
    correctionOpen: null,
    retriesInARow: 0,
    pendingVerdict: null,
    turnsInPart: { ...state.turnsInPart, [to]: 0 },
    postDueTurns: { ...(state.postDueTurns ?? {}), [to]: 0 },
    answersInPart: { ...(state.answersInPart ?? {}), [to]: 0 },
    recapReviewed: { ...(state.recapReviewed ?? {}), [to]: false },
  };
}

/** W2: the labels (any language) of the parts after `segId`, extension parts excluded — the prose move-on order's
 *  list (VTR TUTOR_MOVE_ON_ORDER block), for moveOnRequestSpan. Pure. */
export function laterPartLabels(plan: LessonPlan, segId: string): string[] {
  const idx = plan.segments.findIndex((sg) => sg.id === segId);
  const later = idx >= 0 ? plan.segments.slice(idx + 1).filter((sg) => (sg.kind ?? '').toLowerCase() !== 'extension') : [];
  return later.flatMap((sg) => {
    const md = (sg.metadata ?? {}) as Record<string, unknown>;
    const loc = md.labelLocalized && typeof md.labelLocalized === 'object' ? Object.values(md.labelLocalized as Record<string, unknown>) : [];
    return [md.label, ...loc].filter((x): x is string => typeof x === 'string' && x.trim() !== '');
  });
}

/** W1: the prose post-due cap on the typed path: 'hold-ok' | 'capped' | 'deadline' (only meaningful when budgetDue). */
function postDueState(ctx: AllowedNextContext): 'hold-ok' | 'capped' | 'deadline' {
  return postDueHoldDecision({ plan: ctx.plan, holds: ctx.state.postDueTurns?.[ctx.segId] ?? 0, lessonElapsedMs: ctx.lessonElapsedMs });
}

/** W6: the plan items of this part not yet practised — turn_state's items_left and the request's itemsLeft. Pure. */
export function itemsLeftFor(ctx: AllowedNextContext): string[] {
  return itemsLeft(ctx);
}

/** V5 (fix wave 2): learner sentences that refill a pronunciation part, at most this many. */
export const TYPED_REFILL_MAX = 4;
const refillKey = (s: string): string => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
/** V5: a pronunciation part's items — the authored ones, then the learner's corrected sentences from this session
 *  (`corrected` newest first; de-duplicated, full sentences only, at most TYPED_REFILL_MAX) — the plan's "when the
 *  menu's items are used up, take a corrected sentence of the learner's". Pure. */
export function typedPronunciationItems(authored: readonly string[], corrected: readonly string[]): string[] {
  const seen = new Set(authored.map(refillKey));
  const extra: string[] = [];
  for (const raw of corrected) {
    const s = (raw ?? '').trim();
    const full = /^[A-Z]/.test(s) && /[.!?]["”’)]?$/.test(s) && (s.match(/[A-Za-z']+/g) ?? []).length >= 3;
    if (!full || seen.has(refillKey(s))) continue;
    seen.add(refillKey(s));
    extra.push(s);
    if (extra.length >= TYPED_REFILL_MAX) break;
  }
  return [...authored, ...extra];
}

function itemsLeft(ctx: AllowedNextContext): string[] {
  const done = ctx.state.practisedItems[ctx.segId] ?? [];
  return ctx.items.filter((i) => !done.includes(i));
}

/** First matching row of the allowed-set table wins; every row is non-empty.
 *  W2: after an engine move this turn, move / close are removed; an empty result is the new part's entry row. */
export function allowedNextFor(ctx: AllowedNextContext): TypedNextKind[] {
  const row = allowedNextRow(ctx);
  if (!ctx.engineMoved) return row;
  const rest = row.filter((k) => k !== 'move' && k !== 'close');
  if (rest.length) return rest;
  const kind = typedPartKind(ctx.plan, ctx.segId, ctx.levelKnown);
  return kind === 'menu' || kind === 'pronunciation' ? ['menu'] : ['question'];
}

function allowedNextRow(ctx: AllowedNextContext): TypedNextKind[] {
  const { state, segId } = ctx;
  const ask = state.openAsk.kind;
  const askOpen = ask !== 'none';
  const kind = typedPartKind(ctx.plan, segId, ctx.levelKnown);
  const moveOrClose: TypedNextKind = ctx.lastPart ? 'close' : 'move';
  const withRetry = (arr: TypedNextKind[]): TypedNextKind[] => (askOpen ? arr : arr.filter((k) => k !== 'retry'));

  if (ctx.nudge) return [ask === 'none' ? 'question' : ask, 'wait'];
  if (ctx.studentMovedOn) return [moveOrClose];

  // R3 (fix round 1): committed answers (earlier replies with verdict ≠ none) decide; with two committed, the reply now
  // may move only if it is a real answer (moveNeedsAnswerFor — the server refuses a move on verdict none).
  if (kind === 'level_check') {
    const committed = state.answersInPart?.[segId] ?? 0;
    // X1: the engine's own tracker (every numbered question answered) moves, whatever the verdicts were.
    if (ctx.partQuestionsAnswered || committed >= 3) return ['move'];
    // R5: question first — allowedNext[0] is the cut / unparseable fallback (re-ask, never move).
    return committed === 2 && ctx.studentReplied ? ['question', 'move'] : ['question'];
  }

  if (kind === 'menu' || kind === 'pronunciation') {
    const ms = state.menuState[segId] ?? { asked: 0, picked: null };
    if (!ms.picked && !ctx.menuPick) return ms.asked >= 2 ? ['move'] : ['menu'];
    if (kind === 'pronunciation') {
      // V5 (fix wave 2): items used up → the one-more-or-move-on offer first (once), then the move
      // (the voice run moved straight to the summary after the last authored sentence).
      // R2 (fix round 1): the LAST item's result is in (open ask item, not yet repeated) — the weakest-word repeat
      // is still allowed beside the offer / move (the plan: one more repeat on the weakest word after a result).
      if (itemsLeft(ctx).length === 0) {
        const exit: TypedNextKind = state.offerState[segId]?.made ? 'move' : 'offer';
        return ask === 'item' && state.retriesInARow === 0 ? ['retry', exit] : [exit];
      }
      const row: TypedNextKind[] = ['item', 'retry', 'offer', 'move'];
      // retry = "the same sentence again": only meaningful while an item is the open ask
      return ask === 'item' ? row : row.filter((k) => k !== 'retry');
    }
  }

  if (kind === 'offer_part') {
    const o = state.offerState[segId] ?? { made: false, accepted: false, served: false };
    // W1: from the lesson-time guard point on no offer (postDueHoldDecision 'deadline'): the part moves.
    if (ctx.budgetDue && !o.made) return postDueState(ctx) === 'deadline' ? [moveOrClose] : ['offer'];
    if (o.made && !o.accepted && ask === 'offer') return ['move', 'question'];
    if (o.accepted && !o.served) return ['question'];
    if (o.accepted && o.served && ctx.budgetDue) return ['move'];
  }

  // W1: the part's post-due holds are spent (or the lesson deadline passed) — the move, whatever is open.
  if (ctx.budgetDue && postDueState(ctx) !== 'hold-ok') return [moveOrClose];

  if (ask === 'retry') {
    const extra: TypedNextKind[] = ctx.budgetDue ? ['move'] : [];
    return state.retriesInARow >= 2 ? ['question', ...extra] : ['retry', 'question', ...extra];
  }

  // V3 (fix wave 2): the summary is engine-driven — review + feedback + check question, then the close (the brain
  // never picked close when it was offered beside question; a question object costs one retry, then the close fallback).
  // R1: keyed on the delivered review, not on turns (a nudge / wait turn at the start must not skip it).
  if (kind === 'recap') return state.recapReviewed?.[segId] ? ['close'] : ['question'];

  if (ctx.budgetDue) return askOpen ? ['question', 'move'] : [moveOrClose];

  return withRetry(['question', 'retry']);
}

/** R3: true only in the level check's "two committed answers + a reply now" cell — a `move` there needs verdict ≠ none.
 *  Same preconditions as allowedNextFor (a nudge / move-on / engine move row wins). Pure. */
export function moveNeedsAnswerFor(ctx: AllowedNextContext): boolean {
  if (typedPartKind(ctx.plan, ctx.segId, ctx.levelKnown) !== 'level_check') return false;
  if (ctx.nudge || ctx.studentMovedOn || ctx.engineMoved || !ctx.studentReplied) return false;
  return (ctx.state.answersInPart?.[ctx.segId] ?? 0) === 2 && allowedNextFor(ctx).includes('move');
}

function esc(s: string): string {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function turnStateLine(ctx: AllowedNextContext): string {
  const { state, segId } = ctx;
  const o = state.offerState[segId] ?? { made: false, accepted: false, served: false };
  const max = segmentMaxTurns(ctx.plan, segId);
  const turn = `${state.turnsInPart[segId] ?? 0}/${max ?? '?'}`;
  const yn = (b: boolean) => (b ? 'yes' : 'no');
  const attrs: Array<[string, string]> = [
    ['part', typedPartKind(ctx.plan, segId, ctx.levelKnown)],
    ['label', fixedScriptPartLabel(ctx.plan, segId)],
    ['turn', turn],
    ['open_ask', state.openAsk.kind],
    ['open_ask_text', state.openAsk.text],
    ['offer_made', yn(o.made)],
    ['offer_accepted', yn(o.accepted)],
    ['menu_picked', state.menuState[segId]?.picked || ctx.menuPick || 'none'],
    ['items_practised', (state.practisedItems[segId] ?? []).join('|')],
    ['items_left', itemsLeftFor(ctx).join('|')],
    ['last_item', yn(!!state.lastItemAnnounced[segId])],
    ['budget_due', yn(ctx.budgetDue)],
    // W1: post-due turns spent in this part; last_turn = this part's holds are used up (or about to be)
    ...(ctx.budgetDue ? [['post_due', String(state.postDueTurns?.[segId] ?? 0)] as [string, string]] : []),
    ...(ctx.budgetDue && ((state.postDueTurns?.[segId] ?? 0) + 1 >= FIXED_SCRIPT_POST_DUE_MAX_HOLDS || postDueState(ctx) === 'deadline')
      ? [['last_turn', 'yes'] as [string, string]] : []),
    ['correction_open', yn(!!state.correctionOpen)],
    // V2: the conversation part's corrections budget (2 per part)
    ...(typedPartKind(ctx.plan, segId, ctx.levelKnown) === 'conversation'
      ? [['corrections_left', String(Math.max(0, TYPED_CONVERSATION_CORRECTIONS - (state.correctionsInPart?.[segId] ?? 0)))] as [string, string]] : []),
    ['level_known', yn(ctx.levelKnown)],
    // X1: every numbered question of this part has been answered (level check) — the row allows only the move.
    ...(ctx.partQuestionsAnswered && typedPartKind(ctx.plan, segId, ctx.levelKnown) === 'level_check' ? [['questions_done', 'yes'] as [string, string]] : []),
    ...(moveNeedsAnswerFor(ctx) ? [['move_needs_answer', 'yes'] as [string, string]] : []),
  ];
  // V3: the recap's step, and on its first turn the plan's required phrases (the review turn must say them).
  // X2 (fix wave 3, r61b 745 s): with the client's missing list, the phrases still unsaid ride EVERY recap turn
  // (the close must carry them); none missing ⇒ omitted.
  if (typedPartKind(ctx.plan, segId, ctx.levelKnown) === 'recap') {
    const first = !state.recapReviewed?.[segId];
    attrs.push(['recap_step', first ? 'review_feedback_check' : 'close']);
    const phrases = (segmentOf(ctx.plan, segId)?.requiredPhrases ?? []).filter((p) => typeof p === 'string' && p.trim());
    const missing = ctx.missingRequiredPhrases;
    if (missing) { if (missing.length) attrs.push(['required_phrases', missing.join('|')]); }
    else if (first && phrases.length) attrs.push(['required_phrases', phrases.join('|')]);
  }
  // G2: the card questions the student already answered on this part (the brain re-asked one in r55).
  const answered = (state.answeredCards[segId] ?? []).slice(0, 4).map((q) => q.slice(0, 120));
  if (answered.length) attrs.push(['answered', answered.join('|')]);
  // F1: a move turn opens the NEXT part, (an offer names it too) so the brain must see that part's label and opening card.
  const allowed = allowedNextFor(ctx);
  if (allowed.includes('move') || allowed.includes('close') || allowed.includes('offer')) {
    const to = nextSegmentId(ctx.plan, segId, ctx.levelKnown);
    attrs.push(['next_part', to ? fixedScriptPartLabel(ctx.plan, to) : '(end)']);
    // V6: a key-ideas part has no question card — its card (examples + practice question) instead, with more room.
    if (to) attrs.push(['next_card', cardStatement(ctx.plan, to).slice(0, 300) || capCardText(keyIdeasCard(ctx.plan, to, ctx.workingLevel), 700)]);
  }
  return `<turn_state ${attrs.map(([k, v]) => `${k}="${esc(v)}"`).join(' ')}/>`;
}

/** X2: the phrases the server's close gate checks — the client's missing list (max 8, each ≤ 120 chars); none on the
 *  student's stop / move-on request (the prose close guard never refuses then either). */
function closeRequiredPhrases(ctx: AllowedNextContext): string[] {
  if (ctx.studentMovedOn) return [];
  return (ctx.missingRequiredPhrases ?? []).filter((p) => typeof p === 'string' && p.trim() && p.length <= 120).slice(0, 8);
}

export function typedTurnRequestFor(ctx: AllowedNextContext): TypedTurnRequest {
  const left = itemsLeftFor(ctx);
  const requiredPhrases = closeRequiredPhrases(ctx);
  return {
    state: turnStateLine(ctx),
    allowedNext: allowedNextFor(ctx),
    recap: typedPartKind(ctx.plan, ctx.segId, ctx.levelKnown) === 'recap',
    nudge: ctx.nudge,
    ...(moveNeedsAnswerFor(ctx) ? { moveNeedsAnswer: true } : {}),
    // W6: the server refuses an item outside this list before it is spoken (one retry); absent on a part without items.
    ...(left.length ? { itemsLeft: left.slice(0, 8) } : {}),
    // X2: a `close` lacking one of these is refused once by the server (the retry names them).
    ...(requiredPhrases.length ? { requiredPhrases } : {}),
  };
}

// ---- Field effects, state reducer, engine fallback lines ----

export type TypedEffect =
  | { kind: 'model_card'; sentence: string }
  | { kind: 'correction_card'; student: string; corrected: string; emphasis: string[] }
  | { kind: 'advance'; from: string; to: string; bridgeMissing: boolean }
  | { kind: 'arm_item'; text: string }
  | { kind: 'set_level'; level: 'beginner' | 'intermediate' | 'advanced' }
  | { kind: 'close' }
  | { kind: 'menu_asked' } | { kind: 'offer_made' } | { kind: 'offer_served' }
  | { kind: 'open_ask'; ask: TypedTurnState['openAsk'] };

export interface FieldEffectContext {
  plan: LessonPlan; segId: string; levelKnown: boolean; state: TypedTurnState;
  studentLast: string; cardStatement: string | null; items: readonly string[];
  /** This turn's resolved menu pick text (same value as AllowedNextContext.menuPick), or null. */
  menuPick: string | null;
  /** W1: the same budgetDue the turn's AllowedNextContext carried (counts a post-due turn). */
  budgetDue: boolean;
  /** R6 (fix round 2): the same nudge flag the turn's AllowedNextContext carried (a nudge re-ask is no recap review). */
  nudge: boolean;
}

/** X1: words that carry no answer content ("Yes, I'm ready.", "OK, thank you.", "Sorry, can you say that again?"). */
const ANSWER_STOP = new Set(['the', 'a', 'an', 'to', 'of', 'and', 'is', 'it', 'that', 'this', 'in', 'on', 'for', 'i', 'you', 'we', 'yes', 'no', 'ok', 'okay', 'thank', 'thanks', 'please', 'sorry']);
/** X1 (fix wave 3): the reply looks like an attempt at an answer — ≥ 4 content words (lower-cased, punctuation stripped,
 *  ANSWER_STOP removed) or ≥ 8 Japanese-script characters. The engine's backstop for a brain `none` on a real answer
 *  (r61b 34 s / 51 s). Pure. */
export function answerShaped(text: string): boolean {
  const s = String(text ?? '');
  const ja = s.match(/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/g) ?? [];
  if (ja.length >= 8) return true;
  const words = s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, '').split(/\s+/).filter((w) => w && !ANSWER_STOP.has(w));
  return words.length >= 4;
}

const CARD_WORD_STOP = new Set(['the', 'and', 'you', 'your', 'for', 'are', 'was', 'were', 'have', 'has', 'had', 'did', 'does', 'with', 'that', 'this', 'what', 'who', 'how', 'any', 'can', 'will', 'would', 'about', 'there', 'their', 'from', 'but', 'not']);
function contentWords(s: string): Set<string> {
  return new Set((s.toLowerCase().match(/[a-z']{3,}/g) ?? []).filter((w) => !CARD_WORD_STOP.has(w)));
}
/** True when `say` shares at least 3 content words with the card statement. */
export function sharesCardWords(say: string, card: string): boolean {
  const c = contentWords(card);
  let n = 0;
  for (const w of contentWords(say)) if (c.has(w)) n++;
  return n >= 3;
}

/** First plan item not yet practised in this part. */
export function nextItemFor(ctx: FieldEffectContext): string | null {
  const done = ctx.state.practisedItems[ctx.segId] ?? [];
  return ctx.items.find((i) => !done.includes(i)) ?? null;
}

/** The item a `next` of kind item arms: its own text if listed and unpractised, else the next listed one. */
function resolveItem(next: TypedNext, ctx: FieldEffectContext): string | null {
  const text = (next.item ?? '').trim();
  const done = ctx.state.practisedItems[ctx.segId] ?? [];
  const listed = ctx.items.find((i) => i.trim() === text);
  if (listed && !done.includes(listed)) return listed;
  return nextItemFor(ctx);
}

/** A question served on an accepted-but-not-yet-served offer. */
function servesOffer(state: TypedTurnState, segId: string): boolean {
  const o = state.offerState[segId];
  return !!o && o.accepted && !o.served;
}

/** Records the verdict, which closes before verdict_say. */
export function applyField(state: TypedTurnState, ev: TypedFieldValue): TypedTurnState {
  return ev.field === 'verdict' ? { ...state, pendingVerdict: ev.value } : state;
}

function openAskFor(next: TypedNext, ctx: FieldEffectContext, newPartId: string | null): TypedTurnState['openAsk'] {
  // move: the new part's card; question: this part's card
  const card = next.kind === 'move' && newPartId ? cardStatement(ctx.plan, newPartId)
    : next.kind === 'question' ? (ctx.cardStatement ?? '') : '';
  const ask: TypedTurnState['openAsk'] = { kind: next.kind === 'move' ? 'question' : (next.kind as TypedTurnState['openAsk']['kind']), text: next.say };
  if (card && sharesCardWords(next.say, card)) ask.cardQuestion = card;
  return ask;
}

/** Effects to run when one field closes (cards anchor to the sentence about to be spoken). Pure. */
export function effectsForField(ev: TypedFieldValue, ctx: FieldEffectContext): TypedEffect[] {
  // V1 (fix wave 2): the model card is the brain's `board` sentence, never the raw transcript (the r-Praveen voice run
  // boarded 11 of 24 student sentences with their errors). verdict_say carries no effect.
  if (ev.field === 'board') {
    // R4/M1: the board sentence passes the same card guard the prose cards use (a bare "Yes." / two words is no card).
    const sentence = ctx.state.pendingVerdict === 'correct' ? cardableStudentSentence(ev.value.trim()) : null;
    return sentence ? [{ kind: 'model_card', sentence }] : [];
  }
  if (ev.field === 'correction') {
    const c = ev.value;
    return c ? [{ kind: 'correction_card', student: c.student, corrected: c.corrected, emphasis: c.emphasis }] : [];
  }
  if (ev.field !== 'next') return [];
  const next = ev.value;
  const out: TypedEffect[] = [];
  if (next.level) out.push({ kind: 'set_level', level: next.level });
  if (next.kind === 'wait') return out;
  if (next.kind === 'close') return [...out, { kind: 'close' }];
  let newPart: string | null = null;
  switch (next.kind) {
    case 'item': {
      const text = resolveItem(next, ctx);
      if (text) out.push({ kind: 'arm_item', text });
      break;
    }
    case 'move': {
      newPart = nextSegmentId(ctx.plan, ctx.segId, ctx.levelKnown);
      if (!newPart) return [...out, { kind: 'close' }];
      const bridgeMissing = fixedScriptBridgeClause(ctx.plan, ctx.segId, newPart) !== ''
        && !/\b(learned|told me|you said|about you)\b|について/i.test(next.say);
      out.push({ kind: 'advance', from: ctx.segId, to: newPart, bridgeMissing });
      break;
    }
    case 'menu': out.push({ kind: 'menu_asked' }); break;
    case 'offer': out.push({ kind: 'offer_made' }); break;
    case 'question': {
      if (servesOffer(ctx.state, ctx.segId)) out.push({ kind: 'offer_served' });
      break;
    }
    default: break;
  }
  out.push({ kind: 'open_ask', ask: openAskFor(next, ctx, newPart) });
  return out;
}

/**
 * The state after the whole turn was spoken. Pure.
 * Contract: ctx.segId is the part the brain was answering in (the FROM part, also after a move);
 * `moved.to` is the new part. A `move` with no next part (moved null) is a close.
 */
export function applyTypedTurn(
  state: TypedTurnState, turn: TypedTurn, ctx: FieldEffectContext, moved: { from: string; to: string } | null,
): TypedTurnState {
  const seg = ctx.segId;
  const next = turn.next;
  const closing = next.kind === 'close'
    || (next.kind === 'move' && !moved && nextSegmentId(ctx.plan, seg, ctx.levelKnown) === null);
  const turnsInPart = { ...state.turnsInPart };
  if (moved) turnsInPart[moved.to] = 0;
  else turnsInPart[seg] = (turnsInPart[seg] ?? 0) + 1;
  const postDueTurns = { ...(state.postDueTurns ?? {}) };
  if (ctx.budgetDue) postDueTurns[seg] = (postDueTurns[seg] ?? 0) + 1;
  if (moved) postDueTurns[moved.to] = 0;

  const correctionsInPart = { ...(state.correctionsInPart ?? {}) };
  if (turn.correction) correctionsInPart[seg] = (correctionsInPart[seg] ?? 0) + 1;
  const answersInPart = { ...(state.answersInPart ?? {}) };
  // X1: a `none` on an answer-shaped reply still counts (the brain judged real answers none in r61b).
  if (turn.verdict !== 'none' || answerShaped(ctx.studentLast)) answersInPart[seg] = (answersInPart[seg] ?? 0) + 1;
  if (moved) answersInPart[moved.to] = 0;
  const recapReviewed = { ...(state.recapReviewed ?? {}) };
  if (next.kind === 'question' && !ctx.nudge && typedPartKind(ctx.plan, seg, ctx.levelKnown) === 'recap') recapReviewed[seg] = true;

  const answeredCards = { ...state.answeredCards };
  if ((turn.verdict === 'correct' || turn.verdict === 'partly_correct') && state.openAsk.cardQuestion) {
    const key = moved?.from ?? seg;
    const cur = answeredCards[key] ?? [];
    if (!cur.includes(state.openAsk.cardQuestion)) answeredCards[key] = [...cur, state.openAsk.cardQuestion];
  }

  const practisedItems = { ...state.practisedItems };
  const lastItemAnnounced = { ...state.lastItemAnnounced };
  if (next.kind === 'item') {
    const item = resolveItem(next, ctx);
    if (item) {
      practisedItems[seg] = [...(practisedItems[seg] ?? []), item];
      if (ctx.items.every((i) => practisedItems[seg].includes(i))) lastItemAnnounced[seg] = true;
    }
  }

  const menuState = { ...state.menuState };
  if (next.kind === 'menu') {
    const m = menuState[seg] ?? { asked: 0, picked: null };
    menuState[seg] = { ...m, asked: m.asked + 1 };
  }
  // A pick resolved this turn is persisted: later turns see it in state, so the menu is never re-asked after an item.
  if (ctx.menuPick) menuState[seg] = { ...(menuState[seg] ?? { asked: 0, picked: null }), picked: ctx.menuPick };

  const offerState = { ...state.offerState };
  const o = offerState[seg] ?? { made: false, accepted: false, served: false };
  if (next.kind === 'offer') offerState[seg] = { ...o, made: true };
  else if (next.kind === 'question' && servesOffer(state, seg)) offerState[seg] = { ...o, served: true };

  let openAsk = state.openAsk;
  if (closing) openAsk = { kind: 'none', text: '' };
  else if (next.kind !== 'wait') openAsk = openAskFor(next, ctx, moved ? moved.to : null);

  return {
    ...state,
    openAsk,
    correctionOpen: turn.correction ? { student: turn.correction.student, corrected: turn.correction.corrected }
      : turn.verdict === 'correct' ? null : state.correctionOpen,
    practisedItems, offerState, menuState, answeredCards, lastItemAnnounced, turnsInPart, postDueTurns, correctionsInPart, answersInPart, recapReviewed,
    retriesInARow: next.kind === 'retry' ? state.retriesInARow + 1 : 0,
    pendingVerdict: null,
  };
}

/** The engine's own line for a refused / missing `next`. null for 'wait' and 'close'. */
export function engineLineFor(kind: TypedNextKind, ctx: FieldEffectContext & { japanese: boolean }): string | null {
  const card = ctx.cardStatement ?? cardStatement(ctx.plan, ctx.segId);
  switch (kind) {
    case 'retry': return ctx.state.openAsk.text || null;
    case 'question': case 'move': return cardAskLine(card);
    case 'menu': return card || null;
    case 'offer': {
      const to = nextSegmentId(ctx.plan, ctx.segId, ctx.levelKnown);
      return to ? fixedScriptEngineOfferLines(ctx.plan, ctx.segId, to, { japanese: ctx.japanese }).join(' ') : null;
    }
    case 'item': return nextItemFor(ctx);
    default: return null;
  }
}

export function sayWithinBudget(next: TypedNext, recap: boolean): boolean {
  return englishSentenceCount(next.say) <= typedSayBudgetFor(next.kind, recap);
}
