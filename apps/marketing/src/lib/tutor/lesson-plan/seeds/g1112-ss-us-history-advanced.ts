/**
 * Grades 11-12 Social Studies — US History (Advanced).
 *
 * Reconstruction → Gilded Age → Progressive Era → World Wars →
 * Civil Rights → modern era. Themes over events.
 */

import type { LessonPlan } from '../types';

export const SEED_G1112_SS_US_HISTORY_ADVANCED: LessonPlan = {
  id: 'evelyn.ss.11-12.us-history-advanced.v1',
  title: 'Advanced US History — themes from Reconstruction to today',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'social-studies',
  topic: 'us-history-advanced',
  locale: 'en',
  los: [
    {
      id: 'hs.us-hist.themes',
      description: 'Trace continuity and change in US history from 1865 to the present through three thematic lenses.',
      standard: 'CCSS-RH.11-12',
    },
  ],
  prerequisites: ['g6-8.us-history'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame US history as an argument about three unfinished questions.',
      script: 'US history isn\'t a list of dates. It\'s an ongoing argument about three big questions. WHO COUNTS as American? WHAT does the federal government do, vs the states? HOW does the country reconcile its founding ideals with its actual practice? Every era — Reconstruction, the Gilded Age, the New Deal, the Civil Rights Movement, today — answers those three questions in tension with the previous era.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-themes',
      kind: 'concept',
      goal: 'Three thematic lenses + 6 era checkpoints.',
      keyIdeas: [
        'THEME 1 — Citizenship + civil rights: 13th-15th amendments, women\'s suffrage 1920, Civil Rights Acts 1964/1965, ongoing.',
        'THEME 2 — Federal vs state power: Reconstruction expanded federal authority; Lochner-era courts pulled back; New Deal expanded again; modern Court has limited it again.',
        'THEME 3 — Industrial / economic change: Gilded Age wealth + labor unrest → Progressive reforms → Roaring 20s → Great Depression → New Deal → postwar boom → globalization.',
        'RECONSTRUCTION (1865-77): rebuilt South, attempted civil rights for freed people, ended in compromise.',
        'GILDED AGE (1870s-1900): industrial fortunes, immigration, Jim Crow, populist + labor movements.',
        'PROGRESSIVE ERA (1900-20): trust-busting, women\'s suffrage, prohibition, regulatory state.',
        'NEW DEAL (1933-39): Social Security, banking regulation, federal jobs programs.',
        'POSTWAR (1945-70s): GI Bill, suburbs, Cold War, Civil Rights Movement, Vietnam.',
        'MODERN (1970s-now): deregulation, tech revolution, polarization, demographic change.',
      ],
      vocabulary: [
        { term: 'Reconstruction', definition: 'the post-Civil War period (1865-77) of rebuilding the South and integrating freed people.' },
        { term: 'New Deal', definition: 'FDR-era programs (1933-39) expanding federal economic intervention.' },
        { term: 'Civil Rights Movement', definition: 'mid-20th-century campaign that won federal civil rights protections.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-pendulum',
      kind: 'worked_example',
      problem: 'Trace federal-vs-state power across three eras: Reconstruction, the New Deal, the modern era.',
      steps: [
        'RECONSTRUCTION: federal expansion (Reconstruction Acts, 13-14-15 amendments, federal troops enforce voting). Pulled back after Compromise of 1877.',
        'NEW DEAL: federal expansion in economic regulation (NLRB, SSA, FDIC). Court initially struck down some programs, then accommodated them after 1937.',
        'MODERN: contraction of federal power in some domains (devolution to states for welfare 1996, Court limits on commerce clause). Expansion in others (national security post-9/11).',
        'Pattern: power moves federalward in crises (war, depression), then drifts back when the crisis passes. NOT a one-way ratchet.',
      ],
      answer: 'Federal power expands during crises (Civil War, Depression, world wars) and partially contracts after.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why did Reconstruction\'s civil-rights gains largely reverse by 1900?',
      expectedAnswer: 'federal will faded (Compromise of 1877 withdrew troops), Supreme Court limited federal protections, and Southern states passed Jim Crow laws',
      responseFormat: 'free',
      hints: [
        'Three forces: political (1877 compromise), legal (Court rulings), social (state-level laws).',
        'Civil-rights laws on the books need enforcement; without it they\'re paper.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-progress-myth',
      kind: 'misconception_check',
      question: 'A student says: "US history is a story of steady progress toward equality." What\'s wrong?',
      commonErrors: [
        {
          answer: 'because we\'re always improving',
          misconception: 'Whig history — assuming linear forward motion.',
          correctsTo: 'Progress is REAL but not linear. Reconstruction\'s gains were rolled back by Jim Crow. New Deal\'s safety net has been partially dismantled. Civil-rights protections face ongoing litigation. The honest pattern: expansion in moments of mass mobilization (or crisis), retrenchment after, with each cycle ending closer to the original ideals than the previous one — but never automatic. Movements drive the gains; institutions defend or roll them back.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Three lenses: citizenship/rights, federal-vs-state power, economic change.',
        'Federal power expands in crises, partially retracts after.',
        'Civil rights advance through movements + federal action; rollback follows when mobilization fades.',
        'Each era is a response to the previous one.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
