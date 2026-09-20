# Grade 8 Science fan-out contract — binds every lesson agent

You are authoring lesson plans for a **Grade 8 Science** course in the Evelyn Learning engine.
**The audience is thirteen- and fourteen-year-olds.** That governs every decision below.

**Two names, and they are not interchangeable.** The student-facing course TITLE is plain
`Grade 8 Science`. The engine taxonomy id is `grade-8-physical-science`, and that is the exact
string that goes in the `topic` field. This mirrors the two shipped siblings exactly: Grade 7's id is
`grade-7-life-science` under the title `Grade 7 Science`, and Grade 6's is
`grade-6-earth-space-science` under the title `Grade 6 Science`. Write `grade-8-physical-science` in
`topic`; never write "Physical Science" in a `title`, and never write "Grade 8 Science" in `topic`.

**The domain rotation is the whole point of this course.** The product owner ruled that the three
middle-school science courses rotate NGSS domains by grade: Grade 6 is **Earth & Space Science**
(built in this wave), Grade 7 is **Life Science** (shipped), Grade 8 is **Physical Science**
(MS-PS1 / PS2 / PS3 / PS4 — this course). Grade 8 is not "harder Grade 7 science" — it is a
different science, and it is the course that supplies the physical MECHANISM underneath phenomena
the other two courses described. Everything in the "Content scope" section below follows from
that. This course has TWO drift directions, and both are the specific failure modes it is built to
avoid: sideways into Earth systems or living things, and upward into HS Chemistry and AP Physics.

### ⚠️ THIS COURSE'S BOUNDARY IS SIDEWAYS AND UPWARD — read this before any sibling contract

The four Grade 8 contracts in this wave describe DIFFERENT SHAPES of boundary, and they are not
interchangeable. If you have read one of the others — or worked a row on another course in this wave
— you are carrying a mental model that will mislead you here:

| Course | Shape of its boundary | What "going too far" means there |
|---|---|---|
| Grade 8 Math | **Vertical, by topic.** Algebra 1 escalates the same strands. | Teaching the harder version of your own topic |
| Grade 8 ELA | **Vertical, along a cumulative strand.** The same standard exists at the grade above in different wording. | Using the HS wording of a standard you share |
| Grade 8 World Geography | **Vertical, by DEPTH.** The course above covers the same topics at greater depth, so only depth tests decide its boundary cases. | Attaching the mechanism to a topic you were meant to name |
| **Grade 8 Science (this course)** | **HORIZONTAL into the neighbouring NGSS domains, AND UPWARD into HS Chemistry and AP Physics, with a stated quantitative ceiling.** | Teaching a different science, OR doing the same science with the mathematics of the course above |

(The three shapes above are as their Grade 6 sibling contracts described them; each Grade 8
contract restates its own against the course above Grade 8. Read the one for your course, not this
row.)

**The sideways danger is the one the Grade 6 course was built around, and it is still here.**
Grade 6 and Grade 7 are DIFFERENT SCIENCES, not easier versions of this one. A lesson that starts as
physics and ends as Earth science or biology does not announce itself: the convection lesson that
starts describing plate boundaries, the change-of-state lesson that turns into the water cycle, the
energy-conservation lesson that walks through photosynthesis, the electromagnetic-spectrum lesson
that turns into the greenhouse effect. Those transitions feel like enrichment. They are going
sideways into a course that already owns the phenomenon — the curriculum names the owning file for
every one of them — and this course's job at that edge is to name the phenomenon as an EXAMPLE of
the mechanism, in one sentence, and stop.

**The upward danger is NEW at Grade 8, and it has a number attached.** Unlike the two courses
beside it, this course has a real ceiling above it, because HS Chemistry (`chem-u*` seeds) and AP
Physics (`ap-physics*` seeds — there is no HS physics course in this catalog, so those are the only
upward physics) teach the SAME physical science with more mathematics and more structure. The
signed curriculum states the ceiling, and it binds every row:

> **Quantitative ceiling:** qualitative-to-light-quantitative only. Speed = distance ÷ time and
> F = m × a with small whole numbers; "kinetic energy grows with mass, and with the SQUARE of
> speed" as a described relationship; wave speed = frequency × wavelength as a relationship, never
> a computation with scientific notation. **No** vectors, **no** trigonometry, **no** algebraic
> derivations, **no** joules-by-formula (½mv², mgh), **no** q = mcΔT, **no** Coulomb's law,
> **no** F = Gm₁m₂/r² or any inverse-square arithmetic.

Reaching upward feels like being thorough — "while we are here, the formula for kinetic energy
is…" — and it is the drift that turns a Grade 8 row into `chem-u9-specific-heat-calorimetry.ts` or
`ap-physics-c-mech-energy-momentum.ts`. The "Content scope" table below names the owning file for
every upward item, exactly as it does for every sideways one. Both directions are checked at review.

## Working directory
`/Users/luke/Dev/evelynlearning/.claude/worktrees/demo-gate` (git worktree). Work ONLY here. Do NOT touch `/Users/luke/Dev/evelynlearning` itself — unrelated branch, uncommitted work.
Do NOT commit, push, merge, deploy, start a dev server, or seed Mongo. **Do NOT edit `store.ts`** — registration is batched separately by the controller. Writing to it would collide with sibling agents.

## Course shape: 40 rows, 2 pre-written, 38 fan out
The signed-off curriculum (`m8sci-CURRICULUM.md`) has exactly 40 lesson rows across 10 units. The controller hand-writes 2 of them as exemplars (rows 2.1 and 8.1, marked "(exemplar — written)" in the table below); the remaining 38 rows are what fan out to authoring agents, one row per agent. This is not a discrepancy to flag — it is the intended split.

## The template — copy its shape exactly
Read BOTH exemplars in full before writing anything:
- `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8sci-u2-newtons-first-law-inertia-and-friction.ts` (concept-led — use for rows that build a mental model the student has no procedure for: velocity and acceleration as "any change in velocity" (1.3), the third law's pairs-on-different-objects (2.3), gravity's dependence on mass and distance and the mass/weight split (3.1), the two-kinds-of-charge model (3.2), fields as the region where a force acts (3.4), potential energy as stored by arrangement (4.2), energy transformation and conservation (4.3), energy moving between objects through a force (4.4), temperature versus thermal energy (5.1), the particle model of the three states (6.1), what happens to particles during a change of state (6.2), density and thermal expansion as the reason warm fluids rise (6.3), inside the atom (7.2), what a wave is (9.1), amplitude and wave energy (9.4), what light does at a surface and why we see (10.1), refraction (10.2), light versus sound and the spectrum (10.3), analog versus digital (10.4) — **20 rows**)
- `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8sci-u8-evidence-of-a-chemical-reaction.ts` (procedure-led — use for rows where the student runs a repeatable routine over given information: deciding "moving or not" against a reference point and computing speed (1.1), reading a described distance-time record (1.2), adding forces on a line and classifying balanced/unbalanced (1.4), predicting and computing with F = m × a and planning the fair test (2.2), evaluating a safety design (2.4), predicting from described magnet data and picking the next trial (3.3), reading the described KE table (4.1), classifying a described transfer as conduction/convection/radiation (5.2), reading described heating data and planning the investigation (5.3), evaluating a thermal design (5.4), identifying a substance from characteristic properties (6.4), classifying a described particle picture as element/compound/mixture (7.1), reading the periodic table (7.3), reading a formula and matching it to a particle model (7.4), counting atoms before and after (8.2), classifying a reaction as releasing or absorbing and evaluating the device (8.3), tracing a synthetic material to its resource and weighing a stated benefit against a stated cost (8.4), reading amplitude/wavelength/frequency from a description (9.2), applying the same-medium relationship and distance = speed × time (9.3) — **20 rows**)

Both files exist before any agent is dispatched against this contract — they are authored ahead of fan-out specifically so every agent has its OWN course's register to anchor on. **Do not substitute a different grade's seed as a stand-in if one is somehow missing.** Falling back to an `m7sci-*` or `m6sci-*` file is exactly the drift these exemplars exist to prevent: those files are life science and Earth science, and their content is out of scope for every row in this course. If either path is missing when you go to read it, stop and report that the exemplar is absent rather than improvising a substitute.

### How much the exemplars are evidence OF — read this before you take a cue from them

**There are two of them.** Everything this contract says about "both exemplars" rests on a sample of
two files and six items, and this section exists because that sentence has to be said out loud rather
than left for you to infer.

The Grade 6 ELA course, in the previous drop of this wave, learned why. Its contract stated that
grammar rows get choice-length parity essentially for free — a claim generalised from a single data
point, its own grammar exemplar, which happened to measure 0 of 6 naturally. The first fan-out agent
on a grammar row then hit all three keys strictly longest on its first draft, and the exemption was
simply false. The post-mortem is the part that matters here, because it names a defect class this
contract is exposed to everywhere: **every failure of this family was a true sentence doing untrue
work.** The measurement was correct. The scope it was allowed to cover was not. Note that the "true
as written" rule cannot catch this — the true sentence passes its own audit, while the false
inference is sitting in a different sentence.

So, two rules, and the first one binds this contract rather than you:

- **Any claim in this contract that generalises from the exemplars states how many files it rests
  on.** Where you see a sample size, treat the claim as evidence. Where a claim about "how this
  usually goes" carries no sample size, treat it as an unexamined generalisation and report it —
  that is a contract defect, not a rule you have to obey.
- **A first draft that fails a measurement is a NORMAL OUTCOME, not a sign you have misread the
  rule.** Three of the Grade 6 Science sibling's six exemplar items failed the DF-3 check on their
  first draft, and this course's two exemplars will be measured the same way at review. Measure,
  find the failure, fix it, and move on. An agent who assumes a failed measurement means it has
  misunderstood the instruction will go looking for a different reading of the instruction, and the
  instruction was fine.

**The specific place your experience should be expected to differ from the exemplars: ARITHMETIC.**
Both exemplar rows are qualitative BY THEIR SCOPE LINES — row 2.1 is the first law and friction,
row 8.1 is a before-and-after property comparison — and not by design; it fell out of which two rows
the controller chose as the cleanest concept-led and procedure-led shapes. Neither row's scope asks
for a speed, a force computed from mass and acceleration, an atom count, a density comparison or a
distance from a time. So whatever the two exemplar files show about arithmetic is **not evidence that
arithmetic in this course is easy** — those rows could not have exercised the risk. The risk lands
squarely on **Unit 1** (speed = distance ÷ time, and the units that ride with it — meters per second
is not meters), **row 2.2** (F = m × a, where the unit of the answer is meters per second SQUARED
and a student who writes "5 meters per second" has made an error nobody will hear), **row 4.1**
(double the speed → FOUR times the energy, the single most-generated wrong ratio in this course),
**row 6.3** (grams per cubic centimeter comparisons), **row 8.2** (counting atoms of each kind on
both sides, which is exactly where a coefficient-times-subscript slip hides), and **row 9.3**
(distance = speed × time for an echo or thunder, and the same-medium relationship). If your row is
one of those, expect your own arithmetic experience to differ from the exemplars', expect to write
real arithmetic rows into your claim ledger with the units carried through, and do not read the
exemplars' ease as evidence about your row. A reviewer seeing no arithmetic rows from a Unit 1, 2.2,
4.1, 6.3, 8.2 or 9.3 agent should treat that as a signal, not a pass.

Both exemplars open their file-level doc comment with a **`SCOPE GUARD:` paragraph** stating, in a few sentences, exactly what this lesson covers and what adjacent row, sibling domain, or course above it deliberately stays out of. Here is the form, drawn from a real row of this course (5.2): "Grade 8 row 5.2 explains the MECHANISM of conduction, convection and radiation and classifies described situations by mechanism. Mantle convection and ocean currents are named only as examples of convection, in one sentence each, and are never described as Earth-systems processes -- plates, boundaries and named currents are Grade 6 rows 4.2 and 8.3. The temperature-versus-thermal-energy distinction is row 5.1 and is assumed, not re-taught; which materials block which mechanism is row 5.4. No specific-heat value, no q = mcΔT, and no law of thermodynamics appears; those are HS Chemistry and AP Physics." Write the same convention into your own file's doc comment: a `SCOPE GUARD:` paragraph naming your row's boundary against its Grade 8 neighbors, against Grade 6 Earth & Space science, against Grade 7 life science, and against HS Chemistry / AP Physics above it, drawn from your row's scope line and the "Explicitly excluded" list in the curriculum. This is not lint-enforced, but it is the mechanism the exemplars use to keep a reviewer (and the next agent reading your file as salvage) from having to re-derive your row's boundary from scratch.

**A SCOPE GUARD must be TRUE AS WRITTEN of the file it heads.** This is a rule because it has
already been broken: a Grade 6 Math exemplar in this wave shipped a guard reading "every quantity in
this plan is a proper fraction" while its own body used 6/4, 3/2, 2/1 and "1 and 1/2". The content
was fine; the guard was simply false. Nothing in the schema, the type system or `lint-ms-plans` can
catch that — a guard is a comment, and a false comment is worse than no comment, because the next
agent that reads your file as salvage will trust it. So:

