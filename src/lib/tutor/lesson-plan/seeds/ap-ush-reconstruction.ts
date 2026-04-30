/**
 * AP US History — Reconstruction (1865-1877).
 *
 * After the Civil War, the South was rebuilt — and Black Americans
 * briefly gained citizenship and voting rights, then lost them.
 * Critical era for understanding modern racial politics.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_USH_RECONSTRUCTION: LessonPlan = {
  id: 'evelyn.ap.ush.reconstruction.v1',
  title: 'Reconstruction (1865-1877)',
  curriculum: 'NCSS',
  grade: '11',
  subject: 'ss',
  topic: 'us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.reconstruction',
      description: 'Analyze the political, social, and economic changes during Reconstruction and its eventual reversal.',
      standard: 'AP-USH-MIG-2',
    },
  ],
  prerequisites: ['apush.civil-war'],
  followUps: ['apush.gilded-age'],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Establish stakes: the most consequential failure of US history.',
      script: 'In 1870, Black Americans were US citizens, voting, holding office in Congress. By 1900, they were second-class citizens, terrorized, and disenfranchised across the South. How did the country lose that ground? That\'s the tragedy of Reconstruction.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-three-phases',
      kind: 'concept',
      goal: 'Three phases of Reconstruction + the three "Reconstruction Amendments" + how it ended.',
      keyIdeas: [
        'PRESIDENTIAL RECONSTRUCTION (1865-1867) — Lincoln\'s lenient plan, continued by Andrew Johnson. Allowed former Confederates back into power. Southern states passed BLACK CODES — laws restricting freedmen\'s rights.',
        'CONGRESSIONAL / RADICAL RECONSTRUCTION (1867-1877) — Republicans in Congress took over. Divided South into military districts. Required ratification of 14th Amendment for readmission. Black men voted in large numbers; Black candidates won office.',
        'THREE RECONSTRUCTION AMENDMENTS: 13th (1865) abolished slavery. 14th (1868) granted citizenship and equal protection. 15th (1870) granted Black men the right to vote.',
        'FREEDMEN\'S BUREAU (1865): federal agency to help formerly enslaved people — schools, food, legal aid, contract negotiation. Underfunded; ended 1872.',
        'BACKLASH: KKK and other terror groups formed. Lynchings, voter intimidation, attacks on Black schools and churches.',
        'COMPROMISE OF 1877: contested election (Hayes vs Tilden). Republicans got the presidency in exchange for WITHDRAWING federal troops from the South. Reconstruction ended.',
        'JIM CROW: with troops gone, Southern states passed segregation laws and disenfranchisement (poll taxes, literacy tests, grandfather clauses). Plessy v. Ferguson (1896) made "separate but equal" legal. Black political power crushed for ~80 years.',
      ],
      vocabulary: [
        { term: 'Reconstruction', definition: 'the post-Civil War period (1865-1877) of rebuilding the South.' },
        { term: 'Black Codes', definition: 'Southern state laws passed after the Civil War to restrict freedmen\'s rights.' },
        { term: 'Jim Crow', definition: 'system of state laws enforcing racial segregation, especially in the South.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-14th',
      kind: 'worked_example',
      problem: 'Why is the 14th Amendment (1868) considered one of the most important in US history?',
      steps: [
        'BIRTHRIGHT CITIZENSHIP: anyone born on US soil is a citizen — a direct rebuke to the Dred Scott decision (which said Black people couldn\'t be citizens).',
        'EQUAL PROTECTION clause: states cannot deny "equal protection of the laws" to any person.',
        'DUE PROCESS clause: states cannot deprive any person of "life, liberty, or property without due process".',
        'INCORPORATION: over the 20th century, the Supreme Court used the 14th Amendment to APPLY most of the Bill of Rights to the states (not just the federal government).',
        'IMPACT: the 14th has been the basis for Brown v. Board, Roe v. Wade, Obergefell v. Hodges, and dozens of major civil rights rulings.',
        'It transformed the Constitution from limiting federal power to also LIMITING STATE POWER over individuals.',
      ],
      answer: 'birthright citizenship + equal protection + applies Bill of Rights to states',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'How did the Compromise of 1877 effectively END Reconstruction?',
      expectedAnswer: 'federal troops withdrawn from the South in exchange for Hayes presidency',
      responseFormat: 'free',
      hints: [
        'A contested election (Hayes vs Tilden) was decided by a deal.',
        'Republicans got Hayes; Democrats got something major in return.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-reconstruction-failed-fully',
      kind: 'misconception_check',
      question: 'Did Reconstruction completely fail to achieve any lasting change?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating Reconstruction as a total failure.',
          correctsTo: 'Mixed — it was REVERSED politically (Jim Crow lasted ~80 years), but the THREE AMENDMENTS remained, even when ignored. They became the legal foundation for the 20th-century civil rights movement. The 14th\'s equal-protection clause is among the most-cited in modern law.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Three phases: presidential (lenient) → radical (military, expanded rights) → withdrawal (1877).',
        '13th, 14th, 15th amendments: ended slavery, citizenship/equal protection, voting rights.',
        'KKK terror + Compromise of 1877 → end of Reconstruction.',
        'Jim Crow era followed; 14th amendment later became foundation for civil rights movement.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Connect Reconstruction\'s reversal to events you can identify in the 20th century.',
      hint: 'Plessy v. Ferguson 1896. Brown v. Board 1954 (overturned Plessy). Civil Rights Act 1964. Voting Rights Act 1965. The 14th amendment was the legal lever for all of these.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
