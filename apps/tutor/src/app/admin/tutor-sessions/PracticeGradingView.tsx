import type { GradeUsageReport, GradeUsageRow } from '@/lib/tutor/portal/grade-usage-report';

/** The Practice grading view of /admin/tutor-sessions: free-response answers
 *  graded by the model in partner practice (Self Study). Internal only. */

export const formatUsd = (v: number) => `$${v.toFixed(v > 0 && v < 1 ? 4 : 2)}`;
const tok = (v: number) => v.toLocaleString('en-US');

function Table({ title, head, rows }: { title: string; head: string; rows: GradeUsageRow[] }) {
  const th = 'px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500';
  return (
    <section className="rounded-xl bg-white shadow overflow-hidden">
      <h2 className="border-b bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-700">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b">
            <tr>
              <th className={`${th} text-left`}>{head}</th>
              <th className={`${th} text-right`}>Grades</th>
              <th className={`${th} text-right`}>Model calls</th>
              <th className={`${th} text-right`}>Input tokens</th>
              <th className={`${th} text-right`}>Output tokens</th>
              <th className={`${th} text-right`}>Cost</th>
              <th className={`${th} text-right`}>Per grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm text-gray-600">
            {rows.map((r) => (
              <tr key={r.key}>
                <td className="px-4 py-2 font-mono text-xs text-gray-900">{r.key}</td>
                <td className="px-4 py-2 text-right">{r.grades}</td>
                <td className="px-4 py-2 text-right">{r.calls}</td>
                <td className="px-4 py-2 text-right">{tok(r.inputTokens)}</td>
                <td className="px-4 py-2 text-right">{tok(r.outputTokens)}</td>
                <td className="px-4 py-2 text-right font-mono font-medium text-gray-900">{formatUsd(r.costUsd)}</td>
                <td className="px-4 py-2 text-right font-mono">{formatUsd(r.grades ? r.costUsd / r.grades : 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function PracticeGradingView({ report }: { report: GradeUsageReport }) {
  if (report.total.grades === 0) {
    return (
      <div className="rounded-xl bg-white p-12 text-center shadow">
        <p className="text-gray-500">
          No free-response grading recorded for these filters. Recording started 16 Oct 2026; only typed answers in
          partner Self Study are graded by the model.
        </p>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">
        Free-response answers graded by the model in partner Self Study. Multiple-choice, numeric and drawn answers are
        checked without a model call and cost nothing. Partners never see these figures.
      </p>
      <Table title="By partner" head="Partner" rows={report.byPartner} />
      <Table title="By day (UTC)" head="Day" rows={report.byDay} />
      <Table title="Top students" head="Partner · student id" rows={report.byStudent} />
    </div>
  );
}
