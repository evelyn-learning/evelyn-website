/**
 * Per-attempt audio anchors (resumed-session replay fix, 2026-10-03).
 *
 * A session that is RESUMED (page reload / "Continue lesson", same sessionId)
 * records several ATTEMPTS into the same `{role}.pcm16`. Within an attempt
 * the recorder silence-pads to wall time (track-align.ts), so audio is
 * wall-aligned relative to THAT attempt's origin — but each new mount restarts
 * its samples-written counter at 0 and the server appends at the existing end
 * of file. So the file is:
 *
 *   [attempt 1, wall-aligned from T0₁][attempt 2, wall-aligned from T0₂]…
 *
 * with the wall gap BETWEEN attempts collapsed. Replay used to assume either
 * "sample 0 == startedAt, wall time throughout" (single attempt) or
 * "concatenated active time, 8s gap cap everywhere" (resumed). The second is
 * wrong inside every attempt (session portal audit 2026-10: audio lagged the
 * timeline by 37s after one minute, 937s by the end).
 *
 * An ANCHOR pins one attempt: the wall-clock origin the recorder used (T0)
 * and the byte offset in the file where that attempt's audio begins. With
 * anchors the wall→audio map is exact and piecewise:
 *
 *   audio(w) = byteOffsetₖ + (w − T0ₖ)   for the attempt k that covers w
 *
 * and "no audio" (null) for wall moments no attempt covers (the collapsed
 * inter-attempt gap, or a track that stopped early).
 *
 * Everything here is free of I/O — the session-audio route (anchor bookkeeping), the
 * replay timeline (mapping) and the session inspector all share it, and
 * scripts/test-attempt-anchors.ts pins it.
 */

/** Sidecar form (`{role}.meta.json` → `attempts`). Absolute values. */
export interface AttemptAnchor {
  /** Epoch ms of the recorder origin (T0) for this attempt. */
  wallStartMs: number;
  /** Byte offset in `{role}.pcm16` where this attempt's audio begins. */
  byteOffset: number;
}

/** Replay form: one attempt of one track, session-relative. */
export interface AudioAttempt {
  /** Wall ms from the session's `startedAt` at which this attempt's audio
   *  origin sits (may be slightly negative on clock skew). */
  wallStartMs: number;
  /** Offset (ms) in the track file where this attempt's audio begins. */
  audioStartMs: number;
}

/** A legacy-derived attempt also knows where its activity ended. */
export interface DerivedAttempt extends AudioAttempt {
  /** Wall ms (from startedAt) of the last recorded item in this attempt. */
  wallEndMs: number;
}

/** Tolerant sidecar parse: anything malformed ⇒ no anchors (legacy path). */
export function parseAttemptAnchors(raw: unknown): AttemptAnchor[] {
  if (!Array.isArray(raw)) return [];
  const out: AttemptAnchor[] = [];
  for (const a of raw) {
    const wallStartMs = (a as AttemptAnchor | null)?.wallStartMs;
    const byteOffset = (a as AttemptAnchor | null)?.byteOffset;
    if (typeof wallStartMs !== 'number' || typeof byteOffset !== 'number') return [];
    if (!Number.isFinite(wallStartMs) || !Number.isFinite(byteOffset) || byteOffset < 0) return [];
    // Byte offsets must strictly ascend — a sidecar that violates this is
    // corrupt, and a wrong map is worse than the legacy fallback.
    if (out.length > 0 && byteOffset <= out[out.length - 1].byteOffset) return [];
    out.push({ wallStartMs, byteOffset });
  }
  return out;
}

/**
 * Server-side anchor bookkeeping, evaluated for every incoming audio chunk
 * BEFORE it is appended.
 *
 * The client sends, with each chunk, its recorder origin (`attemptStartMs`)
 * and how many bytes of THIS attempt it has successfully uploaded so far
 * (`attemptBytesBefore`). `fileBytes − attemptBytesBefore` is therefore where
 * this attempt begins in the file — derivable from ANY chunk, so a lost or
 * rejected first chunk (or a failed sidecar write) heals on the next one
 * instead of leaving the attempt un-anchored forever.
 *
 * Returns the new anchor list, or null when nothing changes.
 */
