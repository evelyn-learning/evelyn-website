/**
 * Biology — Human Body Systems: The Nervous & Endocrine Systems.
 *
 * The two-communication-systems lesson for the HS Biology fan-out
 * (NGSS HS-LS1-2, HS-LS1-3). Homeostasis and negative feedback were taught
 * in 10.1 and are NOT re-taught here — insulin and glucagon appear only as
 * familiar examples of hormonal signalling. The concept segment is organized
 * around the one comparison students must be able to make on demand: fast,
 * brief, targeted electrical signalling versus slow, lasting, broadcast
 * chemical signalling.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_BIO_U10_NERVOUS_ENDOCRINE: LessonPlan = {
  id: 'evelyn.hs.bio.nervous-endocrine.v1',
  title: 'The Nervous & Endocrine Systems',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'biology',
  locale: 'en',
  los: [
    {
      id: 'bio.nervous-endocrine',
      standard: 'BIO-10.4',
      description:
        'Model how the nervous system carries fast electrical impulses along neurons and chemical signals across synapses while the endocrine system releases hormones into the bloodstream to reach receptor-bearing target cells, and compare the speed, duration and reach of the two systems (NGSS HS-LS1-2, HS-LS1-3).',
    },
  ],
  prerequisites: ['bio.digestive-excretory'],
  followUps: ['bio.immune-system'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the body as running two messaging systems at once — one wired, one broadcast — by contrasting timescales students have felt.',
      script:
        'Put your hand on a hot pan and it is already moving away before you have finished thinking "ow" — about a tenth of a second, and your brain got the news late. Now think about the last time something scared you: your heart was still pounding minutes after you knew you were safe. Two different messages, two completely different speeds. That is because your body sends messages two ways — down wires, and through the blood. In this lesson you will trace each route and be able to say which one a given response used, and why.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-two-signal-systems',
      kind: 'concept',
      goal: 'Neuron structure and signal direction, the electrical-then-chemical relay, CNS vs PNS, the reflex arc, and hormones as bloodstream broadcasts read only by cells with matching receptors.',
      keyIdeas: [
        'THE NEURON, IN SIGNAL ORDER — DENDRITES receive incoming signals, the CELL BODY holds the nucleus and sums them, the AXON carries the impulse away, and the AXON TERMINALS at the far end hand the signal off. Signal flow is one-way: dendrites → cell body → axon → axon terminals. MYELIN is the fatty sheath wrapped around many axons; it insulates the axon and makes conduction far faster, which is why a myelinated neuron outruns a bare one.',
        'ELECTRICAL ALONG, CHEMICAL ACROSS — inside one neuron the impulse is an ELECTRICAL signal travelling the length of the axon. But neurons do not touch: at the SYNAPSE there is a tiny gap. The impulse cannot jump it. Instead the axon terminals release NEUROTRANSMITTERS, chemical messengers that diffuse across the gap and bind to receptors on the next cell, which starts a new electrical impulse there. Every neuron-to-neuron handoff is electrical, then chemical, then electrical again.',
        'CNS VS PNS — the CENTRAL nervous system is the brain and spinal cord, the processing and decision centers. The PERIPHERAL nervous system is every nerve outside them: sensory neurons carrying information IN toward the CNS, and motor neurons carrying commands OUT to muscles and glands.',
        'THE REFLEX ARC — a reflex runs sensory neuron → spinal cord (via a short relay neuron) → motor neuron → muscle, and the muscle acts BEFORE the brain has processed anything. It bypasses the brain purely for SPEED: the round trip up to the brain and back costs time the tissue does not have. The brain is still informed a moment later, which is why you feel the pain after your hand has already moved — the feeling is not what caused the movement.',
        'THE ENDOCRINE SYSTEM — GLANDS (pituitary, thyroid, adrenal, pancreas, ovaries and testes) release HORMONES directly into the BLOODSTREAM. There is no wire and no address: the blood carries each hormone everywhere in the body within about a minute.',
        'RECEPTORS MAKE IT SPECIFIC — a hormone reaches every cell but only affects cells carrying a matching RECEPTOR for it, the way a key fits only certain locks. That is how a body-wide broadcast still produces a specific response in specific organs.',
        'THE CENTRAL COMPARISON — NERVOUS signals are FAST (milliseconds), BRIEF (they stop when the impulses stop) and TARGETED (delivered to particular cells down a particular axon). HORMONAL signals are SLOWER (seconds to minutes), LONGER-LASTING (minutes to days, until the hormone is broken down) and BROADCAST body-wide through the blood. If you can only remember one thing from this lesson, remember those three contrasts.',
        'EXAMPLES THAT SHOW THE SPLIT — adrenaline from the adrenal glands floods the blood during fight-or-flight, which is why your heart keeps racing long after the scare; insulin and glucagon from the pancreas adjust blood glucose over minutes, the same hormones you met when studying blood-sugar control; growth hormone from the pituitary acts over years; thyroid hormone sets metabolic rate continuously. Compare all of those to the reflex that pulled your hand back in under a tenth of a second.',
      ],
      vocabulary: [
        { term: 'synapse', definition: 'the tiny gap between two neurons, crossed by neurotransmitters rather than by the electrical impulse itself.' },
        { term: 'neurotransmitter', definition: 'a chemical messenger released by axon terminals that binds receptors on the next cell.' },
        { term: 'hormone', definition: 'a chemical messenger released by a gland into the bloodstream, acting only on cells with matching receptors.' },
        { term: 'reflex arc', definition: 'the sensory neuron to spinal cord to motor neuron pathway that produces a response without waiting for the brain.' },
      ],
      suggestedTools: ['show_labeled_image', 'show_diagram', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-reflex-arc-trace',
      kind: 'worked_example',
      problem:
        'You step barefoot on a sharp tack and your leg pulls back before you feel any pain. Trace the signal from the skin of your foot to the leg muscle, naming each structure in order, and explain why the pain arrives after the movement.',
      steps: [
        'Start at the stimulus: pain receptors in the skin of the foot detect the tack and trigger an impulse in a SENSORY neuron.',
        'Follow that sensory neuron IN: its axon carries the electrical impulse up the leg to the SPINAL CORD, part of the central nervous system.',
        'Cross the first synapse: the sensory neuron releases neurotransmitters onto a short relay neuron inside the spinal cord, which passes the signal straight across to a MOTOR neuron. This is the shortcut — the signal is not sent up to the brain first.',
        'Follow the motor neuron OUT: its axon carries a new electrical impulse back down the leg to the muscle, and the axon terminals release neurotransmitter onto the muscle, which contracts and lifts the foot.',
        'Account for the pain: a separate branch of the sensory signal does travel up the spinal cord to the brain, but that longer trip plus conscious processing takes more time. The movement is already finished when the brain registers pain, so the pain did not cause the withdrawal.',
      ],
      answer:
        'Pain receptor in the skin → sensory neuron → spinal cord (relay neuron) → motor neuron → leg muscle contracts. The brain is informed on a slower parallel path, so you feel the pain after the leg has already moved.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-nervous-or-endocrine',
      kind: 'worked_example',
      problem:
        'A student is startled by a loud bang. Her head snaps toward the sound almost instantly, and her heart is still pounding four minutes later. Decide which communication system produced each of the two responses, and justify each choice using speed, duration and reach.',
      steps: [
        'Separate the two responses: (1) the head turning toward the sound, and (2) the pounding heart that persists for minutes.',
        'Time the first response. Turning the head happens in a fraction of a second and stops as soon as she has looked. Fast onset plus brief duration plus a specific set of neck muscles is the signature of NERVOUS signalling — impulses travelling down motor neurons to those muscles.',
        'Time the second response. The pounding starts a few seconds in and outlasts the danger by minutes, and it is not confined to one muscle: heart rate, breathing and sweating all change together. Slow onset plus long duration plus body-wide reach is the signature of ENDOCRINE signalling.',
        'Name the messenger for the second response: adrenaline released by the adrenal glands into the bloodstream, reaching heart cells that carry adrenaline receptors. It keeps working until it is broken down, which is why she cannot simply switch it off once she knows she is safe.',
        'State the general rule you used: near-instant and brief and localized means nerves; delayed and sustained and widespread means hormones.',
      ],
      answer:
        'The head turn is nervous (fast, brief, targeted to specific muscles); the lasting pounding heart is endocrine — adrenaline broadcast in the blood, slow to start and slow to clear.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-signal-across-synapse',
      kind: 'try_yourself',
      problem:
        'An impulse travels down the axon of one neuron and reaches its axon terminals. How does the signal get to the next neuron across the synapse?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The electrical impulse jumps across the synapse as a spark and continues down the next neuron' },
        { id: 'b', text: 'The two neurons are fused, so the electrical impulse simply keeps travelling without a gap' },
        { id: 'c', text: 'The axon terminals release neurotransmitters that diffuse across the gap and bind receptors on the next neuron, starting a new electrical impulse', correct: true },
        { id: 'd', text: 'A hormone is released into the bloodstream and carried to the next neuron' },
      ],
      expectedAnswer:
        'The axon terminals release neurotransmitters that diffuse across the gap and bind receptors on the next neuron, starting a new electrical impulse',
      hints: [
        'The signal is electrical ALONG a neuron — but the synapse is a physical gap between two separate cells.',
        'Something chemical is released by the axon terminals and binds receptors on the other side.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-hormone-route',
      kind: 'try_yourself',
      problem:
        'The thyroid gland releases thyroid hormone, which raises metabolic rate in cells throughout the body. How does thyroid hormone reach those cells, and why do only some cells respond?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It travels in the bloodstream to all parts of the body, and only cells with matching thyroid hormone receptors respond', correct: true },
        { id: 'b', text: 'It travels along nerves from the thyroid to each target organ, and only the wired organs respond' },
        { id: 'c', text: 'It is carried by neurotransmitters across synapses until it reaches the correct cells' },
        { id: 'd', text: 'It diffuses through the air spaces of the lungs and is absorbed only by cells that need it' },
      ],
      expectedAnswer:
        'It travels in the bloodstream to all parts of the body, and only cells with matching thyroid hormone receptors respond',
      hints: [
        'Glands release hormones into one particular transport system — which one reaches every organ?',
        'If a hormone reaches every cell, something on the cell surface must decide which cells actually react.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-reflex-vs-brain',
      kind: 'try_yourself',
      problem:
        'A doctor taps a patient just below the kneecap and the lower leg kicks forward before the patient can react. Which pathway produced the kick, and what is the advantage of that pathway?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Sensory neuron to brain, where the patient consciously decides to kick, then motor neuron to the muscle — this makes the response more accurate' },
        { id: 'b', text: 'A hormone released by the adrenal glands travels in the blood to the leg muscle — this makes the response longer-lasting' },
        { id: 'c', text: 'The motor neuron detects the tap directly and contracts the muscle without any sensory neuron — this removes a step' },
        { id: 'd', text: 'Sensory neuron to spinal cord to motor neuron to the leg muscle, bypassing the brain — this makes the response much faster', correct: true },
      ],
      expectedAnswer:
        'Sensory neuron to spinal cord to motor neuron to the leg muscle, bypassing the brain — this makes the response much faster',
      hints: [
        'The kick happens before the patient can react, so the signal cannot have waited for a conscious decision.',
        'Ask which structure did the processing instead of the brain, and what the shortcut buys you.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-hormones-travel-along-nerves',
      kind: 'misconception_check',
      question:
        'A student writes: "The pancreas sends insulin along a nerve to the liver, and the message gets there instantly, the same way a reflex does." What went wrong?',
      commonErrors: [
        {
          answer: 'Insulin is sent along a nerve to a specific organ and arrives instantly',
          misconception:
            'Merging the two communication systems — assuming hormones use the nervous system as their delivery wiring, and inheriting the nervous system\'s speed and point-to-point addressing along with it.',
          correctsTo:
            'Hormones never travel along nerves. Glands like the pancreas release hormones into the BLOODSTREAM, which carries them everywhere in the body over seconds to minutes; the liver responds because liver cells carry insulin receptors, not because a wire runs to it. Nerves carry electrical impulses down axons to particular cells in milliseconds. Same job — sending a message — completely different delivery system, speed, duration and reach.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Signal direction in a neuron: dendrites receive → cell body → axon carries → axon terminals hand off. Myelin insulates the axon and speeds conduction.',
        'Electrical ALONG the neuron, CHEMICAL across the synapse — neurotransmitters cross the gap, the impulse itself never does.',
        'CNS = brain and spinal cord (processing); PNS = the sensory and motor nerves connecting the CNS to the rest of the body.',
        'A reflex arc runs sensory neuron → spinal cord → motor neuron and skips the brain for SPEED; the brain is informed afterward, which is why the pain arrives after the movement.',
        'Endocrine glands release hormones into the BLOODSTREAM; the hormone reaches every cell but acts only on cells with matching receptors.',
        'The comparison to carry out of this lesson: nervous = fast, brief, targeted; hormonal = slower, longer-lasting, broadcast body-wide (adrenaline, insulin and glucagon, growth hormone, thyroid hormone).',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.4', cedTitle: 'The Nervous & Endocrine Systems' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
