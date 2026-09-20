/** Trigger-3 recap candidate (spec §B.7). Pure. One candidate or null. */
import type { GapEntry } from '@/lib/tutor/student-profile/types';
import { isGapStale } from '@/lib/tutor/student-profile/store';
import type { HomeworkStatus } from '@/lib/tutor/practice-assign/status';
import { TUNING } from './estimator';

export interface RecapCandidateInput {
  planLos: Array<{ loId: string; title: string }>;
  projections: Map<string, { estimate: number | null; reviewDueAt?: Date }>;
  gaps: GapEntry[];
  homework: HomeworkStatus[];
  now: Date;
}
export interface RecapCandidate { loId: string; title: string; reason: 'homework-weak' | 'recurred' | 'review-due' | 'confirmed'; soft: boolean }

const MAX_DECLINES = 2;

export function pickRecapCandidate(input: RecapCandidateInput): RecapCandidate | null {
  const titles = new Map(input.planLos.map((l) => [l.loId, l.title]));
  const nowMs = input.now.getTime();
  const softness = (g: GapEntry | undefined): { excluded: boolean; soft: boolean } => {
    const r = g?.evidence?.recap;
    if (!r) return { excluded: false, soft: false };
    if (r.declines >= MAX_DECLINES) return { excluded: true, soft: false };
    return { excluded: false, soft: r.lastOutcome === 'declined' };
  };
  const eligibleGaps = input.gaps.filter((g) =>
    g.kind !== 'prerequisite' && !!g.loId && titles.has(g.loId)
    && (g.status === 'confirmed' || g.status === 'open') && !isGapStale(g, nowMs));
  // Falls back to `input.gaps` (any status/staleness) rather than just
  // `eligibleGaps`: a recorded decline is a decline regardless of whether
  // the underlying gap has since decayed or changed status — softness
  // (declines/soft) is about respecting the student's prior response to
  // being offered a recap, not about the gap's own surfacing eligibility.
  const gapFor = (loId: string) => eligibleGaps.find((g) => g.loId === loId) ?? input.gaps.find((g) => g.loId === loId);

  // 1. homework partial/weak/untouched on a plan LO. Check each LO's own
  // `status`, not just the assignment's `overall` — `overall` is a summary
  // across all LOs on the assignment, so a partial/weak assignment can
  // still contain individual LOs that are already done.
  for (const h of input.homework) {
    if (h.overall === 'done') continue;
    for (const lo of h.los) {
      // A per-LO 'done' means every item on it was ATTEMPTED — not that the
      // student got them right. On a 'weak' assignment (mostly wrong) those
      // attempts are exactly the evidence a recap should act on, so 'done'
      // only skips when the assignment as a whole is not weak.
      if (lo.status === 'done' && h.overall !== 'weak') continue;
      if (!titles.has(lo.loId)) continue;
      const s = softness(gapFor(lo.loId));
      if (s.excluded) continue;
      return { loId: lo.loId, title: titles.get(lo.loId)!, reason: 'homework-weak', soft: s.soft };
    }
  }
  // 2. recurred confirmed gap
  const recurred = eligibleGaps
    .filter((g) => (g.evidence?.recurrenceCount ?? 0) >= 1)
    .sort((a, b) => b.lastSeenAt.localeCompare(a.lastSeenAt));
  for (const g of recurred) {
    const s = softness(g);
    if (!s.excluded) return { loId: g.loId!, title: titles.get(g.loId!)!, reason: 'recurred', soft: s.soft };
  }
  // 3. review-due plan LO with estimate below the moderate band
  const due = [...input.projections.entries()]
    .filter(([loId, p]) => titles.has(loId) && p.reviewDueAt && p.reviewDueAt.getTime() <= nowMs && (p.estimate ?? TUNING.untouchedPrior) < TUNING.contextBands.moderate)
    .sort((a, b) => a[1].reviewDueAt!.getTime() - b[1].reviewDueAt!.getTime());
  for (const [loId] of due) {
    const s = softness(gapFor(loId));
    if (!s.excluded) return { loId, title: titles.get(loId)!, reason: 'review-due', soft: s.soft };
  }
  // 4. any confirmed gap on a plan LO
  for (const g of eligibleGaps.sort((a, b) => b.lastSeenAt.localeCompare(a.lastSeenAt))) {
    const s = softness(g);
    if (!s.excluded) return { loId: g.loId!, title: titles.get(g.loId!)!, reason: 'confirmed', soft: s.soft };
  }
  return null;
}
