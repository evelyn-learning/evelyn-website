/** AP Psychology — Unit 1 CED 1.3: The Neuron and Neural Firing.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.psych.neurons-neurotransmitters.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_PSYCH_NEURONS_NEUROTRANSMITTERS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.psych.neurons-neurotransmitters.v1',
  course: 'AP Psychology',
  cedUnit: 1,
  cedTopic: '1.3',
  cedTitle: 'The Neuron and Neural Firing',
  planId: 'evelyn.ap.psych.neurons-neurotransmitters.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.psych.neurons-neurotransmitters.v1' }],
  theory: [
    { loId: 'appsych.neurons-neurotransmitters', content: `NEURON STRUCTURE (learn the parts in signal order). DENDRITES: branching extensions that RECEIVE signals from other neurons. CELL BODY (soma): holds the nucleus and INTEGRATES all incoming signals. AXON: the long fiber that CARRIES the signal AWAY from the soma. TERMINAL BUTTONS (axon terminals): the axon's end knobs that RELEASE neurotransmitters into the synapse. Signal direction is one-way: dendrite IN, axon OUT.` },
    { loId: 'appsych.neurons-neurotransmitters', content: `MYELIN SHEATH: fatty insulation wrapped in segments around the axon. It SPEEDS UP transmission (the signal jumps between gaps). In MULTIPLE SCLEROSIS the immune system attacks myelin, so signals slow or scramble — producing weakness, numbness, and coordination loss. Myelin also thickens through childhood, part of why reaction time improves with age.` },
    { loId: 'appsych.neurons-neurotransmitters', kind: 'definition', title: 'action potential', content: `a brief ELECTRICAL charge that travels down the axon when a neuron fires. It is a wave of changing charge, not a substance that flows.` },
    { loId: 'appsych.neurons-neurotransmitters', content: `THE FIRING SEQUENCE (memorize the numbers as plain values). RESTING POTENTIAL: about -70 mV, inside NEGATIVE relative to outside — the neuron is polarized and ready. THRESHOLD: about -55 mV. If summed incoming signals push the charge TO threshold, the neuron fires. DEPOLARIZATION: sodium ions (Na+) rush IN; the inside charge briefly flips POSITIVE, near +40 mV. REPOLARIZATION: potassium ions (K+) rush OUT; charge returns toward negative. REFRACTORY PERIOD: a brief recovery window during which the neuron CANNOT fire again.` },
    { loId: 'appsych.neurons-neurotransmitters', content: `ALL-OR-NONE PRINCIPLE: a neuron either fires FULLY or not at all — there is no partial action potential. A STRONGER stimulus does NOT make a stronger single spike; instead it makes MORE neurons fire and/or the same neuron fire at a HIGHER FREQUENCY. This is how intensity (a loud sound, a hot stove) is coded.` },
    { loId: 'appsych.neurons-neurotransmitters', kind: 'definition', title: 'synapse', content: `the tiny junction between one neuron's terminal and the next neuron's dendrite. The gap itself is the synaptic cleft; signals cross it chemically, not electrically.` },
    { loId: 'appsych.neurons-neurotransmitters', content: `SYNAPTIC TRANSMISSION. The action potential reaches the axon terminal and triggers VESICLES to release NEUROTRANSMITTERS into the synaptic cleft. The NTs drift across and BIND to receptors on the next neuron's dendrites — like a key in a lock. Leftover NT is then cleared by REUPTAKE (reabsorbed by the sending neuron for reuse) or broken down by enzymes. Reuptake is the exact step many drugs target.` },
    { loId: 'appsych.neurons-neurotransmitters', content: `MAJOR NEUROTRANSMITTERS (high-yield — know effect AND a linked disorder). DOPAMINE (DA): movement, learning, attention, REWARD and pleasure. EXCESS linked to schizophrenia; DEFICIT in motor areas linked to Parkinson's. SEROTONIN (5-HT): mood, hunger, sleep, arousal. LOW levels linked to DEPRESSION (SSRIs raise it). NOREPINEPHRINE (NE): alertness, arousal, fight-or-flight; low levels also linked to depression.` },
    { loId: 'appsych.neurons-neurotransmitters', content: `MORE NEUROTRANSMITTERS. GABA: the major INHIBITORY NT — it DAMPENS neural activity; low levels linked to anxiety and seizures. GLUTAMATE: the major EXCITATORY NT — drives memory formation; excess OVER-stimulates and is linked to seizures and migraines. GABA and glutamate are the brain's brake and accelerator. ACETYLCHOLINE (ACh): muscle action and memory; a deficit is linked to Alzheimer's disease.` },
    { loId: 'appsych.neurons-neurotransmitters', content: `ENDORPHINS: the body's natural PAINKILLERS, source of the "runner's high"; released during exercise, pain, and pleasure. SUBSTANCE P: carries PAIN signals. Note the contrast — substance P announces pain, endorphins suppress it.` },
    { loId: 'appsych.neurons-neurotransmitters', kind: 'definition', title: 'agonist vs antagonist', content: `an AGONIST is a drug that MIMICS or ENHANCES a neurotransmitter's action; an ANTAGONIST is a drug that BLOCKS a neurotransmitter's action. Both bind the receptor — only the agonist activates it.` },
    { loId: 'appsych.neurons-neurotransmitters', content: `HOW DRUGS ACT ON SYNAPSES. AGONISTS mimic or boost an NT: morphine mimics endorphins, nicotine is an ACh agonist, cocaine is a DA reuptake INHIBITOR (blocks reuptake so more dopamine stays in the synapse — an agonist EFFECT at the system level). ANTAGONISTS block an NT: antipsychotics are DA antagonists (used for schizophrenia), atropine is an ACh antagonist. Key test move: a reuptake blocker RAISES available NT, so it acts like an agonist even though it never touches the receptor.` },
  ],
  methods: [
    {
      title: 'Trace a signal through the reflex arc',
      when_to_use: 'When a prompt asks you to follow a stimulus (e.g. touching a hot stove) through neurons to a response.',
      steps: [
        `STEP 1 — SENSORY (afferent) neuron fires. Receptors in the skin detect the stimulus and start an action potential that travels UP the arm toward the spinal cord.`,
        `STEP 2 — PROPAGATE the action potential: Na+ rushes IN (depolarize), K+ rushes OUT (repolarize), and the wave races along the myelinated axon (fast — roughly 120 m/s on myelinated fibers).`,
        `STEP 3 — SYNAPSE in the spinal cord. The terminal releases an NT (typically GLUTAMATE, excitatory) into the cleft; it binds the INTERNEURON and triggers its action potential.`,
        `STEP 4 — INTERNEURON to MOTOR (efferent) neuron. The motor neuron carries the command back DOWN the arm to the muscle.`,
        `STEP 5 — At the neuromuscular junction the motor neuron releases ACETYLCHOLINE; the muscle contracts and the hand pulls away.`,
        `STEP 6 — NOTE THE TIMING: the spinal reflex moves the hand BEFORE the brain consciously registers the pain. The reflex arc is faster than conscious processing — that is its protective point.`,
      ],
      example: {
        problem: `Your finger touches a hot stove. Trace the path from the skin to your hand pulling away, naming the neuron types and neurotransmitters.`,
        solution: `Sensory neuron (up arm) to spinal-cord interneuron (glutamate) to motor neuron (down arm) to muscle (acetylcholine at the neuromuscular junction). The hand withdraws by reflex arc before the brain feels the pain.`,
      },
      relatedLoIds: ['appsych.neurons-neurotransmitters'],
    },
    {
      title: 'Classify a drug as agonist or antagonist',
      when_to_use: 'When you must label how a drug interacts with a neurotransmitter system.',
      steps: [
        `STEP 1 — Identify the TARGET neurotransmitter and its normal effect (e.g. dopamine = reward).`,
        `STEP 2 — Ask what the drug DOES at the synapse: does it activate the receptor, block the receptor, or change reuptake/breakdown?`,
        `STEP 3 — MIMIC or BOOST the NT (activate receptor, or block reuptake so more NT lingers) = AGONIST effect. BLOCK the receptor so the NT can't act = ANTAGONIST.`,
        `STEP 4 — Predict the behavioral result from the NT's role (more dopamine = more reward/euphoria; blocked dopamine = reduced psychotic symptoms but possible Parkinson-like side effects).`,
      ],
      example: {
        problem: `Cocaine blocks dopamine reuptake; antipsychotics block dopamine receptors; caffeine blocks adenosine receptors. Classify each.`,
        solution: `Cocaine = AGONIST effect (reuptake blocked, more DA stays in the synapse, euphoria and addiction risk). Antipsychotics = ANTAGONIST (block DA receptors, ease schizophrenia symptoms). Caffeine = ANTAGONIST of adenosine (blocks the sleepy signal, so you feel alert).`,
      },
      relatedLoIds: ['appsych.neurons-neurotransmitters'],
    },
  ],
  pointers: [
    { content: 'Signal flow is one-way: dendrite receives, soma integrates, axon sends, terminal releases NT.', kind: 'tip' },
    { content: 'All-or-none: a stronger stimulus means MORE neurons firing or higher frequency, never a bigger single spike.', kind: 'tip' },
    { content: 'Resting about -70 mV, threshold about -55 mV, peak near +40 mV: write these as plain values, no math needed.', kind: 'tip' },
    { content: 'Pair each NT with a disorder: DA-Parkinson/schizophrenia, 5-HT-depression, ACh-Alzheimer, GABA-anxiety.', kind: 'tip' },
    { content: 'Agonist mimics or boosts an NT; antagonist blocks it. A reuptake blocker acts like an agonist.', kind: 'tip' },
    { content: 'SSRIs block serotonin reuptake, so more 5-HT stays in the synapse: an agonist effect at the system level.', kind: 'tip' },
  ],
};
