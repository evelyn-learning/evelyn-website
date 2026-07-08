# Crimsora / Tutor session-quality fixes — work plan (2026-07-08)

Grounded from Vanshika's first real AP Statistics session (`portal-9549e3af`, 25.5 min, 65 turns, on Sonnet 4.6) + the user's session (`portal-aa2444c9`) + Liah's direct session (`session-1783483496266`, Sonnet 5). Each **Package** is independently pickable in a fresh session; items inside can be done together. Repos: **engine** = `/Users/luke/Dev/evelynlearning`, **academy/crimsora** = `/Users/luke/Dev/academy`. Deploy: engine `./deploy-to-production.sh` (builds locally, ships, restarts evelyn-website); academy `./deploy-crimsora.sh`. READ `project_tutor_round7_architecture.md` (guardrails) before touching tutor files.

Also PENDING, uncommitted-to-deploy: engine commit for `max_tokens` bump (1500→2000, rescue 250→350) is COMMITTED on main but **not deployed** — fold its deploy into whichever engine package ships first.

---

## INFO (answered — no fix, context for the packages)

- **Prereq diagnostic — taken & stored.** Vanshika took the AP Stats prereq diagnostic 2026-07-08 02:22:23 (≈1 min before the session). `Enrollment.diagnostic.prereqReadiness` in the crimsora DB: **overallPct 63%**; weak on *Algebra: substituting into formulas*, *Reading and interpreting tables*, *Basic probability intuition*; strong on arithmetic, solving equations, reading graphs, averaging, rounding. The academy composes `readiness_note` from this and rides it on the embed token (`readinessNoteFor` → `buildEmbedConfig`), and the engine injects it into `<student_context_transient>`. So the scaffolding data flowed; verify at runtime the note was actually rendered into the session's system prompt (grep the session's brain request or add a debug log).
- **Social context — NOT captured.** She volunteered "rising senior, took Calc AB, starting AP Stats." Engine `socialmemories`/`studentprofiles` for her `engineStudentId` (`f099e12f-…`) = **0 docs**. Social memory is portal-owned (academy `SocialMemory` model); the engine extracts threads (`src/lib/tutor/portal/extract-social-threads.ts`) and the portal is meant to persist them. → becomes **Package E**: verify/repair social-memory capture on the portal path.

---

## Package A — Observability & admin (`/admin/tutor-sessions`)

