# AP World History Units 1 & 3–9 Fan-out — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete AP World History: Modern by authoring Units 1 and 3–9 on the validated Unit-2 patterns: 35 content plans + 35 notes baselines + 24 FRQ-practice plans (DBQ/LEQ/SAQ per unit) + 82 stimulus MCQs + ~29 new passages — content-only, zero engine or academy code changes.

**Architecture:** Everything reuses the U2 slice wholesale: documents are `Passage`s, DBQs are `passageIds[]` packets with `packetLabel:'document'` (`Document 1..5`), rubrics sum 7/6/3, MCQs go to `src/data/problem-bank/ap-world-history/u<N>.json`. Academy block already matches `/^ap-apworld-.*\.ts$/`.

**Tech Stack:** TypeScript, Next.js (engine), Mongo (ProblemBank), tsx scripts, esbuild academy `gen-seed.mjs`.

**Spec:** `docs/superpowers/specs/2026-07-11-apworld-units-fanout-design.md`

## Global Constraints

- **Worktree:** branch `apworld-units-fanout` off engine `main` AFTER the APUSH fan-out merge (cross-course reuses: `apush-columbus-letter`, `apush-equiano`, `apush-four-freedoms`, `apush-truman-doctrine`, `apush-bush-sept-2001`, `apush-cortes-tenochtitlan` must resolve), repo-local `.claude/worktrees/apworld-fanout` (+ group worktrees `-b/-c/-d`). Copy `.env.local` from the main checkout. No dev servers on ports 3001–3010.
- **Zero code changes** — content + store registrations + JSON only.
- **Passages: pre-1929 PD translations + US-gov works + the UDHR ONLY**, `license:'public-domain'`, real `sourceUrl`. **Verbatim excerpts must be contiguous substrings of the actual fetched source** (raw Gutenberg .txt / archive.org fulltext / avalon / sourcebooks.fordham.edu / presidency.ucsb.edu / un.org for UDHR), ellipses marked, ONE named PD translation per document cited in the seed's doc comment. NEVER quote from search snippets (U2 Task-2 CRITICAL precedent). If a raw source cannot be fetched, report BLOCKED for that doc — the controller will swap it for a described-visual fallback; do NOT approximate.
- **Copyrighted landmarks = authored in-plan descriptions, ZERO quoted text, never a Passage, never in a packet:** Churchill, Gandhi, Nehru, Nkrumah, Mao, Deng, Castro, Carson, MLK, any post-1928 non-government text (measured original prose only).
- **Described visuals & data tables:** genre `'political-cartoon'`, fullText opens `[DATA TABLE — description]` or `[VISUAL — description]` (gold: `apworld-catalan-atlas.ts`, `apgov-federal-grants-table.ts`), REAL published figures verified against the named source while authoring, internally consistent, units stated.
- **Rubric shapes (U2 verbatim):** DBQ (7): `[A-thesis:1, B-context:1, C-doc-evidence:2, D-outside-evidence:1, E-sourcing:1, F-complexity:1]` + `packetLabel:'document'` + the unit's 5-doc `passageIds`; LEQ (6): `[A-thesis:1, B-context:1, C-evidence:2, D-analysis:2]`, no passages; SAQ (3): `[a:1, b:1, c:1]`, stimulus `passageId` only when the prompt explicitly uses it. Integer maxPoints; real `scoringCriteria` + `modelResponse` per part.
- **ID scheme (identical to U2):** plans `evelyn.ap.apworld.<slug>.v1`; LO `apworld.<slug>`; standards `AP-APWORLD-<ced>`; files `ap-apworld-u<N>-<slug>.ts`; passages `evelyn.passage.apworld-<slug>.v1`; `subject:'ss'`; `curriculum:'AP'`; `topic:'ap-world-history'`; `grade:'10'`; `locale:'en'`; `metadata.cedUnit:'<N>'` STRING in plans / NUMBER in notes; notes `course:'AP World History'`; `baselineId === planId`; `pacingThresholds: AP_PACING_THRESHOLDS`; `source: AP_SOURCE`; plan `estimatedMinutes` = segment sum; titles `'U<N>.<t> <Title>'`.
- **Document fidelity:** attribute to a passage only what its seeded excerpt contains; broader arguments = outside evidence in modelResponses. **Passage re-cuts after plans quote them require re-checking every quoting plan/baseline** (U2 Task-6 lesson).
- **Notes baselines:** theory 8–12 accurate entries (2–3 definitions), methods 1–2 (sourcing/HIPP moves, reading a data table), pointers 4–6; skip FRQ plans.
- **MCQ authoring:** self-inlined quotes/figures; registered `passageId`s; 4 choices; letters distributed non-cyclic; correct-not-longest (0–2/file); `loId` from the same unit; `cedCode` = the LO's standard; update `_AUTHORING.md`; dry-run `npm run seed:problem-bank -- --course=ap-world-history --file=u<N>.json --dry-run`.
- **Measured, exam-neutral tone:** slave trade, colonial violence, partition, Holocaust & mass atrocities, 9/11 — factual, no graphic spans; translation-fidelity discipline for non-English sources.
- **Prerequisites:** within-unit + earlier-unit LOs from the LO table (U2's existing LOs: `apworld.silk-roads`, `apworld.indian-ocean-trade`, `apworld.trans-saharan-trade`, `apworld.mongol-empire`, `apworld.cultural-diffusion`). Full dangling-ref check at the audit (units may run in parallel).
- **Verify structurally, never by grep. Gates every task:** tsc 0; lint-ap-plans; lint:passages when touched; commit per task.

**Gold references:** content plan `ap-apworld-u2-silk-roads.ts` (calibration gold); FRQ `ap-apworld-u2-{dbq,leq,saq}-practice.ts`; notes `topic-notes/seeds/ap-apworld-u2-*.ts`; text passage `apworld-marco-polo-kinsay.ts`; described visual `apworld-catalan-atlas.ts`; data table `apgov-federal-grants-table.ts`; MCQs `problem-bank/ap-world-history/u2.json` + `_AUTHORING.md`.

**Per-unit rubric/packet verify one-liner** (Task N.3; substitute N):

```bash
npx tsx -e "import {SEED_PLANS} from './src/lib/tutor/lesson-plan/store'; import {resolveGradeItem} from './src/lib/tutor/portal/adapters'; for (const [id,want,docs] of [['evelyn.ap.apworld.uN-dbq-practice.v1',7,5],['evelyn.ap.apworld.uN-leq-practice.v1',6,0],['evelyn.ap.apworld.uN-saq-practice.v1',3,0]]){ const p=SEED_PLANS.find(x=>x.id===id); const ty=p.segments.find(s=>s.kind==='try_yourself'); const sum=ty.rubric.parts.reduce((a,x)=>a+x.maxPoints,0); const gi=resolveGradeItem(id+'::'+ty.id); console.log(id, sum===want?'OK':'FAIL sum='+sum, (ty.passageIds?.length||0)===docs?'':'FAIL docs', docs>0?(gi?.passageText?.includes('Document 1')&&gi?.passageText?.includes('Document 5')?'[Doc1..5]':'PACKET-FAIL'):''); }"
```

## LO table (single source of truth)

| Unit | LO (`apworld.`) | standard | cedTopic | file slug |
|---|---|---|---|---|
| 1 | `east-asia-song` | AP-APWORLD-1.1 | 1.1 | u1-east-asia-song |
| 1 | `dar-al-islam` | AP-APWORLD-1.2 | 1.2 | u1-dar-al-islam |
| 1 | `south-southeast-asia` | AP-APWORLD-1.3 | 1.3 | u1-south-southeast-asia |
| 1 | `americas-africa-states` | AP-APWORLD-1.4 | 1.4-1.5 | u1-americas-africa |
| 1 | `medieval-europe` | AP-APWORLD-1.6 | 1.6 | u1-medieval-europe |
| 3 | `empires-expansion` | AP-APWORLD-3.1 | 3.1 | u3-empires-expansion |
| 3 | `empires-administration` | AP-APWORLD-3.2 | 3.2 | u3-empires-administration |
| 3 | `empires-belief-systems` | AP-APWORLD-3.3 | 3.3-3.4 | u3-empires-belief |
| 4 | `maritime-exploration` | AP-APWORLD-4.1 | 4.1-4.2 | u4-maritime-exploration |
| 4 | `columbian-exchange-global` | AP-APWORLD-4.3 | 4.3 | u4-columbian-exchange |
| 4 | `maritime-empires` | AP-APWORLD-4.4 | 4.4-4.5 | u4-maritime-empires |
| 4 | `atlantic-slave-trade` | AP-APWORLD-4.6 | 4.4/4.6 | u4-atlantic-slave-trade |
| 4 | `resistance-accommodation` | AP-APWORLD-4.7 | 4.7-4.8 | u4-resistance |
| 5 | `enlightenment` | AP-APWORLD-5.1 | 5.1 | u5-enlightenment |
| 5 | `atlantic-revolutions` | AP-APWORLD-5.2 | 5.2 | u5-atlantic-revolutions |
| 5 | `nationalism-unification` | AP-APWORLD-5.2b | 5.2 | u5-nationalism |
| 5 | `industrial-revolution` | AP-APWORLD-5.3 | 5.3-5.6 | u5-industrial-revolution |
| 5 | `industrial-society` | AP-APWORLD-5.7 | 5.7-5.11 | u5-industrial-society |
| 6 | `imperial-expansion` | AP-APWORLD-6.1 | 6.1-6.2 | u6-imperial-expansion |
| 6 | `imperial-resistance` | AP-APWORLD-6.3 | 6.3 | u6-imperial-resistance |
| 6 | `economic-imperialism` | AP-APWORLD-6.5 | 6.4-6.6 | u6-economic-imperialism |
| 6 | `global-migration` | AP-APWORLD-6.7 | 6.7 | u6-global-migration |
| 6 | `reform-responses` | AP-APWORLD-6.4b | 6.2/6.4 | u6-reform-responses |
| 7 | `wwi-global` | AP-APWORLD-7.2 | 7.1-7.3 | u7-wwi |
| 7 | `interwar-world` | AP-APWORLD-7.4 | 7.4-7.6 | u7-interwar |
| 7 | `wwii-global` | AP-APWORLD-7.7 | 7.7 | u7-wwii |
| 7 | `conflict-legacies` | AP-APWORLD-7.8 | 7.8-7.9 | u7-legacies |
| 8 | `cold-war-global` | AP-APWORLD-8.1 | 8.1-8.4 | u8-cold-war |
| 8 | `decolonization` | AP-APWORLD-8.5 | 8.5-8.6 | u8-decolonization |
| 8 | `new-states` | AP-APWORLD-8.7 | 8.7-8.8 | u8-new-states |
| 8 | `end-cold-war` | AP-APWORLD-8.9 | 8.9-8.10 | u8-end-cold-war |
| 9 | `global-economy` | AP-APWORLD-9.1 | 9.1-9.3 | u9-global-economy |
| 9 | `technology-communication` | AP-APWORLD-9.4 | 9.4-9.5 | u9-technology |
| 9 | `environment-disease` | AP-APWORLD-9.6 | 9.6-9.7 | u9-environment-disease |
| 9 | `culture-rights-migration` | AP-APWORLD-9.8 | 9.8-9.9 | u9-culture-rights |

FRQ ids: `evelyn.ap.apworld.u<N>-{dbq,leq,saq}-practice.v1`; LOs `apworld.u<N>-{dbq,leq,saq}-practice`; standards `AP-APWORLD-<N>-{DBQ,LEQ,SAQ}`; cedTopics `'<N>-DBQ'` etc.

## TASK TEMPLATES — identical to the APUSH fan-out plan's four templates (passages / plans+notes / FRQs / MCQs), substituting course slug `apworld`, course dir `ap-world-history`, and the gold references above. Commit messages: `content(apworld): U<N> <what>`.

---

## UNIT BLOCKS

### UNIT 1 (1200–1450, The Global Tapestry)

**Passages (3 new + 2 REUSE: `evelyn.passage.apush-cortes-tenochtitlan.v1`, `evelyn.passage.apworld-catalan-atlas.v1`):**
- `apworld-marco-polo-khan-court.ts` — Marco Polo on Kublai Khan's court/capital (Yule-Cordier trans., Gutenberg — pick a chapter NOT already excerpted by `apworld-marco-polo-{kinsay,yam,paper-money}`; e.g. the khan's palace at Cambaluc or the greatness of his rule).
- `apworld-ibn-battuta-delhi.ts` — Ibn Battuta on Sultan Muhammad ibn Tughluq's Delhi court (Samuel Lee 1829 PD trans., archive.org fulltext) — generosity/severity of the sultan, court ceremony.
- `apworld-magna-carta.ts` — Magna Carta (1215, Avalon trans.), genre `'constitution'`: clauses 12/39/40-class excerpts (no scutage without common counsel; no free man imprisoned except by lawful judgment; to no one deny justice).
**Content plans (5)** per LO table: `east-asia-song` (passageId → marco-polo-khan-court is YUAN not Song — worked_example frames continuity of Chinese statecraft under the Yuan as seen by an outsider, taught against Song foundations (exam system, Neo-Confucianism — stay consistent with U2's Japan/Korea/Vietnam facts: exams = Korea/Vietnam, Japan absorbed Neo-Confucian thought without exam bureaucracy); champa rice, commercial economy; misconception: "the civil-service exam made China a meritocracy open to all"); `dar-al-islam` (no wired passage; Abbasid fragmentation → Seljuk/Mamluk/Delhi sultanates, ulama/madrasa networks, Sufi expansion, intellectual transfers (Ibn Rushd, al-Khwarizmi legacy, House of Wisdom decline after 1258); misconception: "the Abbasid caliphate's political collapse ended Islamic cultural unity"); `south-southeast-asia` (passageId → ibn-battuta-delhi; Delhi sultanate rule over Hindu majority, Vijayanagara response, Chola legacy & Indian Ocean links (wire prereq `apworld.indian-ocean-trade`), Srivijaya/Majapahit/Khmer (Angkor Wat Hindu→Buddhist), Sinhala kingdoms; misconception: "Islam spread in South/Southeast Asia primarily by conquest — merchants and Sufis drove most conversion"); `americas-africa-states` (passageIds: cortes-tenochtitlan (concept) + catalan-atlas (worked_example) — Mexica tribute empire & chinampas, Inca mit'a/road system/quipu, Cahokia; Mali (Mansa Musa — consistent with U2 facts), Great Zimbabwe, Ethiopia (rock churches), Hausa city-states; misconception: "American and African states were isolated and stateless before Europeans"); `medieval-europe` (passageId → magna-carta; feudalism/manorialism, fragmented monarchies vs Church authority, Magna Carta as baronial limit on royal power, revival of towns/universities, comparison to centralized Song/Islamic states; misconception: "Magna Carta established democracy — it protected feudal elites; broader rights came later").
**FRQ:** DBQ: "Evaluate the extent to which rulers in the period 1200–1450 used similar methods to build and maintain power across regions." Packet: marco-polo-khan-court, ibn-battuta-delhi, magna-carta, cortes-tenochtitlan (R), catalan-atlas (R). LEQ: "Evaluate the extent to which religious institutions shaped state power in the period 1200–1450." SAQ (stimulus: magna-carta, prompt quotes the no-free-man clause): (a) Describe the limit the excerpt places on royal power; (b) Explain ONE way European political decentralization c. 1200–1450 differed from Song China's centralization; (c) Explain ONE reason for that difference.
**MCQs (10):** khan-court 2, ibn-battuta-delhi 2, magna-carta 2, cortes 1, catalan-atlas 1, non-stimulus dar-al-islam + east-asia 2.

### UNIT 3 (1450–1750, Land-Based Empires)

**Passages (5 new):**
- `apworld-busbecq-suleiman.ts` — Ogier Ghiselin de Busbecq, *Turkish Letters* (1555–62; Forster 1881 PD trans., archive.org): merit-based advancement at Suleiman's court ("no distinction is attached to birth").
- `apworld-bernier-mughal.ts` — François Bernier, *Travels in the Mogul Empire* (1656–68; Constable 1891 PD trans., Gutenberg/archive.org): crown ownership of land / omrahs, court wealth.
- `apworld-peter-decrees.ts` — Peter the Great, westernization decrees (beards/dress/education, c. 1701–14; PD trans. via Fordham sourcebook): compulsory European dress, shaving, service obligations.
- `apworld-taj-mahal.ts` — `[VISUAL — description]` genre `'political-cartoon'`: Taj Mahal (1632–53) as Mughal imperial legitimacy — scale, Quranic calligraphy, paradise-garden symbolism, cost/labor; sourceUrl to UNESCO/ASI page.
- `apworld-kangxi-edict.ts` — the Sacred Edict maxims (1670, Kangxi; Baller 1892 PD trans., archive.org): filial piety/orthodoxy maxims as Qing Confucian legitimation. **Fallback if raw text unfetchable:** convert to a described visual of the Qing civil-examination hall (described from PD sources) — controller decision at BLOCKED.
**Content plans (3):** `empires-expansion` (no wired passage; Ottoman (Constantinople 1453), Safavid, Mughal, Qing (Manchu conquest), Russia eastward; gunpowder/artillery, cavalry-to-musket transitions; misconception: "'gunpowder empires' rose only because of guns — administration and cavalry mattered as much"); `empires-administration` (passageIds: busbecq (concept) + bernier (worked_example compare devshirme-recruited elites vs zamindar/jagir revenue elites) + peter-decrees in try_yourself ONLY if prompt-referenced; devshirme/janissaries, Ottoman divan, Mughal mansabdar/zamindar, Qing banners + Confucian exams, Peter's service state, tax farming vs salaried bureaucracy; misconception: "European-style hereditary aristocracy was the universal elite model"); `empires-belief-systems` (passageId → taj-mahal; Sunni-Shia Ottoman-Safavid rivalry, Akbar's sulh-i-kul vs Aurangzeb's jizya restoration, Sikhism's emergence, monumental architecture/art as legitimacy (Taj, Suleymaniye, Versailles-class display), Kangxi edict (wire kangxi-edict in MCQs); misconception: "religious tolerance was a modern invention — Akbar/Ottoman millets institutionalized pluralism, within limits").
**FRQ:** DBQ: "Evaluate the extent to which land-based empires in the period 1450–1750 used similar methods to consolidate and legitimize power." Packet: busbecq-suleiman, bernier-mughal, peter-decrees, taj-mahal, kangxi-edict. LEQ: "Evaluate the extent to which the Ottoman, Safavid, and Mughal empires differed in their treatment of religious diversity, 1450–1750." SAQ (stimulus: busbecq-suleiman): (a) Describe the recruitment principle in the excerpt; (b) Explain how it strengthened Ottoman central power; (c) Explain ONE way another land-based empire solved the same elite-loyalty problem differently.
**MCQs (10):** busbecq 2, bernier 2, peter 2, taj-mahal 1, kangxi 1, non-stimulus expansion 2.

### UNIT 4 (1450–1750, Transoceanic Interconnections)

**Passages (3 new + 2 REUSE: `evelyn.passage.apush-columbus-letter.v1`, `evelyn.passage.apush-equiano.v1`):**
- `apworld-tokugawa-edict.ts` — Sakoku/closed-country edict of 1635 (PD trans. via Fordham sourcebook): no Japanese abroad, no return, Christianity ban, trade restriction.
- `apworld-potosi-silver-table.ts` — `[DATA TABLE — description]`: registered silver output of Potosí/Spanish America by period 1550–1700 + share flowing to Asia — REAL published figures (cite a published series, e.g. Garner/TePaske via a stable scholarly URL or the mint records summarized on a .edu page; verify while authoring), units stated (pesos or metric tons).
- `apworld-zheng-he-visual.ts` — `[VISUAL — description]`: Zheng He treasure fleet (1405–33) vs Iberian caravels scale comparison — factual description (dimensions from Ming shi accounts are contested: present ranges honestly), state-sponsorship contrast, withdrawal after 1433; sourceUrl to a museum/encyclopedia page.
**Content plans (5):** `maritime-exploration` (passageId → zheng-he-visual; motives (spices bypassing intermediaries, Reconquista momentum, Renaissance cartography), tech borrowing (compass, lateen, astrolabe), Portuguese Africa route, Columbus (wire columbus-letter in MCQs), Zheng He contrast + Ming withdrawal; misconception: "Europeans explored because they were technologically superior — most tech was borrowed; state incentives differed"); `columbian-exchange-global` (passageId → potosi-silver-table; global crop/disease/animal flows, demographic catastrophe in the Americas vs population booms from maize/potato in Afro-Eurasia, the silver circuit Potosí→Manila→China (Ming silver taxation), inflation in Spain/Ottoman lands; misconception: "the Columbian Exchange was an Atlantic-only affair — silver tied it to East Asia"); `maritime-empires` (no wired passage; Portuguese trading-post empire, Dutch VOC (joint-stock, Batavia), Spanish territorial model (encomienda→hacienda, casta), French/English entries, mercantilism; misconception: "all European empires in Asia were territorial conquests — most were armed trading networks before 1750"); `atlantic-slave-trade` (passageId → apush-equiano REUSE; scale/geography by destination (Brazil/Caribbean majority), Middle Passage (measured), African political effects (Dahomey/Asante arms trade, Kongo's diplomacy), plantation complex, diaspora cultures; misconception: "enslaved Africans went mostly to North America — <5% did"); `resistance-accommodation` (passageId → tokugawa-edict; Tokugawa restriction + Dutch Dejima exception, Kangxi/Qianlong trade control (Canton), Ottoman capitulations as managed access, maroon communities, Queen Nzinga, Metacom (brief cross-ref); misconception: "non-European states passively received European expansion — most regulated it on their own terms until industrialization").
**FRQ:** DBQ: "Evaluate the extent to which transoceanic connections transformed the global economy in the period 1450–1750." Packet: columbus-letter (R), zheng-he-visual, potosi-silver-table, tokugawa-edict, equiano (R). LEQ: "Evaluate the extent to which the Atlantic slave trade transformed West African societies, 1450–1750." SAQ (stimulus: potosi-silver-table, "Use the table…"): (a) Identify the period of peak registered output; (b) Explain ONE way American silver affected Ming China; (c) Explain ONE consequence of silver dependence for Spain.
**MCQs (12):** columbus 1, zheng-he 2, potosi-table 3, tokugawa 2, equiano 2, non-stimulus maritime-empires 2.

### UNIT 5 (1750–1900, Revolutions)

**Passages (5 new):**
- `apworld-rights-of-man.ts` — Declaration of the Rights of Man and of the Citizen (1789, Avalon trans.), genre `'constitution'`: Arts. 1–3, 6-class excerpts.
- `apworld-bolivar-jamaica.ts` — Bolívar, Jamaica Letter (1815, PD trans. via Fordham/archive.org): Spanish America's condition + call for independence.
- `apworld-communist-manifesto.ts` — Marx & Engels (1848, Moore 1888 PD trans., Gutenberg 61): bourgeoisie/proletariat + "workers of the world" passages.
- `apworld-wollstonecraft.ts` — *A Vindication of the Rights of Woman* (1792, Gutenberg 3420): education/reason argument.
- `apworld-sadler-testimony.ts` — Sadler Committee testimony (1832, PD parliamentary record via Fordham): child-labor hours/conditions (measured selection).
**Content plans (5):** `enlightenment` (passageId → wollstonecraft; social contract (Locke/Rousseau), natural rights, applications: abolition, suffrage, feminism (Wollstonecraft→Seneca Falls cross-ref), deism/secularism; misconception: "Enlightenment thinkers agreed on democracy — many feared it"); `atlantic-revolutions` (passageIds: rights-of-man (concept) + bolivar-jamaica (worked_example compare French universalism vs creole grievances); American→French→Haitian→Latin American sequence, influences and divergences (Haiti: enslaved self-liberation, its isolation), creole leadership; misconception: "the Atlantic revolutions all extended rights equally — each drew different lines (property, race, gender)"); `nationalism-unification` (no wired passage; nationalism from revolutionary citizenship, Italian/German unification (Cavour/Bismarck realpolitik), Balkan nationalisms vs Ottoman/Austrian multiethnic empires, Zionism/pan-movements briefly; misconception: "nation-states were ancient — most were 19th-century constructions"); `industrial-revolution` (no wired passage; why Britain first (coal, capital, colonies, agricultural revolution, water transport), factory system, steam, railroads, spread to Europe/US/Japan, second industrial revolution (steel/chemicals/electricity); misconception: "industrialization improved workers' lives immediately"); `industrial-society` (passageIds: sadler-testimony (concept) + communist-manifesto (worked_example: reading Marx's class analysis as a primary source responding to Sadler-class conditions); urbanization, class formation, women's/child labor, responses: unions, reform acts, socialism spectrum (utopian→Marxist), laissez-faire counterpoint (Smith described); misconception: "Marxism and trade-union reform were the same response").
**FRQ:** DBQ: "Evaluate the extent to which Enlightenment ideals shaped the age of revolutions, 1750–1900." Packet: rights-of-man, bolivar-jamaica, communist-manifesto, wollstonecraft, sadler-testimony. LEQ: "Evaluate the extent to which industrialization transformed social structures in the period 1750–1900." SAQ (stimulus: bolivar-jamaica): (a) Describe ONE grievance in the excerpt; (b) Explain ONE Enlightenment idea reflected in it; (c) Explain ONE way Latin American independence outcomes differed from the excerpt's hopes.
**MCQs (12):** rights-of-man 2, bolivar 2, manifesto 2, wollstonecraft 2, sadler 2, non-stimulus nationalism + industrial-revolution 2.

### UNIT 6 (1750–1900, Consequences of Industrialization)

**Passages (5 new):**
- `apworld-white-mans-burden.ts` — Kipling, "The White Man's Burden" (1899, PD): first stanzas.
- `apworld-lin-zexu.ts` — Lin Zexu, letter to Queen Victoria (1839, PD trans. via Fordham): moral appeal against the opium trade.
- `apworld-berlin-act.ts` — General Act of the Berlin Conference (1885, treaty text PD): effective-occupation/free-trade clauses.
- `apworld-indenture-table.ts` — `[DATA TABLE — description]`: indentured emigration from India (and China) by destination, c. 1834–1920 — REAL published figures (e.g. the ~1.3M Indian total with Mauritius/Caribbean/Fiji/Natal breakdowns; cite a stable scholarly/NAI source; verify while authoring).
- `apworld-meiji-charter-oath.ts` — the Charter Oath (1868, PD trans.): five articles (deliberative assemblies, knowledge sought throughout the world).
**Content plans (5):** `imperial-expansion` (passageId → white-mans-burden; ideologies (civilizing mission, Social Darwinism — presented critically as historical ideologies), Scramble for Africa (Berlin in worked_example via berlin-act), India from Company to Raj, settler colonies, tools (quinine, steamships, Maxim); misconception: "colonization succeeded through technology alone — African/Asian political fragmentation and local allies mattered"); `imperial-resistance` (no wired passage; Sepoy Rebellion 1857 → Raj, Yaa Asantewaa/Asante, Zulu, Ethiopian victory at Adwa (successful resistance), Boxer Uprising, millenarian movements (Ghost Dance cross-ref, Xhosa cattle killing — measured); misconception: "resistance always failed — Adwa and Japan's negotiated revision say otherwise"); `economic-imperialism` (passageId → lin-zexu; Opium Wars → unequal treaties/extraterritoriality, spheres of influence, export monocultures (guano, rubber — Congo abuses noted factually), Suez/Panama, banana republics briefly; misconception: "China was formally colonized — it kept sovereignty under informal imperialism"); `global-migration` (passageId → indenture-table; indenture as post-abolition labor regime, Chinese diaspora, transatlantic European migration, urbanization, nativist backlashes (Chinese Exclusion cross-ref `apush.immigration-urbanization` if present — otherwise describe), remittances/ethnic enclaves; misconception: "19th-century migration was only European"); `reform-responses` (passageId → meiji-charter-oath; Tanzimat, Self-Strengthening vs Meiji contrast (why outcomes diverged), Young Ottomans/constitution 1876, Qing New Policies too-late reforms; misconception: "Meiji Japan simply westernized — it selectively adapted under the kokutai frame").
**FRQ:** DBQ: "Evaluate the extent to which Asian and African states shaped the terms of European imperial expansion, 1750–1900." Packet: white-mans-burden, lin-zexu, berlin-act, indenture-table, meiji-charter-oath. LEQ: "Evaluate the extent to which economic motives drove the new imperialism of 1750–1900." SAQ (stimulus: lin-zexu): (a) Describe the argument the excerpt makes; (b) Explain the historical situation that produced it; (c) Explain ONE consequence of Britain's rejection of that argument.
**MCQs (10):** kipling 2, lin-zexu 2, berlin-act 1, indenture-table 2, charter-oath 2, non-stimulus resistance 1.

### UNIT 7 (1900–present, Global Conflict)

**Passages (4 new + 1 REUSE: `evelyn.passage.apush-four-freedoms.v1`):**
- `apworld-fourteen-points.ts` — Wilson, Fourteen Points (1918, US-gov): points I, V (colonial claims adjustment), XIV.
- `apworld-versailles.ts` — Treaty of Versailles (1919, treaty text PD): Article 231 + Article 22 mandate language.
- `apworld-wwi-propaganda-visual.ts` — `[VISUAL — description]`: WWI empire-recruitment poster(s) (e.g. "India's answer" / French tirailleurs imagery) described factually — colonial manpower mobilization; sourceUrl to IWM/BnF collection page.
- `apworld-depression-table.ts` — `[DATA TABLE — description]`: world trade contraction + unemployment 1929–33 (real League of Nations/BLS figures: world trade ≈ −66% in gold value 1929–34, US unemployment ≈ 25% 1933, German ≈ 30% 1932; verify while authoring; cite a stable source).
**Content plans (4):** `wwi-global` (passageIds: wwi-propaganda-visual (concept) + fourteen-points (worked_example: promises vs mandate reality with versailles Art. 22); MAIN causes + alliance cascade, total war, colonial troops/labor (2M+ Indians, tirailleurs sénégalais), Ottoman collapse/Armenian genocide (factual, measured), Versailles/mandates betraying self-determination; misconception: "WWI was a purely European war"); `interwar-world` (passageId → depression-table; Depression's global transmission (trade collapse, commodity economies), responses (New Deal cross-ref, ISI in Latin America, autarky), rise of fascism/Stalinism/militarist Japan (measured, factual), anti-imperial ferment (Gandhi's salt march DESCRIBED zero-quote, May Fourth, Ho Chi Minh's petition described); misconception: "the Depression affected only industrial countries"); `wwii-global` (passageId → apush-four-freedoms REUSE; aggression sequence (Manchuria, Ethiopia, appeasement), global theaters, colonial manpower again, home fronts, Holocaust (factual, measured — the systematic murder of six million Jews and millions of others), atomic bombs + war's end; misconception: "WWII began in 1939 everywhere — Asia's war began in 1931/1937"); `conflict-legacies` (no wired passage; total-war century's atrocities in sequence — Armenia, Holocaust, Cambodia, Rwanda (each factual, one line of scale, zero graphic detail), refugee regimes, Nuremberg → UDHR bridge (wire U8's udhr in MCQs later — no cross-unit passage here), decolonization pressure from both wars; misconception: "genocides are spontaneous eruptions — each followed documented state planning").
**FRQ:** DBQ: "Evaluate the extent to which the World Wars transformed the relationship between imperial powers and their colonies, 1900–1945." Packet: fourteen-points, versailles, wwi-propaganda-visual, depression-table, four-freedoms (R). LEQ: "Evaluate the extent to which the Great Depression reshaped global politics in the period 1918–1939." SAQ (stimulus: fourteen-points): (a) Describe ONE principle in the excerpt; (b) Explain ONE way the postwar settlement departed from it; (c) Explain ONE colonial response to that gap.
**MCQs (10):** fourteen-points 2, versailles 2, propaganda-visual 1, depression-table 2, four-freedoms 1, non-stimulus wwii + legacies 2.

### UNIT 8 (1945–present, Cold War & Decolonization)

**Passages (4 new + 1 REUSE: `evelyn.passage.apush-truman-doctrine.v1`):**
- `apworld-jfk-cuba.ts` — Kennedy, Cuban quarantine address (Oct 22 1962, US-gov): quarantine announcement + nuclear-stakes framing.
- `apworld-udhr.ts` — Universal Declaration of Human Rights (1948; the UN places the UDHR in the public domain): preamble + Articles 1–2 class excerpts, genre `'constitution'`.
- `apworld-un-membership-table.ts` — `[DATA TABLE — description]`: UN member states by decade 1945–2000 (51 → 189) with the Africa/Asia share of admissions — REAL UN figures (un.org growth table; verify while authoring).
- `apworld-berlin-wall-visual.ts` — `[VISUAL — description]`: the Berlin Wall 1961–1989 (construction, Checkpoint Charlie, 1989 opening) described factually; sourceUrl to a museum/archive page.
**Content plans (4):** `cold-war-global` (passageIds: truman-doctrine REUSE (concept) + jfk-cuba (worked_example: deterrence logic in a real crisis); bipolar blocs, NATO/Warsaw, proxy wars (Korea, Vietnam, Angola, Afghanistan), nuclear arms race/MAD, space race; misconception: "the Cold War was cold everywhere — it was hot across the Third World"); `decolonization` (passageId → un-membership-table; India/Pakistan partition (measured: ~1M deaths, ~15M displaced), Ghana's negotiated path vs Algeria's war, Kenya, Indonesia, Vietnam's overlap with the Cold War, Suez 1956 as imperial twilight; Gandhi/Nkrumah/Nehru DESCRIBED zero-quote; misconception: "independence came the same way everywhere"); `new-states` (no wired passage; Bandung/Non-Aligned Movement (described), development strategies (Nehru's planning, Nasser's Aswan/canal, ujamaa, ISI vs export-led Asia), neocolonial dependency debates, artificial-border conflicts (Nigeria/Biafra measured); misconception: "new states all aligned with a superpower — non-alignment was a third path, imperfectly held"); `end-cold-war` (passageId → berlin-wall-visual; Sino-Soviet split, détente/arms control, Afghanistan drain, Gorbachev (glasnost/perestroika), 1989 cascade, USSR dissolution 1991, post-Cold-War realignments; misconception: "the West simply won — internal Soviet economics and Eastern European movements were decisive too").
**FRQ:** DBQ: "Evaluate the extent to which the Cold War shaped the paths of newly independent states, 1945–1991." Packet: truman-doctrine (R), jfk-cuba, udhr, un-membership-table, berlin-wall-visual. LEQ: "Evaluate the extent to which decolonization transformed the international order after 1945." SAQ (stimulus: un-membership-table, "Use the table…"): (a) Identify the decade with the largest membership growth; (b) Explain the historical development behind it; (c) Explain ONE way new members changed UN agendas.
**MCQs (10):** truman 1, jfk-cuba 2, udhr 2, un-table 2, berlin-visual 1, non-stimulus new-states + end-cold-war 2.

### UNIT 9 (1900–present, Globalization)

**Passages (3 new + 2 REUSE: `evelyn.passage.apworld-udhr.v1` (from U8 — if U8 and U9 run in different worktrees, U9's packet references it and the AUDIT verifies post-merge; U9's own gates then run at audit), `evelyn.passage.apush-bush-sept-2001.v1`):**
NOTE: if the U8/U9 group is one worktree (planned), udhr exists locally — no issue.
- `apworld-life-expectancy-table.ts` — `[DATA TABLE — description]`: world + regional life expectancy 1950 vs 2019 (world ≈ 47 → 73; real UN WPP figures; verify while authoring), sourceUrl to UN WPP.
- `apworld-ict-table.ts` — `[DATA TABLE — description]`: global mobile subscriptions + internet users 1990/2000/2010/2020 (real ITU figures; verify), sourceUrl to ITU statistics page.
- `apworld-trade-container-table.ts` — `[DATA TABLE — description]`: world merchandise trade volume growth vs GDP since 1950 or container throughput (real WTO/UNCTAD figures; verify), sourceUrl accordingly.
**Content plans (4):** `global-economy` (passageId → trade-container-table; Bretton Woods → IMF/World Bank/GATT/WTO, multinationals/supply chains, Asian tigers + China's reform era (Deng DESCRIBED zero-quote), 1997/2008 crises briefly, inequality debates presented neutrally; misconception: "globalization is only westernization — supply chains and capital flow all directions"); `technology-communication` (passageId → ict-table; green revolution (Borlaug described), medical advances (antibiotics, vaccines, eradication of smallpox), jet travel, internet/mobile leapfrogging in the Global South; misconception: "technology diffuses evenly"); `environment-disease` (passageId → life-expectancy-table; demographic transition, epidemics in the century (1918 influenza, HIV/AIDS, COVID-19 — factual), climate change as measured scientific consensus + international responses (Montreal success vs slower carbon progress), water/deforestation; misconception: "global health only improved — new diseases and inequalities emerged"); `culture-rights-migration` (passageIds: udhr (R, concept) + bush-sept-2001 (R, worked_example: globalized security-vs-rights debates after 9/11 — measured); global popular culture flows both ways (Bollywood, K-pop, football), human-rights movements (anti-apartheid, global feminism — described), migration/refugee debates, religious revivals & fundamentalisms (neutral); misconception: "cultural globalization erases local culture — hybridity is the dominant pattern").
**FRQ:** DBQ: "Evaluate the extent to which globalization after 1945 transformed everyday life across regions." Packet: life-expectancy-table, ict-table, trade-container-table, udhr (R), bush-sept-2001 (R). LEQ: "Evaluate the extent to which globalization created new forms of inequality after 1945." SAQ (stimulus: life-expectancy-table, "Use the table…"): (a) Identify the region with the largest gain; (b) Explain ONE cause of the global improvement; (c) Explain ONE reason regional gaps persist.
**MCQs (8):** life-expectancy 2, ict 1, trade-table 1, udhr 1, bush 1, non-stimulus global-economy + technology 2.

---

## INTEGRATION

### Task 33: Whole-branch structural audit + final review
Full gates; corpus walk (apworld plans count === 8 existing + 59 new = 67; 27 FRQ cedTopics match `/dbq|leq|saq/i`; 24 new rubrics sum 7/6/3; 8 DBQ packets resolve 5/5 `Document 1..5`; all passage refs incl. cross-course reuses resolve; notes count === 40, `baselineId===planId`; 0 dangling LO refs; LO uniqueness corpus-wide); MCQ audit (counts 10/10/12/12/10/10/10/8; combined dry-run `--course=ap-world-history` → 92/92); fix; final whole-branch review (fable) → READY TO MERGE.

### Task 34: Academy regeneration
Academy branch `apworld-units-fanout`: `ENGINE_REPO=<worktree> npm run seed:gen`; verify AP World History node count (audit's plan count; lesson vs frq split per isFrq); other courses byte-unchanged; commit.

### Task 35: Ship (controller, pre-authorized)
Same runbook as APUSH Task 35 with course `ap-world-history` (expect 92 bank rows) and apworld node counts; update ledger + memory; live gate deferred to the user.

---

## Self-Review
Spec D1→FRQ blocks ×8 (24 plans); D2→every packet lists exactly 5 ids; D3→Global Constraints + U7–U9 doc choices (gov/treaty/UDHR/tables) + described-landmark rules inline; D4→35 plans across blocks; D5→82 MCQs; D6/D7→worktree + integration tasks; D8→reuse ids named per block with the U9-udhr same-worktree note. Placeholders: none — every doc has source + anchor, every FRQ has full prompts, every plan has wiring + misconceptions. Types: ids/LOs per the LO table; one-liner matches U2's proven script; packet counts = 5 everywhere.
