import { SlideShell } from "@/components/showcase-deck/SlideShell";

const WEEKS = [
  { w: "Week 1", t: "Pilot agreement and setup quote signed. You name the client company, the first course and your teacher personas." },
  { w: "Weeks 2–3", t: "Your brand goes up. Your first course and one scenario set become lesson plans; your trainers review them." },
  { w: "Week 4", t: "A Japanese-speaking tester runs every lesson. Fixes land. Your admin learns the console." },
  { w: "Weeks 5–6", t: "First learners at your client. Weekly check-in with you; monthly statement to the client." },
];
const FROM_GDI = [
  "The client company and its first learners",
  "Content for the first course and one scenario set",
  "Teacher names, logo, colours, domain",
  "One owner on the GDI side",
];

export default function NextSteps() {
  return (
    <SlideShell kicker="Next steps" title="A pilot in about six weeks">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <ol className="space-y-3 lg:col-span-3">
          {WEEKS.map((s) => (
            <li key={s.w} className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <span className="w-24 flex-shrink-0 font-mono text-sm font-semibold text-primary-200">{s.w}</span>
              <p className="text-base leading-relaxed text-slate-200">{s.t}</p>
            </li>
          ))}
        </ol>
        <div className="rounded-2xl border border-primary-400/30 bg-primary-500/10 p-6 lg:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-200">What we need from GDI</p>
          <ul className="mt-4 space-y-3">
            {FROM_GDI.map((r) => (
              <li key={r} className="flex items-start gap-3 text-base leading-relaxed text-slate-200">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary-300" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-base text-slate-300">If this sounds right, the pilot agreement and the setup quote go out this week.</p>
        </div>
      </div>
    </SlideShell>
  );
}
