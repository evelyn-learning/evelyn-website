# AP US Government & Politics Unit-1 Vertical Slice — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Unit-1 (Foundations of American Democracy) vertical slice of AP US Government & Politics: 4 content plans + notes + all **four authentic AP Gov FRQ formats** (Concept Application 3 / Quantitative Analysis 4 / SCOTUS Comparison 4 / Argument Essay 6) + Federalist 51 & a described data table + stimulus MCQs — reusing the history-course infrastructure with zero code changes, validating before the Units 2–5 fan-out.

**Architecture:** Reuse APUSH/APWorld infra wholesale: documents are `Passage`s (genre `'document'`; a described data figure as `'political-cartoon'`), the Argument Essay is a multi-document packet on `passageIds[]` + `packetLabel:'document'`, the passage-aware grader and `FrqRubric` carry over, and the engine sums rubric part-points dynamically (so 3/4/4/6 totals need no code). The ONLY infra touch is registering `'apgov'` in the AP-plan lint. Everything else new is government content — the four FRQ rubric shapes are the genuinely novel authoring.

**Tech Stack:** TypeScript, Next.js (engine), Mongo (ProblemBank + academy_portal), `@evelyn/portal-contract/v1`, ts-node test scripts, esbuild academy `gen-seed.mjs`.

**Spec:** `docs/superpowers/specs/2026-07-11-ap-us-government-design.md`

## Global Constraints

- **Documents public-domain only** — every `Passage.license === 'public-domain'`. Federalist 51 (1788) is PD; the data-table passage is an authored DESCRIPTION of US-government data (OMB/Census — US-government works, PD) with a real `sourceUrl`.
- **Rubric totals authentic** — Concept Application parts sum to **3**, Quantitative Analysis **4**, SCOTUS Comparison **4**, Argument Essay **6**; integer `maxPoints`; each `FrqRubricPart` with real `scoringCriteria` + `modelResponse`. Per-task review verifies each shape against the real AP Gov rubric.
- **Reused documents (by existing id, already seeded on the parent branch):** `evelyn.passage.apush-declaration.v1`, `evelyn.passage.apush-constitution-preamble.v1`, `evelyn.passage.apush-federalist-10.v1`, `evelyn.passage.apush-brutus-1.v1`. Do NOT re-seed or copy them.
- **ID scheme:** `evelyn.ap.apgov.<slug>.v1`; LO `apgov.<slug>`; files `ap-apgov-u1-<slug>.ts`; `subject:'ss'`; `curriculum:'AP'`; `topic:'ap-us-government'`; `metadata.cedUnit:'1'` (STRING).
- **`baselineId === planId`** for every topic-notes baseline.
- **NO schema/grader code changes** — genres, `packetLabel`, packets, grader, dynamic point-summing all exist on the parent branch. Only `scripts/lint-ap-plans.ts` gains `'apgov'`.
- **isFrq classification (academy):** the gen-seed `isFrq` regex is `/frq|dbq|leq|saq/i` over cedTopic + standard — every FRQ-practice plan's cedTopic must contain `FRQ` (e.g. `'1-FRQ-CA'`) so it's typed `frq-practice`.
- **try_yourself `passageId` gotcha (from APUSH):** set `passageId`/`passageIds` on a try_yourself ONLY if its prompt explicitly uses those documents ("Using the excerpt/table below…"); else omit — a stray passageId misleads the grader.
- **Document-fidelity gotcha (from APUSH/APWorld):** attribute to a foundational document ONLY what its SEEDED excerpt actually contains; broader knowledge = the student's own evidence/reasoning in modelResponses.
- **Constitutional accuracy** — clauses, cases, holdings, enumerated/reserved/concurrent powers must be correct; per-task review checks it. Content-filter: founding-era + constitutional content, measured tone throughout.
- **Verify structurally, never by grep.**
- **seed-problem-bank verify-prompt caveat:** the MCQ dry-run verifier hardcodes an AP-Statistics persona — monitor its judgments; fix the persona before the Units 2–5 fan-out, not in this slice.
- **Isolated worktree** `.claude/worktrees/apgov-u1` on `apgov-u1-slice` (stacked on `apworld-u2-slice` → APUSH → Eng Lang, so all four courses ship together). Do NOT run the dev server on ports 3001–3010.
- **Test harness:** node:assert + tiny `test()` counter via `test:*` npm scripts. (No new tests needed — infra reused.)

