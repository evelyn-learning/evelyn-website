/**
 * Grades 3-5 Social Studies — Native American Cultures.
 */

import type { LessonPlan } from '../types';

export const SEED_G35_SS_NATIVE_AMERICAN: LessonPlan = {
  id: 'evelyn.g35.ss.native-american.v1',
  title: 'Grades 3-5 SS — Native American Cultures',
  curriculum: 'CCSS',
  grade: '3-5',
  subject: 'ss',
  topic: 'g35-ss',
  locale: 'en',
  los: [
    {
      id: 'g35.ss.native-american',
      description: 'Recognise the diversity of Native American peoples before European contact; identify regional cultures and their adaptations to environments.',
      standard: 'NCSS 3-5 Culture / People, Places',
    },
  ],
  prerequisites: [],
  followUps: ['g35.ss.european-exploration'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Native American peoples are NOT one group — hundreds of nations existed across North America before Europeans arrived.',
      script: 'When teachers say "Native Americans", they mean hundreds of distinct nations. The Lakota, Navajo, Cherokee, Iroquois, Inuit — each with their own language, government, food, and way of life. Today we drill that diversity.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-native',
      kind: 'concept',
      goal: 'Major culture regions + adaptations + ongoing presence.',
      keyIdeas: [
        'NORTH AMERICA before 1492 had MANY DIFFERENT Native nations — perhaps 500+ in what is now the US alone.',
        'Each nation had its own LANGUAGE, GOVERNMENT, and CULTURE.',
        'CULTURE REGIONS (a way to organise the diversity):',
        '1) NORTHEAST WOODLANDS: Iroquois, Algonquin. Lived in forests, hunted, farmed corn/beans/squash, built longhouses.',
        '2) SOUTHEAST: Cherokee, Choctaw, Seminole. Farming, mound-building, towns.',
        '3) GREAT PLAINS: Lakota, Cheyenne, Comanche. Bison hunters, tipis, horses (after 1500s).',
        '4) SOUTHWEST: Pueblo, Navajo, Hopi. Adobe houses, irrigation farming, weaving.',
        '5) NORTHWEST COAST: Tlingit, Haida. Fishing, totem poles, large cedar plank houses.',
        '6) ARCTIC: Inuit. Sea hunting, igloos in winter, dog sleds, kayaks.',
        'ADAPTATIONS: each region\'s lifestyle FIT the land\'s resources.',
        'NATIVE NATIONS STILL EXIST today as sovereign nations within the US — over 570 federally recognised tribes. Their cultures, languages, and people are NOT in the past.',
      ],
      vocabulary: [
        { term: 'culture region', definition: 'a geographic area whose peoples share similar ways of life.' },
        { term: 'sovereign nation', definition: 'a self-governing community recognised by other governments.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-region',
      kind: 'worked_example',
      problem: 'Why did Plains nations live in tipis while Northwest Coast nations lived in plank houses?',
      steps: [
        'PLAINS: large grasslands, few trees, BISON the main resource. Tipis are MOBILE (easy to take apart, carry, set up) — match a hunting lifestyle that follows herds.',
        'NORTHWEST COAST: dense forests, abundant cedar trees, salmon-rich rivers. Plank houses are LARGE and PERMANENT — match a settled lifestyle near rich fishing grounds.',
        'Conclusion: housing was an ADAPTATION to the environment and economy.',
      ],
      answer: 'Different environments → different lifestyles → different houses.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Inuit peoples lived in the Arctic. What are TWO adaptations they made for the cold?',
      expectedAnswer: 'Igloos (snow houses for winter), thick fur clothing (sealskin parkas), kayaks for sea hunting, dog sleds for transport, hunting seals and whales for food. Any two are good.',
      responseFormat: 'free',
      hints: [
        'Cold + snow + ocean = what tools and shelter help survive?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-uniform',
      kind: 'misconception_check',
      question: 'A child says "Native Americans all lived in tipis." Why is this wrong?',
      commonErrors: [
        {
          answer: 'All Native Americans lived in tipis',
          misconception: 'Treating the most-pictured Plains lifestyle as universal.',
          correctsTo: 'Tipis were a PLAINS adaptation. Other regions used: longhouses (Northeast Woodlands — Iroquois), adobe pueblos (Southwest), plank houses (Northwest Coast), igloos in winter (Arctic Inuit), wigwams (some Algonquin). Hundreds of nations had hundreds of housing styles. Native America was — and is — diverse.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Hundreds of distinct nations, each with own language and culture.',
        '6 main culture regions in North America.',
        'Lifestyle adapted to land + resources.',
        'Native nations still exist today as sovereign nations.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is it important to learn about Native nations even though we live "now"?',
      hint: 'Because they are still here — over 570 federally recognised tribes in the US, with vibrant communities, languages being preserved, cultural practices, and political sovereignty. Treating Native peoples as "history" erases their present. Understanding the past + present helps build respectful relationships and informed citizenship.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
