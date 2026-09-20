/** Homework status from the engine's own evidence rows (spec §C.4). Pure. */
import type { IPracticeAssignment } from '@/models';

export type HomeworkLoStatus = 'untouched' | 'partial' | 'done';
export interface HomeworkLoSummary { loId: string; title: string; total: number; attempted: number; correct: number; lastAttemptAt?: string; status: HomeworkLoStatus }
export interface HomeworkStatus { assignmentId: string; sessionId: string; assignedAt: string; locator?: string; los: HomeworkLoSummary[]; overall: 'untouched' | 'partial' | 'done' | 'weak' }

const WEAK_BELOW = 0.5;

export function computeHomeworkStatus(
  a: IPracticeAssignment,
  rows: Array<{ itemId?: string; outcome: number; occurredAt: Date }>,
): HomeworkStatus {
  const since = a.assignedAt.getTime();
  // latest outcome per item, only rows after assignment
  const latest = new Map<string, { outcome: number; at: Date }>();
  for (const r of rows) {
    if (!r.itemId || r.occurredAt.getTime() < since) continue;
    const prev = latest.get(r.itemId);
    if (!prev || r.occurredAt > prev.at) latest.set(r.itemId, { outcome: r.outcome, at: r.occurredAt });
  }
  const los: HomeworkLoSummary[] = a.los.map((lo) => {
    let attempted = 0, correct = 0, last: Date | undefined;
    for (const it of lo.items) {
      const l = latest.get(it.id);
      if (!l) continue;
      attempted += 1;
      if (l.outcome >= 0.99) correct += 1;
      if (!last || l.at > last) last = l.at;
    }
    const status: HomeworkLoStatus = attempted === 0 ? 'untouched' : attempted >= lo.items.length ? 'done' : 'partial';
    return { loId: lo.loId, title: lo.title, total: lo.items.length, attempted, correct, ...(last ? { lastAttemptAt: last.toISOString() } : {}), status };
  });
  const attempted = los.reduce((n, l) => n + l.attempted, 0);
  const correct = los.reduce((n, l) => n + l.correct, 0);
  const total = los.reduce((n, l) => n + l.total, 0);
  let overall: HomeworkStatus['overall'] = attempted === 0 ? 'untouched' : attempted >= total ? 'done' : 'partial';
  if (attempted > 0 && correct / attempted < WEAK_BELOW) overall = 'weak';
  return { assignmentId: a._id, sessionId: a.sessionId, assignedAt: a.assignedAt.toISOString(), ...(a.locator ? { locator: a.locator } : {}), los, overall };
}

export function describeHomework(h: HomeworkStatus): string {
  const date = h.assignedAt.slice(0, 10);
  const parts = h.los.map((l) =>
    l.status === 'untouched' ? `${l.title} — not attempted`
      : l.status === 'done' ? `${l.title} — done, ${l.correct} of ${l.total} correct`
        : `${l.title} — ${l.attempted} of ${l.total} attempted, ${l.correct} correct`);
  return `homework (assigned ${date}): ${parts.join('; ')}`;
}
