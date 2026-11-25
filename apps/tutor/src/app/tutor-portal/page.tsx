import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from './components/JsonLd';
import { boardCounts } from './data/board-catalogue';
import { voiceEngines } from './data/engines';
import { boardGroups } from './data/whiteboard-types';
import { subjects, supportedCurricula, lessonPlanCountFloor } from './data/curriculum';
import { count, portalFacts, rateUsd, taughtLanguageNames, usd } from './data/facts';
import { languageCount } from './data/languages';
import { pricing, perSessionUsd } from './data/pricing';
import { PORTAL_ORIGIN, PORTAL_SITE_NAME, PORTAL_TEXT_FILES, portalPage } from './portal-pages';
import { organizationLd, portalMetadata } from './seo';

const facts = portalFacts();
const board = boardCounts();

// 2026-11-24: the home page had no metadata of its own (no canonical, and the retail tutor's Open Graph).
export const metadata: Metadata = portalMetadata('/', {
  description: `${portalPage('/').description} ${rateUsd(facts.voicePerMinuteUsd)} per voice minute, ${count(facts.sandboxFreeMinutes)} free sandbox minutes.`,
});

/** SoftwareApplication with the two real offers (the per-minute rate and the free sandbox) and the publisher.
 *  No ratings or reviews: there are none to state. */
const homeLd = {
  '@context': 'https://schema.org',
  '@graph': [
    organizationLd,
    {
      '@type': 'SoftwareApplication',
      '@id': `${PORTAL_ORIGIN}/#software`,
      name: PORTAL_SITE_NAME,
      url: `${PORTAL_ORIGIN}/`,
      description: portalPage('/').description,
      applicationCategory: ['EducationalApplication', 'DeveloperApplication'],
      operatingSystem: 'Web',
      inLanguage: facts.taughtLanguages.map((l) => l.code),
      publisher: { '@id': organizationLd['@id'] },
      offers: [
        {
          '@type': 'Offer',
          name: 'Voice tutoring, per minute',
          price: facts.voicePerMinuteUsd.toFixed(2),
          priceCurrency: 'USD',
          priceSpecification: { '@type': 'UnitPriceSpecification', price: facts.voicePerMinuteUsd.toFixed(2), priceCurrency: 'USD', unitCode: 'MIN', unitText: 'tutoring minute' },
          url: `${PORTAL_ORIGIN}/pricing`,
        },
        {
          '@type': 'Offer',
          name: 'Free sandbox',
          price: '0',
          priceCurrency: 'USD',
          description: `${count(facts.sandboxFreeMinutes)} free tutoring minutes on the production engine, sessions of up to ${facts.sandboxSessionMinutes} minutes. No card needed.`,
          url: `${PORTAL_ORIGIN}/sandbox`,
        },
      ],
    },
  ],
};

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
              Get API keys
            </Link>
            <Link
              href="/docs"
              className="rounded-xl border-2 border-white/20 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/5"
            >
              Read the Docs
            </Link>
          </div>
          {/* 2026-11-24: sign-in beside the sign-up, for the partner who already has keys. */}
          <p className="mt-5 text-sm text-blue-100">
            Already have keys?{' '}
            <Link href="/dashboard/login" className="font-semibold text-white underline underline-offset-4 hover:text-blue-200">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

