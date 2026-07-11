# AP World History Unit-2 Vertical Slice — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Unit-2 (Networks of Exchange, 1200–1450) vertical slice of AP World History: Modern — content plans + notes + DBQ/LEQ/SAQ essay practice + document set + stimulus MCQs — reusing the APUSH history infrastructure with zero code changes, validating before the 8-unit fan-out.

**Architecture:** Reuse APUSH/Eng Lang infra wholesale: the DBQ is a multi-document packet on `passageIds[]` + `packetLabel:'document'` (grader labels "Document 1..N"); documents are `Passage`s (genre `'document'`); the passage-aware grader carries over; DBQ 7 / LEQ 6 / SAQ 3 authentic rubrics. The ONLY infra touch is registering `'apworld'` in the AP-plan lint. Everything else new is global historical content.

**Tech Stack:** TypeScript, Next.js (engine), Mongo (ProblemBank + academy_portal), `@evelyn/portal-contract/v1`, ts-node test scripts, esbuild academy `gen-seed.mjs`.

**Spec:** `docs/superpowers/specs/2026-07-10-ap-world-history-design.md`

## Global Constraints

- **Documents public-domain only** — every `Passage.license === 'public-domain'`; medieval travel accounts/chronicles in PD translations. Short excerpts (~100–200 words). Cite the specific PD translation in `sourceUrl`. Content-filter: measured excerpts, no graphic spans (esp. the Black Death document — keep clinical).
- **Rubric totals authentic** — DBQ parts sum to **7**, LEQ **6**, SAQ **3**, integer, each `FrqRubricPart` with `scoringCriteria` + `modelResponse`.
- **ID scheme:** `evelyn.ap.apworld.<slug>.v1`; LO `apworld.<slug>`; files `ap-apworld-u2-<slug>.ts`; `subject:'ss'`; `curriculum:'AP'`; `topic:'ap-world-history'`; `metadata.cedUnit:'2'` (STRING).
- **`baselineId === planId`** for every topic-notes baseline.
- **NO schema/grader code changes** — the `'document'` genre, `packetLabel`, packet, and grader are all present on the parent branch and reused as-is. Only `scripts/lint-ap-plans.ts` gains `'apworld'`.
- **try_yourself `passageId` gotcha (from APUSH):** set `passageId` on a try_yourself ONLY if its prompt explicitly uses that document ("Using the excerpt below…"); else omit — a stray passageId misleads the grader.
- **DBQ/model-response fidelity (from APUSH):** attribute to a document ONLY what its SEEDED excerpt actually contains; broader knowledge = outside evidence.
- **Verify structurally, never by grep**; historical accuracy matters — per-task review.
- **Isolated worktree** `.claude/worktrees/apworld-u2` on `apworld-u2-slice` (stacked on `apush-period3-slice`). Do NOT run the dev server on port 3001–3010.
- **Test harness:** node:assert + tiny `test()` counter, run via `test:*` npm scripts. (No new tests needed — infra reused.)

## File Structure

**Phase 0 (modify):** `scripts/lint-ap-plans.ts` — add `'apworld'` to `AP_COURSE_SLUGS`.

**Phase 1 (create):**
- `src/lib/tutor/passages/seeds/apworld-*.ts` — ~7 Unit-2 documents.
- `src/lib/tutor/lesson-plan/seeds/ap-apworld-u2-*.ts` — ~5 content plans + dbq/leq/saq practice.
- `src/lib/tutor/topic-notes/seeds/ap-apworld-u2-*.ts` — ~5 baselines.
- `src/data/problem-bank/ap-world-history/u2.json` + `_AUTHORING.md`.

**Phase 1 (modify):** `passages/store.ts`, `lesson-plan/store.ts`, `topic-notes/store.ts` (register); academy `tools/gen-seed.mjs` (buildCourse block).

---

## PHASE 0 — INFRA (register apworld with the lint)

### Task 1: Register `'apworld'` in the AP-plan lint

**Files:** Modify `scripts/lint-ap-plans.ts`

