# AP US History — Periods 1–2 & 4–9 Fan-out Design

**Date:** 2026-07-11
**Status:** Approved (decisions derived from the validated AP Gov Units 2–5 fan-out precedent — autonomous overnight run, user pre-authorized)
**Branch / worktree:** `apush-periods-fanout` @ `.claude/worktrees/apush-fanout` off engine `main` (`5bf5b13`, the merged five-course stack)
**Related:** `2026-07-10-ap-us-history-design.md` (the validated Period-3 slice this extends), `2026-07-10-apush-period3-slice.md` (plan whose conventions carry over verbatim), `2026-07-11-apgov-units-2-5-design.md` (the fan-out process template)

## Purpose

Complete AP US History by fanning out **Periods 1–2 and 4–9** on the validated Period-3 patterns. Content-only: zero engine code changes, zero academy code changes (the `ap-us-history` buildCourse block already matches `/^ap-apush-.*\.ts$/`; `'apush'` is already in `lint-ap-plans` `AP_COURSE_SLUGS`). One branch, one deploy.

## Decisions locked (derived from precedent)

| # | Decision | Resolution |
|---|---|---|
| D1 | FRQ density | **All 3 history formats per period** — 24 FRQ-practice plans (DBQ 7 pts, LEQ 6 pts, SAQ 3 pts; engine sums part-points — the P3 rubric shapes verbatim). |
| D2 | DBQ packet size | **5 documents per period** (P3 used 7). Deviation flagged: the real exam gives 7, but the current rubric rows (≥4-doc evidence for 2 pts, sourcing ≥2 docs) all remain exercisable with 5, and it halves the verbatim-sourcing load across 8 periods (the dominant risk per the APWorld Task-2 CRITICAL). Same class of authenticity trade as AP Gov's 4×1-pt SCOTUS rubric. |
| D3 | Copyright strategy | **Pre-1929 PD texts + US-government works only** as Passages. Copyrighted landmarks (MLK speeches/Letter, Friedan, Port Huron, "Broken Spears" translation) = **authored in-plan descriptions, zero quoted text, never in a packet** (AP Gov MLK precedent). Visual/data documents = described text, genre `'political-cartoon'`, real published figures with real `sourceUrl` (AP Gov data-table precedent). Periods 7–9 lean on US-gov works (presidential speeches, statutes, opinions, EOs) which are PD regardless of date. |
| D4 | Content-plan scale | **CED-weighted:** P1: 3, P2: 4, P4: 5, P5: 5, P6: 5, P7: 6, P8: 5, P9: 3 (**36 plans**; CED weights 4–6 / 6–8 / 10–17 ×5 / 4–6%; P7 gets 6 — it spans imperialism→WWII). |
| D5 | MCQ volume | **CED-weighted:** P1: 8, P2: 8, P4: 10, P5: 10, P6: 10, P7: 12, P8: 10, P9: 8 (**76 items**; APUSH total 86 with U3's 10). |
| D6 | Shipping | **One branch, one deploy** — per-period task groups with per-task review; single merge → deploy → tunnel-seed (verify ON) → server ingest; live gate deferred to the user in the morning. |
| D7 | Build order | **Period-by-period mini-slices** (passages → content plans + notes → FRQ plans → MCQs per period). Periods are independent (all LO strings pre-specified in the plan; P3 gold templates already exist) — **cross-period parallel dispatch is allowed**, with full dangling-ref/consistency checks at the whole-branch audit. Academy `gen-seed` regeneration once at the end. |
| D8 | Notes merged into content task | Content plans + their topic-notes baselines are authored in **one task per period** (AP Gov ran them separately). Rationale: the APWorld Task-6 lesson (quote drift between plan and baseline) is best prevented by same-context authoring; halves task count across 8 periods. Per-task review still applies. |

## Scope table

| Period | Content plans | FRQ | Notes | MCQs | New passages (5-doc DBQ packet each) |
|---|---|---|---|---|---|
| P1 1491–1607 | 3 — Native societies; exploration & Columbian Exchange; Spanish colonization | 3 | 3 | 8 | Columbus letter; Las Casas; Cortés on Tenochtitlan; Codex Mendoza (described visual); Hakluyt |
| P2 1607–1754 | 4 — colonial regions; transatlantic economy; slavery in the colonies; colonial society & Awakening | 3 | 4 | 8 | Mayflower Compact; Winthrop; Bacon's Declaration; Equiano; Edwards |
| P4 1800–1848 | 5 — Jefferson era; Market Revolution; Jacksonian democracy; reform & Awakening; the slave South | 3 | 5 | 10 | Jefferson 1st inaugural; Monroe Doctrine; Jackson bank veto; Seneca Falls Declaration; Garrison |
| P5 1844–1877 | 5 — manifest destiny; sectional crisis; secession & Civil War; emancipation; Reconstruction | 3 | 5 | 10 | O'Sullivan; SC secession declaration; Emancipation Proclamation (+ REUSE `lincoln-gettysburg`, `douglass-fourth-of-july`) |
| P6 1865–1898 | 5 — the West & New South; big business; labor; immigration & urbanization; Gilded politics & Populism | 3 | 5 | 10 | Carnegie "Wealth"; Omaha Platform; Chinese Exclusion Act; immigration data table (described); Cross of Gold |
| P7 1890–1945 | 6 — imperialism; Progressivism; WWI; the 1920s; Depression & New Deal; WWII | 3 | 6 | 12 | Roosevelt Corollary; Wilson war message; FDR 1st inaugural; Four Freedoms; EO 9066 (all US-gov works) |
| P8 1945–1980 | 5 — Cold War origins; postwar society; civil rights movement; Great Society & Vietnam; the 1970s | 3 | 5 | 10 | Truman Doctrine; Eisenhower farewell; JFK inaugural; LBJ Great Society (+ REUSE `apgov-brown-opinion`) |
| P9 1980–present | 3 — conservative resurgence; globalization & information age; America since 9/11 | 3 | 3 | 8 | Reagan 1st inaugural; Reagan Brandenburg Gate; G.W. Bush 9/20/2001; Obama 1st inaugural; immigration-origins data table (described) |

**Totals:** 36 content plans, 24 FRQ plans, 36 notes baselines, 76 MCQs, 37 new passages (+3 reuses). APUSH course after ship: 68 plans (41 lesson + 27 FRQ), 41 baselines, 86 bank items.

**Conventions (identical to P3, no exceptions):** IDs `evelyn.ap.apush.<slug>.v1`; LO `apush.<slug>`; standards `AP-APUSH-<topic>`; files `ap-apush-u<N>-<slug>.ts`; passages `evelyn.passage.apush-<slug>.v1`; `subject:'ss'`; `curriculum:'AP'`; `topic:'ap-us-history'`; `grade:'11'`; `metadata.cedUnit:'<N>'` (STRING in plans; NUMBER in notes); notes `course:'AP United States History'`; `baselineId === planId`; `pacingThresholds: AP_PACING_THRESHOLDS`, `source: AP_SOURCE`; plan `estimatedMinutes` = segment sum; FRQ cedTopics `'<N>-DBQ' | '<N>-LEQ' | '<N>-SAQ'` (portal `isFrq` regex `/frq|dbq|leq|saq/i`).

**Rubric shapes (P3 verbatim, defined once):**
- **DBQ (7):** `[A-thesis:1, B-context:1, C-doc-evidence:2, D-outside-evidence:1, E-sourcing:1, F-complexity:1]`, `packetLabel:'document'`, `passageIds` = the period's 5-doc packet.
- **LEQ (6):** `[A-thesis:1, B-context:1, C-evidence:2, D-analysis:2]`, no passages.
- **SAQ (3):** `[a:1, b:1, c:1]`; stimulus `passageId` ONLY when the prompt explicitly quotes/uses the document.

## Process & testing

- **Execution:** superpowers subagent-driven development; 4 tasks per period (passages → plans+notes → FRQs → MCQs), per-task review with historical-accuracy focus (every history slice review caught real factual errors); cross-period parallel waves allowed; final whole-branch audit + review. Do NOT run the dev server on ports 3001–3010.
- **Verbatim discipline (the APWorld CRITICAL):** never author "verbatim" quotes from search snippets — fetch RAW source text (Gutenberg .txt, Avalon, NARA, presidency.ucsb.edu, govinfo) and verify each excerpt is a contiguous substring (ellipses marked). Document-fidelity rule: attribute to a doc only what its seeded excerpt contains; broader famous arguments = outside evidence in modelResponses.
- **Gates per task:** tsc 0; `lint-ap-plans` passes; `lint:passages` clean (passages touched); rubric part-sums 7/6/3 structural walk; DBQ packets resolve to `Document 1..5`; `baselineId===planId`; MCQ `--dry-run` verify (course-aware, `ba11d4f`); measured tone on sensitive material (slavery, Indian removal, internment, 9/11); answer letters distributed non-cyclic, correct-not-longest.
- **Ship (once):** merge → `deploy-to-production.sh` → academy `seed:gen` regen (mappings only) → merge academy → `deploy-crimsora.sh` → tunnel-seed WITH verify (user's port-2710 tunnel, `directConnection=true` swap) → server ingest (`set -a && source .env.local && set +a && npm run ingest`) → prod-count verification. **Live gate deferred to the user in the morning.**

## Out of scope

- APWorld/other course fan-outs (next queue item, separate initiative).
- Embedded images (visuals remain described text).
- Engine/portal code changes of any kind.
- 7-document DBQ packets (D2), copyrighted-text Passages (D3).

## Risks

- **Verbatim sourcing ×37 passages** — the dominant risk (APWorld Task-2 CRITICAL precedent); mitigated by raw-text fetch + substring verification per excerpt + review.
- **Sensitive-content periods** (slavery P2/P4/P5, Indian removal P4/P6, internment P7, civil rights P8, 9/11 P9) — measured, exam-neutral tone; short excerpts; the Equiano excerpt selected for restraint.
- **Cross-period consistency drift** over ~170 authored artifacts — mitigated by pre-specified LO/slug tables in the plan, per-task review, whole-branch audit.
- **P9 recency** — keep post-2008 content minimal and non-partisan; CED itself ends ~2012+ lightly.
- **Parallel-wave merge conflicts** on the three store files + `_AUTHORING.md` — waves stagger commits; each task rebases before commit; conflicts are append-only and trivial.
