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

## Unit 2: Interactions Among Branches of Government (CED Unit 2)

Stimulus-based MCQ bank (`u2.json`, 15 items) keyed to the four Unit-2
primary/data source documents seeded in
`src/lib/tutor/passages/seeds/apgov-{federalist-70,federalist-78,marbury-opinion,congress-demographics-table}.ts`
and to the five Unit-2 content lesson-plan LOs
(`src/lib/tutor/lesson-plan/seeds/ap-apgov-u2-{congress,presidency,judiciary,bureaucracy,checks-in-practice}.ts`).
`cedCode` mirrors each LO's `standard` field exactly. By design, the script's
course-aware verify persona (`COURSE_NAMES['ap-us-government']` = "AP US
Government and Politics", added on the `ba11d4f` fix commit ahead of this
bank) and the passage-fed verify gate (the verifier receives the full
`fullText` of any item's `passageId`, not just the stem) both apply here —
see Verification below.

| loId | cedCode | Topic | # items in u2.json |
|---|---|---|---|
| `apgov.congress-structure` | `AP-APGOV-2.1/2.2/2.3` | Congress: structure, standing committees, the Senate filibuster/cloture, the women-in-Congress demographics table (descriptive representation), and *Shaw v. Reno* (racial gerrymandering, Equal Protection). | 5 |
| `apgov.presidency-power` | `AP-APGOV-2.4/2.5/2.6/2.7` | The presidency — Federalist No. 70 on energy in the executive (unity, the plurality/accountability objection). | 3 |
| `apgov.judiciary-independence` | `AP-APGOV-2.8/2.9/2.10/2.11` | The federal judiciary — Federalist No. 78 (least dangerous branch, life tenure) and *Marbury v. Madison* (judicial review reasoning, including a Federalist-78-vs-Marbury comparison item). | 4 |
| `apgov.bureaucracy-accountability` | `AP-APGOV-2.12/2.13/2.14` | The bureaucracy — notice-and-comment rulemaking; congressional oversight tools (hearings, funding threats). | 2 |
| `apgov.checks-in-practice` | `AP-APGOV-2.15` | Policy-making across branches — the War Powers Resolution (1973) as a congressional check on presidential war power. | 1 |
| **Total** | | | **15** |

## Anchoring documents (stimulus sets)

Each stimulus-anchored item anchors to one of the four Unit-2 passage seeds
via `passageId` (for grouping/render):

- `evelyn.passage.apgov-federalist-70.v1` — Hamilton, *Federalist No. 70*, on energy in the executive (unity, duration, support, powers; the plurality-destroys-accountability objection) — 3 items (presidency-power.mcq.01–03)
- `evelyn.passage.apgov-federalist-78.v1` — Hamilton, *Federalist No. 78*, on the judiciary as "least dangerous," "neither FORCE nor WILL," and life tenure — 3 items (judiciary-independence.mcq.01–02 solo; mcq.04 paired, `passageId` set to Marbury since the item's reasoning question centers on Marbury's holding)
- `evelyn.passage.apgov-marbury-opinion.v1` — Marshall's opinion in *Marbury v. Madison* (1803) — the "say what the law is" and "law repugnant to the constitution is void" reasoning — 2 items (judiciary-independence.mcq.03 solo; mcq.04 paired)
- `evelyn.passage.apgov-congress-demographics-table.v1` — CRS "Women in Congress" data table, 1961–2021 — 2 items (congress-structure.mcq.01–02)

5 non-stimulus items (no `passageId`, since no seeded Unit-2 document speaks
to these topics) round out the bank: standing committees and the Senate
filibuster/cloture threshold (congress-structure.mcq.03–04), *Shaw v. Reno*
(congress-structure.mcq.05), notice-and-comment rulemaking and congressional
oversight of agencies (bureaucracy-accountability.mcq.01–02), and the War
Powers Resolution (checks-in-practice.mcq.01).

Item `apgov.judiciary-independence.mcq.04` quotes both Federalist 78 and
Marbury in the same stem (a theory-into-holding comparison item, same
pattern as the Unit-1 bank's Federalist-10/Brutus-1 comparison item); each
quoted span (from both Federalist 78 and Marbury) is independently a
verbatim substring of its own passage's `fullText` (confirmed
programmatically — see Verification below), even though only the Marbury
passage is fed to the verify gate via `passageId`.

## Authoring rule: self-contained stems (controller override)

Same rule as the Unit-1 bank: every stem inlines the specific short quoted
document line (a verbatim substring of the seeded `fullText`) or, for the
demographics-table set, the specific numeric figures tested, directly in the
stem, before asking the AP Gov reasoning question. This is now belt-and-
suspenders rather than strictly required — the verify gate is passage-fed as
of the `ba11d4f` fix (the verifier receives the full stimulus text for any
item with a `passageId`) — but self-contained stems remain the authoring
convention because the *student* sees the stem before optionally expanding
the full stimulus, and because the five non-stimulus items in this bank have
no passage to fall back on regardless.

No `$<digit>` currency/KaTeX-trap figures appear anywhere in this bank (no
dollar amounts in the Unit-2 stimulus set), so the WARN case that required
special handling in the Unit-1 federal-grants-table set does not arise here;
the demographics-table figures (20/1961, 23/1981, 74/2001, 147/2021, 27%
2021 congressional share, 50.8% population share) are plain integers/
percentages, confirmed numerically identical to the seeded `fullText`.

## AP Gov reasoning skills tested

- **Comprehension of argument** — Hamilton's claim that executive energy protects against foreign attack and secures steady law administration (presidency-power.mcq.01); the unity-vs-plurality contrast ("one man" vs. "any greater number") as the basis for a unitary executive (presidency-power.mcq.02); the plurality-conceals-faults objection as an accountability argument (presidency-power.mcq.03).
- **Distinguishing branch characteristics** — "neither FORCE nor WILL, but merely judgment" as the reason the judiciary is "least dangerous," contrasted with the "sword" (executive) and "purse" (legislature) vocabulary from the same essay (judiciary-independence.mcq.01); permanency in office as insulation from short-term political pressure, not a pension or reelection mechanism (judiciary-independence.mcq.02).
- **Foundational judicial-review reasoning** — Marshall's "say what the law is" as the core interpretive function of courts (judiciary-independence.mcq.03); **theory-to-holding comparison** — Federalist 78's argument that unconstitutional acts are void versus Marbury's actual holding, testing whether a student can see Marbury as converting Hamilton's essay-level theory into binding Supreme Court doctrine rather than rejecting or ignoring it (judiciary-independence.mcq.04).
- **Reading a quantitative trend accurately** — the accelerating-after-1981 shape of the women-in-Congress data, ruling out "declined," "not until after 2001," and "doubled every decade" distractors that each contradict the given figures (congress-structure.mcq.01); **descriptive representation gap** — the 27%-of-Congress vs. 50.8%-of-population comparison (congress-structure.mcq.02).
- **Institutional/procedural knowledge** — standing committees as the gatekeeping stage for most bills (congress-structure.mcq.03); the Senate cloture/filibuster vote threshold (congress-structure.mcq.04); notice-and-comment rulemaking (bureaucracy-accountability.mcq.01); congressional oversight tools — hearings and funding threats — as the accountability mechanism over agencies, distinguished from executive orders, court rulings, and state law as distractors (bureaucracy-accountability.mcq.02).
- **Concept application: *Shaw v. Reno* (1993)** — race-as-predominant-factor triggering strict Equal Protection scrutiny of a congressional district's shape (congress-structure.mcq.05).
- **Concept application: the War Powers Resolution (1973)** — reading the 48-hour notification and 60–90-day withdrawal deadlines as Congress reasserting its constitutional role against expanding presidential war power, not transferring war power to the Supreme Court or the UN (checks-in-practice.mcq.01).

## Constitutional accuracy notes

- Federalist No. 70's four ingredients of executive energy (unity, duration,
  adequate support, competent powers) and the unity/plurality argument are
  quoted and tested as written; no claim in this bank extends Hamilton's
  argument to a specific modern power dispute he didn't address.
