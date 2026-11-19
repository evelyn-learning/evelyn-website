/**
 * Tutor brain v2 — Task 7y (PAUSE_HOLDS_BOARD): a paused voice pauses the board.
 *
 * Mic test 8 (embed-1795115593161, flag 2): the voice stopped for the learner, but the board went on writing. Two cards that arrived
 * 1.6 s into a barge-in pause were painted at once (their sentence had begun), and a question held for its sentence was painted by
 * the 45 s hold timer while the flag panel had the voice paused (wall 10:22 → 11:07, exactly 45.0 s).
 *
 * While the voice is paused (barge-in pause, sound pause, the flag panel), TutorVoiceV2 holds every arriving item instead of
 * painting it, paints nothing on release, and the hold timers stand still: each is cleared with its remaining time kept and armed
 * again with that time when the voice goes on. A confirmed barge-in then drops what was never painted (dropBoard, as before).
 * Off (or not paused): a hold timer is a plain timeout, as before.
 */
import { TUTOR_V2_PAUSE_HOLDS_BOARD } from '../orchestrator/flags';

/** One held item's give-up timer: running (timer set, due at dueAtMs) or suspended (leftMs kept). */
export interface V2HoldTimer { timer: ReturnType<typeof setTimeout> | null; dueAtMs: number; leftMs: number | null; fire: () => void }

export interface V2BoardClock {
  now: () => number;
  setTimer: (fn: () => void, ms: number) => ReturnType<typeof setTimeout>;
  clearTimer: (t: ReturnType<typeof setTimeout>) => void;
}
const REAL: V2BoardClock = { now: () => Date.now(), setTimer: (fn, ms) => setTimeout(fn, ms), clearTimer: (t) => clearTimeout(t) };

export class V2BoardPause {
  private paused = false;
  constructor(private readonly maxMs: number, private readonly clock: V2BoardClock = REAL, private readonly on: boolean = TUTOR_V2_PAUSE_HOLDS_BOARD) {}

  /** The voice is paused and the board with it: hold every item, paint nothing. */
  get holding(): boolean { return this.on && this.paused; }

  /** A held item's timer: running now, or (the voice paused) suspended with the whole wait still to run. */
  arm(fire: () => void, ms: number = this.maxMs): V2HoldTimer {
    if (this.holding) return { timer: null, dueAtMs: Number.NaN, leftMs: ms, fire };
    return { timer: this.clock.setTimer(fire, ms), dueAtMs: this.clock.now() + ms, leftMs: null, fire };
  }

  /** The item was painted, dropped or withdrawn: its timer never fires. */
  cancel(t: V2HoldTimer): void {
    if (t.timer) this.clock.clearTimer(t.timer);
    t.timer = null; t.leftMs = null;
  }

  /** The voice paused: the running timers stand still with what they had left. */
  pause(timers: readonly V2HoldTimer[]): void {
    if (!this.on) return;
    this.paused = true;
    const now = this.clock.now();
    for (const t of timers) {
      if (!t.timer) continue;
      this.clock.clearTimer(t.timer); t.timer = null; t.leftMs = Math.max(0, t.dueAtMs - now);
    }
  }

  /** The voice goes on: the suspended timers run their remaining time. False: the board was not paused. */
  resume(timers: readonly V2HoldTimer[]): boolean {
    if (!this.paused) return false;
    this.paused = false;
    const now = this.clock.now();
    for (const t of timers) {
      if (t.leftMs === null || t.timer) continue;
      t.timer = this.clock.setTimer(t.fire, t.leftMs); t.dueAtMs = now + t.leftMs; t.leftMs = null;
    }
    return true;
  }
}

/** Whether a sayWith item placed with sentence `idx` waits (TutorVoiceV2 placeBoard): its sentence has not begun, or a page turn is
 *  waiting (never in the opening reply); Task 7y: or the voice is paused (`holding`), whatever else. */
export function v2PlaceHold(a: { idx: number; started: number; pageHeld: boolean; opening: boolean; holding: boolean }): boolean {
  return (((a.idx > 0 && a.started <= a.idx) || a.pageHeld) && !a.opening) || a.holding;
}

/** On a confirmed barge-in (TutorVoiceV2 dropBoard): what of the held items still goes up and what is dropped. A problem card whose
 *  sentence had begun is the task the reply set and goes up, with the pages held before it; everything else held is dropped. */
export function v2BoardDropSplit<T extends { idx: number; what?: string; isPage?: boolean }>(held: readonly T[], started: number): { kept: T[]; lost: T[] } {
  const reached = (h: T) => /^show_problem:/.test(h.what ?? '') && started > h.idx;
  const firstCard = held.findIndex(reached);
  const kept = held.filter((h, i) => reached(h) || (!!h.isPage && firstCard >= 0 && i < firstCard));
  return { kept, lost: held.filter((h) => !kept.includes(h)) };
}
