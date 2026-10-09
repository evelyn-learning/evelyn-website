import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SHOWCASE } from "../_lib/config";
import { SOLUTIONS, SUBJECT_ORDER } from "../_solutions";

export default function SampleSolutionsPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-12 sm:px-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-slate-900 sm:text-4xl">Sample AI Solutions</h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-slate-700">
          SOLARO items from each subject. Every solution states the answer first and then works through it step by step. Open one to read it in full, or press play to have a tutor walk through it with or without voice.
        </p>
      </div>
      {SUBJECT_ORDER.map((subject) => {
        const items = SOLUTIONS.filter((s) => s.subject === subject);
        if (items.length === 0) return null;
        return (
          <section key={subject} aria-labelledby={`cr-${subject}`}>
            <h2 id={`cr-${subject}`} className="text-xs font-semibold uppercase tracking-widest text-slate-500">{subject}</h2>
            <ul className="mt-3 flex list-none flex-col gap-3 p-0">
              {items.map((s) => (
                <li key={s.itemId}>
                  <Link
                    href={`${SHOWCASE.basePath}/solutions/${s.itemId}`}
                    className="group flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 transition-colors hover:border-primary-400"
                  >
                    <span className="min-w-0">
                      <span className="block font-heading text-lg font-semibold text-slate-900">{s.title}</span>
                      {s.independent && <span className="mt-1 inline-block rounded-full border border-slate-400 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-slate-600">Solved without an answer key</span>}
                      <span className="mt-0.5 block text-sm text-slate-600">
                        {s.course} &middot; Item {s.itemId} &middot; {s.itemType} &middot; {s.topic}
                      </span>
                    </span>
                    <ArrowRight className="h-5 w-5 shrink-0 text-slate-400 transition-colors group-hover:text-primary-600" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
