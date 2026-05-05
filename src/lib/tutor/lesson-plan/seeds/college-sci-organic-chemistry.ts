/**
 * College Intro — Organic Chemistry (overview).
 *
 * Functional groups, hybridization, mechanism arrows, Sn1/Sn2/E1/E2.
 */

import type { LessonPlan } from '../types';

export const SEED_COLLEGE_SCI_ORGANIC_CHEMISTRY: LessonPlan = {
  id: 'evelyn.college.organic-chemistry.v1',
  title: 'Organic chemistry — functional groups, hybridization, mechanisms',
  curriculum: 'CCSS',
  grade: 'college',
  subject: 'science',
  topic: 'organic-chemistry',
  locale: 'en',
  los: [
    {
      id: 'college.orgo',
      description: 'Identify functional groups, predict hybridization, and read curly-arrow mechanisms.',
      standard: 'COLLEGE-ORGO',
    },
  ],
  prerequisites: ['college.genchem'],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame orgo as pattern recognition — functional groups + arrow pushing.',
      script: 'Organic chemistry is famous for memorization, but the working knowledge is actually pattern-based. Recognize the FUNCTIONAL GROUPS. Recognize how electrons MOVE in mechanisms. Once these click, hundreds of reactions become a small set of moves repeated in different contexts.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-orgo',
      kind: 'concept',
      goal: 'Functional groups + hybridization + arrow pushing + key reaction types.',
      keyIdeas: [
        'FUNCTIONAL GROUPS: alkene (C=C), alkyne (C≡C), alcohol (-OH), amine (-NH₂), carboxylic acid (-COOH), ester, ether, ketone, aldehyde, halide.',
        'HYBRIDIZATION: sp³ (4 bonds, tetrahedral, 109.5°), sp² (3 bonds + π, trigonal, 120°), sp (2 bonds + 2π, linear, 180°). Determined by σ-bond count + lone pairs.',
        'ARROW PUSHING: curved arrows trace electron movement. Tail = source (lone pair / bond), head = destination. Two-electron arrows for most steps.',
        'NUCLEOPHILE: electron-rich, attacks. ELECTROPHILE: electron-poor, gets attacked. Mechanism is "nucleophile gives, electrophile takes".',
        'Sn2: backside attack on electrophilic carbon, leaving group leaves; one step, inversion of stereochemistry. Favored for primary substrates.',
        'Sn1: leaving group leaves first → carbocation intermediate → nucleophile attacks; two steps, racemization. Favored for tertiary substrates.',
        'E1/E2: elimination forms an alkene. E2 = concerted, anti-periplanar. E1 = via carbocation. Often competes with substitution.',
        'STEREOCHEMISTRY: chirality (mirror images), R/S, cis/trans, axial/equatorial in chair conformations.',
      ],
      vocabulary: [
        { term: 'functional group', definition: 'a structural feature that defines reactivity (e.g., -OH, -COOH).' },
        { term: 'nucleophile', definition: 'an electron-rich species that donates electrons in a reaction.' },
        { term: 'Sn2', definition: 'one-step substitution with backside attack and stereochemistry inversion.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-classify',
      kind: 'worked_example',
      problem: '(CH₃)₃C-Br + OH⁻. Will this go Sn1 or Sn2? Why?',
      steps: [
        'Substrate: (CH₃)₃C-Br = tert-butyl bromide. Tertiary carbon (3 methyls).',
        'Tertiary carbons block backside attack (steric hindrance) → Sn2 disfavored.',
        'Tertiary cations are STABLE (hyperconjugation + induction) → carbocation intermediate viable → Sn1 favored.',
        'Conclusion: Sn1, via tert-butyl carbocation, then OH⁻ attack.',
        'Outcome: tert-butanol (CH₃)₃C-OH, racemic if a chiral center existed (here it doesn\'t).',
      ],
      answer: 'Sn1 — tertiary substrate stabilizes the carbocation intermediate.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Identify the hybridization of each carbon in CH₃-CH=CH₂.',
      expectedAnswer: 'C1 (CH₃) sp³; C2 and C3 (the C=C carbons) both sp²',
      responseFormat: 'free',
      hints: [
        'Count σ bonds + lone pairs per carbon.',
        'Double bond = 1σ + 1π → sp² for both ends.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-curved-arrows',
      kind: 'misconception_check',
      question: 'A student draws a curved arrow from an H to an O. What\'s wrong?',
      commonErrors: [
        {
          answer: 'they look the same',
          misconception: 'Drawing arrows to track atoms instead of electrons.',
          correctsTo: 'Curved arrows track ELECTRON movement, not atom movement. Tail at source of electrons (lone pair or bond), head at destination. An H atom doesn\'t move on its own — it\'s the C-H bond\'s electrons (or the H\'s nucleus dragged by the bond shifting). Arrow conventions are strict; misuse confuses the reader and the student.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Functional groups define reactivity.',
        'Hybridization: count σ-bonds + lone pairs.',
        'Arrows track electrons (tail = source, head = destination).',
        'Sn2 = primary, concerted, inversion. Sn1 = tertiary, two-step, racemic.',
        'Elimination (E1/E2) often competes with substitution.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
