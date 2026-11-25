# evelyn-tutor

Add the Evelyn Voice Tutor to your app from Python. The tutor is a hosted page (voice, whiteboard, typed chat) that you show in an iframe or a mobile WebView; your server signs a link for each session. This package signs that link, calls the worksheet and usage API, and verifies webhooks.

No dependencies (standard library only). Python 3.9 or later. Typed.

## Quick start

1. Get keys: sign up at https://tutor.evelynlearning.com/sandbox with an email address and confirm the link. The dashboard shows your partner id and secret, with 300 free tutoring minutes. Set them on your server as `EVELYN_PARTNER_ID` and `EVELYN_PARTNER_SECRET`.

2. Install and sign a session URL on your server:

```sh
pip install evelyn-tutor
```

```python
from evelyn_tutor import EvelynTutor

tutor = EvelynTutor()  # reads EVELYN_PARTNER_ID and EVELYN_PARTNER_SECRET
url = tutor.session_url({
    "student_id": "stu_abc123", "subject": "math", "level": "Grade 8",
    "topic": "Solving linear equations", "target_kind": "freestyle",
})
```

3. Show it in your page:

```html
<iframe
  src="SESSION_URL"
  allow="microphone; camera; autoplay; clipboard-write"
  allowfullscreen
  style="width:100%; height:100vh; border:0">
</iframe>
```

