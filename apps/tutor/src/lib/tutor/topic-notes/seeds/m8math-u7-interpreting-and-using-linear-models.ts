/**
 * Grade 8 Math — Unit 7 CED 7.3: Interpreting & Using Linear Models.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m8math.interpreting-and-using-linear-models.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M8MATH_U7_INTERPRETING_AND_USING_LINEAR_MODELS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m8math.interpreting-and-using-linear-models.v1',
  course: 'Grade 8 Math',
  cedUnit: 7,
  cedTopic: '7.3',
  cedTitle: 'Interpreting & Using Linear Models',
  planId: 'evelyn.ms.m8math.interpreting-and-using-linear-models.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m8math.interpreting-and-using-linear-models.v1' }],
  theory: [
    { loId: 'm8math.interpreting-and-using-linear-models', kind: 'framework', title: 'Each number in a model is a sentence with a unit', content: `EACH NUMBER IN A MODEL IS A SENTENCE WITH A UNIT — in y = 0.15x + 1, the 0.15 and the 1 are not just numbers, they are facts about the scooter ride. The 0.15 says "the cost goes up $0.15 for every 1 minute you ride." The 1 says "the ride costs $1 before a single minute has passed." Saying "the rate is 0.15" with no unit and no "per" is half an answer, because 0.15 of what, for each what?` },
    { loId: 'm8math.interpreting-and-using-linear-models', content: `THE RATE OF CHANGE IS A "PER" SENTENCE WITH TWO UNITS — the rate of change is the m, the number multiplied by x, and its unit is always y's unit per x's unit: dollars per minute here, centimeters per hour for a burning candle. Its sign is its direction. A candle model y = -0.5x + 12 has a rate of change of -0.5 centimeters per hour, which reads "the height goes DOWN 0.5 cm for every 1 hour," and the minus sign is what says down.` },
    { loId: 'm8math.interpreting-and-using-linear-models', content: `THE INITIAL VALUE IS THE "BEFORE ANYTHING HAPPENS" AMOUNT — the initial value is the b, the number standing alone, and it is the value of y when x = 0: the $1 unlock fee at 0 minutes, the 12 cm candle at 0 hours. Its unit is y's unit by itself, dollars or centimeters, with no "per," because it is an amount of y, not a change in y.` },
    { loId: 'm8math.interpreting-and-using-linear-models', kind: 'framework', title: 'Where they show on the graph and in the table', content: `WHERE THEY SHOW ON THE GRAPH AND IN THE TABLE — on the graph, b is the height where the line crosses the vertical axis, the point (0, b), which you already call the y-intercept. m is the rise for every 1 unit of run: from any point on the line, move 1 minute to the right and the line sits 0.15 higher, or 0.5 lower for the candle. In a table whose x-values go 0, 1, 2, 3, b is the y sitting beside x = 0, and m is the jump from one row to the next. The y beside x = 1 is a total, not the rate; the rate is how much it climbed to get there.` },
    { loId: 'm8math.interpreting-and-using-linear-models', kind: 'framework', title: 'To predict an output, put the input in', content: `TO PREDICT AN OUTPUT, PUT THE INPUT IN — a number of minutes is an x, so "20 minutes" goes in the x slot: y = 0.15(20) + 1 = 3 + 1 = 4, and 20 minutes costs $4. The answer is a y, so it wears y's unit, dollars. Reading the units in the question tells you which slot a number belongs in.` },
    { loId: 'm8math.interpreting-and-using-linear-models', content: `TO FIND THE INPUT FOR A TARGET, PUT THE TARGET IN FOR y AND SOLVE — "$7" is a number of dollars, so it is a y, not an x: 7 = 0.15x + 1. That is a two-step equation, the kind you already solve. Subtract 1 from both sides to get 6 = 0.15x, then divide both sides by 0.15 to get x = 40, so $7 buys 40 minutes. The answer is an x, so it wears x's unit, minutes. Check it by predicting with it: 0.15(40) + 1 = 6 + 1 = 7, exactly the target.` },
    { loId: 'm8math.interpreting-and-using-linear-models', kind: 'definition', title: 'rate of change', content: `the m in y = mx + b: how much y changes for every 1 unit of x, with a two-part unit such as dollars per minute; negative when y goes down as x goes up.` },
    { loId: 'm8math.interpreting-and-using-linear-models', kind: 'definition', title: 'initial value', content: `the b in y = mx + b: the value of y when x = 0, with y's unit alone; on the graph it is the y-intercept, the point (0, b).` },
    { loId: 'm8math.interpreting-and-using-linear-models', kind: 'definition', title: 'predict', content: `to use a model to compute the output y for a chosen input x by substituting x into the equation.` },
  ],
  methods: [
    {
      title: 'Worked trampoline park',
      steps: [
        `Read the equation next to its variables first: x counts hours and y counts dollars. So every number in this model is either dollars or dollars per hour, and the job each number does tells you which.`,
        `(a) The 6 is multiplied by x, so it is charged again for every hour: the rate of change is 6 dollars per hour. As a sentence, each extra hour of jumping adds $6 to the cost. The unit has two parts, dollars per hour, because the rate links a change in y to a change in x.`,
        `The 8 stands alone, so it is there before a single hour is jumped: the initial value is $8, the cost at x = 0. As a sentence, walking through the door costs $8 even if you leave right away. Its unit is just dollars, because it is a value of y, not a change in y.`,
        `On the graph, the 8 is the height where the line crosses the vertical axis, the point (0, 8). The 6 is the climb: start at any point on the line, move 1 hour to the right, and the line is 6 dollars higher. One step right from (0, 8) lands on (1, 14), and one more lands on (2, 20).`,
        `(b) The table for x = 0, 1, 2, 3 hours reads y = 8, 14, 20, 26 dollars, from 6(0) + 8 = 8, 6(1) + 8 = 14, 6(2) + 8 = 20 and 6(3) + 8 = 26. The initial value shows as the y beside x = 0, which is 8. The rate of change shows as the jump from one row to the next as x goes up by 1: 14 - 8 = 6, 20 - 14 = 6, 26 - 20 = 6. Notice that 14 is NOT the rate; 14 is the total after one hour, and 6 is how much it climbed to get there.`,
        `(c) "5 hours" is a number of hours, and hours are x, so 5 goes in the x slot: y = 6(5) + 8 = 30 + 8 = 38. Five hours costs $38, and the answer wears dollars because it is a y.`,
        `Check against the table: 3 hours is $26, two more hours at $6 each adds $12, and 26 + 12 = 38. The equation and the table agree.`,
      ],
      example: { problem: `A trampoline park posts a graph of its prices: a straight line that crosses the vertical axis at 8 and rises 6 for every 1 hour to the right, with the equation y = 6x + 8 printed under it, where x is hours of jumping and y is the total cost in dollars. (a) What do the 6 and the 8 mean, with units, and where does each one show on the graph? (b) Fill in the park's table for 0, 1, 2 and 3 hours and say where each number shows in it. (c) Predict the cost of 5 hours.`, solution: `Rate of change 6 dollars per hour (the rise for every 1 hour of run; the jump between table rows); initial value $8 (the crossing at (0, 8); the y beside x = 0); 5 hours costs $38` },
      relatedLoIds: ['m8math.interpreting-and-using-linear-models'],
    },
    {
      title: 'Worked candle when four cm',
      steps: [
        `(a) The -0.5 rides with x, so it is the rate of change: -0.5 centimeters per hour. The minus sign is the direction: the height goes DOWN 0.5 cm for every 1 hour that passes. The 12 stands alone, so it is the initial value: 12 cm, the height at x = 0, before any burning.`,
        `On the graph, the line starts at (0, 12) on the vertical axis and falls 0.5 for every 1 hour to the right, so it passes through (1, 11.5) and (2, 11). A negative rate of change is a line that drops as you read it left to right.`,
        `(b) "After 7 hours" hands you an x, because hours are x. Predict by substituting: y = -0.5(7) + 12 = -3.5 + 12 = 8.5. The candle is 8.5 cm tall after 7 hours, and the answer wears centimeters because it is a y.`,
        `(c) "4 cm tall" hands you a y, because centimeters are y. So 4 goes in the y slot and x is what you solve for: 4 = -0.5x + 12.`,
        `WRONG: dropping the 4 into the x slot, y = -0.5(4) + 12 = -2 + 12 = 10, and answering "10 hours." CORRECT: that calculation answers a different question, how tall the candle is after 4 hours (10 cm). A height is a y. The units in the question pick the slot: hours are x, centimeters are y.`,
        `Solve 4 = -0.5x + 12 the way you solve any two-step equation. Subtract 12 from both sides: 4 - 12 = -0.5x, so -8 = -0.5x. Divide both sides by -0.5: -8 ÷ (-0.5) = 16, so x = 16. The candle is 4 cm tall after 16 hours, and the answer wears hours because it is an x.`,
        `Check by predicting with the answer: y = -0.5(16) + 12 = -8 + 12 = 4, exactly 4 cm. On the graph that is the point (16, 4): the line has dropped 8 cm from its starting 12, and 8 ÷ 0.5 = 16 hours is how long that drop takes.`,
      ],
      example: { problem: `Last lesson you built the model y = -0.5x + 12 for a candle that is 12 cm tall when it is lit and burns 0.5 cm every hour, with x in hours and y in centimeters. (a) State what the -0.5 and the 12 mean, with units, and where each one shows on the graph. (b) How tall is the candle after 7 hours? (c) When is the candle 4 cm tall?`, solution: `Rate of change -0.5 cm per hour (height falls 0.5 cm each hour; the line drops 0.5 for every 1 hour of run); initial value 12 cm (the crossing at (0, 12)); 8.5 cm after 7 hours; 4 cm tall after 16 hours` },
      relatedLoIds: ['m8math.interpreting-and-using-linear-models'],
    },
  ],
  pointers: [
    { content: `Students often say "The rate of change is $14 per hour." — The rate of change is the jump from one row to the next as x goes up by 1: 14 - 8 = 6, 20 - 14 = 6, 26 - 20 = 6. It is 6 dollars per hour, the same 6 that sits in front of x in y = 6x + 8. The 14 is $8 to get in plus one hour at $6, a total, not a rate. On the graph, the 6 is the rise for each 1 hour of run, and the 14 is just the height of one point, (1, 14).`, kind: 'common-error' },
    { content: `Students often say "200" — $32 is a cost, and cost is y, so it goes in the y slot: 32 = 6x + 8. Subtract 8 from both sides to get 24 = 6x, then divide both sides by 6 to get x = 4. So $32 buys 4 hours, and the answer wears hours because it is an x. Check by predicting with it: 6(4) + 8 = 24 + 8 = 32, exactly the target. Aiden's 200 is the cost in dollars of 32 hours of jumping, the answer to a question nobody asked.`, kind: 'common-error' },
    { content: `The two numbers in a linear model are two sentences about the situation: the rate of change m says how much y changes for every 1 unit of x, and the initial value b says what y is when x = 0.`, kind: 'tip' },
    { content: `Always attach units. The rate of change has two units (dollars per hour, cm per hour); the initial value has y's unit alone.`, kind: 'tip' },
    { content: `A negative rate of change means y goes down by that much for each unit of x; the minus sign is the direction.`, kind: 'tip' },
    { content: `On a graph, b is where the line crosses the vertical axis, at (0, b), and m is the rise for every 1 unit of run. In a table, b is the y beside x = 0 and m is the jump from one row to the next when x goes up by 1; the y beside x = 1 is a total, not the rate.`, kind: 'tip' },
    { content: `To predict an output, substitute the given x and compute y. To find the input for a target output, substitute the target for y and solve the two-step equation for x.`, kind: 'tip' },
    { content: `The units in the question pick the slot: a number of hours or minutes is an x, a number of dollars or centimeters is a y. Check a solved x by predicting with it.`, kind: 'tip' },
    { content: `The rate of change has TWO units (dollars per hour, cm per minute). The initial value has ONE unit (just dollars, just cm). If you write a number with no unit or the wrong unit, you haven't finished the answer.`, kind: 'vocab-note' },
    { content: `The y-value beside x = 1 in a table is a TOTAL, not the rate of change. The rate of change is the jump from one row to the next. If y goes 8 → 14 → 20 → 26, the rate is 6, not 14.`, kind: 'common-error' },
    { content: `READ THE UNITS IN THE QUESTION TO PICK THE SLOT. 'After 7 hours' → x = 7. '4 cm tall' → y = 4. Don't guess; the unit tells you which variable the number belongs in.`, kind: 'tip' },
    { content: `A NEGATIVE rate of change means the line FALLS as you read left to right, and y goes down. The minus sign is direction, not just a symbol. In y = -0.5x + 12, the height drops 0.5 cm each hour.`, kind: 'gotcha' },
    { content: `When you solve for x (e.g., 4 = -0.5x + 12), ALWAYS check your answer by predicting with it. Plug your x back into the equation and verify you get the target y. This catches sign errors and arithmetic mistakes.`, kind: 'tip' },
    { content: `Don't confuse 'the rate' with 'the value at x = 1.' On a graph, the rate is the rise for every 1 right; it's how steep the line is. The point (1, 14) is a location, not a rate.`, kind: 'vocab-note' },
    { content: `The initial value b sits at (0, b) on the graph and is the y beside x = 0 in the table. It's the amount BEFORE anything happens. On the graph, it's where the line crosses the vertical axis, period.`, kind: 'edge-case' },
    { content: `When predicting or solving, show the substitution step. Write y = 6(5) + 8, not just 38. This makes it clear which number went in which slot and helps you (and your teacher) spot where an error crept in.`, kind: 'tip' },
  ],
};
