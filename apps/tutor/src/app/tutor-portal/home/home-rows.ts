/** Pure helpers for the learner home (no React/Next imports so tsx can test them). */
import type { LearnerSessionRow, SummaryState } from '@/lib/tutor/portal/learner-summary-store';

const FAILED_RETRY_MS = 10 * 60_000;

export function startLessonUrl(token: string): string {
  return `/tutor-portal/embed?token=${encodeURIComponent(token)}&return=home`;
}

export function rowLabel(row: LearnerSessionRow): { title: string; status: 'Completed' | 'Ended early'; when: string } {
  return {
    title: row.topic || row.subject || 'Lesson',
    status: row.status === 'completed' ? 'Completed' : 'Ended early',
    when: new Date(row.startedAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }),
  };
}

export function levelBadge(summary: SummaryState): string | null {
  if (summary.status !== 'ready') return null;
  const v = summary.summary?.level?.value;
  return v ? v.charAt(0).toUpperCase() + v.slice(1) : null;
}

/** First-view regenerate: `none`, or `failed` older than 10 min (unknown age = old). */
export function needsSummaryRun(summary: SummaryState, nowMs: number, updatedAt?: string): boolean {
  if (summary.status === 'none') return true;
  if (summary.status !== 'failed') return false;
  const t = updatedAt ? Date.parse(updatedAt) : NaN;
  return !Number.isFinite(t) || nowMs - t > FAILED_RETRY_MS;
}
