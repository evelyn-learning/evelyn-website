# Voice Tutor — Partner Integration Guide

**Prepared for:** Kanzoo Global Private Limited / DUC Academy
**Version:** 1.0 · 15 September 2026 · portal contract v1.16.0
**Support:** info@evelynlearning.com (technical questions welcome by email; WhatsApp for urgent items)

This document describes the integration surface exactly as it runs in production today. Where a capability is planned but not yet live, it says so explicitly (§10).

---

## 1. What you get

- A hosted voice + whiteboard tutor, embedded in your LMS as an iframe. No SDK, no separate whiteboard integration.
- One shared secret that signs (a) the per-session embed token and (b) server-to-server API calls.
- Browser events from the iframe (session started / progress / ended).
- A signed REST API to push student context in and pull results out (mastery, gaps, session facts, assigned practice, generated lesson plans).
- Sandbox: same engine and endpoints as production, on the same hosts. **300 free tutoring minutes** for integration testing. Ask if you need more.

## 2. Architecture

```
DUC student browser                      Evelyn engine (hosted)
┌──────────────────────────┐             ┌────────────────────────────┐
│ DUC LMS page             │             │ tutor.evelynlearning.com   │
│  <iframe src=            │ ─────────►  │   /embed?token=<JWT>       │
│   tutor…/embed?token=…>  │ ◄─────────  │   postMessage events       │
└──────────┬───────────────┘             └──────────────┬─────────────┘
           │ token minted by                            │
           ▼                                            ▼
┌──────────────────────────┐   HMAC-signed   ┌────────────────────────────┐
│ DUC backend              │ ◄─────────────► │ www.evelynlearning.com     │
│  signs JWT, calls API,   │                 │   /api/portal/v1/*         │
│  stores results          │                 │   (partner-scoped data)    │
└──────────────────────────┘                 └────────────────────────────┘
```

**Session lifecycle**

1. Student opens a lesson/assignment in DUC. Your backend mints a signed embed token carrying the student and lesson context.
2. Your page loads the iframe with that token. The tutor runs the session (voice, whiteboard, Socratic practice).
3. The iframe posts `evelyn:session_started`, `evelyn:progress` (per lesson segment) and `evelyn:session_ended` to the parent window.
4. On `session_ended`, your backend pulls structured results: `GET /sessions/summary`, `GET /gaps`, `GET /mastery`, `GET /learner-state`, `GET /assigned-practice`.
5. Optionally, before the next session, `POST /context` gives the tutor continuity (name, grade, preferences, what happened last time).

The engine stores session facts (transcript, board, active minutes) keyed to your `partner_id` and your own `student_id`. Student ids are scoped to your partner, so you can use your internal ids as-is.

## 3. Credentials

| Item | Value |
|---|---|
| `partner_id` | `kanzoo` |
| `partner_secret` | sent separately over email |
| Embed host | `https://tutor.evelynlearning.com/embed` |
| API host | `https://www.evelynlearning.com` |

The secret is used for HS256 (embed tokens) and HMAC-SHA256 (API calls). Keep it on your server. To rotate it, message us; we add the new secret alongside the old one so there is no cutover window, then retire the old one.

## 4. Embedding the tutor

```html
<iframe
  src="https://tutor.evelynlearning.com/embed?token=<SIGNED_TOKEN>"
  allow="microphone; camera; autoplay; clipboard-write"
  allowfullscreen
  style="width:100%; height:100vh; border:0">
</iframe>
```

- `allow="microphone"` is required for voice. The student's browser will ask for mic permission inside the frame.
- The frame is responsive; give it as much height as you can (full viewport recommended, minimum ~640px).
- Works in current Chrome, Edge, Safari and Firefox on desktop; Chrome/Safari on mobile. For your Flutter app, load the same URL in a WebView with microphone permission granted.
- A ready-to-run host page is in `examples/embed.html`.

## 5. The embed token

A JWT, `alg: HS256`, signed with your partner secret. The payload IS the session configuration.

