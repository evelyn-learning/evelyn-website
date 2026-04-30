/**
 * AP Environmental Science — Pollution and waste.
 *
 * Air pollution, water pollution, solid waste, e-waste. Sources,
 * impacts, regulation.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_ENV_SCI_POLLUTION: LessonPlan = {
  id: 'evelyn.ap.env-sci.pollution.v1',
  title: 'Pollution: air, water, and waste',
  curriculum: 'NGSS',
  grade: '11',
  subject: 'sci',
  topic: 'environmental-science',
  locale: 'en',
  los: [
    {
      id: 'apenv.pollution',
      description: 'Identify sources and impacts of pollution and analyze regulatory responses.',
      standard: 'AP-ENV-7',
    },
  ],
  prerequisites: ['apenv.ecosystems'],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Pollution as silent killer.',
      script: 'Air pollution kills ~7 million people each year — more than war or AIDS. Water pollution sickens millions. Plastic permeates everything from arctic snow to bloodstream. Pollution isn\'t just an environmental issue; it\'s a public-health emergency.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-types',
      kind: 'concept',
      goal: 'Air, water, solid, e-waste + regulation.',
      keyIdeas: [
        'AIR POLLUTION:',
        '  PRIMARY: emitted directly. Particulate matter (PM2.5), CO, SO₂, NOₓ, VOCs.',
        '  SECONDARY: forms in atmosphere from primary + reactions. Ground-level OZONE (smog), acid rain (SO₂ + NOₓ → sulfuric/nitric acid).',
        '  Sources: vehicles, power plants, industry, wildfires.',
        '  Impacts: respiratory disease, heart disease, cancer.',
        '  Clean Air Act (1970, US): set standards. PM2.5 down ~40% since 1990.',
        'WATER POLLUTION:',
        '  POINT source: identifiable single source (factory pipe, sewage outflow). Easier to regulate.',
        '  NON-POINT: diffuse (agricultural runoff, urban stormwater). Harder.',
        '  Major issues: nutrient pollution → eutrophication; pathogen contamination; heavy metals (mercury, lead); thermal pollution; oil spills.',
        '  Clean Water Act (1972): sets discharge standards.',
        'SOLID WASTE: ~5 lbs/person/day in US.',
        '  Landfills, incineration, recycling, composting.',
        '  PLASTIC: ~8 million tons enter oceans yearly. Microplastics in food chain. Most plastics not effectively recycled.',
        'E-WASTE: discarded electronics. Contains lead, mercury, cadmium. Often shipped to developing countries for crude dismantling — toxic exposure to workers.',
        'CIRCULAR ECONOMY: design for reuse, recycling, durability — minimize waste at the source.',
      ],
      vocabulary: [
        { term: 'point source pollution', definition: 'pollution from an identifiable single source.' },
        { term: 'non-point source pollution', definition: 'pollution from diffuse sources (runoff).' },
        { term: 'particulate matter', definition: 'tiny airborne particles; PM2.5 is small enough to enter lungs and bloodstream.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-acid-rain',
      kind: 'worked_example',
      problem: 'How does acid rain form, and how does it harm ecosystems?',
      steps: [
        'Coal-burning power plants release SO₂. Vehicles release NOₓ.',
        'In atmosphere, these react with water: SO₂ + H₂O + O₂ → H₂SO₄ (sulfuric acid). NOₓ → HNO₃ (nitric acid).',
        'Returns to earth as RAIN (or snow, fog) with low pH (~4 vs normal 5.6).',
        'Acidifies lakes — fish populations decline (eggs and larvae sensitive).',
        'Damages forests — leaches nutrients from soil, weakens trees.',
        'Erodes statues and buildings (calcium carbonate dissolves in acid).',
        'US Acid Rain Program (1990 amendments to CAA) cut SO₂ emissions ~80% via cap-and-trade. Eastern lakes recovering.',
      ],
      answer: 'SO₂ + NOₓ → sulfuric/nitric acids → harms aquatic life, forests, structures',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why is non-point source pollution harder to regulate than point source?',
      expectedAnswer: 'no single identifiable source; diffuse origins; can\'t fine "the runoff"',
      responseFormat: 'free',
      hints: [
        'Point source = pipe with owner — easy to monitor.',
        'Non-point = millions of lawns, fields, roads — no single party to enforce against.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-recycling-perfect',
      kind: 'misconception_check',
      question: 'If a plastic item is in the recycling bin, is it definitely getting recycled?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Trusting the bin.',
          correctsTo: 'Often NO. Most plastic recycled abroad. Only ~9% of plastic ever produced has been recycled. Many plastics labeled recyclable aren\'t economically recyclable. The "recycling triangle" with a number is a RESIN code, not a recycling guarantee. Reduce > reuse > recycle in priority.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Air pollution: PM, ozone, acid rain — millions of deaths/year.',
        'Point vs non-point sources have different regulation.',
        'Plastic is a major and growing global problem.',
        'E-waste contains toxic metals.',
        'Reduce > reuse > recycle.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why has indoor air pollution killed more people in poor countries than outdoor pollution in rich ones, until recently?',
      hint: 'Cooking with biomass (wood, dung) in poorly ventilated homes — particulate matter and CO. Mostly affects women and children. Cleaner cookstoves and electric/gas access are reducing this. WHO estimates ~3.2 million deaths/year still attributable.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
