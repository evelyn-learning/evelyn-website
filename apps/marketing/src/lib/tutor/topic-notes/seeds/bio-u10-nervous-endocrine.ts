/**
 * Biology — Unit 10 CED 10.4: The Nervous & Endocrine Systems.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.bio.nervous-endocrine.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_BIO_U10_NERVOUS_ENDOCRINE: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.bio.nervous-endocrine.v1',
  course: 'Biology',
  cedUnit: 10,
  cedTopic: '10.4',
  cedTitle: 'The Nervous & Endocrine Systems',
  planId: 'evelyn.hs.bio.nervous-endocrine.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.bio.nervous-endocrine.v1' }],
  theory: [
    { loId: 'bio.nervous-endocrine', kind: 'framework', title: 'The neuron, in signal order', content: `THE NEURON, IN SIGNAL ORDER — DENDRITES receive incoming signals, the CELL BODY holds the nucleus and sums them, the AXON carries the impulse away, and the AXON TERMINALS at the far end hand the signal off. Signal flow is one-way: dendrites → cell body → axon → axon terminals. MYELIN is the fatty sheath wrapped around many axons; it insulates the axon and makes conduction far faster, which is why a myelinated neuron outruns a bare one.` },
    { loId: 'bio.nervous-endocrine', kind: 'framework', title: 'Electrical along, chemical across', content: `ELECTRICAL ALONG, CHEMICAL ACROSS — inside one neuron the impulse is an ELECTRICAL signal travelling the length of the axon. But neurons do not touch: at the SYNAPSE there is a tiny gap. The impulse cannot jump it. Instead the axon terminals release NEUROTRANSMITTERS, chemical messengers that diffuse across the gap and bind to receptors on the next cell, which starts a new electrical impulse there. Every neuron-to-neuron handoff is electrical, then chemical, then electrical again.` },
    { loId: 'bio.nervous-endocrine', kind: 'framework', title: 'CNS vs PNS', content: `CNS VS PNS — the CENTRAL nervous system is the brain and spinal cord, the processing and decision centers. The PERIPHERAL nervous system is every nerve outside them: sensory neurons carrying information IN toward the CNS, and motor neurons carrying commands OUT to muscles and glands.` },
    { loId: 'bio.nervous-endocrine', kind: 'framework', title: 'The reflex arc', content: `THE REFLEX ARC — a reflex runs sensory neuron → spinal cord (via a short relay neuron) → motor neuron → muscle, and the muscle acts BEFORE the brain has processed anything. It bypasses the brain purely for SPEED: the round trip up to the brain and back costs time the tissue does not have. The brain is still informed a moment later, which is why you feel the pain after your hand has already moved — the feeling is not what caused the movement.` },
    { loId: 'bio.nervous-endocrine', kind: 'framework', title: 'The endocrine system', content: `THE ENDOCRINE SYSTEM — GLANDS (pituitary, thyroid, adrenal, pancreas, ovaries and testes) release HORMONES directly into the BLOODSTREAM. There is no wire and no address: the blood carries each hormone everywhere in the body within about a minute.` },
    { loId: 'bio.nervous-endocrine', kind: 'framework', title: 'Receptors make it specific', content: `RECEPTORS MAKE IT SPECIFIC — a hormone reaches every cell but only affects cells carrying a matching RECEPTOR for it, the way a key fits only certain locks. That is how a body-wide broadcast still produces a specific response in specific organs.` },
    { loId: 'bio.nervous-endocrine', kind: 'framework', title: 'The central comparison', content: `THE CENTRAL COMPARISON — NERVOUS signals are FAST (milliseconds), BRIEF (they stop when the impulses stop) and TARGETED (delivered to particular cells down a particular axon). HORMONAL signals are SLOWER (seconds to minutes), LONGER-LASTING (minutes to days, until the hormone is broken down) and BROADCAST body-wide through the blood. If you can only remember one thing from this lesson, remember those three contrasts.` },
    { loId: 'bio.nervous-endocrine', kind: 'framework', title: 'Examples that show the split', content: `EXAMPLES THAT SHOW THE SPLIT — adrenaline from the adrenal glands floods the blood during fight-or-flight, which is why your heart keeps racing long after the scare; insulin and glucagon from the pancreas adjust blood glucose over minutes, the same hormones you met when studying blood-sugar control; growth hormone from the pituitary acts over years; thyroid hormone sets metabolic rate continuously. Compare all of those to the reflex that pulled your hand back in under a tenth of a second.` },
    { loId: 'bio.nervous-endocrine', kind: 'definition', title: 'synapse', content: `the tiny gap between two neurons, crossed by neurotransmitters rather than by the electrical impulse itself.` },
    { loId: 'bio.nervous-endocrine', kind: 'definition', title: 'neurotransmitter', content: `a chemical messenger released by axon terminals that binds receptors on the next cell.` },
    { loId: 'bio.nervous-endocrine', kind: 'definition', title: 'hormone', content: `a chemical messenger released by a gland into the bloodstream, acting only on cells with matching receptors.` },
    { loId: 'bio.nervous-endocrine', kind: 'definition', title: 'reflex arc', content: `the sensory neuron to spinal cord to motor neuron pathway that produces a response without waiting for the brain.` },
  ],
  methods: [
    {
      title: 'Worked reflex arc trace',
      steps: [
        `Start at the stimulus: pain receptors in the skin of the foot detect the tack and trigger an impulse in a SENSORY neuron.`,
        `Follow that sensory neuron IN: its axon carries the electrical impulse up the leg to the SPINAL CORD, part of the central nervous system.`,
        `Cross the first synapse: the sensory neuron releases neurotransmitters onto a short relay neuron inside the spinal cord, which passes the signal straight across to a MOTOR neuron. This is the shortcut — the signal is not sent up to the brain first.`,
        `Follow the motor neuron OUT: its axon carries a new electrical impulse back down the leg to the muscle, and the axon terminals release neurotransmitter onto the muscle, which contracts and lifts the foot.`,
        `Account for the pain: a separate branch of the sensory signal does travel up the spinal cord to the brain, but that longer trip plus conscious processing takes more time. The movement is already finished when the brain registers pain, so the pain did not cause the withdrawal.`,
      ],
      example: { problem: `You step barefoot on a sharp tack and your leg pulls back before you feel any pain. Trace the signal from the skin of your foot to the leg muscle, naming each structure in order, and explain why the pain arrives after the movement.`, solution: `Pain receptor in the skin → sensory neuron → spinal cord (relay neuron) → motor neuron → leg muscle contracts. The brain is informed on a slower parallel path, so you feel the pain after the leg has already moved.` },
      relatedLoIds: ['bio.nervous-endocrine'],
    },
    {
      title: 'Worked nervous or endocrine',
      steps: [
        `Separate the two responses: (1) the head turning toward the sound, and (2) the pounding heart that persists for minutes.`,
        `Time the first response. Turning the head happens in a fraction of a second and stops as soon as she has looked. Fast onset plus brief duration plus a specific set of neck muscles is the signature of NERVOUS signalling — impulses travelling down motor neurons to those muscles.`,
        `Time the second response. The pounding starts a few seconds in and outlasts the danger by minutes, and it is not confined to one muscle: heart rate, breathing and sweating all change together. Slow onset plus long duration plus body-wide reach is the signature of ENDOCRINE signalling.`,
        `Name the messenger for the second response: adrenaline released by the adrenal glands into the bloodstream, reaching heart cells that carry adrenaline receptors. It keeps working until it is broken down, which is why she cannot simply switch it off once she knows she is safe.`,
        `State the general rule you used: near-instant and brief and localized means nerves; delayed and sustained and widespread means hormones.`,
      ],
      example: { problem: `A student is startled by a loud bang. Her head snaps toward the sound almost instantly, and her heart is still pounding four minutes later. Decide which communication system produced each of the two responses, and justify each choice using speed, duration and reach.`, solution: `The head turn is nervous (fast, brief, targeted to specific muscles); the lasting pounding heart is endocrine — adrenaline broadcast in the blood, slow to start and slow to clear.` },
      relatedLoIds: ['bio.nervous-endocrine'],
    },
  ],
  pointers: [
    { content: `Hormones never travel along nerves. Glands like the pancreas release hormones into the BLOODSTREAM, which carries them everywhere in the body over seconds to minutes; the liver responds because liver cells carry insulin receptors, not because a wire runs to it. Nerves carry electrical impulses down axons to particular cells in milliseconds. Same job — sending a message — completely different delivery system, speed, duration and reach.`, kind: 'common-error' },
    { content: `Signal direction in a neuron: dendrites receive → cell body → axon carries → axon terminals hand off. Myelin insulates the axon and speeds conduction.`, kind: 'tip' },
    { content: `Electrical ALONG the neuron, CHEMICAL across the synapse — neurotransmitters cross the gap, the impulse itself never does.`, kind: 'tip' },
    { content: `CNS = brain and spinal cord (processing); PNS = the sensory and motor nerves connecting the CNS to the rest of the body.`, kind: 'tip' },
    { content: `A reflex arc runs sensory neuron → spinal cord → motor neuron and skips the brain for SPEED; the brain is informed afterward, which is why the pain arrives after the movement.`, kind: 'tip' },
    { content: `Endocrine glands release hormones into the BLOODSTREAM; the hormone reaches every cell but acts only on cells with matching receptors.`, kind: 'tip' },
    { content: `The comparison to carry out of this lesson: nervous = fast, brief, targeted; hormonal = slower, longer-lasting, broadcast body-wide (adrenaline, insulin and glucagon, growth hormone, thyroid hormone).`, kind: 'tip' },
    { content: `Hormones travel in the **bloodstream**, never along nerves. Writing "the pancreas sends insulin along a nerve to the liver" merges the two systems. Glands have no wiring — specificity comes from receptors on target cells, not from an address.`, kind: 'common-error' },
    { content: `Don't say the impulse "jumps the synapse." The electrical signal stops at the axon terminals; **neurotransmitters** diffuse across and trigger a *new* impulse in the next cell. Electrical → chemical → electrical, every single handoff.`, kind: 'vocab-note' },
    { content: `Sensory = IN toward the CNS, motor = OUT to muscles and glands. Both are **PNS**; only the brain and spinal cord are CNS. The relay neuron inside the spinal cord is CNS, so a reflex arc is not purely peripheral.`, kind: 'vocab-note' },
    { content: `A reflex bypasses the **brain**, not the spinal cord — the spinal cord is still doing the processing. Never write "the reflex skips the CNS."`, kind: 'gotcha' },
    { content: `Feeling the pain does NOT cause the withdrawal. The pain signal runs up a slower parallel path to the brain and arrives after the muscle has already contracted. Order your answer: move first, feel second.`, kind: 'common-error' },
    { content: `When sorting a response into nervous vs endocrine, check all three clues: speed, **duration**, and reach. Duration is the giveaway — anything still happening minutes later (racing heart, raised blood sugar) is hormonal even if the trigger was instant.`, kind: 'tip' },
    { content: `One event can use both systems at once. A startle produces a nervous head-turn AND an adrenaline surge — split the scenario into separate responses and label each one rather than picking a single system for the whole event.`, kind: 'edge-case' },
    { content: `Myelin doesn't create the impulse or change its direction — it insulates the axon so conduction is faster. Signal flow stays one-way: dendrites → cell body → axon → axon terminals.`, kind: 'gotcha' },
  ],
};
