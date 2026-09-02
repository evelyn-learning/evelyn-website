/**
 * Grade 6 World Geography — Landforms & Water on Earth: Coastal & Connecting
 * Landforms.
 *
 * PROCEDURE-LED shape for the m6geo fan-out (National Geography Standard 7),
 * following the dispatch steering to use the procedure-led exemplar
 * `m6geo-u2-hemispheres-equator-and-prime-meridian.ts` as the model: a short,
 * fixed, ordered routine the student runs on a description with no map in
 * front of them, exactly the way that exemplar runs its two-question routine
 * on a place's hemispheres.
 *
 * SCOPE GUARD: this row DEFINES and DISTINGUISHES four terms -- peninsula,
 * isthmus, island, and coast -- purely by the relationship between land and
 * water: how much water touches the land, and what land the remaining edge,
 * if any, connects to. It never explains HOW any of these four features
 * forms; erosion and deposition as landform-building mechanisms tied to real
 * places are Grade 7's `m7geo-u2-landforms-and-water-features.ts`, and this
 * file states no cause for any shape, only its properties. It never uses the
 * settlement-pattern payoff (why ports or trade collect at a narrow gap) that
 * the same Grade 7 file builds on top of these same four terms -- that
 * reasoning chain has more than one link and sits over this course's
 * causal-chain ceiling. Sideways inside Grade 6, this row does not teach
 * mountain, plain, plateau, hill, or valley (row 4.1,
 * `major-landform-vocabulary`), does not teach river, lake, sea, gulf, or
 * strait (row 4.3, `major-water-feature-vocabulary`), and does not compare
 * elevation or relief (row 4.4, `reading-elevation-and-relief`). Delta, which
 * the Grade 7 file defines alongside these same four terms, is not part of
 * any Grade 6 row and does not appear here either.
 *
 * This row's own scope line carries an instruction that overrides this
 * course's usual invented-place default: every example in this file,
 * including the hook and all three `try_yourself` items, is an INVENTED
 * place, never a real one. Unlike `m6geo-u2-continents-and-oceans.ts`, which
 * anchors on real continents because its own row requires naming them, this
 * row names no real country, coastline, or landmark anywhere in its lesson
 * prose. What IS deliberately carried over from that shipped row: the phrase
 * "a narrow strip of land," which that row uses for how Africa is joined to
 * Asia and how North America is joined to South America, is the very
 * land-joins-land relationship this row names ISTHMUS. Using the same phrase
 * for the same relationship keeps the term consistent across the course, but
 * this file teaches it on invented land rather than reusing that row's
 * continents, in line with its own scope line.
 *
 * The peninsula/isthmus pair is this row's hardest case, because both are
 * narrow strips of land with water alongside them, and the whole lesson is
 * built to keep them apart by naming the one relationship that differs: what
 * sits at the far end. A peninsula ends in water. An isthmus ends in more
 * land, at both of its ends. Coast is deliberately taught as answering a
 * different question from the other three (where land meets water, not how
 * much water surrounds it), precisely because a student who filed it as "a
 * fourth shape in the same list" would misclassify it every time an island or
 * a peninsula also turned out to have one.
 *
 * DEPTH CEILING NOTE FOR THE FAN-OUT: read `m7geo-u2-landforms-and-water-
 * features.ts` and notice what is missing here -- no erosion, no deposition,
 * no delta, no settlement-pattern payoff, and no real place is named anywhere
 * in the lesson body. Every keyIdea and item below is answered by DEFINE or
 * CLASSIFY alone.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped
 * Grade 7 Geography bank the keyed answer was the strictly longest choice 67%
 * of the time, rising to 94% at difficulty 4; chance with four choices is
 * 25%). Every distractor below states a full wrong reason rather than a bare
 * wrong label, and no key was built to be the longest choice because it is
 * the key -- and no key was trimmed to move this number either. Measured as a
 * diagnostic, not as a score: choice character counts are item 1
 * (try-classify-the-narrow-strip) -- a (key) 135, b 156, c 152, d 141; item 2
 * (try-classify-the-three-sided-piece) -- a 144, b (key) 121, c 118, d 115;
 * item 3 (try-what-coast-really-names) -- a 119, b 107, c 104, d (key) 118.
 * The key is the strictly longest choice in zero of the three items, but do
 * NOT read that as the target hit on purpose -- see the note in
 * `m6geo-u3-earths-moving-plates.ts` on why zero is not itself the goal and a
 * three-item file cannot distinguish chance from bias. The zero here fell out
 * of giving every distractor the same full-reason treatment as the key, never
 * from shortening a key; the first drafted distractors were shorter and
 * produced a 3-of-3 longest-key count before that per-item pass. Item 3's
 * margin is a near-tie worth flagging: the longest distractor (a, 119
 * characters) beats the key (d, 118 characters) by one character, so item 3
 * is honestly a coin flip between "key longest" and "key not longest" and
 * should not be read as a clean zero. The three keys sit at ids a, b, and d,
 * which is the id set `(4 + 2) mod 4 = 2` requires, omitting c.
 *
 * NOTE ON prerequisites/followUps: populated from the signed curriculum's row
 * chain, as the fan-out contract directs every row after the two exemplars to
 * do -- prerequisite is row 4.1 (`major-landform-vocabulary`), followUp is
 * row 4.3 (`major-water-feature-vocabulary`).
 *
 * There are NO MAPS AND NO IMAGES in this course. Every item is solvable from
 * the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6GEO_U4_COASTAL_AND_CONNECTING_LANDFORMS: LessonPlan = {
  id: 'evelyn.ms.m6geo.coastal-and-connecting-landforms.v1',
  title: 'Coastal & Connecting Landforms',
  curriculum: 'MS',
  grade: '6',
  subject: 'social-studies',
  topic: 'grade-6-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm6geo.coastal-and-connecting-landforms',
      standard: 'M6GEO-4.2',
      description:
        'Define and distinguish peninsula, isthmus, island, and coast by the properties that make each one what it is, using invented examples only (National Geography Standard 7: the physical processes that shape the patterns of Earth\'s surface).',
    },
  ],
  prerequisites: ['m6geo.major-landform-vocabulary'],
  followUps: ['m6geo.major-water-feature-vocabulary'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the peninsula/isthmus confusion feel real before any term is named.',
      script:
        'Imagine you are building your own world in a map-making game. You draw a big chunk of land, then stretch a thin piece of it out into the ocean until water surrounds it on three sides. Later you draw a completely different thin piece of land. This one does not point out into open water at all -- instead it links your big landmass to a second, separate landmass on the far side, with water running along both of its long edges the whole way across. On the screen those two thin pieces of land can look almost the same. A player who knows the real words for them would never call them the same thing, because one of them ends in water and the other one leads to more land. Today you learn exactly what tells those two apart, plus two more words for where land meets water, so you can name any coastline you draw or read about, without ever needing a picture of it.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-land-water-relationships',
      kind: 'concept',
      goal: 'Install island, peninsula, isthmus, and coast as four different land-water relationships, with the one-question check that keeps the confusable pair apart.',
      keyIdeas: [
        'ALL FOUR OF TODAY\'S WORDS ARE DEFINED BY ONE THING: HOW MUCH WATER TOUCHES A PIECE OF LAND, AND WHAT THAT LAND IS ATTACHED TO. None of the four is defined by size, by shape on its own, or by what is built on it. Picture tracing the whole edge of a piece of land with your finger. How much of that edge is water, and wherever it is not water, what land does it lead to?',
        'AN ISLAND IS LAND WITH WATER ALL THE WAY AROUND IT. Trace its entire edge and every part of that edge is water. An island has no connection to any larger landmass at all -- to reach one, you must cross water no matter which direction you come from.',
        'A PENINSULA IS LAND THAT REACHES OUT INTO WATER AND ENDS THERE, STILL ATTACHED ON ONE SIDE. Trace its edge and water touches most of it -- picture three sides out of four -- while the one remaining side stays joined to a larger landmass. A peninsula has exactly one way in or out by land: back the way it is attached. Every other direction runs into water.',
        'AN ISTHMUS IS THE OPPOSITE KIND OF NARROW STRIP: IT CONNECTS LAND TO LAND INSTEAD OF ENDING IN WATER. Picture a narrow strip of land with water running along its two long sides, but at each end the strip widens into a separate, larger area of land. Trace a peninsula\'s edge and you run into water and stop. Trace either long side of an isthmus and, instead of stopping in water, you reach a whole different area of land at the far end.',
        'THE ONE-QUESTION CHECK FOR THE CONFUSABLE PAIR: does the narrow strip lead to MORE LAND at its far end, or does it leave you surrounded by WATER there instead? More land at the far end names an isthmus. Water at the far end names a peninsula. A peninsula dead-ends in water. An isthmus connects two land areas and dead-ends in neither.',
        'COAST NAMES THE EDGE ITSELF, NOT A SHAPE MADE OF A CERTAIN NUMBER OF WATERY SIDES. A coast is simply the strip of land running right along an ocean or a sea, wherever land and salt water meet. Every piece of land that touches an ocean or a sea has a coast along that edge -- a mainland has one, a peninsula has one, and an island has one running all the way around it. Coast answers a different question than the other three words: not how much water surrounds the land, but simply where the land and the water meet.',
      ],
      vocabulary: [
        { term: 'island', definition: 'land with water on every side and no connection to any larger landmass.' },
        { term: 'peninsula', definition: 'land that reaches out into water and ends there, with water on most sides but still attached to a larger landmass on one side.' },
        { term: 'isthmus', definition: 'a narrow strip of land with water along its two long sides that connects two larger areas of land at its ends.' },
        { term: 'coast', definition: 'the strip of land running along the edge of an ocean or a sea, wherever land and salt water meet.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-run-the-routine-three-features',
      kind: 'worked_example',
      problem:
        'A mapmaker is describing a made-up region called Torvane. Read the three descriptions below -- there is no map, only the words. Name each landform.\n\n(1) A piece of land has water along its north, east, and south edges. On its west edge it is attached to the rest of Torvane, with no water breaking that connection.\n\n(2) A narrow piece of land has water running along its whole north edge and water running along its whole south edge. At its western end it widens into Torvane. At its eastern end it widens into a completely separate country called Ravelle.\n\n(3) A piece of land has water along every one of its edges. It is not attached to Torvane, to Ravelle, or to any other land at all.',
      steps: [
        'Take feature (1). Check the edge one direction at a time: north is water, east is water, south is water -- three sides are water. The remaining side, west, is not water; it stays joined to Torvane. Water on most sides, still attached on one: that matches PENINSULA.',
        'Take feature (2). Check the two long sides first: north is water for the whole length, and south is water for the whole length. Now check both ends: the western end widens into Torvane, and the eastern end widens into Ravelle, a separate, larger area of land. Water on both long sides, land at both ends: that matches ISTHMUS.',
        'Take feature (3). Check every edge: all of it is water, and no side connects to Torvane, Ravelle, or anywhere else. Water on every side, attached to nothing: that matches ISLAND.',
        'Check by rewinding each answer against its own description. Feature (1) cannot be an island, because the west edge is not water. It cannot be an isthmus, because only one side is attached to land, not two ends. Peninsula is the only definition left standing, and it fits every sentence given.',
        'Test a contrasting case so the isthmus/peninsula check is not overlearned on one example. Suppose a fourth narrow strip had water along both long sides, but its western end widened into Torvane while its eastern end simply ran out into open water with no land at all. One end leads to land; the other end leads only to water. That strip fails the isthmus test, because an isthmus needs land at both ends, not one. It passes the peninsula test instead: it is attached to a larger landmass on one side and ends in water everywhere else.',
      ],
      answer:
        '(1) is a peninsula, because water touches three of its sides while one side stays attached to Torvane. (2) is an isthmus, because it is a narrow strip with water along both long sides that widens into a separate, larger area of land at each end. (3) is an island, because water touches every edge and it is attached to nothing.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-correct-the-two-claims',
      kind: 'worked_example',
      problem:
        'A student writes: "A peninsula and an isthmus are really the same landform, since both are narrow strips of land with water next to them. Also, an island cannot have a coast, because a coast is only found on a mainland." Both sentences are wrong. Correct each one.',
      steps: [
        'Take the peninsula/isthmus claim first. WRONG: "a peninsula and an isthmus are the same, since both are narrow strips of land with water next to them." The mistake is noticing that both involve land next to water, then stopping before checking what sits at the far end.',
        'Run the one-question check on a peninsula: aside from the one attached side, does tracing the edge ever reach more land, or does it run into water every other way? It runs into water every other way -- there is no far end that leads to land.',
        'Run the same check on an isthmus: tracing either long side, does it run into water forever, or does it reach a separate area of land? It reaches a separate, larger area of land at the far end -- and there are two such ends, one on each long side.',
        'CORRECT: a peninsula dead-ends in water on every side but the one it is attached by. An isthmus dead-ends in neither direction, because it connects two land areas instead of ending at all.',
        'Now take the island/coast claim. WRONG: "an island cannot have a coast, because a coast is only found on a mainland." The mistake is treating coast as a fourth shape in the same list as island, peninsula, and isthmus, instead of a different question entirely.',
        'Check the coast definition against three different shapes. A mainland edge that meets an ocean has a coast there. A peninsula, since it also touches an ocean, has a coast running along its water-touching sides. An island, since water touches it on every side, has a coast running all the way around it. CORRECT: an island does have a coast -- in fact one that circles its whole edge, because coast simply names wherever land meets an ocean or a sea, not one particular shape.',
      ],
      answer:
        'A peninsula dead-ends in water on every side but one; an isthmus connects to more land at both ends, so the two are not the same landform. An island does have a coast -- water touches every side of it, so its coast runs all the way around, because coast names wherever land meets an ocean or a sea, not a specific shape.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-classify-the-narrow-strip',
      kind: 'try_yourself',
      problem:
        'A narrow strip of land has ocean water running along its whole northern edge and ocean water running along its whole southern edge. At its western end the strip widens into a large country. At its eastern end it widens into a different, separate country. What is this narrow strip of land called?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'An isthmus, because it is a narrow strip with water along both long sides that connects two separate, larger areas of land at its ends.', correct: true },
        { id: 'b', text: 'A peninsula, because water touches its long sides and one end of the strip stays joined to a country, the way a peninsula stays joined to a larger landmass.' },
        { id: 'c', text: 'An island, because water lies along both of its long edges with no dry land bordering it anywhere else, the way water surrounds an island on every side.' },
        { id: 'd', text: 'A coast, because it is a narrow piece of land sitting directly next to ocean water on two of its sides, which is exactly what a coastline is.' },
      ],
      expectedAnswer: 'An isthmus, because it is a narrow strip with water along both long sides that connects two separate, larger areas of land at its ends.',
      hints: [
        'Check what sits at each end of the strip, not just what runs along its sides.',
        'Both ends widen into a country -- one country at the west end, a different country at the east end. Land at both ends, not water, is the isthmus test.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-classify-the-three-sided-piece',
      kind: 'try_yourself',
      problem:
        'A piece of land has ocean water along its northern, eastern, and southern edges. On its western edge it is attached to a much larger area of land, with no water breaking that connection. What is this piece of land called?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'An isthmus, because part of its edge connects to a larger area of land, the same kind of land connection an isthmus has at each of its two ends.' },
        { id: 'b', text: 'A peninsula, because water touches three of its sides while it stays attached to a larger landmass on the remaining side.', correct: true },
        { id: 'c', text: 'An island, because water touches most of its edges, and an island is simply land with a great deal of water around it.' },
        { id: 'd', text: 'A coast, because water lies right next to part of its edge, which is exactly the boundary a coast is defined to be.' },
      ],
      expectedAnswer: 'A peninsula, because water touches three of its sides while it stays attached to a larger landmass on the remaining side.',
      hints: [
        'Count how many edges are water and check whether any edge is attached to more land instead.',
        'Three sides of water and one attached side, with no separate landmass at a far end, is the peninsula pattern, not the isthmus pattern.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-what-coast-really-names',
      kind: 'try_yourself',
      problem:
        'Which term names the strip of land right where it meets an ocean or a sea, no matter whether that land is part of a mainland, a peninsula, or an island?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Peninsula, since a peninsula is defined by exactly how much of its edge is touched by water on three of its four sides.' },
        { id: 'b', text: 'Isthmus, since an isthmus is defined by having water running along both of its long sides at the same time.' },
        { id: 'c', text: 'Island, since an island is the landform defined by having water touching it on every single side it has.' },
        { id: 'd', text: 'Coast, since coast names the edge itself wherever land meets an ocean or a sea, whatever shape the land happens to be.', correct: true },
      ],
      expectedAnswer: 'Coast, since coast names the edge itself wherever land meets an ocean or a sea, whatever shape the land happens to be.',
      hints: [
        'Three of these four words are defined by how much water surrounds the land. Ask which one is defined a different way.',
        'The correct term applies to a mainland, a peninsula, and an island all at once, rather than picking out one particular shape.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-same-strip-and-island-has-no-coast',
      kind: 'misconception_check',
      question:
        'A student says: "A peninsula and an isthmus are just two names for the same kind of narrow land, since both have water right next to them. Also, since an island is the landform most surrounded by water, an island and a coast must be the same thing too." What is wrong with each half of that?',
      commonErrors: [
        {
          answer: 'A peninsula and an isthmus are just two names for the same kind of narrow land, since both have water right next to them.',
          misconception:
            'Noticing that both landforms are narrow pieces of land next to water, and stopping the comparison there instead of checking what each strip is attached to at its far end.',
          correctsTo:
            'Water next to the land is true of both, but that is not the whole definition of either one. A peninsula reaches out into water and dead-ends there, attached to a larger landmass on only one side. An isthmus runs the opposite way: it has water along its two long sides, but at each end it widens into a separate, larger area of land, so it connects land to land instead of ending in water. WRONG: "a peninsula and an isthmus are the same because both have water beside them." CORRECT: "a peninsula ends in water on every side but one; an isthmus connects two land areas and does not end in water at either of its ends."',
        },
        {
          answer: 'Since an island is the landform most surrounded by water, an island and a coast must be the same thing too.',
          misconception:
            'Treating coast as one more landform in the same list as island, peninsula, and isthmus, instead of noticing that coast answers a completely different question.',
          correctsTo:
            'Island, peninsula, and isthmus are each defined by how much water touches the land and what the land connects to. Coast is not measured that way at all -- it simply names the strip of land right where land meets an ocean or a sea, whatever shape that land is. An island does have a coast: because water touches every side of an island, its coast runs all the way around it. Coast is not a rival to island; every island has one.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'All four words are defined by how much water touches a piece of land and what that land is attached to, not by size or by what is built on it.',
        'An island has water on every side and connects to no larger land at all.',
        'A peninsula has water on most of its sides but stays attached to a larger landmass on the remaining side -- trace its edge and you dead-end in water everywhere except that one attached side.',
        'An isthmus is a narrow strip with water along its two long sides, but at each end it widens into a separate, larger area of land -- trace either long side and you reach more land, never a dead end in water.',
        'The one-question check for the confusable pair: does the strip lead to more land at its far end (isthmus) or does it leave you surrounded by water there instead (peninsula)?',
        'Coast names the edge itself -- the strip of land wherever it meets an ocean or a sea -- and every piece of land that touches an ocean or a sea has one, mainland, peninsula, and island alike.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.2', cedTitle: 'Coastal & Connecting Landforms' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
