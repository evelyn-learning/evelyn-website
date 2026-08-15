/**
 * HS English — Unit 5 CED 5.2: Ethos, Pathos & Logos.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.engl.rhetorical-appeals.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ENGL_U5_RHETORICAL_APPEALS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.engl.rhetorical-appeals.v1',
  course: 'HS English',
  cedUnit: 5,
  cedTopic: '5.2',
  cedTitle: 'Ethos, Pathos & Logos',
  planId: 'evelyn.hs.engl.rhetorical-appeals.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.engl.rhetorical-appeals.v1' }],
  theory: [
    { loId: 'engl.rhetorical-appeals', kind: 'framework', title: 'Ethos', content: `ETHOS — the appeal to CREDIBILITY. The speaker asks you to trust the source: "I have coached this team for eleven years," "as a nurse who worked that ward," "our formula was tested by an independent lab." Recognition cue: language about who the speaker IS, what they have done, or whose endorsement backs them.` },
    { loId: 'engl.rhetorical-appeals', kind: 'framework', title: 'Pathos', content: `PATHOS — the appeal to EMOTION. The speaker asks you to feel something: pride, fear, guilt, hope, belonging. Recognition cue: vivid images, named individuals, sensory detail, second-person "imagine you," and loaded word choice ("abandoned," "thriving," "forgotten").` },
    { loId: 'engl.rhetorical-appeals', kind: 'framework', title: 'Logos', content: `LOGOS — the appeal to LOGIC. The speaker asks you to follow reasoning: data, causes and effects, comparisons, if-then chains. Recognition cue: numbers, studies, "because" and "therefore," and any claim you could in principle check.` },
    { loId: 'engl.rhetorical-appeals', kind: 'framework', title: 'Appeals combine', content: `APPEALS COMBINE — real arguments almost never use one appeal alone. A single fundraising paragraph may open with the speaker's credentials (ethos), tell one family's story (pathos), and close with the cost per meal (logos). The useful question is which appeal DOMINATES a given sentence, not which single appeal the whole speech is.` },
    { loId: 'engl.rhetorical-appeals', kind: 'framework', title: 'Identify by target', content: `IDENTIFY BY TARGET — do not sort by topic; sort by what the sentence is trying to do to you. Ask: is this trying to make me TRUST the speaker (ethos), FEEL something (pathos), or ACCEPT a chain of reasoning (logos)? A statistic inside a sentence does not make it logos if its real job is to shock you; a personal story does not make it pathos if its real job is to establish that the speaker has relevant experience.` },
    { loId: 'engl.rhetorical-appeals', kind: 'framework', title: 'Effective versus manipulative pathos', content: `EFFECTIVE VERSUS MANIPULATIVE PATHOS — pathos is honest when the emotion fits the facts and the audience is left free to decide: a true story about one family, told accurately, helps you understand what the numbers mean. Pathos turns manipulative when it manufactures fear or guilt that the evidence does not support, or when it substitutes for evidence entirely ("if you do not act tonight, it is on you").` },
    { loId: 'engl.rhetorical-appeals', kind: 'framework', title: 'Effective versus manipulative ethos', content: `EFFECTIVE VERSUS MANIPULATIVE ETHOS — honest ethos offers relevant expertise you could verify. Manipulative ethos borrows authority that does not apply: fame instead of expertise, a credential in an unrelated field, or a vague appeal to "experts" and "studies" with no source you could ever check.` },
    { loId: 'engl.rhetorical-appeals', kind: 'framework', title: 'Effective versus manipulative logos', content: `EFFECTIVE VERSUS MANIPULATIVE LOGOS — honest logos gives evidence that actually supports the claim being made. Manipulative logos wears the costume of reasoning: a precise-sounding percentage from an unnamed source, a comparison between things that are not comparable, or one anecdote presented as if it proved a general rule.` },
    { loId: 'engl.rhetorical-appeals', kind: 'definition', title: 'ethos', content: `an appeal to the speaker's credibility, character, or authority, asking the audience to trust the source.` },
    { loId: 'engl.rhetorical-appeals', kind: 'definition', title: 'pathos', content: `an appeal to the audience's emotions, asking them to feel something that moves them toward the claim.` },
    { loId: 'engl.rhetorical-appeals', kind: 'definition', title: 'logos', content: `an appeal to logic and evidence, asking the audience to accept a claim because the reasoning holds.` },
  ],
  methods: [
    {
      title: 'Worked classify ad',
      steps: [
        `Sentence 1 asks who made the shoe: former college track coaches. The target is TRUST in the source, so this is ethos.`,
        `Sentence 2 offers a trial and a percentage, inviting you to reason from evidence to the claim that the shoe works. The target is your REASONING, so this is logos.`,
        `Sentence 3 contains no data and no credentials — "the runs you used to love" is built to make you feel loss and longing. The target is your FEELINGS, so this is pathos.`,
        `Weigh the dominance: the ad ends on the emotional turn and that is the line asking for the purchase, but the reader's judgment is meant to rest on sentence 2. Say so precisely: the ad layers all three, opening with ethos, resting its proof on logos, and closing with pathos to convert.`,
        `Then evaluate quality, which is a separate question from classification: the logos here is unverifiable because the trial has no named source and "our testers" means the seller ran its own study.`,
      ],
      example: { problem: `Classify the appeal in each sentence of this advertisement, then name which appeal dominates: "Every pair of Brightwell trainers is designed by three former college track coaches. In a twelve-week trial, 82 percent of our testers reported less knee pain. Stop limping home from the runs you used to love."`, solution: `Sentence 1 = ethos, sentence 2 = logos, sentence 3 = pathos; the ad layers all three and closes on pathos, and its logos is weak because the trial is self-reported and unsourced` },
      relatedLoIds: ['engl.rhetorical-appeals'],
    },
    {
      title: 'Worked anecdote as logos',
      steps: [
        `Apply the TARGET test to the first sentence: one named neighbor, one child, one vivid before-and-after. It works by making you picture a real kid succeeding, so its target is feeling, not reasoning — this is pathos.`,
        `Notice why the label was tempting: the anecdote is placed where evidence belongs and is followed by the word "evidence," so it wears the costume of logos.`,
        `Test it as reasoning anyway: one case cannot establish a general rule, and nothing rules out other causes — a new school, a new teacher, a growth spurt in maturity. As logos it fails immediately.`,
        `Name the second sentence separately: "the evidence is settled" claims authority without producing any, so it is manipulative ethos — a borrowed appeal to unnamed experts.`,
        `State the correct reading: the excerpt is pathos plus unsupported ethos dressed as logos. Real logos would need many cases, a named source, and a comparison group. Note the mirror-image error too — a statistic does not automatically make an argument good logos, because an unsourced or irrelevant number is still not proof.`,
      ],
      example: { problem: `A student labels this school-board excerpt as logos: "My neighbor's son moved to a school with a later start time, and his grades rose a full letter within a semester. The evidence on later start times is settled." Why is that label wrong, and what is actually happening?`, solution: `It is not logos — a single anecdote is pathos placed where evidence belongs, followed by an appeal to unnamed authority (manipulative ethos); genuine logos would require multiple cases, a named source, and a comparison group` },
      relatedLoIds: ['engl.rhetorical-appeals'],
    },
  ],
  pointers: [
    { content: `Pathos is a tool, not a verdict. Emotion is honest when it fits the facts and helps an audience grasp what the evidence means — a true, accurately told story about one family makes a statistic about thousands comprehensible. Judge pathos by whether the feeling is earned by the facts and whether the audience is left free to decide, not by whether feeling is present.`, kind: 'common-error' },
    { content: `Logos names the KIND of appeal, never its quality. A percentage from an unnamed source, a study the speaker paid for, or a number that does not actually bear on the claim is weak logos wearing the costume of proof. Ask what the number measures, where it came from, and whether it supports THIS claim before granting it any weight.`, kind: 'common-error' },
    { content: `Ethos targets trust in the speaker, pathos targets feeling, logos targets reasoning — three different jobs, one argument.`, kind: 'tip' },
    { content: `Identify by TARGET, not topic: ask what this sentence is trying to make me trust, feel, or accept.`, kind: 'tip' },
    { content: `Real arguments layer all three; name the appeal that dominates a given sentence rather than labeling a whole speech.`, kind: 'tip' },
    { content: `No appeal is automatically good or bad — pathos can be honest and logos can be hollow, so evaluate whether the evidence, the credentials, or the emotion actually earns the claim.`, kind: 'tip' },
    { content: `Classify by TARGET, not by content words. A statistic used to shock you is pathos; a personal story used to prove the speaker was there is ethos. Ask "is this sentence after my trust, my feelings, or my reasoning?" before you label.`, kind: 'common-error' },
    { content: `Naming an appeal is NOT judging it. "This is logos" says nothing about whether the evidence is good. Do the two steps separately: classify first, then evaluate whether the number, credential, or emotion actually earns the claim.`, kind: 'gotcha' },
    { content: `Don't treat pathos as a synonym for manipulation. Honest pathos exists: a true, accurately told story that makes a statistic comprehensible. Manipulative pathos manufactures guilt or fear the facts don't support, or replaces evidence entirely.`, kind: 'vocab-note' },
    { content: `A single anecdote placed where evidence belongs is still pathos, even if the writer follows it with the word "evidence." One case can't rule out other causes. Real logos needs multiple cases, a named source, and something to compare against.`, kind: 'edge-case' },
    { content: `"Experts agree," "studies show," and "the evidence is settled" are ethos, not logos — and weak ethos, because there's no source you could check. Borrowed fame or a credential from an unrelated field is the same problem.`, kind: 'gotcha' },
    { content: `Label appeals sentence by sentence, then name which DOMINATES. Writing "this speech is pathos" is too blunt — most arguments open with ethos, rest proof on logos, and close on pathos. Say where each does its work.`, kind: 'tip' },
    { content: `Watch for self-serving evidence: "our testers," "our own twelve-week trial," "in our internal study." That's still logos by category, but the seller ran the study, so flag the weakness rather than accepting the percentage.`, kind: 'edge-case' },
    { content: `Spell the terms right and keep them straight: ethos = ethics/character (trust the speaker), pathos = sympathy/pathetic (feel), logos = logic (reason). Mixing up ethos and pathos when both involve a person's story is the usual slip.`, kind: 'vocab-note' },
  ],
};
