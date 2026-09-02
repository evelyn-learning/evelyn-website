/**
 * Grade 6 Math — Negative Numbers & Absolute Value: Negative Numbers in
 * Context.
 *
 * CONCEPT-LED exemplar for the m6math fan-out. The student arrives with no
 * procedure to lean on, so the whole lesson builds one mental model: a sign
 * records WHICH DIRECTION a quantity sits from a chosen zero, and the digits
 * record HOW FAR (CCSS 6.NS.C.5). The standard's second half — explaining what
 * zero means in each situation — is treated as the load-bearing idea, not a
 * footnote, because a student who cannot name the zero line cannot choose a
 * sign. Two traps this plan is built to kill: writing the direction twice
 * ("-12 feet below the surface"), and reading a minus sign as decoration so
 * only the digits survive.
 *
 * SCOPE GUARD: Grade 6 places and interprets signed numbers. It never computes
 * with them. Adding, subtracting, multiplying or dividing negative numbers is
 * Grade 7 (m7math U1-U2) and must not appear here.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 4.4 -> 5.1 -> 5.2,
 * but rows 4.4 and 5.2 are authored in the fan-out that follows this commit.
 * `lint-ms-plans` rejects a prerequisite/followUp that does not resolve to a
 * registered LO, so both arrays stay empty until the full 40-row batch lands
 * and the controller wires the chain.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6MATH_U5_NEGATIVE_NUMBERS_IN_CONTEXT: LessonPlan = {
  id: 'evelyn.ms.m6math.negative-numbers-in-context.v1',
  title: 'Negative Numbers in Context',
  curriculum: 'MS',
  grade: '6',
  subject: 'math',
  topic: 'grade-6-math',
  locale: 'en',
  los: [
    {
      id: 'm6math.negative-numbers-in-context',
      standard: 'M6MATH-5.1',
      description:
        'Understand that positive and negative numbers describe quantities with opposite directions or values, such as elevation, temperature, and credit/debit, and explain what zero means in each situation (CCSS 6.NS.C.5).',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student see one starting line with two opposite directions before any sign is written.',
      script:
        'Picture the town pool on the first hot day of summer. The surface of the water is the line everything gets measured from, so call it zero. The high diving board sticks up 10 feet above that line. The drain at the bottom of the deep end sits 12 feet below it. Both numbers are distances from the same line, but they point in opposite directions. That is the whole reason negative numbers exist. Today we learn how to write those two directions down, and how to say what zero means in any situation you meet.',
      suggestedTools: ['show_number_line'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-signs-and-zero',
      kind: 'concept',
      goal: 'Build the sign as a direction label from a chosen zero, and make naming zero the first move in every problem.',
      keyIdeas: [
        'TWO DIRECTIONS FROM ONE STARTING LINE — every situation that needs negative numbers has a starting line and two opposite ways to go from it: above the water or below it, warmer than the zero mark or colder, money added to an account or money taken out. Positive numbers name one direction. Negative numbers name the other.',
        'THE MINUS SIGN IS A LABEL, NOT A SUBTRACTION — in -12 feet, the minus sign does not mean take away 12. It means the position sits 12 units on the negative side of the starting line. The digits tell you how far. The sign tells you which side.',
        'ZERO MEANS SOMETHING DIFFERENT EVERY TIME — for elevation, zero is sea level. For a thermometer, zero is the zero-degree mark. For a bank account, zero is an empty account. For the pool, zero is the surface of the water. Zero is not nothing; it is the agreed line that both directions are measured from. Name what zero means before you write a single sign.',
        'OPPOSITES SIT THE SAME DISTANCE ON OPPOSITE SIDES — +3 and -3 are opposites. Both are 3 units from zero, and they sit on opposite sides of it. Three feet above the water and three feet below it are a matched pair, and that pairing is exactly what the two signs record.',
        'THE NUMBER LINE TURNS THE TWO DIRECTIONS INTO LEFT AND RIGHT — draw a line, mark zero in the middle, put positive numbers to the right and negative numbers to the left. So -12 sits twelve units left of zero and +10 sits ten units right of it. When the story is about up and down, like elevation or temperature, draw the line standing up instead, with the positives on top.',
        'THE SIGN ALREADY SAYS THE DIRECTION WORD — "12 feet below the surface" and "-12 feet" carry the same information. Writing -12 feet below the surface says below twice, which is not what you mean. Use the sign or use the word, never both at once.',
      ],
      vocabulary: [
        { term: 'positive number', definition: 'a number greater than zero, on the side of the starting line that counts up.' },
        { term: 'negative number', definition: 'a number less than zero, written with a minus sign in front, on the opposite side of the starting line.' },
        { term: 'opposites', definition: 'two numbers the same distance from zero but on opposite sides of it, such as +3 and -3.' },
        { term: 'sea level', definition: 'the surface of the ocean, used as the zero line that elevations above and below it are measured from.' },
      ],
      suggestedTools: ['show_number_line'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-translate-contexts',
      kind: 'worked_example',
      problem:
        'Write each of these as a signed number, and say what zero means in that situation. (a) The temperature is 8 degrees below zero. (b) A submarine sits 240 feet below sea level. (c) Nina puts $15 into a savings account that was empty.',
      steps: [
        'Start every one of these by naming zero. On a thermometer, zero is the zero-degree mark. For the submarine, zero is sea level, the surface of the ocean. For the savings account, zero is an empty account with no money in it.',
        '(a) The words say below zero, which is the colder direction, so the sign is negative. Eight degrees below zero is -8 degrees.',
        '(b) The words say below sea level, which is the downward direction, so the sign is negative again. 240 feet below sea level is -240 feet.',
        '(c) Putting money in builds the balance up, which is the opposite of taking money out, so a deposit is positive. Putting in $15 is +15 dollars. Taking $15 out instead would be the opposite direction, which is -15 dollars.',
        'Read each answer back in words as a check. -8 degrees means eight degrees colder than the zero mark. -240 feet means 240 feet under the surface of the ocean. +15 dollars means fifteen dollars added to an account that started empty. All three match their stories.',
      ],
      answer: '(a) -8 degrees, (b) -240 feet, (c) +15 dollars',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-pool-positions',
      kind: 'worked_example',
      problem:
        'Ana and Ben are at the town pool. Ana is standing on the diving board, 10 feet above the water. Ben has swum down to the drain, 12 feet below the water. The surface of the water is 0 feet. Write both positions as signed numbers.',
      steps: [
        'Zero is already chosen for you here: the surface of the water. Above the surface is the positive direction, and below it is the negative direction.',
        'Ana is above the surface, so her position is positive: +10 feet.',
        'Ben is below the surface, so his position is negative: -12 feet.',
        'On a number line drawn standing up, with the surface at zero, the point for Ana sits ten units above the zero mark and the point for Ben sits twelve units below it.',
        'WRONG: writing the position of Ben as -12 feet below the surface. The minus sign already means below, so that phrase says below twice. CORRECT: write -12 feet, or write 12 feet below the surface, but never the two together.',
        'WRONG: saying Ben is higher than Ana because 12 is bigger than 10. CORRECT: 12 is the bigger distance from the surface, but Ben is lower, because -12 is on the below side of zero while +10 is on the above side. The digits tell you how far from zero; the sign tells you which side.',
        'Check by saying both answers back as sentences: +10 feet means ten feet up in the air, and -12 feet means twelve feet under the water. Both match the story.',
      ],
      answer: 'Ana: +10 feet, Ben: -12 feet',
      estimatedMinutes: 3,
    },
    {
      id: 'try-meaning-of-zero',
      kind: 'try_yourself',
      problem: 'A hiking app shows the elevation of a trail as -30 feet. What does the number 0 stand for in this situation?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The lowest point on the whole trail' },
        { id: 'b', text: 'Sea level, the surface of the ocean', correct: true },
        { id: 'c', text: 'The app has not found an elevation yet' },
        { id: 'd', text: 'The top of the nearest hill' },
      ],
      expectedAnswer: 'Sea level, the surface of the ocean',
      hints: [
        'Zero is the starting line that both directions are measured from. Ask what line an elevation is always measured from.',
        'A trail can go below zero, so zero cannot be the lowest point. For elevation, everybody agrees on the same starting line: the surface of the ocean.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-opposite-elevation',
      kind: 'try_yourself',
      problem: 'A diver is at an elevation of -30 feet. A drone hovers at the opposite elevation. What is the elevation of the drone?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '-30 feet' },
        { id: 'b', text: '0 feet' },
        { id: 'c', text: '+30 feet', correct: true },
        { id: 'd', text: '+60 feet' },
      ],
      expectedAnswer: '+30 feet',
      hints: [
        'Opposites are the same distance from zero, but on opposite sides of it.',
        'The diver is 30 units below zero, so the opposite position is 30 units above zero. Measure from zero, not from the diver.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-cave-elevation',
      kind: 'try_yourself',
      problem:
        'Your class tours a cave. The map marks the entrance as 0 feet. The tour walks down to a chamber 45 feet below the entrance. Write the elevation of that chamber as a signed number. Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '-45',
      hints: [
        'The entrance is the zero line. Decide which direction the chamber sits from that line: up or down.',
        'Down from zero is the negative direction, so the number needs a minus sign in front of the 45.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-sign-said-twice-and-sign-ignored',
      kind: 'misconception_check',
      question:
        'A student is asked to record 9 degrees below zero and writes -9 degrees below zero. The same student then says that a bank balance of -20 dollars means the account holds 20 dollars. What went wrong in each case?',
      commonErrors: [
        {
          answer: '-9 degrees below zero',
          misconception: 'Treating the minus sign and the word below as two separate pieces of information, so both get written down.',
          correctsTo:
            'The minus sign IS the word below. Writing both says the direction twice, which would mean nine degrees below the below-zero mark. Record it as -9 degrees, or say it in words as 9 degrees below zero, and pick only one of the two.',
        },
        {
          answer: 'A balance of -20 dollars means the account holds 20 dollars.',
          misconception: 'Reading the minus sign as decoration and keeping only the digits, so the direction is thrown away.',
          correctsTo:
            'Zero means an empty account. A balance of +20 dollars means twenty dollars saved. A balance of -20 dollars means the account is twenty dollars in the hole, which is money owed. Those are opposite situations, and the sign is the only thing telling them apart: same digits, opposite meaning.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Positive and negative numbers record two opposite directions from one starting line.',
        'The minus sign is a direction label, not a subtraction: in -12 feet, the 12 says how far and the minus says which side.',
        'Zero means something different in every situation — sea level, the zero-degree mark, an empty account — so name it first.',
        'Opposites such as +3 and -3 sit the same distance from zero on opposite sides.',
        'On a number line, negatives go left of zero and positives go right; draw the line standing up when the story is about up and down.',
        'Use the sign or use the direction word, never both: -12 feet, or 12 feet below, but not -12 feet below.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.1', cedTitle: 'Negative Numbers in Context' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
