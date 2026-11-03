# GDI trial lesson — day-4 handoff (written 2026-11-03 ~16:30Z after Praveen's voice run 21)

> **Day-4 state (written 2026-11-03 ~19:59Z, Fable session):** Task 43 B–M + F are BUILT on `gdi-trial-lesson` (HEAD `2388ae92`, 12 commits since ffd0dc06; gate 277/279 baseline, tsc clean; NOT pushed, NOT deployed — :3009 still 58765b31). The nine harness checks (§4) are in `apps/tutor/scripts/trial-text-session-checks.mjs`; run 21 scores 10 FAIL / 1 WARN on them. Bot runs on the dev server: r41 straight 0 FAIL · r42 wild 3 FAIL (fixed) · r43 pron 0 FAIL · r44 second-visit 3 FAIL (fixed) · r45 straight 0 FAIL on the final line `2388ae92` (zero audible cuts; the brain's farewell came without the close tool before the bot left — the engine's forced-close path needs the next event; not a Task 43 class). A fresh-context whole-branch review (fable) found C-1 + I-2…I-6; all fixed in `2388ae92`; minors 7/9/10/11 deferred (see the ledger 20:xx). Day-4 spend ≈ $12 of ≈ $60.
>
> **Decisions still Praveen's:** A (returning learner: spoken "I remember your level" line and/or a "skipped" rail chip — not built), F (built DEFAULT ON — the hold adds up to ~2.5 s before the first audio on transition / offer / third-repeat / move-on / first required-phrase turns; `NEXT_PUBLIC_TUTOR_VALIDATOR_TTS_HOLD=off` to drop it), N (Japanese-first pronunciation score line — unchanged, note only).
> **New flags (all default ON, `!== 'off'`):** TUTOR_RECAP_CORRECTION_CARDS_ONLY (M), TUTOR_PART_ANNOUNCE_DEDUPE (C), TUTOR_ANSWERED_CARD_REASK_DROP (D), TUTOR_CORRECTION_CARD_HOLDS_ADVANCE (G2), TUTOR_CORRECTION_CARD_ON_NEW_PAGE (J), TUTOR_CORRECTION_REPLACES_MODEL_CARD (I), TUTOR_VALIDATOR_TTS_HOLD (F). H/E/G1/L/D-narration/B are core sentence-board / meta-narration rules under the existing gates (language lessons / fixed scripts).
> **Residual (not fixed):** a kill on a turn where the BRAIN advanced mid-turn (not prone at attempt start — r44 101 s) still cuts audibly; the voice-verdict cut on a closing turn can leave a question after the close tool (r43 1275 s, late-verdict class); the harness probe-loop check counts a bot's off-target answers as answers (r44 518–561 s).
> **Next:** Praveen's voice run → his "deploy" → §1 deploy steps (merge origin/main first) → tester links + TESTER-GUIDE → Josh's reply-6 by Fri 11-06.

> **For the next session:** READ THIS FIRST, then the ledger. Resume with superpowers:subagent-driven-development on Task 43 below. Do not re-run earlier tasks (31–42 are complete and approved; see the ledger).

## 1. Where things stand