- State what the lesson deliberately EXCLUDES, and — where a neighboring curriculum row, a sibling
  domain, or the course above sits close — also what IS deliberately allowed at that edge, and why.
  "Momentum is AP Physics" is not enough if your row 2.4 file says "spreads the stopping force over
  a longer time" four times; say that it states the longer-time-smaller-force idea in words only,
  and say what about momentum and impulse it still does not teach.
- For this course the close neighbors are the two sibling DOMAINS and the courses ABOVE, so **name
  Grade 6 Earth & Space science, Grade 7 life science, and HS Chemistry / AP Physics explicitly**
  rather than gesturing at "other grades". If your row has no life-science surface at all, say
  that — "no life-science content is in scope for this row, and none appears" is a true, checkable
  claim and is more useful than silence. Every row in this course HAS an upward surface, so the
  upward clause is never "none": it names the formula, quantity or structure you stopped short of.
- Do not assert a count you have not counted, and do not assert an absence you have not grepped for.
  A safe guard describes a rule ("wherever it appears, it is there only to..."); an unsafe one
  asserts a number.
- Both exemplars' guards are written to this standard — read them as the model for the form, not
  just for the boundary.

Every file you write imports `MS_PACING_THRESHOLDS, MS_SOURCE` from `./_ms-shared` and sets
`curriculum: 'MS'`, `grade: '8'`, `subject: 'science'`, `topic: 'grade-8-physical-science'`, `locale: 'en'`, `schemaVersion: 1`,
`source: MS_SOURCE`, `pacingThresholds: MS_PACING_THRESHOLDS`, exactly one entry in `los`.

## Naming, derived from your row
- file `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8sci-u<N>-<slug>.ts`
- `id: 'evelyn.ms.m8sci.<slug>.v1'`
- export `SEED_M8SCI_U<N>_<SLUG_UPPER_SNAKE>` (slug uppercased, hyphens→underscores — e.g. slug `inside-the-atom` in unit 7 exports `SEED_M8SCI_U7_INSIDE_THE_ATOM`)
- `los[0].id: 'm8sci.<slug>'`, `los[0].standard: 'M8SCI-<u>.<t>'` where `<u>` is the unit number and `<t>` is that row's position in the unit (1–4), e.g. row 8.1 → `M8SCI-8.1`
- `metadata: { cedUnit: '<N>', cedTopic: '<u>.<t>', cedTitle: '<Title>' }` — `cedUnit` is a STRING (`'8'`, not `8`); `cedTopic` is the string `'<u>.<t>'`

## Segment recipe — the lint enforces this exact sequence
`hook, concept, worked_example, worked_example, try_yourself, try_yourself, try_yourself, misconception_check, recap`

This is verified verbatim by `apps/tutor/scripts/lint-ms-plans.ts` (`npm run lint:ms-plans`), whose `COURSES` table carries the row `m8sci: { subject: 'science', topic: 'grade-8-physical-science', loPrefix: 'm8sci', std: 'M8SCI', grade: '8', tryFormat: 'three-mcq' }`. Below is every check that script runs against your plan — passing it on the first try means satisfying all of these, not just the ones that feel important:

- `id` matches `evelyn.ms.m8sci.<slug>.v<N>`; `curriculum: 'MS'`; `grade: '8'`; `subject: 'science'`; `topic: 'grade-8-physical-science'`
- `metadata.cedUnit` is a string `1`–`10`; `metadata.cedTopic` is a string matching `<1-10>.<digits>`; `metadata.cedTitle` is a non-empty string
- exactly ONE entry in `los`; `los[0].id` matches `m8sci.<slug>`; if `los[0].standard` is set it must match `M8SCI-<1-10>.<digits>` and must NOT contain the substrings `frq`, `dbq`, `leq`, `saq` (case-insensitive) — neither may `metadata.cedTopic` or `metadata.cedTitle`
- `pacingThresholds` must be reference-equal in value to `MS_PACING_THRESHOLDS` (import it, do not hand-type the object)
- exactly THREE `try_yourself` segments, and **ALL THREE are `responseFormat: 'mcq'`.** This is `tryFormat: three-mcq`. **This course has NO numeric items and the lint rejects one outright** (`grade-8-physical-science try_yourself segments must all be mcq (found N numeric)`). Even where the content is quantitative — a speed from a distance and a time, an acceleration from F = m × a, an atom count, a density comparison, a distance from an echo delay — the student picks the correctly stated answer rather than typing a number. Do not add a numeric segment, do not set `responseFormat: 'numeric'`, and do not carry a numeric item down from a Grade 8 Math seed, or up from a legacy `g8-sci-*` file, if you happen to read one.
- every MCQ `try_yourself` has exactly 4 `choices` with exactly one `correct: true`
- no `try_yourself` may carry a `rubric` field — rubrics are FRQ-only and MS plans never use FRQ
- exactly ONE `concept` segment, and it must have **4–6 `keyIdeas`** (not 3, not 7)
- a `recap` segment must be present with `mustRemember`
- `schemaVersion` must be `1`
- `estimatedMinutes` (plan-level) must be an integer in **18–22**
- the sum of every segment's own `estimatedMinutes` must be within 1 minute of the plan-level `estimatedMinutes` — every segment (including both `worked_example`s and all three `try_yourself`s) needs its own `estimatedMinutes` set, or the lint flags a missing value before it even checks the sum
- segment `kind` order must be EXACTLY `[hook, concept, worked_example, worked_example, try_yourself, try_yourself, try_yourself, misconception_check, recap]` — no reordering, no dropping, no duplicating
- every `prerequisites`/`followUps` entry must resolve to a real `los[0].id` that exists somewhere in this course's plan set (checked across the whole batch, not per-file) — a slug typo here fails the batch lint even though your own file is otherwise perfect, so copy slugs from the table below character-for-character

The lint does NOT check hint count, but both exemplars set `hints: [ ... ]` with exactly 2 entries, escalating, on every `try_yourself` — match that pattern. This one is genuinely house style rather than a two-file coincidence, and the sample is worth stating: **all 120 `try_yourself` segments across the 40 shipped `m7sci-*` plans carry exactly 2 hints, with no exceptions**, and the 40 `m6sci-*` plans built in the previous drop of this wave carry 120 more. Unlike a claim about difficulty or length, this is a convention rather than a fact about the world, so precedent is the right kind of ground for it.

