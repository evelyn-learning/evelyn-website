/**
 * AP Calculus BC — CED Unit 10.14+10.15: Maclaurin Series for Common
 * Functions; Manipulating Power Series.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_CALCBC_U10_MACLAURIN_SERIES: LessonPlan = {
  id: 'evelyn.ap.calcbc.maclaurin-series.v1', title: 'U10.14 Common Maclaurin Series and Manipulation',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-calculus-bc', locale: 'en',
  los: [{ id: 'apcalcbc.maclaurin-series', description: 'Recall Maclaurin series for e^x, sin x, cos x, 1/(1 − x), ln(1 + x), arctan x. Manipulate via substitution, differentiation, and integration to derive new series.', standard: 'AP-CALCBC-10.14-10.15' }],
  prerequisites: ['apcalcbc.power-series'], followUps: [], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame the toolkit.', script: "Memorize 5 Maclaurin series and you can derive ANY series you'll see on the AP exam — by substitution, differentiation, or integration. AP loves this kind of manipulation.", estimatedMinutes: 2 },
    { id: 'concept-maclaurin', kind: 'concept', goal: 'List the canonical Maclaurin series + manipulations.',
      keyIdeas: [
        'CANONICAL MACLAURIN SERIES (memorize):',
        '  • e^x = Σ x^n/n! = 1 + x + x²/2! + x³/3! + ...  (R = ∞)',
        '  • sin x = Σ (-1)^n x^{2n+1}/(2n+1)! = x − x³/3! + x⁵/5! − ...  (R = ∞)',
        '  • cos x = Σ (-1)^n x^{2n}/(2n)! = 1 − x²/2! + x⁴/4! − ...  (R = ∞)',
        '  • 1/(1 − x) = Σ x^n = 1 + x + x² + x³ + ...  (R = 1, IOC: -1 < x < 1)',
        '  • ln(1 + x) = Σ (-1)^{n+1} x^n/n = x − x²/2 + x³/3 − ...  (R = 1, IOC: -1 < x ≤ 1)',
        '  • arctan x = Σ (-1)^n x^{2n+1}/(2n+1) = x − x³/3 + x⁵/5 − ...  (R = 1, IOC: -1 ≤ x ≤ 1)',
        'MANIPULATION TECHNIQUES:',
        '  • SUBSTITUTION: Replace x with another expression. e.g., e^{x²} = Σ x^{2n}/n! (substitute x² for x in e^x).',
        '  • DIFFERENTIATION: Differentiate a known series term-by-term. Same R; endpoints may change.',
        '  • INTEGRATION: Integrate term-by-term. Same R; endpoints may change.',
        '  • MULTIPLICATION BY A POWER OF x: shift indices. e.g., x · e^x = Σ x^{n+1}/n!.',
        'EXAMPLE — Series for x e^x: Multiply e^x by x: x · Σ x^n/n! = Σ x^{n+1}/n! = x + x² + x³/2! + ...',
        'EXAMPLE — Series for sin(x²): Substitute x² into sin x: Σ (-1)^n (x²)^{2n+1}/(2n+1)! = Σ (-1)^n x^{4n+2}/(2n+1)!.',
        'EXAMPLE — Series for 1/(1 − x²) = Σ (x²)^n = Σ x^{2n} (substituting x² into 1/(1 − x)).',
      ],
      vocabulary: [{ term: 'Maclaurin series', definition: 'Taylor series about 0.' }],
      estimatedMinutes: 6 },
    { id: 'worked-substitution', kind: 'worked_example', problem: 'Find the Maclaurin series for f(x) = e^{-x²}.',
      steps: [
        'STEP 1 — Start with e^u = Σ u^n/n!.',
        'STEP 2 — Substitute u = -x². e^{-x²} = Σ (-x²)^n/n! = Σ (-1)^n x^{2n}/n!.',
        'STEP 3 — Expanded: 1 − x² + x⁴/2! − x⁶/3! + x⁸/4! − ... R = ∞.',
      ],
      answer: 'e^{-x²} = Σ (-1)^n x^{2n}/n!', estimatedMinutes: 4 },
    { id: 'try-derivative', kind: 'try_yourself', problem: 'Use the Maclaurin series for ln(1 + x) to find the Maclaurin series for 1/(1 + x).',
      expectedAnswer: 'd/dx[ln(1+x)] = 1/(1+x). Differentiate term-by-term: d/dx[Σ (-1)^{n+1} x^n/n] = Σ (-1)^{n+1} x^{n-1} = 1 − x + x² − x³ + ... = Σ (-1)^n x^n. (Same as substituting -x for x in 1/(1−x): 1/(1−(-x)) = 1/(1+x) = Σ (-x)^n = Σ (-1)^n x^n.)',
      responseFormat: 'free', hints: ['Differentiate the known ln(1+x) series.'], estimatedMinutes: 3 },
    { id: 'try-integral', kind: 'try_yourself', problem: 'Use the Maclaurin series for 1/(1 + x²) to derive the Maclaurin series for arctan x.',
      expectedAnswer: '1/(1 + x²) = 1/(1 − (-x²)) = Σ (-x²)^n = Σ (-1)^n x^{2n} = 1 − x² + x⁴ − x⁶ + .... Integrate term-by-term: arctan x = ∫ 1/(1+x²) dx = Σ (-1)^n x^{2n+1}/(2n+1) + C. At x = 0, arctan 0 = 0, so C = 0. arctan x = x − x³/3 + x⁵/5 − x⁷/7 + ... = Σ (-1)^n x^{2n+1}/(2n+1).',
      responseFormat: 'free', hints: ['Geometric series in x²; then integrate.'], estimatedMinutes: 4 },
    { id: 'try-synthesis', kind: 'try_yourself', problem: 'AP-style synthesis. Find the Maclaurin series for f(x) = x²·sin(x). Then use it to compute f^{(7)}(0).',
      expectedAnswer: 'sin x = x − x³/6 + x⁵/120 − x⁷/5040 + .... Multiply by x²: x²·sin(x) = x³ − x⁵/6 + x⁷/120 − x⁹/5040 + .... \nThe coefficient of x^7 in the Maclaurin series is 1/120. By Taylor coefficient formula: a_7 = f^{(7)}(0)/7!. So f^{(7)}(0)/7! = 1/120. f^{(7)}(0) = 7!/120 = 5040/120 = 42.',
      responseFormat: 'numeric', hints: ['Coefficient of x^7 = f^{(7)}(0)/7!.'], estimatedMinutes: 5 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'Memorize: e^x, sin x, cos x, 1/(1-x), ln(1+x), arctan x.',
      'Substitute, differentiate, integrate, or multiply by x^k to derive new series.',
      'Maclaurin coefficient: a_k = f^{(k)}(0)/k!.',
      'R is preserved by manipulation; endpoints may change for diff/int.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '10', cedTopic: '10.14-10.15', cedTitle: 'Maclaurin Series & Manipulation', sources: [{ type: 'concept', book: 'larson-calc-ap-ed', chapter: '9', note: 'Standard Maclaurin tables and manipulation.' }] },
};
