/**
 * AP Human Geography — Agriculture and economic geography.
 *
 * Subsistence vs commercial agriculture, Green Revolution, land-use
 * patterns, von Thünen model.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_HUMAN_GEO_AGRICULTURE: LessonPlan = {
  id: 'evelyn.ap.human-geo.agriculture.v1',
  title: 'Agriculture and economic land use',
  curriculum: 'NCSS',
  grade: '11',
  subject: 'ss',
  topic: 'human-geography',
  locale: 'en',
  los: [
    {
      id: 'aphumangeo.agriculture',
      description: 'Distinguish agricultural systems and apply land-use models.',
      standard: 'AP-HUG-5',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 15,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Agriculture as the world-shaper.',
      script: 'About 26% of the world\'s workers farm. Agriculture isn\'t just food — it shapes settlement, trade, water use, and politics. Understanding farming systems is half of understanding human geography.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-systems-models',
      kind: 'concept',
      goal: 'Subsistence vs commercial + Green Revolution + land-use models.',
      keyIdeas: [
        'AGRICULTURAL REVOLUTIONS:',
        '  FIRST (~10,000 BCE): plant domestication. Hunter-gatherers → farmers. Founded civilization.',
        '  SECOND (1700s-1800s): mechanization, crop rotation. European yields tripled.',
        '  GREEN REVOLUTION (mid-20th C): high-yield seeds, fertilizers, irrigation. Saved billions from famine but created environmental costs.',
        'SUBSISTENCE AGRICULTURE: producing food for the family or local consumption. Common in low-income countries.',
        '  Types: shifting cultivation (slash-and-burn), pastoral nomadism, intensive subsistence (rice paddies in Asia).',
        'COMMERCIAL AGRICULTURE: producing for sale. Common in high-income countries.',
        '  Types: dairy, mixed crop and livestock, plantation, ranching, Mediterranean, market gardening.',
        'VON THÜNEN MODEL: predicts what crops grow at what distance from a market. Closer: dairy and intensive (perishable). Farther: ranching (ships easier). Still relevant for understanding land-use patterns.',
        'LAND-USE PATTERNS: rural vs urban, primary (extraction) vs secondary (manufacturing) vs tertiary (services) vs quaternary (information) sectors.',
        'AGRICULTURAL ISSUES: water shortages, soil degradation, monoculture vulnerability, climate change, food deserts.',
      ],
      vocabulary: [
        { term: 'subsistence agriculture', definition: 'farming for the family\'s own consumption.' },
        { term: 'commercial agriculture', definition: 'farming to sell products in a market.' },
        { term: 'Green Revolution', definition: 'mid-20th-century introduction of high-yield seeds, fertilizers, and irrigation that transformed global agriculture.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-green-rev',
      kind: 'worked_example',
      problem: 'How did the Green Revolution save billions but create environmental costs?',
      steps: [
        'BENEFITS: high-yield wheat and rice varieties (Norman Borlaug, ~1960s), synthetic fertilizers, irrigation, pesticides → yields TRIPLED in many regions.',
        'India and Mexico went from importing food to producing surplus.',
        'Estimates: 1 billion+ lives saved from famine over the decades.',
        'COSTS: heavy fertilizer use → groundwater pollution. Pesticides → biodiversity loss. Irrigation → aquifer depletion. Monoculture → vulnerability to pests and disease (Irish Potato Famine logic at scale).',
        'Income inequality grew within agricultural regions: large farms with capital benefited; smallholders without it lost out.',
        'Today: efforts toward "second Green Revolution" with sustainable practices, drought-tolerant seeds, precision agriculture.',
      ],
      answer: 'high-yield seeds + fertilizers tripled food production but caused environmental damage and inequality',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why does the von Thünen model predict DAIRY farming closer to cities than RANCHING?',
      expectedAnswer: 'milk is perishable; dairy needs to be near markets. Cattle can walk or be shipped.',
      responseFormat: 'free',
      hints: [
        'Some products spoil quickly.',
        'Other products are durable and can travel.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-subsistence-primitive',
      kind: 'misconception_check',
      question: 'Is subsistence agriculture "primitive" or backwards?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating subsistence farming as inferior.',
          correctsTo: 'No — it can be highly skilled and sustainable. Asian rice paddies have fed billions for thousands of years. Subsistence farmers often have deep ecological knowledge of their land. The system serves different needs (security, low capital) than commercial farming. Different, not lesser.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Three agricultural revolutions: domestication, mechanization, Green Revolution.',
        'Subsistence (for family) vs commercial (for sale).',
        'Green Revolution saved billions but caused environmental costs.',
        'Von Thünen: distance from market → land-use type.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How are vertical farming, GMO crops, and lab-grown meat shaping the next chapter of agriculture?',
      hint: 'Vertical farms grow crops indoors stacked floors high — closer to cities, less water. GMOs allow drought tolerance and pest resistance. Lab meat replicates animal protein without livestock. Each promises efficiency and ethics gains; each faces public-acceptance and cost barriers.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
