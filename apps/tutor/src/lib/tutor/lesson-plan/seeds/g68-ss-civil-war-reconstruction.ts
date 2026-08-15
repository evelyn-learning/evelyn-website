/**
 * Grades 6-8 Social Studies — Civil War & Reconstruction.
 */

import type { LessonPlan } from '../types';

export const SEED_G68_SS_CIVIL_WAR_RECONSTRUCTION: LessonPlan = {
  id: 'evelyn.g68.ss.civil-war-reconstruction.v1',
  title: 'Grades 6-8 SS — Civil War & Reconstruction',
  curriculum: 'CCSS',
  grade: '6-8',
  subject: 'ss',
  topic: 'g68-ss',
  locale: 'en',
  los: [
    {
      id: 'g68.ss.civil-war-reconstruction',
      description: 'Analyse causes and outcomes of the US Civil War; evaluate the successes and failures of Reconstruction.',
      standard: 'NCSS 6-8 Time, Continuity, Change',
    },
  ],
  prerequisites: ['g68.ss.constitution-bill-rights'],
  followUps: ['g68.ss.imperialism-wwi'],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Reconstruction tried to rebuild the South AND extend rights to formerly enslaved people. It half-succeeded, then was undone.',
      script: 'The Civil War ended slavery. But the questions of WHO is a citizen, WHO can vote, and HOW the South would rejoin the Union remained. Reconstruction tried to answer them. The story of its successes and reversals shapes US politics still.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-civil-war-reconstruction',
      kind: 'concept',
      goal: 'Civil War causes/outcome + Reconstruction era + legacy.',
      keyIdeas: [
        'CIVIL WAR CAUSES: slavery (central), states\' rights as defense of slavery, sectional economic differences, election of Lincoln (1860).',
        'WAR DATES: 1861-1865. Union (North) vs Confederacy (11 Southern states).',
        'KEY EVENTS: Fort Sumter (start), Emancipation Proclamation (1863), Gettysburg (turning point), Appomattox (Lee\'s surrender 1865).',
        'IMMEDIATE RESULTS: Union preserved. Slavery abolished by 13th Amendment (1865). 600,000+ dead. South devastated.',
        'LINCOLN ASSASSINATED April 14, 1865 — just days after war\'s end. Andrew Johnson became president.',
        'RECONSTRUCTION (1865-1877): the period of rebuilding the South and integrating formerly enslaved people as citizens.',
        'RECONSTRUCTION AMENDMENTS:',
        '  13th (1865): abolished slavery.',
        '  14th (1868): granted citizenship to formerly enslaved people, equal protection under law.',
        '  15th (1870): gave Black men the right to vote.',
        'PROGRESS: Black men elected to Congress; freedmen built schools, churches; sharecropping replaced slavery (often abusively but legally free).',
        'BACKLASH: Ku Klux Klan founded (1866), used violence against Black citizens. Southern states passed BLACK CODES restricting Black freedoms.',
        'COMPROMISE OF 1877: ended Reconstruction. Federal troops withdrew from South.',
        'JIM CROW LAWS followed: legal segregation, denied Black voting rights through poll taxes, literacy tests, intimidation.',
        'PLESSY v. FERGUSON (1896): Supreme Court ruled "separate but equal" was constitutional — locking in segregation for 60+ years.',
        'LEGACY: Reconstruction\'s gains were largely rolled back by 1900. Full civil rights wouldn\'t come until the 1960s.',
      ],
      vocabulary: [
        { term: 'Reconstruction', definition: 'the period 1865-1877 of rebuilding the South after the Civil War and integrating formerly enslaved people as citizens.' },
        { term: 'Jim Crow', definition: 'state and local laws enforcing racial segregation in the South after Reconstruction ended.' },
        { term: 'sharecropping', definition: 'a labour system in which farmers worked land owned by others in exchange for a share of the crop — often trapping Black families in poverty.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-amendment',
      kind: 'worked_example',
      problem: 'Compare what the 13th, 14th, and 15th Amendments each did.',
      steps: [
        '13th (1865): ABOLISHED slavery throughout the United States.',
        '14th (1868): granted CITIZENSHIP to all people born in the US (including formerly enslaved). EQUAL PROTECTION clause.',
        '15th (1870): gave BLACK MEN the right to VOTE (women still excluded).',
        'Together: ended slavery → made formerly enslaved people citizens → gave them voting rights.',
        'BUT: enforcement collapsed by 1877; Black voting suppressed for nearly a century.',
      ],
      answer: '13: abolish. 14: citizen + equal protection. 15: vote (Black men).',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why did Reconstruction END in 1877?',
      expectedAnswer: 'The Compromise of 1877 — to settle the disputed 1876 presidential election, Republicans agreed to withdraw federal troops from the South in exchange for the presidency. Without troops, Reconstruction\'s protections collapsed and Southern states reimposed white supremacy.',
      responseFormat: 'free',
      hints: [
        'Hint: it ended through political bargain, not natural completion.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-clean-end',
      kind: 'misconception_check',
      question: 'A student says "the Civil War ended slavery and gave Black Americans equal rights." Why is this incomplete?',
      commonErrors: [
        {
          answer: 'Civil War = full equality',
          misconception: 'Treating constitutional change as social reality.',
          correctsTo: 'The Civil War ABOLISHED slavery, and the 14th and 15th Amendments granted citizenship and Black male suffrage on paper. But by 1877, Reconstruction had ended, federal troops withdrew, and Southern states imposed Jim Crow. Black voting was suppressed for a century. Lynching, segregation, and discrimination continued. Constitutional rights existed; equal practice did not. Full civil rights required the 1960s movement. The two are different things.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Civil War 1861-65: ended slavery, preserved Union.',
        'Reconstruction 1865-77: 13th/14th/15th Amendments.',
        'Progress: Black voting, schools, congressional representation.',
        'Backlash: KKK, Black Codes, Compromise of 1877.',
        'Jim Crow + Plessy v Ferguson (1896): segregation legal.',
        'Constitutional rights ≠ equal practice.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is Reconstruction sometimes called "America\'s second founding"?',
      hint: 'It promised to remake the country — fully extending citizenship and rights to all Americans, regardless of race. The 14th Amendment alone added concepts (birthright citizenship, equal protection, due process) that still shape every constitutional case today. Although Reconstruction\'s promises were betrayed in practice, the constitutional architecture remained — and was the legal foundation of the 1960s civil rights movement. The "second founding" set ideals the country has been working to realise ever since.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
