# AP US Government & Politics — Unit-1 Vertical Slice Design

**Date:** 2026-07-11
**Status:** Approved (brainstorming)
**Branch / worktree:** `apgov-u1-slice` @ `.claude/worktrees/apgov-u1` (off `apworld-u2-slice` — reuses the history/humanities stimulus + rubric infrastructure)
**Related:** [[project_apush_slice]] / [[project_apworld_slice]] (the document/rubric/grader infra reused), [[project_ap_eng_lang_slice]] (passage/packet/grader origin), [[project_ap_parity_gaps_build]] (6-component model)

## Purpose

Build AP US Government & Politics — **#5 AP exam by US volume** (~389k). It reuses the document/rubric/grader infrastructure with **zero code changes**: the `Passage` registry (its required foundational documents), the `FrqRubric` mechanism, the passage-aware grader, and the `passageIds[]` packet. The genuinely new work is (a) AP Gov's **four FRQ formats** and (b) government content.

Vertical slice: **Unit 1 (Foundations of American Democracy)** end-to-end, then the other 4 units fan out. Unit 1 is built on the founding documents already seeded (Declaration, Constitution Preamble, Federalist 10, Brutus 1 — from APUSH), so reuse is maximal.

## Decisions locked (brainstorming)

| # | Decision | Resolution |
|---|---|---|
| D1 | Course | **AP US Government & Politics** (#5 demand; completes the top-5 humanities/social-studies set). |
| D2 | Build shape | **Vertical slice first** — Unit 1 end-to-end + all 4 FRQ formats, then fan out Units 2–5. |
| D3 | Slice unit | **Unit 1 — Foundations of American Democracy** (types of democracy, the Constitution & ratification debate, separation of powers/checks and balances, federalism). Reuses the seeded founding documents. |
| D4 | FRQ formats | **All 4 AP Gov types, authentic point totals** (engine sums part-points dynamically): **Concept Application (3)**, **Quantitative Analysis (4)**, **SCOTUS Comparison (4)**, **Argument Essay (6)**. |
| D5 | Infra | **Reuse wholesale — no code changes.** Document registry, `FrqRubric`, passage-aware grader, `passageIds[]` + `packetLabel`. Only `scripts/lint-ap-plans.ts` gains `'apgov'`. |
| D6 | New-stimulus representation | **Quantitative Analysis** data visual = a **text description of a data table/figure** (same text-only approach as visual DBQ documents). **SCOTUS Comparison** case = a text description of the required case's facts + constitutional issue + holding. |

## Architecture

### Reused (no rebuild, all on the parent branch)
- `Passage` registry + genres; `passageId`/`passageIds`/`packetLabel`; `resolvePassageText`; passage-aware grader; `FrqRubric` mechanism; `lint-passages.ts`; topic-notes/problem-bank/academy pipelines.
- **Reused documents (by existing id):** `evelyn.passage.apush-declaration.v1`, `apush-constitution-preamble.v1`, `apush-federalist-10.v1`, `apush-brutus-1.v1`.
- Only infra touch: `scripts/lint-ap-plans.ts` += `'apgov'` in `AP_COURSE_SLUGS`.

### New = content only
1. **Documents to add** (public-domain): **Federalist No. 51** (Madison, separation of powers / "ambition must be made to counteract ambition") — genre `'document'`; **a described data table** (e.g. the distribution of powers federalism table, OR a public-opinion/turnout table) — genre `'political-cartoon'` (best-fit for a described visual), text description of the figure. (SCOTUS-comparison case descriptions live inside the SCOTUS FRQ plan's prompt, not as separate Passages.)
2. **The 4 FRQ rubric shapes** (authored on FRQ-practice plans, no code):
   - **Concept Application (3):** `[A-partA:1, B-partB:1, C-partC:1]` — describe/explain across a scenario.
   - **Quantitative Analysis (4):** `[A-identify:1, B-describe:1, C-draw-conclusion:1, D-explain:1]` — over a described data table.
   - **SCOTUS Comparison (4):** `[A-identify-clause:1, B-explain-comparison:1, C-explain-effect:1, D-...:1]` — compare a given case to a required case (e.g. *McCulloch v. Maryland*).
   - **Argument Essay (6):** `[A-thesis:1, B-evidence-doc:1, C-evidence-second:1, D-reasoning:1, E-...:1, F-rebuttal:1]` — claim + evidence from ≥1 required foundational document (`passageIds` to the reused docs) + reasoning + rebuttal.

### Unit-1 deliverables (6 components)

| Component | Deliverable |
|---|---|
| Lesson plans | ~4–5 content plans (types of democracy & the democratic ideals in the founding docs; the Constitution & the ratification debate [Federalist vs Anti-Federalist]; separation of powers & checks and balances; federalism [enumerated/reserved/concurrent powers]) + **4 FRQ-practice plans (Concept Application, Quantitative Analysis, SCOTUS Comparison, Argument Essay)** |
| Documents | reuse Declaration/Constitution/Federalist 10/Brutus 1; **add Federalist 51** + a described data table |
| Rubrics | the 4 authentic AP Gov FRQ rubrics (3/4/4/6) |
| Topic-notes | one baseline per content plan |
| MCQ bank | `data/problem-bank/ap-us-government/u1.json` — stimulus-based sets (foundational-doc excerpts + a described figure), self-contained stems, distributed+shuffled answers |
| Academy | new `buildCourse` block (pattern `/^ap-apgov-.*\.ts$/`, subject `'Government'`, engine coords `{subject:'ss', level:'ap', topic:'ap-us-government'}`), mappings regenerated |

IDs `evelyn.ap.apgov.<slug>.v1`; LO `apgov.<slug>`; files `ap-apgov-u1-<slug>.ts`; `subject:'ss'`; `curriculum:'AP'`; `topic:'ap-us-government'`; `metadata.cedUnit:'1'`.

## Phasing
- **P0 — infra (tiny):** `'apgov'` slug in `lint-ap-plans.ts`. (No schema/grader changes.)
- **P1 — Unit-1 content:** add Federalist 51 + the data table → author content plans (calibrate 1) → notes → the 4 FRQ-practice plans + rubrics → stimulus MCQ bank → academy block.
- **Validation gate (user):** live session — a document/figure renders, each of the 4 FRQ types grades against its rubric (Argument Essay pulls the foundational-doc packet), a stimulus MCQ set surfaces.
- **P2 (separate):** Units 2–5 fan-out.

## Testing strategy
- P0: lint-ap-plans recognizes `apgov`.
- Content gates (reuse the history-course pattern): tsc 0; lint-ap-plans passes; lint:passages clean; the 4 FRQ rubrics sum to 3/4/4/6 (structural walk); the Argument Essay's `passageIds` packet resolves; baselineId===planId; 0 dangling refs; MCQ dry-run verify (**note the seed-problem-bank verify-prompt hardcodes an AP-Statistics persona — monitor; fix before large fan-out**); content-filter safety; historical/constitutional accuracy (per-task review).
- **Document-fidelity gotcha (from APUSH/APWorld):** attribute to a foundational document only what its seeded excerpt contains; broader knowledge = the student's own evidence/reasoning.
- Live gate as the release gate before fan-out.

## Out of scope (deferred)
- Units 2–5 (P2 initiative) — Unit 2 holds most required SCOTUS cases; the slice includes one SCOTUS-Comparison to validate the format.
- Embedded figures/images (data visual = text description).
- DB seeding + academy ingest + merge (user/ops — ships with Eng Lang + APUSH + APWorld; the branch is stacked on all three).

## Risks
- **Four new rubric formats** — more novel-rubric authoring than the history slices (which had one DBQ shape). Each must match the real AP Gov rubric structure + point total; the per-task review verifies authenticity.
- **Quantitative Analysis as text** — a described data table must give enough concrete numbers for a real "identify/describe/draw-a-conclusion/explain" exercise; keep the figures realistic + internally consistent.
- **SCOTUS Comparison** — the required-case description (facts/issue/holding) must be constitutionally accurate; per-task review checks it.
- **Content-filter / accuracy** — Unit 1 founding-era + constitutional content is measured and filter-safe; accuracy (clauses, cases, powers) verified per-task.
