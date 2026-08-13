import { SlideShell } from "../SlideShell";
import { COLORS } from "../theme";

const SOURCES = [
  { label: "Mock", color: COLORS.amber },
  { label: "Quiz", color: COLORS.secondary400 },
  { label: "Practice", color: COLORS.primary300 },
  { label: "Lesson", color: COLORS.textFaint },
];

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

function AbilityPanel() {
  const points = [
    { x: 70, y: 230, color: COLORS.textFaint },
    { x: 130, y: 205, color: COLORS.primary300 },
    { x: 190, y: 175, color: COLORS.primary300 },
    { x: 250, y: 150, color: COLORS.secondary400 },
    { x: 320, y: 110, color: COLORS.amber },
    { x: 390, y: 80, color: COLORS.secondary400 },
  ];
  const line = points.map((p) => `${p.x},${p.y}`).join(" L");
  const band =
    "M70,185 L130,167 L190,145 L250,126 L320,94 L390,70 " +
    "L390,90 L320,126 L250,174 L190,205 L130,243 L70,275 Z";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <PanelHeading eyebrow="Per objective" title="Ability estimate, with confidence" />
      <svg viewBox="0 0 460 300" className="w-full" role="img" aria-label="Line chart of a rising ability estimate with a narrowing confidence band, plotted from six responses of different evidence sources.">
        <line x1={60} y1={40} x2={60} y2={260} stroke={COLORS.border} strokeWidth={1.5} />
        <line x1={60} y1={260} x2={410} y2={260} stroke={COLORS.border} strokeWidth={1.5} />
        <text x={30} y={45} fill={COLORS.textMuted} fontSize={13} transform="rotate(-90 30 150)" textAnchor="middle">
          Ability
        </text>
        <text x={235} y={286} fill={COLORS.textMuted} fontSize={13} textAnchor="middle">
          Responses over time
        </text>
        <path d={band} fill={COLORS.primary500} fillOpacity={0.18} stroke="none" />
        <path d={`M${line}`} fill="none" stroke={COLORS.secondary300} strokeWidth={2.5} />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={7} fill={p.color} stroke={COLORS.bgBase} strokeWidth={2} />
        ))}
      </svg>
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
        {SOURCES.map((s) => (
          <span key={s.label} className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-400">
        Elo-family updates, evidence-weighted by source: mock &gt; quiz &gt;
        practice &gt; lesson.
      </p>
    </div>
  );
}

function ForgettingPanel() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <PanelHeading eyebrow="Spaced review" title="Forgetting curve, scheduled ahead of the dip" />
      <svg viewBox="0 0 460 300" className="w-full" role="img" aria-label="Exponential forgetting curve with a review scheduled before retention crosses a mastery threshold.">
        <line x1={60} y1={40} x2={60} y2={260} stroke={COLORS.border} strokeWidth={1.5} />
        <line x1={60} y1={260} x2={410} y2={260} stroke={COLORS.border} strokeWidth={1.5} />
        <text x={30} y={45} fill={COLORS.textMuted} fontSize={13} transform="rotate(-90 30 150)" textAnchor="middle">
          Retention
        </text>
        <text x={235} y={286} fill={COLORS.textMuted} fontSize={13} textAnchor="middle">
          Time since last review
        </text>

        {/* Mastery threshold */}
        <line x1={60} y1={150} x2={410} y2={150} stroke={COLORS.rose} strokeWidth={1.5} strokeDasharray="5 5" />
        <text x={400} y={143} fill={COLORS.rose} fontSize={11} textAnchor="end">
          mastery threshold
        </text>

        {/* Decay curve */}
        <path
          d="M75,65 C160,72 230,105 300,150 C345,178 385,210 405,235"
          fill="none"
          stroke={COLORS.secondary300}
          strokeWidth={2.5}
        />

        {/* Predicted dip (unscheduled) */}
        <circle cx={300} cy={150} r={6} fill="none" stroke={COLORS.rose} strokeWidth={2} strokeDasharray="3 3" />
        <line x1={300} y1={150} x2={300} y2={260} stroke={COLORS.rose} strokeWidth={1} strokeDasharray="3 3" />
        <text x={300} y={273} fill={COLORS.rose} fontSize={11} textAnchor="middle">
          predicted dip
        </text>

        {/* Review scheduled, before the dip */}
        <circle cx={220} cy={122} r={8} fill={COLORS.emerald} stroke={COLORS.bgBase} strokeWidth={2} />
        <line x1={220} y1={122} x2={220} y2={260} stroke={COLORS.emerald} strokeWidth={1} strokeDasharray="3 3" />
        <text x={220} y={38} fill={COLORS.emerald} fontSize={12} fontWeight={600} textAnchor="middle">
          review scheduled
        </text>
      </svg>
      <p className="mt-3 text-sm leading-relaxed text-slate-400">
        Spaced repetition with a per-LO half-life — review lands before the
        predicted dip, not after it.
      </p>
    </div>
  );
}

export default function AbilityForgetting() {
  return (
    <SlideShell
      kicker="Under the hood — 1 of 2"
      title="Per-objective ability, with a half-life"
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AbilityPanel />
        <ForgettingPanel />
      </div>
    </SlideShell>
  );
}
