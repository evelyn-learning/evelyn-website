/**
 * Grade 7 Science (Life Science) — Cells: Cell Theory & the Microscope.
 *
 * The organizing idea of the whole cells unit (NGSS MS-LS1-1), taught
 * alongside the tool that made it possible. Two things carry this lesson: the
 * word THEORY, which in science means a well-supported explanation and not a
 * guess, and the fact that nobody could have written cell theory before the
 * microscope existed. Technology drove the science here, which is a rare and
 * clean example a twelve-year-old can actually hold onto.
 *
 * NOTE FOR FUTURE AUTHORS: there are no images in this course. Every item here
 * is solvable from the words printed in it, including the microscope views,
 * which are described in prose. Historical claims are kept deliberately
 * minimal: Hooke named cells after looking at cork, Leeuwenhoek was first to
 * see living microorganisms. Do not add dates or names that are not verified.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7SCI_U2_CELL_THEORY_AND_MICROSCOPES: LessonPlan = {
  id: 'evelyn.ms.m7sci.cell-theory-and-microscopes.v1',
  title: 'Cell Theory & the Microscope',
  curriculum: 'MS',
  grade: '7',
  subject: 'science',
  topic: 'grade-7-life-science',
  locale: 'en',
  los: [
    {
      id: 'm7sci.cell-theory-and-microscopes',
      standard: 'M7SCI-2.1',
      description:
        'State the three parts of cell theory and explain how the microscope made that evidence possible, distinguish unicellular from multicellular organisms, and calculate the total magnification of a compound light microscope (NGSS MS-LS1-1).',
    },
  ],
  prerequisites: ['m7sci.data-graphs-and-conclusions'],
  followUps: ['m7sci.plant-and-animal-cells'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the point that a whole living world was invisible until a tool arrived.',
      script:
        'Scoop a drop of water out of the pond behind the school and hold it up. It looks like nothing. Cloudy water. Now put that same drop under a microscope and it is crowded. Things are swimming across the view, spinning, bumping into each other. Not one of them was hiding. They were always there, in every drop, for as long as there has been a pond. People simply had no way to see them. For most of human history nobody knew that living things are built out of cells, and it was not because they were not clever. It was because nobody had the lens yet. Today we learn the idea that lens made possible, and the tool itself.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-cell-theory',
      kind: 'concept',
      goal: 'The three parts of cell theory, what the word theory really means, why the tool had to come first, unicellular versus multicellular, and total magnification.',
      keyIdeas: [
        'THE THREE PARTS OF CELL THEORY — (1) all living things are made of one or more cells; (2) the cell is the basic unit of structure and function in living things; (3) all cells come from cells that already exist. Part three is the one people fought over the longest, because for centuries many believed that living things could simply appear in meat or grain out of nothing.',
        'WHAT THE WORD THEORY MEANS IN SCIENCE — this is the most useful idea in the whole lesson. In everyday talk, "I have a theory" means "I have a hunch." In science it means almost the opposite. A scientific theory is a well-supported explanation that a huge body of evidence agrees with, tested by many people over many years, and used to make predictions that keep coming true. WRONG: "Cell theory is only a theory, so it might not be true." CORRECT: "Cell theory is called a theory because so much evidence supports it." An untested idea is not a theory at all; that is a hypothesis.',
        'THE TOOL CAME BEFORE THE IDEA — a cell is far too small to see with your eyes alone, so cell theory could not have been written before the microscope. In the 1600s Robert Hooke looked at a thin slice of cork through a lens, saw rows of tiny empty boxes, and named them cells. Around the same time Anton van Leeuwenhoek ground better lenses and became the first person to see living microorganisms moving in pond water and other samples. Better lenses came first, then observations, then the idea. This happens over and over in science: a new tool opens a door, and the explanations follow.',
        'TOTAL MAGNIFICATION IS A MULTIPLICATION — a compound light microscope has two lenses in a row. Light passes through the objective lens near the slide, and then through the eyepiece lens you look into. Each lens magnifies what the other one already magnified, so TOTAL MAGNIFICATION = EYEPIECE POWER TIMES OBJECTIVE POWER. A 10 times eyepiece with a 4 times objective gives 40 times. The same eyepiece with a 40 times objective gives 400 times. Do not add the powers, and do not use the objective alone.',
        'UNICELLULAR AND MULTICELLULAR — a unicellular organism is a complete living thing made of exactly one cell. A multicellular organism is made of many cells that specialize and divide the work. A one-celled organism is not a beginner version of a real organism. That single cell has to take in food, get rid of waste, respond to its surroundings and reproduce, all by itself, with no other cell to help. Your body splits those jobs across trillions of cells; a unicellular organism does every one of them in one.',
        'CELLS ARE NOT ALL ALIKE, AND BIGGER ORGANISMS HAVE MORE OF THEM — cells come in very different sizes and shapes, and the shape usually fits the job: a nerve cell is long and stringy for carrying signals a long way, a red blood cell is a small flattened disc for slipping through narrow vessels. Size differences matter too. An elephant is not built from elephant-sized cells. Its cells are roughly the same size as the cells of a mouse; the elephant just has an enormous number more of them.',
      ],
      vocabulary: [
        { term: 'cell theory', definition: 'the explanation that all living things are made of cells, that the cell is the basic unit of life, and that all cells come from existing cells.' },
        { term: 'scientific theory', definition: 'a well-supported explanation of something in nature, backed by a large body of evidence and tested many times.' },
        { term: 'hypothesis', definition: 'a testable proposed answer to a question, which is what people usually mean when they say "just a theory".' },
        { term: 'total magnification', definition: 'how many times larger a microscope makes an object look, found by multiplying the eyepiece power by the objective power.' },
        { term: 'unicellular', definition: 'made of a single cell that carries out every life process on its own.' },
        { term: 'multicellular', definition: 'made of many cells that specialize and share the work of keeping the organism alive.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-total-magnification',
      kind: 'worked_example',
      problem:
        'A classroom microscope has one eyepiece marked 10 times. Its three objective lenses are marked 4 times, 10 times and 40 times. A student starts on the 4 times objective and then switches to the 40 times objective. What is the total magnification in each case, and what changes in the view?',
      steps: [
        'Write the rule first: total magnification equals eyepiece power times objective power. Both lenses are in the light path, so the second lens magnifies the image the first lens already made bigger.',
        'Do the first setting. The eyepiece is 10 times and the objective is 4 times, so the total is 10 times 4, which is 40 times. The onion cells look about 40 times wider than they really are.',
        'Do the second setting. The eyepiece is still 10 times and the objective is now 40 times, so the total is 10 times 40, which is 400 times.',
        'Check the size of the jump. Going from 40 times to 400 times is ten times more magnification, which matches the objective going from 4 times to 40 times. The eyepiece never changed, so it cannot be the reason anything changed.',
        'WRONG way students often do this: 10 plus 40 equals 50 times. Magnification is not added. Each lens multiplies, because the second lens is working on an image that is already enlarged.',
        'Now the view. At 400 times you see far fewer cells, because you are looking at a much smaller patch of the slide, and the view is dimmer, because the same light is spread across a bigger image. More magnification is not automatically better. Find the thing you want on low power first, then zoom in.',
      ],
      answer:
        'The 4 times objective gives 10 times 4 equals 40 times total. The 40 times objective gives 10 times 40 equals 400 times total. At the higher magnification you see fewer cells across a smaller area, and the view is dimmer.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-broth-jars',
      kind: 'worked_example',
      problem:
        'Two jars of chicken broth are boiled long enough to kill anything living in them. Jar A is sealed shut while it is still hot. Jar B is left open to the air. A week later, the broth in jar B is cloudy and full of swimming microorganisms under the microscope, while jar A is still clear. Which part of cell theory does this support, and how?',
      steps: [
        'Name what is being tested. The question is where the microorganisms in jar B came from. Either they formed out of the broth itself, or they came from cells that already existed somewhere else.',
        'Compare the two jars. The broth is the same in both. The boiling was the same in both. The one difference is that jar B was open to the air and jar A was not.',
        'Read that difference honestly. If living things could form out of plain broth, jar A would have gone cloudy too, because it has exactly the same broth. It did not.',
        'So the cells in jar B arrived from outside, carried in on the air, and then reproduced in the broth. Cells came from cells that already existed.',
        'Match it to the theory. This is evidence for part three: all cells come from cells that already exist. It also quietly supports part one, because those swimming organisms are living things and every one of them is made of a cell.',
        'Notice the role of the tool one more time. Without a microscope, jar B is simply cloudy broth. The microscope is what turns "cloudy" into "full of living cells", and only then does the jar prove anything.',
      ],
      answer:
        'It supports part three, that all cells come from cells that already exist. The sealed jar stayed clear even though it held identical broth, so the organisms in the open jar must have come in from outside rather than forming out of the broth.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-parts-of-cell-theory',
      kind: 'try_yourself',
      problem: 'Which statement is one of the three parts of cell theory?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Living things can form out of nonliving material when conditions are right.' },
        { id: 'b', text: 'All living things are made of many cells working together.' },
        { id: 'c', text: 'All cells are about the same size and shape.' },
        { id: 'd', text: 'All cells come from cells that already exist.', correct: true },
      ],
      expectedAnswer: 'All cells come from cells that already exist.',
      hints: [
        'The three parts answer three questions: what living things are made of, what the cell does for the organism, and where new cells come from.',
        'One choice forgets that a single cell can be a whole organism, and one choice is the exact belief that cell theory replaced.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-magnification',
      kind: 'try_yourself',
      problem:
        'A compound light microscope has an eyepiece marked 10 times. A student clicks the 40 times objective into place. Which statement about the total magnification is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The total is 50 times, because the two lens powers are added together.' },
        { id: 'b', text: 'The total is 4 times, because the objective power is divided by the eyepiece power.' },
        { id: 'c', text: 'The total is 40 times, because the objective is the lens that does the magnifying.' },
        { id: 'd', text: 'The total is 400 times, because the eyepiece power is multiplied by the objective power.', correct: true },
      ],
      expectedAnswer: 'The total is 400 times, because the eyepiece power is multiplied by the objective power.',
      hints: [
        'The light goes through both lenses, one after the other, so the eyepiece enlarges an image that the objective has already enlarged.',
        'Multiply the two numbers rather than adding them: 10 times 40.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-unicellular',
      kind: 'try_yourself',
      problem:
        'Under the microscope, a student watches a single-celled pond organism swim, wrap itself around a smaller particle to take it in, and later split into two. Which statement about this organism is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It is not truly alive, because one cell is not enough to count as an organism.' },
        { id: 'b', text: 'It is a young stage that will grow into a multicellular organism later.' },
        { id: 'c', text: 'It is a complete organism, and that one cell carries out every life process by itself.', correct: true },
        { id: 'd', text: 'It is a cell that escaped from a larger organism and is surviving on its own.' },
      ],
      expectedAnswer: 'It is a complete organism, and that one cell carries out every life process by itself.',
      hints: [
        'List what the student actually saw the organism do. Moving, feeding and reproducing are life processes, and there is no second cell there to help with any of them.',
        'Being made of one cell says how the organism is built. It does not say the organism is unfinished, and it does not say the organism is doing less.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-theory-means-guess',
      kind: 'misconception_check',
      question:
        'A student writes: "Cell theory is just a theory, so scientists are not really sure about it yet. And an elephant must have bigger cells than a mouse, since an elephant is so much bigger." Two different things went wrong. What are they?',
      commonErrors: [
        {
          answer: 'Cell theory is just a theory, so it might turn out to be wrong.',
          misconception:
            'Using the everyday meaning of "theory" as a hunch or a guess, and assuming the science word means the same thing.',
          correctsTo:
            'In science, calling something a theory is high praise, not a warning label. A scientific theory is a well-supported explanation backed by a large body of evidence, tested by many different people in many different ways over a long time, and still standing. Cell theory has been checked against every organism anyone has looked at under a microscope for hundreds of years. WRONG: "Only a theory, so it might not be true." CORRECT: "It is called a theory because the evidence for it is enormous." The word for an untested idea is hypothesis. That is what people usually mean when they say "just a theory".',
        },
        {
          answer: 'An elephant is bigger than a mouse because an elephant has bigger cells.',
          misconception:
            'Assuming a bigger body must be built from bigger building blocks, the way a bigger wall would need bigger bricks.',
          correctsTo:
            'Cells vary in size and shape, but they do not scale with the size of the animal. An elephant cell and a mouse cell are roughly the same size. What the elephant has is a far greater NUMBER of cells. Bigger organism means more cells, not bigger cells. The differences in cell size that do exist come from the job the cell does, not from the size of the animal: a nerve cell is long and stringy so it can carry a signal a long distance, and a red blood cell is a small flattened disc so it can slip through narrow vessels.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Cell theory has three parts: all living things are made of one or more cells; the cell is the basic unit of structure and function; all cells come from cells that already exist.',
        'A scientific theory is a well-supported explanation backed by a large body of evidence, not a guess. A guess that has not been tested is a hypothesis.',
        'The tool came before the idea: Hooke named cells after looking at cork, and Leeuwenhoek was first to see living microorganisms. No microscope, no cell theory.',
        'Total magnification = eyepiece power times objective power. A 10 times eyepiece with a 40 times objective gives 400 times. Never add the powers.',
        'Higher magnification shows a smaller area and a dimmer view, so find your object on low power first.',
        'A unicellular organism is a whole organism doing every life process in one cell, and a bigger organism has MORE cells, not bigger ones.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.1', cedTitle: 'Cell Theory & the Microscope' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
