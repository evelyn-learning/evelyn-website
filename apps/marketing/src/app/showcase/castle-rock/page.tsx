import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SHOWCASE } from "./_lib/config";
import { SOLUTIONS } from "./_solutions";

const POINTS = [
  {
    title: "Explained, not just answered",
    text: "Each solution walks through the reasoning in short steps, at the reading level of the course, and shows the working a student needs to follow it. The answer comes first, then the reasoning.",
  },
  {
    title: "A visual built for the question",
    text: "Graphs, vector diagrams and charts are drawn to scale from the numbers in the item, and build up as the explanation moves along.",
  },
  {
    title: "A tutor’s voice",
    text: "Students can listen to a tutor talk through the steps, or read the same solution in silence. Both are available on every sample.",
  },
  {
    title: "Created once, used by everyone",
    text: "A solution is prepared and checked once for each SOLARO item and then stored. Every student who opens that item sees the same one. Nothing is generated at the moment of the click, so there is no waiting and no cost per view.",
  },
];

export default function CastleRockOverviewPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-12 px-4 py-12 sm:px-6 sm:py-16">
      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary-600">Partner showcase</p>
        <h1 className="mt-3 font-heading text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">AI solutions for SOLARO, from Evelyn Learning</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-700">
          Castle Rock Research has helped students prepare for high-stakes exams for three decades, and SOLARO carries that work to schools, libraries and families. Evelyn Learning builds AI tutoring that teaches the way a good tutor does: one step at a time, on a whiteboard, in plain language.
        </p>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-700">
          This space is where the two meet. It holds worked AI solutions for real SOLARO items, so you can judge the quality for yourselves and show schools what an AI-supported SOLARO licence could look like.
        </p>
        <Link
          href={`${SHOWCASE.basePath}/solutions`}
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-600"
        >
          View the {SOLUTIONS.length} sample solutions <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <section aria-labelledby="cr-what">
        <h2 id="cr-what" className="font-heading text-2xl font-semibold text-slate-900">What an AI solution is</h2>
        <dl className="mt-6 grid gap-x-10 gap-y-7 sm:grid-cols-2">
          {POINTS.map((p) => (
            <div key={p.title}>
              <dt className="font-heading text-lg font-semibold text-slate-900">{p.title}</dt>
              <dd className="mt-1.5 leading-relaxed text-slate-700">{p.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="cr-next" className="border-t border-slate-200 pt-10">
        <h2 id="cr-next" className="font-heading text-2xl font-semibold text-slate-900">Where this can go</h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-slate-700">
          These first samples cover Math 30-1, Physics 30, Chemistry 30 and Biology 30. Two of them were solved from the question alone, with no answer key. The same format extends to any SOLARO course and item type, and it sits comfortably beside a live Evelyn tutor for students who want to ask a follow-up question.
        </p>
        <p className="mt-4 max-w-2xl leading-relaxed text-slate-700">More sections will be added to this showcase as the partnership takes shape.</p>
      </section>
    </div>
  );
}
