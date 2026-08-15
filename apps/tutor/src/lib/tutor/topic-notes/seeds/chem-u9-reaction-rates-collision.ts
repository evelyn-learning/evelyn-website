/**
 * Chemistry — Unit 9 topic 9.3: Reaction Rates & Collision Theory.
 *
 * Baseline topic notes distilled from the lesson plan
 * src/lib/tutor/lesson-plan/seeds/chem-u9-reaction-rates-collision.ts
 * (planId evelyn.hs.chem.reaction-rates-collision.v1).
 *
 * Bump baselineVersion when content materially changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'chem.reaction-rates-collision';

export const BASELINE_CHEM_U9_REACTION_RATES_COLLISION: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.chem.reaction-rates-collision.v1',
  course: 'Chemistry',
  cedUnit: 9,
  cedTopic: '9.3',
  cedTitle: 'Reaction Rates & Collision Theory',
  planId: 'evelyn.hs.chem.reaction-rates-collision.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-31',
  sources: [{ type: 'plan', planId: 'evelyn.hs.chem.reaction-rates-collision.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'formula',
      title: 'What rate means',
      content:
        'Reaction rate = how fast a reactant disappears or a product appears per unit time. Average rate = (change in concentration) ÷ (time elapsed), reported as a POSITIVE number: 0.60 M ÷ 30 s = 0.02 M/s. Bigger number = faster reaction.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Collision theory — the one engine',
      content:
        'Particles react only when they COLLIDE, and a collision works only if it carries enough ENERGY and arrives with the correct ORIENTATION. Every rate factor below acts by changing the number of SUCCESSFUL collisions per second — there is no other mechanism.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Activation energy (Eₐ)',
      content:
        'The minimum energy a collision must carry to break the old bonds and start forming new ones — the hill between reactants and products. Collisions below Eₐ just bounce apart. Eₐ is separate from ΔH: a reaction can be strongly exothermic and still slow, which is why paper does not ignite on its own.',
    },
    {
      loId: LO,
      kind: 'shifter-list',
      title: 'The five rate factors',
      content:
        '(1) CONCENTRATION / pressure for gases — more particles per volume → more collisions per second. (2) TEMPERATURE — the strongest dial. (3) SURFACE AREA — only for reactions involving a solid; grinding exposes more boundary. (4) CATALYST — lower-Eₐ alternative pathway. (5) NATURE OF THE REACTANTS — free ions in solution react almost instantly, strong covalent bonds (N₂ triple bond) react slowly.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Why temperature dominates',
      content:
        'Raising T does two things: particles move faster so collisions are more frequent, AND — the decisive effect — a much larger FRACTION of collisions now carries at least Eₐ. Rule of thumb: rate roughly doubles per 10 °C rise. A refrigerator does not stop spoilage; it runs the dial backwards.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Catalyst',
      content:
        'A substance that speeds a reaction by offering an alternative pathway with a LOWER Eₐ, so a larger fraction of the collisions already happening now succeeds. It is regenerated, not consumed, and can be written on both sides of the equation. Enzymes are the body\'s; platinum in a catalytic converter is a car\'s.',
    },
  ],
  methods: [
    {
      title: 'Average-rate calculation from a concentration change',
      when_to_use:
        'Given a starting and final concentration plus an elapsed time, asked for the average rate in M/s (mol/L/s).',
      steps: [
        'Find the amount consumed (or produced): |final concentration − initial concentration|.',
        'Divide by the elapsed time.',
        'Report as a POSITIVE number with units M/s, even for a reactant being used up.',
      ],
      example: {
        problem: '[A] falls from 1.20 M to 0.40 M over 40 seconds. Find the average rate.',
        solution: '1.20 − 0.40 = 0.80 M consumed. 0.80 ÷ 40 = 0.02 M/s.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Name the factor and explain via collision theory',
      when_to_use:
        'A described change (blowing on coals, crushing a tablet, chilling milk, adding a pinch of powder) with "why is it faster/slower?"',
      steps: [
        'Identify what physically changed: how many particles per volume, how fast they move, how much solid boundary is exposed, or whether a new pathway appeared.',
        'Map it to one of the five factors — concentration, temperature, surface area, catalyst, nature of the reactants.',
        'State the direction: faster or slower.',
        'Justify in collision-theory language — more/fewer collisions per second, or a larger/smaller fraction of collisions clearing Eₐ. Never stop at "particles move faster".',
      ],
      example: {
        problem: 'A whole antacid tablet is replaced by the same tablet crushed to powder.',
        solution:
          'SURFACE AREA, faster. The reaction happens only where solid touches water; powder exposes vastly more boundary, so acid particles collide with tablet particles far more often. The amount of substance is unchanged.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Evaluate a catalyst claim',
      when_to_use:
        'Any statement about what a catalyst did — especially claims about yield, consumption, or activation energy.',
      steps: [
        'Check the YIELD claim: a catalyst never changes how much product forms. It lowers the hill, it does not move the endpoints, so ΔH and the final amounts are untouched.',
        'Check the CONSUMPTION claim: the catalyst is regenerated by the end of the cycle — temporarily bound during the alternative pathway, then released unchanged.',
        'Check the MECHANISM claim: the lower Eₐ means a larger FRACTION of the collisions already happening now succeeds. Same collisions, more of them productive.',
        'Rewrite the claim in one sentence: lower Eₐ → same yield, sooner.',
      ],
      example: {
        problem:
          '"We added a catalyst, so we got more product, and the catalyst got used up doing it."',
        solution:
          'Both halves are wrong. The catalyst provided a lower-Eₐ pathway so the reaction reached the SAME final amount of product faster, and it was not consumed — a pinch of MnO₂ decomposes a whole bottle of H₂O₂ and is still there afterwards.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    {
      content:
        'A catalyst is not consumed and does not make more product. It only gets you to the same finish line sooner.',
      kind: 'common-error',
      relatedLoIds: [LO],
    },
    {
      content:
        'Temperature is not just "particles bump more often" — the decisive effect is the jump in the FRACTION of collisions carrying at least Eₐ. Answers that stop at frequency lose the point.',
      kind: 'gotcha',
      relatedLoIds: [LO],
    },
    {
      content:
        'Heating does NOT lower Eₐ. Eₐ is a property of the pathway; only a catalyst changes it.',
      kind: 'common-error',
      relatedLoIds: [LO],
    },
    {
      content:
        'Surface area only matters when a solid is involved. Grinding does nothing for two gases already mixed, and crushing does not change how much substance is present.',
      kind: 'edge-case',
      relatedLoIds: [LO],
    },
    {
      content:
        'Do not read ΔH as speed. A low Eₐ means fast; a negative ΔH means energy-releasing. Rusting is exothermic and takes years.',
      kind: 'gotcha',
      relatedLoIds: [LO],
    },
  ],
};
