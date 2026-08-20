/**
 * Grade 7 Math — Unit 6 CED 6.2: Two-Step Equations.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7math.two-step-equations.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7MATH_U6_TWO_STEP_EQUATIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7math.two-step-equations.v1',
  course: 'Grade 7 Math',
  cedUnit: 6,
  cedTopic: '6.2',
  cedTitle: 'Two-Step Equations',
  planId: 'evelyn.ms.m7math.two-step-equations.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7math.two-step-equations.v1' }],
  theory: [
    { loId: 'm7math.two-step-equations', kind: 'framework', title: 'Two operations, two undo-steps', content: `TWO OPERATIONS, TWO UNDO-STEPS — an equation like 3p + 2 = 11 has the variable multiplied AND then added to. Each operation needs its own inverse, so the solve takes two moves instead of one.` },
    { loId: 'm7math.two-step-equations', kind: 'framework', title: 'Undo in reverse order', content: `UNDO IN REVERSE ORDER — order of operations says you would multiply first and add second when building the value. To take it apart you go backwards: undo the addition or subtraction FIRST, and undo the multiplication or division LAST. Shoes off before socks.` },
    { loId: 'm7math.two-step-equations', kind: 'framework', title: 'Why that order', content: `WHY THAT ORDER — the plus 2 is sitting outside, added on at the end, so it is the easiest thing to reach. The times 3 is wrapped tightly around p and cannot come off until the 2 is gone. Reaching for the 3 first means dividing a side that still has two pieces on it, and then you must divide BOTH pieces or the equation stops being true.` },
    { loId: 'm7math.two-step-equations', kind: 'framework', title: 'Both sides, every move', content: `BOTH SIDES, EVERY MOVE — subtract 2 from the left, subtract 2 from the right. Divide the left by 3, divide the right by 3. The equation stays true only if the two sides get identical treatment.` },
    { loId: 'm7math.two-step-equations', kind: 'framework', title: 'The sign belongs to the term', content: `THE SIGN BELONGS TO THE TERM — in 9 − 2x = 23 the variable term is −2x, minus included. Clear the 9 first and you are left with −2x = 14, so the last step divides by −2 and the answer is negative. Dropping that minus sign is the second most common mistake in this lesson.` },
    { loId: 'm7math.two-step-equations', kind: 'framework', title: 'Check by substituting', content: `CHECK BY SUBSTITUTING — put the answer back into the ORIGINAL equation, work out the left side, and compare it to the right side. Two-step equations give twice as many chances to slip, so the check matters twice as much.` },
    { loId: 'm7math.two-step-equations', kind: 'definition', title: 'two-step equation', content: `an equation needing two inverse operations to isolate the variable, such as px + q = r.` },
    { loId: 'm7math.two-step-equations', kind: 'definition', title: 'constant term', content: `the plain number added to or subtracted from the variable term, such as the +2 in 3p + 2.` },
  ],
  methods: [
    {
      title: 'Worked standard two step',
      steps: [
        `Name the two operations wrapped around x: it is multiplied by 4, and then 7 is added. Undo them backwards, so the +7 goes first.`,
        'Subtract 7 from BOTH sides: 4x + 7 − 7 = 31 − 7, which leaves 4x = 24.',
        'Now the 4 is reachable. Divide BOTH sides by 4: 4x ÷ 4 = 24 ÷ 4, so x = 6.',
        `Check in the original: 4(6) + 7 = 24 + 7 = 31. The right side is 31, so the two sides match.`,
        `Notice the order in the check: multiply first, add second. The solve ran that in reverse, which is exactly the point.`,
      ],
      example: { problem: 'Solve: 4x + 7 = 31', solution: 'x = 6' },
      relatedLoIds: ['m7math.two-step-equations'],
    },
    {
      title: 'Worked negative coefficient',
      steps: [
        'The variable term is −2x, with the minus sign included. The constant is +9.',
        `Undo the +9 first. Subtract 9 from both sides: −2x + 9 − 9 = 23 − 9, which leaves −2x = 14.`,
        `Now divide both sides by −2, not by 2. A positive divided by a negative is negative, so x = −7.`,
        `WRONG answer to avoid: x = 7, which comes from dividing by 2 and leaving the minus sign behind. RIGHT answer: x = −7.`,
        `Check in the original: −2(−7) + 9 = 14 + 9 = 23. Both sides are 23, so the answer holds. Testing the wrong one shows why it fails: −2(7) + 9 = −14 + 9 = −5, which is not 23.`,
      ],
      example: { problem: 'Solve: −2x + 9 = 23', solution: 'x = −7' },
      relatedLoIds: ['m7math.two-step-equations'],
    },
  ],
  pointers: [
    { content: `Students often say "x = −11" — Undo the +20 FIRST: 5x = 25, then divide by 5 to get x = 5. Check: 5(5) + 20 = 25 + 20 = 45, so both sides match. Eli can catch himself the same way: 5(−11) + 20 = −55 + 20 = −35, which is nowhere near 45. Dividing first is only legal if EVERY term gets divided: (5x + 20) ÷ 5 = 45 ÷ 5 gives x + 4 = 9, which also leads to x = 5.`, kind: 'common-error' },
    { content: `Students often say "x = 25" — 5x = 25 says five copies of x make 25, not that x is 25. Divide both sides by 5 to finish: x = 5. Check: 5(25) + 20 = 145, not 45, so 25 fails the substitution test. The solve is not over until the variable stands completely alone.`, kind: 'common-error' },
    { content: `A two-step equation needs two inverse operations, done in reverse order of operations.`, kind: 'tip' },
    { content: 'Undo addition and subtraction FIRST, then undo multiplication and division.', kind: 'tip' },
    { content: `Dividing by the coefficient too early only works if every term on that side is divided too.`, kind: 'tip' },
    { content: `The minus sign belongs to the variable term: 9 − 2x = 23 leads to −2x = 14 and x = −7.`, kind: 'tip' },
    { content: `Substitute your answer into the original equation and make both sides match before you call it done.`, kind: 'tip' },
    { content: `In \`9 − 2x = 23\` the variable term is **−2x**, not 2x. After clearing the 9 you get −2x = 14, so the last step divides by **−2** and x = −7. Circle the minus sign before you divide.`, kind: 'common-error' },
    { content: `Don't stop at \`5x = 25\`. That says five copies of x make 25 — it is NOT the answer. Keep going until the variable stands totally alone: x = 5.`, kind: 'common-error' },
    { content: `If you divide first, you must divide **every** term on that side. \`5x + 20 = 45\` becomes x + 4 = 9, not x + 20 = 9. Easier fix: subtract the constant first.`, kind: 'gotcha' },
    { content: `Always substitute back into the **original** equation, not into a line you wrote partway through. If your line had a mistake, checking against it will hide the error.`, kind: 'tip' },
    { content: `Two-step equations run order of operations **backwards**: undo + and − first, undo × and ÷ last. Shoes off before socks. Building the value goes the other way — that's why the check multiplies first.`, kind: 'tip' },
    { content: `"Constant term" = the plain number added on (the +7 in 4x + 7). "Coefficient" = the number multiplying the variable (the 4). Mixing up these words makes you undo the wrong one first.`, kind: 'vocab-note' },
    { content: `Division form counts too: in \`x/4 + 3 = 7\`, x is divided by 4. Subtract 3 first to get x/4 = 4, then **multiply** both sides by 4 → x = 16. Don't divide again.`, kind: 'edge-case' },
    { content: `Every move happens on **both** sides. Write the operation under each side (−7 and −7) instead of doing it in your head on one side only.`, kind: 'tip' },
  ],
};
