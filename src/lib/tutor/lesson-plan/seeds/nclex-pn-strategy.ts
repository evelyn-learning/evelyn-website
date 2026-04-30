/**
 * NCLEX-PN — exam strategy.
 */

import type { LessonPlan } from '../types';

export const SEED_NCLEX_PN_STRATEGY: LessonPlan = {
  id: 'evelyn.nclex.pn.strategy.v1',
  title: 'NCLEX-PN exam strategy',
  curriculum: 'NCSBN',
  grade: '12',
  subject: 'sci',
  topic: 'test-prep',
  locale: 'en',
  los: [
    {
      id: 'nclex-pn.strategy',
      description: 'Apply effective strategy to the NCLEX-PN: format, computer-adaptive testing, prioritization, ABCs, and the role of practical (vs registered) nursing scope.',
      standard: 'NCLEX-PN',
    },
  ],
  prerequisites: [],
  followUps: ['nclex.strategy'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'NCLEX-PN tests judgment within practical-nursing scope.',
      script: 'NCLEX-PN is the licensure exam for Licensed Practical / Vocational Nurses (LPNs / LVNs). It overlaps with the RN exam (NCLEX-RN) but tests judgment within a narrower scope of practice. Computer-adaptive — the test gets harder when you answer correctly, easier when you don\'t. Strategy is about KNOWING YOUR SCOPE and answering "what would the LPN do FIRST" — not what the RN, doctor, or aide would do.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-strategy',
      kind: 'concept',
      goal: 'Format, scope of practice, prioritization frameworks.',
      keyIdeas: [
        'FORMAT: computer-adaptive testing (CAT). Minimum 85 questions, maximum 205. Test ends when the algorithm is confident (95%) you\'re above or below the passing standard. Time limit 5 hours.',
        'CLIENT-NEEDS CATEGORIES (NCSBN test plan): Safe Care, Safety + Infection Control, Health Promotion + Maintenance, Psychosocial Integrity, Basic Care + Comfort, Pharmacological Therapies, Reduction of Risk Potential, Physiological Adaptation. Each weighted differently.',
        'LPN SCOPE: collect data (RN does the assessment), reinforce teaching, administer some meds (varies by state), monitor stable patients. NOT: initial assessment, IV-push high-risk meds, blood transfusion (varies), unstable patient management without RN supervision.',
        'ABC PRIORITY: AIRWAY → BREATHING → CIRCULATION. Always pick airway concerns first.',
        'MASLOW HIERARCHY: physiological needs (food, oxygen) before safety before love/belonging before esteem before self-actualization. Many "what would you address first" questions follow Maslow.',
        'SAFETY FIRST: when the question is about a hazard (fall risk, wandering patient, suicidal ideation), pick the SAFETY action.',
        'DELEGATION: LPNs delegate to NAs (nursing assistants), report to RNs. RNs delegate to LPNs. Know what tasks each level can do.',
        'PHARMACOLOGY: high-yield. Memorize common drugs, side effects, and patient teaching. Watch for: heparin → bleeding, lithium → thirst/tremor, MAOIs → tyramine, digoxin → toxicity signs (nausea, halos, bradycardia).',
        'NEVER pick options that involve: ignoring abuse / neglect, harming a patient, working outside scope, restraints without protocol.',
        'COMMON TRAP: "ASK for help" or "REPORT to RN" answers — they\'re right when the question describes something OUTSIDE LPN scope. Wrong when LPN can clearly handle it.',
      ],
      vocabulary: [
        { term: 'CAT', definition: 'Computer-Adaptive Testing — question difficulty adjusts based on your performance.' },
        { term: 'scope of practice', definition: 'the range of duties a licensed practitioner is legally allowed to perform.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-priority',
      kind: 'worked_example',
      problem: 'Four patients need attention: (A) a stable post-op patient at 4 hours; (B) a new admission with shortness of breath and SpO₂ 88%; (C) a patient asking for pain medication; (D) a patient awaiting discharge instructions. Who do you see first?',
      steps: [
        'Apply ABC priority: Airway → Breathing → Circulation.',
        '(B) shortness of breath + SpO₂ 88% = breathing problem. URGENT.',
        '(A) stable post-op = lower priority unless symptom develops.',
        '(C) pain medication = important but not life-threatening.',
        '(D) discharge instructions = lowest priority — patient is being discharged, not in crisis.',
        'ANSWER: (B) first. Then notify RN given new admission may need higher-level assessment.',
      ],
      answer: 'See (B) first — breathing compromise with low SpO₂ is the most urgent.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A patient admitted for pneumonia is now agitated and pulling at oxygen tubing. What is the FIRST nursing action?',
      expectedAnswer: 'Assess the patient — agitation may indicate hypoxia (low oxygen). Check vital signs and SpO₂ before assuming behavior is the issue. Restraints would be a last resort and only with order. Reorient if hypoxia ruled out.',
      responseFormat: 'free',
      hints: [
        'Don\'t jump to restraints. What might cause agitation in a pneumonia patient?',
        'Hypoxia → confusion / agitation. Assess oxygen status.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-call-doctor',
      kind: 'misconception_check',
      question: 'Is "call the doctor" usually the right NCLEX-PN answer when something seems wrong?',
      commonErrors: [
        {
          answer: 'yes, it\'s safe',
          misconception: 'Defaulting to "call the doctor" without intervening.',
          correctsTo: 'Often wrong. The NCLEX expects you to ASSESS or INTERVENE within your scope FIRST, then notify the RN or physician. Calling the doctor before checking vitals or attempting to address an issue you can fix appears to abdicate responsibility. The right pattern: assess → intervene if within scope → notify if outside scope or no improvement. "Call the doctor" is right when the situation is clearly beyond LPN scope or after initial intervention has failed.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'CAT exam: 85-205 questions; ends when 95% confident pass/fail.',
        'ABC priority + Maslow + safety frameworks.',
        'LPN scope is narrower than RN — know what you can/can\'t do.',
        'Assess + intervene first; "call doctor" usually after.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why do CAT-based exams sometimes feel like they\'re getting "harder" the more questions you answer correctly?',
      hint: 'CAT increases difficulty when you answer correctly to find your true ability ceiling. Feeling like every question is hard is OFTEN a GOOD sign — you\'re being pushed to the edge of your competence. The exam is calibrating you. Test-takers who report "every question was easy" sometimes did poorly because the algorithm decided early on they were below threshold and stopped pushing them.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
