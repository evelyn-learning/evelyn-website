/**
 * Grade 6 World Geography — Place & Perception: What Makes a Place Unique.
 *
 * PROCEDURE-LED row in the m6geo fan-out (National Geography Standard 4). The
 * routine is a two-question completeness check rather than a mental model:
 * given a description of a place, ask whether it names a physical
 * characteristic (a landform or the climate), ask whether it names a human
 * characteristic (a building or an activity), and call the description
 * complete only when both answers are yes. Every place in this lesson is
 * INVENTED and named only to keep the worked examples readable -- no real
 * place appears anywhere in this file. That follows the same choice the
 * sibling row `m6geo-u6-how-people-adapt-to-different-climates.ts` makes for
 * the same reason: describing a place's human characteristics is exactly
 * where a careless sentence can turn into a claim about what a group of real
 * people is like, and an invented place removes that risk by construction.
 * This lesson goes one step further than that sibling and states the guard as
 * lesson content, not just as an authoring choice: its second misconception
 * check corrects a student who reads "human characteristics" as a description
 * of a place's PEOPLE rather than of what people there BUILD and DO.
 *
 * THE ROUTINE, in the order it is always run:
 *   1. Does the description name a physical characteristic -- a landform, or
 *      the climate?
 *   2. Does the description name a human characteristic -- a building, or an
 *      activity people do there?
 *   A description is complete only when both answers are yes. Counting more
 *   details of one type never substitutes for the other type.
 *
 * SCOPE GUARD: this row describes a place using both its physical
 * characteristics (landforms, climate) and its human characteristics
 * (buildings, activities), and checks whether a given description uses both.
 * It never names the formal three-part framework of adapting to, modifying,
 * and depending on surroundings, and it never names or uses the
 * formal/functional/perceptual region typology -- both belong to Grade 7's
 * `m7geo-u1-regions-and-place.ts`, and neither phrase, nor any two-part or
 * three-part named framework for HOW people relate to a place, appears
 * anywhere in this file. This row also does not compare two places against
 * each other (Grade 6 row 8.3, `comparing-two-places`), does not address how
 * two different people might perceive the very same place differently (Grade
 * 6 row 8.2, `how-people-perceive-places-differently`), and does not sketch or
 * label a community map (Grade 6 row 8.4, `mapping-your-own-community`) --
 * every example here is one independent, invented place described once. What
 * IS deliberately allowed, because Grade 7 sits directly across the line: this
 * lesson names concrete buildings and activities -- a covered market, a
 * fishing fleet, a lantern festival -- in the same plain register Grade 7
 * uses for its own single illustrative examples. The difference is depth of
 * treatment, not the raw facts involved: this row never generalizes those
 * examples into a named framework, and it stops at checking whether a
 * description names one of each type, never at explaining why people chose
 * to live somewhere or how a place's people relate to their surroundings. The
 * same Grade 7 file also opens with the identical physical-versus-human split
 * this row teaches (it is one of four skills bundled into its own LO), which
 * the signed curriculum's own progression rationale names as intended spiral
 * review, not a collision to avoid; this row stays under it with narrower
 * category lists (landform and climate only; building and activity only,
 * against Grade 7's longer lists of rivers, coastlines, soil, plants,
 * animals, language, building material, land use and common work) and by
 * never defining "place" itself as a synthesized term, which Grade 7's own
 * vocabulary does.
 *
 * DEPTH CEILING NOTE FOR THE FAN-OUT: every item below is answered by
 * CLASSIFY -- sorting a description or a pair of details as complete or not,
 * by type mix, never by explaining why a person or a community made a choice.
 * "Landform" and "climate" and "building" and "activity" are a plain
 * vocabulary set naming the two kinds of characteristic a place has, not a
 * closed typology belonging to a mechanism, so naming all four is not a Test 2
 * breach.
 *
 * Test 5, the Grade 7 file test, came closest to failing, and it is worth
 * recording exactly why. `m7geo-u1-regions-and-place.ts` opens its own
 * concept segment with almost this row's own move: "PHYSICAL CHARACTERISTICS
 * are the things that would be there without people... HUMAN CHARACTERISTICS
 * are what people make and how people live," illustrated with an invented
 * town ("Millbrook sits in a wide valley, winters there are long and snowy,
 * and most of the older houses have steep roofs"). That is structurally the
 * same move this row's first worked example makes with Rivermill. This is not
 * a coincidence to paper over: the signed curriculum's own progression
 * rationale states plainly that Unit 8 feeds G7 Unit 1.4 as spiral review, and
 * NGS 4 (physical/human characteristics) is literally one of four skills
 * G7's own LO bundles together with region typology and the adapt/modify/
 * depend framework. The cut that keeps this row under the ceiling is narrower
 * category lists and a narrower goal, not a different topic: this row's
 * physical list stops at landform and climate (G7 also lists rivers,
 * coastlines, soil, plants and animals), its human list stops at building and
 * activity (G7 also lists language, building material, land use and common
 * work), it never defines "place" as its own synthesized term the way G7's
 * vocabulary does, and it never moves past checking whether a description
 * names one of each kind toward sorting areas into regions or explaining how
 * people adapt to, modify, or depend on surroundings. The natural way to make
 * this narrower skill hard is a trap where a description LOOKS complete
 * because it is long (Test 4), and this lesson uses exactly that trap on
 * purpose (see the misconception check) -- but the trap is "count of details
 * versus mix of types," available at DEFINE/CLASSIFY depth with no mechanism
 * attached, not a mechanism-only trap like large-scale-versus-small-scale.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped
 * Grade 7 Geography bank the keyed answer was the strictly longest choice 67
 * percent of the time, and 94 percent at difficulty 4; chance with four
 * choices is 25 percent). Every distractor below states a full wrong reason
 * rather than a short wrong label, and no key was built to be the longest
 * choice BECAUSE it is the key. Measured as a diagnostic, not as a score: of
 * the three items, the key is the strictly longest choice in zero of them.
 * Item 1's key (137 chars) ranks third of four, 3 chars behind the longest
 * choice at 140 -- a margin the contract's own rule calls a tie, not a
 * signal. Item 2's key (92 chars) is the shortest of four, 23 chars behind
 * the longest choice at 115 -- a real gap, not a tie. Item 3's key (140
 * chars) ranks second (tied with one other choice at 140), 3 chars behind the
 * longest choice at 143 -- again a tie by the contract's own three-character
 * rule. See the note in `m6geo-u3-earths-moving-plates.ts` for why zero of
 * three is not itself a target to aim for; it is reported here because it is
 * what one honest lengthening pass over the distractors produced, not because
 * the count was pushed there afterward. The three keys sit at ids c, a, and
 * d, which is the id set `(8 + 1) mod 4 = 1` requires, omitting b.
 *
 * NOTE ON prerequisites/followUps: populated for real from this row's brief
 * (`m6geo.reading-geographic-graphs-and-charts` -> `m6geo.what-makes-a-place-
 * unique` -> `m6geo.how-people-perceive-places-differently`), not left empty
 * -- both arrays resolve once the controller registers the full 40-row batch.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every item is solvable from
 * the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6GEO_U8_WHAT_MAKES_A_PLACE_UNIQUE: LessonPlan = {
  id: 'evelyn.ms.m6geo.what-makes-a-place-unique.v1',
  title: 'What Makes a Place Unique',
  curriculum: 'MS',
  grade: '6',
  subject: 'social-studies',
  topic: 'grade-6-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm6geo.what-makes-a-place-unique',
      standard: 'M6GEO-8.1',
      description:
        'Describe a place using both its physical characteristics (landforms, climate) and its human characteristics (buildings, activities) (National Geography Standard 4: the physical and human characteristics of places).',
    },
  ],
  prerequisites: ['m6geo.reading-geographic-graphs-and-charts'],
  followUps: ['m6geo.how-people-perceive-places-differently'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that describing a place with only one kind of detail leaves out half the picture, before any vocabulary arrives.',
      script:
        'Imagine a friend asks you to describe your favorite place, and you only get to say two things about it. If you say "it is next to a lake, and it is cold in the winter," your friend knows something real about the place, but nothing about what it is actually like to be there -- what people build, what people do. If you say "it has a big market, and people play music in the square every weekend," your friend now knows what happens there, but nothing about the land or the weather underneath it. Neither answer is wrong. Both are just half of the picture. Every place on Earth has two different kinds of characteristics, and a full description needs both. Today you learn to spot when a description is missing one of them, and how to fix it.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-two-kinds-of-characteristic',
      kind: 'concept',
      goal: 'Install the two kinds of characteristic, what counts as each, and the check that a description needs at least one of each to be complete.',
      keyIdeas: [
        'A PLACE HAS TWO KINDS OF CHARACTERISTIC: PHYSICAL AND HUMAN. A physical characteristic is a feature of the land or the weather that would still be there even if nobody ever lived in that place. A human characteristic is a feature that exists because people built it or because people do it there. A full description of a place uses both kinds, not just one.',
        'PHYSICAL CHARACTERISTICS INCLUDE A PLACE\'S LANDFORMS AND ITS CLIMATE. A landform is a natural feature of the land, such as a valley, a cliff, a plain, or a coastline. Climate is the long-term pattern of weather a place has, such as cold, dry winters or warm, humid summers. Both are part of the land and the sky, not something a person built or chose to do.',
        'HUMAN CHARACTERISTICS INCLUDE A PLACE\'S BUILDINGS AND ITS ACTIVITIES. A building is a structure people put up, such as a market, a workshop, or a row of houses. An activity is something people do there, such as trading, fishing, farming, or holding a festival. Both describe what people have built and what people do -- not what kind of people they are. Two different places can have very different buildings and activities without either place\'s people being better or worse in any way.',
        'A DESCRIPTION IS COMPLETE ONLY WHEN IT NAMES AT LEAST ONE OF EACH KIND. A description that lists several physical characteristics and nothing else is not complete, and a description that lists several human characteristics and nothing else is not complete either. The number of details does not matter as much as the mix: one physical characteristic and one human characteristic is enough to make a description complete, and ten of only one kind is not.',
        'THE CHECK IS TWO QUESTIONS, ALWAYS IN THIS ORDER. Question 1: does the description name a physical characteristic -- a landform, or the climate? Question 2: does the description name a human characteristic -- a building, or an activity? A description passes only when the answer to both questions is yes.',
        'A SINGLE PLACE CAN BE DESCRIBED IN MANY DIFFERENT COMPLETE WAYS. There is no single correct pair of details for any place -- one complete description of a town might mention its river and its market, while another complete description of the very same town might mention its cold winters and its fishing boats instead. Any pairing that includes one physical characteristic and one human characteristic counts.',
      ],
      vocabulary: [
        { term: 'physical characteristic', definition: 'a feature of a place\'s land or climate that would exist even if no people lived there, such as a landform or a weather pattern.' },
        { term: 'human characteristic', definition: 'a feature of a place that exists because people built it or because people do it there, such as a building or an activity.' },
        { term: 'landform', definition: 'a natural feature of the land, such as a valley, a cliff, a plain, or a coastline.' },
        { term: 'climate', definition: 'the long-term pattern of weather a place has, such as how hot, cold, wet, or dry it usually is.' },
        { term: 'activity', definition: 'something people do in a place, such as trading, fishing, farming, or holding a festival.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-run-the-two-questions',
      kind: 'worked_example',
      problem:
        'Read this description of a made-up town called Rivermill: "Rivermill sits in a wide valley next to a slow, winding river. Winters are mild and rainy, and summers are warm and dry. Many of the buildings have wide porches facing the water, and every autumn the people who live there gather to harvest apples from nearby orchards and sell them at a market by the river." Name a physical characteristic and a human characteristic in this description, and say whether the description is complete.',
      steps: [
        'Run question 1 first, every time: does the description name a physical characteristic? Rivermill sits in a valley next to a river, which are landforms, and its winters and summers are described, which is its climate. Question 1 is answered yes, twice over.',
        'Run question 2: does the description name a human characteristic? The buildings have porches facing the water, which is a building detail, and the people gather to harvest and sell apples at a market, which is an activity. Question 2 is answered yes, twice over.',
        'Both questions are yes, so the description is complete. It does not need a third or fourth detail to count -- it needed one of each kind, and it has more than one of each.',
        'Check the answer by picking out exactly one detail of each kind, since that is the minimum the routine actually asks for: the valley (physical) and the apple harvest and market (human) are enough on their own to make the description complete.',
      ],
      answer:
        'Physical characteristics: the valley and the river (landforms), and the mild, rainy winters and warm, dry summers (climate). Human characteristics: the porched buildings, and the autumn apple harvest and market (activities). Because the description names at least one physical characteristic and at least one human characteristic, it is complete.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-counting-details-is-not-the-check',
      kind: 'worked_example',
      problem:
        'A student looks at Rivermill\'s description and says: "This description is complete because it mentions the valley, the river, AND the mild winters -- three physical details are plenty." Explain what is wrong with that reasoning, and then check whether a very different description, of a made-up town called Sandport, is complete: "Sandport is a busy trading center. Its docks stay full of fishing boats, its main street has dozens of small shops, and every year its people hold a lantern festival by the harbor."',
      steps: [
        'Test the student\'s reasoning first. WRONG: three details of the same kind make a description complete. CORRECT: the check is not how many details there are, but whether both kinds are present. Three physical details with zero human details still fails question 2 of the routine.',
        'Confirm that with Rivermill itself. Its description happens to be complete, but not because it has many details -- it is complete because at least one of its details is physical (the valley) and at least one is human (the apple market). A description with three physical details and zero human details would not be complete, even though three is more than one.',
        'Now run the same two-question routine on Sandport, a description built the opposite way. Question 1: does it name a physical characteristic -- a landform or the climate? Trading, fishing boats, shops, and a festival are all things people do or built. No landform is named and no climate is described.',
        'Question 2: does it name a human characteristic? Yes -- the docks and shops are buildings, and trading, fishing, and the festival are activities. Question 2 passes easily.',
        'Question 1 fails, so Sandport\'s description is not complete, even though it has three separate human details. It would become complete the moment one physical characteristic was added, such as naming the coastline the docks sit along or the harbor\'s foggy summers.',
      ],
      answer:
        'Counting details of the same type does not make a description complete. Sandport\'s description names three human characteristics (trading, the docks and shops, and the lantern festival) but no physical characteristic at all, so it is not complete -- the same as it would not be complete with three physical details and no human ones. A description is complete only when it names at least one physical characteristic and at least one human characteristic.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-which-description-is-complete',
      kind: 'try_yourself',
      problem:
        'Which of these descriptions of a made-up village includes both a physical characteristic and a human characteristic?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Thistlewick sits at the base of a tall cliff, where cold winds blow steadily through the narrow valley for most of the year.' },
        { id: 'b', text: 'Copper Bend is home to a busy metal workshop, and its residents hold a nightly market where they trade tools they have made from the metal.' },
        { id: 'c', text: 'Sable Ridge lies along a rocky coastline with cool, foggy summers, and its people run a small fishing fleet that sails out every morning.', correct: true },
        { id: 'd', text: 'Ashgrove has three main streets lined with small shops, and its town band performs a full concert in the square every single Friday evening.' },
      ],
      expectedAnswer: 'Sable Ridge lies along a rocky coastline with cool, foggy summers, and its people run a small fishing fleet that sails out every morning.',
      hints: [
        'Run the two-question routine on each choice: does it name a landform or climate, and does it name a building or an activity?',
        'Three of these four descriptions name only buildings and activities, or only a landform and climate. Only one names one of each kind.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-what-would-complete-it',
      kind: 'try_yourself',
      problem:
        'Read this description of a made-up town called Brackenfen: "Brackenfen is built on a flat plain beside a slow-moving river. The winters are cold and dry, and the summers are warm and humid." Which addition would make this description complete?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Add that its people built a covered market so trading can continue through the cold winters.', correct: true },
        { id: 'b', text: 'Add that the flat plain is bordered by low, rolling hills that rise gradually along its western edge.' },
        { id: 'c', text: 'Add that the slow-moving river freezes solid enough to walk across for several weeks in the coldest part of winter.' },
        { id: 'd', text: 'Add that the flat plain stretches for a very long distance in every direction with no hills anywhere in sight.' },
      ],
      expectedAnswer: 'Add that its people built a covered market so trading can continue through the cold winters.',
      hints: [
        'Run the two-question routine on the description as it stands: it already names a landform and a climate. Ask which question still has not been answered yes.',
        'Three of these additions only add more physical detail -- more landform or more climate. Only one adds a building or an activity, which is the kind still missing.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-pick-the-matching-pair',
      kind: 'try_yourself',
      problem:
        'A geographer wants to describe a made-up desert outpost using exactly one physical characteristic and one human characteristic. Which pair of details does that?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The outpost is completely surrounded by wide, shifting sand dunes, and the strong wind there slowly reshapes those dunes year after year.' },
        { id: 'b', text: 'The days there are extremely hot and dry, the nights turn sharply cold, and the region receives almost no rain at any point during the year.' },
        { id: 'c', text: 'The outpost\'s traders meet each day at a walled market near the gate, and every trader stores extra water in tall clay jars for the dry season.' },
        { id: 'd', text: 'The outpost sits between two sand dunes that block much of the wind, and its traders meet each morning at a walled market to exchange goods.', correct: true },
      ],
      expectedAnswer: 'The outpost sits between two sand dunes that block much of the wind, and its traders meet each morning at a walled market to exchange goods.',
      hints: [
        'Check each pair against the two-question routine separately: is the first detail physical or human, and is the second detail the same kind or a different kind?',
        'Three of these pairs name two physical details or two human details. Only one pair names a landform first and a building or activity second.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-detail-count-and-people-not-actions',
      kind: 'misconception_check',
      question:
        'A student says: "A description with plenty of details is complete, even if every detail is a physical characteristic like a landform or the climate. And when a description names a place\'s buildings and activities, it is really describing what kind of people live there." What is wrong with each half of that?',
      commonErrors: [
        {
          answer: 'A description with plenty of details is complete, even if every detail is a physical characteristic like a landform or the climate.',
          misconception:
            'Confusing the NUMBER of details with the RIGHT MIX of detail types, and assuming that more detail automatically means a more complete description.',
          correctsTo:
            'A description is complete when it names at least one physical characteristic and at least one human characteristic, not when it names a certain number of details. WRONG: "three physical details are enough to be complete." CORRECT: "one physical characteristic and one human characteristic are enough, and ten details of only one kind are not." A description of Sandport with three human details and zero physical details is not complete, in exactly the same way a description with three physical details and zero human details is not complete.',
        },
        {
          answer: 'When a description names a place\'s buildings and activities, it is really describing what kind of people live there.',
          misconception:
            'Turning a description of what people BUILD and DO into a description of what kind of people they are, which is not what a human characteristic means in geography.',
          correctsTo:
            'A human characteristic describes what people have built, such as a market or a workshop, and what people do there, such as trading or holding a festival -- it does not describe what the people themselves are like. WRONG: "Sandport\'s docks and lantern festival tell you what kind of people live there." CORRECT: "Sandport\'s docks and lantern festival tell you what people there have built and what they do; they say nothing about the people themselves." Two different made-up towns can have very different buildings and activities without either town\'s people being better, worse, or more advanced in any way.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A place has two kinds of characteristic: physical (landforms and climate) and human (buildings and activities).',
        'A physical characteristic would exist even if no people lived there. A human characteristic exists because people built it or because people do it there.',
        'The check is two questions, always in this order: does the description name a physical characteristic, and does it name a human characteristic? Both must be yes.',
        'A description is complete when it names at least one of each kind. The number of details does not decide it -- the mix of types does.',
        'Buildings and activities describe what people have built and what people do, not what kind of people they are.',
        'Many different complete descriptions of the same place are possible, as long as each one pairs at least one physical characteristic with at least one human characteristic.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.1', cedTitle: 'What Makes a Place Unique' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
