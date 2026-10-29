# GDI trial lesson — design (2026-10-28)

Product: tutor engine (`apps/tutor`), demo engine `evelyn-tutor-demo` :3009, partner row `gdi-demo`. Worktree `gdi-trial-lesson` off origin/main. Deploy with `deploy-tutor-demo.sh` only. Nothing here touches :3007 or :3008.

Background: `docs/whitelabel/gdi/test-lesson-analysis-2026-10-28.md` (what Josh asked for, options, pronunciation research), his lesson in `docs/whitelabel/gdi/samples/test-lesson-layout-and-requirements-2026-10-28.md`, his answers in `docs/whitelabel/gdi/reply-6-email.md`.

## Intent

GDI Communications (Nagoya) runs a 300-minute internal trial: four Japanese staff, each doing Josh's 25-minute lesson "Talking About Your Work and Recent Projects" one or more times. Josh judges it against the 10-row checklist in his document. If it convinces, the paid pilot follows (academy tenant, JA menus, per-company reports). The trial exists to prove three things Josh named: the level check visibly changes the lesson; the tutor teaches rather than chats; the learner can move explanation → conversation → pronunciation → conversation without losing context.

## Decisions already made (Praveen, 10-28)

- **Deadline: Friday 6 November 2026** — Josh's own trial link + tester guide sent by then (he was told "later next week"). Order of work follows from this: level + plan first (they are the checklist), pronunciation second; if the bake-off slips, ship with the honest fallback and add scoring during the trial.

- Trial runs on the demo engine with minted links. No academy tenant for the trial.
- Pronunciation: try Azure Pronunciation Assessment and Speechace on their free tiers, then pick one.
- Josh's answers: Japanese split by level as proposed; level check carries over between a tester's lessons; first pronunciation targets are "th", b/v, and longer words spoken as English rather than katakana-style; four testers on laptops/desktops with headphones; persona is our call; after each lesson Josh gets transcript, audio replay and the tutor's summary.

## Goals

1. One lesson plan that delivers Josh's seven parts in ~25 minutes, in the order and with the behaviour his document specifies, for all three levels.
2. A working level that is set ONCE from the three-question check, drives the rest of the lesson, and is remembered for that learner's next lesson.
3. Pronunciation practice that reports only what a speech-assessment service measured, and otherwise says so.
4. Four tester links, a tester guide, and a per-session replay link Josh can open.

## Non-goals

- Academy tenant, Japanese menus, per-company CSV (pilot scope).
- Pronunciation scoring during free conversation (later; Josh accepted "words and sentences").
- Changing the shared engine's behaviour for other tenants. Everything new is behind the partner row or a flag.
- A second lesson. Josh sent one; a second is a content task after this ships.

## Anti-goals (what would make this a failure even if it "works")

- The tutor narrates its own assessment ("you are a beginner") bluntly, or re-tests. Josh: "avoid announcing a definitive level", "only once".
- Three level variants read out in a row, or the beginner hears English-only explanations.
- The tutor claims it heard a sound it did not measure.
- The lesson ends at 12 minutes, or runs past 30 without the summary.
- Homepage-demo pacing copy ("show what great teaching feels like…") leaks into a paid-pilot trial.
- A tester's second lesson starts with the level check again.

## Constraints

- Live runs cost money and write prod rows; unit tests first, minimum live runs ([[feedback_live_test_budget]]). Budget for this build: ≈8 live runs on the demo engine (≈$15–20) plus the trial's own 300 minutes.
- No API spend for content or audits; sub-agents in-session ([[feedback_no_api_spend_for_work]]).
- Flags default ON (`!== 'off'`); tenant behaviour via the partner row, never a branch.
- Brain = Haiku 5.5 on the demo engine. The plan and prompt clauses must work on Haiku; no "add Sonnet" escape hatch without Praveen's say-so.
- Laptop :2710 is the prod tunnel; plan ingestion and pool changes are prod writes → Praveen's go-ahead per write.
- Tutor prompts stay generic: the pronunciation target list ("th", b/v, katakana) lives in the lesson plan / partner config, not in the system prompt ([[feedback_generic_prompts]]).

## The parts, as decided

### 1. Working level (engine)

