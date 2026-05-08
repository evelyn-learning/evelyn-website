/**
 * AP Calculus BC — CED Unit 1.1: Introducing Calculus — Can Change
 * Occur at an Instant?
 *
 * The course's opening conceptual question. Sets up why limits exist
 * (we need them to make sense of instantaneous rates of change) and
 * frames the rest of Unit 1.
 *
 * Plan 1 of AP Calc BC for the AP Plans Initiative — calibration
 * target. See project_ap_plans_initiative.md for the conventions.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_CALCBC_U1_INTRODUCING_CALCULUS: LessonPlan = {
  id: 'evelyn.ap.calcbc.introducing-calculus.v1',
  title: 'U1.1 Introducing Calculus: Can Change Occur at an Instant?',
  curriculum: 'AP',
  grade: '12',
  subject: 'math',
  topic: 'ap-calculus-bc',
  locale: 'en',
  los: [
    {
      id: 'apcalcbc.introducing-calculus',
      description:
        'Articulate the central question that motivates calculus — how to measure rates of change at a single instant — and distinguish average rate of change from instantaneous rate of change.',
      standard: 'AP-CALCBC-1.1',
    },
  ],
  prerequisites: [],
  followUps: ['apcalcbc.limits-graphical'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the "instantaneous rate" question feel impossible — then promise calculus solves it.',
      script:
        "Picture your speedometer at a single instant. It says 60 mph. But \"miles per hour\" is a ratio — distance OVER time. At a single INSTANT, no time has passed. Zero distance / zero seconds. How can the ratio be anything? Yet your speedometer shows a definite number. Calculus is the math we built to answer exactly that question — what does \"rate of change AT AN INSTANT\" even mean? The answer turns out to require limits, which is where this course begins.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-instant',
      kind: 'concept',
      goal: 'Define average vs instantaneous rate of change and motivate the role of limits.',
      keyIdeas: [
        'AVERAGE RATE OF CHANGE over an interval [a, b] = (f(b) − f(a)) / (b − a). The slope of the secant line through (a, f(a)) and (b, f(b)). Well-defined whenever b ≠ a.',
        'INSTANTANEOUS RATE OF CHANGE at a single point t = a is what we want when "rate at this moment" is the question. Naive ratio fails: numerator (Δf) and denominator (Δt) both go to 0 as we shrink the interval — we get 0/0, which is meaningless directly.',
        'KEY MOVE — TAKE A LIMIT. Compute average rate of change over a SHRINKING interval, and watch what number it approaches as the interval gets arbitrarily small. The number it approaches IS the instantaneous rate of change. This is the LIMIT of the difference quotient as Δt → 0.',
        'NOTATION: instantaneous rate of change of f at a = lim (h→0) [f(a+h) − f(a)] / h. Same thing as the DERIVATIVE f\'(a), which we will define formally in Unit 2.',
        'GEOMETRIC INTERPRETATION. As the interval [a, b] shrinks to a point, the SECANT line through (a, f(a)) and (b, f(b)) approaches the TANGENT line at (a, f(a)). The instantaneous rate of change is the SLOPE OF THE TANGENT at that point.',
        'CALCULUS IS THE MATHEMATICS OF CHANGE. Two main tools — DIFFERENTIATION (rate of change at a point — derivatives, units 2-5) and INTEGRATION (accumulated total change — integrals, units 6-8). Both are built on limits.',
        'WHY LIMITS ARE THE FOUNDATION. The 0/0 problem cannot be solved by ordinary algebra. Limits are the precise mathematical tool for asking "what value does this expression APPROACH?" — even when direct substitution gives an indeterminate form. Unit 1 develops the limit concept rigorously.',
      ],
      vocabulary: [
        { term: 'average rate of change', definition: '(f(b) − f(a)) / (b − a) — the slope of the secant line over the interval [a, b].' },
        { term: 'instantaneous rate of change', definition: 'the limit of average rates of change as the interval shrinks to a point; equals the derivative.' },
        { term: 'tangent line', definition: 'the line that touches a curve at a single point and shares the curve\'s direction there.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-falling-ball',
      kind: 'worked_example',
      problem:
        'A ball is dropped from rest. Its position (in meters) below the release point at time t (in seconds) is given by s(t) = 4.9 t². (a) Compute the average velocity from t = 1 to t = 2. (b) Compute the average velocity from t = 1 to t = 1.1. (c) Compute the average velocity from t = 1 to t = 1.01. (d) Predict the instantaneous velocity at t = 1 by examining the trend.',
      steps: [
        'STEP 1 — AVERAGE VELOCITY formula = Δs / Δt = [s(b) − s(a)] / (b − a).',
        'STEP 2 — (a) [s(2) − s(1)] / (2 − 1) = [4.9(4) − 4.9(1)] / 1 = (19.6 − 4.9) / 1 = 14.7 m/s.',
        'STEP 3 — (b) [s(1.1) − s(1)] / (1.1 − 1) = [4.9(1.21) − 4.9(1)] / 0.1 = (5.929 − 4.9) / 0.1 = 1.029 / 0.1 = 10.29 m/s.',
        'STEP 4 — (c) [s(1.01) − s(1)] / (1.01 − 1) = [4.9(1.0201) − 4.9(1)] / 0.01 = (4.99849 − 4.9) / 0.01 = 0.09849 / 0.01 = 9.849 m/s.',
        'STEP 5 — TREND. As the interval shrinks (1→2 to 1→1.1 to 1→1.01), the average velocities are 14.7, 10.29, 9.849, ... approaching about 9.8 m/s. PREDICTION: instantaneous velocity at t = 1 is approximately 9.8 m/s.',
        'STEP 6 — VERIFY by formula. Using calculus (Unit 2) we will show s\'(t) = 9.8 t, so s\'(1) = 9.8 m/s. ✓ The numerical limit matches the analytical answer. (Notice this is just gravitational acceleration on Earth; physics units check.)',
        'STEP 7 — INTUITION. Direct substitution at t = 1 with Δt = 0 gives [s(1)-s(1)]/0 = 0/0 — meaningless. The LIMIT process tells us what value the AVERAGE rate is converging to as Δt → 0. That convergent value IS the instantaneous rate.',
      ],
      answer: 'Avg velocities: 14.7, 10.29, 9.849 m/s (converging). Instantaneous velocity at t = 1 ≈ 9.8 m/s.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-define',
      kind: 'try_yourself',
      problem:
        'In your own words, explain the difference between AVERAGE RATE OF CHANGE and INSTANTANEOUS RATE OF CHANGE. Use the example of driving a car for 60 miles in 1 hour to illustrate when each is appropriate.',
      expectedAnswer:
        'AVERAGE RATE OF CHANGE = total change in output / total change in input over an interval. For driving 60 miles in 1 hour: average velocity = 60 / 1 = 60 mph. This says NOTHING about the speed at any specific moment during the drive — the car may have stopped at red lights and gone 90 mph on the freeway. INSTANTANEOUS RATE OF CHANGE = the rate at a single moment in time. The speedometer shows this — a number that may differ from moment to moment. The relationship: instantaneous rate is what average rate APPROACHES as the interval shrinks to a point. Average rates are easy to compute (just division); instantaneous rates require LIMITS because direct substitution at a point gives 0/0. Average tells you what happened over a span; instantaneous tells you what is happening RIGHT NOW.',
      responseFormat: 'free',
      hints: [
        'Average uses an interval; instantaneous uses a single point.',
        'A speedometer shows instantaneous speed; "miles per hour for the whole trip" is average.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-compute',
      kind: 'try_yourself',
      problem:
        'A particle moves along a line with position f(t) = t² + 3t (meters, with t in seconds). (a) Compute the average velocity from t = 2 to t = 3. (b) Compute the average velocity from t = 2 to t = 2.1. (c) Predict the instantaneous velocity at t = 2.',
      expectedAnswer:
        '(a) [f(3) − f(2)] / (3 − 2) = (9 + 9) − (4 + 6) / 1 = 18 − 10 = 8 m/s. (b) [f(2.1) − f(2)] / (2.1 − 2) = (4.41 + 6.3) − (4 + 6) / 0.1 = 10.71 − 10 = 0.71 / 0.1 = 7.1 m/s. (c) Trend: avg velocities 8, 7.1, ... shrinking. Predicted instantaneous velocity at t = 2 ≈ 7 m/s. (Confirmed by f\'(t) = 2t + 3, so f\'(2) = 7 m/s.)',
      responseFormat: 'numeric',
      hints: [
        'Compute f at each endpoint, then divide difference by interval length.',
        'Watch the trend as the interval shrinks: convergent value is the instantaneous rate.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-why-limits',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. Why can the instantaneous rate of change NOT be computed simply by setting Δt = 0 in the average-rate-of-change formula? Why do we need the LIMIT concept to make sense of "rate at an instant"?',
      expectedAnswer:
        'Setting Δt = 0 in the average-rate formula (Δf / Δt) gives 0/0 — both numerator and denominator are zero, and 0/0 is INDETERMINATE (no single value defined). Direct substitution can\'t answer the question. The LIMIT concept lets us ask a different question: as Δt approaches 0 (gets smaller and smaller WITHOUT actually reaching 0), what value does the ratio Δf/Δt approach? In well-behaved cases, the ratio converges to a definite number — that convergent value IS the instantaneous rate. For example, in our worked example, average velocities of 14.7, 10.29, 9.849, ... converge to 9.8 — even though directly plugging in Δt = 0 would have given 0/0. The LIMIT operation makes "rate at an instant" precise without ever actually computing a 0/0 division. Without limits, calculus would be impossible — every derivative, every integral, every concept in this course is built on the limit foundation. Strong answers explicitly: (i) identify the 0/0 problem with direct substitution, (ii) explain limits as "approaching, not reaching", (iii) connect this to why calculus needs limits.',
      responseFormat: 'frq',
      hints: [
        'What is the value of 0/0?',
        'How does "approaching" differ from "equaling"?',
        'Why is the LIMIT operation different from algebraic substitution?',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-zero-time',
      kind: 'misconception_check',
      question:
        "A student says: 'If you measure rate of change over a TIME OF ZERO, the rate must be zero — no time means no motion.' What's wrong?",
      commonErrors: [
        {
          answer: 'true — 0/0 must equal 0',
          misconception: 'Treating 0/0 as equal to 0 (or treating "zero seconds" as meaning "no movement happened").',
          correctsTo:
            "WRONG. Two errors here. (1) 0/0 is INDETERMINATE — it does not equal 0 (or any other specific value). It is a meaningless expression that direct algebra cannot evaluate. (2) The instantaneous rate is NOT computed by actually using zero time. We use a LIMIT — we compute average rates over INTERVALS THAT GET ARBITRARILY SHORT BUT NEVER ZERO, and watch what the ratio APPROACHES. The convergent value is the instantaneous rate. The car at 60 mph passes through the moment t = 1 second with a definite, nonzero rate of motion — even though no time has elapsed AT that instant. This counterintuitive fact (motion exists at an instant despite zero time elapsed there) is why calculus needed to invent the limit concept. Newton and Leibniz wrestled with this; the rigorous resolution came later via Cauchy and Weierstrass with the modern epsilon-delta definition.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Average rate of change over [a, b] = (f(b) − f(a)) / (b − a) — slope of the secant line.',
        'Instantaneous rate of change at t = a = limit of avg rates as the interval → 0 — slope of the tangent.',
        'The LIMIT is the math tool that makes "rate at an instant" meaningful (the 0/0 problem).',
        'Calculus = derivatives (rate of change) + integrals (accumulated change), both built on limits.',
        'Unit 1 develops the limit concept rigorously; the rest of the course applies it.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '1',
    cedTopic: '1.1',
    cedTitle: 'Introducing Calculus: Can Change Occur at an Instant?',
    sources: [
      { type: 'concept', book: 'larson-calc-ap-ed', chapter: '1', note: 'Larson Calculus AP ED — opening motivation for limits via instantaneous rate of change.' },
    ],
  },
};
