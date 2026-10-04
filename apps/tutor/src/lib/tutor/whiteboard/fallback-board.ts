// src/lib/tutor/whiteboard/fallback-board.ts
/**
 * "The board holds nothing but the opener fallback line" — pure helpers.
 *
 * When the opening turn draws nothing, the orchestrator paints one generic
 * handwrite line (opener-fallback.ts) so the student never sees a blank
 * board. That line is a placeholder, not content: in the trial this module
 * was written for it was the ONLY thing on the board for ten minutes, and
 * when the first real equation finally arrived it was held in the
 * render-sync buffer for 8.5 s waiting for its speech anchor.
 *
 * While the board is in that state the render-sync trade-off is the same as
 * on the opening turn (render-sync.ts shouldBypassRenderSync): "shown a few
 * seconds before it is described" is cheap, "still nothing on the board" is
 * not. So the FIRST render of a turn paints immediately; everything after it
 * keeps full anchor semantics.
 */
import { buildOpenerFallbackCommand } from '@/lib/tutor/ai/opener-fallback';

type Cmd = { action?: unknown; text?: unknown };

const RENDERLESS_ACTIONS = new Set([
  'newPage', 'scrollTo', 'clear', 'reviseItems', 'advanceLesson', 'markSegmentComplete', 'setCurrentProblem',
]);

/** Is this command the opener fallback line (for this topic, or the no-topic
 *  variant, or — when the topic is unknown — the fixed fallback shape)? */
export function isOpenerFallbackCommand(cmd: unknown, topic?: string): boolean {
  const c = (cmd ?? {}) as Cmd;
  if (c.action !== 'handwrite' || typeof c.text !== 'string') return false;
  if (c.text === (buildOpenerFallbackCommand() as Cmd).text) return true;
  if (topic && topic.trim()) return c.text === (buildOpenerFallbackCommand({ topic }) as Cmd).text;
  // Topic unknown to the caller: match the template around any topic.
  const probe = (buildOpenerFallbackCommand({ topic: '\u0000' }) as Cmd).text as string;
  const [head, tail] = probe.split('\u0000');
  return c.text.length > head.length + tail.length && c.text.startsWith(head) && c.text.endsWith(tail);
}

/**
 * True when the command log contains the fallback line and no other render.
 * Navigation / bookkeeping commands are ignored. An EMPTY board is not
 * "fallback only" (the opening-turn bypass owns that case).
 */
export function boardHoldsOnlyOpenerFallback(commands: readonly unknown[], topic?: string): boolean {
  let sawFallback = false;
  for (const cmd of commands ?? []) {
    const action = String(((cmd ?? {}) as Cmd).action ?? '');
    if (RENDERLESS_ACTIONS.has(action)) continue;
    if (isOpenerFallbackCommand(cmd, topic)) { sawFallback = true; continue; }
    return false;
  }
  return sawFallback;
}

/**
 * After renders were taken OFF the board (a killed attempt rolled back, a
 * buffered render dropped before it ever painted): is the board back to
 * "nothing but the opener fallback"?
 *
 * WHY: the fallback-only flag is cleared when the first render is DISPATCHED.
 * If that render is then killed and rolled back, the board shows only the
 * placeholder again — but the flag stayed cleared for the rest of the session,
 * disarming both the paint-now exception and the fallback-board continuation.
 * Derived from the actual command log, not from the flag's history.
 *
 * `commands` is the orchestrator's command mirror AFTER the removal. Live, the
 * fallback line is painted straight to the canvas and is not in that mirror
 * (on resume it is) — hence the separate `fallbackOnBoard` fact.
 */
export function boardFallbackOnlyAfterRollback(input: {
  /** The opener fallback line was painted this session, or restored on resume. */
  fallbackOnBoard: boolean;
  commands: readonly unknown[];
  topic?: string;
}): boolean {
  if (!input.fallbackOnBoard) return false;
  return boardHoldsOnlyOpenerFallback([buildOpenerFallbackCommand(), ...(input.commands ?? [])], input.topic);
}

export function shouldPaintFirstRenderNow(input: {
  /** Kill switch (NEXT_PUBLIC_TUTOR_FALLBACK_BOARD_PAINT_NOW !== 'off'). */
  enabled: boolean;
  boardFallbackOnly: boolean;
  /** Renders already dispatched (bypassed or flushed) during THIS turn. */
  rendersDispatchedThisTurn: number;
  /** The batch contains at least one board render (not meta-only). */
  hasBoardRender: boolean;
  /** A Rule-8 repair frame carries its own anchor and is never a first paint. */
  isRepairFrame: boolean;
}): boolean {
  if (!input.enabled) return false;
  if (input.isRepairFrame) return false;
  if (!input.hasBoardRender) return false;
  if (!input.boardFallbackOnly) return false;
  return input.rendersDispatchedThisTurn === 0;
}
