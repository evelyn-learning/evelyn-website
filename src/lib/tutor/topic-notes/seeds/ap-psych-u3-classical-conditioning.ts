/**
 * AP Psychology — Unit 3 CED 3.7: Classical Conditioning.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.psych.classical-conditioning.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_PSYCH_CLASSICAL_CONDITIONING: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.psych.classical-conditioning.v1',
  course: 'AP Psychology',
  cedUnit: 3,
  cedTopic: '3.7',
  cedTitle: 'Classical Conditioning',
  planId: 'evelyn.ap.psych.classical-conditioning.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.psych.classical-conditioning.v1' }],
  theory: [
    { loId: 'appsych.classical-conditioning', content: `CLASSICAL CONDITIONING is learning by ASSOCIATION between two STIMULI. Pavlov (Nobel Prize 1904) discovered it studying digestion: his dogs salivated at the sound of footsteps BEFORE food arrived — they had learned that footsteps PREDICTED food. He then rang a bell with every food presentation; after many pairings the dogs SALIVATED to the bell ALONE. The bell originally carried no meaning; the pairing gave it one.` },
    { loId: 'appsych.classical-conditioning', content: `FOUR COMPONENTS (memorize with the Pavlov example): UCS (unconditioned stimulus) — naturally triggers a response without learning: FOOD. UCR (unconditioned response) — the natural automatic reaction: SALIVATION to food. CS (conditioned stimulus) — originally neutral, triggers a response only after learning: BELL. CR (conditioned response) — the LEARNED reaction to the CS: SALIVATION to the bell. Before conditioning the bell is an NS (neutral stimulus) that elicits nothing.` },
    { loId: 'appsych.classical-conditioning', content: `THE THREE-PHASE PROCESS: (1) BEFORE conditioning — UCS produces UCR; NS produces no response. (2) DURING conditioning — NS is repeatedly PAIRED with UCS. (3) AFTER conditioning — the NS has become a CS and produces the CR on its own. To identify components in any scenario, first find the naturally powerful stimulus (UCS) and its automatic response (UCR); whatever got paired with it is the CS.` },
    { loId: 'appsych.classical-conditioning', content: `ACQUISITION: the initial learning of the CS-UCS association; usually requires multiple pairings. TIMING MATTERS — presenting the CS shortly BEFORE the UCS (forward conditioning) is most effective; simultaneous and backward conditioning are much weaker. The CS works because it PREDICTS the UCS.` },
    { loId: 'appsych.classical-conditioning', content: `EXTINCTION: present the CS repeatedly WITHOUT the UCS and the CR gradually weakens and disappears — the bell rings without food, and the dog eventually stops salivating. SPONTANEOUS RECOVERY: after a rest period following extinction, the CS briefly elicits the CR again (weaker than the original). This proves extinction is INHIBITION of a learned response, NOT ERASURE of it.` },
    { loId: 'appsych.classical-conditioning', content: `GENERALIZATION vs DISCRIMINATION: GENERALIZATION — stimuli SIMILAR to the CS also elicit the CR (a bell of similar tone also produces salivation); adaptive because it lets the learner recognize variations. DISCRIMINATION — the opposite: the learner responds only to the exact CS and not to similar stimuli that never predict the UCS. HIGHER-ORDER CONDITIONING: an established CS can act like a UCS to condition a NEW stimulus (pair a light with the bell, and eventually the light alone triggers salivation).` },
    { loId: 'appsych.classical-conditioning', content: `WATSON'S "LITTLE ALBERT" (1920) — classical conditioning applied to a human infant. An 11-month-old showed NO fear of a white rat (NS). Watson paired the rat with a LOUD NOISE (UCS) that naturally produced fear (UCR). After pairings, the rat alone (now the CS) produced fear (CR). Albert GENERALIZED the fear to other white furry things — rabbits, cotton, a white beard. Significance: human EMOTIONAL responses can be conditioned. ETHICS: the study is unacceptable by modern standards — no meaningful consent, deliberate harm, and the fear was never extinguished; a modern IRB would never approve it.` },
    { loId: 'appsych.classical-conditioning', content: `PHOBIAS are often classically conditioned: a neutral object (spider) is paired with a traumatic event (UCS) and becomes a CS for fear. TREATMENT reverses the learning — SYSTEMATIC DESENSITIZATION pairs relaxation with a graded fear hierarchy (counter-conditioning), and EXPOSURE THERAPY presents the CS without the UCS until the fear extinguishes. These therapies are roughly 70-90 percent effective for specific phobias.` },
    { loId: 'appsych.classical-conditioning', content: `TASTE AVERSION (the Garcia effect) — the famous EXCEPTION to normal conditioning rules: ONE pairing of a food with sickness can create a strong, lasting aversion, and the sickness can come HOURS after eating (normally the CS-UCS gap must be short). This reflects BIOLOGICAL PREPAREDNESS — evolution has made some associations (taste → nausea) far easier to learn than others, because avoiding poisons aids survival.` },
    { loId: 'appsych.classical-conditioning', kind: 'definition', title: 'unconditioned stimulus / response (UCS, UCR)', content: `the stimulus that naturally and automatically triggers a response without any learning, and that natural response (food → salivation; loud noise → fear).` },
    { loId: 'appsych.classical-conditioning', kind: 'definition', title: 'conditioned stimulus / response (CS, CR)', content: `the originally neutral stimulus that comes to trigger a response through pairing, and the learned response it now evokes (bell → salivation).` },
    { loId: 'appsych.classical-conditioning', kind: 'definition', title: 'spontaneous recovery', content: `the brief return of an extinguished CR after a rest period; evidence that extinction inhibits rather than erases the association.` },
  ],
  methods: [
    {
      title: 'Label the four components in any conditioning scenario',
      steps: [
        `STEP 1 — Find the stimulus that produces a response NATURALLY, with no learning required. That is the UCS (food, loud noise, spoiled food causing sickness).`,
        `STEP 2 — The automatic response to the UCS is the UCR (salivation, fear, nausea).`,
        `STEP 3 — Find the originally neutral stimulus that got PAIRED with the UCS. Before pairing it is the NS; after pairing it is the CS (bell, rat, smell of tuna).`,
        `STEP 4 — The response now triggered by the CS alone is the CR. The CR usually resembles the UCR but is triggered by the learned cue.`,
        `STEP 5 — Check for extensions: GENERALIZATION (similar stimuli also trigger the CR), DISCRIMINATION (only the exact CS works), or HIGHER-ORDER conditioning (a new stimulus paired with the CS).`,
      ],
      example: {
        problem: `A child gets sick after eating tuna and now feels nauseous at the SMELL of tuna. Identify the components.`,
        solution: `UCS = spoiled tuna (what caused the sickness). UCR = nausea. NS → CS = the smell of tuna. CR = nausea at the smell alone. The child may GENERALIZE to fish smells broadly. One-trial learning with a delayed UCS marks this as taste aversion (biological preparedness).`,
      },
      relatedLoIds: ['appsych.classical-conditioning'],
    },
    {
      title: 'Trace extinction and spontaneous recovery',
      steps: [
        `STEP 1 — Identify the unreinforced trials: the CS is being presented WITHOUT the UCS.`,
        `STEP 2 — Predict EXTINCTION: the CR weakens gradually across those trials until it is minimal or absent.`,
        `STEP 3 — Insert the rest period, then a fresh CS presentation: predict SPONTANEOUS RECOVERY — a weakened CR briefly returns.`,
        `STEP 4 — State the interpretation: extinction is INHIBITION, not erasure; the association survives beneath the suppressed response.`,
        `STEP 5 — Note the long run: repeated rounds of extinction after each recovery fade the response more permanently.`,
      ],
      example: {
        problem: `After 50 bell-food pairings a dog salivates to the bell. Then the bell rings 30 times with no food. (a) What happens? (b) After a one-day rest the bell rings once — what happens?`,
        solution: `(a) EXTINCTION — salivation weakens across the 30 unreinforced trials to little or nothing. (b) SPONTANEOUS RECOVERY — the bell briefly elicits weakened salivation again, showing the association was inhibited, not erased.`,
      },
      relatedLoIds: ['appsych.classical-conditioning'],
    },
  ],
  pointers: [
    { content: `UCS-UCR = natural and untrained; CS-CR = learned through pairing. Find the UCS first — everything else falls out.`, kind: 'tip' },
    { content: `Forward conditioning (CS just before UCS) works best; the CS must PREDICT the UCS.`, kind: 'tip' },
    { content: `Spontaneous recovery proves extinction is inhibition, not erasure.`, kind: 'tip' },
    { content: `Generalization = similar stimuli trigger the CR; discrimination = only the exact CS does.`, kind: 'tip' },
    { content: `Little Albert: rat = CS, loud noise = UCS, fear generalized to white furry things; ethically impossible today.`, kind: 'tip' },
    { content: `Taste aversion breaks the rules: one trial, hours-long delay — biological preparedness.`, kind: 'tip' },
  ],
};
