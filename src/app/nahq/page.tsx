import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Gauge,
  ListTree,
  Eye,
  Radar,
  Brain,
  CalendarClock,
  LineChart,
  ShieldCheck,
  Building2,
  Database,
  Users,
  CheckCircle2,
  Mail,
  Phone,
} from "lucide-react";

// Unlisted: presented live to NAHQ (Sherry — Sr. Director of Professional
// Development, Frank — leads certification) on 2026-08-13 and left with them
// afterward. Not part of the public site — no nav entry, no sitemap entry,
// no indexing.
export const metadata: Metadata = {
  title: "Evelyn Learning for NAHQ — Adaptive CPHQ Preparation",
  description:
    "A working proposal for adaptive CPHQ exam preparation built on NAHQ's published content outline — pilot, full program, and platform license phases.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/nahq" },
};

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const loopSteps = [
  {
    step: "01",
    title: "Diagnose silently",
    icon: Radar,
    description:
      "A candidate's first sessions establish a baseline per objective without a separate placement test — every practice item and lesson interaction is diagnostic.",
  },
  {
    step: "02",
    title: "Model every response",
    icon: Brain,
    description:
      "Each response becomes evidence for one or more of the ~37 CPHQ objectives — updating a per-candidate, per-objective mastery estimate with a confidence and a trend, not just a percent-correct.",
  },
  {
    step: "03",
    title: "Plan the next session",
    icon: CalendarClock,
    description:
      "The model decides what happens next: skip what's mastered, target confirmed gaps, schedule spaced review before forgetting. No candidate or director has to decide what to study next.",
  },
  {
    step: "04",
    title: "Measure readiness",
    icon: LineChart,
    description:
      "A readiness projection rolls the objective-level model up into one number — visible to the candidate and, in the full program, to program leadership across a cohort.",
  },
];

const demoAgenda = [
  {
    title: "Live ingestion",
    description:
      "We'll ingest NAHQ's published outline into a second course, live, during the call — the same pipeline that produced the course you'll see next.",
  },
  {
    title: "A seeded candidate's dashboard",
    description:
      "Readiness projection, per-objective mastery with trend lines, a due-for-review queue, and a next-best-session recommendation.",
  },
  {
    title: "Lessons and the AI tutor",
    description:
      "Every lesson and every tutor conversation is grounded in a specific CPHQ objective — not a generic chat layer bolted on top.",
  },
  {
    title: "Generated practice",
    description:
      "Practice items aligned to the blueprint's domains and weights, generated against the same objective structure the model tracks.",
  },
];

type Phase = {
  label: string;
  name: string;
  timeline: string;
  price: string;
  priceNote?: string;
  items: string[];
  highlight?: boolean;
};

const phases: Phase[] = [
  {
    label: "Phase 1",
    name: "Pilot",
    timeline: "~6 weeks from kickoff",
    price: "$35,000",
    priceNote: "indicative — credited toward Phase 2 on continuation",
    items: [
      "CPHQ blueprint course productionized from NAHQ's published outline",
      "Cohort of up to 200 candidates",
      "NAHQ-reviewed content gates before candidates see anything",
      "Weekly readouts against agreed success metrics",
    ],
  },
  {
    label: "Phase 2",
    name: "Full program",
    timeline: "8–12 weeks",
    price: "$100,000–$150,000",
    priceNote: "indicative — depends on scope",
    items: [
      "SME item-review workflow: NAHQ's experts approve, edit, or reject every generated item before candidates see it",
      "Calibrated item bank and full-length practice exams",
      "NAHQ branding on a dedicated portal",
      "Cohort analytics for program leadership — readiness distribution, at-risk candidates, content-gap reports",
      "SSO / integrations",
      "Data-processing agreement",
    ],
    highlight: true,
  },
  {
    label: "Ongoing",
    name: "Managed platform license",
    timeline: "Per active candidate, per year",
    price: "$75–$100",
    priceNote: "indicative — volume-tiered",
    items: [
      "Hosting and operations",
      "Model / inference costs",
      "Continuous updates as the blueprint and item bank evolve",
    ],
  },
];

