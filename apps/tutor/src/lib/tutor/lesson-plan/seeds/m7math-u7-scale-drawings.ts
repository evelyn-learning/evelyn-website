/**
 * Grade 7 Math — Geometry: Scale Drawings.
 *
 * Unit 3 proportional reasoning wearing a geometry costume (CCSS 7.G.A.1).
 * A scale factor IS a constant of proportionality: actual = k × drawing, the
 * same y = kx the student already solved. Lengths multiply by k, angles do
 * not move at all, and AREA multiplies by k squared — that last one is the
 * misconception this plan exists to kill.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7MATH_U7_SCALE_DRAWINGS: LessonPlan = {
  id: 'evelyn.ms.m7math.scale-drawings.v1',
  title: 'Scale Drawings',
  curriculum: 'MS',
  grade: '7',
  subject: 'math',
  topic: 'grade-7-math',
  locale: 'en',
  los: [
    {
      id: 'm7math.scale-drawings',
      standard: 'M7MATH-7.3',
      description:
        'Solve problems involving scale drawings of geometric figures, computing actual lengths from a drawing and drawing lengths from actual measurements, and recognizing that a scale factor is a constant of proportionality while area scales by its square (CCSS 7.G.A.1, 7.RP.A.2).',
    },
  ],
  prerequisites: ['m7math.triangle-side-and-angle-conditions'],
  followUps: ['m7math.cross-sections-of-solids'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Connect scale drawings to a map the student already reads, and plant the idea that one multiplier runs the whole picture.',
      script:
        'Think about the little map in the corner of the screen in a video game, or the map of a theme park you get at the gate. The whole park fits in your hand, but nothing about it is a lie. Every path is shrunk by the exact same amount. If you doubled one path and left the rest alone, the map would be useless. That one shared amount has a name you already know from earlier this year: it is a constant of proportionality. Today it gets a second name — scale factor — and you learn what it does to lengths, to angles, and to area, because area does not behave the way most people expect.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-scale-drawings',
      kind: 'concept',
      goal: 'Scale factor as the constant of proportionality, both directions of conversion, and the area rule.',
      keyIdeas: [
        'A SCALE FACTOR IS A CONSTANT OF PROPORTIONALITY — back in Unit 3 you wrote y = kx, where k was one number that turned every x into its matching y. A scale factor does exactly that job here: actual length = k × drawing length. One number, the same one, for every single length in the picture. That is why a scale drawing looks right instead of stretched.',
        'THE SCALE TELLS YOU k — a scale written 1 cm : 4 m means one centimeter on the paper stands for four meters in real life, so k = 4 and the units switch from centimeters to meters. A scale written 1 : 50 has no units at all, and just means the real thing is 50 times as big as the drawing.',
        'THE TWO DIRECTIONS — going from the DRAWING to the ACTUAL thing you MULTIPLY by k, because the real thing is bigger. Going from the ACTUAL thing back to the DRAWING you DIVIDE by k. Before you compute, say out loud which one should end up bigger. If your answer comes out on the wrong side of that, you multiplied when you should have divided.',
        'FINDING k FROM TWO MATCHING LENGTHS — pick one length you know in both places and write it as a ratio: k = actual ÷ drawing. If a real skateboard is 80 cm long and the poster version is 20 cm long, then going from real to poster the factor is 20 ÷ 80 = 0.25. A factor smaller than 1 shrinks; a factor bigger than 1 enlarges.',
        'ANGLES DO NOT CHANGE — scaling stretches lengths but leaves every angle exactly as it was. A 40° corner on the drawing is a 40° corner on the real thing. That is what keeps the shape the same instead of squashed.',
        'AREA SCALES BY k TIMES k, NOT BY k — this is the one that catches people. Area is a length multiplied by another length, so the factor gets applied TWICE. With a scale factor of 4, lengths become 4 times as long but area becomes 16 times as big. Picture a 1 by 1 square growing into a 4 by 4 square: sixteen of the little squares fit inside it, not four.',
      ],
      vocabulary: [
        { term: 'scale drawing', definition: 'a picture of a real object where every length has been multiplied by the same factor.' },
        { term: 'scale', definition: 'a statement like 1 cm : 4 m telling you what one unit on the drawing stands for in real life.' },
        { term: 'scale factor', definition: 'the single number every length is multiplied by; it is the constant of proportionality of the drawing.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-plan-to-actual',
      kind: 'worked_example',
      problem: 'A floor plan uses the scale 1 cm : 4 m. On the plan, a bedroom is a rectangle 3 cm by 2.5 cm. Find the real length, the real width, and the real area of the bedroom.',
      steps: [
        'Read the scale as a multiplier. Every 1 cm on paper stands for 4 m in the room, so the constant of proportionality is 4, and the units change from centimeters to meters.',
        'Going from the drawing to the real room means the answer gets BIGGER, so multiply. Real length = 3 × 4 = 12 m.',
        'Same multiplier for the other side: real width = 2.5 × 4 = 10 m.',
        'Now the area of the real room: 12 × 10 = 120 m².',
        'Here is the part worth staring at. The area on the paper is 3 × 2.5 = 7.5 cm². The real area is 120 m². Is 120 equal to 7.5 × 4? No, 7.5 × 4 = 30, which is far too small. WRONG answer to avoid: 30 m². RIGHT answer: 120 m².',
        'Area picked up the factor twice, once for each side: 4 × 4 = 16, and 7.5 × 16 = 120. That matches the 120 we got by multiplying the real sides together, so both routes agree.',
      ],
      answer: 'The room is 12 m by 10 m, with an area of 120 m².',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-actual-to-drawing',
      kind: 'worked_example',
      problem: 'A poster shows a scale drawing of a real skateboard. The real board is 80 cm long and the poster board is 20 cm long. Find the scale factor from the real board to the poster, then find how wide the poster wheels should be if the real wheels are 6 cm across.',
      steps: [
        'Find k from the one pair of lengths you know in both places. Going from real to poster, k = poster ÷ real = 20 ÷ 80.',
        'Simplify: 20 ÷ 80 = 1/4 = 0.25. The factor is less than 1, which makes sense, because the poster board is smaller than the real board.',
        'Write it as the proportional equation from Unit 3: poster = 0.25 × real. One constant, every length.',
        'Apply it to the wheels: poster wheel = 0.25 × 6 = 1.5 cm.',
        'Check by going backwards. Multiply the poster wheel by 4 to undo the quarter: 1.5 × 4 = 6 cm, which is the real wheel. It matches.',
        'Sense-check the size too. The wheel should end up smaller than 6, and 1.5 is smaller than 6. If you had gotten 24 cm you would know instantly that you multiplied when you should have divided.',
      ],
      answer: 'The scale factor is 0.25, and the poster wheels should be 1.5 cm across.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-map-distance',
      kind: 'try_yourself',
      problem: 'A map uses the scale 1 inch : 25 miles. Two towns are 3.5 inches apart on the map. How far apart are they in real life?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '87.5 miles', correct: true },
        { id: 'b', text: '28.5 miles' },
        { id: 'c', text: '0.14 miles' },
        { id: 'd', text: '8.75 miles' },
      ],
      expectedAnswer: '87.5 miles',
      hints: [
        'Decide first which answer should be bigger, the map distance or the real distance. That tells you whether to multiply or divide.',
        'Real is bigger, so multiply: 3.5 × 25. Break it up if it helps — 3 × 25 = 75 and 0.5 × 25 = 12.5.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-scaled-area',
      kind: 'try_yourself',
      problem: 'A rectangle in a scale drawing measures 4 cm by 2 cm. The scale factor from the drawing to the actual figure is 5. What is the area of the actual figure?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '40 cm²' },
        { id: 'b', text: '200 cm²', correct: true },
        { id: 'c', text: '8 cm²' },
        { id: 'd', text: '1000 cm²' },
      ],
      expectedAnswer: '200 cm²',
      hints: [
        'The safest route is to scale each SIDE first, then multiply the two scaled sides together.',
        '4 × 5 = 20 and 2 × 5 = 10, so the actual rectangle is 20 cm by 10 cm. Now find its area.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-model-car',
      kind: 'try_yourself',
      problem: 'A model car is built to the scale 1 cm : 18 cm. The model is 12 cm long. How long is the real car, in centimeters? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '216',
      hints: [
        'The real car is 18 times as long as the model, so this is a multiplication.',
        'Compute 12 × 18. Split it up: 12 × 10 = 120 and 12 × 8 = 96.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-area-scales-by-k',
      kind: 'misconception_check',
      question:
        'A logo is drawn as a rectangle 3 cm by 2 cm, so its area on the drawing is 6 cm². The real sign uses a scale factor of 4. A student says the real sign has an area of 24 cm². What went wrong?',
      commonErrors: [
        {
          answer: '24 cm²',
          misconception: 'Multiplying the AREA by the scale factor, the same way a single length gets multiplied by it. Area is not a length, so it does not follow the length rule.',
          correctsTo:
            'Scale the sides first and see what happens. The real sign is 3 × 4 = 12 cm by 2 × 4 = 8 cm, so its area is 12 × 8 = 96 cm². The factor of 4 got used twice, once on each side, which means area is multiplied by 4 × 4 = 16. Check it: 6 × 16 = 96. Same answer. Lengths scale by the scale factor; area scales by the scale factor times itself.',
        },
        {
          answer: '1.5 cm²',
          misconception: 'Dividing instead of multiplying, because the word "scale" got attached to shrinking rather than to the direction the problem actually asks for.',
          correctsTo:
            'Say out loud which one should be bigger before computing. The real sign is bigger than the drawing, so the answer has to be larger than 6 cm², and 1.5 is smaller. Going from drawing to actual you multiply. You only divide going the other way, from the actual object back down to the drawing.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A scale factor is a constant of proportionality: actual = k × drawing, the same y = kx from Unit 3.',
        'Drawing to actual, multiply by k. Actual to drawing, divide by k. Say which should be bigger before you compute.',
        'Find k by dividing two matching lengths, one from each version of the figure.',
        'Angles never change when a figure is scaled. Only lengths change.',
        'AREA does not scale by k. It scales by k times k, because area uses two lengths: a scale factor of 4 makes area 16 times as big.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.3', cedTitle: 'Scale Drawings' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
