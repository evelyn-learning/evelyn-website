/**
 * Grade 6 World Geography — Reading & Using Maps: Parts of a Map.
 *
 * PROCEDURE-LED (National Geography Standard 1), shaped after
 * `m6geo-u2-hemispheres-equator-and-prime-meridian.ts`. There is no picture
 * anywhere in this lesson -- every map is described fully in words, and the
 * whole routine is: hear a question, decide which of the four parts is built
 * to answer that kind of question, then answer it. The trap this plan is
 * built to kill is matching the wrong part to a question -- reaching for the
 * legend when a question is really about distance, or the title when a
 * question is really about direction -- rather than failing to notice a part
 * exists at all.
 *
 * SCOPE GUARD: this row IDENTIFIES four parts of a map -- the title, the
 * legend, the compass rose, and the scale bar -- and states, for each one,
 * the single question it is built to answer. It never turns a scale bar into
 * a ratio to compute with: no item measures a page distance and multiplies it
 * by a scale factor to get a real-world distance, which is the reasoning
 * procedure Grade 7 teaches. It never says the words "large scale" or "small
 * scale" and never introduces the large-scale/small-scale reversal. It never
 * mentions a map grid. All three of those, plus reading or writing a full
 * latitude-longitude coordinate, belong to Grade 7
 * (`m7geo-u1-map-elements-scale-and-direction.ts`), which teaches these same
 * four parts (plus a grid) and then goes on to compute real distances from a
 * scale and to fix the scale-reversal trap. What IS deliberately allowed,
 * because that neighboring Grade 7 row covers the identical four names: this
 * lesson describes a scale bar's own printed marks in words -- for example, a
 * mark at one end labeled 0 and a mark at the other end labeled a stated
 * distance -- and says only that those marks show about how big a distance on
 * the map really is. Reading that a scale bar carries real-world distance
 * marks is IDENTIFY depth; doing arithmetic with those marks is not, and no
 * item here asks for that arithmetic. Sideways, this row does not teach
 * choosing among map types (political, physical, thematic), which is the very
 * next Grade 6 row, `types-of-maps`.
 *
 * DEPTH CEILING NOTE FOR THE FAN-OUT: every keyIdea and every item in this
 * lesson is answered by IDENTIFY or LOCATE. Nothing here is a closed
 * typology of a mechanism's categories -- the four map parts are a plain
 * vocabulary set, the same way "mountain, plain, plateau, hill, valley" is
 * one elsewhere in this course -- and nothing here asks the student to
 * combine two links of reasoning. The row's own scope line asks for the ONE
 * question each part answers, not for the part's name in isolation, so every
 * try_yourself item below gives a question and asks which part answers it,
 * never "what is this part called."
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped
 * Grade 7 Geography bank the keyed answer was the strictly longest choice 67%
 * of the time, and 94% at difficulty 4; chance with four choices is 25%). All
 * four choices in every item here are the same shape -- "It is the
 * <part>, and it answers the question of <question>" -- so every distractor
 * carries a full, real question, not a short label, and no key was built to
 * be the longest choice BECAUSE it is the key. Measured as a diagnostic, not
 * a score: the key is the strictly longest choice in 2 of the 3 items --
 * item two (99 characters, 5 ahead of the next-longest distractor at 94) and
 * item three (116 characters, 17 ahead of the next-longest distractor at 99,
 * because the correct choice there genuinely carries an extra clause, "and
 * from that, every other direction too," that item one and two's correct
 * choices do not need). Item one's key is the shortest of its four choices
 * (79 characters against a 99-character distractor). Two of three is a
 * plausible chance outcome on its own (chance alone produces 2 about 14% of
 * the time in a three-item file) and is reported here, not corrected toward
 * zero; see the note in `m6geo-u3-earths-moving-plates.ts` for why driving a
 * file to zero is the same tell inverted. The three keys sit at ids a, b and
 * c -- the id set `(2 + 1) mod 4 = 3` requires, omitting d.
 *
 * NOTE ON prerequisites/followUps: this row's real chain is 1.4
 * (site-and-situation) -> 2.1 (this row) -> 2.2 (types-of-maps), all drawn
 * from the signed fan-out contract's chain table, and both fields are
 * populated with those real loIds, not left empty.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every map in this file --
 * its title text, its legend entries, its compass-rose orientation, and its
 * scale-bar marks -- is written out in words precise enough to reason from,
 * and every item is solvable entirely from the text printed inside it. Every
 * map named here (Cedar Trail, Sunrise Park, Blue Hollow Camp, Foggy Ridge)
 * is invented, matching this course's invented-place default for a row that
 * needs no real place at all.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6GEO_U2_PARTS_OF_A_MAP: LessonPlan = {
  id: 'evelyn.ms.m6geo.parts-of-a-map.v1',
  title: 'Parts of a Map',
  curriculum: 'MS',
  grade: '6',
  subject: 'social-studies',
  topic: 'grade-6-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm6geo.parts-of-a-map',
      standard: 'M6GEO-2.1',
      description:
        'Identify the title, legend, compass rose, and scale bar on a map and state the one question each part is built to answer (National Geography Standard 1: how to use maps and other geographic representations to acquire, process and report information).',
    },
  ],
  prerequisites: ['m6geo.site-and-situation'],
  followUps: ['m6geo.types-of-maps'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that a map missing its built-in parts is just shapes, before any part is named.',
      script:
        'Picture opening a brand new video game and the level map fills the screen for the first time. There is a name printed near the top, a small box packed with tiny pictures in one corner, an arrow with a letter on it in another corner, and a short marked bar sitting near the edge. Ignore all four of those and stare only at the colored shapes, and you cannot tell where the exit is, which way you are facing, or how far off the nearest treasure chest really is. Each one of those four pieces exists to answer exactly one question, and it never answers any of the other three. Learn which piece answers which question, and you can pick up a map you have never seen before and read it in seconds.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-four-parts-four-questions',
      kind: 'concept',
      goal: 'Install the four map parts and the one question each one is built to answer.',
      keyIdeas: [
        'A MAP IS BUILT FROM PARTS, AND EACH PART ANSWERS ITS OWN QUESTION. Without these parts a map is only colored shapes and lines with no way to check what any of it means. Every basic map carries four of them: the TITLE, the LEGEND, the COMPASS ROSE, and the SCALE BAR. Learn each one as a question it answers, not just as a word.',
        'THE TITLE ANSWERS WHAT DOES THIS MAP SHOW. It is the words printed on a map, usually near the top, naming the exact place or subject the map is about. A title reading "Cedar Trail Map" tells you the map shows one trail called Cedar Trail, not an entire state and not a different trail.',
        'THE LEGEND, ALSO CALLED THE KEY, ANSWERS WHAT DO THESE SYMBOLS AND COLORS MEAN. It is usually a short list, often inside its own small box, that pairs each symbol used on the map with what that symbol stands for -- a wavy blue line paired with the word "stream," or a small triangle paired with the words "picnic table." Each map picks its own symbols, so what a shape means belongs to that map\'s own legend, not to a shape you remember from a different map.',
        'THE COMPASS ROSE ANSWERS WHICH WAY IS NORTH, AND FROM THAT, EVERY OTHER DIRECTION. It is a small drawing with an arrow, usually labeled N, and shorter lines branching off it to show the other three main directions -- south opposite the arrow, east and west to either side. North, south, east, and west are called the CARDINAL DIRECTIONS. Once you know where north is on a map, every other direction on that same map follows from it.',
        'THE SCALE BAR ANSWERS ABOUT HOW BIG A DISTANCE ON THE MAP REALLY IS. It is a short, straight bar printed on the map, marked with a real-world distance -- for example, a mark at one end labeled 0 and a mark at the other end labeled a stated distance, such as 1 mile. Those marks tell you what real-world distance goes with a length along that bar. It is the only one of the four parts that connects a length on the page to a distance in the real world.',
        'MATCH THE QUESTION TO THE PART, NOT THE PART TO A GUESS. A question about a map\'s overall subject is answered by the title. A question about what a symbol means is answered by the legend. A question about which way something lies is answered by the compass rose. A question about how far apart two things really are is answered by the scale bar. If a map is missing the part built for your question, no amount of staring at the shapes gives you the answer.',
      ],
      vocabulary: [
        { term: 'title', definition: 'the words printed on a map, usually near the top, naming what the whole map shows.' },
        { term: 'legend', definition: 'also called a key; the list on a map, usually in a small box, that pairs each symbol, line, and color with what it stands for.' },
        { term: 'compass rose', definition: 'the small drawing on a map, usually an arrow labeled N with shorter lines branching off it, that shows which way is north and, from that, the other three main directions.' },
        { term: 'scale bar', definition: 'a short, straight bar printed on a map and marked with a real-world distance, showing about how big a length on the map really is.' },
        { term: 'cardinal direction', definition: 'one of the four main directions: north, south, east, and west.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-match-question-to-part',
      kind: 'worked_example',
      problem:
        'A student is holding the Cedar Trail Map for the first time. Its title, printed near the top, reads "Cedar Trail Map." Its legend lists a dashed line paired with "hiking trail," a blue triangle paired with "campsite," a brown square paired with "ranger station," and a green circle paired with "picnic area." Its compass rose shows an arrow labeled N pointing straight up toward the top of the page. The student has three questions. One: what is this whole map showing? Two: what does a brown square stand for on this map? Three: the ranger-station symbol sits directly above the campsite symbol on the page -- which direction is the ranger station from the campsite? For each question, name the one part that answers it, and give the answer.',
      steps: [
        'Take question one. "What is this whole map showing" is a question about the map\'s overall subject, and that is exactly what the TITLE is built to answer. This map\'s title reads "Cedar Trail Map," so the whole map shows Cedar Trail.',
        'Take question two. "What does a brown square stand for" is a question about what a symbol means, and that is exactly what the LEGEND is built to answer. This map\'s legend pairs a brown square with the words "ranger station," so a brown square stands for a ranger station.',
        'Take question three. "Which direction is the ranger station from the campsite" is a question about direction, and that is exactly what the COMPASS ROSE is built to answer. This map\'s compass rose shows the arrow labeled N pointing toward the top of the page, so the top of the page is north. The ranger station sits directly above the campsite on the page, and above means toward the top of the page, so the ranger station is north of the campsite.',
        'Check the direction answer by rewinding to the compass rose alone, without the rest of the map. It states only that the arrow labeled N points to the top of the page. On this page, directly above cannot mean anything but north, so the answer holds.',
        'Test a contrasting case so the routine is not overlearned on one layout. Imagine a different map whose compass rose instead showed the arrow labeled N pointing toward the right edge of its page. On that map, a symbol sitting directly above another symbol on the page would NOT be north -- the same page position gives a different real-world direction depending on what that particular map\'s own compass rose says. Always read the compass rose printed on the map in front of you.',
      ],
      answer:
        'The title answers question one: the map shows Cedar Trail. The legend answers question two: a brown square stands for a ranger station. The compass rose answers question three: the ranger station lies north of the campsite, because the arrow labeled N points to the top of the page and the ranger station sits directly above the campsite there.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-fixing-a-mixed-up-part',
      kind: 'worked_example',
      problem:
        'Looking at the same Cedar Trail Map, a student says: "I can tell exactly how far apart the picnic area and the campsite are, just by reading the legend. And if I wanted to know which way is west on this map, I would check the scale bar." Both sentences point to the wrong part. Correct each one.',
      steps: [
        'Take the first sentence. WRONG: "I can tell how far apart two places are by reading the legend." The legend\'s job is to say what a symbol MEANS -- a brown square means a ranger station -- and nothing in that job says how big or how far apart anything is.',
        'Ask which part actually answers a "how far apart" question. That is exactly the question the SCALE BAR is built to answer, because its marks show a real-world distance. CORRECT: "I would check the scale bar to get an idea of about how far apart the picnic area and the campsite are."',
        'Take the second sentence. WRONG: "I would check the scale bar to find out which way is west." The scale bar\'s marks are about distance, and nothing in that job points anywhere.',
        'Ask which part actually answers a "which way" question. That is exactly the question the COMPASS ROSE is built to answer, since it shows which way is north and, from that, every other direction too. CORRECT: "I would check the compass rose to find out which way is west."',
        'Check both fixes by rewinding to what each part is described as doing. The legend is described only as a list pairing symbols with meanings -- nothing about size or distance is in that description. The scale bar is described only as marks showing a real-world distance -- nothing in that description points anywhere.',
        'Test a contrasting case. If the student had instead asked "what does the green circle mean," the LEGEND would be the right part to check, because that question is about a symbol\'s meaning, not about distance or direction. The same four parts, matched to a different question, give a different correct answer -- the routine is to match the question, never to memorize one fixed answer.',
      ],
      answer:
        'Both sentences named the wrong part. A "how far apart" question is answered by the scale bar, not the legend. A "which way" question is answered by the compass rose, not the scale bar. The legend only tells you what a symbol means.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-title-answers-what',
      kind: 'try_yourself',
      problem:
        'A hiker unfolds a paper that has a single line of large print near the top reading "Sunrise Park Map," with nothing else printed on the page yet. Which part of a map is that line of print, and what question does it answer?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It is the title, and it answers the question of what this whole map is showing.', correct: true },
        { id: 'b', text: 'It is the legend, and it answers the question of what the symbols and colors on this map mean.' },
        { id: 'c', text: 'It is the compass rose, and it answers the question of which way is north on this map.' },
        { id: 'd', text: 'It is the scale bar, and it answers the question of about how big a distance on this map really is.' },
      ],
      expectedAnswer: 'It is the title, and it answers the question of what this whole map is showing.',
      hints: [
        'Ask what kind of question a single short line of print near the top of a map is built to answer -- is it about symbols, direction, distance, or the map\'s whole subject?',
        'A legend explains symbols, a compass rose gives direction, and a scale bar gives real-world distance. None of those three is a plain sentence naming the map\'s subject.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-scale-bar-answers-what',
      kind: 'try_yourself',
      problem:
        'A camper studies the Blue Hollow Camp Map and notices a short bar near the bottom corner. The bar is split into two equal sections by a tick mark: the left end of the bar is marked 0, and the right end is marked 200 yards. Which part of the map is that bar, and what question does it answer?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It is the legend, and it answers the question of what the symbols and colors on this map mean.' },
        { id: 'b', text: 'It is the scale bar, and it answers the question of about how big a distance on this map really is.', correct: true },
        { id: 'c', text: 'It is the compass rose, and it answers the question of which way is north on this map.' },
        { id: 'd', text: 'It is the title, and it answers the question of what this whole map is showing.' },
      ],
      expectedAnswer: 'It is the scale bar, and it answers the question of about how big a distance on this map really is.',
      hints: [
        'A bar marked with real-world distances at each end is not explaining a symbol and it is not pointing anywhere -- ask what kind of question a distance marking is built to answer.',
        'The title names the subject, the legend explains symbols, and the compass rose gives direction. Only one of the four parts is marked with real-world distances.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-compass-rose-answers-what',
      kind: 'try_yourself',
      problem:
        'On the Foggy Ridge Trail Map, a small drawing near the corner shows an arrow labeled N pointing toward the top of the page, with three shorter lines branching off it to show the other three main directions. Which part of the map is that drawing, and what question does it answer?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It is the scale bar, and it answers the question of about how big a distance on this map really is.' },
        { id: 'b', text: 'It is the title, and it answers the question of what this whole map is showing.' },
        { id: 'c', text: 'It is the compass rose, and it answers the question of which way is north, and from that, every other direction too.', correct: true },
        { id: 'd', text: 'It is the legend, and it answers the question of what the symbols and colors on this map mean.' },
      ],
      expectedAnswer: 'It is the compass rose, and it answers the question of which way is north, and from that, every other direction too.',
      hints: [
        'An arrow labeled N with shorter lines branching off it carries no marked distance and pairs with no list of symbols -- ask what kind of question an arrow like that is built to answer.',
        'The title names the subject, the legend explains symbols, and the scale bar shows distance. Only one of the four parts uses an arrow to show which way is north.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-legend-and-title-borrow-jobs',
      kind: 'misconception_check',
      question:
        'A student says: "The legend on a map tells you about how far apart two places really are. And any map with words printed near the top must have a title that tells you which way is north." What is wrong with each half of that?',
      commonErrors: [
        {
          answer: 'The legend on a map tells you about how far apart two places really are.',
          misconception:
            'Treating the legend as the part that explains everything on the page, since it is often the most detailed-looking box on a map, instead of noticing that its list only pairs symbols with meanings.',
          correctsTo:
            'The legend explains what each symbol, line, or color stands for -- nothing more. WRONG: "the legend tells you how far apart two places are." CORRECT: "the scale bar tells you about how far apart two places really are, because its marks show a real-world distance; the legend only tells you what a symbol means."',
        },
        {
          answer: 'Any map with words printed near the top must have a title that tells you which way is north.',
          misconception:
            'Mixing up two parts that can both sit near the top corner of a map -- the title, which is plain printed words naming the map\'s subject, and the compass rose, which is a small drawing with an arrow, not printed words.',
          correctsTo:
            'A title is words that name what the whole map shows, and it says nothing about direction. WRONG: "the title tells you which way is north." CORRECT: "the compass rose, a small drawing with an arrow labeled N, tells you which way is north; the title only names the map\'s subject."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Every basic map carries four parts, and each one is built to answer exactly one question.',
        'The title answers what does this map show.',
        'The legend, also called the key, answers what do the symbols and colors mean -- and each map picks its own symbols, so check that map\'s own legend.',
        'The compass rose answers which way is north, and from that, every other direction too.',
        'The scale bar answers about how big a distance on the map really is, using marks for a real-world distance.',
        'The legend does not tell you how far apart two things are -- that is the scale bar\'s job.',
        'The title does not tell you which way is north -- that is the compass rose\'s job.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.1', cedTitle: 'Parts of a Map' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
