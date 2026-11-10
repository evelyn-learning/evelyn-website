/**
 * Tutor brain v2 — shared types (docs/superpowers/specs/2026-11-09-tutor-brain-v2-design.md).
 *
 * v2 is a second turn path beside the v1 brain (voice/claude-brain.ts). The
 * runtime here holds facts and tools; the model decides what to say and do.
 */
import type Anthropic from '@anthropic-ai/sdk';
import type { LessonPlan } from '../lesson-plan/types';

export type GoalStatus = 'not_started' | 'shown' | 'demonstrated' | 'skipped';

/** What does not change during a session. */
export interface V2Session {
  studentName?: string;
  subject: string;
  level: string;
  mode: 'text' | 'voice';
  /** Minutes the session is meant to last, when there is a box. */
  timeBoxMinutes?: number;
  plan?: LessonPlan;
}

export interface V2BoardItem { id: string; tool: string; summary: string }
export interface V2BoardPage { title: string; items: V2BoardItem[] }
export interface V2Board { pages: V2BoardPage[]; current: number }

/** What a board tool call did. Goes back to the model as the tool result and stays in the history. */
export interface V2BoardOutcome { painted: boolean; detail: string }

/** Everything that changes during a session. The model's own note is the only lesson memory beside the history. */
export interface V2State {
  history: Anthropic.MessageParam[];
  note: string;
  goals: Record<string, { status: GoalStatus; why?: string }>;
  board: V2Board;
  startedAtMs: number;
  closed: boolean;
  closeSummary?: string;
}

export interface V2ToolCall { id: string; name: string; args: Record<string, unknown>; outcome: string }

export interface V2TurnResult {
  /** What the tutor says this turn, in order. */
  spoken: string;
  toolCalls: V2ToolCall[];
  state: V2State;
  usage: { inputTokens: number; outputTokens: number; cacheReadTokens: number; cacheCreationTokens: number };
  /** Milliseconds to the first text of the reply, and for the whole turn. */
  firstTextMs: number | null;
  totalMs: number;
  modelCalls: number;
}

export function newV2State(nowMs: number = Date.now()): V2State {
  return { history: [], note: '', goals: {}, board: { pages: [], current: -1 }, startedAtMs: nowMs, closed: false };
}