- New session-state field `workingLevel: 'beginner' | 'intermediate' | 'advanced' | null`.
- New brain tool `set_working_level({level, evidence})`, callable at most once per session; a second call is rejected with a note. It is offered only when the embed claim or lesson plan enables it (`features.level_check` on the partner row for `gdi-demo`; default off elsewhere).
- Persistence: stored on the learner record for `(partner_id, student_id)`. On a new session with a stored level, the prompt tells the tutor the level is known, the level-check segment is skipped (plan advances past it), and the opener says in one line that it will continue at that level.
- Prompt effects when set (one clause, generic wording): language policy by level (beginner: explanations and corrections in Japanese, English only for target phrases; intermediate: English, corrections explained in Japanese; advanced: English, Japanese only on request), question difficulty, scaffold amount, and "teach only the variant marked for this level". The existing bilingual clause stays; the level clause refines it.
- Repeat lessons (my call): a fixed `student_id` today makes the tutor open as a returning learner, recall earlier sessions, and rotate examples already seen (`planContentSeen`). Josh will judge the SAME lesson several times per tester, so the plan gets metadata `fixedScript: true` (generic): for such plans the warm-resume recall and content rotation are suppressed, and the only carry-over is the level plus one line ("last time we worked at the intermediate level, so let's continue there").
- Soft announcement: the tutor says "I'd suggest we work at the intermediate level today" and moves on. No CEFR, no score.
- Kill switch `TUTOR_WORKING_LEVEL` (default on). With it off, the tool is not offered and the plan's level-check segment behaves like an ordinary conversation.

### 2. The lesson plan (content)

File `docs/whitelabel/gdi/plans/gdi-work-projects-v1.json`, id `gdi.trial.english.work-projects.v1`, subject `languages`, ingested into the demo engine's `LessonPlanModel` the same way the three demo plans were (Praveen's go-ahead for the write).

Segments (kinds from `lesson-plan/types.ts`), estimatedMinutes in brackets, total 25:

1. `hook` — overview (2). Welcome, the five bullets from Josh's Part 1 in plain words, "one-time level check next". `requiredPhrases` for the two grammar point names so the validator enforces they are named.
2. `misconception_check` — level check (3). The three questions as `teacherNote`; "no corrections here, one simple follow-up each"; ends with `set_working_level`. Skipped when the level is already known.
3. `concept` — topic introduction (3). `keyIdeas` carry all three variants labelled `[beginner]`, `[intermediate]`, `[advanced]`; `teacherNote`: teach only the labelled variant for the working level, then ask question 1 of that variant. Board shows only the chosen variant's examples (`show_table` with the two tenses).
4. `try_yourself` — present perfect through conversation (3.5). Open `responseFormat: free`; rubric = Acknowledge → Correct → Explain → Practice → Continue; "correct target-grammar and meaning errors, let the rest pass".
5. `try_yourself` — past simple through conversation (3.5). Same shape; includes the "time word → past simple" contrast.
6. `extension` — open conversation (5). Partner mode: learner may steer; the tutor answers the learner's questions about its own "work" in character (persona `intro` supplies the material); at most two corrections, each with a retry.
7. `try_yourself` — optional pronunciation (3). Offer the four options from Josh's Part 6. Target items for the word option come from the plan (`responsibilities`, `international`, `communicate`, `customers`, `developed`) chosen for "th", b/v and katakana-prone length; sentence option uses the lesson's two example sentences. Behaviour defined in §3. "Skip" advances.
8. `recap` — summary and feedback (2). Must include: the two grammar points with the learner's OWN sentences, one thing done well, one to improve, the one check question ("I have worked here for five years" vs "I worked here five years ago"), then close. No separate stored summary for 6 Nov (see §4); the spoken recap is the summary.