- [ ] **Step 1:** In `scripts/lint-ap-plans.ts`, add `'apworld'` to the `AP_COURSE_SLUGS` array (the hardcoded list already containing `'macro'`, `'calcbc'`, …, `'englang'`, `'apush'`) so `ap-apworld-*` plans are recognized as new-format AP plans.
- [ ] **Step 2: Verify.** `npx tsx scripts/lint-ap-plans.ts` → still passes (no apworld plans yet, but the slug is registered). `npx tsc --noEmit` → 0.
- [ ] **Step 3: Commit.**
```bash
git add scripts/lint-ap-plans.ts
git commit -m "feat(apworld): register apworld course slug in lint-ap-plans"
```

---

## PHASE 1 — UNIT-2 CONTENT

> Content tasks are authored, not TDD; the gate is tsc + lint + structural audit. Documents are verbatim PD-translation excerpts. Historical accuracy is verified per-task.

### Task 2: Seed ~7 Unit-2 documents

**Files:**
- Create: `src/lib/tutor/passages/seeds/apworld-marco-polo.ts`, `apworld-ibn-battuta.ts`, `apworld-mansa-musa.ts`, `apworld-mongol-yam.ts`, `apworld-black-death.ts`, `apworld-catalan-atlas.ts`, `apworld-trans-saharan.ts` (7 docs; adjust exact set as sourcing allows)
- Modify: `src/lib/tutor/passages/store.ts` (register)

- [ ] **Step 1: Author each document seed** as a `Passage` (genre `'document'`; the Catalan Atlas as `'political-cartoon'` with a text DESCRIPTION of the visual). Source verbatim PD-translation text (Gutenberg/Wikisource/Internet Archive/Fordham Sourcebook), trim to ~100–200-word excerpts on the trade/travel theme, paragraph-delimit, accurate `wordCount`, `year` (approx date of the account, all < 1929 and the works are medieval → PD), `license:'public-domain'`, real `sourceUrl` (cite the translation). ids `evelyn.passage.apworld-<slug>.v1`. Content-filter: keep the Black Death excerpt clinical.
- [ ] **Step 2: Register** the 7 documents in `SEED_PASSAGES`.
- [ ] **Step 3: Verify.** `npm run test:passages` (ids unique, all public-domain); `npm run lint:passages` (clean); `npx tsc --noEmit` → 0. Sanity-check each `wordCount` (within ~5%).
- [ ] **Step 4: Commit.**
```bash
git add src/lib/tutor/passages
git commit -m "content(apworld): 7 public-domain Unit-2 trade-network documents"
```

### Task 3: Calibration content plan + register (STOP checkpoint)

**Files:**
- Create: `src/lib/tutor/lesson-plan/seeds/ap-apworld-u2-silk-roads.ts`
- Modify: `src/lib/tutor/lesson-plan/store.ts`

- [ ] **Step 1: Author** the plan. Gold references: the APUSH calibration plan `src/lib/tutor/lesson-plan/seeds/ap-apush-u3-causes-of-revolution.ts` (content-history semantics: concept + document analysis + SAQ-style try_yourself + misconception_check). id `evelyn.ap.apworld.silk-roads.v1`, LO `apworld.silk-roads` (standard `AP-APWORLD-2.2`), cedTopic '2.2', cedTitle 'The Silk Roads'. Segments: hook; concept (the Silk Roads' revival 1200–1450 — commercial technologies like caravanserai/credit/paper money, luxury goods, the growth of cities; `keyIdeas` + `vocabulary`; `passageId` → apworld-marco-polo); worked_example (annotated: analyze what Polo's account reveals about Silk Road commerce — sourcing/analysis steps; reference the doc in prose, no passageId field on that segment); try_yourself SAQ-style (`responseFormat:'frq'`, 3-part `[a:1,b:1,c:1]` rubric summing to 3, no passageId unless the prompt quotes a document); misconception_check (a real AP World trap — e.g. treating the Silk Roads as one road, or crediting the Mongols with inventing trade rather than intensifying/securing it); recap. `subject:'ss'`, `metadata.cedUnit:'2'`, `pacingThresholds: AP_PACING_THRESHOLDS`, `source: AP_SOURCE`. Plan-level `estimatedMinutes` = segment sum.
- [ ] **Step 2: Register** in `lesson-plan/store.ts`.
- [ ] **Step 3: Verify.** `npx tsc --noEmit` → 0; `npx tsx scripts/lint-ap-plans.ts` → passes (apworld recognized); `npm run lint:passages` → clean. Structural: segment kinds in order, rubric sums to 3, estMin===segSum, passageId resolves.
- [ ] **Step 4: Commit.**
```bash
git add src/lib/tutor/lesson-plan/seeds/ap-apworld-u2-silk-roads.ts src/lib/tutor/lesson-plan/store.ts
git commit -m "content(apworld): Unit-2 calibration plan — the Silk Roads"
```

