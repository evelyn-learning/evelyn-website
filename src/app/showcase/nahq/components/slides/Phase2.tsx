import { CheckCircle2 } from "lucide-react";
import { SlideShell } from "../SlideShell";

const ITEMS = [
  "SME item-review workflow: your experts approve, edit, or reject every generated item before candidates see it",
  "Calibrated item bank and full-length practice exams",
  "NAHQ branding on a dedicated portal",
  "Cohort analytics for program leadership — readiness distribution, at-risk candidates, content-gap reports",
  "SSO / integrations",
  "Data-processing agreement",
];

export default function Phase2() {
  return (
    <SlideShell kicker="The build for NAHQ — Phase 2" title="Full program">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
        <div className="flex-shrink-0 lg:w-80">
          <p className="text-4xl font-bold leading-tight text-white md:text-5xl">
            $100,000–$150,000
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Indicative — depends on scope
          </p>
          <p className="mt-6 inline-block rounded-full border border-white/15 bg-white/[0.05] px-4 py-1.5 text-sm text-slate-300">
            8–12 weeks
          </p>
        </div>
        <ul className="flex-1 space-y-4">
          {ITEMS.map((item) => (
            <li key={item} className="flex items-start gap-3 text-lg text-slate-200">
              <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-primary-400" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </SlideShell>
  );
}
