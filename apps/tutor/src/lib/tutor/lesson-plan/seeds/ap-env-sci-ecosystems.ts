/**
 * AP Environmental Science — Ecosystems and biogeochemical cycles.
 *
 * Energy flow, carbon cycle, nitrogen cycle, water cycle, ecosystem
 * services.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_ENV_SCI_ECOSYSTEMS: LessonPlan = {
  id: 'evelyn.ap.env-sci.ecosystems-cycles.v1',
  title: 'Ecosystems and biogeochemical cycles',
  curriculum: 'NGSS',
  grade: '11',
  subject: 'sci',
  topic: 'environmental-science',
  locale: 'en',
  los: [
    {
      id: 'apenv.ecosystems',
      description: 'Trace matter and energy through ecosystems and major biogeochemical cycles.',
      standard: 'AP-ENV-1',
    },
  ],
  prerequisites: [],
  followUps: ['apenv.populations'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame Earth as one big interconnected machine.',
      script: 'The carbon in your breakfast might have been in a dinosaur. The nitrogen in your hair might have been in a thunderstorm. Earth\'s elements cycle endlessly through living and non-living systems. Understanding those cycles is understanding how Earth works.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-cycles',
      kind: 'concept',
      goal: 'Energy flow + carbon, nitrogen, phosphorus, water cycles.',
      keyIdeas: [
        'ENERGY flows ONE-WAY through ecosystems: sun → producers → consumers → decomposers. Lost as heat at each step (10% rule).',
        'MATTER (carbon, nitrogen, water, phosphorus) CYCLES — same atoms reused indefinitely.',
        'CARBON CYCLE: photosynthesis FIXES atmospheric CO₂ into organic matter. Respiration, decay, and combustion RELEASE it back. Fossil fuel burning shifts long-stored carbon into atmosphere → climate change.',
        'NITROGEN CYCLE: 78% of atmosphere is N₂ but most life can\'t use it directly. Nitrogen-fixing bacteria (in soil, root nodules) convert N₂ to ammonia. Plants take up nitrates. Denitrifying bacteria return N₂ to atmosphere. Synthetic fertilizer (Haber-Bosch) shortcuts this — ENORMOUS impact on agriculture and ecosystems.',
        'PHOSPHORUS CYCLE: no atmospheric phase. Cycles between rocks, soil, water, organisms via weathering. Often the LIMITING NUTRIENT in lakes — fertilizer runoff → algal blooms → eutrophication.',
        'WATER CYCLE: evaporation → condensation → precipitation → runoff/groundwater. Powered by the sun.',
        'ECOSYSTEM SERVICES: free benefits humans get — pollination, water purification, soil formation, carbon sequestration, recreation. Estimated economic value: trillions of dollars per year globally.',
        'HUMAN DISRUPTIONS: deforestation (carbon), fertilizer (nitrogen), dams (water), urban impervious surfaces (runoff).',
      ],
      vocabulary: [
        { term: 'biogeochemical cycle', definition: 'the movement of an element through living and non-living parts of Earth.' },
        { term: 'eutrophication', definition: 'excess nutrients (often P) cause algal blooms; algae die, decomposition depletes O₂, fish die.' },
        { term: 'ecosystem services', definition: 'benefits ecosystems provide to humans without charge.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-eutrophication',
      kind: 'worked_example',
      problem: 'Walk through how lawn fertilizer can cause a lake to become a "dead zone".',
      steps: [
        'Fertilizer contains phosphorus and nitrogen.',
        'Rain washes excess fertilizer off lawns into storm drains → streams → lake.',
        'Phosphorus (often LIMITING in lakes) feeds explosive algal growth — an algal bloom.',
        'Algae die and sink. Decomposers consume oxygen breaking them down.',
        'O₂ in lower layers crashes. Fish suffocate. Dead zone.',
        'Visible: green scum on surface, fish kills, foul smell.',
        'Mitigation: phosphorus-free fertilizers, runoff buffers, wastewater treatment.',
      ],
      answer: 'P runoff → algal bloom → decomposition → O₂ depletion → dead zone',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why does deforestation increase atmospheric CO₂ in TWO ways?',
      expectedAnswer: 'releases stored carbon (burning/decay) AND removes future carbon-fixing capacity (fewer trees to photosynthesize)',
      responseFormat: 'free',
      hints: [
        'Trees STORE carbon and ABSORB carbon.',
        'Cutting them ends both functions.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-cycles-natural',
      kind: 'misconception_check',
      question: 'If carbon cycles naturally between atmosphere and ecosystems, how can humans be changing the climate?',
      commonErrors: [
        {
          answer: 'no problem',
          misconception: 'Treating natural cycling as buffering all human impacts.',
          correctsTo: 'Natural cycling has been ROUGHLY in balance over millennia. Burning fossil fuels releases carbon stored over hundreds of millions of years in just a few centuries. The natural cycles can\'t absorb the input fast enough → atmospheric CO₂ rises → temperature rises. Humans changed the FLUX rate, not the cycle\'s existence.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Energy flows one-way; matter cycles.',
        'Carbon: photosynthesis vs respiration/decay/burning.',
        'Nitrogen: bacterial fixation; Haber-Bosch is artificial shortcut.',
        'Phosphorus: limiting nutrient in lakes; runoff causes eutrophication.',
        'Ecosystem services are economically valuable but unpriced.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is the Haber-Bosch process called "the most important invention of the 20th century" by some historians?',
      hint: 'Synthesizes ammonia (NH₃) from atmospheric N₂. Enabled mass production of fertilizers. Doubled global food output and supported population from 2 billion to 8 billion. Without it, billions could not be fed. Also contributes to nitrogen-cycle pollution.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