| Claim | Req | Type | Notes |
|---|---|---|---|
| `partner_id` | ✓ | string | `kanzoo` |
| `student_id` | ✓ | string | Your stable internal id. All engine data for this student is keyed on it. |
| `subject` | ✓ | string | `math`, `science`, `ela`, `social-studies` (also `cs`, `languages`). |
| `level` | ✓ | string | Grade label, e.g. `"Grade 6"`. |
| `student_name` | | string | First name; the tutor uses it in conversation. |
| `teacher` | ✓* | object | The tutor's persona and **voice**. Copy an entry from `examples/teachers.json` verbatim (see §5.1). *Without it the engine falls back to a generic synthetic voice, so always send one. |
| `target_kind` | | enum | `lessonNode` when `curriculum_module` is set, otherwise `freestyle`. |
| `topic` | | string | Free text, e.g. `"Ratios and unit rates"`. If no `curriculum_module`, the tutor builds a just-in-time lesson on this topic. |
| `curriculum_module` | | string | A lesson plan id: one returned by `POST /plan-generate` (your material) or one of ours. Locks the session to that plan. |
| `session_goal` | | enum | `homework-help`, `practice`, `concept-review` (default), `test-prep`, `catch-up`, `challenge`, `general`. |
| `input_mode` | | enum | `voice` (default) or `text`. |
| `max_duration_minutes` | | number | Hard cap, 1–120, default 30. The session ends gracefully at the cap and `session_ended` carries `ended_reason: "time_limit"`. |
| `session_id` | | string | Supply your own session id and the engine uses it everywhere (events, `/sessions/summary`). Otherwise the engine mints one. |
| `resume` | | boolean | With the same `session_id`, continue a session (position, transcript, board restored) instead of starting over. Checkpoints are kept 30 days. |
| `progress_digest` | | object | `{unitsCompleted, unitsTotal, percentComplete, weeksElapsed?, paceNote?}` — lets the tutor open with a progress line. |
| `social_memory` | | array | Light personal threads (`{id, note, kind?, capturedAt}`) the tutor may reference. Read for this session only, never stored by the engine. |
| `exp` | | number | Unix seconds. Recommended: 2 hours. The engine allows a 4-hour grace after `exp` so a long session never dies mid-lesson. |
| `iat` | | number | Unix seconds. |

Minting (Node, no dependencies — full file in `examples/sign-embed-token.js`, Python in `examples/sign-embed-token.py`):

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

Any standard JWT library works too (`jsonwebtoken`, PyJWT, firebase/php-jwt) as long as the algorithm is HS256 and the claims above are top-level.

**Do not** mint tokens in the browser, reuse one token across students, or set `exp` longer than a day.

### 5.1 Choosing the tutor's persona and voice

`examples/teachers.json` holds 18 ready-made teacher personas. Each entry carries a name, a short intro, a teaching style (pace, humour, catchphrases, formality) and a natural voice id. Put the whole object in the token as `teacher`; the tutor introduces itself by that name, teaches in that style and speaks with that voice. You may edit `name`, `intro` and `style` to fit DUC Academy (for example, rename a persona to one of your teachers); keep `voice` as-is so it maps to a real voice.

Suggested defaults: `ms-elena-vasquez` (warm, US, elementary), `ms-priya-nair` (Indian English), `mr-dev-khanna` ("Mr. Sameer"), `mr-jake-sullivan` (US, middle school). Pick one per course or per teacher in DUC and send it on every token for that course. A student should hear the same voice every session.

## 6. Browser events (iframe → your page)

All messages are `window.parent.postMessage({ type, data }, '*')`. Check `event.origin === 'https://tutor.evelynlearning.com'` before trusting them.

| `type` | `data` |
|---|---|
| `evelyn:session_started` | `{ session_id, started_at_ms? }` |
| `evelyn:progress` | `{ session_id, lesson_progress, practice? }` — fired on every lesson-segment change. `lesson_progress = { lessonPlanId, segments[], currentSegmentId, completedSegmentIds[], currentSegmentLabel?, percent? }` |
| `evelyn:session_ended` | `{ session_id, duration, message_count, whiteboard_items, milestone, lesson_progress?, ended_reason?, end_intent?, opener_record?, ... }` — `duration` is wall-clock seconds; `milestone` ∈ `none`, `first_concept_complete`, `first_try_yourself_success`, `recap_reached`; `ended_reason: "time_limit"` only when the cap ended it; `end_intent` ∈ `finish` / `discard` when the student chose. |
| `evelyn:expand` / `evelyn:collapse` | Layout hints; optional. |

`session_ended` is a signal, not the record. Pull the authoritative facts with the API (§8).

## 7. API authentication (server → server)

Every request carries three headers:

```
x-evelyn-partner:    kanzoo
x-evelyn-timestamp:  <unix epoch milliseconds, as a string>
x-evelyn-signature:  <hex HMAC-SHA256>
```

