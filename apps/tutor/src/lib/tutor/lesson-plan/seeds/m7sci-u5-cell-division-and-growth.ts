/**
 * Grade 7 Science (Life Science) — Growth & Reproduction: Cell Division & Growth.
 *
 * Concept-led (NGSS MS-LS1-4, and MS-LS1-1 for the "all organisms are made of
 * cells" thread). The headline idea is the one students most reliably get
 * backwards: an organism grows mainly by making MORE cells, not by its cells
 * swelling up. The surface-area-versus-volume reason cells stay small is told
 * in words only — there is no formula and no diagram anywhere in this course.
 *
 * Register note: mitosis is named once as the process body cells use, and the
 * phases are deliberately left out. Prophase/metaphase/anaphase/telophase,
 * spindles and centromeres belong to the high-school course, not to twelve
 * year olds meeting cell division for the first time.
 *
 * Accuracy note: no cell-replacement rates and no cell counts are stated as
 * figures. Those numbers are estimates that move, and a wrong one is very hard
 * for a student to unlearn.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7SCI_U5_CELL_DIVISION_AND_GROWTH: LessonPlan = {
  id: 'evelyn.ms.m7sci.cell-division-and-growth.v1',
  title: 'Cell Division & Growth',
  curriculum: 'MS',
  grade: '7',
  subject: 'science',
  topic: 'grade-7-life-science',
  locale: 'en',
  los: [
    {
      id: 'm7sci.cell-division-and-growth',
      standard: 'M7SCI-5.1',
      description:
        'Explain that organisms grow, repair damage and replace worn-out cells by cell division, which copies the DNA first and produces two new cells carrying the same genetic information as the original, and argue from the relationship between a cell surface and its volume why cells stay small (NGSS MS-LS1-4).',
    },
  ],
  prerequisites: ['m7sci.matter-and-energy-in-organisms'],
  followUps: ['m7sci.asexual-and-sexual-reproduction'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set up growth and healing as the same everyday process, and plant the question the lesson answers.',
      script:
        'Look at a pair of shoes you wore two years ago. They do not fit anymore. Something about your feet got bigger. Now think about the last time you scraped your knee. A week later the skin had closed over, and nobody stitched it shut. Here is the question worth asking, and most people guess it wrong the first time. When your foot got bigger, did the cells inside it swell up like tiny balloons, or did something else happen? Today we answer that, and the answer also explains the scraped knee, and why your body keeps doing this for your whole life.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-cell-division',
      kind: 'concept',
      goal: 'Growth as more cells, what division produces, why the DNA is copied first, why cells stay small, and where the new material comes from.',
      keyIdeas: [
        'GROWING MEANS MORE CELLS, NOT BIGGER CELLS — this is the headline, and it is the thing almost everyone gets backwards. When you grow taller, your cells do not puff up. Your body makes MORE of them. A cell in your finger is about the same size as a cell in an elephant leg; the elephant simply has far more of them. WRONG: "I grew because my cells got bigger." CORRECT: "I grew because my body made more cells."',
        'WHAT CELL DIVISION PRODUCES — one cell splits into TWO new cells, and both carry the SAME genetic information as the cell they came from. That only works because the DNA is COPIED FIRST. The cell makes a complete second set of instructions before it splits, so each new cell walks away with a full set rather than half of one. For the ordinary cells of your body, the name of this process is MITOSIS. You do not need the stages of it yet; you need the result.',
        'DIVISION IS ALSO REPAIR AND REPLACEMENT — growth is only part of the job. When you scrape your knee, the cells at the edge of the scrape divide until the gap is filled. Your body also keeps replacing cells that wear out, such as the cells of your skin, your blood and the lining of your gut. That replacement never stops. Adults are not finished; they are simply replacing at about the same rate they lose, so their size holds steady instead of increasing.',
        'WHY CELLS STAY SMALL — a cell takes in food and oxygen and pushes out waste, and all of that traffic has to cross the cell membrane, which is the outer surface. Now imagine the cell growing. The INSIDE of the cell grows faster than the OUTSIDE surface does. So a big cell has a huge amount of inside to feed and only a little more membrane to feed it through. The membrane cannot keep up. Dividing solves the problem: two smaller cells have more total surface for the same amount of inside.',
        'NEW CELLS ARE BUILT FROM MATERIAL THE ORGANISM TOOK IN — a new cell does not appear out of nothing. Its material comes from the food the organism ate, the water it drank and the air it took in, exactly as you traced in the last lesson. Matter is not created here either. It is rearranged. That is why an organism that stops eating also stops growing.',
        'THE PHOTOCOPY COMPARISON, AND WHERE IT BREAKS — thinking of cell division as copying a page then handing out both copies is useful, because it keeps the order right: copy first, hand out second. But no real cell decides to make a copy, and there is no operator standing at the machine. The steps happen because of chemistry inside the cell, not because anything chose them.',
      ],
      vocabulary: [
        { term: 'cell division', definition: 'the process in which one cell splits into two new cells.' },
        { term: 'mitosis', definition: 'the kind of cell division that body cells use, producing two cells with the same genetic information as the original.' },
        { term: 'DNA', definition: 'the molecule that carries the instructions for building and running a cell.' },
        { term: 'genetically identical', definition: 'carrying the same genetic instructions as another cell.' },
        { term: 'cell membrane', definition: 'the thin outer boundary a cell must move all of its food, oxygen and waste across.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-mouse-and-elephant',
      kind: 'worked_example',
      problem:
        'A student says: "An elephant is enormous and a mouse is tiny, so elephant cells must be enormous and mouse cells must be tiny." Her lab partner disagrees. Who is right, and how could you settle it?',
      steps: [
        'First decide what would settle the argument. If you put a piece of mouse skin and a piece of elephant skin under the same microscope at the same magnification, the two students predict different things.',
        'The student predicts elephant cells would look far bigger in the eyepiece. Her partner predicts the two would look about the same, and that the elephant sample would simply contain many more cells in the same amount of space.',
        'When biologists actually do this, the partner is right. Skin cells from a mouse and skin cells from an elephant are close to the same size. The elephant is bigger because it is built from a far greater NUMBER of cells.',
        'Ask why it has to work that way. A cell can only feed itself through its membrane, so cells of every animal run into the same size limit. Making a bigger animal out of giant cells is not an option; making one out of more cells is.',
        'Now apply the same reasoning to yourself. WRONG: "I got taller because my cells stretched." CORRECT: "I got taller because my cells divided again and again, so my body has more of them."',
        'Notice what the argument turned on. Neither student needed to know anything about elephants. They needed the rule that cells stay small, and the rule that division makes more of them.',
      ],
      answer:
        'The lab partner is right. Mouse and elephant cells are about the same size; the elephant is larger because it is made of many more cells. Body size comes from cell NUMBER, not cell size, and you could check it by comparing skin samples under the same microscope.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-why-cells-stay-small',
      kind: 'worked_example',
      problem:
        'Imagine a cell shaped like a small cube. Now imagine that cube growing until every side is twice as long, without ever dividing. Explain why that cell would run into trouble.',
      steps: [
        'Name the two things that matter. The OUTSIDE is the membrane, and every bit of food and oxygen coming in and every bit of waste going out has to cross it. The INSIDE is everything that has to be fed and cleaned.',
        'Now double every side of the cube. The outside surface does grow. Each flat face becomes four times as large as it was, so the whole outside is four times what it was.',
        'The inside grows too, but it grows faster. The inside of the doubled cube is eight times what it was, because it grew in all three directions at once.',
        'Put those side by side. Eight times as much inside to supply, and only four times as much membrane to supply it through. The traffic has doubled per unit of surface, and materials also have farther to travel once they are in.',
        'So the cell starves in the middle. It cannot pull food in fast enough or push waste out fast enough to keep the whole inside working.',
        'Dividing fixes it. Two smaller cells hold the same total amount of inside but have more total membrane, so every part of both is close enough to a surface. This is why cells across nearly all living things stay small rather than growing large.',
      ],
      answer:
        'Its inside grows faster than its outside surface. The doubled cube has eight times as much inside but only four times as much membrane, so the membrane cannot move materials in and out fast enough to keep up. Splitting into two smaller cells restores a workable amount of surface for the amount of inside.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-why-you-grow',
      kind: 'try_yourself',
      problem: 'Why does a seventh grader get taller over the course of a year?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The cells already in the body stretch out and get much bigger.' },
        { id: 'b', text: 'The body makes more cells by cell division, using material from food.', correct: true },
        { id: 'c', text: 'New cells appear from nothing inside the empty spaces of the body.' },
        { id: 'd', text: 'The cells fill with extra water until the whole body is larger.' },
      ],
      expectedAnswer: 'The body makes more cells by cell division, using material from food.',
      hints: [
        'A cell cannot get much bigger without its membrane failing to move materials in and out fast enough. So growing by swelling is not available to it.',
        'Whatever the new cells are built from, it had to enter the body somehow. Matter does not appear out of nowhere.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-two-new-cells',
      kind: 'try_yourself',
      problem:
        'A skin cell at the edge of a healing cut divides into two new cells. What genetic information do those two new cells carry?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Each new cell carries half of the original cell genetic information.' },
        { id: 'b', text: 'Each new cell carries the same genetic information as the original cell.', correct: true },
        { id: 'c', text: 'Each new cell carries brand new genetic information that the cell wrote as it divided.' },
        { id: 'd', text: 'One new cell carries the genetic information and the other carries none.' },
      ],
      expectedAnswer: 'Each new cell carries the same genetic information as the original cell.',
      hints: [
        'Think about what the cell does BEFORE it splits. It copies its DNA, so there is a complete second set ready.',
        'A new skin cell has to do the same job as the cell it came from, so it needs the same instructions, not different ones and not part of a set.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-adults-and-replacement',
      kind: 'try_yourself',
      problem:
        'A forty year old man has not grown taller in over twenty years. Is cell division still happening in his body?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'No, because cell division stops once a person has finished growing.' },
        { id: 'b', text: 'No, because adults keep the same cells for the rest of their lives.' },
        { id: 'c', text: 'Yes, because he is constantly replacing worn-out cells such as skin, blood and gut lining, and repairing damage.', correct: true },
        { id: 'd', text: 'Yes, but only in the few days right after an injury, and not at any other time.' },
      ],
      expectedAnswer: 'Yes, because he is constantly replacing worn-out cells such as skin, blood and gut lining, and repairing damage.',
      hints: [
        'Cell division does two different jobs. One of them is growth. What is the other one?',
        'Cells wear out and are lost all the time, whatever your age. If nothing replaced them, the supply would run down.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-growth-and-adults',
      kind: 'misconception_check',
      question:
        'A student writes: "I grew taller because my cells got bigger, and once a person stops growing their cells stop dividing." Both halves of that sentence are wrong. Explain why.',
      commonErrors: [
        {
          answer: 'You grow because your cells get bigger.',
          misconception:
            'Assuming a body gets bigger the way a balloon does, because swelling is the only way most everyday objects get larger.',
          correctsTo:
            'Cells cannot grow much. As a cell gets larger, its inside grows faster than its membrane does, and the membrane can no longer move food in and waste out fast enough. So bodies grow by cell DIVISION instead: one cell becomes two, again and again, and the body ends up with more cells rather than bigger ones. That is why cells in a mouse and cells in an elephant are close to the same size. If you catch yourself saying a cell got bigger, swap it for "the body made more cells."',
        },
        {
          answer: 'Only growing children make new cells; adults do not.',
          misconception:
            'Treating cell division as something that runs only while a person is getting taller, because growth is the version of it you can see.',
          correctsTo:
            'Division never stops. Skin cells, blood cells and the cells lining your gut wear out and are lost throughout life, and division replaces them. Division is also how any body closes a cut or rebuilds damaged tissue. An adult is not finished dividing; an adult is replacing at roughly the same rate as the losses, so the total stays steady instead of increasing. Stopping would not hold a person at the same size. It would mean nothing was left to repair or replace them.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Organisms grow mainly by making MORE cells, not by their cells getting bigger. Elephant cells and mouse cells are about the same size.',
        'Cell division makes TWO new cells carrying the SAME genetic information as the original, because the DNA is copied before the cell splits. In body cells this process is called mitosis.',
        'Division also repairs damage and replaces worn-out cells, and it keeps doing that for a whole lifetime, not just during childhood.',
        'Cells stay small because a growing cell gains inside faster than it gains membrane, and the membrane then cannot move materials in and out fast enough.',
        'New cells are built from material the organism took in as food, water and air. Nothing is created out of nothing.',
        'Copying then splitting is a useful picture, but nothing inside a cell decides to divide. The steps happen through chemistry.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.1', cedTitle: 'Cell Division & Growth' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
