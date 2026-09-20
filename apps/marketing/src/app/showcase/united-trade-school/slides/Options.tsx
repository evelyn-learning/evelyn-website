import { SlideShell } from "@/components/showcase-deck/SlideShell";

const OPTIONS = [
  {
    name: "Pilot",
    tag: "Start here",
    price: "$1,500",
    unit: "one-time · 90 days",
    points: ["Pharmacy Technician Phase 2 built as a pilot course", "Up to 30 students, tutor included", "On pilot.unitedtradeschool.com", "Credited against the full academy"],
    accent: true,
  },
  {
    name: "Full Academy",
    tag: "White-label platform",
    price: "$149",
    unit: "per student, per program (volume tiers below)",
    points: ["Both programs as courses, under your brand", "Tutor, practice, mocks, notes, replays, reports", "Admin dashboard and weekly emails", "Setup + content adaptation, one-time"],
    accent: false,
  },
  {
    name: "Tutor embed",
    tag: "If you build your own portal",
    price: "$0.15",
    unit: "per tutoring minute",
    points: ["Voice + whiteboard tutor inside your app", "Lesson context in, progress out", "First 300 minutes free", "Volume pricing above 50,000 minutes"],
    accent: false,
  },
];

export default function Options() {
  return (
    <SlideShell kicker="Three ways to start" title="Pick the size of the first step">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {OPTIONS.map((o) => (
          <div key={o.name} className={["rounded-2xl border p-6", o.accent ? "border-primary-400/60 bg-primary-500/10" : "border-white/10 bg-white/[0.04]"].join(" ")}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-300">{o.tag}</p>
            <p className="mt-2 text-2xl font-bold text-white">{o.name}</p>
            <p className="mt-4 text-4xl font-bold text-white">{o.price}</p>
            <p className="text-sm text-slate-400">{o.unit}</p>
            <ul className="mt-5 space-y-2">
              {o.points.map((p) => (
                <li key={p} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary-300" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </SlideShell>
  );
}
