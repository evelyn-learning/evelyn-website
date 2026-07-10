/**
 * AP Psychology — Unit 3 CED 3.8: Operant Conditioning.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.psych.operant-conditioning.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_PSYCH_OPERANT_CONDITIONING: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.psych.operant-conditioning.v1',
  course: 'AP Psychology',
  cedUnit: 3,
  cedTopic: '3.8',
  cedTitle: 'Operant Conditioning',
  planId: 'evelyn.ap.psych.operant-conditioning.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.psych.operant-conditioning.v1' }],
  theory: [
    { loId: 'appsych.operant-conditioning', content: `OPERANT CONDITIONING is learning through the CONSEQUENCES of behavior — the organism ACTS on the world, and what follows determines whether the behavior repeats. Contrast with classical conditioning, where the learner passively associates stimuli. Foundation: THORNDIKE'S LAW OF EFFECT (1898) — behaviors followed by good outcomes become MORE likely; bad outcomes make them LESS likely. SKINNER (1930s onward) formalized and studied this experimentally in operant chambers ("Skinner boxes").` },
    { loId: 'appsych.operant-conditioning', content: `THE TWO-AXIS FRAMEWORK (the single most-tested idea): REINFORCEMENT always INCREASES behavior; PUNISHMENT always DECREASES behavior. POSITIVE means something is ADDED; NEGATIVE means something is REMOVED. The words positive and negative say nothing about good or bad — only add versus remove. Four boxes: positive reinforcement, negative reinforcement, positive punishment, negative punishment.` },
    { loId: 'appsych.operant-conditioning', content: `POSITIVE REINFORCEMENT: ADD a desirable stimulus → behavior INCREASES (candy for a clean room; bonus pay for high performance). NEGATIVE REINFORCEMENT: REMOVE an unpleasant stimulus → behavior INCREASES (the seatbelt buzzer stops when you buckle; aspirin removes a headache, so you take aspirin more). The classic trap: NEGATIVE REINFORCEMENT IS NOT PUNISHMENT — it strengthens behavior by taking something aversive away.` },
    { loId: 'appsych.operant-conditioning', content: `POSITIVE PUNISHMENT: ADD an unpleasant stimulus → behavior DECREASES (spanking, yelling, fines). NEGATIVE PUNISHMENT (response cost): REMOVE a desirable stimulus → behavior DECREASES (taking away the phone, time-out from a fun activity, license revocation). Punishment is generally LESS effective than reinforcement and carries side effects — fear of the punisher, aggression, and modeling of aggressive behavior.` },
    { loId: 'appsych.operant-conditioning', content: `PRIMARY vs SECONDARY REINFORCERS: PRIMARY reinforcers are innately reinforcing with no learning required — food, water, sleep. SECONDARY (conditioned) reinforcers acquire their power by association with primary ones — money, grades, praise, tokens. Token economies and slot-machine lights and sounds both exploit secondary reinforcement.` },
    { loId: 'appsych.operant-conditioning', content: `CONTINUOUS vs INTERMITTENT REINFORCEMENT: CONTINUOUS (reward every response) produces FAST learning but FAST extinction. INTERMITTENT/PARTIAL (reward only some responses) produces slower learning but responses that are far more RESISTANT TO EXTINCTION. Best practice: teach with continuous reinforcement, maintain with intermittent.` },
    { loId: 'appsych.operant-conditioning', content: `FOUR PARTIAL SCHEDULES: FIXED RATIO (FR) — reward every Nth response (piecework pay); steady high rate with a brief pause after each reward. VARIABLE RATIO (VR) — reward after an unpredictable average number of responses (slot machines, fishing); HIGHEST, steadiest rate and MOST RESISTANT to extinction. FIXED INTERVAL (FI) — reward the first response after a set time (biweekly paycheck); responding speeds up as the deadline approaches (scallop pattern). VARIABLE INTERVAL (VI) — reward the first response after an unpredictable average time (pop quizzes, checking for messages); steady moderate rate.` },
    { loId: 'appsych.operant-conditioning', content: `SCHEDULE COMPARISON RULES: RATIO schedules beat interval schedules for response RATE (responding faster earns more). VARIABLE schedules beat fixed schedules for RESISTANCE TO EXTINCTION (the learner can never tell reinforcement has stopped). Therefore VR is the most powerful schedule — the engine behind gambling addiction, lotteries, and social-media notifications.` },
    { loId: 'appsych.operant-conditioning', content: `SHAPING: building a behavior by reinforcing SUCCESSIVE APPROXIMATIONS of the target. To train a rat to press a lever: reinforce any movement toward the lever, then touching it, then pressing. Used in animal training, language instruction for autism, and athletic skill-building. OPERANT EXTINCTION: when reinforcement stops entirely, the behavior eventually stops — slowest for VR-maintained behaviors.` },
    { loId: 'appsych.operant-conditioning', content: `PUNISHMENT EFFECTIVENESS CONDITIONS: punishment works best when it is IMMEDIATE, CONSISTENT, MILD, and paired with REINFORCEMENT OF AN ALTERNATIVE behavior. It fails when delayed, inconsistent, or severe, and when no alternative is taught. Core reason reinforcement is preferred: punishment only SUPPRESSES unwanted behavior — it never teaches the right one — and suppressed behavior returns when the punisher is absent.` },
    { loId: 'appsych.operant-conditioning', kind: 'definition', title: 'negative reinforcement', content: `removing an unpleasant stimulus to INCREASE a behavior (buckling stops the buzzer). It is reinforcement, not punishment.` },
    { loId: 'appsych.operant-conditioning', kind: 'definition', title: 'variable ratio schedule', content: `reinforcement after an unpredictable average number of responses; produces the highest response rate and the greatest resistance to extinction.` },
  ],
  methods: [
    {
      title: 'Classify a consequence into the four-box framework',
      steps: [
        `STEP 1 — Ask: does the target behavior INCREASE or DECREASE afterward? Increase = reinforcement; decrease = punishment. Decide this FIRST.`,
        `STEP 2 — Ask: was something ADDED or REMOVED? Added = positive; removed = negative.`,
        `STEP 3 — Combine the two answers into one of the four boxes: add + increase = positive reinforcement; remove + increase = negative reinforcement; add + decrease = positive punishment; remove + decrease = negative punishment.`,
        `STEP 4 — Sanity-check the negative-reinforcement trap: if an aversive thing STOPPED and the behavior GREW, that is reinforcement, not punishment.`,
      ],
      example: {
        problem: `Classify: (a) child gets a cookie for finishing homework; (b) mom stops nagging when the child cleans; (c) dog gets a shock for chasing cars; (d) video game taken away for hitting a sibling.`,
        solution: `(a) POSITIVE REINFORCEMENT — cookie added, homework increases. (b) NEGATIVE REINFORCEMENT — nagging removed, cleaning increases. (c) POSITIVE PUNISHMENT — shock added, chasing decreases. (d) NEGATIVE PUNISHMENT — game removed, hitting decreases.`,
      },
      relatedLoIds: ['appsych.operant-conditioning'],
    },
    {
      title: 'Identify a reinforcement schedule',
      steps: [
        `STEP 1 — Ask: is reinforcement based on a COUNT of responses (ratio) or the passage of TIME (interval)?`,
        `STEP 2 — Ask: is the requirement PREDICTABLE (fixed) or UNPREDICTABLE around an average (variable)?`,
        `STEP 3 — Combine: FR (every Nth response — piecework, commission per sale), VR (random count — slot machines), FI (first response after a set time — biweekly paycheck), VI (first response after a random time — pop quizzes).`,
        `STEP 4 — If asked about behavior patterns: ratio → higher rates; variable → more extinction-resistant; VR → highest rate AND hardest to extinguish.`,
      ],
      example: {
        problem: `Match schedules: (a) slot machines; (b) salesperson paid per sale; (c) paycheck every two weeks; (d) pop quizzes.`,
        solution: `(a) VARIABLE RATIO — random number of pulls; explains gambling addiction. (b) FIXED RATIO — every Nth response. (c) FIXED INTERVAL — set time period. (d) VARIABLE INTERVAL — unpredictable timing, steady studying.`,
      },
      relatedLoIds: ['appsych.operant-conditioning'],
    },
    {
      title: 'Design a shaping procedure',
      steps: [
        `STEP 1 — Define the exact TARGET behavior (dog rolls fully over; student raises hand silently).`,
        `STEP 2 — Break the path into small SUCCESSIVE APPROXIMATIONS, starting from something the learner already does (lying down; raising hand while still calling out).`,
        `STEP 3 — Reinforce the first approximation until reliable, then RAISE THE CRITERION — reinforce only the next-closer step, withholding reward for earlier steps.`,
        `STEP 4 — Continue tightening until only the full target behavior earns reinforcement.`,
        `STEP 5 — Maintain: shift from continuous to INTERMITTENT (ideally variable-ratio) reinforcement, and add any verbal cue only after the behavior is shaped.`,
      ],
      example: {
        problem: `A teacher wants a student to raise their hand instead of calling out. Describe the shaping procedure.`,
        solution: `Reinforce ANY hand-raise (even with calling out) → then only hand-raises with briefer call-outs → then hand-raise before speaking → then hand-raise with silence. Use praise or points; fade external rewards as the habit forms. Complex behavior built through small reinforced steps.`,
      },
      relatedLoIds: ['appsych.operant-conditioning'],
    },
  ],
  pointers: [
    { content: `Two questions classify anything: increase or decrease (reinforce vs punish)? added or removed (positive vs negative)?`, kind: 'tip' },
    { content: `Negative reinforcement is NOT punishment — it removes something aversive and the behavior INCREASES.`, kind: 'tip' },
    { content: `Ratio beats interval for response rate; variable beats fixed for extinction resistance; VR wins both — slot machines.`, kind: 'tip' },
    { content: `Continuous reinforcement: fast learning, fast extinction. Teach continuous, maintain intermittent.`, kind: 'tip' },
    { content: `Punishment only suppresses; it never teaches the right behavior. Reinforce an alternative instead.`, kind: 'tip' },
    { content: `Primary reinforcers are innate (food, water); secondary ones are learned (money, grades, praise).`, kind: 'tip' },
  ],
};
