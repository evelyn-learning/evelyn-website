/**
 * G8 — Social Studies: The American Civil War (1861-1865).
 *
 * Causes (slavery, states' rights, sectional differences),
 * Lincoln's election, secession, key battles (Gettysburg,
 * Antietam), Emancipation Proclamation, end at Appomattox,
 * Reconstruction overview.
 */

import type { LessonPlan } from '../types';

export const SEED_G8_SS_CIVIL_WAR: LessonPlan = {
  id: 'evelyn.g8.ss.civil-war.v1',
  title: 'The American Civil War',
  curriculum: 'state-standards',
  grade: '8',
  subject: 'social-studies',
  topic: 'us-history',
  locale: 'en',
  los: [
    {
      id: 'ss.g8.ushistory.civil-war',
      description: 'Explain the causes, key events, and outcomes of the Civil War.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the Civil War as the bloodiest US war.',
      script: 'More Americans died in the Civil War than in WWI, WWII, Korea, and Vietnam COMBINED. About 620,000 soldiers — roughly 2% of the population. The country tore itself apart over a question that should have been answered at the Founding: could a country built on "all men are created equal" continue to allow slavery?',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-civil-war',
      kind: 'concept',
      goal: 'Causes → secession → war → Emancipation → end → Reconstruction.',
      keyIdeas: [
        'CAUSES (decades-long buildup):',
        '  SLAVERY: the central issue. North was industrializing and increasingly anti-slavery (abolitionism). South\'s economy depended on slave labor for cotton.',
        '  SECTIONALISM: North vs South had different economies, cultures, politics.',
        '  STATES\' RIGHTS: Southern states argued they could leave the Union or override federal laws — but mostly to protect slavery.',
        '  COMPROMISES that delayed war: Missouri Compromise (1820), Compromise of 1850, Kansas-Nebraska Act (1854), Dred Scott decision (1857).',
        'TRIGGER: Abraham LINCOLN won the 1860 election as a REPUBLICAN (anti-slavery-expansion party). Southern states began SECEDING starting with South Carolina.',
        'CONFEDERACY: 11 southern states formed the Confederate States of America. Capital: Richmond, Virginia. President: Jefferson Davis.',
        'WAR (1861-1865):',
        '  Began at FORT SUMTER (April 1861), South Carolina.',
        '  ANTIETAM (Sept 1862): bloodiest single day; Union strategic victory; gave Lincoln the moral footing for the Emancipation Proclamation.',
        '  EMANCIPATION PROCLAMATION (Jan 1, 1863): freed enslaved people in Confederate states; transformed the war\'s meaning.',
        '  GETTYSBURG (July 1863): turning point; Lee\'s second northern invasion failed.',
        '  Lincoln\'s GETTYSBURG ADDRESS (Nov 1863) reframed the war as a struggle for "a new birth of freedom".',
        '  APPOMATTOX (April 1865): Confederate General Robert E. LEE surrendered to Union General Ulysses S. GRANT. War effectively ended.',
        '  Five days later, Lincoln was ASSASSINATED at Ford\'s Theatre.',
        'RESULTS:',
        '  Union preserved.',
        '  Slavery abolished by 13TH AMENDMENT (1865).',
        '  14TH AMENDMENT (1868) granted citizenship and equal protection.',
        '  15TH AMENDMENT (1870) gave Black men voting rights.',
        '  RECONSTRUCTION (1865-1877): rebuilding South + integrating freed people. Mixed results; ended with troop withdrawal and rise of Jim Crow segregation.',
      ],
      vocabulary: [
        { term: 'secession', definition: 'a state\'s withdrawal from the Union.' },
        { term: 'Confederacy', definition: 'the 11 southern states that seceded.' },
        { term: 'Emancipation Proclamation', definition: 'Lincoln\'s 1863 order freeing enslaved people in Confederate states.' },
        { term: 'Reconstruction', definition: 'the post-war effort to rebuild the South and integrate freed people.' },
      ],
      suggestedTools: ['show_timeline', 'show_map', 'show_concept_map'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-emancipation',
      kind: 'worked_example',
      problem: 'Why did Lincoln issue the Emancipation Proclamation in 1863, not earlier?',
      steps: [
        'STRATEGIC: he needed a Union battlefield victory before issuing it; otherwise it would look desperate. Antietam (Sept 1862) gave him that.',
        'POLITICAL: he had to manage BORDER STATES (slave states still in the Union — Delaware, Maryland, Kentucky, Missouri). Earlier emancipation might have pushed them to secede.',
        'CONSTITUTIONAL: Lincoln framed it as a war measure under his commander-in-chief powers. It freed enslaved people only in Confederate states (the rebellion zone), not in border states.',
        'TIMING + STRATEGY: announced after Antietam, took effect Jan 1, 1863.',
        'EFFECT: changed the war\'s purpose from preserving the Union to also abolishing slavery. Made foreign intervention harder (Europe wouldn\'t openly side with a pro-slavery cause).',
      ],
      answer: 'Strategic timing after Union victory; political care for border states.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Name the three "Reconstruction Amendments" and what each did.',
      expectedAnswer: '13th: abolished slavery. 14th: citizenship + equal protection. 15th: Black men\'s voting rights.',
      responseFormat: 'free',
      hints: [
        'Three consecutive amendments, all post-Civil War.',
        '13 abolished, 14 citizenship, 15 voting.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-states-rights',
      kind: 'misconception_check',
      question: 'Reza claims "the Civil War was fought over states\' rights, not slavery." What\'s the historical issue with that framing?',
      commonErrors: [
        {
          answer: 'true — it was about state autonomy',
          misconception: 'Repeating the post-war "Lost Cause" narrative without examining what RIGHTS the states were fighting for.',
          correctsTo: 'States\' rights TO DO WHAT? The Confederate states\' founding documents (especially the Confederate Constitution and SC, Mississippi, Texas declarations of secession) explicitly named the protection of slavery as the primary cause. "States\' rights" was the legal mechanism — slavery was the substance. Saying it was "states\' rights, not slavery" obscures what the states were claiming the right to do.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Causes: slavery (central), sectional differences, states\' rights as cover.',
        'Lincoln\'s 1860 election → Southern secession → war 1861.',
        'Key events: Antietam (1862), Emancipation Proclamation (1863), Gettysburg (1863), Appomattox (1865).',
        'Outcomes: Union preserved, slavery abolished, 13/14/15th Amendments.',
        'Reconstruction (1865-1877) tried to rebuild and integrate; ended with rise of Jim Crow.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why did Reconstruction end in 1877 and what came after?',
      hint: 'Compromise of 1877 ended federal troop deployment in the South. Without enforcement, Southern states passed JIM CROW laws — racial segregation and voter suppression — which lasted ~80 years until the Civil Rights Movement.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
