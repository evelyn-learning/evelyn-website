/**
 * AP Psychology — Unit 1 CED 1.3: The Neuron and Neural Firing.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.psych.neurons-neurotransmitters.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
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
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.psych.neurons-neurotransmitters.v1' }],
  theory: [
    { loId: 'appsych.neurons-neurotransmitters', content: 'NEURON STRUCTURE:' },
    { loId: 'appsych.neurons-neurotransmitters', content: '  • DENDRITES: branching extensions that RECEIVE signals from other neurons.' },
    { loId: 'appsych.neurons-neurotransmitters', content: '  • CELL BODY (soma): contains nucleus; integrates incoming signals.' },
    { loId: 'appsych.neurons-neurotransmitters', content: '  • AXON: long fiber that CARRIES the signal away from the cell body.' },
    { loId: 'appsych.neurons-neurotransmitters', content: `  • MYELIN SHEATH: fatty insulation around axon; speeds signal transmission. Multiple sclerosis attacks myelin → slow/disrupted signals.` },
    { loId: 'appsych.neurons-neurotransmitters', content: '  • TERMINAL BUTTONS (axon terminals): release neurotransmitters into synapse.' },
    { loId: 'appsych.neurons-neurotransmitters', content: 'ACTION POTENTIAL: brief electrical charge that travels down the axon.' },
    { loId: 'appsych.neurons-neurotransmitters', content: '  • RESTING POTENTIAL: -70 mV (inside negative relative to outside).' },
    { loId: 'appsych.neurons-neurotransmitters', content: `  • THRESHOLD: ~-55 mV. If sum of incoming signals reaches threshold, neuron fires.` },
    { loId: 'appsych.neurons-neurotransmitters', content: '  • DEPOLARIZATION: Na⁺ rushes IN; charge briefly becomes positive (+40 mV).' },
    { loId: 'appsych.neurons-neurotransmitters', content: '  • REPOLARIZATION: K⁺ rushes OUT; charge returns to negative.' },
    { loId: 'appsych.neurons-neurotransmitters', content: '  • REFRACTORY PERIOD: brief recovery before neuron can fire again.' },
    { loId: 'appsych.neurons-neurotransmitters', content: `  • ALL-OR-NONE: neuron either fires fully or not at all. Stronger stimulus = MORE neurons firing or HIGHER frequency, not stronger AP.` },
    { loId: 'appsych.neurons-neurotransmitters', content: 'SYNAPSE: junction between neurons.' },
    { loId: 'appsych.neurons-neurotransmitters', content: `  • Action potential reaches axon terminal → triggers vesicles to release NEUROTRANSMITTERS into synaptic cleft.` },
    { loId: 'appsych.neurons-neurotransmitters', content: `  • NTs bind to receptors on next neuron's dendrites.` },
    { loId: 'appsych.neurons-neurotransmitters', content: '  • REUPTAKE: leftover NT is reabsorbed by sending neuron.' },
    { loId: 'appsych.neurons-neurotransmitters', content: 'MAJOR NEUROTRANSMITTERS (memorize):' },
    { loId: 'appsych.neurons-neurotransmitters', content: `  • DOPAMINE (DA): movement, learning, attention, REWARD/PLEASURE. Excess linked to schizophrenia; deficit to Parkinson's.` },
    { loId: 'appsych.neurons-neurotransmitters', content: `  • SEROTONIN (5-HT): mood, hunger, sleep, arousal. Low levels linked to DEPRESSION (SSRIs increase it).` },
    { loId: 'appsych.neurons-neurotransmitters', content: `  • NOREPINEPHRINE (NE): alertness, arousal, fight-or-flight. Low levels linked to depression.` },
    { loId: 'appsych.neurons-neurotransmitters', content: `  • GABA: major INHIBITORY NT. Reduces neuronal activity. Low levels linked to anxiety, seizures.` },
    { loId: 'appsych.neurons-neurotransmitters', content: `  • GLUTAMATE: major EXCITATORY NT. Memory formation. Excess can over-stimulate (seizures, migraines).` },
    { loId: 'appsych.neurons-neurotransmitters', content: `  • ACETYLCHOLINE (ACh): muscle action, memory. Alzheimer's linked to ACh deficit.` },
    { loId: 'appsych.neurons-neurotransmitters', content: `  • ENDORPHINS: natural painkillers, "runner's high." Released during exercise, pain, eating chocolate.` },
    { loId: 'appsych.neurons-neurotransmitters', content: '  • SUBSTANCE P: pain perception.' },
    { loId: 'appsych.neurons-neurotransmitters', content: 'AGONISTS vs ANTAGONISTS:' },
    { loId: 'appsych.neurons-neurotransmitters', content: `  • AGONIST: drug that MIMICS or ENHANCES a neurotransmitter's action (binds to receptor and activates). E.g., morphine (mimics endorphins), nicotine (ACh agonist), cocaine (DA reuptake inhibitor).` },
    { loId: 'appsych.neurons-neurotransmitters', content: `  • ANTAGONIST: drug that BLOCKS a neurotransmitter's action (binds to receptor without activating). E.g., antipsychotics (DA antagonists), atropine (ACh antagonist).` },
    { loId: 'appsych.neurons-neurotransmitters', kind: 'definition', title: 'action potential', content: 'electrical signal traveling down an axon.' },
    { loId: 'appsych.neurons-neurotransmitters', kind: 'definition', title: 'neurotransmitter', content: 'chemical messenger released at synapse.' },
    { loId: 'appsych.neurons-neurotransmitters', kind: 'definition', title: 'agonist', content: 'drug that mimics or enhances a neurotransmitter.' },
    { loId: 'appsych.neurons-neurotransmitters', kind: 'definition', title: 'antagonist', content: `drug that blocks a neurotransmitter's action.` },
  ],
  methods: [
    {
      title: 'Worked action',
      steps: [
        '(1) HEAT receptors on finger SKIN activate sensory neurons.',
        `(2) SENSORY NEURON sends action potential up arm — Na⁺ rushes in, K⁺ out, depolarization-repolarization cycle propagates along myelinated axon at ~120 m/s.`,
        `(3) Signal arrives at axon terminal in SPINAL CORD. Vesicles release NT (typically GLUTAMATE) into synaptic cleft.`,
        '(4) NT binds to interneuron receptors → action potential in INTERNEURON.',
        `(5) Interneuron synapses with MOTOR NEURON. Motor neuron sends action potential down arm to bicep muscles.`,
        `(6) Motor neuron releases ACETYLCHOLINE at neuromuscular junction → muscles contract → hand pulls away.`,
        `(7) THE BRAIN gets the "ouch" signal AFTER the spinal-cord reflex already moved the hand. This reflex arc protects you faster than conscious processing would.`,
      ],
      example: { problem: `Trace the path of a signal from your finger touching a hot stove to the moment your spinal cord triggers your hand to pull away.`, solution: 'Sensory neuron → spinal cord interneuron → motor neuron → muscle. Reflex arc.' },
      relatedLoIds: ['appsych.neurons-neurotransmitters'],
    },
  ],
  pointers: [
    { content: `Neuron parts: dendrite (receive), soma, axon (send), myelin (speed), terminal (release NT).`, kind: 'tip' },
    { content: `Action potential: -70 mV resting → threshold → Na⁺ in → +40 mV → K⁺ out → reset. All-or-none.`, kind: 'tip' },
    { content: `NTs: DA reward, 5-HT mood, NE alertness, GABA inhibitory, ACh muscle/memory, endorphin pain.`, kind: 'tip' },
    { content: 'Agonist mimics/boosts NT; antagonist blocks NT.', kind: 'tip' },
  ],
};
