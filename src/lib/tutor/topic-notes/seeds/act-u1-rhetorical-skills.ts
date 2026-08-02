/**
 * ACT — Unit 1 CED 1.9: Rhetorical Skills: Adding, Deleting & Organizing.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.act.rhetorical-skills.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ACT_U1_RHETORICAL_SKILLS: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.act.rhetorical-skills.v1',
  course: 'ACT',
  cedUnit: 1,
  cedTopic: '1.9',
  cedTitle: 'Rhetorical Skills: Adding, Deleting & Organizing',
  planId: 'evelyn.testprep.act.rhetorical-skills.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-02',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.act.rhetorical-skills.v1' }],
  theory: [
    { loId: 'act.rhetorical-skills', content: `ADD/DELETE STRUCTURE: these questions almost always give four choices split two Yes and two No (or two Kept and two Deleted), each with a DIFFERENT reason. The yes/no alone eliminates at most two choices — the reason decides between the remaining two.` },
    { loId: 'act.rhetorical-skills', content: `TEST THE REASON AGAINST THE TEXT: for each choice, ask "does this reason accurately describe what the sentence does?" A reason can be wrong even when its yes/no call is right, and a reason can describe something TRUE that still is not why the sentence should be added or cut.` },
    { loId: 'act.rhetorical-skills', content: `ADD trap — TOPICALLY TRUE BUT OFF-FOCUS: a candidate sentence can be accurate and even interesting, but if it drifts from the paragraph's specific focus (not just the passage's general subject), the right answer is No because it strays, not because it is false.` },
    { loId: 'act.rhetorical-skills', content: `ADD trap — FALSE REDUNDANCY CLAIM: a "No, because it repeats information already given" choice is only correct if that information was actually stated earlier. Distractors invent a repetition that never happened.` },
    { loId: 'act.rhetorical-skills', content: `DELETE trap — LOSES THE SPECIFIC EXAMPLE: the most common right answer to "the paragraph would primarily lose ___" is a sentence that supplied a concrete number, name, or detail supporting a general claim made elsewhere in the paragraph.` },
    { loId: 'act.rhetorical-skills', content: `ACCOMPLISHES-GOAL STRUCTURE: unlike most ACT English questions, all four choices are usually grammatically correct AND factually plausible. The only test is whether the choice matches the EXACT goal named in the prompt (emphasize X, illustrate Y, show contrast) — not whether it is well written.` },
    { loId: 'act.rhetorical-skills', content: `ACCOMPLISHES-GOAL trap — RIGHT TOPIC, WRONG GOAL: a choice can add true, relevant-sounding detail (a date, a location, a reaction) that answers a DIFFERENT implicit goal than the one stated. Re-read the named goal after evaluating each choice, not before.` },
    { loId: 'act.rhetorical-skills', content: `NO CHANGE is a fully legitimate answer on both formats — it wins whenever the original best fits the focus or the goal, not because it is the safe default.` },
    { loId: 'act.rhetorical-skills', kind: 'definition', title: 'kept/deleted question', content: `an ACT English question asking whether a sentence should be added or removed, always paired with a specific reason as part of the answer choice.` },
    { loId: 'act.rhetorical-skills', kind: 'definition', title: `accomplishes the writer's goal`, content: `a question format where every choice is accurate, and only the choice matching the exact stated purpose is correct.` },
  ],
  methods: [
    {
      title: 'Worked add reason',
      steps: [
        `Name the paragraph's specific focus: not "the library" in general, but the reading room's added seating and study pods.`,
        `Check the candidate sentence against that focus: it describes the circulation desk's paint color — a different renovation detail, not reading-room capacity.`,
        `Test every reason, not just the yes/no: (A) is topically true but does not make it belong HERE; (B) claims the sentence explains the seat increase, but paint color explains nothing about seating; (C) claims redundancy, but paint was never mentioned before — there is nothing to repeat.`,
        `(D) is the only reason that accurately names the real problem: the sentence is accurate but off the paragraph's specific focus.`,
      ],
      example: { problem: `A paragraph reads: "The reading room was expanded to include forty new seats and three group-study pods." The writer is considering adding this sentence right after it: "The circulation desk was repainted a pale blue to match the children's section." Should the sentence be added? (A) Yes, because it shows the renovation extended beyond the reading room. (B) Yes, because it explains why seating increased. (C) No, because it repeats information already given about seating. (D) No, because it strays from the paragraph's focus on the reading room's capacity.`, solution: `No — do not add it, because it strays from the paragraph's focus on the reading room's capacity (choice D), even though the sentence itself is true.` },
      relatedLoIds: ['act.rhetorical-skills'],
    },
    {
      title: 'Worked accomplishes goal',
      steps: [
        `Isolate the goal exactly as stated: emphasize the BREADTH of Maya's experience — not just any true fact about the internship.`,
        `Remember all four choices are grammatical and plausible; the test is fit-to-goal, not correctness.`,
        `Eliminate goal-mismatches: (C) adds a location detail — true, but says nothing about breadth; (D) adds a timeframe — true, but says nothing about variety of work.`,
        `Compare the remaining two: (A) NO CHANGE names only one kind of task across six clients; (B) adds two more distinct tasks — client meetings, trade-show prep — which multiplies the KINDS of work described.`,
      ],
      example: { problem: `Original sentence: "During her internship at the design studio, Maya sketched packaging concepts for six different clients." Suppose the writer wants to emphasize the BREADTH of experience Maya gained. Which choice best accomplishes this goal? (A) NO CHANGE (B) "sketched packaging concepts, sat in on client meetings, and helped prepare a trade-show display for six different clients" (C) "sketched packaging concepts for six different clients, most of whom were based in Chicago" (D) "sketched packaging concepts for six different clients over the course of ten weeks"`, solution: `(B) — it most directly accomplishes "breadth" by broadening the range of tasks, not just adding an adjacent true fact.` },
      relatedLoIds: ['act.rhetorical-skills'],
    },
  ],
  pointers: [
    { content: `All four choices usually split into two Yes and two No, but four DIFFERENT reasons. Getting the right yes/no with the wrong reason is still wrong — verify the reason accurately describes what the sentence does (new info, redundant, off-focus, or contradicts) before locking in.`, kind: 'common-error' },
    { content: `On these questions every choice is usually grammatical and true — the question only asks which one matches the SPECIFIC goal named in the prompt. Re-read the exact goal after evaluating each choice, not before, and reject true-but-off-goal choices.`, kind: 'common-error' },
    { content: `Add/delete choices split two Yes / two No with four different reasons — the REASON decides the answer, not the yes/no call.`, kind: 'tip' },
    { content: `Test a reason against the actual paragraph: is it new information, redundant, off-focus, or does it support/contradict a claim made elsewhere?`, kind: 'tip' },
    { content: `"Accomplishes the goal" choices are usually all true — reread the exact goal and pick the choice that matches it specifically, not just any strong sentence.`, kind: 'tip' },
    { content: `NO CHANGE is a legitimate answer on both formats whenever the original best fits the focus or the goal.`, kind: 'tip' },
    { content: `Answer the *question asked*, not "what sounds nicest." A deletion question phrased "the paragraph would primarily lose" is not asking whether to delete — it assumes deletion and asks what disappears. Don't pick a choice describing what the paragraph *keeps*.`, kind: 'gotcha' },
    { content: `In "would primarily lose" choices, distractors often overstate: "loses the essay's main argument," "loses a transition," or "loses an explanation of why." One deleted sentence rarely carries the whole essay. Pick the modest, literal loss — usually one specific detail.`, kind: 'common-error' },
    { content: `Watch for reasons that fail on a *pronoun or logic* level, not a content level: "No, because it contradicts the writer's earlier point" is wrong unless there's an actual contradiction. Invented contradictions and invented redundancies are the same trap wearing two hats.`, kind: 'gotcha' },
    { content: `Goal words carry different tests: *emphasize* wants intensity/scale, *illustrate* or *specify* wants a concrete example, *contrast* wants a shift word plus opposing detail, *explain why* wants causation. Underline the goal verb before comparing choices.`, kind: 'vocab-note' },
    { content: `"Paragraph's focus" ≠ "essay's topic." A sentence about the essay's overall subject can still be off-focus for the paragraph it lands in. Reread only the sentences immediately around the insertion point to name the focus.`, kind: 'tip' },
    { content: `Placement matters: the question says "add the sentence *here*." If the sentence would fit elsewhere in the essay but breaks the chain of ideas at this spot, the answer is No. Don't reward a sentence for being generally useful.`, kind: 'edge-case' },
    { content: `On accomplishes-goal items, don't reject the *shortest* choice on length alone — and don't pick the longest because it packs in more facts. NO CHANGE and one-word additions win regularly when they hit the goal exactly.`, kind: 'common-error' },
    { content: `If two remaining choices share the same yes/no and both reasons seem plausible, pick the one that names a *relationship to the paragraph* (supports, sets up, strays from) over one that only restates what the sentence says.`, kind: 'tip' },
  ],
};
