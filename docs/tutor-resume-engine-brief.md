# Voice-tutor reload/resume/continue — engine-side implementation

_Brief for the academy integration. Describes what the evelynlearning engine
does for session resume and what academy needs to do to wire it up._

The engine fully supports resuming a voice/claude-brain lesson session after a
reload, an "End/Pause", or returning later. Almost all of it lives engine-side;
academy's job is mainly to **pass a stable `session_id`** and (optionally)
surface a resume affordance.

## What the engine persists (automatically)

- On every segment change + a periodic flush + on end/unload, the engine writes
  a checkpoint to its own DB keyed by `sessionId`: `lessonProgress`
  (`lessonPlanId`, `currentSegmentId`, `completedSegmentIds[]`, `updatedAt`) plus
  the `transcript` and `whiteboardCommands`.
- Contract surface: `@evelyn/portal-contract` **v1.2.0** adds
  `LessonProgressSchema`, `LessonSegmentKind`, `RESUME_MAX_AGE_MS` (24h),
  `lessonProgress.ts` (`segmentLabel`), and appends optional `lessonProgress?`
  to `SessionResult` + `SessionEmitRequest`. **Pin the same `#vX` tag academy
  uses now** — it's a sibling repo synced into `node_modules`, not published.

## What the engine does on resume (all internal — academy doesn't implement this)

- Rebuilds a `TutorResumeState` from the checkpoint (`buildResumeState`,
  enforcing `RESUME_MAX_AGE_MS`).
- Seeds the runtime: transcript → chat UI + brain history; whiteboard → board;
  lesson position + completed segments; **the dedup catalog** (so the brain
  re-emitting restored visuals doesn't duplicate pages); **the render-id
  counter** (so post-resume renders get unique ids → correct page navigation).
  Opens on the **last** board page.
- Shows a **"Continue lesson"** overlay over the board (only while
  resumed-but-not-started). The student's click is the gesture that **unlocks
  TTS audio AND kicks the brain** to re-orient and continue — required because
  browsers won't autoplay audio without a user gesture.
- A system-prompt HARD RULE tells the brain: re-orient in one sentence, **do not
  re-render** (board is already restored), continue from the current segment,
  don't auto-advance.

## What academy needs to do

1. **Pass a stable `session_id`** into the embed config
   (`EmbedConfig.session_id`). This is the single most important thing — the same
   id must be reused across reloads/returns for the engine to find the
   checkpoint. (If omitted, the embed generates an ephemeral `embed-<timestamp>`
   id and nothing resumes.)
2. **To auto-resume**, also set `EmbedConfig.resume: true`. The embed then
   fetches the checkpoint, gates first render until it's ready, and threads
   `resumeState` into the tutor — the "Continue lesson" overlay handles the rest.
3. **(Optional) To show progress / a "Resume" entry point in academy's own UI**,
   call the authed endpoint:
   `GET /api/portal/v1/session-progress?sessionId=<id>` (signed HMAC via the
   portal contract auth) →
   `{ lessonProgress: LessonProgress | null, resumable: boolean, updatedAt }`.
   `resumable` is the engine's decision (it owns the 24h window) — use it to
   decide whether to offer "Resume" vs "Start fresh".
4. The embed also emits `evelyn:progress` postMessages (pills + %) and includes
   `lesson_progress` in `evelyn:session_ended` if academy wants to render
   progress live.

## Gotchas

- Resume targets **voice / claude-brain plan-driven** sessions only (text /
  no-plan sessions have no checkpoint).
- The full transcript + whiteboard restore on a normal reload (saved on unload +
  periodic). A hard tab-kill with no unload resumes position-only.
- The 24h `RESUME_MAX_AGE_MS` is enforced engine-side everywhere — don't
  reimplement it; trust `resumable`.
