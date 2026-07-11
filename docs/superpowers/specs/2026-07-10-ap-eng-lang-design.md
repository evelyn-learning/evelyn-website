# AP English Language & Composition — Vertical Slice Design

**Date:** 2026-07-10
**Status:** Approved (brainstorming)
**Branch / worktree:** `eng-lang-vertical-slice` @ `.claude/worktrees/ap-eng-lang` (off `origin/main`)
**Related:** [[project_ap_parity_gaps_build]] (6-component model), [[project_ap_plans_initiative]] (AP authoring conventions), [[project_problem_bank_seeding]] (bank recipe)

## Purpose

Build AP English Language & Composition — the **#1 AP exam by US volume** (~616k takers 2025) and the engine's **first humanities course**. Because it is essay- and passage-driven, it needs infrastructure the five STEM/social-science AP courses never did: shared stimulus passages, passage-grouped MCQ sets, and passage-aware essay grading.

To de-risk that novel infrastructure before committing to a full ~40–50-plan course, this initiative is a **vertical slice: Unit 1 only, all six content components end-to-end**, plus the reusable passage infrastructure. After a live-session validation of Unit 1, Units 2–9 fan out (separate initiative).

## Decisions locked (brainstorming)

| # | Decision | Resolution |
|---|---|---|
| D1 | Build shape | **Vertical slice first** — Unit 1 end-to-end + passage infra, validate live, then fan out. |
| D2 | Passage sourcing | **Public-domain only** (pre-1929: speeches, essays, letters). Zero copyright risk, export-safe, authentic rhetoric. `license: 'public-domain'` on every passage. Sources: Wikisource, Project Gutenberg, national archives. |
| D3 | Passage modeling | **Approach A — standalone passage registry.** One `Passage`, many consumers (plan + notes + MCQ set + essay share one reading). |
| D4 | Rubric scale | **Authentic AP Lang 6-point** (Thesis 1 / Evidence & Commentary 4 / Sophistication 1), integer. NOT the STEM 9-point convention — the engine sums part-points dynamically, so 6 is faithful and valid. |
| D5 | try_yourself grain | **Three sizes** — micro (thesis), paragraph (evidence+commentary), full essay (in `-frq-practice`). Not only full essays. |
| D6 | Course structure | Follow the **CED 9-unit structure** (consistent with the 5 existing courses + academy `cedUnit` grouping). This slice = Unit 1. |

## Architecture

### 1. Passage infrastructure (the novel piece)

**New module `src/lib/tutor/passages/`** mirroring the `topic-notes` / `lesson-plan` seed-registry pattern.

```ts
// src/lib/tutor/passages/types.ts
export interface Passage {
  id: string;              // 'evelyn.passage.douglass-fourth-of-july.v1'
  title: string;
  author: string;
  year: number;
  sourceUrl: string;       // Wikisource / Gutenberg / archives
  license: 'public-domain';
  genre: 'speech' | 'essay' | 'letter' | 'sermon' | 'pamphlet' | 'memoir';
  fullText: string;        // paragraph-delimited (\n\n between paragraphs)
  lineNumbered: boolean;   // AP passages carry line numbers for citation
  wordCount: number;
}
```

- `src/lib/tutor/passages/seeds/*.ts` — one file per passage, export `PASSAGE_<SLUG>: Passage`.
- `src/lib/tutor/passages/store.ts` — imports each seed, exports `SEED_PASSAGES: Passage[]` + `passageById: Map<string,Passage>` + `resolvePassage(id): Passage | undefined`. Same shape as `topic-notes/store.ts`.

**References (additive, optional — no consumer changes for non-Eng-Lang content):**
- `SegmentTryYourself.passageId?: string` and `SegmentConcept.passageId?: string` (`lesson-plan/types.ts`).
- ProblemBank item: `passageId?: string` on both the `SeedItem` JSON shape and the Mongo `ProblemBank` model (`src/models/ProblemBank.ts`) — enables passage-grouped MCQ sets.

**Rendering:** reuse the existing `show_annotated_passage` tutor tool (renders line-numbered passage text + highlights + margin notes). The brain calls it with the resolved `passage.fullText`; no new render tool.

**Grader integration (`src/lib/tutor/portal/grade-free-response.ts`):**
- When a graded item carries a `passageId`, `gradeRubricPart` receives the resolved passage text in its prompt (`"Stimulus the student analyzed:\n<passage.fullText>"`), so it can verify whether cited evidence is accurate — essential for Rhetorical Analysis.
- Bump grader `max_tokens` 600 → ~1000 for richer essay feedback.
- **Fully additive:** no `passageId` → behavior identical to today.

**Validation:** extend `scripts/lint-ap-plans.ts` (or a sibling `lint-passages.ts` invoked alongside) to assert (a) every `passageId` referenced by a plan or bank item resolves in `SEED_PASSAGES`; (b) passage ids are unique; (c) referenced passages are `license: 'public-domain'`.

### 2. Segment semantics for a writing course

| Segment kind | AP Lang meaning |
|---|---|
| `concept` | A rhetorical concept/move (rhetorical situation; diction→tone). `vocabulary` carries rhetorical terms. |
| `worked_example` | **Annotated model** — `problem` = a prompt; `steps` = move-by-move construction of a strong response (or passage→answer walk for reading skills). `answer` = the model thesis/response. |
| `try_yourself` | **Student writes, rubric-graded.** Three grains (D5): micro `'free'` (thesis, 1–2 rubric parts), paragraph `'free'` (evidence+commentary parts), full essay `'frq'` (real 6-pt rubric, `passageId` attached). |
| `misconception_check` | Rhetoric traps (summary-vs-analysis; naming devices w/o explaining effect; non-defensible thesis). |
| `hook` / `recap` / `extension` | Standard. |

