/**
 * NCLEX-RN — Heart Failure: Left vs Right-Sided, and the Compensatory Loop.
 *
 * Real pathophysiology and clinical reasoning, not test-taking strategy.
 * The through-line: the body's own compensatory response to a failing
 * pump (SNS + RAAS activation) is exactly what makes heart failure a
 * progressive, worsening disease — the mechanism nursing students most
 * often memorize without understanding WHY it backfires.
 *
 * Source: standard nursing pathophysiology references (e.g. Lewis
 * Medical-Surgical Nursing, Hinkle & Cheever Brunner & Suddarth's) —
 * approximate/conservative values used throughout; no fabricated stats.
 */

import type { LessonPlan } from '../types';

export const SEED_NCLEX_HEART_FAILURE: LessonPlan = {
  id: 'evelyn.testprep.nclex.heart-failure.v1',
  title: 'Heart Failure: Left vs Right-Sided Failure and the Compensatory Loop',
  curriculum: 'NCSBN',
  grade: 'nursing',
  subject: 'test-prep',
  topic: 'nclex-rn',
  locale: 'en',
  los: [
    {
      id: 'nclex.heart-failure-pathophys',
      description: 'Differentiate left-sided from right-sided heart failure by the circulation each backs pressure into, and explain how the SNS/RAAS compensatory response worsens pump function over time.',
      standard: 'NCLEX-RN',
    },
  ],
  prerequisites: ['nclex.cardiovascular-assessment'],
  followUps: ['nclex.heart-failure-pharmacology', 'nclex.fluid-electrolyte-balance'],
  estimatedMinutes: 10,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Surface the puzzle: one weak heart, two very different symptom pictures, and get the learner to guess why before explaining.',
      script: 'Two patients both have heart failure. One can\'t lie flat without gasping for air. The other has ankles so swollen their socks leave a groove. Same diagnosis — heart failure — but totally different symptoms. Why would a weak heart cause trouble breathing in one case and swollen ankles in another?',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-left-vs-right',
      kind: 'concept',
      goal: 'Localize each side of failure to the circulation it backs pressure into, and connect that to the specific assessment findings — with the learner predicting before the reveal.',
      keyIdeas: [
        'THE KEY RULE: each side of the heart fails "backward" into the circulation THAT SIDE receives blood from. Left ventricle receives from the lungs (pulmonary circulation) → left-sided failure backs pressure into the LUNGS. Right ventricle receives from the body (systemic venous circulation) → right-sided failure backs pressure into the BODY.',
        'LEFT-SIDED FAILURE (backs up into the lungs): dyspnea, orthopnea (breathlessness lying flat — blood redistributes from legs to lungs when supine), paroxysmal nocturnal dyspnea (PND — waking gasping at night), crackles/rales on auscultation, pink frothy sputum in severe/acute pulmonary edema, cough, fatigue from poor forward output.',
        'RIGHT-SIDED FAILURE (backs up into the systemic veins): jugular venous distension (JVD), dependent/peripheral edema (ankles, pretibial — pitting), hepatomegaly (liver engorged with backed-up venous blood), ascites, weight gain from fluid retention, GI bloating/anorexia from venous congestion of the gut.',
        'MOST COMMON CAUSE of right-sided failure is actually LEFT-sided failure — when the left side backs up into the lungs long enough, pulmonary pressures rise and the right ventricle has to pump against that resistance until it fails too (cor pulmonale is the chronic-lung-disease variant of this same mechanism).',
        'Quick clinical anchor: "left side, lung signs; right side, everywhere-below-the-heart signs" — think LUNGS for left, LEGS (and liver) for right.',
      ],
      vocabulary: [
        { term: 'orthopnea', definition: 'shortness of breath that worsens when lying flat and improves with sitting up; a hallmark of left-sided heart failure.' },
        { term: 'jugular venous distension (JVD)', definition: 'visible bulging of the jugular vein from elevated systemic venous pressure; a hallmark of right-sided heart failure.' },
      ],
      suggestedTools: ['show_diagram', 'comparison_table'],
      estimatedMinutes: 3,
    },
    {
      id: 'concept-compensatory-loop',
      kind: 'concept',
      goal: 'Trace the SNS/RAAS compensatory loop and get the learner to reason through why fluid retention makes a failing heart worse, not better.',
      keyIdeas: [
        'It starts with reduced cardiac output. Baroreceptors in the carotid sinus and aortic arch sense the drop in pressure and trigger two compensatory systems at once.',
        'SYMPATHETIC NERVOUS SYSTEM (SNS): releases norepinephrine/epinephrine → increases heart rate and contractility (short-term helps) and causes peripheral VASOCONSTRICTION to shunt blood to vital organs.',
        'RENIN-ANGIOTENSIN-ALDOSTERONE SYSTEM (RAAS): reduced renal perfusion (sensed by the kidney as "not enough volume") → renin release → angiotensin II (potent vasoconstrictor) → aldosterone release → the kidneys retain sodium and water to raise blood volume.',
        'THE TRAP: vasoconstriction raises AFTERLOAD (the resistance the ventricle must pump against) and Na⁺/water retention raises PRELOAD (the volume returning to the heart). Both increase the workload on a ventricle that is ALREADY failing to pump effectively.',
        'Ask the learner directly: if the heart isn\'t pumping enough blood forward, why would retaining MORE fluid make things worse instead of better? Reveal: extra volume overfills a ventricle that can\'t eject what it already has — pressure backs up further into the lungs/systemic veins (worsening the exact symptoms in the previous segment), and the added afterload/preload increases myocardial oxygen demand on a heart muscle that\'s already struggling — a vicious cycle where the body\'s emergency fix for low output ends up further weakening the pump.',
        'This is why chronic heart failure is a PROGRESSIVE disease even when the original insult (e.g., an MI) is a single event — the compensation itself drives ongoing decline.',
      ],
      vocabulary: [
        { term: 'preload', definition: 'the volume of blood filling the ventricle before contraction (stretch on the muscle fiber).' },
        { term: 'afterload', definition: 'the resistance the ventricle must overcome to eject blood.' },
        { term: 'RAAS', definition: 'renin-angiotensin-aldosterone system — a hormonal cascade that raises blood pressure and volume by triggering vasoconstriction and sodium/water retention.' },
      ],
      suggestedTools: ['show_concept_map'],
      estimatedMinutes: 3,
    },
    {
      id: 'concept-drug-mapping',
      kind: 'concept',
      goal: 'Map the major heart-failure drug classes onto the specific point in the compensatory loop each one interrupts.',
      keyIdeas: [
        'ACE INHIBITORS (e.g., lisinopril) / ARBs (e.g., losartan): block the RAAS cascade — ACE inhibitors stop the conversion of angiotensin I to angiotensin II; ARBs block angiotensin II from binding its receptor. Result: less vasoconstriction (↓afterload) and less aldosterone-driven fluid retention (↓preload).',
        'BETA BLOCKERS (e.g., metoprolol, carvedilol): blunt the SNS surge — slow heart rate and reduce the harmful long-term effects of chronic catecholamine stimulation on the heart muscle, even though they may seem counterintuitive for a "weak" pump (started at low doses, titrated slowly, only in stable patients).',
        'DIURETICS (e.g., furosemide): act directly on the kidney to excrete excess sodium and water, reducing PRELOAD and relieving the pulmonary/systemic congestion causing symptoms — this is the class that most directly targets the fluid-retention piece of the loop.',
        'Putting it together: RAAS-blockers and diuretics both counter fluid overload from different ends (production vs. excretion); beta blockers counter the SNS side. Together they interrupt the compensatory loop at three different points rather than one.',
      ],
      suggestedTools: ['show_table'],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-left-causes-edema',
      kind: 'misconception_check',
      question: 'A student says "left-sided heart failure causes peripheral edema in the ankles, since the heart is the problem and edema is the classic heart failure sign." Is that correct?',
      commonErrors: [
        {
          answer: 'Yes, peripheral edema is a left-sided heart failure sign.',
          misconception: 'Treating "heart failure" as one undifferentiated symptom set instead of matching each side to the circulation it backs into.',
          correctsTo: 'Peripheral (ankle/pretibial) edema is a RIGHT-sided failure sign — it reflects backup into the systemic venous circulation. Left-sided failure backs up into the LUNGS instead, producing dyspnea, orthopnea, PND, and crackles. A patient can absolutely have BOTH (biventricular failure, since left-sided failure often causes right-sided failure over time), but the two symptom sets map to two different sides for a reason: which circulation is downstream of the failing ventricle.',
        },
      ],
      estimatedMinutes: 0.5,
    },
    {
      id: 'misconception-treat-with-fluids',
      kind: 'misconception_check',
      question: 'A newer nurse reasons: "cardiac output is low, so the patient needs more IV fluids to boost volume and cardiac output." Is that the right call in decompensated heart failure?',
      commonErrors: [
        {
          answer: 'Yes, give more IV fluids to raise cardiac output.',
          misconception: 'Assuming low output always means low volume, and that adding fluid will help the way it would in hypovolemic shock.',
          correctsTo: 'No — in decompensated heart failure the problem usually isn\'t too little volume, it\'s a ventricle that can\'t effectively eject the volume it already has. Adding IV fluids increases preload further, worsening pulmonary/systemic congestion (the same mechanism as the body\'s own RAAS-driven fluid retention). The priority interventions are typically diuresis, afterload reduction, and improving contractility — NOT volume loading. This is why fluid restriction and strict I&O monitoring are standard heart-failure nursing orders.',
        },
      ],
      estimatedMinutes: 0.5,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Left-sided failure backs up into the LUNGS: dyspnea, orthopnea, PND, crackles, frothy sputum.',
        'Right-sided failure backs up into the SYSTEMIC VEINS: JVD, peripheral edema, hepatomegaly, ascites.',
        'Low cardiac output triggers SNS + RAAS compensation: vasoconstriction (↑afterload) + Na⁺/water retention (↑preload).',
        'That compensation increases the workload on an already-failing heart — a vicious cycle that makes chronic HF progressive.',
        'ACE inhibitors/ARBs and diuretics interrupt the RAAS/fluid-retention side; beta blockers blunt the SNS side.',
      ],
      estimatedMinutes: 0.3,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'BNP (B-type natriuretic peptide) is released by stretched ventricular walls and is used as a lab marker for heart failure severity. Given everything you just learned about the RAAS pathway, what do you think BNP\'s physiologic JOB is — and why would the body release a hormone that works AGAINST its own SNS/RAAS compensation?',
      hint: 'BNP promotes natriuresis (sodium excretion) and vasodilation — essentially the opposite of RAAS. It\'s the body\'s own partial counter-regulatory attempt to offset the harmful fluid retention and vasoconstriction, which is also why an elevated BNP level is such a useful marker of ventricular strain.',
      estimatedMinutes: 0.2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