## Naming/authoring details the lint does not catch, but a reviewer will
- `expectedAnswer` on an MCQ `try_yourself` must be **byte-identical** to the `text` of the `correct: true` choice
- `choices` use ids `'a'`, `'b'`, `'c'`, `'d'` in that order, and the `correct: true` position varies across your three items — do not park the answer at `c` every time
- `misconception_check.commonErrors` needs 1–2 entries, each naming the wrong answer, the misconception behind it, and the full correction
- `WRONG: ... CORRECT: ...` labeling in worked-example steps wherever a step exists specifically to warn against a bad answer (see both exemplars' second `worked_example`)
- `suggestedTools` on the `hook` and `concept` segments is a HINT to the live tutor's whiteboard, and both exemplars set it (`show_diagram`, `show_table`, `show_timeline`, `show_cycle_diagram`, `show_concept_map`, `show_map`, `show_labeled_image`, `show_flowchart` are all real registered tool names, and `show_diagram` and `show_table` are the two this course will lean on). It is a hint only. **Nothing you author may depend on it** — see the section "WHAT THE STUDENT CAN LOOK AT" below, which is the most important one in this contract.

## Answer position — a deterministic rule, not a judgement call

Deferred finding DF-1 from the Grade 7 wave was answer-POSITION skew: correct answers clustering in
particular choice slots across a whole bank, which a student learns to exploit long before they
learn the science. Thirty-eight agents each choosing a position "randomly" produces exactly that
skew, so the position is not yours to pick. It is computed from your row.

**The rule.** Index the choices a-b-c-d as 0-1-2-3. For a lesson in unit `u`, topic `t`, the three
correct choices sit at indices:

```
(u + t)     mod 4    -> try_yourself 1
(u + t + 1) mod 4    -> try_yourself 2
(u + t + 2) mod 4    -> try_yourself 3
```

**Worked example.** Row 2.1 (Newton's first law): `u = 2`, `t = 1`, so `u + t = 3`.
`3 mod 4 = 3`, `4 mod 4 = 0`, `5 mod 4 = 1` — the keys go at **d, a, b**. Check it against the
concept-led exemplar: its first item must have `correct: true` on choice `d`, its second on `a`, its
third on `b`, and if it does not, report that before you copy anything from it. Row 8.1 (evidence
of a chemical reaction): `u + t = 9`, so `9 mod 4 = 1`, `10 mod 4 = 2`, `11 mod 4 = 3` — the keys go
at **b, c, d**, which is what the procedure-led exemplar is required to ship with.

**BUILD each item with its key already in the required position. Never write the item first and
then permute the choice array.** This is the warning the Grade 7 wave learned the hard way:
reordering an already-written `choices` array left undefined holes in it that nothing caught until
`tsc` ran, and any hint that named a choice by its letter went silently wrong under the reorder.
Decide the position from `u + t` before you write the first distractor, then write the four choices
out in their final order with ids `a`, `b`, `c`, `d` in sequence. If you find yourself moving a
choice after the fact, rewrite the whole array by hand and re-check that `expectedAnswer` is still
byte-identical to the text now carrying `correct: true`.

**Never let a hint refer to a choice by letter or position** ("the second option", "choice C").
Hints describe the reasoning, not the layout — both exemplars do this, and it is what makes the
position rule safe to apply.

## Choice length — DF-3, the longest-answer skew

This sits next to the answer-position rule above, not inside the claim ledger below: it is an
**item-shape defect, not a truth defect.** Every claim in an item can be true and the item can still
be gameable.

**The finding.** In the shipped Grade 7 banks the keyed answer was strictly the longest choice far
more often than chance, and the split by subject is stark:

| Shipped course | Key is longest | | Shipped course | Key is longest |
|---|---|---|---|---|
| World History | 80% | | Grade 7 Math | 14% |
| Environmental Science | 76% | | Geometry | 10% |
| **Grade 7 Life Science** | **71%** | | Algebra 1 | 7.5% |
| World Geography | 67% | | | |

Prose courses are bad and numeric ones are clean, and the reason is mechanical: **a number has no
room to grow and a prose explanation does.** "3 meters per second" cannot acquire a qualifying
clause; "the forces on the book are balanced, so its motion does not change" can, and does, because
that is what makes it correct.

**The number that should decide this for you is 71%.** That is `grade-7-life-science` — the shipped
sibling of this very course, same subject, adjacent grade, written by agents working from a contract
much like this one. **Science is not exempt for being technical.** This course is closer to the
clean side than the Grade 7 course was, because several rows carry a stated quantity as the key —
but a quantity-with-unit key sits beside three quantity-with-unit distractors of the same length
only if you build them that way, and every explanation-shaped key in this course has exactly the
room to grow that a number does not. Assume you are on the 71% track unless you measure otherwise.

**It gets worse where it matters most.** In geography the skew climbed to 94% on the hardest tier —
the items meant to separate real understanding were the most guessable in the whole bank. The lesson
seed equivalent is your **third `try_yourself`**, which by house pattern is your hardest and most
conditional item, so it is the one most at risk. Check it first.

**There is no mechanical fix.** Unlike the position rule, you cannot permute your way out of this.
The fix is authorial and it has one direction:

> **Lengthen the distractors. Never shorten the answer.**
>
> Or, the same rule said as the thing you actually have to do:
> **give the distractors the same care you gave the key.**

**Why the rule is phrased that way matters more than the rule.** Measured on the two exemplars of
the Grade 6 Science sibling, three of six items came in with the key strictly longest — and not one
of them was carelessness about length. Every one arrived by the same ordinary route: **the key had
earned a qualifying clause and the distractors had not.** The author cared about getting the right
answer right, and wrote the wrong answers quickly. That is all it takes, and it is how a shipped
course reaches 71%. This course's exemplars will be measured the same way at review, and the number
will be reported as a diagnostic — it is not a target, and it is not known yet.

This is why "watch your choice lengths" is a rule that fails. It describes a symptom, so an agent
reads it, glances at four strings, sees nothing alarming, and moves on — while the real cause is
sitting in how much thought went into each of the four. The rule that works is the one that changes
what you actually do: **write each distractor with the same attention you gave the key.** Ask of every
wrong choice what a student who chose it was thinking, and put that reasoning into the choice. Length
then takes care of itself, because a wrong answer with its reasoning stated is about as long as a
right answer with its qualifying clause stated. If you find yourself adjusting characters, you are
working on the symptom.

A correct answer in this course usually needs a qualifying clause in order to be correct — "once it
leaves your hand", "on the same object", "in the same medium", "in a sealed container", "at the
same speed". **Stripping that clause to match a short distractor makes the key wrong, ambiguous, or
no longer uniquely defensible, which is a worse defect than the one you were fixing.** Give the wrong
choices comparable specificity instead: each distractor gets its own reason clause, built out of the
named student error behind it, at the same grain as the key's.

- **Lengthen with reasoning, not filler.** "because the push you gave it is still inside the ball
  and is slowly running out" is a distractor made longer by making its error more explicit.
  "because of the way that it is" is padding, and a reader can feel the difference immediately.
- **A lengthened distractor must still be a nameable error, and must still be false.** Adding
  specificity can accidentally make a wrong choice true, or make it so elaborate it reads as the
  considered answer. Re-check both after every edit.
- **Do not overcorrect into making the key the SHORTEST.** That is the same signal running backwards
  and a test-wise student picks it up just as fast.
- **Do not grow a distractor past the point of honesty in order to move the count.** If a distractor
  has said everything its error justifies saying, it is finished. A key that ends up longest because
  its qualifying clause earned the words is a correct item, not a defect — see the chance baseline
  below.

**The bar is "the key sits at neither extreme" — there is NO spread ceiling.** This was escalated
from the Grade 6 Science sibling and ruled once for every course in the wave, so do not re-open it
and do not invent a tighter target of your own. An item whose choices run 52, 59, 58 and 71
characters with the key in the middle passes, and passes properly. Three reasons, because a limit
without its reason gets tightened by the next person who reads it:

1. **The exploitable defect is DIRECTIONAL.** "The key is usually the longest" is a signal a student
   can act on; 67% to 94% strictly-longest is a strategy. A nineteen-character spread with the key in
   the middle is not a strategy, because nobody can infer "pick the middle-length one".
2. **A ceiling would make agents pad or trim text to move a number**, which damages items in order to
   improve a measurement — Goodhart's law in one line, and the opposite of what this rule is for.
3. **The count is a proxy for guessability.** Tightening a proxy past the point where it still tracks
   the thing it stands for makes items worse, not better.

So: measure, report the count, fix any strict extreme by deepening the distractors — and then stop.

**The stem-hidden test — run this on every item.** Cover the stem and read only the four choices. Ask:
could someone who has not read the question, and knows nothing about this topic, pick the key? If the
longest one is the obvious guess, or the one with the careful qualifying clause stands out against
three blunt ones, the item is gameable and the distractors need work.

### The count is a diagnostic to REPORT, not a score to minimise

**With four choices, a key is the longest by chance 25% of the time.** That is the number to hold on
to, and it was missing from an earlier draft of the Grade 6 sibling contract. The shipped defect ran
67% to 94%, which is far above chance and is what made it a strategy a student could act on. **The
target was never zero.** It is "not far above chance".

Two consequences, and both matter:

- **A course driven to zero is exploitable by the inverse strategy** — never pick the longest. A key
  that is never the longest is itself a pattern.
- **Some of your keys will legitimately be longest**, because a correct answer often earns a
  qualifying clause. That is the mechanism this whole section is built on; it does not stop being
  true when you are the one measuring. **An item where the key is longest because it needed the words
  is a correct item.** Do not grow distractors past honesty to move it.

**Three items cannot distinguish chance from bias.** At 25%, the expected count across your three
items is 0.75. Getting 0 of 3 is unremarkable; so is getting 2 of 3. The Grade 6 Science sibling's
two exemplars came in at 3 of 6 on first draft and settled at 1 of 6 — and **neither number is
statistically meaningful at that sample size**: at chance, 3-or-more of 6 happens 16.9% of the time,
and 0 of 6 happens 17.8% of the time. So the first draft was never evidence of a problem, and a zero
would never have been evidence of a fix. The repair was still worth making, but the evidence for it
came from *reading the items* — the keys had qualifying clauses and the distractors did not — and
never from the count. This course's exemplars will be measured the same way at review, and whatever
they measure is a diagnostic to report, not a number to match.

**So the real measurement is course-level and is taken at registration**, across all 40 files and
120 items, where roughly a quarter is the expected landing place. Your job is to report your count
and your four lengths per item honestly so that aggregate can be computed. **Do not tune your three
items to hit a number**; that corrupts the only measurement that can actually detect the defect.

**Measure and report.** Count the items in your file where the key is **strictly** the longest choice
(strictly: longer than all three others, not tied), report that count out of 3, and report the four
character lengths per item alongside it. Report the same count for strictly-shortest. Then stop —
see the no-spread-ceiling ruling above.

**What the sibling's exemplars showed, including a mistake worth copying the correction of.** The
Grade 6 Science exemplars' first drafts measured 3 of 6 keys strictly longest. An intermediate
revision drove that to 0 of 6 — and that was an over-correction, made while that contract still
wrongly named zero as the target. Two of the four edits behind it were not repairs at all: they added
time-anchoring words to distractors that had already said everything their error justified. That is
padding to move a number, which this section forbids. **Those two items were reverted to their
original text.** The sibling's exemplars stand at 1 of 6, against a chance expectation of 1.5 — and
1 of 6 is not a better score than 0 of 6, it is simply the honest state of six items nobody tuned.

The two edits that were KEPT are the model for what a real repair looks like. In the concept-led
sibling exemplar's first item the distractors grew by roughly a third each against an unchanged key
— but the added words were each a reason clause that made the distractor a complete competing
explanation instead of a fragment, so that one of them now answered the stem's actual question
rather than being dismissible on structure alone. The same repair in this course looks like this,
for a row 2.1 item asking why a rolling ball slows: a fragment distractor "the push runs out"
becomes "the push you gave it is used up a little at a time, and the ball stops when none is left" —
a complete statement of the impetus error, and exactly as long as its error justifies. The test that
separates a kept edit from a reverted one is not length. It is whether the added words say something
the distractor's error justified saying.

What is solid here is the qualitative finding, which came from reading the three failing items rather
than from their count: in every one, the key had earned a qualifying clause and the distractors had
not. That is visible by inspection, it is the diagnosis the rule above is built on, and it does not
depend on sample size. **No key was shortened at any point.**

**That conclusion rests on twelve items across four files** — the Grade 6 Science sibling's two
exemplars and the Grade 6 Geography sibling's two. Twelve items are enough to show that deepening
distractors does not damage them and that low counts are attainable without dishonesty. **They
cannot establish that zero is the right place to stop**, and they cannot tell you how your own row
will behave. Measure, report, and let the course-level aggregate do the work the small sample cannot.

## WHAT THE STUDENT CAN LOOK AT: the words in your own segment, and nothing else

This is the constraint that shapes physical science items more than any other, because almost every
topic in this course is normally taught from a picture or a symbol — a force arrow diagram, a
distance-time graph, a data table, a particle-box drawing of a solid, liquid and gas, the periodic
table itself, a labeled atom, a ball-and-stick molecule, a chemical equation with an arrow, a wave
drawn on a rope with crest and trough labeled, a ray diagram through a lens.

**There are no images in this course, and there is no way to add one.** Your seed text is served
three ways: spoken aloud by the tutor in a voice session, rendered as plain text in the practice
surface, and rendered as plain text in the quiz surface. Only the first has a whiteboard, and even
there the board is drawn live by the brain from the words you wrote — it is not an asset you can
author, attach, or rely on. The other two surfaces show your text and nothing else. **And the first
surface is SPOKEN**, which is why the three Grade 8 rules at the end of this section exist: a
formula, a subscript, or a bare unit abbreviation that a student can read off a page is not
something a student can hear.

So an authoring agent may assume the student can read the words printed in that one segment. It may
assume nothing else. In particular:

- **Never** write "look at the diagram", "the graph shown", "in the figure above", "using the table
  below", "as the picture shows", "refer to the periodic table", "see the equation".
- **Never** assume a physical object or an apparatus. There is no spring scale, no dynamics cart, no
  ramp, no balloon in hand, no bar magnet, no compass, no thermometer, no burner, no beaker, no
  sealed flask on a balance, no slinky, no tuning fork, no laser pointer, no prism, no classroom
  demonstration, and no textbook. A HOOK may invite a memory the student plausibly already has
  ("you have felt a bike's brakes get warm after a long hill"), but no `worked_example`,
  `try_yourself` or `misconception_check` may require an observation the student has not already
  made or a measurement they cannot take.
- **Never** assume a shared prior visual from an earlier lesson. Each item stands alone.
- **If your row needs a visual, write the visual out in words INSIDE the item.** Doing this well is
  most of the craft of this course. Patterns to copy:
  - **Forces on a line** → "Two forces act on the box. One pushes it to the left with 5 newtons.
    The other pushes it to the right with 3 newtons. No other force acts along that line."
  - **A distance-time record** → "From 0 to 10 seconds the runner's distance rises steadily from 0
    to 40 meters. From 10 to 20 seconds it stays at 40 meters. From 20 to 25 seconds it rises from
    40 to 60 meters." (Say "rises steadily" and "stays flat"; never say "slope".)
  - **A data table** → write the rows: "Trial 1: a mass of 1 kilogram, a push of 2 newtons, and the
    cart speeds up by 2 meters per second each second. Trial 2: a mass of 2 kilograms, the same
    push of 2 newtons, and the cart speeds up by 1 meter per second each second."
  - **A particle picture** → "Imagine a box of particles. In the first box the particles are packed
    tightly in neat rows and each one only shakes in place. In the second box they are still close
    together but slide past one another. In the third box they are far apart and fly in straight
    lines until they bump into something."
  - **A position on the periodic table** → "Sodium sits in the first column, third row, on the far
    left of the table. Chlorine sits in the seventeenth column, on the right, one column before the
    noble gases."
  - **Inside an atom** → "A carbon atom has 6 protons and 6 neutrons packed in a tiny nucleus at
    the center, and 6 electrons moving around it."
  - **A molecule** → "A water molecule is one oxygen atom with two hydrogen atoms attached to it."
  - **Before-and-after observations** → "Before: two clear liquids, each at room temperature.
    After mixing: the liquid turns cloudy white, a solid settles at the bottom, and the beaker feels
    warm."
  - **A wave** → "The rope's rest position is a straight line. The highest point of each hump is
    4 centimeters above that line. From one hump's top to the next hump's top is 50 centimeters.
    Three humps pass a fixed point every second."
  - **Light at a boundary** → "A ray of light travels through air and hits the flat surface of a
    glass block at a slant. Inside the glass its path bends toward the line that stands straight
    up from the surface."
- **Spell out the orientation a picture would have carried.** Without a diagram, words like "up",
  "down", "toward", "away", "left" and "opposite" have to do work they normally do not. Say "pushes
  the cart to the right, which is the direction it was already moving"; say "the force on the ball,
  not the force on the bat"; say "the north pole of the first magnet is facing the north pole of the
  second". Any ambiguity a picture would have resolved is now yours to resolve in words, and an item
  that is ambiguous because you left it to an absent picture is a defect, not a stylistic choice.
- Keep any numbers you invent for an item simple, small and obviously illustrative — whole numbers
  that divide cleanly — and describe unnamed materials and objects as "Sample A" and "Sample B",
  "the first cart" and "the second cart", rather than attaching invented data to a real product.

**Three rules specific to this course, because it is the first MS science course with formulas,
symbols and units in it:**

- **Every quantity carries its unit, in words, in every field the tutor speaks.** "3 meters per
  second", "10 newtons", "2 kilograms", "50 grams", "20 degrees Celsius", "5 cubic centimeters",
  "3 hertz" — never a bare "3", and never a bare abbreviation ("3 m/s", "10 N") standing alone in
  `script`, `steps`, `problem`, a choice `text`, a hint or a `misconception_check` field. The
  abbreviation may FOLLOW the words in parentheses if you want the student to see it, and the unit
  of an acceleration is "meters per second each second" (or "meters per second squared" once the
  words have been said in that segment). A quantity without a unit is the Grade 8 form of the
  ambiguity-a-picture-would-have-resolved defect: "5" is not an answer to a force question, and a
   student who hears "5" cannot tell it from "5 kilograms".
- **A formula is spoken in words as well as written in symbols.** Write "speed equals distance
  divided by time (speed = distance ÷ time)", "force equals mass times acceleration (F = m × a)",
  "wave speed equals frequency times wavelength". The words come first; the symbols are a companion
  the practice and quiz surfaces can show, and are never the only form. The curriculum allows
  exactly three formulas in this course — speed = distance ÷ time, F = m × a, and speed = frequency ×
  wavelength (the last as a relationship only) — plus distance = speed × time as the first one
  turned around. No other formula appears, in words or in symbols (see the quantitative ceiling).
- **A chemical formula is read out, never written as a symbolic equation.** Write "H two O -- two
  hydrogen atoms and one oxygen atom" and "C O two -- one carbon atom and two oxygen atoms"; the
  plain-text formula (`H2O`, `CO2`) may follow in parentheses so the student sees it, but the spoken
  form and the atom count in words are always present in the same sentence, because a subscript
  glyph reads unpredictably aloud and a student on the quiz surface may not know how to say it.
  **Never** write a reaction as an arrow equation (`2 H2 + O2 → 2 H2O`, or with subscript glyphs),
  and never attach a coefficient to a formula: the curriculum withholds balancing and coefficients to
  `chem-u5-balancing-equations.ts`. Row 8.2 counts atoms from a WORD description — "two hydrogen
  molecules, each made of two hydrogen atoms, and one oxygen molecule, made of two oxygen atoms,
  become two water molecules" — and that is the only form a reaction takes anywhere in this course.
  Both legacy salvage files for Unit 8 carry arrow equations; that is what the Salvage table's
  warning is about.

**And one rule for the three design-evaluation rows (2.4, 5.4, 8.3).** The curriculum assesses the
engineering PEs as "evaluate a proposed design", because a three-MCQ course cannot run a build
project. An item of that shape must give the student **every fact the evaluation needs inside the
item**: what the device is for, what each described feature or material does (in words the row has
already taught — spreads the stop over a longer time; blocks conduction; releases thermal energy
quickly), and the criterion the design is being judged against. A student may not be asked to know
that a particular foam is a poor conductor or that a particular reaction runs hot; the item says so,
and the student's work is to apply the row's rule to the stated facts. An evaluation item that
depends on an unstated material property is the design-row form of "look at the diagram".

## SCIENCE ACCURACY RULES — non-negotiable

This course has a failure mode the math and ELA courses do not: **a sentence that sounds completely
reasonable, reads well, and is not true of the physical world.** There is very little arithmetic to
recheck and no source text to re-read, so the error survives every mechanical review and reaches the
student intact. Each rule below names a claim that is commonly generated for middle-school physical
science and is false. Check your file against all fifteen, one at a time, before you finish.

**Motion and forces**

1. **A moving object does not need a force to keep moving. It needs a net force to CHANGE its
   motion.** A rolling ball slows because friction and air resistance act on it, not because the
   push it was given "runs out". WRONG: "The ball stops because the force you gave it is used up."
   CORRECT: "The ball slows because friction pushes against its motion; with no friction it would
   keep rolling at the same speed." An object moving at constant speed in a straight line has
   BALANCED forces on it, or none — never "a force keeping it going".
2. **Force is an interaction between two objects, not a thing an object carries.** There is no
   "force of motion" stored in a moving ball, and a bat does not "give its force to the ball" — the
   bat pushes the ball while they touch, and the push ends when contact ends. What a moving object
   HAS is kinetic energy, and that is the only word for it in this course.
3. **Action-reaction pairs act on DIFFERENT objects and therefore never cancel.** The two forces in
   a third-law pair are equal in size and opposite in direction, one on each object, so they can
   never add to zero on either object. BALANCED forces are two forces on the SAME object. A book
   resting on a table: the table's upward push on the book and Earth's downward pull on the book are
   balanced forces on one object; the book's downward push on the table is the third-law partner of
   the table's push on the book, and it acts on the table.
4. **Acceleration is ANY change in velocity — speeding up, slowing down, or changing direction.** A
   car rounding a bend at a steady speed IS accelerating; a ball thrown upward is accelerating
   (downward) the whole way up. Do not write "decelerating, so not accelerating", and do not let
   "velocity" and "speed" trade places: velocity is speed WITH a direction.
5. **Mass is not weight, and gravity does not switch off in space.** Mass is the amount of matter
   (kilograms) and is the same everywhere; weight is the gravitational force on that mass (newtons)
   and is about one sixth as large on the Moon. Astronauts float because they are in free fall
   around Earth, where gravity is still almost as strong as at the surface. And with air resistance
   out of the picture, a heavy object and a light object fall together — a feather lags because of
   air resistance, not because gravity pulls it less hard for its mass.

**Electric and magnetic forces**

6. **Rubbing does not create charge; it moves electrons from one object to the other.** Both
   objects end up charged, with opposite signs, and the total charge is unchanged. A charged balloon
   sticks to a NEUTRAL wall because its charge shifts the charges in the wall's surface so that the
   nearer ones attract it — do not write that the wall "is positively charged" or that the wall was
   charged by the balloon.
7. **Magnets do not attract "all metals", poles come in pairs, and an electromagnet needs a
   current.** A magnet pulls on iron, steel, nickel and cobalt; an aluminum can and a copper coin
   are not attracted. Cutting a bar magnet in half makes two magnets, each with a north and a south
   pole. An electromagnet is a magnet only while current flows in its coil, and it is stronger with
   more turns of wire, more current, or an iron core. A field is a REGION where a force acts, not a
   substance flowing out of the magnet, and "field lines" are a drawing convention, not real lines.

**Energy**

8. **Energy is never used up, made, or lost.** It is transferred and transformed, and in every real
   chain some of it ends up as thermal energy spread into the surroundings, where it is no longer
   useful — but it is still there. WRONG: "The flashlight used up the battery's energy." CORRECT:
   "The battery's chemical energy became light and thermal energy that spread into the room."
9. **Doubling the speed does not double the kinetic energy — it makes it FOUR times as large.**
   Doubling the MASS doubles it. This is the single most-generated wrong ratio in the course; every
   item in row 4.1 and every energy comparison anywhere else must get the direction and the factor
   right, and the arithmetic goes in the claim ledger.
10. **Temperature is not thermal energy, and heat is not a substance.** Temperature measures the
    AVERAGE kinetic energy of a sample's particles; thermal energy is the TOTAL and also depends on
    how much matter there is — a bathtub of warm water holds more thermal energy than a cup of
    boiling water. Thermal energy moves from the warmer object to the cooler one, always; "cold"
    does not flow anywhere. A metal railing feels colder than a wooden one at the SAME temperature
    because the metal conducts thermal energy out of your hand faster.
11. **While a pure substance changes state, its temperature stays put.** Water boiling in an open
    pan at sea level stays at 100 degrees Celsius no matter how high the flame; the extra energy
    goes into separating particles, not into speeding them up. The bubbles in boiling water are water
    vapor, not air. Evaporation happens from the surface at temperatures well below boiling. Ice and
    liquid water are the SAME substance — melting is a physical change, never a chemical one.

**Matter and its changes**

12. **Particles do not themselves expand, shrink, melt or change color — their SPACING and MOTION
    change.** "The water molecules get bigger when heated" is false; they move faster and spread
    apart. There is empty space between the particles of a gas, not air. The particles of a solid
    are not still; they vibrate in place. Density is mass per volume, not weight: a steel ship
    floats because the ship as a whole, air included, is less dense than water. Warmer water is less
    dense than cooler water — but ice is LESS dense than liquid water, because water expands as it
    freezes; that is an exception, so never write "solids are always denser than their liquids".
13. **In a chemical reaction atoms are rearranged, never created or destroyed, so mass is
    conserved.** Burning wood: the mass of the wood plus the oxygen it combined with equals the
    mass of the ash plus the gases that left. Mass "lost" in an open container is gas that escaped;
    a sealed container reads the same before and after. Rusting iron GAINS mass, because oxygen
    joined it. A compound's properties are unlike its elements' — table salt is not "sodium and
    chlorine mixed" — and a compound is not a mixture. Dissolving is a physical change (the salt is
    still salt; evaporate the water and it is back). Bubbles from heating are boiling, a physical
    change; bubbles at room temperature from two substances meeting are a gas being produced, a
    chemical one.

**Waves, light and sound**

14. **A wave carries energy from place to place; it does not carry the matter along.** The duck
    bobs and stays put. Sound is a mechanical wave and needs a medium — there is no sound in the
    vacuum of space; light crosses empty space, which is how sunlight reaches Earth. **The two
    speed comparisons run in OPPOSITE directions**: sound is FASTER in water and in steel than in
    air; light is SLOWER in water and in glass than in air. Getting one of those backward is a
    common generated error. And in a given medium a wave's speed is fixed by the medium, so a
    higher-frequency wave is not a faster wave — it has a shorter wavelength.
15. **Loudness is amplitude and pitch is frequency, and the two are independent.** A quiet high
    note and a loud low note both exist. A red object looks red because it reflects red light and
    absorbs the rest; under green light alone it looks dark — color is in the light that reaches
    the eye, not "in" the object. In the electromagnetic spectrum, radio waves have the LONGEST
    wavelength and gamma rays the shortest, with visible light a narrow band in the middle running
    from red (longest visible) to violet (shortest visible); infrared lies just beyond red and
    ultraviolet just beyond violet. Every kind of electromagnetic wave travels at the same speed in
    empty space. Light bends when it crosses into a different transparent material because its
    SPEED changes there — not because the surface "pushes" it.

**Two rules that cut across all fifteen:**

- **Nothing in physical science wants, tries, decides, knows or needs.** A ball does not want to
  keep moving, warm air does not want to rise, an electron does not try to reach the wall, atoms do
  not want to be stable, and a wave does not need to get somewhere. WRONG: "The warm air rises
  because it wants to escape." CORRECT: "The warm air is less dense than the cooler air around it,
  so the cooler air sinks under it and pushes it up." An analogy is welcome — a crowd in a hallway
  for particles, a stack of coins for a balanced push, a rope shaken at one end for a wave — but
  name its limit in the same breath, exactly as the Grade 7 seeds name the limit of the
  cell-as-factory comparison.
- **Do not state contested, material-specific or fast-moving figures as precise numbers.** Never
  invent a specific-heat value, a density for a material other than water, an exact speed of sound
  in a named material beyond "faster in water and in steel than in air", an exact wavelength or
  frequency, a temperature a named reaction reaches, or a strength for a named magnet. Figures that
  ARE safe to state because they are stable and settled: sound travels at about 340 meters per
  second in air at room temperature; light travels at about 300,000 kilometers per second in empty
  space; at sea level water freezes at 0 degrees Celsius and boils at 100; water's density is about
  1 gram per cubic centimeter; an object with a mass of 1 kilogram weighs about 10 newtons on Earth
  and about one sixth of that on the Moon; there are about 90 elements that occur naturally and 118
  known; hydrogen has 1 proton, helium 2, carbon 6, oxygen 8, sodium 11; water is H two O, carbon
  dioxide is C O two, oxygen gas is O two; the visible spectrum runs from red (longest wavelength)
  to violet (shortest). If a figure is not on that list and not equally settled, describe the
  direction and the comparison instead of inventing a number. (Items that use "about 300 meters per
  second" for sound to keep the arithmetic whole must say "about"; the ledger row then shows both
  the rounding and the multiplication.)

## Correctness — the one unrecoverable defect

**The unrecoverable defect in this course is a plausible-sounding claim that is not true.** In math,
a wrong answer is caught by redoing the arithmetic; the little arithmetic here can be redone, but the
bulk of the course cannot, so the check is different and you have to run it deliberately.

- For every factual sentence you write — in `script`, `keyIdeas`, `vocabulary`, `steps`, `answer`,
  `problem`, `hints`, `commonErrors` and `mustRemember` — ask: would a physicist or a chemist sign
  this exact sentence? Not "is it roughly the idea" — would they sign it.
- **If you are not certain a claim is true, choose a different example rather than hedging.** Never
  write "scientists believe", "some say", "it is thought that", or "generally" to launder a claim
  you are unsure of. Either it is solid enough to teach a thirteen-year-old flat out, or it does not
  belong in the lesson at all.
- **Every MCQ distractor must be a real, nameable student error.** If you cannot say in one sentence
  which mistake produces a distractor, replace it with one you can. The named errors this course
  actually runs on: force-runs-out (the push is "used up"); moving-means-a-force-is-acting;
  heavier-falls-faster; mass-equals-weight; no-gravity-in-space; velocity-is-just-speed;
  turning-at-steady-speed-is-not-accelerating; action-and-reaction-cancel;
  the-bigger-object-pushes-harder; rubbing-creates-charge; the-wall-becomes-charged;
  all-metals-are-magnetic; a-field-is-a-substance; energy-is-used-up; double-speed-double-energy;
  temperature-is-thermal-energy; cold-flows-in; metal-is-colder; heating-keeps-raising-the-
  temperature-while-boiling; bubbles-are-air; particles-expand; heavy-sinks-light-floats;
  mass-is-lost-when-something-burns; ice-to-water-is-chemical; dissolving-is-chemical;
  fizzing-is-boiling; salt-is-sodium-and-chlorine-mixed; atomic-number-counts-neutrons;
  same-period-means-same-family; the-wave-carries-the-water-along; sound-in-space;
  louder-means-higher; higher-frequency-means-faster; light-is-faster-in-glass;
  color-is-in-the-object; digital-is-better-because-it-is-newer.
- **The `correct: true` choice must be the ONLY defensible one.** If a second choice is arguably
  right under some reading, rewrite the stem until the evidence in the item is decisive. This is
  harder here than in math, because a science stem that omits one condition ("on the same object",
  "in the same medium", "in a sealed container", "with no air resistance", "at the same speed")
  quietly makes a second answer correct.

### The claim ledger — the second mechanism, and the one with a reader

The verification move above is process, not proof. Nothing in this repo can tell a true sentence
about the physical world from a false one: `tsc` checks types, `lint-ms-plans` checks structure, and
a reviewer who is not a physicist reads a wrong claim exactly as smoothly as a right one. That is the
weakest seam in this wave, and the claim ledger is the mechanism that closes it.

**Every factual claim you assert goes in your report as a claim ledger.** Not a summary of your
lesson — a list of the individual assertions a specialist could mark true or false.

**This ledger is read.** The science review pass spot-verifies the claims in it against the world,
and the wave ledger records that commitment so a later session cannot quietly drop the reading half
while keeping the writing half. It is not busywork and it is not a formality — a claim ledger nobody
reads is worse than no ledger, because it manufactures confidence. Write it honestly and completely:
**a claim you leave out is a claim nobody checks.**

**What goes in it.** Be over-inclusive; an extra line costs nothing and an omission costs everything:

- Every number, quantity, unit, percentage, duration or ratio you state, anywhere in the file —
  including ones from the safe-figure list, with the list named as the grounding.
- Every causal claim, in the form "X happens because Y" — the whole mechanism, not the topic.
- Every claim about what is true of a real object, material, substance or process ("a copper coin is
  not attracted to a magnet", "the particles of a solid vibrate in place", "rusting iron gains
  mass", "sound travels faster in water than in air").
- Every claim about what a rule does NOT cover, or the condition it depends on ("the first law
  describes motion with NO net force", "the two forces of a pair act on different objects",
  "the temperature plateau holds for a PURE substance").
- **Every factual claim embedded in a distractor, a hint, or a `misconception_check` correction.** A
  false statement is just as false in a wrong answer, and a student who half-remembers a distractor
  remembers it as a fact. These are the claims most often left out of a ledger and they carry the
  same weight as the ones in `keyIdeas`.
- **Every arithmetic step you performed, with the arithmetic itself written out in column three,
  units included.** Not "the numbers work out" — the actual division, multiplication, ratio or
  count, digits and units shown. This category exists because it has already caught an
  order-of-magnitude error in this wave that prose review missed completely: a Grade 6 Geography
  exemplar asserted that plate motion of "a few centimetres a year over millions of years adds up
  to thousands of kilometres", which read as obviously right in three separate places and is wrong
  by an order of magnitude — 3 cm/yr over 10 million years is 300 km, not thousands. Nobody caught
  it until column three forced the multiplication to be shown. Physical science is full of the same
  shape: a speed from a distance and a time (and its unit — meters per second, not meters), an
  acceleration from F = m × a (meters per second each second), a "how many times as much" energy
  ratio (the square of the speed ratio, not the speed ratio), a density from a mass and a volume,
  an atom count on each side of a described reaction (molecules times atoms per molecule, per
  element, per side), a distance from an echo delay (and whether the sound went there AND back),
  and **anything carrying a unit prefix**, where kilo/centi/milli is exactly where a factor of a
  thousand goes missing. If your lesson states a quantity that you arrived at rather than looked up,
  the derivation goes in column three. If you cannot write the arithmetic out, you did not do it.
  **Do not calibrate this against the exemplars.** Both exemplar rows are qualitative by scope and
  neither is asked to state a speed, an acceleration, an energy ratio, a density or an atom count,
  so their clean arithmetic result says nothing about a row that does — see "How much the exemplars
  are evidence OF" above. Unit 1 and rows 2.2, 4.1, 6.3, 8.2 and 9.3 are where this category earns
  its place.

**What does not go in it:** definitions of terms your own lesson introduces, restatements of your
curriculum scope line, and pure procedure steps that assert nothing about the world ("list the
forces on the left", "read the list back"). If you are unsure whether something is a claim, put it in.

**Format — three columns, because the third one is the point:**

| Claim | Where it appears | Why you are confident it is true |
|---|---|---|
| Sound travels at about 340 meters per second in air at room temperature | concept keyIdea 3; try-2 distractor b | on the contract's safe-figure list |
| The two forces in an action-reaction pair act on different objects and cannot cancel | concept keyIdea 2; worked-example 2, final step | Newton's third law as stated at this level; the standard MS explanation of why a pair is not a balanced pair |
| Doubling a ball's speed from 2 to 4 meters per second makes its kinetic energy four times as large | try-2 key | kinetic energy grows with the square of speed: (4 ÷ 2) = 2, and 2 × 2 = 4, so four times, not two |
| Two hydrogen molecules and one oxygen molecule contain four hydrogen atoms and two oxygen atoms, and so do two water molecules | worked-example 1, steps 2 and 4 | 2 molecules × 2 hydrogen atoms each = 4 hydrogen; 1 molecule × 2 oxygen atoms = 2 oxygen; water: 2 molecules × (2 hydrogen + 1 oxygen) = 4 hydrogen + 2 oxygen. Same count on each side |
| Thunder heard 3 seconds after the flash means the lightning was about 1 kilometer away | try-1 (row 9.3) | 340 meters per second × 3 seconds = 1,020 meters, which is "about 1 kilometer"; the item says "about". Note that the sound travels ONE way here, unlike an echo |

The third column is what makes the ledger work.

**PASSING grounds:** "it is on the contract's safe-figure list"; "it is a standard principle taught
at this level" (naming the principle — Newton's first/second/third law, conservation of energy,
conservation of mass, the particle model, like-charges-repel); "it is definitional, and the
definition is in this lesson"; "it follows from X stated earlier in this file, by this reasoning";
or, for an arithmetic row, the arithmetic itself written out with its units.

**FAILING grounds** — a row grounded any of these ways is a lesson defect, not a ledger entry:

- "I am fairly sure."
- "It is widely stated" / "it is commonly taught."
- **"A shipped seed says so."** This is the sharpest rule this wave has produced, and it matters more
  in science than in any other course here. **Shipped content is not a source.** Every deferred
  finding on this wave — DF-1, DF-2, DF-3 — is a defect that shipped, was live, and was read by
  students. Production status is evidence that something passed a gate, not that it is true.
  This bites hardest here because this contract *instructs* you to mine the shipped Grade 7
  life-science seeds, the Grade 6 Earth-science seeds built in this wave, and the legacy `g8-sci-*`,
  `g7-sci-*` and `g6-sci-*` files, for segment shape, pacing, register and distractor patterns.
  **Shape yes; factual authority no.** The legacy files in particular were written to older rules
  and carry content this course's own curriculum explicitly tells you not to carry forward — a
  "1/r²" gravity item, a nuclear-energy aside, a V = IR calculation, a ½mv² worked example. An
  agent that grounds a physical-science claim on "the legacy Newton's-laws seed says so" or "m7sci
  does it this way" has grounded it on nothing at all. Go to what makes the claim true, or change
  the example.

A claim you can only ground a failing way should have been replaced with a different example before
it reached the ledger, per the no-hedging rule above. **If a row in your ledger has a weak third
column, fix the lesson, not the ledger.**

### The verification move: what replaces "check by working backward"

The Grade 8 Math contract tells its agents to verify an answer by inverting the operation — solve
back, substitute back in, multiply back out. **That move mostly does not exist in science.** The three
formulas this course allows can be turned around (distance = speed × time is speed = distance ÷ time
run backward), and where you use one you should — but there is no inverse of "the forces on the
book are balanced" and nothing to substitute back into "the mixture got warmer". Do not weaken the
math rule into a vague "double-check your answer"; use the wave-wide substitute, which has two halves
and needs both.

**Half one: three independent clues of DIFFERENT KINDS, agreeing.** Not three restatements of the
same idea. For the concept-led exemplar's row (2.1, why a puck slides to a stop) the three kinds are:
the force inventory (once the puck leaves the stick, the only horizontal force on it is friction),
the direction of the change (it slows along its line of motion and never swerves, which is what a
single backward-pointing force does), and the contrasting surface (on smoother ice it slides
farther, so the stopping is coming from the surface, not from inside the puck). For the
procedure-led exemplar's row (8.1) they are: the property comparison (the substance after has a
property the substances before did not), the reversibility test (cooling or drying does not bring the
originals back), and the sign observed (a gas given off at room temperature, or a temperature
change with no burner). If your three "checks" are all the same kind of reasoning, you have checked
once, not three times.

**Half two: rewind the input and test a contrasting case.** This half is unusually natural in
physical science, because almost every answer is a function of a stated condition — so change
exactly one condition and say what the answer becomes. Concrete forms for this course:

- Take the friction away (an air-hockey table): the puck keeps its speed, which shows the slowing
  came from friction and not from inside the puck.
- Double the mass and keep the push the same: the acceleration halves.
- Take the same object to the Moon: its mass is unchanged and its weight is about one sixth.
- Swap the sign of one of the two charges: the attraction becomes a repulsion.
- Seal the container before the fizzing starts: the "lost" mass is back on the balance.
- Keep the frequency and halve the amplitude: the pitch is the same and the sound is quieter.
- Keep the frequency and move the sound from air into water: the speed rises and the wavelength
  stretches to match.
- Turn the burner up under boiling water: it boils faster and the temperature stays at 100 degrees
  Celsius.
- Swap the metal spoon in the soup for a wooden one: the handle stays cool, which shows the
  transfer was conduction through the material.
- Shine only green light on the red shirt: it looks dark, which shows the color was in the light it
  reflected.

**The test is not "did I get the same answer". It is "did the answer move when the evidence moved".**
An explanation that returns the same answer under a changed condition is not an explanation, and
that failure is invisible to every automated check in this repo. Both exemplars carry this move as
an explicit step in every `worked_example` -- sometimes the last step, sometimes just before a
closing scope note; copy the habit, not the example.

## Register — write for a thirteen- or fourteen-year-old
- Hooks come from a thirteen/fourteen-year-old's world: a skateboard that keeps rolling after the
  push, bike brakes warm after a long hill, a seatbelt on a sudden stop, a balloon stuck to a
  sweater, a phone getting warm while it charges, ice going cloudy-then-clear in a drink, a hand
  warmer or a cold pack from the sports bag, a straw that looks broken in a glass, the pool that
  looks shallower than it is, a bass note felt through the floor at a concert, wifi dropping out at
  the back of the house. **NEVER** exams, college, careers, or "you will need this later".
- Sentences may run longer than a Grade 6 seed's — a thirteen-year-old handles a subordinate clause
  and a "because" that arrives mid-sentence — but one idea per sentence still holds. Concrete nouns
  and concrete numbers. Abstraction is fine when it is anchored: "a field" may be introduced as an
  idea, provided the same segment pins it to the compass needle that turns before the magnet
  touches it. **Do not talk down.** Re-read the two shipped Grade 7 seeds the curriculum names
  (`m7sci-u4-matter-and-energy-in-organisms.ts`, `m7sci-u1-data-graphs-and-conclusions.ts`) to
  hear what one grade below this one sounds like, then go one notch further, not two.
- Straight quotes only — no curly quotes anywhere in the file.
- US spelling and US conventions throughout ("meters", "color", "gram"). Use metric units for
  scientific quantities (meters per second, newtons, kilograms, grams, degrees Celsius, cubic
  centimeters, hertz) as the shipped MS science seeds do; US customary units are fine in an everyday
  hook (a speedometer in miles per hour). Write currency plainly with a plain dollar sign (`$12`,
  `$4.50`) — do not escape it. Currency is rare in this course and only plausibly appears in the
  three design-evaluation rows (2.4, 5.4, 8.3) and in row 8.4's benefit-versus-cost weighing, but
  when it appears it is written plainly.
- No contractions anywhere in authored prose: write "does not", "cannot", "it is". This applies to
  every text field you write — `script`, `keyIdeas`, `vocabulary` definitions, `steps`, `problem`,
  `answer`, `hints`, every `misconception_check` field (`question`, `misconception`, `correctsTo`),
  and `recap.mustRemember` — not just the segments where it is most visible.
- **Use ASCII hyphen-minus (U+002D, the `-` key on a keyboard) for every MINUS SIGN and negative
  number — everywhere, prose included. Never the Unicode minus sign U+2212 ("−").** This course has
  no numeric `expectedAnswer`, so the reason is not an untypeable answer; the reason is that
  temperatures below zero appear in this course's prose (a cold pack, a freezer, "-5 degrees
  Celsius"), and the practice and quiz surfaces render through a different pipeline from the voice
  surface. A U+2212 is easy to introduce by pasting from salvage material and invisible on
  inspection. Type `-5`, not `−5`. **Two related rules for this course:** never give a direction a
  sign — write "5 newtons to the left and 3 newtons to the right", not "-5 N and +3 N" — and never
  write an electric charge as a signed number; "negative charge" and "positive charge" are words.
- **This rule covers the minus sign and NOTHING ELSE. Do not ASCII-ify the rest of the file.**
  `×` (U+00D7), `÷` (U+00F7) and the em dash `—` are correct and expected characters, and sixteen
  shipped production seeds use them deliberately. Do not "fix", strip or replace them, and if you run
  a character sweep before finishing, make it hunt U+2212 specifically rather than non-ASCII
  generally. Inside authored strings this course's house style for a spoken pause is ` -- ` (two
  ASCII hyphens), matching every shipped `m7sci-*` seed; em dashes belong in the file's doc comment,
  where both exemplars use one. (Subscript digits in chemical formulas are governed by the
  formula rule in "WHAT THE STUDENT CAN LOOK AT", not by this one.)
