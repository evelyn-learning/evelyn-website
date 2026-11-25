# Evelyn Voice Tutor: integration guide

A hosted AI tutor (voice, whiteboard, typed chat) you embed with one signed link. This page is the whole integration.

## 1. What you get

- A hosted tutor (voice, whiteboard, typed chat) that you show in an iframe or a mobile WebView. No SDK.
- Lessons in English, or taught wholly in another language: Traditional Chinese (Taiwan), Simplified Chinese or Japanese. In those the tutor speaks with a native voice, understands the student's speech, and writes the board, the questions and the screen labels in that language.
- Worksheet help: your server sends a photo of the worksheet; the service reads the questions; the student picks a question by number and is tutored through it step by step, without being handed the answer.
- One shared secret. It signs the session token and your server-to-server calls.
- Sandbox: the production engine and endpoints, with **300 free tutoring minutes**.

## 2. Credentials

| Item | Value |
|---|---|
| `partner_id` | `YOUR_PARTNER_ID` |
| `partner_secret` | shown on your dashboard (API keys) |
| Session page | `https://tutor.evelynlearning.com/embed?token=<SIGNED_TOKEN>` |
| API host | `https://www.evelynlearning.com` |

Keep the secret on your server. Never put it in the tablet app.

## 3. Starting a lesson

Your server signs a token (JWT, `alg: HS256`, signed with the partner secret) and the tablet opens the session page with it. The token is the session's configuration. The claim that sets the lesson's language is `tutor_languages`; leave it out for English. The example below is a lesson taught in Traditional Chinese.

```json
{
  "partner_id": "YOUR_PARTNER_ID",
  "student_id": "your-internal-student-id",
  "student_name": "小安",
  "subject": "math",
  "level": "Grade 8",
  "topic": "聯立方程式：加減消去法",
  "target_kind": "freestyle",
  "tutor_languages": ["zh-TW"],
  "input_mode": "voice",
  "max_duration_minutes": 15,
  "iat": 1795550000,
  "exp": 1795557200
}
```

| Claim | Notes |
|---|---|
| `tutor_languages` | `["zh-TW"]` Traditional Chinese (Taiwan). Also available: `["zh-CN"]` Simplified Chinese, `["ja"]` Japanese. Leave it out for English. |
| `topic` | Free text in Chinese. The tutor builds the lesson on it. |
| `level` | The grade, e.g. `"Grade 8"` (國二). |
| `input_mode` | `voice` (default) or `text`. In a voice session the student can also type. |
| `student_id` | Your own stable id. All data for the student is keyed on it, scoped to your partner. |
| `max_duration_minutes` | 1 to 120, default 30. In the sandbox a session ends at 15 minutes whatever this says. |
| `exp` | Unix seconds. Two hours is a good value. |

Token signing in Node, with no dependencies:

```js
const crypto = require('crypto');
const b64url = (b) => Buffer.from(b).toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
function signEmbedToken(payload, secret) {
  const h = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const p = b64url(JSON.stringify(payload));
  const s = crypto.createHmac('sha256', secret).update(`${h}.${p}`).digest();
  return `${h}.${p}.${b64url(s)}`;
}
```

Any standard JWT library works as long as the algorithm is HS256 and the claims are top-level. Do not sign tokens on the tablet, and use one token per student per session.

## 4. Showing the session

In a web page:

```html
<iframe
  src="https://tutor.evelynlearning.com/embed?token=<SIGNED_TOKEN>"
  allow="microphone; camera; autoplay; clipboard-write"
  allowfullscreen
  style="width:100%; height:100vh; border:0">
</iframe>
```

In an Android WebView, load the same URL directly (no iframe needed) and set up the microphone, which a WebView does not grant on its own:

1. Declare `android.permission.RECORD_AUDIO`, `android.permission.MODIFY_AUDIO_SETTINGS` and `android.permission.INTERNET` in the manifest, and ask the user for `RECORD_AUDIO` at run time before opening the lesson.
2. In your `WebChromeClient`, grant the page's request:

```kotlin
override fun onPermissionRequest(request: PermissionRequest) {
    if (request.origin.host == "tutor.evelynlearning.com") request.grant(request.resources)
    else request.deny()
}
```

3. Settings the session needs:

