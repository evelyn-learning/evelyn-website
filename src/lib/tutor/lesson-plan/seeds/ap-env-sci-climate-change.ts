/**
 * AP Environmental Science — Climate change.
 *
 * Greenhouse effect, evidence, impacts, mitigation, adaptation.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_ENV_SCI_CLIMATE_CHANGE: LessonPlan = {
  id: 'evelyn.ap.env-sci.climate-change.v1',
  title: 'Climate change: greenhouse effect, evidence, impacts',
  curriculum: 'NGSS',
  grade: '11',
  subject: 'sci',
  topic: 'environmental-science',
  locale: 'en',
  los: [
    {
      id: 'apenv.climate',
      description: 'Explain the greenhouse effect, evidence for human-caused climate change, and mitigation strategies.',
      standard: 'AP-ENV-9',
    },
  ],
  prerequisites: ['apenv.ecosystems'],
  followUps: [],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'The defining environmental issue of this century.',
      script: 'In the last 150 years, humans have raised atmospheric CO₂ by ~50%. Earth\'s average temperature has risen ~1.2°C. Glaciers retreat, oceans warm, weather extremes intensify. Climate change isn\'t a future concern — it\'s a present transformation we\'re living through.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-mechanism-evidence',
      kind: 'concept',
      goal: 'Greenhouse effect + evidence + impacts + responses.',
      keyIdeas: [
        'GREENHOUSE EFFECT: certain atmospheric gases (CO₂, CH₄, N₂O, water vapor) let visible sunlight in but ABSORB outgoing infrared, trapping heat. Without it, Earth would be ~−18°C (frozen). Natural greenhouse effect is GOOD; ENHANCED greenhouse effect (extra gases from burning fossil fuels) is the problem.',
        'KEY GASES + lifetimes (atmospheric): CO₂ (centuries), CH₄ (~12 years, but stronger per molecule), N₂O (~120 years), fluorinated gases (decades-millennia).',
        'EVIDENCE for human-caused warming:',
        '  Direct measurements: CO₂ from 280 ppm (pre-industrial) to ~420 ppm (2024).',
        '  Temperature records: ~1.2°C global warming since 1880.',
        '  Ice cores: 800,000-year CO₂ history, current levels unprecedented.',
        '  Isotopic signatures: extra CO₂ has the chemical fingerprint of fossil fuels (depleted in C-14).',
        '  Fingerprints: stratosphere COOLING while troposphere warms — exactly the pattern greenhouse warming predicts.',
        'IMPACTS: warming, sea level rise (thermal expansion + ice melt), more intense storms, droughts, wildfires, ocean acidification (CO₂ + water → carbonic acid; harms shells/coral), shifting species ranges, agricultural impacts.',
        'MITIGATION (reducing emissions): renewables, electric vehicles, energy efficiency, reforestation, carbon pricing, plant-based diets.',
        'ADAPTATION (living with changes that occur): seawalls, drought-resistant crops, AC infrastructure, retreating from coastal areas.',
        'Both needed — neither alone is enough.',
      ],
      vocabulary: [
        { term: 'greenhouse effect', definition: 'atmospheric gases trapping heat from outgoing radiation.' },
        { term: 'mitigation', definition: 'reducing emissions to limit climate change.' },
        { term: 'adaptation', definition: 'adjusting systems to cope with climate impacts already occurring.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-evidence',
      kind: 'worked_example',
      problem: 'How do scientists know that CURRENT warming is HUMAN-caused, not natural?',
      steps: [
        'Multiple lines of evidence converge.',
        '1) Timing: warming accelerated DURING industrialization, matching CO₂ rise.',
        '2) Isotopes: atmospheric CO₂ has the carbon-isotope signature of FOSSIL FUELS (depleted in C-14, low C-13).',
        '3) Stratospheric cooling: greenhouse warming predicts stratosphere COOLS while troposphere warms — observed.',
        '4) Solar output: actually slightly DECREASED over the warming period, ruling out the sun.',
        '5) Volcanism: insufficient to explain magnitude.',
        '6) Oceans: warming HEAT CONTENT has increased — natural variability would cause oscillations, not a one-way trend.',
        'IPCC reports synthesize thousands of studies. Scientific consensus: extremely likely (>95%) human-caused.',
      ],
      answer: 'multiple converging lines of evidence — isotopes, stratospheric cooling, ruling out sun and volcanos',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why does ocean acidification harm coral reefs?',
      expectedAnswer: 'CO₂ dissolves in water → carbonic acid → lower pH → harder for corals to build calcium carbonate skeletons',
      responseFormat: 'free',
      hints: [
        'Coral skeletons are calcium carbonate.',
        'Acid + calcium carbonate = breakdown.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-weather-vs-climate',
      kind: 'misconception_check',
      question: 'A cold winter day disproves climate change?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Confusing weather with climate.',
          correctsTo: 'No — WEATHER is the conditions today; CLIMATE is the long-term pattern. Climate change refers to AVERAGES over decades, globally. Cold snaps still happen; what changes is their frequency and intensity over time. A single hot day doesn\'t prove warming, and a cold day doesn\'t disprove it.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Greenhouse effect: gases trap heat. Natural is good; enhanced is problem.',
        'CO₂ from 280 to ~420 ppm in industrial era; ~1.2°C warming.',
        'Multiple evidence lines (isotopes, stratospheric cooling) confirm human cause.',
        'Impacts: sea-level rise, storms, droughts, ocean acidification.',
        'Need BOTH mitigation (cut emissions) AND adaptation (live with changes).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is methane sometimes called "natural gas" when it\'s a strong greenhouse gas?',
      hint: 'CH₄ is "natural" because it\'s naturally occurring (from livestock, swamps, leaking gas wells). 80x stronger per molecule than CO₂ over 20 years. Major sources: ranching, landfill, fossil fuel infrastructure leaks. Cutting methane is a fast climate lever.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
