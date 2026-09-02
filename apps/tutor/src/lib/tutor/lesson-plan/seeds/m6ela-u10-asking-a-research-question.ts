/**
 * Grade 6 ELA — Research & Citation: Asking a Research Question.
 *
 * PROCEDURE-LED exemplar shape, writing-unit item pattern. There is no essay
 * item in this course, so the whole lesson trains one judgment: is THIS
 * question worth researching, before any source is opened? A question passes
 * only if it clears three tests at once — narrow enough to answer inside a
 * short project, broad enough that it takes more than one fact or source to
 * answer, and answerable by evidence rather than by personal preference
 * (CCSS W.6.7). Every try_yourself is a revision-choice recognition item:
 * four candidate questions on one topic, three each carrying a single named
 * flaw (too broad, a single-fact lookup, or an opinion no source can settle),
 * and the composing move — building or repairing a question — lives in the
 * two worked examples instead, because this course's MCQ format cannot ask a
 * student to write a question of their own.
 *
 * SCOPE GUARD: Grade 6 row 10.1 teaches how to judge whether a research
 * question is worth researching before any source is opened: narrow enough
 * to answer inside a short project, broad enough that it takes more than one
 * fact or source to answer, and answerable by evidence rather than by
 * personal preference, plus the habit of narrowing or refocusing a question
 * once research has started (CCSS W.6.7). DELIBERATELY EXCLUDED: gathering
 * sources and judging which of them are credible (row 10.2, W.6.8); quoting
 * or paraphrasing a source's words or ideas without presenting them as the
 * student's own (row 10.3, W.6.8); and recording a source's title, author
 * and where it was found (row 10.4, W.6.8) — none of that gathering,
 * evaluating or record-keeping work appears anywhere in this file, because
 * this row ends the moment the question itself is judged sound, before a
 * single source has been opened. The curriculum's own progression note says
 * the shipped Grade 7 course carries "dedicated source-evaluation and
 * research-question topics at Grade 7 depth" under the same standard family;
 * this file does not attempt to name or enforce the exact shape of that
 * deeper treatment beyond its own three tests, and mines no Grade 7 file for
 * anything but register, per the standing salvage rule. A page count (two
 * pages, three pages) appears in each try_yourself only as ordinary scenario
 * color for a classroom assignment, the way both exemplars use everyday
 * detail in their items — no item asks the student to check a question
 * against that number, and every judgment in this file rests on the three
 * tests alone. DELIBERATELY ALLOWED, because it sits close: this row does
 * say a good question "needs more than one source" and speaks of "drawing
 * on several sources," since that is this row's own W.6.7 language and the
 * only way to tell a single-fact lookup apart from a real research question
 * — but it never teaches how to tell whether one of those sources is
 * trustworthy once you have it, which stays entirely with row 10.2.
 *
 * NOTE FOR FUTURE AUTHORS: every research question inside this file — in the
 * worked examples, in the try_yourself choices, and in the concept's own
 * examples — is original material written for this lesson. This course
 * carries no passage machinery — no passageId, no shared texts — so every
 * item is solvable from the words printed inside it alone. This lesson's
 * items are questions to be judged by their SHAPE, not informational
 * passages to be read for content, so nothing in this file is presented as a
 * settled fact for the student to learn. Where a real-world subject (phone
 * screens and sleep, dog breeds and exercise, video games and reaction time,
 * candy shelf life, roller coaster engineering, aluminum recycling) appears
 * inside a candidate question or a scaffolding sentence, the sentence names
 * only that the subject is a genuinely studied one — never a specific
 * finding, a direction, or a statistic — and every one of those premises is
 * verified true in the claim ledger below.
 *
 * CLAIM LEDGER (every real-world premise embedded anywhere in this file,
 * including inside try_yourself choices and worked-example steps, per the
 * rule that a claim in a distractor or a scaffolding sentence is checked the
 * same as a claim in a passage):
 *   Claim                                   | Where              | Kind       | Grounds
 *   Light from a phone screen before bed is | worked example 1,  | REAL-WORLD | Long-settled area of sleep
 *   an actively studied factor in falling   | steps 2 and 4      |            | science (screen light and
 *   asleep                                  |                    |            | circadian/melatonin effects
 *                                            |                    |            | on sleep onset); no finding
 *                                            |                    |            | or number is stated.
 *   Roller coaster designers shape a hill's | worked example 2,  | REAL-WORLD | Standard, long-settled
 *   drop to feel intense while meeting      | step 2             |            | amusement-ride engineering
 *   safety requirements                     |                    |            | practice; no specific ride
 *                                            |                    |            | or number is stated.
 *   Recycling aluminum and producing new    | worked example 2,  | REAL-WORLD | Long-settled materials- and
 *   aluminum from ore are two processes     | step 4             |            | environmental-science fact;
 *   that can be compared by the amount of   |                    |            | the question is left open
 *   energy each one uses                    |                    |            | rather than asserting which
 *                                            |                    |            | process uses less.
 *   Action video games are an actively      | try-1 problem and  | REAL-WORLD | Long-settled area of
 *   studied factor in how quickly a person  | choice d           |            | cognitive-science research
 *   reacts to something unexpected          |                    |            | on video games and visual
 *                                            |                    |            | reaction time; no finding
 *                                            |                    |            | or number is stated.
 *   Home video game consoles have a first,  | try-1 choice b     | REAL-WORLD | Settled historical fact; no
 *   historical release                      |                    |            | specific year is stated.
 *   Dog breeds differ in how much daily     | try-2 problem and  | REAL-WORLD | Long-settled veterinary and
 *   exercise keeps them healthy             | choice a           |            | animal-care knowledge; no
 *                                            |                    |            | specific number is stated.
 *   Adult dogs have a specific, countable   | try-2 choice c     | REAL-WORLD | Settled veterinary anatomy
 *   number of teeth                         |                    |            | fact; no number is stated.
 *   Different types of candy have different | try-3 problem and  | REAL-WORLD | Long-settled food-science
 *   shelf lives before they go stale        | choice b           |            | fact (moisture and
 *                                            |                    |            | ingredient differences
 *                                            |                    |            | affect spoilage); no
 *                                            |                    |            | timeframe or brand claim.
 *   A country's candy market has a single   | try-3 choice c     | REAL-WORLD | Ordinary sales-ranking
 *   best-selling bar at a given time        |                    |            | fact; no bar or figure is
 *                                            |                    |            | named.
 *
 * NOTE ON prerequisites/followUps: this row's chain is 9.4 -> 10.1 -> 10.2.
 * Both neighbors are authored elsewhere in this same fan-out batch and are
 * registered together with this file in one controller commit, so both
 * arrays below use their real loIds rather than empty placeholders.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6ELA_U10_ASKING_A_RESEARCH_QUESTION: LessonPlan = {
  id: 'evelyn.ms.m6ela.asking-a-research-question.v1',
  title: 'Asking a Research Question',
  curriculum: 'MS',
  grade: '6',
  subject: 'ela',
  topic: 'grade-6-ela',
  locale: 'en',
  los: [
    {
      id: 'm6ela.asking-a-research-question',
      standard: 'M6ELA-10.1',
      description:
        'Conduct a short research project to answer a question that is narrow enough to answer inside the project, broad enough to need more than one source, and answerable by evidence rather than personal preference, drawing on several sources and narrowing or refocusing the question as needed (CCSS W.6.7).',
    },
  ],
  prerequisites: ['m6ela.orienting-the-reader-in-a-narrative'],
  followUps: ['m6ela.evaluating-source-credibility'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that the question itself decides whether a research project works, before any source is opened.',
      script:
        'You want to settle an argument with your older sibling about whether the school bus really takes the same amount of time on rainy days as it does on sunny days. You could ask a hundred different questions about buses and never find out, or you could ask that exact one and go look for it. That is the whole difference between wandering around a subject and asking a real research question. This week your class starts a short research project, and the biggest mistake most sixth graders make happens before they open a single source: they never build a question worth researching in the first place. A bare topic like "buses" can eat every afternoon before the project is due. A one-fact question gets answered in ten seconds and leaves you with a blank page. And a question about which one is better only starts an argument nobody can settle. Today you learn the three-part test that tells you, before you search anything, whether your question is actually worth researching.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-testing-a-research-question',
      kind: 'concept',
      goal: 'Install the topic-versus-question distinction and the three-part test: narrow enough, broad enough, and answerable by evidence.',
      keyIdeas: [
        'A TOPIC IS A WORD OR PHRASE. A RESEARCH QUESTION IS A WHOLE SENTENCE WITH A QUESTION MARK. A topic such as bicycles, the ocean, or video games names a subject you could read about forever, and it never tells you when you are done. A research question names exactly what you want to find out, in one sentence that ends with a question mark. If your paper only has a topic written on it, you have not started yet.',
        'TEST ONE, NARROW ENOUGH TO ANSWER IN THE SPACE YOU HAVE. A question the size of a whole book will not fit inside a short project. "How do video games affect people?" covers every game ever made and everyone who has ever played one, so a short project can only say one thin sentence about each part of that. Add a limit, then add another, until the question fits the report you are actually writing: which kind, which effect, which group.',
        'TEST TWO, BROAD ENOUGH TO NEED MORE THAN ONE SOURCE. A question with only one fact behind it is not a research project, it is a lookup. "What year did the first video game console come out?" has one true answer sitting in one place, and finding it ends the project before it starts. A real research question needs you to gather pieces from several sources and put them together, which is the drawing-on-several-sources part of the standard itself.',
        'TEST THREE, ANSWERABLE BY EVIDENCE, NOT BY PREFERENCE. Some questions have a question mark and still cannot be settled by any source, because they ask what someone likes best or what should happen. "What is the most fun video game ever made?" gets a different answer from every person you ask, and no article or study can prove one of those answers right. A research question asks what is true or what causes what, not what somebody prefers.',
        'NARROW OR REFOCUS THE QUESTION AS YOU GO. Sometimes a question that looked fine turns out to be wrong once you start searching. If your first source already answers the whole question, it was too narrow, a single fact after all, and you widen it back out. If many sources come back and none of them focuses on your exact question, it was too broad, and you add another limit. Checking your question against your first couple of sources, and adjusting it, is part of doing the research, not a sign that you did something wrong at the start.',
      ],
      vocabulary: [
        { term: 'topic', definition: 'a subject you could read about forever, such as bicycles or the ocean. It has no question mark and no finish line.' },
        { term: 'research question', definition: 'one sentence, ending in a question mark, that names exactly what a research project is trying to find out.' },
        { term: 'source', definition: 'anything that gives you information for your research, such as an article, a book, a website, or an interview.' },
        { term: 'narrow', definition: 'to make a question smaller and more specific by adding a limit, such as which kind, which place, or which group.' },
        { term: 'refocus', definition: 'to adjust a research question after starting to search, either by narrowing it further or by loosening a limit that made it too small.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-building-a-question-from-a-topic',
      kind: 'worked_example',
      problem:
        'Your class project needs a research question, and all you have written on your paper is the word "Phones." Build a research question that passes all three tests: narrow enough, broad enough for real sources, and answerable by evidence.',
      steps: [
        'Name what you have. "Phones" is a topic, not a question. There is no question mark, and reading about phones could take the rest of your life without ever finishing.',
        'Ask what you are actually curious about. You have noticed you have trouble falling asleep on nights when you scroll right before bed. That curiosity is the seed of a real question.',
        'Check test one, narrow enough. "How do phones affect people?" covers every phone, every person, and every possible effect, so it would take a book, not a short project. Add limits: which effect (falling asleep), which device (a phone screen), which timing (right before bed).',
        'Check test two, broad enough for real sources. "What year was the first smartphone sold?" would answer itself in one search and end the project in ten seconds. Your narrowed question is different: it asks about a cause and an effect, which sleep scientists, doctors, and technology researchers have each studied and written about separately, so it takes several sources to answer well.',
        'Check test three, answerable by evidence. "Should kids be allowed to use phones before bed?" asks for a rule, and reasonable people would disagree about it no matter how much they read, so no source could settle it. Your narrowed question is not about what should happen — it is about what does happen, which evidence can actually show.',
        'Put the limits together into one sentence with a question mark: "How does using a phone screen right before bed affect how quickly a person falls asleep?" Run all three tests on the finished sentence: it is narrow (one device, one timing, one effect), it needs several sources instead of one fact, and it asks about a real effect that evidence can show rather than a preference.',
      ],
      answer:
        'How does using a phone screen right before bed affect how quickly a person falls asleep? Built from the bare topic "Phones" by narrowing to one device, one timing, and one measurable effect, and checked against all three tests.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-diagnosing-and-repairing-two-questions',
      kind: 'worked_example',
      problem:
        'Two classmates are stuck on their research questions. Malia is writing about roller coasters and starts with: "How many roller coasters are there in the United States?" Owen is writing about the neighborhood recycling program and starts with: "Is recycling a good thing?" Diagnose what is wrong with each question and repair it.',
      steps: [
        'Test Malia\'s question against the three rules. It has a question mark, so it looks fine at first. But it has exactly one true number sitting in one place, findable in a single search, so it fails test two: broad enough for several sources.',
        'Repair Malia\'s question by keeping her interest in roller coasters but asking about a cause instead of a count. WRONG: "How many roller coasters are there in the United States?" CORRECT: "How do engineers design a roller coaster\'s first big hill to feel scary while keeping it safe?" That version needs engineering sources, safety sources, and design sources, not one number.',
        'Test Owen\'s question next. "Is recycling a good thing?" also has a question mark, but it asks for a judgment. Two people could read the exact same facts about recycling and still disagree about whether it is "good," so no source can settle it. It fails test three: answerable by evidence, not preference.',
        'Repair Owen\'s question by keeping his interest in recycling but asking what evidence can actually show. WRONG: "Is recycling a good thing?" CORRECT: "How does recycling aluminum cans compare to making new aluminum from ore in the amount of energy each process uses?" Evidence can measure energy used. It cannot measure whether something is "good."',
        'Notice that both repairs kept the topic the student cared about and only changed the shape of the question. That is refocusing: if your first search answers the whole thing in one hit, like Malia\'s original question would have, widen it by asking about a cause or a process instead of a count. If your question turns out to be an opinion in disguise, like Owen\'s did, swap the judgment word for something evidence can measure.',
        'Neither repaired question is answered yet, and that is the point. Both of them now need several real sources before they can be answered, which is exactly what a research question is supposed to set up.',
      ],
      answer:
        'Malia\'s repair: "How do engineers design a roller coaster\'s first big hill to feel scary while keeping it safe?" (fails test two as written, a single-fact count). Owen\'s repair: "How does recycling aluminum cans compare to making new aluminum from ore in the amount of energy each process uses?" (fails test three as written, a judgment no source can settle).',
      estimatedMinutes: 3,
    },
    {
      id: 'try-video-games',
      kind: 'try_yourself',
      problem:
        'Mateo has to write two pages for a class project about video games. Which of these four questions would actually work as his research question — narrow enough to answer, needing more than a single fact, and settled by evidence rather than opinion?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'How do video games affect the moods, friendships, and schoolwork of the people who play them?' },
        { id: 'b', text: 'What year did the very first home video game console come out?' },
        { id: 'c', text: 'What is the most fun video game that has ever been made, by any company, in any country?' },
        { id: 'd', text: 'How does playing action video games affect how quickly a player reacts to something unexpected?', correct: true },
      ],
      expectedAnswer: 'How does playing action video games affect how quickly a player reacts to something unexpected?',
      hints: [
        'Run the three-part test on each option: is it narrow enough to finish, does it need more than one source to answer, and can evidence settle it rather than opinion?',
        'One option covers every video game ever made and every kind of person, one is answered by a single date, and one asks which game is the most fun, which nobody can prove.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-dogs',
      kind: 'try_yourself',
      problem:
        'Priya has to write two pages for a class project about dogs. Which of these four questions would actually work as her research question — narrow enough to answer, needing more than a single fact, and settled by evidence rather than opinion?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Why do some dog breeds need much more daily exercise than others to stay calm and healthy indoors?', correct: true },
        { id: 'b', text: 'How do dogs behave, communicate, and interact with the people and animals around them every day?' },
        { id: 'c', text: 'How many teeth does a fully grown adult dog have inside its mouth?' },
        { id: 'd', text: 'What is the best dog breed for a busy family with young kids and a small backyard to bring home?' },
      ],
      expectedAnswer: 'Why do some dog breeds need much more daily exercise than others to stay calm and healthy indoors?',
      hints: [
        'Test each choice: is it narrow enough for a real report, would answering it take more than one fact, and does evidence decide it instead of taste?',
        'One option covers everything a dog ever does, one is answered by counting something in a dog\'s mouth, and one just asks for a favorite breed.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-candy',
      kind: 'try_yourself',
      problem:
        'Diego has to write three pages for a class project about candy. Which of these four questions would actually work as his research question — narrow enough to answer, needing more than a single fact, and settled by evidence rather than opinion?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'How does candy get made, packaged, and sold to stores and vending machines all over the world?' },
        { id: 'b', text: 'Why do some candies stay fresh on a store shelf for months while others go stale within days?', correct: true },
        { id: 'c', text: 'What flavor is the best-selling candy bar in the United States this year?' },
        { id: 'd', text: 'What is the best candy in the world to bring to a class birthday party?' },
      ],
      expectedAnswer: 'Why do some candies stay fresh on a store shelf for months while others go stale within days?',
      hints: [
        'Check each choice against the three tests: narrow enough, more than one fact needed, and settled by evidence rather than preference.',
        'One option covers how candy is made everywhere on Earth, one is answered by naming a single candy bar, and one just asks which candy tastes best.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-bigger-and-a-question-mark',
      kind: 'misconception_check',
      question:
        'A student\'s plan reads: "My research question is Is recycling good for the environment? I picked a big topic on purpose, since a bigger topic means there is more to write about, and it already has a question mark so it counts." Name what has gone wrong and fix it.',
      commonErrors: [
        {
          answer: 'A bigger topic is better because there is more to write about.',
          misconception:
            'Confusing the amount of material available with how useful it is. A huge question feels safe because so much has been written about it, so the size seems like an advantage rather than a problem.',
          correctsTo:
            'A huge question buries a short project instead of helping it. "Is recycling good for the environment?" covers every material, every country, and every reason anyone has ever given, so a short paper can only say one thin sentence about each part of that. Add limits instead — which material, which process, which comparison — until the question fits the pages available. "How does recycling aluminum cans compare to making new aluminum from ore in the amount of energy each process uses?" keeps the same interest, narrowed to something a short project can actually finish.',
        },
        {
          answer: 'It has a question mark, so it counts as a research question.',
          misconception:
            'Treating the question mark itself as proof that a question is researchable, and stopping there without checking the other two tests.',
          correctsTo:
            'A question mark only proves the sentence is a question. It does not prove the question is narrow enough, or that it needs more than one source, or that evidence rather than opinion can settle it. "Is recycling good for the environment?" has a question mark and still fails, because "good" is a judgment that two people could read the same facts and still disagree about. Swap the judgment word for something evidence can measure, such as the amount of energy each process uses, and the question becomes one real sources can actually answer.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A topic is a word or phrase with no finish line. A research question is one full sentence, ending in a question mark, that tells you when the project is done.',
        'Test one, narrow enough to answer: a question the size of a whole book will not fit in a short project. Add limits — which kind, which effect, which group — until it fits the pages you have.',
        'Test two, broad enough to need more than one source: a question with exactly one fact behind it, like a single date or a single count, is a lookup, not a research project.',
        'Test three, answerable by evidence, not preference: a question asking what someone likes best or what should happen cannot be settled by any source, no matter how many you read.',
        'Narrow or refocus as you go: if your first source already answers the whole question, widen it; if no source focuses on your exact question, add another limit.',
        'A question mark alone does not make a question researchable. Check all three tests before you start searching.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.1', cedTitle: 'Asking a Research Question' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
