/**
 * Grade 7 World Geography — Human Geography: Migration, Push & Pull Factors.
 *
 * The concept-led exemplar for the m7geo course (National Geography Standard
 * 9). Teaches the ANALYTICAL FRAMEWORK -- push factors, pull factors,
 * voluntary versus forced, internal versus international -- and nothing else.
 *
 * NOTE FOR FUTURE AUTHORS, and this one matters: migration is a live
 * political subject and the audience is twelve. This file teaches the
 * framework using historically settled examples and invented family
 * scenarios. It takes NO position on any current policy debate, characterises
 * NO group of people, and asserts NO contested claim as fact. Every scenario
 * in an item is a short invented case -- a made-up family, a made-up town --
 * never a real named community. Keep it that way.
 *
 * There are also NO MAPS AND NO IMAGES in this course. Every item is solvable
 * from the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7GEO_U3_MIGRATION_PUSH_AND_PULL: LessonPlan = {
  id: 'evelyn.ms.m7geo.migration-push-and-pull.v1',
  title: 'Migration: Push & Pull Factors',
  curriculum: 'MS',
  grade: '7',
  subject: 'social-studies',
  topic: 'grade-7-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm7geo.migration-push-and-pull',
      standard: 'M7GEO-3.3',
      description:
        'Explain why people move by sorting the reasons into push factors and pull factors, and distinguish voluntary from forced migration and internal from international migration (National Geography Standard 9: the characteristics, distribution and migration of human populations on Earth surface).',
    },
  ],
  prerequisites: ['m7geo.population-growth-and-structure'],
  followUps: ['m7geo.urbanization-and-settlement'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Anchor migration in an ordinary decision the student has seen, before any technical vocabulary.',
      script:
        'Think about a family you know that moved. Maybe it was yours. There is almost never one single reason. Somebody got a job somewhere else, and the rent had gone up, and there was a cousin in the new town, and the old apartment was too small anyway. Some of those reasons were about the place they left. Some were about the place they were going. Geographers have names for those two kinds of reason, and once you can sort them, you can explain almost any move anyone has ever made -- across town, or across the world.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-push-pull',
      kind: 'concept',
      goal: 'Install the push/pull sort, the voluntary/forced and internal/international distinctions, and the one-reason trap.',
      keyIdeas: [
        'MIGRATION IS MOVING FROM ONE PLACE TO ANOTHER TO LIVE. It is not a vacation and not a day trip. Geographers count somebody as a migrant when they change where they live, whether that is one town over or one continent over.',
        'A PUSH FACTOR IS A REASON TO LEAVE the place someone is in. Examples: a drought that ruins the harvest, a factory closing, a flood, a shortage of housing, a war. A PULL FACTOR IS A REASON TO GO to the new place: jobs, farmland, safety, family already living there, schools. The test is simple -- ask which place the reason is about. If it is about the old place, it pushes. If it is about the new place, it pulls.',
        'THE SAME CONDITION CAN PUSH IN ONE PLACE AND PULL IN ANOTHER. Plenty of work is a pull toward the new town; no work is a push out of the old one. That is not two different factors, it is one factor seen from two ends. Noticing this is what separates naming factors from actually understanding a move.',
        'VOLUNTARY MIGRATION IS A CHOICE; FORCED MIGRATION IS NOT. Somebody moving for a better job is migrating voluntarily. People escaping a war, a disaster, or people being moved against their will are not choosing in any ordinary sense. Historically the largest forced migration was the transatlantic slave trade, in which millions of enslaved people were taken from Africa to the Americas. Do not describe forced migration with the language of choice.',
        'INTERNAL MIGRATION STAYS INSIDE ONE COUNTRY; INTERNATIONAL MIGRATION CROSSES A BORDER. Moving from a farm to a city in the same country is internal. Moving from one country to another is international. A move can be described both ways at once -- voluntary and internal, or forced and international -- because the two questions are separate.',
        'THE BIG TRAP -- PEOPLE ALMOST NEVER MIGRATE FOR ONE REASON. Real decisions stack several pushes and several pulls, and often a barrier that had to be overcome: the cost of moving, distance, or leaving family behind. If your explanation of a move has exactly one reason in it, you have probably stopped reading too early.',
      ],
      vocabulary: [
        { term: 'migration', definition: 'moving from one place to another with the intention of living there.' },
        { term: 'push factor', definition: 'a reason that makes someone want to leave the place where they live.' },
        { term: 'pull factor', definition: 'a reason that attracts someone to a new place.' },
        { term: 'voluntary migration', definition: 'migration a person chooses.' },
        { term: 'forced migration', definition: 'migration in which people have no real choice about leaving.' },
        { term: 'internal migration', definition: 'migration that stays within the borders of one country.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-sort-the-factors',
      kind: 'worked_example',
      problem:
        'Sort the reasons in this case into push factors and pull factors, then say whether the move is internal or international.\n\n"The Okonkwo family lived in a small farming village. Three years of poor rains left them with almost nothing to sell. Their eldest daughter had already moved to a large city in the same country, where she found steady work, and she wrote that a warehouse near her was hiring. The family packed up and joined her."',
      steps: [
        'List every reason mentioned, without labelling anything yet. Three years of poor rains. Almost nothing to sell. A daughter already in the city. Steady work there. A warehouse hiring.',
        'Now run the test on each one: is this reason about the OLD place or the NEW place?',
        'Poor rains and nothing to sell are about the village they are leaving. Those are PUSH factors.',
        'The daughter already living there, the steady work, and the warehouse hiring are all about the city they are going to. Those are PULL factors.',
        'Notice there are two pushes and three pulls, not one reason. That is normal, and it is the point of the trap in the concept: a real move stacks reasons.',
        'Last question: internal or international? The case says the city is in the same country, so this is INTERNAL migration. It is also voluntary -- difficult, but a choice the family made.',
      ],
      answer:
        'Push factors: three years of poor rains, and having almost nothing to sell. Pull factors: a daughter already living in the city, steady work there, and a warehouse hiring. The move is internal and voluntary.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-same-factor-both-ends',
      kind: 'worked_example',
      problem:
        'A student writes: "Jobs is a pull factor, so it cannot also be a push factor." Explain why that is not quite right, using this case.\n\n"When the paper mill in Rivertown closed, about a third of the jobs in the town went with it. Many families moved to Bell City, where a new hospital was hiring."',
      steps: [
        'Find the two job-related facts in the case. In Rivertown, the mill closed and the jobs went. In Bell City, a hospital is hiring.',
        'Run the test on the first one. The lost jobs are about Rivertown, the place people are leaving. So losing work is a PUSH factor.',
        'Run it on the second. The hospital hiring is about Bell City, the place people are going. So available work is a PULL factor.',
        'Both facts are about work, and they land in different columns. So the student is wrong that a topic belongs to only one column -- what decides the label is WHICH PLACE the reason is about, not what the reason is about.',
        'WRONG way to say it: "Jobs are always a pull factor." RIGHT way: "The absence of work pushed people out of Rivertown, and the availability of work pulled them toward Bell City."',
        'This is worth holding onto, because it is the same for almost every topic in this unit: safety, housing, schools and farmland can each push from one end and pull from the other.',
      ],
      answer:
        'Work appears in both columns. Losing work is a push factor in Rivertown; available work is a pull factor in Bell City. The label depends on which place the reason describes, not on the topic itself.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-classify-factor',
      kind: 'try_yourself',
      problem:
        'Read the case, then decide which reason is a PUSH factor.\n\n"The Nakamura family left the coastal town where they had lived for years after a severe storm damaged their home. They moved inland to a town where an aunt had offered them a place to stay while they rebuilt their savings."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The severe storm that damaged their home', correct: true },
        { id: 'b', text: 'The aunt offering them a place to stay' },
        { id: 'c', text: 'The chance to rebuild their savings inland' },
        { id: 'd', text: 'The inland town being farther from the coast' }
      ],
      expectedAnswer: 'The severe storm that damaged their home',
      hints: [
        'Ask the one test question about each choice: is this reason about the place they LEFT, or the place they went TO?',
        'Three of these describe something waiting for them inland. Only one describes something that happened where they were living.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-voluntary-or-forced',
      kind: 'try_yourself',
      problem:
        'Which of these is best described as FORCED migration rather than voluntary migration?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A family moves to another country because a parent accepted a job there.' },
        { id: 'b', text: 'A student moves to a city in the same country to attend a special school.' },
        { id: 'c', text: 'A retired couple moves to a warmer region because they prefer the climate.' },
        { id: 'd', text: 'A family flees their home because fighting has made the area unsafe.', correct: true }
      ],
      expectedAnswer: 'A family flees their home because fighting has made the area unsafe.',
      hints: [
        'Forced migration means the people had no real choice about leaving. Ask of each case: could these people reasonably have stayed?',
        'A job, a school and a preferred climate are all reasons someone weighs and then chooses. Danger to your life is not a choice in the same sense.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-internal-international',
      kind: 'try_yourself',
      problem:
        'A family moves from a rural region to a large city several hundred miles away, without crossing any national border. How is this migration best described?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'International, because they traveled a long distance' },
        { id: 'b', text: 'Internal, because the move stayed inside one country', correct: true },
        { id: 'c', text: 'Forced, because rural regions have fewer jobs' },
        { id: 'd', text: 'It is not migration, because they stayed in the same country' }
      ],
      expectedAnswer: 'Internal, because the move stayed inside one country',
      hints: [
        'Internal and international are decided by one thing only: whether a national border was crossed. Distance does not enter into it.',
        'Check the other labels too. Nothing in the case says the family had no choice, and a move within a country is still migration.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-one-reason',
      kind: 'misconception_check',
      question:
        'A student explains a family move by writing only: "They moved because there were jobs in the new city." What is missing from that explanation?',
      commonErrors: [
        {
          answer: 'They moved because there were jobs in the new city.',
          misconception:
            'Stopping at the first reason found, and assuming one factor explains a whole decision. The student has named a single pull factor and treated it as the complete answer.',
          correctsTo:
            'A migration decision almost always stacks several reasons, and a full explanation needs both columns. What was happening in the place they LEFT? Rising rent, lost work, a poor harvest, a lack of housing? And what else drew them to the new place besides work -- family already there, schools, safety? The student has one pull factor and no push factors at all, so the explanation only accounts for half the decision. Ask both questions every time: why leave there, and why go here.',
        },
        {
          answer: 'Since the move was long-distance, it must be international migration.',
          misconception:
            'Using distance as the test for internal versus international, because a long move feels like it must cross a border.',
          correctsTo:
            'The only test is whether a national border was crossed. A move of a thousand miles inside one large country is INTERNAL migration; a move of twenty miles that crosses a border is INTERNATIONAL. Distance is a barrier that affects how hard a move is, but it does not decide this label.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Migration means moving somewhere to live -- not a trip or a visit.',
        'Push factors are about the place someone LEAVES. Pull factors are about the place they GO. Ask which place the reason describes.',
        'One topic can appear in both columns: no work pushes, available work pulls.',
        'Voluntary migration is a choice; forced migration is not. Do not describe forced migration in the language of choice.',
        'Internal stays inside one country, international crosses a border. Distance does not decide it.',
        'People almost never move for one reason. A one-reason explanation is an unfinished explanation.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.3', cedTitle: 'Migration: Push & Pull Factors' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
