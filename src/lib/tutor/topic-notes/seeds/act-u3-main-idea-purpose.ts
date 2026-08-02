/**
 * ACT — Unit 3 CED 3.1: Main Idea & Author's Purpose.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.act.main-idea-purpose.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ACT_U3_MAIN_IDEA_PURPOSE: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.act.main-idea-purpose.v1',
  course: 'ACT',
  cedUnit: 3,
  cedTopic: '3.1',
  cedTitle: `Main Idea & Author's Purpose`,
  planId: 'evelyn.testprep.act.main-idea-purpose.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-02',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.act.main-idea-purpose.v1' }],
  theory: [
    { loId: 'act.main-idea-purpose', content: `Main idea / purpose questions ask what the passage AS A WHOLE is about, or why the author wrote it — not what one paragraph or one sentence says.` },
    { loId: 'act.main-idea-purpose', content: `SIGNAL POSITIONS: the first sentence usually sets the topic; the last sentence often states the point or conclusion. When short on time, read those two first and treat the last one as the closest thing to a thesis.` },
    { loId: 'act.main-idea-purpose', kind: 'framework', title: 'Trap 1', content: `TRAP 1 — TOO NARROW: a choice restates one true supporting detail (one fact, one paragraph) but misses the passage's overall point.` },
    { loId: 'act.main-idea-purpose', kind: 'framework', title: 'Trap 2', content: `TRAP 2 — TOO BROAD: a choice stretches the claim further than the text supports, often flagged by absolute words — all, every, always, entirely, never.` },
    { loId: 'act.main-idea-purpose', kind: 'framework', title: 'Trap 3', content: `TRAP 3 — UNMENTIONED: a choice introduces a plausible-sounding fact that never actually appears in the passage.` },
    { loId: 'act.main-idea-purpose', content: `PURPOSE questions hinge on a VERB: choices read like 'argue,' 'explain,' 'describe,' or 'compare.' Match the verb that fits what the passage actually DOES, not just its subject.` },
    { loId: 'act.main-idea-purpose', content: `SCOPE TEST: before picking, check whether the choice matches the passage's scope exactly — not zoomed in on one detail, not zoomed out past what was written.` },
    { loId: 'act.main-idea-purpose', content: `PACE: budget about 52 seconds for this question type and do not re-read the whole passage to answer it — the first/last-sentence scan is usually enough.` },
    { loId: 'act.main-idea-purpose', kind: 'definition', title: 'main idea', content: 'what the passage as a whole is mostly about — not what any single sentence says.' },
    { loId: 'act.main-idea-purpose', kind: 'definition', title: `author's purpose`, content: `why the author wrote the passage — the verb (argue, explain, describe, compare…) that matches what the text does.` },
    { loId: 'act.main-idea-purpose', kind: 'definition', title: 'scope', content: `how broad or narrow a claim is; a correct main-idea answer matches the passage's scope exactly.` },
  ],
  methods: [
    {
      title: 'Worked typical',
      steps: [
        `Scan the first sentence (the old assumption: wider highways relieve congestion) and the last sentence (planners had to reconsider that assumption) to find the arc of the passage.`,
        `The middle sentences supply the mechanism: more lanes lower the cost of driving, so more people drive, refilling the lanes — that is "induced demand."`,
        `Test each choice against the WHOLE passage, not one sentence: (a) is an opinion the passage never states — planners acted on a reasonable assumption, they were not called incompetent. (c) uses the absolute word "all," which overshoots the passage's claim about this one mechanism. (d) is a policy recommendation the passage never makes.`,
        `(b) is the only choice that names both the cause (added lanes) and the effect (more drivers, no less congestion) that the passage actually develops.`,
      ],
      example: { problem: `Passage: "For decades, urban planners assumed that wider highways relieved traffic congestion. Cities added lanes, only to watch traffic thicken again within a few years. Economists eventually identified the culprit: induced demand. A wider road lowers the cost of driving, so more people choose to drive, refilling the very lanes built to empty it. The finding forced planners to reconsider whether pavement was ever the answer to gridlock." Which choice best states the main idea of the passage? (a) Urban planners are incompetent at designing highways. (b) Adding highway lanes often fails to reduce congestion because it increases the number of drivers. (c) Economists discovered that all traffic congestion is caused by induced demand. (d) Cities should stop building highways altogether.`, solution: `(b) Adding highway lanes often fails to reduce congestion because it increases the number of drivers.` },
      relatedLoIds: ['act.main-idea-purpose'],
    },
    {
      title: 'Worked trap',
      steps: [
        `The passage builds toward its final sentence: bleaching "threatens far more than the coral itself" — treat that as the thesis.`,
        `TRAP CHECK on (b): bleaching IS described in the passage, so this choice feels safe — but it names a supporting DETAIL, not the passage's actual point about why bleaching matters beyond the coral. This is the too-narrow trap.`,
        `(a) introduces a fact never discussed (how polyps build skeletons) — the unmentioned-fact trap.`,
        `(d) uses absolute language ("all," "will go extinct") the passage never commits to — the too-broad trap.`,
        `(c) matches the final sentence's claim exactly: reef-dependent species, not just coral, are endangered.`,
      ],
      example: { problem: `Passage: "Coral reefs cover less than one percent of the ocean floor, yet they shelter roughly a quarter of all known marine species. Reef fish rely on coral not just for food but for camouflage and nursery grounds where juveniles can mature safely. When rising ocean temperatures cause corals to expel the algae living in their tissues — a process called bleaching — that entire support structure can collapse within months. The passage argues that coral bleaching threatens far more than the coral itself." The main purpose of the passage is to: (a) explain how coral polyps build their skeletons. (b) describe the process of coral bleaching in scientific detail. (c) show that coral bleaching endangers the wider marine ecosystem that depends on reefs. (d) argue that all reef fish species will go extinct without intervention.`, solution: `(c) show that coral bleaching endangers the wider marine ecosystem that depends on reefs.` },
      relatedLoIds: ['act.main-idea-purpose'],
    },
  ],
  pointers: [
    { content: `The main idea must match the passage's SCOPE. A passage about one beekeeper's technique supports a main idea about that beekeeper's approach and its results — not a policy recommendation for every commercial farm, which the passage never argued. Match scope exactly: not too narrow (one detail), not too broad (a claim the text never makes).`, kind: 'common-error' },
    { content: `Main idea / purpose questions test the WHOLE passage — check every choice against all of it, not just one sentence.`, kind: 'tip' },
    { content: `Two consistent traps: too narrow (a true detail dressed up as the main point) and too broad (a claim the passage never actually makes).`, kind: 'tip' },
    { content: `Absolute words in an answer choice — all, every, always, never, entirely — are a red flag on this question type.`, kind: 'tip' },
    { content: `The first and last sentences carry the strongest signal of the passage's point; scan those first when time is short.`, kind: 'tip' },
    { content: `Read the stem's noun carefully: "main idea of the passage" vs. "main idea of the **third paragraph**" vs. "the passage as a whole." A paragraph-level stem makes the whole-passage answer the wrong-scope trap — and vice versa. Underline the unit named before you scan choices.`, kind: 'gotcha' },
    { content: `On purpose questions, split each choice into VERB + OBJECT and test them separately. "Argue that X" fails if the passage only explains; "explain Y" fails if Y never appears. A choice can have the right verb and the wrong object — both halves must hold.`, kind: 'tip' },
    { content: `"Argue" / "criticize" / "advocate" require the author to take a side. If the passage reports what researchers found or what a debate involves without endorsing it, pick the neutral verb (explain, describe, trace) — even when the content sounds controversial.`, kind: 'common-error' },
    { content: `Absolute words are a red flag, not an automatic elimination. If the passage itself says "every known case" or "never," the matching absolute choice is correct. Check whether the text earns the absolute before you cross it out.`, kind: 'edge-case' },
    { content: `In Prose Fiction/Literary Narrative, there's rarely a thesis sentence — the first/last-sentence scan gives you setting, not point. Instead ask: what changed for the narrator, and what does the passage want you to feel about it?`, kind: 'edge-case' },
    { content: `Don't confuse main idea with the author's ATTITUDE (a separate ACT question type). "The author is skeptical of X" describes tone; the main idea must name what the passage is about. A tone word alone can't be a main-idea answer.`, kind: 'vocab-note' },
    { content: `Beware the choice that's true of most of the passage but ignores a pivot — "Yet," "However," "But then." If the passage turns, the main idea lives after the turn. The pre-turn summary is a classic too-narrow trap.`, kind: 'gotcha' },
    { content: `If two choices both seem right, they differ by one word — usually a scope word ("some" vs. "most"), a verb ("suggests" vs. "proves"), or a subject ("scientists" vs. "one researcher"). Find that word and check it against the text instead of re-reading the passage.`, kind: 'tip' },
  ],
};
