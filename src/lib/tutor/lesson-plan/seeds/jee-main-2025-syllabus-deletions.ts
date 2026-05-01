/**
 * JEE Main 2025-26 — Syllabus Deletions.
 *
 * NTA reduced the JEE Main syllabus by 25-35% across Physics, Chemistry,
 * and Mathematics for 2025. This plan catalogs what was removed so
 * students don\'t over-prepare on retired topics. Currency-checked
 * against NTA\'s JEE Main 2025 syllabus PDF + CollegeDekho deletion list.
 */

import type { LessonPlan } from '../types';

export const SEED_JEE_MAIN_2025_SYLLABUS_DELETIONS: LessonPlan = {
  id: 'evelyn.testprep.jee-main-2025.syllabus-deletions.v1',
  title: 'JEE Main 2025-26: Syllabus Deletions Across Physics, Chemistry, Math',
  curriculum: 'NTA',
  grade: 'iitjee',
  subject: 'test-prep',
  topic: 'jee-main',
  locale: 'en',
  los: [
    {
      id: 'jee-main-2025.syllabus-deletions',
      description: 'Identify topics removed from the JEE Main 2025 syllabus across Physics, Chemistry, and Mathematics so candidates do not over-prepare retired topics.',
      standard: 'JEE-MAIN-2025-SYL',
    },
  ],
  prerequisites: ['jee-main-2025.format'],
  followUps: ['jee-main-2025.prep-strategy'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'NTA cut roughly a quarter of the syllabus — don\'t spend prep time on dead topics.',
      script: 'NTA reduced the JEE Main 2025 syllabus by 25-35% depending on subject. Some chapters were removed entirely, others had specific sub-topics dropped. Hours spent grinding deleted content are hours wasted. Physics took the biggest cuts (whole chapters like Communication Systems and Semiconductor applications). Chemistry lost 8 full chapters. Math lost a handful of specific topics. Knowing what\'s OUT is as important as knowing what\'s in.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-physics-deletions',
      kind: 'concept',
      goal: 'What\'s out in Physics.',
      keyIdeas: [
        'CHAPTERS REMOVED: Communication Systems (entire chapter — modulation, transmission, receivers all gone).',
        'TOPICS REMOVED FROM REMAINING CHAPTERS: Carnot engine (efficiency calculations, p-V diagrams of Carnot cycle); Geostationary satellites; Color code for resistors; Resonance and free/forced/damped oscillations (the SHM coverage stays but these specific applications are out); Davisson-Germer experiment; Transistor applications (amplifier, oscillator, switch).',
        'RADIOACTIVITY: decay law and isotope classifications removed. Basic radioactivity concept kept; the formal decay equation N(t) = N₀e^(−λt) and its applications dropped.',
        'WHAT REMAINS: Mechanics (kinematics, Newton\'s laws, work-energy, rotation, gravitation, fluids, SHM core), Thermodynamics (laws, ideal gas, kinetic theory — minus Carnot specifics), Electromagnetism (electrostatics, current electricity, magnetism, EMI, AC), Optics (geometrical + wave optics), Modern Physics (photoelectric, atom, nuclei core).',
        'IMPLICATION: Physics topics dropped were largely the "applied" ones — communication, semiconductor circuits, satellite orbits. Pure-physics fundamentals remain.',
      ],
      vocabulary: [
        { term: 'Davisson-Germer experiment', definition: 'a 1927 experiment confirming the wave nature of electrons; removed from JEE Main 2025 syllabus.' },
        { term: 'Carnot cycle', definition: 'an idealized thermodynamic cycle; specific Carnot calculations removed for 2025 though laws of thermodynamics remain.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-chemistry-deletions',
      kind: 'concept',
      goal: 'What\'s out in Chemistry — biggest cuts of any subject.',
      keyIdeas: [
        'COMPLETE CHAPTER DELETIONS: Hydrogen, Environmental Chemistry, Polymers, Chemistry in Everyday Life, Surface Chemistry, States of Matter, General Principles and Processes of Isolation of Metals (i.e., metallurgy).',
        'PARTIAL DELETIONS: Some s-block elements topics simplified or removed (verify with NTA PDF for specifics). p-Block coverage retained but uses/properties of Boron, Aluminium, Nitrogen, Phosphorus, Sulfur, Halogens are simplified — the systematic group coverage stays, the niche applications drop.',
        'BASIC CONCEPTS: "Physical quantities and their measurements, precision, accuracy, significant figures" partially trimmed.',
        'WHAT REMAINS: Atomic structure, Chemical bonding (Lewis, VSEPR, MO theory), Equilibrium, Thermodynamics (chemistry side), Kinetics, Electrochemistry, Coordination chemistry, Periodic trends and p/d/f-block elements (with simplifications), Organic Chemistry (whole subject — mechanisms, GOC, named reactions, biomolecules).',
        'IMPLICATION: chemistry deletions removed about 8 full chapters — the largest cut of any subject. Physical and Organic chemistry are largely intact; Inorganic took the deepest cuts.',
        'PREP RECOMMENDATION: don\'t use 2023 chemistry textbooks without checking each chapter against the 2025 syllabus. Pre-2025 NCERT-based prep books still cover deleted topics in detail — those pages are now wasted study time.',
      ],
      vocabulary: [
        { term: 'metallurgy', definition: 'the chemistry chapter on isolation of metals (concentration, reduction, refining); fully removed from JEE Main 2025.' },
        { term: 'surface chemistry', definition: 'the chapter on adsorption, catalysis, colloids; fully removed from JEE Main 2025.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-math-deletions',
      kind: 'concept',
      goal: 'What\'s out in Math — smallest cuts.',
      keyIdeas: [
        'TOPICS REMOVED: Arithmetic-Geometric Progressions (AGP series), Square root of complex numbers, Properties of binomial coefficients (the deeper combinatorial identities), Rolle\'s and Lagrange\'s Mean Value Theorems, Bernoulli trials and Binomial Distribution (probability), Scalar and vector triple products (vectors), Heights and Distances (trigonometry application).',
        'WHAT REMAINS: Sets, Relations, Functions, Complex Numbers (basic), Quadratic Equations, Sequences (AP, GP — but not AGP), Permutations + Combinations, Binomial Theorem (basic), Matrices, Determinants, Trigonometry (identities, equations, inverse trig — but not heights/distances applications), Coordinate Geometry (line, circle, conics), Vectors (basic operations and dot product — but not triple products), 3D Geometry, Limits, Continuity, Differentiability, Differentiation, Application of Derivatives (without Rolle\'s/MVT), Integration (definite + indefinite), Differential Equations, Statistics, Probability (without Bernoulli/binomial distribution).',
        'IMPLICATION: math syllabus barely changed. Most coaching books and existing prep materials still apply. The cuts are surgical — remove specific topics rather than whole chapters.',
        'IMPACT ON DERIVATIVES: removing Rolle\'s and Lagrange\'s MVT means questions previously hinging on these theorems are out. The Application of Derivatives chapter is now thinner — focus on monotonicity, max/min, tangents/normals, approximations.',
      ],
      vocabulary: [
        { term: 'Mean Value Theorem', definition: 'Lagrange\'s and Rolle\'s theorems on continuous + differentiable functions; removed from JEE Main 2025 math syllabus.' },
        { term: 'AGP series', definition: 'Arithmetic-Geometric Progression; a series with both AP and GP structure; removed from JEE Main 2025.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'You\'re using a 2023 JEE Main coaching book. You see a chapter on "Surface Chemistry — adsorption, catalysis, colloids" with 50 practice problems. Should you study it?',
      expectedAnswer: 'No — Surface Chemistry was completely removed from the JEE Main 2025 syllabus. Skip the entire chapter. Use that study time for chapters that ARE on the syllabus, like Coordination Chemistry or Organic GOC. Pre-2025 books don\'t flag these deletions.',
      responseFormat: 'free',
      hints: [
        'Surface Chemistry is on the deletion list.',
        'No point studying retired topics.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-still-test-deleted',
      kind: 'misconception_check',
      question: 'NTA might still test deleted topics like Communication Systems if they appeared in JEE before. So I should keep studying them just in case.',
      commonErrors: [
        {
          answer: 'true — better safe than sorry',
          misconception: 'Hedging on retired syllabus content.',
          correctsTo: 'False. NTA explicitly publishes the official syllabus and exam papers are mapped against it. Including a question on a deleted topic would be a syllabus violation that students could appeal — and successful appeals would invalidate the question. NTA does not test deleted topics. Hedging time on retired content is hours stolen from chapters actually on the exam.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Physics: Communication Systems, Carnot, Geostationary, Resonance specifics, Davisson-Germer, Transistor apps, Radioactivity decay law — all OUT.',
        'Chemistry biggest cuts: Hydrogen, Environmental, Polymers, Everyday Life, Surface Chem, States of Matter, Metallurgy — full chapters OUT.',
        'Math smallest cuts: AGP, Rolle\'s/MVT, Bernoulli/Binomial Distribution, vector triple products, heights/distances.',
        'Don\'t waste prep time on deleted topics. NTA does not test removed material.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why did NTA cut Inorganic Chemistry chapters so heavily relative to Physical and Organic?',
      hint: 'Inorganic Chemistry on JEE was largely memorization-driven (color, formula, reaction product memorization for hundreds of compounds). The 2025 reduction shifted weight toward conceptual chemistry — physical and organic — that better predicts engineering aptitude. Removing Surface Chemistry, Hydrogen, Environmental, Polymers, Everyday Life, and Metallurgy aligns the syllabus with NCERT class 11-12 core content rather than peripheral topics. The cuts also reduce the disadvantage to self-prepared students who lacked elaborate inorganic mnemonic charts.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
