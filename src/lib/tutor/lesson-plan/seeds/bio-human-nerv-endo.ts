/**
 * HS Biology — Human Nervous and Endocrine Systems.
 * NGSS HS-LS1-2: feedback loops in body systems.
 */

import type { LessonPlan } from '../types';

export const SEED_BIO_HUMAN_NERV_ENDO: LessonPlan = {
  id: 'evelyn.hs.science.biology.human-nerv-endo.v1',
  title: 'Human Nervous and Endocrine Systems',
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'human-body', locale: 'en',
  los: [{ id: 'ngss.hs-ls1-2', description: 'Develop and use a model to illustrate the hierarchical organization of interacting systems that provide specific functions within multicellular organisms.', standard: 'NGSS.HS-LS1-2' }],
  prerequisites: ['hs.bio.human-circ-resp'], followUps: [], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Two control systems.', script: 'You touch a hot stove → hand jerks back in 0.1 seconds. You wake up groggy → coffee makes you alert in 30 minutes. Both happen because your body has TWO communication systems: nerves (fast) and hormones (slow). They run everything.', estimatedMinutes: 2 },
    { id: 'concept-nervous', kind: 'concept', goal: 'Nervous system uses electrical signals through neurons for fast, targeted communication.', keyIdeas: [
      'NEURON: cell that carries signals. Parts: dendrites (receive) → cell body → axon (send).',
      'CENTRAL NS: brain + spinal cord. Processing/decision center.',
      'PERIPHERAL NS: nerves connecting CNS to body.',
      '  · SOMATIC: voluntary (move arm).',
      '  · AUTONOMIC: involuntary (heartbeat, digestion). Split into sympathetic (fight/flight) + parasympathetic (rest/digest).',
      'SIGNAL: electrical impulse along axon → chemical NEUROTRANSMITTERS released across SYNAPSE → binds to next neuron.',
      'Speed: ~100 m/s (fast). Reflexes skip the brain — go through spinal cord for max speed.',
    ], vocabulary: [{ term: 'neuron', definition: 'nerve cell.' }, { term: 'synapse', definition: 'gap between neurons crossed by neurotransmitters.' }, { term: 'reflex', definition: 'fast involuntary response, doesn\'t involve brain.' }], estimatedMinutes: 5 },
    { id: 'concept-endocrine', kind: 'concept', goal: 'Endocrine system uses hormones in blood for slower, body-wide communication.', keyIdeas: [
      'HORMONES: chemical messengers released into bloodstream by GLANDS.',
      'TARGET: only cells with the right RECEPTOR respond.',
      'KEY GLANDS:',
      '  · HYPOTHALAMUS + PITUITARY (brain): the master controllers.',
      '  · THYROID: metabolism rate.',
      '  · ADRENAL: adrenaline (fight/flight), cortisol (stress).',
      '  · PANCREAS: insulin + glucagon (blood sugar).',
      '  · GONADS (ovaries/testes): reproductive hormones.',
      'Speed: seconds to hours. But effects can last DAYS.',
      'NS = fast + targeted. Endocrine = slow + body-wide.',
    ], estimatedMinutes: 5 },
    { id: 'worked-blood-sugar', kind: 'worked_example', problem: 'Walk through how your body keeps blood sugar stable after a sugary meal.', steps: [
      'Eat sugar → blood glucose RISES.',
      'PANCREAS detects high glucose → releases INSULIN.',
      'Insulin tells body cells: "Take in glucose, store it as glycogen."',
      'Blood glucose DROPS back toward normal (~90 mg/dL).',
      'Hours later, no food → blood glucose FALLS.',
      'Pancreas releases GLUCAGON → tells liver: "Release stored glycogen back as glucose."',
      'Blood glucose rises back to normal.',
      'NEGATIVE FEEDBACK LOOP: deviation from set point triggers correction.',
    ], answer: 'Insulin lowers blood sugar; glucagon raises it. Negative feedback keeps glucose near 90 mg/dL.', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Why is touching a hot stove a REFLEX (spinal cord), not a brain decision?', expectedAnswer: 'For SPEED. Going to the brain takes ~200 ms (signal up + processing + signal back). Through the spinal cord = ~50 ms. The 150 ms saved prevents serious burns. Brain still gets notified (so you "feel" the burn after) — but the hand has already moved. Reflex arc bypasses conscious thought.', responseFormat: 'free', hints: ['Compare timing: brain vs spinal cord.', 'Why does speed matter for survival?'], estimatedMinutes: 3 },
    { id: 'misconception-hormones-only-puberty', kind: 'misconception_check', question: 'A friend says "hormones are just a teen thing." Right?', commonErrors: [{ answer: 'Yes — only puberty.', misconception: 'Limiting hormones to adolescence.', correctsTo: 'Hormones run your body 24/7 from before birth until death. Insulin (after every meal), thyroid (every minute), cortisol (under stress), melatonin (every night) — all hormones. Sex hormones get attention at puberty, but the endocrine system never stops working.' }], estimatedMinutes: 2 },
    { id: 'recap', kind: 'recap', mustRemember: ['Nervous system: electrical, fast, targeted.', 'Endocrine system: chemical (hormones), slow, body-wide.', 'Reflexes skip the brain for speed.', 'Negative feedback loops keep things stable (homeostasis).'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
