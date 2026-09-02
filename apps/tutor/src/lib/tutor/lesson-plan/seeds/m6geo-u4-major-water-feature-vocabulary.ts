/**
 * Grade 6 World Geography — Landforms & Water on Earth: Major Water Feature
 * Vocabulary.
 *
 * PROCEDURE-LED shape for the m6geo fan-out (National Geography Standard 7),
 * following the dispatch steering that lists "telling landform and
 * water-feature vocabulary apart" under the procedure-led exemplar
 * `m6geo-u2-hemispheres-equator-and-prime-meridian.ts`. The routine below is
 * this row's equivalent of that exemplar's two-question routine, run in the
 * same fixed order every time.
 *
 * THE ROUTINE (three questions, always run in this order, stop as soon as one
 * answers yes):
 *   1. Does the water flow in a channel across the land, moving from higher
 *      ground toward lower ground?  -> RIVER. If no, continue.
 *   2. Is the water closed in by land on every side, with no opening onto an
 *      ocean or a sea anywhere along its edge?  -> LAKE. If no, continue (the
 *      water is salt water connected to the ocean).
 *   3. Is this a PASSAGE or a POCKET? A passage can be entered from one
 *      larger body of water and, on the far side, exited into a DIFFERENT
 *      larger body of water -> STRAIT. A pocket is entered and exited through
 *      the very same opening. Inside a pocket: if land curves around most of
 *      its edge and the remaining opening is comparatively narrow -> GULF; if
 *      land borders only part of its edge and the rest stays broadly open to
 *      the ocean -> SEA.
 *
 * SCOPE GUARD: this row defines and distinguishes river, lake, sea, gulf, and
 * strait purely by the relationship between the water and the land around it
 * -- moving or still, enclosed or open, pocket or through-passage -- using
 * invented, unnamed water features only, exactly as this row's own scope line
 * requires. This is stricter than this course's usual default of allowing a
 * small handful of real-place anchors (Greenwich, Africa, Antarctica, the
 * Atlantic): that default does NOT apply here, because this row's scope line
 * overrides it. No real river, lake, sea, gulf, or strait is named anywhere in
 * this file, including in this doc comment. This row also never explains WHY
 * a river runs downhill beyond the one-step fact that it does, never defines
 * a bay, a tributary, or a delta, never touches the erosion-and-deposition
 * process that builds a delta, and never gives the settlement-pattern payoff
 * (why towns and farms cluster along rivers, or why traffic squeezes through
 * a strait). All of that, plus a real named anchor for every one of these
 * same five words (the Strait of Gibraltar, the Nile, the Mediterranean Sea),
 * belongs to Grade 7's `m7geo-u2-landforms-and-water-features.ts`. Sideways,
 * this row does not touch land-shape vocabulary (mountain, plain, plateau,
 * hill, valley -- row 4.1, `major-landform-vocabulary`), coastal or
 * connecting landforms (peninsula, isthmus, island, coast -- row 4.2,
 * `coastal-and-connecting-landforms`), or elevation and relief (row 4.4,
 * `reading-elevation-and-relief`).
 *
 * What IS deliberately allowed, because the sea/gulf pair has a genuinely
 * fuzzy real-world boundary: this row states, as a named fact rather than a
 * hidden assumption, that the line between a sea and a gulf is partly a
 * matter of naming history, and that a real body of water does not always
 * carry the name its enclosure would predict. That statement names NO real
 * sea or gulf and asserts NO mechanism for why any particular name drifted --
 * it only tells the student plainly that the property taught here is what the
 * words are SUPPOSED to track, not a guarantee about every real name. This
 * mirrors how `m6geo-u2-continents-and-oceans.ts` handles the six-versus-
 * seven-continent and four-versus-five-ocean convention: state the variance
 * plainly rather than implying the taught convention is the only fact in the
 * world.
 *
 * DEPTH CEILING NOTE FOR THE FAN-OUT: every keyIdea and item below is
 * answerable by DEFINE or CLASSIFY. Test 5 (open the matching Grade 7 file and
 * read your sentences next to it) is the test this row comes closest to
 * failing, because Grade 7's own bare defining-property sentences for these
 * same five words are, at that level, almost identical to Grade 6's -- neither
 * grade attaches a hidden mechanism to "what a strait is." What actually
 * separates the two files is not depth of definition but everything Grade 7
 * adds ON TOP of the definition: a real named anchor for every term, the
 * erosion/deposition process that builds a delta, and the settlement-pattern
 * payoff. This row cuts all three additions to pass Test 5, and introduces no
 * vocabulary (bay, tributary, delta) that Grade 7 owns.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped
 * Grade 7 Geography bank the keyed answer was the strictly longest choice 67%
 * of the time, rising to 94% at difficulty 4; chance with four choices is
 * 25%). Every distractor below states a full wrong reason rather than a bare
 * wrong label, and no key was built to be the longest choice because it is the
 * key. Measured as a diagnostic, not as a score: choice character counts,
 * verified by script, are item 1 -- a (key) 106, b 117, c 129, d 76; item 2 --
 * a 118, b (key) 126, c 134, d 137; item 3 -- a 106, b 86, c (key) 89, d 125.
 * The key is the strictly longest choice in zero of the three items. Item 1's
 * first draft already cleared this; items 2 and 3 did not (each key was
 * briefly the strictly longest -- item 3 by a three-character margin, which
 * is a tie, not a signal, per the dispatch rules) until a second pass gave
 * two under-elaborated distractors (a river confused for a land-on-both-sides
 * valley description in both items) the same full stated reason the key
 * already had. No key was shortened to reach this, and zero fell out of that
 * per-item fix, not from padding past honesty. The three keys
 * sit at ids a, b, and c, which is the id set `(4 + 3) mod 4 = 3` requires,
 * omitting d.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every item is solvable from
 * the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6GEO_U4_MAJOR_WATER_FEATURE_VOCABULARY: LessonPlan = {
  id: 'evelyn.ms.m6geo.major-water-feature-vocabulary.v1',
  title: 'Major Water Feature Vocabulary',
  curriculum: 'MS',
  grade: '6',
  subject: 'social-studies',
  topic: 'grade-6-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm6geo.major-water-feature-vocabulary',
      standard: 'M6GEO-4.3',
      description:
        'Define and distinguish river, lake, sea, gulf, and strait by the properties that make each one what it is, using invented examples only (National Geography Standard 7: the physical processes that shape the patterns of Earth\'s surface).',
    },
  ],
  prerequisites: ['m6geo.coastal-and-connecting-landforms'],
  followUps: ['m6geo.reading-elevation-and-relief'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Motivate naming five water shapes precisely before any vocabulary arrives, using a task an eleven-year-old already understands.',
      script:
        'Imagine you are designing the map for a video game. You draw a winding blue line that carries a boat from the mountains down to the coast. You draw a wide blob of blue completely closed inside your island, with no way out to the sea at all. You draw a piece of ocean that reaches deep into your coastline, almost pinched off by land on three sides. If a player asks what each blue shape actually is, "a blue shape" is not good enough. Mapmakers use five different words for water, and each word is not about how big or how pretty the shape looks -- it is about exactly how the land around it is arranged, and whether the water moves or holds still. Learn the five words today, and any blue shape on any map, real or invented, gets the right name.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-five-water-features',
      kind: 'concept',
      goal: 'Install the defining relationship between water and land for river, lake, sea, gulf, and strait, plus the honest naming-history caveat for the sea/gulf pair.',
      keyIdeas: [
        'FIVE WATER WORDS, ONE QUESTION EACH TIME. River, lake, sea, gulf, and strait are five different water features, and each one is defined by exactly one thing: the relationship between the water and the land around it, and whether the water is moving or holding still. None of the five is defined by how big it is or by what a map happens to call it.',
        'A RIVER IS WATER THAT MOVES THROUGH A CHANNEL CUT ACROSS THE LAND. It flows from higher ground toward lower ground, the way water always runs downhill, and it usually ends where it empties into another body of water, such as a lake, a sea, or an ocean. The moving-downhill relationship is what makes a river a river, not how wide or how long it is.',
        'A LAKE IS WATER WITH LAND COMPLETELY AROUND IT, AND NO OPENING TO THE OCEAN. Land surrounds a lake on every side, so a lake has no edge that opens onto an ocean or a sea. A river can flow into a lake or out of it, but that river is a separate channel through the land -- the lake itself stays closed in. The water in a lake is usually fresh water, not salty.',
        'A SEA AND A GULF ARE BOTH SALT WATER THAT LAND WRAPS AROUND ONLY PARTLY, KEEPING ONE OPENING TO THE OCEAN. Both are pockets: water goes in and comes back out through the very same opening, unlike a river, which runs straight through, or a lake, which has no opening at all. A SEA keeps a broad, open connection to the ocean, with land bordering only part of its edge. A GULF is more closed in: land curves around most of its edge, and the connection onward to the ocean or a sea is comparatively narrow.',
        'A STRAIT IS A PASSAGE, NOT A POCKET. It is a narrow stretch of water with land on both sides, but instead of one opening you enter and leave through, a strait joins two larger bodies of water end to end. A ship can sail in from one larger body of water and sail all the way through, coming out into a different larger body of water on the far side. That through-passage relationship is what separates a strait from a sea or a gulf, which are both entered and exited from the same side.',
        'THE LINE BETWEEN A SEA AND A GULF IS THE FUZZIEST ONE IN THIS LESSON, AND IT IS PARTLY A MATTER OF NAMING HISTORY. Many real bodies of water were named long before anyone wrote down a strict rule for telling a sea from a gulf, so a real body of water called a sea sometimes fits this lesson\'s definition of a gulf better, and one called a gulf sometimes fits the definition of a sea better. This lesson teaches the property that is supposed to separate them -- how much of the edge is land, and how narrow the remaining opening is -- but it does not promise that every real name lines up with that property perfectly.',
      ],
      vocabulary: [
        { term: 'river', definition: 'water that flows through a channel across the land, moving from higher ground toward lower ground.' },
        { term: 'lake', definition: 'water with land completely around it on every side, with no opening onto an ocean or a sea.' },
        { term: 'sea', definition: 'salt water that land borders along part of its edge, while the rest stays broadly open to a larger ocean it connects with.' },
        { term: 'gulf', definition: 'salt water that land curves around on most of its edge, connecting onward to a sea or ocean through a comparatively narrow opening.' },
        { term: 'strait', definition: 'a narrow passage of water with land on both sides, joining two larger bodies of water end to end.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-run-the-routine',
      kind: 'worked_example',
      problem:
        'A description for a class project reads: "Water moves in a channel across the land, flowing from a hillside down to lower ground, and it empties into a larger body of water at the end of its path." Run the three-question routine. Which water feature is this, and why?',
      steps: [
        'Ask question 1 first, every time: does the water flow in a channel across the land, moving from higher ground toward lower ground? The description says exactly this -- it flows from a hillside down to lower ground. Question 1 is answered yes.',
        'Stop as soon as question 1 is answered yes. The routine assigns river the moment this is true, because moving-downhill-through-a-channel is a river\'s one defining relationship. Questions 2 and 3, about enclosure and about passage-versus-pocket, only matter for water that does not move this way, so there is no need to ask them here.',
        'Check the answer by rereading the description backward: it says the water ends lower than it starts, so the high-to-low direction is stated consistently and does not contradict itself.',
        'Check the shape of the answer too. A river is defined by moving water in a channel, not by being enclosed on every side or by staying salty or fresh. Enclosure and salt water only become the deciding questions once question 1 has already answered no.',
        'Test a contrasting case so the idea is not overlearned. If the description instead said "water rests inside a bowl-shaped stretch of land, with no place along its edge that opens onto an ocean or a sea," question 1 would answer no, since nothing there is flowing across land from high to low ground, and the routine would move on to question 2, landing on lake instead.',
      ],
      answer:
        'This is a river: water moving in a channel across the land from higher ground to lower ground, ending where it empties into another body of water. Question 1 of the routine settles it immediately, since the flowing-downhill relationship is a river\'s defining property.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-hallway-vs-pocket',
      kind: 'worked_example',
      problem:
        'A student writes two descriptions. Water Feature One: "Salt water reaches in from the ocean, with land curving around it on three sides and only a narrower stretch of open water at one end connecting it back to the ocean beyond. This must be a strait, since the opening is narrow." Water Feature Two: "A body of water sits inside a stretch of land, with no part of its edge opening onto an ocean or a sea. Land surrounds it on every side. This must be a gulf, since it is mostly surrounded by land." Both are wrong. Correct each one.',
      steps: [
        'Take Water Feature One first. WRONG: "This must be a strait, since the opening is narrow." The mistake is judging the feature only by how narrow its opening is, rather than by what that opening actually connects to.',
        'Run question 3\'s real test on Water Feature One: could a ship enter from one larger body of water and sail all the way through, coming out into a DIFFERENT larger body of water on the far side? No -- Water Feature One is entered and exited through the very same narrow opening. A strait is a hallway you pass through and come out somewhere else. This is a pocket you go into and come back out of the same way. CORRECT: Water Feature One is a gulf, since land curves around it on three sides and it connects to the ocean through one narrower opening.',
        'Now take Water Feature Two. WRONG: "This must be a gulf, since it is mostly surrounded by land." The mistake is stopping at "surrounded by land" without checking whether any opening onto the ocean or a sea is left at all.',
        'Run the enclosure test on Water Feature Two: does any part of its edge open onto an ocean or a sea? The description says no part of it does -- land surrounds it completely, with no opening anywhere. A gulf always keeps exactly one such opening; it never closes off completely. CORRECT: Water Feature Two is a lake, since it is fully enclosed by land with no opening onto the ocean or a sea at all.',
        'Check the shape of both corrections together. A gulf is a pocket with one remaining opening to the ocean or a sea. A lake is a pocket with no opening at all. A strait is not a pocket in the first place -- it is a passage all the way through. Three different relationships between the water and the land around it, and each has its own test.',
        'Test a contrasting case: if Water Feature One\'s single opening instead connected all the way through to a second, different large body of open water on its far side, the answer would change to strait, since it would then be a through-passage rather than a pocket.',
      ],
      answer:
        'Water Feature One is a gulf, not a strait: it is entered and exited through the same opening rather than passing through to a different body of water on the far side. Water Feature Two is a lake, not a gulf: it has no opening onto an ocean or a sea at all, while a gulf always keeps one.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-classify-the-gulf',
      kind: 'try_yourself',
      problem:
        'A body of salt water reaches in from the ocean. Land curves around it on three sides, leaving only one narrower stretch of open water at one end, where it connects back to the ocean beyond. Which water feature is being described?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A gulf, since land curves around most of its edge and only a narrower opening leads back out to the ocean.', correct: true },
        { id: 'b', text: 'A sea, since it is salt water connected to the ocean along a broad, open stretch rather than mostly enclosed by land.' },
        { id: 'c', text: 'A strait, since a ship could enter through the narrow opening and come out into a different larger body of water on the far side.' },
        { id: 'd', text: 'A lake, since land surrounds the salt water almost completely on every side.' },
      ],
      expectedAnswer: 'A gulf, since land curves around most of its edge and only a narrower opening leads back out to the ocean.',
      hints: [
        'Check how much of the water\'s edge is bordered by land, and whether the one narrower opening leads back to the same ocean or through to a different larger body of water.',
        'This water is entered and left through the very same opening, which makes it a pocket, not a passage -- and it does keep one opening, so it is not fully closed in either.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-classify-the-strait',
      kind: 'try_yourself',
      problem:
        'A ribbon of water lies between two stretches of land. A ship can enter it from a large body of open water at one end and sail all the way through it, coming out into a different large body of open water at the other end. Which water feature is being described?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A gulf, since the water is a narrow channel bordered by land that connects onward to a larger body of water beyond it.' },
        { id: 'b', text: 'A strait, since the water is a narrow passage bordered by land on both sides that joins two larger bodies of water end to end.', correct: true },
        { id: 'c', text: 'A river, since the water moves through a channel with land on both sides, the way a river runs downhill between the walls of a valley.' },
        { id: 'd', text: 'A sea, since it is bordered by land along part of its edge and stays open to the ocean, without narrowing into a passage on the far side.' },
      ],
      expectedAnswer: 'A strait, since the water is a narrow passage bordered by land on both sides that joins two larger bodies of water end to end.',
      hints: [
        'Ask what is at each end of this water, not just how narrow it is: is a ship entering and leaving through the same opening, or coming out somewhere completely different?',
        'A gulf and a sea are pockets, entered and left through one opening. A river flows downhill from high ground to low ground. This water does neither -- it passes all the way through, end to end.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-classify-the-lake',
      kind: 'try_yourself',
      problem:
        'A body of water sits completely inside a stretch of land. No part of its edge opens onto an ocean or a sea; land surrounds it on every side. Which water feature is being described?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A river, since a river also has land on both sides as it flows downhill through the two walls of a valley.' },
        { id: 'b', text: 'A gulf, since land curves around most of the water\'s edge, leaving it mostly enclosed.' },
        { id: 'c', text: 'A lake, since land encloses the water completely, with no opening onto an ocean or a sea.', correct: true },
        { id: 'd', text: 'A strait, since land borders the water on both sides, the same way land borders a passage between two larger bodies of water.' },
      ],
      expectedAnswer: 'A lake, since land encloses the water completely, with no opening onto an ocean or a sea.',
      hints: [
        'Ask whether this water flows anywhere at all, and whether any part of its edge opens onto an ocean or a sea.',
        'A gulf always keeps one opening onward to a sea or ocean, and a strait always has an opening at each end. This water has no opening anywhere, on every side.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-narrow-and-always-matches',
      kind: 'misconception_check',
      question:
        'A student says: "A strait is just a small gulf, since both are narrow. And a body of water called a gulf must always be more closed in by land than a body of water called a sea, because a strict rule decides which word real places get." What is wrong with each half of that?',
      commonErrors: [
        {
          answer: 'A strait is just a small gulf, since both are narrow.',
          misconception:
            'Judging a strait by how narrow it looks instead of by what its opening actually connects to, since a strait and a gulf can both look like a narrow stretch of water squeezed between land.',
          correctsTo:
            'Width is not the test. WRONG: "a strait is just a small gulf." CORRECT: a gulf is a pocket -- a ship enters and leaves through the very same opening, because land curves around the rest of its edge. A strait is a passage -- a ship enters from one larger body of water and comes out into a different larger body of water on the far side. A strait and a gulf can be exactly the same width and still be two completely different water features, because the difference is what lies at the far end, not how narrow the water is.',
        },
        {
          answer: 'A body of water called a gulf must always be more closed in by land than a body of water called a sea, because a strict rule decides which word real places get.',
          misconception:
            'Assuming that because this lesson gives sea and gulf a clear defining property, every real body of water on Earth must have been named by checking that property first.',
          correctsTo:
            'Many real bodies of water were named long before anyone wrote down a strict rule for telling a sea from a gulf. WRONG: "the sea or gulf name always matches how enclosed the water actually is." CORRECT: this lesson\'s definitions describe the property that is supposed to separate a sea from a gulf, but a real name does not always follow it -- some water called a sea is more closed in by land than some water called a gulf, and the other way around. Knowing the property is still worth learning: it is exactly how you would classify a water feature that has no name attached to it at all.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Five water words, one question each time: what is the relationship between the water and the land around it, and does the water move or hold still?',
        'A river is water that flows through a channel across the land, from higher ground toward lower ground, usually ending where it empties into another body of water.',
        'A lake is water with land completely around it on every side, with no opening onto an ocean or a sea. The water in a lake is usually fresh, not salty.',
        'A sea and a gulf are both salt water pockets, entered and left through one opening. A sea keeps a broad, open connection to the ocean. A gulf is more closed in, with land curving around most of its edge and a comparatively narrow opening left.',
        'A strait is a passage, not a pocket: a narrow stretch of water with land on both sides that joins two larger bodies of water end to end, so a ship enters from one side and comes out into a different larger body of water on the other.',
        'The line between a sea and a gulf is partly a matter of naming history. This lesson teaches the property the words are supposed to track, but a real name does not always match it perfectly.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.3', cedTitle: 'Major Water Feature Vocabulary' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
