/**
 * K-2 Science — What Animals Need to Live.
 *
 * NGSS K-LS1-1 / 1-LS1-2: identify the resources animals need (food,
 * water, air, shelter, sometimes warmth or each other) and how
 * different animals meet these needs in different ways. Concrete
 * examples (dog, fish, bird) keep it tangible.
 *
 * Source: NGSS K-LS1, 1-LS1, OpenStax K-2 Science.
 */

import type { LessonPlan } from '../types';

export const SEED_K2_SCI_ANIMAL_NEEDS: LessonPlan = {
  id: 'evelyn.k2.science.life.animal-needs.v1',
  title: 'What Animals Need to Live',
  curriculum: 'NGSS',
  grade: 'K-2',
  subject: 'science',
  topic: 'life-science',
  locale: 'en',
  los: [
    {
      id: 'ngss.k-ls1-1',
      description: 'Use observations to describe patterns of what plants and animals (including humans) need to survive.',
      standard: 'NGSS.K-LS1-1',
    },
    {
      id: 'ngss.1-ls1-2',
      description: 'Read texts and use media to determine patterns in behavior of parents and offspring that help offspring survive.',
      standard: 'NGSS.1-LS1-2',
    },
  ],
  prerequisites: [],
  followUps: ['ngss.3-ls4-3'],
  estimatedMinutes: 12,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Connect to a pet or animal the student knows.',
      script: 'Think of an animal you know — a pet, a bird in your yard, a fish in a tank. What does it need every day to stay alive and happy?',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-five-needs',
      kind: 'concept',
      goal: 'Animals need food, water, air, shelter, and (often) other animals to grow up.',
      keyIdeas: [
        'FOOD — gives energy. Different animals eat different things.',
        'WATER — every animal needs to drink (or get water from food).',
        'AIR — to breathe. Land animals breathe through nose/mouth; fish breathe through gills.',
        'SHELTER — a safe place from weather and danger. Burrows, nests, dens, caves.',
        'PARENTS / GROUP (when young) — many baby animals need parents to feed and protect them.',
      ],
      vocabulary: [
        { term: 'shelter', definition: 'a safe place an animal lives or hides.' },
        { term: 'gills', definition: 'how fish breathe — they take oxygen from water.' },
      ],
      suggestedTools: ['show_labeled_image'],
      estimatedMinutes: 3,
    },
    {
      id: 'worked-fish-vs-dog',
      kind: 'worked_example',
      problem: 'A fish and a dog both need food, water, and air. But they get them differently. How?',
      steps: [
        'FISH: lives in water. Drinks the water it swims in. Eats other tiny water creatures or food flakes. Breathes oxygen through GILLS — pulled from the water.',
        'DOG: lives on land. Drinks from a bowl. Eats dog food (or whatever it can catch!). Breathes air through nose/mouth.',
        'Same five needs (food/water/air/shelter/care), but the WAY they get each one is built for their environment.',
      ],
      answer: 'Both have the same needs. Fish use gills + live in water; dogs use nose/mouth + live on land.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A baby bird falls out of its nest. Which of its FIVE needs is now in danger?',
      expectedAnswer: 'shelter (the nest) AND parents (who fed and protected it)',
      responseFormat: 'free',
      hints: [
        'The nest is the bird\'s shelter.',
        'Without the nest AND the parents, the baby bird is also without food.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-all-animals-same',
      kind: 'misconception_check',
      question: 'A friend says "all animals need exactly the same things — that\'s why we\'re all alive." Is that fully right?',
      commonErrors: [
        {
          answer: 'Yes — all animals need the same things.',
          misconception: 'Generalizing the broad needs to identical specific requirements.',
          correctsTo: 'The CATEGORIES are the same (food, water, air, shelter). But the DETAILS differ a lot — a polar bear needs cold and seal meat; a tropical fish needs warm water and tiny insects. Same broad needs, very different specifics for each animal.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'All animals need food, water, air, shelter, and (when young) care.',
        'Different animals get them in different ways.',
        'Parents help baby animals survive.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