- **Branch** `gdi-trial-lesson`, worktree `/Users/luke/Dev/evelynlearning/.claude/worktrees/gdi-trial-lesson`, HEAD **2fa99c45**, tree clean. 143 commits since b6014c00 (Praveen's run-18 build). Gate (`npm run test:changed` in `apps/tutor`) clean; `test:all` 429 PASS / 2 FAIL = the two baseline scripts (embed-debug-coverage, portal-student-scoping).
- **NOT deployed.** `:3009` is still 58765b31 (pre-Task-13). Deploy only on Praveen's word ("deploy"): merge origin/main → `./deploy-tutor-demo.sh` from the worktree → verify :3007 (RT1MwXX2) and :3008 (0kJJ…) untouched → re-mint demo links (`gdi-trial.links.txt`) → tester runs. Praveen sets the client pool cap at ship time. ⏰ Deadline Fri 2026-11-06: send Josh the link (reply-6 drafted, not sent).
- **Ledger** `<worktree>/.superpowers/sdd/2026-10-28-gdi-trial-lesson/progress.md` (reviews `task-3N-review.md`, re-reviews, final-review-day2/3.md). Memory: `~/.claude/projects/-Users-luke-Dev-evelynlearning/memory/project_gdi_communications_inquiry.md`.
- **Spend:** day-2 $100 fully used (≈$87) + day-3 $100 ≈$40 used (15 bot runs). Budget remaining for day 4 ≈ $60 unless Praveen tops up. A bot run ≈ $2.5–3.5 (≈$0.13/min).
- **Praveen's verdict on run 21** (embed-1793719782028, 20 min, stopped by choice at the summary): "overall very nice, minor issues remaining" — the list below.

## 2. How to run things (copy-paste)

```
# dev server (worktree) on :3019 — check it is up; log at scratchpad/local-3019.log
curl -s -o /dev/null -w '%{http_code}\n' "$(awk -F'\t' '$1=="praveen"{print $2}' ~/.evelyn/partners/gdi-trial.links.local.txt)"
# Praveen's run: open "$(awk -F'\t' '$1=="praveen"{print $2}' ~/.evelyn/partners/gdi-trial.links.local.txt)"   (id gdi-trial-praveen-tnv0jf = a RETURNING learner now: level check is skipped)

# dump a session (read-only, prod tunnel :2710)
S=<scratchpad>; sed 's/embed-1793637985118/embed-<ID>/' $S/dump-run18.js > $S/dump-x.js && mongosh --quiet mongodb://127.0.0.1:2710/evelyn --file $S/dump-x.js > $S/runX.txt

# harness checks on a dump
cd <worktree>/apps/tutor && node -e "import('./scripts/trial-text-session-checks.mjs').then(m=>{const r=m.runChecks(require('fs').readFileSync('<dump>','utf8'));console.log(r.lines.join('\n'))})"

# bot run (never while an implementer is editing — hot reload kills the live session; never two at once)
cd <worktree>/apps/tutor && nohup node scripts/trial-text-session.mjs --variant <base|errors|impatient|lost|beginner|polite|quiet|pron|straight|wild> --student gdi-trial-bot-rNN --max-min 30 --out $S/bot > $S/bot/rNN.out 2>&1 &
# Monitor filter: grep -E --line-buffered "^=== [0-9]+ FAIL|^FAIL |CLOSE detected|treating as (closed|ended)|no tutor activity|TimeoutError|DUMP FAILED"

# partner pool (300-min cap; exhausted ⇒ sessions cut mid-lesson; reset = approved write class)
bash scripts/ops/partner-pool.sh show gdi-demo
mongosh --quiet mongodb://127.0.0.1:2710/evelyn --eval 'db.partnerpools.updateOne({_id:"gdi-demo"},{$set:{usedSec:0}})'

# gate / suite (from apps/tutor of the WORKTREE — from the root checkout the script is missing)
npm run test:changed ; npm run test:all
```

Rules that bit us: one implementer at a time; reviewers read-only in parallel; never edit engine files while a session (Praveen's or a bot's) is live; the harness tee only sees brain-stream turns (the client-spoken opener is invisible — the bot answers "ready" proactively); `git commit -- path` for the gitignored-but-tracked plan JSON; pins in the owning `scripts/test-<name>.ts`; flags `!== 'off'`; language-lesson / fixed-script gating for every pedagogical rule (the final reviews caught ungated rules twice); the whole-day opus review after each batch is worth its cost (it found a maths regression on day 2 and a wrong-English write-back on day 3).

## 3. Task 43 — Praveen's run 21 findings (brief content; dump `<scratchpad>/run21.txt`)

Text harness scored run 21 **35/35** — every item below is invisible to it; add the checks in §4 first so bot runs can see them.

- **A. Returning learner, level check already ✓ at 0:41 (image 85).** Praveen's id has a stored level, so the level check is skipped (`working_level_known`, overview → topic-intro at 0 s) — correct by design, confusing on screen. Design decision for Praveen: spoken line in the opener for returning learners ("I remember your level from last time, so we'll go straight to the topic") and/or a "skipped" style on the rail chip instead of ✓.
- **B. "Yes, I am ready." carded (47 s, image 86).** The sentence board carded the student's readiness answer. Rule: student acknowledgements / readiness answers (yes, I'm ready, OK, let's start, はい) are never cards (Task 38 §E covers tutor lines only).
- **C. Duplicated transition (143 s):** "Now let's move on to the present perfect. Next, we'll practice the present perfect, …" — the brain's own transition + the bridge clause name the same part twice. Rule: two consecutive sentences that both announce the same part name → keep one (the adjacent-duplicate rule's Jaccard misses it).
- **D. Answered card question re-asked in a non-summary part (290 s, image 87):** "Now let's go back to the question on the board: Have you worked for your current company for a long time?" after it was answered at 183/203/227 s. `correct_retry_note_planted: earlier answered question re-asked` fired but the ask still spoke; at 335 s the narration "The question was already answered earlier, so let's move on." Fix: extend Task 35 §B's answered-question drop from the summary to every part (drop the re-ask of an answered card question; keep a NEW question), and drop the "already answered, so let's move on" narration shape.
- **E. "Ryota here:" lead (335, 384, 656, 739 s).** T-1 drops the bare "Ryota here." sentence; the lead form "<Persona> here: …" survives. Strip the lead (persona name from the session), keep the rest.
- **F. Audible cuts (441, 624, 874, 1116 s):** validator kills after the first sentence(s) already played (`judge_kill_snapshot: heard=1–3`) — Praveen hears "Please…" / "You went with your…" / "By giving everyone…" / "Summary…" cut off, then the retry. Design decision for Praveen (latency vs cuts): on validator-prone turns (transition / offer / repeat-after-correct / move-on), hold TTS until the validators have seen the first two sentences (≈1–2 s added latency), or accept cuts. The verdict-hold mechanism (`voice_verdict_hold_*`) is the pattern to reuse.
- **G. Board narration + advance in one turn (689 s, image 89):** "Here's the full sentence on the board. Take a moment to look at the sentence on the board. Now let's move on to a conversation about your work." — then the page flipped at once. (1) Drop those board-state shapes (Task 39 §B2 covered "The card is on the board. Take a second to look at it." — add "Here's the full sentence on the board.", "Take a moment to look at the sentence/board."). (2) An auto-advance on a turn that rendered a correction card for the student's sentence holds one boundary so the learner sees it.
- **H. Terse acks "Noted." / "Accepted." (441, 874 s):** from the transition-retry directive's brief-ack ruling — sounds robotic. Ruling: the retry's ack is a natural short line ("Good, thanks." / 「はい、わかりました。」), never a one-word verdict.
- **I. Two correction cards for one sentence (916 s, image 90):** the full recast "I could write an email to remind everyone to pay." AND a fragment "I could write an email to everyone" (kind=correction, anchor=0). One correction card per student sentence; never a card that is a prefix of another card on the page.
- **J. Student sentence not visible after an advance (961/976 s, image 91):** "I told everyone about the event and its benefits." was carded at 961 s on the Conversation page, then the brain advanced to Pronunciation (973 s) and the corrected "First, I told…" card was routed to the previous page while the view moved on (Task 38 §B no-pull-back) — so Praveen saw neither. Rule: a correction of the student's LAST sentence on an advancing turn goes on the NEW page (under the authored card), or the advance holds one boundary (ties to G2).
- **K. Menu not asked for 57 s after the brain advanced into pronunciation (973–1030 s):** the entry note was planted at 976 s but no tutor turn followed until Praveen repeated himself; the no-ask continuation did not fire (the turn ended with "we'll do a short pronunciation practice" — no ask). Fix: when the entering turn of a menu part asks nothing, the engine appends the authored menu at THAT turn's end (Task 42 §D fallback fires on turn end, not on the next turn), or the no-ask continuation must treat the menu part as "nothing asked".
- **L. Narration (1116 s):** "Let me close this part and move on to the summary." → extend the tool-action drop (Task 39 §A2: "Let me advance." → add "Let me close this part (and move on …)", "I'll close this part").
- **M. Summary page re-cards earlier sentences (image 92):** the recap quoted his own "I collected donations from everyone." and the contrast "I have worked here for five years." and both were carded on the summary page. Rule: on the summary part, sentences already carded earlier in the lesson (dedupe across pages, not per page) are not re-carded; the contrast pair may be carded once.
- **N. Pronunciation feedback leads in Japanese** (1063/1083/1099 s: 「発音の結果は100点中87点で…」 then English). The English-first validator allows it (English follows). Note only — ask Praveen whether the score line should be English-first.
- **O. No first-attempt speech loss this run** (Zoom transcript `/Users/luke/Downloads/Praveen Tyagi's notes.txt` shows one "I'm ready"; the dump matches). Keep watching.