Canonical string and signature:

```
signing_string = `${timestamp}.${METHOD}.${path_with_query}.${raw_body}`
signature      = hex( HMAC_SHA256( partner_secret, signing_string ) )
```

- `METHOD` upper-case. `path_with_query` is everything after the host, e.g. `/api/portal/v1/gaps?studentId=stu_123`. `raw_body` is the exact JSON string you send, or `""` for GET.
- The timestamp must be within ±5 minutes of server time (UTC).
- Send JSON with `content-type: application/json`.

Reference client: `examples/portal-api-client.js` (Node 18+, zero dependencies).

**Error responses**

| HTTP | `error` / `reason` | Meaning |
|---|---|---|
| 401 | `missing_auth_headers`, `unknown_partner`, `bad_signature`, `stale_timestamp`, `bad_timestamp` | Fix the signing. `stale_timestamp` = clock skew > 5 min. |
| 403 | `partner_suspended`, `endpoint_not_allowed` | Contact us. |
| 429 | `rate_limited` | Default 600 requests/min, burst 60. Honour `retryAfterSec`. |
| 402 | `quota_exceeded` | Daily request quota (not set for the sandbox). |
| 400 | validation error | Body is echoed with the failing field. |

## 8. API endpoints

Base: `https://www.evelynlearning.com/api/portal/v1`. All partner-scoped: you only ever see your own students and sessions.

### 8.1 Session facts and learning state (pull after `session_ended`)

| Method · path | Request | Response |
|---|---|---|
| `GET /sessions/summary?ids=a,b,c` | up to 50 session ids | `{ sessions: [{ sessionId, status: active\|completed\|abandoned, startedAt, endedAt?, durationSec?, studentTurns, tutorTurns, boardItems, estimatedCostUsd, location? }] }` — **`durationSec` is active tutoring seconds** (gaps between turns, each capped at 10 min). This is the number we bill on. `estimatedCostUsd` is an internal engine estimate and is not the invoice; ignore it. |
| `GET /session-progress?sessionId=` | | `{ lessonProgress \| null, resumable, updatedAt }` |
| `GET /gaps?studentId=` | | `[{ id, kind: lo\|prerequisite, loId?, conceptLabel?, status: candidate\|confirmed\|resolved\|open, confidence?, evidence?: { signals[], observation, studentQuotes[] }, firstSeenAt, lastSeenAt }]` |
| `GET /mastery?studentId=` | | `{ [loId]: { loId, score, exposures, lastTouchedAt, confidence? } }` |
| `GET or POST /learner-state` | `{ studentId, loIds?, courseTopic? }` | `{ los: [{ loId, estimate 0–1\|null, confidence, trend up\|flat\|down, nEff, reviewDueAt?, lastEvidenceAt? }], gaps[], projection?, reviewDueCount }` |
| `GET /assigned-practice?studentId=&courseId?` | | `{ assignments: [{ assignmentId, sessionId, assignedAt, locator?, los: [{ loId, title?, reason, items[], status: { attempted, correct, total } }] }] }` — homework the tutor set at the end of a session, with answer keys so you can grade locally. |

### 8.2 Context in (optional, before a session)

`POST /context` with a `StudentContext`:

```json
{
  "studentId": "stu_123",
  "isTrial": false,
  "courseId": "duc-grade6-math",
  "profile": { "name": "Ayaan", "grade": "Grade 6", "locale": "en-IN", "curriculum": "DUC Academy" },
  "preferences": { "humorCeiling": "light", "pacing": "default", "modality": "mixed", "tone": "warm", "socialMemoryLevel": "off" },
  "target": { "kind": "freestyle", "freestyleMaterial": "Ratios and unit rates — Assignment 3" },
  "sessionConfig": { "voiceEngine": "claude-brain" },
  "progressDigest": { "unitsCompleted": 3, "unitsTotal": 12, "percentComplete": 25 }
}
```

`preferences` is what this call stores: pace, humour ceiling, tone, modality and interests per student (the "customisation parameters" discussed on the call). They apply to every later session for that `studentId`. The other fields are validated and echoed back but not stored; per-session context such as `progress_digest` and `social_memory` travels in the embed token (§5). `target.kind` may also be `lessonNode` (`lessonNodeId`) or `diagnostic` (`loIds[]`). `voiceEngine` should always be `claude-brain`.

### 8.3 Your own lessons and assignments