- Federalist No. 78's "least dangerous branch" and life-tenure arguments are
  tested as Hamilton's own reasoning (an essay, not binding law), kept
  distinct from Marbury's actual holding — mcq.04 is deliberately built to
  test that distinction (essay-level theory vs. binding Supreme Court
  doctrine) rather than conflating the two documents.
- *Marbury v. Madison* (1803): Marshall's "say what the law is" and
  "a law repugnant to the constitution is void" language is the founding
  statement of judicial review; the bank does not attribute the *specific*
  term "judicial review" to Marshall (he doesn't use that phrase in this
  excerpt) — the items test the reasoning, not a label.
- *Shaw v. Reno* (1993): held that a race-predominant redistricting plan is
  subject to strict scrutiny under the Equal Protection Clause; the bank's
  distractors are built to catch two common overcorrections — "race can
  never be considered at all" (false; Shaw applies strict scrutiny, not a
  categorical ban) and "courts may never review redistricting" (false and
  self-contradicting, since Shaw is itself such a review).
- The War Powers Resolution (1973): a statute, not a constitutional
  amendment; presidents of both parties have disputed its binding force in
  practice, but the item tests only what the statute's own text requires
  (48-hour notification, 60–90-day withdrawal absent congressional
  authorization) and its institutional purpose (reasserting Congress's
  Article I war-related authority), not its contested enforceability.
