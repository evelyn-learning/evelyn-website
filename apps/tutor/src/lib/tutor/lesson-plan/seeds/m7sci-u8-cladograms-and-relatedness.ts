/**
 * Grade 7 Science (Life Science) — Classification: Cladograms & Relatedness.
 *
 * Procedure-led (NGSS MS-LS4-2). One rule runs the whole lesson: two species
 * are more closely related when their branch point is MORE RECENT, meaning
 * closer to the tips. Trace back from each species until the paths meet.
 *
 * The traps this plan is built to kill are (a) judging relatedness by which
 * species sit side by side, (b) reading left-to-right position as a ranking
 * from primitive to advanced, and (c) treating a species at a tip as the
 * ancestor of another species at a tip.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every
 * cladogram in this file is written out in words -- first branch, next
 * branch, most recent branch -- and every item is solvable from the text
 * printed inside it. Never write "look at the diagram above".
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7SCI_U8_CLADOGRAMS_AND_RELATEDNESS: LessonPlan = {
  id: 'evelyn.ms.m7sci.cladograms-and-relatedness.v1',
  title: 'Cladograms & How Closely Related',
  curriculum: 'MS',
  grade: '7',
  subject: 'science',
  topic: 'grade-7-life-science',
  locale: 'en',
  los: [
    {
      id: 'm7sci.cladograms-and-relatedness',
      standard: 'M7SCI-8.4',
      description:
        'Read a cladogram to decide which species are most closely related, using the rule that a more recent common ancestor means a closer relationship, and explain why the order the tips happen to be drawn or listed in says nothing about age, rank or relatedness (NGSS MS-LS4-2).',
    },
  ],
  prerequisites: ['m7sci.using-dichotomous-keys'],
  followUps: ['m7sci.ecosystem-organization'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Anchor relatedness in family cousins, where the student already knows that a more recent shared ancestor means a closer relative.',
      script:
        'Think about your own family for a second. You and your first cousin share a grandparent. You and your second cousin have to go back further, all the way to a great-grandparent, before you reach a person you both come from. That is the whole reason a first cousin counts as a closer relative: the person you both come from is more recent. Scientists use exactly this trick for whole species. They draw a branching diagram called a cladogram, and it answers one question -- how recently did these two branches split apart. The catch is that the drawing is full of traps, and almost every one of them comes from reading the shape of the picture instead of the branch points. Today you learn the single move that never fails.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-reading-cladograms',
      kind: 'concept',
      goal: 'Install the tips-and-branch-points model, the most-recent-common-ancestor rule, and the four traps that come from reading the picture.',
      keyIdeas: [
        'WHAT A CLADOGRAM IS -- a branching diagram that shows how species are related by ancestry. The ends of the branches are called the TIPS, and they are the species being compared. All of them are alive today unless the question says otherwise. Every place where a line splits in two is a BRANCH POINT, and a branch point stands for a common ancestor: an ancestral population that split into two groups which stopped mixing.',
        'THE ONE RULE THAT ANSWERS EVERY QUESTION -- two species are more closely related when they share a MORE RECENT common ancestor, which means their branch point sits closer to the tips. To use it, trace backward from each species until the two paths meet. The pair whose paths meet at the branch point nearest the tips is the more closely related pair. Nothing else on the diagram outranks this.',
        'SHARED TRAITS MARK THE BRANCH POINTS -- when a new trait appears in one lineage, every group that comes after that point inherits it. So a trait shared by several species is evidence that they all come from the ancestor where the trait first appeared. That shared evidence is how scientists decide where to put each branch point in the first place.',
        'TRAP ONE, THE PICTURE LIES ABOUT NEIGHBORS -- a cladogram can be rotated at any branch point, like a mobile hanging from the ceiling, and it still says exactly the same thing. Spin one branch point and two species that were side by side end up far apart. WRONG: "These two are drawn next to each other, so they are the closest relatives." CORRECT: "Trace back to the branch point, then compare." Being neighbors on the page is not evidence of anything.',
        'TRAP TWO, THERE IS NO RANKING AND NO DIRECTION -- a species drawn on the left is not older, simpler or more primitive, and a species drawn on the right is not more advanced. Evolution has no goal and no ladder. Every tip is a species living right now, and every lineage on the diagram has been evolving for the same length of time since any ancestor they share. A species at a tip also did not descend from another species at a tip. The tips are cousins, never parents.',
        'TRAP THREE, A CLADOGRAM IS NOT A CALENDAR -- it tells you the ORDER of the splits, not the years. It cannot tell you that one split happened forty thousand years ago and another happened a million years ago. And having more branch points below a species does not make that species better, more complex or more advanced. It only means more splits happened along that path.',
      ],
      vocabulary: [
        { term: 'cladogram', definition: 'a branching diagram showing how closely species are related by ancestry.' },
        { term: 'tip', definition: 'the end of a branch, standing for one of the species being compared.' },
        { term: 'branch point', definition: 'a place where one line splits into two, standing for a common ancestor.' },
        {
          term: 'common ancestor',
          definition: 'an ancestral population that two or more later species both come from.',
        },
        {
          term: 'most recent common ancestor',
          definition: 'the newest branch point that two species share; the closer it is to the tips, the closer the two species are related.',
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-trace-back',
      kind: 'worked_example',
      problem:
        'A cladogram compares four animals: a goldfish, a frog, a mouse and a lizard. The first branch separates the goldfish from the other three. Next, the frog splits off from the group containing the mouse and the lizard. Most recently, the mouse and the lizard separate from each other. Which two animals are most closely related, and is the frog more closely related to the mouse or to the lizard?',
      steps: [
        'Rebuild the branch points from the words. Branch point 1, the oldest, separates the goldfish from everything else. Branch point 2 separates the frog from a group that keeps going. Branch point 3, the most recent one, splits that group into the mouse and the lizard.',
        'For the first question, look for the branch point closest to the tips. That is branch point 3, and the two animals that separate there are the mouse and the lizard. So the mouse and the lizard are the most closely related pair.',
        'For the second question, trace backward from the frog and from the mouse. The two paths first meet at branch point 2.',
        'Now trace backward from the frog and from the lizard. Those paths also first meet at branch point 2, because branch point 2 produced the frog on one side and the whole mouse-and-lizard group on the other side.',
        'Both traces land on the very same common ancestor. So the frog is equally related to the mouse and to the lizard. Neither one is closer.',
        'That result surprises people, and it is worth saying out loud: the mouse and the lizard split from each other AFTER their shared line had already split from the frog, so the frog cannot be closer to one of them than to the other.',
      ],
      answer:
        'The mouse and the lizard are most closely related, because their branch point is the most recent one. The frog is equally related to the mouse and to the lizard, because it meets both of them at the same older branch point.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-picture-traps',
      kind: 'worked_example',
      problem:
        'A cladogram of four plants is drawn with the tips printed across the page in this order from left to right: pine tree, rose bush, fern, moss. The first branch separates the moss from the other three. Next, the fern splits off from the group containing the pine tree and the rose bush. Most recently, the pine tree and the rose bush separate from each other. A student says: "The moss is drawn on the far right, so the moss is the most advanced plant. Also, the fern is printed right beside the rose bush, so those two must be the closest relatives." Explain what is wrong with both claims and give the correct answer.',
      steps: [
        'Ignore the printing order and rebuild the branch points first. Branch point 1, the oldest, separates the moss from the other three. Branch point 2 separates the fern from the group holding the pine tree and the rose bush. Branch point 3, the most recent, splits the pine tree from the rose bush.',
        'Take the first claim. Left and right carry no meaning at all. The whole diagram could be flipped so the tips read moss, fern, rose bush, pine tree, and not one relationship would change. A branch point can also be spun around like a mobile hanging from the ceiling.',
        'There is a deeper problem with that claim too. Cladograms do not rank species. The moss is not more advanced and it is not more primitive. It is a plant living today, and the moss line has been evolving for exactly as long as the rose line has.',
        'Now take the second claim. The fern is indeed printed beside the rose bush, but that is a fact about the paper, not about ancestry. Trace backward from the fern and the rose bush: the paths meet at branch point 2.',
        'Trace backward from the fern and the pine tree as well: those paths also meet at branch point 2, the same one. So the fern is equally related to the rose bush and to the pine tree.',
        'Finally, find the closest pair the correct way, by looking for the branch point nearest the tips. That is branch point 3, which separates the pine tree from the rose bush. Those two are the closest relatives on this diagram, even though the student never considered them.',
      ],
      answer:
        'Both claims read the drawing instead of the branch points. Left-to-right position is not a ranking and the diagram can be flipped or rotated freely, so the moss is neither advanced nor primitive. Printed neighbors are not automatically relatives: the pine tree and the rose bush are the closest pair, because their branch point is the most recent one, and the fern is equally related to both of them.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-equally-related',
      kind: 'try_yourself',
      problem:
        'A cladogram compares four frog species. The first branch separates Species W from the other three. Next, Species X splits off from the group containing Species Y and Species Z. Most recently, Species Y and Species Z separate from each other. Is Species X more closely related to Species Y, or to Species Z?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Species X is equally related to both, because it meets Species Y and Species Z at the same branch point',
          correct: true,
        },
        { id: 'b', text: 'Species Y, because Species Y is named before Species Z' },
        { id: 'c', text: 'Species Z, because Species Z is named last and so is the most advanced' },
        { id: 'd', text: 'Neither one, because Species X is the ancestor that Species Y and Species Z came from' },
      ],
      expectedAnswer:
        'Species X is equally related to both, because it meets Species Y and Species Z at the same branch point',
      hints: [
        'Trace backward from Species X until you meet Species Y, and write down which branch point you land on. Then do the same for Species X and Species Z.',
        'Species X split away from a group that still held Species Y and Species Z together. So one single branch point connects Species X to both of them.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-tip-proximity-trap',
      kind: 'try_yourself',
      problem:
        'A scientist draws a cladogram of four snail species. The species are listed here in alphabetical order: Species F, Species G, Species H and Species J. The first branch separates Species H from the other three. Next, Species F splits off from the group containing Species G and Species J. Most recently, Species G and Species J separate from each other. Which two species are most closely related?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Species G and Species H, because they are listed right next to each other' },
        { id: 'b', text: 'Species G and Species J, because their branch point is the most recent one', correct: true },
        { id: 'c', text: 'Species H and Species F, because they are the two that branched off earliest' },
        { id: 'd', text: 'Species F and Species G, because Species F is older and Species G descended from it' },
      ],
      expectedAnswer: 'Species G and Species J, because their branch point is the most recent one',
      hints: [
        'The species are listed in alphabetical order. Alphabetical order says nothing about ancestry, so put the list aside and use only the sentences about the branches.',
        'Find the branch point that happened most recently. The two species that separate from each other at that branch point are the closest relatives.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-what-it-shows',
      kind: 'try_yourself',
      problem:
        'A cladogram compares four beetle species, all of them alive today. The first branch separates Species P from the other three. Next, Species Q splits off from the group containing Species R and Species S. Most recently, Species R and Species S separate from each other. Which statement about this cladogram is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Species P is the ancestor of the other three species, because it branches off first' },
        { id: 'b', text: 'Species S is the most advanced species, because it is the last one to appear on the diagram' },
        {
          id: 'c',
          text: 'Species Q is more closely related to Species R than Species P is, because Species Q joins that line at a more recent branch point',
          correct: true,
        },
        { id: 'd', text: 'The diagram shows exactly how many years ago each split happened' },
      ],
      expectedAnswer:
        'Species Q is more closely related to Species R than Species P is, because Species Q joins that line at a more recent branch point',
      hints: [
        'All four beetles are alive today, so none of them is the ancestor of another and none of them is ranked above another. Cross out any choice that ranks them or makes one a parent.',
        'For the choices that are left, trace backward from Species R twice: once to meet Species Q, and once to meet Species P. Which of those two branch points is nearer the tips?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-read-the-picture',
      kind: 'misconception_check',
      question:
        'A cladogram of four bird species is drawn with the tips printed across the page from left to right in this order: Species A, Species B, Species C, Species D. The first branch separates Species A from the other three. Next, Species B splits off from the group containing Species C and Species D. Most recently, Species C and Species D separate from each other. A student says: "Species A is on the far left, so it is the oldest and most primitive. And Species B is drawn right beside Species C, so those two must be the closest relatives." What went wrong?',
      commonErrors: [
        {
          answer: 'Species A is on the far left, so it is the oldest and most primitive species.',
          misconception:
            'Reading left-to-right position as a ranking, or as a timeline running across the page from ancient to modern.',
          correctsTo:
            'A cladogram has no direction and no ranking. Species A is a bird alive today, exactly like the other three, and its line has been evolving for exactly as long as theirs. Branching off at the first branch point only means its line separated earliest -- it does not mean primitive, simple or unchanged. The proof is that the whole diagram can be flipped so the tips read Species D, Species C, Species B, Species A, and every relationship stays identical.',
        },
        {
          answer: 'Species B and Species C are drawn side by side, so they are the closest relatives.',
          misconception:
            'Judging relatedness by how close two tips sit on the page instead of by which branch point they trace back to.',
          correctsTo:
            'Trace backward instead. Species B meets Species C at the second branch point, and Species B meets Species D at that very same branch point, so Species B is equally related to both. Species C and Species D meet at the most recent branch point, which makes THEM the closest pair. Rotate that branch point and the tips print as Species A, Species B, Species D, Species C, with the ancestry completely unchanged -- which shows the side-by-side clue was never carrying any information.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A cladogram shows ancestry. The tips are the species compared, and every branch point stands for a common ancestor.',
        'THE RULE: two species are more closely related when their common ancestor is more recent, meaning their branch point sits closer to the tips.',
        'To use the rule, trace backward from each species until the two paths meet, then compare which meeting point is nearer the tips.',
        'Species drawn or listed next to each other are not automatically relatives. Any branch point can be rotated without changing the meaning.',
        'There is no ranking and no direction. Nothing on the left is primitive and nothing on the right is advanced, and more branch points does not mean more advanced.',
        'All the tips are living species, so a species at a tip never descended from another species at a tip. They are cousins, not parents.',
        'A cladogram gives the ORDER of the splits, never the exact number of years.',
        'Shared traits are the evidence used to place the branch points, because a new trait is passed on to every group that comes after it.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.4', cedTitle: 'Cladograms & How Closely Related' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
