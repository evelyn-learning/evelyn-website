import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SHOWCASE } from "../_lib/config";
import { PREMIUM } from "../_lib/premium";

const DIFFERENCES = [
  { title: "The figure is the explanation", text: "Nothing derived is shown in advance. The board starts with only what the item gives, and each quantity is drawn at the moment the voice names it." },
  { title: "Something happens first", text: "The cars collide, the marker climbs the hill, the tile slides into place. The student sees the event before the method." },
  { title: "Questions a student would ask", text: "Short fold-outs answer the \"why\" at the point it comes up, a self-check sits before the final step, and a common slip is corrected at once." },
  { title: "A turn for the student", text: "After the explanation the board becomes a task: arrows to join, labels to place, numbers to drop into a formula. A wrong drop explains itself." },
  { title: "Explore and transfer", text: "A slider changes one quantity in the item and shows what follows. A second, similar problem with a hidden worked answer checks that the method transfers." },
  { title: "Still one folder", text: "Each page is a single file with its figure and audio beside it. No fonts, no requests to any server, nothing generated at the click. It is shown here exactly as SOLARO would show it, in a frame of fixed height." },
];

export default function PremiumSolutionsPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-12 sm:px-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-slate-900 sm:text-4xl">Premium AI Solutions</h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-slate-700">
          Four items, one per subject, built to a higher grade than the standard solutions. The written solution is still there, answer first, but the figure now builds up with the voice, the student can tap any step to hear it again, and the board turns into a short task at the end. Open one and press play.
        </p>
      </div>

      <ul className="flex list-none flex-col gap-3 p-0">
        {PREMIUM.map((p) => (
          <li key={p.itemId}>
            <Link
              href={`${SHOWCASE.basePath}/premium/${p.itemId}`}
              className="group flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 transition-colors hover:border-primary-400"
            >
              <span className="min-w-0">
                <span className="block text-xs font-semibold uppercase tracking-widest text-slate-500">{p.subject}</span>
                <span className="block font-heading text-lg font-semibold text-slate-900">{p.title}</span>
                {p.independent && <span className="mt-1 inline-block rounded-full border border-slate-400 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-slate-600">Solved without an answer key</span>}
                <span className="mt-0.5 block text-sm text-slate-600">
                  {p.course} &middot; Item {p.itemId} &middot; {p.itemType} &middot; {p.topic}
                </span>
                <span className="mt-1.5 block text-sm leading-relaxed text-slate-700">{p.blurb} <span className="text-slate-500">Practice: {p.practice} Voice: {p.voice}.</span></span>
              </span>
              <ArrowRight className="h-5 w-5 shrink-0 text-slate-400 transition-colors group-hover:text-primary-600" />
            </Link>
          </li>
        ))}
      </ul>

      <section aria-labelledby="cr-premium-what">
        <h2 id="cr-premium-what" className="font-heading text-2xl font-semibold text-slate-900">What makes a solution premium</h2>
        <dl className="mt-5 grid gap-x-10 gap-y-6 sm:grid-cols-2">
          {DIFFERENCES.map((d) => (
            <div key={d.title}>
              <dt className="font-heading text-lg font-semibold text-slate-900">{d.title}</dt>
              <dd className="mt-1 leading-relaxed text-slate-700">{d.text}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-slate-600">
          Two of the four items came without an answer key and were solved from the question alone; those answers are marked above so your team can confirm them.
        </p>
      </section>
    </div>
  );
}
