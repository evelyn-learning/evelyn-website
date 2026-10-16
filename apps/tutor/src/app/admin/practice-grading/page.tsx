import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@core/db";
import { PracticeGradeUsage } from "@/models/PracticeGradeUsage";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

/** Evelyn-internal cost of free-response grading in partner practice (Self
 *  Study). Rows are written by POST /api/portal/v1/grade — see
 *  lib/tutor/portal/grade-usage.ts. Partners never see this page. */

interface Row { _id: unknown; grades: number; calls: number; inputTokens: number; outputTokens: number; costUsd: number }

const usd = (v: number) => `$${v.toFixed(v < 1 ? 4 : 2)}`;
const tok = (v: number) => v.toLocaleString("en-US");

function Table({ title, head, rows, label }: { title: string; head: string; rows: Row[]; label: (r: Row) => string }) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      {rows.length === 0 ? (
        <p className="text-sm text-gray-500">No grading recorded yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-2 pr-4">{head}</th>
                <th className="py-2 pr-4 text-right">Grades</th>
                <th className="py-2 pr-4 text-right">Model calls</th>
                <th className="py-2 pr-4 text-right">Input tokens</th>
                <th className="py-2 pr-4 text-right">Output tokens</th>
                <th className="py-2 pr-4 text-right">Cost</th>
                <th className="py-2 text-right">Per grade</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={label(r)} className="border-b border-gray-100">
                  <td className="py-2 pr-4 font-mono text-xs">{label(r)}</td>
                  <td className="py-2 pr-4 text-right">{r.grades}</td>
                  <td className="py-2 pr-4 text-right">{r.calls}</td>
                  <td className="py-2 pr-4 text-right">{tok(r.inputTokens)}</td>
                  <td className="py-2 pr-4 text-right">{tok(r.outputTokens)}</td>
                  <td className="py-2 pr-4 text-right font-medium">{usd(r.costUsd)}</td>
                  <td className="py-2 text-right">{usd(r.grades ? r.costUsd / r.grades : 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

const SUMS = {
  grades: { $sum: 1 },
  calls: { $sum: "$calls" },
  inputTokens: { $sum: { $add: ["$inputTokens", "$cacheReadTokens", "$cacheCreationTokens"] } },
  outputTokens: { $sum: "$outputTokens" },
  costUsd: { $sum: "$costUsd" },
};

export default async function PracticeGradingPage({ searchParams }: { searchParams: Promise<{ partner?: string; days?: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");
  const sp = await searchParams;
  const days = Math.min(Math.max(Number(sp.days) || 30, 1), 365);
  const since = new Date(Date.now() - days * 86_400_000);
  const match: Record<string, unknown> = { createdAt: { $gte: since } };
  if (sp.partner) match.partnerId = sp.partner;

  await connectDB();
  const [byPartner, byDay, byStudent] = await Promise.all([
    PracticeGradeUsage.aggregate<Row>([{ $match: match }, { $group: { _id: "$partnerId", ...SUMS } }, { $sort: { costUsd: -1 } }]),
    PracticeGradeUsage.aggregate<Row>([
      { $match: match },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, ...SUMS } },
      { $sort: { _id: -1 } },
    ]),
    PracticeGradeUsage.aggregate<Row>([
      { $match: match },
      { $group: { _id: { partner: "$partnerId", student: "$studentId" }, ...SUMS } },
      { $sort: { costUsd: -1 } },
      { $limit: 25 },
    ]),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link href="/admin/tutor-sessions" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-4">
        <ArrowLeft className="w-4 h-4" /> Tutor sessions
      </Link>
      <h1 className="text-2xl font-bold mb-1">Practice grading cost</h1>
      <p className="text-sm text-gray-500 mb-6">
        Free-response answers graded by the model in partner practice (Self Study), last {days} days
        {sp.partner ? <> · partner <span className="font-mono">{sp.partner}</span></> : null}. Internal only.
        {" "}Filter with <span className="font-mono">?partner=greenapple&amp;days=7</span>.
      </p>
      <Table title="By partner" head="Partner" rows={byPartner} label={(r) => String(r._id)} />
      <Table title="By day (UTC)" head="Day" rows={byDay} label={(r) => String(r._id)} />
      <Table
        title="Top students"
        head="Partner · student"
        rows={byStudent}
        label={(r) => { const id = r._id as { partner: string; student: string }; return `${id.partner} · ${id.student}`; }}
      />
    </div>
  );
}