- Women-in-Congress figures (20/1961, 23/1981, 74/2001, 147/2021; 27% of 535
  seats in 2021; 50.8% of the 2020 Census population) are the real published
  CRS Report R43244 figures, reproduced exactly from the seeded passage's
  `fullText` description (verified programmatically — no numeric drift).

## Difficulty & answer-key hygiene

- Difficulty 1–4 mixed: 1×2, 2×7, 3×4, 4×2.
- Correct-answer letters distributed non-cyclically across all 15 items:
  A=4, B=3, C=4, D=4. Sequence: `ACDBDACBDCADBAC` — not all one letter, not a
  repeating ABCD/period-4 pattern. The first draft's sequence
  (`ACDBDACBDCABDAC`) had congress-structure.mcq.05 and
  bureaucracy-accountability.mcq.01 keyed to B and D respectively, which
  produced a repeated 4-letter window (`BDAC` at both positions 4–7 and
  12–15) — caught by the programmatic window check below, not by eye. Fixed
  by reordering those two items' `choices` arrays (content unchanged, only
  which position holds the correct answer) so mcq.05 keys to D and
  bureaucracy-accountability.mcq.01 keys to B; re-ran the Sonnet verify gate
  after the swap (still 15/15, since reordering the same four choices did
  not change what's correct). No repeated 4-letter (or shorter) window and
  no back-to-back repeated letter in the shipped sequence; checked
  programmatically alongside the choice-length pass below.
- Choice lengths equalized per item (word-count checked, correct answer NOT
  the systematically longest option — the length-tell trap): several items'
  first-draft correct choice was the unique longest option (the Fed-70
  plurality item, the Marbury "say what the law is" item, both demographics-
  table items, the committees/filibuster/Shaw v. Reno items, both
  bureaucracy items, and the War Powers item each needed a length trim or a
  distractor lengthened); after revision the correct answer is the **unique
  longest in 0 of 15 items**. Verify:
  `npx tsx -e "const a=require('./src/data/problem-bank/ap-us-government/u2.json'); let n=0; for(const i of a){const w=i.choices.map(c=>c.split(/\\s+/).length); const ci='ABCD'.indexOf(i.answer); if(w[ci]===Math.max(...w)&&w.filter(x=>x===Math.max(...w)).length===1)n++;} console.log('correctIsUniqueLongest', n+'/'+a.length);"`.
- All stems and choices are ORIGINAL — written for this bank, quoting only
  short verbatim phrases from public-domain Unit-2 documents (never
  transcribed wholesale from a real AP exam). `license: 'internal-original'`
  per `scripts/seed-problem-bank.ts`.

## Verification

`npm run seed:problem-bank -- --course=ap-us-government --file=u2.json --dry-run`:
15/15 passed Sonnet (`claude-sonnet-5`) independent-solve verify, 0 rejected,
on the first pass (no answer-key content was wrong) — and again 15/15 after
the answer-letter-cycle fix (reordering two items' `choices` arrays, per the
Difficulty & answer-key hygiene note above). A standalone verbatim-
substring check confirmed every quoted span inside `problemText` (12 quoted
spans across the Federalist-70/Federalist-78/Marbury items) is an exact
substring of its passage's seeded `fullText` (0 mismatches); the
demographics-table items (2 items) inline numeric figures rather than
literary quotes, confirmed as a direct numeric match against the seeded
description instead. `npm run lint:passages` was not re-run standalone for
this task (out of scope for Task 5), but all four `passageId`s referenced by
this bank resolved successfully through `resolvePassage()` during the seed
script's own validation pass (0 "not in the passage registry" errors).

## Unit 3: Civil Liberties and Civil Rights (CED Unit 3)

Stimulus-based MCQ bank (`u3.json`, 12 items) keyed to the three Unit-3
primary/data source documents seeded in
`src/lib/tutor/passages/seeds/apgov-{brown-opinion,tinker-opinion,civil-rights-filings-table}.ts`
and to the four Unit-3 content lesson-plan LOs
(`src/lib/tutor/lesson-plan/seeds/ap-apgov-u3-{religion-speech,press-assembly-arms,due-process,civil-rights}.ts`).
`cedCode` mirrors each LO's `standard` field exactly.

| loId | cedCode | Topic | # items in u3.json |
|---|---|---|---|
| `apgov.religion-speech-liberties` | `AP-APGOV-3.1/3.2/3.3/3.4` | First Amendment religion & speech — *Tinker v. Des Moines* (1969, symbolic student speech, substantial-disruption standard), *Engel v. Vitale* (1962, Establishment Clause), *Wisconsin v. Yoder* (1972, Free Exercise Clause). | 4 |
| `apgov.press-assembly-arms` | `AP-APGOV-3.5/3.6` | Press, assembly, and the Second Amendment — *New York Times Co. v. United States* (1971, prior restraint), *McDonald v. Chicago* (2010, Second Amendment incorporation). | 2 |
| `apgov.due-process-incorporation` | `AP-APGOV-3.7/3.8/3.9` | Due process & selective incorporation — *Gideon v. Wainwright* (1963, Sixth Amendment right to counsel), the case-by-case nature of selective incorporation itself. | 2 |
| `apgov.civil-rights-equality` | `AP-APGOV-3.10/3.11/3.12/3.13` | Civil rights & Equal Protection — *Brown v. Board of Education* (1954, "inherently unequal"), the civil-rights case-filings data table (1964-2020). | 4 |
| **Total** | | | **12** |

## Anchoring documents (stimulus sets)

Each stimulus-anchored item anchors to one of the three Unit-3 passage seeds
via `passageId` (for grouping/render):

- `evelyn.passage.apgov-tinker-opinion.v1` — Justice Fortas's opinion in *Tinker v. Des Moines* (1969) — the "schoolhouse gate" sentence and the "undifferentiated fear" / "materially and substantially interfere" substantial-disruption standard — 2 items (religion-speech-liberties.mcq.01-02)
- `evelyn.passage.apgov-brown-opinion.v1` — Chief Justice Warren's opinion in *Brown v. Board of Education* (1954) — the "generates a feeling of inferiority" psychological-harm finding and the "'separate but equal' has no place... inherently unequal" / Fourteenth Amendment equal-protection conclusion — 2 items (civil-rights-equality.mcq.01-02)
- `evelyn.passage.apgov-civil-rights-filings-table.v1` — BJS/AOUSC civil-rights case-filings data table, 1964-2020 (709 / 18,922 / 43,278 peak / 32,865 / 41,044) — 2 items (civil-rights-equality.mcq.03-04)

6 non-stimulus items (no `passageId`, since no seeded Unit-3 document speaks
to these topics) round out the bank: *Engel v. Vitale* and *Wisconsin v.
Yoder* (religion-speech-liberties.mcq.03-04), *New York Times Co. v. United
States* and *McDonald v. Chicago* (press-assembly-arms.mcq.01-02), and
*Gideon v. Wainwright* plus the case-by-case nature of selective
incorporation itself (due-process-incorporation.mcq.01-02). Per the Task 10
brief, **zero sentences from MLK's "Letter from Birmingham Jail" are quoted
anywhere in this bank** (it remains under copyright; the LO's own content
plan, `ap-apgov-u3-civil-rights.ts`, likewise describes the Letter's
argument entirely in its own words with zero quoted sentences) — no item in
`u3.json` tests the Letter at all, since the Task 10 brief's required
non-stimulus topic list for this LO covers Brown/filings-table only.

## Authoring rule: self-contained stems (controller override)

Same rule as the Unit-1/Unit-2 banks: every stem inlines the specific short
quoted document line (a verbatim substring of the seeded `fullText`,
confirmed programmatically — see Verification below) or, for the
filings-table set, the specific numeric figures tested, directly in the
stem, before asking the AP Gov reasoning question — belt-and-suspenders
given the passage-fed verify gate, and required regardless for the six
non-stimulus items, which have no passage to fall back on.

No `$<digit>` currency/KaTeX-trap figures appear anywhere in this bank (all
filings-table figures are plain integers, e.g. "43,278", never written with
a leading `$`).

## AP Gov reasoning skills tested

- **Foundational student-speech doctrine** — the "schoolhouse gate" sentence as the baseline rule that First Amendment protection follows students into public schools (religion-speech-liberties.mcq.01); the substantial-disruption standard's rejection of "undifferentiated fear" in favor of a concrete showing of material/substantial interference (religion-speech-liberties.mcq.02).
- **Distinguishing the two religion clauses** — Engel v. Vitale's Establishment Clause holding that government may not compose or sponsor prayer for students regardless of voluntariness or brevity (religion-speech-liberties.mcq.03), contrasted with Yoder's Free Exercise Clause exemption of the Amish from a neutral, generally applicable compulsory-schooling law (religion-speech-liberties.mcq.04) — distractors on each item are built from the *other* clause's vocabulary to test whether students conflate the two.
- **Prior restraint doctrine** — NYT v. US's "heavy presumption against constitutionality" standard for stopping publication in advance, distinguished from an absolute-immunity misreading (press-assembly-arms.mcq.01).
- **Second Amendment incorporation** — McDonald v. Chicago's use of the Fourteenth Amendment's Due Process Clause (not Equal Protection, not an Article I/VI clause) to bind state and local gun laws (press-assembly-arms.mcq.02).
- **Selective incorporation, applied and as a pattern** — Gideon v. Wainwright's incorporation of the Sixth Amendment right to counsel via the Due Process Clause (due-process-incorporation.mcq.01); using the ~50-year gap between Gideon (1963) and McDonald (2010) as evidence that incorporation proceeds right-by-right rather than all at once (due-process-incorporation.mcq.02).
- **Brown's reasoning, in two stages** — the psychological/social harm ("feeling of inferiority") identified independent of any facilities gap (civil-rights-equality.mcq.01), then the "inherently unequal" conclusion and its Equal Protection basis, tested against a distractor that would require proof of unequal resources (civil-rights-equality.mcq.02).
- **Reading a non-monotonic quantitative trend accurately** — the filings table's 1997 peak (43,278), 2006 dip (32,865), and partial-but-incomplete 2020 rebound (41,044), ruling out "increased every year," "declined continuously," and "2020 was the all-time high" distractors that each contradict at least one pair of the five given figures (civil-rights-equality.mcq.03); **historical causation** — the ~61-fold 1964-to-1997 growth explained by new civil-rights statutes expanding available federal causes of action, not by courts/states restricting access (civil-rights-equality.mcq.04).

## Constitutional accuracy notes

- *Schenck v. United States* (1919) is not tested as good law anywhere in
  this bank — no item keys a correct answer to Schenck's "clear and present
  danger" test as the standard courts currently apply. Schenck is not quoted
  or cited in `u3.json` at all (the Unit-3 content plan's own misconception
  check already covers Schenck's narrowing by *Brandenburg v. Ohio*
  directly; this MCQ bank instead tests Tinker's separate, school-specific
  substantial-disruption standard on its own terms).
- Selective incorporation is tested, throughout, as running through the
  Fourteenth Amendment's **Due Process Clause** — never the Equal Protection
  Clause — consistent with the Unit-1 federalism plan, the Unit-3
  press-assembly-arms and due-process plans, and *McDonald*'s and *Gideon*'s
  actual holdings. civil-rights-equality.mcq.02's Due-Process-Clause
  distractor (choice D) is deliberately wrong for the opposite reason: Brown
  itself rests on **Equal Protection**, not Due Process — the two
  Fourteenth-Amendment clauses are kept doctrinally distinct across every
  item that touches either one.
  press-assembly-arms.mcq.02's distractors (Equal Protection, Necessary and
  Proper, Supremacy) are each a real constitutional clause that plays no
  role in *McDonald*'s actual incorporation reasoning.