## 4. Harness additions (do these BEFORE Task 43's bot runs; files `apps/tutor/scripts/trial-text-session*.mjs`)

- student ack / readiness answer carded → FAIL (B)
- two consecutive sentences announcing the same part name → FAIL (C)
- an answered card question re-asked in ANY part (reuse the summary check across parts) → FAIL (D)
- "<Persona> here:" lead in spoken text → FAIL (E; persona from the session's teacher name)
- `judge_kill_snapshot` with heard ≥ 1 → count as "audible cuts" → WARN with the count (F)
- a sentence card that is a prefix of another card on the same page → FAIL (I)
- a student card routed to the previous page on an advancing turn → FAIL (J; event `student_card_on_previous_page` already checked — make sure it still fires)
- menu part: > 20 s between the pronunciation page paint and the first menu ask → FAIL (K)
- summary page: a card whose text already appeared on an earlier page → FAIL (M)

## 5. Suggested order for day 4

1. Harness §4 (≈30 min, no API cost) → run the checks on `run21.txt` to confirm they flag it.
2. Task 43 brief = §3 (A needs Praveen's answer; F and H are rulings — ask him in the morning summary, proceed with "hold TTS on validator-prone turns" and natural acks if no answer) → opus implementer → opus task review (the regression classes: dropped teaching sentences, kills on ordinary turns, ungated rules, wrong English on the board) → sonnet re-reviews → gate.
3. Bot runs: wild, straight, pron, carry-over (second visit) → three clean in a row → final whole-day opus review → fix → test:all → summary.
4. Praveen's voice run → "deploy" → §1 deploy steps → tester links + TESTER-GUIDE → Josh's reply-6.

## 6. Open items carried over (not in Task 43)

PDF browser download unverified (Node replay only); PDF goal line "Concept Review"; bold/italic lost on CJK lines; recorder unbounded retry buffer (prod risk on a disk error); late-verdict window (a re-ask that streams before the judge answers is spoken); parked minors in every task-3N-review.md; "Which one…?" counts as a number ask in a menu part; the two practice-store tests fail outside the npm scripts (pre-existing).
