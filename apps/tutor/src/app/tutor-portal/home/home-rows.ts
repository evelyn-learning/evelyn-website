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

export function startLessonUrl(token: string): string {
  return `/tutor-portal/embed?token=${encodeURIComponent(token)}&return=home`;
}

export function rowLabel(row: LearnerSessionRow): { title: string; status: 'Completed' | 'Ended early'; when: string } {
  return {
    title: row.topic || row.subject || 'Lesson',
    status: row.status === 'completed' ? 'Completed' : 'Ended early',
    when: row.startedAt,
  };
}

export function levelBadge(summary: SummaryState): string | null {
  if (summary.status !== 'ready') return null;
  const v = summary.summary?.level?.value;
  return v ? v.charAt(0).toUpperCase() + v.slice(1) : null;
}

/** First-view regenerate: only `none`. A `failed` summary is left to the card's Retry. */
export function needsSummaryRun(summary: SummaryState): boolean {
  return summary.status === 'none';
}
