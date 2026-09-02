/**
 * Grade 6 ELA — Theme, Point of View & Figurative Language: Theme &
 * Objective Summary.
 *
 * CONCEPT-LED exemplar for the m6ela fan-out. The student arrives with no
 * procedure to lean on, so the whole lesson builds one way of reading: a
 * THEME is a complete sentence about people that the particular details of
 * the story support, and an OBJECTIVE SUMMARY reports what happened without
 * smuggling in what the reader thought of it (CCSS RL.6.2). Three traps this
 * plan is built to kill: naming a one-word topic and calling it a theme,
 * writing a command ("always tell the truth") instead of a theme, and letting
 * a judgment ("the best part", "kind of boring") ride along inside a summary.
 *
 * SCOPE GUARD: Grade 6 row 2.1 determines ONE theme of a literary text from
 * particular details, and produces a summary of that text free of personal
 * opinion or judgment. DELIBERATELY EXCLUDED: tracing how a theme DEVELOPS or
 * deepens across a whole text, and handling two or more themes at once — that
 * is RL.7.2, taught by the shipped m7ela U2.1 lesson, and it must not appear
 * here. Also excluded: naming the plot stages exposition, rising action,
 * climax and resolution (row 1.2 owns those), and the central idea of an
 * INFORMATIONAL text with its own summary (rows 3.1 and 3.2). DELIBERATELY
 * ALLOWED, because those neighbouring rows sit close: (a) the phrase "central
 * idea" appears in this plan's LO description because it is RL.6.2's own
 * wording for a literary text, not because this lesson reaches into row 3.1;
 * (b) the worked example asks what the character wants, what gets in the way
 * and what is different by the end — that is the route to a theme, and it
 * names no plot stage anywhere; (c) every excerpt in this file is narrative
 * fiction, which is what keeps the summary work on this side of the row 3.2
 * boundary.
 *
 * NOTE FOR FUTURE AUTHORS: every story in this file is original prose written
 * for the item. This course carries no passage machinery — no passageId, no
 * shared texts — so each question must be solvable from the sentences printed
 * inside it, and no published work may be quoted or closely paraphrased.
 * Every phrase this file puts inside quotation marks appears character-for-
 * character in the excerpt above it; quote your own excerpt exactly, never
 * from memory.
 *
 *
 * CLAIM LEDGER: none required. Every excerpt in this file is invented
 * narrative fiction, which is true by construction, so there is no factual
 * claim to verify. Rows whose passages are INFORMATIONAL (all of Units 3 and
 * 4, and any other row needing nonfiction) must carry the three-column claim
 * ledger described in the fan-out contract instead of this line.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 1.4 -> 2.1 ->
 * 2.2. All 40 rows are now registered, so this row's prerequisite (row 1.4,
 * How a Scene Fits the Whole Story) and followUp (row 2.2, Point of View of
 * the Narrator) are wired below.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6ELA_U2_THEME_AND_OBJECTIVE_SUMMARY: LessonPlan = {
  id: 'evelyn.ms.m6ela.theme-and-objective-summary.v1',
  title: 'Theme & Objective Summary',
  curriculum: 'MS',
  grade: '6',
  subject: 'ela',
  topic: 'grade-6-ela',
  locale: 'en',
  los: [
    {
      id: 'm6ela.theme-and-objective-summary',
      standard: 'M6ELA-2.1',
      description:
        'Determine a text\'s theme or central idea from particular details, state it as a complete sentence rather than a one-word topic or a command, and provide a summary of the text that is distinct from personal opinion or judgment (CCSS RL.6.2).',
    },
  ],
  prerequisites: ['m6ela.how-a-scene-fits-the-whole-story'],
  followUps: ['m6ela.point-of-view-of-the-narrator'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student feel the gap between naming a subject and saying what a story showed.',
      script:
        'Your cousin asks what the movie you just watched was about. You could answer two very different ways. You could say "a dog." That is true, and it tells your cousin almost nothing. Or you could say "a kid finds out that keeping a secret costs more than telling the truth would have." That is also true, and now your cousin knows what the movie was actually doing. Same movie, two answers, and only one of them is worth saying out loud. Today we learn the difference between those two answers. Then we practice the other half of the job: retelling a story without letting what you thought of it leak in.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-theme-and-summary',
      kind: 'concept',
      goal: 'Separate topic from theme, install the build-it-from-details method, and define what objective means in a summary.',
      keyIdeas: [
        'THE TOPIC IS A WORD. THE THEME IS A WHOLE SENTENCE. Friendship, courage, jealousy and fairness are topics. They name what a story keeps circling, and they make no claim at all. A theme says something about the topic: "A friendship can survive a mistake when the person who made it says so out loud." If your answer to "what is the theme" fits in one or two words, you have named the topic and stopped early.',
        'THE THEME IS ALMOST NEVER PRINTED IN THE STORY. You build it out of particular details. Ask three questions in order: what does the main character want, what gets in the way, and what is different by the end? Then turn the answer into one sentence about people in general, not about that one character.',
        'A THEME IS NOT AN ORDER. "Always tell the truth" and "Never give up" are commands. A theme reports what the story showed happening: "Telling the truth late costs more than telling it early." Watch for the words always and never at the front of your sentence. They are usually a sign that you wrote a rule instead of a theme.',
        'TEST YOUR THEME AGAINST TWO SEPARATE DETAILS. Say the sentence, then point at two different places in the text that support it. If you can only find one, or none, you have a guess. A theme has to fit the whole story, not one line of it.',
        'AN OBJECTIVE SUMMARY REPORTS WHAT HAPPENED, IN ORDER, AND REACHES THE ENDING. Who the story is about, what they did, what changed, and how it turned out. Use your own words. Keep the events the ending depends on, and cut the ones it does not.',
        'OBJECTIVE MEANS YOUR OPINION STAYS OUT. Cross out "I think", "the best part", "sadly", "amazing", "kind of boring". Those words grade the story instead of reporting it. A good test: could two readers who disagreed about whether they liked the story both sign your summary? If not, an opinion is still hiding in there.',
      ],
      vocabulary: [
        { term: 'topic', definition: 'the subject a text keeps circling, named in a word or two, such as fairness or growing up.' },
        { term: 'theme', definition: 'a complete sentence stating a message about people or life that the whole text supports.' },
        { term: 'particular details', definition: 'the specific events and words in the text that a reader can point at as proof.' },
        { term: 'objective summary', definition: 'a retelling of a text\'s important events, in order and in your own words, with no opinion added.' },
        { term: 'judgment', definition: 'a statement of how good, bad or interesting something is. A judgment belongs in a review, not in a summary.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-build-a-theme',
      kind: 'worked_example',
      problem:
        'Build a theme statement for this story, and prove it from the words on the page.\n\n"Dario spent three weeks building a cardboard city for the science fair, and he would not let his little sister touch any of it. The night before the fair, she asked one more time. He said no, and then he stayed up until midnight gluing the last roof on by himself. At the fair he stood beside his table alone while other kids explained their projects in pairs."',
      steps: [
        'Name the topic first, in a word or two. This story keeps circling doing things alone. That is the subject. It is not a theme yet, because it makes no claim about anything.',
        'Ask what the character wants. Dario wants the city to be entirely his. The text shows it: he "would not let his little sister touch any of it," even when "she asked one more time."',
        'Ask what it costs him. He is "gluing the last roof on by himself" at midnight, and at the fair he "stood beside his table alone while other kids explained their projects in pairs." Both of those are prices, and neither one is about cardboard.',
        'Ask what is different by the end. The city got finished, exactly the way he wanted. What changed is who is standing next to him, and the story ends on that empty space, not on the project.',
        'Now write one sentence about people, not about Dario: "Refusing every offer of help can finish the work and still leave you standing by yourself."',
        'Run the command test. The sentence does not begin with always or never, and it does not tell anyone what to do. It reports what this story showed. That makes it a theme and not a rule.',
        'Run the two-details test. Detail one: he "would not let his little sister touch any of it." Detail two: he "stood beside his table alone while other kids explained their projects in pairs." Two separate places in the story, both supporting the same sentence. The theme holds.',
      ],
      answer:
        'Theme: refusing every offer of help can finish the work and still leave you standing by yourself. Evidence: Dario "would not let his little sister touch any of it," and at the fair he "stood beside his table alone while other kids explained their projects in pairs."',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-repair-a-summary',
      kind: 'worked_example',
      problem:
        'Repair this summary so that it is objective.\n\nStory: "Priya\'s neighborhood library cut its Saturday hours, so the reading club she ran for second graders lost its room. For two weeks she held the club on the library steps, and three kids stopped coming because it was cold. In November the manager of the corner bakery offered her the four back tables on Saturday mornings, and by December the club was bigger than it had been in the library."\n\nStudent summary: "This story was really inspiring. Priya runs a reading club for second graders, and her sweater is always yellow. The library cut its hours, which was a terrible decision. She moved the club outside and then somewhere else."',
      steps: [
        'Hunt the judgments first and cross them out. "Really inspiring" says how the reader felt. "A terrible decision" grades a choice the story only reports. Neither one is something that happened, so neither one belongs in a summary.',
        'Hunt the invented detail. The yellow sweater is nowhere in the story. A summary can carry only what the text actually says, and adding a detail is a bigger error than leaving one out.',
        'Check whether the summary reaches the ending. It stops at "then somewhere else." The two things that make the story finish are missing: the bakery tables, and the club being bigger by December. A summary that stops before the ending is not a summary yet.',
        'Sort what is left into the events the ending needs: the Saturday hours cut, the room lost, two weeks on the steps, three kids gone because of the cold, the bakery tables in November, the bigger club in December.',
        'Rebuild it in order, in your own words, and reach the end.',
        'WRONG: "This story was really inspiring. Priya runs a reading club for second graders, and her sweater is always yellow. The library cut its hours, which was a terrible decision. She moved the club outside and then somewhere else." CORRECT: "Priya\'s reading club for second graders loses its room when the library cuts its Saturday hours. She holds the club on the library steps for two weeks, and three kids stop coming because of the cold. In November a bakery offers her its back tables on Saturday mornings, and by December the club is larger than it was in the library."',
        'Last check on the repaired version. Could a reader who loved this story and a reader who found it dull both sign that paragraph? Yes, because every sentence in it reports an event. That is what objective means.',
      ],
      answer:
        'Priya\'s reading club for second graders loses its room when the library cuts its Saturday hours. She holds the club on the library steps for two weeks, and three kids stop coming because of the cold. In November a bakery offers her its back tables on Saturday mornings, and by December the club is larger than it was in the library.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-which-one-is-a-theme',
      kind: 'try_yourself',
      problem:
        'Read the story, then choose the statement that is a THEME.\n\n"Jae practiced her lines in the bathroom mirror for two weeks and told nobody she had auditioned. When the cast list went up with her name on it, she read it three times before she believed it. At dinner she still said it was probably a mistake."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The nervous excitement of trying out for a part in a school play.' },
        { id: 'b', text: 'Always believe in yourself, even when nobody else knows what you are doing.' },
        { id: 'c', text: 'Jae reads the cast list three times before she believes her own name.' },
        { id: 'd', text: 'Working in secret can make a success hard to believe when it arrives.', correct: true },
      ],
      expectedAnswer: 'Working in secret can make a success hard to believe when it arrives.',
      hints: [
        'Three of these are not sentences that say something about people. One names a subject without claiming anything about it, one gives an order, and one only repeats an event from the story.',
        'A theme is one sentence about people in general that the details support. Ask what Jae keeping the audition secret cost her at the moment she saw her own name.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-theme-the-details-support',
      kind: 'try_yourself',
      problem:
        'Read the story, then choose the theme that the particular details actually support.\n\n"Ravi promised to walk the Bhatt family\'s dog every day in July. On the eighth morning he slept through his alarm, and on the ninth he went to the pool instead. When Mrs. Bhatt paid him the full amount they had agreed on at the end of the month, Ravi handed some of it back without being asked and told her why."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Admitting what you did not do can matter more than keeping what you were paid.', correct: true },
        { id: 'b', text: 'Summer jobs always turn out to pay less than they are worth once you count up all the hours.' },
        { id: 'c', text: 'Never take on a job unless you are certain you can finish every day of it.' },
        { id: 'd', text: 'Ravi walked the Bhatt family\'s dog every morning in July except for two.' },
      ],
      expectedAnswer: 'Admitting what you did not do can matter more than keeping what you were paid.',
      hints: [
        'Say each sentence, then try to point at two details in the story that support it. Two of these have no details behind them at all.',
        'The story spends its last sentence on one action nobody asked Ravi to take. Whatever the theme is, it has to be about that choice.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-best-objective-summary',
      kind: 'try_yourself',
      problem:
        'Read the story, then choose the best OBJECTIVE SUMMARY.\n\n"The sixth grade band had one working music stand for eleven players, so Nora spent two weekends repairing the broken ones with parts from her uncle\'s shop. Mr. Colley told her the school would not pay her back for the screws. She fixed ten stands anyway, and in December the band played its first concert with every player reading from a stand."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Schools should make sure their music programs have working equipment, because a student like Nora should not have to give up two weekends and her own family\'s supplies to repair what the school already owns. The December concert showed that the band deserved that support all along.' },
        { id: 'b', text: 'The sixth grade band has one working music stand for eleven players, so Nora spends two weekends repairing ten of them with parts from her uncle\'s shop, even after Mr. Colley tells her the school will not pay for the screws. In December the band plays its first concert with every player reading from a stand.', correct: true },
        { id: 'c', text: 'Nora is incredibly generous, and the best part of the whole story is how patient she stays about the whole thing. The band having only one decent stand was honestly unfair to everybody, and Mr. Colley was not very helpful when she came to him. It all works out beautifully at the concert in December, which was easily the best part of the whole year.' },
        { id: 'd', text: 'Nora\'s uncle has a shop with parts in it. Mr. Colley spoke to Nora about screws and about what the school pays for. The sixth grade band has eleven players. There are music stands at the school, and some of them were broken. Two weekends went by. A concert happened in December.' },
      ],
      expectedAnswer: 'The sixth grade band has one working music stand for eleven players, so Nora spends two weekends repairing ten of them with parts from her uncle\'s shop, even after Mr. Colley tells her the school will not pay for the screws. In December the band plays its first concert with every player reading from a stand.',
      hints: [
        'A summary reports events in order and reaches the ending. Read each choice and ask whether someone who had not read the story would know what happened.',
        'One choice argues for something instead of reporting, one grades the story with "incredibly" and "the best part", and one lists true details in the wrong order without ever saying what Nora did.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-topic-and-opinion',
      kind: 'misconception_check',
      question:
        'A student finishes a story and writes: "The theme is friendship. Also, this story was really sad, and the ending was the best part." Two different things went wrong. What are they?',
      commonErrors: [
        {
          answer: 'The theme is friendship.',
          misconception:
            'Naming the topic and stopping. The single word is true about the story, so it feels like a finished answer, and nothing in it looks like a mistake.',
          correctsTo:
            'A topic names what the story keeps circling. A theme says something about it. Turn the word into a full sentence about people, then prove it: "friendship" becomes "A friendship can hold together when one friend admits what they did," and then you point at two separate details that support that sentence. Here is the quick check: if your theme fits in one or two words, it is a topic, and you are not finished.',
        },
        {
          answer: 'This story was really sad, and the ending was the best part.',
          misconception:
            'Reporting a reaction where a summary was asked for. The feeling is genuine and the student is not wrong to have it, which is exactly why it does not look like an error.',
          correctsTo:
            'An objective summary reports events, not feelings about them. Cross out every word that grades the story: sad, best, boring, amazing, inspiring. Then check that what is left says who the story is about, what they did, and how it ended. Run the two-readers test — a reader who loved the story and a reader who did not should both be able to sign your summary. The reaction is still worth writing down; it just belongs in a review, not here.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The topic is a word. The theme is a whole sentence about people that the story shows to be true.',
        'The theme is almost never printed in the story. Build it from particular details: what the character wants, what gets in the way, what is different at the end.',
        'Watch for always and never at the front of your sentence. WRONG: "Always tell the truth." CORRECT: "Telling the truth late costs more than telling it early."',
        'Test every theme against two separate details. One detail, or none, means you have a guess.',
        'An objective summary reports what happened, in order, in your own words, and reaches the ending.',
        'Objective means your opinion stays out. Cut sad, best, boring, amazing, and every "I think". If two readers who disagreed about the story could both sign it, it is objective.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.1', cedTitle: 'Theme & Objective Summary' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
