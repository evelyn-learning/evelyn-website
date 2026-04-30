/**
 * G10 — Intro to Shakespeare and dramatic structure.
 *
 * Why Shakespeare matters, how to read the language, five-act
 * structure, soliloquy vs aside, blank verse.
 */

import type { LessonPlan } from '../types';

export const SEED_G10_ELA_SHAKESPEARE_INTRO: LessonPlan = {
  id: 'evelyn.g10.ela.drama.shakespeare-intro.v1',
  title: 'Reading Shakespeare: language, structure, devices',
  curriculum: 'CCSS',
  grade: '10',
  subject: 'ela',
  topic: 'drama',
  locale: 'en',
  los: [
    {
      id: 'ccss.ela.9-10.rl.4',
      description: 'Determine the meaning of words and phrases as they are used in the text, including figurative meanings; analyze impact of word choices on tone.',
      standard: 'CCSS.ELA-LITERACY.RL.9-10.4',
    },
  ],
  prerequisites: [],
  followUps: ['ccss.ela.11-12.rl.4'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Reframe Shakespeare from "old hard text" to "designed for the ear".',
      script: 'Shakespeare wasn\'t writing for SCHOLARS. He wrote for ROWDY audiences in 1600 — including poor people who paid a penny to stand in front of the stage. His plays were entertainment. The language is hard NOW because English changed. The drama is timeless.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-conventions',
      kind: 'concept',
      goal: 'Five-act structure + soliloquy/aside + blank verse + reading strategy.',
      keyIdeas: [
        'FIVE-ACT STRUCTURE (Freytag\'s pyramid): I) Exposition (setup), II) Rising action (conflict develops), III) Climax (turning point), IV) Falling action (consequences), V) Resolution.',
        'SOLILOQUY: a long speech where a character is alone on stage (or thinks they are) — speaking their inner thoughts aloud. Famous example: Hamlet\'s "To be or not to be."',
        'ASIDE: a short remark a character makes directly to the audience while others on stage "can\'t hear". Reveals secrets the other characters don\'t know.',
        'BLANK VERSE: unrhymed iambic pentameter. Most of Shakespeare\'s plays. iam-bic = unstressed/STRESSED rhythm. Pentameter = 5 such pairs per line. ("But SOFT! What LIGHT through YON-der WIN-dow BREAKS?")',
        'PROSE vs VERSE: nobles speak verse; commoners often speak prose. Shifts can signal emotion or status.',
        'READING STRATEGY: 1) Read aloud — Shakespeare is meant for the ear. 2) Look up archaic words (thee, thou, hath, methinks). 3) Don\'t panic at long sentences — they often have one main verb buried in clauses.',
      ],
      vocabulary: [
        { term: 'soliloquy', definition: 'a long speech by a character alone on stage, revealing inner thoughts.' },
        { term: 'aside', definition: 'a brief remark to the audience that other characters supposedly can\'t hear.' },
        { term: 'blank verse', definition: 'unrhymed iambic pentameter — Shakespeare\'s usual line.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-soliloquy',
      kind: 'worked_example',
      problem: 'In Hamlet\'s "To be or not to be" soliloquy, what is Hamlet wrestling with, and why is it a SOLILOQUY rather than dialogue?',
      steps: [
        'Hamlet is debating SUICIDE — whether life\'s suffering is worth enduring or ending.',
        'It\'s a SOLILOQUY because he\'s ALONE on stage, speaking aloud to himself.',
        'Why this form? Soliloquies let Shakespeare share inner conflict that no character would say aloud to others.',
        'Audience effect: we hear Hamlet\'s most private thoughts — creating intimacy and dramatic tension.',
        'In life people don\'t debate suicide aloud — but in DRAMA, soliloquy is the convention for revealing what would otherwise be invisible.',
      ],
      answer: 'wrestling with whether to live; soliloquy lets us hear his private inner debate',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Identify the iambic rhythm: "Shall I compare thee to a summer\'s day?" Mark the stressed syllables.',
      expectedAnswer: 'shall I com-PARE thee TO a SUM-mer\'s DAY (stresses: pare, to, sum-, day, plus first I)',
      responseFormat: 'free',
      hints: [
        'Iambic pentameter: 5 pairs of unstressed/STRESSED.',
        'Try saying it as a beat: da-DUM, da-DUM, da-DUM, da-DUM, da-DUM.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-shakespeare-old-english',
      kind: 'misconception_check',
      question: 'Did Shakespeare write in OLD English?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Confusing eras of English.',
          correctsTo: 'No — Shakespeare wrote in EARLY MODERN ENGLISH (~1600). It\'s the SAME language we speak now, just 400 years older. OLD ENGLISH (~800 CE, Beowulf) is unreadable to us. MIDDLE ENGLISH (~1300, Chaucer) is hard but somewhat readable. Shakespeare is just modern English with archaic words and grammar.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Five-act structure: exposition, rising action, climax, falling action, resolution.',
        'Soliloquy = alone on stage, inner thoughts. Aside = quick to audience.',
        'Blank verse = unrhymed iambic pentameter.',
        'Read aloud, look up archaic words, untangle long sentences.',
        'Shakespeare is EARLY MODERN English, not Old English.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why are Shakespeare\'s plays still performed 400 years later when most plays of his time are forgotten?',
      hint: 'Universal themes (love, power, betrayal, jealousy), psychological depth, language that gave English ~1700 new words and phrases. Most contemporaries were topical — Shakespeare wrote about the human condition.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
