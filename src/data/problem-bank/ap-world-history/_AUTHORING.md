# AP World History — Problem Bank Authoring Notes

## Unit 2: Networks of Exchange, c. 1200–1450 (CED Unit 2)

Stimulus-based MCQ bank (`u2.json`) keyed to the seven Unit-2 primary/visual
source documents seeded in `src/lib/tutor/passages/seeds/apworld-*.ts` and to
the five Unit-2 content lesson-plan LOs
(`src/lib/tutor/lesson-plan/seeds/ap-apworld-u2-*.ts`). `cedCode` mirrors each
LO's `standard` field exactly.

| loId | cedCode | Topic | # items in u2.json |
|---|---|---|---|
| `apworld.mongol-empire` | `AP-APWORLD-2.1` | The Mongol Empire — conquest, administration, the yam relay, Pax Mongolica. | 2 |
| `apworld.silk-roads` | `AP-APWORLD-2.2` | The Silk Roads — overland Afro-Eurasian trade revival, 1200–1450. | 2 |
| `apworld.indian-ocean-trade` | `AP-APWORLD-2.3` | The Indian Ocean Trade Network — monsoon-driven maritime commerce, Swahili coast. | 2 |
| `apworld.trans-saharan-trade` | `AP-APWORLD-2.4` | The Trans-Saharan Trade Network — camel caravans, gold-salt trade, Mali/Mansa Musa. | 2 |
| `apworld.cultural-diffusion` | `AP-APWORLD-2.6` | Cultural, technological, and biological diffusion along trade routes. | 2 |
| **Total** | | | **10** |

## Anchoring documents (stimulus sets)

Each item anchors to one of the seven Unit-2 passage seeds via `passageId`
(for grouping/render):

- `evelyn.passage.apworld-marco-polo-kinsay.v1` — Marco Polo, on the city of Kinsay/Hangzhou — 2 items
- `evelyn.passage.apworld-marco-polo-yam.v1` — Marco Polo, on the Great Khan's yam post-houses — 2 items
- `evelyn.passage.apworld-marco-polo-paper-money.v1` — Marco Polo, on Yuan paper money — 1 item
- `evelyn.passage.apworld-ibn-battuta-kilwa.v1` — Ibn Battuta, on Kilwa/Kulwa (Swahili coast) — 2 items
- `evelyn.passage.apworld-mansa-musa.v1` — al-Umari, on Mansa Musa in Cairo — 1 item
- `evelyn.passage.apworld-black-death.v1` — Boccaccio, on the plague reaching Florence — 1 item
- `evelyn.passage.apworld-catalan-atlas.v1` — the Catalan Atlas (visual document, Mansa Musa panel) — 1 item

## Authoring rule: self-contained stems (controller override)

Same rule as the AP US History / AP English Language banks:
`scripts/seed-problem-bank.ts`'s verify-at-ingest gate solves each item from
`problemText` alone — it does **not** load the referenced passage. So every
stem inlines the specific short quoted document line (a verbatim substring of
the seeded `fullText`, confirmed programmatically — see Verification below)
before asking the historical-reasoning question. Quoted spans are kept short
(a phrase or single sentence) both for content-filter safety and because AP
World MCQ stimuli are always excerpts, never full documents. Note: quotes are
closed with a straight `"` immediately after the verbatim span (no added
period/comma inside the quotation marks) so the quoted text matches the seed
exactly — sentence-final punctuation, where needed, sits outside the closing
quote mark. `passageId` is still set on every item — it drives stimulus-set
grouping and full-document rendering during a session; it is not required to
*answer* the MCQ.

## Historical-reasoning skills tested

Unlike a plain reading-comprehension bank, these items test authentic AP
World History source-analysis skills against the Unit-2 documents:

