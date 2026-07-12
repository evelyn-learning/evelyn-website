/**
 * AP World History: Modern — CED Unit 9.6-9.7: Population, Disease, and the
 * Environment in the Age of Globalization.
 *
 * Follows the Unit-2 Vertical Slice's gold template (see
 * ap-apworld-u2-silk-roads.ts for the full rationale). Third stop in Unit 9:
 * the demographic transition, the century's major epidemics (1918
 * influenza, HIV/AIDS, COVID-19), and climate change as a measured
 * scientific consensus with uneven international responses (the Montreal
 * Protocol's relative success against slower progress on carbon emissions).
 *
 * Anchor text: a described data table of world and regional life expectancy
 * at birth, 1950 and 2019 — evelyn.passage.apworld-life-expectancy-table.v1
 * — wired in the concept segment as quantitative evidence of the century's
 * uneven health gains, and re-examined closely in the worked example.
 *
 * Climate change is presented as measured scientific consensus plus
 * documented international responses, not a partisan debate; epidemics are
 * presented factually without graphic detail, per the exam-neutral-tone
 * discipline.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U9_ENVIRONMENT_DISEASE: LessonPlan = {
  id: 'evelyn.ap.apworld.environment-disease.v1',
  title: 'U9.6-9.7 Population, Disease, and the Environment',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.environment-disease',
      description:
        'Explain the demographic transition, the century\'s major epidemics (1918 influenza, HIV/AIDS, COVID-19), and climate change as a measured scientific consensus with uneven international responses, including gains in global life expectancy alongside persistent regional gaps.',
      standard: 'AP-APWORLD-9.6',
    },
  ],
  prerequisites: ['apworld.technology-communication'],
  followUps: ['apworld.culture-rights-migration'],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see twentieth-century global health as a genuine story of major gains AND persistent gaps and new threats — not a simple story of steady, universal improvement.',
      script:
        "If you only looked at the world average, the twentieth and early twenty-first centuries look like a public-health triumph: global life expectancy rose by roughly a generation's worth of years. But averages hide a lot. The same century that produced that gain also produced the deadliest pandemic in modern history, a virus that killed tens of millions before effective treatment existed, and a novel coronavirus that shut down much of the planet within months. And even today, the regions that started 1950 furthest behind haven't fully caught up to the regions that started ahead. Today we're tracing both halves of that story — genuine, historic gains, and the new diseases and enduring gaps that came alongside them.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-environment-disease',
      kind: 'concept',
      goal: 'Explain the demographic transition, the century\'s major epidemics, and climate change as measured scientific consensus with international responses of varying success.',
      keyIdeas: [
        "THE DEMOGRAPHIC TRANSITION: as death rates fall (from better nutrition, sanitation, and medicine) before birth rates fall in response, a population grows rapidly for a period; over time, as families adjust expectations to lower child mortality, birth rates eventually fall too, and population growth slows. Most of the world's regions moved through some version of this pattern over the twentieth century, though at different times and speeds.",
        "THE 1918 INFLUENZA PANDEMIC: an influenza pandemic beginning in 1918, spread and worsened by the movement of troops during the final stages of World War I, killed an estimated tens of millions of people worldwide within about two years — among the deadliest disease events in recorded history, occurring before effective antiviral treatments or a vaccine existed.",
        "HIV/AIDS FROM 1981: first clinically recognized in 1981, the HIV/AIDS pandemic spread globally over the following decades, causing tens of millions of deaths, with the heaviest documented toll in parts of sub-Saharan Africa; the development of effective antiretroviral treatment from the mid-1990s onward transformed HIV from a near-certain death sentence into a manageable chronic condition for patients with treatment access, though access itself remained globally uneven.",
        "COVID-19 FROM 2020: a novel coronavirus identified in late 2019 spread globally by early 2020, prompting widespread lockdowns, travel restrictions, and one of the fastest vaccine-development efforts in history; it caused a temporary decline in global life expectancy figures and illustrated how quickly a new pathogen could move through an interconnected, highly mobile world.",
        "CLIMATE CHANGE AS MEASURED SCIENTIFIC CONSENSUS: the overwhelming scientific consensus, built over decades of measurement and peer-reviewed research, holds that human greenhouse-gas emissions are warming the global climate. International responses have had mixed success: the Montreal Protocol (1987), which phased out ozone-depleting chemicals, is widely regarded as a successful example of coordinated international environmental action, while the Kyoto Protocol (1997) and the Paris Agreement (2015), aimed at reducing carbon emissions, have made comparatively slower and more contested progress, reflecting the greater economic stakes involved in cutting fossil-fuel use.",
        "WATER SCARCITY AND DEFORESTATION: rising populations and economic growth increased demand for fresh water and agricultural/timber land in many regions, contributing to water scarcity in parts of the world and large-scale deforestation (notably in the Amazon basin and parts of Southeast Asia), with consequences for biodiversity and, in the case of deforestation, for the same greenhouse-gas balance climate science is measuring.",
        "GAINS AND GAPS TOGETHER: global life expectancy rose substantially across the century, but the improvement was not uniform — some regions gained far more than others, epidemics inflicted concentrated, sometimes region-specific damage, and climate and environmental pressures created new, unevenly distributed risks even as overall health outcomes improved.",
      ],
      vocabulary: [
        {
          term: 'demographic transition',
          definition:
            'the pattern in which falling death rates (from better nutrition, sanitation, and medicine) precede falling birth rates, producing a period of rapid population growth before growth eventually slows.',
        },
        {
          term: 'HIV/AIDS pandemic',
          definition:
            'first clinically recognized in 1981, a global pandemic causing tens of millions of deaths before effective antiretroviral treatment (from the mid-1990s) turned it into a manageable chronic condition for patients with treatment access.',
        },
        {
          term: 'Montreal Protocol (1987)',
          definition:
            'an international agreement phasing out ozone-depleting chemicals, widely regarded as a successful example of coordinated international environmental action.',
        },
        {
          term: 'Kyoto Protocol (1997) / Paris Agreement (2015)',
          definition:
            'international agreements aimed at reducing greenhouse-gas emissions, which have made comparatively slower and more contested progress than the Montreal Protocol, reflecting the larger economic stakes of cutting fossil-fuel use.',
        },
      ],
      passageId: 'evelyn.passage.apworld-life-expectancy-table.v1',
      estimatedMinutes: 7,
    },
    {
      id: 'worked-life-expectancy-table',
      kind: 'worked_example',
      problem:
        'Analyze this data table: world life expectancy at birth rose from about 46 years in 1950 to about 73 years in 2019, a gain of about 27 years. Over the same period, Africa rose from about 37 to about 62 years (a gain of about 25 years), Asia rose from about 42 to about 74 years (a gain of about 32 years, the largest of the three regions), and Europe rose from about 62 to about 79 years (a gain of about 17 years, the smallest of the three). Which region gained the most years, and what does that region\'s STARTING point in 1950 reveal about the pattern of global health improvement?',
      steps: [
        'SOURCE IT FIRST. This is a data table adapted from the UN Population Division\'s World Population Prospects, comparing period life expectancy at birth for the world and three regions at two points sixty-nine years apart.',
        'IDENTIFY THE REGION WITH THE LARGEST GAIN. Asia gained the most years of any region shown — about 32 years, rising from about 42 in 1950 to about 74 in 2019 — exceeding both Africa\'s roughly 25-year gain and Europe\'s roughly 17-year gain.',
        'IDENTIFY ASIA\'S STARTING POSITION IN 1950. In 1950, Asia\'s life expectancy (about 42) started ABOVE Africa\'s (about 37) but BELOW both the world figure and Europe\'s (about 62) — a middling position, not the lowest of the three regions shown.',
        'CONNECT THE GAIN TO THE STARTING POSITION. Asia\'s large gain narrowed, without closing, the regional gap with Europe: by 2019 Asia\'s life expectancy (about 74) had actually overtaken Europe\'s 1950 figure and approached Europe\'s 2019 figure (about 79), while Africa, which started lowest, gained fewer years than Asia and remained furthest behind in 2019.',
        'STATE THE LINK TO THE COURSE THESIS. The table shows real convergence in some places (Asia narrowing the gap with Europe) alongside persistent, real gaps in others (Africa\'s smaller gain leaving it furthest behind even after rising 25 years) — exactly the "gains and gaps together" pattern the concept describes, not simple uniform global improvement.',
      ],
      answer:
        'Asia gained the most years of any region shown — about 32 years, from about 42 in 1950 to about 74 in 2019 — more than Africa\'s roughly 25-year gain and well more than Europe\'s roughly 17-year gain. Asia\'s 1950 starting point (about 42) was above Africa\'s (about 37) but below both the world figure and Europe\'s (about 62), a middling rather than lowest position. That large gain let Asia narrow, without closing, the regional gap with Europe: by 2019 Asia\'s life expectancy (about 74) had overtaken Europe\'s own 1950 figure and approached Europe\'s 2019 figure (about 79). Africa, which started lowest of the three in 1950, gained fewer years than Asia and remained furthest behind in 2019 despite a real 25-year improvement. The table shows real convergence in some places alongside persistent gaps in others — gains and gaps together, not one uniform global improvement.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        'SAQ practice, using the life-expectancy data table above. (a) Identify the region with the largest gain in life expectancy between 1950 and 2019. (b) Explain ONE cause of the global improvement in life expectancy over this period. (c) Explain ONE reason regional gaps in life expectancy persisted despite the overall global improvement.',
      responseFormat: 'frq',
      passageId: 'evelyn.passage.apworld-life-expectancy-table.v1',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly identifies Asia as the region with the largest gain (about 32 years, from about 42 to about 74). No credit for a different region or an unsupported number.',
            modelResponse:
              'Asia had the largest gain in life expectancy, rising from about 42 years in 1950 to about 74 years in 2019, a gain of about 32 years — larger than Africa\'s or Europe\'s gain over the same period.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate cause of twentieth-century life-expectancy improvement — e.g. the Green Revolution reducing famine risk, vaccination/antibiotics reducing infectious-disease deaths, or smallpox eradication. No credit for a vague or unsupported claim.',
            modelResponse:
              'One cause of the global improvement was the spread of vaccines and antibiotics after World War II, which sharply reduced deaths from infectious disease across much of the world and contributed directly to rising life expectancy.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate reason regional gaps persisted — e.g. unequal access to medical treatment/vaccination, uneven economic development, or the concentrated regional impact of epidemics like HIV/AIDS. No credit for a vague or unsupported claim.',
            modelResponse:
              'Regional gaps persisted partly because access to medical advances was uneven: for example, effective HIV/AIDS treatment developed from the mid-1990s onward remained less accessible in parts of sub-Saharan Africa than in wealthier regions, slowing life-expectancy gains where the disease\'s documented toll was heaviest.',
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-only-improved',
      kind: 'misconception_check',
      question:
        'True or false: global health only improved after 1945 — new diseases and health inequalities were not a significant part of the story.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Reading the rising world-average life expectancy as proof that health outcomes improved uniformly everywhere, with no major setbacks or persistent inequalities.',
          correctsTo:
            "FALSE. The century's real overall gain in life expectancy (world average rising from about 46 to about 73 years) coexisted with major new disease threats and persistent inequalities. The 1918 influenza pandemic killed tens of millions before an effective vaccine existed. The HIV/AIDS pandemic, recognized from 1981, caused tens of millions of deaths, concentrated heavily in parts of sub-Saharan Africa, before effective treatment became available — and treatment access itself remained globally uneven. COVID-19, from 2020, caused a temporary GLOBAL DECLINE in life expectancy. And regional gaps in the 1950-2019 gain persisted: Africa's smaller gain left it furthest behind in 2019 despite genuine improvement. Global health both improved substantially AND faced new epidemics and uneven gains — not a simple story of steady, universal progress.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The demographic transition (falling death rates, then falling birth rates) drove most of the century\'s population growth pattern, though at different times in different regions.',
        'The 1918 influenza pandemic, HIV/AIDS (from 1981), and COVID-19 (from 2020) were the century\'s major epidemics, each occurring before effective treatment or vaccination was available.',
        'Climate change reflects a measured scientific consensus; the Montreal Protocol (1987) succeeded at phasing out ozone-depleting chemicals, while the Kyoto Protocol (1997)/Paris Agreement (2015) have made slower progress on carbon emissions.',
        'World life expectancy rose from about 46 (1950) to about 73 (2019), but gains were uneven: Asia gained the most (about 32 years), Europe the least (about 17 years), and Africa remained furthest behind despite a real 25-year gain.',
        'Global health gains and new disease/environmental threats occurred TOGETHER across the century, not as a simple story of steady, universal improvement.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '9',
    cedTopic: '9.6-9.7',
    cedTitle: 'Population, Disease, and the Environment',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP World History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-life-expectancy-table.v1',
        chapter: '1950-2019',
        note: 'World and regional life-expectancy data table — anchor document for uneven twentieth-century health gains.',
      },
    ],
  },
};
