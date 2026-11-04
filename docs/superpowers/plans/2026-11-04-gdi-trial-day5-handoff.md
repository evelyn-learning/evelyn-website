# GDI trial lesson — day-5 handoff (written 2026-11-04 ~03:45Z, Fable session, after Praveen's voice run 24)

> **READ THIS FIRST**, then the ledger (`<worktree>/.superpowers/sdd/2026-10-28-gdi-trial-lesson/progress.md`), then the design doc. Do not re-run Tasks 31–46 (complete, see the ledger).

## ★ OVERNIGHT 11-04 — TYPED TURN BUILT (DRAFT block, finalized when the bot series ends; read this before §0)

**Where things stand (as of ~10:05Z):** the typed turn is built on `gdi-trial-lesson` behind the opt-in flag `TUTOR_TYPED_TURN` (`NEXT_PUBLIC_TUTOR_TYPED_TURN=on`; OFF by default, prose path byte-identical when off). Plan `docs/superpowers/plans/2026-11-04-typed-turn.md`, Tasks 1–8 complete + reviewed, Task 9 (harness + bot series) in progress; HEAD see `git log -1` (e7b7858a at draft time), NOT pushed, NOT deployed (:3009 still 58765b31). Ledger: `.superpowers/sdd/2026-11-04-typed-turn/progress.md`; run log: `…/task-9-runs.md`; dumps in the session scratchpad `…/d660ae27-…/scratchpad/bot/`.

**What the typed turn is, in one paragraph:** on a fixed-script plan the client sends `typedTurn {state, allowedNext, recap}`; the server asks Haiku for one JSON object (`ack / verdict / verdict_say / correction / support_ja / next{kind,say,item,level}`) via structured output with no tools, streams each field as it closes (`typed-field` events) and its sentences in composition order, refuses an illegal `next.kind` or an over-budget `next.say` with ONE server-side retry (splice: only `next` is taken), and the client composes speech, places cards from fields, turns the page on the move sentence and keeps state (`typedTurnStateRef`) from what it spoke. Prose validators, kills, holds, heuristic inferences and engine lines all stand down on a typed attempt. Debug events `typed_turn*`; harness block 10m (TT1–TT9).

**Bot series so far (dev :3019, flag on in the PROCESS env, never in .env.local):** r51 smokes → r52 straight (TT clean; found: move into the menu part blind to the next card; 7 retries) → engine fix 1 → r55 straight (dup sentence across fields; answered card re-asked; menu unnumbered) → engine fix 2 → **r56 straight CLEAN (0 retries)** → r57 wild running → r58 pron next. Spend ≈ $12 of the $100 ceiling; pool reset authorized.

**Decisions I made on your behalf (check these):** (1) the illegal-`next` retry is a second SDK call inside `streamBrainTurn`, not a client re-POST (you approved at 04:1xZ); (2) the `next.say` budget counts ENGLISH sentences only — Japanese exempt (spec §4.1 deviation); menu/recap budget 5; (3) `turn_state` carries `next_part`/`next_card` when a move is allowed and `answered="…"` for answered cards; (4) all per-sentence drop filters stand down on typed except label-stripping and the katakana hygiene drop; (5) the client never invents a `next` — on a cut/unparseable object with no `next` it stays quiet and the idle nudge takes over; (6) runtime notes keep planting (advisory), kills never fire on typed.

**Observed trade-offs to decide on:** first audio ≈ 1.3 s median vs ≈ 1.0 s on prose (the JSON prefix + ack field); the straight bot's repeat-answer loop (tutor re-asks the same question up to 6×) is the prose-era "neither streak → move on" mechanism the typed path dropped — a `same_answer_streak` attribute is the typed-era fix, not built; menus are sometimes read without numbers (WARN TT9, pick still resolves).

**Your morning:** (a) fresh new-learner link — mint per §3 (I will leave one in the final version of this block); (b) voice run on :3019 (flag on there) — the typed path is in text AND voice; (c) say "deploy" only for the Task 46 build to :3009 for Josh (Friday) — the typed turn ships to :3009 only after your run + Task 10 (default ON).

## 0. Praveen's instruction for this session

"Budget Approved. Lets work on this in a fresh session." — **"this" = the typed turn**, design at
`docs/superpowers/specs/2026-11-04-typed-turn-design.md` (committed 1d349c15, builder-check answers in §4.8).
Budget approved: a bot series of three clean runs (straight, wild, pron) ≈ $9–15 before his voice run.
The design was written through superpowers:brainstorming; his "lets work on this" is the go — **confirm in one line at session start that the document as written is approved**, then invoke `superpowers:writing-plans` on it (the brainstorming gate names that as the only next skill). Build with superpowers:executing-plans or subagent-driven-development, TDD throughout, one flag `TUTOR_TYPED_TURN` (OFF until the bot series is clean, then default ON — ruled in design §4.6; the only exception to the default-ON rule).

