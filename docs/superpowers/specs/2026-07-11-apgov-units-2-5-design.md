# AP US Government & Politics — Units 2–5 Fan-out Design

**Date:** 2026-07-11
**Status:** Approved (brainstorming)
**Branch / worktree:** `apgov-u2-5` @ a repo-local worktree off engine `main` (main holds the merged four-course stack `ecce323` + the verify-gate fix `ba11d4f`)
**Related:** `2026-07-11-ap-us-government-design.md` (the validated U1 slice this extends), `2026-07-11-apgov-u1-slice.md` (plan whose conventions carry over verbatim)

## Purpose

Complete AP US Government & Politics by fanning out **Units 2–5** on the validated Unit-1 patterns. Content-only: zero engine code changes, zero academy code changes (the `ap-us-government` buildCourse block already matches `/^ap-apgov-.*\.ts$/`). One branch, one deploy.

## Decisions locked (brainstorming)

| # | Decision | Resolution |
|---|---|---|
| D1 | FRQ density | **All 4 formats per unit** — 16 FRQ-practice plans (Concept Application 3 pts, Quantitative Analysis 4, SCOTUS Comparison 4, Argument Essay 6 — engine sums part-points). |
| D2 | Letter from Birmingham Jail (U3 required doc, © until ~2058) | **Authored in-plan description, no Passage, zero quoted text** — context + argument structure (just/unjust law, direct action, the white moderate) described originally, same treatment as SCOTUS case descriptions. Never in an Argument-Essay packet. |
| D3 | Required SCOTUS cases (12 in U2–5) | **Hybrid** — facts/issue/holding descriptions inside plans/prompts for all 12 (U1 pattern), PLUS real opinion excerpts seeded as Passages where MCQ stimulus sets quote them — pinned: *Marbury* (U2), *Brown* + *Tinker* (U3), *Citizens United* (U5); none for U4 (SCOTUS opinions are US-gov works, public domain). |
| D4 | Content-plan scale | **CED-weighted:** U2: 5, U3: 4, U4: 3, U5: 5 (17 plans; exam weights 25–36 / 13–18 / 10–15 / 20–27%). |
| D5 | MCQ volume | **CED-weighted:** U2: 15, U3: 12, U4: 10, U5: 15 (~52 items). |
| D6 | Shipping | **One branch, one deploy** — per-unit task groups with per-task review; single merge → deploy → tunnel-seed (verify ON) → server ingest → live gate. |
| D7 | Build order | **Unit-by-unit mini-slices** U2 → U3 → U4 → U5 (passages → content plans → notes → FRQ plans → MCQs per unit); academy gen-seed regeneration once at the end. |

## Scope table

| Unit | Content plans | FRQ plans | Notes | MCQs | New passages |
|---|---|---|---|---|---|
| U2 Interactions Among Branches | 5 — Congress; presidency; judiciary; bureaucracy; checks-in-practice | 4 | 5 | 15 | Federalist 70; Federalist 78; congressional data table; opinion excerpt: *Marbury v. Madison* |
| U3 Civil Liberties & Civil Rights | 4 — religion+speech; press/assembly/2nd Am; due process+incorporation; civil rights | 4 | 4 | 12 | civil-liberties data table; opinion excerpts: *Brown v. Board*, *Tinker v. Des Moines* |
| U4 Political Ideologies & Beliefs | 3 — socialization+public opinion; polling; ideologies+policy | 4 | 3 | 10 | polling/ideology data table |
| U5 Political Participation | 5 — voting rights+behavior; parties; interest groups; elections+campaigns; media | 4 | 5 | 15 | turnout data table; opinion excerpt (Citizens United) |

Plus **Articles of Confederation backfill** — the one still-unseeded required foundational document (PD); feeds U2/U5 Argument-Essay packets.

