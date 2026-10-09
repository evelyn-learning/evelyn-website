/** Round 4 (E5): when the text-mode tutor speaks first. Round 2: a homework
 *  session once its problems are loaded. Round 4: ANY goal when the host sets
 *  the `tutor_opens` claim — once the plan is loaded, or at once when there is
 *  no plan. Voice never (the mic tap starts it). Pure. */
export function textKickoffReady(i: {
  sessionMode: string;
  sessionGoal: string;
  tutorOpens: boolean;
  homeworkReady: boolean;
  hasPlanId: boolean;
  planLoaded: boolean;
}): boolean {
  if (i.sessionMode !== 'text') return false;
  if (i.sessionGoal === 'homework-help' && i.homeworkReady) return true;
  if (!i.tutorOpens) return false;
  return i.hasPlanId ? i.planLoaded : true;
}

/** Same opener the mic-tap start sends: a plan → [start lesson], else [start session]. */
export function textKickoffMessage(hasPlan: boolean): '[start lesson]' | '[start session]' {
  return hasPlan ? '[start lesson]' : '[start session]';
}

/** The two session-start kickoffs — the only turns that are "the opening turn". */
export function isKickoffMessage(t: string | null | undefined): boolean {
  const s = (t ?? '').trim();
  return s === '[start lesson]' || s === '[start session]';
}

/**
 * A typed message submitted in the composer while a brain turn is in flight.
 *
 * 2026-10-08 (portal-09624999): the automatic opening turn was dispatched at
 * 0.4 s; the student typed at 8.0 s, before any of it had been shown. The
 * composer cleared the busy flag WITHOUT aborting that turn, so the typed
 * message was neither queued nor a replacement: two brain turns overlapped
 * (0.4–11.6 s, 8.1–19.7 s) and the student got two tutor messages back to
 * back, the first unrelated to what they had written.
 *
 *  - 'dispatch'            nothing in flight: sent as before.
 *  - 'supersede_opening'   the opening turn is in flight and has shown
 *                          nothing: abort it; the student's message is the
 *                          first turn (it carries the opening directive, as
 *                          on the "student started first" stand-down).
 *  - 'queue_after_opening' the opening turn has already shown a sentence:
 *                          leave it running and the busy flag set, so the
 *                          message queues and runs right after it.
 *  - 'force_clear'         any other turn in flight, a stale busy flag, or
 *                          voice: the busy flag is force-cleared, as before.
 * Pure.
 */
export type TypedDuringTurn = 'dispatch' | 'supersede_opening' | 'queue_after_opening' | 'force_clear';

export function decideTypedDuringTurn(i: {
  sessionMode: string;
  brainBusy: boolean;
  /** Trigger text of the brain turn in flight; null when none is on record. */
  inFlightTranscript: string | null;
  /** A sentence of that turn has reached the student. */
  inFlightShown: boolean;
}): TypedDuringTurn {
  if (!i.brainBusy) return 'dispatch';
  if (i.sessionMode !== 'text' || !isKickoffMessage(i.inFlightTranscript)) return 'force_clear';
  return i.inFlightShown ? 'queue_after_opening' : 'supersede_opening';
}

// ── 2026-10-09: a typed first message while the homework plan is loading ───
//
// Local end-to-end run, scenario C. A text homework session: the plan (with
// the enumerated problems) was requested when the session mounted and arrived
// 1.3 s later; the student typed 0.75 s before it did. The message was
// dispatched at once. That turn carried no plan and no homework block, so
//  - the client latched the tool scope to "full" (ai/prompt-cache.ts
//    `nextToolScope`: a turn with no plan is untrusted, and the latch only
//    widens) — every turn of the session then sent the unfiltered tools array;
//  - turn 2, now with the homework block, added `set_current_problem` to that
//    array — a different tools prefix, so the whole shared prompt cache was
//    written a second time.
// The plan was already on its way. The message now waits for it, briefly.

/** How long a typed message waits for a homework plan that is being fetched. */
export const TYPED_HOMEWORK_WAIT_MS = 4000;

export interface TypedBeforeHomework {
  /** 'dispatch' — send now. 'wait' — hold and ask again. 'timeout' — the
   *  bound is reached: send as before, and record it. */
  action: 'dispatch' | 'wait' | 'timeout';
  reason:
    | 'flag-off' | 'not-text' | 'not-homework' | 'no-plan-requested'
    | 'homework-ready' | 'plan-settled-without-homework' | 'plan-loading' | 'timeout';
}