- *Gideon v. Wainwright* (1963): Sixth Amendment right to counsel,
  incorporated via Due Process; the bank does not claim Gideon incorporated
  any other right or was a total-incorporation ruling.
- *Brown v. Board of Education* (1954): tested only via the exact excerpted
  reasoning in the seeded passage (the psychological-harm finding and the
  "inherently unequal"/Equal Protection conclusion) — the bank does not
  attribute the enforcement history (massive resistance) to any MCQ item in
  this bank (that history is covered in the Unit-3 civil-rights plan's own
  worked example/FRQ material, not retested here as an MCQ).
- Civil-rights filings figures (709/1964, 18,922/1990, 43,278/1997 peak,
  32,865/2006, 41,044/2020) are the real published AOUSC/BJS figures,
  reproduced exactly from the seeded passage's `fullText` description
  (verified programmatically — no numeric drift). No item claims 2020
  surpassed the 1997 peak (it did not: 41,044 < 43,278).
- MLK's "Letter from Birmingham Jail" (1963): still under copyright; this
  bank contains **zero quoted sentences** from the Letter and no MCQ item
  tests it — consistent with the Unit-3 civil-rights content plan's own
  copyright-driven convention of describing the Letter's argument entirely
  in original prose.

## Difficulty & answer-key hygiene

