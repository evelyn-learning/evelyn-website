import type { Metadata } from 'next';
import { portalMetadata } from '../../seo';
import { Callout } from '../components/Callout';
import { CodeBlock } from '../components/CodeBlock';
import { DocsBreadcrumb } from '../components/DocsBreadcrumb';

export const metadata: Metadata = portalMetadata('/docs/package');

const c = 'rounded bg-slate-100 px-1.5 py-0.5 text-xs';

// 2026-11-24. Written from the packages' own READMEs (sdk/js/README.md, sdk/python/README.md at the repo root),
// both published at 0.1.0. The package was named only in llms.txt and integration.md; no page a person reads
// mentioned it. Keep this page to what those READMEs say.
const cliCommands: Array<{ cmd: string; does: string }> = [
  { cmd: 'npx @evelynlearning/tutor init', does: 'Saves your keys in .env.local or .env (kept out of git) and writes a working example for Next.js, Express or plain Node.' },
  { cmd: 'npx @evelynlearning/tutor token', does: 'Prints a session URL: --student test-1 --topic "Fractions" [--language hi] [--switch all] [--mode text].' },
  { cmd: 'npx @evelynlearning/tutor languages', does: 'Lists the languages a lesson can be taught in, with their codes.' },
  { cmd: 'npx @evelynlearning/tutor usage', does: 'Shows minutes used and left.' },
  { cmd: 'npx @evelynlearning/tutor doctor', does: 'Checks the keys, this machine\'s clock and one signed API call, and says when a newer version exists.' },
  { cmd: 'npx @evelynlearning/tutor docs', does: 'Prints the integration guide.' },
  { cmd: 'npx @evelynlearning/tutor mcp', does: 'Runs the MCP server.' },
];

const mcpTools: Array<{ tool: string; does: string }> = [
  { tool: 'evelyn_docs', does: 'Returns the integration guide.' },
  { tool: 'evelyn_get_keys_instructions', does: 'Says how to sign up and where the keys go. Sign-up needs a person.' },
  { tool: 'evelyn_scaffold', does: 'Returns example files for Next.js, Express or plain Node, for the assistant to write.' },
  { tool: 'evelyn_languages', does: 'Lists the lesson languages and their codes.' },
  { tool: 'evelyn_create_session_url', does: 'Claims in, session URL out.' },
  { tool: 'evelyn_usage', does: 'Minutes used and left.' },
  { tool: 'evelyn_read_worksheet', does: 'Image file paths in, numbered questions out.' },
  { tool: 'evelyn_prepare_problem', does: 'Prepares one worksheet question and returns its plan id.' },
  { tool: 'evelyn_doctor', does: 'Checks keys, clock and a signed call, and says what to fix.' },
];

