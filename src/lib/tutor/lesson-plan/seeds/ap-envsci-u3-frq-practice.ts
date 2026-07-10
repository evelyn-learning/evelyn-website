/**
 * AP Environmental Science — Unit 3 FRQ Practice.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_ENVSCI_U3_FRQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.envsci.u3-frq-practice.v1', title: 'U3 FRQ Practice',
  curriculum: 'AP', grade: '11', subject: 'science', topic: 'ap-environmental-science', locale: 'en',
  los: [{ id: 'apenvsci.u3-frq-practice', description: 'Apply Unit 3 population concepts to AP-style FRQs.', standard: 'AP-ENVSCI-3-FRQ' }],
  prerequisites: ['apenvsci.demographic-transition'], followUps: [], estimatedMinutes: 26,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Stakes.', script: "Three Unit 3 FRQs: population growth math, age structure interpretation, demographic transition.", estimatedMinutes: 2 },
    { id: 'concept-strategy', kind: 'concept', goal: 'Refresh.', keyIdeas: [
      'r = (B − D)/N. Doubling time ≈ 70/r%.',
      'Logistic: dN/dt = rN(1 − N/K).',
      'Pyramids: wide base = expanding; narrow base = declining.',
      'TFR: replacement ≈ 2.1; below → decline.',
      'Demographic transition stages 1-4 (or 5).',
    ], estimatedMinutes: 2 },
    { id: 'try-frq-growth', kind: 'try_yourself',
      problem: 'FRQ Practice 1 — Population Math. A small island had 200 sea otters in 2010. By 2020, 270 otters. Assume only births and deaths (no migration). (a) Compute the average annual growth rate r. (b) If r remains constant, how many otters in 2030? (c) The island\'s estimated carrying capacity is 500 otters. Predict the population trajectory shape over the NEXT 50 years.',
      expectedAnswer: '(a) Use exponential approximation: 270/200 = 1.35 over 10 years. So annual ratio = 1.35^(1/10) = 1.0306, r ≈ 3.06% per year. \nAlternative (linear): (270 − 200)/200/10 = 0.035 = 3.5% per year (used in AP simple cases). Both reasonable. (1.5)\n(b) Continuing exponential: 270 × (1.0306)^10 = 270 × 1.35 = 364.5 → ~365 otters in 2030. (1.5)\n(c) Predicted trajectory:\n• 2020-2050: continued exponential growth as N is well below K. \n• 2050-2070: growth slows as N approaches K = 500 (logistic). \n• ~2070+: population stabilizes at carrying capacity. \nWith disturbances, may overshoot/undershoot. Overall: S-CURVE (logistic) approaching 500. (3)\nTotal: 6 points.',
      rubric: { parts: [
        { criterionId: 'a', maxPoints: 2, scoringCriteria: 'Computes an average annual growth rate from the 2010 and 2020 counts (exponential ~3.06%/yr or linear ~3.5%/yr both accepted) with work shown.', modelResponse: 'Exponential: 270/200 = 1.35 over 10 years, so the annual ratio = 1.35^(1/10) = 1.0306, r ≈ 3.06%/yr. (Linear approximation (270−200)/200/10 = 3.5%/yr is also acceptable.)' },
        { criterionId: 'b', maxPoints: 3, scoringCriteria: 'Projects the 2030 population by continuing the computed growth rate for another 10 years.', modelResponse: 'Continuing exponential growth: 270 × (1.0306)^10 = 270 × 1.35 ≈ 365 otters in 2030.' },
        { criterionId: 'c', maxPoints: 4, scoringCriteria: 'Describes a logistic (S-shaped) trajectory: exponential while N is well below K, slowing as N approaches K = 500, then stabilizing at carrying capacity.', modelResponse: 'The population follows an S-CURVE (logistic): continued exponential growth 2020-2050 while below K, slowing 2050-2070 as N approaches K = 500, then stabilizing near 500 (with possible overshoot/undershoot from disturbances).' },
      ] },
      responseFormat: 'frq', hints: ['Compute r; project; logistic shape.'], estimatedMinutes: 6 },
    { id: 'try-frq-pyramid', kind: 'try_yourself',
      problem: 'FRQ Practice 2 — Population Pyramid. Country X\'s pyramid has 38% of population aged 0-14, 58% aged 15-64, 4% aged 65+. TFR is 5.2, infant mortality 55/1000. (a) Identify the pyramid shape. (b) Predict population trajectory over next 50 years. (c) What is most likely the demographic transition stage? (d) Identify two pressing CHALLENGES this country will face given its age structure.',
      expectedAnswer: '(a) BROAD-BASE / EXPANDING. 38% under 15 is very high. (1)\n(b) Population will GROW SUBSTANTIALLY over next 50 years:\n• 38% currently under 15 will reach reproductive age. \n• Even if TFR drops, population momentum guarantees growth for 30+ years. \n• Population could double or more by 2074. (2)\n(c) STAGE 2 (high TFR, falling but still significant infant mortality, expanding population). Possibly transitioning into early Stage 3. (1.5)\n(d) Challenges:\n• EDUCATION: huge cohort of young needs schools and teachers. \n• HEALTHCARE: pediatric and maternal health infrastructure. \n• EMPLOYMENT: as cohorts reach working age, labor market must absorb them. \n• FOOD/WATER security as population grows. \n• ENVIRONMENT: deforestation, water demand, urbanization pressures. \n• POLITICAL INSTABILITY risk if youth unemployment high. (2.5)\nTotal: 7 points.',
      rubric: { parts: [
        { criterionId: 'a', maxPoints: 1, scoringCriteria: 'Identifies the pyramid as broad-based / expanding (very high proportion under 15).', modelResponse: 'BROAD-BASE / EXPANDING pyramid — 38% under age 15 is very high.' },
        { criterionId: 'b', maxPoints: 3, scoringCriteria: 'Predicts substantial growth over 50 years, citing population momentum as the large young cohort reaches reproductive age even if TFR falls.', modelResponse: 'The population will GROW SUBSTANTIALLY: the 38% under 15 will reach reproductive age, and population MOMENTUM guarantees growth for 30+ years even if TFR drops — the population could double by 2074.' },
        { criterionId: 'c', maxPoints: 2, scoringCriteria: 'Identifies demographic transition Stage 2 (high TFR, falling but still significant infant mortality, expanding), possibly early Stage 3.', modelResponse: 'STAGE 2 — high TFR with falling but still significant infant mortality and an expanding population, possibly transitioning into early Stage 3.' },
        { criterionId: 'd', maxPoints: 3, scoringCriteria: 'Identifies two pressing challenges tied to the young age structure (education, healthcare, employment/labor absorption, food/water security, or instability from youth unemployment).', modelResponse: 'EDUCATION — a huge young cohort needs schools and teachers; and EMPLOYMENT — the labor market must absorb these cohorts as they reach working age (with added pressure on healthcare, food/water, and stability if youth unemployment is high).' },
      ] },
      responseFormat: 'frq', hints: ['Read pyramid; trajectory; transition stage; specific challenges.'], estimatedMinutes: 6 },
    { id: 'try-frq-transition', kind: 'try_yourself',
      problem: 'FRQ Practice 3 — Demographic Transition. Country X has had a steep TFR drop: from 6.0 in 1970 to 1.5 in 2020. Yet population grew from 30M to 100M in this period. (a) Explain how population can grow when TFR fell so much. (b) Which transition stage is the country IN now (2020)? (c) Predict population trajectory 2020-2070. (d) Suggest two policy concerns this country might face.',
      expectedAnswer: '(a) POPULATION MOMENTUM. The 1970 high TFR produced massive cohorts of young people. As they aged into reproductive years, even a moderate TFR (3-4 in the 1990s) produced many births since there were so many parents. The 100M peak in 2020 is the result of momentum from the 1970s-1990s cohorts still in or recently past reproductive age. Their children, born in 1990s-2010s, are the current young cohorts. (2.5)\n(b) Stage 4 — TFR is below replacement (1.5 < 2.1) and likely both birth and death rates are low. Country is post-industrial. (1.5)\n(c) Population trajectory 2020-2070:\n• Continued growth slowing toward zero. Possibly peaks 2030-2040. \n• Then DECLINE as smaller cohorts replace dying older ones. \n• By 2070, population could shrink 10-30% from peak. \n• Population AGES throughout. (2)\n(d) Policy concerns:\n• AGING POPULATION: pension/healthcare costs rise. Working-age cohort shrinks. Dependency ratio worsens. \n• LABOR SHORTAGE: economy may need immigration. \n• PROSPECT OF DEPOPULATION: rural areas lose people, schools close, infrastructure underutilized. \n• Possible CULTURAL/POLITICAL TENSION over immigration policy. (2.5)\nTotal: 8.5 points.',
      rubric: { parts: [
        { criterionId: 'a', maxPoints: 3, scoringCriteria: 'Explains population momentum: the large cohorts born under the high 1970 TFR aged into reproduction, so a moderate TFR still produced many births despite the falling rate.', modelResponse: 'POPULATION MOMENTUM: the high 1970 TFR produced massive young cohorts; as they aged into reproductive years, even a moderate TFR yielded many births because there were so many potential parents, driving the population to 100M.' },
        { criterionId: 'b', maxPoints: 1, scoringCriteria: 'Identifies Stage 4 (below-replacement TFR with low birth and death rates).', modelResponse: 'STAGE 4 — TFR of 1.5 is below replacement (2.1), with both birth and death rates low in a post-industrial society.' },
        { criterionId: 'c', maxPoints: 2, scoringCriteria: 'Predicts growth slowing to a peak then decline, with an aging population, over 2020-2070.', modelResponse: 'Growth slows toward zero and peaks around 2030-2040, then DECLINES as smaller cohorts replace dying older ones — possibly 10-30% below peak by 2070 — while the population ages throughout.' },
        { criterionId: 'd', maxPoints: 3, scoringCriteria: 'Identifies two policy concerns of an aging/declining society (pension and healthcare costs, labor shortage/immigration need, depopulation of rural areas, or immigration-related tension).', modelResponse: 'AGING POPULATION raises pension and healthcare costs as the working-age share shrinks and the dependency ratio worsens; and LABOR SHORTAGE may force reliance on immigration, alongside rural depopulation and political tension over immigration policy.' },
      ] },
      responseFormat: 'frq', hints: ['Momentum; stage 4; trajectory; aging-society concerns.'], estimatedMinutes: 7 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'Population math: r, doubling time, logistic.',
      'Pyramid shapes predict trajectory; momentum lags by 30-50 years.',
      'TFR ≈ 2.1 = replacement; below → decline; transition stages 1-4.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '3', cedTopic: '3-FRQ', cedTitle: 'Unit 3 FRQ Practice', sources: [{ type: 'frq-style', source: 'AP Plans Initiative author', note: 'Modeled on AP Env Sci Unit-3 FRQs.' }] },
};
