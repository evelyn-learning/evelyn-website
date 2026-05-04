/**
 * Grades 9-12 ELA — Literature Periods (Literary Movements).
 */

import type { LessonPlan } from '../types';

export const SEED_G912_ELA_LITERATURE_PERIODS: LessonPlan = {
  id: 'evelyn.g912.ela.literature-periods.v1',
  title: 'Grades 9-12 ELA — Literature Periods',
  curriculum: 'CCSS',
  grade: '9-12',
  subject: 'ela',
  topic: 'g912-ela',
  locale: 'en',
  los: [
    {
      id: 'g912.ela.literature-periods',
      description: 'Identify major literary periods and movements; recognise their characteristic concerns, styles, and historical contexts.',
      standard: 'CCSS.ELA-LITERACY.RL.11-12.9',
    },
  ],
  prerequisites: ['g912.ela.analytical-essay'],
  followUps: ['g912.ela.shakespeare-basics'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'A novel from 1820 reads VERY differently from one written in 1920 or 2020 — knowing the period unlocks the work.',
      script: 'Wuthering Heights and The Great Gatsby and Beloved are all great novels, but they emerge from different worlds. Romantic, Modernist, Postmodern. Each period asks different questions and uses different techniques. Today we map the periods that show up in high-school courses.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-periods',
      kind: 'concept',
      goal: 'Major literary periods + characteristic concerns + key authors.',
      keyIdeas: [
        'CLASSICAL (Antiquity to ~5th c. CE): Greek and Roman epic, drama, philosophy. Homer, Virgil, Plato, Sophocles. Concerns: heroism, fate, civic virtue.',
        'MEDIEVAL (~5th-15th c.): religious allegory, romance. Dante, Chaucer. Concerns: salvation, chivalry, hierarchy.',
        'RENAISSANCE (~14th-17th c.): humanism, individual experience. Shakespeare, Milton. Concerns: human potential, classical revival.',
        'ENLIGHTENMENT (17th-18th c.): reason, satire, neoclassicism. Swift, Voltaire. Concerns: rationalism, social critique.',
        'ROMANTIC (~1800-1850): emotion, nature, individualism. Wordsworth, Brontes, Poe. Concerns: imagination, sublime nature, the inner life.',
        'REALIST/VICTORIAN (~1850-1900): everyday life, social conditions. Dickens, Eliot, Tolstoy. Concerns: industrial society, moral complexity.',
        'MODERNIST (~1900-1945): experimentation, fragmentation, alienation. Joyce, Woolf, Eliot, Hemingway. Concerns: post-war disillusionment, breakdown of tradition.',
        'POSTMODERN (~1945-present): metafiction, irony, pastiche. Borges, Pynchon, Morrison. Concerns: reality as constructed, identity, marginalised voices.',
        'CONTEMPORARY: ongoing. Diverse global voices. Concerns: identity, technology, climate, post-colonial reckoning.',
        'PERIODS OVERLAP and exceptions abound. Use period as orientation, not strict label.',
      ],
      vocabulary: [
        { term: 'Modernism', definition: 'literary movement (~1900-1945) marked by experimentation, fragmentation, and disillusionment.' },
        { term: 'Romanticism', definition: 'literary movement (~1800-1850) emphasising emotion, nature, and individual experience.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-period',
      kind: 'worked_example',
      problem: 'A novel features a protagonist who flees the city to walk through wild moors, finding sublime feeling in storms and rejecting industrial society. Which period and why?',
      steps: [
        'CLUES: nature emphasis, sublime feeling, rejection of industrial society, individual emotion.',
        'These match ROMANTIC period concerns.',
        'Likely 1800-1850 setting and authorship.',
        'Examples in this style: Brontes\' Wuthering Heights, Wordsworth\'s poetry, Mary Shelley\'s Frankenstein.',
        'Confirmation: Romantic writers reacted against Enlightenment rationalism with emotional, nature-centred art.',
      ],
      answer: 'Romantic period — emotional individualism + sublime nature.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A novel uses fragmented timelines, multiple narrators, and refuses to provide a clear resolution. Which broad period?',
      expectedAnswer: 'Modernist (or Postmodernist) — experimentation with form, fragmentation, ambiguous endings.',
      responseFormat: 'free',
      hints: [
        'Fragmented form is the giveaway.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-period-rigidity',
      kind: 'misconception_check',
      question: 'A student insists every novel must fit cleanly into one literary period. Why is this naive?',
      commonErrors: [
        {
          answer: 'Every novel = one period',
          misconception: 'Treating literary periods as rigid containers.',
          correctsTo: 'Periods overlap, transition slowly, and many works defy easy classification. A 1900 novel may carry Realist conventions AND early Modernist experiments. Authors don\'t consult period labels when writing. Use periods as a USEFUL ORIENTATION, not a prison. Strong analysis notes period elements while acknowledging complexity.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Major periods: Classical, Medieval, Renaissance, Enlightenment, Romantic, Realist, Modernist, Postmodern, Contemporary.',
        'Each has characteristic concerns and styles.',
        'Periods overlap; use as orientation, not strict label.',
        'Knowing the period helps interpret a work in context.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why might a single author bridge two periods?',
      hint: 'Authors writing during a transition often blend old and new. Henry James (late 19th-early 20th c.) wrote with Realist concerns but Modernist subtlety. T.S. Eliot critiqued tradition through Modernist fragmentation while invoking ancient texts. Long careers cross movements; literary history is messier than period boundaries suggest. Naming a period for a single author can require nuance.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
