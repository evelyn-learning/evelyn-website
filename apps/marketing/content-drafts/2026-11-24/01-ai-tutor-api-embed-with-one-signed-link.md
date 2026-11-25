---
title: AI Tutor API: How to Embed a Voice Tutor with One Signed Link
slug: ai-tutor-api-how-to-embed-a-voice-tutor-with-one-signed-link
category: AI in Education
tags: AI Tutor API, Voice Tutor, Embed AI Tutor, White-Label AI Tutor, EdTech Integration, Developer Guide, AI Tutoring, WebView, Webhooks
metaTitle: AI Tutor API: Embed a Voice Tutor with One Signed Link
metaDescription: How to add a hosted AI voice tutor with a live whiteboard to your product: sign one link on your server, open it in an iframe or WebView, test free in a sandbox.
excerpt: A hosted AI tutor with voice, a live whiteboard and typed chat can be added to a web or mobile product with one signed link. This guide shows the whole integration: the token, the iframe, the Android WebView settings, worksheet photos, languages and webhooks.
quickAnswer: An AI tutor API lets you put a ready-made tutor inside your own product. With Evelyn Learning's Voice Tutor API your server signs a short-lived token with your partner secret, and your app opens one link in an iframe or a mobile WebView. The tutor is hosted, white-label, and comes with a free sandbox of 300 tutoring minutes.
ctaProduct: voice-tutor
---

If you run a learning product, you have probably been asked for an AI tutor. The usual assumption is that this means a long project: speech, a tutoring brain, a whiteboard, session storage, billing.

It does not have to. A hosted tutor can be embedded the same way you embed a video player. Your server signs a link, and your app opens it.

This guide walks through that integration with Evelyn Learning's Voice Tutor API. Every code sample comes from the published packages and the [integration guide](https://tutor.evelynlearning.com/docs/integration.md), so you can copy it as it stands.

---

## What Is an AI Tutor API?

An AI tutor API gives your product a working tutor without your team building one. You decide who the student is and what the lesson is about. The service runs the lesson.

The Voice Tutor API is a hosted AI tutor with three parts the student sees:

- **Voice.** The tutor speaks and listens.
- **A live whiteboard.** Working, diagrams and questions appear as the tutor teaches.
- **Typed chat.** The student can type in a voice session, or the whole session can be typed.

It is white-label, so it sits inside your product under your brand. You can try what the student sees in the [live demo on the AI Voice Tutor page](/products/voice-tutor).

## How Does the Signed Link Work?

There is one idea to understand. Your server creates a short-lived token that describes the session, signs it with your partner secret (HS256), and puts it in a URL. Your app opens that URL. Nothing else is needed to start a lesson.

The secret stays on your server. It never goes into browser code or a mobile app.

With the npm package, signing is a few lines:

```sh
npm install @evelynlearning/tutor
npx @evelynlearning/tutor init
```

```js
import { EvelynTutor } from '@evelynlearning/tutor';

const tutor = new EvelynTutor(); // reads EVELYN_PARTNER_ID and EVELYN_PARTNER_SECRET
const url = tutor.sessionUrl({
  student_id: 'stu_abc123', subject: 'math', level: 'Grade 8',
  topic: 'Solving linear equations', target_kind: 'freestyle',
});
```

The same thing in Python:

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

`student_id` is your own id for the student. `topic` is free text, and the tutor builds the lesson on it. Sign one URL per student per session.

You do not need a package at all. The token is a standard JWT, so any JWT library works as long as the algorithm is HS256. The packages save you the typing.

## How Do You Embed the Tutor in a Web Page?

Put the URL your server returned into an iframe:

```html
<iframe
  src="SESSION_URL"
  allow="microphone; camera; autoplay; clipboard-write"
  allowfullscreen
  style="width:100%; height:100vh; border:0">
</iframe>
```

The `allow` attribute matters. Without `microphone` the student cannot talk to the tutor.

The student taps Start once and the lesson begins.

If your students work inside a learning management system, our guide to [embedding an AI tutor in an existing LMS](/blog/can-i-embed-an-ai-tutor-in-my-existing-lms-a-plain-english-guide-for-edtech-decision-makers) covers the options at that level.

## How Do You Embed the Tutor in a Mobile App?

In an Android WebView, load the same URL directly. No iframe is needed. A WebView does not grant the microphone on its own, so there are three things to set up.

First, declare `android.permission.RECORD_AUDIO`, `android.permission.MODIFY_AUDIO_SETTINGS` and `android.permission.INTERNET` in the manifest, and ask the user for `RECORD_AUDIO` at run time before opening the lesson.

Second, grant the page's request in your `WebChromeClient`:

```kotlin
override fun onPermissionRequest(request: PermissionRequest) {
    if (request.origin.host == "tutor.evelynlearning.com") request.grant(request.resources)
    else request.deny()
}
```

Third, turn on the settings the session needs:

```kotlin
webView.settings.javaScriptEnabled = true
webView.settings.domStorageEnabled = true
webView.settings.mediaPlaybackRequiresUserGesture = false
```

Use the current Android System WebView and load the page over HTTPS.

## Can the Tutor Teach from a Student's Own Worksheet?

Yes. The student photographs a worksheet in your app. Your server sends the photo, and the service reads it into numbered questions. The student picks one and is tutored through it, one question at a time, without being handed the answer.

