# Grade 8 ELA fan-out contract — binds every lesson agent

You are authoring lesson plans for a **Grade 8 English Language Arts** course in the Evelyn Learning engine.
**The audience is thirteen- and fourteen-year-olds.** That governs every decision below.

## Working directory
`/Users/luke/Dev/evelynlearning/.claude/worktrees/demo-gate` (git worktree). Work ONLY here. Do NOT touch `/Users/luke/Dev/evelynlearning` itself — unrelated branch, uncommitted work.
Do NOT commit, push, merge, deploy, start a dev server, or seed Mongo. **Do NOT edit `store.ts`** — registration is batched separately by the controller. Writing to it would collide with sibling agents.

## Course shape: 40 rows, 2 pre-written, 38 fan out
The signed-off curriculum (`m8ela-CURRICULUM.md`) has exactly 40 lesson rows across 10 units. The controller hand-writes 2 of them as exemplars (rows 2.2 and 5.3, marked "(exemplar — written)" in the table below); the remaining 38 rows are what fan out to authoring agents, one row per agent. This is not a discrepancy to flag — it is the intended split.

## The template — copy its shape exactly
Read BOTH exemplars in full before writing anything:
- `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8ela-u2-dramatic-irony-suspense-and-humor.ts` (**concept-led** — use for rows that build a way of reading where the student has no procedure to lean on: every Unit 1–4 reading row, plus 7.3 verbal irony and puns and 7.4 shades of meaning by degree and formality — 18 rows counting the exemplar itself)
- `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8ela-u5-active-and-passive-voice.ts` (**procedure-led** — use for rows that make a repeatable move reliable: every Unit 5 and Unit 6 grammar/mechanics row, 7.1 verifying word meaning with context and a dictionary, 7.2 word families from a shared root, and every Unit 8/9/10 writing and research row — 22 rows counting the exemplar itself)

Two rows sit near the line and were sorted deliberately: **4.4 `choosing-the-medium-for-an-idea`** is concept-led even though it ends in a choice, because the lesson is a way of reasoning about what a paragraph, a table, an audio recording and a video each do, not a routine; **6.2 `voice-and-mood-for-effect`** is procedure-led even though its items are judgments about effect, because the move (name the effect wanted, then pick the verb form that produces it) is repeatable and the items are revision-choice MCQs. If your row seems to belong to the other kind, follow the exemplar named for it anyway and say in your report why you think the sort is wrong; do not silently switch templates.

Both files will exist before any agent is dispatched against this contract — they are authored ahead of fan-out specifically so every agent has its own course's register to anchor on. **Do not substitute a different grade's seed as a stand-in if one is somehow missing.** Falling back to a Grade 7 file, or to a Grade 6 one, is exactly the drift these exemplars exist to prevent. If either path is missing when you go to read it, stop and report that the exemplar is absent rather than improvising a substitute.

Writing rows (Units 8, 9, 10) and row 6.2 take the procedure-led exemplar's **shape** and the revision-choice **item pattern** described under "Writing units" below. The shipped Grade 7 files `m7ela-u8-counterclaims.ts`, `m7ela-u8-organizing-an-argument.ts` and `m7ela-u9-transitions-and-cohesion.ts` are the best prior art for what a revision-choice MCQ looks like — read one before writing a Unit 8/9/10 row, and level the register UP a year: a thirteen-year-old can hold a concessive clause and an abstract noun that a twelve-year-old needs unpacked.

### The `SCOPE GUARD` header — copy this convention
Both exemplars open their file-level doc comment with a **`SCOPE GUARD:` paragraph** stating exactly what this lesson covers and what adjacent row or course it deliberately stays out of. Write the same paragraph into your own file's doc comment, naming your row's boundary against its Grade 8 neighbors, against the Grade 7 row it builds on (assumed, never re-taught) and against the HS English row it stops short of, drawn from your row's scope line and the "Content scope" section below. This is not lint-enforced, but it is the mechanism that keeps a reviewer — and the next agent reading your file as salvage — from having to re-derive your row's boundary from scratch.

The shape, using a real Grade 8 row (4.2 `is-the-reasoning-sound`) so you can see all three boundaries named at once:

> SCOPE GUARD: Grade 8 row 4.2 evaluates whether the REASONING in a short argument is sound — whether the reason actually leads to the claim, and whether the evidence proves what is claimed rather than something nearby (a bigger claim, a different group, a different time). DELIBERATELY EXCLUDED: judging whether a piece of evidence is relevant or whether there is enough of it, which is RI.7.8 and is taught end to end by the shipped `m7ela-u4-tracing-an-argument.ts` and assumed here; naming any fallacy — ad hominem, straw man, false dilemma, bandwagon, hasty generalization, slippery slope, false cause — which is HS `engl-u5-logical-fallacies.ts` and must not appear here even as a vocabulary entry; and how an author answers an opposing view inside their own text, which is row 4.1. DELIBERATELY ALLOWED, because row 4.1 and the G7 row sit close: one hint tells the student to confirm that the evidence is on topic before asking whether it proves the claim, because the second question is meaningless without the first — that is a one-line reuse of the G7 skill, not a re-teaching of it; and the word "counterclaim" appears once in a distractor because a rebuttal is one of the places a weak link hides, not because this row teaches rebuttal.

**A scope guard must be TRUE AS WRITTEN of the file it heads.** This is a real defect class, not a style note: on the sibling Grade 6 wave a Math exemplar shipped a guard reading "every quantity in this plan is a proper fraction" while its own body used 6/4, 3/2, 2/1 and "1 and 1/2". The content was fine; the guard was simply false, and **no schema check, lint or type-check can catch that** — a reviewer reading the guard trusts it and stops looking. So:

- State what the lesson **deliberately excludes**, and name the row, the Grade 7 file or the HS file that owns each excluded thing.
- Where a neighboring curriculum row sits close — and in this course almost every row has one, because every unit is a strand that continues a Grade 7 row directly below it and stops short of an HS row directly above it, and units 5–7 sit shoulder to shoulder — also state what **IS deliberately allowed and why**. A guard that only forbids invites a reviewer to read an unavoidable overlap as a violation. Both exemplars carry a `DELIBERATELY ALLOWED` clause for exactly this reason; copy the pattern.
- Never write an absolute ("every excerpt here is fiction", "no grammar term appears in this file", "no sentence in this file is in the passive voice") unless you have checked it against your finished body. Write the narrower true sentence instead.
- Re-read the guard against the finished file, clause by clause, as the last thing you do (checklist item 15).

Both exemplars also carry a **`NOTE FOR FUTURE AUTHORS:`** paragraph stating that every excerpt in the file is original prose written for the item and that the course carries no passage machinery. Carry that paragraph into your file too. It is the standing reminder of the rule that breaks this course most often.

## Identity fields — every file, no exceptions
Every file you write imports `MS_PACING_THRESHOLDS, MS_SOURCE` from `./_ms-shared` and sets
`curriculum: 'MS'`, `grade: '8'`, `subject: 'ela'`, `topic: 'grade-8-ela'`, `locale: 'en'`, `schemaVersion: 1`,
`source: MS_SOURCE`, `pacingThresholds: MS_PACING_THRESHOLDS`, exactly one entry in `los`.

## Naming, derived from your row
- file `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8ela-u<N>-<slug>.ts`
- `id: 'evelyn.ms.m8ela.<slug>.v1'`
- export `SEED_M8ELA_U<N>_<SLUG_UPPER_SNAKE>` (slug uppercased, hyphens→underscores — e.g. slug `active-and-passive-voice` in unit 5 exports `SEED_M8ELA_U5_ACTIVE_AND_PASSIVE_VOICE`; slug `where-two-texts-disagree-fact-or-interpretation` in unit 4 exports `SEED_M8ELA_U4_WHERE_TWO_TEXTS_DISAGREE_FACT_OR_INTERPRETATION`)
- `los[0].id: 'm8ela.<slug>'`, `los[0].standard: 'M8ELA-<u>.<t>'` where `<u>` is the unit number and `<t>` is that row's position in the unit (1–4), e.g. row 5.3 → `M8ELA-5.3`
- `metadata: { cedUnit: '<N>', cedTopic: '<u>.<t>', cedTitle: '<Title>' }` — `cedUnit` is a STRING (`'5'`, not `5`); `cedTopic` is the string `'<u>.<t>'`; `cedTitle` is the row's Title from the table below, byte-identical, punctuation included (`'Is the Reasoning Sound?'` keeps its question mark; `'Where Two Texts Disagree: Fact or Interpretation'` keeps its colon), not its slug

## Segment recipe — the lint enforces this exact sequence
`hook, concept, worked_example, worked_example, try_yourself, try_yourself, try_yourself, misconception_check, recap`

This is verified verbatim by `apps/tutor/scripts/lint-ms-plans.ts` (`npm run lint:ms-plans`), whose `m8ela` row reads `{ subject: 'ela', topic: 'grade-8-ela', loPrefix: 'm8ela', std: 'M8ELA', grade: '8', tryFormat: 'three-mcq' }`. Below is every check that script runs against your plan — passing it on the first try means satisfying all of these, not just the ones that feel important:

- `id` matches `evelyn.ms.m8ela.<slug>.v<N>`; `curriculum: 'MS'`; `grade: '8'`; `subject: 'ela'`; `topic: 'grade-8-ela'`
- `metadata.cedUnit` is a string `1`–`10`; `metadata.cedTopic` is a string matching `<1-10>.<digits>`; `metadata.cedTitle` is a non-empty string
- exactly ONE entry in `los`; `los[0].id` matches `m8ela.<slug>`; if `los[0].standard` is set it must match `M8ELA-<1-10>.<digits>` and must NOT contain the substrings `frq`, `dbq`, `leq`, `saq` (case-insensitive) — neither may `metadata.cedTopic` or `metadata.cedTitle`
- `pacingThresholds` must be equal in value to `MS_PACING_THRESHOLDS` (import it, do not hand-type the object)
- exactly THREE `try_yourself` segments, and **ALL THREE ARE `responseFormat: 'mcq'`.** This is `tryFormat: three-mcq`. **This course has NO numeric items** — the lint rejects any `responseFormat: 'numeric'` segment outright. There is no natural numeric answer space in eighth-grade ELA, and a contrived one ("how many verb moods are there", "how many pieces does a citation carry") tests memorising a list rather than reading. If you find yourself wanting a number typed into a box, you have drifted out of the subject.
- every MCQ `try_yourself` has exactly 4 `choices` with exactly one `correct: true`. Use ids `'a'`–`'d'` in order, as both exemplars do
- no `try_yourself` may carry a `rubric` field — rubrics are FRQ-only and MS plans never use FRQ. There is **no free-response item anywhere in this course**
- exactly ONE `concept` segment, and it must have **4–6 `keyIdeas`** (not 3, not 7)
- a `recap` segment must be present with `mustRemember`
- `schemaVersion` must be `1`
- `estimatedMinutes` (plan-level) must be an integer in **18–22**
- the sum of every segment's own `estimatedMinutes` must be within 1 minute of the plan-level `estimatedMinutes` — every segment (including both `worked_example`s and all three `try_yourself`s) needs its own `estimatedMinutes` set, or the lint flags a missing value before it even checks the sum. Both exemplars use plan 20 and segments 1/6/3/3/2/2/2/1/1 = 21, which is inside the tolerance; copy that budget unless you have a reason not to
- segment `kind` order must be EXACTLY `[hook, concept, worked_example, worked_example, try_yourself, try_yourself, try_yourself, misconception_check, recap]` — no reordering, no dropping, no duplicating
- every `prerequisites`/`followUps` entry must resolve to a real `los[0].id` that exists somewhere in this course's plan set (checked across the whole batch, not per-file) — a slug typo here fails the batch lint even though your own file is otherwise perfect, so copy slugs from the table below character-for-character

