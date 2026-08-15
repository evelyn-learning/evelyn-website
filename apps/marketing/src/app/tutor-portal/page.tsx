import Link from 'next/link';
import { voiceEngines } from './data/engines';
import { whiteboardTypes, whiteboardCategories } from './data/whiteboard-types';
import { subjects, supportedCurricula, topicCount } from './data/curriculum';
import { languageCount } from './data/languages';
import { launchPromo, platformFees } from './data/pricing';

function Hero() {
  return (
    <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-wider text-blue-400">
            White-Label Platform for Education Partners
          </p>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            AI Voice Tutor
          </h1>
          <p className="mb-8 text-lg leading-relaxed text-blue-100 sm:text-xl">
            Students speak naturally and the AI tutor responds with voice and real-time whiteboard
            visuals — equations, graphs, diagrams, and more. Your brand, your curriculum, our engine.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/sandbox"
              className="rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
            >
              Request Sandbox Access
            </Link>
            <Link
              href="/docs"
              className="rounded-xl border-2 border-white/20 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/5"
            >
              Read the Docs
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsBar() {
  const stats = [
    { value: `${whiteboardTypes.filter((t) => t.category !== 'navigation').length}`, label: 'Whiteboard Visual Types' },
    { value: `${topicCount}+`, label: 'Topics Covered' },
    { value: `${languageCount}+`, label: 'Languages Supported' },
    { value: '<400ms', label: 'Premium Latency' },
  ];

  return (
    <section className="border-b border-slate-100 bg-white py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-slate-900 sm:text-3xl">{stat.value}</div>
              <div className="mt-1 text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      step: '1',
      title: 'Generate a Session Token',
      description: 'Your backend creates a signed JWT with the student\'s subject, level, and your branding.',
      code: '{ "student_id": "stu_123", "subject": "math", "level": "11-12" }',
    },
    {
      step: '2',
      title: 'Load the Embed',
      description: 'Drop our iframe into your app. One line of HTML.',
      code: '<iframe src="https://tutor.evelynlearning.com/embed?token={JWT}" allow="microphone" />',
    },
    {
      step: '3',
      title: 'Receive Webhooks',
      description: 'We send session data, transcripts, and usage metrics to your endpoint in real-time.',
      code: '{ "event": "session.ended", "data": { "duration": 1847, "cost": 1.23 } }',
    },
  ];

  return (
    <section className="bg-slate-50 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-slate-900">Integrate in Three Steps</h2>
          <p className="mt-3 text-slate-600">From API keys to live tutoring in your platform.</p>
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          {steps.map((step) => (
            <div key={step.step} className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                {step.step}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">{step.title}</h3>
              <p className="mb-4 text-sm text-slate-600">{step.description}</p>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs text-green-400">
                <code>{step.code}</code>
              </pre>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EngineComparison() {
  const engine = voiceEngines[0]!;
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-slate-900">The Voice Engine</h2>
          <p className="mt-3 text-slate-600">A single tier that powers every deployment — retail, whitelabel, and API.</p>
        </div>
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border-2 border-blue-200 bg-blue-50/50 p-8">
            <div className="mb-1 flex items-center gap-3">
              <h3 className="text-2xl font-bold text-slate-900">{engine.name}</h3>
              <span className="rounded-full bg-blue-600 px-3 py-0.5 text-xs font-medium text-white">
                Low Latency
              </span>
            </div>
            <p className="mb-4 text-sm text-slate-600">{engine.description}</p>
            <div className="mb-6 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-slate-900">
                ${engine.costPerMinute.toFixed(2)}
              </span>
              <span className="text-sm text-slate-500">/minute</span>
            </div>
            <div className="mb-4 flex items-center gap-2 text-sm">
              <span className="font-medium text-slate-700">Response time:</span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-mono">
                {engine.latency}
              </span>
            </div>
            <ul className="space-y-2">
              {engine.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="mt-0.5 text-blue-600">&#10003;</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhiteboardShowcase() {
  const visualCategories = whiteboardCategories.filter((c) => c.id !== 'navigation');

  return (
    <section className="bg-slate-50 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-slate-900">
            {whiteboardTypes.filter((t) => t.category !== 'navigation').length} Interactive Whiteboard Types
          </h2>
          <p className="mt-3 text-slate-600">
            Every visual is generated in real-time, synchronized with the tutor&apos;s voice.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visualCategories.map((cat) => {
            const types = whiteboardTypes.filter((t) => t.category === cat.id);
            return (
              <div key={cat.id} className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="mb-1 text-lg font-semibold text-slate-900">{cat.name}</h3>
                <p className="mb-4 text-xs text-slate-400">{cat.count} types</p>
                <ul className="space-y-2">
                  {types.map((type) => (
                    <li key={type.id} className="text-sm">
                      <span className="font-medium text-slate-700">{type.name}</span>
                      <span className="text-slate-400"> — </span>
                      <span className="text-slate-500">{type.exampleUse}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CurriculumSection() {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-slate-900">Curriculum Coverage</h2>
          <p className="mt-3 text-slate-600">
            {subjects.length} subjects, {topicCount}+ topics, K through College — plus custom curriculum support.
          </p>
        </div>

        <div className="mb-12">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Subjects</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left">
                  <th className="pb-3 pr-6 font-medium text-slate-500">Subject</th>
                  <th className="pb-3 pr-6 font-medium text-slate-500">Grade Range</th>
                  <th className="pb-3 font-medium text-slate-500">Example Topics</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((s) => (
                  <tr key={s.id} className="border-b border-slate-100">
                    <td className="py-3 pr-6 font-medium text-slate-900">{s.name}</td>
                    <td className="py-3 pr-6 text-slate-600">{s.gradeRange}</td>
                    <td className="py-3 text-slate-600">{s.exampleTopics}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Supported National Curricula</h3>
          <p className="mb-4 text-sm text-slate-600">
            Partners upload their curriculum via our API. The tutor grounds all instruction in your
            national standards.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {supportedCurricula.map((c) => (
              <div key={c.region} className="rounded-lg border border-slate-200 px-4 py-3">
                <div className="font-medium text-slate-900">{c.region}</div>
                <div className="text-sm text-slate-500">{c.curricula}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BuildVsBuy() {
  const rows = [
    { build: '6-12 months to build whiteboard alone', buy: 'Launch in weeks' },
    { build: '16+ visual renderers to develop and maintain', buy: 'Battle-tested rendering engine' },
    { build: 'Voice engine integration and tuning', buy: 'Production-grade, two tiers available' },
    { build: 'Ongoing AI prompt engineering', buy: 'Continuously refined pedagogy' },
    { build: 'Multi-stage validation layers to build', buy: 'Built-in quality assurance' },
    { build: 'Your team maintains it all', buy: 'We handle updates and improvements' },
  ];

  return (
    <section className="bg-slate-50 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-slate-900">Build vs. White-Label</h2>
        </div>
        <div className="mx-auto max-w-3xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="pb-4 pr-8 text-left font-medium text-slate-400">Build It Yourself</th>
                <th className="pb-4 text-left font-medium text-blue-600">White-Label with Evelyn</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="py-3 pr-8 text-slate-500">{row.build}</td>
                  <td className="py-3 font-medium text-slate-900">{row.buy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function LaunchPartnerSection() {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white p-8 text-center lg:p-12">
          <span className="mb-4 inline-block rounded-full bg-blue-600 px-4 py-1.5 text-sm font-bold text-white">
            Launch Partner Program
          </span>
          <h2 className="mb-3 text-3xl font-bold text-slate-900">
            50% off for early partners
          </h2>
          <p className="mb-8 text-slate-600">
            Join as a launch partner and lock in reduced rates for your first year.
          </p>
          <div className="mb-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">One-time setup</p>
              <div className="mt-1 flex items-baseline justify-center gap-2">
                <span className="text-3xl font-bold text-slate-900">${launchPromo.setupPrice.toLocaleString()}</span>
                <span className="text-lg text-slate-400 line-through">${platformFees.setup.toLocaleString()}</span>
              </div>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Monthly platform fee</p>
              <div className="mt-1 flex items-baseline justify-center gap-2">
                <span className="text-3xl font-bold text-slate-900">${launchPromo.monthlyPrice}/mo</span>
                <span className="text-lg text-slate-400 line-through">${platformFees.monthly}/mo</span>
              </div>
              <p className="mt-1 text-xs text-slate-400">for first {launchPromo.monthlyDiscountMonths} months</p>
            </div>
          </div>
          <Link
            href="/sandbox"
            className="inline-block rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
          >
            Apply as Launch Partner
          </Link>
          <p className="mt-3 text-xs text-slate-400">Limited spots available. Usage fees billed separately.</p>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="bg-gradient-to-br from-blue-600 to-blue-700 py-16">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="mb-4 text-3xl font-bold text-white">Ready to integrate?</h2>
        <p className="mb-8 text-lg text-blue-100">
          Get sandbox API keys and start building. Self-service onboarding — launch in 3-8 weeks.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/sandbox"
            className="rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-blue-600 transition-colors hover:bg-slate-100"
          >
            Request Sandbox Access
          </Link>
          <Link
            href="/docs/quickstart"
            className="rounded-xl border-2 border-white/50 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Quick Start Guide
          </Link>
        </div>
        <p className="mt-6 text-sm text-blue-200">
          Questions? <a href="mailto:info@evelynlearning.com" className="underline">info@evelynlearning.com</a>
        </p>
      </div>
    </section>
  );
}

export default function TutorPortalHome() {
  return (
    <>
      <Hero />
      <StatsBar />
      <HowItWorks />
      <EngineComparison />
      <WhiteboardShowcase />
      <CurriculumSection />
      <BuildVsBuy />
      <LaunchPartnerSection />
      <CTASection />
    </>
  );
}
