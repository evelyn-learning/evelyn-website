/**
 * AP Lit — Romanticism (literary period).
 *
 * Late 18th to mid-19th century. Imagination, nature, the individual, the sublime.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_LIT_ROMANTICISM: LessonPlan = {
  id: 'evelyn.ap.lit.romanticism.v1',
  title: 'Romanticism in Literature',
  curriculum: 'CollegeBoard',
  grade: '11',
  subject: 'ela',
  topic: 'ap-english-lit',
  locale: 'en',
  los: [
    {
      id: 'aplit.romanticism',
      description: 'Identify Romantic features (imagination, nature, individualism, the sublime) and analyze how they shape meaning in canonical poetry and novels.',
      standard: 'AP-LIT-CHR-1',
    },
  ],
  prerequisites: ['aplit.literary-elements'],
  followUps: ['aplit.victorian'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Romanticism as a turn from reason to feeling.',
      script: 'The 18th century worshiped reason — clean, balanced, knowable. Romanticism reacted by saying: there\'s more. Imagination, raw nature, terror, awe, the inner life of the individual. A storm wasn\'t weather, it was sublime. A daffodil could move you to tears. The Romantics gave us the modern idea of the artist as a sensitive soul tuned to currents most people miss.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-features',
      kind: 'concept',
      goal: 'Defining features of Romanticism.',
      keyIdeas: [
        'TIME PERIOD: roughly 1789 (French Revolution) to 1850. Reaction against the Enlightenment and the Industrial Revolution.',
        'IMAGINATION over reason. The poet\'s mind isn\'t just receiving the world — it\'s creating meaning. Coleridge: imagination is "the living power and prime agent of all human perception".',
        'NATURE as sacred and instructive. Wordsworth\'s daffodils, Coleridge\'s landscapes, Thoreau\'s pond. Nature reveals truth that civilization obscures. Often contrasted with the "dark Satanic Mills" of industrialization (Blake).',
        'THE SUBLIME: experiences of awe, terror, vastness — mountains, storms, the ocean. Beautiful is pleasing; sublime is overwhelming. Burke and Kant theorized; the Romantics dramatized.',
        'INDIVIDUALISM: the lone soul facing nature, fate, society. The Byronic hero — flawed, brooding, charismatic, in conflict with norms. Frankenstein\'s creator and creature both.',
        'EMOTION + INTUITION over logic. "Emotion recollected in tranquility" (Wordsworth). The truth of feeling, not just facts.',
        'INTEREST IN THE EXOTIC + MEDIEVAL: Coleridge\'s "Kubla Khan", Keats\'s odes, Scott\'s historical novels. Past and far-away as escapes from industrial present.',
        'GOTHIC overlap: ruins, ghosts, madness, transgression. Frankenstein, Edgar Allan Poe, Brontë. The Gothic is Romanticism\'s shadow.',
        'KEY AUTHORS: Wordsworth, Coleridge, Blake, Keats, Shelley, Byron, Mary Shelley (in UK). Emerson, Thoreau, Whitman, Poe, Hawthorne (in US — usually called Transcendentalism / American Romanticism).',
      ],
      vocabulary: [
        { term: 'sublime', definition: 'an aesthetic experience of awe and terror at vast or powerful natural forces.' },
        { term: 'Byronic hero', definition: 'a flawed, brooding, charismatic outsider in conflict with society.' },
        { term: 'Transcendentalism', definition: 'American Romantic movement (Emerson, Thoreau) emphasizing intuition, nature, and self-reliance.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-wordsworth',
      kind: 'worked_example',
      problem: 'Analyze how Wordsworth\'s "I Wandered Lonely as a Cloud" embodies Romantic features.',
      steps: [
        'NATURE as primary subject: a field of daffodils, observed in solitude. Not industrial, not civilized — wild.',
        'IMAGINATION + EMOTION: the speaker recalls the daffodils later "in vacant or in pensive mood" and his "heart with pleasure fills". The recollection is the experience — Wordsworth\'s "emotion recollected in tranquility".',
        'INDIVIDUALISM: "I wandered lonely". The individual, alone, is the lens. Not a community, not a court — one consciousness encountering nature.',
        'SUBLIME (mild form): "ten thousand saw I at a glance" — the overwhelming abundance briefly overpowers the speaker.',
        'TRUTH FROM NATURE: the daffodils give the speaker a permanent imaginative resource — "the bliss of solitude". Nature teaches what civilization cannot.',
      ],
      answer: 'The poem hits four Romantic notes: nature as primary, imagination + emotion driving recollection, the solitary observer, and nature teaching the individual.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why is Mary Shelley\'s "Frankenstein" considered both Romantic and Gothic?',
      expectedAnswer: 'Romantic: Frankenstein\'s individualistic, imaginative striving; sublime Alpine landscapes; rebellion against authority. Gothic: a doomed scientist creating a monster, ruined castles, dread of the supernatural, transgression of natural laws.',
      responseFormat: 'free',
      hints: [
        'Romantic features: ambition, nature, the individual.',
        'Gothic features: dread, ruins, monstrous creation.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-romance',
      kind: 'misconception_check',
      question: 'Is Romanticism the literary movement about romantic love stories?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Confusing the literary period with the modern genre "romance".',
          correctsTo: 'No. Romanticism is a movement (~1789–1850) emphasizing imagination, nature, the sublime, and individualism — NOT especially love stories. The word comes from "romance" in the medieval sense (epic / chivalric tales), not "romantic" in the dating sense. A Romantic poem about a thunderstorm is more typical than one about boy-meets-girl.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Romanticism = ~1789–1850. Reaction against Enlightenment + Industrial Rev.',
        'Features: imagination > reason, nature as sacred, the sublime, the lone individual.',
        'Key authors: Wordsworth, Coleridge, Blake, Keats, Shelley, Byron, Mary Shelley; American: Emerson, Thoreau, Whitman, Poe.',
        'Gothic overlaps. Don\'t confuse the period with "romance" the genre.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why did the French Revolution influence Romanticism so deeply?',
      hint: 'The Revolution embodied Romantic ideals: individual rights, rebellion against tradition, hope for a new order. Wordsworth and Coleridge were initial supporters. When the Revolution turned to terror, many Romantics turned inward — from political revolution to imaginative revolution. The arc shapes the period\'s emotional intensity.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