export default function PackagePage() {
  return (
    <div>
      <DocsBreadcrumb path="/docs/package" />
      <h1 className="mb-2 text-3xl font-bold text-slate-900">Developer Package</h1>
      <p className="mb-8 text-lg text-slate-600">
        An optional package for Node and Python that signs session links and API calls for you, with a command line
        tool and an MCP server for coding assistants.
      </p>

      <Callout type="info" title="Optional">
        The integration needs no package: a session is one signed link, and every code sample in these docs runs
        without it. The package saves you writing the signing, the worksheet calls and the webhook check yourself.
      </Callout>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-slate-900">Install</h2>
      <div className="mb-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-slate-200 text-left">
              <th className="pb-3 pr-4 font-medium text-slate-500">Registry</th>
              <th className="pb-3 pr-4 font-medium text-slate-500">Package</th>
              <th className="pb-3 pr-4 font-medium text-slate-500">Needs</th>
              <th className="pb-3 font-medium text-slate-500">Includes</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="py-2.5 pr-4 font-medium text-slate-700">npm</td>
              <td className="py-2.5 pr-4"><a href="https://www.npmjs.com/package/@evelynlearning/tutor" className="text-blue-600 underline"><code className="text-xs">@evelynlearning/tutor</code></a></td>
              <td className="py-2.5 pr-4 text-slate-600">Node 18 or later</td>
              <td className="py-2.5 text-slate-600">Library (ES modules, CommonJS, TypeScript types), browser helper, command line tool, MCP server</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="py-2.5 pr-4 font-medium text-slate-700">PyPI</td>
              <td className="py-2.5 pr-4"><a href="https://pypi.org/project/evelyn-tutor/" className="text-blue-600 underline"><code className="text-xs">evelyn-tutor</code></a></td>
              <td className="py-2.5 pr-4 text-slate-600">Python 3.9 or later</td>
              <td className="py-2.5 text-slate-600">Library (typed): session links, the worksheet and usage API, webhook verification</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mb-2 text-sm text-slate-600">Neither package has any dependencies. Both are MIT licensed.</p>
      <CodeBlock language="bash">{`npm install @evelynlearning/tutor
pip install evelyn-tutor`}</CodeBlock>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">A session link in three lines</h2>
      <p className="mb-2 text-sm text-slate-600">
        Set <code className={c}>EVELYN_PARTNER_ID</code> and <code className={c}>EVELYN_PARTNER_SECRET</code> on your
        server (both are on the API keys page of your <a href="/dashboard" className="text-blue-600 underline">dashboard</a>;{' '}
        <a href="/sandbox" className="text-blue-600 underline">get a sandbox</a> if you have none yet).
      </p>
      <CodeBlock language="javascript" title="Node.js">{`import { EvelynTutor } from '@evelynlearning/tutor';

const tutor = new EvelynTutor(); // reads EVELYN_PARTNER_ID and EVELYN_PARTNER_SECRET
const url = tutor.sessionUrl({
  student_id: 'stu_abc123', subject: 'math', level: 'Grade 8',
  topic: 'Solving linear equations', target_kind: 'freestyle',
});`}</CodeBlock>
      <CodeBlock language="python" title="Python">{`from evelyn_tutor import EvelynTutor

tutor = EvelynTutor()  # reads EVELYN_PARTNER_ID and EVELYN_PARTNER_SECRET
url = tutor.session_url({
    "student_id": "stu_abc123", "subject": "math", "level": "Grade 8",
    "topic": "Solving linear equations", "target_kind": "freestyle",
})`}</CodeBlock>
      <p className="mb-2 text-sm text-slate-600">Then show the URL in your page:</p>
      <CodeBlock language="html">{`<iframe
  src="SESSION_URL"
  allow="microphone; camera; autoplay; clipboard-write"
  allowfullscreen
  style="width:100%; height:100vh; border:0">
</iframe>`}</CodeBlock>
      <p className="mb-6 text-sm text-slate-600">
        Sign one URL per student per session. Creating a URL costs nothing: tutoring minutes are counted only while
        a session is running. The token expires after two hours unless you set another lifetime.
      </p>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">What the library covers</h2>
      <ul className="mb-6 list-disc space-y-2 pl-5 text-sm text-slate-600">
        <li><strong>Session links.</strong> <code className={c}>sessionUrl</code> and <code className={c}>sessionToken</code> take the claims on the <a href="/docs/embed" className="text-blue-600 underline">Embed Configuration</a> page; obvious mistakes (no <code className={c}>student_id</code>, a duration outside 1 to 120) throw an error that says what to change.</li>
        <li><strong>Languages.</strong> <code className={c}>tutor.languages()</code> reads the current list. See <a href="/docs/languages" className="text-blue-600 underline">Languages</a>.</li>
        <li><strong>Worksheet help.</strong> <code className={c}>worksheet.read</code>, <code className={c}>build</code>, <code className={c}>prepare</code>, <code className={c}>sessionUrl</code> and <code className={c}>outcome</code> wrap the worksheet routes of the <a href="/docs/api" className="text-blue-600 underline">API</a>.</li>
        <li><strong>Usage and session facts.</strong> <code className={c}>tutor.usage()</code> and <code className={c}>tutor.sessions.summary(ids)</code>.</li>
        <li><strong>Webhooks.</strong> <code className={c}>verifyWebhook</code> and <code className={c}>webhookHandler</code> check the signature of a <a href="/docs/webhooks" className="text-blue-600 underline">server webhook</a>.</li>
        <li><strong>Any other endpoint.</strong> <code className={c}>signRequest</code> returns the three signing headers for a request you send yourself.</li>
        <li><strong>In the browser (Node package).</strong> <code className={c}>@evelynlearning/tutor/embed</code> has no secret in it: <code className={c}>mountTutor</code> adds the iframe and hands you the session events.</li>
      </ul>
      <CodeBlock language="javascript" title="Browser: mount the tutor and listen">{`import { mountTutor } from '@evelynlearning/tutor/embed';

const tutor = mountTutor(document.getElementById('tutor'), {
  sessionUrl,                               // from your server
  onStarted: ({ session_id }) => {},
  onEnded: ({ session_id, duration, ended_reason }) => {},
});`}</CodeBlock>
      <CodeBlock language="javascript" title="Server: verify a webhook (Next.js route, or anything with the raw body)">{`import { verifyWebhook, EvelynWebhookError } from '@evelynlearning/tutor';

export async function POST(request) {
  const rawBody = await request.text();
  try {
    const event = verifyWebhook({ rawBody, headers: request.headers, secret: process.env.EVELYN_PARTNER_SECRET });
    if (event.type === 'session.ended') await saveSession(event.id, event.data);
  } catch (err) {
    if (err instanceof EvelynWebhookError) return Response.json({ error: err.reason }, { status: 400 });
    throw err;
  }
  return Response.json({ received: true });
}`}</CodeBlock>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">Command line</h2>
      <p className="mb-2 text-sm text-slate-600">
        The npm package has a command, <code className={c}>evelyn-tutor</code>. It reads the keys from the environment,
        or from <code className={c}>.env.local</code> / <code className={c}>.env</code> in the current directory.
      </p>
      <div className="mb-6 overflow-x-auto">
        <table className="w-full text-sm">
          <tbody>
            {cliCommands.map((r) => (
              <tr key={r.cmd} className="border-b border-slate-100 align-top">
                <td className="whitespace-nowrap py-2.5 pr-4"><code className="font-mono text-xs text-slate-800">{r.cmd}</code></td>
                <td className="py-2.5 text-slate-600">{r.does}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">MCP server for coding assistants</h2>
      <p className="mb-2 text-sm text-slate-600">
        The npm package includes an MCP server, <code className={c}>evelyn-tutor-mcp</code>, so a coding assistant
        can read the guide, write the example files, create a test session and check the setup. Clients that take a
        JSON configuration use this form:
      </p>
      <CodeBlock language="json" title="MCP client configuration">{`{
  "mcpServers": {
    "evelyn-tutor": {
      "command": "npx",
      "args": ["-y", "-p", "@evelynlearning/tutor", "evelyn-tutor-mcp"]
    }
  }
}`}</CodeBlock>
      <p className="mb-4 text-sm text-slate-600">
        The server reads the keys from its environment, or from <code className={c}>.env.local</code> /{' '}
        <code className={c}>.env</code> in the directory it is started in. Only opening a session URL and starting
        the lesson uses tutoring minutes.
      </p>
      <div className="mb-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-slate-200 text-left">
              <th className="pb-3 pr-4 font-medium text-slate-500">Tool</th>
              <th className="pb-3 font-medium text-slate-500">What it does</th>
            </tr>
          </thead>
          <tbody>
            {mcpTools.map((t) => (
              <tr key={t.tool} className="border-b border-slate-100">
                <td className="py-2.5 pr-4"><code className={`${c} font-mono`}>{t.tool}</code></td>
                <td className="py-2.5 text-slate-600">{t.does}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">Security and versions</h2>
      <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
        <li>The partner secret signs both session links and API calls. Keep it on your server: never in browser code, a mobile app or a commit.</li>
        <li>Take <code className={c}>student_id</code> from your own sign-in, never from the request body.</li>
        <li>The API is version 1 (<code className={c}>/api/portal/v1</code>). Within version 1 it only adds: new endpoints, optional fields, token claims, event types and languages.</li>
        <li>Claims the package does not know are signed into the token as you give them, so a new option of the service can be used before you update the package.</li>
      </ul>
    </div>
  );
}
