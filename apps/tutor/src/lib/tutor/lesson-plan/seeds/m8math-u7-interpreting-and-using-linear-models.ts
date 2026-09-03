/**
 * Grade 8 Math — Linear Functions as Models: Interpreting & Using Linear
 * Models.
 *
 * CONCEPT-LED row 7.3. Rows 7.1 and 7.2 hand the student a table, a graph,
 * or a story and ask for the equation. This row runs the other way: the model
 * is GIVEN, in whatever form it arrives, and the student says what its two
 * numbers mean and puts the model to work (CCSS 8.F.B.4). The mental model
 * is that m and b are two sentences about the situation, each carrying a
 * unit and each sitting in a definite place on the graph and in the table:
 * the rate of change is a "per" sentence with two units (dollars per hour,
 * centimeters per hour) and shows as the rise for every 1 unit of run, or
 * the jump from one table row to the next; the initial value is the "before
 * anything happens" amount with y's unit alone and shows where the line
 * crosses the vertical axis, or beside x = 0 in the table. The equation is
 * then a machine that runs both directions: x in, y out to predict, and y in,
 * x out to find when a target is reached, with the two-step solve the student
 * already owns doing the work. Two traps this plan is built to kill: reading
 * a total (the y beside x = 1) as the rate, and dropping a target OUTPUT
 * into the x slot because it was the number the question mentioned.
 *
 * SCOPE GUARD: Given a linear model in any representation, state what the
 * rate of change and the initial value mean in the situation and where they
 * show on the graph/table (with units), predict an output, and solve for the
 * input that gives a target output (when is the candle 4 cm tall?).
 * Withholds: the same interpretation for a line FITTED to data -> row 10.3
 * (8.SP.A.3); `alg1-u4-slope-intercept-form.ts` repeats interpret-m-and-b
 * as HS review. Concretely, in the plan body beneath this comment: every
 * model is an exact stated rule (a posted price, a burn rate, a growth rate,
 * a card that loses a fixed number of credits per play), never a line drawn
 * through scattered measurements, so no prediction is "about" or
 * "approximately" and nothing is said about how far the data reach. Every
 * model arrives with its equation already written, so the plan never builds
 * y = mx + b from a story (row 7.2), never reads m and b off a graph as the
 * deliverable (row 3.4), and never computes m as a change in y over a change
 * in x from two arbitrary rows or points or backs b out of a table that
 * hides x = 0 (row 7.1): every table here lists an x = 0 row with x rising
 * by 1, so the initial value is READ beside x = 0 and the rate of change is
 * READ as the jump between neighboring rows, as the location of a number
 * already known from the equation. The candle model y = -0.5x + 12 is
 * carried in from row 7.2 as a finished equation, because the curriculum
 * names "when is the candle 4 cm tall?" as this row's own question. No
 * item compares two models (row 6.3), no graph is read only in words
 * (row 7.4), and no line is horizontal, vertical, or named by a slope of
 * zero (`alg1-u4-slope-rate-of-change.ts`). Rates DO carry units here,
 * "dollars per hour" and "centimeters per hour", because this row's scope
 * cell asks for the meaning "with units"; the words "average rate of
 * change", "f(x)", "domain" and "range" do not appear. Below, assumed and
 * recalled in a sentence, never re-taught: substituting a value into an
 * expression and solving a two-step equation such as 4 = -0.5x + 12
 * (`m7math-u6-two-step-equations.ts`); the y-intercept as the crossing
 * point (0, b) is row 3.4 ground and is used by name, not re-derived.
 * Salvage: none.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8MATH_U7_INTERPRETING_AND_USING_LINEAR_MODELS: LessonPlan = {
  id: 'evelyn.ms.m8math.interpreting-and-using-linear-models.v1',
  title: 'Interpreting & Using Linear Models',
  curriculum: 'MS',
  grade: '8',
  subject: 'math',
  topic: 'grade-8-math',
  locale: 'en',
  los: [
    {
      id: 'm8math.interpreting-and-using-linear-models',
      standard: 'M8MATH-7.3',
      description:
        'Given a linear model in any representation, state what the rate of change and the initial value mean in the situation and where they show on the graph/table (with units), predict an output, and solve for the input that gives a target output (when is the candle 4 cm tall?) (CCSS 8.F.B.4).',
    },
  ],
  prerequisites: ['m8math.constructing-linear-models-from-descriptions'],
  followUps: ['m8math.describing-and-sketching-qualitative-graphs'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Hand the student a finished model with no explanation attached, so the four questions this lesson answers (what each number means, where it shows, what comes out, when a target is hit) are felt as real before any of them is named.',
      script:
        'You and two friends unlock rental scooters outside the mall, and the app flashes one line before you ride: y = 0.15x + 1, where x is the minutes you ride and y is the cost in dollars. Last lesson you built lines like that from a story. Today the equation is handed to you already finished, and the questions run the other way. What does the 0.15 actually mean, and what is the 1 doing there? If the app drew the graph, where would you see each of those numbers? If you ride for 20 minutes, what do you owe? And if you have exactly $7 on your card, how many minutes can you ride before the app cuts you off? A linear model is a machine that answers all four of those, and the whole skill today is knowing which slot each number goes into and which unit comes out.',
      suggestedTools: ['show_equation'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-two-numbers-two-sentences',
      kind: 'concept',
      goal: 'Build the picture of m and b as two sentences about the situation, each with its unit and its place on the graph and in the table, then run the equation both ways: x in to predict y, and y in to solve for x.',
      keyIdeas: [
        'EACH NUMBER IN A MODEL IS A SENTENCE WITH A UNIT — in y = 0.15x + 1, the 0.15 and the 1 are not just numbers, they are facts about the scooter ride. The 0.15 says "the cost goes up $0.15 for every 1 minute you ride." The 1 says "the ride costs $1 before a single minute has passed." Saying "the rate is 0.15" with no unit and no "per" is half an answer, because 0.15 of what, for each what?',
        'THE RATE OF CHANGE IS A "PER" SENTENCE WITH TWO UNITS — the rate of change is the m, the number multiplied by x, and its unit is always y\'s unit per x\'s unit: dollars per minute here, centimeters per hour for a burning candle. Its sign is its direction. A candle model y = -0.5x + 12 has a rate of change of -0.5 centimeters per hour, which reads "the height goes DOWN 0.5 cm for every 1 hour," and the minus sign is what says down.',
        'THE INITIAL VALUE IS THE "BEFORE ANYTHING HAPPENS" AMOUNT — the initial value is the b, the number standing alone, and it is the value of y when x = 0: the $1 unlock fee at 0 minutes, the 12 cm candle at 0 hours. Its unit is y\'s unit by itself, dollars or centimeters, with no "per," because it is an amount of y, not a change in y.',
        'WHERE THEY SHOW ON THE GRAPH AND IN THE TABLE — on the graph, b is the height where the line crosses the vertical axis, the point (0, b), which you already call the y-intercept. m is the rise for every 1 unit of run: from any point on the line, move 1 minute to the right and the line sits 0.15 higher, or 0.5 lower for the candle. In a table whose x-values go 0, 1, 2, 3, b is the y sitting beside x = 0, and m is the jump from one row to the next. The y beside x = 1 is a total, not the rate; the rate is how much it climbed to get there.',
        'TO PREDICT AN OUTPUT, PUT THE INPUT IN — a number of minutes is an x, so "20 minutes" goes in the x slot: y = 0.15(20) + 1 = 3 + 1 = 4, and 20 minutes costs $4. The answer is a y, so it wears y\'s unit, dollars. Reading the units in the question tells you which slot a number belongs in.',
        'TO FIND THE INPUT FOR A TARGET, PUT THE TARGET IN FOR y AND SOLVE — "$7" is a number of dollars, so it is a y, not an x: 7 = 0.15x + 1. That is a two-step equation, the kind you already solve. Subtract 1 from both sides to get 6 = 0.15x, then divide both sides by 0.15 to get x = 40, so $7 buys 40 minutes. The answer is an x, so it wears x\'s unit, minutes. Check it by predicting with it: 0.15(40) + 1 = 6 + 1 = 7, exactly the target.',
      ],
      vocabulary: [
        { term: 'rate of change', definition: 'the m in y = mx + b: how much y changes for every 1 unit of x, with a two-part unit such as dollars per minute; negative when y goes down as x goes up.' },
        { term: 'initial value', definition: 'the b in y = mx + b: the value of y when x = 0, with y\'s unit alone; on the graph it is the y-intercept, the point (0, b).' },
        { term: 'predict', definition: 'to use a model to compute the output y for a chosen input x by substituting x into the equation.' },
      ],
      suggestedTools: ['show_equation', 'show_table', 'show_function_graph'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-trampoline-park',
      kind: 'worked_example',
      problem:
        'A trampoline park posts a graph of its prices: a straight line that crosses the vertical axis at 8 and rises 6 for every 1 hour to the right, with the equation y = 6x + 8 printed under it, where x is hours of jumping and y is the total cost in dollars. (a) What do the 6 and the 8 mean, with units, and where does each one show on the graph? (b) Fill in the park\'s table for 0, 1, 2 and 3 hours and say where each number shows in it. (c) Predict the cost of 5 hours.',
      steps: [
        'Read the equation next to its variables first: x counts hours and y counts dollars. So every number in this model is either dollars or dollars per hour, and the job each number does tells you which.',
        '(a) The 6 is multiplied by x, so it is charged again for every hour: the rate of change is 6 dollars per hour. As a sentence, each extra hour of jumping adds $6 to the cost. The unit has two parts, dollars per hour, because the rate links a change in y to a change in x.',
        'The 8 stands alone, so it is there before a single hour is jumped: the initial value is $8, the cost at x = 0. As a sentence, walking through the door costs $8 even if you leave right away. Its unit is just dollars, because it is a value of y, not a change in y.',
        'On the graph, the 8 is the height where the line crosses the vertical axis, the point (0, 8). The 6 is the climb: start at any point on the line, move 1 hour to the right, and the line is 6 dollars higher. One step right from (0, 8) lands on (1, 14), and one more lands on (2, 20).',
        '(b) The table for x = 0, 1, 2, 3 hours reads y = 8, 14, 20, 26 dollars, from 6(0) + 8 = 8, 6(1) + 8 = 14, 6(2) + 8 = 20 and 6(3) + 8 = 26. The initial value shows as the y beside x = 0, which is 8. The rate of change shows as the jump from one row to the next as x goes up by 1: 14 - 8 = 6, 20 - 14 = 6, 26 - 20 = 6. Notice that 14 is NOT the rate; 14 is the total after one hour, and 6 is how much it climbed to get there.',
        '(c) "5 hours" is a number of hours, and hours are x, so 5 goes in the x slot: y = 6(5) + 8 = 30 + 8 = 38. Five hours costs $38, and the answer wears dollars because it is a y.',
        'Check against the table: 3 hours is $26, two more hours at $6 each adds $12, and 26 + 12 = 38. The equation and the table agree.',
      ],
      answer: 'Rate of change 6 dollars per hour (the rise for every 1 hour of run; the jump between table rows); initial value $8 (the crossing at (0, 8); the y beside x = 0); 5 hours costs $38',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-candle-when-four-cm',
      kind: 'worked_example',
      problem:
        'Last lesson you built the model y = -0.5x + 12 for a candle that is 12 cm tall when it is lit and burns 0.5 cm every hour, with x in hours and y in centimeters. (a) State what the -0.5 and the 12 mean, with units, and where each one shows on the graph. (b) How tall is the candle after 7 hours? (c) When is the candle 4 cm tall?',
      steps: [
        '(a) The -0.5 rides with x, so it is the rate of change: -0.5 centimeters per hour. The minus sign is the direction: the height goes DOWN 0.5 cm for every 1 hour that passes. The 12 stands alone, so it is the initial value: 12 cm, the height at x = 0, before any burning.',
        'On the graph, the line starts at (0, 12) on the vertical axis and falls 0.5 for every 1 hour to the right, so it passes through (1, 11.5) and (2, 11). A negative rate of change is a line that drops as you read it left to right.',
        '(b) "After 7 hours" hands you an x, because hours are x. Predict by substituting: y = -0.5(7) + 12 = -3.5 + 12 = 8.5. The candle is 8.5 cm tall after 7 hours, and the answer wears centimeters because it is a y.',
        '(c) "4 cm tall" hands you a y, because centimeters are y. So 4 goes in the y slot and x is what you solve for: 4 = -0.5x + 12.',
        'WRONG: dropping the 4 into the x slot, y = -0.5(4) + 12 = -2 + 12 = 10, and answering "10 hours." CORRECT: that calculation answers a different question, how tall the candle is after 4 hours (10 cm). A height is a y. The units in the question pick the slot: hours are x, centimeters are y.',
        'Solve 4 = -0.5x + 12 the way you solve any two-step equation. Subtract 12 from both sides: 4 - 12 = -0.5x, so -8 = -0.5x. Divide both sides by -0.5: -8 ÷ (-0.5) = 16, so x = 16. The candle is 4 cm tall after 16 hours, and the answer wears hours because it is an x.',
        'Check by predicting with the answer: y = -0.5(16) + 12 = -8 + 12 = 4, exactly 4 cm. On the graph that is the point (16, 4): the line has dropped 8 cm from its starting 12, and 8 ÷ 0.5 = 16 hours is how long that drop takes.',
      ],
      answer: 'Rate of change -0.5 cm per hour (height falls 0.5 cm each hour; the line drops 0.5 for every 1 hour of run); initial value 12 cm (the crossing at (0, 12)); 8.5 cm after 7 hours; 4 cm tall after 16 hours',
      estimatedMinutes: 3,
    },
    {
      id: 'try-streaming-rate-meaning',
      kind: 'try_yourself',
      problem:
        'A streaming service bills y = 3x + 12 dollars in a month, where x is the number of extra movie rentals that month. What does the 3 mean in this situation?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The bill is $3 in a month with no rentals' },
        { id: 'b', text: 'Each rental adds 3 movies to the account' },
        { id: 'c', text: 'Each extra rental adds $3 to the bill', correct: true },
        { id: 'd', text: 'The bill goes up $3 every month' },
      ],
      expectedAnswer: 'Each extra rental adds $3 to the bill',
      hints: [
        'The 3 is multiplied by x, so it is charged once for every unit of x. Read what x counts: rentals, not months and not movies.',
        'A rate of change has two units, y\'s unit per x\'s unit. Here that is dollars per rental. Which sentence says exactly that? The amount with no rentals is the number standing alone, not the 3.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-bamboo-table-reading',
      kind: 'try_yourself',
      problem:
        'A science-class bamboo shoot follows the model y = 4x + 30, and its table reads: days x: 0, 1, 2, 3 and height in cm y: 30, 34, 38, 42. Which statement reads the initial value and the rate of change correctly from the table?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The shoot was 30 cm tall on day 0 and grows 4 cm per day', correct: true },
        { id: 'b', text: 'The shoot was 4 cm tall on day 0 and grows 30 cm per day' },
        { id: 'c', text: 'The shoot was 30 cm tall on day 0 and grows 34 cm per day' },
        { id: 'd', text: 'The shoot was 30 cm tall on day 1 and grows 4 cm per day' },
      ],
      expectedAnswer: 'The shoot was 30 cm tall on day 0 and grows 4 cm per day',
      hints: [
        'The initial value is the y beside x = 0, and day 0 is before any growing has happened. Which row is that, and what number sits in it?',
        'The rate of change is the CHANGE from one row to the next, not the height in any one row: 34 - 30, 38 - 34, 42 - 38. The height beside day 1 is a total, not the rate.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-arcade-card',
      kind: 'try_yourself',
      problem:
        'An arcade card follows the model y = -25x + 500, where x is the number of games played and y is the credits left on the card. After how many games does the card hold exactly 125 credits? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '15',
      hints: [
        '125 is a number of credits, and credits are y, so 125 goes in the y slot, not the x slot: 125 = -25x + 500.',
        'Subtract 500 from both sides to get -375 = -25x, then divide both sides by -25. Check by putting your answer back in for x; it must give exactly 125.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-total-as-rate-and-wrong-slot',
      kind: 'misconception_check',
      question:
        'The trampoline park\'s table reads hours x: 0, 1, 2, 3 and cost in dollars y: 8, 14, 20, 26, and its model is y = 6x + 8. Aiden says the rate of change is $14 per hour. Then he is asked how many hours $32 buys, and he answers 200. Check each claim against the model. What went wrong in each case?',
      commonErrors: [
        {
          answer: 'The rate of change is $14 per hour.',
          misconception: 'Reading the y beside x = 1 as the rate, when that number is the TOTAL after one hour and the rate is how much the total changed to get there.',
          correctsTo:
            'The rate of change is the jump from one row to the next as x goes up by 1: 14 - 8 = 6, 20 - 14 = 6, 26 - 20 = 6. It is 6 dollars per hour, the same 6 that sits in front of x in y = 6x + 8. The 14 is $8 to get in plus one hour at $6, a total, not a rate. On the graph, the 6 is the rise for each 1 hour of run, and the 14 is just the height of one point, (1, 14).',
        },
        {
          answer: '200',
          misconception: 'Dropping the target output, $32, into the x slot and computing 6(32) + 8 = 200, when dollars are y and the question asks for an x.',
          correctsTo:
            '$32 is a cost, and cost is y, so it goes in the y slot: 32 = 6x + 8. Subtract 8 from both sides to get 24 = 6x, then divide both sides by 6 to get x = 4. So $32 buys 4 hours, and the answer wears hours because it is an x. Check by predicting with it: 6(4) + 8 = 24 + 8 = 32, exactly the target. Aiden\'s 200 is the cost in dollars of 32 hours of jumping, the answer to a question nobody asked.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The two numbers in a linear model are two sentences about the situation: the rate of change m says how much y changes for every 1 unit of x, and the initial value b says what y is when x = 0.',
        'Always attach units. The rate of change has two units (dollars per hour, cm per hour); the initial value has y\'s unit alone.',
        'A negative rate of change means y goes down by that much for each unit of x; the minus sign is the direction.',
        'On a graph, b is where the line crosses the vertical axis, at (0, b), and m is the rise for every 1 unit of run. In a table, b is the y beside x = 0 and m is the jump from one row to the next when x goes up by 1; the y beside x = 1 is a total, not the rate.',
        'To predict an output, substitute the given x and compute y. To find the input for a target output, substitute the target for y and solve the two-step equation for x.',
        'The units in the question pick the slot: a number of hours or minutes is an x, a number of dollars or centimeters is a y. Check a solved x by predicting with it.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.3', cedTitle: 'Interpreting & Using Linear Models' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
