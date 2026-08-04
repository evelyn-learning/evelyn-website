import { notFound } from "next/navigation";
import type { Metadata } from "next";
import dynamicImport from "next/dynamic";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import { SOLUTION_SEGMENTS, getSegment, BOOKING_URL } from "@/data/solutions";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import CrimsoraClientStory from "../components/CrimsoraClientStory";

// Server component: no `ssr: false` (disallowed for next/dynamic in Server
// Components) — VoiceTutorLiveDemo is itself a 'use client' module, so the
// client boundary is already established there. Same pattern the guide
// (src/app/products/voice-tutor/page.tsx) uses, minus the ssr:false option
// that only applies from a 'use client' page.
const VoiceTutorLiveDemo = dynamicImport(() => import("@/components/demos/VoiceTutorLiveDemo"));

export function generateStaticParams() {
  return SOLUTION_SEGMENTS.map((s) => ({ segment: s.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ segment: string }> },
): Promise<Metadata> {
  const { segment } = await params;
  const s = getSegment(segment);
  if (!s) return {};
  return {
    title: s.metaTitle,
    description: s.metaDescription,
    alternates: { canonical: `/solutions/${s.slug}` },
    openGraph: { title: s.metaTitle, description: s.metaDescription },
  };
}

export default async function SolutionSegmentPage(
  { params }: { params: Promise<{ segment: string }> },
) {
  const { segment } = await params;
  const s = getSegment(segment);
  if (!s) notFound();

  const cta = BOOKING_URL ?? `/contact?segment=${s.slug}&demo=true`;
  const ctaIsExternal = Boolean(BOOKING_URL);
  const ctaExternalProps = ctaIsExternal
    ? ({ target: "_blank", rel: "noopener noreferrer" } as const)
    : {};

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Solutions", url: "/solutions" },
          { name: s.name, url: `/solutions/${s.slug}` },
        ]}
      />

      {/* Hero: gradient per /industries/test-prep idiom, standardized on
          primary tokens (no raw purple-600). */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-primary-700 via-primary-600 to-primary-900 overflow-hidden">
        <div className="container-wide">
          <nav className="flex items-center gap-2 text-primary-200 text-sm mb-8">
            <Link href="/solutions" className="hover:text-white">
              Solutions
            </Link>
            <span>/</span>
            <span className="text-white">{s.name}</span>
          </nav>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-5">
              {s.heroTitle}
            </h1>
            <p className="text-xl text-primary-100 mb-8">{s.heroSub}</p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#demo"
                className="px-6 py-3 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition"
              >
                Try the live demo
              </a>
              <a
                href={cta}
                {...ctaExternalProps}
                className="px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition"
              >
                Book a call
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* TIME eyebrow: text pill linking to /press/time-top-edtech-2026 —
          copies the homepage RecognitionStrip treatment verbatim
          (src/app/page.tsx:60-79). */}
      <Link
        href="/press/time-top-edtech-2026"
        className="group block bg-slate-900 border-b border-white/10 hover:bg-slate-800 transition-colors"
      >
        <div className="container-wide py-2.5">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-x-3 gap-y-1 text-center">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-300">
              Recognition
            </span>
            <span className="text-sm text-slate-100">
              TIME 2026: Ranked #9 in America&apos;s Top EdTech · #35 in the World
            </span>
            <ArrowRight className="hidden sm:inline-block w-4 h-4 text-primary-300 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>

      {/* Pain framing: two-column problem/solution cards from s.pains */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-wide">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-10 text-center">
            What&apos;s standing in the way
          </h2>
          <div className="max-w-4xl mx-auto space-y-6">
            {s.pains.map((pain, idx) => (
              <div
                key={idx}
                className="grid md:grid-cols-2 rounded-2xl border border-slate-100 overflow-hidden md:divide-x md:divide-slate-100"
              >
                <div className="bg-slate-50 p-6 md:p-8">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    The problem
                  </p>
                  <p className="text-slate-700">{pain.problem}</p>
                </div>
                <div className="bg-primary-50 p-6 md:p-8">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 mb-2 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    How Evelyn helps
                  </p>
                  <p className="text-slate-800">{pain.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo: real embed behind a click-to-start cover, preloaded with
          this segment's lessons. Neutral branding — no branding override. */}
      <section id="demo" className="py-16 md:py-20 bg-slate-50">
        <div className="container-wide">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-1 rounded-full text-sm font-medium mb-4">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Live demo
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              See Evelyn tutor {s.demoSubject}
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              {s.demoSubject} · {s.demoLevel} — pick a lesson and start talking. This
              is the real tutor, not a video. No signup, ~2 minutes.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <VoiceTutorLiveDemo lessons={s.demoLessons} source={`solutions-${s.slug}`} />
          </div>
        </div>
      </section>

      {s.showCrimsora && <CrimsoraClientStory />}

      {/* CTA band */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary-700 to-primary-900">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to bring Evelyn to {s.name}?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Book a call and we&apos;ll walk through what a rollout looks
              like for your program.
            </p>
            <a
              href={cta}
              {...ctaExternalProps}
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition"
            >
              Book a call
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
