import {
  Smartphone,
  CalendarCheck,
  GraduationCap,
  NotebookPen,
  LineChart,
} from "lucide-react";
import { SlideShell } from "../SlideShell";

const STEPS = [
  {
    icon: Smartphone,
    title: "Opens the app",
    caption: "One place, no decisions to make about what to study.",
  },
  {
    icon: CalendarCheck,
    title: "Today's session, already assembled",
    caption: "Due reviews plus the weakest objectives, planned for them.",
  },
  {
    icon: GraduationCap,
    title: "Adaptive lesson, AI tutor",
    caption: "Grounded in the specific objective the planner selected.",
  },
  {
    icon: NotebookPen,
    title: "Notes that accumulate",
    caption: "Built from their own sessions, not a static PDF.",
  },
  {
    icon: LineChart,
    title: "A readiness projection they trust",
    caption: "Rolled up from the objective-level model, with its evidence.",
  },
];

export default function CandidateExperience() {
  return (
    <SlideShell
      kicker="What the candidate experiences"
      title="A day in the life"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {STEPS.map((s, i) => (
          <div key={s.title} className="relative flex flex-col">
            <div className="flex items-center gap-3 lg:flex-col lg:items-start lg:gap-0">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-primary-400/40 bg-primary-500/15 lg:mb-4">
                <s.icon className="h-5 w-5 text-primary-300" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 lg:hidden">
                Step {i + 1}
              </span>
            </div>
            <p className="mt-3 text-base font-bold leading-snug text-white lg:mt-0">
              {s.title}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
              {s.caption}
            </p>
          </div>
        ))}
      </div>
    </SlideShell>
  );
}
