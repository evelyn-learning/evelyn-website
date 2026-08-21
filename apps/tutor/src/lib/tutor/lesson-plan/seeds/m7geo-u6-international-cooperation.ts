/**
 * Grade 7 World Geography — Government & Citizenship: International
 * Cooperation & Organizations. Closes Unit 6 (National Geography Standard 13,
 * the cooperation half).
 *
 * Concept-led. Teaches WHY countries cooperate (many problems cross borders),
 * the FORMS cooperation takes (treaties, international organizations with
 * member states, regional organizations, non-governmental organizations), the
 * geographic payoff (cooperation itself has a geography -- groups form around
 * shared rivers, seas, borders and trade routes), and the honest limit
 * (agreements hold only while members keep them).
 *
 * NOTE FOR FUTURE AUTHORS, and this one matters: international organizations
 * are a live political subject and the audience is twelve. This file names
 * exactly ONE real organization -- the United Nations -- and names it only as
 * an example of a broad international organization with member states. It
 * evaluates NO organization, describes NO current dispute, decision,
 * resolution or controversy, and takes NO position on any policy. Every
 * scenario in an item uses invented countries and an invented river or sea.
 * There are no invented statistics anywhere -- no member counts, no budgets.
 * Keep it that way.
 *
 * There are also NO MAPS AND NO IMAGES in this course. Every item is solvable
 * from the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7GEO_U6_INTERNATIONAL_COOPERATION: LessonPlan = {
  id: 'evelyn.ms.m7geo.international-cooperation.v1',
  title: 'International Cooperation & Organizations',
  curriculum: 'MS',
  grade: '7',
  subject: 'social-studies',
  topic: 'grade-7-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm7geo.international-cooperation',
      standard: 'M7GEO-6.4',
      description:
        'Explain why countries cooperate across borders, identify the forms that cooperation takes -- treaties, international organizations with member states, regional organizations and non-governmental organizations -- and describe how cooperation has its own geography and its own limits (National Geography Standard 13: how the forces of cooperation and conflict among people influence the division and control of Earth surface).',
    },
  ],
  prerequisites: ['m7geo.borders-and-conflict'],
  followUps: ['m7geo.latin-america-physical-geography'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show the student that ordinary things they already use only work because countries agreed on something.',
      script:
        'Check the weather on a phone. That forecast is built from measurements taken by weather stations, ships and satellites all over the world, and the reason your country can see measurements taken in other countries is that they agreed to share them. Storms do not stop at borders, so forecasting cannot either. The same is true of a package mailed to another country, of a plane flying from one country to another, and of a phone that still works when you land. None of that happens because one government decided it. It happens because a lot of governments sat down and agreed on the same rules. Today we look at why countries do that, what shapes that agreement takes, and what those agreements cannot do.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-why-and-how-countries-cooperate',
      kind: 'concept',
      goal: 'Install the cross-border reason for cooperation, the four forms it takes, the geography of cooperation, and the limits.',
      keyIdeas: [
        'COUNTRIES COOPERATE BECAUSE MANY PROBLEMS CROSS BORDERS AND NO SINGLE COUNTRY CAN SOLVE THEM ALONE. A river that starts in one country and passes through three more is one river, not four. Air pollution blows downwind. Ocean pollution drifts on currents. A disease travels with the people who carry it. Birds and whales migrate across many countries in a year. Ships need shipping lanes that several countries border. Even everyday systems -- mail, phone networks, aircraft -- only work between countries because countries agreed on shared rules for them. In every one of these cases, a country acting by itself can do part of the job and no more.',
        'COOPERATION TAKES FOUR MAIN FORMS. A TREATY OR AGREEMENT is a written promise between two or more countries about what each will do. An INTERNATIONAL ORGANIZATION is a standing body whose members are countries, called member states, that meet and work on shared problems over many years -- the United Nations is the best known example of a broad one with member states from around the world. A REGIONAL ORGANIZATION groups neighboring countries, usually to make trade easier or to agree on rules they all share. A NON-GOVERNMENTAL ORGANIZATION, or NGO, is not run by any government at all -- it raises its own money and does its own work, often on disaster relief, health, education or protecting wildlife.',
        'DIFFERENT ORGANIZATIONS DO DIFFERENT KINDS OF WORK, AND THE DIFFERENCE MATTERS. Some exist to run one narrow technical system, such as agreeing how mail crosses borders. Some exist to help countries trade with each other. Some study a shared river or a shared sea. Some respond to disasters. Reading the name is not enough -- to understand an organization you have to ask two questions: who are its members, and what problem was it built to work on?',
        'COOPERATION HAS ITS OWN GEOGRAPHY. This is the part that makes it a geography lesson. Groups of countries do not form at random. They form around something the members physically share: a river several of them depend on, a sea they all fish or ship across, a mountain range they all border, a trade route that runs through all of them. If you know which countries share a feature, you can often predict which countries ended up in a group together. The map of who cooperates with whom is largely drawn by rivers, coasts, borders and routes.',
        'AN INTERNATIONAL ORGANIZATION IS NOT A GOVERNMENT OVER ITS MEMBERS. A national government makes laws inside its own territory and can enforce them there through its courts. An international organization has no territory of its own and no police of its own. Its members are countries, and countries join by choosing to. What looks like a rule being imposed is almost always a rule the member countries wrote and agreed to follow. Joining does not make a country stop being a country -- it stays a country with its own government, its own borders and its own laws.',
        'COOPERATION IS A PROCESS, NOT A GUARANTEE. Because agreements rest on members choosing to keep them, they can be kept well, kept partly, or not kept at all. Members disagree, and negotiating a single agreement can take years. That is not a sign that cooperation failed -- it is what cooperation looks like. The honest summary is this: shared problems push countries toward each other, and separate interests pull them apart, and the result is worked out again and again rather than settled once.',
      ],
      vocabulary: [
        { term: 'treaty', definition: 'a written agreement between two or more countries about what each of them will do.' },
        { term: 'international organization', definition: 'a standing body whose members are countries, set up to work on shared problems.' },
        { term: 'member state', definition: 'a country that belongs to an international organization.' },
        { term: 'regional organization', definition: 'an organization that groups neighboring countries, often for trade or shared rules.' },
        {
          term: 'non-governmental organization',
          definition: 'an organization that is not run by any government, raising its own money to do its own work. Often shortened to NGO.',
        },
        { term: 'sovereignty', definition: 'the power a country has to govern itself inside its own borders.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-shared-river',
      kind: 'worked_example',
      problem:
        'Three invented countries share one river. The Kestrel River begins in the mountains of Nera, flows across the plains of Solva, and reaches the sea in Tamir. Nera wants to build a dam high in the mountains. Solva depends on river water for its farms. Tamir depends on the fish near the river mouth.\n\nExplain why this problem cannot be solved by one country alone, and describe two forms the cooperation could take.',
      steps: [
        'Start by describing the physical system, not the politics. The Kestrel is ONE river. It happens to pass through three sets of borders, but the water does not know that. Whatever happens upstream arrives downstream.',
        'Now ask what each country actually controls. Nera controls its own stretch of the river and nothing else. Solva controls its own stretch. Tamir controls its own. No one of them controls the river.',
        'That mismatch is the whole reason for cooperation: the problem is the size of the river, and each country is the size of its own territory. Nera can build the dam legally inside its own borders and still change what reaches Solva and Tamir.',
        'Notice that no country can simply decide for another. Solva cannot make Nera stop, and Nera cannot make Tamir accept the result. Each country governs itself inside its borders -- that is sovereignty. So the only route left is talking and agreeing.',
        'FORM ONE, A TREATY. The three countries negotiate a written agreement: how much water Nera releases each season, and what warning it gives before changing the flow. It is a promise, in writing, between the three of them.',
        'FORM TWO, A STANDING ORGANIZATION. They set up a Kestrel River commission whose members are the three countries. It meets every year, measures the flow, and is a place to raise a problem before it becomes a crisis. A treaty settles one question once; an organization keeps working on the question.',
        'Now the geography point. Why exactly these three countries and no others? Because these three are the ones the river runs through. The membership was decided by the course of the river. That is what it means to say cooperation has a geography.',
        'And the limit, stated honestly. The agreement works while all three keep it. If Nera releases less water than promised, Solva and Tamir can complain, negotiate, and press their case -- but they cannot govern Nera. Cooperation here is a process the three of them keep doing, not a problem they solve once.',
      ],
      answer:
        'The river crosses three borders but each country controls only its own stretch, so no single country can manage the whole river and none can decide for the others. Cooperation could take the form of a treaty setting how much water Nera releases and what warning it gives, or a standing river commission with all three countries as members that measures the flow and meets regularly. The three members were selected by geography -- they are the countries the river runs through -- and the arrangement holds only as long as all three keep it.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-organizations-are-not-governments',
      kind: 'worked_example',
      problem:
        'A student writes: "Solva had to cut the waste it puts in the Kestrel River because the river commission ordered it to, so Solva is not really an independent country anymore."\n\nExplain what is wrong with both halves of that sentence, and say what is actually happening.',
      steps: [
        'Take the word "ordered" first. Compare the commission with a national government. A national government has territory, makes laws that apply inside it, and has courts and police to enforce them.',
        'Now ask what the commission has. It has no territory of its own. It has no courts and no police. Its members are not people, they are three countries.',
        'So where did the waste rule come from? From the three member countries, who negotiated it and agreed to it. Solva is one of the countries that wrote the rule. The commission did not hand down a rule to Solva from above; Solva helped make it.',
        'WRONG way to say it: "The commission ordered Solva to cut its waste." CORRECT way: "Solva agreed with Nera and Tamir to cut its waste, and the commission is where they made and track that agreement."',
        'Then ask why Solva keeps the agreement, since nobody can force it. Because it wants the other two to keep their side, because it gets something it needs out of the deal, and because a country that breaks its promises finds the next agreement harder to negotiate. Those are real reasons, and they are different from being forced.',
        'Now the second half of the sentence. Joining a group did not change what Solva is. It still has its own government, its own borders, its own laws and its own seat at the table. A country that makes a promise is a country exercising its power to decide, not a country that lost it.',
        'Finish with the limit, honestly. If Solva stopped keeping the agreement, Nera and Tamir could object, renegotiate, or refuse to keep their own side. What they could not do is govern Solva. That is exactly why cooperation is a process rather than a guarantee.',
      ],
      answer:
        'Both halves are wrong. The commission did not order anything -- it has no territory, courts or police, and its members are the three countries themselves, so the waste rule is an agreement Solva helped write and chose to keep. And joining did not cost Solva its independence: it still has its own government, borders and laws. Making an agreement is something a country does with its power, not something that takes its power away.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-cross-border-problem',
      kind: 'try_yourself',
      problem:
        'Which of these problems is most likely to require several countries to work together, rather than being handled by one country on its own?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A river that begins in one country and flows through three more before reaching the sea', correct: true },
        { id: 'b', text: 'A national government setting the speed limit on the highways inside its own country' },
        { id: 'c', text: 'A country building a new subway line under one of its own cities' },
        { id: 'd', text: 'A town repairing a bridge over a small creek that runs only through that town' }
      ],
      expectedAnswer: 'A river that begins in one country and flows through three more before reaching the sea',
      hints: [
        'The test is not how big or expensive the problem is. The test is whether the problem itself crosses a border.',
        'Three of these sit entirely inside one country, so one government can finish the job. Only one of them is a single thing that several countries each control a piece of.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-identify-the-form',
      kind: 'try_yourself',
      problem:
        'Read the description, then choose the form of cooperation it best matches.\n\n"A group of scientists and volunteers from many countries raises its own money from donations. It sends teams to study sea turtles and to protect the beaches where they nest. No government runs it and no government pays for it."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A treaty between countries' },
        { id: 'b', text: 'A non-governmental organization', correct: true },
        { id: 'c', text: 'A regional organization of neighboring countries' },
        { id: 'd', text: 'An international organization whose members are member states' }
      ],
      expectedAnswer: 'A non-governmental organization',
      hints: [
        'Ask the first of the two questions from the concept: who are the members? Countries, or people and groups that are not governments?',
        'Read the last sentence of the description again. It rules out three of these four answers on its own.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-geography-of-cooperation',
      kind: 'try_yourself',
      problem:
        'Five invented countries -- Aldoria, Brenn, Coval, Dressa and Elm -- all have coastline on the same inland sea. They form a group that agrees on rules for fishing in that sea. A sixth invented country, Farlow, lies far inland on another continent and is not in the group.\n\nWhat best explains why these five formed the group and Farlow did not?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Groups like this only form after countries have fought each other, and Farlow has not' },
        { id: 'b', text: 'All five border the same sea, so the fishing rules affect every one of them', correct: true },
        { id: 'c', text: 'The five countries ordered Farlow to stay out of the group' },
        { id: 'd', text: 'The five countries stopped being separate countries when they joined the group' }
      ],
      expectedAnswer: 'All five border the same sea, so the fishing rules affect every one of them',
      hints: [
        'Look for the thing the five countries physically share that the sixth does not. Cooperation usually forms around something shared.',
        'Check the other three against what you learned. Cooperation does not require a conflict first, no country can order another to stay out, and joining a group does not end a country.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-organizations-and-conflict',
      kind: 'misconception_check',
      question:
        'A student writes: "An international organization is basically a world government -- it makes the rules and the member countries have to obey them, the same way citizens have to obey their own government." What is wrong with this?',
      commonErrors: [
        {
          answer: 'An international organization makes rules and its member countries have to obey them, the way citizens obey their own government.',
          misconception:
            'Treating an international organization as a government one level up, with countries in the place of citizens. The student assumes that anything that makes rules must be able to enforce them.',
          correctsTo:
            'The two are not the same kind of thing. A national government has territory, and it has courts and police to enforce its laws inside that territory. An international organization has no territory of its own and no police of its own, and its members are countries rather than people. What look like its rules are agreements the member countries negotiated and chose to accept. WRONG: "The organization ordered the country to do it." CORRECT: "The member countries agreed to do it, and the organization is where they made and track that agreement." A country that joins keeps its own government, its own borders and its own laws -- joining is something a country does with its power to decide, not something that takes that power away. It also means agreements can be broken, and sometimes are, which is why cooperation is a process rather than a guarantee.',
        },
        {
          answer: 'Countries only start cooperating after a conflict, so an organization is a sign that its members used to fight.',
          misconception:
            'Assuming cooperation is always a repair job that follows conflict, so every group of countries must have a fight behind it.',
          correctsTo:
            'Most cooperation starts from a shared problem, not from a past fight. Countries that share a river cooperate about the water. Countries around one sea cooperate about fishing and shipping. Countries that trade along the same route cooperate about the rules of that route. Weather services share measurements because storms cross borders. None of that requires a conflict first. Look for what the members physically share -- a river, a sea, a border, a route -- because that is what usually explains why a particular set of countries ended up in a group together.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Countries cooperate because many problems cross borders -- rivers, air and ocean pollution, disease, migrating animals, shipping lanes -- and no single country can solve those alone.',
        'Four forms: a treaty is a written agreement between countries; an international organization is a standing body whose members are countries; a regional organization groups neighboring countries; a non-governmental organization is run by no government at all.',
        'Ask two questions about any organization: who are its members, and what problem was it built to work on? Different organizations do very different kinds of work.',
        'Cooperation has a geography. Groups form around what the members share -- a river, a sea, a border, a trade route -- so geography often explains who is in a group and who is not.',
        'An international organization is not a government over its members. It has no territory and no police, and joining does not stop a country from being a country.',
        'Cooperation is a process, not a guarantee. Agreements hold while members keep them, members disagree, and the working out happens again and again.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.4', cedTitle: 'International Cooperation & Organizations' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
