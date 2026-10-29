# plangen-fast: Haiku 4.5 vs Haiku 5.5 (low effort) — 2026-10-23

Script: `apps/tutor/scripts/eval/plangen-fast-smoke.ts` (branch gac-29oct). 2 runs per fixture per model, sequential. Raw JSON: `/private/tmp/claude-501/-Users-luke-Dev-evelynlearning/776a6525-c8ef-4ffd-9767-06db6b940a62/scratchpad/a4/raw2`.

Haiku 4.5 = old request (temperature 0 / 0.1). Haiku 5.5 = new request (no temperature, `output_config.effort: low`, max_tokens floor 4000; 8192 for enumerate + condense).

## Latency, tokens, cost per caller

| caller | model | calls | p50 ms | max ms | avg in tok | avg out tok | stop≠end_turn | errors | cost/call | total cost |
|---|---|---|---|---|---|---|---|---|---|---|
| enumerate | Haiku 4.5 | 12 | 1980 | 2372 | 472 | 191 | 0 | 0 | $0.00143 | $0.0171 |
| enumerate | Haiku 5.5 low | 12 | 1196 | 1913 | 613 | 171 | 0 | 0 | $0.00015 | $0.0018 |
| classify | Haiku 4.5 | 10 | 759 | 845 | 431 | 45 | 0 | 0 | $0.00066 | $0.0066 |
| classify | Haiku 5.5 low | 10 | 1006 | 1692 | 604 | 56 | 0 | 0 | $0.00009 | $0.0009 |
| summary | Haiku 4.5 | 10 | 1187 | 1336 | 258 | 84 | 0 | 0 | $0.00068 | $0.0068 |
| summary | Haiku 5.5 low | 10 | 1256 | 3006 | 352 | 131 | 0 | 0 | $0.00010 | $0.0010 |
| rail | Haiku 4.5 | 10 | 1322 | 1741 | 506 | 142 | 0 | 0 | $0.00122 | $0.0122 |
| rail | Haiku 5.5 low | 10 | 2426 | 3502 | 725 | 474 | 0 | 0 | $0.00031 | $0.0031 |
| condense | Haiku 4.5 | 8 | 28268 | 35861 | 3805 | 2534 | 0 | 0 | $0.01647 | $0.1318 |
| condense | Haiku 5.5 low | 8 | 14571 | 19623 | 5171 | 4569 | 0 | 0 | $0.00280 | $0.0224 |

Total eval spend: **$0.2036**.

## enumerate-problems

| fixture | 4.5 count (runs) | 5.5 count (runs) | 5.5 run1 = 4.5 run1 (texts) | 5.5 stable across runs | 5.5 non-verbatim problems | failedOpen 4.5 / 5.5 |
|---|---|---|---|---|---|---|
| algebra-worksheet | 6/6 | 6/6 | NO | NO | 8 | false/false · false/false |
| chem-shared-data | 1/1 | 1/1 | yes | yes | 0 | false/false · false/false |
| geometry-ocr | 5/5 | 5/5 | yes | yes | 0 | false/false · false/false |
| essay-prompt | 1/1 | 1/1 | NO | yes | 2 | false/false · false/false |
| physics-scenario | 2/2 | 2/2 | yes | yes | 0 | false/false · false/false |
| single-question | 1/1 | 1/1 | yes | yes | 0 | true/true · false/false |

<details><summary>enumerate texts (run 1)</summary>

**algebra-worksheet**

- Haiku 4.5:
  - 1. 3x + 7 = 22
  - 2. 5(2x - 3) = 4x + 9
  - 3. -2(x + 4) = 3x - 18
  - 4. x/4 + 2 = 7
  - 5. Solve for y: 6x - 3y = 12
  - 6. A phone plan costs $25 per month plus $0.10 per text. Last month the bill was $41.50. How many texts were sent?
