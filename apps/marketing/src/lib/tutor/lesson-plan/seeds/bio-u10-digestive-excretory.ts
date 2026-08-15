/**
 * Biology — Human Body Systems: The Digestive & Excretory Systems.
 *
 * The intake-and-output pair of the HS Biology fan-out (NGSS HS-LS1-2).
 * Digestion is a sequence of locations, each with its own job, and almost
 * every student error here is a location error — which organ digests, which
 * organ ABSORBS, which organ MAKES the waste the kidney removes — so the
 * concept segment is organized as a walk down the tube and then out through
 * the nephron.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_BIO_U10_DIGESTIVE_EXCRETORY: LessonPlan = {
  id: 'evelyn.hs.bio.digestive-excretory.v1',
  title: 'The Digestive & Excretory Systems',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'biology',
  locale: 'en',
  los: [
    {
      id: 'bio.digestive-excretory',
      standard: 'BIO-10.3',
      description:
        'Trace food through the digestive tract and blood through the nephron, explaining how mechanical and chemical digestion, enzyme specificity, villi surface area, and kidney filtration together supply cells with nutrients and remove nitrogenous waste (NGSS HS-LS1-2).',
    },
  ],
  prerequisites: ['bio.circulatory-respiratory'],
  followUps: ['bio.nervous-endocrine'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame digestion and excretion as one continuous problem: getting molecules in, and getting waste out.',
      script:
        'Your small intestine is about six meters long, folded into an abdomen the size of a shoebox — and that is deliberate. Every centimeter is absorbing surface. Meanwhile a person whose kidneys fail must sit at a dialysis machine three times a week so a pump can do what a fist-sized organ used to do quietly, all day. And someone with lactose intolerance is simply missing one enzyme — one protein — and it changes what they can eat. Food in, waste out: in this lesson you follow a meal all the way through, then follow the blood through the kidney.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-tube-and-nephron',
      kind: 'concept',
      goal: 'Mechanical vs chemical digestion, the organ-by-organ path with its enzymes, absorption at the villi, and the nephron as the blood filter.',
      keyIdeas: [
        'TWO KINDS OF DIGESTION, BOTH REQUIRED — MECHANICAL digestion (chewing, the churning of the stomach, the emulsifying of fat by bile) physically breaks food into smaller pieces. CHEMICAL digestion (enzymes) breaks the chemical bonds. Mechanical work alone would leave you with tiny crumbs no cell could absorb; chemical work alone would be far too slow, because enzymes act on SURFACES and mechanical breakup is what creates that surface. Mechanical digestion makes chemical digestion fast.',
        'MOUTH, THEN ESOPHAGUS — in the mouth, teeth chew (mechanical) while saliva carries SALIVARY AMYLASE, which starts breaking down CARBOHYDRATES (starch) into smaller sugars. Nothing else is chemically digested there: no protein digestion, no fat digestion. The esophagus then digests nothing at all — it transports. PERISTALSIS is the wave of smooth-muscle contraction that squeezes the food ball along, and it is why an astronaut can swallow upside down: gravity is not doing the work.',
        'STOMACH — mechanical: muscular churning. Chemical: cells release HYDROCHLORIC ACID, holding the stomach at about pH 2, and the enzyme PEPSIN, which digests PROTEINS. The acid is not just a germ-killer; it unfolds (denatures) proteins so pepsin can reach the bonds, and pepsin only works at that low pH. Salivary amylase, which needs a near-neutral pH, is shut down the moment it arrives — carbohydrate digestion pauses here.',
        'SMALL INTESTINE — THE MAIN EVENT — this is where BOTH final chemical digestion AND essentially all ABSORPTION happen. BILE, made by the LIVER and stored in the gallbladder, arrives here: bile is NOT an enzyme and breaks no bonds. It is a detergent-like substance that EMULSIFIES fat, splitting large fat globules into tiny droplets — a mechanical change — so that lipase can reach them. PANCREATIC ENZYMES then finish the job: pancreatic amylase on carbohydrates, proteases on proteins, lipase on fats, all working at the near-neutral pH the pancreas restores with bicarbonate. Everything the meal becomes is finished here.',
        'WHY THE SMALL INTESTINE IS SO LONG — this is also where the finished molecules are ABSORBED, and the anatomy explains why here rather than in the stomach: its wall is folded, the folds are covered in finger-like VILLI, and each villus cell is covered in MICROVILLI. Folds on folds on folds turn a few meters of tube into roughly the absorbing surface of a tennis court, with capillaries a single cell-layer away. Small nutrient molecules cross that surface into the blood and travel to the liver, then to the cells. SURFACE AREA is the whole design principle. The stomach, by contrast, is a thick muscular sac with no villi and a protective mucus lining, so almost nothing is absorbed there.',
        'ENZYME SPECIFICITY, FROM UNIT 1 — each enzyme has one class of substrate: amylase → carbohydrates, pepsin and the pancreatic proteases → proteins, lipase → fats. This is the lock-and-key active site you met with macromolecules and enzymes. Lactose intolerance is exactly this idea: without the enzyme lactase, the sugar lactose is never broken down, so gut bacteria ferment it instead. And after the small intestine, the LARGE INTESTINE does no significant enzyme work at all — its job is REABSORBING WATER (and some ions) from the indigestible remains, plus housing the gut microbiome.',
        'THE EXCRETORY SYSTEM: KIDNEY AND NEPHRON — the LIVER makes UREA when excess amino acids are broken down, because their nitrogen would otherwise become toxic ammonia; urea is the safer package the blood carries. The kidney does not manufacture urea, it REMOVES it. Each kidney holds about a million NEPHRONS, and each nephron does three things in order: FILTER blood under pressure at the glomerulus (water, salts, glucose, and urea are all pushed out; blood cells and large proteins stay in), REABSORB what the body needs back into the blood (nearly all the water, all the glucose, needed salts), and EXCRETE what is left — urea, excess salt, excess water — as urine. Dialysis substitutes a machine for that filter-and-reabsorb step when the nephrons fail.',
        'THE HOMEOSTASIS TIE — reabsorption is ADJUSTABLE, which is how the kidney holds water balance (lesson 10.1). When you are dehydrated, the pituitary releases ADH (antidiuretic hormone); ADH makes the nephron tubules more permeable to water, so more water returns to the blood and the urine is scant and dark. Drink a liter and ADH falls, less water is reabsorbed, and the urine is pale. Same filtering, different dial setting — and notice the same logic runs the whole unit: break it down, keep what you need, dump the rest.',
      ],
      vocabulary: [
        { term: 'peristalsis', definition: 'the wave of smooth-muscle contraction that pushes food along the digestive tract.' },
        { term: 'villi', definition: 'finger-like projections lining the small intestine that multiply its absorbing surface area.' },
        { term: 'bile', definition: 'a liver-made fluid that emulsifies fat into small droplets; it is not an enzyme.' },
        { term: 'nephron', definition: 'the filtering unit of the kidney that filters blood, reabsorbs what the body needs, and excretes urea in urine.' },
      ],
      suggestedTools: ['show_labeled_image', 'show_diagram', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-trace-sandwich',
      kind: 'worked_example',
      problem:
        'A student eats a grilled cheese sandwich: the bread is mostly starch, the cheese supplies protein and fat. Trace each of those three components through the mouth, stomach, and small intestine, naming where each is chemically digested and where each is absorbed.',
      steps: [
        'Mouth: teeth chew (mechanical), and salivary amylase begins breaking the bread STARCH into smaller sugars. The cheese protein and fat are untouched — no protease and no lipase are present in saliva.',
        'Esophagus: peristalsis moves the swallowed ball down. No chemical digestion happens here for any of the three.',
        'Stomach: churning continues the mechanical work. Hydrochloric acid at about pH 2 denatures the cheese PROTEIN and pepsin begins cutting it. That same low pH shuts salivary amylase off, so starch digestion pauses. Fat is still essentially untouched, and nothing here is absorbed into the blood in any meaningful amount.',
        'Small intestine, the fat first: bile from the liver emulsifies the cheese FAT into tiny droplets — mechanical, not chemical — so that pancreatic lipase has enough surface to work on and can break the fat into fatty acids and glycerol.',
        'Small intestine, the other two: pancreatic amylase finishes the starch into single sugars such as glucose, and pancreatic proteases finish the protein into amino acids.',
        'Absorption: all three end products — glucose, amino acids, and fatty acids — cross the villi and microvilli of the small intestine wall. Sugars and amino acids enter the capillaries and travel by blood to the liver; the remains pass to the large intestine, where water is reabsorbed.',
      ],
      answer:
        'Starch: begins in the mouth (salivary amylase), pauses in the stomach, finishes in the small intestine (pancreatic amylase). Protein: begins in the stomach (pepsin at about pH 2), finishes in the small intestine (proteases). Fat: emulsified by bile and digested by lipase, both in the small intestine. All three are absorbed at the villi of the small intestine.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-stomach-absorption-error',
      kind: 'worked_example',
      problem:
        'A student argues: "The stomach churns the food, it is full of acid and enzymes, and it is where the food sits the longest — so the stomach must be where most nutrients are absorbed into the blood." Explain what is right and what is wrong in that reasoning, and name where most absorption actually occurs.',
      steps: [
        'Grant what is true: the stomach really does do heavy mechanical churning, and it really does begin protein digestion with pepsin at about pH 2. The error is not about digestion — it is about ABSORPTION.',
        'Separate the two words. DIGESTION is breaking molecules down. ABSORPTION is moving the finished small molecules across a wall into the blood. An organ can be excellent at one and useless at the other.',
        'Check the stomach against what absorption requires. Absorption needs enormous surface area and a thin exchange wall. The stomach is a thick, muscular, relatively smooth sac with no villi, and its lining is coated in protective mucus precisely to keep things from crossing it. Very little is absorbed there.',
        'Check the small intestine. Its wall is folded, the folds carry villi, and the villi cells carry microvilli — roughly a tennis court of surface — each villus wrapped around capillaries waiting a cell-layer away.',
        'Also note the chemistry is not finished when food leaves the stomach: starch digestion has been paused by the acid and fat has barely been touched, so there is little there to absorb yet. Bile and the pancreatic enzymes finish the job downstream, in the same organ that then absorbs the products.',
        'Conclude: the small intestine is the main site of BOTH final digestion and absorption; the large intestine mostly reabsorbs water.',
      ],
      answer:
        'The stomach digests but barely absorbs — it lacks villi and its chemistry is unfinished. The small intestine, with its folds, villi, and microvilli, is where most final digestion AND essentially all nutrient absorption occur.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-starch-start',
      kind: 'try_yourself',
      problem:
        'A student chews a piece of white bread, which is mostly starch, and holds it in the mouth for a minute before swallowing. Where does chemical digestion of that starch BEGIN, and which substance starts it?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'In the stomach, where pepsin at pH 2 breaks down starch' },
        { id: 'b', text: 'In the small intestine, where bile, an enzyme, breaks down starch' },
        { id: 'c', text: 'In the mouth, where salivary amylase begins breaking starch into smaller sugars', correct: true },
        { id: 'd', text: 'In the large intestine, where hydrochloric acid breaks down starch as water is reabsorbed' },
      ],
      expectedAnswer: 'In the mouth, where salivary amylase begins breaking starch into smaller sugars',
      hints: [
        'Sort the enzymes by substrate first: which macromolecule does amylase act on, and which does pepsin act on?',
        'Saliva is not just water — it carries the one enzyme that acts on carbohydrates, so starch digestion starts before you even swallow.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-absorption-site',
      kind: 'try_yourself',
      problem:
        'After a meal has been fully broken down, where do the glucose and amino acids actually cross into the bloodstream, and what structural feature makes that possible?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'In the small intestine, across the villi and microvilli, whose folding creates an enormous absorbing surface area', correct: true },
        { id: 'b', text: 'In the stomach, where the churning muscle pushes nutrients directly into the blood' },
        { id: 'c', text: 'In the large intestine, where villi absorb nutrients along with water' },
        { id: 'd', text: 'In the esophagus, where peristalsis squeezes nutrients through the wall as food passes' },
      ],
      expectedAnswer: 'In the small intestine, across the villi and microvilli, whose folding creates an enormous absorbing surface area',
      hints: [
        'Absorption needs a huge, thin surface with capillaries just underneath — which organ is built that way?',
        'The stomach is a thick muscular sac coated in mucus, and the large intestine mainly reabsorbs water; only one organ is lined with villi and microvilli.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-nephron-urea',
      kind: 'try_yourself',
      problem:
        'Blood carrying urea arrives at a nephron in the kidney. Which statement correctly describes where that urea came from and what the nephron does with it and with the water that is filtered alongside it?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The kidney makes urea from the blood it filters, then stores it in the bladder' },
        { id: 'b', text: 'The nephron filters the blood and reabsorbs nothing, so urea, glucose, and nearly all the water leave together in urine' },
        { id: 'c', text: 'The nephron reabsorbs urea back into the blood and excretes water, which is why urine is mostly water' },
        { id: 'd', text: 'The liver makes urea from excess amino acids; the nephron filters it out of the blood, reabsorbs most of the water and all of the glucose, and excretes the urea in urine', correct: true },
      ],
      expectedAnswer:
        'The liver makes urea from excess amino acids; the nephron filters it out of the blood, reabsorbs most of the water and all of the glucose, and excretes the urea in urine',
      hints: [
        'Separate the organ that MAKES the waste from the organ that REMOVES it — one is a chemical factory, the other is a filter.',
        'A nephron works in three steps: filter, reabsorb, excrete. Ask what the body wants to keep (water, glucose) and what it wants to lose (urea).',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-bile-as-enzyme',
      kind: 'misconception_check',
      question:
        'A student writes: "Bile is the enzyme that digests fat, so fat is chemically digested in the gallbladder where the bile is stored." What went wrong?',
      commonErrors: [
        {
          answer: 'Bile is a fat-digesting enzyme that works in the gallbladder',
          misconception:
            'Collapsing mechanical digestion into chemical digestion — assuming anything that acts on fat must be an enzyme — and confusing the organ that STORES a secretion with the organ where it acts.',
          correctsTo:
            'Bile is not an enzyme and it breaks no chemical bonds. It is made by the LIVER, stored in the gallbladder, and released into the SMALL INTESTINE, where it acts like a detergent: it EMULSIFIES large fat globules into tiny droplets. That is mechanical digestion, and its purpose is surface area. The enzyme that chemically digests fat is pancreatic LIPASE, and it works far faster on the many small droplets bile has just created — a clean example of why mechanical and chemical digestion need each other.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Mechanical digestion (chewing, churning, bile emulsifying fat) creates surface area; chemical digestion (enzymes) breaks bonds. Both are needed.',
        'The path: mouth (salivary amylase → carbohydrates) → esophagus (peristalsis, no digestion) → stomach (hydrochloric acid at about pH 2 plus pepsin → proteins) → small intestine → large intestine (water reabsorption).',
        'The small intestine is the main site of BOTH final digestion and absorption: bile from the liver emulsifies fat, pancreatic amylase, proteases, and lipase finish the job, and villi plus microvilli supply the surface area.',
        'Enzymes are specific: amylase → carbohydrates, pepsin and proteases → proteins, lipase → fats. Bile is not an enzyme.',
        'The liver makes urea from excess amino acids; each nephron filters the blood, reabsorbs water and glucose, and excretes urea as urine.',
        'Reabsorption is adjustable — ADH raises water reabsorption when you are dehydrated, which is how the kidney maintains water balance.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.3', cedTitle: 'The Digestive & Excretory Systems' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
