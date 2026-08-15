import { webhookEvents, webhookCategories } from '../../data/webhook-events';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';

export default function WebhooksPage() {
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-slate-900">Webhooks</h1>
      <p className="mb-8 text-lg text-slate-600">
        Receive real-time events as tutoring sessions progress.
      </p>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-slate-900">Setup</h2>
      <p className="mb-4 text-sm text-slate-600">
        Register a webhook endpoint via the API:
      </p>
      <CodeBlock language="bash">{`curl -X POST https://api.evelynlearning.com/v1/webhooks \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ "url": "https://your-app.com/webhooks/evelyn", "events": ["session.ended", "usage.summary"] }'`}</CodeBlock>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">Payload Format</h2>
      <CodeBlock language="json" title="Example: session.ended">{`{
  "event": "session.ended",
  "timestamp": "2026-10-15T14:30:00Z",
  "partner_id": "algerian-bac",
  "data": {
    "session_id": "sess_abc123",
    "student_id": "stu_xyz789",
    "subject": "math",
    "topic": "quadratic-functions",
    "level": "11-12",
    "duration_seconds": 1847,
    "message_count": 24,
    "whiteboard_items": 8,
    "end_reason": "student_ended",
    "token_usage": {
      "input_audio_tokens": 14200,
      "output_audio_tokens": 21800,
      "input_text_tokens": 48500,
      "output_text_tokens": 18200
    },
    "estimated_cost_usd": 1.23,
    "metadata": {
      "class_id": "math-11b"
    }
  }
}`}</CodeBlock>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">Events</h2>
      <p className="mb-6 text-sm text-slate-600">
        {webhookEvents.length} events across {webhookCategories.length} categories.
      </p>

      {webhookCategories.map((category) => {
        const events = webhookEvents.filter((e) => e.category === category);
        return (
          <div key={category} className="mt-8">
            <h3 className="mb-3 text-lg font-semibold text-slate-900">{category}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-slate-200 text-left">
                    <th className="pb-3 pr-4 font-medium text-slate-500">Event</th>
                    <th className="pb-3 pr-4 font-medium text-slate-500">Trigger</th>
                    <th className="pb-3 font-medium text-slate-500">Key Fields</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((e) => (
                    <tr key={e.event} className="border-b border-slate-100">
                      <td className="py-2.5 pr-4">
                        <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono">
                          {e.event}
                        </code>
                      </td>
                      <td className="py-2.5 pr-4 text-slate-600">{e.trigger}</td>
                      <td className="py-2.5 text-slate-500">
                        {e.keyFields.map((f, i) => (
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

      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">Security</h2>
      <p className="mb-4 text-sm text-slate-600">
        All webhooks are signed with HMAC-SHA256 using your webhook secret. Verify the{' '}
        <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">X-Evelyn-Signature</code>{' '}
        header before processing. See{' '}
        <a href="/docs/authentication" className="text-blue-600 underline">Authentication</a> for
        verification code examples.
      </p>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">Retry Policy</h2>
      <p className="text-sm text-slate-600">
        Failed deliveries (non-2xx response) are retried with exponential backoff: 1 minute, 5
        minutes, 30 minutes, 2 hours, 24 hours. After 5 failed attempts, the event is logged and
        available via <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">GET /webhooks/:id/events</code>.
      </p>

      <Callout type="tip" title="Testing">
        Use <code>POST /webhooks/:id/test</code> to send a test event and verify your endpoint is
        configured correctly.
      </Callout>
    </div>
  );
}
