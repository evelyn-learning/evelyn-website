/**
 * Grade 6 Science (Earth & Space Science) — Plate Tectonics: Evidence for
 * Continental Drift.
 *
 * CONCEPT-LED, following the m6sci-u2-phases-of-the-moon.ts shape (NGSS
 * MS-ESS2-3). The student has no procedure to run here: the lesson builds one
 * historical argument out of four independent lines of evidence -- matching
 * coastlines, cross-continental fossils, matching rock layers, and
 * seafloor magnetic-stripe patterns -- and tells the real story of why that
 * argument was rejected for decades and then accepted.
 *
 * SCOPE GUARD: this plan analyzes four independent lines of evidence that
 * continents have moved, and the historical argument over accepting or
 * rejecting that claim. It deliberately stops short of the MECHANISM behind
 * the motion:
 *   - MANTLE CONVECTION and the lithosphere/asthenosphere structure that
 *     actually drives plate motion is row 4.2 (Earth's Plates & Mantle
 *     Convection) and is not explained anywhere in this file. Seafloor
 *     spreading is named strictly as an OBSERVATION -- new rock appears at a
 *     mid-ocean ridge and moves outward, carrying a magnetic record with it
 *     -- never as the effect of a stated driving force. The word "plate"
 *     never appears anywhere in the taught content of this lesson (only in
 *     this doc comment, and in the followUps array as part of the next
 *     row's loId); the evidence is framed the way Wegener and his
 *     contemporaries framed it, as continents moving, because the plate
 *     concept itself belongs to the next two rows.
 *   - PLATE BOUNDARY TYPES (convergent, divergent, transform) are row 4.3,
 *     and LANDFORMS built by plate motion are row 4.4. Neither appears here.
 *   - GRADE 7 LIFE SCIENCE boundary: fossils appear only as markers that a
 *     species existed in two now-separated places at the same time. Nothing
 *     in this file addresses why a species changed, adapted, or went
 *     extinct, and no evolutionary language is used anywhere.
 *   - GRADE 8 PHYSICAL SCIENCE boundary: Earth's magnetic field reversing
 *     over time is stated as an observed pattern used to date rock, never
 *     explained by a physical mechanism. No wave, particle, or
 *     force-calculation content appears; the one force discussion (tidal
 *     forces as a rejected explanation) stays at "shown too weak," with no
 *     calculation shown.
 *   - LOCALITY CARE: every FOSSIL and ROCK-LAYER location claim in this file
 *     names only a continent or a broad region (South America, southern
 *     Africa, India, Australia, Antarctica), never a coastline or a specific
 *     site. Evidence 1 (the coastline fit) is the one deliberate exception,
 *     because that evidence type is itself a claim about coastline shape --
 *     it is described only as a general shape match (Brazil's eastern bulge
 *     into the curve of Africa's coast near the Gulf of Guinea) and is never
 *     tied to a fossil or rock-layer site. A sibling geography course made
 *     exactly the fossil-site error on this exact content, describing a
 *     Mesosaurus fossil site as "on the coast of" South America when the
 *     actual site is inland; no fossil or rock-layer claim in this file is
 *     more precise than region-level.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every
 * coastline, fossil range, rock sequence, and stripe pattern here is
 * written out in words, and every item is solvable from the text printed
 * inside it. Never write "see the map above."
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6SCI_U4_EVIDENCE_FOR_CONTINENTAL_DRIFT: LessonPlan = {
  id: 'evelyn.ms.m6sci.evidence-for-continental-drift.v1',
  title: 'Evidence for Continental Drift',
  curriculum: 'MS',
  grade: '6',
  subject: 'science',
  topic: 'grade-6-earth-space-science',
  locale: 'en',
  los: [
    {
      id: 'm6sci.evidence-for-continental-drift',
      standard: 'M6SCI-4.1',
      description:
        'Analyze matching coastlines, cross-continental fossil distributions, matching rock layers, and seafloor magnetic-stripe patterns as independent lines of evidence that continents have moved over time (NGSS MS-ESS2-3).',
    },
  ],
  prerequisites: ['m6sci.the-rock-cycle'],
  followUps: ['m6sci.earths-plates-and-mantle-convection'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Start from a puzzle the student can picture without any equipment, and set up the missing piece of the argument.',
      script:
        'Picture a world map in your head. Now imagine cutting South America and Africa out of it, right along their coastlines, and sliding South America toward Africa. The bulging eastern edge of South America comes surprisingly close to fitting into the curve of Africa\'s western coastline, like two pieces of the same jigsaw puzzle that got pulled apart. That one observation helped launch one of the biggest arguments in the history of science. Over a hundred years ago, a scientist proposed that the continents used to be joined together in a single landmass, and that they have been drifting apart ever since. Almost nobody believed him at the time. He was not wrong about his evidence. He was missing one piece of the argument, and today we go looking for exactly what that piece was.',
      suggestedTools: ['show_map'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-evidence-for-drift',
      kind: 'concept',
      goal: 'Build the four-part evidence case for continental drift, and tell the real history of why the idea was rejected and then accepted.',
      keyIdeas: [
        'A CONTINENT-SIZED PUZZLE. In 1912, a scientist named Alfred Wegener proposed that all of Earth\'s continents were once joined together in a single landmass, which he called Pangaea, and that they have been slowly drifting apart ever since. That idea is called continental drift. Wegener was not guessing at random -- he built his case out of several separate kinds of evidence, each one pointing the same direction on its own.',
        'EVIDENCE 1: THE COASTLINES FIT. The eastern coastline of South America and the western coastline of Africa are shaped like two pieces of the same jigsaw puzzle: the bulge of Brazil fits into the curve of the African coast near the Gulf of Guinea. A coastline shape is not something that should match by accident between two continents thousands of kilometers apart, unless the two continents were once joined.',
        'EVIDENCE 2: MATCHING FOSSILS ON SEPARATED CONTINENTS. Fossils of several land and freshwater organisms turn up on continents that an ocean now separates, even though none of those organisms could have made the crossing themselves. Mesosaurus, a small reptile that lived only in fresh water, is found in matching-age rock in South America and in southern Africa. Glossopteris, a seed fern whose seeds were too heavy to be carried far by wind, is found across South America, southern Africa, India, Australia, and Antarctica. Lystrosaurus and Cynognathus, two land animals that could not swim an ocean, each turn up on more than one continent that an ocean now separates. An organism that cannot cross an ocean, found on both sides of one, is evidence the ocean was not always there.',
        'EVIDENCE 3: MATCHING ROCK LAYERS. Sequences of rock layers, in the same order and of the same age, appear in regions of South America and in regions of southern Africa. A rock layer records the conditions that were present when it formed, so the same sequence forming in two regions that are now far apart is another sign those regions were once side by side.',
        'EVIDENCE 4: THE SEAFLOOR\'S OWN RECORD. Decades after Wegener, scientists mapping the floor of the Atlantic Ocean found something new. As certain minerals in seafloor rock cool and harden, they lock in a record of which way Earth\'s magnetic field pointed at that moment, and that field has flipped direction many times over Earth\'s history. Near a mid-ocean ridge, a long undersea mountain range, the resulting stripe pattern on one side is a mirror image of the pattern on the other side. That mirror image means new rock is being added at the ridge and moving outward in both directions over time -- the ocean floor itself is spreading.',
        'THE MISSING PIECE, AND WHY IT MATTERED. Wegener\'s coastline, fossil, and rock-layer evidence held up. What did not hold up were his own guesses about WHAT could possibly move something as massive as a continent -- he pointed to forces such as the pull of the sun and moon, and other scientists correctly calculated that those forces were far too weak. For decades, most scientists rejected continental drift for exactly that reason: solid evidence that continents had moved, with no believable explanation of how. The mirror-image seafloor stripes, discovered long after Wegener died in 1930, did not by themselves explain what causes continents to move -- that is a separate lesson -- but they showed, directly, that the ocean floor is created and moves. That was the missing piece that finally turned a rejected idea into an accepted one.',
      ],
      vocabulary: [
        { term: 'continental drift', definition: 'the idea that Earth\'s continents have moved across the surface of the planet over long spans of time.' },
        { term: 'Pangaea', definition: 'the name Wegener gave to the single, joined landmass he proposed the continents were once part of.' },
        { term: 'mid-ocean ridge', definition: 'a long undersea mountain range where new ocean floor rock forms.' },
        { term: 'magnetic stripe pattern', definition: 'a mirror-image pattern of alternating magnetic direction recorded in seafloor rock on either side of a mid-ocean ridge.' },
        { term: 'seafloor spreading', definition: 'new ocean floor forming at a mid-ocean ridge and moving outward over time.' },
      ],
      suggestedTools: ['show_map', 'show_diagram'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-fossil-evidence',
      kind: 'worked_example',
      problem:
        'Fossils of Mesosaurus, a reptile that lived only in fresh water and was far too weak a swimmer to cross open ocean, are found in matching-age rock in South America and in southern Africa -- continents that today sit on opposite sides of the Atlantic Ocean. Explain why this fossil pattern is evidence that the two continents were once joined, rather than evidence that Mesosaurus crossed the ocean by some other means.',
      steps: [
        'Start with what Mesosaurus could and could not do. It lived only in fresh water, and it was not built for a long ocean swim. A creature like that cannot cross a wide, salty ocean on its own.',
        'Now look at where its fossils turn up: in matching-age rock in South America and in southern Africa, continents an ocean currently separates by thousands of kilometers.',
        'If Mesosaurus could not make that crossing, and nothing else obviously carried it across, the simplest explanation is that the crossing did not exist yet -- the two landmasses were joined, or close enough together, for Mesosaurus to reach both without ever entering open ocean.',
        'Check that against other, different kinds of evidence rather than trusting one fossil alone. Glossopteris, a seed fern with seeds too heavy to blow far on the wind, shows the same separated-but-matching pattern across five present-day continents -- a different kind of organism, same conclusion. Sequences of rock layers, which are not living things at all, also match across the same two continents. Three different kinds of clue -- a freshwater reptile, a heavy-seeded plant, and a nonliving rock sequence -- all point to the same joined-continents answer.',
        'Now change one condition and check that the answer moves the way it should. Suppose Mesosaurus had instead been a strong, fast swimmer capable of crossing thousands of kilometers of open salt water. Finding its fossils on both continents would then say nothing about whether the continents were ever joined -- it would simply mean Mesosaurus swam there. The evidence only works because the animal specifically could not have made the trip itself. That is what makes it evidence, not just an interesting coincidence.',
      ],
      answer:
        'The fossil pattern is evidence that South America and southern Africa were once joined, or close enough together for Mesosaurus to move between them without crossing open ocean, because a freshwater animal too weak to survive that ocean crossing has no other way of reaching both continents.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-seafloor-and-the-missing-mechanism',
      kind: 'worked_example',
      problem:
        'Scientists mapping the floor of the Atlantic Ocean near the Mid-Atlantic Ridge find that the pattern of magnetic stripes recorded in the rock is a mirror image: the same sequence of stripes appears on the ridge\'s western side and again, in reverse order, on its eastern side. Explain what that mirrored pattern shows, and why this particular evidence succeeded in convincing scientists that continents move, when Wegener\'s original coastline, fossil, and rock-layer evidence had not been enough.',
      steps: [
        'Start with what a magnetic stripe records. As certain minerals in seafloor rock cool and harden, they lock in the direction of Earth\'s magnetic field at that moment, and that field has flipped direction many times over Earth\'s history. So a strip of seafloor rock carries a permanent record of which way the field pointed when that rock formed.',
        'A mirror-image pattern on both sides of the ridge means rock at the same distance from the ridge, on either side, carries the same magnetic record and formed at the same time.',
        'The simplest way to produce that pattern is if new rock keeps forming right at the ridge and gets pushed outward on both sides as more rock forms behind it -- so rock right at the ridge is the youngest, and rock farther from the ridge on either side is older, in matching pairs. That means the ocean floor itself is not fixed. It is being created at the ridge and is spreading outward over time.',
        'WRONG: "Wegener\'s proposal was rejected because his coastline, fossil, and rock-layer evidence was mistaken." CORRECT: that evidence held up over time and was never disproven. What was missing was a believable answer to a different question -- what could possibly move something as massive as a continent -- and Wegener\'s own guesses about that cause, such as tidal forces, were shown by calculation to be far too weak.',
        'The mirror-image seafloor pattern succeeded where the earlier evidence had not because it did something the coastline, fossil, and rock-layer evidence could not: it showed the ocean floor itself being made and moving, in rock scientists could directly measure and date, decades after Wegener died in 1930 without seeing his idea accepted.',
        'Run the two checks a science answer needs, since there is no arithmetic to redo here. First, look for clues of different kinds that agree: the mirrored stripe pattern itself, the separate fact that rock farther from the ridge is measurably older than rock close to it, and the historical fact that this new evidence lined up with the coastline, fossil, and rock-layer evidence collected decades earlier. Three different kinds of clue, one answer. Second, change one condition and check that the answer moves with it: if the stripe pattern on the two sides of the ridge did NOT mirror each other, and looked random instead, there would be no reason to conclude the seafloor spreads outward from the ridge at all, and this piece of evidence would not exist.',
      ],
      answer:
        'The mirrored stripe pattern shows that new ocean floor forms at the ridge and spreads outward on both sides over time, so the ocean floor itself moves. That succeeded in convincing scientists because it gave them something Wegener never had: direct, measurable evidence that the seafloor is created and in motion, rather than only evidence that continents once fit together.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-fossil-evidence',
      kind: 'try_yourself',
      problem:
        'Fossils of Mesosaurus, a reptile that lived only in fresh water and was far too weak a swimmer to cross open ocean, are found in matching-age rock layers in South America and in southern Africa, continents now separated by the Atlantic Ocean. What is the best explanation for this pattern?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The two fossils only look alike by coincidence, because separate species that live in similar wet habitats can end up looking similar without being the same species at all.' },
        { id: 'b', text: 'South America and southern Africa were joined, or close enough together, that Mesosaurus could move between them through connected fresh water without ever entering open ocean.', correct: true },
        { id: 'c', text: 'Mesosaurus was able to survive occasional short crossings of salt water, because a freshwater animal can sometimes tolerate brief exposure to the ocean that would kill it over a longer swim.' },
        { id: 'd', text: 'Strong ocean winds carried Mesosaurus eggs from one continent to the other, because eggs laid near open water could plausibly be swept out to sea and carried across before they hatched.' },
      ],
      expectedAnswer: 'South America and southern Africa were joined, or close enough together, that Mesosaurus could move between them through connected fresh water without ever entering open ocean.',
      hints: [
        'Start with what Mesosaurus could actually do. It lived in fresh water and could not survive a long swim through open, salty ocean. Does that rule out any of the choices right away?',
        'If Mesosaurus could not cross the ocean itself, and nothing carried it across, what would have to be true about where South America and southern Africa were sitting at the time it was alive?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-rock-layer-evidence',
      kind: 'try_yourself',
      problem:
        'The same distinctive sequence of rock layers, in the same order and of the same age, is found today in a region of South America and in a region of southern Africa -- continents that the Atlantic Ocean now separates. Which explanation best accounts for the matching sequence?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The layers formed independently on each continent, because sedimentary rock forms in similar-looking bands almost anywhere on Earth, so a matching sequence does not really need an explanation.' },
        { id: 'b', text: 'Ocean currents carried loose sediment across the Atlantic from one continent to the other, depositing the same sequence of layers on each side in the same order.' },
        { id: 'c', text: 'The two regions were part of one continuous stretch of land when the layers formed, and have since moved apart into the separated positions they occupy today on opposite sides of the Atlantic Ocean.', correct: true },
        { id: 'd', text: 'Both continents independently experienced the exact same sequence of volcanic eruptions and climate changes at the exact same times, purely by coincidence.' },
      ],
      expectedAnswer: 'The two regions were part of one continuous stretch of land when the layers formed, and have since moved apart into the separated positions they occupy today on opposite sides of the Atlantic Ocean.',
      hints: [
        'A rock layer records the conditions in one place at one time. Think about how likely it is for two separate places to end up with the exact same order of layers, of the exact same ages, purely by chance.',
        'If two regions show an identical layer sequence, what is the simplest way for that sequence to have formed once, in one place, rather than twice, independently, in two different places?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-wegener-rejection',
      kind: 'try_yourself',
      problem:
        'Alfred Wegener proposed in 1912 that the continents had once been joined and had since drifted apart, citing matching coastlines, matching fossils, and matching rock layers as his evidence. Most scientists at the time rejected his proposal anyway. What was the central reason for that rejection?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Later expeditions returned to Wegener\'s fossil sites and could not find the fossils he had originally described there, so scientists concluded his matching-fossil evidence had been mistaken all along.' },
        { id: 'b', text: 'The world maps available in 1912 were not accurate enough to show that the coastlines of South America and Africa really lined up, so scientists had no reliable way to confirm Wegener\'s claimed match.' },
        { id: 'c', text: 'Other scientists had already collected fossil and rock evidence of their own that directly contradicted Wegener\'s matching layers, leaving two incompatible records that could not both be correct.' },
        { id: 'd', text: 'Wegener could not identify a plausible physical cause capable of moving something as massive as a continent, and the specific causes he guessed at, such as tidal forces, were shown by calculation to be far too weak.', correct: true },
      ],
      expectedAnswer: 'Wegener could not identify a plausible physical cause capable of moving something as massive as a continent, and the specific causes he guessed at, such as tidal forces, were shown by calculation to be far too weak.',
      hints: [
        'The question states that Wegener\'s evidence held up. So the rejection did not come from the coastlines, fossils, or rock layers themselves. What kind of question about his proposal was still unanswered?',
        'Having evidence that something happened is different from having an explanation of how it happened. What was Wegener missing on the "how" side, and what went wrong when he tried to guess at it?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-rejected-for-being-wrong',
      kind: 'misconception_check',
      question:
        'A student writes: "Wegener\'s idea about continental drift was rejected because his evidence -- the matching coastlines, fossils, and rock layers -- turned out to be wrong, and the matching magnetic stripes on the seafloor just mean both sides of the ocean formed at exactly the same time." Two different things are wrong in that sentence. What are they?',
      commonErrors: [
        {
          answer: 'Wegener\'s idea was rejected because his evidence was wrong.',
          misconception:
            'Assuming a rejected scientific idea must have been rejected because its evidence was bad, when the actual reason concerned a different part of the argument entirely.',
          correctsTo:
            'Wegener\'s coastline, fossil, and rock-layer evidence held up over time and was never shown to be false. What got continental drift rejected for decades was that Wegener could not explain a believable physical cause for the motion -- what could possibly move something as massive as a continent -- and the causes he did guess at, such as tidal forces, were shown by calculation to be far too weak. The evidence was solid; the explanation of the cause was missing.',
        },
        {
          answer: 'The matching magnetic stripes just mean both sides of the ocean formed at exactly the same time.',
          misconception:
            'Reading a mirror-image pattern as meaning everything formed all at once, instead of as a record of rock ages that increase with distance from the ridge.',
          correctsTo:
            'The mirror-image pattern means rock at the same distance from the ridge, on either side, formed at the same time and carries the same magnetic record -- not that the whole ocean floor formed at once. Rock right at the ridge is the youngest; rock farther from the ridge, on either side, is progressively older, because new rock keeps forming at the ridge and spreads outward over a very long span of time.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Wegener proposed in 1912 that the continents were once joined in a single landmass, which he called Pangaea, and have since drifted apart.',
        'Matching coastline shapes, such as the fit between South America and Africa, were one of his first clues.',
        'Matching fossils -- Mesosaurus, Glossopteris, Lystrosaurus, and Cynognathus -- found on continents an ocean now separates, in organisms that could not have crossed that ocean on their own, are strong evidence the continents were once joined.',
        'Matching sequences of rock layers, in the same order and of the same age, found on separated continents point to the same conclusion.',
        'Wegener\'s evidence held up. What got his proposal rejected for decades was that he could not explain a plausible physical cause for continental motion, and the causes he guessed at, such as tidal forces, were shown to be far too weak.',
        'Decades later, scientists mapping the ocean floor found mirror-image magnetic stripe patterns on either side of mid-ocean ridges, showing that new ocean floor forms at the ridge and spreads outward over time.',
        'That seafloor evidence, discovered after Wegener died in 1930, is what finally persuaded scientists that continents really do move.',
        'Four different kinds of evidence -- coastlines, fossils, rock layers, and the seafloor\'s magnetic pattern -- together made a case no single line of evidence could have made alone.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.1', cedTitle: 'Evidence for Continental Drift' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
