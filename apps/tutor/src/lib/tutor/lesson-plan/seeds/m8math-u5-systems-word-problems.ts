/**
 * Grade 8 Math — Systems of Linear Equations: Systems Word Problems.
 *
 * PROCEDURE-LED. The student already knows what a solution of a system is
 * (row 5.1), how to read a crossing off two graphed lines (row 5.2), and how
 * to set two y = expressions equal or drop a solved-for-y equation into the
 * other one (row 5.3). What is new is that nobody hands over the equations
 * (CCSS 8.EE.C.8c): the student receives two sentences about a situation and
 * must build the system, solve it with the moves already owned, and then say
 * what the pair means in the story. The concept segment is an ordered recipe:
 * name the unknowns with units, turn each fact into one equation, solve,
 * interpret the pair as two answers with two units, check in BOTH facts and
 * against sense. Two situation patterns carry the whole lesson, because they
 * are the two the standard is built around: two plans that each have a
 * starting amount and a per-unit rate (cost = start + rate × amount, both
 * equations already solved for y), and a count-and-total-cost situation
 * (adult and child tickets) whose count fact is written directly as "the
 * rest" so it drops into the money equation. Traps this plan is built to
 * kill: swapping the two totals, attaching the per-unit rate to the wrong
 * place, forgetting to multiply the whole bracket when substituting, and
 * reporting a bare number instead of an interpreted pair.
 *
 * SCOPE GUARD: Grade 8 row 5.4 translates a real situation into two linear
 * equations in two variables (two phone plans; adult and child tickets with a
 * count and a total cost), solves by graphing or simple substitution, and
 * interprets the pair in context. Withholds: choosing among three methods and
 * systems of linear inequalities → `alg1-u5-systems-applications.ts`.
 * Concretely, above: the graphing move of row 5.2 and the simple-substitution
 * moves of row 5.3 are both recalled as available, but the plan never asks the
 * student to choose among methods or ranks one as better, never uses the word
 * elimination, never adds or scales equations, and never writes an inequality
 * symbol — where a plan is described as cheaper on one side of
 * the crossing, that is a reading of two graphed lines in plain words, not an
 * inequality; and the count fact for tickets is written straight from the
 * words in its solved form (c = 120 - a, "the rest are child tickets") so
 * that only row 5.3's simple substitution is ever used — the plan never
 * starts from a two-variable equation such as a + c = 120 and isolates a
 * variable from it, which is the general substitution withheld to
 * `alg1-u5-systems-substitution.ts`. Sideways: the graphing procedure itself
 * is row 5.2 and the set-equal and drop-in moves are row 5.3, neither
 * re-taught here; deciding which quantity is the rate and
 * which is the starting value as a skill in its own right is row 7.2 — here
 * each plan is written from its sentence the way Grade 7 wrote equations from
 * words, and the two plans are simply written side by side. Below, assumed
 * and not re-taught: writing an equation from a word problem
 * (`m7math-u6-writing-equations-from-word-problems.ts`), distributing a factor
 * such as 5(120 - a) (`m7math-u5-distributive-property-and-factoring.ts`,
 * row 4.2), and collecting variable terms on one side (row 4.1). Every
 * correctly built system in this plan has a whole-number pair as its
 * solution, every ticket count that comes from a correct equation is
 * whole and positive, and the only non-whole values that appear (21.4 adult
 * tickets in the second worked example, x = 0.2 in the misconception check)
 * come from a WRONG equation and are shown so the sense check can catch them.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8MATH_U5_SYSTEMS_WORD_PROBLEMS: LessonPlan = {
  id: 'evelyn.ms.m8math.systems-word-problems.v1',
  title: 'Systems Word Problems',
  curriculum: 'MS',
  grade: '8',
  subject: 'math',
  topic: 'grade-8-math',
  locale: 'en',
  los: [
    {
      id: 'm8math.systems-word-problems',
      standard: 'M8MATH-5.4',
      description:
        'Translate a real situation into two linear equations in two variables (two phone plans; adult and child tickets with a count and a total cost), solve by graphing or simple substitution, and interpret the pair in context (CCSS 8.EE.C.8c).',
    },
  ],
  prerequisites: ['m8math.solving-systems-by-substitution'],
  followUps: ['m8math.identifying-functions'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Put two competing phone plans in front of the student as two sentences, so the need to build the equations yourself is felt before the recipe is given.',
      script:
        'Your family says you can pick your own phone plan, as long as you can explain the choice. Plan A costs $20 a month plus $2 for every gigabyte of data you use. Plan B costs $10 a month plus $4 per gigabyte. Plan B looks cheaper, until you notice that $4 per gigabyte piles up twice as fast as $2 does. So which plan wins? The honest answer is that it depends on how much data you use, and there is one exact number of gigabytes where the two plans cost the same amount. Nobody hands you two equations for that. They hand you the two sentences you just heard, and you build the equations yourself. That is the whole skill today: turn a real situation into two equations, solve them with the moves you already own from the last two lessons, and then say what the answer means back in the story.',
      suggestedTools: ['show_equation'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-translate-solve-interpret',
      kind: 'concept',
      goal: 'Install the name-translate-solve-interpret-check recipe and the two situation patterns that produce a system: two plans with a start and a rate, and a count with a total cost.',
      keyIdeas: [
        'NAME THE UNKNOWNS FIRST, WITH UNITS — before any equation, write one sentence that says what each letter stands for: let x be the gigabytes used in a month and y the monthly cost in dollars; let a be the number of adult tickets and c the number of child tickets. A system built on unnamed letters is where most wrong equations come from, because you cannot tell whether the 20 belongs with the x or with the y.',
        'EVERY FACT BECOMES ONE EQUATION — two unknowns need two facts, and each fact becomes exactly one equation. Two phone plans are two facts, one per plan. A ticket sale that reports how many tickets AND how much money came in is two facts, one about the count and one about the money. If you find yourself squeezing both facts into one equation, or using the same total twice, stop and separate them.',
        'PATTERN ONE, TWO PLANS — a plan that charges $20 a month plus $2 per gigabyte costs y = 20 + 2x: the dollars paid once stand alone, and the dollars paid per gigabyte multiply x, exactly the way you already write an equation from a word problem. A second plan gives a second equation, y = 10 + 4x. Both are already solved for y, which is the friendliest form a system can take.',
        'PATTERN TWO, A COUNT AND A TOTAL COST — if 120 tickets were sold and a of them were adult, then the rest, 120 - a, were child tickets, so write the count fact as c = 120 - a. The money fact multiplies each count by its own price and adds: 8a + 5c = 750 when adult tickets are $8 and child tickets are $5 and $750 came in. Keep the two totals straight: 120 is a number of tickets and belongs in the count fact, 750 is dollars and belongs in the money fact.',
        'SOLVE WITH THE MOVES YOU ALREADY OWN — when both equations are solved for y, set the two right sides equal, 20 + 2x = 10 + 4x, and finish it as an equation with x on both sides. When one equation is solved for a letter, drop it into the other one, 8a + 5(120 - a) = 750, and distribute. Or graph both lines and read where they cross, which gives an estimate when the crossing is not on a grid point and the exact pair when it is. Then put your first answer back into the easier equation to find the second coordinate.',
        'THE PAIR IS TWO ANSWERS, EACH WITH A UNIT, AND BOTH GET CHECKED — (5, 30) is not the answer; "at 5 gigabytes both plans cost $30" is. Put the pair into BOTH original equations and make sure each one comes out true, then ask whether it makes sense in the story: a ticket count must be a whole number and cannot be negative. A count like 21.4 tickets is not a strange answer, it is a signal that one of the equations was built wrong.',
      ],
      vocabulary: [
        { term: 'defining the variables', definition: 'the sentence that says what each letter stands for, with its unit, written before any equation.' },
        { term: 'system of equations', definition: 'two equations about the same two unknowns that must both be true at once; its solution is the one pair that satisfies both.' },
        { term: 'interpret', definition: 'say what a number means in the story, with its unit: x = 5 becomes 5 gigabytes, not just 5.' },
      ],
      suggestedTools: ['show_equation', 'show_function_graph'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-two-phone-plans',
      kind: 'worked_example',
      problem:
        'Plan A costs $20 a month plus $2 per gigabyte of data. Plan B costs $10 a month plus $4 per gigabyte. At how many gigabytes do the two plans cost the same, and what is that cost? Which plan is cheaper for someone who uses less data than that?',
      steps: [
        'Name the unknowns. Let x be the gigabytes used in a month and y the monthly cost in dollars. Both plans use the same x and the same y, which is what makes this a system.',
        'Translate each plan into one equation. Plan A: the $20 is paid once and the $2 is paid for every gigabyte, so y = 20 + 2x. Plan B: y = 10 + 4x. Both equations are already solved for y.',
        'Solve. The two costs are equal at the crossing, so set the right sides equal: 20 + 2x = 10 + 4x. Subtract 2x from both sides: 20 = 10 + 2x. Subtract 10 from both sides: 10 = 2x. Divide by 2: x = 5.',
        'Find the second coordinate by putting x = 5 into Plan A: y = 20 + 2(5) = 20 + 10 = 30. The pair is (5, 30).',
        'Check in BOTH equations. Plan A: 20 + 2(5) = 30. Plan B: 10 + 4(5) = 10 + 20 = 30. Both give 30, so the pair is right.',
        'Interpret with units: at 5 gigabytes a month, both plans cost exactly $30. On a graph with gigabytes across and dollars up, Plan B starts lower, at 10, but climbs faster, 4 per gigabyte, so its line starts below Plan A and crosses it at (5, 30).',
        'Answer the last question by reading the graph on the left of the crossing. At 2 gigabytes, Plan A costs 20 + 2(2) = 24 and Plan B costs 10 + 4(2) = 18, so Plan B is cheaper for a light data user. At 8 gigabytes, Plan A is 20 + 16 = 36 and Plan B is 10 + 32 = 42, so the lines have switched and Plan A is cheaper for a heavy user.',
      ],
      answer: 'The plans cost the same, $30, at 5 gigabytes; below 5 gigabytes Plan B is cheaper, and above it Plan A is cheaper',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-school-play-tickets',
      kind: 'worked_example',
      problem:
        'The school play sold adult tickets for $8 and child tickets for $5. In total 120 tickets were sold and $750 was collected. How many adult tickets and how many child tickets were sold?',
      steps: [
        'Name the unknowns. Let a be the number of adult tickets and c the number of child tickets.',
        'Translate the count fact. All 120 tickets are either adult or child, so if a of them are adult, the rest are child: c = 120 - a. This equation is already solved for c, so it is ready to drop into the other one.',
        'Translate the money fact. Each adult ticket brings in $8 and each child ticket brings in $5, so 8a + 5c = 750. Notice which total went where: 120 tickets in the count fact, 750 dollars in the money fact.',
        'Substitute the count fact into the money fact: 8a + 5(120 - a) = 750.',
        'WRONG: writing 5(120 - a) as 600 - a, which gives 8a + 600 - a = 750, then 7a = 150 and a = 150 ÷ 7, about 21.4 adult tickets. A ticket count that is not a whole number is the story telling you an equation was built wrong. CORRECT: the 5 multiplies BOTH parts of the bracket, so 5(120 - a) = 600 - 5a.',
        'Now the equation is 8a + 600 - 5a = 750, which collects to 3a + 600 = 750. Subtract 600 from both sides: 3a = 150. Divide by 3: a = 50.',
        'Find the second unknown from the count fact: c = 120 - 50 = 70.',
        'Check in BOTH facts. Count: 50 + 70 = 120. Money: 8(50) + 5(70) = 400 + 350 = 750. Both facts hold, both counts are whole and positive, so the pair makes sense.',
        'Interpret with units: 50 adult tickets and 70 child tickets were sold.',
      ],
      answer: '50 adult tickets and 70 child tickets',
      estimatedMinutes: 3,
    },
    {
      id: 'try-translate-movie-night',
      kind: 'try_yourself',
      problem:
        'A movie night sells 90 tickets: adult tickets for $7 and kid tickets for $4, and it collects $480. Let a be the number of adult tickets and k the number of kid tickets. Which pair of equations matches the story?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'k = 480 - a and 7a + 4k = 90' },
        { id: 'b', text: 'k = 90 - a and 7a + 4k = 480', correct: true },
        { id: 'c', text: 'k = 90 - a and 4a + 7k = 480' },
        { id: 'd', text: 'k = 480 - a and 4a + 7k = 90' },
      ],
      expectedAnswer: 'k = 90 - a and 7a + 4k = 480',
      hints: [
        'Two facts, two equations. The count fact uses the number of tickets, and the money fact uses the dollars collected. Which total is tickets and which is dollars?',
        'In the money fact, each price multiplies the count of the ticket it belongs to: $7 goes with the adult count a, and $4 goes with the kid count k.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-interpret-crossing',
      kind: 'try_yourself',
      problem:
        'Two game-download plans are graphed with downloads per month across and dollars up. Basic costs $12 a month plus $1.50 per download, so y = 12 + 1.5x. Plus costs $18 a month plus $0.50 per download, so y = 18 + 0.5x. The two lines cross at (6, 21). What does that point mean in the story?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Basic costs $6 a month and Plus costs $21 a month' },
        { id: 'b', text: 'After 6 months, both plans have cost $21 in total' },
        { id: 'c', text: 'With 21 downloads in a month, both plans cost $6' },
        { id: 'd', text: 'With 6 downloads in a month, both plans cost $21', correct: true },
      ],
      expectedAnswer: 'With 6 downloads in a month, both plans cost $21',
      hints: [
        'Go back to the definitions: x counts downloads in a month and y is the monthly cost in dollars. Read the pair in that order.',
        'A crossing point sits on BOTH lines, so the same x gives the same y for both plans. Check it: 12 + 1.5(6) and 18 + 0.5(6) should both come out to the same number.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-bake-sale',
      kind: 'try_yourself',
      problem:
        'The robotics club sells 50 baked items at a bake sale: cookies for $2 each and brownies for $3 each. It collects $130. How many brownies were sold? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '30',
      hints: [
        'Let b be the number of brownies. Then the rest of the 50 items are cookies, so the count fact is cookies = 50 - b. Now write the money fact with $2 per cookie and $3 per brownie.',
        'The money fact is 2(50 - b) + 3b = 130. Distribute the 2 over both parts of the bracket, collect the b terms, and solve. Then check that the cookie count and brownie count add to 50 and that the money adds to $130.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-bare-number-and-swapped-rate',
      kind: 'misconception_check',
      question:
        'Theo and Nia both work on the phone-plan problem: Plan A is $20 a month plus $2 per gigabyte, and Plan B is $10 a month plus $4 per gigabyte. Theo writes 20 + 2x = 10 + 4x, solves it correctly to x = 5, and answers "the plans cost $5". Nia writes y = 20x + 2 and y = 10x + 4, and gets x = 0.2. What went wrong in each case?',
      commonErrors: [
        {
          answer: 'The plans cost $5.',
          misconception: 'Treating the solved value of x as the final answer without going back to what x stands for, and never finding the second coordinate.',
          correctsTo:
            'Theo defined x as gigabytes, so x = 5 means 5 gigabytes, not $5. The story asked for a pair: put x = 5 back into Plan A, y = 20 + 2(5) = 30, and check it in Plan B, 10 + 4(5) = 30. The interpreted answer is that at 5 gigabytes a month both plans cost $30. A bare number is never the answer to a word problem; a sentence with two units is.',
        },
        {
          answer: 'y = 20x + 2 and y = 10x + 4, so x = 0.2',
          misconception: 'Attaching the per-gigabyte rate to the wrong place: multiplying x by the monthly fee that is paid once, and adding on the rate that should repeat for every gigabyte.',
          correctsTo:
            'The amount that repeats for every gigabyte is the one that multiplies x, and the amount paid once stands alone, so Plan A is y = 20 + 2x and Plan B is y = 10 + 4x. Nia can catch the swap by reading her own equation back into the story: y = 20x + 2 says the plan charges $20 for every gigabyte and $2 a month, which is not what the sentence said. With the correct equations, 20 + 2x = 10 + 4x gives x = 5 and y = 30: both plans cost $30 at 5 gigabytes.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Name the unknowns first, with units, in one sentence: let x be the gigabytes and y the cost in dollars.',
        'Two unknowns need two facts, and each fact becomes exactly one equation. Never squeeze two facts into one equation or use the same total twice.',
        'Two plans: cost = the amount paid once + the per-unit rate × the amount, so y = 20 + 2x. A count and a total cost: c = 120 - a for the count, and each price times its own count for the money.',
        'Solve with the moves you already own: set two solved-for-y sides equal, drop a solved-for-one-letter equation into the other, or graph both lines and read the crossing. Then find the second coordinate.',
        'The answer is a pair with two units, checked in BOTH original facts and against sense: a ticket count that is not a whole number means an equation was built wrong.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.4', cedTitle: 'Systems Word Problems' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
