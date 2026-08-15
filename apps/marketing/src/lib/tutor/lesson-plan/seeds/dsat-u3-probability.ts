/**
 * Digital SAT — Math / Problem-Solving and Data Analysis: Probability &
 * Conditional Probability from Tables.
 *
 * The digital SAT presents probability almost exclusively through two-way
 * frequency tables (rows × columns, with row/column/grand totals) written
 * out in the question stimulus. The recurring trap: "given that" means
 * RESTRICT to a row or column BEFORE dividing — using the grand total
 * instead of the restricted total is the single most common wrong answer.
 * Desmos is available on every math question but doesn't build the table
 * for you; the skill is reading it correctly, not computing.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_DSAT_U3_PROBABILITY: LessonPlan = {
  id: 'evelyn.testprep.dsat.probability.v1',
  title: 'Probability & Conditional Probability from Tables',
  curriculum: 'SAT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'digital-sat',
  locale: 'en',
  los: [
    {
      id: 'dsat.probability',
      standard: 'DSAT-3.5',
      description:
        'Compute simple, joint, and conditional probability from a two-way frequency table, correctly restricting to the given row or column and avoiding the direction-reversal trap.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame two-way-table probability as a recurring, learnable pattern within Problem-Solving and Data Analysis.',
      script:
        'Problem-Solving and Data Analysis is about 15 percent of Digital SAT Math — roughly 6 to 7 of the 44 scored questions — and two-way table probability items show up on nearly every test, typically 2 to 3 questions across both modules. The tables look intimidating but every question boils down to one move: pick the right two numbers and divide. Get the restriction rule right and these become fast, reliable points.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-probability',
      kind: 'concept',
      goal: 'Reading a two-way table correctly, simple vs conditional probability, the restriction trap, direction reversal, and "or" questions.',
      keyIdeas: [
        'READ THE TABLE FIRST. A two-way table crosses two categorical variables (rows × columns) with row totals, column totals, and a grand total in the corner. Identify what each row and each column represents before touching a fraction.',
        'SIMPLE PROBABILITY = one row or column total over the GRAND total. "What fraction of everyone surveyed is in category X?" uses the grand total as the denominator.',
        'TRAP 1 — "GIVEN THAT" MEANS RESTRICT FIRST. The phrase "given that X" tells you to throw away everyone NOT in X, then compute using ONLY that restricted group as the denominator. Using the grand total instead of the restricted total is the single most common wrong answer on these questions.',
        'TRAP 2 — DIRECTION MATTERS. P(A given B) and P(B given A) share the SAME joint cell in the numerator but use DIFFERENT denominators (B\'s total vs A\'s total) — they are almost never equal. Find which category the "given" applies to; that category\'s total is the denominator, and the OTHER category is what you\'re finding the probability of.',
        'ROW-CONDITION vs COLUMN-CONDITION. If the "given" category is a row label, restrict to that row\'s total. If it\'s a column label, restrict to that column\'s total.',
        '"OR" QUESTIONS — add every cell that satisfies EITHER condition (counting any overlap only once) over the grand total; equivalently, 1 minus the probability of neither. TRAP: naively adding the two marginal probabilities double-counts the overlap cell.',
        'DESMOS DOESN\'T BUILD THE TABLE. There\'s no calculator shortcut for reading a table — organize the two numbers you need (the restricted total and the target cell or cell-sum), then divide.',
      ],
      vocabulary: [
        { term: 'conditional probability', definition: 'the probability of an event GIVEN that another event has already happened — restrict to that group before computing the fraction.' },
        { term: 'marginal total', definition: 'a row or column total in a two-way table — the count in that category regardless of the other variable.' },
        { term: 'joint frequency', definition: 'the count in a single interior cell of a two-way table — satisfies BOTH the row and column condition at once.' },
      ],
      suggestedTools: ['show_equation', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-typical',
      kind: 'worked_example',
      problem:
        'A company surveyed 150 employees on work location and role. Results: Remote employees — 18 managers, 72 not managers (90 total). In-office employees — 12 managers, 48 not managers (60 total). Column totals: 30 managers, 120 not managers, 150 overall. One employee is selected at random from the 150 surveyed. What is the probability that the employee is a manager, given that the employee works remotely?',
      steps: [
        'The condition is "given that the employee works remotely" — remote is a ROW, so restrict to the Remote row: 90 employees total.',
        'Within that restricted group of 90, 18 are managers.',
        'P(manager | remote) = 18 / 90 = 1/5 = 0.2. Note the denominator is 90 (the Remote row total), NOT 150 (the grand total).',
      ],
      answer: '1/5 (0.2)',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-reversal-trap',
      kind: 'worked_example',
      problem:
        'Same 150-employee table: Remote — 18 managers, 72 not managers (90 total). In-office — 12 managers, 48 not managers (60 total). Column totals: 30 managers, 120 not managers, 150 overall. Now find: what is the probability that the employee works remotely, given that the employee is a manager?',
      steps: [
        'The condition flipped: now it\'s "given that the employee is a manager" — manager is a COLUMN, so restrict to the Manager column: 30 employees total (NOT the 90 from the last problem).',
        'Within that restricted group of 30 managers, 18 work remotely.',
        'P(remote | manager) = 18 / 30 = 3/5 = 0.6. Same joint cell (18) as the previous problem, but a completely different answer (0.6 vs 0.2) because the denominator changed. This is why direction matters — always re-identify the condition for each question.',
      ],
      answer: '3/5 (0.6)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-conditional',
      kind: 'try_yourself',
      problem:
        'A survey of 240 moviegoers recorded age group and favorite genre. Under 30: 60 prefer action, 40 prefer comedy (100 total). 30 and older: 50 prefer action, 90 prefer comedy (140 total). Column totals: 110 prefer action, 130 prefer comedy, 240 overall. A moviegoer is selected at random from those surveyed. What is the probability that the moviegoer prefers comedy, given that the moviegoer is under 30?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '1/6' },
        { id: 'b', text: '2/5', correct: true },
        { id: 'c', text: '4/13' },
        { id: 'd', text: '3/5' },
      ],
      expectedAnswer: '2/5',
      hints: [
        '"Given that under 30" restricts you to the Under 30 row — 100 people, not 240.',
        'Of those 100 under-30 moviegoers, 40 prefer comedy: 40/100 = 2/5.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-or-trap',
      kind: 'try_yourself',
      problem:
        'A survey of 180 students recorded sport participation and chemistry enrollment. Plays a sport: 25 take chemistry, 35 do not (60 total). No sport: 45 take chemistry, 75 do not (120 total). Column totals: 70 take chemistry, 110 do not, 180 overall. A student is selected at random from the 180 surveyed. What is the probability that the student plays a sport OR takes chemistry?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '5/12' },
        { id: 'b', text: '7/12', correct: true },
        { id: 'c', text: '13/18' },
        { id: 'd', text: '5/36' },
      ],
      expectedAnswer: '7/12',
      hints: [
        'Add every cell that satisfies "sport" or "chemistry," counting the overlap cell (plays a sport AND takes chemistry) only once: 25 + 35 + 45 = 105.',
        '105/180 = 7/12. (Adding the two marginal totals 60/180 + 70/180 = 13/18 double-counts the 25-student overlap — that trap is answer choice C.)',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-spr',
      kind: 'try_yourself',
      problem:
        'Student-produced response (type your answer): A gym has 90 members. Standard members: 12 use the pool, 48 do not (60 total). Premium members: 21 use the pool, 9 do not (30 total). Column totals: 33 use the pool, 57 do not, 90 overall. A member is selected at random from the 90 members. Given that the member has a Premium membership, what is the probability, as a fraction in simplest form, that the member uses the pool?',
      responseFormat: 'numeric',
      expectedAnswer: '7/10',
      hints: [
        '"Given that Premium" restricts you to the Premium row — 30 members, not 90.',
        'Of those 30 Premium members, 21 use the pool: 21/30 simplifies to 7/10.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-restrict',
      kind: 'misconception_check',
      question:
        'Of 100 people surveyed, 40 own a dog; of those 40 dog owners, 25 also own a cat. A student is asked: "given that a person owns a dog, what is the probability they also own a cat?" and answers 25/100. What went wrong?',
      commonErrors: [
        {
          answer: '25/100',
          misconception: 'Used the grand total (100) as the denominator instead of restricting to the condition (dog owners, 40).',
          correctsTo: 'The word "given" means restrict to that group FIRST. 25 cat-owning dog owners out of 40 dog owners = 25/40 = 5/8. The 100 grand total is irrelevant once the condition restricts the population.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '"Given that" = restrict to that row or column FIRST; the denominator is the restricted total, not the grand total.',
        'Direction matters: P(A given B) restricts to B\'s total; P(B given A) restricts to A\'s total — same table, different denominators, usually different answers.',
        '"Or" probabilities: add the relevant cells directly (counting any overlap once), or use 1 minus the probability of neither — don\'t add the two marginal probabilities and double-count the overlap.',
        'Desmos won\'t organize the table for you — identify the restricted total and the target cell (or cell-sum) first, then divide.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.5', cedTitle: 'Probability & Conditional Probability from Tables' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
