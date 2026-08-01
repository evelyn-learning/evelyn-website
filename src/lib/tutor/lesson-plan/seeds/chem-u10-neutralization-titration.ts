/**
 * Chemistry — Acids & Bases: Neutralization and Titration Basics.
 *
 * Acid + base → salt + water, and the buret-and-flask experiment that turns
 * that reaction into a measurement (NGSS HS-PS1-2, HS-PS1-7). The 1:1
 * workhorse relation M(acid) × V(acid) = M(base) × V(base) gets equal billing
 * with the two classic traps: assuming equal volumes mean neutralized, and
 * applying the 1:1 shortcut to a diprotic acid.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_CHEM_U10_NEUTRALIZATION_TITRATION: LessonPlan = {
  id: 'evelyn.hs.chem.neutralization-titration.v1',
  title: 'Neutralization & Titration Basics',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'chemistry',
  locale: 'en',
  los: [
    {
      id: 'chem.neutralization-titration',
      standard: 'CHEM-10.3',
      description:
        'Write and reason about acid-base neutralization reactions and use titration data to find an unknown concentration with M(acid) × V(acid) = M(base) × V(base) for 1:1 systems (NGSS HS-PS1-2, HS-PS1-7).',
    },
  ],
  prerequisites: ['chem.ph-scale'],
  followUps: ['chem.nuclear-chemistry-intro'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Neutralization as a controlled cancellation — and titration as the way industry actually measures acid it cannot see.',
      script:
        'A tanker leaks hydrochloric acid onto a highway, and the crew that arrives does not hose it down — they bury it in soda ash, because the fix for an acid is a base. That same cancellation runs in your stomach when an antacid quiets heartburn, and in a water-treatment plant every hour of the day. But here is the harder question: how much base do you need? You cannot see acid, and a bottle labeled "acid" tells you nothing about how much is in there. Today you learn the answer chemists have used for two centuries — a buret, a flask, one drop of dye, and a color change that tells you the exact moment the acid runs out.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-neutralization',
      kind: 'concept',
      goal: 'Neutralization as H⁺ + OH⁻ → H₂O, the titration setup, and the 1:1 relation with its two failure modes.',
      keyIdeas: [
        'NEUTRALIZATION = ACID + BASE → SALT + WATER — a double-replacement reaction. HCl + NaOH → NaCl + H₂O; HNO₃ + KOH → KNO₃ + H₂O. The metal from the base pairs with the nonmetal ion from the acid to make the salt; the leftover H⁺ and OH⁻ make water.',
        'THE REAL REACTION IS TINY — strip out the spectator ions (Na⁺ and Cl⁻ just float there) and every strong-acid/strong-base neutralization is the same net ionic equation: H⁺ + OH⁻ → H₂O. That is why neutralization always releases heat and always drives pH toward the middle of the scale.',
        'MOLES, NOT VOLUMES, CANCEL — one mole of H⁺ cancels one mole of OH⁻. Moles come from moles = molarity × volume in liters, so a small volume of a concentrated acid can out-punch a large volume of a dilute base.',
        'THE EQUIVALENCE POINT — the instant when moles of H⁺ added exactly equal moles of OH⁻ present. Nothing is left over. For a strong acid with a strong base the solution there is neutral, pH 7.',
        'THE 1:1 WORKHORSE — when the acid supplies one H⁺ and the base supplies one OH⁻ (HCl with NaOH, HNO₃ with KOH), equal moles means M(acid) × V(acid) = M(base) × V(base), often written Mₐ × Vₐ = Mᵦ × Vᵦ. Because volume appears on both sides, mL may be used on both sides without converting — the units cancel.',
        'THE SETUP IN WORDS — the solution of KNOWN concentration (the standard solution) goes in the buret, a tall graduated tube with a stopcock at the bottom. A measured volume of the UNKNOWN goes in a flask below, with two or three drops of an indicator such as phenolphthalein. You open the stopcock, swirl constantly, and slow to one drop at a time as the color starts to flash. Read the buret before and after; the difference is the volume delivered.',
        'ENDPOINT vs EQUIVALENCE POINT — the equivalence point is the chemistry (moles balanced); the endpoint is what your eye sees (the first color change that survives 30 seconds of swirling). Phenolphthalein is colorless in acid and pink in base, so a good endpoint is the faintest lasting pink — a dark magenta means you shot past it.',
        'THE TWO TRAPS — (1) equal VOLUMES do not mean neutralized; only equal MOLES do. (2) The 1:1 shortcut fails the moment an acid supplies two H⁺: H₂SO₄ needs twice its own moles of NaOH, so check the balanced equation before you trust the shortcut.',
      ],
      vocabulary: [
        { term: 'neutralization', definition: 'the reaction of an acid with a base to produce a salt and water, driven by H⁺ + OH⁻ → H₂O.' },
        { term: 'titration', definition: 'adding a solution of known concentration from a buret to a measured volume of an unknown until the reaction is exactly complete.' },
        { term: 'equivalence point', definition: 'the point in a titration where moles of H⁺ exactly equal moles of OH⁻.' },
        { term: 'indicator', definition: 'a dye that changes color over a narrow pH range, marking the endpoint of a titration.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-unknown-acid',
      kind: 'worked_example',
      problem:
        'A 40.0 mL sample of hydrochloric acid of unknown concentration is titrated with 0.50 M sodium hydroxide. The buret reads 3.0 mL at the start and 23.0 mL at the faint pink endpoint. Find the molarity of the HCl. Equation: HCl + NaOH → NaCl + H₂O.',
      steps: [
        'Volume of base delivered: read the buret twice and subtract — 23.0 mL − 3.0 mL = 20.0 mL of NaOH. (Never assume the buret started at zero.)',
        'Check the ratio: HCl gives one H⁺, NaOH gives one OH⁻, and the balanced equation is 1:1, so the shortcut M(acid) × V(acid) = M(base) × V(base) is legal here.',
        'Substitute what you know: M(acid) × 40.0 mL = 0.50 M × 20.0 mL. The right side is 10.0, in units of molarity times mL.',
        'Solve: M(acid) = 10.0 ÷ 40.0 = 0.25 M HCl.',
        'Sanity check: the acid needed only half its own volume of base, so the acid must be about half as concentrated as the base — 0.25 M against 0.50 M. ✓',
      ],
      answer: '0.25 M HCl',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-diprotic-trap',
      kind: 'worked_example',
      problem:
        'A student titrates 25.0 mL of 0.10 M sulfuric acid, H₂SO₄, with 0.10 M NaOH and predicts "same molarity, so 25.0 mL of base will do it." The buret actually reads 50.0 mL at the endpoint. Diagnose the error. Equation: H₂SO₄ + 2 NaOH → Na₂SO₄ + 2 H₂O.',
      steps: [
        'Name the move: the student used M(acid) × V(acid) = M(base) × V(base) without checking the balanced equation. That relation is a 1:1 shortcut, not a law.',
        'Why it fails: sulfuric acid is DIPROTIC — each formula unit releases two H⁺. The balanced equation shows 2 NaOH per 1 H₂SO₄, so the base is consumed twice as fast as the shortcut assumes.',
        'Count moles the honest way: moles H₂SO₄ = 0.10 M × 0.0250 L = 0.0025 mol, which supplies 2 × 0.0025 = 0.0050 mol of H⁺.',
        'Match the H⁺: you need 0.0050 mol of OH⁻, so volume = 0.0050 mol ÷ 0.10 M = 0.050 L = 50.0 mL — exactly what the buret showed, and double the student\'s prediction.',
        'The rule that survives: moles of H⁺ must equal moles of OH⁻ every time; the 1:1 volume shortcut is only a convenience when the equation is genuinely 1:1.',
      ],
      answer: '50.0 mL of NaOH — H₂SO₄ supplies two H⁺ per formula unit, so the 1:1 shortcut underestimates by half',
      estimatedMinutes: 3,
    },
    {
      id: 'try-endpoint',
      kind: 'try_yourself',
      problem:
        'A flask holds 25.0 mL of NaOH of unknown concentration plus three drops of phenolphthalein, so the solution is bright pink. HCl is added from a buret while the flask is swirled. Which observation marks the endpoint?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The pink color disappears and the solution stays colorless after continued swirling', correct: true },
        { id: 'b', text: 'The volume of acid added equals the 25.0 mL of base in the flask' },
        { id: 'c', text: 'The flask stops feeling warm to the touch' },
        { id: 'd', text: 'Bubbles stop rising through the solution' },
      ],
      expectedAnswer: 'The pink color disappears and the solution stays colorless after continued swirling',
      hints: [
        'Phenolphthalein is pink in base and colorless in acid. What must happen to the color as the last of the OH⁻ is used up?',
        'Two of the choices describe things that never happen in this titration, and one assumes equal volumes mean equal moles.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-concentration-reasoning',
      kind: 'try_yourself',
      problem:
        'A 20.0 mL sample of KOH requires 40.0 mL of 0.10 M HCl to reach the equivalence point. The reaction is 1:1. Without finishing the arithmetic, what must be true of the KOH concentration?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It is greater than 0.10 M, because the same number of moles was packed into half the volume', correct: true },
        { id: 'b', text: 'It is less than 0.10 M, because it took a larger volume of acid to neutralize it' },
        { id: 'c', text: 'It is exactly 0.10 M, because the reaction is 1:1' },
        { id: 'd', text: 'It cannot be judged without knowing the mass of KOH used' },
      ],
      expectedAnswer: 'It is greater than 0.10 M, because the same number of moles was packed into half the volume',
      hints: [
        'At the equivalence point the moles of OH⁻ in the flask equal the moles of H⁺ delivered — those totals are equal no matter what the volumes are.',
        'Equal moles sitting in 20.0 mL instead of 40.0 mL means a higher concentration, not a lower one.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'A 25.0 mL sample of hydrochloric acid is exactly neutralized by 50.0 mL of 0.10 M sodium hydroxide. The reaction is HCl + NaOH → NaCl + H₂O, a 1:1 ratio. What is the molarity of the HCl? Type your answer as a number, without units.',
      responseFormat: 'numeric',
      expectedAnswer: '0.2',
      hints: [
        'Use M(acid) × V(acid) = M(base) × V(base). Volume may stay in mL on both sides because the units cancel.',
        'M(acid) × 25.0 = 0.10 × 50.0 = 5.0, so M(acid) = 5.0 ÷ 25.0.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-volumes-and-strength',
      kind: 'misconception_check',
      question:
        'A student titrates two acid samples with the same 0.10 M NaOH. Sample A (25.0 mL) reaches the endpoint after 10.0 mL of base; sample B (25.0 mL) takes 30.0 mL. The student concludes: "Sample B must be the stronger acid, and anyway a titration is finished once you have added the same volume of base as the acid you started with." What is wrong with each part?',
      commonErrors: [
        {
          answer: 'Neutralization is complete when the two volumes are equal',
          misconception: 'Treating volume as if it counted particles, so 25 mL of anything is assumed to cancel 25 mL of anything else.',
          correctsTo:
            'Only MOLES cancel: one H⁺ per one OH⁻. Moles = molarity × volume, so a volume tells you nothing until you multiply by concentration. Sample A finished at 10.0 mL and sample B at 30.0 mL — neither one at 25.0 mL — precisely because the concentrations differ.',
        },
        {
          answer: 'The sample that used more base is the stronger acid',
          misconception: 'Confusing CONCENTRATION (how much acid is dissolved per liter) with STRENGTH (how completely an acid ionizes).',
          correctsTo:
            'A titration measures concentration, not strength. Sample B took three times the base, so it is three times as CONCENTRATED — 0.12 M against 0.04 M. Strength is a property of the acid itself; a dilute solution of a strong acid can need less base than a concentrated solution of a weak one.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Neutralization: acid + base → salt + water, and underneath every strong-acid/strong-base case sits the same net reaction H⁺ + OH⁻ → H₂O.',
        'The equivalence point is where moles of H⁺ equal moles of OH⁻ — moles cancel, volumes do not.',
        'For a genuine 1:1 pair, M(acid) × V(acid) = M(base) × V(base), and mL may be used on both sides because the volume units cancel.',
        'The setup: known solution in the buret, measured unknown plus indicator in the flask, swirl, and stop at the faintest lasting color change (the endpoint). Subtract the two buret readings to get the volume delivered.',
        'The two traps: equal volumes ≠ neutralized, and the 1:1 shortcut breaks for a diprotic acid like H₂SO₄, which needs two OH⁻ per formula unit.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.3', cedTitle: 'Neutralization & Titration Basics' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
