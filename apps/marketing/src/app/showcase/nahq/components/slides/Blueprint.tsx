import { ListTree, BookOpen, Brain, Gauge } from "lucide-react";
import { SlideShell } from "../SlideShell";

const STATS = [
  {
    icon: ListTree,
    label: "Domains and weights",
    detail: "preserved exactly as published in the outline",
  },
  {
    icon: BookOpen,
    label: "~37 learning objectives",
    detail: "with prerequisite structure between them",
  },
  {
    icon: Brain,
    label: "Lessons + AI tutor",
    detail: "generated and grounded per objective",
  },
  {
    icon: Gauge,
    label: "Per-candidate learner model",
    detail: "live on a seeded candidate account",
  },
];

export default function Blueprint() {
  return (
    <SlideShell
      kicker="Before this call"
      title="We started from your published blueprint"
      subtitle="Ahead of today, we ingested NAHQ's published CPHQ examination content outline into a working adaptive course — domains and weights preserved as published, broken into roughly 37 learning objectives with prerequisite structure between them. This isn't a mockup — it's the system, seeded with your content."
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5"
          >
            <s.icon className="mt-0.5 h-7 w-7 flex-shrink-0 text-primary-300" />
            <div>
              <p className="text-lg font-semibold text-white">{s.label}</p>
              <p className="mt-1 text-slate-400">{s.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </SlideShell>
  );
}