- Haiku 5.5 low:
  - 1. Solve each equation. 3x + 7 = 22
  - 2. Solve each equation. 5(2x - 3) = 4x + 9
  - 3. Solve each equation. -2(x + 4) = 3x - 18
  - 4. Solve each equation. x/4 + 2 = 7
  - 5. Solve for y: 6x - 3y = 12
  - 6. A phone plan costs $25 per month plus $0.10 per text. Last month the bill was $41.50. How many texts were sent?

**chem-shared-data**

- Haiku 4.5:
  - 1. Use the reaction: 2H2 + O2 -> 2H2O a) How many moles of water form from 3.5 mol of O2? b) How many grams of H2 are needed to react completely with 64 g of O2? c) If 10.0 g H2 reacts with 64.0 g O2, which is the limiting 
- Haiku 5.5 low:
  - 1. Use the reaction: 2H2 + O2 -> 2H2O a) How many moles of water form from 3.5 mol of O2? b) How many grams of H2 are needed to react completely with 64 g of O2? c) If 10.0 g H2 reacts with 64.0 g O2, which is the limiting 

**geometry-ocr**

- Haiku 4.5:
  - 1. Lines m and n are parallel and cut by transversal t. If angle 1 = 3x + 10 and angle 5 = 5x - 30 are corresponding angles, find x.
  - 2. Two angles are supplementary. One angle is 24 degrees more than twice the other. Find both angles.
  - 3. In triangle ABC, angle A = 47 degrees and angle B = 68 degrees. Find the exterior angle at C.
  - 4. True or False: Alternate interior angles are always supplementary. Explain.
  - 5. The measure of each interior angle of a regular polygon is 140 degrees. How many sides does it have?
- Haiku 5.5 low:
  - 1. Lines m and n are parallel and cut by transversal t. If angle 1 = 3x + 10 and angle 5 = 5x - 30 are corresponding angles, find x.
  - 2. Two angles are supplementary. One angle is 24 degrees more than twice the other. Find both angles.
  - 3. In triangle ABC, angle A = 47 degrees and angle B = 68 degrees. Find the exterior angle at C.
  - 4. True or False: Alternate interior angles are always supplementary. Explain.
  - 5. The measure of each interior angle of a regular polygon is 140 degrees. How many sides does it have?

**essay-prompt**

- Haiku 4.5:
  - 1. In The Great Gatsby, Fitzgerald uses the green light as a symbol. Write a 5-paragraph essay explaining how the meaning of the green light changes over the course of the novel. Student needs help: developing a thesis stat
- Haiku 5.5 low:
  - 1. In The Great Gatsby, Fitzgerald uses the green light as a symbol. Write a 5-paragraph essay explaining how the meaning of the green light changes over the course of the novel. I have to write a thesis statement by tomorr

**physics-scenario**

- Haiku 4.5:
  - 1. A ball is thrown straight up from the edge of a 20 m tall cliff with an initial speed of 15 m/s. Ignore air resistance and use g = 9.8 m/s^2. (a) How long does the ball take to reach its maximum height? (b) What is the m
  - 7. A car accelerates uniformly from rest to 27 m/s in 9.0 s. How far does it travel?
- Haiku 5.5 low:
  - 1. A ball is thrown straight up from the edge of a 20 m tall cliff with an initial speed of 15 m/s. Ignore air resistance and use g = 9.8 m/s^2. (a) How long does the ball take to reach its maximum height? (b) What is the m
  - 7. A car accelerates uniformly from rest to 27 m/s in 9.0 s. How far does it travel?

**single-question**

- Haiku 4.5:
  - 1. how do i find the derivative of f(x) = x^2 sin(x)? we just learned the product rule
- Haiku 5.5 low:
  - 1. how do i find the derivative of f(x) = x^2 sin(x)? we just learned the product rule

</details>

## material-classify

