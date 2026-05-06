/**
 * IB DP Math AI (Applications & Interpretation) — anchor plan covering
 * the practical / modelling orientation of AI vs the proof-heavy AA.
 */

import type { LessonPlan } from '../types';

export const SEED_IB_MATH_APPLICATIONS: LessonPlan = {
  id: 'evelyn.ibdp.ai.applications.v1',
  title: 'IB Math AI — modelling, technology, and real-world applications',
  curriculum: 'IB-DP',
  grade: '11-12',
  subject: 'math',
  topic: 'ib-math-applications',
  locale: 'en',
  los: [
    {
      id: 'ibdp.ai.applications-overview',
      description: 'Understand the orientation, assessment shape, and characteristic problem types of IB Math Applications & Interpretation (AI).',
      standard: 'IB-DP-MATH-AI',
    },
  ],
  prerequisites: ['g912.math.linear-functions'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'AI is the modelling-first IB math course — chosen by students whose mathematics lives downstream of real data.',
      script: 'IB Math AA is built around proof and pure-math elegance. AI is built around the question "given some real data, what model fits, what does it predict, and how confident should I be?" Today we map the AI assessment shape and the moves examiners reward — modelling, technology use, and interpretation.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-ai-shape',
      kind: 'concept',
      goal: 'Course orientation, assessment shape, GDC use, modelling cycle.',
      keyIdeas: [
        'TWO COURSES, TWO ORIENTATIONS. AA = analysis & approaches (proof, abstraction, calculus depth). AI = applications & interpretation (modelling, statistics, technology). Both run SL and HL.',
        'AI assessment: Paper 1 (short-response, GDC permitted), Paper 2 (extended-response, GDC permitted), Internal Assessment (a 12-20 page mathematical exploration on a topic of student choice — 20% of grade).',
        'GDC IS REQUIRED on both papers. Knowing your TI-Nspire / TI-84 / Casio for fitting regressions, integrating numerically, and statistical inference is non-negotiable.',
        'TOPICS: Number & algebra (incl. logs, exponentials), Functions (modelling — linear, quadratic, exponential, sinusoidal, logistic), Geometry & trig (incl. Voronoi diagrams), Statistics & probability (regression, chi-squared, hypothesis testing), Calculus (numerical for SL, more analytical for HL).',
        'MODELLING CYCLE rewarded across the course: 1) read the situation, 2) propose a model with assumptions, 3) fit/parameterise (often via GDC), 4) test against data, 5) refine, 6) interpret in context.',
        'INTERPRET RESULTS in real-world units. If your regression gives slope 1.2 and your data is hours-vs-dollars, the slope is "$1.20 per hour" — examiners want the unit attached.',
        'CHI-SQUARED is the most common AI inferential test. Memorise the workflow: state H₀, state H₁, calculate expected, compute χ² statistic, compare to critical value or p-value, conclude in context.',
        'HL extras include Markov chains, complex numbers (eigenvalues), graph theory, and more sophisticated modelling.',
      ],
      vocabulary: [
        { term: 'modelling cycle', definition: 'the iterative process of proposing a mathematical model, fitting it to data, testing, refining, and interpreting back into the real-world context.' },
        { term: 'GDC', definition: 'graphics display calculator (TI-84/Nspire, Casio) — required tool in IB Math AI; problems are designed assuming you can call regression, integration, and inference functions.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-regression',
      kind: 'worked_example',
      problem: 'A scientist measures bacterial population over 6 hours: (0, 100), (1, 145), (2, 215), (3, 320), (4, 480), (5, 720), (6, 1080). Choose a model, fit it, and interpret.',
      steps: [
        'Inspect: ratios between successive y-values are roughly 1.45, 1.48, 1.49, 1.50, 1.50, 1.50 — approximately constant. Constant ratio ⟹ exponential growth.',
        'Model: P(t) = A · b^t.',
        'Fit via GDC exponential regression: A ≈ 96.5, b ≈ 1.500.',
        'Interpretation in context: initial population ≈ 96.5 (close to the observed 100); population multiplies by ≈ 1.5 each hour — that is, grows by ≈ 50% per hour.',
        'Check fit: P(3) = 96.5 × 1.5³ ≈ 326. Observed: 320. Close — model fits well.',
        'Predict and discuss: P(10) = 96.5 × 1.5¹⁰ ≈ 5570. But warn — exponential models do not hold indefinitely; the population will hit a resource ceiling. A logistic model would be more realistic for long-term prediction. Examiners reward this kind of caveat.',
      ],
      answer: 'Exponential model P(t) ≈ 96.5 · 1.50^t fits well; growth ≈ 50%/hour; logistic refinement needed for long-term.',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Examiners want both a numerical answer AND interpretation in context. Why?',
      expectedAnswer: 'Because the course tests whether you can move BETWEEN mathematics and the real situation it models. A number with no units, no comparison to data, no acknowledgement of model assumptions is half an answer — the interpretive half is what distinguishes AI from raw computation. Loss-of-marks happens when the math is right but the answer is "k = 1.5" without "the population grows 50% per hour."',
      responseFormat: 'free',
      hints: [
        'AI is "Applications & Interpretation" — what does the second word emphasise?',
        'A number alone is not an answer to a real-world question.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-aa-vs-ai',
      kind: 'misconception_check',
      question: 'A student picks AI because they "find AA too hard," then is surprised to score lower than they expected. What is the common misunderstanding?',
      commonErrors: [
        {
          answer: 'AI is the easier course',
          misconception: 'Treating AI as "AA-lite" rather than as a different orientation.',
          correctsTo: 'AI is not easier — it is differently demanding. AA rewards proof fluency and analytical calculus; AI rewards modelling judgement, technology fluency, and statistical interpretation. Students who picked AI to escape proof but expect rote-procedure rewards are surprised by the IA (a 12-20 page independent investigation that requires genuine modelling decisions) and by the interpretation marks on every paper. Pick AI because the orientation matches your subjects and intended degree (life sciences, geography, business, design), not because it sounds easier.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'AI = modelling, statistics, technology. AA = proof, abstraction, calculus.',
        'GDC required on both papers — drill regression, integration, χ² workflows.',
        'Modelling cycle: situation → model + assumptions → fit → test → refine → interpret.',
        'Interpret results in real-world units; flag model limitations.',
        'IA is 20% of grade — start choosing your topic in year 1.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'When does Voronoi diagram thinking actually matter — and why is it on the AI syllabus?',
      hint: 'Voronoi partitions a plane into regions closest to each of a set of seed points. Real applications: which hospital ER is nearest to a given postcode (closest-facility problems), cell-tower coverage, sports analytics (defender coverage zones), epidemiology (catchment for vaccination centres). On the AI syllabus because it is the cleanest example of how a geometric construction directly answers a logistical real-world question — exactly the orientation AI rewards.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
