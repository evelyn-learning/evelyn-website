/**
 * HS English — Research & Citation: Research Questions & Source Types.
 *
 * The opening skill of the research unit (CCSS W.9-10.7): narrow a broad
 * topic into a focused, researchable question, then match that question to
 * the sources that can actually answer it — primary vs secondary, scholarly
 * vs popular. Every practice item is a scoping or source-matching MCQ.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ENGL_U10_RESEARCH_QUESTIONS_AND_SOURCES: LessonPlan = {
  id: 'evelyn.hs.engl.research-questions-and-sources.v1',
  title: 'Research Questions & Source Types',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'ela',
  topic: 'hs-english',
  locale: 'en',
  los: [
    {
      id: 'engl.research-questions-and-sources',
      standard: 'ENGL-10.1',
      description:
        'Narrow a broad topic into a focused, researchable question that is properly scoped and answerable by evidence, then match that question to the source types that can answer it — primary versus secondary, scholarly versus popular (CCSS W.9-10.7, W.9-10.8).',
    },
  ],
  prerequisites: ['engl.introductions-and-conclusions'],
  followUps: ['engl.evaluating-sources'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame research as the everyday skill of asking a question small enough to actually answer — and knowing where the answer lives.',
      script:
        'You already do research. You do it when you spend three weeks deciding which used car is worth the money, and you do it when a group chat argument stalls out because nobody can produce a single fact. The difference between three hours of scrolling and twenty minutes of real answers is almost never effort. It is the question. "Cars" is not a question. "Which of these two model years had more reported transmission failures" is a question, and the moment you have it you also know where to look. Today we build focused, researchable questions and then match each one to the kind of source that can actually settle it.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-questions-and-sources',
      kind: 'concept',
      goal: 'Turn a topic into a scoped, researchable question, then match the question to the right source type.',
      keyIdeas: [
        'TOPIC VS RESEARCH QUESTION — a topic is a subject area ("the old rail line", "school start times"). A research question is a single sentence ending in a question mark that names what you want to find out: "Why was the county rail spur abandoned in the 1960s?" A topic tells you where to wander; a question tells you when you are finished.',
        'THE GOLDILOCKS SCOPE TEST — the question must be answerable at the size of the project you were assigned. Too broad ("What caused industrial decline?") would take a book and a career. Too narrow ("What day did the depot close?") is one fact, and once you have it there is nothing left to write. Aim for a question that needs several sources and produces a paragraph or two of real explanation per source.',
        'THE RESEARCHABLE TEST — evidence has to be able to settle it. "Was closing the rail spur the right call?" is pure opinion; two honest people can read the same records and disagree forever. Make it researchable by asking for something evidence can show: "What reasons did county officials give for closing the rail spur, and what happened to freight shipping in the five years after?"',
        'THE YES/NO ERROR — a question answerable with one word is not a research question. "Did the depot close in 1964?" ends the project in one search. The repair is to swap the yes/no opener (Did, Is, Was, Should) for an opener that demands explanation: Why, How, What effect, To what extent. "Did" becomes "Why did", and the whole project reopens.',
        'PRIMARY VS SECONDARY SOURCES — a PRIMARY source was created by someone present at the event or is the raw thing itself: a county archive letter, meeting minutes, a photograph, a diary, census data, an interview you conduct, the poem you are analyzing. A SECONDARY source describes, analyzes, or summarizes primary material after the fact: a historian\'s article about the rail closures, a textbook chapter, a review of a poem. Same document can be either, depending on the question — a 1964 newspaper story is secondary evidence about the closure and primary evidence about how the closure was reported.',
        'SCHOLARLY VS POPULAR — scholarly work is written by researchers for other researchers, reviewed by experts before publication, and cites its own sources; it is precise, slow, and narrow. Popular work is written for a general audience by writers or journalists; it is current, readable, and rarely cites data directly. Scholarly sources support claims about causes and findings. Popular sources are good for recent events, public reaction, and pointing you toward the studies underneath.',
        'MATCH THE SOURCE TO THE QUESTION — read your question and ask what kind of evidence would settle it. A question about what officials said needs the records they left, so go primary. A question about what researchers have concluded needs peer-reviewed studies, so go scholarly. A question about last month needs current reporting, so go popular. Choosing a source before you have a question is how research turns into scrolling.',
        'PRIMARY IS NOT AUTOMATICALLY BETTER — a primary source is closer to the event, not more objective. A letter from the official who ordered the closure is evidence of that official\'s reasoning, not proof the reasoning was sound. Strong research puts primary evidence next to secondary analysis so each one checks the other.',
      ],
      vocabulary: [
        { term: 'research question', definition: 'a single focused question, answerable by evidence at the size of the assigned project, that the paper exists to answer.' },
        { term: 'primary source', definition: 'material created by a participant or witness, or the raw object of study itself — records, data, interviews, the work being analyzed.' },
        { term: 'secondary source', definition: 'material that describes, interprets, or summarizes primary sources after the fact.' },
        { term: 'scholarly source', definition: 'research written for specialists, reviewed by experts before publication, and documented with its own citations.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-narrowing',
      kind: 'worked_example',
      problem:
        'A student is assigned a four-page local-history paper and starts with the topic "the old flour mill in our town." Narrow it into a focused, researchable question and name the sources it calls for.',
      steps: [
        'Start with the topic and list what is actually unknown about it: when it was built, who worked there, why it closed, what the building is used for now, why the closure still comes up at town meetings.',
        'Cut what is a single fact. "When was the mill built?" is one date — too narrow for four pages. Cut what is a career. "How did milling shape the region?" is a book — too broad.',
        'Test what is left for researchability. "Was closing the mill a mistake?" fails; no record settles a value judgment. Rewrite it to ask for something evidence can show: what people said, what changed, what followed.',
        'Draft the question with an explanatory opener: "Why did the flour mill close in the 1970s, and how did the closure change employment in the town over the following decade?" That is one question, needs several sources, and has a visible finish line.',
        'Now match sources to the question. The reasons for closing live in PRIMARY material: mill records or meeting minutes in a county archive, and local news coverage from the period. The employment change needs census and labor DATA, also primary. Context and interpretation come from a SECONDARY source such as a regional economic history.',
        'Sanity-check the scope: three to five sources, two subquestions, four pages. The question fits the project.',
      ],
      answer:
        'Question: "Why did the flour mill close in the 1970s, and how did the closure change employment in the town over the following decade?" Sources: primary archive records, period news coverage, and census data, paired with a secondary regional history for context.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-bad-question-trap',
      kind: 'worked_example',
      problem:
        'A student proposes this research question for a paper on a proposed footbridge across the river: "Should the town build the new footbridge?" A second student proposes: "Did the town council vote on the footbridge?" Diagnose both and repair them.',
      steps: [
        'Test the first question for researchability. "Should" asks for a value judgment. Two people can study the same traffic counts, the same cost estimate, and the same survey and still disagree, because the disagreement is about priorities, not facts. No source can settle it, so it fails the researchable test.',
        'Notice what the first question is really reaching for: the reasons behind the disagreement. That is researchable. Repair it by asking for the evidence rather than the verdict: "What reasons do supporters and opponents of the footbridge give, and what does the town\'s own traffic and cost data show about each claim?"',
        'Test the second question for scope. "Did the council vote?" is answerable yes or no from one document. The project ends before it begins, so it fails the Goldilocks test on the narrow side.',
        'Repair the second the same way you repair every yes/no question: swap the opener. "Did" becomes "Why did" or "How did": "Why did the council delay the footbridge vote for two years, and what changed in the proposal between the first and final versions?"',
        'Match sources to the repaired questions. Council minutes, the cost estimate, and public-comment records are PRIMARY. A planning-office study of river crossings elsewhere is SECONDARY. Recent coverage in a general-audience outlet is POPULAR and is useful for public reaction, not for the cost figures themselves.',
        'The pattern in both repairs: keep the interest, drop the verdict, and add an opener that forces explanation.',
      ],
      answer:
        'The first fails the researchable test (a value judgment no evidence can settle) and repairs to "What reasons do supporters and opponents give, and what do the town\'s traffic and cost data show?" The second fails on scope (answerable yes or no) and repairs by swapping "Did" for "Why did" plus a second clause.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-scope',
      kind: 'try_yourself',
      problem:
        'A student has been assigned a five-page paper on the closing of a neighborhood public pool. Which of these is the best-scoped, researchable question for that assignment?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'How have public pools shaped American community life?' },
        { id: 'b', text: 'What reasons did the parks department give for closing the neighborhood pool, and how did residents respond over the two years that followed?', correct: true },
        { id: 'c', text: 'Did the neighborhood pool close in 2019?' },
        { id: 'd', text: 'Should the city have kept the neighborhood pool open?' },
      ],
      expectedAnswer:
        'What reasons did the parks department give for closing the neighborhood pool, and how did residents respond over the two years that followed?',
      hints: [
        'Run all three tests on each option: is it one question, is it the size of a five-page paper, and could evidence settle it?',
        'One option is a book-sized topic, one is answerable in a single word, and one asks for a verdict no record can supply.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-classify-source',
      kind: 'try_yourself',
      problem:
        'For a paper on why a local cannery shut down in 1988, a student finds the cannery owner\'s handwritten letter to employees announcing the closure, held in a county archive. What kind of source is that letter for this paper?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A primary source, because it was written by a participant at the time of the event.', correct: true },
        { id: 'b', text: 'A secondary source, because it is one person describing what happened.' },
        { id: 'c', text: 'A secondary source, because an archive collected and stored it.' },
        { id: 'd', text: 'A popular source, because it was written for a general audience rather than for researchers.' },
      ],
      expectedAnswer: 'A primary source, because it was written by a participant at the time of the event.',
      hints: [
        'Ask who created it and when. Was the writer present at the event, or looking back on it from a distance?',
        'Where a document is stored now does not change what it is. A letter written by the owner announcing the closure is firsthand material from the event itself.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-match-source-type',
      kind: 'try_yourself',
      problem:
        'A student\'s research question is: "What have researchers found about the effect of later school start times on student sleep?" Which source TYPE should the student rely on first?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Peer-reviewed studies that measured student sleep before and after a start-time change.', correct: true },
        { id: 'b', text: 'A general-audience article summarizing what parents in one district think about the change.' },
        { id: 'c', text: 'The minutes of a single school board meeting where the schedule was debated.' },
        { id: 'd', text: 'A post on a community message board describing one family\'s morning routine.' },
      ],
      expectedAnswer: 'Peer-reviewed studies that measured student sleep before and after a start-time change.',
      hints: [
        'Read the question first. It asks what RESEARCHERS have found, so ask which source type reports research findings.',
        'Opinion, meeting records, and personal accounts are evidence about reactions and decisions, not about measured effects.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-topic-and-primary',
      kind: 'misconception_check',
      question:
        'A student turns in this research plan: "My research question is the history of the county fairgrounds. I will only use primary sources, because primary sources are the most reliable." What are the two problems?',
      commonErrors: [
        {
          answer: '"The history of the county fairgrounds" is a research question',
          misconception: 'Treating a topic as a question — an area of interest with no question mark, no verb asking anything, and no finish line.',
          correctsTo:
            'That is a topic, not a question. A research question names what you want to find out and can be answered: "Why did the county move the fairgrounds to its current site in the 1950s, and how did attendance change afterward?" A topic tells you where to wander; a question tells you when you are done.',
        },
        {
          answer: 'Primary sources are always more reliable, so secondary sources are not needed',
          misconception: 'Confusing closeness to an event with objectivity, and treating source type as a quality ranking.',
          correctsTo:
            'Primary means closer to the event, not more truthful. Meeting minutes record what officials chose to write down, and a participant\'s letter records that participant\'s view. Secondary sources supply context, comparison, and expert analysis that let you judge the primary material. Strong research uses both so each checks the other.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A topic is a subject area; a research question is one answerable sentence that tells you when the project is finished.',
        'Goldilocks scope: not a single fact, not a book — a question that needs several sources and fits the assigned length.',
        'Researchable means evidence could settle it. Swap "Should" for "What reasons", and swap yes/no openers (Did, Is, Was) for Why, How, or To what extent.',
        'Primary sources come from participants or are the raw material itself; secondary sources analyze them afterward. Primary means closer, not better.',
        'Scholarly sources are reviewed by experts and cite their evidence; popular sources are current and readable. Pick the type your question actually calls for.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.1', cedTitle: 'Research Questions & Source Types' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
