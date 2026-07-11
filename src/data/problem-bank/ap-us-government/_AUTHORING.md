# AP US Government — Problem Bank Authoring Notes

## Unit 1: Foundations of American Democracy (CED Unit 1)

Stimulus-based MCQ bank (`u1.json`) keyed to the four Unit-1 primary/data
source documents seeded in `src/lib/tutor/passages/seeds/ap{ush,gov}-*.ts`
and to four Unit-1 content lesson-plan LOs
(`src/lib/tutor/lesson-plan/seeds/ap-apgov-u1-*.ts`). `cedCode` mirrors each
LO's `standard` field exactly. Note the rename: the federalism LO's stable id
is `apgov.federalism-foundations` (its seed *file* is still named
`ap-apgov-u1-federalism.ts`, but the `id:` inside is
`apgov.federalism-foundations`) — do not use the legacy `apgov.federalism`,
which collides with an older id.

| loId | cedCode | Topic | # items in u1.json |
|---|---|---|---|
| `apgov.constitution-ratification` | `AP-APGOV-1.4/1.5` | The Constitutional Convention & ratification debate — Federalist No. 10 vs. Brutus No. 1 on faction and the size of a republic. | 3 |
| `apgov.separation-of-powers` | `AP-APGOV-1.6` | Separation of powers & checks and balances — Federalist No. 51 on ambition counteracting ambition and internal/external controls on government. | 2 |
| `apgov.federalism-foundations` | `AP-APGOV-1.7/1.8/1.9` | Federalism — Federalist No. 51's "double security" argument, the federal grants-in-aid data table (fiscal federalism trend + categorical/block split), the Spending Clause basis of conditional grants, and applying *United States v. Lopez* (1995). | 5 |
| **Total** | | | **10** |

`apgov.democratic-ideals` (`AP-APGOV-1.1`) has no items in this bank — none
of the four seeded Unit-1 stimulus documents (two ratification-debate
essays, one separation-of-powers essay, one fiscal-federalism data table)
speaks to Enlightenment/democratic-ideals content; that LO is better served
by a future non-stimulus item set.

## Anchoring documents (stimulus sets)

Each item anchors to one of the four Unit-1 passage seeds via `passageId`
(for grouping/render):

- `evelyn.passage.apush-federalist-10.v1` — Madison, *Federalist No. 10*, on the definition of a faction — 2 items (mcq.01 solo; mcq.03 paired with Brutus 1)
- `evelyn.passage.apush-brutus-1.v1` — *Brutus No. 1*, the Anti-Federalist warning that a free republic cannot govern so large a territory — 2 items (mcq.02 solo; mcq.03 paired, `passageId` set to Brutus 1 since the item's reasoning question centers on Brutus's rebuttal)
- `evelyn.passage.apgov-federalist-51.v1` — Madison, *Federalist No. 51*, on ambition/checks-and-balances (paragraph 1) and the federalism "double security" argument (paragraph 2) — 3 items
- `evelyn.passage.apgov-federal-grants-table.v1` — OMB federal grants-in-aid data table, 1990–2019 — 4 items

Item `apgov.constitution-ratification.mcq.03` quotes both Federalist 10 and
Brutus 1 in the same stem (a Federalist-vs-Anti-Federalist comparison item,
same pattern as the existing APUSH `constitution-ratification.mcq.02`); each
quoted span is independently a verbatim substring of its own passage's
`fullText` (confirmed programmatically — see Verification below).

## Authoring rule: self-contained stems (controller override)

Same rule as the AP World History / AP US History / AP English Language
banks: `scripts/seed-problem-bank.ts`'s verify-at-ingest gate solves each
item from `problemText` alone — it does **not** load the referenced passage.
So every stem inlines the specific short quoted document line (a verbatim
substring of the seeded `fullText`, confirmed programmatically) before
asking the AP Gov reasoning question. `passageId` is still set on every item
— it drives stimulus-set grouping and full-document rendering during a
session; it is not required to *answer* the MCQ.

For the federal-grants-table set (a described data table, not literary
prose), the four numeric figures inlined in each stem (1990 $256B/10.8%,
2000 $416B/16.0%, 2010 $680B/17.6%, 2019 $692B/16.2%; FY2019 categorical
$581B/84% vs. block $111B/16%) are numerically identical to the seeded
`fullText`'s description, spelled out as "256 billion" rather than "$256
billion" to avoid the seed script's `$<digit>` KaTeX-currency-trap WARN
(`scripts/seed-problem-bank.ts`'s `validate()` flags `/\$(\d)/` in
`problemText`) — no other item in the problem bank uses a bare `$<digit>`
sequence either. The dollar-column-monotonic / share-peaks-in-2010 shape is
preserved exactly (mcq.02 explicitly tests that the share does *not* rise
every year, only the dollar figure does).

## AP Gov reasoning skills tested

Unlike a plain reading-comprehension bank, these items test authentic AP
Government source-analysis and application skills against the Unit-1
documents:

