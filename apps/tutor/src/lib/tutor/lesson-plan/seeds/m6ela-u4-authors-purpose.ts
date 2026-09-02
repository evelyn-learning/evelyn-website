/**
 * Grade 6 ELA — Text Structure, Author's Purpose & Comparing Accounts:
 * Author's Purpose.
 *
 * CONCEPT-LED row for the m6ela fan-out. The student arrives with no
 * procedure to lean on, so the whole lesson builds one way of reading: an
 * author's PURPOSE is the reason a text was written, and that reason has to
 * be PROVEN from the exact words and details on the page, never guessed from
 * a feeling (CCSS RI.6.6). Every item in this file asks the student to point
 * at the specific sentence that gives the purpose away — never to pick
 * inform, persuade or entertain off a bare menu, which tests memorizing a
 * label rather than reading.
 *
 * SCOPE GUARD: Grade 6 row 4.2 determines an author's point of view or
 * purpose in an INFORMATIONAL text and explains HOW that purpose is conveyed
 * through word choice and selected details — every try_yourself item in this
 * file asks the student to point at the specific sentence that proves a
 * purpose, never to pick inform, persuade or entertain off a bare menu.
 * DELIBERATELY EXCLUDED: sorting an argument's claims into
 * supported-by-evidence or not (row 4.3, RI.6.8) — this lesson never asks
 * whether an author's reasons or evidence are sufficient, only what reveals
 * the author's stance; comparing two authors' accounts of the same real
 * events (row 4.4, RI.6.9); analyzing a whole text's organizational pattern
 * such as chronological or cause/effect (row 4.1, RI.6.5); and explaining a
 * narrator's point of view in a LITERARY text (row 2.2, RL.6.6), which this
 * file never touches because every passage here is informational nonfiction.
 * Also excluded is the Grade 7 escalation of this exact standard, RI.7.6,
 * analyzing how an author distinguishes their own position from someone
 * else's position — this lesson stops at explaining how one author's purpose
 * is conveyed and never contrasts it against a second author's. DELIBERATELY
 * ALLOWED: several passages in this file carry a persuasive stance with real
 * claims and reasons in it, because a persuasive text is a legitimate example
 * of a purpose to identify — every item asks what reveals that stance, never
 * whether the stance is well supported, which is what keeps the boundary
 * with row 4.3 intact even though the same passage could in principle be
 * reused there.
 *
 * NOTE FOR FUTURE AUTHORS: every passage in this file is original prose
 * written for the item. This course carries no passage machinery — no
 * passageId, no shared texts — so each question must be solvable from the
 * sentences printed inside it, and no published work may be quoted or
 * closely paraphrased. Every phrase this file puts inside quotation marks
 * appears character-for-character in the excerpt above it; quote your own
 * excerpt exactly, never from memory.
 *
 * CLAIM LEDGER (informational passages):
 *   Claim                                    | Where               | Grounds
 *   Recycling keeps useful material out of   | try-1 passage       | Definitional — diverting
 *   the landfill                             |                     | recyclable material from
 *                                             |                     | landfill disposal is what
 *                                             |                     | recycling means; long-settled,
 *                                             |                     | uncontroversial.
 *   A push-button pedestrian signal turns a  | try-2 passage       | Consistent with the standard
 *   light on when pressed and keeps it lit   | (VERSION A)         | operation of common push-button
 *   for a set interval before switching off  |                     | pedestrian crossing beacons; a
 *   automatically                            |                     | plausible mechanism written for
 *                                             |                     | an invented crosswalk, not a
 *                                             |                     | claim about a specific real
 *                                             |                     | intersection or an invented
 *                                             |                     | statistic.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6ELA_U4_AUTHORS_PURPOSE: LessonPlan = {
  id: 'evelyn.ms.m6ela.authors-purpose.v1',
  title: 'Author\'s Purpose',
  curriculum: 'MS',
  grade: '6',
  subject: 'ela',
  topic: 'grade-6-ela',
  locale: 'en',
  los: [
    {
      id: 'm6ela.authors-purpose',
      standard: 'M6ELA-4.2',
      description:
        'Determine an author\'s point of view or purpose in an informational text and explain how it is conveyed through word choice and selected details (CCSS RI.6.6) — explaining how it is conveyed, not yet analyzing how the author distinguishes their position from someone else\'s (RI.7.6).',
    },
  ],
  prerequisites: ['m6ela.how-a-text-is-organized'],
  followUps: ['m6ela.tracing-an-argument'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student feel that two texts on the same topic can want two different things from the reader.',
      script:
        'Your school newspaper runs two short pieces about the cafeteria adding a salad bar. One piece explains what days it will be open and what it will cost. The other piece begs the reader to try it and says every student who cares about eating well should show up on day one. Same topic, same event, and yet these two pieces want two different things from you. One wants you informed. One wants you convinced. Today we learn how to prove which is which — not by guessing from a feeling, but by pointing at the exact words and details that give each writer away.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-authors-purpose',
      kind: 'concept',
      goal: 'Separate purpose from topic, install the word-choice and selected-details tests, and require the purpose and its proof in the same sentence.',
      keyIdeas: [
        'AUTHOR\'S PURPOSE IS THE REASON A TEXT WAS WRITTEN, NOT ITS SUBJECT. A text about the same topic can be written to inform (explain or give facts), to persuade (push the reader toward a belief or an action), or, less often for informational text, to entertain. Two pieces about the exact same event can still have two different purposes.',
        'A PURPOSE HAS TO BE PROVEN, NOT GUESSED FROM A FEELING. Naming a purpose is only half the job. The other half, and the one this lesson is actually about, is pointing at the exact word or detail that gives the purpose away.',
        'NEUTRAL WORD CHOICE USUALLY SIGNALS INFORM. Words that explain, define or describe without judging — is scheduled to, according to, matches, takes place — report information without pushing the reader anywhere.',
        'A JUDGMENT WORD OR A CALL TO ACTION USUALLY SIGNALS PERSUADE. Should, deserves, worth it, please, before it is too late — these ask the reader to believe something or do something. A single sentence like this can flip an entire passage from informing to persuading.',
        'SELECTED DETAILS REVEAL PURPOSE JUST AS MUCH AS WORD CHOICE DOES. What an author chooses to include, what gets left out, and what the passage lingers on all point toward why it was written. A passage that reports outcomes on more than one side is informing about those outcomes; a passage that lines up only the details that favor one side, especially in a closing recommendation, is persuading.',
        'ALWAYS STATE THE PURPOSE AND ITS PROOF TOGETHER. "This passage is written to persuade" is an unfinished answer. "This passage is written to persuade, shown by the sentence that tells the reader to email the principal" is a finished one.',
      ],
      vocabulary: [
        { term: 'author\'s purpose', definition: 'the reason an author wrote a text — commonly to inform, to persuade, or to entertain.' },
        { term: 'word choice', definition: 'the specific words an author selects; neutral words tend to inform, judging or urging words tend to persuade.' },
        { term: 'selected details', definition: 'the particular facts, examples or outcomes an author includes in a text, and the ones left out.' },
        { term: 'neutral language', definition: 'wording that reports information without asking the reader to believe or do anything.' },
        { term: 'persuasive language', definition: 'wording built to move a reader toward a belief or an action, such as a command, a judgment word, or a call to action.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-compare-two-versions',
      kind: 'worked_example',
      problem:
        'Both announcements below describe the same change to the cafeteria. Read each one, then decide which is written to inform and which is written to persuade, and point to the exact words that prove it.\n\nVERSION A: "Starting Monday, the cafeteria will add a salad bar next to the hot lunch line. It is open during both lunch periods, and it costs the same as a regular lunch tray."\n\nVERSION B: "Starting Monday, the cafeteria is finally adding a salad bar, and it is about time. Every student who cares about eating well should be first in line on day one, and it will cost you nothing extra to try it."',
      steps: [
        'Read VERSION A for word choice. "Is open during both lunch periods" and "it costs the same as a regular lunch tray" explain a schedule and a price. Neither sentence asks the reader to believe anything or do anything.',
        'VERSION A never states an opinion about the salad bar. It reports what will happen and when. That combination of neutral word choice and no call to action is what informing looks like.',
        'Read VERSION B for word choice. "Finally adding" and "it is about time" are judgment words — they tell the reader how to feel about the change before explaining anything about it.',
        'VERSION B also gives a command: "should be first in line on day one." A sentence that tells the reader what to do is the clearest signal a text is built to persuade.',
        'State the purpose and the proof together for each version. VERSION A\'s purpose is to inform, proven by the plain fact "it costs the same as a regular lunch tray," which carries no judgment. VERSION B\'s purpose is to persuade, proven by "Every student who cares about eating well should be first in line on day one," a direct instruction to the reader.',
      ],
      answer:
        'VERSION A informs, proven by its plain schedule-and-price facts such as "it costs the same as a regular lunch tray." VERSION B persuades, proven by the instruction "Every student who cares about eating well should be first in line on day one."',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-selected-details-phone-ban',
      kind: 'worked_example',
      problem:
        'Read this passage about the cafeteria\'s new phone rule, then decide the author\'s purpose and point to the specific proof.\n\n"The cafeteria banned phones at lunch this month. Last week, three students missed the end-of-lunch bell because they were watching videos, and one dropped an entire tray while filming. Since the ban, the lunch line has moved faster and the tables are louder with actual conversation. Every student deserves twenty minutes to talk with friends instead of a screen."',
      steps: [
        'Name the topic first: the cafeteria\'s new ban on phones at lunch. The first sentence, "The cafeteria banned phones at lunch this month," is a plain fact and could belong to either an informing or a persuading passage on its own.',
        'Look at which details the author selected next. "Three students missed the end-of-lunch bell because they were watching videos" and "one dropped an entire tray while filming" are two examples chosen to make phone use at lunch look like a problem, not two examples chosen at random.',
        'Keep tracking the selected details. "The lunch line has moved faster and the tables are louder with actual conversation" lines up two more outcomes on the same side, both favoring the ban. An informing passage about a new rule would usually report outcomes on more than one side.',
        'Read the closing sentence for word choice. "Every student deserves twenty minutes to talk with friends instead of a screen" is a judgment about what students deserve, not a fact about what happened. A sentence that states what someone deserves is asking the reader to agree with a stance.',
        'State the purpose and the proof together. This passage is written to persuade the reader that the phone ban is a good rule. Proof: "Every student deserves twenty minutes to talk with friends instead of a screen," a judgment about what students deserve rather than a report of what happened, plus the way the passage selects only examples that favor the ban.',
      ],
      answer:
        'The passage persuades, proven by the judgment "Every student deserves twenty minutes to talk with friends instead of a screen" and by selecting only examples and outcomes that favor the phone ban.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-recycling-flyer',
      kind: 'try_yourself',
      problem:
        'Read the recycling flyer below, then choose the sentence that most reveals that the author\'s purpose is to persuade readers to act, not simply to inform them about the recycling bins.\n\n"Our school\'s recycling bins have sat half empty for months, and paper and cans go into the trash instead. Last year, only a small fraction of the paper thrown away in the cafeteria actually reached a bin. Recycling takes only a few extra seconds, and it keeps useful material out of the landfill. Please sort your trash before lunch ends, and help turn this around by next month."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Our school\'s recycling bins have sat half empty for months, and paper and cans go into the trash instead.' },
        { id: 'b', text: 'Last year, only a small fraction of the paper thrown away in the cafeteria actually reached a bin.' },
        { id: 'c', text: 'Please sort your trash before lunch ends, and help turn this around by next month.', correct: true },
        { id: 'd', text: 'Recycling takes only a few extra seconds, and it keeps useful material out of the landfill.' },
      ],
      expectedAnswer: 'Please sort your trash before lunch ends, and help turn this around by next month.',
      hints: [
        'Three of these sentences report a fact calmly — a problem, a number, or a benefit — without asking the reader to do anything. Look for the one sentence that speaks directly to the reader and asks for something.',
        'The word please and the phrase help turn this around are aimed straight at the reader. Find the sentence that uses them.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-crosswalk-versions',
      kind: 'try_yourself',
      problem:
        'Both versions below describe the same new crosswalk. Read VERSION A, then choose the sentence that most clearly reveals that VERSION A\'s purpose is to inform, rather than persuade.\n\nVERSION A: "The city installed a new crosswalk with a flashing pedestrian light at Oak and Third Street this week. A pedestrian who presses the button on the pole turns the light on, and the light then stays lit for about fifteen seconds before switching off automatically."\n\nVERSION B: "The city finally decided to add a crosswalk at the dangerous corner of Oak and Third Street, and honestly, it is about time someone did something about it. Too many families walking to school have had close calls trying to cross that same stretch of road, and every one of those kids deserves a safer route home. Press the button, wait for the light, and take the extra fifteen seconds it offers to cross the street safely instead of rushing across on your own."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The city finally decided to add a crosswalk at the dangerous corner of Oak and Third Street, and honestly, it is about time someone did something about it.' },
        { id: 'b', text: 'Too many families walking to school have had close calls trying to cross that same stretch of road, and every one of those kids deserves a safer route home.' },
        { id: 'c', text: 'Press the button, wait for the light, and take the extra fifteen seconds it offers to cross the street safely instead of rushing across on your own.' },
        { id: 'd', text: 'A pedestrian who presses the button on the pole turns the light on, and the light then stays lit for about fifteen seconds before switching off automatically.', correct: true },
      ],
      expectedAnswer: 'A pedestrian who presses the button on the pole turns the light on, and the light then stays lit for about fifteen seconds before switching off automatically.',
      hints: [
        'Three of these sentences use a judgment word, an appeal to fairness, or a direct command aimed at the reader — all signs of a persuading purpose, and none of them come from VERSION A.',
        'The sentence that belongs to VERSION A only explains how the light works, step by step, with no opinion attached.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-lunch-trays',
      kind: 'try_yourself',
      problem:
        'Read the passage below, then choose the sentence that most reveals that the author\'s purpose is to persuade other schools to copy this cafeteria\'s switch, not simply to report what changed.\n\n"The cafeteria replaced its disposable trays with reusable ones this semester. Washing the trays now takes two extra staff hours each day, and the school paid for an industrial dishwasher to handle the new trays. Some students who have used the reusable trays say lunch feels less wasteful, while others say they miss how light the old disposable trays were to carry. Overall, the switch has been worth the extra effort, and every school should consider making the same change."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Overall, the switch has been worth the extra effort, and every school should consider making the same change.', correct: true },
        { id: 'b', text: 'The cafeteria replaced its disposable trays with reusable ones this semester.' },
        { id: 'c', text: 'Washing the trays now takes two extra staff hours each day, and the school paid for an industrial dishwasher to handle the new trays.' },
        { id: 'd', text: 'Some students who have used the reusable trays say lunch feels less wasteful, while others say they miss how light the old disposable trays were to carry.' },
      ],
      expectedAnswer: 'Overall, the switch has been worth the extra effort, and every school should consider making the same change.',
      hints: [
        'Three of these sentences report a fact, a cost, or a mix of opinions without picking a side. Look for the one sentence that states a judgment and tells other schools what to do.',
        'The words worth the extra effort and should consider making the same change are the author speaking directly to a decision, not just describing one.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-negative-and-numbers',
      kind: 'misconception_check',
      question:
        'A student reads a passage with the sentence "Recycling bins were emptied only twice last month" and immediately decides the whole passage must be persuading the reader that recycling is failing. Another student reads a passage packed with numbers and dates and immediately decides the whole passage must be written only to inform. What went wrong in each case?',
      commonErrors: [
        {
          answer: 'Any sentence that reports a problem or sounds negative must prove the author is persuading.',
          misconception:
            'Assuming that troubling content is itself proof of a persuasive purpose. A sentence that reports a real problem calmly is still informing; it only becomes persuading once it adds a judgment word or asks the reader to do something.',
          correctsTo:
            'Check whether the sentence states an opinion about the problem or asks the reader to act, not whether the problem sounds bad. "Recycling bins were emptied only twice last month" reports a fact. "Recycling bins were emptied only twice last month, and that is simply unacceptable" adds the judgment that makes it persuasive.',
        },
        {
          answer: 'Any passage packed with numbers, dates or specific details must be written only to inform.',
          misconception:
            'Assuming that the presence of facts proves neutrality. An author can select only the facts that support one side of an issue and still be building a case, so specific details do not by themselves rule out a persuasive purpose.',
          correctsTo:
            'Look at which facts were chosen and what the passage does with them. A passage that reports outcomes on more than one side is informing; a passage that lines up only the facts that favor one outcome, especially if it closes with a recommendation, is persuading even though every sentence in it is a fact.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Author\'s purpose is why a text was written, not its topic. Two texts about the exact same event can have two different purposes.',
        'A purpose has to be proven from the words on the page. State the purpose and its proof in the same sentence.',
        'Neutral word choice — is scheduled to, according to, matches — usually signals inform.',
        'A judgment word or a call to action — should, deserves, please, worth it — usually signals persuade. WRONG: deciding purpose from tone alone. CORRECT: checking whether a sentence states an opinion or asks the reader to act.',
        'Selected details reveal purpose too. Reporting outcomes on more than one side signals inform; lining up only the details that favor one side, especially in a closing recommendation, signals persuade.',
        'A sentence packed with facts is not automatically informing, and a sentence about a real problem is not automatically persuading. Check the sentence itself, not the feeling it gives.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.2', cedTitle: 'Author\'s Purpose' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