export function nextAttemptAnchors(
  existing: AttemptAnchor[],
  chunk: { attemptStartMs: number | null; attemptBytesBefore: number | null; fileBytes: number },
): AttemptAnchor[] | null {
  const { attemptStartMs, attemptBytesBefore, fileBytes } = chunk;
  // Old clients (cached JS from before this change) send neither value: no
  // anchor, legacy behaviour.
  if (attemptStartMs == null || attemptBytesBefore == null) return null;
  if (!Number.isFinite(attemptStartMs) || attemptStartMs <= 0) return null;
  if (!Number.isFinite(attemptBytesBefore) || attemptBytesBefore < 0) return null;
  const byteOffset = fileBytes - attemptBytesBefore;
  if (!Number.isFinite(byteOffset) || byteOffset < 0) return null; // file shorter than the client believes — don't guess
  const candidate: AttemptAnchor = { wallStartMs: attemptStartMs, byteOffset };
  const last = existing[existing.length - 1];
  if (!last) return [candidate];
  // A straggler from an OLDER attempt (late keepalive flush landing after the
  // remount's first chunk) must not mint an anchor.
  if (candidate.wallStartMs < last.wallStartMs) return null;
  if (candidate.byteOffset < last.byteOffset) return null;
  if (candidate.byteOffset === last.byteOffset) {
    // Same position: the same attempt (the common case — every chunk after
    // the first), or a newer attempt replacing one that never got a byte in.
    if (candidate.wallStartMs === last.wallStartMs) return null;
    return [...existing.slice(0, -1), candidate];
  }
  // Same origin, later in the file. Two things look like this:
  //  - a genuine same-origin remount (a new recorder handed the same T0): its
  //    counter restarted, so it reports `attemptBytesBefore === 0`;
  //  - a LOST RESPONSE: the server appended a chunk but the client saw the
  //    request fail and rolled its counter back (useAudioRecorder), so the
  //    next chunk reports one chunk too few and `fileBytes − before` lands
  //    one chunk past the real origin. Minting an anchor there would give the
  //    real attempt only the first chunk-length of wall time (wallToAudioMs:
  //    earliest covering attempt wins) and shift everything before the hiccup.
  // Only the first may mint. (Cost: a same-origin remount whose sidecar write
  // failed on its first chunk no longer heals from a later chunk — it stays
  // un-anchored, which is the lesser error.)
  if (candidate.wallStartMs === last.wallStartMs && attemptBytesBefore !== 0) return null;
  return [...existing, candidate];
}

/** Client clocks run ahead of the server's by seconds, occasionally a minute
 *  or two — an origin further in the future than this is not a real one. */
export const ANCHOR_MAX_FUTURE_MS = 5 * 60_000;
/** A session can be resumed for 30 days, and an attempt's origin is never
 *  older than the session — so nothing real is older than this. */
export const ANCHOR_MAX_AGE_MS = 30 * 24 * 3_600_000;

/**
 * Bounds check on the anchor params of a chunk POST. They arrive on an
 * UNAUTHENTICATED request, and anchors only ever move forward
 * (nextAttemptAnchors rejects an older `wallStartMs`), so one request with a
 * far-future `attemptStartMs` would make every later real anchor fail that
 * check — the bound on the server clock is what stops it.
 *
 * Returns the params when plausible, else null: the caller then treats the
 * chunk as coming from a client that sent none (audio still appended, no
 * anchor bookkeeping) — exactly the old-client path.
 */
export function saneAnchorParams(p: {
  attemptStartMs: number | null;
  attemptBytesBefore: number | null;
  /** Size of `{role}.pcm16` before this chunk is appended. */
  fileBytes: number;
  /** Server clock (epoch ms). */
  nowMs: number;
}): { attemptStartMs: number; attemptBytesBefore: number } | null {
  const { attemptStartMs, attemptBytesBefore, fileBytes, nowMs } = p;
  if (attemptStartMs == null || attemptBytesBefore == null) return null;
  if (!Number.isFinite(attemptStartMs) || attemptStartMs <= 0) return null;
  if (!Number.isFinite(nowMs)) return null;
  if (attemptStartMs > nowMs + ANCHOR_MAX_FUTURE_MS) return null;
  if (attemptStartMs < nowMs - ANCHOR_MAX_AGE_MS) return null;
  // PCM16: whole samples only, and an attempt cannot have uploaded more than
  // the file holds.
  if (!Number.isInteger(attemptBytesBefore) || attemptBytesBefore < 0 || attemptBytesBefore % 2 !== 0) return null;
  if (!Number.isFinite(fileBytes) || attemptBytesBefore > fileBytes) return null;
  return { attemptStartMs, attemptBytesBefore };
}

/** `run(key, fn)`: runs `fn` after every earlier `fn` for the same key has
 *  settled, and resolves/rejects with its result. */