- **Sourcing / point of view** — Marco Polo's Venetian-merchant awareness of an unfamiliar European audience (silk-roads.mcq.02); the Catalan Atlas as a European cartographer's depiction of Mali's gold wealth for the king of Aragon (trans-saharan-trade.mcq.02).
- **Contextualization** — Kinsay's market scale as evidence of a thriving Silk Roads/Indian Ocean node (silk-roads.mcq.01); Kilwa's built environment as evidence of Indian Ocean network wealth (indian-ocean-trade.mcq.01); Yuan paper money reported to Europe as an instance of technological diffusion along trade networks (cultural-diffusion.mcq.01).
- **Causation** — Mansa Musa's Cairo gold-giving causing a local gold-price crash (trans-saharan-trade.mcq.01); the yam relay system enabling Pax Mongolica-era communication and safety (mongol-empire.mcq.01); trade-network connectivity causing the Black Death's westward spread (cultural-diffusion.mcq.02).
- **Comparison / historical situation** — Kilwa's frequent military expeditions explained by its position bordering non-Muslim inland peoples while defending trade wealth (indian-ocean-trade.mcq.02).
- **Continuity/change** — yam-station comfort read against Mongol conquest's violence, illustrating the paradox of a conquering-yet-administratively-pragmatic empire (mongol-empire.mcq.02).

## Difficulty & answer-key hygiene

- Difficulty 1–4 mixed: 1×1, 2×5, 3×3, 4×1 (mirrors the APUSH u3.json spread).
- Correct-answer letters distributed non-cyclically across all 10 items:
  A=3, B=2, C=3, D=2. Sequence: `BACDBADCAC` — not all one letter, not a
  repeating ABCD pattern (the known "everything keys to A" trap).
- Choice lengths equalized per item (word-count checked, correct answer NOT
  the systematically longest option — the APUSH length-tell trap): initial
  draft had the correct choice as the unique longest option in 6 of 10 items;
  revised distractor/correct-choice lengths so the correct answer is the
  **unique longest in 0 of 10 items** after revision. Verify:
  `npx tsx -e "const a=require('./src/data/problem-bank/ap-world-history/u2.json'); let n=0; for(const i of a){const w=i.choices.map(c=>c.split(/\\s+/).length); const ci='ABCD'.indexOf(i.answer); if(w[ci]===Math.max(...w)&&w.filter(x=>x===Math.max(...w)).length===1)n++;} console.log('correctIsUniqueLongest', n+'/'+a.length);"`.
- All stems and choices are ORIGINAL — written for this bank, quoting only
  short verbatim phrases from public-domain Unit-2 documents (never
  transcribed wholesale from a real AP exam). `license: 'internal-original'`
  per `scripts/seed-problem-bank.ts`.

## Verification

`npm run seed:problem-bank -- --course=ap-world-history --file=u2.json --dry-run`:
10/10 passed Sonnet (`claude-sonnet-5`) independent-solve verify, 0 rejected.
`npm run lint:passages` clean (17 passages, including all 7 referenced by
this bank). A standalone script confirmed every quoted span inside
`problemText` is a verbatim substring of its passage's seeded `fullText`
(0 mismatches).

## Unit 4: Transoceanic Interconnections, c. 1450–1750 (CED Unit 4)

Stimulus-based MCQ bank (`u4.json`) keyed to five Unit-4 stimulus documents —
three new seeds plus two cross-course REUSE seeds shared with APUSH — and to
the five Unit-4 content lesson-plan LOs
(`src/lib/tutor/lesson-plan/seeds/ap-apworld-u4-*.ts`). `cedCode` mirrors each
LO's `standard` field exactly.

| loId | cedCode | Topic | # items in u4.json |
|---|---|---|---|
| `apworld.maritime-exploration` | `AP-APWORLD-4.1` | Motives, borrowed technology, and the Ming/Iberian maritime contrast (Columbus letter + Zheng He scale comparison). | 3 |
| `apworld.columbian-exchange-global` | `AP-APWORLD-4.3` | The global Columbian Exchange and the Potosí→Manila→China silver circuit (silver data table). | 3 |
| `apworld.maritime-empires` | `AP-APWORLD-4.4` | Trading-post vs. territorial maritime empires (non-stimulus). | 2 |
| `apworld.atlantic-slave-trade` | `AP-APWORLD-4.6` | Scale/geography of the Atlantic slave trade and the Middle Passage (Equiano). | 2 |
| `apworld.resistance-accommodation` | `AP-APWORLD-4.7` | Non-European states actively managing the terms of European contact (Tokugawa Closed Country Edict). | 2 |
| **Total** | | | **12** |

### Anchoring documents (stimulus sets)