## File Structure

**Phase 0 (modify):** `scripts/lint-ap-plans.ts` — add `'apgov'` to `AP_COURSE_SLUGS`.

**Phase 1 (create):**
- `src/lib/tutor/passages/seeds/apgov-federalist-51.ts`, `apgov-federal-grants-table.ts` — the 2 new passages.
- `src/lib/tutor/lesson-plan/seeds/ap-apgov-u1-*.ts` — 4 content plans + 4 FRQ-practice plans.
- `src/lib/tutor/topic-notes/seeds/ap-apgov-u1-*.ts` — 4 baselines.
- `src/data/problem-bank/ap-us-government/u1.json` + `_AUTHORING.md`.

**Phase 1 (modify):** `passages/store.ts`, `lesson-plan/store.ts`, `topic-notes/store.ts` (register); academy `tools/gen-seed.mjs` (buildCourse block).

---

## PHASE 0 — INFRA (register apgov with the lint)

### Task 1: Register `'apgov'` in the AP-plan lint

**Files:** Modify `scripts/lint-ap-plans.ts`

- [ ] **Step 1:** In `scripts/lint-ap-plans.ts:29`, add `'apgov'` to the `AP_COURSE_SLUGS` array (currently ending `…, 'englang', 'apush', 'apworld'`) so `ap-apgov-*` plans are recognized as new-format AP plans.
- [ ] **Step 2: Verify.** `npx tsx scripts/lint-ap-plans.ts` → still passes (no apgov plans yet, slug registered). `npx tsc --noEmit` → 0.
- [ ] **Step 3: Commit.**
```bash
git add scripts/lint-ap-plans.ts
git commit -m "feat(apgov): register apgov course slug in lint-ap-plans"
```

---

## PHASE 1 — UNIT-1 CONTENT

> Content tasks are authored, not TDD; the gate is tsc + lint + structural audit. Federalist 51 is a verbatim PD excerpt; the data table is an authored description of PD US-government data. Constitutional accuracy is verified per-task.

### Task 2: Seed the 2 new passages (Federalist 51 + described data table)

**Files:**
- Create: `src/lib/tutor/passages/seeds/apgov-federalist-51.ts`, `src/lib/tutor/passages/seeds/apgov-federal-grants-table.ts`
- Modify: `src/lib/tutor/passages/store.ts` (register)

- [ ] **Step 1: Author Federalist 51.** Gold reference: `src/lib/tutor/passages/seeds/apush-federalist-10.ts`. `Passage` with id `evelyn.passage.apgov-federalist-51.v1`, genre `'document'`, author `'James Madison (Publius)'`, year 1788, `license:'public-domain'`, real `sourceUrl` (Gutenberg/Wikisource Federalist text). Verbatim excerpt ~150–200 words centered on the separation-of-powers core: "the great security against a gradual concentration of the several powers in the same department…", "Ambition must be made to counteract ambition…", "If men were angels, no government would be necessary…", and the double-security-of-federalism passage ("In the compound republic of America, the power surrendered by the people is first divided between two distinct governments…"). Paragraph-delimit; accurate `wordCount` (within ~5%).
- [ ] **Step 2: Author the described data table** (the Quantitative Analysis stimulus). Gold reference for a described visual: `src/lib/tutor/passages/seeds/apworld-catalan-atlas.ts` (`[VISUAL DOCUMENT — description]` prefix pattern). `Passage` with id `evelyn.passage.apgov-federal-grants-table.v1`, genre `'political-cartoon'` (best-fit for a described visual), title like `'Federal Grants to State and Local Governments (data table, 1980–2020)'`, `license:'public-domain'` (US-government data), `sourceUrl` to OMB Historical Tables (`https://www.whitehouse.gov/omb/budget/historical-tables/`), year 2021. `fullText` = `[DATA TABLE — description]` + a described table with CONCRETE, internally consistent numbers a student can identify/describe/conclude from, e.g.: federal grants-in-aid outlays in constant dollars and as a share of total federal outlays for 1980/1990/2000/2010/2020 (≈ $91B/6.8% → $135B/10.8% → $286B/16.0% → $608B/17.6% → $721B/11.0%-of-GDP-era ≈ use % of federal outlays consistently), plus a row splitting the latest year into categorical vs block grant shares (categorical ≫ block). Numbers must move monotonically where claimed and support at least one clear trend (grants grew in real dollars and as a share of federal spending) and one comparison (categorical grants dominate block grants). Note the units in the description.
- [ ] **Step 3: Register** both in `SEED_PASSAGES` in `src/lib/tutor/passages/store.ts`.
- [ ] **Step 4: Verify.** `npm run test:passages` (ids unique, all public-domain); `npm run lint:passages` clean; `npx tsc --noEmit` → 0. Sanity-check both `wordCount`s; re-read the table numbers once for internal consistency (shares consistent with dollar growth).
- [ ] **Step 5: Commit.**
```bash
git add src/lib/tutor/passages
git commit -m "content(apgov): Federalist 51 + described federal-grants data table"
```

