/**
 * IB DP History — anchor plan covering course shape, command terms,
 * and the source-handling discipline IB History rewards.
 */

import type { LessonPlan } from '../types';

export const SEED_IB_HISTORY: LessonPlan = {
  id: 'evelyn.ibdp.history.v1',
  title: 'IB History — course shape, source skills, OPVL',
  curriculum: 'IB-DP',
  grade: '11-12',
  subject: 'social-studies',
  topic: 'ib-history',
  locale: 'en',
  los: [
    {
      id: 'ibdp.history.overview',
      description: 'Map IB History assessment structure, drill OPVL source-evaluation, and identify the comparative essay moves examiners reward.',
      standard: 'IB-DP-HIST',
    },
  ],
  prerequisites: ['g912.ss.us-history'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'IB History rewards source skills and comparative argument — content alone tops out at the 4-5 mark band.',
      script: 'Two students know the same Cold War content cold. One scores a 6, one scores a 4. The difference: the 6-band student handles SOURCES (origin, purpose, value, limitation) explicitly and structures essays AROUND ARGUMENT, not chronology. Today we drill the OPVL framework and the comparative-essay shape that earn the top bands.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-ib-hist',
      kind: 'concept',
      goal: 'Assessment, OPVL, comparative essays, historiography, IA.',
      keyIdeas: [
        'ASSESSMENT (current syllabus): Paper 1 (source-based, 1 hour, prescribed subject), Paper 2 (essay, 1.5 hours, world history topics), Paper 3 (HL only, regional history), Internal Assessment (historical investigation, 20% grade).',
        'OPVL is the IB source-evaluation framework. For each source: ORIGIN (who wrote/produced it, when, where, what kind), PURPOSE (intended audience, intended effect, motive), VALUE (what does this source legitimately tell a historian about the issue?), LIMITATION (what does it NOT tell us, what biases or gaps?).',
        'OPVL on Paper 1: questions explicitly ask you to evaluate sources. A bald "the source is biased" earns nothing. "The source\'s value lies in revealing official Soviet rhetoric of 1948; its limitation is that as a Pravda editorial it cannot be read as neutral reportage of events" — this earns marks.',
        'COMPARATIVE ESSAYS (P2): structure by ARGUMENT axis, not country-by-country. Weak: "In the USSR... Meanwhile in China..." Strong: "Both regimes used famine as an instrument of agricultural reorganisation, but where Stalin\'s collectivisation was directed at kulaks as a class enemy, Mao\'s Great Leap was directed at meeting industrial output targets."',
        'HISTORIOGRAPHY = the history of historical interpretation. Knowing that "orthodox" historians (Schlesinger) blamed the USSR for the Cold War while "revisionist" historians (William Appleman Williams) blamed US economic expansionism earns historiographical marks.',
        'COMMAND TERMS to master: EXAMINE (consider arguments and evidence), TO WHAT EXTENT (judgement question — must arrive at a defended conclusion), DISCUSS (balanced consideration), EVALUATE (strengths/weaknesses then judgement), COMPARE AND CONTRAST (similarities AND differences).',
        'IA: a 2200-word historical investigation with three sections: source analysis (OPVL on two sources), investigation, reflection. Topic should be FOCUSED — "the impact of the Cuban Revolution" is too broad; "the role of literacy campaigns in legitimising the Castro regime, 1959-1965" is the right scale.',
        'CONTEXT must do analytical work, not sit as background. Brief, embedded context that enables your argument earns marks; opening paragraphs of generic context don\'t.',
      ],
      vocabulary: [
        { term: 'OPVL', definition: 'Origin, Purpose, Value, Limitation — IB History\'s framework for source evaluation; required across Paper 1 and the IA.' },
        { term: 'historiography', definition: 'the study of how historians have interpreted a topic over time; explicit historiographical knowledge earns top-band marks.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-opvl',
      kind: 'worked_example',
      problem: 'Apply OPVL to: A 1939 Pravda editorial published the day after the Nazi-Soviet Pact, justifying the agreement.',
      steps: [
        'ORIGIN: Pravda = official organ of the Communist Party of the Soviet Union. Editorial form (not signed news report) = unattributed but representing party line. 1939 = day after the Molotov-Ribbentrop Pact, signed 23 August 1939.',
        'PURPOSE: justify a sudden reversal of Soviet anti-fascist rhetoric to a domestic audience that had been told for years that fascism was the chief enemy. Audience: Soviet public, party members, foreign communist parties needing a line to follow.',
        'VALUE: an excellent source for revealing how the Soviet leadership wished the Pact to be PRESENTED — the rhetorical strategies, the framing of Britain and France as the "real" warmongers, the language used to recast Nazi Germany. Useful for studying Soviet propaganda mechanisms and the abrupt rhetorical pivot.',
        'LIMITATION: cannot be read as neutral reportage. Cannot tell us what the leadership PRIVATELY thought about the Pact. Cannot reveal Soviet strategic motives directly. Heavily filtered through Stalinist-era press control. Reading it as straightforward statement of Soviet view, rather than as carefully constructed public framing, would be a major analytical error.',
        'High-band move: link to historiographical debate about whether the Pact was opportunistic, defensive, or strategically calculated for buying time.',
      ],
      answer: 'OPVL applied: clearly distinguishes WHAT the source can tell us from WHAT it cannot.',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Apply OPVL briefly to: a 1965 oral-history interview with a Vietnam War veteran, recorded in 2010 for a university archive.',
      expectedAnswer: 'O — interview conducted 2010, well after the war; subject is a US veteran (specific position in the conflict matters: rank, branch, duration of service). P — academic archive, not advocacy; intended for historians studying veteran experience. V — direct testimony of someone who experienced the war; rich on subjective experience, attitudes, sensory details. L — 45-year gap means significant memory reconstruction; later cultural narratives (films, political discourse) shape the recall; one veteran\'s perspective is not representative; the interview process itself shapes what is said. Best used in TRIANGULATION with other sources.',
      responseFormat: 'free',
      hints: [
        'Origin: who, when, where, what type of source.',
        'Limitation: what kind of question would this source NOT answer well?',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-narrative',
      kind: 'misconception_check',
      question: 'A student writes a Paper 2 essay on the causes of WWII as a chronological narrative — "First, the Treaty of Versailles... Then the Depression... Then Hitler came to power..." Why does this score in the lower bands?',
      commonErrors: [
        {
          answer: 'Chronological coverage shows knowledge',
          misconception: 'Confusing knowing-the-content with arguing-from-the-content.',
          correctsTo: 'IB History bands above 4 require ARGUMENT, not narrative. The same WWII content can be marshaled to support: (1) Hitler-as-prime-mover thesis (intentionalist), (2) structural-failure thesis (Versailles + Depression created conditions any sufficiently extreme leader would exploit), (3) failure-of-collective-security thesis (League weakness, US isolation, French defensive posture), (4) appeasement-as-cause thesis. A high-band essay names a thesis, defends it with evidence, and weighs counter-interpretations. Pure chronology — even with great content — caps out around band 4 because no argument is being made. Always ask: "what is my one-sentence thesis, and is every paragraph defending it?"',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'OPVL on every source: origin, purpose, value, limitation.',
        'Comparative essays organise by argument axis, not country-by-country.',
        'Historiography (named historians, named schools) earns top-band marks.',
        'Argument > narrative; thesis defended throughout.',
        'IA topic must be focused enough to investigate in 2200 words.',
        'Context does analytical work, never sits as preamble.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