The student taps Start once and the lesson begins. Sign one URL per student per session. Creating a URL costs nothing: tutoring minutes are counted only while a session is running. For an Android WebView, see the [integration guide](https://tutor.evelynlearning.com/docs/integration.md).

## Session claims

| Claim | Notes |
|---|---|
| `student_id` | Required. Your own stable id for the student. |
| `subject`, `level` | `math`, `science`, `ela`, `social-studies` (also `cs`, `languages`), and the grade label, for example `"Grade 8"`. Send both with every session. |
| `topic` + `target_kind: "freestyle"` | Free text. The tutor builds the lesson on it. |
| `curriculum_module` | A lesson plan id, in place of `topic`. |
| `tutor_languages` | The lesson's language, for example `["hi"]`. See Languages below. Leave it out for English. |
| `switch_languages` | Languages the student may change the lesson to by asking the tutor. See Languages below. |
| `input_mode` | `"voice"` (default) or `"text"`. |
| `max_duration_minutes` | 1 to 120, default 30. In the sandbox a session ends at 15 minutes whatever this says. |
| `session_id`, `resume` | Your own session id; with `resume: True` the same id continues where the student left off (kept 30 days). |

`SessionClaims` documents the rest. The token expires after two hours (`expires_in_seconds` changes that). Obvious mistakes raise `EvelynConfigError` with a message that says what to change. Claims the package does not list are signed as given.

## Languages

A lesson is taught in English unless `tutor_languages` names another language. The whole lesson is then in that language: the tutor speaks it with a native voice, understands the student speaking it, and writes the board, the questions and the screen labels in it.

| `tutor_languages` | Lesson language |
|---|---|
| `["ja"]` | Japanese |
| `["zh-TW"]` | Traditional Chinese (Taiwan) |
| `["zh-CN"]` | Simplified Chinese |
| `["hi"]` | Hindi |
| `["hi-Latn"]` | Hinglish: spoken Hindi mixed with English, as students in India speak; the board stays in English |
| `["fr"]` | French |
| `["es"]` | Spanish (Latin America) |

The service adds languages, so read the list rather than writing it into your app:

```python
tutor.languages()
# [{"code": "hi", "label": "हिन्दी", "english": "Hindi", "firstTopic": "रैखिक समीकरण"}, …]
```

`languages()` needs no keys and never raises: when the list cannot be read it returns the list bundled with this version. `fetch_languages()` is the same call without a client.

**Changing language in the middle of a lesson.** By default a lesson stays in its language. With `switch_languages` the student may ask the tutor for another one ("can you explain in Hindi?") and the voice, the listening, the board and the screen labels change together:

```python
tutor.session_url({"student_id": "stu_abc123", "subject": "math", "level": "Grade 8", "topic": "Fractions",
                   "target_kind": "freestyle", "switch_languages": ["hi", "hi-Latn"]})   # or "all" (or True)
```

## Help with a photographed worksheet

```python
# 1. Read the sheet. Up to 4 images, each up to 8 MB (JPEG, PNG, WebP or GIF).
sheet = tutor.worksheet.read(
    images=[photo_bytes],          # bytes, a base64 string, or a file path
    subject="math", grade="Grade 8",
    locale="zh-TW",                # leave out for English
    student_id="stu_abc123",
)
# sheet["planId"], sheet["problems"] -> [{"n": 1, "text": "…"}, …]. Show the list to the student.

tutor.worksheet.build(sheet["planId"])            # optional: prepare every question in the background

# 2. Prepare the question the student picked.
question = tutor.worksheet.prepare(sheet["planId"], 3)

# 3. Open the session on it.
url = tutor.worksheet.session_url(question["planId"], {
    "student_id": "stu_abc123", "subject": "math", "level": "Grade 8", "tutor_languages": ["zh-TW"],
})

# 4. Afterwards, optionally: how did it go? (session_id comes from the page's session_ended event.)
result = tutor.worksheet.outcome(session_id, question["planId"])
# result["outcome"] is "done", "in_progress" or "needs_review". If the student returns to the question:
tutor.worksheet.prepare(sheet["planId"], 3, prior_note=result["priorNote"], prior_confirmed=result["confirmed"])
```

`worksheet.status(plan_id)` reports the progress of `build`. When a sheet cannot be split into questions, `problems` is absent and `planId` is an ordinary lesson plan on the material, usable as `curriculum_module`.

## Usage and session facts

```python
tutor.usage()
# {"partner_id": …, "pooled": True, "cap_minutes": …, "used_minutes": …, "remaining_minutes": …, "session_max_minutes": …}

tutor.sessions_summary(["sess-1", "sess-2"])   # up to 50 ids
```

Responses are the API's JSON as dicts, with the API's own key names.

## Without the client

```python
import json
from evelyn_tutor import create_session_url, create_session_token, verify_session_token, sign_request, fetch_languages

url = create_session_url(claims, partner_id=partner_id, secret=secret)
token = create_session_token(claims, partner_id=partner_id, secret=secret, expires_in_seconds=7200)
claims_back = verify_session_token(token, secret)   # for tests and debugging
languages = fetch_languages()                       # no keys needed

# Any other /api/portal/v1 endpoint: sign the exact string you send.
body = json.dumps({"studentId": "stu_abc123"})
headers = sign_request(method="POST", path="/api/portal/v1/student-erase", body=body, partner_id=partner_id, secret=secret)
```

A failed API call raises `EvelynApiError` with `status`, `code` (for example `unauthorized`), `reason` (for example `bad_signature`) and the response `body`.

## Events in the page

The session page posts messages to the page that embeds it: `evelyn:session_started`, `evelyn:progress` and `evelyn:session_ended` (`{ type, data }`, where `data` carries `session_id` and, at the end, `duration` and `ended_reason`). Listen with `window.addEventListener("message", …)` and check that `event.origin` is `https://tutor.evelynlearning.com`.

## Webhooks

Browser events never reach your server, and a closed tab sends none. Set a webhook URL on the dashboard and the service POSTs to your server instead:

| `type` | When | `data` |
|---|---|---|
| `session.ended` | Once per session, when its end is saved | `session_id`, `student_id`, `started_at`, `ended_at`, `duration_seconds`, `status`, `languages`, `subject`, `topic`, `input_mode`, `message_count` |
| `pool.low` | 80% of your tutoring minutes are used | `cap_minutes`, `used_minutes`, `remaining_minutes` |
| `pool.exhausted` | All of your minutes are used | the same |
| `webhook.test` | The dashboard's test button | `message` |

Every event is `{ id, type, created, partner_id, data }`, signed with your partner secret (headers `x-evelyn-timestamp` and `x-evelyn-signature`). Verify it against the raw body, before any JSON parsing. With Flask:

```python
import os
from flask import Flask, request
from evelyn_tutor import verify_webhook, EvelynWebhookError

app = Flask(__name__)

@app.post("/hooks/evelyn")
def evelyn_webhook():
    try:
        event = verify_webhook(request.get_data(), headers=request.headers, secret=os.environ["EVELYN_PARTNER_SECRET"])
    except EvelynWebhookError as err:
        return {"error": err.reason}, 400
    if event["type"] == "session.ended":
        save_session(event["id"], event["data"])
    return {"received": True}
```

In FastAPI the raw body is `await request.body()`; in Django, `request.body`. `verify_webhook` raises `EvelynWebhookError` with `reason` `bad_signature`, `stale_timestamp` (older than 5 minutes; `tolerance_ms` changes that) or `malformed`.

Delivery: the service waits 6 seconds for a 2xx answer and tries three times in all (at once, after 3 seconds, after 15 seconds). A retry carries the same `event["id"]`, so record the ids you have handled and ignore a repeat. A 4xx answer (other than 408 or 429) is not retried. Answer 2xx to event types you do not handle.

## Security

- The partner secret signs both session links and API calls. Keep it on your server: never in browser code, a mobile app, or a commit.
- A session URL lets its holder run that one session as that student until the token expires. Create it when the student is about to start, and do not log it.
- Take `student_id` from your own authentication, never from the request body.
- The sandbox is for evaluation with test data. Before real students use it, write to info@evelynlearning.com for an agreement.

## Versioning

- The API is version 1 (`/api/portal/v1`). Within v1 it only adds: new endpoints, new optional fields, new token claims, new event types, new languages. Nothing you already send or read changes meaning.
- A breaking change would be a new `/v2` path served side by side with v1, and a new major version of this package.
- Claims this version does not know are signed into the token as you give them, so a new option of the service can be used before you update.
- The package follows semantic versioning; changes are listed in `CHANGELOG.md`, shipped with the package.

## Node

The same surface, with a set-up command and an MCP server for coding assistants, is on npm as `@evelynlearning/tutor`.

## Licence

MIT
