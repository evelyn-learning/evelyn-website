/**
 * AP Psychology — Unit 2 CED 2.8: Intelligence and Achievement.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.psych.intelligence.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_PSYCH_INTELLIGENCE: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.psych.intelligence.v1',
  course: 'AP Psychology',
  cedUnit: 2,
  cedTopic: '2.8',
  cedTitle: 'Intelligence and Achievement',
  planId: 'evelyn.ap.psych.intelligence.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.psych.intelligence.v1' }],
  theory: [
    { loId: 'appsych.intelligence', content: `THE CENTRAL DEBATE: is intelligence ONE general ability or MANY separate ones — and can a test measure it? AP loves this argument, so know the competing THEORIES, the major TESTS, the properties that make a test trustworthy, and the heritability-versus-environment evidence.` },
    { loId: 'appsych.intelligence', content: `SPEARMAN — GENERAL INTELLIGENCE (g): a single underlying factor explains performance across ALL cognitive tasks. People strong at math also tend to do well at vocabulary; that POSITIVE CORRELATION across diverse tests is g, and IQ tests are designed to measure it. Psychometricians (the statisticians of testing) broadly accept g.` },
    { loId: 'appsych.intelligence', content: `STERNBERG — TRIARCHIC THEORY: three intelligences — ANALYTICAL (classic academic, IQ-style problem-solving), CREATIVE (novel problem-solving and originality), and PRACTICAL ("street smarts," applying knowledge to real situations). It broadens intelligence beyond what standard IQ tests capture.` },
    { loId: 'appsych.intelligence', content: `GARDNER — MULTIPLE INTELLIGENCES (8 types): LINGUISTIC, LOGICAL-MATHEMATICAL, MUSICAL, SPATIAL, BODILY-KINESTHETIC, INTERPERSONAL, INTRAPERSONAL, and NATURALISTIC — each a separate capacity. Very influential in education, but critics argue several are better called TALENTS than intelligences, and factor analysis of test data does not support fully separate factors.` },
    { loId: 'appsych.intelligence', content: `GOLEMAN — EMOTIONAL INTELLIGENCE (EQ): self-awareness, self-regulation, motivation, empathy, and social skills. Argued by some to matter more than IQ for life success; research supports modest correlations with workplace and relationship outcomes.` },
    { loId: 'appsych.intelligence', content: `CATTELL — CRYSTALLIZED vs FLUID intelligence: CRYSTALLIZED intelligence is accumulated knowledge, vocabulary, and facts, and it INCREASES across the lifespan. FLUID intelligence is the ability to reason about and solve NOVEL problems quickly; it peaks in the 20s and declines slowly with age.` },
    { loId: 'appsych.intelligence', content: `STANFORD-BINET (Lewis Terman, 1916, adapted from Binet's 1905 scale): used the original RATIO formula IQ = (mental age divided by chronological age) times 100, where mental age is set by which age-level tasks a child can pass. The ratio formula breaks down for adults because mental age plateaus while chronological age keeps rising.` },
    { loId: 'appsych.intelligence', content: `WECHSLER SCALES (the most common today): WAIS for adults, WISC for children, WPPSI for preschoolers, each with verbal and performance subscales. Modern DEVIATION IQ scoring sets the MEAN at 100 and the STANDARD DEVIATION at 15, producing a normal (bell-curve) distribution — a person 1.33 SDs above the mean scores about 120.` },
    { loId: 'appsych.intelligence', content: `TEST PROPERTIES (know all three): RELIABILITY is consistency — the same result on retesting (modern IQ tests reach test-retest correlations of about .9). VALIDITY is measuring what is claimed — content validity (samples the relevant material), construct validity (captures the underlying trait), and predictive validity (IQ predicts academic and job outcomes, modestly). STANDARDIZATION means administering to a representative sample to establish NORMS. CULTURE-FAIR tests try to minimize cultural bias.` },
    { loId: 'appsych.intelligence', content: `DISTRIBUTION AND HERITABILITY: about 95% of people score between 70 and 130 (within 2 SDs); below 70 indicates cognitive disability, above 130 gifted. Twin studies (identical twins reared apart correlate around .7-.8) and adoption studies put IQ heritability at roughly 50-80% in adults, and heritability INCREASES with age as gene influence accumulates. Crucial caveat: heritability is a POPULATION-level statistic — it does NOT say your own IQ is mostly genetic.` },
    { loId: 'appsych.intelligence', content: `ENVIRONMENT AND GROUP DIFFERENCES: education, nutrition, parental engagement, and socioeconomic status all affect IQ. The FLYNN EFFECT — IQ scores rising about 3 points per decade worldwide — cannot be genetic (far too fast) and points to better nutrition, schooling, and more abstract reasoning in modern life. Average score differences BETWEEN groups are mostly explained by environment (poverty, education access, STEREOTYPE THREAT — anxiety about confirming a negative stereotype that depresses performance); about 85% of variance is WITHIN groups, genetic between-group explanations are not well supported, and gaps NARROW with educational intervention.` },
    { loId: 'appsych.intelligence', kind: 'definition', title: 'g (general intelligence)', content: `Spearman's single underlying cognitive ability expressed across all tasks.` },
    { loId: 'appsych.intelligence', kind: 'definition', title: 'fluid intelligence', content: `the ability to solve novel problems and reason quickly; peaks in the 20s.` },
    { loId: 'appsych.intelligence', kind: 'definition', title: 'Flynn effect', content: `the worldwide rise of about 3 IQ points per decade; environmental, not genetic.` },
  ],
  methods: [
    {
      title: 'Compute IQ two ways (ratio vs deviation)',
      steps: [
        `STEP 1 — RATIO IQ (original Stanford-Binet): IQ equals mental age divided by chronological age, times 100.`,
        `STEP 2 — DEVIATION IQ (modern Wechsler): start at the mean of 100 and add the number of standard deviations above the mean times 15 (subtract for below).`,
        `STEP 3 — REMEMBER WHY MODERN TESTS SWITCHED: the ratio formula fails for adults because mental age plateaus while chronological age keeps rising, which would make IQ falsely decline with age.`,
      ],
      example: {
        problem: `A 10-year-old performs at the level of a 12-year-old. (a) Ratio-formula IQ? (b) Deviation IQ if the score is 1.33 SDs above the mean (mean 100, SD 15)?`,
        solution: `(a) Ratio IQ = (12 divided by 10) times 100 = 120. (b) Deviation IQ = 100 + 1.33 times 15 = 100 + 20 = 120. Both give 120 here; deviation scoring is preferred because it works for adults.`,
      },
      relatedLoIds: ['appsych.intelligence'],
    },
    {
      title: 'Argue that the Flynn effect is environmental',
      steps: [
        `STEP 1 — QUANTIFY THE CHANGE: about 3 points per decade over roughly a century is around 30 IQ points — a very large shift.`,
        `STEP 2 — RULE OUT GENETICS: allele frequencies cannot change that fast; genetic evolution operates over thousands of years, not a single century, so the cause must be ENVIRONMENTAL.`,
        `STEP 3 — LIST ENVIRONMENTAL CAUSES: better nutrition, more years of schooling and abstract-reasoning practice, media and technology exposure, fewer childhood infections, improved prenatal care, and reduced lead exposure.`,
        `STEP 4 — NOTE THE CAVEAT: the effect appears to be SLOWING in developed countries, possibly nearing a ceiling.`,
      ],
      example: {
        problem: `Average IQ has risen about 3 points per decade for a century. (a) What rules out a genetic explanation? (b) Name three environmental causes.`,
        solution: `(a) The change is far too fast for genetic evolution — allele frequencies cannot shift ~30 points in 100 years — so it must be environmental. (b) Better nutrition, more education and abstract-reasoning practice, and greater media/technology exposure (also fewer infections, better prenatal care, less lead).`,
      },
      relatedLoIds: ['appsych.intelligence'],
    },
  ],
  pointers: [
    { content: 'Theories: Spearman (g), Sternberg (analytical/creative/practical), Gardner (8 multiple), Goleman (EQ), Cattell (fluid/crystallized).', kind: 'tip' },
    { content: 'Crystallized (knowledge) rises with age; fluid (novel reasoning) peaks in the 20s.', kind: 'tip' },
    { content: 'Modern IQ: mean 100, SD 15, bell curve. Old ratio formula = mental/chronological age times 100.', kind: 'tip' },
    { content: 'Reliability = consistency; validity = measures what it claims; standardization = norms from a representative sample.', kind: 'tip' },
    { content: 'Heritability of IQ is 50-80% at the POPULATION level — it does not fix any individual\'s IQ.', kind: 'tip' },
    { content: 'Flynn effect (~3 points/decade) and stereotype threat both show environment shapes measured intelligence.', kind: 'tip' },
  ],
};
