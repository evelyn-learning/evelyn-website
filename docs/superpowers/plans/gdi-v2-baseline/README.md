# GDI v1 baseline (before the v2 port), 2026-11-15

Local dev server (worktree gdi-v2, :3019, typed-turn engine ON by default), PROD Mongo via the tunnel, plan `gdi.trial.english.work-projects.v1`, partner `gdi-demo`, tutor languages en+ja. Text mode, `--no-speech` (0 speech requests refused: none were attempted). Student ids `gdi-v2-replay-*`.

Harness changes (apps/tutor/scripts/tutor/replay-harness/run-replay.ts): `--student <id>`; in `input_mode:"text"` there is no start orb and the tutor waits for the learner to type first, so the driver now types one opening line (`--open`, default "Hello, I am ready."). Without it the run stalls. The client-authored opener ("Are you ready?") never goes through the brain stream, so the scripted student does not see it; the tutor's first visible turn is the brain's reply to the opening line.

Typed-turn engine confirmed running in text mode (`/api/tutor/brain/stream`; trial checks report `typed_turn` 40 turns).

## Replay runs (score cards `*.score.json`, transcripts `*.log`, bundles `*.json`)
| Fixture / run | Min | Tutor turns | Complaints | Ended |
|---|---|---|---|---|
| gdi-b1-mixed run 1 (`...mwiqxnsnm5j`) | 18.1 | 40 | 4 | cap (40 student turns); ちょっと待ってください came at turn 40, "finish" never reached (thresholds too late; fixture then tightened) |
| gdi-b1-mixed run 2 (`...mwirnawqnu3`) | 18.8 | 41 | 2 | tutor_close |
| gdi-real-josh | 9.1 | 22 | 0 | cap (22): last student line was the stop request, so the tutor's reply and the "continue next time?" question were NOT captured |
| gdi-real-james | 15.2 | 38 | 3 | cap (40): reached the pronunciation menu, never reached "I have to finish" |
| gdi-real-t2 | 13.1 | 36 | 1 | tutor_close |

Cost per minute (harness estimate) 0.008-0.016. No PAGEERRORs.

## Behaviour against the 10 cases (v1, observed)
1. Confusion: v1 now REPHRASES when asked ("Could you please rephrase that?" t2 -> same question again, simpler, with Japanese). James "Uh, sorry. I don't understand." -> next question ("one skill you'd like to improve") with Japanese reassurance, i.e. still moves on instead of re-asking the job question. t2 "Could you explain that in Japanese?" -> Japanese gloss of "admin" then next question.
3. Short "No." streak (t2): reproduced. After "No." / "No, I have not." the tutor keeps asking project/task questions ("important issue with your manager", "task finished well", about 6 in a row) and says "No, that's a clear answer" to "No, I have not."; eventually pivots to "start of your workday" (which worked) and to pronunciation.
4. Stop means stop: NOT exercised (josh and james runs ended first; b1 never said "finish now").
5. Menu pick (James): "just a little bit of individual words" -> tutor re-read the 4-option menu, picked up the word; then re-read the menu AGAIN; "I said individual words." reproduced (complaint_ignored). Skip (t2): "Skip and continue." answered by re-reading the menu twice; the student had to repeat.
6. Praise stacking: reproduced everywhere ("Good, that's a clear answer. ... That is a clear answer.", "Thanks for trying that. Good start..."); corrections restate the rule twice (b1 plural "years").
7/8/9: not specifically measured (no scripted trigger); t2 run shows "No, that's a clear answer" for "No, I have not" (wrong verdict class).
10. Resume: NOT exercised (see 4).
Present-perfect error loop (b1, Josh): "I work here for eleven year" -> correction + retry loop worked, 3 tries. ちょっと待ってください (b1) -> "はい、お待ちしています" and the tutor waited (good). Mispronounced word (b1): "responsibilitizu" offered as the summary sentence -> "聞き取れませんでした", asked again; no pronunciation feedback on the word itself.

## trial-text-session.mjs (existing quality bar; `trial-straight/`, `trial-beginner/`, console + checks in `trial-*.console.txt`)
| Variant | Min | Est cost | Checks |
|---|---|---|---|
| straight | 15.7 | ~$2.04 | 5 FAIL / 70 PASS / 3 WARN |
| beginner | 16.1 | ~$2.09 | 3 FAIL / 73 PASS / 1 WARN |
straight FAILs: three-question probe loop (same topic asked 3+ times "learn trad show", "most challeng part prepar presentat"); answered board question re-asked at 64s; TT1 one next per turn (40 typed vs 41 brain turns); TT11 summary does not close itself (826s backstop); TT5 prose classes (validator retries 2, transition_ask_off_part 1). WARN: audible cut at 4s, 4 typed retries, no Japanese in first 3 turns.
beginner FAILs: three-question probe loop again; 45 s3 affirmed retry not on board (223s); TT15 recap check question asked before the close. WARN: 3 typed retries.

## Pool
gdi-demo used before my first run: 682.8 min; after everything: 810.7 min (delta 127.9 min, includes the controller-noted tester sessions in the same pool; the controller topped the cap up by 300 to 1182, remaining 371.4).
Probe page loads: two short browser opens of the embed (text mode, no speech) with a probe student `gdi-v2-replay-probe-text`.

## Fix round 1 (cases 4 and 10, and cases 7/8/9)
New fixture `gdi-real-stop` (Josh's stop + resume lines, then James's "Sorry, I have to finish now."), run once: `gdi-real-stop-v1-mwiv4fl134v.*`, student `gdi-v2-replay-stop-v1`, 3.0 min, 7 tutor turns, ended by tutor close.
- Case 4 (stop means stop): v1 now obeys at once. "Okay, please stop. I would like to end the session for now." -> a wrap-up and "goodbye!" with no new question and no new part (the old Josh 11-09 bug is gone on this build). "Sorry, I have to finish now." -> one goodbye, no repeat needed (James needed three on 11-10).
- Case 10 (resume): v1 PROMISES it ("Yes, we can pick up from here next time. 次回も、今日の続きから始めましょう。") although it has no resume, and it then asks a new question after the promise ("What is one work project you would like to talk about next time?"). Reproduced: v2 must not promise this, or must resume from lessonProgress.
- Cases 7 (wrong/contradictory corrections), 8 (invented facts), 9 (timer line mid-menu): nothing was run for these. 7: only a weak instance in the existing t2 bundle (tutor answers "No, I have not." with "that's a clear answer"; "gdi-real-t2-v1-mwitcj3c71e.log" 05:27:17). 8 and 9 were not observed in any bundle (no timer line appeared; every run was shorter than the 20-minute cap).
- Harness: the typed opening line is now gated on `input_mode === 'text'` (`needsOpeningLine` in scripted-student.ts, unit-tested in replay-harness.test.ts, `npm run test:replay-harness` = 27 passed, 0 failed), voice and default runs are unchanged (no extra wait, no typed line). A failure to type the opening line now throws instead of stalling.
- The opening line is stored as a student turn tagged `ack`; the scorecard treats it as an ordinary student turn (not a complaint).
- Pool: the fix-round run is about 3 min; remaining 1368.2 min after it (other sessions share the pool).
