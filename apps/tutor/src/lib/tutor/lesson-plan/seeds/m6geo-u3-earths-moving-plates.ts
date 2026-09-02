/**
 * Grade 6 World Geography — Earth's Physical Structure: Earth's Moving Plates.
 *
 * CONCEPT-LED exemplar for the m6geo fan-out (National Geography Standard 7).
 * The student has no procedure to run here, so the whole lesson installs one
 * picture: Earth's outer shell is not one unbroken skin, it is broken into
 * large pieces that move very slowly, and long ago those pieces carried
 * today's continents in one joined landmass. Two traps this plan is built to
 * kill: believing the plates float on an ocean of liquid rock, and believing
 * only the continents move while the ocean floor stays still.
 *
 * SCOPE GUARD: this row says THAT the crust is broken into moving plates and
 * THAT the continents were once joined. It names NO kind of plate edge. The
 * three plate-boundary types (convergent, divergent, transform), what each one
 * builds, and the hazard-versus-disaster distinction are Grade 7
 * (`m7geo-u2-plate-tectonics-and-natural-hazards.ts`) and must not appear
 * here. Two things ARE deliberately allowed, because the neighboring Grade 7
 * row sits close and the line has to be drawn precisely rather than avoided:
 * (a) naming that earthquakes and volcanoes cluster ALONG plate edges, which
 * is a locating fact, not a mechanism -- WHICH kind of edge produces WHICH
 * result is never said; and (b) saying in the misconception check that the
 * Atlantic opened as the plates carrying South America and Africa moved
 * apart, which is the once-joined-then-drifted fact of this row restated for
 * the sea floor, with no boundary type named and no process explained.
 *
 * DEPTH CEILING NOTE FOR THE FAN-OUT: read every keyIdea below and notice what
 * is missing. There is no closed typology, no explanation of what drives the
 * plates, and nothing the student must reason through more than one step at a
 * time. That plainness is deliberate and is the single thing this course is
 * held to. Grade 6 sentences are supposed to look too simple next to the
 * Grade 7 file on the same subject.
 *
 * ANSWER-CUE NOTE: the three MCQs below are written against deferred finding
 * DF-3 (in the shipped Grade 7 Geography bank the keyed answer was the
 * strictly longest choice 67% of the time). Every distractor here states a
 * full wrong reason rather than a short wrong label. Measured: the correct
 * choice is the strictly longest in NONE of the three items (the rule allows
 * at most one). Ranked by character count within each item, the correct choice
 * comes fourth, second and fourth of four, and the three correct choices sit
 * at ids c, a and d -- which is the id set `(3 + 2) mod 4 = 1` requires,
 * omitting b.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 3.1 -> 3.2 ->
 * 3.3, but rows 3.1 and 3.3 are authored in the fan-out that follows this
 * commit. `lint-ms-plans` rejects a prerequisite/followUp that does not
 * resolve to a registered LO, so both arrays stay empty until the full 40-row
 * batch lands and the controller wires the chain. Do NOT copy the empty
 * arrays into your own file.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every item is solvable from
 * the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6GEO_U3_EARTHS_MOVING_PLATES: LessonPlan = {
  id: 'evelyn.ms.m6geo.earths-moving-plates.v1',
  title: "Earth's Moving Plates",
  curriculum: 'MS',
  grade: '6',
  subject: 'social-studies',
  topic: 'grade-6-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm6geo.earths-moving-plates',
      standard: 'M6GEO-3.2',
      description:
        "Describe, in plain language, that Earth's outer shell is broken into large plates that move very slowly, and that today's continents were once joined together in one landmass (National Geography Standard 7: the physical processes that shape the patterns of Earth's surface).",
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the ground stop feeling like one solid, permanent thing before any vocabulary arrives.',
      script:
        'Step on a frozen puddle on a cold morning and it cracks. It does not turn into a hole. It breaks into big flat pieces, and the pieces shift a little against each other while the whole puddle stays a puddle. Now think about the ground under your shoes. It feels like the most solid, most permanent thing there is. It is not one piece. The outside of Earth is cracked into big slabs, and those slabs are moving right now, under the school, under your house, under the ocean. They move so slowly that nobody has ever felt it happen. Today you find out what those slabs are, how fast they really go, and the strangest part of all -- the fact that South America and Africa used to be touching.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-plates-and-drift',
      kind: 'concept',
      goal: "Install the broken-shell picture, the very slow speed, the not-a-liquid correction, and the once-joined continents with the evidence for them.",
      keyIdeas: [
        "EARTH'S OUTER SHELL IS BROKEN INTO PIECES, NOT ONE UNBROKEN SKIN. The rocky outside of Earth -- the crust and the very top of the layer underneath it -- is cracked into large slabs called TECTONIC PLATES. A few of them are very large and many more are small. A plate is not the same thing as a continent. Some plates carry a continent, some carry nothing but ocean floor, and many carry a piece of each. The whole surface of Earth sits on a plate, including the bottom of the sea.",
        'THE PLATES MOVE, AND THEY MOVE ABOUT AS FAST AS YOUR FINGERNAILS GROW. That is a few centimeters a year. Nobody feels it and no map of the world has to be redrawn because of it. But a few centimeters a year, kept up for tens of millions of years, adds up to hundreds of kilometers, and kept up for hundreds of millions of years it is enough to carry a continent clear across an ocean.',
        'WHAT THE PLATES SIT ON IS NOT A LIQUID. Below the plates the rock is very hot, and over enormous stretches of time it can slowly change shape and creep, a little like very stiff putty. It is still solid rock. There is no underground sea of liquid rock for the plates to float on, and the continents are not boats.',
        "THE CONTINENTS WERE ONCE JOINED IN ONE LANDMASS. Hundreds of millions of years ago the land on Earth was gathered into a single supercontinent, which geographers call PANGAEA. It broke apart, and the pieces have been drifting away from each other ever since. The idea that the continents move like this is called CONTINENTAL DRIFT, and a scientist named Alfred Wegener proposed it in the early 1900s.",
        'THE EVIDENCE IS SOMETHING YOU CAN CHECK YOURSELF. Look at the east coast of South America and the west coast of Africa on a globe: the two shapes fit together like puzzle pieces. On its own that could be a coincidence, so it is not the only evidence. Fossils of the same ancient animals turn up in South America and in southern Africa, on opposite sides of that ocean. Bands of rock on one coast match bands of rock on the other. Three separate clues pointing the same way is what turned a hunch into an accepted idea.',
        'EARTHQUAKES AND VOLCANOES ARE NOT SCATTERED EVENLY -- THEY CROWD ALONG THE EDGES. Mark every earthquake and every volcano on a globe and the marks do not spread out evenly over the surface. They gather into long bands, and those bands trace the edges where one plate meets another. The middle of a plate is a quiet place. The rim of a plate is where things happen.',
      ],
      vocabulary: [
        { term: 'tectonic plate', definition: "one of the large slabs that Earth's rocky outer shell is broken into." },
        { term: 'continental drift', definition: 'the slow movement of the continents across Earth over very long periods of time.' },
        { term: 'supercontinent', definition: 'a single very large landmass made of most or all of the continents joined together.' },
        { term: 'Pangaea', definition: 'the name geographers give to the supercontinent that existed hundreds of millions of years ago.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-puzzle-fit-evidence',
      kind: 'worked_example',
      problem:
        'A student turns a globe around and stops on the Atlantic Ocean. She says: "The east coast of South America looks like it would slot straight into the west coast of Africa." Explain what she has noticed, and explain why one matching shape is not enough on its own to prove the two continents were joined.',
      steps: [
        'Start with what she actually saw. The eastern edge of South America curves inward where the western edge of Africa bulges outward, so the two outlines look like neighboring pieces of a jigsaw puzzle. That observation is real, and it is the same one Alfred Wegener made in the early 1900s.',
        'Now ask the hard question about it. Coastlines are shapes, and shapes can match by accident. Two clouds can look alike. So a matching outline is a clue worth chasing, not a finished answer.',
        'Look for evidence of a completely different kind. Fossils of the same ancient animals have been found in South America and in southern Africa. Those animals could not have swum across an entire ocean, so the simplest explanation is that the two coasts were once one piece of ground.',
        'Look for a third kind. Bands of rock of the same type and the same age run to the edge of one coast and pick up again on the other coast. Rock layers do not line up across an ocean by chance.',
        'Put the three together. A matching shape, matching fossils, and matching rock layers are three separate clues that all point at the same conclusion: those two coasts used to be joined, and the ocean between them opened up later.',
        'This is the check to remember. One clue is a hunch. Three clues of different kinds, all agreeing, is evidence.',
      ],
      answer:
        'She has noticed that the two coastlines fit together like puzzle pieces. That alone could be a coincidence, so geographers rely on two more kinds of evidence as well: matching fossils on the two coasts, and matching bands of rock. All three agree that the coasts were once joined.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-speed-and-not-liquid',
      kind: 'worked_example',
      problem:
        'A student writes: "Earth\'s plates float on an underground ocean of liquid lava, and they race around so fast that a world map from a hundred years ago would already show the continents in the wrong places." Two things in that sentence are wrong. Find both and correct them.',
      steps: [
        'Take the two claims apart first. Claim one is about what the plates sit on. Claim two is about how fast they go. They are separate mistakes and each needs its own correction.',
        'Test claim one. WRONG: the plates float on an ocean of liquid rock. CORRECT: the rock beneath the plates is solid. It is extremely hot, and over enormous stretches of time it can slowly creep and change shape like very stiff putty, but it is not a liquid and there is no underground sea down there.',
        'Fix the word as well. Lava is melted rock that has already reached the surface, which is why you can see it. Melted rock still underground is called magma. Neither word describes a whole layer of Earth.',
        'Test claim two with an actual number. The plates move a few centimeters a year. Take three centimeters a year and run it for one hundred years: three multiplied by one hundred is three hundred centimeters, which is three meters.',
        'Ask whether three meters would show up on a world map. Three meters is about the length of a small car. On a map of the whole world that is far too small to see, so a hundred-year-old world map still shows the continents in the right places.',
        'WRONG: "the plates race around." CORRECT: "the plates creep, at about the speed your fingernails grow." Then check the other end of the scale, because this is the part that matters: keep three centimeters a year going for a hundred million years and the total is three hundred million centimeters, which is three thousand kilometers. Slow is not the same as still.',
      ],
      answer:
        'First error: the plates do not float on liquid rock. The rock below them is solid, though hot enough to creep very slowly over long periods. Second error: the plates move only a few centimeters a year, which is about three meters in a hundred years -- far too little to change a world map.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-what-the-shell-is-like',
      kind: 'try_yourself',
      problem: "Which statement best describes Earth's rocky outer shell?",
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It is one solid unbroken layer of rock wrapped all the way around the planet.' },
        { id: 'b', text: 'It is a layer of liquid rock that the continents float on top of like boats.' },
        { id: 'c', text: 'It is broken into large slabs called tectonic plates that move very slowly.', correct: true },
        { id: 'd', text: 'It is broken into slabs under the oceans only, and each continent sits on one piece.' },
      ],
      expectedAnswer: 'It is broken into large slabs called tectonic plates that move very slowly.',
      hints: [
        'Two things have to be right at once: whether the shell is broken up at all, and whether it stays still.',
        'The shell is broken everywhere, not just under the sea, and what the plates sit on is hot solid rock rather than a liquid.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-what-the-evidence-shows',
      kind: 'try_yourself',
      problem:
        'Fossils of the same ancient animals have been found in South America and in southern Africa, and bands of rock on the two facing coasts match each other. What do geographers conclude from this?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'That the two coasts were once part of a single joined landmass that later split.', correct: true },
        { id: 'b', text: 'That those ancient animals were strong swimmers that crossed the ocean.' },
        { id: 'c', text: 'That South America and Africa are moving toward each other and will meet.' },
        { id: 'd', text: 'That the same rocks and the same fossils form on their own in every part of the world.' },
      ],
      expectedAnswer: 'That the two coasts were once part of a single joined landmass that later split.',
      hints: [
        'Ask what would have to be true for a land animal and a band of rock to end up in both places.',
        'A rock layer cannot form across open ocean and start again on the far side. The simplest explanation is that the two coasts used to be one piece of ground.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-where-the-action-is',
      kind: 'try_yourself',
      problem:
        'A scientist puts a mark on a globe for every earthquake and every volcano recorded around the world in one year. What pattern would those marks most likely show?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The marks would be spread evenly over the whole globe, with no pattern to them.' },
        { id: 'b', text: 'The marks would sit only in the middle of the largest continents, far from any coast.' },
        { id: 'c', text: 'The marks would sit only under the oceans, and never anywhere on dry land at all.' },
        { id: 'd', text: 'The marks would line up in long bands where one plate meets another.', correct: true },
      ],
      expectedAnswer: 'The marks would line up in long bands where one plate meets another.',
      hints: [
        'The middle of a plate is a quiet place. Ask where on a plate things are most likely to happen.',
        'Plate edges run across dry land in some places and across the sea floor in others, so a pattern that appears only on land or only under the ocean cannot be right.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-liquid-layer-and-continents-only',
      kind: 'misconception_check',
      question:
        'A student says: "The plates float on a sea of liquid rock, the way a raft floats on water. And it is only the continents that move -- the bottom of the ocean stays where it is." What is wrong with each half of that?',
      commonErrors: [
        {
          answer: 'The plates float on a sea of liquid rock, the way a raft floats on water.',
          misconception:
            'Hearing that the rock below is hot and that the plates move, and filling in the only way a solid usually moves over something else: it must be floating on a liquid.',
          correctsTo:
            'The rock underneath the plates is solid. It is hot enough that, over enormous stretches of time, it can slowly change shape and creep, a little like very stiff putty being squeezed. That is not the same as being liquid, and there is no underground ocean down there. WRONG: "the plates float on liquid rock." CORRECT: "the plates rest on hot solid rock that creeps very slowly." Keep the two words straight as well: magma is melted rock still underground, and lava is melted rock that has reached the surface. Neither one is a whole layer of Earth.',
        },
        {
          answer: 'Only the continents move, and the bottom of the ocean stays still.',
          misconception:
            'Treating a plate and a continent as the same thing, because the word people hear most often is continental drift and the continents are the parts they can see.',
          correctsTo:
            'A plate is not a continent. A plate is a slab of the rocky shell, and the whole surface of Earth is made of them, sea floor included. Some plates carry a continent, some carry nothing but ocean floor, and many carry a piece of each. So the ocean floor is moving too. In fact the Atlantic Ocean is there because plates carrying South America and Africa moved apart and the ocean filled the gap between them.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "Earth's rocky outer shell is broken into large slabs called tectonic plates, and the whole surface sits on them, including the sea floor.",
        'A plate is not a continent. Some plates carry a continent, some carry only ocean floor, and many carry a piece of each.',
        'The plates move a few centimeters a year, about as fast as fingernails grow. That is far too slow to feel and far too slow to change a world map, but over hundreds of millions of years it carries a continent across an ocean.',
        'The plates rest on hot solid rock that creeps very slowly. They do not float on a liquid.',
        'Hundreds of millions of years ago the land was joined in one supercontinent called Pangaea, and it broke apart. That slow movement of the continents is called continental drift.',
        'Three separate clues support it: the coastlines of South America and Africa fit together, the same fossils appear on both coasts, and bands of rock on the two coasts match.',
        'Earthquakes and volcanoes crowd into long bands along the edges where plates meet, rather than spreading evenly over the globe.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.2', cedTitle: "Earth's Moving Plates" },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
