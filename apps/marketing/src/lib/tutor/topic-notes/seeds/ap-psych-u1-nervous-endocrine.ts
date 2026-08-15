/** AP Psychology — Unit 1 CED 1.1-1.2: Overview of the Nervous System and Heredity.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.psych.nervous-endocrine.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_PSYCH_NERVOUS_ENDOCRINE: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.psych.nervous-endocrine.v1',
  course: 'AP Psychology',
  cedUnit: 1,
  cedTopic: '1.1-1.2',
  cedTitle: 'Overview of the Nervous System and Heredity',
  planId: 'evelyn.ap.psych.nervous-endocrine.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.psych.nervous-endocrine.v1' }],
  theory: [
    { loId: 'appsych.nervous-endocrine', content: `TWO CONTROL SYSTEMS. The NERVOUS SYSTEM is FAST (electrical and chemical signals, milliseconds) and precise. The ENDOCRINE SYSTEM is SLOW (hormones carried in the blood, seconds to hours) and diffuse. They work together — the hypothalamus is the bridge — to regulate everything from heartbeat to the stress response.` },
    { loId: 'appsych.nervous-endocrine', content: `NERVOUS SYSTEM HIERARCHY. The CENTRAL NERVOUS SYSTEM (CNS) = brain + spinal cord. The PERIPHERAL NERVOUS SYSTEM (PNS) = every nerve OUTSIDE the CNS. The PNS then splits into the SOMATIC (voluntary control of skeletal muscles) and the AUTONOMIC (involuntary control of organs and glands). Memorize the tree: CNS vs PNS, then PNS into somatic vs autonomic.` },
    { loId: 'appsych.nervous-endocrine', kind: 'definition', title: 'autonomic nervous system', content: `the PNS branch that runs involuntary functions (organs, glands). It has two opposing parts: the sympathetic (activating) and the parasympathetic (calming).` },
    { loId: 'appsych.nervous-endocrine', content: `SYMPATHETIC vs PARASYMPATHETIC. SYMPATHETIC = "FIGHT OR FLIGHT": it ACTIVATES the body — heart rate up, pupils dilate, glucose released, digestion suppressed; adrenaline-driven. PARASYMPATHETIC = "REST AND DIGEST": it CALMS — heart rate down, pupils constrict, digestion resumes; this is the default state. Most organs receive BOTH, and the two branches OPPOSE each other so the body shifts between arousal and recovery.` },
    { loId: 'appsych.nervous-endocrine', content: `ENDOCRINE SYSTEM: glands that secrete HORMONES into the bloodstream. PITUITARY GLAND — the "MASTER GLAND" — sits just below the hypothalamus and controls the other glands; it releases growth hormone, ACTH, oxytocin (bonding), and antidiuretic hormone. The chain of command: HYPOTHALAMUS controls the PITUITARY, and the pituitary controls the rest.` },
    { loId: 'appsych.nervous-endocrine', content: `OTHER ENDOCRINE GLANDS. THYROID: metabolism and energy (thyroxine) — overactive makes you anxious and hot, underactive makes you sluggish and cold. PANCREAS: insulin, which regulates blood sugar (dysfunction gives diabetes). ADRENAL GLANDS: release epinephrine (adrenaline) and norepinephrine for the stress response, plus cortisol from the cortex. OVARIES: estrogen and progesterone. TESTES: testosterone. PINEAL: melatonin for sleep.` },
    { loId: 'appsych.nervous-endocrine', content: `GENETICS BASICS. DNA carries GENES, which help build TRAITS. Psychologists separate genetic from environmental influence using TWIN STUDIES — identical (monozygotic) twins share about 100% of genes, fraternal (dizygotic) share about 50%, so comparing their similarity reveals genetic influence — and ADOPTION STUDIES, which compare adopted children to their biological versus adoptive parents.` },
    { loId: 'appsych.nervous-endocrine', kind: 'definition', title: 'heritability', content: `the percent of VARIATION in a trait WITHIN A POPULATION that is attributable to genetic differences. It is a population statistic (0 to 100%), NOT a statement about any one individual.` },
    { loId: 'appsych.nervous-endocrine', content: `HERITABILITY IN PRACTICE. Rough adult estimates: IQ about 50 to 80%, personality about 40 to 50%, schizophrenia about 80%. Two rules AP loves to test: (1) heritability describes POPULATIONS, not individuals — it never says your trait is X% genetic; and (2) heritability RISES as environments become more EQUAL, because then genetic differences explain more of the leftover variation. In a highly UNEQUAL environment, heritability of the same trait drops.` },
    { loId: 'appsych.nervous-endocrine', content: `NATURE-NURTURE INTERACTION. Genes and environment INTERACT rather than adding separately. EPIGENETICS: the environment can switch genes ON or OFF without changing the DNA itself. Classic example: PHENYLKETONURIA (PKU) — the gene causes intellectual disability ONLY IF the diet is high in phenylalanine; a controlled diet keeps the gene from being expressed as disease. This shows environment can decide whether a gene matters.` },
  ],
  methods: [
    {
      title: 'Trace a fight-or-flight response',
      when_to_use: 'When a prompt describes a sudden threat and asks what the nervous and endocrine systems do.',
      steps: [
        `STEP 1 — SENSORY input (e.g. a loud noise) travels to the thalamus and then the AMYGDALA for rapid threat assessment.`,
        `STEP 2 — The amygdala alerts the HYPOTHALAMUS, the command hub linking brain to body.`,
        `STEP 3 — FAST PATH: the hypothalamus activates the SYMPATHETIC nervous system for near-instant arousal.`,
        `STEP 4 — SLOW PATH: the hypothalamus also signals the PITUITARY, which signals the ADRENAL GLANDS.`,
        `STEP 5 — The adrenals release EPINEPHRINE (adrenaline) and CORTISOL into the blood.`,
        `STEP 6 — Within a second or two: heart and breathing rate up, glucose to the muscles, pupils dilate, digestion suppressed, pain dulled.`,
        `STEP 7 — RECOVERY: if there is no real threat, the PARASYMPATHETIC system returns the body to baseline over minutes; cortisol lingers longer (minutes to hours), which is why arousal outlasts the scare.`,
      ],
      example: {
        problem: `You hear a loud unexpected noise. Trace what happens in your nervous and endocrine systems over the next few seconds.`,
        solution: `Amygdala flags the threat, signals the hypothalamus, which fires the SYMPATHETIC system AND the pituitary-adrenal path; adrenaline and cortisol drive heart rate, breathing, and glucose up while digestion shuts down. The parasympathetic system later restores calm, but cortisol keeps you aroused for a while.`,
      },
      relatedLoIds: ['appsych.nervous-endocrine'],
    },
    {
      title: 'Interpret a heritability statistic correctly',
      when_to_use: 'When given a heritability figure and asked what it does and does not mean.',
      steps: [
        `STEP 1 — State the correct meaning: the figure is the share of VARIATION among individuals IN THAT POPULATION explained by genetic differences; the remainder is environmental.`,
        `STEP 2 — Reject the individual reading: it does NOT say any single person's trait is that percent genes.`,
        `STEP 3 — Reject the cross-population reading: the number can differ in another population, especially one with more environmental variation.`,
        `STEP 4 — Add the environment rule: heritability goes UP when environments are more equal (genes explain the leftover variation) and DOWN when environments vary a lot.`,
        `STEP 5 — Note changeability: even highly heritable traits can be altered (glasses for vision, education for skills).`,
      ],
      example: {
        problem: `A study finds height has 80% heritability. What does this mean, and what does it NOT mean?`,
        solution: `It MEANS that in this population 80% of the variation in height is due to genetic differences and 20% to environment (nutrition, illness). It does NOT mean your own height is 80% genes, does NOT transfer to a malnourished population (where heritability would be lower), and does NOT make height fixed.`,
      },
      relatedLoIds: ['appsych.nervous-endocrine'],
    },
  ],
  pointers: [
    { content: 'Memorize the tree: CNS (brain + cord) vs PNS; PNS splits into somatic (voluntary) + autonomic (involuntary).', kind: 'tip' },
    { content: 'Sympathetic = activate (fight-or-flight); parasympathetic = calm (rest-and-digest). They oppose each other.', kind: 'tip' },
    { content: 'Nervous system is fast (ms); endocrine is slow (seconds to hours) but its effects last longer.', kind: 'tip' },
    { content: 'Pituitary = master gland, run by the hypothalamus; thyroid = metabolism, pancreas = insulin, adrenals = stress.', kind: 'tip' },
    { content: 'Heritability is about POPULATION variation, never one individual, and it rises as environments become more equal.', kind: 'tip' },
    { content: 'Nature and nurture interact: PKU shows a gene causes harm only when the diet (environment) allows it.', kind: 'tip' },
  ],
};