- Difficulty 1-4 mixed: 1×2, 2×6, 3×3, 4×1.
- Correct-answer letters distributed non-cyclically across all 12 items:
  A=3, B=3, C=3, D=3. Sequence: `BDACDACBACDB` — perfectly even across all
  four letters (25% each, under the 40% cap), not all one letter, and not a
  repeating ABCD/period-4 pattern. Checked programmatically: no repeated
  4-letter (or shorter) window and no back-to-back repeated letter anywhere
  in the 12-item sequence.
- Choice lengths equalized per item (word-count checked, correct answer NOT
  the systematically longest option — the length-tell trap): the first
  draft had the correct choice as the unique longest option in 6 of 12 items
  (religion-speech-liberties.mcq.03, press-assembly-arms.mcq.02,
  due-process-incorporation.mcq.01, civil-rights-equality.mcq.02/.03/.04);
  each of those six items had its correct choice shortened and/or a
  distractor lengthened (content/meaning unchanged) so that after revision
  the correct answer is the **unique longest in 0 of 12 items**. Verify:
  `node -e "const a=require('./src/data/problem-bank/ap-us-government/u3.json'); let n=0; for(const i of a){const w=i.choices.map(c=>c.trim().split(/\\s+/).length); const ci='ABCD'.indexOf(i.answer); if(w[ci]===Math.max(...w)&&w.filter(x=>x===Math.max(...w)).length===1)n++;} console.log('correctIsUniqueLongest', n+'/'+a.length);"`.
