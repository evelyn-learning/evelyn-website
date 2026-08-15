/**
 * Grades K-2 ELA — Main Idea & Details.
 */

import type { LessonPlan } from '../types';

export const SEED_K2_ELA_MAIN_IDEA_DETAILS: LessonPlan = {
  id: 'evelyn.k2.ela.main-idea-details.v1',
  title: 'K-2 ELA — Main Idea & Details',
  curriculum: 'CCSS',
  grade: 'K-2',
  subject: 'ela',
  topic: 'k2-ela',
  locale: 'en',
  los: [
    {
      id: 'k2.ela.main-idea-details',
      description: 'Identify the main idea of a passage and the details that support it.',
      standard: 'CCSS.ELA-LITERACY.RI.1.2',
    },
  ],
  prerequisites: ['k2.ela.story-elements'],
  followUps: ['k2.ela.sequencing'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Finding the main idea is like finding the BIG question a passage answers.',
      script: 'Imagine a paragraph all about dogs — one sentence about their tails, one about their food, one about their tricks. The main idea? "Dogs are interesting pets." All the details point to the BIG idea. Today we drill how to find it.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-mainidea',
      kind: 'concept',
      goal: 'Main idea + supporting details + the umbrella picture.',
      keyIdeas: [
        'MAIN IDEA: the BIG point a passage is about. Usually one sentence.',
        'DETAILS: smaller pieces of information that SUPPORT the main idea.',
        'UMBRELLA PICTURE: the main idea is the umbrella; details are the raindrops it covers.',
        'TO FIND MAIN IDEA: ask "what is this passage MOSTLY about?" The main idea covers ALL the details, not just one.',
        'CHECK: does the main idea fit EVERY detail? If not, it\'s too narrow.',
        'COMMON LOCATIONS: main idea often shows up in the FIRST or LAST sentence (in informational texts).',
        'DETAIL TYPES: facts, examples, descriptions, names of things.',
        'PRACTICE: pick the main idea sentence from a paragraph; then list the details that support it.',
      ],
      vocabulary: [
        { term: 'main idea', definition: 'the most important point of a passage.' },
        { term: 'detail', definition: 'a piece of information that supports the main idea.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-mainidea',
      kind: 'worked_example',
      problem: 'Read this passage and find the main idea: "Bears live in many places. Some bears live in cold forests. Other bears live in hot jungles. Polar bears live in the icy Arctic. Bears can be found almost everywhere."',
      steps: [
        'Read all the sentences. They\'re all about bears and where they live.',
        'Look for a sentence that covers ALL the details: "Bears can be found almost everywhere" or "Bears live in many places".',
        'These are the BIG idea sentences — both express the main idea.',
        'DETAILS: cold forests, hot jungles, icy Arctic — examples of "many places".',
        'Main idea: bears live in many different places. Details: examples of those places.',
      ],
      answer: 'Main idea: "Bears live in many places." Details: cold forests, hot jungles, icy Arctic.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'What is the main idea of: "I love my dog. He plays fetch. He wags his tail. He sleeps next to me. He is my best friend."',
      expectedAnswer: 'Main idea: "I love my dog" or "My dog is my best friend." All the other sentences are DETAILS describing why.',
      responseFormat: 'free',
      hints: [
        'Which sentence is the BIG idea?',
        'The other sentences are EXAMPLES of why.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-detail-as-main',
      kind: 'misconception_check',
      question: 'For the bear passage above, a child says the main idea is "Polar bears live in the icy Arctic." Why is this wrong?',
      commonErrors: [
        {
          answer: 'Main idea = polar bears in Arctic',
          misconception: 'Picking a DETAIL as the main idea.',
          correctsTo: '"Polar bears live in the Arctic" is a DETAIL, not the main idea. It only covers ONE example. The main idea must cover ALL the bears mentioned. The detail is true but too narrow. Main idea = umbrella that covers ALL details, not just one.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Main idea = the big point.',
        'Details = supporting facts/examples.',
        'Main idea covers ALL the details, not just one.',
        'Often in the first or last sentence of informational texts.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How is finding the main idea like packing a suitcase?',
      hint: 'When packing, you decide on the trip first (main idea), then choose clothes that fit the trip (details). A beach trip → swimsuits and sunscreen. A ski trip → coat and boots. Same idea: decide the BIG topic, then collect details that fit. Reading is the same in reverse — see the details, then figure out what big topic they all fit under.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