- **Label wrong-vs-right examples explicitly** (`WRONG: ... CORRECT: ...`) so a tutor reading aloud
  can never present an error as a model. This matters more here than anywhere: a spoken false claim
  is indistinguishable from a spoken true one.
- `misconception_check` names the error, then corrects it in full — never leave a misconception
  unresolved, and never leave it corrected only by contradiction. Say why the wrong picture is wrong.

## No problem-bank items — that is scripted, not authored
Do not write, edit, or propose problem-bank items. Bank items for this wave are SCRIPTED via `generate-bank-items.ts`, not agent-authored. Your only deliverable is the one seed file for your row; the `Bank dir` (`src/data/problem-bank/grade-8-physical-science/`), `Portal key` (`GRADE_8_SCIENCE`), `Bank item ids` (`m8sci-<slug>-NNN`) and `difficulty spread` fields in `m8sci-CURRICULUM.md`'s header are for that separate scripted step and are not your concern.

## Content scope — stay inside your row, stay inside PHYSICAL SCIENCE, and stay under the ceiling

Three boundaries, and they work differently from one another.

**Sideways, within Grade 8.** Do not bleed into a neighboring row. Many rows in this course
deliberately share a standard and split by law, by force type, or by pedagogical stage — 2.1, 2.2
and 2.3 split MS-PS2-2/PS2-1 by law; 3.2 and 3.3 split MS-PS2-3 by force type; 4.3 follows energy
changing form inside one system while 4.4 follows it moving between objects; 6.2 is the
change-of-state consequence of adding thermal energy while 6.3 is the volume/density consequence;
7.1 is the picture-level half of MS-PS1-1 while 7.4 is the formula-reading half; 9.2 names the wave
measures while 9.4 relates amplitude to energy; 10.1 is what happens at a surface while 10.2 is
bending at a boundary. Read your row's scope sentence in `m8sci-CURRICULUM.md` and the scope
sentences of the rows on either side of it, and stay on your side of the split. Naming a neighbor
row in one sentence to say what you are NOT doing is good practice — teaching it is scope bleed.

