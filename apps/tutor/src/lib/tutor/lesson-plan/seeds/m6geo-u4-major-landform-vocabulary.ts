/**
 * Grade 6 World Geography — Landforms & Water on Earth: Major Landform
 * Vocabulary.
 *
 * PROCEDURE-LED fan-out row (National Geography Standard 7). The skill is a
 * two-question classification routine -- how does this ground compare in
 * height with the land right around it, and is its top flat or does it rise
 * to a point -- run against five terms: mountain, plain, plateau, hill,
 * valley. Every item hands the student a landform described by its
 * properties and asks which of the five terms it names, never a picture and
 * never a famous place to recognize.
 *
 * SCOPE GUARD: this row DEFINES and CLASSIFIES mountain, plain, plateau,
 * hill and valley by the properties that make each one what it is. It names
 * NO real place anywhere in the file -- not even the handful of physical,
 * long-settled anchors (Greenwich, Africa, Antarctica) the wider contract
 * treats as an acceptable default elsewhere in this course. This row's own
 * scope line overrides that default: "using invented examples only -- no
 * real-place anchoring", written into the signed curriculum because an
 * earlier geography file in this course's history placed a real feature in
 * the wrong location. Every example, worked example and item below is an
 * invented country, island or region. This row also names NO settlement
 * payoff -- it never says landforms explain where people build farms, towns
 * or roads -- and NO building mechanism -- it never says erosion or
 * deposition creates or wears down a landform. Both the real-place anchors,
 * the settlement payoff and the erosion/deposition mechanism belong to Grade
 * 7's `m7geo-u2-landforms-and-water-features.ts`, which teaches this same
 * five-term vocabulary again alongside water features, erosion/deposition as
 * a builder, and the settlement payoff. What IS deliberately allowed, and is
 * in fact the whole assignment: enumerating mountain, plain, plateau, hill
 * and valley by name. The fan-out contract's own closed-typology test names
 * exactly this list as its carve-out -- a plain vocabulary set is not a
 * mechanism's closed typology, so naming all five is fine here in a way that
 * naming, say, the three plate-boundary types would not be.
 *
 * DEPTH CEILING NOTE FOR THE FAN-OUT: every keyIdea, step and item stem below
 * is answered by DEFINE, IDENTIFY or CLASSIFY. The two-question routine
 * itself (height compared with surroundings; flat top or not) is a
 * classification tool for telling five vocabulary words apart, not a
 * mechanism with a closed set of named outcomes, and nothing here explains
 * WHY a landform has the shape it has (that would need erosion/deposition,
 * which is the boundary this row stops short of). Test 5 (the Grade 7 file
 * test) is the one that comes closest to biting on this row, precisely
 * because Grade 6 is deliberately teaching the same five terms the Grade 7
 * file also defines -- see the SCOPE GUARD above for exactly what was left
 * out to keep this row underneath it: no real place, no settlement claim, no
 * erosion/deposition claim.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped
 * Grade 7 Geography bank the keyed answer was the strictly longest choice 67
 * percent of the time, rising to 94 percent at difficulty 4; chance with four
 * choices is 25 percent). Every choice here is a full sentence naming a term
 * AND a reason, so a distractor is a full wrong reason rather than a bare
 * label. Measured, not tuned to zero: choice lengths in characters are
 * try-plateau-or-not a=84(key)/b=84/c=55/d=79 (key ties for longest, not
 * strictly longest); try-mountain-or-hill a=88/b=91/c=87(key)/d=82 (key is
 * NOT the longest -- b is, by 4 characters); try-valley-or-plain
 * a=73/b=60/c=69/d=75(key) (key is the strictly longest choice, by 2
 * characters over the next, which the contract's own rule treats as a tie
 * rather than a signal). So the key is the strictly longest choice in 1 of 3
 * items, by a 2-character margin. Zero is NOT the target; see the note in
 * `m6geo-u3-earths-moving-plates.ts`. The three keys sit at ids a, c and d --
 * the id set `(4 + 1) mod 4 = 1` requires, omitting b.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every item is solvable
 * from the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6GEO_U4_MAJOR_LANDFORM_VOCABULARY: LessonPlan = {
  id: 'evelyn.ms.m6geo.major-landform-vocabulary.v1',
  title: 'Major Landform Vocabulary',
  curriculum: 'MS',
  grade: '6',
  subject: 'social-studies',
  topic: 'grade-6-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm6geo.major-landform-vocabulary',
      standard: 'M6GEO-4.1',
      description:
        "Define and distinguish mountain, plain, plateau, hill, and valley by the properties that make each one what it is, using invented examples only -- no real-place anchoring or settlement-pattern reasoning, which is Grade 7's landforms-and-water-features lesson (National Geography Standard 7: the physical processes that shape the patterns of Earth's surface).",
    },
  ],
  prerequisites: ['m6geo.weathering-erosion-and-deposition'],
  followUps: ['m6geo.coastal-and-connecting-landforms'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make sorting land by its properties feel like a tool the student would want, before any term arrives.',
      script:
        'Imagine you are designing a brand new world for a video game, and you get to build the land yourself before any character ever walks on it. You drag your finger across the screen and pull up a jagged, pointy ridge in one corner. You flatten out a huge stretch on the other side until it barely rises or falls at all. You carve a low strip between two tall ridges so a road can wind through it later. None of this is a real place. It is yours, built piece by piece. But once you build it, you need words for each piece, because "the pointy part" and "the flat part" get confusing fast once your world has ten of each. Today you get five words that name almost any shape the ground can take, and a simple way to tell them apart just by looking at their properties. No famous mountain and no real river required.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-five-landforms-two-questions',
      kind: 'concept',
      goal: 'Install the two-question routine and the five landform definitions it sorts.',
      keyIdeas: [
        'A LANDFORM IS DEFINED BY ITS PROPERTIES, NEVER BY A FAMOUS PLACE. Two questions sort almost every landform in this lesson. First, compared with the land right around it, does this ground stand HIGH, or does it stay LOW and about the same as its surroundings? Second, is its surface FLAT across a wide stretch, or does it rise to a ridge or a point? A student who can answer those two questions can name a landform without ever having seen a picture of it.',
        'A MOUNTAIN STANDS HIGH AND STEEP, AND NARROWS TOWARD A PEAK. It rises far above the land around it, its sides climb steeply, and it comes to a point or a narrow ridge at the top rather than staying flat.',
        'A HILL ALSO RISES ABOVE ITS SURROUNDINGS, BUT LESS FAR AND MORE GENTLY. It stands higher than the land around it, the same as a mountain does, but not nearly as high, and its slopes are gentler and more rounded instead of steep.',
        'A PLATEAU IS HIGH LIKE A MOUNTAIN, BUT FLAT LIKE A PLAIN ON TOP. It stands well above the land around it, and its top stays flat across a wide area instead of narrowing to a point. Its edges often drop away steeply, which is the one place a plateau is not flat.',
        'A PLAIN DOES NOT STAND HIGH ABOVE ITS SURROUNDINGS AT ALL. It is a large stretch of land that is flat or gently rolling, with very little change in elevation across the whole area. Unlike a plateau, nothing about a plain rises above the country next to it.',
        'A VALLEY IS LOW GROUND SQUEEZED BETWEEN HIGHER LAND ON BOTH SIDES. It is the strip that runs between two ridges, two hills, or two mountains, and it is lower than the land bordering it on either side. A valley is defined by what sits next to it, not only by being flat.',
      ],
      vocabulary: [
        { term: 'mountain', definition: 'high, steep-sided land that narrows toward a peak or ridge and stands far above the land around it.' },
        { term: 'hill', definition: 'raised land with gentler, more rounded slopes that stands above its surroundings, but not as high as a mountain.' },
        { term: 'plateau', definition: 'high land with a mostly flat top, standing well above the land around it, often with steep edges.' },
        { term: 'plain', definition: 'a large stretch of flat or gently rolling land with very little change in elevation.' },
        { term: 'valley', definition: 'low ground running between higher land on both sides, such as two ridges or two mountains.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-name-three-regions',
      kind: 'worked_example',
      problem:
        'An invented island nation has three regions. In the north, the land climbs steeply to a narrow, rocky peak that towers over everything else on the island. In the middle, the land is flat and open for a long stretch, rising and falling only a little the whole way across. In the south, a strip of low ground runs between two long ridges of much higher land, one on each side. There is no map here -- work only from the words. Name the landform in each region.',
      steps: [
        'Take the regions one at a time and run the two questions from the concept: does it stand high or stay low compared with the land around it, and is its top flat or does it rise to a point?',
        'The north region climbs steeply to a narrow, rocky peak, towering over everything else on the island. That is HIGH and NOT FLAT -- it comes to a point. That combination is a MOUNTAIN.',
        'The middle region is flat and open for a long stretch, with only a little rise and fall the whole way across, and nothing says it stands above the land near it. That is LOW-AND-LEVEL rather than high. That combination is a PLAIN.',
        'The south region is a strip of low ground between two long ridges of much higher land. It is LOW, and just as important, it sits BETWEEN higher land on both sides. That combination is a VALLEY.',
        'Check the answer by rereading each region backward against its own landform. A mountain should be the highest and least flat of the three -- yes, it is described as towering and narrow. A plain should show almost no rise and fall -- yes. A valley should be low ground with higher land on each side, not just low ground on its own -- yes, two ridges are named.',
        'Now test a contrasting case so mountain and hill are not mixed up. Picture a fourth region where the land rises above its surroundings, but only a little, with slopes that curve gently rather than climbing steeply to a point. That would be a HILL, not a mountain -- it rises less far, and its shape is rounded instead of narrow and steep. Height and shape both have to match before something can be called a mountain.',
      ],
      answer:
        'North: a mountain, because it climbs steeply to a narrow peak far above the island. Middle: a plain, because it is flat and open with very little change in elevation. South: a valley, because it is low ground running between two ridges of higher land.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-two-corrections',
      kind: 'worked_example',
      problem:
        'A student writes: "Any land that stands high above the country around it is a mountain. And a valley is just low, flat land, so a valley and a plain are the same thing." Both sentences have something wrong with them. Correct each one.',
      steps: [
        "Take the first claim. WRONG: 'any land that stands high above the country around it is a mountain.' The mistake is checking only ONE property, height, and skipping the other one.",
        "Run both questions on land that stands high. If its top narrows to a peak or a ridge, height plus that shape makes it a MOUNTAIN. But if its top stays flat across a wide area instead, height plus a FLAT top makes it a PLATEAU, not a mountain. CORRECT: 'land that stands high is a mountain only if it also narrows toward a peak; land that stands high with a flat top is a plateau.'",
        "Take the second claim. WRONG: 'a valley is just low, flat land, so a valley and a plain are the same thing.' The mistake is checking only whether the land is low, and skipping what is next to it.",
        "A valley is defined by what borders it: low ground running between higher land on both sides, such as two ridges. A plain is a large stretch of land with very little change in elevation across it, and nothing says higher land has to sit right next to it on both sides. CORRECT: 'a valley is low ground squeezed between higher land on both sides; a plain is a wide, level stretch that is not defined by what borders it.'",
        'Notice the pattern behind both corrections. Every landform in this lesson needs BOTH of its properties checked, how it compares in height with the land around it, and the shape of its surface or what borders it, before it can be named.',
      ],
      answer:
        'First correction: land that stands high is a mountain only if it also narrows to a peak; the same height with a flat top is a plateau instead. Second correction: a valley is low ground between higher land on both sides, while a plain is a wide, level stretch not defined by what sits next to it, so a valley and a plain are not the same thing.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-plateau-or-not',
      kind: 'try_yourself',
      problem:
        'A wide area of land stands much higher than the country around it. Its top stays flat across the whole area, and its edges drop away steeply. Which landform matches this description?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A plateau, because it stands high above the surrounding land and its top stays flat.', correct: true },
        { id: 'b', text: 'A mountain, because it stands high above the surrounding land and narrows to a peak.' },
        { id: 'c', text: 'A plain, because its top stays flat across a wide area.' },
        { id: 'd', text: 'A hill, because it stands above the land around it with gentle, rounded slopes.' },
      ],
      expectedAnswer: 'A plateau, because it stands high above the surrounding land and its top stays flat.',
      hints: [
        'Two properties are given: how high the land stands, and the shape of its top. Check both before choosing.',
        'The top stays flat, which rules out anything that narrows to a peak, and it stands high, which rules out anything that does not rise above the land around it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-mountain-or-hill',
      kind: 'try_yourself',
      problem:
        'A landform rises steeply from the land around it and climbs very high, narrowing at the top to a sharp, rocky peak. Which landform matches this description?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A hill, because it rises above the land around it, but only gently, with rounded slopes.' },
        { id: 'b', text: 'A plateau, because it stands high above the land around it, and its top stays flat as well.' },
        { id: 'c', text: 'A mountain, because it rises steeply to a high, narrow peak above the surrounding land.', correct: true },
        { id: 'd', text: 'A valley, because it lies low between two areas of much higher land on both sides.' },
      ],
      expectedAnswer: 'A mountain, because it rises steeply to a high, narrow peak above the surrounding land.',
      hints: [
        'Height alone does not decide this one. Check the shape of the top as well: flat, rounded, or narrow and pointed.',
        'A sharp, rocky peak rules out a flat top, so it is not a plateau, and the steep, high rise rules out the gentler slopes of a hill.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-valley-or-plain',
      kind: 'try_yourself',
      problem:
        'A long, low stretch of ground lies squeezed between two ranges of much higher land, one on each side. Which landform matches this description?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A plain, because it is a large area with very little change in elevation.' },
        { id: 'b', text: 'A plateau, because it stands higher than the land around it.' },
        { id: 'c', text: 'A hill, because it rises above the land around it with gentle slopes.' },
        { id: 'd', text: 'A valley, because it is low ground lying between higher land on both sides.', correct: true },
      ],
      expectedAnswer: 'A valley, because it is low ground lying between higher land on both sides.',
      hints: [
        'Check what borders this ground on each side, not only whether it is low.',
        'A plain is not defined by what sits next to it, and this description names higher land closing in on both sides, which is what makes it more than just flat, level ground.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-hill-mountain-plain-plateau',
      kind: 'misconception_check',
      question:
        'A student says: "A hill is just a mountain that has not finished growing, so any raised land could be a mountain someday. Also, a plain and a plateau are the same landform, since both have a flat top." What is wrong with each half of that?',
      commonErrors: [
        {
          answer: 'A hill is just a mountain that has not finished growing, so any raised land could be a mountain someday.',
          misconception:
            'Treating hill and mountain as one landform at two different stages, as though a hill slowly turns into a mountain over time, rather than as two separate categories defined by height and shape right now.',
          correctsTo:
            "A hill and a mountain are two different landforms, not two stages of the same one. A hill stands above the land around it, but not very far, and its slopes are gentle and rounded. A mountain stands far above the land around it, its slopes are steep, and it narrows to a peak or a ridge. WRONG: 'a hill is an unfinished mountain.' CORRECT: 'a hill and a mountain are told apart right now by how high they stand and how steep their slopes are, not by which one came first.'",
        },
        {
          answer: 'A plain and a plateau are the same landform, since both have a flat top.',
          misconception:
            "Sorting landforms by one property, flatness, and ignoring the other property this lesson always checks: how the land compares in height with what is around it.",
          correctsTo:
            "Flatness alone never settles which landform something is. A plain is flat AND stays about the same height as the land around it, with very little change in elevation anywhere. A plateau is flat on top AND stands well above the land around it, with edges that often drop away steeply. WRONG: 'flat on top means it is a plain.' CORRECT: 'flat and level with its surroundings is a plain; flat on top but standing high above its surroundings is a plateau.'",
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A landform in this lesson is named by two properties: how it compares in height with the land around it, and whether its top is flat or rises to a point.',
        'A mountain stands far above the land around it, is steep, and narrows toward a peak or ridge.',
        'A hill also rises above its surroundings, but less far, with gentler, more rounded slopes.',
        'A plateau stands high like a mountain, but its top stays flat like a plain, often with steep edges.',
        'A plain does not stand above the land around it. It is a wide stretch that is flat or gently rolling with very little change in elevation.',
        'A valley is low ground running between higher land on both sides, such as two ridges or two mountains.',
        'Every one of these five landforms needs both of its properties checked before it can be named. Height alone, or flatness alone, is never enough.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.1', cedTitle: 'Major Landform Vocabulary' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