```kotlin
webView.settings.javaScriptEnabled = true
webView.settings.domStorageEnabled = true
webView.settings.mediaPlaybackRequiresUserGesture = false
```

4. Use the current Android System WebView (Chrome 110 or later). The page must be loaded over HTTPS, as above.

The student taps Start once; that tap also lets the tutor's voice play.

## 5. Help with a photographed worksheet

The student photographs the worksheet in your app. Your server sends the photo to the service, which returns the numbered questions. The student picks one, and your server opens a session on that question.

Every API call is signed (see §6).

**Step 1. Send the photo.** `POST /api/portal/v1/plan-generate`

```json
{
  "text": "國二數學作業",
  "subject": "math",
  "grade": "Grade 8",
  "goal": "homework-help",
  "locale": "zh-TW",
  "studentId": "your-internal-student-id",
  "materials": [
    { "kind": "image", "mimeType": "image/jpeg", "data": "<base64 of the photo>" }
  ]
}
```

Up to 4 images, each up to 8 MB (JPEG, PNG, WebP or GIF). The response carries `planId` and `problems: [{ n, text }]`: the questions as printed, in Chinese, with their numbers. Show this list to the student.

**Step 2. Prepare the picked question.** `POST /api/portal/v1/homework-problem-plan`

```json
{ "planId": "<planId from step 1>", "n": 3, "waitMs": 8000 }
```

The response carries a `planId` for that one question. (Optional: `POST /api/portal/v1/homework-build` with `{ "planId": "…" }` right after step 1 prepares all questions in the background, so step 2 answers at once.)

**Step 3. Open the session.** Sign a token as in §3 with:

```json
{
  "session_goal": "homework-help",
  "curriculum_module": "<planId from step 2>",
  "tutor_languages": ["zh-TW"]
}
```

in place of `topic` and `target_kind`. The tutor shows the question on the board, asks the student how they would start, and guides them to their own answer. It does not give the answer away.

**Step 4 (optional). Read the result.** `GET /api/portal/v1/homework-problem-outcome?sessionId=…&planId=…` returns whether the student finished the question and a short note you can pass back in step 2 (`priorNote`, `priorConfirmed`) if the student returns to it.

## 6. Signing API calls

Every request to `/api/portal/v1/*` carries three headers:

```
x-evelyn-partner:    YOUR_PARTNER_ID
x-evelyn-timestamp:  <Unix time in milliseconds>
x-evelyn-signature:  <hex HMAC-SHA256>
```

The signature is HMAC-SHA256 with your partner secret over this string:

```
<timestamp>.<METHOD>.<path with query string>.<raw request body>
```

For example `1795550000000.POST./api/portal/v1/plan-generate.{"text":…}`. The body must be signed exactly as sent. The timestamp must be within 5 minutes of the server's clock.

```js
const crypto = require('crypto');
async function portal(method, path, body, secret) {
  const raw = body ? JSON.stringify(body) : '';
  const ts = String(Date.now());
  const sig = crypto.createHmac('sha256', secret).update(`${ts}.${method}.${path}.${raw}`).digest('hex');
  const res = await fetch(`https://www.evelynlearning.com${path}`, {
    method,
    headers: { 'content-type': 'application/json', 'x-evelyn-partner': 'YOUR_PARTNER_ID', 'x-evelyn-timestamp': ts, 'x-evelyn-signature': sig },
    body: raw || undefined,
  });
  return res.json();
}
```

## 7. Events and usage

The session page posts messages to its host (`window.parent.postMessage({ type, data }, '*')`; in a WebView, add a JavaScript interface or load the page inside your own host page to receive them):

| `type` | `data` |
|---|---|
| `evelyn:session_started` | `{ session_id }` |
| `evelyn:session_ended` | `{ session_id, duration, ended_reason?, … }` |

`GET /api/portal/v1/usage` (signed) returns the minutes used and left in your sandbox.

## 8. Getting keys

Sign up at https://tutor.evelynlearning.com/sandbox with an email address. Confirm the emailed link and the dashboard shows your partner id and secret at once, with 300 free tutoring minutes. No request or approval is needed. The dashboard (https://tutor.evelynlearning.com/dashboard) also shows minutes used, your sessions with replays, and a button that starts a test lesson without any code.

The sandbox is for evaluation with test data. Before real students use it, write to info@evelynlearning.com for an agreement.
