/**
 * MCAT Bio — Organ Systems (Cardio + Respiratory + Renal Highlights).
 *
 * Three highest-yield human-physiology topics for the Bio/Biochem section.
 * Hemodynamics, gas exchange, nephron function — recurring passage themes.
 */

import type { LessonPlan } from '../types';

export const SEED_MCAT_BIO_ORGAN_SYSTEMS: LessonPlan = {
  id: 'evelyn.testprep.mcat.bio.organ-systems.v1',
  title: 'MCAT Bio — Cardiovascular, Respiratory, Renal Physiology',
  curriculum: 'CCSS',
  grade: 'graduate',
  subject: 'test-prep',
  topic: 'mcat-bio-biochem',
  locale: 'en',
  los: [
    {
      id: 'mcat.bio.organ-systems',
      description: 'Trace blood flow through the heart, explain pressure-volume + cardiac-output relations, describe gas exchange + the oxygen-hemoglobin curve + Bohr effect, and outline nephron filtration / reabsorption / hormonal regulation (ADH, aldosterone).',
      standard: 'MCAT-BIO-ORG',
    },
  ],
  prerequisites: ['mcat.format-2025'],
  followUps: [],
  estimatedMinutes: 25,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Three organ systems that show up in nearly every MCAT.',
      script: 'Among 11 human organ systems, three show up in passage after passage: cardiovascular, respiratory, and renal. Together they regulate gas exchange, fluid balance, and waste removal — every clinical passage touches at least one. Master the hemodynamics + the oxyhemoglobin curve + nephron function and you\'ll handle a huge slice of Bio/Biochem questions without re-deriving anything.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-cardiovascular',
      kind: 'concept',
      goal: 'Cardiac anatomy + cardiac output + blood pressure.',
      keyIdeas: [
        'BLOOD FLOW PATH: vena cavae → right atrium → tricuspid valve → right ventricle → pulmonary semilunar valve → pulmonary arteries → LUNGS (gas exchange) → pulmonary veins → left atrium → mitral (bicuspid) valve → left ventricle → aortic semilunar valve → aorta → BODY → vena cavae.',
        'PULMONARY ARTERIES carry DEOXYGENATED blood; PULMONARY VEINS carry OXYGENATED blood — opposite of the rest of the body.',
        'CARDIAC OUTPUT: CO = HR × SV. Resting ~5 L/min. SV = stroke volume = EDV − ESV.',
        'BLOOD PRESSURE: BP = CO × TPR (total peripheral resistance). Systolic (120) ventricle contracting; diastolic (80) ventricle relaxed.',
        'FRANK-STARLING LAW: greater EDV stretches cardiac muscle → stronger contraction → higher SV (within physiologic range). Hearts compensate for venous return.',
        'BARORECEPTOR REFLEX: ↑BP → carotid+aortic baroreceptors fire → brainstem decreases sympathetic + increases parasympathetic → ↓HR + vasodilation → BP back down. ↓BP triggers opposite. Negative-feedback loop.',
        'ELECTRICAL: SA node (pacemaker, ~70 bpm) → AV node (delays signal) → Bundle of His → Purkinje fibers. AV delay allows atrial systole to complete before ventricular systole.',
        'EKG: P wave = atrial depolarization, QRS = ventricular depolarization (atrial repolarization buried within), T wave = ventricular repolarization.',
      ],
      vocabulary: [
        { term: 'cardiac output', definition: 'CO = HR × SV; volume of blood pumped per minute (~5 L/min at rest).' },
        { term: 'Frank-Starling law', definition: 'increase in end-diastolic volume → stronger contraction → higher stroke volume; intrinsic heart compensation.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-respiratory',
      kind: 'concept',
      goal: 'Gas exchange + oxyhemoglobin + Bohr effect.',
      keyIdeas: [
        'PATH: nose/mouth → pharynx → larynx → trachea → bronchi → bronchioles → terminal bronchioles → alveoli (gas exchange surface).',
        'INSPIRATION (active): diaphragm contracts (descends) + external intercostals contract → thoracic volume ↑ → intra-pleural pressure ↓ → lungs expand → air rushes in.',
        'EXPIRATION (passive at rest): diaphragm relaxes + elastic recoil. Forced expiration uses internal intercostals + abdominals.',
        'GAS EXCHANGE driven by PARTIAL-PRESSURE GRADIENTS. Alveolar pO₂ ~104 mmHg vs venous blood ~40 → O₂ diffuses into capillaries. Alveolar pCO₂ ~40 vs venous ~46 → CO₂ diffuses out.',
        'OXYHEMOGLOBIN DISSOCIATION CURVE: SIGMOIDAL (cooperative binding — 4 subunits). At alveolar pO₂ (~100): Hb ~98% saturated. At tissue pO₂ (~40): Hb ~75% saturated → ~25% O₂ released.',
        'BOHR EFFECT: ↑CO₂, ↑H+ (↓pH), ↑temp, ↑2,3-BPG → curve shifts RIGHT → Hb releases MORE O₂ at given pO₂. Active tissues (high CO₂ + low pH + warm) get more O₂. Lungs (opposite) → curve shifts left → Hb picks up O₂.',
        'CO₂ TRANSPORT: ~70% as bicarbonate (CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻ via carbonic anhydrase in RBC). ~20% bound to Hb (carbaminohemoglobin). ~10% dissolved in plasma.',
        'FETAL HEMOGLOBIN (HbF): higher O₂ affinity than adult Hb (curve shifted left) — pulls O₂ from maternal blood across placenta.',
      ],
      vocabulary: [
        { term: 'Bohr effect', definition: 'rightward shift of oxyhemoglobin curve due to ↑CO₂, ↑H+, ↑temp; promotes O₂ release in active tissues.' },
        { term: 'oxyhemoglobin dissociation curve', definition: 'sigmoidal plot of Hb saturation vs pO₂; reflects cooperative binding of 4 O₂ to one Hb.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-renal',
      kind: 'concept',
      goal: 'Nephron functional anatomy + hormonal regulation.',
      keyIdeas: [
        'NEPHRON SEGMENTS: glomerulus (filtration) → Bowman\'s capsule → proximal convoluted tubule (PCT) → loop of Henle → distal convoluted tubule (DCT) → collecting duct → ureter.',
        'GLOMERULAR FILTRATION: pressure-driven; small solutes + water pass; cells + large proteins stay in blood. ~180 L/day filtered, but ~99% reabsorbed → ~1.5 L urine.',
        'PCT: bulk reabsorption — ALL glucose + amino acids (via Na⁺ co-transport, saturable), ~65% Na⁺/Cl⁻/H₂O, bicarbonate. Largely OBLIGATORY (not regulated by hormones).',
        'LOOP OF HENLE: descending limb permeable to WATER ONLY (water leaves into hyperosmotic medulla). Ascending limb permeable to SOLUTES ONLY (Na⁺/K⁺/2Cl⁻ pump out, dilutes filtrate). Counter-current multiplier creates medullary osmotic gradient.',
        'DCT: fine-tunes Na⁺/Cl⁻ reabsorption. Calcium reabsorption regulated by PTH.',
        'COLLECTING DUCT: water permeability controlled by ADH (vasopressin). ADH ↑ → aquaporins inserted → more water reabsorbed → concentrated urine.',
        'ALDOSTERONE: secreted by adrenal cortex; acts on DCT/CD principal cells. ↑Na⁺ reabsorption (with H₂O passively follows) and ↑K⁺ secretion. Triggered by RAAS (renin-angiotensin-aldosterone system) when BP drops.',
        'RAAS CASCADE: ↓BP → juxtaglomerular cells release renin → cleaves angiotensinogen to ANG I → ACE (lung) converts to ANG II → vasoconstriction + aldosterone release + ADH release + thirst → BP rises.',
        'ANP (atrial natriuretic peptide): released by atria when stretched (high BP/volume). Opposes RAAS — promotes Na⁺ excretion + vasodilation → ↓BP.',
      ],
      vocabulary: [
        { term: 'ADH (vasopressin)', definition: 'posterior-pituitary hormone; ↑aquaporin insertion in collecting duct → ↑water reabsorption → concentrated urine.' },
        { term: 'aldosterone', definition: 'adrenal-cortex hormone; ↑Na⁺ reabsorption + ↑K⁺ secretion in distal nephron, raising blood volume/BP.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'During exercise, muscle pH drops and CO₂ levels rise locally. What happens to hemoglobin\'s oxygen-binding behavior in the muscle capillaries?',
      expectedAnswer: 'The Bohr effect SHIFTS the oxyhemoglobin dissociation curve to the RIGHT. At a given pO₂, Hb saturation is LOWER → Hb RELEASES MORE O₂ to the active tissue. Mechanism: H⁺ and CO₂ bind to Hb at sites distinct from O₂, stabilizing the T (tense) state and lowering O₂ affinity. This is exactly when muscle needs more oxygen — physiology is elegantly self-regulating.',
      responseFormat: 'free',
      hints: [
        '↑H+ + ↑CO₂ + ↑temp → Bohr effect.',
        'Curve shifts RIGHT → more O₂ released.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-pulmonary-vessels',
      kind: 'misconception_check',
      question: 'Pulmonary arteries carry oxygenated blood and pulmonary veins carry deoxygenated blood, just like elsewhere in the body. True or false?',
      commonErrors: [
        {
          answer: 'true',
          misconception: 'Confusing artery/vein with oxygen status.',
          correctsTo: 'False. Pulmonary circulation is the EXCEPTION. Pulmonary ARTERIES carry DEOXYGENATED blood from the right ventricle TO the lungs; pulmonary VEINS carry OXYGENATED blood FROM the lungs to the left atrium. The general rule is: arteries carry blood AWAY from the heart, veins carry blood TO the heart — that\'s about direction, not oxygen content. The oxygen status of pulmonary vessels is reversed because the lungs are where gas exchange occurs.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'CO = HR × SV. BP = CO × TPR. Pulmonary arteries = deoxygenated; pulm veins = oxygenated.',
        'Bohr: ↑CO₂/H⁺/temp shifts oxyhemoglobin curve right → more O₂ released.',
        'PCT: bulk obligatory reabsorption (glucose, AAs, ~65% Na/H₂O).',
        'ADH ↑ water reabsorption (CD); aldosterone ↑Na/H₂O reabsorption + ↑K⁺ secretion (DCT/CD).',
        'RAAS responds to ↓BP; ANP opposes RAAS.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A patient with chronic heart failure shows elevated ANP and elevated aldosterone simultaneously. Why aren\'t these completely opposing each other?',
      hint: 'Heart failure → decreased effective arterial blood volume → ↓BP sensed by baroreceptors → RAAS activated → aldosterone elevated (retain Na⁺/H₂O to ↑BP). At the same time, the failing ventricle backs blood into atria → atrial stretch → ANP elevated (try to ↓volume). RAAS dominates because the kidney sees low pressure as the priority signal. The clinical result is paradoxical fluid retention — too much aldosterone overrides ANP\'s opposite signal. This is why heart-failure drugs target the RAAS axis (ACE inhibitors, ARBs, aldosterone antagonists like spironolactone) to break the cycle.',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