const ownership = [
  {
    icon: Building2,
    title: "NAHQ owns the content",
    description:
      "The blueprint course, the item bank, and every piece of branded material are NAHQ's — not licensed back to you, not shared with other customers.",
  },
  {
    icon: Database,
    title: "NAHQ owns candidate data",
    description:
      "Candidate records, response history, and mastery data are NAHQ's, exportable at any time in a standard format — no lock-in.",
  },
  {
    icon: ShieldCheck,
    title: "Evelyn builds, hosts, and operates",
    description:
      "A managed white-label deployment on Evelyn's platform — not a software transfer. Your candidates never see Evelyn's brand.",
  },
  {
    icon: Users,
    title: "SMEs stay in the loop",
    description:
      "Every generated item passes NAHQ's subject-matter experts before a candidate sees it. Generation drafts; your reviewers decide.",
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function NahqPage() {
  return (
    <main className="print:text-slate-900">
      {/* ------------------------------------------------------------- */}
      {/* Hero                                                          */}
      {/* ------------------------------------------------------------- */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 overflow-hidden print:bg-white print:py-10">
        <div className="absolute inset-0 opacity-20 print:hidden" aria-hidden="true">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(122, 42, 142, 0.3) 0%, transparent 50%),
                               radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)`,
            }}
          />
        </div>

        <div className="container-wide relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1 bg-white/10 border border-white/20 text-primary-200 rounded-full text-sm font-medium mb-6 print:bg-transparent print:border-slate-300 print:text-primary-700">
              Prepared for NAHQ
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight print:text-slate-900">
              Adaptive CPHQ preparation, built on NAHQ&apos;s own blueprint.
            </h1>
            <p className="text-xl text-slate-300 mb-6 leading-relaxed print:text-slate-700">
              Custom development is our core model, not a side offering — we
              build adaptive learning systems around a partner&apos;s
              credential rather than fit you into a fixed catalog. What
              follows is what that looks like for the CPHQ.
            </p>

            {/* Recognition — copies the homepage RecognitionStrip's exact
                phrasing/link (src/app/page.tsx), rendered inline here since
                a full-bleed black strip would fight the hero background. */}
            <Link
              href="/press/time-top-edtech-2026"
              className="group inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors print:text-slate-600"
            >
              <span className="font-semibold uppercase tracking-[0.14em] text-primary-300 text-[11px] print:text-primary-700">
                Recognition
              </span>
              <span>
                TIME 2026: Ranked #9 in America&apos;s Top EdTech · #35 in the World
              </span>
              <ArrowRight className="hidden sm:inline-block w-3.5 h-3.5 text-primary-300 group-hover:translate-x-1 transition-transform print:hidden" />
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* What we already built                                         */}
      {/* ------------------------------------------------------------- */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-wide">
          <div className="max-w-3xl mb-12">
            <span className="text-primary-500 font-semibold text-sm uppercase tracking-wider">
              Before this call
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-5">
              We started from your published blueprint
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Ahead of today, we ingested NAHQ&apos;s published CPHQ
              examination content outline into a working adaptive course —
              domains and weights preserved as published, broken down into
              roughly 37 learning objectives with prerequisite structure
              between them. Full lesson generation, practice, and
              per-candidate learner modeling are already running against it.
              This isn&apos;t a mockup — it&apos;s the system, seeded with
              your content.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mb-16">
            {[
              { icon: ListTree, label: "Domains and weights", detail: "preserved exactly as published in the outline" },
              { icon: BookOpen, label: "~37 learning objectives", detail: "with prerequisite structure between them" },
              { icon: Brain, label: "Lessons + AI tutor", detail: "generated and grounded per objective" },
              { icon: Gauge, label: "Per-candidate learner model", detail: "live on a seeded candidate account" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100"
              >
                <item.icon className="w-6 h-6 text-primary-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900">{item.label}</p>
                  <p className="text-sm text-slate-600 mt-0.5">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-100 overflow-hidden">
            <div className="bg-slate-900 px-6 py-4 print:bg-slate-100 print:border-b print:border-slate-200">
              <p className="text-white font-semibold print:text-slate-900">
                What you&apos;ll see on this call
              </p>
            </div>
            <div className="divide-y divide-slate-100">
              {demoAgenda.map((item, idx) => (
                <div key={item.title} className="flex gap-5 p-6">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-50 text-primary-600 font-bold text-sm flex items-center justify-center">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="text-slate-600 text-sm mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* How the loop works                                            */}
      {/* ------------------------------------------------------------- */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container-wide">
          <div className="max-w-3xl mb-14">
            <span className="text-primary-500 font-semibold text-sm uppercase tracking-wider">
              Under the hood
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-5">
              How the adaptive loop works
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              The same four-step loop runs for every candidate, every
              session, across the entire objective set.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {loopSteps.map((step) => (
              <div
                key={step.step}
                className="bg-white rounded-2xl p-6 border border-slate-100"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary-500 text-white font-bold flex items-center justify-center text-sm flex-shrink-0">
                    {step.step}
                  </div>
                  <step.icon className="w-5 h-5 text-primary-500" />
                  <h3 className="text-lg font-semibold text-slate-900">
                    {step.title}
                  </h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-4 bg-primary-50 border border-primary-100 rounded-2xl p-6">
            <Eye className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900 mb-1">
                Every estimate carries its evidence
              </p>
              <p className="text-slate-700 text-sm leading-relaxed">
                For a high-stakes credential, a mastery score or readiness
                projection is only useful if you can trace it back to the
                specific responses that produced it. The model doesn&apos;t
                output a black-box number — it outputs a number and the
                evidence behind it, for every objective, for every candidate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* The build — phases                                            */}
      {/* ------------------------------------------------------------- */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-wide">
          <div className="max-w-3xl mb-4">
            <span className="text-primary-500 font-semibold text-sm uppercase tracking-wider">
              Proposal
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-5">
              The build for NAHQ
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Three phases, each with a clear deliverable and exit criteria.
              You asked about pricing model directly, so here it is —
              structured the way we&apos;d actually propose it.
            </p>
          </div>

          <p className="inline-flex items-center gap-2 text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 mb-10">
            All figures below are indicative, shared because you asked —
            final numbers depend on scoping.
          </p>

          <div className="grid lg:grid-cols-3 gap-6">
            {phases.map((phase) => (
              <div
                key={phase.name}
                className={`rounded-2xl border-2 p-6 flex flex-col ${
                  phase.highlight
                    ? "border-primary-300 bg-primary-50/40"
                    : "border-slate-200 bg-white"
                }`}
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-primary-600 mb-2">
                  {phase.label}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mb-1">
                  {phase.name}
                </h3>
                <p className="text-sm text-slate-500 mb-5">{phase.timeline}</p>

                <div className="mb-5">
                  <span className="text-3xl font-bold text-slate-900">
                    {phase.price}
                  </span>
                  {phase.priceNote && (
                    <p className="text-xs text-slate-500 mt-1">
                      {phase.priceNote}
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mt-auto">
                  {phase.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* Ownership model                                               */}
      {/* ------------------------------------------------------------- */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container-wide">
          <div className="max-w-3xl mb-12">
            <span className="text-primary-500 font-semibold text-sm uppercase tracking-wider">
              Before you ask
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-5">
              Who owns what
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              This is a managed white-label deployment, not a software
              transfer — and the ownership lines are drawn on purpose.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {ownership.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 bg-white rounded-2xl p-6 border border-slate-100"
              >
                <item.icon className="w-6 h-6 text-primary-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900 mb-1">
                    {item.title}
                  </p>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* Footer CTA                                                    */}
      {/* ------------------------------------------------------------- */}
      <section className="py-16 md:py-20 bg-slate-900 print:bg-white print:border-t print:border-slate-200">
        <div className="container-wide">
          <div className="max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 print:text-slate-900">
              Let&apos;s go through it together.
            </h2>
            <p className="text-slate-300 mb-6 print:text-slate-600">
              Questions before, during, or after today&apos;s call — reach us
              directly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
              <a
                href="mailto:contact@evelynlearning.com"
                className="inline-flex items-center gap-2 text-white hover:text-primary-300 transition-colors print:text-slate-900"
              >
                <Mail className="w-4 h-4 text-primary-400" />
                contact@evelynlearning.com
              </a>
              <a
                href="tel:+13022120975"
                className="inline-flex items-center gap-2 text-white hover:text-primary-300 transition-colors print:text-slate-900"
              >
                <Phone className="w-4 h-4 text-primary-400" />
                +1 (302) 212-0975
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
