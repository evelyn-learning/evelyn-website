# Tutor latency baseline (Phase 0 — humanlike-latency plan)

Status: **BASELINE CAPTURED** (2026-07-22, production, 2 sessions / 12 turns —
see table). Every later phase's success criterion references this file.

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

## Baseline numbers (captured 2026-07-22, PRODUCTION)

Sessions: `6a60e3310329ef651e461490` (APUSH U3.2, voice) +
`6a60e4de0329ef651e461493` (Calc BC U2.8, voice), crimsora.com prod, real
Cartesia + real brain. 12 turns; 8 clean complete turns after excluding
killed/incomplete turns and one contaminated row (see Known artifacts).

| Segment | Median | p90 | n |
|---|---|---|---|
| eager→end (Ink-2 semantic confirm) | **~125ms** | 313ms | 6 |
| end→fetch (client classify/dispatch) | **2ms** | 5ms | 7 |
| brain_first (fetch → first sentence SSE) | **2725ms** | 9229ms | 7 |
| tts→audio (first TTS fetch → first audio) | **~1144ms** | 1392ms | 8 |
| **TOTAL (turn.end → first audio)** | **~4669ms** | 11396ms | 8 |

## Consequences for the plan (decided by this data)

- **Task 1.3 (Ink threshold tuning): CLOSED — not worth it.** Median
  eager→end ≈125ms, far under the 300ms gate.
- **Phase 5 (eager dispatch): CLOSED — not worth it.** Same number vs the
  ~500ms gate. The endpointing pipeline is NOT the problem.
- **Task 1.1 (streaming first-audio): high value.** tts→audio ~1.1s median
  is almost entirely whole-sentence synthesis wait; expect −0.5–0.8s.
- **Phase 2 (ack layer): high value.** brain_first median 2.7s, p90 9.2s —
  and one observed 63s brain turn (slow model stream, 254 output tokens
  over ~60s, retries=0; APUSH "thinking pause"). The ack covers the head of
  every one of these; nothing client-side can shorten the stream itself.
- end→fetch (2ms) needs nothing.

## Known instrumentation artifacts (follow-up, low priority)

- One turn emitted `brain_first=-1976ms`: student speech arriving
  mid-stream can null the live turn's ledger (stale-guard) and interleave
  marks across attempts/queue-drain dispatches. Exclude negative rows.
- Turns dispatched via the queue-drain path (`callBrainOnce(combined)`,
  VoiceTutorRealtime ~11523) carry no eagerEnd/turnEnd → null segments.
- Fix idea: skip the stale-guard reset while a brain stream is in flight;
  mark `brainFetch` at the queue-drain call site too.
