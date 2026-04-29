/**
 * Grade 3 Science — Adaptations.
 * NGSS 3-LS4-2 / 3-LS4-3: variations of characteristics affect
 * survival; some organisms thrive in certain habitats while others
 * cannot.
 */

import type { LessonPlan } from '../types';

export const SEED_G3_SCI_ADAPTATIONS: LessonPlan = {
  id: 'evelyn.g3.science.life.adaptations.v1',
  title: 'Adaptations: Built for the Job',
  curriculum: 'NGSS', grade: '3', subject: 'science', topic: 'life-science', locale: 'en',
  los: [{ id: 'ngss.3-ls4-3', description: 'Construct an argument with evidence that in a particular habitat some organisms can survive well, some survive less well, and some cannot survive at all.', standard: 'NGSS.3-LS4-3' }],
  prerequisites: ['ngss.2-ls4-1'], followUps: ['ngss.ms-ls4-4'], estimatedMinutes: 18,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Hook with a striking adaptation.', script: 'A camel can drink 30 gallons of water at once and store it for days. A polar bear has BLACK skin under white fur — to absorb sunlight. These aren\'t accidents. They\'re ADAPTATIONS — and every plant and animal has them.', estimatedMinutes: 2 },
    { id: 'concept-adaptations', kind: 'concept', goal: 'An adaptation is any feature that helps an organism survive in its habitat. Adaptations can be physical (body parts) or behavioral (actions).', keyIdeas: [
      'PHYSICAL adaptations are body features — sharp teeth, thick fur, long beaks, camouflage colors.',
      'BEHAVIORAL adaptations are things organisms DO — migrating, hibernating, hunting in groups.',
      'Adaptations are usually about ONE of: getting food, avoiding predators, surviving weather, or finding mates.',
      'Adaptations build up over MANY generations through natural selection (covered later).',
      'An organism with the wrong adaptations for its habitat can\'t survive there.',
    ], vocabulary: [{ term: 'adaptation', definition: 'a feature that helps an organism survive.' }, { term: 'camouflage', definition: 'colors/patterns that blend in.' }, { term: 'hibernate', definition: 'to sleep through winter to save energy.' }, { term: 'migrate', definition: 'to travel seasonally for food/warmth.' }], estimatedMinutes: 4 },
    { id: 'worked-arctic-fox', kind: 'worked_example', problem: 'List three adaptations of an Arctic fox and explain how each helps it survive.', steps: [
      'WHITE FUR (winter): camouflage in snow → harder for prey to spot the fox AND harder for predators to spot the fox.',
      'THICK FUR + small ears: keeps warm in extreme cold (small ears lose less heat).',
      'CACHING food: behavior — hides extra food when plentiful, eats it when scarce.',
    ], answer: 'White camouflage fur, thick fur + small ears for warmth, caching behavior for food.', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'A frog has long, sticky tongue. What\'s the adaptation FOR — what survival need does it solve?', expectedAnswer: 'getting food (catching insects)', responseFormat: 'free', hints: ['Adaptations help with: food, predators, weather, mates.', 'Long sticky tongue = good for grabbing what?'], estimatedMinutes: 2 },
    { id: 'misconception-adapt-on-purpose', kind: 'misconception_check', question: 'A friend says "the giraffe stretched its neck to reach high leaves, and that\'s why giraffes have long necks now." Is this how adaptation works?', commonErrors: [{ answer: 'Yes — they stretched to grow longer.', misconception: 'Believing organisms develop adaptations through individual effort during their lifetime (Lamarckism).', correctsTo: 'Individuals don\'t change their bodies on purpose. Adaptations build up over MANY generations: giraffes with longer necks happened to survive better and have more babies. Over thousands of years, longer-necked giraffes became common. The individual giraffe doesn\'t stretch its way to a longer neck.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Adaptation = feature that helps survival.', 'Two kinds: physical (body) and behavioral (action).', 'Adaptations are about food, predators, weather, or mates.', 'Adaptations build up over generations, not in one lifetime.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
