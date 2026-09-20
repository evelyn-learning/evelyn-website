import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';

export default function AuthenticationPage() {
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-slate-900">Authentication</h1>
      <p className="mb-8 text-lg text-slate-600">
        One partner secret, two uses: signing session tokens and signing API requests.
      </p>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-slate-900">Credentials</h2>
      <div className="mb-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-slate-200 text-left">
              <th className="pb-3 pr-4 font-medium text-slate-500">Credential</th>
              <th className="pb-3 pr-4 font-medium text-slate-500">Used for</th>
              <th className="pb-3 font-medium text-slate-500">Where</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="py-2.5 pr-4 font-medium text-slate-700">Partner id</td>
              <td className="py-2.5 pr-4 text-slate-600">Identifies you in tokens and requests</td>
              <td className="py-2.5 text-slate-500"><code className="text-xs">partner_id</code> claim · <code className="text-xs">x-evelyn-partner</code> header</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="py-2.5 pr-4 font-medium text-slate-700">Partner secret</td>
              <td className="py-2.5 pr-4 text-slate-600">HS256 session tokens · HMAC-SHA256 API requests</td>
              <td className="py-2.5 text-slate-500">Your backend only</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Callout type="warning" title="Security">
        Never expose the partner secret in client-side code, version control or logs. To rotate it,
        contact us: we add the new secret beside the old one so there is no cutover window, then
        retire the old one.
      </Callout>

      {/* Session tokens */}
      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">Session tokens (embed)</h2>
      <p className="mb-4 text-sm text-slate-600">
        A JWT, <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">alg: HS256</code>, signed with your
        partner secret. The payload is the session configuration (see{' '}
        <a href="/docs/embed" className="text-blue-600 underline">Embed Configuration</a>). The embed
        forwards the token on its own API calls via the{' '}
        <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">x-embed-token</code> header, where the
        signature is verified.
      </p>

      <CodeBlock language="javascript" title="Node.js (jsonwebtoken)">{`import jwt from 'jsonwebtoken';

const token = jwt.sign(
  {
    partner_id: 'kanzoo',
    student_id: 'stu_abc123',
    subject: 'math',
    level: 'Grade 6',
    teacher: persona,                       // from the persona catalog
    exp: Math.floor(Date.now() / 1000) + 7200,
  },
  process.env.EVELYN_PARTNER_SECRET,
  { algorithm: 'HS256' },
);`}</CodeBlock>

      <CodeBlock language="php" title="PHP (firebase/php-jwt)">{`use Firebase\\JWT\\JWT;

$token = JWT::encode([
    'partner_id' => 'kanzoo',
    'student_id' => 'stu_abc123',
    'subject'    => 'math',
    'level'      => 'Grade 6',
    'teacher'    => $persona,
    'exp'        => time() + 7200,
], $_ENV['EVELYN_PARTNER_SECRET'], 'HS256');`}</CodeBlock>

      <p className="mb-4 text-sm text-slate-600">
        Recommended expiry: 2 hours. The engine allows a 4-hour grace after{' '}
        <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">exp</code> so a long session never
        fails mid-lesson. Mint a fresh token per session; do not reuse tokens across students.
      </p>

      {/* Request signing */}
      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">API request signing (server-to-server)</h2>
      <p className="mb-4 text-sm text-slate-600">
        Every request to <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">/api/portal/v1/*</code>{' '}
        carries three headers. The signature binds the method, path, query, timestamp and body, so a
        captured request cannot be replayed elsewhere.
      </p>

      <CodeBlock language="text" title="Headers">{`x-evelyn-partner:    kanzoo
x-evelyn-timestamp:  1789450837123          # unix epoch MILLISECONDS, as a string
x-evelyn-signature:  <hex HMAC-SHA256>`}</CodeBlock>

      <CodeBlock language="text" title="Canonical string">{`signing_string = timestamp + "." + METHOD + "." + path_with_query + "." + raw_body
signature      = hex( HMAC_SHA256( partner_secret, signing_string ) )

METHOD          upper-case, e.g. GET / POST
path_with_query everything after the host, e.g. /api/portal/v1/gaps?studentId=stu_abc123
raw_body        the exact JSON string you send; "" for GET`}</CodeBlock>

      <CodeBlock language="javascript" title="Node.js (no dependencies)">{`const crypto = require('crypto');
const BASE = 'https://www.evelynlearning.com';

async function portalFetch(method, path, body) {
  const raw = body === undefined ? '' : JSON.stringify(body);
  const timestamp = String(Date.now());
  const signature = crypto.createHmac('sha256', process.env.EVELYN_PARTNER_SECRET)
    .update(\`\${timestamp}.\${method.toUpperCase()}.\${path}.\${raw}\`)
    .digest('hex');
  const res = await fetch(BASE + path, {
    method,
    headers: {
      'content-type': 'application/json',
      'x-evelyn-partner': 'kanzoo',
      'x-evelyn-timestamp': timestamp,
      'x-evelyn-signature': signature,
    },
    body: raw || undefined,
  });
  return res.json();
}

const gaps = await portalFetch('GET', '/api/portal/v1/gaps?studentId=stu_abc123');`}</CodeBlock>

      <CodeBlock language="python" title="Python (standard library + requests)">{`import hashlib, hmac, json, os, time, requests

BASE = "https://www.evelynlearning.com"

def portal_request(method: str, path: str, body: dict | None = None):
    raw = "" if body is None else json.dumps(body, separators=(",", ":"))
    ts = str(int(time.time() * 1000))
    sig = hmac.new(os.environ["EVELYN_PARTNER_SECRET"].encode(),
                   f"{ts}.{method.upper()}.{path}.{raw}".encode(), hashlib.sha256).hexdigest()
    return requests.request(method, BASE + path, data=raw or None, headers={
        "content-type": "application/json",
        "x-evelyn-partner": "kanzoo",
        "x-evelyn-timestamp": ts,
        "x-evelyn-signature": sig,
    }).json()`}</CodeBlock>

      <Callout type="info" title="Clock skew">
        The timestamp must be within ±5 minutes of server time (UTC). A{' '}
        <code>stale_timestamp</code> rejection means your server clock drifted.
      </Callout>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">Error responses</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-slate-200 text-left">
              <th className="pb-3 pr-4 font-medium text-slate-500">HTTP</th>
              <th className="pb-3 pr-4 font-medium text-slate-500">reason</th>
              <th className="pb-3 font-medium text-slate-500">Meaning</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100"><td className="py-2.5 pr-4">401</td><td className="py-2.5 pr-4"><code className="text-xs">missing_auth_headers · unknown_partner · bad_signature · stale_timestamp · bad_timestamp</code></td><td className="py-2.5 text-slate-600">Fix the signing.</td></tr>
            <tr className="border-b border-slate-100"><td className="py-2.5 pr-4">403</td><td className="py-2.5 pr-4"><code className="text-xs">partner_suspended · endpoint_not_allowed</code></td><td className="py-2.5 text-slate-600">Contact us.</td></tr>
            <tr className="border-b border-slate-100"><td className="py-2.5 pr-4">429</td><td className="py-2.5 pr-4"><code className="text-xs">rate_limited</code></td><td className="py-2.5 text-slate-600">Default 600 requests/min, burst 60. Honour <code className="text-xs">retryAfterSec</code>.</td></tr>
            <tr className="border-b border-slate-100"><td className="py-2.5 pr-4">402</td><td className="py-2.5 pr-4"><code className="text-xs">quota_exceeded</code></td><td className="py-2.5 text-slate-600">Daily request quota (not set for sandboxes).</td></tr>
            <tr className="border-b border-slate-100"><td className="py-2.5 pr-4">400</td><td className="py-2.5 pr-4"><code className="text-xs">bad_request</code></td><td className="py-2.5 text-slate-600">Validation failed; the failing field is in <code className="text-xs">issues</code>.</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
