/**
 * Chemistry — Atomic Structure: Development of the Atomic Model.
 *
 * How evidence rebuilt the atom (NGSS HS-PS1-1): Dalton's indivisible
 * spheres, Thomson's electrons, Rutherford's nucleus, Bohr's energy
 * levels, and the quantum cloud. The star misconception gets equal
 * billing — each model refined the last one instead of erasing it, and
 * the gold-foil conclusion belongs to the RARE deflections, not the
 * particles that sailed straight through.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_CHEM_U2_ATOMIC_THEORY: LessonPlan = {
  id: 'evelyn.hs.chem.atomic-theory.v1',
  title: 'Development of the Atomic Model',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'chemistry',
  locale: 'en',
  los: [
    {
      id: 'chem.atomic-theory',
      standard: 'CHEM-2.1',
      description:
        'Trace how experimental evidence — cathode rays, the gold-foil scattering experiment, and atomic line spectra — drove the atomic model from Dalton\'s indivisible sphere to the nuclear, energy-level, and quantum-cloud models (NGSS HS-PS1-1).',
    },
  ],
  prerequisites: ['chem.density-dimensional-analysis'],
  followUps: ['chem.subatomic-particles-isotopes'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Nobody has ever seen an atom — so how does anyone know what is inside one? By throwing things at it and watching what bounces.',
      script:
        'The smoke detector on your ceiling works because a speck of americium fires particles across a tiny gap, and smoke blocks them. That trick only exists because a century ago somebody fired the same kind of particles at a sheet of gold foil to find out what an atom looks like inside — and a handful of them came flying back. Nobody has ever looked at an atom directly. Everything we claim about the inside of one was pried out of experiments like that. Today we walk the evidence trail: what each experiment showed, and how the picture of the atom got rebuilt four times because of it.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-model-history',
      kind: 'concept',
      goal: 'Four models, each forced by one experiment the previous model could not explain — plus the two classic traps about what the gold foil actually proved.',
      keyIdeas: [
        'A MODEL IS EVIDENCE-DRIVEN, NOT A GUESS — a scientific model of the atom survives exactly as long as it explains every observation. The moment an experiment produces a result the model cannot account for, the model gets EXTENDED, not thrown in the trash.',
        'DALTON (1803) — SOLID SPHERES — matter is made of tiny indivisible atoms; all atoms of an element are identical; compounds are atoms combined in fixed whole-number ratios; reactions only REARRANGE atoms. This is what explains conservation of mass and why water is always 8 g of oxygen per 1 g of hydrogen. The "indivisible" and "identical" parts are the only pieces later work overturned.',
        'THOMSON (1897) — THE ELECTRON — a cathode-ray tube beam bent toward a positive plate, and the same negative particle appeared no matter which metal the cathode was made of. Conclusion: every atom contains negatively charged e⁻, so atoms are NOT indivisible. His plum-pudding model put those electrons inside a soft, spread-out sphere of positive charge.',
        'RUTHERFORD (1911) — THE NUCLEUS — fast, heavy, positive alpha particles were fired at gold foil. TWO separate observations, TWO separate conclusions: nearly all passed straight through → the atom is mostly EMPTY space; roughly 1 in 8,000 deflected sharply or bounced back → all the positive charge and nearly all the mass sit in a tiny, dense central NUCLEUS. A smeared-out pudding could never reverse an alpha particle.',
        'BOHR (1913) — ENERGY LEVELS — heated hydrogen gas emits only a few sharp colored lines, never a full rainbow. Only certain energies come out, so electrons can only hold certain energies: they occupy fixed energy levels, and light is released when an electron drops from a higher level to a lower one. Beautiful for hydrogen, but it breaks down for atoms with many electrons.',
        'QUANTUM / CLOUD MODEL (1926 onward) — electrons are not beads on tracks. An orbital is a REGION OF PROBABILITY — where an electron is likely to be found, not a path it follows. Bohr\'s energy levels survived into this model; his circular orbits did not. This is the model behind electron configuration and every bonding rule ahead.',
        'THE SCALE TRAP — the nucleus is about 1/100,000 the diameter of the whole atom. If the atom were a football stadium, the nucleus would be a marble at the center. Every textbook drawing exaggerates the nucleus enormously, which is exactly why "mostly empty space" feels wrong.',
        'THE TRAP: "EACH MODEL PROVED THE LAST ONE WRONG" — no. Each new model kept everything the old one explained and added the piece it could not. Dalton\'s conservation of mass is still true today; Thomson\'s electron is still in the quantum model. Refinement, not demolition.',
      ],
      vocabulary: [
        { term: 'cathode ray', definition: 'the stream of electrons emitted from the negative electrode of an evacuated tube.' },
        { term: 'nucleus', definition: 'the tiny, dense, positively charged core that holds nearly all of an atom\'s mass.' },
        { term: 'orbital', definition: 'a region around the nucleus where an electron is likely to be found, rather than a fixed path.' },
      ],
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-gold-foil',
      kind: 'worked_example',
      problem:
        'Rutherford fired fast, heavy, positively charged alpha particles at a sheet of gold foil only a few hundred atoms thick. Nearly all of them passed straight through undeflected; about 1 in 8,000 was deflected through a large angle, and a few came almost straight back. State what each result reveals about the structure of the atom, and explain why the plum-pudding model cannot account for the second one.',
      steps: [
        'Start from the prediction. In the plum-pudding model the positive charge is spread thinly through the whole atom, and electrons are far too light to push a heavy alpha particle around. That model predicts EVERY alpha particle slips through with, at most, a tiny nudge.',
        'Observation A — nearly all pass straight through, undeflected. Whatever they are hitting cannot fill the atom. The overwhelming majority of an atom\'s volume must be empty space that a particle can cross without meeting anything.',
        'Observation B — about 1 in 8,000 turns sharply, and a few reverse. To reverse a fast, massive, positive particle you need a target that is (i) positively charged, so it repels, and (ii) much MORE massive than the alpha, so it does not simply get knocked aside. Thinly spread pudding fails both tests.',
        'Combine the two. The target must be tiny (because hits are rare) yet carry the positive charge and nearly all the mass (because it can throw an alpha backward). That is the nucleus, with the electrons occupying the huge empty volume around it.',
        'Notice that the RARITY is the evidence, not a nuisance: 1 in 8,000 is exactly what you expect when the target is minuscule compared with the atom.',
      ],
      answer:
        'Straight-through particles → the atom is mostly empty space; the rare large deflections and backscatter → a tiny, dense, positive nucleus that plum pudding cannot produce',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-evidence-mismatch',
      kind: 'worked_example',
      problem:
        'A student writes: "Rutherford\'s gold-foil experiment showed that most of the alpha particles bounced back, which proved the atom is one big ball of positive charge and that Thomson had been completely wrong." Find every flaw and give the corrected statement.',
      steps: [
        'Flaw 1 — the numbers are inverted. Most alpha particles did NOT bounce back; nearly all went straight through. Only about 1 in 8,000 deflected strongly. Getting this backwards destroys the whole argument, because the straight-through majority is what proves the atom is mostly empty.',
        'Flaw 2 — the observation is matched to the wrong conclusion. The nucleus conclusion comes from the RARE backscatter, not from the particles that sailed through. Each observation carries its own conclusion: many through → empty space; few reversed → concentrated positive mass.',
        'Flaw 3 — "one big ball of positive charge" is the opposite of the finding. If the positive charge filled the atom, deflections would be common, not one in thousands. The evidence points to a nucleus roughly 1/100,000 of the atom\'s diameter.',
        'Flaw 4 — "Thomson had been completely wrong" misreads how models grow. Thomson\'s electron was confirmed, not deleted; Rutherford kept the electrons and only relocated the positive charge from a spread-out sphere into a tiny core.',
        'Corrected statement: nearly all alpha particles passed straight through, showing the atom is mostly empty space, while the rare large-angle deflections showed that the positive charge and nearly all the mass are concentrated in a very small nucleus — a refinement of Thomson\'s model that kept his electrons.',
      ],
      answer:
        'Most passed through (empty space); the rare backscatter (not the majority) revealed a tiny dense positive nucleus — refining Thomson rather than discarding him',
      estimatedMinutes: 3,
    },
    {
      id: 'try-nucleus-evidence',
      kind: 'try_yourself',
      problem:
        'In the gold-foil experiment, which observation is the direct evidence that an atom contains a tiny, dense, positively charged nucleus?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A small fraction of alpha particles were deflected through large angles or bounced almost straight back', correct: true },
        { id: 'b', text: 'Nearly all of the alpha particles passed straight through the foil undeflected' },
        { id: 'c', text: 'The gold foil glowed where the beam struck it' },
        { id: 'd', text: 'The alpha particles slowed down as they crossed the foil' },
      ],
      expectedAnswer: 'A small fraction of alpha particles were deflected through large angles or bounced almost straight back',
      hints: [
        'Each observation supports a different conclusion. Which one requires something heavy AND positive to push back on?',
        'Particles that pass through untouched tell you about empty space. Only the ones that reverse can reveal a concentrated core.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-line-spectra',
      kind: 'try_yourself',
      problem:
        'Heated hydrogen gas emits only a few sharp, separate colored lines instead of a continuous rainbow. What did Bohr conclude from this?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Electrons can occupy only specific energy levels, so only certain energy jumps — and therefore only certain colors — are possible', correct: true },
        { id: 'b', text: 'A hydrogen atom contains exactly one electron for each colored line observed' },
        { id: 'c', text: 'The nucleus, not the electrons, releases the light when the gas is heated' },
        { id: 'd', text: 'Hydrogen exists as several different elements, each one producing its own line' },
      ],
      expectedAnswer: 'Electrons can occupy only specific energy levels, so only certain energy jumps — and therefore only certain colors — are possible',
      hints: [
        'A color corresponds to a specific energy of emitted light. If only a few colors appear, only a few energies are being released.',
        'The light is released when an electron drops between levels. Restricted colors mean restricted levels.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'Dalton\'s atomic theory says atoms are only rearranged during a reaction — never created or destroyed — so the total mass of the products equals the total mass of the reactants. Inside a sealed flask, 4.0 g of hydrogen gas reacts completely with oxygen gas to form 36.0 g of water, with nothing left over. What mass of oxygen gas, in grams, was consumed? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '32',
      hints: [
        'The flask is sealed, and Dalton says atoms are only rearranged — so the reactant masses must add up to the product mass.',
        'mass of hydrogen + mass of oxygen = 36.0 g, and the hydrogen is 4.0 g.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-planetary-orbits',
      kind: 'misconception_check',
      question:
        'A student says: "Bohr\'s model is the accepted one, so electrons travel in circular orbits around the nucleus the way planets orbit the sun." What is wrong with this reasoning?',
      commonErrors: [
        {
          answer: 'Electrons follow fixed circular paths around the nucleus',
          misconception: 'Treating the drawn Bohr diagram as a literal picture of electron motion, and treating the most familiar model as the most current one.',
          correctsTo:
            'Bohr\'s lasting contribution is that electron ENERGY is restricted to specific levels — that part survived. The circular path did not. In the quantum model that replaced it, an electron occupies an ORBITAL: a region where the electron is likely to be found, with no trackable path at all. Bohr diagrams are kept because they are easy to draw, not because electrons move in circles.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Models change because of EVIDENCE: Dalton (indivisible spheres) → Thomson (electrons in a positive pudding) → Rutherford (tiny dense nucleus) → Bohr (fixed energy levels) → quantum cloud (orbitals as probability regions).',
        'Gold foil, two results, two conclusions: nearly all straight through → atom is mostly empty space; about 1 in 8,000 deflected or reversed → tiny, dense, positive nucleus.',
        'Line spectra are the fingerprint of restricted energy: only certain colors come out because electrons can only hold certain energies.',
        'The nucleus is roughly 1/100,000 the diameter of the atom — every textbook picture draws it far too big.',
        'The trap: new models refine old ones, they do not erase them. Dalton\'s conservation of mass and Thomson\'s electron are both still part of chemistry today.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.1', cedTitle: 'Development of the Atomic Model' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