**Across the domain rotation.** Grade 6 and Grade 7 are DIFFERENT SCIENCES, not easier versions of
this one — see the boundary-shape table at the top of this contract if you have not already. This
course's relationship to them is specific: it supplies the MECHANISM underneath phenomena they
described, and the curriculum names, row by row, the Grade 6 or Grade 7 file whose phenomenon may be
cited as an EXAMPLE. The rule at that edge is one sentence, as an example, and stop. A sideways drift
does not announce itself: a sentence about how the mantle's convection moves plates in a Grade 8
heat-transfer lesson feels like a satisfying connection. It is not. It is Grade 6 row 4.2.

**Upward, into HS Chemistry and AP Physics.** This is the boundary the sibling courses do not have,
and it is quantitative as much as topical: the same science with more mathematics. The quantitative
ceiling at the top of this contract is the rule; the table below names the file that owns each
withheld piece. An upward drift feels like thoroughness — one more formula, one more layer of the
atom — and it turns a Grade 8 row into an HS one.

The `Explicitly excluded` section of `m8sci-CURRICULUM.md` is authoritative; read it before
writing. The concrete form of it is this table. A blanket word ban would fail, because several of
these words are REQUIRED by a Grade 8 row and only the mechanism or the mathematics behind them is
off-limits — so each entry says what is allowed and what is not, and why.

