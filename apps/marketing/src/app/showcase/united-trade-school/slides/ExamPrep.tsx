import { SlideShell } from "@/components/showcase-deck/SlideShell";

const PTCB = [
  { domain: "Medications", weight: 40 },
  { domain: "Patient Safety & Quality Assurance", weight: 26.25 },
  { domain: "Order Entry & Processing", weight: 21.25 },
  { domain: "Federal Requirements", weight: 12.5 },
];
const CMAA = [
  { domain: "Scheduling" },
  { domain: "Patient intake" },
  { domain: "Office logistics" },
  { domain: "Compliance" },
  { domain: "Patient education" },
  { domain: "General office policies & procedures" },
];

function Bars({ title, rows }: { title: string; rows: { domain: string; weight?: number }[] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <p className="text-lg font-semibold text-white">{title}</p>
      <ul className="mt-4 space-y-3">
        {rows.map((r) => (
          <li key={r.domain}>
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>{r.domain}</span>
              {r.weight !== undefined && <span className="font-mono text-slate-400">{r.weight}%</span>}
            </div>
            {r.weight !== undefined && (
              <div className="mt-1 h-2 rounded-full bg-white/10">
                <div className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500" style={{ width: `${r.weight * 2.4}%` }} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ExamPrep() {
  return (
    <SlideShell kicker="Certification" title="Exam prep built around the exam" subtitle="Practice sets, quizzes and full timed mock exams follow the published domain weights — and missed questions can be reviewed with the tutor.">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Bars title="PTCB CPhT — exam domains" rows={PTCB} />
        <Bars title="NHA CMAA — exam domains" rows={CMAA} />
      </div>
      <p className="mt-6 text-sm text-slate-500">PTCB weights as published in the CPhT content outline. CMAA domains per the NHA test plan; weights are confirmed against the current plan before we build.</p>
    </SlideShell>
  );
}
