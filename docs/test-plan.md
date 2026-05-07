# AI Tutor — QA Test Plan

A small set of seeded `test-*` lessons + checklists for systematically exercising every aspect of the AI tutor in browser sessions. Five lessons cover all four grade bands and most rare-tool paths.

## Known limitations (read first)

- **Whisper-of-tutor mistranscription:** the OpenAI Realtime engine re-feeds the tutor's own TTS audio into Whisper to populate the tutor transcript pane. Whisper sometimes drops words, breaks sentences, or transcribes around equations (e.g. "y = k/x" rendering as "in k divided by x1 moment"). The CHAT BUBBLE text is the source-of-truth for what the brain emitted; the audio-derived transcript is best-effort. When you see a garbled tutor transcript, compare against the chat bubble before filing a bug.

## Run order after fixes (2026-05-07)

After the latest round of fixes, retest in this order — each lesson exercises a distinct fix:

1. **Lesson 1 (K-2):** verify Bug 1 (`[humor] active=light`, ⋯ menu hides medium + heavy) and Bug 2 (both place_value piles render in the same turn — no dedup-drop on different params) and Bug 3 (no false-empty judge KILL).
2. **Lesson 2 (G5):** verify Bug 5 (no duplicate "Human Impact" pages), Bug 4 (single Skip click advances to try-1, no double-click needed), Bug 7 (`[CURRENT PAGE]` markers in `<whiteboard_state>`; brain stops referencing items on previous pages without scrolling first), Bug 8 (cycle diagram description text fully visible — "Decomposers" not "ecomposers"). Also re-confirm `[humor] active=heavy` after setting "Very funny" on `/tutor/settings`.
3. **Lesson 3 (G7 math):** smoke check — no specific fixes target it, but confirm paceBias chips + generate_problem flow still work.
4. **Lesson 4 (HS bio):** verify Bug 6 (no double-stat hook — single corrected version, not "ten times" + "sixteen times" concatenated). The brain receives a "speech was DELIVERED IN FULL — do not repeat" hint on structural retries when the prior attempt's speech wasn't kill-bridged.
5. **Lesson 5 (G7 SS):** smoke check — no specific fixes target it.

## Prereqs

- Dev server: `npm run dev` (defaults to port 3001).
- Tail server log: `tail -f serverlog_*.txt | grep -E '\[(humor|pacing|image-search|show_labeled_image|brain\.stream)\]'`
- Open the tutor at <http://localhost:3001/tutor>.
- The tutor page does NOT take a `?lessonPlanId=` URL param (verified at `src/app/tutor/page.tsx:115-131` — only `?engine=` and `?tts=` are wired). To open a test plan: pick the matching subject + level + topic in the setup pickers, then choose the `[TEST] …` plan from the dropdown. The `PlanSearchBar` ("Find a lesson") at `src/app/tutor/page.tsx:1095` also accepts the title — typing "TEST" surfaces all five.
- Settings page: <http://localhost:3001/tutor/settings> (Stage 4 humor preference UI; `src/app/tutor/settings/page.tsx:31-57`).

## Plan IDs and pickers

| # | Plan id | Title | Subject → Level → Topic in picker |
|---|---|---|---|
| 1 | `evelyn.test.k2.math.comparing-numbers.v1` | [TEST] K-2 Math — Comparing Numbers (>, <, =) | Mathematics → Elementary (K-2) → Place Value |
| 2 | `evelyn.test.g5.science.carbon-cycle.v1` | [TEST] G5 Science — The Carbon Cycle | Science → Elementary (3-5) → Ecosystems |
| 3 | `evelyn.test.g7.math.direct-inverse-variation.v1` | [TEST] G7 Math — Direct and Inverse Variation | Mathematics → Middle School (6-8) → Ratios & Proportions |
| 4 | `evelyn.test.hs.bio.sex-linked-pedigree.v1` | [TEST] HS Biology — Sex-Linked Inheritance and Pedigree Analysis | Science → High School (9-10 or 11-12) → Genetics |
| 5 | `evelyn.test.g7.ss.apollo-missions.v1` | [TEST] G7 Social Studies — The Apollo Missions | Social Studies → Middle School (6-8) → US History (1877-Present) |

