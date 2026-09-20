import Link from 'next/link';
import { Callout } from './components/Callout';

const sections = [
  { href: '/docs/quickstart', title: 'Getting Started', description: 'Mint a signed session token, embed the iframe, listen for events, pull the results.' },
  { href: '/docs/embed', title: 'Embed Configuration', description: 'Every token claim — student, lesson, teacher persona and voice, session goal, time cap, resume.' },
  { href: '/docs/api', title: 'API Reference', description: 'Signed partner API: session facts, gaps, mastery, learner state, practice, grading, lesson generation.' },
  { href: '/docs/webhooks', title: 'Events', description: 'Browser events from the embed: session_started, progress, session_ended — and what to pull afterwards.' },
  { href: '/docs/modules', title: 'Your Curriculum', description: 'Turn your own lesson, assignment or PDF into a plan the tutor teaches, and lock a session to it.' },
  { href: '/docs/authentication', title: 'Authentication', description: 'One partner secret: HS256 session tokens and HMAC-SHA256 request signing.' },
  { href: '/docs/whiteboard', title: 'Whiteboard Types', description: 'The visuals the tutor draws while it speaks — equations, graphs, diagrams, molecules and more.' },
];

export default function DocsOverview() {
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-slate-900">Documentation</h1>
      <p className="mb-8 text-lg text-slate-600">
        Everything you need to integrate the AI Voice Tutor into your platform.
      </p>

      <Callout type="tip" title="New to the Voice Tutor?">
        Start with the <Link href="/docs/quickstart" className="font-medium underline">Getting Started</Link> guide
        to embed a working tutor in under 30 minutes.
      </Callout>

      <h2 className="mb-4 mt-10 text-xl font-semibold text-slate-900">Overview</h2>
      <p className="mb-6 text-sm text-slate-600">
        The Voice Tutor is delivered as a hosted embed. You mint a signed session token on your
        backend, load our iframe with that token, and the iframe posts session events to your page.
        Your backend then pulls session facts and learning state from the signed partner API. Your
        platform keeps authentication, billing and every dashboard. We handle the tutoring — voice,
        whiteboard, pedagogy and validation.
      </p>

      <h2 className="mb-4 mt-10 text-xl font-semibold text-slate-900">Sections</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group rounded-xl border border-slate-200 p-5 transition-colors hover:border-blue-200 hover:bg-blue-50/50"
          >
            <h3 className="mb-1 font-semibold text-slate-900 group-hover:text-blue-700">
              {s.title}
            </h3>
            <p className="text-sm text-slate-500">{s.description}</p>
          </Link>
        ))}
      </div>

      <h2 className="mb-4 mt-10 text-xl font-semibold text-slate-900">Hosts</h2>
      <pre className="rounded-lg bg-slate-900 px-4 py-3 text-sm text-green-400">
        <code>{`Embed   https://tutor.evelynlearning.com/embed?token=…
API     https://www.evelynlearning.com/api/portal/v1`}</code>
      </pre>
      <p className="mt-2 text-sm text-slate-500">
        The sandbox runs on the same hosts and the same engine as production. Nothing changes when
        you go live except your own configuration.
      </p>
    </div>
  );
}
