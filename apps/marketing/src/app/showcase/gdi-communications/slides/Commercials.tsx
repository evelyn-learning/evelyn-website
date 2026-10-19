import { SlideShell } from "@/components/showcase-deck/SlideShell";

export default function Commercials() {
  return (
    <SlideShell kicker="Pilot pricing" title="Pay for learners who use it. Nothing else." subtitle="As in my email: a three-month pilot with one or two of your client companies and a first set of your lessons and scenarios.">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-primary-400/40 bg-primary-500/15 p-6 md:col-span-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-200">Per active learner</p>
          <p className="mt-3 font-heading text-5xl font-bold text-white">USD 25<span className="text-xl font-medium text-slate-300"> / month</span></p>
          <p className="mt-3 text-base leading-relaxed text-slate-200">Includes 120 minutes of voice practice per learner, pooled across the client company.</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Beyond the pool</p>
          <p className="mt-3 font-heading text-4xl font-bold text-white">USD 0.18<span className="text-lg font-medium text-slate-400"> / minute</span></p>
          <p className="mt-3 text-base leading-relaxed text-slate-300">Only when a company uses more than its pooled minutes in a month.</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">One-time setup</p>
          <p className="mt-3 font-heading text-4xl font-bold text-white">Quoted</p>
          <p className="mt-3 text-base leading-relaxed text-slate-300">The GDI brand, the Japanese configuration and loading your first content. Kept modest for the pilot; in writing after today.</p>
        </div>
      </div>
      <ul className="mt-8 grid grid-cols-1 gap-3 text-base text-slate-300 md:grid-cols-3">
        <li className="rounded-xl border border-white/10 px-4 py-3">Charged only for learners who use the platform in a month.</li>
        <li className="rounded-xl border border-white/10 px-4 py-3">No minimum during the pilot.</li>
        <li className="rounded-xl border border-white/10 px-4 py-3">Resale to your clients under your name is included.</li>
      </ul>
    </SlideShell>
  );
}
