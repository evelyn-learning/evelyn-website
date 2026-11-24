'use client';

/**
 * The integration guide, with the signed-in partner's id in every example. Adapted from the guide written for
 * one partner's pilot (docs/whitelabel/lumiq/integration-guide.md at the repo root) and made generic
 * (2026-11-24). The public reference at /docs stays the full one; this page is the short path to a first
 * embedded lesson.
 */
import Link from 'next/link';
import { DEMO_LANGUAGES } from '@core/demo/demo-languages';
import { Callout } from '../../../docs/components/Callout';
import { CodeBlock } from '../../../docs/components/CodeBlock';
import { ParamTable } from '../../../docs/components/ParamTable';
import {
  API_HOST, SESSION_PAGE, claimsExample, eventsSnippet, homeworkClaims, iframeSnippet, planGenerateBody, portalCallSnippet,
  problemPlanBody, signTokenSnippet, signingHeaders, signingString, webviewPermissionSnippet, webviewSettingsSnippet,
} from '../../snippets';
import { linkClass } from '../../ui';
import { PageHeader, useDash } from '../DashboardShell';

const toc = [
  { id: 'start', label: 'Start a lesson' },
  { id: 'claims', label: 'Token claims' },
  { id: 'embed', label: 'Iframe and Android WebView' },
  { id: 'worksheet', label: 'Worksheet photo' },
  { id: 'signing', label: 'Signing API calls' },
  { id: 'events', label: 'Events' },
  { id: 'usage', label: 'Usage' },
];

const h2 = 'mb-3 mt-10 scroll-mt-24 text-xl font-semibold text-slate-900';
const h3 = 'mb-2 mt-6 text-base font-semibold text-slate-900';
const p = 'mb-3 text-sm leading-relaxed text-slate-600';
const code = 'rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-800';

