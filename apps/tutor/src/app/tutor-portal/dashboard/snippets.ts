/**
 * The code examples the dashboard shows, with the signed-in partner's id filled in. Adapted from the partner
 * integration guide (docs/whitelabel/lumiq/integration-guide.md at the repo root), made generic.
 *
 * The secret is never written into an example: every snippet reads it from the server's environment.
 */

export const SESSION_PAGE = 'https://tutor.evelynlearning.com/embed';
export const API_HOST = 'https://www.evelynlearning.com';

/** Token signing in Node with no dependencies (guide §3), then one use of it. */
export function signTokenSnippet(partnerId: string): string {
  return `const crypto = require('crypto');
const b64url = (b) => Buffer.from(b).toString('base64').replace(/\\+/g,'-').replace(/\\//g,'_').replace(/=+$/,'');
function signEmbedToken(payload, secret) {
  const h = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const p = b64url(JSON.stringify(payload));
  const s = crypto.createHmac('sha256', secret).update(\`\${h}.\${p}\`).digest();
  return \`\${h}.\${p}.\${b64url(s)}\`;
}

// On your server, one token per student per session:
const now = Math.floor(Date.now() / 1000);
const token = signEmbedToken({
  partner_id: '${partnerId}',
  student_id: 'your-internal-student-id',
  subject: 'math',
  level: 'Grade 8',
  topic: 'Solving linear equations',
  target_kind: 'freestyle',
  iat: now,
  exp: now + 2 * 60 * 60,
}, process.env.EVELYN_PARTNER_SECRET);

const sessionUrl = \`${SESSION_PAGE}?token=\${token}\`;`;
}

export function claimsExample(partnerId: string, sessionMinutes: number): string {
  return JSON.stringify({
    partner_id: partnerId,
    student_id: 'your-internal-student-id',
    student_name: 'Ana',
    subject: 'math',
    level: 'Grade 8',
    topic: 'Solving linear equations',
    target_kind: 'freestyle',
    tutor_languages: ['zh-TW'],
    input_mode: 'voice',
    max_duration_minutes: sessionMinutes,
    iat: 1795550000,
    exp: 1795557200,
  }, null, 2);
}

export const iframeSnippet = `<iframe
  src="${SESSION_PAGE}?token=<SIGNED_TOKEN>"
  allow="microphone; camera; autoplay; clipboard-write"
  allowfullscreen
  style="width:100%; height:100vh; border:0">
</iframe>`;

export const webviewPermissionSnippet = `override fun onPermissionRequest(request: PermissionRequest) {
    if (request.origin.host == "tutor.evelynlearning.com") request.grant(request.resources)
    else request.deny()
}`;

export const webviewSettingsSnippet = `webView.settings.javaScriptEnabled = true
webView.settings.domStorageEnabled = true
webView.settings.mediaPlaybackRequiresUserGesture = false`;

export const planGenerateBody = `{
  "text": "Grade 8 maths homework",
  "subject": "math",
  "grade": "Grade 8",
  "goal": "homework-help",
  "locale": "en",
  "studentId": "your-internal-student-id",
  "materials": [
    { "kind": "image", "mimeType": "image/jpeg", "data": "<base64 of the photo>" }
  ]
}`;

export const problemPlanBody = `{ "planId": "<planId from step 1>", "n": 3, "waitMs": 8000 }`;

export function homeworkClaims(partnerId: string): string {
  return `{
  "partner_id": "${partnerId}",
  "student_id": "your-internal-student-id",
  "session_goal": "homework-help",
  "curriculum_module": "<planId from step 2>",
  "iat": 1795550000,
  "exp": 1795557200
}`;
}

export function signingHeaders(partnerId: string): string {
  return `x-evelyn-partner:    ${partnerId}
x-evelyn-timestamp:  <Unix time in milliseconds>
x-evelyn-signature:  <hex HMAC-SHA256>`;
}

export const signingString = `<timestamp>.<METHOD>.<path with query string>.<raw request body>`;

export function portalCallSnippet(partnerId: string): string {
  return `const crypto = require('crypto');
async function portal(method, path, body, secret = process.env.EVELYN_PARTNER_SECRET) {
  const raw = body ? JSON.stringify(body) : '';
  const ts = String(Date.now());
  const sig = crypto.createHmac('sha256', secret).update(\`\${ts}.\${method}.\${path}.\${raw}\`).digest('hex');
  const res = await fetch(\`${API_HOST}\${path}\`, {
    method,
    headers: { 'content-type': 'application/json', 'x-evelyn-partner': '${partnerId}', 'x-evelyn-timestamp': ts, 'x-evelyn-signature': sig },
    body: raw || undefined,
  });
  return res.json();
}

// Minutes used and left in your sandbox:
const usage = await portal('GET', '/api/portal/v1/usage');`;
}

export const eventsSnippet = `window.addEventListener('message', (e) => {
  if (e.origin !== 'https://tutor.evelynlearning.com') return;
  const { type, data } = e.data || {};
  if (type === 'evelyn:session_started') console.log('started', data.session_id);
  if (type === 'evelyn:session_ended') console.log('ended', data.session_id, data.duration);
});`;
