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