export interface KeyedSerializer {
  <T>(key: string, fn: () => Promise<T> | T): Promise<T>;
  /** Keys with work queued or running (tests: idle keys are released). */
  pendingKeys(): number;
}

/**
 * In-process per-key promise-chain mutex. The session-audio route uses one,
 * keyed by `sessionDir + role`, around "stat → read sidecar → write sidecar →
 * append" so a chunk POST and a finalize for the same track cannot interleave
 * their read-modify-write and drop each other's sidecar fields (`attempts`
 * vs `finalizedAt`/`totalChunks`), and two chunks cannot both measure the
 * same pre-append file size. In-process is sufficient: the tutor app is a
 * single Node process (pm2 fork mode).
 *
 * A section that throws rejects only its own caller; the queue carries on.
 */
export function createKeyedSerializer(): KeyedSerializer {
  const tails = new Map<string, Promise<unknown>>();
  const run = <T>(key: string, fn: () => Promise<T> | T): Promise<T> => {
    const prev = tails.get(key) ?? Promise.resolve();
    const result = prev.then(fn, fn);
    // The stored tail never rejects, so one failure cannot poison the chain.
    const tail = result.then(() => undefined, () => undefined);
    tails.set(key, tail);
    void tail.then(() => { if (tails.get(key) === tail) tails.delete(key); });
    return result;
  };
  return Object.assign(run, { pendingKeys: () => tails.size });
}

/** Sidecar anchors → session-relative attempts for one track. A first anchor
 *  that does not start at byte 0 means earlier audio was recorded by a client
 *  that sent no anchors: that prefix is an implicit attempt on the session
 *  origin (exactly the legacy "sample 0 == startedAt" assumption). */
export function attemptsFromAnchors(anchors: AttemptAnchor[], sessionStartMs: number, sampleRate: number): AudioAttempt[] {
  if (anchors.length === 0 || !Number.isFinite(sessionStartMs) || !(sampleRate > 0)) return [];
  const bytesPerMs = (sampleRate * 2) / 1000;
  const out: AudioAttempt[] = anchors.map((a) => ({
    wallStartMs: a.wallStartMs - sessionStartMs,
    audioStartMs: a.byteOffset / bytesPerMs,
  }));
  if (out[0].audioStartMs > 0) out.unshift({ wallStartMs: 0, audioStartMs: 0 });
  return out;
}

/** Audio length (ms) of attempt `k`: up to the next attempt's start, else up
 *  to the end of file when known, else unbounded. */
export function attemptAudioLenMs(attempts: AudioAttempt[], k: number, fileMs?: number | null): number {
  if (k < attempts.length - 1) return Math.max(0, attempts[k + 1].audioStartMs - attempts[k].audioStartMs);
  if (typeof fileMs === 'number' && Number.isFinite(fileMs)) return Math.max(0, fileMs - attempts[k].audioStartMs);
  return Infinity;
}

/**
 * Wall offset (ms from startedAt) → offset in the track file (ms), or null
 * when the track holds no audio for that moment.
 *
 * The EARLIEST attempt whose audio covers `wallMs` wins. That makes the
 * normal case (attempt k+1 starts after attempt k ended) trivial, and also
 * resolves a same-origin remount (two attempts sharing one T0, the second
 * re-padding silence from T0): the first attempt owns the wall range it
 * really recorded, the later one everything after.
 *
 * The LAST attempt is treated as unbounded (the caller knows the file length
 * and already treats "past the end" as silence).
 */
export function wallToAudioMs(attempts: AudioAttempt[], wallMs: number): number | null {
  if (!Number.isFinite(wallMs)) return null;
  for (let k = 0; k < attempts.length; k++) {
    const rel = wallMs - attempts[k].wallStartMs;
    if (rel < 0) continue;
    if (rel < attemptAudioLenMs(attempts, k)) return attempts[k].audioStartMs + rel;
  }
  return null;
}

// ── Legacy recordings (no anchors in the sidecar) ──────────────────────────

/** Debug-event types logged once per page mount (embed / the /tutor page). */
const MOUNT_MARKER_TYPES = new Set(['embed_config', 'session_mint']);
/** Mount markers this close together are one mount. */
const MOUNT_CLUSTER_MS = 5_000;
/** A mount marker this close to the session origin is the FIRST mount. */
const FIRST_MOUNT_SLACK_MS = 30_000;
/** A resume tap with no mount marker in this window before it stands in for
 *  the (unlogged) mount — approximate: the recorder origin is the mount, which
 *  precedes the tap by however long the student took to tap. */
