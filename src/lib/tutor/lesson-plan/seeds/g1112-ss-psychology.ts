/**
 * Grades 11-12 Social Studies — Psychology (intro).
 *
 * Schools of thought, research methods, brain basics, learning, social psych.
 */

import type { LessonPlan } from '../types';

export const SEED_G1112_SS_PSYCHOLOGY: LessonPlan = {
  id: 'evelyn.ss.11-12.psychology.v1',
  title: 'Psychology — schools, methods, brain, learning, social',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'social-studies',
  topic: 'psychology',
  locale: 'en',
  los: [
    {
      id: 'hs.psych',
      description: 'Distinguish major schools of psychology, identify research methods, and apply core findings.',
      standard: 'APA-NSHS-PSY',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame psych as a science of how minds + behavior work.',
      script: 'Psychology asks one of the hardest questions in science: how do minds work? It uses experiments, brain scans, surveys, and case studies to chip away at the question. The answers aren\'t always settled — but the methods are real, and what\'s replicated has shaped how we understand learning, memory, decision-making, and group behavior.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-psych',
      kind: 'concept',
      goal: 'Schools, methods, brain, learning, social psychology.',
      keyIdeas: [
        'SCHOOLS: behaviorism (observable behavior — Skinner), cognitive (mental processes — Neisser), psychodynamic (unconscious — Freud, mostly historical now), humanistic (Maslow, Rogers), biological (brain + genes), evolutionary, sociocultural.',
        'METHODS: experiment (manipulate IV, measure DV, control confounds — establishes causation). Correlational study (observe relationships — does NOT prove causation). Case study (deep on one — limited generalization). Survey (broad but sampling matters).',
        'BRAIN: neurons fire via action potentials; chemical synapses pass signals. Major regions: cortex (thinking), hippocampus (memory), amygdala (emotion), prefrontal cortex (planning, impulse control — finishes developing around age 25).',
        'CLASSICAL CONDITIONING (Pavlov): pair a neutral stimulus with a reflex-triggering stimulus until the neutral one alone triggers it.',
        'OPERANT CONDITIONING (Skinner): consequences shape behavior. Reinforcement increases; punishment decreases. Schedules (continuous, partial) change durability.',
        'COGNITIVE BIASES: heuristics save effort but mislead. Confirmation bias, availability heuristic, anchoring.',
        'SOCIAL PSYCH: conformity (Asch), obedience (Milgram), bystander effect, in-group/out-group bias.',
      ],
      vocabulary: [
        { term: 'experiment', definition: 'a method that manipulates an independent variable while controlling others, to test causation.' },
        { term: 'classical conditioning', definition: 'learning by pairing a neutral stimulus with one that triggers a reflex.' },
        { term: 'confirmation bias', definition: 'tendency to notice and remember evidence supporting prior beliefs.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-correlation',
      kind: 'worked_example',
      problem: 'A study finds: students who eat breakfast score higher on tests. A headline says: "EATING BREAKFAST CAUSES BETTER GRADES." What\'s wrong?',
      steps: [
        'Type of study: correlational (observed an association). NOT an experiment.',
        'Correlation ≠ causation. Possible alternative explanations:',
        '  - REVERSE: students who do better academically (and have organized lives) eat breakfast.',
        '  - THIRD VARIABLE: socioeconomic status causes BOTH breakfast access AND test prep / good schools.',
        '  - SELECTION: students whose families care about academics are also more likely to enforce breakfast.',
        'To establish causation: randomly assign students to breakfast / no-breakfast (an experiment). Without that, the headline overstates.',
      ],
      answer: 'Correlation, not causation — could be reversed or driven by a third variable.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A child gets stickers for cleaning their room every day for a month. The parent stops giving stickers. The child stops cleaning their room. Which conditioning principle is illustrated?',
      expectedAnswer: 'extinction in operant conditioning — when reinforcement stops, the reinforced behavior decreases',
      responseFormat: 'free',
      hints: [
        'A behavior was being maintained by a consequence.',
        'When the consequence is removed, the behavior fades.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-freud',
      kind: 'misconception_check',
      question: 'A student says: "Modern psychology is mostly Freudian." What\'s wrong?',
      commonErrors: [
        {
          answer: 'because of Freud',
          misconception: 'Treating Freud as the field\'s foundation.',
          correctsTo: 'Freud was historically influential, but most of his specific claims (oedipal complex, dream symbols, repression as he framed it) failed empirical scrutiny. Modern psychology is dominated by COGNITIVE, BEHAVIORAL, NEUROBIOLOGICAL, and SOCIAL approaches with strong experimental methods. Psychodynamic ideas survive in modified form in some clinical practice but are not the field\'s core. Pop culture overweights Freud; the field has moved on.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Multiple schools, multiple methods. Match question to method.',
        'Correlation ≠ causation. Only experiments establish cause.',
        'Operant conditioning: behaviors shaped by consequences.',
        'Cognitive biases are systematic, not random.',
        'Social context heavily shapes individual behavior.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
