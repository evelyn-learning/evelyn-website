/**
 * Grade 6 World Geography — Weather, Climate & Ecosystems: Ecosystems &
 * Habitats.
 *
 * CONCEPT-LED row for the m6geo fan-out (National Geography Standard 8). The
 * whole lesson installs two definitions and one sorting skill: an ecosystem
 * is every living and nonliving thing sharing one place, a habitat is the
 * specific spot inside that ecosystem where one particular living thing
 * lives, and a described scene can be sorted into its living (biotic) and
 * nonliving (abiotic) parts using one three-part test (does it grow, need
 * energy to survive, and make more of its own kind). Every scene in this
 * file is invented -- a pond, a terrarium, a desert crack, a tide pool, a
 * garden -- rather than a real named place, because the row's scope is
 * sorting a DESCRIBED ecosystem, not locating a real one, and an invented
 * scene is both safer and a better test of the definition (a student who can
 * sort a made-up pond has learned the definition; a student who has
 * memorized one real pond has not).
 *
 * SCOPE GUARD: this row DEFINEs ecosystem and habitat and IDENTIFIES the
 * living and nonliving parts of a described ecosystem. It never states what
 * one living thing does TO another, what anything eats, how energy or
 * matter moves through a system, why a population rises or falls, or why a
 * living thing is suited to its habitat. The sentence this file deliberately
 * never writes is any sentence describing a food chain, a food web, a
 * predator-prey or competition relationship, an adaptation, or a population
 * change -- "biotic" and "abiotic" name a two-way split of WHAT a part is,
 * never a description of what the parts DO to each other. That is ecology,
 * and it sits above this course's own depth ceiling by the general tests
 * (a closed typology of feeding or energy roles, and a causal chain of two
 * or more links, such as "the sun feeds the plant, which feeds the animal,
 * which feeds the next animal"), even though no single Grade 7 World
 * Geography lesson names ecology as its own excluded topic the way row 5.3
 * names `m7geo-u2-climate-zones-and-biomes.ts` for biome mechanism -- flagged
 * in the report, because the curriculum's own scope line and excluded list
 * are silent on this specific boundary and the ceiling here is drawn from
 * the contract's five tests rather than from a named sibling file. The
 * sibling science row `m6sci-u7-earths-four-spheres-interacting.ts` faced the
 * identical shape of boundary in its own biosphere key idea and solved it the
 * same way: name that living things are one of the parts, describe only the
 * plain physical fact of what is present, and write no sentence about how an
 * organism's body works, what it eats, or how it survives.
 *
 * SPLIT FROM ROW 5.3 (`what-is-a-biome`, not yet a shipped file at authoring
 * time): a biome is a broad CATEGORY a description gets matched to -- desert,
 * rainforest, tundra, grassland, forest -- chosen from a closed list using
 * temperature, precipitation, and plant-life clues, at the scale of a large
 * region. An ecosystem, in this row, is not a category to match at all; it is
 * the actual set of living and nonliving parts sharing one specific place,
 * and that place can be any size, from a tide pool to a forest. This file
 * never asks the student to name or match a biome type, and the word
 * "biome" does not appear anywhere in the taught content -- the hook,
 * concept, worked examples, try-yourself items, misconception check, or
 * recap. It appears once in the file, inside the LO description's mandatory
 * verbatim citation of NGS 8's own name ("the characteristics and spatial
 * distribution of ecosystems and biomes on Earth's surface"), which the
 * contract requires quoting whole and which the student is never shown.
 * The two ideas
 * sit at different scales of the same general subject (NGS 8 covers both),
 * and this row stays on the parts-of-one-place side of that line.
 *
 * DEPTH CEILING NOTE FOR THE FAN-OUT: every keyIdea and every item below is
 * answered by DEFINE or IDENTIFY -- name the two terms, sort a listed part
 * into one of two buckets. Nothing here asks why a living thing is suited to
 * where it lives, and nothing chains two reasons together.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped
 * Grade 7 Geography bank the keyed answer was the strictly longest choice 67%
 * of the time, and 94% at difficulty 4; chance with four choices is 25%).
 * Every distractor below states a full wrong reason rather than a short wrong
 * label, and no key was built to be the longest choice BECAUSE it is the key.
 * Measured as a diagnostic, not as a score: character counts on all twelve
 * choices are item 1 -- a:157(key) b:153 c:147 d:133; item 2 -- a:140 b:131
 * c:156(key) d:163; item 3 -- a:146 b:159 c:177 d:189(key). The key is the
 * strictly longest choice in two of the three items (item 1, by a
 * four-character margin over its closest distractor; item 3, by a
 * twelve-character margin), and is NOT the longest in item 2, where a
 * distractor (d) runs seven characters longer than the key. Two of three is
 * a normal outcome under pure chance (about 14%) and is reported rather than
 * chased toward zero; a whole course driven to zero would be the same tell
 * inverted. Neither long key was built long BECAUSE it is the key: item 1's
 * key is long because it names all five parts of the scene plus the habitat
 * sub-clause, and item 3's key is long because it is the only choice that
 * states the complete three-part living test rather than a short label.
 * The three keys sit at ids a, c, and d -- the id set `(5 + 4) mod 4 = 1`
 * requires, omitting b.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every item is solvable
 * from the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6GEO_U5_ECOSYSTEMS_AND_HABITATS: LessonPlan = {
  id: 'evelyn.ms.m6geo.ecosystems-and-habitats.v1',
  title: 'Ecosystems & Habitats',
  curriculum: 'MS',
  grade: '6',
  subject: 'social-studies',
  topic: 'grade-6-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm6geo.ecosystems-and-habitats',
      standard: 'M6GEO-5.4',
      description:
        'Define ecosystem and habitat and identify the living and nonliving parts of a described ecosystem (National Geography Standard 8: the characteristics and spatial distribution of ecosystems and biomes on Earth\'s surface).',
    },
  ],
  prerequisites: ['m6geo.what-is-a-biome'],
  followUps: ['m6geo.renewable-and-nonrenewable-resources'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make a small, familiar box of living and nonliving parts feel like a real system before any vocabulary arrives.',
      script:
        'Think about a fish tank sitting on a shelf. Inside it there is water, gravel on the bottom, a light clipped to the top, a few fish, and a plant rooted in the gravel. Take away the light and the fish get too cold. Take away the plant and the water stops getting some of its oxygen. Every part in that tank is doing something for every other part, even though the fish never had a meeting about it. Today you are going to learn the two words geographers use for a scene like that -- one word for the whole tank together, and one word for the smaller spot inside it where just one kind of thing actually lives.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-ecosystem-and-habitat',
      kind: 'concept',
      goal: 'Install the ecosystem definition, the habitat definition, and the living/nonliving sorting test that tells them apart.',
      keyIdeas: [
        'AN ECOSYSTEM IS EVERY LIVING AND NONLIVING THING SHARING ONE PLACE, TOGETHER. A pond, a garden, a patch of desert, and a fish tank can all be ecosystems. An ecosystem is not just the living things in a place, and it is not just the nonliving things either -- it is both kinds, together, sharing the same space.',
        'A LIVING PART OF AN ECOSYSTEM IS CALLED A BIOTIC PART, AND A NONLIVING PART IS CALLED AN ABIOTIC PART. Every ecosystem has some of each. A scene with only plants and animals and nothing else is not a full ecosystem description, and neither is a scene with only water and rocks and no living thing in it.',
        'THE TEST FOR LIVING IS THREE THINGS AT ONCE, NOT JUST ONE. Something is living if it grows, needs energy to survive, and can make more of its own kind. A rock does none of those three things, so it is nonliving even though wind or water can move it. A plant does all three, even though it never moves from the spot where it is rooted -- moving is not part of the test.',
        'A HABITAT IS THE SPECIFIC SPOT INSIDE AN ECOSYSTEM WHERE ONE PARTICULAR LIVING THING LIVES. The whole pond is the ecosystem. The muddy bottom where one kind of worm burrows is that worm\'s habitat. The lily pad where a frog rests is that frog\'s habitat. A habitat is always smaller than the ecosystem that contains it, and it always sits inside one.',
        'ONE ECOSYSTEM CAN HOLD MANY DIFFERENT HABITATS AT THE SAME TIME. The pond ecosystem has room for a fish\'s habitat in the open water, a turtle\'s habitat on a sunny rock at the edge, and an insect\'s habitat under a floating leaf, all inside that same one ecosystem.',
      ],
      vocabulary: [
        { term: 'ecosystem', definition: 'every living and nonliving thing sharing one place, considered together.' },
        { term: 'habitat', definition: 'the specific spot inside an ecosystem where one particular living thing lives.' },
        { term: 'organism', definition: 'a single living thing.' },
        { term: 'biotic part', definition: 'a living part of an ecosystem, such as a plant or an animal.' },
        { term: 'abiotic part', definition: 'a nonliving part of an ecosystem, such as water, sunlight, air, or a rock.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-sort-the-pond',
      kind: 'worked_example',
      problem:
        'A pond is described this way: cattails grow at the muddy edge, dragonflies fly low over the water, sunlight warms the surface, smooth rocks line the shore, frogs sit on a lily pad, the water itself fills the middle, and air sits above it all. Sort every named part into biotic (living) or abiotic (nonliving), and say what the whole pond scene together is called.',
      steps: [
        'List every part named in the description first, without judging any of them yet: cattails, dragonflies, sunlight, rocks, frogs, water, air. That is seven parts.',
        'Run the same test on each one: does it grow, need energy to survive, and make more of its own kind? Cattails -- yes, a plant does all three, so BIOTIC. Dragonflies -- yes, BIOTIC. Frogs -- yes, BIOTIC.',
        'Now the rest. Sunlight -- it does not grow, need energy, or reproduce, so ABIOTIC. Rocks -- ABIOTIC. Water -- ABIOTIC. Air -- ABIOTIC.',
        'Group the results. Biotic: cattails, dragonflies, frogs. Abiotic: sunlight, rocks, water, air.',
        'Name the whole scene. All seven parts together -- the three living ones and the four nonliving ones, sharing that one place -- make up the pond ecosystem.',
        'Check by rewinding the description one part at a time. Cattails, dragonflies, sunlight, rocks, frogs, water, air -- that is seven parts named, and seven parts sorted, three biotic and four abiotic, with none left over and none sorted twice.',
      ],
      answer:
        'Biotic (living): cattails, dragonflies, frogs. Abiotic (nonliving): sunlight, rocks, water, air. All seven parts together are the pond ecosystem.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-ecosystem-vs-habitat-desert',
      kind: 'worked_example',
      problem:
        'A desert scene is described: loose sand covers the ground, a small lizard rests in a shaded crack in a rock, a cactus grows nearby, and the sun beats down through the afternoon. A student says: "The ecosystem here is just the crack in the rock, since that is where the lizard lives." What is wrong with that sentence, and what should the crack actually be called?',
      steps: [
        'WRONG: "The ecosystem here is just the crack in the rock." The mistake is naming the smallest part of the scene as if it were the whole system.',
        'CORRECT: the ecosystem is the entire desert scene described -- the sand, the lizard, the cactus, the sun, and the rock together -- because an ecosystem is every living and nonliving thing sharing one place, not one small piece of it.',
        'Name the crack correctly instead. The shaded crack is the specific spot where the lizard rests, inside the larger desert ecosystem. That makes it the lizard\'s habitat, not the ecosystem itself.',
        'Sort this desert scene the same way the pond was sorted, to check the test still works on a different kind of place. Lizard -- grows, needs energy, reproduces, so BIOTIC. Cactus -- also BIOTIC, even though it never moves from where it is rooted. Sand -- ABIOTIC. Sun\'s warmth -- ABIOTIC. Rock -- ABIOTIC.',
        'Notice what changed and what did not between the two scenes. The pond\'s biotic parts (dragonflies, frogs) moved around; the desert\'s cactus does not move at all and is still biotic. The sorting test never asked about movement, so it gives the right answer either way.',
      ],
      answer:
        'The sentence is wrong because it names only the smallest part of the scene as the ecosystem. The whole desert scene -- sand, lizard, cactus, sun, and rock together -- is the ecosystem, and the shaded crack is the lizard\'s habitat inside it.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-ecosystem-or-habitat',
      kind: 'try_yourself',
      problem:
        'A classroom terrarium holds moss, damp soil, pill bugs, a small piece of bark that the pill bugs hide under, and a lamp providing light. Which statement correctly tells apart the ecosystem and the habitat in this terrarium?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'The whole terrarium -- moss, pill bugs, bark, soil, and light together -- is the ecosystem, and the space under the bark is the pill bugs\' habitat within it.',
          correct: true,
        },
        {
          id: 'b',
          text: 'The whole terrarium is the habitat, and the space under the bark is the ecosystem, because the smaller space is where the living parts actually interact.',
        },
        {
          id: 'c',
          text: 'The moss and the pill bugs together are the ecosystem on their own, since the soil and the lamp are not alive and so cannot belong to an ecosystem.',
        },
        {
          id: 'd',
          text: 'The space under the bark is the ecosystem, and the rest of the terrarium is just the habitat that happens to surround and support it.',
        },
      ],
      expectedAnswer:
        'The whole terrarium -- moss, pill bugs, bark, soil, and light together -- is the ecosystem, and the space under the bark is the pill bugs\' habitat within it.',
      hints: [
        'Ask which one is the WHOLE place with everything in it, and which one is just where ONE living thing stays.',
        'An ecosystem is not made only of its living parts, and a habitat is never bigger than the ecosystem that contains it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-sort-the-tide-pool',
      kind: 'try_yourself',
      problem:
        'A rocky tide pool is described: a sea star, a clump of green seaweed, the salty water filling the pool, a smooth stone at the bottom, a hermit crab, and the warmth of the afternoon sun. Which choice lists only the nonliving (abiotic) parts of this tide pool?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'The sea star, the hermit crab, and the smooth stone, because those are the three parts a person could actually pick up and hold in one hand.',
        },
        {
          id: 'b',
          text: 'The sea star, the seaweed, and the hermit crab, since a tide pool\'s nonliving parts are always the ones that can move on their own.',
        },
        {
          id: 'c',
          text: 'The salty water, the smooth stone, and the warmth of the afternoon sun, because none of these grows, needs energy to survive, or makes more of its own kind.',
          correct: true,
        },
        {
          id: 'd',
          text: 'The seaweed, the smooth stone, and the sun\'s warmth, because a plant that cannot move from place to place counts as nonliving, the same as the water and the stone.',
        },
      ],
      expectedAnswer:
        'The salty water, the smooth stone, and the warmth of the afternoon sun, because none of these grows, needs energy to survive, or makes more of its own kind.',
      hints: [
        'Sort each named part one at a time. Ask whether it grows, needs energy to survive, and can make more of its own kind.',
        'A part that sits still, like a stone, is not automatically nonliving just for sitting still, and a plant is not automatically nonliving just for staying rooted in one spot.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-does-moving-make-it-living',
      kind: 'try_yourself',
      problem:
        'A garden scene includes a rose bush, a trickle of water from a hose, a garden spider, small pebbles lining a path, and a gentle breeze moving the leaves. A student says the breeze must be a living part of the garden ecosystem, since it is the only thing in the list that is moving on its own. What is wrong with that reasoning?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'The student is right, because moving on its own without being pushed is exactly what separates a living part of an ecosystem from a nonliving one.',
        },
        {
          id: 'b',
          text: 'The student is wrong only because a breeze cannot be seen or touched, and only parts of a scene that can be seen and touched count as biotic or abiotic at all.',
        },
        {
          id: 'c',
          text: 'The student is wrong only because the breeze does not have a name of its own the way the rose bush and the spider do, and every part of an ecosystem needs its own specific name.',
        },
        {
          id: 'd',
          text: 'The student is wrong because movement alone does not make something living; a living thing also grows, needs energy to survive, and can make more of its own kind, which a breeze never does.',
          correct: true,
        },
      ],
      expectedAnswer:
        'The student is wrong because movement alone does not make something living; a living thing also grows, needs energy to survive, and can make more of its own kind, which a breeze never does.',
      hints: [
        'Run the same test on the breeze that you would run on anything else: does it grow, need energy to survive, and make more of its own kind?',
        'Movement by itself is not the test. Wind, flowing water, and a rolling stone all move without being alive.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-size-swap-and-growing-puddle',
      kind: 'misconception_check',
      question:
        'A student says two things: "The whole forest is the habitat, and the fallen log where a salamander hides is the ecosystem, because the log is the smaller part of the system." Then, looking at a puddle that kept spreading after a rainstorm, the same student says: "That puddle must be a living part of the ecosystem, since it kept growing bigger." What is wrong with each claim?',
      commonErrors: [
        {
          answer:
            'The whole forest is the habitat, and the fallen log is the ecosystem, because the log is the smaller part.',
          misconception:
            'Assuming size decides the labels -- that the bigger space must be the plain-sounding word "habitat" and the smaller space must be the complicated-sounding word "ecosystem."',
          correctsTo:
            'Size does not decide the labels. An ecosystem is every living and nonliving thing sharing one place, and a habitat is the specific spot inside that ecosystem where one living thing lives -- a habitat is always the smaller of the two. WRONG: "the small space is the ecosystem and the large space is the habitat." CORRECT: the whole forest, with its plants, animals, soil, water, and air, is the ecosystem, and the fallen log is the salamander\'s habitat inside it.',
        },
        {
          answer: 'The puddle must be a living part of the ecosystem, since it kept growing bigger.',
          misconception:
            'Hearing that a living thing grows, and treating any kind of getting-bigger as that same kind of growth, when the puddle is only gaining more water rather than growing itself.',
          correctsTo:
            'Growing is only one part of the three-part test, and it means growing itself, using its own energy, not simply gaining more material from outside. The puddle got bigger because rain added more water to it, the same way a pile of sand gets bigger when more sand is poured on. WRONG: "the puddle is living because it grew." CORRECT: the puddle stays abiotic. It changes size only because water is added or drained away, never because it is alive.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'An ecosystem is every living and nonliving thing sharing one place, together -- not just the living parts and not just the nonliving parts.',
        'Living parts of an ecosystem are called biotic parts. Nonliving parts are called abiotic parts.',
        'The test for living is three things at once: does it grow, does it need energy to survive, and can it make more of its own kind. A plant passes even though it never moves from its spot; a rock, water, sunlight, and air all fail, even when wind or water moves them.',
        'A habitat is the specific spot inside an ecosystem where one particular living thing lives. A habitat is always smaller than the ecosystem that contains it.',
        'One ecosystem can hold many different habitats at the same time, for many different living things.',
        'Size does not decide which word applies. The whole place is the ecosystem; the smaller spot where one living thing lives is the habitat.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.4', cedTitle: 'Ecosystems & Habitats' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