His one unanswered brainstorming question ("what would make you wince?") stands answered by the design's anti-goals: no mechanical voice, no longer pause before replies, no thinner Japanese. Keep those as acceptance criteria.

## 1. Where things stand

- **Branch** `gdi-trial-lesson`, worktree `/Users/luke/Dev/evelynlearning/.claude/worktrees/gdi-trial-lesson`. HEAD at handoff time: see `git log -1` (1d349c15 + this doc). Pushed to origin. **NOT deployed** (`:3009` demo still 58765b31). Gate `npm run test:changed` in `apps/tutor`: 277/279 (2 known baseline failures: embed-debug-coverage, portal-student-scoping). `npx tsc --noEmit -p tsconfig.json` clean.
- **Dev server** `:3019` serves the worktree (pm2/nohup `next dev`, log `/private/tmp/claude-501/-Users-luke-Dev-evelynlearning/2c42cc72-9e7f-4dc6-b232-bfc5cd4c531b/scratchpad/local-3019.log`). It hot-reloads on every edit: **never edit engine files while a bot or Praveen session is live.** Never two bot runs at once.
- **Bot r50 (wild) was still running at handoff** (student `gdi-trial-bot-r50`, started ~03:20Z on 39cf2410). Score it first: dump by studentId (recipe §3) and run the checks. r47 (pron) 66/0, r48 (wild) 66/2 (its probe loop — known), r49 (straight) 62/4 → the two engine findings were fixed in 39cf2410 (offer ending in an instruction is an open ask; recap re-paint skipped), the other two are the bot's garbled summary answer (known class).
- **Praveen's link** (new learner `gdi-trial-praveen-tnyf2x`, already used for run 24 → now a RETURNING learner: the level check is skipped). Mint a fresh one before his next run: §3.
- **Partner pool** `bash scripts/ops/partner-pool.sh show gdi-demo` — 87/300 min used at 02:30Z (+ r49/r50 ≈ 45 min). Reset only on his word (prod write).
- **Memory:** `~/.claude/projects/-Users-luke-Dev-evelynlearning/memory/project_gdi_communications_inquiry.md` (+ MEMORY.md line).

## 2. What was built since the day-4 handoff (all pushed)

- **Task 45** (run 23, `ea15176e`..`29a66eb8`): judge note part-scoped + none in the level check; invited question answered (prompt); card answered in substance; retry / elicited-fix cards; part page break anchored to the transition sentence (render-sync) with student cards held on the old page; no-ask verdict echo dropped; pronunciation item repeat kill; held advance waits for an accepted offer item. Review fixes I-1..M-5. Harness block 10k.
- **Task 46** (run 24, `1fae7d9c`, `39cf2410`): paraphrased authored-card re-paint dropped on the entry turn; held advance waits for a retry reply's verdict; last-item note one turn before the budget; contentless transition ask → card question; student cards need the tutor's confirmation (never the precheck alone, level check included); cards quoted after the move sentence go after the page break; render stall timer re-arms while speaking; idle-nudge note narration dropped; same-quotes question is not a re-ask; offer ending in an instruction is an open ask; recap skips the brain's re-paint of earlier student sentences. Harness block 10l; dumps no longer truncate card JSON. Flags: TUTOR_AUTHORED_CARD_PARAPHRASE_DEDUPE, TUTOR_HELD_ADVANCE_WAITS_FOR_RETRY_REPLY, TUTOR_LAST_ITEM_NOTE, TUTOR_CARD_NEEDS_TUTOR_CONFIRMATION, TUTOR_RENDER_STALL_WAITS_WHILE_SPEAKING (+ Task 45's seven). All default ON, all gated to fixed scripts / language lessons.
- Praveen was told plainly (twice) that Tasks 45/46 are patches and the typed turn is the structural fix; he also asked why Crimsora/GAC scripted lessons behave (answer in memory: answer-keyed, text, one language, answer-driven advance = the deterministic zone).

## 3. How to run things (copy-paste; absolute paths)