**STOP — calibration checkpoint.** Gold template for the remaining content plans + establishes AP World content-course semantics. Review before Task 4.

### Task 4: Remaining Unit-2 content plans

**Files:**
- Create: `ap-apworld-u2-indian-ocean-trade.ts` (LO `apworld.indian-ocean-trade`, cedTopic 2.3), `ap-apworld-u2-trans-saharan-trade.ts` (2.4, `apworld.trans-saharan-trade`), `ap-apworld-u2-mongol-empire.ts` (2.1/2.5, `apworld.mongol-empire`), `ap-apworld-u2-cultural-diffusion.ts` (2.6/2.7, `apworld.cultural-diffusion` — cultural/technological/biological diffusion incl. the Black Death)
- Modify: `src/lib/tutor/lesson-plan/store.ts`

- [ ] **Step 1: Author** each plan copying the Task-3 template. Each: historical `concept`, `worked_example` analyzing a document (set `concept.passageId` to a relevant Unit-2 document — Ibn Battuta for Indian Ocean, Mansa Musa/al-Umari for trans-Saharan, Mongol-yam for the Mongols, Black Death for diffusion), a SAQ-style `try_yourself` (3-pt integer rubric; passageId only if the prompt quotes a doc), a real AP World `misconception_check`, hook/recap. Wire prerequisites/followUps within the unit + to the calibration LO — every referenced id must be a real LO. `estimatedMinutes` = segment sum. Historically accurate (dynasties, dates, geography, monsoon/dhow mechanics, gold-salt trade, Pax Mongolica).
- [ ] **Step 2: Register** all in `lesson-plan/store.ts`.
- [ ] **Step 3: Verify.** tsc 0; `lint-ap-plans` passes; `lint:passages` clean; structural rubric audit (each try_yourself rubric integer total with per-part fields); 0 dangling refs (walk SEED_PLANS `evelyn.ap.apworld.` prereqs/followUps).
- [ ] **Step 4: Commit.**
```bash
git add src/lib/tutor/lesson-plan/seeds/ap-apworld-u2-*.ts src/lib/tutor/lesson-plan/store.ts
git commit -m "content(apworld): Unit-2 content plans (Indian Ocean, trans-Saharan, Mongols, diffusion)"
```

### Task 5: Essay-practice plans — DBQ, LEQ, SAQ

**Files:**
- Create: `ap-apworld-u2-dbq-practice.ts`, `ap-apworld-u2-leq-practice.ts`, `ap-apworld-u2-saq-practice.ts`
- Modify: `src/lib/tutor/lesson-plan/store.ts`

Gold reference for shape: `src/lib/tutor/lesson-plan/seeds/ap-apush-u3-dbq-practice.ts` / `-leq-practice.ts` / `-saq-practice.ts`.

