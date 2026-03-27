import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';

export default function QuickstartPage() {
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-slate-900">Getting Started</h1>
      <p className="mb-8 text-lg text-slate-600">
        Embed a working AI Voice Tutor session in your platform in three steps.
      </p>

      {/* Step 1 */}
      <h2 className="mb-3 mt-8 text-xl font-semibold text-slate-900">1. Get Your API Keys</h2>
      <p className="mb-4 text-sm text-slate-600">
        After your sandbox request is approved, you&apos;ll receive three credentials:
      </p>
      <ul className="mb-4 space-y-2 text-sm text-slate-600">
        <li><strong>API Key</strong> — for server-to-server API calls (module uploads, session queries)</li>
        <li><strong>API Secret</strong> — for signing JWT session tokens</li>
        <li><strong>Webhook Secret</strong> — for verifying incoming webhook signatures</li>
      </ul>

      <Callout type="warning" title="Keep secrets server-side">
        Never expose your API Secret or Webhook Secret in client-side code. JWT signing and webhook
        verification must happen on your backend.
      </Callout>

      {/* Step 2 */}
      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">2. Generate a Session Token</h2>
      <p className="mb-4 text-sm text-slate-600">
        When a student starts a tutoring session, your backend generates a signed JWT containing the
        session configuration:
      </p>

      <CodeBlock language="javascript" title="Node.js example">{`import jwt from 'jsonwebtoken';

const token = jwt.sign({
  partner_id: 'your-partner-id',
  student_id: 'stu_abc123',
  student_name: 'Ahmed',
  subject: 'math',
  level: '11-12',
  engine: 'standard',        // 'standard' or 'premium'
  locale: 'ar-DZ',
  session_goal: 'test-prep',
  branding: {
    primary_color: '#1E40AF',
    product_name: 'BAC Tutor'
  }
}, process.env.EVELYN_API_SECRET, { expiresIn: '2h' });`}</CodeBlock>

      <CodeBlock language="python" title="Python example">{`import jwt, time

token = jwt.encode({
    "partner_id": "your-partner-id",
    "student_id": "stu_abc123",
    "student_name": "Ahmed",
    "subject": "math",
    "level": "11-12",
    "engine": "standard",
    "locale": "ar-DZ",
    "session_goal": "test-prep",
    "branding": {
        "primary_color": "#1E40AF",
        "product_name": "BAC Tutor"
    },
    "exp": int(time.time()) + 7200
}, os.environ["EVELYN_API_SECRET"], algorithm="HS256")`}</CodeBlock>

      <p className="mt-4 text-sm text-slate-500">
        See <a href="/docs/embed" className="text-blue-600 underline">Embed Configuration</a> for
        all available parameters.
      </p>

      {/* Step 3 */}
      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">3. Embed the Tutor</h2>
      <p className="mb-4 text-sm text-slate-600">
        Load the tutor in your frontend with a single iframe. Pass the JWT as a query parameter:
      </p>

      <CodeBlock language="html" title="HTML">{`<iframe
  src="https://tutor.evelynlearning.com/embed?token=YOUR_JWT_TOKEN"
  width="100%"
  height="700"
  allow="microphone; camera"
  frameborder="0"
></iframe>`}</CodeBlock>

      <Callout type="info" title="Microphone permission">
        The iframe requires the <code>allow=&quot;microphone&quot;</code> attribute for voice mode. Without
        it, the browser will block audio input and the tutor will fall back to text-only mode.
      </Callout>

      {/* Step 4 */}
      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">4. Handle Webhooks</h2>
      <p className="mb-4 text-sm text-slate-600">
        Register a webhook endpoint to receive session events. Configure it via the API:
      </p>

      <CodeBlock language="bash" title="Register webhook">{`curl -X POST https://api.evelynlearning.com/v1/webhooks \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://your-app.com/webhooks/evelyn",
    "events": ["session.ended", "usage.summary", "student.milestone"]
  }'`}</CodeBlock>

      <p className="mt-4 text-sm text-slate-600">
        See <a href="/docs/webhooks" className="text-blue-600 underline">Webhooks</a> for all 15
        event types and payload schemas, and{' '}
        <a href="/docs/authentication" className="text-blue-600 underline">Authentication</a> for
        signature verification.
      </p>

      {/* Next steps */}
      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">Next Steps</h2>
      <ul className="space-y-2 text-sm text-slate-600">
        <li>
          <a href="/docs/modules" className="text-blue-600 underline">Upload your curriculum</a> — define
          knowledge modules aligned to your national standards
        </li>
        <li>
          <a href="/docs/api" className="text-blue-600 underline">Explore the API</a> — query sessions,
          track student progress, manage usage
        </li>
        <li>
          <a href="/docs/whiteboard" className="text-blue-600 underline">Browse whiteboard types</a> — see
          all 19 visual types the tutor can generate
        </li>
      </ul>
    </div>
  );
}
