/**
 * G8 — Citizen rights and responsibilities.
 *
 * Bill of Rights protections, civic duties (voting, juries, taxes),
 * how to participate beyond voting.
 */

import type { LessonPlan } from '../types';

export const SEED_G8_SS_CIVICS_RIGHTS: LessonPlan = {
  id: 'evelyn.g8.ss.civics.rights-responsibilities.v1',
  title: 'Citizen rights and responsibilities',
  curriculum: 'NCSS',
  grade: '8',
  subject: 'ss',
  topic: 'civics',
  locale: 'en',
  los: [
    {
      id: 'ncss.68.civic.rights-duties',
      description: 'Identify rights and responsibilities of US citizens and explain ways citizens participate in government.',
      standard: 'NCSS.D2.Civ.6.6-8',
    },
  ],
  prerequisites: ['ncss.68.civic.constitution'],
  followUps: ['ncss.911.civic.federalism'],
  estimatedMinutes: 13,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame citizenship as a two-sided coin.',
      script: 'Citizenship comes with TWO things: rights (what you\'re GUARANTEED) and responsibilities (what\'s expected of YOU). Most people focus on the rights — but the responsibilities are how a democracy stays alive.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-rights-and-duties',
      kind: 'concept',
      goal: 'Survey core constitutional rights and civic responsibilities.',
      keyIdeas: [
        'CORE RIGHTS (Bill of Rights): 1st Amendment — speech, religion, press, assembly, petition. 2nd — bear arms. 4th — protection from unreasonable search. 5th — due process, no self-incrimination. 6th — fair trial. 8th — no cruel/unusual punishment. 14th — equal protection.',
        'RIGHTS aren\'t absolute. You can\'t shout "fire" in a theater (1st Amendment limit). Police CAN search with a warrant. Free speech doesn\'t protect threats or fraud.',
        'CIVIC RESPONSIBILITIES (legally required): obey laws, pay taxes, register for the draft (men 18+), serve on juries when called.',
        'CIVIC RESPONSIBILITIES (encouraged): vote, stay informed, participate in community, volunteer, respect others\' rights.',
        'WAYS TO PARTICIPATE: voting in elections (federal, state, local). Contacting representatives. Attending town halls. Running for local office. Joining advocacy groups. Peaceful protest.',
        'NATURALIZATION: how non-citizens become citizens. Lawful permanent residence (5+ years), pass civics test, English test, oath of allegiance.',
      ],
      vocabulary: [
        { term: 'Bill of Rights', definition: 'first 10 amendments to the US Constitution, protecting individual freedoms.' },
        { term: 'civic responsibility', definition: 'duty a citizen owes to society and government.' },
        { term: 'naturalization', definition: 'the process of becoming a US citizen if born elsewhere.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-jury-duty',
      kind: 'worked_example',
      problem: 'Why is jury duty considered both a right AND a responsibility?',
      steps: [
        'RIGHT: the 6th Amendment guarantees a "trial by jury" for criminal cases. Defendants can demand a jury of peers — protection against government abuse.',
        'RESPONSIBILITY: that protection only works if citizens actually SHOW UP to serve. If everyone dodged jury duty, defendants would have no jury.',
        'It\'s reciprocal: by serving when called, you ENABLE the right for everyone.',
        'In most states, you\'re legally required to respond to a jury summons. Skipping = potential fines or contempt.',
      ],
      answer: 'right (6th Amendment guarantee) + responsibility (citizens must serve to make the right real)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Name TWO ways a citizen can participate in democracy beyond just voting.',
      expectedAnswer: 'attend town halls; contact representatives; volunteer; protest; join advocacy groups',
      responseFormat: 'free',
      hints: [
        'Think locally — town meetings, school boards.',
        'Think communication — letters, petitions, calls.',
        'Think direct action — peaceful protest, advocacy.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-rights-absolute',
      kind: 'misconception_check',
      question: 'Is free speech absolute — meaning you can say ANYTHING with no consequences?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating rights as unlimited.',
          correctsTo: 'No — courts have ruled that 1st Amendment protection has LIMITS. Threats, fraud, defamation, incitement to imminent violence, true commercial fraud — none are protected. The principle is "you have the right to speak, but not the right to escape consequences for SOME kinds of speech".',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Rights (Bill of Rights) protect individual freedoms — but aren\'t absolute.',
        'Civic responsibilities: obey laws, taxes, draft registration (men), juries.',
        'Encouraged: voting, staying informed, participating beyond voting.',
        'Naturalization: how immigrants become citizens — 5+ years, civics test, oath.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'In a democracy, why is voter TURNOUT important?',
      hint: 'Low turnout means policy reflects only those who showed up. Off-year and primary elections have especially low turnout. Whoever votes shapes the result. Suppression and apathy both threaten representation.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
