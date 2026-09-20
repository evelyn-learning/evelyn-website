# Live check 2 — three sessions on build `epJXkmduPiSVbRDsJWHml` / academy `c871a0f` (2026-09-06)

## A. portal-4bbe5d91 follow-up (Praveen) — the wrong sub-question
05:14:41 "…what do you think $-2 \times (-4)$ comes out to?" while the board showed $8 - 3(2x-4) + 5x$. Root cause: the orchestrator substituted the segment's authored card for the brain's improvised problem (`show_problem_substituted → worked-negative-multiplier`), but the brain's speech was written for its own problem (which had a −2). The judge passed the turn as grounded; the tutor then affirmed the student's "−2 × −4 = 8" (05:15:49) before correcting at 05:16:50 — and the judge flagged the CORRECTION, not the error. Missed in the first analysis.
Fix: `findUngroundedComputation` — a × / ÷ question whose operands are not in the problem statement, the student's utterance, or the session's equations (sign-aware; a coefficient "2x" does not ground a bare "−2") is killed and re-asked (`posed_computation_kill`).

## B. The "over an hour" banner
Not a time limit. At min(0.92·T, 55) minutes the engine shows the legacy session-ROTATION prompt ("You've been studying for almost an hour. Keep going?") and at 58 minutes silently rotates the connection — machinery for the old OpenAI Realtime WebSocket's ~60-minute cap. Under the Claude brain (per-turn HTTP, Cartesia TTS) there is no cap, so the banner appeared and the session simply continued. Fix: rotation prompt + auto-rotation gated off in Claude-brain mode. What remains by design: the 45-minute SPOKEN check-in (recap / break / keep going), and for time-boxed sessions (demo, academy `timeBox`) the tutor wraps at `wrap_at_minutes` and the hard stop ends the session through the normal End path. Recommended next: a small elapsed-time chip in the header instead of any banner, and a spoken "we've done an hour — shall we wrap here or push on?" at 60 for open-ended sessions.

## C. portal-d8a9566e (Noah, division, voice, 32 min, freeform plan)
- Judge fabricated "Not quite" flags on THREE correct denials (21÷7 "2", 27÷9 "2" twice). On the first, the note rode Noah's next (correct) answer and the tutor said "Actually, hold on — you were right: 3 groups of 7…" to a student whose flagged answer had been "2". Fix: the note now names the graded answer; the deterministic gate (previous round) suppresses denial-advisories when a verified key exists.
- Two REAL tutor errors, both recovered via the 20-second note timeout ("volunteering the correction") ~27 s later: "Not quite yet" to the correct "4" for 64÷16 (08:22), and "Exactly right… 4 for Player 1, and now 3 for Player 2" (08:35) — a wrong affirmation plus an invented number.
- Cross-problem reversal kill (08:25:52): "4" had been denied on 64÷16; Noah's correct "4" for 24÷6 was killed as a "reversal", and the retried turn apologised about 64÷16 while never grading 24÷6. Fix: denials are scoped to the problem they were about.
- `embed_config practice_locator=no goal_note=no`: freeform (`gen-…`) plans mint no locator by design — homework cannot be assigned from freeform sessions. Worth a product decision.

## D. portal-9f3d3c6f ("Student", voice, 10 min, freeform plan)
Disengaged session: one answer ("11", correct), then STT fragments ("It's all it.", "We're going to never find this."), two idle nudges across four silent minutes, then "Can you speak?" — the student may not have heard the tutor (no audio-output telemetry exists to confirm; the perception socket reconnected once at 07:42:50). Ended via End: `profile_commit_final status=200` (new telemetry working). The trailing `Brain failed: Failed to fetch` is the End path aborting an in-flight turn — benign, but it should not be logged as a failure (not changed).

## Fixes shipped this round
posed-computation kill · rotation banner gated off under Claude brain · problem-scoped denied-answer reversal · correction note pins the graded answer.
