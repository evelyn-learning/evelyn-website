import { SlideShell } from "@/components/showcase-deck/SlideShell";

const NOW = [
  "Every session kept: transcript, minutes used, the lesson and where it got to",
  "Where the learner struggled, by learning goal, across sessions",
  "Monthly usage per client company for GDI's invoicing",
  "Session replay for your trainers' quality checks",
];
const PILOT = [
  "Client-company view: a manager at your client sees their own people only",
  "Three levels — GDI, client company, learner — with the right people seeing the right slice",
  "Per-learner progress summary your trainers can hand to the client",
];

export default function Reporting() {
  return (
    <SlideShell kicker="Reporting" title="What GDI and your clients see" subtitle="The record of a session is the product your clients pay you for. We are precise about what exists today and what is built with you during the pilot.">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-200">From day one of the pilot</p>
          <ul className="mt-4 space-y-3">
            {NOW.map((t) => (
              <li key={t} className="flex items-start gap-3 text-base leading-relaxed text-slate-100">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-300" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-sky-400/30 bg-sky-500/10 p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-sky-200">Built during the pilot, with your input</p>
          <ul className="mt-4 space-y-3">
            {PILOT.map((t) => (
              <li key={t} className="flex items-start gap-3 text-base leading-relaxed text-slate-100">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-sky-300" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SlideShell>
  );
}
