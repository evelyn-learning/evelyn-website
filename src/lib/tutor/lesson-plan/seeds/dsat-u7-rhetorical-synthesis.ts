/**
 * Digital SAT — Reading & Writing: Rhetorical Synthesis.
 *
 * Digital-SAT-specific question type (Expression of Ideas domain): the
 * student is given bulleted research notes plus a STATED GOAL, and must
 * pick the sentence that best accomplishes that goal using notes info.
 * The core skill is GOAL-MATCHING, not note-coverage — every choice is
 * typically well-written and notes-consistent; only goal fit separates
 * them. Teach the recurring traps: goal mismatch, unsupported additions
 * (info not in the notes), and partial coverage of a two-part goal.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_DSAT_U7_RHETORICAL_SYNTHESIS: LessonPlan = {
  id: 'evelyn.testprep.dsat.rhetorical-synthesis.v1',
  title: 'Rhetorical Synthesis (Notes Questions)',
  curriculum: 'SAT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'digital-sat',
  locale: 'en',
  los: [
    {
      id: 'dsat.rhetorical-synthesis',
      standard: 'DSAT-7.1',
      description:
        'Given bulleted research notes and a stated rhetorical goal, select the sentence that most effectively uses relevant information from the notes to accomplish that specific goal.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame rhetorical synthesis as a Digital-SAT-only question type worth roughly 4-6 of the 54 Reading & Writing questions — and as a goal-matching skill, not a reading-comprehension one.',
      script:
        'Rhetorical synthesis questions show up on every Digital SAT — usually 4 to 6 of the 54 Reading and Writing questions. You get a handful of bullet-point research notes and a stated GOAL, like "emphasize a difference" or "introduce the topic to a new audience." All four answer choices are almost always accurate and well-written. The only thing that decides the right one is whether it actually accomplishes the stated goal.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-goal-matching',
      kind: 'concept',
      goal: 'The recurring notes-question format, the rhetorical-goal types it tests, and the three traps that separate the correct choice from the other three.',
      keyIdeas: [
        'FORMAT — "A student is writing about X. Notes: [4-6 bulleted facts]. The student wants to [GOAL]. Which choice most effectively uses relevant information from the notes to accomplish this goal?" Four candidate sentences follow.',
        'READ THE GOAL FIRST, before the answer choices. The goal is the filter every choice gets tested against — not an afterthought.',
        'CLASSIFY THE GOAL TYPE — compare/contrast two things, introduce a topic to an unfamiliar audience, summarize a main finding, give a specific example, or explain significance/impact. Each type demands a different kind of sentence.',
        'TRAP 1 — GOAL MISMATCH. A choice can be 100% accurate and still be wrong because it does the WRONG rhetorical job — e.g., it states a fact when the goal asked for a comparison, or reports a benefit when the goal asked for a challenge.',
        'TRAP 2 — UNSUPPORTED ADDITION. A choice adds a detail that is NOT in the bulleted notes (a claim about "growing popularity," "studies suggest," etc.). It can sound perfectly plausible — the notes are the only evidence allowed, so anything outside them is disqualifying.',
        'TRAP 3 — PARTIAL COVERAGE. For a two-part goal ("compare A and B," "highlight a similarity between X and Y"), a choice that only describes ONE side is incomplete, even if that half is accurate.',
        'ALL FOUR CHOICES ARE USUALLY WELL-WRITTEN. Do not reward polish or detail — a fluent, detailed sentence that makes the wrong rhetorical move is still wrong.',
        'STRATEGY — read the goal, predict the MOVE the sentence needs to make, then eliminate any choice that makes the wrong move, invents outside info, or covers only half a two-part goal.',
      ],
      vocabulary: [
        { term: 'rhetorical synthesis', definition: 'Digital SAT question type combining bulleted research notes with a stated goal; the correct choice is the sentence that best accomplishes that goal using only the notes.' },
        { term: 'goal fit', definition: 'whether a choice performs the specific rhetorical move (compare, introduce, summarize, etc.) the stated goal calls for — the deciding factor, not accuracy alone.' },
        { term: 'unsupported addition', definition: 'a detail in an answer choice that does not appear anywhere in the bulleted notes, even if it sounds plausible.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-typical-difference',
      kind: 'worked_example',
      problem:
        'A student is writing about two coral-reef restoration methods. Notes: - Coral gardening grows coral fragments in underwater nurseries before transplanting them to damaged reefs. - Coral gardening requires regular diver maintenance and can take 2-3 years before transplants show growth. - 3D-printed reef structures provide an artificial substrate that mimics natural reef texture within weeks of installation. - 3D-printed structures are more expensive per unit but need little maintenance after placement. The student wants to emphasize a key difference in the time investment required by the two methods. Which choice most effectively uses relevant information from the notes to accomplish this goal? (A) Both coral gardening and 3D-printed reefs aim to restore damaged reef ecosystems. (B) Coral gardening can take two to three years to show growth, while 3D-printed reef structures can provide habitat within weeks. (C) 3D-printed reef structures are more expensive to produce than the coral fragments used in gardening. (D) Coral gardening requires regular attention from divers to succeed.',
      steps: [
        'Goal check: "emphasize a key difference in TIME INVESTMENT" — the sentence needs to contrast the two methods specifically on time.',
        'Scan the notes for time-related facts: coral gardening — "2-3 years"; 3D-printed structures — "within weeks."',
        '(A) states a similarity, not a difference — wrong move. (C) contrasts cost, not time — off-topic for this goal. (D) describes only one method, no contrast at all.',
        '(B) directly contrasts the two specific time figures from the notes — matches the goal exactly.',
      ],
      answer: '(B) Coral gardening can take two to three years to show growth, while 3D-printed reef structures can provide habitat within weeks.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-trap-unsupported',
      kind: 'worked_example',
      problem:
        'A student is writing about two plastic-waste-reduction methods. Notes: - Compostable plastics are made from plant starches such as corn or sugarcane rather than petroleum. - Compostable plastics only break down fully in industrial composting facilities, which are unavailable in most cities. - Reusable container programs let customers return packaging to be washed and refilled at the same store. - A 2021 pilot of a reusable container program reduced one grocery chain\'s packaging waste by 40 percent. The student wants to introduce a challenge associated with one of these methods to an audience new to the topic. Which choice most effectively uses relevant information from the notes to accomplish this goal? (A) Compostable plastics, though marketed as eco-friendly, actually require industrial composting facilities that most cities do not have, limiting their real-world benefit. (B) A 2021 pilot program showed that returnable packaging can cut a grocery chain\'s waste by 40 percent. (C) Compostable plastics are made from plant starches like corn instead of petroleum-based materials, making them a promising green innovation gaining popularity worldwide. (D) Reusable container programs require customers to return packaging, which some studies suggest most consumers find inconvenient.',
      steps: [
        'Goal check: introduce a CHALLENGE, in accessible language for a new audience — the sentence must describe a problem, not a success.',
        '(B) is accurate but describes a BENEFIT (40 percent waste reduction) — wrong rhetorical move for a "challenge" goal.',
        '(C) sounds plausible about corn-based origin, but "gaining popularity worldwide" appears NOWHERE in the notes — unsupported addition. Eliminate even though it reads well.',
        '(D) similarly invents "some studies suggest... inconvenient" — the notes say nothing about consumer opinion or studies — unsupported addition.',
        '(A) states the composting-facility limitation straight from the notes, in plain language — matches the goal and uses only notes info.',
      ],
      answer: '(A) Compostable plastics, though marketed as eco-friendly, actually require industrial composting facilities that most cities do not have, limiting their real-world benefit.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-summarize-finding',
      kind: 'try_yourself',
      problem:
        'A student is writing about a study on sleep and academic performance. Notes: - A 2019 study tracked 200 college students\' sleep duration and next-day quiz scores. - Students who slept less than 6 hours averaged 71% on quizzes. - Students who slept 7-9 hours averaged 85% on quizzes. - Researchers controlled for caffeine intake and quiz difficulty across groups. The student wants to state the study\'s main takeaway for an audience of fellow students. Which choice most effectively uses relevant information from the notes to accomplish this goal?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The study tracked 200 college students\' sleep duration and quiz scores.' },
        { id: 'b', text: 'Students who slept 7 to 9 hours scored notably higher on quizzes than students who slept less than 6 hours, suggesting more sleep supports better academic performance.', correct: true },
        { id: 'c', text: 'Researchers controlled for caffeine intake and quiz difficulty to ensure fair comparisons across groups.' },
        { id: 'd', text: 'Quiz scores in the study ranged from below 71 percent to above 85 percent depending on the individual student.' },
      ],
      expectedAnswer: 'Students who slept 7 to 9 hours scored notably higher on quizzes than students who slept less than 6 hours, suggesting more sleep supports better academic performance.',
      hints: [
        'The goal asks for a takeaway/finding, not the study\'s setup — eliminate choices about HOW the study was run.',
        'Compare the two average scores directly, 71% vs 85%, tied to sleep duration — that comparison IS the takeaway.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-similarity',
      kind: 'try_yourself',
      problem:
        'A student is writing about two ancient irrigation systems. Notes: - Persian qanats are underground tunnels that carry groundwater from higher elevations to farms and towns using gravity alone. - Qanats were first built more than 2,500 years ago and some are still in use today. - Roman aqueducts also used gravity to move water over long distances, sometimes across elevated stone channels. - Roman aqueducts primarily supplied cities with drinking water and public baths rather than farmland. The student wants to highlight a similarity between qanats and Roman aqueducts. Which choice most effectively uses relevant information from the notes to accomplish this goal?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Qanats are underground tunnels, while Roman aqueducts often ran above ground on elevated stone channels.' },
        { id: 'b', text: 'Both qanat and Roman aqueduct systems relied on gravity alone to move water across long distances.', correct: true },
        { id: 'c', text: 'Some qanats built more than 2,500 years ago are still functioning today.' },
        { id: 'd', text: 'Roman aqueducts mainly delivered water to cities for drinking and public baths.' },
      ],
      expectedAnswer: 'Both qanat and Roman aqueduct systems relied on gravity alone to move water across long distances.',
      hints: [
        'A similarity goal needs BOTH systems named in the sentence, connected by a shared feature — not one system alone.',
        'Look for the shared mechanism mentioned in both bullets: gravity.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-introduce-audience',
      kind: 'try_yourself',
      problem:
        'A student is writing about bioluminescence in deep-sea animals. Notes: - Bioluminescence is the production of light by a living organism through a chemical reaction involving a molecule called luciferin. - More than 75 percent of deep-sea animals are estimated to produce their own light. - Anglerfish use a glowing lure to attract prey in the darkness of the deep ocean. - Some species use bioluminescent flashes to startle predators or communicate with others of their species. The student wants to introduce the concept of bioluminescence to readers who have never heard the term before. Which choice most effectively uses relevant information from the notes to accomplish this goal?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Anglerfish use a glowing lure to attract prey in the pitch-black deep ocean.' },
        { id: 'b', text: 'Bioluminescence is a phenomenon in which living organisms produce their own light through an internal chemical reaction.', correct: true },
        { id: 'c', text: 'More than three-quarters of deep-sea animals are estimated to generate light on their own.' },
        { id: 'd', text: 'Some deep-sea species use flashes of light to startle predators or signal to each other.' },
      ],
      expectedAnswer: 'Bioluminescence is a phenomenon in which living organisms produce their own light through an internal chemical reaction.',
      hints: [
        '"Introduce to readers who\'ve never heard the term" calls for a definition-style sentence, not a specific example or statistic.',
        'Which choice actually explains WHAT bioluminescence is, rather than describing one instance of it?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-polish-over-goal',
      kind: 'misconception_check',
      question:
        'A student is choosing between four rhetorical-synthesis options and picks the one that sounds the most detailed and impressively written, even though it doesn\'t quite address the stated goal. What went wrong?',
      commonErrors: [
        {
          answer: 'Picked the most detailed/polished-sounding choice.',
          misconception: 'Treating rhetorical synthesis like a "find the best-written sentence" question rather than a goal-matching task — assuming detail or fluency signals correctness.',
          correctsTo: 'On rhetorical synthesis, all four choices are typically well-written and notes-consistent. The only thing that separates them is whether they accomplish the STATED GOAL. Reread the goal, decide what rhetorical move it calls for (compare, introduce, summarize, contrast), and eliminate any choice — however polished — that makes the wrong move or covers only half of it.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Read the GOAL before evaluating any choice — it is the filter, not an afterthought.',
        'Identify the rhetorical MOVE the goal calls for (compare, contrast, introduce, summarize, example) before checking facts.',
        'Eliminate choices that add info not found in the notes (unsupported addition) and choices that cover only half a two-part goal.',
        'All four choices are usually accurate and well-written — goal fit, not detail or polish, decides the answer.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.1', cedTitle: 'Rhetorical Synthesis (Notes Questions)' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
