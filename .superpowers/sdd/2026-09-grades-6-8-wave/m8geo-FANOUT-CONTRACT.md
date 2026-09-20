# Grade 8 World Geography fan-out contract — binds every lesson agent

You are authoring lesson plans for a **Grade 8 World Geography** course in the Evelyn Learning engine.
**The audience is thirteen- and fourteen-year-olds.** That governs every decision below.

This course has one rule that outranks every other rule in this file, including the lint. Read the next section before anything else.

---

## ⚠️ THE DEPTH FLOOR — the thing this course is actually about

A complete Grade 7 World Geography course (`grade-7-world-geography`, `m7geo-*.ts`) already ships and is live in production. It teaches every mechanism this course touches **from zero prior knowledge**: density equals population divided by area, the five controls on climate, the three plate-boundary types, push and pull, the hazard-versus-disaster distinction, natural/geometric/cultural boundaries, primary-through-quaternary activity, indicators and composites. Grade 8 is not a third first-exposure pass and it is not a review of Grade 7 with harder words. Grade 8 is deliberately held one whole level ABOVE it, and the product owner signed the scoping decision on that basis.

**Grade 8 operates at ANALYSIS / EVALUATION / APPLICATION depth, on DESCRIBED DATA or a DESCRIBED CASE that the item itself supplies. It never operates at DEFINE-THE-MECHANISM depth, because that is Grade 7's, and a row that merely re-defines a Grade 7 concept is the defect.**

The curriculum's own paired examples are the calibration you should hold in your head the whole time you write:

| Grade 7 says (below your floor — assumed, never re-taught) | Grade 8 says (yours) |
|---|---|
| A density figure is an average that can hide clustering | Hands the student the sub-regional figures, works them at each scale, and asks which claim each scale can and cannot support (row 1.3) |
| Density equals population divided by land area; income per person is one indicator | Converts counts to rates with three different denominators and decides which one a stated claim actually needs, and when a raw count misleads (row 1.1) |
| Every flat map distorts shape, area, distance or direction; choose a projection for a question | Given two described maps of the same data, identifies which design choice changed the impression and whether a claim rests on the data or on the design (row 1.4) |
| The five controls on climate, each taught from zero | Matches five described North American stations to their positions, names the control at work in each, and predicts the climate of a newly described position (row 3.2) |
| A hazard becomes a disaster when people and property are in the way | Decomposes the disaster side into hazard, exposure and vulnerability, explains from described data why two places hit by the same event had different outcomes, and ranks described places by risk (row 7.1) |
| Natural increase is births minus deaths; an age structure read in words says what a place needs | Computes a dependency ratio from percentages in age bands and predicts what the place must provide in ten years (row 5.1) |
| The general causes of a boundary dispute, listed | Given a described case, identifies which cause the evidence supports and which resolution mechanism fits (row 9.1) |
| Why places trade; tracing a supply chain | Shows from a two-good table why both places gain from specializing, then finds the chain's single point of failure and prices a backup (row 8.1) |

### Five tests. Run all five on your draft before you call it done.

1. **The data test.** Every worked example and every `try_yourself` must reason over numbers, a table, or a case that the item itself supplies. If an item can be answered without reading the described data — because the answer is a definition, a fact about the world, or a general principle — it is below the floor. The concept segment may state principles; the items may not be answered by them alone.
2. **The decision test.** Every item stem must require a decision, a comparison, a computed result or an evaluation — which denominator, which class, which site, how many exposed, which plan bears the cost on whom, is the claim supported. "What is X?" and "which of these is an example of X?" are Grade 7 stems. If the keyed answer is a definition, rewrite the item so the keyed answer is a number, a category the data puts something in, a named place-in-the-data, or a short verdict.
3. **The assumed-mechanism test.** The Grade 7 mechanism your row builds on is ASSUMED in one clause, not re-taught. "Density is people divided by land area, so..." is one clause and is fine; a keyIdea whose whole job is to define density is a Grade 7 keyIdea and is the defect this course exists to avoid. Count your keyIdeas: every one of them must be about what you DO with the mechanism (choose, compare, compute, evaluate, decide), not what the mechanism IS. One clause of premise per keyIdea at most.
4. **The distractor test.** The difficulty in every item must come from a wrong step in the analysis — the wrong denominator, exposure counted where vulnerability was asked, a class-break artefact read as a real pattern, a projection read as a prediction, a raw trade total read as dependence — not from not knowing a word. If a distractor is wrong only because the student forgot a definition, the item is testing Grade 7. Grade 8 difficulty comes from the counterintuitive edge of the analysis: the place with the lower count and the higher rate, the average that is high while every district but one is low, the small island that extends a maritime zone enormously.
5. **The Grade 7 file test — the decisive one.** Open the Grade 7 seed your row's scope line names. Read your own sentences next to it. **If a sentence you wrote could be lifted into that Grade 7 file without anybody noticing it came from a Grade 8 lesson, it is below the floor.** Your sentences are supposed to take the Grade 7 file for granted. Read the Grade 7 file's `keyIdeas` and confirm that none of yours restates one; then read its `try_yourself` items and confirm that none of yours could be answered by a student who had only taken that lesson. That is not a courtesy check. That is the assignment.

