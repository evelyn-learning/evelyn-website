/**
 * Grade 6 World Geography — Unit 5 CED 5.4: Ecosystems & Habitats.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6geo.ecosystems-and-habitats.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6GEO_U5_ECOSYSTEMS_AND_HABITATS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6geo.ecosystems-and-habitats.v1',
  course: 'Grade 6 World Geography',
  cedUnit: 5,
  cedTopic: '5.4',
  cedTitle: 'Ecosystems & Habitats',
  planId: 'evelyn.ms.m6geo.ecosystems-and-habitats.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6geo.ecosystems-and-habitats.v1' }],
  theory: [
    { loId: 'm6geo.ecosystems-and-habitats', content: `AN ECOSYSTEM IS EVERY LIVING AND NONLIVING THING SHARING ONE PLACE, TOGETHER. A pond, a garden, a patch of desert, and a fish tank can all be ecosystems. An ecosystem is not just the living things in a place, and it is not just the nonliving things either -- it is both kinds, together, sharing the same space.` },
    { loId: 'm6geo.ecosystems-and-habitats', content: `A LIVING PART OF AN ECOSYSTEM IS CALLED A BIOTIC PART, AND A NONLIVING PART IS CALLED AN ABIOTIC PART. Every ecosystem has some of each. A scene with only plants and animals and nothing else is not a full ecosystem description, and neither is a scene with only water and rocks and no living thing in it.` },
    { loId: 'm6geo.ecosystems-and-habitats', content: `THE TEST FOR LIVING IS THREE THINGS AT ONCE, NOT JUST ONE. Something is living if it grows, needs energy to survive, and can make more of its own kind. A rock does none of those three things, so it is nonliving even though wind or water can move it. A plant does all three, even though it never moves from the spot where it is rooted -- moving is not part of the test.` },
    { loId: 'm6geo.ecosystems-and-habitats', content: `A HABITAT IS THE SPECIFIC SPOT INSIDE AN ECOSYSTEM WHERE ONE PARTICULAR LIVING THING LIVES. The whole pond is the ecosystem. The muddy bottom where one kind of worm burrows is that worm's habitat. The lily pad where a frog rests is that frog's habitat. A habitat is always smaller than the ecosystem that contains it, and it always sits inside one.` },
    { loId: 'm6geo.ecosystems-and-habitats', content: `ONE ECOSYSTEM CAN HOLD MANY DIFFERENT HABITATS AT THE SAME TIME. The pond ecosystem has room for a fish's habitat in the open water, a turtle's habitat on a sunny rock at the edge, and an insect's habitat under a floating leaf, all inside that same one ecosystem.` },
    { loId: 'm6geo.ecosystems-and-habitats', kind: 'definition', title: 'ecosystem', content: 'every living and nonliving thing sharing one place, considered together.' },
    { loId: 'm6geo.ecosystems-and-habitats', kind: 'definition', title: 'habitat', content: 'the specific spot inside an ecosystem where one particular living thing lives.' },
    { loId: 'm6geo.ecosystems-and-habitats', kind: 'definition', title: 'organism', content: 'a single living thing.' },
    { loId: 'm6geo.ecosystems-and-habitats', kind: 'definition', title: 'biotic part', content: 'a living part of an ecosystem, such as a plant or an animal.' },
    { loId: 'm6geo.ecosystems-and-habitats', kind: 'definition', title: 'abiotic part', content: 'a nonliving part of an ecosystem, such as water, sunlight, air, or a rock.' },
  ],
  methods: [
    {
      title: 'Worked sort the pond',
      steps: [
        `List every part named in the description first, without judging any of them yet: cattails, dragonflies, sunlight, rocks, frogs, water, air. That is seven parts.`,
        `Run the same test on each one: does it grow, need energy to survive, and make more of its own kind? Cattails -- yes, a plant does all three, so BIOTIC. Dragonflies -- yes, BIOTIC. Frogs -- yes, BIOTIC.`,
        `Now the rest. Sunlight -- it does not grow, need energy, or reproduce, so ABIOTIC. Rocks -- ABIOTIC. Water -- ABIOTIC. Air -- ABIOTIC.`,
        `Group the results. Biotic: cattails, dragonflies, frogs. Abiotic: sunlight, rocks, water, air.`,
        `Name the whole scene. All seven parts together -- the three living ones and the four nonliving ones, sharing that one place -- make up the pond ecosystem.`,
        `Check by rewinding the description one part at a time. Cattails, dragonflies, sunlight, rocks, frogs, water, air -- that is seven parts named, and seven parts sorted, three biotic and four abiotic, with none left over and none sorted twice.`,
      ],
      example: { problem: `A pond is described this way: cattails grow at the muddy edge, dragonflies fly low over the water, sunlight warms the surface, smooth rocks line the shore, frogs sit on a lily pad, the water itself fills the middle, and air sits above it all. Sort every named part into biotic (living) or abiotic (nonliving), and say what the whole pond scene together is called.`, solution: `Biotic (living): cattails, dragonflies, frogs. Abiotic (nonliving): sunlight, rocks, water, air. All seven parts together are the pond ecosystem.` },
      relatedLoIds: ['m6geo.ecosystems-and-habitats'],
    },
    {
      title: 'Worked ecosystem vs habitat desert',
      steps: [
        `WRONG: "The ecosystem here is just the crack in the rock." The mistake is naming the smallest part of the scene as if it were the whole system.`,
        `CORRECT: the ecosystem is the entire desert scene described -- the sand, the lizard, the cactus, the sun, and the rock together -- because an ecosystem is every living and nonliving thing sharing one place, not one small piece of it.`,
        `Name the crack correctly instead. The shaded crack is the specific spot where the lizard rests, inside the larger desert ecosystem. That makes it the lizard's habitat, not the ecosystem itself.`,
        `Sort this desert scene the same way the pond was sorted, to check the test still works on a different kind of place. Lizard -- grows, needs energy, reproduces, so BIOTIC. Cactus -- also BIOTIC, even though it never moves from where it is rooted. Sand -- ABIOTIC. Sun's warmth -- ABIOTIC. Rock -- ABIOTIC.`,
        `Notice what changed and what did not between the two scenes. The pond's biotic parts (dragonflies, frogs) moved around; the desert's cactus does not move at all and is still biotic. The sorting test never asked about movement, so it gives the right answer either way.`,
      ],
      example: { problem: `A desert scene is described: loose sand covers the ground, a small lizard rests in a shaded crack in a rock, a cactus grows nearby, and the sun beats down through the afternoon. A student says: "The ecosystem here is just the crack in the rock, since that is where the lizard lives." What is wrong with that sentence, and what should the crack actually be called?`, solution: `The sentence is wrong because it names only the smallest part of the scene as the ecosystem. The whole desert scene -- sand, lizard, cactus, sun, and rock together -- is the ecosystem, and the shaded crack is the lizard's habitat inside it.` },
      relatedLoIds: ['m6geo.ecosystems-and-habitats'],
    },
  ],
  pointers: [
    { content: `Students often say "The whole forest is the habitat, and the fallen log is the ecosystem, because the log is the smaller part." — Size does not decide the labels. An ecosystem is every living and nonliving thing sharing one place, and a habitat is the specific spot inside that ecosystem where one living thing lives -- a habitat is always the smaller of the two. WRONG: "the small space is the ecosystem and the large space is the habitat." CORRECT: the whole forest, with its plants, animals, soil, water, and air, is the ecosystem, and the fallen log is the salamander's habitat inside it.`, kind: 'common-error' },
    { content: `Students often say "The puddle must be a living part of the ecosystem, since it kept growing bigger." — Growing is only one part of the three-part test, and it means growing itself, using its own energy, not simply gaining more material from outside. The puddle got bigger because rain added more water to it, the same way a pile of sand gets bigger when more sand is poured on. WRONG: "the puddle is living because it grew." CORRECT: the puddle stays abiotic. It changes size only because water is added or drained away, never because it is alive.`, kind: 'common-error' },
    { content: `An ecosystem is every living and nonliving thing sharing one place, together -- not just the living parts and not just the nonliving parts.`, kind: 'tip' },
    { content: `Living parts of an ecosystem are called biotic parts. Nonliving parts are called abiotic parts.`, kind: 'tip' },
    { content: `The test for living is three things at once: does it grow, does it need energy to survive, and can it make more of its own kind. A plant passes even though it never moves from its spot; a rock, water, sunlight, and air all fail, even when wind or water moves them.`, kind: 'tip' },
    { content: `A habitat is the specific spot inside an ecosystem where one particular living thing lives. A habitat is always smaller than the ecosystem that contains it.`, kind: 'tip' },
    { content: `One ecosystem can hold many different habitats at the same time, for many different living things.`, kind: 'tip' },
    { content: `Size does not decide which word applies. The whole place is the ecosystem; the smaller spot where one living thing lives is the habitat.`, kind: 'tip' },
  ],
};
