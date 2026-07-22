# Tutor latency baseline (Phase 0 — humanlike-latency plan)

Status: **instrumentation shipped, awaiting live capture** (2026-07-21).
Every later phase's success criterion references the medians in this file.

## How to capture (exact steps — ~15 min per session, 3+ sessions)

Run on the **dev stack with real Cartesia + real brain** (not silent/mock):

1. `cd ~/Dev/evelynlearning && npm run dev` (engine on :3006).
2. Open `http://localhost:3006/tutor` in Chrome. Pick a course/lesson and start a **voice** session (mic on — typed turns don't measure the Ink-2 segments).
3. Have a normal 8–12 turn lesson exchange. Mix it up on purpose:
   - several ordinary answers (the median material),
   - one long rambling answer with a mid-sentence pause (~1s) — exercises `turn.resume`,
   - one barge-in (start talking while the tutor is speaking),
   - one quick short answer ("yes", "three").
4. Session mix across the 3+ sessions: at least one **math** lesson (e.g. AP Calc / long division) and one **history/humanities** (e.g. APUSH). One session can be a **mock-review** agenda session if convenient.
5. End the session normally. No manual export needed — every turn's numbers land as `turn_latency` debug events in the session record (Mongo `TutorSession.debugEvents`).

What a good event looks like (per turn):
`eager→end=420ms end→fetch=3ms brain_first=1510ms tts→audio=640ms TOTAL=2570ms complete=true`

Notes:
- `complete=false` is expected on killed/barged-in turns and typed turns — those are excluded from medians.
- If you want to eyeball live: the same lines print in the browser console; the dev-terminal log bridge surfaces `[PERCEPTION]` lines alongside.

## How I'll extract medians (after your sessions)

Pull `turn_latency` events for the session ids (or timestamp range) from Mongo,
filter `complete=true`, compute per-segment medians + p90, and fill the table
below.

## Baseline numbers (TO FILL from live sessions)

| Segment | Median | p90 | n |
|---|---|---|---|
| eager→end (Ink-2 semantic confirm) | | | |
| end→fetch (client classify/dispatch) | | | |
| brain_first (fetch → first sentence SSE) | | | |
| tts→audio (first TTS fetch → first audio) | | | |
| **TOTAL (turn.end → first audio)** | | | |

Sessions used: (ids/dates here)

## Phase decisions gated on this table

- Task 1.3 (Ink threshold tuning): only if median `eager→end` ≥ 300ms.
- Phase 5 (eager dispatch): only if median `eager→end` ≥ ~500ms.
- Task 1.1 / Phase 2 success: measured as deltas against TOTAL here.
