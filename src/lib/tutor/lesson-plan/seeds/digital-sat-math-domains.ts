/**
 * Digital SAT — Math: Four Content Domains and Desmos Strategy.
 *
 * Math is one merged section (no more no-calculator section). 44 questions
 * across 2 adaptive modules. Calculator allowed throughout. Desmos is
 * built into Bluebook.
 */

import type { LessonPlan } from '../types';

export const SEED_DIGITAL_SAT_MATH_DOMAINS: LessonPlan = {
  id: 'evelyn.testprep.digital-sat.math-domains.v1',
  title: 'Digital SAT Math: Four Content Domains and Desmos Strategy',
  curriculum: 'CollegeBoard',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'sat-math-full',
  locale: 'en',
  los: [
    {
      id: 'digital-sat.math-domains',
      description: 'Identify the four Math content domains on the Digital SAT, recognize the question types in each, and apply Desmos and free-response strategies appropriate to the digital format.',
      standard: 'SAT-DIGITAL-MATH',
    },
  ],
  prerequisites: ['digital-sat.format-overview'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Math content didn\'t change much, but the format and tools did.',
      script: 'The Digital SAT Math content is mostly the same algebra, geometry, and data analysis as the paper test. Two big differences: there\'s no separate "no-calculator" section anymore (you can use Desmos for every question), and ~25% of questions are STUDENT-PRODUCED RESPONSES where you type a number/expression instead of picking from four. Master the four content domains and the smart use of Desmos, and Math becomes the most predictable section on the test.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-domains',
      kind: 'concept',
      goal: 'Four Math domains, weighting, question types.',
      keyIdeas: [
        'ALGEBRA (~13-15 questions, ~35%): linear equations, linear functions, systems of linear equations, linear inequalities. Most questions are word-problem-modeled — translating a context into a linear equation and solving.',
        'ADVANCED MATH (~13-15 questions, ~35%): quadratics, exponential functions, polynomial functions, rational functions, function notation, equivalent algebraic expressions. Often the trickiest domain.',
        'PROBLEM-SOLVING AND DATA ANALYSIS (~5-7 questions, ~15%): ratios, rates, proportions, percentages, units conversion, probability, two-way tables, statistical inference, scatterplots, mean/median/standard deviation interpretation.',
        'GEOMETRY AND TRIGONOMETRY (~5-7 questions, ~15%): area, volume, lines and angles, triangles (including 30-60-90, 45-45-90, similar triangles), circles (arc length, sector area, circle equations), right-triangle trig (SOH-CAH-TOA), unit-circle trig values, complex numbers.',
        'QUESTION FORMATS: ~75% are 4-option multiple choice. ~25% are STUDENT-PRODUCED RESPONSE (SPR) — you type your answer. SPR can accept fractions, decimals, integers; some questions accept multiple correct values.',
        'DESMOS GRAPHING CALCULATOR is embedded in Bluebook. Use it for: solving equations graphically, evaluating expressions, plotting functions to spot intercepts/extrema, generating quick approximations. Don\'t over-rely — sometimes algebra is faster.',
        'REFERENCE SHEET is provided in Bluebook with: areas / volumes of common shapes (rectangle, triangle, circle, sphere, cylinder, cube, cone), 30-60-90 + 45-45-90 special triangles, total degrees in a circle (360) and triangle (180), arc length and sector formulas. Memorize what\'s NOT on the sheet (e.g., specific trig values, log rules).',
        'DOMAIN ORDER within a module mixes domains; questions are arranged ROUGHLY by difficulty (easier first, harder later). Pacing tip: don\'t spend 4 minutes on a single SPR when 3 quicker MCQs are still ahead.',
      ],
      vocabulary: [
        { term: 'Student-Produced Response (SPR)', definition: 'a Digital SAT Math question where the student types a numeric answer rather than choosing from four options.' },
        { term: 'Desmos', definition: 'a graphing calculator embedded in Bluebook; available for every Math question on the Digital SAT.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-desmos',
      kind: 'concept',
      goal: 'When Desmos saves time vs when algebra is faster.',
      keyIdeas: [
        'DESMOS WINS for: graphing systems (find intersection point), checking your algebraic answer (plug into f(x), see if it equals 0), spotting extrema (graph and look at vertex), inequality regions (shade the solution set).',
        'DESMOS LOSES (algebra faster) for: simple linear equations, plug-and-chug formulas, problems where the answer is symbolic (not numeric).',
        'STUDENT-PRODUCED RESPONSE GOTCHA: SPR answers must be in correct format — fractions need both num and denom (no spaces), decimals need enough precision (often 4 digits). If unsure, enter a decimal — Bluebook accepts both forms.',
        'SCATTERPLOT QUESTIONS: paste data points into a Desmos table, then enter a regression model (y = a·x + b) — Desmos returns best-fit values for a and b in seconds.',
        'CHECKING WORK: when you have a multiple-choice answer with 4 options, plug them into Desmos one by one and see which makes the equation true. Often faster than solving the equation by hand for advanced math.',
        'TIME BUDGET: Math is 22 questions in 35 minutes per module = ~95 seconds per question on average. Spend less on early easier ones to bank time for later harder ones.',
      ],
      vocabulary: [
        { term: 'regression', definition: 'fitting a model (e.g., line or curve) to data points; Desmos can compute least-squares regression instantly.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-desmos',
      kind: 'worked_example',
      problem: 'Solve the system: 3x + 2y = 12 and y = x − 1. Use the fastest Bluebook approach.',
      steps: [
        'OPTION 1 (algebra): substitute y = x − 1 into the first equation. 3x + 2(x − 1) = 12 → 3x + 2x − 2 = 12 → 5x = 14 → x = 2.8, y = 1.8. ~30 seconds.',
        'OPTION 2 (Desmos): type both equations in. Two lines render; click the intersection point, Desmos shows (2.8, 1.8). ~15 seconds.',
        'For SIMPLE linear systems, both are fast. For NONLINEAR systems (quadratic + line, two parabolas), Desmos is dramatically faster.',
        'PRACTICE: try every system of equations BOTH ways before the test so you know which is faster for which type.',
      ],
      answer: 'x = 2.8, y = 1.8. Desmos is slightly faster for this linear system; clearly faster for nonlinear.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A scatterplot question gives 8 data points and asks for the slope of the best-fit line. What\'s the fastest Bluebook strategy?',
      expectedAnswer: 'Open Desmos, create a table, paste in the 8 (x, y) points, then type "y₁ ~ a·x₁ + b" — Desmos computes a (slope) and b (y-intercept) in seconds. Hand-computing the slope from 8 points takes 2-3 minutes.',
      responseFormat: 'free',
      hints: [
        'Desmos has a regression feature. Tilde "~" means "fit this model".',
        'Best-fit line slope = a in y₁ ~ a·x₁ + b.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-no-calc',
      kind: 'misconception_check',
      question: 'Like the paper SAT, the Digital SAT has a no-calculator section where you have to do all algebra by hand. True or false?',
      commonErrors: [
        {
          answer: 'true',
          misconception: 'Carrying over the paper-SAT structure.',
          correctsTo: 'False. The Digital SAT eliminated the no-calculator section. You may use Desmos (built into Bluebook) for EVERY math question. This is one of the biggest format changes — students who prepared with old materials sometimes still drill no-calc problems and skip Desmos training. The new strategy: become FAST with Desmos. It can save you 5-10 minutes per Math section if you use it well.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Four domains: Algebra (35%), Advanced Math (35%), Problem-Solving & Data Analysis (15%), Geometry & Trig (15%).',
        '~75% multiple choice, ~25% Student-Produced Response.',
        'Calculator throughout. Desmos built into Bluebook — use it for graphing, regression, and checking answers.',
        '95 seconds per question average. Don\'t over-spend on early easy items.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why did College Board allow Desmos throughout instead of keeping a no-calculator section?',
      hint: 'Two reasons. (1) The Digital SAT is shorter — splitting math into two short calc/no-calc subsections felt cramped, and adaptive routing within them got complex. (2) Real college and career math is calculator-allowed; the no-calc section was a relic of paper-test logistics, not pedagogy. With Desmos universal, the test better reflects how students actually do math today. Trade-off: students who relied on no-calc-strong skills lose that signal in their score.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
