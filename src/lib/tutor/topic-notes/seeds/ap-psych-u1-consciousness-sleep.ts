/** AP Psychology — Unit 1 CED 1.5: Sleep.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.psych.consciousness-sleep.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_PSYCH_CONSCIOUSNESS_SLEEP: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.psych.consciousness-sleep.v1',
  course: 'AP Psychology',
  cedUnit: 1,
  cedTopic: '1.5',
  cedTitle: 'Sleep',
  planId: 'evelyn.ap.psych.consciousness-sleep.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.psych.consciousness-sleep.v1' }],
  theory: [
    { loId: 'appsych.consciousness-sleep', kind: 'definition', title: 'consciousness', content: `our AWARENESS of ourselves and our environment. DUAL PROCESSING captures its split: parallel processing runs unconscious and automatic, while serial processing runs conscious and deliberate.` },
    { loId: 'appsych.consciousness-sleep', content: `CIRCADIAN RHYTHM: the roughly 24-HOUR biological cycle that governs sleepiness and alertness, driven by the SUPRACHIASMATIC NUCLEUS (SCN) in the hypothalamus. It is disrupted by jet lag, shift work, and screen exposure — bright light SUPPRESSES melatonin, delaying sleep. Note the trigger word: light is the main external cue that resets this clock.` },
    { loId: 'appsych.consciousness-sleep', content: `SLEEP STAGES (measured by EEG brain waves). AWAKE: ALPHA waves (relaxed, eyes closed) and BETA waves (alert). STAGE 1 (N1): light sleep, about 5 minutes, THETA waves, with brief hypnagogic hallucinations (falling sensations). STAGE 2 (N2): about 20 minutes, marked by SLEEP SPINDLES (bursts of activity); memory consolidation begins here. STAGE 3 (N3): DEEP SLEEP with slow, large DELTA waves — body restoration and growth-hormone release, and the hardest stage to wake from.` },
    { loId: 'appsych.consciousness-sleep', content: `REM SLEEP (high-yield). Rapid eye movements; brain activity is HIGH and looks almost awake on EEG, yet the muscles are PARALYZED (atonia) so you can't act out dreams. The most vivid DREAMS occur in REM. The night cycles roughly every 90 minutes: 1 to 2 to 3 to 2 to REM, then repeat — about five cycles a night. Across the night DEEP sleep SHRINKS and REM periods GROW, so most REM comes in the last third of the night.` },
    { loId: 'appsych.consciousness-sleep', content: `SLEEP THEORIES (why we sleep). PROTECTION: sleep kept ancestors safe and still at night. RECUPERATION and RESTORATION: body and brain repair. MEMORY CONSOLIDATION: sleep, especially REM, moves short-term memories into long-term storage. CREATIVITY: the dreaming brain recombines ideas. IMMUNE FUNCTION: sleep loss weakens immunity.` },
    { loId: 'appsych.consciousness-sleep', content: `DREAM THEORIES. FREUDIAN (psychoanalytic): dreams express unconscious wishes, with MANIFEST content (the literal story) hiding LATENT content (the symbolic meaning) — historically huge but largely discredited. INFORMATION-PROCESSING: dreams help consolidate the day's memories. ACTIVATION-SYNTHESIS (physiological): dreams are the cortex making sense of random neural firing. COGNITIVE: dreams reflect cognitive development and problem-solving.` },
    { loId: 'appsych.consciousness-sleep', content: `SLEEP DISORDERS. INSOMNIA: persistent trouble falling or staying asleep. NARCOLEPSY: sudden uncontrollable sleep attacks, often dropping straight into REM. SLEEP APNEA: breathing repeatedly stops during sleep. NIGHT TERRORS: high-arousal episodes out of DEEP sleep with screaming or thrashing and NO memory afterward. SLEEPWALKING: also occurs in DEEP (non-REM) sleep — possible precisely because the muscles are NOT paralyzed as they are in REM.` },
    { loId: 'appsych.consciousness-sleep', kind: 'definition', title: 'psychoactive drug categories', content: `depressants SLOW the CNS, stimulants SPEED it up, and hallucinogens DISTORT perception. Opioids are a depressant subtype that binds endorphin receptors.` },
    { loId: 'appsych.consciousness-sleep', content: `DRUG CATEGORIES IN DETAIL. DEPRESSANTS slow the CNS: alcohol, barbiturates, and benzodiazepines (Xanax, Valium) bring relaxation, slowed reflexes, and drowsiness — addictive and dangerous in overdose. STIMULANTS speed the CNS: caffeine, nicotine, cocaine, methamphetamine, MDMA bring alertness, energy, and euphoria with high addiction potential. HALLUCINOGENS distort perception: LSD, psilocybin, peyote, mescaline. OPIOIDS (morphine, heroin, fentanyl) bind endorphin receptors — highly addictive. MARIJUANA (THC) mixes mild stimulant, hallucinogen, and relaxant effects.` },
    { loId: 'appsych.consciousness-sleep', content: `DEPENDENCE VOCABULARY. TOLERANCE: needing MORE of a drug for the same effect as the brain compensates. WITHDRAWAL: unpleasant physical symptoms when the drug stops, because the brain has adapted to it. ADDICTION: compulsive use despite harm, driven by dopamine-based brain reward circuits. AP loves to pair tolerance and withdrawal as signs of physical dependence.` },
  ],
  methods: [
    {
      title: 'Trace a night of sleep cycles',
      when_to_use: 'When asked how sleep stages unfold across a night.',
      steps: [
        `STEP 1 — Set the frame: cycles run about 90 minutes each, so a 7 to 8 hour night is roughly five cycles.`,
        `STEP 2 — First cycle: Awake to Stage 1 (about 5 min) to Stage 2 (about 20 min) to Stage 3 DEEP sleep (longest early) to Stage 2 to a short REM period.`,
        `STEP 3 — Track the shift across cycles: DEEP (Stage 3) sleep SHRINKS with each cycle while REM periods LENGTHEN.`,
        `STEP 4 — Late night: little or no Stage 3, long REM periods; you wake most easily from REM or Stage 2.`,
        `STEP 5 — State the pattern: deep sleep dominates early, REM dominates late, so most dreaming and most REM come in the final third of the night.`,
      ],
      example: {
        problem: `A student sleeps from midnight to 7 AM. Trace their sleep stages across the night.`,
        solution: `About five 90-minute cycles. Early cycles are rich in Stage 3 deep sleep with brief REM; later cycles drop deep sleep and stretch REM. By morning the student is mostly in Stage 2 and long REM, which is why waking then feels dreamy.`,
      },
      relatedLoIds: ['appsych.consciousness-sleep'],
    },
    {
      title: 'Classify a psychoactive drug',
      when_to_use: 'When you must sort drugs into depressant, stimulant, hallucinogen, or opioid.',
      steps: [
        `STEP 1 — Ask what the drug does to the CNS and to perception: slow it, speed it, or distort it?`,
        `STEP 2 — SLOWS the CNS (relaxation, drowsiness) = DEPRESSANT (alcohol, benzodiazepines).`,
        `STEP 3 — SPEEDS the CNS (alertness, energy) = STIMULANT (caffeine, cocaine, nicotine).`,
        `STEP 4 — DISTORTS perception (visual/sensory changes) = HALLUCINOGEN (LSD, psilocybin).`,
        `STEP 5 — Binds endorphin receptors for pain relief and euphoria = OPIOID (heroin, morphine), a depressant subtype.`,
      ],
      example: {
        problem: `Classify caffeine, alcohol, cocaine, heroin, LSD, and Xanax.`,
        solution: `Caffeine and cocaine = stimulants; alcohol and Xanax (a benzodiazepine) = depressants; heroin = opioid (a depressant subtype); LSD = hallucinogen.`,
      },
      relatedLoIds: ['appsych.consciousness-sleep'],
    },
  ],
  pointers: [
    { content: 'Stage order: 1 (theta, light) to 2 (spindles) to 3 (delta, deep) to REM (paralyzed, vivid dreams). Cycles about 90 min.', kind: 'tip' },
    { content: 'Across the night deep sleep DECREASES and REM INCREASES: most REM is in the final third of the night.', kind: 'tip' },
    { content: 'REM has an awake-looking EEG but paralyzed muscles; sleepwalking and night terrors happen in DEEP sleep, not REM.', kind: 'tip' },
    { content: 'Circadian rhythm runs on the SCN in the hypothalamus; bright light suppresses melatonin and delays sleep.', kind: 'tip' },
    { content: 'Drug buckets: depressants slow, stimulants speed, hallucinogens distort; opioids bind endorphin receptors.', kind: 'tip' },
    { content: 'Tolerance (needing more) plus withdrawal (symptoms on stopping) signal physical dependence.', kind: 'tip' },
  ],
};
