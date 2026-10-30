/**
 * Task 17 (GDI live, embed-1793326847152 02:35:44): a validator kill whose
 * offending sentence is a LATER one (repeat_after_correct,
 * required_phrase_missing) let the sentence already playing finish instead of
 * cutting it mid-word ("us. Your IT— got it.").
 *
 * The hook's audio queue holds PCM chunks with two parallel label arrays: the
 * sentence text and the perception scriptId of each chunk. The sentence
 * playing now owns the contiguous run of chunks at the head of the queue
 * whose labels match it (more chunks of a streamed sentence can still be
 * arriving; they carry the same labels). Everything after that run belongs to
 * other sentences and is dropped.
 */

/** Rejection actions whose offending sentence is never the first one the
 *  student hears, so the sentence in flight is innocent and may finish. */
export const SENTENCE_BOUNDARY_KILL_ACTIONS: ReadonlySet<string> = new Set([
  'repeat_after_correct',
  'required_phrase_missing',
]);

/** Cap on the wait for the in-flight sentence; on the cap the queue is
 *  hard-drained as before. */
export const SENTENCE_BOUNDARY_CAP_MS = 4000;

/** Whether a kill should let the in-flight sentence finish. */
export function shouldFinishInFlightSentence(
  action: string | undefined,
  audibleSentenceCount: number,
  flagOn = true,
): boolean {
  return flagOn && audibleSentenceCount > 0 && action != null && SENTENCE_BOUNDARY_KILL_ACTIONS.has(action);
}

export interface QueueLabels {
  /** Sentence text per queued chunk (∥ the PCM chunk queue). */
  sentences: readonly (string | undefined)[];
  /** Perception scriptId per queued chunk (∥ the PCM chunk queue). */
  scriptIds: readonly (number | undefined)[];
}

export interface BoundaryPartition {
  /** Chunks kept: the head run belonging to the current sentence. */
  keepCount: number;
  /** scriptIds of the dropped chunks that are not the current sentence's
   *  (deduped, in queue order) — they get a 'skip' playback stamp. */
  droppedScriptIds: number[];
}

/**
 * Split the queue at the end of the current sentence. A chunk belongs to the
 * current sentence when its text label equals `current.sentence` and its
 * scriptId equals `current.scriptId`; only the leading run counts (a later
 * repeat of the same text is a different utterance).
 */
export function partitionQueueAtSentenceBoundary(
  labels: QueueLabels,
  current: { sentence: string; scriptId: number | undefined },
): BoundaryPartition {
  const n = labels.sentences.length;
  let keepCount = 0;
  while (
    keepCount < n &&
    labels.sentences[keepCount] === current.sentence &&
    labels.scriptIds[keepCount] === current.scriptId
  ) {
    keepCount++;
  }
  const seen = new Set<number>();
  const droppedScriptIds: number[] = [];
  for (let i = keepCount; i < n; i++) {
    const id = labels.scriptIds[i];
    if (id == null || id === current.scriptId || seen.has(id)) continue;
    seen.add(id);
    droppedScriptIds.push(id);
  }
  return { keepCount, droppedScriptIds };
}

/** The resume snapshot excludes the sentence that finished on its own:
 *  peekSpeechQueue returns [in-flight, ...queued]. */
export function resumeTailAfterBoundary(tail: readonly string[], finishedSentence: string | null): string[] {
  if (finishedSentence && tail[0] === finishedSentence) return tail.slice(1);
  return [...tail];
}

/** Fix round 1 (m3): with no streamed tail still arriving the remaining audio
 *  is known; a sentence that cannot finish inside the cap takes the hard
 *  clear at once (waiting would cut it mid-word anyway, 4 s later). */
export function finishesWithinCap(remainingSec: number, tailLive: boolean, capMs = SENTENCE_BOUNDARY_CAP_MS): boolean {
  if (tailLive) return true;
  return remainingSec * 1000 <= capMs;
}

/** How the wait for the in-flight sentence ended. `preempted` = another
 *  clear (barge-in, end/farewell, interrupt, pause, disconnect) cut it. */
export type BoundaryOutcome = 'ended' | 'capped' | 'preempted';

export interface BoundaryDrain {
  promise: Promise<{ outcome: BoundaryOutcome; waitedMs: number }>;
  /** The sentence ended naturally. */
  ended: () => void;
  /** Something else cut the sentence. */
  preempted: () => void;
}

/**
 * The wait's state machine: settles once — on `ended`, on `preempted`, or on
 * the cap (after `onCap`, the hard drain, completes). Calls arriving while
 * the cap's hard drain runs (it preempts as a side effect) are ignored, so a
 * cap is reported as `capped`. Note: the cap is wall-clock — a barge-in
 * pause during the wait counts against it (bounded; the hard drain resumes
 * the clock).
 */
export function createBoundaryDrain(opts: {
  capMs?: number;
  onCap: () => Promise<unknown> | unknown;
  now?: () => number;
  setTimer?: (fn: () => void, ms: number) => unknown;
  clearTimer?: (t: unknown) => void;
}): BoundaryDrain {
  const now = opts.now ?? Date.now;
  const setTimer = opts.setTimer ?? ((fn: () => void, ms: number) => setTimeout(fn, ms));
  const clearTimer = opts.clearTimer ?? ((t: unknown) => clearTimeout(t as ReturnType<typeof setTimeout>));
  const startedAt = now();
  let done = false;
  let capping = false;
  let resolveFn: (v: { outcome: BoundaryOutcome; waitedMs: number }) => void = () => {};
  const promise = new Promise<{ outcome: BoundaryOutcome; waitedMs: number }>((r) => { resolveFn = r; });
  let timer: unknown = null;
  const settle = (outcome: BoundaryOutcome) => {
    if (done) return;
    done = true;
    if (timer != null) clearTimer(timer);
    resolveFn({ outcome, waitedMs: now() - startedAt });
  };
  timer = setTimer(() => {
    timer = null;
    if (done || capping) return;
    capping = true;
    Promise.resolve()
      .then(() => opts.onCap())
      .then(() => settle('capped'), () => settle('capped'));
  }, opts.capMs ?? SENTENCE_BOUNDARY_CAP_MS);
  return {
    promise,
    ended: () => { if (!capping) settle('ended'); },
    preempted: () => { if (!capping) settle('preempted'); },
  };
}

/** Fix round 1 (I1): after a sentence-boundary kill, the retry must not
 *  start when the wait was cut by something else (barge-in, end, farewell),
 *  the turn was aborted, or the session is ending / sealed. Returns the
 *  reason, or null to retry. */
export function shouldSkipRetryAfterKill(s: {
  preempted: boolean;
  aborted: boolean;
  ending: boolean;
  sealed: boolean;
}): 'preempted' | 'aborted' | 'ending' | 'sealed' | null {
  if (s.ending) return 'ending';
  if (s.sealed) return 'sealed';
  if (s.aborted) return 'aborted';
  if (s.preempted) return 'preempted';
  return null;
}

/** Fix round 2 (N1): when the retry is skipped after the in-flight sentence
 *  ENDED, the turn's text is what the student heard — this attempt's
 *  dispatched sentences up to and including the kept one (the later ones
 *  were dropped unheard). Not found ⇒ the kept sentence alone. */
export function heardTextThroughKept(dispatchedThisAttempt: readonly string[], kept: string): string {
  const i = dispatchedThisAttempt.lastIndexOf(kept);
  const heard = i >= 0 ? dispatchedThisAttempt.slice(0, i + 1) : [kept];
  return heard.map((x) => x.trim()).filter(Boolean).join(' ');
}