export default function DashboardDocsPage() {
  const { me } = useDash();
  const id = me.partnerId;
  const cap = me.pool.pooled && me.pool.sessionMaxMinutes > 0 ? me.pool.sessionMaxMinutes : null;
  const otherLanguages = DEMO_LANGUAGES.filter((l) => l.code !== 'en');

  return (
    <div className="max-w-3xl">
      <PageHeader title="Integration guide">
        The short path from your keys to a lesson inside your product. Every example below already carries your
        partner id, <code className={code}>{id}</code>.
      </PageHeader>

      <nav aria-label="On this page" className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">On this page</p>
        <ol className="grid gap-1 text-sm sm:grid-cols-2">
          {toc.map((t, i) => (
            <li key={t.id}><a href={`#${t.id}`} className={linkClass}>{i + 1}. {t.label}</a></li>
          ))}
        </ol>
        <p className="mt-3 text-sm text-slate-600">
          Looking for the full reference? See the <Link href="/docs" className={linkClass}>public docs</Link>.
        </p>
      </nav>

      <h2 id="start" className={h2}>1. Start a lesson</h2>
      <p className={p}>
        There is no SDK. Your server signs a token (a JWT, <code className={code}>alg: HS256</code>, signed with
        your partner secret) and the student&apos;s browser or app opens the session page with it. The token is
        the session&apos;s configuration.
      </p>
      <ParamTable
        showRequired={false}
        params={[
          { name: 'partner_id', type: 'string', description: id },
          { name: 'partner_secret', type: 'string', description: 'On the API keys page. Keep it on your server.' },
          { name: 'Session page', type: 'URL', description: `${SESSION_PAGE}?token=<SIGNED_TOKEN>` },
          { name: 'API host', type: 'URL', description: API_HOST },
        ]}
      />
      <CodeBlock language="js" title="Sign a token in Node, no dependencies">{signTokenSnippet(id)}</CodeBlock>
      <p className={p}>
        Any standard JWT library works as long as the algorithm is HS256 and the claims are top-level. Do not
        sign tokens in the browser or in a mobile app, and use one token per student per session.
      </p>
      <Callout type="tip" title="See it before you write it">
        <Link href="/dashboard/try" className="font-medium underline underline-offset-2">Try it</Link> makes a signed
        link for you and shows the payload it signed.
      </Callout>

      <h2 id="claims" className={h2}>2. Token claims</h2>
      <CodeBlock language="json" title="Token payload">{claimsExample(id, cap ?? 15)}</CodeBlock>
      <ParamTable
        params={[
          { name: 'partner_id', type: 'string', required: true, description: `Your partner id: ${id}.` },
          { name: 'student_id', type: 'string', required: true, description: 'Your own stable id for the student. All data for the student is keyed on it, scoped to your partner.' },
          { name: 'exp', type: 'number', required: true, description: 'Expiry, Unix seconds. Two hours from now is a good value. iat is the time of signing.' },
          { name: 'topic', type: 'string', description: 'Free text, in the lesson\'s language. The tutor builds the lesson on it. Send it with target_kind "freestyle".' },
          { name: 'subject', type: 'string', description: 'math, science, ela, social-studies or cs.' },
          { name: 'level', type: 'string', description: 'The grade, for example "Grade 8".' },
          { name: 'tutor_languages', type: 'string[]', description: `The lesson's language: ${otherLanguages.map((l) => `["${l.code}"] ${l.english}`).join(', ')}. Leave it out for English.` },
          { name: 'input_mode', type: 'string', description: 'voice (default) or text. In a voice session the student can also type.' },
          { name: 'student_name', type: 'string', description: 'What the tutor calls the student. In the sandbox, use a made-up name.' },
          { name: 'max_duration_minutes', type: 'number', description: `1 to 120, default 30.${cap ? ` In the sandbox a session ends at ${cap} minutes whatever this says.` : ''}` },
        ]}
      />
      <Callout type="warning" title="Sandbox: test data only">
        Do not send real students&apos; names or other personal data until a written agreement is in place. See the{' '}
        <Link href="/sandbox/terms" className="font-medium underline underline-offset-2">sandbox terms</Link>.
      </Callout>

      <h2 id="embed" className={h2}>3. Iframe and Android WebView</h2>
      <h3 className={h3}>In a web page</h3>
      <CodeBlock language="html" title="iframe">{iframeSnippet}</CodeBlock>
      <p className={p}>
        The <code className={code}>allow</code> attribute is what lets the lesson use the microphone inside your page.
        The student taps Start once; that tap also lets the tutor&apos;s voice play.
      </p>

      <h3 className={h3}>In an Android WebView</h3>
      <p className={p}>
        Load the same URL directly (no iframe needed) and set up the microphone, which a WebView does not grant on its own:
      </p>
      <ol className="mb-3 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-slate-600">
        <li>
          Declare <code className={code}>android.permission.RECORD_AUDIO</code>,{' '}
          <code className={code}>android.permission.MODIFY_AUDIO_SETTINGS</code> and{' '}
          <code className={code}>android.permission.INTERNET</code> in the manifest, and ask the user for{' '}
          <code className={code}>RECORD_AUDIO</code> at run time before opening the lesson.
        </li>
        <li>
          In your <code className={code}>WebChromeClient</code>, grant the page&apos;s request:
          <CodeBlock language="kotlin">{webviewPermissionSnippet}</CodeBlock>
        </li>
        <li>
          Settings the session needs:
          <CodeBlock language="kotlin">{webviewSettingsSnippet}</CodeBlock>
        </li>
        <li>Use the current Android System WebView (Chrome 110 or later). The page must be loaded over HTTPS, as above.</li>
      </ol>

      <h2 id="worksheet" className={h2}>4. Worksheet photo</h2>
      <p className={p}>
        The student photographs a worksheet in your app. Your server sends the photo, gets back the numbered
        questions, the student picks one, and your server opens a session on that question. The tutor guides the
        student to their own answer; it does not give the answer away. Every call here is signed (section 5).
      </p>
      <h3 className={h3}>Step 1. Send the photo</h3>
      <p className={p}><code className={code}>POST /api/portal/v1/plan-generate</code></p>
      <CodeBlock language="json">{planGenerateBody}</CodeBlock>
      <p className={p}>
        Up to 4 images, each up to 8 MB (JPEG, PNG, WebP or GIF). <code className={code}>locale</code> is the
        worksheet&apos;s language. The response carries <code className={code}>planId</code> and{' '}
        <code className={code}>problems: [{'{ n, text }'}]</code>: the questions as printed, with their numbers.
        Show this list to the student.
      </p>
      <h3 className={h3}>Step 2. Prepare the picked question</h3>
      <p className={p}><code className={code}>POST /api/portal/v1/homework-problem-plan</code></p>
      <CodeBlock language="json">{problemPlanBody}</CodeBlock>
      <p className={p}>
        The response carries a <code className={code}>planId</code> for that one question. Optional:{' '}
        <code className={code}>POST /api/portal/v1/homework-build</code> with <code className={code}>{'{ "planId": "…" }'}</code>{' '}
        right after step 1 prepares all the questions in the background, so step 2 answers at once.
      </p>
      <h3 className={h3}>Step 3. Open the session</h3>
      <p className={p}>
        Sign a token as in section 1, with <code className={code}>session_goal</code> and{' '}
        <code className={code}>curriculum_module</code> in place of <code className={code}>topic</code> and{' '}
        <code className={code}>target_kind</code>:
      </p>
      <CodeBlock language="json" title="Token payload">{homeworkClaims(id)}</CodeBlock>
      <h3 className={h3}>Step 4 (optional). Read the result</h3>
      <p className={p}>
        <code className={code}>GET /api/portal/v1/homework-problem-outcome?sessionId=…&amp;planId=…</code> returns
        whether the student finished the question, and a short note you can pass back in step 2 (
        <code className={code}>priorNote</code>, <code className={code}>priorConfirmed</code>) if the student returns to it.
      </p>

      <h2 id="signing" className={h2}>5. Signing API calls</h2>
      <p className={p}>Every request to <code className={code}>/api/portal/v1/*</code> on {API_HOST} carries three headers:</p>
      <CodeBlock>{signingHeaders(id)}</CodeBlock>
      <p className={p}>The signature is HMAC-SHA256 with your partner secret over this string:</p>
      <CodeBlock>{signingString}</CodeBlock>
      <p className={p}>
        For example <code className={code}>1795550000000.POST./api/portal/v1/plan-generate.{'{"text":…}'}</code>. The
        body must be signed exactly as sent. The timestamp must be within 5 minutes of the server&apos;s clock.
      </p>
      <CodeBlock language="js" title="A signed call in Node">{portalCallSnippet(id)}</CodeBlock>

      <h2 id="events" className={h2}>6. Events</h2>
      <p className={p}>
        The session page posts messages to the page that hosts it (<code className={code}>window.parent.postMessage({'{ type, data }'}, &apos;*&apos;)</code>).
        In a WebView, add a JavaScript interface or load the session inside your own host page to receive them.
      </p>
      <div className="my-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-slate-200 text-left">
              <th scope="col" className="pb-3 pr-4 font-medium text-slate-500">type</th>
              <th scope="col" className="pb-3 font-medium text-slate-500">data</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="py-2.5 pr-4"><code className={code}>evelyn:session_started</code></td>
              <td className="py-2.5"><code className="font-mono text-xs text-slate-600">{'{ session_id }'}</code></td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="py-2.5 pr-4"><code className={code}>evelyn:session_ended</code></td>
              <td className="py-2.5"><code className="font-mono text-xs text-slate-600">{'{ session_id, duration, ended_reason?, … }'}</code></td>
            </tr>
          </tbody>
        </table>
      </div>
      <CodeBlock language="js" title="Listening in the host page">{eventsSnippet}</CodeBlock>

      <h2 id="usage" className={h2}>7. Usage</h2>
      <p className={p}>
        <code className={code}>GET /api/portal/v1/usage</code> (signed, as in section 5) returns the minutes used and
        left in your sandbox. The same numbers are on the{' '}
        <Link href="/dashboard" className={linkClass}>Overview</Link>, and each session is listed under{' '}
        <Link href="/dashboard/sessions" className={linkClass}>Sessions</Link>.
      </p>
      <p className={p}>
        Questions? Write to <a href="mailto:info@evelynlearning.com" className={linkClass}>info@evelynlearning.com</a>.
      </p>
    </div>
  );
}
