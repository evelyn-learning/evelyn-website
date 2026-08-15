import { AlertTriangle, FileWarning } from "lucide-react";
import { SlideShell } from "../SlideShell";

const HISTOGRAM = [
  { label: "0–20%", value: 4 },
  { label: "20–40%", value: 10 },
  { label: "40–60%", value: 22 },
  { label: "60–80%", value: 38 },
  { label: "80–100%", value: 26 },
];
const maxVal = Math.max(...HISTOGRAM.map((h) => h.value));

const AT_RISK = [
  { name: "Candidate 0142", note: "3 domains below threshold, exam in 18 days" },
  { name: "Candidate 0281", note: "No activity in 9 days" },
  { name: "Candidate 0356", note: "Stalled on Domain IV, 3 failed attempts" },
];

const GAPS = [
  { lo: "LO 3.2 — Performance improvement methods", note: "Cohort avg. 54%" },
  { lo: "LO 4.6 — Regulatory & accreditation standards", note: "Cohort avg. 58%" },
];

function PanelHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-300">
        {eyebrow}
      </p>
      <h3 className="mt-1 text-lg font-bold text-white">{title}</h3>
    </div>
  );
}

export default function ProgramLeadership() {
  return (
    <SlideShell
      kicker="What program leadership sees — Phase 2"
      title="Cohort visibility for program leadership"
      subtitle="Illustrative mocks of the reporting layer NAHQ would get in the full program — not built yet, scoped for Phase 2."
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <PanelHeading eyebrow="Distribution" title="Cohort readiness" />
          <div className="flex h-40 items-end gap-2.5">
            {HISTOGRAM.map((h) => (
              <div key={h.label} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-primary-600 to-secondary-400"
                  style={{ height: `${(h.value / maxVal) * 100}%` }}
                />
                <span className="text-[10px] leading-tight text-slate-500">
                  {h.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <PanelHeading eyebrow="Flags" title="At-risk candidates" />
          <ul className="space-y-3">
            {AT_RISK.map((c) => (
              <li key={c.name} className="flex items-start gap-2.5">
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" />
                <div>
                  <p className="text-sm font-semibold text-white">{c.name}</p>
                  <p className="text-xs text-slate-400">{c.note}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <PanelHeading eyebrow="Coverage" title="Content-gap report" />
          <ul className="space-y-3">
            {GAPS.map((g) => (
              <li key={g.lo} className="flex items-start gap-2.5">
                <FileWarning className="mt-0.5 h-4 w-4 flex-shrink-0 text-rose-400" />
                <div>
                  <p className="text-sm font-semibold text-white">{g.lo}</p>
                  <p className="text-xs text-slate-400">{g.note}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SlideShell>
  );
}
