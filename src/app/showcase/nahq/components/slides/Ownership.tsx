import { Building2, Database, ShieldCheck, Users } from "lucide-react";
import { SlideShell } from "../SlideShell";

const ITEMS = [
  {
    icon: Building2,
    title: "NAHQ owns the content",
    description:
      "The blueprint course, the item bank, and every piece of branded material are NAHQ's — not licensed back to you, not shared with other customers.",
  },
  {
    icon: Database,
    title: "NAHQ owns candidate data",
    description:
      "Candidate records, response history, and mastery data are NAHQ's, exportable at any time in a standard format — no lock-in.",
  },
  {
    icon: ShieldCheck,
    title: "Evelyn builds, hosts, and operates",
    description:
      "A managed white-label deployment on Evelyn's platform — not a software transfer. Your candidates never see Evelyn's brand.",
  },
  {
    icon: Users,
    title: "SMEs stay in the loop",
    description:
      "Every generated item passes NAHQ's subject-matter experts before a candidate sees it. Generation drafts; your reviewers decide.",
  },
];

export default function Ownership() {
  return (
    <SlideShell
      kicker="Before you ask"
      title="Who owns what"
      subtitle="This is a managed white-label deployment, not a software transfer — and the ownership lines are drawn on purpose."
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {ITEMS.map((item) => (
          <div
            key={item.title}
            className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5"
          >
            <item.icon className="mt-0.5 h-7 w-7 flex-shrink-0 text-primary-300" />
            <div>
              <p className="text-lg font-semibold text-white">{item.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </SlideShell>
  );
}
