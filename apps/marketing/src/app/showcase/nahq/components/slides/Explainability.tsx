import { Eye, TrendingUp } from "lucide-react";
import { SlideShell } from "../SlideShell";

const EVIDENCE = [
  {
    tag: "Mock",
    color: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    text: "Domain III mock exam — 5 of 6 items correct",
    when: "3 days ago",
  },
  {
    tag: "Quiz",
    color: "bg-sky-500/20 text-sky-300 border-sky-500/40",
    text: "Unit quiz on performance measurement — 92%",
    when: "1 week ago",
  },
  {
    tag: "Practice",
    color: "bg-primary-500/20 text-primary-200 border-primary-500/40",
    text: "12 practice items — 9 correct, 4 of last 5 correct",
    when: "ongoing",
  },
  {
    tag: "Tutor",
    color: "bg-slate-500/20 text-slate-300 border-slate-500/40",
    text: "2 tutor sessions — flagged partial understanding on RCA methodology",
    when: "2 weeks ago",
  },
];

export default function Explainability() {
  return (
    <SlideShell
      kicker="Explainability by design"
      title="Every estimate carries its evidence"
      subtitle="For a high-stakes credential, auditability is a feature, not a nicety. This isn't a real screenshot — it's a stylized mock of the same evidence view a candidate or reviewer sees."
    >
      <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-white/15 bg-slate-900 shadow-2xl">
        {/* window chrome */}
        <div className="flex items-center gap-2 border-b border-white/10 bg-slate-950/60 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-rose-400/70" />
          <span className="h-3 w-3 rounded-full bg-amber-400/70" />
          <span className="h-3 w-3 rounded-full bg-emerald-400/70" />
          <span className="ml-3 text-xs text-slate-500">
            Objective detail &middot; illustrative mock
          </span>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Domain III &middot; LO 3.2
              </p>
              <p className="mt-1 text-lg font-bold text-white">
                Apply performance and process improvement methods
              </p>
            </div>
            <div className="flex-shrink-0 text-right">
              <p className="text-3xl font-bold text-emerald-300">78%</p>
              <p className="flex items-center justify-end gap-1 text-xs font-medium text-emerald-400">
                <TrendingUp className="h-3.5 w-3.5" /> Proficient &middot;
                trending up
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-slate-300">
            <Eye className="h-4 w-4 text-primary-300" />
            Why this number
          </div>

          <ul className="mt-3 space-y-2.5">
            {EVIDENCE.map((e) => (
              <li
                key={e.text}
                className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3"
              >
                <span
                  className={`flex-shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${e.color}`}
                >
                  {e.tag}
                </span>
                <span className="flex-1 text-sm text-slate-300">{e.text}</span>
                <span className="flex-shrink-0 text-xs text-slate-500">
                  {e.when}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SlideShell>
  );
}
