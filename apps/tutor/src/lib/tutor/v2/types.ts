/**
 * Tutor brain v2 — shared types (docs/superpowers/specs/2026-11-09-tutor-brain-v2-design.md).
 *
 * v2 is a second turn path beside the v1 brain (voice/claude-brain.ts). The
 * runtime here holds facts and tools; the model decides what to say and do.
 */
import type Anthropic from '@anthropic-ai/sdk';
import type { LessonPlan } from '../lesson-plan/types';

export type GoalStatus = 'not_started' | 'shown' | 'demonstrated' | 'skipped';

/** How far a gap in the student's knowledge has been worked on. */
export type GapStatus = 'found' | 'explained' | 'done_with_help' | 'done_alone';
export interface V2Gap { what: string; status: GapStatus }

/** What does not change during a session. */
export interface V2Session {
  studentName?: string;
  subject: string;
  /** What the lesson is about, in a few words (the plan's topic and title). Chooses the figure tools (tools.ts). */
  topic?: string;
  level: string;
  mode: 'text' | 'voice';
  /** Minutes the session is meant to last, when there is a box. */
  timeBoxMinutes?: number;
  plan?: LessonPlan;
}

export interface V2BoardItem { id: string; tool: string; summary: string; /** The content alone, normalised, for spotting repeats (board.ts). */ core?: string; /** A graph keeps what it plots, so a later graph on the same page can be drawn as one picture with it (turn.ts). */ args?: Record<string, unknown> }
export interface V2BoardPage { title: string; items: V2BoardItem[] }
export interface V2Board { pages: V2BoardPage[]; current: number }

/** What a board tool call did. Goes back to the model as the tool result and stays in the history. */
export interface V2BoardOutcome { painted: boolean; detail: string; /** The item already on the page in view that this call repeats. */ pointAt?: string }

/** Everything that changes during a session. The model's own note is the only lesson memory beside the history. */
export interface V2State {
  history: Anthropic.MessageParam[];
  note: string;
  goals: Record<string, { status: GoalStatus; why?: string }>;
  /** Gaps the tutor has found in what the student knows, with how far each has been worked on. Optional: older states have none. */
  gaps?: V2Gap[];
  board: V2Board;
  /** How many of the tutor's replies in a row have painted nothing on the board. Optional: older states have none. */
  repliesSinceBoard?: number;
  /** Board blocks of the last reply that were not painted, and why. Shown once in the next turn's facts. */
  boardProblems?: string[];
  startedAtMs: number;
  closed: boolean;
  closeSummary?: string;
}

export interface V2ToolCall {
  id: string; name: string; args: Record<string, unknown>; outcome: string;
  /** Board calls: the opening words of the sentence this item appears with (tools.ts SAY_WITH). */
  sayWith?: string;
  /** Written inline in the reply (board-inline.ts): it belongs with the words that follow it. */
  inline?: boolean;
  /** The id of an earlier board item this one takes the place of (a graph redrawn with more on it). */
  replaces?: string;
  /** Added after the reply for words said before it turned the page: it belongs on the page before (turn.ts). */
  beforeTurn?: boolean;
  /** Added after the reply for a sentence said earlier in it: the item of this reply it goes above (turn.ts). */
  before?: string;
  /** On a page turn: the student was asked whether to go on and said yes; the page turns as the reply begins. */
  agreed?: boolean;
  /** On a page turn: items written just before it, with no words between, that belong on the new page. */
  carries?: string[];
  /** Not painted: it repeats this item on the page in view, and the board scrolls back to it. */
  pointsAt?: string;
}

export interface V2TurnResult {
  /** What the tutor says this turn, in order. */
  spoken: string;
  toolCalls: V2ToolCall[];
  /** Board items the board check withdrew after they were sent (what each showed). */
  withdrawn?: string[];
  state: V2State;
  /** `model` is the model that answered: the session's cost is priced from it. */
  usage: { inputTokens: number; outputTokens: number; cacheReadTokens: number; cacheCreationTokens: number; model?: string };
  /** Milliseconds to the first text of the reply, and for the whole turn. */
  firstTextMs: number | null;
  totalMs: number;
  modelCalls: number;
}

export function newV2State(nowMs: number = Date.now()): V2State {
  return { history: [], note: '', goals: {}, board: { pages: [], current: -1 }, startedAtMs: nowMs, closed: false };
}
