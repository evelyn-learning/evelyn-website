# AP US History Periods 1–2 & 4–9 Fan-out — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete AP US History by authoring Periods 1–2 and 4–9 on the validated Period-3 patterns: 36 content plans + 36 notes baselines + 24 FRQ-practice plans (DBQ/LEQ/SAQ per period) + 76 stimulus MCQs + 37 new passages — content-only, zero engine or academy code changes.

**Architecture:** Everything reuses the P3 slice wholesale: documents are `Passage`s (genres `'document'`/`'constitution'`/`'political-cartoon'` for described visuals & data tables), DBQs are `passageIds[]` packets with `packetLabel:'document'` (grader labels `Document 1..5`), rubrics are `FrqRubric`s summing 7/6/3, MCQs go to `src/data/problem-bank/ap-us-history/u<N>.json`. The academy `ap-us-history` buildCourse block already matches `/^ap-apush-.*\.ts$/` — new periods flow through `gen-seed` regeneration automatically.

**Tech Stack:** TypeScript, Next.js (engine), Mongo (ProblemBank), tsx scripts, esbuild academy `gen-seed.mjs`.

**Spec:** `docs/superpowers/specs/2026-07-11-apush-periods-fanout-design.md`

## Global Constraints

- **Worktree:** branch `apush-periods-fanout` off engine `main` (≥ `5bf5b13`), repo-local at `.claude/worktrees/apush-fanout` (NOT /tmp — Turbopack rejects cross-filesystem node_modules symlinks). Copy `.env.local` from the main checkout (gitignored; needed for MCQ dry-run verify). Do NOT run the dev server on ports 3001–3010.
- **Zero code changes** — content files + store registrations + JSON only. `'apush'` is already in `lint-ap-plans` `AP_COURSE_SLUGS`; the genres and `packetLabel` already exist.
- **Passages: pre-1929 PD texts + US-government works ONLY**, `license:'public-domain'`, real `sourceUrl`. **Verbatim excerpts must be contiguous substrings of the actual source text** — fetch RAW text (Gutenberg .txt / avalon.law.yale.edu / founders.archives.gov / NARA / presidency.ucsb.edu / govinfo.gov / supremecourt.gov), mark elisions with ellipses, accurate `wordCount` (±5%). NEVER quote from search-result snippets (APWorld Task-2 CRITICAL precedent).
- **Copyrighted landmarks = authored in-plan descriptions, ZERO quoted text, never a Passage, never in a packet:** MLK (all works), Friedan, Port Huron Statement, "Broken Spears"/modern translations, any post-1928 non-government text.
- **Described visuals & data tables:** genre `'political-cartoon'`, fullText opens `[DATA TABLE — description]` or `[VISUAL — description]` (gold: `apgov-federal-grants-table.ts`, `apush-join-or-die.ts`), REAL published figures verified against the named source while authoring, internally consistent, units stated.
- **Rubric shapes (P3 verbatim, used by every period's Task 3):** DBQ (7): `[A-thesis:1, B-context:1, C-doc-evidence:2, D-outside-evidence:1, E-sourcing:1, F-complexity:1]` with `packetLabel:'document'` + the period's 5-doc `passageIds`; LEQ (6): `[A-thesis:1, B-context:1, C-evidence:2, D-analysis:2]`, no passages; SAQ (3): `[a:1, b:1, c:1]`. Integer `maxPoints`; every `FrqRubricPart` has real `scoringCriteria` (AP task-verb bar) + `modelResponse`.
- **ID scheme (identical to P3):** plans `evelyn.ap.apush.<slug>.v1`; LO `apush.<slug>`; standards `AP-APUSH-<ced>`; files `ap-apush-u<N>-<slug>.ts`; passages `evelyn.passage.apush-<slug>.v1`; `subject:'ss'`; `curriculum:'AP'`; `topic:'ap-us-history'`; `grade:'11'`; `locale:'en'`; `metadata.cedUnit:'<N>'` (STRING in plans; NUMBER in notes); `pacingThresholds: AP_PACING_THRESHOLDS`; `source: AP_SOURCE`; plan `estimatedMinutes` = segment sum; plan titles `'P<N>.<t> <Title>'` style is NOT used — follow P3's `'U3.2 Causes of the American Revolution'` pattern: `'U<N>.<t> <Title>'`.
- **try_yourself `passageId` gotcha:** set `passageId`/`passageIds` ONLY if the prompt explicitly uses the document ("The excerpt above…", "Use the documents…"); else omit (P3 Task-3 Important precedent).
- **Document fidelity:** attribute to a passage only what its seeded excerpt contains; broader famous arguments = the student's own outside evidence in modelResponses (P3 Task-5 Important precedent).
- **Notes baselines:** `baselineId === planId`, `course:'AP United States History'`, `cedUnit:<N>` NUMBER, theory 8–12 accurate entries (2–3 `kind:'definition'`), methods 1–2 (document-analysis moves: sourcing/HIPP, reading a data table), pointers 4–6. Skip FRQ plans. Text-only.
- **MCQ authoring:** each item self-inlines the short quote/figures it tests (verifier doesn't load passages); `passageId` must resolve in the registry; 4 choices; answer letters DISTRIBUTED + SHUFFLED (non-cyclic); correct answer NOT systematically longest (aim 0–2/file); `loId` = a content LO from the same period; `cedCode` mirrors the LO's `standard`; difficulty 1–4; `hints`; update `_AUTHORING.md` with the per-LO table.
- **Measured, exam-neutral tone** on sensitive material: slavery, Indian removal, internment, civil rights violence, 9/11 — factual, no graphic spans, short excerpts.
- **Prerequisites:** wire within-period + to earlier-period LOs from the LO table below (all strings pre-specified; P3's existing LOs: `apush.causes-of-revolution`, `apush.revolutionary-ideals`, `apush.articles-of-confederation`, `apush.constitution-ratification`, `apush.new-republic`). Full dangling-ref check at Task 33 (periods may execute in parallel).
- **Verify structurally, never by grep.**
- **Gates every task:** `npx tsc --noEmit` → 0; `npx tsx scripts/lint-ap-plans.ts` passes; `npm run lint:passages` clean (when passages touched); commit at task end (message given per task).

**Gold references (copy these shapes exactly):** content plan + calibration semantics `ap-apush-u3-causes-of-revolution.ts`; other content plans `ap-apush-u3-{revolutionary-ideals,articles-of-confederation,constitution-ratification,new-republic}.ts`; FRQ plans `ap-apush-u3-{dbq,leq,saq}-practice.ts`; notes `topic-notes/seeds/ap-apush-u3-*.ts`; text passage `apush-common-sense.ts`; described visual `apush-join-or-die.ts`; data table `apgov-federal-grants-table.ts`; MCQs `problem-bank/ap-us-history/u3.json` + `_AUTHORING.md`.

**Per-period rubric/packet verify one-liner** (run in each period's Task 3, substituting N):

```bash
npx tsx -e "import {SEED_PLANS} from './src/lib/tutor/lesson-plan/store'; import {resolveGradeItem} from './src/lib/tutor/portal/adapters'; for (const [id,want,docs] of [['evelyn.ap.apush.uN-dbq-practice.v1',7,5],['evelyn.ap.apush.uN-leq-practice.v1',6,0],['evelyn.ap.apush.uN-saq-practice.v1',3,0]]){ const p=SEED_PLANS.find(x=>x.id===id); const ty=p.segments.find(s=>s.kind==='try_yourself'); const sum=ty.rubric.parts.reduce((a,x)=>a+x.maxPoints,0); const gi=resolveGradeItem(id+'::'+ty.id); console.log(id, sum===want?'OK':'FAIL sum='+sum, (ty.passageIds?.length||0)===docs?'':'FAIL docs', docs>0?(gi?.passageText?.includes('Document 1')&&gi?.passageText?.includes('Document 5')?'[Doc1..5]':'PACKET-FAIL'):''); }"
```

**MCQ dry-run per period** (Task 4): `npm run seed:problem-bank -- --course=ap-us-history --file=u<N>.json --dry-run` → all pass; fix any mismatch by re-examining the key first; print answer-letter distribution + correct-is-longest count.

## File Structure

Per period `N ∈ {1,2,4,5,6,7,8,9}`:
- `src/lib/tutor/passages/seeds/apush-<slug>.ts` (Task N.1) + register in `passages/store.ts`
- `src/lib/tutor/lesson-plan/seeds/ap-apush-u<N>-<slug>.ts` (Tasks N.2 content, N.3 FRQ) + register in `lesson-plan/store.ts`
- `src/lib/tutor/topic-notes/seeds/ap-apush-u<N>-<slug>.ts` (Task N.2) + register in `topic-notes/store.ts`
- `src/data/problem-bank/ap-us-history/u<N>.json` (Task N.4) + `_AUTHORING.md` update

Academy (`/Users/luke/Dev/academy`, branch `apush-periods-fanout`): regenerated `seed/mappings.json` only (Task 34).

## LO table (pre-specified; the single source of truth for prereq wiring)

| Period | LO (all prefixed `apush.`) | standard | cedTopic | file slug |
|---|---|---|---|---|
| 1 | `native-societies` | AP-APUSH-1.2 | 1.2-1.3 | u1-native-societies |
| 1 | `columbian-exchange` | AP-APUSH-1.4 | 1.4-1.5 | u1-columbian-exchange |
| 1 | `spanish-colonization` | AP-APUSH-1.6 | 1.6-1.7 | u1-spanish-colonization |
| 2 | `colonial-regions` | AP-APUSH-2.2 | 2.2-2.3 | u2-colonial-regions |
| 2 | `transatlantic-economy` | AP-APUSH-2.4 | 2.4 | u2-transatlantic-economy |
| 2 | `slavery-colonies` | AP-APUSH-2.6 | 2.6 | u2-slavery-colonies |
| 2 | `colonial-society` | AP-APUSH-2.7 | 2.5/2.7 | u2-colonial-society |
| 4 | `jefferson-era` | AP-APUSH-4.2 | 4.2-4.4 | u4-jefferson-era |
| 4 | `market-revolution` | AP-APUSH-4.5 | 4.5-4.7 | u4-market-revolution |
| 4 | `jacksonian-democracy` | AP-APUSH-4.8 | 4.8-4.9 | u4-jacksonian-democracy |
| 4 | `reform-awakening` | AP-APUSH-4.10 | 4.10-4.11 | u4-reform-awakening |
| 4 | `slavery-south` | AP-APUSH-4.12 | 4.12-4.13 | u4-slavery-south |
| 5 | `manifest-destiny` | AP-APUSH-5.2 | 5.2-5.3 | u5-manifest-destiny |
| 5 | `sectional-crisis` | AP-APUSH-5.4 | 5.4-5.6 | u5-sectional-crisis |
| 5 | `secession-civil-war` | AP-APUSH-5.7 | 5.7-5.8 | u5-secession-civil-war |
| 5 | `emancipation` | AP-APUSH-5.9 | 5.9 | u5-emancipation |
| 5 | `reconstruction` | AP-APUSH-5.10 | 5.10-5.11 | u5-reconstruction |
| 6 | `the-west-new-south` | AP-APUSH-6.2 | 6.2-6.3 | u6-the-west |
| 6 | `industrialization-big-business` | AP-APUSH-6.4 | 6.4-6.6 | u6-industrialization |
| 6 | `labor-movement` | AP-APUSH-6.7 | 6.7 | u6-labor |
| 6 | `immigration-urbanization` | AP-APUSH-6.8 | 6.8-6.10 | u6-immigration-urbanization |
| 6 | `gilded-politics-populism` | AP-APUSH-6.11 | 6.11-6.13 | u6-gilded-politics-populism |
| 7 | `imperialism` | AP-APUSH-7.2 | 7.2-7.3 | u7-imperialism |
| 7 | `progressivism` | AP-APUSH-7.4 | 7.4-7.5 | u7-progressivism |
| 7 | `wwi` | AP-APUSH-7.6 | 7.6-7.8 | u7-wwi |
| 7 | `twenties` | AP-APUSH-7.9 | 7.9-7.10 | u7-twenties |
| 7 | `depression-new-deal` | AP-APUSH-7.11 | 7.11-7.12 | u7-depression-newdeal |
| 7 | `wwii` | AP-APUSH-7.13 | 7.13-7.15 | u7-wwii |
| 8 | `cold-war-origins` | AP-APUSH-8.2 | 8.2-8.3 | u8-cold-war |
| 8 | `postwar-society` | AP-APUSH-8.4 | 8.4-8.6 | u8-postwar-society |
| 8 | `civil-rights-movement` | AP-APUSH-8.9 | 8.9-8.10 | u8-civil-rights |
| 8 | `sixties-vietnam` | AP-APUSH-8.11 | 8.7-8.8/8.11-8.13 | u8-sixties-vietnam |
| 8 | `seventies-crisis` | AP-APUSH-8.14 | 8.14-8.15 | u8-seventies |
| 9 | `conservative-resurgence` | AP-APUSH-9.2 | 9.2-9.3 | u9-conservative-resurgence |
| 9 | `globalization-tech` | AP-APUSH-9.4 | 9.4-9.5 | u9-globalization |
| 9 | `america-since-2001` | AP-APUSH-9.6 | 9.6 | u9-since-2001 |

FRQ plan ids per period: `evelyn.ap.apush.u<N>-dbq-practice.v1` / `u<N>-leq-practice.v1` / `u<N>-saq-practice.v1`; LOs `apush.u<N>-dbq-practice` etc.; standards `AP-APUSH-<N>-DBQ|LEQ|SAQ`; cedTopics `'<N>-DBQ'|'<N>-LEQ'|'<N>-SAQ'`; files `ap-apush-u<N>-{dbq,leq,saq}-practice.ts`.

---

## TASK TEMPLATES (every period runs these 4 tasks; per-period specifics below)

### Template Task N.1 — Passages
Author the period's passage seeds listed in its spec block (verbatim excerpts ~100–200 words where the source allows; described visuals/tables per Global Constraints), register in `SEED_PASSAGES`, verify `npm run test:passages` + `npm run lint:passages` + tsc 0, re-read tables for internal consistency, commit `content(apush): P<N> passages — <list>`.

### Template Task N.2 — Content plans + notes baselines
Author the period's content plans (gold: `ap-apush-u3-causes-of-revolution.ts`): hook; `concept` (keyIdeas + vocabulary; `passageId` where the period block wires one); `worked_example` (annotated analysis of the wired document — quote ONLY the seeded excerpt); ONE `try_yourself` SAQ-style short answer (`responseFormat:'frq'`, 3×1-pt rubric, passageId only if prompt-referenced); `misconception_check` (real APUSH traps listed per period); recap. Prereqs per the LO table. Then author one notes baseline per plan (same task — keep quotes/facts consistent). Register both stores; verify tsc 0 + `lint-ap-plans` + structural (plans found, rubric sums 3, estimatedMinutes = segment sum, passageIds resolve, baselineId===planId, theory ≥8); commit `content(apush): P<N> content plans + notes (<slugs>)`.

### Template Task N.3 — DBQ/LEQ/SAQ practice plans
Gold: `ap-apush-u3-{dbq,leq,saq}-practice.ts`. DBQ: concept frames the 7 rubric rows; ONE try_yourself with the period's prompt + `packetLabel:'document'` + the 5 `passageIds` + the 7-pt rubric; modelResponses attribute to each document only its seeded content. LEQ: the period's prompt, 6-pt rubric, no passages. SAQ: the period's 3-part prompt, 3-pt rubric, stimulus only where the period block says so. Prereqs = the period's content LOs. Register; verify with the one-liner (sum 7/6/3, `[Doc1..5]`); tsc 0; lint-ap-plans; commit `content(apush): P<N> DBQ/LEQ/SAQ practice`.

### Template Task N.4 — MCQ bank
Author `u<N>.json` per Global MCQ constraints — stimulus sets keyed to the period's passages (self-inlined quotes/figures) + non-stimulus items covering remaining LOs; every content LO gets ≥1 item. Update `_AUTHORING.md` (per-LO table + anchoring docs). Dry-run verify → all pass; distribution shown; commit `content(apush): P<N> stimulus MCQ bank (<count>)`.

---

## PERIOD BLOCKS (specifics consumed by the templates)

### PERIOD 1 (1491–1607) — Tasks 1–4

**Passages (5):**
- `apush-columbus-letter.ts` — Columbus, letter to Luis de Santángel (1493), genre `'document'`, PD translation (e.g. the 1893 quatercentenary trans.; Gutenberg/Wikisource). Excerpt: descriptions of the islands' abundance + the natives "artless and generous"; year 1493.
- `apush-las-casas.ts` — Bartolomé de Las Casas, *A Short Account of the Destruction of the Indies* (1542), PD translation. Measured excerpt on encomienda cruelty + his advocacy framing (no graphic spans).
- `apush-cortes-tenochtitlan.ts` — Hernán Cortés, Second Letter to Charles V (1520), PD translation. Excerpt describing Tenochtitlan's markets/causeways/scale.
- `apush-codex-mendoza.ts` — `[VISUAL — description]`, genre `'political-cartoon'`, Codex Mendoza tribute folio (c. 1541): factual description of tribute lists (cotton mantles, feathers, maize) showing Aztec imperial organization; sourceUrl to the Bodleian digital facsimile.
- `apush-hakluyt-western-planting.ts` — Richard Hakluyt, *Discourse of Western Planting* (1584). Excerpt on English motives: commodities, employment, countering Spain, spreading religion.

**Content plans (3)** — per LO table. Wiring: `native-societies` (no passage; misconceptions: "pre-contact America was an empty wilderness", "Native societies were uniform"); `columbian-exchange` (concept.passageId → `apush-columbus-letter.v1`; worked_example analyzes Columbus's framing of the encounter; misconception: "the Exchange flowed one way"); `spanish-colonization` (concept.passageId → `apush-las-casas.v1`; worked_example: Las Casas as evidence of internal Spanish debate (Valladolid); misconceptions: "all Europeans colonized the same way", "Las Casas ended the encomienda"). Prereqs: within-period chain native-societies → columbian-exchange → spanish-colonization.

**FRQ:** DBQ prompt: "Evaluate the extent to which European contact transformed the Americas in the period 1491–1607." Packet: columbus-letter, las-casas, cortes-tenochtitlan, codex-mendoza, hakluyt-western-planting. LEQ: "Evaluate the extent to which the Columbian Exchange transformed societies on either side of the Atlantic in the period 1491–1607." SAQ (no stimulus): (a) Briefly describe ONE way Native American societies adapted to their environments before 1492; (b) Explain ONE way the Columbian Exchange altered Native American life; (c) Explain ONE way Spanish colonial labor systems shaped colonial society.

**MCQs (8):** columbus set 2, las-casas set 2, cortes 1, codex-mendoza 1, hakluyt 1, non-stimulus native-societies 1.

### PERIOD 2 (1607–1754) — Tasks 5–8

**Passages (5):**
- `apush-mayflower-compact.ts` — Mayflower Compact (1620), genre `'constitution'`, full short text (~200 words), Avalon sourceUrl.
- `apush-winthrop-charity.ts` — Winthrop, *A Model of Christian Charity* (1630), "city upon a hill" passage + covenant framing.
- `apush-bacon-declaration.ts` — Nathaniel Bacon, *Declaration of the People* (1676), grievances against Berkeley (taxes, frontier defense, favorites).
- `apush-equiano.ts` — Olaudah Equiano, *Interesting Narrative* (1789), Middle Passage excerpt chosen for restraint (conditions + fear, no graphic spans), Gutenberg raw text.
- `apush-edwards-sinners.ts` — Jonathan Edwards, *Sinners in the Hands of an Angry God* (1741), the spider/bow imagery kept short + the call to awakening.

**Content plans (4):** `colonial-regions` (passageId → `apush-winthrop-charity.v1`; worked_example: covenant community as the New England model vs Chesapeake profit motive; misconceptions: "all colonists came for religious freedom", "Puritans practiced religious tolerance"); `transatlantic-economy` (no passage; mercantilism, Navigation Acts, triangular trade, consumer revolution, salutary-neglect origins — consistent with P3's to-1763 framing; misconception: "Navigation Acts were strictly enforced from the start"); `slavery-colonies` (passageId → `apush-equiano.v1`; worked_example sources Equiano (audience: British abolition debate); Middle Passage, regional variation, slave codes/hereditary status, Stono 1739 + covert resistance; measured tone; misconception: "slavery was only Southern"); `colonial-society` (passageId → `apush-edwards-sinners.v1`; Anglicization, print culture, Enlightenment vs Awakening (Edwards/Whitefield), colonial assemblies; misconception: "the Awakening was elite-driven" / "Enlightenment and Awakening were the same impulse"). Prereqs: within-period + `apush.spanish-colonization` (contrast) where natural.

**FRQ:** DBQ: "Evaluate the extent to which British North American colonial societies developed distinct from England in the period 1607–1754." Packet: all 5. LEQ: "Evaluate the extent to which environmental and geographic factors shaped the development of regional colonial societies in the period 1607–1754." SAQ (stimulus: `apush-winthrop-charity.v1`, prompt quotes "city upon a hill"): (a) Describe Winthrop's purpose in the excerpt; (b) Explain ONE way New England society reflected the vision in the excerpt; (c) Explain ONE way a DIFFERENT colonial region's development contrasted with that vision.

**MCQs (8):** winthrop 2, mayflower 1, bacon 1, equiano 2, edwards 1, non-stimulus transatlantic-economy 1.

### PERIOD 4 (1800–1848) — Tasks 9–12

**Passages (5):**
- `apush-jefferson-inaugural.ts` — Jefferson, First Inaugural (1801, gov work), "We are all Republicans, we are all Federalists" + limited-government creed; Avalon/NARA.
- `apush-monroe-doctrine.ts` — Monroe's 1823 annual message excerpt (the doctrine paragraphs), gov work.
- `apush-jackson-bank-veto.ts` — Jackson, Bank Veto Message (1832, gov work), "the rich and powerful too often bend the acts of government" passage.
- `apush-seneca-falls.ts` — Declaration of Sentiments (1848), "all men and women are created equal" + grievance frame.
- `apush-garrison-liberator.ts` — Garrison, *The Liberator* No. 1 (1831), "I am in earnest — I will not equivocate… I WILL BE HEARD."
**Content plans (5)** per LO table: `jefferson-era` (passageId → jefferson-inaugural; Revolution of 1800, Marshall Court (wire prereq `apush.constitution-ratification` + `apush.new-republic`), Louisiana Purchase (pragmatism vs strict construction), embargo, War of 1812, Era of Good Feelings, Monroe Doctrine, Missouri Compromise; misconception: "Jefferson governed as a strict constructionist throughout"); `market-revolution` (no passage; transport revolution (Erie Canal), Lowell mills, interchangeable parts, commercial agriculture, Irish/German immigration, cult of domesticity; misconception: "the Market Revolution industrialized the whole country evenly"); `jacksonian-democracy` (passageId → jackson-bank-veto; expanded white male suffrage, spoils, Bank War, nullification crisis, Indian Removal/Trail of Tears/Worcester — measured; misconceptions: "Jacksonian democracy extended to everyone", "the Bank veto was economically neutral"); `reform-awakening` (passageId → seneca-falls; Finney/burned-over district, temperance, abolition (Garrison/Douglass), Seneca Falls, utopias, Mann; misconception: "reform movements were universally popular"); `slavery-south` (passageId → garrison-liberator as the abolitionist counterpoint; cotton gin, internal slave trade, planter/yeoman structure, enslaved family/culture/resistance (Nat Turner), hardening proslavery ideology; measured tone; misconception: "most white Southerners owned slaves").

**FRQ:** DBQ: "Evaluate the extent to which democratic ideals expanded in American society in the period 1800–1848." Packet: all 5. LEQ: "Evaluate the extent to which the Market Revolution changed American society in the period 1800–1848." SAQ (stimulus: `apush-seneca-falls.v1`): (a) Describe the strategy the excerpt uses to advance its claim; (b) Explain ONE historical development that led to the convention; (c) Explain ONE way other antebellum reform movements shared the excerpt's approach.

**MCQs (10):** jefferson 2, monroe 1, jackson-veto 2, seneca-falls 2, garrison 1, non-stimulus market-revolution 2.

### PERIOD 5 (1844–1877) — Tasks 13–16

**Passages (3 new + 2 REUSED: `evelyn.passage.lincoln-gettysburg.v1`, `evelyn.passage.douglass-fourth-of-july.v1` — do NOT re-seed):**
- `apush-osullivan-annexation.ts` — John O'Sullivan, "Annexation" (1845), the "manifest destiny" coinage passage.
- `apush-sc-secession.ts` — South Carolina *Declaration of the Immediate Causes* (1860), states'-rights-to-protect-slavery reasoning stated in its own words (it names slavery explicitly — keep excerpt factual).
- `apush-emancipation-proclamation.ts` — Emancipation Proclamation (1863, gov work), operative paragraphs ("all persons held as slaves within any State… in rebellion… shall be then, thenceforward, and forever free") + military-necessity frame.

**Content plans (5)** per LO table: `manifest-destiny` (passageId → osullivan; Texas, Oregon, Mexican War + Wilmot Proviso, gold rush; misconception: "manifest destiny was uncontested"); `sectional-crisis` (no passage; 1850/Fugitive Slave Act, Uncle Tom's Cabin (described, PD but long — description fine), Kansas-Nebraska/Bleeding Kansas, Dred Scott, Lincoln-Douglas, John Brown; misconception: "the Civil War was inevitable by 1850"); `secession-civil-war` (passageId → sc-secession; 1860 election, secession logic in the document's own words, advantages, total war, homefront; misconception: "secession was primarily about tariffs — the declarations say otherwise"); `emancipation` (passageId → emancipation-proclamation; worked_example: what the Proclamation did and did NOT do (exempted border states/occupied areas; war measure), Black soldiers (54th Mass.), Gettysburg reframing (reuse gettysburg passage in MCQs), 13th Amendment; misconception: "the Proclamation freed all slaves immediately"); `reconstruction` (no passage; Presidential vs Radical, 13/14/15, Freedmen's Bureau, Black officeholding, sharecropping, KKK/Redemption, Compromise of 1877; measured; misconception: "Reconstruction failed because it was too radical" — present the historiographic range neutrally).

**FRQ:** DBQ: "Evaluate the extent to which the Civil War and Reconstruction transformed the meaning of American freedom in the period 1844–1877." Packet: osullivan, douglass-fourth-of-july (REUSE), sc-secession, emancipation-proclamation, lincoln-gettysburg (REUSE). LEQ: "Evaluate the extent to which Reconstruction fulfilled the promises of emancipation in the period 1863–1877." SAQ (stimulus: `apush-emancipation-proclamation.v1`): (a) Describe the legal basis the excerpt claims; (b) Explain ONE limitation of the Proclamation evident in the excerpt; (c) Explain ONE way the war's purpose changed as a result of emancipation.

**MCQs (10):** osullivan 1, douglass 2, sc-secession 2, emancipation 2, gettysburg 1, non-stimulus reconstruction 2.

### PERIOD 6 (1865–1898) — Tasks 17–20

**Passages (5):**
- `apush-carnegie-wealth.ts` — Carnegie, "Wealth" (*North American Review*, 1889), gospel-of-wealth duty passage.
- `apush-omaha-platform.ts` — Populist Party Omaha Platform (1892), preamble ("a nation brought to the verge of moral, political, and material ruin") + demands (free silver, sub-treasury, RR regulation).
- `apush-chinese-exclusion.ts` — Chinese Exclusion Act (1882, statute, gov work), operative suspension text.
- `apush-immigration-table.ts` — `[DATA TABLE — description]`, genre `'political-cartoon'`: US immigration by decade 1861–1900 with source-region shift (N/W Europe vs S/E Europe) — REAL figures from the Census/INS historical statistics (verify while authoring; e.g. 1861–70 ≈ 2.3M, 1881–90 ≈ 5.2M, 1891–1900 ≈ 3.7M with S/E-Europe share rising); sourceUrl to the DHS/INS Yearbook historical table or Census Historical Statistics.
- `apush-cross-of-gold.ts` — Bryan, "Cross of Gold" (1896), closing passage.

**Content plans (5)** per LO table: `the-west-new-south` (no passage; transcontinental RR, homesteaders, Plains wars (Little Bighorn, Wounded Knee — measured), Dawes Act, New South vs Jim Crow reality; misconception: "the frontier was empty land"); `industrialization-big-business` (passageId → carnegie-wealth; steel/oil/rail, integration strategies, Social Darwinism vs Gospel of Wealth distinction, laissez-faire courts; misconception: "Carnegie's essay defends unlimited accumulation — it argues a duty to redistribute surplus"); `labor-movement` (no passage; conditions, Knights vs AFL, 1877/Haymarket/Homestead/Pullman, government injunctions; misconception: "early unions were uniformly radical"); `immigration-urbanization` (passageIds → immigration-table in concept; new immigrants, enclaves, machines, nativism (wire chinese-exclusion in worked_example), tenements, settlement houses; misconception: "nativism targeted all immigrants equally"); `gilded-politics-populism` (passageId → omaha-platform; stalemate/patronage/Pendleton, farm crisis (deflation, crop-lien), Grange→Alliances→Populists, 1896 (cross-of-gold in MCQs), McKinley realignment; misconception: "the Populists won nothing — their program largely became law later").

**FRQ:** DBQ: "Evaluate the extent to which industrialization transformed American society in the period 1865–1898." Packet: carnegie-wealth, omaha-platform, chinese-exclusion, immigration-table, cross-of-gold. LEQ: "Evaluate the extent to which farmers and industrial workers responded effectively to industrialization in the period 1865–1898." SAQ (stimulus: `apush-immigration-table.v1`, "Use the table…"): (a) Identify the decade with the greatest immigration; (b) Explain ONE cause of the source-region shift shown; (c) Explain ONE political response to the trends shown.

**MCQs (10):** carnegie 2, omaha 2, chinese-exclusion 1, immigration-table 2, cross-of-gold 1, non-stimulus labor + west 2.

### PERIOD 7 (1890–1945) — Tasks 21–24

**Passages (5, all US-gov works):**
- `apush-roosevelt-corollary.ts` — TR's 1904 annual message excerpt ("international police power").
- `apush-wilson-war-message.ts` — Wilson, April 2 1917 ("The world must be made safe for democracy").
- `apush-fdr-first-inaugural.ts` — FDR, 1933 ("the only thing we have to fear is fear itself" + bold-experimentation frame).
- `apush-four-freedoms.ts` — FDR, Jan 6 1941 (the four freedoms passage).
- `apush-eo-9066.ts` — Executive Order 9066 (1942), operative text (military areas authorization) — factual, measured.

**Content plans (6)** per LO table: `imperialism` (passageId → roosevelt-corollary; Mahan, Spanish-American War, Philippines + anti-imperialists, Open Door, Panama; misconception: "imperialism was universally popular"); `progressivism` (no passage; muckrakers, municipal→state→federal reform, TR/Taft/Wilson programs, 16th–19th Amendments, suffrage strategy (NAWSA/Paul), Progressive limits on race; misconception: "Progressives were a single unified movement"); `wwi` (passageId → wilson-war-message; neutrality→entry, CPI/Espionage-Sedition/Schenck (wire `apgov` knowledge NOT — keep APUSH-internal), Great Migration, 14 Points vs Versailles fight; misconception: "the US fought from 1914"); `twenties` (no passage; consumer economy, mass culture, Harlem Renaissance (describe works, no copyrighted quotes), modernism vs tradition (quotas 1924, Klan revival, Scopes, Prohibition); misconception: "the 20s were prosperous for everyone — farm depression"); `depression-new-deal` (passageId → fdr-first-inaugural; causes, Hoover, 3 Rs, alphabet programs, Wagner/Social Security, court fight, critics left/right, coalition + race/gender limits; misconception: "the New Deal ended the Depression — WWII spending did"); `wwii` (passageIds → four-freedoms (concept) + eo-9066 (worked_example sources it against Korematsu — described); neutrality→Lend-Lease→Pearl Harbor, mobilization (Rosie, Double V, Bracero), internment (measured), strategy, atomic decision (present the debate neutrally); misconception: "internment targeted only non-citizens").

**FRQ:** DBQ: "Evaluate the extent to which the role of the federal government in American life expanded in the period 1890–1945." Packet: all 5. LEQ: "Evaluate the extent to which the New Deal transformed the relationship between Americans and their federal government in the period 1929–1945." SAQ (stimulus: `apush-fdr-first-inaugural.v1`): (a) Describe the crisis context of the excerpt; (b) Explain ONE specific policy that followed from its promise of action; (c) Explain ONE criticism the New Deal drew from EITHER the political left or right.

**MCQs (12):** corollary 2, wilson 2, fdr-inaugural 2, four-freedoms 1, eo-9066 2, non-stimulus progressivism + twenties 3.

### PERIOD 8 (1945–1980) — Tasks 25–28

**Passages (4 new, all US-gov works + 1 REUSE: `evelyn.passage.apgov-brown-opinion.v1` — do NOT re-seed):**
- `apush-truman-doctrine.ts` — Truman, March 12 1947 (support free peoples resisting subjugation).
- `apush-eisenhower-farewell.ts` — Eisenhower, 1961 ("military-industrial complex").
- `apush-jfk-inaugural.ts` — JFK, 1961 ("pay any price, bear any burden" + "ask not").
- `apush-lbj-great-society.ts` — LBJ, Ann Arbor commencement, May 22 1964 (the Great Society vision passage).

**Content plans (5)** per LO table: `cold-war-origins` (passageId → truman-doctrine; containment (Kennan described), Marshall Plan, NATO/Berlin, NSC-68/Korea, Red Scare/McCarthy (measured), New Look, Sputnik; misconception: "containment meant rollback"); `postwar-society` (no passage; GI Bill, Levittown/suburbia + redlining reality, baby boom, Sunbelt, interstates, TV, critics (Beats), persistent poverty; misconception: "postwar prosperity reached everyone"); `civil-rights-movement` (passageId → apgov-brown-opinion REUSE; Brown → Montgomery → Little Rock → sit-ins/Freedom Rides → Birmingham → March on Washington — **MLK's speeches and Letter described with ZERO quoted text (copyright)**; CRA 1964/VRA 1965; northern shift + Black Power (Malcolm X described); measured throughout; misconception: "the movement was a single organization with one strategy"); `sixties-vietnam` (passageId → lbj-great-society; JFK New Frontier, Great Society programs (Medicare/ESEA/Immigration 1965), Tonkin→escalation→Tet, antiwar/counterculture, 1968, silent majority; misconception: "the Great Society was only about poverty"); `seventies-crisis` (no passage; Nixon (détente/China/southern strategy), Watergate, oil shocks/stagflation, EPA/Earth Day, feminism (ERA fight; Roe described), Carter/hostage crisis; misconception: "détente ended the Cold War").

**FRQ:** DBQ: "Evaluate the extent to which the Cold War transformed the role of the United States government at home and abroad in the period 1945–1980." Packet: truman-doctrine, eisenhower-farewell, jfk-inaugural, lbj-great-society, apgov-brown-opinion (REUSE — federal courts as Cold-War-era domestic actor). LEQ: "Evaluate the extent to which the civil rights movement transformed American society in the period 1945–1980." SAQ (stimulus: `apush-truman-doctrine.v1`): (a) Describe the policy commitment the excerpt announces; (b) Explain ONE specific program or action that implemented it (1947–1955); (c) Explain ONE domestic consequence of the Cold War consensus the excerpt helped create.

**MCQs (10):** truman 2, eisenhower-farewell 1, jfk 1, lbj 2, brown-reuse 1, non-stimulus postwar-society + seventies 3.

### PERIOD 9 (1980–present) — Tasks 29–32

**Passages (5):**
- `apush-reagan-inaugural.ts` — Reagan, 1981 ("government is not the solution to our problem; government is the problem"), gov work.
- `apush-reagan-brandenburg.ts` — Reagan, June 12 1987 ("tear down this wall"), gov work.
- `apush-bush-sept-2001.ts` — G.W. Bush, address to Congress Sept 20 2001 (war-on-terror framing; measured), gov work.
- `apush-obama-inaugural.ts` — Obama, 2009 (crisis + renewal passage), gov work.
- `apush-immigration-origins-table.ts` — `[DATA TABLE — description]`: legal-immigration share by region of origin, 1960s vs 2000s (Europe-majority → Latin America/Asia-majority) — REAL figures from the DHS Yearbook / Pew-published Census tabulations (verify while authoring; e.g. 1960s Europe ≈ 34%, 2000s Europe ≈ 13%, Asia ≈ 34%, Latin America ≈ 41% — adjust to the published source's values); sourceUrl to the DHS Yearbook of Immigration Statistics.

**Content plans (3)** per LO table: `conservative-resurgence` (passageId → reagan-inaugural; New Right roots (Goldwater described, Moral Majority, tax revolt), Reaganomics + deficits, PATCO, judiciary, Cold War endgame (buildup→Gorbachev→INF→1989–91, brandenburg in MCQs); non-partisan framing; misconception: "the Cold War ended solely because of US pressure — present multiple factors"); `globalization-tech` (passageId → immigration-origins-table; NAFTA/WTO, deindustrialization, PC/internet, post-1965 immigration demographics, Clinton-era budget/welfare reform, rising inequality; misconception: "globalization affected all regions/workers alike"); `america-since-2001` (passageId → bush-sept-2001; 9/11, Afghanistan/Iraq, security-vs-liberty debates (Patriot Act), 2008 crisis + response (TARP/stimulus, obama-inaugural in MCQs), ACA, polarization/social media; strictly non-partisan, factual; misconception: "the 2008 crisis was caused by a single actor — present the standard multi-factor account").

**FRQ:** DBQ: "Evaluate the extent to which the United States' role in the world changed in the period 1980–2008." Packet: reagan-inaugural, reagan-brandenburg, bush-sept-2001, obama-inaugural, immigration-origins-table. LEQ: "Evaluate the extent to which conservatism reshaped American politics and society in the period 1980–2008." SAQ (stimulus: `apush-immigration-origins-table.v1`, "Use the table…"): (a) Identify the largest region of origin in the 2000s; (b) Explain ONE cause of the shift shown (hint: 1965); (c) Explain ONE political or cultural debate the shift contributed to (measured framing).

**MCQs (8):** reagan-inaugural 2, brandenburg 1, bush-2001 1, obama 1, immigration-table 2, non-stimulus globalization 1.

---

## INTEGRATION

### Task 33: Whole-branch structural audit + final review

- [ ] **Step 1: Full gates.** `npx tsc --noEmit` → 0; `npx tsx scripts/lint-ap-plans.ts` passes; `npm run lint:passages` clean; `npm run test:passages` passes.
- [ ] **Step 2: Corpus walk** (tsx one-liner over the stores): apush plans count === 68 (8 existing + 60 new); all 27 FRQ plans' cedTopics match `/dbq|leq|saq/i`; all 24 new rubrics sum 7/6/3 per format; all 8 DBQ packets resolve 5/5 with `Document 1..5`; all `passageId`/`passageIds` resolve; apush notes count === 41 with `baselineId===planId`; 0 dangling prereq/followUp LO refs across ALL apush plans; LO strings unique corpus-wide (walk all SEED_PLANS).
- [ ] **Step 3: MCQ audit.** u1/u2/u4–u9 counts 8/8/10/10/10/12/10/8; every `loId` exists; every `passageId` registered; per-file answer distribution (no letter >40%); combined dry-run `npm run seed:problem-bank -- --course=ap-us-history --dry-run` → 86/86.
- [ ] **Step 4:** Commit fixes; request the final whole-branch code review per superpowers:requesting-code-review; apply fixes; re-review until READY TO MERGE.

### Task 34: Academy regeneration

- [ ] **Step 1:** In `/Users/luke/Dev/academy`: `git checkout -b apush-periods-fanout && ENGINE_REPO=/Users/luke/Dev/evelynlearning/.claude/worktrees/apush-fanout npm run seed:gen`
- [ ] **Step 2: Verify** `seed/mappings.json`: AP US History 68 nodes (41 lesson + 27 frq-practice); other 9 courses byte-unchanged.
- [ ] **Step 3: Commit:** `git add seed/mappings.json && git commit -m "feat(academy): APUSH Periods 1-2, 4-9 nodes from engine apush-periods-fanout seeds"`

### Task 35: Ship (controller, pre-authorized — no user gate tonight)

Merge engine branch → main → push → `deploy-to-production.sh`; merge academy branch → main → push → `deploy-crimsora.sh`; tunnel-seed the problem bank WITH verify through the user's existing port-2710 tunnel (swap `replicaSet=rs0` → `directConnection=true` in the engine `.env.local` URI): `npm run seed:problem-bank -- --course=ap-us-history` → expect 86 rows; server ingest `ssh root@84.247.185.169 'cd /root/crimsora && set -a && source .env.local && set +a && npm run ingest'` → apush 68 nodes; verify prod Mongo bank count 86; update SDD ledger + memory. **Live gate: deferred to the user in the morning** (one P7 session — FDR inaugural renders, DBQ grades 7-pt with Document 1..5; a P5 MCQ set; P9 table).

---

## Self-Review

**Spec coverage:** D1 3-formats ×8 → Template N.3 + per-period FRQ blocks (24 plans, 7/6/3); D2 5-doc packets → every period block lists exactly 5 packet ids (P5/P8 include reuses); D3 copyright → Global Constraints (PD+gov only; MLK/Friedan/Port Huron described; visuals/tables described genre 'political-cartoon'; P7–P9 all-gov-works passage lists); D4 plan counts 3/4/5/5/5/6/5/3 → period blocks (sum 36); D5 MCQ counts 8/8/10/10/10/12/10/8 → period blocks (sum 76; +10 = 86 at Task 33); D6 one branch/deploy → Global Constraints + Task 35; D7 period-parallel waves → Global Constraints prereq rule + Task 33 full ref check; D8 merged plans+notes task → Template N.2.

**Placeholder scan:** every period block carries concrete passage anchors, LO wiring, misconception examples, full DBQ/LEQ prompts, full 3-part SAQ prompts, MCQ set composition. Templates are fully specified once (exact gates, exact one-liners) — period blocks are data consumed by them. No TBD/TODO.

**Type consistency:** ids `evelyn.ap.apush.<slug>.v1` per the LO table; FRQ ids `u<N>-{dbq,leq,saq}-practice`; rubric arrays match P3's `FrqRubricPart` shape; the verify one-liner consumes `SEED_PLANS`/`resolveGradeItem` exactly as the P3 plan's proven script; packet doc counts (5) match the one-liner's `docs` arg; notes cedUnit NUMBER vs plan cedUnit STRING held.
