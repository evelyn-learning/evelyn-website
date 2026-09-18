import { BookOpen, Clock, Award, Briefcase } from "lucide-react";
import { SlideShell } from "@/components/showcase-deck/SlideShell";

const FACTS = [
  { icon: BookOpen, label: "Pharmacy Technician", value: "330 hours · 4 phases · reading-based" },
  { icon: BookOpen, label: "Medical Admin Assistant", value: "150 hours · 4 phases · virtual labs" },
  { icon: Clock, label: "Self-paced", value: "5 or 40 hrs/week · start any Monday" },
  { icon: Award, label: "Certification", value: "PTCB CPhT · NHA CMAA · vouchers included" },
  { icon: Briefcase, label: "Outcome promised", value: "Guaranteed interviews after passing" },
];

export default function WhereYouAre() {
  return (
    <SlideShell
      kicker="What we read on your site"
      title="Two programs, one promise: certify and get hired"
      subtitle="Self-paced and reading-based is the cheapest way to deliver — and the hardest way to finish. Every student who stalls costs you a certification and an interview."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FACTS.map((f) => (
          <div key={f.label} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <f.icon className="mt-0.5 h-6 w-6 flex-shrink-0 text-primary-300" />
            <div>
              <p className="text-base font-semibold text-white">{f.label}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">{f.value}</p>
            </div>
          </div>
        ))}
        <div className="flex items-center rounded-2xl border border-amber-400/30 bg-amber-400/10 p-5">
          <p className="text-sm leading-relaxed text-amber-100">
            The national PTCB first-time pass rate is about <span className="font-semibold text-white">70%</span>.
            Three in ten of your graduates would walk away without the credential — and without the interview.
          </p>
        </div>
      </div>
    </SlideShell>
  );
}
