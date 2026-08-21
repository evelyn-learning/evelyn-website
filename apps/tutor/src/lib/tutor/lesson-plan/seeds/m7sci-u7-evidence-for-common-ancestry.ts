/**
 * Grade 7 Science (Life Science) — Change Over Time: Evidence for Common Ancestry.
 *
 * Concept-led (NGSS MS-LS4-2 and MS-LS4-3). Three lines of evidence that
 * species share ancestors: body structure (homologous structures), early
 * embryos, and DNA. The whole lesson is one argument -- separate kinds of
 * evidence, gathered in different ways, keep pointing at the same family
 * tree.
 *
 * Two errors are load-bearing here and are attacked directly. First, humans
 * did NOT descend from modern apes; humans and apes share a common ancestor,
 * and every living species is a cousin rather than an ancestor. Second,
 * evolution has no goal and no ladder -- no organism is "higher" or "more
 * evolved" than another.
 *
 * NOTE FOR FUTURE AUTHORS: there are no images in this course. The bone
 * arrangement of a forelimb is written out in words (one bone, then two side
 * by side, then a cluster of small bones, then digits) precisely so no item
 * needs a diagram. Also: no DNA-similarity percentages are stated anywhere,
 * because a memorized number is not what a twelve-year-old needs and the
 * figures shift with the method used.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7SCI_U7_EVIDENCE_FOR_COMMON_ANCESTRY: LessonPlan = {
  id: 'evelyn.ms.m7sci.evidence-for-common-ancestry.v1',
  title: 'Evidence for Common Ancestry',
  curriculum: 'MS',
  grade: '7',
  subject: 'science',
  topic: 'grade-7-life-science',
  locale: 'en',
  los: [
    {
      id: 'm7sci.evidence-for-common-ancestry',
      standard: 'M7SCI-7.2',
      description:
        'Use patterns in body structure and in DNA to infer that different species share common ancestors, and compare the early embryos of related species as a further line of evidence (NGSS MS-LS4-2 and NGSS MS-LS4-3).',
    },
  ],
  prerequisites: ['m7sci.fossils-and-the-fossil-record'],
  followUps: ['m7sci.natural-selection'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the shared forelimb plan something the student can feel on their own body before it is named.',
      script:
        'Hold one arm straight out and feel along it with your other hand. Up near your shoulder there is one long bone. Below your elbow there are two bones lying side by side. Then a cluster of small bones at your wrist, and then five fingers. Here is the strange part. A bat wing has that exact same set of bones in that exact same order. So does a whale flipper. So does your cat front leg, and a cat leg does a completely different job from a bat wing. Four animals, four different jobs, one shared layout. Today we ask why that keeps happening, and what it tells us about where species came from.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-lines-of-evidence',
      kind: 'concept',
      goal: 'Lay out the three lines of evidence, separate homologous from analogous, and shut down the ladder story.',
      keyIdeas: [
        'THE MAIN IDEA — a COMMON ANCESTOR is a species that lived long ago and that two living species are both descended from. Nobody watched that ancestor live, so we do not prove it with one photograph. We build the case from several separate kinds of evidence, collected by different scientists working in different ways, that keep agreeing with each other. Three of those lines are body structure, early embryos, and DNA.',
        'LINE 1, BODY STRUCTURE — a HOMOLOGOUS structure is the same set of parts arranged the same way in different species, even when those parts do different jobs. The front limb is the classic case. A human arm, a bat wing, a whale flipper and a cat front leg all run one long bone, then two bones side by side, then a cluster of small wrist bones, then digits. Lifting, flying, swimming and walking are four different jobs built from one inherited layout. If each species had started from scratch, there is no reason a flipper and a wing would be built the same way inside.',
        'HOMOLOGOUS VERSUS ANALOGOUS — an ANALOGOUS structure does the same JOB but is built from different parts. A bird wing has an arm bone, two forearm bones and hand bones inside it. An insect wing has no bones at all; it is a thin sheet growing out of the hard covering of the body. Both fly. Neither inherited its wing from a shared winged ancestor. So the question to ask is never "do these do the same job", it is "are they built the same way inside". Same build, different job means homologous, and homologous is the evidence of shared ancestry. Same job, different build means analogous, and analogous tells you nothing about being closely related.',
        'LINE 2, EARLY EMBRYOS — an EMBRYO is an organism in its earliest stage of development, before it is born or hatches. Early embryos of a fish, a chicken and a human look far more alike than the adults ever will. All three have a tail at that stage, and all three have a set of folds in the neck region. That happens because related species inherited a similar set of instructions for building a body, and the instructions start the same way before the differences appear. Careful about how you say it, though: the embryo is NOT replaying its ancestors. That is an old idea, and it is false. All we say is that early embryos of related species look similar.',
        'LINE 3, DNA — DNA is the set of instructions passed from parents to offspring, and it is written in the same chemical alphabet in every living thing we have looked at. Species inherit their DNA from their ancestors, and small changes build up over long stretches of time. So the rule is: the more alike two species are in their DNA, the more recently they shared a common ancestor. More differences means the two lines split apart longer ago. This line of evidence is powerful because it is collected in a laboratory and has nothing to do with what an animal looks like, and yet it keeps producing the same family groupings that bones and embryos produced.',
        'WHAT THE EVIDENCE DOES NOT SAY — evolution is not a ladder and it has no goal. No species is higher, more advanced or more evolved than another. A mushroom, a shark and a person have all been evolving for exactly the same amount of time. And a living species is never the ancestor of another living species. Humans did NOT come from modern apes. WRONG: "Humans descended from chimpanzees." CORRECT: "Humans and chimpanzees share a common ancestor that lived long ago and is no longer alive." The picture to hold is a branching tree, not a line with anything at the top.',
      ],
      vocabulary: [
        { term: 'common ancestor', definition: 'a species from the past that two or more later species are both descended from.' },
        { term: 'homologous structure', definition: 'a body part built from the same parts in the same arrangement in different species, even when the jobs differ, because it was inherited from a shared ancestor.' },
        { term: 'analogous structure', definition: 'a body part that does the same job in two species but is built from different parts, so it is not evidence of a close shared ancestor.' },
        { term: 'embryo', definition: 'an organism in its earliest stage of development, before it is born or hatches.' },
        { term: 'DNA', definition: 'the set of inherited instructions passed from parents to offspring, which becomes more different between two species the longer ago their lines split.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-sort-the-wings',
      kind: 'worked_example',
      problem:
        'Three flying structures are described. A bat wing contains one long upper bone, two bones side by side below it, wrist bones, and very long finger bones with skin stretched between them. A bird wing contains one long upper bone, two bones side by side below it, and hand bones, all covered in feathers. An insect wing contains no bones at all; it is a thin sheet growing out of the hard outer covering of the insect body, held open by hollow veins. Which pairs are homologous and which are analogous, and what does each answer tell you about ancestry?',
      steps: [
        'Do not start with the job. All three of these fly, and shared job is exactly the trap this lesson is about. Start with what is inside.',
        'Bat wing and bird wing: one bone, then two side by side, then hand bones. That is the same arrangement, even though one spreads skin and the other spreads feathers. Same build, so this pair is HOMOLOGOUS.',
        'Bat wing and insect wing: the bat has the bone arrangement, the insect has no bones at all. Same job, completely different build, so this pair is ANALOGOUS.',
        'Bird wing and insect wing: same reasoning. Bones versus no bones. ANALOGOUS.',
        'Now read what each answer means. Homologous means the bat and the bird inherited that limb layout from a shared ancestor, and each line later remodeled it for its own kind of flight. Analogous means insects and birds did not inherit flight from a shared flying ancestor; they arrived at flying separately, using different body parts.',
        'One more check on the language. Do not say the insect wing "turned into" a bird wing, and do not say one of these animals is further along than another. Neither of those is what the evidence shows. Insects and birds are separate branches, and both are still here.',
      ],
      answer:
        'The bat wing and the bird wing are homologous, which is evidence they share a common ancestor with that limb layout. The insect wing is analogous to both, since it does the same job with a completely different build, so it is not evidence of a close shared ancestor.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-two-lines-agree',
      kind: 'worked_example',
      problem:
        'A team studies three species, called A, B and C, and none of them is a human. First they compare early embryos. The embryos of A and B look very similar to each other for a long stretch of development, while the embryo of C looks different from both of them almost from the start. Then a second team, working separately and never seeing the embryos, compares the DNA of the three species. They find that the DNA of A and B is more alike than the DNA of either one is to C. What can the two teams conclude together, and why is having two teams important?',
      steps: [
        'Take the embryo evidence on its own first. Early embryos of related species look similar because those species inherited a similar set of body-building instructions. A and B stay similar for a long stretch, so the embryo evidence suggests A and B are more closely related to each other than either is to C.',
        'Now take the DNA evidence on its own. The rule is that more alike DNA means a more recent common ancestor. The DNA of A and B is more alike, so the DNA evidence also suggests A and B shared an ancestor more recently than either did with C.',
        'Put them together. Two lines of evidence, gathered in completely different ways, give the same grouping: A and B on one branch, C on a branch that split off earlier.',
        'Why the second team matters: they never looked at the embryos, so they could not have been influenced by that result. When separate methods that could easily have disagreed end up agreeing, the conclusion is much stronger than either method alone. That agreement is the real backbone of the case for common ancestry.',
        'Watch the wording of the conclusion. It is NOT that A came from B, and it is NOT that C is behind the other two. All three species are alive now, so none of them is the ancestor of the others, and none of them is more evolved. The ancestor A and B share is a species from the past.',
      ],
      answer:
        'Both lines of evidence support A and B sharing a more recent common ancestor with each other than either shares with C. Because two teams using different methods reached the same grouping independently, the conclusion is far stronger than it would be from one method alone.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-homologous-limbs',
      kind: 'try_yourself',
      problem:
        'A human arm, a bat wing, a whale flipper and a cat front leg each contain one long upper bone, then two bones side by side, then a cluster of small wrist bones, then digits. The four limbs are used for very different jobs. Which statement explains why scientists treat this as evidence of a common ancestor?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The same bone arrangement shows up in all four, even though the limbs do different jobs, which fits the four species inheriting that arrangement from one earlier species.', correct: true },
        { id: 'b', text: 'All four animals use their front limbs to move around, and doing the same job is what shows shared ancestry.' },
        { id: 'c', text: 'The four limbs are all about the same size and shape on the outside.' },
        { id: 'd', text: 'Each animal grew the limb it needed for the place where it lives, so the limbs match its habitat.' },
      ],
      expectedAnswer: 'The same bone arrangement shows up in all four, even though the limbs do different jobs, which fits the four species inheriting that arrangement from one earlier species.',
      hints: [
        'The evidence is not what the limbs DO. Ask what is the same about how they are built inside, and whether different jobs make that sameness more surprising or less.',
        'One choice says an animal grows a body part because it needs one. Body parts are inherited, not ordered up when they would be handy.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-analogous-wings',
      kind: 'try_yourself',
      problem:
        'A bird wing contains an upper arm bone, two forearm bones and hand bones. An insect wing contains no bones; it is a thin sheet growing out of the hard outer covering of the body. Both are used for flying. How should this pair be classified, and what does it tell us?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Homologous, because both are wings and both are used for flying.' },
        { id: 'b', text: 'Analogous, because they do the same job but are built from different parts, so they are not evidence of a close shared ancestor.', correct: true },
        { id: 'c', text: 'Homologous, because both wings spread out sideways from the body in a similar shape.' },
        { id: 'd', text: 'They show that birds and insects are closely related, because two animals that look alike must be close relatives.' },
      ],
      expectedAnswer: 'Analogous, because they do the same job but are built from different parts, so they are not evidence of a close shared ancestor.',
      hints: [
        'Classify by what is inside, never by what the structure does. One of these wings has limb bones in it and the other has no bones at all.',
        'Two of these choices are really the same mistake in different words: treating looking alike or working alike as proof of being closely related.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-dna-conclusion',
      kind: 'try_yourself',
      problem:
        'Scientists compare the same gene in three living species with the human version of that gene. The version in Species A is the most similar to the human version. The version in Species B is less similar. The version in Species C is the least similar of the three. Which conclusion does this evidence best support?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Humans are descended from Species A, because its version of the gene is the closest match.' },
        { id: 'b', text: 'Humans share a more recent common ancestor with Species A than with Species B or Species C.', correct: true },
        { id: 'c', text: 'Species C is not related to humans at all, because its version of the gene is the least similar.' },
        { id: 'd', text: 'Species C is the most evolved of the three, because its DNA has changed the most since the split.' },
      ],
      expectedAnswer: 'Humans share a more recent common ancestor with Species A than with Species B or Species C.',
      hints: [
        'Differences in DNA build up after two lines split apart. So what does a very close match say about how long ago that split happened?',
        'All three species in this comparison are alive today, and so are humans. A living species is a cousin, never an ancestor. Also, there is no such thing as being more evolved.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-ladder-and-replay',
      kind: 'misconception_check',
      question:
        'A student writes: "Human DNA is a lot like ape DNA, so humans came from apes, and a human embryo goes through a fish stage while it replays how we evolved." Two separate things went wrong in that sentence. What are they?',
      commonErrors: [
        {
          answer: 'Humans came from modern apes, and evolution has been climbing toward humans.',
          misconception:
            'Reading a family tree as a ladder, so that a living relative gets treated as an ancestor and humans get placed at the top of a climb.',
          correctsTo:
            'Very similar DNA means humans and other apes share a COMMON ANCESTOR, not that one came from the other. That ancestor was a species that lived long ago and is no longer alive. Chimpanzees have been changing along their own branch for exactly as long as humans have been changing along ours, so neither is ahead. Evolution has no goal and no top: a shark and a mushroom and a person are all equally evolved. WRONG: "Humans descended from chimpanzees." CORRECT: "Humans and chimpanzees share a common ancestor."',
        },
        {
          answer: 'A human embryo replays the evolutionary history of its ancestors as it develops.',
          misconception:
            'Stretching a real observation, that early embryos of related species look similar, into an old and false story in which the embryo acts out a sequence of ancestor forms.',
          correctsTo:
            'The replay idea is outdated and it is false. An embryo does not pass through a fish, then a reptile, then a mammal. What is true, and all we should claim, is that the EARLY embryos of related species look similar to one another: a fish embryo, a chicken embryo and a human embryo all have a tail and a set of folds in the neck region at that early stage. That similarity is evidence of shared ancestry because those species inherited a similar set of instructions for building a body. Say the safe sentence: early embryos of related species look alike.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A common ancestor is a species from the past that two later species are both descended from, and the case for one is built from several kinds of evidence agreeing.',
        'HOMOLOGOUS = same build, different job. One bone, then two, then wrist bones, then digits shows up in a human arm, a bat wing, a whale flipper and a cat front leg. That is evidence of shared ancestry.',
        'ANALOGOUS = same job, different build, like a bird wing with bones versus an insect wing with none. Classify by how it is built inside, never by what it does.',
        'Early embryos of related species look similar, which is a second line of evidence. The embryo does NOT replay evolutionary history; that idea is false.',
        'The more alike two species are in their DNA, the more recently they shared a common ancestor. More differences means the lines split apart longer ago.',
        'Humans did not come from modern apes; they share a common ancestor with them. A living species is a cousin, never an ancestor, and no organism is higher or more evolved than another.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.2', cedTitle: 'Evidence for Common Ancestry' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