function StatsBar() {
  const stats = [
    // 2026-11-24: was "16 Whiteboard Visual Types" (the first engine's list) and "200+ Topics Covered".
    { value: `${board.catalogueFigures}+`, label: 'Whiteboard Figures' },
    { value: `${count(lessonPlanCountFloor)}+`, label: 'Lesson Plans' },
    { value: `${languageCount}+`, label: 'Languages Supported' },
    { value: '<400ms', label: 'Response Latency' },
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

/** The facts in plain sentences, in the server HTML: what a search engine or an assistant quotes when asked
 *  what this is and what it costs (2026-11-24). Every number comes from data/facts.ts. The taught-languages
 *  line names the languages a whole lesson runs in; the reach figure is the same one the stats bar shows. */
function AtAGlance() {
  const packs = facts.packs.map((p) => `${count(p.minutes)} minutes for ${usd(p.usd)}`);
  const rows: Array<{ term: string; text: React.ReactNode }> = [
    {
      term: 'What it is',
      text: 'A hosted AI tutor for school and college subjects. It talks with the student, listens, and teaches on a live whiteboard; the student can also type. You embed it in a web page or a mobile WebView with one signed link, under your own brand.',
    },
    {
      term: 'Price',
      text: `${rateUsd(facts.voicePerMinuteUsd)} per voice tutoring minute and ${rateUsd(facts.textPerMinuteUsd)} per typed minute. No setup fee, no monthly fee, no minimum.`,
    },
    {
      term: 'Prepaid packs',
      text: `${packs.join(', ')}. Pack minutes are good for ${facts.packValidityMonths} months.`,
    },
    {
      term: 'Free sandbox',
      text: `${count(facts.sandboxFreeMinutes)} free tutoring minutes on the production engine, in sessions of up to ${facts.sandboxSessionMinutes} minutes. Keys are shown as soon as you confirm your email address. No card and no approval step.`,
    },
    {
      term: 'Lesson languages',
      text: `Lessons can be taught entirely in ${taughtLanguageNames(facts)}; the tutor also supports learners in ${languageCount}+ languages.`,
    },
    {
      term: 'How to start',
      text: (
        <>
          <Link href="/sandbox" className="font-medium text-blue-600 underline underline-offset-2">Get API keys</Link>, sign a session token on
          your server, and load the session page in an iframe. The <Link href="/docs/quickstart" className="font-medium text-blue-600 underline underline-offset-2">quick start</Link>{' '}
          has the code; the <Link href="/docs/package" className="font-medium text-blue-600 underline underline-offset-2">developer package</Link> does the
          signing for you in Node or Python. Coding assistants can read{' '}
          <a href={PORTAL_TEXT_FILES.llms} className="font-medium text-blue-600 underline underline-offset-2">llms.txt</a>.
        </>
      ),
    },
  ];
  return (
    <section aria-labelledby="at-a-glance" className="bg-white py-14 lg:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h2 id="at-a-glance" className="mb-6 text-2xl font-bold text-slate-900">At a glance</h2>
        <dl className="divide-y divide-slate-100 border-y border-slate-100">
          {rows.map((r) => (
            <div key={r.term} className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
              <dt className="text-sm font-semibold text-slate-900">{r.term}</dt>
              <dd className="text-sm leading-relaxed text-slate-600">{r.text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      step: '1',
      title: 'Generate a Session Token',
      description: 'Your backend signs a JWT with the student, the lesson and the teacher persona. One secret, HS256.',
      code: '{ "partner_id": "your-id", "student_id": "stu_123", "subject": "math", "level": "Grade 6", "teacher": { ... } }',
    },
    {
      step: '2',
      title: 'Load the Embed',
      description: 'Drop our iframe into your app. One line of HTML.',
      code: '<iframe src="https://tutor.evelynlearning.com/embed?token={JWT}" allow="microphone" />',
    },
    {
      step: '3',
      title: 'Get the Results',
      description: 'The iframe posts session events to your page; your backend pulls minutes, mastery and gaps from the signed API.',
      code: '{ "type": "evelyn:session_ended", "data": { "session_id": "…", "duration": 1847, "milestone": "recap_reached" } }',
    },
  ];

  return (
    <section className="bg-slate-50 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-slate-900">Integrate in Three Steps</h2>
          <p className="mt-3 text-slate-600">From partner credentials to live tutoring in your platform.</p>
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          {steps.map((step) => (
            // min-w-0 (2026-11-24): without it the code line set the card's width and the page scrolled sideways on a phone.
            <div key={step.step} className="min-w-0 rounded-2xl bg-white p-6 shadow-sm">
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
          <p className="mt-3 text-slate-600">One engine, one rate — the same tutor powers every deployment, retail, white-label and API.</p>
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

// 2026-11-24: was "16 Interactive Whiteboard Types", a list from the first engine, while the docs page said 19.
// Both pages now show the same groups (data/whiteboard-types.ts) and the same counts (data/board-catalogue.ts).
function WhiteboardShowcase() {
  return (
    <section className="bg-slate-50 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-slate-900">The Whiteboard</h2>
          <p className="mx-auto mt-3 max-w-3xl text-slate-600">
            The tutor writes and draws while it speaks. Everyday items (equations, notes, worked steps, tables) go up
            as it talks. For the rest it draws from a catalogue of {board.catalogueFigures} exact figures, and{' '}
            {board.toolFigures} more have a drawing tool of their own.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {boardGroups.map((group) => (
            <div key={group.id} className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="mb-1 text-lg font-semibold text-slate-900">{group.name}</h3>
              <p className="mb-4 text-xs text-slate-500">{group.summary}</p>
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li key={item.name} className="text-sm">
                    <span className="font-medium text-slate-700">{item.name}.</span>{' '}
                    <span className="text-slate-500">{item.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-slate-600">
          The full list of figures is on the{' '}
          <Link href="/docs/whiteboard" className="font-medium text-blue-600 underline underline-offset-2">whiteboard page</Link> of the docs.
        </p>
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
            {subjects.length} subjects, {count(lessonPlanCountFloor)}+ lesson plans, K through College — plus custom curriculum support.
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
    { build: `${board.catalogueFigures}+ figure renderers to develop and maintain`, buy: 'Battle-tested rendering engine' },
    { build: 'Voice engine integration and tuning', buy: 'Production-grade voice stack, tuned for tutoring' },
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

function PricingSection() {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white p-8 text-center lg:p-12">
          <span className="mb-4 inline-block rounded-full bg-blue-600 px-4 py-1.5 text-sm font-bold text-white">
            Simple Pricing
          </span>
          <div className="mb-2 flex items-baseline justify-center gap-1">
            <span className="text-5xl font-bold text-slate-900">${pricing.perMinuteUsd.toFixed(2)}</span>
            <span className="text-lg text-slate-500">/ tutoring minute</span>
          </div>
          <p className="mb-8 text-slate-600">
            {pricing.tagline} A 30-minute session costs ${perSessionUsd(30).toFixed(2)}.
          </p>
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            {['No setup fee', 'No monthly platform fee', 'No minimum commitment'].map((line) => (
              <div key={line} className="rounded-xl bg-white p-4 text-sm font-medium text-slate-700 shadow-sm">
                {line}
              </div>
            ))}
          </div>
          <Link
            href="/pricing"
            className="inline-block rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
          >
            See what&apos;s included
          </Link>
          <p className="mt-3 text-xs text-slate-400">
            Text-only sessions ${pricing.textPerMinuteUsd.toFixed(2)}/min. Prepaid packs from {usd(facts.packs[0]!.usd)}; the first {count(facts.sandboxFreeMinutes)} minutes are free.
          </p>
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
          Get sandbox API keys and start building. Sign-up is self-service and your keys are shown as soon as you
          confirm your email address.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/sandbox"
            className="rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-blue-600 transition-colors hover:bg-slate-100"
          >
            Get API keys
          </Link>
          <Link
            href="/docs/quickstart"
            className="rounded-xl border-2 border-white/50 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Quick Start Guide
          </Link>
        </div>
        <p className="mt-5 text-sm text-blue-100">
          Already have keys?{' '}
          <Link href="/dashboard/login" className="font-semibold text-white underline underline-offset-4">Sign in</Link>
        </p>
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
      <JsonLd data={homeLd} />
      <Hero />
      <StatsBar />
      <AtAGlance />
      <HowItWorks />
      <EngineComparison />
      <WhiteboardShowcase />
      <CurriculumSection />
      <BuildVsBuy />
      <PricingSection />
      <CTASection />
    </>
  );
}