**Why these tests exist, and why the excluded list below cannot replace them.** This course has a boundary on BOTH sides, and they are different kinds of boundary. The boundary ABOVE is a list: the named models this course stops short of (the demographic transition model, the urban-structure models, agricultural land-use models, state/nation/nation-state, industrial-location theory by name, the formal names of the aggregation fallacies) belong to AP Human Geography and high-school statistics, and you settle a boundary case up there by reading the "Explicitly excluded" list — a named model either appears or it does not. The boundary BELOW is a depth, not a list: **every item in this course is THE SAME topic Grade 7 taught, one level up**, so no list can decide whether your population row has drifted down into re-teaching density. "Population" appears in both grades, and what separates them is what the student is asked to do with the described numbers. That is the structural reason this course needed its own contract rather than a find-and-replace over the Grade 6 geography one, whose floor was a ceiling. (The paired Grade 7 / Grade 8 rows in the table above are the signed curriculum's own examples and are authoritative. The five tests are one author's synthesis of them, checked against the curriculum's scope lines and two Grade 7 seeds read in full — evidence base: the signed table plus two files. If a sixth test would have caught something in your row that these five missed, report it.) Read the excluded list — it is authoritative about the models reserved for the courses above — but when you are unsure whether a sentence you wrote is too shallow, the list will not tell you. Test 5 will.

### Three things the floor does NOT mean

- **It does not mean a statistics course.** A described table in this course is three to six numbers a tutor can read aloud — three regions and their counts and areas, four age bands and their percentages, two goods and two countries — never a forty-cell spreadsheet. The analysis is the thing; the data is just enough to make the analysis possible and to make one wrong step visibly wrong. If the student needs to hold more than six numbers to answer an item, the item is testing memory, not analysis.
- **It does not license skipping the premise.** A student may meet this course cold. Every lesson restates the Grade 7 mechanism it rests on in ONE clause, where it is used, so the lesson is self-contained — "density is people divided by land area, so" — and then does its own work. The difference between that clause and a Grade 7 lesson is that the clause is a premise and never a keyIdea, never a worked example, never an item.
- **It does not mean real statistics.** Working on described data is not a licence to state real figures about real places. The invented-place default below still holds, and it holds harder here than in Grade 7, because this course puts numbers in every item and a number attached to a real place is exactly the confidently-wrong-fact failure mode. Units 3–4 are the only rows that name real North American places and patterns, and the rules for them are in the accuracy section.

### Never mention Grade 7 (or Grade 6) to the student

Because the Grade 7 seeds are self-contained rather than Grade-8-aware, a student who takes both courses meets every subject in this course twice. That is intended spiral deepening. Do not write "you learned last year", "as you already know from", "the simple version was", "building on Grade 7", or anything else that flags the floor to the student. The lineage clause in your row's scope cell ("Deepens G7 3.1, which taught...") is for you; it lives in your `SCOPE GUARD` doc comment, never in the lesson prose and never in `los[0].description`.

### How to read the evidence behind the rules in this contract

Rules below are annotated with the evidence they rest on, because the size of that evidence tells you how to treat them. **A rule marked "evidence base: two files" is evidence, not licence.** It means the pattern held in the two exemplars and is a good default — but it has not been tested on a row like yours, so if it does not fit, say so in your report rather than forcing it.

This annotation exists because of a real defect in the sibling ELA course in the Grade 6 wave, and geography was equally exposed. The ELA contract stated that grammar rows get answer-length parity essentially for free, generalising from a single data point: its own grammar exemplar, which happened to measure clean. A fan-out agent then produced a grammar row whose first draft had all three keyed answers strictly longest, falsifying the exemption. **Every defect of that family was a true sentence doing untrue work** — the measurement was right each time; what was wrong was the scope it was allowed to cover. The "true as written" check cannot catch this, because the true sentence passes its own audit while the false inference sits in a different sentence. Stating the sample size is the cheap guard.

Three evidence bases appear below and they are not equivalent:

- **"Shipped measurement"** — drawn from production content across many courses and thousands of items (the DF-1 and DF-3 findings). Large sample. These describe how this defect actually behaves, and the rules built on them are not negotiable.
- **"Evidence base: two files"** (or one) — drawn from the two exemplars, both written by one author in one sitting for this fan-out. Small sample, and correlated: they share an author, so a habit of mine looks like a pattern. Useful defaults, weak evidence. Where this contract was written before the two Grade 8 exemplars existed, a rule of this kind is marked **"default carried from the shipped m7geo seeds and the Grade 6 sibling contract; to be confirmed against the exemplars"** — treat it as a default, and report if your row breaks it.
- Where a rule rests on the signed curriculum or on the engine's lint, it rests on neither of those and is simply authoritative; it is marked as such.

---

## Working directory
`/Users/luke/Dev/evelynlearning/.claude/worktrees/demo-gate` (git worktree). Work ONLY here. Do NOT touch `/Users/luke/Dev/evelynlearning` itself — unrelated branch, uncommitted work.
Do NOT commit, push, merge, deploy, start a dev server, or seed Mongo. **Do NOT edit `store.ts`** — registration is batched separately by the controller. Writing to it would collide with sibling agents.
Do not dispatch subagents. You write ONE file: your own seed.

## Course shape: 40 rows, 2 pre-written, 38 fan out
The signed-off curriculum (`.superpowers/sdd/2026-09-grades-6-8-wave/m8geo-CURRICULUM.md`) has exactly 40 lesson rows across 10 units. The controller hand-writes 2 of them as exemplars (rows **7.1** and **1.1**, marked "(exemplar — written)" in the chain table below); the remaining 38 rows are what fan out to authoring agents, one row per agent. This is not a discrepancy to flag — it is the intended split.

## The template — copy its shape exactly
Read BOTH exemplars in full before writing anything:
- `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8geo-u7-hazard-risk-exposure-and-vulnerability.ts` (**concept-led** — use for rows that install a framework or an idea the student then applies to described data or a described case: scale of analysis (1.3), maps as arguments (1.4), GIS layers and overlay (2.1), North America's landform regions explained by plate position (3.1), why hazards cluster where they do (3.4), intervening obstacles and chain migration (5.3), the refugee / asylum-seeker / internally-displaced distinctions (5.4), carrying capacity (6.3), food security as availability, access and stability (6.4), risk as hazard × exposure × vulnerability (7.1), mitigation versus adaptation (7.4), comparative gain from specialization and single points of failure (8.1), why a newer network leapfrogs an older one (8.4), the causes of a boundary dispute (9.1), maritime zones (9.2), why acting alone fails on a shared resource (9.3), claim–evidence–reasoning (10.1), scenario analysis on conditional assumptions (10.4))
- `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8geo-u1-counts-rates-and-fair-comparison.ts` (**procedure-led** — use for rows that make a routine over described data fluent: converting counts to rates (1.1), evaluating a choropleth's classing (1.2), applying a buffer (2.2), scoring sites against weighted criteria (2.3), computing land-cover change (2.4), matching stations to climate controls (3.2), tracing a drop of water through a described drainage network (3.3), computing and comparing densities (4.1), reading an origin–destination table (4.2), measuring built-up area against population (4.3), classifying activity and reading a two-way trade table (4.4), the dependency ratio (5.1), doubling time by the rule of 70 (5.2), demand against supply in a basin (6.1), evaluating an energy table against a goal (6.2), trend versus variability in a series (7.2), counting exposure by elevation band (7.3), building a composite from ranks (8.2), scoring factory sites (8.3), pricing a chokepoint closure (9.4), scoring two zoning plans (10.2), comparing two regions on a criterion (10.3))

Both files exist before any agent is dispatched against this contract — they are authored ahead of fan-out specifically so every agent has its own course's register to anchor on. **Do not substitute a different grade's seed as a stand-in if one is somehow missing.** Falling back to an `m7geo-*` file is exactly the drift these exemplars exist to prevent — an `m7geo` file is written one level BELOW your floor, and it will pull your keyIdeas down into re-teaching the mechanism. An `ap-human-geo-*` file is one level above and is not a substitute either. If either path is missing when you go to read it, stop and report that the exemplar is absent rather than improvising a substitute.

### The `SCOPE GUARD` paragraph — required, and it does unusual work in this course

Both exemplars open their file-level doc comment with a **`SCOPE GUARD:` paragraph**. Write the same convention into your own file. It names your row's boundary against its Grade 8 neighbors, against Grade 7 below **and** against the courses above, drawn from your row's scope line and the "Explicitly excluded" list below. It is not lint-enforced, but it is what keeps a reviewer — and the next agent reading your file as salvage — from having to re-derive your boundary from scratch.

Three requirements, and the second one comes from a real defect found in the Grade 6 wave:

1. **Name the MECHANISM you assume, the ANALYSIS you add, and the MODEL above you stop short of — not the subject.** Your grade boundary is a *depth* floor, not a topic list, so "this lesson is about population" says nothing useful. A guard a reviewer can actually check a file against reads, for row 5.1: *"This row ASSUMES, in one clause each, that natural increase is births minus deaths and that an age structure can be read in words (Grade 7, `m7geo-u3-population-growth-and-structure.ts`) and re-teaches neither. It ADDS computing a dependency ratio from percentages in age bands and predicting what the place must provide in ten years. It names NO stage of the demographic transition model (`ap-human-geo-population.ts`). It does NOT estimate doubling time (row 5.2) and does NOT sort migration reasons (row 5.3)."* Name the Grade 7 seed file and, where one applies, the owning file above.
2. **The guard must be TRUE AS WRITTEN of the finished file.** (Evidence base: four observed instances across two courses in the Grade 6 wave — one in Grade 6 Math, three in the Grade 6 geography course's own authoring, all of them narration that was wrong while the file was right.) A Grade 6 Math exemplar shipped a guard reading "every quantity in this plan is a proper fraction" while its own body used `6/4`, `3/2`, `2/1` and "1 and 1/2". The content was fine; the guard was simply false — and no type check, no lint and no schema can catch that. A false guard is worse than no guard, because the next agent trusts it. Write the guard **last**, after the body is finished, or re-derive it from the finished body. In this course the clause most likely to be false is "re-teaches neither": grep your keyIdeas for the mechanism's definition before you write that clause.
3. **Say what IS deliberately allowed, and why, wherever a neighboring row sits close.** A guard that only forbids reads as though the author avoided the neighborhood. The real skill this course needs is standing on the mechanism without re-teaching it, and stopping short of the named model above, so record where you stood and why that side of the line is yours. Two Grade 8 rows show the shape: row 3.4 deliberately RE-USES the hazard-versus-disaster classification on described exposure counts (that is application, which is this row's) while never re-teaching what a hazard is and never computing risk, which is row 7.1's; row 7.2 deliberately carries a one-paragraph greenhouse mechanism at define depth because no middle-school science course owns it (ruled 2026-09-03), and stops before any radiative-forcing arithmetic or attribution debate. Both are recorded in their scope lines; your guard records yours.

Every file you write imports `MS_PACING_THRESHOLDS, MS_SOURCE` from `./_ms-shared` and sets
`curriculum: 'MS'`, `grade: '8'`, `subject: 'social-studies'`, `topic: 'grade-8-world-geography'`, `locale: 'en'`, `schemaVersion: 1`,
`source: MS_SOURCE`, `pacingThresholds: MS_PACING_THRESHOLDS`, exactly one entry in `los`.

## Naming, derived from your row
- file `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8geo-u<N>-<slug>.ts`
- `id: 'evelyn.ms.m8geo.<slug>.v1'`
- export `SEED_M8GEO_U<N>_<SLUG_UPPER_SNAKE>` (slug uppercased, hyphens→underscores — e.g. slug `hazard-risk-exposure-and-vulnerability` in unit 7 exports `SEED_M8GEO_U7_HAZARD_RISK_EXPOSURE_AND_VULNERABILITY`)
- `los[0].id: 'm8geo.<slug>'`, `los[0].standard: 'M8GEO-<u>.<t>'` where `<u>` is the unit number and `<t>` is that row's position in the unit (1–4), e.g. row 7.1 → `M8GEO-7.1`
- `metadata: { cedUnit: '<N>', cedTopic: '<u>.<t>', cedTitle: '<Title>' }` — `cedUnit` is a STRING (`'7'`, not `7`); `cedTopic` is the string `'<u>.<t>'`
- Copy the slug and the title from the chain table below **character-for-character**. Several slugs in this course are shorter than their titles and do not match them word for word (row 1.2, slug `evaluating-a-choropleth`, title "Evaluating a Choropleth Map"; row 4.3, slug `north-america-metropolitan-regions`, title "North America: Metropolitan Regions & Urban Form"; row 7.3, slug `coastal-risk-and-sea-level`, title "Coastal Risk & Sea-Level Change"; row 7.4, slug `mitigation-adaptation-and-resilience`, title "Mitigation, Adaptation & Resilience Planning"; row 10.1, slug `building-a-geographic-argument`, title "Building a Geographic Argument from Data"). That is correct as signed; do not tidy either one toward the other.

## Segment recipe — the lint enforces this exact sequence
`hook, concept, worked_example, worked_example, try_yourself, try_yourself, try_yourself, misconception_check, recap`

This is verified verbatim by `apps/tutor/scripts/lint-ms-plans.ts` (`npm run lint:ms-plans`), whose `m8geo` row reads `{ subject: 'social-studies', topic: 'grade-8-world-geography', loPrefix: 'm8geo', std: 'M8GEO', grade: '8', tryFormat: 'three-mcq' }`. Below is every check that script runs against your plan — passing it on the first try means satisfying all of these, not just the ones that feel important:

- `id` matches `evelyn.ms.m8geo.<slug>.v<N>`; `curriculum: 'MS'`; `grade: '8'`; `subject: 'social-studies'`; `topic: 'grade-8-world-geography'`
- `metadata.cedUnit` is a string `1`–`10`; `metadata.cedTopic` is a string matching `<1-10>.<digits>`; `metadata.cedTitle` is a non-empty string
- exactly ONE entry in `los`; `los[0].id` matches `m8geo.<slug>`; if `los[0].standard` is set it must match `M8GEO-<1-10>.<digits>` and must NOT contain the substrings `frq`, `dbq`, `leq`, `saq` (case-insensitive) — neither may `metadata.cedTopic` or `metadata.cedTitle`
- `pacingThresholds` must be equal in value to `MS_PACING_THRESHOLDS` (the lint compares by `JSON.stringify`; import it, do not hand-type the object)
- exactly THREE `try_yourself` segments, and **ALL THREE are `responseFormat: 'mcq'`. There is no numeric item.** This is `tryFormat: three-mcq`. The lint rejects any `responseFormat: 'numeric'` in this course outright: `grade-8-world-geography try_yourself segments must all be mcq (found N numeric)`. This course computes rates, ratios and doubling times, so you will be tempted to make one item numeric — do not. The arithmetic lives inside an MCQ whose four choices are four numbers, three of them the result of a nameable wrong step (the wrong denominator, the count instead of the rate, 70 multiplied instead of divided). That is a better item than a bare numeric box, because the distractors diagnose the error.
- every MCQ `try_yourself` has exactly 4 `choices` with exactly one `correct: true`
- no `try_yourself` may carry a `rubric` field — rubrics are FRQ-only and MS plans never use FRQ
- exactly ONE `concept` segment, and it must have **4–6 `keyIdeas`** (not 3, not 7)
- a `recap` segment must be present (the lint checks presence; `mustRemember` is the segment type's required field, so `tsc` catches its absence)
- `schemaVersion` must be `1`
- `estimatedMinutes` (plan-level) must be an integer in **18–22**
- the sum of every segment's own `estimatedMinutes` must be within 1 minute of the plan-level `estimatedMinutes` — every segment (including both `worked_example`s and all three `try_yourself`s) needs its own `estimatedMinutes` set, or the lint flags a missing value before it even checks the sum. The default budget is `1, 6, 3, 3, 2, 2, 2, 1, 1` summing to exactly 21, with the plan set to 21 (the budget the shipped `m7geo-u3-population-distribution-and-density.ts` uses and the Grade 6 sibling exemplars used; default carried, to be confirmed against the exemplars). A Grade 8 worked example that carries arithmetic may honestly need 4 minutes; `m7geo-u7-latin-america-economy-and-cities.ts` ships `1, 6, 4, 4, 2, 2, 2, 1, 1` (sum 23) with the plan set to 22, which passes the within-1 check and the 18–22 band. Use that shape if your row needs it; do not go past it. The 18–22 band is the lint's, and is authoritative.
- segment `kind` order must be EXACTLY `[hook, concept, worked_example, worked_example, try_yourself, try_yourself, try_yourself, misconception_check, recap]` — no reordering, no dropping, no duplicating
- every `prerequisites`/`followUps` entry must resolve to a real `los[0].id` that exists somewhere in this course's plan set (checked across the whole batch, not per-file) — a slug typo here fails the batch lint even though your own file is otherwise perfect, so copy slugs from the table below character-for-character

The lint does NOT check hint count, but every shipped `m7geo-*` seed sets `hints: [ ... ]` with exactly 2 entries, escalating, on every `try_yourself`, and so did both Grade 6 sibling exemplars — match that pattern; it is house style, not an accident. (Evidence base: 40 shipped Grade 7 files plus two Grade 6 exemplars, so this one is well supported.) The first hint points at the question to ask of the data; the second rules distractors out by name-free description of the wrong step that produces each.

## Naming/authoring details the lint does not catch, but a reviewer will
- `expectedAnswer` on an MCQ `try_yourself` must be **byte-identical** to the `text` of the `correct: true` choice
- choice `id`s are always `'a'`, `'b'`, `'c'`, `'d'`, in that order
- `misconception_check.commonErrors` needs 1–2 entries, each naming the wrong answer, the misconception behind it, and the full correction. Both shipped Grade 7 calibration seeds use 2, and each entry ends by resolving the error completely — never leave a misconception hanging (the 1-2 range is the lint's; "use 2" is a preference carried from the shipped seeds). In this course the misconception is almost always an analysis error, and the correction must show the right step with the digits: *"WRONG: 'Region Ardent has more people, so it is more crowded.' CORRECT: 'Ardent has 4,200 people on 12 square kilometers, which is 350 per square kilometer; Belmar has 3,000 on 5, which is 600. The larger count sits on the less crowded land.'"*
- `WRONG: ... CORRECT: ...` labeling in worked-example steps wherever a step exists specifically to warn against a bad answer
- `vocabulary` on the `concept` segment: 4–6 terms, each defined by what makes the thing what it is, never by a list of famous examples. In this course most terms are analytical (rate, denominator, exposure, vulnerability, buffer, class break, dependency ratio, doubling time, median line); define each by the operation it names, not by an example of its use.

---

## Correctness — the one unrecoverable defect
**Every factual claim about the real world must be true, and every number in the file must be arithmetically right.** The first is the geography equivalent of an arithmetic error, and it is worse, because a student cannot check it. Grade 7 World Geography had more items rejected in the verification gate than any other subject in that wave, and this is the reason. The second is new at this grade: Grade 7 geography mostly avoided numbers; this course puts them in every item.

The rule that follows from the first, and the one you will actually use:

> **If you are not certain a claim is true, choose a different, safer example rather than guessing.** A confidently wrong fact — which ocean a river reaches, which side of a divide a city sits on, which coast a hazard strikes — is the failure mode for this course. There is always a safer example, and in this course the safest example is usually an invented place whose numbers you wrote. Use it. Do not ship a claim with a hedge ("roughly", "about", "generally") to cover uncertainty; a hedge does not make a wrong fact right.

### The Grade 8 arithmetic rule — digits shown, arithmetic checked

Rates, ratios, percentages, the rule of 70 and dependency ratios appear in this course **with the digits shown and the arithmetic checked**. Concretely:

- Every computed figure in a worked example is shown as a full line of arithmetic in a step — *"4,200 people divided by 12 square kilometers is 350 people per square kilometer"* — never as a result that appears from nowhere.
- Every computed figure, in a worked example, an item, a hint, a distractor or a `correctsTo`, goes in the claim ledger with its arithmetic in the third column, **including figures about invented places**. An invented place cannot be wrong about the world, but it can be wrong about the arithmetic, and a student who checks it will find out. The Grade 6 geography exemplars surfaced an arithmetic claim wrong by two orders of magnitude after the file had been declared finished; that is why this is not optional.
- Every computation is inverted once in the file: multiply the rate back by the denominator to recover the count; multiply the doubling time by the growth rate to recover 70; add the class members back to confirm they fall inside the stated break values; add the dependents back to the working-age group to recover 100 percent. The inversion is the geography equivalent of the math course's substitute-back-in check, and it is where an order-of-magnitude slip becomes visible.
- Keep the arithmetic inside CCSS Grade 6–7 ratio and proportional reasoning: division that comes out to whole numbers or one decimal place, percentages of round bases, the rule of 70 with rates that divide 70 cleanly (1, 2, 3.5, 5, 7, 10 percent). No exponential notation — the curriculum withholds it for Algebra 1 by name — and no compounding beyond "doubling time".
- Round numbers are a design choice, not a shortcut: choose the invented figures so the arithmetic is clean and the wrong steps come out visibly different from the right one.

### The check move — every worked example ends with one

A Grade 8 Math worked example ends by working backward: substitute back in, multiply back out. Geography has less to invert, so it uses a different check, and this one is **standardized wave-wide for geography and science** by the controller — that decision is authoritative; the two variants below are carried from the Grade 6 sibling course's two exemplars (one variant each) and re-derived for Grade 8 rows, so the exemplars will instantiate them and your report should say if neither fits your row (ELA keeps its own shipped evidence move — say the trait, say because, then quote the line — which does the same job in its own idiom). Use whichever of the two fits your row, and put it in the last step of each worked example. Where the example computed a number, the arithmetic inversion above is required IN ADDITION, not instead.

- **Three independent clues of different kinds.** Where the example reaches a verdict — this place is the higher-risk one, this claim is an overreach, this boundary cause is the one the evidence supports — do not rest it on one figure. Show three pieces of the described data that agree and are not the same kind of evidence, then name the lesson explicitly. For row 7.1 the move is: the hazard strength was the same in both places (one kind of evidence), the exposure counts differed by a stated amount (a second kind), and the building standards and warning lead-time differed (a third kind) — so the difference in outcome is traced to the components, and the lesson is said in one line: *one number is a hunch; three of different kinds, all pointing the same way, is evidence.*
- **Rewind the input, then test a contrasting case.** Where the example runs a routine, re-read the given data backwards to confirm the answer follows from it, then change ONE input and run the routine again so the student cannot overlearn one outcome. This course's rows are written for this move — nearly every procedure-led scope line ends with "and evaluate how a change in X changes the answer": re-run the site score with one weight changed (2.3), widen the buffer and watch a parcel cross the line (2.2), re-draw the class breaks and watch two regions change class (1.2), swap the denominator and watch the ranking flip (1.1). The contrasting case is the point of the row, so it belongs in the worked example, not only in an item.

The point is the same as math's: it is not decoration, it is how a thirteen-year-old learns to catch their own mistake in a subject where they cannot look the answer up.

### Geography accuracy and sensitivity rules — non-negotiable
These are inherited from the shipped Grade 7 geography contracts, which were written against a full 40-lesson course and its bank, and apply unchanged at Grade 8. They do not rest on this course's two exemplars. Rule 9 is this course's own, from its signed scope.

1. **Every factual claim about a real place must be true and current** — which ocean a drainage system reaches, which side of a divide a place sits on, which coast a hazard strikes, where a physical region begins and ends.
2. **Prefer physical and long-settled facts** (the Mississippi system drains to the Gulf of Mexico; the Rocky Mountains are young and high and the Appalachians are old and worn; Canada's population is concentrated in a band near its southern border) over anything that changes (governments, current populations, city rankings, trade arrangements, this year's disaster).
3. **No invented precise statistics about real places.** No made-up populations, densities, percentages, flow totals, exposure counts or trade values attached to a real named country, region or city. In this course that rule has a sharp edge, because every item carries numbers: **a number in an item belongs to an invented place, or it is a real figure you verified against a named source and recorded with that source in the ledger. There is no third option.** If you cannot verify a figure for a real region, un-name the region — "a northern region with long winters and thin soils" — and keep the pattern; never keep the name and invent the number.
4. **Never rank countries, regions or cultures** as better, more advanced, more civilized, or more developed-as-a-virtue. Development is measured, never judged; risk, exposure, vulnerability, dependency and inequality are measurements, never scores for a place or its people. Banned: "third world", "backward", "primitive", "advanced peoples", "still catching up". Row 8.2 (composite indicators) and row 10.3 (comparing two regions) are where this rule is easiest to break: a composite ranks NUMBERS for a stated criterion, and the lesson must say so out loud.
5. **Do not characterize the people of a country or region** by a trait, temperament, work ethic or lifestyle. Describe places, climates, landforms, resources, flows and systems — not what "the people there are like". Rows 4.2, 5.3 and 5.4 describe migrants and displaced people as flows read from data with stated reasons, never as a story about a kind of person.
6. **Avoid contested political claims.** Disputed borders, sovereignty disputes, blockades and active conflicts are not settled facts. Rows 9.1, 9.2, 9.4 and 5.4 are built on invented or long-settled cases for exactly this reason: no live dispute, blockade or conflict is named anywhere in this course, at any depth, and no trade agreement is named or evaluated (row 4.4 reads a two-way trade table and stops there).
7. **Religions are described respectfully and factually, from the outside** — as adherents themselves describe them, never evaluated as true or false, never compared for merit. This course has no culture or religion row by design; if religion enters a described migration or connectivity case, this rule governs the one clause it gets.
8. **No group is a monolith.** Every world region holds many countries, languages, climates and ways of living; say so where a lesson could imply otherwise. This bites hardest in rows 10.3 and 5.3, whose described regions and countries are invented precisely so that no real group is described as one thing.
9. **Units 3–4 are the rows that name real North American places, and they carry the heaviest verification burden in this course.** Rows 3.1–3.4 state long-settled PHYSICAL facts (which region a described location lies in, which ocean a drop of water reaches, why each hazard clusters where it does) — verify every one, one at a time, against a source you name. Rows 4.1–4.2 are the two rows the signed curriculum flags as allowed to state real long-settled SETTLEMENT TRENDS (the eastern half and the coasts of the United States settled most densely; Canada's population concentrated near its southern border; the multi-decade interior-to-South-and-West shift) — state the pattern in words, and keep every FIGURE in every item described-in-item under rule 3. Rows 4.3 and 4.4 name real patterns (a multi-centered urban system; what broad regions produce) at the same standard. No row anywhere in this course states a real figure it has not verified and sourced.

### The invented-place default
Because Grade 8 works on described data, most items need an invented place with a described table, and an invented one is both safer and a better test. A student who can find the wrong denominator in a table about Ardent and Belmar has learned the analysis; a student who has memorized a real density figure has not.

- **Default to invented, described places and invented, described data** in `try_yourself` items and worked examples: *"Ardent has 4,200 people on 12 square kilometers of land. Belmar has 3,000 people on 5. A newspaper says Ardent is the more crowded of the two."*
- **Use a real place only as an anchor**, and only when it is physical and long-settled. Outside Units 3–4, name a small handful and no more; the principle is that each one is deliberate, not that any particular number of real names is allowed.
- **Rows that must name real places** (Units 3–4, per accuracy rule 9) are the exception, not the pattern. In those rows the pattern may be real and named; the figures in items are still invented-and-described or verified-and-sourced, never invented-and-attached-to-a-real-name.
- Every real-world claim you assert, and every computation you performed, goes in your report as a **claim ledger**. See the next section — it is the last thing you do and the most useful.

### The claim ledger — three columns, and the third one does the work

**This ledger is read.** The geography review pass spot-verifies the claims in it against the world and re-runs the arithmetic in it, and the wave ledger records that commitment so a later session cannot quietly drop the reading half while keeping the writing half. It is not busywork and it is not a formality — a claim ledger nobody reads is worse than no ledger, because it manufactures confidence. Write it honestly and completely: a claim you leave out is a claim nobody checks.

Write it as a table with **three** columns:

| The claim, as the lesson states it | Where it appears (segment id) | **Why I am confident this is true** |

**The third column is the point of the exercise.** A ledger with two columns is just a list of assertions, restated — it cannot expose anything, because every row looks equally solid. The third column is what separates a claim you have grounded from a claim you have merely written down confidently.

What passes as a ground:
- *"It is the definition of the term."*
- *"It is a physical, long-settled fact of the kind rule 2 calls safe."*
- *"It is stated in this row's scope line in the signed curriculum."*
- *"It follows arithmetically or geometrically from something already established in this lesson"* — e.g. the median line is equidistant from both coasts by construction, therefore a point nearer one coast falls in that coast's zone.
- *"I computed it, and here is the arithmetic"* — with the digits: *"4,200 ÷ 12 = 350; check 350 × 12 = 4,200."*
- *"I verified it against a specific source I actually consulted"* — name it.

What does NOT pass:
- *"I am fairly sure."* / *"It is common knowledge."* / *"It sounds right."*
- *"Roughly / about / generally true."* A hedge in the third column means the claim is not grounded.
- *"A shipped seed says so."* Shipped content is not a source. DF-1, DF-2 and DF-3 are all defects that shipped. The one exception is narrow and is not really an exception: the Grade 7 mechanism your row ASSUMES is grounded by the signed curriculum's scope line, which names it — cite the scope line, not the seed.

**A weak third column is a LESSON defect to go back and fix, not a ledger row to submit.** When you cannot ground a claim, you have three moves, in this order: swap it for a safer example, cut the claim, or compute/verify it properly. Only then does the row go in the ledger. This is not optional bookkeeping. Evidence base: two Grade 6 courses, both finding defects in exemplars they had already declared finished. The Grade 6 science course surfaced three — an internal contradiction between two key ideas, two hedged frequency claims it could not ground, and a conflated pair of technical terms. The Grade 6 geography course surfaced four in its own two exemplars — an arithmetic claim wrong by two orders of magnitude, a location overreach, an ungroundable count, and a universality claim that was false at the boundary and asserted in six places at once. `tsc` cannot see any of that. Neither can the lint. Neither can your own self-check script. The Grade 8 exemplars will be ledgered the same way before they are declared finished, and whatever they surface goes in the wave ledger.

### What goes in the ledger

Geography's claim set is naturally bounded — it is claims about real places and real physical things, plus, in this course, every number — so you can be specific. Include every one of these:

- Every **named real place or feature**: a continent, ocean, sea, river, mountain range, country, region, or a named line such as a continental divide.
- Every claim about **where something is**, relative to another place, to a divide, to an ocean, or to a compass direction.
- Every claim about a **real physical process, its rate, or its scale** — where a hazard clusters and why, which direction a system drains, how a rain shadow falls.
- Every **quantity or magnitude**, including approximate ones, and **every arithmetic step you performed** — in a worked example, an item, a hint, a distractor or a correction, about a real OR an invented place (show the arithmetic in column three; that is where an order-of-magnitude slip becomes visible).
- Every **standard figure presented as fact** — the 12-nautical-mile territorial sea and the 200-nautical-mile exclusive economic zone (9.2), the rule of 70 as an approximation (5.2), the under-15 and over-64 bands of the dependency ratio (5.1).
- Every **named person, date, or attribution** — who proposed an idea and roughly when (this course should need almost none).
- Every claim about **what evidence exists** — that a described series shows a trend, that a described image resolution can or cannot show a field boundary.
- Every **convention presented as fact** — that a choropleth's classes are set by the mapmaker, that a projection is a choice.
- Every **etymology or definition** you assert.

And the three categories agents habitually leave out, which is precisely why they are listed separately:

- **Every factual claim embedded in a DISTRACTOR.** A distractor is wrong by design, so for each one the ledger row is *the true claim your correction rests on*, plus any real-world detail or arithmetic the distractor takes for granted. In this course a distractor is usually a wrong computation — write the wrong computation in the ledger too, so the reviewer can confirm it is the wrong step you say it is and not a second right answer.
- **Every factual claim embedded in a HINT.** Hints look like scaffolding rather than teaching, so they get skipped — and a hint is read by exactly the student who is already unsure, which is the worst audience for an ungrounded claim.
- **Every factual claim embedded in a MISCONCEPTION CORRECTION.** The `correctsTo` field is the most authoritative prose in the whole lesson: it is where the tutor says "here is what is actually true". It gets omitted from ledgers because it feels like fixing rather than asserting. It is asserting.

None of these three feels like teaching, which is exactly how an ungrounded claim survives a review pass.

### Distractors — the geography-specific rule
**A distractor about a real place must be a plausible CONFUSION, not a false statement about a different real place that a student might later remember as true.**

Prefer "the right kind of thing in the wrong category" — a count offered where a rate was asked, exposure offered where vulnerability was asked, a class-break artefact offered as a real pattern, a hazard called a disaster with nobody exposed, a projection offered as a prediction, a raw trade total offered as dependence, a territorial-sea rule applied at the exclusive-economic-zone distance — over inventing a false fact like "the Colorado drains to the Gulf of Mexico". A student who half-remembers a distractor should end up with an analysis error they can unlearn, not a wrong fact about the world.

**Every distractor must be a real, nameable student error.** In this course that means a nameable wrong STEP: if you cannot say in one sentence which wrong computation or wrong criterion produces a distractor, replace it with one you can. A distractor that is merely a random other number is a defect.

---

## ⚠️ Answer cues — the two measured defects this course must not reproduce

Both of these are recorded findings from the Grade 7 wave (`.superpowers/sdd/2026-09-grades-6-8-wave/DEFERRED-FIXES.md`). Neither is caught by `tsc`, by the lint, or by a content-verification pass, because **every individual item is correct**. They are only fixable at authoring time, which is now.

### DF-3 — the correct answer must not be the longest choice
**Shipped measurement — large sample.** Measured in the shipped Grade 7 World Geography bank: the keyed answer was the **strictly longest** of the four choices **67% of the time** — chance is 25% — rising to **94% at difficulty 4**. The hardest tier was the most gameable tier, which is exactly backwards. A student who never reads the stem and always picks the longest option beats guessing by a wide margin.

Nobody chose this. It falls out of honest authoring: a correct prose answer has to be fully qualified to be defensible, while a distractor only has to be wrong, so it stays short.

**The signed curriculum was written against this defect:** every row is designed so the keyed answer is a *number, a category the data puts something in, a named place-in-the-data, or a short evaluative verdict* drawn from described data — which gives distractors the same natural length as keys. That is a design that makes parity easy; it is not a guarantee, and it has a trap of its own: a verdict key ("not supported, because the map shows a count, not a rate") grows a reason clause, and if only the key gets one, the tell is back.

**The rules:**

1. **Lengthen the distractors. Never shorten the answer.** A distractor that states a full wrong *reason* is both longer and more diagnostic than a bare wrong label — this improves the item as well as removing the cue. Never make the keyed answer arguable to save characters; an answer that becomes debatable is a worse defect than the tell.
2. **Count the characters on all twelve choices and report the count. Do not eyeball it, and do not try to drive it to zero.**

   **The target was never zero. It is "not far above chance."** With four choices, the key is the longest one **25% of the time by chance** — that figure is arithmetic, not a measurement. The shipped defect ran **67% to 94%** (shipped measurement, multi-course sample). The gap between 25% and 67% is the defect; the gap between 25% and 0% is a second defect, because a course driven to zero is beaten by the exact inverse strategy — never pick the longest — and that replaces one tell with another.

   So **the count is a diagnostic to report, not a score to minimise.** Some keys will legitimately be the longest choice, because a correct answer often needs a qualifying clause in order to be correct. That is fine and you should leave it alone. **Never grow a distractor past the point of honesty to force the count down, and never trim a key** (rule 1 already forbids the second one).

   What is unchanged, and is the part that actually matters, is the **per-item discipline**: give every distractor the same care you gave the key, and never construct a key to be the longest *because* it is the key. Do that honestly and the count lands where it lands.
3. **The statistic is only meaningful in aggregate, and your file is not the unit.** Three items cannot distinguish chance from bias. Under pure chance a three-item file shows 0 or 1 long keys about 84% of the time, 2 about 14% of the time, and 3 about 1.6% of the time — so **a count of 2 tells you almost nothing, and even 3 is weak evidence on its own.** The real measurement is the course-level rate across all 40 files and 120 items, and it is taken at registration, not by you. Roughly a quarter — about 30 of 120 — is the expected place to land. Well above that is the defect DF-3 describes. Near zero across a whole course means the agents over-corrected. Report your number and move on; do not tune your file to hit an aggregate you cannot see. The two Grade 8 exemplars will be measured the same way at review and their numbers reported as diagnostics; they are not targets, and no Grade 8 number exists yet to copy.

4. **Do not overcorrect into "shortest is always right"** — that is the same tell inverted, and it is the mistake the first attempt at fixing the sibling defect made.
5. **The cheapest fix is usually parallel structure.** Where the four choices are the same kind of thing, writing them to the same shape tends to flatten the length spread, because the choices then differ only in the words that vary. In this course the natural shape is four numbers with the same unit clause — *"350 people per square kilometer"*, *"250 people per square kilometer"*, *"600 people per square kilometer"*, *"1,200 people per square kilometer"* — or four verdicts each carrying a reason of the same shape. **But parallel structure does not guarantee parity, and you must still count.** Four numbers come out equal only when they have the same number of digits; put `600` and `1,200` in the same slot and the spread is back, and a verdict key with a reason next to three bare verdicts is the DF-3 defect in its purest form. Treat parallel structure as a technique that usually helps, never as an exemption from measuring.

### DF-1 — the correct answer must not always sit at `a`
**Shipped measurement — large sample.** Measured across eight shipped courses: `correct: true` sat at position `a` far more often than chance and at `d` almost never (Algebra 1: `a` 54 times, `d` **zero**). No gate catches it.

**The rule, and it is mechanical so that the 40 files come out flat without anyone coordinating:**

> Your three `correct: true` choices must sit at **three different ids**. The one id you leave out is fixed by your row number: take `(u + t) mod 4` and omit the id at that index of `[a, b, c, d]`.

Worked: row 7.1 → `(7 + 1) mod 4 = 0` → omit `a`, so the three correct answers sit at `b`, `c`, `d` in whatever order suits the items. Row 1.1 → `(1 + 1) mod 4 = 2` → omit `c`, so they sit at `a`, `b`, `d`. Both exemplars follow this. Applied across all 40 rows it lands each id as the correct answer exactly 30 times out of 120 — flat by construction. One Grade 8 hazard: when the four choices are four numbers, do not sort them in ascending order and then place the key — a sorted numeric list pins the key's position to its size. Order numeric choices so the id rule above is satisfied, and never by magnitude.

**A first draft that counts high is a normal outcome, not a sign that you have misread the rule.** These defects fall out of honest authoring — a correct prose answer has to be fully qualified, a distractor only has to be wrong — so expect a high count on the first pass. When it happens, go back to the ITEMS and ask the per-item question: did I give each distractor the same care as the key? Usually the answer is no, and fixing that is the whole job. Fix the items, never the measurement: do not re-count only the items that pass, and do not decide your row is a special case where the cue does not matter. Measuring a bad draft and then adjusting the measurement is the one way to make this worse than not measuring at all. Equally, do not keep editing a set of honest items just to push a number down — see rule 2.

Never name a choice by its letter inside a `problem`, a `hint` or another choice ("option b is wrong because..."). It pins the item to a position and makes it unfixable later without rewriting the prose.

---

## THERE ARE NO IMAGES AND NO MAPS ON SCREEN
The tutor speaks and writes on a whiteboard. The student is not looking at a map, a choropleth, a satellite image, a layer stack, a pyramid or a graph. **Every map, table, graph and image in this course is DESCRIBED in prose**, and the signed curriculum wrote all 40 rows on that basis — the "choropleth" in 1.2, the "overlay" in 2.1, the "transect" in 3.1, the "pyramid" in 5.1 and the "series" in 7.2 are all descriptions the student reads.

- **Never** write "look at the map", "using the chart above", "in the figure", "as you can see here", "the shaded region".
- Where an item needs a map, **describe it in words**: *"A described county is split into four districts. The two northern districts are colored in the darkest class, which the key says means 40 or more per 1,000. The two southern districts are in the lightest class, under 10 per 1,000."*
- Where an item needs a table, a graph or a series, **write the rows out**, and keep them small enough to read aloud: *"Ardent: 4,200 people, 12 square kilometers. Belmar: 3,000 people, 5 square kilometers. Corris: 9,000 people, 60 square kilometers."* Three to six values is a described table; more than that is a memory test.
- Where an item needs a layer overlay, a buffer or a coastline, describe the geometry in plain sentences with distances: *"A river runs east to west across the town. Parcel 1 is 150 meters north of it, parcel 2 is 400 meters north, parcel 3 is 50 meters south. The setback rule is 200 meters."*
- No `passageId`. Every item must be solvable from what is printed inside it.

---

## Register — write for a thirteen- or fourteen-year-old
- Hooks come from a thirteen/fourteen-year-old's world: a headline about a flood or a wildfire, a phone with no signal in one part of town, a bus route that skips a neighborhood, a family that moved for a job, a part-time job's pay per hour, a sports league's travel schedule, the resource map in a strategy game, a school being built on one site and not another, a price that went up when a strait closed. **NEVER** exams, college, careers, or "you will need this later".
- Longer sentences are fine. Abstraction is fine when it is anchored to the described data in the same paragraph. Two ideas per sentence is fine when the second depends on the first. Do not talk down: a thirteen-year-old can hold "the claim is about people, so the denominator has to be people" without a cushion around it. Re-read the two shipped Grade 7 seeds the curriculum names (`m7geo-u3-population-distribution-and-density.ts`, `m7geo-u7-latin-america-economy-and-cities.ts`) to hear what one grade below sounds like, then go one notch up — same directness, more assumed, more asked.
- **No contractions anywhere in authored prose.** Write "does not", "cannot", "it is". This applies to every text field: `script`, `keyIdeas`, `goal`, `vocabulary` definitions, `steps`, `problem`, `answer`, `hints`, every `misconception_check` field (`question`, `answer`, `misconception`, `correctsTo`), and `recap.mustRemember` — not just the ones where it is most visible. Possessives are fine ("Canada's population" is not a contraction).
- **Straight quotes only** — no curly quotes anywhere in the file. Use `\'` inside a single-quoted string, or switch that string to double quotes, as the shipped seeds do.
- **US spelling and US conventions throughout.** Metric units are correct for physical geography and for rates (square kilometers, hectares, meters — not kilometres); nautical miles are correct in row 9.2 because the zones are defined in them; US customary units are fine where a row's context calls for them. Write thousands with a comma (`4,200`; `per 1,000 people`) and percentages either as `35 percent` or `35%`, consistently within one file.
- Currency, if a row ever needs it (rows 6.1, 8.1, 9.4 and 10.2 may), is written plainly — `$12`, `$4.50` — with **no escaping of the dollar sign**. The `\$` escaping rule belongs to study guides, not lesson seeds; every shipped production seed writes it plainly.
- **The minus-sign rule, scoped precisely.** Every **minus sign and negative number** uses ASCII hyphen-minus (U+002D, the `-` key). **Never the Unicode minus sign U+2212 ("−")** — there is no normalization in the answer-comparison path to rescue it, and the shipped Grade 7 seeds you are told to mine do mix it into prose. In this course it bites in more places than it did in Grade 7: **a temperature departure below the baseline** (row 7.2: write `-0.4 degrees`, not `−0.4`), **a negative net migration** (rows 4.2 and 5.3: `-1,200 people`), **a decline in a land-cover class** (row 2.4: `-300 hectares`), and any signed change in a series. Latitude and longitude written with a sign do not appear in this course at all.
  **This rule is about the minus sign only.** `×` (U+00D7), `÷` (U+00F7) and the em dash `—` are correct where they occur and must not be "fixed", stripped or ASCII-ified — sixteen shipped production seeds use them deliberately, and the risk formula in row 7.1 is naturally written with `×`. When you run the pre-finish sweep, **hunt U+2212 specifically, not non-ASCII generally.** A blanket non-ASCII sweep is itself a defect.
  House style for an aside dash *inside authored strings* in this course is a double ASCII hyphen `--`, matching the shipped `m7geo-*` files. Em dashes are fine in the doc comment at the top of the file, which is never spoken.
- **Label wrong-vs-right examples explicitly** (`WRONG: ... CORRECT: ...`) so a tutor reading aloud can never present an error as a model.
- No rhetorical throat-clearing. No "In this lesson we will explore...". Start with the thing.

---

## No problem-bank items — that is scripted, not authored
Do not write, edit, or propose problem-bank items. Bank items for this wave are SCRIPTED via `generate-bank-items.ts`, not agent-authored. Your only deliverable is the one seed file for your row; the `Bank dir` (`src/data/problem-bank/grade-8-world-geography/`), `Portal key` (`GRADE_8_WORLD_GEOGRAPHY`), `Bank item ids` (`m8geo-<slug>-NNN`) and `difficulty spread` (`1,2,2,3,3,4`) fields in `m8geo-CURRICULUM.md`'s header belong to that separate scripted step and are not your concern.

---

## Content scope — stay inside your row, above Grade 7, and below the courses above
An authoring agent must not bleed into an adjacent topic's scope — neither sideways into a neighboring Grade 8 row (do not start computing risk while writing the *hazard regions* row 3.4 — risk is 7.1; do not start scoring sites while writing the *buffers* row 2.2 — scoring is 2.3; do not work comparative-advantage arithmetic while writing the *economic regions and trade* row 4.4 — that is 8.1; do not estimate doubling time while writing the *pyramids* row 5.1 — that is 5.2) nor downward into re-teaching the Grade 7 mechanism (the Depth Floor above) nor upward into the named models below.

The signed curriculum's **"Explicitly excluded"** list is the authoritative upper boundary. Its shape is **vertical by depth**: each item is a theme this course *does* touch, listed with the depth or the named model this course stops short of and the file that owns it. Read it before writing. Reproduced here:

- The stage-numbered **demographic transition model** — this course reads pyramids and dependency (5.1) and evaluates projections (5.2); the model is AP Human Geography `ap-human-geo-population.ts`.
- **Urban-structure models** (concentric zone, sector, multiple nuclei) and gentrification — this course measures urban form and evaluates a growth proposal (4.3, 10.2); the models are `ap-human-geo-urban.ts`.
- **Agricultural land-use models** and the formal agricultural-systems typology — this course compares two described systems on data (6.4); the models are `ap-human-geo-agriculture.ts`.
- **State / nation / nation-state** and supranational-organization analysis by name — this course analyzes dispute cases and cooperation design (9.1, 9.3); the typology is `ap-human-geo-political.ts`.
- **Industrial-location theory by name** — this course decides a described siting on factors (8.3); the theory is high-school / AP.
- **The greenhouse mechanism beyond define depth, and attribution** — this course reads climate trend data (7.2) and, by the 2026-09-03 ruling, carries a one-paragraph mechanism at define depth in that row only (sunlight warms the surface, the surface gives off heat, certain gases hold some of it in, more gas holds more heat); no radiative-forcing arithmetic and no attribution debate anywhere. No MS science course currently owns the mechanism (`m6sci` 10.1-10.2 give the carbon cycle and the evidence only; `m8sci` excludes climate by design).
- **Hazard physics and forecasting** (how a hurricane, tornado or earthquake happens; weather-map forecasting) — this course maps hazard regions and evaluates risk (3.4, U7); the physics is `m6sci` U6 and U9 (`how-air-mass-interactions-produce-severe-weather`, `forecasting-and-preparing-for-weather-hazards`) and plate mechanics G7 2.2 (`m7geo-u2-plate-tectonics-and-natural-hazards.ts`).
- **Water-cycle and groundwater mechanics** — this course allocates a described basin's flow (6.1); the mechanism is `m6sci` U7 (`the-water-cycle-groundwater-and-runoff`).
- **Population ecology and ecosystem carrying capacity as biology** — this course computes a footprint balance (6.3); the biology is `bio-u9-population-community-ecology.ts` and `bio-u9-ecosystems-biomes.ts`.
- **Exponential-function notation** for growth — this course uses the rule of 70 (5.2); the algebra is Algebra 1 (`alg1-u6-exponential-functions.ts`, `alg1-u6-exponential-growth-decay.ts`), and `m8math-CURRICULUM.md` withholds exponential functions from Grade 8 by name.
- **Statistical inference** (significance, sampling) and the formal names of the aggregation fallacies (ecological fallacy, modifiable areal unit problem) — this course works scale-of-analysis arithmetic (1.3); the statistics belong to a high-school or AP statistics course.
- **GIS software procedures, spectral classification and remote-sensing algorithms** — this course reasons over layers, buffers and described land-cover data (U2); the software is a high-school GIS elective.
- **Any chronology**: settlement eras, wars, presidencies, immigration eras, industrialization, treaties by name — this course reads present-day patterns and, where history explains a pattern, says so in one clause; the history is `ap-apush-*`, `whist-*`, and the legacy `g8-ss-*` seeds (`g8-ss-westward-expansion.ts`, `g8-ss-immigration-industrial.ts`, `g8-ss-industrial-revolution*.ts`, `g8-ss-civil-war*.ts`, `g8-ss-american-revolution.ts`, `g8-ss-progressive-era.ts`). **This course is geography, not history.** If your North America row is turning into a timeline, you have missed your row.
- **Civics** (rights, responsibilities, participation in government) — touched nowhere here; G7 6.2 `m7geo-u6-citizenship-and-rights.ts` and legacy `g8-ss-civics-rights-responsibilities.ts`.
- **Culture, language and religion at Grade 8 depth** — deliberately not built (curriculum sign-off #4); G7 U4 owns first exposure (`m7geo-u4-*.ts`), and a deeper pass is AP Human Geography's cultural unit (no seed exists yet; `UNVERIFIED`).
- **Trade policy, tariffs, exchange rates, and any named trade agreement or live dispute, blockade or conflict** — this course quantifies interdependence, chokepoints and dispute causes on described data (4.4, 8.1, 9.1, 9.4); policy and current events are out of the course entirely at any grade, per accuracy rules 2 and 6.

And the lower boundary, stated once because a list cannot carry it: **the Grade 7 mechanism your scope line names is assumed, in one clause, and never re-taught.** Below that line sit the 40 `m7geo-*` seeds and, two levels down, the 40 `m6geo-*` seeds (define / identify / classify / locate). Neither is your depth.

If your row's own scope description in the table below explicitly asks for something on the excluded list (it will not, with the single ruled exception of row 7.2's define-depth greenhouse paragraph, which its scope line states), the table wins and your report says so — but check first that you have not simply reached past your row's stated scope into the next course's territory, which is the single most common failure mode salvage material introduces.

---

## Salvage — mine these, never edit or import them

| Source | Notes |
|---|---|
| `m7geo-u*.ts` (40 shipped Grade 7 World Geography seeds) | The closest prior art and the best source for exact segment shape, pacing, phrasing register and the no-maps technique. **Every one of them is written one full level BELOW your floor** — Grade 7 teaches the mechanism from zero; your row assumes it. Copy structure and voice; **never copy scope, and never copy a keyIdea** — a Grade 7 keyIdea in a Grade 8 file is the re-teaching defect this course exists to avoid. Read the Depth Floor section again before you open one. The two most useful for register are the ones the curriculum's Grounding line names: `m7geo-u3-population-distribution-and-density.ts` (concept shape; note how it works an invented country's numbers in a worked example, which is your floor, not your ceiling) and `m7geo-u7-latin-america-economy-and-cities.ts` (regional shape; note the rank-versus-risk discipline, which you keep). Also the seed your own scope line names as the row you deepen. |
| `m6geo-u*.ts` (40 shipped Grade 6 World Geography seeds) | Two full levels below your floor (define / identify / classify / locate). Useful only to see the `SCOPE GUARD` convention and the claim-ledger discipline in a file; **never copy content or register** — they are written for eleven-year-olds. |
| `ap-human-geo-population.ts`, `-urban.ts`, `-agriculture.ts`, `-political.ts` (4 AP Human Geography seeds, grade 11) | One level ABOVE your row. Open only to confirm what you stop short of (the named models in the excluded list); **never mine content, examples or vocabulary from them.** |
| `g8-ss-*.ts` (10 legacy seeds: American Revolution, civics, Civil War ×2, French Revolution, immigration & Gilded Age, Industrial Revolution ×2, Progressive Era, westward expansion), `g7-ss-*.ts` (9: Mesopotamia, Ancient China, Ancient India, Ancient Greece, Roman Empire, Middle Ages, Renaissance ×2, Age of Exploration) and `g6-ss-*.ts` (3: Ancient Egypt, Byzantine & Islamic, Feudalism) | **All 22 are history or civics** (`topic: 'us-history'`, `'civics'`, `'world-history'`) — off-topic for this course at any grade (see the excluded list). The curriculum opened the two nearest (`g8-ss-immigration-industrial.ts`, `g8-ss-westward-expansion.ts`) and found chronologies of 19th-century immigration and expansion; nothing in them carries forward into row 4.1 or 4.2. **Do not mine them, never edit, import from, or extend them**; they live under a separate legacy id space. |
| `g4-ss-us-regions.ts` (Grade 4, `topic: 'us-geography'`) | The lower neighbour of row 3.1: identifies US regions by location, climate and resources at identify depth. Row 3.1 must stay well above it; open it only to confirm you have. |
| `bio-u9-population-community-ecology.ts`, `bio-u9-ecosystems-biomes.ts` (HS Biology) | Background for row 6.3 only, at HS register and as biology. Level it sideways into a footprint balance, not down; the population-ecology mechanism stays there. |
| `alg1-u6-exponential-functions.ts`, `alg1-u6-exponential-growth-decay.ts` (Algebra 1) | Named only so row 5.2 knows what it must not use: no exponential notation. Do not mine. |

The curriculum's per-row **Salvage** column reads `none` for all 40 rows — the curriculum verified that all 22 legacy `g[678]-ss-*` files are history or civics and that no `g[678]-geo-*` file exists, so there is no existing Grade 8 geography content in this codebase to reuse. Everything you write is new.

---

## The full course chain (for prerequisites / followUps)
`prerequisites` = [loId of the PREVIOUS row]; `followUps` = [loId of the NEXT row]. Row 1.1 has `prerequisites: []`; row 10.4 has `followUps: []`. Every other row populates BOTH arrays with the true previous-row and next-row loIds from the table below — always, no exceptions. The chain runs straight through unit boundaries: row 6.4's followUp is `m8geo.hazard-risk-exposure-and-vulnerability` (row 7.1), and row 7.1's prerequisite is `m8geo.food-systems-and-food-security` (row 6.4). All loIds are `m8geo.<slug>`.

**Do not copy the two exemplars' empty `prerequisites: []` / `followUps: []` if they ship that way.** `lint-ms-plans` rejects a chain reference that does not resolve to an already-registered LO, and the exemplars are registered first and alone, before their neighboring rows exist — a lint artifact of registration order, not the pattern to follow. All 40 lessons are registered together in one controller commit, and the exemplars' chain fields are wired to their real neighbors at that same time. Write your row's real previous/next loIds from the table now; never worry that a target does not yet exist on disk.

| # | Slug | Title | Standard (prose only) |
|---|---|---|---|
| 1.1 | counts-rates-and-fair-comparison | Counts, Rates & Fair Comparison | NGS 1 — **(exemplar — written)** |
| 1.2 | evaluating-a-choropleth | Evaluating a Choropleth Map | NGS 1 |
| 1.3 | scale-of-analysis-and-hidden-patterns | Scale of Analysis & Hidden Patterns | NGS 3 |
| 1.4 | maps-as-arguments | Maps as Arguments | NGS 1 |
| 2.1 | gis-layers-and-overlay | GIS Layers & Overlay Reasoning | NGS 1 |
| 2.2 | buffers-and-proximity | Buffers & Proximity Analysis | NGS 3 |
| 2.3 | site-selection-with-weighted-criteria | Site Selection with Weighted Criteria | NGS 3 |
| 2.4 | change-detection-from-satellite-data | Change Detection from Satellite Data | NGS 14 |
| 3.1 | north-america-landform-regions | North America: Landform Regions | NGS 4 |
| 3.2 | north-america-climate-controls-in-action | North America: Climate Controls in Action | NGS 7 |
| 3.3 | north-america-river-systems-and-watersheds | North America: River Systems & Watersheds | NGS 7 |
| 3.4 | north-america-hazard-regions | North America: Hazard Regions | NGS 15 |
| 4.1 | north-america-population-patterns | North America: Population Patterns | NGS 9 |
| 4.2 | north-america-migration-flows | North America: Migration Flows | NGS 9 |
| 4.3 | north-america-metropolitan-regions | North America: Metropolitan Regions & Urban Form | NGS 12 |
| 4.4 | north-america-economic-regions-and-trade | North America: Economic Regions & Trade | NGS 11 |
| 5.1 | population-pyramids-and-dependency | Population Pyramids & Dependency | NGS 9 |
| 5.2 | evaluating-population-projections | Evaluating Population Projections | NGS 9 |
| 5.3 | migration-flows-and-their-effects | Migration Flows & Their Effects | NGS 9 |
| 5.4 | refugees-and-displacement | Refugees & Displacement | NGS 13 |
| 6.1 | water-scarcity-and-allocation | Water Scarcity & Allocation | NGS 16 |
| 6.2 | comparing-energy-sources | Comparing Energy Sources | NGS 16 |
| 6.3 | carrying-capacity-and-ecological-footprint | Carrying Capacity & Ecological Footprint | NGS 14 |
| 6.4 | food-systems-and-food-security | Food Systems & Food Security | NGS 16 |
| 7.1 | hazard-risk-exposure-and-vulnerability | Hazard Risk: Exposure & Vulnerability | NGS 15 — **(exemplar — written)** |
| 7.2 | reading-climate-trend-data | Reading Climate Trend Data | NGS 7 |
| 7.3 | coastal-risk-and-sea-level | Coastal Risk & Sea-Level Change | NGS 15 |
| 7.4 | mitigation-adaptation-and-resilience | Mitigation, Adaptation & Resilience Planning | NGS 18 |
| 8.1 | specialization-and-supply-chain-risk | Specialization & Supply-Chain Risk | NGS 11 |
| 8.2 | composite-indicators-and-inequality | Composite Indicators & Inequality | NGS 11 |
| 8.3 | where-factories-locate | Where Factories Locate | NGS 11 |
| 8.4 | connectivity-and-the-digital-divide | Connectivity & the Digital Divide | NGS 11 |
| 9.1 | analyzing-a-boundary-dispute | Analyzing a Boundary Dispute | NGS 13 |
| 9.2 | maritime-zones-and-ocean-boundaries | Maritime Zones & Ocean Boundaries | NGS 13 |
| 9.3 | transboundary-problems-and-cooperation | Transboundary Problems & Cooperation | NGS 13 |
| 9.4 | chokepoints-and-strategic-location | Chokepoints & Strategic Location | NGS 13 |
| 10.1 | building-a-geographic-argument | Building a Geographic Argument from Data | NGS 18 |
| 10.2 | evaluating-a-land-use-plan | Evaluating a Land-Use Plan | NGS 18 |
| 10.3 | comparing-two-regions-with-indicators | Comparing Two Regions with Indicators | NGS 5 |
| 10.4 | scenario-analysis-for-a-changing-place | Scenario Analysis for a Changing Place | NGS 18 |

**What goes in `los[0].description`, `goal` and the `SCOPE GUARD`** (carried from the Grade 6 sibling contract's 2026-09-02 clarification, which three agents had needed, and re-derived for this course's scope-cell shape). `LessonPlan` has no plan-level `goal`/`scope` field, and the segment `goal` fields are short per-segment purpose lines, not the place for the scope sentence. Every Grade 8 scope cell has THREE parts: (i) the **positive statement** of what the student does with described data ("Given a described table of counts and land areas ... convert counts into rates ... and decide which comparison a stated claim actually needs, identifying when a raw count misleads"); (ii) the **lineage clause** ("Deepens G7 3.1 `m7geo-u3-...`, which taught that ...; G8 adds ..."); (iii) the **withheld clause** ("Not yet ...", "... is withheld — `ap-human-geo-...`"). What this rule requires:

- **`los[0].description` carries part (i) verbatim**, followed by the NGS citation in the form the shipped Grade 7 seeds use — `(National Geography Standard 9: the characteristics, distribution and migration of human populations on Earth surface)`. Where part (i) is one sentence whose positive and excluding halves do not separate cleanly, carry the row's wording verbatim and mirror the exclusion in the `SCOPE GUARD` as well; do not surgically rewrite a signed scope line to obey this note.
- **Parts (ii) and (iii) never appear in the description or any spoken field.** They are the lineage and the boundary; both go in the `SCOPE GUARD`, where the "Never mention Grade 7" rule allows them. A description containing "Deepens G7" or "Grade 7" is a defect.
- Each segment's `goal` is its own short purpose line anchored to part (i).
- Read the row's whole scope cell before writing any of the three; do not shorten part (i) into just the title. **Addendum (2026-09-03, from the exemplar authors):** words in part (i) that describe the AUTHORING or the ITEM rather than the skill are dropped from `los[0].description` while copying — "invented" (as in "for several invented places"), "described" as a qualifier ("a described table" → "a table"), "written out in words", "from choices", "picking the correctly stated result", "assessed as …", and any parenthetical that cites a sign-off or a sibling row. They remain binding on how you WRITE the item. The description a student reads names the skill and the material, not the authoring convention. **Second addendum (same day, from the science and geography exemplar authors):** ALSO drop from the description any parenthetical or clause that refers to the curriculum's own structure — "from 6.4", "(first of three lessons sharing MS-PS2-2, split by law)", "(shares … with Topic 3)", "(the stage-two half of …)", "see sign-off N", "row 6.2" — a student never sees the curriculum table. And convert an em dash inside the description to ` -- ` (the shipped `m6sci`/`m7sci` descriptions all use ` -- `; keep the surrounding words). Cite the standard ONCE, at the end.

## Real standards go in PROSE only
Geography has no single national standards body, so this course cites the **National Geography Standards** (*Geography for Life*) by number **and name**, inside the LO `description` sentence, the way the shipped Grade 7 seeds do. The `standard` FIELD is always `M8GEO-<u>.<t>` and must never contain an NGS code or the substrings `frq|dbq|leq|saq`. The arithmetic this course asks for sits inside CCSS Grade 6–7 ratio and proportional reasoning (6.RP, 7.RP) and never reaches 8.F or Algebra 1's exponential functions; that too is prose-only, and it is a ceiling on the arithmetic, not a code to cite.

The standards this course uses, with the wording to put in your description:

| Code | Name to cite in prose |
|---|---|
| NGS 1 | how to use maps and other geographic representations to acquire, process and report information |
| NGS 3 | how to analyze the spatial organization of people, places and environments |
| NGS 4 | the physical and human characteristics of places |
| NGS 5 | that people create regions to interpret Earth's complexity |
| NGS 7 | the physical processes that shape the patterns of Earth's surface |
| NGS 9 | the characteristics, distribution and migration of human populations on Earth's surface |
| NGS 11 | the patterns and networks of economic interdependence on Earth's surface |
| NGS 12 | the processes, patterns and functions of human settlement |
| NGS 13 | how the forces of cooperation and conflict among people influence the division and control of Earth's surface |
| NGS 14 | how human actions modify the physical environment |
| NGS 15 | how physical systems affect human systems |
| NGS 16 | the changes that occur in the meaning, use, distribution and importance of resources |
| NGS 18 | how to apply geography to interpret the present and plan for the future |

These codes are coarse — 18 numbers cover the whole discipline — so several rows legitimately share one (NGS 13 carries all four Unit 9 rows; NGS 11 carries all four Unit 8 rows plus 4.4). NGS 2, 6, 8, 10 and 17 are deliberately unused in this course (17, geography to interpret the PAST, by the no-history rule). The non-overlapping boundary lives in your row's Scope cell, not in the code.

---

## Before you finish
You cannot run the full lint (it selects all MS plans and will report other units' in-flight state, and your file is not registered yet). Instead:

1. `cd apps/tutor && npx tsc --noEmit` — must be clean, 0 errors. This catches every type and syntax mistake, and a file that does not compile is the one failure the registration pass should never have to find for you.
2. **Run the five Depth Floor tests on your draft.** Test 5 in particular: open the Grade 7 file your scope line names and read your sentences next to it; then read its keyIdeas and confirm none of yours restates one.
3. **Build the three-column claim ledger now, before you call the file done, and write the third column honestly.** Go through every factual claim about the real world AND every computed figure one at a time — including those inside distractors, hints and misconception corrections — and write down why you are confident it is true, with the arithmetic where there is arithmetic. Any row whose third column comes out as a hedge is a lesson defect: go back and swap the example, cut the claim, or verify it properly. Do not ship a claim with a hedge.
4. **Recompute every number in the file by hand, and confirm each computation is inverted once somewhere in the file.** A rate multiplied back by its denominator recovers the count; a doubling time multiplied by the rate recovers 70; percentages in bands sum to 100.
5. Re-read the nine accuracy and sensitivity rules and check your file against each. If your row is in Unit 3 or 4, do rule 9 claim by claim.
6. Re-read your file aloud as a thirteen- or fourteen-year-old would hear it. Any described table you cannot hold in your head after one reading is too big; any sentence you stumble on is too long.
7. Re-check every MCQ: is `expectedAnswer` byte-identical to the `correct: true` choice's `text`? Is that choice the only defensible one? Can you name in one sentence the wrong STEP behind each of the other three? Are numeric choices ordered by the id rule and never by magnitude?
8. **Count characters on all twelve choices and record how many of your three items have the key as the strictly longest choice.** This number goes in your report as a diagnostic; there is no per-file threshold to pass, because three items cannot distinguish chance from bias (chance alone produces 0 or 1 about 84% of the time). If the count is 2 or 3, re-read those items and ask whether each distractor got the same care as the key — usually it did not. Lengthen distractors only where doing so makes them more diagnostic; never shorten a key, and never pad a distractor past honesty to move the number.
9. Confirm your three correct choices sit at three different ids, and that the omitted id is the one `(u + t) mod 4` gives.
10. Confirm segment order, `keyIdeas` count (4–6), three MCQ `try_yourself` segments with **zero** numeric, 2 hints each, `estimatedMinutes` on every segment summing within 1 of the plan value.
11. Confirm `prerequisites`/`followUps` carry the real previous-row and next-row loIds from the chain table — not empty arrays.
12. Search your file for the Unicode minus sign "−" (**U+2212 specifically**) and for curly quotes, and replace them. Both are easy to introduce by copy-pasting from a salvage seed, and this course writes negative numbers in four different rows. **Do not run a blanket non-ASCII sweep** — `×`, `÷` and the em dash are legitimate and must survive it.
13. Search your authored prose for contractions (`'s` in a verb position, `'t`, `'re`, `'ve`, `'ll`) and remove them. Possessives stay.
14. Search every spoken field and `los[0].description` for "Grade 7", "Grade 6", "G7", "last year", "already know", "Deepens" — none may appear outside the doc comment.
15. **Re-read your own `SCOPE GUARD` against the finished body, clause by clause.** Take each claim the guard makes and find the evidence for it in the file. If the guard says "re-teaches neither", grep the keyIdeas for the mechanism's definition. If it says "names NO stage of the demographic transition model", grep for "stage". If a clause is not literally true of what you actually wrote, fix the clause or fix the body — a false guard is worse than no guard, because the next agent trusts it. Check that the guard names the mechanism you assume (and the Grade 7 seed file), the analysis you add, the model above you stop short of (and its owning file), and what you deliberately allowed and why.
16. Confirm no item refers to a map, chart, layer, image, pyramid or figure the student cannot read in words.

Do NOT commit. Do NOT edit `store.ts`. The controller registers all four courses' plans in one batch, runs `npm run lint:ms-plans`, and commits.

## Report back
Return: the file path you wrote; your row number, slug and export symbol; **the three-column claim ledger** (claim, where it appears, why you are confident it is true), which the geography review pass reads, spot-verifies and re-computes — including every arithmetic step and the claims embedded in your distractors, hints and misconception corrections, and a note of any lesson defect the third column made you go back and fix; the ids of your three correct choices; the character length of every choice in each item, and how many of your three items have the key as the strictly longest choice (a diagnostic for the course-level aggregate taken at registration, not a score you were asked to minimise); which of the five Depth Floor tests was closest to failing and what you cut or added to pass it — in particular, which keyIdea came closest to re-teaching the Grade 7 mechanism; whether your row is concept-led or procedure-led and which exemplar you shaped it on; which check-move variant each worked example uses, or the equivalent you invented; and anything a reviewer should double-check.

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


> **PORTED 2026-09-04 from `m8ela-FANOUT-CONTRACT.md`, where rulings 16-31 were earned.**
> Rulings 16-20 were already in this file. The blocks below add 21-31. Every example cited
> is from an ELA row -- the RULES generalise, the EXAMPLES do not, and ruling 24 has been
> re-derived for this subject because ELA's answer is the wrong one here.
>
> ⚠️ **READ EVERY CHECKLIST CROSS-REFERENCE BY NAME, NOT BY NUMBER.** The ported rulings say
> things like "item 13 tells you 0 of 3 is not the goal" and "clarifying item 14" -- those are
> the ELA contract's numbers and they do not point at the same items here. THREE agents hit
> this independently on the first science batch: one found the numbers pointed at unrelated
> rules, two found they pointed past the end of the list. In THIS contract the DF-3 length
> check is **6c** and the claim-ledger build is **12 of the report section** (note that 12 in
> the science-accuracy list is a different, unrelated rule about particles). Where a ported
> ruling extends an "all-fiction ledger exemption" (25 and 29), this contract has no such
> exemption -- it already requires the full ledger unconditionally, so those rulings are a
> no-op here rather than a loosening.

## Addenda — CONTROLLER RULINGS 2026-09-04 (second Opus batch, rows 5.1-6.4)

21. **Dual-code rows: cite once, at the end.** Some scope cells embed their standard
    codes mid-sentence ("(L.8.2a)", "(L.8.2b)"). Copying part (i) verbatim AND appending
    the citation would then cite twice or three times. Drop the inline codes while
    copying and append one parenthesis at the end listing both: `(CCSS L.8.2a, L.8.2b)`.
    Rows 1.1 and 6.4 reached this convention independently; it now also binds 7.1, 9.3,
    9.4 and 10.3.

22. **No specimen may be shared between a TEACHING segment and an ITEM.** Row 5.2's
    author found its concept `keyIdeas` using the exact sentence and answer of its own
    try_yourself 3, which made the file's hardest item answerable by recall rather than
    by the skill, and a `WRONG:`/`CORRECT:` specimen identical to item 1's choice a,
    which eliminated one distractor for free. Neither is visible to any gate.

    **CORRECTED 2026-09-04 after row 7.1 flagged it too broad.** The mechanism is
    leakage into an assessed item, so the rule binds only where a specimen crosses
    that line: no `try_yourself` stem, choice or answer may also appear in the hook,
    concept, worked examples, recap or misconception check. Two TEACHING segments
    sharing a specimen is fine and is house style -- the procedure-led exemplar
    `m8ela-u5-active-and-passive-voice.ts` shares one between concept keyIdea 3 and
    recap line 3, and a recap restating an error the concept already labelled cannot
    leak anything. Before you finish, list every specimen in your items and confirm
    none of them appears in a teaching segment.

23. **`WRONG:` where neither form is an error.** Rows whose subject is a CHOICE between
    two correct forms (6.2 voice-and-mood-for-effect is the clear case; 6.1 is shifts-in-voice-and-mood) cannot label a
    grammatical sentence a bare `WRONG:` without installing the very rule the contract
    forbids inventing -- "the passive is always wrong". Use `WRONG FOR THIS EFFECT:`
    beside its `CORRECT:`, and say so in the NOTE. **CORRECTED 2026-09-04:** this ruling
    originally claimed such a label "still matches a reviewer's grep for `WRONG:` because
    the string is a prefix". That is FALSE and was my error -- the colon sits after
    EFFECT, so `WRONG FOR THIS EFFECT:` does not contain the substring `WRONG:`. See
    ruling 28 for the review grep that actually works. Keep bare `WRONG:` for genuinely
    non-standard forms.

24. **The em dash in `los[0].description` is decided PER SUBJECT, and GEOGRAPHY HAS NO
    PRECEDENT EITHER WAY.** Measured: across 19 shipped m6geo descriptions, the em dash
    appears ZERO times and ` -- ` appears ZERO times -- the question has simply never come
    up, because those descriptions never needed a dash. So this ruling rests on nothing
    observed in your own subject. Use ` -- `, for consistency with the other non-ELA middle
    school courses (science measured 7 to 0 in its favour), and know that you are following
    a sibling subject rather than a precedent of your own. Better still: write the
    description so it does not need a dash. (ELA measured the OPPOSITE way, 24 em dashes to
    zero, and its contract carries the opposite ruling. **Re-run a precedent comparison
    inside your own subject AND artifact type; never inherit a sibling's measurement.**)

## Addenda — CONTROLLER RULINGS 2026-09-04 (third Opus batch, rows 7.1-8.4)

25. **Unit 7 vocabulary rows DO write a claim ledger, even though every scenario is
    invented.** Checklist item 14 exempts an all-fiction file and names only rows 2.3/2.4
    as exceptions. Three Unit 7 authors independently judged that wrong for their rows and
    wrote a full ledger anyway; they were right, and the exemption is hereby extended.
    A vocabulary row necessarily asserts **word senses, registers and etymologies**, and a
    student takes those as facts about English — "dough" for money, `-cred-` from *credere*,
    firm < persistent < resolute. Several such claims sit in DISTRACTORS, which is the case
    item 14 exists for: a false fact in a wrong answer reaches the student with no
    correction. Ledger every root, sense and register claim with a real source, never
    "widely stated". The invented people and settings stay STIPULATED as usual.

26. **Generalising ruling 23: the label must name the criterion the specimen fails.**
    Three rows in one batch hit cases a bare `WRONG:` would misrepresent, and each needed a
    different label, so the rule is not a fixed vocabulary — it is: **bare `WRONG:` is
    reserved for a form that is genuinely non-standard English.** Everything else names its
    criterion. Observed and approved: `WRONG FOR THIS EFFECT:` (6.2, where neither voice is
    an error), `WRONG FOR THESE FACTS:` / `WRONG FOR THIS PLACE:` / `WRONG FOR THIS
    PURPOSE:` (7.4, near-synonyms), `WRONG FOR A FORMAL ARGUMENT:` (8.4, register — where a
    bare label would teach "a contraction is always wrong in writing"), and `WEAK:`/
    `STRONG:` (8.3, for a sentence that is grammatical AND true but stops short of the
    move, which neither `WRONG:` nor `WRONG FOR THIS EFFECT:` fits). **NONE of these variants matches a grep for
    `WRONG:`** -- see ruling 28. Every row using any of them must say so in its NOTE. 8.4 also shows the strongest version of the move: it makes the
    over-generalisation the subject of its own misconception check.

27. **A curriculum cell containing U+2026 vs "copy verbatim".** Row 8.3's cell prints a real
    ellipsis inside its example phrase, which checklist item 9 bans from the file. Convert
    it to three ASCII periods while copying; "verbatim" governs the words, and item 9
    governs the glyph. Same shape as ruling 24 for the em dash, opposite conclusion,
    because the corpus and the ban point the same way here.

## Addenda — CONTROLLER RULINGS 2026-09-04 (fourth Opus batch, rows 4.4, 9.1-10.4)

28. **The `WRONG:` grep does not find the variant labels — my error, now measured.**
    Rulings 23 and 26 both asserted that `WRONG FOR THIS EFFECT:` and its siblings "still
    match a reviewer's grep for `WRONG:` because the string is a prefix". That is simply
    false: the colon sits after EFFECT, so the substring `WRONG:` never occurs. Row 4.4's
    author caught it and it measures out across the finished course — a `grep 'WRONG:'`
    hits 29 of 40 files and silently misses the labels in the other 11. **The review grep
    is `grep -E 'WRONG|WEAK:|VAGUE:'`** (no colon after WRONG), which finds all of them.
    Both rulings are corrected in place. Labels in use across the course: bare `WRONG:`,
    then FOR THIS EFFECT / THESE FACTS / THIS PLACE / THIS PURPOSE / THIS READER / THIS
    FORMAT / THIS SEARCH / THIS MAIN QUESTION / THIS POINT OF VIEW / THIS TIME SHIFT /
    A FORMAL ARGUMENT / A REFLECTION / A CONCLUSION, plus `WEAK:`/`STRONG:` and
    `VAGUE:`/`PRECISE:`/`STILL VAGUE:`.

    The general point is worth more than the fix: **I asserted a string property without
    running the string.** It is the same failure the wave keeps meeting from the other
    side -- a claim about an instrument, stated confidently, never executed. One grep
    would have settled it at the moment I wrote the ruling.

29. **Ruling 25 extends to Unit 9 and Unit 10.** Three more authors reached the same
    judgment independently: a row cannot be taught without asserting facts the student
    takes as facts about the world -- domain vocabulary and technical terms (9.2), how
    searching behaves (10.2), a citation format's order and punctuation (10.4), the
    real-world claims a research question presupposes (10.1). All wrote a full ledger
    despite the all-fiction exemption. **Any row whose subject matter is itself a claim
    about the world writes the ledger, whatever its scenarios are made of.** That is the
    rule; the unit numbers are just where it has been observed.

30. **Transforming a curriculum cell for a SPOKEN, student-facing field.** Three
    conversions are now settled, and they were each decided by re-measuring inside ELA
    rather than by inheriting a sibling subject's convention: the em dash becomes ` -- ` (ruling
    24, and see it for why that is the opposite of the ELA answer); U+2026 becomes three
    ASCII periods (ruling 27); and **U+2192 (`→`) becomes the word that says what the arrow is
    DOING in that sentence** -- an arrow read aloud in a voice session is silence, so it has
    to become a verb. ELA row 9.2 needed "becomes" for a transformation; in SCIENCE the arrow
    is usually the result of a computation and the verb is **"gives"**. Both first-batch
    science authors reached "gives" independently, for cells reading `60 m in 20 s -> 3 m/s`
    and `5 N left and 3 N right -> 2 N left`, where "becomes" is simply the wrong verb (and
    ungrammatical after a compound subject). **Related, and it collides with almost every
    science cell: bare unit abbreviations (`N`, `m/s`, `kg`) are expanded to words** when
    copied into `los[0].description`, because this course's unit rule forbids them in a
    spoken field -- the same class of transform, and the same resolution: "verbatim" governs
    the words, the form rules govern the glyphs. Also settled by measurement: **"the student's" does not belong in a
    description.** Row 10.3's cell said "into the student's OWN sentence"; zero of 86 ELA
    descriptions say "the student" and the field is rendered to the student, so it was
    transformed to "your OWN sentence" -- the same class as the standing rule that
    authoring-facing words drop while copying.

31. **A row may be honestly untestable in part — say so rather than fake it.** Row 4.4
    (RI.8.7, choosing a medium) is assessed with every medium DESCRIBED in words, because
    this is a voice tutor with nothing to show. Its author reported that three of the
    four purposes the row names survive description (show a trend, teach a procedure,
    allow re-reading) because they rest on properties words can carry, but **"convey a
    mood" does not**: you cannot judge whether a presentation conveys a mood without
    experiencing it. So that quarter of the standard is TAUGHT in the file and
    deliberately NOT TESTED by any item, and the file says so. This is the right move and
    the right disclosure. If a row's format cannot honestly assess part of its standard,
    teach it, exclude it from the items, and record the gap where a reviewer will find it.

### CONTROLLER ADDENDUM 2026-09-19 (after m8sci batch 2, eight rows; measured, not recalled)

33. **A scope cell has UP TO three parts, not always three.** The 2026-09-03 ruling above says
    "every Grade 8 scope cell has three parts". Measured on m8sci batch 2: SIX of eight cells
    lack one — 3.3, 3.4, 4.1 and 4.4 have no lineage clause (no `m6*`/`m7*` predecessor to
    name), 4.3 has no withheld clause. Do not invent a missing part. State its absence in one
    sentence inside the SCOPE GUARD ("The cell carries no lineage clause") so the next reader
    does not hunt for it.

34. **Ruling 17's worked example is ELA-origin and does not describe THIS contract.** It says
    the guard sample "happens to use row 4.2" and names "counterclaim" and "the G7
    relevance/sufficiency tests" — those are the ELA contract's sample. In this contract the
    guard sample is a different row. The MECHANISM of ruling 17 is unchanged and binding:
    write your guard against your own finished body, re-grep every absence claim, and scope
    absence claims to the authored BODY (the guard itself and the chain loIds legitimately
    contain the neighbouring rows' words — five of eight batch-2 agents first wrote a false
    absence clause for exactly this reason).

35. **Report length: the fan-out prompt's 25-line cap covers the SUMMARY; the claim ledger
    is appended in full below it and is exempt from the cap.** Every batch-2 agent flagged the
    conflict and every one correctly kept the ledger. Do not trim the ledger to fit.

36. **Ruling 32 (examples named in part (i) are burned for items) bites every qualitative
    row.** Expect to build three fresh item specimens; say in the doc comment which cell
    examples are burned so a later editor does not "helpfully" reuse one in an item. Two
    batch-2 agents also had to LENGTHEN a key with a load-bearing clause to escape a
    strictly-shortest tell — that is allowed when the clause is genuinely required for the
    key to be correct; say so in the report.
