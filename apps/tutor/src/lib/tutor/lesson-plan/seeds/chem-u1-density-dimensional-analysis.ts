/**
 * Chemistry — Chemistry Foundations: Density & Dimensional Analysis.
 *
 * Density as an identity fingerprint plus the factor-label method
 * (NGSS HS-PS1-3, SEP-5): d = m/V read as a conversion factor, units
 * cancelling diagonally, and the two classic wrecks — flipping the
 * formula and confusing "dense" with "heavy". Every number lands on a
 * clean integer or two-decimal value.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_CHEM_U1_DENSITY_DIMENSIONAL_ANALYSIS: LessonPlan = {
  id: 'evelyn.hs.chem.density-dimensional-analysis.v1',
  title: 'Density & Dimensional Analysis',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'chemistry',
  locale: 'en',
  los: [
    {
      id: 'chem.density-dimensional-analysis',
      standard: 'CHEM-1.4',
      description:
        'Calculate density from mass and volume, use density as a conversion factor to identify substances, and convert between units by the factor-label method so that unwanted units cancel (NGSS HS-PS1-3, SEP-5).',
    },
  ],
  prerequisites: ['chem.measurement-sig-figs'],
  followUps: ['chem.atomic-theory'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Density as a fingerprint you can weigh, and unit conversion as the skill that keeps real projects from crashing.',
      script:
        'A jeweler hands you a gold-colored ring. No acid, no scratching — just a scale and a cup of water, and in two minutes you can say whether it is gold or brass. That is density: every pure substance carries a fixed mass-per-volume fingerprint, and forensic labs, oil-spill responders, and blood banks all read it. The flip side is what happens when units go unchecked: NASA lost a 125-million-dollar Mars orbiter in 1999 because one team wrote force in pounds and another read it as newtons. Today you learn both halves — density as a conversion factor, and dimensional analysis, the unit bookkeeping that catches that mistake before it flies.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-density-factor-label',
      kind: 'concept',
      goal: 'Density as an intensive ratio and as a conversion factor, the factor-label method, and the classic flip / cubed-unit traps.',
      keyIdeas: [
        'DENSITY IS A RATIO, NOT AN AMOUNT — density = mass ÷ volume (d = m/V). It answers "how much mass is packed into each unit of volume", so it is an INTENSIVE property: one drop of mercury and a full flask of mercury both have density 13.6 g/mL.',
        'THE THREE-WAY FORMULA — from d = m/V come m = d × V and V = m/d. Cover the quantity you want in the triangle m over d·V and the other two show you the operation. Substances are identified by comparing a measured d to a reference table.',
        'UNITS ADVERTISE THE VOLUME — solids use g/cm³, liquids use g/mL, gases use g/L. The bridge you must memorize: 1 mL = 1 cm³ exactly, so a solid at 2.70 g/cm³ and a liquid at 2.70 g/mL are equally dense.',
        'FINDING VOLUME — a regular solid: multiply length × width × height. An irregular solid: water displacement, where volume = final water level − initial water level. Wrong volume ruins a perfect mass measurement.',
        'DIMENSIONAL ANALYSIS (THE FACTOR-LABEL METHOD) — multiply by conversion factors that equal 1 (1000 g / 1 kg is just "1" in disguise), oriented so the unwanted unit sits on the BOTTOM and cancels. Carry units through every line; if the surviving units are wrong, the arithmetic is wrong, no matter how clean the number looks.',
        'DENSITY IS ITSELF A CONVERSION FACTOR — 13.6 g/mL can be written 13.6 g / 1 mL or flipped to 1 mL / 13.6 g. Grams in, milliliters out: use the flipped form. Volume in, grams out: use the upright form. Choose the orientation by what cancels, never by memorizing "multiply" or "divide".',
        'THE FLOAT TEST — an object sinks in a fluid when it is DENSER than that fluid. Water is 1.00 g/mL, so ice (0.92 g/mL) floats and iron (7.87 g/cm³) sinks — this is why oil spills spread on the surface instead of mixing down.',
        'THE TWO TRAPS — (1) FLIPPING THE FORMULA: writing V/m instead of m/V, which silently inverts the answer; (2) CUBED UNITS: 1 cm = 10 mm, but 1 cm³ = 10³ = 1000 mm³, because the conversion factor gets cubed along with the unit.',
      ],
      vocabulary: [
        { term: 'density', definition: 'the mass of a substance per unit of volume, d = m/V, usually in g/cm³ or g/mL.' },
        { term: 'intensive property', definition: 'a property whose value does not depend on how much of the substance you have, such as density or melting point.' },
        { term: 'conversion factor', definition: 'a ratio equal to 1 that relates two units, used to cancel an unwanted unit and introduce a wanted one.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-identify-metal',
      kind: 'worked_example',
      problem:
        'An unlabeled metal chunk has a mass of 89.6 g. Dropped into a graduated cylinder holding 25.0 mL of water, it raises the level to 35.0 mL. Identify the metal. Reference densities in g/cm³: aluminum 2.70, iron 7.87, copper 8.96, lead 11.3.',
      steps: [
        'Get the volume by displacement: the water rose from 25.0 mL to 35.0 mL, so the chunk occupies 35.0 − 25.0 = 10.0 mL. Since 1 mL = 1 cm³, that is 10.0 cm³.',
        'Apply d = m/V: 89.6 g ÷ 10.0 cm³ = 8.96 g/cm³. Check the units — g divided by cm³ gives g/cm³, exactly what a density should be.',
        'Compare against the reference list: 8.96 g/cm³ matches copper exactly; aluminum is far too light and lead far too heavy for this volume.',
        'Sanity check the size: 10.0 cm³ is about two teaspoons, and a two-teaspoon lump weighing 89.6 g (roughly a third of a cup of water in mass) is convincingly a dense metal, not aluminum.',
      ],
      answer: 'd = 8.96 g/cm³ — the metal is copper',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-flip-trap',
      kind: 'worked_example',
      problem:
        'A lab procedure calls for 39.45 g of ethanol, whose density is 0.789 g/mL, but you can only measure volume. A student writes 39.45 g × 0.789 g/mL = 31.1 and pours 31.1 mL. The correct volume is 50.0 mL. Diagnose the error.',
      steps: [
        'Track the units on the student\'s line: g × (g/mL) gives g²/mL — a unit that does not exist. Dimensional analysis flags the mistake before any arithmetic is checked.',
        'Name the move: the student reached for "multiply by density" out of habit instead of choosing the orientation that cancels grams.',
        'Set it up so grams cancel: 39.45 g × (1 mL / 0.789 g). The g on top cancels the g on the bottom and mL survives — the units now match the question.',
        'Compute: 39.45 ÷ 0.789 = 50.0 mL. Reasonableness check: ethanol is less dense than water, so a given mass of it must occupy MORE than 39.45 mL — 50.0 mL passes, 31.1 mL fails on sight.',
      ],
      answer: '50.0 mL — flip the density to 1 mL / 0.789 g so grams cancel',
      estimatedMinutes: 3,
    },
    {
      id: 'try-intensive',
      kind: 'try_yourself',
      problem:
        'You have two samples cut from the same bar of pure aluminum: a small cube of volume 5.0 cm³ and a large block of volume 20.0 cm³. Which sample has the greater density?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Neither — both have the same density, because density does not depend on sample size', correct: true },
        { id: 'b', text: 'The 20.0 cm³ block, because it has more mass' },
        { id: 'c', text: 'The 5.0 cm³ cube, because the material is packed into a smaller space' },
        { id: 'd', text: 'You cannot tell without measuring the mass of each sample' },
      ],
      expectedAnswer: 'Neither — both have the same density, because density does not depend on sample size',
      hints: [
        'The block has 4 times the volume of the cube — but cut from the same bar, how does its mass compare?',
        'Four times the mass over four times the volume gives the same ratio. Density is an intensive property.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-factor-label-setup',
      kind: 'try_yourself',
      problem:
        'You want to convert 2.5 kg of water into a volume in milliliters, using the density of water, 1.00 g/mL. Which setup cancels units correctly?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '2.5 kg × (1000 g / 1 kg) × (1 mL / 1.00 g)', correct: true },
        { id: 'b', text: '2.5 kg × (1 kg / 1000 g) × (1 mL / 1.00 g)' },
        { id: 'c', text: '2.5 kg × (1000 g / 1 kg) × (1.00 g / 1 mL)' },
        { id: 'd', text: '2.5 kg × (1000 mL / 1 kg)' },
      ],
      expectedAnswer: '2.5 kg × (1000 g / 1 kg) × (1 mL / 1.00 g)',
      hints: [
        'Write the units only and cross off pairs: the starting kg must cancel, then the intermediate g must cancel, leaving mL alone.',
        'Grams have to appear on the BOTTOM of the density factor to cancel the grams you just created — so density enters flipped, as 1 mL / 1.00 g.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'A rectangular block of magnesium measures 2.0 cm by 3.0 cm by 5.0 cm and has a mass of 52.2 g. What is its density in g/cm³? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '1.74',
      hints: [
        'First get the volume of a rectangular solid: length × width × height.',
        'Volume = 2.0 × 3.0 × 5.0 = 30.0 cm³. Now divide the mass by that volume: 52.2 ÷ 30.0 = ?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-dense-vs-heavy',
      kind: 'misconception_check',
      question:
        'A student says: "A steel paperclip sinks and a huge wooden log floats, so the paperclip must be heavier than the log." What is wrong with this reasoning?',
      commonErrors: [
        {
          answer: 'Denser things are heavier',
          misconception: 'Collapsing density (an intensive ratio) into mass (an extensive amount), so sinking is read as "weighs more".',
          correctsTo:
            'The log clearly has far more MASS — but sinking is decided by density, mass PER VOLUME, compared to the fluid. Steel is about 7.9 g/cm³ and wood about 0.5 g/cm³, while water is 1.00 g/mL, so the tiny paperclip sinks and the massive log floats. Always ask "per unit volume?" before calling something dense.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Density = mass ÷ volume (d = m/V); rearranged, m = d × V and V = m/d.',
        'Density is INTENSIVE — a fingerprint of the substance, not of the sample size — which is why it identifies unknown materials.',
        '1 mL = 1 cm³ exactly; solids are quoted in g/cm³, liquids in g/mL, and irregular volumes come from water displacement.',
        'Dimensional analysis: orient every conversion factor so the unwanted unit cancels, and let the surviving units confirm the setup before you touch the arithmetic.',
        'Density flips: use 1 mL / 13.6 g to go grams → volume, and 13.6 g / 1 mL to go volume → grams. Never memorize multiply-or-divide.',
        'Dense ≠ heavy: sinking or floating compares density to the fluid (water 1.00 g/mL), not total mass.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.4', cedTitle: 'Density & Dimensional Analysis' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
