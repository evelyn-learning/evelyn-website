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
      responseFormat: 'frq', hints: ['Compute r; project; logistic shape.'], estimatedMinutes: 6 },
    { id: 'try-frq-pyramid', kind: 'try_yourself',
      problem: 'FRQ Practice 2 — Population Pyramid. Country X\'s pyramid has 38% of population aged 0-14, 58% aged 15-64, 4% aged 65+. TFR is 5.2, infant mortality 55/1000. (a) Identify the pyramid shape. (b) Predict population trajectory over next 50 years. (c) What is most likely the demographic transition stage? (d) Identify two pressing CHALLENGES this country will face given its age structure.',
      expectedAnswer: '(a) BROAD-BASE / EXPANDING. 38% under 15 is very high. (1)\n(b) Population will GROW SUBSTANTIALLY over next 50 years:\n• 38% currently under 15 will reach reproductive age. \n• Even if TFR drops, population momentum guarantees growth for 30+ years. \n• Population could double or more by 2074. (2)\n(c) STAGE 2 (high TFR, falling but still significant infant mortality, expanding population). Possibly transitioning into early Stage 3. (1.5)\n(d) Challenges:\n• EDUCATION: huge cohort of young needs schools and teachers. \n• HEALTHCARE: pediatric and maternal health infrastructure. \n• EMPLOYMENT: as cohorts reach working age, labor market must absorb them. \n• FOOD/WATER security as population grows. \n• ENVIRONMENT: deforestation, water demand, urbanization pressures. \n• POLITICAL INSTABILITY risk if youth unemployment high. (2.5)\nTotal: 7 points.',
      responseFormat: 'frq', hints: ['Read pyramid; trajectory; transition stage; specific challenges.'], estimatedMinutes: 6 },
    { id: 'try-frq-transition', kind: 'try_yourself',
      problem: 'FRQ Practice 3 — Demographic Transition. Country X has had a steep TFR drop: from 6.0 in 1970 to 1.5 in 2020. Yet population grew from 30M to 100M in this period. (a) Explain how population can grow when TFR fell so much. (b) Which transition stage is the country IN now (2020)? (c) Predict population trajectory 2020-2070. (d) Suggest two policy concerns this country might face.',
      expectedAnswer: '(a) POPULATION MOMENTUM. The 1970 high TFR produced massive cohorts of young people. As they aged into reproductive years, even a moderate TFR (3-4 in the 1990s) produced many births since there were so many parents. The 100M peak in 2020 is the result of momentum from the 1970s-1990s cohorts still in or recently past reproductive age. Their children, born in 1990s-2010s, are the current young cohorts. (2.5)\n(b) Stage 4 — TFR is below replacement (1.5 < 2.1) and likely both birth and death rates are low. Country is post-industrial. (1.5)\n(c) Population trajectory 2020-2070:\n• Continued growth slowing toward zero. Possibly peaks 2030-2040. \n• Then DECLINE as smaller cohorts replace dying older ones. \n• By 2070, population could shrink 10-30% from peak. \n• Population AGES throughout. (2)\n(d) Policy concerns:\n• AGING POPULATION: pension/healthcare costs rise. Working-age cohort shrinks. Dependency ratio worsens. \n• LABOR SHORTAGE: economy may need immigration. \n• PROSPECT OF DEPOPULATION: rural areas lose people, schools close, infrastructure underutilized. \n• Possible CULTURAL/POLITICAL TENSION over immigration policy. (2.5)\nTotal: 8.5 points.',
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
