/**
 * Digital SAT — Math / Algebra: Linear Functions & Interpreting Slope/Intercept.
 *
 * Builds on one-variable linear equations: same y = mx + b machinery, but the
 * digital SAT's signature move is INTERPRETATION — reading slope and
 * intercept as real-world quantities (with units) rather than just solving
 * for them. Desmos is allowed on every math question; typing a modeled
 * equation in and tracing points is a fast interpretation check.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_DSAT_U1_LINEAR_FUNCTIONS: LessonPlan = {
  id: 'evelyn.testprep.dsat.linear-functions.v1',
  title: 'Linear Functions & Interpreting Slope/Intercept',
  curriculum: 'SAT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'digital-sat',
  locale: 'en',
  los: [
    {
      id: 'dsat.linear-functions',
      standard: 'DSAT-1.2',
      description:
        'Write linear functions in slope-intercept form, compute slope from points or tables, and correctly interpret slope and intercept — with units — in real-world contexts.',
    },
  ],
  prerequisites: ['dsat.linear-equations-one-var'],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame linear-function interpretation as a recurring Algebra-domain pattern — the SAT rewards reading the story, not just the equation.',
      script:
        'Algebra is about 35 percent of SAT Math, and linear functions are one of its most-tested shapes — usually as "what does this number mean in context" rather than "solve for x." Once you can read slope and intercept as real quantities with real units, these become fast, reliable points.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-slope-intercept',
      kind: 'concept',
      goal: 'Slope-intercept form, computing slope from points/tables/graphs, and the SAT interpretation and sign traps.',
      keyIdeas: [
        'FORM & MEANING — y = mx + b (or f(x) = mx + b). m is the slope: the rate of change of y per unit increase in x. b is the y-intercept: the value of y when x = 0.',
        'SLOPE FROM TWO POINTS OR A TABLE — m = (y₂ − y₁)/(x₂ − x₁) = Δy/Δx. Pick any two rows of a table; if the function is truly linear, every consecutive Δy/Δx matches.',
        'SLOPE FROM A GRAPH — read the intercept where the line crosses the y-axis; read the slope as rise/run between two clearly plotted points.',
        'INTERPRETING IN CONTEXT — the SAT\'s favorite question type: "which statement best describes what [number] means in this context?" Match slope to "per unit" language and intercept to "the value when [x-quantity] is 0" — and always attach the correct UNITS to each.',
        'TRAP 1 — THE INTERCEPT ISN\'T ALWAYS "THE BEGINNING." If x is defined as "years since 2015," the intercept is the value IN 2015, not at some absolute zero point. Always check what x = 0 actually represents in the story before interpreting b.',
        'TRAP 2 — SIGN OF THE SLOPE. "Increasing," "growing," "more" mean positive slope; "decreasing," "depreciating," "less" mean negative slope. Reporting only the magnitude and skipping the sign flips the meaning entirely.',
        'FUNCTION-NOTATION VARIANT — the same skill written as f(x) = mx + b. f(0) = b, and evaluating f(k) is a plug-in. "Which function has the greater rate of change?" is just comparing two m values across an equation, table, and/or graph.',
        'DESMOS CHECK — since Desmos is available on every math question, typing the modeled equation in and tracing two points is a fast way to confirm a slope or intercept before committing to an interpretation.',
      ],
      vocabulary: [
        { term: 'slope', definition: 'the rate of change of a linear function: Δy/Δx, constant between any two points on the line.' },
        { term: 'y-intercept', definition: 'the value of y (or f(x)) when x = 0 — where the line crosses the y-axis.' },
        { term: 'rate of change', definition: 'the real-world meaning of slope in a modeled context, e.g. dollars per month or centimeters per hour.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-typical',
      kind: 'worked_example',
      problem:
        'A candle burns at a constant rate. After 2 hours it is 18 cm tall; after 5 hours it is 9 cm tall. Write a linear function h(t) for height in centimeters after t hours, and interpret the slope and intercept.',
      steps: [
        'Slope: m = (9 − 18)/(5 − 2) = −9/3 = −3.',
        'Use the point (2, 18) to solve for b: 18 = −3(2) + b → 18 = −6 + b → b = 24.',
        'Function: h(t) = −3t + 24.',
        'Interpret: slope −3 means the candle burns down 3 cm per hour; intercept 24 means the candle started at 24 cm (its height at t = 0).',
      ],
      answer: 'h(t) = −3t + 24; slope = −3 cm/hour (burn rate), intercept = 24 cm (starting height).',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-context-trap',
      kind: 'worked_example',
      problem:
        'A lake\'s fish population F, in hundreds of fish, is modeled by F = −3y + 50, where y is the number of years since 2015. What does the value 50 represent, and what was the population in 2015?',
      steps: [
        'The intercept b = 50 is the value of F when y = 0.',
        'y = 0 corresponds to the year 2015, because y is defined as years SINCE 2015 — not "the beginning of the lake\'s history."',
        'TRAP: a student who doesn\'t check what y = 0 means in context might think the intercept describes when the population "started," but the variable only measures years from 2015 onward.',
        'So F(0) = 50 hundred fish = 5,000 fish is the population in 2015.',
      ],
      answer: '50 represents the population, in hundreds of fish, in 2015; actual population = 5,000 fish.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-slope-from-table',
      kind: 'try_yourself',
      problem:
        'A city\'s population P, in thousands, grows at a constant rate. The table shows P(0) = 120 and P(5) = 170. What is the rate of growth, in thousands of people per year?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '5' },
        { id: 'b', text: '10', correct: true },
        { id: 'c', text: '25' },
        { id: 'd', text: '50' },
      ],
      expectedAnswer: '10',
      hints: ['Slope = Δy/Δx between the two table rows.', 'm = (170 − 120)/(5 − 0) = 50/5.'],
      estimatedMinutes: 2,
    },
    {
      id: 'try-interpret-intercept',
      kind: 'try_yourself',
      problem:
        'The equation y = 15x + 200 models the total cost y, in dollars, of renting a bike for x days, including a one-time deposit. Which statement best interprets the number 200 in this context?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The rental costs $200 per day.' },
        { id: 'b', text: 'The total cost after 1 day is $200.' },
        { id: 'c', text: 'The one-time deposit is $200, charged regardless of the number of days rented.', correct: true },
        { id: 'd', text: 'The bike can be rented for a maximum of 200 days.' },
      ],
      expectedAnswer: 'The one-time deposit is $200, charged regardless of the number of days rented.',
      hints: [
        '200 is the y-intercept — the value of y when x = 0, not when x = 1.',
        'Ask: what does the model say the cost is when zero days have been rented?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-spr',
      kind: 'try_yourself',
      problem: 'Student-produced response (type your answer): A linear function f satisfies f(2) = 11 and f(6) = 27. What is f(0)?',
      responseFormat: 'numeric',
      expectedAnswer: '3',
      hints: [
        'Find the slope from the two points first: m = Δy/Δx = (27 − 11)/(6 − 2).',
        'Use f(x) = mx + b with one point to solve for b; f(0) is just b.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-slope-sign',
      kind: 'misconception_check',
      question:
        'A car depreciates over time; its value is modeled by V = −2200t + 28000, where t is years since purchase and V is value in dollars. A student says the slope means the car\'s value increases by $2,200 each year. What went wrong?',
      commonErrors: [
        {
          answer: 'value increases by $2,200 each year',
          misconception: 'Reading only the magnitude of the slope and ignoring its negative sign — assuming "change" always means increase.',
          correctsTo:
            'The slope is −2200, which is NEGATIVE — the value DECREASES by $2,200 each year. A negative slope always means the output falls as the input rises; check the sign, not just the number, before interpreting.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'y = mx + b (or f(x) = mx + b): m is the slope (rate of change), b is the y-intercept (value when x = 0).',
        'Slope from two points or table rows: m = Δy/Δx — the same ratio between ANY two points on the line.',
        'When interpreting in context, check what x = 0 actually represents in the story, and attach the correct units to both slope and intercept.',
        'Check the SIGN of the slope: negative means decreasing, not increasing — don\'t report only the magnitude.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.2', cedTitle: 'Linear Functions & Interpreting Slope/Intercept' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
