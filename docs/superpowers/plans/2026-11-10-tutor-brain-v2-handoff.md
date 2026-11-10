# Tutor brain v2 — handoff, morning of 2026-11-10

Branch `tutor-fixes` in worktree `/Users/luke/Dev/evelynlearning/.claude/worktrees/tutor-fixes`.
Committed, NOT pushed, NOT deployed. Production is unchanged apart from the two bug fixes shipped
on 11-09 (:3007 build `pPfJAQNyqvqua1JJvsa0d`).

Read with: `docs/superpowers/specs/2026-11-09-tutor-brain-v2-design.md` (design),
`docs/superpowers/specs/2026-11-09-tutor-brain-v2-first-comparison.md` (all ten reviews).

## What exists

| Piece | Where | State |
|---|---|---|
| Turn engine | `apps/tutor/src/lib/tutor/v2/` | Works. Constitution, plan as a map, facts block, board record, session note, goal status, gap tracker, end-lesson; one model call per turn; medium thinking effort; history keeps tool calls and outcomes; cancels when the client goes away. |
| Turn route | `apps/tutor/src/app/api/tutor/brain-v2/turn/route.ts` | Works. Stateless; the browser holds the state. |
| Text client | `apps/tutor/src/app/tutor/components/v2/TutorClientV2.tsx` + `useV2Turns.ts` | Works in the browser (real whiteboard, transcript, session save, hard time stop). |
| Voice client | `apps/tutor/src/app/tutor/components/v2/TutorVoiceV2.tsx` | FIRST CUT. Runs end to end in the browser with a silent mic and typed turns. Never tried with a real microphone. |
| Selector | partner row `brainVersion` (all `v1`) + token claim `brain_version: "v2"` honoured only with `NEXT_PUBLIC_TUTOR_BRAIN_V2_CLAIM=on` | Off everywhere. |
| Replay harness | `apps/tutor/scripts/tutor/replay-harness/` | Three scripted students, browser driver, offline v2 runner, scorecard, rubrics, review prep. `REVIEW.md` says how to run a comparison. |

Checks: `npm run test:brain-v2` 63, `npm run test:replay-harness` 25, `tsc` clean, production build
passes, `test:all` 444/446 (the two known baseline failures). `test:all` was last run before the
final revert commit; the revert touched only v2 files and their own suite.

## What the reviews say

Blind reviewers, same model (Haiku 5.5) in both engines.

| Student | v1 | v2 |
|---|---|---|
| Competent adult (your session) | 2–3 | 7–8 |
| Struggling 17-year-old | 3–4 | 5.5–7 |
| Grade 6 | 2–3 | 6–8 |

- Like for like in the real browser client: v2 7–8 / 6–7 / 7–8 against v1 2–3 / 3–4 / 2–3.
- What moved v2: removing the instruction layer; thinking effort low → medium; the gap tracker.
- What did not: rewording the constitution; Sonnet 5 at low effort; three further changes tried
  overnight (reverted — see reviews 7–10).
- v2 is not yet a good tutor for the weaker students. Its known faults are listed at the end of the
  comparison document.

## Decisions I need from you

1. **Try the voice client at a microphone.** This is the largest unknown. Start the server from
   `apps/tutor` in the worktree with `NEXT_PUBLIC_TUTOR_BRAIN_V2_CLAIM=on npx next dev --turbopack -p 3019`
   and ask me for a link. Things to watch: does it hear itself (echo), does talking over it stop it,
   is the 1.2–2.0 s before its first words acceptable with the chime.
2. **Latency against quality.** Medium effort is what made v2 good for weaker students and costs
   about half a second. Keep medium everywhere, or low for voice only?
3. **Push the branch?** It holds a night of work on one laptop. Pushing a branch is not a deploy;
   I have not done it because you asked only for commits.
4. **:3009.** The two 11-09 bug fixes are not on the GDI preview. Deploy there, or wait for the trial?
5. **A leaked key.** One of my commands printed the DeepSeek fallback key from `.env.local` into
   this session's log. Rotate it if that log is shared.

## What I would do next

1. Fix whatever the microphone test finds; then carry over from the old client, in this order:
   barge-in gating (the perception socket), mic re-acquire, session recording, captions.
2. The two v2 faults every reviewer raised: announcing the method with the problem, and telling
   after one miss. Wording did not move them; next thing to try is the plan map itself (the
   material labels and hints the tutor reads) and what a problem's tool result says.
3. Real whiteboard outcomes fed back to the tutor (today the server's own record decides).
4. Resume from a checkpoint, the agenda rail, the first-party `/tutor` page.
5. GAC (text, homework) and GDI (fixed-script) fixtures, baselined with their own tools, before
   either is considered for v2.
6. Then your sessions on :3009, and cutover partner by partner.

## Housekeeping

- Local dev server: stopped. A local server starts the app's scheduled jobs against the prod
  database, so stop it after use.
- Replay sessions wrote rows to prod `tutorsessions` under partner `crimsora` with student ids
  starting `replay-` (22 rows, counted). Offline runs wrote nothing.
- Run artefacts are in `apps/tutor/artifacts/replay-harness/` (not in git).
