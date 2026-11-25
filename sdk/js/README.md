# @evelynlearning/tutor

Add the Evelyn Voice Tutor to your app. The tutor is a hosted page (voice, whiteboard, typed chat) that you show in an iframe or a mobile WebView; your server signs a link for each session. This package signs that link, calls the worksheet and usage API, sets a project up from the command line, and gives coding assistants an MCP server so they can do the integration themselves.

No runtime dependencies. Node 18 or later. ES modules, CommonJS and TypeScript types.

## Quick start

1. Get keys: sign up at https://tutor.evelynlearning.com/sandbox with an email address and confirm the link. The dashboard shows your partner id and secret, with 300 free tutoring minutes.

2. Install, and let the command save the keys and write a working example for your project (Next.js, Express or plain Node):

```sh
npm install @evelynlearning/tutor
npx @evelynlearning/tutor init
```

Or by hand. On your server:

```js
import { EvelynTutor } from '@evelynlearning/tutor';

const tutor = new EvelynTutor(); // reads EVELYN_PARTNER_ID and EVELYN_PARTNER_SECRET
const url = tutor.sessionUrl({
  student_id: 'stu_abc123', subject: 'math', level: 'Grade 8',
  topic: 'Solving linear equations', target_kind: 'freestyle',
});
```

In your page, with the URL your server returned:

```html
<iframe
  src="SESSION_URL"
  allow="microphone; camera; autoplay; clipboard-write"
  allowfullscreen
  style="width:100%; height:100vh; border:0">
</iframe>
```

The student taps Start once and the lesson begins. Sign one URL per student per session. Creating a URL costs nothing: tutoring minutes are counted only while a session is running.

