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
| **Total** | | | **10** |

## Anchoring documents (stimulus sets)

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
