/**
 * The REAL span of a tutor session (resumed-session fix, 2026-10-03).
 *
 * `startedAt` is pinned to a session's first attempt (page mount). `duration`
 * has had two meanings: for sessions written before the `attemptSpans` field
 * it is whatever the LAST mount measured from its own start (latest attempt
 * only, for a resumed embed session); for sessions written with the field it
 * is the cumulative ACTIVE seconds across attempts (session-usage route, see
 * active-seconds.ts). Neither is a wall span, so nothing here infers
 * "resumed" or the wall end from `duration` once spans are recorded — this
 * module answers the two questions tooling actually has:
 *
 *   wallSpanSec — first attempt's start → last attempt's end (the replay
 *                 timeline's real length; what transcript offsets run to).
 *   activeSec   — the attempts' spans summed, excluding the pauses between
 *                 them (what the audio tracks should add up to).
 *
 * Sources, best first: the additive `attemptSpans` field (session-usage
 * route), attempt boundaries derived from debug events (legacy sessions),
 * then `duration` / `endedAt − startedAt` for a single-attempt session.
 * Pure; pinned by scripts/test-attempt-anchors.ts and
 * scripts/test-session-active-seconds.ts.
 */
import { deriveLegacyAttempts, type LegacyDebugEvent } from './attempt-anchors';
import { RESUME_DETECT_SLACK_MS } from './compressed-timeline';
import { dedupeAttemptSpans, parseAttemptSpans, sumActiveSeconds, type AttemptSpan } from './active-seconds';

export { parseAttemptSpans, type AttemptSpan };

export interface SessionSpan {
  resumed: boolean;
  /** Number of attempts when known. */
  attemptCount: number | null;
  wallSpanSec: number | null;
  /** null = resumed but the per-attempt spans could not be recovered. */
  activeSec: number | null;
  source: 'attempt-spans' | 'debug-events' | 'overhang' | 'duration' | 'ended-at' | 'none';
}

export function resolveSessionSpan(input: {
  startedAtMs: number | null;
  endedAtMs?: number | null;
  durationSec?: number | null;
  attemptSpans?: unknown;
  /** Debug events with offsets (ms from startedAt) — legacy derivation. */
  events?: LegacyDebugEvent[];
  /** Offsets (ms from startedAt) of every timestamped item. */
  itemOffsetsMs?: number[];
}): SessionSpan {
  const { startedAtMs } = input;
  const durationSec = typeof input.durationSec === 'number' && input.durationSec > 0 ? input.durationSec : null;
  const endedSpanSec =
    startedAtMs != null && input.endedAtMs != null && input.endedAtMs > startedAtMs ? (input.endedAtMs - startedAtMs) / 1000 : null;
  const items = (input.itemOffsetsMs ?? []).filter((v) => Number.isFinite(v));
  const lastItemMs = items.length > 0 ? Math.max(...items) : null;

  // 1. Recorded per-attempt spans. Only trusted as the WHOLE story when the
  //    first span starts at the session origin — a session whose first
  //    attempt predates the field has spans for its later attempts only.
  const spans = dedupeAttemptSpans(parseAttemptSpans(input.attemptSpans));
  const spansComplete = spans.length > 0 && startedAtMs != null && Math.abs(spans[0].startedAtMs - startedAtMs) <= RESUME_DETECT_SLACK_MS;
  if (spansComplete && startedAtMs != null) {
    const endMs = Math.max(...spans.map((s) => s.startedAtMs + s.durationSec * 1000));
    return {
      resumed: spans.length > 1,
      attemptCount: spans.length,
      wallSpanSec: (endMs - startedAtMs) / 1000,
      activeSec: sumActiveSeconds(spans),
      source: 'attempt-spans',
    };
  }

  // 2. Legacy: attempt boundaries from the debug-event trail.
  const derived = input.events ? deriveLegacyAttempts({ events: input.events, itemOffsetsMs: items }) : null;
  if (derived && derived.length > 1) {
    return {
      resumed: true,
      attemptCount: derived.length,
      wallSpanSec: derived[derived.length - 1].wallEndMs / 1000,
      activeSec: derived.reduce((n, a) => n + (a.wallEndMs - a.wallStartMs), 0) / 1000,
      source: 'debug-events',
    };
  }

  // 3. Resumed, but the boundaries are unknowable: items run well past
  //    `duration` (the same test the replay timeline uses), or later-attempt
  //    spans exist without the first. The overhang test only ever decides for
  //    a session with NO recorded spans, whose `duration` is the pre-field
  //    last-mount figure — a cumulative `duration` always comes with spans,
  //    which are decided above (or by `spans.length > 0` here).
  const overhang = durationSec != null && lastItemMs != null && lastItemMs > durationSec * 1000 + RESUME_DETECT_SLACK_MS;
  if (overhang || spans.length > 0) {
    const spanEndSec = spans.length > 0 && startedAtMs != null
      ? (Math.max(...spans.map((sp) => sp.startedAtMs + sp.durationSec * 1000)) - startedAtMs) / 1000
      : null;
    const candidates = [lastItemMs != null ? lastItemMs / 1000 : null, endedSpanSec, spanEndSec].filter((v): v is number => v != null);
    return {
      resumed: true,
      attemptCount: null,
      wallSpanSec: candidates.length > 0 ? Math.max(...candidates) : null,
      activeSec: null,
      source: 'overhang',
    };
  }

  // 4. Single attempt: `duration` means what it says.
  if (durationSec != null) return { resumed: false, attemptCount: 1, wallSpanSec: durationSec, activeSec: durationSec, source: 'duration' };
  if (endedSpanSec != null) return { resumed: false, attemptCount: 1, wallSpanSec: endedSpanSec, activeSec: endedSpanSec, source: 'ended-at' };
  return { resumed: false, attemptCount: null, wallSpanSec: null, activeSec: null, source: 'none' };
}
