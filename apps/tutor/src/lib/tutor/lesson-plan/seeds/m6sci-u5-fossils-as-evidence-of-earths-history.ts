/**
 * Grade 6 Science (Earth & Space Science) — Earth's History in the Rock
 * Record: Fossils as Evidence of Earth's History.
 *
 * PROCEDURE-LED lesson for the m6sci fan-out (NGSS MS-ESS1-4). The routine is:
 * given a fossil species' already-known time range (established elsewhere by
 * absolute dating), read that range onto any layer that contains the fossil,
 * and use a shared fossil to correlate two rock layers that are not
 * physically connected -- something position alone cannot do. The two traps
 * it is built to kill are (a) collapsing a known window into one exact year,
 * and (b) reading a shared fossil as proof of a shared environment or as
 * evidence that the species did or did not change over time.
 *
 * SCOPE GUARD: this plan uses an index fossil's already-known time range,
 * established elsewhere by absolute dating (row 5.2, the previous lesson),
 * to place the rock layer that contains it within that same range, and to
 * correlate separated rock layers that share the same index fossil. It also
 * uses an index fossil's position in a single undisturbed stack -- the law
 * of superposition, row 5.1 -- only as a second, independent consistency
 * check on an answer already reached from the fossil's range; it does not
 * re-teach superposition, original horizontality or cross-cutting
 * relationships, all of which stay in row 5.1. It performs no radiometric
 * dating itself and derives no new absolute age: every numeric time range in
 * this file is given as already known, the way row 5.2 produces one, and
 * this lesson only reads that range off a fossil rather than measuring it.
 * ROW 5.4 (mass extinctions as time markers) is not touched -- no mass
 * extinction boundary is named anywhere in this file, and the numeric
 * ranges chosen for this lesson's illustrative fossil species (100-94,
 * 84-80, 120-114 and 58-52 million years ago) do not coincide with any of
 * the five real mass-extinction boundaries, so that row's content is not
 * pre-taught here by accident.
 *   GRADE 7 LIFE SCIENCE boundary: an index fossil is used strictly as a
 * time marker, the same way a coin's stamped design is read only as a clue
 * to when it was minted, never as a story about the coin. This file never
 * asks why a species looked the way it did, how it might be related to
 * another species, or what happened to change its numbers over time. One
 * worked example and the misconception check each explicitly correct a
 * student who tries to read a shared fossil as proof the species did or did
 * not change, or as proof the two locations shared an environment, and each
 * states in so many words that those questions belong to a different
 * course. Natural selection, adaptation, common ancestry and extinction
 * causes appear nowhere in this file -- that is the sentence chosen not to
 * write, and it is named as such at the point in worked example 2 where a
 * lesson on evolution would naturally continue.
 *   GRADE 8 PHYSICAL SCIENCE boundary: no force, energy or heat-transfer
 * mechanism appears anywhere in this file.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every rock
 * layer, fossil range and cross-continent scenario in this file is written
 * out in words, and every item is solvable from the text printed inside it.
 * Never write "see the cross-section above", and never assume the student
 * has a fossil, a rock sample or a map in front of them.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6SCI_U5_FOSSILS_AS_EVIDENCE_OF_EARTHS_HISTORY: LessonPlan = {
  id: 'evelyn.ms.m6sci.fossils-as-evidence-of-earths-history.v1',
  title: 'Fossils as Evidence of Earth\'s History',
  curriculum: 'MS',
  grade: '6',
  subject: 'science',
  topic: 'grade-6-earth-space-science',
  locale: 'en',
  los: [
    {
      id: 'm6sci.fossils-as-evidence-of-earths-history',
      standard: 'M6SCI-5.3',
      description:
        'Use an index fossil\'s known time range and its position in the rock record to date the layer it is found in, treating fossils strictly as time markers rather than as evidence for how species changed (NGSS MS-ESS1-4).',
    },
  ],
  prerequisites: ['m6sci.absolute-dating-and-the-geologic-time-scale'],
  followUps: ['m6sci.mass-extinctions-as-time-markers'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Anchor the index-fossil idea in a narrow, already-known window of time that has nothing to do with rock.',
      script:
        'Imagine cleaning out a relative\'s garage and finding an old cardboard box of loose coins. One coin has a special picture stamped on it, and you look it up to learn that a country only minted coins with that exact picture for a few years before switching the design. That one coin now tells you something about the whole box: whatever else got packed in there could not have gone in before that coin existed, and probably did not go in long after either. A single object with a narrow, already-known window of time just dated the box around it, without anyone measuring a single thing inside that box directly. Today you learn that geologists read certain fossils the exact same way -- as a coin with a known minted window, buried in rock instead of a drawer.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-index-fossils',
      kind: 'concept',
      goal: 'Define what makes a fossil useful for dating, show how a known range pins a layer and links separated layers, and name what a shared fossil does not prove.',
      keyIdeas: [
        'AN INDEX FOSSIL IS A TIME MARKER, AND THREE THINGS MAKE ONE USEFUL. It has to have lived during a narrow slice of geologic time, so that finding it narrows a window down instead of leaving it wide open. It has to have been spread across a large area while it was alive, so its fossil can turn up at many different locations far apart. And it has to look distinctive enough that it will not be confused with a similar-looking species from a different time. A fossil missing any one of those three is a weak choice for dating, even if it is a real and useful fossil for some other purpose.',
        'THE TIME RANGE IS ALREADY KNOWN BEFORE YOU EVER FIND THE FOSSIL. Scientists work out how long a species existed by using absolute dating -- the method from the previous lesson -- on other rock that already contains that fossil. Once a species\' known range is pinned down that way, every later discovery of that same fossil can borrow the answer: if the fossil is present in a layer, that layer must have formed sometime during the species\' known range. No new radiometric measurement has to be taken on every layer that turns up.',
        'AN INDEX FOSSIL CAN LINK LAYERS THAT ARE NOT EVEN CONNECTED. The order rule from the rock-layers lesson only works within a single, unbroken stack you can see start to finish. An index fossil is not limited that way: if the exact same index fossil species turns up in two rock layers on opposite sides of the world, with no visible layer joining them, both layers must have formed during that species\' shared time range. Matching separated layers by age this way is called correlation, and it is the one thing an index fossil can do that position alone cannot.',
        'AN INDEX FOSSIL STILL GIVES A WINDOW, NEVER ONE EXACT YEAR. If a species is known to have lived between two absolute dates, a layer holding its fossil could have formed at any point inside that window -- not necessarily in the middle, and not at one precise year. Getting a single exact age still requires radiometric dating of the rock itself, which stays the previous lesson\'s method, not this one.',
        'WHAT AN INDEX FOSSIL DOES NOT TELL YOU. Finding the same fossil species in two layers says nothing about whether the two locations had the same environment at the time -- that is a separate question this lesson does not answer. It also says nothing about whether, or how, the species itself changed in appearance, grew more or less common, or eventually disappeared. Those are questions about how living things change over time, and answering them belongs to a different course. Here, a fossil is read only as a time marker, the same way a coin\'s stamped design is read only as a clue to when it was minted, never as a story about the coin.',
        'A FOSSIL CAN BE A POOR CHOICE FOR DATING, EVEN A REAL ONE. A species that lived across almost all of Earth\'s fossil-bearing history narrows nothing down, because its presence is consistent with nearly any layer. A species that only ever lived in one small area is not widespread enough to help correlate layers anywhere else, even if its own time range was short. And a fossil that is easy to mix up with a different species from a different time period cannot be trusted to mark a window at all, because you cannot be sure which species you are actually looking at.',
      ],
      vocabulary: [
        { term: 'index fossil', definition: 'a fossil used to date the rock layer it is found in, because the species is known to have lived only during a narrow window of time, was spread across a wide area, and is easy to tell apart from other species.' },
        { term: 'correlate', definition: 'to match rock layers in different, unconnected locations to the same span of time using shared evidence such as an index fossil.' },
        { term: 'time range', definition: 'the span of years, already worked out using absolute dating, during which a fossil species is known to have lived.' },
        { term: 'widespread', definition: 'found across a large geographic area, rather than in only one small location.' },
        { term: 'distinctive', definition: 'having a shape or pattern clear enough that it will not be mistaken for a different species.' },
      ],
      suggestedTools: ['show_timeline', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-single-layer-window',
      kind: 'worked_example',
      problem:
        'A shale layer at one cliff contains fossils of a coiled sea-shell creature. Other rock, dated elsewhere using absolute dating, already shows this species lived only between about 100 million years ago and 94 million years ago, and nowhere outside that window. In the same cliff, the layer directly below the shale contains an index fossil already known to be older than 100 million years, and the layer directly above the shale contains an index fossil already known to be younger than 94 million years. What can a geologist conclude about when the shale layer formed?',
      steps: [
        'Start from what the coiled sea-shell fossil already tells you. Other rock, dated elsewhere by absolute methods, shows this species existed only from 100 million to 94 million years ago and at no other time. If the shale contains this fossil, the shale must have formed sometime inside that window.',
        'Find the size of the window with simple subtraction: 100 million years ago minus 94 million years ago leaves a span of 100 - 94 = 6 million years. That is a narrow slice compared with Earth\'s roughly 4.6-billion-year history, which is exactly why this fossil is useful for dating instead of useless.',
        'Check position as a second, different kind of clue. The layer below is already known to be older than 100 million years, and the layer above is already known to be younger than 94 million years. That matches an undisturbed stack in which the shale, sandwiched between them, falls inside the 100-to-94-million-year window -- consistent with the order rule from the rock-layers lesson, even though this lesson is not the one deriving that order.',
        'WRONG: "This fossil means the shale is exactly 97 million years old." CORRECT: "This fossil places the shale somewhere in the six-million-year window from 100 to 94 million years ago, not at one exact year." Getting one precise year still needs radiometric dating done on the rock itself.',
        'Now run the two checks a science answer needs, because there is no experiment to redo here. First, three clues of different kinds agree: the fossil\'s own known range says the shale falls in that six-million-year window; the already-known ages of the layers above and below independently agree with that same window; and the size of the window itself, only 6 million years against Earth\'s 4.6-billion-year history, is exactly the kind of narrow slice a good index fossil is supposed to produce. Second, change one thing and check that the answer moves with it: if this same fossil had instead turned out to be a species known continuously from 500 million years ago to today, finding it in the shale would say almost nothing about the shale\'s age, because the window would cover nearly the whole fossil record. A narrow window is not a nice extra feature. It is the entire reason the fossil is useful.',
      ],
      answer:
        'The shale layer formed sometime within the six-million-year window from 100 million to 94 million years ago -- not at one exact year -- and that conclusion is backed up by the already-known ages of the layers directly above and below it.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-correlating-distant-layers',
      kind: 'worked_example',
      problem:
        'In North America, a rock layer contains fossils of an extinct ridged clam. Other studies using absolute dating show this species lived only between about 84 million years ago and 80 million years ago. Thousands of kilometers away, on a different continent, a separate rock layer -- with no visible layer connecting it to the first one -- contains fossils of that exact same ridged-clam species, and no other index fossil that would rule out that window. What can a geologist conclude about the two layers, and what can she not conclude?',
      steps: [
        'Start from the shared fossil. Both layers hold the ridged clam, and that species is already known, from absolute dating done elsewhere, to have lived only between 84 million and 80 million years ago -- a window of 84 - 80 = 4 million years. Because both layers contain it, both must have formed sometime inside that same 4-million-year window.',
        'This is correlation: matching the ages of two layers that are not physically connected, using a fossil they share instead of tracing rock by hand from one to the other. Correlation is what an index fossil can do that position alone cannot -- superposition only orders layers you can see stacked in one place.',
        'Add a second, different kind of clue: at one of the two sites, scientists have also run absolute dating directly on the rock itself, and that measured age falls inside the same 84-to-80-million-year window -- an independent check that agrees with the fossil-based one.',
        'Add a third kind of check: neither layer contains any other index fossil whose already-known range would rule the shared window out. If one of the layers had also held a fossil known to exist only between 40 and 35 million years ago, that would contradict the 84-to-80-million-year window and the correlation would fail. That does not happen here, so the window holds up.',
        'WRONG: "The same fossil in both layers means the two continents had the same environment at the time." CORRECT: "The same fossil in both layers means only that both layers formed within the same window of time. It says nothing about whether the two places looked or felt alike."',
        'WRONG: "The two layers must sit right next to each other in the rock record, with nothing in between." CORRECT: "The two layers only have to fall within the same known window. Nothing about a shared fossil says whether other layers formed between them somewhere else in the world."',
        'This lesson stops at the window of time. It does not ask whether the ridged clam itself changed in appearance between the two continents, whether it grew more or less common over those 4 million years, or what happened to it afterward. Those are questions about how living things change over time, and they belong to a different course, not this one.',
        'Change one thing and check that the answer moves with it: if the second continent\'s layer had instead contained a fossil already known to live only between 40 and 35 million years ago, the two layers could not be correlated at all, because the two fossils\' known ranges do not overlap anywhere. Sharing a fossil is what makes the match work; swap in a fossil with a non-overlapping range and the match breaks immediately.',
      ],
      answer:
        'Both layers formed sometime within the shared 4-million-year window, from about 84 to 80 million years ago. The geologist cannot conclude that the two locations had the same environment, that the layers sit next to each other in the rock record, or anything about whether the species changed between them.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-best-index-fossil',
      kind: 'try_yourself',
      problem:
        'A team of geologists is choosing which of four fossil species would make the best index fossil for dating rock layers. Which one should they pick?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A sea creature that lived for a short span of geologic time, spread across a huge area while it was alive, and has a shape distinct enough that it will not be confused with any other species.', correct: true },
        { id: 'b', text: 'A sea creature that lived for hundreds of millions of years and is still alive today, because a fossil that common would turn up in almost every layer a geologist digs into.' },
        { id: 'c', text: 'A land animal that lived for a short span of time but has only ever been found fossilized in one small valley, because a fossil that rare and localized must be especially meaningful.' },
        { id: 'd', text: 'A sea creature whose fossilized shell looks the same as several unrelated species that lived during many different time periods, because a shape that keeps reappearing must be common enough to rely on.' },
      ],
      expectedAnswer:
        'A sea creature that lived for a short span of geologic time, spread across a huge area while it was alive, and has a shape distinct enough that it will not be confused with any other species.',
      hints: [
        'Think about all three requirements at once: how long the species existed, how widely it was spread across the world, and how easy its fossil is to tell apart from a different species. A good choice needs all three, not just one.',
        'For each wrong choice, ask which one of those three requirements it is missing -- existing for too long, being found in too small an area, or being too easily confused with something else -- rather than asking whether the fossil is real.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-correlation-across-distance',
      kind: 'try_yourself',
      problem:
        'A rock layer in North America contains a fossil of an extinct spiral-shelled sea creature. Other studies using absolute dating show this species lived only between about 120 million years ago and 114 million years ago, and nowhere outside that window. A separate rock layer on a different continent, with no physical connection to the first layer, contains fossils of that exact same species. What can a geologist conclude about the second layer?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The second layer must be exactly 117 million years old, since that is the midpoint of the fossil\'s known window.' },
        { id: 'b', text: 'The second layer formed sometime within that same window, from about 120 to 114 million years ago, even though it is nowhere near the first layer.', correct: true },
        { id: 'c', text: 'The second layer must be older than the first layer, because the law of superposition means whichever layer is described second in a problem is always the deeper, older one.' },
        { id: 'd', text: 'Nothing can be concluded about the second layer, because the two layers are not physically connected and a fossil cannot link locations that are not touching.' },
      ],
      expectedAnswer:
        'The second layer formed sometime within that same window, from about 120 to 114 million years ago, even though it is nowhere near the first layer.',
      hints: [
        'Start from what the fossil\'s window actually tells you: not one exact year, but a span between two ages. Ask what a shared fossil lets you say about a layer that is nowhere near the first one.',
        'Distance between two rock layers, by itself, says nothing about which one is older. What a shared index fossil lets you do is match ages across that distance without needing the layers to touch.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-what-the-fossil-does-not-say',
      kind: 'try_yourself',
      problem:
        'A layer near the bottom of one rock exposure and a layer near the top of a different, unconnected rock exposure both contain fossils of the same spiral-ridged sea-snail species. Other studies using absolute dating already show this species lived only between about 58 million years ago and 52 million years ago, with the first layer forming close to the older end of that window and the second layer forming close to the younger end, several million years later. What does finding the same fossil species in both layers tell a geologist?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'That the two locations must have had identical environments and climates at both times, since the same creature was able to live in both places.' },
        { id: 'b', text: 'That the species must have changed in some way between the two layers in order to survive for that many million years.' },
        { id: 'c', text: 'That both layers formed sometime within the species\' known 58-to-52-million-year window, without saying anything about whether the species or its environment changed between them.', correct: true },
        { id: 'd', text: 'That the two layers must sit immediately next to each other in the rock record, with no other layers formed anywhere in between.' },
      ],
      expectedAnswer:
        'That both layers formed sometime within the species\' known 58-to-52-million-year window, without saying anything about whether the species or its environment changed between them.',
      hints: [
        'Separate what the shared fossil actually proves -- a shared window of time -- from anything you might be tempted to add about environment, change over time, or how the layers are arranged relative to each other.',
        'This lesson only reads a fossil as a marker of when a layer formed, the way a coin\'s design marks when it was minted. Anything about environment, adjacency, or how the species itself changed is a separate question this lesson does not answer.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-exact-year-and-unchanging-species',
      kind: 'misconception_check',
      question:
        'A student looks back at the ridged-clam example and writes: "This fossil means the layer is exactly 82 million years old, and it also proves the ridged clam species never changed at all while it existed." Two separate things have gone wrong in that sentence. What are they?',
      commonErrors: [
        {
          answer: 'This fossil means the layer is exactly 82 million years old.',
          misconception:
            'Collapsing a known window into a single number, because a specific-sounding number feels more like a real answer than a range does.',
          correctsTo:
            'An index fossil only places a layer somewhere inside its species\' known window -- here, the four-million-year span from 84 to 80 million years ago -- not at one exact year. Turning that into a single number, even the midpoint, invents precision the fossil does not provide. Getting one exact year still requires radiometric dating done on the rock itself, which stays the previous lesson\'s method.',
        },
        {
          answer: 'It also proves the ridged clam species never changed at all while it existed.',
          misconception:
            'Treating a fossil used as a fixed time marker as if that also settled a biological question about the species, because the two ideas both happen to involve the same fossil.',
          correctsTo:
            'An index fossil is read only as a marker of time, the same way a coin\'s stamped design is read only as a clue to when it was minted, never as a story about the coin. Whether, or how, a species changed in appearance over the time it existed is a separate question that this lesson does not address at all; it belongs to a different course.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A good index fossil lived during a narrow span of time, was spread across a wide area, and looks distinctive enough not to be confused with another species.',
        'A fossil\'s known time range comes from absolute dating done elsewhere, on other rock that already contains it -- this lesson reads that range off the fossil rather than measuring it fresh.',
        'If a layer contains an index fossil, the layer formed sometime within that fossil\'s known window -- not necessarily in the middle, and not at one exact year.',
        'Correlation matches the ages of separated, unconnected rock layers using a shared index fossil -- something position alone, inside a single stack, cannot do.',
        'A fossil that lived across almost all of Earth\'s fossil-bearing history, or that is confusable with another species, narrows nothing down, even if it is a real fossil.',
        'A fossil that is real but only ever found in one small area is not widespread enough to help correlate layers anywhere else.',
        'An index fossil says nothing about whether two locations shared an environment, and nothing about whether or how the species itself changed over time -- those are separate questions this lesson does not answer.',
        'Getting one exact year for a layer still requires radiometric dating of the rock itself, which is the previous lesson\'s method, not this one.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.3', cedTitle: 'Fossils as Evidence of Earth\'s History' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
