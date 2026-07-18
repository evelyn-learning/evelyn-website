/**
 * AP Psychology — Unit 3 CED 3.1: Themes and Methods in Developmental Psychology.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.psych.developmental-themes-methods.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_PSYCH_DEVELOPMENTAL_THEMES_METHODS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.psych.developmental-themes-methods.v1',
  course: 'AP Psychology',
  cedUnit: 3,
  cedTopic: '3.1',
  cedTitle: 'Themes and Methods in Developmental Psychology',
  planId: 'evelyn.ap.psych.developmental-themes-methods.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.psych.developmental-themes-methods.v1' }],
  theory: [
    { loId: 'appsych.developmental-themes-methods', content: `DEVELOPMENTAL PSYCHOLOGY studies physical, cognitive, and social-emotional change across the ENTIRE LIFESPAN — not just childhood. The field is organized around three recurring THEMES (big questions) and two signature RESEARCH DESIGNS for studying change over time. Every later topic in Unit 3 hangs on this frame.` },
    { loId: 'appsych.developmental-themes-methods', content: `THEME 1 — NATURE vs NURTURE: how much do GENES (nature) versus ENVIRONMENT and experience (nurture) shape a trait? The modern answer is ALWAYS an INTERACTION, never either/or — and the sophisticated exam answer says so explicitly. EPIGENETICS is the mechanism to cite: environmental factors can switch genes on and off, so nurture literally acts through nature.` },
    { loId: 'appsych.developmental-themes-methods', content: `THEME 2 — STABILITY vs CHANGE: do characteristics remain stable across life, or do they change? The nuanced answer is trait-specific: TEMPERAMENT is remarkably STABLE from infancy onward, while other characteristics — such as SOCIAL ATTITUDES — change substantially over the lifespan.` },
    { loId: 'appsych.developmental-themes-methods', content: `THEME 3 — CONTINUITY vs STAGES (discontinuity): is development a GRADUAL, continuous process, or a series of DISTINCT STAGES with qualitative leaps? STAGE THEORIES (Piaget, Erikson, Kohlberg) claim everyone passes through the SAME steps in the SAME order. The continuity view sees smooth incremental growth. Modern evidence leans more continuous and uneven than classic stage theories claimed.` },
    { loId: 'appsych.developmental-themes-methods', content: `CROSS-SECTIONAL DESIGN: compare people of DIFFERENT AGES at the SAME point in time (test 20-, 40-, and 60-year-olds today). Strengths: FAST and CHEAP. Fatal weakness: COHORT EFFECTS — the age groups differ in more than age (different generations, schooling, technology), so observed differences may be GENERATIONAL rather than developmental.` },
    { loId: 'appsych.developmental-themes-methods', content: `LONGITUDINAL DESIGN: follow the SAME people OVER TIME (test one group at 20, again at 40, again at 60). Strengths: eliminates cohort confounds and directly shows within-person change. Weaknesses: SLOW and EXPENSIVE, and ATTRITION — participants drop out over the years, and the dropouts are rarely random, which can BIAS the remaining sample (e.g. healthier, more motivated people stay).` },
    { loId: 'appsych.developmental-themes-methods', content: `CHOOSING BETWEEN DESIGNS is a trade-off, not a ranking: cross-sectional buys speed at the cost of cohort confounds; longitudinal buys validity about aging at the cost of time, money, and attrition. AP questions typically describe a study, ask you to NAME the design, spot its characteristic WEAKNESS, and propose the other design as the fix.` },
    { loId: 'appsych.developmental-themes-methods', content: `CONNECTION TO RESEARCH METHODS: developmental studies are usually CORRELATIONAL or descriptive, because you CANNOT RANDOMLY ASSIGN someone to an age. No random assignment means no true experiment, so causal claims about aging itself require caution — a point examiners reward when you make it unprompted.` },
    { loId: 'appsych.developmental-themes-methods', kind: 'definition', title: 'cross-sectional study', content: `a design comparing different age groups at one point in time; fast and cheap but vulnerable to cohort effects.` },
    { loId: 'appsych.developmental-themes-methods', kind: 'definition', title: 'longitudinal study', content: `a design following the same individuals over time; avoids cohort confounds but is slow, costly, and prone to attrition.` },
    { loId: 'appsych.developmental-themes-methods', kind: 'definition', title: 'cohort effect', content: `a difference between age groups caused by their belonging to different generations rather than by aging itself; the central threat to cross-sectional studies.` },
  ],
  methods: [
    {
      title: 'Analyze a developmental study design and its weakness',
      steps: [
        `STEP 1 — Identify the design: different ages compared at ONE time → CROSS-SECTIONAL; the SAME people measured repeatedly over years → LONGITUDINAL.`,
        `STEP 2 — For cross-sectional results, generate a COHORT-EFFECT alternative explanation: name a generational difference (schooling, technology, nutrition, media) that could produce the gap with no aging involved.`,
        `STEP 3 — Propose the fix: a LONGITUDINAL design following the same individuals removes the cohort confound because any change happens within the same people.`,
        `STEP 4 — Name the fix's own costs: slow, expensive, and ATTRITION that can bias the surviving sample.`,
        `STEP 5 — Add the causal caveat: age cannot be randomly assigned, so either design is correlational about aging.`,
      ],
      example: {
        problem: `A researcher tests 30-year-olds and 70-year-olds this year and finds the 70-year-olds have larger vocabularies. (a) Which design? (b) Give a cohort-effect explanation. (c) What design fixes it?`,
        solution: `(a) CROSS-SECTIONAL. (b) The 70-year-olds grew up with different schooling and more reading emphasis — a generational difference could produce the gap regardless of aging. (c) A LONGITUDINAL study following the same people from 30 to 70; trade-off is time, cost, and attrition.`,
      },
      relatedLoIds: ['appsych.developmental-themes-methods'],
    },
    {
      title: 'Classify a question by developmental theme',
      steps: [
        `STEP 1 — Ask what the question contrasts: genes versus environment → NATURE vs NURTURE.`,
        `STEP 2 — A trait persisting versus changing over the lifespan → STABILITY vs CHANGE.`,
        `STEP 3 — Gradual growth versus distinct qualitative leaps → CONTINUITY vs STAGES.`,
        `STEP 4 — For nature-nurture questions, always land on INTERACTION — the two work together (cite epigenetics) — rather than picking a side.`,
      ],
      example: {
        problem: `Match to a theme: (a) "Is language learned gradually or in distinct stages?" (b) "Does a shy toddler become a shy adult?" (c) "Is intelligence mostly inherited or environmental?"`,
        solution: `(a) CONTINUITY vs STAGES. (b) STABILITY vs CHANGE (temperament persistence). (c) NATURE vs NURTURE — and the strong answer notes the two INTERACT rather than choosing one.`,
      },
      relatedLoIds: ['appsych.developmental-themes-methods'],
    },
  ],
  pointers: [
    { content: `Three themes: nature/nurture (always interaction), stability/change (trait-specific), continuity/stages.`, kind: 'tip' },
    { content: `Cross-sectional = different ages, one time — fast but cohort-confounded.`, kind: 'tip' },
    { content: `Longitudinal = same people over time — no cohort confound, but slow, costly, attrition-biased.`, kind: 'tip' },
    { content: `Cohort effect = a generational difference masquerading as an aging effect.`, kind: 'tip' },
    { content: `Age cannot be randomly assigned, so developmental findings are correlational — say this for easy points.`, kind: 'tip' },
    { content: `Attrition is nonrandom: survivors of a longitudinal study tend to be healthier and more motivated, biasing results.`, kind: 'tip' },
  ],
};
