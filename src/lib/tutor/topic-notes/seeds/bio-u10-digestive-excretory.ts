/**
 * Biology — Unit 10 CED 10.3: The Digestive & Excretory Systems.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.bio.digestive-excretory.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_BIO_U10_DIGESTIVE_EXCRETORY: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.bio.digestive-excretory.v1',
  course: 'Biology',
  cedUnit: 10,
  cedTopic: '10.3',
  cedTitle: 'The Digestive & Excretory Systems',
  planId: 'evelyn.hs.bio.digestive-excretory.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.bio.digestive-excretory.v1' }],
  theory: [
    { loId: 'bio.digestive-excretory', kind: 'framework', title: 'Two kinds of digestion, both required', content: `TWO KINDS OF DIGESTION, BOTH REQUIRED — MECHANICAL digestion (chewing, the churning of the stomach, the emulsifying of fat by bile) physically breaks food into smaller pieces. CHEMICAL digestion (enzymes) breaks the chemical bonds. Mechanical work alone would leave you with tiny crumbs no cell could absorb; chemical work alone would be far too slow, because enzymes act on SURFACES and mechanical breakup is what creates that surface. Mechanical digestion makes chemical digestion fast.` },
    { loId: 'bio.digestive-excretory', kind: 'framework', title: 'Mouth, then esophagus', content: `MOUTH, THEN ESOPHAGUS — in the mouth, teeth chew (mechanical) while saliva carries SALIVARY AMYLASE, which starts breaking down CARBOHYDRATES (starch) into smaller sugars. Nothing else is chemically digested there: no protein digestion, no fat digestion. The esophagus then digests nothing at all — it transports. PERISTALSIS is the wave of smooth-muscle contraction that squeezes the food ball along, and it is why an astronaut can swallow upside down: gravity is not doing the work.` },
    { loId: 'bio.digestive-excretory', kind: 'framework', title: 'Stomach', content: `STOMACH — mechanical: muscular churning. Chemical: cells release HYDROCHLORIC ACID, holding the stomach at about pH 2, and the enzyme PEPSIN, which digests PROTEINS. The acid is not just a germ-killer; it unfolds (denatures) proteins so pepsin can reach the bonds, and pepsin only works at that low pH. Salivary amylase, which needs a near-neutral pH, is shut down the moment it arrives — carbohydrate digestion pauses here.` },
    { loId: 'bio.digestive-excretory', kind: 'framework', title: 'Small intestine', content: `SMALL INTESTINE — THE MAIN EVENT — this is where BOTH final chemical digestion AND essentially all ABSORPTION happen. BILE, made by the LIVER and stored in the gallbladder, arrives here: bile is NOT an enzyme and breaks no bonds. It is a detergent-like substance that EMULSIFIES fat, splitting large fat globules into tiny droplets — a mechanical change — so that lipase can reach them. PANCREATIC ENZYMES then finish the job: pancreatic amylase on carbohydrates, proteases on proteins, lipase on fats, all working at the near-neutral pH the pancreas restores with bicarbonate. Everything the meal becomes is finished here.` },
    { loId: 'bio.digestive-excretory', kind: 'framework', title: 'Why the small intestine is so long', content: `WHY THE SMALL INTESTINE IS SO LONG — this is also where the finished molecules are ABSORBED, and the anatomy explains why here rather than in the stomach: its wall is folded, the folds are covered in finger-like VILLI, and each villus cell is covered in MICROVILLI. Folds on folds on folds turn a few meters of tube into roughly the absorbing surface of a tennis court, with capillaries a single cell-layer away. Small nutrient molecules cross that surface into the blood and travel to the liver, then to the cells. SURFACE AREA is the whole design principle. The stomach, by contrast, is a thick muscular sac with no villi and a protective mucus lining, so almost nothing is absorbed there.` },
    { loId: 'bio.digestive-excretory', kind: 'framework', title: 'Enzyme specificity, from unit 1', content: `ENZYME SPECIFICITY, FROM UNIT 1 — each enzyme has one class of substrate: amylase → carbohydrates, pepsin and the pancreatic proteases → proteins, lipase → fats. This is the lock-and-key active site you met with macromolecules and enzymes. Lactose intolerance is exactly this idea: without the enzyme lactase, the sugar lactose is never broken down, so gut bacteria ferment it instead. And after the small intestine, the LARGE INTESTINE does no significant enzyme work at all — its job is REABSORBING WATER (and some ions) from the indigestible remains, plus housing the gut microbiome.` },
    { loId: 'bio.digestive-excretory', content: `THE EXCRETORY SYSTEM: KIDNEY AND NEPHRON — the LIVER makes UREA when excess amino acids are broken down, because their nitrogen would otherwise become toxic ammonia; urea is the safer package the blood carries. The kidney does not manufacture urea, it REMOVES it. Each kidney holds about a million NEPHRONS, and each nephron does three things in order: FILTER blood under pressure at the glomerulus (water, salts, glucose, and urea are all pushed out; blood cells and large proteins stay in), REABSORB what the body needs back into the blood (nearly all the water, all the glucose, needed salts), and EXCRETE what is left — urea, excess salt, excess water — as urine. Dialysis substitutes a machine for that filter-and-reabsorb step when the nephrons fail.` },
    { loId: 'bio.digestive-excretory', kind: 'framework', title: 'The homeostasis tie', content: `THE HOMEOSTASIS TIE — reabsorption is ADJUSTABLE, which is how the kidney holds water balance (lesson 10.1). When you are dehydrated, the pituitary releases ADH (antidiuretic hormone); ADH makes the nephron tubules more permeable to water, so more water returns to the blood and the urine is scant and dark. Drink a liter and ADH falls, less water is reabsorbed, and the urine is pale. Same filtering, different dial setting — and notice the same logic runs the whole unit: break it down, keep what you need, dump the rest.` },
    { loId: 'bio.digestive-excretory', kind: 'definition', title: 'peristalsis', content: `the wave of smooth-muscle contraction that pushes food along the digestive tract.` },
    { loId: 'bio.digestive-excretory', kind: 'definition', title: 'villi', content: `finger-like projections lining the small intestine that multiply its absorbing surface area.` },
    { loId: 'bio.digestive-excretory', kind: 'definition', title: 'bile', content: 'a liver-made fluid that emulsifies fat into small droplets; it is not an enzyme.' },
    { loId: 'bio.digestive-excretory', kind: 'definition', title: 'nephron', content: `the filtering unit of the kidney that filters blood, reabsorbs what the body needs, and excretes urea in urine.` },
  ],
  methods: [
    {
      title: 'Worked trace sandwich',
      steps: [
        `Mouth: teeth chew (mechanical), and salivary amylase begins breaking the bread STARCH into smaller sugars. The cheese protein and fat are untouched — no protease and no lipase are present in saliva.`,
        `Esophagus: peristalsis moves the swallowed ball down. No chemical digestion happens here for any of the three.`,
        `Stomach: churning continues the mechanical work. Hydrochloric acid at about pH 2 denatures the cheese PROTEIN and pepsin begins cutting it. That same low pH shuts salivary amylase off, so starch digestion pauses. Fat is still essentially untouched, and nothing here is absorbed into the blood in any meaningful amount.`,
        `Small intestine, the fat first: bile from the liver emulsifies the cheese FAT into tiny droplets — mechanical, not chemical — so that pancreatic lipase has enough surface to work on and can break the fat into fatty acids and glycerol.`,
        `Small intestine, the other two: pancreatic amylase finishes the starch into single sugars such as glucose, and pancreatic proteases finish the protein into amino acids.`,
        `Absorption: all three end products — glucose, amino acids, and fatty acids — cross the villi and microvilli of the small intestine wall. Sugars and amino acids enter the capillaries and travel by blood to the liver; the remains pass to the large intestine, where water is reabsorbed.`,
      ],
      example: { problem: `A student eats a grilled cheese sandwich: the bread is mostly starch, the cheese supplies protein and fat. Trace each of those three components through the mouth, stomach, and small intestine, naming where each is chemically digested and where each is absorbed.`, solution: `Starch: begins in the mouth (salivary amylase), pauses in the stomach, finishes in the small intestine (pancreatic amylase). Protein: begins in the stomach (pepsin at about pH 2), finishes in the small intestine (proteases). Fat: emulsified by bile and digested by lipase, both in the small intestine. All three are absorbed at the villi of the small intestine.` },
      relatedLoIds: ['bio.digestive-excretory'],
    },
    {
      title: 'Worked stomach absorption error',
      steps: [
        `Grant what is true: the stomach really does do heavy mechanical churning, and it really does begin protein digestion with pepsin at about pH 2. The error is not about digestion — it is about ABSORPTION.`,
        `Separate the two words. DIGESTION is breaking molecules down. ABSORPTION is moving the finished small molecules across a wall into the blood. An organ can be excellent at one and useless at the other.`,
        `Check the stomach against what absorption requires. Absorption needs enormous surface area and a thin exchange wall. The stomach is a thick, muscular, relatively smooth sac with no villi, and its lining is coated in protective mucus precisely to keep things from crossing it. Very little is absorbed there.`,
        `Check the small intestine. Its wall is folded, the folds carry villi, and the villi cells carry microvilli — roughly a tennis court of surface — each villus wrapped around capillaries waiting a cell-layer away.`,
        `Also note the chemistry is not finished when food leaves the stomach: starch digestion has been paused by the acid and fat has barely been touched, so there is little there to absorb yet. Bile and the pancreatic enzymes finish the job downstream, in the same organ that then absorbs the products.`,
        `Conclude: the small intestine is the main site of BOTH final digestion and absorption; the large intestine mostly reabsorbs water.`,
      ],
      example: { problem: `A student argues: "The stomach churns the food, it is full of acid and enzymes, and it is where the food sits the longest — so the stomach must be where most nutrients are absorbed into the blood." Explain what is right and what is wrong in that reasoning, and name where most absorption actually occurs.`, solution: `The stomach digests but barely absorbs — it lacks villi and its chemistry is unfinished. The small intestine, with its folds, villi, and microvilli, is where most final digestion AND essentially all nutrient absorption occur.` },
      relatedLoIds: ['bio.digestive-excretory'],
    },
  ],
  pointers: [
    { content: `Bile is not an enzyme and it breaks no chemical bonds. It is made by the LIVER, stored in the gallbladder, and released into the SMALL INTESTINE, where it acts like a detergent: it EMULSIFIES large fat globules into tiny droplets. That is mechanical digestion, and its purpose is surface area. The enzyme that chemically digests fat is pancreatic LIPASE, and it works far faster on the many small droplets bile has just created — a clean example of why mechanical and chemical digestion need each other.`, kind: 'common-error' },
    { content: `Mechanical digestion (chewing, churning, bile emulsifying fat) creates surface area; chemical digestion (enzymes) breaks bonds. Both are needed.`, kind: 'tip' },
    { content: `The path: mouth (salivary amylase → carbohydrates) → esophagus (peristalsis, no digestion) → stomach (hydrochloric acid at about pH 2 plus pepsin → proteins) → small intestine → large intestine (water reabsorption).`, kind: 'tip' },
    { content: `The small intestine is the main site of BOTH final digestion and absorption: bile from the liver emulsifies fat, pancreatic amylase, proteases, and lipase finish the job, and villi plus microvilli supply the surface area.`, kind: 'tip' },
    { content: `Enzymes are specific: amylase → carbohydrates, pepsin and proteases → proteins, lipase → fats. Bile is not an enzyme.`, kind: 'tip' },
    { content: `The liver makes urea from excess amino acids; each nephron filters the blood, reabsorbs water and glucose, and excretes urea as urine.`, kind: 'tip' },
    { content: `Reabsorption is adjustable — ADH raises water reabsorption when you are dehydrated, which is how the kidney maintains water balance.`, kind: 'tip' },
    { content: `Bile is **not** an enzyme. It's made by the liver, *stored* in the gallbladder, and acts in the small intestine — emulsifying fat is mechanical (surface area), not bond-breaking. The fat enzyme is pancreatic **lipase**.`, kind: 'common-error' },
    { content: `Don't use *digestion* and *absorption* as synonyms. Digestion = breaking molecules apart; absorption = moving finished small molecules across a wall into blood. The stomach digests a lot and absorbs almost nothing.`, kind: 'vocab-note' },
    { content: `Carbohydrate digestion happens in TWO separate places with a gap between: salivary amylase in the mouth, then it stops at pH 2 in the stomach, then pancreatic amylase restarts it in the small intestine. Don't write that starch is finished in the mouth.`, kind: 'gotcha' },
    { content: `Pepsin needs pH ~2; salivary amylase and all the pancreatic enzymes need near-neutral pH. If you place an enzyme in the wrong organ, you've also placed it at the wrong pH — that's why the pancreas releases bicarbonate.`, kind: 'tip' },
    { content: `The liver MAKES urea (from excess amino acids); the kidney only REMOVES it. Saying 'the kidney makes urea' or 'the liver filters urea out of blood' swaps the two organs.`, kind: 'common-error' },
    { content: `Glucose is filtered at the glomerulus, then 100% reabsorbed — so healthy urine has no glucose. Filtration is non-selective (everything small goes out); selectivity happens at reabsorption.`, kind: 'edge-case' },
    { content: `ADH doesn't change what gets filtered — it changes how much water is reabsorbed back. Dehydrated → ADH up → scant dark urine. Well-hydrated → ADH down → pale urine. Same filter, different dial.`, kind: 'gotcha' },
    { content: `Peristalsis is smooth-muscle contraction, not gravity, and it moves food along the whole tract — but the esophagus performs no digestion at all. Don't list it as a digestive site just because food passes through.`, kind: 'vocab-note' },
  ],
};
