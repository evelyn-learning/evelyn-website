/**
 * Grades 3-5 Social Studies — Civil War Overview.
 */

import type { LessonPlan } from '../types';

export const SEED_G35_SS_CIVIL_WAR_OVERVIEW: LessonPlan = {
  id: 'evelyn.g35.ss.civil-war-overview.v1',
  title: 'Grades 3-5 SS — Civil War Overview',
  curriculum: 'CCSS',
  grade: '3-5',
  subject: 'ss',
  topic: 'g35-ss',
  locale: 'en',
  los: [
    {
      id: 'g35.ss.civil-war-overview',
      description: 'Identify the causes, key figures, and outcome of the American Civil War; explain how slavery was central.',
      standard: 'NCSS 3-5 Time, Continuity, Change',
    },
  ],
  prerequisites: ['g35.ss.westward-expansion'],
  followUps: ['g35.ss.citizenship-rights'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'The Civil War is the deadliest war in US history — Americans fighting Americans over the future of slavery and the nation.',
      script: 'From 1861 to 1865, the United States split apart. The North fought the South. About 620,000 soldiers died — more than in any other US war. The central question: would slavery continue, or would the country become whole and free? Today we drill the basics.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-civil-war',
      kind: 'concept',
      goal: 'Causes + sides + key figures + key events + outcome.',
      keyIdeas: [
        'CAUSE: SLAVERY was central. Northern states had abolished it; Southern states had built their economy on it. As new western territories joined, the question of slavery there split the country.',
        'SECTIONAL DIFFERENCES: NORTH had factories, free labour, anti-slavery views growing. SOUTH had plantations, used enslaved African people for labour, defended slavery.',
        'TRIGGER: 1860 Abraham Lincoln (anti-slavery expansion) elected president. Southern states began to SECEDE (leave the Union).',
        'CONFEDERATE STATES OF AMERICA: 11 Southern states formed a separate country. UNION: 23 Northern + border states stayed with the US.',
        'WAR BEGINS: April 1861, Confederate forces fired on Fort Sumter (a US fort in South Carolina).',
        'KEY FIGURES: Abraham Lincoln (Union president). Ulysses S. Grant (Union general). Robert E. Lee (Confederate general). Frederick Douglass (former enslaved man, leading abolitionist).',
        'EMANCIPATION PROCLAMATION (Jan 1, 1863): Lincoln declared enslaved people in Confederate states FREE. Reframed the war as a war against slavery.',
        'GETTYSBURG (July 1863): bloodiest battle of the war. Union victory was a turning point.',
        'SURRENDER: April 9, 1865. Lee surrendered to Grant at Appomattox Court House, Virginia.',
        'OUTCOMES: Union preserved. Slavery ABOLISHED by 13th Amendment (Dec 1865). 14th Amendment gave citizenship to formerly enslaved people. 15th gave Black men the right to vote.',
        'AFTERMATH: Lincoln assassinated (April 14, 1865) just days after the war ended. Reconstruction era began.',
      ],
      vocabulary: [
        { term: 'secede', definition: 'to formally withdraw from a country or political union.' },
        { term: 'abolition', definition: 'the ending of slavery.' },
        { term: 'Confederate', definition: 'relating to the 11 Southern states that left the US to form their own country during the Civil War.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-cause',
      kind: 'worked_example',
      problem: 'Why did Southern states secede after Lincoln\'s election in 1860?',
      steps: [
        'Lincoln was a Republican who opposed the expansion of slavery into new western territories.',
        'Southern states feared that without expansion, slavery would eventually be abolished entirely.',
        'They believed states had the right to leave the Union if they disagreed.',
        'Starting with South Carolina (Dec 1860), 11 states seceded by mid-1861.',
        'Lincoln refused to recognise secession. War broke out.',
      ],
      answer: 'Fear over the future of slavery + states\' rights claim → secession.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'What did the Emancipation Proclamation do?',
      expectedAnswer: 'Declared enslaved people in Confederate states to be free (Jan 1, 1863). It changed the war\'s purpose — making it explicitly a war to end slavery.',
      responseFormat: 'free',
      hints: [
        'Lincoln issued it during the war.',
        'It was about freeing people in the Confederacy.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-states-rights',
      kind: 'misconception_check',
      question: 'Some say "the Civil War was about states\' rights, not slavery." What\'s missing?',
      commonErrors: [
        {
          answer: 'War was about states\' rights only',
          misconception: 'Treating "states\' rights" as separate from slavery.',
          correctsTo: 'The "right" the Confederate states most wanted was the right to maintain SLAVERY. Confederate state declarations of secession explicitly named slavery as the central issue. Saying "states\' rights, not slavery" is misleading — the right at stake was the right to enslave people. Honest history names this directly.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '1861-1865 Civil War. Cause: slavery + sectional differences.',
        'Union (North) vs Confederacy (11 Southern states).',
        'Lincoln was Union president. Grant + Lee were generals.',
        'Emancipation Proclamation (1863). Gettysburg turning point.',
        'War ended April 1865. 13th Amendment ended slavery.',
        'Lincoln assassinated soon after.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is the 13th Amendment one of the most important in US history?',
      hint: 'It legally ABOLISHED slavery throughout the entire United States, not just in Confederate territory like the Emancipation Proclamation. Ratified December 1865, after the war ended. Together with the 14th (citizenship for former slaves) and 15th (Black male suffrage), they\'re called the "Reconstruction Amendments". The 13th made America a country without legal slavery — a 76-year struggle culminating in this single sentence.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
