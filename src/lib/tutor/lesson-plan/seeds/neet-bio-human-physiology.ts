/**
 * NEET Biology — Human Physiology Overview.
 *
 * Class 11 NCERT — covers digestion, breathing, body fluids+circulation,
 * excretion, locomotion, neural control, chemical coordination. ~10-12
 * NEET questions per sitting come from this unit.
 */

import type { LessonPlan } from '../types';

export const SEED_NEET_BIO_HUMAN_PHYSIOLOGY: LessonPlan = {
  id: 'evelyn.testprep.neet.bio.human-physiology.v1',
  title: 'NEET Biology — Human Physiology (Overview Across 7 Systems)',
  curriculum: 'NTA',
  grade: 'medical-entrance',
  subject: 'test-prep',
  topic: 'neet-biology',
  locale: 'en',
  los: [
    {
      id: 'neet.bio.human-physiology',
      description: 'Recall key features of the seven NCERT-Class-11 human physiology systems (digestion, breathing, circulation, excretion, locomotion, neural, endocrine) at NEET-question depth.',
      standard: 'NEET-BIO-PHYS',
    },
  ],
  prerequisites: ['neet.bio-cell-biology'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Human physiology is THE largest NEET unit by question count.',
      script: 'Class 11 NCERT human physiology covers seven body systems and produces 10-12 NEET questions every year — about 6% of your total score from one unit. The questions are highly NCERT-driven: the line "absorption mostly occurs in the jejunum" or "loop of Henle establishes the medullary gradient" can be quoted verbatim. Master the chapter\'s key facts and most physiology MCQs are recall, not reasoning.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-digestion-respiration',
      kind: 'concept',
      goal: 'Digestion + Breathing key facts.',
      keyIdeas: [
        'DIGESTION: enzymes by site — mouth (salivary amylase → maltose), stomach (pepsin → peptides; HCl + intrinsic factor; rennin in infants), pancreas (trypsin, chymotrypsin, lipase, amylase, nuclease), small intestine (enterokinase activates trypsinogen; brush-border maltase, sucrase, lactase, dipeptidases, lipase).',
        'ABSORPTION mostly in JEJUNUM. Water mostly in COLON. Vitamin K + B12 from GUT bacteria.',
        'PEPSIN works at pH ~2; trypsin at pH ~8.',
        'BREATHING: tidal volume ~500 mL; vital capacity = inspiratory reserve + tidal + expiratory reserve = ~4500 mL. Residual volume ~1200 mL; total lung capacity ~5800 mL.',
        'OXYGEN TRANSPORT: 97% as oxyhemoglobin (HbO₂), 3% dissolved in plasma. CARBON DIOXIDE: 70% as bicarbonate (in plasma), 23% as carbamino-Hb, 7% dissolved.',
        'OXYGEN-HEMOGLOBIN DISSOCIATION CURVE: sigmoidal. Right shift (more O₂ release to tissues) with: ↑ CO₂, ↓ pH (Bohr effect), ↑ temperature, ↑ 2,3-BPG.',
        'BREATHING CONTROL: medulla oblongata (rhythm); pons (modulation); chemoreceptors in carotid + aortic bodies sense ↓ O₂ / ↑ CO₂ / ↓ pH.',
      ],
      vocabulary: [
        { term: 'Bohr effect', definition: 'increased CO₂/H+ shifts the O₂-Hb dissociation curve right, releasing more O₂ to tissues.' },
        { term: 'vital capacity', definition: 'maximum air a person can exhale after a maximum inhalation; ~4500 mL.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-circulation-excretion',
      kind: 'concept',
      goal: 'Circulation + Excretion key facts.',
      keyIdeas: [
        'HEART: 4 chambers. Right atrium ← superior + inferior vena cava. Right ventricle → pulmonary artery (only artery with deoxygenated blood). Left atrium ← 4 pulmonary veins (only veins with oxygenated blood). Left ventricle → aorta.',
        'CARDIAC CYCLE: ~0.8 s at 72 bpm. Atrial systole 0.1s, ventricular systole 0.3s, joint diastole 0.4s.',
        'SA NODE pacemaker (rate 70-80) → AV node → bundle of His → Purkinje fibers.',
        'BLOOD COMPOSITION: plasma 55% (~90% water, plasma proteins albumin/globulin/fibrinogen), formed elements 45% (RBC + WBC + platelets). Hb 12-18 g/dL.',
        'BLOOD GROUPS: ABO (antigens A, B; antibodies anti-A, anti-B in plasma). Rh+ vs Rh−. Universal donor O−; universal recipient AB+.',
        'KIDNEY: ~10 lakh nephrons per kidney. Cortex (Bowman\'s capsule, PCT, DCT) + Medulla (Loop of Henle, collecting duct).',
        'NEPHRON FUNCTIONS: glomerular filtration (~125 mL/min, ~180 L/day), reabsorption (>99% of filtrate, mostly in PCT), secretion (DCT secretes K+, H+, NH₃), concentration (Loop of Henle establishes medullary osmotic gradient via countercurrent multiplier).',
        'HORMONES regulating kidney: ADH (vasopressin) increases water reabsorption from collecting duct. Aldosterone increases Na+ reabsorption + K+ secretion in DCT/CD. ANF (atrial natriuretic factor) opposes both.',
      ],
      vocabulary: [
        { term: 'glomerular filtration rate (GFR)', definition: 'volume of plasma filtered by glomeruli per minute; ~125 mL/min in a healthy adult.' },
        { term: 'countercurrent multiplier', definition: 'the loop-of-Henle mechanism that creates a high-osmolarity medullary interstitium for concentrated urine production.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-neural-endocrine',
      kind: 'concept',
      goal: 'Neural + Endocrine key facts.',
      keyIdeas: [
        'NEURON: cell body + dendrites + axon. Resting membrane potential ~−70 mV (Na+/K+ pump + K+ leak channels). Action potential threshold ~−55 mV.',
        'SYNAPTIC TRANSMISSION: chemical (neurotransmitter — ACh, glutamate, GABA, dopamine, serotonin) or electrical (gap junctions, faster).',
        'CNS: brain + spinal cord. PNS: sensory + motor (somatic + autonomic). AUTONOMIC: sympathetic (fight/flight, NE) vs parasympathetic (rest/digest, ACh).',
        'BRAIN PARTS: forebrain (cerebrum, thalamus, hypothalamus), midbrain, hindbrain (cerebellum, pons, medulla).',
        'ENDOCRINE GLANDS: hypothalamus (releasing/inhibiting hormones), pituitary (master gland — anterior: GH, TSH, ACTH, FSH, LH, prolactin; posterior: stores ADH + oxytocin), thyroid (T3, T4, calcitonin), parathyroid (PTH), adrenal (cortex: cortisol, aldosterone; medulla: epinephrine, NE), pancreas (insulin, glucagon), gonads (estrogen, progesterone, testosterone).',
        'INSULIN: lowers blood glucose by stimulating glucose uptake into cells, glycogen synthesis. GLUCAGON: raises blood glucose by stimulating glycogen breakdown. Diabetes type 1 = no insulin (autoimmune); type 2 = insulin resistance.',
        'STEROID HORMONES (cortisol, aldosterone, sex hormones): lipid-soluble, cross cell membrane, bind nuclear receptor, affect transcription.',
        'PROTEIN/PEPTIDE HORMONES (insulin, GH, ADH): water-soluble, bind cell-surface receptor, signal via second messengers (cAMP, IP3, Ca²+).',
      ],
      vocabulary: [
        { term: 'action potential', definition: 'rapid depolarization of a neuron membrane (from −70 mV to +30 mV) propagating along the axon.' },
        { term: 'tropic hormone', definition: 'a pituitary hormone whose target is another endocrine gland (e.g., TSH targets thyroid).' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A patient has metabolic acidosis (low blood pH). What direction does the oxygen-hemoglobin dissociation curve shift, and what\'s the physiological consequence?',
      expectedAnswer: 'The curve shifts RIGHT (Bohr effect — low pH = more H+ = lower Hb-O₂ affinity). Consequence: hemoglobin releases more O₂ to tissues at any given partial pressure — useful when tissues are stressed, but in acidosis it can also signal that tissues are oxygen-starved or producing excess lactic acid.',
      responseFormat: 'free',
      hints: [
        'Low pH = right shift on the O₂-Hb curve.',
        'Right shift = more O₂ released.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-pulmonary-arteries',
      kind: 'misconception_check',
      question: 'Arteries always carry oxygenated blood and veins always carry deoxygenated blood. True or false?',
      commonErrors: [
        {
          answer: 'true',
          misconception: 'Treating "artery = oxygenated" as universal.',
          correctsTo: 'False. The PULMONARY ARTERY carries DEOXYGENATED blood from the right ventricle to the lungs. The PULMONARY VEINS carry OXYGENATED blood from the lungs back to the left atrium. The general rule "arteries = oxygenated" applies to systemic circulation but not pulmonary. The CORRECT definition: arteries carry blood AWAY from the heart, veins carry blood TO the heart, regardless of oxygen status.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Digestion: absorption in jejunum, water in colon. Pepsin pH 2, trypsin pH 8.',
        'Breathing: VC 4500 mL. Bohr effect: ↑CO₂/↓pH/↑T → right shift, more O₂ release.',
        'Heart: pulmonary artery deoxygenated, pulmonary veins oxygenated. SA → AV → His → Purkinje.',
        'Kidney: GFR ~125 mL/min. Loop of Henle establishes medullary gradient.',
        'Pituitary = master gland. Steroid vs peptide hormones use different receptor pathways.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A long-distance runner trains at high altitude for 4 weeks. What hematological changes would NEET expect?',
      hint: 'Low atmospheric O₂ → low arterial pO₂ → kidney releases erythropoietin → red bone marrow increases RBC production. After 4 weeks, hematocrit + hemoglobin both rise. The runner has more O₂ carrying capacity at sea level afterward — basis of altitude training. NEET physiology questions often combine multiple systems like this.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