## Reference: pedagogy controls (file:line)

- Grade band → profile: `src/lib/tutor/pedagogy/grade-profile.ts:59-132`. K-2 has `humorCeiling: 'light'`, sentence target 8 words; 3-5 cap medium; 6-8 cap medium; 9-12 cap heavy.
- Humor block builder: `src/lib/tutor/pedagogy/humor.ts:96-244`. The brain prompt receives `<humor level="off|light|medium|heavy">` per session.
- Humor resolver: `src/lib/tutor/pedagogy/humor.ts:74-94`. Precedence: sessionOverride → preference → gradeDefault, then min-clamp to partnerCap. Band ceiling is intentionally NOT enforced here.
- Analogies (always on, even at humor=off): `src/lib/tutor/pedagogy/analogies.ts:22-62`.
- Voice cadence: `src/lib/tutor/pedagogy/voice-cadence.ts:11-59`.
- Settings page (band-agnostic): `src/app/tutor/settings/page.tsx:31-57` shows Default/Serious/A little funny/Pretty funny/Very funny.
- In-session ⋯ menu (BAND-CAPPED): `src/app/tutor/page.tsx:1500-1543`. K-2 hides medium and heavy; 3-5 hides heavy; 6-8 shows all.
- Skip ahead / I'm stuck chips: `src/app/tutor/components/TranscriptView.tsx:430-451`.
- Pacing-cue suppression on button click: `src/app/tutor/components/VoiceTutorRealtime.tsx:3756-3782` — `[pacing] student-cue suppressed (explicit button click)`.
- Image-search interceptor (server-side): `src/app/api/tutor/brain/stream/route.ts:368-438`. Logs `[show_labeled_image] resolved query=… → unsplash|pixabay|pexels` (`:415-418`) on success, `… MISS` (`:386`) on no-result drop, `… URL precheck FAILED, dropping` (`:428`) on legacy-src failure.
- Humor-active diagnostic line: `src/app/api/tutor/brain/stream/route.ts:255-266` → `[humor] active=heavy`.

---

## Lesson 1 — `[TEST] K-2 Math — Comparing Numbers (>, <, =)`

**Plan id:** `evelyn.test.k2.math.comparing-numbers.v1`
**Open:** Mathematics → Elementary (K-2) → Place Value → pick the [TEST] plan.

**Test focus:** K-2 grade profile (short Fry-100 sentences, 2.0× pacing), in-session ⋯ menu band cap (medium / heavy hidden), early-math visual primitives, scribble on a place-value pair.

### Setup

- [ ] Visit `/tutor/settings` first and clear humor (pick "Use default") so the lesson runs at the K-2 default ('light').
- [ ] Open server-log tail in another terminal.

### Behaviors to verify

- [ ] Server log shows `[humor] active=light` on the first brain turn (K-2 default; band cap = light).
- [ ] In-session ⋯ menu shows ONLY: Default / Serious / A little funny. **Pretty funny and Very funny must be hidden.**
- [ ] Brain emits `show_early_math` at least once (kind: `place_value`, `ten_frame`, or `base-10`). Look for the labelled tens-rods + ones blocks to render.
- [ ] Brain emits `show_number_line` for ordering (e.g., 17, 24, 31).
- [ ] Brain emits `highlight` at least once with the < > = symbols.
- [ ] Sentences feel SHORT (≤ ~14 words). Excessive long-form prose is a regression.
- [ ] On the misconception segment, the brain corrects with concrete blocks (not abstract digit reasoning) — that's the K-2 register working.
- [ ] At end of session, click "Save PDF" / "Export" — generated PDF contains all rendered tools (number line, place-value blocks, highlight cards). PDF export source: `src/lib/utils/export/pdf-course-export.ts`.

### Per-lesson failure modes

