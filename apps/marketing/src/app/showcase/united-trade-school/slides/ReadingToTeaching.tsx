import { ArrowRight } from "lucide-react";
import { SlideShell } from "@/components/showcase-deck/SlideShell";

const STEPS = [
  { title: "Your Phase 2 outline", body: "Anatomy · pharmacy law · medications · pharmacy math (100 hours)" },
  { title: "Learning objectives", body: "Broken into ~25 objectives you review and approve" },
  { title: "Tutor lesson plans", body: "Each objective becomes a lesson the tutor teaches: hook, concept, worked example, try it, check, recap" },
  { title: "Practice, notes, mocks", body: "Every objective gets practice questions and notes; each phase gets quizzes and a unit test" },
];

export default function ReadingToTeaching() {
  return (
    <SlideShell
      kicker="How it works"
      title="From reading material to taught lessons"
      subtitle="We don't replace your curriculum — we make it teach. Your written content is the source; the tutor is the instructor."
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {STEPS.map((s, i) => (
          <div key={s.title} className="relative rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <span className="font-mono text-xs text-primary-300">0{i + 1}</span>
            <p className="mt-2 text-lg font-semibold text-white">{s.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.body}</p>
            {i < STEPS.length - 1 && (
              <ArrowRight className="absolute -right-4 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-slate-600 md:block" />
            )}
          </div>
        ))}
      </div>
      <p className="mt-8 text-base text-slate-400">
        Your subject expert reviews every lesson before a student sees it. The content we build for you belongs to United Trade School.
      </p>
    </SlideShell>
  );
}