The lint does NOT check hint count, but both exemplars set `hints: [ ... ]` with exactly 2 entries, escalating, on every `try_yourself` — the first names the approach, the second gets concrete without handing over the answer. Match that pattern; it is house style, not an accident. The lint also does not check `vocabulary`, but every shipped ELA concept segment carries 4–5 `vocabulary` entries for the terms it introduces. Include them.

## Naming/authoring details the lint does not catch, but a reviewer will
- `expectedAnswer` on an MCQ `try_yourself` must be **byte-identical** to the `text` of the `correct: true` choice. Copy-paste it; do not retype it. A trailing period, a curly apostrophe or a changed dash makes the plan mark a correct student wrong
- `misconception_check.commonErrors` needs 1–2 entries, each naming the wrong answer, the misconception behind it, and the full correction. Never leave a misconception unresolved
- `WRONG: ... CORRECT: ...` labeling in worked-example steps, `keyIdeas` and `recap.mustRemember` wherever an incorrect example is shown. In ELA this is load-bearing in a way it is not in math: a tutor reads these lines ALOUD, and an unlabeled voice shift, a dangling "although" clause, an ellipsis that changes a source's meaning or a citation with the pieces in the wrong order is presented to the student as a model. **Never write a broken example bare.**

## Answer design — two findings carried over from the Grade 7 wave
Both of these are about WHERE the key sits and HOW BIG it is. Neither is lint-enforced, and neither is visible when you read an item the way its author reads it. Together they are the difference between an item that tests reading and an item a student can beat without reading.

### DF-1 — answer-position balance
In the shipped Grade 7 banks, correct answers clustered in particular choice slots. A student who notices that is no longer answering the question. This course has three MCQs per lesson, so it uses the same rule as World Geography, unchanged:

> **For a lesson in unit `u`, topic `t`, the three correct choices sit at indices `(u+t) mod 4`, `(u+t+1) mod 4` and `(u+t+2) mod 4`**, in that order for `try_yourself` one, two and three, indexing the choice ids `a`-`b`-`c`-`d` as `0`-`1`-`2`-`3`.

Worked example, row 3.2 `connections-and-distinctions-among-ideas`: `u = 3`, `t = 2`, so `u + t = 5`. `5 mod 4 = 1`, `6 mod 4 = 2`, `7 mod 4 = 3` — indices 1, 2, 3, so the keys are **b, then c, then d**.

Worked example that wraps, row 7.3 `verbal-irony-and-puns`: `u = 7`, `t = 3`, so `u + t = 10`. `10 mod 4 = 2`, `11 mod 4 = 3`, `12 mod 4 = 0` — indices 2, 3, 0, so the keys are **c, then d, then a**. The third one wraps back to the front; that is correct, not a mistake to round off.

Your row's `u` and `t` are the two halves of your `metadata.cedTopic`. Compute them once, write the three target letters at the top of your scratch notes, and build to them.

**BUILD each item with its key already in the required slot. Never write the item naturally and then permute the choice array to move the key.** The Grade 7 wave learned this the hard way, twice:
- Permuting a written array left **undefined holes in the array** — items that had lost a choice or gained an empty one. Nothing caught it except `tsc`, and only because the shape broke; a permutation that happens to stay well-formed produces a silently wrong item.
- **Any hint that names a choice by letter silently breaks under a reorder.** The shipped `m7ela-u6-fragments-and-run-ons.ts` has the hint "Option a joins two complete sentences with only a comma, option b joins them with nothing, and option d strands an 'Even though' clause" — permute that item's choices and every letter in that sentence becomes a lie, with no error anywhere. Prefer hints that refer to choices by their content rather than their letter; if you do name letters, you have permanently pinned the order.

So: decide the key's slot from the formula first, write the key into that slot, then write three distractors around it.

### DF-3 — the longest-answer skew, and why this course is the most exposed
In the shipped Grade 7 banks the keyed answer was the longest of the four choices far more often than chance, and the split by subject is stark:

| Prose-heavy | | Numeric | |
|---|---|---|---|
| World History | 80% | Grade 7 Math | 14% |
| Environmental Science | 76% | Geometry | 10% |
| Life Science | 71% | Algebra 1 | 7.5% |
| World Geography | 67% | | |

The mechanism is not carelessness, it is structural: **a correct answer usually needs a qualifying clause to be correct, and prose choices have room to grow while number choices do not.** "4" cannot be padded; "The reader knows the note was never delivered, so every confident line the character speaks lands as suspense" can. In World Geography the skew climbed to **94% at difficulty 4** — the tier meant to separate real understanding was the most gameable tier in the bank.

**Grade 8 ELA is the most prose-heavy course in its wave, so it is the most exposed course in it.** Every one of your three items is prose-on-prose, and at this grade the keys carry more qualification than they did a grade or two down, because the skills are analytic (which change carries the theme; whether the reasoning is sound; which medium serves the purpose) rather than identifications. And unlike DF-1 there is **no mechanical fix** — you cannot permute your way out of a length signal.

The rule:

> **Lengthen the distractors rather than shorten the answer.** Never trim a correct choice to the point where it stops being unambiguously correct — that trades a gameable item for a broken one, which is worse. Give the three wrong choices comparable specificity and length, so that choice length carries no signal at all.

A distractor gets longer the same way the key did: give it its own qualifying clause. In a row 2.1 item asking which change in the excerpt carries the theme, "The move." is a one-word distractor that is instantly identifiable as *not the answer* by shape alone; "The family's move to the smaller apartment, which happens before the story opens and changes nothing in how the brothers treat each other." is the same error — an event that is in the story but does not turn the theme — at a length that does not give itself away. The named student error is what makes a distractor wrong, and naming it more fully costs nothing.

**Self-check, and it only works if you do it literally.** Cover the stem and the excerpt. Read **only your four choices**, in order, as a stranger would. Then ask: could someone pick the key from these four alone? If the longest one is guessable, the item is leaking. Fix it by growing the other three — **but only where a distractor genuinely has more to say**, and never by cutting the key. A distractor inflated with filler to close a character gap is padding; it degrades the item exactly as trimming the key would, and it is not a fix.

#### Cutting words from a key: forbidden for one motive, required for the other
The "never trim a key" rule is about **motive, not word count**, and the two motives point opposite ways:

- **FORBIDDEN — shortening a key to move a count.** Trimming until the correct answer stops being unambiguously correct trades a gameable item for a broken one, which is worse than the gameability. Never do this.
- **REQUIRED — removing a clause that lets a student pick the key without the knowledge being tested.** A give-away makes the item test something other than its skill. Cutting it makes the item *more* demanding, not less. Do this whenever you find one, and do not let the sentence above stop you: a rule written against one motive does not bind a change made for the opposite motive.

**The give-away shape to hunt, because vocabulary rows breed it.** A key ends with a relative clause pointing at the *stimulus* rather than at the *concept* — "…, which is exactly the sense the sentence in the item is using", "…, which is what the notice is describing here". The key has to connect a definition back to a context, and the connection leaks out as a pointer a test-wise student follows without knowing the word. The shape this course will breed, in row 7.1 `verifying-word-meaning-with-context-and-a-dictionary`: an item prints a short dictionary entry for "temper" and a sentence about a blacksmith, and a key reading "To harden a metal by heating and then cooling it, **which is exactly what the blacksmith in the sentence is doing to the blade**." A student can pick that from the pointer alone, without ever using the part of speech or the substitution check the row exists to teach. Cutting the clause leaves a clean sense and a harder item. (The pattern was first caught on the sibling Grade 6 course, in a domain-vocabulary row; it is a vocabulary-row shape, not a grade-specific one.)

**Two tests before you cut, because a stimulus reference is often the skill itself and must stay:**
1. **Does the question ask the student to connect to the stimulus?** In a paragraph-structure row ("what job does Sentence 3 do?"), a reasoning row ("does this evidence prove this claim?"), a medium row ("which presentation serves this purpose?") or a two-text row ("where do these texts disagree?"), naming the passage IS the answer. Leave it.
2. **Do the distractors carry the same shape?** If three of four choices reference the passage, the reference singles nothing out. Leave it.

Cut only when the reference is confined to the key AND the question never asked for it.

### The count is a diagnostic to report, not a score to minimise
**With four choices, the key is the longest one by chance 25% of the time.** That is the floor, and it is not zero. The shipped Grade 7 defect ran **67% to 94%** — that is the signal DF-3 exists to catch. **The target is "not far above chance", not zero.**

Driving a course to zero is itself a defect: **120 items in which the key is never the longest is exploitable by the inverse strategy — never pick the longest choice.** Trading a guessable-by-length bank for a guessable-by-short-key bank is not progress.

So:

- **Report the count** in your task report: the number of your three items where the key is *strictly* the longest choice. Report it as a measurement, not as a score you are trying to get down.
- **An honest first draft with one key longest out of three has nothing to fix.** That is chance. Only a *pattern* is a defect.
- **Never construct a key to be the longest because it is the key**, and never trim a key to close a gap. Give the distractors the same care you gave the key — that per-item discipline is the part that matters and it is unchanged.
- **Some keys will legitimately be the longest choice**, because a correct answer often needs a qualifying clause to *be* correct. Leave those alone and say so in your report.
- **Three items cannot distinguish chance from bias.** The real measurement is the course-level rate across all 40 files and 120 items, taken at registration, with roughly a quarter the expected landing place.

**This is not academic for this course.** On the sibling Grade 6 ELA fan-out, sixteen lessons in a row each reported 0 of 3 — a uniformity stronger than chance would produce, which meant agents were over-correcting, almost certainly because an earlier draft of that contract named zero as the target. It did so by the controller's own error: two repaired exemplars had measured 0 of 6, and the measurement was propagated as a goal. That correction is why this section reads the way it does. If your honest count is 1 of 3, report 1 of 3.

**Every row measures and reports its count. There is no row type that is exempt, and no row type that may skip the measurement.**

The mechanism does vary by row type, but only in how far a first draft usually sits from parity, never in whether you have to check:

- **Reading and writing rows (Units 1-4, 8-10)** start furthest from parity, because four candidate analyses, rebuttals or citations can differ enormously in length — the sibling Grade 6 course's reading exemplar first drafted at `62/80/115/309` (one file). Expect a large fix.
- **Grammar, mechanics and vocabulary rows (Units 5-7)** usually start closer, because the four choices are often variants of one sentence — but *closer is not clear*. **Measured evidence from the sibling Grade 6 fan-out (one file):** its `intensive-pronouns` row first drafted with **all three keys strictly longest** and had to grow distractors exactly as a prose row would; its final choices ran 88 to 102 characters. A spread that size still carries a signal a student can read. Expect a smaller fix, not no fix. In this course the rows most likely to repeat that pattern are 5.3 and 6.1, where the key is often the one sentence that carries an extra "by" phrase or an extra helper verb.

**A grammar row whose first draft has all three keys longest is a normal outcome, not a sign that something has gone wrong.** Grow the distractors, re-measure, blind-check, and report the count like every other row.

Your third `try_yourself` is the hardest item in the lesson, which by the Grade 7 pattern makes it the single most exposed item in your file whatever your row type. Check it hardest.

