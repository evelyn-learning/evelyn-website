/** AP Psychology — Unit 1 CED 1.6+2.1: Sensation and Perception.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.psych.sensation-perception.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_PSYCH_SENSATION_PERCEPTION: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.psych.sensation-perception.v1',
  course: 'AP Psychology',
  cedUnit: 1,
  cedTopic: '1.6+2.1',
  cedTitle: 'Sensation and Perception',
  planId: 'evelyn.ap.psych.sensation-perception.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.psych.sensation-perception.v1' }],
  theory: [
    { loId: 'appsych.sensation-perception', kind: 'definition', title: 'sensation vs perception', content: `SENSATION is DETECTION of raw stimuli by the sense organs (a bottom-up process). PERCEPTION is the brain's INTERPRETATION of those sensations into meaningful experience (a top-down process). Illusions reveal the gap between them.` },
    { loId: 'appsych.sensation-perception', content: `PROCESSING DIRECTIONS. BOTTOM-UP: raw sensory input drives the percept, building from the details up. TOP-DOWN: experience, expectations, and context shape what we perceive. Both run at once — you read messy handwriting (bottom-up features) faster when you know the topic (top-down context).` },
    { loId: 'appsych.sensation-perception', content: `THRESHOLDS. ABSOLUTE THRESHOLD: the MINIMUM stimulus intensity you can detect 50% of the time (a candle flame 30 miles away on a clear dark night). DIFFERENCE THRESHOLD, or just-noticeable difference (JND): the SMALLEST detectable difference between two stimuli 50% of the time. WEBER'S LAW: the JND is a CONSTANT PROPORTION of the original stimulus (for weight about 2%, so noticing a change in 100 g needs about 2 g, but 10 kg needs about 200 g). SUBLIMINAL stimuli fall BELOW the absolute threshold and have little real influence despite the popular myth.` },
    { loId: 'appsych.sensation-perception', content: `ADAPTATION AND DETECTION. SENSORY ADAPTATION: a constant, unchanging stimulus fades from awareness (a cool pool stops feeling cold, you stop noticing a smell) — perception emphasizes CHANGE. SIGNAL DETECTION THEORY: whether you detect a faint stimulus depends on BOTH sensory sensitivity AND psychological factors like motivation, expectation, and fatigue, which is why thresholds vary from moment to moment and person to person.` },
    { loId: 'appsych.sensation-perception', content: `VISION — the pathway (most-tested). Light passes through the CORNEA (clear front) to the PUPIL (its size set by the IRIS) to the LENS (which focuses) to the RETINA at the back of the eye, then out the OPTIC NERVE to the brain (via the lateral geniculate nucleus to the primary visual cortex). Trace it in order: cornea, pupil, lens, retina, optic nerve, cortex.` },
    { loId: 'appsych.sensation-perception', content: `RETINA AND COLOR. The retina holds RODS (dim-light and peripheral vision, NO color) and CONES (bright light, color, and sharp detail, concentrated centrally). TRICHROMATIC theory: three cone types (red, green, blue) mix to make all colors. OPPONENT-PROCESS theory: cells respond to color PAIRS (red-green, blue-yellow, black-white), which explains AFTERIMAGES. The BLIND SPOT is where the optic nerve exits the retina — the brain fills it in so you never notice. Colorblindness usually reflects a missing cone type, is X-linked, and is more common in males.` },
    { loId: 'appsych.sensation-perception', content: `HEARING — the pathway. Sound waves enter the OUTER EAR, vibrate the EARDRUM, pass through the middle ear's THREE BONES (hammer, anvil, stirrup), reach the fluid-filled COCHLEA (which holds the hair cells), and travel out the AUDITORY NERVE to the brain. PITCH is explained by PLACE theory (high pitches vibrate near the base of the cochlea) and FREQUENCY theory (low pitches match the neurons' firing rate).` },
    { loId: 'appsych.sensation-perception', content: `HEARING LOSS. CONDUCTIVE hearing loss comes from damage to the OUTER or MIDDLE ear (like a ruptured eardrum) that blocks sound conduction. SENSORINEURAL hearing loss comes from damage to the COCHLEA'S hair cells or the auditory nerve — it is usually PERMANENT and caused by aging or loud noise. Conductive = mechanical blockage; sensorineural = nerve/hair-cell damage.` },
    { loId: 'appsych.sensation-perception', kind: 'definition', title: 'Gestalt principles', content: `rules for how the brain ORGANIZES parts into a whole (Gestalt is German for "whole"): figure-ground, proximity, similarity, closure, continuity, and common fate.` },
    { loId: 'appsych.sensation-perception', content: `GESTALT PRINCIPLES IN DETAIL. FIGURE-GROUND: separate the object (figure) from its background. PROXIMITY: near things group together. SIMILARITY: alike things group. CLOSURE: the brain fills in incomplete shapes. CONTINUITY: we prefer smooth, continuous patterns over abrupt breaks. COMMON FATE: things moving together are seen as one unit. These show perception is ACTIVE organization, not passive recording.` },
    { loId: 'appsych.sensation-perception', content: `DEPTH PERCEPTION. BINOCULAR cues need BOTH eyes: RETINAL DISPARITY (the difference between the two eyes' images — greater disparity means closer) and CONVERGENCE (the eyes angle inward for near objects). MONOCULAR cues need only ONE eye: interposition (nearer objects block farther ones), linear perspective (parallel lines converge with distance), relative size, texture gradient, light and shadow, elevation (higher in the field looks farther), and motion parallax (near objects sweep by faster as you move).` },
    { loId: 'appsych.sensation-perception', content: `PERCEPTUAL CONSTANCIES: the perceived size, shape, and color of an object STAY STABLE even as the retinal image changes. SIZE constancy keeps a friend "person-sized" whether near or far; SHAPE constancy keeps a door "rectangular" even when it swings to a slanted angle. Constancies are top-down: prior knowledge overrides the literal, shifting image on the retina.` },
  ],
  methods: [
    {
      title: 'Explain a depth illusion',
      when_to_use: 'When asked why a flat image (like converging railroad tracks) produces a sense of depth.',
      steps: [
        `STEP 1 — Name the driving MONOCULAR cue: LINEAR PERSPECTIVE — the brain reads converging lines as receding into the distance.`,
        `STEP 2 — Stack the supporting cues: TEXTURE GRADIENT (details bunch up farther away) and RELATIVE SIZE (farther objects cast smaller images).`,
        `STEP 3 — Add TOP-DOWN knowledge: we KNOW the tracks are really parallel, so we perceive depth rather than literal convergence.`,
        `STEP 4 — Invoke perceptual CONSTANCY: it holds the "parallel" interpretation even though the retinal image is converging.`,
        `STEP 5 — Note the application: artists deliberately draw parallel lines as converging to fake depth on a flat page.`,
      ],
      example: {
        problem: `Why do parallel railroad tracks appear to converge in the distance? Use perception concepts.`,
        solution: `Linear perspective, reinforced by texture gradient and relative size, signals distance, so the converging retinal image is interpreted as depth. Top-down knowledge and perceptual constancy keep us seeing the tracks as parallel and receding, not actually meeting.`,
      },
      relatedLoIds: ['appsych.sensation-perception'],
    },
    {
      title: 'Sort depth cues as binocular or monocular',
      when_to_use: 'When a scenario removes one eye or asks which cues remain.',
      steps: [
        `STEP 1 — Recall the split: BINOCULAR cues need two eyes; MONOCULAR cues work with one.`,
        `STEP 2 — Tag the binocular pair: retinal DISPARITY and CONVERGENCE — both are lost with only one eye.`,
        `STEP 3 — Tag the monocular set: linear perspective, relative size, texture gradient, interposition, elevation, light/shadow, and motion parallax — all still available.`,
        `STEP 4 — Draw the consequence: one-eyed vision keeps rough distance judgment via monocular cues (especially motion parallax when the head moves) but loses fine binocular depth for close tasks.`,
      ],
      example: {
        problem: `You close one eye. Which depth cues remain, which are lost, and why does it matter?`,
        solution: `Monocular cues (perspective, relative size, texture, interposition, motion parallax) remain, so you still judge distance fairly well. The binocular cues — retinal disparity and convergence — are lost, which hurts precise close-range tasks like parking or catching, though people adapt well.`,
      },
      relatedLoIds: ['appsych.sensation-perception'],
    },
  ],
  pointers: [
    { content: 'Sensation = detect (bottom-up); perception = interpret (top-down). Illusions expose the gap.', kind: 'tip' },
    { content: 'Absolute threshold = detect 50% of the time; JND = smallest detectable difference; Webers law makes the JND a constant proportion.', kind: 'tip' },
    { content: 'Vision order: cornea, pupil, lens, retina, optic nerve, cortex. Rods = dim/no color; cones = bright/color.', kind: 'tip' },
    { content: 'Trichromatic (three cones) explains color mixing; opponent-process (color pairs) explains afterimages.', kind: 'tip' },
    { content: 'Hearing: outer ear, eardrum, three bones, cochlea hair cells, auditory nerve. Sensorineural loss is permanent.', kind: 'tip' },
    { content: 'Binocular cues (retinal disparity, convergence) need two eyes; every other depth cue is monocular.', kind: 'tip' },
  ],
};
