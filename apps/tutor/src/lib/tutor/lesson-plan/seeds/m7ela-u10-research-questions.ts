/**
 * Grade 7 ELA — Research: Asking a Research Question.
 *
 * Procedure-led (CCSS W.7.7). One four-part test runs the whole lesson: is it
 * a QUESTION, is it NARROW enough for the space you have, is it OPEN, and is
 * it ANSWERABLE from sources that exist. The narrowing move (start broad, add
 * a limit) is the engine.
 *
 * The four traps this file is built to kill are the bare topic, the yes/no
 * question, the too-broad question, and the opinion question that no source
 * can settle. Every try_yourself is a revision-choice item: four candidate
 * questions on ONE topic, three carrying a named trap.
 *
 * NOTE FOR FUTURE AUTHORS: every real-world claim here is true (monarch
 * overwintering forests in central Mexico, white-shark site fidelity, how
 * distance shapes the sound of thunder, the professional basketball shot
 * clock). No statistics are quoted anywhere, on purpose. If you swap an
 * example, check the fact before you ship it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7ELA_U10_RESEARCH_QUESTIONS: LessonPlan = {
  id: 'evelyn.ms.m7ela.research-questions.v1',
  title: 'Asking a Research Question',
  curriculum: 'MS',
  grade: '7',
  subject: 'ela',
  topic: 'grade-7-ela',
  locale: 'en',
  los: [
    {
      id: 'm7ela.research-questions',
      standard: 'M7ELA-10.1',
      description:
        'Turn a broad topic into a focused research question that is a real question, narrow enough to answer in the space available, open rather than yes-or-no, and answerable from sources that exist — and recognize a question that generates further questions to explore as the research goes on (CCSS W.7.7).',
    },
  ],
  prerequisites: ['m7ela.narrative-technique'],
  followUps: ['m7ela.evaluating-sources'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that the question, not the searching, is what makes research work.',
      script:
        'Type the word sharks into a search bar. You get more results than you could read in your whole life, and almost none of them are wrong. They are just answers to a question you never asked. Now type this instead: why do great white sharks return to the same feeding areas each year. Same internet, same three seconds of typing, completely different afternoon. Now the results are about one animal, one behavior, and one puzzle, and you can tell in about four seconds whether a page is worth reading. Nothing changed except the question. Today you learn how to build the second kind of question, and how to spot the four kinds that eat your whole evening and leave you with nothing to write.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-research-questions',
      kind: 'concept',
      goal: 'Install the four-part test for a research question and the narrowing move that produces one.',
      keyIdeas: [
        'A RESEARCH QUESTION IS A QUESTION, NOT A TOPIC. A topic is a subject area: sharks, tornadoes, the town library. It has no question mark and no finish line, so you can read about it forever and never be done. A research question is one sentence that names exactly what you want to find out: "Why do great white sharks return to the same feeding areas each year?" A topic tells you where to wander. A question tells you when you are finished.',
        'THE NARROWING MOVE — START BROAD, THEN ADD A LIMIT. Take the topic and add one limit at a time. Which kind? Great white sharks, not all sharks. Which aspect? Feeding, not the whole animal. Which place or which time? The same areas, every year. Which group? Seventh graders, not everybody. Stack three limits onto "sharks" and you get "Why do great white sharks return to the same feeding areas each year?" Every limit you add makes the question smaller and the searching easier.',
        'NARROW ENOUGH TO ANSWER IN THE SPACE YOU HAVE. Match the size of the question to the size of the assignment. "How do oceans work?" would take a whole book, so squeezing it into two pages means saying one shallow sentence about a hundred things. A good fit is a question that needs a few solid sources and gives you something real to say about each one.',
        'OPEN, NOT YES OR NO. If a single word finishes your question, it is not a research question. "Do sharks migrate?" is answered yes, and then the project is over before it starts. Swap the opener: Do, Did, Is, Was and Should become Why, How, What causes, or What happened when. That one swap turns a dead end into a project.',
        'ANSWERABLE MEANS REAL SOURCES CAN SETTLE IT. Two kinds of question fail this test. The first asks for an opinion: "What is the best animal?" has a question mark and no factual answer, so no source can settle it and people simply disagree. The second asks about something nobody has recorded. Before you commit, run one quick search and check that real sources about your exact question exist. If nothing comes back, narrow a different way.',
        'A GOOD QUESTION OPENS DOORS RATHER THAN CLOSING ONE. While you research, a strong question keeps handing you new questions. If great whites really do return to the same feeding areas, then how do they find those areas again, and what is waiting there for them? That is the question working the way it should. A question you already know the answer to closes the door instead: you write down what you already knew, which is a report, not research. If you can write the answer before you look anything up, pick a harder question.',
      ],
      vocabulary: [
        { term: 'topic', definition: 'a subject area you could read about forever, such as sharks or weather. It has no question mark and no finish line.' },
        { term: 'research question', definition: 'one focused question that a project exists to answer, and that tells you when the project is done.' },
        { term: 'narrowing', definition: 'adding limits to a broad topic — which kind, which place, which group, which time, which aspect — until the question is small enough to answer.' },
        { term: 'open question', definition: 'a question that needs an explanation rather than one word or one fact, usually starting with Why, How, or What causes.' },
        { term: 'source', definition: 'anything that gives you information for your research, such as an article, a book, a website, a video, or an interview.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-narrowing-a-topic',
      kind: 'worked_example',
      problem:
        'Your assignment is two pages about the ocean, and all you have written on your paper so far is the word "Sharks." Turn that into a research question.',
      steps: [
        'Name what you have. "Sharks" is a topic, not a question. There is no question mark, nothing is being asked, and no amount of reading would ever finish it. So the first move is to ask yourself what you actually want to find out.',
        'Write down what you are curious about, in any order: what sharks eat, how they find food, why some of them show up in the same places, how scientists follow them around the ocean.',
        'Add limit one — WHICH KIND. Not all sharks, which is hundreds of different animals. Pick one: great white sharks. The topic is already smaller.',
        'Add limit two — WHICH ASPECT. Not the whole animal, which is still a book. Pick the part you were curious about: where they go to feed.',
        'Add limit three — WHICH TIME. Not all of history, and not one single day. Pick a pattern you can check: what happens each year.',
        'Turn the three limits into one sentence with an open opener. "Why do great white sharks return to the same feeding areas each year?" Now run the four-part test. It is a question, it is narrow, "Why" means one word cannot finish it, and scientists who tag and track these sharks have written about exactly this. It passes all four.',
        'Last check: does it open doors? Yes. Reading about it will hand you the next questions — how do the sharks navigate back, and what are they eating when they arrive. A question that gives you more questions is a question that is working.',
      ],
      answer:
        'Why do great white sharks return to the same feeding areas each year? (Built from "Sharks" by adding three limits: which kind, which aspect, which time.)',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-repairing-two-bad-questions',
      kind: 'worked_example',
      problem:
        'Two students are writing about honeybees. Malik proposes: "Do honeybees make honey?" Priya proposes: "Should our town let people keep beehives in their yards?" Diagnose both questions and repair them.',
      steps: [
        'Test Malik on the OPEN rule. His question is answered with one word: yes. He also already knows that answer, so his project would be finished before he opened a single source. Two failures at once, and both come from the opener "Do."',
        'Repair Malik the way you repair every yes-or-no question: swap the opener for one that demands an explanation. "Do" becomes "How." His question becomes "How do honeybees turn nectar into honey inside the hive?"',
        'Check the repair against all four rules. It is a question, it covers one aspect of one insect, "How" cannot be answered in one word, and beekeeping guides and science sites explain the steps. It passes, and it opens doors: reading it will make you wonder why the bees fan their wings over the cells and why the finished honey gets sealed with wax.',
        'Now test Priya on the ANSWERABLE rule. "Should" asks for a verdict. Two people can read the same rules, the same guides and the same complaints and still disagree, because they disagree about what matters, not about the facts. No source can settle that, so the question fails.',
        'Repair Priya by keeping what she is interested in and dropping the verdict. Ask for the evidence underneath the argument instead: "What rules do nearby towns set for backyard beehives, and what reasons do they give for those rules?"',
        'Check that repair too. It is a question, it is limited to nearby towns and to one kind of rule, it needs real explanation, and town websites and local news stories carry exactly this information. Notice the pattern in both repairs: keep the interest, drop the verdict or the one-word answer, and add an opener that forces an explanation.',
      ],
      answer:
        'Malik fails the OPEN rule (one word finishes it, and he already knows the answer) and repairs to "How do honeybees turn nectar into honey inside the hive?" Priya fails the ANSWERABLE rule (a verdict no source can settle) and repairs to "What rules do nearby towns set for backyard beehives, and what reasons do they give for those rules?"',
      estimatedMinutes: 3,
    },
    {
      id: 'try-monarchs',
      kind: 'try_yourself',
      problem:
        'Ana has to write two pages about monarch butterflies. Which of these four is the best research question for that assignment?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Monarch butterflies and their long trip south.' },
        { id: 'b', text: 'Do monarch butterflies migrate?' },
        { id: 'c', text: 'How do monarch butterflies find the same forests in central Mexico every fall?', correct: true },
        { id: 'd', text: 'Why do animals move from one place to another?' },
      ],
      expectedAnswer: 'How do monarch butterflies find the same forests in central Mexico every fall?',
      hints: [
        'Run the four-part test on each option. Is it a question at all? Is it narrow enough for two pages? Can one word finish it? Could real sources settle it?',
        'One option has no question mark, one is answered yes, and one is about every animal on Earth rather than about monarchs.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-thunder',
      kind: 'try_yourself',
      problem:
        'Devon is writing three pages about thunderstorms. Which of these four is the best research question for that assignment?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'What is the scariest kind of weather?' },
        { id: 'b', text: 'Thunderstorms in our state.' },
        { id: 'c', text: 'Is thunder caused by lightning?' },
        { id: 'd', text: 'Why does thunder sometimes sound like one sharp crack and sometimes like a long rumble?', correct: true },
      ],
      expectedAnswer: 'Why does thunder sometimes sound like one sharp crack and sometimes like a long rumble?',
      hints: [
        'Two of these close the door instead of opening it. One is answered with the single word yes, and one has no factual answer at all, so no source could settle it.',
        'Check which options are actually questions. A phrase with a period at the end is a topic, and a topic never tells you when you are finished.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-basketball',
      kind: 'try_yourself',
      problem:
        'Rosa is writing two pages about basketball. Which of these four is the best research question for that assignment?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Basketball rules and how they work.' },
        { id: 'b', text: 'What is the best sport to play at recess?' },
        { id: 'c', text: 'How have the rules of sports changed over time?' },
        { id: 'd', text: 'How did adding a shot clock change the way professional basketball games were played?', correct: true },
      ],
      expectedAnswer: 'How did adding a shot clock change the way professional basketball games were played?',
      hints: [
        'Ask which option names one aspect of one sport. The winner should have limits on it: which sport, which rule, which change.',
        'One option is a bare topic, one asks for an opinion that no source can settle, and one covers every sport in every century.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-bigger-and-yes-no',
      kind: 'misconception_check',
      question:
        'A student turns in this plan: "My research question is Are volcanoes dangerous? I picked a big question on purpose, because a big question means there is more to write about. The yes-or-no part is fine, because after I say yes I am going to explain my answer." Name the two problems with this plan and fix them.',
      commonErrors: [
        {
          answer: 'A yes-or-no question is fine as long as I explain my answer afterward.',
          misconception:
            'Believing the explanation rescues the question. The student can feel that a real paragraph is coming, so the shape of the question seems harmless.',
          correctsTo:
            'The question itself still collapses to one word. Once you have written "yes," the question is answered and finished, and everything after that is you arguing for your own opinion instead of researching. The fix is the opener swap. "Are volcanoes dangerous?" becomes "Why are some volcanic eruptions far more dangerous to nearby towns than others?" That version cannot be finished with one word, so the explaining happens inside the research instead of after it.',
        },
        {
          answer: 'A bigger question is better, because there is more to write about.',
          misconception:
            'Confusing the amount of material with how useful it is. More results feel like more evidence, so a huge question feels safe.',
          correctsTo:
            'A huge question buries you. "Are volcanoes dangerous?" covers every volcano on Earth across all of history, so a short paper can only say one thin sentence about each thing and prove nothing. Narrow it with limits instead — which eruptions, which effect, which place — and you get room to explain something properly. Remember the other half of this rule too: a question mark does not make a question researchable. "What is the best volcano?" has a question mark and no factual answer, so no source can ever settle it.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A topic is a subject area with no finish line. A research question is one sentence that tells you when you are done.',
        'The narrowing move: start broad, then add limits — which kind, which place, which group, which time, which aspect.',
        'Narrow enough for the space you have. A book-sized question in a two-page paper gives you a hundred shallow sentences.',
        'Open, not yes or no. Swap Do, Did, Is, Was and Should for Why, How, What causes, or What happened when.',
        'Answerable means real sources could settle it. An opinion question such as "What is the best animal?" has a question mark and no factual answer.',
        'A good question opens doors: while you research it, it hands you more questions. If you already know the answer, you will write a report, not research.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.1', cedTitle: 'Asking a Research Question' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
