import { Lock, HelpCircle, Gauge } from "lucide-react";
import { SlideShell } from "../SlideShell";
import { COLORS } from "../theme";

function PanelHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-300">
        {eyebrow}
      </p>
      <h3 className="mt-1 text-xl font-bold text-white">{title}</h3>
    </div>
  );
}

const NODES = [
  { id: "A1", x: 90, y: 55, label: "LO 1.1", locked: false },
  { id: "A2", x: 260, y: 55, label: "LO 1.4", locked: false },
  { id: "B1", x: 70, y: 160, label: "LO 2.1", locked: false },
  { id: "B2", x: 200, y: 160, label: "LO 2.3", locked: false },
  { id: "B3", x: 340, y: 160, label: "LO 2.6", locked: false },
  { id: "C1", x: 140, y: 255, label: "LO 3.2", locked: false },
  { id: "C2", x: 330, y: 255, label: "LO 3.5", locked: true },
] as const;

const EDGES: Array<[string, string]> = [
  ["A1", "B1"],
  ["A1", "B2"],
  ["A2", "B2"],
  ["A2", "B3"],
  ["B1", "C1"],
  ["B2", "C1"],
  ["B3", "C2"],
];

function nodeById(id: string) {
  return NODES.find((n) => n.id === id)!;
}

function PrereqPanel() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <PanelHeading eyebrow="Sequencing" title="Prerequisite graph" />
      <svg viewBox="0 0 420 300" className="w-full" role="img" aria-label="A small prerequisite graph of learning objectives; one downstream objective is greyed out and locked because its prerequisite has not been mastered.">
        <defs>
          <marker id="prereq-arrowhead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill={COLORS.borderStrong} />
          </marker>
        </defs>
        {EDGES.map(([from, to], i) => {
          const a = nodeById(from);
          const b = nodeById(to);
          const locked = b.locked;
          return (
            <line
              key={i}
              x1={a.x}
              y1={a.y + 20}
              x2={b.x}
              y2={b.y - 20}
              stroke={locked ? COLORS.textFaint : COLORS.borderStrong}
              strokeWidth={1.75}
              strokeDasharray={locked ? "4 4" : undefined}
              markerEnd="url(#prereq-arrowhead)"
            />
          );
        })}
        {NODES.map((n) => (
          <foreignObject key={n.id} x={n.x - 45} y={n.y - 20} width={90} height={40}>
            <div
              className={[
                "flex h-full w-full items-center justify-center gap-1.5 rounded-lg border text-xs font-semibold",
                n.locked
                  ? "border-dashed border-slate-600 bg-slate-800/60 text-slate-500"
                  : "border-primary-400/50 bg-primary-500/20 text-white",
              ].join(" ")}
            >
              {n.locked && <Lock className="h-3 w-3" />}
              {n.label}
            </div>
          </foreignObject>
        ))}
      </svg>
      <p className="mt-3 text-sm leading-relaxed text-slate-400">
        We never recommend what a candidate isn&apos;t ready for — a locked
        objective stays out of the session plan until its prerequisites are
        met.
      </p>
    </div>
  );
}

function ColdStartPanel() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <PanelHeading eyebrow="Day one" title="Cold start" />
      <div className="flex flex-col items-center justify-center gap-6 py-6 sm:flex-row sm:gap-4">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/[0.05]"
              >
                <HelpCircle className="h-5 w-5 text-secondary-400" />
              </div>
            ))}
          </div>
          <p className="text-xs font-medium text-slate-400">
            First session&apos;s items double as diagnostic
          </p>
        </div>

        <div className="hidden text-2xl text-slate-600 sm:block">&rarr;</div>
        <div className="block text-2xl text-slate-600 sm:hidden">&darr;</div>

        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-emerald-400/60 bg-emerald-500/10">
            <Gauge className="h-7 w-7 text-emerald-300" />
          </div>
          <p className="text-xs font-medium text-slate-400">
            Calibrated starting state, per objective
          </p>
        </div>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">
        A short silent diagnostic — no separate placement test, no wasted
        session.
      </p>
    </div>
  );
}

export default function PrereqColdStart() {
  return (
    <SlideShell
      kicker="Under the hood — 2 of 2"
      title="Prerequisites and cold start"
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PrereqPanel />
        <ColdStartPanel />
      </div>
    </SlideShell>
  );
}
