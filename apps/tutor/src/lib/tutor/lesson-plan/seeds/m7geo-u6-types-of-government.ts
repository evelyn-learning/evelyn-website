/**
 * Grade 7 World Geography — Political Geography: Types of Government.
 *
 * Concept-led row (National Geography Standard 13). Teaches TWO
 * classification questions and nothing else: (1) WHO HOLDS POWER --
 * democracy (direct / representative), monarchy (absolute / constitutional),
 * dictatorship or authoritarian rule, theocracy; and (2) HOW POWER IS SPREAD
 * ACROSS SPACE -- unitary versus federal, which is the genuinely geographic
 * half of the row.
 *
 * NOTE FOR FUTURE AUTHORS, and this one matters most: this file teaches the
 * CATEGORIES, never current politics. NO present-day country is named,
 * labeled or evaluated anywhere in this file -- most especially, no real
 * country is called a dictatorship or authoritarian. Every example is an
 * invented country. The file takes no side in any live political dispute and
 * makes no claim about what the people of any place are like. If you extend
 * this row, keep every example invented.
 *
 * There are also NO MAPS AND NO IMAGES in this course. Every item is solvable
 * from the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7GEO_U6_TYPES_OF_GOVERNMENT: LessonPlan = {
  id: 'evelyn.ms.m7geo.types-of-government.v1',
  title: 'Types of Government',
  curriculum: 'MS',
  grade: '7',
  subject: 'social-studies',
  topic: 'grade-7-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm7geo.types-of-government',
      standard: 'M7GEO-6.1',
      description:
        'Classify governments by asking who holds power -- democracy, monarchy, dictatorship or authoritarian rule, and theocracy -- and separately describe how power is distributed across a country as unitary or federal (National Geography Standard 13: how the forces of cooperation and conflict among people influence the division and control of the surface of Earth).',
    },
  ],
  prerequisites: ['m7geo.trade-and-interdependence'],
  followUps: ['m7geo.citizenship-and-rights'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Anchor the organizing question -- who decides? -- in something a twelve-year-old has already lived through.',
      script:
        'Think about the last group decision you were part of. Maybe a class picked a field trip by counting hands. Maybe a team captain picked the lineup alone. Maybe your family talked it over and then one person decided anyway. Same group, same decision, completely different answer to one question: who actually decides? Countries face that question too, on a much bigger scale, and the answers they have landed on are what we call types of government. Today you learn to sort them. And here is the part people find surprising -- there is a second question underneath, and it is a geography question: not just WHO decides, but WHERE in the country the deciding happens.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-who-holds-power',
      kind: 'concept',
      goal: 'Install the who-holds-power categories, the two subtype splits that students miss, and the separate unitary/federal axis.',
      keyIdeas: [
        'ONE QUESTION SORTS ALL OF THEM: WHO HOLDS POWER? Every label in this lesson is an answer to that single question. The people? One ruler who inherited the job? One leader or small group who was not freely elected? Religious leaders? Ask the question first, then reach for the label. Reaching for the label first is how students get this wrong.',
        'DEMOCRACY MEANS POWER RESTS WITH THE PEOPLE, EXERCISED THROUGH VOTING. It comes in two shapes. In a DIRECT democracy the people vote on the decisions themselves. In a REPRESENTATIVE democracy the people elect officials, and those officials make the decisions. Most modern democracies are representative, because asking millions of people to vote on every road repair would not work. Both are democracies -- the difference is what you are voting ON, not whether you vote.',
        'MONARCHY MEANS THE RULER INHERITS THE POSITION -- and this is the split people miss. In an ABSOLUTE monarchy the monarch actually governs and holds real power over the laws. In a CONSTITUTIONAL monarchy the monarch is largely ceremonial -- they open ceremonies, sign documents and represent the country -- while elected officials write and pass the laws. Constitutional monarchies exist in the world today. So a country with a king or a queen may be a full democracy, and often is.',
        'DICTATORSHIP, ALSO CALLED AUTHORITARIAN RULE, MEANS POWER IS HELD BY ONE LEADER OR A SMALL GROUP WHO WERE NOT CHOSEN IN A FREE ELECTION. The test is not whether an election happened -- it is whether the election was a real, free choice. THEOCRACY means religious leaders hold the governing authority, so the rules of a religion and the laws of the country are run by the same people. These are definitions of categories. In this lesson we do not sort present-day countries into them.',
        'A SECOND, SEPARATE QUESTION: WHERE IN THE COUNTRY IS THE POWER? This is the geography half. In a UNITARY system almost all power sits with the central government, and any regions mostly carry out what the center decides. In a FEDERAL system power is genuinely shared between a central government and states, provinces or regions, and each level has subjects it controls on its own. Federal systems are common in large countries, where one distant capital would struggle to run everything. Both kinds exist in the world today.',
        'THE TWO QUESTIONS ARE INDEPENDENT, AND REAL GOVERNMENTS ARE MESSY. A country can be a federal representative democracy, or a unitary constitutional monarchy, or many other combinations, because who-holds-power and where-the-power-sits are different questions. Also be careful with the word REPUBLIC: it describes how the head of state gets the job -- the position is not inherited -- so republic and democracy are not opposites and a country can be both. And one thing these labels never tell you: what the people of a country are like. A type of government describes a system, not a population. Never make that jump.',
      ],
      vocabulary: [
        { term: 'government', definition: 'the system a country uses to make and enforce its rules.' },
        { term: 'democracy', definition: 'a government in which power rests with the people, exercised through voting.' },
        { term: 'monarchy', definition: 'a government headed by a ruler who inherits the position.' },
        { term: 'constitutional monarchy', definition: 'a monarchy in which the monarch is largely ceremonial and elected officials govern.' },
        { term: 'theocracy', definition: 'a government in which religious leaders hold the governing authority.' },
        { term: 'unitary system', definition: 'a system in which almost all power is held by the central government.' },
        { term: 'federal system', definition: 'a system in which power is shared between a central government and states, provinces or regions.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-who-decides',
      kind: 'worked_example',
      problem:
        'Four invented countries are described below. Use the who-holds-power question to label each one.\n\n1. Vantoria: every adult votes every four years for members of a national assembly, and the assembly writes and passes the laws.\n2. Kelbria: the head of state is a king who inherited the throne from his father. He personally decides what the laws are, and there is no elected assembly.\n3. Solandra: a council of senior religious leaders holds the governing authority, and the laws of the country are the rules of that religion.\n4. Brindal: one leader took control after the previous government collapsed, no free election has been held since, and all major decisions are made by that leader and a small circle of officials.',
      steps: [
        'Do not reach for a label yet. Ask the one question about each country: who holds the power?',
        'Vantoria: the people hold it, and they use it by voting -- but they are voting for OFFICIALS, not on the laws themselves. Power resting with the people means democracy. Voting for officials rather than on laws makes it a REPRESENTATIVE DEMOCRACY.',
        'Kelbria: the ruler inherited the position, which makes it a monarchy. Now check the split. He personally decides the laws and no elected body exists, so he actually governs. That is an ABSOLUTE MONARCHY.',
        'Solandra: religious leaders hold the governing authority. That is a THEOCRACY. Note what we are doing and not doing here -- we are describing who governs, never judging any set of beliefs.',
        'Brindal: power sits with one leader and a small group, and no free election put them there. That is a DICTATORSHIP, also called authoritarian rule. The clue is not that a strong leader exists; it is the absence of a free election.',
        'Last check on Kelbria, because this is the trap. If the description had said the king opened ceremonies and signed laws while an elected assembly wrote them, the answer would flip to CONSTITUTIONAL MONARCHY -- same inherited throne, completely different answer to who holds power.',
      ],
      answer:
        'Vantoria is a representative democracy. Kelbria is an absolute monarchy. Solandra is a theocracy. Brindal is a dictatorship, also called authoritarian rule. Every label came from the same question: who holds power?',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-two-axes',
      kind: 'worked_example',
      problem:
        'A student writes: "Orenvale has a queen, so it cannot be a democracy, and it must be unitary because a monarch rules from the capital." Use this description to show what is wrong.\n\n"Orenvale is headed by a queen who inherited the position. She opens the national assembly and signs finished laws, but she does not decide what the laws say. Orenvale voters elect the assembly members who write and pass them. Orenvale is divided into six provinces, each with its own elected council that controls its own schools and roads, while the national assembly handles defense and the currency."',
      steps: [
        'Separate the two questions before answering either. Question one: who holds power? Question two: where in the country does the power sit? The student has mashed them together.',
        'Question one, first half: the queen inherited the position, so Orenvale is a monarchy. That much of the student claim is fine.',
        'Question one, second half: does she govern? The description says she opens the assembly and signs finished laws but does not decide what they say. Elected assembly members do that. So she is ceremonial -- this is a CONSTITUTIONAL MONARCHY.',
        'So can it be a democracy? Yes. Power rests with the voters, who elect the officials who make the decisions. Orenvale is a representative democracy AND a constitutional monarchy at the same time. WRONG: "A country with a queen cannot be a democracy." CORRECT: "In a constitutional monarchy the monarch is ceremonial, so the country can be fully democratic."',
        'Question two, on its own now. Six provinces each control their own schools and roads; the center handles defense and currency. Each level has subjects it genuinely controls. That is a FEDERAL system, not a unitary one -- and notice the monarch had nothing to do with deciding it.',
        'That is the real lesson. WRONG: "The type of ruler tells you how power is spread out." CORRECT: "Who holds power and where the power sits are two separate questions, and you answer them one at a time."',
      ],
      answer:
        'Both halves of the student claim are wrong. Orenvale is a constitutional monarchy and a representative democracy, because the queen is ceremonial while elected officials govern. It is also federal, not unitary, because the provinces control subjects of their own. The two questions are independent.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-constitutional-monarchy',
      kind: 'try_yourself',
      problem:
        'In the invented country of Norvale, the head of state is a queen who inherited the position from her mother. She opens the national assembly and signs finished laws, but she does not decide what the laws say. Norvalers vote every four years for the assembly members who write and pass the laws. Which description fits Norvale best?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'An absolute monarchy, because the queen inherited the position' },
        { id: 'b', text: 'A theocracy, because the queen leads national ceremonies' },
        { id: 'c', text: 'A constitutional monarchy that is also a representative democracy', correct: true },
        { id: 'd', text: 'A direct democracy, because Norvalers vote' }
      ],
      expectedAnswer: 'A constitutional monarchy that is also a representative democracy',
      hints: [
        'Inheriting the throne makes it a monarchy. The follow-up question decides which kind: does the monarch actually govern, or is the role ceremonial?',
        'Then ask who makes the laws. If elected officials do, power rests with the voters -- and voting for officials rather than on laws is the representative kind of democracy.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-unitary-or-federal',
      kind: 'try_yourself',
      problem:
        'The invented country of Tarnick is divided into nine provinces. Each province has an elected council that decides its own school rules and road spending, and the national government in the capital cannot simply overrule those decisions. The national government handles defense and the national currency. How is power distributed in Tarnick?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Unitary, because there is a national government in the capital' },
        { id: 'b', text: 'Federal, because power is genuinely shared between the center and the provinces', correct: true },
        { id: 'c', text: 'Unitary, because the nine provinces are all inside one country' },
        { id: 'd', text: 'A direct democracy, because each province decides its own school rules' }
      ],
      expectedAnswer: 'Federal, because power is genuinely shared between the center and the provinces',
      hints: [
        'Every country has a central government, and every country has regions inside it. Neither fact settles this question on its own.',
        'Ask instead whether the regions control anything the center cannot simply take back. If they do, power is shared.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-direct-or-representative',
      kind: 'try_yourself',
      problem:
        'In the invented country of Lumeria, people do not vote on individual laws. Every three years they elect members of a national assembly, and those members debate and vote on the laws. Which term best describes Lumeria?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A direct democracy, because every adult in Lumeria may vote' },
        { id: 'b', text: 'Not a democracy, because ordinary people do not vote on the laws themselves' },
        { id: 'c', text: 'A unitary system, because there is one national assembly' },
        { id: 'd', text: 'A representative democracy, because voters elect officials who make the decisions', correct: true }
      ],
      expectedAnswer: 'A representative democracy, because voters elect officials who make the decisions',
      hints: [
        'Direct and representative are separated by one thing: what people are voting ON. Laws themselves, or the officials who handle the laws?',
        'Watch for a choice that answers the wrong question. Unitary and federal describe WHERE power sits, not who holds it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-king-means-not-democracy',
      kind: 'misconception_check',
      question:
        'A student says: "That country has a king, so the people there have no say -- it cannot be a democracy." What is wrong with that, and what does knowing the type of government actually tell you?',
      commonErrors: [
        {
          answer: 'It has a king, so it cannot be a democracy.',
          misconception:
            'Treating monarchy and democracy as opposites, and stopping at the word king without asking the follow-up question about what the monarch actually does.',
          correctsTo:
            'Monarchy answers how someone got the position -- by inheriting it. Democracy answers where the power rests. Those are different claims, so they can both be true at once. In a CONSTITUTIONAL monarchy the monarch is largely ceremonial and elected officials write and pass the laws, so the people do have the say. Only in an ABSOLUTE monarchy does the monarch actually govern. WRONG: "A king means no democracy." CORRECT: "Ask whether the monarch governs or is ceremonial, then decide." The same care applies to the word republic, which describes a head of state who did not inherit the job -- so republic and democracy are not opposites either, and a country can be both.',
        },
        {
          answer: 'You can tell what people in a country are like from its type of government.',
          misconception:
            'Sliding from a fact about a system to a claim about a population -- assuming the label on a government describes the personalities, values or character of the millions of people living under it.',
          correctsTo:
            'A type of government describes how decisions get made. It says nothing about what the people of that country are like, what they believe, or what they want. Populations everywhere contain enormous variety, and people do not usually choose the system they are born into. Say what the system is; stop there. WRONG: "That country is a monarchy, so the people must be old-fashioned." CORRECT: "That country is a monarchy, which tells us the head of state inherited the position -- and nothing more."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'One question sorts the types: who holds power? Ask it before reaching for a label.',
        'Democracy = power rests with the people. Direct means people vote on the decisions; representative means people elect officials who decide.',
        'Monarchy = the ruler inherits the position. Absolute means the monarch governs; constitutional means the monarch is ceremonial and elected officials govern.',
        'Dictatorship or authoritarian rule = power held by one leader or a small group not chosen in a free election. Theocracy = religious leaders hold governing authority.',
        'A second, separate question is geographic: unitary means almost all power sits at the center; federal means power is shared with states, provinces or regions.',
        'A type of government describes a system, never the people who live under it. Do not make that jump.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.1', cedTitle: 'Types of Government' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
