/**
 * Grade 8 ELA — Research & Citation: Generating Related Research Questions.
 *
 * Procedure-led row (CCSS W.8.7). One repeatable move runs the whole lesson:
 * take a main research question, run four avenues at it — cause, effect,
 * comparison, change over time — and write down the sub-question each avenue
 * produces, then sort every candidate with one test, the same-report test.
 * Because this course carries no free response, a productive move is taught
 * and assessed by revision choice: the student runs the generation in their
 * head and then recognizes its product among four candidates, which is the
 * same arrangement the Unit 8 and Unit 9 writing rows use. Three failures
 * this plan is built to kill: a candidate that changes the subject while
 * keeping the topic's words, a candidate that drops one of the main
 * question's limits and so becomes a different project, and a candidate that
 * restates the main question in other words and opens nothing. A fourth,
 * quieter failure gets the misconception check: a long set that runs one
 * avenue five times.
 *
 * SCOPE GUARD: Grade 8 row 10.1 takes a self-generated research question and
 * GENERATES several related, focused sub-questions that open different
 * avenues of exploration (cause, effect, comparison, change over time), and
 * sorts a set of candidate sub-questions into ones that advance the main
 * question and ones that wander off it. Builds on
 * `m7ela-u10-research-questions.ts` (W.7.7: topic vs. question; the narrowing
 * move; open not yes/no; answerable; "a good question opens doors"), which
 * RECOGNIZES that a good question generates more questions; W.8.7 asks the
 * student to produce and organize them. Stops short of HS
 * `engl-u10-research-questions-and-sources.ts` (W.9-10.7/8: matching a
 * question to primary/secondary and scholarly/popular source types).
 * DELIBERATELY EXCLUDED: building a research question out of a topic — the
 * narrowing move, the yes/no opener swap, the answerable test — which is
 * `m7ela-u10-research-questions.ts`'s and is assumed here, so no keyIdea,
 * worked step or item asks the student to make or repair a MAIN question, and
 * every main question in this file arrives already narrowed; judging whether
 * a source is credible, and primary versus secondary, which is
 * `m7ela-u10-evaluating-sources.ts`'s — no segment weighs a source at all,
 * and the word "source" occurs in this file only as the plan's own `source`
 * field, which is never spoken; turning a sub-question into search terms and
 * reading a described list of results, which is row 10.2 — the word "search"
 * occurs only inside the `followUps` loId, which is never spoken, and no
 * segment asks where a question gets typed or what comes back; blending a
 * quotation into a sentence (row 10.3) and the order of
 * the pieces in a citation (row 10.4), neither of which appears; and matching
 * a question to a scholarly or popular source type, which is HS
 * `engl-u10-research-questions-and-sources.ts` and is named nowhere in the
 * body. DELIBERATELY ALLOWED, because the Grade 7 research row sits directly
 * below this one and rows 10.2-10.4 sit beside it: (a) the first keyIdea says
 * in one sentence that the student already knows how to turn a topic into one
 * focused research question and already knows that a good question keeps
 * handing over more questions — that is the hinge this row is built on, named
 * once and never re-taught, and no keyIdea defines a topic or walks the
 * four-part test; (b) the word "limits" is the earlier row's narrowing
 * vocabulary, and it is used here only for what a sub-question INHERITS from
 * a main question that already has them, never for how a main question gets
 * built; (c) the misconception check's first error resembles the earlier
 * row's "a bigger question gives me more to write about", and is a different
 * mistake — the six sub-questions in that list are the right size and the
 * wrong shape, all one avenue, which is a set problem rather than a size
 * problem; (d) the word "report" runs through the whole file as the thing a
 * sub-question's answer either fits or does not, because the same-report test
 * is the row's sorting instrument; nothing here teaches how a report is
 * written or organized, which is Unit 9's.
 *
 * NOTE FOR FUTURE AUTHORS: every school, town, street, creek, library and
 * main question in this file is original prose written for the item. This
 * course carries no passage machinery — no passageId, no shared texts — so
 * each question must be answerable from the words printed inside it, and no
 * published work may be quoted or closely paraphrased. Faulty candidates in
 * the tutor's own prose are labeled `WRONG FOR THIS MAIN QUESTION:` with the
 * `CORRECT:` version beside them, never a bare `WRONG:`: a sub-question that
 * wanders off is a perfectly good question standing in the wrong project, not
 * bad English, and a bare label here would teach that some questions are
 * simply wrong (fan-out contract ruling 26). The only unlabeled faulty
 * candidates are the MCQ distractors the three try_yourself items ask the
 * student to reject, each of which is then named in that item's hints, and
 * the six-question list inside the misconception check, which that segment
 * diagnoses line by line. No contraction appears anywhere in this file.
 *
 * CLAIM LEDGER:
 *   Claim                                   | Where             | Kind        | Grounds
 *   Street trees lower the temperature of   | concept keyIdeas  | REAL-WORLD  | Shade plus water
 *   the air on a block on a summer          | 1, 2, 4, 5        |             | released by leaves
 *   afternoon                               |                   |             | cools near-surface
 *                                           |                   |             | air; long-settled.
 *   The cooling changes as trees grow from  | concept keyIdea 2 | REAL-WORLD  | A larger canopy
 *   saplings into full-sized trees          |                   |             | shades more ground;
 *                                           |                   |             | long-settled.
 *   Refrigerated railcars let meat and      | worked 2 problem, | REAL-WORLD  | Long-settled US
 *   fresh produce reach American cities and | steps and answer  |             | economic history of
 *   changed what city markets carried       |                   |             | the late 1800s.
 *   Beavers build dams that pond water and  | try-2 problem and | REAL-WORLD  | Long-settled stream
 *   change the shape of a creek and the     | choices           |             | ecology; beaver dams
 *   land around it                          |                   |             | are the textbook case.
 *   Wood chips are cooked into pulp and the | misconception     | REAL-WORLD  | Standard description
 *   pulp is pressed and dried into sheets   | check, second     |             | of papermaking;
 *   of paper                                | correction        |             | long-settled.
 *   Public libraries commonly set aside a   | try-1 choice b    | REAL-WORLD  | A commonplace of US
 *   room for teenagers, and refrigerated    | and worked 2      |             | public libraries; both
 *   trucks carry chilled food today         | candidate 4       |             | are leaned on by a
 *                                           |                   |             | distractor, neither is
 *                                           |                   |             | asserted beyond this.
 *   Bellrose Middle School throws food away | hook              | STIPULATED  | Invented school.
 *   at the end of lunch and rewrote its     |                   |             | Internally consistent:
 *   menu two years ago                      |                   |             | all four reporters ask
 *                                           |                   |             | about the same lunch.
 *   A bike lane was built on Pearl Street   | worked 1 problem, | STIPULATED  | Invented street and
 *   and Hollis Middle School students ride  | steps and answer  |             | school. Internally
 *   to school along it                      |                   |             | consistent: every
 *                                           |                   |             | sub-question keeps the
 *                                           |                   |             | same street, school and
 *                                           |                   |             | two-year window.
 *   The Ardsley library moved its teen room | try-1 problem and | STIPULATED  | Invented library. The
 *   from the third floor to the ground      | choices           |             | stem and all four
 *   floor last fall                         |                   |             | choices name the same
 *                                           |                   |             | move in the same words.
 *   Beavers returned to Fenn Creek four     | try-2 problem and | STIPULATED  | Invented creek.
 *   years ago and built dams along it       | choices           |             | Internally consistent:
 *                                           |                   |             | the stem, the listed
 *                                           |                   |             | sub-question and every
 *                                           |                   |             | choice place the dams
 *                                           |                   |             | after the return and
 *                                           |                   |             | the before-years first.
 *   Dunbarton lit two public ball fields    | try-3 problem and | STIPULATED  | Invented town and park.
 *   three years ago; Redhill Park, three    | choices           |             | "Three years ago"
 *   miles away, is still unlit              |                   |             | matches "each of the
 *                                           |                   |             | three seasons since".
 *   The Ardmore paper mill closed, families | misconception     | STIPULATED  | Invented town. The six
 *   left, downtown stores closed and the    | check             |             | listed sub-questions and
 *   site is still empty                     |                   |             | the three repairs all
 *                                           |                   |             | describe one closing.
 *   No precise statistic about the real     | whole file        | —           | Checked: every quantity
 *   world is invented anywhere in this file |                   |             | is a plain count inside
 *                                           |                   |             | an invented setting.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8ELA_U10_GENERATING_RELATED_RESEARCH_QUESTIONS: LessonPlan = {
  id: 'evelyn.ms.m8ela.generating-related-research-questions.v1',
  title: 'Generating Related Research Questions',
  curriculum: 'MS',
  grade: '8',
  subject: 'ela',
  topic: 'grade-8-ela',
  locale: 'en',
  los: [
    {
      id: 'm8ela.generating-related-research-questions',
      standard: 'M8ELA-10.1',
      description:
        'From a self-generated research question, GENERATE several related, focused sub-questions that open different avenues of exploration (cause, effect, comparison, change over time), and sort a set of candidate sub-questions into ones that advance the main question and ones that wander off it (CCSS W.8.7).',
    },
  ],
  prerequisites: ['m8ela.reflection-and-a-narrative-conclusion'],
  followUps: ['m8ela.using-search-terms-effectively'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that a main question does not divide into work on its own, and that a set of sub-questions on different avenues does.',
      script:
        'Four of you sign up to write one article for the school paper: why so much food goes into the trash at the end of every Bellrose lunch. On Monday you split the work by agreeing that everybody will research the question. On Friday you have four sets of notes that say the same three things, and nobody has anything the other three do not already have. Now run Monday again, differently. One of you asks what is actually being thrown out, tray by tray. One asks what happens to it after it leaves the cafeteria. One asks how the middle school across town handles the same lunch and the same trash. One asks how the amount changed after the menu was rewritten two years ago. Same main question, same four people, and now four sets of notes that fit together instead of overlapping. The main question did not divide into work. Four smaller questions did. Today you learn how to produce those on purpose, and how to tell the ones that carry a project forward from the ones that quietly start a different one.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-generating-and-sorting-sub-questions',
      kind: 'concept',
      goal: 'Install the definition of a sub-question, the four avenues that generate a set, the limits a sub-question inherits, the same-report test that sorts candidates, and the three shapes that wander off.',
      keyIdeas: [
        'A SUB-QUESTION IS A SMALLER QUESTION THAT BELONGS TO THE SAME PROJECT. You already know how to turn a topic into one focused research question, and you already know that a good question keeps handing you more questions while you work. This lesson is about producing those on purpose instead of waiting for them to arrive. Take the main question "How do street trees change how hot a city block gets on a summer afternoon?" A sub-question is any smaller question whose answer would go in the report that answers it: "What is it about a tree that cools the air under it?" is one. The main question stays the project. The sub-questions are how you get through it.',
        'FOUR AVENUES GENERATE THE SET: CAUSE, EFFECT, COMPARISON, AND CHANGE OVER TIME. Run each avenue at the main question and write down what comes out. CAUSE, what makes this happen: "What is it about a tree that cools the air under it?" EFFECT, what it changes: "How does a cooler block change what people do outside on a hot afternoon?" COMPARISON, what it is like and unlike: "How does a block lined with trees compare with a block the same size that has none?" CHANGE OVER TIME, how it has moved: "How does the cooling change as the trees grow from saplings into full-sized trees?" One pass of the four avenues, four sub-questions, and about an afternoon of reading behind each.',
        'A SET IS GOOD WHEN THE AVENUES ARE DIFFERENT, NOT WHEN THE LIST IS LONG. Six sub-questions that all ask about causes give you one deep hole and three walls you never looked at. So before you start reading, lay the set out and label each one with its avenue. If the same label turns up three times, you have found the hole: run one of the missing avenues at the main question and write down the sub-question it produces. A set of four on four avenues tells you more than a list of ten on one.',
        'A SUB-QUESTION INHERITS EVERY LIMIT THE MAIN QUESTION CARRIES. Your main question arrived with its limits already on it — which kind, which place, which time — and a sub-question keeps all of them. Drop one and the question stops being smaller than the main question and starts being bigger, which makes it a different project that has swallowed yours. WRONG FOR THIS MAIN QUESTION: "How do cities around the world deal with summer heat?" CORRECT: "How does a block lined with trees compare with a block the same size that has none?" The second one can be answered in an afternoon, and the answer goes straight into the report. The first one is a book.',
        'THE SAME-REPORT TEST SORTS EVERY CANDIDATE IN ONE MOVE. Imagine the answer written down, then ask one question about it: would that answer go in the report that answers the main question, or would it need a report of its own? That is the whole test, and it works down a list fast. Being about the same subject is not enough to pass it. "How many people live on the block with the trees?" is about the very same block, and its answer belongs in a report about who lives there, not in a report about heat.',
        'THREE SHAPES WANDER OFF, AND EACH ONE HAS A TELL. A candidate that CHANGES THE SUBJECT keeps the topic\'s words while its answer heads somewhere else; the tell is that you cannot name the sentence of your report it would go in. A candidate that DROPS A LIMIT is bigger than the main question; the tell is that answering it would take longer than the whole project. A RESTATEMENT says the main question over again in different words; the tell is that it opens nothing, because you already have that question. Cutting one is not throwing away the interest. Write it on its own line and let it be somebody\'s project later.',
      ],
      vocabulary: [
        { term: 'sub-question', definition: 'a smaller question generated from a main research question, whose answer belongs in the report that answers the main question.' },
        { term: 'avenue', definition: 'one direction a sub-question can explore. This lesson uses four: cause, effect, comparison, and change over time.' },
        { term: 'the same-report test', definition: 'imagining the answer to a candidate sub-question and asking whether that answer would go in the report that answers the main question, or would need a report of its own.' },
        { term: 'restatement', definition: 'a candidate that says the main question over again in different words, so it opens nothing the researcher did not already have.' },
        { term: 'question set', definition: 'the group of sub-questions generated from one main question, checked for holes by labeling each one with its avenue.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-generate-a-set-from-one-question',
      kind: 'worked_example',
      problem:
        'Here is a main research question. Generate a set of sub-questions from it, then check the set and two candidates a group member added.\n\nMAIN QUESTION: "How did the new bike lane on Pearl Street change how Hollis Middle School students get to school?"',
      steps: [
        'Read the limits off the main question before you generate anything, because every sub-question has to keep them. Which place: Pearl Street, and one school on it. Which change: the bike lane going in. Which people: students getting to school, not everybody who uses the street. Anything you write that leaves one of those behind has left the project.',
        'Run the CAUSE avenue: what made this happen, or what was there before it? "How were students getting to school on Pearl Street before the lane was built?" That answer sets the before, and without a before there is no change to measure.',
        'Run the EFFECT avenue: what did it change? "What has changed at the bike racks and in the drop-off line since the lane opened?" Notice that the effect avenue is the direction the main question itself is pointing, so it usually produces two or three questions rather than one. Write them all down and keep the best.',
        'Run the COMPARISON avenue: what is this like and unlike? "How do students who live on streets with no bike lane get to school now?" The comparison stays inside the limits: same school, same year, one street with a lane and one without. A comparison that reaches outside them is a different project, not a sub-question.',
        'Run the CHANGE OVER TIME avenue: how has it moved? "How has the number of students riding changed across each of the two years since the lane opened?" A change that showed up in one week and a change that built over two years are two different findings, and this is the only avenue that can tell them apart.',
        'Now check the set. Four sub-questions, four different labels, so there is no hole to fill. Then run the same-report test on the first candidate a group member added: "How much did the city pay for the Pearl Street bike lane?" Imagine the answer. It is a figure out of a city budget, and it would go in a report about what the city spends, not in a report about how students get to school. It is not a bad question. It is a different project, so write it on its own line and leave it there.',
        'The second candidate is "Why do people ride bikes?" That one keeps the subject and drops every limit at once — not Hollis students, not Pearl Street, not these two years — so answering it would take longer than the whole project. This one can be repaired, because the interest underneath it does fit: put the limits back on. WRONG FOR THIS MAIN QUESTION: "Why do people ride bikes?" CORRECT: "What do the Hollis students who now ride on Pearl Street say made them start?"',
      ],
      answer:
        'A set of four, one per avenue. CAUSE: "How were students getting to school on Pearl Street before the lane was built?" EFFECT: "What has changed at the bike racks and in the drop-off line since the lane opened?" COMPARISON: "How do students who live on streets with no bike lane get to school now?" CHANGE OVER TIME: "How has the number of students riding changed across each of the two years since the lane opened?" Of the two added candidates, the budget question is parked as its own project, and "Why do people ride bikes?" is repaired by putting the main question\'s limits back on it.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-sort-five-candidates',
      kind: 'worked_example',
      problem:
        'Here is a main question and five candidate sub-questions. Sort the candidates into the ones that advance the main question and the ones that wander off it, and name what is wrong with each one that wanders.\n\nMAIN QUESTION: "How did the refrigerated railcar change what people in American cities ate?"\n\n(1) "What foods appeared in city markets once refrigerated railcars were running that had not been there before?"\n(2) "How did the work of a city butcher change once meat could arrive already chilled?"\n(3) "Who patented the refrigerated railcar?"\n(4) "How does a modern refrigerated truck keep food cold?"\n(5) "How did railroads change the United States?"',
      steps: [
        'Read the limits off the main question first. Which thing: refrigerated railcars. Which place: American cities. Which aspect: what people there ate. Three limits, and a candidate has to keep all three to survive the sort.',
        'Candidate 1 advances the main question, on the EFFECT avenue. Imagine the answer: a list of foods that city markets carried afterward and had not carried before. That sentence goes straight into the report, because it is the main question answered one food at a time.',
        'Candidate 2 advances it as well, on the EFFECT avenue again, one step further along — the same change reaching one group of people. Two questions on one avenue is not a fault by itself. It is a signal to check the set for a hole, and this set has one: nothing here asks how city food changed across the years the railcars spread, which is the change-over-time avenue.',
        'Candidate 3 wanders off, and it is the hardest one to cut, because it is about the exact machine the main question names. Imagine the answer: a name and a date. Now find the sentence of a report about what city people ate where that would go. There is not one. It is a fact standing beside the project rather than inside it. WRONG FOR THIS MAIN QUESTION: "Who patented the refrigerated railcar?" CORRECT: "How quickly did refrigerated railcars reach the cities, and what arrived in them first?"',
        'Candidate 4 changes the subject while keeping the topic\'s words. A modern truck is not a railcar and now is not then, so its answer explains a machine that had nothing to do with what those city families ate. The tell is the one from the lesson: you cannot name the sentence of the report it would go in.',
        'Candidate 5 drops every limit at once. Not railcars but railroads, not city food but a whole country, not one change but all of them. Answering it would take longer than the project it was supposed to serve, and that is exactly what makes it a different project instead of a sub-question.',
        'Say the sort out loud, then act on what it exposed. Candidates 1 and 2 advance the main question; 3, 4 and 5 wander off, one as a fact beside the project, one by changing the subject, one by dropping the limits. Then fill the hole with a change-over-time question before any reading starts.',
      ],
      answer:
        'Advancing: (1) and (2), both on the effect avenue. Wandering: (3), whose answer is a name and a date that no sentence of this report would use; (4), which changes the subject from a railcar then to a truck now; and (5), which drops every limit and becomes a different project. The sort also exposes a hole, because no candidate asks how city food changed across the years the railcars spread, so the set needs a change-over-time question added before the reading starts.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-sort-one-candidate-in',
      kind: 'try_yourself',
      problem:
        'The Ardsley town library moved its teen room from the third floor down to the ground floor last fall. A student\'s main question is "How did moving the teen room to the ground floor change who uses it?"\n\nWhich of these four is a sub-question that advances that main question?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'How did the move down from the third floor to the ground floor change the kind of people who come into the teen room?' },
        { id: 'b', text: 'How do public libraries around the country decide which floor a teen room belongs on, and what reasons do they give?' },
        { id: 'c', text: 'How much did the Ardsley library spend on the new shelving and lighting it put into the ground-floor room last fall?' },
        { id: 'd', text: 'How did the number of middle schoolers signing in at the teen room change in the months after the move downstairs?', correct: true },
      ],
      expectedAnswer: 'How did the number of middle schoolers signing in at the teen room change in the months after the move downstairs?',
      hints: [
        'Run the same-report test on each one. Imagine the answer written down, then ask whether that sentence would go in the report that answers the main question, or would need a report of its own.',
        'One candidate is the main question said over again in different words, so it opens nothing new. One drops every limit and asks about libraries everywhere. One asks what the library spent, which belongs in a report about the budget. The candidate that is left names something a person could count before the move and after it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-open-a-different-avenue',
      kind: 'try_yourself',
      problem:
        'Beavers returned to Fenn Creek four years ago and began building dams along it. A student\'s main question is "How did the return of beavers change Fenn Creek and the land around it?" One sub-question is already on the list: "What did the creek look like in the years before the beavers came back?"\n\nWhich of these four opens a DIFFERENT avenue from that one while staying inside the main question?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'What has happened to the frogs, the fish and the birds in the stretch of creek where the new dams sit?', correct: true },
        { id: 'b', text: 'How much water ran down that stretch of Fenn Creek in each of the years before the beavers arrived and built dams?' },
        { id: 'c', text: 'How do beaver dams change the shape of rivers in other parts of the world, and how fast do they do it?' },
        { id: 'd', text: 'How long is Fenn Creek altogether, from the spring where it starts to the river it finally runs into?' },
      ],
      expectedAnswer: 'What has happened to the frogs, the fish and the birds in the stretch of creek where the new dams sit?',
      hints: [
        'Label the sub-question that is already on the list with its avenue — cause, effect, comparison, or change over time — and then label each choice. You are looking for a label the list does not already carry.',
        'One choice asks again about the years before the beavers arrived, which is exactly the ground the first sub-question already covers. One asks about rivers everywhere, which is bigger than the main question and would need its own report. One asks for a single measurement that no sentence about the beavers would use. The choice that is left asks what the change did to something living in that creek.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-fill-the-hole-in-the-set',
      kind: 'try_yourself',
      problem:
        'The town of Dunbarton put lights on its two public ball fields three years ago. A student researching the main question "How did adding lights to the Dunbarton ball fields change the way the fields are used?" has three sub-questions written down already.\n\n(1) "Why did the town decide to light these two fields and not the others?"\n(2) "What has changed for the families who live on the street beside the fields?"\n(3) "How has the number of evening games changed across each of the three seasons since the lights went in?"\n\nWhich of these four opens the avenue the set is still missing, without leaving the main question behind?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Why did the town choose to put the lights up in the fall rather than waiting until the spring season had started?' },
        { id: 'b', text: 'How is the field at Redhill Park, three miles away and still unlit, being used on the same weeknights this season?', correct: true },
        { id: 'c', text: 'How much do towns across the state spend on lighting their public ball fields, and how do they decide it is worth it?' },
        { id: 'd', text: 'How has the noise on the street beside the fields changed on the weeknights when a game runs past nine at night?' },
      ],
      expectedAnswer: 'How is the field at Redhill Park, three miles away and still unlit, being used on the same weeknights this season?',
      hints: [
        'Label the three sub-questions that are already written down with their avenues, and name the one avenue that is missing. Then check each choice against that label and against the main question\'s limits.',
        'The set already asks why the lights went in, what changed for the neighbors, and how the evenings have changed season by season, so two of the choices open an avenue that is covered. Of the two that open the missing one, only one stays with the Dunbarton fields and this season.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-long-list-and-same-subject',
      kind: 'misconception_check',
      question:
        'A student is researching the main question "How did the closing of the Ardmore paper mill change the town?" and hands in this list of sub-questions: "Why did the mill close?" "Why did the company move production somewhere else?" "Why did the town not find another buyer for the building?" "Why did the downtown stores close after the mill did?" "Why is the mill site still empty?" "How is paper made from wood chips?" The student says the list is finished, because six is more than anybody else has and every single question on it is about the mill. What has gone wrong?',
      commonErrors: [
        {
          answer: 'The list is finished, because it has six sub-questions and every one of them is about the mill.',
          misconception:
            'Counting the set instead of labeling it. A long list feels like thorough work, and every question on it really is about the right subject, so nothing looks wrong until somebody names the avenues.',
          correctsTo:
            'Label them. Why the mill closed, why the company moved, why no buyer turned up, why the downtown stores closed, why the site is still empty: that is the cause avenue asked five times. The set is one deep hole with three walls nobody has looked at. Run the missing avenues at the main question and the holes fill in fast. EFFECT: "What happened to the streets around the mill in the years after it closed?" COMPARISON: "How did a nearby town that kept its mill change over the same years?" CHANGE OVER TIME: "What did Ardmore look like five years after the closing compared with one year after?" Four sub-questions on four avenues tell you more than ten on one.',
        },
        {
          answer: 'The last question belongs on the list too, because the whole project is about a paper mill.',
          misconception:
            'Treating "same subject" as the test. Every word of that question is on topic, so it feels like it belongs, and the student never stops to imagine the answer.',
          correctsTo:
            'Run the same-report test. Imagine the answer: wood chips are cooked into pulp, and the pulp is pressed and dried into sheets. Now find the sentence in a report about how the closing changed Ardmore where that would go. There is not one. It is the opening paragraph of a different report, about how paper gets made, and it would be a good report. So the move is not to delete the question. Write it on its own line, under its own heading, and leave the project you are actually doing alone.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A sub-question is a smaller question whose answer belongs in the report that answers the main question. The main question stays the project; the sub-questions are how you get through it.',
        'Generate the set by running four avenues at the main question: cause, effect, comparison, and change over time. One pass of the four gives you a set instead of a pile.',
        'A set is good when the avenues are different, not when the list is long. Label each sub-question with its avenue, and if one label turns up three times, run a missing avenue and write down what comes out.',
        'A sub-question inherits every limit the main question carries — which kind, which place, which time. Drop one and the question is bigger than the main question, which makes it a different project rather than a smaller one.',
        'The same-report test settles a candidate in one move: imagine the answer, then ask whether that sentence would go in the report that answers the main question or would need a report of its own. Being about the same subject is not enough.',
        'Three shapes wander off: one changes the subject, one drops a limit, and one restates the main question in different words. WRONG FOR THIS MAIN QUESTION: "How do cities around the world deal with summer heat?" CORRECT: "How does a block lined with trees compare with a block the same size that has none?" Cutting a candidate does not throw away the interest — write it on its own line and let it be a project later.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.1', cedTitle: 'Generating Related Research Questions' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
