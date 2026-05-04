/**
 * Grades 9-12 ELA — Advanced Literary Devices.
 */

import type { LessonPlan } from '../types';

export const SEED_G912_ELA_LITERARY_DEVICES: LessonPlan = {
  id: 'evelyn.g912.ela.literary-devices.v1',
  title: 'Grades 9-12 ELA — Advanced Literary Devices',
  curriculum: 'CCSS',
  grade: '9-12',
  subject: 'ela',
  topic: 'g912-ela',
  locale: 'en',
  los: [
    {
      id: 'g912.ela.literary-devices',
      description: 'Identify and analyse advanced literary devices: irony, allusion, juxtaposition, foreshadowing, paradox.',
      standard: 'CCSS.ELA-LITERACY.RL.11-12.4',
    },
  ],
  prerequisites: ['g912.ela.close-reading'],
  followUps: ['g912.ela.rhetoric-epl'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'High-school literary analysis demands beyond basic figurative language — irony, allusion, paradox give richer ammunition.',
      script: 'Middle school: similes and metaphors. High school: dramatic irony, allusions to mythology, juxtaposition for thematic emphasis. These devices let authors say complex things with elegance and economy. Today we level up your toolkit.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-devices',
      kind: 'concept',
      goal: 'Five high-yield advanced devices + analysis.',
      keyIdeas: [
        'IRONY (3 types): Verbal — saying opposite of what is meant (closer to sarcasm). Situational — outcome opposite of expected. Dramatic — audience knows something characters don\'t.',
        'ALLUSION: brief reference to another work, person, or event (often mythological, biblical, or historical). Compresses meaning by linking to outside context. "He met his Waterloo" alludes to Napoleon\'s defeat.',
        'JUXTAPOSITION: placing contrasting elements side by side for effect. "The mansion stood across the street from the broken-down shack." Contrast highlights themes (wealth vs poverty).',
        'FORESHADOWING: hints at events to come. Often subtle. A creaking door early in a thriller foreshadows danger.',
        'PARADOX: a statement that seems contradictory but contains truth. "Less is more." "I must be cruel to be kind."',
        'OXYMORON: two contradictory words placed together. "Bittersweet", "deafening silence". A focused form of paradox.',
        'SYMBOL vs ALLUSION: symbols arise within the text; allusions reach OUTSIDE the text to other works.',
        'IDENTIFICATION TIPS: read passage twice. First for plot. Second for HOW the author tells it. Devices show themselves on second reading.',
        'ANALYSIS: name the device → explain its effect → tie to theme.',
      ],
      vocabulary: [
        { term: 'dramatic irony', definition: 'when the audience knows something the character does not, creating tension or humour.' },
        { term: 'allusion', definition: 'a brief reference to another work, person, or event that compresses meaning by association.' },
        { term: 'paradox', definition: 'an apparently contradictory statement that nonetheless reveals truth.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-irony',
      kind: 'worked_example',
      problem: 'In "Romeo and Juliet", Romeo drinks poison thinking Juliet is dead, when she\'s actually only sleeping. What type of irony is this and what is its effect?',
      steps: [
        'Type: DRAMATIC IRONY. The audience knows Juliet is alive; Romeo doesn\'t.',
        'Effect: heightens tragic feel. The audience can SEE the disaster coming and is helpless to stop it.',
        'Thematic tie: the play\'s broader theme of fate and miscommunication is amplified — the lovers are undone by what they don\'t know rather than by lack of love.',
        'Analytical claim: "Shakespeare uses dramatic irony to deepen the play\'s tragic effect, making the audience complicit in fate\'s cruelty."',
      ],
      answer: 'Dramatic irony, heightens tragedy, ties to fate theme.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'What type of irony is: "A fire station burns down."?',
      expectedAnswer: 'Situational irony — the outcome is opposite of expected. (Fire stations FIGHT fires, so a fire destroying one is reversed expectation.)',
      responseFormat: 'free',
      hints: [
        'Is the speaker saying the opposite of what they mean? (verbal)',
        'Is the audience aware of something a character isn\'t? (dramatic)',
        'Or is the OUTCOME the opposite of what we\'d expect? (situational)',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-irony-coincidence',
      kind: 'misconception_check',
      question: 'A student calls "It rained on my picnic" ironic. Is this true irony?',
      commonErrors: [
        {
          answer: 'Rain on picnic = irony',
          misconception: 'Treating any unfortunate coincidence as irony.',
          correctsTo: 'Rain on a picnic is unfortunate, not ironic. SITUATIONAL IRONY requires the outcome to be the OPPOSITE of what is expected — and the expectation must come from the situation\'s nature. A fire station burning is ironic because fire stations are SUPPOSED to prevent fires. A picnic getting rained on is just unfortunate. Standard for situational irony: there must be an inherent reversal, not just bad luck.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Three irony types: verbal, situational, dramatic.',
        'Allusion: external reference.',
        'Juxtaposition: contrasting elements side by side.',
        'Foreshadowing: hint at later events.',
        'Paradox / oxymoron: contradiction containing truth.',
        'Analysis: name → effect → theme.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why might a writer use ALLUSION instead of just stating the comparison directly?',
      hint: 'Allusion compresses. "He met his Waterloo" packs in defeat, dignity, military scale, and historical irony in two words. Stating directly ("he experienced a final, decisive defeat after a long career") loses the resonance of association. Allusions reward readers who recognise the reference; they create intimacy and depth that direct statement cannot.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
