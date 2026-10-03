# Voice Tutor × GameClass — Integration spec v1.1 ("in-flow" Ask the Tutor)

Supplements the Integration Guide v1.0. Everything here is additive: tokens and host pages that
work today keep working unchanged. Dates: spec 2026-10-02; the engine side ships in two drops
(see §6) and we will tell you when each is live.

## 1. What changes for the student

1. The tutor speaks within about a second of "Ask Tutor", with no second tap.
2. It picks up from the clip ("So Aaron has two offers on the table…") instead of introducing
   itself and asking for a quiet room.
3. It knows what is in the clip, and the question the student just got wrong, from fields you send.
4. The session title shows your short lesson title.
5. When the student is done, the tutor hands them back to the lesson instead of "wrapping up for today".

## 2. New token fields (all optional)

| Claim | Type | Limit | Used for |
|---|---|---|---|
| `title` | string | 80 chars | The session title shown in the tutor header. |
| `topic` | string | 200 chars | The subject in a few words, e.g. `"Equity vs debt (Scrub Daddy)"`. Keep it short now that `title`/`description`/`context` exist. |
| `description` | string | 1,000 chars | The lesson description (what the lesson teaches, the goal). |
| `context.summary` | string | 1,500 chars | What happens in the clip, 2–4 sentences. The tutor treats this as the facts of the scene. |
| `context.characters` | string[] | 10 × 80 chars | Who is in the scene, e.g. `["Aaron Krause (founder)", "Lori Greiner", "Kevin O'Leary"]`. |
| `context.transcript` | string | 6,000 chars | Clip transcript or the relevant excerpt. Best signal if you have it. |
| `context.playhead_seconds` | number | | Where the student was in the video when they clicked. |
| `question` | string | 2,000 chars | The question the student was on (wrong-answer case). |
| `student_answer` | string | 500 chars | What the student answered. |
| `correct_answer` | string | 500 chars | The correct answer (never spoken outright; the tutor guides to it). |
| `entry` | enum | | `"in-flow"` for Ask the Tutor. Switches on the behaviour in §1 (no intro ritual, clip-first opener, hand-back close). Omit for a normal standalone session. |

Rules:
- Do not put teacher notes, rating markers or audience selection text in any field.
- Anything over a limit is cut at the limit, not rejected.
- `teacher` (persona), `session_goal: "homework-help"`, `max_duration_minutes`, `student_name`
  and the rest of v1.0 are unchanged. Keep sending them.
- Recipe B (`curriculum_module` from `POST /plan-generate` per lesson) still gives the best
  results for lesson coverage; `context` is about the clip, the plan is about the lesson.

Example (Scrub Daddy, wrong-answer case):

```json
{
  "partner_id": "gameclass",
  "student_id": "u_8f1c",
  "student_name": "Maya",
  "subject": "social-studies",
  "level": "Grade 11",
  "entry": "in-flow",
  "session_goal": "homework-help",
  "max_duration_minutes": 12,
  "input_mode": "voice",
  "title": "Own a Piece or Lend the Money?",
  "topic": "Equity vs debt (Scrub Daddy)",
  "description": "Aaron weighs real equity and royalty offers for Scrub Daddy. Compare those rights with a hypothetical fixed-coupon bond, calculate its payments, and explain the ownership-versus-debt trade-off.",
  "context": {
    "summary": "Aaron Krause pitches Scrub Daddy asking $100,000 for 10%. Kevin O'Leary offers $100,000 as a loan with a royalty per unit. Lori Greiner offers $200,000 for 20% equity. Aaron takes Lori's deal.",
    "characters": ["Aaron Krause (founder)", "Lori Greiner", "Kevin O'Leary"],
    "transcript": "…",
    "playhead_seconds": 212
  },
  "question": "Which offer gives the investor a permanent share of future profits?",
  "student_answer": "Kevin's royalty deal",
  "correct_answer": "Lori's equity deal",
  "teacher": { "...": "persona object from teachers.json or gameclass-persona.json" },
  "iat": 1790968000,
  "exp": 1790975200
}
```

(The figures above are illustrative; send what the clip actually says.)

## 3. Host page: pre-load and one-click start

Today the frame is created on the click, so every second of setup happens after it. New flow:

1. **When the lesson page opens**, create the frame hidden with `prewarm=1`:

```html
<iframe id="tutor" src="https://tutor.evelynlearning.com/embed?token=<SIGNED_TOKEN>&prewarm=1"
        allow="microphone; autoplay; clipboard-write" style="display:none; width:100%; height:100%; border:0"></iframe>
```

   In prewarm the tutor connects speech and model services and loads the lesson, but does **not**
   ask for the microphone, does not speak, and does not start a billable session. Nothing is
   charged until the student starts. If the student never clicks, nothing happens.

2. The frame posts `{ type: "evelyn:ready" }` when it is warm (usually 2–4 s). You may enable the
   button on it or ignore it; a click before `ready` still works, it just waits for the setup.

3. **On "Ask Tutor"**: show the frame and post the start message:

```js
const frame = document.getElementById('tutor');
frame.style.display = 'block';
frame.contentWindow.postMessage({ type: 'evelyn:start' }, 'https://tutor.evelynlearning.com');
```

   The tutor asks for the microphone (first time only), speaks its first line within about a
   second, and the session is billed from this moment.

4. If the browser refuses to play audio without a tap inside the frame (some Safari versions),
   the frame posts `{ type: "evelyn:start_blocked" }` and shows a single "Tap to hear your tutor"
   button itself. Nothing for you to handle; it is the fallback, not the normal path.

5. The token's `exp` still applies. A page left open longer than the token lifetime shows a
   "please reload" state on start; mint tokens for 2 hours as before. A frame left idle in prewarm
   for more than 30 minutes drops its connections and reconnects on start (adds ~2 s once).

6. Closing the panel: set `src` to `about:blank` as before (releases the mic). To end the
   session cleanly instead, post `{ type: "evelyn:host_end", reason: "finished" }` first and
   wait for `evelyn:session_ended`.

Message summary (iframe → host, all additive): `evelyn:ready`, `evelyn:start_blocked`, plus the
existing `session_started`, `progress`, `session_ended`, `expand`, `collapse`.
Host → iframe: `evelyn:start` (new), `evelyn:host_end` (existing). The frame accepts these only
from its parent window on your registered origin.

## 4. Personas

`teacher` is per token, so per lesson, per grade, or per student is entirely your choice. The
catalogue is `examples/teachers.json` (18 personas, each with voice) plus `gameclass-persona.json`
("Coach"). We can add named personas on request. A student should hear the same voice within a
lesson; across lessons you can vary it. Letting students choose is a few lines on your side once
you have the catalogue in your UI.

## 5. Session title

With `title` present it is shown as is. Without it, the engine shows the first 80 characters of
`topic`.

## 6. Delivery

- **Drop 1 (engine only, no host change needed):** instant first line, warmer voice start,
  `title`/`description`/`context`/question fields, `entry: "in-flow"` opener and close.
- **Drop 2 (needs §3 on your side):** `prewarm=1`, `evelyn:ready`, `evelyn:start`,
  `evelyn:start_blocked`.

You can send the §2 fields before Drop 1 is live; unknown fields are ignored until then.
