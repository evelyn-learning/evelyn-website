/**
 * AP Statistics — CED Unit 2.1+2.2+2.3: Two Categorical Variables.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_STATS_U2_TWO_CATEGORICAL: LessonPlan = {
  id: 'evelyn.ap.stats.two-categorical-relationships.v1', title: 'U2.1 Two Categorical Variables',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-statistics', locale: 'en',
  los: [{ id: 'apstats.two-categorical-relationships', description: 'Investigate association between two categorical variables using two-way tables, segmented bar graphs, and conditional distributions. Identify when an association exists.', standard: 'AP-STATS-2.1-2.3' }],
  prerequisites: ['apstats.normal-distribution'], followUps: ['apstats.scatterplots'], estimatedMinutes: 18,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame association.', script: "When two variables BOTH measured on the same individuals seem connected, we say they're ASSOCIATED. For two categorical variables: do the conditional distributions differ across categories?", estimatedMinutes: 2 },
    { id: 'concept-twoway', kind: 'concept', goal: 'Cover two-way tables + association.',
      keyIdeas: [
        'TWO-WAY TABLE shows joint counts of two categorical variables. Rows = one variable, columns = the other.',
        'JOINT FREQUENCY: count in a single cell. JOINT RELATIVE FREQUENCY: that count divided by the GRAND TOTAL.',
        'MARGINAL DISTRIBUTION: row totals or column totals — distribution of ONE variable, ignoring the other.',
        'CONDITIONAL DISTRIBUTION: distribution of one variable WITHIN A GIVEN LEVEL of the other. Example: "of those who study >5h, what % pass?" — divide by the row total.',
        'ASSOCIATION between two categorical variables: the conditional distributions DIFFER across categories of the other variable. NO ASSOCIATION (independence): the conditional distributions are the same regardless of category.',
        'SEGMENTED (stacked) BAR GRAPH: each bar represents one category of one variable; the bar is split into colored segments for the conditional distribution. Easy to spot association — bars look identical (no association) or different (association).',
        'MOSAIC PLOT: like a segmented bar graph but bar widths reflect marginal frequencies — visualizes both joint and conditional structure.',
        'KEY: percentages within each row should sum to 100% (or within each column — pick one direction and stick with it).',
      ],
      vocabulary: [
        { term: 'association', definition: 'two variables are associated if their conditional distributions differ.' },
        { term: 'joint frequency', definition: 'count in a single cell of a two-way table.' },
      ],
      estimatedMinutes: 5 },
    { id: 'worked-association', kind: 'worked_example',
      problem: 'A school surveys 200 students about whether they exercise daily and whether they get 8+ hours of sleep. Results: of the 120 who exercise, 80 get 8+ hours. Of the 80 who don\'t exercise, 30 get 8+ hours. Is there an association?',
      steps: [
        'STEP 1 — Conditional distribution of sleep GIVEN exercise: 80/120 = 66.7% get 8+ hours.',
        'STEP 2 — Conditional distribution of sleep GIVEN no exercise: 30/80 = 37.5% get 8+ hours.',
        'STEP 3 — Compare: 66.7% vs 37.5%. The conditional distributions DIFFER substantially.',
        'STEP 4 — There IS an association between exercising daily and getting 8+ hours of sleep. Among exercisers, a much higher percentage gets sufficient sleep.',
      ],
      answer: 'Yes — association exists; daily exercisers are more likely to get 8+ hours sleep (66.7% vs 37.5%).', estimatedMinutes: 4 },
    { id: 'try-conditional', kind: 'try_yourself',
      problem: 'A two-way table records voting (yes/no) by age group (under 30, 30+). Under 30: 40 voted, 60 didn\'t. 30+: 100 voted, 50 didn\'t. (a) Conditional probability of voting given under 30. (b) Given 30+. (c) Is there an association?',
      expectedAnswer: '(a) 40/(40+60) = 40/100 = 40%. (b) 100/(100+50) = 100/150 = 66.7%. (c) The 30+ group has a higher voting rate (66.7% vs 40%). YES, age and voting are associated in this sample.',
      responseFormat: 'free', hints: ['Divide by row totals.'], estimatedMinutes: 3 },
    { id: 'try-synthesis', kind: 'try_yourself',
      problem: 'AP-style synthesis. A study looks at smoking status (smoker / nonsmoker) and disease (yes / no) in a sample of 500. Smokers: 30 with disease, 70 without. Nonsmokers: 20 with disease, 380 without. (a) Compute the conditional disease rates. (b) Construct in words a segmented bar graph (no need to draw): describe what it would look like. (c) Conclude about association.',
      expectedAnswer: '(a) Smokers: 30/100 = 30% with disease. Nonsmokers: 20/400 = 5% with disease. (1.5)\n(b) Two bars (smoker, nonsmoker) each split into "disease" (red) and "no disease" (green). Smoker bar: 30% red on bottom, 70% green on top. Nonsmoker bar: 5% red on bottom, 95% green on top. The bars look very different — clear visual signal of association. (2)\n(c) Strong association. The disease rate among smokers (30%) is six times the rate among nonsmokers (5%). (1.5)\nTotal: 5 points.',
      responseFormat: 'frq', hints: ['Conditional rates → segmented bar interpretation → conclude.'], estimatedMinutes: 4 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'Association: conditional distributions DIFFER across categories.',
      'Marginal vs conditional: marginal = row/col totals; conditional = within a row or column.',
      'Segmented bar graphs make association visible.',
      'Always state association IN CONTEXT.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '2', cedTopic: '2.1-2.3', cedTitle: 'Two Categorical Variables', sources: [{ type: 'concept', book: 'tps5e', chapter: '1', note: 'Standard two-way / association.' }] },
};
