/**
 * Tutor brain v2 — picking a session up after the page was reloaded.
 *
 * The browser holds a v2 session's state, so a reload loses it. Two things bring it back. The state itself is
 * kept in the browser's storage after every turn, under the session's id: the same browser gets the lesson back
 * exactly. Failing that (another device, storage cleared), the host's checkpoint gives the transcript and the
 * finished segments, and a state is rebuilt from those: the tutor knows what was said and what is done, and is
 * told that its record of the board is gone though the board is not.
 */
import type Anthropic from '@anthropic-ai/sdk';
import { newV2State, type V2State } from './types';

/** How the block that stands in for the student before the greeting begins (turn.ts v2StudentBlock). */
export const V2_OPENING_BLOCK_START = '[The session has just started.';

const KEY = (sessionId: string) => `evelyn:v2:state:${sessionId}`;

export function saveV2State(sessionId: string | undefined, state: V2State): void {
  if (!sessionId) return;
  try { window.localStorage.setItem(KEY(sessionId), JSON.stringify(state)); } catch { /* storage full or blocked: resume falls back to the checkpoint */ }
}
export function clearV2State(sessionId: string | undefined): void {
  if (!sessionId) return;
  try { window.localStorage.removeItem(KEY(sessionId)); } catch { /* nothing to clear */ }
}
export function loadV2State(sessionId: string | undefined): V2State | null {
  if (!sessionId) return null;
  try {
    const raw = window.localStorage.getItem(KEY(sessionId));
    const s = raw ? (JSON.parse(raw) as V2State) : null;
    return s && Array.isArray(s.history) && s.history.length > 0 && s.board && Array.isArray(s.board.pages) && typeof s.startedAtMs === 'number' && !s.closed ? s : null;
  } catch { return null; }
}

export interface V2Checkpoint { transcript: Array<{ role: string; text?: string }>; completedSegmentIds?: string[] }

/** A state rebuilt from the host's checkpoint. `openingBlock` is what stood in for the student before the
 *  tutor's greeting (turn.ts), so the history starts as every v2 history does. */
export function v2StateFromCheckpoint(cp: V2Checkpoint, nowMs: number, openingBlock: string): V2State {
  const history: Anthropic.MessageParam[] = [];
  const push = (role: 'user' | 'assistant', text: string) => {
    const last = history[history.length - 1];
    if (last && last.role === role) last.content = `${last.content as string}\n\n${text}`; else history.push({ role, content: text });
  };
  for (const e of cp.transcript) {
    const text = (e.text ?? '').trim(); if (!text) continue;
    const role = e.role === 'user' || e.role === 'student' ? 'user' : 'assistant';
    if (!history.length && role === 'assistant') history.push({ role: 'user', content: openingBlock });
    push(role, text);
  }
  // A history must end on the tutor's words for the next turn to be the student's.
  if (history.length && history[history.length - 1].role === 'user') history.pop();
  const goals: V2State['goals'] = {};
  for (const id of cp.completedSegmentIds ?? []) goals[id] = { status: 'demonstrated', why: 'done before the page was reloaded' };
  return { ...newV2State(nowMs), history, goals, note: 'The page was reloaded part-way through this lesson. The board the student sees still holds what was written before, but my record of it below starts again from empty.' };
}
