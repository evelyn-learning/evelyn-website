# AP World History — Problem Bank Authoring Notes

## Unit 1: The Global Tapestry, c. 1200–1450 (CED Unit 1)

Stimulus-based MCQ bank (`u1.json`) keyed to the four new Unit-1
primary-source seeds plus two documents reused from other banks
(`src/lib/tutor/passages/seeds/apworld-*.ts` and
`apush-cortes-tenochtitlan.ts`) and to the five Unit-1 content lesson-plan
LOs (`src/lib/tutor/lesson-plan/seeds/ap-apworld-u1-*.ts`). `cedCode`
mirrors each LO's `standard` field exactly.

| loId | cedCode | Topic | # items in u1.json |
|---|---|---|---|
| `apworld.east-asia-song` | `AP-APWORLD-1.1` | Song institutions (civil-service exam, Neo-Confucianism, champa rice) and Yuan continuity/change. | 3 |
| `apworld.dar-al-islam` | `AP-APWORLD-1.2` | Abbasid political fragmentation vs. ulama/madrasa/Sufi cultural unity. | 1 |
| `apworld.south-southeast-asia` | `AP-APWORLD-1.3` | The Delhi Sultanate court of Sultan Muhammad ibn Tughluq. | 2 |
| `apworld.americas-africa-states` | `AP-APWORLD-1.4` | The Mexica tribute empire (Tenochtitlan) and Mali's internationally recognized wealth (Catalan Atlas). | 2 |
| `apworld.medieval-europe` | `AP-APWORLD-1.6` | Magna Carta as a baronial limit on royal power. | 2 |
| **Total** | | | **10** |

## Anchoring documents (stimulus sets)