- **Comprehension of argument / point of view** — Madison's definition of a faction and what it is "adverse to" (constitution-ratification.mcq.01); Brutus's claim that no free republic has governed so large a territory (constitution-ratification.mcq.02); "Ambition must be made to counteract ambition" as the checks-and-balances mechanism, distinguished from federalism/judicial review/popular sovereignty as AP Gov vocabulary distractors (separation-of-powers.mcq.01).
- **Federalist vs. Anti-Federalist comparison** — Madison's large-republic cure for faction vs. Brutus's opposite conclusion that size destroys free government (constitution-ratification.mcq.03).
- **Reasoning from a hypothetical premise** — "If men were angels..." as the premise for structural checks over trust in official virtue (separation-of-powers.mcq.02).
- **Distinguishing federalism from separation of powers** — Federalist 51's "double security" (two governments, then subdivided departments), with branch-of-government and House/Senate distractors targeting the classic federalism/separation-of-powers mix-up (federalism-foundations.mcq.01).
- **Reading a quantitative trend accurately** — the dollar column rises every interval shown while the outlay-share column peaks in 2010 and eases by 2019, testing whether the student conflates "grew in dollars" with "grew as a share" (federalism-foundations.mcq.02).
- **Fiscal federalism / grant conditions** — the categorical-vs-block dollar split as evidence of limited state discretion over most federal grant money (federalism-foundations.mcq.03).
- **Constitutional basis of conditional grants** — the enumerated Spending Clause (tax and spend for the general welfare, Art. I §8 cl. 1) as the ground for offering grants with conditions, against Commerce-Clause, freestanding-implied-power, and reserved-power distractors (federalism-foundations.mcq.04).
- **Concept application: *United States v. Lopez* (1995)** — applying Lopez's Commerce Clause limits to explain why Congress relies on voluntary conditional spending rather than direct regulation (federalism-foundations.mcq.05).

## Constitutional accuracy notes

- Conditional grants and the Spending Clause: mainstream doctrine grounds
  Congress's power to offer grants and attach conditions in the enumerated
  taxing-and-spending power (Art. I §8 cl. 1, refined by *South Dakota v.
  Dole* (1987), which is not named in the item since it isn't in the Unit-1
  stimulus set). mcq.04's first draft instead keyed conditional grants to
  *McCulloch*'s implied-powers holding — flagged in review as doctrinally
  soft (the enumerated-power distractor was arguably closer to correct), so
  the item was rewritten to key cleanly to the Spending Clause, with a
  freestanding-implied-power distractor (wrong because the spending power IS
  expressly enumerated), a Commerce-Clause distractor (wrong per *Lopez*'s
  noneconomic-activity limit and because commerce power is not the grant
  mechanism), and a reserved-power distractor (wrong — this is a federal
  power being exercised).
- *United States v. Lopez* (1995): held the Commerce Clause does not reach
  noneconomic activity (there, gun possession near a school). mcq.05 keeps
  the claim scoped to what Lopez actually held (a Commerce Clause limit) and
  does not claim Lopez touched the spending power or the Necessary and
  Proper Clause — both wrong-holding distractors (choices A and C) exist
  specifically to catch a student who conflates the two doctrines.
- Federal grants-in-aid are voluntary: states may decline a grant and its
  conditions (the basis of mcq.05's correct answer and mcq.05-D's distractor,
  which asserts states are "required" to accept grants — false).

## Difficulty & answer-key hygiene

- Difficulty 1–4 mixed: 1×1, 2×5, 3×2, 4×2.
- Correct-answer letters distributed non-cyclically across all 10 items:
  A=2, B=3, C=3, D=2. Sequence: `CADBDCABCB` — not all one letter, not a
  repeating ABCD/period-4 pattern (the first draft's letter assignment was
  discarded specifically because it repeated a `BDAC BDAC` 4-cycle across
  items 1–8; the shipped sequence has no repeated 4-letter (or shorter)
  window and no back-to-back repeated letter).
- Choice lengths equalized per item (word-count checked, correct answer NOT
  the systematically longest option — the length-tell trap): initial draft
  had the correct choice as the unique longest option in 6 of 10 items;
  revised distractor/correct-choice lengths (six items rebalanced) so the
  correct answer is the **unique longest in 0 of 10 items** after revision.
  Verify:
  `npx tsx -e "const a=require('./src/data/problem-bank/ap-us-government/u1.json'); let n=0; for(const i of a){const w=i.choices.map(c=>c.split(/\\s+/).length); const ci='ABCD'.indexOf(i.answer); if(w[ci]===Math.max(...w)&&w.filter(x=>x===Math.max(...w)).length===1)n++;} console.log('correctIsUniqueLongest', n+'/'+a.length);"`.
- All stems and choices are ORIGINAL — written for this bank, quoting only
  short verbatim phrases from public-domain Unit-1 documents (never
  transcribed wholesale from a real AP exam). `license: 'internal-original'`
  per `scripts/seed-problem-bank.ts`.

## Verification

`npm run seed:problem-bank -- --course=ap-us-government --file=u1.json --dry-run`:
10/10 passed Sonnet (`claude-sonnet-5`) independent-solve verify, 0 rejected,
on the first pass (no answer-key fixes needed) — and again 10/10 after the
mcq.04 Spending-Clause rewrite. `npm run lint:passages`
clean (19 passages, including all 4 referenced by this bank). A standalone
verbatim-substring check confirmed every quoted span inside `problemText`
(9 quoted spans across the 6 Federalist-10/Brutus-1/Federalist-51 items) is
an exact substring of its passage's seeded `fullText` (0 mismatches); the
federal-grants-table items (4 items) inline numeric figures rather than
literary quotes, so fidelity there is a direct numeric match against the
seeded description instead of a substring check.

**Verifier persona caveat**: `scripts/seed-problem-bank.ts`'s verify prompt
hardcodes "You are an expert AP exam grader (math, calculus, statistics)" —
an AP-Statistics-flavored persona baked in from when the script was written
for that course. It still solved all 10 AP Gov items correctly (Sonnet's AP
Gov / constitutional-law knowledge doesn't depend on the system prompt's
subject label), so no item's key needed revision on account of this
mismatch. Flagged here per the Task 7 brief's caveat, not because any item
actually misfired.