| Idea | Allowed at Grade 8, as | Not allowed at Grade 8, because |
|---|---|---|
| gravity and orbits | gravity is attractive, grows with the masses, weakens with distance; mass versus weight (row 3.1); "gravity keeps the Moon in orbit" as a one-sentence example of a force acting across distance | the orbit model, the solar system, planets, seasons, phases — `m6sci-u1-gravity-and-orbital-motion.ts` and the rest of Grade 6 Units 1-2; and F = Gm₁m₂/r² or any inverse-square arithmetic — HS-PS2-4, declined at the formula level (sign-off 5). The legacy "40 times farther → 1600 times weaker" item is NOT carried |
| convection in Earth's systems | mantle convection, sea breezes and ocean currents named as EXAMPLES of convection, one sentence each (rows 5.2, 6.3) | plates, boundaries, landforms, fronts, named currents, climate — `m6sci-u4-earths-plates-and-mantle-convection.ts`, `m6sci-u6-*`, `m6sci-u8-*` |
| the water cycle | evaporation, condensation, freezing and melting as changes of state of a PURE substance, with the water cycle cited once as an example (row 6.2) | modelling the cycle, runoff, groundwater, precipitation as a system — `m6sci-u7-the-water-cycle-evaporation-condensation-precipitation.ts`, `m6sci-u7-the-water-cycle-groundwater-and-runoff.ts` |
| radiation and the atmosphere | radiation as the transfer mode that needs no matter (row 5.2); sunlight crossing empty space (row 10.3) | the greenhouse effect, the CO₂ record, fossil-fuel use as a climate topic, evidence for warming — `m6sci-u10-*`; no row here uses "greenhouse" as content |
| minerals and material properties | characteristic properties for identifying a pure substance: melting point, boiling point, density, solubility, conductivity, flammability (row 6.4) | hardness, streak, luster, cleavage, mineral-versus-rock — `m6sci-u3-identifying-minerals-by-their-properties.ts`; a different property set for a different purpose |
| resources and society | one stated benefit and one stated cost of a synthetic material (row 8.4) | resource classification, distribution, population and consumption as a systems question — `m6sci-u9-*`, `m6sci-u10-*` |
| energy and matter in living things | "energy is released, not made" and "atoms are rearranged, never destroyed" cited as rules the student already holds from Grade 7 (rows 4.3, 8.2), then generalised to NON-living systems | photosynthesis, cellular respiration, glucose, or any organism as a worked example — `m7sci-u4-photosynthesis.ts`, `m7sci-u4-cellular-respiration.ts`, `m7sci-u4-energy-for-living-things.ts`, `m7sci-u4-matter-and-energy-in-organisms.ts` |
| diffusion | "particles spread out" as the general particle model (row 6.1) | membranes, cells, osmosis — `m7sci-u2-diffusion-and-osmosis.ts` |
| cycles of matter | conservation of atoms at the reaction scale (row 8.2) | matter cycling through ecosystems — `m7sci-u9-cycles-of-matter.ts` |
| investigation | "change one thing and hold the rest fixed" applied inside a worked example or a plan-the-test item (rows 2.2, 3.3, 5.3) | teaching testable questions, hypotheses, independent/dependent/controlled variables, fair tests or correlation-versus-causation as a topic — `m7sci-u1-*` (four files); assumed, never re-taught |
| speed, graphs and motion | speed = distance ÷ time with small whole numbers; "flat means at rest, steeper means faster" in words (rows 1.1, 1.2); acceleration as any change in velocity (1.3) | slope as a unit rate or an equation of a line — Grade 8 Math rows 3.1 and 3.3 (`m8math-CURRICULUM.md`), so this course never says "slope"; a = Δv/t, vectors, angled forces, free-body diagrams — `ap-physics-newtons-second-deep.ts`, `ap-physics-c-mech-calculus.ts` |
| F = m × a | forward, with small whole numbers, choosing the stated result (row 2.2) | rearranging for an unknown mass, any two-dimensional case — `ap-physics-newtons-second-deep.ts` |
| collisions and safety | "spreads the stopping force over a longer time or a larger area", in words (row 2.4) | momentum, impulse, work = force × distance, ½mv², mgh — `ap-physics-c-mech-energy-momentum.ts` |
| electric force | two kinds of charge, like repel / opposite attract, rubbing transfers charge, strength depends on amount of charge and distance (row 3.2) | Coulomb's law, computed fields, capacitance — `ap-physics2-electrostatics.ts`, `ap-physics-2-electrostatics.ts` |
| "current" | the word only, as the electricity supplied to an electromagnet's coil, one of the factors that set its strength (row 3.3) | current electricity as a topic, circuits, voltage, resistance, V = IR — `ap-physics2-circuits.ts`; EXCLUDED ENTIRELY (sign-off 6). The legacy `g8-sci-electricity.ts` concept-current segment and its numeric V = IR item are NOT carried |
| magnetism | poles, like repel / opposite attract, strength factors, a field as the region where the force acts (rows 3.3, 3.4) | the right-hand rule, force on a moving charge, induction, field-line mathematics — `ap-physics2-magnetism.ts` |
| kinetic energy | "double the mass → double the energy; double the speed → four times", as a described relationship read off a word-table (row 4.1) | KE = ½mv² in joules, momentum — `ap-physics-c-mech-energy-momentum.ts`; the legacy `g8-sci-forces-energy.ts` joule calculations are NOT carried |
| potential energy | stored by arrangement — height, stretch, magnets pushed together — ranked, never computed (row 4.2) | PE = mgh, spring constants — AP Physics |
| thermal energy | temperature versus thermal energy in the particle picture (5.1); mechanisms (5.2); "depends on mass and material" from described data (5.3) | the kelvin scale, absolute temperature — `chem-u7-kinetic-molecular-theory.ts`; specific heat as a number, q = mcΔT — `chem-u9-specific-heat-calorimetry.ts`; laws of thermodynamics, entropy, heat engines — `ap-physics2-thermo.ts`, `ap-physics-2-thermodynamics.ts` |
| gases and changes of state | the particle model of the three states (6.1); the temperature plateau during a change of state, in words (6.2) | gas laws, pressure-volume-temperature relationships — `chem-u7-gas-laws.ts`; heating-curve arithmetic, q = mΔH, vapor pressure — `chem-u7-phase-changes-heating-curves.ts` |
| density | mass packed into a volume, compared between described samples; warm fluids rise because they are less dense (6.3) | density as a conversion factor, dimensional analysis, significant figures — `chem-u1-density-dimensional-analysis.ts`, `chem-u1-measurement-sig-figs.ts`; buoyant force, Archimedes, pressure — `ap-physics2-fluids.ts` (sign-off 10). The legacy `g6-sci-density-buoyancy.ts` buoyancy segment is NOT carried |
| classifying matter | pure substance versus mixture (6.4); element, compound, mixture at the particle-picture level (7.1) | homogeneous/heterogeneous, fixed ratio, separation methods — `chem-u1-classifying-matter.ts` |
| inside the atom | nucleus of protons and neutrons, electrons around it, atomic number = proton count, neutral atom has equal protons and electrons (7.2) | isotopes, mass number, average atomic mass, electron shells and configurations, the history of atomic models, ion formation — `chem-u2-subatomic-particles-isotopes.ts`, `chem-u2-average-atomic-mass.ts`, `chem-u2-electron-configurations.ts`, `chem-u2-atomic-theory.ts`, `chem-u3-ion-formation.ts` |
| the periodic table | period and group by position, symbol, atomic number, metal/nonmetal/metalloid, "same group behaves alike" as an observation (7.3) | valence electrons as the REASON for group behavior, periodic trends — `chem-u3-periodic-table-organization.ts`, `chem-u3-periodic-trends.ts`. The legacy `g7-sci-periodic-table-intro.ts` misconception segment's electron-configuration explanation is NOT carried |
| formulas and molecules | reading a given simple formula aloud with its atom count; molecules versus extended structures (7.4) | writing formulas from names, subscripts versus coefficients, polyatomic ions, ionic/covalent bonding, Lewis structures, naming — `chem-u4-naming-compounds-formulas.ts`, `chem-u4-ionic-bonding.ts`, `chem-u4-covalent-bonding-lewis.ts` |
| reactions | before-and-after property comparison (8.1); reactants regrouped into products, atoms counted from a word description, mass conserved, open versus sealed (8.2) | arrow equations, coefficients, balancing, reaction types, activity series, redox — `chem-u5-reaction-types.ts`, `chem-u5-balancing-equations.ts`, `chem-u5-*`; the mole, molar mass, stoichiometry — `chem-u6-*`. The legacy files' `2 H₂ + O₂ → 2 H₂O`, `NaHCO₃ + CH₃COOH → …` and `show_balanced_equation` are NOT carried |
| warming and cooling reactions | "the mixture gets warmer" / "gets colder", and a device judged by whether it releases or absorbs, how much, how fast (8.3) | exothermic/endothermic as ΔH-signed quantities, bond-energy accounting, reaction rates, collision theory, equilibrium — `chem-u9-endothermic-exothermic.ts`, `chem-thermochemistry.ts`, `chem-u9-*` |
| dissolving | a physical change, in row 8.1 only | solutions, molarity, solubility curves, colligative properties — `chem-u8-*` |
| nuclear | NOTHING — no row touches it | nuclear chemistry, mass-to-energy, E = mc², acids, bases, pH — `chem-u10-*`. The legacy `g7-sci-conservation-mass.ts` "mass to energy in nuclear reactions" aside is NOT carried (row 8.2) |
| synthetic materials | traced to a natural resource and the reaction that changed it, with stated properties, one benefit and one cost (8.4) | polymer chemistry, organic naming — `chem-organic-intro.ts` |
| wave measures | amplitude, wavelength, frequency in hertz read from a description; pitch and loudness (9.2); amplitude ↔ energy as an observation (9.4) | period, phase, "energy proportional to amplitude squared", intensity — AP Physics |
| wave speed | set by the medium; same medium → higher frequency, shorter wavelength; distance = speed × time with small whole numbers (9.3) | v = fλ with scientific notation or unit conversion — the legacy `g8-sci-wave-properties.ts` 100 MHz / 3 × 10⁸ example is the boundary crossed, and is NOT carried |
| light at a boundary | reflect / absorb / transmit, why we see, why a red object is red (10.1); bending because the speed changes, what a lens does in words (10.2) | Snell's law, ray-diagram construction, the thin-lens equation, interference — `ap-physics2-optics.ts`, `ap-physics-2-optics.ts` |
| the electromagnetic spectrum | ordered by wavelength, radio to gamma, one everyday use each (10.3) | photon energy, wave-particle duality, atomic transitions — `ap-physics2-modern.ts` |
| living things and Biology | none — no row in this course concerns living systems | `bio-u3-atp-and-energy.ts`, `bio-u3-cellular-respiration.ts`, `bio-u3-photosynthesis.ts` continue "energy in living things" on the life-science track, not here |
| engineering design | the practice, implicit in the three design-evaluation rows (2.4, 5.4, 8.3) | MS-ETS1 as its own topic — not an MS-PS standard, not given a row; `g8-sci-engineering-design.ts` is not salvaged (sign-off 9) |

