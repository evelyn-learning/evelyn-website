/**
 * NCLEX-RN — Fluid & Electrolytes: Potassium and the Heart.
 *
 * Real pathophysiology and clinical reasoning, not test-taking strategy.
 * The through-line: potassium is THE emergency electrolyte because it
 * directly sets the resting membrane potential of cardiac muscle — get it
 * wrong in either direction and the heart's electrical conduction is what
 * fails, which is why hyper/hypokalemia shows up on the ECG before it
 * shows up almost anywhere else.
 *
 * Source: standard nursing pathophysiology/pharmacology references (e.g.
 * ATI, Lewis Medical-Surgical Nursing, Lippincott Pharmacology) —
 * approximate/conservative ranges used throughout; no fabricated stats.
 *
 * Clinical values are standard textbook ranges; flagged for owner review
 * before high-stakes use (same status as the insulin seed's numbers).
 */

import type { LessonPlan } from '../types';

export const SEED_NCLEX_FLUID_ELECTROLYTES: LessonPlan = {
  id: 'evelyn.testprep.nclex.fluid-electrolytes.v1',
  title: 'Fluid & Electrolytes: Potassium and the Heart',
  curriculum: 'NCSBN',
  grade: 'nursing',
  subject: 'test-prep',
  topic: 'nclex-rn',
  locale: 'en',
  los: [
    {
      id: 'nclex.fluid-electrolyte-balance',
      description: 'Recognize the normal potassium range and the hallmark hyper/hypokalemia findings; explain WHY potassium imbalance disrupts cardiac conduction; and prioritize the "protect, shift, remove" hyperkalemia intervention sequence.',
      standard: 'NCLEX-RN',
    },
  ],
  prerequisites: ['nclex.cardiovascular-assessment'],
  followUps: ['nclex.acid-base-balance', 'nclex.renal-failure'],
  estimatedMinutes: 10,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Ground the lesson in a concrete emergency scenario and get the learner to name the electrolyte before it\'s revealed.',
      script: 'A dialysis patient missed their last two sessions — car trouble, then just didn\'t feel like going. They show up now weak, with palpitations. You get them on telemetry and see peaked, tented T waves. No chest pain, no obvious MI pattern — just that one striking change. What electrolyte imbalance does a missed-dialysis patient with peaked T waves make you think of immediately, and why does THIS electrolyte, more than almost any other, turn into a cardiac emergency?',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-normal-ranges-and-symptoms',
      kind: 'concept',
      goal: 'Anchor the normal potassium range and the hallmark hyper/hypokalemia findings, with the learner predicting the direction of each finding before confirming.',
      keyIdeas: [
        'NORMAL POTASSIUM RANGE: 3.5-5.0 mEq/L. Because potassium is mostly an INTRACELLULAR ion (only about 2% is in the blood), even small serum swings reflect large shifts in total-body potassium or in how it\'s distributed across the cell membrane — which is part of why the range is so narrow and so closely watched.',
        'HYPERKALEMIA (K+ above 5.0 mEq/L): muscle weakness (often ascending, can progress toward paralysis), peaked/tented T waves on ECG, and — the reason it\'s an emergency — risk of LETHAL ARRHYTHMIAS including ventricular fibrillation and asystole as levels climb further.',
        'HYPOKALEMIA (K+ below 3.5 mEq/L): muscle cramps and weakness, flat or inverted T waves with a U wave appearing on ECG, and a specific pharmacology risk — it increases the risk of DIGOXIN TOXICITY, because low potassium lets digoxin bind more readily to the same cardiac pump it normally competes with.',
        'DIALYSIS LINK to the hook: dialysis is one of the main ways the body removes excess potassium when the kidneys can\'t. Missed sessions let potassium climb toward hyperkalemia — which is exactly the direction the hook\'s peaked T waves point.',
        'MEMORY ANCHOR for the ECG changes: hyperkalemia PEAKS the T wave (tall and pointed); hypokalemia FLATTENS it and adds a U wave. Opposite direction of potassium, opposite direction of the T wave.',
      ],
      vocabulary: [
        { term: 'hyperkalemia', definition: 'serum potassium above 5.0 mEq/L; risk of peaked T waves and lethal arrhythmias.' },
        { term: 'hypokalemia', definition: 'serum potassium below 3.5 mEq/L; risk of flat/inverted T waves, U waves, and digoxin toxicity.' },
        { term: 'U wave', definition: 'a small extra deflection after the T wave on ECG, classically associated with hypokalemia.' },
      ],
      suggestedTools: ['show_table'],
      prescribedRender: {
        tool: 'show_table',
        params: {
          headers: ['', 'Hyperkalemia (K+ > 5.0)', 'Hypokalemia (K+ < 3.5)'],
          rows: [
            ['Normal range', '3.5-5.0 mEq/L', '3.5-5.0 mEq/L'],
            ['Muscle findings', 'Weakness, possible ascending paralysis', 'Cramps, weakness'],
            ['ECG finding', 'Peaked / tented T waves', 'Flat or inverted T waves, U wave'],
            ['Key danger', 'Lethal arrhythmias (V-fib, asystole)', 'Digoxin toxicity risk'],
          ],
        },
      },
      estimatedMinutes: 3,
    },
    {
      id: 'concept-membrane-potential',
      kind: 'concept',
      goal: 'Build the conceptual link between potassium and cardiac conduction via the resting membrane potential, without leaning on the Nernst equation.',
      keyIdeas: [
        'Cardiac muscle cells, like neurons, rest at a NEGATIVE internal voltage relative to the outside of the cell — the RESTING MEMBRANE POTENTIAL. That resting voltage is set largely by how much potassium sits inside the cell versus outside, since the cell membrane at rest is far more permeable to potassium than to sodium or calcium.',
        'CONCEPTUALLY: the cell membrane is like a dam holding back a concentration gradient. Potassium is concentrated heavily INSIDE the cell relative to outside; that gradient constantly "leaks" a little potassium out, and that leak is a major reason the inside of the cell sits negative relative to the outside at rest.',
        'HYPERKALEMIA raises potassium OUTSIDE the cell, which shrinks the inside/outside potassium gradient the cell relies on. That makes the resting membrane potential less negative than normal (partially depolarized). A partially depolarized cell is initially MORE excitable, but if it stays partially depolarized, the fast sodium channels that trigger a normal heartbeat become inactivated — conduction slows and becomes erratic, which is exactly what produces the peaked-T-wave-to-arrhythmia progression.',
        'HYPOKALEMIA does roughly the opposite: less potassium outside the cell widens that gradient, making the resting membrane potential MORE negative (hyperpolarized) and the cell harder to depolarize normally, which slows conduction in a different way and produces its own arrhythmia risk (along with the digoxin-sensitivity link from the previous segment).',
        'THE BIG PICTURE: potassium isn\'t just "a number on the labs" — it\'s a direct input to the electrical baseline every heartbeat starts from. That\'s why potassium, more than almost any other electrolyte, shows up on the ECG before it shows up as a symptom the patient can describe.',
      ],
      vocabulary: [
        { term: 'resting membrane potential', definition: 'the voltage difference across a cell membrane at rest, set largely by the potassium gradient between inside and outside the cell.' },
        { term: 'depolarization', definition: 'a shift of the membrane potential toward less negative (or positive), the electrical event that triggers muscle/nerve activity.' },
      ],
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 3,
    },
    {
      id: 'concept-nursing-priorities',
      kind: 'concept',
      goal: 'Sequence the hyperkalemia intervention priorities using the "protect, shift, remove" framework and connect each step back to the membrane-potential mechanism.',
      keyIdeas: [
        'THE FRAMEWORK — PROTECT, SHIFT, REMOVE — is the priority order for treating significant hyperkalemia, and each step targets a different point in the mechanism just covered.',
        'PROTECT THE HEART FIRST: IV CALCIUM GLUCONATE (or calcium chloride) doesn\'t lower serum potassium at all — it stabilizes the cardiac cell membrane directly, raising the threshold needed to fire an action potential and counteracting the conduction danger immediately. Given first because it buys time within minutes, before any potassium-lowering treatment can act.',
        'SHIFT POTASSIUM INTO CELLS (temporary, fast): IV INSULIN with concurrent DEXTROSE (D50) drives potassium from the blood back into cells via the same Na+/K+-ATPase pump insulin normally activates for glucose uptake — this doesn\'t remove any potassium from the body, it just relocates it, so the effect is temporary and levels can rise again once it wears off. ALBUTEROL (beta-2 agonist) can be used the same way, also shifting potassium intracellularly.',
        'REMOVE POTASSIUM FROM THE BODY (definitive): SODIUM POLYSTYRENE SULFONATE (Kayexalate) binds potassium in the GI tract for excretion, and DIALYSIS directly filters excess potassium out of the blood — dialysis is the fastest and most definitive removal method, which is exactly why missing dialysis sessions (the hook) is such a direct path to hyperkalemia.',
        'WHY THE ORDER MATTERS: protect (calcium) buys minutes, shift (insulin/D50, albuterol) buys hours, remove (Kayexalate, dialysis) is the only step that actually lowers total-body potassium. Skipping straight to "remove" in an unstable patient leaves the heart unprotected during the delay; skipping "protect" in a patient with ECG changes leaves the most immediate danger unaddressed.',
      ],
      vocabulary: [
        { term: 'protect, shift, remove', definition: 'the nursing priority framework for hyperkalemia: stabilize the heart, temporarily relocate potassium into cells, then definitively remove it from the body.' },
      ],
      suggestedTools: ['show_table'],
      prescribedRender: {
        tool: 'show_table',
        params: {
          headers: ['Step', 'Intervention', 'What it actually does'],
          rows: [
            ['Protect', 'IV calcium gluconate/chloride', 'Stabilizes cardiac membrane; does NOT lower K+'],
            ['Shift', 'IV insulin + D50; albuterol', 'Moves K+ into cells; temporary, K+ can rebound'],
            ['Remove', 'Kayexalate; dialysis', 'Definitively removes K+ from the body'],
          ],
        },
      },
      estimatedMinutes: 2.5,
    },
    {
      id: 'misconception-insulin-lowers-sugar',
      kind: 'misconception_check',
      question: 'A student sees "insulin + D50" ordered for a hyperkalemic patient and assumes it\'s there to treat high blood sugar. Is that the reason insulin is given here?',
      commonErrors: [
        {
          answer: 'Yes, insulin is given to lower the patient\'s blood glucose.',
          misconception: 'Assuming insulin\'s only clinical purpose is glucose control, and reading its presence in a hyperkalemia order set as a diabetes intervention.',
          correctsTo: 'No — in this context insulin is given specifically to SHIFT POTASSIUM INTRACELLULARLY, not to manage blood sugar. Insulin activates the Na+/K+-ATPase pump, which drives potassium from the blood into cells (alongside glucose). Dextrose (D50) is given WITH the insulin precisely to prevent hypoglycemia that the insulin would otherwise cause in a patient who may not have high blood sugar at all. It doesn\'t remove any potassium from the body — it only relocates it, so it\'s a temporary "shift" measure, not a "remove" measure, and levels must still be rechecked.',
        },
      ],
      estimatedMinutes: 0.5,
    },
    {
      id: 'misconception-calcium-lowers-potassium',
      kind: 'misconception_check',
      question: 'A student reasons that IV calcium gluconate is given first in severe hyperkalemia because it\'s the fastest way to lower the potassium level. True or false?',
      commonErrors: [
        {
          answer: 'True, calcium gluconate lowers serum potassium fastest.',
          misconception: 'Assuming "given first" must mean "most effective at lowering the lab value," rather than distinguishing membrane protection from potassium removal.',
          correctsTo: 'False. Calcium gluconate does NOT lower serum potassium at all — it stabilizes the cardiac cell membrane, raising the threshold for a dangerous action potential and protecting the heart within minutes while other treatments take effect. It\'s given first because of the URGENCY of protecting cardiac conduction, not because it fixes the underlying number. Lowering the actual potassium level requires the "shift" (insulin/D50, albuterol) or "remove" (Kayexalate, dialysis) steps that follow.',
        },
      ],
      estimatedMinutes: 0.5,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Normal K+: 3.5-5.0 mEq/L.',
        'Hyperkalemia (>5.0): muscle weakness, PEAKED T waves, risk of lethal arrhythmias.',
        'Hypokalemia (<3.5): cramps, FLAT/inverted T waves + U wave, digoxin toxicity risk.',
        'Potassium sets the resting membrane potential — imbalance changes how excitable/conductive cardiac cells are, which is why it shows up on the ECG first.',
        'Hyperkalemia priority order: PROTECT (calcium gluconate — stabilizes the heart, doesn\'t lower K+) → SHIFT (insulin+D50, albuterol — temporary) → REMOVE (Kayexalate, dialysis — definitive).',
      ],
      estimatedMinutes: 0.3,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A patient in DKA can present with a normal or even HIGH serum potassium despite having a total-body potassium DEFICIT. Given what you just learned about potassium shifting across the cell membrane, how can both of those be true at once — and why does that matter once insulin therapy starts?',
      hint: 'In DKA, insulin deficiency and acidosis both push potassium OUT of cells into the blood (roughly the reverse of the insulin-driven shift), so the serum level can look normal or high even though total-body stores are depleted (often lost through osmotic diuresis). Once IV insulin therapy starts, it shifts that potassium back into cells — and because total-body stores were already low, serum potassium can drop sharply and dangerously, which is exactly why potassium is monitored closely and often replaced proactively during DKA treatment.',
      estimatedMinutes: 0.2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
