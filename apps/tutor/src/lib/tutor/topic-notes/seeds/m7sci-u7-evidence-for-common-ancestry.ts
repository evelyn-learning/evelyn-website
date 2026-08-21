/**
 * Grade 7 Science — Unit 7 CED 7.2: Evidence for Common Ancestry.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7sci.evidence-for-common-ancestry.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7SCI_U7_EVIDENCE_FOR_COMMON_ANCESTRY: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7sci.evidence-for-common-ancestry.v1',
  course: 'Grade 7 Science',
  cedUnit: 7,
  cedTopic: '7.2',
  cedTitle: 'Evidence for Common Ancestry',
  planId: 'evelyn.ms.m7sci.evidence-for-common-ancestry.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-21',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7sci.evidence-for-common-ancestry.v1' }],
  theory: [
    { loId: 'm7sci.evidence-for-common-ancestry', kind: 'framework', title: 'The main idea', content: `THE MAIN IDEA — a COMMON ANCESTOR is a species that lived long ago and that two living species are both descended from. Nobody watched that ancestor live, so we do not prove it with one photograph. We build the case from several separate kinds of evidence, collected by different scientists working in different ways, that keep agreeing with each other. Three of those lines are body structure, early embryos, and DNA.` },
    { loId: 'm7sci.evidence-for-common-ancestry', kind: 'framework', title: 'Line 1, body structure', content: `LINE 1, BODY STRUCTURE — a HOMOLOGOUS structure is the same set of parts arranged the same way in different species, even when those parts do different jobs. The front limb is the classic case. A human arm, a bat wing, a whale flipper and a cat front leg all run one long bone, then two bones side by side, then a cluster of small wrist bones, then digits. Lifting, flying, swimming and walking are four different jobs built from one inherited layout. If each species had started from scratch, there is no reason a flipper and a wing would be built the same way inside.` },
    { loId: 'm7sci.evidence-for-common-ancestry', kind: 'framework', title: 'Homologous versus analogous', content: `HOMOLOGOUS VERSUS ANALOGOUS — an ANALOGOUS structure does the same JOB but is built from different parts. A bird wing has an arm bone, two forearm bones and hand bones inside it. An insect wing has no bones at all; it is a thin sheet growing out of the hard covering of the body. Both fly. Neither inherited its wing from a shared winged ancestor. So the question to ask is never "do these do the same job", it is "are they built the same way inside". Same build, different job means homologous, and homologous is the evidence of shared ancestry. Same job, different build means analogous, and analogous tells you nothing about being closely related.` },
    { loId: 'm7sci.evidence-for-common-ancestry', kind: 'framework', title: 'Line 2, early embryos', content: `LINE 2, EARLY EMBRYOS — an EMBRYO is an organism in its earliest stage of development, before it is born or hatches. Early embryos of a fish, a chicken and a human look far more alike than the adults ever will. All three have a tail at that stage, and all three have a set of folds in the neck region. That happens because related species inherited a similar set of instructions for building a body, and the instructions start the same way before the differences appear. Careful about how you say it, though: the embryo is NOT replaying its ancestors. That is an old idea, and it is false. All we say is that early embryos of related species look similar.` },
    { loId: 'm7sci.evidence-for-common-ancestry', kind: 'framework', title: 'Line 3, DNA', content: `LINE 3, DNA — DNA is the set of instructions passed from parents to offspring, and it is written in the same chemical alphabet in every living thing we have looked at. Species inherit their DNA from their ancestors, and small changes build up over long stretches of time. So the rule is: the more alike two species are in their DNA, the more recently they shared a common ancestor. More differences means the two lines split apart longer ago. This line of evidence is powerful because it is collected in a laboratory and has nothing to do with what an animal looks like, and yet it keeps producing the same family groupings that bones and embryos produced.` },
    { loId: 'm7sci.evidence-for-common-ancestry', kind: 'framework', title: 'What the evidence does not say', content: `WHAT THE EVIDENCE DOES NOT SAY — evolution is not a ladder and it has no goal. No species is higher, more advanced or more evolved than another. A mushroom, a shark and a person have all been evolving for exactly the same amount of time. And a living species is never the ancestor of another living species. Humans did NOT come from modern apes. WRONG: "Humans descended from chimpanzees." CORRECT: "Humans and chimpanzees share a common ancestor that lived long ago and is no longer alive." The picture to hold is a branching tree, not a line with anything at the top.` },
    { loId: 'm7sci.evidence-for-common-ancestry', kind: 'definition', title: 'common ancestor', content: 'a species from the past that two or more later species are both descended from.' },
    { loId: 'm7sci.evidence-for-common-ancestry', kind: 'definition', title: 'homologous structure', content: `a body part built from the same parts in the same arrangement in different species, even when the jobs differ, because it was inherited from a shared ancestor.` },
    { loId: 'm7sci.evidence-for-common-ancestry', kind: 'definition', title: 'analogous structure', content: `a body part that does the same job in two species but is built from different parts, so it is not evidence of a close shared ancestor.` },
    { loId: 'm7sci.evidence-for-common-ancestry', kind: 'definition', title: 'embryo', content: 'an organism in its earliest stage of development, before it is born or hatches.' },
    { loId: 'm7sci.evidence-for-common-ancestry', kind: 'definition', title: 'DNA', content: `the set of inherited instructions passed from parents to offspring, which becomes more different between two species the longer ago their lines split.` },
  ],
  methods: [
    {
      title: 'Worked sort the wings',
      steps: [
        `Do not start with the job. All three of these fly, and shared job is exactly the trap this lesson is about. Start with what is inside.`,
        `Bat wing and bird wing: one bone, then two side by side, then hand bones. That is the same arrangement, even though one spreads skin and the other spreads feathers. Same build, so this pair is HOMOLOGOUS.`,
        `Bat wing and insect wing: the bat has the bone arrangement, the insect has no bones at all. Same job, completely different build, so this pair is ANALOGOUS.`,
        'Bird wing and insect wing: same reasoning. Bones versus no bones. ANALOGOUS.',
        `Now read what each answer means. Homologous means the bat and the bird inherited that limb layout from a shared ancestor, and each line later remodeled it for its own kind of flight. Analogous means insects and birds did not inherit flight from a shared flying ancestor; they arrived at flying separately, using different body parts.`,
        `One more check on the language. Do not say the insect wing "turned into" a bird wing, and do not say one of these animals is further along than another. Neither of those is what the evidence shows. Insects and birds are separate branches, and both are still here.`,
      ],
      example: { problem: `Three flying structures are described. A bat wing contains one long upper bone, two bones side by side below it, wrist bones, and very long finger bones with skin stretched between them. A bird wing contains one long upper bone, two bones side by side below it, and hand bones, all covered in feathers. An insect wing contains no bones at all; it is a thin sheet growing out of the hard outer covering of the insect body, held open by hollow veins. Which pairs are homologous and which are analogous, and what does each answer tell you about ancestry?`, solution: `The bat wing and the bird wing are homologous, which is evidence they share a common ancestor with that limb layout. The insect wing is analogous to both, since it does the same job with a completely different build, so it is not evidence of a close shared ancestor.` },
      relatedLoIds: ['m7sci.evidence-for-common-ancestry'],
    },
    {
      title: 'Worked two lines agree',
      steps: [
        `Take the embryo evidence on its own first. Early embryos of related species look similar because those species inherited a similar set of body-building instructions. A and B stay similar for a long stretch, so the embryo evidence suggests A and B are more closely related to each other than either is to C.`,
        `Now take the DNA evidence on its own. The rule is that more alike DNA means a more recent common ancestor. The DNA of A and B is more alike, so the DNA evidence also suggests A and B shared an ancestor more recently than either did with C.`,
        `Put them together. Two lines of evidence, gathered in completely different ways, give the same grouping: A and B on one branch, C on a branch that split off earlier.`,
        `Why the second team matters: they never looked at the embryos, so they could not have been influenced by that result. When separate methods that could easily have disagreed end up agreeing, the conclusion is much stronger than either method alone. That agreement is the real backbone of the case for common ancestry.`,
        `Watch the wording of the conclusion. It is NOT that A came from B, and it is NOT that C is behind the other two. All three species are alive now, so none of them is the ancestor of the others, and none of them is more evolved. The ancestor A and B share is a species from the past.`,
      ],
      example: { problem: `A team studies three species, called A, B and C, and none of them is a human. First they compare early embryos. The embryos of A and B look very similar to each other for a long stretch of development, while the embryo of C looks different from both of them almost from the start. Then a second team, working separately and never seeing the embryos, compares the DNA of the three species. They find that the DNA of A and B is more alike than the DNA of either one is to C. What can the two teams conclude together, and why is having two teams important?`, solution: `Both lines of evidence support A and B sharing a more recent common ancestor with each other than either shares with C. Because two teams using different methods reached the same grouping independently, the conclusion is far stronger than it would be from one method alone.` },
      relatedLoIds: ['m7sci.evidence-for-common-ancestry'],
    },
  ],
  pointers: [
    { content: `Students often say "Humans came from modern apes, and evolution has been climbing toward humans." — Very similar DNA means humans and other apes share a COMMON ANCESTOR, not that one came from the other. That ancestor was a species that lived long ago and is no longer alive. Chimpanzees have been changing along their own branch for exactly as long as humans have been changing along ours, so neither is ahead. Evolution has no goal and no top: a shark and a mushroom and a person are all equally evolved. WRONG: "Humans descended from chimpanzees." CORRECT: "Humans and chimpanzees share a common ancestor."`, kind: 'common-error' },
    { content: `Students often say "A human embryo replays the evolutionary history of its ancestors as it develops." — The replay idea is outdated and it is false. An embryo does not pass through a fish, then a reptile, then a mammal. What is true, and all we should claim, is that the EARLY embryos of related species look similar to one another: a fish embryo, a chicken embryo and a human embryo all have a tail and a set of folds in the neck region at that early stage. That similarity is evidence of shared ancestry because those species inherited a similar set of instructions for building a body. Say the safe sentence: early embryos of related species look alike.`, kind: 'common-error' },
    { content: `A common ancestor is a species from the past that two later species are both descended from, and the case for one is built from several kinds of evidence agreeing.`, kind: 'tip' },
    { content: `HOMOLOGOUS = same build, different job. One bone, then two, then wrist bones, then digits shows up in a human arm, a bat wing, a whale flipper and a cat front leg. That is evidence of shared ancestry.`, kind: 'tip' },
    { content: `ANALOGOUS = same job, different build, like a bird wing with bones versus an insect wing with none. Classify by how it is built inside, never by what it does.`, kind: 'tip' },
    { content: `Early embryos of related species look similar, which is a second line of evidence. The embryo does NOT replay evolutionary history; that idea is false.`, kind: 'tip' },
    { content: `The more alike two species are in their DNA, the more recently they shared a common ancestor. More differences means the lines split apart longer ago.`, kind: 'tip' },
    { content: `Humans did not come from modern apes; they share a common ancestor with them. A living species is a cousin, never an ancestor, and no organism is higher or more evolved than another.`, kind: 'tip' },
    { content: `Classify by BUILD, never by JOB. If your first sentence starts "They both fly..." or "They both swim...", you're already off track. Open the structure up first: what bones are inside, and in what order?`, kind: 'common-error' },
    { content: `Homologous = **same build, different job**. Analogous = **same job, different build**. Students flip these constantly. Anchor each word to one picture: homologous → whale flipper and human arm; analogous → bird wing and insect wing.`, kind: 'vocab-note' },
    { content: `Never write "humans came from chimps" or "birds came from insects." A species alive today is a **cousin**, never an ancestor. Say instead: "They share a common ancestor that lived long ago and is no longer alive."`, kind: 'common-error' },
    { content: `The embryo does NOT replay evolution. A human embryo never "goes through a fish stage." The only safe sentence is: **early embryos of related species look similar to each other** — tail and neck folds at that early stage.`, kind: 'gotcha' },
    { content: `Analogous doesn't mean "unrelated." A bird and an insect are both living things with DNA and do share a very distant ancestor. It only means the wings are not evidence of a *close* shared ancestor.`, kind: 'edge-case' },
    { content: `No species is "higher," "more advanced," or "more evolved." A shark, a mushroom and a person have been evolving for exactly the same amount of time. Cut words like *primitive*, *behind*, and *top of the tree* out of your answers.`, kind: 'vocab-note' },
    { content: `With DNA, compare *amounts* of similarity, not just "similar / not similar." More alike DNA = more RECENT common ancestor. More differences = the lines split LONGER ago. Rank the species before you write the conclusion.`, kind: 'tip' },
    { content: `One line of evidence is a hint; agreement between lines is the argument. If bones, embryos and DNA give the same grouping — and different teams found them separately — say so. That independence is the point of the whole lesson.`, kind: 'tip' },
  ],
};
