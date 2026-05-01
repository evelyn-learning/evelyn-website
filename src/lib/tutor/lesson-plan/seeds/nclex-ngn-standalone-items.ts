/**
 * NCLEX-NGN — Standalone NGN item types.
 *
 * Bowtie, extended multiple response, extended drag-and-drop. These appear
 * outside the case-study format and use distinctive partial-credit rules.
 */

import type { LessonPlan } from '../types';

export const SEED_NCLEX_NGN_STANDALONE_ITEMS: LessonPlan = {
  id: 'evelyn.testprep.nclex.ngn-standalone.v1',
  title: 'NCLEX-NGN Standalone Items: Bowtie, Extended Multi-Response, Drag-and-Drop',
  curriculum: 'NCSBN',
  grade: 'nursing',
  subject: 'test-prep',
  topic: 'nclex-rn',
  locale: 'en',
  los: [
    {
      id: 'nclex.ngn-standalone',
      description: 'Recognize and answer NGN standalone item types: bowtie, extended multiple response, and extended drag-and-drop, applying their partial-credit scoring rules.',
      standard: 'NCLEX-NGN',
    },
  ],
  prerequisites: ['nclex.ngn-overview'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Standalone NGN items have unique scoring rules that change strategy.',
      script: 'Standalone NGN items (outside case studies) include the famous "bowtie" — a five-blank diagram that looks like an exam-question constellation diagram — plus extended multi-response and drag-and-drop. They use partial credit, but the credit math is different per item type. Knowing the scoring rule changes how aggressively you select. Pick too few and you leave points on the table; pick too many and you lose points to penalties.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-bowtie',
      kind: 'concept',
      goal: 'The bowtie item: structure and scoring.',
      keyIdeas: [
        'BOWTIE shape: a center node (the patient\'s most likely problem / condition) with two branches on each side — actions to take (left) and parameters to monitor (right). Five blanks total: 1 center + 2 actions + 2 parameters.',
        'WORKFLOW: identify the center FIRST (the main diagnosis or priority problem). Once the center is right, the rest cascades — actions and parameters that fit that center.',
        'BANK of options: 8-12 cards on screen. You drag the right ones into the 5 blanks.',
        'SCORING: dyad scoring. The center is worth 1 point on its own. Each side (actions / parameters) is scored as a PAIR — both correct picks needed to earn that side\'s points. Some bowtie variants give partial credit per blank instead.',
        'STRATEGY: don\'t leave blanks empty. Even a guessed action or parameter, if related to the condition you\'ve picked, has a fair chance of being correct.',
      ],
      vocabulary: [
        { term: 'bowtie', definition: 'NGN item shaped like a bowtie: center is the priority problem; actions on one side, parameters to monitor on the other.' },
        { term: 'dyad scoring', definition: 'a scoring rule where two related answers must both be correct to earn the points for that pair.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-extended-mr',
      kind: 'concept',
      goal: 'Extended Multiple Response and Drag-and-Drop scoring.',
      keyIdeas: [
        'EXTENDED MULTIPLE RESPONSE: a multiple-response item with MORE than the classic 4 options — typically 5-10. You select all that apply.',
        'PARTIAL CREDIT scoring on most extended multi-response: +1 per correct selection, −1 per incorrect selection, MIN score = 0 (can\'t go negative on the item). Unselected options that should have been selected don\'t deduct (they just don\'t earn).',
        'STRATEGY: only select options you\'re CONFIDENT are correct. Don\'t broad-mark. Three confident correct picks > five attempted picks where two are wrong.',
        'EXTENDED DRAG-AND-DROP: similar to extended multi-response but candidates drag option cards into a target zone. Can be ordered (ranking) or unordered (set membership). Partial credit per correct placement.',
        'RANKING / DRAG-TO-ORDER: place actions in priority sequence. Use ABC, Maslow, safety frameworks. Score is partial — getting some pairs in right order earns credit even if the full ranking isn\'t perfect.',
        'COMMON TRAP: extended multi-response often INCLUDES INCORRECT-LOOKING distractors that resemble correct answers superficially (e.g., wrong-route medication, similar-sounding lab name). Read each option fully before selecting.',
      ],
      vocabulary: [
        { term: 'extended multiple response', definition: 'NGN multi-response item with more than 4 options; uses +1/−1 partial credit floored at zero.' },
        { term: 'partial credit (NGN)', definition: 'scoring that awards points for each correct selection independently, sometimes with deductions for incorrect ones.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-bowtie',
      kind: 'worked_example',
      problem: 'A bowtie item shows a patient with crushing chest pain radiating to the left arm, ST-segment elevation on ECG, troponin 8 ng/mL (elevated), diaphoresis. Bank includes: STEMI, pulmonary embolism, GERD, anxiety, give aspirin 325 mg, give acetaminophen, give nitroglycerin SL, give albuterol nebulizer, monitor cardiac rhythm, monitor serial troponins, monitor blood glucose, monitor urine output. Fill the 5 blanks.',
      steps: [
        'CENTER (priority condition): STEMI (ST-elevation MI). All four cues — chest pain radiating to arm, ST elevation, elevated troponin, diaphoresis — point to acute MI.',
        'NOT pulmonary embolism (no SOB / pleuritic pain emphasized). Not GERD (ECG changes + troponin rule it out). Not anxiety (objective signs).',
        'ACTIONS (left side): aspirin 325 mg (chew, antiplatelet — standard MI care), nitroglycerin SL (vasodilator, reduces myocardial demand). NOT acetaminophen (no role here). NOT albuterol (not a respiratory issue).',
        'PARAMETERS TO MONITOR (right side): cardiac rhythm (MI patients are at risk for arrhythmia), serial troponins (track infarction extent / progression). NOT blood glucose / urine output (not the immediate concerns post-MI).',
        'Bowtie filled: STEMI in center; aspirin + nitroglycerin on actions side; cardiac rhythm + serial troponins on parameters side.',
      ],
      answer: 'Center: STEMI. Actions: aspirin 325 mg, nitroglycerin SL. Parameters: cardiac rhythm, serial troponins.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'On an extended multiple-response item with 8 options, you\'re sure 3 are correct, you think 1 more might be, and 4 you\'re unsure about. Should you pick 3 or 4?',
      expectedAnswer: 'Pick 3 (the confident ones). Adding the maybe-correct fourth has expected value below 0 if your confidence on it is below 50%, because incorrect picks deduct 1 point. Better to bank 3 confident correct picks than gamble for a 4th and risk lowering the score.',
      responseFormat: 'free',
      hints: [
        '+1 per correct pick, −1 per incorrect pick.',
        'Compute expected value: if you\'re 50% sure, the expected value of adding it is 0.5·(+1) + 0.5·(−1) = 0.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-bowtie-guess',
      kind: 'misconception_check',
      question: 'On a bowtie item, if you\'re unsure of the center diagnosis, you should guess randomly to maximize partial credit. True or false?',
      commonErrors: [
        {
          answer: 'true',
          misconception: 'Treating bowtie scoring as additive across blanks.',
          correctsTo: 'False — partly. The CENTER scoring is independent (1 point if correct, 0 if not). But the ACTIONS and PARAMETERS often score as PAIRS (dyad scoring) — and they should fit the center you chose. If you guess a wrong center, your action and parameter picks (chosen to fit the wrong condition) will also be wrong, so you lose all 4 surrounding points too. Better strategy: if you\'re unsure of the center, eliminate clearly-wrong options from the bank, then commit to the most likely center based on the cues. Picking a coherent (even if uncertain) story beats random selection.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Bowtie: center diagnosis + 2 actions + 2 parameters. Identify center first.',
        'Extended multi-response: +1/−1 per pick, floored at 0. Pick only confident options.',
        'Drag-and-drop ranking: partial credit per correct ordering pair. Apply ABC + safety frameworks.',
        'Don\'t leave blanks blank on bowtie (related actions earn partial credit even if not perfect).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does the bowtie format use the specific shape of "1 center + 2 actions + 2 parameters" rather than, say, 1 center + 4 actions?',
      hint: 'The shape mirrors clinical reasoning: identify the problem (center), DO something about it (actions), and CHECK whether it worked (parameters to monitor). 2+2 also lets NCSBN test parallel skills — actions and monitoring — without overweighting either side. The visual of the bowtie also clearly separates "what you do" from "what you watch", which is the cognitive distinction the item is testing.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
