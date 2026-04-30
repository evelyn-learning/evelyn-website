/**
 * AP Government — Federalism.
 *
 * Division of power between federal and state governments. Enumerated,
 * implied, reserved, concurrent powers. Evolution over US history.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_GOV_FEDERALISM: LessonPlan = {
  id: 'evelyn.ap.gov.federalism.v1',
  title: 'Federalism: dividing power between levels of government',
  curriculum: 'NCSS',
  grade: '11',
  subject: 'ss',
  topic: 'ap-government',
  locale: 'en',
  los: [
    {
      id: 'apgov.federalism',
      description: 'Analyze the constitutional division of power and the evolution of federalism.',
      standard: 'AP-GOV-CON-3',
    },
  ],
  prerequisites: ['ncss.911.civic.branches'],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Why federalism matters daily.',
      script: 'Marijuana legal in Colorado, illegal under federal law. Driving age 16 here, 18 there. Education funded by states; FBI federal. Federalism shapes which government decides what — and creates daily contradictions.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-powers-evolution',
      kind: 'concept',
      goal: 'Enumerated/implied/reserved/concurrent + evolution of federalism.',
      keyIdeas: [
        'FEDERALISM = power split between national (federal) and state governments. Constitution sets the divisions.',
        'ENUMERATED powers (Article I, Section 8): explicitly listed — coin money, declare war, regulate interstate commerce, provide for defense.',
        'IMPLIED powers: not listed but reasonably necessary for enumerated ones. From the NECESSARY AND PROPER CLAUSE. Example: Congress isn\'t explicitly empowered to charter banks, but McCulloch v. Maryland (1819) said implied — needed for currency power.',
        'RESERVED powers (10th Amendment): everything not federal goes to STATES. Education, marriage, driver\'s licenses, most criminal law.',
        'CONCURRENT powers: shared. Both can tax. Both can borrow. Both maintain courts.',
        'SUPREMACY CLAUSE (Article VI): when federal and state law conflict, federal wins.',
        'EVOLUTION OF FEDERALISM:',
        '  DUAL FEDERALISM ("layer cake", 1789-1933): clear separation.',
        '  COOPERATIVE FEDERALISM ("marble cake", 1933-1960s): New Deal blurred lines.',
        '  CREATIVE FEDERALISM (1960s-70s): expansive federal grants.',
        '  NEW FEDERALISM (1970s-): Republicans push power back to states. Block grants, devolution.',
        'KEY CASES: McCulloch v. Maryland (implied powers), Gibbons v. Ogden (interstate commerce broad), US v. Lopez (1995 — limit on commerce clause).',
      ],
      vocabulary: [
        { term: 'enumerated powers', definition: 'powers explicitly listed in the Constitution as belonging to the federal government.' },
        { term: 'reserved powers', definition: 'powers not granted to the federal government, reserved for states (10th Amendment).' },
        { term: 'supremacy clause', definition: 'constitutional rule that federal law trumps conflicting state law.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-marijuana',
      kind: 'worked_example',
      problem: 'Marijuana is legal in some states but illegal under federal law. How does federalism explain this contradiction?',
      steps: [
        'Federal Controlled Substances Act (1970) criminalizes marijuana nationwide.',
        'Many states have legalized recreational or medical use under STATE law.',
        'SUPREMACY CLAUSE: federal law trumps. Technically, all marijuana use violates federal law, even where state-legal.',
        'BUT: federal enforcement priorities have largely DEFERRED to state choices since the 2010s. Discretion, not law, allows the gap.',
        'This is "uneasy federalism" — clear constitutional answer (federal wins) coexists with practical state-level variance.',
        'Could be resolved by Congress legalizing federally OR a future administration enforcing strictly. Status quo: ambiguous.',
      ],
      answer: 'federal law prohibits, but federal enforcement defers to state choices in practice — uneasy coexistence',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Education is largely managed by states, not the federal government. Which constitutional provision puts it there?',
      expectedAnswer: '10th Amendment (reserved powers)',
      responseFormat: 'free',
      hints: [
        'Powers not federal go to states.',
        'Constitutional amendment specifies this.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-states-rights-pure',
      kind: 'misconception_check',
      question: 'Are states\' rights ABSOLUTE — can a state simply refuse to follow federal law?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating states as fully sovereign.',
          correctsTo: 'No — Supremacy Clause settles conflicts. NULLIFICATION attempts (declaring federal laws void) have been historically REJECTED — Civil War partly fought over this. States have powers, but federal law within the federal scope wins.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Federalism: power split between federal and state.',
        'Four power categories: enumerated, implied, reserved, concurrent.',
        'Supremacy Clause: federal law trumps conflicting state law.',
        'Federalism has evolved: dual → cooperative → creative → new federalism.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why might states be considered "laboratories of democracy"?',
      hint: 'States can experiment with policies before national adoption — RomneyCare in Massachusetts foreshadowed Obamacare. State minimum wages tested before federal increases. Federalism allows policy diversity and experimentation.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
