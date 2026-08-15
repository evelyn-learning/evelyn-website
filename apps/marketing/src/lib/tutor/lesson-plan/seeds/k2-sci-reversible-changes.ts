/**
 * K-2 Science — Reversible and Irreversible Changes.
 *
 * NGSS 2-PS1-4: construct an argument with evidence that some
 * changes caused by heating or cooling can be reversed and some
 * cannot. Concrete examples: ice melting (reversible), egg cooking
 * (not reversible), water freezing (reversible), wood burning (not
 * reversible).
 *
 * Source: NGSS 2-PS1, OpenStax K-2 Science.
 */

import type { LessonPlan } from '../types';

export const SEED_K2_SCI_REVERSIBLE_CHANGES: LessonPlan = {
  id: 'evelyn.k2.science.matter.reversible-changes.v1',
  title: 'Changes That Can Reverse — and Ones That Can\'t',
  curriculum: 'NGSS',
  grade: 'K-2',
  subject: 'science',
  topic: 'matter',
  locale: 'en',
  los: [
    {
      id: 'ngss.2-ps1-4',
      description: 'Construct an argument with evidence that some changes caused by heating or cooling can be reversed and some cannot.',
      standard: 'NGSS.2-PS1-4',
    },
  ],
  prerequisites: ['ngss.2-ps1-1'],
  followUps: ['ngss.5-ps1-4'],
  estimatedMinutes: 12,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set up the contrast between two everyday changes.',
      script: 'You take an ice cube out of the freezer. It melts into water. Easy fix — put it back, freeze it again. But cook an egg in a frying pan. Can you "un-cook" the egg back to raw? Why is one change easy to reverse and the other one isn\'t?',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-two-kinds',
      kind: 'concept',
      goal: 'Some changes can go BACK (reversible). Some changes are stuck (irreversible).',
      keyIdeas: [
        'REVERSIBLE — the change can be UNDONE. Ice ↔ water ↔ steam: just heat or cool to switch.',
        'IRREVERSIBLE — the change is PERMANENT. Once you cook an egg, you can\'t un-cook it.',
        'Heating + cooling alone often makes REVERSIBLE changes (melting, freezing, boiling).',
        'Bigger transformations — burning, cooking, mixing things that combine — are usually IRREVERSIBLE.',
      ],
      vocabulary: [
        { term: 'reversible', definition: 'a change that can be undone.' },
        { term: 'irreversible', definition: 'a change that is permanent.' },
      ],
      suggestedTools: ['show_labeled_image'],
      estimatedMinutes: 3,
    },
    {
      id: 'worked-melting-vs-burning',
      kind: 'worked_example',
      problem: 'Two changes happen with heat: (1) chocolate melts in your hand, (2) wood burns in a fireplace. Which is reversible? Which is not?',
      steps: [
        'CHOCOLATE MELTING: chocolate goes from solid → liquid. Put it back in the fridge → solid again. REVERSIBLE.',
        'WOOD BURNING: wood + oxygen → ash + smoke + heat. The wood is GONE. You can\'t take ash back to wood. IRREVERSIBLE.',
        'Heat caused both. But melting is just changing form (still chocolate). Burning makes new STUFF (ash isn\'t wood).',
      ],
      answer: 'Chocolate melting is reversible. Wood burning is irreversible.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'You leave a glass of water in the freezer overnight. In the morning, it\'s a block of ice. Later, you take the ice out and let it sit on the counter. What happens, and is this change reversible?',
      expectedAnswer: 'The ice melts back into water. Yes — this change is reversible (you can keep going freezer ↔ counter forever).',
      responseFormat: 'free',
      hints: [
        'Cool → solid (ice). Warm → liquid (water).',
        'Can you switch back and forth between them?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-everything-reversible',
      kind: 'misconception_check',
      question: 'A friend says "everything that gets messed up by heat can be fixed by cooling." Is that always true?',
      commonErrors: [
        {
          answer: 'Yes — cool it down and it goes back.',
          misconception: 'Generalizing "cooling reverses heating" to all heat-related changes.',
          correctsTo: 'Cooling reverses changes like melting and boiling — but not chemical changes like cooking or burning. Once an egg cooks, no amount of cooling brings the raw egg back. The proteins inside the egg permanently changed shape when heated.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Reversible changes can be undone (ice ↔ water).',
        'Irreversible changes are permanent (cooking, burning).',
        'Just changing form (state) is usually reversible. Making NEW stuff is usually not.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
