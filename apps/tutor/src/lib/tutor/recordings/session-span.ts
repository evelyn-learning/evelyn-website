/**
 * The REAL span of a tutor session (resumed-session fix, 2026-10-03).
 *
 * `TutorSession.duration` is $set from the client on every save and each page
 * mount measures it from its OWN start, so for a resumed session it covers
 * only the latest attempt while `startedAt` stays pinned to the first. Its
 * meaning is deliberately left alone (partner-facing readers exist); this
 * module answers the two questions tooling actually has instead:
 *
 *   wallSpanSec — first attempt's start → last attempt's end (the replay
 *                 timeline's real length; what transcript offsets run to).
 *   activeSec   — the attempts' spans summed, excluding the pauses between
 *                 them (what the audio tracks should add up to).
 *
 * Sources, best first: the additive `attemptSpans` field (session-usage
 * route), attempt boundaries derived from debug events (legacy sessions),
 * then `duration` / `endedAt − startedAt` for a single-attempt session.
 * Pure; pinned by scripts/test-attempt-anchors.ts.
 */
import { deriveLegacyAttempts, type LegacyDebugEvent } from './attempt-anchors';
import { RESUME_DETECT_SLACK_MS } from './compressed-timeline';

export interface AttemptSpan {
  /** Epoch ms of this attempt's (page mount's) start. */
  startedAtMs: number;
  /** Seconds this attempt ran, as last reported by that mount. */
  durationSec: number;
}

export interface SessionSpan {
  resumed: boolean;
  /** Number of attempts when known. */
  attemptCount: number | null;
  wallSpanSec: number | null;
  /** null = resumed but the per-attempt spans could not be recovered. */
  activeSec: number | null;
  source: 'attempt-spans' | 'debug-events' | 'overhang' | 'duration' | 'ended-at' | 'none';
}

/** Tolerant read of the stored `attemptSpans` array (Dates or ISO strings). */
export function parseAttemptSpans(raw: unknown): AttemptSpan[] {
  if (!Array.isArray(raw)) return [];
  const out: AttemptSpan[] = [];
  for (const r of raw) {
    const startedAt = (r as { startedAt?: unknown } | null)?.startedAt;
    const duration = (r as { duration?: unknown } | null)?.duration;
    const startedAtMs = startedAt instanceof Date ? startedAt.getTime() : typeof startedAt === 'string' || typeof startedAt === 'number' ? new Date(startedAt).getTime() : NaN;
    if (!Number.isFinite(startedAtMs) || typeof duration !== 'number' || !Number.isFinite(duration) || duration < 0) continue;
    out.push({ startedAtMs, durationSec: duration });
  }
  return out.sort((a, b) => a.startedAtMs - b.startedAtMs);
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
  const spans = parseAttemptSpans(input.attemptSpans);
  const spansComplete = spans.length > 0 && startedAtMs != null && Math.abs(spans[0].startedAtMs - startedAtMs) <= RESUME_DETECT_SLACK_MS;
  if (spansComplete && startedAtMs != null) {
    const endMs = Math.max(...spans.map((s) => s.startedAtMs + s.durationSec * 1000));
    return {
      resumed: spans.length > 1,
      attemptCount: spans.length,
      wallSpanSec: (endMs - startedAtMs) / 1000,
      activeSec: spans.reduce((n, s) => n + s.durationSec, 0),
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
  //    spans exist without the first.
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