In an Android WebView, load the same URL directly and grant the page the microphone; the steps are in the [integration guide](https://tutor.evelynlearning.com/docs/integration.md) (`npx @evelynlearning/tutor docs` prints it).

## Session claims

`sessionUrl(claims)` and `sessionToken(claims)` take the session's configuration. The types carry a comment for every claim; the ones used most:

| Claim | Notes |
|---|---|
| `student_id` | Required. Your own stable id for the student. All data for the student is keyed on it, scoped to your partner. |
| `subject`, `level` | `math`, `science`, `ela`, `social-studies` (also `cs`, `languages`), and the grade label, for example `"Grade 8"`. Send both with every session. |
| `topic` + `target_kind: 'freestyle'` | Free text. The tutor builds the lesson on it. |
| `curriculum_module` | A lesson plan id, in place of `topic`. Locks the session to that plan. |
| `tutor_languages` | See Languages below. Leave it out for English. |
| `input_mode` | `'voice'` (default) or `'text'`. In a voice session the student can also type. |
| `max_duration_minutes` | 1 to 120, default 30. In the sandbox a session ends at 15 minutes whatever this says. |
| `session_id`, `resume` | Your own session id; with `resume: true` the same id continues where the student left off (kept 30 days). |
| `student_name`, `teacher`, `voice`, `branding`, `metadata` | Optional. |

The token expires after two hours (`{ expiresInSeconds }` changes that). `partner_id`, `iat` and `exp` are set for you. Obvious mistakes (no `student_id`, `tutor_languages` not an array, a duration outside 1 to 120) throw an `EvelynConfigError` that says what to change.

## Languages

A lesson is taught in English unless `tutor_languages` says otherwise. With one of these the whole lesson (the tutor's speech, the board, the questions, the screen labels) is in that language, and the tutor understands the student speaking it:

| `tutor_languages` | Lesson language |
|---|---|
| `['zh-TW']` | Traditional Chinese (Taiwan) |
| `['zh-CN']` | Simplified Chinese |
| `['ja']` | Japanese |

```js
tutor.sessionUrl({
  student_id: 'stu_abc123', student_name: '小安', subject: 'math', level: 'Grade 8',
  topic: '聯立方程式：加減消去法', target_kind: 'freestyle', tutor_languages: ['zh-TW'],
});
```

## Help with a photographed worksheet

The student photographs a worksheet in your app; your server sends the photo; the service returns the numbered questions; the student picks one and is tutored through it without being handed the answer.

```js
// 1. Read the sheet. Up to 4 images, each up to 8 MB (JPEG, PNG, WebP or GIF).
const sheet = await tutor.worksheet.read({
  images: [{ data: photoBuffer }],   // bytes, a base64 string, or a file path
  subject: 'math',
  grade: 'Grade 8',
  locale: 'zh-TW',                   // leave out for English
  studentId: 'stu_abc123',
});
// sheet.planId, sheet.problems → [{ n: 1, text: '…' }, …]. Show the list to the student.

// Optional: prepare every question in the background, so step 2 answers at once.
await tutor.worksheet.build(sheet.planId);

// 2. Prepare the question the student picked.
const question = await tutor.worksheet.prepare(sheet.planId, 3);

// 3. Open the session on it.
const url = tutor.worksheet.sessionUrl(question.planId, {
  student_id: 'stu_abc123', subject: 'math', level: 'Grade 8', tutor_languages: ['zh-TW'],
});

// 4. Afterwards, optionally: how did it go? (sessionId comes from the session_ended event.)
const result = await tutor.worksheet.outcome(sessionId, question.planId);
// result.outcome is 'done', 'in_progress' or 'needs_review'. If the student returns to the question:
await tutor.worksheet.prepare(sheet.planId, 3, { priorNote: result.priorNote, priorConfirmed: result.confirmed });
```

`worksheet.status(planId)` reports the progress of `build`. When a sheet cannot be split into questions, `sheet.problems` is absent and `sheet.planId` is an ordinary lesson plan on the material, usable as `curriculum_module`.

## In the browser: iframe and events

`@evelynlearning/tutor/embed` has no secret and no crypto, and is safe to bundle for the browser:

```js
import { mountTutor } from '@evelynlearning/tutor/embed';

const tutor = mountTutor(document.getElementById('tutor'), {
  sessionUrl,                               // from your server
  onStarted: ({ session_id }) => {},
  onProgress: ({ lesson_progress }) => {},
  onEnded: ({ session_id, duration, ended_reason }) => {},
});
// later: tutor.destroy();
```

The iframe fills its container, so give the container a height. Messages are accepted only from the session page's origin and only from this iframe. `onEvent` receives every `evelyn:*` message, including `evelyn:start_blocked` (for example when your minutes are used up) and `evelyn:clock`.

## Usage and session facts

```js
const usage = await tutor.usage();
// { partner_id, pooled: true, cap_minutes, used_minutes, remaining_minutes, session_max_minutes }

const sessions = await tutor.sessions.summary(['sess-1', 'sess-2']); // up to 50 ids
// [{ sessionId, status, startedAt, endedAt, durationSec, mode, studentTurns, tutorTurns, boardItems }]
```

Cache `usage()` for 60 seconds, and hide your start button when `remaining_minutes` is under 1.

## Without the client

```js
import { createSessionUrl, createSessionToken, sessionUrl, verifySessionToken, signRequest } from '@evelynlearning/tutor';

const url = createSessionUrl(claims, { partnerId, secret });           // token + URL in one step
const token = createSessionToken(claims, { partnerId, secret, expiresInSeconds: 7200 });
const claimsBack = verifySessionToken(token, secret);                  // for tests and debugging

// Any other /api/portal/v1 endpoint: sign the exact string you send.
const body = JSON.stringify({ studentId: 'stu_abc123' });
const headers = signRequest({ method: 'POST', path: '/api/portal/v1/student-erase', body, partnerId, secret });
await fetch('https://www.evelynlearning.com/api/portal/v1/student-erase', {
  method: 'POST', headers: { ...headers, 'content-type': 'application/json' }, body,
});
```

A failed API call throws `EvelynApiError` with `status`, `code` (for example `unauthorized`), `reason` (for example `bad_signature`) and the response `body`.

## Command line

```
npx @evelynlearning/tutor init      save your keys in .env.local / .env (kept out of git) and write a working example
npx @evelynlearning/tutor token     print a session URL:  --student test-1 --topic "Fractions" [--language zh-TW] [--mode text]
npx @evelynlearning/tutor usage     minutes used and left
npx @evelynlearning/tutor doctor    check the keys, this machine's clock and one signed API call
npx @evelynlearning/tutor docs      print the integration guide
npx @evelynlearning/tutor mcp       run the MCP server
```

`init` never overwrites a key already in your env file, and never overwrites an existing file unless you pass `--force`. `--yes` asks nothing and takes the keys from the environment. The commands read keys from `EVELYN_PARTNER_ID` and `EVELYN_PARTNER_SECRET`, or from `.env.local` / `.env` in the current directory.

## For coding assistants (MCP)

The package includes an MCP server, so Claude Code, Cursor and other assistants can read the guide, write the example files, create a test session and check the setup.

Claude Code, from your project directory:

```sh
claude mcp add evelyn-tutor -- npx -y -p @evelynlearning/tutor evelyn-tutor-mcp
```

Cursor (`.cursor/mcp.json`) and other clients that take the JSON form:

```json
{
  "mcpServers": {
    "evelyn-tutor": {
      "command": "npx",
      "args": ["-y", "-p", "@evelynlearning/tutor", "evelyn-tutor-mcp"]
    }
  }
}
```

The server reads the keys from its environment, or from `.env.local` / `.env` in the directory it is started in. If your client starts servers somewhere else, pass the two variables in the client's `env` setting; do not commit that file.

| Tool | What it does |
|---|---|
| `evelyn_docs` | Returns the integration guide. |
| `evelyn_get_keys_instructions` | Says how to sign up and where the keys go. Sign-up needs a person. |
| `evelyn_scaffold` | Returns example files for Next.js, Express or plain Node, for the assistant to write. |
| `evelyn_create_session_url` | Claims in, session URL out. |
| `evelyn_usage` | Minutes used and left. |
| `evelyn_read_worksheet` | Image file paths in, numbered questions out. |
| `evelyn_prepare_problem` | Prepares one question and returns its plan id. |
| `evelyn_doctor` | Checks keys, clock and a signed call, and says what to fix. |

Only opening a session URL and starting the lesson uses tutoring minutes.

## Security

- The partner secret signs both session links and API calls. Keep it on your server: never in browser code, a mobile app, or a commit. `new EvelynTutor()` throws if it is built in a browser.
- A session URL lets its holder run that one session as that student until the token expires. Create it when the student is about to start, for the signed-in student, and do not log it.
- Take `student_id` from your own authentication, never from the request body.
- The sandbox is for evaluation with test data. Before real students use it, write to info@evelynlearning.com for an agreement.

## Python

The same surface is on PyPI as `evelyn-tutor` (`from evelyn_tutor import EvelynTutor`).

## Licence

MIT