- `evelyn.passage.apush-columbus-letter.v1` (REUSE from APUSH) — Columbus, letter to Luis de Santángel (1493) — 1 item
- `evelyn.passage.apworld-zheng-he-visual.v1` — Zheng He's treasure fleet vs. an Iberian caravel (scale-comparison visual) — 2 items
- `evelyn.passage.apworld-potosi-silver-table.v1` — registered silver output, Potosí and Spanish America (data table) — 3 items
- `evelyn.passage.apworld-tokugawa-edict.v1` — Closed Country Edict of 1635 (**described document** — no verbatim translation is public domain; see that seed's doc comment) — 2 items
- `evelyn.passage.apush-equiano.v1` (REUSE from APUSH) — Olaudah Equiano, "The Interesting Narrative" (1789) — 2 items
- `apworld.maritime-empires.mcq.01`/`.02` — non-stimulus (no `passageId`); tests the trading-post-vs-territorial-empire concept directly from the content plan's own facts, per the unit spec.

### Authoring notes specific to Unit 4's stimulus set

- **Tokugawa edict — described-document discipline.** `apworld-tokugawa-edict.ts` is a
  described document, not a verbatim translation (no confirmed public-domain
  English rendering of the 1635 edict could be sourced — see that seed's doc
  comment). Both Tokugawa items therefore **paraphrase** the edict's
  provisions in the stem's own words and contain **zero quotation marks
  around any edict language**, matching the discipline already enforced in
  the Unit-4 content plan (`ap-apworld-u4-resistance.ts`) and the passage
  seed itself.
- **Potosí figures — keys checked against the exact seeded numbers, not
  approximations.** The data table distinguishes three figures that are easy
  to conflate: (1) ~136,000 metric tons, all Spanish America, 1550–1800,
  ~80% of world output; (2) ~18,000 metric tons, Potosí **city** specifically
  (not "district"), 1574–1735; (3) 30–40% of American silver reaching China,
  presented as a genuine range, not a single point estimate. One item each
  targets: the hemispheric total (mcq.01), the city-vs-hemisphere
  relationship (mcq.02 — tests that students don't conflate the 18,000 t
  city figure with the 136,000 t hemispheric total, or assume identical/
  exclusive figures), and the China-share range read as a range rather than
  a false-precise "35%" (mcq.03).
- **Zheng He dimensions — contested ranges only.** Both Zheng He items use
  the passage's own honestly-presented range (traditional Ming shi-derived
  ~440×180 ft vs. modern reconstructions as low as ~170–250 ft) rather than
  asserting either figure as settled; mcq.03 directly tests the historical-
  thinking skill of handling genuinely disputed evidence.
- **Columbus — exact `apush-columbus-letter` rendering.** Quotes the
  "guileless, and so liberal…" span verbatim, per the unit spec's required
  wording; item tests sourcing (why Columbus framed the islanders this way,
  writing to the Spanish crown/investors) rather than plain comprehension.
- **Equiano — measured, inspection/confinement/fear content only.** Both
  items quote only the seeded inspection ("handled and tossed up to see if
  I were sound") and confinement/fear ("chained together… dejection and
  sorrow", "overpowered with horror and anguish") spans — no graphic
  content beyond what the passage itself contains. `atlantic-slave-trade.
  mcq.02`'s correct answer directly rebuts the "most captives went to North
  America" misconception (distractor A on that item), consistent with the
  concept's own hook/misconception-check framing (fewer than 5% went to
  British North America; the large majority went to Brazil/the Caribbean).
