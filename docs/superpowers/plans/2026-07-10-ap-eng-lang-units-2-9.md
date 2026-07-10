# AP English Language — Units 2-9 Fan-Out Plan

**Date:** 2026-07-10
**Branch:** `eng-lang-units-2-9` (off `eng-lang-vertical-slice` @ 7a6da40, worktree `.claude/worktrees/ap-eng-lang-u2-9`)
**Builds on:** [[project_ap_eng_lang_slice]] (Unit-1 vertical slice = the proven template). Same conventions, ids, rubric scale.

## Goal
Complete the AP English Language course by fanning out Units 2-9 using the Unit-1 slice as the template: per unit ~4-5 content plans + 1 FRQ-practice plan, topic-notes baselines, passage-grouped MCQ bank, and 6-point rubrics. Covers all three FRQ tasks (Rhetorical Analysis, Argument, Synthesis), all four Big Ideas, and MCQ reading + writing/editing.

## Design decisions (continuing Unit-1's locked decisions)
- **Skill-based decomposition** (not thematic) — AP Lang CED spirals skills, not content. Each unit gets a distinct skill focus + the FRQ task it targets. cedTitle = the skill.
- **Passages public-domain only** (pre-1929). Reuse Douglass/Henry/Swift where they fit + add curated public-domain texts. Content-filter safety: short rhetorical excerpts, no graphic spans, author filter-risky passages inline (controller) not via subagent.
- **6-point AP Lang rubric** integer (Thesis/Evidence&Commentary/Sophistication or task-appropriate rows).
- **Three try_yourself grains** (micro/paragraph/full essay) per unit.
- ids `evelyn.ap.englang.<slug>.v1`, LO `apenglang.<slug>`, files `ap-englang-u<N>-<slug>.ts`, subject `'ela'`, cedUnit N.
- **Synthesis packet**: light extension — the Synthesis FRQ try_yourself references MULTIPLE passages via a `passageIds?: string[]` field (added alongside the existing `passageId?`), the grader concatenates them. Sources = a curated set of short related public-domain texts on one issue.

## Per-unit skill map (Evelyn sequence, CED-aligned to the 4 Big Ideas + 3 tasks)

| Unit | Title (skill focus) | Content plans (cedTopic) | FRQ task |
|---|---|---|---|
| U1 ✅ | The Rhetorical Situation | rhetorical-situation, reading-for-claim, defensible-thesis, evidence-commentary, audience-context | Rhetorical Analysis |
| **U2** | The Argument Essay | 2.1 building-an-argument, 2.2 selecting-evidence, 2.3 line-of-reasoning, 2.4 counterargument-rebuttal, 2.5 intros-conclusions | **Argument** |
| **U3** | The Synthesis Essay | 3.1 the-synthesis-task, 3.2 citing-attributing-sources, 3.3 position-across-sources, 3.4 integrating-evidence, 3.5 synthesis-line-of-reasoning | **Synthesis** (multi-source) |
| **U4** | Methods of Development | 4.1 methods-of-development, 4.2 intros-conclusions-analysis, 4.3 diction-and-tone, 4.4 analyzing-line-of-reasoning | **Rhetorical Analysis** |
| **U5** | Organization & Coherence | 5.1 reasoning-and-paragraphing, 5.2 unity-and-coherence, 5.3 transitions-cohesion, 5.4 organizing-for-effect | **Argument** |
| **U6** | Style: Syntax & Diction | 6.1 syntax-for-effect, 6.2 diction-connotation-tone, 6.3 figurative-language-schemes, 6.4 analyzing-style | **Rhetorical Analysis** |
| **U7** | Sophistication in Argument | 7.1 nuance-qualification-concession, 7.2 complex-reasoning, 7.3 situating-in-context, 7.4 rhetorical-risk | **Argument** |
| **U8** | Synthesis & Source Evaluation | 8.1 source-credibility-bias, 8.2 competing-perspectives, 8.3 qualifying-with-sources, 8.4 sophistication-in-synthesis | **Synthesis** |
| **U9** | Exam Mastery & Integration | 9.1 timed-writing-strategy, 9.2 mcq-reading-strategy, 9.3 mcq-writing-editing, 9.4 revision-and-sophistication | mixed (all three) |

Total new: ~36 content plans + 8 FRQ-practice = ~44 plans (course total ~50 incl. Unit 1).

## Passages needed (curated public-domain, added incrementally)
- **Reuse**: Douglass (RA), Henry (RA/argument), Swift (satire/style).
- **Argument** (U2/5/7): Thomas Paine *Common Sense*; Elizabeth Cady Stanton *Declaration of Sentiments*; Thoreau *Civil Disobedience*; Mary Wollstonecraft *Vindication*.
- **Synthesis source sets** (U3/8): a curated set of 3-4 SHORT related public-domain texts on one issue (e.g. education, or the individual vs. society) — e.g. Wollstonecraft + Emerson (*Self-Reliance*/*Education*) + Ruskin + Addams excerpts.
- **RA style** (U4/6): Lincoln *Second Inaugural* / *Gettysburg*; Sojourner Truth *Ain't I a Woman*; Woolf; Emerson.
- **MCQ (U9)**: reuse the above.

## Execution phases (parity-build pattern: author → central register → structural verify; NOT per-task SDD review — too slow for bulk)
- **P0** — this map + Synthesis `passageIds?` schema extension + grader concat + lint update.
- **P1** — curate + seed the additional public-domain passages (controller-authored where filter-risky).
- **P2** — fan out Units 2-9 content plans (one subagent per unit, author-only, central register). Calibrate U2 first as the argument-essay template, U3 as the synthesis template.
- **P3** — FRQ-practice plans (Argument, Synthesis, RA variants) per unit + 6-pt rubrics.
- **P4** — topic-notes baselines for all new content plans.
- **P5** — passage-grouped MCQ banks per unit (self-contained stems per the Unit-1 verifier rule; distribute+shuffle answer letters).
- **P6** — academy: regenerate mappings (pattern already matches ap-englang-*); ingest deferred to user.
- Verify each phase: tsc 0, lint-ap-plans, lint:passages, structural rubric/baseline audits. Commit per unit/phase.

## Gates (reuse Unit-1's)
tsc 0; lint-ap-plans passes; lint:passages clean; every rubric sums to 6 integer (structural SEED_PLANS walk, not grep); baselineId===planId, 0 dup/orphan; MCQ dry-run verify; no dangling prereq/followUp refs; content-filter safety (short quotes only).

## NOT in scope / deferred
- Live validation (user, on Unit-1 first).
- DB seeding + academy ingest (user/ops).
- Full per-plan SDD review (bulk uses structural gates + spot review, like the parity build).
- Merge (after user's Unit-1 live gate).
