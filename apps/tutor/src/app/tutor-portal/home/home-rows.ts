/** Pure helpers for the learner home (no React/Next imports so tsx can test them). */
import type { LearnerSessionRow, SummaryState } from '@/lib/tutor/portal/learner-summary-store';

export const POLL_INTERVAL_MS = 3000;
export const POLL_MAX_MS = 60_000;

/** Poll schedule: delay before the next poll, or null once the cap is passed. */
export function nextPollDelayMs(elapsedMs: number): number | null {
  return elapsedMs >= POLL_MAX_MS ? null : POLL_INTERVAL_MS;
}

/** End-of-lesson panel poll schedule: 2 s up to 30 s, then every 10 s up to 2 min, then null. */
export function panelPollDelayMs(elapsedMs: number): number | null {
  if (elapsedMs >= 120_000) return null;
  return elapsedMs < 30_000 ? 2000 : 10_000;
}

/** Delay before re-POSTing after a 404/5xx/network error: 3 s for attempts 1-5, then null. */
export function postRetryDelayMs(attempt: number): number | null {
  return attempt >= 1 && attempt <= 5 ? 3000 : null;
}

export function startLessonUrl(token: string): string {
  return `/tutor-portal/embed?token=${encodeURIComponent(token)}&return=home`;
}

/** An `active` row saved within this window is a lesson still running (another tab). */
export const IN_PROGRESS_WINDOW_MS = 35 * 60_000;

export function isInProgress(row: Pick<LearnerSessionRow, 'status' | 'updatedAt'>, nowMs: number): boolean {
  if (row.status !== 'active' || !row.updatedAt) return false;
  const t = Date.parse(row.updatedAt);
  return Number.isFinite(t) && nowMs - t < IN_PROGRESS_WINDOW_MS;
}

export function rowLabel(row: LearnerSessionRow, nowMs: number = Date.now()): { title: string; status: 'Completed' | 'Ended early' | 'In progress'; when: string } {
  return {
    title: row.topic || row.subject || 'Lesson',
    status: row.status === 'completed' ? 'Completed' : isInProgress(row, nowMs) ? 'In progress' : 'Ended early',
    when: row.startedAt,
  };
}

/** A stored summary's level, whatever the status (a kept summary shows while regenerating). */
export function levelBadge(summary: SummaryState): string | null {
  const v = summary.summary?.level?.value;
  return v ? v.charAt(0).toUpperCase() + v.slice(1) : null;
}

/** First-view regenerate: only `none`. A `failed` summary is left to the card's Retry. */
export function needsSummaryRun(summary: SummaryState): boolean {
  return summary.status === 'none';
}

/** Home first view: run only for `none`, never with the kill switch off, never for a lesson in progress. */
export function shouldRunSummary(row: LearnerSessionRow, nowMs: number, opts: { summaryDisabled: boolean }): boolean {
  return !opts.summaryDisabled && !isInProgress(row, nowMs) && needsSummaryRun(row.summary);
}

/** The card polls only a pending summary, and never once disabled or the link expired. */
export function cardShouldPoll(state: SummaryState, opts: { summaryDisabled: boolean; expired: boolean }): boolean {
  return !opts.summaryDisabled && !opts.expired && state.status === 'pending';
}
