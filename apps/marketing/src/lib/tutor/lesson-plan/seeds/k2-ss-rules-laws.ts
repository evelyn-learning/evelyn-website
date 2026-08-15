/**
 * Grades K-2 Social Studies — Rules & Laws.
 */

import type { LessonPlan } from '../types';

export const SEED_K2_SS_RULES_LAWS: LessonPlan = {
  id: 'evelyn.k2.ss.rules-laws.v1',
  title: 'K-2 SS — Rules & Laws',
  curriculum: 'CCSS',
  grade: 'K-2',
  subject: 'ss',
  topic: 'k2-ss',
  locale: 'en',
  los: [
    {
      id: 'k2.ss.rules-laws',
      description: 'Distinguish between rules (in school/home) and laws (in town/country); explain why both exist.',
      standard: 'NCSS K-2 Civic Ideals & Practices',
    },
  ],
  prerequisites: ['k2.ss.community-intro'],
  followUps: ['k2.ss.timeline-intro'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Rules and laws keep us safe and fair.',
      script: 'At home, you have rules: brush your teeth, no jumping on the couch. At school, you have rules: raise your hand, walk in the hallway. The town has bigger rules called LAWS: drive on the right side, don\'t take other people\'s things. All of these help us live together.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-rules-laws',
      kind: 'concept',
      goal: 'Rules vs laws + reasons for each + who makes them.',
      keyIdeas: [
        'RULE: a guide for behaviour in a small group — home, classroom, sports team.',
        'LAW: a rule for a whole town, state, or country. Made by a GOVERNMENT.',
        'Rules are usually made by parents, teachers, or coaches.',
        'Laws are made by lawmakers (people elected by the community).',
        'PURPOSE: rules and laws keep people safe, fair, and respectful of each other.',
        'EXAMPLES of rules: "no running in the hall", "raise your hand", "share toys".',
        'EXAMPLES of laws: "stop at red lights", "wear a seatbelt", "don\'t steal".',
        'CONSEQUENCES: breaking a school rule might mean losing recess. Breaking a law might mean a fine or, for big laws, jail.',
        'GOOD CITIZENS follow rules and laws AND speak up to change unfair ones.',
      ],
      vocabulary: [
        { term: 'rule', definition: 'a guide for behaviour in a small group, like a class or a family.' },
        { term: 'law', definition: 'a rule made by the government for everyone.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-rules-laws',
      kind: 'worked_example',
      problem: 'Sort these into RULES or LAWS: "No talking in the library" / "Drivers must wear seatbelts" / "Take turns on the swing".',
      steps: [
        '"No talking in library" → RULE (made by the library, for people in the library).',
        '"Drivers must wear seatbelts" → LAW (made by government, applies everywhere on roads).',
        '"Take turns on the swing" → RULE (a guide for kids on the playground).',
      ],
      answer: 'Library rule, seatbelt law, swing rule.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why do you think we have a LAW about wearing seatbelts?',
      expectedAnswer: 'To keep people safe in car crashes. Seatbelts stop people from being thrown out of the seat or through the windshield. The law makes sure everyone wears one because it saves lives.',
      responseFormat: 'free',
      hints: [
        'What does a seatbelt do?',
        'Why would the government want EVERYONE to wear one?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-rules-bad',
      kind: 'misconception_check',
      question: 'A child says "rules are just to stop kids from having fun." Why is this incomplete?',
      commonErrors: [
        {
          answer: 'Rules stop fun',
          misconception: 'Seeing rules as restrictions only.',
          correctsTo: 'Rules and laws actually MAKE fun safer. "No running in the hallway" prevents bumps and broken arms. "Take turns on the swing" means everyone gets to enjoy it. Without rules, the strongest or fastest take over and others lose out. Most rules exist because someone got hurt or treated unfairly without them.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Rule = guide for a small group.',
        'Law = rule from the government for everyone.',
        'Both keep us safe and fair.',
        'Good citizens follow rules and work to change unfair ones.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Can a rule be unfair? What can people do if it is?',
      hint: 'Yes. Sometimes a rule helps some people but hurts others. People can SPEAK UP — talk to teachers or parents, write letters, or vote on changing the rule. In a community, voices matter. Even kids can ask "is this fair?" and adults should listen.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
