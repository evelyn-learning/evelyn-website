/**
 * AP Psychology — Unit 1 FRQ Practice.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_PSYCH_U1_FRQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.psych.u1-frq-practice.v1', title: 'U1 FRQ Practice',
  curriculum: 'AP', grade: '11', subject: 'ss', topic: 'ap-psychology', locale: 'en',
  los: [{ id: 'appsych.u1-frq-practice', description: 'Apply Unit 1 biological-bases concepts to AP-style FRQs.', standard: 'AP-PSYCH-1-FRQ' }],
  prerequisites: ['appsych.sensation-perception'], followUps: [], estimatedMinutes: 26,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Stakes.', script: "Three Unit 1 FRQs covering neurons + brain, nervous + endocrine, sensation + perception.", estimatedMinutes: 2 },
    { id: 'concept-strategy', kind: 'concept', goal: 'Refresh.', keyIdeas: [
      'Neuron: dendrite-soma-axon-terminal. Action potential all-or-none.',
      'NTs: DA reward, 5-HT mood, GABA inhibitory, ACh memory.',
      'Brain: hindbrain (life support), forebrain (limbic + cortex). Lobes: frontal (planning), parietal (touch), temporal (hearing), occipital (vision).',
      'Sympathetic vs parasympathetic. Endocrine slow but sustained.',
      'Sensation vs perception. Gestalt principles. Depth cues.',
    ], estimatedMinutes: 2 },
    { id: 'try-frq-neuro', kind: 'try_yourself',
      problem: 'FRQ Practice 1 — Neuroscience. A patient is diagnosed with Parkinson\'s disease. (a) Identify the neurotransmitter most affected and the brain region involved. (b) Predict their symptoms. (c) Their doctor prescribes L-DOPA. Explain how this works using neurotransmitter terminology. (d) After several years, the L-DOPA stops working effectively. Explain possible reasons.',
      expectedAnswer: '(a) DOPAMINE (DA) deficit. SUBSTANTIA NIGRA (midbrain) — DA-producing neurons here degenerate. The basal ganglia, which receive DA from substantia nigra, become dysfunctional. (1.5)\n(b) Symptoms reflect motor control loss:\n• TREMOR (especially at rest). \n• BRADYKINESIA (slowed movement). \n• MUSCLE RIGIDITY. \n• POSTURAL INSTABILITY. \n• Later: cognitive impairment, depression. (1.5)\n(c) L-DOPA mechanism:\n• L-DOPA is a precursor to DA — the body converts it to DA. \n• Pure DA cannot cross the BLOOD-BRAIN BARRIER, but L-DOPA can. \n• L-DOPA enters brain → converted to DA → REPLACES the missing dopamine. \n• Acts as an indirect AGONIST of the dopamine system. (2)\n(d) L-DOPA losing effectiveness:\n• Continued NEURONAL DEGENERATION — fewer neurons remain to convert L-DOPA → DA. \n• POSTSYNAPTIC RECEPTOR CHANGES — receptors may downregulate or upregulate, changing response. \n• DRUG RESPONSE FLUCTUATES — peak doses cause dyskinesias (involuntary movements); off periods between doses cause symptoms to return. \n• EVENTUAL TREATMENT NEED beyond L-DOPA: deep brain stimulation, dopamine agonists, MAO-B inhibitors. (2)\nTotal: 7 points.',
      responseFormat: 'frq', hints: ['Identify DA + substantia nigra; mechanism; tolerance.'], estimatedMinutes: 7 },
    { id: 'try-frq-stress', kind: 'try_yourself',
      problem: 'FRQ Practice 2 — Stress Response. A student is preparing for the AP exam. (a) Identify which division of the autonomic nervous system activates during high-stress test moments. (b) Trace the chain of events from amygdala to physical response. (c) Identify TWO endocrine hormones involved and their effects. (d) Suggest TWO research-supported strategies to manage test anxiety, with mechanism for each.',
      expectedAnswer: '(a) SYMPATHETIC nervous system — fight-or-flight response. (1)\n(b) Chain:\n• Threat (test) perceived → AMYGDALA assesses threat. \n• Amygdala signals HYPOTHALAMUS. \n• Hypothalamus activates SYMPATHETIC NS (via spinal cord) AND signals PITUITARY. \n• Pituitary releases ACTH → ADRENAL GLANDS. \n• Adrenal medulla: EPINEPHRINE (adrenaline) immediate. \n• Adrenal cortex: CORTISOL slower (minutes). \n• Body responses: heart rate up, breathing rate up, glucose released, pupils dilate, muscles tense, digestion suppressed, attention narrows. (3)\n(c) Hormones:\n• EPINEPHRINE (adrenaline): immediate physical activation — accelerated heart rate, energy mobilization, alertness. From adrenal medulla. \n• CORTISOL: longer-acting — sustained arousal, glucose to muscles, immune suppression. From adrenal cortex. (2)\n(d) Strategies:\n• DEEP BREATHING / MEDITATION: activates PARASYMPATHETIC NS, lowers heart rate, reduces cortisol. \n• REGULAR EXERCISE during studying: reduces cortisol levels, improves sleep, releases endorphins. \n• PROGRESSIVE MUSCLE RELAXATION: trains body to recognize tension and release it. \n• REFRAMING / CBT: changes interpretation of stress (thinking of arousal as "energy" vs "anxiety" reduces interference). \n• ADEQUATE SLEEP: reduces baseline cortisol. \n• MINDFULNESS: meta-awareness of anxiety reduces its effects. \n• SOCIAL SUPPORT: oxytocin from connection counters cortisol. (2)\nTotal: 8 points.',
      responseFormat: 'frq', hints: ['Mechanism, hormones, mitigation.'], estimatedMinutes: 7 },
    { id: 'try-frq-perception', kind: 'try_yourself',
      problem: 'FRQ Practice 3 — Perception. (a) Define top-down vs bottom-up processing using a SPECIFIC example. (b) Why is the McGurk effect (seeing someone\'s lips move while hearing a different sound; you "hear" a third sound) compelling evidence for top-down influence on perception? (c) Identify TWO Gestalt principles and give an example of each in everyday life. (d) Why do depth illusions like the Müller-Lyer (lines with arrows look different lengths but are equal) trick our perception?',
      expectedAnswer: '(a) BOTTOM-UP: perception starts from raw sensory input. Example: when you see a new word never encountered, you process letter shapes one by one to identify it. \nTOP-DOWN: experience and expectations shape perception. Example: reading "th_ cat sat on the m_t" — you fill in "the" and "mat" because of context, even if letters are missing. (2)\n(b) MCGURK EFFECT shows that visual cues (lip movement) ALTER what you HEAR — this is top-down processing of audio influenced by visual context. The brain INTEGRATES sensory streams to construct perception. Demonstrates that perception is constructive, not just bottom-up sensory recording. (2)\n(c) Gestalt examples:\n• PROXIMITY: items in a list grouped by spacing — words close together perceived as a phrase. \n• CLOSURE: incomplete circle (∞) perceived as a circle. \n• SIMILARITY: traffic flowers in similar colors grouped as "the red ones." \n• CONTINUITY: lines crossing perceived as continuing through, not breaking. \n• COMMON FATE: flock of birds moving together perceived as one entity. \n• FIGURE-GROUND: lecturer in front of background = figure; background = ground. (2)\n(d) MÜLLER-LYER illusion mechanism:\n• Cultural exposure to sharp angles (Western box-shaped buildings, corners) trains the brain. \n• Lines with outward arrows (>—<) suggest receding corners (further away) and inward arrows (<—>) suggest projecting corners (closer). \n• Brain ASSUMES depth difference → adjusts perceived length using SIZE CONSTANCY (further objects appear smaller, so brain enlarges them perceptually). \n• Brain adds extra "length" to the receding line → it appears LONGER. \n• Demonstrates how perceptual constancy can be wrong; cultural priming influences perception. (2)\nTotal: 8 points.',
      responseFormat: 'frq', hints: ['Top-down vs bottom-up; Gestalt; illusion mechanism.'], estimatedMinutes: 7 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'Brain function from neurons to cortex; key NTs and brain areas.',
      'Stress response: amygdala → SNS + endocrine.',
      'Sensation ≠ perception; top-down processing shapes experience.',
      'AP rewards specific examples (Parkinson\'s, McGurk, Müller-Lyer).',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '1', cedTopic: '1-FRQ', cedTitle: 'Unit 1 FRQ Practice', sources: [{ type: 'frq-style', source: 'AP Plans Initiative author', note: 'Modeled on AP Psych Unit-1 FRQs.' }] },
};
