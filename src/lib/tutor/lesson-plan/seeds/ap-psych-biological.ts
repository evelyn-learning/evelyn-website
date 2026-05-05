/**
 * AP Psychology — Biological bases of behavior.
 *
 * Neurons, neurotransmitters, brain regions, the nervous system.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_PSYCH_BIOLOGICAL: LessonPlan = {
  id: 'evelyn.ap.psych.biological-bases.v1',
  title: 'Biological bases of behavior: neurons and brain regions',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'social-studies',
  topic: 'ap-psychology',
  locale: 'en',
  los: [
    {
      id: 'appsych.biological',
      description: 'Identify neuronal communication, key neurotransmitters, and major brain regions.',
      standard: 'AP-PSYCH-BIO',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'All thought = electrochemistry.',
      script: 'Every thought you have, every memory, every feeling — physically, it\'s electrochemical signals between ~86 billion neurons. Knowing the wiring helps explain why drugs change us, why brain damage changes personality, why fear feels physical.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-pillars',
      kind: 'concept',
      goal: 'Neurons + neurotransmitters + brain regions + nervous system divisions.',
      keyIdeas: [
        'NEURON parts: DENDRITES (receive signals), CELL BODY (soma), AXON (sends signal), TERMINALS (release neurotransmitters).',
        'ACTION POTENTIAL: when input passes a threshold, electrical pulse fires down the axon. ALL-OR-NOTHING — fires fully or not at all.',
        'SYNAPSE: tiny gap between neurons. NEUROTRANSMITTERS cross the gap.',
        'KEY NEUROTRANSMITTERS:',
        '  ACETYLCHOLINE (ACh): muscle movement, attention, memory. Alzheimer\'s involves ACh decline.',
        '  DOPAMINE: reward, motivation, pleasure. Imbalance: addiction (too much), Parkinson\'s (too little), schizophrenia.',
        '  SEROTONIN: mood, sleep, hunger. Many antidepressants (SSRIs) target serotonin.',
        '  NOREPINEPHRINE: alertness, arousal, fight-or-flight.',
        '  GABA: main inhibitory neurotransmitter (calms). Anxiety meds boost GABA.',
        '  GLUTAMATE: main excitatory neurotransmitter (activates).',
        '  ENDORPHINS: pain relief, pleasure. Released during exercise, eating, sex.',
        'BRAIN REGIONS:',
        '  BRAINSTEM (medulla, pons): basic life functions — breathing, heart rate.',
        '  CEREBELLUM: balance, coordination.',
        '  LIMBIC SYSTEM: emotion + memory. Hippocampus (memory), amygdala (fear/aggression), hypothalamus (drive states).',
        '  CEREBRAL CORTEX: thinking, planning, language. Four lobes:',
        '    Frontal — planning, judgment, language production (Broca\'s area).',
        '    Parietal — sensation, spatial.',
        '    Temporal — hearing, language comprehension (Wernicke\'s area).',
        '    Occipital — vision.',
        'NERVOUS SYSTEM divisions:',
        '  CENTRAL (CNS): brain + spinal cord.',
        '  PERIPHERAL (PNS): nerves outside CNS.',
        '    SOMATIC: voluntary control (skeletal muscles).',
        '    AUTONOMIC: involuntary. Sympathetic (fight/flight) vs Parasympathetic (rest/digest).',
      ],
      vocabulary: [
        { term: 'neuron', definition: 'a nerve cell that transmits signals.' },
        { term: 'neurotransmitter', definition: 'a chemical messenger that crosses synapses.' },
        { term: 'cerebral cortex', definition: 'the wrinkled outer layer of the brain responsible for higher thinking.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-pathway',
      kind: 'worked_example',
      problem: 'You touch a hot stove and yank your hand back BEFORE feeling the pain. What pathway is at work?',
      steps: [
        'Heat sensation goes via sensory neurons → SPINAL CORD.',
        'Spinal cord directly triggers a motor reflex (hand pulls back) — this is the SPINAL REFLEX.',
        'Pain signal continues UP to the brain. By the time you "feel" pain, your hand is already away.',
        'EVOLUTIONARY: skipping the brain saves precious milliseconds in danger. Reflexes act first; consciousness catches up.',
        'Demonstrated by knee-jerk reflex (no brain involvement at all).',
      ],
      answer: 'spinal reflex — fast withdrawal before conscious awareness',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A stroke damages someone\'s OCCIPITAL lobe. What might they lose?',
      expectedAnswer: 'vision (or part of visual processing)',
      responseFormat: 'free',
      hints: [
        'Each lobe handles different functions.',
        'Occipital = back of head; specifically vision.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-10-percent',
      kind: 'misconception_check',
      question: 'Do humans only use 10% of their brain?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Believing the famous myth.',
          correctsTo: 'No — completely false. Brain imaging shows essentially every region is active over a normal day. The myth has no scientific support. Specific tasks use specific regions, but ALL the brain is used.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Neuron parts: dendrites → soma → axon → terminals.',
        'Action potential is all-or-nothing.',
        'Key NTs: ACh, dopamine, serotonin, norepinephrine, GABA, glutamate, endorphins.',
        'Cortex lobes: frontal (planning), parietal (sensation), temporal (hearing/language), occipital (vision).',
        'CNS = brain + spinal cord. PNS divided into somatic and autonomic.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How do antidepressants like SSRIs work?',
      hint: 'SSRI = selective serotonin reuptake inhibitor. Blocks the reabsorption of serotonin → more serotonin lingers in the synapse → more signaling. Helps depression for many. Takes 2-6 weeks because the effects involve longer-term receptor and gene-expression changes, not just synaptic levels.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
