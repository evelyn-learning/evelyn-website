/**
 * Typed turn — lesson-state rules (pure; no React, no VoiceTutorRealtime import).
 * The engine computes the set of next.kind values the brain may use this turn
 * (allowedNextFor) and the one-line <turn_state/> it reads (turnStateLine).
 */
import type { LessonPlan, Segment } from './types';
import {
  fixedScriptPartLabel, segmentMaxTurns, segmentTransitionKind,
} from './fixed-script';
import { getSegmentTruth } from './context';
import { boardOffersChoices } from '../voice/sentence-board';
import type { TypedNextKind, TypedTurnRequest, TypedVerdict } from '../voice/typed-turn';

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
      return itemsLeft(ctx).length > 0 ? withRetry(['item', 'retry', 'offer', 'move'].map((k) => k as TypedNextKind)) : ['offer', 'move'];
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
