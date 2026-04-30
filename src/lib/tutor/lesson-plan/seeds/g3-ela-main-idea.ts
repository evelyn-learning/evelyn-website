/**
 * G3 — ELA: Main idea and supporting details.
 *
 * The first non-trivial reading-comprehension skill. Recognize what
 * a paragraph is MOSTLY about (the umbrella) vs. the specific facts
 * that back it up (the details). Not the same as a topic — main
 * idea is a complete thought, topic is just a noun phrase.
 */

import type { LessonPlan } from '../types';

export const SEED_G3_ELA_MAIN_IDEA: LessonPlan = {
  id: 'evelyn.g3.ela.main-idea.v1',
  title: 'Main Idea and Supporting Details',
  curriculum: 'CCSS',
  grade: '3',
  subject: 'ela',
  topic: 'reading-comprehension',
  locale: 'en',
  los: [
    {
      id: 'ccss.ela.ri.3.2',
      description: 'Determine the main idea of a text; recount the key details and explain how they support the main idea.',
      standard: 'CCSS.ELA-LITERACY.RI.3.2',
    },
  ],
  prerequisites: [],
  followUps: ['ccss.ela.ri.4.2'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Use an umbrella metaphor to set up "main idea covers everything else".',
      script: 'Imagine an umbrella in the rain. It covers everything underneath. The MAIN IDEA of a paragraph works the same way — it\'s the big idea that "covers" all the smaller facts. The smaller facts are the SUPPORTING DETAILS, like raindrops the umbrella catches.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-main-vs-detail',
      kind: 'concept',
      goal: 'Distinguish topic, main idea, and supporting details. Strategy for finding each.',
      keyIdeas: [
        'TOPIC: what the paragraph is ABOUT — usually one or two words. (e.g. "polar bears".)',
        'MAIN IDEA: a complete sentence saying what\'s most important about the topic. ("Polar bears are well-suited for life in cold climates.")',
        'SUPPORTING DETAILS: the specific facts that back up the main idea. ("Their thick fur keeps them warm." "Their wide paws help them walk on snow.")',
        'A main idea is bigger than any single detail — it\'s what they ALL point to.',
        'TIP — to find the main idea: ask "what is this paragraph mostly about, in one sentence?"',
        'Sometimes the first sentence states the main idea directly (a TOPIC SENTENCE). But not always — sometimes you have to figure it out from the details.',
        'Test: a sentence is a SUPPORTING DETAIL if it gives evidence FOR the main idea. If a detail doesn\'t connect to the main idea, the main idea might be wrong.',
      ],
      vocabulary: [
        { term: 'topic', definition: 'what the paragraph is about — a word or short phrase.' },
        { term: 'main idea', definition: 'the most important thing the paragraph is saying about the topic.' },
        { term: 'supporting detail', definition: 'a fact or example that backs up the main idea.' },
      ],
      suggestedTools: ['show_text', 'show_concept_map'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-paragraph',
      kind: 'worked_example',
      problem: 'Read this paragraph: "Bees are very important to farmers. They fly from flower to flower, helping plants grow fruit. Without bees, many crops would not produce food. Some farmers even rent beehives to help their fields." Find the topic, main idea, and three details.',
      steps: [
        'TOPIC: bees. (One word — what it\'s about.)',
        'MAIN IDEA: bees are important to farmers. (Or: "Bees help farmers grow crops.")',
        'DETAILS: 1) bees fly between flowers helping plants grow fruit; 2) without bees many crops would fail; 3) some farmers rent beehives.',
        'CHECK: do all three details support the main idea? Yes — all describe HOW bees help farmers.',
      ],
      answer: 'Topic: bees. Main idea: bees are important to farmers.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: '"Tigers are powerful hunters. They have sharp teeth for biting. Their stripes help them hide in tall grass. They can leap over 20 feet to catch prey." What is the main idea?',
      expectedAnswer: 'Tigers are powerful hunters',
      responseFormat: 'free',
      hints: [
        'Look at all three details — what do they describe?',
        'They all show ways tigers are good at hunting.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-detail-as-main',
      kind: 'misconception_check',
      question: 'Reading the tiger paragraph, Sami says the main idea is "Tigers have sharp teeth." Right?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Picking the FIRST interesting fact as the main idea, instead of finding what all the details point to.',
          correctsTo: 'No — that\'s a SUPPORTING DETAIL. The other details (stripes for hiding, leaping for prey) aren\'t about teeth. They ALL point to "tigers are powerful hunters." The main idea has to be big enough to cover every detail.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Topic = what it\'s about (a noun). Main idea = what it\'s saying (a sentence).',
        'Main idea is the umbrella; details are what it covers.',
        'Test: if a detail doesn\'t support your main idea, your main idea might be wrong.',
        'Sometimes the main idea is the first sentence; sometimes you have to find it.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Look at a paragraph in your reading book. Find the topic, main idea, and three details. Do the details all support the main idea?',
      hint: 'If a detail doesn\'t fit, your main idea might need to be broader.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