- "Pretty funny" / "Very funny" appear in ⋯ menu → band-cap regression at `src/app/tutor/page.tsx:1510-1520`.
- Sentences too long → grade-profile not applied (check `[grade_profile band="K-2"]` in transcribed system prompt; usually means `selectedLevel` didn't reach the prompt builder).
- `[humor] active=UNKNOWN` → system-prompt builder didn't include `<humor level=…>`. Check `src/lib/tutor/ai/system-prompt-builder.ts:1117-1123`.

---

## Lesson 2 — `[TEST] G5 Science — The Carbon Cycle`

**Plan id:** `evelyn.test.g5.science.carbon-cycle.v1`
**Open:** Science → Elementary (3-5) → Ecosystems → pick the [TEST] plan.

**Test focus:** Live image-search resolution (Unsplash → Pixabay → Pexels), `show_cycle_diagram`, `tutor_scribble` on a cycle stage, multi-page navigation, HEAVY humor with a named character.

### Setup

- [ ] Visit `/tutor/settings` and pick **"Very funny"** (heavy). 3-5 caps the in-session menu at "A little funny" but the settings page is band-agnostic and the resolver passes the explicit preference through. Confirm in the settings page footer: "Saved on this device."
- [ ] Confirm Unsplash / Pixabay / Pexels API keys are set in env (otherwise the chain falls through to MISS on every query).

### Behaviors to verify

- [ ] Server log shows `[humor] active=heavy` on the first brain turn (3-5 default is light; the Very funny preference overrides).
- [ ] Brain reaches for a NAMED CHARACTER ("Carla the Carbon atom" or similar) in turn 1 or 2 — the heavy-humor licensing requires it (see `src/lib/tutor/pedagogy/humor.ts:163-184`).
- [ ] Brain emits `show_labeled_image` with `query: "trees forest sunlight"` (or similar). Server log shows `[show_labeled_image] resolved query="…" → unsplash` (or pixabay/pexels). Image renders without callouts (interceptor strips them on the query path; `src/app/api/tutor/brain/stream/route.ts:403-414`).
- [ ] At least one query MISS expected across the lesson (the smokestack one if the providers don't carry it). Look for `[show_labeled_image] image-search MISS for query="…", dropping tool call` — confirm the brain narrates anyway and doesn't get stuck.
- [ ] Brain emits `show_cycle_diagram` for the four pools (Atmosphere → Plants → Animals → Soil/Ocean → back to Atmosphere).
- [ ] Brain emits `tutor_scribble` on a cycle stage (e.g., `target: "stage-atmosphere"` or natural-language variant). Look for NO `[VoiceTutor] scribble-reject (silent drop)` lines in console — that means resolver matched.
- [ ] Brain emits `new_page("Human Impact")` then later `tutor_scroll_whiteboard` back to the cycle diagram. Look for `[VoiceTutor] scrollTo-page-title-match: target="…" → page "…" (page N)` in browser console.
- [ ] PDF export at end-of-session contains the cycle diagram, the resolved photos, and any scribble overlays.

### Per-lesson failure modes

- All `[show_labeled_image]` lines are MISS → check provider keys; check `searchImage` at `src/lib/tutor/image-search/index.ts:68-107`.
- Resolved image but visible callouts → query-path callout strip regressed (`route.ts:413`).
- No named character at heavy → either humor=heavy didn't reach the prompt or the heavy block licensing was bypassed.
- Scribble silently dropped → `target` didn't match any registered feature; widen the lesson's wording ("the atmosphere stage") or call `list_whiteboard_features`.

---

## Lesson 3 — `[TEST] G7 Math — Direct and Inverse Variation`

**Plan id:** `evelyn.test.g7.math.direct-inverse-variation.v1`
**Open:** Mathematics → Middle School (6-8) → Ratios & Proportions → pick the [TEST] plan.

**Test focus:** `show_equation` with arithmetic that exercises Wolfram numeric validation, `show_function_graph`, `show_solved_example`, `generate_problem` flow, paceBias chips (Skip / I'm stuck / Slow down / Speed up).

### Setup

- [ ] Visit `/tutor/settings` and pick "A little funny" (light) so humor doesn't dominate the test signal.

### Behaviors to verify

- [ ] Server log shows `[humor] active=light` on first turn.
- [ ] Brain emits `show_equation` for `y = kx`, `k = y/x`, `y = k/x`. The numeric substitutions `k = 12/3 = 4` are simple enough that the Wolfram validator should pass cleanly — no console warning about validation errors.
- [ ] Brain emits `show_function_graph` for the y=kx straight line and again for the y=k/x hyperbola.
- [ ] Brain emits `show_table` for value pairs.
- [ ] Brain emits `show_solved_example` (boxed problem + steps + answer).
- [ ] On the worked example (try-1 follow-up), say "another like that". Brain MUST emit `generate_problem({ difficulty: "same", anchorProblem: "240 miles on 8 gallons …", anchorAnswer: "360" })`. Server log shows `[brain.stream:generate_problem] telemetry: {…}` (`route.ts:171`). The next `show_problem` quotes the returned `canonicalText` verbatim.
- [ ] Click **Skip ahead** chip mid-segment. Server log: `[pacing] student-cue suppressed (explicit button click) turn=…`. Tutor advances with brief acknowledgment — NO 3-choice "harder / same / different topic" question.
- [ ] Click **I'm stuck**. Tutor walks through Socratically: ONE first sub-question, no answer reveal, no premature "Exactly" affirmation.
- [ ] Open the ⋯ menu, click **Slow down**. Badge near the menu shows `Slower ×1` and flashes briefly. paceBias state updates per `src/app/tutor/page.tsx:1418-1502`.
- [ ] Click **Speed up** twice — badge transitions to `Faster ×1`. (Slow down −1 + Speed up +1 = 0; +1 = Faster ×1.)
- [ ] PDF export contains every equation, graph, table, solved-example, and any generated problem cards.

### Per-lesson failure modes

- `generate_problem` not called when student asks "another" → brain dropped the adaptive-pacing instruction. Check `src/lib/tutor/voice/claude-brain.ts:462-588` for the pacing block construction.
- After Skip-button click the tutor offers 3 choices instead of advancing → button-marker suppression regressed (`VoiceTutorRealtime.tsx:3763`).
- paceBias badge doesn't appear → `onPaceBiasChange` callback wiring at `src/app/tutor/page.tsx:1874` not propagating.

---

## Lesson 4 — `[TEST] HS Biology — Sex-Linked Inheritance and Pedigree Analysis`

**Plan id:** `evelyn.test.hs.bio.sex-linked-pedigree.v1`
**Open:** Science → High School (9-10 or 11-12) → Genetics → pick the [TEST] plan.

**Test focus:** Rare `show_pedigree` tool path, sex-linked Punnett, dense concept-map leaf row (renderer fix), cell-targeted scribble on a table.

### Setup

- [ ] Visit `/tutor/settings` and pick "Pretty funny" (medium) — 9-12 caps at heavy, so medium is fine and lets the test isolate rare-tool exercise from heavy-humor narrative.

### Behaviors to verify

- [ ] Server log shows `[humor] active=medium` on first turn.
- [ ] Brain emits `show_concept_map` with at least 5 leaf nodes off a central root, each with multi-line labels (e.g. "Carrier female (X^A X^a) — normal vision"). The dense row should render with **zigzag stagger** and NO overlapping rectangles. Visual inspection only — there's no log line for this.
- [ ] Brain emits `show_punnett({ parent1: "X^A X^a", parent2: "X^A Y", trait: "Color blindness" })` (or close). All four offspring cells visible with phenotype interpretations.
- [ ] Brain emits `show_pedigree` at least once. Squares = males, circles = females, filled = affected. Verify the standard generations + marriages + children layout.
- [ ] Brain emits `show_table` for genotype/phenotype frequencies. After the table, brain calls `tutor_scribble({ target: "row-2-col-1" or "affected sons cell", shape: "circle" })` to circle a specific cell. Look for ZERO `[VoiceTutor] scribble-reject (silent drop)` lines and YES a visible circle overlay on a table cell.
- [ ] On the misconception ("father → son"), brain explicitly references that sons inherit Y from father (no X transmission).
- [ ] PDF export includes the pedigree, Punnett square, concept map, and table.

### Per-lesson failure modes

- Concept-map leaves overlap → renderer regression at `src/app/tutor/components/whiteboard/concept-map`-related files. The recent fix was supposed to stagger and wrap.
- Scribble lands somewhere other than the table cell → feature catalog naming for table cells changed; ask the brain to call `list_whiteboard_features` and re-target.
- Pedigree never rendered → brain reached for `show_table` instead. Confirm `suggestedTools: ['show_pedigree']` is reaching the prompt via the segment formatter.

---

## Lesson 5 — `[TEST] G7 Social Studies — The Apollo Missions`

**Plan id:** `evelyn.test.g7.ss.apollo-missions.v1`
**Open:** Social Studies → Middle School (6-8) → US History (1877-Present) → pick the [TEST] plan.

**Test focus:** `show_timeline`, `show_map` USA preset, `show_diagram(hierarchy_pyramid)` BOTH with `tiers` AND with `levels` (solver accepts both — `src/lib/tutor/diagrams/catalog/kinds/advanced-math-ela-social.ts:258-267`), `show_labeled_image` legacy `src` path with NASA URL + brain-placed callouts.

### Setup

- [ ] Visit `/tutor/settings` and pick "A little funny" (light).

### Behaviors to verify

- [ ] Server log shows `[humor] active=light` on first turn.
- [ ] Brain emits `show_timeline` with the Apollo dates (1961 Kennedy speech → 1972 Apollo 17). Numeric years auto-space along the axis.
- [ ] Brain emits `show_map` with `background: "usa"` and pins at Cape Canaveral (lat ~28.5, lon ~-80.6) and Houston (lat ~29.7, lon ~-95.4). Pins land on the right states (Florida, Texas).
- [ ] **Two distinct pyramid renderings.** First: `show_diagram({ type: "hierarchy_pyramid", params: { tiers: [...], baseFirst: true } })` for mission phases. Second: `show_diagram({ type: "hierarchy_pyramid", params: { levels: [...] } })` for Saturn V stages. Both render correctly — solver accepts both field names.
- [ ] Brain emits `show_labeled_image` with the LEGACY `src` path: `src: "https://images-assets.nasa.gov/image/as11-40-5874/as11-40-5874~orig.jpg"` plus 3-4 `callouts` at brain-reasoned coordinates (LEM, footprint, flag, lunar surface). Server log shows the URL precheck PASSED (no `URL precheck FAILED, dropping` line). The image-search interceptor only strips callouts on the query path; src-path callouts MUST persist.
- [ ] Visible callouts on the rendered image — the labels appear pinned to the photo at the brain's chosen percent coordinates.
- [ ] PDF export contains the timeline, map, both pyramids, and the NASA image with callouts.

### Per-lesson failure modes

- Map pins land in the wrong country → lat/lon swapped, or `background` preset misnamed.
- Only `tiers` or only `levels` works → solver regression at `kinds/advanced-math-ela-social.ts:258-267`.
- NASA image dropped → `URL precheck FAILED` line in log; URL changed or NASA hostname blocked. Try a different `as17-…~orig.jpg` from the images-assets archive.
- Callouts stripped on src-path → interceptor regression; verify `src/app/api/tutor/brain/stream/route.ts:404-414` only strips when `query` path was taken.
- Brain switches to query path despite the lesson explicitly suggesting src → re-read the segment teacher note in the lesson plan; the brain may need stronger "use src, not query" wording.

---

## Cross-cutting checks (run on any lesson)

- [ ] At session start, type `?` then check whiteboard — typed input should interrupt any in-flight TTS (known issue tracked in `project_tutor_handoff_2026_04_30_evening`).
- [ ] Mid-session, click ⋯ → "Wrap up". Lesson terminates cleanly without orphan brain turns.
- [ ] Try saying "tell me a joke" mid-lesson (off-topic bait). Brain should redirect to lesson topic without drifting; confirm orchestrator's off-topic handling is intact.
- [ ] After completion, hit "Save PDF" — verify all rendered widgets are in the PDF and equations are not garbled.

## Cleanup

- All five seed files are prefixed `test-` and all titles start with `[TEST]` for easy removal. To remove the harness:
  1. Delete the five seed files in `src/lib/tutor/lesson-plan/seeds/test-*.ts`.
  2. Remove the matching imports + array entries in `src/lib/tutor/lesson-plan/store.ts` (search for `SEED_TEST_`).
  3. `npx tsc --noEmit` to confirm clean.
