import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SOLUTION_SEGMENTS } from "@/data/solutions";

export const metadata: Metadata = {
  title: "Solutions",
  // Deliberately generic (no per-segment enumeration) so this stays accurate
  // as SOLUTION_SEGMENTS changes — everything else on this page is
  // registry-derived; this description should be too, in spirit.
  description:
    "Live voice + whiteboard tutoring, tailored to how each kind of organization we work with puts it to use.",
  alternates: { canonical: "/solutions" },
};

export default function SolutionsPage() {
  return (
    <main>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900">
        <div className="container-wide">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Solutions
            </h1>
            <p className="text-xl text-slate-300">
              Live voice tutoring built around who you serve — a 1-on-1 experience that
              scales to every student, employee, or learner, whatever the setting.
            </p>
          </div>
        </div>
      </section>

      {/* Segment cards */}
      <section className="py-20 bg-white">
        <div className="container-wide">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SOLUTION_SEGMENTS.map((segment) => (
              <Link
                key={segment.slug}
                href={`/solutions/${segment.slug}`}
                className="group flex flex-col bg-slate-50 rounded-2xl p-8 hover:bg-white hover:shadow-xl transition-all border border-slate-100 hover:border-primary-100"
              >
                <h2 className="text-xl font-bold text-slate-900 group-hover:text-primary-500 transition-colors mb-3">
                  {segment.name}
                </h2>
                <p className="text-slate-600 flex-1">{segment.heroSub}</p>
                <span className="inline-flex items-center gap-1 text-primary-500 text-sm font-medium mt-6">
                  Learn more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-50">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Not Sure Where You Fit?
            </h2>
            <p className="text-xl text-slate-600 mb-8">
              Every organization is different. Let&apos;s talk about your students, your
              schedule, and where a live voice tutor fits into it.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition"
            >
              Let&apos;s Talk
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