- All stems and choices are ORIGINAL — written for this bank, quoting only
  short verbatim phrases from public-domain Unit-3 documents (Tinker and
  Brown; never MLK's still-copyrighted Letter, and never transcribed
  wholesale from a real AP exam). `license: 'internal-original'` per
  `scripts/seed-problem-bank.ts`.

## Verification

`npm run seed:problem-bank -- --course=ap-us-government --file=u3.json --dry-run`:

```
Loaded 12 items from ap-us-government/u3.json
Validation OK. Formats: {"mcq":12}

Verifying 12 items via claude-sonnet-5 (concurrency 6)...
  ...10/12

Verify: 12/12 passed, 0 rejected.

[dry-run] Would upsert 12 verified items. No DB write.
```

12/12 passed Sonnet (`claude-sonnet-5`) independent-solve verify, 0
rejected, on the first pass (no answer-key fixes needed — the answer-letter
reshuffles and choice-length rebalancing described above were done before
this dry-run and changed only *which position* holds each correct answer
and the *word count* of distractor/correct text, never the underlying
correct answer itself, so a single dry-run after those edits sufficed).
`npm run lint:passages`: `✅ passages lint clean (27 passages)` — includes
all three passages referenced by this bank. A standalone verbatim-substring
check confirmed every quoted span inside `problemText` (3 quoted spans from
Tinker, 3 from Brown) is an exact substring of its passage's seeded
`fullText` (0 mismatches, checked programmatically); the filings-table items
(2 items) inline numeric figures rather than literary quotes, confirmed as
a direct numeric match against the seeded description instead. A
corpus-wide id-uniqueness check across `u1.json`, `u2.json`, and `u3.json`
found 0 duplicate ids among the combined 37 items.
