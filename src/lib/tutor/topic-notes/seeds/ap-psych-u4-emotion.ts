/**
 * AP Psychology — Unit 4 CED 4.7: Emotion.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.psych.emotion.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
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
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.psych.emotion.v1' }],
  theory: [
    { loId: 'appsych.emotion', content: `AN EMOTION HAS THREE COMPONENTS: PHYSIOLOGICAL arousal, EXPRESSIVE behavior, and CONSCIOUS experience (the felt emotion plus appraisal). The competing theories disagree about the ORDER and relationship of these three ingredients — pin down each theory's ordering and you can tell them apart instantly on the exam.` },
    { loId: 'appsych.emotion', content: `JAMES-LANGE THEORY: the BODY reacts FIRST, and we INFER the emotion FROM the bodily response. Order: stimulus → AROUSAL (and behavior) → EMOTION. Slogan: "I tremble, therefore I am afraid" — you are afraid BECAUSE you are running from the bear. Implication: different emotions must have DISTINCT bodily signatures.` },
    { loId: 'appsych.emotion', content: `CANNON-BARD THEORY: arousal and emotion occur SIMULTANEOUSLY and INDEPENDENTLY. Order: stimulus → arousal AND emotion AT THE SAME TIME. The racing heart and the felt fear happen together; NEITHER causes the other. Cannon's objection to James-Lange: bodily changes are too slow and too similar across emotions to be the source of distinct feelings.` },
    { loId: 'appsych.emotion', content: `SCHACHTER-SINGER TWO-FACTOR THEORY: emotion = PHYSIOLOGICAL AROUSAL + a COGNITIVE LABEL for that arousal. Order: stimulus → arousal → cognitive label → emotion. We notice we are aroused, then read the SITUATION to decide WHICH emotion it is. KEY PREDICTION: the SAME arousal can be labeled as DIFFERENT emotions depending on context.` },
    { loId: 'appsych.emotion', content: `THE CLASSIC TWO-FACTOR EVIDENCE: participants injected with adrenaline (producing unexplained arousal) felt HAPPY when placed with a euphoric confederate but ANGRY when placed with an irritated confederate. Identical arousal, different emotions — arousal supplies the INTENSITY, cognition supplies the SPECIFIC emotion. This is exactly the two-factor prediction: arousal alone is ambiguous and must be interpreted.` },
    { loId: 'appsych.emotion', content: `LAZARUS APPRAISAL THEORY: a COGNITIVE APPRAISAL — often near-instant, even unconscious — of whether a situation is threatening comes FIRST and DETERMINES the emotion. Thinking precedes and shapes feeling. ZAJONC countered that some emotional reactions occur BEFORE any conscious thought — the "feeling vs thinking" debate. Know both names as a contrast pair.` },
    { loId: 'appsych.emotion', content: `FACIAL-FEEDBACK HYPOTHESIS: facial expressions don't just DISPLAY emotion — they can INFLUENCE it. Making an expression (e.g., smiling) can intensify or even trigger the corresponding feeling. This supports a James-Lange-style "BODY AFFECTS EMOTION" direction of causation.` },
    { loId: 'appsych.emotion', content: `THE AUTONOMIC NERVOUS SYSTEM in emotion: the SYMPATHETIC branch produces the arousal of strong emotion — racing heart, sweating, dilated pupils ("fight or flight"); the PARASYMPATHETIC branch CALMS the body afterward. Because most emotions share SIMILAR general arousal, cognitive LABELS (two-factor theory) do the work of telling emotions apart.` },
    { loId: 'appsych.emotion', content: `UNIVERSAL EMOTIONS vs DISPLAY RULES: the basic emotional EXPRESSIONS — happiness, sadness, fear, anger, surprise, disgust — are recognized ACROSS cultures (Ekman's evidence for biological universality, NATURE). But DISPLAY RULES — cultural norms about WHEN and HOW MUCH emotion to express — vary widely (NURTURE). The expression is universal; the rules for showing it are cultural.` },
    { loId: 'appsych.emotion', kind: 'definition', title: 'two-factor (Schachter-Singer) theory', content: `emotion = physiological arousal + a cognitive label for that arousal; same arousal, different labels → different emotions.` },
    { loId: 'appsych.emotion', kind: 'definition', title: 'facial-feedback hypothesis', content: `facial expressions can influence the emotions a person feels, not just display them.` },
    { loId: 'appsych.emotion', kind: 'definition', title: 'display rules', content: `culturally specific norms for when and how much emotion should be expressed.` },
  ],
  methods: [
    {
      title: 'State each theory’s order for a single stimulus',
      steps: [
        `STEP 1 — Fix a concrete stimulus (a snarling dog) and list the three ingredients: arousal, cognition, emotion.`,
        `STEP 2 — JAMES-LANGE: dog → BODILY AROUSAL first (heart races, you back away) → you INFER fear FROM the bodily response. Arousal precedes and CAUSES the emotion.`,
        `STEP 3 — CANNON-BARD: dog → arousal AND fear SIMULTANEOUSLY and independently — racing heart and felt fear at the same time, neither causing the other.`,
        `STEP 4 — SCHACHTER-SINGER: dog → AROUSAL → COGNITIVE LABEL from the situation ("a snarling dog — this is danger") → FEAR. Arousal plus label together produce the specific emotion.`,
        `STEP 5 — (If asked) LAZARUS: the APPRAISAL ("that dog is a threat") comes FIRST and determines the emotion — cognition before everything.`,
      ],
      example: { problem: `For a person who sees a snarling dog, state the order of arousal, cognition, and emotion under (a) James-Lange, (b) Cannon-Bard, and (c) Schachter-Singer.`, solution: `(a) James-Lange: body first, emotion inferred from it. (b) Cannon-Bard: arousal and emotion simultaneous and independent. (c) Schachter-Singer: arousal, then a cognitive label, then the emotion.` },
      relatedLoIds: ['appsych.emotion'],
    },
    {
      title: 'Interpret an arousal-plus-label experiment',
      steps: [
        `STEP 1 — Spot the design: the SAME physiological arousal (an adrenaline injection) paired with DIFFERENT contexts (euphoric vs irritated confederate).`,
        `STEP 2 — Read the result: participants felt HAPPY with the euphoric confederate and ANGRY with the irritated one — identical arousal, different emotions.`,
        `STEP 3 — Name the theory: this supports SCHACHTER-SINGER TWO-FACTOR, whose signature prediction is that ambiguous arousal must be INTERPRETED. The cognitive LABEL (drawn from the social situation) determined the emotion; arousal supplied intensity, cognition supplied the specific emotion.`,
        `STEP 4 — Connect the complementary mechanism: the FACIAL-FEEDBACK hypothesis is a parallel body-to-emotion route — adopting an expression (smiling, frowning) can feed back and intensify or induce the corresponding feeling.`,
      ],
      example: { problem: `Participants injected with adrenaline felt happy with a euphoric confederate but angry with an irritated one. Which theory does this support, what role did the cognitive label play, and how does facial feedback complement it?`, solution: `Supports Schachter-Singer two-factor: same arousal + different situational labels → different emotions. The label turned ambiguous arousal into a specific emotion. Facial feedback is a complementary body-shapes-emotion mechanism: the expression itself can intensify or induce the feeling.` },
      relatedLoIds: ['appsych.emotion'],
    },
  ],
  pointers: [
    { content: `James-Lange: body FIRST, emotion inferred. "Afraid because you're running."`, kind: 'tip' },
    { content: `Cannon-Bard: arousal and emotion SIMULTANEOUS and independent.`, kind: 'tip' },
    { content: `Schachter-Singer: arousal + cognitive LABEL = emotion. Same arousal, different label, different emotion.`, kind: 'tip' },
    { content: `Lazarus: appraisal first (thinking before feeling); Zajonc: some feelings beat thought. Know the contrast.`, kind: 'tip' },
    { content: `Sympathetic = fight-or-flight arousal; parasympathetic = calm-down. Most emotions share similar arousal.`, kind: 'tip' },
    { content: `Ekman's six expressions are universal (nature); DISPLAY RULES for showing them are cultural (nurture).`, kind: 'tip' },
  ],
};
