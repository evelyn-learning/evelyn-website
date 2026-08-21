/**
 * Grade 7 Science (Life Science) — Ecology: Populations, Communities & Ecosystems.
 *
 * Concept-led (NGSS MS-LS2-1). The ladder organism -> population -> community
 * -> ecosystem -> biome is the same "groups inside groups" reasoning the
 * student already met in Unit 3 (cell -> tissue -> organ -> organ system ->
 * organism), so the lesson names that echo out loud rather than letting the
 * student meet two unrelated-looking ladders in one year.
 *
 * The load-bearing distinction is BIOTIC versus ABIOTIC, and the item that
 * decides whether a student has it is the fallen log: it is biotic, because
 * it came from a living thing. Abiotic means NEVER living, not "not alive
 * right now".
 *
 * NOTE FOR FUTURE AUTHORS: there are no images in this course. Every item
 * here is solvable from the words printed in it. If a lesson needs a pond, a
 * field or a forest, describe it in prose -- never "see the diagram above".
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7SCI_U9_ECOSYSTEM_ORGANIZATION: LessonPlan = {
  id: 'evelyn.ms.m7sci.ecosystem-organization.v1',
  title: 'Populations, Communities & Ecosystems',
  curriculum: 'MS',
  grade: '7',
  subject: 'science',
  topic: 'grade-7-life-science',
  locale: 'en',
  los: [
    {
      id: 'm7sci.ecosystem-organization',
      standard: 'M7SCI-9.1',
      description:
        'Order the levels of ecological organization from a single organism to a population, a community, an ecosystem and a biome, and sort the parts of an environment into biotic and abiotic factors in order to describe how living things depend on both (NGSS MS-LS2-1).',
    },
  ],
  prerequisites: ['m7sci.cladograms-and-relatedness'],
  followUps: ['m7sci.food-chains-and-food-webs'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Anchor the ecological ladder in one small place the student can picture without a picture.',
      script:
        'Picture the pond behind a school. Green weed at the edges. Some frogs. A lot more insects than anyone wants to count. Now start listing what is there. You could say one frog. You could say all the frogs. You could say every living thing in the water. Or you could say the whole pond, water and mud and sunlight included. Every one of those is a real answer, and scientists use a different word for each one, because each one is a different size of question. Today we sort a place into levels, and then we sort the place itself into the parts that are alive, the parts that used to be alive, and the parts that never were.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-ecological-levels',
      kind: 'concept',
      goal: 'Build the organism-to-biome ladder, define each level by what it contains, and settle biotic versus abiotic.',
      keyIdeas: [
        'THE LADDER, SMALLEST TO LARGEST — one ORGANISM is one living thing. A POPULATION is all the members of ONE species living in the same area. A COMMUNITY is all the populations in that area, which is another way of saying all the living things. An ECOSYSTEM is that community PLUS the non-living parts of the place. A BIOME is a huge region with a particular climate, holding many ecosystems of a similar kind, such as desert, tundra or rainforest. Each level is built out of the level below it.',
        'A POPULATION IS ONE SPECIES, AND THIS IS THE MOST MISSED WORD IN THE UNIT — WRONG: "A population is every organism living in the pond." CORRECT: "A population is all the members of one species living in the pond." All the bullfrogs in the pond are one population. All the cattails are a second population. The frogs and the cattails together are not a population at all, because they are not the same species. If you can name more than one species in your group, you have gone past the population level.',
        'A COMMUNITY IS EVERY POPULATION TOGETHER, AND NOTHING ELSE — put all the populations of the pond side by side, frogs and cattails and minnows and dragonflies and the algae, and you have the community. It is all the living things, interacting. What a community does NOT include is the water, the mud, the air or the sunlight. Those are not left out by accident. They get added at the next level up, and that is exactly what makes the next level different.',
        'AN ECOSYSTEM IS THE COMMUNITY PLUS THE NON-LIVING PARTS — and this is where BIOTIC and ABIOTIC come in. BIOTIC factors are the living parts of a place, and also the parts that were once living. ABIOTIC factors are the parts that were NEVER alive: sunlight, water, air, temperature, and the rock and minerals of the soil. So a fallen log is BIOTIC, and so is a dead leaf, because both came from a living tree. WRONG: "A dead log is abiotic because it is not alive." CORRECT: "A dead log is biotic because it came from something that was alive." Abiotic means never living, not not-alive-today.',
        'THIS IS THE SAME LADDER YOU ALREADY CLIMBED IN UNIT 3, JUST BIGGER — back then it went cell, tissue, organ, organ system, organism, and every step was built out of the step below. Here it goes organism, population, community, ecosystem, biome, and every step is still built out of the step below. Same reasoning, groups inside groups, only now the top of the old ladder is the bottom of the new one. One organism is where the body ladder finished and where the ecology ladder starts.',
        'TWO TRAPS WORTH NAMING NOW — first, A LEVEL IS DEFINED BY WHAT IT CONTAINS, NOT BY HOW BIG IT IS. A population of elephants spread across a whole valley is still just a population, and a rotting log holding beetles, fungi and mosses along with the damp wood is a small ecosystem. Bigger does not mean higher up the ladder. Second, ECOSYSTEMS DO NOT HAVE HARD EDGES. The pond blends into the wet grass, the wet grass blends into the field, and animals cross those blurry borders all day. Where one ecosystem stops is a choice scientists make to study a place, not a wall that exists in the mud.',
      ],
      vocabulary: [
        { term: 'population', definition: 'all the members of one species living in the same area at the same time.' },
        { term: 'community', definition: 'all the populations living and interacting in the same area, which is all the living things there.' },
        { term: 'ecosystem', definition: 'a community together with the non-living parts of its surroundings, all interacting.' },
        { term: 'biotic factor', definition: 'a part of an environment that is living or was once living, such as a frog, a tree or a fallen log.' },
        { term: 'abiotic factor', definition: 'a part of an environment that was never living, such as sunlight, water, air or temperature.' },
        { term: 'biome', definition: 'a very large region with a particular climate, containing many ecosystems of a similar kind, such as desert or tundra.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-name-the-level',
      kind: 'worked_example',
      problem:
        'A class studies the pond behind their school. They write four notes. Note 1: there are twelve bullfrogs in the pond. Note 2: the pond holds bullfrogs, minnows, dragonflies, cattails and green algae. Note 3: the pond also holds water, mud, sunlight and air. Note 4: this pond is one of hundreds of ponds and streams across a rainy region of forest. Name the level of ecological organization described by each note.',
      steps: [
        'Use one question for every note: what is inside this group? The level is decided by what the group contains, never by how large the area is.',
        'Note 1 lists twelve bullfrogs, and a bullfrog is one species. All the members of one species in one area is a POPULATION. If the note had said one bullfrog, that would be a single ORGANISM instead.',
        'Note 2 lists five different kinds of living thing in the same pond. That is more than one species, so it is past the population level. All the populations together, and nothing non-living, is the COMMUNITY.',
        'Note 3 adds water, mud, sunlight and air. Those are abiotic, and adding them to the community gives the ECOSYSTEM. Notice that note 3 by itself is not a level at all. It only becomes a level once you combine it with the living things from note 2.',
        'Note 4 zooms out to a whole rainy forested region containing many similar ecosystems. That is a BIOME.',
        'Check the answers by walking the ladder in order: organism, population, community, ecosystem, biome. Each one contains the one before it, and nothing was skipped.',
      ],
      answer:
        'Note 1 = population; note 2 = community; note 3 = the abiotic parts, which turn the community into an ecosystem; note 4 = biome.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-biotic-or-abiotic',
      kind: 'worked_example',
      problem:
        'A student is sorting parts of a forest floor into biotic and abiotic. Her list is: earthworms, sunlight reaching the ground, a fallen log, the air temperature, dead leaves, and rainwater in a puddle. Sort each one and explain the rule you used.',
      steps: [
        'State the rule first, because the whole task turns on it. BIOTIC means living or once living. ABIOTIC means never living. Do not ask whether it is alive right now. Ask whether it ever was.',
        'Earthworms: alive right now, so BIOTIC. That one is easy and it is not where students lose marks.',
        'Sunlight reaching the ground: light was never alive, so ABIOTIC.',
        'A fallen log: the log is not alive now, but it used to be part of a living tree. Once living counts, so it is BIOTIC. This is the item that decides whether someone really has the rule.',
        'The air temperature: temperature is a condition of the air, and it was never alive, so ABIOTIC.',
        'Dead leaves: same reasoning as the log. They grew on a living plant, so they are BIOTIC.',
        'Rainwater in a puddle: water was never alive, so ABIOTIC. Careful here, because water is necessary FOR life. Being needed by living things does not make something biotic.',
        'WRONG way to sort: "The log and the leaves are dead, so they go with the rocks and the water." CORRECT way: "The log and the leaves came from living things, so they are biotic, and only the sunlight, temperature and water were never alive."',
      ],
      answer:
        'Biotic: earthworms, the fallen log, the dead leaves. Abiotic: sunlight, air temperature, rainwater. The rule is once living counts as biotic, so dead material from an organism is biotic.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-identify-population',
      kind: 'try_yourself',
      problem:
        'A pond holds bullfrogs, minnows, dragonflies and cattails, along with water, mud and sunlight. Which of these groups is a population?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'All the bullfrogs living in the pond', correct: true },
        { id: 'b', text: 'All the living things in the pond' },
        { id: 'c', text: 'All the bullfrogs and all the minnows in the pond, because both live in water' },
        { id: 'd', text: 'The water, the mud and the sunlight of the pond' },
      ],
      expectedAnswer: 'All the bullfrogs living in the pond',
      hints: [
        'A population is built from one species only. Count how many different kinds of living thing each choice contains.',
        'One of these choices is the community, one puts two different species into a single group, and one lists no living things at all.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-biotic-factor',
      kind: 'try_yourself',
      problem: 'Which of these parts of a forest is a biotic factor?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The sunlight that reaches the forest floor' },
        { id: 'b', text: 'A fallen log rotting on the forest floor', correct: true },
        { id: 'c', text: 'The temperature of the air under the trees' },
        { id: 'd', text: 'The rainwater sitting in a puddle' },
      ],
      expectedAnswer: 'A fallen log rotting on the forest floor',
      hints: [
        'Biotic does not mean alive right now. It means living OR once living.',
        'Three of these were never alive at any point. Ask where each one came from.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-community-versus-ecosystem',
      kind: 'try_yourself',
      problem:
        'A class studies a meadow. They record every wildflower, grass, insect and mouse they can find, and they also record the sunlight, the rainfall and the soil temperature. Which statement describes what they have studied?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'An ecosystem, because they recorded both the living things and the non-living things', correct: true },
        { id: 'b', text: 'A community, because a community includes the sunlight, rainfall and temperature' },
        { id: 'c', text: 'A population, because everything they recorded lives in one meadow' },
        { id: 'd', text: 'A biome, because a meadow is larger than a single pond' },
      ],
      expectedAnswer: 'An ecosystem, because they recorded both the living things and the non-living things',
      hints: [
        'Decide the level by what the group contains. Sort their notes into living things and non-living things first.',
        'A community stops at the living things. Adding the non-living parts moves you up one step.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-ecosystem-and-dead-log',
      kind: 'misconception_check',
      question:
        'A student writes: "An ecosystem is all the living things in an area. The dead log on the ground is abiotic, because it is not alive." Two things are wrong there. What are they?',
      commonErrors: [
        {
          answer: 'An ecosystem is all the living things in an area.',
          misconception:
            'Stopping the definition at the living things, because those are the parts that are easy to notice and easy to list.',
          correctsTo:
            'All the living things in an area is the COMMUNITY. An ECOSYSTEM is that community PLUS the non-living parts it interacts with: the water, the sunlight, the air, the temperature and the minerals of the soil. The non-living parts are not scenery. Remove the water from a pond and every population in it is gone, so the water belongs in the description of the place. A short way to hold it: community plus abiotic parts equals ecosystem.',
        },
        {
          answer: 'The dead log is abiotic, because it is not alive.',
          misconception:
            'Reading abiotic as "not alive right now" instead of "never alive", so anything dead gets sorted in with the rocks and the water.',
          correctsTo:
            'Biotic means living OR once living. The log came from a tree, so it is BIOTIC even though the tree is dead. Dead leaves, feathers, shells and bones are biotic for the same reason. This matters because that dead material still feeds the ecosystem: fungi and worms break the log down and return its nutrients to the soil, which is a job the sunlight and the rainwater cannot do. Ask where it came from, not whether it is breathing.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The ladder runs organism, population, community, ecosystem, biome, and each level is built out of the level below it.',
        'A population is ONE species in an area. Two species in your group means you have left the population level.',
        'A community is all the populations, meaning all the living things, and nothing non-living.',
        'An ecosystem is the community PLUS the abiotic parts: sunlight, water, air, temperature and the minerals of the soil.',
        'Biotic means living or once living, so a fallen log and a dead leaf are biotic. Abiotic means never living.',
        'This is the Unit 3 ladder again at a bigger scale, and a level is set by what it contains, not by how large the area is. Ecosystems also blend into one another instead of stopping at hard edges.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.1', cedTitle: 'Populations, Communities & Ecosystems' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
