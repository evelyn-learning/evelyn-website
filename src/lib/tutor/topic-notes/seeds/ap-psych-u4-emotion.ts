/**
 * AP Psychology — Unit 4 CED 4.7: Emotion.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.psych.emotion.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_PSYCH_EMOTION: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.psych.emotion.v1',
  course: 'AP Psychology',
  cedUnit: 4,
  cedTopic: '4.7',
  cedTitle: 'Emotion',
  planId: 'evelyn.ap.psych.emotion.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.psych.emotion.v1' }],
  theory: [
    { loId: 'appsych.emotion', content: `AN EMOTION has three components: PHYSIOLOGICAL arousal, EXPRESSIVE behavior, and CONSCIOUS experience (feeling + appraisal). The theories differ on the ORDER and relationship of these.` },
    { loId: 'appsych.emotion', content: `JAMES-LANGE THEORY: the body reacts FIRST, and we INFER the emotion FROM the bodily response. Order: stimulus → AROUSAL (and behavior) → emotion. "I tremble, therefore I am afraid." Implication: different emotions have distinct bodily signatures.` },
    { loId: 'appsych.emotion', content: `CANNON-BARD THEORY: arousal and the emotion occur SIMULTANEOUSLY and INDEPENDENTLY. Order: stimulus → arousal AND emotion at the same time. The body and the conscious feeling happen together; one does not cause the other.` },
    { loId: 'appsych.emotion', content: `SCHACHTER-SINGER TWO-FACTOR THEORY: emotion = PHYSIOLOGICAL AROUSAL + a COGNITIVE LABEL for that arousal. We notice we are aroused, then interpret the SITUATION to label which emotion it is. Order: stimulus → arousal → cognitive label → emotion. Same arousal can be labeled differently depending on context (the key prediction).` },
    { loId: 'appsych.emotion', content: `LAZARUS APPRAISAL THEORY: a COGNITIVE APPRAISAL (often near-instant, even unconscious) of whether a situation is threatening comes FIRST and determines the emotion. Emphasizes that thinking precedes/shapes emotion. (Zajonc countered that some emotional reactions occur BEFORE conscious thought — the "feeling vs thinking" debate.)` },
    { loId: 'appsych.emotion', content: `FACIAL-FEEDBACK HYPOTHESIS: facial expressions don't just SHOW emotion, they can INFLUENCE it — making a facial expression (e.g. smiling) can intensify or trigger the corresponding feeling. Supports a James-Lange-style "body affects emotion" idea.` },
    { loId: 'appsych.emotion', content: `THE AUTONOMIC NERVOUS SYSTEM in emotion: the SYMPATHETIC branch produces the arousal of strong emotion (racing heart, sweating, dilated pupils — "fight or flight"); the PARASYMPATHETIC branch calms the body afterward. Most emotions share similar general arousal, which is why cognitive LABELS (two-factor theory) matter for telling them apart.` },
    { loId: 'appsych.emotion', content: `UNIVERSAL EMOTIONS vs DISPLAY RULES: certain basic emotional EXPRESSIONS (happiness, sadness, fear, anger, surprise, disgust) are recognized across cultures (evidence for biological universality, per Ekman). But DISPLAY RULES — cultural norms about WHEN and HOW MUCH to express emotion — vary widely (nurture).` },
    { loId: 'appsych.emotion', kind: 'definition', title: 'two-factor (Schachter-Singer) theory', content: 'emotion = physiological arousal + a cognitive label for that arousal.' },
    { loId: 'appsych.emotion', kind: 'definition', title: 'facial-feedback hypothesis', content: `facial expressions can influence the emotions a person feels, not just display them.` },
    { loId: 'appsych.emotion', kind: 'definition', title: 'display rules', content: 'culturally specific norms for when and how emotions should be expressed.' },
  ],
  methods: [],
  pointers: [
    { content: 'James-Lange: arousal first, emotion inferred from the body.', kind: 'tip' },
    { content: 'Cannon-Bard: arousal and emotion simultaneous and independent.', kind: 'tip' },
    { content: 'Schachter-Singer two-factor: arousal + cognitive label = emotion.', kind: 'tip' },
    { content: `Lazarus: appraisal (cognition) comes first; facial feedback: the face shapes feeling.`, kind: 'tip' },
    { content: `Basic expressions are universal (Ekman); display rules for expression are cultural.`, kind: 'tip' },
  ],
};
