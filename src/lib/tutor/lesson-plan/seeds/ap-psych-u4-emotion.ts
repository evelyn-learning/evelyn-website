/**
 * AP Psychology — CED Unit 4.7: Emotion.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_PSYCH_U4_EMOTION: LessonPlan = {
  id: 'evelyn.ap.psych.emotion.v1',
  title: 'U4.7 Emotion',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-psychology',
  locale: 'en',
  los: [
    {
      id: 'appsych.emotion',
      description:
        'Compare the major theories of emotion (James-Lange, Cannon-Bard, Schachter-Singer two-factor, and Lazarus appraisal); explain the facial-feedback hypothesis and the role of the autonomic nervous system; and distinguish universal emotions from culturally governed display rules.',
      standard: 'AP-PSYCH-4.7',
    },
  ],
  prerequisites: ['appsych.motivation'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame emotion theories around the order of bodily arousal, thinking, and feeling.',
      script:
        "Do you run from the bear because you're afraid — or are you afraid because you're running? That odd question is the whole debate about emotion. The competing theories disagree about the ORDER of three ingredients: bodily arousal, conscious thought, and the felt emotion. Pin down the order each theory claims, and you can tell them apart instantly on the exam.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-emotion',
      kind: 'concept',
      goal: 'Cover the four emotion theories, facial feedback, the ANS, and display rules.',
      keyIdeas: [
        'AN EMOTION has three components: PHYSIOLOGICAL arousal, EXPRESSIVE behavior, and CONSCIOUS experience (feeling + appraisal). The theories differ on the ORDER and relationship of these.',
        'JAMES-LANGE THEORY: the body reacts FIRST, and we INFER the emotion FROM the bodily response. Order: stimulus → AROUSAL (and behavior) → emotion. "I tremble, therefore I am afraid." Implication: different emotions have distinct bodily signatures.',
        'CANNON-BARD THEORY: arousal and the emotion occur SIMULTANEOUSLY and INDEPENDENTLY. Order: stimulus → arousal AND emotion at the same time. The body and the conscious feeling happen together; one does not cause the other.',
        'SCHACHTER-SINGER TWO-FACTOR THEORY: emotion = PHYSIOLOGICAL AROUSAL + a COGNITIVE LABEL for that arousal. We notice we are aroused, then interpret the SITUATION to label which emotion it is. Order: stimulus → arousal → cognitive label → emotion. Same arousal can be labeled differently depending on context (the key prediction).',
        'LAZARUS APPRAISAL THEORY: a COGNITIVE APPRAISAL (often near-instant, even unconscious) of whether a situation is threatening comes FIRST and determines the emotion. Emphasizes that thinking precedes/shapes emotion. (Zajonc countered that some emotional reactions occur BEFORE conscious thought — the "feeling vs thinking" debate.)',
        'FACIAL-FEEDBACK HYPOTHESIS: facial expressions don\'t just SHOW emotion, they can INFLUENCE it — making a facial expression (e.g. smiling) can intensify or trigger the corresponding feeling. Supports a James-Lange-style "body affects emotion" idea.',
        'THE AUTONOMIC NERVOUS SYSTEM in emotion: the SYMPATHETIC branch produces the arousal of strong emotion (racing heart, sweating, dilated pupils — "fight or flight"); the PARASYMPATHETIC branch calms the body afterward. Most emotions share similar general arousal, which is why cognitive LABELS (two-factor theory) matter for telling them apart.',
        'UNIVERSAL EMOTIONS vs DISPLAY RULES: certain basic emotional EXPRESSIONS (happiness, sadness, fear, anger, surprise, disgust) are recognized across cultures (evidence for biological universality, per Ekman). But DISPLAY RULES — cultural norms about WHEN and HOW MUCH to express emotion — vary widely (nurture).',
      ],
      vocabulary: [
        { term: 'two-factor (Schachter-Singer) theory', definition: 'emotion = physiological arousal + a cognitive label for that arousal.' },
        { term: 'facial-feedback hypothesis', definition: 'facial expressions can influence the emotions a person feels, not just display them.' },
        { term: 'display rules', definition: 'culturally specific norms for when and how emotions should be expressed.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'try-order',
      kind: 'try_yourself',
      problem:
        'For each theory, state the ORDER of arousal, cognition, and emotion when a person sees a snarling dog: (a) James-Lange, (b) Cannon-Bard, (c) Schachter-Singer.',
      expectedAnswer:
        '(a) JAMES-LANGE: dog → BODILY AROUSAL first (heart races, you back away) → you infer FEAR from the bodily response. Arousal precedes and causes the emotion. (b) CANNON-BARD: dog → arousal AND fear occur SIMULTANEOUSLY and independently — the racing heart and the felt fear happen at the same time, neither causing the other. (c) SCHACHTER-SINGER (two-factor): dog → AROUSAL → you COGNITIVELY LABEL the arousal based on the situation ("a snarling dog — this is danger") → you experience FEAR. Arousal plus a cognitive label together produce the specific emotion. Strong answers get the orderings right: James-Lange = body then emotion; Cannon-Bard = simultaneous/independent; Schachter-Singer = arousal then label then emotion.',
      responseFormat: 'free',
      hints: [
        'James-Lange: body first, emotion inferred from it.',
        'Cannon-Bard: arousal and emotion at the same time.',
        'Schachter-Singer: arousal + a cognitive label.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-two-factor-synthesis',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. In a classic study, participants injected with adrenaline (causing arousal) felt happy when placed with a euphoric confederate but angry when placed with an irritated confederate. (a) Which theory does this support, and why? (b) What role did the cognitive label play? (c) How does the facial-feedback hypothesis offer a complementary mechanism by which the body shapes emotion?',
      expectedAnswer:
        '(a) This supports the SCHACHTER-SINGER TWO-FACTOR THEORY. The SAME physiological arousal (adrenaline) led to DIFFERENT emotions depending on the social context, which is exactly the two-factor prediction: arousal alone is ambiguous and must be interpreted. (b) The COGNITIVE LABEL was decisive: participants used the SITUATION (the euphoric vs irritated confederate) to interpret/label their unexplained arousal, and that label determined whether they felt happy or angry. Arousal supplied the intensity; cognition supplied the specific emotion. (c) FACIAL-FEEDBACK HYPOTHESIS offers a complementary "body-shapes-emotion" route: just as interpreting bodily arousal influences emotion, adopting a facial EXPRESSION (e.g. smiling or frowning) can feed back and intensify or induce the corresponding feeling — another way physiological/behavioral states influence conscious emotion. Strong answers (i) name two-factor theory, (ii) explain that identical arousal + different labels = different emotions, and (iii) connect facial feedback as a parallel body-to-emotion mechanism.',
      responseFormat: 'frq',
      hints: [
        'Same arousal, different emotion depending on context — whose theory?',
        'What turned ambiguous arousal into a specific emotion?',
        'Facial feedback = the face influencing the feeling.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'James-Lange: arousal first, emotion inferred from the body.',
        'Cannon-Bard: arousal and emotion simultaneous and independent.',
        'Schachter-Singer two-factor: arousal + cognitive label = emotion.',
        'Lazarus: appraisal (cognition) comes first; facial feedback: the face shapes feeling.',
        'Basic expressions are universal (Ekman); display rules for expression are cultural.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '4',
    cedTopic: '4.7',
    cedTitle: 'Emotion',
    sources: [
      { type: 'concept', book: 'feldman', chapter: '11', note: 'Theories of emotion, facial feedback, autonomic arousal, display rules.' },
    ],
  },
};