If your row's own scope description in the curriculum explicitly asks for something on the
right-hand column (it will not), the curriculum wins — and say so in your report — but check first
that you have not simply reached past your row's stated scope into a sibling course's subject or
above the ceiling.

## Salvage — mine these, never edit or import them
| Source | Notes |
|---|---|
| `m7sci-u*.ts` (40 shipped Grade 7 Life Science seeds) | The closest SHIPPED prior art for SHAPE, PACING, VOICE and the words-only discipline — read `m7sci-u4-matter-and-energy-in-organisms.ts` and `m7sci-u1-data-graphs-and-conclusions.ts` for granularity and register, and note that one topic is one 20-to-25-minute lesson, never a week's work. **Their CONTENT is life science and is out of scope for every row in this course.** Copy structure and register; never copy a single sentence of subject matter. |
| `m6sci-u*.ts` (40 Grade 6 Earth & Space seeds, built in the previous drop of this wave — not yet shipped) | The closest prior art for a science course written under THIS contract's mechanisms: every file carries a SCOPE GUARD, was written to the claim-ledger and DF-3 discipline, and describes its pictures in words. Read one for the FORM of those things. **Their CONTENT is Earth and space science and is out of scope here**, and — per "shipped content is not a source" — they are no more a factual authority than the legacy files. Copy the form; never copy subject matter. |
| **Legacy physical-science files** — `g8-sci-newtons-laws.ts`, `g8-sci-forces-energy.ts`, `g8-sci-chemistry-intro.ts`, `g8-sci-wave-properties.ts`, `g8-sci-sound-light.ts`, `g8-sci-electricity.ts`, `g8-sci-solar-system-beyond.ts` (gravity keyIdeas only), `g7-sci-newton-laws-bridge.ts`, `g7-sci-chemical-reactions-intro.ts`, `g7-sci-conservation-mass.ts`, `g7-sci-periodic-table-intro.ts`, `g6-sci-energy-forms.ts`, `g6-sci-heat-transfer.ts`, `g6-sci-density-buoyancy.ts`, `g6-sci-atoms-elements.ts` (all legacy, pre-`m<N>sci`, never imported) | The fifteen legacy files whose subject matter is genuinely physical science. The curriculum's per-row Salvage column says exactly which segment of which file maps to which row — hooks (empty versus loaded shopping cart; a match struck; a campfire; "everything from about 90 building blocks"), keyIdea framings, misconception text (forces all cancel; energy used up; cold flows out of the freezer; salt is just sodium and chlorine mixed; louder means higher; explosions are loud in space movies), and worked-example ideas — and what NOT to carry forward. **Every one of these files fails this course's rules in at least one way, and the curriculum's warning is exact: every legacy try item is `responseFormat: 'free'` or `'numeric'` and must be recast as a four-choice MCQ; every arrow equation (`2 H₂ + O₂ → 2 H₂O`, the baking-soda-and-vinegar equation, `show_balanced_equation`) is dropped; every formula-with-units calculation (½mv² and mgh in joules, the "1/r², 40 times farther → 1600 times weaker" item, V = IR, the 3 × 10⁸ m/s radio-wave wavelength, period T = 1/f, the 343 m/s echo arithmetic, the numeric density-of-rock item, Archimedes) is dropped; the nuclear asides (`g7-sci-conservation-mass.ts`'s E = mc² misconception, `g6-sci-energy-forms.ts`'s nuclear-energy bullet) are dropped; and `g7-sci-periodic-table-intro.ts`'s electron-configuration explanation of group behavior is dropped.** These files also predate the register rules: they use curly apostrophes, arrows (→), contractions and bare unit abbreviations. Mine the ideas, rewrite the prose. |
| The remaining legacy `g8-sci-*`, `g7-sci-*`, `g6-sci-*` files | `g8-sci-climate-change` (Grade 6 Unit 10), `g8-sci-engineering-design` (MS-ETS1, not a PS standard), `g8-sci-genetics-heredity` (Grade 7 Unit 6), `g8-sci-solar-system-beyond` beyond its gravity keyIdeas (Grade 6 Unit 1), and every remaining `g6-sci-*` / `g7-sci-*` life and Earth file (`body-systems`, `cells`, `climate-weather`, `earth-interior`, `ecosystems`, `rocks-minerals`, `water-cycle`, `energy-flow-ecosystems`, `evolution-selection`, `genetics-punnett`, `geologic-time`, `plate-tectonics`). **Out of scope for this course. Do not open them for content.** |

## The full course chain (for prerequisites / followUps)
`prerequisites` = [loId of the PREVIOUS row]; `followUps` = [loId of the NEXT row]. Row 1.1 has `prerequisites: []`; row 10.4 has `followUps: []`. Every other row populates BOTH arrays with the true previous-row and next-row loIds from the table below — always, no exceptions. All loIds are `m8sci.<slug>`. The Standard column below is the REAL NGSS code (a performance expectation such as `MS-PS2-2`, or a disciplinary core idea such as `PS2.A` where the curriculum notes that no PE names the topic directly) and it goes in the LO `description` PROSE only; the `standard` FIELD is always `M8SCI-<u>.<t>`.

**Do not copy the two exemplars' empty `prerequisites: []` / `followUps: []`.** Those are empty only because `lint-ms-plans` rejects a chain reference that does not resolve to an already-registered LO, and the exemplars are registered first and alone, before their neighboring rows exist — that is a lint artifact of registration order, not the pattern to follow. All 40 lessons (the 2 exemplars plus the 38 fan-out rows) are registered together in a single controller commit, and the exemplars' chain fields get wired to their real neighbors at that same time. So write your row's real previous/next loIds from the table now — never worry that a target does not yet exist on disk; it will exist by the time the batch is registered and linted.

| # | Slug | Title | NGSS (prose only) |
|---|---|---|---|
| 1.1 | motion-reference-points-and-speed | Motion, Reference Points & Speed | PS2.A |
| 1.2 | reading-distance-time-graphs | Reading Distance-Time Graphs | PS2.A |
| 1.3 | velocity-and-acceleration | Velocity & Acceleration | PS2.A |
| 1.4 | forces-and-net-force | Forces, Net Force & Balanced Forces | PS2.A |
| 2.1 | newtons-first-law-inertia-and-friction | Newton's First Law: Inertia & Friction | MS-PS2-2 — **(exemplar — written)** |
| 2.2 | newtons-second-law-force-mass-and-acceleration | Newton's Second Law: Force, Mass & Acceleration | MS-PS2-2 |
| 2.3 | newtons-third-law-action-reaction-pairs | Newton's Third Law: Action-Reaction Pairs | MS-PS2-1 |
| 2.4 | collisions-and-designing-for-safety | Collisions & Designing for Safety | MS-PS2-1 |
| 3.1 | gravity-mass-distance-and-weight | Gravity: Mass, Distance & Weight | MS-PS2-4 |
| 3.2 | electric-forces-and-charge | Electric Forces & Charge | MS-PS2-3 |
| 3.3 | magnetic-forces-and-electromagnets | Magnetic Forces & Electromagnets | MS-PS2-3 |
| 3.4 | fields-forces-without-contact | Fields: Forces Without Contact | MS-PS2-5 |
| 4.1 | kinetic-energy-mass-and-speed | Kinetic Energy: Mass & Speed | MS-PS3-1 |
| 4.2 | potential-energy-and-position | Potential Energy: Stored by Position | MS-PS3-2 |
| 4.3 | energy-transformations-and-conservation | Energy Transformations & Conservation | PS3.B |
| 4.4 | energy-transfer-when-motion-changes | When Motion Changes, Energy Is Transferred | MS-PS3-5 |
| 5.1 | temperature-and-thermal-energy | Temperature & Thermal Energy | PS3.A |
| 5.2 | conduction-convection-and-radiation | Conduction, Convection & Radiation | PS3.A |
| 5.3 | mass-material-and-temperature-change | Mass, Material & Temperature Change | MS-PS3-4 |
| 5.4 | insulators-conductors-and-thermal-design | Insulators, Conductors & Thermal Design | MS-PS3-3 |
| 6.1 | the-particle-model-and-states-of-matter | The Particle Model & States of Matter | PS1.A |
| 6.2 | changes-of-state-and-thermal-energy | Changes of State & Thermal Energy | MS-PS1-4 |
| 6.3 | density-thermal-expansion-and-why-warm-fluids-rise | Density, Thermal Expansion & Why Warm Fluids Rise | MS-PS1-4 |
| 6.4 | characteristic-properties-identify-a-substance | Characteristic Properties Identify a Substance | PS1.A |
| 7.1 | elements-compounds-and-mixtures | Elements, Compounds & Mixtures | MS-PS1-1 |
| 7.2 | inside-the-atom | Inside the Atom: Protons, Neutrons & Electrons | PS1.A |
| 7.3 | reading-the-periodic-table | Reading the Periodic Table | PS1.A |
| 7.4 | molecules-formulas-and-extended-structures | Molecules, Formulas & Extended Structures | MS-PS1-1 |
| 8.1 | evidence-of-a-chemical-reaction | Evidence of a Chemical Reaction | MS-PS1-2 — **(exemplar — written)** |
| 8.2 | rearranging-atoms-and-conservation-of-mass | Rearranging Atoms & Conservation of Mass | MS-PS1-5 |
| 8.3 | reactions-that-release-or-absorb-thermal-energy | Reactions That Release or Absorb Thermal Energy | MS-PS1-6 |
| 8.4 | synthetic-materials-from-natural-resources | Synthetic Materials from Natural Resources | MS-PS1-3 |
| 9.1 | what-a-wave-is | What a Wave Is | PS4.A |
| 9.2 | amplitude-wavelength-and-frequency | Amplitude, Wavelength & Frequency | MS-PS4-1 |
| 9.3 | wave-speed-frequency-and-wavelength | Wave Speed, Frequency & Wavelength | PS4.A |
| 9.4 | amplitude-and-wave-energy | Amplitude & Wave Energy | MS-PS4-1 |
| 10.1 | reflection-absorption-and-transmission | Reflection, Absorption & Transmission | MS-PS4-2 |
| 10.2 | refraction-bending-light-at-a-boundary | Refraction: Bending Light at a Boundary | MS-PS4-2 |
| 10.3 | light-versus-sound-and-the-electromagnetic-spectrum | Light versus Sound & the Electromagnetic Spectrum | PS4.B |
| 10.4 | analog-and-digital-signals | Analog & Digital Signals | MS-PS4-3 |