- [ ] **Step 1: DBQ plan.** id `evelyn.ap.apworld.u2-dbq-practice.v1`, LO `apworld.u2-dbq-practice` (`AP-APWORLD-2-DBQ`), cedTopic '2-DBQ'. prerequisites = the Unit-2 content LOs. Segments: hook; concept (frames the DBQ + 7 rubric rows); ONE full-essay `try_yourself` — `responseFormat:'frq'`, **`packetLabel:'document'`**, **`passageIds`** = the 7 Unit-2 document ids, a real AP-style DBQ prompt (e.g. "Evaluate the extent to which trade networks transformed Afro-Eurasia in the period from 1200 to 1450." with the AP directions: use ≥6 docs, ≥1 outside evidence, source ≥3 docs, complexity), `expectedAnswer`, and the **7-point rubric** `[A-thesis:1, B-context:1, C-doc-evidence:2, D-outside-evidence:1, E-sourcing:1, F-complexity:1]` — each part real scoringCriteria + modelResponse (reference specific documents by their ACTUAL content + real outside evidence, e.g. the astrolabe/compass, the Black Death's demographic impact, Zheng He's later voyages as contrast). recap.
- [ ] **Step 2: LEQ plan.** id `evelyn.ap.apworld.u2-leq-practice.v1`, cedTopic '2-LEQ'. Full-essay `try_yourself`: `responseFormat:'frq'`, NO passages, a real LEQ prompt (e.g. "Evaluate the extent to which the Mongol Empire facilitated cross-regional exchange in the period 1200–1450."), **6-point rubric** `[A-thesis:1, B-context:1, C-evidence:2, D-analysis:2]`.
- [ ] **Step 3: SAQ plan.** id `evelyn.ap.apworld.u2-saq-practice.v1`, cedTopic '2-SAQ'. `try_yourself`: `responseFormat:'frq'`, a 3-part SAQ prompt (may quote ONE document if the prompt says "using the excerpt below" → then set that single `passageId`), **3-point rubric** `[a:1,b:1,c:1]`.
- [ ] **Step 4: Register** all three.
- [ ] **Step 5: Verify.** tsc 0. Packet + rubrics:
`npx tsx -e "import {SEED_PLANS} from './src/lib/tutor/lesson-plan/store'; import {resolveGradeItem} from './src/lib/tutor/portal/adapters'; for (const [id,w] of [['evelyn.ap.apworld.u2-dbq-practice.v1',7],['evelyn.ap.apworld.u2-leq-practice.v1',6],['evelyn.ap.apworld.u2-saq-practice.v1',3]]){ const p=SEED_PLANS.find(x=>x.id===id); const ty=p.segments.find(s=>s.kind==='try_yourself'); const gi=resolveGradeItem(id+'::'+ty.id); console.log(id.split('.')[3],'sum='+ty.rubric.parts.reduce((a,x)=>a+x.maxPoints,0)+'/'+w,'docs='+(ty.passageIds?.length||0), gi?.passageText?.includes('Document 1')?'[Doc1..N]':''); }"`
→ DBQ `sum=7/7 docs=7 [Doc1..N]`, LEQ `sum=6/6 docs=0`, SAQ `sum=3/3`. `lint-ap-plans` + `lint:passages` pass.
- [ ] **Step 6: Commit.**
```bash
git add src/lib/tutor/lesson-plan/seeds/ap-apworld-u2-*q-practice.ts src/lib/tutor/lesson-plan/store.ts
git commit -m "content(apworld): Unit-2 DBQ (7pt, 7-doc packet) + LEQ (6pt) + SAQ (3pt)"
```

### Task 6: Topic-notes baselines

**Files:**
- Create: `src/lib/tutor/topic-notes/seeds/ap-apworld-u2-<slug>.ts` (one per content plan from Tasks 3–4)
- Modify: `src/lib/tutor/topic-notes/store.ts`

- [ ] **Step 1: Author** one baseline per content plan. Gold: `src/lib/tutor/topic-notes/seeds/ap-apush-u3-causes-of-revolution.ts`. `baselineId===planId`, `course:'AP World History'`, `cedUnit:2` (number), cedTopic/cedTitle from the plan, theory 8–12 (accurate events/dates/figures/geography, incl. 2–3 `kind:'definition'` — Silk Roads, monsoon, caravanserai, Pax Mongolica, diaspora, etc.), methods 1–2 (a history-skill move — HIPP sourcing / causation / comparison), pointers 4–6. Text-only. Skip the essay-practice plans.
- [ ] **Step 2: Register** all in `SEED_BASELINES`.
- [ ] **Step 3: Verify.** tsc 0; structural (`course==='AP World History'` count===content-plan count, 0 mismatch, 0 orphan, theoryMin ≥8).
- [ ] **Step 4: Commit.**
```bash
git add src/lib/tutor/topic-notes/seeds/ap-apworld-u2-*.ts src/lib/tutor/topic-notes/store.ts
git commit -m "content(apworld): Unit-2 topic-notes baselines"
```

### Task 7: Stimulus MCQ bank

**Files:**
- Create: `src/data/problem-bank/ap-world-history/u2.json`, `src/data/problem-bank/ap-world-history/_AUTHORING.md`

