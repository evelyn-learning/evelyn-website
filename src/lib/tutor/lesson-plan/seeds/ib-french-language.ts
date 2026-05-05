import type { LessonPlan } from '../types';

export const SEED_IB_FRENCH_LANGUAGE: LessonPlan = {
  id: 'evelyn.ibdp.french.v1',
  title: 'IB French — text-type analysis',
  curriculum: 'IBDP',
  grade: '11',
  subject: 'languages',
  topic: 'ib-french',
  locale: 'en',
  los: [
    { id: 'ibdp.fr.text-type', description: 'Recognize and produce in major IB French text types (article, blog, letter, speech).', standard: 'IB-FRENCH-B' },
  ],
  prerequisites: ['lang910.fr.composed-imparfait'],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame IB French B as text-type-driven (parallel to IB Spanish).',
      script: 'IB French B exam tests whether you can read and produce different text types in the right register. Same idea as IB Spanish — vocabulary level, tu/vous, and structural conventions all shift between an article, a blog, and a formal letter.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-text-types-fr',
      kind: 'concept',
      goal: 'Text types + register markers in French.',
      keyIdeas: [
        'ARTICLE DE PRESSE: 3rd person, passé composé / présent for ongoing facts, neutral. Title (titre) + chapeau (intro paragraph) + body.',
        'BLOG: 1st person, présent, casual vocabulary, hashtags / categories / call to engage at end.',
        'LETTRE FORMELLE: "Madame, Monsieur" opening; vouvoiement (vous); subjunctive after polite phrases; closing "Veuillez agréer, Madame, Monsieur, l\'expression de mes salutations distinguées".',
        'LETTRE / EMAIL INFORMEL: "Salut Lisa", tu forms, contractions, "Bisous / À bientôt / Bises" closings.',
        'DISCOURS: direct audience address, repetition, rhetorical questions, present + future tenses for action.',
        'REGISTRE markers: vous vs tu, soutenu vs courant vs familier vocabulary, no contractions / slang in soutenu.',
      ],
      vocabulary: [
        { term: 'soutenu', definition: 'elevated / formal register.' },
        { term: 'familier', definition: 'casual / colloquial register.' },
        { term: 'vouvoyer', definition: 'to address someone with vous (formal).' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-rewrite',
      kind: 'worked_example',
      problem: 'Rewrite "Coucou ! J\'ai trop kiffé le concert hier soir" in formal-letter register.',
      steps: [
        '"Coucou !" (very informal opening) → "Madame, Monsieur" or "Cher Monsieur".',
        '"trop kiffé" (slang) → "beaucoup apprécié" (proper verb + adverb).',
        '"hier soir" stays.',
        'Result: "Madame, Monsieur, j\'ai beaucoup apprécié le concert d\'hier soir. Veuillez agréer..."',
        'Same meaning, different register.',
      ],
      answer: 'Madame, Monsieur, j\'ai beaucoup apprécié le concert d\'hier soir. ...',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'For an ARTICLE de presse, which register do you choose: soutenu, courant, or familier?',
      expectedAnswer: 'courant (neutral) — articles aim at general readership, neither slangy nor pompous',
      responseFormat: 'free',
      hints: [
        'Newspapers prioritize accessibility.',
        'Soutenu would be too elevated; familier would be unprofessional.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Text type drives register.',
        'Formal: vous, no contractions, soutenu vocab.',
        'Informal: tu, contractions, familier vocab.',
        'Each type has its conventional opening and closing.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
