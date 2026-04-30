/**
 * AP Psychology — Social psychology.
 *
 * Conformity (Asch), obedience (Milgram), Stanford prison, attribution
 * theory, attitudes, prejudice.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_PSYCH_SOCIAL: LessonPlan = {
  id: 'evelyn.ap.psych.social.v1',
  title: 'Social psychology: conformity, obedience, attribution',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'sci',
  topic: 'psychology',
  locale: 'en',
  los: [
    {
      id: 'appsych.social',
      description: 'Identify foundational social psychology experiments and concepts.',
      standard: 'AP-PSYCH-SOC',
    },
  ],
  prerequisites: ['appsych.cognition'],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the most uncomfortable lesson in psychology.',
      script: 'Ordinary people obey commands to electrocute strangers. People conform to obviously-wrong group answers. We blame others\' behavior on their character but excuse our own. Social psychology shows: situations shape behavior more than we think.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-experiments',
      kind: 'concept',
      goal: 'Three foundational studies + attribution + attitudes.',
      keyIdeas: [
        'ASCH CONFORMITY (1951): subjects asked to identify the longer of two lines. Confederates gave wrong answers. ~75% conformed at LEAST once. People conform to fit in even when they KNOW the group is wrong.',
        'MILGRAM OBEDIENCE (1961): subjects told to administer electric shocks to a "learner" (actor). 65% went all the way to (fake) lethal voltage. Authority figures get astonishing compliance.',
        'STANFORD PRISON (Zimbardo, 1971): students randomly assigned guard/prisoner roles in a basement. Within days, "guards" became cruel; "prisoners" emotionally broke down. Stopped after 6 days. SHOWS power of situations and roles. (Note: study\'s methodology has been criticized recently.)',
        'FUNDAMENTAL ATTRIBUTION ERROR: blaming OTHERS\' behavior on their character; explaining OUR OWN behavior by situation. They were rude (jerk) but I was rude (had a bad day).',
        'ATTITUDES: evaluations + emotions about something.',
        '  Cognitive dissonance (Festinger): we change attitudes to reduce conflict between belief and behavior.',
        'GROUPTHINK: cohesive groups reach bad decisions because dissent is suppressed. Bay of Pigs invasion is the canonical example.',
        'BYSTANDER EFFECT (Kitty Genovese): more witnesses = LESS likely any one helps. Diffusion of responsibility.',
        'PREJUDICE: prejudgment based on group membership. STEREOTYPE (cognitive) + ATTITUDE + DISCRIMINATION (behavior). Reduced by COOPERATION on shared goals (Sherif Robbers Cave).',
      ],
      vocabulary: [
        { term: 'conformity', definition: 'changing behavior to match a group.' },
        { term: 'obedience', definition: 'compliance with an authority figure.' },
        { term: 'fundamental attribution error', definition: 'attributing others\' behavior to character but our own to situation.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-attribution',
      kind: 'worked_example',
      problem: 'A driver cuts you off. You think "What a jerk." Later, YOU accidentally cut someone off; you think "I\'m late, didn\'t see them." What\'s happening?',
      steps: [
        'For the OTHER driver: you attribute their behavior to CHARACTER ("jerk") — a dispositional cause.',
        'For YOURSELF: you attribute behavior to SITUATION ("running late, didn\'t see") — a situational cause.',
        'This is the FUNDAMENTAL ATTRIBUTION ERROR — we systematically apply different standards to others vs ourselves.',
        'Origin: we have access to our own internal context (running late) but not theirs. Without that context, we default to character explanations.',
        'Awareness of this bias is the start of fairer judgment.',
      ],
      answer: 'fundamental attribution error',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In the Milgram experiments, what feature of the situation made obedience MORE likely?',
      expectedAnswer: 'authority figure was perceived as legitimate (Yale scientist), and the consequences were physically distant from the subject',
      responseFormat: 'free',
      hints: [
        'Authority legitimacy and victim distance both drove compliance.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-only-bad-people',
      kind: 'misconception_check',
      question: 'Did Milgram\'s and Asch\'s experiments find that BAD PEOPLE comply, while normal people resist?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Believing only "evil" people obey.',
          correctsTo: 'No — these experiments found AVERAGE people, drawn from ordinary populations, conformed and obeyed in shocking proportions. The implication is uncomfortable: situations matter more than character. Most people would obey or conform under similar conditions. That\'s the point.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Asch: ~75% conform at least once.',
        'Milgram: 65% obey to lethal levels.',
        'Stanford prison: roles powerfully shape behavior (with caveats).',
        'Fundamental attribution error: others = character, us = situation.',
        'Bystander effect: more people = less help.',
        'Situation > disposition more often than we admit.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How does cognitive dissonance explain why people who pay $500 for a hat say it\'s amazing, while people who paid $5 are more measured?',
      hint: 'Paying lots creates dissonance ("I spent $500 on this hat"). To reduce dissonance, the brain INFLATES the hat\'s perceived value. The $5 buyer has no dissonance to resolve. Marketers exploit this: high-price products often produce more LOYAL customers.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
