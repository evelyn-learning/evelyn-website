/**
 * TTS self-voice script buffer — pure lifecycle helpers (echo-fix V2,
 * 2026-07-15).
 *
 * The perception self-voice defence (perception-classifier.ts `scoreSelfVoice`)
 * compares each incoming student transcript against a rolling buffer of the
 * tutor's own recent TTS sentences, gated by a timing window
 * `[spokenStartedAt - lead, spokenEndedAt + trail]`. Before V2 the buffer was
 * stamped at DISPATCH time (`spokenStartedAt == spokenEndedAt == dispatch`),
 * but in a long multi-sentence turn a sentence can PLAY several seconds after
 * it was dispatched. The window therefore closed long before the sentence's
 * echo (perception latency 6–16s) arrived, and verbatim echoes sailed through
 * (incident 2026-07-15 "Good question." World-session).
 *
 * V2 stamps the window at REAL playback time: the audio queue
 * (useOpenAIRealtime.ts) fires per-sentence playback start/end/skip callbacks
 * that flow here by `id`. This module is the pure, unit-testable core of that
 * bookkeeping so the React component only wires refs.
 *
 * Run: npm run test:perception-classifier
 */
import type { RecentTtsScript } from './perception-classifier';

/** Playback lifecycle phases reported by the audio queue.
 *  - 'start': the sentence's first audio chunk began playing.
 *  - 'end':   the sentence's audio finished (naturally or cut by barge-in).
 *  - 'skip':  the sentence never played — TTS fetch failed terminally, or a
 *             barge-in drained it while still queued (never started). */
export type PlaybackPhase = 'start' | 'end' | 'skip';

export interface PlaybackStamp {
  /** Matches RecentTtsScript.id assigned at dispatch. */
  scriptId: number;
  phase: PlaybackPhase;
  /** Date.now() at the moment the phase occurred. */
  atMs: number;
}

/**
 * Push a freshly-dispatched TTS sentence onto the rolling buffer.
 *
 * `spokenStartedAt`/`spokenEndedAt` seed to dispatch time as a FALLBACK — if
 * the sentence plays (the common case) the real playback callbacks overwrite
 * them via `applyPlaybackStamp`; if a playback callback is somehow missed the
 * entry degrades to the old dispatch-time behaviour rather than to garbage.
 *
 * Trims entries older than `retentionMs` off the front (by start time).
 * Returns the created entry (for the caller to read its id), or null for
 * empty text.
 */
export function pushTtsScript(
  buffer: RecentTtsScript[],
  text: string,
  id: number,
  dispatchMs: number,
  retentionMs = 60_000,
): RecentTtsScript | null {
  const trimmed = (text ?? '').trim();
  if (!trimmed) return null;
  const entry: RecentTtsScript = {
    id,
    text: trimmed,
    spokenStartedAt: dispatchMs,
    spokenEndedAt: dispatchMs,
  };
  buffer.push(entry);
  const cutoff = dispatchMs - retentionMs;
  while (buffer.length > 0 && buffer[0].spokenStartedAt < cutoff) {
    buffer.shift();
  }
  return entry;
}

/**
 * Apply a real-playback lifecycle stamp to the matching buffer entry (by id).
 * Returns true if an entry matched, false if the id is unknown (already
 * trimmed out of the rolling buffer, or never pushed).
 *
 * Policy:
 *  - 'start': stamp the REAL playback-start and set `spokenEndedAt = null`
 *    (the classifier treats null-end as still live in the speaker→mic loop,
 *    so `winEnd = now + trail` until 'end' arrives).
 *  - 'end':   stamp the REAL playback-end (natural finish OR barge-in cut —
 *    either way the audio the mic could echo stopped at `atMs`).
 *  - 'skip':  the sentence never reached the speaker → ZERO the window so a
 *    never-heard line can't spuriously match real student speech that happens
 *    to overlap its stale dispatch-time window and share vocabulary.
 *
 * An 'end' arriving for an entry already zeroed by 'skip' is ignored (keeps it
 * zeroed) — defends against a stray end after a drain.
 */
export function applyPlaybackStamp(
  buffer: RecentTtsScript[],
  stamp: PlaybackStamp,
): boolean {
  const entry = buffer.find((e) => e.id === stamp.scriptId);
  if (!entry) return false;
  switch (stamp.phase) {
    case 'start':
      entry.spokenStartedAt = stamp.atMs;
      entry.spokenEndedAt = null;
      break;
    case 'end':
      // Don't resurrect a skipped/drained-before-start entry.
      if (entry.spokenStartedAt === 0) break;
      entry.spokenEndedAt = stamp.atMs;
      break;
    case 'skip':
      entry.spokenStartedAt = 0;
      entry.spokenEndedAt = 0;
      break;
  }
  return true;
}
