/**
 * Grade 6 World Geography — Applying Geography to the World Today: How
 * Physical Geography Changes Over Time.
 *
 * CONCEPT-LED row for the m6geo fan-out (National Geography Standard 7). The
 * student has no procedure to run here, so the whole lesson installs one
 * picture: a river's course, a coastline's edge, and other physical features
 * that look permanent on any single day are not actually fixed, and most of
 * the time they change GRADUALLY -- in small amounts, over and over, across a
 * long stretch of time, too slowly for anyone standing there to notice from
 * one moment to the next. The scope line names two general examples, a river
 * changing course and a coastline eroding, and this row uses exactly those
 * two, plus one more general example (a lake's shoreline) for the third
 * try_yourself item, so the skill transfers past the two named cases.
 *
 * SCOPE GUARD: this row says THAT physical geography -- a river's course, a
 * coastline's edge, a lake's shoreline -- is not fixed and changes gradually
 * over time, using general, invented rivers, coastlines, and a lake rather
 * than any real, named place anywhere in the file. It never explains HOW that
 * change happens: it never names or defines weathering, erosion, or
 * deposition anywhere in this file (that vocabulary and its three-part
 * definitions belong entirely to this course's own row 3.4,
 * `m6geo-u3-weathering-erosion-and-deposition.ts`, and this row is careful
 * never to restate or contradict that row's definitions by simply not
 * touching them), it never mentions plate tectonics or the rock cycle (rows
 * 3.1-3.3), and it never ties change to a landform-*building* mechanism the
 * way Grade 7 does (`m7geo-u2-landforms-and-water-features.ts`, whose
 * erosion/deposition-builds-a-landform content, tied to real places and the
 * settlement-pattern payoff, is explicitly excluded from this course). This
 * row states no rate of change anywhere and performs no rate-times-time
 * arithmetic: every instance of change is described only as "gradual," "over
 * a long stretch of time," or "over many years," with no number attached, and
 * no worked example or item multiplies a speed by a duration. One thing IS
 * deliberately allowed, because a neighboring skill sits close and the line
 * has to be drawn precisely rather than avoided: this row distinguishes
 * GRADUAL change from SUDDEN change by definition alone -- a plain two-way
 * contrast at the same depth as this course's own weather-versus-climate row
 * (5.1), never a mechanism's typology -- so a student can tell a slow shift
 * apart from a flood- or storm-driven one without any explanation of WHY
 * either one happens. No real place is named anywhere in this file; every
 * river, coastline, valley, and lake described is general and invented.
 *
 * DEPTH CEILING NOTE FOR THE FAN-OUT: every keyIdea below states THAT change
 * happens and describes it in plain terms, never WHY a river shifts or WHY a
 * coastline wears back. The closest this row comes to the ceiling is the
 * gradual-versus-sudden contrast, which could tempt a mechanism explanation
 * ("gradual change happens because water slowly wears rock away") -- that
 * explanatory clause was cut everywhere it was drafted, leaving only the
 * definitional contrast (how fast, and whether one event explains it all).
 *
 * ANSWER-CUE NOTE: the three MCQs below are written against deferred finding
 * DF-3 (in the shipped Grade 7 Geography bank the keyed answer was the
 * strictly longest choice 67 percent of the time; chance with four choices is
 * 25 percent). Every distractor states a full wrong reason rather than a
 * short wrong label, and no key was built to be the longest choice BECAUSE it
 * is the key -- see the character counts in the report. The three keys sit at
 * ids a, d and c, which is the id set `(10 + 3) mod 4 = 1` requires, omitting
 * b.
 *
 * NOTE ON prerequisites/followUps: this row's chain is 10.2
 * (`map-based-problem-solving`) -> 10.3 (this row) -> 10.4
 * (`using-geography-to-plan-a-community`), per the lesson brief and the
 * fan-out contract's chain table.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every item is solvable from
 * the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6GEO_U10_HOW_PHYSICAL_GEOGRAPHY_CHANGES_OVER_TIME: LessonPlan = {
  id: 'evelyn.ms.m6geo.how-physical-geography-changes-over-time.v1',
  title: 'How Physical Geography Changes Over Time',
  curriculum: 'MS',
  grade: '6',
  subject: 'social-studies',
  topic: 'grade-6-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm6geo.how-physical-geography-changes-over-time',
      standard: 'M6GEO-10.3',
      description:
        'Describe, using a general example such as a river changing course or a coastline eroding, that physical geography is not fixed and changes gradually over time (National Geography Standard 7: the physical processes that shape the patterns of Earth\'s surface).',
    },
  ],
  prerequisites: ['m6geo.map-based-problem-solving'],
  followUps: ['m6geo.using-geography-to-plan-a-community'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make a familiar place feel less permanent before any vocabulary arrives.',
      script:
        'Picture going back to a spot you visited on a family trip when you were very small -- maybe a riverbank where you once skipped stones, or a beach where you once built a sandcastle. You remember it perfectly. When you finally go back years later, something is different. The riverbank is not shaped quite the way you remember it, or the beach does not stretch out as far as it used to. Nobody moved anything overnight. No single dramatic thing happened that anyone can point to. The land itself, slowly and quietly, changed while you were busy growing up. Today you find out that this is completely normal -- the physical shape of a place is never really finished, and most of the time it changes so slowly that nobody ever catches it happening.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-not-fixed-and-gradual-change',
      kind: 'concept',
      goal: 'Install the not-fixed idea, the definition of gradual change, the two general examples, and the gradual-versus-sudden contrast.',
      keyIdeas: [
        'PHYSICAL GEOGRAPHY IS NOT FIXED. A river\'s course, the edge of a coastline, and other physical features of a place can look exactly the same for a person\'s whole life and still be different from what they were long before that person was born. Nothing about the shape of the land is permanently set in place.',
        'MOST OF THIS CHANGE HAPPENS GRADUALLY, NOT ALL AT ONCE. Gradual change happens in small amounts, over and over, across a long stretch of time, too slowly for a person standing there to notice. No single moment looks any different from the moment right before it. But small changes that keep happening add up, so a place described today can be measurably different from the very same place described long ago.',
        'A RIVER\'S COURSE CAN SHIFT GRADUALLY OVER TIME. The path a river follows across the land is not locked in place forever. Over a long stretch of time, a river\'s course can shift, so a map of a river drawn long ago and a map of the very same river drawn today can show it running in noticeably different places, even though no single sudden event caused the whole change.',
        'A COASTLINE\'S EDGE CAN WEAR BACK GRADUALLY OVER TIME. The line where land meets ocean is not fixed either. Over a long stretch of time, the edge of a coastline can move, bit by bit, so an old description of a coastline and a new description of the very same coastline can show the water\'s edge sitting in a different place, even with nothing dramatic described as happening in between.',
        'GRADUAL CHANGE AND SUDDEN CHANGE ARE DIFFERENT. Not every change to a place happens the slow way. Sudden change happens fast enough that a single event -- often over hours or days -- fully explains the whole difference. Gradual change never shows a jump from one day to the next; sudden change does. The changes this lesson is about, a river shifting course and a coastline wearing back, happen the slow way, unless a description specifically says otherwise.',
        'THE BEST WAY TO NOTICE GRADUAL CHANGE IS TO COMPARE TWO DESCRIPTIONS FROM DIFFERENT TIMES. Because gradual change is too slow to notice moment to moment, comparing a description or a map of a place from one time with a description or a map of the very same place from a much later time is what makes the change visible. A difference between the two, with no single sudden event to explain it, is a sign that gradual change has been at work in between.',
      ],
      vocabulary: [
        { term: 'gradual change', definition: 'change that happens in small amounts, over and over, across a long stretch of time, too slow to notice from one moment to the next.' },
        { term: 'sudden change', definition: 'change that happens quickly enough that a single event, often over hours or days, fully explains the difference.' },
        { term: 'course', definition: 'the path that a river follows as it flows across the land.' },
        { term: 'coastline', definition: 'the line where land meets the ocean.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-river-course-two-guidebooks',
      kind: 'worked_example',
      problem:
        'A hiking guidebook printed many years ago describes a wide, looping bend in a river as it crosses a broad valley. A hiking guidebook printed today describes the very same stretch of river with the bend now sitting a noticeable distance away from where the old guidebook placed it. Neither guidebook mentions any flood, storm, or other single dramatic event happening in that stretch of the valley. Explain how the river\'s bend could be in a different place in the two guidebooks, and why that does not mean one of the guidebooks made a mistake.',
      steps: [
        'Notice what is NOT in either guidebook. Neither one describes a flood, a storm, or any other single dramatic event in that stretch of the valley. Whatever moved the river\'s bend, it was not one big moment.',
        'Physical geography is not fixed. A river\'s course looks solid and permanent on the day anyone stands next to it, but the ground a river flows over can be reshaped a little at a time over a long stretch of time.',
        'Because nothing sudden is described, the more likely explanation is that the river\'s course shifted gradually -- a small amount at a time, too little for anyone standing there on a single day to notice -- and those small shifts added up over all the years between the two guidebooks.',
        'That is exactly what gradual change means: change too slow to see moment to moment, but real and measurable once enough time has passed. Neither guidebook is wrong; each one is an accurate description of the river\'s course on the day it was written, and the river simply was not in the same place on those two different days.',
        'Check by rewinding the story. If someone had stood at that same bend every single day between the two guidebooks, each day\'s river would have looked almost exactly like the day before it, because gradual change never shows a jump from one day to the next. That matches "no sudden event is mentioned" and rules out a single dramatic cause.',
        'Now test a contrasting case. Suppose a third guidebook came out only one week after the newest one, and it described the same bend as suddenly cut off, with a new, much shorter channel running straight across what used to be the loop, right after a stretch of unusually heavy rain and flooding. A change that large in only one week would not fit gradual change at all -- it would point to a single sudden event instead, because gradual change never produces that much difference in that little time.',
      ],
      answer:
        'The river\'s course most likely shifted gradually, a small amount at a time over many years, with each single day looking almost the same as the day before it. Since neither guidebook mentions a flood, storm, or other sudden event, a single dramatic cause does not fit -- but many small, unnoticed shifts adding up over a long stretch of time does. Neither guidebook is wrong; each one accurately describes the river on the day it was written.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-coastline-edge-two-photographs',
      kind: 'worked_example',
      problem:
        'An old photograph of a rocky coastline shows a certain point where the land ends and the ocean begins. A new photograph of the very same stretch of coastline, taken many years later, shows that point sitting a noticeable distance farther back from the ocean than it did in the old photograph. Neither photograph shows broken rock, debris, or any other sign of a single dramatic event happening to that coastline. A student wonders whether one huge storm must have caused the whole change. Explain whether that is the best explanation, and describe a case where a single storm would fit better.',
      steps: [
        'Look at what the photographs do NOT show. Neither one shows broken rock scattered at the base of the coastline, nor any other sign that a single, dramatic event tore away a large piece of it all at once.',
        'Physical geography is not fixed, and a coastline is one of the clearest examples: the edge where land meets ocean is not the same forever, even when nothing dramatic is happening to it.',
        'Because no damage or debris is described, the more likely explanation is gradual change: the edge of the coastline wearing back by a small amount, over and over, across the many years between the two photographs, with no single day looking different from the day before it.',
        'That fits the definition of gradual change exactly -- a change built up out of many small changes, too small to notice one at a time, that only becomes obvious when a description from long ago is compared with a description from today.',
        'Check by rewinding the story. If the change had happened gradually, comparing the coastline from one ordinary day to the very next ordinary day, across all those years, would show no visible difference at all, which matches "no damage described" in either photograph.',
        'Now test a contrasting case. Suppose instead there were only two photographs, taken a single week apart, and the second one showed a large new gap in the same coastline with broken rock piled at its base. A change that size in only one week could not be gradual -- gradual change never moves that much ground that fast -- so a single sudden event, such as one very powerful storm, would be the better explanation for that pair of photographs.',
      ],
      answer:
        'Gradual change, not a single storm, is the better explanation. Neither photograph shows any damage or debris from one dramatic event, so the more likely cause is the coastline wearing back by a small amount, over and over, across the years between the photographs. A single storm would better explain a pair of photographs taken only about a week apart that showed sudden damage, such as broken rock at the base of a newly opened gap.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-river-two-maps-and-a-flood',
      kind: 'try_yourself',
      problem:
        'A geography club keeps a map of a river, drawn one spring, showing the river running along the base of a low hill. The club draws a new map of the very same river only one month later, right after an unusually heavy stretch of rain and flooding across the valley. The new map shows the river now flowing through a completely different channel on the far side of the valley. Which kind of change does this pair of maps most likely show?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Sudden change, because a very large difference appeared in only one month, right after a period of heavy rain and flooding that is specifically described as happening between the two maps.', correct: true },
        { id: 'b', text: 'Gradual change, because any difference at all between two maps of the same river always means the river has been slowly shifting its course, no matter what the maps describe.' },
        { id: 'c', text: 'Sudden change, but only because a map is a less reliable way to study a river than actually walking along its bank would be, so the map cannot be trusted at all.' },
        { id: 'd', text: 'Gradual change, because a river can only ever change its course through the same slow process, no matter how much rain falls, how much flooding occurs, or how little time passes between one map and the next.' },
      ],
      expectedAnswer:
        'Sudden change, because a very large difference appeared in only one month, right after a period of heavy rain and flooding that is specifically described as happening between the two maps.',
      hints: [
        'Ask how much time passed between the two maps, and whether either map describes something specific happening in between.',
        'A river\'s course can shift on its own over a long stretch of time, but a change this large, in only one month, needs something more than the slow, everyday kind of change to explain it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-defining-gradual-change',
      kind: 'try_yourself',
      problem:
        'Which statement best describes how physical geography, such as a river\'s course or a coastline\'s edge, behaves over a long stretch of time?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It stays exactly the same forever once it has first formed, so two accurate descriptions of the same place from different years should always match exactly, regardless of how many years passed in between.' },
        { id: 'b', text: 'It only ever changes when a single dramatic event, such as a major storm, reshapes it all at once; without an event like that, the place always stays exactly the same, no matter how many years go by.' },
        { id: 'c', text: 'It changes constantly from one minute to the next, so two descriptions of the same place made only an hour apart could already look completely different, since the ground beneath a river or a coastline is never still for even a moment.' },
        { id: 'd', text: 'It is not fixed, and it can change gradually over a long stretch of time, so a description of the same place made long ago and a description made today can differ even with no single dramatic event in between.', correct: true },
      ],
      expectedAnswer:
        'It is not fixed, and it can change gradually over a long stretch of time, so a description of the same place made long ago and a description made today can differ even with no single dramatic event in between.',
      hints: [
        'Ask whether a description of the very same place always has to match exactly no matter how much time passes, and whether it always needs a single dramatic event to differ.',
        'The correct choice has to allow for change without requiring either extreme -- neither perfectly permanent, nor changing every single minute, nor requiring one big event every time.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-lake-shoreline-two-maps',
      kind: 'try_yourself',
      problem:
        'A park map made many years ago marks the shoreline of a small lake at a certain spot along its northern edge. A new park map of the very same lake, made after nothing more unusual than ordinary weather across those years, marks that part of the shoreline sitting a short distance farther from the water than before. Which explanation fits best, without assuming any single big event happened?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The new map is probably a mistake, since a lake\'s shoreline cannot move at all once the lake itself has formed, and mapmakers must have made an error somewhere.' },
        { id: 'b', text: 'A single powerful storm must have struck that part of the lake, even though neither map describes one, because that is the only way a shoreline can ever move at all, no matter how many years passed.' },
        { id: 'c', text: 'The shoreline most likely shifted gradually, a small amount at a time across the years between the two maps, with no single event needed to explain the difference.', correct: true },
        { id: 'd', text: 'The shoreline only appears different because the two maps were probably drawn using different methods, not because the lake itself changed at all, even though both maps are otherwise described as careful and accurate.' },
      ],
      expectedAnswer:
        'The shoreline most likely shifted gradually, a small amount at a time across the years between the two maps, with no single event needed to explain the difference.',
      hints: [
        'Ask whether anything in the description points to a single dramatic event, or whether the maps simply describe an ordinary stretch of years.',
        'A shoreline does not need one big storm to move. Small amounts of change, repeated across many years, can add up to a noticeable difference on a map.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-permanent-river-and-single-event-only',
      kind: 'misconception_check',
      question:
        'A student explains an old map and a new map of the same valley this way: "A river\'s path never changes once it forms, so the two maps have to show the exact same channel. If they do not match, one map must be wrong, or else a single huge event, like a massive flood, is the only thing that could have moved it." Two separate things are wrong here. What are they?',
      commonErrors: [
        {
          answer: 'A river\'s path never changes once it forms, so the two maps have to show the exact same channel.',
          misconception:
            'Assuming that once a physical feature like a river\'s course has formed, it becomes permanent, because it looks completely solid and unchanging on any single day.',
          correctsTo:
            'WRONG: "a river\'s path never changes once it forms." CORRECT: "physical geography is not fixed -- a river\'s course, a coastline\'s edge, and other physical features can change over time, even though they look the same on any one day a person visits them." Two accurate maps of the very same river, made at two different times, can show its course in two different places.',
        },
        {
          answer: 'If they do not match, one map must be wrong, or else a single huge event, like a massive flood, is the only thing that could have moved it.',
          misconception:
            'Assuming that any noticeable difference between an old description and a new one has to come from either a mistake or one dramatic event, because gradual change is too slow to picture happening on its own.',
          correctsTo:
            'A difference between two accurate maps does not require a mistake or a single huge event. Most physical geography changes gradually: a small amount of change, over and over, across many years, with no single day looking any different from the day before it. Those small changes add up, so two honest, accurate maps made years apart can legitimately show a river\'s course, or a coastline\'s edge, in two different places.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Physical geography -- such as a river\'s course or a coastline\'s edge -- is not fixed. It can look the same for years and still be different from what it once was.',
        'Most of this change is gradual: small amounts of change, over and over, too slow to notice from one moment to the next, that add up over a long stretch of time.',
        'A river\'s course can shift gradually over many years, so an old description of a river and a new description of the very same river can differ even with no single event to explain it.',
        'A coastline can wear back gradually over many years the same way, with no single storm needed to explain a difference between an old description and a new one.',
        'Gradual change and sudden change are different. Sudden change happens fast enough that one clear event explains the whole difference; gradual change never shows a jump from one day to the next.',
        'The best way to notice gradual change is to compare a description of a place from one time with a description of the very same place from a much later time.',
        'A difference between an old description and a new description does not always mean one big event happened. It is more often a sign that many small changes have been adding up the whole time.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.3', cedTitle: 'How Physical Geography Changes Over Time' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