```
W=/Users/luke/Dev/evelynlearning/.claude/worktrees/gdi-trial-lesson; S=<your scratchpad>
# dev server for the typed turn: the flag goes in the PROCESS env, never in .env.local (a symlink the deploy scripts read)
# cd $W/apps/tutor && NEXT_PUBLIC_TUTOR_TYPED_TURN=on nohup node $W/node_modules/.bin/next dev --turbopack -p 3019 > $S/local-3019.log 2>&1 &
# dev server up?
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3019/tutor-portal/embed
# fresh new-learner link for Praveen (secret file; writes the links file; the 'praveen' row is his)
cd $W && PARTNER_SECRET="$(cat ~/.evelyn/partners/gdi-demo.secret)" node docs/whitelabel/gdi/demo/mint-demo-links.js trial --local > ~/.evelyn/partners/gdi-trial.links.local.txt
awk -F'\t' '$1=="praveen"{print $2}' ~/.evelyn/partners/gdi-trial.links.local.txt
# dump a session (prod tunnel :2710, READ ONLY) — set ONE of SID / STU, the sed writes the query
SID=""; STU="gdi-trial-bot-r50"
cat > $S/dump.js <<'JS'
const q = __QUERY__;
const d = db.tutorsessions.find(q).sort({createdAt:-1}).limit(1).toArray()[0]; if (!d) { print("NOT FOUND"); quit(1); }
const t0 = new Date(d.createdAt || d.startedAt).getTime(); const rel = (ts) => ts ? (Math.round((new Date(ts).getTime()-t0)/1000)+"s").padStart(6) : "     ?";
print(JSON.stringify({sessionId:d.sessionId, studentId:d.studentId, createdAt:d.createdAt, endedAt:d.endedAt, turns:(d.transcript||[]).length, events:(d.debugEvents||[]).length, wb:(d.whiteboardCommands||[]).length, lp:d.lessonProgress}));
print("=== TRANSCRIPT"); (d.transcript||[]).forEach((t,i)=>print(`${rel(t.timestamp)} ${String(i).padStart(3)} ${t.role}: ${t.text}`));
print("=== WHITEBOARD"); (d.whiteboardCommands||[]).forEach((w,i)=>print(`${rel(w.timestamp)} ${String(i).padStart(3)} ${JSON.stringify(w).slice(0,3000)}`));
print("=== EVENTS"); (d.debugEvents||[]).forEach((e)=>print(`${rel(e.timestamp)} ${e.type}: ${String(e.message).slice(0,600)}`));
JS
if [ -n "$SID" ]; then sed -i '' "s/__QUERY__/{sessionId:\"$SID\"}/" $S/dump.js; else sed -i '' "s/__QUERY__/{studentId:\"$STU\"}/" $S/dump.js; fi
mongosh --quiet mongodb://127.0.0.1:2710/evelyn --file $S/dump.js > $S/r50.txt
# harness checks on a dump
cd $W/apps/tutor && node -e "import('./scripts/trial-text-session-checks.mjs').then(m=>{const r=m.runChecks(require('fs').readFileSync('$S/r50.txt','utf8'));console.log(r.lines.filter(l=>/^(FAIL|WARN)/.test(l)).join('\n'));console.log('PASS',r.passes,'FAIL',r.fails,'WARN',r.warns)})"
# bot run (≈ $3, 20–25 min; variants straight | wild | pron | base | errors | impatient | lost | beginner | polite | quiet)
cd $W/apps/tutor && nohup node scripts/trial-text-session.mjs --variant straight --student gdi-trial-bot-rNN --port 3019 --out $S/bot > $S/bot/rNN.out 2>&1 &
# typed run: block 10m prints TT1–TT8 (clean = 0 FAIL on TT1–TT6, spec §4.8); fixture test: npm run test:trial-checks-typed
# gate + types
cd $W/apps/tutor && npm run test:changed && npx tsc --noEmit -p tsconfig.json
```

## 4. Deploy (only on Praveen's word "deploy"; Friday 11-06 is Josh's link)

Merge origin/main into the worktree first → `cd $W && ./deploy-tutor-demo.sh` → verify :3007 (RT1MwXX2) and :3008 (0kJJ…) untouched → re-mint the demo links (`node docs/whitelabel/gdi/demo/mint-demo-links.js trial` without `--local` → `~/.evelyn/partners/gdi-trial.links.txt`) → tester links + TESTER-GUIDE → Josh's reply-6. The Friday build is the Task 46 build; the typed turn ships only after its bot series + a Praveen run.

## 5. Open items (not built)

- Praveen's decisions: A (returning-learner level-check UX), F (validator TTS hold latency, built ON), N (Japanese-first pronunciation score line).
- Soft session cap (the 30-min hard stop): a spoken one-minute warning + a visible countdown — small separate task.
- Known residual classes: the wild/straight bot's probe loop on nonsense answers; two audible cuts per run on non-prone kill classes; the brain's farewell without the close tool (forced close covers it).
- Harness: run 24's §1 duplicate-card check needs full card JSON (dumps fixed); `45 §2a` exempts personal-detail declines.