### The exemplars will be measured against both rules — not asserted to comply
Both Grade 8 exemplars are built to DF-1 and DF-3 from the first draft, and they will be **re-measured at review rather than eyeballed**, in exactly the form below. The numbers are not filled in here because they do not exist yet; when they do, they are a diagnostic to report, never a target for the other 38 rows:

| | DF-1 (key in the required slot) | DF-3 (key strictly longest) |
|---|---|---|
| `m8ela-u2-dramatic-irony-suspense-and-humor` (u=2, t=2 -> a, b, c) | measured at review | measured at review |
| `m8ela-u5-active-and-passive-voice` (u=5, t=3 -> a, b, c) | measured at review | measured at review |
| **total** | must be 6 of 6 (DF-1 is a target) | reported, not targeted (DF-3 is a diagnostic) |

(Note that both exemplars land on the same three letters, `a, b, c`, because `2+2` and `5+3` are both `0 mod 4`. That is the formula, not a pattern to copy — your row's letters come from your own `cedTopic`. And whatever the DF-3 column comes to, **do not read it as the number your row should reach**: chance alone puts roughly one item in four at longest-key, and a course of 120 items measuring zero would be gameable in the opposite direction. See "The count is a diagnostic" above.)

Two things learned on the sibling Grade 6 exemplar pass are worth stealing, because the mechanism is the same at every grade:

- **The fix was always to grow a distractor, never to trim the key.** On that pass every `expectedAnswer` stayed byte-identical to text written before the rules existed; the reading exemplar's summary item went from a 309-character key beside 62/80/115-character distractors to four choices of comparable length, by writing the three wrong summaries out at full length instead of leaving them as stubs.
- **Growing a distractor is the edit most likely to break an item, so blind-check every one you touch.** On that same pass, one grown distractor quietly became *defensible*: a clause added for length turned out to be supported by a detail in the story, and the distractor had to be replaced with an overgeneralization the story actually cut against. A distractor grown purely to close a character gap was also found and removed as padding; the count did not move, because the honest distractors were already long enough. **The DF-3 edit and the blind-answer check are a pair — never do the first without redoing the second.** If removing your filler changes your count, the filler was doing the work and the count was never real.

That Grade 6 evidence rests on two exemplar files plus one fan-out row, and it does not license any row to skip the measurement. **Whatever your row type: measure, fix by growing distractors, blind-check what you grew, report the count.**

## NO PASSAGE MACHINERY — the rule that governs this course
This is the section ELA has that no other subject in the wave needs. Read it twice.

- **`passageId` is FORBIDDEN**, and so is `passageIds`. The type allows those fields; this course does not. There are no shared texts and no passage store.
- **Every excerpt is ORIGINAL prose that YOU write for that item**, printed inline inside the `problem` / `script` / `steps` string. Follow the shipped format: a lead-in sentence, then `\n\n`, then the excerpt inside straight double quotes. Typical length is **2–5 sentences** for a narrative or informational excerpt — long enough that the answer is decidable, short enough to hold in the head of a listening thirteen-year-old. Never more than about six sentences. Where an item carries TWO texts (rows 1.4 and 4.3) each text is **1–3 sentences or lines**, so the pair stays inside the same budget; where an item prints a dictionary entry (7.1), a stated pattern (2.4), a one-line gloss (2.3) or a set of described media (4.4), that apparatus counts against the budget too.
- **SELF-CONTAINED OR IT IS BROKEN.** The student sees only the words your own item prints, in a spoken tutoring session, cold, with nothing else on screen. **Never** write "in the passage above", "in the story you just read", "the excerpt from the last lesson", "see the chart", "look at the diagram", or "in paragraph 3" unless your own item printed and numbered those paragraphs. A question that points at a text the student cannot see is unanswerable, and it is this course's single most common unrecoverable defect. Test every item by covering everything except that item's own strings and asking whether it can still be answered.
- **Where a row needs two texts to compare (1.4, 4.3, and any row that contrasts versions), write BOTH**, inside the same item, clearly labeled — the shipped seeds use `VERSION A:` / `VERSION B:` for two tellings of one moment and `Source A:` / `Source B:` for two accounts; use `TEXT A:` / `TEXT B:` for the two structures of row 1.4. Never compare a printed text against a remembered one.
- **Row 4.4 (`choosing-the-medium-for-an-idea`) carries no media.** Every candidate presentation — the paragraph, the table or diagram, the audio recording, the video — is DESCRIBED in words inside the item ("a two-column table listing each month beside that month's rainfall"; "a ninety-second video of the hands folding the paper, with no narration"). The student reasons about a description, never about an artifact they cannot see. The same holds for row 10.2's search results: a described list, never a screenshot.
- **NEVER quote or closely paraphrase copyrighted work.** No song lyrics, no published poems, no book passages, no sentences from a named contemporary author, no famous opening lines, no dialogue from a film or show. Invent the characters, the towns, the school newsletters, the field guides, the museum placards and the narrators. Where a row needs an informational text, write a short original one.
- **Row 2.4 (`modern-stories-and-traditional-patterns`) quotes no traditional text either** — not a public-domain one, not a retelling. The traditional PATTERN is stated in the item, in the tutor's own words ("in many old stories a hero must pass three trials, each harder than the last"), and the modern excerpt is yours. Patterns are subject matter; texts are not.
- **Row 2.3 (`allusions-and-analogies-in-literature`) glosses every allusion in one line, inside the item** — "a Trojan horse (in the old Greek story, a gift that hid soldiers inside)". The gloss is original prose about a myth, not a quotation from one, and it is mandatory: the item tests the EFFECT of the allusion on the excerpt's meaning and tone, never recall of the reference. An allusion a thirteen-year-old cannot decode from the gloss alone is a trivia item, not a reading item.
- **Public-domain factual content is fine as SUBJECT matter** (how bridges handle heat, what a search engine's sponsored result is, why monarch butterflies migrate). Literary text is not.

### Quoting your own excerpt — the misquote rule
Because you wrote the text, the temptation is to quote it from memory a paragraph later. Do not.

- Whenever a `step`, `hint`, `answer`, `choices[].text`, `misconception_check` field or `recap` line quotes the excerpt, **the quoted words must appear in the excerpt character-for-character**. Same tense, same words, same order, same punctuation. Copy-paste from the excerpt into the quotation; never retype.
- Before you finish, re-read every quotation mark in your file and find its source in your own excerpt. A step that says the character "walked ahead of me the whole way home" when the excerpt says "walked ahead the whole way" teaches the student that approximate quotation is acceptable. **Accurate quotation is one of the things this course exists to teach** — rows 1.1, 6.4 and 10.3 are built on it — and an inaccurate one inside the lesson itself is worse than a missing one.
- **Row 6.4 (`ellipsis-for-a-pause-or-an-omission`) is where this rule meets its own subject.** An omission item prints the full source sentence and the shortened quotation; the words that survive the ellipsis must appear in the source in the same order, and the "dishonest omission" distractor must be dishonest because of what it drops, not because it misquotes what it keeps. The same discipline binds row 10.3's blended quotations.
- Do not attribute a detail to the excerpt that the excerpt does not contain. If a hint needs a fact, put the fact in the excerpt first.
- **Do not invent precise statistics about the real world.** An informational excerpt may say "most students" or "more than half the class", never "83 percent of students". A fabricated number is a fact a fourteen-year-old will remember and repeat. (Rows 4.3 and 8.2 need figures by design — a checkable factual disagreement, a rebuttal that leans on a number — and the claim ledger below says exactly how a figure is allowed in: as a STIPULATED specific attributed to an INVENTED source, never to a real one.)

## Claim ledger — required for rows with INFORMATIONAL passages
**Who this binds:** every row whose excerpts are nonfiction the agent invents — all of Unit 3 and all of Unit 4, plus any other row (a Unit 7 vocabulary row, a Unit 8-10 writing or research row, row 6.4's source quotation) whose item needs a factual passage rather than a story. **Fiction rows do not need a ledger and must not pad one**: an invented story is true by construction, so there is nothing to verify. Row 2.3's allusion glosses and row 2.4's stated patterns are the one fiction-row exception: a gloss of a myth ("in the old Greek story, a gift that hid soldiers inside") is a claim about what the traditional story says, a reader could look it up, and it goes in a ledger as REAL-WORLD.

Informational rows carry a failure mode the fiction rows simply do not have: **a plausible-sounding factual claim that is not true.** It is invisible to `tsc`, invisible to `lint-ms-plans`, and invisible to any reader who is not a specialist in that particular subject — and unlike a misquote, there is no internal evidence in the file that could reveal it. This is the same exposure the Science and Geography courses built claim ledgers for, and ELA has it wherever the passage is nonfiction.

**The ledger covers the WHOLE FILE, not just the passages.** Every claim embedded in a **distractor, a hint, or a misconception correction** goes in it too. This is the gap that matters most and the one everybody misses: a wrong answer is read by every student who considers it, exactly as often as the key is, and **a plausible false fact in a distractor is still a false fact a fourteen-year-old carries away** — with no correction attached, because the item never explains why that choice was wrong about the world. The case to expect in row 3.1 `how-a-central-idea-develops`: the excerpt explains why long steel bridges have expansion joints, the item asks which sentence EXTENDS the central idea, and a distractor written to be off-topic asserts that steel shrinks in summer heat, which is why the joints are needed. Nothing in the passage says it, and it is backwards — steel expands when heated. The distractor's job was to be off-topic, which it can do with facts that are true (bridge decks are often concrete poured over steel; the joints are the ridged strips a car bumps over), so it is rewritten with those. **A distractor has to be wrong about the SKILL, never about the WORLD.**

At the end of your file's doc comment, add a `CLAIM LEDGER:` block with **four columns**: the claim, where it appears, its **kind**, and why you are confident it is true.

```
 * CLAIM LEDGER (informational passages):
 *   Claim                                  | Where             | Kind        | Grounds
 *   Steel expands when heated, which is    | concept keyIdea 2 | REAL-WORLD  | Thermal expansion of
 *   why long bridges have expansion joints |                   |             | metals; long-settled.
 *   Monarch butterflies migrate thousands  | try-1 passage     | REAL-WORLD  | Long-documented annual
 *   of miles each fall                     |                   |             | migration to central
 *                                          |                   |             | Mexico; checked.
 *   The Millbrook town survey found that   | try-3 passage     | STIPULATED  | Invented for this item,
 *   most families used the pool at least   |                   |             | attributed to an invented
 *   once, and Text B says fewer than half  |                   |             | town. Internally
 *                                          |                   |             | consistent: the two
 *                                          |                   |             | figures conflict and the
 *                                          |                   |             | stem asks which kind of
 *                                          |                   |             | disagreement that is.
```

### Mark every row REAL-WORLD or STIPULATED
An informational passage you invent contains two different kinds of sentence, and they are checked in completely different ways:

- **REAL-WORLD** — a claim about the actual world, which a reader could look up. Thermal expansion, monarch migration, what a sponsored search result is, what a works-cited entry for a book contains, what the Trojan horse was. **It has to be TRUE.**
- **STIPULATED** — a specific invented for the item, true by authorial fiat. A fictional town's name, its pool-attendance figures, what an invented survey found, a detail in a made-up field-guide entry, the wording of an invented source a rebuttal quotes. **It only has to be CONSISTENT within its own passage** — the number in the stem must match the number in the choices, and nothing elsewhere in the item may contradict it.

**Ledger both kinds. Mark each row.** Keep the stipulated ones in — an invented specific can still be internally inconsistent, or so implausible that it distracts a student — but a reviewer spot-verifying your file has to be able to sort at a glance which rows are checkable against the world and which are true by construction. A ledger that mixes them dilutes exactly the attention it exists to focus, and it is a long ledger of plausible-looking rows that gets skimmed.

**Why the mark carries real weight: mislabelling a REAL-WORLD claim as STIPULATED is how a false fact escapes checking.** The reviewer skips the row because it is marked as invented, and the false claim ships. So the test is not "did I make this up?" — it is **"would a student reasonably take this as a fact about the world?"** If yes, it is REAL-WORLD and it must be true, however incidental it felt when you wrote it. A sentence in an invented newsletter saying that recycling aluminum saves most of the energy of making it new is a REAL-WORLD claim sitting inside a STIPULATED setting; the town is invented, the metallurgy is not.

**A STIPULATED figure must be attributed to a STIPULATED source, and the item must make that obvious.** Rows 4.3 and 8.2 exist to test a student against numbers — a factual disagreement, a rebuttal's figure — and this is the rule that lets them: an invented figure belongs to an invented town, an invented survey, an invented newsletter with an invented name. **Never hang an invented figure on a real institution.** "According to the National Weather Service, the town got more than half its rain in June" turns a stipulated detail into a fabricated REAL-WORLD claim carrying a real name, and a student will repeat it with that name attached. If the row needs a source that sounds credible, invent one that sounds credible ("the Millbrook Parks Department's annual report") and mark it STIPULATED.

**Passing grounds** are a definition, a long-settled fact, or a source you actually consulted — and for a STIPULATED row, a one-line statement of what makes it internally consistent. **Failing grounds** are "I am fairly sure", "it is widely stated", **"a shipped seed says so"** (the shipped seeds are prior art for register and structure, not a fact-checking authority; inheriting an error from one launders it instead of catching it), and **"it is only a story detail"** — that last is not a valid ground for anything a student would reasonably read as a fact about the world, and it is the exact move the REAL-WORLD/STIPULATED mark exists to make visible.

Row 4.3 `where-two-texts-disagree-fact-or-interpretation` gets a third distinction on top of these, because its whole subject is that two texts can conflict: its ledger must also separate **what is true of the event** from **what each text says about it**, and for every FACT-type disagreement it must say which text is wrong and why the item's wording lets a student tell. Both texts are stipulated (you wrote them), but the event underneath still has to hold together, and a disagreement of INTERPRETATION must rest on a fact both texts get right.

Two rules specific to writing nonfiction for thirteen-year-olds, carried from the sibling Grade 6 fan-out, where an agent got them right unprompted:

- **Hedge a mechanism that is still a live hypothesis; do not assert it.** Write "scientists believe sea turtles use the earth's magnetic field to find the beach where they hatched", not "sea turtles use the earth's magnetic field to…". The homing behavior is observed and settled; the magnetic-imprinting *mechanism* is not, and a lesson that flattens that distinction teaches a fourteen-year-old that a hypothesis is a fact. Put the hedge in the passage itself, not only in the ledger. At this grade the hedge is also *subject matter*: row 4.2 asks whether evidence proves what is claimed rather than something nearby, and a passage that overstates its own mechanism is exactly the weak link the row teaches a student to find.
- **Never invent a precise statistic when a qualitative quantifier carries the sentence.** Write "most", "some", "more than half", "thousands of years" — never "83 percent", never "for exactly 4,000 years". **A fabricated number is the single most damaging thing an informational passage can contain**, because it is the part a student is most likely to remember and repeat, and it is the part they will repeat with the most confidence. This restates the rule under "Quoting your own excerpt" and is deliberately repeated here, because that is where it gets broken. Where the row itself needs a figure (4.3, 8.2), the figure is STIPULATED, attributed to an invented source, and ledgered as such.

**The ledger is read and spot-verified by the ELA review pass. A claim you leave out of the ledger is a claim nobody checks** — the reviewer works from your ledger, so an omission is not a smaller offence than a wrong entry, it is a larger one.

## Correctness — the one unrecoverable defect
**Every answer must be defensible from the words you printed, and from those words alone.** For each MCQ, ask: given this excerpt exactly as written, is the `correct: true` choice the *only* defensible one? If a second choice is arguably right, the item is broken — rewrite the excerpt so the evidence is decisive, or change the question. This is harder in ELA than in any other subject in this wave, and it is where these items fail. Do not settle for "the best of the four"; the other three must each be wrong for a reason you can name in one sentence.

### The blind-answer check — how "only one defensible choice" actually gets enforced
The Grade 8 Math contract can tell an author "recompute every numeric answer by hand", and a reviewer can confirm the arithmetic with a script. **ELA has no equivalent.** "The key is the only defensible choice" is a judgment, and no lint, type-check or script in this repository can confirm it. That does not make it optional — it makes it something that has to be discharged by a procedure rather than by a tool, and the procedure is the same on both sides of the handoff:

**Author-side, immediately after writing each item.** Re-read *only* the excerpt and your four choices. Not the hints, not the `misconception_check`, not the reasoning you had in your head while writing it — those tell you what you meant, and what you meant is not what the student receives. Then answer the item yourself from the passage alone, and confirm the key is the only choice the passage supports. **You know the answer, so what you are testing is not whether you can get it right — it is whether the printed words force it.** If you find yourself supplying a fact, an inference or a definition that is not on the page in order to eliminate a distractor, the student would have to supply it too, and the item is broken. Do this for all three `try_yourself` segments before you finish.

**Reviewer-side, and this is the binding one.** The ELA review pass requires the reviewer to **answer each item from the passage alone, before looking at the key**, and to report every item where a second choice is defensible. The reviewer records their own answer first, then compares. An item where the reviewer's cold answer differs from the key, or where the reviewer can argue a second choice, goes back to the author — the burden sits with the reviewer because that is the only place in this pipeline where it can actually be discharged. Authors should expect this and should write items that survive it; the check is not a formality and it is not a spot check, it runs on every item in the file.

**Every distractor must be a real, nameable student error** — a true detail offered as the STRONGEST evidence when it merely supports, a line of dialogue that reveals a trait but moves nothing, an event in the story that does not turn the theme, dramatic irony called humor when the excerpt builds dread, an allusion's surface image read as its imported meaning, a sentence that gives an example labeled as a limit, an author's concession mistaken for agreement, evidence that proves a nearby claim rather than the one made, an interpretation disagreement sold as a factual one, a gerund called a participle because it ends in -ing, a passive sentence that still names the doer in a "by" phrase labeled active, a wish stated in the indicative, a voice shift that the meaning actually licenses, a dash used where a pair of commas was needed, an ellipsis that drops the "not", a dictionary sense of the wrong part of speech, a word from the wrong polarity slipped into a degree scale, a claim that is only the other side negated, a rebuttal leaning on a misquoted source, a concessive clause that concedes the wrong point, slang left in a formal sentence, a category that is really a single fact, a domain term the reader was never given, a narrator who slips from first to third person, a conclusion that moralizes, a sub-question that wanders off the main one, a search term with the question words left in, a dropped quotation standing as its own sentence, a citation with the pieces in the wrong order. If you cannot say in one sentence which mistake produces a distractor, replace it with one you can.

**Every grammatical, literary and factual claim must be correct.** If you assert a rule, it must hold as stated, including its exceptions. **Do not invent a rule to make an item work** — "the passive voice is always wrong", "a sentence can never end with a preposition" and "every -ing word is a gerund" are not rules, and an item that depends on one is a defect that will be repeated by every student who hears it. If your informational excerpt states something about the real world, it must be true.

### Grammar rows — the G7 vocabulary and the JOB test
Units 5 and 6 sit directly on top of the shipped Grade 7 grammar rows, and the student arrives with that vocabulary installed. Use it; do not rename it.

- **"Starter word", never "subordinator."** `m7ela-u6-phrases-and-clauses.ts` forbids "subordinator" in the MS band by name; the HS `engl-*` seeds use it and this course does not. Likewise "independent clause", "dependent clause", "subject-verb pair", "relative pronoun", and "helper" or "helping verb" for an auxiliary — the words the student already has.
- **The past participle arrives from G7 as "the third shape".** `m7ela-u5-verb-tense-consistency.ts` teaches see/saw/seen as three shapes and says the third "needs a helping verb in front of it". Row 5.3 may introduce the term "past participle" (its own vocabulary entry does), but on first use it must connect that term to the third shape the student already knows, and it must not re-teach the irregular forms.
- **Verbals are named by the JOB test, never by form alone.** A gerund is an -ing form doing a NOUN's job; a participle is an -ing or -ed form doing an ADJECTIVE's job; an infinitive is "to" + verb doing a noun's, adjective's or adverb's job. The question the lesson installs is "what job is this word doing in this sentence?", the same question `m7ela-u5-parts-of-speech.ts` asks of every part of speech. An item that can be answered by spotting "-ing" is testing the wrong thing, and its distractors should include the -ing word doing the other job.
- **"Did the meaning really change?" is the shift test, carried from G7's tense row.** Row 6.1 applies to voice and mood the exact test `m7ela-u5-verb-tense-consistency.ts` applies to tense: a shift is a defect only when nothing in the meaning licensed it. Some shifts are correct, and at least one distractor per item should be a shift the meaning does license, so the student cannot win by hunting for any change at all.

## Register — write for a thirteen- or fourteen-year-old
- Hooks come from a thirteen/fourteen-year-old's world: a group chat that goes wrong, tryouts, a band concert or school play, a science fair, a babysitting or lawn-mowing job, a sibling learning to drive, a streaming series the whole grade is watching, a club fundraiser, a group project with one person who did nothing, the school newspaper. **NEVER** exams, college, careers, or "you will need this later" — and note that high school is next year for this audience, which makes "you will need this in high school" the most tempting version of the banned move. Do not use it.
- Sentences may be longer than they were a grade or two down, and a subordinate clause is fine — a thirteen-year-old can hold one. Still one idea per sentence; the idea may now be abstract ("a concession is not a surrender") **provided the same sentence or the next one anchors it in a concrete case**. Abstraction without an anchor is the register failure at this grade, the way run-on explanation was the failure below it.
- **Do not talk down.** No "super", no exclamation-mark enthusiasm, no explaining a word the audience already has ("a paragraph, which is a group of sentences"), no framing a fourteen-year-old's interests as cute. The tutor speaks to the student as someone who can be trusted with the real reason a rule exists. Both exemplars are calibrated to this; the two shipped Grade 7 seeds named in the curriculum's Grounding line (`m7ela-u2-theme-and-summary.ts`, `m7ela-u6-phrases-and-clauses.ts`) show what one grade up from the middle already sounds like — read them, then go one more notch, not two.
- Straight quotes only — no curly quotes anywhere in the file. Escape apostrophes inside single-quoted TypeScript strings as `\'`, the way both exemplars do.
- **US spelling and US conventions throughout** (practice, realize, color, neighbor, gray, traveled). This is a CCSS-aligned US course. Write currency plainly with a bare dollar sign — `$12`, `$4.50` — and never escape it as `\$`. The escaping rule belongs to study guides, not to lesson seeds; every shipped production seed writes currency plainly and it renders correctly.
- **Use ASCII hyphen-minus (U+002D, the `-` key on a keyboard) wherever a hyphen or minus belongs — prose included. Never the Unicode minus sign U+2212 ("−").** Some shipped Grade 7 seeds mix U+2212 into prose; do not copy that habit from salvage material. **This rule is inherited from the Math contracts but its reason is NOT.** There, the harm is that a U+2212 reaching a numeric `expectedAnswer` is a value no student can type on a keyboard. **That mechanism does not exist in this course, because this course has no numeric answers at all** — so do not carry that justification across, and do not conclude from its irrelevance that the rule is decorative here. The live mechanism in ELA is a broken string match: a dash that differs by one code point between a `choices[].text` and its `expectedAnswer` silently marks correct students wrong, and hyphens appear all over this course's own vocabulary (-ing form, third-person, works-cited, sub-question, contrary-to-fact, re-reading).
  - **This rule is about the MINUS SIGN AND THE HYPHEN ONLY.** The em dash (—, U+2014) is correct, expected, and used throughout every shipped production seed and both exemplars — and in this course it is also SUBJECT MATTER: row 6.3 `dashes-and-commas-for-a-break` teaches the single dash, and every dash it prints is an em dash, never two hyphens. So are `×` (U+00D7) and `÷` (U+00F7) in the courses that need them, and the ellipsis row 6.4 prints as three ASCII periods `...` (which is what the shipped seeds use), never the single-character ellipsis U+2026. **Do not "fix", strip or ASCII-ify the em dash.** When you sweep the file before finishing, hunt **U+2212 specifically** — never run a general "remove non-ASCII characters" pass, which would flatten every shipped seed's deliberate typography and, in row 6.3, delete the thing the lesson teaches.
- **No contractions in the tutor's own voice.** Write "does not", "cannot", "it is". **The ban follows the VOICE, not the field.** Wherever the tutor is the one speaking, there are no contractions — `script`, `goal`, `keyIdeas`, `vocabulary` definitions, `steps`, `answer`, the framing sentences of a `problem`, **every `hints` entry**, every `misconception_check` field (`question`, `misconception`, `correctsTo`) and `recap.mustRemember`. Explanations and hints are the tutor talking, so a contraction there is a violation no matter how natural it reads.

  Exactly two categories are exempt, and they are exempt *as categories*, not as whitelisted fields. Both are cases where the contraction belongs to someone or something other than the tutor, and in both the contracted words sit inside quotation marks so that a tutor reading the line aloud is audibly quoting rather than speaking.
  - **Exempt category 1 — reported speech.** Words a character in your excerpt actually says, inside quotation marks. A fourteen-year-old does not say "I am not nervous", and forcing the expansion makes narrative dialogue read like a translation. The exemption covers the words inside the quotation marks and nothing else; the narration around them stays contraction-free. Rows 1.2, 2.2, 6.4 and 7.3 are dialogue-heavy by design and lean on this exemption; that is fine.
  - **Exempt category 2 — a cited specimen.** A contraction printed as the thing being examined, corrected or classified. Row 8.4 (`formal-style-in-argument`, W.8.1d) cannot be written otherwise: a lesson that must teach a student to replace a contraction in explanatory prose has to be able to print the contraction. So must row 5.4's imperative specimens ("Don't touch that") and row 6.2's conditional ones. Naming a contraction is not writing in one. Requirements: **always inside quotation marks**, without exception — that is what makes a tutor reading the line aloud audibly quote rather than speak. **Additionally, when the specimen is being shown as an ERROR, it must sit inside a `WRONG:` / `CORRECT:` pair**, so the wrong form is never presented as a model. That second requirement is about displaying errors, not about contractions as such: a specimen cited as a *correct* form needs the quotation marks only. `WRONG: "The survey doesn't back that up." CORRECT: "The survey does not support that claim."` needs the pair, because row 8.4 is showing the contraction as the informal form to replace; `An imperative can be as short as "Don't."` does not, because nothing wrong is being displayed. Do not bolt a `WRONG:` label onto a true statement to satisfy a rule. Inside an MCQ `choices[].text` the item asks the student to reject, the wrong form stands unlabeled — that is exactly what the item is for — but the `hints` and the `misconception_check` must then name it explicitly. A cited specimen inside a hint is still a cited specimen and is allowed; a contraction in the hint's own explaining sentence is not.

  The test when you are unsure: **who is talking?** If the answer is the tutor, expand it. If the answer is a character, or if the contraction is the specimen under the microscope, quote it and leave it.
- **`misconception_check` names the error, then corrects it in full** — including why the student made it, because the reason is usually that the wrong answer sounded right.

## Writing units 8, 9 and 10 — how to teach writing with no free response
There are **no essay items in this course.** Writing and research skills are taught the way the shipped Grade 7 course teaches them: through **revision-choice MCQs**. The stem shows a claim, a rebuttal, a concessive clause, a sentence in need of formal style, an outline, a vague sentence, a narrative opening, a narrative conclusion, a research sub-question, a search string, a blended quotation or a works-cited entry, and the four choices are candidate versions — one clearly best, three carrying named errors (a claim that is only the opposing claim negated, a claim whose "although" clause concedes a weak point instead of the strongest one, a rebuttal that rounds the source's figure up, a rebuttal that cites a source the item has flagged as unreliable, a "while it is true that" clause that concedes the writer's own point, slang or a contraction left in explanatory prose, a category that contains only one fact, a heading placed where no reader needs one, a precise term the reader was never given, a narrator who slips from "I" to "she", a time shift with no transition to mark it, a conclusion that stops dead or that moralizes, a sub-question that answers a different main question, a search string that keeps "why does" and drops the key noun, a quotation dropped in as its own sentence, a citation with the date before the title).

The two `worked_example` segments in a writing row show the move being made and then a weak version being repaired, with `WRONG:` / `CORRECT:` on the repair — exactly as the procedure-led exemplar does for grammar.

**Row 6.2 (`voice-and-mood-for-effect`) uses this same item pattern** even though it lives in Unit 6: the stem states the effect wanted (emphasize the actor; hide an unknown doer; mark a wish as contrary to fact), and the four choices are candidate sentences. Its "best" choice is best FOR THE STATED EFFECT, and the stem must state the effect in so many words — an item that leaves the effect implicit has two defensible answers.

**What Unit 8, 9 and 10 rows must NOT re-teach**, because the G7 rows own it and the student arrives with it: what makes a claim debatable (`m7ela-u8-claims-and-reasons.ts`); the counterclaim/rebuttal two-move and the negative-restatement fake (`m7ela-u8-counterclaims.ts`); the five evidence types (`m7ela-u8-evidence-and-elaboration.ts`); paragraph order and the conclusion that says what follows (`m7ela-u8-organizing-an-argument.ts`); the focus statement and paragraph-level grouping (`m7ela-u9-informative-thesis-and-structure.ts`); the seven transition families (`m7ela-u9-transitions-and-cohesion.ts`); dialogue, pacing and sensory description (`m7ela-u9-narrative-technique.ts`); the four credibility questions (`m7ela-u10-evaluating-sources.ts`); quote vs. paraphrase vs. summarize (`m7ela-u10-quoting-paraphrasing-summarizing.ts`); what needs a citation and what plagiarism is (`m7ela-u10-citing-sources.ts`). A Grade 8 writing row may use any of those in a hint as a one-line reminder; it may not spend a keyIdea on them.

## No problem-bank items — that is scripted, not authored
Do not write, edit, or propose problem-bank items. Bank items for this wave are SCRIPTED via `generate-bank-items.ts`, not agent-authored. Your only deliverable is the one seed file for your row; the `Bank dir` / `Portal key` / `Bank item ids` / `difficulty spread` fields in `m8ela-CURRICULUM.md`'s header are for that separate scripted step and are not your concern.

## Content scope — stay inside your row, and stay inside Grade 8
An authoring agent must not bleed into an adjacent topic's scope — neither sideways into a neighboring Grade 8 row (do not start judging whether evidence is sufficient while writing the reasoning row, do not teach infinitives while writing gerunds and participles, do not teach the rebuttal while writing the distinguishing claim) nor DOWN into the Grade 7 row your row builds on nor UP into the HS English row it stops short of. The signed-off curriculum (`m8ela-CURRICULUM.md`) has an explicit "Explicitly excluded" section — **that section is the authoritative boundary in both directions.** Read it before writing your row.

**The exclusion shape is vertical along a cumulative strand.** The ten units of this course are the same ten strands as Grade 6 and Grade 7, and a student moves up one strand at a time. So every row has a floor and a ceiling: the Grade 7 row it BUILDS ON (assumed, never re-taught — a keyIdea that re-teaches it is a defect, a one-line hint that reminds the student of it is fine) and the HS English `engl-*` row it STOPS SHORT OF (never previewed, not even as a vocabulary entry). Your row's scope line in the curriculum names both by file. Encode both in your `SCOPE GUARD`. In particular, unless your row's own scope line says otherwise:

**Strand 1 — Reading literature: evidence, character & structure (Unit 1)**
- Below (G7, assumed): explicit-vs-inferred evidence and citing exact wording (`m7ela-u1-text-evidence-and-inference.ts`, RL.7.1); the five plot stages, turning-point test, and four conflict types (`m7ela-u1-plot-structure-and-conflict.ts`, RL.7.3); the five indirect-characterization moves and the "words vs. actions" trap (`m7ela-u1-characterization.ts`, RL.7.3); setting as a limit on and revealer of character (`m7ela-u1-setting-and-story-elements.ts`, RL.7.3).
- Above (HS, stop short): inference combined with background knowledge (`engl-u7-inference-and-evidence.ts`, RI.9-10.1); motive inference and direct-vs-indirect as an analytic frame (`engl-u6-characterization.ts`, RL.9-10.3); flashback and foreshadowing as structural choices (`engl-u6-plot-and-conflict.ts`, RL.9-10.5); enjambment, end-stopped lines, sonnet and haiku (`engl-u8-poetic-form-and-structure.ts`, RL.9-10.5).
- Declined at G8: RL.8.7 (a filmed or live production vs. the text) — the course carries no media, and unlike RI.8.7 the standard requires the student to have watched something. No row; do not smuggle it into 1.4 or 4.4.

**Strand 2 — Reading literature: theme, point of view & figurative language (Unit 2)**
- Below (G7): stating a theme as a sentence, the moral-as-command trap, and the objective summary (`m7ela-u2-theme-and-summary.ts`, RL.7.2 — read in full); the four narration types by "whose thoughts" and contrasting two characters' points of view (`m7ela-u2-point-of-view.ts`, RL.7.6); simile, metaphor, personification, hyperbole, idiom (`m7ela-u2-figurative-language.ts`, RL.7.4); tone vs. mood with a precise adjective (`m7ela-u2-tone-mood-and-word-choice.ts`, RL.7.4). **Objective summary is not re-taught anywhere in this course** (curriculum sign-off 6): rows 2.1 and 3.1 take the DEVELOPMENT half of RL.8.2 and RI.8.2 only, and assume a stated theme or central idea.
- Above (HS): motifs and repeated images across a whole text (`engl-u6-theme.ts`, RL.9-10.2); the unreliable narrator (`engl-u6-narrative-point-of-view.ts`, RL.9-10.6); sensory imagery and symbolism (`engl-u8-imagery-and-symbolism.ts`, RL.9-10.4); alliteration, assonance, rhyme, rhythm (`engl-u8-sound-devices.ts`, RL.9-10.4); whole-work study of a source text behind a modern retelling (no MS or HS seed; outside this catalog).
- Sideways: dramatic irony is row 2.2 and verbal irony is row 7.3 — neither row mentions the other's kind except to say it is a different lesson.

**Strand 3 — Reading informational texts: central idea, features & vocabulary (Unit 3)**
- Below (G7): identifying a central idea as a full sentence (`m7ela-u3-central-idea-and-supporting-details.ts`, RI.7.2); the objective summary of nonfiction (`m7ela-u3-summarizing-informational-text.ts`, RI.7.2); what each text feature and graphic contributes (`m7ela-u3-text-features-and-graphics.ts`, RI.7.5/7.7); determining a technical word's meaning (`m7ela-u3-technical-and-domain-vocabulary.ts`, RI.7.4).
- Above (HS): central idea at 9-10 register with inference (`engl-u7-central-idea-and-details.ts`, RI.9-10.2); "why this structure and not another" (`engl-u7-text-structure.ts`, RI.9-10.5/6); paragraph unity as a writing skill (`engl-u9-paragraph-unity-and-support.ts`, W.9-10.2b); register matched to audience (`engl-u4-tone-and-register.ts`, L.9-10.3).

**Strand 4 — Reading informational texts: structure, purpose, argument & comparison (Unit 4)**
- Below (G7): the five whole-text structures from signal words (`m7ela-u4-text-structure.ts`, RI.7.5); purpose and perspective by inclusions, omissions, and loaded words (`m7ela-u4-authors-purpose-and-perspective.ts`, RI.7.6); evidence relevance and sufficiency (`m7ela-u4-tracing-an-argument.ts`, RI.7.8); two accurate texts compared by emphasis and interpretation (`m7ela-u4-comparing-two-texts.ts`, RI.7.9).
- Above (HS): named logical fallacies (`engl-u5-logical-fallacies.ts`, RI.9-10.8) — **row 4.2 names no fallacy**; ethos, pathos, logos (`engl-u5-rhetorical-appeals.ts`, RI.9-10.6/8); lateral reading and corroboration of the source itself (`engl-u10-evaluating-sources.ts`, W.9-10.8/RI.9-10.8).
- Declined at G8: analysis of ACTUAL multimedia under RI.8.7 — row 4.4 reasons about described media only (sign-off 1).

**Strand 5 — Grammar & usage (Unit 5)**
- Below (G7): parts of speech by job (`m7ela-u5-parts-of-speech.ts`, L.7.1a); subject-verb agreement through interrupters, compounds, indefinites, collectives, inversion (`m7ela-u5-subject-verb-agreement.ts`, L.7.1); pronoun-antecedent agreement and ambiguous/missing reference repair (`m7ela-u5-pronouns-and-antecedents.ts`, L.7.1); tense choice, tense consistency, irregular past and past participle (`m7ela-u5-verb-tense-consistency.ts`, L.7.1/L.7.3a).
- Above (HS): perfect tenses and signal-word-licensed shifts (`engl-u1-verb-tense-and-form.ts`, L.9-10.1); who/whom and pronoun case at HS register (`engl-u1-pronoun-agreement-clarity.ts`, L.9-10.1); misplaced and dangling modifiers, parallel form across infinitives and -ing forms (`engl-u2-modifiers-and-parallelism.ts`, L.9-10.1b) — **rows 5.1 and 5.2 identify verbals and never mention a dangling participle**.
- Sideways: 5.1 is the -ing lookalike pair, 5.2 is infinitives and whole verbal phrases; 5.3 identifies and converts voice, 5.4 identifies mood; neither 5.3 nor 5.4 chooses between forms for effect (6.2) or repairs a shift (6.1).

**Strand 6 — Sentence structure & punctuation (Unit 6)**
- Below (G7): phrase vs. clause by the subject-verb test, independent vs. dependent by the starter word (`m7ela-u6-phrases-and-clauses.ts`, L.7.1a — read in full); the four sentence types by clause count and combining with the joining word that carries the meaning (`m7ela-u6-sentence-types-and-combining.ts`, L.7.1b); fragments, run-ons, comma splices and the three legal joins (`m7ela-u6-fragments-and-run-ons.ts`, L.7.1c); the five comma jobs, end marks, apostrophes (`m7ela-u6-commas-and-end-punctuation.ts`, L.7.2/L.7.2a). Grade 6's paired commas/parentheses/dashes for extra information (`m6ela-u6-commas-for-nonrestrictive-and-parenthetical-elements.ts`, L.6.2a) is also assumed — **row 6.3 teaches the SINGLE dash for a break and the pause comma, and does not re-teach the pair**.
- Above (HS): matched pairs of dashes or parentheses never mixed, and quotation-mark punctuation (`engl-u3-dashes-parentheses-quotation.ts`, L.9-10.2b); semicolons with conjunctive adverbs and colons after a complete clause (`engl-u3-semicolons-and-colons.ts`, L.9-10.2a); apostrophes and possessives at HS register (`engl-u3-apostrophes-and-possessives.ts`, L.9-10.2c); precision and concision revision (`engl-u4-precision-and-concision.ts`, L.9-10.3).
- Declined at G8: L.8.2c (spell correctly) — no Grade 6 or Grade 7 row gives spelling a lesson either; the spelling half of confusables lives in G7's `m7ela-u7-commonly-confused-words.ts`. No row.

**Strand 7 — Vocabulary in context & word study (Unit 7)**
- Below (G7): the four context-clue types and substitution check (`m7ela-u7-context-clues.ts`, L.7.4a); the four-step morphology routine, eight prefixes, nine roots (`m7ela-u7-roots-prefixes-and-suffixes.ts`, L.7.4b); polarity connotation (`m7ela-u7-connotation-and-denotation.ts`, L.7.5c); its/it's, your/you're, there/their/they're, whose/who's, then/than, affect/effect (`m7ela-u7-commonly-confused-words.ts`, L.7.4). Grade 6's word relationships and analogies (`m6ela-u7-word-relationships-and-analogies.ts`, L.6.5b) are assumed, so L.8.5b gets no row.
- Above (HS): the HS confusable set — accept/except, lose/loose, fewer/less, allusion/illusion (`engl-u4-commonly-confused-words.ts`, L.9-10.1/2); near-synonym choice for an intended effect at HS register (`engl-u4-connotation-and-denotation.ts`, L.9-10.5b); register for a named audience (`engl-u4-tone-and-register.ts`, L.9-10.3).
- Sideways: 7.4 sorts words WITHIN one polarity by degree and formality; sorting by polarity is G7's and must not reappear as a keyIdea.

**Strand 8 — Argument writing (Unit 8)**
- Below (G7): the debatable one-sentence claim and two or three distinct reasons (`m7ela-u8-claims-and-reasons.ts`, W.7.1a); five evidence types plus the elaboration sentence (`m7ela-u8-evidence-and-elaboration.ts`, W.7.1b); the counterclaim/rebuttal two-move, the negative-restatement fake, and the two legal rebuttal moves by reasoning (`m7ela-u8-counterclaims.ts`, W.7.1a); paragraph order, counterclaim placement, and the conclusion that says what follows (`m7ela-u8-organizing-an-argument.ts`, W.7.1c/e). **W.8.1e (the concluding statement) gets no Grade 8 row**; Grade 6 (`m6ela-u8-writing-a-concluding-statement.ts`, W.6.1e) and Grade 7 own it.
- Above (HS): the arguable, specific, provable, previewing thesis (`engl-u9-thesis-statements.ts`, W.9-10.1a); rebuttal by exposing a hidden assumption (`engl-u5-counterargument-and-rebuttal.ts`, W.9-10.1b); claims-evidence-reasoning at HS register (`engl-u5-claims-and-evidence.ts`, W.9-10.1).

**Strand 9 — Informative & narrative writing (Unit 9)**
- Below (G7): focus statement, narrowing, the five structures, paragraph-level grouping (`m7ela-u9-informative-thesis-and-structure.ts`, W.7.2a); paragraph development and cutting the off-topic sentence (`m7ela-u9-paragraph-development.ts`, W.7.2b); the seven transition families and pronoun threads (`m7ela-u9-transitions-and-cohesion.ts`, W.7.2c); dialogue that does a job, pacing, sensory description, precise words (`m7ela-u9-narrative-technique.ts`, W.7.3b/d). **W.8.2c (varied transitions) and W.8.2f (informative conclusion) get no Grade 8 row** (sign-off 5); W.8.2e (formal style) is served by row 8.4, which applies to both modes.
- Above (HS): hook-context-thesis openings and synthesis-significance-call-to-action closings (`engl-u9-introductions-and-conclusions.ts`, W.9-10.2a/f); topic-sentence unity (`engl-u9-paragraph-unity-and-support.ts`, W.9-10.2b); cohesion by repeated key terms (`engl-u9-transitions-and-cohesion.ts`, W.9-10.2c); flashback and foreshadowing as analyzed structure (`engl-u6-plot-and-conflict.ts`, RL.9-10.5) — **row 9.3 signals a time shift with a transition; it does not name or analyze flashback as a device**.

**Strand 10 — Research & citation (Unit 10)**
- Below (G7): topic vs. question, narrowing, open not yes/no, answerable (`m7ela-u10-research-questions.ts`, W.7.7); the four credibility questions, primary vs. secondary, "credible for what" (`m7ela-u10-evaluating-sources.ts`, W.7.8); quote/paraphrase/summarize, the look-away paraphrase, all three get credit (`m7ela-u10-quoting-paraphrasing-summarizing.ts`, W.7.8); what needs a citation, common knowledge, the five pieces, credit in two places, note-taking hygiene (`m7ela-u10-citing-sources.ts`, W.7.8). **The plagiarism-avoidance half of W.8.8 is therefore Grade 7's and gets no Grade 8 row.**
- Above (HS): matching a question to primary/secondary and scholarly/popular sources (`engl-u10-research-questions-and-sources.ts`, W.9-10.7/8); lateral reading (`engl-u10-evaluating-sources.ts`, W.9-10.8); patchwriting as plagiarism (`engl-u10-quoting-paraphrasing-summarizing.ts`, W.9-10.8); the frame-quote-explain structure and the common-knowledge test (`engl-u10-citing-and-integrating-sources.ts`, W.9-10.8).

**Across all strands**
- No Speaking and Listening standards (SL.8). This course has no SL unit, matching the shipped Grade 6 and Grade 7 courses.
- No W.8.4-W.8.6 (production, revision with guidance, technology) and no W.8.10 (range of writing) — process standards with no lesson-sized objective, not covered, as in Grade 6 and Grade 7.
- L.8.6 (general academic and domain-specific vocabulary acquisition) gets no row; it is served incidentally by rows 3.3, 7.1 and 9.2 and must not be cited as a row's standard.

If your row's own scope description in the table below explicitly asks for something on this list (it will not), the table wins — but check that you have not accidentally reached past the row's stated scope into the next course's territory, or dropped back into the Grade 7 row it builds on, which are the two failure modes salvage material introduces (see below).

## Salvage — mine these, never edit or import them
| Source | Notes |
|---|---|
| `m7ela-u*.ts` (40 shipped Grade 7 ELA seeds) | The closest prior art for segment shape, pacing, voice and distractor patterns, and **the floor of every strand**: the curriculum names, per row, the G7 file your row builds on, and that file's content is ASSUMED, never re-taught. The danger runs the opposite way from the Grade 6 course's: a Grade 8 row does not share a slug with any G7 row, so the risk is not copying an escalation down but copying the G7 lesson UP — spending your keyIdeas re-installing the five comma jobs, the four context-clue types or the counterclaim two-move that the student already has. Read the "Content scope" section above before reusing anything; copy structure and phrasing register, **never copy scope, and never copy an excerpt** — write your own. |
| `m6ela-u*.ts` (40 shipped Grade 6 ELA seeds) | Two grades down and two notches younger in register — but they are the most recently written ELA seeds and carry the current doc-comment conventions (`SCOPE GUARD` with a `DELIBERATELY ALLOWED` clause, `NOTE FOR FUTURE AUTHORS`, the four-column `CLAIM LEDGER`). Read one for the conventions; never for register, scope or excerpts. Three are named in the curriculum as assumed ground (`m6ela-u6-commas-for-nonrestrictive-and-parenthetical-elements.ts`, `m6ela-u7-word-relationships-and-analogies.ts`, `m6ela-u8-writing-a-concluding-statement.ts`) — that is content the student has, not content to repeat. |
| `g8-ela-*.ts` (4 legacy pre-`m8ela` files: `citing-evidence`, `theme-analysis`, `thesis-statements`, `tone-mood`) | The adjacent ground for four rows, at roughly the right register, with a per-row warning each. **`g8-ela-citing-evidence.ts`** (rows 1.1, 10.3, 10.4): salvage the "opinion becomes analysis when you quote" hook for 1.1 and the integrate-into-your-own-sentence shapes for 10.3; its MLA page-citation lines are adjacent ground for 10.4's in-text half only. Do NOT carry its MLA half into 1.1 or 10.3, and do NOT carry its two-LO structure anywhere — this course is one LO per plan. **`g8-ela-theme-analysis.ts`** (row 2.1): salvage the "which event turns the theme" idea only. Do NOT carry its topic-vs-theme opener, which `m7ela-u2-theme-and-summary.ts` already teaches in full. **`g8-ela-tone-mood.ts`** (row 2.3): its word-choice-shapes-tone framing is reusable as voice. Do NOT carry its tone-vs-mood distinction lesson, which `m7ela-u2-tone-mood-and-word-choice.ts` already teaches at full depth. **`g8-ela-thesis-statements.ts`** (row 8.1): salvage its three failure modes (too obvious, too vague, just a topic) as distractor patterns. Do NOT carry its GPS-for-an-essay framing as the lesson core — HS `engl-u9-thesis-statements.ts` owns the full thesis lesson; Grade 8's core is the distinguishing "although" clause. **Never edit, import from, or extend them.** They live under a separate legacy `evelyn.g8.*` id space. |
| `g7-ela-counterclaim.ts` (legacy, `evelyn.g7.*`) | Adjacent ground one grade down for row 8.2 only; usable as voice for the counterclaim set-up, never for the lesson core, which is the evidence-backed rebuttal. **Never edit, import from, or extend it.** The other four `g7-ela-*` files and the `g6-ela-*` files are not cited by the curriculum and are not salvage for this course. |
| `engl-u*.ts` (HS English, 40 seeds) | **The ceiling of every strand, and HS register — level it DOWN one band.** The curriculum names, per row, the `engl-*` file your row stops short of; read it to see where your row must END, never to borrow its content. Drop the rhetorical-analysis vocabulary, shorten the longest sentences, re-anchor every example in a thirteen-year-old's world. Their segment recipe differs from ours; copy explanations and distractor patterns, never structure. |
| `dsat-*` / `act-*` grammar seeds | Usable for grammar mechanics only (voice, verbals, dashes), and **strip every trace of test framing.** No timing, no scoring, no "on the test". |

## The full course chain (for prerequisites / followUps)
`prerequisites` = [loId of the PREVIOUS row]; `followUps` = [loId of the NEXT row]. Row 1.1 has `prerequisites: []`; row 10.4 has `followUps: []`. Every other row populates BOTH arrays with the true previous-row and next-row loIds from the table below — always, no exceptions, including across a unit boundary (row 2.1's prerequisite is `m8ela.comparing-the-structure-of-two-texts`). All loIds are `m8ela.<slug>`. Standards below are CCSS Grade 8 codes for the LO `description` sentence (prose only — see below); the `standard` FIELD is always `M8ELA-<u>.<t>`.

**Do not copy the two exemplars' empty `prerequisites: []` / `followUps: []`.** Those are empty only because `lint-ms-plans` rejects a chain reference that does not resolve to an already-registered LO, and the exemplars are registered first and alone, before their neighboring rows exist — that is a lint artifact of registration order, not the pattern to follow. All 40 lessons (the 2 exemplars plus the 38 fan-out rows) are registered together in a single controller commit, and the exemplars' chain fields get wired to their real neighbors at that same time. So write your row's real previous/next loIds from the table now — never worry that a target does not yet exist on disk; it will exist by the time the batch is registered and linted.

| # | Slug | Title | CCSS (prose only) |
|---|---|---|---|
| 1.1 | strongest-textual-evidence | Strongest Textual Evidence | RL.8.1, RI.8.1 |
| 1.2 | how-dialogue-propels-action-and-reveals-character | How Dialogue Propels Action & Reveals Character | RL.8.3 |
| 1.3 | how-an-incident-provokes-a-decision | How an Incident Provokes a Decision | RL.8.3 |
| 1.4 | comparing-the-structure-of-two-texts | Comparing the Structure of Two Texts | RL.8.5 |
| 2.1 | how-a-theme-develops-through-character-and-setting | How a Theme Develops Through Character & Setting | RL.8.2 |
| 2.2 | dramatic-irony-suspense-and-humor | Dramatic Irony, Suspense & Humor | RL.8.6 — **(exemplar — written)** |
| 2.3 | allusions-and-analogies-in-literature | Allusions & Analogies in Literature | RL.8.4 |
| 2.4 | modern-stories-and-traditional-patterns | Modern Stories & Traditional Patterns | RL.8.9 |
| 3.1 | how-a-central-idea-develops | How a Central Idea Develops | RI.8.2 |
| 3.2 | connections-and-distinctions-among-ideas | Connections & Distinctions Among Ideas | RI.8.3 |
| 3.3 | word-choice-and-analogy-in-informational-text | Word Choice & Analogy in Informational Text | RI.8.4 |
| 3.4 | the-role-of-a-sentence-in-a-paragraph | The Role of a Sentence in a Paragraph | RI.8.5 |
| 4.1 | how-an-author-responds-to-opposing-views | How an Author Responds to Opposing Views | RI.8.6 |
| 4.2 | is-the-reasoning-sound | Is the Reasoning Sound? | RI.8.8 |
| 4.3 | where-two-texts-disagree-fact-or-interpretation | Where Two Texts Disagree: Fact or Interpretation | RI.8.9 |
| 4.4 | choosing-the-medium-for-an-idea | Choosing the Medium for an Idea | RI.8.7 |
| 5.1 | gerunds-and-participles | Gerunds & Participles | L.8.1a |
| 5.2 | infinitives-and-verbal-phrases | Infinitives & Verbal Phrases | L.8.1a |
| 5.3 | active-and-passive-voice | Active & Passive Voice | L.8.1b — **(exemplar — written)** |
| 5.4 | verb-moods | Verb Moods | L.8.1c |
| 6.1 | shifts-in-voice-and-mood | Shifts in Voice & Mood | L.8.1d |
| 6.2 | voice-and-mood-for-effect | Voice & Mood for Effect | L.8.3a |
| 6.3 | dashes-and-commas-for-a-break | Dashes & Commas for a Break | L.8.2a |
| 6.4 | ellipsis-for-a-pause-or-an-omission | Ellipsis for a Pause or an Omission | L.8.2a, L.8.2b |
| 7.1 | verifying-word-meaning-with-context-and-a-dictionary | Verifying Word Meaning with Context & a Dictionary | L.8.4c, L.8.4d |
| 7.2 | word-families-from-a-shared-root | Word Families from a Shared Root | L.8.4b |
| 7.3 | verbal-irony-and-puns | Verbal Irony & Puns | L.8.5a |
| 7.4 | shades-of-meaning-degree-and-formality | Shades of Meaning: Degree & Formality | L.8.5c |
| 8.1 | a-claim-that-answers-the-opposing-claim | A Claim That Answers the Opposing Claim | W.8.1a |
| 8.2 | rebutting-with-evidence-from-credible-sources | Rebutting with Evidence from Credible Sources | W.8.1b |
| 8.3 | cohesion-among-claim-counterclaim-and-evidence | Cohesion Among Claim, Counterclaim & Evidence | W.8.1c |
| 8.4 | formal-style-in-argument | Formal Style in Argument | W.8.1d |
| 9.1 | organizing-information-into-broader-categories | Organizing Information into Broader Categories | W.8.2a |
| 9.2 | precise-language-and-domain-vocabulary | Precise Language & Domain Vocabulary | W.8.2d |
| 9.3 | establishing-point-of-view-and-shifting-time-in-a-narrative | Establishing Point of View & Shifting Time in a Narrative | W.8.3a, W.8.3c |
| 9.4 | reflection-and-a-narrative-conclusion | Reflection & a Narrative Conclusion | W.8.3b, W.8.3e |
| 10.1 | generating-related-research-questions | Generating Related Research Questions | W.8.7 |
| 10.2 | using-search-terms-effectively | Using Search Terms Effectively | W.8.8 |
| 10.3 | blending-a-quotation-into-your-own-sentence | Blending a Quotation into Your Own Sentence | W.8.8, W.8.9 |
| 10.4 | following-a-standard-citation-format | Following a Standard Citation Format | W.8.8 |

Note the rows that share a standard with a sibling (1.2/1.3 on RL.8.3, 5.1/5.2 on L.8.1a, 6.3/6.4 on L.8.2a, and 10.2/10.3/10.4 on W.8.8). Those splits are deliberate and are described in the curriculum's Scope column — read your row's scope sentence and your sibling's before you start, so the two lessons cannot teach the same thing twice. Row 1.1 cites two codes (RL.8.1 and RI.8.1) because the ranking skill is the same across fiction and nonfiction; cite both in the description, as the shipped G7 U1.1 did.

**What goes in `los[0].description`, the segment `goal` fields and the `SCOPE GUARD` — CONTROLLER RULING 2026-09-03, uniform across all four Grade 8 contracts.** The LO `description` is STUDENT-FACING: the academy renders it as the lesson's learning objective on public course pages, and it is the text the bank-item generator grounds on. Every Grade 8 scope cell in `m8ela-CURRICULUM.md` has three parts: (i) the **positive statement** of what the student does in this lesson; (ii) the **lineage clause** ("Builds on …", "Deepens …", "Assumes …", "Extends …" naming a `m7*`/`m6*` file and what it taught); (iii) the **withheld clause** ("Withholds: …", "Not yet …", "Stops short of …", "→ `alg1-…`" naming the owning file). `los[0].description` carries part (i) VERBATIM (the only edits while copying: Unicode minus U+2212 → ASCII `-`, curly quotes → straight, and dropping any backticks), followed by the standards citation in parentheses (e.g. `(CCSS RL.8.6)`, `(CCSS L.8.1a)` — see "Real standards go in PROSE only"). Parts (ii) and (iii) NEVER appear in the description or in any spoken field: no file names, no backticks, no "Grade 7", "G7", "Grade 6", "Algebra 1", "HS", "UNVERIFIED", "sign-off" or arrow. Both go into the file's `SCOPE GUARD` doc comment, VERBATIM from the cell, where a reviewer and the next agent reading the file as salvage can see the lineage and the boundary. Where part (i) itself ends in a short "without yet …"/"not yet …" phrase written in plain words (no file name), keep it — the shipped Grade 6 seeds do exactly that. Do not shorten part (i) into the title and do not paraphrase it. Each segment's own `goal` field (on `hook` and `concept`) is a short, segment-specific purpose line you write yourself, anchored to part (i), exactly as both exemplars show. Read the whole scope cell before writing any of the three. **Addendum (2026-09-03, from the exemplar authors):** words in part (i) that describe the AUTHORING or the ITEM rather than the skill are dropped from `los[0].description` while copying — "invented" (as in "for several invented places"), "described" as a qualifier ("a described table" → "a table"), "written out in words", "from choices", "picking the correctly stated result", "assessed as …", and any parenthetical that cites a sign-off or a sibling row. They remain binding on how you WRITE the item. The description a student reads names the skill and the material, not the authoring convention. **Second addendum (same day, from the science and geography exemplar authors):** ALSO drop from the description any parenthetical or clause that refers to the curriculum's own structure — "from 6.4", "(first of three lessons sharing MS-PS2-2, split by law)", "(shares … with Topic 3)", "(the stage-two half of …)", "see sign-off N", "row 6.2" — a student never sees the curriculum table. And convert an em dash inside the description to ` -- ` (the shipped `m6sci`/`m7sci` descriptions all use ` -- `; keep the surrounding words). Cite the standard ONCE, at the end.

## Real standards go in PROSE only
Put the CCSS code (RL.8.6, RI.8.8, L.8.1b, W.8.1a, …) inside the LO `description` sentence, the way both exemplars do. Where a row carries two codes (1.1, 6.4, 7.1, 9.3, 9.4, 10.3), cite both in the prose. The `standard` FIELD is always `M8ELA-<u>.<t>` and must never contain a CCSS code or the substrings `frq|dbq|leq|saq`.

## Every number you state must say what kind of number it is
This contract quotes a lot of numbers at you, and your report will quote some back. **A number with no kind attached is the most dangerous thing in either document**, because the reader supplies the missing kind, and the kind they supply is almost always "target". Label every count as one or the other:

- **A TARGET is a threshold you must meet.** Missing it is a defect to fix. In this contract the targets are exactly the lint-enforced numbers plus DF-1: 4-6 `keyIdeas`, exactly 3 `try_yourself`, exactly 4 choices with exactly 1 correct, plan `estimatedMinutes` 18-22, the segment sum within 1 of it, 2 hints per item as house style, and the DF-1 key slot computed from `(u+t) mod 4`. Hit these.
- **A DIAGNOSTIC is an observation you report so a pattern can be seen across files.** There is no threshold and nothing to optimise. **The DF-3 longest-key count is a diagnostic**, and so is any count you volunteer about your own file. Report it accurately and leave it alone.

**Never let a diagnostic drift into a target.** That drift is not hypothetical: it is how the sibling Grade 6 contract acquired a zero target for DF-3 and steered sixteen agents into over-correcting. A repaired 0-of-6 measurement was reported honestly, read as a goal, and propagated as one — and nobody noticed, because every individual sentence in the chain was true. This contract carries no exemplar measurement at all for exactly that reason; the exemplars are measured at review and the numbers are reported afterwards.

Two habits that catch the drift early, both of which cost a correction to learn on the sibling course:

- **A claim generalised from your own files must say how many files it rests on.** "The grammar exemplar measured 0 of 3" is a measurement. "Therefore grammar rows are safe" is a generalisation from one file, and on the sibling course it was false — a grammar row first-drafted with all three keys longest. Write "this rests on two files" and the reader calibrates correctly on their own.
- **The filler test, which generalises to every measured proxy in this wave:** *if removing your filler changes your count, the filler was doing the work and the count was never real.* Whenever you have edited something specifically to move a number, take the edit out and re-measure. If the number holds, the edit was content and can stay or go on its merits. If the number moves, you were decorating a metric rather than improving a lesson.

This applies to the numbers you put in your own task report as much as to the ones you read here.

## Before you finish
You cannot run the full lint (it selects all MS plans and will report other units' in-flight state). Instead:
1. `cd apps/tutor && npx tsc --noEmit` — must be clean, 0 errors. This catches every type and syntax mistake.
2. Re-read your file aloud, as a thirteen- or fourteen-year-old would hear it. Any sentence you have to read twice to parse is too tangled; any sentence that explains something this audience already knows is talking down. Fix both.
3. **Cover everything except one item's own strings and answer it.** Do that for all three `try_yourself` segments and both `worked_example`s. If an item needs anything you did not print inside it — a second text, a gloss, a stated pattern, a described medium, a dictionary entry, the effect wanted — it is broken.
4. **Find the source of every quotation mark in the file.** Every quoted phrase must appear character-for-character in the excerpt you wrote for that item. Copy-paste, never retype. In rows 6.4 and 10.3, also confirm that every shortened or blended quotation keeps its surviving words in the source's order.
5. Re-check every MCQ: is `expectedAnswer` byte-identical to the `correct: true` choice's `text`? Can you name the student error behind each of the other three? Then **run the blind-answer check** described under "Correctness": re-read only the excerpt and the four choices, answer the item cold, and confirm the printed words force the key. Expect the reviewer to repeat this on every item before looking at your key.
6. Confirm every excerpt is original prose you wrote, that nothing in the file quotes or closely paraphrases a published work, and — for rows 2.3 and 2.4 — that every allusion carries its one-line gloss and every traditional pattern is stated rather than quoted.
7. Confirm segment order, `keyIdeas` count (4–6), three `try_yourself` segments **all `mcq`** with 4 choices and one `correct: true` each, 2 escalating hints on each, and no `rubric` anywhere.
8. Confirm `prerequisites`/`followUps` use the real previous-row/next-row slugs from the table above — not empty arrays.
9. Search your file for curly quotes (`’ ‘ “ ”`), for the Unicode minus (`−`, U+2212) and for the single-character ellipsis (`…`, U+2026) and replace every instance with the straight or ASCII form. These are easy to introduce by copy-pasting from salvage material. **Search for those characters specifically — do NOT run a general non-ASCII sweep. The em dash (—) is correct and must survive untouched; in row 6.3 it is the lesson.**
10. Search your file for contractions. Every one that survives must be either inside quoted character dialogue, inside a `WRONG:`/`CORRECT:` pair as the object of study, or inside an MCQ distractor the item asks the student to reject.
11. Confirm your file's doc comment has a `SCOPE GUARD:` paragraph naming your row's boundary in all three directions — the Grade 8 neighbors, the Grade 7 file below, the HS file above — and a `NOTE FOR FUTURE AUTHORS:` paragraph about original prose.
12. **Check DF-1, answer position.** Compute `(u+t) mod 4`, `(u+t+1) mod 4`, `(u+t+2) mod 4` from your own `cedTopic`, and confirm that `try_yourself` one, two and three carry their `correct: true` choice at exactly those indices (`a`=0 … `d`=3). If an item is in the wrong slot, **rebuild the item around the correct slot — do not permute the choice array**, and re-check any hint that names a choice by letter.
13. **Check DF-3, the longest-answer skew.** Cover the stem and the excerpt, read only the four choices of each item, and ask whether the longest one is guessable. Where it is, lengthen the distractors that genuinely have more to say — never shorten the key, and never pad a distractor with filler to close a gap. Then **state the count in your report** as a measurement: the number of your three items where the key is strictly the longest. **There is no target number, and 0 of 3 is not the goal** — the key is longest by chance a quarter of the time, so 1 of 3 on an honest draft is a normal result with nothing to fix. Check your third item hardest — it is the most exposed one in the file.
14. **If any excerpt in your file is informational, confirm the `CLAIM LEDGER:` block is present and complete** — every claim in every passage, `keyIdeas` entry, worked example, **distractor, hint and misconception correction** listed with where it appears, its **kind**, and its grounds. Then re-read the kind column specifically: **for every row marked STIPULATED, ask whether a student would reasonably take it as a fact about the world.** If they would, it is REAL-WORLD, and it now needs grounds that would pass ("definition", "long-settled", "source consulted") rather than grounds that would fail ("fairly sure", "widely stated", "a shipped seed says so", "it is only a story detail"). Confirm every REAL-WORLD row is true, every STIPULATED row is internally consistent with its own passage and attributed to an invented source rather than a real one, every live-hypothesis mechanism is hedged in the passage itself, and that no precise statistic about the real world has been invented anywhere. If your excerpts are all fiction, state that in one line instead and write no ledger (rows 2.3 and 2.4 still ledger their glosses and patterns).
15. **Re-read your `SCOPE GUARD` against the finished file, clause by clause.** For every "this lesson never …" and every "every … in this file is …", go find the evidence in your own body. If a clause is not true as written, fix the clause or fix the body — do not leave a guard that a reviewer will trust and that quietly is not so. This is the last thing you do, after every other edit.

Do NOT commit. Do NOT edit `store.ts`. The controller registers, commits and runs the gate.

## Addenda — CONTROLLER RULINGS 2026-09-04, from the first Opus fan-out batch

These come from eight agents working rows 2.4-4.3 in parallel. Each was found by an
agent's own checklist, not by a gate. They bind you exactly as the numbered list does.

16. **DF-3 is a BAND, not a floor.** Item 13 tells you 0 of 3 is not the goal. Two
    agents in one batch still drove it there, and both independently reported the same
    consequence: growing *every* distractor to close a keyed-longest gap made the key
    the **shortest** choice in all three items, which is the identical guessable signal
    with its sign flipped. One agent's first pass took its distractors to 325 and 291
    characters against a 246-character key. So: change nothing unless the key is longest
    by a margin a student could actually see (roughly >10%, not the 2-14 characters that
    two of these files were carrying), and after any growth **re-measure and confirm you
    have not simply inverted it**. A margin inside noise is not a defect and does not
    want a fix.

17. **The `SCOPE GUARD` section's worked sample is an ILLUSTRATION, not a template.**
    It happens to use row 4.2. The agent who actually wrote 4.2 found two of the sample's
    "deliberately allowed" clauses false of any correct 4.2 file — it claims "counterclaim"
    appears in a distractor (rebuttal is 4.1/8.2 material, so a correct file need not use
    the word) and reads as though the G7 relevance/sufficiency tests never run in the row,
    when a good 4.2 file runs them on purpose to show them passing while the argument still
    breaks. **Write your guard against your own finished body.** A guard is the one thing in
    the file whose whole value is that it is true as written; a pasted clause is a guard that
    a reviewer will trust and that quietly is not so.

18. **Never assert what the student did in a previous school year.** No "last year you
    learned X", no "last year you found X", no "next year you will". The phrase has ZERO
    precedent in the shipped corpus — a grep across every seed found it only in three files
    from this wave, and the house convention in every other course is **"you already know
    …"**, which is timeless. This is the same defect the audit's grade check exists to stop:
    a student may be taking Grade 8 content off-grade, and the sentence is then simply false
    about them. Referring to an earlier lesson **in this course** ("you learned in the last
    lesson") is fine and is also precedented.

19. **Clarifying item 14 for distractors.** Two agents asked the same question, and the
    answer is: a distractor's *premise* is by construction the student's false belief ("a
    field guide is written to record what an animal does rather than to admire it") and has
    no truth-grounds to record — do not ledger it as a claim. What you DO ledger is any
    **fact about the world a distractor leans on** while being wrong about the skill (that
    "casualty" belongs to the vocabulary of disasters; that melted water refreezes). The
    rule behind item 14 is unchanged and is the reason the distinction matters: a distractor
    may be wrong about the SKILL, never about the WORLD, because a false fact in a wrong
    answer reaches the student with no correction attached.

20. **Clarifying item 4, "character-for-character".** Two agents hit the same wall: a
    quotation whose source punctuation differs at the boundary (the excerpt has a comma or a
    semicolon where your sentence needs a period) cannot satisfy the rule literally, and one
    file's own NOTE asserted a "character-for-character" invariant it did not hold. The rule
    governs **the words and their order and case**, and it is absolute there — the batch found
    seven quotations that had silently gained a sentence-initial capital, plus one quoting a
    phrase that appeared nowhere in its passage. Re-cut the quoted span so it ends where the
    source ends, or drop the quotation marks and paraphrase. Never adjust a word to fit the
    frame, and never let a quote frame change the source's grammar.
