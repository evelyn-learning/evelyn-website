/**
 * AP Human Geography — Urban geography.
 *
 * Models of city structure, urbanization, suburban sprawl, gentrification.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_HUMAN_GEO_URBAN: LessonPlan = {
  id: 'evelyn.ap.human-geo.urban.v1',
  title: 'Urban geography: city models, sprawl, gentrification',
  curriculum: 'NCSS',
  grade: '11',
  subject: 'ss',
  topic: 'human-geography',
  locale: 'en',
  los: [
    {
      id: 'aphumangeo.urban',
      description: 'Apply urban-structure models and analyze contemporary urban issues.',
      standard: 'AP-HUG-6',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Cities house most of humanity now.',
      script: 'In 2007, for the first time, more than half of humans lived in cities. Today it\'s ~57% and growing. By 2050, ~68%. Understanding cities is understanding where humanity is going.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-models-issues',
      kind: 'concept',
      goal: 'Three city models + urbanization + sprawl + gentrification.',
      keyIdeas: [
        'CITY STRUCTURE MODELS:',
        '  CONCENTRIC ZONE (Burgess, 1925): rings around a central business district (CBD). CBD → factories → working-class → middle-class → commuter zone. Based on early-20th-century Chicago.',
        '  SECTOR MODEL (Hoyt, 1939): zones extend outward as PIE SLICES along transportation corridors. Captures wedge-shaped neighborhood growth.',
        '  MULTIPLE NUCLEI (Harris & Ullman, 1945): cities have several centers (downtown + airport + university + ports). Better fits modern cities.',
        'URBANIZATION: shift from rural to urban populations. Driven by industrialization, agricultural mechanization (less farm labor needed), economic opportunity.',
        'SUBURBANIZATION (1950s onward, esp US): middle-class moves out of cities to suburbs. Enabled by cars, highways, GI Bill mortgages. Created SPRAWL — low-density, car-dependent development.',
        'GENTRIFICATION: middle/upper-class moves INTO low-income urban neighborhoods, raising property values and displacing original residents. Brings investment AND inequality.',
        'CITIES IN DEVELOPING WORLD: rapid growth, often without infrastructure → SQUATTER SETTLEMENTS / favelas. Megacities (10M+) increasingly in developing countries (Lagos, Karachi, Manila).',
        'PRIMATE CITY: a country\'s largest city is disproportionately bigger than the second (Bangkok in Thailand, Paris in France). Concentrates economic and political power.',
      ],
      vocabulary: [
        { term: 'urbanization', definition: 'shift of population from rural to urban areas.' },
        { term: 'sprawl', definition: 'low-density, car-dependent suburban development.' },
        { term: 'gentrification', definition: 'redevelopment of urban neighborhoods raising prices and displacing existing residents.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-suburbanization',
      kind: 'worked_example',
      problem: 'Why did US cities lose middle-class residents in the 1950s-70s?',
      steps: [
        'POST-WWII expansion: GI Bill made mortgages available to veterans. Federal highway program (1956) made commuting feasible.',
        'CARS: mass-produced and affordable. Suburbs depended on car ownership.',
        'WHITE FLIGHT: many white middle-class families moved out as cities became more diverse — fueled by racial bias and discriminatory housing practices (redlining).',
        'TAX BASE EROSION: as middle class left, city tax revenue fell. Schools, services declined. Vicious cycle.',
        'RESULT: car-dependent suburbs surrounded "hollowed-out" cities by 1980. Some cities (Detroit) never recovered; others (NYC, LA) eventually did via gentrification.',
      ],
      answer: 'cars + highways + GI Bill + white flight + tax-base erosion',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Gentrification raises property values. Why is it controversial despite this seeming good?',
      expectedAnswer: 'displaces low-income original residents who can no longer afford rent or property tax',
      responseFormat: 'free',
      hints: [
        'Higher prices help OWNERS but hurt RENTERS.',
        'Cultural displacement matters too.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-cities-decline',
      kind: 'misconception_check',
      question: 'Are cities universally declining around the world?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Generalizing US Rust Belt patterns globally.',
          correctsTo: 'No — globally, urbanization is ACCELERATING. African and Asian cities are growing rapidly. Some US cities (Detroit, Cleveland) have declined; others (Austin, Phoenix) boomed. The TREND globally is more urbanization, not less.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'City models: concentric, sector, multiple-nuclei.',
        'Suburbanization (1950s-) created sprawl, hollowed cities.',
        'Gentrification raises prices, displaces residents.',
        'Megacities increasingly in developing world.',
        'Urbanization is a global trend.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How might remote work (post-2020) change urban geography?',
      hint: 'Some workers leave expensive cities for cheaper places (Boise, Austin booms). Office vacancy in CBDs. But many move BACK to dense cities for amenities. Net effect still uncertain — possibly more decentralization, possibly hubs becoming MORE concentrated for in-person collaboration.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
