/**
 * HS English — Unit 5 CED 5.1: Claims, Evidence & Reasoning.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.engl.claims-and-evidence.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ENGL_U5_CLAIMS_AND_EVIDENCE: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.engl.claims-and-evidence.v1',
  course: 'HS English',
  cedUnit: 5,
  cedTopic: '5.1',
  cedTitle: 'Claims, Evidence & Reasoning',
  planId: 'evelyn.hs.engl.claims-and-evidence.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.engl.claims-and-evidence.v1' }],
  theory: [
    { loId: 'engl.claims-and-evidence', kind: 'framework', title: 'A claim is arguable', content: `A CLAIM IS ARGUABLE — a claim is a statement a reasonable person could disagree with. "Our school day starts at 7:40" is a FACT (checkable, not arguable). "Early school days are unpleasant" is an OPINION (personal taste, nothing to prove). "Our school should push its start time to 8:30" is a CLAIM — someone could argue the other side, and evidence could settle it.` },
    { loId: 'engl.claims-and-evidence', kind: 'framework', title: 'A claim is specific', content: `A CLAIM IS SPECIFIC — vague claims cannot be supported because nobody can tell what would count as proof. "Sleep is important" commits to nothing. "Teenagers who get eight hours of sleep perform better in first-period classes" names exactly what evidence must show.` },
    { loId: 'engl.claims-and-evidence', kind: 'framework', title: 'Evidence types, roughly strongest to weakest', content: `EVIDENCE TYPES, ROUGHLY STRONGEST TO WEAKEST — statistics and study findings (broad, measurable), documented facts (verifiable, but thin on their own), expert testimony (borrowed authority — only as good as the expert), specific examples (concrete and vivid), and anecdotes (one person's experience — memorable, easiest to dismiss). Strong arguments mix types; weak ones lean on anecdote alone.` },
    { loId: 'engl.claims-and-evidence', kind: 'framework', title: 'The relevance test', content: `THE RELEVANCE TEST — before you use a piece of evidence, ask: does this support THIS claim, or just this TOPIC? Evidence about the general subject is not automatically evidence for your particular assertion. Say the claim out loud, then say the evidence out loud, then ask whether the second makes the first more likely to be true.` },
    { loId: 'engl.claims-and-evidence', kind: 'framework', title: 'Reasoning is the warrant', content: `REASONING IS THE WARRANT — reasoning is the sentence you write that explains WHY the evidence proves the claim. It is the part students skip, because the connection feels obvious to the person who already believes it. It never feels obvious to the reader. If your evidence is a survey result and your claim is about school policy, the reasoning has to say what the survey result implies for policy.` },
    { loId: 'engl.claims-and-evidence', kind: 'framework', title: 'Restating is not reasoning', content: `RESTATING IS NOT REASONING — "This statistic shows that students need more sleep" merely repeats the claim next to the evidence. Real reasoning adds the missing link: "Because the drop in scores appears only in first period and not in later classes, the cause is likely the hour, not the difficulty of the material."` },
    { loId: 'engl.claims-and-evidence', kind: 'framework', title: 'The claim-shift trap', content: `THE CLAIM-SHIFT TRAP — the most common failure in real argument writing: evidence that supports a NEARBY but different claim. Your claim is about the start time; your evidence proves that sleep matters. Those are cousins, not the same claim. Watch for the moment your evidence quietly changes the subject.` },
    { loId: 'engl.claims-and-evidence', kind: 'framework', title: 'The three-part check', content: `THE THREE-PART CHECK — for every paragraph you write, be able to point at the claim, point at the evidence, and point at the reasoning. If you cannot point at all three, the paragraph is incomplete, no matter how good it sounds.` },
    { loId: 'engl.claims-and-evidence', kind: 'definition', title: 'arguable claim', content: `a specific, debatable assertion that evidence could support or undercut — not a checkable fact and not a matter of pure taste.` },
    { loId: 'engl.claims-and-evidence', kind: 'definition', title: 'reasoning', content: `the explicit explanation of why a given piece of evidence makes a given claim more likely to be true; also called the warrant.` },
    { loId: 'engl.claims-and-evidence', kind: 'definition', title: 'relevance', content: `the property of evidence that bears on the specific claim being made, not merely on the same general topic.` },
  ],
  methods: [
    {
      title: 'Worked build chain',
      steps: [
        `Draft the claim and test it for arguability: "Hillcrest should keep the library open until 6 p.m." A reasonable person could argue against it (cost, staffing), and evidence could settle it. It passes.`,
        `Check the claim for specificity: it names the school, the change, and the hour. Compare with a vague version — "the library should be more available" — which commits to nothing and therefore cannot be proved.`,
        `Select the evidence and run the relevance test: the survey statistic is about WHEN students can do schoolwork, and the closing time is about WHEN the building is open. Both bear on the gap between student need and available hours, so both support this claim, not just the topic of libraries.`,
        `Write the reasoning — the link the reader cannot supply alone: because the library closes fifteen minutes after dismissal, it is shut during every hour the surveyed students are actually free to study, so the current schedule serves the students who need the space least.`,
        `Assemble and read it back: claim, then evidence, then reasoning. If you can point at all three sentences, the chain is complete.`,
      ],
      example: { problem: `Build a claim-evidence-reasoning chain from this scenario: "The Hillcrest High student council wants the library kept open until 6 p.m. A district survey found that 62 percent of Hillcrest students who work after-school jobs finish their homework after 8 p.m. The library currently closes at 3:30 p.m., fifteen minutes after dismissal."`, solution: `Claim: Hillcrest should keep the library open until 6 p.m. Evidence: the district survey (62 percent of working students finish homework after 8 p.m.) plus the 3:30 p.m. closing time. Reasoning: the building is closed during exactly the hours those students are free, so the current schedule excludes the students with the greatest need.` },
      relatedLoIds: ['engl.claims-and-evidence'],
    },
    {
      title: 'Worked claim shift',
      steps: [
        `State the exact claim: the school should SWITCH TO an online permission form. Not that families own phones, and not that phones are useful.`,
        `State what the evidence actually proves: that most families have the device required. That is a precondition for the switch, not a reason to make it.`,
        `Name the failure: this is the claim-shift trap. The evidence supports a nearby claim — "an online form would be technically feasible for most families" — which is a different sentence from "the school should switch."`,
        `Notice what is missing: nothing here shows the paper system is failing. No lost slips, no missed deadlines, no cost. Feasibility answers "could we?"; the claim asked "should we?"`,
        `Repair it two ways. Either narrow the claim to match the evidence ("an online form would be accessible to most Hillcrest families"), or add evidence that fits the original claim (a count of permission slips lost each semester) plus reasoning that connects lost slips to the case for switching.`,
      ],
      example: { problem: `A student argues: "Our school should replace paper permission slips with an online form. A district survey found that 88 percent of Hillcrest families own a smartphone." The evidence is true and on-topic. Why does the argument still fail?`, solution: `The evidence proves feasibility ("could we?"), while the claim asserts a course of action ("should we?") — a claim shift. Either narrow the claim to feasibility or add evidence that the paper system is failing.` },
      relatedLoIds: ['engl.claims-and-evidence'],
    },
  ],
  pointers: [
    { content: `Volume is not strength. Each piece must pass the relevance test — does it support THIS claim, or only its topic? Three of those sources may prove that sleep matters, which is a nearby claim, not the claim that the start time should change. Two well-chosen pieces with explicit reasoning beat five on-topic pieces with none.`, kind: 'common-error' },
    { content: `On-topic is not on-claim. Say the claim aloud, then the evidence, then ask whether the evidence makes that exact sentence more likely to be true. If the honest answer is "it supports something close to it," the evidence belongs to a different claim.`, kind: 'common-error' },
    { content: `A claim must be arguable and specific — not a checkable fact, not pure taste, not too vague to test.`, kind: 'tip' },
    { content: `Evidence types vary in strength: statistics and study findings carry more weight than a single anecdote, and strong arguments mix types.`, kind: 'tip' },
    { content: `Run the relevance test on every piece: does it support THIS claim, or merely this topic?`, kind: 'tip' },
    { content: `Reasoning is the sentence that spells out why the evidence proves the claim — restating the claim is not reasoning.`, kind: 'tip' },
    { content: `Watch for the claim shift: evidence that quietly supports a nearby but different claim is the most common failure in argument writing.`, kind: 'tip' },
    { content: `Don't call a checkable fact a claim. "The library closes at 3:30" is evidence; "the library should stay open until 6" is the claim. If nobody could reasonably argue the other side, you've written a fact — and you'll spend the paragraph proving what nobody disputed.`, kind: 'vocab-note' },
    { content: `"Could we?" is not "should we?" Evidence that a change is *possible* (88% of families own smartphones) never proves the change is *desirable*. Feasibility evidence needs a claim about feasibility, or you must add evidence that the current system is failing.`, kind: 'common-error' },
    { content: `Restating isn't reasoning. If your last sentence starts "This shows that..." and then repeats the claim, you have two claims and no warrant. Reasoning names the *mechanism*: why THIS number makes THAT assertion more likely to be true.`, kind: 'common-error' },
    { content: `Say it out loud in order: claim sentence, then evidence sentence, then ask "does the second make the first more likely?" If the honest answer is "it supports something close to it," you've hit the claim shift — fix it by narrowing the claim OR swapping the evidence.`, kind: 'tip' },
    { content: `Five on-topic sources beat nothing, not everything. Volume isn't strength — stacking evidence without reasoning just multiplies unlinked facts. Two well-chosen pieces, each followed by its own reasoning sentence, is a stronger paragraph than five with none.`, kind: 'gotcha' },
    { content: `Anecdotes aren't banned — they're just not load-bearing. Your cousin's experience can open or illustrate a point, but never make it the only support for a contested claim. Pair it with a statistic or study finding it exemplifies.`, kind: 'edge-case' },
    { content: `Expert testimony is only as strong as the expert's actual field. A pediatrician on adolescent sleep is authority; the same pediatrician on school budgets is not. Check that the credential matches the specific assertion.`, kind: 'edge-case' },
    { content: `Before you hand in a body paragraph, physically point at three things: the claim, the evidence, the reasoning. If your finger can't find all three, the paragraph is incomplete — no matter how confident the prose sounds.`, kind: 'tip' },
  ],
};
