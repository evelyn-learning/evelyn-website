/**
 * Grade 6 Science (Earth & Space Science) -- Earth's History in the Rock
 * Record: Mass Extinctions as Time Markers.
 *
 * PROCEDURE-LED fan-out row for m6sci (NGSS MS-ESS1-4). The routine: given a
 * description of a fossil-record change, match it to one of the five named
 * boundaries by its date and its position in the sequence, then state which
 * era or period boundary it marks. The routine identifies WHEN a boundary
 * is; it never asks, and never answers, WHY any of the five extinctions
 * happened.
 *
 * SCOPE GUARD: this plan uses the five major mass-extinction boundaries
 * (end-Ordovician, end-Devonian, end-Permian, end-Triassic, end-Cretaceous)
 * only to mark WHEN the Phanerozoic eon divides into its eras and periods,
 * and it deliberately excludes WHY species died out:
 *   - GRADE 7 LIFE SCIENCE boundary: this file never states why a species
 *     did or did not survive one of the five events, never describes how
 *     surviving groups diversified or spread into empty niches afterward,
 *     and never mentions adaptation, natural selection or common ancestry.
 *     The sentence this plan deliberately does not write is one like
 *     "species died out because they could not adapt fast enough, and
 *     survivors then spread into the niches left behind" -- that sentence
 *     belongs to Grade 7 Unit 7, not here. Fossils appear only as the thing
 *     that disappears or changes at a boundary, exactly as row 5.3 already
 *     established.
 *   - CAUSE of the physical event itself is addressed only for the
 *     end-Cretaceous boundary, where the evidence is settled, and wherever
 *     it appears it appears only as a physical fact used to fix a moment in
 *     time, never as an explanation for why a species did or did not
 *     survive it. For the other four boundaries this file states plainly
 *     that scientists have proposed causes and the exact cause remains
 *     debated, without picking one.
 *   - ROW 5.2 (absolute dating) is referenced only to say where an age in
 *     years for a boundary actually comes from (radiometric dating of the
 *     rock), so a student does not conclude that an age comes from counting
 *     how many fossils disappeared. Half-lives, carbon-14 and uranium-lead
 *     are not explained here; that is row 5.2's job.
 *   - ROW 5.3 (fossils as evidence) is assumed, not re-taught: this file
 *     reuses "an index fossil dates the layer it sits in" as background and
 *     does not re-derive it.
 *   - GRADE 8 PHYSICAL SCIENCE boundary: no force, energy calculation,
 *     chemical formula or particle-level explanation appears anywhere in
 *     this file, including in the one sentence about the asteroid impact.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every rock
 * sequence and every fossil description in this file is written out in
 * words, and every item is solvable from the text printed inside it. Never
 * write "see the timeline above," and never assume the student has a rock
 * sample, a museum map or a textbook figure in front of them.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6SCI_U5_MASS_EXTINCTIONS_AS_TIME_MARKERS: LessonPlan = {
  id: 'evelyn.ms.m6sci.mass-extinctions-as-time-markers.v1',
  title: 'Mass Extinctions as Time Markers',
  curriculum: 'MS',
  grade: '6',
  subject: 'science',
  topic: 'grade-6-earth-space-science',
  locale: 'en',
  los: [
    {
      id: 'm6sci.mass-extinctions-as-time-markers',
      standard: 'M6SCI-5.4',
      description:
        'Identify the five major mass-extinction boundaries (end-Ordovician, end-Devonian, end-Permian, end-Triassic, end-Cretaceous) as the events that divide the Phanerozoic eon into its eras and periods, without addressing the biological causes of extinction or natural selection (NGSS MS-ESS1-4).',
    },
  ],
  prerequisites: ['m6sci.fossils-as-evidence-of-earths-history'],
  followUps: ['m6sci.layers-and-composition-of-the-atmosphere'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Anchor the boundary concept in a change the student can picture without any equipment.',
      script:
        'Picture walking through a natural history museum. One room is full of enormous skeletons: long necks, huge teeth, bones the size of a couch. You walk through a doorway into the next room, and every single skeleton is different. No more of the huge reptiles. Instead there are mammoths, saber-toothed cats, and skeletons that look more like animals alive today. Nobody rearranged the museum overnight. That same jump -- one whole set of animals present, then gone, and a different set taking over -- also shows up in real rock, all around the world, at the same point in the layers. Today you learn to use that jump the way a museum uses a doorway: as a marker for exactly where one chapter of Earth\'s history ends and the next one begins.',
      suggestedTools: ['show_timeline'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-mass-extinction-boundaries',
      kind: 'concept',
      goal: 'Install what a mass-extinction boundary is, name the five in order, and show how they divide the Phanerozoic eon into eras and periods.',
      keyIdeas: [
        'A MASS-EXTINCTION BOUNDARY IS A SUDDEN, WORLDWIDE CHANGE IN THE FOSSIL RECORD, AND THAT CHANGE IS WHAT MAKES IT A TIME MARKER. In a long, undisturbed stack of rock layers, certain fossil types show up again and again for a long stretch, and then, at one specific layer, most of those types stop appearing and different fossil types take their place, all at once. Geologists find this same abrupt switch, at the same relative position, in rock layers from places thousands of kilometers apart. Because it shows up everywhere at once, it lets geologists match rock layers formed at the same time in different places, even where no layer can be dated directly in years.',
        'THE FIVE MAJOR BOUNDARIES, IN ORDER FROM OLDEST (LOWEST IN AN UNDISTURBED SEQUENCE) TO YOUNGEST (HIGHEST): end-Ordovician, about 440 million years ago; end-Devonian, about 360 million years ago; end-Permian, about 250 million years ago, the most severe of the five; end-Triassic, about 200 million years ago; and end-Cretaceous, about 66 million years ago, also called the K-Pg boundary. Because superposition still applies in an undisturbed stack, this list is also the order in which a complete rock record would show them, lowest to highest.',
        'THESE FIVE BOUNDARIES DIVIDE THE PHANEROZOIC EON INTO ITS ERAS AND PERIODS. The Phanerozoic eon is the roughly 540-million-year span of geologic time in which the rock record contains abundant fossils. It splits into three eras -- the Paleozoic, the Mesozoic, and the Cenozoic, the one we live in now -- and each era splits further into periods. TWO of the five mark an ERA boundary, the largest division in this lesson: end-Permian separates the Paleozoic Era from the Mesozoic Era, and end-Cretaceous separates the Mesozoic Era from the Cenozoic Era. The other THREE mark a smaller PERIOD boundary inside a single era: end-Ordovician and end-Devonian both fall inside the Paleozoic Era, and end-Triassic falls inside the Mesozoic Era.',
        'A BOUNDARY\'S SEVERITY AND WHAT KIND OF DIVISION IT MARKS ARE TWO SEPARATE FACTS. End-Permian is the most severe of the five, but that is a different fact from it being an era boundary. End-Ordovician is far less severe and is only a period boundary. End-Cretaceous is also an era boundary despite being less severe than end-Permian. Knowing one of these two facts about a boundary does not tell you the other one.',
        'THIS LESSON USES THE FIVE BOUNDARIES ONLY TO MARK WHEN, NOT TO EXPLAIN WHY. For the end-Cretaceous boundary, evidence found in the rock layer itself in many places around the world points to a huge asteroid impact around that time. For the other four boundaries, scientists have proposed causes -- among them, enormous volcanic activity and long-term changes in climate and sea level -- but the exact cause, and how much each factor contributed, is still actively studied and debated. Nothing in this lesson depends on knowing why any of the five happened.',
      ],
      vocabulary: [
        { term: 'mass extinction', definition: 'a boundary in the rock record where a large share of the fossil types found below it stop appearing above it, within a geologically short span of time.' },
        { term: 'era', definition: 'a large division of geologic time; the Phanerozoic eon is divided into the Paleozoic, Mesozoic and Cenozoic eras.' },
        { term: 'period', definition: 'a smaller division of geologic time inside an era, such as the Devonian Period or the Cretaceous Period.' },
        { term: 'Phanerozoic eon', definition: 'the roughly 540-million-year span of geologic time in which the rock record contains abundant fossils.' },
        { term: 'K-Pg boundary', definition: 'the common name for the end-Cretaceous boundary, marking the end of the Cretaceous Period and the start of the Cenozoic Era.' },
      ],
      suggestedTools: ['show_timeline', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-identify-the-boundary',
      kind: 'worked_example',
      problem:
        'In a series of rock layers exposed along a canyon wall, the layers below a certain thin band are the last layers anywhere in the sequence to contain fossils of large land reptiles, and they also contain many different kinds of coiled shelled sea creatures called ammonites. Just above that thin band, both the large land reptiles and the ammonites are completely absent from the fossil record, and the layers above show an increase in the variety of small mammal fossils compared with the layers below. Which of the five boundaries is this, what does it divide, and what is its approximate age?',
      steps: [
        'Start with the clue that narrows it fastest: large land reptiles disappearing from the fossil record entirely. Of the five boundaries, this matches the end-Cretaceous boundary.',
        'Check the second clue against that answer. Ammonites are also known to disappear completely at the end-Cretaceous boundary, and small mammal fossils are known to become more varied in the layers above it. Both clues point to the same boundary as the first one did.',
        'Name what it divides. The end-Cretaceous boundary is one of the two boundaries that mark an ERA boundary, not just a period boundary: it separates the Mesozoic Era from the Cenozoic Era, the era we live in now.',
        'State the approximate age from the memorized list: about 66 million years ago.',
        'WRONG: "Since the large land reptiles are gone above the boundary, this must be the point where they went extinct because they could not survive the new conditions." CORRECT: "Since the large land reptiles are gone above the boundary, this rock record shows WHEN that boundary is, not WHY the animals disappeared." This routine identifies a boundary in time. It does not explain a cause.',
        'Now run the two checks a science answer needs, because there is no arithmetic to redo here beyond the age itself. First, look for clues of DIFFERENT KINDS that agree: the disappearance of the large land reptiles, the disappearance of the ammonites, and the increase in small mammal variety above the boundary are three separate fossil groups, and all three point to the same boundary. Second, change one thing about the setup and check that the answer moves the way it should: if the large land reptiles in the description had instead been early four-legged land animals disappearing near the bottom of a long Paleozoic sequence, with no mammals in the picture at all, the match would move to a much older boundary instead -- most likely end-Permian, not end-Cretaceous.',
        'Evidence found in the rock layer itself in many places around the world, at this same boundary, points to a huge asteroid impact around that time. That evidence explains why scientists are confident about WHEN this boundary is. It is not needed, and is not used here, to explain why any particular species did not survive it.',
      ],
      answer:
        'This is the end-Cretaceous boundary, also called the K-Pg boundary. It marks the boundary between the Mesozoic Era and the Cenozoic Era, and its approximate age is about 66 million years ago.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-ordering-two-boundaries',
      kind: 'worked_example',
      problem:
        'A single, undisturbed rock sequence in one location happens to preserve two separate mass-extinction boundaries. A geologist reports that both boundaries sit below the layer marking the end of the Paleozoic Era, and that both are less severe than the end-Permian boundary. Name the two boundaries, list them from lower (older) to upper (younger), and state about how many million years apart they are.',
      steps: [
        'Start from the position clue. The end-Permian boundary IS the layer marking the end of the Paleozoic Era, so anything below that layer has to be older than the end-Permian boundary, not merely less severe than it.',
        'Of the five boundaries, only two are older than the end-Permian boundary and sit inside the Paleozoic Era at all: end-Ordovician and end-Devonian. The severity clue in the problem is consistent with this, since both of those two are in fact less severe than end-Permian, but the severity clue alone would not have been enough on its own -- the position clue is what does the real work here.',
        'Use the order rule from earlier in this lesson: the five boundaries fall in a fixed order, oldest to youngest, following the same superposition idea as an ordinary rock layer. End-Ordovician comes before end-Devonian, so end-Ordovician is the lower, older boundary and end-Devonian is the upper, younger one.',
        'Now the age gap. End-Ordovician is about 440 million years ago and end-Devonian is about 360 million years ago. 440 minus 360 is 80, so the two boundaries are separated by roughly 80 million years.',
        'WRONG: "The more severe of two extinction events always happened first." CORRECT: "Severity does not set the order. Position in an undisturbed rock sequence does, the same way it did for ordinary rock layers in an earlier lesson."',
        'Now run the two checks a science answer needs. First, three clues of different kinds agree: position (both boundaries sit below the end of the Paleozoic Era), the order rule (end-Ordovician is listed before end-Devonian among the five), and the severity clue (both are in fact less severe than end-Permian, consistent with being two of the four non-worst boundaries). Second, change one thing and check the answer moves: if the problem had instead said both boundaries sit ABOVE the layer marking the end of the Paleozoic Era, the same reasoning would point to end-Triassic and end-Cretaceous instead, in that order, because those are the two boundaries inside or after the Mesozoic Era.',
      ],
      answer:
        'The lower, older boundary is end-Ordovician, about 440 million years ago. The upper, younger boundary is end-Devonian, about 360 million years ago. They are separated by roughly 80 million years (440 minus 360 equals 80).',
      estimatedMinutes: 4,
    },
    {
      id: 'try-identify-the-era-boundary',
      kind: 'try_yourself',
      problem:
        'The end-Permian boundary, about 250 million years ago, was the most severe of the five mass-extinction boundaries: it affected a larger share of the fossil record than any of the other four. What does this boundary mark in the geologic time scale?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A period boundary inside the Paleozoic Era, the same kind of division as the end-Ordovician boundary.' },
        { id: 'b', text: 'The boundary between the Paleozoic Era and the Mesozoic Era, the largest kind of division covered in this lesson.', correct: true },
        { id: 'c', text: 'The boundary between the Mesozoic Era and the Cenozoic Era, the era we live in today, which is easy to mix up with end-Permian because both are era boundaries.' },
        { id: 'd', text: 'No boundary at all, because how severe an extinction was does not correspond to any division in the time scale.' },
      ],
      expectedAnswer: 'The boundary between the Paleozoic Era and the Mesozoic Era, the largest kind of division covered in this lesson.',
      hints: [
        'Start by separating two different facts about this boundary: how severe it was, and what kind of division it marks. Severity does not tell you which one it is.',
        'The Phanerozoic eon splits into three eras first, and each era splits into periods. Ask which of those two kinds of division separates the Paleozoic Era from the era that comes right after it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-order-two-paleozoic-boundaries',
      kind: 'try_yourself',
      problem:
        'A single, undisturbed rock sequence contains two mass-extinction boundaries. Both are known to be less severe than the end-Permian boundary, and both sit below the layer that marks the end of the Paleozoic Era. Listed from lower (older) to upper (younger), which two boundaries are they?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'End-Triassic, then end-Cretaceous, because both of those boundaries are also less severe than the end-Permian boundary.' },
        { id: 'b', text: 'End-Permian, then end-Triassic, because the problem compares both boundaries to the end-Permian boundary, so end-Permian belongs on the list.' },
        { id: 'c', text: 'End-Ordovician, then end-Devonian, because both lie inside the Paleozoic Era and both are less severe than the end-Permian boundary.', correct: true },
        { id: 'd', text: 'End-Devonian, then end-Ordovician, because the more severe of two extinction events always happened first.' },
      ],
      expectedAnswer: 'End-Ordovician, then end-Devonian, because both lie inside the Paleozoic Era and both are less severe than the end-Permian boundary.',
      hints: [
        'The end-Permian boundary itself marks the TOP of the Paleozoic Era, so anything sitting below that layer has to be older than the end-Permian boundary, not just less severe than it.',
        'Of the five boundaries, only two sit inside the Paleozoic Era at all. Once you have those two, use the order rule from earlier in this lesson to put them lower to upper.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-worldwide-correlation',
      kind: 'try_yourself',
      problem:
        'Geologists studying two rock outcrops thousands of kilometers apart both find the same abrupt change at the same relative position in their layers: fossils common below that point stop appearing, and different fossils appear above it. Neither outcrop has a layer that can be dated directly in years. What does this shared, sudden change let the geologists do?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Calculate the exact number of years since each layer formed, based on the size of the fossil change instead of using radiometric dating.' },
        { id: 'b', text: 'Prove which single event caused the fossils to disappear in both places, mistaking a matching pattern for proof of a shared cause.' },
        { id: 'c', text: 'Conclude that the two outcrops formed in the same location before the continents moved apart, mistaking a time marker for location evidence.' },
        { id: 'd', text: 'Match the two boundaries as the same moment in time, even without an age in years for either one, because the same worldwide change appears in both places.', correct: true },
      ],
      expectedAnswer: 'Match the two boundaries as the same moment in time, even without an age in years for either one, because the same worldwide change appears in both places.',
      hints: [
        'Notice what the geologists do NOT have: an age in years for either outcrop. Ask what the matching pattern alone can still tell them, without any date attached.',
        'The question is about WHEN the two rock records line up, not about WHY the fossils changed or where the rock originally formed. Rule out any answer that tries to explain a cause instead of a moment in time.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-severity-and-division',
      kind: 'misconception_check',
      question:
        'A student writes: "The end-Permian boundary happened exactly 250 million years ago because paleontologists counted how many species disappeared there, and since it was the biggest extinction of the five, it must be the boundary between the Mesozoic Era and the Cenozoic Era." Two separate things have gone wrong. What are they?',
      commonErrors: [
        {
          answer: 'It happened exactly 250 million years ago because paleontologists counted how many species disappeared there.',
          misconception:
            'Treating the SEVERITY of an extinction, measured by how much of the fossil record it affected, as though it were the METHOD that produces an age in years.',
          correctsTo:
            'An age in years for a boundary comes from radiometric dating of the rock itself, the method from an earlier lesson, not from counting how many fossil types vanished. How many fossil types disappear at a boundary is a measure of how SEVERE that extinction was; it has nothing to do with how the boundary\'s age in years was measured.',
        },
        {
          answer: 'Since it was the biggest extinction of the five, it must be the boundary between the Mesozoic Era and the Cenozoic Era.',
          misconception:
            'Assuming that the MOST SEVERE of the five boundaries has to also be the boundary nearest to the present, or the one most often mentioned alongside a famous group of animals.',
          correctsTo:
            'The end-Permian boundary, the most severe of the five, marks the boundary between the Paleozoic Era and the Mesozoic Era. The boundary between the Mesozoic Era and the Cenozoic Era is a different, later event -- the end-Cretaceous boundary, about 66 million years ago -- which is less severe than end-Permian even though it is the more familiar of the two.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A mass-extinction boundary is a sudden, worldwide change in which fossil types appear in the rock record, and that abrupt change is what makes it useful as a time marker.',
        'The five major boundaries, oldest to youngest: end-Ordovician (about 440 million years ago), end-Devonian (about 360 million years ago), end-Permian (about 250 million years ago, the most severe of the five), end-Triassic (about 200 million years ago), and end-Cretaceous, also called the K-Pg boundary (about 66 million years ago).',
        'These five boundaries divide the Phanerozoic eon into its eras and periods. End-Permian and end-Cretaceous mark ERA boundaries. End-Ordovician, end-Devonian and end-Triassic mark PERIOD boundaries inside a single era.',
        'A boundary\'s severity and what kind of division it marks are two separate facts. Neither one tells you the other.',
        'The same worldwide fossil change, found at the same relative position in far-apart rock records, lets geologists match those layers in time, even without an age in years for either one.',
        'This lesson uses the five boundaries only to mark WHEN something changed. It does not explain WHY any extinction happened, and for most of the five the exact cause is still actively debated among scientists.',
        'The order of the five boundaries in an undisturbed rock record follows the same superposition rule as ordinary rock layers: lower means older.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.4', cedTitle: 'Mass Extinctions as Time Markers' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
