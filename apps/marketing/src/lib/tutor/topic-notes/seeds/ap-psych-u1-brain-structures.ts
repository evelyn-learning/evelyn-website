/** AP Psychology — Unit 1 CED 1.4: The Brain.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.psych.brain-structures.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_PSYCH_BRAIN_STRUCTURES: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.psych.brain-structures.v1',
  course: 'AP Psychology',
  cedUnit: 1,
  cedTopic: '1.4',
  cedTitle: 'The Brain',
  planId: 'evelyn.ap.psych.brain-structures.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.psych.brain-structures.v1' }],
  theory: [
    { loId: 'appsych.brain-structures', content: `BIG IDEA: the brain is FUNCTIONALLY SPECIALIZED — specific regions do specific jobs. We know this largely from LESION STUDIES: when an area is damaged, predictable abilities disappear (Phineas Gage, patient HM). The brain organizes into three regions from oldest to newest: HINDBRAIN, MIDBRAIN, FOREBRAIN.` },
    { loId: 'appsych.brain-structures', content: `HINDBRAIN (life support). MEDULLA: controls heartbeat, breathing, and blood pressure — damage is fatal. PONS: sleep, arousal, facial expressions, and breathing rhythm. CEREBELLUM ("little brain"): balance, coordination, and MOTOR LEARNING (riding a bike, typing). A telltale cerebellum sign is clumsy, uncoordinated movement.` },
    { loId: 'appsych.brain-structures', content: `MIDBRAIN. RETICULAR FORMATION (reticular activating system): governs AROUSAL, alertness, and the sleep-wake cycle — damage can cause coma. SUBSTANTIA NIGRA: produces dopamine and DEGENERATES in Parkinson's disease, linking this region to movement.` },
    { loId: 'appsych.brain-structures', content: `FOREBRAIN — subcortical parts. THALAMUS: the SENSORY RELAY station or "switchboard" — all senses EXCEPT SMELL pass through it on the way to the cortex. HYPOTHALAMUS: drives HUNGER, thirst, body temperature, and sex drive; runs the autonomic nervous system; and controls the pituitary gland (the link between brain and endocrine system).` },
    { loId: 'appsych.brain-structures', kind: 'definition', title: 'limbic system', content: `a group of forebrain structures handling EMOTION and MEMORY. Key members: the hippocampus (new memories) and the amygdala (fear and aggression).` },
    { loId: 'appsych.brain-structures', content: `LIMBIC DETAIL. HIPPOCAMPUS: forms NEW explicit memories. Damage causes ANTEROGRADE AMNESIA — the inability to form new memories while old ones survive (patient HM lost his hippocampus and could not remember anything new for the rest of his life). AMYGDALA: the FEAR and aggression center; damage can make animals abnormally fearless and calm.` },
    { loId: 'appsych.brain-structures', content: `CEREBRAL CORTEX — the wrinkled outer gray matter, split into FOUR LOBES per hemisphere (eight total). FRONTAL LOBE: planning, judgment, personality, and motor control; contains the MOTOR CORTEX (the homunculus strip) and BROCA'S AREA (left frontal) for SPEECH PRODUCTION. Phineas Gage took a rail spike through the frontal lobe and his personality changed dramatically — showing this lobe governs planning and impulse control.` },
    { loId: 'appsych.brain-structures', content: `THE OTHER THREE LOBES. PARIETAL LOBE: TOUCH and spatial awareness; contains the SOMATOSENSORY CORTEX (sensory strip). TEMPORAL LOBE: HEARING and language comprehension; contains WERNICKE'S AREA (left temporal) for UNDERSTANDING language — damage causes fluent but meaningless speech. OCCIPITAL LOBE: VISION; damage causes cortical blindness even though the eyes are healthy.` },
    { loId: 'appsych.brain-structures', content: `BROCA vs WERNICKE (high-yield contrast). BROCA'S AREA (left frontal) = speech PRODUCTION; damage gives halting, telegraphic speech with intact comprehension (Broca's aphasia). WERNICKE'S AREA (left temporal) = language COMPREHENSION; damage gives fluent but nonsensical speech that the patient can't monitor. Broca = can't produce; Wernicke = can't understand.` },
    { loId: 'appsych.brain-structures', content: `HEMISPHERIC SPECIALIZATION. LEFT hemisphere: language, math, logic, analytical thinking; controls the RIGHT side of the body. RIGHT hemisphere: spatial skills, music, face recognition, holistic processing; controls the LEFT side of the body. The CORPUS CALLOSUM is the thick fiber band connecting the two. Note the CROSSOVER: each hemisphere controls the OPPOSITE side.` },
    { loId: 'appsych.brain-structures', content: `SPLIT-BRAIN RESEARCH (Roger Sperry). Cutting the corpus callosum (an old epilepsy treatment) leaves each hemisphere working on its own. Classic result: an object flashed to the LEFT visual field reaches the RIGHT hemisphere — the patient CANNOT NAME it (language sits in the LEFT hemisphere) but CAN pick it out with the LEFT HAND (right-hemisphere control). This proved the hemispheres can process independently.` },
    { loId: 'appsych.brain-structures', kind: 'definition', title: 'plasticity', content: `the brain's ability to REORGANIZE and form new neural connections. Strongest in young brains but present for life; lets healthy tissue take over after injury.` },
    { loId: 'appsych.brain-structures', content: `PLASTICITY AND IMAGING. PLASTICITY: after a stroke, nearby tissue can assume lost functions; learning physically rewires connections; NEUROGENESIS (new neuron growth, e.g. in the hippocampus) continues through life. NEUROIMAGING tools: EEG reads electrical activity (great TIMING, poor location); CT and MRI show STRUCTURE; fMRI tracks blood flow to show ACTIVITY (great location, poorer timing); PET tracks radioactive glucose to find active regions.` },
  ],
  methods: [
    {
      title: 'Localize damage from symptoms',
      when_to_use: 'When a case describes a lost ability and asks which brain region is damaged.',
      steps: [
        `STEP 1 — Isolate the CORE deficit: is it memory, movement, emotion, language, vision, or coordination?`,
        `STEP 2 — Map the deficit to its specialized region (memory-forming to hippocampus, coordination to cerebellum, vision to occipital, fear to amygdala, speech production to Broca's/left frontal).`,
        `STEP 3 — For language or motor signs, apply the CROSSOVER rule: left-brain damage shows up on the RIGHT side of the body, and vice versa.`,
        `STEP 4 — Check what is SPARED to confirm: intact comprehension with broken speech points to Broca's, not Wernicke's; preserved old memories with no new ones points to the hippocampus.`,
        `STEP 5 — Add a plasticity note where relevant: nearby tissue may recover some function over months.`,
      ],
      example: {
        problem: `A stroke damages a patient's left frontal lobe near Broca's area. Predict the symptoms.`,
        solution: `Broca's aphasia — halting, effortful speech PRODUCTION with intact comprehension — plus RIGHT-side weakness (left-brain motor damage crosses over). Understanding is preserved because Wernicke's area (left temporal) is untouched. Plasticity may restore some function over months.`,
      },
      relatedLoIds: ['appsych.brain-structures'],
    },
    {
      title: 'Reason through a split-brain task',
      when_to_use: 'When an item flashes a stimulus to one visual field of a split-brain patient.',
      steps: [
        `STEP 1 — Route the input: LEFT visual field goes to the RIGHT hemisphere; RIGHT visual field goes to the LEFT hemisphere.`,
        `STEP 2 — Locate language in the LEFT hemisphere: only the hemisphere that received the input AND has language can NAME the item verbally.`,
        `STEP 3 — Map the hands: the LEFT hand is controlled by the RIGHT hemisphere; the RIGHT hand by the LEFT hemisphere.`,
        `STEP 4 — Combine: a right-hemisphere-only stimulus can be pointed to or drawn with the LEFT hand but cannot be spoken; asked aloud, the patient may say they saw nothing.`,
      ],
      example: {
        problem: `A split-brain patient sees the word "DOG" only in their LEFT visual field. What can they do?`,
        solution: `The word reaches the RIGHT hemisphere. The patient CANNOT verbally name "dog" (language is in the left hemisphere, which never saw it) and may report seeing nothing, but CAN point to or draw a dog with the LEFT HAND (right-hemisphere control).`,
      },
      relatedLoIds: ['appsych.brain-structures'],
    },
  ],
  pointers: [
    { content: 'Hindbrain keeps you alive: medulla (heartbeat/breathing), pons (sleep), cerebellum (coordination/motor learning).', kind: 'tip' },
    { content: 'Thalamus relays ALL senses except smell; hypothalamus drives hunger/thirst/temperature and runs the pituitary.', kind: 'tip' },
    { content: 'Hippocampus forms new memories (damage = anterograde amnesia); amygdala handles fear and aggression.', kind: 'tip' },
    { content: 'Broca (left frontal) = speech production; Wernicke (left temporal) = comprehension. Broca cant produce, Wernicke cant understand.', kind: 'tip' },
    { content: 'Each hemisphere controls the OPPOSITE side of the body; the corpus callosum links them.', kind: 'tip' },
    { content: 'fMRI = activity via blood flow (good space); EEG = electrical waves (good timing). Dont mix them up on the exam.', kind: 'tip' },
  ],
};
