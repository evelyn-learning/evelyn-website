import { webhookEvents, webhookCategories } from '../../data/webhook-events';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';

export default function EventsPage() {
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-slate-900">Events</h1>
      <p className="mb-8 text-lg text-slate-600">
        The embed posts events to your page as the session progresses. Your backend then pulls the
        authoritative facts from the API.
      </p>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-slate-900">How events arrive</h2>
      <p className="mb-4 text-sm text-slate-600">
        Every event is a <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">window.parent.postMessage({'{'} type, data {'}'})</code>{' '}
        from the iframe. Always check <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">event.origin</code>{' '}
        before trusting a message.
      </p>
      <CodeBlock language="javascript" title="Host page">{`window.addEventListener('message', (event) => {
  if (event.origin !== 'https://tutor.evelynlearning.com') return;
  const msg = event.data;
  if (!msg || typeof msg.type !== 'string' || !msg.type.startsWith('evelyn:')) return;

  switch (msg.type) {
    case 'evelyn:session_started': /* { session_id, started_at_ms? } */ break;
    case 'evelyn:progress':        /* { session_id, lesson_progress, practice? } */ break;
    case 'evelyn:session_ended':
      fetch('/api/tutor-session-ended', {          // your endpoint
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(msg.data),
      });
      break;
  }
});`}</CodeBlock>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">Payload: session_ended</h2>
      <CodeBlock language="json">{`{
  "type": "evelyn:session_ended",
  "data": {
    "session_id": "duc-sess-9012",
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
        <li><code className="text-xs">duration</code> — wall-clock seconds since the session started. For billing use <code className="text-xs">durationSec</code> from <code className="text-xs">GET /sessions/summary</code> (active minutes).</li>
        <li><code className="text-xs">milestone</code> — <code className="text-xs">none</code>, <code className="text-xs">first_concept_complete</code>, <code className="text-xs">first_try_yourself_success</code>, <code className="text-xs">recap_reached</code>.</li>
        <li><code className="text-xs">ended_reason</code> — present only as <code className="text-xs">&quot;time_limit&quot;</code> when the <code className="text-xs">max_duration_minutes</code> cap ended the session.</li>
        <li><code className="text-xs">end_intent</code> — <code className="text-xs">finish</code> or <code className="text-xs">discard</code> when the student chose; absent on a plain End/Pause.</li>
      </ul>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">All events</h2>
      {webhookCategories.map((category) => {
        const events = webhookEvents.filter((e) => e.category === category);
        return (
          <div key={category} className="mt-6">
            <h3 className="mb-3 text-lg font-semibold text-slate-900">{category}</h3>
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

      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">Then pull the facts</h2>
      <p className="mb-4 text-sm text-slate-600">
        Events are signals, not the record. After <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">session_ended</code>{' '}
        your backend should call the signed API:
      </p>
      <CodeBlock language="bash">{`GET /api/portal/v1/sessions/summary?ids=duc-sess-9012   # active minutes, turns, board items
GET /api/portal/v1/gaps?studentId=stu_abc123             # learning gaps
GET /api/portal/v1/mastery?studentId=stu_abc123          # mastery per objective
POST /api/portal/v1/assigned-practice                     # homework the tutor set`}</CodeBlock>

      <Callout type="info" title="Server-side webhooks">
        Outbound webhook delivery to your server (for example <code>session.ended</code> pushed to a URL
        you register) is on the roadmap. Today the browser event plus an API pull is the supported
        pattern, and it is what our own platforms use.
      </Callout>
    </div>
  );
}
