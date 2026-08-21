/**
 * Grade 7 Science — Unit 8 CED 8.4: Cladograms & How Closely Related.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7sci.cladograms-and-relatedness.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7SCI_U8_CLADOGRAMS_AND_RELATEDNESS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7sci.cladograms-and-relatedness.v1',
  course: 'Grade 7 Science',
  cedUnit: 8,
  cedTopic: '8.4',
  cedTitle: 'Cladograms & How Closely Related',
  planId: 'evelyn.ms.m7sci.cladograms-and-relatedness.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-21',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7sci.cladograms-and-relatedness.v1' }],
  theory: [
    { loId: 'm7sci.cladograms-and-relatedness', content: `WHAT A CLADOGRAM IS -- a branching diagram that shows how species are related by ancestry. The ends of the branches are called the TIPS, and they are the species being compared. All of them are alive today unless the question says otherwise. Every place where a line splits in two is a BRANCH POINT, and a branch point stands for a common ancestor: an ancestral population that split into two groups which stopped mixing.` },
    { loId: 'm7sci.cladograms-and-relatedness', content: `THE ONE RULE THAT ANSWERS EVERY QUESTION -- two species are more closely related when they share a MORE RECENT common ancestor, which means their branch point sits closer to the tips. To use it, trace backward from each species until the two paths meet. The pair whose paths meet at the branch point nearest the tips is the more closely related pair. Nothing else on the diagram outranks this.` },
    { loId: 'm7sci.cladograms-and-relatedness', content: `SHARED TRAITS MARK THE BRANCH POINTS -- when a new trait appears in one lineage, every group that comes after that point inherits it. So a trait shared by several species is evidence that they all come from the ancestor where the trait first appeared. That shared evidence is how scientists decide where to put each branch point in the first place.` },
    { loId: 'm7sci.cladograms-and-relatedness', content: `TRAP ONE, THE PICTURE LIES ABOUT NEIGHBORS -- a cladogram can be rotated at any branch point, like a mobile hanging from the ceiling, and it still says exactly the same thing. Spin one branch point and two species that were side by side end up far apart. WRONG: "These two are drawn next to each other, so they are the closest relatives." CORRECT: "Trace back to the branch point, then compare." Being neighbors on the page is not evidence of anything.` },
    { loId: 'm7sci.cladograms-and-relatedness', content: `TRAP TWO, THERE IS NO RANKING AND NO DIRECTION -- a species drawn on the left is not older, simpler or more primitive, and a species drawn on the right is not more advanced. Evolution has no goal and no ladder. Every tip is a species living right now, and every lineage on the diagram has been evolving for the same length of time since any ancestor they share. A species at a tip also did not descend from another species at a tip. The tips are cousins, never parents.` },
    { loId: 'm7sci.cladograms-and-relatedness', content: `TRAP THREE, A CLADOGRAM IS NOT A CALENDAR -- it tells you the ORDER of the splits, not the years. It cannot tell you that one split happened forty thousand years ago and another happened a million years ago. And having more branch points below a species does not make that species better, more complex or more advanced. It only means more splits happened along that path.` },
    { loId: 'm7sci.cladograms-and-relatedness', kind: 'definition', title: 'cladogram', content: 'a branching diagram showing how closely species are related by ancestry.' },
    { loId: 'm7sci.cladograms-and-relatedness', kind: 'definition', title: 'tip', content: 'the end of a branch, standing for one of the species being compared.' },
    { loId: 'm7sci.cladograms-and-relatedness', kind: 'definition', title: 'branch point', content: 'a place where one line splits into two, standing for a common ancestor.' },
    { loId: 'm7sci.cladograms-and-relatedness', kind: 'definition', title: 'common ancestor', content: 'an ancestral population that two or more later species both come from.' },
    { loId: 'm7sci.cladograms-and-relatedness', kind: 'definition', title: 'most recent common ancestor', content: `the newest branch point that two species share; the closer it is to the tips, the closer the two species are related.` },
  ],
  methods: [
    {
      title: 'Worked trace back',
      steps: [
        `Rebuild the branch points from the words. Branch point 1, the oldest, separates the goldfish from everything else. Branch point 2 separates the frog from a group that keeps going. Branch point 3, the most recent one, splits that group into the mouse and the lizard.`,
        `For the first question, look for the branch point closest to the tips. That is branch point 3, and the two animals that separate there are the mouse and the lizard. So the mouse and the lizard are the most closely related pair.`,
        `For the second question, trace backward from the frog and from the mouse. The two paths first meet at branch point 2.`,
        `Now trace backward from the frog and from the lizard. Those paths also first meet at branch point 2, because branch point 2 produced the frog on one side and the whole mouse-and-lizard group on the other side.`,
        `Both traces land on the very same common ancestor. So the frog is equally related to the mouse and to the lizard. Neither one is closer.`,
        `That result surprises people, and it is worth saying out loud: the mouse and the lizard split from each other AFTER their shared line had already split from the frog, so the frog cannot be closer to one of them than to the other.`,
      ],
      example: { problem: `A cladogram compares four animals: a goldfish, a frog, a mouse and a lizard. The first branch separates the goldfish from the other three. Next, the frog splits off from the group containing the mouse and the lizard. Most recently, the mouse and the lizard separate from each other. Which two animals are most closely related, and is the frog more closely related to the mouse or to the lizard?`, solution: `The mouse and the lizard are most closely related, because their branch point is the most recent one. The frog is equally related to the mouse and to the lizard, because it meets both of them at the same older branch point.` },
      relatedLoIds: ['m7sci.cladograms-and-relatedness'],
    },
    {
      title: 'Worked picture traps',
      steps: [
        `Ignore the printing order and rebuild the branch points first. Branch point 1, the oldest, separates the moss from the other three. Branch point 2 separates the fern from the group holding the pine tree and the rose bush. Branch point 3, the most recent, splits the pine tree from the rose bush.`,
        `Take the first claim. Left and right carry no meaning at all. The whole diagram could be flipped so the tips read moss, fern, rose bush, pine tree, and not one relationship would change. A branch point can also be spun around like a mobile hanging from the ceiling.`,
        `There is a deeper problem with that claim too. Cladograms do not rank species. The moss is not more advanced and it is not more primitive. It is a plant living today, and the moss line has been evolving for exactly as long as the rose line has.`,
        `Now take the second claim. The fern is indeed printed beside the rose bush, but that is a fact about the paper, not about ancestry. Trace backward from the fern and the rose bush: the paths meet at branch point 2.`,
        `Trace backward from the fern and the pine tree as well: those paths also meet at branch point 2, the same one. So the fern is equally related to the rose bush and to the pine tree.`,
        `Finally, find the closest pair the correct way, by looking for the branch point nearest the tips. That is branch point 3, which separates the pine tree from the rose bush. Those two are the closest relatives on this diagram, even though the student never considered them.`,
      ],
      example: { problem: `A cladogram of four plants is drawn with the tips printed across the page in this order from left to right: pine tree, rose bush, fern, moss. The first branch separates the moss from the other three. Next, the fern splits off from the group containing the pine tree and the rose bush. Most recently, the pine tree and the rose bush separate from each other. A student says: "The moss is drawn on the far right, so the moss is the most advanced plant. Also, the fern is printed right beside the rose bush, so those two must be the closest relatives." Explain what is wrong with both claims and give the correct answer.`, solution: `Both claims read the drawing instead of the branch points. Left-to-right position is not a ranking and the diagram can be flipped or rotated freely, so the moss is neither advanced nor primitive. Printed neighbors are not automatically relatives: the pine tree and the rose bush are the closest pair, because their branch point is the most recent one, and the fern is equally related to both of them.` },
      relatedLoIds: ['m7sci.cladograms-and-relatedness'],
    },
  ],
  pointers: [
    { content: `Students often say "Species A is on the far left, so it is the oldest and most primitive species." — A cladogram has no direction and no ranking. Species A is a bird alive today, exactly like the other three, and its line has been evolving for exactly as long as theirs. Branching off at the first branch point only means its line separated earliest -- it does not mean primitive, simple or unchanged. The proof is that the whole diagram can be flipped so the tips read Species D, Species C, Species B, Species A, and every relationship stays identical.`, kind: 'common-error' },
    { content: `Students often say "Species B and Species C are drawn side by side, so they are the closest relatives." — Trace backward instead. Species B meets Species C at the second branch point, and Species B meets Species D at that very same branch point, so Species B is equally related to both. Species C and Species D meet at the most recent branch point, which makes THEM the closest pair. Rotate that branch point and the tips print as Species A, Species B, Species D, Species C, with the ancestry completely unchanged -- which shows the side-by-side clue was never carrying any information.`, kind: 'common-error' },
    { content: `A cladogram shows ancestry. The tips are the species compared, and every branch point stands for a common ancestor.`, kind: 'tip' },
    { content: `THE RULE: two species are more closely related when their common ancestor is more recent, meaning their branch point sits closer to the tips.`, kind: 'tip' },
    { content: `To use the rule, trace backward from each species until the two paths meet, then compare which meeting point is nearer the tips.`, kind: 'tip' },
    { content: `Species drawn or listed next to each other are not automatically relatives. Any branch point can be rotated without changing the meaning.`, kind: 'tip' },
    { content: `There is no ranking and no direction. Nothing on the left is primitive and nothing on the right is advanced, and more branch points does not mean more advanced.`, kind: 'tip' },
    { content: `All the tips are living species, so a species at a tip never descended from another species at a tip. They are cousins, not parents.`, kind: 'tip' },
    { content: 'A cladogram gives the ORDER of the splits, never the exact number of years.', kind: 'tip' },
    { content: `Shared traits are the evidence used to place the branch points, because a new trait is passed on to every group that comes after it.`, kind: 'tip' },
    { content: `Never answer "which two are closest?" by looking at which tips are printed side by side. Trace back to the branch point every single time. Any branch point can be spun around like a mobile, so neighbors on the page prove nothing.`, kind: 'common-error' },
    { content: `"Branched off first" does NOT mean "oldest" or "most primitive." That species is alive today and its line has been evolving exactly as long as every other line on the diagram. Say "its line split earliest," not "it's the ancestor."`, kind: 'vocab-note' },
    { content: `Watch for the equally-related case. If two species split from each other AFTER their shared line left a third species, that third species is equally related to both. "Equally related" is a real answer — don't force yourself to pick one.`, kind: 'edge-case' },
    { content: `A tip is never the parent of another tip. All the tips are living cousins. Don't write "the fish evolved into the frog" — write "the fish and the frog share a common ancestor at that branch point."`, kind: 'common-error' },
    { content: `A cladogram gives the ORDER of splits, not years. You cannot say a split happened "a long time before" another one in numbers — only that it happened earlier. Line lengths on the page are not time.`, kind: 'gotcha' },
    { content: `More branch points along a path does not mean "more advanced" or "more complex." It only means that line split more times. Counting branch points is not a ranking.`, kind: 'gotcha' },
    { content: `When a problem is written in words instead of drawn, sketch the branch points before answering. Write branch point 1 (oldest) first, then 2, then 3. The alphabetical or listed order of species names is not the drawing order.`, kind: 'tip' },
    { content: `A branch point stands for an ancestral *population* that split, not for a named species you can point to. Say "their most recent common ancestor," not "they came from the moss."`, kind: 'vocab-note' },
  ],
};
