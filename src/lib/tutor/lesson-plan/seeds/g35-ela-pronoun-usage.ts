/**
 * Grades 3-5 ELA — Pronoun Usage.
 */

import type { LessonPlan } from '../types';

export const SEED_G35_ELA_PRONOUN_USAGE: LessonPlan = {
  id: 'evelyn.g35.ela.pronoun-usage.v1',
  title: 'Grades 3-5 ELA — Pronoun Usage',
  curriculum: 'CCSS',
  grade: '3-5',
  subject: 'ela',
  topic: 'g35-ela',
  locale: 'en',
  los: [
    {
      id: 'g35.ela.pronoun-usage',
      description: 'Use subject, object, and possessive pronouns correctly; ensure pronoun-antecedent agreement.',
      standard: 'CCSS.ELA-LITERACY.L.4.1.A',
    },
  ],
  prerequisites: ['g35.ela.subject-verb-agreement'],
  followUps: ['g35.ela.verb-tenses'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Pronouns make writing flow — but they need to match their antecedents in number and form.',
      script: 'Imagine writing "Sara went to the store. Sara bought apples. Sara walked home." Painful. Pronouns let us replace nouns: "Sara went to the store. SHE bought apples. SHE walked home." Simple, but use the wrong form ("HER went home") and it falls apart.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-pronouns',
      kind: 'concept',
      goal: 'Pronoun categories + agreement + common errors.',
      keyIdeas: [
        'PRONOUN replaces a NOUN (the antecedent). The antecedent should be CLEAR.',
        'SUBJECT pronouns (perform the action): I, you, he, she, it, we, they.',
        'OBJECT pronouns (receive the action): me, you, him, her, it, us, them.',
        'POSSESSIVE pronouns (show ownership): my/mine, your/yours, his, her/hers, its, our/ours, their/theirs.',
        'PRONOUN-ANTECEDENT AGREEMENT: pronoun must match the antecedent in NUMBER (singular/plural) and PERSON (1st/2nd/3rd).',
        '  "The dog wagged its tail." (singular antecedent → singular pronoun)',
        '  "The dogs wagged their tails." (plural antecedent → plural pronoun)',
        'COMMON ERROR — me vs I: use "me" as object, "I" as subject. Test by removing the other person: "Mom and I went" (I went ✓). "Mom took me" (took me ✓).',
        'COMMON ERROR — its vs it\'s: "its" = belonging to it (possessive). "it\'s" = it is. No apostrophe in possessive.',
        'COMMON ERROR — their/there/they\'re: "their" = belonging to them. "there" = location. "they\'re" = they are.',
        'AMBIGUOUS PRONOUNS: "Sara saw Maya at the store. She was happy." Who was happy? Rewrite to remove ambiguity.',
      ],
      vocabulary: [
        { term: 'pronoun', definition: 'a word that takes the place of a noun (he, she, it, they, etc.).' },
        { term: 'antecedent', definition: 'the noun a pronoun refers back to.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-pronoun',
      kind: 'worked_example',
      problem: 'Choose the correct pronoun: "Mom gave the gift to Sara and ___." (I / me)',
      steps: [
        'Identify the role: who is RECEIVING the gift? Sara and ___ are objects (gift is given TO them).',
        'Object pronouns: me, him, her, us, them.',
        'Test by removing "Sara and": "Mom gave the gift to me." That sounds right. (Compare: "Mom gave the gift to I" — clearly wrong.)',
        'Answer: "me".',
      ],
      answer: '"me"',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Fix this sentence: "Each of the boys forgot their lunch."',
      expectedAnswer: '"Each of the boys forgot HIS lunch." ("Each" is singular → his, not their.)',
      responseFormat: 'free',
      hints: [
        '"Each" is singular even when followed by a plural phrase.',
        'Singular antecedent needs singular pronoun.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-its',
      kind: 'misconception_check',
      question: 'A student writes "Its raining outside." Why is this wrong?',
      commonErrors: [
        {
          answer: '"Its raining"',
          misconception: 'Confusing "its" (possessive) with "it\'s" (it is).',
          correctsTo: '"It\'s raining" = "It is raining" — needs the apostrophe (contraction). "Its" = belonging to it ("the dog wagged its tail"). The trick: substitute "it is". If it works, use "it\'s". If not, use "its". "Its raining" → "It is raining" works → must be "it\'s".',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Subject pronouns: I, he, she, they.',
        'Object pronouns: me, him, her, them.',
        'Possessive: my, his, her, their, its (no apostrophe).',
        'Agreement: pronoun matches antecedent in number.',
        '"Each" / "every" / "no one" = singular.',
        'Test "I/me" by removing other person.',
        'Avoid ambiguous pronouns — rewrite when unclear.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why has "they" become acceptable as a singular pronoun in many cases?',
      hint: 'When the gender of a single antecedent is unknown or unspecified, "they" avoids the awkward "he/she". Example: "Each student should bring their book." Many style guides now accept singular "they". Some prescriptive grammars still prefer "his or her", but usage has shifted toward inclusive singular "they".',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
