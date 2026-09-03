/**
 * Grade 6 Math — Unit 5 CED 5.1: Negative Numbers in Context.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6math.negative-numbers-in-context.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6MATH_U5_NEGATIVE_NUMBERS_IN_CONTEXT: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6math.negative-numbers-in-context.v1',
  course: 'Grade 6 Math',
  cedUnit: 5,
  cedTopic: '5.1',
  cedTitle: 'Negative Numbers in Context',
  planId: 'evelyn.ms.m6math.negative-numbers-in-context.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6math.negative-numbers-in-context.v1' }],
  theory: [
    { loId: 'm6math.negative-numbers-in-context', kind: 'framework', title: 'Two directions from one starting line', content: `TWO DIRECTIONS FROM ONE STARTING LINE — every situation that needs negative numbers has a starting line and two opposite ways to go from it: above the water or below it, warmer than zero degrees or colder, money added to an account or money taken out. Positive numbers name one direction. Negative numbers name the other.` },
    { loId: 'm6math.negative-numbers-in-context', kind: 'framework', title: 'The minus sign is a label, not a subtraction', content: `THE MINUS SIGN IS A LABEL, NOT A SUBTRACTION — in -12 feet, the minus sign does not mean take away 12. It means the position sits 12 units on the negative side of the starting line. The digits tell you how far. The sign tells you which side.` },
    { loId: 'm6math.negative-numbers-in-context', kind: 'framework', title: 'Zero means something different every time', content: `ZERO MEANS SOMETHING DIFFERENT EVERY TIME — on a Celsius thermometer, zero is the temperature at which water freezes, so a negative reading means colder than freezing. For a bank account, zero is an empty account. For the pool, zero is the surface of the water. For elevation on a map, zero is usually sea level, though a cave map may set zero at the entrance instead. Zero is not nothing; it is the agreed line that both directions are measured from, and whoever writes the numbers chooses it. Name what zero means before you write a single sign.` },
    { loId: 'm6math.negative-numbers-in-context', kind: 'framework', title: 'Opposites sit the same distance on opposite sides', content: `OPPOSITES SIT THE SAME DISTANCE ON OPPOSITE SIDES — +3 and -3 are opposites. Both are 3 units from zero, and they sit on opposite sides of it. Three feet above the water and three feet below it are a matched pair, and that pairing is exactly what the two signs record.` },
    { loId: 'm6math.negative-numbers-in-context', kind: 'framework', title: 'The number line turns the two directions into left and right', content: `THE NUMBER LINE TURNS THE TWO DIRECTIONS INTO LEFT AND RIGHT — draw a line, mark zero in the middle, put positive numbers to the right and negative numbers to the left. So -12 sits twelve units left of zero and +10 sits ten units right of it. When the story is about up and down, like elevation or temperature, draw the line standing up instead, with the positives on top.` },
    { loId: 'm6math.negative-numbers-in-context', kind: 'framework', title: 'The sign already says the direction word', content: `THE SIGN ALREADY SAYS THE DIRECTION WORD — "12 feet below the surface" and "-12 feet" carry the same information. Writing -12 feet below the surface says below twice, which is not what you mean. Use the sign or use the word, never both at once.` },
    { loId: 'm6math.negative-numbers-in-context', kind: 'definition', title: 'positive number', content: 'a number greater than zero, on the side of the starting line that counts up.' },
    { loId: 'm6math.negative-numbers-in-context', kind: 'definition', title: 'negative number', content: `a number less than zero, written with a minus sign in front, on the opposite side of the starting line.` },
    { loId: 'm6math.negative-numbers-in-context', kind: 'definition', title: 'opposites', content: `two numbers the same distance from zero but on opposite sides of it, such as +3 and -3.` },
    { loId: 'm6math.negative-numbers-in-context', kind: 'definition', title: 'sea level', content: `the surface of the ocean, used as the zero line that elevations above and below it are measured from.` },
  ],
  methods: [
    {
      title: 'Worked translate contexts',
      steps: [
        `Start every one of these by naming zero. On a Celsius thermometer, zero is the temperature at which water freezes. For the submarine, zero is sea level, the surface of the ocean. For the savings account, zero is an empty account with no money in it.`,
        `(a) The words say below zero, which is the colder direction, so the sign is negative. Eight degrees below zero is -8 degrees Celsius.`,
        `(b) The words say below sea level, which is the downward direction, so the sign is negative again. 240 feet below sea level is -240 feet.`,
        `(c) Putting money in builds the balance up, which is the opposite of taking money out, so a deposit is positive. Putting in $15 is +15 dollars. Taking $15 out instead would be the opposite direction, which is -15 dollars.`,
        `Read each answer back in words as a check. -8 degrees Celsius means eight degrees colder than freezing. -240 feet means 240 feet under the surface of the ocean. +15 dollars means fifteen dollars added to an account that started empty. All three match their stories.`,
      ],
      example: { problem: `Write each of these as a signed number, and say what zero means in that situation. (a) The temperature on a Celsius thermometer is 8 degrees below zero. (b) A submarine sits 240 feet below sea level. (c) Nina puts $15 into a savings account that was empty.`, solution: '(a) -8 degrees Celsius, (b) -240 feet, (c) +15 dollars' },
      relatedLoIds: ['m6math.negative-numbers-in-context'],
    },
    {
      title: 'Worked pool positions',
      steps: [
        `Zero is already chosen for you here: the surface of the water. Above the surface is the positive direction, and below it is the negative direction.`,
        'Ana is above the surface, so her position is positive: +10 feet.',
        'Ben is below the surface, so his position is negative: -12 feet.',
        `On a number line drawn standing up, with the surface at zero, the point for Ana sits ten units above the zero mark and the point for Ben sits twelve units below it.`,
        `WRONG: writing the position of Ben as -12 feet below the surface. The minus sign already means below, so that phrase says below twice. CORRECT: write -12 feet, or write 12 feet below the surface, but never the two together.`,
        `WRONG: saying Ben is higher than Ana because 12 is bigger than 10. CORRECT: 12 is the bigger distance from the surface, but Ben is lower, because -12 is on the below side of zero while +10 is on the above side. The digits tell you how far from zero; the sign tells you which side.`,
        `Check by saying both answers back as sentences: +10 feet means ten feet up in the air, and -12 feet means twelve feet under the water. Both match the story.`,
      ],
      example: { problem: `Ana and Ben are at the town pool. Ana is standing on the diving board, 10 feet above the water. Ben has swum down to the drain, 12 feet below the water. The surface of the water is 0 feet. Write both positions as signed numbers.`, solution: 'Ana: +10 feet, Ben: -12 feet' },
      relatedLoIds: ['m6math.negative-numbers-in-context'],
    },
  ],
  pointers: [
    { content: `Students often say "-9 degrees below zero" — The minus sign IS the word below. Writing both says the direction twice, which would mean nine degrees below the below-zero mark. Record it as -9 degrees, or say it in words as 9 degrees below zero, and pick only one of the two.`, kind: 'common-error' },
    { content: `Students often say "A balance of -20 dollars means the account holds 20 dollars." — Zero means an empty account. A balance of +20 dollars means twenty dollars saved. A balance of -20 dollars means the account is twenty dollars in the hole, which is money owed. Those are opposite situations, and the sign is the only thing telling them apart: same digits, opposite meaning.`, kind: 'common-error' },
    { content: `Positive and negative numbers record two opposite directions from one starting line.`, kind: 'tip' },
    { content: `The minus sign is a direction label, not a subtraction: in -12 feet, the 12 says how far and the minus says which side.`, kind: 'tip' },
    { content: `Zero means something different in every situation — the freezing point on a Celsius thermometer, sea level on a map, an empty account — so name it first.`, kind: 'tip' },
    { content: 'Opposites such as +3 and -3 sit the same distance from zero on opposite sides.', kind: 'tip' },
    { content: `On a number line, negatives go left of zero and positives go right; draw the line standing up when the story is about up and down.`, kind: 'tip' },
    { content: `Use the sign or use the direction word, never both: -12 feet, or 12 feet below, but not -12 feet below.`, kind: 'tip' },
    { content: `The minus sign IS the direction word. Writing "-12 feet below" says below twice. Pick one: write -12 feet, or write 12 feet below, never both together.`, kind: 'common-error' },
    { content: `Before you write any signed number, name what zero means in that situation. On a thermometer, zero is freezing. At sea level, zero is the ocean surface. In a bank account, zero is empty. The story tells you; don't skip it.`, kind: 'tip' },
    { content: `The digits tell you the distance from zero. The sign tells you the direction. -12 and 12 are the same distance away; the minus just flips which side you're on.`, kind: 'vocab-note' },
    { content: `Don't ignore the minus sign and keep only the number. -20 dollars and 20 dollars are opposites: one means owed, the other means saved. The sign changes everything.`, kind: 'common-error' },
    { content: `Opposites are the same distance from zero but on opposite sides. +3 and -3 both sit 3 units away; they're a matched pair. If +3 is above, -3 is below by the same amount.`, kind: 'vocab-note' },
    { content: `When the story is about up and down—elevation, depth, temperature—draw your number line standing up, not sideways. Positives go up, negatives go down.`, kind: 'tip' },
    { content: `Zero is not nothing—it's the agreed starting line that both directions are measured from. A cave map can put zero at the entrance instead of sea level. Whoever writes the numbers picks where zero sits.`, kind: 'edge-case' },
  ],
};
