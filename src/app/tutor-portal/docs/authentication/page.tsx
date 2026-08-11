import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';

export default function AuthenticationPage() {
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-slate-900">Authentication</h1>
      <p className="mb-8 text-lg text-slate-600">
        JWT session tokens, API keys, and webhook signature verification.
      </p>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-slate-900">Credentials</h2>
      <p className="mb-4 text-sm text-slate-600">
        After your sandbox is provisioned, you receive three credentials:
      </p>
      <div className="mb-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-slate-200 text-left">
              <th className="pb-3 pr-4 font-medium text-slate-500">Credential</th>
              <th className="pb-3 pr-4 font-medium text-slate-500">Used For</th>
              <th className="pb-3 font-medium text-slate-500">Where</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="py-2.5 pr-4 font-medium text-slate-700">API Key</td>
              <td className="py-2.5 pr-4 text-slate-600">Server-to-server API calls</td>
              <td className="py-2.5 text-slate-500"><code className="text-xs">X-API-Key</code> header</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="py-2.5 pr-4 font-medium text-slate-700">API Secret</td>
              <td className="py-2.5 pr-4 text-slate-600">Signing JWT session tokens</td>
              <td className="py-2.5 text-slate-500">Your backend only</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="py-2.5 pr-4 font-medium text-slate-700">Webhook Secret</td>
              <td className="py-2.5 pr-4 text-slate-600">Verifying webhook signatures</td>
              <td className="py-2.5 text-slate-500">Your backend only</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Callout type="warning" title="Security">
        Never expose your API Secret or Webhook Secret in client-side code, version control, or logs.
      </Callout>

      {/* JWT Signing */}
      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">JWT Session Tokens</h2>
      <p className="mb-4 text-sm text-slate-600">
        Session tokens are JWTs signed with your API Secret using HMAC-SHA256. They contain the
        session configuration and are passed to the embed URL. The embed forwards the token on its
        API calls via the <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">x-embed-token</code> header,
        where the signature is verified.
      </p>

      <CodeBlock language="javascript" title="Node.js">{`import jwt from 'jsonwebtoken';

const token = jwt.sign(
  {
    partner_id: 'your-partner-id',
    student_id: 'stu_abc123',
    subject: 'math',
    level: '11-12',
    engine: 'standard',
    exp: Math.floor(Date.now() / 1000) + 7200 // 2 hours
  },
  process.env.EVELYN_API_SECRET,
  { algorithm: 'HS256' }
);`}</CodeBlock>

      <CodeBlock language="python" title="Python">{`import jwt, time, os

token = jwt.encode(
    {
        "partner_id": "your-partner-id",
        "student_id": "stu_abc123",
        "subject": "math",
        "level": "11-12",
        "engine": "standard",
        "exp": int(time.time()) + 7200
    },
    os.environ["EVELYN_API_SECRET"],
    algorithm="HS256"
)`}</CodeBlock>

      <CodeBlock language="php" title="PHP">{`use Firebase\\JWT\\JWT;

$token = JWT::encode([
    'partner_id' => 'your-partner-id',
    'student_id' => 'stu_abc123',
    'subject' => 'math',
    'level' => '11-12',
    'engine' => 'standard',
    'exp' => time() + 7200
], $_ENV['EVELYN_API_SECRET'], 'HS256');`}</CodeBlock>

      {/* API Key Auth */}
      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">API Key Authentication</h2>
      <p className="mb-4 text-sm text-slate-600">
        All REST API calls require your API Key in the <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">X-API-Key</code> header:
      </p>

      <CodeBlock language="bash">{`curl https://api.evelynlearning.com/v1/sessions \\
  -H "X-API-Key: YOUR_API_KEY"`}</CodeBlock>

      {/* Webhook Verification */}
      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">Webhook Signature Verification</h2>
      <p className="mb-4 text-sm text-slate-600">
        Every webhook request includes an <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">X-Evelyn-Signature</code> header
        containing an HMAC-SHA256 signature of the request body. Always verify this before processing.
      </p>

      <CodeBlock language="javascript" title="Node.js / Express">{`import crypto from 'crypto';

app.post('/webhooks/evelyn', (req, res) => {
  const signature = req.headers['x-evelyn-signature'];
  const expected = crypto
    .createHmac('sha256', process.env.EVELYN_WEBHOOK_SECRET)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (signature !== expected) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // Process the event
  const { event, data } = req.body;
  console.log(\`Received \${event}\`, data);
  res.status(200).json({ received: true });
});`}</CodeBlock>

      <CodeBlock language="python" title="Python / Flask">{`import hmac, hashlib, json
from flask import Flask, request, jsonify

@app.route('/webhooks/evelyn', methods=['POST'])
def handle_webhook():
    signature = request.headers.get('X-Evelyn-Signature')
    expected = hmac.new(
        os.environ['EVELYN_WEBHOOK_SECRET'].encode(),
        request.data,
        hashlib.sha256
    ).hexdigest()

    if not hmac.compare_digest(signature, expected):
        return jsonify(error='Invalid signature'), 401

    event = request.json
    print(f"Received {event['event']}", event['data'])
    return jsonify(received=True), 200`}</CodeBlock>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">Token Expiry</h2>
      <p className="text-sm text-slate-600">
        Session tokens should have a short expiry (1-2 hours). The token is validated on the embed's
        API calls; expired tokens are honored within a grace window so long sessions can commit at their end.
        We recommend 1-2 hour expiry and a fresh token for each session — do not reuse tokens.
      </p>
    </div>
  );
}
