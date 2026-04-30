/**
 * AP Human Geography — Political geography.
 *
 * State, nation, nation-state. Borders, supranational organizations,
 * geopolitical theory.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_HUMAN_GEO_POLITICAL: LessonPlan = {
  id: 'evelyn.ap.human-geo.political.v1',
  title: 'Political geography: states, borders, supranational orgs',
  curriculum: 'NCSS',
  grade: '11',
  subject: 'ss',
  topic: 'human-geography',
  locale: 'en',
  los: [
    {
      id: 'aphumangeo.political',
      description: 'Distinguish state/nation/nation-state and analyze political borders and supranational organizations.',
      standard: 'AP-HUG-4',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Borders are political, not natural.',
      script: 'Borders feel permanent on maps. They\'re not — they\'re POLITICAL CHOICES. Many were drawn by 19th-century Europeans across continents they didn\'t live in. Today they shape who counts as a citizen, who pays which taxes, who fights which wars.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-pillars',
      kind: 'concept',
      goal: 'Definitions + border types + supranational orgs + geopolitical theories.',
      keyIdeas: [
        'STATE (or "country"): a political unit with defined borders, sovereignty, government, population. ~195 in the world today.',
        'NATION: a group sharing culture, language, history, identity. May or may not have a state. Kurds: ~30 million but no state. Palestinians: nation, contested state.',
        'NATION-STATE: a state that aligns with a single nation. Pure examples are rare (Iceland, Japan). Most states are multi-national.',
        'SOVEREIGNTY: a state\'s exclusive authority within its borders.',
        'BORDER TYPES:',
        '  GEOMETRIC (straight lines, often colonial-era — Africa, US-Canada Great Plains).',
        '  PHYSICAL / NATURAL (rivers, mountains — Pyrenees between Spain/France).',
        '  CULTURAL (along ethnic / religious lines — though this is rarely clean).',
        'BORDER DISPUTES: persistent — Kashmir, Israel-Palestine, Korean DMZ.',
        'SUPRANATIONAL ORGANIZATIONS: states pool sovereignty for shared goals.',
        '  UN: 193 members; peacekeeping, aid, conventions.',
        '  EU: 27 members; common market + currency (Eurozone).',
        '  NATO: military alliance, mutual defense.',
        '  WTO: trade rules.',
        '  Regional: ASEAN, African Union, Mercosur.',
        'CHOKEPOINTS: narrow shipping passages of strategic importance — Strait of Hormuz (oil), Suez (Asia-Europe trade), Panama Canal.',
        'GEOPOLITICAL THEORIES:',
        '  HEARTLAND (Mackinder, 1904): whoever controls Eastern Europe / Asia controls the world. Influenced Cold War strategy.',
        '  RIMLAND (Spykman): controlling the COASTS matters more — sea power and commerce.',
        'DEVOLUTION: power shifts FROM central state to regions (Scotland, Catalonia, Quebec). Sometimes leads to independence movements.',
      ],
      vocabulary: [
        { term: 'sovereignty', definition: 'a state\'s exclusive authority within its borders.' },
        { term: 'nation', definition: 'a cultural group sharing identity, may or may not have a state.' },
        { term: 'supranational organization', definition: 'a body of multiple states that share some sovereignty for joint goals.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-arbitrary',
      kind: 'worked_example',
      problem: 'Why are many African borders straight lines, and why is that a problem?',
      steps: [
        'Drawn by Europeans at the BERLIN CONFERENCE (1884-85) without African input.',
        'Borders cut across ETHNIC GROUPS, splitting some across multiple states; combining rivals into one.',
        'EXAMPLES: Hutus and Tutsis in Rwanda/Burundi/Congo; Kurds across Turkey/Iraq/Iran/Syria; Tuaregs across Mali/Niger/Algeria.',
        'PROBLEMS: civil wars (groups within a state with conflicting identities), refugee crises, weak national identity.',
        'CONSEQUENCES persist 60+ years after independence. Many post-colonial conflicts trace back to these arbitrary lines.',
      ],
      answer: 'colonial drawing without considering ethnic groups; persists as conflict driver',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'What is the difference between a NATION and a STATE?',
      expectedAnswer: 'state = political entity with borders + government; nation = cultural group with shared identity',
      responseFormat: 'free',
      hints: [
        'State is political; nation is cultural.',
        'You can have either without the other.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-state-eternal',
      kind: 'misconception_check',
      question: 'Are most modern states ancient — going back centuries?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating current borders as ancient.',
          correctsTo: 'Most current states are recent. Africa: most independence between 1957-1980. Eastern Europe: many states formed 1991. India + Pakistan: 1947. South Sudan: 2011. Borders that look "permanent" are usually 50-100 years old at most.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'State (political) ≠ nation (cultural). Nation-state combines both.',
        'Border types: geometric, physical, cultural.',
        'Supranational orgs (UN, EU, NATO) pool sovereignty for joint goals.',
        'Chokepoints (Hormuz, Suez, Panama) hold strategic importance.',
        'Many borders are colonial inventions, not natural.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is the EU considered a unique experiment in sovereignty?',
      hint: '27 sovereign states have given up SOME powers (currency, trade, some legal authority) to a supranational body. Goes much further than NATO or UN. Trade-off: economic gains and peace, vs democratic-deficit concerns. Brexit (2016) was the first major reversal.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
