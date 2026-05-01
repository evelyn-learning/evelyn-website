/**
 * NCLEX-NGN — Case Study item type and strategy.
 *
 * Each NGN exam has 3+ scored case studies (6 questions each = 18 scored
 * items). Case studies unfold across information tabs and step through
 * all 6 layers of the CJMM. This plan covers the workflow + the
 * within-case-study item types.
 */

import type { LessonPlan } from '../types';

export const SEED_NCLEX_NGN_CASE_STUDIES: LessonPlan = {
  id: 'evelyn.testprep.nclex.ngn-case-studies.v1',
  title: 'NCLEX-NGN Case Studies: Workflow and Item Types',
  curriculum: 'NCSBN',
  grade: 'nursing',
  subject: 'test-prep',
  topic: 'nclex-rn',
  locale: 'en',
  los: [
    {
      id: 'nclex.ngn-case-studies',
      description: 'Navigate the NGN case-study workflow, identify the in-case item types, and apply the Clinical Judgment Measurement Model question by question.',
      standard: 'NCLEX-NGN',
    },
  ],
  prerequisites: ['nclex.ngn-overview'],
  followUps: ['nclex.ngn-standalone-items'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'A case study is a single patient followed across 6 questions.',
      script: 'Forget thinking of NGN case studies as 6 unrelated questions. They\'re 6 questions about ONE patient, in order — the patient\'s arc unfolds as you go. Information you read in question 2 may not have been on screen in question 1, because new tabs open as the scenario progresses. The trap: rushing question 1 means you bring incomplete cues into question 2. The win: treat each question as the next clinical decision in a real shift.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-workflow',
      kind: 'concept',
      goal: 'Workflow + the in-case item types.',
      keyIdeas: [
        'CASE OPENS with a scenario and ONE info tab visible (often Nurse\'s Notes). As you advance through the 6 questions, additional tabs appear: History & Physical, Vital Signs, Lab Results, Diagnostic Results, Provider Orders, Medications.',
        'READ every tab BEFORE answering. New tabs often hold the cue that decides the answer.',
        'NO BACKTRACKING. Once you submit a question in a case study, you can\'t change it. So: don\'t hurry. Skim all tabs, decide, submit.',
        'EACH OF THE 6 QUESTIONS targets a different CJMM step (recognize → analyze → prioritize → solutions → action → evaluate). The question stem signals which step.',
        'IN-CASE ITEM TYPES include all of: Highlight (click words/phrases that matter), Matrix Multiple Choice (one selection per row), Matrix Multiple Response (multiple selections per row), Drop-Down Cloze (fill blanks from menus), Drag-and-Drop / Ranking (order by priority), Extended Multiple Response (5-10 options, partial credit), Single-Best-Answer.',
        'HIGHLIGHT items: tied to "Recognize Cues." Click ALL relevant signs / symptoms / vital sign abnormalities / orders. Don\'t over-click — wrong clicks may deduct.',
        'MATRIX items: rows are findings; columns are categories (e.g., "consistent with condition", "not relevant", "expected"). One choice per row. Strong test of "Analyze Cues."',
        'DROP-DOWN CLOZE: a sentence with blanks like "The nurse\'s priority is to assess the patient\'s [____] and administer [____]." Each blank is a menu of options. Tests "Generate Solutions" or "Take Action."',
        'RANKING: order interventions by priority. ABC + safety hierarchies apply. Tests "Prioritize Hypotheses" or "Take Action."',
        'STRATEGY: read the QUESTION STEM first to know which CJMM step is being measured, then return to the scenario tabs to find the relevant information.',
      ],
      vocabulary: [
        { term: 'case study', definition: 'NGN multi-question scenario covering one patient across 6 questions, one per CJMM step.' },
        { term: 'highlight item', definition: 'NGN item where the candidate clicks relevant words or phrases in a passage.' },
        { term: 'matrix item', definition: 'NGN item with rows of findings and columns of categories; candidate selects one (or more) cell(s) per row.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-case',
      kind: 'worked_example',
      problem: 'A case study opens: 64-year-old man, post-op day 1 from total hip arthroplasty. Nurse\'s Notes tab shows "patient reports new chest tightness, anxious, refusing to ambulate." Vitals tab now appears: HR 118, RR 26, BP 92/60, SpO₂ 89% on room air, T 37.6°C. Question 1 (Recognize Cues): Highlight findings of immediate concern.',
      steps: [
        'STEP 1 (CJMM): scan for ABNORMAL findings — those are the cues that matter for "Recognize Cues."',
        'Click: "chest tightness" (new symptom in post-op). "HR 118" (tachycardia). "RR 26" (tachypnea). "BP 92/60" (hypotension). "SpO₂ 89%" (hypoxia, well below 95% threshold).',
        'DON\'T click: temperature 37.6°C (mild but not the dominant concern). "anxious" (a symptom that\'s consistent but not actionable on its own).',
        'DON\'T over-click: avoid checking everything just to be safe — wrong clicks deduct on highlight items.',
        'PATTERN suggests: pulmonary embolism (a classic post-op orthopedic complication). But the QUESTION asks about cues, not diagnosis — save the diagnosis for question 2.',
      ],
      answer: 'Highlight: chest tightness, HR 118, RR 26, BP 92/60, SpO₂ 89%.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'You\'re on question 4 of a case study (CJMM step "Generate Solutions"). The patient has been diagnosed with DKA. The drop-down cloze reads: "The nurse anticipates administering [____] to correct the patient\'s [____]." What kind of options would you expect in the menus?',
      expectedAnswer: 'Menu 1: IV fluids and insulin (and possibly potassium). Menu 2: dehydration / hyperglycemia / acidosis / electrolyte imbalance. The drop-down is testing whether you can MATCH the intervention to the underlying problem.',
      responseFormat: 'free',
      hints: [
        '"Generate Solutions" = identify reasonable interventions for the top hypothesis.',
        'For DKA, the standard treatment triad is fluids, insulin, electrolyte replacement.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-skim',
      kind: 'misconception_check',
      question: 'For a case study, you should answer each question quickly to leave time for the harder standalone items later. True or false?',
      commonErrors: [
        {
          answer: 'true',
          misconception: 'Treating case studies like standalone items.',
          correctsTo: 'False. Case studies are 18 of your scored items — about 25-30% of a typical NCLEX-RN test. Rushing them costs more than rushing any other section. Each case study question carries the same weight as a standalone item, AND you can\'t go back. The candidates who succeed READ EVERY TAB on every question — even tabs that were already shown — because new information may have been added since the previous question. Treat case studies as your most expensive items.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Each case study = 6 questions on one patient, one per CJMM step.',
        'Tabs (Notes, Vitals, Labs, Diagnostics, Orders, Meds) appear progressively. Read EVERY tab before each answer.',
        'No backtracking inside a case study — submit only when sure.',
        'Highlight = recognize, matrix = analyze, drop-down/ranking = solutions/action.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does NCSBN structure case studies so the 6 questions match the 6 CJMM steps in order?',
      hint: 'It mirrors how nurses actually think on a shift: notice → interpret → prioritize → plan → act → reassess. Forcing the order ensures the test measures all six skills, not just the easy ones (recognition is most natural; evaluation is hardest). It also lets NCSBN report sub-scores for each cognitive skill — useful for nursing-program feedback to identify which skill students struggle with.',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
