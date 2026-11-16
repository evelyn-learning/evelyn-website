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
