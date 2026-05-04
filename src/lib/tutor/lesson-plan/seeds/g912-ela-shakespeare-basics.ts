/**
 * Grades 9-12 ELA — Shakespeare Basics.
 */

import type { LessonPlan } from '../types';

export const SEED_G912_ELA_SHAKESPEARE_BASICS: LessonPlan = {
  id: 'evelyn.g912.ela.shakespeare-basics.v1',
  title: 'Grades 9-12 ELA — Shakespeare Play Analysis',
  curriculum: 'CCSS',
  grade: '9-12',
  subject: 'ela',
  topic: 'g912-ela',
  locale: 'en',
  los: [
    {
      id: 'g912.ela.shakespeare-basics',
      description: 'Analyse Shakespearean plays: language conventions, structure (acts, scenes), genres (tragedy, comedy, history), and major themes.',
      standard: 'CCSS.ELA-LITERACY.RL.9-10.5',
    },
  ],
  prerequisites: ['g912.ela.literature-periods'],
  followUps: ['g912.ela.poetry-analysis'],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Shakespeare\'s language looks foreign — but it follows patterns. Once you know them, the plays become accessible.',
      script: 'Iambic pentameter. Five-act structure. "Thee" and "thou". These are the conventions of Shakespeare\'s plays. Beneath the language, the human concerns are universal — love, jealousy, ambition, betrayal. Today we drill the conventions that unlock the language.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-shakespeare',
      kind: 'concept',
      goal: 'Language + structure + genres + key themes.',
      keyIdeas: [
        'GENRES: Tragedy (ends in death of major characters: Macbeth, Hamlet, Othello, King Lear, Romeo and Juliet). Comedy (ends in marriage / restored order: Much Ado, Twelfth Night, Midsummer Night\'s Dream). History (English kings: Henry V, Richard III).',
        'STRUCTURE: 5 acts. Act 1 = exposition. Act 2 = rising action. Act 3 = climax. Act 4 = falling action. Act 5 = resolution. Aligns with Freytag\'s pyramid.',
        'IAMBIC PENTAMETER: 10 syllables per line, alternating unstressed/stressed: da-DUM, da-DUM, da-DUM, da-DUM, da-DUM. "But SOFT, what LIGHT through YONder WINdow BREAKS?" Standard speech for noble characters.',
        'PROSE vs VERSE: noble/serious characters speak in verse. Common/comic characters often speak in prose.',
        'ARCHAIC LANGUAGE: thee, thou, thy, thine, hath, doth. "Wherefore" = why (not where). "Methinks" = I think.',
        'COMMON DEVICES: soliloquy (speech to audience alone), aside (brief remark not heard by others on stage), dramatic irony, allusion, wordplay/puns.',
        'MAJOR THEMES across plays: ambition\'s costs (Macbeth), revenge (Hamlet), love\'s power and folly (Romeo and Juliet, Midsummer), order and chaos (King Lear), appearance vs reality (Othello), gender and disguise (Twelfth Night).',
        'READING TIP: read aloud. Shakespeare wrote for performance, not silent reading. Rhythm + character voices help comprehension.',
      ],
      vocabulary: [
        { term: 'soliloquy', definition: 'a speech delivered alone on stage, revealing a character\'s thoughts to the audience.' },
        { term: 'iambic pentameter', definition: 'a line of 10 syllables in 5 da-DUM beats; Shakespeare\'s standard verse form.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-soliloquy',
      kind: 'worked_example',
      problem: 'Why is Hamlet\'s "To be, or not to be" speech a SOLILOQUY?',
      steps: [
        'Setting: Hamlet is alone on stage. No other character can hear him.',
        'Function: he speaks his thoughts aloud — for the audience\'s benefit.',
        'Content: contemplation of suicide, the unknown of death, the pain of life.',
        'Why soliloquy: shows internal conflict that DIALOGUE couldn\'t reveal. The audience gains direct access to Hamlet\'s mind.',
        'Effect: builds intimacy with character; deepens psychological complexity that defines the play.',
      ],
      answer: 'Soliloquy — alone on stage, internal conflict revealed to audience.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Identify the genre: a play in which two young lovers from feuding families die at the end.',
      expectedAnswer: 'Tragedy — major characters die.',
      responseFormat: 'free',
      hints: [
        'What genre ends in death of main characters?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-archaic',
      kind: 'misconception_check',
      question: 'A student insists "wherefore art thou Romeo" means "where are you, Romeo?" Why is this wrong?',
      commonErrors: [
        {
          answer: '"Wherefore" = where',
          misconception: 'Confusing "wherefore" with "where" by sound similarity.',
          correctsTo: '"Wherefore" means WHY, not where. Juliet is asking WHY Romeo must be a Montague (her family\'s enemy), not where he is. Knowing the archaic vocabulary changes the line\'s meaning entirely. Other false friends: "fair" can mean beautiful, just, or pale-skinned. "Cousin" can mean any relative. Always check archaic dictionaries when in doubt.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Genres: Tragedy, Comedy, History.',
        '5-act structure; Act 3 = climax.',
        'Iambic pentameter for nobility; prose for commoners.',
        'Soliloquy = alone, reveals thought. Aside = brief, unheard by others.',
        'Read aloud; archaic vocabulary requires patience.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why has Shakespeare endured for 400+ years?',
      hint: 'Universal themes (jealousy, ambition, love, betrayal) cross cultures. Psychological depth — characters feel like real people. Language richness — even when archaic, the imagery and metaphor stun. Theatrical effectiveness — written for performance, the plays come alive on stage. Adaptability — translated, adapted to film, set in modern times. The combination keeps Shakespeare current despite the centuries.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
