import { CheckCircle2 } from "lucide-react";
import { SlideShell } from "../SlideShell";

const ITEMS = [
  "CPHQ blueprint course productionized from NAHQ's published outline",
  "Cohort of up to 200 candidates",
  "NAHQ-reviewed content gates before candidates see anything",
  "Weekly readouts against agreed success metrics",
];

export default function Phase1() {
  return (
    <SlideShell kicker="The build for NAHQ — Phase 1" title="Pilot">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
        <div className="flex-shrink-0 lg:w-72">
          <p className="text-5xl font-bold text-white md:text-6xl">$35,000</p>
          <p className="mt-2 text-sm text-slate-400">
            Indicative — credited toward Phase 2 on continuation
          </p>
          <p className="mt-6 inline-block rounded-full border border-white/15 bg-white/[0.05] px-4 py-1.5 text-sm text-slate-300">
            ~6 weeks from kickoff
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
