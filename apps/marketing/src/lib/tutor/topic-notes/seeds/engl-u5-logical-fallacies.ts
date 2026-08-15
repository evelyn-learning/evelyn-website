/**
 * HS English — Unit 5 CED 5.3: Spotting Logical Fallacies.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.engl.logical-fallacies.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ENGL_U5_LOGICAL_FALLACIES: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.engl.logical-fallacies.v1',
  course: 'HS English',
  cedUnit: 5,
  cedTopic: '5.3',
  cedTitle: 'Spotting Logical Fallacies',
  planId: 'evelyn.hs.engl.logical-fallacies.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.engl.logical-fallacies.v1' }],
  theory: [
    { loId: 'engl.logical-fallacies', kind: 'framework', title: 'What a fallacy actually is', content: `WHAT A FALLACY ACTUALLY IS — a fallacy is not a false statement; it is a broken CONNECTION. The reason offered might even be true, and the conclusion might even be right, but the reason does not do the work of supporting the conclusion. The universal test: if I grant the reason, am I any closer to having to accept the claim?` },
    { loId: 'engl.logical-fallacies', kind: 'framework', title: 'Family 1, attack-the-person moves', content: `FAMILY 1, ATTACK-THE-PERSON MOVES — instead of answering the argument, change the target. AD HOMINEM swaps the argument for the arguer: "Why should we take Jamal's recycling plan seriously? He forgot his own lunch three days last week." Exposing question: has anyone actually answered the plan?` },
    { loId: 'engl.logical-fallacies', kind: 'framework', title: 'Family 1 continued, straw man', content: `FAMILY 1 CONTINUED, STRAW MAN — rebuild the other side into a weaker argument, then knock that one down: "Nina wants a later start time, so apparently she thinks school should barely happen at all." Exposing question: is that what she actually said, or a cheaper version of it? The tell is usually a word like "so basically" or "apparently" in front of something nobody claimed.` },
    { loId: 'engl.logical-fallacies', kind: 'framework', title: 'Family 2, fake-forced-choice moves', content: `FAMILY 2, FAKE-FORCED-CHOICE MOVES — narrow the world until only one exit remains. FALSE DILEMMA offers two options as if they were the only two: "Either we cancel the field trip entirely or we let students plan it with no supervision." Exposing question: what is the third option being hidden?` },
    { loId: 'engl.logical-fallacies', kind: 'framework', title: 'Family 2 continued, slippery slope', content: `FAMILY 2 CONTINUED, SLIPPERY SLOPE — chain one small step to a disaster without showing any of the links: "If we allow phones at lunch, nobody will ever pay attention in class again." Exposing question: what makes each step actually cause the next one? A slope is only a fallacy when the links are asserted rather than shown; a chain of steps with evidence for each link is a legitimate prediction.` },
    { loId: 'engl.logical-fallacies', kind: 'framework', title: 'Family 3, weak-evidence moves', content: `FAMILY 3, WEAK-EVIDENCE MOVES — real evidence is offered, but far too little of it. HASTY GENERALIZATION jumps from a tiny sample to a sweeping rule: "Two seniors missed the bus this morning, so seniors cannot be trusted with off-campus lunch." Exposing question: how many cases, and are they representative?` },
    { loId: 'engl.logical-fallacies', kind: 'framework', title: 'Family 3 continued, false cause', content: `FAMILY 3 CONTINUED, FALSE CAUSE — treat one thing following another as one thing causing another: "The team has won every game since Coach changed the warm-up playlist, so the playlist is what wins games." Exposing question: could this be coincidence, or could a third factor explain both?` },
    { loId: 'engl.logical-fallacies', kind: 'framework', title: 'Family 3 continued, bandwagon', content: `FAMILY 3 CONTINUED, BANDWAGON — substitute popularity for proof: "Everyone in the group chat already agreed, so it is obviously the right call." Exposing question: what evidence exists besides the number of people holding the view? Popular claims are often true, but the popularity is not what makes them true.` },
    { loId: 'engl.logical-fallacies', kind: 'definition', title: 'logical fallacy', content: `a flaw in reasoning where the stated reason fails to support the conclusion, even if the reason itself happens to be true.` },
    { loId: 'engl.logical-fallacies', kind: 'definition', title: 'straw man', content: `a distorted, weakened restatement of an opponent's argument, attacked in place of the real one.` },
    { loId: 'engl.logical-fallacies', kind: 'definition', title: 'false cause', content: `the assumption that because one event followed another, the first event caused the second.` },
  ],
  methods: [
    {
      title: 'Worked name the fallacy',
      steps: [
        `Find the claim and its support. Rosa's claim: the vending profits should fund the art club. Her reason: that club alone has no budget line. That reason is checkable and it bears directly on the claim.`,
        `Find what the response actually addresses. Dev says nothing about budget lines, funding, or the art club. He talks about Rosa's motive — who she is related to.`,
        `Name it: ad hominem, the attack-the-person move. Apply the universal test — grant that Rosa's sister is in the art club. Does that make it any less true that the club has no budget line? It does not, so the reason cannot support the conclusion Dev wants.`,
        `Say why the move is tempting anyway: a hidden motive is real information, and it is fair to ask Rosa to disclose it. But motive tells us why someone made an argument, never whether the argument is any good. Interested people can be right.`,
        `Model the honest rebuttal: "The art club has no budget line because it raises its own funds through the winter show, so the vending profits are better aimed at a group with no fundraiser." That reply engages the reason instead of the person.`,
      ],
      example: { problem: `Name the fallacy in this exchange and explain why the reasoning fails: Rosa said, "The vending machine profits should fund the art club this year, since the art club is the only group with no budget line at all." Dev answered, "Rosa only says that because her sister is in the art club."`, solution: `Ad hominem — Dev attacks Rosa's motive instead of her reason, so her claim that the art club has no budget line goes completely unanswered` },
      relatedLoIds: ['engl.logical-fallacies'],
    },
    {
      title: 'Worked not every argument is a fallacy',
      steps: [
        `State what actually makes an appeal to authority fallacious. It goes wrong in three specific ways: the expert is speaking outside their field, the claim is one experts genuinely dispute, or the authority is offered as PROOF that ends the discussion rather than as evidence that supports it.`,
        `Check the excerpt against each condition. The field matches — sprint training and hamstring injuries are precisely Coach Yeboah's domain. The claim is not framed as settled beyond question. And the reasoning does not stop at one voice: the district trainer reports the same pattern across four schools.`,
        `Notice what the corroboration does NOT make it. Two sources agreeing is not bandwagon, because bandwagon counts heads rather than weighing relevant expertise. The difference is whether the people cited have a reason to know.`,
        `Deliver the verdict. This is ordinary inductive support: relevant expertise plus independent corroboration, offered as evidence. It could still turn out to be wrong — inductive support is never a guarantee — but being possibly wrong is not the same as being fallacious.`,
        `Draw the general rule. Fallacy labels describe HOW a reason connects to a conclusion, not how confident the speaker sounds or whether you like the conclusion. To push back here, ask about the evidence — how many athletes, over how long, compared with what — rather than reaching for a label.`,
      ],
      example: { problem: `A student labels the following as an appeal-to-authority fallacy: "Coach Yeboah, who has trained sprinters for nineteen years, says the new warm-up sequence lowers hamstring injuries, and the district athletic trainer reports the same pattern across four schools." Is the student right? Explain.`, solution: `No fallacy — the expertise is relevant, independently corroborated, and offered as evidence rather than as proof that ends the discussion; only irrelevant, disputed, or overstated authority would be fallacious` },
      relatedLoIds: ['engl.logical-fallacies'],
    },
  ],
  pointers: [
    { content: `Naming a fallacy retires ONE reason, not the whole position. Malik may have three other reasons that stand perfectly well, and his conclusion could still be true even if that one argument for it was broken. After naming the fallacy, you still owe the rest of his case an answer.`, kind: 'common-error' },
    { content: `A fallacy is a defect in the link between reason and conclusion, not a matter of tone. A quiet argument can be fallacious and a forceful one can be airtight. Test the connection, not the volume.`, kind: 'common-error' },
    { content: `A fallacy is a broken link between reason and conclusion — the reason can be true and the move still fails.`, kind: 'tip' },
    { content: `Three families: attack-the-person (ad hominem, straw man), fake-forced-choice (false dilemma, slippery slope), weak-evidence (hasty generalization, false cause, bandwagon).`, kind: 'tip' },
    { content: `Each has an exposing question: was the argument answered? is that what they said? what is the third option? what makes each step follow? how many cases? could a third factor explain it? what evidence besides popularity?`, kind: 'tip' },
    { content: `Naming a fallacy retires one reason, not the whole argument — and a strong, confident claim is not a fallacy just for being strong.`, kind: 'tip' },
    { content: `A fallacy is a broken **link**, not a false statement. Don't write "that's a fallacy because it's not true." Test the connection instead: if I grant the reason, am I any closer to having to accept the claim?`, kind: 'common-error' },
    { content: `Not every slope is slippery. A step-by-step prediction with evidence for each link is legitimate forecasting. Only call it slippery slope when the links are **asserted** rather than shown.`, kind: 'edge-case' },
    { content: `Don't confuse ad hominem with straw man. Ad hominem attacks the **arguer** (motive, character, past behavior); straw man distorts the **argument** into a weaker version. Ask: did they misquote the claim, or change the subject to the person?`, kind: 'vocab-note' },
    { content: `Bandwagon counts heads; a legitimate appeal to authority weighs relevant expertise. Two qualified sources corroborating each other is evidence, not bandwagon. Ask whether the people cited have a reason to *know*.`, kind: 'gotcha' },
    { content: `Naming a fallacy retires **one reason**, not the whole position. After you name it, you still owe an answer to the speaker's other evidence — and their conclusion may still be true.`, kind: 'common-error' },
    { content: `Tone is not reasoning. A loud, confident claim is not a fallacy for being forceful, and a calm one can be badly broken. Never label something because you dislike the conclusion or the delivery.`, kind: 'gotcha' },
    { content: `False cause needs a *sequence*, not just a comparison. Look for the "since / ever since / after" structure plus a leap to "that's what caused it." Then ask: coincidence, or a third factor explaining both?`, kind: 'tip' },
    { content: `For false dilemma, always name the hidden third option out loud in your explanation. "Either X or Y" is only fallacious if a real alternative exists — some choices genuinely are binary.`, kind: 'edge-case' },
  ],
};
