import { Radar, Brain, CalendarClock, BookOpen, RefreshCw } from "lucide-react";
import { SlideShell } from "../SlideShell";
import { COLORS } from "../theme";

const STEPS = [
  {
    x: 30,
    y: 30,
    icon: Radar,
    step: "01",
    title: "Evidence",
    caption: "Every answer, hint, and session outcome — mock exams, quizzes, practice items, lessons, tutor turns.",
  },
  {
    x: 570,
    y: 30,
    icon: Brain,
    step: "02",
    title: "Learner model",
    caption: "A per-objective mastery estimate updates with each response — a confidence band, not just a percent.",
  },
  {
    x: 570,
    y: 400,
    icon: CalendarClock,
    step: "03",
    title: "Session planner",
    caption: "Decides what's next: skip what's mastered, target confirmed gaps, schedule review before forgetting.",
  },
  {
    x: 30,
    y: 400,
    icon: BookOpen,
    step: "04",
    title: "Learning experience",
    caption: "A lesson, AI tutor conversation, or practice session — grounded in the objective the planner selected.",
  },
] as const;

const CARD_W = 400;
const CARD_H = 150;

export default function AdaptiveLoop() {
  return (
    <SlideShell
      kicker="How it works"
      title="The adaptive loop"
      subtitle="One loop, run continuously, for every candidate, across the full objective set — no candidate or director has to decide what to study next."
    >
      <svg
        viewBox="0 0 1000 580"
        className="mx-auto h-auto w-full max-w-[980px]"
        role="img"
        aria-label="Cycle diagram: Evidence feeds the learner model, which feeds the session planner, which produces a learning experience, which generates new evidence."
      >
        <defs>
          <marker
            id="loop-arrowhead"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill={COLORS.secondary400} />
          </marker>
        </defs>

        {/* Perimeter connectors, clockwise: Evidence -> Learner model -> Session planner -> Learning experience -> Evidence */}
        <path d="M430,105 H565" stroke={COLORS.secondary400} strokeWidth={3} fill="none" markerEnd="url(#loop-arrowhead)" />
        <path d="M770,180 V395" stroke={COLORS.secondary400} strokeWidth={3} fill="none" markerEnd="url(#loop-arrowhead)" />
        <path d="M570,475 H435" stroke={COLORS.secondary400} strokeWidth={3} fill="none" markerEnd="url(#loop-arrowhead)" />
        <path d="M230,400 V185" stroke={COLORS.secondary400} strokeWidth={3} fill="none" markerEnd="url(#loop-arrowhead)" />

        {/* Center label */}
        <foreignObject x={365} y={225} width={270} height={130}>
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-center">
            <RefreshCw className="h-6 w-6 text-primary-300" />
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              Continuous
            </p>
            <p className="text-sm leading-snug text-slate-300">
              Every candidate, every session, across all ~37 objectives
            </p>
          </div>
        </foreignObject>

        {STEPS.map((s) => (
          <foreignObject key={s.title} x={s.x} y={s.y} width={CARD_W} height={CARD_H}>
            <div className="flex h-full w-full items-start gap-4 rounded-2xl border border-white/15 bg-white/[0.05] p-5">
              <div className="flex flex-shrink-0 flex-col items-center gap-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-500 text-sm font-bold text-white">
                  {s.step}
                </div>
                <s.icon className="h-6 w-6 text-secondary-400" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">{s.title}</p>
                <p className="mt-1 text-sm leading-snug text-slate-300">
                  {s.caption}
                </p>
              </div>
            </div>
          </foreignObject>
        ))}
      </svg>
    </SlideShell>
  );
}
