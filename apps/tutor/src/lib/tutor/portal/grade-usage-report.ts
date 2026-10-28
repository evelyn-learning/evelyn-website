/**
 * Totals of free-response grading cost (practicegradeusages) for the admin
 * Tutor Sessions page: the cost line and the Practice grading view.
 */
import { PracticeGradeUsage } from '@/models/PracticeGradeUsage';

export interface GradeUsageRow {
  key: string;
  grades: number;
  calls: number;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
}

export interface GradeUsageReport {
  total: GradeUsageRow;
  byPartner: GradeUsageRow[];
  byDay: GradeUsageRow[];
  byStudent: GradeUsageRow[];
  partners: string[];
}

const SUMS = {
  grades: { $sum: 1 },
  calls: { $sum: '$calls' },
  // Cache buckets count toward billed input, as on the session totals.
  inputTokens: { $sum: { $add: ['$inputTokens', '$cacheReadTokens', '$cacheCreationTokens'] } },
  outputTokens: { $sum: '$outputTokens' },
  costUsd: { $sum: '$costUsd' },
};

type Raw = Omit<GradeUsageRow, 'key'> & { _id: unknown };

const row = (r: Raw, key: string): GradeUsageRow => ({
  key,
  grades: r.grades,
  calls: r.calls,
  inputTokens: r.inputTokens,
  outputTokens: r.outputTokens,
  costUsd: r.costUsd,
});

const EMPTY: GradeUsageRow = { key: 'total', grades: 0, calls: 0, inputTokens: 0, outputTokens: 0, costUsd: 0 };

/** Grand total only — the cost line. */
export async function gradeUsageTotal(match: Record<string, unknown>): Promise<GradeUsageRow> {
  const [t] = await PracticeGradeUsage.aggregate<Raw>([{ $match: match }, { $group: { _id: null, ...SUMS } }]);
  return t ? row(t, 'total') : EMPTY;
}

/** Everything the Practice grading view shows. */
export async function gradeUsageReport(match: Record<string, unknown>): Promise<GradeUsageReport> {
  const [total, byPartner, byDay, byStudent, partners] = await Promise.all([
    gradeUsageTotal(match),
    PracticeGradeUsage.aggregate<Raw>([{ $match: match }, { $group: { _id: '$partnerId', ...SUMS } }, { $sort: { costUsd: -1 } }]),
    PracticeGradeUsage.aggregate<Raw>([
      { $match: match },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, ...SUMS } },
      { $sort: { _id: -1 } },
    ]),
    PracticeGradeUsage.aggregate<Raw>([
      { $match: match },
      { $group: { _id: { partner: '$partnerId', student: '$studentId' }, ...SUMS } },
      { $sort: { costUsd: -1 } },
      { $limit: 25 },
    ]),
    PracticeGradeUsage.distinct('partnerId') as Promise<string[]>,
  ]);
  return {
    total,
    byPartner: byPartner.map((r) => row(r, String(r._id))),
    byDay: byDay.map((r) => row(r, String(r._id))),
    byStudent: byStudent.map((r) => {
      const id = r._id as { partner: string; student: string };
      return row(r, `${id.partner} · ${id.student}`);
    }),
    partners: partners.filter(Boolean).sort(),
  };
}
