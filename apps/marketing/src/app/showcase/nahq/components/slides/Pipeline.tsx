import { ArrowRight, ArrowDown, Bot, ShieldCheck, Users } from "lucide-react";
import { SlideShell } from "../SlideShell";

function Stage({
  label,
  detail,
  emphasis = false,
}: {
  label: string;
  detail?: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={[
        "flex h-full min-w-[150px] flex-1 flex-col justify-center rounded-xl border px-4 py-4 text-center",
        emphasis
          ? "border-primary-400/50 bg-primary-500/15"
          : "border-white/12 bg-white/[0.04]",
      ].join(" ")}
    >
      <p className="text-sm font-semibold leading-snug text-white">{label}</p>
      {detail && (
        <p className="mt-1.5 text-xs leading-snug text-slate-400">{detail}</p>
      )}
    </div>
  );
}

function Arrow() {
  return (
    <>
      <ArrowRight className="hidden h-5 w-5 flex-shrink-0 text-slate-600 sm:block" />
      <ArrowDown className="h-5 w-5 flex-shrink-0 self-center text-slate-600 sm:hidden" />
    </>
  );
}

export default function Pipeline() {
  return (
    <SlideShell
      kicker="From blueprint to course"
      title="The pipeline — and where your SMEs sit"
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <Stage label="Published exam content outline" />
          <Arrow />
          <Stage label="AI drafting" />
          <Arrow />
          <Stage
            label="LO graph, domain weights"
            detail="Reviewed &amp; edited by your team, in a console"
          />
          <Arrow />
          <Stage label="Per-objective lessons" />
        </div>

        <div className="flex justify-start pl-2 sm:pl-6">
          <ArrowDown className="h-5 w-5 text-slate-600" />
        </div>

        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <Stage label="Generated practice items" />
          <Arrow />

          <div className="flex flex-1 flex-col gap-2 rounded-xl border border-dashed border-white/15 p-2.5">
            <div className="flex items-center gap-2 rounded-lg border border-white/12 bg-white/[0.04] px-3 py-2.5">
              <Bot className="h-4 w-4 flex-shrink-0 text-secondary-400" />
              <div className="text-left">
                <p className="text-xs font-semibold text-white">
                  Independent AI verification
                </p>
                <p className="text-[10px] font-medium uppercase tracking-wide text-emerald-400">
                  Today
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-primary-400/40 bg-primary-500/10 px-3 py-2.5">
              <Users className="h-4 w-4 flex-shrink-0 text-primary-300" />
              <div className="text-left">
                <p className="text-xs font-semibold text-white">
                  Your SMEs&apos; approve / edit / reject queue
                </p>
                <p className="text-[10px] font-medium uppercase tracking-wide text-primary-300">
                  Phase 2 — co-designed with your team, not yet built
                </p>
              </div>
            </div>
          </div>

          <Arrow />
          <Stage
            label="Calibrated bank + practice exams"
            emphasis
          />
        </div>
      </div>

      <p className="mt-6 flex items-start gap-2.5 text-sm leading-relaxed text-slate-400">
        <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-300" />
        Today, every item clears an independent AI verification pass before a
        candidate can see it. In Phase 2, your SMEs sit in that same
        checkpoint — approving, editing, or rejecting before anything ships.
      </p>
    </SlideShell>
  );
}
