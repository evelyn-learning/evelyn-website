/**
 * G8 — Westward expansion and Manifest Destiny.
 *
 * Louisiana Purchase, Lewis & Clark, Trail of Tears, Manifest
 * Destiny, Mexican-American War, Gold Rush, transcontinental
 * railroad. Honest take on Indigenous displacement.
 */

import type { LessonPlan } from '../types';

export const SEED_G8_SS_WESTWARD_EXPANSION: LessonPlan = {
  id: 'evelyn.g8.ss.us-history.westward-expansion.v1',
  title: 'Westward expansion and Manifest Destiny',
  curriculum: 'NCSS',
  grade: '8',
  subject: 'ss',
  topic: 'us-history',
  locale: 'en',
  los: [
    {
      id: 'ncss.68.history.westward-expansion',
      description: 'Explain the causes and consequences of US westward expansion in the 19th century.',
      standard: 'NCSS.D2.His.14.6-8',
    },
  ],
  prerequisites: ['ncss.68.history.american-revolution'],
  followUps: ['ncss.68.history.civil-war'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the era as huge gains for the US, devastating losses for Indigenous peoples.',
      script: 'In 1803, the US doubled in size with one signature. By 1850 it stretched from Atlantic to Pacific. But the land "added" wasn\'t empty — millions of Indigenous people lived there, and most were forced off.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-key-events',
      kind: 'concept',
      goal: 'Six pivotal moments in westward expansion.',
      keyIdeas: [
        'LOUISIANA PURCHASE (1803): Jefferson bought 828,000 sq miles from Napoleon for $15 million (about 4¢ per acre). Doubled the country.',
        'LEWIS AND CLARK EXPEDITION (1804-1806): explored the new territory. Sacagawea, a Shoshone woman, helped translate and guide. Mapped routes to the Pacific.',
        'INDIAN REMOVAL ACT (1830) + TRAIL OF TEARS (1838): Andrew Jackson signed law forcing Cherokee, Creek, Choctaw, Chickasaw, Seminole nations from their southeastern homelands. ~4,000 Cherokee died on the march to Oklahoma.',
        'MANIFEST DESTINY (1840s): the belief that America had a divine right and duty to expand "from sea to shining sea". Used to justify conquest.',
        'MEXICAN-AMERICAN WAR (1846-48): US provoked war with Mexico, won, took Texas, California, New Mexico, Arizona, Nevada, Utah, parts of Colorado. About a third of US territory came from Mexico.',
        'CALIFORNIA GOLD RUSH (1849): gold found at Sutter\'s Mill brought 300,000 people to California in one year. Drove statehood, displacement, and ecological damage.',
        'TRANSCONTINENTAL RAILROAD (1869): connected East and West coasts. Built largely by Chinese immigrant laborers and Irish workers in brutal conditions.',
      ],
      vocabulary: [
        { term: 'Manifest Destiny', definition: 'the 19th-century belief that the US was destined to expand across the continent.' },
        { term: 'annex', definition: 'to add new territory to an existing country.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-trail-of-tears',
      kind: 'worked_example',
      problem: 'Why is the Trail of Tears one of the most controversial events in US history?',
      steps: [
        'The Cherokee Nation had assimilated heavily — wrote their own constitution, ran schools, published a newspaper. They WON a Supreme Court case (Worcester v. Georgia, 1832) declaring removal illegal.',
        'President Andrew Jackson IGNORED the Court and ordered removal anyway, reportedly saying "John Marshall has made his decision; now let him enforce it."',
        'The army forced 16,000 Cherokee on a 1,200-mile march to Oklahoma in winter conditions. About 4,000 died from cold, disease, exhaustion.',
        'CONTROVERSY: shows the federal government openly defying the Supreme Court. Shows democratic majority overrunning legal protections for a minority. Set a precedent for further removals (Dakota, Apache, Nez Perce).',
        'Today: Cherokee Nation continues in Oklahoma; the Trail of Tears is memorialized as a federal historic trail.',
      ],
      answer: 'federal government defied Supreme Court and forced 16,000 Cherokee on a deadly march; ~4,000 died',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In the Mexican-American War (1846-1848), what general region did the US take from Mexico?',
      expectedAnswer: 'the Southwest (CA, AZ, NM, etc.)',
      responseFormat: 'free',
      hints: [
        'It includes the largest US state by area today.',
        'States like California, Arizona, New Mexico, Nevada, Utah were all part of Mexico before this war.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-empty-land',
      kind: 'misconception_check',
      question: 'Was the western US "empty" land before settlers arrived?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Believing the West was uninhabited.',
          correctsTo: 'No — it was home to dozens of Indigenous nations: Lakota, Cheyenne, Apache, Navajo, Nez Perce, Pueblo peoples, and more — totaling millions. "Westward expansion" was westward DISPLACEMENT for them.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Louisiana Purchase doubled the US.',
        'Manifest Destiny justified expansion as divine right.',
        'Mexican-American War took the Southwest.',
        'Trail of Tears: federal government defied Supreme Court, killed 4,000 Cherokee.',
        'The "empty West" myth erases millions of Indigenous people displaced.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How did the Gold Rush change California demographically and ecologically in just a few years?',
      hint: 'Population went from 14,000 non-Indigenous people to 300,000 in two years. Indigenous population was decimated. Hydraulic mining destroyed rivers. Statehood came in 1850 — only two years after gold was discovered.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
