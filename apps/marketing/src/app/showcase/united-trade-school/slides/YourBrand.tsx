import { SlideShell } from "@/components/showcase-deck/SlideShell";

export default function YourBrand() {
  return (
    <SlideShell kicker="White-label" title="It's your school. Your students never see ours." subtitle="Evelyn Academy already runs two very different live products on one codebase — a structured course academy and an open tutoring site. A brand is configuration, not a rebuild.">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2">
        <div className="flex items-center gap-2 rounded-xl bg-slate-800/80 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span className="ml-3 rounded-md bg-slate-950 px-3 py-1 font-mono text-sm text-slate-300">https://learn.unitedtradeschool.com/app/courses/pharmacy-technician</span>
        </div>
        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
          {[
            ["Your name, domain and colours", "learn.unitedtradeschool.com, your logo, your palette — set up in days."],
            ["Your programs, your content", "Pharmacy Technician and Medical Admin Assistant as courses; the adapted content is yours."],
            ["Your admin console", "Enrol students, assign counsellors, watch progress, replay sessions, export data."],
          ].map(([t, b]) => (
            <div key={t}>
              <p className="text-lg font-semibold text-white">{t}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">{b}</p>
            </div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
}
