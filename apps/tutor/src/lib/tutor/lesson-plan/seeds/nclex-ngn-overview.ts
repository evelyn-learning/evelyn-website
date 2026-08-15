/**
 * NCLEX-NGN — Overview, exam structure, and the Clinical Judgment
 * Measurement Model (CJMM).
 *
 * Aligned with the Next Generation NCLEX format that launched April 1,
 * 2023 (with a 2026 test-plan refresh effective April 1, 2026). Applies
 * to both NCLEX-RN and NCLEX-PN; RN/PN scope differences flagged where
 * relevant. Cross-referenced with NCSBN's NGN page, UWorld's case-study
 * guide, and Kaplan's NGN strategy briefs.
 */

import type { LessonPlan } from '../types';

export const SEED_NCLEX_NGN_OVERVIEW: LessonPlan = {
  id: 'evelyn.testprep.nclex.ngn-overview.v1',
  title: 'NCLEX-NGN: Format, Structure, and the Clinical Judgment Measurement Model',
  curriculum: 'NCSBN',
  grade: 'nursing',
  subject: 'test-prep',
  topic: 'nclex-rn',
  locale: 'en',
  los: [
    {
      id: 'nclex.ngn-overview',
      description: 'Describe the Next Generation NCLEX format, the Clinical Judgment Measurement Model (CJMM), and the new item types introduced in 2023.',
      standard: 'NCLEX-NGN',
    },
  ],
  prerequisites: [],
  followUps: ['nclex.ngn-case-studies', 'nclex.ngn-standalone-items'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'NGN tests clinical thinking, not memorization.',
      script: 'The Next Generation NCLEX, launched April 2023, isn\'t just the old test with new question shapes. NCSBN rebuilt it around how nurses actually think at the bedside — recognize what matters, decide what to do first, take action, evaluate the result. The new item types (case studies, bowtie, matrix, highlight, drag-and-drop) are designed to score that thinking more directly than the old four-choice multiple choice could. If you prepare for the FORMAT but not the CLINICAL JUDGMENT model behind it, you\'ll struggle on the case studies.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-format',
      kind: 'concept',
      goal: 'Exam structure, item mix, scoring rules.',
      keyIdeas: [
        'COMPUTER ADAPTIVE TESTING (CAT): question difficulty adjusts to your performance. Test ends when the algorithm is 95% confident you\'re above or below the passing standard, OR you hit the question cap, OR time runs out.',
        'NCLEX-RN length: 75-145 questions (was 75-265 pre-2023). Up to 5 hours.',
        'NCLEX-PN length: 85-150 questions. Up to 5 hours.',
        'EVERY candidate sees AT LEAST 3 SCORED CASE STUDIES. Each case study has 6 questions = 18 case-study scored items minimum. Plus standalone items mixed in.',
        'PRETEST ITEMS: 15 unscored items embedded throughout. You won\'t know which.',
        'NEW ITEM TYPES (in addition to the classic 4-option multiple choice): Case Study (6 questions, sequential), Bowtie (standalone, 5 fill-ins), Highlight (click relevant phrases in a passage), Matrix Multiple Choice / Multiple Response (rows of options, pick one or several per row), Drop-Down Cloze (fill in blanks from menus), Drag-and-Drop / Ranking, Extended Multiple Response (more than 4 options, partial credit).',
        'PARTIAL CREDIT scoring on most NGN items (Extended Multi-Response, Matrix, etc.). Old "all or nothing" SATA is mostly gone. Some items still use 0/1 (zero-one) scoring; bowtie uses dyad scoring (pairs).',
        'WITHIN A CASE STUDY: once you submit a question, you CANNOT GO BACK to it. The scenario unfolds tab-by-tab (Nurse\'s Notes, Vitals, Labs, Diagnostics, History) — read each new tab carefully before answering.',
        'PASSING STANDARD: not a percentage of right answers — it\'s the CAT algorithm\'s confidence interval crossing the passing logit. Long tests usually mean borderline; short tests mean clear pass or clear fail.',
      ],
      vocabulary: [
        { term: 'CAT', definition: 'Computer-Adaptive Testing — difficulty adjusts as you go, test ends when ability is determined within 95% confidence.' },
        { term: 'CJMM', definition: 'Clinical Judgment Measurement Model — the 6-step framework NCSBN uses to assess clinical judgment.' },
        { term: 'partial credit', definition: 'NGN scoring where you earn points for each correct selection on items with multiple correct answers.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'concept-cjmm',
      kind: 'concept',
      goal: 'The 6-step Clinical Judgment Measurement Model.',
      keyIdeas: [
        'STEP 1 — RECOGNIZE CUES. Identify the relevant findings from the patient data. NOT every vital sign matters; pick the ones pointing to a problem. Highlight items often test this step.',
        'STEP 2 — ANALYZE CUES. Connect cues to a clinical pattern. "Why does this matter? What does it suggest?" Matrix items asking which findings are consistent with a condition test this.',
        'STEP 3 — PRIORITIZE HYPOTHESES. With multiple possibilities, rank them by URGENCY (life-threatening first), LIKELIHOOD, and RISK. Bowtie\'s center node tests this.',
        'STEP 4 — GENERATE SOLUTIONS. Identify reasonable interventions for the top hypothesis. Multiple-response items often test this — what could you do?',
        'STEP 5 — TAKE ACTION. Choose the SPECIFIC action to perform now. Single-best-answer or matrix items.',
        'STEP 6 — EVALUATE OUTCOMES. Did the intervention work? Compare observed to expected. Matrix or drop-down items showing post-intervention findings.',
        'EVERY CASE STUDY HAS 6 QUESTIONS, ONE PER STEP. The case study is structured so the questions flow through steps 1 → 6 across the scenario\'s arc.',
        'PRIORITIZATION FRAMEWORKS still apply: ABC (Airway > Breathing > Circulation), Maslow\'s hierarchy (physiological > safety > psychosocial), Acute > Chronic, Unstable > Stable. NGN questions weave these in.',
      ],
      vocabulary: [
        { term: 'recognize cues', definition: 'CJMM step 1 — identifying which patient data is relevant to the situation.' },
        { term: 'prioritize hypotheses', definition: 'CJMM step 3 — ranking possible diagnoses or problems by urgency and likelihood.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A case study shows a post-op patient with sudden chest pain, SpO₂ dropping from 98% to 89%, anxious affect, and tachypnea. Which CJMM step is the question "What complication is most likely?" testing?',
      expectedAnswer: 'Step 3, Prioritize Hypotheses (the candidate must rank likely complications — pulmonary embolism is most likely, but the question requires ranking against pneumothorax, MI, etc.).',
      responseFormat: 'free',
      hints: [
        '"What complication is most likely" is asking you to RANK possibilities.',
        'Map to one of the 6 CJMM steps.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-sata-old',
      kind: 'misconception_check',
      question: 'On NGN extended multi-response items, you have to pick EVERY correct answer to get any credit, just like the old SATA format. True or false?',
      commonErrors: [
        {
          answer: 'true',
          misconception: 'Carrying over the old SATA all-or-nothing scoring.',
          correctsTo: 'False. NGN introduced PARTIAL CREDIT on most multi-response items. On extended multi-response, you earn one point per correct selection MINUS one point per incorrect selection (with the score floored at zero — you can\'t lose points overall). On matrix items it depends on the variant: some use partial credit, some use 0/1 zero-one scoring on each row. The old "miss one, lose all" SATA rule is mostly retired. CONSEQUENCE: when you\'re unsure, only mark options you\'re confident about — don\'t guess broadly, since wrong picks deduct.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'NGN launched Apr 2023. RN: 75-145 questions. PN: 85-150. CAT-based.',
        'Every test: 3+ scored case studies × 6 questions = 18 case-study items.',
        'CJMM 6 steps: recognize cues → analyze → prioritize → generate solutions → take action → evaluate.',
        'Partial credit on most NGN items. Inside a case study, once submitted you CAN\'T go back.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why did NCSBN move from 4-option multiple choice to multi-format NGN items?',
      hint: 'Research showed that traditional MCQs measured factual knowledge well but underrepresented CLINICAL JUDGMENT — the bedside skill that actually predicts safe practice. New nurse-related medication errors were rising. Highlight, matrix, drop-down, and case-study items more directly test recognize-analyze-decide-act sequences. The format shift is a measurement validity push, not a difficulty push.',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
