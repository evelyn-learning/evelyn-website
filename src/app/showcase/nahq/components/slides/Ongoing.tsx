import { CheckCircle2 } from "lucide-react";
import { SlideShell } from "../SlideShell";

const ITEMS = [
  "Hosting and operations",
  "Model / inference costs",
  "Continuous updates as the blueprint and item bank evolve",
];

export default function Ongoing() {
  return (
    <SlideShell
      kicker="The build for NAHQ — Ongoing"
      title="Managed platform license"
    >
      <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
        <div className="flex-shrink-0 lg:w-80">
          <p className="text-5xl font-bold text-white md:text-6xl">$75–$100</p>
          <p className="mt-2 text-sm text-slate-400">
            Indicative — volume-tiered
          </p>
          <p className="mt-6 inline-block rounded-full border border-white/15 bg-white/[0.05] px-4 py-1.5 text-sm text-slate-300">
            Per active candidate, per year
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
