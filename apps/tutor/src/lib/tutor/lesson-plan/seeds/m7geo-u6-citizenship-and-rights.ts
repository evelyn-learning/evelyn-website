/**
 * Grade 7 World Geography — Government & Citizenship: Citizenship, Rights &
 * Responsibilities (National Geography Standard 13).
 *
 * Concept-led. Teaches ONE analytical frame: citizenship is legal membership
 * in a country; countries reach that membership through different
 * combinations of rules; rights and responsibilities are a paired idea whose
 * specific contents are set by each country's own laws.
 *
 * NOTE FOR FUTURE AUTHORS, and this one matters more here than almost
 * anywhere else in the course: this row sits directly next to live
 * immigration and nationality politics, and the audience is twelve. This file
 * therefore describes the GENERAL MECHANISMS ONLY. It names no real country's
 * citizenship law, discusses no immigration policy, mentions no refugee legal
 * status, and takes no position in any current dispute. Every scenario uses an
 * INVENTED country -- Marovia, Terenne, Calenda -- never a real one. It also
 * never treats citizenship as the same thing as ethnicity, language or
 * ancestry; separating those is one of the lesson's stated goals. Keep it that
 * way.
 *
 * There are also NO MAPS AND NO IMAGES in this course. Every item is solvable
 * from the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7GEO_U6_CITIZENSHIP_AND_RIGHTS: LessonPlan = {
  id: 'evelyn.ms.m7geo.citizenship-and-rights.v1',
  title: 'Citizenship, Rights & Responsibilities',
  curriculum: 'MS',
  grade: '7',
  subject: 'social-studies',
  topic: 'grade-7-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm7geo.citizenship-and-rights',
      standard: 'M7GEO-6.2',
      description:
        'Explain that citizenship is legal membership in a country, describe in general terms the routes by which people become citizens -- birth in a territory, descent from a citizen parent, and naturalization -- and distinguish the rights a citizen holds from the responsibilities that membership asks in return, recognizing that each country sets its own combination of rules (National Geography Standard 13: how the forces of cooperation and conflict among people influence the division and control of Earth surface).',
    },
  ],
  prerequisites: ['m7geo.types-of-government'],
  followUps: ['m7geo.borders-and-conflict'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Anchor citizenship in a small, familiar moment before any technical vocabulary arrives.',
      script:
        'Picture the line at an airport where a family is waiting to have their passports checked. That little booklet is doing something strange when you think about it. It is a country saying, in writing, this person belongs to us. Someone standing right behind them in the same line, wearing the same jacket, eating the same snack, might belong to a completely different country. Nothing you can see decides it. A set of laws does. Today we work out what that membership actually is, how people get it, and what it asks of them once they have it.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-citizenship',
      kind: 'concept',
      goal: 'Install citizenship as legal membership, the three general routes, the rights/responsibilities pair, the country-by-country variation, and the scales of participation.',
      keyIdeas: [
        'CITIZENSHIP IS LEGAL MEMBERSHIP IN A COUNTRY, AND IT IS NOT THE SAME THING AS ETHNICITY, LANGUAGE, ANCESTRY OR CULTURE. It is a status written into law, which is why a country issues its citizens documents such as a passport. Living in a place, visiting it, or loving it are all different things from being a citizen of it -- and so are speaking the local language and having family from the area. A country contains citizens of many backgrounds who speak many languages, and plenty of people speak a language fluently without being a citizen of any country where it is spoken. Citizenship is a legal status; the others are not. Treating them as one thing is the single error to guard against hardest in this lesson.',
        'THERE ARE THREE GENERAL ROUTES TO CITIZENSHIP, described here in the broadest terms. One: being born inside the territory a country controls. Two: descent, meaning being born to a parent who is already a citizen, wherever the birth happens. Three: naturalization, a legal process an adult goes through to become a citizen of a country they were not a citizen of before.',
        'DIFFERENT COUNTRIES USE DIFFERENT COMBINATIONS OF THOSE ROUTES, AND THAT VARIATION IS THE GEOGRAPHIC POINT. Some countries lean on territory, some lean on descent, most mix them, and each one sets its own naturalization requirements. So the answer to the question of who counts as a citizen can change as you cross a border, which is exactly the kind of thing geographers pay attention to. There is no single worldwide rule to memorize, and there is no reason to expect one.',
        'RIGHTS AND RESPONSIBILITIES ARE A PAIRED IDEA. A RIGHT is something a citizen is entitled to. A RESPONSIBILITY is something the membership asks in return -- obeying the laws, paying taxes, serving on a jury where a country uses juries, voting where a citizen is eligible to vote. Naming only the rights describes half of an arrangement, because the responsibilities are part of the deal rather than optional extras.',
        'THE SPECIFIC LIST OF RIGHTS AND RESPONSIBILITIES VARIES BY COUNTRY, because each country sets it in its own laws and constitution. Two neighboring countries can both call something a right and still define it differently, and one may ask a duty of its citizens that the other does not ask at all. So when you meet a claim about what citizens can or must do, the first question is always: in which country, and under which laws?',
        'PARTICIPATION HAPPENS AT SEVERAL SCALES -- LOCAL, REGIONAL AND NATIONAL. The national scale gets the attention, but the local scale is the one a twelve-year-old can actually watch happen: a town meeting where people argue about a crossing outside a school, a school board deciding a calendar, a neighborhood cleanup on a Saturday. Small scale does not mean small effect.',
      ],
      vocabulary: [
        { term: 'citizenship', definition: 'legal membership in a country, recognized by that country under its own laws.' },
        { term: 'naturalization', definition: 'the legal process by which a person becomes a citizen of a country they were not born a citizen of.' },
        { term: 'right', definition: 'something a citizen is entitled to under the laws of their country.' },
        { term: 'responsibility', definition: 'something a citizen is asked or required to do as part of belonging to their country.' },
        { term: 'constitution', definition: 'the basic set of rules that says how a country is governed and often what its citizens are entitled to.' },
        { term: 'civic participation', definition: 'taking part in the decisions of a community, which can happen at a local, regional or national scale.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-three-routes',
      kind: 'worked_example',
      problem:
        'Marovia and Terenne are invented countries used only as examples. Marovia treats a baby born inside Marovian territory as a Marovian citizen. Terenne treats a baby as a Terennian citizen when at least one parent is already a Terennian citizen, wherever the baby is born. Terenne also has a legal process an adult can complete to become a citizen.\n\nFor each person below, name the route to citizenship, then say what the pair of countries shows.\n1. A baby born in a hospital inside Marovia, to parents who are citizens of somewhere else.\n2. A baby born outside Terenne to a mother who is a Terennian citizen.\n3. An adult who was born elsewhere, moved to Terenne, met the requirements Terenne sets, and completed the legal process.',
      steps: [
        'Start with the three general routes, because every case will be one of them: birth in the territory, descent from a citizen parent, or naturalization.',
        'Case 1. Ask what fact the rule uses. Marovia is looking at WHERE the birth happened, and the birth happened inside Marovian territory. The parents are citizens of somewhere else, which under this rule does not change the answer. Route: birth in the territory.',
        'Case 2. Terenne is looking at WHO the parent is, not where the birth happened. The mother is already a Terennian citizen, so the child is a citizen by descent. Notice that the birth happening outside Terenne is not a problem for this rule.',
        'Case 3. This adult was not a citizen before and became one by completing a legal process. That is naturalization. It is the one route that is a process a person goes through rather than a fact about their birth.',
        'Now the real question: what does the pair of countries show? Marovia and Terenne start from different facts -- territory versus descent -- so the same baby could be a citizen under one rule and not the other. Neither rule is a mistake and neither is the worldwide standard. Countries set their own combinations.',
        'That is the geographic point of this lesson. The answer to who counts as a citizen can change when you cross a border, which means citizenship is something that varies across space, like climate or landforms do.',
      ],
      answer:
        'Case 1 is citizenship by birth in the territory. Case 2 is citizenship by descent from a citizen parent. Case 3 is naturalization. Together they show that different countries build their citizenship rules out of different combinations, so who counts as a citizen varies from country to country rather than following one worldwide rule.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-rights-and-responsibilities',
      kind: 'worked_example',
      problem:
        'Calenda is an invented country used only as an example. A student is handed this list from a Calendan civics booklet and asked to sort it into RIGHTS and RESPONSIBILITIES, then explain why the sorted list cannot simply be copied for a different country.\n\n- Speaking and writing freely about what the government does\n- Obeying the laws of Calenda\n- Being treated equally under the law\n- Paying the taxes Calendan law requires\n- Serving on a jury when Calendan courts call a citizen\n- Voting in Calendan elections once a citizen is old enough',
      steps: [
        'Use one test question on each line: is this something the citizen IS ENTITLED TO, or something the membership ASKS OF the citizen?',
        'Speaking and writing freely about the government is something the citizen is entitled to. That is a RIGHT. Being treated equally under the law is the same kind of thing, so it is a RIGHT too.',
        'Obeying the laws, paying the required taxes, and serving on a jury when called are all things asked of the citizen. Those are RESPONSIBILITIES.',
        'Voting is the interesting one, and it is worth slowing down for. In Calenda an eligible citizen is entitled to vote, so it is a right, and Calendans also describe turning out to vote as part of what membership asks. Some entries genuinely sit in both columns, and saying so is better than forcing a single label.',
        'Now the second half of the question. Every line on that list says Calenda or Calendan in it, and that is not decoration. Calenda set this list in its own laws and constitution. A different country writes its own list, and it may define a shared word differently or ask a duty Calenda never asks.',
        'WRONG way to say it: "These are the rights and responsibilities that citizens have." CORRECT way: "These are the rights and responsibilities Calendan law gives Calendan citizens." The country has to stay in the sentence.',
      ],
      answer:
        'Rights: speaking and writing freely about the government, and being treated equally under the law. Responsibilities: obeying the laws, paying required taxes, and serving on a jury when called. Voting sits in both columns -- an eligible citizen is entitled to vote, and turning out is also treated as part of membership. The list cannot be copied to another country because each country sets its own list in its own laws and constitution.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-identify-naturalization',
      kind: 'try_yourself',
      problem:
        'Marovia is an invented country. Dara was born in another country and later moved to Marovia. After living there for the period Marovian law requires, she studied Marovian law and government, met the other requirements Marovia sets, took the oath Marovia asks for, and was recognized as a Marovian citizen. Which route to citizenship does this describe?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Citizenship by being born inside the country\'s territory' },
        { id: 'b', text: 'Citizenship by descent from a parent who is already a citizen' },
        { id: 'c', text: 'Naturalization, a legal process completed after birth', correct: true },
        { id: 'd', text: 'Citizenship gained automatically by living in a country for a number of years' }
      ],
      expectedAnswer: 'Naturalization, a legal process completed after birth',
      hints: [
        'Two of the routes are facts about a person\'s birth -- where it happened, or who the parent was. Only one is a process a person goes through later.',
        'Look at what Dara actually did: requirements, an oath, and a decision by Marovia to recognize her. Living somewhere for a while was one requirement, not the whole thing on its own.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-right-or-responsibility',
      kind: 'try_yourself',
      problem:
        'Terenne is an invented country. Its constitution lists what Terennian citizens are entitled to and what membership asks of them in return. Which one of these is best described as a RESPONSIBILITY rather than a right?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Being treated equally under Terennian law' },
        { id: 'b', text: 'Speaking freely about what the Terennian government does' },
        { id: 'c', text: 'Receiving a fair hearing in a Terennian court' },
        { id: 'd', text: 'Serving on a jury when Terennian courts call a citizen', correct: true }
      ],
      expectedAnswer: 'Serving on a jury when Terennian courts call a citizen',
      hints: [
        'Run one test on each choice: is this something the citizen is ENTITLED TO, or something membership ASKS OF the citizen?',
        'Three of these describe protection the country owes the citizen. One describes work the country asks the citizen to do.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-variation-across-countries',
      kind: 'try_yourself',
      problem:
        'Two invented countries. In Marovia, a baby born inside Marovian territory is a Marovian citizen. In Terenne, a baby is a Terennian citizen only if at least one parent is already a Terennian citizen. What does this difference best show?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Different countries use different combinations of rules to decide who their citizens are.', correct: true },
        { id: 'b', text: 'One of the two rules must be a mistake, since a country can only have one rule.' },
        { id: 'c', text: 'Citizenship works the same way everywhere, so the two rules must mean the same thing.' },
        { id: 'd', text: 'Terenne\'s rule means there is no way at all for anyone else to become Terennian.' }
      ],
      expectedAnswer: 'Different countries use different combinations of rules to decide who their citizens are.',
      hints: [
        'Ask what fact each rule is looking at. One looks at where the birth happened; the other looks at who the parent is.',
        'Before choosing, check the last option against the concept. Naturalization is a separate route, so a country that uses descent at birth can still have a legal process for adults.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-citizenship-is-not-identity',
      kind: 'misconception_check',
      question:
        'A student writes: "If you speak a country\'s main language and your family has lived in that area for generations, then you are a citizen of that country automatically." What has gone wrong in that sentence?',
      commonErrors: [
        {
          answer: 'If you speak a country\'s main language and your family has lived in that area for generations, then you are a citizen of that country automatically.',
          misconception:
            'Treating citizenship as the same thing as language, ethnicity, ancestry or culture. The student is using things a person can hear or trace as though they were the legal test.',
          correctsTo:
            'Citizenship is a legal status that a country grants under its own laws. Language, ethnicity, ancestry and culture are different things and none of them is the legal test. WRONG: "She speaks the language and her family has always been here, so she is a citizen." CORRECT: "Whether she is a citizen depends on that country\'s laws -- on where she was born, on whether a parent was a citizen, or on whether she completed that country\'s legal process." Two facts help keep this straight. First, a country\'s citizens usually come from many backgrounds and speak many languages, so no single language or background can define the group. Second, many people speak a language fluently without being a citizen of any country where it is an official language.',
        },
        {
          answer: 'Rights are the part that counts. Responsibilities are extra things you can do if you feel like it.',
          misconception:
            'Reading responsibilities as optional add-ons rather than as one half of the arrangement citizenship sets up.',
          correctsTo:
            'Rights and responsibilities are a pair. A right is what a citizen is entitled to; a responsibility is what membership asks in return, and countries write those duties into their laws the same way they write the rights. Obeying the laws and paying required taxes are not favors a citizen does for the country when the mood strikes. Which duties appear on the list does vary by country -- jury service exists only where a country uses juries -- but that is variation in the list, not proof that the list is optional.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Citizenship is legal membership in a country, set by that country\'s laws -- not something you can see or hear.',
        'Three general routes: birth inside the territory, descent from a citizen parent, and naturalization.',
        'Countries use different combinations of those routes, so who counts as a citizen changes when you cross a border. That variation is the geographic point.',
        'Rights are what a citizen is entitled to; responsibilities are what membership asks in return. They come as a pair, and the duties are not optional extras.',
        'The exact list of rights and responsibilities varies by country, because each country writes its own in its own laws and constitution. Always ask: in which country?',
        'Citizenship is not the same as ethnicity, language or ancestry.',
        'Participation happens at local, regional and national scales, and the local scale is the one you can go and watch.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.2', cedTitle: 'Citizenship, Rights & Responsibilities' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
