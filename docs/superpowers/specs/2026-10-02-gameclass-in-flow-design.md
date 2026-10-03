# GameClass "in-flow" Ask the Tutor — engine design

Date: 2026-10-02 · Branch `gameclass-inflow` (worktree, from origin/main `6cd65564`) · Status: awaiting review
Partner-facing contract: `docs/whitelabel/gameclass/spec-v1.1-in-flow.md` (v1.1). This document is the engine side of it.

## Purpose

A GameClass student is watching a video and clicks "Ask Tutor". Today (session embed-1790968366417):
8 s from frame load to first word, a second tap, an 82-word opener with a self-introduction and the
"quiet spot" tip, deal facts invented because none were supplied, the whole lesson description shown
as the title, and a "clean stop for today" close. The partner has agreed to the v1.1 contract (fields,
pre-load, one-click start). Build the engine side in two drops.

Success, measured on a GameClass session after Drop 2: first spoken words ≤ 1.5 s after the host's
`evelyn:start`; no second tap in Chrome/Edge/Firefox; opener ≤ 2 sentences and references the clip;
no `first_session_tip_attached`; the header shows `title`; the brain's facts about the clip come from
`context`; the close hands back to the lesson. Nothing changes for Crimsora, evelyntutor, GAC or the
demo unless their tokens opt in.

## Non-goals

Character voices; messaging or replays; anything in the academy repo; changes to the partner
API; per-lesson plan generation changes (Recipe B already exists); any file under
`apps/tutor/src/lib/tutor/portal/` other than one NEW file (`host-start.ts`), because another session
is working there (practice/grade resolvers); no edits to `host-end.ts`.

## Drop 1 — engine only

### D1.1 Token fields → config → prompt

`parseEmbedConfig` (`lib/tutor/portal/parse-embed-config.ts`) gains optional fields, each clamped
(cut, not rejected) at the v1.1 limits: `title` 80, `topic` 200 (new clamp), `description` 1000,
`context.summary` 1500, `context.characters` ≤10 × 80, `context.transcript` 6000,
`context.playhead_seconds` finite ≥ 0, `question` 2000, `student_answer` 500, `correct_answer` 500,
`entry` ∈ {`in-flow`} else undefined. Unknown shapes → field dropped, never a 400.

The embed page passes them to `VoiceTutorRealtime` as one `lessonContext` prop (plus `entry` and
`title`). VTR adds them to `SystemPromptContext` and `buildSystemPromptParts` renders, in the
**session** block (after the shared core, so the cache split is untouched), after "Current Session
Context":

```
## Lesson context (supplied by the host — the only source of facts about the scene)
Lesson: <title>
Description: <description>
Clip: <context.summary>
People: <characters joined by ", ">
Student was at <m:ss> of the clip.
<clip_transcript>…</clip_transcript>          (only when present)
Treat the lines above as the facts of the scene. Do not add names, numbers, offers or events that
are not in them; if a detail is missing, say you do not have it rather than guessing.

## The question the student was on                (only when `question` present)
Question: <question>
Student answered: <student_answer>
Correct answer (never state it outright; guide the student to it): <correct_answer>
```

Wording is generic (no GameClass or Shark Tank specifics) per `feedback_generic_prompts`.
Golden-hash test from the shared-cache work must still pass for contexts without these fields.

### D1.2 Title

`topicDisplayName` in the embed page: `title` if present, else today's label cut to 80 chars with
an ellipsis. `SessionStage`'s tooltip/aria keep the full string; the tap-to-reveal banner uses the
same clamped title.

### D1.3 `entry: "in-flow"` behaviour (all in the opener path, no prompt-wide changes)

- First-session tip suppressed for the session (the `TUTOR_FIRST_SESSION_TIP` check gains
  `&& entry !== 'in-flow'`).
- Teacher introduction suppressed: `shouldIntroduceTeacher` returns false for in-flow (the persona
  block stays, so the voice and style still apply; the tutor simply does not say "I'm Jake").
- Opening directive for in-flow (replaces the homework-help opener clause when `entry` is set):
  greet by first name in ≤ 4 words, then ONE sentence that picks up from the clip or the question,
  then the first question to the student. Two sentences before the question, maximum. No "my
  replies take a few seconds", no "find a quiet spot", no overview of the lesson.
- Close: the close-notes / session-end prompt for in-flow says the student is returning to a lesson
  in progress: one sentence of hand-back ("Back to the video — you've got this") instead of "a nice
  clean stop for today"; no homework pointer; no "next time". The homework-draft path is skipped
  for in-flow sessions (nothing to assign in the host).
- Idle nudge stays (unchanged).

### D1.4 Instant first line (all surfaces, flag `NEXT_PUBLIC_TUTOR_BRIDGE_LINE`, default ON)

At the start tap (or host start), before the first brain call, the client speaks ONE templated
bridge line through the normal TTS path: `"Hey {first name}."` when a name exists, else `"Hey."`,
followed by, for in-flow with a title, `"{title} — let's look at it."`; for other sessions,
`"Let's get started."` (≤ 8 words total, from a fixed table, no model). The opening directive then
tells the brain the greeting was already spoken, so it must not greet again and starts with its
first content sentence. Caption/transcript shows the bridge line as a tutor line.

Guards: not on resume; not in text mode (the student reads; no dead air to cover); not when the
brain's first sentence has already arrived (race: skip rather than overlap); barge-in rules apply
as to any tutor speech.