### Task 3: Calibration content plan + register (STOP checkpoint)

**Files:**
- Create: `src/lib/tutor/lesson-plan/seeds/ap-apgov-u1-democratic-ideals.ts`
- Modify: `src/lib/tutor/lesson-plan/store.ts`

- [ ] **Step 1: Author** the plan. Gold references: `src/lib/tutor/lesson-plan/seeds/ap-apworld-u2-silk-roads.ts` (content-history semantics: concept + document analysis + SAQ-style try_yourself + misconception_check). id `evelyn.ap.apgov.democratic-ideals.v1`, LO `apgov.democratic-ideals` (standard `AP-APGOV-1.1`), cedTopic `'1.1'`, cedTitle `'Ideals of Democracy & Types of Democracy'` (covers CED 1.1–1.3). Segments: hook; concept (natural rights, popular sovereignty, social contract, limited government as they appear in the Declaration; the three models of representative democracy — participatory, pluralist, elite — and where the Constitution reflects each; `keyIdeas` + `vocabulary`; `passageId` → `evelyn.passage.apush-declaration.v1`); worked_example (annotated analysis of what the Declaration's text reveals about natural rights + the social contract — reference the doc in prose, NO passageId field on that segment); try_yourself Concept-Application-style short response (`responseFormat:'frq'`, 3-part rubric `[a:1,b:1,c:1]` summing to 3, no passageId unless the prompt quotes a document); misconception_check (a real AP Gov trap — e.g. "the US is a direct democracy" or conflating the Declaration [no legal force] with the Constitution [supreme law]); recap. `subject:'ss'`, `metadata.cedUnit:'1'`, `pacingThresholds: AP_PACING_THRESHOLDS`, `source: AP_SOURCE`. Plan-level `estimatedMinutes` = segment sum.
- [ ] **Step 2: Register** in `lesson-plan/store.ts`.
- [ ] **Step 3: Verify.** `npx tsc --noEmit` → 0; `npx tsx scripts/lint-ap-plans.ts` → passes (apgov recognized); `npm run lint:passages` clean. Structural: segment kinds in order, rubric sums to 3, estMin===segSum, passageId resolves.
- [ ] **Step 4: Commit.**
```bash
git add src/lib/tutor/lesson-plan/seeds/ap-apgov-u1-democratic-ideals.ts src/lib/tutor/lesson-plan/store.ts
git commit -m "content(apgov): Unit-1 calibration plan — democratic ideals"
```

**STOP — calibration checkpoint.** Gold template for the remaining content plans + establishes AP Gov content semantics. Review before Task 4.

### Task 4: Remaining Unit-1 content plans

**Files:**
- Create: `ap-apgov-u1-constitution-ratification.ts` (LO `apgov.constitution-ratification`, cedTopic `'1.4'`/`'1.5'` — Articles of Confederation's weaknesses [no tax power, no executive, unanimity; Shays's Rebellion], the Constitutional Convention compromises [Great Compromise, Three-Fifths, Electoral College], Federalist vs Anti-Federalist ratification debate; `concept.passageId` → `evelyn.passage.apush-brutus-1.v1`, worked_example contrasts Brutus 1 with Federalist 10's cure for faction), `ap-apgov-u1-separation-of-powers.ts` (cedTopic `'1.6'`, LO `apgov.separation-of-powers` — separation of powers + checks and balances [veto/override, advice-and-consent, judicial review, impeachment], stalemate requiring compromise; `concept.passageId` → `evelyn.passage.apgov-federalist-51.v1`, worked_example analyzes "ambition must be made to counteract ambition"), `ap-apgov-u1-federalism.ts` (cedTopic `'1.7'`/`'1.8'`/`'1.9'`, LO `apgov.federalism` — exclusive/reserved/concurrent powers, Tenth & Fourteenth Amendments, commerce/necessary-and-proper/supremacy clauses, categorical vs block grants/mandates/revenue sharing, *McCulloch v. Maryland* and *US v. Lopez* as the required Unit-1 cases; `concept.passageId` → `evelyn.passage.apgov-federal-grants-table.v1`, worked_example reads a trend off the described table)
- Modify: `src/lib/tutor/lesson-plan/store.ts`

- [ ] **Step 1: Author** each plan copying the Task-3 template: historical/constitutional `concept` with keyIdeas + vocabulary, `worked_example` analyzing the wired document, a 3-part short-response `try_yourself` (integer rubric summing to 3; passageId only if the prompt quotes a doc/table), a real AP Gov `misconception_check` (e.g. "the Constitution abolished state power", "checks and balances = separation of powers", "McCulloch limited federal power"), hook/recap. Wire prerequisites/followUps within the unit + to the calibration LO — every referenced id must be a real LO. `estimatedMinutes` = segment sum. Constitutionally accurate (clause names, case holdings — *McCulloch*: implied powers upheld + states can't tax the Bank; *Lopez*: commerce power has limits, Gun-Free School Zones Act struck down).
- [ ] **Step 2: Register** all in `lesson-plan/store.ts`.
- [ ] **Step 3: Verify.** tsc 0; `lint-ap-plans` passes; `lint:passages` clean; structural rubric audit (each try_yourself rubric integer total with per-part fields); 0 dangling refs (walk SEED_PLANS `evelyn.ap.apgov.` prereqs/followUps).
- [ ] **Step 4: Commit.**
```bash
git add src/lib/tutor/lesson-plan/seeds/ap-apgov-u1-*.ts src/lib/tutor/lesson-plan/store.ts
git commit -m "content(apgov): Unit-1 content plans (ratification, separation of powers, federalism)"
```

### Task 5: The four FRQ-practice plans (authentic AP Gov rubrics)

**Files:**
- Create: `ap-apgov-u1-frq-concept-application.ts`, `ap-apgov-u1-frq-quantitative.ts`, `ap-apgov-u1-frq-scotus-comparison.ts`, `ap-apgov-u1-frq-argument-essay.ts`
- Modify: `src/lib/tutor/lesson-plan/store.ts`

Gold reference for FRQ-practice plan shape: `src/lib/tutor/lesson-plan/seeds/ap-apworld-u2-dbq-practice.ts` (packet + big rubric) and `-saq-practice.ts` (short multi-part). Each plan: hook; concept segment framing the format + its rubric rows; ONE `try_yourself` with `responseFormat:'frq'` carrying the full rubric; recap. prerequisites = the relevant Unit-1 content LOs. **cedTopic must contain `FRQ`** (isFrq constraint). This is the genuinely novel authoring — each rubric must match the real AP Gov released-rubric structure; review verifies per-format.

- [ ] **Step 1: Concept Application (3 pts).** id `evelyn.ap.apgov.u1-frq-concept-application.v1`, LO `apgov.u1-frq-concept-application`, standard `AP-APGOV-1-FRQ-CA`, cedTopic `'1-FRQ-CA'`. The try_yourself prompt is a ~120-word NON-partisan hypothetical political scenario (e.g. a governor objects to a new federal education grant's conditions; the state legislature debates refusing the funds) followed by the authentic three parts: "(A) Describe the [concept] illustrated in the scenario. (B) In the context of the scenario, explain how [A's answer] affects [a political institution/behavior]. (C) In the context of the scenario, explain how [a different Unit-1 principle, e.g. federalism/checks] could be used to [respond/limit the action]." Rubric `[A-describe:1, B-explain-in-context:1, C-explain-second:1]` sum **3**; each part's `scoringCriteria` states the AP task-verb bar (describe = more than name; explain = cause/effect tied to the scenario) and `modelResponse` answers from the scenario only. NO passageId (scenario is inline).
- [ ] **Step 2: Quantitative Analysis (4 pts).** id `evelyn.ap.apgov.u1-frq-quantitative.v1`, standard `AP-APGOV-1-FRQ-QA`, cedTopic `'1-FRQ-QA'`. try_yourself sets **`passageId: 'evelyn.passage.apgov-federal-grants-table.v1'`** (the prompt explicitly says "Use the table to answer the question"). Authentic four parts over the table: "(A) Identify the [trend/value asked, e.g. the year with the highest share]. (B) Describe a trend in federal grants shown in the table. (C) Draw a conclusion about how that trend affects the relationship between the federal government and the states. (D) Explain how the data in the table relates to [a federalism concept, e.g. fiscal federalism/categorical grants]." Rubric `[A-identify:1, B-describe-trend:1, C-draw-conclusion:1, D-explain-pattern:1]` sum **4**; modelResponses must cite the table's ACTUAL numbers (document-fidelity: only figures the description contains).
- [ ] **Step 3: SCOTUS Comparison (4 pts).** id `evelyn.ap.apgov.u1-frq-scotus-comparison.v1`, standard `AP-APGOV-1-FRQ-SCOTUS`, cedTopic `'1-FRQ-SCOTUS'`. Required case: ***United States v. Lopez* (1995)**; nonrequired case: ***Gonzales v. Raich* (2005)**. Per spec D6, BOTH case descriptions live inline in the prompt as text (facts + constitutional issue + holding — Lopez: Gun-Free School Zones Act exceeded the commerce power, gun possession near a school is not economic activity; Raich: Congress CAN reach home-grown medical marijuana under the commerce power as part of a comprehensive national market regulation). Authentic parts: "(A) Identify the constitutional clause that is common to both *United States v. Lopez* (1995) and *Gonzales v. Raich* (2005). (B) Explain how the facts of *Lopez* led to the holding in that case. (C) Explain how the reasoning in *Lopez* differs from the reasoning that produced the holding in *Raich*. (D) Explain how the holding in *Raich* affects the balance of power between the federal government and the states." Rubric `[A-identify-clause:1, B-required-case-reasoning:1, C-compare-reasoning:1, D-explain-effect:1]` sum **4**; constitutional accuracy of both descriptions is a review gate. NO passageId (cases inline per spec).
- [ ] **Step 4: Argument Essay (6 pts).** id `evelyn.ap.apgov.u1-frq-argument-essay.v1`, standard `AP-APGOV-1-FRQ-ARG`, cedTopic `'1-FRQ-ARG'`. try_yourself with **`packetLabel:'document'`** and **`passageIds`** = the 5 foundational docs `['evelyn.passage.apush-declaration.v1','evelyn.passage.apush-constitution-preamble.v1','evelyn.passage.apush-federalist-10.v1','evelyn.passage.apush-brutus-1.v1','evelyn.passage.apgov-federalist-51.v1']`. Authentic prompt: "Develop an argument about whether the United States Constitution's system of separated powers effectively prevents the concentration of government power." with the real AP directions block: respond with a defensible thesis; support with at least TWO pieces of specific and relevant evidence, at least ONE from the foundational documents listed (Declaration of Independence, US Constitution, Federalist 10, Brutus 1, Federalist 51); use reasoning to explain why the evidence supports the thesis; respond to an opposing or alternative perspective. Rubric — the official 6-pt decomposition as six 1-pt parts (engine sums dynamically): `[A-thesis:1, B-evidence-relevant:1, C-evidence-foundational-doc:1, D-evidence-second:1, E-reasoning:1, F-alternative-perspective:1]` sum **6**; modelResponses quote/paraphrase ONLY what the seeded excerpts contain (Federalist 51's ambition/angels lines, Brutus 1's seeded objections) — broader constitutional knowledge appears as the student's own second evidence.
- [ ] **Step 5: Register** all four in `lesson-plan/store.ts`.
- [ ] **Step 6: Verify.** tsc 0. Packet + rubric sums:
```
npx tsx -e "import {SEED_PLANS} from './src/lib/tutor/lesson-plan/store'; import {resolveGradeItem} from './src/lib/tutor/portal/adapters'; for (const [id,w] of [['evelyn.ap.apgov.u1-frq-concept-application.v1',3],['evelyn.ap.apgov.u1-frq-quantitative.v1',4],['evelyn.ap.apgov.u1-frq-scotus-comparison.v1',4],['evelyn.ap.apgov.u1-frq-argument-essay.v1',6]]){ const p=SEED_PLANS.find(x=>x.id===id); const ty=p.segments.find(s=>s.kind==='try_yourself'); const gi=resolveGradeItem(id+'::'+ty.id); console.log(id.split('.')[3],'sum='+ty.rubric.parts.reduce((a,x)=>a+x.maxPoints,0)+'/'+w,'docs='+(ty.passageIds?.length||0),'pid='+(ty.passageId?1:0), gi?.passageText?.includes('Document 1')?'[Doc1..N]':''); }"
```
→ concept-application `sum=3/3 docs=0 pid=0`; quantitative `sum=4/4 docs=0 pid=1`; scotus `sum=4/4 docs=0 pid=0`; argument-essay `sum=6/6 docs=5 [Doc1..N]`. `lint-ap-plans` + `lint:passages` pass.
- [ ] **Step 7: Commit.**
```bash
git add src/lib/tutor/lesson-plan/seeds/ap-apgov-u1-frq-*.ts src/lib/tutor/lesson-plan/store.ts
git commit -m "content(apgov): four authentic AP Gov FRQ formats (CA 3pt, QA 4pt, SCOTUS 4pt, Argument 6pt)"
```

### Task 6: Topic-notes baselines

**Files:**
- Create: `src/lib/tutor/topic-notes/seeds/ap-apgov-u1-<slug>.ts` (one per content plan from Tasks 3–4: democratic-ideals, constitution-ratification, separation-of-powers, federalism)
- Modify: `src/lib/tutor/topic-notes/store.ts`

- [ ] **Step 1: Author** one baseline per content plan. Gold: `src/lib/tutor/topic-notes/seeds/ap-apworld-u2-silk-roads.ts`. `baselineId===planId`, `course:'AP US Government & Politics'`, `cedUnit:1` (NUMBER here, matching the sibling courses' notes), cedTopic/cedTitle from the plan, theory 8–12 accurate entries (clauses, cases, compromises, grant types; incl. 2–3 `kind:'definition'` — popular sovereignty, federalism, checks and balances, categorical grant, etc.), methods 1–2 (an AP Gov skill move — applying a required case, reading a data table, comparing Federalist/Anti-Federalist arguments), pointers 4–6. Text-only. Skip the four FRQ-practice plans.
- [ ] **Step 2: Register** all in `SEED_BASELINES`.
- [ ] **Step 3: Verify.** tsc 0; structural (`course==='AP US Government & Politics'` count===4, baselineId===planId for all, 0 orphan, theory ≥8 each).
- [ ] **Step 4: Commit.**
```bash
git add src/lib/tutor/topic-notes/seeds/ap-apgov-u1-*.ts src/lib/tutor/topic-notes/store.ts
git commit -m "content(apgov): Unit-1 topic-notes baselines"
```

### Task 7: Stimulus MCQ bank

**Files:**
- Create: `src/data/problem-bank/ap-us-government/u1.json`, `src/data/problem-bank/ap-us-government/_AUTHORING.md`

- [ ] **Step 1: Author** `u1.json` — ~10 stimulus MCQs in sets keyed to the Unit-1 stimuli: foundational-doc excerpt sets (Federalist 10 on faction, Brutus 1 on a large republic, Federalist 51 on ambition/double security) + a set on the described federal-grants table (inline the specific numbers each item tests). Each item **self-inlines the short quoted line/figures it tests** (verifier doesn't load the passage) + sets `passageId`, `loId` = a Unit-1 content LO, `cedCode`, difficulty 1–4, `responseFormat:'mcq'`, 4 `choices`, `answer` LETTER, `hints`. Test AP Gov reasoning: author's argument/perspective, Federalist-vs-Anti-Federalist comparison, applying *McCulloch*/*Lopez*, reading the table's trend. **DISTRIBUTE + SHUFFLE answer letters (non-cyclic); keep choice lengths comparable (correct NOT systematically longest).** Constitutionally accurate. Record cedCodes in `_AUTHORING.md`.
- [ ] **Step 2: Verify** (dry-run; ensure `.env.local` present in the worktree — copy from the main checkout if missing, gitignored): `npm run seed:problem-bank -- --course=ap-us-government --file=u1.json --dry-run` → validation + Sonnet verify solve; fix any wrong key/ambiguous stem (remember the verifier's AP-Stats persona caveat — judge its complaints skeptically). `npm run lint:passages` clean. Show answer distribution + a correct-is-longest check (aim 0–2/10).
- [ ] **Step 3: Commit** (git JSON only; Mongo seed deferred).
```bash
git add src/data/problem-bank/ap-us-government
git commit -m "content(apgov): Unit-1 stimulus MCQ bank"
```

### Task 8: Academy course

**Files:** Modify academy `tools/gen-seed.mjs` — work in `/Users/luke/Dev/academy` on branch `eng-lang-course` (which already has the Eng Lang + APUSH + APWorld blocks; stay on it so all four ship together; do NOT touch the unrelated modified crimsora doc).

- [ ] **Step 1: Add** `apUSGovernment = buildCourse({...})` after `apWorldHistory` (`tools/gen-seed.mjs:223`), mirroring it: pattern `/^ap-apgov-.*\.ts$/`, key `'AP_US_GOVERNMENT'`, title `'AP US Government & Politics'`, subject `'Government'`, fallbackTopic `'ap-us-government'`, seoMeta (title `'AP US Government & Politics — Learn with an AI tutor'`; description covering democratic ideals, the Constitution & ratification, separation of powers, federalism, and all four FRQ formats). Add to `courses` + the log/`generatedFrom` string. (The `isFrq` regex matches the `1-FRQ-*` cedTopics.)
- [ ] **Step 2: Regenerate** pointing at this worktree: `ENGINE_REPO=/Users/luke/Dev/evelynlearning/.claude/worktrees/apgov-u1 npm run seed:gen`. Verify `seed/mappings.json` has AP US Government & Politics with its Unit-1 nodes (4 content + 4 FRQ = 8), the 4 FRQ nodes typed `frq-practice`, AND Eng Lang (43) + APUSH (8) + APWorld (~8) + the other 5 courses unchanged. **Do NOT run `npm run ingest`** (deferred).
- [ ] **Step 3: Commit** (academy `eng-lang-course` branch): `git add tools/gen-seed.mjs seed/mappings.json && git commit -m "feat(academy): AP US Government course from engine apgov seeds"`.

### Task 9: Live validation gate (user-driven)

**Not a code task.** User runs one real Unit-1 session (drives port 3001) and confirms: a foundational document + the described data table render; **each of the four FRQ formats grades against its rubric** — Concept Application 3-pt, Quantitative Analysis 4-pt (grader sees the table), SCOTUS Comparison 4-pt, **Argument Essay 6-pt with the 5-document packet (Document 1..N labels)**; a stimulus MCQ set surfaces; notes render; content-filter-safe. **Only after this passes** does Phase 2 (Units 2–5) begin.

---

## Self-Review

**Spec coverage:** D1 AP Gov → all; D2 vertical slice → Tasks 2–9; D3 Unit 1 → cedUnit 1 throughout, CED 1.1–1.9 mapped across Tasks 3–4; D4 four authentic FRQ formats 3/4/4/6 → Task 5 (one step per format, dynamic summing noted); D5 zero code changes → Task 1 is the only infra touch; D6 QA figure + SCOTUS case as text → Task 2 Step 2 (described table) + Task 5 Step 3 (inline case descriptions). All six deliverables → Tasks 2 (docs), 3–4 (content plans), 5 (FRQ plans/rubrics), 6 (notes), 7 (MCQ), 8 (academy). Validation gate → Task 9. Gotchas (stray passageId, document fidelity, MCQ length-tell, verify-prompt persona) → Global Constraints + Tasks 5/7.

**Placeholder scan:** No TBD/TODO; every task names gold references, exact ids, exact prompts/parts/rubric arrays, exact verify commands. Prose authored at execution.

**Type consistency:** reuses existing `packetLabel`/`passageIds`/`resolvePassageText`/`FrqRubricPart` (no new types); rubric totals 3/4/4/6 consistent across Task 5 and its verify script; id/LO/file/subject schemes uniform (`apgov` / `ss` / `ap-us-government` / cedUnit `'1'` string in plans, `1` number in notes — matching the sibling-course convention).