| Method · path | Request | Response |
|---|---|---|
| `POST /plan-generate` | `{ text (3–8000 chars), subject, grade, topic?, sessionMinutes? (5–120), materials?: [{ kind: pdf\|docx\|image\|text, data: base64, name?, mimeType? }] (≤4, ≤8 MB each), studentId? }` | `{ planId, title, mode: full\|picker, los: [{ id, description }], maxPickableLos, estimatedMinutes, generatorOk, cached }` |
| `POST /plan-expand` | `{ planId, pickedLoIds (1–12) }` — only when `mode: picker` | `{ planId, estimatedMinutes, expandedCount, pendingExpansion }` |
| `POST /review-plan` | `{ studentId, los: [{ loId, title }] (1–8), sessionMinutes? }` | `{ planId, title, los, estimatedMinutes }` — a remediation plan from a student's weak objectives |

Put the returned `planId` in the embed token as `curriculum_module` and the tutor teaches that plan. Pass `studentId` to plan-generate and the plan adapts to that student's known gaps.

**Assignment flow (recommended):** teacher publishes an assignment in DUC → your backend calls `plan-generate` once with the assignment text or PDF → store `planId` on the assignment → every student's token for that assignment carries `curriculum_module: planId` and `session_goal: "homework-help"`. The tutor guides Socratically; it does not hand out answers.

### 8.4 Practice items and grading

| Method · path | Request | Response |
|---|---|---|
| `POST /practice` | `{ studentId, courseId, scope: { loId } \| { topicId }, difficulty? 1–4, count, excludeIds? }` | `{ items: [{ id, source, problemText, expectedAnswer?, hints?, responseFormat?, choices?, difficulty?, loId? }] }` |
| `POST /grade` | `{ studentId, itemId, response: { text } \| { imageRef } }` | `{ totalPoints, maxPoints, parts[], modelResponse }` |
| `POST /assessment`, `POST /assessment/submit` | build and score a short quiz per objective | ask us for the schema when you get here |

### 8.5 Other

| Method · path | Purpose |
|---|---|
| `POST /session-result` | Push your own session record/evidence into the learner model (`SessionEmitRequest`). Normally not needed; the engine records embed sessions itself. |
| `GET /notes`, `GET /notes/unit` | Rendered study notes per topic/unit (used by Crimsora's Notes tab). |
| `POST /taxonomy-generate` | Turn a course outline into a draft learning-objective graph. |
| `GET/POST /mock/*` | Mock-exam forms, attempts, reports and tutor-led review. Test-prep only. |
| `POST /student-erase` | `{ studentId }` → deletes everything the engine holds for that student. Use for parent deletion requests. |

## 9. Sandbox

- Same hosts, same engine, same endpoints as production. Nothing to switch later except your own environment flag.
- **300 free minutes** of tutoring for integration testing (measured as `durationSec` across your sessions). We'll tell you when you approach it; ask if you need more.
- Rate limits: 600 requests/min, burst 60.
- Use obvious test student ids (`sandbox-…`) so you can erase them with `/student-erase` before go-live.
- A sample signed token for a Grade 6 ratios lesson is included with your credentials so you can open a session before writing any code.

## 10. Not yet available (planned)

- **Outbound webhooks.** Today the end-of-session signal is the iframe `postMessage`; server-side facts are pulled via the API. Webhooks (`session.ended`, `usage.summary`) are on the roadmap.
- **Partner dashboard** with self-service metering, invoices and secret rotation. Until then: usage on request, rotation by messaging us.
- **Branding parameters** (logo, colours) in the token. The embed is already unbranded (no Evelyn name in the student UI); custom colours/logo on request.
- **Non-English voices.** English is production-proven, including Indian-English personas (§5.1). Hindi-language tutoring can be enabled per partner; validate in the sandbox before committing.
- Older pages under `tutor.evelynlearning.com/docs` describe a REST API with `X-API-Key` and 34 endpoints. Those pages are being replaced. **This document is the contract.**

## 11. Go-live checklist

1. Backend mints tokens (§5) — never the browser.
2. Host page verifies `event.origin` and forwards `session_ended` to your backend (§6).
3. Backend pulls `sessions/summary` + `gaps` + `mastery` after each session and stores them (§8.1).
4. Assignment → `plan-generate` → `curriculum_module` (§8.3).
5. Test students erased with `/student-erase`.
6. Tell us your production launch date; we confirm limits and billing setup.
