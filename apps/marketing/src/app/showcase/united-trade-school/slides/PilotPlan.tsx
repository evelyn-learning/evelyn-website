import { SlideShell } from "@/components/showcase-deck/SlideShell";

const WEEKS = [
  { when: "Week 1", what: "You send the Phase 2 outline and sample material. We map it to objectives; you approve." },
  { when: "Week 2", what: "Pilot course built: lessons, practice, notes, one mock. Your reviewer signs off. Pilot site live." },
  { when: "Weeks 3–12", what: "Up to 30 students learn Phase 2 with the tutor. You watch completion, exam-readiness and replays." },
  { when: "Week 12", what: "Review against the numbers that matter to you: completion, mock scores, time to finish. Decide on the full academy." },
];

export default function PilotPlan() {
  return (
    <SlideShell kicker="Pilot" title="Ninety days, one phase, real students" subtitle="Small enough to say yes to today; real enough to show whether completion and pass rates move.">
      <ol className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {WEEKS.map((w) => (
          <li key={w.when} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="font-mono text-xs text-primary-300">{w.when}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-200">{w.what}</p>
          </li>
        ))}
      </ol>
    </SlideShell>
  );
}
