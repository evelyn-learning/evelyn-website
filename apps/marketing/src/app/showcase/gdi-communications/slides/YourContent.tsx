import { FileText, ListTree, CheckCircle2, Rocket } from "lucide-react";
import { SlideShell } from "@/components/showcase-deck/SlideShell";

const PATH = [
  { icon: FileText, title: "You send the material", text: "A PDF, slides or a syllabus. Today's two lessons came from \"Gambit Series: Advanced — Experiences\" and \"Meeting Skills Unit 1\" exactly as you sent them." },
  { icon: ListTree, title: "It becomes a lesson plan", text: "Goals, the order of segments, the exercises, the role-play scripts, the recap points. The tutor teaches from this plan, in your sequence, with your phrases." },
  { icon: CheckCircle2, title: "You review and approve", text: "Your trainers read the plan and the model sentences before any learner sees them. Changes are a text edit, not a rebuild." },
  { icon: Rocket, title: "It goes live under your name", text: "Published to your tenant, assigned to a client company or a learner. The content stays GDI's." },
];

export default function YourContent() {
  return (
    <SlideShell kicker="Your content" title="Your material becomes the lessons. Nothing generic." subtitle="A scenario — a customer meeting, a negotiation, a presentation — is a lesson plan with a role-play inside and a teacher persona to play the other side. The same engine runs it for a beginner and for an advanced speaker.">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {PATH.map((p, i) => (
          <div key={p.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-slate-500">0{i + 1}</span>
              <p.icon className="h-5 w-5 text-primary-300" />
            </div>
            <p className="mt-3 text-lg font-semibold text-white">{p.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{p.text}</p>
          </div>
        ))}
      </div>
    </SlideShell>
  );
}
