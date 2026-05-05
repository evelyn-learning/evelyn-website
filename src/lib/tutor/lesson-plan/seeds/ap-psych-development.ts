/**
 * AP Psychology — Developmental psychology.
 *
 * Piaget's stages, Erikson's psychosocial stages, attachment theory.
 * How humans grow physically, cognitively, socially.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_PSYCH_DEVELOPMENT: LessonPlan = {
  id: 'evelyn.ap.psych.development.v1',
  title: 'Developmental psychology: Piaget, Erikson, attachment',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'social-studies',
  topic: 'ap-psychology',
  locale: 'en',
  los: [
    {
      id: 'appsych.development',
      description: 'Identify Piaget\'s cognitive stages, Erikson\'s psychosocial stages, and forms of attachment.',
      standard: 'AP-PSYCH-DEV',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'A child isn\'t a small adult — their thinking is qualitatively different.',
      script: 'A 3-year-old genuinely BELIEVES that pouring water into a tall thin glass means there\'s MORE water. By 7, they don\'t. Children\'s thinking goes through stages that aren\'t just "less adult" — they\'re fundamentally different.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-models',
      kind: 'concept',
      goal: 'Three core developmental frameworks.',
      keyIdeas: [
        'PIAGET\'S COGNITIVE STAGES:',
        '  SENSORIMOTOR (0-2): learn through senses and actions. Object permanence develops (~9 months).',
        '  PREOPERATIONAL (2-7): symbolic thinking. EGOCENTRIC (can\'t take others\' perspective). Lacks CONSERVATION (think tall glass has more).',
        '  CONCRETE OPERATIONAL (7-11): logical thinking about concrete things. Conservation, classification, basic math.',
        '  FORMAL OPERATIONAL (11+): abstract reasoning, hypothetical, deductive logic.',
        'ERIKSON\'S PSYCHOSOCIAL STAGES (8 stages, lifespan):',
        '  TRUST vs MISTRUST (infancy), AUTONOMY vs SHAME (toddler), INITIATIVE vs GUILT (preschool), INDUSTRY vs INFERIORITY (school age), IDENTITY vs ROLE CONFUSION (adolescence — KEY for AP), INTIMACY vs ISOLATION (young adult), GENERATIVITY vs STAGNATION (middle), INTEGRITY vs DESPAIR (old age).',
        'ATTACHMENT (Bowlby + Ainsworth\'s Strange Situation):',
        '  SECURE: distressed when caregiver leaves, comforted when reunited. ~60% in studies.',
        '  AVOIDANT: indifferent to caregiver leaving and returning.',
        '  ANXIOUS / AMBIVALENT: very distressed, hard to soothe.',
        '  DISORGANIZED: contradictory behavior. Often associated with trauma.',
        'EARLY ATTACHMENT predicts (modestly) adult relationship patterns.',
      ],
      vocabulary: [
        { term: 'object permanence', definition: 'understanding that objects continue to exist when out of sight.' },
        { term: 'conservation', definition: 'understanding that quantity stays the same despite changes in shape or arrangement.' },
        { term: 'attachment', definition: 'the emotional bond between an infant and caregiver.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-piaget',
      kind: 'worked_example',
      problem: 'A 4-year-old watches you pour water from a short wide glass to a tall thin glass. They claim the tall glass has MORE water. What stage are they in, and what concept do they lack?',
      steps: [
        'Stage: PREOPERATIONAL (2-7) — they\'re focused on appearance over reality.',
        'Lacking concept: CONSERVATION. Specifically, conservation of liquid — that quantity stays the same despite container shape.',
        'By age ~7, the child enters CONCRETE OPERATIONAL and gets conservation.',
        'Piaget\'s great contribution: showing that this isn\'t a "stupid" answer — it reflects a different KIND of thinking.',
      ],
      answer: 'preoperational stage; lacks conservation',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In Erikson\'s model, what conflict defines adolescence?',
      expectedAnswer: 'identity vs role confusion',
      responseFormat: 'free',
      hints: [
        'Adolescents grapple with "who am I?"',
        'The two poles are identity development OR confusion about one\'s role.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-stages-rigid',
      kind: 'misconception_check',
      question: 'Are Piaget\'s stages rigid age boundaries every child crosses on schedule?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating Piaget\'s stages as universal timelines.',
          correctsTo: 'No — modern research shows children develop at varying paces, and capabilities can appear earlier than Piaget claimed (e.g., infants show some object permanence sooner). Stages describe ROUGH progression, not strict age cutoffs. Useful framework, not iron law.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Piaget: 4 cognitive stages — sensorimotor, preoperational, concrete operational, formal operational.',
        'Erikson: 8 psychosocial stages across the lifespan, each with a defining conflict.',
        'Attachment styles: secure, avoidant, anxious, disorganized.',
        'Stages are rough — individual variation is large.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why might adolescents take more risks than children OR adults — what\'s happening in the brain?',
      hint: 'Limbic system (reward, emotion) develops earlier than the prefrontal cortex (judgment, impulse control). The ~10-year gap creates a window where reward-seeking is high but braking is low. Maturity of these systems doesn\'t equalize until ~25.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
