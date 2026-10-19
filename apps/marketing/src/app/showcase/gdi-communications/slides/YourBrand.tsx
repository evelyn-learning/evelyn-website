import { SlideShell } from "@/components/showcase-deck/SlideShell";

export default function YourBrand() {
  return (
    <SlideShell kicker="White-label" title="It's GDI's tutor. Your learners never see our name." subtitle="The brand is configuration on a product that already runs several live brands — your domain, logo and colours, your teacher names, your client companies as groups. Days to set up once the pilot is signed.">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2">
        <div className="flex items-center gap-2 rounded-xl bg-slate-800/80 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span className="ml-3 rounded-md bg-slate-950 px-3 py-1 font-mono text-sm text-slate-300">https://english.gdicommunications.com/lessons/meeting-skills-1</span>
        </div>
        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
          {[
            ["Your name, domain and colours", "Your logo on the page, your palette, your domain. The tutor introduces itself with the name you give it."],
            ["Your teachers", "Ryota and Jameson are placeholders. Name your own personas, choose their voices, set how much Japanese each one uses."],
            ["Your clients, resold under your name", "Each client company is a group in your tenant with its own learners and its own report. The agreement covers resale."],
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
