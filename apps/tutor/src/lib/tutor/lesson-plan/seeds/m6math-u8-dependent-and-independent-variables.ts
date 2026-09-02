/**
 * Grade 6 Math — Equations, Inequalities & Relationships: Dependent &
 * Independent Variables.
 *
 * CONCEPT-LED lesson for the m6math fan-out. Units 8.1-8.3 built one-step
 * equations and inequalities in a single variable; this row moves to a
 * relationship between TWO quantities and asks the student to name which one
 * is chosen (independent) and which one responds (dependent), write ONE
 * equation for the dependent variable in terms of the independent one, and
 * read that same relationship in a table and on a graph (CCSS 6.EE.C.9). Two
 * worked examples are used specifically to keep the lesson from collapsing
 * into a single case: the first equation starts at zero, the second starts
 * from a fixed amount that is added, not multiplied — so a student never
 * generalizes "the equation always looks like this."
 *
 * SCOPE GUARD: this lesson writes and reads ONE equation for ONE named
 * real-world situation at a time. It never writes a general form such as
 * "y = kx", never names a number in an equation a constant of
 * proportionality, never asks whether a relationship is proportional, and
 * the word "proportional" never appears — all of that is Grade 7 Unit 3.
 * Every equation here keeps its own concrete letters (m, w, d, b, s, r, h,
 * c, t) tied to a specific situation, not a general symbolic template, and
 * solving for the independent variable given a target dependent value is
 * never asked, so no equation is solved beyond substituting a value in and
 * computing (an Explicitly-excluded two-step SOLVE, such as isolating h in
 * 20 = 8 + 2h, never appears; every equation use here plugs a known
 * independent value in and evaluates, which is Unit 7 expression-evaluation
 * skill applied to a new context, not new equation-solving).
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 8.3 -> 8.4 ->
 * 9.1, using the real previous/next loIds from the fan-out contract's course
 * table, per the contract's instruction that all 40 rows populate both
 * arrays (the two exemplars' empty arrays are a lint-ordering artifact from
 * being registered before their neighbors, not the pattern to follow).
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6MATH_U8_DEPENDENT_AND_INDEPENDENT_VARIABLES: LessonPlan = {
  id: 'evelyn.ms.m6math.dependent-and-independent-variables.v1',
  title: 'Dependent & Independent Variables',
  curriculum: 'MS',
  grade: '6',
  subject: 'math',
  topic: 'grade-6-math',
  locale: 'en',
  los: [
    {
      id: 'm6math.dependent-and-independent-variables',
      standard: 'M6MATH-8.4',
      description:
        'Use variables to represent two quantities in a real-world relationship, write an equation expressing one in terms of the other, and analyze the relationship with tables and graphs (CCSS 6.EE.C.9).',
    },
  ],
  prerequisites: ['m6math.writing-and-graphing-inequalities'],
  followUps: ['m6math.area-of-triangles-and-quadrilaterals'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to notice two quantities in a familiar situation, one that is chosen and one that responds to it, before any equation is named.',
      script:
        'Mia walks the neighbor\'s dog after school. Every walk she does earns her $6. One walk this week means $6. Four walks means $24. The number of walks is something Mia decides for herself: she picks how many jobs to take. The money she earns is not something she decides directly. It just follows from however many walks she picked. One quantity gets chosen, and the other quantity answers back. Today we learn how to write a single equation connecting the two, and how to read that same relationship in a table and on a graph.',
      suggestedTools: ['show_equation'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-two-variables-one-equation',
      kind: 'concept',
      goal: 'Install the independent/dependent distinction, the habit of writing one equation for a specific situation, and the table-and-graph convention that reads it.',
      keyIdeas: [
        'TWO QUANTITIES THAT CHANGE TOGETHER — a real-world relationship has two quantities that move together: one you choose or control, and one that responds to that choice. Mia chooses how many walks she does. The money she earns responds to that choice.',
        'INDEPENDENT GOES IN, DEPENDENT COMES OUT — the quantity that gets chosen is the INDEPENDENT VARIABLE. The quantity that depends on it is the DEPENDENT VARIABLE. To tell them apart, ask "which one depends on the other?" Money earned depends on the number of walks, so money earned is dependent. The number of walks does not depend on the money, so it is independent.',
        'WRITE ONE EQUATION FOR THE SITUATION — pick a letter for each quantity, then write a single equation that shows exactly how to compute the dependent variable once you know the independent one. Mia earns $6 per walk, so if w is the number of walks and m is the money earned, the equation is m = 6w. Plug in a value of w and the equation hands you m.',
        'A TABLE LISTS INPUT AND OUTPUT TOGETHER — a table of values puts the independent variable in one column and the matching dependent-variable value, computed from the equation, in the column beside it. Every row is one pair: an independent value and the dependent value it produces.',
        'ON A GRAPH, INDEPENDENT GOES ON THE X-AXIS — plot each table row as a point, with the independent variable on the x-axis and the dependent variable on the y-axis. The point for "1 walk, $6 earned" is plotted at x = 1, y = 6.',
        'NOT EVERY EQUATION STARTS AT ZERO — some situations already have a fixed amount in place before the independent variable contributes anything, and that fixed amount gets ADDED, never multiplied. Check any equation by asking what it gives when the independent variable is 0; that tells you whether the situation has a head start.',
      ],
      vocabulary: [
        { term: 'independent variable', definition: 'the quantity in a relationship that is chosen or controlled, and that the other quantity depends on.' },
        { term: 'dependent variable', definition: 'the quantity in a relationship whose value depends on the independent variable; it is the one the equation computes.' },
        { term: 'table of values', definition: 'a list of independent-variable values next to the dependent-variable value the equation produces for each one.' },
      ],
      suggestedTools: ['show_equation', 'show_table', 'show_coordinate_plane'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-dog-walking',
      kind: 'worked_example',
      problem:
        'Mia earns $6 every time she walks the neighbor\'s dog. Let w stand for the number of walks she does in a week, and let m stand for the money she earns that week. Write an equation for m in terms of w, make a table for w = 0, 1, 2, 3, and describe how to plot the points.',
      steps: [
        'Decide which variable is independent and which is dependent. Mia chooses how many walks to do, so w is independent. The money she earns follows from that choice, so m is dependent, and the equation is written for m.',
        'Each walk earns $6, so multiply the number of walks by 6 to get the money earned: m = 6w.',
        'Check the equation with a value you already know: one walk should earn $6. m = 6 × 1 = 6. That matches.',
        'Build the table. Put w in the left column and the matching m, computed from the equation, in the right column: w = 0 gives m = 6 × 0 = 0; w = 1 gives m = 6; w = 2 gives m = 12; w = 3 gives m = 18.',
        'WRONG: plotting money earned (m) on the x-axis and number of walks (w) on the y-axis. CORRECT: the independent variable w goes on the x-axis and the dependent variable m goes on the y-axis, because w is what gets chosen and m is what responds to it.',
        'Plot the points (0, 0), (1, 6), (2, 12), (3, 18). Each point sits $6 higher than the one before it, matching the $6-per-walk rate in the equation.',
      ],
      answer: 'm = 6w; table: (0, 0), (1, 6), (2, 12), (3, 18)',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-book-fair',
      kind: 'worked_example',
      problem:
        'The school book fair already had $40 donated before it opened. Each book sold adds $4 more. Let b stand for the number of books sold, and let d stand for the total donations in dollars. Write an equation for d in terms of b, then find d when b = 5.',
      steps: [
        'Decide which variable is independent and which is dependent. The number of books sold, b, is what changes as the fair goes on, so it is independent. The total donations, d, depend on how many books have sold so far, so it is dependent.',
        'There is already $40 before any books sell, and every book sold adds $4 more. The $40 is a fixed amount that gets added once, not multiplied by b, so the equation is d = 40 + 4b.',
        'Check with a value you already know: before any books sell, b = 0, and d should be exactly the starting $40. d = 40 + 4 × 0 = 40. That matches.',
        'Find d when b = 5: d = 40 + 4 × 5 = 40 + 20 = 60.',
        'WRONG: leaving out the starting amount and writing d = 4b, which gives d = 20 when b = 5. CORRECT: the $40 head start is already there no matter how many books sell, so it stays in the equation: d = 40 + 4b, which gives d = 60 when b = 5.',
        'Notice the difference from Mia\'s equation: a table for this situation would start at (0, 40), not (0, 0), because this relationship has a fixed amount before the independent variable adds anything. Not every relationship starts at zero.',
      ],
      answer: 'd = 40 + 4b; d = 60 when b = 5',
      estimatedMinutes: 3,
    },
    {
      id: 'try-parking-garage-equation',
      kind: 'try_yourself',
      problem:
        'A parking garage charges $3 for every hour a car is parked. Let h stand for the number of hours parked, and let c stand for the total cost in dollars. Which equation shows c in terms of h?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'c = 3h', correct: true },
        { id: 'b', text: 'h = 3c' },
        { id: 'c', text: 'c = 3 + h' },
        { id: 'd', text: 'c = h / 3' },
      ],
      expectedAnswer: 'c = 3h',
      hints: [
        'Ask yourself which quantity depends on the other. The cost depends on the number of hours, so the equation computes c from h, not the other way around.',
        'Every hour adds another $3 to the cost, so multiply the number of hours by 3 to get the total cost.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-savings-jar-equation',
      kind: 'try_yourself',
      problem:
        'Jayden already has $15 in his savings jar. He adds $5 every week after that. Let w stand for the number of weeks, and let s stand for the total amount saved in dollars. Which equation shows s in terms of w?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 's = 5w' },
        { id: 'b', text: 's = 15w' },
        { id: 'c', text: 's = 15 + 5w', correct: true },
        { id: 'd', text: 's = 20w' },
      ],
      expectedAnswer: 's = 15 + 5w',
      hints: [
        'There are two separate parts to this equation: the amount Jayden already had, and the amount that grows every week. Both parts have to show up.',
        'The $15 is already in the jar no matter what, so it gets added once, not multiplied. The $5 per week is the part that multiplies by w.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-food-truck-revenue',
      kind: 'try_yourself',
      problem:
        'A food truck sells tacos for $3 each. Let t stand for the number of tacos sold, and let r stand for the total revenue in dollars. The equation is r = 3t. Find r when t = 9. Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '27',
      hints: [
        'Substitute 9 in place of t in the equation r = 3t.',
        'Multiply 3 by 9.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-flat-fee-placement',
      kind: 'misconception_check',
      question:
        'A bike rental costs $8 as a flat fee, plus $2 for every hour rented. Let h stand for the number of hours. One student writes the equation as c = 8h + 2. Another student writes it as c = 2h, leaving the flat fee out entirely. What went wrong in each case?',
      commonErrors: [
        {
          answer: 'c = 8h + 2',
          misconception: 'Swapping which number gets multiplied by h and which number gets added on its own — the per-hour rate was left as a plain added number, while the one-time flat fee was multiplied by h instead.',
          correctsTo:
            'The $8 flat fee is charged once, no matter how many hours the bike is rented, so it never multiplies by h; it is simply added. The $2 per hour is the part that grows with h, so that is the part that multiplies. The correct equation is c = 8 + 2h. Check it: at h = 0 hours, c = 8 + 2 × 0 = 8, exactly the flat fee, before any hours have passed.',
        },
        {
          answer: 'c = 2h',
          misconception: 'Dropping the flat fee completely, as if the rental had no cost at all until the first hour started.',
          correctsTo:
            'The flat fee is not optional. It is charged the moment the bike leaves the rack, before a single hour has passed. Every part of the situation belongs in the equation, so the flat fee has to be added: c = 8 + 2h. Check it: at h = 0, this equation gives c = 8, matching the flat fee, while c = 2h would wrongly say the bike costs nothing until an hour goes by.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A real-world relationship has an independent variable, which is chosen, and a dependent variable, which responds to that choice.',
        'Write one equation that computes the dependent variable from the independent variable, using letters tied to the specific situation.',
        'A table lists each independent-variable value next to the dependent-variable value the equation produces for it.',
        'On a graph, the independent variable goes on the x-axis and the dependent variable goes on the y-axis.',
        'Some equations start with a fixed amount that is added once, not multiplied by the independent variable — check this by finding what the equation gives when the independent variable is 0.',
        'Check every equation against a value you already know before trusting it for a value you do not.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.4', cedTitle: 'Dependent & Independent Variables' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
