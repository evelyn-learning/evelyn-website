/**
 * AP Macroeconomics — CED Unit 5.6: Economic Growth.
 *
 * Drivers of long-run growth (capital, labor, human capital, technology),
 * growth accounting, and convergence theory. Sets up Unit 5.7 on
 * supply-side policies.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_MACRO_U5_ECONOMIC_GROWTH: LessonPlan = {
  id: 'evelyn.ap.macro.economic-growth.v1',
  title: 'U5.6 Economic Growth',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-macroeconomics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.economic-growth',
      description:
        'Identify the four sources of long-run economic growth (physical capital, labor, human capital, technology), apply the LRAS framework to track growth, and recognize the role of productivity in cross-country income differences.',
      standard: 'AP-MACRO-5.6',
    },
  ],
  prerequisites: ['apmacro.crowding-out-long-run'],
  followUps: ['apmacro.public-policy-growth'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame long-run growth as the most important macro outcome.',
      script:
        "Cyclical fluctuations matter for the next year. LONG-RUN GROWTH matters for the next century. The difference between 1% and 3% annual growth, sustained for 100 years, is the difference between a country becoming 2.7x richer or 19x richer. Long-run growth is the variable that determines whether a country goes from poverty to prosperity. AP wants you to know what drives it and what doesn't.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-growth-drivers',
      kind: 'concept',
      goal: 'Cover the four sources of long-run growth, productivity, and convergence theory.',
      keyIdeas: [
        'LONG-RUN ECONOMIC GROWTH: sustained increase in real GDP per capita over decades. Equivalent to LRAS shifting RIGHT over time. The most important macro outcome over long horizons.',
        'FOUR SOURCES OF GROWTH: (1) PHYSICAL CAPITAL — machines, factories, equipment, infrastructure. More capital per worker → higher productivity. (2) LABOR — workforce size and participation. Population growth, immigration, increased labor-force participation all add labor inputs. (3) HUMAN CAPITAL — workers\' skills, education, health. A more educated workforce produces more output per hour. (4) TECHNOLOGY — innovations that allow more output from the same inputs. The largest driver of long-run growth in advanced economies; growth without innovation eventually stalls (diminishing returns to capital alone).',
        'PRODUCTIVITY = output per labor hour. The single most important measure of an economy\'s productive efficiency. Differences in productivity explain MOST of the cross-country variation in GDP per capita.',
        'GROWTH ACCOUNTING. Economists decompose growth into contributions: %ΔY = α × %ΔK + β × %ΔL + %ΔTFP. K = capital, L = labor, TFP = total factor productivity (the residual after capital and labor are accounted for; reflects technology + organizational improvements).',
        'EMPIRICAL FINDING: in advanced economies, TFP (technology + efficiency) has accounted for ROUGHLY HALF of long-run growth historically. The other half is capital accumulation (with population growth contributing modestly).',
        'DIMINISHING RETURNS TO CAPITAL: adding more machines to a fixed workforce eventually yields smaller and smaller productivity gains. To sustain growth, an economy needs continuing technological innovation, not just more capital.',
        'CONVERGENCE THEORY: poorer countries should grow faster than richer ones IF they can adopt existing technology and accumulate capital. Strong empirical support among countries with stable institutions (post-war Japan, Korea, more recently China). Weak support among countries lacking institutional foundations — Africa\'s growth performance has been very uneven despite low starting GDP.',
        'INSTITUTIONS MATTER: rule of law, property rights, low corruption, functioning courts, stable political environment, sound monetary policy. Two countries with similar resources can have vastly different growth trajectories based on institutional quality. North vs South Korea is the textbook comparison.',
      ],
      vocabulary: [
        { term: 'productivity', definition: 'output per labor hour; the most important measure of economic efficiency.' },
        { term: 'human capital', definition: 'the skills, education, health, and experience embodied in workers.' },
        { term: 'total factor productivity (TFP)', definition: 'the part of growth not explained by capital or labor inputs; reflects technology and efficiency.' },
        { term: 'convergence', definition: 'the tendency of poorer countries to grow faster than richer ones, conditional on similar institutional quality.' },
      ],
      suggestedTools: ['production_possibilities'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-growth-decomp',
      kind: 'worked_example',
      problem:
        'Country A reports the following long-run growth components for the past 30 years: physical capital growth contributed 1.0% per year; labor force growth contributed 0.5% per year; technological progress (TFP) contributed 1.5% per year. (a) Compute the country\'s total annual growth rate. (b) Compute what fraction of growth is explained by capital, labor, and TFP. (c) Identify which source contributed most.',
      steps: [
        'STEP 1 — TOTAL GROWTH = 1.0% + 0.5% + 1.5% = 3.0% per year.',
        'STEP 2 — FRACTIONS. Capital: 1.0/3.0 = 33%. Labor: 0.5/3.0 = 17%. TFP: 1.5/3.0 = 50%.',
        'STEP 3 — TFP contributed the most (50%), consistent with the empirical finding that technology and efficiency are the largest driver of long-run growth in modern economies.',
        'STEP 4 — INTERPRETATION. Country A is a typical advanced economy: roughly half of growth from technology, a third from capital, a sixth from labor. Policies that improve technology adoption (R&D, education, openness to ideas) would have the largest growth multiplier here.',
        'STEP 5 — CONTRAST. A developing economy in early-stage industrialization might see a higher fraction from capital accumulation (catch-up growth) and labor (population shift to formal sector) and a lower fraction from TFP. As the economy matures, the mix shifts toward TFP — convergence pattern.',
      ],
      answer: '(a) 3.0% growth/year. (b) Capital 33%, Labor 17%, TFP 50%. (c) TFP contributed most.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-four-sources',
      kind: 'try_yourself',
      problem:
        'Name the FOUR sources of long-run economic growth. For each, give one specific real-world example of a policy or event that would increase that source.',
      expectedAnswer:
        'PHYSICAL CAPITAL: more machines, factories, infrastructure, equipment per worker. Example: government infrastructure spending (highways, ports, broadband); tax incentives for business investment in equipment. LABOR: more workers or higher labor-force participation. Example: immigration reform allowing more skilled workers; childcare subsidies enabling parents to enter the workforce; raising retirement age. HUMAN CAPITAL: workers\' skills, education, health, training. Example: increasing public investment in K-12 and higher education; expanding apprenticeship programs; public-health spending. TECHNOLOGY: innovations and productivity-enhancing knowledge. Example: government R&D funding; intellectual property protection that incentivizes innovation; openness to international knowledge transfer. Strong answers pair each source with a specific policy/event mechanism.',
      responseFormat: 'free',
      hints: [
        'Four sources: capital, labor, human capital, technology.',
        'For each, what intervention raises it?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-productivity',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. Why is PRODUCTIVITY (output per labor hour) considered the single most important determinant of long-run living standards? Use cross-country comparisons in your explanation.',
      expectedAnswer:
        'Productivity is the single most important determinant because real per-capita GDP is approximately = (productivity) × (hours worked per worker) × (workers per capita). The latter two factors are bounded — there are only 24 hours in a day and most working-age adults already work some hours. Productivity, in contrast, is essentially unbounded — technology and human capital can keep raising output per hour indefinitely (with diminishing returns to capital but compounding TFP gains). Cross-country comparisons confirm this: the U.S. and Switzerland have similar labor force sizes per capita and similar hours worked, but Switzerland\'s GDP per capita is similar to or higher than the U.S. — driven by similar productivity. Most of the GDP-per-capita gap between the U.S. and developing countries is explained by productivity differences, not by hours worked or labor force participation. Specifically: workers in the poorest countries work longer hours than U.S. workers but produce far less per hour, leading to much lower per-capita GDP. Strong answers explicitly: (i) decompose GDP-per-capita into productivity × labor-input components; (ii) note the boundedness of labor-input components; (iii) cite specific cross-country examples.',
      responseFormat: 'frq',
      hints: [
        'GDP per capita = productivity × labor input per capita.',
        'Why is productivity unbounded while labor input is bounded?',
        'Cross-country: poor vs rich countries differ mostly in productivity.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-convergence',
      kind: 'try_yourself',
      problem:
        'Convergence theory predicts that poorer countries should grow faster than richer ones, eventually catching up. (a) Identify the mechanism by which convergence is supposed to operate. (b) Identify ONE country that has experienced strong convergence and ONE country that has not, and identify the institutional or policy factor that explains the difference.',
      expectedAnswer:
        '(a) MECHANISM: poorer countries can ADOPT existing technology that rich countries have already developed (rather than inventing it from scratch); they can ACCUMULATE CAPITAL with high marginal returns (since they start with little); their workers can move from low-productivity agriculture to higher-productivity manufacturing/services; they can borrow knowledge, institutions, and best practices. The combined effect: catch-up growth that exceeds rich-country growth rates, eventually closing the gap. (b) STRONG CONVERGENCE EXAMPLE: South Korea — went from very low GDP per capita in 1960 to advanced-economy levels by 2020. Strong factors: stable institutions (after 1960s reforms), heavy investment in education, export-oriented manufacturing strategy, openness to foreign technology and investment, low corruption (relatively). WEAK / NEGATIVE CONVERGENCE: many sub-Saharan African countries (e.g. DRC, Zimbabwe over various periods) — despite low starting GDP, have not converged. Factors: institutional weakness (corruption, civil conflict, weak property rights), inadequate infrastructure, low education, capital flight. Other valid contrasts: Japan (strong) vs Argentina (slow / declining despite once being among world\'s richest); Singapore (strong) vs Burma/Myanmar (weak). Strong answers: name a SPECIFIC country, identify SPECIFIC institutional factors, articulate that convergence requires more than just low starting income — institutional quality is a precondition.',
      responseFormat: 'free',
      hints: [
        'Convergence works when poor countries can adopt existing tech.',
        'It fails when institutions don\'t allow capital + tech adoption.',
        'Cite specific country comparisons.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Four sources of growth: PHYSICAL CAPITAL, LABOR, HUMAN CAPITAL, TECHNOLOGY.',
        'Productivity (output / hour) is the single most important driver of cross-country GDP differences.',
        'Growth accounting: %ΔY = α%ΔK + β%ΔL + %ΔTFP. TFP ≈ half of long-run growth in advanced economies.',
        'Diminishing returns to capital: long-run growth requires technology (TFP), not just more K.',
        'Convergence: poor countries can catch up — but only with adequate institutions.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '5',
    cedTopic: '5.6',
    cedTitle: 'Economic Growth',
    sources: [
      { type: 'concept', book: 'openstax-macro-ap', chapter: '20', note: 'OpenStax Macro AP — sources of growth, growth accounting, convergence.' },
    ],
  },
};
