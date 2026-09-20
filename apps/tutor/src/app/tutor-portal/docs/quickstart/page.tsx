import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';

export default function QuickstartPage() {
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-slate-900">Getting Started</h1>
      <p className="mb-8 text-lg text-slate-600">
        Embed a working AI Voice Tutor session in your platform in four steps.
      </p>

      {/* Step 1 */}
      <h2 className="mb-3 mt-8 text-xl font-semibold text-slate-900">1. Your credentials</h2>
      <p className="mb-4 text-sm text-slate-600">
        When your sandbox is provisioned you receive two values:
      </p>
      <ul className="mb-4 space-y-2 text-sm text-slate-600">
        <li><strong>Partner id</strong> — a short slug such as <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">kanzoo</code></li>
        <li><strong>Partner secret</strong> — one secret used for both the session token (HS256) and API request signing (HMAC-SHA256)</li>
      </ul>

      <Callout type="warning" title="Keep the secret server-side">
        Never put the partner secret in client-side code, version control or logs. Tokens are
        minted on your backend; the browser only ever sees a signed token.
      </Callout>

      {/* Step 2 */}
      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">2. Mint a session token</h2>
      <p className="mb-4 text-sm text-slate-600">
        When a student opens a lesson, your backend signs a JWT whose payload is the session
        configuration. Always include a <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">teacher</code>{' '}
        persona: it selects the tutor&apos;s name, style and natural voice.
      </p>

      <CodeBlock language="javascript" title="Node.js (no dependencies)">{`const crypto = require('crypto');
const teachers = require('./teachers.json');   // persona catalog, supplied with your credentials

const b64url = (b) => Buffer.from(b).toString('base64')
  .replace(/\\+/g, '-').replace(/\\//g, '_').replace(/=+$/, '');

function signEmbedToken(payload, secret) {
  const h = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const p = b64url(JSON.stringify(payload));
  const s = crypto.createHmac('sha256', secret).update(h + '.' + p).digest();
  return h + '.' + p + '.' + b64url(s);
}

const now = Math.floor(Date.now() / 1000);
const token = signEmbedToken({
  partner_id: 'kanzoo',
  student_id: 'stu_abc123',
  student_name: 'Ayaan',
  subject: 'math',
  level: 'Grade 6',
  topic: 'Ratios and unit rates',
  session_goal: 'homework-help',
  max_duration_minutes: 30,
  teacher: teachers.find((t) => t.id === 'ms-priya-nair'),
  iat: now,
  exp: now + 2 * 3600,
}, process.env.EVELYN_PARTNER_SECRET);`}</CodeBlock>

      <CodeBlock language="python" title="Python (standard library)">{`import base64, hashlib, hmac, json, os, time

def b64url(raw: bytes) -> str:
    return base64.urlsafe_b64encode(raw).rstrip(b"=").decode()

def sign_embed_token(payload: dict, secret: str) -> str:
    h = b64url(json.dumps({"alg": "HS256", "typ": "JWT"}, separators=(",", ":")).encode())
    p = b64url(json.dumps(payload, separators=(",", ":")).encode())
    s = hmac.new(secret.encode(), f"{h}.{p}".encode(), hashlib.sha256).digest()
    return f"{h}.{p}.{b64url(s)}"

teachers = json.load(open("teachers.json"))
now = int(time.time())
token = sign_embed_token({
    "partner_id": "kanzoo",
    "student_id": "stu_abc123",
    "student_name": "Ayaan",
    "subject": "math",
    "level": "Grade 6",
    "topic": "Ratios and unit rates",
    "session_goal": "homework-help",
    "max_duration_minutes": 30,
    "teacher": next(t for t in teachers if t["id"] == "ms-priya-nair"),
    "iat": now,
    "exp": now + 2 * 3600,
}, os.environ["EVELYN_PARTNER_SECRET"])`}</CodeBlock>

      <p className="mt-4 text-sm text-slate-500">
        Any JWT library works too (jsonwebtoken, PyJWT, firebase/php-jwt) with algorithm HS256.
        See <a href="/docs/embed" className="text-blue-600 underline">Embed Configuration</a> for
        every claim.
      </p>

      {/* Step 3 */}
      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">3. Embed the tutor</h2>
      <p className="mb-4 text-sm text-slate-600">
        Load the tutor in your page with one iframe. Pass the token as a query parameter:
      </p>

      <CodeBlock language="html" title="HTML">{`<iframe
  src="https://tutor.evelynlearning.com/embed?token=YOUR_SIGNED_TOKEN"
  allow="microphone; camera; autoplay; clipboard-write"
  allowfullscreen
  style="width:100%; height:100vh; border:0"
></iframe>`}</CodeBlock>

      <Callout type="info" title="Microphone permission">
        The iframe needs <code>allow=&quot;microphone&quot;</code> for voice mode. Give it as much
        height as you can; a full viewport is best, 640px is the practical minimum.
      </Callout>

      {/* Step 4 */}
      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">4. Listen for events, then pull the results</h2>
      <p className="mb-4 text-sm text-slate-600">
        The iframe posts events to your page. On <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">evelyn:session_ended</code>{' '}
        tell your backend, which then pulls the authoritative facts from the signed API.
      </p>

      <CodeBlock language="javascript" title="Host page">{`window.addEventListener('message', (event) => {
  if (event.origin !== 'https://tutor.evelynlearning.com') return;
  const msg = event.data;
  if (msg?.type === 'evelyn:session_ended') {
    fetch('/api/tutor-session-ended', {           // your endpoint
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(msg.data),             // { session_id, duration, milestone, ... }
    });
  }
});`}</CodeBlock>

      <CodeBlock language="bash" title="Backend: pull the facts (signed — see Authentication)">{`GET /api/portal/v1/sessions/summary?ids=SESSION_ID   # active minutes, turns, board items
GET /api/portal/v1/gaps?studentId=stu_abc123          # learning gaps
GET /api/portal/v1/mastery?studentId=stu_abc123       # mastery per objective`}</CodeBlock>

      <p className="mt-4 text-sm text-slate-600">
        See <a href="/docs/webhooks" className="text-blue-600 underline">Events</a> for every event
        and payload, and <a href="/docs/authentication" className="text-blue-600 underline">Authentication</a>{' '}
        for request signing.
      </p>

      {/* Next steps */}
      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">Next steps</h2>
      <ul className="space-y-2 text-sm text-slate-600">
        <li>
          <a href="/docs/modules" className="text-blue-600 underline">Teach your own material</a> — send
          an assignment or lesson through <code className="text-xs">plan-generate</code> and lock the session to it
        </li>
        <li>
          <a href="/docs/api" className="text-blue-600 underline">Explore the API</a> — learner state,
          practice items, grading, study notes
        </li>
        <li>
          <a href="/docs/whiteboard" className="text-blue-600 underline">Browse whiteboard types</a> — the
          visuals the tutor draws while it speaks
        </li>
      </ul>
    </div>
  );
}
