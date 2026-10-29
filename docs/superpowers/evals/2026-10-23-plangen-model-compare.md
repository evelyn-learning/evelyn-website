# Plan generator model comparison — Haiku 4.5 vs Haiku 5.5 vs Sonnet 5

Date: 2026-10-22/23 · Harness: `apps/tutor/scripts/eval/plangen-model-compare.ts` (branch gac-29oct) · Raw JSONL: `/private/tmp/claude-501/-Users-luke-Dev-evelynlearning/4a161fe0-83a7-4975-9771-5713264fa71e/scratchpad/plangen-eval/synthetic/` · CSV: `docs/superpowers/evals/2026-10-23-plangen-model-compare.csv`

> **Status: SYNTHETIC-TOPIC RUN ONLY.** These are the brief's 30 hand-written typed topics, all three models generated fresh. The follow-up design change (baseline = 30 stored production Haiku 4.5 plans, real student inputs, replayed through Haiku 5.5 / Sonnet 5) is **not run**: the permission layer refused to let this session copy production plan ids/topics into the harness (flagged as production-data / PII handling). The 30 candidate production plans were identified read-only; running that part needs Praveen's explicit go-ahead.

## Settings

- Path mirrored: `/api/portal/v1/plan-generate`, typed topic, homework-help brand, no studentId — `text = topic =` the typed string; Stage 1 `extractLearningObjectives` → cap to `maxLOsForBudget(30 min, grade)` (the `homeworkNoPicker` branch) → Stage 2 `expandSegmentsForLOs` → namespace + `parseLessonPlan`; `fallbackPlan` on any failure, no retry. Prompts unchanged (production STAGE1/STAGE2 system prompts). No cache, no persistence.
- Haiku 4.5 (`claude-haiku-4-5-20251001`): exactly today's requests (`TUTOR_PLANGEN_EFFORT` unset; byte-identity asserted by `scripts/test-plangen-effort-knob.ts`).
- Haiku 5.5 / Sonnet 5: `TUTOR_PLANGEN_EFFORT=low` ⇒ `output_config: { effort: 'low' }` on both stages, Stage 1 `max_tokens` 1 500 → 4 000, Stage 2 8 192; default (adaptive) thinking; no sampling params.
- Keys: every try-yourself `expectedAnswer` through production `verifyAnswerKey` (content-verify = Sonnet 5, solve effort medium, judge low, no tie-break).
- Judge: `claude-opus-5-5`, adaptive thinking, effort low, JSON-schema output; per topic all plans shown together, model-blind, seeded random order; rubric (a) concept, (b) worked example, (c) try-yourself, (d) structure/time fit, 0–2 each. Fallback plans are not shown to the judge and score 0 (they pull Sonnet 5's means down: 3 of 30).
- Cost: generator usage × `model-rates.ts` (thinking tokens are billed as output and included).

## Results by model

| Model | Effort | Verified-key rate | Keys v / m / ill / u | Judge /8 | Concept | Worked | Try | Structure | Fallback rate | p50 S1 | p50 S2 | p50 total | p90 total | Cost / plan |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| haiku-4-5 | unset (today) | 92.3% | 131 / 7 / 4 / 0 (n=142) | 5.77 | 1.40 | 1.73 | 1.50 | 1.13 | 0/30 | 2.9 s | 14.6 s | 17.3 s | 20.0 s | $0.0115 |
| haiku-5-5 | low | 98.4% | 124 / 2 / 0 / 0 (n=126) | 7.20 | 1.90 | 1.93 | 1.67 | 1.70 | 0/30 | 1.7 s | 13.9 s | 15.8 s | 20.1 s | $0.0020 |
| sonnet-5 | low | 91.3% | 105 / 8 / 2 / 0 (n=115) | 5.43 | 1.63 | 1.53 | 1.47 | 0.80 | 3/30 | 4.7 s | 15.2 s | 19.5 s | 24.4 s | $0.0256 |

Spend: generation $1.173 · key verification (Sonnet 5) $1.940 · judge (Opus 5.5) $0.972 · **total $4.08**.

## Reliability

| Model | Fallbacks (reasons) | Stage errors | max_tokens stops | p90 S1 | p90 S2 | mean LOs | mean try-yourselves | mean out tokens S1 / S2 |
|---|---|---|---|---|---|---|---|---|
| haiku-4-5 | none | 0 | 0 | 3.3 s | 17.3 s | 4.7 | 4.7 | 313 / 1752 |
| haiku-5-5 | none | 0 | 0 | 2.1 s | 17.9 s | 4.2 | 4.2 | 300 / 3479 |
| sonnet-5 | p02-projectile: stage2: haiku returned non-JSON; p04-energy: stage2: haiku returned non-JSON; c03-limiting: stage2: haiku returned non-JSON | 0 | 0 | 5.4 s | 19.0 s | 4.4 | 3.8 | 513 / 1731 |

## Per topic

| Topic | Grade | haiku-4-5 judge · keys | haiku-5-5 judge · keys | sonnet-5 judge · keys |
|---|---|---|---|---|
| I don't get ratios and proportions | math 6-8 | 7 · 4/4✓ | 8 · 4/4✓ | 8 · 4/4✓ |
| how do I solve one-step and two-step equations | math 6-8 | 4 · 4/4✓ | 7 · 3/3✓ | 7 · 4/4✓ |
| solving systems of equations by substitution | math 9-10 | 7 · 5/5✓ | 8 · 5/5✓ | 4 · 0/1✓ 1✗ |
| factoring quadratics when a is not 1 | math 9-10 | 6 · 5/5✓ | 7 · 5/5✓ | 6 · 5/5✓ |
| exponent rules, negative and zero exponents | math 9-10 | 6 · 5/5✓ | 7 · 5/5✓ | 6 · 5/5✓ |
| how do I know if two triangles are similar | math 9-10 | 5 · 4/5✓ 1ill | 8 · 3/3✓ | 6 · 1/1✓ |
| circle theorems: inscribed angles and arcs | math 9-10 | 7 · 5/5✓ | 8 · 5/5✓ | 8 · 5/5✓ |
| SOHCAHTOA and finding missing sides | math 9-10 | 6 · 5/5✓ | 8 · 4/4✓ | 5 · 4/5✓ 1ill |
| logarithms — what are they and how do I solve log equations | math 11-12 | 7 · 5/5✓ | 8 · 3/3✓ | 4 · 4/5✓ 1✗ |
| arithmetic vs geometric sequences and their formulas | math 11-12 | 7 · 5/5✓ | 8 · 5/5✓ | 6 · 5/5✓ |
| probability of independent and dependent events | math 9-10 | 4 · 5/5✓ | 8 · 3/3✓ | 6 · 5/5✓ |
| the normal distribution and z-scores | math 11-12 | 5 · 2/4✓ 2✗ | 7 · 4/4✓ | 7 · 5/5✓ |
| Newton's second law problems with friction | physics 9-10 | 7 · 4/4✓ | 7 · 4/4✓ | 6 · 5/5✓ |
| projectile motion launched at an angle | physics 11-12 | 7 · 5/5✓ | 7 · 5/5✓ | FALLBACK · 0/0✓ |
| Ohm's law and series vs parallel circuits | physics 9-10 | 7 · 4/5✓ 1ill | 8 · 4/4✓ | 5 · 4/5✓ 1ill |
| conservation of energy with a roller coaster | physics 9-10 | 7 · 4/5✓ 1ill | 8 · 4/4✓ | FALLBACK · 0/0✓ |
| wave speed, frequency and wavelength | physics 9-10 | 5 · 4/4✓ | 5 · 5/5✓ | 4 · 1/1✓ |
| what is a mole and how do I convert grams to moles | chemistry 9-10 | 7 · 5/5✓ | 8 · 4/4✓ | 6 · 5/5✓ |
| balancing chemical equations | chemistry 9-10 | 7 · 5/5✓ | 7 · 5/5✓ | 7 · 5/5✓ |
| stoichiometry: limiting reactant problems | chemistry 11-12 | 4 · 3/5✓ 1✗ 1ill | 6 · 4/5✓ 1✗ | FALLBACK · 0/0✓ |
| the ideal gas law PV=nRT | chemistry 11-12 | 5 · 5/5✓ | 7 · 5/5✓ | 8 · 5/5✓ |
| pH and the difference between strong and weak acids | chemistry 11-12 | 7 · 5/5✓ | 8 · 5/5✓ | 6 · 5/5✓ |
| cellular respiration vs photosynthesis | biology 9-10 | 4 · 5/5✓ | 6 · 5/5✓ | 6 · 5/5✓ |
| Punnett squares and Mendelian genetics | biology 9-10 | 6 · 3/4✓ 1✗ | 7 · 5/5✓ | 6 · 5/5✓ |
| osmosis and diffusion across a cell membrane | biology 6-8 | 5 · 4/4✓ | 8 · 4/4✓ | 4 · 3/4✓ 1✗ |
| DNA replication steps | biology 11-12 | 4 · 5/5✓ | 5 · 4/4✓ | 7 · 5/5✓ |
| subject-verb agreement with tricky subjects | ela 6-8 | 3 · 3/4✓ 1✗ | 8 · 4/4✓ | 6 · 4/4✓ |
| how to write a strong thesis statement | ela 9-10 | 6 · 4/5✓ 1✗ | 5 · 2/3✓ 1✗ | 5 · 2/5✓ 3✗ |
| the main causes of World War I | history 9-10 | 4 · 4/5✓ 1✗ | 6 · 1/1✓ | 8 · 3/5✓ 2✗ |
| supply and demand and how prices settle | economics 11-12 | 7 · 5/5✓ | 8 · 5/5✓ | 6 · 1/1✓ |

Keys: `v/n✓` verified of checked, `✗` mismatch, `ill` ill-posed, `?` unverifiable.

## Judge-quoted factual errors

### haiku-4-5 (16)

- **m01-ratios** — "A ratio compares two quantities using the same units." — ratios can compare quantities with different units (e.g., rates like miles per gallon).
- **m02-equations** — "Operation: subtraction." — 3y − 7 = 14 also involves multiplication (3y), so subtraction alone is incomplete.
- **m03-systems-sub** — "Why do two lines intersect at exactly one point?" — two lines may be parallel (no intersection) or coincide (infinitely many).
- **m05-exponents** — "Undefined when base is zero (0⁰)." — 0^0 is better described as indeterminate or conventionally left undefined (often taken as 1); also negative exponents, which the student asked for, are omitted.
- **m06-similar** — "Triangle XYZ: angles 45°, 65°, 80°" sums to 190°, so it is not a valid triangle.
- **m11-probability** — "Calculate conditional probability for dependent events with replacement" is wrong: drawing with replacement makes the events independent, not dependent.
- **m12-normal** — "expectedAnswer":"34 to 66" is wrong: 68% for μ=50, σ=8 is 42 to 58. Also "0.82% or 0.0082" is wrong: z=(156−170)/6≈−2.33 gives about 0.99%.
- **p03-circuits** — "Series dims all bulbs when one fails; parallel only dims one." — wrong: in series the remaining bulbs go out, not dim; in parallel only the failed bulb goes out and the others are unaffected.
- **c03-limiting** — "2N₂ + 3H₂ → 2NH₃" is unbalanced (should be N₂ + 3H₂ → 2NH₃); with 6 mol N₂ and 9 mol H₂ the given ratio makes neither reactant limiting.
- **c04-gas-law** — "n = (2.0)(50)/(0.0821×298) = 4.08 mol" — 100/24.47 ≈ 4.09 mol, so this is a rounding error; also "Identify P, V, n, T variables and their SI units" lists atm and L, which are not SI units
- **b01-resp-photo** — "both use water" — respiration produces water rather than consuming it as a net reactant, so water is not a shared input.
- **b02-punnett** — "Monohybrid cross tracks one trait; ratio 3:1 typical." — 3:1 only holds for a heterozygous cross, not monohybrid crosses in general; also the try_yourself asks for 'what genotype' but expects two genotypes.
- **b03-osmosis** — "More collisions push particles toward sparse right side." — diffusion is net random motion, not collisions pushing particles; also "Membrane is semipermeable: water passes, solutes cannot" overgeneralizes.
- **b04-dna-rep** — "Hydrogen bonds require energy to break." — the answer is incomplete; helicase uses ATP to translocate along DNA and actively separate the strands, not merely because H-bonds need energy.
- **o01-sva** — "'And' joins subjects → always use plural verb." — wrong: 'and' subjects naming one thing (e.g., 'peanut butter and jelly') or preceded by 'each/every' take singular verbs; the try_yourself answer 'are' for orchestra and the jury 'have' answer are only British/notional usage, and 'Simple subject is the noun doing the action' fails for linking and passive verbs.
- **o03-ww1** — "Germany honored its alliance with Austria-Hungary by declaring war on France" — Germany declared war on France because of the Schlieffen Plan and France's alliance with Russia, not its alliance with Austria-Hungary.

### haiku-5-5 (4)

- **m05-exponents** — "0^0 is undefined, so the base must be nonzero" — 0^0 is better described as indeterminate or conventionally left undefined (often taken as 1), so stating it flatly as undefined is an oversimplification.
- **p05-waves** — "expectedAnswer":"300 m/s" — 1500 m ÷ 5 s is 300 m/s arithmetically, but sound in water is about 1500 m/s, so the numbers contradict the lesson's own point that sound is faster in denser media than in air (340 m/s).
- **c03-limiting** — "H2 is limiting; O2 is in excess." — for 6 mol H2 and 2 mol O2, O2 is limiting (6/2 = 3 > 2/1 = 2).
- **o02-thesis** — "Specify the scope: public high schools in the district." The final answer omits this scope.

### sonnet-5 (7)

- **m03-systems-sub** — "No, fails second equation" — (1,4) satisfies y=3x+1 (3+1=4) and y=x+3, so the answer is Yes.
- **m11-probability** — "Result is always smaller fraction" is false: if one probability is 1, the product equals the other probability, not a smaller one.
- **c02-balancing** — "Why does burning wood not lose mass?" — in an open system burning wood does lose mass as gases escape; only the total mass in a closed system is conserved.
- **c05-ph** — "Scale runs from zero to fourteen" — pH can fall below 0 or above 14 for concentrated solutions.
- **b03-osmosis** — "Bilayer has small gaps between lipids" — the membrane does not filter by size through gaps; water crosses mainly via aquaporins or by slipping through, and size alone doesn't explain selectivity.
- **o01-sva** — "Subject does the action" — oversimplified: subjects of linking or passive verbs do no action, and the plan spends half the session on basics instead of tricky subjects.
- **o02-thesis** — 'Identify the thesis: ...' answer "Schools should require daily exercise" drops the reasons, so it is not the full thesis sentence.

## Key mismatches (blind solve disagreed)

### haiku-4-5 (11)

- **m06-similar** [ill_posed] "Triangle PQR: angles 45°, 65°, 70°. Triangle XYZ: angles 45°, 65°, 80°. Similar?" — key `No, not similar.`, solver `–` (Triangle XYZ's angles sum to 190°, not 180°, so it cannot exist as a triangle, making the similarity question unanswerable.)
- **m12-normal** [mismatch] "A normal distribution has μ=50, σ=8. Where do 68% of values fall?" — key `34 to 66`, solver `Between 42 and 58` (judge: Answer1 gives 34-66 (±2σ range, 95%) while Answer2 correctly gives 42-58 (±1σ, 68%), these are different ranges.)
- **m12-normal** [mismatch] "Heights: μ=170 cm, σ=6 cm. What % are below 156 cm?" — key `0.82% or 0.0082`, solver `≈0.98% (about 1%)` (judge: Answer 1 gives 0.82% while Answer 2 gives 0.98%, different numeric results.)
- **p03-circuits** [ill_posed] "Three bulbs wired so current can split among them independently." — key `parallel`, solver `–` (No specific question is asked - only a description of a circuit configuration is given without any numerical values, request for identification, or calculation )
- **p04-energy** [ill_posed] "A 500 kg car starts at 30 m with zero speed. What is its speed at 20 m? Use g = 10 m/s²." — key `Approximately 14.1 m/s`, solver `–` (The question depends on a figure or additional track/height information (e.g., a ramp or hill shape) that is not provided, making it impossible to compute the s)
- **c03-limiting** [mismatch] "For 2N₂ + 3H₂ → 2NH₃, you have 6 mol N₂ and 9 mol H₂. Which is limiting?" — key `N₂ is limiting`, solver `Neither is limiting — N2 and H2 are in exact stoichiometric ratio (6:9 = 2:3), so both are completely consumed.` (judge: Answer 1 claims N2 is limiting, while Answer 2 states the reactants are in exact stoichiometric ratio with neither being limiting.)
- **c03-limiting** [ill_posed] "For 2N₂ + 3H₂ → 2NH₃, if N₂ is limiting with 6 mol, what is theoretical yield in moles of NH₃?" — key `6 moles NH₃`, solver `–` (The chemical equation provided (2N₂ + 3H₂ → 2NH₃) is not balanced (nitrogen atoms do not balance), so the stoichiometric ratio needed to compute the theoretical)
- **b02-punnett** [mismatch] "Red fur is dominant over white. If dominant allele is R, what genotype always hides white fur?" — key `RR or Rr`, solver `RR` (key incomplete — judge: Answer 1 includes both RR and Rr as masking white, while Answer 2 only gives RR, omitting Rr which also hides the white allele.)
- **o01-sva** [mismatch] "Choose the verb: The orchestra (is/are) tuning their instruments." — key `are`, solver `is` (judge: Answer 1 selects 'are' while Answer 2 selects 'is' for the same blank.)
- **o02-thesis** [mismatch] "Revise this weak thesis: 'Books are better than movies because reading is good for you.' Make it specific and arguable." — key `Answers should replace 'better' and 'good' with specific cognitive or emotional benefits.`, solver `Because novels allow readers to construct their own mental images of characters and settings, they foster deeper imaginative engagement than films, which impose a director's fixed visual interpretation.` (key incomplete — judge: Answer 1 only gives a generic instruction without producing an actual revised thesis, while Answer 2 provides a concrete specific thesis)
- **o03-ww1** [mismatch] "General staffs planned detailed war strategies by 1914. How did military readiness contribute to war's outbreak?" — key `Military plans encouraged leaders to act decisively rather than negotiate.`, solver `Rigid mobilization timetables and detailed war plans (e.g., the Schlieffen Plan) meant that once one power began mobilizing, others felt forced to follow suit immediately, turning a diplomatic crisis into an unstoppable chain reaction toward war.` (key incomplete — judge: Answer 1 vaguely states plans encouraged decisive action, while Answer 2 gives specific detailed mechanism (mobilization timetables, Sch)

### haiku-5-5 (2)

- **c03-limiting** [mismatch] "For 2H2 + O2 → 2H2O, mix 6 mol H2 with 2 mol O2. Which reactant is limiting?" — key `H2 is limiting; O2 is in excess.`, solver `O2 is the limiting reactant` (judge: Answer 1 claims H2 is limiting while Answer 2 claims O2 is limiting; they contradict each other.)
- **o02-thesis** [mismatch] "Turn the topic 'social media' into a specific, defensible thesis statement." — key `Teens should be restricted from social media because it harms sleep.`, solver `Although social media offers teenagers valuable opportunities for connection and self-expression, its design—built around algorithm-driven engagement and constant social comparison—has a net negative effect on adolescent mental health, contributing to rising rates of anxiety and depression.` (judge: Answer 1 argues teens should be restricted from social media due to sleep harm, while Answer 2 argues social media has a net negative effect on mental he)

### sonnet-5 (10)

- **m03-systems-sub** [mismatch] "Does (1,4) solve y=x+3 and y=3x+1?" — key `No, fails second equation`, solver `Yes, (1,4) solves both equations.` (judge: Answer1 says it fails the second equation while Answer2 says it satisfies both; they contradict.)
- **m08-sohcahtoa** [ill_posed] "Right triangle has angle B marked. Which side is adjacent to angle B?" — key `Side touching angle B, not hypotenuse`, solver `–` (The question depends on a figure showing the triangle's labeled vertices and sides, which is not included, making it impossible to identify the specific side ad)
- **m09-logs** [mismatch] "Expand log base 3 of (9 times 27) using log properties." — key `6`, solver `log₃9 + log₃27 = 2 + 3 = 5` (judge: Answer1 gives 6, but correct expansion equals log3 9+log3 27=2+3=5 as in Answer2.)
- **p03-circuits** [ill_posed] "A diagram shows a circle with a loop inside. What component is this symbol?" — key `A lamp or bulb`, solver `–` (The question depends on a diagram that is not provided, and the verbal description 'circle with a loop inside' matches multiple possible standard circuit symbol)
- **b03-osmosis** [mismatch] "A gas leaks from a container into an empty room. Describe how it moves over time." — key `Gas diffuses from high to low concentration`, solver `The gas diffuses outward from the leak, spreading via random molecular motion from high to low concentration until it becomes uniformly spread throughout the room.` (key incomplete — judge: Answer 1 captures the core idea but lacks the detail about random motion and eventual uniform spread found in Answer 2, though nothing c)
- **o02-thesis** [mismatch] "Narrow the broad topic 'sports' into a focused, arguable thesis sentence." — key `High schools should offer more funding for girls' sports`, solver `Youth sports organizations should eliminate participation trophies because they diminish the value of hard work and discourage genuine competitive growth in young athletes.` (judge: The two theses propose entirely different, unrelated claims about sports (funding for girls' sports vs. eliminating participation trophies).)
- **o02-thesis** [mismatch] "Revise 'Reading books is helpful' into a specific, debatable thesis statement." — key `Schools should require weekly reading to boost empathy`, solver `Reading fiction regularly strengthens empathy and critical thinking skills more effectively than consuming visual media like television or social media.` (judge: Answer 1 argues for a school policy requiring weekly reading, while Answer 2 argues fiction reading outperforms visual media for empathy/critical thinkin)
- **o02-thesis** [mismatch] "Turn the fact 'Dogs are mammals' into a thesis about dog ownership." — key `Owning a dog teaches children responsibility and empathy`, solver `Because dogs are mammals with complex physical, emotional, and social needs, responsible dog ownership requires owners to provide proper nutrition, veterinary care, and companionship to ensure their pet's well-being.` (judge: Answer 1 claims the thesis is about teaching children responsibility/empathy, while Answer 2 claims it's about meeting dogs' care needs due to being mamm)
- **o03-ww1** [mismatch] "Explain how the alliance system turned a regional dispute into a continental war." — key `Allied obligations dragged other nations in`, solver `The alliance system bound major powers into mutual defense obligations (Triple Alliance vs Triple Entente). When Austria-Hungary attacked Serbia after the assassination of Archduke Franz Ferdinand, Russia mobilized to defend Serbia, Germany declared war to support Austria-Hungary, France was drawn in via its alliance with Russia, and Britain entered to support France and Belgium — chain-reaction commitments escalated a local Balkan conflict into a continent-wide war.` (key incomplete — judge: Answer 1 states the same core idea briefly but lacks the detail present in Answer 2, with no contradiction.)
- **o03-ww1** [mismatch] "Explain how competing for African colonies increased tension between Britain and Germany." — key `Rivalry over resources fueled mutual suspicion`, solver `Germany's late push for African colonies (under Wilhelm II's policy of seeking 'a place in the sun') brought it into direct conflict with Britain's existing colonial empire and interests—e.g., Germany's support for the Boers against Britain (Kruger Telegram) and disputes over territorial claims in Africa—fueling mutual suspicion, nationalism, and the arms/naval race that heightened pre-WWI Anglo-German tension.` (key incomplete — judge: Answer 1 only vaguely mentions rivalry/suspicion while Answer 2 provides specific mechanisms (Kruger Telegram, naval race) that don't co)

## Reading

Haiku 5.5 at effort low is the clear winner on this set: highest judge score (7.20 vs 5.77 /8 for today's Haiku 4.5, ahead on all four sub-scores, biggest gains on concept accuracy and structure), the best verified-key rate (98.4 % vs 92.3 %, 2 mismatches vs 7 plus 4 ill-posed), zero fallbacks, the same or slightly lower latency (p50 total 15.8 s vs 17.3 s), and about one sixth of the cost ($0.0020 vs $0.0115 per plan). The judge quoted factual errors in 16 of 30 Haiku 4.5 plans (impossible triangles, unbalanced equations, wrong ±1σ range, series/parallel bulb behaviour) against 4 for Haiku 5.5. Its one weakness: it sometimes emits fewer objectives (mean 4.2 vs 4.7; "main causes of World War I" came back as a single LO), which the judge did not penalise much but which is worth watching.

Sonnet 5 at effort low is not viable on this prompt as written: 3/30 Stage-2 outputs were unparseable (the model "self-corrected" mid-answer — "Wait, let me provide correct output" — and emitted two JSON objects, which `safeJsonParse` rejects) and 4 more plans expanded only the first of five objectives (end_turn, ~400 output tokens), so the plan had 5 LOs but one try-yourself; it was also the slowest and the most expensive ($0.0256/plan, 2.2× Haiku 4.5) with the lowest judge mean (5.43, structure 0.80). Recommendation: move `plangen-fast` (this path only) to `claude-haiku-5-5` with `TUTOR_PLANGEN_EFFORT=low`, after (1) the production-baseline replay confirms the result on real student inputs, and (2) a check that the other `plangen-fast` callers (labels / classify / condense, the splitter and classifier that send sampling params Haiku 5.5 rejects) are either pinned to Haiku 4.5 or cleaned up — the env var switches the whole role. Caveats: one sample per (model, topic); the judge and the key verifier are single model calls; topics are synthetic.

## Appendix — spend

Generation $1.17 + key verification $1.94 + judge $0.97 = $4.08 for the scored run, plus ≈ $0.14 of dry runs: ≈ $4.22 total (cap $25).
