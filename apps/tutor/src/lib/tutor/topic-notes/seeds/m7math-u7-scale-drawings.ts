/**
 * Grade 7 Math — Unit 7 CED 7.3: Scale Drawings.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7math.scale-drawings.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7MATH_U7_SCALE_DRAWINGS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7math.scale-drawings.v1',
  course: 'Grade 7 Math',
  cedUnit: 7,
  cedTopic: '7.3',
  cedTitle: 'Scale Drawings',
  planId: 'evelyn.ms.m7math.scale-drawings.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7math.scale-drawings.v1' }],
  theory: [
    { loId: 'm7math.scale-drawings', kind: 'framework', title: 'A scale factor is a constant of proportionality', content: `A SCALE FACTOR IS A CONSTANT OF PROPORTIONALITY — back in Unit 3 you wrote y = kx, where k was one number that turned every x into its matching y. A scale factor does exactly that job here: actual length = k × drawing length. One number, the same one, for every single length in the picture. That is why a scale drawing looks right instead of stretched.` },
    { loId: 'm7math.scale-drawings', content: `THE SCALE TELLS YOU k — a scale written 1 cm : 4 m means one centimeter on the paper stands for four meters in real life, so k = 4 and the units switch from centimeters to meters. A scale written 1 : 50 has no units at all, and just means the real thing is 50 times as big as the drawing.` },
    { loId: 'm7math.scale-drawings', kind: 'framework', title: 'The two directions', content: `THE TWO DIRECTIONS — going from the DRAWING to the ACTUAL thing you MULTIPLY by k, because the real thing is bigger. Going from the ACTUAL thing back to the DRAWING you DIVIDE by k. Before you compute, say out loud which one should end up bigger. If your answer comes out on the wrong side of that, you multiplied when you should have divided.` },
    { loId: 'm7math.scale-drawings', content: `FINDING k FROM TWO MATCHING LENGTHS — pick one length you know in both places and write it as a ratio: k = actual ÷ drawing. If a real skateboard is 80 cm long and the poster version is 20 cm long, then going from real to poster the factor is 20 ÷ 80 = 0.25. A factor smaller than 1 shrinks; a factor bigger than 1 enlarges.` },
    { loId: 'm7math.scale-drawings', kind: 'framework', title: 'Angles do not change', content: `ANGLES DO NOT CHANGE — scaling stretches lengths but leaves every angle exactly as it was. A 40° corner on the drawing is a 40° corner on the real thing. That is what keeps the shape the same instead of squashed.` },
    { loId: 'm7math.scale-drawings', content: `AREA SCALES BY k TIMES k, NOT BY k — this is the one that catches people. Area is a length multiplied by another length, so the factor gets applied TWICE. With a scale factor of 4, lengths become 4 times as long but area becomes 16 times as big. Picture a 1 by 1 square growing into a 4 by 4 square: sixteen of the little squares fit inside it, not four.` },
    { loId: 'm7math.scale-drawings', kind: 'definition', title: 'scale drawing', content: `a picture of a real object where every length has been multiplied by the same factor.` },
    { loId: 'm7math.scale-drawings', kind: 'definition', title: 'scale', content: `a statement like 1 cm : 4 m telling you what one unit on the drawing stands for in real life.` },
    { loId: 'm7math.scale-drawings', kind: 'definition', title: 'scale factor', content: `the single number every length is multiplied by; it is the constant of proportionality of the drawing.` },
  ],
  methods: [
    {
      title: 'Worked plan to actual',
      steps: [
        `Read the scale as a multiplier. Every 1 cm on paper stands for 4 m in the room, so the constant of proportionality is 4, and the units change from centimeters to meters.`,
        `Going from the drawing to the real room means the answer gets BIGGER, so multiply. Real length = 3 × 4 = 12 m.`,
        'Same multiplier for the other side: real width = 2.5 × 4 = 10 m.',
        'Now the area of the real room: 12 × 10 = 120 m².',
        `Here is the part worth staring at. The area on the paper is 3 × 2.5 = 7.5 cm². The real area is 120 m². Is 120 equal to 7.5 × 4? No, 7.5 × 4 = 30, which is far too small. WRONG answer to avoid: 30 m². RIGHT answer: 120 m².`,
        `Area picked up the factor twice, once for each side: 4 × 4 = 16, and 7.5 × 16 = 120. That matches the 120 we got by multiplying the real sides together, so both routes agree.`,
      ],
      example: { problem: `A floor plan uses the scale 1 cm : 4 m. On the plan, a bedroom is a rectangle 3 cm by 2.5 cm. Find the real length, the real width, and the real area of the bedroom.`, solution: 'The room is 12 m by 10 m, with an area of 120 m².' },
      relatedLoIds: ['m7math.scale-drawings'],
    },
    {
      title: 'Worked actual to drawing',
      steps: [
        `Find k from the one pair of lengths you know in both places. Going from real to poster, k = poster ÷ real = 20 ÷ 80.`,
        `Simplify: 20 ÷ 80 = 1/4 = 0.25. The factor is less than 1, which makes sense, because the poster board is smaller than the real board.`,
        `Write it as the proportional equation from Unit 3: poster = 0.25 × real. One constant, every length.`,
        'Apply it to the wheels: poster wheel = 0.25 × 6 = 1.5 cm.',
        `Check by going backwards. Multiply the poster wheel by 4 to undo the quarter: 1.5 × 4 = 6 cm, which is the real wheel. It matches.`,
        `Sense-check the size too. The wheel should end up smaller than 6, and 1.5 is smaller than 6. If you had gotten 24 cm you would know instantly that you multiplied when you should have divided.`,
      ],
      example: { problem: `A poster shows a scale drawing of a real skateboard. The real board is 80 cm long and the poster board is 20 cm long. Find the scale factor from the real board to the poster, then find how wide the poster wheels should be if the real wheels are 6 cm across.`, solution: 'The scale factor is 0.25, and the poster wheels should be 1.5 cm across.' },
      relatedLoIds: ['m7math.scale-drawings'],
    },
  ],
  pointers: [
    { content: `Students often say "24 cm²" — Scale the sides first and see what happens. The real sign is 3 × 4 = 12 cm by 2 × 4 = 8 cm, so its area is 12 × 8 = 96 cm². The factor of 4 got used twice, once on each side, which means area is multiplied by 4 × 4 = 16. Check it: 6 × 16 = 96. Same answer. Lengths scale by the scale factor; area scales by the scale factor times itself.`, kind: 'common-error' },
    { content: `Students often say "1.5 cm²" — Say out loud which one should be bigger before computing. The real sign is bigger than the drawing, so the answer has to be larger than 6 cm², and 1.5 is smaller. Going from drawing to actual you multiply. You only divide going the other way, from the actual object back down to the drawing.`, kind: 'common-error' },
    { content: `A scale factor is a constant of proportionality: actual = k × drawing, the same y = kx from Unit 3.`, kind: 'tip' },
    { content: `Drawing to actual, multiply by k. Actual to drawing, divide by k. Say which should be bigger before you compute.`, kind: 'tip' },
    { content: 'Find k by dividing two matching lengths, one from each version of the figure.', kind: 'tip' },
    { content: 'Angles never change when a figure is scaled. Only lengths change.', kind: 'tip' },
    { content: `AREA does not scale by k. It scales by k times k, because area uses two lengths: a scale factor of 4 makes area 16 times as big.`, kind: 'tip' },
    { content: `Never multiply an area by the scale factor once. Area scales by k × k. With k = 4, lengths get 4× longer but area gets 16× bigger. Safest move: scale both sides first, then multiply them.`, kind: 'common-error' },
    { content: `Before computing, say out loud which answer should be bigger — the real thing or the drawing. Drawing → actual: multiply. Actual → drawing: divide. If your answer lands on the wrong side, you used the wrong operation.`, kind: 'tip' },
    { content: `Watch the units in a scale like 1 cm : 4 m. The number 4 changes centimeters into METERS, not centimeters. Write the unit on your answer as you go, or you'll report 12 cm when the room is really 12 m.`, kind: 'gotcha' },
    { content: `A scale factor doesn't have to be bigger than 1. If k is less than 1 (like 0.25), the new figure is SMALLER. That's still a valid scale factor, not a mistake.`, kind: 'edge-case' },
    { content: `"Scale" and "scale factor" are not the same word. The scale is the statement (1 in : 25 mi). The scale factor is the single number you multiply by (25). A scale like 1 : 50 has no units at all.`, kind: 'vocab-note' },
    { content: `Angles do NOT get multiplied by k. A 40° corner stays 40° in the real object no matter how big the scale factor is. Only lengths change.`, kind: 'gotcha' },
    { content: `When you find k by dividing two matching lengths, keep the same direction top and bottom. Real ÷ drawing gives the factor for drawing → real; drawing ÷ real gives the reverse. Label which one you found.`, kind: 'common-error' },
    { content: `Check your answer by going backwards. If the poster wheel is 1.5 cm and k was 0.25, then 1.5 ÷ 0.25 = 6 cm, the real wheel. If it doesn't come back to the number you started with, redo it.`, kind: 'tip' },
  ],
};
