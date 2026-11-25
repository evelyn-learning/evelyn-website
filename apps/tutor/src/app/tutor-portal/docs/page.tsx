import type { Metadata } from 'next';
import Link from 'next/link';
import { DOCS_PAGES, PORTAL_TEXT_FILES } from '../portal-pages';
import { portalMetadata } from '../seo';
import { Callout } from './components/Callout';
import { DocsBreadcrumb } from './components/DocsBreadcrumb';

export const metadata: Metadata = portalMetadata('/docs');

// The docs pages of portal-pages.ts, minus this overview. The sidebar is hidden on small screens, so this
// list is the docs navigation on a phone: every docs page must be here.
const sections = DOCS_PAGES.filter((p) => p.path !== '/docs');

export default function DocsOverview() {
  return (
    <div>
      <DocsBreadcrumb path="/docs" />
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
            key={s.path}
            href={s.path}
            className="group rounded-xl border border-slate-200 p-5 transition-colors hover:border-blue-200 hover:bg-blue-50/50"
          >
            <h3 className="mb-1 font-semibold text-slate-900 group-hover:text-blue-700">
              {s.docs}
            </h3>
            <p className="text-sm text-slate-500">{s.description}</p>
          </Link>
        ))}
      </div>

      <h2 className="mb-4 mt-10 text-xl font-semibold text-slate-900">Hosts</h2>
      <pre className="overflow-x-auto rounded-lg bg-slate-900 px-4 py-3 text-sm text-green-400">
        <code>{`Embed   https://tutor.evelynlearning.com/embed?token=…
API     https://www.evelynlearning.com/api/portal/v1`}</code>
      </pre>
      <p className="mt-2 text-sm text-slate-500">
        The sandbox runs on the same hosts and the same engine as production. Nothing changes when
        you go live except your own configuration.
      </p>

      <h2 className="mb-4 mt-10 text-xl font-semibold text-slate-900">For coding assistants</h2>
      <p className="mb-3 text-sm text-slate-600">
        The same documentation as plain text, for a coding assistant or a script:
      </p>
      <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
        <li><a href={PORTAL_TEXT_FILES.llms} className="text-blue-600 underline">llms.txt</a>: what the service is, its prices, and where everything lives.</li>
        <li><a href={PORTAL_TEXT_FILES.guide} className="text-blue-600 underline">docs/integration.md</a>: the whole integration in one Markdown file.</li>
        <li><a href={PORTAL_TEXT_FILES.llmsFull} className="text-blue-600 underline">llms-full.txt</a>: both of the above in one file.</li>
        <li>The <Link href="/docs/package" className="text-blue-600 underline">developer package</Link> includes an MCP server, so an assistant can do the integration itself.</li>
      </ul>
    </div>
  );
}