- **Maritime-empires misconception distractor.** `maritime-empires.mcq.02`
  option B ("most European maritime empires in Asia before 1750 were
  territorial conquests…") is the required real-misconception distractor
  from the unit spec, contrasted against the correct trading-post-empire-
  as-the-general-pattern answer (option A).

### Difficulty & answer-key hygiene

- Difficulty 1–4 mixed: 1×2, 2×5, 3×3, 4×2.
- Correct-answer letters distributed non-cyclically across all 12 items:
  A=3, B=3, C=3, D=3. Sequence: `BDACCBADBDCA` — not all one letter, not a
  repeating ABCD cyclic pattern.
- Choice lengths equalized per item (word-count checked, correct answer NOT
  the systematically longest option): initial draft had the correct choice
  as the unique longest option in 8 of 12 items; revised distractor/correct
  choice lengths so the correct answer is the **unique longest in 0 of 12
  items** after revision. Verify:
  `npx tsx -e "const a=require('./src/data/problem-bank/ap-world-history/u4.json'); let n=0; for(const i of a){const w=i.choices.map(c=>c.split(/\\s+/).length); const ci='ABCD'.indexOf(i.answer); if(w[ci]===Math.max(...w)&&w.filter(x=>x===Math.max(...w)).length===1)n++;} console.log('correctIsUniqueLongest', n+'/'+a.length);"`.
- All stems and choices are ORIGINAL — written for this bank, quoting only
  short verbatim phrases from the two public-domain Unit-4/APUSH-reuse text
  documents (Columbus, Equiano), and using exact figures (never invented
  ones) from the two described-visual/data-table stimuli (Zheng He, Potosí).
  `license: 'internal-original'` per `scripts/seed-problem-bank.ts`.

### Verification

`npm run seed:problem-bank -- --course=ap-world-history --file=u4.json --dry-run`:
12/12 passed Sonnet (`claude-sonnet-5`) independent-solve verify, 0 rejected,
first attempt. `npm run lint:passages` clean (70 passages, including all 5
Unit-4 stimulus documents referenced by this bank). Verbatim-quote spans
(Columbus, Equiano) confirmed as contiguous substrings of their passages'
seeded `fullText` by manual script check; Tokugawa items confirmed to
contain no quotation marks around edict language.

## Unit 5: Revolutions, c. 1750-1900 (CED Unit 5)

Stimulus-based MCQ bank (`u5.json`) keyed to five Unit-5 stimulus documents —
rights-of-man, bolivar-jamaica, communist-manifesto, wollstonecraft,
sadler-testimony — plus two non-stimulus items, and to the five Unit-5
content lesson-plan LOs
(`src/lib/tutor/lesson-plan/seeds/ap-apworld-u5-*.ts`). `cedCode` mirrors each
LO's `standard` field exactly.

| loId | cedCode | Topic | # items in u5.json |
|---|---|---|---|
| `apworld.enlightenment` | `AP-APWORLD-5.1` | Natural rights/social contract extended (unevenly) to women's education (Wollstonecraft). | 2 |
| `apworld.atlantic-revolutions` | `AP-APWORLD-5.2` | French universalist rights language (Rights of Man) vs. creole colonial-office grievances (Bolívar's Jamaica Letter). | 4 |
| `apworld.nationalism-unification` | `AP-APWORLD-5.2b` | Italian (Cavour/Garibaldi) vs. German (Bismarck) unification (non-stimulus). | 1 |
| `apworld.industrial-revolution` | `AP-APWORLD-5.3` | Why Britain industrialized first; factory-system living standards (non-stimulus). | 1 |
| `apworld.industrial-society` | `AP-APWORLD-5.7` | Class formation and the spectrum of responses: Sadler-testimony conditions and Marx/Engels's revolutionary analysis. | 4 |
| **Total** | | | **12** |

### Anchoring documents (stimulus sets)

- `evelyn.passage.apworld-rights-of-man.v1` — Declaration of the Rights of Man and of the Citizen (1789, Avalon trans.) — 2 items
- `evelyn.passage.apworld-bolivar-jamaica.v1` — Simón Bolívar, the Jamaica Letter (1815, Sherwell's 1921 PD English rendering) — 2 items
- `evelyn.passage.apworld-communist-manifesto.v1` — Marx & Engels, The Communist Manifesto (1848, Moore's 1888 PD trans.) — 2 items
- `evelyn.passage.apworld-wollstonecraft.v1` — Mary Wollstonecraft, *A Vindication of the Rights of Woman* (1792) — 2 items
- `evelyn.passage.apworld-sadler-testimony.v1` — Testimony of Matthew Crabtree before the Sadler Committee (1832) — 2 items
- `apworld.nationalism-unification.mcq.01` / `apworld.industrial-revolution.mcq.01` — non-stimulus (no `passageId`); test the Italy/Germany unification comparison and the "industrialization improved workers' lives immediately" misconception directly from each content plan's own facts, per the unit spec.

### Authoring notes specific to Unit 5's stimulus set

- **Bolívar — Sherwell 1921 attribution discipline.** Per the passage seed's
  own doc comment, Bolívar's Jamaica Letter is quoted only in Guillermo A.
  Sherwell's 1921 PD English rendering, never presented as Bolívar's
  original-language text. `atlantic-revolutions.mcq.03` makes this a direct
  sourcing test: the correct answer identifies the quoted wording as
  "Bolívar's argument as rendered into English by Sherwell in 1921," with
  distractors for "original Spanish," a colonial official's report, and a
  modern historian's summary.
- **Manifesto — one seeded span per item, never bridged.** The
  `communist-manifesto` seed contains two excerpted spans (the Section I
  "commodity" passage and the closing revolutionary call) separated by a
  large, explicitly marked elision. `industrial-society.mcq.01` quotes only
  the Section I span; `industrial-society.mcq.02` quotes only the closing
  span ("forcible overthrow... WORKING MEN OF ALL COUNTRIES, UNITE!"); no
  item treats the two spans as adjacent or bridges across the elision.
- **Sadler — hours/fatigue only, zero punishment content.** Per the seed's
  measured-selection discipline, both Sadler items (`industrial-society.
  mcq.03`, `.04`) quote only the hours-of-labour ("Fourteen hours" /
  "Sixteen hours") and fatigue/family-time ("Very much so" / "to receive
  instruction from them" / "go to bed immediately") spans — no quotation or
  paraphrase of the excluded punishment testimony anywhere in this bank.
- **Rights of Man — seeded Articles only.** Both `atlantic-revolutions.
  mcq.01`/`.02` quote only Articles 1, 2, and 3 as seeded (equality, natural
  rights, national sovereignty); no item quotes or invents language for the
  elided Articles 4-5.
- **Wollstonecraft — the seeded education/reason spans only.** Both
  `enlightenment.mcq.01`/`.02` quote only the individual-education
  definition and the virtue/reason argument against Rousseau, as seeded; no
  item invents a claim from outside the excerpt.
- **Real-misconception distractors, tied to each content plan's own
  misconception_check.** `enlightenment.mcq.01` option A ("preparing a child
  to embrace universal democracy, a goal Enlightenment thinkers broadly
  championed") is the unit's own "Enlightenment thinkers agreed on
  democracy" misconception. `atlantic-revolutions.mcq.04` option A ("the
  Atlantic Revolutions... extended identical rights to colonial subjects
  everywhere") is the unit's "the Atlantic revolutions extended rights
  equally" misconception. `nationalism-unification.mcq.01` option A treats
  Italy/Germany as ancient nations, the unit's "nation-states were ancient"
  misconception. `industrial-revolution.mcq.01` directly tests
  "industrialization improved workers' lives immediately" as its correct
  answer's contrast case. `industrial-society.mcq.02`'s three reform/union/
  cooperative distractors, set against the correct revolutionary-overthrow
  answer, test "Marxism and trade-union reform were the same response."

### Difficulty & answer-key hygiene

- Difficulty 1-4 mixed: 1x1, 2x5, 3x5, 4x1.
- Correct-answer letters distributed non-cyclically across all 12 items:
  A=3, B=3, C=3, D=3. Sequence: `BCBADCCAADDB` — not all one letter, not a
  repeating ABCD cyclic pattern.
- Choice lengths equalized per item (word-count checked, correct answer NOT
  the systematically longest option): initial draft had the correct choice
  as the unique longest option in 9 of 12 items; revised distractor/correct
  choice lengths so the correct answer is the **unique longest in 2 of 12
  items** after revision (`atlantic-revolutions.mcq.02`,
  `industrial-society.mcq.01`). Verify:
  `npx tsx -e "const a=require('./src/data/problem-bank/ap-world-history/u5.json'); let n=0; for(const i of a){const w=i.choices.map(c=>c.split(/\\s+/).length); const ci='ABCD'.indexOf(i.answer); if(w[ci]===Math.max(...w)&&w.filter(x=>x===Math.max(...w)).length===1)n++;} console.log('correctIsUniqueLongest', n+'/'+a.length);"`.
- All stems and choices are ORIGINAL — written for this bank, quoting only
  short verbatim phrases from the five public-domain Unit-5 documents.
  `license: 'internal-original'` per `scripts/seed-problem-bank.ts`.

### Verification

`npm run seed:problem-bank -- --course=ap-world-history --file=u5.json --dry-run`:
12/12 passed Sonnet (`claude-sonnet-5`) independent-solve verify, 0 rejected,
first attempt. `npm run lint:passages` clean (75 passages, including all 5
Unit-5 stimulus documents referenced by this bank). Verbatim-quote spans
(Rights of Man, Bolívar, Manifesto, Wollstonecraft, Sadler) confirmed as
contiguous substrings of their passages' seeded `fullText` by a standalone
script check (0 mismatches after fixing several added-punctuation and
casing artifacts from stem assembly); Sadler items confirmed to contain no
quotation or paraphrase of the excluded punishment testimony.