**What goes in `los[0].description`, the segment `goal` fields and the `SCOPE GUARD` — CONTROLLER RULING 2026-09-03, uniform across all four Grade 8 contracts.** The LO `description` is STUDENT-FACING: the academy renders it as the lesson's learning objective on public course pages, and it is the text the bank-item generator grounds on. Every Grade 8 scope cell in `m8sci-CURRICULUM.md` has three parts: (i) the **positive statement** of what the student does in this lesson; (ii) the **lineage clause** ("Builds on …", "Deepens …", "Assumes …", "Extends …" naming a `m7*`/`m6*` file and what it taught); (iii) the **withheld clause** ("Withholds: …", "Not yet …", "Stops short of …", "→ `alg1-…`" naming the owning file). `los[0].description` carries part (i) VERBATIM (the only edits while copying: Unicode minus U+2212 → ASCII `-`, curly quotes → straight, and dropping any backticks), followed by the standards citation in parentheses (the performance expectation or DCI in the form the shipped seeds use, e.g. `(NGSS MS-PS2-2)` or `(NGSS DCI PS2.A)` — see "Real standards go in PROSE only"). Parts (ii) and (iii) NEVER appear in the description or in any spoken field: no file names, no backticks, no "Grade 7", "G7", "Grade 6", "Algebra 1", "HS", "UNVERIFIED", "sign-off" or arrow. Both go into the file's `SCOPE GUARD` doc comment, VERBATIM from the cell, where a reviewer and the next agent reading the file as salvage can see the lineage and the boundary. Where part (i) itself ends in a short "without yet …"/"not yet …" phrase written in plain words (no file name), keep it — the shipped Grade 6 seeds do exactly that. Do not shorten part (i) into the title and do not paraphrase it. Each segment's own `goal` field (on `hook` and `concept`) is a short, segment-specific purpose line you write yourself, anchored to part (i), exactly as both exemplars show. Read the whole scope cell before writing any of the three. **Addendum (2026-09-03, from the exemplar authors):** words in part (i) that describe the AUTHORING or the ITEM rather than the skill are dropped from `los[0].description` while copying — "invented" (as in "for several invented places"), "described" as a qualifier ("a described table" → "a table"), "written out in words", "from choices", "picking the correctly stated result", "assessed as …", and any parenthetical that cites a sign-off or a sibling row. They remain binding on how you WRITE the item. The description a student reads names the skill and the material, not the authoring convention. **Second addendum (same day, from the science and geography exemplar authors):** ALSO drop from the description any parenthetical or clause that refers to the curriculum's own structure — "from 6.4", "(first of three lessons sharing MS-PS2-2, split by law)", "(shares … with Topic 3)", "(the stage-two half of …)", "see sign-off N", "row 6.2" — a student never sees the curriculum table. And convert an em dash inside the description to ` -- ` (the shipped `m6sci`/`m7sci` descriptions all use ` -- `; keep the surrounding words). Cite the standard ONCE, at the end.

## Real standards go in PROSE only
Put the NGSS code inside the LO `description` sentence, the way the exemplars do — a performance expectation (`MS-PS1-2`, `MS-PS2-2`, `MS-PS3-4`, `MS-PS4-1`) where the curriculum row cites one, or a disciplinary core idea (`PS1.A`, `PS2.A`, `PS3.A`, `PS3.B`, `PS4.A`, `PS4.B`) where the curriculum row cites that instead. The `standard` FIELD is always `M8SCI-<u>.<t>` and must never contain an NGSS code or the substrings `frq|dbq|leq|saq`.

## Before you finish
You cannot run the full lint (it selects all MS plans and will report other units' in-flight state). Instead:
1. `cd apps/tutor && npx tsc --noEmit` — must be clean, 0 errors. This catches every type and syntax mistake.
2. Re-read your file, aloud, as a thirteen- or fourteen-year-old would hear it. Any sentence you stumble on is too long; any sentence that sounds like it is talking to a ten-year-old is too short.
3. Go through the fifteen SCIENCE ACCURACY RULES one at a time and check your file against each. Do not skim them as a block — the rule you skip is the one you broke.
4. Take every factual sentence in the file separately and ask whether a working physicist or chemist would sign it. Replace anything you cannot answer yes to; do not hedge it.
5. Check every number you stated against the safe-figure list. If it is not on that list and not equally settled, replace it with a comparison or a direction.
5a. **Check every quantity for its unit and every formula for its words.** Search the file for a bare digit not followed by a unit in words, for a bare abbreviation (`m/s`, `N`, `kg`, `J`, `Hz`) standing without the words beside it, for any formula beyond the three allowed (speed = distance ÷ time, F = m × a, speed = frequency × wavelength, and distance = speed × time), for any arrow (`→`) or coefficient-plus-formula pattern that would make a symbolic equation, and for any subscript formula not accompanied by its spoken form and atom count. If your row is 2.4, 5.4 or 8.3, confirm each design-evaluation item states every material property and criterion the evaluation needs.
6. Re-check every MCQ: is `expectedAnswer` byte-identical to the `correct: true` choice's `text`? Is that choice the only defensible one under every reading of the stem? Can you name the misconception behind each of the other three?
6a. Compute `(u + t) mod 4`, `(u + t + 1) mod 4`, `(u + t + 2) mod 4` for your row and confirm your three keys sit at exactly those indices of `choices`, with ids `a`-`b`-`c`-`d` still in sequence and no `undefined` entries. Confirm no hint refers to a choice by letter or position.
6b. Confirm each `worked_example` carries the two-part verification move (as its last step, or just before a closing scope note): three clues of different kinds that agree, and one contrasting case where a single changed condition moves the answer.
6c. **Run the DF-3 length check.** Measure the character length of all four choices in each item and count how many of your three items have the key as strictly the longest choice, and how many have it strictly shortest. Then run the stem-hidden test: cover the stem, read only the four choices, and ask whether the longest or the most carefully qualified one is guessable. Where an item fails that test, fix it by **lengthening distractors, never by shortening the key**. **The count is a diagnostic to report, not a score to minimise** — a key is longest by chance 25% of the time, three items cannot distinguish chance from bias, and zero is not the target. Do not grow a distractor past what its error honestly justifies in order to move the number. Report both counts and the four lengths per item.
7. Confirm all three `try_yourself` segments are `responseFormat: 'mcq'` with 4 choices and exactly one `correct: true`, and that none of them carries a `rubric`.
8. Confirm segment order, keyIdeas count (4-6), plan `estimatedMinutes` 18-22 with segment minutes summing to within 1, and that `prerequisites`/`followUps` use the real previous-row/next-row slugs from the table above — not empty arrays.
9. Search your file for anything the student cannot see: "diagram", "figure", "image", "picture", "shown", "above", "below", "graph", "table", "equation" used as a visual reference. Every one of them must either be a written-out description or be gone.
10. Search your file for the Unicode minus sign "−" (U+2212) specifically and replace every instance with the ASCII hyphen-minus "-". Search separately for curly quotes and curly apostrophes and replace them with straight ones, and for the arrow "→", which must not appear in authored strings at all. All three are easy to introduce by pasting from the legacy `g8-sci-*` / `g7-sci-*` / `g6-sci-*` salvage files, which contain them. **Do not run a blanket non-ASCII sweep**: `×`, `÷` and the em dash are legitimate and must survive untouched.
11. Confirm your file's doc comment has a `SCOPE GUARD:` paragraph naming your row's boundary against its Grade 8 neighbors, Grade 6 Earth & Space science, Grade 7 life science, and HS Chemistry / AP Physics above it — with the upward clause naming the specific formula, quantity or structure you stopped short of.
12. **Build your claim ledger by re-reading the finished file top to bottom**, not from memory of what you meant to write. Sweep `keyIdeas`, `vocabulary`, `script`, every `steps` entry, every `answer`, every `problem`, **every distractor, every hint** and every `misconception_check` field, and fill in the third column for each row as you go. **Where a row is arithmetic, write the arithmetic out with its units rather than asserting that the numbers work** — that is the step that catches an order-of-magnitude error, a wrong energy ratio, or a miscounted atom, and prose review does not. Any row whose third column comes out weak, or that you can only ground on "a shipped seed says so" or "the legacy file says so", is a lesson defect to fix now, not a ledger entry to submit.
13. **Re-read your own SCOPE GUARD against the finished body, clause by clause.** Take each sentence of the guard on its own and find the evidence for it in the file — grep for the term you claimed is absent, count the mention you claimed is limited, open the segment you claimed does not go there. A guard written before the body and never re-checked against it is the defect this step exists to catch. If a clause is not true of what you actually wrote, fix the clause or fix the body; do not leave them disagreeing.

Do NOT commit. The controller commits and runs the gate.

## Report back

Return, in your report:

1. The file path you wrote, and your row number, slug and export symbol.
2. **The complete claim ledger — every factual claim you asserted, in the three-column format above.
   The science review pass reads this and spot-verifies it.** A claim you leave out is a claim nobody
   checks.
3. The choice ids carrying `correct: true` in each of your three items, and the `(u + t + i) mod 4`
   values you computed for them, so the position rule can be checked without re-deriving it.
4. **The DF-3 length measurement, reported as a diagnostic and not as a score:** how many of your three items have the key strictly longest, how many have it strictly shortest, and the character lengths of all four choices in each item. There is no target number — a key is longest by chance 25% of the time and three items cannot distinguish chance from bias, so these figures exist to feed the course-level aggregate taken at registration across all 120 items. Also report which distractors you deepened and what reasoning you added, and say plainly if any item still has the key longest because the key genuinely needed the words. That is a legitimate outcome, not a confession.
5. Which of the fifteen SCIENCE ACCURACY RULES your row came closest to breaking, and what you
   changed to stay clear of it. If the honest answer is "none of them were close", say that — it is
   useful information about which rows carry the risk.
6. Which boundary in the Content scope table your row sits nearest to — sideways OR upward — and the
   specific sentence you chose not to write because of it. If it was upward, name the formula or
   structure you stopped short of.
7. Confirmation that `npx tsc --noEmit` is clean, and anything a reviewer should double-check.

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

24. **The em dash in `los[0].description` is decided PER SUBJECT. For SCIENCE, convert it
    to ` -- `.** The 2026-09-03 addendum said so and it was measured on the right corpus:
    across 64 shipped m6sci/m7sci descriptions the ` -- ` form appears 7 times and the em
    dash ZERO times. (The same measurement run on ELA came out the opposite way -- em dash
    24, ` -- ` zero -- so the ELA contract carries the opposite ruling. That is the point:
    **re-run a precedent comparison inside your own subject AND artifact type; never inherit
    a sibling course's measurement.**)

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

## Addendum — CONTROLLER RULING 32, from the first science batch (2026-09-04)

32. **A scope cell's own worked example cannot become one of your items.** Row 2.3's part (i)
    names both "you push the wall, the wall pushes you" and "a swimmer pushes water back,
    water pushes the swimmer forward". Part (i) is copied VERBATIM into `los[0].description`,
    and that field is STUDENT-FACING -- the academy renders it as the lesson objective. So an
    item built on the swimmer was answerable from the objective rather than from the law. The
    author caught it and moved to a hammer and nail.

    This is ruling 22's mechanism (a specimen leaking into an assessed item) arriving through
    a field ruling 22 does not list, because the leak is not something the author wrote -- it
    is inherited from the curriculum. **So: before writing items, read your own
    `los[0].description` as if it were a teaching segment, and treat every concrete example
    it names as burned.** Any row whose scope cell names a concrete example is exposed to
    this, and several Grade 8 cells do.

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

37. **(science only) Add row 5.1 — and any Unit 5/6 row that compares amounts — to the
    arithmetic-risk list** ("Unit 1 and rows 2.2, 4.1, 6.3, 8.2, 9.3"). 5.1 carried mass ratios
    of 10, 20 and 100 and three "not N times faster" claims that are only groundable through
    absolute temperature. A reviewer seeing no arithmetic ledger from 5.2–5.4 or 6.1–6.2
    should ask why.

38. **(after batch 3, four agents converged independently) "Never assume an apparatus" means:
    never require the student to HAVE, OPERATE or OBSERVE equipment.** It does not forbid
    describing an investigation that uses one. Rows whose performance expectation IS an
    investigation (a burner and thermometer, a syringe, a compass, a heated tank) describe the
    whole setup and every reading in words inside the segment that uses it, and no item asks
    for an observation the student must make themselves. This is the reading 3.4, 5.3, 6.1
    and the exemplars all used; it is now the ruling.

39. **The "three formulas only" ceiling does not forbid a quantity the row REQUIRES, taught in
    words.** Density in 6.3/6.4 is "divide the mass by the volume -- the grams in every cubic
    centimeter", with the division written out in words and digits; no symbolic formula, no
    `=` in a spoken string, no conversion-factor use. Same rule for any other required
    quantity: words and worked digits, never a symbol.

40. **(science only, after 7.4) The chemical-formula rule ("spoken form and atom count in the same
    sentence") yields to a row whose ASSESSED SKILL is producing the count.** In 7.4 the spoken form
    ("N H three (NH3)") is present in every stem, no subscript glyph appears anywhere, and the atom
    count is withheld ONLY in item stems and the problem statement of a worked example. The rule's
    mechanism (a subscript reads unpredictably aloud) is fully served; the item survives. Say so in
    the guard.
