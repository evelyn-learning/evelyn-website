/**
 * Biology — Unit 1 CED 1.4: Enzymes & Reaction Rates.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.bio.enzymes.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_BIO_U1_ENZYMES: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.bio.enzymes.v1',
  course: 'Biology',
  cedUnit: 1,
  cedTopic: '1.4',
  cedTitle: 'Enzymes & Reaction Rates',
  planId: 'evelyn.hs.bio.enzymes.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.bio.enzymes.v1' }],
  theory: [
    { loId: 'bio.enzymes', kind: 'framework', title: 'Enzymes are protein catalysts', content: `ENZYMES ARE PROTEIN CATALYSTS — an enzyme is a protein folded into a precise 3D shape that speeds up one specific chemical reaction in a cell. Catalase speeds up 2H2O2 → 2H2O + O2; lactase breaks lactose into two smaller sugars.` },
    { loId: 'bio.enzymes', kind: 'framework', title: 'They lower activation energy', content: `THEY LOWER ACTIVATION ENERGY — every reaction needs a starting push, the ACTIVATION ENERGY, to get going. The enzyme lowers that barrier so far more molecules can get over it at body temperature. The reaction was always going to happen; the enzyme decides how FAST.` },
    { loId: 'bio.enzymes', kind: 'framework', title: 'What they do not change', content: `WHAT THEY DO NOT CHANGE — an enzyme does NOT supply energy, and it does NOT make an impossible reaction possible. It changes the SPEED, not whether the reaction releases or requires energy overall.` },
    { loId: 'bio.enzymes', kind: 'framework', title: 'Active site and specificity', content: `ACTIVE SITE AND SPECIFICITY — the SUBSTRATE (the molecule being changed) binds in a small pocket called the ACTIVE SITE. Its shape and chemistry match one substrate, which is why lactase cannot digest starch. INDUCED FIT: the active site tightens slightly around the substrate as it binds, straining the bonds that need to break — it is a flexible glove, not a rigid lock.` },
    { loId: 'bio.enzymes', kind: 'framework', title: 'Enzymes are reusable', content: `ENZYMES ARE REUSABLE — the enzyme releases the products unchanged and immediately grabs another substrate molecule. It is NOT consumed and NOT a reactant. One catalase molecule can process millions of H2O2 molecules per second, which is why a tiny amount of enzyme handles a huge amount of substrate.` },
    { loId: 'bio.enzymes', kind: 'framework', title: 'Temperature', content: `TEMPERATURE — rate climbs as temperature rises, because molecules move faster and collide with the active site more often. It peaks at the OPTIMUM (about 37°C for most human enzymes) and then falls off a cliff: above the optimum the protein DENATURES, meaning its folded shape unravels and the active site no longer matches the substrate. Denaturation is usually permanent — a boiled egg never un-boils — and this is why a high fever is dangerous.` },
    { loId: 'bio.enzymes', content: `pH — each enzyme has an optimum pH, because charged and hydrogen-bonded parts of the active site depend on the surrounding acidity. Pepsin in the stomach works best near pH 2; trypsin in the small intestine works best near pH 8. Move an enzyme far from its optimum pH and it denatures the same way heat denatures it.` },
    { loId: 'bio.enzymes', kind: 'framework', title: 'Substrate concentration and saturation', content: `SUBSTRATE CONCENTRATION AND SATURATION — with a fixed amount of enzyme, adding more substrate raises the rate at first, then the curve flattens. At that plateau every active site is already occupied the instant it empties: the enzyme is SATURATED, and the only way to go faster is to add more enzyme.` },
    { loId: 'bio.enzymes', kind: 'framework', title: 'Inhibitors', content: `INHIBITORS — a COMPETITIVE inhibitor resembles the substrate and parks in the active site itself, so substrate and inhibitor compete; flooding the system with extra substrate outcompetes it and the rate recovers. A NONCOMPETITIVE inhibitor binds a different spot on the enzyme and bends the whole protein so the active site no longer fits; extra substrate does NOT help, because the problem is not competition for the pocket.` },
    { loId: 'bio.enzymes', kind: 'definition', title: 'substrate', content: 'the molecule an enzyme acts on, which binds in the active site.' },
    { loId: 'bio.enzymes', kind: 'definition', title: 'activation energy', content: `the energy barrier a reaction must get over before it can proceed; the enzyme lowers it.` },
    { loId: 'bio.enzymes', kind: 'definition', title: 'denaturation', content: `the unfolding of a protein's 3D shape by heat or extreme pH, which destroys the active site.` },
  ],
  methods: [
    {
      title: 'Worked temperature curve',
      steps: [
        `Read the pattern first: the rate rises from 5°C to a peak at 37°C, then drops hard, and reaches zero by 70°C. That is a peak, not a straight line — so two different effects must be at work on the two sides.`,
        `Explain the rising side (5°C to 37°C): warmer molecules move faster, so substrate collides with the active site more often per second. More successful collisions means a faster rate. 37°C is the optimum.`,
        `Explain the falling side (50°C and 70°C): the extra heat is now shaking the protein apart. The enzyme DENATURES — its folded shape unravels and the active site no longer matches H2O2, so binding fails no matter how fast the molecules are moving.`,
        `Predict the cooling result: denaturation is a change to the protein itself, not just a slowdown. Cooling restores the temperature but not the fold, so the 70°C sample stays at roughly zero bubbles per minute even back at 37°C.`,
      ],
      example: { problem: `A class measures how fast catalase releases oxygen from hydrogen peroxide at five temperatures. The bubbles per minute come out as: 5°C → 8, 20°C → 22, 37°C → 60, 50°C → 15, 70°C → 0. Explain the shape of these results, and predict what happens if the 70°C sample is cooled back down to 37°C.`, solution: `Rate rises to an optimum at 37°C because collisions get more frequent, then collapses above it because the enzyme denatures. Cooling the 70°C sample back to 37°C does not restore activity — the denatured shape does not refold.` },
      relatedLoIds: ['bio.enzymes'],
    },
    {
      title: 'Worked saturation vs used up',
      steps: [
        `Test the claim against the data. If the enzyme were being consumed, the rate would FALL over time toward zero as the supply ran out. Instead it holds steady at a plateau — a constant, sustained rate. That rules out the enzyme being used up.`,
        `Recall what the enzyme does at the molecular level: it binds substrate, converts it, releases the products unchanged, and is immediately free to bind again. It is a reusable tool, not a reactant.`,
        `Explain the plateau properly: with a fixed amount of enzyme there are a fixed number of active sites. At low substrate, many sites sit empty, so adding substrate finds new sites and the rate climbs. Past a certain point every active site is refilled the instant it empties — the enzyme is SATURATED and there is nothing left to speed up.`,
        `Find the fix: the limiting factor is the number of active sites, not the amount of substrate. Adding MORE LACTASE adds more active sites and raises the plateau. (Warming the tube slightly toward the optimum would also help, but past the optimum it would denature the enzyme and the rate would crash.)`,
      ],
      example: { problem: `A student keeps the amount of lactase constant and adds more and more lactose. The rate of sugar breakdown climbs steeply at first, then levels off at a plateau and stops climbing no matter how much lactose is added. The student concludes: "the enzyme must be getting used up." Is that the right explanation? What is actually happening, and what single change would raise the plateau?`, solution: `No — the enzyme is not consumed. The plateau is SATURATION: every active site is already occupied, so extra substrate has nowhere to bind. Adding more lactase raises the plateau.` },
      relatedLoIds: ['bio.enzymes'],
    },
  ],
  pointers: [
    { content: `Two corrections. First, enzymes are NEVER used up by the reaction they catalyze: they release the products unchanged and bind another substrate straight away, which is why a pinch of catalase can clear a whole beaker of H2O2. Second, DENATURATION is not consumption — the enzyme molecule is still there, but heat has unravelled its folded shape so the active site no longer matches the substrate. The reaction stops because the tool is bent out of shape, not because the tool was spent.`, kind: 'common-error' },
    { content: `Enzymes are protein catalysts: they lower the activation energy so a reaction runs far faster. They change the SPEED, not whether the reaction can happen.`, kind: 'tip' },
    { content: `The substrate binds the ACTIVE SITE, which tightens around it (induced fit) — that shape match is why each enzyme handles one specific reaction.`, kind: 'tip' },
    { content: `Enzymes are reusable and never consumed; one enzyme molecule processes substrate after substrate.`, kind: 'tip' },
    { content: `Temperature and pH each have an optimum (about 37°C for most human enzymes). Past it the protein DENATURES — the shape unravels, the active site is lost, and cooling it back down does not fix it.`, kind: 'tip' },
    { content: `A fixed amount of enzyme saturates: past the plateau, add more ENZYME, not more substrate.`, kind: 'tip' },
    { content: `Competitive inhibitors sit in the active site and are beaten by extra substrate; noncompetitive inhibitors bind elsewhere, distort the active site, and extra substrate does not help.`, kind: 'tip' },
    { content: `"Denatured" ≠ "used up." A denatured enzyme is still physically there — its fold has unravelled so the active site no longer fits. Enzymes are never consumed by their reaction. Never write "the enzyme ran out" to explain a stopped reaction.`, kind: 'common-error' },
    { content: `A falling rate over time and a flat plateau mean different things. Falling = something is being depleted (substrate) or destroyed (denaturation). Flat plateau at a steady rate = saturation. Read the shape of the curve before you explain it.`, kind: 'tip' },
    { content: `At the saturation plateau, adding substrate does nothing — the limiting factor is the number of active sites. Say "add more ENZYME," not "add more substrate." Warming helps only up to the optimum; past it the rate crashes.`, kind: 'gotcha' },
    { content: `Enzymes lower activation energy only — they do NOT supply energy, do NOT make an impossible reaction possible, and do NOT change whether the reaction releases or absorbs energy overall. They change the speed, not the outcome.`, kind: 'common-error' },
    { content: `Cooling a boiled enzyme back to 37 °C does not restore activity. Denaturation is a change to the protein's shape, not just a slowdown from low temperature — the fold does not spontaneously come back.`, kind: 'edge-case' },
    { content: `Use "substrate" for the molecule the enzyme acts on and "active site" for the pocket it binds. Don't call the substrate a "product," don't call the enzyme a "reactant," and don't say the enzyme "becomes" the product.`, kind: 'vocab-note' },
    { content: `Test inhibitor type with the substrate-flood question: if excess substrate restores the max rate, it's COMPETITIVE (fighting for the same pocket). If extra substrate doesn't help, it's NONCOMPETITIVE — it binds elsewhere and distorts the active site.`, kind: 'tip' },
    { content: `Say "induced fit," not "lock and key." The active site flexes and tightens around the substrate, straining the bonds — a glove, not a rigid keyhole. Specificity still comes from shape and chemistry matching one substrate.`, kind: 'vocab-note' },
  ],
};
