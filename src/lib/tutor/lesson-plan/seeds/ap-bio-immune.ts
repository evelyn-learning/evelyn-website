/**
 * AP Bio — Immune System.
 *
 * Innate vs adaptive immunity, B and T cells, antibodies, vaccines.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_BIO_IMMUNE: LessonPlan = {
  id: 'evelyn.ap.bio.immune.v1',
  title: 'The Immune System',
  curriculum: 'CollegeBoard',
  grade: '11',
  subject: 'sci',
  topic: 'biology',
  locale: 'en',
  los: [
    {
      id: 'apbio.immune',
      description: 'Distinguish innate from adaptive immunity, explain B and T cell roles, antibody structure and function, and the basis for vaccination.',
      standard: 'AP-BIO-IST-2',
    },
  ],
  prerequisites: ['apbio.cells'],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Two layered defenses: a fast generalist and a slow specialist.',
      script: 'Your body fights pathogens with two systems. The first is fast and stupid: skin, stomach acid, white blood cells that engulf anything foreign. The second is slow but learns: it recognizes a specific virus, makes antibodies for it, and remembers it forever. The collaboration between speed and specificity is what keeps you alive against an ever-changing world of microbes.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-systems',
      kind: 'concept',
      goal: 'Innate vs adaptive immunity, B and T cells, antibodies, memory.',
      keyIdeas: [
        'INNATE IMMUNITY: present from birth, NON-SPECIFIC, FAST (minutes-hours). Barriers: skin, mucus, stomach acid. Cells: macrophages and neutrophils (engulf via phagocytosis), natural killer cells (kill virus-infected cells). Inflammation, fever.',
        'ADAPTIVE IMMUNITY: SPECIFIC, learns from exposure, takes days to mount. Two arms: B cells (humoral / antibody-mediated) and T cells (cell-mediated).',
        'ANTIGEN: a specific molecule (often on a pathogen surface) the immune system recognizes. Each B / T cell has a UNIQUE receptor for ONE antigen.',
        'B CELLS: when activated by their specific antigen, they DIVIDE and DIFFERENTIATE into PLASMA CELLS that pump out ANTIBODIES. Antibodies bind antigens, neutralizing them or marking them for destruction.',
        'ANTIBODY STRUCTURE: Y-shaped, with two antigen-binding sites at the tips. Specificity from the variable region; effector function from the constant region.',
        'T CELLS: HELPER T cells (CD4+) coordinate the response — they activate B cells and other T cells. CYTOTOXIC T cells (CD8+) kill infected cells directly. HIV destroys helper T cells, which is why it cripples the whole immune system.',
        'CLONAL SELECTION: only the lymphocyte that matches the antigen proliferates. Most lymphocytes you have today will never see their antigen. The few that do, multiply quickly.',
        'IMMUNOLOGICAL MEMORY: after first exposure, MEMORY B and T cells persist for years/decades. Second exposure → faster, stronger response.',
        'VACCINES: introduce a harmless form of a pathogen (or its antigens / mRNA encoding them) so memory cells form. Real exposure later is met by a strong, fast response.',
      ],
      vocabulary: [
        { term: 'antigen', definition: 'a molecular pattern recognized by an immune receptor.' },
        { term: 'antibody', definition: 'a Y-shaped protein produced by plasma cells that binds a specific antigen.' },
        { term: 'clonal selection', definition: 'the principle that only lymphocytes matching the antigen proliferate during an infection.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-vaccine',
      kind: 'worked_example',
      problem: 'Trace what happens in your immune system when you receive an mRNA vaccine for COVID-19.',
      steps: [
        'STEP 1: mRNA enters cells and is translated into the SARS-CoV-2 spike protein. Cells display the spike on their surface.',
        'STEP 2: Innate immunity notices something foreign — inflammation, recruiting macrophages and dendritic cells.',
        'STEP 3: Dendritic cells display the spike antigen to HELPER T cells in lymph nodes.',
        'STEP 4: T cells matching the antigen are CLONALLY SELECTED — they proliferate.',
        'STEP 5: B cells with matching receptors are activated by helper T cells, divide, and differentiate into plasma cells producing anti-spike antibodies.',
        'STEP 6: MEMORY B and T cells form. They persist after the initial response.',
        'STEP 7: Real SARS-CoV-2 exposure later → memory cells respond fast and strong, often clearing the virus before symptoms or transmission.',
        'KEY POINT: the vaccine doesn\'t cause disease — it presents the antigen safely so the adaptive system can train itself.',
      ],
      answer: 'mRNA → spike antigen → dendritic cells present → T and B cells activated → antibodies + memory cells. Future exposure triggers fast response.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A patient with HIV has very low CD4+ T cell counts. Why does this make them vulnerable to MANY infections, not just one?',
      expectedAnswer: 'CD4+ helper T cells coordinate the entire adaptive response — they activate B cells and cytotoxic T cells. Losing them disables the orchestrator, so neither antibodies nor cell-mediated killing happen well, and infections of all kinds proceed unchecked.',
      responseFormat: 'free',
      hints: [
        'What do helper T cells DO?',
        'If the orchestrator is gone, what happens to the rest of the orchestra?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-cold-virus',
      kind: 'misconception_check',
      question: 'If you had a cold last year and recovered, you should be permanently immune to all colds. True or false?',
      commonErrors: [
        {
          answer: 'true',
          misconception: 'Treating "cold" as one pathogen.',
          correctsTo: 'False — for two reasons. (1) "The common cold" is caused by 200+ different viruses (rhinoviruses, coronaviruses, etc.). Memory cells from one don\'t help with another. (2) Even within one virus species, surface proteins MUTATE rapidly, so old antibodies may no longer recognize the new strain. This is also why flu vaccines are reformulated yearly. Long-term immunity exists for measles or chickenpox because they barely mutate; rapidly mutating viruses evade memory.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Innate: fast, non-specific (barriers, phagocytes, inflammation). Adaptive: slow, specific (B + T cells).',
        'B cells → antibodies. T cells: helper coordinates, cytotoxic kills infected cells.',
        'Clonal selection: only matching lymphocytes proliferate.',
        'Memory cells = basis of vaccination and lifelong immunity (when antigens don\'t mutate fast).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is autoimmunity (where the immune system attacks the body\'s own cells) so dangerous and hard to treat?',
      hint: 'Adaptive immunity is supposed to distinguish self from non-self. When that fails (Type 1 diabetes, multiple sclerosis, lupus), the system attacks normal tissue using all its tools — antibodies, cytotoxic T cells. Treatment usually means suppressing the immune system, which leaves the patient vulnerable to actual pathogens. Selective therapies that block only the autoimmune attack are an active research area.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
