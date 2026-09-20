/**
 * Grade 8 Math — Unit 7 CED 7.2: Constructing Linear Models from Descriptions.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m8math.constructing-linear-models-from-descriptions.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M8MATH_U7_CONSTRUCTING_LINEAR_MODELS_FROM_DESCRIPTIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m8math.constructing-linear-models-from-descriptions.v1',
  course: 'Grade 8 Math',
  cedUnit: 7,
  cedTopic: '7.2',
  cedTitle: 'Constructing Linear Models from Descriptions',
  planId: 'evelyn.ms.m8math.constructing-linear-models-from-descriptions.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m8math.constructing-linear-models-from-descriptions.v1' }],
  theory: [
    { loId: 'm8math.constructing-linear-models-from-descriptions', kind: 'framework', title: 'Two jobs in every story', content: `TWO JOBS IN EVERY STORY — a starting-amount-plus-rate story always has one number that happens ONCE and one number that happens AGAIN for every unit. In "a $20 sign-up fee plus $5 per class", the $20 is paid one time and the $5 is paid once for each class. Sorting the two numbers by their job is the entire skill.` },
    { loId: 'm8math.constructing-linear-models-from-descriptions', content: `NAME x AND y BEFORE YOU WRITE — x is the count that the rate is "per": classes, hours, weeks. y is the total that changes as x grows: cost, height, money in the jar. Say it in words before touching the equation: "x is the number of classes, y is the total cost in dollars." A model with unnamed variables is a guess.` },
    { loId: 'm8math.constructing-linear-models-from-descriptions', content: `THE "PER" NUMBER IS m — the rate multiplies x because it is charged once for every unit of x. $5 per class, x classes, 5x dollars. Hunt for "per", "each", "every", "a week", "an hour": whatever number is attached to that word is the rate of change, and it goes in front of x.` },
    { loId: 'm8math.constructing-linear-models-from-descriptions', content: `THE ONCE-ONLY NUMBER IS b — the starting amount stands alone because it does not depend on x. A sign-up fee, the height a candle starts at, the money already in the jar: each one is the value of y when x = 0, and each one is added on once. So the gym costs y = 5x + 20. Writing it as y = 20 + 5x is the same equation, just with the terms in the other order; y = mx + b puts the rate first.` },
    { loId: 'm8math.constructing-linear-models-from-descriptions', kind: 'framework', title: 'The sentence order does not decide', content: `THE SENTENCE ORDER DOES NOT DECIDE — "a $20 fee plus $5 per class" and "classes are $5 each after a $20 fee" are the same story and the same equation, y = 5x + 20. The number stated first is not automatically m or automatically b. The job decides, never the position in the sentence. When the story has no once-only amount at all, b is 0 and the model is the y = kx you already own.` },
    { loId: 'm8math.constructing-linear-models-from-descriptions', kind: 'framework', title: 'A rate that takes away is negative', content: `A RATE THAT TAKES AWAY IS NEGATIVE — a 12 cm candle burning 0.5 cm per hour gets shorter, so the rate pulls height away: m = -0.5 and the model is y = -0.5x + 12. The starting amount stays positive, because the candle really does start at 12 cm. If y goes down as x goes up, m is negative; if y goes up, m is positive. Then check the finished equation against the story: at x = 0 it must give the starting amount, and at x = 1 it must give the starting amount plus or minus one rate. For the candle, -0.5(0) + 12 = 12 and -0.5(1) + 12 = 11.5, both exactly what the story says.` },
    { loId: 'm8math.constructing-linear-models-from-descriptions', kind: 'definition', title: 'linear model', content: `an equation of the form y = mx + b that describes a real situation whose total changes by the same amount for every unit of x.` },
    { loId: 'm8math.constructing-linear-models-from-descriptions', kind: 'definition', title: 'rate of change', content: `the amount y changes for each 1 unit of x, the "per" number in the story; it is the m in y = mx + b and it is negative when y decreases.` },
    { loId: 'm8math.constructing-linear-models-from-descriptions', kind: 'definition', title: 'initial value', content: 'the starting amount, the value of y when x = 0; it is the b in y = mx + b.' },
  ],
  methods: [
    {
      title: 'Worked climbing gym',
      steps: [
        `Name the variables first. x is the number of classes, because that is what the $5 is "per". y is the total cost in dollars, because that is what changes as classes are added.`,
        `Find the "per". $5 per class is charged once for every class, so it multiplies x. That makes m = 5, and the rate part of the model is 5x.`,
        `Find the once-only amount. The $20 sign-up fee is paid one time, whether you take 1 class or 30, so it stands alone. That makes b = 20.`,
        'Write y = mx + b with the numbers in place: y = 5x + 20.',
        `Check it against the story. At x = 0 classes, y = 5(0) + 20 = 20, which is just the fee. At x = 1 class, y = 5(1) + 20 = 25, the fee plus one class. At x = 4 classes, y = 5(4) + 20 = 20 + 20 = 40, and counting it out by hand, a $20 fee plus $5 four times is $20 + $20 = $40. The equation and the story agree.`,
        `The same story in a different order, "classes are $5 each once you have paid the $20 sign-up fee", gives the same equation, y = 5x + 20. The order of the words does not decide which number is m; the job each number does decides.`,
      ],
      example: { problem: `A climbing gym charges a $20 sign-up fee, and after that each class costs $5. Write a linear model for the total cost y, in dollars, of taking x classes.`, solution: 'y = 5x + 20' },
      relatedLoIds: ['m8math.constructing-linear-models-from-descriptions'],
    },
    {
      title: 'Worked burning candle',
      steps: [
        `Name the variables. x is the number of hours, since the 0.5 cm is "every hour". y is the height in centimeters, the thing that changes.`,
        `Find the "per". 0.5 cm every hour is the rate, so it goes with x. Now look at the direction: the candle gets SHORTER each hour, so the rate takes height away. That makes m = -0.5, not 0.5.`,
        `Find the once-only amount. The candle starts at 12 cm before any burning happens, so b = 12. It stays positive, because the starting height is a real 12 cm; only the rate carries the minus sign.`,
        'Write it: y = -0.5x + 12.',
        `WRONG: y = 0.5x + 12. CORRECT: y = -0.5x + 12. Test the wrong one at x = 2: 0.5(2) + 12 = 13, and a burning candle does not grow 1 cm taller in two hours. The minus sign on m is what makes the height fall.`,
        `WRONG: y = 12x - 0.5. CORRECT: y = -0.5x + 12. Nothing in the story happens "12 per hour", so 12 cannot be the rate; it is the starting height. The number attached to "every hour" is the m, and the number described as the starting size is the b, no matter which one the sentence says first.`,
        `Check the correct model against the story. At x = 0, y = -0.5(0) + 12 = 12, the starting height. At x = 2, y = -0.5(2) + 12 = -1 + 12 = 11, and two hours of burning at 0.5 cm each takes off 1 cm, leaving 11 cm. At x = 10, y = -0.5(10) + 12 = -5 + 12 = 7. Story and equation agree at every point checked.`,
      ],
      example: { problem: `A candle is 12 cm tall when it is lit, and it burns down 0.5 cm every hour. Write a linear model for the height y, in centimeters, after x hours of burning.`, solution: 'y = -0.5x + 12' },
      relatedLoIds: ['m8math.constructing-linear-models-from-descriptions'],
    },
  ],
  pointers: [
    { content: `Students often say "y = 30x + 2" — The job decides, not the position in the sentence. The number attached to "every day" is the rate, so m is built from the 2, and the 30 inches is the depth before any melting, so b = 30. The check exposes the swap immediately: at x = 0, Priya gets 30(0) + 2 = 2, but the pile starts at 30 inches, not 2. The pile is melting, so the rate is negative and the correct model is y = -2x + 30, which gives -2(0) + 30 = 30 at x = 0 and -2(1) + 30 = 28 at x = 1, exactly a 30 inch pile with 2 inches gone after one day.`, kind: 'common-error' },
    { content: `Students often say "y = 2x + 30" — Marcus put 2 with x and 30 alone, which is the right sorting, but a pile that melts is losing depth, so the rate takes away and must be negative. His check shows the problem: at x = 1, 2(1) + 30 = 32, and a melting pile does not grow 2 inches deeper in a day. The correct model is y = -2x + 30. At x = 0 it gives 30, the starting depth, and at x = 1 it gives -2 + 30 = 28, which is 30 with 2 melted away.`, kind: 'common-error' },
    { content: `Every starting-amount-plus-rate story becomes y = mx + b: the rate is m and the starting amount is b.`, kind: 'tip' },
    { content: `Name x and y in words before writing: x is the count the rate is "per", y is the total that changes.`, kind: 'tip' },
    { content: `Find the "per": the number charged or changed once for EVERY unit of x is the rate, so it multiplies x.`, kind: 'tip' },
    { content: `The number that is there once, before any x happens (a fee, a starting height, money already saved), is b and stands alone. The order of the words in the sentence does not decide which number is which; the job does.`, kind: 'tip' },
    { content: `If y goes down as x grows (burning, draining, melting), the rate is negative and the starting amount stays positive.`, kind: 'tip' },
    { content: `Check the finished equation at x = 0 (it must give b) and at x = 1 (b plus or minus one rate) before you trust it.`, kind: 'tip' },
  ],
};
