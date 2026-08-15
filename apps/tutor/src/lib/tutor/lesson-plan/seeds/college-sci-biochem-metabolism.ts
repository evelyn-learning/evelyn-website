/**
 * College Biochemistry — Metabolism Overview (glycolysis, TCA, oxidative phosphorylation).
 */

import type { LessonPlan } from '../types';

export const SEED_COLLEGE_SCI_BIOCHEM_METABOLISM: LessonPlan = {
  id: 'evelyn.college.sci.biochem.metabolism.v1',
  title: 'Biochemistry — Cellular Metabolism Overview',
  curriculum: 'CCSS',
  grade: 'college',
  subject: 'science',
  topic: 'biochemistry',
  locale: 'en',
  los: [
    {
      id: 'college.sci.biochem.metabolism',
      description: 'Track glucose through glycolysis, pyruvate oxidation, the TCA cycle, and the electron transport chain; account for ATP yield.',
      standard: 'COLLEGE-BIOCHEM',
    },
  ],
  prerequisites: ['college.sci.introbio.cells'],
  followUps: ['college.sci.biochem.enzymes'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Cellular respiration is HOW life converts food to usable energy — and the math of ATP yield is heavily tested.',
      script: 'Eat a glucose molecule. Cells convert it to ~30-32 ATP through a four-stage process: glycolysis, pyruvate oxidation, TCA cycle, electron transport chain. Each step produces or uses specific cofactors. Today: the map + the ATP arithmetic.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-metabolism',
      kind: 'concept',
      goal: 'Four stages, location, inputs/outputs, ATP/NADH/FADH₂ accounting.',
      keyIdeas: [
        'STAGE 1 — GLYCOLYSIS (cytoplasm): glucose (6C) → 2 pyruvate (3C). Net: −2 ATP invested + 4 ATP produced = +2 ATP. Plus 2 NADH. Anaerobic-capable.',
        'STAGE 2 — PYRUVATE OXIDATION (mitochondrial matrix): each pyruvate → acetyl-CoA + CO₂ + NADH. Per glucose: 2 pyruvate ⟹ 2 NADH + 2 CO₂.',
        'STAGE 3 — TCA / KREBS CYCLE (mitochondrial matrix): each acetyl-CoA spins the cycle once. Per cycle: 3 NADH, 1 FADH₂, 1 GTP (≈ ATP), 2 CO₂. Per glucose (2 acetyl-CoA): 6 NADH, 2 FADH₂, 2 GTP, 4 CO₂.',
        'STAGE 4 — OXIDATIVE PHOSPHORYLATION / ETC (inner mito membrane): NADH + FADH₂ donate electrons to the chain → pumps H⁺ into intermembrane space → H⁺ flows back through ATP synthase → ATP.',
        '  Each NADH ≈ 2.5 ATP. Each FADH₂ ≈ 1.5 ATP. (Older textbooks say 3 and 2; modern measurements give the lower numbers.)',
        '  Final electron acceptor: O₂ → H₂O (this is why cellular respiration is AEROBIC).',
        'TOTAL PER GLUCOSE (modern accounting):',
        '  Glycolysis: 2 ATP + 2 NADH (cytoplasmic NADH ≈ 1.5 each in many cell types because shuttle costs).',
        '  Pyruvate oxidation: 2 NADH (mitochondrial).',
        '  TCA: 6 NADH + 2 FADH₂ + 2 ATP.',
        '  ETC: NADH × 2.5 + FADH₂ × 1.5.',
        '  Sum: 2 + 2 + 2(1.5) + 2(2.5) + 6(2.5) + 2(1.5) ≈ 30-32 ATP per glucose.',
        'WITHOUT OXYGEN (fermentation): glycolysis still runs (2 ATP), but pyruvate is converted to lactate (animals) or ethanol+CO₂ (yeast) to regenerate NAD⁺. No TCA, no ETC.',
        'OTHER FUELS feed the same machinery: amino acids enter at TCA intermediates, fatty acids undergo β-oxidation → acetyl-CoA (much higher ATP yield per carbon).',
      ],
      vocabulary: [
        { term: 'oxidative phosphorylation', definition: 'ATP synthesis driven by the electron transport chain and ATP synthase, using a proton gradient across the inner mitochondrial membrane.' },
        { term: 'NADH / FADH₂', definition: 'electron carriers; deliver high-energy electrons from oxidation reactions to the ETC.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'A muscle cell working anaerobically (without O₂) processes 1 glucose. How much ATP does it produce, and what happens to the pyruvate?',
      steps: [
        'No O₂ ⟹ no ETC, no TCA function (NAD⁺ depleted otherwise).',
        'Only GLYCOLYSIS runs: net 2 ATP + 2 NADH.',
        'To regenerate NAD⁺ (so glycolysis can continue), pyruvate is reduced to LACTATE by lactate dehydrogenase, oxidising NADH back to NAD⁺.',
        'Net ATP per glucose: 2 (glycolysis) only. Vs ~30 with O₂. Anaerobic is fast but inefficient.',
        'Lactate accumulates → muscle "burn" during sprinting; cleared by liver later (Cori cycle).',
      ],
      answer: '2 ATP; pyruvate → lactate (regenerates NAD⁺).',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Cyanide blocks Complex IV in the ETC. Why is this rapidly fatal?',
      expectedAnswer: 'Complex IV transfers electrons to O₂. Block it, and the entire ETC backs up: NADH and FADH₂ can\'t unload, so they stay reduced. TCA halts because NAD⁺/FAD aren\'t regenerated. Glycolysis can briefly continue (with NAD⁺ regeneration via lactate fermentation) but yields only 2 ATP per glucose — far from cellular ATP demand. Cells, especially neurons and cardiomyocytes, fail rapidly. Death follows within minutes.',
      responseFormat: 'free',
      hints: [
        'What feeds Complex IV? What happens upstream when it\'s blocked?',
        'How much ATP can be made without ETC?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-old-atp-count',
      kind: 'misconception_check',
      question: 'A student writes "glucose → 38 ATP." Why might this be marked wrong on a modern biochemistry exam?',
      commonErrors: [
        {
          answer: 'Reports 38 ATP per glucose',
          misconception: 'Using outdated stoichiometry.',
          correctsTo: 'Older textbooks claimed 3 ATP per NADH and 2 per FADH₂, totalling 38. Modern direct measurements give ≈ 2.5 per NADH and ≈ 1.5 per FADH₂ — totalling ~30-32 ATP. The difference reflects proton-pumping stoichiometry and shuttle costs (cytoplasmic NADH must be transported into the mitochondrion). Modern textbooks (Lehninger, Berg) use 30-32. Use the modern numbers unless your instructor specifies otherwise.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Glycolysis (cytoplasm): glucose → 2 pyruvate, +2 ATP +2 NADH.',
        'Pyruvate ox + TCA (matrix): +6 NADH, 2 FADH₂, 2 GTP, 4 CO₂ per glucose.',
        'ETC (inner mito membrane): NADH×2.5, FADH₂×1.5 ATP each. O₂ is final electron acceptor.',
        'Total per glucose: ~30-32 ATP (modern).',
        'No O₂ → fermentation: 2 ATP + lactate (or ethanol).',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
