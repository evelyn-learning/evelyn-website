import { Repeat, Mail, LayoutDashboard, PlayCircle } from "lucide-react";
import { SlideShell } from "@/components/showcase-deck/SlideShell";

const ITEMS = [
  { icon: Repeat, title: "Homework from the tutor", body: "After each session the tutor assigns practice on exactly what the student found hard, and checks it next time. Finished objectives come back for review before they fade." },
  { icon: Mail, title: "Weekly progress emails", body: "Time spent, lessons covered, what was mastered, what is still open — sent to the student, and to your career counsellor." },
  { icon: LayoutDashboard, title: "Admin dashboard", body: "Every student's sign-up, engagement stage, sessions and hours at a glance. The ones who stalled are highlighted, so the counsellor calls them before they drop." },
  { icon: PlayCircle, title: "Session replays", body: "Any lesson can be played back — whiteboard and audio — by the student or by your team." },
];

export default function OnTrack() {
  return (
    <SlideShell kicker="The self-paced problem" title="Keeping self-paced students on track" subtitle="You promise a career counsellor from day one. This is what gives that counsellor something to act on.">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {ITEMS.map((it) => (
          <div key={it.title} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <it.icon className="mt-0.5 h-7 w-7 flex-shrink-0 text-primary-300" />
            <div>
              <p className="text-lg font-semibold text-white">{it.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">{it.body}</p>
            </div>
          </div>
        ))}
      </div>
    </SlideShell>
  );
}
