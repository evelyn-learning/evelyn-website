/**
 * MCAT Biochem — Enzymes and Kinetics.
 *
 * High-yield: Michaelis-Menten, Lineweaver-Burk, inhibitor types, regulation.
 * Tested in both Chem/Phys and Bio/Biochem sections.
 */

import type { LessonPlan } from '../types';

export const SEED_MCAT_BIOCHEM_ENZYMES: LessonPlan = {
  id: 'evelyn.testprep.mcat.biochem.enzymes.v1',
  title: 'MCAT Biochem — Enzymes, Michaelis-Menten, and Inhibition',
  curriculum: 'CCSS',
  grade: 'graduate',
  subject: 'test-prep',
  topic: 'mcat-bio-biochem',
  locale: 'en',
  los: [
    {
      id: 'mcat.biochem.enzymes',
      description: 'Apply Michaelis-Menten kinetics, distinguish competitive vs noncompetitive vs uncompetitive vs mixed inhibition by their effects on Km and Vmax, identify enzyme regulation (allosteric, covalent, zymogens), and read Lineweaver-Burk plots.',
      standard: 'MCAT-BIO-ENZ',
    },
  ],
  prerequisites: ['mcat.biochem.amino-acids'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Enzyme questions follow predictable patterns.',
      script: 'Enzymes are tested in BOTH the Chem/Phys section (kinetics, transition state, activation energy) and the Bio/Biochem section (regulation, metabolism, inhibitor pharmacology). Once you recognize a Lineweaver-Burk plot and the four inhibitor patterns, MCAT enzyme questions become point-and-shoot. Almost every test has at least one inhibitor-mechanism question — and they recycle the same shifts.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-mm-kinetics',
      kind: 'concept',
      goal: 'Michaelis-Menten model + Lineweaver-Burk.',
      keyIdeas: [
        'BASIC SCHEME: E + S ⇌ ES → E + P. Initial reversible binding, then catalysis.',
        'MICHAELIS-MENTEN: V₀ = (Vmax · [S]) / (Km + [S]). Hyperbolic, saturation curve.',
        'Vmax = max velocity when enzyme fully saturated. Vmax = kcat · [E]_total. Increasing [E] proportionally increases Vmax.',
        'Km = [S] at which V₀ = Vmax/2. Km is INVERSE measure of binding affinity — LOW Km = TIGHT binding (less substrate needed to reach half-max).',
        'kcat (turnover number): substrate molecules converted per active site per second. kcat/Km = catalytic efficiency, capped near diffusion limit ~10⁸-10⁹ M⁻¹s⁻¹.',
        'LINEWEAVER-BURK (double-reciprocal): plot 1/V₀ vs 1/[S]. Linear. y-intercept = 1/Vmax. x-intercept = -1/Km. Slope = Km/Vmax. Used to extract Km and Vmax accurately AND identify inhibitor type by pattern shifts.',
        'COOPERATIVE enzymes (e.g., hemoglobin, ATCase) deviate from MM — give SIGMOIDAL curves, not hyperbolic. Hill coefficient n>1.',
      ],
      vocabulary: [
        { term: 'Vmax', definition: 'maximum reaction velocity at enzyme saturation; proportional to total enzyme concentration.' },
        { term: 'Km', definition: 'substrate concentration at half-Vmax; lower Km = higher substrate affinity.' },
        { term: 'kcat', definition: 'turnover number — substrate molecules converted per active site per unit time when saturated.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-inhibition',
      kind: 'concept',
      goal: 'Four inhibitor types, distinguished by Km/Vmax effects.',
      keyIdeas: [
        'COMPETITIVE: inhibitor competes with substrate for active site. EFFECT: Km INCREASES (looks weaker), Vmax UNCHANGED (high [S] outcompetes inhibitor). Lineweaver-Burk: lines intersect on Y-AXIS (same y-intercept, different x-intercept).',
        'NONCOMPETITIVE: inhibitor binds at allosteric site, present whether or not substrate is bound. EFFECT: Vmax DECREASES, Km UNCHANGED. Lineweaver-Burk: lines intersect on X-AXIS.',
        'UNCOMPETITIVE: inhibitor binds ONLY to ES complex (not free enzyme). EFFECT: BOTH Vmax AND Km decrease (apparent Km lower because the ES is sequestered, pulling equilibrium toward ES formation). Lineweaver-Burk: PARALLEL lines (same slope).',
        'MIXED: inhibitor binds both E and ES with different affinities. EFFECT: Vmax decreases; Km increases or decreases depending on which complex it prefers. Lineweaver-Burk: lines intersect off both axes.',
        'IRREVERSIBLE: covalent modification (e.g., aspirin acetylates COX). Different from above — kinetics not described by MM directly.',
        'KEY MEMORY HOOK: COMPETITIVE = looks like LOW affinity (↑Km), but full speed possible (Vmax unchanged). NONCOMPETITIVE = full kill on enzyme function (↓Vmax), affinity unchanged. UNCOMPETITIVE = both decrease together.',
      ],
      vocabulary: [
        { term: 'allosteric site', definition: 'a regulatory binding site distinct from the active site; binding modulates enzyme activity.' },
        { term: 'competitive inhibitor', definition: 'molecule that binds the active site reversibly and is displaced by high substrate concentration; ↑Km, Vmax unchanged.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-regulation',
      kind: 'concept',
      goal: 'Enzyme regulation in metabolism.',
      keyIdeas: [
        'ALLOSTERIC REGULATION: regulator binds at site distinct from active site, changes conformation. Can be activator (e.g., AMP activates phosphofructokinase-1) or inhibitor (ATP, citrate inhibit PFK-1). Often produces SIGMOIDAL kinetics.',
        'FEEDBACK INHIBITION: end product of a pathway inhibits the first committed step (e.g., isoleucine inhibits threonine deaminase).',
        'COVALENT MODIFICATION: phosphorylation by kinases (most common — adds PO₄²⁻ to Ser/Thr/Tyr), dephosphorylation by phosphatases. Activates or inactivates depending on enzyme. Glycogen phosphorylase: phosphorylated = active. Glycogen synthase: phosphorylated = inactive.',
        'ZYMOGENS (proenzymes): inactive precursors activated by proteolytic cleavage. Trypsinogen → trypsin (by enteropeptidase); pepsinogen → pepsin (by acid + pepsin autocatalysis). Zymogens prevent self-digestion until in proper compartment.',
        'COFACTORS: metal ions (Mg²⁺ for kinases, Zn²⁺ for many hydrolases). COENZYMES: organic, often vitamin-derived (NAD+ from niacin, FAD from riboflavin, CoA from pantothenate).',
        'pH and TEMPERATURE OPTIMUM: each enzyme has narrow optimum. Pepsin: pH 2 (stomach). Trypsin: pH 8 (small intestine). Beyond optimum: denaturation.',
      ],
      vocabulary: [
        { term: 'zymogen', definition: 'inactive enzyme precursor activated by proteolytic cleavage; prevents premature catalysis.' },
        { term: 'feedback inhibition', definition: 'end-product of a pathway inhibits an earlier step (often the first committed step).' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A drug binds reversibly to an enzyme only when substrate is already bound (i.e., binds ES complex but not free E). On a Lineweaver-Burk plot vs no inhibitor, what pattern is observed?',
      expectedAnswer: 'PARALLEL lines (same slope). This is UNCOMPETITIVE inhibition. Both Vmax and Km decrease by the same factor → 1/Vmax increases (lines shift up) but slope (Km/Vmax) is unchanged. Parallel = uncompetitive. The decrease in apparent Km comes from Le Chatelier: removing ES complex pulls E + S → ES equilibrium toward ES formation.',
      responseFormat: 'free',
      hints: [
        'Inhibitor binds only to ES (not E) → uncompetitive.',
        'Uncompetitive = both Km AND Vmax decrease proportionally → unchanged slope → parallel lines.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-km-affinity',
      kind: 'misconception_check',
      question: 'A higher Km value means the enzyme has higher affinity for its substrate. True or false?',
      commonErrors: [
        {
          answer: 'true',
          misconception: 'Treating Km like a binding constant.',
          correctsTo: 'False. Km is INVERSELY related to apparent affinity. LOW Km = HIGH affinity (tight binding, half-saturation reached at low [S]). HIGH Km = LOW affinity (need lots of substrate for half-saturation). Km is not exactly Kd but it tracks affinity in the same direction. MCAT often slips this into kinetics passages — if a mutation INCREASES Km, the enzyme has LOWER affinity. Match this with what makes biological sense before answering.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'V₀ = Vmax·[S]/(Km+[S]). Vmax ∝ [E]; Km = [S] at half-Vmax (inverse affinity).',
        'Competitive: ↑Km, Vmax unchanged. Noncompetitive: ↓Vmax, Km unchanged. Uncompetitive: BOTH decrease (parallel L-B lines).',
        'Allosteric → sigmoidal kinetics. Feedback inhibition shuts down committed step.',
        'Covalent regulation: phosphorylation (kinases on/off). Zymogens: proteolytic activation.',
        'Cofactors (metals) and coenzymes (NAD+, FAD, CoA) widen what enzymes can do.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does aspirin\'s effect on COX-1 last for ~10 days even though plasma aspirin levels drop within hours?',
      hint: 'Aspirin acetylates a serine in COX-1\'s active site — IRREVERSIBLE covalent modification. Once acetylated, the enzyme molecule is permanently inactive. Cells can recover only by SYNTHESIZING NEW COX-1. Most cells turn over enzyme rapidly, but PLATELETS are anucleate — they can\'t synthesize new protein. So once their COX-1 is acetylated, it stays inactive for the platelet\'s entire ~10-day lifespan. This is why low-dose daily aspirin protects against thrombosis even after the drug is cleared. MCAT loves this — it ties pharmacology, biochem, and cell biology together.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