- [ ] **Step 1: Author** `u2.json` — ~10 stimulus MCQs in sets keyed to Unit-2 documents. Each item **self-inlines the short quoted document line/description it tests** (verifier doesn't load the passage) + sets `passageId`, `loId` = a Unit-2 content LO, `cedCode`, difficulty 1–4, `responseFormat:'mcq'`, 4 `choices`, `answer` LETTER, `hints`. Test AP World reasoning: sourcing/POV, contextualization, causation, comparison, continuity/change — anchored to the trade documents. **DISTRIBUTE + SHUFFLE answer letters (non-cyclic); keep choice lengths comparable (correct NOT systematically longest — the APUSH length-tell trap).** Historically accurate. Record cedCodes in `_AUTHORING.md`.
- [ ] **Step 2: Verify** (dry-run; ensure `.env.local` present in the worktree — copy from the main checkout if missing, gitignored): `npm run seed:problem-bank -- --course=ap-world-history --file=u2.json --dry-run` → validation + Sonnet verify solve; fix any wrong key/ambiguous stem. `npm run lint:passages` clean. Show answer distribution + a correct-is-longest check (aim 0–2/10).
- [ ] **Step 3: Commit** (git JSON only; Mongo seed deferred).
```bash
git add src/data/problem-bank/ap-world-history
git commit -m "content(apworld): Unit-2 stimulus MCQ bank"
```

### Task 8: Academy course

**Files:** Modify academy `tools/gen-seed.mjs` — work in `/Users/luke/Dev/academy` on branch `eng-lang-course` (which already has Eng Lang + APUSH blocks; stay on it so all three ship together; do NOT touch the unrelated modified crimsora doc).

- [ ] **Step 1: Add** `apWorldHistory = buildCourse({...})` mirroring `apUSHistory`: pattern `/^ap-apworld-.*\.ts$/`, key `'AP_WORLD_HISTORY'`, title `'AP World History: Modern'`, subject `'World History'`, fallbackTopic `'ap-world-history'`, engine coords `{subject:'ss', level:'ap', topic:'ap-world-history'}`, seoMeta. Add to `courses` + the log/`generatedFrom` string. (The `isFrq` regex already matches dbq/leq/saq from the APUSH fix.)
- [ ] **Step 2: Regenerate** pointing at this worktree: `ENGINE_REPO=/Users/luke/Dev/evelynlearning/.claude/worktrees/apworld-u2 npm run seed:gen`. Verify `seed/mappings.json` has AP World History with its Unit-2 nodes (5 content + dbq/leq/saq = ~8), the 3 essay nodes typed `frq-practice`, AND Eng Lang (43) + APUSH (8) + the other 5 courses unchanged. **Do NOT run `npm run ingest`** (deferred).
- [ ] **Step 3: Commit** (academy `eng-lang-course` branch): `git add tools/gen-seed.mjs seed/mappings.json && git commit -m "feat(academy): AP World History course from engine apworld seeds"`.

### Task 9: Live validation gate (user-driven)

**Not a code task.** User runs one real Unit-2 session (drives port 3001) and confirms: a document renders; the **DBQ grades 7-pt with all documents (Document 1..N labels)**; a **SAQ grades 3-pt**, a **LEQ 6-pt**; a stimulus MCQ set surfaces; notes render; content-filter-safe. **Only after this passes** does Phase 2 (Units 1, 3–9) begin.

---

## Self-Review

**Spec coverage:** D1 AP World → all; D2 vertical slice → Tasks 2–9; D3 Unit 2 → cedUnit 2 throughout; D4 infra reuse → Task 1 only (no schema/grader changes); D5 id scheme → constraints + every task; D6 documents → Task 2. All six components → Tasks 2 (docs), 3–4 (plans), 5 (essays/rubrics), 6 (notes), 7 (MCQ), 8 (academy). Validation → Task 9. APUSH gotchas (passageId, doc-fidelity, MCQ length-tell) → carried into Global Constraints + Tasks 4/5/7.

**Placeholder scan:** No TBD/TODO; content tasks name gold references, exact ids, exact verify commands. Prose authored at execution.

**Type consistency:** reuses the existing `packetLabel`/`passageIds`/`resolvePassageText` (no new types); DBQ 7 / LEQ 6 / SAQ 3 totals consistent; id/LO/file/subject schemes uniform (`apworld` / `ss` / `ap-world-history` / cedUnit 2).