| fixture | Haiku 4.5 (run1 / run2) | Haiku 5.5 (run1 / run2) |
|---|---|---|
| worksheet-fractions | problem_set (6) — Dividing fractions and mixed numbers / problem_set (6) — Dividing fractions and mixed numbers | problem_set (6) — Dividing fractions practice with word problems, Grade 6 / problem_set (6) — Dividing fractions and mixed numbers with word problems |
| bio-notes | explanatory_text — Photosynthesis: light reactions, Calvin cycle, and rate factors / explanatory_text — Photosynthesis: light reactions, Calvin cycle, and rate factors | **null** (raw: `{"kind":"explanatory_text","topicSummary":"Photosynthesis: light-dependent reactions, Calvin cycle, limiting factors","}`) / **null** (raw: `{"kind":"explanatory_text","topicSummary":"Photosynthesis: light-dependent reactions, Calvin cycle, limiting factors","}`) |
| mixed-history | mixed (4) — Industrial Revolution in Britain: causes, inventions, urbanization / mixed (4) — Industrial Revolution in Britain: causes, inventions, urbanization | mixed (4) — Causes and effects of the Industrial Revolution in Britain / mixed (4) — Industrial Revolution origins, inventions, and urban effects in Britain |
| data-table | diagram — Predator-prey population dynamics over time / diagram — Predator-prey population dynamics over time | diagram — Predator-prey population data for rabbits and foxes over years / diagram — Rabbit and fox population data over six years, predator-prey dynamics |
| unusable-photo | unusable — personal photo with no academic or skill subject / unusable — personal photo with no academic or skill subject | unusable — a personal beach sunset photo caption with no academic or skill subject / unusable — a personal beach sunset photo caption with no academic or skill subject |

## material-summary