const RESUME_TAP_LOOKBACK_MS = 120_000;
/** Derived attempts must roughly explain the file. If the file is this much
 *  LONGER than the attempts predict, the "origin re-anchored at each mount"
 *  model does not fit this recording (e.g. a surface that restores the
 *  original T0 on resume) — refuse rather than mis-map. */
const DERIVE_FIT_SLACK_MS = 120_000;

export interface LegacyDebugEvent {
  type: string;
  message?: string;
  data?: Record<string, unknown> | null;
  /** Wall ms from startedAt. */
  offsetMs: number;
}

const isResumeTap = (e: LegacyDebugEvent): boolean =>
  e.type === 'start_tap' && (e.data?.action === 'resume_continue' || /action=resume_continue/.test(e.message ?? ''));

/**
 * Attempt starts (wall ms from startedAt) of every attempt AFTER the first,
 * recovered from debug events. Empty when the session shows no remount.
 */
export function deriveRemountOffsetsMs(events: LegacyDebugEvent[]): number[] {
  const mounts = events
    .filter((e) => MOUNT_MARKER_TYPES.has(e.type) && Number.isFinite(e.offsetMs))
    .map((e) => e.offsetMs)
    .sort((a, b) => a - b);
  const starts: number[] = [];
  let clusterStart = -Infinity;
  for (const m of mounts) {
    if (m - clusterStart <= MOUNT_CLUSTER_MS) continue; // same mount
    clusterStart = m;
    if (m > FIRST_MOUNT_SLACK_MS) starts.push(m);
  }
  for (const tap of events.filter(isResumeTap)) {
    if (!Number.isFinite(tap.offsetMs) || tap.offsetMs <= FIRST_MOUNT_SLACK_MS) continue;
    const covered = starts.some((s) => s <= tap.offsetMs && tap.offsetMs - s <= RESUME_TAP_LOOKBACK_MS);
    if (!covered) starts.push(tap.offsetMs);
  }
  return starts.sort((a, b) => a - b);
}

/**
 * Best-effort attempts for a recording WITHOUT anchors.
 *
 * Model (the embed surface, verified against production): every mount
 * re-anchors the recorder origin to the mount time and appends at the end of
 * file. So attempt k+1's audio begins where attempt k's ended, and attempt
 * k's audio is at most as long as its wall span.
 *
 * The one unknowable is how long attempt k's audio really is (a track ends at
 * its last flushed chunk, which can be well before the attempt's last
 * timeline item). We take the wall span (last item before the remount) as
 * the length, clamped to the file. That is exact when the track ran to the
 * end of the attempt and an OVER-estimate otherwise — later attempts then
 * play late by the difference. Returns null when nothing can be derived or
 * the model does not fit; callers keep the pre-anchor behaviour then.
 */
export function deriveLegacyAttempts(input: {
  events: LegacyDebugEvent[];
  /** Wall offsets (ms from startedAt) of every timestamped item. */
  itemOffsetsMs: number[];
  /** Track length in ms when known. */
  fileMs?: number | null;
}): DerivedAttempt[] | null {
  const starts = deriveRemountOffsetsMs(input.events);
  if (starts.length === 0) return null;
  const items = input.itemOffsetsMs.filter((v) => Number.isFinite(v)).sort((a, b) => a - b);
  const lastBefore = (limit: number, floor: number): number => {
    let best = floor;
    for (const v of items) {
      if (v >= limit) break;
      if (v > best) best = v;
    }
    return best;
  };
  const fileMs = typeof input.fileMs === 'number' && Number.isFinite(input.fileMs) ? input.fileMs : null;
  const wallStarts = [0, ...starts];
  const out: DerivedAttempt[] = [];
  let audioStartMs = 0;
  for (let k = 0; k < wallStarts.length; k++) {
    const wallStartMs = wallStarts[k];
    const limit = k < wallStarts.length - 1 ? wallStarts[k + 1] : Infinity;
    const wallEndMs = lastBefore(limit, wallStartMs);
    out.push({ wallStartMs, audioStartMs, wallEndMs });
    audioStartMs += wallEndMs - wallStartMs;
    if (fileMs !== null) audioStartMs = Math.min(audioStartMs, fileMs);
  }
  if (fileMs !== null) {
    const last = out[out.length - 1];
    const predictedEndMs = last.audioStartMs + (last.wallEndMs - last.wallStartMs);
    if (fileMs > predictedEndMs + DERIVE_FIT_SLACK_MS) return null;
  }
  return out;
}