Embed claims for the trial links: `curriculum_module` = the plan id, `max_duration_minutes: 30` (hard cap, already proven on the demo links), NO `wrap_at_minutes` (my call: the `wrap_at_minutes` + `max_duration_minutes` pair switches on the homepage-demo pacing block and a 1–2-turn "wrap up NOW" directive that would override segment 8; pacing comes from the segments' `estimatedMinutes` and the recap segment instead), `tutor_languages ['en','ja']`, `input_mode voice`, fixed `student_id` per tester (`gdi-trial-<n>`), no `is_trial` (so the demo topic-choice path does not fire).

### 3. Pronunciation (engine + bake-off)

Bake-off first, then integration with the winner.

Bake-off (`scripts/tutor/voice-harness/pronunciation/`): a script that takes WAV clips + reference text and runs them through Azure (scripted mode, phoneme granularity, prosody on) and Speechace (Basic: word/sentence scoring), writing both JSONs side by side plus a one-page markdown comparison. Clips: recordings of the five target words and two sentences by a Japanese speaker (Praveen's human tester from 10-18 if the audio is on the server; otherwise Praveen records a katakana-style and a clear version himself) — eight to twelve clips. Picking criteria, in order: does it flag the "th" and b/v errors we planted; does it give word stress / syllable info usable for the katakana habit; latency on a 5-second clip; integration simplicity. Keys from Praveen's free-tier accounts in `.env.local` only; never committed.

Integration (vendor behind one interface `PronunciationAssessor { assess(clip, referenceText) → {overall, words[{word, score, errorType, phonemes[{ipa, score}]}], prosody?} }`):
- During segment 7, after the tutor models the item (TTS with `language:'en'` forced so kana in the same turn does not switch the voice), the client records the learner's next turn as one clip (the mic tap already exists in `useOpenAIRealtime` → `useAudioRecorder`) and POSTs it with the reference text to `/api/tutor/pronunciation/assess`. Server-side call to the vendor; clip ≤ 15 s; result returned to the client and injected into the brain turn as a `pronunciation_result` tool result.
- The brain picks one or two points, explains them (Japanese for beginners), asks for one repeat. The existing `pronunciation-claim` guard allows claims that cite a result and keeps blocking claims without one.
- Fallback: no key, vendor error, or clip too short → the tool result says `unavailable`; the tutor coaches stress and linking from the model and says it can only check the words. Josh's rule.
- Gates: env keys present AND `features.pronunciation` on the partner row (`gdi-demo` on). Kill switch `TUTOR_PRONUNCIATION_ASSESS` default on.
- Minutes/cost: the clip call is outside the brain loop; expected ≤ $0.10 per lesson.

### 4. Trial logistics

- Minute pool: `scripts/ops/partner-pool.sh set gdi-demo 300`, `session-max gdi-demo 30` (prod write → go-ahead).
- Links: `mint-demo-links.js` gains a `trial` lesson entry and `--testers 4` → four links with fixed student ids, `--ttl_hours 720` (30 days). Praveen tries one first; Josh gets his own link before the testers. Josh's and Praveen's links get a FRESH student id per mint (today's default suffix) so the level check can be re-seen on request; only the four tester links use fixed ids (`--testers 4`).
- Tester guide: update `docs/whitelabel/gdi/TESTER-GUIDE.md` for this lesson (25 min, the level check, the pronunciation choice, "say 「わかりません」").
- Reports for Josh: after each session, mint a replay token (`replay-token.ts`, partner secret, 30-day exp) → `/tutor-portal/replay?token=…` (audio + transcript + PDF export). A tiny script `docs/whitelabel/gdi/demo/mint-replay-links.js` lists the partner's sessions since a date and prints a link per session. The tutor's summary for Josh = the spoken recap (segment 8), which is in the transcript, audio and PDF. `close_session_notes` today carries only `assignLoIds`/`reason`/`nextTimeIntent` and the PDF renders transcript + board only, so a stored structured summary is NOT built for 6 Nov (my call: Josh said transcript + audio + summary is "more than enough for now"); a `summary` argument on `close_session_notes` rendered as a replay/PDF section is the first follow-up during the trial.
- Persona: my call — **Ryota** for all levels (already tuned bilingual; Josh praised the voices). Praveen can swap the voice id before minting; the plan does not depend on it.

## Left to the builder

- Exact prompt wording of the level clause and how the three variants are labelled in `keyIdeas` (must pass the plan validator).
- Whether the level-check skip is "plan advances past segment 2" or "segment 2 teacherNote says skip when level known"; pick what the validator and `advance_lesson` support cleanly.
- The clip boundary for the pronunciation turn (use the existing turn.end from Ink or a fixed max of 8 s after the model, whichever first).
- Harness file layout; reuse `audio-util.ts` for WAV/PCM.
- Unit tests: tool once-only, level persistence and skip, prompt clause by level, assessor fallback, plan validation, mint script claims. `npm run test:changed` says when `test:all` is needed.

## Acceptance (maps to Josh's checklist)

Live on the demo engine, one run per level with a Japanese-speaking tester or Praveen reading the ChatGPT prompts: overview before any question; three questions then one soft level line; only one concept variant spoken; a planted grammar error corrected with a retry; the learner's question to the tutor answered in character; the pronunciation offer with a measured comment on a planted "th" error; a summary quoting the learner's sentence; total 20–27 minutes; a second session for the same tester id skips the check, says so in one line, and does not recall the previous session's content or rotate the examples.
