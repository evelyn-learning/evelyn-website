/**
 * Grade 7 World Geography — Geography Tools: Scale, Legend & Direction.
 *
 * Procedure-led, shaped after the row 1.2 exemplar (National Geography
 * Standard 1). One procedure runs the lesson: before you read a map, check
 * its title, its legend, its scale and its compass rose -- each one answers a
 * different question.
 *
 * The trap this row exists to kill is the SCALE REVERSAL. Large scale means a
 * SMALL area shown in great detail; small scale means a LARGE area shown with
 * little detail. That is the opposite of what the words sound like, and every
 * item below is built around it.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO MAPS AND NO IMAGES in this course.
 * Every map in this file is described in words and every item is solvable
 * from the text printed inside it. All example maps are invented places -- a
 * park, a school campus, a small town -- so that no real-place claim is made.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7GEO_U1_MAP_ELEMENTS_SCALE_AND_DIRECTION: LessonPlan = {
  id: 'evelyn.ms.m7geo.map-elements-scale-and-direction.v1',
  title: 'Scale, Legend & Direction',
  curriculum: 'MS',
  grade: '7',
  subject: 'social-studies',
  topic: 'grade-7-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm7geo.map-elements-scale-and-direction',
      standard: 'M7GEO-1.3',
      description:
        'Identify the elements every usable map carries -- title, legend, scale, compass rose and grid -- and use scale and direction correctly, including the rule that a large-scale map shows a small area in great detail (National Geography Standard 1: how to use maps and other geographic representations to acquire, process and report information).',
    },
  ],
  prerequisites: ['m7geo.latitude-longitude-and-location'],
  followUps: ['m7geo.regions-and-place'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that a map without its elements is unreadable, using a map the student has actually held.',
      script:
        'Picture the paper map they hand you at the gate of a big amusement park. There is a little cartoon of a roller coaster, a fork and knife, and a tiny letter I in a circle. You already knew what those meant, because a box in the corner told you. Now imagine that box is missing. Suddenly the whole map is a pile of colored shapes. That corner box is the legend, and it is one of five things every useful map carries. Today we learn all five, and we fix the one piece of map language that fools almost everybody the first time they meet it: what map makers mean when they say a map is large scale.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-map-elements',
      kind: 'concept',
      goal: 'Teach each map element by the question it answers, then fix the scale reversal head on.',
      keyIdeas: [
        'EVERY USABLE MAP CARRIES THE SAME FIVE PARTS, AND EACH ONE ANSWERS A DIFFERENT QUESTION. The TITLE answers what does this map show. The LEGEND, also called the key, answers what do these symbols and colors mean. The SCALE answers how far is that in real life. The COMPASS ROSE answers which way is north. A GRID, when there is one, answers how do I tell somebody where to look. Learn them as five questions, not five words, and you will never wonder which part to check.',
        'THE LEGEND IS NOT DECORATION. It is the dictionary for the map, and the map maker chose the symbols, so nothing on the page is guaranteed to mean what you assume. A blue line is usually a river, but on one map it is a bus route. A green patch is usually a park, but on a farming map it is cropland. WRONG: "I can tell what the symbols mean by looking at them." CORRECT: "I read the legend first, then I read the map." Skipping the legend is how students confidently misread a map they could have read perfectly.',
        'SCALE IS THE RELATIONSHIP BETWEEN DISTANCE ON THE PAGE AND DISTANCE ON THE GROUND, AND THE WORDS ARE THE REVERSE OF WHAT THEY SOUND LIKE. A LARGE-SCALE map shows a SMALL area in GREAT detail -- a map of a few city streets, with every building drawn. A SMALL-SCALE map shows a LARGE area with LITTLE detail -- a map of the whole world, where an entire country is a small patch of color. WRONG: "Large scale means it covers a large area." CORRECT: "Large scale means a small area drawn large, so you can see the detail."',
        'HERE IS WHY THE WORDS WORK THAT WAY: THINK OF SCALE AS A FRACTION OF REALITY. A map shrinks the real world down to fit the page, and the scale says how much shrinking happened. On a street map where one inch stands for two hundred feet, the world has been shrunk about two thousand four hundred times, because two hundred feet is two thousand four hundred inches. That is a fairly large fraction of reality left on the page, so it is a large-scale map. On a map where one inch stands for fifty miles, the world has been shrunk more than three million times. That is a tiny fraction of reality left on the page, so it is a small-scale map. A smaller fraction of reality on the page means a bigger area covered and less detail.',
        'A MAP GIVES ITS SCALE IN ONE OF TWO WAYS. A WRITTEN SCALE says it in words, such as one inch represents ten miles. A BAR SCALE is a small ruler printed on the map with real distances marked along it, such as a bar where one inch of bar is labeled two hundred feet. The bar scale has one advantage worth knowing: if the map is shrunk on a copier, the bar shrinks with it and stays correct, while a written scale would then be wrong.',
        'DIRECTION COMES FROM THE COMPASS ROSE, AND NORTH BEING AT THE TOP IS A CONVENTION, NOT A LAW. The four CARDINAL directions are north, south, east and west. The four INTERMEDIATE directions sit between them: northeast, northwest, southeast and southwest. Most maps are drawn with north at the top because everyone agreed to do it that way, which is exactly why the compass rose still has to be there. A hiking map can be turned sideways to fit a long trail on the page. It is still a correct map, as long as the compass rose tells you which way north actually points. WRONG: "North is always up." CORRECT: "North is wherever the compass rose says it is, and it is usually up because of habit."',
      ],
      vocabulary: [
        { term: 'legend', definition: 'the box on a map that explains what each symbol, line and color stands for. Also called the key.' },
        { term: 'scale', definition: 'the relationship between a distance measured on the map and the matching distance on the ground.' },
        { term: 'large-scale map', definition: 'a map that shows a small area in great detail, such as a map of a few streets.' },
        { term: 'small-scale map', definition: 'a map that shows a large area with little detail, such as a map of the world.' },
        { term: 'bar scale', definition: 'a small ruler printed on a map with real distances marked along it.' },
        { term: 'written scale', definition: 'a scale stated in words, such as one inch represents ten miles.' },
        { term: 'compass rose', definition: 'the symbol on a map that shows which way north, south, east and west point.' },
        { term: 'intermediate directions', definition: 'the directions between the cardinal ones: northeast, northwest, southeast and southwest.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-read-legend-and-scale',
      kind: 'worked_example',
      problem:
        'A map of Hillcrest Park has a bar scale where one inch stands for 200 feet. Its legend shows a triangle for picnic tables, a dashed line for walking trails, and a small blue oval for the pond. On the map, a triangle sits 3 inches in a straight line from the blue oval, and the triangle is directly to the right of the oval on the page. The compass rose on this map points north toward the top of the page. Say what the triangle is, how far it really is from the pond, and in which direction it lies.',
      steps: [
        'Start with the legend, before anything else. The legend says a triangle means picnic tables and a blue oval means the pond. So the shape 3 inches from the pond is a set of picnic tables, not a mountain and not a campsite. Reading the legend first is the whole procedure.',
        'Now go to the scale to turn page inches into real feet. The bar scale says one inch stands for 200 feet.',
        'Multiply the measured page distance by what one inch stands for. Three inches on the page, at 200 feet per inch, is 200 plus 200 plus 200, which is 600 feet on the ground.',
        'Now use the compass rose for direction. The compass rose points north toward the top of the page. When north is at the top, the right side of the page is east. The picnic tables are directly to the right of the pond, so they lie east of the pond.',
        'Check that you answered with the ground distance and not the page distance. The picnic tables are 3 inches away on paper, but nobody walks 3 inches. The real answer is 600 feet.',
        'Notice that you needed three different elements for one sentence: the legend told you WHAT, the scale told you HOW FAR, and the compass rose told you WHICH WAY. That is why maps carry all of them.',
      ],
      answer:
        'The triangle is a set of picnic tables. They are 600 feet from the pond on the ground, and they lie east of it.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-which-map-is-large-scale',
      kind: 'worked_example',
      problem:
        'Two maps are printed on sheets of paper the same size. Map A is titled Fairview County and its written scale reads one inch represents fifty miles. Map B is titled Downtown Fairview and its written scale reads one inch represents two hundred feet. Which one is the large-scale map, and how can you tell without being told the answer?',
      steps: [
        'Ignore what the words large and small sound like for a moment. Scale is about how much the real world was shrunk to fit the page, so go straight to the two written scales and compare them.',
        'Look at Map B first. One inch of paper stands for 200 feet of ground. Two hundred feet is 2400 inches, because 200 times 12 is 2400. So Map B shrank reality about 2400 times.',
        'Now Map A. One inch of paper stands for 50 miles of ground. Fifty miles is a very long way, and once you turn it into inches it is more than three million of them. So Map A shrank reality more than three million times.',
        'Compare the two amounts of shrinking. Shrinking 2400 times leaves a much larger fraction of reality on the page than shrinking more than three million times. Bigger fraction left on the page means LARGE scale, so Map B is the large-scale map.',
        'Sanity-check it against what each map can show. Map B covers a downtown, so it has room to draw individual streets and buildings: small area, great detail, large scale. Map A covers a whole county on the same sheet, so a whole town on it is barely a dot: large area, little detail, small scale.',
        'Keep the sentence that makes this stick: large scale, small area, lots of detail. If you remember only that one line, you will get every scale question right.',
      ],
      answer:
        'Map B, the downtown map, is the large-scale map. It shows a small area in great detail because it shrank reality far less than Map A did.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-large-scale-meaning',
      kind: 'try_yourself',
      problem:
        'Two maps are printed on paper of the same size. Map 1 shows an entire continent. Map 2 shows four blocks of one town. Which statement is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Map 1 is the large-scale map, because it covers a large area of the world.' },
        { id: 'b', text: 'Map 2 is the large-scale map, because it shows a small area in great detail.', correct: true },
        { id: 'c', text: 'Map 2 is the small-scale map, because it covers only a small piece of ground.' },
        { id: 'd', text: 'Both maps are large-scale maps, because both are printed on large sheets of paper.' }
      ],
      expectedAnswer: 'Map 2 is the large-scale map, because it shows a small area in great detail.',
      hints: [
        'Scale is not about how big the sheet of paper is, and it is not about how big the area is. It is about how much the real world was shrunk to fit the page.',
        'Say the memory line to yourself: large scale, small area, lots of detail. Which of these two maps can show individual streets?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-use-the-scale',
      kind: 'try_yourself',
      problem:
        'A map of the Maple Ridge school campus has a written scale that reads one inch represents 200 feet. On the map, the gym and the cafeteria are 4 inches apart in a straight line. Which statement gives the real distance correctly?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'They are 200 feet apart, because the scale says 200 feet.' },
        { id: 'b', text: 'They are 50 feet apart, because 200 divided by 4 is 50.' },
        { id: 'c', text: 'They are 800 feet apart, because 4 times 200 feet is 800 feet.', correct: true },
        { id: 'd', text: 'They are 204 feet apart, because 200 plus 4 is 204.' }
      ],
      expectedAnswer: 'They are 800 feet apart, because 4 times 200 feet is 800 feet.',
      hints: [
        'The scale tells you what ONE inch is worth on the ground. You have four of those inches.',
        'Four inches means four helpings of 200 feet. Add 200 four times, or multiply, but do not divide and do not add the two numbers together.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-north-is-a-convention',
      kind: 'try_yourself',
      problem:
        'A hiking map of Cedar Hollow is printed sideways so that a long trail fits on the page. Its compass rose shows the north arrow pointing toward the right edge of the paper. Which statement is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The map is wrong, because north must always be at the top of a map.' },
        { id: 'b', text: 'The map is fine. North is usually at the top only by convention, and the compass rose shows the real orientation.', correct: true },
        { id: 'c', text: 'The map is fine, but the compass rose should be ignored once the paper is turned sideways.' },
        { id: 'd', text: 'The map is fine only if it also has a bar scale instead of a written scale.' }
      ],
      expectedAnswer: 'The map is fine. North is usually at the top only by convention, and the compass rose shows the real orientation.',
      hints: [
        'Ask what the compass rose is for. If north were always at the top, would a map need one at all?',
        'North at the top is a habit that map makers agreed on, not a rule of the Earth. The compass rose exists exactly so a map can be oriented any way and still be read correctly.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-scale-reversal',
      kind: 'misconception_check',
      question:
        'A student says: "A map of the whole world has to be a large-scale map, because the world is the largest thing there is. And since both of my maps are the same size, I can just compare distances on them by eye." Where does that reasoning go wrong, twice?',
      commonErrors: [
        {
          answer: 'A world map is a large-scale map because it shows a large area.',
          misconception:
            'Reading the word large as a description of the AREA COVERED instead of the size of the fraction of reality left on the page. The everyday meaning of the word points the student in exactly the wrong direction.',
          correctsTo:
            'Scale describes how much the real world was shrunk to fit the page, not how much ground the map covers. A world map shrinks reality by an enormous amount, leaving a tiny fraction of it on the page, so it is a SMALL-scale map. A map of a few streets shrinks reality far less, leaving a large fraction of it on the page, so it is a LARGE-scale map. The rule reads backwards from what it sounds like, so memorize the sentence: large scale, small area, lots of detail. Small scale, large area, little detail.',
        },
        {
          answer: 'Two maps printed on the same size paper can be compared by eye, because the paper is the same.',
          misconception:
            'Assuming that maps of the same physical size share a scale, so an inch on one map is worth the same as an inch on the other.',
          correctsTo:
            'Every map chooses its own scale, and the size of the paper says nothing about it. One inch on a downtown map can stand for 200 feet while one inch on a county map stands for 50 miles, even though both sheets are the same size. Comparing them by eye would make the downtown look almost as wide as the county. Read the scale on each map first, convert both to real ground distances, and only then compare.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Five elements, five questions: the TITLE says what the map shows, the LEGEND says what the symbols mean, the SCALE says how far that is in real life, the COMPASS ROSE says which way is north, and a GRID says how to tell somebody where to look.',
        'Read the legend BEFORE you read the map. Symbols mean whatever the map maker says they mean, not what they look like.',
        'LARGE SCALE, SMALL AREA, LOTS OF DETAIL -- a city street map. SMALL SCALE, LARGE AREA, LITTLE DETAIL -- a world map. The words are the reverse of what they sound like.',
        'The reason: scale is the fraction of reality left on the page. A smaller fraction means more shrinking, which means a bigger area covered and less detail.',
        'A written scale states the relationship in words, such as one inch represents ten miles. A bar scale is a little printed ruler, and it stays correct even if the map is copied at a different size.',
        'Cardinal directions are north, south, east and west. Intermediate directions are northeast, northwest, southeast and southwest. North at the top is a convention, so trust the compass rose, and never compare two maps by eye without checking both scales.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.3', cedTitle: 'Scale, Legend & Direction' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
