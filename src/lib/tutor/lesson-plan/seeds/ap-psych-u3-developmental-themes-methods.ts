/**
 * AP Psychology — CED Unit 3.1: Themes and Methods in Developmental
 * Psychology.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_PSYCH_U3_DEVELOPMENTAL_THEMES: LessonPlan = {
  id: 'evelyn.ap.psych.developmental-themes-methods.v1',
  title: 'U3.1 Themes and Methods in Developmental Psychology',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-psychology',
  locale: 'en',
  los: [
    {
      id: 'appsych.developmental-themes-methods',
      description:
        'Identify the core themes of developmental psychology (nature vs nurture, stability vs change, continuity vs stages) and distinguish the research designs used to study development across the lifespan (cross-sectional vs longitudinal), including their trade-offs and cohort effects.',
      standard: 'AP-PSYCH-3.1',
    },
  ],
  prerequisites: ['appsych.research-methods'],
  followUps: ['appsych.cognitive-development'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame development as a set of big recurring questions plus the methods that answer them.',
      script:
        "How much of who you are was set at birth versus shaped by experience? Do people fundamentally change over a lifetime, or stay the same? Developmental psychology runs on a handful of these big questions — and on two clever research designs for studying change over time. Get the themes and the methods, and the rest of Unit 3 hangs on this frame.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-themes',
      kind: 'concept',
      goal: 'Cover the three developmental themes and the cross-sectional vs longitudinal designs.',
      keyIdeas: [
        'DEVELOPMENTAL PSYCHOLOGY studies physical, cognitive, and social-emotional change across the entire LIFESPAN (not just childhood).',
        'THEME 1 — NATURE vs NURTURE: how much do genes (nature) vs environment/experience (nurture) shape a trait? Modern answer: ALWAYS an INTERACTION, not either/or. Epigenetics shows environment can switch genes on/off.',
        'THEME 2 — STABILITY vs CHANGE: do characteristics (e.g. temperament) remain stable across life, or change? Some traits are remarkably stable (temperament), others change (social attitudes).',
        'THEME 3 — CONTINUITY vs STAGES (discontinuity): is development a GRADUAL, continuous process (continuity), or a series of distinct STAGES with qualitative leaps (e.g. Piaget)? Stage theories claim everyone passes through the same steps in the same order.',
        'CROSS-SECTIONAL DESIGN: compare people of DIFFERENT AGES at the SAME time (e.g. test 20-, 40-, and 60-year-olds today). FAST and cheap. WEAKNESS: confounded by COHORT EFFECTS — age groups differ in more than age (different generations, education, technology), so differences may be generational, not developmental.',
        'LONGITUDINAL DESIGN: follow the SAME people OVER TIME (e.g. test one group at 20, 40, and 60). Avoids cohort confounds and directly shows change. WEAKNESSES: slow and expensive; ATTRITION (participants drop out), which can bias the remaining sample.',
        'COHORT EFFECT: a difference between age groups caused by their belonging to different GENERATIONS rather than by aging itself — the central threat to cross-sectional studies.',
        'CONNECTING TO METHODS (from Scientific Foundations): developmental studies are usually CORRELATIONAL/descriptive (you cannot randomly assign someone to an age), so causal claims about aging require caution.',
      ],
      vocabulary: [
        { term: 'cross-sectional study', definition: 'compares different age groups at one point in time; fast but vulnerable to cohort effects.' },
        { term: 'longitudinal study', definition: 'follows the same individuals over time; avoids cohort confounds but is slow and prone to attrition.' },
        { term: 'cohort effect', definition: 'a difference between age groups due to their generation rather than their age.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-design-tradeoff',
      kind: 'try_yourself',
      problem:
        'A researcher wants to know whether vocabulary declines with age. She tests 30-year-olds and 70-year-olds this year and finds the 70-year-olds score higher. (a) Which design is this? (b) Give a cohort-effect explanation that has nothing to do with aging. (c) What design would address that weakness?',
      expectedAnswer:
        '(a) This is a CROSS-SECTIONAL design — different age groups compared at one time. (b) COHORT-EFFECT explanation: the 70-year-olds grew up in an era with different schooling, more emphasis on reading, or less screen time — generational differences in education/experience could produce the vocabulary gap regardless of aging. So the difference may reflect COHORT, not age. (c) A LONGITUDINAL design would address this: follow the SAME individuals over decades and measure their vocabulary at 30 and again at 70, so any change reflects aging within the same people (no cohort confound). Trade-off: it is slow, costly, and subject to attrition. Strong answers name the design, give a generational (not aging) explanation, and propose longitudinal with its cost.',
      responseFormat: 'free',
      hints: [
        'Different ages compared at the same time = which design?',
        'A cohort effect is a generational difference, not an aging effect.',
        'Following the same people over time removes the cohort confound.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-themes-classify',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. Match each question to the developmental theme it concerns, and explain: (a) "Is language learned in gradual increments or in distinct stages?" (b) "Does a shy toddler tend to become a shy adult?" (c) "Is intelligence mostly inherited or mostly a product of environment?"',
      expectedAnswer:
        '(a) CONTINUITY vs STAGES (discontinuity): the question asks whether development is gradual (continuous) or proceeds through qualitatively distinct stages — this is the continuity/stages theme. (b) STABILITY vs CHANGE: it asks whether a characteristic (shyness/temperament) persists across the lifespan or changes — the stability/change theme. (c) NATURE vs NURTURE: it asks about the relative contributions of genes (nature) and environment (nurture) to intelligence — and the sophisticated answer is that the two INTERACT rather than one acting alone. Strong answers name the correct theme for each AND, for (c), note the interactionist position rather than picking a side. These three themes recur throughout every developmental topic in Unit 3.',
      responseFormat: 'frq',
      hints: [
        'Gradual vs distinct leaps = continuity vs stages.',
        'Persisting vs changing trait = stability vs change.',
        'Genes vs environment = nature vs nurture (which interact).',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Three themes: nature/nurture (interaction), stability/change, continuity/stages.',
        'Cross-sectional: different ages at once — fast but cohort-confounded.',
        'Longitudinal: same people over time — avoids cohorts but slow, attrition.',
        'Cohort effect = generational difference mistaken for an aging effect.',
        'You can\'t randomly assign age, so developmental claims are usually correlational.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '3',
    cedTopic: '3.1',
    cedTitle: 'Themes and Methods in Developmental Psychology',
    sources: [
      { type: 'concept', book: 'feldman', chapter: '9', note: 'Developmental themes and cross-sectional vs longitudinal designs.' },
    ],
  },
};
