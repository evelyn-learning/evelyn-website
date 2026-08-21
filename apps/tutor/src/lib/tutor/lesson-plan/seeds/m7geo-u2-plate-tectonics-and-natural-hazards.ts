/**
 * Grade 7 World Geography -- Physical Geography: Plate Tectonics & Natural Hazards.
 *
 * Concept-led row 2.2 (National Geography Standard 7). Teaches the three
 * plate-boundary types and what each one builds, and then the GEOGRAPHIC
 * payoff: hazard zones are not scattered at random, they follow plate edges,
 * which is why some regions plan for shaking and others never think about it.
 * It closes on the hazard-versus-disaster distinction.
 *
 * NOTE FOR FUTURE AUTHORS: this row is a magnet for numbers that do not
 * belong here. No plate speeds, no earthquake magnitudes, no casualty
 * figures, no dates, and NO named recent disaster. Real places appear only
 * as long-settled physical facts -- the Ring of Fire, the Himalayas, the
 * Mid-Atlantic Ridge, the East African Rift, the Andes, the San Andreas
 * Fault. Hazard types are described generically. Keep it that way: a real
 * event described loosely is a real community described loosely.
 *
 * There are also NO MAPS AND NO IMAGES in this course. Every boundary
 * arrangement is described in words, and every item is solvable from the
 * words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7GEO_U2_PLATE_TECTONICS_AND_NATURAL_HAZARDS: LessonPlan = {
  id: 'evelyn.ms.m7geo.plate-tectonics-and-natural-hazards.v1',
  title: 'Plate Tectonics & Natural Hazards',
  curriculum: 'MS',
  grade: '7',
  subject: 'social-studies',
  topic: 'grade-7-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm7geo.plate-tectonics-and-natural-hazards',
      standard: 'M7GEO-2.2',
      description:
        'Describe how the moving plates of the outer shell of Earth build landforms at convergent, divergent and transform boundaries, explain why earthquake and volcano zones cluster along those boundaries instead of occurring at random, and distinguish a natural hazard from a disaster (National Geography Standard 7: the physical processes that shape the patterns of the surface of Earth).',
    },
  ],
  prerequisites: ['m7geo.landforms-and-water-features'],
  followUps: ['m7geo.weather-climate-and-factors'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Open on the fact that hazard preparation differs from place to place, so the student wants to know what decides it.',
      script:
        'Some students practice an earthquake drill at school. They know exactly where to go and what to get under. Other students have never done one, and would be baffled if you asked. Neither school is being careless. They are in different places, and the ground under them behaves in different ways. The surface of Earth is not one solid shell. It is broken into enormous slabs, and those slabs are moving. Where their edges meet, the ground builds mountains, opens valleys and shakes. Today you find out where those edges are, and why that answers the drill question.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-boundaries-and-hazard-zones',
      kind: 'concept',
      goal: 'Install the three boundary types with what each one produces, then the hazard-zone pattern and the hazard-versus-disaster distinction.',
      keyIdeas: [
        'THE OUTER SHELL OF EARTH IS BROKEN INTO PLATES, AND THE PLATES MOVE. Think of a cracked eggshell, except each piece is big enough to carry a continent or an ocean floor. The pieces slide on hotter, softer rock underneath. The movement is far too slow for anyone to feel it, but over a very long time it rearranges the surface of the planet. Almost all of the action happens at the EDGES, where one plate meets another. Those edges are called plate boundaries, and there are three kinds.',
        'CONVERGENT BOUNDARY -- THE PLATES MOVE TOWARD EACH OTHER. Something has to give. Where two plates carrying continents press together, neither one sinks easily, so the rock crumples upward into high mountains. The Himalayas sit on a boundary like that. Where a plate carrying ocean floor meets another plate, the ocean plate is pushed underneath, which carves a deep ocean trench and feeds volcanoes on the plate above. The Andes, running down the western edge of South America, sit on a boundary like that. Convergent boundaries produce mountains, trenches, volcanoes and strong earthquakes.',
        'DIVERGENT BOUNDARY -- THE PLATES MOVE APART. A gap opens, hot rock rises to fill it, and brand-new crust is added. Under an ocean this builds a long underwater mountain chain called a mid-ocean ridge, and the ocean slowly gets wider. The Mid-Atlantic Ridge runs down the middle of the Atlantic Ocean and does exactly that. On land the same pulling-apart drops a long steep-sided valley called a rift valley, which is what is happening along the East African Rift.',
        'TRANSFORM BOUNDARY -- THE PLATES SLIDE PAST EACH OTHER SIDEWAYS. Nothing is built and nothing sinks, so no new crust is made and no chain of volcanoes lines up along it. But the two slabs do not glide smoothly. They lock together, pressure builds, and they suddenly jolt free. That jolt is an earthquake. The San Andreas Fault in California is a transform boundary.',
        'HAZARD ZONES ARE NOT RANDOM -- THEY FOLLOW THE BOUNDARIES. If you marked every recorded earthquake and every active volcano on a globe, the marks would not spread evenly. They would draw long belts, and the belts would trace the edges of the plates. The most famous of them is the Ring of Fire, a zone around the rim of the Pacific Ocean where earthquakes and volcanic eruptions are frequent. This is the geography that matters: the pattern is predictable enough that a region can know it lives in a hazard zone, and plan.',
        'A NATURAL HAZARD IS NOT THE SAME THING AS A DISASTER. The hazard is the natural event itself -- ground shaking, an eruption, a flood, a powerful storm. Whether that event becomes a disaster depends on people: what has been built there, how it was built, whether there is a warning system, and whether anyone has practiced what to do. Two places can be shaken in similar ways and end up in completely different situations. WRONG: "An earthquake is a disaster." CORRECT: "An earthquake is a hazard. It becomes a disaster when it meets buildings and communities that were not ready for it."',
      ],
      vocabulary: [
        { term: 'plate', definition: 'one of the huge slabs that the rigid outer shell of Earth is broken into.' },
        { term: 'plate boundary', definition: 'the edge where two plates meet.' },
        { term: 'convergent boundary', definition: 'a boundary where two plates move toward each other.' },
        { term: 'divergent boundary', definition: 'a boundary where two plates move apart and new crust forms.' },
        { term: 'transform boundary', definition: 'a boundary where two plates slide past each other sideways.' },
        { term: 'natural hazard', definition: 'a natural event, such as ground shaking or an eruption, that could harm people or property.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-name-the-boundary',
      kind: 'worked_example',
      problem:
        'Three places are described below in words. Name the boundary type at each one, and say what the description tells you.\n\nPlace 1: A long chain of underwater mountains runs down the middle of an ocean. New rock is being added along the chain, and the ocean is slowly getting wider.\n\nPlace 2: An extremely high mountain range stands where two plates, both carrying land, are pressing into each other. The rock there is folded and buckled, and earthquakes are common.\n\nPlace 3: A long crack crosses the land. The ground on one side is creeping past the ground on the other side. Earthquakes are common along the crack, but no chain of volcanoes follows it and no new rock is forming.',
      steps: [
        'For every one of these, ask the same first question: which way are the two plates moving relative to each other -- toward, apart, or past?',
        'Place 1 says new rock is being added and the ocean is getting wider. Adding new crust only happens where a gap opens, so the plates are moving APART. That is a DIVERGENT boundary, and an underwater mountain chain built that way is a mid-ocean ridge. The Mid-Atlantic Ridge is a real example.',
        'Place 2 says two plates carrying land are pressing into each other. That is TOWARD, so the boundary is CONVERGENT. Neither plate sinks easily because both carry continental rock, so the rock crumples upward instead. That is how the Himalayas were raised.',
        'Place 3 says the ground on one side is creeping past the ground on the other. That is PAST, so the boundary is TRANSFORM. Check the two extra clues, because they confirm it: no new rock is forming, which rules out divergent, and no volcano chain follows the crack, which is what you would expect if a plate were sinking at a convergent boundary. The San Andreas Fault in California is a real example.',
        'Notice the shortcut you just used three times. You never needed a picture. The direction of motion is the whole answer, and each description hands it to you either directly or through the landform it produced.',
      ],
      answer:
        'Place 1 is a divergent boundary, seen as a mid-ocean ridge. Place 2 is a convergent boundary between two plates carrying continents, seen as a high folded mountain range. Place 3 is a transform boundary, seen as a fault with frequent earthquakes but no new crust and no line of volcanoes.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-hazard-versus-disaster',
      kind: 'worked_example',
      problem:
        'A student asks two questions at once: "If earthquakes can happen anywhere, why do some cities practice drills and other cities never do? And how can two cities be shaken in similar ways and end up so differently?" Answer both.',
      steps: [
        'Take the first question. Test the assumption inside it. Earthquakes are not scattered evenly over the globe. Plotted on a globe, they draw long belts that follow plate boundaries -- the Ring of Fire around the rim of the Pacific Ocean is the best-known belt.',
        'So the honest version is this: earthquakes are possible over a wide area, but they are FAR more frequent near plate boundaries. A city sitting on or near a boundary can expect shaking. A city near the middle of a plate, far from any boundary, can expect it to be rare.',
        'That answers the drill question. A city plans for what its location makes likely. Drills, building rules and warning systems are a response to a pattern, not to random bad luck. This is a geographic argument: WHERE a place is, on the plate map, predicts what it must prepare for.',
        'Now the second question, and it turns on one distinction. The shaking itself is the NATURAL HAZARD. It is a natural event and nobody controls it.',
        'Whether that hazard turns into a DISASTER depends entirely on what it meets. Were the buildings designed to sway instead of collapse? Were there rules requiring that, and were they followed? Is there a warning system? Has anyone practiced? Are there hospitals and roads that keep working afterward?',
        'That is why the results differ. WRONG: "The second city was hit harder, so the earthquake there must have been stronger." CORRECT: "A similar hazard met a different level of preparation, and the damage followed the preparation." Reasoning backward from damage to the size of the event is the mistake to avoid.',
      ],
      answer:
        'Cities practice drills when their location, near a plate boundary, makes shaking likely -- earthquakes cluster in belts along boundaries rather than occurring evenly everywhere. Two cities differ because the earthquake is only the natural hazard; it becomes a disaster in proportion to what people built and how prepared they were.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-name-the-boundary',
      kind: 'try_yourself',
      problem:
        'Two plates are moving toward each other. Both of them carry continental rock, so neither one sinks beneath the other. What is most likely to form where they meet?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A mid-ocean ridge, where new crust is added along a chain' },
        { id: 'b', text: 'A rift valley that keeps getting wider' },
        { id: 'c', text: 'A long crack where the two plates slide past each other sideways' },
        { id: 'd', text: 'A high mountain range, pushed up where the rock crumples', correct: true }
      ],
      expectedAnswer: 'A high mountain range, pushed up where the rock crumples',
      hints: [
        'Start with the direction. These plates are moving TOWARD each other, so name that boundary type first, then ask what it builds.',
        'Ridges and rift valleys are both built by plates moving APART, and sliding sideways is a third boundary type altogether. Only one choice is left.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-hazard-pattern',
      kind: 'try_yourself',
      problem:
        'A geographer marks the location of every earthquake recorded over many years onto a globe. What pattern is she most likely to see?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The marks are spread evenly across the whole globe' },
        { id: 'b', text: 'The marks form long belts that follow the edges of the plates', correct: true },
        { id: 'c', text: 'The marks gather in the centers of the largest continents, far from any plate edge' },
        { id: 'd', text: 'The marks gather near the equator and thin out toward the poles' }
      ],
      expectedAnswer: 'The marks form long belts that follow the edges of the plates',
      hints: [
        'Almost all of the movement between plates happens in one place. Where is it?',
        'One of these choices describes a climate pattern rather than a tectonic one. Distance from the equator does not decide where plates meet.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-hazard-or-disaster',
      kind: 'try_yourself',
      problem:
        'Two towns sit near the same fault, and each is shaken by an earthquake of similar strength. In the first town, buildings were designed to sway without collapsing and everyone has practiced what to do. In the second, buildings were not designed for shaking and nobody has practiced. The second town is badly damaged and the first is not. Which statement best explains the difference?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The second town must have had a stronger earthquake, because more damage happened there' },
        { id: 'b', text: 'The first town cannot really be near a plate boundary, because nothing was damaged' },
        {
          id: 'c',
          text: 'The earthquake is the natural hazard, and how much damage it causes depends on what people built and how prepared they were',
          correct: true,
        },
        { id: 'd', text: 'Every natural hazard becomes a disaster, so both towns had disasters of the same size' }
      ],
      expectedAnswer:
        'The earthquake is the natural hazard, and how much damage it causes depends on what people built and how prepared they were',
      hints: [
        'The problem already tells you the two earthquakes were of similar strength. So the explanation cannot be the earthquake itself.',
        'Separate the natural event from what the event runs into. One of those two things was different in the two towns, and the problem states it plainly.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-speed-and-linkage',
      kind: 'misconception_check',
      question:
        'A student says: "Plate movement must be something you can feel, and anyway volcanoes and earthquakes have nothing to do with each other -- they are just two separate kinds of bad luck." What is wrong with each half of that?',
      commonErrors: [
        {
          answer: 'If the plates are moving, we should be able to feel them moving.',
          misconception:
            'Assuming that motion large enough to build mountains must be fast enough to notice, so either the plates are still or we would feel them.',
          correctsTo:
            'The plates creep. The movement over a whole year is roughly the kind of distance a fingernail grows in a year, which is nothing you could ever sense standing on the ground. What you CAN feel is not the steady creep but the sudden release: at a locked boundary, the two plates jam, pressure builds for a long time, and then they jolt free all at once. That jolt is the earthquake. WRONG: "We would feel the plates moving." CORRECT: "The steady movement is far too slow to feel; the sudden slip that ends a long jam is what we feel."',
        },
        {
          answer: 'Volcanoes and earthquakes are unrelated events that just happen in random places.',
          misconception:
            'Treating each hazard as its own separate accident, and missing that both are produced by the same process at the same edges.',
          correctsTo:
            'Both are produced by plates interacting, so both cluster in the same places -- along plate boundaries. That is exactly why one zone can be known for both at once: the Ring of Fire, around the rim of the Pacific Ocean, is a belt of frequent earthquakes AND frequent volcanic eruptions, and it follows plate edges. They are not the same event and one does not simply cause the other, but they share a cause, which is why they share a map. WRONG: "Two unrelated kinds of bad luck." CORRECT: "Two different results of the same plate boundaries, which is why they appear in the same belts."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The rigid outer shell of Earth is broken into moving plates, and nearly everything happens at their edges.',
        'Convergent means moving toward: mountains, deep ocean trenches, volcanoes and strong earthquakes.',
        'Divergent means moving apart: mid-ocean ridges under the sea and rift valleys on land, with new crust forming.',
        'Transform means sliding past: earthquakes, but no new crust and no volcano chain.',
        'Earthquake and volcano zones are not random. They form belts along plate boundaries, such as the Ring of Fire around the rim of the Pacific Ocean, which is why some regions plan for them and others do not.',
        'A natural hazard is the event; a disaster is what happens when that event meets buildings and communities that were not prepared.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.2', cedTitle: 'Plate Tectonics & Natural Hazards' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
