/**
 * Test plan — exercises all 3 Phase-11 statistics diagram kinds in one
 * lesson:
 *   1. histogram
 *   2. normal_curve
 *   3. scatterplot_regression
 *
 * Same pattern as the deleted Calc tour: each concept segment has a
 * teacherNote that pins the brain to a specific kind and supplies the
 * parameter shape so the tool call reliably fires within the brain's
 * output-token budget.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_TEST_STATS_DIAGRAMS_TOUR: LessonPlan = {
  id: 'evelyn.test.stats-diagrams-tour.v1',
  title: 'Stats Diagram Tools — Visual Tour',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-statistics', locale: 'en',
  los: [{ id: 'test.apstats.diagrams', description: 'Brief tour exercising the three AP Statistics diagram tools (histogram, normal_curve, scatterplot_regression) in a single session.', standard: 'INTERNAL-TEST' }],
  prerequisites: [], followUps: [], estimatedMinutes: 15,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the session as a quick visual tour of three AP Statistics diagram tools.',
      script: "Quick visual tour of three Stats diagrams — histogram, normal curve, and scatterplot with regression line. One picture each; we move fast.",
      estimatedMinutes: 1,
    },

    {
      id: 'concept-histogram',
      kind: 'concept',
      goal: 'Show a histogram of test scores with mean and median markers.',
      teacherNote: 'EMIT EXACTLY ONE show_diagram with kind="histogram". Use 6 bins covering test scores 50-100. USE TUPLE FORMAT [lower, upper, count] to save tokens. Mean ≈ 78.5, median ≈ 79.5 (slightly left-skewed). params shape: { bins: [[50,60,2],[60,70,5],[70,80,12],[80,90,9],[90,100,4]], xMin:50, xMax:100, xLabel:"Test score", yLabel:"Frequency", title:"Test scores (n = 32)", showCounts:true, mean:78.5, median:79.5 }. Do NOT promise a follow-up diagram.',
      keyIdeas: [
        'A histogram shows frequency over EQUAL-WIDTH BINS for a quantitative variable.',
        'Bars TOUCH (no gaps) — that distinguishes histograms from bar charts.',
        'Bin width affects detail; 5–15 bins is typical.',
        'Compare mean vs median: if mean < median, distribution is LEFT-skewed; if mean > median, RIGHT-skewed.',
      ],
      vocabulary: [{ term: 'histogram', definition: 'graph of frequencies over equal-width intervals; bars touch.' }],
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 4,
    },

    {
      id: 'concept-normal-curve',
      kind: 'concept',
      goal: 'Show the standard normal curve with the empirical-rule region (μ ± 2σ) shaded.',
      teacherNote: 'EMIT EXACTLY ONE show_stats call with type="distribution". Use SAT scores: mean = 1050, sd = 200. Shade the middle 95% region (between 650 and 1450). The probabilityLabel "≈ 95%" is rendered with high contrast (dark text + white halo). Param shape: { type:"distribution", title:"SAT scores N(1050, 200) — middle 95%", xLabel:"SAT score", distribution:{ family:"normal", params:{mean:1050, sd:200}, shade:{type:"between", a:650, b:1450, color:"#3b82f6"}, showMean:true, probabilityLabel:"≈ 95%" } }. Do NOT show a follow-up.',
      keyIdeas: [
        'A normal distribution N(μ, σ) is the bell curve with mean μ and SD σ.',
        'Empirical rule (68-95-99.7): about 95% of values lie within ±2 SDs of the mean.',
        'For SAT N(1050, 200): about 95% of test-takers score between 650 and 1450.',
        'Shaded area = probability of falling in that region.',
      ],
      vocabulary: [{ term: 'normal distribution', definition: 'bell-shaped distribution N(μ, σ).' }],
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 4,
    },

    {
      id: 'concept-scatterplot-regression',
      kind: 'concept',
      goal: 'Show a scatterplot of study hours vs test score with the LSRL.',
      teacherNote: 'EMIT EXACTLY ONE show_stats call with type="scatter". Use 12 students: x = study hours, y = test score. Strong positive linear association. With showTrendLine:true the LSRL, r, and r² are auto-computed from the points. Param shape: { type:"scatter", title:"Study hours vs test score (n = 12)", xLabel:"Study hours", yLabel:"Test score", points:[{x:1,y:62},{x:2,y:70},{x:2,y:68},{x:3,y:75},{x:3,y:72},{x:4,y:78},{x:4,y:82},{x:5,y:80},{x:5,y:85},{x:6,y:86},{x:6,y:89},{x:7,y:91}], showTrendLine:true }. Do NOT show variants. (Optional: pass equationLabel, regression, rValue, rSquared, highlightPoint, showResiduals if you want to override or annotate.)',
      keyIdeas: [
        'A scatterplot displays bivariate quantitative data.',
        'The LSRL minimizes sum of squared residuals.',
        'r measures strength + direction of LINEAR association: -1 ≤ r ≤ 1.',
        'r² = proportion of variation in y explained by linear regression on x.',
      ],
      vocabulary: [{ term: 'LSRL', definition: 'least-squares regression line: ŷ = a + bx.' }],
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 5,
    },

    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Three Stats visualizations shipped: histogram, normal_curve, scatterplot_regression.',
        'Tuple-format params keep tool calls within token budget.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: 'TEST',
    cedTopic: 'diagrams',
    cedTitle: 'Stats Diagram Tools Test',
    sources: [{ type: 'internal-test', source: 'AP Plans Initiative', note: 'Single plan exercising all three Phase-11 statistics diagram tools.' }],
  },
};
