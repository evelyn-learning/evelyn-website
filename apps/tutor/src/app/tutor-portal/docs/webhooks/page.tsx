import type { Metadata } from 'next';
import { WEBHOOK_RETRY_DELAYS_MS } from '@/lib/tutor/partner-dashboard/webhooks';
import { webhookEvents, webhookCategories, serverWebhookEvents } from '../../data/webhook-events';
import { portalMetadata } from '../../seo';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { DocsBreadcrumb } from '../components/DocsBreadcrumb';

export const metadata: Metadata = portalMetadata('/docs/webhooks');

const c = 'rounded bg-slate-100 px-1.5 py-0.5 text-xs';
const tries = WEBHOOK_RETRY_DELAYS_MS.length;
const retryDelays = WEBHOOK_RETRY_DELAYS_MS.filter((ms) => ms > 0).map((ms) => `${ms / 1000} seconds`);

// 2026-11-24: this page ended by saying outbound webhooks were still to come. Server webhooks are built
// (src/lib/tutor/partner-dashboard/webhooks.ts) and are now the first section; the browser events follow.
export default function EventsPage() {
  return (
    <div>
      <DocsBreadcrumb path="/docs/webhooks" />
      <h1 className="mb-2 text-3xl font-bold text-slate-900">Webhooks and Events</h1>
      <p className="mb-8 text-lg text-slate-600">
        Two ways to hear about a session: a webhook to your server, and browser events from the embed to your page.
        Your backend then pulls the authoritative facts from the API.
      </p>

      <h2 id="server-webhooks" className="mb-3 mt-8 scroll-mt-24 text-xl font-semibold text-slate-900">Server webhooks</h2>
      <p className="mb-4 text-sm text-slate-600">
        Set a URL on the <a href="/dashboard/webhooks" className="text-blue-600 underline">Webhooks page of your dashboard</a>{' '}
        and our server sends an HTTPS POST to it when a session ends or your minutes run low. Unlike a browser event, a
        webhook reaches your server even when the student has closed the tab.
      </p>
      <ul className="mb-6 list-disc space-y-1 pl-5 text-sm text-slate-600">
        <li>The URL must be HTTPS, on port 443 or 8443, on a public host name, with no user name or password in it.</li>
        <li>Redirects are not followed, and the body of your answer is not read.</li>
        <li>The dashboard page has a button that sends a test event and shows what your server answered.</li>
      </ul>

      <h3 className="mb-3 mt-6 text-lg font-semibold text-slate-900">Events</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-slate-200 text-left">
              <th className="pb-3 pr-4 font-medium text-slate-500">type</th>
              <th className="pb-3 pr-4 font-medium text-slate-500">Sent when</th>
              <th className="pb-3 font-medium text-slate-500">data</th>
            </tr>
          </thead>
          <tbody>
            {serverWebhookEvents.map((e) => (
              <tr key={e.event} className="border-b border-slate-100">
                <td className="py-2.5 pr-4"><code className={`${c} font-mono`}>{e.event}</code></td>
                <td className="py-2.5 pr-4 text-slate-600">{e.trigger}</td>
                <td className="py-2.5 text-slate-500">
                  {e.keyFields.map((f, i) => (
                    <span key={f}><code className="text-xs">{f}</code>{i < e.keyFields.length - 1 && ', '}</span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="mb-3 mt-8 text-lg font-semibold text-slate-900">Payload</h3>
      <p className="mb-2 text-sm text-slate-600">
        Every event is a JSON object with the same five fields. <code className={c}>id</code> is the same on every
        try of one event.
      </p>
      <CodeBlock language="json" title="POST to your URL: session.ended">{`{
  "id": "0b5c1c0e-6f0e-4a57-9d0b-2f6f6c3a9a11",
  "type": "session.ended",
  "created": "2026-11-24T17:42:10.000Z",
  "partner_id": "acme-learning",
  "data": {
    "session_id": "sess-9012",
    "student_id": "stu_abc123",
    "started_at": "2026-11-24T17:30:02.000Z",
    "ended_at": "2026-11-24T17:42:08.000Z",
    "duration_seconds": 698,
    "status": "completed",
    "languages": ["en"],
    "subject": "math",
    "topic": "Ratios and unit rates",
    "input_mode": "voice",
    "message_count": 24
  }
}`}</CodeBlock>
      <p className="mb-6 text-sm text-slate-600">
        The payload carries no transcript. Fetch the session&apos;s facts with the API (below), or open its replay in
        the dashboard.
      </p>

      <h3 className="mb-3 mt-8 text-lg font-semibold text-slate-900">Headers and signature</h3>
      <CodeBlock language="text" title="Request headers">{`content-type:        application/json
user-agent:          EvelynTutor-Webhook/1
x-evelyn-event:      session.ended
x-evelyn-timestamp:  1795542130000          # Unix time in milliseconds
x-evelyn-signature:  <hex HMAC-SHA256>`}</CodeBlock>
      <p className="mb-2 text-sm text-slate-600">
        The signature is the hex HMAC-SHA256 of <code className={c}>{'<timestamp>.<raw body>'}</code> with your
        partner secret: the same secret that signs your tokens and API calls. Verify it against the raw body, before
        any JSON parsing, and refuse a timestamp that is more than a few minutes old.
      </p>
      <CodeBlock language="javascript" title="Node.js (no dependencies)">{`const crypto = require('crypto');

// rawBody: the request body exactly as received (a string or a Buffer), not a parsed object.
function verifyEvelynWebhook(rawBody, headers, secret) {
  const timestamp = headers['x-evelyn-timestamp'];
  const given = headers['x-evelyn-signature'] || '';
  if (!timestamp || Math.abs(Date.now() - Number(timestamp)) > 5 * 60 * 1000) return null;
  const expected = crypto.createHmac('sha256', secret).update(timestamp + '.' + rawBody).digest('hex');
  const a = Buffer.from(given, 'hex');
  const b = Buffer.from(expected, 'hex');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  return JSON.parse(rawBody);
}`}</CodeBlock>
      <p className="mb-6 text-sm text-slate-600">
        The <a href="/docs/package" className="text-blue-600 underline">developer package</a> has this as{' '}
        <code className={c}>verifyWebhook</code> (Node) and <code className={c}>verify_webhook</code> (Python).
      </p>

      <h3 className="mb-3 mt-8 text-lg font-semibold text-slate-900">Delivery and retries</h3>
      <ul className="mb-4 list-disc space-y-1 pl-5 text-sm text-slate-600">
        <li>Answer with a 2xx status within 6 seconds. Answer 2xx to event types you do not handle.</li>
        <li>
          A failed delivery is tried {tries} times in all: at once, then after {retryDelays.join(' and after ')}.
        </li>
        <li>A 4xx answer is not retried, except 408 and 429.</li>
        <li>A retry carries the same <code className={c}>id</code>, so record the ids you have handled and ignore a repeat.</li>
        <li><code className={c}>session.ended</code> is sent once per session. <code className={c}>pool.low</code> and <code className={c}>pool.exhausted</code> are sent once each time your balance crosses the line, and again after a top-up if it is crossed again.</li>
      </ul>
      <p className="mb-4 text-sm text-slate-600">
        <strong>Delivery log.</strong> The Webhooks page of your dashboard lists your last 50 deliveries with the
        event, the status your server answered, the number of tries and the time taken.
      </p>
      <Callout type="info" title="A webhook is a signal, not the record">
        Retries are made within a few seconds and are not queued beyond that, so a delivery can be missed if your
        server is down for longer. The delivery log shows it. For the record of a session, call{' '}
        <code>GET /sessions/summary</code>.
      </Callout>

      <h2 id="browser-events" className="mb-3 mt-12 scroll-mt-24 text-xl font-semibold text-slate-900">Browser events</h2>
      <p className="mb-4 text-sm text-slate-600">
        Every event is a <code className={c}>window.parent.postMessage({'{'} type, data {'}'})</code>{' '}
        from the iframe. Always check <code className={c}>event.origin</code>{' '}
        before trusting a message.
      </p>
      <CodeBlock language="javascript" title="Host page">{`window.addEventListener('message', (event) => {
  if (event.origin !== 'https://tutor.evelynlearning.com') return;
  const msg = event.data;
  if (!msg || typeof msg.type !== 'string' || !msg.type.startsWith('evelyn:')) return;

  switch (msg.type) {
    case 'evelyn:session_started': /* { session_id, started_at_ms? } */ break;
    case 'evelyn:progress':        /* { session_id, lesson_progress, practice? } */ break;
    case 'evelyn:activity':        /* msg.last_student_input_at_ms (top-level; ≤ 1 per 5 s) */ break;
    case 'evelyn:session_ended':
      fetch('/api/tutor-session-ended', {          // your endpoint
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(msg.data),
      });
      break;
  }
});`}</CodeBlock>

      <h3 className="mb-3 mt-10 text-lg font-semibold text-slate-900">Payload: session_ended</h3>
      <CodeBlock language="json">{`{
  "type": "evelyn:session_ended",
  "data": {
    "session_id": "sess-9012",
    "duration": 1847,
    "message_count": 24,
    "whiteboard_items": 8,
    "milestone": "recap_reached",
    "lesson_progress": {
      "lessonPlanId": "plan_8f3a…",
      "currentSegmentId": "seg-recap",
      "completedSegmentIds": ["seg-hook", "seg-concept-1", "seg-example-1", "seg-try-1"],
      "currentSegmentLabel": "Recap",
      "percent": 100
    },
    "end_intent": "finish"
  }
}`}</CodeBlock>
      <ul className="mb-6 space-y-1 text-sm text-slate-600">
        <li><code className="text-xs">duration</code> — total active seconds across the session, including earlier sittings of a resumed session. For billing use <code className="text-xs">durationSec</code> from <code className="text-xs">GET /sessions/summary</code> (active minutes).</li>
        <li><code className="text-xs">milestone</code> — <code className="text-xs">none</code>, <code className="text-xs">first_concept_complete</code>, <code className="text-xs">first_try_yourself_success</code>, <code className="text-xs">recap_reached</code>.</li>
        <li><code className="text-xs">ended_reason</code> — <code className="text-xs">&quot;time_limit&quot;</code> when the <code className="text-xs">max_duration_minutes</code> cap ended the session; the host&apos;s reason (<code className="text-xs">finished</code>, <code className="text-xs">minutes_exhausted</code>, <code className="text-xs">no_input</code>, <code className="text-xs">idle</code>, <code className="text-xs">paused</code>) when your page ended it with <code className="text-xs">evelyn:host_end</code>; absent on a plain End/Pause.</li>
        <li><code className="text-xs">end_intent</code> — <code className="text-xs">finish</code> or <code className="text-xs">discard</code> when the student chose; absent on a plain End/Pause.</li>
      </ul>

      <h3 className="mb-3 mt-10 text-lg font-semibold text-slate-900">All browser events</h3>
      {webhookCategories.map((category) => {
        const events = webhookEvents.filter((e) => e.category === category);
        return (
          <div key={category} className="mt-6">
            <h4 className="mb-3 text-base font-semibold text-slate-900">{category}</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-slate-200 text-left">
                    <th className="pb-3 pr-4 font-medium text-slate-500">Event</th>
                    <th className="pb-3 pr-4 font-medium text-slate-500">Fires when</th>
                    <th className="pb-3 font-medium text-slate-500">data</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((e) => (
                    <tr key={e.event} className="border-b border-slate-100">
                      <td className="py-2.5 pr-4">
                        <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono">{e.event}</code>
                      </td>
                      <td className="py-2.5 pr-4 text-slate-600">{e.trigger}</td>
                      <td className="py-2.5 text-slate-500">
                        {e.keyFields.length === 0 ? '—' : e.keyFields.map((f, i) => (
                          <span key={f}>
                            <code className="text-xs">{f}</code>
                            {i < e.keyFields.length - 1 && ', '}
                          </span>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      <h3 className="mb-3 mt-10 text-lg font-semibold text-slate-900">Ending a session from your page</h3>
      <p className="mb-4 text-sm text-slate-600">
        To end a session yourself (your own finish button, a usage ceiling, an inactivity timeout), post{' '}
        <code className={c}>evelyn:host_end</code> into the iframe rather than
        removing it. The tutor says a short goodbye, saves the session&apos;s progress, then posts{' '}
        <code className={c}>evelyn:session_ended</code> with{' '}
        <code className={c}>ended_reason</code> set to your reason. Wait a few
        seconds for it before unmounting. Only the first message counts, and it is ignored once the student has already
        ended the session.
      </p>
      <CodeBlock language="javascript" title="Host page">{`iframe.contentWindow.postMessage(
  { type: 'evelyn:host_end', reason: 'finished' }, // 'finished' | 'minutes_exhausted' | 'no_input' | 'idle' | 'paused'
  'https://tutor.evelynlearning.com',
);`}</CodeBlock>

      <h2 className="mb-3 mt-12 text-xl font-semibold text-slate-900">Then pull the facts</h2>
      <p className="mb-4 text-sm text-slate-600">
        Webhooks and events are signals, not the record. After a session ends your backend should call the signed API:
      </p>
      <CodeBlock language="bash">{`GET /api/portal/v1/sessions/summary?ids=sess-9012   # active minutes, turns, board items
GET /api/portal/v1/gaps?studentId=stu_abc123             # learning gaps
GET /api/portal/v1/mastery?studentId=stu_abc123          # mastery per objective
POST /api/portal/v1/assigned-practice                     # homework the tutor set`}</CodeBlock>
    </div>
  );
}
