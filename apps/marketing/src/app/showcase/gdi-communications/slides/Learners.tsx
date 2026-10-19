import { Languages, Mic, Gauge, Smartphone } from "lucide-react";
import { SlideShell } from "@/components/showcase-deck/SlideShell";

const POINTS = [
  { icon: Languages, title: "Both languages, one tutor", text: "Japanese for explanations, instructions and reassurance. English for everything the learner practises. The tutor understands a reply in either language." },
  { icon: Gauge, title: "Set per learner, fades with level", text: "A true beginner hears mostly Japanese guidance. An intermediate learner hears almost none unless they ask. The same lesson runs differently for each." },
  { icon: Mic, title: "Voice first", text: "The learner talks; the tutor listens, answers in about a second, and puts the English on the board so they see what they are saying." },
  { icon: Smartphone, title: "Browser, no app", text: "A link opens the lesson on a laptop or a phone. Fifteen to twenty minutes, which fits a lunch break or the end of a working day." },
];

export default function Learners() {
  return (
    <SlideShell kicker="Who it is for" title="Built for Japanese professionals, from true beginner to intermediate" subtitle="The learners you described: adults at your client companies who need English for work, not for an exam, and who learn best when the explanation comes in their own language.">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {POINTS.map((p) => (
          <div key={p.title} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p.icon className="mt-1 h-6 w-6 flex-shrink-0 text-primary-300" />
            <div>
              <p className="text-lg font-semibold text-white">{p.title}</p>
              <p className="mt-1 text-base leading-relaxed text-slate-300">{p.text}</p>
            </div>
          </div>
        ))}
      </div>
    </SlideShell>
  );
}
