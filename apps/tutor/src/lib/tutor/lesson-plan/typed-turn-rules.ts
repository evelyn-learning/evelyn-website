/**
 * Typed turn — lesson-state rules (pure; no React, no VoiceTutorRealtime import).
 * The engine computes the set of next.kind values the brain may use this turn
 * (allowedNextFor) and the one-line <turn_state/> it reads (turnStateLine).
 */
import type { LessonPlan, Segment } from './types';
import {
  fixedScriptBridgeClause, fixedScriptEngineOfferLines, fixedScriptPartLabel, nextSegmentId, segmentMaxTurns, segmentTransitionKind,
} from './fixed-script';
import { getSegmentTruth } from './context';
import { cardAskLine } from './transition-ask';
import { boardOffersChoices, cardableStudentSentence } from '../voice/sentence-board';
import {
  englishSentenceCount, TYPED_SAY_BUDGET, TYPED_SAY_BUDGET_RECAP,
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
    retriesInARow: 0,
    pendingVerdict: null,
  };
}

export interface AllowedNextContext {
  plan: LessonPlan; segId: string; levelKnown: boolean; state: TypedTurnState;
  budgetDue: boolean;
  lastPart: boolean;
  studentMovedOn: boolean;
  menuPick: string | null;
  studentAnswerCount: number;
  nudge: boolean;
  items: readonly string[];
}

function itemsLeft(ctx: AllowedNextContext): string[] {
  const done = ctx.state.practisedItems[ctx.segId] ?? [];
  return ctx.items.filter((i) => !done.includes(i));
}

/** First matching row of the allowed-set table wins; every row is non-empty. */
export function allowedNextFor(ctx: AllowedNextContext): TypedNextKind[] {
  const { state, segId } = ctx;
  const ask = state.openAsk.kind;
  const askOpen = ask !== 'none';
  const kind = typedPartKind(ctx.plan, segId, ctx.levelKnown);
  const moveOrClose: TypedNextKind = ctx.lastPart ? 'close' : 'move';
  const withRetry = (arr: TypedNextKind[]): TypedNextKind[] => (askOpen ? arr : arr.filter((k) => k !== 'retry'));

  if (ctx.nudge) return [ask === 'none' ? 'question' : ask, 'wait'];
  if (ctx.studentMovedOn) return [moveOrClose];

  if (kind === 'level_check') return ctx.studentAnswerCount >= 3 ? ['move'] : withRetry(['question', 'retry']);

  if (kind === 'menu' || kind === 'pronunciation') {
    const ms = state.menuState[segId] ?? { asked: 0, picked: null };
    if (!ms.picked && !ctx.menuPick) return ms.asked >= 2 ? ['move'] : ['menu'];
    if (kind === 'pronunciation') {
      if (itemsLeft(ctx).length === 0) return ['offer', 'move'];
      const row: TypedNextKind[] = ['item', 'retry', 'offer', 'move'];
      // retry = "the same sentence again": only meaningful while an item is the open ask
      return ask === 'item' ? row : row.filter((k) => k !== 'retry');
    }
  }

  if (kind === 'offer_part') {
    const o = state.offerState[segId] ?? { made: false, accepted: false, served: false };
    if (ctx.budgetDue && !o.made) return ['offer'];
    if (o.made && !o.accepted && ask === 'offer') return ['move', 'question'];
    if (o.accepted && !o.served) return ['question'];
    if (o.accepted && o.served && ctx.budgetDue) return ['move'];
  }

  if (ask === 'retry') {
    const extra: TypedNextKind[] = ctx.budgetDue ? ['move'] : [];
    return state.retriesInARow >= 2 ? ['question', ...extra] : ['retry', 'question', ...extra];
  }

  if (kind === 'recap') return (state.turnsInPart[segId] ?? 0) >= 1 ? ['close', 'question'] : ['question', 'close'];

  if (ctx.budgetDue) return askOpen ? ['question', 'move'] : [moveOrClose];

  return withRetry(['question', 'retry']);
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
    ['items_left', itemsLeft(ctx).join('|')],
    ['last_item', yn(!!state.lastItemAnnounced[segId])],
    ['budget_due', yn(ctx.budgetDue)],
    ['correction_open', yn(!!state.correctionOpen)],
    ['level_known', yn(ctx.levelKnown)],
  ];
  // G2: the card questions the student already answered on this part (the brain re-asked one in r55).
  const answered = (state.answeredCards[segId] ?? []).slice(0, 4).map((q) => q.slice(0, 120));
  if (answered.length) attrs.push(['answered', answered.join('|')]);
  // F1: a move turn opens the NEXT part, (an offer names it too) so the brain must see that part's label and opening card.
  const allowed = allowedNextFor(ctx);
  if (allowed.includes('move') || allowed.includes('close') || allowed.includes('offer')) {
    const to = nextSegmentId(ctx.plan, segId, ctx.levelKnown);
    attrs.push(['next_part', to ? fixedScriptPartLabel(ctx.plan, to) : '(end)']);
    if (to) attrs.push(['next_card', cardStatement(ctx.plan, to).slice(0, 300)]);
  }
  return `<turn_state ${attrs.map(([k, v]) => `${k}="${esc(v)}"`).join(' ')}/>`;
}

export function typedTurnRequestFor(ctx: AllowedNextContext): TypedTurnRequest {
  return {
    state: turnStateLine(ctx),
    allowedNext: allowedNextFor(ctx),
    recap: typedPartKind(ctx.plan, ctx.segId, ctx.levelKnown) === 'recap',
    nudge: ctx.nudge,
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
  if (ev.field === 'verdict_say') {
    if (ctx.state.pendingVerdict !== 'correct') return [];
    // cardableStudentSentence strips "um/well/so," but not a spoken "yes,": a lowercase rest is no card candidate.
    const sentence = cardableStudentSentence(ctx.studentLast.replace(/^\s*(?:yes|yeah|yep|yup)\s*[,.]\s*(?=\S+\s+\S)/i, ''));
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

  const answeredCards = { ...state.answeredCards };
  if (turn.verdict === 'correct' && state.openAsk.cardQuestion) {
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
    practisedItems, offerState, menuState, answeredCards, lastItemAnnounced, turnsInPart,
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
  return englishSentenceCount(next.say) <= (recap ? TYPED_SAY_BUDGET_RECAP : TYPED_SAY_BUDGET);
}
