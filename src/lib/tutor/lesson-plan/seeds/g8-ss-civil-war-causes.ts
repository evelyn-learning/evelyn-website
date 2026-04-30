/**
 * G8 — Civil War causes (deep).
 *
 * Slavery as the central cause. Sectionalism, Missouri Compromise,
 * Compromise of 1850, Kansas-Nebraska Act, Dred Scott, John Brown,
 * Lincoln's election → secession.
 */

import type { LessonPlan } from '../types';

export const SEED_G8_SS_CIVIL_WAR_CAUSES: LessonPlan = {
  id: 'evelyn.g8.ss.us-history.civil-war-causes.v1',
  title: 'Causes of the Civil War',
  curriculum: 'NCSS',
  grade: '8',
  subject: 'ss',
  topic: 'us-history',
  locale: 'en',
  los: [
    {
      id: 'ncss.68.history.civil-war-causes',
      description: 'Identify and analyze the major causes of the American Civil War, with slavery as central.',
      standard: 'NCSS.D2.His.14.6-8',
    },
  ],
  prerequisites: ['ncss.68.history.westward-expansion'],
  followUps: ['ncss.68.history.civil-war'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'State plainly: slavery was the core cause.',
      script: 'Why did Americans go to war with each other? Some textbooks talk about "states\' rights" and "economics" — but the records of the time are clear. Confederate state legislatures named slavery directly in their secession documents. The war was about slavery.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-causes',
      kind: 'concept',
      goal: 'Six key flashpoints + secession + why slavery was central.',
      keyIdeas: [
        'CORE TENSION: SLAVERY. Northern states had abolished it; Southern economy DEPENDED on enslaved labor for cotton, tobacco, sugar.',
        'WESTWARD EXPANSION FORCED THE QUESTION: every new state had to be "free" or "slave". This kept blowing up Congress.',
        'MISSOURI COMPROMISE (1820): Missouri admitted as slave state, Maine as free. Drew a line at 36°30\'.',
        'COMPROMISE OF 1850: California free; Fugitive Slave Act forced Northerners to return escaped slaves.',
        'KANSAS-NEBRASKA ACT (1854): let territories decide for themselves ("popular sovereignty"). Triggered "BLEEDING KANSAS" — pro-slavery and anti-slavery settlers killed each other.',
        'DRED SCOTT v. SANFORD (1857): Supreme Court ruled enslaved people were PROPERTY, not citizens, even in free states. Inflamed abolitionists. One of the worst decisions in Court history.',
        'JOHN BROWN\'S RAID (1859): abolitionist tried to spark a slave uprising at Harpers Ferry. Failed; he was hanged. Made him a martyr in the North, a terrorist in the South.',
        'LINCOLN ELECTED 1860: opposed expansion of slavery. South interpreted his election as existential threat. By Feb 1861, 7 states had SECEDED to form the Confederacy. War began at Fort Sumter, April 1861.',
      ],
      vocabulary: [
        { term: 'secession', definition: 'a state withdrawing from the Union.' },
        { term: 'abolition', definition: 'the movement to end slavery.' },
        { term: 'sectionalism', definition: 'loyalty to a region (North vs South) over the whole nation.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-secession-docs',
      kind: 'worked_example',
      problem: 'Why do historians say the Civil War was "about slavery" rather than "states\' rights"?',
      steps: [
        'Look at what the SECEDING states themselves said. Mississippi\'s declaration of secession: "Our position is thoroughly identified with the institution of slavery — the greatest material interest of the world."',
        'Confederate Vice President Alexander Stephens\' "Cornerstone Speech" (1861): "Our new government is founded... upon the great truth that the negro is not equal to the white man; that slavery, subordination to the superior race, is his natural and normal condition."',
        '"States\' rights" was the FRAMEWORK, but the specific RIGHT they fought for was the right to maintain slavery.',
        'After the war, the "Lost Cause" myth recast the war as about abstract states\' rights or culture — softening the actual cause.',
        'Modern historians, looking at primary sources, are clear: slavery was central.',
      ],
      answer: 'Confederate states explicitly named slavery in their secession documents and Cornerstone Speech',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why did the Dred Scott decision (1857) infuriate abolitionists?',
      expectedAnswer: 'ruled Black people were not citizens and could not be free even in free states',
      responseFormat: 'free',
      hints: [
        'Court said enslaved people were property.',
        'Even moving to a free state didn\'t make them free.',
        'It denied their humanity legally.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-states-rights',
      kind: 'misconception_check',
      question: 'Was the Civil War "really" about states\' rights, with slavery just one of many issues?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Lost Cause framing.',
          correctsTo: 'The Confederate states themselves wrote that slavery was the central issue. "States\' rights" was a vehicle — the specific right they wanted protected was the right to enslave humans. Treating slavery as one issue among many flattens what they explicitly said.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Slavery was the central cause — explicit in secession documents.',
        'Westward expansion forced the question state-by-state.',
        'Compromises (1820, 1850) delayed war for decades but didn\'t solve it.',
        'Kansas-Nebraska Act, Dred Scott, John Brown raised tensions.',
        'Lincoln\'s 1860 election triggered secession; Fort Sumter started the war.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How did the Lincoln-Douglas Debates (1858) shape national attitudes about slavery?',
      hint: 'These Senate-race debates were widely reprinted in newspapers. Lincoln\'s moral arguments against slavery extension reached national audience — making him a serious presidential contender by 1860.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
