# Live triage — Vanshika Tyagi, three Crimsora embed sessions (2026-09-05 20:14–20:56 UTC)

Build under test: `TwCKSya7D33Qpc2_05Qip` (main `49ff5ab1`, holistic-pedagogy Plan 1 + probe fixes).
Sessions: `portal-0365d7ae` (17 s) · `portal-620a92a4` (5 min) · `portal-51b667f1` (36 min, 46 brain turns, 44 renders, $3.51).
Evidence: `tutorsessions` docs (transcript + 849 debug events), `studentprofiles`, `practiceassignments`, pm2 `evelyn-tutor-out.log` (`brain.stream` lines), error log.

## Session shapes
- S1: iPhone Continuity mic silent (MicSilentWarning fired) → restart. Device issue.
- S2: opener brain fetch AND perception socket failed client-side within 100 ms ("Failed to fetch"), opener never spoken, fallback card only; student had to prompt, then muted and sat through two idle nudges → restart.
- S3: strong lesson (study design → sampling methods), student correct almost throughout; close via "let's wrap it up".

## Defects (this round's code)
1. Four ledger detections from "I don't know" as filler/hedge inside long correct answers → phantom inferred gap (recurrenceCount 3) and the tutor said "You've hit a few snags today…" (untrue).
2. Recap offer (voiced on attempt 2) consumed her continuation "right? Like it's like random sampling first…" as an `unclear` reply.
3. `close_session_notes` reached the client (20:55:57); gate refused with no telemetry; brain still announced "Your practice … is waiting in your practice area" (no locator, no record).
4. Final profile commit lost: last profile write 20:53:05 (intermediate flush); End at 20:56:22 saved the session doc but not the profile (no summary, no intent, no auto-assign). Fire-and-forget commit + immediate `session_ended` → iframe teardown.

## Pre-existing (verdict layer)
- Correction-note re-check narrated aloud: "Let me re-derive this myself before responding.", "20% of 120 is 24; 20% of 15 is 3."
- Judge JSON with unescaped inner quotes → parse failure → fail-open, issue lost.
- STT B/D mishear → "Not quite" on a correct answer; recovered after push-back via validator retry.
- S3 opener cited the aborted 5-minute S2 as "last time we looked at…".

## Fixes shipped (`d74762d7`)
1. End path awaits the final commit (≤3 s) + keepalive under the 64 KiB cap; `profile_commit_final` telemetry.
2. `practice_assign_skipped` on every refusal; `isHomeworkAnnouncement` drops homework announcements without a locator.
3. `isLedgerStuckCue` (explicit anywhere; soft only when it IS the reply; hedges never) + deferral to turn ok with a correct-verdict veto.
4. Meta-narration `RE_DERIVE_RE`.
5. `repairJudgeJson` (escape inner quotes → field salvage) before fail-open.
6. Opener retries once after a client-side network failure.

Not fixed (recorded): B/D letter reconciliation against named content; "last time" continuity from sub-threshold sessions; bare arithmetic narration.
