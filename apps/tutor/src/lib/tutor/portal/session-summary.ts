/**
 * Portal session summary (contract v1.16.0) — pure helpers for
 * GET /api/portal/v1/sessions/summary.
 *
 * A partner's admin dashboard cannot compute turn counts, board items, brain
 * cost or geolocation from its own rows; those facts live only on the
 * engine's TutorSession. This module reduces a session document to the
 * contract's `SessionSummary` shape. It deliberately never copies `clientIp`:
 * the coarse `location` captured at session start is the most a partner gets.
 */
import { SESSION_SUMMARY_MAX_IDS, type SessionSummary } from '@evelyn/portal-contract/v1';

export interface SummarizableSession {
  sessionId: string;
  status: 'active' | 'completed' | 'abandoned';
  startedAt: Date | string;
  endedAt?: Date | string | null;
  duration?: number | null;
  transcript?: Array<{ role: string; timestamp?: Date | string | null }> | null;
  whiteboardItemCount?: number | null;
  whiteboardCommands?: unknown[] | null;
  estimatedCost?: number | null;
  location?: { city?: string; region?: string; country?: string } | null;
}

/** Parse the `ids` query param: comma-separated, trimmed, de-duplicated.
 *  Returns null when absent/empty or over the contract cap — the route maps
 *  null to 400 so a partner can't request unbounded scans. */
export function parseSummaryIds(raw: string | null): string[] | null {
  if (!raw) return null;
  const ids = Array.from(new Set(raw.split(',').map((s) => s.trim()).filter(Boolean)));
  if (ids.length === 0 || ids.length > SESSION_SUMMARY_MAX_IDS) return null;
  return ids;
}

const iso = (d: Date | string): string => (d instanceof Date ? d : new Date(d)).toISOString();

/** Longest silence still counted as tutoring. Beyond this the student is
 *  presumed gone (tab left open, or the partner reused the session id on a
 *  later day — both seen on prod). */
export const ACTIVE_GAP_CAP_SEC = 10 * 60;

/** Active tutoring seconds: the sum of gaps between consecutive transcript
 *  messages, each capped. Immune to idle tabs (no messages ⇒ 0), to a resume
 *  that overwrote `duration` with its last leg (every message counts), and to
 *  a session id reused days later (the day-long gap counts as ten minutes). */
export function activeSeconds(transcript: Array<{ timestamp?: Date | string | null }>): number {
  const ts = transcript
    .map((m) => (m.timestamp ? new Date(m.timestamp).getTime() : NaN))
    .filter((t) => Number.isFinite(t))
    .sort((a, b) => a - b);
  if (ts.length < 2) return 0;
  let total = 0;
  for (let i = 1; i < ts.length; i += 1) total += Math.min(Math.max(0, (ts[i]! - ts[i - 1]!) / 1000), ACTIVE_GAP_CAP_SEC);
  return Math.round(total);
}

export function summarizeTutorSession(s: SummarizableSession): SessionSummary {
  const transcript = s.transcript ?? [];
  const studentTurns = transcript.filter((m) => m.role === 'student').length;
  const tutorTurns = transcript.filter((m) => m.role === 'tutor').length;
  // whiteboardItemCount is maintained on the doc; fall back to the persisted
  // command list for older rows where the counter was never written.
  const boardItems = s.whiteboardItemCount && s.whiteboardItemCount > 0
    ? s.whiteboardItemCount
    : (s.whiteboardCommands?.length ?? 0);
  const location = s.location && (s.location.city || s.location.region || s.location.country)
    ? {
        ...(s.location.city ? { city: s.location.city } : {}),
        ...(s.location.region ? { region: s.location.region } : {}),
        ...(s.location.country ? { country: s.location.country } : {}),
      }
    : undefined;
  return {
    sessionId: s.sessionId,
    status: s.status,
    startedAt: iso(s.startedAt),
    ...(s.endedAt ? { endedAt: iso(s.endedAt) } : {}),
    // durationSec = ACTIVE seconds from the transcript when it has ≥ 2 stamped
    // messages; the raw `duration` field only when there is no transcript to
    // measure from (and never for an empty session).
    ...(transcript.length >= 2
      ? { durationSec: activeSeconds(transcript) }
      : typeof s.duration === 'number' && s.duration >= 0 && transcript.length > 0
        ? { durationSec: Math.round(s.duration) }
        : {}),
    studentTurns,
    tutorTurns,
    boardItems,
    estimatedCostUsd: Math.max(0, s.estimatedCost ?? 0),
    ...(location ? { location } : {}),
  };
}
