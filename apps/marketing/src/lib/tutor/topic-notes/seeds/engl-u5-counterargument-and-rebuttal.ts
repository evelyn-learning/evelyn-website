/**
 * HS English — Unit 5 CED 5.4: Counterargument & Rebuttal.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.engl.counterargument-and-rebuttal.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ENGL_U5_COUNTERARGUMENT_AND_REBUTTAL: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.engl.counterargument-and-rebuttal.v1',
  course: 'HS English',
  cedUnit: 5,
  cedTopic: '5.4',
  cedTitle: 'Counterargument & Rebuttal',
  planId: 'evelyn.hs.engl.counterargument-and-rebuttal.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.engl.counterargument-and-rebuttal.v1' }],
  theory: [
    { loId: 'engl.counterargument-and-rebuttal', content: `ACKNOWLEDGING THE OTHER SIDE MAKES YOU STRONGER, NOT WEAKER. A reader who thinks of an objection you never mentioned assumes you either missed it or hid it. Naming it first proves you looked, and it lets you control how that objection gets stated.` },
    { loId: 'engl.counterargument-and-rebuttal', kind: 'framework', title: 'Straw-man', content: `STRAW-MAN — restating the opposing view in its weakest, silliest form so it is easy to knock over: "People against the later start time just want students to sleep all day." Nobody actually argues that, so defeating it proves nothing.` },
    { loId: 'engl.counterargument-and-rebuttal', kind: 'framework', title: 'Steel-man', content: `STEEL-MAN — restating the opposing view in its STRONGEST honest form, the way a thoughtful opponent would put it: "Opponents point out that a later start would push athletic practices past sunset, which raises real safety and staffing problems." Beat that version and you have actually won something.` },
    { loId: 'engl.counterargument-and-rebuttal', content: `CONCESSION LANGUAGE signals that you are now speaking for the other side, on purpose: "admittedly", "it is true that", "critics reasonably argue", "there is no denying that". Without a signal phrase, readers cannot tell your view from theirs.` },
    { loId: 'engl.counterargument-and-rebuttal', kind: 'framework', title: 'Rebuttal move 1', content: `REBUTTAL MOVE 1 — COUNTER-EVIDENCE. Show that the factual claim underneath the objection does not hold: "Admittedly, critics expected costs to rise, yet the three districts that tried this reported no increase in their transportation budgets."` },
    { loId: 'engl.counterargument-and-rebuttal', kind: 'framework', title: 'Rebuttal move 2', content: `REBUTTAL MOVE 2 — CONCEDE AND OUTWEIGH. Grant that the objection is true, then argue that something more important sits on the other side of the scale: "It is true that practices would end after dark. Even so, an extra hour of sleep every school night affects far more of a student's day than the last half hour of practice does."` },
    { loId: 'engl.counterargument-and-rebuttal', kind: 'framework', title: 'Rebuttal move 3', content: `REBUTTAL MOVE 3 — EXPOSE THE HIDDEN ASSUMPTION. Show that the objection only works if you accept an unstated premise, then reject that premise: the claim that a garden wastes the lot assumes the only value land can have is sale value.` },
    { loId: 'engl.counterargument-and-rebuttal', content: `TURN WORDS mark the pivot back to your own argument: "however", "yet", "even so", "still", "nevertheless". A concession without a turn word usually means the writer conceded and never came back.` },
    { loId: 'engl.counterargument-and-rebuttal', kind: 'framework', title: 'The ignore-the-opposition error', content: `THE IGNORE-THE-OPPOSITION ERROR — writing as if no reasonable person disagrees. It reads as either uninformed or evasive, and it leaves the strongest objection sitting in the reader's mind unanswered for the whole essay.` },
    { loId: 'engl.counterargument-and-rebuttal', kind: 'definition', title: 'counterargument', content: `the strongest objection a reasonable opponent would raise against your claim, stated in your own writing before you answer it.` },
    { loId: 'engl.counterargument-and-rebuttal', kind: 'definition', title: 'rebuttal', content: `the response that answers the counterargument — through counter-evidence, an exposed assumption, or conceding the point and outweighing it.` },
    { loId: 'engl.counterargument-and-rebuttal', kind: 'definition', title: 'concession', content: `granting that part of the opposing view is true or reasonable; it must be followed by a turn back to your claim, or it becomes a surrender.` },
  ],
  methods: [
    {
      title: 'Worked build counter rebuttal',
      steps: [
        `Predict the objection a thoughtful opponent would raise. Not "opponents hate reading" — that is a straw-man. The real worry is money and staffing: three extra hours of building time means paying a librarian and a custodian on every school night.`,
        `State it in steel-man form, with a concession signal: "It is true that staying open until eight would add three paid hours of staffing to every school night, and the building budget is already tight."`,
        `Choose the rebuttal move. Counter-evidence would need budget numbers we do not have, so the honest move is CONCEDE AND OUTWEIGH — the cost is real, but compare it against what the hours buy.`,
        `Turn back with a turn word and put the heavier thing on the scale: "Even so, the students who most need a quiet place to work are the ones without one at home, and the cost of a few staff hours is small next to the cost of those students falling behind."`,
        `Read the pair back and check three things: the objection is one a real opponent would recognize, a concession phrase marks it as theirs, and a turn word carries the paragraph back to the claim.`,
      ],
      example: { problem: `Build a fair counterargument and a rebuttal for this claim: "Ridgeway High should keep the library open until eight on weeknights."`, solution: `Counterargument: extended hours add real staffing cost to a tight budget. Rebuttal (concede and outweigh): the cost is genuine, yet the students without a quiet workspace at home gain the most, and that benefit outweighs a few staff hours` },
      relatedLoIds: ['engl.counterargument-and-rebuttal'],
    },
    {
      title: 'Worked fake rebuttal',
      steps: [
        `Locate the counterargument: "Some people say the town should sell the lot instead." It is present, but thin — it never says WHY selling matters, so the reader never meets the real objection.`,
        `Locate the rebuttal: "the town should really build the community garden, because a garden would be a wonderful thing." That is not a rebuttal at all. It is the original claim restated with more volume and no new reason — the reader is given nothing that was not already asserted.`,
        `Name the second failure mode to watch for, the mirror image of this one: a writer concedes generously ("admittedly, selling the lot would fund overdue road repairs") and then simply moves on to the next paragraph. Conceding without a turn word hands the point to the opposition.`,
        `Repair step one — steel-man the objection so it carries actual force: "Admittedly, selling the Fifth Street lot would bring in money the town has already earmarked for overdue road repairs."`,
        `Repair step two — answer it with a real move. Expose the hidden assumption plus outweigh: "That argument assumes land is only worth what it sells for. Yet the lot has stood empty for six years, a one-time sale funds one round of repairs, and a garden keeps producing food and a gathering place every summer after that."`,
      ],
      example: { problem: `A student writes this paragraph for the claim that Brookline should turn its empty Fifth Street lot into a community garden: "Some people say the town should sell the lot instead. But the town should really build the community garden, because a garden would be a wonderful thing for Brookline." Diagnose what has gone wrong and repair it.`, solution: `The paragraph restates the claim louder instead of rebutting; a real rebuttal must add something new — counter-evidence, an exposed assumption, or a concession followed by a turn word and an outweighing reason` },
      relatedLoIds: ['engl.counterargument-and-rebuttal'],
    },
  ],
  pointers: [
    { content: `The objection is already in the reader's mind — silence does not remove it, it just leaves it unanswered and makes you look like you either missed it or dodged it. Raising it yourself does two things you cannot do any other way: you get to state the objection in the form you can answer, and you get the last word on it. An argument that has survived its best challenge in public is more convincing than one that has never been tested.`, kind: 'common-error' },
    { content: `Name the strongest opposing view yourself — an unanswered objection in the reader's mind does more damage than one you raise and answer.`, kind: 'tip' },
    { content: `Steel-man, never straw-man: state the objection the way a thoughtful opponent would state it, or defeating it proves nothing.`, kind: 'tip' },
    { content: `Mark the handoff with concession language ("admittedly", "it is true that") and mark the return with a turn word ("however", "yet", "even so").`, kind: 'tip' },
    { content: `Three rebuttal moves: counter-evidence, exposing a hidden assumption, or conceding the point and outweighing it. Restating your claim louder is none of them.`, kind: 'tip' },
    { content: `A concession without a turn word is a surrender. If your paragraph ends on "admittedly, selling the lot would fund road repairs," you have just written the opposition's argument for them. Every "it is true that" needs a matching "even so" or "yet" before the paragraph closes.`, kind: 'common-error' },
    { content: `Restating your claim louder is not a rebuttal. "But a garden would really be wonderful for Brookline" adds no new evidence, no exposed assumption, no outweighing reason. Ask: what does this sentence tell the reader that the thesis didn't already say?`, kind: 'common-error' },
    { content: `Test for a straw-man by asking: would an actual opponent sign their name to this sentence? "People who disagree just want students to sleep all day" fails. "A later start pushes practice past sunset" passes — nobody argues the first, plenty argue the second.`, kind: 'tip' },
    { content: `Don't confuse *counterargument* with *rebuttal*. The counterargument is the opponent's objection stated in your own words; the rebuttal is your answer to it. A paragraph with only the first half hands your reader an unanswered problem.`, kind: 'vocab-note' },
    { content: `Choose the rebuttal move you can actually support. Counter-evidence needs real numbers or cases — if you don't have them, don't invent them. Concede-and-outweigh or exposing a hidden assumption work with reasoning you already have.`, kind: 'tip' },
    { content: `Exposing a hidden assumption means naming the unstated premise, not just disagreeing. Write "that argument assumes land is only worth what it sells for" — then reject it. Saying "that's not true" identifies nothing.`, kind: 'gotcha' },
    { content: `A concession admits a *part* of the opposing view, not your whole thesis. "It is true that staffing costs money" is a concession; "maybe the library shouldn't stay open late" is abandoning your claim. Concede the fact, never the conclusion.`, kind: 'edge-case' },
    { content: `If your opposing view starts "some people say" and stops there, it isn't stated yet. Say WHY the objection has force — the budget, the schedule, the safety risk — or the reader never meets the argument you claim to be defeating.`, kind: 'common-error' },
  ],
};
