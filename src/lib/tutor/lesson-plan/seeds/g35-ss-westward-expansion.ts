/**
 * Grades 3-5 Social Studies — Westward Expansion.
 */

import type { LessonPlan } from '../types';

export const SEED_G35_SS_WESTWARD_EXPANSION: LessonPlan = {
  id: 'evelyn.g35.ss.westward-expansion.v1',
  title: 'Grades 3-5 SS — Westward Expansion',
  curriculum: 'CCSS',
  grade: '3-5',
  subject: 'ss',
  topic: 'g35-ss',
  locale: 'en',
  los: [
    {
      id: 'g35.ss.westward-expansion',
      description: 'Identify how the US grew from 13 colonies to a continental nation; recognise the costs to Native peoples.',
      standard: 'NCSS 3-5 Time, Continuity, Change',
    },
  ],
  prerequisites: ['g35.ss.constitution-intro'],
  followUps: ['g35.ss.civil-war-overview'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'In 100 years, the US grew from 13 small colonies to a country reaching the Pacific Ocean.',
      script: 'In 1783, the US ended at the Mississippi River. By 1853, it stretched to the Pacific. How? Major land deals, wars, and pioneers moving west. But westward expansion came with HUGE costs to Native nations whose lands were taken. Today we drill both sides.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-westward',
      kind: 'concept',
      goal: 'Major land additions + driving forces + impact.',
      keyIdeas: [
        'STARTING SIZE: at independence (1783), US territory ended at the Mississippi River.',
        '1) LOUISIANA PURCHASE (1803): bought from France for $15 million. Doubled the size of the US.',
        'LEWIS AND CLARK EXPEDITION (1804-1806): explored the new territory; mapped the route to the Pacific.',
        '2) ANNEXATION OF TEXAS (1845): Texas joined the US after winning independence from Mexico.',
        '3) OREGON TREATY (1846): set border with British Canada at the 49th parallel.',
        '4) MEXICAN-AMERICAN WAR (1846-1848): US won; took California, New Mexico, Arizona, Utah, Nevada, parts of Colorado/Wyoming.',
        '5) GADSDEN PURCHASE (1853): bought small strip from Mexico for railroad route.',
        '"MANIFEST DESTINY": the belief that the US was destined to expand from coast to coast. Used to justify expansion.',
        'PIONEERS travelled west on the Oregon Trail, California Trail, and others — covered wagons, hardships, weather, sickness.',
        'CALIFORNIA GOLD RUSH (1849): gold discovered, hundreds of thousands rushed west.',
        'COSTS TO NATIVE NATIONS: forced removals (e.g. Trail of Tears, 1838), broken treaties, loss of land, deaths, destruction of cultures.',
        'INDIAN REMOVAL ACT (1830): forced Cherokee, Creek, and other Southeast nations off their lands.',
        'TWO TRUTHS at once: westward expansion was the story of US growth AND a story of devastating loss for Native peoples.',
      ],
      vocabulary: [
        { term: 'Manifest Destiny', definition: 'the 19th-century belief that the US should expand across the continent.' },
        { term: 'pioneer', definition: 'a settler who travelled to a new region (often westward).' },
        { term: 'Trail of Tears', definition: 'the forced removal of Cherokee and other Southeast Native nations to lands west of the Mississippi (1838).' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-louisiana',
      kind: 'worked_example',
      problem: 'How did the Louisiana Purchase change the US?',
      steps: [
        'In 1803, US bought the Louisiana Territory from France for $15 million (about 4 cents per acre).',
        'It DOUBLED the size of the US — added 828,000 square miles.',
        'Included land that became 15 future states (Louisiana, Arkansas, Missouri, Iowa, Minnesota, North Dakota, South Dakota, Nebraska, Kansas, Oklahoma, parts of others).',
        'Opened the way for further westward exploration and settlement.',
        'IMPACT on Native peoples: many nations already lived on this land — the US claim ignored their sovereignty and led to displacement.',
      ],
      answer: 'Doubled US size; opened the West; began the squeeze on Native nations.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'What was the Trail of Tears?',
      expectedAnswer: 'The forced relocation of the Cherokee Nation (and other Southeast nations) by the US government, beginning in 1838. Thousands died on the journey from the Southeast US to "Indian Territory" (now Oklahoma).',
      responseFormat: 'free',
      hints: [
        'It happened because of the Indian Removal Act.',
        'Affected Cherokee, Creek, others.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-only-positive',
      kind: 'misconception_check',
      question: 'A textbook says "westward expansion was a great achievement". What\'s missing?',
      commonErrors: [
        {
          answer: 'Westward expansion was just great',
          misconception: 'Treating expansion only from the settlers\' perspective.',
          correctsTo: 'Expansion was achievement for the US AND devastating loss for Native nations who lost lands, lives, and cultural sovereignty. Honest history holds BOTH: settlers built farms and railroads while Native peoples were forced from ancestral homes. Strong students learn to hold multiple perspectives, especially when one party gained and another lost.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '1803 Louisiana Purchase doubled US size.',
        '1845-1853 added Texas, Oregon, Mexican Cession, Gadsden.',
        '"Manifest Destiny" justified expansion.',
        'Pioneers, gold rush, railroads drove settlement.',
        'Native nations forced off lands; Trail of Tears 1838.',
        'Hold both stories — growth AND loss.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How did the railroad change westward expansion?',
      hint: 'The TRANSCONTINENTAL RAILROAD (completed 1869) connected East and West coasts. A trip that took MONTHS by wagon now took DAYS by train. Settlement accelerated. Goods moved fast. But it also accelerated the loss of bison (key to Plains Native life) and made it easier for the US Army to project power into the West. Technology rewires history.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
