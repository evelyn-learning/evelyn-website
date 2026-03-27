import Link from 'next/link';
import { Callout } from './components/Callout';

const sections = [
  { href: '/docs/quickstart', title: 'Getting Started', description: 'Generate a JWT, embed the iframe, and run your first tutoring session in minutes.' },
  { href: '/docs/embed', title: 'Embed Configuration', description: 'Full reference for all embed parameters — subject, level, engine, branding, and more.' },
  { href: '/docs/api', title: 'API Reference', description: 'REST endpoints for sessions, students, curriculum modules, usage, and webhooks.' },
  { href: '/docs/webhooks', title: 'Webhooks', description: '15 real-time events for session lifecycle, usage, content generation, and errors.' },
  { href: '/docs/modules', title: 'Curriculum Modules', description: 'Upload your national curriculum as JSON or PDF. The tutor grounds instruction in your standards.' },
  { href: '/docs/authentication', title: 'Authentication', description: 'JWT signing, API keys, and webhook signature verification.' },
  { href: '/docs/whiteboard', title: 'Whiteboard Types', description: 'All 19 interactive visual types — equations, graphs, diagrams, molecules, and more.' },
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
        The Voice Tutor is delivered as a hosted embed. You generate a signed session token on your
        backend, load our iframe with that token, and we send session data back to you via webhooks.
        Your platform handles authentication, billing, and the student dashboard. We handle the
        tutoring — voice, whiteboard, AI, and validation.
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

      <h2 className="mb-4 mt-10 text-xl font-semibold text-slate-900">Base URL</h2>
      <p className="mb-2 text-sm text-slate-600">All API requests use:</p>
      <pre className="rounded-lg bg-slate-900 px-4 py-3 text-sm text-green-400">
        <code>https://api.evelynlearning.com/v1</code>
      </pre>
      <p className="mt-2 text-sm text-slate-500">
        Sandbox: <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">https://api-sandbox.evelynlearning.com/v1</code>
      </p>
    </div>
  );
}