### D1.5 Warmer voice start

`sonicWS.prewarm()` is called when the realtime hook connects (today only on the first
`speakText`). Measured effect in the GameClass session: first sentence `tts→audio` 629 ms vs ~130
ms later; the first line should land near the latter.

## Drop 2 — host-driven pre-load and start

### D2.1 `prewarm=1`

Query flag on the embed URL. In prewarm the embed page mounts VTR as today EXCEPT:
- the microphone is not acquired (the perception hook is enabled but `startMic` is deferred until
  start; the mic permission prompt therefore appears on the click, not on page load);
- the Start UI shows a quiet "Ready" state (no pulsing orb, no "tap to start" copy) and the frame
  is normally hidden by the host anyway;
- nothing is spoken, no brain call, no session document (already deferred until engaged).

The page posts `{ type: 'evelyn:ready' }` to the parent once the relay is connected and the prompt
is built. If the user never starts, a 30-minute timer tears the connections down; a later start
reconnects first (one `start_queued` path, already exists).

Pre-minted provider tokens (OpenAI client secret, Cartesia tokens) can expire during a long
prewarm: on start, if the realtime token is older than its TTL, re-mint before connecting
(`prefetchToken` again); Cartesia mints on connect already. Embed token `exp` is checked at start:
expired → the "please reload" state, posted as `evelyn:start_blocked` with `reason: 'token_expired'`.

### D2.2 `evelyn:start`

New file `lib/tutor/portal/host-start.ts`: `parseHostStart(data)` (shape check), reuse
`isAllowedHostOrigin` from `host-end.ts`, `shouldAcceptHostStart({ started, ending })`. The embed
page adds a second `message` effect (separate from the host-end one) that, on an accepted start,
calls the same code path as the start tap (`handleRef.startSession()`), which: acquires the mic,
unlocks audio, speaks the bridge line, sends the kickoff. Accepted once; later starts are ignored.

Autoplay: audio `play()` inside the frame without a frame-local gesture may be refused. Chrome,
Edge and Firefox honour the parent's gesture through `allow="autoplay"`; some Safari versions do
not. On refusal the page posts `{ type: 'evelyn:start_blocked', reason: 'autoplay' }` and shows
the existing tap-to-start button with the copy "Tap to hear your tutor"; the tap continues from
where the start got to (mic already granted, kickoff not resent).

### D2.3 Events and telemetry

New iframe→host messages: `evelyn:ready`, `evelyn:start_blocked { reason }`. New debug events,
all added to the embed persist allowlist: `prewarm_ready`, `host_start`, `host_start_ignored
{why}`, `bridge_spoken`, `start_blocked {reason}`, `prewarm_expired`. `turn_latency` on the opening
turn gains `host_start→first_audio` when a host start happened.

## Flags (server-side names use `!== 'off'`, default ON)

`NEXT_PUBLIC_TUTOR_BRIDGE_LINE`, `NEXT_PUBLIC_TUTOR_HOST_START` (covers prewarm + start message),
`NEXT_PUBLIC_TUTOR_INFLOW_ENTRY` (the `entry` behaviours). Build-time; a kill switch must be in the
env at build time to take effect.

## Data flow summary

token (`title`, `description`, `context`, `question`…, `entry`) → `parseEmbedConfig` (clamp) →
embed page props → VTR `SystemPromptContext` → session block of the prompt; `entry` → opener
directive + tip/intro suppression + close copy; `prewarm` query + `evelyn:start` → embed page →
`handleRef.startSession()` → bridge line → kickoff.

## Error handling

- Malformed or oversized fields: clamp or drop, never fail the session.
- Host start from an unexpected origin or before the page is ready: ignored, `host_start_ignored`.
- Autoplay refused: fallback tap, `start_blocked`.
- Prewarm connections dropped (network, 30-min expiry): start takes the queued-start path.
- Bridge line TTS failure: skip silently; the brain's first sentence follows as today.

## Testing

- Unit: `parseEmbedConfig` clamps and drops (every field, over-limit, wrong type, `entry` values).
- Unit: prompt block rendering for each field combination; golden hashes unchanged without them;
  the block sits in the session part (core unchanged).
- Unit: `host-start.ts` (shape, origin, once-only, ignore while ending).
- Unit: bridge-line table (name / no name / in-flow title / text mode → none / resume → none).
- Unit: opener directive for in-flow (no tip text, no intro, ≤ 2 sentences rule present).
- Source-scan guard: no `src/lib/tutor/portal/*` file other than `host-start.ts` is modified by
  this branch (`git diff --name-only origin/main` in the gate).
- Live (Praveen or me with Playwright on dev): GameClass sample token with v1.1 fields; measure
  `start→first audio`; check `first_session_tip_attached` absent; check the header title; one Safari
  run for the autoplay fallback.
- `npm run test:all` baseline 268 pass + 2 known failures.

## Open questions (decided here unless overruled)

1. Does `entry: "in-flow"` also imply `session_goal: homework-help` when the goal is missing?
   Decision: no; defaults stay. GameClass already sends homework-help.
2. Should the bridge line be on for Crimsora/evelyntutor too? Decision: yes, flag default ON, all
   surfaces; it only replaces dead air. Watch two Crimsora sessions after deploy.
3. Autoplay on Safari: not testable from this laptop's Chrome-only Playwright; needs one manual run.
