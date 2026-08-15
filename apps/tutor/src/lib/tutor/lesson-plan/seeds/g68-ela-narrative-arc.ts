/**
 * Grades 6-8 ELA — Narrative Arc.
 */

import type { LessonPlan } from '../types';

export const SEED_G68_ELA_NARRATIVE_ARC: LessonPlan = {
  id: 'evelyn.g68.ela.narrative-arc.v1',
  title: 'Grades 6-8 ELA — Narrative Arc',
  curriculum: 'CCSS',
  grade: '6-8',
  subject: 'ela',
  topic: 'g68-ela',
  locale: 'en',
  los: [
    {
      id: 'g68.ela.narrative-arc',
      description: 'Identify and apply Freytag\'s pyramid (exposition, rising action, climax, falling action, resolution) to fiction.',
      standard: 'CCSS.ELA-LITERACY.RL.7.5',
    },
  ],
  prerequisites: ['g68.ela.literary-analysis'],
  followUps: ['g68.ela.symbolism-motif'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Almost every story follows the same five-part shape — once you see it, you\'ll spot it everywhere.',
      script: 'Introduce → tension rises → big moment → things resolve → end. That\'s Freytag\'s pyramid, the architecture of stories from Greek tragedies to TV episodes. Today we name the parts and find them in any text.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-arc',
      kind: 'concept',
      goal: 'Freytag\'s five-part structure + identifying parts.',
      keyIdeas: [
        'EXPOSITION: introduces characters, setting, and the SITUATION before conflict. Establishes "normal".',
        'RISING ACTION: events build tension. Conflict develops. Stakes increase. Most of the story sits here.',
        'CLIMAX: turning point — highest tension. Main character makes a key decision or faces the central problem head-on.',
        'FALLING ACTION: consequences of the climax unfold. Tension drops; loose ends resolve.',
        'RESOLUTION (denouement): final state. Conflict is resolved (well or badly); reader sees how characters\' lives have changed.',
        'INCITING INCIDENT: the event that kicks the story into rising action. Usually near the start of rising action.',
        'NOT EVERY STORY follows the pyramid exactly — modernist works may shuffle or omit. But the pattern fits 80%+ of mainstream fiction.',
        'IDENTIFYING the climax: ask "after which event do things start RESOLVING?" That moment IS the climax.',
      ],
      vocabulary: [
        { term: 'exposition', definition: 'the introduction of background information at a story\'s start.' },
        { term: 'climax', definition: 'the moment of greatest tension, where the central conflict comes to a head.' },
        { term: 'denouement', definition: 'the final resolution following the falling action.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-arc',
      kind: 'worked_example',
      problem: 'Map "Cinderella" onto Freytag\'s pyramid.',
      steps: [
        'EXPOSITION: Cinderella lives with her cruel stepmother and stepsisters; mistreated daily.',
        'INCITING INCIDENT: invitation to the royal ball arrives.',
        'RISING ACTION: stepsisters prepare; Cinderella forbidden; fairy godmother appears; magical preparation; dancing with prince; midnight bell.',
        'CLIMAX: Cinderella flees as midnight strikes, leaving her glass slipper.',
        'FALLING ACTION: prince searches with the slipper; visits homes; arrives at Cinderella\'s house; stepsisters fail; slipper fits Cinderella.',
        'RESOLUTION: Cinderella marries the prince; lives happily ever after.',
      ],
      answer: 'Five parts of Freytag\'s pyramid mapped to Cinderella.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In "Romeo and Juliet", what is the climax?',
      expectedAnswer: 'Romeo killing Tybalt (or, in some readings, Romeo and Juliet\'s deaths). The "after this, things resolve" test points to the duel scene where the trajectory of the play decisively shifts toward tragedy.',
      responseFormat: 'free',
      hints: [
        'Apply the test: after which event do things start resolving (not necessarily happily)?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-arc',
      kind: 'misconception_check',
      question: 'A student says the climax of a story is whatever happens at the END. Correct?',
      commonErrors: [
        {
          answer: 'Climax = end of story',
          misconception: 'Confusing climax (peak tension) with resolution (final state).',
          correctsTo: 'CLIMAX comes BEFORE falling action and resolution. After climax, tension DECREASES. The end of the story is RESOLUTION, not climax. Test: after the climax, the rest of the story spells out CONSEQUENCES rather than building further tension. Mistaking resolution for climax flattens analysis.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Five parts: exposition, rising action, climax, falling action, resolution.',
        'Inciting incident kicks rising action.',
        'Climax = peak tension. Test: after this, things resolve.',
        'Resolution shows how characters\' lives have changed.',
        'Modern stories may bend the pyramid; mainstream fiction usually fits it.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How might a tragedy and a comedy have the SAME structural arc but different feels?',
      hint: 'Both follow Freytag\'s pyramid, but the climax outcome differs. Tragedy: protagonist\'s tragic flaw leads to ruin at the climax; falling action shows downfall. Comedy: complications resolve favourably at the climax; falling action restores order. Same structure, opposite emotional trajectory. The pyramid is morally neutral.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