**Conventions (identical to U1, no exceptions):** IDs `evelyn.ap.apgov.<slug>.v1`; LO `apgov.<slug>` (NOTE: federalism LO is `apgov.federalism-foundations`); files `ap-apgov-u<N>-<slug>.ts`; `subject:'ss'`; `curriculum:'AP'`; `topic:'ap-us-government'`; `metadata.cedUnit:'<N>'` (string); `baselineId === planId`; FRQ plans carry `FRQ` in `cedTopic` (portal `isFrq`); data tables genre `'political-cartoon'` with real published figures (Census/BLS/OMB/FEC-class gov sources), internally consistent, real `sourceUrl`; opinion excerpts genre `'document'`, line-numbered.

## FRQ design (16 plans)

- **Concept Application (3):** original scenario per unit — U2: executive–legislative war-powers clash; U3: school-speech incident; U4: candidate reading conflicting polls; U5: interest group choosing lobbying vs litigation.
- **Quantitative Analysis (4):** over that unit's new described data table.
- **SCOTUS Comparison (4):** described non-required case vs a required case — U2 vs *Baker v. Carr*; U3 vs *Tinker v. Des Moines*; U5 vs *Citizens United v. FEC*; **U4 borrows *Wisconsin v. Yoder*** (the CED assigns U4 no required cases) — **authenticity deviation, surfaced here**, same class as U1's 4×1 SCOTUS rubric shape.
- **Argument Essay (6):** foundational-document `passageIds[]` packets — U2: Fed 51 + Fed 70 + Fed 78 + Articles of Confederation (institutional power); U3: Declaration + Constitution Preamble (MLK argument appears only as in-plan description, never in the packet); U4: Fed 10 + Brutus 1 (factions/public opinion); U5: Fed 10 + Brutus 1 + AoC (participation/parties).
- **try_yourself gotcha (APUSH):** set `passageId`/`passageIds` only when the prompt explicitly uses the document; else omit.
- **Document fidelity:** attribute to a document only what its seeded excerpt contains; broader knowledge = the student's own evidence in modelResponses.

## Process & testing

- **Execution:** superpowers subagent-driven development; per-unit task groups; per-task review; final whole-branch review. Do NOT run the dev server on ports 3001–3010.
- **Gates per unit:** tsc 0; `lint-ap-plans` passes; `lint:passages` clean; rubric part-sums 3/4/4/6 (structural walk, never grep); Argument-Essay packets resolve; `baselineId===planId`; zero dangling refs; MCQ `--dry-run` with the course-aware passage-fed verify gate (`ba11d4f`); content-filter safety (U3 civil-rights material: measured tone); constitutional accuracy (clauses, holdings, incorporation status) per-task review.
- **Ship (once):** merge worktree → `deploy-to-production.sh` → tunnel-seed problem bank WITH verify (non-2710 local port + `directConnection=true`; seed locally through the tunnel) → server ingest (`cd /root/crimsora && source .env.local && npm run ingest`) → enrollment check → **live validation gate:** one U2 session exercising a new data table + a SCOTUS comparison.

## Out of scope

- Other courses' fan-outs (APUSH periods, APWorld units, Eng Lang units 2–9).
- Embedded figures/images (data visuals remain text descriptions).
- Engine/portal code changes of any kind.
- The residual U1 check (formal QA try_yourself seeded-table render) — user live session, independent of this build.

## Risks

- **Cross-unit consistency drift** over ~60 authored artifacts (LO naming, rubric voice, difficulty calibration) — mitigated by unit-by-unit review + final whole-branch review.
- **Data-table realism ×4** — each table needs real, internally consistent published figures with enough concrete numbers for identify/describe/conclude/explain.
- **Opinion-excerpt fidelity** — excerpts must be the actual opinion text, correctly attributed (majority vs dissent, author).
- **U4 borrowed-case deviation** — flagged; acceptable trade for keeping all 4 formats per unit.
- **U3 content filter** — civil-liberties/civil-rights material (protests, establishment clause, gun rights, due process) authored in measured, exam-neutral tone.
