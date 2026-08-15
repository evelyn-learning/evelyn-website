/**
 * Digital SAT — Unit 7 CED 7.1: Rhetorical Synthesis (Notes Questions).
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.dsat.rhetorical-synthesis.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_DSAT_U7_RHETORICAL_SYNTHESIS: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.dsat.rhetorical-synthesis.v1',
  course: 'Digital SAT',
  cedUnit: 7,
  cedTopic: '7.1',
  cedTitle: 'Rhetorical Synthesis (Notes Questions)',
  planId: 'evelyn.testprep.dsat.rhetorical-synthesis.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.dsat.rhetorical-synthesis.v1' }],
  theory: [
    { loId: 'dsat.rhetorical-synthesis', kind: 'framework', title: 'Format', content: `FORMAT — "A student is writing about X. Notes: [4-6 bulleted facts]. The student wants to [GOAL]. Which choice most effectively uses relevant information from the notes to accomplish this goal?" Four candidate sentences follow.` },
    { loId: 'dsat.rhetorical-synthesis', content: `READ THE GOAL FIRST, before the answer choices. The goal is the filter every choice gets tested against — not an afterthought.` },
    { loId: 'dsat.rhetorical-synthesis', kind: 'framework', title: 'Classify the goal type', content: `CLASSIFY THE GOAL TYPE — compare/contrast two things, introduce a topic to an unfamiliar audience, summarize a main finding, give a specific example, or explain significance/impact. Each type demands a different kind of sentence.` },
    { loId: 'dsat.rhetorical-synthesis', kind: 'framework', title: 'Trap 1', content: `TRAP 1 — GOAL MISMATCH. A choice can be 100% accurate and still be wrong because it does the WRONG rhetorical job — e.g., it states a fact when the goal asked for a comparison, or reports a benefit when the goal asked for a challenge.` },
    { loId: 'dsat.rhetorical-synthesis', kind: 'framework', title: 'Trap 2', content: `TRAP 2 — UNSUPPORTED ADDITION. A choice adds a detail that is NOT in the bulleted notes (a claim about "growing popularity," "studies suggest," etc.). It can sound perfectly plausible — the notes are the only evidence allowed, so anything outside them is disqualifying.` },
    { loId: 'dsat.rhetorical-synthesis', kind: 'framework', title: 'Trap 3', content: `TRAP 3 — PARTIAL COVERAGE. For a two-part goal ("compare A and B," "highlight a similarity between X and Y"), a choice that only describes ONE side is incomplete, even if that half is accurate.` },
    { loId: 'dsat.rhetorical-synthesis', content: `ALL FOUR CHOICES ARE USUALLY WELL-WRITTEN. Do not reward polish or detail — a fluent, detailed sentence that makes the wrong rhetorical move is still wrong.` },
    { loId: 'dsat.rhetorical-synthesis', kind: 'framework', title: 'Strategy', content: `STRATEGY — read the goal, predict the MOVE the sentence needs to make, then eliminate any choice that makes the wrong move, invents outside info, or covers only half a two-part goal.` },
    { loId: 'dsat.rhetorical-synthesis', kind: 'definition', title: 'rhetorical synthesis', content: `Digital SAT question type combining bulleted research notes with a stated goal; the correct choice is the sentence that best accomplishes that goal using only the notes.` },
    { loId: 'dsat.rhetorical-synthesis', kind: 'definition', title: 'goal fit', content: `whether a choice performs the specific rhetorical move (compare, introduce, summarize, etc.) the stated goal calls for — the deciding factor, not accuracy alone.` },
    { loId: 'dsat.rhetorical-synthesis', kind: 'definition', title: 'unsupported addition', content: `a detail in an answer choice that does not appear anywhere in the bulleted notes, even if it sounds plausible.` },
  ],
  methods: [
    {
      title: 'Worked typical difference',
      steps: [
        `Goal check: "emphasize a key difference in TIME INVESTMENT" — the sentence needs to contrast the two methods specifically on time.`,
        `Scan the notes for time-related facts: coral gardening — "2-3 years"; 3D-printed structures — "within weeks."`,
        `(A) states a similarity, not a difference — wrong move. (C) contrasts cost, not time — off-topic for this goal. (D) describes only one method, no contrast at all.`,
        `(B) directly contrasts the two specific time figures from the notes — matches the goal exactly.`,
      ],
      example: { problem: `A student is writing about two coral-reef restoration methods. Notes: - Coral gardening grows coral fragments in underwater nurseries before transplanting them to damaged reefs. - Coral gardening requires regular diver maintenance and can take 2-3 years before transplants show growth. - 3D-printed reef structures provide an artificial substrate that mimics natural reef texture within weeks of installation. - 3D-printed structures are more expensive per unit but need little maintenance after placement. The student wants to emphasize a key difference in the time investment required by the two methods. Which choice most effectively uses relevant information from the notes to accomplish this goal? (A) Both coral gardening and 3D-printed reefs aim to restore damaged reef ecosystems. (B) Coral gardening can take two to three years to show growth, while 3D-printed reef structures can provide habitat within weeks. (C) 3D-printed reef structures are more expensive to produce than the coral fragments used in gardening. (D) Coral gardening requires regular attention from divers to succeed.`, solution: `(B) Coral gardening can take two to three years to show growth, while 3D-printed reef structures can provide habitat within weeks.` },
      relatedLoIds: ['dsat.rhetorical-synthesis'],
    },
    {
      title: 'Worked trap unsupported',
      steps: [
        `Goal check: introduce a CHALLENGE, in accessible language for a new audience — the sentence must describe a problem, not a success.`,
        `(B) is accurate but describes a BENEFIT (40 percent waste reduction) — wrong rhetorical move for a "challenge" goal.`,
        `(C) sounds plausible about corn-based origin, but "gaining popularity worldwide" appears NOWHERE in the notes — unsupported addition. Eliminate even though it reads well.`,
        `(D) similarly invents "some studies suggest... inconvenient" — the notes say nothing about consumer opinion or studies — unsupported addition.`,
        `(A) states the composting-facility limitation straight from the notes, in plain language — matches the goal and uses only notes info.`,
      ],
      example: { problem: `A student is writing about two plastic-waste-reduction methods. Notes: - Compostable plastics are made from plant starches such as corn or sugarcane rather than petroleum. - Compostable plastics only break down fully in industrial composting facilities, which are unavailable in most cities. - Reusable container programs let customers return packaging to be washed and refilled at the same store. - A 2021 pilot of a reusable container program reduced one grocery chain's packaging waste by 40 percent. The student wants to introduce a challenge associated with one of these methods to an audience new to the topic. Which choice most effectively uses relevant information from the notes to accomplish this goal? (A) Compostable plastics, though marketed as eco-friendly, actually require industrial composting facilities that most cities do not have, limiting their real-world benefit. (B) A 2021 pilot program showed that returnable packaging can cut a grocery chain's waste by 40 percent. (C) Compostable plastics are made from plant starches like corn instead of petroleum-based materials, making them a promising green innovation gaining popularity worldwide. (D) Reusable container programs require customers to return packaging, which some studies suggest most consumers find inconvenient.`, solution: `(A) Compostable plastics, though marketed as eco-friendly, actually require industrial composting facilities that most cities do not have, limiting their real-world benefit.` },
      relatedLoIds: ['dsat.rhetorical-synthesis'],
    },
  ],
  pointers: [
    { content: `On rhetorical synthesis, all four choices are typically well-written and notes-consistent. The only thing that separates them is whether they accomplish the STATED GOAL. Reread the goal, decide what rhetorical move it calls for (compare, introduce, summarize, contrast), and eliminate any choice — however polished — that makes the wrong move or covers only half of it.`, kind: 'common-error' },
    { content: `Read the GOAL before evaluating any choice — it is the filter, not an afterthought.`, kind: 'tip' },
    { content: `Identify the rhetorical MOVE the goal calls for (compare, contrast, introduce, summarize, example) before checking facts.`, kind: 'tip' },
    { content: `Eliminate choices that add info not found in the notes (unsupported addition) and choices that cover only half a two-part goal.`, kind: 'tip' },
    { content: `All four choices are usually accurate and well-written — goal fit, not detail or polish, decides the answer.`, kind: 'tip' },
    { content: `Underline the words after "The student wants to..." and after "to a/an ___ audience." Both halves are scored. "Introduce X to an audience unfamiliar with the topic" means no jargon *and* a definition — a choice packed with technical specifics fails even if every fact is in the notes.`, kind: 'gotcha' },
    { content: `"Emphasize a difference" ≠ "describe both." A choice can mention both subjects and still be wrong if it lists two unrelated facts instead of contrasting them on the SAME dimension (time vs. time, cost vs. cost). Check that both halves measure the same thing.`, kind: 'common-error' },
    { content: `Notes bullets often contain 2-3 facts about each subject on purpose — cost, time, maintenance. The goal names ONE of them. Before reading choices, circle the bullets that match that dimension; the other bullets exist only to bait accurate-but-off-goal answers.`, kind: 'tip' },
    { content: `Evaluative language is the usual smuggled addition: "a promising innovation," "increasingly popular," "the most effective method," "experts agree," "surprisingly." If the notes state a plain fact and the choice adds a judgment about it, that judgment must also come from the notes.`, kind: 'gotcha' },
    { content: `"Goal fit" is not "uses the most notes." A choice that stitches in four bullets can miss the goal, while a one-clause sentence using a single bullet can nail it. Coverage matters only when the goal itself is two-part (compare, similarity, cause AND effect).`, kind: 'vocab-note' },
    { content: `Notes questions are NOT transitions questions. Don't grade choices on how smoothly they'd flow after a previous sentence or on their connecting words — there is no surrounding passage here. Logic and flow are irrelevant; only the stated goal decides.`, kind: 'gotcha' },
    { content: `For "state the main finding/takeaway" goals, the answer usually reports the RESULT and its comparison, not the study's setup. Choices that describe sample size, methodology, or what researchers controlled for are background — accurate, but not the takeaway.`, kind: 'edge-case' },
    { content: `If two choices both seem to hit the goal, look for the one that adds a word not traceable to a bullet — that's your tiebreaker. Point to the exact bullet behind every clause of your pick; if a clause has no bullet, it's out.`, kind: 'tip' },
  ],
};