```js
// 1. Read the sheet. Up to 4 images, each up to 8 MB (JPEG, PNG, WebP or GIF).
const sheet = await tutor.worksheet.read({
  images: [{ data: photoBuffer }],   // bytes, a base64 string, or a file path
  subject: 'math',
  grade: 'Grade 8',
  studentId: 'stu_abc123',
});
// sheet.planId, sheet.problems → [{ n: 1, text: '…' }, …]. Show the list to the student.

// 2. Prepare the question the student picked.
const question = await tutor.worksheet.prepare(sheet.planId, 3);

// 3. Open the session on it.
const url = tutor.worksheet.sessionUrl(question.planId, {
  student_id: 'stu_abc123', subject: 'math', level: 'Grade 8',
});
```

This covers the homework case: the student's own sheet, not a generic lesson.

## Which Languages Can a Lesson Be Taught In?

A lesson can be taught entirely in English, Hindi, Hinglish, Spanish, French, Japanese, Traditional Chinese or Simplified Chinese. You choose the language with one claim:

```js
tutor.sessionUrl({
  student_id: 'stu_abc123', student_name: '小安', subject: 'math', level: 'Grade 8',
  topic: '聯立方程式：加減消去法', target_kind: 'freestyle', tutor_languages: ['zh-TW'],
});
```

Leave `tutor_languages` out for English.

You can also let the student change language in the middle of a lesson by asking the tutor. That is one more claim:

```js
tutor.sessionUrl({ student_id: 'stu_abc123', subject: 'math', level: 'Grade 8', topic: 'Fractions', target_kind: 'freestyle',
  switch_languages: ['hi', 'hi-Latn'] });   // or 'all' (or true) for every language offered
```

## What Does Your Server See After a Lesson?

Two things: webhooks and the partner dashboard.

Set a webhook URL on the dashboard and the service posts signed events to your server. There are three: `session.ended`, `pool.low` and `pool.exhausted`. The first tells you a lesson finished. The other two tell you when your tutoring minutes are running low or have run out.

Verify each event against the raw body before parsing it. In a Next.js route:

```ts
// app/hooks/evelyn/route.ts
import { verifyWebhook, EvelynWebhookError } from '@evelynlearning/tutor';

export async function POST(request: Request) {
  const rawBody = await request.text();
  try {
    const event = verifyWebhook({ rawBody, headers: request.headers, secret: process.env.EVELYN_PARTNER_SECRET! });
    if (event.type === 'session.ended') await saveSession(event.id, event.data);
  } catch (err) {
    if (err instanceof EvelynWebhookError) return Response.json({ error: err.reason }, { status: 400 });
    throw err;
  }
  return Response.json({ received: true });
}
```

The partner dashboard covers the rest: usage, API keys and key rotation, a no-code test lesson, sessions with replays, students, an API log, webhooks and billing.

## How Do You Try It Before Paying?

Sign up for the [free sandbox](https://tutor.evelynlearning.com/sandbox). You get 300 tutoring minutes. Your keys are shown as soon as you confirm your email, and no card is needed.

Sandbox sessions end at 15 minutes. After a first purchase the limit is 60 minutes.

After the sandbox, the price is $0.20 per voice minute and $0.16 per typed minute, with prepaid packs. We work the numbers through for different school sizes in [AI Voice Tutor API Pricing: Per-Minute Cost Worked Through for 100, 1,000 and 10,000 Students](/blog/ai-voice-tutor-api-pricing-per-minute-cost-worked-through-for-100-1000-and-10000-students). The current figures are always on the [pricing page](https://tutor.evelynlearning.com/pricing).

## Can a Coding Assistant Do the Integration?

Yes, and the service is set up for it. The whole integration is written as [one Markdown file](https://tutor.evelynlearning.com/docs/integration.md) that an assistant can read in one go.

The npm package also includes an MCP server. A client that takes the JSON form is configured like this:

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

With that in place the assistant can read the guide, write the example files, create a test session and check the setup. Signing up for keys still needs a person.

---

## Frequently Asked Questions

### Do I need an SDK to use the AI tutor API?

No. The session token is a standard HS256 JWT and the tutor is a URL, so any language with a JWT library can do it. The `@evelynlearning/tutor` (npm) and `evelyn-tutor` (PyPI) packages are optional and do the signing for you.

### Is the tutor white-label?

Yes. The tutor runs inside your product under your brand, in an iframe or a mobile WebView.

### Where does the partner secret go?

On your server only. It signs both session links and API calls, so it must never be in browser code, a mobile app or a commit.

### Does it work inside an LMS?

The tutor is an iframe, so it can go anywhere your product can show one. For the wider picture, see [how to embed an AI tutor in an existing LMS](/blog/can-i-embed-an-ai-tutor-in-my-existing-lms-a-plain-english-guide-for-edtech-decision-makers) and our [integrations page](/integrations).

### Should we build our own tutor instead?

Sometimes. We set out what building involves, part by part, in [Build vs Buy: What a Voice Tutor with a Whiteboard Takes to Build](/blog/build-vs-buy-what-a-voice-tutor-with-a-whiteboard-takes-to-build).

---

## Where to Start

Read the [API docs](https://tutor.evelynlearning.com/docs), get keys from the [free sandbox](https://tutor.evelynlearning.com/sandbox), and run one lesson on a topic your students actually study. A first working embed is a signed link and an iframe.
