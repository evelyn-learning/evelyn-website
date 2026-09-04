# Live verification after the deploy — Praveen, 2026-09-05 morning

**What shipped:** all 14 tasks + a 5-fix final-review wave. 32 commits on `tutor-rounds`. The final whole-branch review caught one Critical in my own work (Task 14's refusal) before it reached you — see progress.md, Ruling 22.

**Read `progress.md` first** — its last lines say what actually shipped, whether the deploy ran, and
every ruling I made. If the gate was not fully green I did NOT deploy; the branch is green-pending.

Total time for checks 1-4: about 12 minutes. Checks 5-6 are optional.

---

## 0. Confirm what is live (30 seconds)

    git -C ~/Dev/evelynlearning/.claude/worktrees/tutor-rounds log --oneline -1
    ssh root@84.247.185.169 'cat /root/evelyn-tutor/apps/tutor/.next/BUILD_ID'
    ssh root@84.247.185.169 'pm2 jlist | python3 -c "import sys,json;[print(p[\"name\"],p[\"pm2_env\"][\"status\"],\"restarts=\",p[\"pm2_env\"][\"restart_time\"]) for p in json.load(sys.stdin) if \"tutor\" in p[\"name\"]]"'

Expect: BUILD_ID is **not** `O02vRlqH34mLt6PMxDrhT` (that was the pre-deploy one), `evelyn-tutor` online, restarts unchanged.

---

## 1. Smoke — does the tutor still work at all? (2 min)  ← DO THIS FIRST

Start any session, tap start, say one thing, confirm the tutor speaks and the board renders.
This is the single most important check: it catches any orchestrator regression from the whole round.

**If the tutor does not speak or the board stays blank, roll back immediately:**

    cd ~/Dev/evelynlearning/.claude/worktrees/tutor-rounds && git log --oneline -1   # note the sha
    # then redeploy the previous good commit, or disable the round wholesale:
    # set all nine NEXT_PUBLIC_TUTOR_* flags below to 'off' in the prod env and redeploy.

---

## 2. The two false kills — the headline fixes (4 min)

Run a **multi-step equations** session (algebra-1) and do two things:

**2a. Coefficient step.** Solve to a point where the tutor shows work like "3x = 30, so x = 10", and
give the correct final answer out loud.
- PASS: the tutor affirms you ("Exactly", "Right") and moves on normally.
- FAIL: "Not quite", or it jumps to new content without telling you whether you were right.

**2b. Multiple-choice card.** When an MCQ appears, answer with the value AND the letter — e.g. "x is 9,
so C".
- PASS: affirmed.
- FAIL: denied, or no verdict at all.

These two are the exact production failures (portal-704e3e01 @1113.7s and @1414.3s). If either fails,
the fix did not take — check the flags in step 6.

---

## 3. The lesson-jump fix (2 min — same session as step 2)

Watch for the symptom you originally reported: the tutor suddenly starting on a new topic with no
closure on the last question.
- PASS: every topic change is introduced.
- FAIL: an unannounced jump — note the timestamp and pull the session (step 5).

---

## 4. Fractions / stats arithmetic (3 min)

Run an **AP-statistics** session and get to a variance calculation with a multi-term sum
(the live shape was `16 + 9 + 9 + 4 + 144`).
- PASS: the tutor states the correct total, or corrects itself before you have to.
- FAIL: it states a wrong total confidently — note it; `board_contradiction` should have fired
  (advisory this round, so it does not stop the speech yet — that is by design).

---

## 5. Pull the session and grep the events (3 min, do this once for any session above)

    scp ~/Dev/evelynlearning/.claude/worktrees/tutor-rounds/apps/tutor/scripts/inspect-tutor-session.ts root@84.247.185.169:/tmp/
    ssh root@84.247.185.169 'cd /root/evelyn-tutor && cp /tmp/inspect-tutor-session.ts ./inspect.ts \
      && export $(grep -E "^(MONGODB_URI|TUTOR_AUDIO_DIR)=" apps/tutor/.env.local | xargs -d "\n") \
      && npx --yes tsx ./inspect.ts <YOUR_SESSION_ID> --out /tmp/session-reports'

| Want to see | Do NOT want to see |
|---|---|
| `verdict_replant_requested` / `kill_withheld_lesson_tool` — only if a kill fired at all | `false_assertion_kill` where the asserted value matches what YOU said |
| `show_problem_substitution_skipped` after asking for a different problem | `show_segment_card_completed_blocked` right after a `show_problem_substituted` |
| `auto_newpage_retitled_from_render` | a page title naming a different problem than the card on it |
| `board_contradiction` (review each by hand — advisory only) | any `<result>` or `<span` text in the transcript |

---

## 6. Dead-start telemetry (2 min, optional)

**6a.** Open the embed and close the tab WITHOUT tapping start. Then:

    ssh root@84.247.185.169 'cd /root/evelyn-tutor && node -e "…"'   # or just check the admin session list

Expect: **no new tutorsessions row**.

**6b.** Open it, tap start, close after ~5 seconds. Expect: a row that **has** debug events
(previously these were always empty — that is the whole point of the fix).

---

## The nine kill switches

All default ON. To disable any one, set it to `off` in the prod env and redeploy. ⚠️ **The var must be present in the env AT BUILD TIME** — the build inlines it; an absent var evaluates to `undefined` at runtime, which is ON. (This is how every existing `!== 'off'` flag already works; the gate confirmed the new nine match the proven-live R58 pattern exactly.)

    NEXT_PUBLIC_TUTOR_VERDICT_REPLANT_ON_KILL
    NEXT_PUBLIC_TUTOR_KILL_WITHHOLDS_ADVANCE
    NEXT_PUBLIC_TUTOR_SPOKEN_NUMBER_GUARDS
    NEXT_PUBLIC_TUTOR_BOARD_CONTRADICTION
    NEXT_PUBLIC_TUTOR_META_NARRATION_STRUCTURAL
    NEXT_PUBLIC_TUTOR_SUBSTITUTE_GATE
    NEXT_PUBLIC_TUTOR_PAGE_TITLE_FROM_RENDER
    NEXT_PUBLIC_TUTOR_TELEMETRY_SURVIVAL
    NEXT_PUBLIC_TUTOR_DEFER_SESSION_DOC

Tasks 1 and 2 (the two false kills) have **no** flag — they are bug fixes inside the existing
`NEXT_PUBLIC_TUTOR_FALSE_ASSERTION_KILL` guard, whose own kill switch still works.
