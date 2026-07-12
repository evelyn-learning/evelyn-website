/**
 * AP World History — Unit 9 CED 9.6-9.7: Population, Disease, and the
 * Environment.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apworld.environment-disease.v1`. Covers the demographic
 * transition, the century's major epidemics, climate change as measured
 * scientific consensus, and uneven life-expectancy gains.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APWORLD_U9_ENVIRONMENT_DISEASE: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apworld.environment-disease.v1',
  course: 'AP World History',
  cedUnit: 9,
  cedTopic: '9.6-9.7',
  cedTitle: 'Population, Disease, and the Environment',
  planId: 'evelyn.ap.apworld.environment-disease.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-12',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apworld.environment-disease.v1' }],
  theory: [
    {
      loId: 'apworld.environment-disease',
      kind: 'definition',
      title: 'the demographic transition',
      content:
        "As death rates fall (better nutrition, sanitation, medicine) before birth rates fall in response, population grows rapidly for a period; birth rates eventually fall too as families adjust to lower child mortality, and growth slows. Most regions moved through some version of this over the 20th century, at different times/speeds.",
    },
    {
      loId: 'apworld.environment-disease',
      kind: 'event',
      title: 'the 1918 influenza pandemic',
      content:
        'Beginning in 1918 and worsened by troop movements late in WWI, this pandemic killed an estimated tens of millions worldwide within about two years — among the deadliest disease events in recorded history, before effective antiviral treatment or a vaccine existed.',
    },
    {
      loId: 'apworld.environment-disease',
      kind: 'event',
      title: 'HIV/AIDS (from 1981)',
      content:
        'First clinically recognized in 1981, HIV/AIDS spread globally over following decades, causing tens of millions of deaths with the heaviest documented toll in parts of sub-Saharan Africa. Effective antiretroviral treatment from the mid-1990s transformed it into a manageable chronic condition for patients with treatment access — access itself remained globally uneven.',
    },
    {
      loId: 'apworld.environment-disease',
      kind: 'event',
      title: 'COVID-19 (from 2020)',
      content:
        'A novel coronavirus identified in late 2019 spread globally by early 2020, prompting lockdowns, travel restrictions, and rapid vaccine development. It caused a temporary decline in global life-expectancy figures, showing how quickly a pathogen could move through an interconnected, mobile world.',
    },
    {
      loId: 'apworld.environment-disease',
      kind: 'framework',
      title: 'climate change: measured consensus, uneven response',
      content:
        'Scientific consensus, built over decades of measurement, holds that human greenhouse-gas emissions are warming the global climate. The Montreal Protocol (1987, ozone-depleting chemicals) is widely regarded as a successful coordinated response; the Kyoto Protocol (1997) and Paris Agreement (2015), aimed at carbon emissions, have made slower, more contested progress given the larger economic stakes.',
    },
    {
      loId: 'apworld.environment-disease',
      kind: 'event',
      title: 'water scarcity and deforestation',
      content:
        'Rising population and economic growth increased demand for fresh water and agricultural/timber land, contributing to water scarcity in parts of the world and large-scale deforestation (Amazon basin, parts of Southeast Asia), affecting biodiversity and greenhouse-gas balance.',
    },
    {
      loId: 'apworld.environment-disease',
      kind: 'event',
      title: 'life expectancy 1950-2019 (world + regions)',
      content:
        'World: 46 -> 73 (+27). Africa: 37 -> 62 (+25). Asia: 42 -> 74 (+32, the largest gain — Asia started above Africa but below the world/Europe in 1950, and by 2019 exceeded both the world figure and Africa). Europe: 62 -> 79 (+17, the smallest gain, from an already-high 1950 starting point).',
    },
    {
      loId: 'apworld.environment-disease',
      kind: 'trap',
      title: 'gains and gaps together',
      content:
        'Global life expectancy rose substantially, but unevenly: Asia\'s large gain narrowed (without closing) the gap with Europe, while Africa\'s smaller gain left it furthest behind in 2019 despite real improvement. Epidemics and climate/environmental pressures created new, unevenly distributed risks even as overall outcomes improved.',
    },
  ],
  methods: [
    {
      title: 'Read a life-expectancy (or similar demographic) data table for the largest gain AND its starting-point context',
      when_to_use:
        'Use this before concluding "which region improved most" from a before/after table — the raw gain and the 1950 starting position both matter.',
      steps: [
        'IDENTIFY THE REGION WITH THE LARGEST NUMERICAL GAIN.',
        "IDENTIFY THAT REGION'S STARTING POSITION relative to the others (lowest? middling? highest?).",
        'CONNECT THE GAIN TO THE STARTING POSITION: did it narrow a gap, or did a lower-starting region actually fall further behind?',
        'STATE BOTH THE CONVERGENCE AND THE PERSISTENT GAP explicitly — avoid a one-sided "everything improved evenly" conclusion.',
      ],
      example: {
        problem:
          'Asia gained the most (+32, 42->74); Africa gained less (+25, 37->62) from a lower starting point. What does this show?',
        solution:
          'Asia\'s large gain narrowed the gap with Europe (79 in 2019) without closing it. Africa, starting lowest in 1950, gained fewer years than Asia and remained furthest behind in 2019 — real convergence in one place, a persistent gap in another.',
      },
      relatedLoIds: ['apworld.environment-disease'],
    },
  ],
  pointers: [
    { content: 'Global health did NOT only improve — 1918 flu, HIV/AIDS (1981), and COVID-19 (2020) were major setbacks/new threats within the same century life expectancy rose. This is the #1 tested misconception for this topic.', kind: 'trap' },
    { content: 'Montreal Protocol (1987, ozone, succeeded) vs. Kyoto (1997)/Paris (2015) (carbon, slower progress) — don\'t treat all international environmental agreements as equally successful.', kind: 'tip' },
    { content: 'Asia had the LARGEST life-expectancy gain (1950-2019), not the highest 2019 level (that\'s Europe) — read "largest gain" and "highest level" as different questions.', kind: 'gotcha' },
    { content: 'HIV/AIDS treatment access remained globally uneven even after effective antiretrovirals existed (mid-1990s) — a good example for "gains and gaps together" prompts.', kind: 'frq-vocab' },
    { content: 'Climate change is presented as measured scientific consensus in this course, not a partisan debate — focus FRQ answers on documented causes/responses (Montreal, Kyoto, Paris), not on contesting the science itself.', kind: 'tip' },
  ],
};
