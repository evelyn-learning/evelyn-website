import { Download } from "lucide-react";

const STANDARD_PACKET = "/showcase/castle-rock/packets/193246";
const STANDARD_ZIP = "/showcase/castle-rock/packets/solaro-ai-solution-193246.zip";
const PREMIUM_PAGE = "/showcase/castle-rock/premium/239622/solution.html";
const PREMIUM_ZIP = "/showcase/castle-rock/packets/solaro-ai-solution-premium-239622.zip";

const SHARED = [
  { title: "Self-contained", text: "One folder per item, hosted by SOLARO. No web fonts, no tracking and no request to any server but yours. All paths inside the folder are relative." },
  { title: "Answer first", text: "The correct answer is confirmed at the top, followed by the step-by-step working, in the conventions your reviewers asked for." },
  { title: "Voice travels with it", text: "One short audio file per step sits inside the folder, so a student can replay a single step. Nothing is streamed from outside." },
  { title: "Equations as images", text: "Where an equation cannot be typed as ordinary text it is supplied as a PNG rendered the way SOLARO renders its own maths, with the equation in words as alt text." },
];

const STANDARD_FILES = [
  ["solution.html", "the solution, XHTML, in the same step structure as a SOLARO solution"],
  ["img/fig-1.png, img/fig-2.png", "figures"],
  ["audio/step-1.mp3 … step-5.mp3", "tutor voice, one file per step"],
  ["README.txt", "notes for the technical team"],
];

const PREMIUM_FILES = [
  ["solution.html", "the whole solution: board, player, written steps and the small script that runs them, in one file"],
  ["audio/step-1.mp3 … step-5.mp3", "tutor voice, one file per step"],
  ["README.txt", "the frame height and notes for the technical team"],
];

function FileList({ files }: { files: string[][] }) {
  return (
    <ul className="mt-3 flex list-none flex-col gap-1.5 p-0 font-mono text-sm text-slate-800">
      {files.map(([name, note]) => (
        <li key={name}>
          {name} <span className="font-sans text-slate-500">{note}</span>
        </li>
      ))}
    </ul>
  );
}

export default function PacketPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-4 py-12 sm:px-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-slate-900 sm:text-4xl">Packet for SOLARO</h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-slate-700">
          The solutions in this showcase are built to be watched here. This page shows the form they take when handed over: one zip per item, which SOLARO hosts on its own servers. Both grades follow the same rules; the premium grade adds one small script, so it is shown inside a frame.
        </p>
        <dl className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
          {SHARED.map((f) => (
            <div key={f.title}>
              <dt className="font-heading text-lg font-semibold text-slate-900">{f.title}</dt>
              <dd className="mt-1 leading-relaxed text-slate-700">{f.text}</dd>
            </div>
          ))}
        </dl>
      </div>

      <section aria-labelledby="cr-pk-standard" className="grid items-start gap-10 border-t border-slate-200 pt-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Standard grade</p>
          <h2 id="cr-pk-standard" className="mt-1 font-heading text-2xl font-semibold text-slate-900">Chemistry 30, Item 193246</h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-slate-700">
            Plain markup, images and audio, with no script. It drops into a SOLARO solution panel as it is and reflows to whatever width the panel has.
          </p>
          <FileList files={STANDARD_FILES} />
          <a href={STANDARD_ZIP} download className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary-500 px-5 py-3 font-semibold text-white transition-colors hover:bg-primary-600">
            <Download className="h-4 w-4" /> Download the standard packet (.zip)
          </a>
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500">Preview at phone width</p>
          <iframe
            src={`${STANDARD_PACKET}/solution.html`}
            title="Standard packet preview for Item 193246"
            className="h-[560px] w-full max-w-[340px] rounded-2xl border border-slate-300 bg-white"
          />
        </div>
      </section>

      <section aria-labelledby="cr-pk-premium" className="grid items-start gap-10 border-t border-slate-200 pt-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Premium grade</p>
          <h2 id="cr-pk-premium" className="mt-1 font-heading text-2xl font-semibold text-slate-900">Chemistry 30, Item 239622</h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-slate-700">
            One page that carries its own figure, player and script, shown in a frame of a height we set for each item. The frame keeps the board and the caption in view while the voice plays; the written solution scrolls beside them on a wide screen and below them on a phone.
          </p>
          <FileList files={PREMIUM_FILES} />
          <a href={PREMIUM_ZIP} download className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary-500 px-5 py-3 font-semibold text-white transition-colors hover:bg-primary-600">
            <Download className="h-4 w-4" /> Download the premium packet (.zip)
          </a>
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500">Preview at phone width</p>
          <iframe
            src={PREMIUM_PAGE}
            title="Premium packet preview for Item 239622"
            className="h-[620px] w-full max-w-[340px] rounded-2xl border border-slate-300 bg-white"
          />
        </div>
      </section>

      <section aria-labelledby="cr-pk-agreed" className="border-t border-slate-200 pt-10">
        <h2 id="cr-pk-agreed" className="font-heading text-xl font-semibold text-slate-900">Agreed with your technical team</h2>
        <p className="mt-2 max-w-2xl leading-relaxed text-slate-700">
          One zip per item id. Audio through the standard audio element. Figures as PNG, equations as images in SOLARO’s own rasterised style, no MathML. Class names carry a prefix so nothing touches your stylesheet. The premium page runs in a frame whose height we set per item. Both packets will be re-cut to SOLARO’s exact solution markup before the first delivery.
        </p>
      </section>
    </div>
  );
}