Each stimulus item anchors to one of four Unit-1 passage seeds via
`passageId` (for grouping/render); two items are non-stimulus (no
`passageId` — see the Unit-1 block's composition: "non-stimulus
dar-al-islam + east-asia 2"):

- `evelyn.passage.apworld-marco-polo-khan-court.v1` — Marco Polo, on Kublai Khan's palace at Cambaluc (the YUAN court, not Song) — 2 items
- `evelyn.passage.apworld-ibn-battuta-delhi.v1` — Ibn Battuta, on his reception and the character of Sultan Muhammad ibn Tughluq at Delhi — 2 items
- `evelyn.passage.apworld-magna-carta.v1` — Magna Carta (1215), clauses 12, 39, 40 — 2 items
- `evelyn.passage.apush-cortes-tenochtitlan.v1` — Cortés's 1520 letter on Tenochtitlan (REUSE from APUSH) — 1 item
- `evelyn.passage.apworld-catalan-atlas.v1` — the Catalan Atlas (visual document, Mansa Musa panel, REUSE from the Unit-2 packet) — 1 item
- No passage (non-stimulus, content-recall items testing the LO's key facts/misconceptions directly) — 2 items: `apworld.east-asia-song.mcq.03` (civil-service exam meritocracy-ideal-vs-practice), `apworld.dar-al-islam.mcq.01` (1258 Baghdad fall — political rupture vs. cultural unity)

## Attribution discipline (controller-flagged traps for this unit)

- **`apworld-marco-polo-khan-court.v1` is the YUAN court** (Kublai Khan, at Cambaluc) — both khan-court items attribute the palace description to Yuan rule, never to the Song Dynasty. `east-asia-song.mcq.01` explicitly tests this: Yuan rule "continued" the scale of centralized statecraft Song had built, as distinct from Song rule itself.
- **Magna Carta clause 12** is quoted exactly as seeded — `"No scutage not aid shall be imposed on our kingdom, unless by common counsel of our kingdom"` — preserving the source's own "not"/"nor" transcription slip rather than silently correcting it to "nor."
- **The Cortés item** (`americas-africa-states.mcq.01`) is explicitly framed as "his 1520 letter to Charles V" describing "the Mexica capital, Tenochtitlan" — a Spanish eyewitness account, not a neutral or Mexica-authored source.
- **The Catalan Atlas item** (`americas-africa-states.mcq.02`) attributes the map only to "the Majorcan cartographer Abraham Cresques" — matching the passage seed's own attribution exactly, with no added religious descriptor.

## Historical-reasoning skills tested

- **Sourcing / point of view** — Marco Polo's outsider awe as evidence of scale, not of specific Yuan institutions (`east-asia-song.mcq.02`); the Catalan Atlas as a European cartographer's depiction for a European king (`americas-africa-states.mcq.02`).
- **Contextualization** — Kublai Khan's palace splendor as continuity of centralized Chinese statecraft under a foreign dynasty (`east-asia-song.mcq.01`); Ibn Battuta's investiture as evidence of Delhi court patronage practice (`south-southeast-asia.mcq.01`); Tenochtitlan's market scale as evidence of a tribute empire's commercial capacity (`americas-africa-states.mcq.01`).
- **Causation / comparison** — the Sultan's unpredictable temperament as evidence about the personal, non-bureaucratic nature of Delhi Sultanate authority (`south-southeast-asia.mcq.02`); Magna Carta clause 12 as a specific procedural limit on royal taxation (`medieval-europe.mcq.01`).
- **Misconception correction (real AP traps)** — "Magna Carta established democracy" corrected against clauses 39/40, which protect "freemen" specifically, not the whole population (`medieval-europe.mcq.02`); "Islam spread in South Asia primarily by conquest" appears as a distractor tied to the Sultan's temperament item (`south-southeast-asia.mcq.02`); "pre-contact American/African states were isolated or stateless" appears as a distractor on the Cortés item (`americas-africa-states.mcq.01`) and is directly refuted by the Catalan Atlas item (`americas-africa-states.mcq.02`); "the civil-service exam was fully open to all" and "the Abbasid collapse ended Islamic cultural unity" are each tested directly by the two non-stimulus items (`east-asia-song.mcq.03`, `dar-al-islam.mcq.01`).

## Difficulty & answer-key hygiene

- Difficulty 1–4 spread, matching the Unit-2 shape: 1×1, 2×5, 3×3, 4×1.
- Correct-answer letters distributed non-cyclically across all 10 items:
  A=3, B=2, C=3, D=2. Sequence: `CBCDADCABA` — not all one letter, not a
  repeating ABCD pattern.
- Choice lengths word-count checked (script below): initial draft had the
  correct choice as the unique longest option in 5 of 10 items; revised
  distractor/correct-choice lengths so the correct answer is the **unique
  longest in 2 of 10 items** after revision (`dar-al-islam.mcq.01`,
  `medieval-europe.mcq.02`) — within the 0–2/10 budget. Verify:
  `npx tsx -e "const a=require('./src/data/problem-bank/ap-world-history/u1.json'); let n=0; for(const i of a){const w=i.choices.map(c=>c.split(/\\s+/).length); const ci='ABCD'.indexOf(i.answer); if(w[ci]===Math.max(...w)&&w.filter(x=>x===Math.max(...w)).length===1)n++;} console.log('correctIsUniqueLongest', n+'/'+a.length);"`.
- All stems and choices are ORIGINAL — written for this bank, quoting only
  short verbatim phrases from public-domain or reused Unit-1/Unit-2
  documents (never transcribed wholesale from a real AP exam).
  `license: 'internal-original'` per `scripts/seed-problem-bank.ts`.
- Quotes are closed with a straight `"` immediately after the verbatim
  span with no added period/comma inside the quotation marks (a mid-draft
  pass caught and fixed six instances where added punctuation broke the
  verbatim-substring match — e.g. clause 12's continuation comma, and the
  khan-court/ibn-battuta/Cortés quotes' natural sentence breaks).

## Verification

`npm run seed:problem-bank -- --course=ap-world-history --file=u1.json --dry-run`:
10/10 passed Sonnet (`claude-sonnet-5`) independent-solve verify, 0 rejected.
`npm run lint:passages` clean (70 passages, including all 4 new/reused
passages referenced by this bank). A standalone script confirmed every
quoted span inside `problemText` is a verbatim substring of its passage's
seeded `fullText` (0 mismatches, 12 quoted spans checked across 8
stimulus-anchored items).

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

## Unit 3: Land-Based Empires, c. 1450-1750 (CED Unit 3)

Stimulus-based MCQ bank (`u3.json`) keyed to the five Unit-3 primary/visual
source documents seeded in `src/lib/tutor/passages/seeds/apworld-*.ts` and to
the three Unit-3 content lesson-plan LOs
(`src/lib/tutor/lesson-plan/seeds/ap-apworld-u3-*.ts`). `cedCode` mirrors each
LO's `standard` field exactly.

| loId | cedCode | Topic | # items in u3.json |
|---|---|---|---|
| `apworld.empires-administration` | `AP-APWORLD-3.2` | Ottoman merit-based devshirme promotion (Busbecq); Mughal crown ownership of land and elite estates (Bernier); Peter the Great's westernization ordinances (beard tax, French dress). | 6 |
| `apworld.empires-belief-systems` | `AP-APWORLD-3.3` | Monumental architecture as Mughal imperial/religious legitimacy (Taj Mahal); Confucian filial piety as Qing political orthodoxy (Sacred Edict). | 2 |
| `apworld.empires-expansion` | `AP-APWORLD-3.1` | The "gunpowder empires" thesis and its limits; administrative capacity (not weaponry alone) as the basis of sustained territorial control. | 2 |
## Unit 6: Consequences of Industrialization, c. 1750–1900 (CED Unit 6)

Stimulus-based MCQ bank (`u6.json`) keyed to five Unit-6 passage seeds
(`src/lib/tutor/passages/seeds/apworld-{white-mans-burden,lin-zexu,berlin-act,
indenture-table,meiji-charter-oath}.ts`) plus one non-stimulus item, and to
the five Unit-6 content lesson-plan LOs
(`src/lib/tutor/lesson-plan/seeds/ap-apworld-u6-*.ts`). `cedCode` mirrors each
LO's `standard` field exactly. Composition matches the plan block
(`docs/superpowers/sdd/unit-6-block.md`, "MCQs (10)"): kipling 2, lin-zexu 2,
berlin-act 1, indenture-table 2, charter-oath 2, non-stimulus resistance 1.

| loId | cedCode | Topic | # items in u6.json |
|---|---|---|---|
| `apworld.imperial-expansion` | `AP-APWORLD-6.1` | Ideologies of empire (civilizing mission, Social Darwinism), the Scramble for Africa, the Berlin Act's effective-occupation rule. | 3 |
| `apworld.imperial-resistance` | `AP-APWORLD-6.3` | Resistance to imperial expansion — armed rebellion, monarchical/military resistance, millenarian movements; why outcomes diverged (Adwa vs. the Sepoy Rebellion). | 1 |
| `apworld.economic-imperialism` | `AP-APWORLD-6.5` | Opium Wars, unequal treaties and extraterritoriality, spheres of influence, informal imperialism in China. | 2 |
| `apworld.global-migration` | `AP-APWORLD-6.7` | Post-abolition indenture as a labor regime; the Indian-indenture data table (six destinations, 1834–1917). | 2 |
| `apworld.reform-responses` | `AP-APWORLD-6.4b` | Tanzimat, Self-Strengthening vs. Meiji contrast, the Charter Oath (1868). | 2 |
## Unit 8: 1945–Present (Cold War & Decolonization, CED Unit 8)

Stimulus-based MCQ bank (`u8.json`) keyed to five Unit-8 documents —
one REUSE from the APUSH bank (`evelyn.passage.apush-truman-doctrine.v1`,
cross-course document reuse) plus four new AP World seeds — and to the four
Unit-8 content lesson-plan LOs
(`src/lib/tutor/lesson-plan/seeds/ap-apworld-u8-*.ts`). `cedCode` mirrors
each LO's `standard` field exactly.

| loId | cedCode | Topic | # items in u8.json |
|---|---|---|---|
| `apworld.cold-war-global` | `AP-APWORLD-8.1` | The Cold War as a global conflict — containment, the Cuban Missile Crisis, nuclear-age crisis management. | 3 |
| `apworld.decolonization` | `AP-APWORLD-8.5` | Decolonization and the postwar international order — the UDHR's universalist claims, UN membership growth. | 4 |
| `apworld.end-cold-war` | `AP-APWORLD-8.9` | The end of the Cold War — the Berlin Wall's rise and fall, the internal causes of Soviet collapse. | 2 |
| `apworld.new-states` | `AP-APWORLD-8.7` | New states' development paths — the Non-Aligned Movement as a "third path." | 1 |
| **Total** | | | **10** |

## Anchoring documents (stimulus sets)

Each stimulus item anchors to one of the five Unit-3 passage seeds via
`passageId`; two items are non-stimulus (no `passageId` — content-recall
items testing the empires-expansion LO's key facts/misconceptions directly,
per the Unit-3 block's composition: "non-stimulus expansion 2"):

- `evelyn.passage.apworld-busbecq-suleiman.v1` — Ogier Ghiselin de Busbecq, *Turkish Letters* (1555), on merit-based advancement at Suleiman's Ottoman court — 2 items
- `evelyn.passage.apworld-bernier-mughal.v1` — François Bernier, *Travels in the Mogul Empire* (1656-68), on the Mughal crown's ownership of land and inheritance of nobles' estates — 2 items
- `evelyn.passage.apworld-peter-decrees.v1` — Jean Rousset de Missy's contemporary *Life of Peter the Great*, on the beard tax and French-dress ordinance — 2 items
- `evelyn.passage.apworld-taj-mahal.v1` — the Taj Mahal (visual/monument document, described facts only — no quoted text) — 1 item
- `evelyn.passage.apworld-kangxi-edict.v1` — Wang Yupu's colloquial exposition (trans. Baller) of Kangxi's 1670 Sacred Edict maxim on filial duty — 1 item
- No passage (non-stimulus, content-recall items testing the empires-expansion LO's key facts/misconceptions directly) — 2 items: `apworld.empires-expansion.mcq.01` (the "gunpowder empires" label as an incomplete explanation), `apworld.empires-expansion.mcq.02` (administrative capacity, not weaponry, as the basis of sustained control)

## Attribution discipline (controller-flagged traps for this unit)

- **The Peter the Great items are layered-attribution traps.** The seeded
  passage is Jean Rousset de Missy's *contemporary biographical account* of
  Peter's reforms (as anthologized by J. H. Robinson and hosted by the
  Fordham sourcebook) — no raw text of Peter's own ukases survives at that
  source. Both stems (`empires-administration.mcq.05`, `.mcq.06`)
  explicitly attribute the quoted wording to "the contemporary biographer
  Jean Rousset de Missy" / "the biographer's report of the tsar's action,"
  and never present it as Peter's own decree text. `.mcq.05`'s distractor C
  ("was recorded exclusively in Peter's own surviving handwritten decrees")
  directly tests whether a student collapses this distinction.
- **The Kangxi item is a layered-attribution trap.** The seeded passage is
  Wang Yupu's later colloquial exposition ("Direct Explanation") of Kangxi's
  1670 Sacred Edict maxim, in F. W. Baller's 1892 translation — not Kangxi's
  own original 1670 wording. `empires-belief-systems.mcq.02`'s stem
  attributes the quoted wording to "Wang Yupu's later colloquial exposition
  ... in F. W. Baller's translation" and explicitly flags "not Kangxi's own
  original 1670 wording"; distractor A ("Kangxi's personal diary entries")
  tests the same collapse.
- **The Taj Mahal item quotes nothing.** Per the passage seed's own
  documentation, this is a described-visual entry with no verbatim source
  text and "no verbatim-fidelity risk" — the stem states only the described
  facts (dates, workforce, cost, garden iconography) with no quotation
  marks.
- **Kinship check:** no item in this bank references Shah Jahan's parentage,
  so the Akbar-is-grandfather (not father) trap flagged in the task brief
  does not arise here; `empires-belief-systems.mcq.01` describes only the
  Taj Mahal's own facts (Shah Jahan as builder, Mumtaz Mahal as the
  mausoleum's subject), consistent with the passage seed.

## Historical-reasoning skills tested

- **Sourcing / point of view** — Busbecq as a Habsburg ambassador describing
  an unfamiliar court's meritocratic promotion system with evident admiration
  (`empires-administration.mcq.01`, `.mcq.02`); Bernier as the Mughal court's
  own physician reporting to a European patron on crown land ownership
  (`.mcq.03`, `.mcq.04`); the two-layer sourcing of the Peter items (a later
  biographer's account, not Peter's own words) and the Kangxi item (a later
  colloquial exposition, not Kangxi's own words).
- **Contextualization** — devshirme-recruited officials' low birth as
  evidence of a non-hereditary Ottoman elite (`empires-administration.mcq.02`);
  the Taj Mahal's scale and cost as a display of Mughal dynastic/religious
  legitimacy (`empires-belief-systems.mcq.01`); the 1453 fall of Constantinople
  as a limited illustration of the "gunpowder empires" thesis
  (`empires-expansion.mcq.01`).
- **Causation / comparison** — the beard tax and dress ordinance as parallel
  instruments of Peter's state-directed westernization
  (`empires-administration.mcq.05`, `.mcq.06`); Confucian filial piety as an
  analogy extended to political obedience under the Qing
  (`empires-belief-systems.mcq.02`).
- **Misconception correction (real AP traps)** — "European-style hereditary
  aristocracy was the universal elite model" is directly refuted by the
  Busbecq merit-based-promotion items and the Bernier crown-inheritance items
  (`empires-administration.mcq.01`, `.03`); "gunpowder alone explains the
  empires' rise" is directly refuted by both non-stimulus expansion items,
  which test administrative capacity and the cavalry-to-musket transition as
  co-equal factors (`empires-expansion.mcq.01`, `.mcq.02`).

## Difficulty & answer-key hygiene

- Difficulty 1-4 spread: 1x1, 2x4, 3x4, 4x1.
- Correct-answer letters distributed non-cyclically across all 10 items:
  A=3, B=2, C=3, D=2. Sequence: `CADBACDBCA` — not all one letter, not a
  repeating ABCD pattern.
- Choice lengths word-count checked (script below): initial draft had the
  correct choice as the unique longest option in 5 of 10 items; revised
  distractor/correct-choice lengths (lengthening a distractor in each
  flagged item, e.g. `empires-administration.mcq.01`'s option D, `.mcq.04`'s
  option A, `.mcq.06`'s option B, and both `empires-expansion` items' first
  distractor) so the correct answer is the **unique longest in 0 of 10
  items** after revision. Verify:
  `npx tsx -e "const a=require('./src/data/problem-bank/ap-world-history/u3.json'); let n=0; for(const i of a){const w=i.choices.map(c=>c.split(/\\s+/).length); const ci='ABCD'.indexOf(i.answer); if(w[ci]===Math.max(...w)&&w.filter(x=>x===Math.max(...w)).length===1)n++;} console.log('correctIsUniqueLongest', n+'/'+a.length);"`.
- All stems and choices are ORIGINAL — written for this bank, quoting only
  short verbatim phrases from public-domain Unit-3 documents (never
  transcribed wholesale from a real AP exam). `license: 'internal-original'`
  per `scripts/seed-problem-bank.ts`.
- Quotes are closed with a straight `"` immediately after the verbatim span
  with no added period/comma inside the quotation marks unless the source
  itself punctuates the excerpt at that exact point (e.g.
  `empires-administration.mcq.01`'s quote ends mid-sentence at a real source
  period; `.mcq.02`, `.mcq.03`, `.mcq.04`, and `.mcq.06`'s quotes close with
  no trailing punctuation, matching the seed's own ellipsis/comma
  continuation at that cut point, with connective prose supplied outside the
  quotation marks instead of splicing two quoted spans together).

## Verification

`npm run seed:problem-bank -- --course=ap-world-history --file=u3.json --dry-run`:
10/10 passed Sonnet (`claude-sonnet-5`) independent-solve verify, 0 rejected.
`npm run lint:passages` clean (75 passages, including all 5 new Unit-3
passages referenced by this bank). A standalone script confirmed every
quoted span inside `problemText` is a verbatim substring of its passage's
seeded `fullText` (0 mismatches, 7 quoted spans checked across 7
stimulus-anchored items; the Taj Mahal item quotes nothing by design).
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
Each stimulus item anchors to one of the five Unit-6 passage seeds via
`passageId`; the resistance item is deliberately non-stimulus (no wired
passage in the Unit-6 content-plan set — see `ap-apworld-u6-imperial-
resistance.ts`), so it carries no `passageId`:

- `evelyn.passage.apworld-white-mans-burden.v1` — Kipling, "The White Man's Burden" (1899) — 2 items
- `evelyn.passage.apworld-lin-zexu.v1` — Lin Zexu, letter to Queen Victoria (1839) — 2 items
- `evelyn.passage.apworld-berlin-act.v1` — General Act of the Berlin Conference (1885) — 1 item
- `evelyn.passage.apworld-indenture-table.v1` — Indian indentured emigration by destination (data table, 1834–1917) — 2 items
- `evelyn.passage.apworld-meiji-charter-oath.v1` — the Charter Oath (1868) — 2 items
- (no passage) — non-stimulus item comparing Adwa (1896) to the Sepoy Rebellion (1857) — 1 item

## Unit-6-specific authoring traps handled

- **Kipling is a primary source OF imperial ideology, not endorsed as fact.**
  Both kipling items (imperial-expansion.mcq.01/02) frame the poem's claims
  ("Your new-caught, sullen peoples," / "To seek another's profit," ...
  "And work another's gain.") as the "civilizing mission" ideology to be
  analyzed, never as an accurate description of colonized peoples or of
  imperialism's actual economic balance sheet — distractors that treat the
  poem's self-description as settled fact are the traps.
- **The Charter Oath is Griffis's rendering; only Articles 1 and 5 are
  quoted/tested** (reform-responses.mcq.01/02), per the controller
  instruction — Articles 2–4 are never quoted or tested in this bank.
- **The indenture table is INDIAN indenture only** — both indenture-table
  items (global-migration.mcq.01/02) explicitly state the scope ("INDIAN
  indentured emigration only ... excluding Chinese indenture and smaller
  streams to Malaya, the Seychelles, and East Africa") in the stem itself,
  and one distractor in mcq.01 baits the "these six totals represent the
  complete worldwide scale of unfree Asian labor migration" overgeneralization.
- **The Berlin Act had fourteen signatory powers, including the Ottoman
  Empire** — imperial-expansion.mcq.03 states this fact accurately in the
  stem and in a distractor (a false "unanimous vote of all fourteen, including
  the Ottoman Empire" claim), rather than omitting the Ottoman Empire from the
  signatory count as many popular summaries do.
- **"China was formally colonized" misconception** — economic-imperialism.mcq.02
  runs a distractor built exactly on this misconception ("China had already
  been formally divided into European colonial spheres of influence by 1839"),
  corrected by the fact that Lin's letter predates the First Opium War and
  China remained a sovereign Qing state under informal imperialism throughout
  Unit 6.
- **"Resistance always failed" misconception** — the sole non-stimulus item
  (imperial-resistance.mcq.01) tests this directly: Adwa (1896) as the
  clearest counterexample, with a distractor built on the companion
  misconception that the (ultimately suppressed) Sepoy Rebellion "had no
  lasting effect on imperial governance" — it forced the Crown to dissolve
  East India Company rule (Company to Raj, 1858).

## Difficulty & answer-key hygiene

- Difficulty 1–4 mixed: 1×1, 2×4, 3×4, 4×1.
- Correct-answer letters distributed non-cyclically across all 10 items:
  A=2, B=3, C=3, D=2. Sequence: `BACADBDCBC` — not all one letter, not a
  repeating ABCD pattern.
- Choice lengths checked per item (word-count, correct answer NOT the
  systematically longest option): initial draft had the correct choice as the
  unique longest option in 7 of 10 items; revised distractor/correct-choice
  lengths (and, for imperial-expansion.mcq.03, reordered the four choices so
  the correct answer lands on letter D instead of C) so the correct answer is
  the **unique longest in 0 of 10 items** after revision. Verify:
  `npx tsx -e "const a=require('./src/data/problem-bank/ap-world-history/u6.json'); let n=0; for(const i of a){const w=i.choices.map(c=>c.split(/\\s+/).length); const ci='ABCD'.indexOf(i.answer); if(w[ci]===Math.max(...w)&&w.filter(x=>x===Math.max(...w)).length===1)n++;} console.log('correctIsUniqueLongest', n+'/'+a.length);"`.
- All stems and choices are ORIGINAL — written for this bank, quoting only
  short verbatim phrases from public-domain Unit-6 documents (never
  transcribed wholesale from a real AP exam). `license: 'internal-original'`
  per `scripts/seed-problem-bank.ts`.

## Verification (Unit 6)

`npm run seed:problem-bank -- --course=ap-world-history --file=u6.json --dry-run`:
10/10 passed Sonnet (`claude-sonnet-5`) independent-solve verify, 0 rejected.
`npm run lint:passages` clean (72 passages, including all 5 referenced by
this bank). A standalone script confirmed every quoted span inside
`problemText` is a verbatim substring of its passage's seeded `fullText`
(0 mismatches).

## Unit 7: Global Conflict, c. 1900–present (CED Unit 7)

Stimulus-based MCQ bank (`u7.json`) keyed to five Unit-7 passage seeds
(`src/lib/tutor/passages/seeds/apworld-{fourteen-points,versailles,wwi-
propaganda-visual,depression-table}.ts` plus the cross-course REUSE
`apush-four-freedoms.ts`) plus two non-stimulus items, and to the four
Unit-7 content lesson-plan LOs
(`src/lib/tutor/lesson-plan/seeds/ap-apworld-u7-*.ts`). `cedCode` mirrors
each LO's `standard` field exactly. Composition matches the plan block
(`.superpowers/sdd/unit-7-block.md`, "MCQs (10)"): fourteen-points 2,
versailles 2, propaganda-visual 1, depression-table 2, four-freedoms 1,
non-stimulus wwii + legacies 2.

| loId | cedCode | Topic | # items in u7.json |
|---|---|---|---|
| `apworld.wwi-global` | `AP-APWORLD-7.2` | WWI's MAIN causes and alliance cascade, total war, colonial manpower, the Fourteen Points vs. the Versailles mandate system (Article 22). | 5 |
| `apworld.interwar-world` | `AP-APWORLD-7.4` | The Great Depression's global transmission via trade collapse (world-trade/unemployment data table). | 2 |
| `apworld.wwii-global` | `AP-APWORLD-7.7` | The aggression sequence (Manchuria 1931 onward), FDR's Four Freedoms as universal war aims. | 2 |
| `apworld.conflict-legacies` | `AP-APWORLD-7.8` | Documented state/organizational planning behind 20th-century genocides (Wannsee, Angkar, Interahamwe). | 1 |
| **Total** | | | **10** |

Note: the wwi-global LO carries three different passages (fourteen-points,
versailles, and the propaganda-visual poster) totaling 5 items — all three
passages are wired to the same `wwi-global` content plan
(`ap-apworld-u7-wwi.ts`), so they share one LO/cedCode per the LO table,
mirroring how Unit 6's `imperial-expansion` LO carried two passages
(kipling + berlin-act) for 3 items.

## Anchoring documents (stimulus sets)

Each stimulus item anchors to one of the five Unit-7 passage seeds via
`passageId`; the two non-stimulus items (WWII aggression-sequence
chronology, and the legacies state-planning item) carry no `passageId`,
mirroring Unit 6's non-stimulus imperial-resistance item:

- `evelyn.passage.apworld-fourteen-points.v1` — Wilson's Fourteen Points, Points I and V (1918) — 2 items
- `evelyn.passage.apworld-versailles.v1` — Treaty of Versailles, Articles 231 and 22 (1919) — 2 items
- `evelyn.passage.apworld-wwi-propaganda-visual.v1` — Indian Army recruitment poster (described visual, c.1914-1918) — 1 item
- `evelyn.passage.apworld-depression-table.v1` — Great Depression indicators (data table, 1929-1934) — 2 items
- `evelyn.passage.apush-four-freedoms.v1` — FDR, Four Freedoms speech (1941, cross-course reuse from APUSH) — 1 item
- (no passage) — non-stimulus item on the WWII aggression sequence (Manchuria 1931 vs. the 1939 "universal start" misconception) — 1 item
- (no passage) — non-stimulus item on documented genocide planning (Wannsee/Angkar/Interahamwe vs. the "spontaneous eruption" misconception) — 1 item

## Unit-7-specific authoring traps handled

- **The poster's translated caption is never quoted as verbatim.** The
  propaganda-visual passage's `fullText` is itself a factual DESCRIPTION of
  the poster (production method, imagery, IWM cataloguing), not a
  transcription of its Hindi/Urdu caption — wwi-global.mcq.05 quotes only
  the passage's own descriptive sentences (soldier/map imagery, the
  paper-strip production method, the 1.3-million-man recruitment figure),
  never the caption's "sense" paraphrase, per the controller instruction.
- **Article 22 is Covenant/Part I, not the reparations sections.**
  wwi-global.mcq.04 states this explicitly (Article 22 sits in Part I of
  the treaty, distinct from Article 231's Part VIII/"General Provisions"),
  matching the passage's own doc comment; wwi-global.mcq.03's distractor
  baits conflating the two articles.
- **Four Freedoms scope wording quoted precisely.** wwii-global.mcq.01
  quotes "everywhere in the world" for freedom of speech and "anywhere in
  the world" for freedom from fear, exactly as seeded — never swapping the
  two words between freedoms.
- **Depression anchor figures used exactly as seeded.** interwar-world
  items quote "roughly 66 percent... to about one-third of its 1929
  level" (world trade), "24.9 percent in 1933" (US unemployment), and
  "about 30 percent by 1932" (German unemployment) — no rounding drift
  from the passage's stated figures.
- **"WWI was purely European" misconception** — wwi-global.mcq.05 runs
  this exact claim as a distractor ("World War I was fought exclusively
  among European powers... with no other regions involved"), refuted by
  the poster's evidence of mass colonial recruitment.
- **"The Depression affected only industrial countries" misconception** —
  interwar-world.mcq.01's correct answer is precisely this claim, framed
  as the claim the data table's trade-collapse row refutes.
- **"WWII began in 1939 everywhere" misconception** — the sole
  non-stimulus WWII item (wwii-global.mcq.02) tests this directly: Japan's
  1931 Manchuria invasion and 1937 war with China as the clear
  counterexample, with a distractor baiting the companion "Asia's war
  began only after Pearl Harbor" misreading.
- **"Genocides are spontaneous eruptions" misconception** — the sole
  non-stimulus legacies item (conflict-legacies.mcq.01) tests this
  directly: the Wannsee Conference, Angkar, and the Interahamwe's
  documented planning as evidence against spontaneity, per the plan
  block's instruction to test this point factually.
- **Zero-quote copyright discipline preserved.** No item in this bank
  quotes Gandhi, Ho Chi Minh, or May Fourth material (none of the three is
  wired to a passage in the Unit-7 content-plan set, so none is
  MCQ-eligible in this bank) — all quoted spans come only from the five
  registered public-domain/US-government passages.

## Difficulty & answer-key hygiene

- Difficulty 1–4 mixed: 1×1, 2×4, 3×4, 4×1 (mirrors the Unit-6 spread).
- Correct-answer letters distributed non-cyclically across all 10 items:
  A=2, B=3, C=3, D=2. Sequence: `CABDACBDCB` — not all one letter, not a
  repeating ABCD pattern.
- Choice lengths checked per item (word-count, correct answer NOT the
  systematically longest option): correct answer is the **unique longest
  in 0 of 10 items**. Verify:
  `npx tsx -e "const a=require('./src/data/problem-bank/ap-world-history/u7.json'); let n=0; for(const i of a){const w=i.choices.map(c=>c.split(/\\s+/).length); const ci='ABCD'.indexOf(i.answer); if(w[ci]===Math.max(...w)&&w.filter(x=>x===Math.max(...w)).length===1)n++;} console.log('correctIsUniqueLongest', n+'/'+a.length);"`.
- All stems and choices are ORIGINAL — written for this bank, quoting only
  short verbatim phrases from public-domain/US-government Unit-7 documents
  (never transcribed wholesale from a real AP exam). `license:
  'internal-original'` per `scripts/seed-problem-bank.ts`.

## Verification (Unit 7)

`npm run seed:problem-bank -- --course=ap-world-history --file=u7.json --dry-run`:
10/10 passed Sonnet (`claude-sonnet-5`) independent-solve verify, 0 rejected.
`npm run lint:passages` clean (76 passages, including all 5 referenced by
this bank). A standalone script confirmed every quoted span inside
`problemText` is a verbatim substring of its passage's seeded `fullText`
(0 mismatches).
Six of ten items anchor to a Unit-8 passage seed via `passageId`; the
remaining two (`apworld.end-cold-war.mcq.02`, `apworld.new-states.mcq.01`)
are non-stimulus items testing content-plan material directly, per the
unit's planned MCQ composition, and omit `passageId`:

- `evelyn.passage.apush-truman-doctrine.v1` — Truman, on the containment commitment (cross-course REUSE from the APUSH bank) — 1 item
- `evelyn.passage.apworld-jfk-cuba.v1` — Kennedy, the October 1962 Cuban Missile Crisis quarantine address — 2 items (one quote per non-adjacent excerpted span, never spanning the elision)
- `evelyn.passage.apworld-udhr.v1` — the Universal Declaration of Human Rights, Preamble/Articles 1-2 class excerpt — 2 items
- `evelyn.passage.apworld-un-membership-table.v1` — described data table, UN membership growth 1945-2000 — 2 items (one keyed to the unambiguous 1960 single-year +17 jump, never an ambiguous "largest decade" framing; one to the overall 51-to-189 long-run trend)
- `evelyn.passage.apworld-berlin-wall-visual.v1` — described photograph set, the Berlin Wall 1961-1989 — 1 item

## Authoring rule: self-contained stems (controller override)

Same rule as Unit 2 and the AP US History / AP English Language banks: the
verify-at-ingest gate solves each item from `problemText` alone, so every
stimulus item inlines the specific quoted line, or (for the described data
table / visual) the specific real figures or facts, needed to answer —
without requiring the referenced passage to be loaded. `passageId` is still
set on every stimulus item for stimulus-set grouping/full-document
rendering; the two non-stimulus items omit it entirely, per plan.

## Compliance notes specific to Unit 8

- **JFK non-adjacent spans:** the Cuban Missile Crisis passage's seeded
  `fullText` elides two gaps (marked `. . .`) between three quoted
  paragraphs. Each of the two JFK items quotes verbatim from exactly one
  paragraph — never a span crossing an elision.
- **UN-table anchor discipline:** `decolonization.mcq.03` keys to the
  1960 single-year jump (82 -> 99, +17 members, 16 of 17 newly independent
  African states) — the unit's specified unambiguous anchor. No item keys
  an ambiguous "largest decade" framing.
- **UDHR excerpt class:** both UDHR items quote only from the Preamble/
  Articles 1-2 class excerpt actually seeded (Article 1's universal-equality
  clause; Article 2's non-distinction-by-territorial-status clause) — no
  quotation from any article outside the seeded excerpt.
- **Zero-quote copyright rule:** `new-states.mcq.01` names the 1955 Bandung
  Conference and tests the Non-Aligned Movement, but quotes no text from
  Nehru, Nkrumah, Gandhi, Nasser, or any Bandung-associated figure — the
  item is entirely original prose.
- **Real-misconception distractors:** `end-cold-war.mcq.02` directly tests
  the unit's flagged misconception ("the West simply won") by making the
  single-cause "NATO military defeat" option a distractor and keying the
  internal-causes (Gorbachev reforms, Afghanistan, Eastern European reform
  movements) option as correct. `new-states.mcq.01` similarly distractors
  the "everyone picked a superpower" misconception against the correct
  non-alignment answer.

## Difficulty & answer-key hygiene

- Difficulty 1-4 spread: 1x2, 2x5, 3x2, 4x1.
- Correct-answer letters distributed non-cyclically across all 10 items:
  A=3, B=2, C=2, D=3. Sequence: `BACDBADCAD` — not all one letter, not a
  repeating ABCD pattern.
- Choice lengths checked (word-count), correct answer NOT the systematically
  longest option: correct is the unique longest choice in **1 of 10** items
  (`new-states.mcq.01`), within the 0-2/file allowance. Verify:
  `npx tsx -e "const a=require('./src/data/problem-bank/ap-world-history/u8.json'); let n=0; for(const i of a){const w=i.choices.map(c=>c.split(/\\s+/).length); const ci='ABCD'.indexOf(i.answer); if(w[ci]===Math.max(...w)&&w.filter(x=>x===Math.max(...w)).length===1)n++;} console.log('correctIsUniqueLongest', n+'/'+a.length);"`.
- All stems and choices are ORIGINAL, quoting only short verbatim phrases
  (or, for the two described-document stimuli, real stated figures/facts)
  from the public-domain Unit-8 documents. `license: 'internal-original'`
  per `scripts/seed-problem-bank.ts`.

## Verification

`npm run seed:problem-bank -- --course=ap-world-history --file=u8.json --dry-run`:
10/10 passed Sonnet (`claude-sonnet-5`) independent-solve verify, 0 rejected.
`npm run lint:passages` clean (71 passages, including all 5 referenced by
this bank). A standalone script confirmed every quoted span inside
`problemText` is a verbatim substring of its passage's seeded `fullText`
(0 mismatches), and every stated UN-membership figure is a verbatim/accurate
match against the described table's seeded `fullText`.

## Unit 9: 1900–Present (Globalization, CED Unit 9)

Stimulus-based MCQ bank (`u9.json`) keyed to five Unit-9 documents — three
new described data-table seeds plus two REUSEs (`evelyn.passage.apworld-udhr.v1`
from Unit 8, `evelyn.passage.apush-bush-sept-2001.v1` cross-course from the
APUSH catalog) — and to the four Unit-9 content lesson-plan LOs
(`src/lib/tutor/lesson-plan/seeds/ap-apworld-u9-*.ts`). `cedCode` mirrors
each LO's `standard` field exactly. Composition follows the unit's planned
MCQ spec exactly: life-expectancy 2, ict 1, trade-table 1, udhr 1, bush 1,
non-stimulus global-economy + technology 2.

| loId | cedCode | Topic | # items in u9.json |
|---|---|---|---|
| `apworld.global-economy` | `AP-APWORLD-9.1` | The globalizing economy — Bretton Woods, GATT/WTO, multinational supply chains, China's reform era, the Asian Tigers, financial crises. | 2 |
| `apworld.technology-communication` | `AP-APWORLD-9.4` | Technology, communication, and health — the Green Revolution, medical advances, jet travel, internet/mobile leapfrogging. | 2 |
| `apworld.environment-disease` | `AP-APWORLD-9.6` | Population, disease, and the environment — the demographic transition, twentieth-century epidemics, climate change, global life expectancy. | 2 |
| `apworld.culture-rights-migration` | `AP-APWORLD-9.8` | Global culture, human rights, and migration — the UDHR, multidirectional cultural flows, the post-9/11 security-vs-rights debate. | 2 |
| **Total** | | | **8** |

## Anchoring documents (stimulus sets)

Six of eight items anchor to a Unit-9 passage seed via `passageId`; the
remaining two (`apworld.global-economy.mcq.02`, `apworld.technology-communication.mcq.02`)
are non-stimulus items testing content-plan material directly, per the
unit's planned MCQ composition, and omit `passageId`:

- `evelyn.passage.apworld-life-expectancy-table.v1` — described data table, world/regional life expectancy 1950 vs. 2019 (UN WPP) — 2 items (one keyed to the unambiguous "largest gain" anchor — Asia +32 years — never an ambiguous framing; one to the starting-point-vs.-gain reasoning behind Africa remaining furthest behind despite a real 25-year gain)
- `evelyn.passage.apworld-ict-table.v1` — described data table, global mobile subscriptions and Internet use 1990–2020 (ITU) — 1 item (leapfrogging inference from the mobile-vs.-internet growth gap; internet figures used ONLY from 2005 onward, per the seed's own documented data-gap before that year — never implying an earlier global internet-use figure)
- `evelyn.passage.apworld-trade-container-table.v1` — described data table, world container throughput vs. merchandise export value 1980–2020 (UNCTAD/WTO) — 1 item (physical-volume vs. nominal-dollar reliability, with the post-2010 flattening scoping note)
- `evelyn.passage.apworld-udhr.v1` — the Universal Declaration of Human Rights, Preamble/Articles 1–2 class excerpt (REUSE from Unit 8) — 1 item (a new anchor from this bank's Unit-8 items: the Preamble's "barbarous acts" clause read as historical context for the Declaration, contextualization skill)
- `evelyn.passage.apush-bush-sept-2001.v1` — Bush's September 20, 2001 address to Congress (cross-course REUSE from the APUSH catalog) — 1 item (quotes only the first paragraph's closing sentence, entirely within one contiguous segment, never crossing the seed's internal elision)

## Authoring rule: self-contained stems (controller override)

Same rule as Units 2 and 8 and the AP US History / AP English Language
banks: the verify-at-ingest gate solves each item from `problemText` alone,
so every stimulus item inlines the specific quoted line, or (for the three
described data tables) the specific real figures needed to answer, without
requiring the referenced passage to be loaded. `passageId` is still set on
every stimulus item for stimulus-set grouping/full-document rendering; the
two non-stimulus items omit it entirely, per plan.

## Compliance notes specific to Unit 9

- **Life-expectancy anchor discipline:** both items key to the unit's
  specified unambiguous anchors — Asia's +32-year gain as the largest of
  the three regions shown (`environment-disease.mcq.01`), and the
  starting-point-vs.-gain reasoning explaining why Africa's smaller
  absolute gain (a real +25 years) still leaves it behind Europe's smaller
  +17-year gain (`environment-disease.mcq.02`). No item claims a figure
  outside the seeded 46→73 (world), 37→62 (Africa), 42→74 (Asia), 62→79
  (Europe) set.
- **ICT internet-data-gap discipline:** `technology-communication.mcq.01`
  states internet-use figures ONLY from 2005 onward (15.6%/28.4%/39.9%/
  60.1%), matching the seed's documented absence of a reliable global
  aggregate before 2005 — the item never implies a 1990 or 2000
  internet-use figure exists. Mobile-subscription figures (11M/738M/5.29B/
  8.26B for 1990/2000/2010/2020) are stated separately and correctly.
- **Trade-table scoping:** `global-economy.mcq.01` states both the physical
  (36M→792M TEU, ~22×) and nominal-dollar ($1.97T→$17.73T, ~9×) series and
  scopes the dollar figure honestly as "current (not inflation-adjusted)
  US dollars," per the seed's documented distinction.
- **UDHR excerpt class:** `culture-rights-migration.mcq.01` quotes only from
  the Preamble/Articles 1–2 class excerpt actually seeded (the "barbarous
  acts" Preamble clause and Article 1's universal-equality clause) — no
  quotation from any article outside the seeded excerpt.
- **Bush single-segment discipline:** `culture-rights-migration.mcq.02`
  quotes only "night fell on a different world, a world where freedom
  itself is under attack" — the final sentence of the seed's first
  paragraph, entirely before the seed's paragraph-break elision. No item
  bridges this paragraph with the second (the Muslims/Islam paragraph) or
  crosses the "..." elision inside the second paragraph.
- **Zero-quote copyright rule:** `global-economy.mcq.02` (Deng Xiaoping's
  reform era, described via China's reform outcomes) and
  `technology-communication.mcq.02` (Norman Borlaug's Green Revolution,
  described via its documented effects) name no post-1928 figure's quoted
  words — both items are entirely original prose built from documented
  facts.
- **Real-misconception distractors:** `global-economy.mcq.02` directly
  tests the unit's flagged misconception ("globalization is only
  Westernization") by making the one-directional-Western-flow option the
  targeted-false claim and keying the multidirectional-supply-chain
  evidence as the correct answer choice. `technology-communication.mcq.02`
  similarly targets "technology diffuses evenly" as the false claim
  undermined by the Green Revolution's uneven reach and smallpox
  eradication's decades-long campaign.
- **Non-partisan tone:** the 9/11 item (`culture-rights-migration.mcq.02`)
  is framed entirely around the historical security-vs-rights tension
  Bush's own address opened, with no judgment offered on the merits of any
  security policy; the UDHR item is framed as historical contextualization,
  not a present-day rights argument.

## Difficulty & answer-key hygiene

- Difficulty 1–4 spread: 1×1, 2×3, 3×3, 4×1.
- Correct-answer letters distributed non-cyclically across all 8 items:
  A=2, B=2, C=2, D=2. Sequence: `BDACDBCA` — not all one letter, not a
  repeating ABCD pattern, and not a repeating 4-item block (`BDAC` vs.
  `DBCA` differ in order).
- Choice lengths checked (word-count), correct answer NOT the systematically
  longest option: correct is the unique longest choice in **2 of 8** items
  (`global-economy.mcq.01`, `culture-rights-migration.mcq.02`), within the
  0–2/file allowance. Verify:
  `npx tsx -e "const a=require('./src/data/problem-bank/ap-world-history/u9.json'); let n=0; for(const i of a){const w=i.choices.map(c=>c.split(/\\s+/).length); const ci='ABCD'.indexOf(i.answer); if(w[ci]===Math.max(...w)&&w.filter(x=>x===Math.max(...w)).length===1)n++;} console.log('correctIsUniqueLongest', n+'/'+a.length);"`.
- All stems and choices are ORIGINAL, quoting only short verbatim phrases
  (or, for the three described-data-table stimuli, real stated figures)
  from the public-domain Unit-9 documents. `license: 'internal-original'`
  per `scripts/seed-problem-bank.ts`.

## Verification

`npm run seed:problem-bank -- --course=ap-world-history --file=u9.json --dry-run`:
8/8 passed Sonnet (`claude-sonnet-5`) independent-solve verify, 0 rejected.
(One non-blocking `WARN problemText has $<digit> (currency/KaTeX trap)` on
`global-economy.mcq.01`, from the real `$1.97 trillion`/`$17.73 trillion`
export-value figures — expected and harmless per the script's own comment,
"warn, don't fail.")
`npm run lint:passages` clean (74 passages, including all 5 referenced by
this bank). A standalone script confirmed every quoted span inside
`problemText` (the two UDHR quotes, the one Bush quote) is a verbatim
substring of its passage's seeded `fullText` (0 mismatches), and every
stated life-expectancy/ICT/trade figure is a verbatim/accurate match
against its described table's seeded `fullText`.
