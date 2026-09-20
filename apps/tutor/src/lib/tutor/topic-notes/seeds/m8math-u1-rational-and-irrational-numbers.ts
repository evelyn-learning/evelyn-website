/**
 * Grade 8 Math — Unit 1 CED 1.2: Rational & Irrational Numbers.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m8math.rational-and-irrational-numbers.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M8MATH_U1_RATIONAL_AND_IRRATIONAL_NUMBERS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m8math.rational-and-irrational-numbers.v1',
  course: 'Grade 8 Math',
  cedUnit: 1,
  cedTopic: '1.2',
  cedTitle: 'Rational & Irrational Numbers',
  planId: 'evelyn.ms.m8math.rational-and-irrational-numbers.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m8math.rational-and-irrational-numbers.v1' }],
  theory: [
    { loId: 'm8math.rational-and-irrational-numbers', kind: 'framework', title: 'The two kinds of decimal you already own', content: `THE TWO KINDS OF DECIMAL YOU ALREADY OWN — a rational number is any number that can be written as a fraction of two integers, and last lesson you saw what its decimal must do: it either stops, like 3/8 = 0.375, or it repeats a block forever, like 1/3 = 0.333... and 5/11 = 0.454545... That is the whole rational family, and every fraction you have ever written belongs to it.` },
    { loId: 'm8math.rational-and-irrational-numbers', kind: 'framework', title: 'Irrational means neither', content: `IRRATIONAL MEANS NEITHER — an irrational number has a decimal that never stops AND never settles into a repeating block, so it cannot be written as a fraction of two integers. π = 3.14159265... and √2 = 1.41421356... are the two you will meet most often. Every number on the number line is one or the other: rational or irrational, with no third option.` },
    { loId: 'm8math.rational-and-irrational-numbers', kind: 'framework', title: 'A root sign does not make a number irrational', content: `A ROOT SIGN DOES NOT MAKE A NUMBER IRRATIONAL — the perfect squares are 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, and so on, each one a whole number times itself. For a whole number n, √n is rational exactly when n is a perfect square, because then the root is a whole number: √49 = 7. When n is NOT a perfect square, √n is irrational: √2, √3, √5, √10, √50. Most whole numbers are not perfect squares, so most square roots do not come out clean.` },
    { loId: 'm8math.rational-and-irrational-numbers', kind: 'framework', title: 'A pattern is not a repeat', content: `A PATTERN IS NOT A REPEAT — 0.101001000100001... follows a clear rule, one more zero every time, but repeating means the SAME block coming back unchanged forever, and here the block keeps growing. No block ever repeats, so this number is irrational. Having a pattern and repeating are different things.` },
    { loId: 'm8math.rational-and-irrational-numbers', kind: 'framework', title: 'A fraction is rational no matter what it is close to', content: `A FRACTION IS RATIONAL NO MATTER WHAT IT IS CLOSE TO — 22/7 is a fraction of two integers, so it is rational, and its decimal is 3.142857142857..., repeating the block 142857. People use it as a stand-in for π because it is close, but π = 3.141592..., and the two part ways at the third decimal place. The same goes for 3.14: it stops, so it is rational, and it is not π either.` },
    { loId: 'm8math.rational-and-irrational-numbers', kind: 'framework', title: 'The calculator cannot decide for you', content: `THE CALCULATOR CANNOT DECIDE FOR YOU — a screen shows about ten digits and then stops, for every number, so 0.3333333333 and 1.414213562 look like the same kind of thing. Neither is "long" or "short" in reality; one repeats forever and one never does. What sorts a number is whether it is a fraction of integers, or a root of a perfect square, not how many digits you happen to see.` },
    { loId: 'm8math.rational-and-irrational-numbers', kind: 'definition', title: 'rational number', content: `a number that can be written as a fraction of two integers; its decimal terminates or repeats.` },
    { loId: 'm8math.rational-and-irrational-numbers', kind: 'definition', title: 'irrational number', content: `a number that cannot be written as a fraction of two integers; its decimal never terminates and never repeats.` },
    { loId: 'm8math.rational-and-irrational-numbers', kind: 'definition', title: 'terminating decimal', content: 'a decimal that stops after a certain number of digits, such as 0.375.' },
    { loId: 'm8math.rational-and-irrational-numbers', kind: 'definition', title: 'repeating decimal', content: `a decimal in which one block of digits comes back unchanged forever, such as 0.454545...` },
    { loId: 'm8math.rational-and-irrational-numbers', kind: 'definition', title: 'perfect square', content: 'a whole number that is some whole number times itself, such as 49 = 7 × 7.' },
  ],
  methods: [
    {
      title: 'Worked classify five numbers',
      steps: [
        `Run the same question on all five: can this number be written as a fraction of two integers? If it can, its decimal stops or repeats and it is rational. If its decimal never stops and never repeats, it is irrational.`,
        `22/7 is already a fraction of two integers, so it is rational before you do anything. To see its decimal, divide: 22 ÷ 7 = 3.142857142857..., and the block 142857 comes back unchanged forever. A repeating decimal is exactly what a fraction produces.`,
        `√9 asks for the number that times itself gives 9, and 3 × 3 = 9, so √9 = 3. The number 3 is the fraction 3/1, so √9 is rational. The root sign was hiding a plain whole number, because 9 is a perfect square.`,
        `π = 3.14159265358979... The digits never stop and never settle into a repeating block, so π is irrational. It is not 22/7: line them up, 3.1415... against 3.1428..., and they split at the third decimal place. It is not 3.14 either, since 3.14 stops.`,
        `√2 = 1.41421356... The number 2 is not on the perfect-square list, so no whole number times itself gives 2, and the decimal never stops and never repeats. √2 is irrational.`,
        `0.101001000100001... has a rule, one more zero each time, so it is tempting to call it repeating. Repeating means one block comes back the same forever, and here every block is longer than the last, so nothing ever repeats. The decimal also never stops. It is irrational.`,
        `Check the sort by counting the fraction side: 22/7 and √9 = 3 = 3/1 can both be written as fractions of integers, so those two are rational. The other three cannot, so π, √2 and 0.101001000... are irrational.`,
      ],
      example: { problem: `Classify each number as rational or irrational, and say why: 22/7, √9, π, √2, and 0.101001000100001... (the number of zeros between the 1s keeps growing by one).`, solution: `Rational: 22/7 and √9 (which equals 3). Irrational: π, √2 and 0.101001000100001...` },
      relatedLoIds: ['m8math.rational-and-irrational-numbers'],
    },
    {
      title: 'Worked sort square roots',
      steps: [
        `For a square root of a whole number, the only question is whether the number under the root sign is a perfect square. Write the list you need: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144.`,
        `25, 36 and 49 are on the list: 5 × 5 = 25, 6 × 6 = 36, 7 × 7 = 49. So √25 = 5, √36 = 6 and √49 = 7, all whole numbers, all rational.`,
        `26, 40 and 50 are not on the list. No whole number times itself gives 26, 40 or 50, so √26, √40 and √50 all have decimals that never stop and never repeat. All three are irrational.`,
        `WRONG: saying √50 is rational because 50 is so close to 49, or because 50 is an even number that "divides nicely". CORRECT: close does not count and even does not count. 50 is not a perfect square, full stop, so √50 is irrational. Being one away from a perfect square changes nothing about whether a decimal repeats.`,
        `WRONG: saying √36 is irrational because it has a root sign, and root signs mean irrational. CORRECT: 6 × 6 = 36, so √36 is just the whole number 6 wearing a root sign. The sign never decides the answer; the number under it does.`,
        `Check by squaring the rational ones back: 5 × 5 = 25, 6 × 6 = 36, 7 × 7 = 49, each landing exactly on the number under its root sign. Try the same with the irrational ones and there is nothing to square, because no whole number lands on 26, 40 or 50.`,
      ],
      example: { problem: `Sort these six square roots into rational and irrational: √25, √26, √36, √40, √49, √50.`, solution: 'Rational: √25 = 5, √36 = 6, √49 = 7. Irrational: √26, √40, √50' },
      relatedLoIds: ['m8math.rational-and-irrational-numbers'],
    },
  ],
  pointers: [
    { content: `Students often say "22/7 is irrational, because it is π." — 22/7 is a fraction of two integers, so it is rational, and nothing can change that. Its decimal is 3.142857142857..., a repeating block, which is exactly what fractions produce. π is 3.141592..., and the two split at the third decimal place: 3.1415... against 3.1428... 22/7 is a convenient neighbor of π, not π itself, and π is the one that is irrational.`, kind: 'common-error' },
    { content: `Students often say "0.142857142857... is irrational, because it has too many different digits to be a fraction." — Look past the length and watch for the block: 142857, then 142857 again, then 142857 again, unchanged forever. A repeating decimal is always rational, no matter how long its block is. The method from last lesson turns it into 142857/999999, which reduces to 1/7, since 142857 × 7 = 999999. Many different digits inside the block is fine; what would make it irrational is a decimal that never settles into any block at all.`, kind: 'common-error' },
    { content: `A rational number can be written as a fraction of two integers, and its decimal either terminates or repeats a block forever.`, kind: 'tip' },
    { content: `An irrational number has a decimal that never terminates and never repeats, so it cannot be written as a fraction of two integers. π and √2 are irrational.`, kind: 'tip' },
    { content: `For a whole number n, √n is rational exactly when n is a perfect square (1, 4, 9, 16, 25, 36, 49, ...), because then the root is a whole number. Otherwise √n is irrational.`, kind: 'tip' },
    { content: `A pattern is not a repeat: 0.101001000... has a rule but no repeating block, so it is irrational.`, kind: 'tip' },
    { content: `A fraction is rational no matter what it is close to: 22/7 and 3.14 are rational, and neither one is π.`, kind: 'tip' },
    { content: `Never ending is not the test, and a calculator screen cannot decide for you. Ask whether it is a fraction of integers or a root of a perfect square.`, kind: 'tip' },
    { content: `Don't confuse "has a pattern" with "repeats." A pattern means there's a rule you can see; repeating means the exact same block comes back unchanged forever. 0.101001000... has a pattern but the block keeps growing, so it never repeats—it's irrational.`, kind: 'common-error' },
    { content: `A root sign does NOT tell you if a number is irrational. Check what's under it: if it's a perfect square (like 9, 25, 49), the root is rational. If it's not a perfect square (like 2, 10, 50), the root is irrational. The sign is just notation.`, kind: 'gotcha' },
    { content: `Being close to a famous irrational number (like π) doesn't make a number irrational. 22/7 and 3.14 are both fractions or terminating decimals—both rational—even though they're neighbors of π. The number that is π is the irrational one.`, kind: 'common-error' },
    { content: `A calculator showing 10 digits doesn't mean the decimal is rational or that it's "done." Both 1/3 = 0.333... and √2 = 1.414213562... look finished on a screen. The test is whether it's a fraction of integers or a root of a perfect square, not what the screen shows.`, kind: 'tip' },
    { content: `Memorize the perfect squares up to at least 144 (1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144). Without this list, you can't quickly tell if √n is rational or irrational. It's your tool for this whole topic.`, kind: 'tip' },
    { content: `Don't say a repeating decimal is "irrational because the block is long" or "has too many different digits." A long repeating block is still rational—it's just a fraction in disguise. Only "never repeats" signals irrational.`, kind: 'common-error' },
    { content: `Every number on the number line is either rational or irrational—there is no third kind. If a decimal terminates or repeats, it's rational. If it neither terminates nor repeats, it's irrational. Those two categories cover everything.`, kind: 'vocab-note' },
    { content: `When you see √n, first check: is n a perfect square? If yes, √n is rational and you can simplify it (√9 = 3). If no, √n is irrational and you leave the root sign there. That's the only decision tree you need.`, kind: 'tip' },
  ],
};
