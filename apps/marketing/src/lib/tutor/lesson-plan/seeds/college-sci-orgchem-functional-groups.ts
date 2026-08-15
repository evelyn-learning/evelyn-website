/**
 * College Organic Chemistry — Functional Groups and Nomenclature.
 */

import type { LessonPlan } from '../types';

export const SEED_COLLEGE_SCI_ORGCHEM_FUNCTIONAL_GROUPS: LessonPlan = {
  id: 'evelyn.college.sci.orgchem.functional-groups.v1',
  title: 'Organic Chemistry — Functional Groups and IUPAC Nomenclature',
  curriculum: 'CCSS',
  grade: 'college',
  subject: 'science',
  topic: 'organic-chemistry',
  locale: 'en',
  los: [
    {
      id: 'college.sci.orgchem.functional-groups',
      description: 'Identify the major functional groups (alkyl, alcohol, ether, amine, carbonyl variants) and apply IUPAC rules to name simple organic molecules.',
      standard: 'COLLEGE-ORGCHEM',
    },
  ],
  prerequisites: [],
  followUps: ['college.sci.orgchem.mechanisms'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Functional groups are the alphabet of organic chemistry — once you know them, every reaction story is just a sentence.',
      script: 'A molecule with an -OH is an alcohol. With C=O, it\'s a carbonyl (ketone, aldehyde, acid, ester, amide depending on neighbors). Functional groups predict reactivity, polarity, boiling point — almost everything. Today: the dozen you must know cold, plus IUPAC naming.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-functional-groups',
      kind: 'concept',
      goal: 'Major groups, characteristic features, IUPAC priorities, naming rules.',
      keyIdeas: [
        'KEY FUNCTIONAL GROUPS (memorise structure + suffix):',
        '  ALKANE (C-C, C-H): suffix -ane. Saturated, low reactivity.',
        '  ALKENE (C=C): suffix -ene. Adds across double bond.',
        '  ALKYNE (C≡C): suffix -yne.',
        '  ALCOHOL (C-OH): suffix -ol. Polar, hydrogen-bonds.',
        '  ETHER (C-O-C): named as "alkyl alkyl ether" or as substituent (-oxy).',
        '  AMINE (C-NH₂, C-NHR, C-NR₂): suffix -amine.',
        '  ALDEHYDE (CHO at end of chain): suffix -al.',
        '  KETONE (C=O between two C): suffix -one.',
        '  CARBOXYLIC ACID (COOH): suffix -oic acid. Strong polarity, acidic.',
        '  ESTER (COOR): suffix -oate.',
        '  AMIDE (CONR): suffix -amide.',
        '  HALIDE (C-X for X = F, Cl, Br, I): named as halo- prefix.',
        'IUPAC NAMING (4 steps):',
        '  1. Find the LONGEST CARBON CHAIN containing the highest-priority functional group.',
        '  2. NUMBER the chain to give the highest-priority group the LOWEST locant.',
        '  3. Name SUBSTITUENTS in alphabetical order with locants.',
        '  4. Combine: locants-prefixes-rootname-suffix.',
        'PRIORITY of functional groups for the parent name (highest first): carboxylic acid > ester > amide > nitrile > aldehyde > ketone > alcohol > amine > ether > alkene/alkyne > halide.',
      ],
      vocabulary: [
        { term: 'functional group', definition: 'a structural feature responsible for the characteristic reactions of a molecule.' },
        { term: 'IUPAC name', definition: 'a systematic name following International Union of Pure and Applied Chemistry rules — unambiguous and structure-encoding.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'Name the molecule: CH₃-CH(CH₃)-CH₂-CH₂-OH.',
      steps: [
        'Identify highest-priority group: -OH (alcohol). Suffix: -ol.',
        'Find longest chain containing -OH. Chain: 4 carbons (butanol root).',
        'Number from the end giving -OH the lowest locant: ...CH₂-CH₂-OH gives -OH at C1. Numbering: 1 (OH end), 2, 3, 4.',
        'Identify substituent: CH₃ branch on C3 (counting from OH end).',
        'Name: 3-methylbutan-1-ol (or "3-methyl-1-butanol" in older notation).',
      ],
      answer: '3-methylbutan-1-ol',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Identify the functional groups in vanillin: a 6-carbon ring with -OH, -OCH₃, and -CHO substituents on the ring.',
      expectedAnswer: 'Three functional groups: PHENOL (-OH on aromatic ring), ETHER (-OCH₃, methoxy), ALDEHYDE (-CHO). The aromatic ring itself is also a structural feature (benzene scaffold).',
      responseFormat: 'free',
      hints: [
        'Look at each substituent and match to a functional group.',
        '-OH on a benzene ring is specifically called a phenol.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-aldehyde-vs-ketone',
      kind: 'misconception_check',
      question: 'A student names CH₃-CO-CH₃ as "propan-1-one." Why is this wrong?',
      commonErrors: [
        {
          answer: 'Adds locant 1 to the carbonyl in a ketone',
          misconception: 'Forgetting that ketones have C=O between two carbons (not at the end).',
          correctsTo: 'CH₃-CO-CH₃ is acetone (propan-2-one). The C=O is on the MIDDLE carbon (C2), not at C1. C1 would mean CHO (aldehyde) — but then both ends have H, not CH₃. Always count carefully and confirm the locant matches the structure. The smallest locant for a ketone is always 2 (you need C on both sides of C=O).',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Memorise the dozen functional groups + suffixes.',
        'IUPAC: longest chain → number for lowest locant → substituents alphabetical.',
        'Priority: COOH > ester > amide > aldehyde > ketone > alcohol > amine.',
        'Aldehyde at end (locant 1); ketone in middle (locant ≥ 2).',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
