import { Download } from "lucide-react";

const PACKET = "/showcase/castle-rock/packets/193246";
const ZIP = "/showcase/castle-rock/packets/solaro-ai-solution-193246.zip";

const FACTS = [
  { title: "Self-contained", text: "One folder per item: a flat XHTML page, its images and its audio. No scripts, no web fonts, no tracking and no request to any server but yours." },
  { title: "Reflows on any screen", text: "Plain text and headings that wrap to the width they are given. No image is wider than 240 px." },
  { title: "Voice travels with it", text: "One short audio file per step sits inside the packet, so a student can replay a single step. Nothing is streamed from outside." },
  { title: "Answer first", text: "The correct answer is confirmed at the top, followed by the step-by-step working." },
];

export default function PacketPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-12 sm:px-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-slate-900 sm:text-4xl">Packet for SOLARO</h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-slate-700">
          The sample solutions in this showcase are built to be watched. This page shows the same Chemistry 30 solution (Item 193246) in the form it would be handed over for SOLARO itself: a static packet your team hosts on your own servers. It is a first prototype for your technical review.
        </p>
      </div>

      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex flex-col gap-8">
          <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {FACTS.map((f) => (
              <div key={f.title}>
                <dt className="font-heading text-lg font-semibold text-slate-900">{f.title}</dt>
                <dd className="mt-1 leading-relaxed text-slate-700">{f.text}</dd>
              </div>
            ))}
          </dl>

          <div>
            <h2 className="font-heading text-xl font-semibold text-slate-900">What is in the folder</h2>
            <ul className="mt-3 flex list-none flex-col gap-1.5 p-0 font-mono text-sm text-slate-800">
              <li>solution.html <span className="font-sans text-slate-500">the solution, XHTML 1.0</span></li>
              <li>img/fig-1.png, img/fig-2.png <span className="font-sans text-slate-500">figures, shown at 240 px wide</span></li>
              <li>audio/step-1.mp3 … step-5.mp3 <span className="font-sans text-slate-500">tutor voice, one file per step</span></li>
              <li>README.txt <span className="font-sans text-slate-500">notes and questions for your technical team</span></li>
            </ul>
            <a href={ZIP} download className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary-500 px-5 py-3 font-semibold text-white transition-colors hover:bg-primary-600">
              <Download className="h-4 w-4" /> Download the packet (.zip)
            </a>
          </div>

          <div>
            <h2 className="font-heading text-xl font-semibold text-slate-900">Still to settle with your team</h2>
            <p className="mt-2 max-w-2xl leading-relaxed text-slate-700">
              Whether the audio player element is acceptable or voice should be a plain link, which image format you prefer, how SOLARO marks up maths, and whether a small script is allowed so that steps can appear in time with the voice. The README inside the packet lists these.
            </p>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500">Preview at phone width</p>
          <iframe
            src={`${PACKET}/solution.html`}
            title="Flat packet preview for Item 193246"
            className="h-[640px] w-full max-w-[340px] rounded-2xl border border-slate-300 bg-white"
          />
        </div>
      </div>
    </div>
  );
}
