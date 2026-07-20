/**
 * Digital SAT — Reading & Writing: Inferences.
 *
 * Digital-format Inferences questions give a short passage that ENDS in a
 * blank ("______") and ask "Which choice most logically completes the
 * text?" The defining trap: the correct choice must be REQUIRED by the
 * stated information, not merely plausible or realistic-sounding. A choice
 * that would probably be true in real life but isn't forced by the text is
 * wrong — this is the single most-tested distinction in the question type.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_DSAT_U5_INFERENCES: LessonPlan = {
  id: 'evelyn.testprep.dsat.inferences.v1',
  title: 'Inferences',
  curriculum: 'SAT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'digital-sat',
  locale: 'en',
  los: [
    {
      id: 'dsat.inferences',
      standard: 'DSAT-5.4',
      description:
        'Complete a digital SAT text-completion passage by selecting the choice that is logically REQUIRED by the stated information, rejecting choices that are merely plausible, extreme, out of scope, or contradicted.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame Inferences as a small but high-miss-rate slice of R&W — the format looks like common sense but tests strict logic.',
      script:
        'Inferences questions are one of the Information and Ideas question types — usually 3 to 4 of the 54 Reading and Writing questions. That sounds small, but this is one of the highest-miss question types on the test, because every wrong answer is written to SOUND reasonable. The passage ends in a blank, and you pick the choice that most logically completes it. The catch: "logical" here means REQUIRED by what\'s stated — not just realistic or likely. Learn to tell the difference and these become easy, fast points.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-necessity',
      kind: 'concept',
      goal: 'The Inferences format, the necessity standard, and the five named traps that separate the correct choice from the plausible-sounding ones.',
      keyIdeas: [
        'FORMAT — a short original passage ends in "______", followed by "Which choice most logically completes the text?" and four completions. There is no separate question stem to interpret; the blank itself is the question.',
        'THE NECESSITY STANDARD — the correct choice must be logically REQUIRED by the stated facts (an entailment), not just a believable real-world guess. If you can imagine the passage\'s facts being true while the choice is false, that choice is wrong — no matter how sensible it sounds.',
        'STRATEGY — before reading the choices, restate the passage\'s stated facts as premises and predict what MUST follow. Then match a choice to that prediction instead of judging each choice in isolation.',
        'TRAP 1 — "SOUNDS RIGHT." A choice offers a realistic causal or evaluative story (e.g., "caused X to happen," "was because of Y") that the passage never actually establishes — usually because the passage gives a correlation, not a stated cause.',
        'TRAP 2 — EXTREME / OVER-SCOPED. Words like "all," "every," "always," "will definitely," "never" push a choice beyond what the stated facts cover, even when the general direction is right.',
        'TRAP 3 — OUTSIDE INFORMATION. The choice introduces a comparison, motive, or fact the passage never mentions (a new entity, an unstated reason, a detail about "better" or "worse" conditions).',
        'TRAP 4 — DIRECT CONTRADICTION. The choice states the opposite of what the passage says — usually the easiest trap to eliminate once you\'ve made your own prediction first.',
        'TRAP 5 — RESTATEMENT vs. COMPLETION. A correct choice can legitimately just restate a comparison the passage already sets up (that IS a valid necessary completion) — don\'t confuse this with a choice that repeats a premise but fails to answer what the blank is actually asking for.',
      ],
      vocabulary: [
        { term: 'necessarily follows', definition: 'a completion that MUST be true given the stated facts — not merely likely or realistic.' },
        { term: 'premise', definition: 'a fact the passage states directly, used to build the required completion.' },
        { term: 'scope', definition: 'how broad or narrow a claim is; a valid completion matches the scope the premises actually support.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-universal-rule',
      kind: 'worked_example',
      problem:
        'Read the passage: "Marine biologists tracked coral bleaching at three reefs. Every reef that spent at least four consecutive weeks above 30°C bleached within two months; every reef that never reached 30°C remained unbleached. Reef C never reached 30°C during the study." Question: Which choice most logically completes the text? Based on this information, Reef C ______ (A) bleached within two months. (B) remained unbleached during the study. (C) was located in a colder ocean region than the other reefs. (D) spent four consecutive weeks below 25°C.',
      steps: [
        'Predict first: the passage gives a universal rule — "every reef that never reached 30°C remained unbleached." Reef C is stated to have never reached 30°C, so Reef C falls inside that rule.',
        '(A) contradicts the rule directly — eliminate.',
        '(C) introduces a comparison ("colder ocean region") the passage never makes — outside information, eliminate.',
        '(D) invents a specific number ("below 25°C") the passage never states — eliminate.',
        '(B) is exactly what the universal rule requires for any reef that never reached 30°C, including Reef C.',
      ],
      answer: '(B) remained unbleached during the study.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-correlation-trap',
      kind: 'worked_example',
      problem:
        'Read the passage: "A city removed all free parking near its downtown shops last year. In the following twelve months, downtown foot traffic dropped by eighteen percent, while foot traffic in a nearby shopping district that kept free parking rose by six percent over the same period." Question: Which choice most logically completes the text? Based on this comparison, the removal of free parking ______ (A) caused shoppers to spend less money overall. (B) coincided with a decline in downtown foot traffic relative to the nearby district. (C) will be reversed if free parking is restored. (D) affected every downtown shop equally.',
      steps: [
        'Predict first: the passage only reports a TIME-MATCHED comparison — foot traffic fell downtown while it rose nearby, over the same twelve months. It never measures spending, motive, or cause.',
        '(A) is the "sounds right" trap: spending and foot traffic are different things, and the passage never establishes that the parking change CAUSED anything — only that the numbers moved together. A plausible story, not a required one.',
        '(C) predicts the future — unsupported by data about what happens if parking is restored.',
        '(D) is the extreme/over-scoped trap: "every shop equally" goes far beyond an aggregate foot-traffic percentage.',
        '(B) sticks to exactly what was measured: the two traffic trends moving in opposite directions over the same period. That is the only claim the numbers force.',
      ],
      answer: '(B) coincided with a decline in downtown foot traffic relative to the nearby district.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-batch-rule',
      kind: 'try_yourself',
      problem:
        'Read the passage: "A greenhouse tested two types of tomato seeds under identical conditions. Every seed from Batch A germinated within seven days; no seed from Batch B germinated before day ten. A researcher plants a seed from Batch A." Question: Which choice most logically completes the text? Based on the greenhouse\'s results, this seed ______',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'will produce more tomatoes than a Batch B seed.' },
        { id: 'b', text: 'will germinate within seven days.', correct: true },
        { id: 'c', text: 'was grown in better soil than the Batch B seeds.' },
        { id: 'd', text: 'is genetically identical to a Batch B seed.' },
      ],
      expectedAnswer: 'will germinate within seven days.',
      hints: [
        'Look for a rule stated to apply to every seed in the same batch, not just some of them.',
        'The passage says every seed from Batch A germinated within seven days — this seed is from Batch A, so that rule applies to it directly. Also note "identical conditions" rules out any soil difference.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-library-hours',
      kind: 'try_yourself',
      problem:
        'Read the passage: "A library extended its Saturday hours by two hours starting in March. Between March and June, Saturday visitor counts rose fourteen percent compared to the previous four months, while weekday visitor counts stayed flat over the same stretch." Question: Which choice most logically completes the text? Based on this comparison, the rise in Saturday visitors ______',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'proves the extended hours caused more people to read books.' },
        { id: 'b', text: 'occurred while weekday attendance did not show the same increase.', correct: true },
        { id: 'c', text: 'will continue at the same rate next year regardless of the hours.' },
        { id: 'd', text: 'happened at every library in the city.' },
      ],
      expectedAnswer: 'occurred while weekday attendance did not show the same increase.',
      hints: [
        'What does the passage explicitly say about weekday visitors over the same stretch of time?',
        'The safest completion restates a comparison the passage already makes — "reading" and "next year" and "every library" all go beyond what was measured.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-security-update',
      kind: 'try_yourself',
      problem:
        'Read the passage: "A software company rolled out a mandatory security update to all users last month. Users who installed the update within 48 hours reported zero account breaches in the following month; every reported breach that month came from users who had not yet installed the update. One user, Priya, installed the update within 48 hours." Question: Which choice most logically completes the text? Based on this information, Priya ______',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'is now safe from all future security threats.' },
        { id: 'b', text: 'did not report an account breach in the following month.', correct: true },
        { id: 'c', text: 'uses a different device than users who did not install the update.' },
        { id: 'd', text: 'installed the update because she was warned about hackers.' },
      ],
      expectedAnswer: 'did not report an account breach in the following month.',
      hints: [
        'Identify which stated group Priya belongs to, based on when she installed the update.',
        'The passage states a fact about everyone in the "installed within 48 hours" group for that month specifically — not a claim about "all future" threats.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-plausible-answer',
      kind: 'misconception_check',
      question:
        'Passage: "A bakery reduced its hours during the winter. Over the same period, its weekly revenue fell twelve percent, while a nearby bakery that kept full hours saw revenue rise three percent." Completion: "Based on this comparison, the reduced hours ______" A student picks "caused the bakery to lose customers to its competitor." What went wrong?',
      commonErrors: [
        {
          answer: 'caused the bakery to lose customers to its competitor.',
          misconception: 'Treating a plausible, realistic-sounding causal story as the required inference, when the passage only reports two numbers moving together over the same period — a correlation, not a stated cause or a stated reason ("lose customers to its competitor").',
          correctsTo: 'The correct completion sticks to exactly what the numbers show: the hours reduction coincided with a revenue drop while the competitor\'s revenue rose over the same stretch. Any claim about WHY (customers switching to the competitor specifically) requires an assumption the passage never confirms — plausible, not necessary.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The correct completion must be REQUIRED by the stated facts, not just believable or realistic.',
        'Predict the completion from the passage\'s premises before reading the choices.',
        'Eliminate choices that contradict the text, overreach in scope ("all," "every," "always"), add outside information, or need an unstated cause/motive.',
        'Correlation is not causation — a plausible causal story is the single most common wrong answer.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.4', cedTitle: 'Inferences' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