/**
 * Should a typed message be held for the homework plan? Only when there is
 * something to wait FOR: a text homework session whose plan request is still
 * in flight. Pure.
 */
export function decideTypedBeforeHomeworkReady(i: {
  /** TUTOR_TYPED_WAITS_FOR_HOMEWORK. */
  enabled: boolean;
  sessionMode: string;
  sessionGoal: string;
  /** The session was given a plan id (its fetch starts on mount). */
  hasPlanId: boolean;
  /** That fetch has finished — loaded, failed, or not a usable plan. */
  planLoadSettled: boolean;
  /** The homework problems are in hand. */
  homeworkReady: boolean;
  /** How long this message has been held so far. */
  waitedMs: number;
  /** Unset ⇒ TYPED_HOMEWORK_WAIT_MS. */
  timeoutMs?: number;
}): TypedBeforeHomework {
  if (i.enabled !== true) return { action: 'dispatch', reason: 'flag-off' };
  if (i.sessionMode !== 'text') return { action: 'dispatch', reason: 'not-text' };
  if (i.sessionGoal !== 'homework-help') return { action: 'dispatch', reason: 'not-homework' };
  if (i.homeworkReady) return { action: 'dispatch', reason: 'homework-ready' };
  if (!i.hasPlanId) return { action: 'dispatch', reason: 'no-plan-requested' };
  if (i.planLoadSettled) return { action: 'dispatch', reason: 'plan-settled-without-homework' };
  if (i.waitedMs >= (i.timeoutMs ?? TYPED_HOMEWORK_WAIT_MS)) return { action: 'timeout', reason: 'timeout' };
  return { action: 'wait', reason: 'plan-loading' };
}

export interface TypedHold {
  /** Send now, or hold until the decision says otherwise. Messages typed
   *  during one wait are released together, in the order typed. */
  submit(send: () => void): void;
  /** How many messages are held. */
  held(): number;
  /** Stop waiting and drop what is held (unmount). */
  cancel(): void;
}

/**
 * The hold around `decideTypedBeforeHomeworkReady`: one waiter, however many
 * messages. The clock and the timer are injected, so it runs without a DOM.
 * A decision that throws sends the message — a typed message is never lost
 * to this.
 */
export function createTypedHold(deps: {
  decide: (waitedMs: number) => TypedBeforeHomework;
  now: () => number;
  /** Call `fn` repeatedly; returns the stop function. */
  every: (fn: () => void) => () => void;
  /** The visible "thinking" state for a held message. */
  onHeld: (held: boolean) => void;
  onEvent: (type: 'typed_held_for_homework' | 'typed_homework_released' | 'typed_homework_wait_timeout', message: string) => void;
}): TypedHold {
  let queue: Array<() => void> = [];
  let stop: (() => void) | null = null;
  let since = 0;
  const decide = (waitedMs: number): TypedBeforeHomework => {
    try { return deps.decide(waitedMs); } catch { return { action: 'dispatch', reason: 'flag-off' }; }
  };
  const release = (d: TypedBeforeHomework) => {
    const waited = Math.max(0, deps.now() - since);
    const sends = queue;
    queue = [];
    if (stop) { stop(); stop = null; }
    deps.onHeld(false);
    if (d.action === 'timeout') deps.onEvent('typed_homework_wait_timeout', `waited=${waited}ms held=${sends.length} — dispatched without the homework context`);
    else deps.onEvent('typed_homework_released', `${d.reason} waited=${waited}ms held=${sends.length}`);
    for (const send of sends) { try { send(); } catch { /* the sender logs its own failures */ } }
  };
  return {
    submit(send) {
      if (queue.length > 0) { queue.push(send); return; }
      const first = decide(0);
      if (first.action !== 'wait') { send(); return; }
      queue.push(send);
      since = deps.now();
      deps.onHeld(true);
      deps.onEvent('typed_held_for_homework', `${first.reason} — waiting up to the bound for the problems`);
      stop = deps.every(() => {
        if (queue.length === 0) return;
        const d = decide(Math.max(0, deps.now() - since));
        if (d.action !== 'wait') release(d);
      });
    },
    held: () => queue.length,
    cancel() {
      queue = [];
      if (stop) { stop(); stop = null; }
    },
  };
}