| fixture | Haiku 4.5 subject · level · topic | Haiku 5.5 subject · level · topic (run1 / run2) |
|---|---|---|
| worksheet-fractions | Mathematics · Grade 6 · Dividing fractions and simplifying answers / Mathematics · Grade 6 · Dividing fractions and simplifying answers | Math · Grade 6 · Dividing fractions and mixed numbers / Math · Grade 6 · Dividing fractions and mixed numbers |
| bio-notes | Biology · High School · Photosynthesis: light-dependent and light-independent reactions / Biology · High School · Photosynthesis: light-dependent and light-independent reactions | Biology · – · Photosynthesis: light-dependent and Calvin cycle reactions / Biology · – · Photosynthesis: light-dependent and Calvin cycle reactions |
| mixed-history | World History · 9-10 · Industrial Revolution origins and early effects / World History · 9-10 · Industrial Revolution origins and early effects | World History · Secondary school (grade level not stated · Causes and effects of the Industrial Revolution / World History · Secondary school (grade level not stated · Causes and effects of the Industrial Revolution |
| data-table | Biology · High School · Predator-prey population dynamics / Biology · High School · Predator-prey population dynamics | Biology · – · Predator-prey population changes over time / Biology · – · Predator-prey population changes on an island |
| unusable-photo | Not a school material · – · Personal photo and social media post / Not a school material · – · Personal photo and social media post | Unclassified · – · Personal social media post about a beach sunset / Not school material · – · Personal beach sunset photo caption |

## derive-rail-labels (model call + parseLabelResponse)

| seed | Haiku 4.5 labels (run1) | Haiku 5.5 labels (run1) | parsed ok 4.5 / 5.5 (runs) |
|---|---|---|---|
| ap-chem-reaction-rates | Rate definition, Rate law determination, Reaction order, Stoichiometry vs rate, Catalyst mechanism | Rate definition, Initial rates analysis, Reaction order, Coefficients versus orders, Catalyst action | yy / yy |
| ap-bio-enzymes | Activation energy, Competitive inhibition identification, Temperature effects, Equilibrium vs. activation, Feedback inhibition strategy | Active site mechanism, Inhibitor type analysis, Temperature denaturation effects, Equilibrium and catalysts, Feedback inhibition regulation | yy / yy |
| ap-calcbc-u1-limits-algebraic-properties | Limit laws, Direct substitution examples, Substitution practice, Indeterminate forms, Quotient law restrictions | Limit law rules, Worked limit examples, Direct substitution practice, Indeterminate forms practice, Quotient law restriction | yy / yy |
| ap-phys1-waves | Wave equation, String harmonics, Pipe resonance, Speed independence from, Resonant cavity pitch | Wave speed relation, Vibrating string harmonics, Open pipe fundamental, Pitch versus wave, Air column resonance | yy / yy |
| alg1-u4-slope-intercept-form | Slope-intercept form, Graphing from equation, Standard form conversion, Equation from graph, Real-world interpretation, Finding y-intercept, Slope ratio error | Meaning of m, Fractional slope graph, Reordered term reading, Equation from graph, Real-world intercept meaning, Solving for intercept, Rise-over-run error | yy / yy |

## condenseForPipeline (target 8000 chars)

| set | in chars | 4.5 out chars (runs) | 4.5 headings kept | 5.5 out chars (runs) | 5.5 headings kept | hard-truncate fallback 4.5 / 5.5 |
|---|---|---|---|---|---|---|
| bio-chapter | 11767 | 8000/8000 | 17/24, 3/24 | 8000/8000 | 22/24, 22/24 | false/false · false/false |
| physics-chapter | 8865 | 8000/7715 | 24/24, 24/24 | 7853/8000 | 24/24, 24/24 | false/false · false/false |
| algebra-unit | 17592 | 7758/8000 | 6/30, 18/30 | 8000/8000 | 21/30, 18/30 | false/false · false/false |
| history-chapter | 9407 | 6316/7072 | 1/15, 3/15 | 8000/8000 | 13/15, 13/15 | false/false · false/false |

## Verdict per caller (written by hand after the run)

| caller | verdict | why |
|---|---|---|
| enumerate-problems | **Haiku 5.5** | Same problem counts on all 6 fixtures; same texts on 4/6. Differences: on the algebra sheet 5.5 prefixes the shared instruction ("Solve each equation.") to each problem — what the prompt's shared-information rule asks for — and varies run to run on whether "Show your work." is included; on the essay prompt it keeps the student's own words instead of paraphrasing. Haiku 4.5 failed open on the one-line typed question in both runs; 5.5 parsed it. ~40 % faster, ~10x cheaper. |
| material-classify | **stays on Haiku 4.5** (role `plangen-classify`) | Haiku 5.5 returned malformed JSON on the photosynthesis notes in both runs (`..."topicSummary":"...","}` — it starts the optional `itemCount` key and drops it); in the first run (same script) it also failed once on the data table. The gate reads that as "no answer" (fail open), so 2–3/10 classifications are lost. Labels were otherwise identical. Flip with `TUTOR_MODEL_PLANGEN_CLASSIFY=claude-haiku-5-5` after the prompt template (or a structured-output schema) is fixed. |
| material-summary | **Haiku 5.5** (watch `level`) | Subject and topic equivalent on all fixtures. 5.5 omits `level` when the text does not state one (4.5 guesses "High School" / "9-10"), but on the history reading it writes meta text into `level` instead ("Secondary school (grade level not stated" — clipped at 40 chars) in both runs. |
| derive-rail-labels | **Haiku 5.5** | 10/10 parsed on both models, distinct labels, comparable quality. Slower: p50 ~2.4–2.7 s vs ~1.3 s, max 3.9 s, under the 8 s timeout (maxRetries 0). |
| condenseForPipeline | **Haiku 5.5** | About 2x faster (p50 ~14 s vs ~28 s) and ~6x cheaper; kept more section headings on every set (e.g. history 13/15 vs 1–7/15). Both models often overshoot the 8000-char target and are cut by the hard floor. |

Total live spend for both runs: about $0.42.