> **STATUS (2026-07-08): DEPLOYED.** A1–A4 on engine branch `crimsora-session-quality-a` (commit `9571b6c`, stacked on Package B's branch — one merge ships both). A1 root cause: brain-stream usage was debug-log-only, never surfaced (new `onBrainUsage` → embed + direct page; live-verified: in=696k/out=1.1k/$0.28 recorded). A2: TutorSession now stores `studentId`; admin resolves missing names from named sibling sessions; 30-min sweep collapses stale empty actives. A3: PDF button on detail page (demos exporter ported). A4: AudioContext is the replay's master clock (fixes drift + pause-jump). Also on the branch: `CARTESIA_VOICE_SUBSTITUTIONS` env for shared test keys (`1dca009`).

- **A1 — Telemetry gap (token/cost/topics not recorded for embed sessions).** Vanshika's 25-min session record has `totalInputTokens=0, totalOutputTokens=0, estimatedCost=$0, topicsCovered=[], weakTopics=[]`. Root: the claude-brain **embed** path doesn't report usage to the session record.
  - Files: `src/app/api/tutor/session-usage/route.ts` (usage writer), `src/models/TutorSession.ts` (fields), the brain stream route `src/app/api/tutor/brain/stream/route.ts` (has `response.usage` per turn — `inputTokens/outputTokens/cacheRead/cacheCreation`, seen live), and the client `VoiceTutorRealtime.tsx` (does it POST usage to session-usage for portal sessions?).
  - Fix: accumulate per-turn `usage` (already returned in the `done` SSE event) into the TutorSession (`totalInputTokens/OutputTokens`, `estimatedCost` from model rates, `topicsCovered` from `lessonProgress.completedSegmentIds`→topic, `weakTopics` from judge/gaps). Directly enables tracking the Sonnet 5 cost bump.

- **A2 — Session shows "Anonymous"; the named record has 0 msgs (Image #7).** A reload/double-start creates two portal sessions ~10s apart: the first gets `studentName` but stays empty (`tx=0, active`), the second runs fully (`tx=65`) but has `studentName=undefined`. Root: name isn't carried onto the session that actually runs, and abandoned empty sessions aren't collapsed.
  - Fix options: (a) always set `studentName` from the embed token on every TutorSession create (embed token carries `student_name`); (b) in the admin list, fall back to resolving the name by `studentId`/partner when `studentName` is empty; (c) collapse `active`/`tx=0` sessions older than N min into `abandoned` and hide from the default view. Files: session-create path in the engine that writes the TutorSession from the embed, `src/app/admin/tutor-sessions/page.tsx`.

- **A3 — Downloadable session PDF on `/admin/tutor-sessions`.** `/admin/demos` session explorer already has PDF export; port it. Reuse `jsPDF` + the exported `sanitize()` from academy's `src/lib/utils/export/pdf-course-export.ts` pattern (or the demos exporter in the engine). Files: `src/app/admin/tutor-sessions/[sessionId]/page.tsx`, the demos export component (grep `/admin/demos` PDF).

- **A4 — Replay progress bar / sync + "Clarity vs custom" decision (Images #11, #12).** At 12:57/25:31 the bar isn't at ~50% and WB/audio drift; pausing jumps the position. Root: the replay timeline maps events by index/spacing, not by real timestamps, so the playhead and the WB/audio don't share one clock.
  - Fix: drive the replay off a single monotonic clock = real `startedAt`-relative timestamps on every transcript/whiteboard/audio event; position the playhead and paint WB strictly by `elapsedMs`. Files: `src/app/admin/tutor-sessions/[sessionId]/` replay component (grep the timeline/scrubber).
  - **Clarity vs custom (recommendation):** Microsoft Clarity can't see inside the tutor iframe (cross-origin) — it already fails to capture engine interactions on Academy for exactly this reason. Our replay reconstructs from the engine's own event log (transcript + whiteboard commands + audio), which Clarity fundamentally cannot do for the iframe. **Keep and fix the custom replay** for tutor sessions; keep Clarity for the marketing/Academy shell only. Don't invest in Clarity-for-tutor. (Document this decision; no build beyond A4's sync fix.)

---

## Package B — Whiteboard rendering & board-anchored teaching

> **STATUS (2026-07-08): DEPLOYED.** B1–B3 on engine branch `crimsora-session-quality-b` (commit `6922f7f`, atop deployed Package C). B1 root cause recovered from the prod session record: the brain sketched the two-way table via `show_geometry` with ONE unlabeled point — now rejected by a degenerate-content guard (+ docstring steer to show_table); render-harness fixtures `session-quality-b1` 5/5, stats regression 14/14. B2 extends the board-anchored rule (objective card, definition card, question-target mark). B3 makes canvas view-follow order-aware (last visual event of the batch owns the view). Deploy = merge to main + `./deploy-to-production.sh`.

- **B1 — Two-way table render fails intermittently (Image #8 = titled box with a lone blue dot; Image #9 = correct table).** The `showStats`/two-way-table catalog render sometimes produces an empty figure with a single point.
  - Files: `src/lib/tutor/whiteboard/catalog.ts`, `src/lib/tutor/whiteboard/doodler.ts`, `src/app/tutor/components/whiteboard/CellContent.tsx`, `CatalogDispatch.tsx`. Reproduce via the render-harness (`/tutor/render-harness`, `processToolCall` — see `project_tutor_render_audit_harness`) with the exact two-way-table tool call; find why the table body drops to a single dot (likely a data-shape/empty-rows path or a figure-multiplication/evolve-in-place collision).

- **B2 — Write key content on the board when the tutor speaks it.** The tutor's spoken commentary isn't visible unless the caption drawer is open, so anything load-bearing must be written. Two concrete misses this session: (i) when asked about coverage, the tutor spoke the session objective but wrote nothing; (ii) it explained a NEW concept "conditional distributions" verbally with no board definition/emphasis.
  - Fix (prompt + tool policy): extend the board-anchored-speech rules (`project_tutor_board_anchored_speech`, flag `TUTOR_BOARD_ANCHORED_SPEECH`) so that: session objective → write a short objective card; every NEW concept name → write a titled definition card with emphasis; a posed question that names a value/target → mark it on the board. Files: `src/lib/tutor/ai/system-prompt-builder.ts` (board-anchored clause), whiteboard tool docstrings.

- **B3 — Wrong page shown to the student.** Vanshika: *"I'm not sure I'm seeing the same example… I'm seeing an example of students commuting."* The board displayed a stale/other page while the tutor referenced a different figure. Root: per-turn target/page resolution served the wrong page.
  - Files: board-map + target resolution (`project_tutor_board_map_design`, `summary.ts`, `resolveTarget`), page grouping (`project_tutor_page_grouping_design`). Fix: when the tutor references a specific figure/example, force the board to that figure's page (bring-to-front), and reconcile the brain's advisory `new_page`/page number with the actual displayed page.

---

## Package C — Speech / pedagogy coherence (mostly prompt + one formatting fix)

> **STATUS (2026-07-08): DEPLOYED.** All of C1–C6 merged to main (commit `01b1a9c`) and shipped via `./deploy-to-production.sh`, which also delivered the pending `max_tokens` bump (`390a4e7`). Verified pre-deploy (tsc, unit suites incl. new `test:sentence-spacing`, live 3-turn pedagogy-harness session: no glued sentences, question-last turns) and post-deploy (site 200, `evelyn-website` online).

- **C1 — Missing space after full stop (formatting).** Examples: `"independent.Let's build"`, `"one step at a time.Take a look"`, `"Exactly right.Ten out of fifty"`, `"proportions.Proportions are"`. Sentences are concatenated without a separating space — hurts caption readability and can affect TTS phrasing.
  - Files: sentence assembly in `src/lib/tutor/voice/claude-brain.ts` and/or `caption-sync.ts` / `tts-pronunciation.ts`. Fix: guarantee a single space when joining sentences/segments (normalize `/([.!?])(\p{L})/u` → `$1 $2` at the assembly boundary, being careful not to touch decimals/KaTeX). Add a unit test with the examples above.

- **C2 — Socratic questions don't stand out.** With a question at nearly every turn (Socratic), the ask is buried mid-paragraph so the student misses it ("I'm unsure what value you're asking me to find"). Fix (prompt + board): the turn's actual question should be the LAST sentence and visually/structurally distinct; where it names a value to find, mark it on the board (ties to B2). Files: `system-prompt-builder.ts`.

- **C3 — Only academic questions; no comprehension/meta checks.** Add periodic meta-questions after explaining a concept: "Want me to explain that another way?" / "Did that click, or should we do one more example?" — not just "compute X". Prompt change in `system-prompt-builder.ts` (pedagogy section). Keep it occasional, not every turn.

- **C4 — Affirmation-first clause mis-references the topic.** `portal-aa2444c9` turn 8: student said "Zip code would be categorical," tutor opened "Good thinking on **proportions**." The affirmation praised an unrelated topic. Root: the affirmation-first clause (from board-anchored-speech / affirmation-first work) generates topic praise decoupled from what the student actually said. Fix: the opening affirmation must reference the student's actual last answer (or be generic — "Good thinking" — when uncertain), never a pre-baked topic. Files: `system-prompt-builder.ts` (affirmation-first clause) + possibly the brain prompt.

- **C5 — Double sign-off (Image #13).** Tutor: full farewell → student "Awesome, thanks." → tutor repeats a second full farewell. Fix: once a farewell/sign-off is delivered, subsequent low-content student turns ("thanks") should get a minimal ack or silence, not another sign-off. Files: `src/lib/tutor/voice/transcript-filters.ts` (sign-off classifier — `project_voice_tutor_issues` mentions a sign-off classifier), `system-prompt-builder.ts`.

- **C6 — Repeated opener across sessions (Liah reused "jar of counting beans").** The opener-recency loop (`last_opener` on the embed token → `renderTransientContextBlock`, `project_tutor_pedagogy_opener_calibration`) is meant to prevent this. Liah's was a **direct evelynlearning /tutor session** (`source: tutor`, Ms. Vasquez), not a portal embed — so `last_opener` may only be wired for the portal path, not the standalone `/tutor` page, or the persona's opener is effectively fixed. Investigate: does the direct `/tutor` path persist + resend `last_opener`? Files: `src/lib/tutor/student-profile/transient-context.ts`, opener-record capture/persistence, `src/app/tutor/page.tsx`. Fix so opener recency applies to direct sessions too (or the persona rotates openers).

---

> **PACKAGE E STATUS (2026-07-08): NOT BROKEN — hardened.** Vanshika's volunteered context WAS captured (2 threads + lastOpener in crimsora `socialmemories`, one minute after her session). The "engine socialmemories=0" premise checked the wrong DB — threads are portal-owned by design. Shipped: observability on the academy's `recordSessionEnded` emit (academy commit `10a5189`). Known gap: tab close without End/Pause never fires session_ended → no extraction for that session (Phase-2 candidate: reconcile from the engine's saved transcript).
>
> **PACKAGE D STATUS (2026-07-08): DONE** (academy commit `10a5189`): hero-session.png captured from Vanshika's REAL board (two-way table + conditional-frequency equations) via the new dev-only engine route `/tutor/board-preview` (engine commit `9afdc5f`).

## Package D — Website hero image (standalone, academy-facing)

- **D1 — Produce a real-looking live-session hero render.** Target file: `academy/apps/web/public/screenshots/hero-session.png` (HeroFrame already probes this path, dual-path fix shipped). Two approaches:
  1. Curate from `/Users/luke/Dev/evelynlearning/sketch-review` — pick the best existing render, then dress it to look captured mid-session (browser chrome frame, caption ticker, a student-mark, teacher avatar corner).
  2. Drive a Playwright session against a whiteboard-rich moment and screenshot at 1440px (hide devtools/bookmarks). The render-harness (`/tutor/render-harness`) can paint a rich board without a live mic.
  - Then drop into `academy/apps/web/public/screenshots/hero-session.png` and `./deploy-crimsora.sh` (or scp the static asset — public/ is served at runtime). Prefer a clean two-way-table or conditional-distribution board (matches the AP Stats demo).

---

## Package E — Social-memory capture on the portal path (investigate → fix)

- Vanshika volunteered grade/background; engine `socialmemories` = 0. Determine where portal social memory should persist: academy `SocialMemory` model (`project_learning_gaps_v1`/social-memory), fed by the engine's `extract-social-threads.ts` result flowing back through the portal API (`session-result`/`social-memory` endpoints). Check: (a) does the engine extract threads for portal sessions? (b) does academy receive + store them? (c) is extraction gated behind a flag that's off in prod? Files: engine `src/lib/tutor/portal/extract-social-threads.ts` + `session-result.ts`; academy `SocialMemoryService` + `/api/.../social-memory`. Fix the broken link so volunteered context persists and rides the next session's token (`social_memory` field, already consumed by `renderTransientContextBlock`).

---

## Suggested sequencing (fresh sessions)

1. **Session 1 — Package C** (prompt + one formatting fix; highest pedagogy ROI, low risk, one engine deploy). Fold in the pending `max_tokens` deploy.
2. **Session 2 — Package B** (whiteboard render + board-anchored writing; uses the render-harness; one engine deploy).
3. **Session 3 — Package A** (telemetry + admin + replay; engine-side, includes the "keep custom replay" decision).
4. **Session 4 — Package E** (social memory; cross-repo).
5. **Session 5 — Package D** (hero image; academy-only, no risk).

Each package is self-contained; do them in any order. Verify tutor changes with a real or render-harness-driven session before claiming fixed (`verify` skill / `/tutor/render-harness`).