**Rubric (`FrqRubric.parts[]`), authentic AP Lang 6-point:**
- Row A — **Thesis** (0–1): defensible thesis responding to the prompt.
- Row B — **Evidence & Commentary** (0–4): specific evidence + explanation tying it to the line of reasoning.
- Row C — **Sophistication** (0–1): complexity/nuance.

Synthesis and Argument reuse this row structure with task-specific Row B wording. Each `FrqRubricPart` keeps its required per-part `scoringCriteria` + `modelResponse`.

### 3. Unit 1 deliverables (all six components)

**Focus:** the rhetorical situation (exigence, purpose, audience, writer, context); reading for the writer's claim/thesis; writing a defensible thesis + evidence-backed paragraph.

**Passages (3–4, seeded first):**
- Frederick Douglass, *What to the Slave Is the Fourth of July?* (1852) — speech, anchor rhetorical-analysis text.
- Patrick Henry, *Give Me Liberty or Give Me Death* (1775) — speech, contrast + MCQ set.
- A short essay excerpt (e.g. Woolf or Swift, public-domain) — paragraph-level exercise.

| Component | Deliverable |
|---|---|
| 1. Lesson plans | ~5–6 plans: rhetorical-situation intro, reading for claim/thesis, writing a defensible thesis, evidence & commentary basics, + **1 `ap-englang-u1-frq-practice.ts`** (full Rhetorical Analysis essay on Douglass). IDs `evelyn.ap.englang.<slug>.v1`; files `ap-englang-u1-<slug>.ts`; `subject: 'ela'`; `curriculum: 'AP'`; LO ids `apenglang.<slug>`; `metadata.cedUnit: 1`. |
| 2. Diagram kinds | **None new** — reuse `rhetorical_triangle` + `argument_structure`. |
| 3. Topic-notes baselines | One per content plan (~5) in `topic-notes/seeds/ap-englang-u1-*.ts`, registered in `SEED_BASELINES`. Rhetoric-shaped theory/methods/pointers; `baselineId===planId`. |
| 4. Problem bank | `src/data/problem-bank/ap-english-language/u1.json` — ~2 passage-grouped MCQ **sets** (~8–11 items each, shared `passageId`) covering reading-skill questions. |
| 5. FRQ rubrics | 6-point rubric on the Rhetorical Analysis full essay + micro/paragraph try-yourselves in content plans. |
| 6. Academy course | New `buildCourse` block in academy `tools/gen-seed.mjs` (pattern `/^ap-englang-.*\.ts$/`, subject `'English Language'`, engine coords `ela/ap/ap-english-language`), `seed:gen` → `ingest` → publish. |

## Phasing

- **Phase 0 — infrastructure:** `passages/` module + types + store; `passageId` refs on segment + bank schemas; grader wiring; lint check. Verify: tsc clean, lint passes, a unit test that `resolvePassage` + grader-with-passage path works.
- **Phase 1 — Unit 1 content:** seed 3–4 passages → author ~5–6 plans (calibrate 1, then author rest) → notes baselines → 2 MCQ sets → rubrics → academy block. Verify per component (tsc, lint-ap-plans, structural rubric audit, resolver smoke test, `seed:problem-bank --dry-run`).
- **Validation gate:** live tutor session on Unit 1 — confirm a passage renders, a rhetorical-analysis essay grades against the passage-aware rubric, an MCQ set surfaces. **Do not fan out until this passes.**
- **Phase 2 (separate initiative):** Units 2–9 fan-out using the proven slice as the template.

## Testing strategy

- **Phase 0 unit tests:** `resolvePassage` returns seeded passages; unknown id → undefined; grader includes passage text when `passageId` present and omits it (identical output) when absent.
- **Content gates (reuse parity-build pattern):** `tsc --noEmit` 0 errors; `lint-ap-plans` passes; passage-lint passes; every rubric sums to 6 integer with full per-part fields (structural `SEED_PLANS` audit, NOT grep); `baselineId===planId`, 0 dup/orphan baselines; KaTeX not applicable but `$`-digit sweep run anyway; `seed:problem-bank --dry-run` verifies MCQ answers.
- **Live validation:** one real Unit-1 session as the release gate.

## Out of scope (deferred)

- Units 2–9 (Phase 2 initiative).
- Synthesis multi-source **packets** (6–7 sources) — Unit 1 uses single passages; the multi-source container is a Phase-2 schema extension if needed.
- Contemporary/copyrighted passages (public-domain only per D2).
- `responseFormat: 'essay'` enum value — reuse `'frq'`/`'free'`.
- Any new diagram kinds.
- AP English **Literature** (a later course; may reuse this passage infra).

## Risks

- **Grader passage-awareness quality:** an LLM grading Rhetorical Analysis against a long passage may still mis-verify evidence. Mitigation: the live-session gate specifically checks essay grading; tune the grader prompt before fan-out.
- **Passage length vs token budget:** long speeches inflate the grader prompt. Mitigation: seed passages trimmed to AP-typical excerpt length (~600–800 words), which is also authentic to the exam.
- **Academy generator hardcoding:** `gen-seed.mjs` enumerates 5 courses explicitly; adding a 6th is a known, contained edit (new `buildCourse` block).
